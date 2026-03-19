
                (function() {
                    document.addEventListener('DOMContentLoaded', function() {
                        var wrapper = document.getElementById('diario-intervalo-wrapper');
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
                            if (typeof diarioNavIntervalo === 'function') {
                                diarioNavIntervalo(dx > 0 ? -1 : 1);
                                if (navigator.vibrate) navigator.vibrate(12);
                            }
                        }, { passive: true });
                    });
                })();
                
