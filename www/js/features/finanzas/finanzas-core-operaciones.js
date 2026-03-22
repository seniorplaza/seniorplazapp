
    function _undoActualizarBtn() {
        if (typeof _undoActualizarBtnSnapshots === 'function') _undoActualizarBtnSnapshots();
    }
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(_undoActualizarBtn, 800);
    });
    document.addEventListener('keydown', function(e) {
        var tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea') return; // dejar al navegador deshacer texto
        if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'z') {
            e.preventDefault();
            if (typeof redoEstado === 'function') redoEstado();
        }
        else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.altKey && !e.shiftKey) {
            e.preventDefault();
            if (typeof undoEstado === 'function') undoEstado();
        }
    });
    window.confirmarBorrarTodo = function() {
        var overlay = document.getElementById('modal-borrar-overlay');
        if (overlay) { overlay.classList.add('open'); overlay.style.display = 'flex'; }
    };

    window.cerrarModalBorrar = function() {
        var overlay = document.getElementById('modal-borrar-overlay');
        if (overlay) { overlay.classList.remove('open'); overlay.style.display = 'none'; }
    };

    window.ejecutarBorrarTodo = async function() {
        cerrarModalBorrar();
        if (typeof _undoPushInmediato === 'function') _undoPushInmediato();
        var contenedores = ['listaIngresos','listaGastos','listaSimulaciones',
            'listaCuentas','listaInversiones','listaPosiciones','listaDeudas',
            'listaReformas','listaMobiliario'];
        contenedores.forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.innerHTML = '';
        });
        document.querySelectorAll('.pdf-lista-bancos, .pdf-lista-banco').forEach(function(el) { el.innerHTML = ''; });
        if (typeof window._archivados !== 'undefined') {
            window._archivados = {};
        }
        var previewFoto = document.getElementById('previewFotoVivienda');
        var imagenVivienda = document.getElementById('imagenVivienda');
        if (previewFoto) previewFoto.style.display = 'none';
        if (imagenVivienda) imagenVivienda.src = '';
        var planoImg = document.getElementById('planoImagen');
        if (planoImg) { planoImg.src = ''; planoImg.style.display = 'none'; }
        var planoEmpty = document.getElementById('planoEmpty');
        if (planoEmpty) planoEmpty.style.display = '';
        if (window.rooms360) window.rooms360 = [];
        var carousel360 = document.getElementById('rooms-carousel');
        if (carousel360) carousel360.innerHTML = '';
        ['refCatastral','catLocalizacion','catSuperficie','catAnio','catParcelaLoc','catSuperficieParcela','catValor'].forEach(function(id) {
            var campo = document.getElementById(id);
            if (campo) campo.value = (campo.type === 'number') ? '0' : '';
        });
        var catClase = document.getElementById('catClase');
        var catUso = document.getElementById('catUso');
        var catParticipacion = document.getElementById('catParticipacion');
        if (catClase) catClase.value = 'Urbano';
        if (catUso) catUso.value = 'Residencial';
        if (catParticipacion) catParticipacion.value = '100';
        ['donMama','donPapa','precioCasa','gastoNotaria'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.value = '0';
        });
        var percEntrada = document.getElementById('percEntrada');
        var percITP = document.getElementById('percITP');
        if (percEntrada) percEntrada.value = '20';
        if (percITP) percITP.value = '10';
        if (typeof window._VL !== 'undefined' && window._VL) {
            window._VL.state = { activas: [], miniaturas: [] };
            var vlContainer = document.getElementById('vl-container');
            if (vlContainer) vlContainer.innerHTML = '';
        }
        if (window.finanzasData) {
            window.finanzasData.operaciones = [];
            window.finanzasData.categorias = [];
            window.finanzasData.programados = [];
        }
        if (window.agendaData) {
            window.agendaData.habitos = [];
            window.agendaData.tareasRecurrentes = [];
            window.agendaData.tareas = [];
            if (Array.isArray(window.agendaData.entradas)) window.agendaData.entradas = [];
            if (typeof window.agendaData.diario === 'object' && window.agendaData.diario !== null) window.agendaData.diario = {};
        }
        ['pecho','espalda','brazo','pierna','cardio'].forEach(function(p) {
            var panel = document.getElementById('gym-panel-' + p);
            if (panel) panel.innerHTML = '';
        });
        window._gymSesionesHistorial = {};
        window._gymArchivados = [];
        var gymTiempo = document.getElementById('gym-stat-tiempo');
        var gymHidra = document.getElementById('gym-stat-hidratacion');
        var gymReposo = document.getElementById('gym-stat-reposo');
        var gymPeso = document.getElementById('gym-peso-usuario');
        if (gymTiempo) { gymTiempo.dataset.totalSecs = '0'; gymTiempo.textContent = '00:00'; }
        if (gymHidra) { gymHidra.dataset.litros = '0'; gymHidra.textContent = '0.0L'; }
        if (gymReposo) { gymReposo.dataset.totalSecs = '0'; gymReposo.textContent = '00:00'; }
        if (gymPeso) gymPeso.value = '0';
        ['pecho','espalda','brazo','pierna','cardio'].forEach(function(p) {
            var panel = document.getElementById('gym-panel-' + p);
            if (panel && typeof _gymEmptyState === 'function') try { _gymEmptyState(panel); } catch(e) {}
        });
        if (window.nutricionData) {
            window.nutricionData.comidas = [];
            window.nutricionData.registrosPeso = [];
        }
        var carruselComidas = document.getElementById('carrusel-comidas');
        if (carruselComidas) carruselComidas.innerHTML = '';
        var dotsComidas = document.getElementById('dots-comidas');
        if (dotsComidas) dotsComidas.innerHTML = '';
        var wrapperComidas = document.getElementById('carrusel-comidas-wrapper');
        if (wrapperComidas) wrapperComidas.style.display = 'none';
        var nutriEmpty = document.getElementById('nutri-empty');
        if (nutriEmpty) nutriEmpty.style.display = 'block';
        var iconoCont = document.getElementById('iconoPrincipalContainer');
        if (iconoCont) {
            var iSpan = iconoCont.querySelector('.material-symbols-rounded');
            if (iSpan) iSpan.textContent = 'home';
            var iImg = iconoCont.querySelector('img');
            if (iImg) iImg.remove();
        }
        if (typeof saveTimeout !== 'undefined') clearTimeout(saveTimeout);
        try { localStorage.removeItem('finanzasData'); } catch(e) {}
        try { localStorage.removeItem('agendaData'); } catch(e) {}
        try {
            if (typeof guardarEnDB === 'function') {
                await guardarEnDB('seniorPlazAppData', {});
            }
        } catch(e) { console.warn('No se pudo limpiar IndexedDB:', e); }
        if (typeof filtrarCategorias === 'function') try { filtrarCategorias('ALL'); } catch(e) {}
        if (typeof renderHistorialOperaciones === 'function') try { renderHistorialOperaciones(); } catch(e) {}
        if (typeof renderEstadisticas === 'function') try { renderEstadisticas(); } catch(e) {}
        if (typeof renderDiario === 'function') try { renderDiario(); } catch(e) {}
        if (typeof renderHabitosSection === 'function') try { renderHabitosSection(); } catch(e) {}
        if (typeof renderTareasSection === 'function') try { renderTareasSection(); } catch(e) {}
        if (typeof renderNutricion === 'function') try { renderNutricion(); } catch(e) {}
        if (typeof calculate === 'function') try { calculate(); } catch(e) {}
        window._snapshotActual = {};
        if (typeof window._limpiarHistorialUndo === 'function') window._limpiarHistorialUndo();
    };
    document.addEventListener('DOMContentLoaded', function() {
        var btnImportar = document.querySelector('button[title="Importar datos"]');
        var inputFile   = document.getElementById('importFile');
        if (btnImportar && inputFile) {
            btnImportar.onclick = function(e) {
                e.preventDefault();
                inputFile.value = '';
                setTimeout(function() { inputFile.click(); }, 0);
            };
        }
    });
    document.addEventListener('DOMContentLoaded', function() {
        function isMobile() {
            return window.innerWidth < 768;
        }
        // Navegacion entre secciones solo por botones en movil.

    }); // end DOMContentLoaded swipe
    function _initCarruselDragScroll(wrapper) {
        if (!wrapper || wrapper._dragScrollInit) return;
        wrapper._dragScrollInit = true;
        {
            let isDown = false;
            let startX;
            let scrollLeft;
            let velocity = 0;
            let lastX = 0;
            let lastTime = 0;
            let hasMoved = false; // Track if mouse has moved significantly
            function smoothScrollTo(element, target, duration) {
                const start = element.scrollLeft;
                const change = target - start;
                const startTime = performance.now();
                
                function animateScroll(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    
                    element.scrollLeft = start + (change * easeOut);
                    
                    if (progress < 1) {
                        requestAnimationFrame(animateScroll);
                    }
                }
                
                requestAnimationFrame(animateScroll);
            }
            let mouseStartTime = 0;
            let mouseTargetElement = null;
            
            wrapper.addEventListener('mousedown', (e) => {
                if (window.innerWidth < 768) return;
                
                if (e.target.closest('button:not(.reforma-preview-card), input, select')) {
                    return;
                }
                
                isDown = true;
                hasMoved = false;
                mouseStartTime = Date.now();
                mouseTargetElement = e.target;
                wrapper.classList.add('dragging');
                startX = e.pageX - wrapper.offsetLeft;
                scrollLeft = wrapper.scrollLeft;
                lastX = e.pageX;
                lastTime = Date.now();
                velocity = 0;
                wrapper.style.userSelect = 'none';
            });
            const resetDrag = () => {
                if (!isDown) return;
                isDown = false;
                hasMoved = false;
                mouseTargetElement = null;
                wrapper.classList.remove('dragging');
                wrapper.style.cursor = 'default';
                wrapper.style.userSelect = '';
            };
            document.addEventListener('mouseup', (e) => {
                if (!isDown) return;

                const clickDuration = Date.now() - mouseStartTime;
                const isClick = !hasMoved && clickDuration < 300;

                isDown = false;
                wrapper.classList.remove('dragging');
                wrapper.style.cursor = 'default';
                wrapper.style.userSelect = '';

                if (isClick && mouseTargetElement && mouseTargetElement.closest('.reforma-preview-card')) {
                } else if (hasMoved) {
                    e.preventDefault();
                    applyMomentum();
                }

                hasMoved = false;
                mouseTargetElement = null;
            });
            window.addEventListener('blur', resetDrag);
            document.addEventListener('visibilitychange', () => { if (document.hidden) resetDrag(); });

            document.addEventListener('mousemove', (e) => {
                if (!isDown) return;

                const x = e.pageX - wrapper.offsetLeft;
                const walk = (x - startX) * 1.5;

                if (Math.abs(walk) > 5) {
                    if (!hasMoved) wrapper.style.cursor = 'grabbing';
                    hasMoved = true;
                    wrapper.scrollLeft = scrollLeft - walk;
                }

                const now = Date.now();
                const dt = now - lastTime;
                if (dt > 0) velocity = (e.pageX - lastX) / dt;
                lastX = e.pageX;
                lastTime = now;
            });
            function applyMomentum() {
                if (Math.abs(velocity) < 0.1) return;
                
                const friction = 0.95;
                let currentVelocity = velocity * 15; // Multiplicador de inercia
                
                function step() {
                    if (Math.abs(currentVelocity) < 0.5) return;
                    
                    wrapper.scrollLeft -= currentVelocity;
                    currentVelocity *= friction;
                    
                    requestAnimationFrame(step);
                }
                
                requestAnimationFrame(step);
            }
            wrapper.style.cursor = 'default';
            // En móvil el scroll nativo del navegador es mucho más fluido.
            // Solo añadimos listeners de touch en desktop (ratón).
            if (window.innerWidth >= 768) {
                // nada extra — el drag de ratón ya está arriba
            }
        }
    }
    window._initCarruselDragScroll = _initCarruselDragScroll;
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.carrusel-scroll-wrapper').forEach(w => _initCarruselDragScroll(w));
    });
    document.addEventListener('DOMContentLoaded', function() {
        function initSectionIconLongPress() {
            document.querySelectorAll('[data-longpress-icon-selector]').forEach(elemento => {
                const color = elemento.getAttribute('data-longpress-icon-selector');
                attachIconLongPress(elemento, function(el) {
                    abrirSelectorIconoSeccion(el, color);
                });
            });
        }
        function initSectionIconDivLongPress() {
            document.querySelectorAll('[data-icon-selector][data-icon-color]').forEach(div => {
                const color = div.getAttribute('data-icon-color');
                const iconSpan = div.querySelector('.material-symbols-rounded, .material-symbols-rounded');
                if (iconSpan && !div.dataset.longpressInit) {
                    attachIconLongPress(div, function(el) {
                        const span = el.querySelector('.material-symbols-rounded, .material-symbols-rounded');
                        if (span) {
                            abrirSelectorIconoSeccion(span, color);
                        }
                    });
                    div.dataset.longpressInit = 'true';
                }
            });
        }
        function initIconContainerLongPress() {
            document.querySelectorAll('.icon-container').forEach(iconContainer => {
                if (!iconContainer.dataset.longpressInit) {
                    const esBanco = iconContainer.classList.contains('icon-container-banco');
                    const esPrincipal = iconContainer.classList.contains('icon-container-principal');
                    
                    if (esPrincipal) {
                        attachIconLongPress(iconContainer, function(el) {
                            abrirSelectorIconoPrincipal(el);
                        });
                    } else if (esBanco) {
                        attachIconLongPress(iconContainer, function(el) {
                            abrirSelectorIconosBanco(el);
                        });
                    } else {
                        attachIconLongPress(iconContainer, function(el) {
                            abrirSelectorIconos(el);
                        });
                    }
                    
                    iconContainer.dataset.longpressInit = 'true';
                }
            });
        }
        initSectionIconLongPress();
        initSectionIconDivLongPress();
        initIconContainerLongPress();
        setTimeout(() => {
            const iconoPrincipal = document.getElementById('iconoPrincipalContainer');
            if (iconoPrincipal && !iconoPrincipal.dataset.longpressInit) {
                attachIconLongPress(iconoPrincipal, function(el) {
                    abrirSelectorIconoPrincipal(el);
                });
                iconoPrincipal.dataset.longpressInit = 'true';
            }
        }, 100);
        setTimeout(() => {
            initIconContainerLongPress();
        }, 500);
        
        setTimeout(() => {
            initIconContainerLongPress();
        }, 1000);
        
        setTimeout(() => {
            initIconContainerLongPress();
        }, 2000);
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            if (node.classList && node.classList.contains('icon-container')) {
                                if (!node.dataset.longpressInit) {
                                    const esBanco = node.classList.contains('icon-container-banco');
                                    const esPrincipal = node.classList.contains('icon-container-principal');
                                    
                                    if (esPrincipal) {
                                        attachIconLongPress(node, function(el) {
                                            abrirSelectorIconoPrincipal(el);
                                        });
                                    } else if (esBanco) {
                                        attachIconLongPress(node, function(el) {
                                            abrirSelectorIconosBanco(el);
                                        });
                                    } else {
                                        attachIconLongPress(node, function(el) {
                                            abrirSelectorIconos(el);
                                        });
                                    }
                                    
                                    node.dataset.longpressInit = 'true';
                                }
                            } else {
                                const containers = node.querySelectorAll('.icon-container');
                                containers.forEach(iconContainer => {
                                    if (!iconContainer.dataset.longpressInit) {
                                        const esBanco = iconContainer.classList.contains('icon-container-banco');
                                        const esPrincipal = iconContainer.classList.contains('icon-container-principal');
                                        
                                        if (esPrincipal) {
                                            attachIconLongPress(iconContainer, function(el) {
                                                abrirSelectorIconoPrincipal(el);
                                            });
                                        } else if (esBanco) {
                                            attachIconLongPress(iconContainer, function(el) {
                                                abrirSelectorIconosBanco(el);
                                            });
                                        } else {
                                            attachIconLongPress(iconContainer, function(el) {
                                                abrirSelectorIconos(el);
                                            });
                                        }
                                        
                                        iconContainer.dataset.longpressInit = 'true';
                                    }
                                });
                            }
                        }
                    });
                }
            });
        });
        const targetNodes = [
            document.getElementById('listaCuentas'),
            document.getElementById('listaInversiones'),
            document.getElementById('listaIngresos'),
            document.getElementById('listaGastos'),
            document.getElementById('listaSimulaciones'),
            document.getElementById('listaReformas'),
            document.getElementById('listaMobiliario')
        ].filter(Boolean);
        
        targetNodes.forEach(node => {
            observer.observe(node, { childList: true, subtree: true });
        });
    });
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.querySelectorAll('.icon-container').forEach(iconContainer => {
                if (!iconContainer.dataset.longpressInit) {
                    const esBanco = iconContainer.classList.contains('icon-container-banco');
                    const esPrincipal = iconContainer.classList.contains('icon-container-principal');
                    
                    if (esPrincipal) {
                        attachIconLongPress(iconContainer, function(el) {
                            abrirSelectorIconoPrincipal(el);
                        });
                    } else if (esBanco) {
                        attachIconLongPress(iconContainer, function(el) {
                            abrirSelectorIconosBanco(el);
                        });
                    } else {
                        attachIconLongPress(iconContainer, function(el) {
                            abrirSelectorIconos(el);
                        });
                    }
                    
                    iconContainer.dataset.longpressInit = 'true';
                }
            });
        }, 500);
    });
    const _VL = window._VL = {
        BASE_DATE: new Date('2026-03-01T00:00:00'),   // fecha del informe
        BASE_DIAS: 1070,                      // días en alta en esa fecha
        BASE_COMP: 1061,                      // días computables en esa fecha
        ALTA_INICIO: new Date('2024-09-01T00:00:00'), // fecha alta empresa actual (para el contador)
        state: {
            activas: { 0: true },   // índice => bool  (0 = Panelais, activa por defecto)
            miniaturas: {}           // índice => base64
        },

        situaciones: [
            { empresa: 'Panelais Producciones, S.A.',       regimen: 'General', alta: '01/09/2024', baja: 'En curso',    altaDate: '2024-09-01', ct: '100', jornada: '100%',  gc: '02', dias: 547 },
            { empresa: 'Vacac. no disfrut. + Cotiz. RRLL',  regimen: 'General', alta: '01/09/2024', baja: '09/09/2024', altaDate: null,          ct: '---', jornada: '---',    gc: '--', dias: 9   },
            { empresa: 'Randstad Empleo, S.A., E.T.T.',     regimen: 'General', alta: '14/05/2024', baja: '31/08/2024', altaDate: null,          ct: '402', jornada: '100%',  gc: '02', dias: 110 },
            { empresa: 'Randstad Empleo, S.A., E.T.T.',     regimen: 'General', alta: '13/05/2024', baja: '13/05/2024', altaDate: null,          ct: '502', jornada: '12,5%', gc: '02', dias: 0   },
            { empresa: 'Diseño y Obra Salamanca SL',        regimen: 'General', alta: '18/04/2024', baja: '06/05/2024', altaDate: null,          ct: '100', jornada: '100%',  gc: '07', dias: 19  },
            { empresa: 'Prestación Desempleo. Extinción',   regimen: 'General', alta: '26/01/2024', baja: '17/04/2024', altaDate: null,          ct: '---', jornada: '---',    gc: '05', dias: 83  },
            { empresa: 'Brualla Luelmo Juan Ramon',         regimen: 'General', alta: '12/06/2023', baja: '25/01/2024', altaDate: null,          ct: '200', jornada: '75%',   gc: '05', dias: 165 },
            { empresa: 'Brualla Luelmo Juan Ramon',         regimen: 'General', alta: '12/12/2022', baja: '11/06/2023', altaDate: null,          ct: '502', jornada: '75%',   gc: '05', dias: 137 },
        ],

        COLORS: ['#eab308','#f97316','#3b82f6','#8b5cf6','#10b981','#06b6d4','#ec4899','#94a3b8'],
        getDiasAlta() {
            const hoy = new Date();
            const hoyLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
            const baseLocal = new Date(this.BASE_DATE.getFullYear(), this.BASE_DATE.getMonth(), this.BASE_DATE.getDate());
            const diff = Math.floor((hoyLocal - baseLocal) / 86400000);
            return this.BASE_DIAS + diff;
        },
        getDiasComp() {
            const hoy = new Date();
            const hoyLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
            const baseLocal = new Date(this.BASE_DATE.getFullYear(), this.BASE_DATE.getMonth(), this.BASE_DATE.getDate());
            const diff = Math.floor((hoyLocal - baseLocal) / 86400000);
            return this.BASE_COMP + diff;
        },
        formatDias(d) {
            d = d + 1;
            const base = new Date(2020, 0, 1);
            const end = new Date(base);
            end.setDate(end.getDate() + d);
            let y = end.getFullYear() - base.getFullYear();
            let m = end.getMonth() - base.getMonth();
            let days = end.getDate() - base.getDate();
            if (days < 0) { m--; const prev = new Date(end.getFullYear(), end.getMonth(), 0); days += prev.getDate(); }
            if (m < 0) { y--; m += 12; }
            const parts = [];
            if (y) parts.push(y + ' año' + (y > 1 ? 's' : ''));
            if (m) parts.push(m + ' mes' + (m > 1 ? 'es' : ''));
            if (days) parts.push(days + ' día' + (days > 1 ? 's' : ''));
            return parts.join(' · ') || '0 días';
        },
        async load() {
            try {
                const r = await window.storage.get('vidaLaboral_state');
                if (r) {
                    const saved = JSON.parse(r.value);
                    this.state = { activas: saved.activas || { 0: true }, miniaturas: saved.miniaturas || {} };
                }
            } catch(e) { /* primera vez */ }
        },
        async save() {
            try {
                await window.storage.set('vidaLaboral_state', JSON.stringify(this.state));
            } catch(e) {}
        }
    };
    _VL.load().then(() => renderVidaLaboral());

    function renderVidaLaboral() {
        const diasAlta = _VL.getDiasAlta();
        const diasComp = _VL.getDiasComp();
        const activas = _VL.state.activas;
        const miniaturas = _VL.state.miniaturas;
        const sits = _VL.situaciones;
        const activasHTML = sits.map((s, i) => {
            if (!activas[i]) return '';
            const mini = miniaturas[i];
            const color = _VL.COLORS[i % _VL.COLORS.length];
            let diasEnEmpresa = '';
            if (s.altaDate) {
                const altaMs = new Date(s.altaDate + 'T00:00:00');
                const hoy = new Date();
                const hoyLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
                const altaLocal = new Date(altaMs.getFullYear(), altaMs.getMonth(), altaMs.getDate());
                const d = Math.floor((hoyLocal - altaLocal) / 86400000) + 1; // +1 inclusivo como la SS
                diasEnEmpresa = d.toLocaleString('es-ES') + ' días';
            }
            const icono = (_VL.state.iconos || {})[i];
            return `
            <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;background:rgba(234,179,8,0.05);border:1px solid rgba(234,179,8,0.15);margin-bottom:8px;">
                <div id="vlMiniActiva_${i}" style="width:40px;height:40px;border-radius:10px;overflow:hidden;flex-shrink:0;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;cursor:pointer;" title="Mantén pulsado para cambiar logo">
                    ${mini
                        ? `<img src="${mini}" style="width:100%;height:100%;object-fit:cover;border-radius:9px;">`
                        : icono
                            ? `<span class="${icono.font || 'material-symbols-rounded'}" style="font-size:20px;color:${icono.color || '#eab308'};">${icono.icono}</span>`
                            : `<span class="material-symbols-rounded" style="font-size:18px;color:#64748b;">add_photo_alternate</span>`
                    }
                </div>
                <div style="flex:1;min-width:0;">
                    <div style="color:#f1f5f9;font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.empresa}</div>
                    <div style="color:#64748b;font-size:11px;">Desde ${s.alta} · <span style="color:${color};">En curso</span></div>
                </div>
                ${diasEnEmpresa ? `<div style="text-align:right;flex-shrink:0;"><div style="font-family:Manrope,sans-serif;font-weight:800;font-size:14px;color:${color};">${diasEnEmpresa}</div><div style="font-size:9px;color:#475569;text-transform:uppercase;letter-spacing:0.05em;">en empresa</div></div>` : ''}
                <span class="material-symbols-rounded" style="font-size:20px;color:#eab308;flex-shrink:0;">check_circle</span>
            </div>`;
        }).filter(Boolean).join('');

        const vlHeaderMini = miniaturas['header'];
        const vlHeaderIcono = (_VL.state.iconos || {})['header'];

        const html = `
        <div class="space-y-4 bg-slate-900/50 p-8 rounded-3xl border-2 border-slate-800">
            <div class="section-header-box" style="background:rgba(234,179,8,0.07);border:2px solid rgba(234,179,8,0.25);">
                <div class="flex flex-row items-center gap-3">
                    <div id="vlHeaderIconContainer" class="flex items-center justify-center shrink-0 rounded-xl overflow-hidden" style="width:48px;height:48px;background:rgba(15,23,42,0.5);border:1px solid rgba(255,255,255,0.08);cursor:pointer;" title="Mantén pulsado para cambiar imagen">
                        ${vlHeaderMini
                            ? `<img src="${vlHeaderMini}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`
                            : vlHeaderIcono
                                ? `<span class="${vlHeaderIcono.font || 'material-symbols-rounded'}" style="font-size:24px;color:${vlHeaderIcono.color || '#eab308'};">${vlHeaderIcono.icono}</span>`
                                : `<span class="material-symbols-rounded" style="font-size:24px;color:#eab308;">work</span>`
                        }
                    </div>
                    <div class="flex flex-col justify-center">
                        <h2 class="text-xl sm:text-2xl font-black text-white whitespace-nowrap">Vida Laboral</h2>
                        <p class="text-xs sm:text-sm text-slate-500 mt-1">Resumen de mi Seguridad Social.</p>
                    </div>
                </div>
            </div>

            <!-- Botones badge + estadísticas -->
            <div class="flex items-center gap-2">
                <button class="btn-add rounded-xl flex items-center justify-center shrink-0" style="height:36px;width:36px;" title="Empresas en las que he estado" onclick="abrirEmpresasVidaLaboral()">
                    <span class="material-symbols-rounded" style="font-size:18px;">badge</span>
                </button>
                <button class="btn-add rounded-xl flex items-center justify-center shrink-0" style="height:36px;width:36px;" title="Estadísticas de vida laboral" onclick="abrirEstadisticasVidaLaboral()">
                    <span class="material-symbols-rounded" style="font-size:18px;">equalizer</span>
                </button>
                <div class="total-box-animated yellow-variant ml-auto" style="display:none;">
                    <span class="text-lg font-mono font-bold shrink-0" style="color:#eab308;">1.041,34 €</span>
                </div>
            </div>

            <!-- Empresa(s) activa(s) -->
            ${activasHTML ? `<div id="vlActivasContainer">${activasHTML}</div>` : ''}

            <!-- Totales dinámicos -->
            <div class="grid grid-cols-2 gap-3">
                <div class="rounded-2xl p-4" style="background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.2);">
                    <span style="font-size:9px;color:#eab308;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:4px;">Días en Alta</span>
                    <div class="font-mono font-black text-2xl text-yellow-300" id="vlDiasAlta">${diasAlta.toLocaleString('es-ES')}</div>
                    <div class="text-xs text-slate-500 mt-1" id="vlDiasAltaFmt">${_VL.formatDias(diasAlta)}</div>
                </div>
                <div class="rounded-2xl p-4" style="background:rgba(234,179,8,0.05);border:1px solid rgba(234,179,8,0.15);">
                    <span style="font-size:9px;color:#ca8a04;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:4px;">Días Computables</span>
                    <div class="font-mono font-black text-2xl text-white" id="vlDiasComp">${diasComp.toLocaleString('es-ES')}</div>
                    <div class="text-xs text-slate-500 mt-1" id="vlDiasCompFmt">${_VL.formatDias(diasComp)}</div>
                </div>
            </div>
        </div>`;

        const desktop = document.getElementById('vidaLaboralDesktop');
        const mobile = document.getElementById('vidaLaboralMobile');
        if (desktop) desktop.innerHTML = html;
        if (mobile) mobile.innerHTML = html;
        document.querySelectorAll('#vlHeaderIconContainer').forEach(el => {
            attachIconLongPress(el, () => vlSubirMiniaturaHeader());
        });
        sits.forEach((s, i) => {
            if (!_VL.state.activas[i]) return;
            document.querySelectorAll(`#vlMiniActiva_${i}`).forEach(el => {
                attachIconLongPress(el, () => vlSubirMiniatura(i));
            });
        });
        clearInterval(window._vlTimer);
        window._vlTimer = setInterval(() => {
            const d = _VL.getDiasAlta(), c = _VL.getDiasComp();
            document.querySelectorAll('#vlDiasAlta').forEach(el => el.textContent = d.toLocaleString('es-ES'));
            document.querySelectorAll('#vlDiasAltaFmt').forEach(el => el.textContent = _VL.formatDias(d));
            document.querySelectorAll('#vlDiasComp').forEach(el => el.textContent = c.toLocaleString('es-ES'));
            document.querySelectorAll('#vlDiasCompFmt').forEach(el => el.textContent = _VL.formatDias(c));
        }, 60000);
    }

    function vlSubirMiniaturaHeader() {
        if (window.abrirSelectorVL) window.abrirSelectorVL('header');
    }

    function vlSubirMiniatura(idx) {
        if (window.abrirSelectorVL) window.abrirSelectorVL(idx);
    }

    function abrirEstadisticasVidaLaboral() {
        const existing = document.getElementById('modalEstadisticasVidaLaboral');
        if (existing) { existing.remove(); return; }

        const COLORS = _VL.COLORS;
        const sits = _VL.situaciones;
        const miniaturas = _VL.state.miniaturas;
        const datos = sits
            .map((s, i) => {
                let dias = s.dias;
                if (s.baja === 'En curso' && s.altaDate) {
                    const altaLocal = new Date(s.altaDate + 'T00:00:00');
                    const hoy = new Date();
                    const hoyLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
                    dias = Math.floor((hoyLocal - altaLocal) / 86400000) + 1;
                }
                return { ...s, dias, color: COLORS[i % COLORS.length], mini: miniaturas[i], idx: i };
            })
            .filter(s => s.dias > 0);

        const totalDias = datos.reduce((acc, s) => acc + s.dias, 0);
        const r = 70, cx = 90, cy = 90, circum = 2 * Math.PI * r;
        let donutSegments = '';
        let offset = 0;
        datos.forEach(d => {
            const pct = totalDias > 0 ? d.dias / totalDias : 0;
            const dash = pct * circum;
            const gap = circum - dash;
            donutSegments += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${d.color}" stroke-width="22"
                stroke-dasharray="${dash} ${gap}"
                stroke-dashoffset="${-(offset) * circum}"
                transform="rotate(-90 ${cx} ${cy})"
                style="transition:stroke-dasharray 0.6s ease"/>`;
            offset += pct;
        });
        const legendHTML = datos.map(d => {
            const pct = totalDias > 0 ? (d.dias / totalDias * 100).toFixed(1) : '0.0';
            return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                <div style="width:10px;height:10px;border-radius:50%;background:${d.color};flex-shrink:0;"></div>
                <span style="color:#94a3b8;font-size:12px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${d.empresa}</span>
                <span style="color:#cbd5e1;font-size:12px;font-weight:700;">${pct}%</span>
            </div>`;
        }).join('');
        const maxDias = Math.max(...datos.map(d => d.dias));
        const barrasHTML = datos.map(d => {
            const pct = totalDias > 0 ? (d.dias / totalDias * 100).toFixed(1) : '0.0';
            const barW = maxDias > 0 ? (d.dias / maxDias * 100) : 0;
            return `
            <div style="margin-bottom:14px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                    <div style="display:flex;align-items:center;gap:7px;max-width:60%;min-width:0;">
                        ${d.mini ? `<img src="${d.mini}" style="width:18px;height:18px;border-radius:4px;object-fit:cover;flex-shrink:0;">` : `<div style="width:8px;height:8px;border-radius:50%;background:${d.color};flex-shrink:0;"></div>`}
                        <span style="color:#cbd5e1;font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${d.empresa}</span>
                    </div>
                    <span style="color:${d.color};font-size:13px;font-weight:700;">${d.dias.toLocaleString('es-ES')} <span style="color:#64748b;font-size:11px;">días (${pct}%)</span></span>
                </div>
                <div style="background:#1e293b;border-radius:8px;height:10px;overflow:hidden;">
                    <div style="height:100%;width:${barW}%;background:${d.color};border-radius:8px;transition:width 0.6s ease;"></div>
                </div>
            </div>`;
        }).join('');

        const overlay = document.createElement('div');
        overlay.id = 'modalEstadisticasVidaLaboral';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:99990;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:16px;';

        overlay.innerHTML = `
        <div style="background:#0f172a;border:1px solid rgba(234,179,8,0.2);border-radius:20px;width:100%;max-width:640px;max-height:90%;overflow-y:auto;padding:24px;box-shadow:0 0 60px rgba(234,179,8,0.15);">
            <!-- Header -->
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span class="material-symbols-rounded" style="color:#eab308;font-size:22px;">equalizer</span>
                    <span style="color:#f1f5f9;font-size:17px;font-weight:700;">Estadísticas de Vida Laboral</span>
                </div>
                <button onclick="document.getElementById('modalEstadisticasVidaLaboral').remove()" style="background:rgba(255,255,255,0.06);border:none;border-radius:10px;width:32px;height:32px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#94a3b8;">
                    <span class="material-symbols-rounded" style="font-size:18px;">close</span>
                </button>
            </div>
            <!-- Total -->
            <div style="background:rgba(234,179,8,0.07);border:1px solid rgba(234,179,8,0.15);border-radius:12px;padding:14px 18px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;">
                <span style="color:#94a3b8;font-size:13px;font-weight:600;">Total días cotizados</span>
                <span style="color:#eab308;font-size:20px;font-weight:800;font-family:Manrope,sans-serif;">${totalDias.toLocaleString('es-ES')} <span style="font-size:13px;color:#64748b;">días</span></span>
            </div>
            <!-- Donut + Leyenda -->
            <div style="display:flex;gap:24px;margin-bottom:24px;align-items:center;flex-wrap:wrap;">
                <div style="flex-shrink:0;">
                    <svg width="180" height="180" viewBox="0 0 180 180">
                        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1e293b" stroke-width="22"/>
                        ${donutSegments}
                        <text x="${cx}" y="${cy - 6}" text-anchor="middle" fill="#f1f5f9" font-size="18" font-weight="800" font-family="Manrope, sans-serif">${totalDias.toLocaleString('es-ES')}</text>
                        <text x="${cx}" y="${cy + 14}" text-anchor="middle" fill="#64748b" font-size="11" font-family="Plus Jakarta Sans, sans-serif">días totales</text>
                    </svg>
                </div>
                <div style="flex:1;min-width:160px;">${legendHTML}</div>
            </div>
            <!-- Barras -->
            <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;">
                <div style="color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:14px;">Distribución por empresa</div>
                ${barrasHTML}
            </div>
        </div>`;

        document.body.appendChild(overlay);
        overlay.addEventListener('click', e => { /* backdrop click disabled */ });
    }

    function abrirEmpresasVidaLaboral() {
        const existing = document.getElementById('modalEmpresasVidaLaboral');
        if (existing) { existing.remove(); return; }

        const COLORS = _VL.COLORS;
        const sits = _VL.situaciones;
        const activas = _VL.state.activas;
        const miniaturas = _VL.state.miniaturas;

        const overlay = document.createElement('div');
        overlay.id = 'modalEmpresasVidaLaboral';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:99990;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:16px;';

        const rowsHTML = sits.map((s, i) => {
            const isActiva = !!activas[i];
            const mini = miniaturas[i];
            const color = COLORS[i % COLORS.length];
            let diasMostrar = s.dias;
            if (s.baja === 'En curso' && s.altaDate) {
                const altaLocal = new Date(s.altaDate + 'T00:00:00');
                const hoy = new Date();
                const hoyLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
                diasMostrar = Math.floor((hoyLocal - altaLocal) / 86400000) + 1;
            }
            return `
            <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.04);">
                <!-- Miniatura (solo activas) -->
                <div id="vlMiniModal_${i}" style="width:36px;height:36px;border-radius:9px;overflow:hidden;flex-shrink:0;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:center;cursor:pointer;" title="Mantén pulsado para cambiar logo">
                    ${mini ? `<img src="${mini}" style="width:100%;height:100%;object-fit:cover;">` : `<span class="material-symbols-rounded" style="font-size:15px;color:#64748b;">${isActiva ? 'add_photo_alternate' : 'work'}</span>`}
                </div>
                <!-- Barra color -->
                <div style="width:3px;height:36px;border-radius:3px;flex-shrink:0;background:${color};opacity:${isActiva ? '1' : '0.4'};"></div>
                <!-- Datos -->
                <div style="flex:1;min-width:0;">
                    <div style="color:${isActiva ? '#f1f5f9' : '#94a3b8'};font-size:13px;font-weight:${isActiva ? '700' : '500'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.empresa}</div>
                    <div style="color:#64748b;font-size:11px;margin-top:2px;">${s.alta} → ${s.baja}</div>
                    <div style="display:flex;gap:8px;margin-top:2px;flex-wrap:wrap;">
                        ${s.ct !== '---' ? `<span style="color:#64748b;font-size:10px;">CT <span style="color:#94a3b8;font-family:Manrope,sans-serif;">${s.ct}</span></span>` : ''}
                        ${s.jornada !== '---' ? `<span style="color:#64748b;font-size:10px;">Jornada <span style="color:#94a3b8;">${s.jornada}</span></span>` : ''}
                        ${s.gc !== '--' ? `<span style="color:#64748b;font-size:10px;">GC <span style="color:#94a3b8;">${s.gc}</span></span>` : ''}
                    </div>
                </div>
                <!-- Días -->
                <div style="flex-shrink:0;text-align:right;margin-right:8px;">
                    <div style="font-family:Manrope,sans-serif;font-weight:700;font-size:13px;color:${color};">${diasMostrar}</div>
                    <div style="font-size:10px;color:#475569;">días</div>
                </div>
                <!-- Check circular -->
                <button onclick="vlToggleActiva(${i})" style="background:none;border:none;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;padding:4px;" title="${isActiva ? 'Desmarcar como activa' : 'Marcar como activa'}">
                    <span class="material-symbols-rounded" style="font-size:22px;color:${isActiva ? '#eab308' : '#334155'};transition:color 0.2s;">${isActiva ? 'check_circle' : 'radio_button_unchecked'}</span>
                </button>
            </div>`;
        }).join('');

        overlay.innerHTML = `
        <div style="background:#0f172a;border:1px solid rgba(234,179,8,0.2);border-radius:20px;width:100%;max-width:600px;max-height:88%;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 0 60px rgba(234,179,8,0.1);">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 20px;background:rgba(234,179,8,0.07);border-bottom:1px solid rgba(234,179,8,0.15);flex-shrink:0;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span class="material-symbols-rounded" style="color:#eab308;font-size:20px;">badge</span>
                    <span style="color:#f1f5f9;font-size:16px;font-weight:700;">Empresas en las que he estado</span>
                </div>
                <button onclick="document.getElementById('modalEmpresasVidaLaboral').remove()" style="background:rgba(255,255,255,0.06);border:none;border-radius:10px;width:32px;height:32px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#94a3b8;">
                    <span class="material-symbols-rounded" style="font-size:18px;">close</span>
                </button>
            </div>
            <div style="overflow-y:auto;flex:1;">
                ${rowsHTML}
            </div>
        </div>`;

        document.body.appendChild(overlay);
        sits.forEach((s, i) => {
            const el = document.getElementById(`vlMiniModal_${i}`);
            if (el) attachIconLongPress(el, () => vlSubirMiniatura(i));
        });
    }

    function vlToggleActiva(idx) {
        _VL.state.activas[idx] = !_VL.state.activas[idx];
        _VL.save();
        renderVidaLaboral();
        const modal = document.getElementById('modalEmpresasVidaLaboral');
        if (modal) { modal.remove(); abrirEmpresasVidaLaboral(); }
    }

    function abrirEstadisticasInversiones() {
        const cards = document.querySelectorAll('#listaInversiones .card-input-group');
        const datos = [];
        cards.forEach(card => {
            const nombreInput = card.querySelector('input[type="text"]:not(.cuenta-saldo-input)');
            const valorInput = card.querySelector('.cuenta-saldo-input');
            if (nombreInput && valorInput) {
                const nombre = nombreInput.value.trim() || 'Sin nombre';
                const valor = parseMoneyInput(valorInput.value) || 0;
                if (valor > 0) datos.push({ nombre, valor });
            }
        });
        const overlay = document.createElement('div');
        overlay.id = 'modalEstadisticasInversiones';
        overlay.style.cssText = `
            position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:99990;background:rgba(0,0,0,0.85);
            display:flex;align-items:center;justify-content:center;padding:16px;
        `;

        const COLORS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899','#84cc16','#f97316','#6366f1'];
        const total = datos.reduce((s, d) => s + d.valor, 0);

        const fmtEuro = v => v.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' €';
        const fmtPct = v => (v * 100).toFixed(1) + '%';
        let donutSegments = '';
        let offset = 0;
        const r = 70, cx = 90, cy = 90, circum = 2 * Math.PI * r;
        if (datos.length === 0) {
            donutSegments = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1e293b" stroke-width="22"/>`;
        } else {
            datos.forEach((d, i) => {
                const pct = total > 0 ? d.valor / total : 0;
                const dash = pct * circum;
                const gap = circum - dash;
                const color = COLORS[i % COLORS.length];
                donutSegments += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="22"
                    stroke-dasharray="${dash} ${gap}"
                    stroke-dashoffset="${-offset * circum}"
                    transform="rotate(-90 ${cx} ${cy})"
                    style="transition:stroke-dasharray 0.6s ease"/>`;
                offset += pct;
            });
        }
        const maxVal = datos.length ? Math.max(...datos.map(d => d.valor)) : 1;
        const barras = datos.map((d, i) => {
            const pct = total > 0 ? (d.valor / total * 100).toFixed(1) : '0.0';
            const barW = maxVal > 0 ? (d.valor / maxVal * 100) : 0;
            const color = COLORS[i % COLORS.length];
            return `
            <div style="margin-bottom:14px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                    <span style="color:#cbd5e1;font-size:13px;font-weight:600;max-width:55%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${d.nombre}</span>
                    <span style="color:${color};font-size:13px;font-weight:700;">${fmtEuro(d.valor)} <span style="color:#64748b;font-size:11px;">(${pct}%)</span></span>
                </div>
                <div style="background:#1e293b;border-radius:8px;height:10px;overflow:hidden;">
                    <div style="height:100%;width:${barW}%;background:${color};border-radius:8px;transition:width 0.6s ease;"></div>
                </div>
            </div>`;
        }).join('');

        const legendItems = datos.map((d, i) => {
            const pct = total > 0 ? (d.valor / total * 100).toFixed(1) : '0.0';
            const color = COLORS[i % COLORS.length];
            return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                <div style="width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0;"></div>
                <span style="color:#94a3b8;font-size:12px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${d.nombre}</span>
                <span style="color:#cbd5e1;font-size:12px;font-weight:700;">${pct}%</span>
            </div>`;
        }).join('');

        const emptyMsg = datos.length === 0 ? `<div style="color:#64748b;text-align:center;padding:24px 0;font-size:14px;">No hay inversiones activas con valor</div>` : '';

        overlay.innerHTML = `
        <div style="background:#0f172a;border:1px solid rgba(59,130,246,0.2);border-radius:20px;
            width:100%;max-width:640px;max-height:90%;overflow-y:auto;padding:24px;
            box-shadow:0 0 60px rgba(59,130,246,0.15);">
            <!-- Header -->
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span class="material-symbols-rounded" style="color:#3b82f6;font-size:22px;">equalizer</span>
                    <span style="color:#f1f5f9;font-size:17px;font-weight:700;">Estadísticas de Inversiones</span>
                </div>
                <button onclick="document.getElementById('modalEstadisticasInversiones').remove()"
                    style="background:rgba(255,255,255,0.06);border:none;border-radius:10px;width:32px;height:32px;
                    cursor:pointer;display:flex;align-items:center;justify-content:center;color:#94a3b8;">
                    <span class="material-symbols-rounded" style="font-size:18px;">close</span>
                </button>
            </div>
            <!-- Total -->
            <div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.15);border-radius:12px;
                padding:14px 18px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;">
                <span style="color:#64748b;font-size:13px;font-weight:600;">TOTAL ACTIVOS</span>
                <span style="color:#3b82f6;font-size:20px;font-weight:800;font-family:Manrope,sans-serif;">${fmtEuro(total)}</span>
            </div>
            ${emptyMsg}
            ${datos.length > 0 ? `
            <!-- Donut + Leyenda -->
            <div style="display:flex;gap:20px;margin-bottom:24px;align-items:center;flex-wrap:wrap;">
                <div style="flex-shrink:0;position:relative;width:180px;height:180px;">
                    <svg width="180" height="180" viewBox="0 0 180 180">${donutSegments}</svg>
                    <div style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                        <span style="color:#64748b;font-size:11px;font-weight:600;">ACTIVOS</span>
                        <span style="color:#f1f5f9;font-size:20px;font-weight:800;">${datos.length}</span>
                    </div>
                </div>
                <div style="flex:1;min-width:160px;">${legendItems}</div>
            </div>
            <!-- Barras -->
            <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:18px;">
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:16px;">
                    <span class="material-symbols-rounded" style="color:#8b5cf6;font-size:16px;">bar_chart</span>
                    <span style="color:#94a3b8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Distribución por activo</span>
                </div>
                ${barras}
            </div>` : ''}
        </div>`;

        document.body.appendChild(overlay);
        overlay.addEventListener('click', function(e) {
        });
    }

    function abrirEstadisticasCuentas() {
        const cards = document.querySelectorAll('#listaCuentas .card-input-group');
        const datos = [];
        cards.forEach(card => {
            const nombreInput = card.querySelector('input[type="text"]:not(.cuenta-saldo-input)');
            const valorInput = card.querySelector('.cuenta-saldo-input');
            if (nombreInput && valorInput) {
                const nombre = nombreInput.value.trim() || 'Sin nombre';
                const valor = parseMoneyInput(valorInput.value) || 0;
                if (valor > 0) datos.push({ nombre, valor });
            }
        });

        const overlay = document.createElement('div');
        overlay.id = 'modalEstadisticasCuentas';
        overlay.style.cssText = `
            position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:99990;background:rgba(0,0,0,0.85);
            display:flex;align-items:center;justify-content:center;padding:16px;
        `;

        const COLORS = ['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#06b6d4','#ec4899','#84cc16','#f97316','#6366f1'];
        const total = datos.reduce((s, d) => s + d.valor, 0);
        const fmtEuro = v => v.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' €';

        let donutSegments = '';
        let offset = 0;
        const r = 70, cx = 90, cy = 90, circum = 2 * Math.PI * r;
        if (datos.length === 0) {
            donutSegments = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1e293b" stroke-width="22"/>`;
        } else {
            datos.forEach((d, i) => {
                const pct = total > 0 ? d.valor / total : 0;
                const dash = pct * circum;
                const gap = circum - dash;
                const color = COLORS[i % COLORS.length];
                donutSegments += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="22"
                    stroke-dasharray="${dash} ${gap}"
                    stroke-dashoffset="${-offset * circum}"
                    transform="rotate(-90 ${cx} ${cy})"
                    style="transition:stroke-dasharray 0.6s ease"/>`;
                offset += pct;
            });
        }

        const maxVal = datos.length ? Math.max(...datos.map(d => d.valor)) : 1;
        const barras = datos.map((d, i) => {
            const pct = total > 0 ? (d.valor / total * 100).toFixed(1) : '0.0';
            const barW = maxVal > 0 ? (d.valor / maxVal * 100) : 0;
            const color = COLORS[i % COLORS.length];
            return `
            <div style="margin-bottom:14px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                    <span style="color:#cbd5e1;font-size:13px;font-weight:600;max-width:55%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${d.nombre}</span>
                    <span style="color:${color};font-size:13px;font-weight:700;">${fmtEuro(d.valor)} <span style="color:#64748b;font-size:11px;">(${pct}%)</span></span>
                </div>
                <div style="background:#1e293b;border-radius:8px;height:10px;overflow:hidden;">
                    <div style="height:100%;width:${barW}%;background:${color};border-radius:8px;transition:width 0.6s ease;"></div>
                </div>
            </div>`;
        }).join('');

        const legendItems = datos.map((d, i) => {
            const pct = total > 0 ? (d.valor / total * 100).toFixed(1) : '0.0';
            const color = COLORS[i % COLORS.length];
            return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                <div style="width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0;"></div>
                <span style="color:#94a3b8;font-size:12px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${d.nombre}</span>
                <span style="color:#cbd5e1;font-size:12px;font-weight:700;">${pct}%</span>
            </div>`;
        }).join('');

        const emptyMsg = datos.length === 0 ? `<div style="color:#64748b;text-align:center;padding:24px 0;font-size:14px;">No hay cuentas activas con saldo</div>` : '';

        overlay.innerHTML = `
        <div style="background:#0f172a;border:1px solid rgba(16,185,129,0.2);border-radius:20px;
            width:100%;max-width:640px;max-height:90%;overflow-y:auto;padding:24px;
            box-shadow:0 0 60px rgba(16,185,129,0.12);">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span class="material-symbols-rounded" style="color:#10b981;font-size:22px;">equalizer</span>
                    <span style="color:#f1f5f9;font-size:17px;font-weight:700;">Estadísticas de Cuentas</span>
                </div>
                <button onclick="document.getElementById('modalEstadisticasCuentas').remove()"
                    style="background:rgba(255,255,255,0.06);border:none;border-radius:10px;width:32px;height:32px;
                    cursor:pointer;display:flex;align-items:center;justify-content:center;color:#94a3b8;">
                    <span class="material-symbols-rounded" style="font-size:18px;">close</span>
                </button>
            </div>
            <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.15);border-radius:12px;
                padding:14px 18px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;">
                <span style="color:#64748b;font-size:13px;font-weight:600;">TOTAL SALDO</span>
                <span style="color:#10b981;font-size:20px;font-weight:800;font-family:Manrope,sans-serif;">${fmtEuro(total)}</span>
            </div>
            ${emptyMsg}
            ${datos.length > 0 ? `
            <div style="display:flex;gap:20px;margin-bottom:24px;align-items:center;flex-wrap:wrap;">
                <div style="flex-shrink:0;position:relative;width:180px;height:180px;">
                    <svg width="180" height="180" viewBox="0 0 180 180">${donutSegments}</svg>
                    <div style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                        <span style="color:#64748b;font-size:11px;font-weight:600;">CUENTAS</span>
                        <span style="color:#f1f5f9;font-size:20px;font-weight:800;">${datos.length}</span>
                    </div>
                </div>
                <div style="flex:1;min-width:160px;">${legendItems}</div>
            </div>
            <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:18px;">
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:16px;">
                    <span class="material-symbols-rounded" style="color:#10b981;font-size:16px;">bar_chart</span>
                    <span style="color:#94a3b8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Distribución por cuenta</span>
                </div>
                ${barras}
            </div>` : ''}
        </div>`;

        document.body.appendChild(overlay);
        overlay.addEventListener('click', function(e) {
        });
    }
    window._traspasoState = { emisorIdx: 0, receptorIdx: 1 };

    function _getCuentasTraspaso() {
        const cuentas = [];
        const cardsCuentas = document.querySelectorAll('#listaCuentas .card-input-group');
        cardsCuentas.forEach((card, idx) => {
            const nombreInput = card.querySelector('input[type="text"]:not(.cuenta-saldo-input)');
            const valorInput = card.querySelector('.cuenta-saldo-input');
            if (nombreInput && valorInput) {
                const nombre = nombreInput.value.trim() || 'Sin nombre';
                const valor = parseMoneyInput(valorInput.value) || 0;
                const iconContainer = card.querySelector('.icon-container');
                let thumb = null;
                if (iconContainer) {
                    const img = iconContainer.querySelector('img');
                    if (img) {
                        thumb = { tipo: 'img', src: img.src };
                    } else {
                        const sp = iconContainer.querySelector('.material-symbols-rounded, .material-symbols-rounded');
                        const colorStyle = sp ? sp.style.color : '#94a3b8';
                        const iconName = sp ? sp.textContent.trim() : 'account_balance';
                        const bgColor = iconContainer.dataset.bgColor || null;
                        const bgOpacity = 100;
                        const _h2r = h => { const r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h); return r?parseInt(r[1],16)+','+parseInt(r[2],16)+','+parseInt(r[3],16):'30,41,59'; };
                        const bgCss = bgColor ? `rgba(${_h2r(bgColor)},${(bgOpacity/100).toFixed(2)})` : (iconContainer.style.background || '#1e293b');
                        thumb = { tipo: 'icon', icon: iconName, color: colorStyle || '#94a3b8', bg: bgCss };
                    }
                }
                cuentas.push({ 
                    tipo: 'cuenta',
                    idx: idx,
                    nombre, 
                    valor, 
                    nombreInput, 
                    valorInput, 
                    thumb 
                });
            }
        });
        const cardsInversiones = document.querySelectorAll('#listaInversiones .card-input-group');
        cardsInversiones.forEach((card, idx) => {
            const nombreInput = card.querySelector('input[type="text"]:not(.cuenta-saldo-input)');
            const valorInput = card.querySelector('.cuenta-saldo-input');
            if (nombreInput && valorInput) {
                const nombre = nombreInput.value.trim() || 'Sin nombre';
                const valor = parseMoneyInput(valorInput.value) || 0;
                const iconContainer = card.querySelector('.icon-container');
                let thumb = null;
                if (iconContainer) {
                    const img = iconContainer.querySelector('img');
                    if (img) {
                        thumb = { tipo: 'img', src: img.src };
                    } else {
                        const sp = iconContainer.querySelector('.material-symbols-rounded, .material-symbols-rounded');
                        const colorStyle = sp ? sp.style.color : '#10b981';
                        const iconName = sp ? sp.textContent.trim() : 'trending_up';
                        const bgColor = iconContainer.dataset.bgColor || null;
                        const bgOpacity = 100;
                        const _h2r = h => { const r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h); return r?parseInt(r[1],16)+','+parseInt(r[2],16)+','+parseInt(r[3],16):'30,41,59'; };
                        const bgCss = bgColor ? `rgba(${_h2r(bgColor)},${(bgOpacity/100).toFixed(2)})` : (iconContainer.style.background || '#1e293b');
                        thumb = { tipo: 'icon', icon: iconName, color: colorStyle || '#10b981', bg: bgCss };
                    }
                }
                cuentas.push({ 
                    tipo: 'inversion',
                    idx: idx,
                    nombre, 
                    valor, 
                    nombreInput, 
                    valorInput, 
                    thumb 
                });
            }
        });
        
        return cuentas;
    }

    function _thumbHTML(thumb, size) {
        const s = size || 28;
        const br = Math.round(s * 0.30);
        if (!thumb) return `<div style="width:${s}px;height:${s}px;min-width:${s}px;min-height:${s}px;border-radius:${br}px;background:#1e293b;display:flex;align-items:center;justify-content:center;flex-shrink:0;aspect-ratio:1/1;"><span class="material-symbols-rounded" style="font-size:${Math.round(s*0.6)}px;color:#94a3b8;">account_balance</span></div>`;
        if (thumb.tipo === 'img') {
            return `<img src="${thumb.src}" style="width:${s}px;height:${s}px;min-width:${s}px;min-height:${s}px;border-radius:${br}px;object-fit:cover;flex-shrink:0;display:block;aspect-ratio:1/1;">`;
        }
        const bg = thumb.bg || '#1e293b';
        return `<div style="width:${s}px;height:${s}px;min-width:${s}px;min-height:${s}px;border-radius:${br}px;background:${bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;aspect-ratio:1/1;"><span class="material-symbols-rounded" style="font-size:${Math.round(s*0.6)}px;color:${thumb.color};">${thumb.icon}</span></div>`;
    }

    function abrirTraspasoCuentas() {
        const cuentas = _getCuentasTraspaso();
        if (cuentas.length < 2) {
            alert('Necesitas al menos 2 cuentas para realizar un traspaso.');
            return;
        }
        window._traspasoState = { emisorIdx: 0, receptorIdx: 1 };

        const overlay = document.createElement('div');
        overlay.id = 'modalTraspasoCuentas';
        overlay.style.cssText = `position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:99990;background:rgba(0,0,0,0.85);
            display:flex;align-items:center;justify-content:center;padding:16px;`;

        overlay.innerHTML = `
        <div id="traspasoCard" style="background:#0f172a;border:1px solid rgba(59,130,246,0.2);border-radius:20px;
            width:100%;max-width:440px;padding:28px;box-shadow:0 0 60px rgba(59,130,246,0.1);
            position:relative;overflow:hidden;">

            <!-- Barra de animación de confirmación -->
            <div id="traspasoAnimBar" style="display:none;position:absolute;top:0;left:0;right:0;bottom:0;border-radius:20px;z-index:10;pointer-events:none;overflow:hidden;">
                <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(90deg,transparent 0%,rgba(16,185,129,0.25) 40%,rgba(16,185,129,0.5) 50%,rgba(16,185,129,0.25) 60%,transparent 100%);transform:translateX(-100%);width:100%;height:100%;"></div>
            </div>

            <!-- Header -->
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span class="material-symbols-rounded" style="color:#3b82f6;font-size:22px;">sync_alt</span>
                    <span style="color:#f1f5f9;font-size:17px;font-weight:700;">Traspaso entre Cuentas e Inversiones</span>
                </div>
                <button onclick="document.body.style.overflow=''; document.getElementById('modalTraspasoCuentas').remove()"
                    style="background:rgba(255,255,255,0.06);border:none;border-radius:10px;width:32px;height:32px;
                    cursor:pointer;display:flex;align-items:center;justify-content:center;color:#94a3b8;">
                    <span class="material-symbols-rounded" style="font-size:18px;">close</span>
                </button>
            </div>

            <!-- Cuenta Emisora -->
            <div style="margin-bottom:12px;">
                <button id="btnTraspasoEmisor" onclick="abrirFloatingTraspaso('emisor', this)"
                    style="width:100%;background:#1e293b;border:1px solid rgba(59,130,246,0.25);border-radius:12px;
                    color:#f1f5f9;font-size:13px;font-weight:600;padding:12px;
                    cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;
                    transition:border-color 0.15s;">
                    <div id="thumbTraspasoEmisor" style="width:36px;height:36px;min-width:36px;min-height:36px;border-radius:10px;background:transparent;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;aspect-ratio:1/1;"></div>
                    <div style="display:flex;flex-direction:column;align-items:flex-start;min-width:0;">
                        <span style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">De cuenta</span>
                        <span id="labelTraspasoEmisor" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#f1f5f9;font-size:14px;font-weight:700;"></span>
                    </div>
                </button>
            </div>

            <!-- Intercambiar -->
            <div style="display:flex;align-items:center;justify-content:center;margin:8px 0;gap:8px;">
                <div style="flex:1;height:1px;background:rgba(255,255,255,0.07);"></div>
                <button onclick="intercambiarCuentasTraspaso()" title="Intercambiar cuentas"
                    style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:50%;
                    width:32px;height:32px;display:flex;align-items:center;justify-content:center;
                    cursor:pointer;transition:all 0.2s;"
                    onmouseover="this.style.background='rgba(59,130,246,0.2)';this.style.borderColor='rgba(59,130,246,0.5)'"
                    onmouseout="this.style.background='rgba(59,130,246,0.08)';this.style.borderColor='rgba(59,130,246,0.2)'">
                    <span class="material-symbols-rounded" style="color:#3b82f6;font-size:18px;">sync</span>
                </button>
                <div style="flex:1;height:1px;background:rgba(255,255,255,0.07);"></div>
            </div>

            <!-- Cuenta Receptora -->
            <div style="margin-bottom:20px;">
                <button id="btnTraspasoReceptor" onclick="abrirFloatingTraspaso('receptor', this)"
                    style="width:100%;background:#1e293b;border:1px solid rgba(59,130,246,0.25);border-radius:12px;
                    color:#f1f5f9;font-size:13px;font-weight:600;padding:12px;
                    cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;
                    transition:border-color 0.15s;">
                    <div id="thumbTraspasoReceptor" style="width:36px;height:36px;min-width:36px;min-height:36px;border-radius:10px;background:transparent;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;aspect-ratio:1/1;"></div>
                    <div style="display:flex;flex-direction:column;align-items:flex-start;min-width:0;">
                        <span style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">A cuenta</span>
                        <span id="labelTraspasoReceptor" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#f1f5f9;font-size:14px;font-weight:700;"></span>
                    </div>
                </button>
            </div>

            <!-- Importe -->
            <div style="margin-bottom:20px;">
                <label style="color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:8px;">Importe a traspasar</label>
                <div style="background:#1e293b;border:1px solid rgba(59,130,246,0.25);border-radius:12px;
                    display:flex;align-items:center;justify-content:center;gap:6px;padding:11px 16px;
                    transition:border-color 0.15s;position:relative;"
                    onfocusin="this.style.borderColor='rgba(59,130,246,0.6)'"
                    onfocusout="this.style.borderColor='rgba(59,130,246,0.25)'">
                    <input id="traspasoImporte" type="text" inputmode="decimal" placeholder="0,00"
                        style="background:transparent;border:none;outline:none;
                        color:#f1f5f9;font-size:26px;font-weight:700;text-align:center;font-family:Manrope,sans-serif;
                        width:100%;min-width:0;box-sizing:border-box;padding-right:28px;"
                        oninput="fmtTraspasoImporte(this);actualizarResumenTraspaso()">
                    <span class="traspaso-euro-symbol" style="color:#3b82f6;font-size:26px;font-weight:700;flex-shrink:0;line-height:1;position:absolute;right:16px;">€</span>
                </div>
            </div>

            <!-- Resumen -->
            <div id="traspasoResumen" style="display:none;background:rgba(59,130,246,0.05);border:1px solid rgba(59,130,246,0.15);
                border-radius:12px;padding:13px 16px;margin-bottom:18px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;">
                    <span style="color:#64748b;font-size:12px;">Saldo resultante (origen)</span>
                    <span id="resumenEmisorSaldo" style="color:#93c5fd;font-size:13px;font-weight:700;font-family:Manrope,sans-serif;">—</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="color:#64748b;font-size:12px;">Saldo resultante (destino)</span>
                    <span id="resumenReceptorSaldo" style="color:#93c5fd;font-size:13px;font-weight:700;font-family:Manrope,sans-serif;">—</span>
                </div>
            </div>

            <!-- Error -->
            <div id="traspasoError" style="display:none;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);
                border-radius:10px;padding:9px 14px;margin-bottom:14px;color:#f87171;font-size:13px;font-weight:600;text-align:center;display:none;align-items:center;justify-content:center;gap:6px;"></div>

            <!-- Nota -->
            <div style="margin-bottom:12px;">
                <input id="traspasoNota" type="text" placeholder="Añadir nota (opcional)…"
                    style="width:100%;background:rgba(15,23,42,0.6);border:1px solid rgba(71,85,105,0.3);border-radius:10px;
                    color:#f1f5f9;font-size:13px;font-style:italic;padding:10px 14px;outline:none;box-sizing:border-box;font-family:inherit;
                    transition:border-color 0.15s;"
                    onfocus="this.style.borderColor='rgba(59,130,246,0.5)'"
                    onblur="this.style.borderColor='rgba(71,85,105,0.3)'">
            </div>

            <!-- Confirmar -->
            <button id="btnConfirmarTraspaso" onclick="ejecutarTraspaso()"
                style="width:100%;background:rgba(16,185,129,0.12);border:1.5px solid rgba(16,185,129,0.5);border-radius:12px;
                color:#10b981;font-size:14px;font-weight:700;padding:13px;cursor:pointer;
                display:flex;align-items:center;justify-content:center;gap:8px;
                box-shadow:0 4px 20px rgba(16,185,129,0.1);transition:all 0.2s;"
                onmouseover="this.style.background='rgba(16,185,129,0.2)';this.style.borderColor='rgba(16,185,129,0.8)'"
                onmouseout="this.style.background='rgba(16,185,129,0.12)';this.style.borderColor='rgba(16,185,129,0.5)'">
                <div id="lottie-traspaso-btn" style="width:22px;height:22px;flex-shrink:0;"></div>
                Confirmar Traspaso
            </button>
        </div>`;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            const lottieContainer = document.getElementById('lottie-traspaso-btn');
            if (lottieContainer && window.lottie) {
                var animT = lottie.loadAnimation({
                    container: lottieContainer,
                    renderer: 'svg',
                    loop: false,
                    autoplay: true,
                    animationData: _TRASPASO_LOTTIE_JSON
                });
                animT.addEventListener('complete', function() {
                    setTimeout(function() { animT.goToAndPlay(0); }, 2000);
                });
            }
        }, 50);
        overlay.addEventListener('click', function(e) { 
        });

        _renderLabelTraspaso();
    }

    function _renderLabelTraspaso() {
        const cuentas = _getCuentasTraspaso();
        const fmtEuro = v => v.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
        const { emisorIdx, receptorIdx } = window._traspasoState;

        const lE = document.getElementById('labelTraspasoEmisor');
        const lR = document.getElementById('labelTraspasoReceptor');
        const tE = document.getElementById('thumbTraspasoEmisor');
        const tR = document.getElementById('thumbTraspasoReceptor');

        if (lE && cuentas[emisorIdx]) {
            const tipoBadge = cuentas[emisorIdx].tipo === 'inversion' 
                ? '<span style="font-size:9px;background:rgba(16,185,129,0.15);color:#10b981;padding:2px 6px;border-radius:4px;margin-left:4px;font-weight:700;text-transform:uppercase;vertical-align:middle;display:inline-flex;align-items:center;">Inversión</span>'
                : '<span style="font-size:9px;background:rgba(59,130,246,0.15);color:#3b82f6;padding:2px 6px;border-radius:4px;margin-left:4px;font-weight:700;text-transform:uppercase;vertical-align:middle;display:inline-flex;align-items:center;">Cuenta</span>';
            lE.style.display = 'flex';
            lE.style.alignItems = 'center';
            lE.innerHTML = cuentas[emisorIdx].nombre + tipoBadge;
        }
        if (lR && cuentas[receptorIdx]) {
            const tipoBadge = cuentas[receptorIdx].tipo === 'inversion'
                ? '<span style="font-size:9px;background:rgba(16,185,129,0.15);color:#10b981;padding:2px 6px;border-radius:4px;margin-left:4px;font-weight:700;text-transform:uppercase;vertical-align:middle;display:inline-flex;align-items:center;">Inversión</span>'
                : '<span style="font-size:9px;background:rgba(59,130,246,0.15);color:#3b82f6;padding:2px 6px;border-radius:4px;margin-left:4px;font-weight:700;text-transform:uppercase;vertical-align:middle;display:inline-flex;align-items:center;">Cuenta</span>';
            lR.style.display = 'flex';
            lR.style.alignItems = 'center';
            lR.innerHTML = cuentas[receptorIdx].nombre + tipoBadge;
        }
        const sE = document.getElementById('saldoTraspasoEmisor');
        const sR = document.getElementById('saldoTraspasoReceptor');
        if (sE && cuentas[emisorIdx]) sE.textContent = fmtEuro(cuentas[emisorIdx].valor);
        if (sR && cuentas[receptorIdx]) sR.textContent = fmtEuro(cuentas[receptorIdx].valor);
        if (tE && cuentas[emisorIdx]) tE.innerHTML = _thumbHTML(cuentas[emisorIdx].thumb, 36);
        if (tR && cuentas[receptorIdx]) tR.innerHTML = _thumbHTML(cuentas[receptorIdx].thumb, 36);

        actualizarResumenTraspaso();
    }

    function fmtTraspasoImporte(input) {
        const pos = input.selectionStart;
        const oldVal = input.value;
        const commaIdx = oldVal.lastIndexOf(',');
        let intRaw, decPart = null;
        if (commaIdx >= 0) {
            intRaw  = oldVal.slice(0, commaIdx).replace(/[^\d]/g, '');
            decPart = oldVal.slice(commaIdx + 1).replace(/[^\d]/g, '').slice(0, 2);
        } else {
            intRaw = oldVal.replace(/[^\d]/g, '');
        }
        const intFmt = intRaw ? intRaw.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
        const newVal = decPart !== null ? intFmt + ',' + decPart : intFmt;
        if (newVal === oldVal) return;
        input.value = newVal;
        const diff = newVal.length - oldVal.length;
        const newPos = Math.max(0, pos + diff);
        input.setSelectionRange(newPos, newPos);
    }

    function _parseTraspasoImporte() {
        const v = document.getElementById('traspasoImporte')?.value || '';
        return parseFloat(v.replace(/\./g, '').replace(',', '.')) || 0;
    }

    function intercambiarCuentasTraspaso() {
        const state = window._traspasoState;
        const tmp = state.emisorIdx;
        state.emisorIdx = state.receptorIdx;
        state.receptorIdx = tmp;
        const btn = document.querySelector('[onclick="intercambiarCuentasTraspaso()"]');
        if (btn) {
            btn.style.transition = 'transform 0.8s ease';
            btn.style.transform = 'rotate(360deg)';
            setTimeout(() => { btn.style.transition = 'none'; btn.style.transform = 'rotate(0deg)'; }, 820);
        }
        _renderLabelTraspaso();
    }

    function abrirFloatingTraspaso(tipo, btn) {
        const prev = document.getElementById('floatingTraspasoMenu');
        if (prev) { prev.remove(); if (prev._tipo === tipo) return; }

        const cuentas = _getCuentasTraspaso();
        const fmtEuro = v => v.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
        const state = window._traspasoState;
        const activoIdx = tipo === 'emisor' ? state.emisorIdx : state.receptorIdx;
        const bloqueadoIdx = tipo === 'emisor' ? state.receptorIdx : state.emisorIdx;

        const floating = document.createElement('div');
        floating.id = 'floatingTraspasoMenu';
        floating._tipo = tipo;
        floating.style.cssText = 'position:fixed;background:rgba(15,23,42,0.97);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:6px;min-width:240px;max-height:300px;overflow-y:auto;z-index:99995;box-shadow:0 10px 40px rgba(0,0,0,0.5);display:flex;flex-direction:column;gap:2px;';

        cuentas.forEach((cuenta, i) => {
            const b = document.createElement('button');
            const isActive = i === activoIdx;
            const isBlocked = i === bloqueadoIdx;
            const color = isBlocked ? '#334155' : isActive ? '#60a5fa' : '#94a3b8';
            b.style.cssText = `display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 12px;border-radius:8px;font-size:13px;font-family:Plus Jakarta Sans,sans-serif;font-weight:600;color:${color};background:transparent;border:none;cursor:${isBlocked ? 'not-allowed' : 'pointer'};width:100%;text-align:left;transition:all 0.15s;opacity:${isBlocked ? '0.4' : '1'};`;

            const thumbWrap = document.createElement('div');
            thumbWrap.style.cssText = 'width:26px;height:26px;border-radius:7px;background:#1e293b;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;';
            thumbWrap.innerHTML = _thumbHTML(cuenta.thumb, 26);

            const checkIcon = document.createElement('span');
            checkIcon.className = 'material-symbols-rounded';
            checkIcon.style.cssText = 'font-size:15px;flex-shrink:0;';
            checkIcon.textContent = isBlocked ? 'block' : isActive ? 'check_circle' : 'radio_button_unchecked';

            const nameSpan = document.createElement('div');
            nameSpan.style.cssText = 'flex:1;overflow:hidden;display:flex;flex-direction:column;gap:2px;';
            
            const nombreDiv = document.createElement('span');
            nombreDiv.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
            nombreDiv.textContent = cuenta.nombre;
            
            const tipoDiv = document.createElement('span');
            tipoDiv.style.cssText = 'font-size:9px;text-transform:uppercase;font-weight:700;opacity:0.6;';
            tipoDiv.textContent = cuenta.tipo === 'inversion' ? 'Inversión' : 'Cuenta';
            
            nameSpan.appendChild(nombreDiv);
            nameSpan.appendChild(tipoDiv);

            const valSpan = document.createElement('span');
            valSpan.style.cssText = 'font-size:11px;font-family:Manrope,sans-serif;color:' + (isActive ? '#60a5fa' : '#64748b') + ';flex-shrink:0;';
            valSpan.textContent = fmtEuro(cuenta.valor);

            b.appendChild(thumbWrap);
            b.appendChild(nameSpan);
            b.appendChild(valSpan);
            b.appendChild(checkIcon);

            if (!isBlocked) {
                b.onmouseenter = () => { b.style.background = 'rgba(255,255,255,0.06)'; b.style.color = '#fff'; valSpan.style.color = '#fff'; };
                b.onmouseleave = () => { b.style.background = 'transparent'; b.style.color = isActive ? '#60a5fa' : '#94a3b8'; valSpan.style.color = isActive ? '#60a5fa' : '#64748b'; };
                b.onclick = (e) => {
                    e.stopPropagation();
                    if (tipo === 'emisor') state.emisorIdx = i;
                    else state.receptorIdx = i;
                    floating.remove();
                    _renderLabelTraspaso();
                };
            } else {
                b.onclick = (e) => e.stopPropagation();
            }
            floating.appendChild(b);
        });

        document.body.appendChild(floating);

        function updatePos() {
            const rect = btn.getBoundingClientRect();
            floating.style.top = (rect.bottom + 6) + 'px';
            const fw = floating.offsetWidth || 240;
            let left = rect.right - fw;
            if (left < 8) left = 8;
            floating.style.left = left + 'px';
        }
        updatePos();

        setTimeout(() => {
            document.addEventListener('click', function handler(e) {
                if (!floating.contains(e.target) && e.target !== btn) {
                    floating.remove();
                    document.removeEventListener('click', handler);
                }
            });
        }, 0);
    }

    function actualizarResumenTraspaso() {
        const cuentas = _getCuentasTraspaso();
        const { emisorIdx, receptorIdx } = window._traspasoState;
        const importe = _parseTraspasoImporte();
        const fmtEuro = v => v.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
        const resumen = document.getElementById('traspasoResumen');
        const errorDiv = document.getElementById('traspasoError');
        if (!resumen) return;
        if (errorDiv) errorDiv.style.display = 'none';
        if (importe <= 0) { resumen.style.display = 'none'; return; }
        const emisor = cuentas[emisorIdx];
        const receptor = cuentas[receptorIdx];
        if (!emisor || !receptor) { resumen.style.display = 'none'; return; }
        resumen.style.display = 'block';
        document.getElementById('resumenEmisorSaldo').textContent = fmtEuro(emisor.valor - importe);
        document.getElementById('resumenReceptorSaldo').textContent = fmtEuro(receptor.valor + importe);
    }

    function ejecutarTraspaso() {
        const cuentas = _getCuentasTraspaso();
        const { emisorIdx, receptorIdx } = window._traspasoState;
        const importe = _parseTraspasoImporte();
        const errorDiv = document.getElementById('traspasoError');

        const showError = msg => {
            errorDiv.innerHTML = `<span class="material-symbols-rounded" style="font-size:16px;flex-shrink:0;">warning</span>${msg}`;
            errorDiv.style.display = 'flex';
        };
        if (emisorIdx === receptorIdx) { showError('La cuenta de origen y destino no pueden ser la misma.'); return; }
        if (importe <= 0) { showError('Introduce un importe válido mayor que 0.'); return; }
        const emisor = cuentas[emisorIdx];
        const receptor = cuentas[receptorIdx];
        if (!emisor || !receptor) { showError('Selecciona cuentas válidas.'); return; }
        if (importe > emisor.valor) { showError('Saldo insuficiente en la cuenta de origen.'); return; }
        const card = document.getElementById('traspasoCard');
        const animBar = document.getElementById('traspasoAnimBar');
        const confirmBtn = document.getElementById('btnConfirmarTraspaso');
        if (confirmBtn) confirmBtn.style.pointerEvents = 'none';

        if (animBar && card) {
            animBar.classList.add('playing');
            card.style.transition = 'border-color 0.4s, box-shadow 0.4s';
            card.style.borderColor = 'rgba(16,185,129,0.6)';
            card.style.boxShadow = '0 0 80px rgba(16,185,129,0.3)';
        }
        setTimeout(() => {
            const fmt = v => v.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            emisor.valorInput.value = fmt(emisor.valor - importe);
            receptor.valorInput.value = fmt(receptor.valor + importe);
            emisor.valorInput.dispatchEvent(new Event('input', { bubbles: true }));
            receptor.valorInput.dispatchEvent(new Event('input', { bubbles: true }));
            if (typeof calcularPatrimonio === 'function') calcularPatrimonio();
            if (typeof actualizarCuentas === 'function') actualizarCuentas();
            if (typeof actualizarInversiones === 'function') actualizarInversiones();
            if (!window.finanzasData) window.finanzasData = { categorias: [], operaciones: [] };
            if (!Array.isArray(window.finanzasData.operaciones)) window.finanzasData.operaciones = [];
            if (!Array.isArray(window.finanzasData.categorias)) window.finanzasData.categorias = [];
            const traspasoOp = {
                id: 'op_traspaso_' + Date.now(),
                type: 'TRANSFER',
                amount: importe,
                note: 'Traspaso: ' + emisor.nombre + ' → ' + receptor.nombre,
                comment: (document.getElementById('traspasoNota')?.value.trim() || ''),
                categoryId: null,
                accountId: window._traspasoState.emisorIdx,
                toAccountId: window._traspasoState.receptorIdx,
                fromAccountName: emisor.nombre,
                toAccountName: receptor.nombre,
                date: new Date().toISOString(),
                createdAt: new Date().toISOString()
            };
            window.finanzasData.operaciones.push(traspasoOp);
            guardarDatos && guardarDatos();
            guardarFinanzasData && guardarFinanzasData();
            if (card) card.classList.add('closing');

            const overlay = document.getElementById('modalTraspasoCuentas');
            if (overlay) {
                overlay.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        document.body.style.overflow = '';
                        overlay.remove();
                    }, 500);
                }, 300);
            }
            const fmtEuro = v => v.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
            const toast = document.createElement('div');
            const bottomOffset = (typeof window._toastBottomOffsetPx === 'function') ? window._toastBottomOffsetPx() : 28;
            toast.style.cssText = `position:fixed;bottom:${bottomOffset}px;left:50%;transform:translateX(-50%);
                background:#0f172a;border:1px solid rgba(16,185,129,0.4);border-radius:14px;
                padding:12px 20px;display:flex;align-items:center;gap:10px;
                color:#f1f5f9;font-size:14px;font-weight:600;z-index:99999;
                box-shadow:0 8px 30px rgba(0,0,0,0.4);white-space:nowrap;max-width:min(calc(100vw - 32px), 420px);
                opacity:0;transition:opacity 0.25s ease;`;
            toast.innerHTML = `<span class="material-symbols-rounded" style="color:#10b981;font-size:20px;">check_circle</span>
                Traspaso de <strong style="color:#10b981;margin:0 3px;">${fmtEuro(importe)}</strong> realizado correctamente`;
            document.body.appendChild(toast);
            requestAnimationFrame(() => { toast.style.opacity = '1'; });
            setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3200);
        }, 1600);
    }
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            const modalEst = document.getElementById('modalEstadisticasInversiones');
            if (modalEst) { modalEst.remove(); return; }
            const modalEstC = document.getElementById('modalEstadisticasCuentas');
            if (modalEstC) { modalEstC.remove(); return; }
            const modalTraspaso = document.getElementById('modalTraspasoCuentas');
            if (modalTraspaso) { modalTraspaso.remove(); return; }
            const modalEmpresas = document.getElementById('modalEmpresasVidaLaboral');
            if (modalEmpresas) { modalEmpresas.remove(); return; }
            const modalEstVL = document.getElementById('modalEstadisticasVidaLaboral');
            if (modalEstVL) { modalEstVL.remove(); return; }
            const modalIconos = document.getElementById('modalIconos');
            if (modalIconos && modalIconos.style.display !== 'none') {
                cerrarModalIconos();
                return;
            }
            const modalTipoIngreso = document.getElementById('modalTipoIngreso');
            if (modalTipoIngreso && modalTipoIngreso.style.display !== 'none') {
                cerrarModalTipoIngreso();
                return;
            }
            const modalArchivo = document.getElementById('modalArchivo');
            if (modalArchivo) {
                modalArchivo.remove();
                return;
            }
            const modalBorrar = document.getElementById('modal-borrar-overlay');
            if (modalBorrar && modalBorrar.style.display !== 'none') {
                cerrarModalBorrar();
                return;
            }
            const modalReforma = document.getElementById('modal-reforma-overlay');
            if (modalReforma && modalReforma.classList.contains('open')) {
                _cerrarModal();
                return;
            }
        }
    });
    
    function posicionarIndicador(wrapId, activeId) {
        var wrap = document.getElementById(wrapId);
        var activeBtn = document.getElementById(activeId);
        if (!wrap || !activeBtn) return;
        var ind = wrap.querySelector('.cat-switch-indicator');
        if (!ind) return;
        var wrapRect = wrap.getBoundingClientRect();
        var btnRect = activeBtn.getBoundingClientRect();
        ind.style.left = (btnRect.left - wrapRect.left) + 'px';
        ind.style.width = btnRect.width + 'px';
    }

    function filtrarCategorias(tipo) {
        window._catTipoActivo = tipo;
        const expBtn = document.getElementById('tab-cat-expense');
        const incBtn = document.getElementById('tab-cat-income');
        const todasBtn = document.getElementById('tab-cat-todas');
        var expActive = { background:'linear-gradient(135deg,rgba(127,29,29,0.8) 0%,rgba(185,28,28,0.7) 50%,rgba(220,38,38,0.8) 100%)', boxShadow:'0 0 20px rgba(239,68,68,0.5)', border:'1px solid rgba(239,68,68,0.4)', color:'white' };
        var incActive = { background:'linear-gradient(135deg,rgba(6,78,59,0.8) 0%,rgba(5,150,105,0.7) 50%,rgba(16,185,129,0.8) 100%)', boxShadow:'0 0 20px rgba(16,185,129,0.5)', border:'1px solid rgba(16,185,129,0.4)', color:'white' };
        var allActive = { background:'linear-gradient(135deg,rgba(30,41,59,0.9) 0%,rgba(51,65,85,0.8) 100%)', boxShadow:'0 0 12px rgba(148,163,184,0.2)', border:'1px solid rgba(148,163,184,0.3)', color:'white' };
        var off = { background:'transparent', boxShadow:'none', border:'1px solid transparent', color:'#64748b' };
        const applyStyle = (el, s) => { if(!el) return; el.style.background=s.background; el.style.boxShadow=s.boxShadow; el.style.border=s.border; el.style.color=s.color; el.style.height='100%'; };
        applyStyle(expBtn,   tipo==='EXPENSE' ? expActive : off);
        applyStyle(incBtn,   tipo==='INCOME'  ? incActive : off);
        applyStyle(todasBtn, tipo==='ALL'     ? allActive : off);
        const boxAll      = document.getElementById('boxCategoriasAll');
        const boxGastos   = document.getElementById('boxCategoriasGastos');
        const boxIngresos = document.getElementById('boxCategoriasIngresos');
        if (boxAll)      boxAll.style.display      = tipo === 'ALL'     ? '' : 'none';
        if (boxGastos)   boxGastos.style.display   = tipo === 'EXPENSE' ? '' : 'none';
        if (boxIngresos) boxIngresos.style.display  = tipo === 'INCOME'  ? '' : 'none';
        renderizarCategoriasGrid(tipo);
    }

    function catSwitchTipo(btn, tipo, context) {
        var prefix = context === 'nueva' ? 'nueva-cat-tipo' : 'editar-cat-tipo';
        var expB = document.getElementById(prefix + '-expense');
        var incB = document.getElementById(prefix + '-income');

        var expActive = { border:'1px solid rgba(239,68,68,0.4)', background:'linear-gradient(135deg,rgba(127,29,29,0.8) 0%,rgba(185,28,28,0.7) 50%,rgba(220,38,38,0.8) 100%)', boxShadow:'0 0 20px rgba(239,68,68,0.5)', color:'white' };
        var incActive = { border:'1px solid rgba(16,185,129,0.4)', background:'linear-gradient(135deg,rgba(6,78,59,0.8) 0%,rgba(5,150,105,0.7) 50%,rgba(16,185,129,0.8) 100%)', boxShadow:'0 0 20px rgba(16,185,129,0.5)', color:'white' };
        var off      = { border:'1px solid transparent', background:'transparent', boxShadow:'none', color:'#64748b' };

        var sExp = tipo === 'EXPENSE' ? expActive : off;
        var sInc = tipo === 'INCOME' ? incActive : off;

        if (expB) { expB.style.border=sExp.border; expB.style.background=sExp.background; expB.style.boxShadow=sExp.boxShadow; expB.style.color=sExp.color; }
        if (incB) { incB.style.border=sInc.border; incB.style.background=sInc.background; incB.style.boxShadow=sInc.boxShadow; incB.style.color=sInc.color; }

        if (context === 'nueva') {
            window._nuevaCatTipo = tipo;
        } else if (context === 'editar') {
            var cat = window.finanzasData.categorias.find(function(x){ return x.id === window._editandoCategoriaModal; });
            if (cat) cat.type = tipo;
        }
    }
    function _cargarSvgEnPreviewSelector(preview, svgData, iconoFallback, color) {
        if (!preview) return;
        if (svgData && svgData.vb && svgData.svg) {
            var _svgEl;
            if (preview.tagName.toLowerCase() !== 'svg') {
                _svgEl = document.createElementNS('http://www.w3.org/2000/svg','svg');
                _svgEl.id = 'iconoPreview';
                preview.replaceWith(_svgEl);
            } else {
                _svgEl = preview;
            }
            _svgEl.setAttribute('viewBox', svgData.vb);
            _svgEl.setAttribute('width','30');
            _svgEl.setAttribute('height','30');
            _svgEl.style.cssText = 'color:'+color+';fill:currentColor;flex-shrink:0;';
            _svgEl.innerHTML = svgData.svg;
        } else {
            var _spanEl;
            if (preview.tagName.toLowerCase() === 'svg') {
                _spanEl = document.createElement('span');
                _spanEl.id = 'iconoPreview';
                _spanEl.className = 'material-symbols-rounded';
                preview.replaceWith(_spanEl);
            } else {
                _spanEl = preview;
            }
            _spanEl.textContent = iconoFallback || 'category';
            _spanEl.style.color = color;
            _spanEl.style.fontSize = '30px';
            _spanEl.style.fontVariationSettings = '"FILL" 0,"wght" 300,"GRAD" 0,"opsz" 24';
        }
    }

    function _catIconHTML(cat, size) {
        if (!cat) return '';
        size = size || 20;
        if (cat.iconoImagen) return `<img src="${cat.iconoImagen}" style="width:100%;height:100%;object-fit:cover;border-radius:${Math.round(size*0.4)}px;">`;
        if (cat.svgData) return `<svg viewBox="${cat.svgData.vb}" width="${size}" height="${size}" style="fill:${cat.iconColor||'#ffffff'};flex-shrink:0;" xmlns="http://www.w3.org/2000/svg">${cat.svgData.svg}</svg>`;
        return `<span class="material-symbols-rounded" style="font-size:${size}px;color:${cat.iconColor||'#ffffff'};font-variation-settings:'FILL' 0,'wght' 500,'GRAD' 0,'opsz' 24;">${cat.icon||'category'}</span>`;
    }
    function _setCatIcon(containerEl, cat, size, spanEl) {
        if (!containerEl || !cat) return;
        size = size || 20;
        const color = cat.iconColor || '#ffffff';
        if (cat.svgData && cat.svgData.vb && cat.svgData.svg) {
            containerEl.innerHTML = '<svg class="__svg_icon" viewBox="' + cat.svgData.vb + '" width="' + size + '" height="' + size + '" style="fill:' + color + ';flex-shrink:0;display:block;" xmlns="http://www.w3.org/2000/svg">' + cat.svgData.svg + '</svg>';
        } else {
            containerEl.querySelectorAll('.__svg_icon').forEach(function(el){ el.remove(); });
            var targetSpan = (spanEl && containerEl.contains(spanEl)) ? spanEl : containerEl.querySelector('span.material-symbols-rounded');
            if (!targetSpan) {
                targetSpan = document.createElement('span');
                targetSpan.className = 'material-symbols-rounded';
                if (spanEl && spanEl.id) targetSpan.id = spanEl.id;
                targetSpan.style.cssText = 'font-size:' + size + 'px;';
                containerEl.appendChild(targetSpan);
            }
            targetSpan.style.display = '';
            targetSpan.style.color = color;
            targetSpan.textContent = cat.icon || 'category';
        }
    }
    function _setModalAddGastoHeader(cat) {
        var iconBg = document.getElementById('modalAddGastoIconBg');
        if (!iconBg || !cat) return;
        var color = cat.color || '#64748b';
        var iconColor = cat.iconColor || '#ffffff';
        iconBg.style.background = color;
        if (cat.svgData && cat.svgData.vb && cat.svgData.svg) {
            iconBg.innerHTML = '<svg viewBox="' + cat.svgData.vb + '" width="22" height="22" style="fill:' + iconColor + ';flex-shrink:0;display:block;" xmlns="http://www.w3.org/2000/svg">' + cat.svgData.svg + '</svg>';
        } else {
            iconBg.innerHTML = '<span id="modalAddGastoIcono" class="material-symbols-rounded" style="font-size:22px;color:' + iconColor + ';">' + (cat.icon || 'category') + '</span>';
        }
    }

    function renderizarCategoriasGrid(tipo) {
        const grid = document.getElementById('categorias-grid');
        if (!grid) return;
        if (!window.finanzasData?.categorias) return;
        grid.innerHTML = '';
        grid.classList.remove('cat-grid-animate');
        void grid.offsetWidth;
        grid.classList.add('cat-grid-animate');
        const categorias = window.finanzasData.categorias.filter(cat => tipo === 'ALL' || cat.type === tipo);
        const totalEl = document.getElementById('totalCategorias');
        if (totalEl) { const total = window.finanzasData.categorias.length; totalEl.textContent = total; }
        const gastoEl = document.getElementById('totalCategoriasGastos');
        const ingresoEl = document.getElementById('totalCategoriasIngresos');
        const allEl = document.getElementById('totalCategoriasAll');
        const nGastos = window.finanzasData.categorias.filter(c => c.type === 'EXPENSE').length;
        const nIngresos = window.finanzasData.categorias.filter(c => c.type === 'INCOME').length;
        if (gastoEl) gastoEl.textContent = nGastos;
        if (ingresoEl) ingresoEl.textContent = nIngresos;
        if (allEl) allEl.textContent = nGastos + nIngresos;

        if (categorias.length === 0) {
            grid.style.display = 'block';
            grid.innerHTML = `<div style="background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:40px;text-align:center;"><span class="material-symbols-rounded" style="font-size:48px;color:#334155;display:block;margin-bottom:12px;">category</span><p style="color:#475569;font-size:14px;margin:0;">Sin categorías aún</p><p style="color:#334155;font-size:12px;margin:4px 0 0 0;">Pulsa Añadir o importa un CSV para crear categorías</p></div>`;
            return;
        }
        grid.style.display = 'grid';
        categorias.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'categoria-card';
            card.style.cssText += '; user-select:none; -webkit-user-select:none;';
            const iconBox = document.createElement('div');
            iconBox.className = 'categoria-icon-square';
            const _icbRgb = _hexToRgb(cat.color);
            const _icbAlpha = '1.00';
            iconBox.style.cssText = `background:rgba(${_icbRgb},${_icbAlpha});border:1.5px solid rgba(${_icbRgb},0.6);`;
            if (cat.svgData) {
                const svgEl = document.createElementNS('http://www.w3.org/2000/svg','svg');
                svgEl.setAttribute('viewBox', cat.svgData.vb);
                svgEl.setAttribute('width','30'); svgEl.setAttribute('height','30');
                svgEl.style.cssText = 'color:'+(cat.iconColor||'#ffffff')+';fill:currentColor;pointer-events:none;';
                svgEl.innerHTML = cat.svgData.svg;
                iconBox.appendChild(svgEl);
            } else {
                const iconSpan = document.createElement('span');
                iconSpan.className = 'material-symbols-rounded';
                iconSpan.style.cssText = 'font-size:30px;color:' + (cat.iconColor || '#ffffff') + ';font-variation-settings:\'FILL\' 0,\'wght\' 300,\'GRAD\' 0,\'opsz\' 24;';
                iconSpan.textContent = cat.icon;
                iconBox.appendChild(iconSpan);
            }
            const nameDiv = document.createElement('div');
            nameDiv.className = 'categoria-nombre';
            nameDiv.textContent = cat.name;
            card.appendChild(iconBox);
            card.appendChild(nameDiv);
            const tagCount = (cat.tags || []).length;
            if (tagCount > 0) {
                const badge = document.createElement('div');
                badge.textContent = tagCount;
                badge.style.cssText = `position:absolute;top:-8px;right:-8px;min-width:24px;height:24px;border-radius:12px;background:${cat.color};color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;padding:0 6px;box-shadow:0 2px 8px ${cat.color}88;border:2px solid #111b2e;`;
                card.style.position = 'relative';
                card.appendChild(badge);
            }
            card.addEventListener('click', function() {
                if (card._wasLongPress) { card._wasLongPress = false; return; }
                abrirMovimientoDesdeCategoria(cat.id);
            });
            let _lpTimer = null;
            let _lpStartX = 0, _lpStartY = 0;
            function _lpCancel() { clearTimeout(_lpTimer); _lpTimer = null; }
            card.addEventListener('touchstart', function(e) {
                const t = e.touches[0];
                _lpStartX = t.clientX; _lpStartY = t.clientY;
                _lpCancel();
                _lpTimer = setTimeout(() => {
                    _lpTimer = null;
                    card._wasLongPress = true;
                    if (navigator.vibrate) navigator.vibrate(40);
                    abrirModalEditarCategoria(cat.id);
                }, 600);
            }, { passive: true });
            card.addEventListener('touchmove', function(e) {
                const t = e.touches[0];
                if (Math.abs(t.clientX - _lpStartX) > 10 || Math.abs(t.clientY - _lpStartY) > 10) _lpCancel();
            }, { passive: true });
            card.addEventListener('touchend',   _lpCancel, { passive: true });
            card.addEventListener('touchcancel',_lpCancel, { passive: true });
            card.addEventListener('pointerdown', function(e) {
                if (e.pointerType === 'touch') return; // ya lo maneja touchstart
                _lpCancel();
                _lpTimer = setTimeout(() => {
                    _lpTimer = null;
                    card._wasLongPress = true;
                    abrirModalEditarCategoria(cat.id);
                }, 500);
            });
            card.addEventListener('pointerup',    _lpCancel);
            card.addEventListener('pointerleave', _lpCancel);
            grid.appendChild(card);
        });
    }

    function abrirMovimientoDesdeCategoria(catId) {
        const cat = window.finanzasData && window.finanzasData.categorias.find(c => c.id === catId);
        if (!cat) return;
        if (navigator.vibrate) navigator.vibrate(40);
        abrirModalAddMovimiento(cat.type, true, true);
        requestAnimationFrame(() => {
            window._modalGastoCatSeleccionada = catId;
            const catThumb = document.getElementById('modalGastoCatThumb');
            const catNombre = document.getElementById('modalGastoCatNombre');
            if (catThumb) catThumb.innerHTML = `<div style="width:38px;height:38px;border-radius:10px;background:${cat.color};display:flex;align-items:center;justify-content:center;overflow:hidden;">${_catIconHTML(cat,20)}</div>`;
            if (catNombre) { catNombre.textContent = cat.name; catNombre.style.color = cat.color; }
            _setModalAddGastoHeader(cat);
            document.querySelectorAll('.modal-cat-btn-item').forEach(b => {
                const label = b.querySelector('.modal-cat-label');
                if (label && label.textContent === cat.name) b.classList.add('selected');
            });
            _renderModalSubtags(cat);
        });
    }

    function abrirIconPickerCategoria(catId) {
        window._editandoCategoria = catId;
        const modal = document.getElementById('modalIconos');
        if (!modal) return;
        modal.style.display = 'flex';
        if (typeof mostrarCategoriaIconos === 'function') mostrarCategoriaIconos('todos');
        window._iconPickerCallbackCategoria = true;
        const cat = window.finanzasData.categorias.find(c => c.id === catId);
        if (cat) {
            const preview = document.getElementById('iconoPreview');
            if (preview) { _setCatIcon(preview.parentNode || preview, cat, 30, preview); }
            colorTemporal = cat.color;
            iconoTemporal = cat.icon;
            _svgDataTemporal = cat.svgData || null;
        }
    }
    
    function renderTagsPreview(container, tags, color) {
        container.innerHTML = '';
        if (!tags || !tags.length) return;
        tags.forEach(tag => {
            const s = document.createElement('span');
            s.style.cssText = 'font-size:11px;font-weight:700;padding:3px 8px;border-radius:6px;background:rgba(30,41,59,0.8);color:#94a3b8;border:1px solid rgba(255,255,255,0.08);cursor:default;';
            s.textContent = tag;
            container.appendChild(s);
        });
    }

    function _renderTagChips(tags, color) {
        const preview = document.getElementById('editar-cat-tags-preview');
        if (!preview) return;
        const cat = window.finanzasData && window._editandoCategoriaModal
            ? window.finanzasData.categorias.find(c => c.id === window._editandoCategoriaModal)
            : null;
        const c = color || (cat ? cat.color : '#60a5fa');
        preview.innerHTML = '';
        (tags || []).forEach((tag, idx) => {
            const chip = document.createElement('span');
            chip.style.cssText = `display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;padding:4px 6px 4px 12px;border-radius:20px;background:${c}22;color:${c};border:1.5px solid ${c}55;cursor:pointer;user-select:none;-webkit-user-select:none;`;
            chip.title = 'Mantén pulsado para editar';
            chip.innerHTML = `<span>${tag}</span><button onclick="_removeTagEditar(${idx})" style="background:none;border:none;cursor:pointer;color:${c};padding:0;margin:0;opacity:0.75;display:flex;align-items:center;justify-content:center;flex-shrink:0;line-height:1;" title="Eliminar"><span class="material-symbols-rounded" style="font-size:14px;line-height:1;">close</span></button>`;
            
            if (typeof attachIconLongPress === 'function') {
                attachIconLongPress(chip, () => _editTagEditar(idx));
            }

            preview.appendChild(chip);
        });
    }

    function _addTagEditar(val) {
        const tag = val.trim();
        if (!tag) return;
        if (!window._editarCatTags) window._editarCatTags = [];
        if (window._editarCatTags.includes(tag)) return;
        window._editarCatTags.push(tag);
        _renderTagChips(window._editarCatTags);
    }

    function _removeTagEditar(idx) {
        if (!window._editarCatTags) return;
        window._editarCatTags.splice(idx, 1);
        _renderTagChips(window._editarCatTags);
    }

    function _editTagEditar(idx) {
        if (!window._editarCatTags || window._editarCatTags[idx] === undefined) return;
        const oldTag = window._editarCatTags[idx];
        
        var prev = document.getElementById('_modalEditarTagOverlay');
        if (prev) prev.remove();

        var overlay = document.createElement('div');
        overlay.id = '_modalEditarTagOverlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);z-index:11000;display:flex;align-items:center;justify-content:center;padding:24px;';

        overlay.innerHTML = `
            <div id="_modalEditarTagBox" style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);border:1px solid rgba(59,130,246,0.25);border-radius:24px;width:100%;max-width:320px;padding:28px 24px;box-shadow:0 25px 60px rgba(0,0,0,0.7);animation:slideUp 0.15s ease-out;position:relative;overflow:hidden;">
                <!-- Decoración sutil -->
                <div style="position:absolute;top:-20px;right:-20px;width:100px;height:100px;background:radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%);pointer-events:none;"></div>
                
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;">
                    <span class="material-symbols-rounded" style="color:#64748b;font-size:20px;">edit_note</span>
                    <span style="color:#94a3b8;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;">Editar Etiqueta</span>
                </div>

                <div style="margin-bottom:24px;position:relative;">
                    <input id="_modalEditarTagInput" type="text" value="${oldTag}" placeholder="Nombre de la etiqueta"
                        style="width:100%;background:rgba(15,23,42,0.6);border:1.5px solid rgba(59,130,246,0.25);border-radius:14px;color:#f1f5f9;font-size:16px;font-weight:600;padding:14px 16px;outline:none;box-sizing:border-box;transition:border-color 0.2s,box-shadow 0.2s;"
                        onfocus="this.style.borderColor='rgba(59,130,246,0.6)';this.style.boxShadow='0 0 15px rgba(59,130,246,0.15)'"
                        onblur="this.style.borderColor='rgba(59,130,246,0.25)';this.style.boxShadow='none'">
                </div>

                <div style="display:flex;gap:12px;">
                    <button id="_modalEditarTagCancelar" style="flex:1;height:48px;border-radius:14px;border:1px solid rgba(255,255,255,0.08);background:rgba(15,23,42,0.3);color:#64748b;font-size:13px;font-weight:700;cursor:pointer;font-family:Manrope,sans-serif;transition:all 0.15s;" onmouseover="this.style.background='rgba(255,255,255,0.05)';this.style.color='#94a3b8'" onmouseout="this.style.background='rgba(15,23,42,0.3)';this.style.color='#64748b'">Cancelar</button>
                    <button id="_modalEditarTagConfirmar" style="flex:1.8;height:48px;border-radius:14px;border:1.5px solid rgba(59,130,246,0.4);background:rgba(59,130,246,0.1);color:#60a5fa;font-size:13px;font-weight:800;cursor:pointer;font-family:Manrope,sans-serif;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 0 20px rgba(59,130,246,0.1);transition:transform 0.1s,background 0.15s;" onmousedown="this.style.transform='scale(0.97)'" onmouseup="this.style.transform='scale(1)'" onmouseover="this.style.background='rgba(59,130,246,0.2)'" onmouseout="this.style.background='rgba(59,130,246,0.1)'">
                        <span class="material-symbols-rounded" style="font-size:20px;">save</span>Guardar
                    </button>
                </div>
            </div>`;

        document.body.appendChild(overlay);

        var modalInput = overlay.querySelector('#_modalEditarTagInput');
        requestAnimationFrame(() => { modalInput.focus(); modalInput.select(); });

        var _cerrar = function() {
             var box = document.getElementById('_modalEditarTagBox');
             if (box) {
                 box.style.transition = 'all 0.15s ease-in';
                 box.style.transform = 'scale(0.9) translateY(20px)';
                 box.style.opacity = '0';
             }
             overlay.style.transition = 'opacity 0.15s ease-in';
             overlay.style.opacity = '0';
             setTimeout(() => overlay.remove(), 150);
        };

        overlay.querySelector('#_modalEditarTagCancelar').onclick = _cerrar;

        var _guardar = function() {
            var newTag = modalInput.value.trim();
            if (newTag === '') { modalInput.focus(); return; }
            if (newTag !== oldTag) {
                if (window._editarCatTags.includes(newTag)) {
                    if (typeof _mostrarToast === 'function') _mostrarToast('warning', '#fb923c', 'Ya existe esa etiqueta');
                    return;
                }
                window._editarCatTags[idx] = newTag;
                _renderTagChips(window._editarCatTags);
            }
            _cerrar();
        };

        overlay.querySelector('#_modalEditarTagConfirmar').onclick = _guardar;
        modalInput.onkeydown = function(e) {
            if (e.key === 'Enter') { e.preventDefault(); _guardar(); }
            if (e.key === 'Escape') _cerrar();
        };
        overlay.onclick = function(e) { if (e.target === overlay) _cerrar(); };
    }

    function borrarTodasCategorias() {
        try {
            var tipo = window._catTipoActivo || 'ALL';
            var label = tipo === 'EXPENSE' ? 'gastos' : 'ingresos';
            var cats = (window.finanzasData && window.finanzasData.categorias) ? window.finanzasData.categorias : [];
            var deleting = cats.filter(function(c){ return c.type === tipo; });
            if (deleting.length === 0) { alert('No hay categorías de ' + label + '.'); return; }
            var ok = window.confirm('¿Borrar las ' + deleting.length + ' categorías de ' + label + '?');
            if (!ok) return;
            window.finanzasData.categorias = cats.filter(function(c){ return c.type !== tipo; });
            try { guardarFinanzasData(); } catch(e) {}
            renderizarCategoriasGrid(tipo);
        } catch(e) {
            alert('Error: ' + e.message);
        }
    }

    function abrirModalNuevaCategoria() {
        document.getElementById('nueva-cat-nombre').value = '';
        var ntags = document.getElementById('nueva-cat-tags'); if(ntags) ntags.value='';
        var ntp = document.getElementById('nueva-cat-tags-preview'); if(ntp) ntp.innerHTML='';
        window._nuevaCatIcono = 'category';
        window._nuevaCatColor = '#3b82f6';
        var tipoActivo = window._catTipoActivo || 'ALL';
        window._nuevaCatTipo = tipoActivo === 'INCOME' ? 'INCOME' : 'EXPENSE';
        const prev = document.getElementById('nueva-cat-icono-preview');
        if (prev) { prev.textContent = 'category'; prev.style.color = '#3b82f6'; }
        var wrapperNueva = document.getElementById('cat-tipo-nueva-wrapper');
        if (wrapperNueva) wrapperNueva.style.display = 'none';
        catSwitchTipo(null, window._nuevaCatTipo, 'nueva');
        document.getElementById('modalNuevaCategoria').style.display = 'flex';
    }
    
    function nuevaCatElegirIcono() {
        window._iconPickerCallbackCategoria = true;
        window._editandoCategoria = '__nueva__';
        window._nuevaCatPickerActive = true;
        const initIcono  = window._nuevaCatIcono    || 'star';
        const initBgColor  = window._nuevaCatColor  || '#f60950';
        const initIconColor = window._nuevaCatIconColor || '#ffffff';
        const initBgOpacity = window._nuevaCatBgOpacity != null ? window._nuevaCatBgOpacity : 50;
        colorTemporal      = initIconColor;
        bgColorTemporal    = initBgColor;
        bgOpacityTemporal = 100;
        iconoTemporal      = initIcono;
        const preview   = document.getElementById('iconoPreview');
        const previewBg = document.getElementById('iconoPreviewBg');
        const _initSvg  = window._nuevaCatSvgData || null;
        _cargarSvgEnPreviewSelector(preview, _initSvg, initIcono, initIconColor);
        _svgDataTemporal = _initSvg;
        if (previewBg) { const rgb = _hexToRgb(initBgColor); previewBg.style.background = `rgba(${rgb},${(initBgOpacity/100).toFixed(2)})`; }
        if (typeof mostrarCategoriaIconos === 'function') mostrarCategoriaIconos('todos');
        document.getElementById('modalNuevaCategoria').style.display = 'none';
        document.getElementById('modalIconos').style.display = 'flex';
        abrirModalIconos();
    }
    
    function guardarNuevaCategoria() {
        const nombre = document.getElementById('nueva-cat-nombre').value.trim();
        if (!nombre) { document.getElementById('nueva-cat-nombre').focus(); return; }
        const tipo = window._nuevaCatTipo || 'EXPENSE';
        const icono = window._nuevaCatIcono || 'category';
        const color = window._nuevaCatColor || '#3b82f6';
        const iconColor = window._nuevaCatIconColor || '#ffffff';
        const bgOpacity = 100;
        const id = 'cat_custom_' + Date.now();
        window.finanzasData.categorias.push({ id, name: nombre, type: tipo, icon: icono, color: color, iconColor: iconColor, bgOpacity: bgOpacity, tags: [], isDefault: false, orderIndex: 999, svgData: window._nuevaCatSvgData || null });
        guardarFinanzasData();
        guardarDatos && guardarDatos();
        filtrarCategorias(tipo);
        const card = document.getElementById('nuevaCatCard');
        const animBar = document.getElementById('nuevaCatAnimBar');
        const modal = document.getElementById('modalNuevaCategoria');
        if (animBar && card) {
            const barDiv = animBar.querySelector('div');
            if (barDiv) barDiv.style.background = `linear-gradient(90deg,transparent 0%,${color}44 40%,${color}99 50%,${color}44 60%,transparent 100%)`;
            animBar.classList.add('playing');
            card.style.transition = 'border-color 0.4s, box-shadow 0.4s';
            card.style.borderColor = color;
            card.style.boxShadow = '0 0 60px ' + color + '55';
        }
        setTimeout(() => {
            if (card) card.classList.add('closing');
            setTimeout(() => {
                if (modal) modal.style.display = 'none';
                if (card) { card.classList.remove('closing'); card.style.borderColor = ''; card.style.boxShadow = ''; }
                if (animBar) animBar.classList.remove('playing');
                _mostrarToast('check_circle', color || '#3b82f6', 'Categoría creada');
            }, 450);
        }, 1100);
    }
    
    function editarCategoria(id) { abrirModalEditarCategoria(id); }

    function abrirModalEditarCategoria(id) {
        const cat = window.finanzasData.categorias.find(c => c.id === id);
        if (!cat) return;
        window._editandoCategoriaModal = id;
        window._editarCatTags = [...(cat.tags || [])];
        document.getElementById('editar-cat-nombre').value = cat.name;
        var tagsEl = document.getElementById('editar-cat-tags');
        if (tagsEl) tagsEl.value = '';
        _renderTagChips(cat.tags || [], cat.color);
        const previewIconColor = cat.iconColor || '#ffffff';
        const previewBgColor   = cat.color || '#3b82f6';
        const previewBgAlpha = 1.0;
        var _editIconBg = document.getElementById('editar-cat-icono-bg');
        if (_editIconBg) {
            if (cat.svgData && cat.svgData.vb && cat.svgData.svg) {
                _editIconBg.innerHTML = '<svg class="__svg_icon" viewBox="' + cat.svgData.vb + '" width="26" height="26" style="fill:' + previewIconColor + ';flex-shrink:0;display:block;" xmlns="http://www.w3.org/2000/svg">' + cat.svgData.svg + '</svg>';
            } else {
                _editIconBg.innerHTML = '<span class="material-symbols-rounded" id="editar-cat-icono-preview" style="font-size:26px;color:' + previewIconColor + ';">' + (cat.icon || 'category') + '</span>';
            }
        }
        const prevBg = document.getElementById('editar-cat-icono-bg');
        if (prevBg) { const _hx = previewBgColor.replace('#',''); const _r=parseInt(_hx.slice(0,2),16),_g=parseInt(_hx.slice(2,4),16),_b=parseInt(_hx.slice(4,6),16); prevBg.setAttribute('style',`width:48px;height:48px;border-radius:14px;background:rgba(${_r},${_g},${_b},${previewBgAlpha.toFixed(2)});border:1.5px solid rgba(${_r},${_g},${_b},0.6);display:flex;align-items:center;justify-content:center;flex-shrink:0;`); }
        const expBtn = document.getElementById('editar-cat-tipo-expense');
        const incBtn = document.getElementById('editar-cat-tipo-income');
        catSwitchTipo(null, cat.type, 'editar');
        document.getElementById('modalEditarCategoria').style.display = 'flex';
    }

    function editarCatElegirIcono() {
        const cat = window.finanzasData.categorias.find(c => c.id === window._editandoCategoriaModal);
        window._iconPickerCallbackCategoria = true;
        window._editandoCategoria = '__editar__';
        const initBgColor   = cat ? (cat.color     || '#1e293b') : '#1e293b';
        const initIconColor = cat ? (cat.iconColor || '#ffffff') : '#ffffff';
        const initBgOpacity = 100;
        const initIcono     = (cat && cat.icon) || 'category';
        colorTemporal     = initIconColor;
        bgColorTemporal   = initBgColor;
        bgOpacityTemporal = 100;
        iconoTemporal     = initIcono;
        const preview   = document.getElementById('iconoPreview');
        const previewBg = document.getElementById('iconoPreviewBg');
        const _editSvg = cat && cat.svgData || null;
        _cargarSvgEnPreviewSelector(preview, _editSvg, initIcono, initIconColor);
        _svgDataTemporal = _editSvg;
        if (previewBg) { const rgb = _hexToRgb(initBgColor); previewBg.style.background = `rgba(${rgb},${(initBgOpacity/100).toFixed(2)})`; }
        if (typeof mostrarCategoriaIconos === 'function') mostrarCategoriaIconos('todos');
        document.getElementById('modalEditarCategoria').style.display = 'none';
        document.getElementById('modalIconos').style.display = 'flex';
        abrirModalIconos();
    }

    function guardarEditarCategoria() {
        const nombre = document.getElementById('editar-cat-nombre').value.trim();
        if (!nombre) { document.getElementById('editar-cat-nombre').focus(); return; }
        const cat = window.finanzasData.categorias.find(c => c.id === window._editandoCategoriaModal);
        if (!cat) return;
        cat.name = nombre;
        cat.tags = window._editarCatTags || [];
        guardarFinanzasData();
        guardarDatos && guardarDatos();
        filtrarCategorias(cat.type);
        document.getElementById('modalEditarCategoria').style.display = 'none';
    }

    function eliminarCategoriaEditar() {
        const cat = window.finanzasData.categorias.find(c => c.id === window._editandoCategoriaModal);
        if (!cat) return;
        const tipo = cat.type;
        window.finanzasData.categorias = window.finanzasData.categorias.filter(c => c.id !== window._editandoCategoriaModal);
        guardarFinanzasData();
        filtrarCategorias(tipo);
        document.getElementById('modalEditarCategoria').style.display = 'none';
    }
    
    function seleccionarCuentaOperacion(select) {
        window.finanzasData.cuentaActiva = parseInt(select.value);
    }
    
    function cambiarTipoOperacion(tipo) {
        window.finanzasData.tipoOperacionActual = tipo;
        document.getElementById('tipo-expense').style.background = tipo === 'EXPENSE' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'rgba(255,255,255,0.05)';
        document.getElementById('tipo-expense').style.color = tipo === 'EXPENSE' ? 'white' : '#94a3b8';
        document.getElementById('tipo-income').style.background = tipo === 'INCOME' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255,255,255,0.05)';
        document.getElementById('tipo-income').style.color = tipo === 'INCOME' ? 'white' : '#94a3b8';
        const input = document.getElementById('operacion-monto');
        input.style.color = tipo === 'EXPENSE' ? '#ef4444' : '#10b981';
        input.nextElementSibling.style.color = tipo === 'EXPENSE' ? '#ef4444' : '#10b981';
        renderizarCategoriasOperacion();
    }
    
    function renderizarCategoriasOperacion() {
        const grid = document.getElementById('operacion-categorias-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        const tipo = window.finanzasData.tipoOperacionActual;
        const categorias = window.finanzasData.categorias.filter(cat => cat.type === tipo);
        
        categorias.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'categoria-card';
            btn.style.padding = '16px';
            btn.style.minHeight = 'auto';
            
            if (window.finanzasData.categoriaSeleccionada === cat.id) {
                btn.classList.add('categoria-card-selected');
            }
            
            btn.innerHTML = `
                <div style="width:52px;height:52px;border-radius:14px;background:${cat.color};display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.3);">
                    ${_catIconHTML(cat,24)}
                </div>
                <div style="color:#cbd5e1;font-weight:700;font-size:11px;">${cat.name}</div>
            `;
            
            btn.onclick = () => seleccionarCategoriaOperacion(cat.id);
            grid.appendChild(btn);
        });
    }
    
    function seleccionarCategoriaOperacion(id) {
        window.finanzasData.categoriaSeleccionada = id;
        renderizarCategoriasOperacion();
    }
    
    function agregarDigito(digito) {
        const input = document.getElementById('operacion-monto');
        if (input.value === '0' && digito !== ',') {
            input.value = digito;
        } else {
            input.value += digito;
        }
        actualizarColorMonto(input);
    }
    
    function borrarDigito() {
        const input = document.getElementById('operacion-monto');
        input.value = input.value.slice(0, -1);
        if (input.value === '') input.value = '0';
        actualizarColorMonto(input);
    }
    
    function actualizarColorMonto(input) {
        const tipo = window.finanzasData.tipoOperacionActual;
        input.style.color = tipo === 'EXPENSE' ? '#ef4444' : '#10b981';
        input.nextElementSibling.style.color = tipo === 'EXPENSE' ? '#ef4444' : '#10b981';
    }
    
    function guardarOperacion() {
        const monto = parseFloat(document.getElementById('operacion-monto').value.replace(',', '.'));
        const nota = document.getElementById('operacion-nota').value.trim();
        const categoriaId = window.finanzasData.categoriaSeleccionada;
        const cuentaIdx = window.finanzasData.cuentaActiva;
        const tipo = window.finanzasData.tipoOperacionActual;
        
        if (!monto || monto <= 0) {
            alert('Introduce un monto válido');
            return;
        }
        
        if (!categoriaId) {
            alert('Selecciona una categoría');
            return;
        }
        
        if (cuentaIdx === null || cuentaIdx === undefined) {
            alert('Selecciona una cuenta');
            return;
        }
        const operacion = {
            id: 'op_' + Date.now(),
            accountId: cuentaIdx,
            categoryId: categoriaId,
            amount: monto,
            type: tipo,
            note: nota,
            date: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
        
        window.finanzasData.operaciones.push(operacion);
        const cards = document.querySelectorAll('#listaCuentas .card-input-group');
        if (cards[cuentaIdx]) {
            const valorInput = cards[cuentaIdx].querySelector('.cuenta-saldo-input');
            if (valorInput) {
                const saldoActual = parseMoneyInput(valorInput.value) || 0;
                const nuevoSaldo = tipo === 'INCOME' ? saldoActual + monto : saldoActual - monto;
                valorInput.value = nuevoSaldo.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                valorInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
        guardarFinanzasData();
        guardarDatos && guardarDatos();
        document.getElementById('operacion-monto').value = '0';
        document.getElementById('operacion-nota').value = '';
        window.finanzasData.categoriaSeleccionada = null;
        renderizarCategoriasOperacion();
        const cat = window.finanzasData.categorias.find(c => c.id === categoriaId);
        alert(`Operación guardada: ${tipo === 'INCOME' ? '+' : '-'}${monto.toFixed(2)}€ (${cat ? cat.name : 'Sin categoría'})`);
    }
    
    function cambiarFiltroEstadisticas(filtro) {
        window.finanzasData.filtroTemporal = filtro;
        ['dia', 'mes', 'ano', 'todo'].forEach(f => {
            const btn = document.getElementById('filtro-est-' + f);
            if (btn) {
                if (f === filtro) {
                    btn.classList.add('filtro-btn-active');
                } else {
                    btn.classList.remove('filtro-btn-active');
                }
            }
        });
        actualizarEstadisticas();
    }
    
    function actualizarEstadisticas() {
        const operaciones = obtenerOperacionesFiltradas();
        
        let totalIngresos = 0;
        let totalGastos = 0;
        
        operaciones.forEach(op => {
            if (op.type === 'ADJUST') return;
            if (op.type === 'INCOME') {
                totalIngresos += op.amount;
            } else {
                totalGastos += op.amount;
            }
        });
        
        const balance = totalIngresos - totalGastos;
        const elIngresos = document.getElementById('est-total-ingresos');
        const elGastos = document.getElementById('est-total-gastos');
        const elBalance = document.getElementById('est-balance');
        if (elIngresos) elIngresos.textContent = totalIngresos.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
        if (elGastos) elGastos.textContent = totalGastos.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
        if (elBalance) { elBalance.textContent = balance.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; elBalance.style.color = balance >= 0 ? '#10b981' : '#ef4444'; }
        renderizarListaOperaciones(operaciones);
    }
    
    function obtenerOperacionesFiltradas() {
        const ahora = new Date();
        const filtro = window.finanzasData.filtroTemporal;
        
        return window.finanzasData.operaciones.filter(op => {
            const fechaOp = new Date(op.date);
            
            switch(filtro) {
                case 'dia':
                    return fechaOp.toDateString() === ahora.toDateString();
                case 'mes':
                    return fechaOp.getMonth() === ahora.getMonth() && 
                           fechaOp.getFullYear() === ahora.getFullYear();
                case 'ano':
                    return fechaOp.getFullYear() === ahora.getFullYear();
                case 'todo':
                default:
                    return true;
            }
        });
    }
    
    function renderizarListaOperaciones(operaciones) {
        const lista = document.getElementById('lista-operaciones-recientes');
        if (!lista) return;
        
        lista.innerHTML = '';
        
        const recientes = operaciones.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
        
        if (recientes.length === 0) {
            lista.innerHTML = '<div style=\"background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:40px;text-align:center;\"><span class=\"material-symbols-rounded\" style=\"font-size:48px;color:#334155;display:block;margin-bottom:12px;\">receipt_long</span><p style=\"color:#475569;font-size:14px;margin:0;\">Sin operaciones en este periodo</p><p style=\"color:#334155;font-size:12px;margin:4px 0 0 0;\">Añade un gasto o ingreso para empezar</p></div>';
            return;
        }
        
        recientes.forEach(op => {
            const cat = window.finanzasData.categorias.find(c => c.id === op.categoryId);
            const fecha = new Date(op.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
            const isAdjust = op.type === 'ADJUST';
            const adjustPos = isAdjust && op.adjustDiff >= 0;

            const item = document.createElement('div');
            item.className = 'operacion-item-card';
            item.innerHTML = `
                <div style="width:40px;height:40px;border-radius:50%;background:${isAdjust ? '#334155' : (cat ? cat.color : '#64748b')};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    ${isAdjust
                        ? '<span class="material-symbols-rounded" style="font-size:20px;color:#ffffff;">build</span>'
                        : (cat ? _catIconHTML(cat,20) : '<span class="material-symbols-rounded" style="font-size:20px;color:white;">help</span>')}
                </div>
                <div style="flex:1;min-width:0;">
                    <div style="color:white;font-weight:700;font-size:13px;">${isAdjust ? 'Ajuste' : (cat ? cat.name : 'Sin categoría')}</div>
                    <div style="color:#64748b;font-size:11px;">${fecha}${op.note ? ' · ' + op.note : ''}</div>
                </div>
                <div style="color:${isAdjust ? (adjustPos ? '#10b981' : '#ef4444') : (op.type === 'INCOME' ? '#10b981' : '#ef4444')};font-weight:800;font-size:15px;font-family:Manrope,sans-serif;flex-shrink:0;">
                    ${isAdjust ? (adjustPos ? '+' : '-') : (op.type === 'INCOME' ? '+' : '-')}${op.amount.toFixed(2)}€
                </div>
            `;
            lista.appendChild(item);
        });
    }
    
    const originalShowTab2 = window.showTab;

    window.showTab = function(id, button) {
        originalShowTab2(id, button);
        if (id === 'reformas') {
            requestAnimationFrame(function() {
                cambiarVistaReforma(window._vistaReformaActiva || 'reforma');
                posicionarIndicador('reforma-switch-main', (window._vistaReformaActiva || 'reforma') === 'reforma' ? 'tab-reforma-reforma' : 'tab-reforma-mobiliario');
            });
        }
        const _resetGrupoFinanzas = () => {
            const btn = document.querySelector('[onclick*="toggleFinanzasDropdown"]');
            if (!btn) return;
            btn.classList.remove('active');
            const ic = btn.querySelector('.material-symbols-rounded'), tx = btn.querySelector('.tab-text');
            if (ic) ic.textContent = 'account_balance_wallet';
            if (tx) tx.textContent = 'Finanzas';
            const mfb = document.getElementById('mobileFinanzasBtn');
            if (mfb) {
                mfb.classList.remove('active');
                const mic = mfb.querySelector('.material-symbols-rounded');
                if (mic) mic.textContent = 'account_balance_wallet';
            }
        };
        const _resetGrupoVivienda = () => {
            const btn = document.querySelector('[onclick*="toggleViviendaDropdown"]');
            if (!btn) return;
            btn.classList.remove('active');
            const ic = btn.querySelector('.material-symbols-rounded'), tx = btn.querySelector('.tab-text');
            if (ic) ic.textContent = 'home';
            if (tx) tx.textContent = 'Vivienda';
            const mvb = document.getElementById('mobileViviendaBtn');
            if (mvb) {
                mvb.classList.remove('active');
                const mic = document.getElementById('mobileViviendaBtnIcon') || mvb.querySelector('.material-symbols-rounded');
                if (mic) mic.textContent = 'home';
            }
        };
        const _resetGrupoAgenda = () => {
            const btn = document.querySelector('[onclick*="toggleAgendaDropdown"]');
            if (!btn) return;
            btn.classList.remove('active');
            const ic = document.getElementById('agendaBtnIcon') || btn.querySelector('.material-symbols-rounded');
            const tx = document.getElementById('agendaBtnText') || btn.querySelector('.tab-text');
            if (ic) ic.textContent = 'book';
            if (tx) tx.textContent = 'Agenda';
            const mab = document.getElementById('mobileAgendaBtn');
            if (mab) mab.classList.remove('active');
            const maic = document.getElementById('mobileAgendaBtnIcon');
            if (maic) maic.textContent = 'book';
        };
        if (id === 'finanzas-categorias') {
            document.querySelectorAll('.tab-button, .mobile-tab-btn').forEach(b => b.classList.remove('active'));
            _resetGrupoFinanzas();
            _resetGrupoVivienda();
            _resetGrupoAgenda();
            const btnFit = document.querySelector('[onclick*="toggleFitnessDropdown"]');
            if (btnFit) { btnFit.classList.remove('active'); const ic = btnFit.querySelector('.material-symbols-rounded'); if (ic) ic.textContent = 'heart_check'; const tx = btnFit.querySelector('.tab-text'); if (tx) tx.textContent = 'Fitness'; }
            const mfitb = document.getElementById('mobileFitnessBtn');
            if (mfitb) { mfitb.classList.remove('active'); const mic = mfitb.querySelector('.material-symbols-rounded'); if (mic) mic.textContent = 'heart_check'; }
            const btnCat = document.querySelector('.tab-button[onclick*="finanzas-categorias"]');
            if (btnCat) btnCat.classList.add('active');
            const mbCat = document.getElementById('mobileCategoriasBtn');
            if (mbCat) mbCat.classList.add('active');
            cargarFinanzasData();
            const tipoActivo = window._catTipoActivo || 'ALL';
            filtrarCategorias(tipoActivo);
            catSwitchTipo(null, tipoActivo, 'nueva');
            catSwitchTipo(null, tipoActivo, 'editar');
            return;
        }
        const finanzasTabs = ['mis-activos','finanzas-operaciones','finanzas-estadisticas','ingresos'];
        const btnFinanzas = document.querySelector('[onclick*="toggleFinanzasDropdown"]');
        if (btnFinanzas) {
            const iconMap = {
                'mis-activos':           { icon: 'account_balance', label: 'Mis Activos' },
                'ingresos':              { icon: 'euro',             label: 'Ingresos & Gastos' },
                'finanzas-operaciones':  { icon: 'receipt_long',     label: 'Operaciones' },
                'finanzas-estadisticas': { icon: 'bar_chart',        label: 'Estadísticas' }
            };
            const iconEl = btnFinanzas.querySelector('.material-symbols-rounded');
            const textEl = btnFinanzas.querySelector('.tab-text');
            if (finanzasTabs.includes(id)) {
                document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                btnFinanzas.classList.add('active');
                if (iconEl && iconMap[id]) iconEl.textContent = iconMap[id].icon;
                if (textEl && iconMap[id]) textEl.textContent = iconMap[id].label;
            } else {
                _resetGrupoFinanzas();
            }
        }
        (function() {
            var mfb = document.getElementById('mobileFinanzasBtn');
            if (!mfb) return;
            var iconMap = {'mis-activos':'account_balance','ingresos':'euro','finanzas-operaciones':'receipt_long','finanzas-estadisticas':'bar_chart'};
            var iconEl = mfb.querySelector('.material-symbols-rounded');
            if (finanzasTabs.includes(id)) {
                document.querySelectorAll('.mobile-tab-btn').forEach(function(b){b.classList.remove('active');});
                mfb.classList.add('active');
                if (iconEl && iconMap[id]) iconEl.textContent = iconMap[id];
            } else {
                mfb.classList.remove('active');
                if (iconEl) iconEl.textContent = 'account_balance_wallet';
            }
        })();
        const viviendaTabs = ['hipoteca','reformas','vivienda','analisis'];
        const btnVivienda = document.querySelector('[onclick*="toggleViviendaDropdown"]');
        if (btnVivienda) {
            const viviendaIconMap = {
                'hipoteca':  { icon: 'real_estate_agent', label: 'Hipoteca' },
                'reformas':  { icon: 'chair',        label: 'Reformas & Mobiliario' },
                'vivienda':  { icon: '360',          label: 'Visor 360' },
                'analisis':  { icon: 'trending_up',  label: 'Análisis Final' }
            };
            const iconEl = btnVivienda.querySelector('.material-symbols-rounded');
            const textEl = btnVivienda.querySelector('.tab-text');
            if (viviendaTabs.includes(id)) {
                document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                btnVivienda.classList.add('active');
                if (iconEl && viviendaIconMap[id]) iconEl.textContent = viviendaIconMap[id].icon;
                if (textEl && viviendaIconMap[id]) textEl.textContent = viviendaIconMap[id].label;
            } else {
                _resetGrupoVivienda();
            }
        }
        (function() {
            var mvb = document.getElementById('mobileViviendaBtn');
            if (!mvb) return;
            var viviendaIconMap = {'hipoteca':'real_estate_agent','reformas':'chair','vivienda':'360','analisis':'trending_up'};
            var iconEl = document.getElementById('mobileViviendaBtnIcon') || mvb.querySelector('.material-symbols-rounded');
            if (viviendaTabs.includes(id)) {
                document.querySelectorAll('.mobile-tab-btn').forEach(function(b){b.classList.remove('active');});
                mvb.classList.add('active');
                if (iconEl && viviendaIconMap[id]) iconEl.textContent = viviendaIconMap[id];
            } else {
                mvb.classList.remove('active');
                if (iconEl) iconEl.textContent = 'home';
            }
        })();
        const btnAgenda = document.querySelector('[onclick*="toggleAgendaDropdown"]');
        if (btnAgenda) {
            const agendaTabs = ['agenda-diario','agenda-habitos','agenda-tareas'];
            const agendaIconMap = {
                'agenda-diario':  { icon: 'checklist_rtl', label: 'Diario' },
                'agenda-habitos': { icon: 'editor_choice', label: 'Hábitos' },
                'agenda-tareas':  { icon: 'task_alt',      label: 'Tareas' },
            };
            const esAgenda = agendaTabs.includes(id);
            const iconEl = document.getElementById('agendaBtnIcon') || btnAgenda.querySelector('.material-symbols-rounded');
            const textEl = document.getElementById('agendaBtnText') || btnAgenda.querySelector('.tab-text');
            const mobileIconEl = document.getElementById('mobileAgendaBtnIcon');
            if (esAgenda) {
                document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                btnAgenda.classList.add('active');
                if (iconEl && agendaIconMap[id]) iconEl.textContent = agendaIconMap[id].icon;
                if (textEl && agendaIconMap[id]) textEl.textContent = agendaIconMap[id].label;
                if (mobileIconEl && agendaIconMap[id]) mobileIconEl.textContent = agendaIconMap[id].icon;
            } else {
                _resetGrupoAgenda();
            }
        }
        (function() {
            var mab = document.getElementById('mobileAgendaBtn');
            if (!mab) return;
            var atabs = ['agenda-diario','agenda-habitos','agenda-tareas'];
            if (atabs.includes(id)) {
                document.querySelectorAll('.mobile-tab-btn').forEach(function(b){b.classList.remove('active');});
                mab.classList.add('active');
            } else {
                mab.classList.remove('active');
            }
        })();
        (function() {
            var mcb = document.getElementById('mobileCategoriasBtn');
            if (!mcb) return;
            if (id === 'finanzas-categorias') {
                document.querySelectorAll('.mobile-tab-btn').forEach(function(b){b.classList.remove('active');});
                mcb.classList.add('active');
            } else {
                mcb.classList.remove('active');
            }
        })();
        const fitnessTabs = ['fitness-gimnasio','fitness-nutricion','fitness-progreso'];
        const btnFitness = document.querySelector('[onclick*="toggleFitnessDropdown"]');
        if (btnFitness) {
            const fitnessIconMap = {
                'fitness-gimnasio':  { icon: 'exercise',  label: 'Gimnasio' },
                'fitness-nutricion': { icon: 'calendar_meal',   label: 'Nutrición' },
                'fitness-progreso':  { icon: 'elevation',       label: 'Progreso' }
            };
            const iconEl = btnFitness.querySelector('.material-symbols-rounded');
            const textEl = btnFitness.querySelector('.tab-text');
            if (fitnessTabs.includes(id)) {
                document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                btnFitness.classList.add('active');
                if (iconEl && fitnessIconMap[id]) iconEl.textContent = fitnessIconMap[id].icon;
                if (textEl && fitnessIconMap[id]) textEl.textContent = fitnessIconMap[id].label;
            } else {
                btnFitness.classList.remove('active');
                if (iconEl) iconEl.textContent = 'heart_check';
                if (textEl) textEl.textContent = 'Fitness';
            }
        }
        (function() {
            var mfitb = document.getElementById('mobileFitnessBtn');
            if (!mfitb) return;
            var fitnessIconMap = {'fitness-gimnasio':'exercise','fitness-nutricion':'calendar_meal','fitness-progreso':'elevation'};
            var iconEl = mfitb.querySelector('.material-symbols-rounded');
            if (fitnessTabs.includes(id)) {
                document.querySelectorAll('.mobile-tab-btn').forEach(function(b){b.classList.remove('active');});
                mfitb.classList.add('active');
                if (iconEl && fitnessIconMap[id]) iconEl.textContent = fitnessIconMap[id];
            } else {
                mfitb.classList.remove('active');
                if (iconEl) iconEl.textContent = 'heart_check';
            }
        })();
        (function() {
            if (id !== 'finanzas-categorias') return;
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            const btnCat = document.querySelector('.tab-button[onclick*="finanzas-categorias"]');
            if (btnCat) btnCat.classList.add('active');
        })();

        if (id === 'finanzas-operaciones') {
            cargarFinanzasData();
            renderHistorialOperaciones();
        } else if (id === 'finanzas-estadisticas') {
            cargarFinanzasData();
            renderEstadisticas();
        } else if (id === 'fitness-nutricion') {
            _nutriUpdateLabel();
            renderNutricion();
        }
    };
    window._modalGastoCatSeleccionada = null;
    window._modalGastoFrecSeleccionada = 'mensual';

    function abrirModalAddGasto() {
        abrirModalAddMovimiento('EXPENSE', false);
    }

    function _prepararModalFinanzasScrollable(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        const card = modal.querySelector('.finanzas-scroll-modal-card');
        const body = modal.querySelector('.finanzas-scroll-modal-body');
        modal.style.overflowY = 'auto';
        modal.style.overflowX = 'hidden';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.paddingTop = '16px';
        modal.style.paddingBottom = '16px';
        modal.style.touchAction = 'pan-y';
        modal.style.boxSizing = 'border-box';
        modal.scrollTop = 0;
        if (!card) return;
        card.style.overflow = 'hidden';
        card.style.margin = 'auto';
        card.style.maxHeight = '92dvh';
        card.scrollTop = 0;
        if (!body) return;
        body.style.overflowY = 'auto';
        body.style.overflowX = 'hidden';
        body.style.touchAction = 'pan-y';
        body.style.webkitOverflowScrolling = 'touch';
        body.style.overscrollBehavior = 'contain';
        body.scrollTop = 0;
    }

    function abrirModalAddMovimiento(tipo, desdeOperaciones = true, mostrarSwitch = false) {
        window._modalGastoTipo = tipo || 'EXPENSE';
        window._modalGastoDesdeOperaciones = desdeOperaciones;
        window._modalGastoCuentaIdx = null;

        const modal = document.getElementById('modalAddGasto');
        modal.style.display = 'flex';
        _prepararModalFinanzasScrollable('modalAddGasto');
        document.getElementById('modalGastoNombre').value = '';
        document.getElementById('modalGastoImporte').value = '';
        var notaField = document.getElementById('modalNotaField'); if(notaField) notaField.style.display='none';
        var notaNota = document.getElementById('modalGastoNota'); if(notaNota) notaNota.value='';
        var notaIcon = document.getElementById('modalNotaIcono'); if(notaIcon){ notaIcon.textContent='note_add'; notaIcon.style.color='#475569'; } var notaToggle = document.getElementById('modalNotaToggle'); if(notaToggle){ var lbl=notaToggle.querySelector('span:last-child'); if(lbl){lbl.textContent='Añadir nota';lbl.style.color='#475569';} }
        window._modalGastoCatSeleccionada = null;
        window._modalGastoFrecSeleccionada = 'mensual';
        window._modalGastoSubtag = null;
        _resetModalSubtags();
        const catNombreReset = document.getElementById('modalGastoCatNombre');
        const catThumbReset = document.getElementById('modalGastoCatThumb');
        if (catNombreReset) { catNombreReset.textContent = 'Sin seleccionar'; catNombreReset.style.color = '#e2e8f0'; }
        if (catThumbReset) catThumbReset.innerHTML = '<span class="material-symbols-rounded" style="font-size:20px;color:#64748b;">category</span>';
        document.querySelectorAll('.modal-frec-btn').forEach(b => b.classList.remove('modal-frec-active'));
        document.querySelector('[data-frec="mensual"]').classList.add('modal-frec-active');
        const isIncome = tipo === 'INCOME';
        const titulo = document.getElementById('modalAddGastoTitulo');
        const iconEl = document.getElementById('modalAddGastoIcono');
        const btnConfirmar = document.getElementById('modalAddGastoBtnConfirmar');
        const iconBg = document.getElementById('modalAddGastoIconBg');
        const importeInput = document.getElementById('modalGastoImporte');
        const euroSymbol = document.getElementById('modalGastoEuroSymbol');
        const nombreLabel = document.getElementById('modalGastoNombreLabel');
        if (nombreLabel) nombreLabel.textContent = isIncome ? 'Nombre del ingreso' : 'Nombre del gasto';
        if (titulo) titulo.textContent = isIncome ? 'Nuevo Ingreso' : 'Nuevo Gasto';
        if (iconBg) { iconBg.innerHTML = '<span id="modalAddGastoIcono" class="material-symbols-rounded" style="font-size:22px;color:' + (isIncome ? '#34d399' : '#f87171') + ';">add_circle</span>'; iconBg.style.background = isIncome ? 'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(5,150,105,0.3))' : 'linear-gradient(135deg,rgba(239,68,68,0.2),rgba(220,38,38,0.3))'; }
        if (importeInput) { importeInput.style.color = '#f1f5f9'; }
        if (euroSymbol) euroSymbol.style.color = isIncome ? '#34d399' : '#f87171';
        if (btnConfirmar) {
            btnConfirmar.style.background = isIncome ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)';
            btnConfirmar.style.color = isIncome ? '#10b981' : '#f87171';
            btnConfirmar.style.border = isIncome ? '1.5px solid rgba(16,185,129,0.5)' : '1.5px solid rgba(239,68,68,0.5)';
            btnConfirmar.style.boxShadow = isIncome ? '0 4px 20px rgba(16,185,129,0.1)' : '0 4px 20px rgba(239,68,68,0.1)';
            btnConfirmar.style.fontSize = '14px';
            btnConfirmar.style.fontWeight = '700';
            btnConfirmar.style.padding = '13px';
            btnConfirmar.onmouseover = isIncome
                ? function(){ this.style.background='rgba(16,185,129,0.2)';this.style.borderColor='rgba(16,185,129,0.8)'; }
                : function(){ this.style.background='rgba(239,68,68,0.2)';this.style.borderColor='rgba(239,68,68,0.8)'; };
            btnConfirmar.onmouseout = isIncome
                ? function(){ this.style.background='rgba(16,185,129,0.12)';this.style.borderColor='rgba(16,185,129,0.5)'; }
                : function(){ this.style.background='rgba(239,68,68,0.12)';this.style.borderColor='rgba(239,68,68,0.5)'; };
            btnConfirmar.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;"><div id="lottie-cartera-btn" style="width:22px;height:22px;flex-shrink:0;overflow:hidden;"></div><span>' + (isIncome ? 'Añadir Ingreso' : 'Añadir Gasto') + '</span></span>';
            (function() {
                var el = document.getElementById('lottie-cartera-btn');
                if (el && window.lottie) {
                    el._lottieLoaded = true;
                    var animData = JSON.parse(JSON.stringify(_CARTERA_LOTTIE_JSON));
                    var rgb = isIncome ? [0.204, 0.847, 0.600] : [0.973, 0.467, 0.467];
                    try {
                        animData.layers[0].ef[0].ef[0].v.k = rgb;
                    } catch(e) {}
                    var animC = lottie.loadAnimation({ container: el, renderer: 'svg', loop: false, autoplay: true, animationData: animData });
                    animC.addEventListener('complete', function() { setTimeout(function(){ animC.goToAndPlay(0); }, 2000); });
                }
            })();
        }
        const cuentaDropdown = document.getElementById('modalGastoCuentaDropdown');
        const catDropdown = document.getElementById('modalGastoCatDropdown');
        const cuentaChevron = document.getElementById('modalGastoCuentaChevron');
        const catChevron = document.getElementById('modalGastoCatChevron');
        if (cuentaDropdown) cuentaDropdown.style.display = 'none';
        if (catDropdown) catDropdown.style.display = 'none';
        if (cuentaChevron) cuentaChevron.style.transform = '';
        if (catChevron) catChevron.style.transform = '';
        const cuentaNombreEl = document.getElementById('modalGastoCuentaNombre');
        const cuentaThumb = document.getElementById('modalGastoCuentaThumb');
        if (cuentaNombreEl) cuentaNombreEl.textContent = 'Sin seleccionar';
        if (cuentaThumb) cuentaThumb.innerHTML = '<div style="width:38px;height:38px;border-radius:10px;background:#1e293b;display:flex;align-items:center;justify-content:center;"><span class="material-symbols-rounded" style="font-size:22px;color:#94a3b8;">account_balance</span></div>';
        const cuentaSection = document.getElementById('modalGastoCuentaSection');
        const frecSection = document.getElementById('modalGastoFrecSection');
        const categoriaSection = document.getElementById('modalGastoCategoriaSection');
        if (cuentaSection) cuentaSection.style.display = desdeOperaciones ? 'block' : 'none';
        if (frecSection) frecSection.style.display = desdeOperaciones ? 'none' : 'block';
        if (categoriaSection) categoriaSection.style.display = 'block';
        const catBtn = document.getElementById('modalGastoCatBtn');
        if (catBtn) catBtn.style.display = 'flex';
        const switchBtn = document.getElementById('modalAddGastoModoSwitch');
        if (switchBtn) {
            switchBtn.style.display = mostrarSwitch ? 'flex' : 'none';
            window._modalAddGastoModo = 'euro';
            toggleModalAddGastoModo('euro');
            const oldActDiv = document.getElementById('modalAddGastoActividadDiv');
            if (oldActDiv) { oldActDiv.style.display = 'none'; oldActDiv.innerHTML = ''; }
            _setModalAddGastoCamposVisibles(true);
        }
        if (desdeOperaciones) {
            const cuentas = typeof _getCuentasTraspaso === 'function' ? _getCuentasTraspaso() : [];
            const list = document.getElementById('modalGastoCuentaList');
            if (list) {
                list.innerHTML = '';
                cuentas.forEach((c, i) => {
                    const thumbEl34 = typeof _thumbHTML === 'function' ? _thumbHTML(c.thumb, 34) : '<div style="width:34px;height:34px;border-radius:9px;background:#1e293b;display:flex;align-items:center;justify-content:center;"><span class="material-symbols-rounded" style="font-size:20px;color:#94a3b8;">account_balance</span></div>';
                    const thumbEl38 = typeof _thumbHTML === 'function' ? _thumbHTML(c.thumb, 38) : '<div style="width:38px;height:38px;border-radius:10px;background:#1e293b;display:flex;align-items:center;justify-content:center;"><span class="material-symbols-rounded" style="font-size:22px;color:#94a3b8;">account_balance</span></div>';
                    const row = document.createElement('button');
                    row.style.cssText = 'display:flex;align-items:center;gap:12px;width:100%;padding:11px 14px;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.05);cursor:pointer;transition:background 0.12s;text-align:left;';
                    row.innerHTML = `<div style="flex-shrink:0;">${thumbEl34}</div><span style="color:#e2e8f0;font-size:13px;font-weight:700;flex:1;">${c.nombre}</span><span class="material-symbols-rounded" style="font-size:16px;color:#475569;" id="modal-cuenta-check-${i}">radio_button_unchecked</span>`;
                    row.onmouseenter = () => row.style.background = 'rgba(59,130,246,0.08)';
                    row.onmouseleave = () => row.style.background = 'transparent';
                    row.onclick = () => {
                        window._modalGastoCuentaIdx = i;
                        const thumbWrap = document.getElementById('modalGastoCuentaThumb');
                        if (thumbWrap) thumbWrap.innerHTML = thumbEl38;
                        if (cuentaNombreEl) cuentaNombreEl.textContent = c.nombre;
                        list.querySelectorAll('[id^="modal-cuenta-check-"]').forEach(el => el.textContent = 'radio_button_unchecked');
                        const check = document.getElementById('modal-cuenta-check-' + i);
                        if (check) check.textContent = 'radio_button_checked';
                        if (cuentaDropdown) cuentaDropdown.style.display = 'none';
                        if (cuentaChevron) cuentaChevron.style.transform = '';
                    };
                    list.appendChild(row);
                });
                if (list.lastChild) list.lastChild.style.borderBottom = 'none';
            }
        }
        renderModalCategorias(tipo);
        (function() {
            var el = document.getElementById('lottie-cartera-btn');
            if (!el || !window.lottie) return;
            var isInc = tipo === 'INCOME';
            var animData = JSON.parse(JSON.stringify(_CARTERA_LOTTIE_JSON));
            try { animData.layers[0].ef[0].ef[0].v.k = isInc ? [0.063, 0.725, 0.506] : [0.973, 0.467, 0.467]; } catch(e) {}
            var animC = lottie.loadAnimation({ container: el, renderer: 'svg', loop: false, autoplay: true, animationData: animData });
            animC.addEventListener('complete', function() { setTimeout(function(){ animC.goToAndPlay(0); }, 2000); });
        })();
    }

    function toggleModalCuentaDropdown() {
        const dd = document.getElementById('modalGastoCuentaDropdown');
        const chev = document.getElementById('modalGastoCuentaChevron');
        const catDd = document.getElementById('modalGastoCatDropdown');
        const catChev = document.getElementById('modalGastoCatChevron');
        const open = dd && dd.style.display !== 'none';
        if (catDd) catDd.style.display = 'none';
        if (catChev) catChev.style.transform = '';
        if (dd) dd.style.display = open ? 'none' : 'block';
        if (chev) chev.style.transform = open ? '' : 'rotate(180deg)';
    }

    function toggleModalCatDropdown() {
        const dd = document.getElementById('modalGastoCatDropdown');
        const chev = document.getElementById('modalGastoCatChevron');
        const cuentaDd = document.getElementById('modalGastoCuentaDropdown');
        const cuentaChev = document.getElementById('modalGastoCuentaChevron');
        const open = dd && dd.style.display !== 'none';
        if (cuentaDd) cuentaDd.style.display = 'none';
        if (cuentaChev) cuentaChev.style.transform = '';
        if (dd) dd.style.display = open ? 'none' : 'block';
        if (chev) chev.style.transform = open ? '' : 'rotate(180deg)';
    }

    function cerrarModalAddGasto() {
        document.getElementById('modalAddGasto').style.display = 'none';
    }

    function toggleModalNota() {
        var field = document.getElementById('modalNotaField');
        var icon = document.getElementById('modalNotaIcono');
        var toggle = document.getElementById('modalNotaToggle');
        var label = toggle.querySelector('span:last-child');
        var visible = field.style.display !== 'none';
        field.style.display = visible ? 'none' : 'block';
        icon.textContent = visible ? 'note_add' : 'note';
        icon.style.color = visible ? '#475569' : '#fbbf24';
        label.textContent = visible ? 'Añadir nota' : 'Nota activa';
        label.style.color = visible ? '#475569' : '#fbbf24';
        if (!visible) setTimeout(function(){ document.getElementById('modalGastoNota').focus(); }, 50);
    }

    function renderModalCategorias(tipo) {
        tipo = tipo || window._modalGastoTipo || 'EXPENSE';
        const esBook = window._modalAddGastoModo === 'book';
        const grid = document.getElementById('modalGastoCatGrid');
        if (!grid) return;
        grid.innerHTML = '';
        if (!window._modalGastoCatSeleccionada) _resetModalSubtags();
        const cats = (window.finanzasData && window.finanzasData.categorias)
            ? window.finanzasData.categorias.filter(c => esBook ? true : c.type === tipo)
            : [];
        let lista;
        if (esBook) {
            lista = (window.finanzasData && window.finanzasData.categorias) ? window.finanzasData.categorias : [];
        } else {
            lista = cats;
        }
        lista.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'modal-cat-btn-item' + (window._modalGastoCatSeleccionada === cat.id ? ' selected' : '');
            btn.onclick = () => {
                window._modalGastoCatSeleccionada = cat.id;
                window._modalGastoSubtag = null;
                document.querySelectorAll('.modal-cat-btn-item').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                _setModalAddGastoHeader(cat);
                const catThumb = document.getElementById('modalGastoCatThumb');
                const catNombre = document.getElementById('modalGastoCatNombre');
                if (catThumb) catThumb.innerHTML = `<div style="width:38px;height:38px;border-radius:10px;background:${cat.color};display:flex;align-items:center;justify-content:center;overflow:hidden;">${_catIconHTML(cat,20)}</div>`;
                if (catNombre) { catNombre.textContent = cat.name; catNombre.style.color = cat.color; }
                const dd = document.getElementById('modalGastoCatDropdown');
                const chev = document.getElementById('modalGastoCatChevron');
                if (dd) dd.style.display = 'none';
                if (chev) chev.style.transform = '';
                _renderModalSubtags(cat);
            };
            btn.innerHTML = `
                <div class="modal-cat-icon-sq" style="background:${cat.color};border:none;">
                    ${_catIconHTML(cat,22)}
                </div>
                <div class="modal-cat-label">${cat.name}</div>
            `;
            grid.appendChild(btn);
        });
    }

    function _resetModalSubtags() {
        const subtagSection = document.getElementById('modalSubtagSection');
        const subtagGrid = document.getElementById('modalSubtagGrid');
        if (subtagGrid) subtagGrid.innerHTML = '';
        if (subtagSection) subtagSection.style.display = 'none';
    }

    function _renderModalSubtags(cat) {
        const subtagSection = document.getElementById('modalSubtagSection');
        const subtagGrid = document.getElementById('modalSubtagGrid');
        if (!subtagSection || !subtagGrid) return;
        const tags = cat.tags || [];
        if (tags.length === 0) {
            _resetModalSubtags();
            return;
        }
        subtagGrid.innerHTML = '';
        subtagSection.style.display = 'block';
        const ninguna = document.createElement('button');
        ninguna.type = 'button';
        ninguna.style.cssText = `padding:7px 14px;border-radius:20px;font-size:12px;font-weight:700;border:2px solid ${cat.color}88;background:${cat.color}33;color:${cat.color};cursor:pointer;transition:all 0.12s;`;
        ninguna.textContent = 'Ninguna';
        ninguna.onclick = () => { window._modalGastoSubtag = null; _highlightSubtag(ninguna); };
        subtagGrid.appendChild(ninguna);
        _highlightSubtag(ninguna); // ninguna seleccionada por defecto
        tags.forEach(tag => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.style.cssText = `padding:7px 14px;border-radius:20px;font-size:12px;font-weight:700;border:1.5px solid ${cat.color}55;background:${cat.color}18;color:${cat.color};cursor:pointer;transition:all 0.12s;`;
            btn.textContent = tag;
            btn.onclick = () => { window._modalGastoSubtag = tag; _highlightSubtag(btn); };
            subtagGrid.appendChild(btn);
        });
    }

    function _highlightSubtag(activeBtn) {
        const grid = document.getElementById('modalSubtagGrid');
        if (!grid) return;
        grid.querySelectorAll('button').forEach(b => { b.style.opacity = '0.5'; b.style.borderWidth = '1.5px'; });
        activeBtn.style.opacity = '1';
        activeBtn.style.borderWidth = '2px';
    }

    function seleccionarFrecModal(btn) {
        document.querySelectorAll('.modal-frec-btn').forEach(b => b.classList.remove('modal-frec-active'));
        btn.classList.add('modal-frec-active');
        window._modalGastoFrecSeleccionada = btn.dataset.frec;
    }

    function confirmarAddGasto() {
        const importeRaw = document.getElementById('modalGastoImporte').value;
        const frec = window._modalGastoFrecSeleccionada || 'mensual';
        const catId = window._modalGastoCatSeleccionada;
        const tipo = window._modalGastoTipo || 'EXPENSE';
        const subtag = window._modalGastoSubtag || null;
        let cat = null;
        if (catId && window.finanzasData) cat = window.finanzasData.categorias.find(c => c.id === catId) || null;
        const nombre = cat ? cat.name : (tipo === 'INCOME' ? 'Ingreso' : 'Gasto');
        const nombreInput = document.getElementById('modalGastoNombre');
        if (nombreInput) nombreInput.value = nombre;

        let icono = tipo === 'INCOME' ? 'payments' : 'euro';
        let color = tipo === 'INCOME' ? '#10b981' : '#ef4444';
        if (cat) { icono = cat.icon; color = cat.color; }

        const importe = typeof parseMoneyInput === 'function'
            ? parseMoneyInput(importeRaw)
            : parseFloat(importeRaw.replace(',','.')) || 0;
        if (window._modalGastoDesdeOperaciones && importe > 0) {
            const cuentaIdx = window._modalGastoCuentaIdx;
            const noteName = cat ? cat.name : nombre;
            const operacion = {
                id: 'op_' + Date.now(),
                accountId: cuentaIdx !== null ? cuentaIdx : null,
                categoryId: catId,
                amount: importe,
                type: tipo,
                note: noteName,
                subtag: subtag,
                comment: (document.getElementById('modalGastoNota') ? document.getElementById('modalGastoNota').value.trim() : ''),
                date: new Date().toISOString(),
                createdAt: new Date().toISOString()
            };
            if (!window.finanzasData) window.finanzasData = { categorias: [], operaciones: [] };
            if (!Array.isArray(window.finanzasData.operaciones)) window.finanzasData.operaciones = [];
            window.finanzasData.operaciones.push(operacion);
            if (cuentaIdx !== null && cuentaIdx !== undefined) {
                const cuentas = typeof _getCuentasTraspaso === 'function' ? _getCuentasTraspaso() : [];
                const cuenta = cuentas[cuentaIdx];
                if (cuenta && cuenta.valorInput) {
                    const saldoActual = (typeof parseMoneyInput === 'function' ? parseMoneyInput(cuenta.valorInput.value) : parseFloat(cuenta.valorInput.value.replace(',','.')) || 0);
                    const nuevoSaldo = tipo === 'INCOME' ? saldoActual + importe : saldoActual - importe;
                    cuenta.valorInput.value = nuevoSaldo.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    cuenta.valorInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
            guardarFinanzasData();
            guardarDatos && guardarDatos();
            renderHistorialOperaciones();
            renderEstadisticas && renderEstadisticas();
        } else if (importe > 0) {
            if (typeof addGasto === 'function') {
                addGasto(nombre, importe, frec, icono, color, '');
            }
        }

        cerrarModalAddGasto();
    }
    window._opFiltro = 'mes';
    window._estFiltro = 'mes';
    window._estDetalleAbierto = null;

    function fmtFinanza(n) {
        return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
    }

    function filtrarOperacionesPorPeriodo(ops, filtro, desdeId, hastaId) {
        const now = new Date();
        if (window._opNavDesde && window._opNavHasta && desdeId === 'op-fecha-desde') {
            return ops.filter(op => {
                const d = new Date(op.date);
                return d >= window._opNavDesde && d <= window._opNavHasta;
            });
        }
        if (window._estNavDesde && window._estNavHasta && desdeId === 'est-fecha-desde') {
            return ops.filter(op => {
                const d = new Date(op.date);
                return d >= window._estNavDesde && d <= window._estNavHasta;
            });
        }
        return ops.filter(op => {
            const d = new Date(op.date);
            if (filtro === 'todo') return true;
            if (filtro === 'dia') return d.toDateString() === now.toDateString();
            if (filtro === 'semana') {
                const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay() + 1); startOfWeek.setHours(0,0,0,0);
                return d >= startOfWeek;
            }
            if (filtro === 'mes') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            if (filtro === 'ano') return d.getFullYear() === now.getFullYear();
            if (filtro === 'rango') {
                const desde = desdeId ? new Date(document.getElementById(desdeId).value) : null;
                const hasta = hastaId ? new Date(document.getElementById(hastaId).value) : null;
                if (desde && !isNaN(desde) && d < desde) return false;
                if (hasta && !isNaN(hasta)) { const h = new Date(hasta); h.setHours(23,59,59); if (d > h) return false; }
                return true;
            }
            return true;
        });
    }

    function calcularSaldoTotal() {
        let total = 0;
        const parse = v => (typeof parseMoneyInput === 'function' ? parseMoneyInput(v) : parseFloat(String(v).replace(',','.')) || 0);
        document.querySelectorAll('#listaCuentas .cuenta-saldo-input, #listaCuentas .money-input').forEach(input => {
            total += parse(input.value);
        });
        document.querySelectorAll('#listaInversiones .cuenta-saldo-input, #listaInversiones .money-input').forEach(input => {
            total += parse(input.value);
        });
        return total;
    }

    function setOpFiltro(filtro, label) {
        window._opFiltro = filtro;
        window._opNavOffset = 0;
        window._opNavDesde = null;
        window._opNavHasta = null;
        const labelEl = document.getElementById('op-intervalo-label');
        if (labelEl) labelEl.textContent = label || filtro;
        const rango = document.getElementById('op-rango-fechas');
        if (rango) rango.style.display = 'none';
        renderHistorialOperaciones();
    }

    function opNavIntervalo(dir) {
        const filtro = window._opFiltro || 'mes';
        if (filtro === 'todo' || filtro === 'rango') return;

        if (!window._opNavOffset) window._opNavOffset = 0;
        window._opNavOffset += dir;
        const offset = window._opNavOffset;

        const now = new Date();
        let label = '';
        let desde, hasta;

        if (filtro === 'dia') {
            const d = new Date(now);
            d.setDate(d.getDate() + offset);
            desde = new Date(d); desde.setHours(0,0,0,0);
            hasta = new Date(d); hasta.setHours(23,59,59,999);
            const hoy = new Date(); hoy.setHours(0,0,0,0);
            if (d.toDateString() === hoy.toDateString()) {
                label = 'Hoy';
            } else {
                label = d.toLocaleDateString('es-ES', { weekday:'short', day:'numeric', month:'long' });
                label = label.charAt(0).toUpperCase() + label.slice(1);
            }
        } else if (filtro === 'semana') {
            const lun = new Date(now);
            lun.setDate(now.getDate() - ((now.getDay()+6)%7) + offset * 7);
            lun.setHours(0,0,0,0);
            const dom = new Date(lun); dom.setDate(lun.getDate() + 6); dom.setHours(23,59,59,999);
            desde = lun; hasta = dom;
            const fmt = d => d.toLocaleDateString('es-ES', { day:'2-digit', month:'short' });
            label = fmt(lun) + ' - ' + fmt(dom);
        } else if (filtro === 'mes') {
            const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
            desde = new Date(d.getFullYear(), d.getMonth(), 1);
            hasta = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
            const m = d.toLocaleDateString('es-ES', { month:'long', year:'numeric' });
            label = m.charAt(0).toUpperCase() + m.slice(1);
        } else if (filtro === 'ano') {
            const year = now.getFullYear() + offset;
            desde = new Date(year, 0, 1);
            hasta = new Date(year, 11, 31, 23, 59, 59, 999);
            label = 'Año ' + year;
        }
        const labelEl = document.getElementById('op-intervalo-label');
        if (labelEl) labelEl.textContent = label;
        window._opNavDesde = desde;
        window._opNavHasta = hasta;
        renderHistorialOperaciones();
    }

    function estNavIntervalo(dir) {
        const filtro = window._estFiltro || 'mes';
        if (filtro === 'todo' || filtro === 'rango') return;

        if (!window._estNavOffset) window._estNavOffset = 0;
        window._estNavOffset += dir;
        const offset = window._estNavOffset;

        const now = new Date();
        let label = '';
        let desde, hasta;

        if (filtro === 'dia') {
            const d = new Date(now);
            d.setDate(d.getDate() + offset);
            desde = new Date(d); desde.setHours(0,0,0,0);
            hasta = new Date(d); hasta.setHours(23,59,59,999);
            const hoy = new Date(); hoy.setHours(0,0,0,0);
            if (d.toDateString() === hoy.toDateString()) {
                label = 'Hoy';
            } else {
                label = d.toLocaleDateString('es-ES', { weekday:'short', day:'numeric', month:'long' });
                label = label.charAt(0).toUpperCase() + label.slice(1);
            }
        } else if (filtro === 'semana') {
            const lun = new Date(now);
            lun.setDate(now.getDate() - ((now.getDay()+6)%7) + offset * 7);
            lun.setHours(0,0,0,0);
            const dom = new Date(lun); dom.setDate(lun.getDate() + 6); dom.setHours(23,59,59,999);
            desde = lun; hasta = dom;
            const fmt = d => d.toLocaleDateString('es-ES', { day:'2-digit', month:'short' });
            label = fmt(lun) + ' - ' + fmt(dom);
        } else if (filtro === 'mes') {
            const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
            desde = new Date(d.getFullYear(), d.getMonth(), 1);
            hasta = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
            const m = d.toLocaleDateString('es-ES', { month:'long', year:'numeric' });
            label = m.charAt(0).toUpperCase() + m.slice(1);
        } else if (filtro === 'ano') {
            const year = now.getFullYear() + offset;
            desde = new Date(year, 0, 1);
            hasta = new Date(year, 11, 31, 23, 59, 59, 999);
            label = 'Año ' + year;
        }

        const labelEl = document.getElementById('est-intervalo-label');
        if (labelEl) labelEl.textContent = label;

        window._estNavDesde = desde;
        window._estNavHasta = hasta;
        renderEstadisticas();
    }

    function setEstFiltroIntervalo(filtro, label) {
        window._estFiltro = filtro;
        window._estNavOffset = 0;
        window._estNavDesde = null;
        window._estNavHasta = null;
        const labelEl = document.getElementById('est-intervalo-label');
        if (labelEl) {
            const now = new Date();
            if (filtro === 'dia') {
                labelEl.textContent = 'Hoy';
            } else if (filtro === 'semana') {
                const lun = new Date(now); lun.setDate(now.getDate() - ((now.getDay()+6)%7)); lun.setHours(0,0,0,0);
                const dom = new Date(lun); dom.setDate(lun.getDate() + 6);
                const fmt = d => d.toLocaleDateString('es-ES', { day:'2-digit', month:'short' });
                labelEl.textContent = fmt(lun) + ' - ' + fmt(dom);
            } else if (filtro === 'mes') {
                const m = now.toLocaleDateString('es-ES', { month:'long', year:'numeric' });
                labelEl.textContent = m.charAt(0).toUpperCase() + m.slice(1);
            } else if (filtro === 'ano') {
                labelEl.textContent = 'Año ' + now.getFullYear();
            } else if (filtro === 'todo') {
                labelEl.textContent = 'Todo el tiempo';
            } else {
                labelEl.textContent = label || filtro;
            }
        }
        const rango = document.getElementById('est-rango-fechas');
        if (rango) rango.style.display = 'none';
        renderEstadisticas();
    }
    window._intervaloCtx = 'op';

    function abrirModalIntervalo() {
        window._intervaloCtx = 'op';
        document.getElementById('modalIntervaloTiempo').style.display = 'flex';
    }
    function abrirModalIntervaloEst() {
        window._intervaloCtx = 'est';
        document.getElementById('modalIntervaloTiempo').style.display = 'flex';
    }
    function cerrarModalIntervalo() {
        document.getElementById('modalIntervaloTiempo').style.display = 'none';
    }

    function elegirDiaConCalendario() {
        cerrarModalIntervalo();
        abrirCalAct2('intervalo-dia-valor', function(valor) {
            if (!valor) return;
            const d = new Date(valor + 'T00:00:00');
            const hoy = new Date(); hoy.setHours(0,0,0,0);
            let label;
            if (d.toDateString() === hoy.toDateString()) {
                label = 'Hoy';
            } else {
                label = d.toLocaleDateString('es-ES', { weekday:'short', day:'numeric', month:'long', year:'numeric' });
                label = label.charAt(0).toUpperCase() + label.slice(1);
            }
            if (window._intervaloCtx === 'gym') {
                const diffMs = d.getTime() - hoy.getTime();
                const offset = Math.round(diffMs / 86400000);
                const el = document.getElementById('gym-intervalo-label');
                if (el) { el.dataset.filtro = 'dia'; el.dataset.offset = String(offset); el.textContent = label; }
                if (typeof gymCargarStatsParaIntervalo === 'function') gymCargarStatsParaIntervalo();
                return;
            }
            window._opNavDesde = new Date(d); window._opNavDesde.setHours(0,0,0,0);
            window._opNavHasta = new Date(d); window._opNavHasta.setHours(23,59,59,999);
            window._opNavOffset = 0;
            window._opFiltro = 'dia';
            const labelEl = document.getElementById('op-intervalo-label');
            if (labelEl) labelEl.textContent = label;
            renderHistorialOperaciones();
        });
    }

    function abrirModalIntervaloTareas() {
        window._intervaloCtx = 'tareas';
        document.getElementById('modalIntervaloTiempo').style.display = 'flex';
        setTimeout(function() {
            const el = document.getElementById('tareas-intervalo-label');
            const filtroActual = el ? (el.dataset.filtro || 'mes') : 'mes';
            if (typeof _marcarBtnIntervaloActivo === 'function') _marcarBtnIntervaloActivo(filtroActual);
        }, 0);
    }
    function _setTareasFiltroIntervalo(filtro, label) {
        const el = document.getElementById('tareas-intervalo-label');
        if (el) { el.dataset.filtro = filtro; el.dataset.offset = '0'; el.textContent = label; }
        renderTareasSection();
    }
    function tareasNavIntervalo(dir) {
        const el = document.getElementById('tareas-intervalo-label');
        if (!el) return;
        const filtro = el.dataset.filtro || 'mes';
        if (filtro === 'todo' || filtro === 'rango') return;
        const offset = (parseInt(el.dataset.offset) || 0) + dir;
        el.dataset.offset = offset;
        el.textContent = _calcIntervaloLabel(filtro, offset);
        renderTareasSection();
    }
    function abrirModalIntervaloGym() {
        window._intervaloCtx = 'gym';
        document.getElementById('modalIntervaloTiempo').style.display = 'flex';
        setTimeout(function() {
            const el = document.getElementById('gym-intervalo-label');
            const filtroActual = el ? (el.dataset.filtro || 'dia') : 'dia';
            if (typeof _marcarBtnIntervaloActivo === 'function') _marcarBtnIntervaloActivo(filtroActual);
        }, 0);
    }
    function abrirModalIntervaloDiario() {
        window._intervaloCtx = 'diario';
        document.getElementById('modalIntervaloTiempo').style.display = 'flex';
        setTimeout(function() {
            const el = document.getElementById('diario-intervalo-label');
            const filtroActual = el ? (el.dataset.filtro || 'dia') : 'dia';
            if (typeof _marcarBtnIntervaloActivo === 'function') _marcarBtnIntervaloActivo(filtroActual);
        }, 0);
    }

    function _calcIntervaloLabel(filtro, offset) {
        const now = new Date();
        if (filtro === 'semana') {
            const lun = new Date(now);
            lun.setDate(now.getDate() - ((now.getDay()+6)%7) + offset * 7);
            lun.setHours(0,0,0,0);
            const dom = new Date(lun); dom.setDate(lun.getDate() + 6);
            const fmt = d => d.toLocaleDateString('es-ES', { day:'2-digit', month:'short' });
            return fmt(lun) + ' - ' + fmt(dom);
        } else if (filtro === 'mes') {
            const dm = new Date(now.getFullYear(), now.getMonth() + offset, 1);
            const m = dm.toLocaleDateString('es-ES', { month:'long', year:'numeric' });
            return m.charAt(0).toUpperCase() + m.slice(1);
        } else if (filtro === 'dia') {
            const dd = new Date(now); dd.setDate(now.getDate() + offset);
            const hoy = new Date(); hoy.setHours(0,0,0,0);
            if (dd.toDateString() === hoy.toDateString()) {
                return 'Hoy';
            } else {
                const l = dd.toLocaleDateString('es-ES', { weekday:'short', day:'numeric', month:'long' });
                return l.charAt(0).toUpperCase() + l.slice(1);
            }
        } else if (filtro === 'ano') {
            return 'Año ' + (now.getFullYear() + offset);
        }
        return '';
    }

    function _setGymFiltroIntervalo(filtro, label) {
        const el = document.getElementById('gym-intervalo-label');
        if (el) { el.dataset.filtro = filtro; el.dataset.offset = '0'; el.textContent = label; }
        if (typeof gymCargarStatsParaIntervalo === 'function') gymCargarStatsParaIntervalo();
    }
    function _setDiarioFiltroIntervalo(filtro, label) {
        const el = document.getElementById('diario-intervalo-label');
        if (el) { el.dataset.filtro = filtro; el.dataset.offset = '0'; el.textContent = label; }
    }

    function gymNavIntervalo(dir) {
        const el = document.getElementById('gym-intervalo-label');
        if (!el) return;
        const filtro = el.dataset.filtro || 'dia';
        if (filtro === 'todo' || filtro === 'rango') return;
        const offsetActual = parseInt(el.dataset.offset) || 0;
        if (filtro === 'dia' && typeof gymGuardarSesionDia === 'function') {
            gymGuardarSesionDia(_gymFechaKey(offsetActual));
        }
        const offset = offsetActual + dir;
        el.dataset.offset = offset;
        el.textContent = _calcIntervaloLabel(filtro, offset);
        const fechaEl = document.getElementById('gym-fecha-hoy');
        if (fechaEl && filtro === 'dia') {
            const d = new Date(); d.setDate(d.getDate() + offset);
            const full = d.toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
            fechaEl.textContent = full.charAt(0).toUpperCase() + full.slice(1);
        }
        _gymActualizarBtnAnadir(filtro, offset);
        if (typeof gymCargarStatsParaIntervalo === 'function') gymCargarStatsParaIntervalo();
    }
    function _gymActualizarBtnAnadir(filtro, offset) {
        if (typeof _GYM_ALLOW_ADD_HISTORIAL === 'undefined' || _GYM_ALLOW_ADD_HISTORIAL) return;
        var btn = document.querySelector('#gym-botones-edicion button[onclick="abrirNuevoEjercicio()"]');
        if (!btn) return;
        btn.style.opacity = '';
        btn.style.pointerEvents = '';
        btn.title = '';
    }
    function diarioNavIntervalo(dir) {
        const el = document.getElementById('diario-intervalo-label');
        if (!el) return;
        const filtro = el.dataset.filtro || 'dia';
        if (filtro === 'todo' || filtro === 'rango') return;
        const offset = (parseInt(el.dataset.offset) || 0) + dir;
        el.dataset.offset = offset;
        el.textContent = _calcIntervaloLabel(filtro, offset);
        if (typeof renderDiario === 'function') renderDiario();
    }

    function elegirIntervalo(filtro) {
        const now = new Date();
        let label = '';
        if (filtro === 'mes') {
            const mes = now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
            label = mes.charAt(0).toUpperCase() + mes.slice(1);
        } else if (filtro === 'semana') {
            const lun = new Date(now); lun.setDate(now.getDate() - ((now.getDay()+6)%7)); lun.setHours(0,0,0,0);
            const dom = new Date(lun); dom.setDate(lun.getDate() + 6);
            const fmt = d => d.toLocaleDateString('es-ES', { day:'2-digit', month:'short' });
            label = fmt(lun) + ' - ' + fmt(dom);
        } else if (filtro === 'dia') {
            label = 'Hoy';
        } else if (filtro === 'ano') {
            label = 'Año ' + now.getFullYear();
        } else if (filtro === 'todo') {
            label = 'Todo el tiempo';
        } else if (filtro === 'rango') {
            cerrarModalIntervalo();
            abrirModalRangoFechas();
            return;
        }
        if (window._intervaloCtx === 'est') {
            setEstFiltroIntervalo(filtro, label);
        } else if (window._intervaloCtx === 'gym') {
            _setGymFiltroIntervalo(filtro, label);
        } else if (window._intervaloCtx === 'diario') {
            _setDiarioFiltroIntervalo(filtro, label);
        } else if (window._intervaloCtx === 'tareas') {
            _setTareasFiltroIntervalo(filtro, label);
        } else {
            setOpFiltro(filtro, label);
        }
        cerrarModalIntervalo();
    }

    function abrirModalRangoFechas() {
        document.getElementById('modalRangoFechas').style.display = 'flex';
    }
    function cerrarModalRangoFechas() {
        document.getElementById('modalRangoFechas').style.display = 'none';
    }
    function aplicarRangoFechas() {
        const desde = document.getElementById('rango-desde').value;
        const hasta = document.getElementById('rango-hasta').value;
        if (!desde && !hasta) return;
        const fmt = v => v ? new Date(v).toLocaleDateString('es-ES', {day:'numeric',month:'short'}) : '?';
        const label = fmt(desde) + ' → ' + fmt(hasta);
        if (window._intervaloCtx === 'gym') {
            window._gymRangoDesde = desde;
            window._gymRangoHasta = hasta;
            if (typeof _setGymFiltroIntervalo === 'function') _setGymFiltroIntervalo('rango', label);
        } else if (window._intervaloCtx === 'est') {
            document.getElementById('est-fecha-desde').value = desde;
            document.getElementById('est-fecha-hasta').value = hasta;
            setEstFiltroIntervalo('rango', label);
        } else {
            document.getElementById('op-fecha-desde').value = desde;
            document.getElementById('op-fecha-hasta').value = hasta;
            setOpFiltro('rango', label);
        }
        cerrarModalRangoFechas();
    }

    function setEstFiltro(btn) {
        window._estFiltro = btn.dataset.filtro;
        document.querySelectorAll('#est-filtros .op-filtro-btn').forEach(b => b.classList.remove('op-filtro-active'));
        btn.classList.add('op-filtro-active');
        const rango = document.getElementById('est-rango-fechas');
        if (rango) rango.style.display = window._estFiltro === 'rango' ? 'flex' : 'none';
        renderEstadisticas();
    }

    function _getOpCuentaNombre(op) {
        const cuentas = typeof _getCuentasTraspaso === 'function' ? _getCuentasTraspaso() : [];
        if (op.accountId !== null && op.accountId !== undefined) {
            const c = cuentas[op.accountId];
            return c ? c.nombre : ('Cuenta ' + (op.accountId + 1));
        }
        return null;
    }

    function _getOpCuentaDestNombre(op) {
        if (!op.destAccountId && op.destAccountId !== 0) return null;
        const cuentas = typeof _getCuentasTraspaso === 'function' ? _getCuentasTraspaso() : [];
        const c = cuentas[op.destAccountId];
        return c ? c.nombre : ('Cuenta ' + (op.destAccountId + 1));
    }

    function renderHistorialOperaciones() {
        if (!window.finanzasData) return;
        if (typeof _ejecutarProgramadosVencidos === 'function') _ejecutarProgramadosVencidos();
        const ops = filtrarOperacionesPorPeriodo(
            [...window.finanzasData.operaciones].sort((a,b) => new Date(b.date)-new Date(a.date)),
            window._opFiltro, 'op-fecha-desde', 'op-fecha-hasta'
        );
        const programados = (window.finanzasData.programados || []).map(p => ({
            ...p, _isProgramado: true,
            date: p.scheduledDate + 'T12:00:00.000Z'
        })).sort((a,b) => new Date(a.date)-new Date(b.date));
        const allItems = [...ops, ...programados].sort((a,b) => new Date(b.date)-new Date(a.date));

        const saldo = calcularSaldoTotal();
        const saldoEl = document.getElementById('op-saldo-valor');
        if (saldoEl) { saldoEl.textContent = fmtFinanza(saldo); saldoEl.style.color = 'white'; }

        const container = document.getElementById('op-historial');
        if (!container) return;

        if (ops.length === 0 && programados.length === 0) {
            container.innerHTML = '<div style=\"background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:40px;text-align:center;\"><span class=\"material-symbols-rounded\" style=\"font-size:48px;color:#334155;display:block;margin-bottom:12px;\">receipt_long</span><p style=\"color:#475569;font-size:14px;margin:0;\">Sin operaciones en este periodo</p><p style=\"color:#334155;font-size:12px;margin:4px 0 0 0;\">Añade un gasto o ingreso para empezar</p></div>';
            return;
        }

        container.innerHTML = '';
        const grupos = {};
        allItems.forEach(op => {
            const d = new Date(op.date);
            const key = d.toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
            if (!grupos[key]) grupos[key] = [];
            grupos[key].push(op);
        });

        Object.entries(grupos).forEach(([fecha, items]) => {
            const _balDia = items.reduce((acc, op) => {
                if (op._isProgramado) return acc;
                if (op.type === 'INCOME') return acc + op.amount;
                if (op.type === 'EXPENSE') return acc - op.amount;
                return acc;
            }, 0);
            const _balColor = _balDia > 0 ? '#10b981' : _balDia < 0 ? '#ef4444' : '#475569';
            const _balStr = (_balDia > 0 ? '+' : _balDia < 0 ? '-' : '') + fmtFinanza(Math.abs(_balDia));

            const hdr = document.createElement('div');
            hdr.className = 'op-date-header';
            hdr.style.cssText = 'display:flex;align-items:center;justify-content:space-between;';
            hdr.innerHTML = `<span>${fecha.charAt(0).toUpperCase() + fecha.slice(1)}</span><span style="color:${_balColor};font-size:13px;font-weight:700;font-family:inherit;text-transform:uppercase;letter-spacing:0.08em;">${_balStr}</span>`;
            container.appendChild(hdr);

            items.forEach(op => {
                if (op._isProgramado) {
                    const pCat = window.finanzasData.categorias.find(c => c.id === op.categoryId) || {};
                    const pIsIncome = op.type === 'INCOME';
                    const pColor = pCat.color || (pIsIncome ? '#10b981' : '#ef4444');
                    const pRow = document.createElement('div');
                    pRow.className = 'op-item op-item-programado';
                    pRow.style.cursor = 'pointer';
                    const _pId = op.id;
                    pRow.onclick = () => abrirModalEditarProgramado(_pId);
                    const pSigno = pIsIncome ? '+' : '-';
                    const pSignColor = pIsIncome ? '#6ee7b7' : '#fca5a5';
                    pRow.innerHTML = `
                        <div style="display:flex;align-items:center;gap:12px;width:100%;">
                            <div class="op-item-icon" style="background:rgba(71,85,105,0.2);flex-shrink:0;border:1.5px dashed rgba(100,116,139,0.4);overflow:hidden;display:flex;align-items:center;justify-content:center;filter:grayscale(1);opacity:0.6;">
                                ${pCat.id ? _catIconHTML(pCat, 20) : `<span class="material-symbols-rounded" style="font-size:20px;color:#64748b;">schedule_send</span>`}
                            </div>
                            <div style="flex:1;min-width:0;">
                                <div style="color:#64748b;font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;gap:6px;">
                                    <span style="overflow:hidden;text-overflow:ellipsis;">${op.note || (pIsIncome ? 'Ingreso' : 'Gasto')}</span>
                                    ${op.subtag ? `<span style="flex-shrink:0;padding:1px 7px;border-radius:20px;font-size:10px;font-weight:700;background:${pColor}22;color:${pColor};border:1px solid ${pColor}44;">${op.subtag}</span>` : ''}
                                </div>
                                <div style="color:#475569;font-size:11px;margin-top:2px;display:flex;align-items:center;gap:4px;flex-wrap:wrap;">
                                    <span class="material-symbols-rounded" style="font-size:14px;position:relative;top:0.5px;">schedule</span>
                                    Programado · ${new Date(op.scheduledDate + 'T00:00:00').toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'})}
                                    ${op.comment ? ` · <span style="font-style:italic;">${op.comment}</span>` : ''}
                                </div>
                            </div>
                            <div style="color:#475569;font-size:15px;font-weight:800;flex-shrink:0;">${pSigno}${fmtFinanza(op.amount)}</div>
                        </div>
                    `;
                    container.appendChild(pRow);
                    return;
                }
                const cat = window.finanzasData.categorias.find(c => c.id === op.categoryId) || {};
                const isTransfer = op.type === 'TRANSFER';
                const isIncome = op.type === 'INCOME';
                const catColor = cat.color || (isTransfer ? '#818cf8' : (isIncome ? '#10b981' : '#ef4444'));
                const color = catColor;
                const _hexToRgb = h => { const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h); return r ? parseInt(r[1],16)+','+parseInt(r[2],16)+','+parseInt(r[3],16) : (isTransfer?'129,140,248':(isIncome?'16,185,129':'239,68,68')); };
                const bgColor = _hexToRgb(catColor);
                const cuentaOrigen = _getOpCuentaNombre(op);
                const cuentaDest = _getOpCuentaDestNombre(op);

                const row = document.createElement('div');
                row.className = 'op-item';
                row.style.cursor = 'pointer';
                const _opId = op.id;
                row.onclick = (e) => {
                    if (window.innerWidth >= 768) { abrirModalEditarOp(_opId); }
                };
                if (true) {
                    let _lpTimer = null;
                    let _lpFired = false;
                    let _lpStartX = 0, _lpStartY = 0;
                    row.addEventListener('pointerdown', (e) => {
                        if (window.innerWidth >= 768) return;
                        _lpFired = false;
                        _lpStartX = e.clientX; _lpStartY = e.clientY;
                        _lpTimer = setTimeout(() => {
                            _lpFired = true;
                            if (navigator.vibrate) navigator.vibrate(40);
                            abrirModalEditarOp(_opId);
                        }, 500);
                    });
                    row.addEventListener('pointerup', () => { clearTimeout(_lpTimer); });
                    row.addEventListener('pointercancel', () => { clearTimeout(_lpTimer); });
                    row.addEventListener('pointermove', (e) => {
                        if (Math.abs(e.clientX - _lpStartX) > 10 || Math.abs(e.clientY - _lpStartY) > 10) {
                            clearTimeout(_lpTimer);
                        }
                    });
                    row.addEventListener('click', (e) => {
                        if (window.innerWidth >= 768 || _lpFired) return;
                        const descEl = document.getElementById('opdesc_' + _opId);
                        if (descEl) { descEl.style.display = descEl.style.display === 'none' ? 'block' : 'none'; }
                    });
                }

                const _hora = new Date(op.date).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
                const _isMobile = window.innerWidth < 768;
                if (op.type === 'ADJUST') {
                    const _adjustPos = (op.adjustDiff || 0) >= 0;
                    const _cuentaBadgeAdj = op.note ? `<span style="color:#94a3b8;font-size:10px;font-weight:700;background:rgba(71,85,105,0.2);border:1.5px solid rgba(71,85,105,0.4);border-radius:6px;padding:2px 7px;white-space:nowrap;">${op.note}</span>` : '';
                    if (_isMobile) {
                        row.innerHTML = `
                            <div style="display:flex;align-items:center;gap:12px;width:100%;">
                                <div class="op-item-icon" style="background:#334155;flex-shrink:0;">
                                    <span class="material-symbols-rounded" style="font-size:20px;color:#ffffff;">build</span>
                                </div>
                                <div style="flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:2px;">
                                    <span style="color:#f1f5f9;font-weight:700;font-size:13px;white-space:nowrap;">Ajuste</span>
                                </div>
                                <div style="display:flex;flex-direction:column;align-items:flex-end;justify-content:center;gap:2px;flex-shrink:0;">
                                    <div style="display:flex;align-items:baseline;gap:5px;">
                                        <span style="color:#475569;font-size:10px;">${_hora}</span>
                                        <span style="color:#64748b;font-size:15px;font-weight:900;font-family:Manrope,sans-serif;">${_adjustPos?'+':'-'}${fmtFinanza(op.amount)}</span>
                                    </div>
                                    ${_cuentaBadgeAdj ? `<div style="display:flex;align-items:center;gap:4px;justify-content:flex-end;">${_cuentaBadgeAdj}</div>` : ''}
                                </div>
                            </div>
                            ${op.comment ? `<div id="opdesc_${op.id}" style="display:none;width:100%;margin-top:-1px;margin-left:54px;"><span style="color:#64748b;font-size:11px;font-style:italic;display:block;word-break:break-word;">${op.comment}</span></div>` : ''}
                        `;
                    } else {
                        row.innerHTML = `
                            <div class="op-item-icon" style="background:#334155;flex-shrink:0;">
                                <span class="material-symbols-rounded" style="font-size:20px;color:#ffffff;">build</span>
                            </div>
                            <div style="flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:2px;">
                                <span style="color:#f1f5f9;font-weight:700;font-size:13px;white-space:nowrap;">Ajuste</span>
                                ${op.comment ? `<span style="color:#64748b;font-size:11px;font-style:italic;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${op.comment}</span>` : ''}
                            </div>
                            <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;align-self:center;">
                                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;">
                                    <div style="display:flex;align-items:center;gap:6px;">
                                        ${_cuentaBadgeAdj}
                                        <span style="color:#64748b;font-size:15px;font-weight:900;font-family:Manrope,sans-serif;">${_adjustPos?'+':'-'}${fmtFinanza(op.amount)}</span>
                                    </div>
                                    <span style="color:#334155;font-size:10px;">${_hora}</span>
                                </div>
                            </div>
                        `;
                    }
                } else if (isTransfer) {
                    const _fromBadge = op.fromAccountName ? `<span style="color:#94a3b8;font-size:10px;font-weight:700;background:rgba(71,85,105,0.2);border:1.5px solid rgba(71,85,105,0.4);border-radius:6px;padding:2px 7px;white-space:nowrap;">${op.fromAccountName}</span>` : '';
                    const _toBadge   = op.toAccountName   ? `<span style="color:#94a3b8;font-size:10px;font-weight:700;background:rgba(71,85,105,0.2);border:1.5px solid rgba(71,85,105,0.4);border-radius:6px;padding:2px 7px;white-space:nowrap;">${op.toAccountName}</span>` : '';
                    if (_isMobile) {
                        const _notaTransfer = op.comment || '';
                        row.innerHTML = `
                            <div style="display:flex;align-items:center;gap:12px;width:100%;">
                                <div class="op-item-icon" style="background:#334155;flex-shrink:0;">
                                    <span class="material-symbols-rounded" style="font-size:20px;color:#fff;">swap_horiz</span>
                                </div>
                                <div style="flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:2px;">
                                    <span style="color:#f1f5f9;font-weight:700;font-size:13px;white-space:nowrap;">Traspaso</span>
                                </div>
                                <div style="display:flex;flex-direction:column;align-items:flex-end;justify-content:center;gap:2px;flex-shrink:0;">
                                    <div style="display:flex;align-items:baseline;gap:5px;">
                                        <span style="color:#475569;font-size:10px;">${_hora}</span>
                                        <span style="color:#64748b;font-size:15px;font-weight:900;font-family:Manrope,sans-serif;">${fmtFinanza(op.amount)}</span>
                                    </div>
                                    ${(_fromBadge || _toBadge) ? `<div style="display:flex;align-items:center;gap:4px;justify-content:flex-end;">${_fromBadge}${(_fromBadge && _toBadge) ? '<span style="color:#475569;font-size:10px;">-</span>' : ''}${_toBadge}</div>` : ''}
                                </div>
                            </div>
                            ${_notaTransfer ? `<div id="opdesc_${op.id}" style="display:none;width:100%;margin-top:-1px;margin-left:54px;"><span style="color:#64748b;font-size:11px;font-style:italic;display:block;word-break:break-word;">${_notaTransfer}</span></div>` : ''}
                        `;
                    } else {
                        row.innerHTML = `
                            <div class="op-item-icon" style="background:#334155;flex-shrink:0;">
                                <span class="material-symbols-rounded" style="font-size:20px;color:#fff;">swap_horiz</span>
                            </div>
                            <div style="flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:2px;">
                                <span style="color:#f1f5f9;font-weight:700;font-size:13px;">Traspaso</span>
                                ${op.comment ? `<span style="color:#64748b;font-size:11px;font-style:italic;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${op.comment}</span>` : ''}
                            </div>
                            <div style="display:flex;align-items:center;gap:5px;flex-shrink:0;align-self:center;">
                                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;">
                                    <div style="display:flex;align-items:center;gap:5px;">
                                        ${_fromBadge}
                                        ${(_fromBadge && _toBadge) ? '<span style="color:#475569;font-size:10px;">-</span>' : ''}
                                        ${_toBadge}
                                        <span style="color:#64748b;font-size:15px;font-weight:900;font-family:Manrope,sans-serif;">${fmtFinanza(op.amount)}</span>
                                    </div>
                                    <span style="color:#334155;font-size:10px;">${_hora}</span>
                                </div>
                            </div>
                        `;
                    }
                } else {
                    const _cuentaBadge = cuentaOrigen
                        ? `<span style="color:#94a3b8;font-size:10px;font-weight:700;background:rgba(71,85,105,0.2);border:1.5px solid rgba(71,85,105,0.4);border-radius:6px;padding:2px 7px;white-space:nowrap;">${cuentaOrigen}</span>`
                        : '';
                    const _cuentaBadgeDesktop = cuentaOrigen
                        ? `<span style="color:#94a3b8;font-size:10px;font-weight:700;background:rgba(71,85,105,0.2);border:1.5px solid rgba(71,85,105,0.4);border-radius:6px;padding:2px 7px;white-space:nowrap;">${cuentaOrigen}</span>`
                        : '';
                    const _subtagBadge = op.subtag
                        ? `<span style="padding:2px 7px;border-radius:20px;font-size:10px;font-weight:700;white-space:nowrap;background:${cat.color ? cat.color+'22' : 'rgba(100,116,139,0.15)'};color:${cat.color || '#94a3b8'};border:1px solid ${cat.color ? cat.color+'55' : 'rgba(100,116,139,0.3)'};">${op.subtag}</span>`
                        : '';
                    const _catName = cat.name || (isIncome?'Ingreso':'Gasto');
                    const _nota = op.comment || '';
                    if (_isMobile) {
                        row.innerHTML = `
                            <div style="display:flex;align-items:center;gap:12px;width:100%;">
                                <div class="op-item-icon" style="background:${catColor};flex-shrink:0;">
                                    ${cat?.svgData ? _catIconHTML(cat,20) : `<span class="material-symbols-rounded" style="font-size:20px;color:#fff;">${cat?.icon||(isIncome?'add_circle':'remove_circle')}</span>`}
                                </div>
                                <div style="flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:2px;">
                                    <span style="color:#f1f5f9;font-weight:700;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${_catName}</span>
                                    ${_subtagBadge ? `<div style="display:flex;align-items:center;gap:4px;">${_subtagBadge}</div>` : ''}
                                </div>
                                <div style="display:flex;flex-direction:column;align-items:flex-end;justify-content:center;gap:2px;flex-shrink:0;">
                                    <div style="display:flex;align-items:baseline;gap:5px;">
                                        <span style="color:#475569;font-size:10px;">${_hora}</span>
                                        <span style="color:${isIncome?'#10b981':'#ef4444'};font-size:15px;font-weight:900;font-family:Manrope,sans-serif;">${isIncome?'+':'-'}${fmtFinanza(op.amount)}</span>
                                    </div>
                                    ${_cuentaBadge ? `<div style="display:flex;justify-content:flex-end;">${_cuentaBadge}</div>` : ''}
                                </div>
                            </div>
                            ${_nota ? `<div id="opdesc_${op.id}" style="display:none;width:100%;margin-top:-1px;margin-left:54px;"><span style="color:#64748b;font-size:11px;font-style:italic;display:block;word-break:break-word;">${_nota}</span></div>` : ''}
                        `;
                    } else {
                        row.innerHTML = `
                            <div class="op-item-icon" style="background:${catColor};flex-shrink:0;">
                                ${cat?.svgData ? _catIconHTML(cat,20) : `<span class="material-symbols-rounded" style="font-size:20px;color:#fff;">${cat?.icon||(isIncome?'add_circle':'remove_circle')}</span>`}
                            </div>
                            <div style="flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:2px;">
                                <div style="display:flex;align-items:center;gap:5px;min-width:0;overflow:hidden;">
                                    <span style="color:#f1f5f9;font-weight:700;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${_catName}</span>
                                    ${_subtagBadge}
                                </div>
                                ${_nota ? `<span style="color:#64748b;font-size:11px;font-style:italic;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${_nota}</span>` : ''}
                            </div>
                            <div style="display:flex;align-items:center;gap:5px;flex-shrink:0;align-self:center;">
                                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;">
                                    <div style="display:flex;align-items:center;gap:5px;">
                                        ${_cuentaBadgeDesktop}
                                        <span style="color:${isIncome?'#10b981':'#ef4444'};font-size:15px;font-weight:900;font-family:Manrope,sans-serif;">${isIncome?'+':'-'}${fmtFinanza(op.amount)}</span>
                                    </div>
                                    <span style="color:#334155;font-size:10px;">${_hora}</span>
                                </div>
                            </div>
                        `;
                    }
                }
                container.appendChild(row);
            });
        });
        if (typeof _actualizarBadgeFiltro === 'function') _actualizarBadgeFiltro();
    }

    function duplicarOp(id) {
        const op = window.finanzasData.operaciones.find(o => o.id === id);
        if (!op) return;
        const nueva = { ...op, id: 'op_' + Date.now(), date: new Date().toISOString(), createdAt: new Date().toISOString() };
        window.finanzasData.operaciones.push(nueva);
        guardarFinanzasData();
        renderHistorialOperaciones();
    }

    function eliminarOp(id) {
        if (!confirm('¿Eliminar este movimiento?')) return;
        window.finanzasData.operaciones = window.finanzasData.operaciones.filter(o => o.id !== id);
        guardarFinanzasData();
        renderHistorialOperaciones();
        renderEstadisticas();
    }

    window._estTabActivo = 'gastos'; // 'gastos' | 'ingresos'

    function estSwitchTab(tab) {
        window._estTabActivo = tab;
        const btnG = document.getElementById('est-sw-gastos');
        const btnI = document.getElementById('est-sw-ingresos');
        const valG = document.getElementById('est-sw-gastos-val');
        const valI = document.getElementById('est-sw-ingresos-val');
        if (btnG && btnI) {
            btnG.classList.remove('est-sw-on','est-sw-off');
            btnI.classList.remove('est-sw-on','est-sw-off');
            void btnG.offsetWidth; // reflow para relanzar animación
            if (tab === 'gastos') {
                btnG.classList.add('est-sw-on');
                btnI.classList.add('est-sw-off');
                if (valG) { valG.style.color = '#ff5555'; }
                if (valI) { valI.style.color = '#475569'; }
            } else {
                btnI.classList.add('est-sw-on');
                btnG.classList.add('est-sw-off');
                if (valI) { valI.style.color = '#00e676'; }
                if (valG) { valG.style.color = '#475569'; }
            }
        }
        const ops = filtrarOperacionesPorPeriodo(window.finanzasData?.operaciones || [], window._estFiltro, 'est-fecha-desde', 'est-fecha-hasta');
        renderCatBars(ops);
    }
    function renderEstadisticas() {
        if (!window.finanzasData) return;
        const ops = filtrarOperacionesPorPeriodo(
            window.finanzasData.operaciones,
            window._estFiltro, 'est-fecha-desde', 'est-fecha-hasta'
        );

        const saldo = calcularSaldoTotal();
        const saldoEl = document.getElementById('est-saldo-valor');
        if (saldoEl) { saldoEl.textContent = fmtFinanza(saldo); saldoEl.style.color = 'white'; }

        const totalGastos   = ops.filter(o=>o.type==='EXPENSE').reduce((s,o)=>s+o.amount,0);
        const totalIngresos = ops.filter(o=>o.type==='INCOME').reduce((s,o)=>s+o.amount,0);
        const tgEl = document.getElementById('est-total-gastos');
        const tiEl = document.getElementById('est-total-ingresos');
        if (tgEl) tgEl.textContent = fmtFinanza(totalGastos);
        if (tiEl) tiEl.textContent = fmtFinanza(totalIngresos);
        const swG = document.getElementById('est-sw-gastos-val');
        const swI = document.getElementById('est-sw-ingresos-val');
        if (swG) swG.textContent = fmtFinanza(totalGastos);
        if (swI) swI.textContent = fmtFinanza(totalIngresos);
        const tabAct = window._estTabActivo || 'gastos';
        if (swG) swG.style.color = tabAct === 'gastos'   ? '#ff5555' : '#475569';
        if (swI) swI.style.color = tabAct === 'ingresos' ? '#00e676' : '#475569';
        const neto = totalIngresos - totalGastos;
        const netoEl = document.getElementById('est-flujo-neto');
        if (netoEl) { netoEl.textContent = fmtFinanza(neto); netoEl.style.color = neto >= 0 ? '#10b981' : '#ef4444'; }

        const total = totalGastos + totalIngresos;
        const pctG = total > 0 ? (totalGastos/total*100) : 0;
        const pctI = total > 0 ? (totalIngresos/total*100) : 0;
        const circle = document.getElementById('est-flujo-circle');
        const pctLabel = document.getElementById('est-flujo-pct');
        const circumference = 2 * Math.PI * 23; // r=23
        if (circle && pctLabel) {
            const pctShow = total > 0 ? Math.round(pctI) : 0;
            const offset = circumference - (circumference * pctShow / 100);
            circle.style.strokeDashoffset = offset;
            circle.style.stroke = pctShow >= 50 ? '#10b981' : '#f97316';
            pctLabel.textContent = pctShow + '%';
        }
        renderCatBars(ops);
    }

    function renderCatBars(ops) {
        const isMobileView = window.innerWidth < 768;
        const tabActivo = window._estTabActivo || 'gastos';

        function buildRows(entries, maxAmt, container) {
            if (!container) return;
            container.innerHTML = '';
            if (entries.length === 0) {
                const _isInc = container.id && container.id.includes('ingresos');
                const _isGas = container.id && container.id.includes('gastos');
                const _emIcon = _isInc ? 'add_circle' : _isGas ? 'remove_circle' : 'bar_chart';
                const _emTxt  = _isInc ? 'Sin ingresos en este periodo' : _isGas ? 'Sin gastos en este periodo' : 'Sin datos en este periodo';
                container.innerHTML = `<div style="background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:40px;text-align:center;"><span class="material-symbols-rounded" style="font-size:48px;color:#334155;display:block;margin-bottom:12px;">${_emIcon}</span><p style="color:#475569;font-size:14px;margin:0;">${_emTxt}</p><p style="color:#334155;font-size:12px;margin:4px 0 0 0;">Importa o añade operaciones para ver estadísticas</p></div>`;
                return;
            }
            entries.forEach(e => {
                const isIncome = e.type === 'INCOME';
                const color = e.cat.color || (isIncome ? '#10b981' : '#ef4444');
                const pct = (e.amount / maxAmt * 100).toFixed(1);
                const totalOfType = entries.reduce((s,x)=>s+x.amount,0);
                const pctOfType = totalOfType > 0 ? (e.amount/totalOfType*100).toFixed(0) : 0;
                const iconContent = e.cat.iconoImagen
                    ? `<img src="${e.cat.iconoImagen}" style="width:24px;height:24px;border-radius:6px;object-fit:cover;">`
                    : (e.cat?.svgData ? `<svg viewBox="${e.cat.svgData.vb}" width="20" height="20" style="fill:${e.cat.iconColor||'#fff'};" xmlns="http://www.w3.org/2000/svg">${e.cat.svgData.svg}</svg>` : `<span class="material-symbols-rounded" style="font-size:20px;color:white;">${e.cat.icon||'category'}</span>`);
                const catOps = ops.filter(o => o.categoryId === e.cat.id && o.type === e.type)
                    .sort((a,b) => new Date(b.date)-new Date(a.date));
                const etiquetas = [...new Set(catOps.flatMap(o => o.etiquetas||[]))];

                const detId = 'est-cat-det-' + (e.cat.id||'sin') + '-' + e.type;

                const opsHTML = catOps.map(op => {
                    const fecha = new Date(op.date).toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'2-digit'});
                    const etStr = (op.etiquetas||[]).map(et=>`<span style="background:${color}22;color:${color};border:1px solid ${color}44;border-radius:6px;padding:1px 6px;font-size:10px;">${et}</span>`).join('');
                    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);gap:8px;">
                        <div style="flex:1;min-width:0;">
                            <div style="color:#e2e8f0;font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${op.note||op.comment||'Sin descripción'}</div>
                            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:3px;">${etStr}</div>
                        </div>
                        <div style="flex-shrink:0;text-align:right;">
                            <div style="color:${isIncome?'#10b981':'#ef4444'};font-size:12px;font-weight:800;font-family:Manrope,sans-serif;">${fmtFinanza(op.amount)}</div>
                            <div style="color:#475569;font-size:10px;">${fecha}</div>
                        </div>
                    </div>`;
                }).join('');

                const etiquetasHTML = etiquetas.length > 0
                    ? `<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;">${etiquetas.map(et=>`<span style="background:${color}22;color:${color};border:1px solid ${color}44;border-radius:8px;padding:3px 8px;font-size:11px;font-weight:600;">${et}</span>`).join('')}</div>`
                    : '';

                const row = document.createElement('div');
                row.style.cssText = `background:rgba(15,23,42,0.6);border:1px solid ${color}33;border-radius:14px;overflow:hidden;cursor:pointer;`;
                row.innerHTML = `
                    <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;">
                        <div style="width:40px;height:40px;border-radius:12px;background:${color};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                            ${iconContent}
                        </div>
                        <div style="flex:1;min-width:0;">
                            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px;">
                                <span style="color:#e2e8f0;font-size:13px;font-weight:700;">${e.cat.name||'Sin categoría'}</span>
                                <span style="color:${isIncome?'#10b981':'#ef4444'};font-size:13px;font-weight:800;font-family:Manrope,sans-serif;">${fmtFinanza(e.amount)}</span>
                            </div>
                            <div style="position:relative;background:rgba(255,255,255,0.06);border-radius:6px;height:6px;overflow:visible;">
                                <div style="height:100%;background:${color};border-radius:6px;width:${pct}%;transition:width 0.5s ease;position:relative;">
                                    <div style="position:absolute;right:-3px;top:-3px;width:12px;height:12px;border-radius:50%;background:${color};border:2px solid rgba(15,23,42,0.8);box-shadow:0 0 6px ${color}88;"></div>
                                </div>
                            </div>
                            <div style="color:#64748b;font-size:11px;font-weight:600;margin-top:4px;text-align:right;">${catOps.length} op · ${pctOfType}%</div>
                        </div>
                    </div>`;

                (function(cat, color, isIncome, amount, catOps, etiquetas, iconContent, totalOfType) {
                    row.addEventListener('click', function() {
                        _abrirModalCatEst({
                            name: cat.name || 'Sin categoría',
                            iconContent: iconContent,
                            color: color,
                            isIncome: isIncome,
                            amount: amount,
                            totalOfType: totalOfType,
                            catOps: catOps.map(function(o){ return {note:o.note||o.comment||'',amount:o.amount,date:o.date,etiquetas:o.etiquetas||[],subtag:o.subtag||'',comment:o.comment||''}; }),
                            etiquetas: etiquetas,
                            categoryId: cat.id
                        });
                    });
                })(e.cat, color, isIncome, e.amount, catOps, etiquetas, iconContent, totalOfType);

                container.appendChild(row);
            });
        }
        const byCat = {};
        ops.forEach(op => {
            const k = (op.categoryId || '__sin__') + '_' + op.type;
            if (!byCat[k]) byCat[k] = { amount:0, type:op.type, cat: window.finanzasData.categorias.find(c=>c.id===op.categoryId)||{} };
            byCat[k].amount += op.amount;
        });
        const allEntries = Object.values(byCat).sort((a,b) => b.amount - a.amount);
        const gastos   = allEntries.filter(e=>e.type==='EXPENSE');
        const ingresos = allEntries.filter(e=>e.type==='INCOME');

        if (isMobileView) {
            const mobileEntries = tabActivo === 'gastos' ? gastos : ingresos;
            const maxAmt = mobileEntries[0]?.amount || 1;
            buildRows(mobileEntries, maxAmt, document.getElementById('est-cat-bars'));
            const titleEl = document.getElementById('est-cat-title');
            if (titleEl) titleEl.textContent = 'Por categoría · ' + (tabActivo === 'gastos' ? 'Gastos' : 'Ingresos');
        } else {
            const maxG = gastos[0]?.amount || 1;
            const maxI = ingresos[0]?.amount || 1;
            buildRows(gastos,   maxG, document.getElementById('est-cat-bars-gastos'));
            buildRows(ingresos, maxI, document.getElementById('est-cat-bars-ingresos'));
        }
    }

    function toggleEstDetalle(tipo) {
        const det = document.getElementById('est-detalle-' + tipo);
        const chev = document.getElementById('est-' + tipo + '-chevron');
        const isOpen = det.style.display !== 'none' && det.style.display !== '';
        ['gastos','ingresos'].forEach(t => {
            const d = document.getElementById('est-detalle-' + t);
            const c = document.getElementById('est-' + t + '-chevron');
            if (d) d.style.display = 'none';
            if (c) c.textContent = 'expand_more';
        });
        if (!isOpen) {
            det.style.display = 'flex';
            if (chev) chev.textContent = 'expand_less';
            window._estDetalleAbierto = tipo;
            const ops = filtrarOperacionesPorPeriodo(window.finanzasData.operaciones, window._estFiltro, 'est-fecha-desde', 'est-fecha-hasta');
            renderEstDetalle(ops, tipo);
        } else {
            window._estDetalleAbierto = null;
        }
    }

    function renderEstDetalle(ops, tipo) {
        const det = document.getElementById('est-detalle-' + tipo);
        if (!det) return;
        det.innerHTML = '';
        const filtered = ops.filter(o => (tipo==='gastos' ? o.type==='EXPENSE' : o.type==='INCOME'))
            .sort((a,b) => new Date(b.date)-new Date(a.date));
        if (filtered.length === 0) {
            det.innerHTML = '<div style="color:#475569;font-size:12px;padding:8px;">Sin operaciones</div>';
            return;
        }
        filtered.forEach(op => {
            const cat = window.finanzasData.categorias.find(c=>c.id===op.categoryId)||{};
            const isInc = op.type==='INCOME';
            const row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05);';
            row.innerHTML = `
                <span class="material-symbols-rounded" style="font-size:16px;color:${cat.color||(isInc?'#10b981':'#ef4444')};">${cat.icon||(isInc?'add_circle':'remove_circle')}</span>
                <div style="flex:1;min-width:0;">
                    <div style="color:#e2e8f0;font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${op.note||cat.name||''}</div>
                    <div style="color:#64748b;font-size:10px;">${new Date(op.date).toLocaleDateString('es-ES')}</div>
                </div>
                <span style="color:${isInc?'#10b981':'#ef4444'};font-size:13px;font-weight:800;font-family:Manrope,sans-serif;flex-shrink:0;">${isInc?'+':'-'}${fmtFinanza(op.amount)}</span>
            `;
            det.appendChild(row);
        });
    }
    window._eopId = null;
    window._eopTipo = 'EXPENSE';
    window._eopCatId = null;
    window._eopOrigenIdx = null;
    window._eopDestinoIdx = null;
    window._eopPanelActivo = null;
    window._eopSelectorTipo = null; // 'origen' | 'destino'

    function abrirModalEditarOp(id) {
        const op = window.finanzasData.operaciones.find(o => o.id === id);
        if (!op) return;
        window._eopId = id;
        window._eopTipo = op.type;
        window._eopCatId = op.categoryId;
        window._eopOrigenIdx = op.accountId !== undefined ? op.accountId : null;
        var _rawDest = op.destAccountId !== undefined ? op.destAccountId
                     : op.toAccountId !== undefined ? op.toAccountId
                     : op.receptorIdx !== undefined ? op.receptorIdx
                     : null;
        if (_rawDest === null && op.toAccountName && typeof _getCuentasTraspaso === 'function') {
            var _cuentasTmp = _getCuentasTraspaso();
            var _found = _cuentasTmp.findIndex(c => c.nombre === op.toAccountName);
            if (_found !== -1) _rawDest = _found;
        }
        window._eopDestinoIdx = _rawDest;
        if (typeof _getCuentasTraspaso === 'function') {
            var _cuentasRes = _getCuentasTraspaso();
            if (window._eopOrigenIdx === null || _cuentasRes[window._eopOrigenIdx] === undefined) {
                var _nombre = op.fromAccountName || null;
                if (_nombre) {
                    var _fOrig = _cuentasRes.findIndex(c => c.nombre === _nombre);
                    if (_fOrig !== -1) window._eopOrigenIdx = _fOrig;
                }
            }
            if (window._eopDestinoIdx === null || _cuentasRes[window._eopDestinoIdx] === undefined) {
                var _nombreDest = op.toAccountName || null;
                if (_nombreDest) {
                    var _fDest = _cuentasRes.findIndex(c => c.nombre === _nombreDest);
                    if (_fDest !== -1) window._eopDestinoIdx = _fDest;
                }
            }
        }

        window._eopSubtag = op.subtag || null;
        window._eopCatIdExpense = null; window._eopCatIdIncome = null;
        window._eopSubtagExpense = null; window._eopSubtagIncome = null;
        const eopInput = document.getElementById('eop-importe');
        eopInput.value = op.amount.toLocaleString('es-ES', {minimumFractionDigits:2,maximumFractionDigits:2});
        eopInput.style.fontSize = '26px';
        document.getElementById('eop-comentario').value = op.comment || '';
        const _transferInput = document.getElementById('eop-comentario-transfer');
        if (_transferInput) _transferInput.value = op.comment || '';
        const d = new Date(op.date);
        const local = new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,16);
        const hidden = document.getElementById('eop-fecha');
        if (hidden) hidden.value = local;
        const dateIn = document.getElementById('eop-fecha-date');
        const timeIn = document.getElementById('eop-fecha-time');
        if (dateIn) dateIn.value = local.slice(0,10);
        if (timeIn) timeIn.value = local.slice(11,16);
        const calPanel = document.getElementById('eop-calendar-panel');
        if (calPanel) calPanel.style.display = 'none';
        const delPanel = document.getElementById('eop-confirm-delete');
        if (delPanel) delPanel.style.display = 'none';
        actualizarFechaDisplay();
        setEopTipo(op.type, false);
        actualizarDisplayCuentas();
        cerrarEopPanel();

        document.getElementById('modalEditarOp').style.display = 'flex';
    }

    function cerrarModalEditarOp() {
        document.getElementById('modalEditarOp').style.display = 'none';
        window._eopId = null;
        cerrarEopPanel();
    }
    function eopClickOrigen() {
        if (window._eopTipo === 'TRANSFER' || window._eopTipo === 'EXPENSE' || window._eopTipo === 'ADJUST') {
            abrirSelectorCuenta('origen');
        } else {
            toggleEopPanel('categoria');
        }
    }
    function eopClickDestino() {
        if (window._eopTipo === 'TRANSFER') {
            abrirSelectorCuenta('destino');
        } else if (window._eopTipo === 'EXPENSE') {
            toggleEopPanel('categoria');
        } else {
            abrirSelectorCuenta('destino');
        }
    }

    function actualizarDisplayCuentas() {
        const cuentas = typeof _getCuentasTraspaso === 'function' ? _getCuentasTraspaso() : [];
        const origen = (window._eopOrigenIdx !== null && window._eopOrigenIdx !== undefined) ? cuentas[window._eopOrigenIdx] : null;
        const _op = window._eopId && window.finanzasData ? window.finanzasData.operaciones.find(o=>o.id===window._eopId) : null;
        const _origenNombre = origen ? origen.nombre : (_op ? (_op.fromAccountName || null) : null);
        const _destinoNombre = (_op ? (_op.toAccountName || null) : null);
        const _findThumbByName = (nombre) => { const c = cuentas.find(x => x.nombre === nombre); return c ? c.thumb : null; };
        const destinoCuentaByName = !cuentas[window._eopDestinoIdx] && _destinoNombre ? { nombre: _destinoNombre, thumb: _findThumbByName(_destinoNombre) } : null;
        const origenCuentaByName = !origen && _origenNombre ? { nombre: _origenNombre, thumb: _findThumbByName(_origenNombre) } : null;
        const catId = window._eopCatId || (window.finanzasData && window._eopId ? (window.finanzasData.operaciones.find(o=>o.id===window._eopId)||{}).categoryId : null);
        const _catRaw = catId && window.finanzasData ? window.finanzasData.categorias.find(c=>c.id===catId) : null;
        const cat = _catRaw && _catRaw.type === window._eopTipo ? _catRaw : null;
        const isIncome = window._eopTipo === 'INCOME';

        const isAdjust = window._eopTipo === 'ADJUST';
        const origenLabel = document.getElementById('eop-col-origen-label');
        const destinoLabel = document.getElementById('eop-col-destino-label');
        const isTransfer = window._eopTipo === 'TRANSFER';
        if (origenLabel) origenLabel.textContent = isIncome ? 'De categoría' : 'De cuenta';
        if (destinoLabel) destinoLabel.textContent = (isTransfer || isIncome) ? 'A cuenta' : 'A categoría';
        const flechaArrow = document.getElementById('eop-flecha');
        const flechaBtn = document.getElementById('eop-flecha-btn');
        if (flechaArrow) { flechaArrow.style.display = isTransfer ? 'none' : 'inline'; }
        if (flechaBtn) { flechaBtn.style.display = isTransfer ? 'flex' : 'none'; }
        const destinoCol = document.getElementById('eop-col-destino');
        if (isAdjust) {
            if (destinoCol) destinoCol.style.display = 'none';
            if (flechaArrow) flechaArrow.style.display = 'none';
            if (flechaBtn) flechaBtn.style.display = 'none';
            if (destinoLabel) destinoLabel.style.display = 'none';
        } else {
            if (destinoCol) destinoCol.style.display = 'flex';
            if (destinoLabel) destinoLabel.style.display = '';
        }
        const origenIconEl = document.getElementById('eop-cuenta-origen-icon');
        const origenNombreEl = document.getElementById('eop-cuenta-origen-nombre');
        const origenWrap = document.getElementById('eop-cuenta-origen-icon-wrap');

        if (isIncome) {
            if (cat) {
                const catIconHtml = cat.iconoImagen
                    ? `<img src="${cat.iconoImagen}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">`
                    : `${_catIconHTML(cat,22)}`;
                if (origenWrap) { origenWrap.style.background = cat.color; origenWrap.style.border = 'none'; origenWrap.innerHTML = catIconHtml; }
                if (origenNombreEl) { origenNombreEl.textContent = cat.name; origenNombreEl.style.color = '#e2e8f0'; }
            } else {
                if (origenWrap) { origenWrap.style.background = 'rgba(30,41,59,0.7)'; origenWrap.style.border = '1px solid rgba(255,255,255,0.07)'; origenWrap.innerHTML = '<span class="material-symbols-rounded" id="eop-cuenta-origen-icon" style="font-size:22px;color:#475569;">category</span>'; }
                if (origenNombreEl) { origenNombreEl.textContent = 'Sin elegir'; origenNombreEl.style.color = '#475569'; }
            }
        } else {
            const origenReal = origen || origenCuentaByName;
            if (origenReal) {
                const thumbEl = origenReal.thumb && typeof _thumbHTML === 'function' ? _thumbHTML(origenReal.thumb, 38) : '';
                if (origenWrap) { origenWrap.style.background = thumbEl ? 'transparent' : 'rgba(30,41,59,0.7)'; origenWrap.style.border = thumbEl ? 'none' : '1px solid rgba(255,255,255,0.07)'; origenWrap.innerHTML = thumbEl || '<span class="material-symbols-rounded" style="font-size:22px;color:#60a5fa;">account_balance</span>'; }
                if (origenNombreEl) { origenNombreEl.textContent = origenReal.nombre; origenNombreEl.style.color = '#e2e8f0'; }
            } else {
                if (origenIconEl) { origenIconEl.textContent = 'account_balance'; origenIconEl.style.color = '#64748b'; }
                if (origenNombreEl) { origenNombreEl.textContent = 'Sin asignar'; origenNombreEl.style.color = '#475569'; }
                if (origenWrap) { origenWrap.style.background = 'rgba(30,41,59,0.7)'; origenWrap.style.border = '1px solid rgba(255,255,255,0.07)'; origenWrap.innerHTML = '<span class="material-symbols-rounded" id="eop-cuenta-origen-icon" style="font-size:22px;color:#64748b;">account_balance</span>'; }
            }
        }
        const destinoIconEl = document.getElementById('eop-destino-icon');
        const destinoNombreEl = document.getElementById('eop-destino-nombre');
        const destinoWrap = document.getElementById('eop-destino-icon-wrap');

        if (isIncome) {
            if (origen) {
                const thumbEl = typeof _thumbHTML === 'function' ? _thumbHTML(origen.thumb, 38) : '';
                if (destinoWrap) { destinoWrap.style.background = 'transparent'; destinoWrap.style.border = 'none'; destinoWrap.innerHTML = thumbEl || '<span class="material-symbols-rounded" style="font-size:22px;color:#60a5fa;">account_balance</span>'; }
                if (destinoNombreEl) { destinoNombreEl.textContent = origen.nombre; destinoNombreEl.style.color = '#60a5fa'; }
            } else {
                if (destinoIconEl) { destinoIconEl.textContent = 'account_balance'; destinoIconEl.style.color = '#475569'; }
                if (destinoNombreEl) { destinoNombreEl.textContent = 'Sin asignar'; destinoNombreEl.style.color = '#475569'; }
                if (destinoWrap) { destinoWrap.style.background = 'rgba(30,41,59,0.7)'; destinoWrap.style.border = '1px solid rgba(255,255,255,0.07)'; destinoWrap.innerHTML = '<span class="material-symbols-rounded" id="eop-destino-icon" style="font-size:22px;color:#475569;">account_balance</span>'; }
            }
        } else if (isTransfer) {
            const destino = (window._eopDestinoIdx !== null && window._eopDestinoIdx !== undefined) ? cuentas[window._eopDestinoIdx] : null;
            const destinoReal = destino || destinoCuentaByName;
            if (destinoReal) {
                const thumbEl = destinoReal.thumb && typeof _thumbHTML === 'function' ? _thumbHTML(destinoReal.thumb, 38) : '';
                if (destinoWrap) { destinoWrap.style.background = thumbEl ? 'transparent' : 'rgba(30,41,59,0.7)'; destinoWrap.style.border = thumbEl ? 'none' : '1px solid rgba(255,255,255,0.07)'; destinoWrap.innerHTML = thumbEl || '<span class="material-symbols-rounded" style="font-size:22px;color:#60a5fa;">account_balance</span>'; }
                if (destinoNombreEl) { destinoNombreEl.textContent = destinoReal.nombre; destinoNombreEl.style.color = '#e2e8f0'; }
            } else {
                if (destinoWrap) { destinoWrap.style.background = 'rgba(30,41,59,0.7)'; destinoWrap.style.border = '1px solid rgba(255,255,255,0.07)'; destinoWrap.innerHTML = '<span class="material-symbols-rounded" id="eop-destino-icon" style="font-size:22px;color:#64748b;">account_balance</span>'; }
                if (destinoNombreEl) { destinoNombreEl.textContent = 'Sin elegir'; destinoNombreEl.style.color = '#94a3b8'; }
            }
        } else {
            if (cat) {
                const catIconHtml = cat.iconoImagen
                    ? `<img src="${cat.iconoImagen}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">`
                    : `${_catIconHTML(cat,22)}`;
                if (destinoWrap) { destinoWrap.style.background = cat.color; destinoWrap.style.border = 'none'; destinoWrap.innerHTML = catIconHtml; }
                if (destinoNombreEl) { destinoNombreEl.textContent = cat.name; destinoNombreEl.style.color = cat.color; }
            } else {
                if (destinoWrap) { destinoWrap.style.background = 'rgba(30,41,59,0.7)'; destinoWrap.style.border = '1px solid rgba(255,255,255,0.07)'; destinoWrap.innerHTML = '<span class="material-symbols-rounded" id="eop-destino-icon" style="font-size:22px;color:#475569;">category</span>'; }
                if (destinoNombreEl) { destinoNombreEl.textContent = 'Sin elegir'; destinoNombreEl.style.color = '#475569'; }
            }
        }
        renderEopSubtags(cat);
    }

    function eopSwapCuentas() {
        if (window._eopTipo === 'EXPENSE') {
            window._eopCatIdExpense = window._eopCatId;
            window._eopSubtagExpense = window._eopSubtag;
            window._eopCatId = window._eopCatIdIncome || null;
            window._eopSubtag = window._eopSubtagIncome || null;
            setEopTipo('INCOME', false);
            actualizarDisplayCuentas();
            return;
        }
        if (window._eopTipo === 'INCOME') {
            window._eopCatIdIncome = window._eopCatId;
            window._eopSubtagIncome = window._eopSubtag;
            window._eopCatId = window._eopCatIdExpense || null;
            window._eopSubtag = window._eopSubtagExpense || null;
            setEopTipo('EXPENSE', false);
            actualizarDisplayCuentas();
            return;
        }
        if (window._eopTipo !== 'TRANSFER') return;
        const cuentas = typeof _getCuentasTraspaso === 'function' ? _getCuentasTraspaso() : [];
        const _op = window._eopId && window.finanzasData ? window.finanzasData.operaciones.find(o => o.id === window._eopId) : null;
        if (window._eopOrigenIdx === null && _op && (_op.fromAccountName || _op.note)) {
            const nombre = _op.fromAccountName || '';
            const found = cuentas.findIndex(c => c.nombre === nombre);
            if (found !== -1) window._eopOrigenIdx = found;
        }
        if (window._eopDestinoIdx === null && _op && (_op.toAccountName || _op.note)) {
            const nombre = _op.toAccountName || '';
            const found = cuentas.findIndex(c => c.nombre === nombre);
            if (found !== -1) window._eopDestinoIdx = found;
        }
        if (window._eopOrigenIdx === null || window._eopDestinoIdx === null) return;
        var tmp = window._eopOrigenIdx;
        window._eopOrigenIdx = window._eopDestinoIdx;
        window._eopDestinoIdx = tmp;
        actualizarDisplayCuentas();
    }
    function abrirSelectorCuenta(tipo) {
        window._eopSelectorTipo = tipo;
        const cuentas = typeof _getCuentasTraspaso === 'function' ? _getCuentasTraspaso() : [];
        const titulo = document.getElementById('selector-cuenta-titulo');
        if (titulo) titulo.textContent = 'Selecciona cuenta';
        const lista = document.getElementById('selector-cuenta-lista');
        if (!lista) return;
        lista.innerHTML = '';
        cuentas.forEach((c, i) => {
            const btn = document.createElement('button');
            const isSelected = (window._eopSelectorTipo === 'destino' ? window._eopDestinoIdx : window._eopOrigenIdx) === i;
            btn.style.cssText = `width:100%;display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:13px;border:1px solid ${isSelected?'#3b82f6':'rgba(71,85,105,0.2)'};background:${isSelected?'rgba(59,130,246,0.12)':'rgba(15,23,42,0.5)'};cursor:pointer;text-align:left;box-sizing:border-box;`;
            const thumbEl = typeof _thumbHTML === 'function' ? _thumbHTML(c.thumb, 38) : '';
            btn.innerHTML = `<div style="width:38px;height:38px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${thumbEl}</div><div style="flex:1;min-width:0;"><div style="color:#f1f5f9;font-size:14px;font-weight:700;">${c.nombre}</div><div style="color:#64748b;font-size:11px;">${fmtFinanza(c.valor)}</div></div>${isSelected?'<span class="material-symbols-rounded" style="color:#3b82f6;font-size:18px;">check_circle</span>':''}`;
            btn.onclick = () => seleccionarCuentaModal(i);
            lista.appendChild(btn);
        });
        document.getElementById('modalSelectorCuenta').style.display = 'flex';
    }

    function seleccionarCuentaModal(idx) {
        if (window._eopSelectorTipo === 'destino') {
            if (idx === window._eopOrigenIdx) {
                window._eopOrigenIdx = window._eopDestinoIdx;
            }
            window._eopDestinoIdx = idx;
        } else {
            if (idx === window._eopDestinoIdx) {
                window._eopDestinoIdx = window._eopOrigenIdx;
            }
            window._eopOrigenIdx = idx;
        }
        document.getElementById('modalSelectorCuenta').style.display = 'none';
        actualizarDisplayCuentas();
    }

    function toggleEopPanel(panel) {
        const contenedor = document.getElementById('eop-panel-expandible');
        const paneles = ['categoria','comentario','tipo'];
        if (window._eopPanelActivo === panel) {
            cerrarEopPanel();
            return;
        }
        paneles.forEach(p => {
            document.getElementById('eop-panel-'+p).style.display = p === panel ? 'block' : 'none';
        });
        if (panel === 'categoria') renderEopCatGrid(window._eopTipo, window._eopCatId);
        contenedor.style.maxHeight = '320px';
        contenedor.style.opacity = '1';
        window._eopPanelActivo = panel;
        if (panel === 'comentario') setTimeout(() => document.getElementById('eop-comentario')?.focus(), 350);
    }

    function cerrarEopPanel() {
        const contenedor = document.getElementById('eop-panel-expandible');
        if (contenedor) { contenedor.style.maxHeight = '0'; contenedor.style.opacity = '0'; }
        window._eopPanelActivo = null;
    }

    function setEopTipo(tipo, rerenderCats = true) {
        window._eopTipo = tipo;
        const btnG = document.getElementById('eop-tipo-gasto');
        const btnI = document.getElementById('eop-tipo-ingreso');
        const tipoIcon = document.getElementById('eop-tipo-icon');
        const tipoLabel = document.getElementById('eop-tipo-label');
        if (btnG) {
            btnG.style.background = tipo==='EXPENSE' ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.05)';
            btnG.style.border = tipo==='EXPENSE' ? '2px solid rgba(239,68,68,0.7)' : '2px solid rgba(239,68,68,0.2)';
            btnG.style.color = tipo==='EXPENSE' ? '#f87171' : '#475569';
            btnG.style.opacity = tipo==='EXPENSE' ? '1' : '0.5';
        }
        if (btnI) {
            btnI.style.background = tipo==='INCOME' ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.05)';
            btnI.style.border = tipo==='INCOME' ? '2px solid rgba(16,185,129,0.7)' : '2px solid rgba(16,185,129,0.2)';
            btnI.style.color = tipo==='INCOME' ? '#34d399' : '#475569';
            btnI.style.opacity = tipo==='INCOME' ? '1' : '0.5';
        }
        if (tipo === 'TRANSFER') {
            if (tipoIcon) { tipoIcon.textContent = 'sync_alt'; tipoIcon.style.color = '#60a5fa'; }
            if (tipoLabel) { tipoLabel.textContent = 'Swap'; tipoLabel.style.color = '#60a5fa'; }
        } else if (tipo === 'EXPENSE') {
            if (tipoIcon) { tipoIcon.textContent = 'swap_vert'; tipoIcon.style.color = '#34d399'; }
            if (tipoLabel) { tipoLabel.textContent = 'A Ingreso'; tipoLabel.style.color = '#34d399'; }
        } else {
            if (tipoIcon) { tipoIcon.textContent = 'swap_vert'; tipoIcon.style.color = '#f87171'; }
            if (tipoLabel) { tipoLabel.textContent = 'A Gasto'; tipoLabel.style.color = '#f87171'; }
        }
        const origenLabel = document.getElementById('eop-col-origen-label');
        const destinoLabel = document.getElementById('eop-col-destino-label');
        if (origenLabel) origenLabel.textContent = tipo==='INCOME' ? 'De categoría' : 'De cuenta';
        if (destinoLabel) destinoLabel.textContent = (tipo==='TRANSFER'||tipo==='INCOME') ? 'A cuenta' : 'A categoría';
        const flechaArrow2 = document.getElementById('eop-flecha');
        const flechaBtn2 = document.getElementById('eop-flecha-btn');
        if (flechaArrow2) { flechaArrow2.style.display = tipo==='TRANSFER' ? 'none' : 'inline'; }
        if (flechaBtn2) { flechaBtn2.style.display = tipo==='TRANSFER' ? 'flex' : 'none'; }
        if (rerenderCats) { window._eopCatId = null; window._eopSubtag = null; actualizarDisplayCuentas(); }
        const eopAccionesRow = document.getElementById('eop-acciones-row');
        if (eopAccionesRow) eopAccionesRow.style.display = (tipo === 'TRANSFER' || tipo === 'ADJUST') ? 'none' : 'grid';
        const eopNotaTransfer = document.getElementById('eop-nota-transfer');
        if (eopNotaTransfer) eopNotaTransfer.style.display = (tipo === 'TRANSFER' || tipo === 'ADJUST') ? 'block' : 'none';
        if (tipo === 'TRANSFER' || tipo === 'ADJUST') cerrarEopPanel();
    }

    function renderEopSubtags(cat) {
        const row = document.getElementById('eop-subtags-row');
        if (!row) return;
        if (!cat || !cat.tags || cat.tags.length === 0) {
            row.style.display = 'none';
            row.innerHTML = '';
            return;
        }
        row.style.display = 'flex';
        row.innerHTML = '';
        cat.tags.forEach(tag => {
            const isSelected = window._eopSubtag === tag;
            const btn = document.createElement('button');
            btn.style.cssText = `padding:5px 12px;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;transition:all 0.15s;border:1.5px solid ${isSelected ? cat.color : cat.color+'55'};background:${isSelected ? cat.color+'33' : cat.color+'11'};color:${isSelected ? cat.color : cat.color+'cc'};`;
            btn.textContent = tag;
            btn.onclick = () => {
                window._eopSubtag = isSelected ? null : tag;
                renderEopSubtags(cat);
            };
            row.appendChild(btn);
        });
    }

    function renderEopCatGrid(tipo, selectedId) {
        const grid = document.getElementById('eop-cat-grid');
        if (!grid) return;
        grid.innerHTML = '';
        const cats = window.finanzasData.categorias.filter(c => c.type === tipo);
        cats.forEach(cat => {
            const btn = document.createElement('button');
            const sel = cat.id === selectedId;
            btn.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 4px;border-radius:13px;border:2px solid ${sel ? cat.color : 'transparent'};background:${sel ? cat.color+'22' : 'rgba(15,23,42,0.5)'};cursor:pointer;transition:all 0.15s;`;
            btn.innerHTML = `<div style="width:38px;height:38px;border-radius:11px;background:${cat.color};display:flex;align-items:center;justify-content:center;overflow:hidden;">${_catIconHTML(cat,19)}</div><div style="color:${sel ? '#f1f5f9' : '#cbd5e1'};font-size:10px;font-weight:700;text-align:center;line-height:1.2;">${cat.name}</div>`;
            btn.onclick = () => {
                const changed = window._eopCatId !== cat.id;
                window._eopCatId = cat.id;
                if (changed) window._eopSubtag = null;
                cerrarEopPanel();
                actualizarDisplayCuentas();
            };
            grid.appendChild(btn);
        });
    }

    function actualizarFechaDisplay() {
        const dateIn = document.getElementById('eop-fecha-date');
        const timeIn = document.getElementById('eop-fecha-time');
        const hidden = document.getElementById('eop-fecha');
        const display = document.getElementById('eop-fecha-display');
        if (!display) return;
        let d = null;
        if (dateIn && dateIn.value) {
            const t = (timeIn && timeIn.value) ? timeIn.value : '00:00';
            if (hidden) hidden.value = dateIn.value + 'T' + t;
            d = new Date(dateIn.value + 'T' + t);
        } else if (hidden && hidden.value) {
            d = new Date(hidden.value);
        }
        if (!d || isNaN(d)) { display.textContent = 'Sin fecha'; return; }
        const hoy = new Date();
        const esHoy = d.toDateString() === hoy.toDateString();
        display.textContent = esHoy
            ? 'Hoy, ' + d.toLocaleDateString('es-ES',{day:'numeric',month:'long'}) + ' · ' + d.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})
            : d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'}) + ' · ' + d.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
    }
    window._calFecha = new Date();

    function _calRender() {
        const f = window._calFecha;
        const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        document.getElementById('cal-mes-label').textContent = meses[f.getMonth()] + ' ' + f.getFullYear();
        const grid = document.getElementById('cal-grid');
        if (!grid) return;
        grid.innerHTML = '';
        const hoy = new Date();
        const selDay = window._calSelDay;
        const primerDia = new Date(f.getFullYear(), f.getMonth(), 1);
        let dow = primerDia.getDay(); // 0=dom
        dow = dow === 0 ? 6 : dow - 1; // lunes=0
        const diasMes = new Date(f.getFullYear(), f.getMonth()+1, 0).getDate();
        for (let i = 0; i < dow; i++) {
            grid.appendChild(Object.assign(document.createElement('div'), {}));
        }
        for (let d = 1; d <= diasMes; d++) {
            const esHoy = hoy.getDate()===d && hoy.getMonth()===f.getMonth() && hoy.getFullYear()===f.getFullYear();
            const esSel = selDay && selDay.getDate()===d && selDay.getMonth()===f.getMonth() && selDay.getFullYear()===f.getFullYear();
            const btn = document.createElement('button');
            btn.textContent = d;
            btn.style.cssText = `aspect-ratio:1;border-radius:10px;border:none;cursor:pointer;font-size:13px;font-weight:${esSel||esHoy?'800':'600'};
                background:${esSel?'#3b82f6':esHoy?'rgba(148,163,184,0.12)':'rgba(255,255,255,0.03)'};
                color:${esSel?'#fff':esHoy?'#94a3b8':'#cbd5e1'};
                outline:${esHoy&&!esSel?'1px solid rgba(148,163,184,0.3)':'none'};
                transition:all 0.1s;`;
            btn.onmouseover = () => { if (!esSel) btn.style.background = 'rgba(59,130,246,0.15)'; };
            btn.onmouseout  = () => { if (!esSel) btn.style.background = esHoy?'rgba(148,163,184,0.12)':'rgba(255,255,255,0.03)'; };
            btn.onclick = () => {
                window._calSelDay = new Date(f.getFullYear(), f.getMonth(), d);
                _calApply();
                _calRender();
            };
            grid.appendChild(btn);
        }
    }

    var _calSwipeX = 0;
    function _calSwipeStart(e) { e.stopPropagation(); _calSwipeX = e.touches[0].clientX; }
    function _calSwipeEnd(e) {
        e.stopPropagation();
        var dx = e.changedTouches[0].clientX - _calSwipeX;
        if (Math.abs(dx) > 40) _calNav(dx < 0 ? 1 : -1);
    }
    function _calNav(dir) {
        window._calFecha = new Date(window._calFecha.getFullYear(), window._calFecha.getMonth() + dir, 1);
        _calRender();
    }

    function _calUpdateTime() {
        _calApply();
    }

    function _calApply() {
        const sel = window._calSelDay || new Date();
        const h = parseInt(document.getElementById('cal-hora')?.value||'0');
        const m = parseInt(document.getElementById('cal-min')?.value||'0');
        const dt = new Date(sel.getFullYear(), sel.getMonth(), sel.getDate(), h, m);
        const dateIn = document.getElementById('eop-fecha-date');
        const timeIn = document.getElementById('eop-fecha-time');
        if (dateIn) dateIn.value = dt.toISOString().slice(0,10);
        if (timeIn) timeIn.value = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
        const hidden = document.getElementById('eop-fecha');
        if (hidden) hidden.value = dt.toISOString().slice(0,16);
        actualizarFechaDisplay();
    }

    function toggleCalendarPanel() {
        const panel = document.getElementById('eop-calendar-panel');
        if (!panel) return;
        const isOpen = panel.style.display !== 'none';
        panel.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) {
            const hidden = document.getElementById('eop-fecha');
            const d = hidden && hidden.value ? new Date(hidden.value) : new Date();
            window._calFecha = new Date(d.getFullYear(), d.getMonth(), 1);
            window._calSelDay = d;
            const h = document.getElementById('cal-hora');
            const m = document.getElementById('cal-min');
            if (h) h.value = String(d.getHours()).padStart(2,'0');
            if (m) m.value = String(d.getMinutes()).padStart(2,'0');
            _calRender();
            requestAnimationFrame(() => {
                const btn = document.querySelector('[onclick="toggleCalendarPanel()"]');
                if (!btn) return;
                const rect = btn.getBoundingClientRect();
                const panelW = 290;
                let left = rect.left + rect.width / 2 - panelW / 2;
                left = Math.max(8, Math.min(left, window.innerWidth - panelW - 8));
                const top = rect.top - panel.offsetHeight - 8;
                panel.style.position = 'fixed';
                panel.style.left = left + 'px';
                panel.style.top = Math.max(8, top) + 'px';
                panel.style.bottom = 'auto';
                panel.style.transform = 'none';
                panel.style.zIndex = '99999';
            });
        }
    }

    function aplicarFechaCalendario() {
        actualizarFechaDisplay();
    }

    function eliminarOpActual() {
        if (!window._eopId) return;
        const panel = document.getElementById('eop-confirm-delete');
        if (panel) panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
    }

    function confirmarEliminarOp(revertirCuenta) {
        if (!window._eopId) return;
        if (revertirCuenta) {
            const op = window.finanzasData.operaciones.find(o => o.id === window._eopId);
            if (op) {
                const tipoReverso = op.type === 'INCOME' ? 'EXPENSE' : 'INCOME';
                _aplicarMovimientoEnCuenta(op.accountId, op.amount, tipoReverso);
            }
        }
        window.finanzasData.operaciones = window.finanzasData.operaciones.filter(o => o.id !== window._eopId);
        guardarFinanzasData();
        guardarDatos && guardarDatos();
        cerrarModalEditarOp();
        renderHistorialOperaciones();
        renderEstadisticas();
    }

    function duplicarOpActual() {
        if (!window._eopId) return;
        const op = window.finanzasData.operaciones.find(o => o.id === window._eopId);
        if (!op) return;
        const nueva = { ...op, id: 'op_' + Date.now(), date: new Date().toISOString(), createdAt: new Date().toISOString() };
        window.finanzasData.operaciones.push(nueva);
        _aplicarMovimientoEnCuenta(nueva.accountId, nueva.amount, nueva.type);

        guardarFinanzasData();
        guardarDatos && guardarDatos();
        cerrarModalEditarOp();
        renderHistorialOperaciones();
        renderEstadisticas();
    }
    function _aplicarMovimientoEnCuenta(cuentaIdx, amount, tipo) {
        if (cuentaIdx === null || cuentaIdx === undefined) return;
        const cuentas = typeof _getCuentasTraspaso === 'function' ? _getCuentasTraspaso() : [];
        const cuenta = cuentas[cuentaIdx];
        if (!cuenta || !cuenta.valorInput) return;
        const saldoActual = (typeof parseMoneyInput === 'function' ? parseMoneyInput(cuenta.valorInput.value) : parseFloat(cuenta.valorInput.value.replace(',','.')) || 0);
        const nuevoSaldo = tipo === 'INCOME' ? saldoActual + amount : saldoActual - amount;
        cuenta.valorInput.value = nuevoSaldo.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        cuenta.valorInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function guardarEdicionOp() {
        const op = window.finanzasData.operaciones.find(o => o.id === window._eopId);
        if (!op) return;
        const _notaTransferEl = document.getElementById('eop-comentario-transfer');
        const comentario = ((window._eopTipo === 'TRANSFER' || window._eopTipo === 'ADJUST') && _notaTransferEl)
            ? _notaTransferEl.value.trim()
            : document.getElementById('eop-comentario').value.trim();
        const importeStr = document.getElementById('eop-importe').value.replace(/[€\s]/g,'');
        const importe = typeof parseMoneyInput === 'function' ? parseMoneyInput(importeStr) : parseFloat(importeStr.replace(',','.')) || 0;
        const hidden = document.getElementById('eop-fecha');
        const dateIn = document.getElementById('eop-fecha-date');
        const timeIn = document.getElementById('eop-fecha-time');
        if (dateIn && dateIn.value) {
            const t = timeIn && timeIn.value ? timeIn.value : '00:00';
            if (hidden) hidden.value = dateIn.value + 'T' + t;
        }
        const fechaStr = hidden ? hidden.value : '';
        const catId = window._eopCatId || op.categoryId;
        const cat = catId && window.finanzasData ? window.finanzasData.categorias.find(c=>c.id===catId) : null;
        op.note = cat ? cat.name : (op.note || '');
        op.comment = comentario;
        if (importe > 0) op.amount = importe;
        if (fechaStr) op.date = new Date(fechaStr).toISOString();
        op.type = window._eopTipo;
        if (catId) op.categoryId = catId;
        if (window._eopSubtag) op.subtag = window._eopSubtag; else delete op.subtag;
        op.accountId = window._eopOrigenIdx;
        op.destAccountId = window._eopDestinoIdx !== null ? window._eopDestinoIdx : undefined;
        op.toAccountId = window._eopDestinoIdx !== null ? window._eopDestinoIdx : undefined;
        const _cuentasGuardar = typeof _getCuentasTraspaso === 'function' ? _getCuentasTraspaso() : [];
        if (window._eopOrigenIdx !== null && _cuentasGuardar[window._eopOrigenIdx]) op.fromAccountName = _cuentasGuardar[window._eopOrigenIdx].nombre;
        if (window._eopDestinoIdx !== null && _cuentasGuardar[window._eopDestinoIdx]) op.toAccountName = _cuentasGuardar[window._eopDestinoIdx].nombre;
        guardarFinanzasData();
        cerrarModalEditarOp();
        renderHistorialOperaciones();
        renderEstadisticas();
    }
    document.addEventListener('DOMContentLoaded', function() {
    });

    function mostrarModalTipoMovimiento() {
        const modal = document.getElementById('modalTipoMovimientoOp');
        if (modal) { modal.style.display = 'flex'; return; }
        abrirModalAddMovimiento('EXPENSE');
    }

    window._progTipo = 'EXPENSE';
    window._progCatId = null;
    window._progSubtag = null;
    window._editProgId = null;
    window._editProgTipo = 'EXPENSE';
    window._editProgCatId = null;
    window._editProgSubtag = null;

    function abrirModalProgramado() {
        if (!window.finanzasData.programados) window.finanzasData.programados = [];
        window._progTipo = 'EXPENSE';
        window._progCatId = null;
        window._progSubtag = null;
        const progSubSec = document.getElementById('prog-subtag-section');
        if (progSubSec) progSubSec.style.display = 'none';
        document.getElementById('prog-importe').value = '';
        document.getElementById('prog-nota').value = '';
        const manana = new Date(); manana.setDate(manana.getDate() + 1);
        const mananaIso = manana.toISOString().slice(0,10);
        document.getElementById('prog-fecha').value = mananaIso;
        const dispEl = document.getElementById('prog-fecha-disp');
        if (dispEl) dispEl.textContent = _progCalFmtDate(mananaIso);
        document.getElementById('prog-cal-panel').style.display = 'none';
        document.getElementById('prog-cat-nombre').textContent = 'Sin seleccionar';
        document.getElementById('prog-cat-nombre').style.color = '#e2e8f0';
        document.getElementById('prog-cat-thumb').innerHTML = '<span class="material-symbols-rounded" style="font-size:20px;color:#64748b;">category</span>';
        document.getElementById('prog-cat-dropdown').style.display = 'none';
        document.getElementById('prog-cat-chevron').style.transform = '';
        setProgramadoTipo('EXPENSE');
        _renderProgCatGrid('EXPENSE');
        document.getElementById('modalProgramado').style.display = 'flex';
        _prepararModalFinanzasScrollable('modalProgramado');
    }

    function cerrarModalProgramado() {
        document.getElementById('modalProgramado').style.display = 'none';
        const p = document.getElementById('prog-cal-panel'); if (p) p.style.display = 'none';
    }

    function setProgramadoTipo(tipo) {
        window._progTipo = tipo;
        const eExp = tipo === 'EXPENSE';
        const btnE = document.getElementById('prog-tipo-expense');
        const btnI = document.getElementById('prog-tipo-income');
        if (btnE) { btnE.style.border = eExp ? '2px solid rgba(239,68,68,0.7)' : '2px solid rgba(100,116,139,0.2)'; btnE.style.background = eExp ? 'rgba(239,68,68,0.15)' : 'transparent'; btnE.style.color = eExp ? '#f87171' : '#64748b'; }
        if (btnI) { btnI.style.border = !eExp ? '2px solid rgba(16,185,129,0.7)' : '2px solid rgba(100,116,139,0.2)'; btnI.style.background = !eExp ? 'rgba(16,185,129,0.15)' : 'transparent'; btnI.style.color = !eExp ? '#34d399' : '#64748b'; }
        window._progCatId = null;
        document.getElementById('prog-cat-nombre').textContent = 'Sin seleccionar';
        document.getElementById('prog-cat-nombre').style.color = '#e2e8f0';
        document.getElementById('prog-cat-thumb').innerHTML = '<span class="material-symbols-rounded" style="font-size:20px;color:#64748b;">category</span>';
        _renderProgCatGrid(tipo);
    }

    function toggleProgCatDropdown() {
        const dd = document.getElementById('prog-cat-dropdown');
        const chev = document.getElementById('prog-cat-chevron');
        const open = dd.style.display !== 'none';
        dd.style.display = open ? 'none' : 'block';
        chev.style.transform = open ? '' : 'rotate(180deg)';
    }

    function _renderProgCatGrid(tipo, gridId, selectedId, onSelect) {
        gridId = gridId || 'prog-cat-grid';
        const grid = document.getElementById(gridId);
        if (!grid) return;
        grid.innerHTML = '';
        const cats = (window.finanzasData && window.finanzasData.categorias) ? window.finanzasData.categorias.filter(c => c.type === tipo) : [];
        cats.forEach(cat => {
            const btn = document.createElement('button');
            const sel = cat.id === selectedId;
            btn.className = 'modal-cat-btn-item' + (sel ? ' selected' : '');
            btn.onclick = () => {
                if (onSelect) { onSelect(cat); return; }
                window._progCatId = cat.id;
                window._progSubtag = null;
                document.querySelectorAll('#' + gridId + ' .modal-cat-btn-item').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                document.getElementById('prog-cat-thumb').innerHTML = `<div style="width:38px;height:38px;border-radius:10px;background:${cat.color};display:flex;align-items:center;justify-content:center;overflow:hidden;">${_catIconHTML(cat,20)}</div>`;
                const nEl = document.getElementById('prog-cat-nombre');
                if (nEl) { nEl.textContent = cat.name; nEl.style.color = cat.color; }
                document.getElementById('prog-cat-dropdown').style.display = 'none';
                document.getElementById('prog-cat-chevron').style.transform = '';
                _renderProgSubtags(cat, 'prog-subtag-section', 'prog-subtag-grid', '_progSubtag');
            };
            btn.innerHTML = `<div class="modal-cat-icon-sq" style="background:${cat.color};border:none;">${_catIconHTML(cat,22)}</div><div class="modal-cat-label">${cat.name}</div>`;
            grid.appendChild(btn);
        });
    }

    function confirmarProgramado() {
        const importeRaw = document.getElementById('prog-importe').value;
        const importe = typeof parseMoneyInput === 'function' ? parseMoneyInput(importeRaw) : parseFloat(importeRaw.replace(',','.')) || 0;
        if (!importe || importe <= 0) { document.getElementById('prog-importe').focus(); return; }
        const fecha = document.getElementById('prog-fecha').value;
        if (!fecha) { toggleProgCalPanel(); return; }
        const nota = document.getElementById('prog-nota').value.trim();
        const tipo = window._progTipo || 'EXPENSE';
        const catId = window._progCatId;
        const cat = catId && window.finanzasData ? window.finanzasData.categorias.find(c => c.id === catId) : null;
        if (!window.finanzasData.programados) window.finanzasData.programados = [];
        window.finanzasData.programados.push({
            id: 'prog_' + Date.now(),
            type: tipo,
            categoryId: catId || null,
            note: cat ? cat.name : (tipo === 'INCOME' ? 'Ingreso' : 'Gasto'),
            comment: nota,
            amount: importe,
            scheduledDate: fecha,
            ...(window._progSubtag ? { subtag: window._progSubtag } : {}),
            createdAt: new Date().toISOString()
        });
        guardarFinanzasData();
        guardarDatos && guardarDatos();
        cerrarModalProgramado();
        renderHistorialOperaciones();
        _mostrarToast && _mostrarToast('schedule_send', '#94a3b8', 'Pago programado');
    }

    function abrirModalEditarProgramado(id) {
        const p = (window.finanzasData.programados || []).find(x => x.id === id);
        if (!p) return;
        window._editProgId = id;
        window._editProgTipo = p.type || 'EXPENSE';
        window._editProgCatId = p.categoryId || null;
        window._editProgSubtag = p.subtag || null;
        document.getElementById('eprog-importe').value = p.amount ? p.amount.toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2}) : '';
        document.getElementById('eprog-nota').value = p.comment || '';
        document.getElementById('eprog-fecha').value = p.scheduledDate || '';
        const epDispEl = document.getElementById('eprog-fecha-disp');
        if (epDispEl) epDispEl.textContent = _progCalFmtDate(p.scheduledDate || '');
        document.getElementById('eprog-cal-panel').style.display = 'none';
        setEditProgramadoTipo(p.type || 'EXPENSE');
        const cat = p.categoryId && window.finanzasData ? window.finanzasData.categorias.find(c => c.id === p.categoryId) : null;
        const eThumb = document.getElementById('eprog-cat-thumb');
        const eNombre = document.getElementById('eprog-cat-nombre');
        if (cat) {
            if (eThumb) eThumb.innerHTML = `<div style="width:38px;height:38px;border-radius:10px;background:${cat.color};display:flex;align-items:center;justify-content:center;overflow:hidden;">${_catIconHTML(cat,20)}</div>`;
            if (eNombre) { eNombre.textContent = cat.name; eNombre.style.color = cat.color; }
        } else {
            if (eThumb) eThumb.innerHTML = '<span class="material-symbols-rounded" style="font-size:20px;color:#64748b;">category</span>';
            if (eNombre) { eNombre.textContent = 'Sin seleccionar'; eNombre.style.color = '#e2e8f0'; }
        }
        document.getElementById('eprog-cat-dropdown').style.display = 'none';
        document.getElementById('eprog-cat-chevron').style.transform = '';
        _renderEProgCatGrid(p.type || 'EXPENSE', p.categoryId);
        _renderProgSubtags(cat, 'eprog-subtag-section', 'eprog-subtag-grid', '_editProgSubtag');
        document.getElementById('modalEditarProgramado').style.display = 'flex';
        _prepararModalFinanzasScrollable('modalEditarProgramado');
    }

    function cerrarModalEditarProgramado() {
        document.getElementById('modalEditarProgramado').style.display = 'none';
        const p = document.getElementById('eprog-cal-panel'); if (p) p.style.display = 'none';
    }

    function setEditProgramadoTipo(tipo) {
        window._editProgTipo = tipo;
        const eExp = tipo === 'EXPENSE';
        const btnE = document.getElementById('eprog-tipo-expense');
        const btnI = document.getElementById('eprog-tipo-income');
        if (btnE) { btnE.style.border = eExp ? '2px solid rgba(239,68,68,0.7)' : '2px solid rgba(100,116,139,0.2)'; btnE.style.background = eExp ? 'rgba(239,68,68,0.15)' : 'transparent'; btnE.style.color = eExp ? '#f87171' : '#64748b'; }
        if (btnI) { btnI.style.border = !eExp ? '2px solid rgba(16,185,129,0.7)' : '2px solid rgba(100,116,139,0.2)'; btnI.style.background = !eExp ? 'rgba(16,185,129,0.15)' : 'transparent'; btnI.style.color = !eExp ? '#34d399' : '#64748b'; }
        _renderEProgCatGrid(tipo, window._editProgCatId);
    }

    function toggleEProgCatDropdown() {
        const dd = document.getElementById('eprog-cat-dropdown');
        const chev = document.getElementById('eprog-cat-chevron');
        const open = dd.style.display !== 'none';
        dd.style.display = open ? 'none' : 'block';
        chev.style.transform = open ? '' : 'rotate(180deg)';
    }

    function _renderEProgCatGrid(tipo, selectedId) {
        const grid = document.getElementById('eprog-cat-grid');
        if (!grid) return;
        grid.innerHTML = '';
        const cats = (window.finanzasData && window.finanzasData.categorias) ? window.finanzasData.categorias.filter(c => c.type === tipo) : [];
        cats.forEach(cat => {
            const btn = document.createElement('button');
            const sel = cat.id === selectedId;
            btn.className = 'modal-cat-btn-item' + (sel ? ' selected' : '');
            btn.onclick = () => {
                window._editProgCatId = cat.id;
                window._editProgSubtag = null;
                document.querySelectorAll('#eprog-cat-grid .modal-cat-btn-item').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const eThumb = document.getElementById('eprog-cat-thumb');
                const eNombre = document.getElementById('eprog-cat-nombre');
                if (eThumb) eThumb.innerHTML = `<div style="width:38px;height:38px;border-radius:10px;background:${cat.color};display:flex;align-items:center;justify-content:center;overflow:hidden;">${_catIconHTML(cat,20)}</div>`;
                if (eNombre) { eNombre.textContent = cat.name; eNombre.style.color = cat.color; }
                document.getElementById('eprog-cat-dropdown').style.display = 'none';
                document.getElementById('eprog-cat-chevron').style.transform = '';
                _renderProgSubtags(cat, 'eprog-subtag-section', 'eprog-subtag-grid', '_editProgSubtag');
            };
            btn.innerHTML = `<div class="modal-cat-icon-sq" style="background:${cat.color};border:none;">${_catIconHTML(cat,22)}</div><div class="modal-cat-label">${cat.name}</div>`;
            grid.appendChild(btn);
        });
    }

    function guardarEditarProgramado() {
        const p = (window.finanzasData.programados || []).find(x => x.id === window._editProgId);
        if (!p) return;
        const importeRaw = document.getElementById('eprog-importe').value;
        const importe = typeof parseMoneyInput === 'function' ? parseMoneyInput(importeRaw) : parseFloat(importeRaw.replace(',','.')) || 0;
        if (!importe || importe <= 0) { document.getElementById('eprog-importe').focus(); return; }
        const fecha = document.getElementById('eprog-fecha').value;
        if (!fecha) { toggleEProgCalPanel(); return; }
        const cat = window._editProgCatId && window.finanzasData ? window.finanzasData.categorias.find(c => c.id === window._editProgCatId) : null;
        p.type = window._editProgTipo;
        p.categoryId = window._editProgCatId || null;
        p.note = cat ? cat.name : (window._editProgTipo === 'INCOME' ? 'Ingreso' : 'Gasto');
        p.comment = document.getElementById('eprog-nota').value.trim();
        p.amount = importe;
        p.scheduledDate = fecha;
        if (window._editProgSubtag) p.subtag = window._editProgSubtag; else delete p.subtag;
        guardarFinanzasData();
        guardarDatos && guardarDatos();
        cerrarModalEditarProgramado();
        renderHistorialOperaciones();
        _mostrarToast && _mostrarToast('save', '#94a3b8', 'Programado actualizado');
    }

    function eliminarProgramado() {
        if (!window._editProgId) return;
        window.finanzasData.programados = (window.finanzasData.programados || []).filter(x => x.id !== window._editProgId);
        guardarFinanzasData();
        guardarDatos && guardarDatos();
        cerrarModalEditarProgramado();
        renderHistorialOperaciones();
        _mostrarToast && _mostrarToast('delete', '#ef4444', 'Programado eliminado');
    }
    function _ejecutarProgramadosVencidos() {
        if (!window.finanzasData || !Array.isArray(window.finanzasData.programados)) return;
        const hoy = new Date(); hoy.setHours(0,0,0,0);
        const vencidos = window.finanzasData.programados.filter(p => {
            const d = new Date(p.scheduledDate + 'T00:00:00'); return d <= hoy;
        });
        if (vencidos.length === 0) return;
        vencidos.forEach(p => {
            const op = {
                id: 'op_' + Date.now() + '_' + Math.random().toString(36).slice(2,7),
                accountId: null,
                categoryId: p.categoryId || null,
                amount: p.amount,
                type: p.type,
                note: p.note || '',
                comment: p.comment || '',
                date: p.scheduledDate + 'T12:00:00.000Z',
                createdAt: new Date().toISOString(),
                fromScheduled: p.id
            };
            if (!Array.isArray(window.finanzasData.operaciones)) window.finanzasData.operaciones = [];
            window.finanzasData.operaciones.push(op);
        });
        window.finanzasData.programados = window.finanzasData.programados.filter(p => {
            const d = new Date(p.scheduledDate + 'T00:00:00'); return d > hoy;
        });
        guardarFinanzasData();
        guardarDatos && guardarDatos();
        if (vencidos.length > 0) _mostrarToast && _mostrarToast('check_circle', '#10b981', vencidos.length === 1 ? '1 pago ejecutado' : vencidos.length + ' pagos ejecutados');
    }
    function _renderProgSubtags(cat, sectionId, gridId, subtagVar) {
        const section = document.getElementById(sectionId);
        const grid = document.getElementById(gridId);
        if (!section || !grid) return;
        const tags = (cat && cat.tags) ? cat.tags : [];
        if (tags.length === 0) { section.style.display = 'none'; grid.innerHTML = ''; return; }
        section.style.display = 'block';
        grid.innerHTML = '';
        const ninguna = document.createElement('button');
        ninguna.type = 'button';
        ninguna.style.cssText = `padding:7px 14px;border-radius:20px;font-size:12px;font-weight:700;border:2px solid ${cat.color}88;background:${cat.color}33;color:${cat.color};cursor:pointer;transition:all 0.12s;`;
        ninguna.textContent = 'Ninguna';
        ninguna.onclick = () => { window[subtagVar] = null; _highlightProgSubtag(ninguna, grid); };
        grid.appendChild(ninguna);
        const currentSel = window[subtagVar];
        if (!currentSel) { ninguna.style.opacity='1'; ninguna.style.borderWidth='2px'; } else { ninguna.style.opacity='0.5'; ninguna.style.borderWidth='1.5px'; }
        tags.forEach(tag => {
            const btn = document.createElement('button');
            btn.type = 'button';
            const isSel = currentSel === tag;
            btn.style.cssText = `padding:7px 14px;border-radius:20px;font-size:12px;font-weight:700;border:${isSel?'2px':'1.5px'} solid ${cat.color}${isSel?'':'55'};background:${cat.color}${isSel?'33':'18'};color:${cat.color};cursor:pointer;transition:all 0.12s;opacity:${isSel?'1':'0.5'};`;
            btn.textContent = tag;
            btn.onclick = () => { window[subtagVar] = tag; _highlightProgSubtag(btn, grid); };
            grid.appendChild(btn);
        });
    }
    function _highlightProgSubtag(activeBtn, grid) {
        grid.querySelectorAll('button').forEach(b => { b.style.opacity='0.5'; b.style.borderWidth='1.5px'; });
        activeBtn.style.opacity='1'; activeBtn.style.borderWidth='2px';
    }

    function _progCalFmtDate(isoStr) {
        if (!isoStr) return 'Seleccionar fecha';
        const d = new Date(isoStr + 'T00:00:00');
        const hoy = new Date(); hoy.setHours(0,0,0,0);
        const man = new Date(hoy); man.setDate(man.getDate() + 1);
        if (d.toDateString() === hoy.toDateString()) return 'Hoy, ' + d.toLocaleDateString('es-ES',{day:'numeric',month:'long'});
        if (d.toDateString() === man.toDateString()) return 'Mañana, ' + d.toLocaleDateString('es-ES',{day:'numeric',month:'long'});
        return d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    }

    function _buildCalPanel(prefix, panelId, gridId, mesLabelId, selDay, onSelect) {
        const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        const f = window['_' + prefix + 'CalFecha'] || new Date();
        const mesLabel = document.getElementById(mesLabelId);
        if (mesLabel) mesLabel.textContent = meses[f.getMonth()] + ' ' + f.getFullYear();
        const grid = document.getElementById(gridId);
        if (!grid) return;
        grid.innerHTML = '';
        const hoy = new Date(); hoy.setHours(0,0,0,0);
        const primerDia = new Date(f.getFullYear(), f.getMonth(), 1);
        let dow = primerDia.getDay(); dow = dow === 0 ? 6 : dow - 1;
        const diasMes = new Date(f.getFullYear(), f.getMonth()+1, 0).getDate();
        for (let i = 0; i < dow; i++) grid.appendChild(document.createElement('div'));
        for (let d = 1; d <= diasMes; d++) {
            const thisDate = new Date(f.getFullYear(), f.getMonth(), d);
            thisDate.setHours(0,0,0,0);
            const esHoy = thisDate.toDateString() === hoy.toDateString();
            const esSel = selDay && new Date(selDay + 'T00:00:00').toDateString() === thisDate.toDateString();
            const btn = document.createElement('button');
            btn.textContent = d;
            btn.style.cssText = `aspect-ratio:1;border-radius:10px;border:none;cursor:pointer;font-size:13px;font-weight:${esSel||esHoy?'800':'600'};background:${esSel?'#3b82f6':esHoy?'rgba(148,163,184,0.12)':'rgba(255,255,255,0.03)'};color:${esSel?'#fff':esHoy?'#94a3b8':'#cbd5e1'};outline:${esHoy&&!esSel?'1px solid rgba(148,163,184,0.3)':'none'};transition:all 0.1s;`;
            btn.onmouseover = () => { if (!esSel) btn.style.background='rgba(59,130,246,0.15)'; };
            btn.onmouseout  = () => { if (!esSel) btn.style.background=esHoy?'rgba(148,163,184,0.12)':'rgba(255,255,255,0.03)'; };
            btn.onclick = () => {
                const isoVal = thisDate.toISOString().slice(0,10);
                onSelect(isoVal);
                document.getElementById(panelId).style.display = 'none';
            };
            grid.appendChild(btn);
        }
    }

    function _positionCalPanel(panelId, btnId) {
        const panel = document.getElementById(panelId);
        const btn = document.getElementById(btnId);
        if (!panel || !btn) return;
        const rect = btn.getBoundingClientRect();
        const panelW = 290;
        let left = rect.left + rect.width / 2 - panelW / 2;
        left = Math.max(8, Math.min(left, window.innerWidth - panelW - 8));
        const spaceAbove = rect.top - 16;
        const spaceBelow = window.innerHeight - rect.bottom - 16;
        panel.style.width = panelW + 'px';
        panel.style.left = left + 'px';
        panel.style.position = 'fixed';
        panel.style.transform = 'none';
        if (spaceAbove >= 340 || spaceAbove >= spaceBelow) {
            panel.style.top = 'auto';
            panel.style.bottom = (window.innerHeight - rect.top + 8) + 'px';
        } else {
            panel.style.bottom = 'auto';
            panel.style.top = (rect.bottom + 8) + 'px';
        }
    }
    window._progCalFecha = new Date();
    function toggleProgCalPanel() {
        const panel = document.getElementById('prog-cal-panel');
        if (!panel) return;
        const isOpen = panel.style.display !== 'none';
        if (isOpen) { panel.style.display = 'none'; return; }
        const curVal = document.getElementById('prog-fecha').value;
        const d = curVal ? new Date(curVal + 'T00:00:00') : new Date();
        window._progCalFecha = new Date(d.getFullYear(), d.getMonth(), 1);
        panel.style.display = 'block';
        _positionCalPanel('prog-cal-panel', 'prog-fecha-btn');
        _buildCalPanel('prog', 'prog-cal-panel', 'prog-cal-grid', 'prog-cal-mes-label', curVal, _progCalSelect);
    }
    function _progCalSelect(isoVal) {
        document.getElementById('prog-fecha').value = isoVal;
        const disp = document.getElementById('prog-fecha-disp');
        if (disp) disp.textContent = _progCalFmtDate(isoVal);
    }
    function _progCalNav(dir) {
        window._progCalFecha = new Date(window._progCalFecha.getFullYear(), window._progCalFecha.getMonth() + dir, 1);
        const curVal = document.getElementById('prog-fecha').value;
        _buildCalPanel('prog', 'prog-cal-panel', 'prog-cal-grid', 'prog-cal-mes-label', curVal, _progCalSelect);
    }
    var _progCalSwipeX = 0;
    function _progCalSwipeStart(e) { e.stopPropagation(); _progCalSwipeX = e.touches[0].clientX; }
    function _progCalSwipeEnd(e) { e.stopPropagation(); var dx = e.changedTouches[0].clientX - _progCalSwipeX; if (Math.abs(dx) > 40) _progCalNav(dx < 0 ? 1 : -1); }
    window._eprogCalFecha = new Date();
    function toggleEProgCalPanel() {
        const panel = document.getElementById('eprog-cal-panel');
        if (!panel) return;
        const isOpen = panel.style.display !== 'none';
        if (isOpen) { panel.style.display = 'none'; return; }
        const curVal = document.getElementById('eprog-fecha').value;
        const d = curVal ? new Date(curVal + 'T00:00:00') : new Date();
        window._eprogCalFecha = new Date(d.getFullYear(), d.getMonth(), 1);
        panel.style.display = 'block';
        _positionCalPanel('eprog-cal-panel', 'eprog-fecha-btn');
        _buildCalPanel('eprog', 'eprog-cal-panel', 'eprog-cal-grid', 'eprog-cal-mes-label', curVal, _eprogCalSelect);
    }
    function _eprogCalSelect(isoVal) {
        document.getElementById('eprog-fecha').value = isoVal;
        const disp = document.getElementById('eprog-fecha-disp');
        if (disp) disp.textContent = _progCalFmtDate(isoVal);
    }
    function _eprogCalNav(dir) {
        window._eprogCalFecha = new Date(window._eprogCalFecha.getFullYear(), window._eprogCalFecha.getMonth() + dir, 1);
        const curVal = document.getElementById('eprog-fecha').value;
        _buildCalPanel('eprog', 'eprog-cal-panel', 'eprog-cal-grid', 'eprog-cal-mes-label', curVal, _eprogCalSelect);
    }
    var _eprogCalSwipeX = 0;
    function _eprogCalSwipeStart(e) { e.stopPropagation(); _eprogCalSwipeX = e.touches[0].clientX; }
    function _eprogCalSwipeEnd(e) { e.stopPropagation(); var dx = e.changedTouches[0].clientX - _eprogCalSwipeX; if (Math.abs(dx) > 40) _eprogCalNav(dx < 0 ? 1 : -1); }
    document.addEventListener('click', function(e) {
        ['prog-cal-panel','eprog-cal-panel'].forEach(id => {
            const panel = document.getElementById(id);
            if (panel && panel.style.display !== 'none') {
                const btn = document.getElementById(id === 'prog-cal-panel' ? 'prog-fecha-btn' : 'eprog-fecha-btn');
                if (!panel.contains(e.target) && btn && !btn.contains(e.target)) {
                    panel.style.display = 'none';
                }
            }
        });
    }, true);
    function toggleMobileFinanzasMenu(e) {
        if (e) e.stopPropagation();
        const menu = document.getElementById('mobileFinanzasMenu');
        const backdrop = document.getElementById('mobileFinanzasBackdrop');
        if (menu.style.display === 'none' || menu.style.display === '') {
            cerrarMobileViviendaMenu();
            cerrarMobileAgendaMenu();
            cerrarMobileFitnessMenu();
            menu.style.display = 'block';
            const btn = document.getElementById('mobileFinanzasBtn');
            const nav = document.getElementById('mobileBottomNav');
            if (btn && nav) {
                const navRect = nav.getBoundingClientRect();
                menu.style.setProperty('position', 'fixed', 'important');
                menu.style.setProperty('left', navRect.left + 'px', 'important');
                menu.style.setProperty('transform', 'none', 'important');
                menu.style.setProperty('bottom', '100px', 'important');
                menu.style.setProperty('top', 'auto', 'important');
                menu.style.setProperty('right', 'auto', 'important');
            }
            if (backdrop) { backdrop.style.display = 'block'; backdrop.classList.add('active'); }
            document.querySelectorAll('.mobile-tab-btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
        } else {
            cerrarMobileFinanzasMenu();
        }
    }
    function cerrarMobileFinanzasMenu() {
        const menu = document.getElementById('mobileFinanzasMenu');
        const backdrop = document.getElementById('mobileFinanzasBackdrop');
        if (menu) menu.style.display = 'none';
        if (backdrop) { backdrop.style.display = 'none'; backdrop.classList.remove('active'); }
    }
    function toggleMobileViviendaMenu(e) {
        if (e) e.stopPropagation();
        const menu = document.getElementById('mobileViviendaMenu');
        const backdrop = document.getElementById('mobileViviendaBackdrop');
        if (menu.style.display === 'none' || menu.style.display === '') {
            cerrarMobileFinanzasMenu();
            cerrarMobileAgendaMenu();
            cerrarMobileFitnessMenu();
            menu.style.display = 'block';
            const btn = document.getElementById('mobileViviendaBtn');
            if (btn) {
                const rect = btn.getBoundingClientRect();
                menu.style.setProperty('position', 'fixed', 'important');
                menu.style.setProperty('left', (rect.left + rect.width / 2) + 'px', 'important');
                menu.style.setProperty('transform', 'translateX(-50%)', 'important');
                menu.style.setProperty('bottom', '100px', 'important');
                menu.style.setProperty('top', 'auto', 'important');
                menu.style.setProperty('right', 'auto', 'important');
            }
            if (backdrop) { backdrop.style.display = 'block'; backdrop.classList.add('active'); }
            document.querySelectorAll('.mobile-tab-btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
        } else {
            cerrarMobileViviendaMenu();
        }
    }
    function cerrarMobileViviendaMenu() {
        const menu = document.getElementById('mobileViviendaMenu');
        const backdrop = document.getElementById('mobileViviendaBackdrop');
        if (menu) menu.style.display = 'none';
        if (backdrop) { backdrop.style.display = 'none'; backdrop.classList.remove('active'); }
    }
    function toggleMobileAgendaMenu(e) {
        if (e) e.stopPropagation();
        const menu = document.getElementById('mobileAgendaMenu');
        const backdrop = document.getElementById('mobileAgendaBackdrop');
        if (menu.style.display === 'none' || menu.style.display === '') {
            cerrarMobileFinanzasMenu();
            cerrarMobileViviendaMenu();
            cerrarMobileFitnessMenu();
            menu.style.display = 'block';
            const btn = document.getElementById('mobileAgendaBtn');
            if (btn) {
                const rect = btn.getBoundingClientRect();
                menu.style.setProperty('position', 'fixed', 'important');
                menu.style.setProperty('left', (rect.left + rect.width / 2) + 'px', 'important');
                menu.style.setProperty('transform', 'translateX(-50%)', 'important');
                menu.style.setProperty('bottom', '100px', 'important');
                menu.style.setProperty('top', 'auto', 'important');
                menu.style.setProperty('right', 'auto', 'important');
            }
            if (backdrop) { backdrop.style.display = 'block'; backdrop.classList.add('active'); }
            document.querySelectorAll('.mobile-tab-btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
        } else {
            cerrarMobileAgendaMenu();
        }
    }
    function cerrarMobileAgendaMenu() {
        const menu = document.getElementById('mobileAgendaMenu');
        const backdrop = document.getElementById('mobileAgendaBackdrop');
        if (menu) menu.style.display = 'none';
        if (backdrop) { backdrop.style.display = 'none'; backdrop.classList.remove('active'); }
    }
    function toggleMobileFitnessMenu(e) {
        if (e) e.stopPropagation();
        const menu = document.getElementById('mobileFitnessMenu');
        const backdrop = document.getElementById('mobileFitnessBackdrop');
        if (menu.style.display === 'none' || menu.style.display === '') {
            cerrarMobileFinanzasMenu();
            cerrarMobileAgendaMenu();
            cerrarMobileViviendaMenu();
            menu.style.display = 'block';
            const btn = document.getElementById('mobileFitnessBtn');
            const nav = document.getElementById('mobileBottomNav');
            if (btn && nav) {
                const navRect = nav.getBoundingClientRect();
                menu.style.setProperty('position', 'fixed', 'important');
                menu.style.setProperty('right', (window.innerWidth - navRect.right) + 'px', 'important');
                menu.style.setProperty('left', 'auto', 'important');
                menu.style.setProperty('transform', 'none', 'important');
                menu.style.setProperty('bottom', '100px', 'important');
                menu.style.setProperty('top', 'auto', 'important');
            }
            if (backdrop) { backdrop.style.display = 'block'; backdrop.classList.add('active'); }
            document.querySelectorAll('.mobile-tab-btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
        } else {
            cerrarMobileFitnessMenu();
        }
    }
    function cerrarMobileFitnessMenu() {
        const menu = document.getElementById('mobileFitnessMenu');
        const backdrop = document.getElementById('mobileFitnessBackdrop');
        if (menu) menu.style.display = 'none';
        if (backdrop) { backdrop.style.display = 'none'; backdrop.classList.remove('active'); }
    }
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.mobile-fin-item').forEach(btn => {
            btn.addEventListener('mouseover', () => btn.style.background = 'rgba(59,130,246,0.1)');
            btn.addEventListener('mouseout', () => btn.style.background = 'transparent');
        });
        var btnBorrar = document.getElementById('btnBorrarCategorias');
        if (btnBorrar) {
            btnBorrar.addEventListener('click', function(e) {
                e.stopPropagation();
                borrarTodasCategorias();
            });
        }
    });

