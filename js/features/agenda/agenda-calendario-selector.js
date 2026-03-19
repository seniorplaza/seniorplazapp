

window._calTargetField = null;
window._calYear = null;
window._calMonth = null;

function abrirCalendarioAct(targetId) {
    window._calTargetField = targetId;
    const hidden = document.getElementById(targetId);
    const val = hidden ? hidden.value : '';
    const hoy = new Date();
    if (val) {
        const [y,m] = val.split('-').map(Number);
        window._calYear = y; window._calMonth = m - 1;
    } else {
        window._calYear = hoy.getFullYear(); window._calMonth = hoy.getMonth();
    }
    if (!document.getElementById('modalCalAct')) {
        const el = document.createElement('div');
        el.id = 'modalCalAct';
        el.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;align-items:center;justify-content:center;background:rgba(0,0,0,0.7);';
        el.innerHTML = '<div id="modalCalActInner" style="background:#0f172a;border:1px solid rgba(255,255,255,0.1);border-radius:28px;width:100%;max-width:360px;padding:24px;box-sizing:border-box;margin:16px;"></div>';
        document.body.appendChild(el);
        el.addEventListener('click', e => { if (e.target === el) el.style.display = 'none'; });
    }
    _calActRender();
    document.getElementById('modalCalAct').style.display = 'flex';
}

function _calActRender() {
    const inner = document.getElementById('modalCalActInner');
    if (!inner) return;
    const y = window._calYear, m = window._calMonth;
    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const dias = ['L','M','X','J','V','S','D'];
    const hoy = new Date(); hoy.setHours(0,0,0,0);
    const hidden = document.getElementById(window._calTargetField);
    const selVal = hidden ? hidden.value : '';
    const primerDia = new Date(y, m, 1).getDay();
    const offset = (primerDia === 0 ? 6 : primerDia - 1);
    const diasEnMes = new Date(y, m+1, 0).getDate();

    let celdas = '';
    for (let i = 0; i < offset; i++) celdas += '<div></div>';
    for (let d = 1; d <= diasEnMes; d++) {
        const iso = y + '-' + String(m+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
        const esHoy = (new Date(y,m,d).getTime() === hoy.getTime());
        const esSel = (iso === selVal);
        const bg = esSel ? '#3b82f6' : esHoy ? 'rgba(148,163,184,0.12)' : 'transparent';
        const color = esSel ? 'white' : esHoy ? '#94a3b8' : '#e2e8f0';
        const border = esSel ? '1.5px solid #3b82f6' : esHoy ? '1.5px solid rgba(148,163,184,0.4)' : '1.5px solid transparent';
        celdas += `<button onclick="_calActSelDia('${iso}')" style="aspect-ratio:1;border-radius:10px;background:${bg};border:${border};color:${color};font-size:13px;font-weight:${esSel||esHoy?'700':'500'};cursor:pointer;display:flex;align-items:center;justify-content:center;">${d}</button>`;
    }

    inner.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
            <button onclick="_calActMes(-1)" style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;cursor:pointer;display:flex;align-items:center;justify-content:center;">
                <span class="material-symbols-rounded" style="font-size:18px;">chevron_left</span>
            </button>
            <span style="color:white;font-size:16px;font-weight:800;">${meses[m]} ${y}</span>
            <button onclick="_calActMes(1)" style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;cursor:pointer;display:flex;align-items:center;justify-content:center;">
                <span class="material-symbols-rounded" style="font-size:18px;">chevron_right</span>
            </button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:8px;">
            ${dias.map(d => `<div style="text-align:center;color:#475569;font-size:10px;font-weight:800;text-transform:uppercase;padding:4px 0;">${d}</div>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">
            ${celdas}
        </div>
        <button onclick="document.getElementById('modalCalAct').style.display='none'" style="width:100%;margin-top:20px;padding:13px;border-radius:14px;background:rgba(59,130,246,0.15);border:1.5px solid rgba(59,130,246,0.4);color:#93c5fd;font-size:14px;font-weight:800;cursor:pointer;">Cerrar</button>`;
}

function _calActMes(delta) {
    window._calMonth += delta;
    if (window._calMonth > 11) { window._calMonth = 0; window._calYear++; }
    if (window._calMonth < 0) { window._calMonth = 11; window._calYear--; }
    _calActRender();
}

function _calActSelDia(iso) {
    const hidden = document.getElementById(window._calTargetField);
    if (hidden) hidden.value = iso;
    const displayId = window._calTargetField + 'Display';
    const display = document.getElementById(displayId);
    if (display && typeof _formatFechaDisplay === 'function') display.textContent = _formatFechaDisplay(iso);
    document.getElementById('modalCalAct').style.display = 'none';
    if (typeof window._calAct2Callback === 'function') { window._calAct2Callback(iso); window._calAct2Callback = null; }
}
function _fmtCalDisp(iso) {
    if (!iso) return null;
    const [y,m,d] = iso.split('-').map(Number);
    return new Date(y,m-1,d).toLocaleDateString('es-ES', {day:'numeric',month:'short',year:'numeric'});
}

function abrirCalAct2(fieldId, callback) {
    window._calAct2Callback = callback || null;
    abrirCalendarioAct(fieldId);
    if (fieldId === 'editHabitoFechaFin') {
        setTimeout(() => {
            const inner = document.getElementById('modalCalActInner');
            if (!inner || inner.querySelector('#_calBtnQuitarFin')) return;
            const btnLimpiar = document.createElement('button');
            btnLimpiar.id = '_calBtnQuitarFin';
            btnLimpiar.style.cssText = 'width:100%;margin-top:8px;padding:11px;border-radius:14px;background:rgba(239,68,68,0.1);border:1.5px solid rgba(239,68,68,0.3);color:#f87171;font-size:13px;font-weight:700;cursor:pointer;';
            btnLimpiar.textContent = 'Quitar fecha fin';
            btnLimpiar.onclick = function() {
                const h = document.getElementById('editHabitoFechaFin');
                if (h) h.value = '';
                _calAct2ActualizarDisp('editHabitoFechaFin');
                document.getElementById('modalCalAct').style.display = 'none';
            };
            inner.appendChild(btnLimpiar);
        }, 30);
    }
    const origSel = window._calActSelDiaPatched ? null : _calActSelDia;
    if (origSel && !window._calActSelDiaPatched) {
        window._calActSelDiaPatched = true;
        window._calActSelDiaOrig = origSel;
    }
}

function _calAct2ActualizarDisp(fieldId) {
    const val = (document.getElementById(fieldId)||{}).value || '';
    const fmt = val ? _fmtCalDisp(val) : null;
    const dispMap = {
        'op-fecha-desde': 'op-fecha-desde-disp',
        'op-fecha-hasta': 'op-fecha-hasta-disp',
        'est-fecha-desde': 'est-fecha-desde-disp',
        'est-fecha-hasta': 'est-fecha-hasta-disp',
        'rango-desde': 'rango-desde-disp',
        'rango-hasta': 'rango-hasta-disp',
        'actDefFecha': 'actDefFechaDisp',
        'editHabitoFechaInicio': 'editHabitoFechaInicioDisp',
        'editHabitoFechaFin': 'editHabitoFechaFinDisp',
        'editTareaFecha': 'editTareaFechaDisp',
    };
    const dispId = dispMap[fieldId];
    if (dispId) {
        const el = document.getElementById(dispId);
        if (el) {
            if (fieldId === 'editHabitoFechaFin') {
                el.textContent = fmt || 'Sin fecha fin';
                const btn = document.getElementById('editHabitoFechaFinBtn');
                if (btn) { btn.style.borderColor = fmt ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'; btn.style.color = fmt ? '#f1f5f9' : '#94a3b8'; const ico = btn.querySelector('.material-symbols-rounded'); if(ico) ico.style.color = fmt ? '#ef4444' : '#475569'; }
            } else if (fieldId === 'actDefFecha') {
                el.textContent = fmt || 'Hoy';
            } else {
                el.textContent = fmt || (fieldId.includes('desde') ? 'Desde...' : 'Hasta...');
            }
        }
    }
    if (fieldId === 'op-fecha-desde' || fieldId === 'op-fecha-hasta') {
        try { if(typeof renderHistorialOperaciones==='function') renderHistorialOperaciones(); } catch(e){}
    }
    if (fieldId === 'est-fecha-desde' || fieldId === 'est-fecha-hasta') {
        try { if(typeof renderEstadisticas==='function') renderEstadisticas(); } catch(e){}
    }
}
(function(){
    const orig = _calActSelDia;
    _calActSelDia = function(iso) {
        orig(iso);
        if (window._calTargetField) _calAct2ActualizarDisp(window._calTargetField);
    };
})();
document.addEventListener('DOMContentLoaded', function() {
    const hoy = _localDateStr(new Date());
    const hidFecha = document.getElementById('actDefFecha');
    if (hidFecha && !hidFecha.value) hidFecha.value = hoy;
    _calAct2ActualizarDisp('actDefFecha');
});
function _animarCheckCompletado(btnEl) {
}

