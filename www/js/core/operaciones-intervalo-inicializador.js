
    document.addEventListener('DOMContentLoaded', function() {
        const now = new Date();
        const lun = new Date(now); lun.setDate(now.getDate() - ((now.getDay()+6)%7)); lun.setHours(0,0,0,0);
        const dom = new Date(lun); dom.setDate(lun.getDate() + 6);
        const fmt = d => d.toLocaleDateString('es-ES', { day:'2-digit', month:'short' });
        const sub = document.getElementById('intervalo-semana-sub');
        if (sub) sub.textContent = fmt(lun) + ' - ' + fmt(dom);
        const hoy = document.getElementById('intervalo-hoy-sub');
        if (hoy) hoy.textContent = now.toLocaleDateString('es-ES', { day:'numeric', month:'long' });
        const ano = document.getElementById('intervalo-ano-sub');
        if (ano) ano.textContent = 'Año ' + now.getFullYear();
        const mes = document.getElementById('intervalo-mes-sub');
        if (mes) {
            const m = now.toLocaleDateString('es-ES', { month:'long', year:'numeric' });
            mes.textContent = m.charAt(0).toUpperCase() + m.slice(1);
        }
        _marcarBtnIntervaloActivo('mes');
        const labelEl = document.getElementById('op-intervalo-label');
        if (labelEl) {
            const m2 = now.toLocaleDateString('es-ES', { month:'long', year:'numeric' });
            labelEl.textContent = m2.charAt(0).toUpperCase() + m2.slice(1);
        }
    });

    function _marcarBtnIntervaloActivo(filtro) {
        const map = { mes:'intervalo-btn-mes', semana:'intervalo-btn-semana', dia:'intervalo-btn-hoy', ano:'intervalo-btn-ano', todo:null };
        ['intervalo-btn-mes','intervalo-btn-semana','intervalo-btn-hoy','intervalo-btn-ano'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.background = 'rgba(255,255,255,0.06)';
        });
        const activeId = map[filtro];
        if (activeId) {
            const el = document.getElementById(activeId);
            if (el) el.style.background = 'rgba(59,130,246,0.25)';
        }
    }
    const _elegirIntervaloOrig = elegirIntervalo;
    window.elegirIntervalo = function(filtro) {
        _marcarBtnIntervaloActivo(filtro);
        _elegirIntervaloOrig(filtro);
    };
    
