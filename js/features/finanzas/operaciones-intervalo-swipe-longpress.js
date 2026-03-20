
                (function() {
                    document.addEventListener('DOMContentLoaded', function() {
                        var wrapper = document.getElementById('op-intervalo-wrapper');
                        if (!wrapper) return;
                        var _sx = 0, _sy = 0, _t = 0, _active = false;
                        wrapper.addEventListener('touchstart', function(e) {
                            var t = e.touches[0];
                            _sx = t.clientX; _sy = t.clientY; _t = Date.now(); _active = true;
                        }, { passive: true });
                        wrapper.addEventListener('touchmove', function(e) {
                            if (!_active) return;
                            var dx = e.touches[0].clientX - _sx;
                            var dy = e.touches[0].clientY - _sy;
                            if (Math.abs(dx) > Math.abs(dy) * 1.2 && Math.abs(dx) > 8) e.preventDefault();
                        }, { passive: false });
                        wrapper.addEventListener('touchend', function(e) {
                            if (!_active) return;
                            _active = false;
                            var t = e.changedTouches[0];
                            var dx = t.clientX - _sx;
                            var dy = t.clientY - _sy;
                            var dt = Date.now() - _t;
                            if (Math.abs(dx) < Math.abs(dy) * 1.2) return;
                            var minDist = dt < 300 ? 35 : 70;
                            if (Math.abs(dx) < minDist) return;
                            if (typeof opNavIntervalo === 'function') {
                                opNavIntervalo(dx > 0 ? -1 : 1);
                                if (navigator.vibrate) navigator.vibrate(12);
                            }
                        }, { passive: true });
                        var _opBtn = wrapper.querySelector('button:not(:first-child):not(:last-child)');
                        if (_opBtn) {
                            var _lpt = null, _lpFired = false;
                            _opBtn.addEventListener('pointerdown', function() {
                                _lpFired = false;
                                _lpt = setTimeout(function() {
                                    if (window._opNavOffset === 0 && window._opFiltro === 'mes') return;
                                    _lpFired = true;
                                    var now = new Date();
                                    var m = now.toLocaleDateString('es-ES', { month:'long', year:'numeric' });
                                    var mesLabel = m.charAt(0).toUpperCase() + m.slice(1);
                                    if (typeof setOpFiltro === 'function') setOpFiltro('mes', mesLabel);
                                    if (navigator.vibrate) navigator.vibrate([20, 30, 60]);
                                }, 600);
                            });
                            _opBtn.addEventListener('pointerup', function() { clearTimeout(_lpt); });
                            _opBtn.addEventListener('pointercancel', function() { clearTimeout(_lpt); });
                            _opBtn.addEventListener('click', function(e) {
                                if (_lpFired) { _lpFired = false; e.stopImmediatePropagation(); e.preventDefault(); }
                            }, true);
                        }
                    });
                })();
                
