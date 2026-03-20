
    window._diarioLongPressTimers = {};
    window._diarioToggleTouchTs = 0;
    function _diarioLongPress(uid, e) {
        if (window.innerWidth >= 640) return;
        e.preventDefault();
    }
    function _diarioDebeIgnorarClick(event) {
        if (!event) return false;
        if (event.type === 'touchend') {
            window._diarioToggleTouchTs = Date.now();
            return false;
        }
        return event.type === 'click' && (Date.now() - (window._diarioToggleTouchTs || 0)) < 450;
    }
    window._diarioToggleDesc = function(uid, event) {
        if (_diarioDebeIgnorarClick(event)) return;
        const descEl = document.getElementById(uid + '_desc');
        if (!descEl) return;
        const allowAnyWidth = descEl.getAttribute('data-desc-any-width') === '1';
        if (window.innerWidth >= 640 && !allowAnyWidth) return;
        const isOpen = descEl.style.display !== 'none' && descEl.style.display !== '';
        descEl.style.display = isOpen ? 'none' : 'block';

    };
    window._diarioToggleDescCard = function(event, uid) {
        if (!event) return;
        const target = event.target;
        if (!target) return;
        if (target.closest('button, input, textarea, select, label, a')) return;
        if (target.closest('[data-drag-handle-mobile], [data-drag-handle]')) return;
        if (_diarioDebeIgnorarClick(event)) return;
        const descEl = document.getElementById(uid + '_desc');
        if (!descEl) return;
        const allowAnyWidth = descEl.getAttribute('data-desc-any-width') === '1';
        if (window.innerWidth >= 640 && !allowAnyWidth) return;
        _diarioToggleDesc(uid);
    };
    function _lockShakeDiario(btn) {
        if (btn.classList.contains('lock-shake')) return;
        btn.classList.add('lock-shake');
        if (navigator.vibrate) navigator.vibrate([60, 40, 60, 40, 60, 40, 80]);
        btn.addEventListener('animationend', function() {
            btn.classList.remove('lock-shake');
        }, { once: true });
    }
    window._vistaTareasActiva = 'tarea';
    function cambiarVistaTareas(vista) {
        window._vistaTareasActiva = vista;
        var btnT = document.getElementById('tab-tareas-tarea');
        var btnR = document.getElementById('tab-tareas-recurrente');
        if (!btnT || !btnR) return;
        var activeStyle = {
            border: '1px solid rgba(245,158,11,0.4)',
            background: 'linear-gradient(135deg,rgba(120,53,15,0.8) 0%,rgba(180,83,9,0.7) 50%,rgba(217,119,6,0.8) 100%)',
            boxShadow: '0 0 16px rgba(245,158,11,0.3)',
            color: 'white'
        };
        var inactiveStyle = {
            border: '1px solid transparent',
            background: 'transparent',
            boxShadow: 'none',
            color: '#64748b'
        };
        var actBtn  = vista === 'tarea' ? btnT : btnR;
        var inactBtn = vista === 'tarea' ? btnR : btnT;
        Object.assign(actBtn.style, activeStyle);
        Object.assign(inactBtn.style, inactiveStyle);
        if (typeof renderTareasSection === 'function') renderTareasSection();
        if (navigator.vibrate) navigator.vibrate(10);
    }
        (function() {
            function applyGymInputMode() {
                var isMob = window.innerWidth < 768;
                document.querySelectorAll('.gym-stat-inp').forEach(function(inp) {
                    if (isMob) {
                        inp.setAttribute('readonly', '');
                        inp.setAttribute('inputmode', 'none');
                        inp.setAttribute('tabindex', '-1');
                    } else {
                        inp.removeAttribute('readonly');
                        inp.setAttribute('inputmode', 'numeric');
                        inp.removeAttribute('tabindex');
                    }
                });
            }
            document.addEventListener('DOMContentLoaded', applyGymInputMode);
            window.addEventListener('resize', applyGymInputMode);
            var _origInitGymSwipeCells = typeof _initGymSwipeCells !== 'undefined' ? _initGymSwipeCells : null;
            document.addEventListener('DOMContentLoaded', function() {
                var gymPanels = document.querySelectorAll('[id^="gym-panel-"]');
                if (!gymPanels.length) return;
                var observer = new MutationObserver(function() {
                    if (window.innerWidth < 768) applyGymInputMode();
                });
                gymPanels.forEach(function(p) {
                    observer.observe(p, { childList: true, subtree: true });
                });
            });
        })();
    
