
function exportarCSV() {
    try {
        const ops = (window.finanzasData && window.finanzasData.operaciones) ? window.finanzasData.operaciones : [];
        const progs = (window.finanzasData && window.finanzasData.programados) ? window.finanzasData.programados : [];
        const cats = (window.finanzasData && window.finanzasData.categorias) ? window.finanzasData.categorias : [];
        const _catName = (id) => { const c = cats.find(x => x.id === id); return c ? c.name : ''; };
        const _esc = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
        const cabecera = ['fecha','tipo','categoria','etiqueta','importe','nota','estado','id'].join(';');

        const filasOps = ops.map(op => {
            const fecha = op.date ? new Date(op.date).toLocaleDateString('es-ES') : '';
            const tipo = op.type === 'INCOME' ? 'Ingreso' : op.type === 'TRANSFER' ? 'Traspaso' : op.type === 'ADJUST' ? 'Ajuste' : 'Gasto';
            const cat = _catName(op.categoryId);
            const etiqueta = op.subtag || '';
            const importe = op.amount != null ? String(op.amount).replace('.', ',') : '';
            const nota = op.comment || '';
            return [fecha, tipo, cat, etiqueta, importe, nota, 'Realizado', op.id].map(_esc).join(';');
        });

        const filasProgs = progs.map(p => {
            const fecha = p.scheduledDate ? new Date(p.scheduledDate + 'T00:00:00').toLocaleDateString('es-ES') : '';
            const tipo = p.type === 'INCOME' ? 'Ingreso' : 'Gasto';
            const cat = _catName(p.categoryId);
            const etiqueta = p.subtag || '';
            const importe = p.amount != null ? String(p.amount).replace('.', ',') : '';
            const nota = p.comment || '';
            return [fecha, tipo, cat, etiqueta, importe, nota, 'Programado', p.id].map(_esc).join(';');
        });

        const total = ops.length + progs.length;
        const csv = '\uFEFF' + cabecera + '\n' + [...filasOps, ...filasProgs].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const ahora = new Date();
        const f = `${String(ahora.getDate()).padStart(2,'0')}-${String(ahora.getMonth()+1).padStart(2,'0')}-${ahora.getFullYear()}`;
        a.href = url; a.download = `Operaciones (${f}).csv`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
        _mostrarToast && _mostrarToast('table_view', '#10b981', `${total} operaciones exportadas`);
    } catch(e) { alert('Error al exportar CSV: ' + e.message); }
}

async function _guardarSnapImport(etiqueta) {
    try {
        if (typeof _serializarDatos !== 'function' || typeof guardarEnDB !== 'function') return;
        const ts = Date.now();
        const datos = _serializarDatos();
        await guardarEnDB('backup_snap_' + ts, { ts, etiqueta, datos });
    } catch(e) { console.warn('No se pudo guardar snap de importación:', e); }
}
window._nutriSearchBase = {}; // per100g data from last search selection
let _nutriSearchTimer = null;

function _nutriDebouncedSearch(q) {
    clearTimeout(_nutriSearchTimer);
    if (q.length < 2) { _nutriHideSuggestions(); return; }
    _nutriSearchTimer = setTimeout(() => _nutriFetchSuggestions(q), 400);
}

async function _nutriFetchSuggestions(q) {
    const spinner = document.getElementById('nutri-search-spinner');
    const box = document.getElementById('nutri-suggestions');
    const wrapper = document.getElementById('nutri-search-wrapper');
    if (spinner) spinner.style.display = 'block';
    if (box) box.style.display = 'none';
    try {
        // Búsqueda local en IndexedDB (instantánea)
        let products = [];
        if (typeof window._buscarAlimentosLocal === 'function') {
            const results = await window._buscarAlimentosLocal(q);
            products = results.map(r => ({
                product_name: r.n,
                brands: r.m || '',
                nutriments: {
                    'energy-kcal_100g': r.k,
                    'proteins_100g':    r.p || 0,
                    'carbohydrates_100g': r.c || 0,
                    'fat_100g':         r.g || 0,
                }
            }));
        }
        // Fallback a API si IndexedDB no está lista aún
        if (products.length === 0) {
            const url = `https://world.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(q)}&fields=product_name,brands,nutriments&page_size=8&sort_by=unique_scans_n`;
            const res = await fetch(url);
            const data = await res.json();
            products = (data.products || []).filter(p => p.product_name);
        }
        if (products.length === 0) { _nutriHideSuggestions(); return; }
        box.innerHTML = products.map((p,i) => {
            const n = p.product_name + (p.brands ? ` (${p.brands.split(',')[0].trim()})` : '');
            const kcal = Math.round(p.nutriments?.['energy-kcal_100g'] || (p.nutriments?.['energy_100g'] ? p.nutriments['energy_100g']/4.184 : 0) || 0);
            return `<div class="nutri-sugg-item" onmousedown="_nutriSelectSuggestion(${i})" data-idx="${i}"
                style="padding:10px 14px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;justify-content:space-between;align-items:center;gap:8px;">
                <span style="font-size:13px;color:#f1f5f9;font-weight:600;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${n}</span>
                ${kcal ? `<span style="font-size:11px;color:#f97316;font-weight:700;white-space:nowrap;">${kcal} kcal/100g</span>` : ''}
            </div>`;
        }).join('');
        box._products = products;
        if (wrapper) {
            const rect = wrapper.getBoundingClientRect();
            box.style.top = (rect.bottom + 4) + 'px';
            box.style.left = rect.left + 'px';
            box.style.width = rect.width + 'px';
        }
        box.style.display = 'block';
    } catch(e) {
        _nutriHideSuggestions();
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

function _nutriSelectSuggestion(idx) {
    const box = document.getElementById('nutri-suggestions');
    const products = box._products || [];
    const p = products[idx];
    if (!p) return;
    const n = p.nutriments || {};
    window._nutriSearchBase = {
        kcal:   n['energy-kcal_100g'] || (n['energy_100g'] ? n['energy_100g']/4.184 : 0),
        prot:   n['proteins_100g'] || 0,
        carbs:  n['carbohydrates_100g'] || 0,
        grasas: n['fat_100g'] || 0,
    };
    document.getElementById('nutri-input-nombre').value = p.product_name + (p.brands ? ` (${p.brands.split(',')[0].trim()})` : '');
    _nutriHideSuggestions();
    _nutriRecalcularPorCantidad();
}

function _nutriHideSuggestions() {
    const box = document.getElementById('nutri-suggestions');
    if (box) box.style.display = 'none';
}

function _nutriRecalcularPorCantidad() {
    const base = window._nutriSearchBase || {};
    if (!base.kcal && !base.prot && !base.carbs && !base.grasas) return;
    const cant = parseFloat(document.getElementById('nutri-input-cantidad')?.value) || 100;
    const factor = cant / 100;
    const set = (id, val) => { const el = document.getElementById(id); if(el) el.value = val > 0 ? Math.round(val * 10) / 10 : ''; };
    set('nutri-input-kcal',   base.kcal   * factor);
    set('nutri-input-prot',   base.prot   * factor);
    set('nutri-input-carbs',  base.carbs  * factor);
    set('nutri-input-grasas', base.grasas * factor);
    _nutriAutoKcal();
}

function _nutriAutoKcal() {
    const prot  = parseFloat(document.getElementById('nutri-input-prot')?.value)  || 0;
    const carbs = parseFloat(document.getElementById('nutri-input-carbs')?.value) || 0;
    const grasas= parseFloat(document.getElementById('nutri-input-grasas')?.value)|| 0;
    const sugeridas = Math.round((prot * 4) + (carbs * 4) + (grasas * 9));
    const sug = document.getElementById('nutri-kcal-sugerencia');
    const calc = document.getElementById('nutri-kcal-calc');
    if (sugeridas > 0 && sug && calc) {
        calc.textContent = sugeridas + ' kcal';
        sug.style.display = 'block';
    } else if (sug) {
        sug.style.display = 'none';
    }
}

function _nutriAplicarKcalSugerida() {
    const prot  = parseFloat(document.getElementById('nutri-input-prot')?.value)  || 0;
    const carbs = parseFloat(document.getElementById('nutri-input-carbs')?.value) || 0;
    const grasas= parseFloat(document.getElementById('nutri-input-grasas')?.value)|| 0;
    const kcal = Math.round((prot * 4) + (carbs * 4) + (grasas * 9));
    const el = document.getElementById('nutri-input-kcal');
    if (el) { el.value = kcal; el.style.borderColor = 'rgba(16,185,129,0.4)'; setTimeout(()=>el.style.borderColor='rgba(255,255,255,0.1)',1500); }
    const sug = document.getElementById('nutri-kcal-sugerencia');
    if (sug) sug.style.display = 'none';
}
function abrirModalComida() {
    const m = document.getElementById('modalComida');
    if (!m) return;
    window._nutriSearchBase = {};
    document.getElementById('nutri-input-nombre').value = '';
    document.getElementById('nutri-input-cantidad').value = '100';
    document.getElementById('nutri-input-kcal').value = '';
    document.getElementById('nutri-input-prot').value = '';
    document.getElementById('nutri-input-carbs').value = '';
    document.getElementById('nutri-input-grasas').value = '';
    document.getElementById('nutri-input-nota').value = '';
    const sug = document.getElementById('nutri-kcal-sugerencia');
    if (sug) sug.style.display = 'none';
    _nutriHideSuggestions();
    _nutriUnidadPick('g','g — gramos');
    document.querySelectorAll('.nutri-tipo-btn').forEach((b,i) => {
        if (i === 0) { b.classList.add('active'); b.style.borderColor='rgba(16,185,129,0.5)'; b.style.background='rgba(16,185,129,0.15)'; b.style.color='#10b981'; }
        else { b.classList.remove('active'); b.style.borderColor='rgba(255,255,255,0.1)'; b.style.background='rgba(255,255,255,0.04)'; b.style.color='#64748b'; }
    });
    const fd = document.getElementById('nutri-modal-fecha');
    if (fd) { const _d=new Date(); _d.setDate(_d.getDate()+(window._nutriNavOffset||0)); fd.textContent = _d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'}); }
    const inner = document.getElementById('modalComidaInner');
    if (inner) inner.style.maxHeight = Math.floor(window.innerHeight * 0.88) + 'px';
    m.style.display = 'flex';
    setTimeout(() => { const i = document.getElementById('nutri-input-nombre'); if(i) i.focus(); }, 100);
    document.addEventListener('keydown', _nutriEscClose);
}
function cerrarModalComida() {
    const m = document.getElementById('modalComida');
    if (m) m.style.display = 'none';
    _nutriHideSuggestions();
    document.removeEventListener('keydown', _nutriEscClose);
}
(function() {
    var _eCalContainer = null;
    var _eCalHidden    = null;
    var _eCalYear, _eCalMonth;
    var DIAS   = ['L','M','X','J','V','S','D'];
    var MESES  = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    var MESES_C = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    var DIAS_S  = ['dom','lun','mar','mié','jue','vie','sáb'];
    function fmt(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
    function renderECal(){
        if (!_eCalContainer||!_eCalHidden) return;
        var hoy=new Date(); hoy.setHours(0,0,0,0);
        var selKey=_eCalHidden.value||fmt(hoy);
        var firstDay=new Date(_eCalYear,_eCalMonth,1);
        var lastDay =new Date(_eCalYear,_eCalMonth+1,0);
        var startDow=(firstDay.getDay()+6)%7;
        var html='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">'
            +'<button onclick="window._epCalNav(-1)" style="background:none;border:none;color:#60a5fa;cursor:pointer;padding:2px 8px;font-size:20px;line-height:1;">&#8249;</button>'
            +'<span style="color:#f1f5f9;font-size:12px;font-weight:700;">'+MESES[_eCalMonth]+' '+_eCalYear+'</span>'
            +'<button onclick="window._epCalNav(1)" style="background:none;border:none;color:#60a5fa;cursor:pointer;padding:2px 8px;font-size:20px;line-height:1;">&#8250;</button>'
            +'</div>';
        html+='<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px;margin-bottom:2px;">';
        DIAS.forEach(function(d){ html+='<div style="text-align:center;font-size:10px;font-weight:700;color:#334155;padding:3px 0;">'+d+'</div>'; });
        html+='</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px;">';
        for(var i=0;i<startDow;i++) html+='<div></div>';
        for(var d=1;d<=lastDay.getDate();d++){
            var cur=new Date(_eCalYear,_eCalMonth,d);
            var key=fmt(cur);
            var isHoy=cur.getTime()===hoy.getTime();
            var isSel=key===selKey;
            var isFut=cur>hoy;
            var bg='transparent',col=isFut?'#1e293b':'#64748b',bdr='1px solid transparent',fw='500';
            if(isHoy&&!isSel){bdr='1px solid rgba(96,165,250,0.5)';col='#60a5fa';fw='700';}
            if(isSel){bg='rgba(96,165,250,0.3)';bdr='1px solid rgba(96,165,250,0.7)';col='#bfdbfe';fw='800';}
            var clk=isFut?'':('onclick="window._epCalSel(\''+key+'\')"');
            html+='<div '+clk+' style="text-align:center;padding:4px 1px;border-radius:6px;font-size:11px;font-weight:'+fw+';color:'+col+';background:'+bg+';border:'+bdr+';'+(isFut?'opacity:0.3;':'cursor:pointer;')+'">'+d+'</div>';
        }
        html+='</div>';
        _eCalContainer.innerHTML=html;
    }
    function updateEFechaBtn(key){
        var lbl=document.getElementById('edit-peso-fecha-label');
        if(!lbl) return;
        var d=key?new Date(key+'T12:00:00'):new Date();
        var hoyKey=new Date().toISOString().slice(0,10);
        lbl.textContent = key===hoyKey
            ? 'Hoy, '+d.getDate()+' '+MESES_C[d.getMonth()]
            : DIAS_S[d.getDay()]+' '+d.getDate()+' '+MESES_C[d.getMonth()]+' '+d.getFullYear();
        lbl.style.color='#94a3b8';
        var btn=document.getElementById('edit-peso-fecha-btn');
        if(btn) btn.style.borderColor='rgba(96,165,250,0.3)';
    }
    window._epCalNav=function(dir){
        _eCalMonth+=dir;
        if(_eCalMonth>11){_eCalMonth=0;_eCalYear++;}
        if(_eCalMonth<0){_eCalMonth=11;_eCalYear--;}
        renderECal();
    };
    window._epCalSel=function(key){
        if(_eCalHidden) _eCalHidden.value=key;
        updateEFechaBtn(key);
        renderECal();
        var cal=document.getElementById('edit-peso-cal');
        var arrow=document.getElementById('edit-peso-cal-arrow');
        if(cal) cal.style.display='none';
        if(arrow) arrow.style.transform='';
    };
    window._epCalToggle=function(){
        var cal=document.getElementById('edit-peso-cal');
        var arrow=document.getElementById('edit-peso-cal-arrow');
        if(!cal) return;
        var open=cal.style.display!=='none';
        cal.style.display=open?'none':'block';
        if(arrow) arrow.style.transform=open?'':'rotate(180deg)';
        if(!open) renderECal();
    };
    window._epCalInit=function(container,hidden){
        _eCalContainer=container;
        _eCalHidden=hidden;
        var base=hidden.value?new Date(hidden.value+'T12:00:00'):new Date();
        _eCalYear=base.getFullYear();
        _eCalMonth=base.getMonth();
        container.style.display='none';
        var arrow=document.getElementById('edit-peso-cal-arrow');
        if(arrow) arrow.style.transform='';
        updateEFechaBtn(hidden.value);
    };
})();
(function() {
    var _calContainer = null;
    var _calHidden = null;
    var _calYear, _calMonth;
    var DIAS  = ['L','M','X','J','V','S','D'];
    var MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

    function fmt(d) { return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }

    function renderCal() {
        if (!_calContainer || !_calHidden) return;
        var hoy = new Date(); hoy.setHours(0,0,0,0);
        var selKey = _calHidden.value || fmt(hoy);
        var firstDay = new Date(_calYear, _calMonth, 1);
        var lastDay  = new Date(_calYear, _calMonth+1, 0);
        var startDow = (firstDay.getDay() + 6) % 7;

        var html = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">'
            + '<button onclick="window._npCalNav(-1)" style="background:none;border:none;color:#60a5fa;cursor:pointer;padding:2px 8px;font-size:20px;line-height:1;">&#8249;</button>'
            + '<span style="color:#f1f5f9;font-size:12px;font-weight:700;">'+MESES[_calMonth]+' '+_calYear+'</span>'
            + '<button onclick="window._npCalNav(1)" style="background:none;border:none;color:#60a5fa;cursor:pointer;padding:2px 8px;font-size:20px;line-height:1;">&#8250;</button>'
            + '</div>';

        html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px;margin-bottom:2px;">';
        DIAS.forEach(function(d){ html += '<div style="text-align:center;font-size:10px;font-weight:700;color:#334155;padding:3px 0;">'+d+'</div>'; });
        html += '</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px;">';

        for (var i = 0; i < startDow; i++) html += '<div></div>';
        for (var d = 1; d <= lastDay.getDate(); d++) {
            var cur = new Date(_calYear, _calMonth, d);
            var key = fmt(cur);
            var isHoy = cur.getTime() === hoy.getTime();
            var isSel = key === selKey;
            var isFut = cur > hoy;
            var bg = 'transparent';
            var col = isFut ? '#1e293b' : '#64748b';
            var bdr = '1px solid transparent';
            var fw = '500';
            if (isHoy && !isSel) { bdr = '1px solid rgba(96,165,250,0.5)'; col = '#60a5fa'; fw = '700'; }
            if (isSel) { bg = 'rgba(96,165,250,0.3)'; bdr = '1px solid rgba(96,165,250,0.7)'; col = '#bfdbfe'; fw = '800'; }
            var clickAttr = isFut ? '' : ('onclick="window._npCalSel(\'' + key + '\')"');
            html += '<div '+clickAttr+' style="text-align:center;padding:4px 1px;border-radius:6px;font-size:11px;font-weight:'+fw+';color:'+col+';background:'+bg+';border:'+bdr+';'+(isFut?'opacity:0.3;':'cursor:pointer;')+'">'+d+'</div>';
        }
        html += '</div>';
        _calContainer.innerHTML = html;
    }

    window._npCalNav = function(dir) {
        _calMonth += dir;
        if (_calMonth > 11) { _calMonth = 0; _calYear++; }
        if (_calMonth < 0)  { _calMonth = 11; _calYear--; }
        renderCal();
    };
    var MESES_CORTOS = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    var DIAS_SEMANA  = ['dom','lun','mar','mié','jue','vie','sáb'];

    function updateFechaBtn(key) {
        var btn   = document.getElementById('nutri-peso-fecha-btn');
        var label = document.getElementById('nutri-peso-fecha-label');
        if (!label) return;
        var d = key ? new Date(key+'T12:00:00') : new Date();
        var hoyKey = new Date().toISOString().slice(0,10);
        if (key === hoyKey) {
            label.textContent = 'Hoy, ' + d.getDate() + ' ' + MESES_CORTOS[d.getMonth()];
        } else {
            label.textContent = DIAS_SEMANA[d.getDay()] + ' ' + d.getDate() + ' ' + MESES_CORTOS[d.getMonth()] + ' ' + d.getFullYear();
        }
        label.style.color = '#94a3b8';
        if (btn) btn.style.borderColor = 'rgba(96,165,250,0.3)';
    }

    window._npCalToggle = function() {
        var cal   = document.getElementById('nutri-peso-cal');
        var arrow = document.getElementById('nutri-peso-cal-arrow');
        if (!cal) return;
        var open = cal.style.display !== 'none';
        cal.style.display = open ? 'none' : 'block';
        if (arrow) arrow.style.transform = open ? '' : 'rotate(180deg)';
        if (!open) renderCal();
    };
    window._npCalSel = function(key) {
        if (_calHidden) _calHidden.value = key;
        updateFechaBtn(key);
        renderCal();
        var cal   = document.getElementById('nutri-peso-cal');
        var arrow = document.getElementById('nutri-peso-cal-arrow');
        if (cal)   cal.style.display = 'none';
        if (arrow) arrow.style.transform = '';
    };
    window._nutriPesoCalInit = function(container, hidden) {
        _calContainer = container;
        _calHidden = hidden;
        var base = hidden.value ? new Date(hidden.value+'T12:00:00') : new Date();
        _calYear  = base.getFullYear();
        _calMonth = base.getMonth();
        container.style.display = 'none';
        var arrow = document.getElementById('nutri-peso-cal-arrow');
        if (arrow) arrow.style.transform = '';
        updateFechaBtn(hidden.value);
    };
})();

function abrirModalPeso() {
    var m = document.getElementById('modalPeso');
    if (!m) return;
    document.getElementById('nutri-input-peso').value = '';
    const notaEl = document.getElementById('nutri-input-peso-nota'); if (notaEl) notaEl.value = '';
    const offset = window._nutriNavOffset || 0;
    const fechaActual = new Date();
    fechaActual.setDate(fechaActual.getDate() + offset);
    const fechaStr = fechaActual.toISOString().split('T')[0];
    document.getElementById('nutri-input-peso-fecha').value = fechaStr;
    window._nutriPesoCalInit(document.getElementById('nutri-peso-cal'), document.getElementById('nutri-input-peso-fecha'));
    m.style.display = 'flex';
    var inp = document.getElementById('nutri-input-peso');
    setTimeout(function(){ inp.focus(); inp.select(); }, 120);
    if (window.visualViewport) {
        var _pvResize = function() {
            var vv = window.visualViewport;
            var kbH = window.innerHeight - vv.height;
            var inner = document.getElementById('modalPesoInner');
            if (kbH > 80) {
                var visH = vv.height;
                var boxH = inner ? inner.offsetHeight : 320;
                var top = Math.max(12, (visH - boxH) / 2);
                m.style.alignItems = 'flex-start';
                m.style.paddingTop = top + 'px';
                m.style.paddingBottom = '0';
                m.style.height = visH + 'px';
                m.style.top = vv.offsetTop + 'px';
            } else {
                m.style.alignItems = 'center';
                m.style.paddingTop = '0';
                m.style.paddingBottom = '0';
                m.style.height = '';
                m.style.top = '0';
            }
        };
        window.visualViewport.addEventListener('resize', _pvResize);
        window.visualViewport.addEventListener('scroll', _pvResize);
        m._pvCleanup = function() {
            window.visualViewport.removeEventListener('resize', _pvResize);
            window.visualViewport.removeEventListener('scroll', _pvResize);
        };
    }
}
function cerrarModalPeso() {
    var m = document.getElementById('modalPeso');
    if (!m) return;
    if (m._pvCleanup) { m._pvCleanup(); m._pvCleanup = null; }
    m.style.display = 'none';
    m.style.alignItems = ''; m.style.paddingTop = ''; m.style.paddingBottom = ''; m.style.height = ''; m.style.top = '';
}
function _nutriEscClose(e) { if (e.key === 'Escape') { cerrarModalComida(); cerrarModalPeso(); } }

function _nutriTipoSelect(btn) {
    document.querySelectorAll('.nutri-tipo-btn').forEach(b => {
        b.classList.remove('active');
        b.style.borderColor='rgba(255,255,255,0.1)';
        b.style.background='rgba(255,255,255,0.04)';
        b.style.color='#64748b';
    });
    btn.classList.add('active');
    btn.style.borderColor='rgba(16,185,129,0.5)';
    btn.style.background='rgba(16,185,129,0.15)';
    btn.style.color='#10b981';
}

window._nutriUnidadVal = 'g';

function _nutriUnidadToggle() {
    const dd = document.getElementById('nutri-unidad-dropdown');
    const trigger = document.getElementById('nutri-unidad-trigger');
    const arrow = document.getElementById('nutri-unidad-arrow');
    if (!dd) return;
    const open = dd.style.display !== 'none';
    if (open) {
        dd.style.display = 'none';
        arrow.style.transform = '';
        trigger.style.borderColor = 'rgba(255,255,255,0.1)';
    } else {
        const rect = trigger.getBoundingClientRect();
        dd.style.top = (rect.bottom + 4) + 'px';
        dd.style.left = rect.left + 'px';
        dd.style.width = rect.width + 'px';
        dd.style.display = 'block';
        arrow.style.transform = 'rotate(180deg)';
        trigger.style.borderColor = 'rgba(16,185,129,0.4)';
    }
}

function _nutriUnidadPick(val, label) {
    window._nutriUnidadVal = val;
    const icons = { g: 'weight', ml: 'water_drop', u: 'tag', p: 'restaurant' };
    const labels = { g: 'g — gramos', ml: 'ml — mililitros', u: 'ud / uds', p: 'porción' };
    const lbl = document.getElementById('nutri-unidad-label');
    const ico = document.getElementById('nutri-unidad-icon');
    if (lbl) lbl.textContent = labels[val] || label;
    if (ico) ico.textContent = icons[val] || 'weight';
    const dd = document.getElementById('nutri-unidad-dropdown');
    const arrow = document.getElementById('nutri-unidad-arrow');
    const trigger = document.getElementById('nutri-unidad-trigger');
    if (dd) dd.style.display = 'none';
    if (arrow) arrow.style.transform = '';
    if (trigger) trigger.style.borderColor = 'rgba(16,185,129,0.25)';
}
document.addEventListener('click', function(e) {
    const wrapper = document.getElementById('nutri-edit-unidad-wrapper');
    const dd = document.getElementById('nutri-edit-unidad-dropdown');
    if (dd && dd.style.display !== 'none' && wrapper && !wrapper.contains(e.target)) {
        dd.style.display = 'none';
        const arrow = document.getElementById('nutri-edit-unidad-arrow');
        if (arrow) arrow.style.transform = '';
    }
});
function _nutriEditUnidadToggle() {
    const dd = document.getElementById('nutri-edit-unidad-dropdown');
    const arrow = document.getElementById('nutri-edit-unidad-arrow');
    if (!dd) return;
    const open = dd.style.display !== 'none';
    dd.style.display = open ? 'none' : 'block';
    if (arrow) arrow.style.transform = open ? '' : 'rotate(180deg)';
}
function _nutriEditUnidadPick(val, silent) {
    const icons = { g: 'weight', ml: 'water_drop', uds: 'tag', kcal: 'local_fire_department' };
    const lbl = document.getElementById('nutri-edit-unidad-label');
    const ico = document.getElementById('nutri-edit-unidad-icon');
    const hidden = document.getElementById('nutri-edit-unidad');
    const dd = document.getElementById('nutri-edit-unidad-dropdown');
    const arrow = document.getElementById('nutri-edit-unidad-arrow');
    if (lbl) lbl.textContent = val;
    if (ico) ico.textContent = icons[val] || 'weight';
    if (hidden) hidden.value = val;
    if (!silent) { if (dd) dd.style.display = 'none'; if (arrow) arrow.style.transform = ''; }
}
document.addEventListener('click', function(e) {
    const wrapper = document.getElementById('nutri-unidad-wrapper');
    const dd = document.getElementById('nutri-unidad-dropdown');
    if (dd && dd.style.display !== 'none' && wrapper && !wrapper.contains(e.target)) {
        dd.style.display = 'none';
        const arrow = document.getElementById('nutri-unidad-arrow');
        const trigger = document.getElementById('nutri-unidad-trigger');
        if (arrow) arrow.style.transform = '';
        if (trigger) trigger.style.borderColor = 'rgba(255,255,255,0.1)';
    }
});
document.addEventListener('click', function(e) {
    if (e.target.closest('[data-nutri-id]')) return;
    document.querySelectorAll('.reforma-preview-card[data-nutri-id].active-card')
        .forEach(c => c.classList.remove('active-card'));
});
function _nutriSwipeStart(e) {
    const inner = e.currentTarget;
    const startY = e.touches ? e.touches[0].clientY : e.clientY;
    const startX = e.touches ? e.touches[0].clientX : e.clientX;
    let moved = false;
    function onMove(ev) {
        const y = ev.touches ? ev.touches[0].clientY : ev.clientY;
        const x = ev.touches ? ev.touches[0].clientX : ev.clientX;
        const dy = y - startY, dx = x - startX;
        if (Math.abs(dy) > Math.abs(dx) && dy > 10) {
            moved = true;
            inner.style.transform = `translateY(${Math.max(0,dy)}px)`;
            inner.style.opacity = Math.max(0.4, 1 - dy/300);
        }
    }
    function onEnd(ev) {
        const y = ev.changedTouches ? ev.changedTouches[0].clientY : ev.clientY;
        const dy = y - startY;
        inner.style.transform = '';
        inner.style.opacity = '';
        if (moved && dy > 80) {
            cerrarModalComida(); cerrarModalPeso();
        }
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
    }
    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onEnd);
}
const modalPeso = document.getElementById('modalPeso');
if (modalPeso) {
    modalPeso.addEventListener('click', function(e) { 
        if (e.target === modalPeso) cerrarModalPeso(); 
    });
}

function _nutriFmtUnidad(unidad, cantidad) {
    if (unidad === 'u' || unidad === 'ud' || unidad === 'uds') {
        return (parseFloat(cantidad) || 0) <= 1 ? 'ud' : 'uds';
    }
    return unidad;
}
function confirmarComida() {
    const nombre = document.getElementById('nutri-input-nombre').value.trim();
    if (!nombre) {
        const el = document.getElementById('nutri-input-nombre');
        el.style.borderColor = '#ef4444';
        setTimeout(() => el.style.borderColor = 'rgba(255,255,255,0.1)', 1500);
        return;
    }
    const tipoBtn = document.querySelector('.nutri-tipo-btn.active');
    const cantidad = parseFloat(document.getElementById('nutri-input-cantidad')?.value) || 100;
    const unidad = window._nutriUnidadVal || 'g';
    const comida = {
        id: 'comida_' + Date.now(),
        fecha: (function(){ const d=new Date(); d.setDate(d.getDate()+(window._nutriNavOffset||0)); const off=d.getTimezoneOffset(); const local=new Date(d.getTime()-off*60000); return local.toISOString().slice(0,10); })(),
        hora: new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}),
        tipo: tipoBtn ? tipoBtn.dataset.tipo : 'Comida',
        nombre,
        cantidad, unidad,
        kcal: parseFloat(document.getElementById('nutri-input-kcal').value) || 0,
        prot: parseFloat(document.getElementById('nutri-input-prot').value) || 0,
        carbs: parseFloat(document.getElementById('nutri-input-carbs').value) || 0,
        grasas: parseFloat(document.getElementById('nutri-input-grasas').value) || 0,
        nota: document.getElementById('nutri-input-nota').value.trim(),
        imagenes:[], url:'', liked:'false',
    };
    if (!window.nutricionData) window.nutricionData = { comidas: [], registrosPeso: [] };
    window.nutricionData.comidas.push(comida);
    if (typeof guardarDatos === 'function') guardarDatos();
    cerrarModalComida();
    renderNutricion();
    _mostrarToast && _mostrarToast('restaurant', '#10b981', comida.nombre + ' añadido');
}

function confirmarPeso() {
    const val = parseFloat(document.getElementById('nutri-input-peso').value.replace(',','.'));
    if (!val || val < 20 || val > 500) {
        const wrap = document.getElementById('nutri-input-peso').closest('div');
        if (wrap) { wrap.style.borderColor = '#ef4444'; setTimeout(() => wrap.style.borderColor = 'rgba(96,165,250,0.25)', 1500); }
        return;
    }
    const fecha = document.getElementById('nutri-input-peso-fecha').value || new Date().toISOString().split('T')[0];
    if (!window.nutricionData) window.nutricionData = { comidas: [], registrosPeso: [] };
    const nota = (document.getElementById('nutri-input-peso-nota')?.value || '').trim();
    const idx = window.nutricionData.registrosPeso.findIndex(r => r.fecha === fecha);
    if (idx >= 0) { window.nutricionData.registrosPeso[idx].peso = val; if (nota) window.nutricionData.registrosPeso[idx].nota = nota; }
    else window.nutricionData.registrosPeso.push({ fecha, peso: val, nota });
    window.nutricionData.registrosPeso.sort((a,b) => a.fecha.localeCompare(b.fecha));
    if (typeof guardarDatos === 'function') guardarDatos();
    cerrarModalPeso();
    renderNutricion();
    _mostrarToast && _mostrarToast('monitor_weight', '#60a5fa', val.toFixed(1).replace(',','.') + ' kg registrado');
}

function _nutriActualizarBadge() {
    const count = (window.nutricionData?.comidas || []).filter(c => c.archivado).length;
    ['nutri-archive-badge','nutri-archive-badge-m'].forEach(id => {
        const b = document.getElementById(id);
        if (!b) return;
        if (count > 0) { b.textContent = count > 99 ? '99+' : count; b.style.display = 'flex'; }
        else { b.style.display = 'none'; }
    });
}

function _nutriAbrirArchivados() {
    if (!window.nutricionData) return;
    const archivadas = (window.nutricionData.comidas || []).filter(c => c.archivado);
    if (!archivadas.length) {
        _mostrarToast && _mostrarToast('archive', '#64748b', 'No hay comidas archivadas');
        return;
    }
    let overlay = document.getElementById('_nutriArchiModal');
    if (overlay) overlay.remove();
    overlay = document.createElement('div');
    overlay.id = '_nutriArchiModal';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999999;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;';
    overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
    document.body.appendChild(overlay);
    const panel = document.createElement('div');
    panel.style.cssText = 'width:100%;max-width:480px;max-height:80dvh;background:#0d1424;border-radius:20px;overflow-y:auto;padding:20px;box-sizing:border-box;';
    let html = '<div style="width:36px;height:4px;background:rgba(255,255,255,0.1);border-radius:2px;margin:0 auto 16px;"></div>';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">';
    html += '<span style="color:#f1f5f9;font-size:15px;font-weight:800;">Comidas archivadas</span>';
    html += '<button id="_nutriArchiClose" style="background:none;border:none;color:#64748b;cursor:pointer;font-size:22px;line-height:1;">&#x2715;</button>';
    html += '</div>';
    archivadas.forEach(function(c){
        html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:12px;margin-bottom:8px;gap:10px;">';
        html += '<div style="min-width:0;"><p style="color:#f1f5f9;font-size:13px;font-weight:700;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+c.nombre+'</p>';
        html += '<p style="color:#64748b;font-size:11px;margin:0;">'+c.tipo+' · '+c.fecha+'</p></div>';
        html += '<button data-restaurar="'+c.id+'" style="flex-shrink:0;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3);color:#10b981;border-radius:10px;padding:6px 10px;font-size:11px;font-weight:700;cursor:pointer;">Restaurar</button>';
        html += '</div>';
    });
    panel.innerHTML = html;
    overlay.appendChild(panel);
    panel.querySelector('#_nutriArchiClose').addEventListener('click', function(){ overlay.remove(); });
    panel.querySelectorAll('[data-restaurar]').forEach(function(btn){
        btn.addEventListener('click', function(){ _nutriDesarchivarComida(btn.dataset.restaurar); });
    });
}
function _nutriDesarchivarComida(id) {
    if (!window.nutricionData) return;
    const c = window.nutricionData.comidas.find(x => x.id === id);
    if (c) {
        delete c.archivado;
        if (typeof guardarDatos === 'function') guardarDatos();
        renderNutricion();
        _nutriActualizarBadge();
        const m = document.getElementById('_nutriArchiModal');
        if (m) m.remove();
        _mostrarToast && _mostrarToast('unarchive', '#10b981', c.nombre + ' restaurado');
    }
}

function _nutriEliminarComida(id) {
    if (!window.nutricionData) return;
    const card = document.querySelector('[data-nutri-id="' + id + '"]');
    if (card) {
        card.style.transition = 'opacity 0.25s, transform 0.25s';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.85)';
    }
    window.nutricionData.comidas = window.nutricionData.comidas.filter(c => c.id !== id);
    if (typeof guardarDatos === 'function') guardarDatos();
    const cv = document.getElementById('nutri-peso-canvas');
    if (cv && cv._chartInst) { cv._chartInst.destroy(); cv._chartInst = null; }
    setTimeout(() => renderNutricion(), 260);
}
function _nutriRenderDots(total) {
    const dotsEl = document.getElementById('dots-comidas');
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    if (total <= 1) return;
    const track = document.getElementById('carrusel-comidas');
    for (let i = 0; i < total; i++) {
        const d = document.createElement('div');
        d.className = 'carrusel-dot carrusel-dot-comida' + (i === 0 ? ' active' : '');
        d.onclick = () => {
            const cards = track ? track.querySelectorAll('.reforma-preview-card') : [];
            if (cards[i]) { const wrapper=document.getElementById('carrusel-comidas-wrapper'); cards.forEach(c=>c.classList.remove('active-card')); cards[i].classList.add('active-card'); if(wrapper){wrapper.scrollLeft=cards[i].offsetLeft-(wrapper.offsetWidth/2)+(cards[i].offsetWidth/2);} dotsEl.querySelectorAll('.carrusel-dot').forEach((d,j)=>d.classList.toggle('active',j===i)); }
        };
        dotsEl.appendChild(d);
    }
}

function onNutriCarruselScroll() {
    const wrapper = document.getElementById('carrusel-comidas-wrapper');
    const track   = document.getElementById('carrusel-comidas');
    const dotsEl  = document.getElementById('dots-comidas');
    if (!wrapper || !track || !dotsEl) return;
    const allCards = track.querySelectorAll('.reforma-preview-card');
    if (!allCards.length) return;
    wrapper.classList.toggle('nutri-scroll-left', wrapper.scrollLeft > 8);

    // Efecto lift: la card más centrada se levanta igual que en reforma
    if (!wrapper._rafPending) {
        wrapper._rafPending = true;
        requestAnimationFrame(() => {
            wrapper._rafPending = false;
            const wRect = wrapper.getBoundingClientRect();
            const wCenter = wRect.left + wRect.width / 2;
            const maxDist = wRect.width * 0.6;
            allCards.forEach(c => {
                const rect = c.getBoundingClientRect();
                const dist = Math.abs((rect.left + rect.width / 2) - wCenter);
                const ratio = Math.max(0, 1 - dist / maxDist);
                const lift = ratio * 16;
                c.style.transform = `translateY(-${lift}px) scale(${1 + ratio * 0.03})`;
                c.style.zIndex = Math.round(ratio * 10);
            });
        });
    }

    // Dots + active-card al parar el scroll
    clearTimeout(wrapper._nutDots);
    wrapper._nutDots = setTimeout(() => {
        const wRect = wrapper.getBoundingClientRect();
        const wCenter = wRect.left + wRect.width / 2;
        let closest = 0, minD = Infinity;
        allCards.forEach((c, i) => {
            const dist = Math.abs((c.getBoundingClientRect().left + c.offsetWidth / 2) - wCenter);
            if (dist < minD) { minD = dist; closest = i; }
        });
        dotsEl.querySelectorAll('.carrusel-dot').forEach((d, i) => d.classList.toggle('active', i === closest));
        // Actualizar active-card sin animar el scroll (ya estamos parados)
        allCards.forEach((c, i) => {
            c.classList.toggle('active-card', i === closest);
        });
    }, 80);
}

function _nutriCentrarCard(card) {
    const track=document.getElementById('carrusel-comidas'), dotsEl=document.getElementById('dots-comidas'), wrapper=document.getElementById('carrusel-comidas-wrapper');
    if (!track) return;
    const cards=track.querySelectorAll('.reforma-preview-card');
    cards.forEach(c=>{ c.classList.remove('active-card'); c.style.transform=''; c.style.zIndex=''; });
    requestAnimationFrame(()=>{
        card.classList.add('active-card');
        if(dotsEl){const idx=Array.from(cards).indexOf(card);dotsEl.querySelectorAll('.carrusel-dot').forEach((d,i)=>d.classList.toggle('active',i===idx));}
        if(wrapper){const cardLeft=card.getBoundingClientRect().left;const wrapperLeft=wrapper.getBoundingClientRect().left;const target=wrapper.scrollLeft+cardLeft-wrapperLeft-(wrapper.clientWidth/2)+(card.offsetWidth/2);wrapper.scrollTo({left:target,behavior:'smooth'});}
    });
}

function _nutriLikeLeave(btn){ if(!btn.classList.contains('liked')){btn.style.borderColor='rgba(255,255,255,0.1)';btn.style.color='rgba(255,255,255,0.7)';} }
function _nutriToggleLike(btn){
    const card=btn.closest('[data-nutri-id]'); if(!card) return;
    const id=card.dataset.nutriId;
    const isLiked=btn.classList.toggle('liked');
    const icon=btn.querySelector('.material-symbols-rounded');
    const heart=card.querySelector('.card-ghost-heart');
    if(isLiked){btn.style.borderColor='rgba(220,38,38,0.6)';btn.style.color='#ef4444';if(icon)icon.style.fontVariationSettings="'FILL' 1";if(heart)heart.style.display='inline-flex';}
    else{btn.style.borderColor='rgba(255,255,255,0.1)';btn.style.color='rgba(255,255,255,0.7)';if(icon)icon.style.fontVariationSettings="'FILL' 0";if(heart)heart.style.display='none';}
    if(window.nutricionData){const c=window.nutricionData.comidas.find(x=>x.id===id);if(c){c.liked=isLiked?'true':'false';if(typeof guardarDatos==='function')guardarDatos();}}
}
function _nutriAbrirLink(id){
    if(!window.nutricionData) return;
    const c=window.nutricionData.comidas.find(x=>x.id===id);
    if(!c||!c.url){_mostrarToast&&_mostrarToast('link_off','#64748b','Sin enlace guardado');return;}
    let url=c.url.trim(); if(!url.startsWith('http://') && !url.startsWith('https://')) url='https://'+url;
    window.open(url,'_blank');
}
let _nutriEditId=null, _nutriEditFotos=[];
const _NE_COL={'Desayuno':'#fbbf24','Almuerzo':'#fb923c','Comida':'#f97316','Merienda':'#a78bfa','Cena':'#60a5fa','Snack':'#10b981','Bebida':'#38bdf8','Aperitivo':'#f43f5e'};

function _nutriAbrirEdit(id){
    if(!window.nutricionData) return;
    const c=window.nutricionData.comidas.find(x=>x.id===id); if(!c) return;
    _nutriEditId=id; _nutriEditFotos=(c.imagenes||[]).slice();
    const col=_NE_COL[c.tipo]||'#10b981';
    const overlay=document.getElementById('modal-nutri-edit-overlay');
    const panel=document.getElementById('modal-nutri-edit-panel');
    if(overlay){ overlay.style.transition='none'; overlay.style.opacity='0'; overlay.style.display='flex'; overlay.style.pointerEvents='all'; }
    if(panel){ panel.style.transition='none'; panel.style.transform='translateY(100%)'; }
    const badge=document.getElementById('nutri-edit-badge');
    if(badge){badge.textContent=c.tipo.toUpperCase();badge.style.background=col;badge.style.borderColor='transparent';}
    const heart=document.getElementById('nutri-edit-heart');
    if(heart){
        const isLiked=c.liked==='true'||c.liked===true;
        heart.style.color=isLiked?'white':'#475569';
        heart.style.fontVariationSettings=isLiked?"'FILL' 1":"'FILL' 0";
        heart.dataset.liked=String(isLiked);
    }
    _nutriEditActualizarPortada();
    document.getElementById('nutri-edit-nombre').value=c.nombre||'';
    document.getElementById('nutri-edit-url').value=c.url||'';
    document.getElementById('nutri-edit-cantidad').value=c.cantidad!=null?c.cantidad:100;
    document.getElementById('nutri-edit-unidad').value=c.unidad||'g';
    _nutriEditUnidadPick(c.unidad||'g', true);
    document.getElementById('nutri-edit-kcal').value=c.kcal||'';
    document.getElementById('nutri-edit-prot').value=c.prot||'';
    document.getElementById('nutri-edit-carbs').value=c.carbs||'';
    document.getElementById('nutri-edit-grasas').value=c.grasas||'';
    document.getElementById('nutri-edit-nota').value=c.nota||'';
    const horaBtn=document.getElementById('nutri-edit-hora-btn');
    if(horaBtn){const sp=horaBtn.querySelector('span[id="nutri-edit-hora-display"]');if(sp)sp.textContent=c.hora||'Seleccionar hora...';}
    window._nutriEditHoraVal=c.hora||'';
    document.querySelectorAll('.nutri-edit-tipo-btn').forEach(btn=>{
        const active=btn.dataset.tipo===c.tipo; const bc=_NE_COL[btn.dataset.tipo]||'#10b981';
        btn.style.borderColor=active?bc+'80':'rgba(255,255,255,0.1)';
        btn.style.background=active?bc+'22':'rgba(255,255,255,0.04)';
        btn.style.color=active?bc:'#64748b';
        btn.dataset.active=active?'true':'';
    });
    _nutriEditRenderFotos();
    requestAnimationFrame(()=>{
        requestAnimationFrame(()=>{
            if(overlay){ overlay.style.transition='opacity 0.3s ease'; overlay.style.opacity='1'; }
            if(panel){ panel.style.transition='transform 0.35s cubic-bezier(.32,1,.48,1)'; panel.style.transform='translateY(0)'; }
        });
    });
    document.body.style.overflow='hidden';
}

function _nutriEditCerrar(){
    const overlay=document.getElementById('modal-nutri-edit-overlay');
    const panel=document.getElementById('modal-nutri-edit-panel');
    panel.style.transform='translateY(100%)';
    overlay.style.opacity='0';
    overlay.style.pointerEvents='none'; // ← desactivar inmediatamente, no esperar al timeout
    setTimeout(()=>{overlay.style.display='none';overlay.style.opacity='';overlay.style.pointerEvents='';panel.style.transform='';},350);
    document.body.style.overflow='';_nutriEditId=null;
}
function _nutriEditCloseOverlay(e){
    if (e.target === document.getElementById('modal-nutri-edit-overlay') && !window._nutriEditDragFromInner) _nutriEditCerrar();
    window._nutriEditDragFromInner = false;
}

function _nutriEditTipoSel(btn){
    document.querySelectorAll('.nutri-edit-tipo-btn').forEach(b=>{b.style.borderColor='rgba(255,255,255,0.1)';b.style.background='rgba(255,255,255,0.04)';b.style.color='#64748b';b.dataset.active='';});
    const col=_NE_COL[btn.dataset.tipo]||'#10b981';
    btn.style.borderColor=col+'80';btn.style.background=col+'22';btn.style.color=col;btn.dataset.active='true';
    const badge=document.getElementById('nutri-edit-badge');
    if(badge){badge.textContent=btn.dataset.tipo.toUpperCase();badge.style.background=col;}
}

function _nutriEditToggleLike(){
    const heart=document.getElementById('nutri-edit-heart'); if(!heart) return;
    const isLiked=heart.dataset.liked!=='true';
    heart.dataset.liked=String(isLiked);
    heart.style.color=isLiked?'white':'#475569';
    heart.style.fontVariationSettings=isLiked?"'FILL' 1":"'FILL' 0";
}

function _nutriEditAbrirHora(){
    if(typeof abrirTimePickerRecordatorio==='function'){
        const orig=window.tpConfirmar;
        window.tpConfirmar=function(){
            const h=document.getElementById('tp-hour')?.textContent||'';
            const m=document.getElementById('tp-minute')?.textContent||'';
            if(h&&m){
                const val=h.padStart(2,'0')+':'+m.padStart(2,'0');
                window._nutriEditHoraVal=val;
                const sp=document.getElementById('nutri-edit-hora-display');
                if(sp)sp.textContent=val;
            }
            if(typeof orig==='function') orig();
            window.tpConfirmar=orig;
        };
        abrirTimePickerRecordatorio();
    }
}

function _nutriEditActualizarPortada(){
    const img=document.getElementById('nutri-edit-portada-img'),ph=document.getElementById('nutri-edit-portada-placeholder');
    if(img&&ph){
        if(_nutriEditFotos.length>0){img.src=_nutriEditFotos[0];img.style.display='block';ph.style.display='none';}
        else{img.style.display='none';ph.style.display='flex';}
    }
    if(!_nutriEditId) return;
    const card=document.querySelector('[data-nutri-id="'+_nutriEditId+'"]');
    if(!card) return;
    const src=_nutriEditFotos[0]||null;
    const bgImg=card.querySelector('.card-bg-img');
    const bgCol=card.querySelector('.card-bg-color');
    const thumb=card.querySelector('.card-thumbnail');
    const thumbPh=card.querySelector('.card-thumbnail-placeholder');
    if(src){
        if(bgImg){bgImg.src=src;bgImg.style.display='';}
        else{
            const ni=document.createElement('img');ni.className='card-bg-img';ni.src=src;
            card.insertBefore(ni,card.firstChild);
            if(bgCol)bgCol.style.display='none';
        }
        if(bgCol&&bgImg)bgCol.style.display='none';
    }else{
        if(bgImg)bgImg.style.display='none';
        if(bgCol)bgCol.style.display='';
        if(thumb)thumb.style.display='none';
        if(thumbPh)thumbPh.style.display='';
    }
}
function _nutriEditFotosToggle(){
    const grid=document.getElementById('nutri-edit-fotos-grid'),label=document.getElementById('btn-nutri-edit-fotos-label'),btn=document.getElementById('btn-nutri-edit-fotos');
    const isEdit=grid.classList.toggle('edit-mode');label.textContent=isEdit?'Listo':'Editar';btn.style.color=isEdit?'#60a5fa':'#475569';
}
function _nutriEditRenderFotos(){
    const grid=document.getElementById('nutri-edit-fotos-grid');if(!grid)return;
    grid.innerHTML='';grid.classList.remove('edit-mode');
    _nutriEditFotos.forEach((src,idx)=>{
        const item=document.createElement('div');item.className='modal-foto-item';
        item.innerHTML=`<span class="modal-foto-drag-handle"><span class="drag-icon material-symbols-rounded" style="font-size:20px;color:white;">drag_indicator</span><button class="modal-foto-del" data-del-idx="${idx}"><span class="material-symbols-rounded" style="font-size:13px;">close</span></button></span><img src="${src}" draggable="false" onclick="_nutriEditVerFoto(this)">`;
        // Botón borrar: click (desktop) + touchend (móvil, evita que Sortable lo intercepte)
        const delBtn = item.querySelector('.modal-foto-del');
        const _doDel = (e) => { e.stopPropagation(); e.preventDefault(); _nutriEditDelFoto(parseInt(delBtn.dataset.delIdx)); };
        delBtn.addEventListener('click', _doDel);
        delBtn.addEventListener('touchend', (e) => { e.stopPropagation(); e.preventDefault(); _nutriEditDelFoto(parseInt(delBtn.dataset.delIdx)); }, { passive: false });
        // Long press para activar edit-mode en móvil
        let lp;item.addEventListener('touchstart',(e)=>{if(e.target.closest('.modal-foto-del'))return;lp=setTimeout(()=>{grid.classList.add('edit-mode');if(navigator.vibrate)navigator.vibrate(30);},500);},{passive:true});
        item.addEventListener('touchend',()=>clearTimeout(lp),{passive:true});item.addEventListener('touchmove',()=>clearTimeout(lp),{passive:true});
        grid.appendChild(item);
    });
    const add=document.createElement('label');add.className='modal-add-foto';
    add.innerHTML=`<span class="material-symbols-rounded text-slate-600" style="font-size:20px;">add_photo_alternate</span><span style="font-size:9px;color:#475569;font-weight:700;">Añadir</span><input type="file" accept="image/*" multiple style="display:none;" onchange="_nutriEditSubirFotos(this)">`;
    grid.appendChild(add);
    if(window.Sortable){if(grid._sortable){grid._sortable.destroy();grid._sortable=null;}
        grid._sortable=new Sortable(grid,{handle:'.modal-foto-drag-handle',filter:'.modal-add-foto',animation:150,forceFallback:true,ghostClass:'foto-ghost',onEnd:()=>{_nutriEditFotos=Array.from(grid.querySelectorAll('.modal-foto-item img')).map(i=>i.src);_nutriEditActualizarPortada();}});}
}
function _nutriEditDelFoto(idx){_nutriEditFotos.splice(idx,1);_nutriEditRenderFotos();_nutriEditActualizarPortada();}
function _nutriEditSubirFotos(input){
    const files=Array.from(input.files);if(!files.length)return;let done=0;
    files.forEach(async file=>{
        try{
            const url=await subirACloudinary(file);
            _nutriEditFotos.push(url);
        }catch(e){
            await new Promise(res=>{
                const r=new FileReader();
                r.onload=ev=>{
                    const img=new Image();
                    img.onload=()=>{
                        const MAX=600,Q=0.72;
                        let w=img.width,h=img.height;
                        if(w>h){if(w>MAX){h=Math.round(h*MAX/w);w=MAX;}}else{if(h>MAX){w=Math.round(w*MAX/h);h=MAX;}}
                        const cv=document.createElement('canvas');cv.width=w;cv.height=h;
                        cv.getContext('2d').drawImage(img,0,0,w,h);
                        _nutriEditFotos.push(cv.toDataURL('image/jpeg',Q));
                        res();
                    };
                    img.src=ev.target.result;
                };
                r.readAsDataURL(file);
            });
        }
        if(++done===files.length){_nutriEditRenderFotos();_nutriEditActualizarPortada();}
    });
    input.value='';
}
function _nutriEditVerFoto(img){
    if(typeof verFotoGrandeModal==='function'){verFotoGrandeModal(img);return;}
    const ov=document.createElement('div');ov.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
    ov.onclick=()=>document.body.removeChild(ov);
    const bi=document.createElement('img');bi.src=img.src;bi.style.cssText='max-width:95vw;max-height:90vh;border-radius:12px;object-fit:contain;';
    ov.appendChild(bi);document.body.appendChild(ov);
}
function _nutriEditGuardar(){
    if(!window.nutricionData||!_nutriEditId) return;
    const nombre=document.getElementById('nutri-edit-nombre').value.trim();
    if(!nombre){const el=document.getElementById('nutri-edit-nombre');el.style.borderColor='#ef4444';setTimeout(()=>el.style.borderColor='rgba(51,65,85,0.6)',1500);return;}
    let tipoActivo='Comida';
    const tipoActivoBtn=document.querySelector('.nutri-edit-tipo-btn[data-active="true"]');
    if(tipoActivoBtn) tipoActivo=tipoActivoBtn.dataset.tipo;
    const idx=window.nutricionData.comidas.findIndex(c=>c.id===_nutriEditId);if(idx<0)return;
    const prev=window.nutricionData.comidas[idx];
    const heart=document.getElementById('nutri-edit-heart');
    window.nutricionData.comidas[idx]=Object.assign({},prev,{
        nombre,tipo:tipoActivo,
        hora:    window._nutriEditHoraVal||prev.hora,
        url:     document.getElementById('nutri-edit-url').value.trim(),
        cantidad:parseFloat(document.getElementById('nutri-edit-cantidad').value)||prev.cantidad,
        unidad:  document.getElementById('nutri-edit-unidad').value||'g',
        kcal:    parseFloat(document.getElementById('nutri-edit-kcal').value)||0,
        prot:    parseFloat(document.getElementById('nutri-edit-prot').value)||0,
        carbs:   parseFloat(document.getElementById('nutri-edit-carbs').value)||0,
        grasas:  parseFloat(document.getElementById('nutri-edit-grasas').value)||0,
        nota:    document.getElementById('nutri-edit-nota').value.trim(),
        imagenes:_nutriEditFotos.slice(),
        liked:   heart?heart.dataset.liked:prev.liked,
    });
    if(typeof guardarDatos==='function') guardarDatos();
    _nutriEditCerrar();renderNutricion();
    _mostrarToast&&_mostrarToast('check_circle','#10b981',nombre+' actualizado');
}
function _nutriEditArchivar(){
    if(!_nutriEditId) return;
    const id=_nutriEditId; _nutriEditCerrar();
    setTimeout(()=>{
        if(window.nutricionData){const c=window.nutricionData.comidas.find(x=>x.id===id);if(c){c.archivado=true;if(typeof guardarDatos==='function')guardarDatos();renderNutricion();_nutriActualizarBadge();_mostrarToast&&_mostrarToast('archive','#64748b','Comida archivada');}}
    },350);
}
function _nutriEditDuplicar(){
    if(!window.nutricionData||!_nutriEditId) return;
    const c=window.nutricionData.comidas.find(x=>x.id===_nutriEditId);if(!c) return;
    let fechaCopia = c.fecha;
    if((window._nutriFiltro||'dia')==='dia'){
        const offset=window._nutriNavOffset||0;
        const d=new Date(); d.setDate(d.getDate()+offset);
        fechaCopia=d.toISOString().split('T')[0];
    }
    const copia=Object.assign({},c,{id:'comida_'+Date.now(),nombre:c.nombre+' (copia)',liked:'false',fecha:fechaCopia});
    window.nutricionData.comidas.push(copia);
    if(typeof guardarDatos==='function') guardarDatos();
    const cv=document.getElementById('nutri-peso-canvas');
    if(cv&&cv._chartInst){cv._chartInst.destroy();cv._chartInst=null;}
    _nutriEditCerrar();renderNutricion();
    _mostrarToast&&_mostrarToast('control_point_duplicate','#10b981','Comida duplicada');
}
function _nutriEditEliminar(){const id=_nutriEditId;_nutriEditCerrar();setTimeout(()=>_nutriEliminarComida(id),350);}

let _neSwY=0,_neSwActive=false;
function _nutriEditSwipeStart(e){
    const panel=document.getElementById('modal-nutri-edit-panel');
    if(panel.scrollTop>4)return;
    _neSwY=e.touches?e.touches[0].clientY:e.clientY;_neSwActive=true;
    const finish=(ev)=>{if(!_neSwActive)return;_neSwActive=false;panel.style.transition='';panel.style.transform='translateY(0)';
        const dy=(ev.changedTouches?ev.changedTouches[0].clientY:ev.clientY)-_neSwY;
        if(dy>80)_nutriEditCerrar();
        document.removeEventListener('mouseup',finish);document.removeEventListener('touchend',finish);};
    document.addEventListener('mouseup',finish,{once:true});document.addEventListener('touchend',finish,{once:true});
}
window._nutriFiltro    = window._nutriFiltro    || 'dia';
window._nutriNavOffset = window._nutriNavOffset || 0;
window._nutriNavDesde  = window._nutriNavDesde  || null;
window._nutriNavHasta  = window._nutriNavHasta  || null;
window._nutriOrden     = window._nutriOrden     || null;   // 'mayor' | 'menor' | null
window._nutriSoloFav   = window._nutriSoloFav   || false;  // favoritos
window._nutriVista     = window._nutriVista     || 'comidas'; // 'comidas' | 'peso'

// ── Funciones del filterbar de nutrición ─────────────────────────────
function _nutriFiltrarMayor() {
    window._nutriOrden = window._nutriOrden === 'mayor' ? null : 'mayor';
    _nutriActualizarBtns();
    renderNutricion();
}
function _nutriFiltrarMenor() {
    window._nutriOrden = window._nutriOrden === 'menor' ? null : 'menor';
    _nutriActualizarBtns();
    renderNutricion();
}
function _nutriFiltrarFav() {
    window._nutriSoloFav = !window._nutriSoloFav;
    _nutriActualizarBtns();
    renderNutricion();
}
function _nutriCambiarVista(vista) {
    window._nutriVista = vista;
    _nutriActualizarBtns();
    _nutriActualizarVista();
}
function _nutriActualizarBtns() {
    const bMayor = document.getElementById('nutri-filtro-mayor');
    const bMenor = document.getElementById('nutri-filtro-menor');
    const bFav   = document.getElementById('nutri-filtro-favoritos');
    const bCom   = document.getElementById('tab-nutri-comidas');
    const bPeso  = document.getElementById('tab-nutri-peso');
    const act    = 'rgba(16,185,129,0.4)';
    const inact  = 'rgba(71,85,105,0.3)';
    if (bMayor) { bMayor.style.borderColor = window._nutriOrden === 'mayor' ? act : inact; bMayor.style.color = window._nutriOrden === 'mayor' ? '#10b981' : '#94a3b8'; }
    if (bMenor) { bMenor.style.borderColor = window._nutriOrden === 'menor' ? act : inact; bMenor.style.color = window._nutriOrden === 'menor' ? '#10b981' : '#94a3b8'; }
    if (bFav)   { bFav.style.borderColor   = window._nutriSoloFav ? 'rgba(248,113,113,0.6)' : inact; bFav.style.color = window._nutriSoloFav ? '#f87171' : '#94a3b8'; }
    if (bCom)  {
        bCom.style.background   = window._nutriVista === 'comidas' ? 'linear-gradient(135deg,rgba(5,78,22,0.8) 0%,rgba(6,95,70,0.7) 50%,rgba(4,120,87,0.8) 100%)' : 'transparent';
        bCom.style.borderColor  = window._nutriVista === 'comidas' ? 'rgba(16,185,129,0.4)' : 'transparent';
        bCom.style.boxShadow    = window._nutriVista === 'comidas' ? '0 0 20px rgba(16,185,129,0.5)' : 'none';
        bCom.style.color        = window._nutriVista === 'comidas' ? 'white' : '#64748b';
    }
    if (bPeso) {
        bPeso.style.background  = window._nutriVista === 'peso' ? 'linear-gradient(135deg,rgba(5,78,22,0.8) 0%,rgba(6,95,70,0.7) 50%,rgba(4,120,87,0.8) 100%)' : 'transparent';
        bPeso.style.borderColor = window._nutriVista === 'peso' ? 'rgba(16,185,129,0.4)' : 'transparent';
        bPeso.style.boxShadow   = window._nutriVista === 'peso' ? '0 0 20px rgba(16,185,129,0.5)' : 'none';
        bPeso.style.color       = window._nutriVista === 'peso' ? 'white' : '#64748b';
    }
}
function _nutriActualizarVista() {
    const vComidas  = document.getElementById('nutri-vista-comidas');
    const vPeso     = document.getElementById('nutri-vista-peso');
    const intervalo = document.getElementById('nutri-intervalo-wrapper');
    if (window._nutriVista === 'comidas') {
        if (vComidas)  vComidas.style.display  = '';
        if (vPeso)     vPeso.style.display     = 'none';
    } else {
        if (vComidas)  vComidas.style.display  = 'none';
        if (vPeso)     vPeso.style.display     = '';
        if (typeof _renderNutriPesoChart === 'function') setTimeout(_renderNutriPesoChart, 50);
    }
}
// ─────────────────────────────────────────────────────────────────────

function _nutriGetRango() {
    if (window._nutriNavDesde && window._nutriNavHasta) {
        return { desde: window._nutriNavDesde, hasta: window._nutriNavHasta };
    }
    const filtro = window._nutriFiltro || 'dia';
    const offset = window._nutriNavOffset || 0;
    const now = new Date();
    let desde, hasta;
    if (filtro === 'dia') {
        const d = new Date(now); d.setDate(d.getDate() + offset);
        desde = new Date(d); desde.setHours(0,0,0,0);
        hasta = new Date(d); hasta.setHours(23,59,59,999);
    } else if (filtro === 'semana') {
        const lun = new Date(now); lun.setDate(now.getDate() - ((now.getDay()+6)%7) + offset*7); lun.setHours(0,0,0,0);
        desde = lun; hasta = new Date(lun); hasta.setDate(lun.getDate()+6); hasta.setHours(23,59,59,999);
    } else if (filtro === 'mes') {
        const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
        desde = new Date(d.getFullYear(), d.getMonth(), 1);
        hasta = new Date(d.getFullYear(), d.getMonth()+1, 0, 23,59,59,999);
    } else if (filtro === 'ano') {
        const y = now.getFullYear() + offset;
        desde = new Date(y,0,1); hasta = new Date(y,11,31,23,59,59,999);
    } else { // todo
        desde = null; hasta = null;
    }
    return { desde, hasta };
}

function _nutriGetLabel() {
    const filtro = window._nutriFiltro || 'dia';
    const offset = window._nutriNavOffset || 0;
    const now = new Date();
    if (filtro === 'todo') return 'Todo el tiempo';
    if (filtro === 'dia') {
        const d = new Date(now); d.setDate(d.getDate() + offset);
        const hoy = new Date(); hoy.setHours(0,0,0,0);
        const dd = new Date(d); dd.setHours(0,0,0,0);
        if (dd.getTime() === hoy.getTime()) return 'Hoy';
        const l = d.toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'long'});
        return l.charAt(0).toUpperCase() + l.slice(1);
    }
    if (filtro === 'semana') {
        const lun = new Date(now); lun.setDate(now.getDate()-((now.getDay()+6)%7)+offset*7);
        const dom = new Date(lun); dom.setDate(lun.getDate()+6);
        const fmt = d => d.toLocaleDateString('es-ES',{day:'2-digit',month:'short'});
        return fmt(lun) + ' - ' + fmt(dom);
    }
    if (filtro === 'mes') {
        const d = new Date(now.getFullYear(), now.getMonth()+offset, 1);
        const l = d.toLocaleDateString('es-ES',{month:'long',year:'numeric'});
        return l.charAt(0).toUpperCase() + l.slice(1);
    }
    if (filtro === 'ano') return 'Año ' + (now.getFullYear()+offset);
    return 'Hoy';
}

function nutriNavIntervalo(dir) {
    const filtro = window._nutriFiltro || 'dia';
    if (filtro === 'todo') return;
    if (!window._nutriNavOffset) window._nutriNavOffset = 0;
    window._nutriNavOffset += dir;
    window._nutriNavDesde = null;
    window._nutriNavHasta = null;
    _nutriUpdateLabel();
    renderNutricion();
}

function _nutriUpdateLabel() {
    const lbl = document.getElementById('nutri-intervalo-label');
    if (lbl) lbl.textContent = _nutriGetLabel();
}

function setNutriFiltroIntervalo(filtro) {
    window._nutriFiltro = filtro;
    window._nutriNavOffset = 0;
    window._nutriNavDesde = null;
    window._nutriNavHasta = null;
    _nutriUpdateLabel();
    renderNutricion();
}
var _nutriLPTimer = null;
function _nutriIntervaloLPStart(e) {
    _nutriLPTimer = setTimeout(function() {
        _nutriLPTimer = null;
        const filtro = window._nutriFiltro || 'dia';
        if (window._nutriNavOffset === 0 && filtro === 'dia') return;
        window._nutriFiltro = 'dia';
        window._nutriNavOffset = 0;
        window._nutriNavDesde = null;
        window._nutriNavHasta = null;
        _nutriUpdateLabel();
        renderNutricion();
        if (navigator.vibrate) navigator.vibrate([20,30,60]);
    }, 600);
}
function _nutriIntervaloLPEnd() {
    if (_nutriLPTimer) { clearTimeout(_nutriLPTimer); _nutriLPTimer = null; }
}

function _nutriDrawDonut(canvasId, val, max, color, bgColor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const cx = w/2, cy = h/2, r = w/2 - 6;
    const pct = max > 0 ? Math.min(val / max, 1) : 0;
    ctx.clearRect(0, 0, w, h);
    // bg ring
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.strokeStyle = bgColor || 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 7; ctx.stroke();
    // fill ring
    if (pct > 0) {
        ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI/2, -Math.PI/2 + Math.PI*2*pct);
        ctx.strokeStyle = color;
        ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.stroke();
    }
}

function _nutriRenderWidgets() {
    if (!window.nutricionData) return;
    const obj = window.nutricionData.objetivos || { kcal: 2000, prot: 100, carbs: 250, grasas: 65 };
    const filtro = window._nutriFiltro || 'dia';
    const { desde, hasta } = _nutriGetRango();

    // Solo calculamos para el día actual/navegado
    const offset = window._nutriNavOffset || 0;
    const diaD = new Date(); diaD.setDate(diaD.getDate() + offset); diaD.setHours(0,0,0,0);
    const diaH = new Date(diaD); diaH.setHours(23,59,59,999);

    const comidashoy = (window.nutricionData.comidas || []).filter(c => {
        if (c.archivado) return false;
        const f = new Date(c.fecha + 'T12:00:00');
        return f >= diaD && f <= diaH;
    });

    const totKcal  = comidashoy.reduce((s,c) => s + (parseFloat(c.kcal)||0), 0);
    const totProt  = comidashoy.reduce((s,c) => s + (parseFloat(c.prot)||0), 0);
    const totCarbs = comidashoy.reduce((s,c) => s + (parseFloat(c.carbs)||0), 0);
    const totGras  = comidashoy.reduce((s,c) => s + (parseFloat(c.grasas)||0), 0);

    // Calorías quemadas en gym hoy — leer del historial guardado (funciona aunque no esté en la sección gym)
    const hoyKey = (function(){ const d=new Date(); const off=d.getTimezoneOffset(); const l=new Date(d.getTime()-off*60000); return l.toISOString().slice(0,10); })();
    const sesionHoy = window._gymSesionesHistorial?.[hoyKey];
    const gymCalRaw = sesionHoy?.calorias ?? document.getElementById('gym-stat-calorias')?.textContent ?? '—';
    const gymCal = parseFloat(gymCalRaw) || 0;

    const kcalRestantes = obj.kcal - totKcal + gymCal;

    // Widget Calorías
    const fmt = n => Math.round(n).toLocaleString('es-ES');
    const elRest = document.getElementById('nutri-kcal-restantes');
    if (elRest) { elRest.textContent = fmt(kcalRestantes); elRest.style.color = kcalRestantes < 0 ? '#ef4444' : '#f1f5f9'; }
    const elObj = document.getElementById('nutri-kcal-obj-label');
    if (elObj) elObj.textContent = fmt(obj.kcal);
    const elCom = document.getElementById('nutri-kcal-comidas-label');
    if (elCom) elCom.textContent = fmt(totKcal);
    const elGym = document.getElementById('nutri-kcal-gym-label');
    if (elGym) elGym.textContent = fmt(gymCal);
    _nutriDrawDonut('nutri-kcal-donut', totKcal, obj.kcal, kcalRestantes < 0 ? '#ef4444' : '#10b981', 'rgba(255,255,255,0.06)');

    // Widget Macros
    const macros = [
        { id:'carbs', val: totCarbs, obj: obj.carbs, color:'#10b981' },
        { id:'grasas', val: totGras,  obj: obj.grasas, color:'#a78bfa' },
        { id:'prot',  val: totProt,  obj: obj.prot,  color:'#fbbf24' },
    ];
    macros.forEach(m => {
        const vEl = document.getElementById('nutri-'+m.id+'-val');
        const oEl = document.getElementById('nutri-'+m.id+'-obj');
        const rEl = document.getElementById('nutri-'+m.id+'-rest');
        if (vEl) vEl.textContent = Math.round(m.val);
        if (oEl) oEl.textContent = '/'+m.obj+'g';
        if (rEl) { const rest = m.obj - m.val; rEl.textContent = Math.round(rest) + ' g restantes'; rEl.style.color = rest < 0 ? '#ef4444' : '#475569'; }
        _nutriDrawDonut('nutri-'+m.id+'-donut', m.val, m.obj, m.color, 'rgba(255,255,255,0.06)');
    });
}

function renderNutricion() {
    if (!window.nutricionData) window.nutricionData = { comidas: [], registrosPeso: [] };
    const { desde, hasta } = _nutriGetRango();
    const filtro = window._nutriFiltro || 'dia';
    const esMultiple = filtro !== 'dia';
    let comidas = window.nutricionData.comidas.filter(c => {
        if (c.archivado) return false;
        if (!desde && !hasta) return true;
        const d = new Date(c.fecha + 'T12:00:00');
        if (desde && d < desde) return false;
        if (hasta && d > hasta) return false;
        return true;
    });
    // Filtro favoritos
    if (window._nutriSoloFav) comidas = comidas.filter(c => c.liked === 'true' || c.liked === true);
    // Ordenar por kcal
    if (window._nutriOrden === 'mayor') comidas = comidas.slice().sort((a,b) => (parseFloat(b.kcal)||0) - (parseFloat(a.kcal)||0));
    if (window._nutriOrden === 'menor') comidas = comidas.slice().sort((a,b) => (parseFloat(a.kcal)||0) - (parseFloat(b.kcal)||0));
    // Actualizar botones y vista
    if (typeof _nutriActualizarBtns === 'function') _nutriActualizarBtns();
    if (typeof _nutriActualizarVista === 'function') _nutriActualizarVista();
    const fechaEl = document.getElementById('nutri-fecha-label');
    if (fechaEl) {
        if (!esMultiple) {
            const offset = window._nutriNavOffset || 0;
            const d = new Date(); d.setDate(d.getDate() + offset);
            const s = d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
            fechaEl.textContent = s.toUpperCase();
        } else {
            const label = typeof _nutriGetLabel === 'function' ? _nutriGetLabel() : '';
            fechaEl.textContent = label.toUpperCase();
        }
    }
    // Widgets solo en modo diario
    const widgetsCol = document.getElementById('nutri-widgets-col');
    if (widgetsCol) widgetsCol.style.display = esMultiple ? 'none' : 'flex';
    const mainGrid = document.getElementById('nutri-main-grid');
    if (mainGrid) {
        if (esMultiple) {
            mainGrid.style.setProperty('grid-template-columns', '1fr', 'important');
            mainGrid.style.marginBottom = '12px';
        } else {
            mainGrid.style.removeProperty('grid-template-columns');
            mainGrid.style.marginBottom = '';
        }
    }
    const lista  = document.getElementById('carrusel-comidas');
    const empty  = document.getElementById('nutri-empty');
    if (!lista) return;

    const tipoIcono = { 'Desayuno':'bakery_dining','Almuerzo':'grocery','Comida':'dinner_dining','Merienda':'washoku','Cena':'meal_dinner','Snack':'cookie','Bebida':'wine_bar','Aperitivo':'tapas' };
    const tipoColor = { 'Desayuno':'#fbbf24','Almuerzo':'#fb923c','Comida':'#f97316','Merienda':'#a78bfa','Cena':'#60a5fa','Snack':'#10b981','Bebida':'#38bdf8','Aperitivo':'#f43f5e' };
    function _renderComidaRow(c) {
        const col         = tipoColor[c.tipo]  || '#10b981';
        const ic          = tipoIcono[c.tipo]  || 'dinner_dining';
        const imgs        = c.imagenes || [];
        const portada     = imgs[0] || null;
        const colorAccent = col;
        const badgeBg     = col + '40';
        const badgeBorder = col + '80';
        const isLiked     = c.liked === 'true' || c.liked === true;
        const macroStr    = [
            c.kcal   ? c.kcal   + ' kcal' : '',
            c.prot   ? c.prot   + 'g P'   : '',
            c.carbs  ? c.carbs  + 'g C'   : '',
            c.grasas ? c.grasas + 'g G'   : '',
        ].filter(Boolean).join('  ·  ');

        const thumbnailHTML = `<div class="card-thumbnail-placeholder" style="pointer-events:none;background:${col}40;border-color:${col}80;"><span class="material-symbols-rounded" style="font-size:22px;color:white;">${ic}</span></div>`;

        const bgHTML = portada
            ? `<img class="card-bg-img" src="${portada}" alt="">`
            : `<div class="card-bg-color" style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(135deg,${col}22 0%,${col}88 100%);"></div>
               <div style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:0;display:flex;align-items:center;justify-content:center;opacity:0.18;pointer-events:none;">
                   <span class="material-symbols-rounded" style="font-size:90px;color:white;">${ic}</span>
               </div>`;

        const likeColor  = isLiked ? '#ef4444' : 'rgba(255,255,255,0.7)';
        const likeFill   = isLiked ? "'FILL' 1" : "'FILL' 0";
        const likeBorder = isLiked ? 'rgba(220,38,38,0.6)' : 'rgba(255,255,255,0.1)';

        const div = document.createElement('div');
        div.className = 'reforma-preview-card card-input-group';
        div.dataset.nutriId    = c.id;
        div.dataset.nutriLiked = String(isLiked);

        div.innerHTML = `
            ${bgHTML}
            <div class="card-gradient"></div>
            <div class="card-shine" style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:50;pointer-events:none;overflow:hidden;border-radius:inherit;"></div>
            <div style="position:absolute;top:12px;left:12px;right:12px;z-index:3;display:flex;align-items:center;gap:6px;">
                <span class="card-badge" style="background:${badgeBg};color:white;border:1px solid ${badgeBorder};">${c.tipo.toUpperCase()}</span>
                <span class="card-ghost-heart" style="${isLiked ? 'display:flex' : 'display:none'};background:rgba(220,38,38,0.9);border:1px solid rgba(220,38,38,0.6);border-radius:50%;align-items:center;justify-content:center;width:22px;height:22px;flex-shrink:0;box-sizing:border-box;">
                    <span class="material-symbols-rounded" style="font-size:13px;color:white;font-variation-settings:'FILL' 1;">favorite</span>
                </span>
                <span style="font-size:10px;color:rgba(255,255,255,0.45);font-weight:600;">${c.hora}</span>
            </div>
            <div style="position:absolute;bottom:0;left:0;right:0;z-index:2;padding:10px 16px 12px 16px;box-sizing:border-box;">
                <div class="card-bottom">
                    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:8px;">
                        <div class="card-thumbnail-wrapper" style="position:relative;cursor:pointer;display:inline-flex;align-self:flex-start;" title="Mantén pulsado para añadir foto">
                            ${thumbnailHTML}
                        </div>
                        <div style="min-width:0;">
                            <p class="card-titulo-preview">${c.nombre}</p>
                            ${c.nota ? `<p style="font-size:10px;color:rgba(255,255,255,0.45);margin:3px 0 0;line-height:1.3;font-weight:500;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${c.nota}</p>` : ''}
                            <div style="margin-top:6px;">
                                <span style="color:${colorAccent};font-size:14px;font-weight:700;text-shadow:0 0 12px ${colorAccent}44;">${c.cantidad} ${_nutriFmtUnidad(c.unidad, c.cantidad)}</span>
                            </div>
                            ${macroStr ? `<div style="font-size:10px;color:rgba(255,255,255,0.4);margin-top:4px;font-weight:600;">${macroStr}</div>` : ''}
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="card-btn-explorar card-btn-icon nutri-btn-editar"
                            style="flex:1;padding:8px 0 !important;border-radius:10px !important;font-size:10px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;text-align:center;display:flex;align-items:center;justify-content:center;gap:4px;"
                            onmouseenter="this.style.borderColor='${colorAccent}';this.style.color='${colorAccent}';"
                            onmouseleave="this.style.borderColor='rgba(255,255,255,0.1)';this.style.color='#64748b';"
                            onclick="event.stopPropagation();_nutriAbrirEdit(this.closest('[data-nutri-id]').dataset.nutriId)">
                            <span class="material-symbols-rounded nutri-btn-editar-icon" style="font-size:15px;line-height:1;">edit</span>
                            <span class="nutri-btn-editar-label">EDITAR</span>
                        </button>
                        <button class="card-btn-icon nutri-like-btn${isLiked ? ' liked' : ''}"
                            style="border-color:${likeBorder};color:${likeColor};"
                            onmouseenter="this.style.borderColor='rgba(255,255,255,0.5)';this.style.color='white';"
                            onmouseleave="_nutriLikeLeave(this);"
                            onclick="event.stopPropagation();_nutriToggleLike(this)" title="Me gusta">
                            <span class="material-symbols-rounded" style="font-size:16px;font-variation-settings:${likeFill};">favorite</span>
                        </button>
                        <button class="card-btn-icon"
                            onmouseenter="this.style.borderColor='${colorAccent}';this.style.color='${colorAccent}';"
                            onmouseleave="this.style.borderColor='rgba(255,255,255,0.1)';this.style.color='#64748b';"
                            onclick="event.stopPropagation();_nutriAbrirLink(this.closest('[data-nutri-id]').dataset.nutriId)" title="Abrir enlace">
                            <span class="material-symbols-rounded" style="font-size:16px;">open_in_new</span>
                        </button>
                        <button class="card-btn-icon"
                            onmouseenter="this.style.borderColor='rgba(248,113,113,0.6)';this.style.color='#f87171';"
                            onmouseleave="this.style.borderColor='rgba(255,255,255,0.1)';this.style.color='#64748b';"
                            onclick="event.stopPropagation();_nutriEliminarComida(this.closest('[data-nutri-id]').dataset.nutriId)" title="Eliminar">
                            <span class="material-symbols-rounded" style="font-size:16px;">delete</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        const borderDiv = document.createElement('div');
        borderDiv.className = 'card-gradient-border';
        div.appendChild(borderDiv);

        div.addEventListener('click', (e) => {
            if (e.target.closest('button') || e.target.closest('.card-actions') || e.target.closest('.card-thumbnail-wrapper')) return;
            e.stopPropagation();
            _nutriCentrarCard(div);
        });
        div.addEventListener('touchstart', () => div.classList.add('touch-active'), { passive: true });
        div.addEventListener('touchend',   () => setTimeout(() => div.classList.remove('touch-active'), 400), { passive: true });

        setTimeout(() => {
            const tw = div.querySelector('.card-thumbnail-wrapper');
            if (!tw) return;
            let lp;
            tw.addEventListener('touchstart', (e) => { e.stopPropagation(); lp = setTimeout(() => { if (navigator.vibrate) navigator.vibrate(40); _nutriAbrirEdit(c.id); }, 800); }, { passive: true });
            tw.addEventListener('touchend',  (e) => { e.stopPropagation(); clearTimeout(lp); }, { passive: true });
            tw.addEventListener('touchmove', () => clearTimeout(lp), { passive: true });
            tw.addEventListener('mousedown', (e) => { e.stopPropagation(); lp = setTimeout(() => _nutriAbrirEdit(c.id), 800); });
            tw.addEventListener('mouseup',   (e) => { e.stopPropagation(); clearTimeout(lp); });
            tw.addEventListener('mouseleave',() => clearTimeout(lp));
        }, 0);

        return div;
    }

    const trackEl   = document.getElementById('carrusel-comidas');
    const wrapperEl = document.getElementById('carrusel-comidas-wrapper');
    const dotsEl    = document.getElementById('dots-comidas');

    if (!esMultiple) {
        // ── Modo diario: carrusel único ──────────────────────────────
        if (comidas.length === 0) {
            if (trackEl) trackEl.innerHTML = '';
            if (wrapperEl) wrapperEl.style.display = 'none';
            if (dotsEl) dotsEl.innerHTML = '';
            if (empty) empty.style.display = 'block';
        } else {
            if (empty) empty.style.display = 'none';
            if (wrapperEl) wrapperEl.style.display = '';
            if (trackEl) {
                trackEl.innerHTML = '';
                comidas.forEach(c => trackEl.appendChild(_renderComidaRow(c)));
            }
            _nutriRenderDots(comidas.length);
            if (window.innerWidth >= 768) {
                setTimeout(() => {
                    const w = document.getElementById('carrusel-comidas-wrapper');
                    if (w) { w._dragScrollInit = false; if (typeof _initCarruselDragScroll === 'function') _initCarruselDragScroll(w); }
                }, 0);
            }
        }
    } else {
        // ── Modo múltiple: un carrusel por día ───────────────────────
        if (wrapperEl) wrapperEl.style.display = 'none';
        if (dotsEl) dotsEl.innerHTML = '';
        if (trackEl) trackEl.innerHTML = '';

        const _DIAS_ES  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
        const _MESES_FULL = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
        const hoyStr = new Date().toISOString().slice(0,10);

        // Agrupar comidas por fecha
        const porFecha = {};
        comidas.forEach(c => {
            const key = c.fecha;
            if (!porFecha[key]) porFecha[key] = [];
            porFecha[key].push(c);
        });

        const fechasOrdenadas = Object.keys(porFecha).sort((a,b) => b.localeCompare(a));

        const container = document.getElementById('nutri-carrusel-col');
        // Limpiar carruseles de días anteriores
        container.querySelectorAll('._nutriDiaBlock').forEach(el => el.remove());

        if (fechasOrdenadas.length === 0) {
            if (empty) empty.style.display = 'block';
        } else {
            if (empty) empty.style.display = 'none';
            fechasOrdenadas.forEach(fechaKey => {
                const comidasDia = porFecha[fechaKey];
                const d = new Date(fechaKey + 'T12:00:00');
                const diaSem = _DIAS_ES[d.getDay()];
                const diaMes = d.getDate();
                const mes    = _MESES_FULL[d.getMonth()];
                const esHoy  = fechaKey === hoyStr;

                const totKcal  = comidasDia.reduce((s,c) => s + (parseFloat(c.kcal)||0), 0);
                const totProt  = comidasDia.reduce((s,c) => s + (parseFloat(c.prot)||0), 0);
                const totCarbs = comidasDia.reduce((s,c) => s + (parseFloat(c.carbs)||0), 0);
                const totGras  = comidasDia.reduce((s,c) => s + (parseFloat(c.grasas)||0), 0);

                const macroHtml = [
                    totKcal  ? `<span style="color:#f97316;font-size:11px;font-weight:700;">${Math.round(totKcal)} kcal</span>` : '',
                    totProt  ? `<span style="color:#60a5fa;font-size:11px;font-weight:700;">${Math.round(totProt)}g P</span>` : '',
                    totCarbs ? `<span style="color:#fbbf24;font-size:11px;font-weight:700;">${Math.round(totCarbs)}g C</span>` : '',
                    totGras  ? `<span style="color:#a78bfa;font-size:11px;font-weight:700;">${Math.round(totGras)}g G</span>` : '',
                ].filter(Boolean).join('<span style="color:#334155;margin:0 4px;">·</span>');

                const bloque = document.createElement('div');
                bloque.className = '_nutriDiaBlock';
                bloque.style.cssText = 'margin-bottom:24px;';

                bloque.innerHTML = `
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding:0 2px;">
                        <span style="color:#f1f5f9;font-size:14px;font-weight:800;">${diaSem} ${diaMes} ${mes}</span>
                        ${esHoy ? '<span style="background:rgba(16,185,129,0.15);color:#10b981;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;padding:2px 7px;border-radius:6px;border:1px solid rgba(16,185,129,0.3);">HOY</span>' : ''}
                        ${macroHtml ? `<span style="margin-left:auto;display:flex;align-items:center;gap:6px;">${macroHtml}</span>` : ''}
                    </div>
                    <div class="_nutriDiaWrapper" style="overflow-x:auto;overflow-y:visible;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:6px;">
                        <div class="_nutriDiaTrack" style="display:flex;gap:14px;padding:2px 2px 6px;width:max-content;"></div>
                    </div>
                `;
                bloque.querySelector('._nutriDiaWrapper style') && bloque.querySelector('._nutriDiaWrapper style').remove();

                const track = bloque.querySelector('._nutriDiaTrack');
                comidasDia.forEach(c => {
                    const card = _renderComidaRow(c);
                    card.style.width = '220px';
                    card.style.minWidth = '220px';
                    card.style.flexShrink = '0';
                    track.appendChild(card);
                });

                // Drag-scroll solo en desktop; en móvil el scroll nativo es más fluido
                if (window.innerWidth >= 768) {
                    setTimeout(() => {
                        const wrapper = bloque.querySelector('._nutriDiaWrapper');
                        if (wrapper && typeof _initCarruselDragScroll === 'function') {
                            wrapper._dragScrollInit = false;
                            _initCarruselDragScroll(wrapper);
                        }
                    }, 0);
                }

                container.appendChild(bloque);
            });
        }
    }
    const bar = document.getElementById('nutri-macros-bar');
    if (bar && comidas.length > 0) {
        const totKcal = comidas.reduce((s,c) => s+(c.kcal||0), 0);
        const totProt = comidas.reduce((s,c) => s+(c.prot||0), 0);
        const totCarbs= comidas.reduce((s,c) => s+(c.carbs||0), 0);
        const totGras = comidas.reduce((s,c) => s+(c.grasas||0), 0);
        const macro = (val,label,col) => val > 0 ? `<div style="display:flex;align-items:center;gap:5px;"><span style="width:6px;height:6px;border-radius:50%;background:${col};display:inline-block;"></span><span style="font-size:11px;font-weight:700;color:${col};">${Math.round(val)}${label}</span></div>` : '';
        bar.innerHTML = macro(totKcal,'kcal','#f97316') + macro(totProt,'g prot','#60a5fa') + macro(totCarbs,'g C','#fbbf24') + macro(totGras,'g G','#a78bfa');
    } else if (bar) { bar.innerHTML = ''; }
    if (typeof _renderNutriPesoChart === 'function') {
        const _cv = document.getElementById('nutri-peso-canvas');
        if (_cv && _cv.offsetHeight === 0) {
            requestAnimationFrame(() => requestAnimationFrame(_renderNutriPesoChart));
        } else {
            if (_cv && _cv._chartInst) { _cv._chartInst.destroy(); _cv._chartInst = null; }
            _renderNutriPesoChart();
        }
    }
    _nutriRenderWidgets();
}

function _renderNutriPesoChart() {
    const canvas = document.getElementById('nutri-peso-canvas');
    const empty  = document.getElementById('nutri-peso-empty');
    const todos = (window.nutricionData?.registrosPeso || []).slice().sort((a,b) => a.fecha.localeCompare(b.fecha));
    const filtro = window._nutriFiltro || 'dia';
    const rango = (typeof _nutriGetRango === 'function') ? _nutriGetRango() : { desde: null, hasta: null };
    let registros;
    if (filtro === 'dia') {
        const offset = window._nutriNavOffset || 0;
        const centro = new Date(); centro.setDate(centro.getDate() + offset);
        const hasta7 = new Date(centro); hasta7.setHours(23,59,59,999);
        const desde7 = new Date(centro); desde7.setDate(desde7.getDate() - 6); desde7.setHours(0,0,0,0);
        registros = todos.filter(r => { const f = new Date(r.fecha+'T12:00:00'); return f >= desde7 && f <= hasta7; });
    } else if (filtro === 'semana') {
        const offset = window._nutriNavOffset || 0;
        const now = new Date();
        const lun = new Date(now); lun.setDate(now.getDate() - ((now.getDay()+6)%7) + offset*7); lun.setHours(0,0,0,0);
        const dom = new Date(lun); dom.setDate(lun.getDate()+6); dom.setHours(23,59,59,999);
        registros = todos.filter(r => { const f = new Date(r.fecha+'T12:00:00'); return f >= lun && f <= dom; });
    } else if (filtro === 'mes') {
        const offset = window._nutriNavOffset || 0;
        const now = new Date();
        const desde = new Date(now.getFullYear(), now.getMonth() + offset, 1);
        const hasta = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0, 23,59,59,999);
        registros = todos.filter(r => { const f = new Date(r.fecha+'T12:00:00'); return f >= desde && f <= hasta; });
    } else if (filtro === 'ano') {
        const offset = window._nutriNavOffset || 0;
        const y = new Date().getFullYear() + offset;
        const desde = new Date(y,0,1); const hasta = new Date(y,11,31,23,59,59,999);
        registros = todos.filter(r => { const f = new Date(r.fecha+'T12:00:00'); return f >= desde && f <= hasta; });
    } else {
        registros = todos; // 'todo' — sin límite
    }
    const statActual = document.getElementById('nutri-peso-stat-actual');
    const statDiff   = document.getElementById('nutri-peso-stat-diff');
    const subtitle   = document.getElementById('nutri-peso-subtitle');

    if (registros.length >= 1 && statActual) {
        const last = registros[registros.length-1].peso;
        statActual.textContent = last.toFixed(1) + ' kg';
        if (registros.length >= 2 && statDiff) {
            const diff = last - registros[0].peso;
            const sign = diff > 0 ? '+' : '';
            statDiff.textContent = sign + diff.toFixed(1) + ' kg';
            statDiff.style.color = diff <= 0 ? '#10b981' : '#f97316';
        } else if (statDiff) { statDiff.textContent = '—'; }
    } else {
        if (statActual) statActual.textContent = '—';
        if (statDiff)   statDiff.textContent   = '—';
    }
    if (subtitle && registros.length >= 2) {
        const fmt = f => new Date(f+'T12:00:00').toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'});
        subtitle.textContent = fmt(registros[0].fecha) + ' – ' + fmt(registros[registros.length-1].fecha);
    } else if (subtitle) {
        subtitle.textContent = (typeof _nutriGetLabel === 'function') ? _nutriGetLabel() : 'Evolución registrada';
    }
    _nutriRenderListaPeso(filtro, rango);

    const chartWrap = document.getElementById('nutri-peso-chart-wrap');
    if (!canvas) return;
    if (registros.length < 1) {
        canvas.style.display = 'none';
        if (chartWrap) chartWrap.style.display = 'none';
        if (empty) empty.style.display = 'flex';
        if (canvas._chartInst) { canvas._chartInst.destroy(); canvas._chartInst = null; }
        return;
    }
    // Si solo hay 1 registro, duplicarlo para que la línea salga horizontal
    if (registros.length === 1) {
        registros = [registros[0], registros[0]];
    }
    if (chartWrap) chartWrap.style.display = 'block';
    canvas.style.display = 'block';
    if (empty) empty.style.display = 'none';
    const filtroActivo = window._nutriFiltro || 'dia';

    // ── Agrupación según filtro ──────────────────────────────────────────────
    // dia / semana → puntos individuales, ventana de 7 días
    // mes          → puntos individuales, ventana del mes (≤31)
    // ano          → media semanal (agrupa por año+semanaISO)
    // todo         → media mensual (agrupa por año+mes)
    let registrosFiltrados, pesos, labels;

    function _isoWeek(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const day = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - day);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return d.getUTCFullYear() + '-W' + String(Math.ceil((((d - yearStart) / 86400000) + 1) / 7)).padStart(2, '0');
    }

    function _groupBy(regs, keyFn, labelFn) {
        const map = new Map();
        regs.forEach(r => {
            const k = keyFn(r);
            if (!map.has(k)) map.set(k, { sum: 0, count: 0, label: labelFn(r), key: k });
            const g = map.get(k); g.sum += r.peso; g.count++;
        });
        const groups = Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));
        return {
            pesos:  groups.map(g => parseFloat((g.sum / g.count).toFixed(1))),
            labels: groups.map(g => g.label)
        };
    }

    if (filtroActivo === 'dia' || filtroActivo === 'semana') {
        // Ventana de 7 días: cada registro es un punto
        registrosFiltrados = registros;
        pesos  = registrosFiltrados.map(r => r.peso);
        labels = registrosFiltrados.map(r => {
            const d = new Date(r.fecha + 'T12:00:00');
            return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
        });
    } else if (filtroActivo === 'mes') {
        // Mes: cada registro es un punto, label día del mes
        registrosFiltrados = registros;
        pesos  = registrosFiltrados.map(r => r.peso);
        labels = registrosFiltrados.map(r => {
            const d = new Date(r.fecha + 'T12:00:00');
            return d.getDate() + ' ' + d.toLocaleDateString('es-ES', { month: 'short' });
        });
    } else if (filtroActivo === 'ano') {
        // Año: media por semana ISO
        const result = _groupBy(
            registros,
            r => _isoWeek(new Date(r.fecha + 'T12:00:00')),
            r => { const d = new Date(r.fecha + 'T12:00:00'); return d.getDate() + ' ' + d.toLocaleDateString('es-ES', { month: 'short' }); }
        );
        pesos  = result.pesos;
        labels = result.labels;
        registrosFiltrados = registros; // solo para min/max
    } else {
        // Todo: media por mes
        const result = _groupBy(
            registros,
            r => r.fecha.slice(0, 7),
            r => { const d = new Date(r.fecha + 'T12:00:00'); return d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }); }
        );
        pesos  = result.pesos;
        labels = result.labels;
        registrosFiltrados = registros;
    }
    // Si tras agrupar solo hay 1 punto, duplicarlo para línea horizontal
    if (pesos.length === 1) {
        pesos  = [pesos[0],  pesos[0]];
        labels = [labels[0], labels[0]];
    }
    const maxPeso = Math.max(...pesos);
    const minPeso = Math.min(...pesos);
    const iMax = pesos.indexOf(maxPeso);
    const iMin = pesos.indexOf(minPeso);

    const mostrarPuntos = pesos.length <= 30;
    const pointColors       = pesos.map((p,i) => i === iMax ? '#ef4444' : '#10b981');
    const pointRadii        = pesos.map((p,i) => {
        if (i === iMax || i === iMin) return 7;
        return mostrarPuntos ? 4 : 0;
    });
    const pointBorderWidths = pesos.map((p,i) => (i===iMax||i===iMin) ? 2.5 : (mostrarPuntos ? 2 : 0));

    function _openEditModal(idx) {
        const reg = registrosFiltrados[idx];
        if (!reg) return;
        window._editPesoFechaOrig = reg.fecha;
        document.getElementById('edit-peso-valor').value = reg.peso;
        document.getElementById('edit-peso-fecha').value = reg.fecha;
        document.getElementById('edit-peso-nota').value  = reg.nota || '';
        const m = document.getElementById('modalEditarPeso');
        if (m) m.style.display = 'flex';
    }

    function _drawChart() {
        const ctx   = canvas.getContext('2d');
        const chartH = canvas.parentElement.offsetHeight || 220;
        const grad  = ctx.createLinearGradient(0, 0, 0, chartH);
        grad.addColorStop(0,   'rgba(16,185,129,0.4)');
        grad.addColorStop(0.6, 'rgba(16,185,129,0.1)');
        grad.addColorStop(1,   'rgba(16,185,129,0)');

        if (canvas._chartInst) { canvas._chartInst.destroy(); canvas._chartInst = null; }
        if (canvas._lpTimer)   { clearTimeout(canvas._lpTimer); canvas._lpTimer = null; }
        if (canvas._pulseInterval) { clearInterval(canvas._pulseInterval); canvas._pulseInterval = null; }

        let _lpFired = false;

        canvas._chartInst = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Peso (kg)',
                    data: pesos,
                    fill: true,
                    backgroundColor: grad,
                    borderColor: '#10b981',
                    borderWidth: 2.5,
                    pointBackgroundColor: pointColors,
                    pointBorderColor: 'rgba(13,19,33,0.95)',
                    pointBorderWidth: pointBorderWidths,
                    pointRadius: pointRadii,
                    pointHoverRadius: pesos.map((p,i) => (i===iMax||i===iMin) ? 10 : 7),
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 600, easing: 'easeOutQuart' },
                interaction: { mode: 'nearest', intersect: false, axis: 'x' },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        backgroundColor: '#1c2128',
                        titleColor: '#94a3b8',
                        titleFont: { size: 11, weight: 'bold' },
                        bodyColor: '#f1f5f9',
                        bodyFont: { size: 15, weight: 'bold' },
                        borderColor: '#334155',
                        borderWidth: 1,
                        displayColors: false,
                        padding: 12,
                        callbacks: {
                            title: items => items[0].label,
                            label: c => {
                                const v = c.parsed.y.toFixed(1) + ' kg';
                                const i = c.dataIndex;
                                if (i === iMax) return '▲ ' + v + ' (máximo)';
                                if (i === iMin) return '▼ ' + v + ' (mínimo)';
                                return v;
                            }
                        }
                    }
                },
                onHover: (e, els) => {
                    canvas.style.cursor = els.length ? 'pointer' : 'default';
                },
                onClick: (e, els) => {
                    if (!els.length) return;
                    if (_lpFired) { _lpFired = false; return; }
                },
                scales: {
                    x: {
                        grid: { display: false, drawBorder: false },
                        border: { display: false },
                        ticks: { color: '#475569', font: { size: 11 }, maxTicksLimit: 7 }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
                        border: { display: false },
                        ticks: { color: '#475569', font: { size: 11 }, callback: v => v + ' kg', maxTicksLimit: 6 }
                    }
                }
            }
        });
        let _startX = 0, _startY = 0;

        function _ptFromClient(clientX, clientY) {
            const chart = canvas._chartInst;
            if (!chart) return null;
            const rect = canvas.getBoundingClientRect();
            const pts = chart.getElementsAtEventForMode(
                { offsetX: clientX - rect.left, offsetY: clientY - rect.top, native: {} },
                'nearest', { intersect: false }, false
            );
            return pts.length ? pts[0].index : null;
        }

        function _onStart(clientX, clientY) {
            _lpFired = false;
            _startX = clientX; _startY = clientY;
            const idx = _ptFromClient(clientX, clientY);
            if (idx === null) return;
            canvas._lpTimer = setTimeout(() => {
                _lpFired = true;
                if (navigator.vibrate) navigator.vibrate(30);
                _openEditModal(idx);
            }, 550);
        }
        function _onMove(clientX, clientY) {
            if (!canvas._lpTimer) return;
            if (Math.abs(clientX - _startX) > 8 || Math.abs(clientY - _startY) > 8) {
                clearTimeout(canvas._lpTimer); canvas._lpTimer = null;
            }
        }
        function _onEnd() { clearTimeout(canvas._lpTimer); canvas._lpTimer = null; }
        if (canvas._pesoTS) canvas.removeEventListener('touchstart', canvas._pesoTS);
        if (canvas._pesoTM) canvas.removeEventListener('touchmove',  canvas._pesoTM);
        if (canvas._pesoTE) canvas.removeEventListener('touchend',   canvas._pesoTE);
        if (canvas._pesoMD) canvas.removeEventListener('mousedown',  canvas._pesoMD);
        if (canvas._pesoMU) canvas.removeEventListener('mouseup',    canvas._pesoMU);

        canvas._pesoTS = e => _onStart(e.touches[0].clientX, e.touches[0].clientY);
        canvas._pesoTM = e => _onMove(e.touches[0].clientX, e.touches[0].clientY);
        canvas._pesoTE = ()  => _onEnd();
        canvas._pesoMD = e => _onStart(e.clientX, e.clientY);
        canvas._pesoMU = ()  => _onEnd();

        canvas.addEventListener('touchstart', canvas._pesoTS, { passive: true });
        canvas.addEventListener('touchmove',  canvas._pesoTM, { passive: true });
        canvas.addEventListener('touchend',   canvas._pesoTE, { passive: true });
        canvas.addEventListener('mousedown',  canvas._pesoMD);
        canvas.addEventListener('mouseup',    canvas._pesoMU);
    }

    if (typeof Chart !== 'undefined') {
        _drawChart();
    } else {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        s.onload = _drawChart;
        document.head.appendChild(s);
    }

}

function _nutriRenderListaPeso(filtro, rango) {
    const listaPeso = document.getElementById('nutri-peso-lista');
    if (!listaPeso) return;
    const todosRango = (window.nutricionData?.registrosPeso || [])
        .filter(r => {
            const f = new Date(r.fecha + 'T12:00:00');
            if (filtro === 'dia') {
                if (rango && rango.desde && rango.hasta) return f >= rango.desde && f <= rango.hasta;
                const hoy = new Date(); hoy.setHours(0,0,0,0);
                const fin = new Date(); fin.setHours(23,59,59,999);
                return f >= hoy && f <= fin;
            }
            if (rango && rango.desde && rango.hasta) return f >= rango.desde && f <= rango.hasta;
            return true;
        })
        .slice().sort((a,b) => b.fecha.localeCompare(a.fecha));

    if (todosRango.length === 0) { listaPeso.innerHTML = ''; return; }
    const esHoy = filtro === 'dia' && !(rango && rango.desde && rango.hasta);

    const cardsHtml = todosRango.map(r => {
        const d = new Date(r.fecha + 'T12:00:00');
        const label = d.toLocaleDateString('es-ES', { weekday:'short', day:'numeric', month:'short', year:'numeric' });
        const notaHtml = r.nota ? `<span style="font-size:11px;color:#475569;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r.nota}</span>` : '';
        return `<div style="display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.1);">
            <span class="material-symbols-rounded" style="font-size:16px;color:#10b981;flex-shrink:0;">monitor_weight</span>
            <span style="flex:1;font-size:13px;color:#94a3b8;">${label}</span>
            <span style="font-size:15px;font-weight:800;color:#10b981;">${r.peso.toFixed(1)} kg</span>
            ${notaHtml}
            <button onclick="_nutriAbrirEditarPeso('${r.fecha}','${r.peso}','${r.nota||''}' )" style="background:none;border:none;color:#334155;cursor:pointer;padding:2px;flex-shrink:0;" onmouseover="this.style.color='#10b981'" onmouseout="this.style.color='#334155'">
                <span class="material-symbols-rounded" style="font-size:16px;">edit</span>
            </button>
            <button onclick="_nutriEliminarPesoDirecto('${r.fecha}')" style="background:none;border:none;color:#334155;cursor:pointer;padding:2px;flex-shrink:0;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#334155'">
                <span class="material-symbols-rounded" style="font-size:16px;">delete</span>
            </button>
        </div>`;
    }).join('');

    if (esHoy) {
        listaPeso.innerHTML = `<div style="display:flex;flex-direction:column;gap:6px;">${cardsHtml}</div>`;
    } else {
        const isOpen = listaPeso._pesoListaOpen === true;
        listaPeso.innerHTML = `
            <div>
                <button id="nutri-peso-lista-toggle" onclick="
                    var body = document.getElementById('nutri-peso-lista-body');
                    var arrow = document.getElementById('nutri-peso-lista-arrow');
                    var lista = document.getElementById('nutri-peso-lista');
                    if (body.style.display === 'none') {
                        body.style.display = 'flex';
                        arrow.style.transform = 'rotate(180deg)';
                        lista._pesoListaOpen = true;
                    } else {
                        body.style.display = 'none';
                        arrow.style.transform = 'rotate(0deg)';
                        lista._pesoListaOpen = false;
                    }
                " style="width:100%;display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:10px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.15);cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='rgba(16,185,129,0.1)'" onmouseout="this.style.background='rgba(16,185,129,0.06)'">
                    <span class="material-symbols-rounded" style="font-size:16px;color:#10b981;flex-shrink:0;">history</span>
                    <span style="flex:1;font-size:13px;font-weight:600;color:#94a3b8;text-align:left;">Histórico de pesos</span>
                    <span style="font-size:12px;color:#475569;font-weight:600;">${todosRango.length} registro${todosRango.length !== 1 ? 's' : ''}</span>
                    <span id="nutri-peso-lista-arrow" class="material-symbols-rounded" style="font-size:18px;color:#475569;transition:transform 0.2s;transform:${isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};">expand_more</span>
                </button>
                <div id="nutri-peso-lista-body" style="display:${isOpen ? 'flex' : 'none'};flex-direction:column;gap:6px;margin-top:6px;">
                    ${cardsHtml}
                </div>
            </div>`;
    }
}

function _nutriAbrirEditarPeso(fecha, peso, nota) {
    window._editPesoFechaOrig = fecha;
    document.getElementById('edit-peso-valor').value = peso;
    document.getElementById('edit-peso-fecha').value = fecha;
    document.getElementById('edit-peso-nota').value  = nota || '';
    const m = document.getElementById('modalEditarPeso');
    if (m) m.style.display = 'flex';
    window._epCalInit(document.getElementById('edit-peso-cal'), document.getElementById('edit-peso-fecha'));
}

function _nutriEliminarPesoDirecto(fecha) {
    if (!window.nutricionData) return;
    window.nutricionData.registrosPeso = window.nutricionData.registrosPeso.filter(r => r.fecha !== fecha);
    if (typeof guardarDatos === 'function') guardarDatos();
    if (typeof renderNutricion === 'function') renderNutricion();
    if (typeof _mostrarToast === 'function') _mostrarToast('delete', '#ef4444', 'Registro eliminado');
}
window._nutriScannerStream = null;
window._nutriScannerRAF    = null;
window._nutriScannerFound  = null;

function _nutriAbrirScanner() {
    const modal = document.getElementById('modalNutriScanner');
    if (!modal) return;
    window._nutriScannerFound = null;
    document.getElementById('nutri-scanner-result').style.display = 'none';
    document.getElementById('nutri-scanner-confirm-btn').style.display = 'none';
    _nutriScannerSetStatus('Iniciando cámara...', '#94a3b8');
    modal.style.display = 'flex';
    function _startCamera() {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                window._nutriScannerStream = stream;
                const video = document.getElementById('nutri-scanner-video');
                video.srcObject = stream;
                video.play();
                _nutriScannerSetStatus('Apunta al código de barras', '#94a3b8');
                video.addEventListener('canplay', () => {
                    const _waitDims = () => {
                        if (video.videoWidth > 0 && video.videoHeight > 0) {
                            _nutriScannerLoop();
                        } else {
                            setTimeout(_waitDims, 100);
                        }
                    };
                    _waitDims();
                }, { once: true });
            })
            .catch(err => {
                _nutriScannerSetStatus('Sin acceso a la cámara', '#ef4444');
            });
    }

    if ('BarcodeDetector' in window || typeof ZXing !== 'undefined') {
        _startCamera();
    } else {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@zxing/library@0.20.0/umd/index.min.js';
        s.onload = _startCamera;
        s.onerror = () => _nutriScannerSetStatus('Error cargando escáner', '#ef4444');
        document.head.appendChild(s);
    }
}

function _nutriScannerLoop() {
    const video = document.getElementById('nutri-scanner-video');
    if (!video || !window._nutriScannerStream) return;

    // Intentar BarcodeDetector nativo (Chrome/Android — acelerado por hardware)
    if ('BarcodeDetector' in window) {
        const detector = new BarcodeDetector({
            formats: ['ean_13','ean_8','upc_a','upc_e','code_128','code_39','itf','qr_code','data_matrix']
        });
        async function _scanNativo() {
            if (!window._nutriScannerStream) return;
            try {
                const barcodes = await detector.detect(video);
                if (barcodes.length > 0) {
                    const barcode = barcodes[0].rawValue;
                    _nutriScannerSetStatus('✓ ' + barcode, '#10b981');
                    if (navigator.vibrate) navigator.vibrate([50,30,50]);
                    _nutriBuscarPorBarcode(barcode);
                    return;
                }
            } catch(e) {}
            window._nutriScannerRAF = requestAnimationFrame(_scanNativo);
        }
        window._nutriScannerRAF = requestAnimationFrame(_scanNativo);
        return;
    }

    // Fallback: ZXing
    const hints = new Map();
    hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [
        ZXing.BarcodeFormat.EAN_13,
        ZXing.BarcodeFormat.EAN_8,
        ZXing.BarcodeFormat.UPC_A,
        ZXing.BarcodeFormat.UPC_E,
        ZXing.BarcodeFormat.CODE_128,
        ZXing.BarcodeFormat.CODE_39,
        ZXing.BarcodeFormat.CODE_93,
        ZXing.BarcodeFormat.ITF,
        ZXing.BarcodeFormat.CODABAR,
        ZXing.BarcodeFormat.DATA_MATRIX,
        ZXing.BarcodeFormat.QR_CODE,
        ZXing.BarcodeFormat.AZTEC,
        ZXing.BarcodeFormat.PDF_417,
    ]);
    hints.set(ZXing.DecodeHintType.TRY_HARDER, true);
    const reader = new ZXing.MultiFormatReader();
    reader.setHints(hints);

    const offscreen = document.createElement('canvas');
    const ctx = offscreen.getContext('2d');

    function _scan() {
        if (!window._nutriScannerStream) return;
        try {
            const W = video.videoWidth  || 640;
            const H = video.videoHeight || 480;
            if (offscreen.width !== W)  offscreen.width  = W;
            if (offscreen.height !== H) offscreen.height = H;
            ctx.drawImage(video, 0, 0, W, H);
            const imageData = ctx.getImageData(0, 0, W, H);
            const lum = new ZXing.RGBLuminanceSource(imageData.data, W, H);
            const bmp = new ZXing.BinaryBitmap(new ZXing.HybridBinarizer(lum));
            const result = reader.decode(bmp);
            if (result) {
                const barcode = result.getText();
                _nutriScannerSetStatus('✓ ' + barcode, '#10b981');
                cancelAnimationFrame(window._nutriScannerRAF);
                if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
                _nutriBuscarPorBarcode(barcode);
                return;
            }
        } catch(e) { /* sin resultado aún */ }
        window._nutriScannerRAF = requestAnimationFrame(_scan);
    }
    window._nutriScannerRAF = requestAnimationFrame(_scan);
}

async function _nutriBuscarPorBarcode(barcode) {
    _nutriScannerSetStatus('Buscando producto...', '#fbbf24');
    try {
        const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
        const res  = await fetch(url);
        const data = await res.json();
        if (data.status !== 1 || !data.product) {
            _nutriScannerSetStatus('Producto no encontrado en la base de datos', '#ef4444');
            setTimeout(() => {
                if (window._nutriScannerStream) {
                    _nutriScannerSetStatus('Apunta al código de barras', '#94a3b8');
                    _nutriScannerLoop();
                }
            }, 2500);
            return;
        }
        const p = data.product;
        const n = p.product_name || p.product_name_es || 'Producto desconocido';
        const brands = p.brands ? ` (${p.brands.split(',')[0].trim()})` : '';
        const nm = p.nutriments || {};
        window._nutriScannerFound = {
            nombre: n + brands,
            kcal:   Math.round(nm['energy-kcal_100g'] || (nm['energy_100g'] ? nm['energy_100g']/4.184 : 0) || 0),
            prot:   Math.round((nm['proteins_100g']       || 0) * 10) / 10,
            carbs:  Math.round((nm['carbohydrates_100g']  || 0) * 10) / 10,
            grasas: Math.round((nm['fat_100g']            || 0) * 10) / 10,
        };
        const resultEl = document.getElementById('nutri-scanner-result');
        const nameEl   = document.getElementById('nutri-scanner-result-name');
        const macrosEl = document.getElementById('nutri-scanner-result-macros');
        const confirmBtn = document.getElementById('nutri-scanner-confirm-btn');
        nameEl.textContent   = n + brands;
        const f = window._nutriScannerFound;
        macrosEl.textContent = `${f.kcal} kcal · ${f.prot}g prot · ${f.carbs}g carbs · ${f.grasas}g grasas (por 100g)`;
        resultEl.style.display  = 'block';
        confirmBtn.style.display = 'block';
        _nutriScannerSetStatus('✓ Encontrado', '#10b981');
    } catch(e) {
        _nutriScannerSetStatus('Error de red, inténtalo de nuevo', '#ef4444');
    }
}

function _nutriScannerConfirmar() {
    const f = window._nutriScannerFound;
    if (!f) return;
    window._nutriSearchBase = { kcal: f.kcal, prot: f.prot, carbs: f.carbs, grasas: f.grasas };
    document.getElementById('nutri-input-nombre').value = f.nombre;
    _nutriRecalcularPorCantidad();
    _nutriCerrarScanner();
}

function _nutriCerrarScanner() {
    cancelAnimationFrame(window._nutriScannerRAF);
    window._nutriScannerRAF = null;
    if (window._nutriScannerStream) {
        window._nutriScannerStream.getTracks().forEach(t => t.stop());
        window._nutriScannerStream = null;
    }
    const video = document.getElementById('nutri-scanner-video');
    if (video) { video.srcObject = null; }
    const modal = document.getElementById('modalNutriScanner');
    if (modal) modal.style.display = 'none';
}

function _nutriScannerSetStatus(msg, color) {
    const el = document.getElementById('nutri-scanner-status');
    if (!el) return;
    el.innerHTML = `<span style="background:rgba(0,0,0,0.7);border-radius:20px;padding:5px 14px;font-size:12px;font-weight:600;color:${color};">${msg}</span>`;
}
document.addEventListener('DOMContentLoaded', function() {
    window._nutriFiltro = 'dia';
    window._nutriNavOffset = 0;
    window._nutriNavDesde = null;
    window._nutriNavHasta = null;
    setTimeout(function() {
        _nutriUpdateLabel();
        renderNutricion();
    }, 400);
});

function abrirModalIntervaloNutri() {
    ['dia','semana','mes','ano','todo'].forEach(f => {
        const btn = document.getElementById('nutri-ibtn-' + f);
        if (!btn) return;
        const active = (window._nutriFiltro || 'dia') === f;
        btn.style.borderColor = active ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.08)';
        btn.style.background  = active ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)';
        btn.style.color       = active ? '#10b981' : '#94a3b8';
    });
    document.getElementById('modalIntervaloNutri').style.display = 'flex';
}
function cerrarModalIntervaloNutri() {
    const m = document.getElementById('modalIntervaloNutri');
    if (m) m.style.display = 'none';
}
function confirmarImportCSV() {
    const modal = document.getElementById('modalCSVPreview');
    if (modal) modal.remove();
    const { nuevas, _catCache } = window._csvPendiente || {};
    if (!nuevas || !nuevas.length) return;
    if (!window.finanzasData.operaciones) window.finanzasData.operaciones = [];
    window.finanzasData.operaciones.push(...nuevas);
    const catsCreadas = Object.keys(_catCache).length;
    guardarFinanzasData && guardarFinanzasData();
    guardarDatos && guardarDatos();
    if (typeof renderHistorialOperaciones === 'function') renderHistorialOperaciones();
    if (typeof renderModalCategorias === 'function') renderModalCategorias();
    if (typeof renderCategorias === 'function') renderCategorias();
    window._csvPendiente = null;
    const msg = `${nuevas.length} operaciones importadas` + (catsCreadas ? ` · ${catsCreadas} categorías nuevas` : '');
    _mostrarToast && _mostrarToast('upload_file', '#a78bfa', msg);
    const _tsCSV = new Date();
    const _etCSV = `CSV · ${_tsCSV.toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'})} ${_tsCSV.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})}`;
    _guardarSnapImport(_etCSV);
}

function _parseFechaCSV(v) {
    if (!v) return null;
    const p = v.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
    if (!p) return null;
    let [,d,m,y] = p;
    if (y.length === 2) y = '20' + y;
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
}

function _mapFrecuencia(frecRaw) {
    const f = (frecRaw || '').trim().toLowerCase();
    if (f === 'todos los días' || f === 'todos los dias') return 'todos_dias';
    if (f.includes('veces a la semana')) return 'x_semana';
    if (f === 'tarea (flexible)') return 'flexible';
    const dias = { 'lun':'lun','mar':'mar','mié':'mie','mie':'mie','jue':'jue','vie':'vie','sáb':'sab','sab':'sab','dom':'dom' };
    for (const [k,v] of Object.entries(dias)) { if (f.startsWith(k)) return 'dias_semana'; }
    return 'anual';
}

function _importarActividades(lineas, parseCSVRow, input) {
    const cab = parseCSVRow(lineas[0]).map(h => h.toLowerCase().trim());
    const idx = n => cab.indexOf(n);
    const iId=idx('id'), iNom=idx('actividad'), iDesc=idx('descripción')||idx('descripcion');
    const iFrq=idx('frecuencia'), iIni=idx('fecha de inicio'), iFin=idx('fecha de fin');
    const iCat=idx('categoría')||idx('categoria'), iTipo=idx('tipo de actividad');

    let habitos=0, recurrentes=0, tareas=0;
    const nuevosH=[], nuevosR=[], nuevosT=[];
    const _habitCatMap = {
        'gym':           { icono: 'fitness_center', color: '#ec4899' },
        'salud':         { icono: 'local_hospital',  color: '#10b981' },
        'cumpleaños':    { icono: 'cake',            color: '#f472b6' },
        'cumpleanos':    { icono: 'cake',            color: '#f472b6' },
        'viajes':        { icono: 'flight',          color: '#06b6d4' },
        'dubai':         { icono: 'flight',          color: '#06b6d4' },
        'plantas':       { icono: 'park',            color: '#84cc16' },
        'peluquería':    { icono: 'content_cut',     color: '#a78bfa' },
        'peluqueria':    { icono: 'content_cut',     color: '#a78bfa' },
        'vehículo':      { icono: 'directions_car',  color: '#f59e0b' },
        'vehiculo':      { icono: 'directions_car',  color: '#f59e0b' },
        'transporte':    { icono: 'directions_car',  color: '#f59e0b' },
        'reddit':        { icono: 'forum',           color: '#f97316' },
        'paula':         { icono: 'favorite',        color: '#ec4899' },
        'tarea':         { icono: 'task_alt',        color: '#64748b' },
        'otros':         { icono: 'more_horiz',      color: '#64748b' },
    };
    const _resolveCatHabito = (nombreCat, esHabito) => {
        const n = (nombreCat||'').toLowerCase().trim();
        for (const [k,v] of Object.entries(_habitCatMap)) {
            if (n.includes(k)) return { icono: v.icono, color: v.color, nombre: nombreCat };
        }
        return esHabito
            ? { icono: 'repeat',       color: '#10b981', nombre: nombreCat }
            : { icono: 'event_repeat', color: '#60a5fa', nombre: nombreCat };
    };

    lineas.slice(1).forEach((linea,i) => {
        if (!linea.trim()) return;
        const c = parseCSVRow(linea);
        const nombre = (c[iNom]||'').trim();
        if (!nombre) return;
        const tipo = (c[iTipo]||'').trim().toLowerCase();
        const frec = (c[iFrq]||'').trim();
        const fechaIni = _parseFechaCSV(c[iIni]) || new Date().toISOString().split('T')[0];
        const fechaFinRaw = _parseFechaCSV(c[iFin]);
        const categoriaRaw = (c[iCat]||'').trim();
        const desc = iDesc >= 0 ? (c[iDesc]||'').trim() : '';
        const id_csv = (c[iId]||'').trim();

        if (tipo === 'hábito' || tipo === 'habito') {
            const h = {
                id: 'habito_csv_' + id_csv + '_' + i,
                nombre, desc,
                subtipo: 'habito',
                frecuencia: _mapFrecuencia(frec),
                diasSemana: [], diasMes: [], cadaXDias: null,
                vecesPeriodo: tipo.includes('veces') ? parseInt(frec) : null,
                vecesPeriodoPer: 'semana', flexible: false,
                fechaInicio: fechaIni,
                fechaFin: fechaFinRaw || null,
                recordatorios: [], objetivo: null,
                condicion: 'al_menos', unidad: '', subitems: [],
                condExito: 'todos', condExitoNum: null,
                categoria: _resolveCatHabito(categoriaRaw, true), registros: [],
                creadoEn: new Date().toISOString()
            };
            nuevosH.push(h); habitos++;
        } else if (tipo === 'tarea recurrente') {
            const r = {
                id: 'tareaRec_csv_' + id_csv + '_' + i,
                nombre, desc,
                subtipo: 'tareaRecurrente',
                frecuencia: _mapFrecuencia(frec),
                diasSemana: [], diasMes: [], cadaXDias: null,
                vecesPeriodo: null, vecesPeriodoPer: 'semana', flexible: false,
                fechaInicio: fechaIni,
                fechaFin: fechaFinRaw || null,
                recordatorios: [], objetivo: null,
                condicion: 'al_menos', unidad: '', subitems: [],
                condExito: 'todos', condExitoNum: null,
                categoria: _resolveCatHabito(categoriaRaw, false), registros: [],
                creadoEn: new Date().toISOString()
            };
            nuevosR.push(r); recurrentes++;
        } else {
            const _hoy = new Date().toISOString().split('T')[0];
            const _fechaTareaFin = fechaFinRaw || fechaIni;
            const t = {
                id: 'tarea_csv_' + id_csv + '_' + i,
                nombre, nota: desc,
                fecha: fechaIni,
                hora: '',
                subitems: [], completada: _fechaTareaFin < _hoy,
                categoria: categoriaRaw,
                creadoEn: new Date().toISOString()
            };
            nuevosT.push(t); tareas++;
        }
    });

    if (!habitos && !recurrentes && !tareas) {
        alert('No se encontraron actividades válidas en el CSV.');
        input.value = ''; return;
    }
    const modal = document.createElement('div');
    modal.id = 'modalCSVPreview';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.7);padding:20px;';
    const STYLE = 'background:rgba(15,23,42,0.95);border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:32px;max-width:420px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,0.6);';
    const row = (icon, color, label, val) => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-radius:14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);margin-bottom:8px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="material-symbols-rounded" style="font-size:20px;color:${color};">${icon}</span>
          <span style="font-size:14px;font-weight:600;color:#cbd5e1;">${label}</span>
        </div>
        <span style="font-size:15px;font-weight:800;color:#f1f5f9;">${val}</span>
      </div>`;
    modal.innerHTML = `
      <div style="${STYLE}">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
          <span class="material-symbols-rounded" style="font-size:28px;color:#60a5fa;">event_note</span>
          <div>
            <div style="font-size:17px;font-weight:800;color:#f1f5f9;">Importar HabitNow</div>
            <div style="font-size:12px;color:#64748b;">Revisa antes de confirmar</div>
          </div>
        </div>
        ${habitos    ? row('repeat',      '#10b981', 'Hábitos',            habitos)    : ''}
        ${recurrentes? row('event_repeat','#60a5fa', 'Tareas recurrentes', recurrentes): ''}
        ${tareas     ? row('task_alt',    '#f59e0b', 'Tareas',             tareas)     : ''}
        <div id="habitnow-reg-status" style="display:none;padding:10px 14px;border-radius:12px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);margin-bottom:10px;font-size:13px;color:#10b981;display:flex;align-items:center;gap:8px;">
          <span class="material-symbols-rounded" style="font-size:16px;">check_circle</span>
          <span id="habitnow-reg-label">Registros cargados</span>
        </div>
        <label style="display:flex;align-items:center;justify-content:center;gap:8px;padding:11px;border-radius:12px;border:1px dashed rgba(99,102,241,0.35);background:rgba(99,102,241,0.04);color:#818cf8;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:10px;" title="Opcional: añade el CSV de Registros de HabitNow para importar el historial de completados">
          <span class="material-symbols-rounded" style="font-size:17px;">upload</span>
          Añadir Registros_de_actividad.csv (opcional)
          <input type="file" accept=".csv" style="display:none;" onchange="_cargarRegistrosEnPendiente(this)">
        </label>
        <div style="display:flex;gap:10px;margin-top:4px;">
          <button onclick="document.getElementById('modalCSVPreview').remove(); document.getElementById('importCSVFile').value='';"
            style="flex:1;padding:14px;border-radius:14px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#94a3b8;font-size:14px;font-weight:700;cursor:pointer;">
            Cancelar
          </button>
          <button onclick="confirmarImportAgenda();"
            style="flex:2;padding:14px;border-radius:14px;border:1px solid rgba(99,102,241,0.6);background:rgba(99,102,241,0.15);color:#818cf8;font-size:14px;font-weight:800;cursor:pointer;">
            Confirmar importación
          </button>
        </div>
      </div>`;

    window._agendaPendiente = { nuevosH, nuevosR, nuevosT };
    document.body.appendChild(modal);
    input.value = '';
}

function _cargarRegistrosEnPendiente(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const texto = e.target.result.replace(/^\uFEFF/, '');
            const lineas = texto.split(/\r?\n/).filter(l => l.trim());
            if (lineas.length < 2) return;

            const parseCSVRow = (line) => {
                const cols = []; let cur = ''; let inQ = false;
                for (let i = 0; i < line.length; i++) {
                    const ch = line[i];
                    if (ch === '"') { inQ = !inQ; }
                    else if (ch === ',' && !inQ) { cols.push(cur.trim()); cur = ''; }
                    else { cur += ch; }
                }
                cols.push(cur.trim());
                return cols;
            };

            const cab = parseCSVRow(lineas[0]).map(h => h.toLowerCase().trim());
            const iId=cab.indexOf('id'), iFecha=cab.indexOf('fecha'), iEstado=cab.indexOf('estado');
            if (iId<0 || iFecha<0 || iEstado<0) { alert('CSV de registros no reconocido.'); return; }
            const mapa = {};
            lineas.slice(1).forEach(linea => {
                if (!linea.trim()) return;
                const c = parseCSVRow(linea);
                const id_csv = (c[iId]||'').trim();
                const fecha  = _parseFechaCSV(c[iFecha]);
                const estado = (c[iEstado]||'').trim().toLowerCase();
                if (!id_csv || !fecha) return;
                if (!mapa[id_csv]) mapa[id_csv] = [];
                mapa[id_csv].push({ fecha, completado: estado === 'logrado' });
            });
            const { nuevosH, nuevosR } = window._agendaPendiente || {};
            let total = 0;
            [...(nuevosH||[]), ...(nuevosR||[])].forEach(item => {
                const csvId = item.id.split('_csv_')[1]?.split('_')[0];
                if (csvId && mapa[csvId]) {
                    item.registros = mapa[csvId];
                    total += mapa[csvId].length;
                }
            });
            const st = document.getElementById('habitnow-reg-status');
            const lb = document.getElementById('habitnow-reg-label');
            if (st) { st.style.display = 'flex'; }
            if (lb) { lb.textContent = `${total} registros cargados de ${Object.keys(mapa).length} actividades`; }
            input.value = '';
        } catch(e) { console.error(e); alert('Error al leer el CSV de registros.'); }
    };
    reader.readAsText(file, 'UTF-8');
}

function _importarRegistros(lineas, parseCSVRow, input) {
    const cab = parseCSVRow(lineas[0]).map(h => h.toLowerCase().trim());
    const iId=cab.indexOf('id'), iFecha=cab.indexOf('fecha'), iEstado=cab.indexOf('estado');

    let aplicados=0, omitidos=0;
    lineas.slice(1).forEach(linea => {
        if (!linea.trim()) return;
        const c = parseCSVRow(linea);
        const id_csv = (c[iId]||'').trim();
        const fecha = _parseFechaCSV(c[iFecha]);
        const estado = (c[iEstado]||'').trim().toLowerCase();
        if (!fecha) { omitidos++; return; }

        const completado = estado === 'logrado';
        const habito = (window.agendaData?.habitos||[]).find(h => h.id.includes('_csv_'+id_csv+'_'));
        const rec    = (window.agendaData?.tareasRecurrentes||[]).find(r => r.id.includes('_csv_'+id_csv+'_'));
        const target = habito || rec;
        if (!target) { omitidos++; return; }

        if (!Array.isArray(target.registros)) target.registros = [];
        const existe = target.registros.find(r => r.fecha === fecha);
        if (!existe) { target.registros.push({ fecha, completado }); aplicados++; }
        else { existe.completado = completado; aplicados++; }
    });

    if (!aplicados) {
        alert(`No se aplicó ningún registro.\n${omitidos} filas omitidas.\nImporta primero el CSV de Actividades (HabitNow).`);
        input.value=''; return;
    }

    if (window.agendaData) {
        if (typeof guardarAgendaData === 'function') guardarAgendaData();
        if (typeof guardarDatos === 'function') guardarDatos();
        if (typeof renderHabitosSection === 'function') renderHabitosSection();
        if (typeof renderDiario === 'function') renderDiario();
    }
    input.value = '';
    _mostrarToast && _mostrarToast('event_note', '#60a5fa', `${aplicados} registros importados · ${omitidos} omitidos`);
}

function confirmarImportAgenda() {
    const modal = document.getElementById('modalCSVPreview');
    if (modal) modal.remove();
    const { nuevosH, nuevosR, nuevosT } = window._agendaPendiente || {};
    if (!window.agendaData) window.agendaData = { habitos:[], tareasRecurrentes:[], tareas:[] };
    if (nuevosH?.length) window.agendaData.habitos.push(...nuevosH);
    if (nuevosR?.length) window.agendaData.tareasRecurrentes.push(...nuevosR);
    if (nuevosT?.length) window.agendaData.tareas.push(...nuevosT);
    if (typeof guardarAgendaData === 'function') guardarAgendaData();
    if (typeof guardarDatos === 'function') guardarDatos();
    if (typeof renderHabitosSection === 'function') renderHabitosSection();
    if (typeof renderTareasSection === 'function') renderTareasSection();
    if (typeof renderDiario === 'function') renderDiario();
    window._agendaPendiente = null;
    const total = (nuevosH?.length||0) + (nuevosR?.length||0) + (nuevosT?.length||0);
    _mostrarToast && _mostrarToast('event_note', '#60a5fa', `${total} actividades importadas (HabitNow)`);
    const _tsAg = new Date();
    const _etAg = `HabitNow CSV · ${_tsAg.toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'})} ${_tsAg.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})}`;
    _guardarSnapImport(_etAg);
}

function _cerrarEditarPeso() {
    const m = document.getElementById('modalEditarPeso');
    if (m) m.style.display = 'none';
    window._editPesoFechaOrig = null;
}

function _guardarEditarPeso() {
    const fechaOrig = window._editPesoFechaOrig;
    const fechaNueva = document.getElementById('edit-peso-fecha').value;
    const pesoVal   = parseFloat(document.getElementById('edit-peso-valor').value);
    const nota      = document.getElementById('edit-peso-nota').value.trim();

    if (!fechaNueva || isNaN(pesoVal) || pesoVal <= 0) {
        const el = document.getElementById('edit-peso-valor');
        el.style.borderColor = 'rgba(239,68,68,0.6)';
        setTimeout(() => { el.style.borderColor = 'rgba(96,165,250,0.25)'; }, 1200);
        return;
    }
    if (!window.nutricionData) window.nutricionData = { comidas: [], registrosPeso: [] };
    window.nutricionData.registrosPeso = window.nutricionData.registrosPeso.filter(r => r.fecha !== fechaOrig);
    const idx = window.nutricionData.registrosPeso.findIndex(r => r.fecha === fechaNueva);
    if (idx >= 0) window.nutricionData.registrosPeso[idx] = { fecha: fechaNueva, peso: pesoVal, nota };
    else          window.nutricionData.registrosPeso.push({ fecha: fechaNueva, peso: pesoVal, nota });

    window.nutricionData.registrosPeso.sort((a, b) => a.fecha.localeCompare(b.fecha));
    guardarDatos();
    if (typeof renderNutricion === 'function') renderNutricion();
    _cerrarEditarPeso();
}

function _eliminarRegistroPeso() {
    const fechaOrig = window._editPesoFechaOrig;
    if (!fechaOrig) return;
    if (!confirm('¿Eliminar este registro de peso?')) return;
    if (!window.nutricionData) return;
    window.nutricionData.registrosPeso = window.nutricionData.registrosPeso.filter(r => r.fecha !== fechaOrig);
    guardarDatos();
    if (typeof renderNutricion === 'function') renderNutricion();
    _cerrarEditarPeso();
}
document.addEventListener('click', function(e) {
    const m = document.getElementById('modalEditarPeso');
    if (m && m.style.display === 'flex' && e.target === m) _cerrarEditarPeso();
});

function _importarPeso(lineas, parseCSVRow, input) {
    const cabecera = parseCSVRow(lineas[0]).map(h => h.toLowerCase().trim());
    const iFecha = cabecera.indexOf('fecha');
    const iPeso  = cabecera.indexOf('peso_kg');
    if (iFecha < 0 || iPeso < 0) { alert('CSV de peso no reconocido.'); input.value=''; return; }
    if (!window.nutricionData) window.nutricionData = { comidas: [], registrosPeso: [] };
    if (!Array.isArray(window.nutricionData.registrosPeso)) window.nutricionData.registrosPeso = [];
    let añadidos = 0, actualizados = 0;
    for (let i = 1; i < lineas.length; i++) {
        const cols = parseCSVRow(lineas[i]);
        const fecha = (cols[iFecha] || '').trim();
        const pesoRaw = parseFloat((cols[iPeso] || '').trim());
        if (!fecha || isNaN(pesoRaw) || pesoRaw <= 0) continue;
        const idx = window.nutricionData.registrosPeso.findIndex(r => r.fecha === fecha);
        if (idx >= 0) { window.nutricionData.registrosPeso[idx].peso = pesoRaw; actualizados++; }
        else { window.nutricionData.registrosPeso.push({ fecha, peso: pesoRaw }); añadidos++; }
    }
    window.nutricionData.registrosPeso.sort((a,b) => a.fecha.localeCompare(b.fecha));
    guardarDatos();
    if (typeof renderNutricion === 'function') renderNutricion();
    input.value = '';
    alert('✅ Peso importado: ' + añadidos + ' nuevos, ' + actualizados + ' actualizados.');
}

function _importarPesoWeightWar(lineas, parseCSVRow, input) {
    const cabecera = parseCSVRow(lineas[0]).map(h => h.toLowerCase().trim());
    const iFecha = cabecera.findIndex(h => h === 'date' || h === 'fecha');
    const iPeso  = cabecera.findIndex(h => h === 'weight' || h === 'peso' || h === 'peso (kg)');
    if (iFecha < 0 || iPeso < 0) { alert('CSV de WeightWar no reconocido.'); input.value=''; return; }
    if (!window.nutricionData) window.nutricionData = { comidas: [], registrosPeso: [] };
    if (!Array.isArray(window.nutricionData.registrosPeso)) window.nutricionData.registrosPeso = [];
    let añadidos = 0, actualizados = 0;
    for (let i = 1; i < lineas.length; i++) {
        const cols = parseCSVRow(lineas[i]);
        let fecha = (cols[iFecha] || '').trim();
        const pesoRaw = parseFloat((cols[iPeso] || '').trim());
        if (!fecha || isNaN(pesoRaw) || pesoRaw <= 0) continue;
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
            const [d, m, y] = fecha.split('/');
            fecha = y + '-' + m + '-' + d;
        } else if (/^\d{4}\/\d{2}\/\d{2}$/.test(fecha)) {
            fecha = fecha.replace(/\//g, '-');
        }
        const idx = window.nutricionData.registrosPeso.findIndex(r => r.fecha === fecha);
        if (idx >= 0) { window.nutricionData.registrosPeso[idx].peso = pesoRaw; actualizados++; }
        else { window.nutricionData.registrosPeso.push({ fecha, peso: pesoRaw }); añadidos++; }
    }
    window.nutricionData.registrosPeso.sort((a,b) => a.fecha.localeCompare(b.fecha));
    guardarDatos();
    if (typeof renderNutricion === 'function') renderNutricion();
    input.value = '';
    alert('✅ WeightWar importado: ' + añadidos + ' nuevos, ' + actualizados + ' actualizados.');
}

function importarCSV(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const texto = e.target.result.replace(/^\uFEFF/, '');
            const lineas = texto.split(/\r?\n/).filter(l => l.trim());
            if (lineas.length < 2) { alert('El CSV está vacío.'); input.value=''; return; }
            const parseCSVRow = (line) => {
                const cols = []; let cur = ''; let inQ = false;
                for (let i = 0; i < line.length; i++) {
                    const ch = line[i];
                    if (ch === '"') { if (inQ && line[i+1]==='"') { cur+='"'; i++; } else inQ=!inQ; }
                    else if (ch === ',' && !inQ) { cols.push(cur.trim()); cur=''; }
                    else cur += ch;
                }
                cols.push(cur.trim());
                return cols;
            };

            const cabecera = parseCSVRow(lineas[0]).map(h => h.toLowerCase().trim());
            const esFinadyx    = cabecera.includes('date (utc)') && cabecera.includes('from account / from category');
            const esActividades = cabecera.includes('tipo de actividad') && cabecera.includes('frecuencia');
            const esRegistros   = cabecera.includes('estado') && cabecera.includes('actividad') && cabecera.includes('fecha') && !cabecera.includes('frecuencia');
            const esPeso        = cabecera.includes('fecha') && cabecera.includes('peso_kg');
            const esWeightWar   = cabecera.includes('date') && cabecera.includes('weight') && !cabecera.includes('from account / from category');
            if (esActividades) { _importarActividades(lineas, parseCSVRow, input); return; }
            if (esRegistros)   { _importarRegistros(lineas, parseCSVRow, input); return; }
            if (esPeso)        { _importarPeso(lineas, parseCSVRow, input); return; }
            if (esWeightWar)   { _importarPesoWeightWar(lineas, parseCSVRow, input); return; }

            const cats = (window.finanzasData && window.finanzasData.categorias) ? window.finanzasData.categorias : [];
            const _colorPalette = ['#ef4444','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ec4899','#f97316','#06b6d4','#84cc16','#6366f1','#14b8a6','#e879f9'];
            let _colorIdx = cats.length % _colorPalette.length;
            const _colorMap = {
                'comida':'#f97316','alimentación':'#f97316','alimentacion':'#f97316','restaurante':'#f97316',
                'bar':'#f97316','pastelería':'#f97316','pasteleria':'#f97316','avión':'#f97316','avion':'#f97316',
                'maquina expendedora':'#f97316',
                'transporte':'#f59e0b','parking':'#f59e0b','taxi':'#f59e0b','gasolina':'#f59e0b','combustible':'#f59e0b',
                'vehículo':'#f59e0b','vehiculo':'#f59e0b','transporte':'#f59e0b',
                'salud':'#10b981','farmacia':'#10b981','médico':'#10b981','medico':'#10b981','fisio':'#10b981',
                'dentista':'#10b981','podólogo':'#10b981','podologo':'#10b981',
                'entretenimiento':'#ec4899','ocio':'#ec4899','dardos':'#ec4899','deportes':'#ec4899',
                'gym':'#ec4899','peluquería':'#ec4899','peluqueria':'#ec4899',
                'suscripción':'#8b5cf6','suscripcion':'#8b5cf6','netflix':'#8b5cf6','disney':'#8b5cf6',
                'compra online':'#3b82f6','amazon':'#3b82f6','compras':'#3b82f6','ropa':'#3b82f6','moda':'#3b82f6',
                'mascotas':'#84cc16','tortugas':'#84cc16','plantas':'#84cc16',
                'vivienda':'#8b5cf6','alquiler':'#8b5cf6','hipoteca':'#8b5cf6',
                'servicios':'#6366f1','electricidad':'#6366f1','agua':'#6366f1','internet':'#6366f1',
                'educación':'#3b82f6','educacion':'#3b82f6','libros':'#3b82f6',
                'inversiones':'#10b981','bolsa':'#10b981','crypto':'#10b981',
                'salario':'#10b981','nómina':'#10b981','nomina':'#10b981','sueldo':'#10b981','freelance':'#10b981',
                'cumpleaños':'#ec4899','cumpleanos':'#ec4899','paula':'#ec4899',
                'viajes':'#06b6d4','dubai':'#06b6d4','méxico':'#06b6d4','mexico':'#06b6d4',
                'reddit':'#f97316',
                'otros':'#64748b','tarea':'#64748b',
                'ahorro':'#10b981','banco':'#3b82f6','transferencia':'#94a3b8',
                'comisiones':'#f59e0b',
            };
            const _getColor = (nombre) => {
                const n = nombre.toLowerCase();
                for (const [k, v] of Object.entries(_colorMap)) {
                    if (n.includes(k)) return v;
                }
                let hash = 0;
                for (let i = 0; i < n.length; i++) hash = n.charCodeAt(i) + ((hash << 5) - hash);
                return _colorPalette[Math.abs(hash) % _colorPalette.length];
            };
            const _catCache = {};

            const _findOrCreateCat = (nombre, tipo, subtag) => {
                if (!nombre) return null;
                const n = nombre.trim();
                const key = n.toLowerCase() + '|' + tipo;
                if (_catCache[key]) {
                    if (subtag) {
                        const c = _catCache[key];
                        if (!Array.isArray(c.tags)) c.tags = [];
                        if (!c.tags.includes(subtag)) c.tags.push(subtag);
                    }
                    return _catCache[key];
                }
                let _catExistente = cats.find(c => c.name.toLowerCase() === n.toLowerCase() && c.type === tipo)
                         || cats.find(c => c.name.toLowerCase() === n.toLowerCase());
                let cat = _catExistente;
                if (!cat) {
                    cat = {
                        id: 'cat_csv_' + Date.now() + '_' + Math.random().toString(36).slice(2,6),
                        name: n,
                        type: tipo,
                        icon: (() => {
                            const _iconMap = {
                                'comida':'restaurant','alimentación':'restaurant','alimentacion':'restaurant',
                                'restaurante':'restaurant','bar':'local_bar','cafetería':'local_cafe','cafeteria':'local_cafe',
                                'pastelería':'bakery_dining','pasteleria':'bakery_dining','avión':'flight','avion':'flight',
                                'maquina expendedora':'vending_machine',
                                'transporte':'directions_car','parking':'local_parking','taxi':'local_taxi',
                                'gasolina':'local_gas_station','combustible':'local_gas_station',
                                'salud':'local_hospital','farmacia':'local_pharmacy','médico':'medical_services','medico':'medical_services',
                                'entretenimiento':'movie','ocio':'sports_esports','dardos':'sports','deportes':'sports',
                                'suscripción':'subscriptions','suscripcion':'subscriptions',
                                'compra online':'shopping_cart','amazon':'shopping_cart','compras':'shopping_bag',
                                'ropa':'checkroom','moda':'checkroom',
                                'mascotas':'pets','tortugas':'pets',
                                'vivienda':'home','alquiler':'home','hipoteca':'home',
                                'servicios':'settings','electricidad':'bolt','agua':'water_drop','internet':'wifi',
                                'educación':'school','educacion':'school','libros':'menu_book',
                                'inversiones':'trending_up','bolsa':'candlestick_chart','crypto':'currency_bitcoin',
                                'salario':'payments','nómina':'payments','nomina':'payments','sueldo':'payments',
                                'freelance':'work','otros':'more_horiz','comisiones':'percent',
                                'ahorro':'savings','banco':'account_balance','transferencia':'swap_horiz',
                            };
                            const key = n.toLowerCase();
                            for (const [k, v] of Object.entries(_iconMap)) {
                                if (key.includes(k)) return v;
                            }
                            return tipo === 'INCOME' ? 'payments' : 'receipt_long';
                        })(),
                        color: _getColor(n),
                        isDefault: false,
                        orderIndex: 100 + cats.length
                    };
                    cats.push(cat);
                    if (window.finanzasData) window.finanzasData.categorias = cats;
                }
                if (_catExistente && subtag) {
                    if (!Array.isArray(cat.tags)) cat.tags = [];
                    if (!cat.tags.includes(subtag)) cat.tags.push(subtag);
                }
                if (!_catExistente && subtag) {
                    if (!Array.isArray(cat.tags)) cat.tags = [];
                    if (!cat.tags.includes(subtag)) cat.tags.push(subtag);
                }
                _catCache[key] = cat;
                return cat;
            };
            const _findCat = (nombre, tipo) => _findOrCreateCat(nombre, tipo);

            let importadas = 0, omitidas = 0;
            const nuevas = [];

            if (esFinadyx) {
                lineas.slice(1).forEach((linea, i) => {
                    if (!linea.trim()) return;
                    const c = parseCSVRow(linea);
                    const tipoRaw = (c[1] || '').trim();
                    if (tipoRaw === 'Adjustment' || tipoRaw === 'Transfer') { omitidas++; return; }
                    const fecha = (c[0] || '').trim();
                    if (!fecha) { omitidas++; return; }
                    const importe = Math.abs(parseFloat(c[6]) || 0);
                    if (!importe) { omitidas++; return; }

                    let tipo, catNombre, etiqueta, cuentaNombre;
                    if (tipoRaw === 'Expense') {
                        tipo = 'EXPENSE';
                        catNombre = (c[4] || '').trim();   // "To category"
                        etiqueta  = (c[5] || '').trim();   // "To subcategory"
                        cuentaNombre = (c[2] || '').trim();
                    } else if (tipoRaw === 'Income') {
                        tipo = 'INCOME';
                        catNombre = (c[2] || '').trim();   // "From category"
                        etiqueta  = (c[3] || '').trim();   // "From subcategory"
                        cuentaNombre = (c[4] || '').trim();
                    } else { omitidas++; return; }

                    const cat = _findCat(catNombre, tipo, etiqueta || undefined);
                    const nota = (c[14] || '').trim();
                    const op = {
                        id: 'csv_' + Date.now() + '_' + i,
                        type: tipo,
                        categoryId: cat ? cat.id : null,
                        note: cat ? cat.name : (catNombre || (tipo==='INCOME'?'Ingreso':'Gasto')),
                        comment: nota,
                        amount: importe,
                        date: fecha,
                        createdAt: new Date().toISOString()
                    };
                    if (etiqueta) op.subtag = etiqueta;
                    nuevas.push(op);
                    importadas++;
                });
            } else {
                const sep = lineas[0].includes(';') ? ';' : ',';
                const idx = (n) => cabecera.indexOf(n);
                const iFecha=idx('fecha'), iTipo=idx('tipo'), iCat=idx('categoria');
                const iEtiq=idx('etiqueta'), iImp=idx('importe'), iNota=idx('nota');
                if (iFecha<0 || iImp<0) { alert('Formato CSV no reconocido.\nUsa un CSV exportado desde esta app o desde Finadyx.'); input.value=''; return; }
                const _parseFecha = (v) => {
                    const p = v.match(/(\d{1,4})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
                    if (!p) return null;
                    let [,a,b,cc] = p;
                    if (a.length===4) return `${a}-${b.padStart(2,'0')}-${cc.padStart(2,'0')}T12:00:00.000Z`;
                    return `${cc.length===2?'20'+cc:cc}-${b.padStart(2,'0')}-${a.padStart(2,'0')}T12:00:00.000Z`;
                };
                lineas.slice(1).forEach((linea,i)=>{
                    if (!linea.trim()) return;
                    const cols = linea.split(sep).map(v=>v.replace(/^"|"$/g,'').trim());
                    const fecha = _parseFecha(cols[iFecha]||'');
                    if (!fecha){omitidas++;return;}
                    const importe = Math.abs(parseFloat((cols[iImp]||'0').replace(',','.'))||0);
                    if (!importe){omitidas++;return;}
                    const tipoStr=(iTipo>=0?cols[iTipo]:'').toLowerCase();
                    const tipo=tipoStr.includes('ingreso')?'INCOME':'EXPENSE';
                    const catNombre=iCat>=0?cols[iCat]:'';
                    const etiqueta=iEtiq>=0?cols[iEtiq]:'';
                    const cat=_findCat(catNombre,tipo,etiqueta||undefined);
                    const nota=iNota>=0?cols[iNota]:'';
                    const op={id:'csv_'+Date.now()+'_'+i,type:tipo,categoryId:cat?cat.id:null,
                        note:cat?cat.name:(catNombre||(tipo==='INCOME'?'Ingreso':'Gasto')),
                        comment:nota,amount:importe,date:fecha,createdAt:new Date().toISOString()};
                    if(etiqueta) op.subtag=etiqueta;
                    nuevas.push(op); importadas++;
                });
            }

            if (importadas === 0) { alert(`No se importó ninguna operación.\n${omitidas} filas omitidas (Transfers, Adjustments o datos inválidos).`); input.value=''; return; }
            const catsNuevas = Object.keys(_catCache).filter(k => {
                const c = cats.find(x => (x.name.toLowerCase()+'|'+x.type) === k);
                return c && c.id.startsWith('cat_csv_');
            });
            let tagsNuevos = 0;
            Object.keys(_catCache).forEach(k => {
                const c = cats.find(x => (x.name.toLowerCase()+'|'+x.type) === k);
                if (c && !c.id.startsWith('cat_csv_') && Array.isArray(c.tags)) {
                    tagsNuevos += c.tags.length; // tags añadidos en esta sesión
                }
            });
            const etiquetasSet = new Set(nuevas.filter(o => o.subtag).map(o => o.subtag));
            const gastos   = nuevas.filter(o => o.type === 'EXPENSE');
            const ingresos = nuevas.filter(o => o.type === 'INCOME');
            const fmtEur = (n) => n.toLocaleString('es-ES', {minimumFractionDigits:2, maximumFractionDigits:2});
            const totalGastos   = fmtEur(gastos.reduce((s,o)=>s+o.amount,0));
            const totalIngresos = fmtEur(ingresos.reduce((s,o)=>s+o.amount,0));
            window._csvPendiente = { nuevas, cats, _catCache };
            const modalEl = document.getElementById('modalCSVPreview');
            if (modalEl) modalEl.remove();
            const modal = document.createElement('div');
            modal.id = 'modalCSVPreview';
            modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.7);padding:20px;';
            modal.innerHTML = `
              <div style="background:#0f172a;border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:32px;max-width:420px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,0.6);">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
                  <span class="material-symbols-rounded" style="font-size:28px;color:#a78bfa;">upload_file</span>
                  <div>
                    <div style="font-size:17px;font-weight:800;color:#f1f5f9;">Importar CSV</div>
                    <div style="font-size:12px;color:#64748b;">Revisa antes de confirmar</div>
                  </div>
                </div>
                <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-radius:14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <span class="material-symbols-rounded" style="font-size:20px;color:#94a3b8;">receipt_long</span>
                      <span style="font-size:14px;font-weight:600;color:#cbd5e1;">Operaciones</span>
                    </div>
                    <span style="font-size:15px;font-weight:800;color:#f1f5f9;">${importadas}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-radius:14px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.15);">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <span class="material-symbols-rounded" style="font-size:20px;color:#f87171;">remove_circle</span>
                      <span style="font-size:14px;font-weight:600;color:#cbd5e1;">Gastos</span>
                    </div>
                    <span style="font-size:15px;font-weight:800;color:#f87171;">${gastos.length} · ${totalGastos} €</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-radius:14px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.15);">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <span class="material-symbols-rounded" style="font-size:20px;color:#34d399;">add_circle</span>
                      <span style="font-size:14px;font-weight:600;color:#cbd5e1;">Ingresos</span>
                    </div>
                    <span style="font-size:15px;font-weight:800;color:#34d399;">${ingresos.length} · ${totalIngresos} €</span>
                  </div>
                  ${catsNuevas.length ? `
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-radius:14px;background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.15);">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <span class="material-symbols-rounded" style="font-size:20px;color:#a78bfa;">category</span>
                      <span style="font-size:14px;font-weight:600;color:#cbd5e1;">Categorías nuevas</span>
                    </div>
                    <span style="font-size:15px;font-weight:800;color:#a78bfa;">${catsNuevas.length}</span>
                  </div>` : ''}
                  ${etiquetasSet.size ? `
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-radius:14px;background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.15);">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <span class="material-symbols-rounded" style="font-size:20px;color:#818cf8;">label</span>
                      <span style="font-size:14px;font-weight:600;color:#cbd5e1;">Etiquetas únicas</span>
                    </div>
                    <span style="font-size:15px;font-weight:800;color:#818cf8;">${etiquetasSet.size}</span>
                  </div>` : ''}
                  ${tagsNuevos ? `
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-radius:14px;background:rgba(20,184,166,0.06);border:1px solid rgba(20,184,166,0.15);">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <span class="material-symbols-rounded" style="font-size:20px;color:#2dd4bf;">label</span>
                      <span style="font-size:14px;font-weight:600;color:#cbd5e1;">Tags fusionados</span>
                    </div>
                    <span style="font-size:15px;font-weight:800;color:#2dd4bf;">${tagsNuevos}</span>
                  </div>` : ''}
                  ${omitidas ? `
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-radius:14px;background:rgba(100,116,139,0.06);border:1px solid rgba(100,116,139,0.15);">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <span class="material-symbols-rounded" style="font-size:20px;color:#64748b;">block</span>
                      <span style="font-size:14px;font-weight:600;color:#64748b;">Omitidas</span>
                    </div>
                    <span style="font-size:15px;font-weight:800;color:#64748b;">${omitidas}</span>
                  </div>` : ''}
                </div>
                <div style="display:flex;gap:10px;">
                  <button onclick="document.getElementById('modalCSVPreview').remove(); document.getElementById('importCSVFile').value='';"
                    style="flex:1;padding:14px;border-radius:14px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#94a3b8;font-size:14px;font-weight:700;cursor:pointer;">
                    Cancelar
                  </button>
                  <button onclick="confirmarImportCSV();"
                    style="flex:2;padding:14px;border-radius:14px;border:1px solid rgba(139,92,246,0.6);background:rgba(139,92,246,0.15);color:#a78bfa;font-size:14px;font-weight:800;cursor:pointer;">
                    Confirmar importación
                  </button>
                </div>
              </div>`;
            document.body.appendChild(modal);
            input.value = '';
        } catch(err) {
            alert('Error al importar CSV: ' + err.message);
            input.value = '';
        }
    };
    reader.readAsText(file, 'UTF-8');
}

function abrirModalBackup() {
    document.getElementById('modalBackup').style.display = 'flex';
    cargarListaCopias();
}

function cerrarModalBackup() {
    document.getElementById('modalBackup').style.display = 'none';
}

async function guardarCopiaInterna(btn) {
    const nombre = document.getElementById('backupNombre').value.trim();
    const datos = _serializarDatos();
    if (!datos) { alert('No hay datos para guardar'); return; }

    const ts = Date.now();
    const d = new Date(ts);
    const fecha = d.toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' });
    const hora  = d.toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' });
    const etiqueta = nombre || `Copia ${fecha} ${hora}`;

    const entry = { ts, etiqueta, datos };
    const key = 'backup_snap_' + ts;

    try {
        await guardarEnDB(key, entry);
        document.getElementById('backupNombre').value = '';
        const sweep = document.getElementById('backup-sweep');
        const box   = document.getElementById('backup-guardar-box');
        if (sweep) {
            sweep.style.transition = 'transform 1.4s ease';
            sweep.style.transform  = 'translateX(200%)';
            setTimeout(() => {
                sweep.style.transition = 'none';
                sweep.style.transform  = 'translateX(-100%)';
            }, 1600);
        }
        if (box) {
            const histLabel = document.querySelector('#listaCopiasBackup')?.closest('div')?.previousElementSibling;
            const dest = document.getElementById('listaCopiasBackup');
            const pill = document.createElement('div');
            pill.textContent = etiqueta;
            pill.style.cssText = 'position:fixed;background:rgba(16,185,129,0.9);color:white;font-size:12px;font-weight:600;padding:5px 12px;border-radius:20px;pointer-events:none;z-index:99999;white-space:nowrap;box-shadow:0 4px 16px rgba(16,185,129,0.4);';
            document.body.appendChild(pill);
            const boxR  = box.getBoundingClientRect();
            const destR = dest ? dest.getBoundingClientRect() : boxR;
            pill.style.left = (boxR.left + boxR.width / 2 - pill.offsetWidth / 2) + 'px';
            pill.style.top  = (boxR.top  + boxR.height / 2) + 'px';
            pill.style.opacity = '1';
            pill.style.transform = 'scale(1)';
            pill.style.transition = 'none';

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    pill.style.transition = 'all 1.1s cubic-bezier(0.4,0,0.2,1)';
                    pill.style.left    = (destR.left + 12) + 'px';
                    pill.style.top     = (destR.top  + destR.height / 2) + 'px';
                    pill.style.opacity = '0';
                    pill.style.transform = 'scale(0.7)';
                });
            });

            setTimeout(() => {
                document.body.removeChild(pill);
                cargarListaCopias();
            }, 1150);
        } else {
            cargarListaCopias();
        }
        const orig = btn.textContent;
        btn.textContent = '✓ Guardado';
        btn.style.background = 'rgba(16,185,129,0.3)';
        btn.style.borderColor = 'rgba(16,185,129,0.8)';
        setTimeout(() => {
            btn.textContent = orig;
            btn.style.background = 'rgba(16,185,129,0.12)';
            btn.style.borderColor = 'rgba(16,185,129,0.5)';
        }, 2000);

    } catch(e) {
        alert('Error al guardar: ' + e.message);
    }
}

async function cargarListaCopias() {
    const lista = document.getElementById('listaCopiasBackup');
    lista.innerHTML = '<div style="padding:14px;color:#475569;font-size:13px;text-align:center;">Cargando...</div>';

    try {
        if (!db) await abrirDB();
        const keys = await new Promise((res, rej) => {
            const tx = db.transaction([STORE_NAME], 'readonly');
            const req = tx.objectStore(STORE_NAME).getAllKeys();
            req.onsuccess = () => res(req.result);
            req.onerror = () => rej(req.error);
        });

        const backupKeys = keys.filter(k => String(k).startsWith('backup_snap_')).sort().reverse();

        if (!backupKeys.length) {
            lista.innerHTML = '<div style="padding:16px;color:#475569;font-size:13px;text-align:center;">No hay copias guardadas aún</div>';
            return;
        }

        const entries = await Promise.all(backupKeys.map(k => cargarDesdeDB(k)));
        window._backupKeys = backupKeys;

        lista.innerHTML = entries.map((e, i) => {
            const d = new Date(e.ts);
            const fecha = d.toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' });
            const hora  = d.toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' });
            const etiquetaLimpia = e.etiqueta.replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]/gu, '').trim();
            return `<div class="backup-copia-item">
                <div style="flex:1;min-width:0;">
                    <div id="backup-label-${i}" style="color:white;font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;" ondblclick="editarNombreCopia(${i})">${etiquetaLimpia}</div>
                    <div style="color:#64748b;font-size:11px;">${fecha} · ${hora}</div>
                </div>
                <button onclick="editarNombreCopia(${i})" title="Renombrar" style="background:none;border:none;color:#475569;cursor:pointer;padding:4px 6px;flex-shrink:0;border-radius:6px;transition:color 0.15s;" onmouseover="this.style.color='#94a3b8'" onmouseout="this.style.color='#475569'">
                    <span class="material-symbols-rounded" style="font-size:16px;display:flex;pointer-events:none;">edit</span>
                </button>
                <button onclick="restaurarCopiaInterna(window._backupKeys[${i}])" style="background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.3);border-radius:8px;color:#60a5fa;font-size:12px;font-weight:600;padding:6px 10px;cursor:pointer;flex-shrink:0;">
                    Restaurar
                </button>
                <button onclick="eliminarCopiaInterna(window._backupKeys[${i}])" style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:8px;color:#f87171;cursor:pointer;padding:6px 8px;margin-left:2px;flex-shrink:0;">
                    <span class="material-symbols-rounded" style="font-size:16px;display:flex;pointer-events:none;">delete</span>
                </button>
            </div>`;
        }).join('');

    } catch(e) {
        lista.innerHTML = '<div style="padding:14px;color:#ef4444;font-size:13px;text-align:center;">Error al cargar copias</div>';
    }
}

async function restaurarCopiaInterna(key) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:30000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);';
    modal.innerHTML = `
        <div style="background:linear-gradient(135deg,#0f172a,#1e293b);border:1px solid rgba(59,130,246,0.3);border-radius:20px;padding:24px;max-width:340px;width:90%;box-shadow:0 24px 64px rgba(0,0,0,0.6);">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                <span class="material-symbols-rounded" style="color:#60a5fa;font-size:24px;">restore</span>
                <span style="color:white;font-size:16px;font-weight:700;">Restaurar copia</span>
            </div>
            <p style="color:#94a3b8;font-size:13px;margin:0 0 20px;">¿Cómo quieres restaurar esta copia?</p>
            <div style="display:flex;flex-direction:column;gap:8px;">
                <button id="btnReemplazar" style="background:linear-gradient(135deg,rgba(239,68,68,0.3),rgba(220,38,38,0.2));border:1px solid rgba(239,68,68,0.4);border-radius:12px;color:white;padding:12px 16px;cursor:pointer;text-align:left;display:flex;align-items:center;gap:10px;">
                    <span class="material-symbols-rounded" style="color:#f87171;font-size:20px;">swap_horiz</span>
                    <div><div style="font-size:14px;font-weight:600;">Reemplazar datos</div><div style="font-size:11px;color:#94a3b8;margin-top:2px;">Borra todo lo actual y carga la copia</div></div>
                </button>
                <button id="btnFusionar" style="background:linear-gradient(135deg,rgba(16,185,129,0.3),rgba(5,150,105,0.2));border:1px solid rgba(16,185,129,0.4);border-radius:12px;color:white;padding:12px 16px;cursor:pointer;text-align:left;display:flex;align-items:center;gap:10px;">
                    <span class="material-symbols-rounded" style="color:#10b981;font-size:20px;">merge</span>
                    <div><div style="font-size:14px;font-weight:600;">Fusionar datos</div><div style="font-size:11px;color:#94a3b8;margin-top:2px;">Combina la copia con los datos actuales</div></div>
                </button>
                <button id="btnCancelarRestaura" style="background:none;border:1px solid rgba(255,255,255,0.1);border-radius:12px;color:#64748b;padding:10px 16px;cursor:pointer;font-size:13px;">
                    Cancelar
                </button>
            </div>
        </div>`;
    document.body.appendChild(modal);

    const accion = await new Promise(resolve => {
        modal.querySelector('#btnReemplazar').onclick = () => resolve('reemplazar');
        modal.querySelector('#btnFusionar').onclick  = () => resolve('fusionar');
        modal.querySelector('#btnCancelarRestaura').onclick = () => resolve(null);
        modal.addEventListener('click', e => { if (e.target === modal) resolve(null); });
    });
    document.body.removeChild(modal);
    if (!accion) return;

    try {
        const entry = await cargarDesdeDB(key);
        if (!entry || !entry.datos) throw new Error('Copia no encontrada');
        if (accion === 'reemplazar') {
            const blob = new Blob([JSON.stringify(entry.datos)], { type: 'application/json' });
            const file = new File([blob], 'backup.json', { type: 'application/json' });
            const dt = new DataTransfer();
            dt.items.add(file);
            const input = document.getElementById('importFile');
            input.files = dt.files;
            window._restaurandoCopiaInterna = true;
            input.dispatchEvent(new Event('change'));
        } else {
            const actual = _serializarDatos() || {};
            const copia = entry.datos;
            const fusionado = Object.assign({}, copia);
            for (const k in actual) {
                if (Array.isArray(actual[k]) && Array.isArray(copia[k])) {
                    fusionado[k] = [...copia[k], ...actual[k]];
                } else if (actual[k] && !copia[k]) {
                    fusionado[k] = actual[k];
                }
            }
            const blob = new Blob([JSON.stringify(fusionado)], { type: 'application/json' });
            const file = new File([blob], 'backup.json', { type: 'application/json' });
            const dt = new DataTransfer();
            dt.items.add(file);
            const input = document.getElementById('importFile');
            input.files = dt.files;
            window._restaurandoCopiaInterna = true;
            input.dispatchEvent(new Event('change'));
        }
        cerrarModalBackup();
    } catch(e) {
        alert('Error al restaurar: ' + e.message);
    }
}

async function eliminarCopiaInterna(key) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:30000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);';
    modal.innerHTML = `
        <div style="background:linear-gradient(135deg,#0f172a,#1e293b);border:1px solid rgba(239,68,68,0.3);border-radius:20px;padding:24px;max-width:320px;width:90%;box-shadow:0 24px 64px rgba(0,0,0,0.6);">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                <span class="material-symbols-rounded" style="color:#f87171;font-size:24px;">delete</span>
                <span style="color:white;font-size:16px;font-weight:700;">Eliminar copia</span>
            </div>
            <p style="color:#94a3b8;font-size:13px;margin:0 0 20px;">¿Seguro que quieres eliminar esta copia? Esta acción no se puede deshacer.</p>
            <div style="display:flex;gap:8px;">
                <button id="btnCancelarElim" style="flex:1;background:none;border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#64748b;padding:10px;cursor:pointer;font-size:13px;">Cancelar</button>
                <button id="btnConfirmarElim" style="flex:1;background:linear-gradient(135deg,#dc2626,#ef4444);border:none;border-radius:10px;color:white;padding:10px;cursor:pointer;font-size:13px;font-weight:700;">Eliminar</button>
            </div>
        </div>`;
    document.body.appendChild(modal);

    const confirmado = await new Promise(resolve => {
        modal.querySelector('#btnConfirmarElim').onclick = () => resolve(true);
        modal.querySelector('#btnCancelarElim').onclick  = () => resolve(false);
        modal.addEventListener('click', e => { if (e.target === modal) resolve(false); });
    });
    document.body.removeChild(modal);
    if (!confirmado) return;

    try {
        if (!db) await abrirDB();
        await new Promise((resolve, reject) => {
            const tx = db.transaction([STORE_NAME], 'readwrite');
            tx.oncomplete = () => resolve();
            tx.onerror   = () => reject(tx.error);
            tx.objectStore(STORE_NAME).delete(key);
        });
        await cargarListaCopias();
    } catch(e) {
        alert('Error al eliminar: ' + e.message);
    }
}

async function editarNombreCopia(i) {
    const key = window._backupKeys[i];
    if (!key) return;
    const labelEl = document.getElementById('backup-label-' + i);
    if (!labelEl || labelEl.querySelector('input')) return; // ya en edición

    const textoActual = labelEl.textContent.trim();
    labelEl.innerHTML = '';
    const input = document.createElement('input');
    input.type = 'text';
    input.value = textoActual;
    input.style.cssText = 'background:rgba(255,255,255,0.07);border:1px solid rgba(59,130,246,0.4);border-radius:6px;color:white;font-size:13px;font-weight:600;padding:2px 8px;width:100%;outline:none;box-sizing:border-box;';
    labelEl.appendChild(input);
    input.focus();
    input.select();

    const guardar = async () => {
        const nuevoNombre = input.value.trim();
        if (!nuevoNombre || nuevoNombre === textoActual) {
            labelEl.textContent = textoActual;
            return;
        }
        try {
            const entry = await cargarDesdeDB(key);
            if (entry) {
                entry.etiqueta = nuevoNombre;
                await guardarEnDB(key, entry);
            }
            labelEl.textContent = nuevoNombre;
        } catch(e) {
            labelEl.textContent = textoActual;
        }
    };

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); guardar(); }
        if (e.key === 'Escape') { labelEl.textContent = textoActual; }
    });
    input.addEventListener('blur', guardar);
}

