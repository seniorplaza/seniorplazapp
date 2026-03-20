
(function() {
    function _initIntervaloLP(btnId, ctx, abrirFn, resetFn, renderFn) {
        document.addEventListener('DOMContentLoaded', function() {
            var btn = document.getElementById(btnId);
            if (!btn) return;
            var _lpt = null, _lpFired = false;
            btn.addEventListener('pointerdown', function() {
                _lpFired = false;
                _lpt = setTimeout(function() {
                    _lpFired = true;
                    resetFn();
                    if (navigator.vibrate) navigator.vibrate([20,30,60]);
                }, 600);
            });
            btn.addEventListener('pointerup',     function() { clearTimeout(_lpt); });
            btn.addEventListener('pointercancel', function() { clearTimeout(_lpt); });
            btn.addEventListener('click', function(e) {
                if (_lpFired) { e.preventDefault(); e.stopImmediatePropagation(); _lpFired = false; return; }
                if (typeof abrirFn === 'function') abrirFn();
            }, true);
        });
    }

    _initIntervaloLP('diario-intervalo-btn', 'diario',
        function() { if (typeof abrirModalIntervaloDiario === 'function') abrirModalIntervaloDiario(); },
        function() {
            var el = document.getElementById('diario-intervalo-label');
            if (!el) return;
            var filtro = el.dataset.filtro || 'dia';
            el.dataset.offset = '0';
            if (filtro === 'dia') el.textContent = 'Hoy';
            else if (filtro === 'mes') { var m = new Date().toLocaleDateString('es-ES',{month:'long',year:'numeric'}); el.textContent = m.charAt(0).toUpperCase()+m.slice(1); }
            else if (filtro === 'semana') { var now=new Date(),lun=new Date(now); lun.setDate(now.getDate()-((now.getDay()+6)%7)); lun.setHours(0,0,0,0); var dom=new Date(lun); dom.setDate(lun.getDate()+6); var fmt=function(d){return d.toLocaleDateString('es-ES',{day:'2-digit',month:'short'});}; el.textContent=fmt(lun)+' - '+fmt(dom); }
            else if (filtro === 'ano') el.textContent = 'Año '+new Date().getFullYear();
            if (typeof renderDiario === 'function') renderDiario();
        }
    );

    _initIntervaloLP('est-intervalo-btn-main', 'est',
        function() { if (typeof abrirModalIntervaloEst === 'function') abrirModalIntervaloEst(); },
        function() {
            window._estNavOffset = 0;
            window._estNavDesde = null;
            window._estNavHasta = null;
            if (typeof setEstFiltroIntervalo === 'function') setEstFiltroIntervalo(window._estFiltro || 'mes');
        }
    );
    _initIntervaloLP('nutri-intervalo-btn-main', 'nutri',
        function() { if (typeof abrirModalIntervaloNutri === 'function') abrirModalIntervaloNutri(); },
        function() {
            window._nutriFiltro = 'dia';
            window._nutriNavOffset = 0;
            window._nutriNavDesde = null;
            window._nutriNavHasta = null;
            if (typeof _nutriUpdateLabel === 'function') _nutriUpdateLabel();
            if (typeof renderNutricion === 'function') renderNutricion();
        }
    );

    _initIntervaloLP('tareas-intervalo-btn', 'tareas',
        function() { if (typeof abrirModalIntervaloTareas === 'function') abrirModalIntervaloTareas(); },
        function() {
            var el = document.getElementById('tareas-intervalo-label');
            if (!el) return;
            var filtro = el.dataset.filtro || 'mes';
            el.dataset.offset = '0';
            if (filtro === 'dia') el.textContent = 'Hoy';
            else if (filtro === 'mes') { var m = new Date().toLocaleDateString('es-ES',{month:'long',year:'numeric'}); el.textContent = m.charAt(0).toUpperCase()+m.slice(1); }
            else if (filtro === 'semana') { var now=new Date(),lun=new Date(now); lun.setDate(now.getDate()-((now.getDay()+6)%7)); lun.setHours(0,0,0,0); var dom=new Date(lun); dom.setDate(lun.getDate()+6); var fmt=function(d){return d.toLocaleDateString('es-ES',{day:'2-digit',month:'short'});}; el.textContent=fmt(lun)+' - '+fmt(dom); }
            else if (filtro === 'ano') el.textContent = 'Año '+new Date().getFullYear();
            if (typeof renderTareasSection === 'function') renderTareasSection();
        }
    );
})();

