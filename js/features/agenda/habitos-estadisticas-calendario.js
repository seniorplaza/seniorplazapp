
window._calHistoricoHabitoId = null;
window._calHistoricoAnio = new Date().getFullYear();

function abrirCalendarioHistorico(id) {
    window._calHistoricoHabitoId = id;
    window._calHistoricoAnio = new Date().getFullYear();
    window._calHistoricoMes  = new Date().getMonth();
    const habito = (window.agendaData.habitos||[]).find(h=>h.id===id);
    if (!habito) return;
    document.getElementById('calHistoricoNombre').textContent = habito.nombre;
    _renderCalHistoricoContenido(id);
    document.getElementById('modalCalHistorico').style.display = 'flex';
}

function cerrarCalendarioHistorico() {
    document.getElementById('modalCalHistorico').style.display = 'none';
    window._calHistoricoHabitoId = null;
}

function calHistoricoNavAnio(dir) {
    window._calHistoricoAnio += dir;
    _renderCalHistoricoContenido(window._calHistoricoHabitoId);
}
window._calHistoricoMes = new Date().getMonth();

function calHistoricoNavAnio(dir) {
    const d = new Date(window._calHistoricoAnio, window._calHistoricoMes + dir, 1);
    window._calHistoricoAnio = d.getFullYear();
    window._calHistoricoMes  = d.getMonth();
    _renderCalHistoricoContenido(window._calHistoricoHabitoId);
}

function _renderCalHistoricoContenido(id) {
    const habito = (window.agendaData.habitos||[]).find(h=>h.id===id);
    if (!habito) return;
    const color = habito.categoria?.color || '#10b981';
    const registros = habito.registros || [];
    const completadosSet = new Set(registros.filter(r=>r.completado===true).map(r=>r.fecha));
    const fallidosSet    = new Set(registros.filter(r=>r.completado===false && r.explicit).map(r=>r.fecha));
    const mes  = window._calHistoricoMes  ?? new Date().getMonth();
    const anio = window._calHistoricoAnio ?? new Date().getFullYear();
    const hoy  = new Date(); hoy.setHours(0,0,0,0);
    const nombresMeses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const nombresDias  = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

    const primerDia = new Date(anio, mes, 1);
    const diasMes   = new Date(anio, mes+1, 0).getDate();
    const offset    = (primerDia.getDay()+6)%7; // lunes=0
    const diasAnterior = new Date(anio, mes, 0).getDate();
    let celdas = '';
    for (let s = 0; s < offset; s++) {
        const n = diasAnterior - offset + s + 1;
        celdas += `<div style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;"><span style="color:#1e293b;font-size:15px;font-weight:500;">${n}</span></div>`;
    }

    const _toLocalStr = d => { const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),dd=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${dd}`; };
    const hoyStr = _toLocalStr(hoy);
    for (let dia = 1; dia <= diasMes; dia++) {
        const d = new Date(anio, mes, dia); d.setHours(0,0,0,0);
        const dStr = _toLocalStr(d);
        const esFuturo  = d > hoy;
        const aplica    = _actAplicaHoy(habito, d);
        const esHoy     = dStr === hoyStr;
        const completado = completadosSet.has(dStr);
        const fallido    = fallidosSet.has(dStr);
        const pendiente  = !esFuturo && !esHoy && aplica && !completado && !fallido; // naranja: solo días pasados, nunca hoy

        let bg = 'transparent', border = 'none', txtC = '#94a3b8', fw = '500', extraStyle = '';
        if (!aplica || esFuturo) {
            txtC = esFuturo ? '#334155' : '#475569'; fw = '400';
        } else if (completado) {
            bg = 'rgba(16,185,129,0.18)'; txtC = '#10b981'; fw = '700'; border = `2px solid #10b981`;
            extraStyle = ``;
        } else if (fallido) {
            bg = 'rgba(239,68,68,0.12)'; txtC = '#ef4444'; fw = '700'; border = '2px solid #ef4444';
        } else if (pendiente) {
            bg = 'rgba(249,115,22,0.12)'; txtC = '#f97316'; fw = '700'; border = '2px solid #f97316';
        }
        if (esHoy && !completado && !fallido) {
            border = '2px solid rgba(148,163,184,0.5)'; txtC = '#94a3b8'; fw = '800';
        }
        celdas += `<div style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;padding:2px;">
            <button onclick="${aplica && !esFuturo ? `habitoToggleDia('${id}','${dStr}')` : ''}" style="width:100%;height:100%;border-radius:50%;background:${bg};border:${border};color:${txtC};font-size:15px;font-weight:${fw};cursor:${esFuturo||!aplica?'default':'pointer'};display:flex;align-items:center;justify-content:center;transition:all 0.2s;${extraStyle}" ${esFuturo||!aplica?'disabled':''}>
                ${dia}
            </button>
        </div>`;
    }
    const totalCeldas = offset + diasMes;
    const resto = 42 - totalCeldas; // siempre 6 filas exactas
    for (let s = 1; s <= resto; s++) {
        celdas += `<div style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;"><span style="color:#1e293b;font-size:15px;font-weight:500;">${s}</span></div>`;
    }

    const html = `
    <div style="padding:0 4px;">
        <!-- Navegación mes -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding:0 4px;">
            <button onclick="calHistoricoNavAnio(-1)" style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#60a5fa;cursor:pointer;display:flex;align-items:center;justify-content:center;">
                <span class="material-symbols-rounded" style="font-size:20px;">chevron_left</span>
            </button>
            <div style="text-align:center;">
                <div style="color:white;font-size:18px;font-weight:800;">${nombresMeses[mes]}</div>
                <div style="color:#475569;font-size:13px;font-weight:600;">${anio}</div>
            </div>
            <button onclick="calHistoricoNavAnio(1)" style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#60a5fa;cursor:pointer;display:flex;align-items:center;justify-content:center;">
                <span class="material-symbols-rounded" style="font-size:20px;">chevron_right</span>
            </button>
        </div>
        <!-- Días semana header -->
        <div style="display:grid;grid-template-columns:repeat(7,1fr);margin-bottom:8px;">
            ${nombresDias.map(d=>`<div style="color:#475569;font-size:12px;font-weight:700;text-align:center;padding:4px 0;">${d}</div>`).join('')}
        </div>
        <!-- Grid días -->
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">
            ${celdas}
        </div>
        <!-- Leyenda -->
        <div style="display:flex;gap:16px;justify-content:center;margin-top:18px;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:6px;"><div style="width:12px;height:12px;border-radius:4px;border:2px solid #10b981;background:rgba(16,185,129,0.15);"></div><span style="color:#64748b;font-size:11px;font-weight:600;">Completado</span></div>
            <div style="display:flex;align-items:center;gap:6px;"><div style="width:12px;height:12px;border-radius:4px;border:2px solid #f97316;background:rgba(249,115,22,0.1);"></div><span style="color:#64748b;font-size:11px;font-weight:600;">Pendiente</span></div>
            <div style="display:flex;align-items:center;gap:6px;"><div style="width:12px;height:12px;border-radius:4px;border:2px solid #ef4444;background:rgba(239,68,68,0.1);"></div><span style="color:#64748b;font-size:11px;font-weight:600;">No completado</span></div>
            <div style="display:flex;align-items:center;gap:6px;"><div style="width:12px;height:12px;border-radius:4px;border:2px solid rgba(148,163,184,0.5);background:transparent;"></div><span style="color:#64748b;font-size:11px;font-weight:600;">Hoy</span></div>
        </div>
    </div>`;

    const cont = document.getElementById('calHistoricoContenido');
    cont.innerHTML = html;

}
window._editHabitoId = null;
window._editHabitoFrecSel = 'todos_dias';
window._editHabitoDiasSel = [];

function abrirEditarHabito(id) {
    const habito = (window.agendaData.habitos||[]).find(h=>h.id===id);
    if (!habito) return;
    window._editHabitoId = id;
    window._editHabitoFrecSel = habito.frecuencia || 'todos_dias';
    window._editHabitoDiasSel = [...(habito.diasSemana||[])];
    window._editHabitoCatObj = habito.categoria || null;
    window._editHabitoCatId = habito.categoriaId || _editResolveCatId(habito.categoria) || null;
    window._editHabitoEtiqueta = habito.etiqueta || null;

    document.getElementById('editHabitoNombre').value = habito.nombre || '';
    const _ehd = document.getElementById('editHabitoDesc'); _ehd.value = habito.desc || ''; setTimeout(()=>{ _ehd.style.height='auto'; _ehd.style.height=_ehd.scrollHeight+'px'; },0);
    document.getElementById('editHabitoFechaInicio').value = habito.fechaInicio || '';
    document.getElementById('editHabitoFechaFin').value = habito.fechaFin || '';
    _calAct2ActualizarDisp('editHabitoFechaInicio');
    _calAct2ActualizarDisp('editHabitoFechaFin');
    window._editHabitoRecs = [...(habito.recordatorios || (habito.hora ? [habito.hora] : []))];
    window._editHabitoHora = '';
    _editRenderRecList('habito');
    _editActualizarHoraDisp('habito');
    _editRenderCatDropdown('habito');

    _renderEditFrecGrid();
    _renderEditDiasSemana();
    document.getElementById('modalEditarHabito').style.display = 'flex';
}

function cerrarEditarHabito() {
    document.getElementById('modalEditarHabito').style.display = 'none';
    window._editHabitoId = null;
}

function _renderEditFrecGrid() {
    const opciones = [
        { v:'todos_dias', label:'Todos los días', icon:'event' },
        { v:'dias_semana', label:'Días semana', icon:'view_week' },
        { v:'cada_x_dias', label:'Cada X días', icon:'autorenew' },
        { v:'veces_periodo', label:'X veces/período', icon:'repeat' },
    ];
    const sel = window._editHabitoFrecSel;
    const color = '#60a5fa';
    document.getElementById('editHabitoFrecGrid').innerHTML = opciones.map(o=>`
        <button onclick="editHabitoSelFrec('${o.v}')" style="display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:12px;border:1.5px solid ${sel===o.v?color:'rgba(255,255,255,0.08)'};background:${sel===o.v?'rgba(59,130,246,0.12)':'transparent'};color:${sel===o.v?color:'#64748b'};cursor:pointer;font-size:12px;font-weight:${sel===o.v?'700':'500'};">
            <span class="material-symbols-rounded" style="font-size:16px;">${o.icon}</span>${o.label}
        </button>`).join('');
    document.getElementById('editHabitoDiasSemanaWrap').style.display = sel === 'dias_semana' ? 'block' : 'none';
}

function editHabitoSelFrec(v) {
    window._editHabitoFrecSel = v;
    _renderEditFrecGrid();
    _renderEditDiasSemana();
}

function _renderEditDiasSemana() {
    const dias = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    const sel = window._editHabitoDiasSel;
    const color = '#60a5fa';
    document.getElementById('editHabitoDiasSemana').innerHTML = dias.map((d,i)=>`
        <button onclick="editHabitoTogDia(${i})" style="width:40px;height:40px;border-radius:50%;border:1.5px solid ${sel.includes(i)?color:'rgba(255,255,255,0.1)'};background:${sel.includes(i)?'rgba(59,130,246,0.12)':'transparent'};color:${sel.includes(i)?color:'#475569'};font-size:11px;font-weight:700;cursor:pointer;">${d}</button>`).join('');
}

function editHabitoTogDia(i) {
    const arr = window._editHabitoDiasSel;
    const idx = arr.indexOf(i);
    if (idx>=0) arr.splice(idx,1); else arr.push(i);
    _renderEditDiasSemana();
}

function guardarEditarHabito() {
    const habito = (window.agendaData.habitos||[]).find(h=>h.id===window._editHabitoId);
    if (!habito) return;
    const nombre = document.getElementById('editHabitoNombre').value.trim();
    if (!nombre) { document.getElementById('editHabitoNombre').style.borderColor='#ef4444'; return; }
    habito.nombre = nombre;
    habito.desc = document.getElementById('editHabitoDesc').value.trim();
    habito.frecuencia = window._editHabitoFrecSel;
    habito.diasSemana = window._editHabitoFrecSel === 'dias_semana' ? [...window._editHabitoDiasSel] : habito.diasSemana;
    habito.fechaInicio = document.getElementById('editHabitoFechaInicio').value || habito.fechaInicio;
    habito.fechaFin = document.getElementById('editHabitoFechaFin').value || null;
    if (window._editHabitoCatId) {
        const cats = (window.finanzasData && window.finanzasData.categorias) || [];
        const cat = cats.find(c => c.id === window._editHabitoCatId);
        if (cat) { habito.categoriaId = cat.id; habito.categoria = { icono: cat.icon, color: cat.color, nombre: cat.name }; }
    }
    if (window._editHabitoEtiqueta !== undefined) habito.etiqueta = window._editHabitoEtiqueta;
    habito.recordatorios = [...(window._editHabitoRecs || [])];
    habito.hora = habito.recordatorios[0] || '';
    guardarAgendaData();
    renderHabitosSection();
    renderDiario && renderDiario();
    cerrarEditarHabito();
    _mostrarToast && _mostrarToast('edit', '#3b82f6', 'Hábito actualizado');
}

