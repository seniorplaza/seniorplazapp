
                (function() {
                    document.addEventListener('DOMContentLoaded', function() {
                        var btn = document.getElementById('gym-intervalo-btn');
                        if (!btn) return;
                        var _lpt = null, _lpFired = false;
                        btn.addEventListener('pointerdown', function() {
                            _lpFired = false;
                            _lpt = setTimeout(function() {
                                _lpFired = true;
                                var el = document.getElementById('gym-intervalo-label');
                                if (!el) return;
                                var filtro = el.dataset.filtro || 'dia';
                                if (filtro === 'todo' || filtro === 'rango') return;
                                var offsetActual = parseInt(el.dataset.offset) || 0;
                                if (filtro === 'dia' && offsetActual === 0) return;
                                if (filtro === 'dia' && typeof gymGuardarSesionDia === 'function') gymGuardarSesionDia(typeof _gymFechaKey === 'function' ? _gymFechaKey(offsetActual) : null);
                                el.dataset.filtro = 'dia';
                                el.dataset.offset = 0;
                                el.textContent = 'Hoy';
                                if (typeof gymCargarStatsParaIntervalo === 'function') gymCargarStatsParaIntervalo();
                                if (navigator.vibrate) navigator.vibrate([20, 30, 60]);
                            }, 600);
                        });
                        btn.addEventListener('pointerup', function() { clearTimeout(_lpt); });
                        btn.addEventListener('pointercancel', function() { clearTimeout(_lpt); });
                        btn.addEventListener('click', function(e) {
                            if (_lpFired) { e.preventDefault(); e.stopImmediatePropagation(); _lpFired = false; }
                        }, true);
                    });
                })();
                
