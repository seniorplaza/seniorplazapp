
        function toggleMobileMenu(event) {
            if (event) {
                event.stopPropagation();
            }
            
            const dropdown = document.getElementById('mobileDropdown');
            const backdrop = document.getElementById('mobileBackdrop');
            
            if (dropdown.style.display === 'none' || dropdown.style.display === '') {
                dropdown.style.display = 'block';
                if (backdrop) backdrop.classList.add('active');
            } else {
                dropdown.style.display = 'none';
                if (backdrop) backdrop.classList.remove('active');
            }
        }
        function toggleFullscreen() {
            const elem = document.documentElement;
            const fullscreenIcon = document.getElementById('fullscreenIcon');
            const fullscreenText = document.getElementById('fullscreenText');
            const fullscreenIconDesktop = document.getElementById('fullscreenIconDesktop');
            
            if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) { /* Safari */
                    elem.webkitRequestFullscreen();
                } else if (elem.mozRequestFullScreen) { /* Firefox */
                    elem.mozRequestFullScreen();
                } else if (elem.msRequestFullscreen) { /* IE11 */
                    elem.msRequestFullscreen();
                }
                if (fullscreenIcon) fullscreenIcon.textContent = 'fullscreen_exit';
                if (fullscreenText) fullscreenText.textContent = 'Salir pantalla completa';
                if (fullscreenIconDesktop) fullscreenIconDesktop.textContent = 'fullscreen_exit';
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { /* Safari */
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) { /* Firefox */
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) { /* IE11 */
                    document.msExitFullscreen();
                }
                if (fullscreenIcon) fullscreenIcon.textContent = 'fullscreen';
                if (fullscreenText) fullscreenText.textContent = 'Pantalla completa';
                if (fullscreenIconDesktop) fullscreenIconDesktop.textContent = 'fullscreen';
            }
        }
        document.addEventListener('fullscreenchange', updateFullscreenIcon);
        document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
        document.addEventListener('mozfullscreenchange', updateFullscreenIcon);
        document.addEventListener('MSFullscreenChange', updateFullscreenIcon);
        
        function updateFullscreenIcon() {
            const fullscreenIcon = document.getElementById('fullscreenIcon');
            const fullscreenText = document.getElementById('fullscreenText');
            const fullscreenIconDesktop = document.getElementById('fullscreenIconDesktop');
            
            if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
                if (fullscreenIcon) fullscreenIcon.textContent = 'fullscreen_exit';
                if (fullscreenText) fullscreenText.textContent = 'Salir pantalla completa';
                if (fullscreenIconDesktop) fullscreenIconDesktop.textContent = 'fullscreen_exit';
            } else {
                if (fullscreenIcon) fullscreenIcon.textContent = 'fullscreen';
                if (fullscreenText) fullscreenText.textContent = 'Pantalla completa';
                if (fullscreenIconDesktop) fullscreenIconDesktop.textContent = 'fullscreen';
            }
        }
        document.addEventListener('click', function(event) {
            const dropdown = document.getElementById('mobileDropdown');
            const button = event.target.closest('.mobile-menu-button-inline');
            
            if (!button && dropdown && dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
                const backdrop = document.getElementById('mobileBackdrop');
                if (backdrop) backdrop.classList.remove('active');
            }
        });
        function toggleCentralMenu(event) {
            if (event) {
                event.stopPropagation();
            }
            
            const dropdown = document.getElementById('centralMenuDropdown');
            const backdrop = document.getElementById('centralMenuBackdrop');
            
            if (dropdown.style.display === 'none' || dropdown.style.display === '') {
                dropdown.style.display = 'block';
                if (backdrop) {
                    backdrop.style.display = 'block';
                    backdrop.classList.add('active');
                }
            } else {
                dropdown.style.display = 'none';
                if (backdrop) {
                    backdrop.style.display = 'none';
                    backdrop.classList.remove('active');
                }
            }
        }
        document.addEventListener('click', function(event) {
            const dropdown = document.getElementById('centralMenuDropdown');
            const button = event.target.closest('.mobile-tab-center');
            
            if (!button && dropdown && dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
                const backdrop = document.getElementById('centralMenuBackdrop');
                if (backdrop) {
                    backdrop.style.display = 'none';
                    backdrop.classList.remove('active');
                }
            }
        });
        function showTab(id, button, origen) {
            if (!window._restoringTab) { try { sessionStorage.setItem('_lastTab', id); } catch(e) {} }
            document.querySelectorAll('.tab-content').forEach(el => { el.classList.remove('active'); el.classList.remove('pre-restore'); });
            document.getElementById(id).classList.add('active');
            if (id === 'analisis') {
                // En Android WebView algunos cambios de pestaña conservan el scroll previo.
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
                const mainEl = document.querySelector('main');
                if (mainEl) mainEl.scrollTop = 0;
            }
            
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            if (button) {
                button.classList.add('active');
            }
            document.querySelectorAll('.mobile-tab-btn').forEach(btn => btn.classList.remove('active'));
            const mobileBtn = document.querySelector(`.mobile-tab-btn[data-tab="${id}"]`);
            if (mobileBtn) {
                mobileBtn.classList.add('active');
            }
            if (!origen || origen !== 'popstate') {
                try { history.pushState({ tab: id }, '', '#' + id); } catch(e) {}
            }
            if (id === 'vivienda' && typeof window.init360Visor === 'function') {
                setTimeout(function() {
                    window.init360Visor();
                }, 100);
            }
            if (id === 'fitness-gimnasio') {
                setTimeout(function() {
                    document.querySelectorAll('.gym-card').forEach(function(c) {
                        c.removeAttribute('draggable');
                        delete c.dataset.dragInit;
                    });
                    document.querySelectorAll('.gym-panel-grid').forEach(function(grid) {
                        if (grid._sortable) { grid._sortable.destroy(); grid._sortable = null; }
                        if (typeof _initGymSortable === 'function') _initGymSortable(grid);
                    });
                    if (typeof _initAllGymCards === 'function') _initAllGymCards();
                }, 50);
            }
        }
        window.addEventListener('popstate', function(e) {
            var active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
                active.blur();
                try { history.pushState(e.state || {}, '', window.location.href); } catch(err) {}
                return;
            }
            if (e.state && e.state.tab) {
                showTab(e.state.tab, null, 'popstate');
            } else {
                showTab('mis-activos', null, 'popstate');
            }
        });
        (function() {
            const activeTab = document.querySelector('.tab-content.active');
            const initialId = activeTab ? activeTab.id : 'mis-activos';
            try { history.replaceState({ tab: initialId }, '', '#' + initialId); } catch(e) {}
        })();

        function fmt(num) {
            const rounded = Math.round(num * 100) / 100;
            const hasDec = (rounded % 1) !== 0;
            return rounded.toLocaleString('es-ES', {
                minimumFractionDigits: hasDec ? 2 : 0,
                maximumFractionDigits: hasDec ? 2 : 0
            });
        }
        function parseMoneyInput(val) {
            if (typeof val === 'number') return isNaN(val) ? 0 : val;
            val = String(val || '');
            if (val.includes(',')) {
                return parseFloat(val.replace(/\./g, '').replace(',', '.')) || 0;
            }
            if (val.includes('.')) {
                const partes = val.split('.');
                if (partes.length === 2 && partes[1].length <= 2) {
                    return parseFloat(val) || 0;
                }
                return parseFloat(val.replace(/\./g, '')) || 0;
            }
            return parseFloat(val) || 0;
        }
        function fmtMoneyInput(input) {
            const raw = input.value;
            if (/,$/.test(raw) || /,\d{0,1}$/.test(raw)) return;
            const parts = raw.replace(/\./g, '').split(',');
            const intPart = parts[0].replace(/[^0-9]/g, '');
            const decPart = parts[1] !== undefined ? ',' + parts[1].replace(/[^0-9]/g, '').slice(0, 2) : '';
            if (intPart === '' && decPart === '') { input.value = ''; return; }
            const num = parseInt(intPart || '0', 10);
            const cursorAtEnd = input.selectionStart === input.value.length;
            input.value = (!isNaN(num) ? num.toLocaleString('es-ES') : '0') + decPart;
            if (cursorAtEnd) { const l = input.value.length; input.setSelectionRange(l, l); }
        }

        function _abrirModalCantidad(input) {
            var prev = document.getElementById('_modalCantidadOverlay');
            if (prev) prev.remove();

            var card = input.closest('.card-input-group');
            var labelEl = card ? card.querySelector('input[type="text"]:not(.cuenta-saldo-input):not(.ingreso-simple-neto):not(.gasto-cantidad):not(.ingreso-neto-mes)') : null;
            var label = labelEl ? labelEl.value.trim() : '';
            var valorActual = input.value || '0';

            var overlay = document.createElement('div');
            overlay.id = '_modalCantidadOverlay';
            overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:10100;display:flex;align-items:center;justify-content:center;padding:24px;';

            overlay.innerHTML = `
                <div id="_modalCantidadBox" style="background:#0f172a;border:1px solid rgba(255,255,255,0.1);border-radius:24px;width:100%;max-width:360px;padding:28px 24px 24px;box-shadow:0 25px 60px rgba(0,0,0,0.7);animation:slideUp 0.2s ease-out;">
                    <div style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:4px;">Editar importe</div>
                    <div style="color:#f1f5f9;font-size:15px;font-weight:800;margin-bottom:20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${label || '—'}</div>
                    <div style="background:#1e293b;border:1px solid rgba(59,130,246,0.25);border-radius:16px;padding:16px 18px;display:flex;align-items:center;gap:8px;margin-bottom:12px;position:relative;">
                        <input id="_modalCantidadInput" type="text" inputmode="decimal" value="${valorActual}"
                            style="flex:1;background:transparent;border:none;outline:none;color:#f1f5f9;font-size:28px !important;font-weight:900;font-family:Manrope,sans-serif;text-align:center;min-width:0;padding-right:28px;width:100%;box-sizing:border-box;"
                            oninput="fmtMoneyInput(this)">
                        <span style="color:#3b82f6;font-size:28px;font-weight:900;flex-shrink:0;line-height:1;position:absolute;right:16px;">€</span>
                    </div>
                    <input id="_modalCantidadNota" type="text" placeholder="Nota (opcional)…"
                        style="width:100%;box-sizing:border-box;background:#1e293b;border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:12px 16px;color:#94a3b8;font-size:13px;font-family:Manrope,sans-serif;outline:none;margin-bottom:20px;">
                    <div style="display:flex;gap:10px;">
                        <button id="_modalCantidadCancelar" style="flex:1;height:48px;border-radius:14px;border:1px solid rgba(255,255,255,0.08);background:transparent;color:#64748b;font-size:13px;font-weight:700;cursor:pointer;font-family:Manrope,sans-serif;transition:background 0.15s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">Cancelar</button>
                        <button id="_modalCantidadConfirmar" style="flex:2;height:48px;border-radius:14px;border:1px solid rgba(59,130,246,0.5);background:rgba(59,130,246,0.15);color:#93c5fd;font-size:13px;font-weight:800;cursor:pointer;font-family:Manrope,sans-serif;display:flex;align-items:center;justify-content:center;gap:7px;transition:background 0.15s,border-color 0.15s;" onmouseover="this.style.background='rgba(59,130,246,0.25)'" onmouseout="this.style.background='rgba(59,130,246,0.15)'">
                            <span class="material-symbols-rounded" style="font-size:18px;">check_circle</span>Confirmar
                        </button>
                    </div>
                </div>`;

            document.body.appendChild(overlay);

            var modalInput = overlay.querySelector('#_modalCantidadInput');
            requestAnimationFrame(() => { modalInput.focus(); modalInput.select(); });
            if (window.visualViewport) {
                function _onVVResize() {
                    const vv = window.visualViewport;
                    const kbHeight = window.innerHeight - vv.height;
                    const box = overlay.querySelector('#_modalCantidadBox');
                    if (kbHeight > 80) {
                        const visibleH = vv.height;
                        const boxH = box ? box.offsetHeight : 260;
                        const topOffset = Math.max(12, (visibleH - boxH) / 2);
                        overlay.style.alignItems = 'flex-start';
                        overlay.style.paddingTop = topOffset + 'px';
                        overlay.style.paddingBottom = '0px';
                        overlay.style.height = vv.height + 'px';
                        overlay.style.top = vv.offsetTop + 'px';
                    } else {
                        overlay.style.alignItems = 'center';
                        overlay.style.paddingTop = '24px';
                        overlay.style.paddingBottom = '24px';
                        overlay.style.height = '';
                        overlay.style.top = '0';
                    }
                }
                window.visualViewport.addEventListener('resize', _onVVResize);
                window.visualViewport.addEventListener('scroll', _onVVResize);
                overlay._vvCleanup = () => {
                    window.visualViewport.removeEventListener('resize', _onVVResize);
                    window.visualViewport.removeEventListener('scroll', _onVVResize);
                };
            }

            function _cerrar() { if (overlay._vvCleanup) overlay._vvCleanup(); overlay.remove(); }

            overlay.querySelector('#_modalCantidadCancelar').onclick = _cerrar;

            var _confirmarFn = function() {
                var nuevoValor = modalInput.value;
                var notaVal = (overlay.querySelector('#_modalCantidadNota')?.value || '').trim();
                var prevValor = parseMoneyInput(input.value) || 0;
                var nuevoNum = parseMoneyInput(nuevoValor) || 0;
                input.value = nuevoValor;
                input.dataset.saldoPrev = prevValor;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                var diff = nuevoNum - prevValor;
                if (Math.abs(diff) >= 0.005 && typeof window.finanzasData !== 'undefined' && Array.isArray(window.finanzasData.operaciones)) {
                    var cards = Array.from(document.querySelectorAll('#listaCuentas .card-input-group'));
                    var idx = cards.indexOf(card);
                    var nombreEl2 = card ? card.querySelector('input[type="text"]:not(.cuenta-saldo-input):not(.ingreso-simple-neto):not(.gasto-cantidad):not(.ingreso-neto-mes)') : null;
                    var nombre2 = nombreEl2 ? nombreEl2.value.trim() : (label || 'Cuenta');
                    window.finanzasData.operaciones.push({
                        id: 'adj_' + Date.now(),
                        type: 'ADJUST',
                        accountId: idx,
                        accountName: nombre2,
                        amount: Math.abs(diff),
                        adjustDiff: diff,
                        note: nombre2,
                        comment: notaVal || '',
                        date: new Date().toISOString(),
                        createdAt: new Date().toISOString()
                    });
                    input.dataset.saldoPrev = nuevoNum;
                    if (typeof actualizarEstadisticas === 'function') actualizarEstadisticas();
                }
                _cerrar();
            };

            var _btnConfirmar = overlay.querySelector('#_modalCantidadConfirmar');
            _btnConfirmar.addEventListener('touchend', function(e) {
                e.preventDefault();
                if (document.activeElement) document.activeElement.blur();
                _confirmarFn();
            }, { passive: false });
            _btnConfirmar.addEventListener('click', _confirmarFn);

            modalInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') _confirmarFn();
                if (e.key === 'Escape') _cerrar();
            });
        }
        const ic = n => ({ n, f: 'ms' });
        const icSvg = (n, vb, svg) => ({ n, f: 'svg', vb, svg });

        const iconosPorCategoria = {
            personalizados: [icSvg('tortuga','0 0 360.1 239.55','<path d="M123.07,191.61l-5.39,20.86c-4.95,19.17-23.85,30.7-42.77,26.05-19.03-4.67-30.82-24.13-25.65-43.42,1.06-3.97,1.99-7.59,2.87-11.79-8.33-8.89-24.36.86-32.69,5.98-4.35,2.67-9.21,3.26-13.56.65S-.46,182.79.08,177.31c2.14-21.62,15.7-43.09,36.11-52.49,1.83-52.3,24.62-105.51,79.28-120.29,21.96-5.94,44.73-5.91,66.82-.67,44.21,11.38,69.27,45.14,78.24,89.57,14.09-14.7,32.34-21.71,52.24-21.56,16.42.12,30.4,8.17,38.35,22.54,5.73,10.36,8.14,21.62,8.88,33.59.91,14.85-4.72,28.3-16.32,37.69-20.98,17.64-55.39,23.29-83.09,25.45,7.27,19.57-2.78,40.4-21.96,46.65-19.65,6.41-40.3-5.36-45.37-25.61l-5.13-20.49-65.07-.09ZM173.87,59.74l17.72-26.79c-13-6.35-26.59-8.8-40.79-8.95-14.74-.04-28.89,2.43-42.32,8.9l18.08,27.03,47.31-.19ZM88.09,119.52l18.44-46.25-17.8-26.51c-9.59,9.45-15.87,20.42-20.42,32.61-4.67,13.09-7.1,26.35-7.81,40.46l27.58-.3ZM239.51,119.44c-.8-14.97-3.5-28.68-8.59-42.05-4.55-11.34-10.5-21.49-19.62-30.5l-17.74,26.4,18.62,46.5,27.32-.35ZM186.24,119.72l-14.34-35.86-43.81.11-14.27,35.84,72.42-.09ZM114.43,167.67l82.83.04c5.84,0,10.48,3.64,11.88,9.12l7.74,30.45c1.58,6.23,7.95,9.54,13.95,7.85,5.62-1.58,9.31-7.47,7.77-13.67l-4.77-19.23c-.94-3.79.26-7.52,2.58-10.32s5.6-4.11,9.66-4.21c23.23-.55,60.73-4.61,79.68-18.47,4.64-3.4,9.05-8.09,9.82-14.01,1.23-9.42-.58-19.22-4.6-27.54s-11.57-12.2-20.45-11.88c-20.51.75-33.24,11.34-42.7,28.54-6.15,11.17-17.45,19.28-30.84,19.29l-177.57.15c-10.41,0-19.55,4.44-25.76,12.84,15.08-3.23,28.44,1.93,38.48,12.49,3.41,3.59,6.44,7.46,5.12,12.8l-4.86,19.71c-1.56,6.32,2.49,12.32,8.46,13.66s11.85-2.11,13.39-8.22l7.54-29.91c1.47-5.83,6.08-9.5,12.65-9.49Z"/><ellipse cx="312.04" cy="119.79" rx="11.98" ry="11.96" fill="currentColor"/>'),icSvg('reddit','0 0 90 90','<path d="M61.951 64.101c-1.017-.509-2.234-.397-3.143.286-3.925 2.951-8.777 4.46-13.655 4.261-.083-.004-.167-.005-.25 0-4.878.191-9.726-1.309-13.655-4.262-1.324-.996-3.204-.729-4.201.596-.995 1.325-.729 3.206.596 4.201 4.732 3.557 10.512 5.482 16.387 5.482.333 0 .666-.006.999-.019 5.791.22 11.526-1.447 16.32-4.702 1.3-.329 2.263-1.507 2.263-2.909v-.251c0-1.136-.643-2.175-1.661-2.683z"/><path d="M77.391 33.213c-2.177.076-4.28.737-6.107 1.899-6.924-4.041-16.675-6.539-24.476-7.268l3.719-17.482 13.879 2.774c.793 3.758 4.127 6.58 8.121 6.58 4.585 0 8.302-3.717 8.302-8.302 0-4.585-3.717-8.302-8.302-8.302-3.05 0-5.708 1.649-7.152 4.1L50.797 4.298c-1.297-.291-2.623-.058-3.742.654-1.12.712-1.894 1.819-2.181 3.117-.014.064-.026.131-.036.199l-4.14 19.461c-7.805.513-15.33 2.907-22.003 7.001-2.029-1.269-4.386-1.918-6.834-1.832-3.259.103-6.281 1.47-8.506 3.845-2.236 2.378-3.41 5.484-3.307 8.747.103 3.259 1.47 6.281 3.853 8.513.472.441.966.838 1.479 1.189.005.387.02.772.045 1.157.078 15.731 17.885 28.512 39.76 28.512 21.878 0 39.685-12.78 39.761-28.513.025-.408.041-.818.045-1.229 3.187-2.318 5.12-6.102 5.049-10.147-.048-6.673-5.729-11.971-12.449-11.721zm3.214 17.575c-1.082.541-1.733 1.679-1.651 2.886.053.786.053 1.584 0 2.37-.005.067-.007.135-.007.202 0 12.47-15.145 22.615-33.761 22.615-18.615 0-33.761-10.145-33.761-22.615 0-.068-.002-.136-.007-.204-.054-.785-.054-1.581 0-2.366.086-1.26-.626-2.439-1.782-2.948C9.069 50.477 8.518 50.104 8 49.62c-1.208-1.132-1.902-2.666-1.954-4.321-.053-1.659.544-3.238 1.685-4.451 1.131-1.208 2.666-1.901 4.321-1.954.067-.002.134-.003.201-.003 1.585 0 3.085.594 4.245 1.684 1.021.959 2.573 1.085 3.736.299 6.793-4.596 14.712-7.101 22.906-7.244 7.767.181 19.718 2.905 26.632 7.614 1.169.796 2.734.667 3.757-.307 1.116-1.063 2.563-1.677 4.068-1.729 3.401-.101 6.32 2.569 6.445 5.927.042 2.37-1.307 4.588-3.437 5.653z"/><path d="M36.416 51.59c0-3.561-2.904-6.465-6.465-6.465s-6.465 2.904-6.465 6.465 2.888 6.432 6.465 6.465c3.561-.001 6.465-2.905 6.465-6.465z"/><path d="M59.82 45.349c-3.561 0-6.465 2.904-6.465 6.465 0 3.561 2.904 6.465 6.465 6.465l-.049.241c.113 0 .209 0 .321 0 3.561-.145 6.336-3.143 6.192-6.706-.2-3.561-3.104-6.465-6.464-6.465z"/>'),icSvg('logo','0 0 487.43 642.8','<path d="M236.1,379.72c-.9,1.6-1.5,2.8-2.1,3.9-21.2,37.9-42.2,75.9-62.1,114.5-17.7,34.5-35,69.2-52.4,103.9-5.8,11.6-11.4,23.3-16,35.4-.3.8-.7,1.7-.7,2.5-.2,2,1.6,3.4,3.5,2.7.7-.3,1.5-.7,2-1.3,1.2-1.2,2.3-2.5,3.2-3.8,11.5-17.7,23.3-35.2,34.4-53.2,45.1-72.9,89.8-146,133-220.1,1.1-1.8,2.4-3.1,4.3-3.9,23.8-9.8,46.4-21.8,68.3-35.3,37.3-23.1,71.2-50.2,100.5-83,7.4-8.3,14-17.1,19.6-26.6,6.2-10.5,11.2-21.5,13.9-33.5,1.3-6,2.1-12,1.9-18.1-.2-8.4-3.4-15.9-8.6-22.5-4.8-6.2-10.7-11.2-17.6-15-7.1-4-14.7-7.1-22.6-9.1-11-2.8-22.1-4.4-33.4-5.2-8.8-.6-17.6-.9-26.4-.1-4.9.4-9.9,1.1-14.8,1.4-11.7.8-23.3,2.7-35,4.2-9.1,1.1-18.2,2.4-27.4,3-9.9.7-19.8,1-29.7,1.2-20.8.5-41.6.8-62.4-.6-8.5-.6-16.9-1.5-25.1-3.9-1-.3-1.9-.6-3.1-1,.5-.8.9-1.4,1.3-2,5-6.8,10.8-12.8,17.4-18.1,10.6-8.5,21.5-16.4,33.1-23.3,13.6-8.1,27.3-16,41.3-23.5,28.9-15.5,59.4-26.9,92.1-31.2,7.3-.9,14.6-1.7,22-.7,4.1.5,8.2,1.1,12,3,4,2,5.2,4.9,3.9,9.1-.5,1.7-1.2,3.3-2,4.9-1.9,3.8-4.3,7.3-7.1,10.5-5.3,6.1-11,11.8-17.2,17-.5.4-1.1.8-1.3,1.4-.3.6-.6,1.5-.3,1.9.3.4,1.3.7,1.8.6,1.2-.3,2.3-.7,3.3-1.3,5.1-2.9,10.1-5.8,15.1-8.9,4.8-2.9,9.2-6.4,13.2-10.3,3.4-3.2,6.1-7,8.1-11.2,2.8-6.1,2.6-12.1-.8-17.9-2.1-3.7-5-6.6-8.7-8.8-3.2-1.9-6.6-3.3-10.1-4.4C389.3.22,380-.08,370.6.02c-16.6.1-32.8,2.8-48.7,7.2-33.6,9.2-65.5,22.7-95.8,39.8-19.1,10.8-37.1,23.2-53.3,38.2-6.3,5.9-11.9,12.3-16.4,19.6-2.5,4-4.6,8.2-5.7,12.9-1.9,8.1.6,14,7.9,18.2,3.1,1.8,6.5,3.1,10,4,12.6,2.9,25.4,3.9,38.3,4.2,10,.2,20,0,30,.1.8,0,1.6-.3,2.6.4-.8.4-1.4.7-1.9.9-39.8,16.4-77.7,36.5-113.9,59.6-43.4,27.8-83.7,59.5-119,97.2-1.5,1.6-2.7,3.4-4,5.1-.3.4-.5,1.1-.7,1.6,1.4-.4,2.5-1,3.5-1.8,3.2-2.4,6.5-4.7,9.6-7.2,29.2-22.9,59.8-43.9,91.7-63,47.2-28.2,96.6-51.9,148.9-69.1,35.4-11.6,71.2-22,108.3-26.4,8.1-1,16.2-1.9,24.4-1.9,10.7.1,21.4.8,32,2.2,8.3,1.1,16.5,3,24.3,6.2,3.5,1.4,6.6,3.3,9.2,5.9,2.4,2.5,3.9,5.4,4.4,8.9,1,7-.2,13.7-3,20.1-3.3,7.4-7.4,14.3-12.2,20.9-5.9,8-12.6,15.3-19.4,22.5-8.8,9.4-17.5,19-27.7,26.9-9.4,7.3-19,14.4-28.8,21.2-16.4,11.4-33.2,22.3-50.8,31.7-.7.4-1.5.7-2.5,1.2.2-.6.3-.9.4-1.2.2-.5.5-1,.8-1.5,12.4-22.3,24.7-44.6,35.6-67.7,4.7-9.9,9.3-19.8,12.4-30.4,1-3.6,1.8-7.3,2.4-11,.2-1.1-.1-2.4-.5-3.5-.5-1.4-1.4-1.6-2.7-.9-.9.5-1.7,1.2-2.5,1.9-5.6,4.9-10.6,10.5-15.2,16.3-12.6,16-24,32.8-35,49.9-14.9,23.1-28.7,46.7-42.6,70.4-1.4,2.4-3.2,4-5.7,5.2-37.9,18.2-76.7,34.5-116.2,48.8-23.3,8.4-46.9,16-71.2,20.9-11.1,2.2-22.2,3.6-33.6,3.6-4.6,0-8.8-1.2-12.8-3.5-3.1-1.8-4.7-4.5-4.6-8.1,0-3.5.7-6.8,1.7-10.1,2.3-7.4,5.9-14.2,9.8-20.8,7.7-12.7,16-24.9,25-36.7,6.7-8.8,13.3-17.6,19.8-26.5,1.6-2.2,2.9-4.6,4.4-6.9.3-.4.5-.8.6-1.3.3-1-.4-1.7-1.3-1.3-1.1.5-2.2,1-3.1,1.8-3.8,3-7.8,5.9-11.4,9.2-15,13.7-28.8,28.5-41.5,44.3-8,9.9-14.1,20.9-18.2,33-2.2,6.5-3.8,13.1-3.2,20,.7,8.5,4.3,15.5,11.5,20.3,3.8,2.6,8,4.4,12.5,5.4,15.8,3.2,31.6,3.3,47.4.2,20.6-4,41.1-9,61.2-14.9,32.8-9.8,65.1-20.8,97.5-32,.8-.1,1.4-.2,2.5-.5Z" fill="currentColor" stroke="currentColor" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" paint-order="stroke fill"/>')],
            finanzas:     [ic('account_balance'),ic('savings'),ic('credit_card'),ic('paid'),ic('trending_up'),ic('trending_down'),ic('euro'),ic('attach_money'),ic('currency_exchange'),ic('account_balance_wallet'),ic('payments'),ic('receipt_long'),ic('point_of_sale'),ic('local_atm'),ic('currency_bitcoin'),ic('currency_franc'),ic('currency_pound'),ic('currency_ruble'),ic('currency_rupee'),ic('currency_yen'),ic('currency_yuan'),ic('monetization_on'),ic('money_off'),ic('payment'),ic('request_quote'),ic('calculate'),ic('percent'),ic('pie_chart'),ic('bar_chart'),ic('bar_chart_4_bars'),ic('show_chart'),ic('insights'),ic('analytics'),ic('gavel'),ic('balance'),ic('sell'),ic('toll'),ic('receipt'),ic('shopping_bag'),ic('account_tree'),ic('donut_large'),ic('donut_small'),ic('candlestick_chart'),ic('handshake'),ic('inventory_2'),ic('price_check'),ic('wallet'),ic('real_estate_agent'),ic('contract'),ic('price_change'),ic('waterfall_chart'),ic('finance'),ic('finance_mode'),ic('checkbook'),ic('credit_card_heart'),ic('credit_score'),ic('leaderboard'),ic('stacked_bar_chart'),ic('area_chart'),ic('bubble_chart'),ic('multiline_chart'),ic('query_stats'),ic('ssid_chart'),icSvg('bizum','0 0 38.1 50','<path d="M9.2,17.9c1.8,1.3,4.4,0.9,5.7-0.9l4.8-6.6C21,8.6,20.6,6,18.8,4.7c-1.8-1.3-4.4-0.9-5.7,0.9l-4.8,6.6C7,14,7.4,16.5,9.2,17.9z M31,8.6c-1.8-1.3-4.4-0.9-5.7,0.9L6.1,35.8c-1.3,1.8-0.9,4.4,0.9,5.7c1.8,1.3,4.4,0.9,5.7-0.9l19.1-26.3C33.2,12.5,32.8,9.9,31,8.6z M7.4,6.5c1.3-1.8,0.9-4.4-0.9-5.7C4.7-0.5,2.1-0.2,0.8,1.7C-0.5,3.5-0.2,6,1.7,7.4C3.5,8.7,6,8.3,7.4,6.5z M36.4,42.6c-1.8-1.3-4.4-0.9-5.7,0.9c-1.3,1.8-0.9,4.4,0.9,5.7c1.8,1.3,4.4,0.9,5.7-0.9C38.6,46.5,38.2,44,36.4,42.6z M28.9,32.2c-1.8-1.3-4.4-0.9-5.7,0.9l-4.8,6.6c-1.3,1.8-0.9,4.4,0.9,5.7c1.8,1.3,4.4,0.9,5.7-0.9l4.8-6.6C31.1,36.1,30.7,33.5,28.9,32.2z" fill="currentColor"/>')],
            hogar:        [ic('home'),ic('house'),ic('apartment'),ic('villa'),ic('cottage'),ic('chalet'),ic('bungalow'),ic('cabin'),ic('event_seat'),ic('bed'),ic('king_bed'),ic('single_bed'),ic('kitchen'),ic('bathtub'),ic('weekend'),ic('desk'),ic('garage'),ic('balcony'),ic('roofing'),ic('foundation'),ic('lightbulb'),ic('lightbulb_circle'),ic('floor_lamp'),ic('cleaning_services'),ic('yard'),ic('fence'),ic('deck'),ic('thermostat'),ic('ac_unit'),ic('grass'),ic('local_florist'),ic('home_work'),ic('microwave'),ic('blender'),ic('coffee_maker'),ic('pool'),ic('shower'),ic('wc'),ic('countertops'),ic('meeting_room'),ic('local_laundry_service'),ic('dry_cleaning'),ic('iron'),ic('nightlight'),ic('vpn_key'),ic('key'),ic('door_front'),ic('door_back'),ic('door_sliding'),ic('doorbell'),ic('sensor_door'),ic('house_siding'),ic('chair'),ic('chair_alt'),ic('table_restaurant'),ic('table_bar'),ic('dresser'),ic('curtains'),ic('blinds'),ic('fireplace'),ic('hot_tub'),ic('dishwasher'),ic('faucet'),ic('soap'),ic('cleaning'),ic('chair_fireplace'),ic('window'),ic('stairs'),ic('elevator'),ic('garage_door'),ic('shelves'),ic('crib'),ic('baby_changing_station'),ic('room_preferences')],
            reformas:     [ic('construction'),ic('build'),ic('hardware'),ic('home_repair_service'),ic('plumbing'),ic('electrical_services'),ic('roofing'),ic('format_paint'),ic('brush'),ic('palette'),ic('wallpaper'),ic('texture'),ic('grid_view'),ic('architecture'),ic('engineering'),ic('foundation'),ic('fence'),ic('deck'),ic('kitchen'),ic('bathtub'),ic('microwave'),ic('handyman'),ic('content_cut'),ic('design_services'),ic('square_foot'),ic('straighten'),ic('space_dashboard'),ic('grid_on'),ic('layers'),ic('view_in_ar'),ic('build_circle'),ic('settings'),ic('tune'),ic('shower'),ic('wc'),ic('local_florist'),ic('yard'),ic('balcony'),ic('carpenter'),ic('tile'),ic('brick'),ic('conveyor_belt'),ic('forklift'),ic('front_loader'),ic('palette'),ic('colorize'),ic('format_color_fill'),ic('format_color_text')],
            transporte:   [ic('directions_car'),ic('two_wheeler'),ic('motorcycle'),ic('directions_bike'),ic('train'),ic('tram'),ic('subway'),ic('directions_bus'),ic('flight'),ic('airport_shuttle'),ic('local_taxi'),ic('car_rental'),ic('local_gas_station'),ic('local_parking'),ic('commute'),ic('traffic'),ic('local_shipping'),ic('delivery_dining'),ic('directions_boat'),ic('sailing'),ic('directions_railway'),ic('car_repair'),ic('rv_hookup'),ic('agriculture'),ic('kayaking'),ic('skateboarding'),ic('rocket'),ic('rocket_launch'),ic('garage'),ic('electric_car'),ic('moped'),ic('electric_bike'),ic('electric_scooter'),ic('ev_station'),ic('electric_moped'),ic('pedal_bike'),ic('scooter'),ic('cable_car'),ic('gondola_lift'),ic('funicular'),ic('helicopter'),ic('drone'),ic('snowmobile'),ic('boat_bus'),ic('directions_subway'),ic('directions_transit'),ic('directions_walk'),ic('directions_run'),ic('hail'),ic('car_crash'),ic('tire_repair'),ic('no_crash'),ic('local_shipping'),ic('forklift')],
            comida:       [ic('restaurant'),ic('fastfood'),ic('local_pizza'),ic('lunch_dining'),ic('dinner_dining'),ic('coffee'),ic('local_cafe'),ic('local_bar'),ic('liquor'),ic('wine_bar'),ic('icecream'),ic('bakery_dining'),ic('food_bank'),ic('set_meal'),ic('takeout_dining'),ic('local_grocery_store'),ic('shopping_cart'),ic('outdoor_grill'),ic('free_breakfast'),ic('ramen_dining'),ic('rice_bowl'),ic('brunch_dining'),ic('breakfast_dining'),ic('cookie'),ic('cake'),ic('dining'),ic('egg'),ic('egg_alt'),ic('kebab_dining'),ic('tapas'),ic('bento'),ic('flatware'),ic('kitchen'),ic('blender')],
            ocio:         [ic('sports_esports'),ic('videogame_asset'),ic('movie'),ic('music_note'),ic('headphones'),ic('celebration'),ic('nightlife'),ic('theater_comedy'),ic('casino'),ic('toys'),ic('sports_soccer'),ic('sports_basketball'),ic('sports_tennis'),ic('sports_volleyball'),ic('sports_football'),ic('sports_baseball'),ic('sports_cricket'),ic('sports_golf'),ic('sports_handball'),ic('sports_hockey'),ic('sports_mma'),ic('sports_motorsports'),ic('sports_rugby'),ic('exercise'),ic('pool'),ic('beach_access'),ic('park'),ic('hiking'),ic('spa'),ic('attractions'),ic('confirmation_number'),ic('emoji_events'),ic('music_video'),ic('radio'),ic('mic'),ic('album'),ic('palette'),ic('draw'),ic('brush'),ic('photo'),ic('camera_alt'),ic('art_track'),ic('audiotrack'),ic('queue_music'),ic('star'),ic('auto_awesome'),ic('mood'),ic('sentiment_very_satisfied'),ic('favorite'),ic('local_movies'),ic('live_tv'),ic('tv'),ic('gamepad'),ic('surfing'),ic('snowboarding'),ic('skiing'),ic('skateboarding'),ic('golf_course'),ic('sailing'),ic('kayaking'),ic('forest'),ic('piano'),ic('celebration'),ic('local_activity'),ic('festival'),ic('stadium'),ic('local_play'),ic('sports'),ic('downhill_skiing'),ic('nordic_walking'),ic('paragliding'),ic('kitesurfing'),ic('ice_skating'),ic('sledding'),ic('roller_skating'),ic('sports_gymnastics'),ic('sports_martial_arts'),ic('badminton'),ic('rowing')],
            tecnologia:   [ic('computer'),ic('laptop'),ic('smartphone'),ic('tablet'),ic('watch'),ic('headset'),ic('keyboard'),ic('mouse'),ic('monitor'),ic('tv'),ic('speaker'),ic('router'),ic('print'),ic('scanner'),ic('camera'),ic('videocam'),ic('mic'),ic('usb'),ic('memory'),ic('storage'),ic('cloud'),ic('wifi'),ic('bluetooth'),ic('battery_charging_full'),ic('phonelink'),ic('devices'),ic('cast'),ic('developer_board'),ic('code'),ic('terminal'),ic('build'),ic('settings'),ic('tune'),ic('precision_manufacturing'),ic('security'),ic('lock'),ic('dns'),ic('hub'),ic('cable'),ic('network_check'),ic('speed'),ic('hardware'),ic('nfc'),ic('satellite'),ic('electric_bolt'),ic('power'),ic('electrical_services'),ic('outlet'),ic('smart_toy'),ic('data_object'),ic('api'),ic('earbuds'),ic('headphones_battery'),ic('smart_display'),ic('smart_screen'),ic('desktop_mac'),ic('desktop_windows'),ic('laptop_chromebook'),ic('phone_android'),ic('phone_iphone'),ic('tablet_android'),ic('tv_off'),ic('connected_tv'),ic('cast_connected'),ic('airplay'),ic('device_hub'),ic('devices_other'),ic('dock'),ic('gamepad'),ic('keyboard_alt'),ic('developer_mode'),ic('code_blocks'),ic('database'),ic('cloud_sync'),ic('cloud_upload'),ic('cloud_download'),ic('cloud_done'),ic('wifi_calling'),ic('bluetooth_audio'),ic('adb'),ic('bug_report'),ic('javascript'),ic('html'),ic('css'),ic('csv'),ic('pdf'),ic('hard_drive'),ic('sd_storage'),ic('sim_card'),ic('battery_full'),ic('battery_saver'),ic('nfc'),ic('radar'),ic('satellite_alt'),ic('sensors'),ic('sensors_off'),ic('qr_code'),ic('qr_code_scanner')],
            salud:        [ic('local_hospital'),ic('medical_services'),ic('medication'),ic('vaccines'),ic('health_and_safety'),ic('favorite'),ic('monitor_heart'),ic('healing'),ic('local_pharmacy'),ic('psychology'),ic('exercise'),ic('accessibility'),ic('accessible'),ic('sanitizer'),ic('sick'),ic('biotech'),ic('science'),ic('elderly'),ic('pregnant_woman'),ic('child_care'),ic('self_improvement'),ic('spa'),ic('emergency'),ic('bloodtype'),ic('stethoscope'),ic('thermostat'),ic('directions_run'),ic('directions_walk'),ic('pool'),ic('hot_tub'),ic('masks'),ic('health_and_beauty'),ic('health_cross'),ic('health_metrics'),ic('cardiology'),ic('ecg'),ic('ecg_heart'),ic('weight'),ic('monitor_weight'),ic('avg_pace'),ic('medication_liquid')],
            trabajo:      [ic('work'),ic('business_center'),ic('corporate_fare'),ic('badge'),ic('business'),ic('groups'),ic('people'),ic('person'),ic('assignment'),ic('assignment_ind'),ic('contact_mail'),ic('contacts'),ic('email'),ic('phone'),ic('call'),ic('campaign'),ic('support_agent'),ic('headset_mic'),ic('meeting_room'),ic('co_present'),ic('present_to_all'),ic('schedule'),ic('event'),ic('calendar_today'),ic('today'),ic('date_range'),ic('alarm'),ic('inventory_2'),ic('folder'),ic('description'),ic('article'),ic('inbox'),ic('send'),ic('event_note'),ic('done_all'),ic('manage_accounts'),ic('supervisor_account'),ic('engineering'),ic('architecture'),ic('science'),ic('biotech'),ic('psychology'),ic('school'),ic('work_history'),ic('apartment'),ic('domain'),ic('store'),ic('factory'),ic('agriculture'),ic('precision_manufacturing'),ic('warehouse'),ic('inventory'),ic('label'),ic('local_offer'),ic('sell'),ic('handshake'),ic('groups_2'),ic('groups_3'),ic('diversity_1'),ic('diversity_2'),ic('diversity_3'),ic('corporate_fare'),ic('domain_verification'),ic('checklist'),ic('task_alt'),ic('assignment_turned_in'),ic('grading'),ic('pending_actions'),ic('calendar_month'),ic('event_available'),ic('event_busy'),ic('event_repeat'),ic('contact_emergency'),ic('contact_page'),ic('contact_phone'),ic('manage_history'),ic('manage_accounts'),ic('record_voice_over'),ic('voice_over_off'),ic('interpreter_mode'),ic('elevator'),ic('stairs')],
            educacion:    [ic('school'),ic('menu_book'),ic('import_contacts'),ic('auto_stories'),ic('book'),ic('library_books'),ic('local_library'),ic('history_edu'),ic('science'),ic('calculate'),ic('functions'),ic('architecture'),ic('engineering'),ic('psychology'),ic('article'),ic('description'),ic('grading'),ic('assignment'),ic('folder'),ic('code'),ic('quiz'),ic('spellcheck'),ic('draw'),ic('edit'),ic('brush'),ic('palette'),ic('biotech'),ic('agriculture'),ic('format_shapes'),ic('text_fields'),ic('title'),ic('subject'),ic('note'),ic('notes'),ic('sticky_note_2'),ic('post_add'),ic('create'),ic('border_color'),ic('format_bold'),ic('format_italic'),ic('format_underlined'),ic('format_list_bulleted'),ic('format_list_numbered'),ic('bar_chart'),ic('timeline'),ic('map'),ic('public'),ic('language'),ic('translate'),ic('flag'),ic('search'),ic('abc'),ic('font_download'),ic('format_size'),ic('format_color_text'),ic('format_paint'),ic('edit_note'),ic('add_comment'),ic('comment_bank'),ic('library_music'),ic('music_note'),ic('audiotrack'),ic('auto_stories'),ic('checklist'),ic('checklist_rtl'),ic('spellcheck'),ic('subscript'),ic('superscript'),ic('format_strikethrough'),ic('format_quote')],
            compras:      [ic('shopping_cart'),ic('shopping_bag'),ic('store'),ic('storefront'),ic('local_mall'),ic('local_grocery_store'),ic('shopping_basket'),ic('add_shopping_cart'),ic('card_giftcard'),ic('featured_seasonal_and_gifts'),ic('redeem'),ic('loyalty'),ic('style'),ic('checkroom'),ic('category'),ic('inventory'),ic('widgets'),ic('local_offer'),ic('new_releases'),ic('receipt'),ic('warehouse'),ic('shop'),ic('sell'),ic('point_of_sale'),ic('watch'),ic('dry_cleaning'),ic('local_laundry_service'),ic('iron'),ic('soap'),ic('spa'),ic('diamond'),ic('redeem'),ic('card_membership'),ic('card_travel'),ic('price_change'),ic('price_check'),ic('local_convenience_store'),ic('store_mall_directory'),ic('shopping_cart_checkout'),ic('remove_shopping_cart'),ic('add_shopping_cart'),ic('production_quantity_limits'),ic('pet_supplies')],
            viajes:       [ic('flight'),ic('flight_takeoff'),ic('flight_land'),ic('luggage'),ic('travel_explore'),ic('map'),ic('explore'),ic('public'),ic('language'),ic('tour'),ic('attractions'),ic('place'),ic('location_on'),ic('location_city'),ic('hotel'),ic('beach_access'),ic('pool'),ic('airport_shuttle'),ic('local_taxi'),ic('directions'),ic('navigation'),ic('landscape'),ic('park'),ic('mosque'),ic('church'),ic('museum'),ic('stadium'),ic('theater_comedy'),ic('camera_alt'),ic('photo_album'),ic('bookmarks'),ic('bookmark'),ic('flag'),ic('hiking'),ic('cottage'),ic('villa'),ic('forest'),ic('water'),ic('waves'),ic('sailing'),ic('kayaking'),ic('surfing'),ic('skiing'),ic('snowboarding'),ic('motorcycle'),ic('rv_hookup'),ic('temple_buddhist'),ic('synagogue'),ic('castle'),ic('fort'),ic('mosque'),ic('no_luggage'),ic('airplanemode_active'),ic('airlines'),ic('airplane_ticket'),ic('flight_class'),ic('connecting_airports'),ic('rate_review'),ic('local_see'),ic('my_location'),ic('edit_location'),ic('pin_drop'),ic('near_me'),ic('streetview'),ic('360'),ic('vrpano'),ic('photo_camera'),ic('photo_library'),ic('beenhere'),ic('signpost'),ic('route')],
            naturaleza:   [ic('park'),ic('forest'),ic('grass'),ic('nature'),ic('eco'),ic('water_drop'),ic('yard'),ic('local_florist'),ic('wb_sunny'),ic('cloud'),ic('wb_cloudy'),ic('ac_unit'),ic('agriculture'),ic('bug_report'),ic('anchor'),ic('waves'),ic('landscape'),ic('terrain'),ic('thunderstorm'),ic('nightlight'),ic('light_mode'),ic('dark_mode'),ic('solar_power'),ic('air'),ic('fireplace'),ic('recycling'),ic('compost'),ic('energy_savings_leaf'),ic('water'),ic('flood'),ic('landslide'),ic('tornado'),ic('cyclone'),ic('tsunami'),ic('volcano'),ic('earthquake'),ic('severe_cold'),ic('snowing'),ic('foggy'),ic('sunny'),ic('clear_day'),ic('clear_night'),ic('wind_power'),ic('heat'),ic('heat_pump'),ic('gas_meter'),ic('electric_meter'),ic('oil_barrel'),ic('propane'),ic('propane_tank'),ic('cruelty_free'),ic('emoji_nature'),ic('nature_people'),ic('hive'),ic('potted_plant'),ic('psychiatry'),ic('temp_preferences_eco'),ic('nest_eco_leaf')],
            personas:     [ic('person'),ic('people'),ic('groups'),ic('family_restroom'),ic('child_care'),ic('elderly'),ic('pregnant_woman'),ic('accessibility'),ic('accessible'),ic('face'),ic('face_2'),ic('face_3'),ic('face_4'),ic('face_5'),ic('face_6'),ic('mood'),ic('mood_bad'),ic('favorite'),ic('volunteer_activism'),ic('support'),ic('help'),ic('contact_mail'),ic('account_circle'),ic('person_add'),ic('waving_hand'),ic('diversity_3'),ic('child_friendly'),ic('group_add'),ic('handshake'),ic('emoji_people'),ic('accessibility_new'),ic('directions_walk'),ic('directions_run'),ic('self_improvement'),ic('sentiment_satisfied'),ic('sentiment_dissatisfied'),ic('sentiment_neutral'),ic('sentiment_very_satisfied'),ic('sentiment_very_dissatisfied'),ic('pets'),ic('baby_changing_station'),ic('elderly_woman'),ic('folded_hands'),ic('back_hand'),ic('front_hand'),ic('sign_language'),ic('waving_hand'),ic('pan_tool'),ic('man'),ic('woman'),ic('boy'),ic('girl'),ic('transgender'),ic('female'),ic('male'),ic('person_2'),ic('person_3'),ic('person_4'),ic('person_off'),ic('person_remove'),ic('people_alt'),ic('group_off'),ic('group_remove'),ic('no_accounts'),ic('switch_account'),ic('diversity_1'),ic('diversity_2'),ic('social_distance')],
            herramientas: [ic('content_cut'),ic('straighten'),ic('square_foot'),ic('handyman'),ic('build'),ic('construction'),ic('architecture'),ic('engineering'),ic('design_services'),ic('brush'),ic('palette'),ic('format_paint'),ic('wallpaper'),ic('texture'),ic('layers'),ic('grid_view'),ic('view_in_ar'),ic('view_module'),ic('space_dashboard'),ic('dashboard'),ic('dashboard_2'),ic('widgets'),ic('tune'),ic('settings'),ic('search'),ic('find_replace'),ic('verified'),ic('fact_check'),ic('task'),ic('add_task'),ic('assignment_turned_in'),ic('pending_actions'),ic('work_history'),ic('build_circle'),ic('plumbing'),ic('electrical_services'),ic('hardware'),ic('home_repair_service'),ic('carpenter'),ic('straighten'),ic('square_foot'),ic('design_services'),ic('edit_note'),ic('edit_attributes'),ic('edit_off'),ic('content_paste'),ic('content_paste_go'),ic('content_copy'),ic('undo'),ic('redo'),ic('save'),ic('save_as'),ic('backup'),ic('restore'),ic('delete'),ic('delete_forever'),ic('delete_sweep'),ic('archive'),ic('unarchive'),ic('compress'),ic('expand'),ic('zoom_in'),ic('zoom_out'),ic('fullscreen'),ic('fullscreen_exit'),ic('refresh'),ic('sync'),ic('sync_alt'),ic('autorenew'),ic('cached'),ic('published_with_changes'),ic('rule'),ic('done'),ic('close'),ic('add'),ic('remove'),ic('add_circle'),ic('remove_circle'),ic('cancel'),ic('check_circle'),ic('error'),ic('warning'),ic('info'),ic('help'),ic('help_center'),ic('feedback'),ic('report'),ic('bug_report'),ic('power_settings_new'),ic('lock'),ic('lock_open'),ic('security'),ic('shield'),ic('admin_panel_settings'),ic('manage_accounts'),ic('account_circle'),ic('logout'),ic('login'),ic('vpn_key'),ic('fingerprint')]
        };
        const _seenIcons = new Set();
        const todosLosIconos = Object.values(iconosPorCategoria).flat().filter(ic => {
            if (_seenIcons.has(ic.n)) return false;
            _seenIcons.add(ic.n);
            return true;
        });

        let iconoTemporal = null;
        let colorTemporal = '#ffffff';
        let bgColorTemporal = '#10b981';
        let bgOpacityTemporal = 100;
        let elementoIconoActual = null;
        let tipoElementoActual = null; // 'seccion' o null
        window._setTipoElementoActual = function(val) { tipoElementoActual = val; };

        function abrirSelectorIconoPrincipal(elemento) {
            elementoIconoActual = elemento;
            tipoElementoActual = 'principal';
            abrirModalIconos();
            mostrarCategoriaIconos('todos');
            
            const iconoActual = elemento.querySelector('.material-symbols-rounded').textContent.trim();
            colorTemporal = '#6366f1'; // Color índigo por defecto
            iconoTemporal = null;
            
            const preview = document.getElementById('iconoPreview');
            if (preview) { preview.textContent = iconoActual; }
            preview.style.color = '#ffffff';
            { const _el = document.getElementById('nombreIconoPreview'); if (_el) _el.textContent = iconoActual; }
        }
        function attachIconLongPress(elemento, callback) {
            let pressTimer = null;
            let hasMoved = false;
            let startX = 0;
            let startY = 0;
            elemento.addEventListener('mousedown', function(e) {
                if (e.button !== 0) return;
                
                hasMoved = false;
                startX = e.clientX;
                startY = e.clientY;
                
                pressTimer = setTimeout(() => {
                    if (!hasMoved) {
                        if (navigator.vibrate) navigator.vibrate(50);
                        callback(elemento);
                    }
                }, 500); // 500ms para desktop
            });
            
            elemento.addEventListener('mousemove', function(e) {
                if (pressTimer) {
                    const deltaX = Math.abs(e.clientX - startX);
                    const deltaY = Math.abs(e.clientY - startY);
                    if (deltaX > 10 || deltaY > 10) {
                        hasMoved = true;
                        clearTimeout(pressTimer);
                        pressTimer = null;
                    }
                }
            });
            
            elemento.addEventListener('mouseup', function() {
                if (pressTimer) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                }
            });
            
            elemento.addEventListener('mouseleave', function() {
                if (pressTimer) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                }
            });
            elemento.addEventListener('touchstart', function(e) {
                hasMoved = false;
                const touch = e.touches[0];
                startX = touch.clientX;
                startY = touch.clientY;
                
                pressTimer = setTimeout(() => {
                    if (!hasMoved) {
                        if (navigator.vibrate) navigator.vibrate(50);
                        callback(elemento);
                    }
                }, 500); // 500ms para móvil
            }, { passive: true });
            
            elemento.addEventListener('touchmove', function(e) {
                if (pressTimer) {
                    const touch = e.touches[0];
                    const deltaX = Math.abs(touch.clientX - startX);
                    const deltaY = Math.abs(touch.clientY - startY);
                    if (deltaX > 10 || deltaY > 10) {
                        hasMoved = true;
                        clearTimeout(pressTimer);
                        pressTimer = null;
                    }
                }
            }, { passive: true });
            
            elemento.addEventListener('touchend', function() {
                if (pressTimer) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                }
            }, { passive: true });
            
            elemento.addEventListener('touchcancel', function() {
                if (pressTimer) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                }
            }, { passive: true });
        }
        
        function abrirSelectorIconos(elemento) {
            elementoIconoActual = elemento;
            tipoElementoActual = null;
            abrirModalIconos();
            mostrarCategoriaIconos('todos');
            const imgActual = elemento.querySelector('img');
            const iconSpan = elemento.querySelector('.material-symbols-rounded, .material-symbols-rounded');
            
            if (imgActual && imgActual.src && imgActual.src.startsWith('data:')) {
                mostrarOpcionImagen();
                const imgPreview = document.getElementById('imgPreviewMiniatura');
                const previewContainer = document.getElementById('previewMiniatura');
                const noPreviewContainer = document.getElementById('noPreviewMiniatura');
                
                if (imgPreview) {
                    imgPreview.src = imgActual.src;
                }
                if (previewContainer) previewContainer.style.display = 'block';
                if (noPreviewContainer) noPreviewContainer.style.display = 'none';
                _actualizarHeaderPreview('imagen');
            } else {
                mostrarOpcionIcono();
                const noPreviewContainer = document.getElementById('noPreviewMiniatura');
                const previewContainer = document.getElementById('previewMiniatura');
                if (noPreviewContainer) noPreviewContainer.style.display = 'block';
                if (previewContainer) previewContainer.style.display = 'none';
                
                const iconoActual = iconSpan ? iconSpan.textContent.trim() : 'apps';
                const card = elemento.closest('.card-input-group, [data-color-icono]');
                const colorActual = card?.dataset?.colorIcono || elemento.dataset?.colorIcono || iconSpan?.style?.color || elemento.style.color || '#ffffff';
                let bgColorActual = card?.dataset?.bgColor || elemento.dataset?.bgColor || null;
                if (!bgColorActual) {
                    const cs = getComputedStyle(elemento);
                    const bgCs = cs.backgroundColor || '';
                    const rgbaM = bgCs.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                    if (rgbaM && !(parseFloat(rgbaM[4]||'1') < 0.05)) {
                        const toHex = n => parseInt(n).toString(16).padStart(2,'0');
                        bgColorActual = '#' + toHex(rgbaM[1]) + toHex(rgbaM[2]) + toHex(rgbaM[3]);
                    } else {
                        bgColorActual = '#1e293b';
                    }
                }

                colorTemporal = colorActual;
                bgColorTemporal = bgColorActual;
                bgOpacityTemporal = 100;
                iconoTemporal = iconoActual !== 'apps' ? iconoActual : null;

                const preview = document.getElementById('iconoPreview');
                if (preview) {
                    preview.textContent = iconoActual;
                    preview.style.color = colorTemporal;
                    preview.classList.remove('text-slate-600');
                }
                { const _el = document.getElementById('nombreIconoPreview'); if (_el) _el.textContent = iconoActual !== 'apps' ? iconoActual.replace(/_/g,' ') : 'Selecciona un icono'; }
                actualizarPrevisualizacionIcono();
            }
        }

        function abrirSelectorIconoSeccion(elemento, colorBase) {
            elementoIconoActual = elemento;
            tipoElementoActual = 'seccion';
            mostrarCategoriaIconos('todos');

            const coloresTailwind = {
                'emerald': '#10b981', 'blue': '#3b82f6', 'red': '#ef4444',
                'orange': '#fb923c', 'purple': '#a855f7', 'indigo': '#4f46e5', 'rose': '#f43f5e'
            };
            const iconoActual = elemento.textContent.trim();
            let iconColorActual = elemento.style.color || '';
            if (!iconColorActual) {
                const colorClass = Array.from(elemento.classList).find(c => c.startsWith('text-') && c.includes('-'));
                if (colorClass) {
                    const match = colorClass.match(/text-(\w+)-\d+/);
                    if (match) iconColorActual = coloresTailwind[match[1]] || coloresTailwind[colorBase] || '#10b981';
                }
            }
            if (!iconColorActual) iconColorActual = coloresTailwind[colorBase] || '#10b981';
            const divPadre = elemento.closest('[data-icon-selector]') || elemento.parentElement;
            const bgStyle = divPadre ? (divPadre.style.background || divPadre.style.backgroundColor || '') : '';
            let bgColorActual = '#0f172a';
            const rgbaMatch = bgStyle.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            const hexMatch  = bgStyle.match(/#[0-9a-fA-F]{6}/);
            if (rgbaMatch) {
                const toHex = n => parseInt(n).toString(16).padStart(2,'0');
                bgColorActual = '#' + toHex(rgbaMatch[1]) + toHex(rgbaMatch[2]) + toHex(rgbaMatch[3]);
            } else if (hexMatch) {
                bgColorActual = hexMatch[0];
            }

            colorTemporal     = iconColorActual;
            bgColorTemporal   = bgColorActual;
            bgOpacityTemporal = 100;
            iconoTemporal     = iconoActual;

            const preview   = document.getElementById('iconoPreview');
            const previewBg = document.getElementById('iconoPreviewBg');
            if (preview) { preview.textContent = iconoActual; preview.style.color = iconColorActual; }
            if (previewBg) { const rgb = _hexToRgb(bgColorActual); previewBg.style.background = `rgba(${rgb},1.00)`; }
            { const _el = document.getElementById('nombreIconoPreview'); if (_el) _el.textContent = iconoActual; }

            abrirModalIconos();
        }

        function abrirSelectorIconosBanco(elemento) {
            elementoIconoActual = elemento;
            mostrarCategoriaIconos('finanzas');
            const imgActual = elemento.querySelector('img');
            const iconSpan = elemento.querySelector('.material-symbols-rounded, .material-symbols-rounded');
            
            if (imgActual && imgActual.src && imgActual.src.startsWith('data:')) {
                mostrarOpcionImagen();
                const imgPreview = document.getElementById('imgPreviewMiniatura');
                const previewContainer = document.getElementById('previewMiniatura');
                const noPreviewContainer = document.getElementById('noPreviewMiniatura');
                
                if (imgPreview) {
                    imgPreview.src = imgActual.src;
                }
                if (previewContainer) previewContainer.style.display = 'block';
                if (noPreviewContainer) noPreviewContainer.style.display = 'none';
            } else {
                mostrarOpcionIcono();
                const noPreviewContainer = document.getElementById('noPreviewMiniatura');
                const previewContainer = document.getElementById('previewMiniatura');
                if (noPreviewContainer) noPreviewContainer.style.display = 'block';
                if (previewContainer) previewContainer.style.display = 'none';
                const iconSpanActual = elemento.querySelector('.material-symbols-rounded');
                const iconoActual = iconSpanActual ? iconSpanActual.textContent.trim() : null;
                const iconColorActual = '#ffffff';
                const bgStyle = elemento.style.background || elemento.style.backgroundColor || '';
                let bgColorActual = '#1e293b';
                const hexMatch = bgStyle.match(/#[0-9a-fA-F]{6}/);
                const rgbaMatch = bgStyle.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                if (hexMatch) {
                    bgColorActual = hexMatch[0];
                } else if (rgbaMatch) {
                    const toHex = n => parseInt(n).toString(16).padStart(2,'0');
                    bgColorActual = '#' + toHex(rgbaMatch[1]) + toHex(rgbaMatch[2]) + toHex(rgbaMatch[3]);
                }

                colorTemporal     = iconColorActual;
                bgColorTemporal   = bgColorActual;
                bgOpacityTemporal = 100;
                iconoTemporal     = iconoActual;

                const preview   = document.getElementById('iconoPreview');
                const previewBg = document.getElementById('iconoPreviewBg');
                if (preview) {
                    preview.textContent = iconoActual || 'apps';
                    preview.style.color = iconColorActual;
                    preview.classList.toggle('text-slate-600', !iconoActual);
                }
                if (previewBg) {
                    const rgb = _hexToRgb(bgColorActual);
                    previewBg.style.background = `rgba(${rgb},1.00)`;
                }
                { const _el = document.getElementById('nombreIconoPreview'); if (_el) _el.textContent = iconoActual ? iconoActual.replace(/_/g,' ') : 'Selecciona un icono'; }
            }
            abrirModalIconos();
        }

        function toggleBusquedaMovil() {
            const container = document.getElementById('buscadorContainer');
            const input = document.getElementById('buscadorIconos');
            const btn = document.getElementById('btnBuscarMovil');
            const isVisible = !container.classList.contains('hidden');
            if (isVisible) {
                container.classList.add('hidden');
                input.value = '';
                buscarIconos('');
                btn.querySelector('.material-symbols-rounded').textContent = 'search';
            } else {
                container.classList.remove('hidden');
                btn.querySelector('.material-symbols-rounded').textContent = 'search_off';
                setTimeout(() => input.focus(), 50);
            }
        }

        function abrirModalIconos() {
            const modal = document.getElementById('modalIconos');
            const inner = document.getElementById('modalIconosInner');
            modal.style.display = 'flex';
            const catContainer = document.getElementById('catBtnsContainer');
            if (catContainer && !catContainer._dragInited) {
                catContainer._dragInited = true;
                let isDown = false, startX, scrollLeft;
                catContainer.addEventListener('mousedown', e => {
                    isDown = true;
                    catContainer.style.cursor = 'grabbing';
                    startX = e.pageX - catContainer.offsetLeft;
                    scrollLeft = catContainer.scrollLeft;
                    e.preventDefault();
                });
                document.addEventListener('mouseup', () => {
                    isDown = false;
                    catContainer.style.cursor = 'grab';
                });
                catContainer.addEventListener('mousemove', e => {
                    if (!isDown) return;
                    const x = e.pageX - catContainer.offsetLeft;
                    catContainer.scrollLeft = scrollLeft - (x - startX);
                });
                catContainer.addEventListener('mouseleave', () => {
                    isDown = false;
                    catContainer.style.cursor = 'grab';
                });
            }
            ['acordeonIconos','acordeonColorFondo','acordeonColorIcono'].forEach(id => {
                const p = document.getElementById(id); if (p) p.style.display = 'none';
            });
            ['chevronIconos','chevronColorFondo','chevronColorIcono'].forEach(id => {
                const c = document.getElementById(id); if (c) c.style.transform = 'rotate(0deg)';
            });
            const prevFondo = document.getElementById('previewColorFondo');
            if (prevFondo && bgColorTemporal) prevFondo.style.background = bgColorTemporal;
            const prevIcono = document.getElementById('previewColorIcono');
            if (prevIcono && colorTemporal) prevIcono.style.background = colorTemporal;
            document.querySelectorAll('[data-bg]').forEach(btn => {
                btn.style.outline = btn.dataset.bg === bgColorTemporal ? '3px solid white' : 'none';
                btn.style.outlineOffset = '2px';
            });
            document.querySelectorAll('[data-color]').forEach(btn => {
                btn.style.outline = btn.dataset.color === colorTemporal ? '3px solid white' : 'none';
                btn.style.outlineOffset = '2px';
            });

            const _vh = window.innerHeight;
            inner.style.height = 'auto';
            inner.style.maxHeight = Math.floor(_vh * 0.88) + 'px';
            inner.style.minHeight = '200px';
            inner.style.borderRadius = '1.5rem';
            modal.style.alignItems = 'center';
            modal.style.paddingBottom = '16px';
            modal.style.paddingTop = '16px';
            modal.style.paddingLeft = '16px';
            modal.style.paddingRight = '16px';
            const bi = document.getElementById('buscadorIconos');
            if (bi) { bi.value = ''; buscarIconos(''); }
        }

        function cerrarModalIconos() {
            document.getElementById('modalIconos').style.display = 'none';
            cerrarColorPickerPersonalizado();
            iconoTemporal = null;
            _svgDataTemporal = null;
            fontClassTemporal = null;
            const inputImagen = document.getElementById('inputImagenMiniatura');
            const inputCambiar = document.getElementById('inputCambiarImagen');
            const imgPreview = document.getElementById('imgPreviewMiniatura');
            const previewContainer = document.getElementById('previewMiniatura');
            const noPreviewContainer = document.getElementById('noPreviewMiniatura');
            
            if (inputImagen) inputImagen.value = '';
            if (inputCambiar) inputCambiar.value = '';
            if (imgPreview) imgPreview.src = '';
            if (previewContainer) previewContainer.style.display = 'none';
            if (noPreviewContainer) noPreviewContainer.style.display = 'block';
            
            if (tipoElementoActual === 'reforma-card') {
                tipoElementoActual = null;
                _cardMiniaturaActual = null;
            }
        }

        function renderIconos(iconos) {
            const grid = document.getElementById('iconGrid');
            const empty = document.getElementById('iconGridEmpty');
            grid.innerHTML = '';
            if (!iconos || iconos.length === 0) {
                empty.style.display = 'block';
                return;
            }
            empty.style.display = 'none';
            iconos.forEach(ic => {
                const nombre = typeof ic === 'string' ? ic : ic.n;
                const isSvg = ic && ic.f === 'svg';
                const fontClass = isSvg ? 'custom-svg' : 'material-symbols-rounded';
                const extraStyle = !isSvg ? 'font-variation-settings:"FILL" 0,"wght" 300,"GRAD" 0,"opsz" 24;' : '';

                const btn = document.createElement('button');
                btn.style.cssText = 'width:52px;height:52px;display:flex;align-items:center;justify-content:center;border-radius:12px;border:1.5px solid rgba(255,255,255,0.06);background:rgba(15,23,42,0.5);cursor:pointer;transition:all 0.15s;box-sizing:border-box;overflow:hidden;';
                btn.title = nombre.replace(/_/g, ' ');
                btn.dataset.fontClass = fontClass;

                let innerEl;
                if (isSvg) {
                    innerEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    innerEl.setAttribute('viewBox', ic.vb);
                    innerEl.setAttribute('width', '32'); innerEl.setAttribute('height', '32');
                    innerEl.style.cssText = 'color:#64748b;fill:currentColor;pointer-events:none;flex-shrink:0;';
                    innerEl.innerHTML = ic.svg;
                    btn.dataset.svgData = JSON.stringify({ vb: ic.vb, svg: ic.svg });
                } else {
                    innerEl = document.createElement('span');
                    innerEl.className = fontClass;
                    innerEl.style.cssText = `font-size:24px;color:#64748b;pointer-events:none;line-height:1;white-space:nowrap;overflow:hidden;width:24px;height:24px;display:flex;align-items:center;justify-content:center;${extraStyle}`;
                    innerEl.textContent = nombre;
                }
                btn.appendChild(innerEl);

                btn.onmouseenter = () => {
                    if (!btn.classList.contains('selected-icon')) {
                        btn.style.background = 'rgba(59,130,246,0.12)';
                        btn.style.borderColor = 'rgba(59,130,246,0.35)';
                        innerEl.style.color = '#93c5fd';
                    }
                };
                btn.onmouseleave = () => {
                    if (!btn.classList.contains('selected-icon')) {
                        btn.style.background = 'rgba(15,23,42,0.5)';
                        btn.style.borderColor = 'rgba(255,255,255,0.06)';
                        innerEl.style.color = '#64748b';
                    }
                };
                btn.onclick = () => seleccionarIcono(nombre, btn, fontClass, isSvg ? { vb: ic.vb, svg: ic.svg } : null);
                grid.appendChild(btn);
            });
        }

        function mostrarCategoriaIconos(categoria) {
            const buscador = document.getElementById('buscadorIconos');
            if (buscador) buscador.value = '';
            
            document.querySelectorAll('.cat-btn').forEach(b => {
                b.style.background = 'rgba(255,255,255,0.04)';
                b.style.borderColor = 'rgba(255,255,255,0.08)';
                b.style.color = '#64748b';
            });
            
            const activeBtn = document.querySelector(`.cat-btn[data-cat="${categoria}"]`);
            if (activeBtn) {
                activeBtn.style.background = 'rgba(59,130,246,0.15)';
                activeBtn.style.borderColor = 'rgba(59,130,246,0.5)';
                activeBtn.style.color = '#60a5fa';
            }

            const iconos = categoria === 'todos' ? todosLosIconos : (iconosPorCategoria[categoria] || []);
            renderIconos(iconos);
        }
        const diccionarioES = {
            'tijeras': ['content_cut','scissors'],
            'tijera': ['content_cut','scissors'],
            'cortar': ['content_cut','scissors'],
            'corte': ['content_cut','scissors'],
            'alquiler': ['vpn_key','key','real_estate_agent','home_work','house','apartment','other_houses'],
            'alquilar': ['vpn_key','key','real_estate_agent','home_work'],
            'llave': ['vpn_key','key','lock','lock_open'],
            'arrendamiento': ['vpn_key','key','real_estate_agent','contract'],
            'inquilino': ['vpn_key','key','person','real_estate_agent'],
            'renta': ['vpn_key','key','receipt_long','paid','euro'],
            'piso': ['apartment','home','house','vpn_key'],
            'contrato': ['contract','note_alt','description','assignment'],

            'hucha': ['savings'],
            'cerdito': ['savings'],
            'ahorro': ['savings','account_balance_wallet','wallet'],
            'banco': ['account_balance','local_atm','payments','bizum'],
            'bizum': ['bizum','payments','contactless'],
            'tarjeta': ['credit_card','payment'],
            'credito': ['credit_card'],
            'debito': ['credit_card'],
            'pago': ['payment','paid','point_of_sale','contactless'],
            'cobro': ['paid','point_of_sale','receipt'],
            'factura': ['receipt_long','receipt','request_quote','description'],
            'ticket': ['receipt','confirmation_number'],
            'presupuesto': ['calculate','request_quote','account_balance_wallet'],
            'inversion': ['show_chart','trending_up','bar_chart','insights'],
            'inversión': ['show_chart','trending_up','bar_chart','insights'],
            'bolsa': ['show_chart','candlestick_chart','ssid_chart'],
            'acciones': ['show_chart','trending_up','candlestick_chart'],
            'bitcoin': ['currency_bitcoin'],
            'crypto': ['currency_bitcoin','currency_exchange'],
            'porcentaje': ['percent'],
            'grafica': ['bar_chart','pie_chart','show_chart','donut_large'],
            'gráfica': ['bar_chart','pie_chart','show_chart','donut_large'],
            'estadistica': ['analytics','insights','bar_chart'],
            'estadística': ['analytics','insights','bar_chart'],
            'calculadora': ['calculate'],
            'impuesto': ['gavel','percent','receipt_long'],
            'hipoteca': ['account_balance','home','foundation','paid'],
            'prestamo': ['account_balance','payments','handshake'],
            'préstamo': ['account_balance','payments','handshake'],
            'nomina': ['receipt_long','work','euro'],
            'nómina': ['receipt_long','work','euro'],
            'sueldo': ['euro','paid','work'],
            'salario': ['euro','paid','work'],
            'casa': ['home','house','cottage','villa','cabin'],
            'piso': ['apartment','home','house'],
            'vivienda': ['home','house','apartment','villa'],
            'chalet': ['villa','house','cottage'],
            'cama': ['bed'],
            'dormitorio': ['bed','bedroom_child','living'],
            'sofa': ['weekend','sofa','living'],
            'sofá': ['weekend','sofa','living'],
            'silla': ['event_seat'],
            'mesa': ['table_restaurant','desk'],
            'cocina': ['kitchen','microwave','blender','countertops'],
            'bano': ['bathtub','bathtub'],
            'baño': ['bathtub','bathtub'],
            'ducha': ['bathtub'],
            'lampara': ['light','lightbulb'],
            'lámpara': ['light','lightbulb'],
            'bombilla': ['lightbulb','light'],
            'garaje': ['garage','directions_car'],
            'terraza': ['balcony','deck','yard'],
            'jardin': ['yard','grass','local_florist','park'],
            'jardín': ['yard','grass','local_florist','park'],
            'puerta': ['door_front','door_back','door_sliding','sensor_door'],
            'ventana': ['window','sensor_window'],
            'escaleras': ['stairs'],
            'calefaccion': ['heat','thermostat','hvac'],
            'calefacción': ['heat','thermostat','hvac'],
            'aire': ['ac_unit','hvac'],
            'limpieza': ['cleaning_services'],
            'valla': ['fence'],
            'techo': ['roofing'],
            'reforma': ['construction','build','hardware','home_repair_service'],
            'obra': ['construction','engineering','architecture'],
            'herramienta': ['build','hardware','handyman'],
            'fontaneria': ['plumbing'],
            'fontanería': ['plumbing'],
            'electricidad': ['electrical_services','bolt'],
            'pintura': ['format_paint','brush','palette'],
            'albañil': ['construction','build'],
            'carpintero': ['carpenter'],
            'suelo': ['floor','tile'],
            'azulejo': ['tile','texture'],
            'coche': ['directions_car','electric_car','car_rental'],
            'carro': ['directions_car'],
            'moto': ['two_wheeler','motorcycle','moped'],
            'bici': ['directions_bike','pedal_bike','electric_bike'],
            'bicicleta': ['directions_bike','pedal_bike'],
            'tren': ['train','directions_railway','tram'],
            'metro': ['subway','tram'],
            'bus': ['directions_bus','airport_shuttle'],
            'avion': ['flight','flight_takeoff','flight_land'],
            'avión': ['flight','flight_takeoff','flight_land'],
            'barco': ['sailing','directions_boat'],
            'gasolina': ['local_gas_station','ev_station'],
            'aparcamiento': ['local_parking'],
            'parking': ['local_parking'],
            'local_taxi': ['local_taxi','local_taxi'],
            'comida': ['restaurant','fastfood','food_bank'],
            'restaurante': ['restaurant','dinner_dining','dining'],
            'pizza': ['local_pizza'],
            'cafe': ['coffee','local_cafe'],
            'café': ['coffee','local_cafe'],
            'bar': ['local_bar','liquor','wine_bar'],
            'supermercado': ['local_grocery_store','shopping_cart'],
            'helado': ['icecream'],
            'tarta': ['bakery_dining'],
            'pan': ['bakery_dining'],
            'juego': ['sports_esports','videogame_asset','casino','toys'],
            'videojuego': ['sports_esports','videogame_asset'],
            'musica': ['music_note','headphones'],
            'música': ['music_note','headphones'],
            'cine': ['movie','movie'],
            'pelicula': ['movie','movie'],
            'película': ['movie','movie'],
            'futbol': ['sports_soccer'],
            'fútbol': ['sports_soccer'],
            'deporte': ['sports','exercise','sports_soccer','sports_basketball'],
            'gym': ['exercise'],
            'gimnasio': ['exercise'],
            'playa': ['beach_access'],
            'piscina': ['pool'],
            'fiesta': ['celebration','festival','nightlife'],
            'viaje': ['travel_explore','flight','luggage'],
            'ordenador': ['computer','laptop','monitor'],
            'movil': ['smartphone'],
            'móvil': ['smartphone'],
            'telefono': ['smartphone','phone','call'],
            'teléfono': ['smartphone','phone','call'],
            'tablet': ['tablet'],
            'camara': ['camera','photo_camera','videocam'],
            'cámara': ['camera','photo_camera','videocam'],
            'tele': ['tv','monitor'],
            'television': ['tv'],
            'televisión': ['tv'],
            'internet': ['wifi','router','cloud'],
            'nube': ['cloud'],
            'codigo': ['code','terminal','developer_board'],
            'código': ['code','terminal','developer_board'],
            'hospital': ['local_hospital','medical_services'],
            'medico': ['medical_services','local_hospital'],
            'médico': ['medical_services','local_hospital'],
            'medicina': ['medication','local_pharmacy'],
            'farmacia': ['local_pharmacy'],
            'corazon': ['favorite','monitor_heart'],
            'corazón': ['favorite','monitor_heart'],
            'salud': ['health_and_safety','favorite','medical_services'],
            'vacuna': ['vaccines'],
            'trabajo': ['work','business_center','corporate_fare'],
            'oficina': ['business_center','meeting_room','corporate_fare'],
            'reunión': ['meeting_room','groups','co_present'],
            'reunion': ['meeting_room','groups','co_present'],
            'correo': ['email','send','inbox','mark_email_read'],
            'email': ['email','forward_to_inbox'],
            'calendario': ['calendar_today','event','date_range','today'],
            'alarma': ['alarm','schedule'],
            'reloj': ['alarm','schedule','watch'],
            'persona': ['person','account_circle','face'],
            'gente': ['people','groups','diversity_3'],
            'empresa': ['business','corporate_fare','business_center'],
            'libro': ['book','menu_book','library_books'],
            'colegio': ['school'],
            'escuela': ['school'],
            'universidad': ['school','history_edu'],
            'ciencia': ['science','biotech'],
            'lapiz': ['edit','draw'],
            'lápiz': ['edit','draw'],
            'carpeta': ['folder'],
            'nota': ['description','article','assignment'],
            'planta': ['local_florist','nature','eco','yard'],
            'flor': ['local_florist'],
            'arbol': ['park','forest'],
            'árbol': ['park','forest'],
            'bosque': ['forest'],
            'agua': ['water_drop','waves'],
            'sol': ['wb_sunny','sunny'],
            'lluvia': ['wb_cloudy','cloudy'],
            'nieve': ['ac_unit','wb_cloudy'],
            'familia': ['family_restroom','diversity_3','groups'],
            'bebe': ['child_care','baby_changing_station'],
            'bebé': ['child_care'],
            'mascota': ['pets','pet_supplies'],
            'hueso': ['pet_supplies','pets'],
            'perro': ['pets'],
            'gato': ['pets'],
            'regalo': ['card_giftcard','featured_seasonal_and_gifts','redeem'],
            'amor': ['favorite','volunteer_activism'],
            'estrella': ['star','emoji_events'],
        };

        function buscarIconos(query) {
            const q = query.trim().toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // quitar tildes para busqueda
            document.querySelectorAll('.cat-btn').forEach(b => {
                b.style.background = 'rgb(30,41,59)';
                b.style.borderColor = 'rgb(51,65,85)';
                b.style.color = 'rgb(148,163,184)';
            });

            if (!q) {
                mostrarCategoriaIconos('todos');
                return;
            }

            const resultadosSet = new Set();
            for (const [palabra, iconos] of Object.entries(diccionarioES)) {
                const palabraNorm = palabra.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                if (palabraNorm.includes(q) || q.includes(palabraNorm)) {
                    iconos.forEach(i => resultadosSet.add(i));
                }
            }
            todosLosIconos.forEach(ic => {
                const nombre = ic.n.replace(/_/g, ' ');
                if (nombre.includes(q) || ic.n.includes(q.replace(/ /g, '_'))) {
                    resultadosSet.add(ic.n);
                }
            });
            const todosNombres = todosLosIconos.map(i => i.n);
            const resultados = [...resultadosSet]
                .filter(n => todosNombres.includes(n))
                .map(n => todosLosIconos.find(i => i.n === n));
            renderIconos(resultados);
        }

        let fontClassTemporal = 'material-symbols-rounded';

        let _svgDataTemporal = null;

        function seleccionarIcono(icono, btn, fontClass, svgData) {
            document.querySelectorAll('#iconGrid button').forEach(b => {
                b.classList.remove('selected-icon');
                b.style.borderColor = 'rgba(255,255,255,0.06)';
                b.style.background = 'rgba(15,23,42,0.5)';
                const s = b.querySelector('span,svg');
                if (s) s.style.color = '#64748b';
            });
            btn.classList.add('selected-icon');
            btn.style.borderColor = 'rgba(99, 241, 153, 0.6)';
            btn.style.background = 'rgba(99, 241, 153, 0.2)';
            const s = btn.querySelector('span,svg');
            if (s) s.style.color = '#89edbb';
            iconoTemporal = icono;
            _svgDataTemporal = svgData || null;
            fontClassTemporal = fontClass || btn.dataset.fontClass || 'material-symbols-rounded';
            actualizarPrevisualizacionIcono();
        }

        function toggleAcordeon(id) {
            const panel = document.getElementById(id);
            const chevronMap = { acordeonIconos: 'chevronIconos', acordeonColorFondo: 'chevronColorFondo', acordeonColorIcono: 'chevronColorIcono' };
            const chevron = document.getElementById(chevronMap[id]);
            const isOpen = panel.style.display !== 'none';
            panel.style.display = isOpen ? 'none' : 'block';
            if (chevron) chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        }

        function seleccionarColorFondo(color) {
            bgColorTemporal = color;
            document.querySelectorAll('[data-bg]').forEach(btn => {
                btn.style.outline = btn.dataset.bg === color ? '3px solid white' : 'none';
                btn.style.outlineOffset = '2px';
            });
            const prev = document.getElementById('previewColorFondo');
            if (prev) prev.style.background = color;
            actualizarPrevisualizacionIcono();
        }

        function seleccionarColorIcono(color) {
            colorTemporal = color;
            document.querySelectorAll('[data-color]').forEach(btn => {
                btn.style.outline = btn.dataset.color === color ? '3px solid white' : 'none';
                btn.style.outlineOffset = '2px';
            });
            const prev = document.getElementById('previewColorIcono');
            if (prev) prev.style.background = color;
            actualizarPrevisualizacionIcono();
        }

        const _customColorPickerState = {
            target: 'icon',
            h: 210,
            s: 100,
            v: 100,
            dragging: false,
            initialized: false
        };

        function _clamp(value, min, max) {
            return Math.min(max, Math.max(min, value));
        }

        function _sanitizeHexColor(value) {
            const raw = String(value || '').replace(/[^a-fA-F0-9]/g, '').toUpperCase();
            return raw.slice(0, 6);
        }

        function _hsvToHexPicker(h, s, v) {
            h = ((Number(h) % 360) + 360) % 360;
            s = _clamp(Number(s), 0, 100) / 100;
            v = _clamp(Number(v), 0, 100) / 100;

            const c = v * s;
            const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
            const m = v - c;
            let r1 = 0, g1 = 0, b1 = 0;

            if (h < 60) {
                r1 = c; g1 = x; b1 = 0;
            } else if (h < 120) {
                r1 = x; g1 = c; b1 = 0;
            } else if (h < 180) {
                r1 = 0; g1 = c; b1 = x;
            } else if (h < 240) {
                r1 = 0; g1 = x; b1 = c;
            } else if (h < 300) {
                r1 = x; g1 = 0; b1 = c;
            } else {
                r1 = c; g1 = 0; b1 = x;
            }

            const r = Math.round((r1 + m) * 255);
            const g = Math.round((g1 + m) * 255);
            const b = Math.round((b1 + m) * 255);

            const toHex = function (x) {
                const hex = x.toString(16).toUpperCase();
                return hex.length === 1 ? '0' + hex : hex;
            };

            return '#' + toHex(r) + toHex(g) + toHex(b);
        }

        function _hexToHsvPicker(hex) {
            let clean = _sanitizeHexColor(hex);
            if (clean.length === 3) {
                clean = clean.split('').map(function (ch) { return ch + ch; }).join('');
            }
            while (clean.length < 6) clean += '0';

            let r = parseInt(clean.slice(0, 2), 16) / 255;
            let g = parseInt(clean.slice(2, 4), 16) / 255;
            let b = parseInt(clean.slice(4, 6), 16) / 255;

            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const d = max - min;

            let h = 0;
            const v = max;
            const s = max === 0 ? 0 : d / max;

            if (d !== 0) {
                switch (max) {
                    case r:
                        h = ((g - b) / d) % 6;
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    default:
                        h = (r - g) / d + 4;
                        break;
                }
                h *= 60;
                if (h < 0) h += 360;
            }

            return {
                h: Math.round(h),
                s: Math.round(s * 100),
                v: Math.round(v * 100)
            };
        }

        function _getCustomPickerRefs() {
            return {
                panel: document.getElementById('customColorPickerPanel'),
                title: document.getElementById('customColorPickerTitle'),
                area: document.getElementById('customColorPickerArea'),
                thumb: document.getElementById('customColorPickerThumb'),
                hue: document.getElementById('customColorPickerHue'),
                hex: document.getElementById('customColorPickerHex'),
                preview: document.getElementById('customColorPickerPreview')
            };
        }

        function _aplicarColorDesdePicker() {
            const colorHex = _hsvToHexPicker(_customColorPickerState.h, _customColorPickerState.s, _customColorPickerState.v);
            if (_customColorPickerState.target === 'bg') {
                seleccionarColorFondo(colorHex);
                bgColorTemporal = colorHex;
            } else {
                seleccionarColorIcono(colorHex);
                colorTemporal = colorHex;
            }
        }

        function _renderCustomColorPicker() {
            const refs = _getCustomPickerRefs();
            if (!refs.panel || !refs.area || !refs.thumb || !refs.hue || !refs.hex || !refs.preview) return;

            const hex = _hsvToHexPicker(_customColorPickerState.h, _customColorPickerState.s, _customColorPickerState.v);
            refs.area.style.background = 'linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,hsl(' + _customColorPickerState.h + ',100%,50%))';
            refs.thumb.style.left = _customColorPickerState.s + '%';
            refs.thumb.style.top = (100 - _customColorPickerState.v) + '%';
            refs.thumb.style.background = hex;
            refs.hue.value = String(_customColorPickerState.h);
            refs.preview.style.background = hex;
            refs.hex.value = hex.replace('#', '');
        }

        function _updatePickerFromPoint(clientX, clientY) {
            const refs = _getCustomPickerRefs();
            if (!refs.area) return;

            const rect = refs.area.getBoundingClientRect();
            const x = _clamp(clientX - rect.left, 0, rect.width);
            const y = _clamp(clientY - rect.top, 0, rect.height);

            _customColorPickerState.s = Math.round((x / rect.width) * 100);
            _customColorPickerState.v = 100 - Math.round((y / rect.height) * 100);

            _aplicarColorDesdePicker();
            _renderCustomColorPicker();
        }

        function _initCustomColorPickerEvents() {
            if (_customColorPickerState.initialized) return;
            const refs = _getCustomPickerRefs();
            if (!refs.area || !refs.hue || !refs.hex) return;

            refs.area.addEventListener('mousedown', function (e) {
                _customColorPickerState.dragging = true;
                _updatePickerFromPoint(e.clientX, e.clientY);
            });

            window.addEventListener('mousemove', function (e) {
                if (!_customColorPickerState.dragging) return;
                _updatePickerFromPoint(e.clientX, e.clientY);
            });

            window.addEventListener('mouseup', function () {
                _customColorPickerState.dragging = false;
            });

            refs.area.addEventListener('touchstart', function (e) {
                const t = e.touches && e.touches[0];
                if (!t) return;
                _customColorPickerState.dragging = true;
                _updatePickerFromPoint(t.clientX, t.clientY);
                e.preventDefault();
            }, { passive: false });

            window.addEventListener('touchmove', function (e) {
                if (!_customColorPickerState.dragging) return;
                const t = e.touches && e.touches[0];
                if (!t) return;
                _updatePickerFromPoint(t.clientX, t.clientY);
                e.preventDefault();
            }, { passive: false });

            window.addEventListener('touchend', function () {
                _customColorPickerState.dragging = false;
            });

            refs.hue.addEventListener('input', function () {
                _customColorPickerState.h = _clamp(Number(refs.hue.value || 0), 0, 360);
                _aplicarColorDesdePicker();
                _renderCustomColorPicker();
            });

            refs.hex.addEventListener('input', function () {
                const clean = _sanitizeHexColor(refs.hex.value);
                refs.hex.value = clean;
                if (clean.length === 6) {
                    const hsv = _hexToHsvPicker(clean);
                    _customColorPickerState.h = hsv.h;
                    _customColorPickerState.s = hsv.s;
                    _customColorPickerState.v = hsv.v;
                    _aplicarColorDesdePicker();
                    _renderCustomColorPicker();
                }
            });

            _customColorPickerState.initialized = true;
        }

        function abrirColorPickerPersonalizado(target) {
            const refs = _getCustomPickerRefs();
            if (!refs.panel) return;

            _initCustomColorPickerEvents();
            _customColorPickerState.target = target === 'bg' ? 'bg' : 'icon';

            const currentColor = _customColorPickerState.target === 'bg'
                ? (bgColorTemporal || '#1e293b')
                : (colorTemporal || '#ffffff');

            const hsv = _hexToHsvPicker(currentColor);
            _customColorPickerState.h = hsv.h;
            _customColorPickerState.s = hsv.s;
            _customColorPickerState.v = hsv.v;

            if (refs.title) {
                refs.title.textContent = _customColorPickerState.target === 'bg'
                    ? 'Color fondo personalizado'
                    : 'Color icono personalizado';
            }

            refs.panel.style.display = 'block';
            _renderCustomColorPicker();
        }

        function cerrarColorPickerPersonalizado() {
            const refs = _getCustomPickerRefs();
            if (refs.panel) refs.panel.style.display = 'none';
            _customColorPickerState.dragging = false;
        }
        
        function _hexToRgb(hex) {
            const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
            return `${r},${g},${b}`;
        }

        function _bgCss(bgColor, bgOpacity) {
            const rgb = _hexToRgb(bgColor || '#10b981');
            const alpha = ((bgOpacity ?? 100) / 100).toFixed(2);
            return `rgba(${rgb},${alpha})`;
        }

        function _svgDataToDataUrl(svgData, color) {
            if (!svgData || !svgData.vb || !svgData.svg) return '';
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${svgData.vb}" fill="none" style="color:${color || '#ffffff'};fill:currentColor;">${svgData.svg}</svg>`;
            return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
        }

        function actualizarPrevisualizacionIcono() {
            const previewBg = document.getElementById('iconoPreviewBg');
            const nombrePreview = document.getElementById('nombreIconoPreview');
            let preview = document.getElementById('iconoPreview');

            const icono = iconoTemporal || preview?.textContent?.trim();

            if (icono) {
                if (_svgDataTemporal) {
                    if (preview && preview.tagName.toLowerCase() !== 'svg') {
                        const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        svgEl.id = 'iconoPreview';
                        preview.replaceWith(svgEl);
                        preview = svgEl;
                    }
                    if (preview) {
                        preview.setAttribute('viewBox', _svgDataTemporal.vb);
                        preview.setAttribute('width', '30'); preview.setAttribute('height', '30');
                        preview.style.cssText = `color:${colorTemporal};fill:currentColor;flex-shrink:0;`;
                        preview.innerHTML = _svgDataTemporal.svg;
                    }
                } else {
                    if (preview && preview.tagName.toLowerCase() === 'svg') {
                        const spanEl = document.createElement('span');
                        spanEl.id = 'iconoPreview';
                        preview.replaceWith(spanEl);
                        preview = spanEl;
                    }
                    if (preview) {
                        preview.textContent = icono;
                        preview.style.color = colorTemporal;
                        preview.className = fontClassTemporal || 'material-symbols-rounded';
                        if (!fontClassTemporal || fontClassTemporal === 'material-symbols-rounded') {
                            preview.style.fontVariationSettings = '"FILL" 0,"wght" 300,"GRAD" 0,"opsz" 24';
                        } else { preview.style.fontVariationSettings = ''; }
                        preview.style.fontSize = '30px';
                        preview.classList.remove('text-slate-600');
                    }
                }
                if (nombrePreview) nombrePreview.textContent = icono.replace(/_/g, ' ');
            }
            if (previewBg) {
                const alpha = (bgOpacityTemporal / 100).toFixed(2);
                const rgb = _hexToRgb(bgColorTemporal || '#10b981');
                previewBg.style.background = `rgba(${rgb},${alpha})`;
                previewBg.style.border = 'none';
                previewBg._bgColor = `rgba(${rgb},${alpha})`;
                previewBg._iconColor = colorTemporal;
                previewBg._iconName = icono;
            }
        }

        function aplicarIconoSeleccionado() {
            aplicarMiniaturaSeleccionada();
        }

        function aplicarMiniaturaSeleccionada() {
            const tipoSeleccionado = document.getElementById('seccionIcono').style.display !== 'none' ? 'icono' : 'imagen';
            if (!iconoTemporal) {
                const preview = document.getElementById('iconoPreview');
                if (preview && preview.textContent.trim()) iconoTemporal = preview.textContent.trim();
            }
            if (window._iconPickerCallbackCategoria && window._editandoCategoria) {
                if (tipoSeleccionado === 'icono' && iconoTemporal) {
                    if (window._editandoCategoria === '__nueva__') {
                        window._nuevaCatIcono = iconoTemporal;
                        window._nuevaCatColor = bgColorTemporal;
                        window._nuevaCatIconColor = colorTemporal;
                        window._nuevaCatBgOpacity = bgOpacityTemporal;
                        window._nuevaCatSvgData = _svgDataTemporal || null;
                        const prev = document.getElementById('nueva-cat-icono-preview');
                        if (prev) {
                            if (_svgDataTemporal) {
                                prev.style.display = 'none';
                                let sp = document.getElementById('_nueva_cat_svg_prev');
                                if (!sp) { sp = document.createElementNS('http://www.w3.org/2000/svg','svg'); sp.id='_nueva_cat_svg_prev'; sp.setAttribute('viewBox',_svgDataTemporal.vb); sp.setAttribute('width','26'); sp.setAttribute('height','26'); prev.parentNode.insertBefore(sp, prev.nextSibling); }
                                sp.style.cssText = 'color:'+colorTemporal+';fill:currentColor;';
                                sp.innerHTML = _svgDataTemporal.svg;
                            } else {
                                prev.textContent = iconoTemporal; prev.style.color = colorTemporal; prev.style.display='';
                                const sp = document.getElementById('_nueva_cat_svg_prev'); if(sp) sp.remove();
                            }
                        }
                        const prevBg = document.getElementById('nueva-cat-icono-bg');
                        if (prevBg) {
                            const _hx = bgColorTemporal.replace('#',''); 
                            const _r = parseInt(_hx.slice(0,2),16), _g = parseInt(_hx.slice(2,4),16), _b = parseInt(_hx.slice(4,6),16);
                            const _alpha = (bgOpacityTemporal / 100).toFixed(2);
                            prevBg.setAttribute('style', `width:48px;height:48px;border-radius:14px;background:rgba(${_r},${_g},${_b},${_alpha});border:1.5px solid rgba(${_r},${_g},${_b},0.6);display:flex;align-items:center;justify-content:center;flex-shrink:0;`);
                        }
                        window._iconPickerCallbackCategoria = false;
                        window._editandoCategoria = null;
                        window._nuevaCatPickerActive = false;
                        cerrarModalIconos();
                        document.getElementById('modalNuevaCategoria').style.display = 'flex';
                        return;
                    }
                    if (window._editandoCategoria === '__editar__') {
                        const catE = window.finanzasData.categorias.find(c => c.id === window._editandoCategoriaModal);
                        if (catE) { catE.icon = iconoTemporal; catE.color = bgColorTemporal; catE.iconColor = colorTemporal; catE.bgOpacity = bgOpacityTemporal; catE.svgData = _svgDataTemporal || null; guardarFinanzasData(); }
                        var prevBgE = document.getElementById('editar-cat-icono-bg');
                        if (prevBgE) {
                            if (_svgDataTemporal && _svgDataTemporal.vb && _svgDataTemporal.svg) {
                                prevBgE.innerHTML = '<svg class="__svg_icon" viewBox="' + _svgDataTemporal.vb + '" width="26" height="26" style="fill:' + colorTemporal + ';flex-shrink:0;display:block;" xmlns="http://www.w3.org/2000/svg">' + _svgDataTemporal.svg + '</svg>';
                            } else {
                                prevBgE.innerHTML = '<span class="material-symbols-rounded" id="editar-cat-icono-preview" style="font-size:26px;color:' + colorTemporal + ';">' + (iconoTemporal || 'category') + '</span>';
                            }
                        }
                        if (prevBgE) {
                            const _hx = bgColorTemporal.replace('#','');
                            const _r = parseInt(_hx.slice(0,2),16), _g = parseInt(_hx.slice(2,4),16), _b = parseInt(_hx.slice(4,6),16);
                            const _alpha = (bgOpacityTemporal / 100).toFixed(2);
                            prevBgE.setAttribute('style', `width:48px;height:48px;border-radius:14px;background:rgba(${_r},${_g},${_b},${_alpha});border:1.5px solid rgba(${_r},${_g},${_b},0.6);display:flex;align-items:center;justify-content:center;flex-shrink:0;`);
                        }
                        window._iconPickerCallbackCategoria = false;
                        window._editandoCategoria = null;
                        cerrarModalIconos();
                        document.getElementById('modalEditarCategoria').style.display = 'flex';
                        return;
                    }
                    const cat = window.finanzasData.categorias.find(c => c.id === window._editandoCategoria);
                    if (cat) {
                        cat.icon = iconoTemporal;
                        cat.color = colorTemporal;
                        cat.iconColor = colorTemporal;
                        cat.bgOpacity = bgOpacityTemporal;
                        cat.svgData = _svgDataTemporal || null;
                        guardarFinanzasData();
                        filtrarCategorias(cat.type);
                    }
                }
                window._iconPickerCallbackCategoria = false;
                window._editandoCategoria = null;
                cerrarModalIconos();
                return;
            }
            if (tipoElementoActual === 'vl-header' || tipoElementoActual === 'vl-empresa' || tipoElementoActual === 'vl-miniatura') {
                const idx = window._vlMiniIdx;
                if (tipoSeleccionado === 'imagen') {
                    const imgPreview = document.getElementById('imgPreviewMiniatura');
                    if (imgPreview && imgPreview.src && imgPreview.src !== window.location.href) {
                        window._VL.state.miniaturas[idx] = imgPreview.src;
                        window._VL.save();
                        renderVidaLaboral();
                        const modal = document.getElementById('modalEmpresasVidaLaboral');
                        if (modal) { modal.remove(); abrirEmpresasVidaLaboral(); }
                    }
                } else if (tipoSeleccionado === 'icono' && iconoTemporal) {
                    window._VL.state.miniaturas[idx] = null; // limpiar imagen
                    window._VL.state.iconos = window._VL.state.iconos || {};
                    window._VL.state.iconos[idx] = { icono: iconoTemporal, color: colorTemporal, font: fontClassTemporal || 'material-symbols-rounded' };
                    window._VL.save();
                    renderVidaLaboral();
                    const modal = document.getElementById('modalEmpresasVidaLaboral');
                    if (modal) { modal.remove(); abrirEmpresasVidaLaboral(); }
                }
                tipoElementoActual = null;
                cerrarModalIconos();
                return;
            }
            if (tipoElementoActual === 'gimnasio-miniatura-derecha') {
                const wrap = document.getElementById('gimnasioMiniaturaDerechaWrap');
                if (tipoSeleccionado === 'icono' && iconoTemporal) {
                    const el = document.getElementById('gimnasioMiniaturaDerechaIcono');
                    if (el) { el.textContent = iconoTemporal; el.style.color = colorTemporal || '#eab308'; el.style.display = ''; }
                    const imgAnterior = wrap ? wrap.querySelector('img.gimnasio-mini-img') : null;
                    if (imgAnterior) imgAnterior.remove();
                    localStorage.setItem('gimnasioMiniaturaDerechaIcono', iconoTemporal);
                    localStorage.setItem('gimnasioMiniaturaDerechaColor', colorTemporal || '#eab308');
                    localStorage.removeItem('gimnasioMiniaturaDerechaImg');
                } else if (tipoSeleccionado === 'imagen') {
                    const imgPreview = document.getElementById('imgPreviewMiniatura');
                    if (imgPreview && imgPreview.src && imgPreview.src !== window.location.href) {
                        const src = imgPreview.src;
                        const el = document.getElementById('gimnasioMiniaturaDerechaIcono');
                        if (el) el.style.display = 'none';
                        let img = wrap ? wrap.querySelector('img.gimnasio-mini-img') : null;
                        if (!img && wrap) {
                            img = document.createElement('img');
                            img.className = 'gimnasio-mini-img';
                            img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:10px;position:absolute;top:0;left:0;right:0;bottom:0;';
                            wrap.style.position = 'relative';
                            wrap.style.overflow = 'hidden';
                            wrap.appendChild(img);
                        }
                        if (img) img.src = src;
                        localStorage.setItem('gimnasioMiniaturaDerechaImg', src);
                        localStorage.removeItem('gimnasioMiniaturaDerechaIcono');
                    }
                }
                tipoElementoActual = null;
                cerrarModalIconos();
                return;
            }
            if (tipoElementoActual === 'reforma-card' && _cardMiniaturaActual) {
                const card = _cardMiniaturaActual;
                if (tipoSeleccionado === 'icono' && iconoTemporal) {
                    const svgIconDataUrl = _svgDataTemporal ? _svgDataToDataUrl(_svgDataTemporal, colorTemporal) : '';
                    if (svgIconDataUrl) {
                        card.dataset.iconoImagen = svgIconDataUrl;
                        card.dataset.icono = '';
                        card.dataset.colorIcono = colorTemporal;
                        delete card.dataset.miniatura;
                        actualizarPreviewCard(card);
                        guardarDatos();
                        _cardMiniaturaActual = null;
                        tipoElementoActual = null;
                        cerrarModalIconos();
                        return;
                    }
                    card.dataset.icono = iconoTemporal;
                    card.dataset.colorIcono = colorTemporal;
                    card.dataset.bgColor = bgColorTemporal;
                    card.dataset.bgOpacity = bgOpacityTemporal;
                    card.dataset.iconoFont = fontClassTemporal;
                    delete card.dataset.miniatura;
                    
                    const bgCss = _bgCss(bgColorTemporal, bgOpacityTemporal);
                    const wrapper = card.querySelector('.card-thumbnail-wrapper');
                    if (wrapper) {
                        const existing = wrapper.querySelector('.card-thumbnail, .card-thumbnail-placeholder');
                        if (existing) {
                            existing.outerHTML = `<div class="card-thumbnail-placeholder" style="pointer-events:none;background:${bgCss};display:flex;align-items:center;justify-content:center;border-radius:8px;"><span class="${fontClassTemporal}" style="font-size:26px;color:${colorTemporal};${fontClassTemporal === 'material-symbols-rounded' ? 'font-variation-settings:\'FILL\' 0,\'wght\' 300,\'GRAD\' 0,\'opsz\' 24;' : ''}">${iconoTemporal}</span></div>`;
                        }
                    }
                    
                    const iconPlaceholder = card.querySelector('.card-bg-color + div');
                    if (iconPlaceholder) {
                        const iconSpan = iconPlaceholder.querySelector('.material-symbols-rounded, .material-symbols-rounded');
                        if (iconSpan) { iconSpan.className = fontClassTemporal; iconSpan.textContent = iconoTemporal; iconSpan.style.color = colorTemporal; }
                    }
                    
                    guardarDatos();
                } else if (tipoSeleccionado === 'imagen') {
                    const imgPreview = document.getElementById('imgPreviewMiniatura');
                    if (imgPreview && imgPreview.src && imgPreview.src !== window.location.href) {
                        card.dataset.miniatura = imgPreview.src;
                        actualizarPreviewCard(card);
                        guardarDatos();
                    }
                }
                
                _cardMiniaturaActual = null;
                tipoElementoActual = null;
                cerrarModalIconos();
                return;
            }
            
            if (tipoSeleccionado === 'icono' && iconoTemporal && elementoIconoActual) {
                const iconContainer = elementoIconoActual;
                const esBanco = iconContainer.classList.contains('icon-container-banco');
                const esSeccion = tipoElementoActual === 'seccion';
                const esPrincipal = tipoElementoActual === 'principal';
                const bgCss = _bgCss(bgColorTemporal, bgOpacityTemporal);
                const svgIconDataUrl = _svgDataTemporal ? _svgDataToDataUrl(_svgDataTemporal, colorTemporal) : '';
                
                if (esPrincipal) {
                    if (!iconContainer.classList.contains('bg-gradient-to-br')) {
                        iconContainer.className = 'icon-container-principal relative p-3 rounded-2xl text-white cursor-pointer transition-all duration-300 group';
                        iconContainer.style.cssText = 'background: linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(29, 78, 216, 0.3) 50%, rgba(37, 99, 235, 0.4) 100%);  border: 1px solid rgba(59, 130, 246, 0.2); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);';
                        iconContainer.innerHTML = `
                            ${svgIconDataUrl ? `<img src="${svgIconDataUrl}" style="width:36px;height:36px;object-fit:contain;">` : `<span class="material-symbols-rounded" style="font-size: 36px; color:${colorTemporal};">${iconoTemporal}</span>`}
                            <div class="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span class="material-symbols-rounded text-white text-sm">edit</span>
                            </div>
                        `;
                    } else {
                        const iconSpan = iconContainer.querySelector('.material-symbols-rounded');
                        const iconImg = iconContainer.querySelector('img');
                        if (svgIconDataUrl && iconImg) iconImg.src = svgIconDataUrl;
                        else if (iconSpan) {
                            iconSpan.textContent = iconoTemporal;
                            iconSpan.style.color = colorTemporal;
                        }
                    }
                    const iconoMobile = document.querySelector('#iconoPrincipalMobile .material-symbols-rounded');
                    if (iconoMobile && !svgIconDataUrl) {
                        iconoMobile.textContent = iconoTemporal;
                        iconoMobile.style.color = colorTemporal;
                    }
                    
                    guardarDatos();
                } else if (esSeccion) {
                    iconContainer.textContent = iconoTemporal;
                    iconContainer.style.color = colorTemporal;
                    guardarDatos();
                } else if (esBanco) {
                    iconContainer.style.background = bgCss;
                    iconContainer.dataset.bgColor = bgColorTemporal;
                    iconContainer.dataset.bgOpacity = bgOpacityTemporal;
                    iconContainer.dataset.colorIcono = colorTemporal;
                    iconContainer.innerHTML = `
                        ${svgIconDataUrl ? `<img src="${svgIconDataUrl}" class="w-full h-full object-contain rounded-xl">` : `<span class="material-symbols-rounded" style="font-size: 28px; color:${colorTemporal};">${iconoTemporal}</span>`}
                        <div class="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span class="material-symbols-rounded text-white text-xs">edit</span>
                        </div>
                    `;
                    if (svgIconDataUrl) {
                        iconContainer.dataset.tipo = 'imagen';
                    }
                    attachIconLongPress(iconContainer, function(el) {
                        abrirSelectorIconosBanco(el);
                    });
                } else {
                    iconContainer.style.background = bgCss;
                    iconContainer.dataset.bgColor = bgColorTemporal;
                    iconContainer.dataset.bgOpacity = bgOpacityTemporal;
                    iconContainer.dataset.colorIcono = colorTemporal;
                    iconContainer.innerHTML = `
                        ${svgIconDataUrl ? `<img src="${svgIconDataUrl}" class="w-full h-full object-contain rounded-xl">` : `<span class="material-symbols-rounded" style="color: ${colorTemporal}">${iconoTemporal}</span>`}
                        <div class="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span class="material-symbols-rounded text-white text-xs">edit</span>
                        </div>
                    `;
                    attachIconLongPress(iconContainer, function(el) {
                        abrirSelectorIconos(el);
                    });
                    const parentCard = iconContainer.closest('.card-input-group');
                    if (parentCard) {
                        parentCard.dataset.colorIcono = colorTemporal;
                        parentCard.dataset.bgColor = bgColorTemporal;
                        parentCard.dataset.bgOpacity = bgOpacityTemporal;
                        parentCard.dataset.icono = svgIconDataUrl ? '' : iconoTemporal;
                        parentCard.dataset.iconoImagen = svgIconDataUrl || '';
                    }
                }
                iconContainer.dataset.tipo = svgIconDataUrl ? 'imagen' : 'icono';
                tipoElementoActual = null;
            } else if (tipoSeleccionado === 'imagen') {
                const imgPreview = document.getElementById('imgPreviewMiniatura');
                if (imgPreview.src && elementoIconoActual) {
                    const iconContainer = elementoIconoActual;
                    const esBanco = iconContainer.classList.contains('icon-container-banco');
                    const esPrincipal = iconContainer.classList.contains('icon-container-principal');
                    
                    if (esPrincipal) {
                        iconContainer.className = 'icon-container-principal p-3 rounded-2xl cursor-pointer transition-all duration-300 group relative';
                        iconContainer.style.background = 'transparent';
                        iconContainer.innerHTML = `
                            <img src="${imgPreview.src}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 0.75rem;">
                            <div class="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span class="material-symbols-rounded text-white text-sm">edit</span>
                            </div>
                        `;
                        attachIconLongPress(iconContainer, function(el) {
                            abrirSelectorIconoPrincipal(el);
                        });
                    } else if (esBanco) {
                        iconContainer.innerHTML = `
                            <img src="${imgPreview.src}" class="w-full h-full object-cover rounded-xl">
                            <div class="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span class="material-symbols-rounded text-white text-xs">edit</span>
                            </div>
                        `;
                        attachIconLongPress(iconContainer, function(el) {
                            abrirSelectorIconosBanco(el);
                        });
                    } else {
                        iconContainer.innerHTML = `
                            <img src="${imgPreview.src}" class="w-full h-full object-cover rounded-xl">
                            <div class="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span class="material-symbols-rounded text-white text-xs">edit</span>
                            </div>
                        `;
                        attachIconLongPress(iconContainer, function(el) {
                            abrirSelectorIconos(el);
                        });
                        const parentCard = iconContainer.closest('.card-input-group');
                        if (parentCard) {
                            parentCard.dataset.iconoImagen = imgPreview.src;
                            parentCard.dataset.icono = '';
                        }
                    }
                    iconContainer.dataset.tipo = 'imagen';
                }
            }
            
            const _elParaAnimar = elementoIconoActual;
            const _colorAnimar = (tipoSeleccionado === 'icono') ? (bgColorTemporal || '#10b981') : '#10b981';
            if (typeof _undoPushInmediato === 'function') _undoPushInmediato();

            cerrarModalIconos();
            guardarDatos();
            setTimeout(() => {
                _mostrarToast('check_circle', '#10b981', 'Miniatura modificada');
            }, 80);
        }

        function _syncEmptyStates() {
            [
                { lista: 'listaCuentas',    empty: 'emptyCuentas'    },
                { lista: 'listaInversiones',empty: 'emptyInversiones'},
                { lista: 'listaIngresos',   empty: 'emptyIngresos'   },
                { lista: 'listaGastos',     empty: 'emptyGastos'     },
            ].forEach(({ lista, empty }) => {
                const el = document.getElementById(lista);
                const em = document.getElementById(empty);
                if (!el || !em) return;
                const tieneItems = el.querySelectorAll('.card-input-group').length > 0;
                em.style.display = tieneItems ? 'none' : 'block';
            });
        }

        function _toastBottomOffsetPx() {
            var base = 28;
            var nav = document.getElementById('mobileBottomNav');
            if (!nav) return base;
            var styles = window.getComputedStyle ? window.getComputedStyle(nav) : null;
            if (styles && (styles.display === 'none' || styles.visibility === 'hidden')) return base;
            var rect = nav.getBoundingClientRect();
            if (!rect || !rect.height || !rect.width) return base;
            return Math.max(base, Math.round(window.innerHeight - rect.top + 14));
        }
        window._toastBottomOffsetPx = _toastBottomOffsetPx;

        function _mostrarToast(icono, color, texto) {
            const t = document.createElement('div');
            t.style.cssText = `position:fixed;bottom:${_toastBottomOffsetPx()}px;left:50%;transform:translateX(-50%) translateY(60px);
                background:#0f172a;border:1px solid ${color}66;border-radius:14px;
                padding:12px 20px;display:flex;align-items:center;gap:10px;
                color:#f1f5f9;font-size:14px;font-weight:600;z-index:99999;
                box-shadow:0 8px 30px rgba(0,0,0,0.4);white-space:nowrap;max-width:min(calc(100vw - 32px), 420px);
                opacity:0;transition:opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1);`;
            t.innerHTML = `<span class="material-symbols-rounded" style="color:${color};font-size:20px;">${icono}</span>${texto}`;
            document.body.appendChild(t);
            requestAnimationFrame(() => requestAnimationFrame(() => {
                t.style.opacity = '1';
                t.style.transform = 'translateX(-50%) translateY(0)';
            }));
            setTimeout(() => {
                t.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                t.style.opacity = '0';
                t.style.transform = 'translateX(-50%) translateY(60px)';
                setTimeout(() => t.remove(), 300);
            }, 3200);
        }
        window._mostrarToast = _mostrarToast;

        function _animarTarjetaMiniatura(elementoIconoActual, color, callback) {
            const card = elementoIconoActual ? elementoIconoActual.closest('.card-input-group') : null;
            if (!card) { if (callback) callback(); return; }
            const sweep = document.createElement('div');
            sweep.style.cssText = `position:absolute;top:0;left:0;right:0;bottom:0;border-radius:inherit;pointer-events:none;z-index:10;overflow:hidden;`;
            const bar = document.createElement('div');
            bar.style.cssText = `position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(90deg,transparent 0%,${color}55 30%,${color}cc 50%,${color}55 70%,transparent 100%);animation:miniaturaSwipe 2.4s cubic-bezier(0.4,0,0.2,1) forwards;`;
            sweep.appendChild(bar);
            card.style.position = 'relative';
            card.style.overflow = 'hidden';
            card.appendChild(sweep);
            setTimeout(() => { sweep.remove(); if (callback) callback(); }, 2500);
        }

        function _actualizarHeaderPreview(modo) {
            const previewBg  = document.getElementById('iconoPreviewBg');
            const subtitulo  = document.getElementById('nombreIconoPreview');
            const imgPreview = document.getElementById('imgPreviewMiniatura');
            const tieneImagen = imgPreview && imgPreview.src && imgPreview.src.startsWith('data:');
            const iconName  = previewBg._iconName;
            const iconColor = previewBg._iconColor || '#ffffff';
            const bgColor   = previewBg._bgColor   || '#10b981';
            const tieneIcono = iconName && iconName !== 'publish' && iconName !== '';

            if (modo === 'icono') {
                if (tieneIcono) {
                    previewBg.style.cssText = 'width:56px;height:56px;border-radius:16px;background:' + bgColor + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;transition:background 0.2s;border:none;';
                    previewBg.innerHTML = `<span id="iconoPreview" class="material-symbols-rounded" style="font-size:30px;color:${iconColor};font-variation-settings:'FILL' 0,'wght' 500,'GRAD' 0,'opsz' 24;">${iconName}</span>`;
                    if (subtitulo) subtitulo.textContent = iconName.replace(/_/g,' ');
                } else {
                    previewBg.style.cssText = 'width:56px;height:56px;border-radius:16px;background:rgba(15,23,42,0.5);display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;transition:background 0.2s;border:2px dashed rgba(100,116,139,0.45);box-sizing:border-box;';
                    previewBg.innerHTML = '<span id="iconoPreview" class="material-symbols-rounded" style="font-size:28px;color:#475569;">publish</span>';
                    if (subtitulo) subtitulo.textContent = 'Elegir icono';
                }
            } else {
                if (tieneImagen) {
                    previewBg.style.cssText = 'width:56px;height:56px;border-radius:16px;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;border:none;';
                    previewBg.innerHTML = `<img src="${imgPreview.src}" style="width:100%;height:100%;object-fit:cover;border-radius:16px;">`;
                    if (subtitulo) subtitulo.textContent = previewBg._imgName || 'imagen subida';
                } else {
                    previewBg.style.cssText = 'width:56px;height:56px;border-radius:16px;background:rgba(15,23,42,0.5);display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;border:2px dashed rgba(100,116,139,0.45);box-sizing:border-box;';
                    previewBg.innerHTML = '<span class="material-symbols-rounded" style="font-size:28px;color:#475569;">image_arrow_up</span>';
                    if (subtitulo) subtitulo.textContent = 'Subir imagen';
                }
            }
        }

        function mostrarOpcionIcono() {
            const inner = document.getElementById('modalIconosInner');
            inner.style.height = inner.offsetHeight + 'px';
            document.getElementById('seccionIcono').style.display = 'flex';
            document.getElementById('seccionImagen').style.display = 'none';
            requestAnimationFrame(() => { inner.style.height = 'auto'; });
            _actualizarHeaderPreview('icono');
            const btnIcono = document.getElementById('btnOpcionIcono');
            const btnImagen = document.getElementById('btnOpcionImagen');
            btnIcono.style.cssText = 'width:44px;height:36px;border:none;border-radius:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;background:rgba(59,130,246,0.9);box-shadow:0 2px 8px rgba(59,130,246,0.35);';
            btnIcono.querySelector('span').style.color = '#fff';
            btnImagen.style.cssText = 'width:44px;height:36px;border:none;border-radius:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;background:transparent;';
            btnImagen.querySelector('span').style.color = '#475569';
        }

        function mostrarOpcionImagen() {
            const inner = document.getElementById('modalIconosInner');
            inner.style.height = inner.offsetHeight + 'px';
            document.getElementById('seccionIcono').style.display = 'none';
            document.getElementById('seccionImagen').style.display = 'flex';
            _actualizarHeaderPreview('imagen');
            const btnIcono = document.getElementById('btnOpcionIcono');
            const btnImagen = document.getElementById('btnOpcionImagen');
            btnIcono.style.cssText = 'width:44px;height:36px;border:none;border-radius:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;background:transparent;';
            btnIcono.querySelector('span').style.color = '#475569';
            btnImagen.style.cssText = 'width:44px;height:36px;border:none;border-radius:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;background:rgba(59,130,246,0.9);box-shadow:0 2px 8px rgba(59,130,246,0.35);';
            btnImagen.querySelector('span').style.color = '#fff';
        }

        function previsualizarImagenMiniatura(input) {
            const file = input.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgPreview = document.getElementById('imgPreviewMiniatura');
                const previewContainer = document.getElementById('previewMiniatura');
                const noPreviewContainer = document.getElementById('noPreviewMiniatura');
                const previewBg = document.getElementById('iconoPreviewBg');
                
                imgPreview.src = e.target.result;
                previewContainer.style.display = 'block';
                if (noPreviewContainer) noPreviewContainer.style.display = 'none';
                if (previewBg) previewBg._imgName = file.name.replace(/\.[^.]+$/, '');
                if (document.getElementById('seccionImagen').style.display !== 'none') {
                    _actualizarHeaderPreview('imagen');
                }
            };
            reader.readAsDataURL(file);
            setTimeout(() => { input.value = ''; }, 100);
        }
        const fileHandles = new Map(); // Guardar referencias a archivos

        async function subirImagenItem(input) {
            const file = input.files[0];
            if (!file) return;
            
            const card = input.closest('.card-input-group');
            
            try {
                if ('showOpenFilePicker' in window) {
                    const reader = new FileReader();
                    reader.onload = async function(e) {
                        mostrarImagenEnCard(card, e.target.result, file.name);
                        const cardId = generarIdUnico();
                        card.dataset.imageId = cardId;
                        try {
                            const pickerOpts = {
                                types: [{
                                    description: 'Imágenes',
                                    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] }
                                }],
                                excludeAcceptAllOption: true,
                                multiple: false
                            };
                        } catch (err) {
                        }
                        
                        guardarDatos();
                    };
                    reader.readAsDataURL(file);
                } else {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        mostrarImagenEnCard(card, e.target.result, file.name);
                        guardarDatos();
                    };
                    reader.readAsDataURL(file);
                }
            } catch (error) {
            }
        }

        function mostrarImagenEnCard(card, imageSrc, fileName) {
            let imgContainer = card.querySelector('.image-preview-container');
            
            if (!imgContainer) {
                imgContainer = document.createElement('div');
                imgContainer.className = 'image-preview-container mt-3 relative';
                card.appendChild(imgContainer);
            }
            
            imgContainer.innerHTML = `
                <img src="${imageSrc}" class="uploaded-image" alt="${fileName || 'Imagen'}">
                <div class="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">${fileName || 'imagen.jpg'}</div>
                <button onclick="eliminarImagenItem(this)" class="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg">
                    <span class="material-symbols-rounded text-xs">close</span>
                </button>
            `;
        }

        function generarIdUnico() {
            return 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }

        function eliminarImagenItem(btn) {
            const container = btn.closest('.image-preview-container');
            const card = btn.closest('.card-input-group');
            if (card.dataset.imageId) {
                fileHandles.delete(card.dataset.imageId);
                delete card.dataset.imageId;
            }
            
            container.remove();
            guardarDatos();
        }
        async function recargarImagenDesdeArchivo(card) {
            try {
                const [fileHandle] = await window.showOpenFilePicker({
                    types: [{
                        description: 'Imágenes',
                        accept: { 'image/*': ['.jpg', '.jpeg', '.png'] }
                    }],
                    excludeAcceptAllOption: true,
                    multiple: false
                });

                const file = await fileHandle.getFile();
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    mostrarImagenEnCard(card, e.target.result, file.name);
                    
                    const cardId = generarIdUnico();
                    card.dataset.imageId = cardId;
                    fileHandles.set(cardId, fileHandle);
                    
                    guardarDatos();
                };
                
                reader.readAsDataURL(file);
            } catch (error) {
                if (error.name !== 'AbortError') {
                }
            }
        }
        function clearZeroOnFocus(input) {
            if (input.value === '0' || input.value === '0.00') {
                input.value = '';
            }
        }

        function restoreZeroOnBlur(input) {
            if (input.value === '' || input.value === null) {
                input.value = '0';
            }
        }
        (function() {
            const gt = document.createElement('div');
            gt.id = 'globalTooltip';
            document.body.appendChild(gt);
            
            function showTooltip(container) {
                const tooltipText = container.querySelector('.tooltip-text');
                if (!tooltipText) return;
                
                gt.innerHTML = tooltipText.innerHTML;
                gt.classList.add('visible');
                
                positionTooltip(container);
            }
            
            function positionTooltip(container) {
                const rect = container.getBoundingClientRect();
                const tw = 280; // ancho fijo del tooltip
                const th = gt.offsetHeight;
                let left = rect.left + rect.width / 2 - tw / 2;
                const margin = 12;
                if (left < margin) left = margin;
                if (left + tw > window.innerWidth - margin) left = window.innerWidth - tw - margin;
                let top = rect.top - th - 10;
                if (top < margin) top = rect.bottom + 10;
                
                gt.style.left = left + 'px';
                gt.style.top = top + 'px';
                const iconCenter = rect.left + rect.width / 2;
                const arrowLeft = iconCenter - left - 6;
                gt.style.setProperty('--arrow-left', arrowLeft + 'px');
            }
            
            function hideTooltip() {
                gt.classList.remove('visible');
            }
            
            function initTooltips() {
                document.querySelectorAll('.tooltip-container').forEach(container => {
                    if (container.dataset.ttInit) return;
                    container.dataset.ttInit = '1';
                    container.addEventListener('mouseenter', () => showTooltip(container));
                    container.addEventListener('mouseleave', hideTooltip);
                    let _ttLongTimer = null;
                    let _ttActivated = false;
                    container.addEventListener('touchstart', (e) => {
                        _ttActivated = false;
                        _ttLongTimer = setTimeout(() => {
                            _ttActivated = true;
                            showTooltip(container);
                            setTimeout(hideTooltip, 5000);
                        }, 500);
                    }, { passive: true });
                    container.addEventListener('touchend', () => {
                        clearTimeout(_ttLongTimer);
                    }, { passive: true });
                    container.addEventListener('touchmove', () => {
                        clearTimeout(_ttLongTimer);
                    }, { passive: true });
                    container.addEventListener('click', (e) => {
                        if (_ttActivated) { e.preventDefault(); e.stopPropagation(); _ttActivated = false; }
                    });
                });
            }
            
            window.initTooltips = initTooltips;
            document.addEventListener('touchstart', (e) => {
                if (!e.target.closest('.tooltip-container')) hideTooltip();
            });
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initTooltips);
            } else {
                initTooltips();
            }
        })();
        document.addEventListener('DOMContentLoaded', function() {
            initTooltips();

            document.addEventListener('focusin', function(e) {
                if (e.target.type === 'number') {
                    clearZeroOnFocus(e.target);
                }
            });
            
            document.addEventListener('focusout', function(e) {
                if (e.target.type === 'number') {
                    restoreZeroOnBlur(e.target);
                }
            });
        });

        function addRow(containerId, label, value, colorClass, icon, checked = true, iconoPersonalizado = null, colorIcono = null, imagenSrc = null, tipoReforma = 'reforma') {
            const container = document.getElementById(containerId);
            if (typeof _undoPushInmediato === 'function') _undoPushInmediato();
            const div = document.createElement('div');
            const isCuenta = containerId === 'listaCuentas' || containerId === 'listaInversiones';
            const isReforma = containerId === 'listaReformas';
            checked = _parseActivoPersistido(checked);
            div.className = isCuenta
                ? "card-input-group animate-in slide-in-from-top-4 duration-500"
                : "card-input-group flex justify-between items-center animate-in slide-in-from-top-4 duration-500";
            if (!checked) div.classList.add('disabled');
            
            const inputClass = isReforma ? 'reforma-input' : 'money-input';
            
            const iconoFinal = iconoPersonalizado || icon;
            const colorFinal = colorIcono || '#94a3b8'; // gris si no hay color personalizado
            const tieneImagen = imagenSrc && imagenSrc.length > 0;
            const iconoHTML = tieneImagen 
                ? `<img src="${imagenSrc}" class="w-full h-full object-cover rounded-xl">`
                : `<span class="material-symbols-rounded" style="color: ${colorFinal}">${iconoFinal}</span>`;

            if (isCuenta) {
                div.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="drag-handle cursor-grab p-2 -ml-2 text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0">
                        <span class="material-symbols-rounded">drag_indicator</span>
                    </div>
                    <div class="icon-container w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-700 transition-all flex-shrink-0 relative group" data-tipo="${tieneImagen ? 'imagen' : 'icono'}">
                        ${iconoHTML}
                        <div class="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                            <span class="material-symbols-rounded text-white text-xs">edit</span>
                        </div>
                    </div>
                    <input type="text" value="${label}" class="font-bold text-white text-sm focus:text-emerald-400 transition-colors flex-1 bg-transparent min-w-0 truncate">
                    <div class="cuenta-saldo-box flex items-center bg-slate-800/50 rounded-lg px-2 flex-shrink-0">
                        <input type="text" inputmode="decimal" value="${value ? fmt(value) : ''}" data-saldo-prev="${value || 0}" readonly onclick="_abrirModalCantidad(this)" oninput="fmtMoneyInput(this);autoToggleCuenta(this);calculate()" class="cuenta-saldo-input font-mono ${colorClass} font-bold text-center bg-transparent" style="cursor:pointer;caret-color:transparent;">
                        <span class="${colorClass} font-bold ml-1 flex-shrink-0 text-sm">€</span>
                    </div>
                    <div class="btn-menu-card-wrapper flex-shrink-0"><button class="btn-menu-card" onclick="toggleCardMenu(this)"><span class="material-symbols-rounded">more_vert</span></button><div class="card-menu-dropdown"><button onclick="toggleCuentaCheck(this)"><span class="material-symbols-rounded cuenta-check-icon" data-checked="${checked ? 'true' : 'false'}" style="color:${checked ? '#10b981' : '#94a3b8'}">check_circle</span>${checked ? 'Desactivar' : 'Activar'}</button><button onclick="archivarCard(this)"><span class="material-symbols-rounded">archive</span>Archivar</button><button class="danger" onclick="eliminarCard(this, calculate)"><span class="material-symbols-rounded">delete</span>Eliminar</button></div></div>
                </div>`;
            } else {
            div.innerHTML = `
                <div class="flex items-center gap-4 w-3/5">
                    <!-- Drag handle -->
                    <div class="drag-handle cursor-grab p-2 -ml-2 text-slate-600 hover:text-slate-400 transition-colors">
                        <span class="material-symbols-rounded">drag_indicator</span>
                    </div>
                    ${!isReforma ? `<input type="checkbox" ${checked ? 'checked' : ''} class="custom-check use-asset-check" onchange="toggleAsset(this); toggleLabel(this)">` : ''}
                    <div class="icon-container w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-700 transition-all relative group" data-tipo="${tieneImagen ? 'imagen' : 'icono'}">
                        ${iconoHTML}
                        <div class="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                            <span class="material-symbols-rounded text-white text-xs">edit</span>
                        </div>
                    </div>
                    <div class="flex flex-col flex-1 min-w-0">
                        <input type="text" value="${label}" class="font-bold text-white text-sm focus:text-indigo-400 transition-colors w-full min-w-0">
                        ${isReforma ? `
                            <div class="flex gap-2 mt-2">
                                <button onclick="cambiarTipoReforma(this, 'reforma')" class="tipo-reforma-btn flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 transition-all ${tipoReforma === 'reforma' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}" data-tipo="reforma">
                                    <span class="material-symbols-rounded">construction</span>
                                    <span class="text-xs font-bold">Reforma</span>
                                </button>
                                <button onclick="cambiarTipoReforma(this, 'mobiliario')" class="tipo-reforma-btn flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 transition-all ${tipoReforma === 'mobiliario' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}" data-tipo="mobiliario">
                                    <span class="material-symbols-rounded">weekend</span>
                                    <span class="text-xs font-bold">Mobiliario</span>
                                </button>
                            </div>
                        ` : `<span class="asset-label text-[9px] text-slate-600 font-bold uppercase tracking-widest" style="display: ${checked ? 'block' : 'none'}">Activo Seleccionado</span>`}
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="flex flex-col items-end">
                        <div class="flex items-center">
                            <input type="text" inputmode="decimal" value="${value ? fmt(value) : ''}" readonly onclick="_abrirModalCantidad(this)" oninput="fmtMoneyInput(this);calculate()" class="${inputClass} font-mono ${colorClass} font-black text-right w-24 text-xl" style="cursor:pointer;caret-color:transparent;">
                            <span class="${colorClass} font-bold ml-1 text-xl">€</span>
                        </div>
                    </div>
                    ${isReforma ? `
                        <label class="cursor-pointer p-2 text-slate-600 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all" title="Subir imagen">
                            <span class="material-symbols-rounded">add_photo_alternate</span>
                            <input type="file" accept="image/*" onchange="subirImagenItemReforma(this)" style="display: none;">
                        </label>
                    ` : ''}
                    <div class="btn-menu-card-wrapper"><button class="btn-menu-card" onclick="toggleCardMenu(this)"><span class="material-symbols-rounded">more_vert</span></button><div class="card-menu-dropdown"><button onclick="archivarCard(this)"><span class="material-symbols-rounded">archive</span>Archivar</button><button class="danger" onclick="eliminarCard(this, calculate)"><span class="material-symbols-rounded">delete</span>Eliminar</button></div></div>
                </div>
            `;
            }
            container.appendChild(div);
            _syncEmptyStates && _syncEmptyStates();
            if (imagenSrc) {
                const iconContainer = div.querySelector('.icon-container');
                iconContainer.innerHTML = `
                    <img src="${imagenSrc}" class="w-full h-full object-cover rounded-xl pointer-events-none">
                    <div class="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                        <span class="material-symbols-rounded text-white text-xs">edit</span>
                    </div>
                `;
                iconContainer.dataset.tipo = 'imagen';
            }
            div.querySelectorAll('.icon-container').forEach(ic => aplicarLongPressIcono(ic));
            
            calculate();
            guardarDatos();
        }
        function aplicarLongPressIcono(el) {
            if (el._longPressAttached) return;
            el._longPressAttached = true;
            el.onclick = null;
            const esBanco = el.classList.contains('icon-container-banco');
            const esPrincipal = el.classList.contains('icon-container-principal');
            if (esBanco) {
                attachIconLongPress(el, function(elemento) {
                    abrirSelectorIconosBanco(elemento);
                });
            } else if (esPrincipal) {
                attachIconLongPress(el, function(elemento) {
                    abrirSelectorIconoPrincipal(elemento);
                });
            } else {
                attachIconLongPress(el, function(elemento) {
                    abrirSelectorIconos(elemento);
                });
            }
        }

        function cambiarTipoReforma(button, tipo) {
            const card = button.closest('.card-input-group');
            card.dataset.tipoReforma = tipo;
            const botones = card.querySelectorAll('.tipo-reforma-btn');
            botones.forEach(btn => {
                if (btn.dataset.tipo === tipo) {
                    if (tipo === 'reforma') {
                        btn.className = 'tipo-reforma-btn flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 transition-all bg-orange-500/20 border-orange-500 text-orange-400';
                    } else {
                        btn.className = 'tipo-reforma-btn flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 transition-all bg-blue-500/20 border-blue-500 text-blue-400';
                    }
                } else {
                    btn.className = 'tipo-reforma-btn flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 transition-all bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600';
                }
            });
            
            guardarDatos();
        }
        
        function abrirURLProducto(button) {
            const card = button.closest('.card-input-group');
            const urlInput = card.querySelector('.reforma-url');
            const url = urlInput?.value?.trim();
            
            if (!url) {
                urlInput?.focus();
                return;
            }
            const urlFinal = url.startsWith('http://') || url.startsWith('https://') 
                ? url 
                : 'https://' + url;
            
            window.open(urlFinal, '_blank');
        }

        function toggleNotasReforma(button) {
            const card = button.closest('.card-input-group');
            const notasPanel = card.querySelector('.notas-reforma');
            const icon = button.querySelector('.material-symbols-rounded');
            
            if (notasPanel.classList.contains('hidden')) {
                notasPanel.classList.remove('hidden');
                icon.textContent = 'edit_note';
                button.classList.add('text-indigo-400', 'bg-indigo-500/10');
            } else {
                notasPanel.classList.add('hidden');
                icon.textContent = 'note_add';
                button.classList.remove('text-indigo-400', 'bg-indigo-500/10');
            }
        }
        function _attachThumbnailLongPress(wrapper, card) {
            let timer = null;
            let moved = false;
            wrapper.addEventListener('touchstart', function(e) {
                moved = false;
                e.stopPropagation(); // No interferir con eventos de la tarjeta
                timer = setTimeout(() => {
                    if (!moved) {
                        if (navigator.vibrate) navigator.vibrate(40);
                        abrirSelectorMiniaturaCard(card);
                    }
                }, 800);
            }, { passive: true });
            
            wrapper.addEventListener('touchmove', () => { 
                moved = true; 
                clearTimeout(timer); 
            }, { passive: true });
            
            wrapper.addEventListener('touchend', (e) => {
                e.stopPropagation(); // No interferir con eventos de la tarjeta
                clearTimeout(timer);
            }, { passive: true });
            
            wrapper.addEventListener('touchcancel', () => {
                clearTimeout(timer);
            }, { passive: true });
            let desktopTimer = null;
            
            wrapper.addEventListener('mousedown', function(e) {
                e.stopPropagation(); // IMPORTANTE: No interferir con el mousedown de la tarjeta
                wrapper.style.transition = 'opacity 0.8s';
                wrapper.style.opacity = '0.5';
                desktopTimer = setTimeout(() => {
                    wrapper.style.opacity = '';
                    abrirSelectorMiniaturaCard(card);
                }, 800);
            });
            
            wrapper.addEventListener('mouseup', (e) => { 
                e.stopPropagation(); // IMPORTANTE: No interferir con el mouseup de la tarjeta
                clearTimeout(desktopTimer);
                wrapper.style.opacity = ''; 
            });
            
            wrapper.addEventListener('mouseleave', () => { 
                clearTimeout(desktopTimer);
                wrapper.style.opacity = ''; 
            });
        }

        function crearPreviewCard(tipo, nombre, valor, notas, url, imagenesArray, iconoPersonalizado, colorIcono, iconoImagen, miniatura) {
            const div = document.createElement('div');
            div.className = 'reforma-preview-card card-input-group';
            div.dataset.tipoReforma = tipo;
            div.dataset.liked = 'false';
            div.addEventListener('click', (e) => {
                if (e.target.closest('.card-thumbnail-wrapper') ||
                    e.target.closest('.card-titulo-preview') ||
                    e.target.closest('.card-precio-preview') ||
                    e.target.tagName === 'BUTTON' || 
                    e.target.closest('button') ||
                    e.target.closest('.card-actions')) {
                    return;
                }
                if (!div.classList.contains('active-card')) {
                    e.stopPropagation();
                    centrarCard(div);
                } else {
                    e.stopPropagation();
                }
            });

            const isReforma = tipo === 'reforma';
            const colorAccent  = isReforma ? '#f97316' : '#3b82f6';       // naranja / azul
            const colorDark    = isReforma ? '#431407' : '#1e3a5f';       // fondo oscuro
            const colorMid     = isReforma ? 'rgba(234,88,12,0.6)' : 'rgba(37,99,235,0.6)';
            const badgeLabel   = isReforma ? 'REFORMA' : 'MOBILIARIO';
            const badgeBg      = isReforma ? 'rgba(249,115,22,0.25)' : 'rgba(59,130,246,0.25)';
            const badgeBorder  = isReforma ? 'rgba(249,115,22,0.5)' : 'rgba(59,130,246,0.5)';
            const iconoDefault = isReforma ? 'construction' : 'weekend';
            if (!isReforma && iconoPersonalizado === 'chair' || iconoPersonalizado === 'park') iconoPersonalizado = 'weekend';
            const nombreFinal  = nombre || (isReforma ? 'Nueva Reforma' : 'Nuevo Mobiliario');
            const valorFinal   = valor || 0;
            const precioFmt    = fmt(valorFinal);
            const portadaSrc = imagenesArray && imagenesArray.length > 0 ? imagenesArray[0] : null;
            const iconoPersonalizadoReal = iconoPersonalizado && iconoPersonalizado !== iconoDefault;
            const thumbnailHTML = miniatura
                ? `<img src="${miniatura}" class="card-thumbnail" alt="Miniatura" style="pointer-events:none;">`
                : portadaSrc
                    ? `<img src="${portadaSrc}" class="card-thumbnail" alt="Miniatura" style="pointer-events:none;">`
                    : `<div class="card-thumbnail-placeholder" style="pointer-events:none;"><span class="material-symbols-rounded" style="font-size:20px;color:rgba(255,255,255,0.3);">image</span></div>`;
            const seccionTituloEl = document.querySelector(tipo === 'mobiliario' ? '#carrusel-mobiliario-wrapper' : '#carrusel-reformas-wrapper');
            const seccionIcono = seccionTituloEl ? seccionTituloEl.closest('.reforma-seccion')?.querySelector('h2 .material-symbols-rounded')?.textContent : null;
            const iconoFondo = seccionIcono || (isReforma ? 'construction' : 'weekend');
            const bgHTML = portadaSrc
                ? `<img class="card-bg-img" src="${portadaSrc}" alt="">`
                : `<div class="card-bg-color" style="position:absolute;top:0;left:0;right:0;bottom:0;background: linear-gradient(135deg, ${colorDark} 0%, ${colorMid} 100%);"></div>
                   <div class="card-bg-icon" style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:0;display:flex;align-items:center;justify-content:center;opacity:0.18;pointer-events:none;">
                       <span class="material-symbols-rounded" style="font-size:90px;color:white;">${iconoFondo}</span>
                   </div>`;

            div.innerHTML = `
                ${bgHTML}
                <div class="card-gradient"></div>
                <!-- Reflejo diagonal: z-index 50 para estar sobre todo -->
                <div class="card-shine" style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:50;pointer-events:none;overflow:hidden;border-radius:inherit;"></div>
                <!-- Badge: position absolute arriba izquierda -->
                <div style="position:absolute;top:12px;left:12px;right:12px;z-index:3;display:flex;align-items:center;gap:6px;">
                    <span class="card-badge" style="background:${badgeBg};color:white;border:1px solid ${badgeBorder};">${badgeLabel}</span>
                    <!-- Corazón ghost: solo visible cuando liked y la card es ghost -->
                    <span class="card-ghost-heart" style="display:none;background:rgba(220,38,38,0.9);border:1px solid rgba(220,38,38,0.6);border-radius:50%;width:22px;height:22px;box-sizing:border-box;align-items:center;justify-content:center;flex-shrink:0;">
                        <span class="material-symbols-rounded" style="font-size:13px;color:white;font-variation-settings:'FILL' 1;">favorite</span>
                    </span>
                </div>
                <!-- Contenido inferior -->
                <div style="position:absolute;bottom:0;left:0;right:0;z-index:2;padding:10px 16px 12px 16px;box-sizing:border-box;will-change:transform;transform:translateZ(0);transition:padding 0.5s ease;">
                    <div class="card-bottom">
                        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:8px;">
                            <div class="card-thumbnail-wrapper" style="position:relative;cursor:pointer;display:inline-flex;align-self:flex-start;" title="Mantén pulsado para cambiar">
                                ${thumbnailHTML}
                            </div>
                            <div style="min-width:0;">
                                <p class="card-titulo-preview">${nombreFinal}</p>
                                <div style="display:flex;align-items:baseline;gap:3px;margin-top:8px;">
                                    <span class="card-precio-preview" style="color:${colorAccent};font-weight:900;text-shadow:0 0 12px ${colorAccent}44;">${precioFmt}</span>
                                    <span class="card-euro-preview" style="color:${colorAccent};font-weight:700;font-size:13px;">€</span>
                                </div>
                            </div>
                        </div>
                        <div class="card-actions">
                            <button class="card-btn-explorar card-btn-icon" style="flex:1;padding:8px 0 !important;border-radius:10px !important;font-size:10px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;text-align:center;" data-accent="${colorAccent}" onmouseenter="this.style.borderColor='${colorAccent}';this.style.color='${colorAccent}';" onmouseleave="this.style.borderColor='rgba(255,255,255,0.1)';this.style.color='#64748b';" onclick="abrirModalReforma(this.closest('.reforma-preview-card'))">
                                <span class="explorar-text">EXPLORAR</span>
                                <span class="explorar-icon material-symbols-rounded" style="font-size:16px;">visibility</span>
                            </button>
                            <button class="card-btn-icon like-btn" data-accent="#dc2626" onmouseenter="this.style.borderColor='rgba(255,255,255,0.5)';this.style.color='white';" onmouseleave="!this.classList.contains('liked')&&(this.style.borderColor='rgba(255,255,255,0.1)',this.style.color='rgba(255,255,255,0.7)');" onclick="toggleLike(this)" title="Me gusta">
                                <span class="material-symbols-rounded card-like-icon" style="font-size:16px;">favorite</span>
                            </button>
                            <button class="card-btn-icon" data-accent="${colorAccent}" onmouseenter="this.style.borderColor='${colorAccent}';this.style.color='${colorAccent}';" onmouseleave="this.style.borderColor='rgba(255,255,255,0.1)';this.style.color='#64748b';" onclick="abrirLinkCard(this.closest('.reforma-preview-card'))" title="Abrir enlace">
                                <span class="material-symbols-rounded" style="font-size:16px;">open_in_new</span>
                            </button>
                            <button class="card-btn-icon" onmouseenter="this.style.borderColor='rgba(248,113,113,0.6)';this.style.color='#f87171';" onmouseleave="this.style.borderColor='rgba(255,255,255,0.1)';this.style.color='#64748b';" onclick="eliminarCardDirecto(this.closest('.reforma-preview-card'))" title="Eliminar">
                                <span class="material-symbols-rounded" style="font-size:16px;">delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            div.dataset.nombre     = nombreFinal;
            div.dataset.valor      = valorFinal;
            div.dataset.notas      = notas || '';
            div.dataset.url        = url || '';
            div.dataset.imagenes   = JSON.stringify(imagenesArray || []);
            div.dataset.icono      = iconoPersonalizado || iconoDefault;
            div.dataset.colorIcono = colorIcono || '';
            div.dataset.iconoImagen= iconoImagen || '';
            if (miniatura) div.dataset.miniatura = miniatura;
            div.dataset.liked      = 'false'; // Inicializar como no liked
            setTimeout(() => {
                const thumbnailWrapper = div.querySelector('.card-thumbnail-wrapper');
                if (thumbnailWrapper) {
                    _attachThumbnailLongPress(thumbnailWrapper, div);
                }
                const cardBottom = div.querySelector('.card-bottom');
                if (cardBottom) {
                    cardBottom.addEventListener('click', function(e) {
                        if (e.target.closest('button') || 
                            e.target.closest('.card-actions') ||
                            e.target.closest('.card-thumbnail-wrapper')) {
                            return;
                        }
                        
                        if (!div.classList.contains('active-card')) {
                            e.stopPropagation();
                            centrarCard(div);
                        }
                    });
                }
                
                div.addEventListener('mouseenter', function() {});
                div.addEventListener('mouseleave', function() {});
            }, 0);

            const borderDiv = document.createElement('div');
            borderDiv.className = 'card-gradient-border';
            div.appendChild(borderDiv);

            return div;
        }
        function eliminarCardDirecto(card) {
            if (!card) return;
            if (typeof _undoPushInmediato === 'function') _undoPushInmediato();
            const lista = card.closest('[id^="lista"]');
            const container = card.parentElement;
            card.style.transition = 'opacity 0.25s, transform 0.25s';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.85)';
            setTimeout(() => {
                card.remove();
                if (container) actualizarZindexCards(container);
                calculate();
                guardarDatos();
            }, 250);
        }
        function crearInputsOcultos(div, tipo, nombre, valor, notas, url, imagenesArray) {
            const hidden = document.createElement('div');
            hidden.style.display = 'none';
            hidden.className = 'reforma-hidden-data';

            const colorClase = tipo === 'reforma' ? 'text-orange-400' : 'text-blue-400';
            const inp = document.createElement('input');
            inp.type = 'text';
            inp.value = nombre || '';
            inp.className = 'reforma-nombre-hidden';
            hidden.appendChild(inp);
            const inpV = document.createElement('input');
            inpV.type = 'number';
            inpV.value = valor || 0;
            inpV.className = 'reforma-input ' + colorClase;
            hidden.appendChild(inpV);
            const ta = document.createElement('textarea');
            ta.value = notas || '';
            ta.className = 'reforma-notas';
            hidden.appendChild(ta);
            const inpU = document.createElement('input');
            inpU.type = 'url';
            inpU.value = url || '';
            inpU.className = 'reforma-url';
            hidden.appendChild(inpU);
            (imagenesArray || []).forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.className = 'reforma-imagen';
                img.style.display = 'none';
                hidden.appendChild(img);
            });
            div.appendChild(hidden);
        }

        function addReformaCompleta(tipo) {
            const containerId = tipo === 'mobiliario' ? 'listaMobiliario' : 'listaReformas';
            const container = document.getElementById(containerId);
            if (typeof _undoPushInmediato === 'function') _undoPushInmediato();
            const nombre = tipo === 'reforma' ? 'Nueva Reforma' : 'Nuevo Mobiliario';
            const div = crearPreviewCard(tipo, nombre, 0, '', '', [], '', '', '');
            crearInputsOcultos(div, tipo, nombre, 0, '', '', []);
            container.insertBefore(div, container.firstChild);
            actualizarZindexCards(container);
            calculate();
            guardarDatos();
            const seccion = tipo === 'mobiliario' ? 'mobiliario' : 'reforma';
            const track = document.getElementById('carrusel-' + seccion);
            if (track) track.scrollTo({ left: 0, behavior: 'smooth' });
        }

        function addReformaCompletaCargada(tipo, nombre, valor, notas, url, imagenesArray, iconoPersonalizado, colorIcono, iconoImagen, liked, miniatura) {
            const containerId = tipo === 'mobiliario' ? 'listaMobiliario' : 'listaReformas';
            const container = document.getElementById(containerId);
            const div = crearPreviewCard(tipo, nombre, valor, notas, url, imagenesArray, iconoPersonalizado, colorIcono, iconoImagen, miniatura);
            crearInputsOcultos(div, tipo, nombre, valor, notas, url, imagenesArray);
            if (liked === true) {
                div.dataset.liked = 'true';
                const likeBtn = div.querySelector('.like-btn');
                const icon = likeBtn?.querySelector('.material-symbols-rounded');
                const ghostHeart = div.querySelector('.card-ghost-heart');
                const isReforma = tipo === 'reforma';
                const accentColor = '#dc2626';
                
                if (icon) {
                    icon.style.fontVariationSettings = "'FILL' 1";
                }
                if (likeBtn) {
                    likeBtn.style.color = 'white';
                    likeBtn.style.borderColor = 'rgba(255,255,255,0.5)';
                    likeBtn.style.background = 'rgba(255,255,255,0.15)';
                    likeBtn.classList.add('liked');
                }
                if (ghostHeart) {
                    ghostHeart.style.display = 'flex';
                }
            }
            
            container.appendChild(div);
            actualizarZindexCards(container);
        }

        /* Primera tarjeta (izq) = z-index más alto → queda encima visualmente */
        function actualizarZindexCards(container) {
            const cards = container.querySelectorAll('.reforma-preview-card');
            const total = cards.length;
            cards.forEach((card, i) => {
                card.style.zIndex = total - i;
            });
        }
        function toggleLike(btn) {
            const card = btn.closest('.reforma-preview-card');
            const icon = btn.querySelector('.material-symbols-rounded');
            const isLiked = card.dataset.liked === 'true';
            const isReforma = card.dataset.tipoReforma === 'reforma';
            const accentColor = '#dc2626';
            const ghostHeart = card.querySelector('.card-ghost-heart');
            card.dataset.liked = (!isLiked).toString();
            if (isLiked) {
                icon.style.fontVariationSettings = "'FILL' 0";
                btn.style.color = 'rgba(255,255,255,0.7)';
                btn.style.borderColor = 'rgba(255,255,255,0.1)';
                btn.style.background = 'transparent';
                btn.classList.remove('liked');
                if (ghostHeart) ghostHeart.style.display = 'none';
            } else {
                icon.style.fontVariationSettings = "'FILL' 1";
                btn.style.color = 'white';
                btn.style.borderColor = 'rgba(255,255,255,0.5)';
                btn.style.background = 'rgba(255,255,255,0.15)';
                btn.classList.add('liked');
                if (ghostHeart) ghostHeart.style.display = 'flex';
            }
            guardarDatos();
        }

        function abrirLinkCard(card) {
            const url = card.dataset.url || '';
            if (!url.trim()) return;
            window.open(url.startsWith('http') ? url : 'https://' + url, '_blank');
        }
        function actualizarPreviewCard(card) {
            const tipo     = card.dataset.tipoReforma;
            const nombre   = card.dataset.nombre || '';
            const valor    = parseMoneyInput(card.dataset.valor || "0");
            const imagenes = JSON.parse(card.dataset.imagenes || '[]');
            const miniatura = card.dataset.miniatura; // Miniatura independiente solo para el contenedor pequeño
            const isReforma   = tipo === 'reforma';
            const colorAccent = isReforma ? '#f97316' : '#3b82f6';
            const colorDark   = isReforma ? '#431407' : '#1e3a5f';
            const colorMid    = isReforma ? 'rgba(234,88,12,0.6)' : 'rgba(37,99,235,0.6)';
            const iconoDefault= isReforma ? 'construction' : 'weekend';
            const precioFmt   = fmt(valor);
            const tituloEl = card.querySelector('.card-titulo-preview');
            if (tituloEl) tituloEl.textContent = nombre || (isReforma ? 'Nueva Reforma' : 'Nuevo Mobiliario');
            const precioEl = card.querySelector('.card-precio-preview');
            if (precioEl) { precioEl.textContent = precioFmt; precioEl.style.color = colorAccent; }
            const euroEl = precioEl?.nextElementSibling;
            if (euroEl) euroEl.style.color = colorAccent;
            const thumbnail = card.querySelector('.card-thumbnail');
            const thumbnailPlaceholder = card.querySelector('.card-thumbnail-placeholder');
            const iconoCard = card.dataset.icono;
            const colorIconoCard = card.dataset.colorIcono || '#94a3b8';
            if (miniatura) {
                if (thumbnail) {
                    thumbnail.src = miniatura;
                } else if (thumbnailPlaceholder) {
                    const img = document.createElement('img');
                    img.className = 'card-thumbnail';
                    img.src = miniatura;
                    thumbnailPlaceholder.replaceWith(img);
                }
            } else {
                if (!thumbnailPlaceholder) {
                    const div = document.createElement('div');
                    div.className = 'card-thumbnail-placeholder';
                    div.style.pointerEvents = 'none';
                    div.innerHTML = '<span class="material-symbols-rounded" style="font-size:20px;color:rgba(255,255,255,0.3);">image</span>';
                    if (thumbnail) thumbnail.replaceWith(div);
                } else {
                    thumbnailPlaceholder.innerHTML = '<span class="material-symbols-rounded" style="font-size:20px;color:rgba(255,255,255,0.3);">image</span>';
                }
            }
            const bgImg = card.querySelector('.card-bg-img');
            const bgColor = card.querySelector('.card-bg-color');
            if (imagenes.length > 0) {
                if (bgImg) { bgImg.src = imagenes[0]; bgImg.style.display = 'block'; }
                else {
                    const img = document.createElement('img');
                    img.className = 'card-bg-img';
                    img.src = imagenes[0];
                    card.insertBefore(img, card.firstChild);
                }
                if (bgColor) bgColor.style.display = 'none';
                const iconDiv = card.querySelector('.card-bg-icon');
                if (iconDiv) iconDiv.style.display = 'none';
            } else {
                if (bgImg) bgImg.style.display = 'none';
                let bgColorEl = bgColor;
                if (!bgColorEl) {
                    bgColorEl = document.createElement('div');
                    bgColorEl.className = 'card-bg-color';
                    card.insertBefore(bgColorEl, card.firstChild);
                }
                bgColorEl.style.display = '';
                bgColorEl.style.position = 'absolute';
                bgColorEl.style.inset = '0';
                bgColorEl.style.background = `linear-gradient(135deg, ${colorDark} 0%, ${colorMid} 100%)`;
                let iconDiv = card.querySelector('.card-bg-icon');
                if (!iconDiv) {
                    iconDiv = document.createElement('div');
                    iconDiv.className = 'card-bg-icon';
                    iconDiv.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;z-index:0;display:flex;align-items:center;justify-content:center;opacity:0.18;pointer-events:none;';
                    iconDiv.innerHTML = `<span class="material-symbols-rounded" style="font-size:90px;color:white;">${iconoDefault}</span>`;
                    bgColorEl.insertAdjacentElement('afterend', iconDiv);
                }
                if (iconDiv) {
                    iconDiv.style.position = 'absolute';
                    iconDiv.style.inset = '0';
                    iconDiv.style.display = 'flex';
                }
            }
            const hidden = card.querySelector('.reforma-hidden-data');
            if (hidden) {
                const inpN = hidden.querySelector('.reforma-nombre-hidden');
                if (inpN) inpN.value = card.dataset.nombre;
                const inpV = hidden.querySelector('.reforma-input');
                if (inpV) inpV.value = card.dataset.valor;
                const ta = hidden.querySelector('.reforma-notas');
                if (ta) ta.value = card.dataset.notas;
                const inpU = hidden.querySelector('.reforma-url');
                if (inpU) inpU.value = card.dataset.url;
                hidden.querySelectorAll('.reforma-imagen').forEach(i => i.remove());
                (JSON.parse(card.dataset.imagenes || '[]')).forEach(src => {
                    const img = document.createElement('img');
                    img.src = src; img.className = 'reforma-imagen'; img.style.display = 'none';
                    hidden.appendChild(img);
                });
            }
            const thumbnailWrapper = card.querySelector('.card-thumbnail-wrapper');
            if (thumbnailWrapper) {
                thumbnailWrapper.replaceWith(thumbnailWrapper.cloneNode(true));
                const newWrapper = card.querySelector('.card-thumbnail-wrapper');
                _attachThumbnailLongPress(newWrapper, card);
            }
        }
        let _modalCard = null; // referencia a la card actualmente abierta

        function abrirModalReforma(card) {
            _modalCard = card;
            const tipo = card.dataset.tipoReforma;
            const isReforma = tipo === 'reforma';
            const colorPrecio = isReforma ? '#f97316' : '#3b82f6';
            const badge = document.getElementById('modal-badge');
            if (badge) { badge.textContent = isReforma ? 'REFORMA' : 'MOBILIARIO'; }
            badge.style.background = isReforma ? '#fb923c' : '#3b82f6';
            badge.style.color = 'white';
            document.getElementById('modal-titulo').value = card.dataset.nombre || '';
            document.getElementById('modal-precio').value = card.dataset.valor || 0;
            document.getElementById('modal-precio').style.color = colorPrecio;
            document.getElementById('modal-precio-color').style.color = colorPrecio;
            document.getElementById('modal-notas').value = card.dataset.notas || '';
            document.getElementById('modal-url').value = card.dataset.url || '';
            const imagenes = JSON.parse(card.dataset.imagenes || '[]');
            const portadaImg = document.getElementById('modal-portada-img');
            const portadaPlaceholder = document.getElementById('modal-portada-placeholder');
            
            if (imagenes.length > 0) {
                portadaImg.src = imagenes[0];
                portadaImg.style.display = 'block';
                portadaPlaceholder.style.display = 'none';
            } else {
                portadaImg.style.display = 'none';
                portadaPlaceholder.style.display = 'flex';
            }
            renderModalFotos(imagenes, tipo);
            _actualizarCorazonModal(card);
            const _panel = document.getElementById('modal-reforma-panel');
            _panel.style.transition = 'none';
            _panel.style.transform = 'translateY(100%)';
            _panel.scrollTop = 0;
            const _overlay = document.getElementById('modal-reforma-overlay');
            _overlay.style.opacity = '';
            requestAnimationFrame(function() {
                _panel.style.transition = 'transform 0.35s cubic-bezier(.32,1,.48,1)';
                _panel.style.transform = 'translateY(0)';
                _overlay.classList.add('open');
            });
            document.body.style.overflow = 'hidden';
        }

        function toggleFotosEditMode() {
            const grid = document.getElementById('modal-fotos-grid');
            const label = document.getElementById('btn-fotos-edit-label');
            const btn = document.getElementById('btn-fotos-edit');
            const isEdit = grid.classList.toggle('edit-mode');
            label.textContent = isEdit ? 'Listo' : 'Editar';
            btn.style.color = isEdit ? '#60a5fa' : '#475569';
        }

        function renderModalFotos(imagenes, tipo) {
            const grid = document.getElementById('modal-fotos-grid');
            grid.innerHTML = '';
            grid.classList.remove('edit-mode');

            imagenes.forEach((src, idx) => {
                const item = document.createElement('div');
                item.className = 'modal-foto-item';
                item.innerHTML = `
                    <span class="modal-foto-drag-handle" title="Arrastrar">
                        <span class="drag-icon material-symbols-rounded" style="font-size:20px;color:white;">drag_indicator</span>
                        <button class="modal-foto-del" onclick="event.stopPropagation();eliminarFotoModal(${idx})" title="Eliminar">
                            <span class="material-symbols-rounded" style="font-size:13px;">close</span>
                        </button>
                    </span>
                    <img src="${src}" draggable="false" style="-webkit-tap-highlight-color:transparent;" onclick="verFotoGrandeModal(this)">
                `;
                let longPressTimer;
                item.addEventListener('touchstart', () => {
                    longPressTimer = setTimeout(() => {
                        grid.classList.add('edit-mode');
                        if (navigator.vibrate) navigator.vibrate(30);
                    }, 500);
                }, { passive: true });
                item.addEventListener('touchend', () => clearTimeout(longPressTimer), { passive: true });
                item.addEventListener('touchmove', () => clearTimeout(longPressTimer), { passive: true });

                grid.appendChild(item);
            });
            const addBtn = document.createElement('label');
            addBtn.className = 'modal-add-foto';
            addBtn.innerHTML = `
                <span class="material-symbols-rounded text-slate-600" style="font-size:20px;">add_photo_alternate</span>
                <span style="font-size:9px;color:#475569;font-weight:700;">Añadir</span>
                <input type="file" accept="image/*" multiple style="display:none;" onchange="subirFotoModal(this)">
            `;
            grid.appendChild(addBtn);
            if (window.Sortable) {
                if (grid._sortable) { grid._sortable.destroy(); grid._sortable = null; }
                grid._sortable = new Sortable(grid, {
                    handle: '.modal-foto-drag-handle',
                    filter: '.modal-add-foto',
                    animation: 150,
                    forceFallback: true,
                    fallbackClass: 'sortable-drag',
                    fallbackOnBody: true,
                    fallbackTolerance: 0,
                    ghostClass: 'foto-ghost',
                    onStart: function(evt) {
                        document.getElementById('modal-reforma-panel').style.overflow = 'hidden';
                        const realWidth = evt.item.getBoundingClientRect().width;
                        evt.item.style.width = realWidth + 'px';
                        requestAnimationFrame(() => {
                            const clone = document.querySelector('.sortable-drag');
                            if (clone) {
                                clone.style.width = realWidth + 'px';
                                clone.style.maxWidth = realWidth + 'px';
                            }
                        });
                    },
                    onEnd: function(evt) {
                        evt.item.style.width = '';
                        document.getElementById('modal-reforma-panel').style.overflow = '';
                        const mainEl = document.querySelector('main');
                        const containerEl = document.querySelector('.container');
                        document.body.classList.add('drag-ending');
                        document.documentElement.classList.add('drag-ending');
                        if (mainEl) mainEl.classList.add('drag-ending');
                        if (containerEl) containerEl.classList.add('drag-ending');
                        setTimeout(function() {
                            document.body.classList.remove('drag-ending');
                            document.documentElement.classList.remove('drag-ending');
                            if (mainEl) mainEl.classList.remove('drag-ending');
                            if (containerEl) containerEl.classList.remove('drag-ending');
                        }, 300);
                        if (!_modalCard || evt.oldIndex === evt.newIndex) return;
                        const imgs = JSON.parse(_modalCard.dataset.imagenes || '[]');
                        const [moved] = imgs.splice(evt.oldIndex, 1);
                        imgs.splice(evt.newIndex, 0, moved);
                        _modalCard.dataset.imagenes = JSON.stringify(imgs);
                        actualizarPreviewCard(_modalCard);
                        guardarDatos();
                        renderModalFotos(imgs, _modalCard.dataset.tipoReforma);
                    }
                });
            }
        }

        function _cerrarModal() {
            const panel = document.getElementById('modal-reforma-panel');
            const overlay = document.getElementById('modal-reforma-overlay');
            panel.style.transition = 'transform 0.35s cubic-bezier(.32,1,.48,1)';
            panel.style.transform = 'translateY(100%)';
            overlay.classList.remove('open');
            overlay.style.opacity = ''; // reset inline opacity set during swipe
            document.body.style.overflow = '';
            _modalCard = null;
        }
        (function() {
            let startY = 0, startScrollTop = 0, dragging = false, currentY = 0;
            const THRESHOLD = 120; // px hacia abajo para cerrar
            function _touchInsideScrollable(target, panel) {
                let el = target;
                while (el && el !== panel) {
                    const style = window.getComputedStyle(el);
                    const overflowY = style.overflowY;
                    const canScroll = overflowY === 'auto' || overflowY === 'scroll';
                    if (canScroll && el.scrollHeight > el.clientHeight + 2) {
                        if (el.scrollTop > 2) return true;
                    }
                    el = el.parentElement;
                }
                return false;
            }

            function onTouchStart(e) {
                const panel = document.getElementById('modal-reforma-panel');
                const overlay = document.getElementById('modal-reforma-overlay');
                if (!panel || !overlay || !overlay.classList.contains('open')) return;
                if (e.target && e.target.closest && e.target.closest('#modal-fotos-grid')) return;
                if (!e.touches || !e.touches.length) return;
                startY = e.touches[0].clientY;
                startScrollTop = panel.scrollTop;
                dragging = false;
                currentY = 0;
            }

            function onTouchMove(e) {
                const panel = document.getElementById('modal-reforma-panel');
                const overlay = document.getElementById('modal-reforma-overlay');
                if (!panel || !overlay || !overlay.classList.contains('open')) return;
                if (e.target && e.target.closest && e.target.closest('#modal-fotos-grid')) return;
                if (!e.touches || !e.touches.length) return;
                const dy = e.touches[0].clientY - startY;
                if (!dragging && (dy > 8) && startScrollTop <= 0) {
                    if (_touchInsideScrollable(e.target, panel)) return;
                    dragging = true;
                }
                if (!dragging) return;
                currentY = Math.max(0, dy); // no dejar subir más de su posición original
                panel.style.transition = 'none';
                panel.style.transform = 'translateY(' + currentY + 'px)';
                const ratio = Math.max(0, 1 - currentY / 350);
                overlay.style.opacity = ratio;
                e.preventDefault();
            }

            function onTouchEnd(e) {
                const panel = document.getElementById('modal-reforma-panel');
                const overlay = document.getElementById('modal-reforma-overlay');
                if (!panel || !overlay || !dragging) return;
                dragging = false;
                const snapY = currentY;
                currentY = 0;
                overlay.style.opacity = ''; // siempre resetear opacity inline
                if (snapY > THRESHOLD) {
                    _cerrarModal();
                } else {
                    panel.style.transition = 'transform 0.3s cubic-bezier(.32,1,.48,1)';
                    panel.style.transform = 'translateY(0)';
                }
            }

            document.addEventListener('touchstart', onTouchStart, { passive: true });
            document.addEventListener('touchmove', onTouchMove, { passive: false });
            document.addEventListener('touchend', onTouchEnd, { passive: true });
        })();
        document.addEventListener('DOMContentLoaded', function() {
            const overlay = document.getElementById('modal-reforma-overlay');
            if (overlay) {
                let mouseDownTarget = null;
                let mouseDownX = 0;
                let mouseDownY = 0;
                let hasMoved = false;
                
                overlay.addEventListener('mousedown', function(e) {
                    mouseDownTarget = e.target;
                    mouseDownX = e.clientX;
                    mouseDownY = e.clientY;
                    hasMoved = false;
                });
                
                overlay.addEventListener('mousemove', function(e) {
                    if (mouseDownTarget) {
                        const deltaX = Math.abs(e.clientX - mouseDownX);
                        const deltaY = Math.abs(e.clientY - mouseDownY);
                        if (deltaX > 5 || deltaY > 5) {
                            hasMoved = true;
                        }
                    }
                });
                
                overlay.addEventListener('mouseup', function(e) {
                    mouseDownTarget = null;
                    hasMoved = false;
                });
            }
            const modalNotas = document.getElementById('modal-notas');
            if (modalNotas) {
                modalNotas.addEventListener('paste', function(e) {
                    e.preventDefault();
                    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
                    const cleaned = text
                        .replace(/&nbsp;/gi, ' ')
                        .replace(/&amp;/gi, '&')
                        .replace(/&lt;/gi, '<')
                        .replace(/&gt;/gi, '>')
                        .replace(/&quot;/gi, '"')
                        .replace(/&#39;/gi, "'")
                        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
                        .replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
                        .replace(/\u00A0/g, ' ')        // Espacios duros Unicode
                        .replace(/\u200B/g, '')         // Espacios de ancho cero
                        .replace(/\u2060/g, '')         // Word joiner
                        .replace(/\uFEFF/g, '')         // Byte order mark
                        .replace(/[ ]{2,}/g, ' ');      // Normalizar múltiples espacios
                    const start = this.selectionStart;
                    const end = this.selectionEnd;
                    const val = this.value;
                    
                    this.value = val.slice(0, start) + cleaned + val.slice(end);
                    this.selectionStart = this.selectionEnd = start + cleaned.length;
                    this.dispatchEvent(new Event('input'));
                });
            }
        });

        function syncModalToCard() {
            if (!_modalCard) return;
            _modalCard.dataset.nombre = document.getElementById('modal-titulo').value;
            _modalCard.dataset.valor = document.getElementById('modal-precio').value || 0;
            _modalCard.dataset.notas = document.getElementById('modal-notas').value;
            _modalCard.dataset.url = document.getElementById('modal-url').value;
            actualizarPreviewCard(_modalCard);
            calculate();
            guardarDatos();
        }

        function guardarModalYCerrar() {
            if (typeof _undoPushInmediato === 'function') _undoPushInmediato();
            syncModalToCard();
            _cerrarModal();
        }

        function abrirModalURL() {
            const url = document.getElementById('modal-url').value.trim();
            if (!url) return;
            window.open(url.startsWith('http') ? url : 'https://' + url, '_blank');
        }

        function subirFotoModal(input) {
            if (!_modalCard || !input.files.length) return;
            const tipo = _modalCard.dataset.tipoReforma;
            const imagenes = JSON.parse(_modalCard.dataset.imagenes || '[]');
            const files = Array.from(input.files);
            let loaded = 0;
            files.forEach(async file => {
                try {
                    const url = await subirACloudinary(file);
                    imagenes.push(url);
                } catch (e) {
                    // fallback a base64 si falla Cloudinary
                    await new Promise(res => {
                        const reader = new FileReader();
                        reader.onload = ev => { imagenes.push(ev.target.result); res(); };
                        reader.readAsDataURL(file);
                    });
                }
                loaded++;
                if (loaded === files.length) {
                    _modalCard.dataset.imagenes = JSON.stringify(imagenes);
                    actualizarPreviewCard(_modalCard);
                    renderModalFotos(imagenes, tipo);
                    const portadaImg = document.getElementById('modal-portada-img');
                    const portadaPlaceholder = document.getElementById('modal-portada-placeholder');
                    if (imagenes.length > 0) {
                        portadaImg.src = imagenes[0];
                        portadaImg.style.display = 'block';
                        portadaPlaceholder.style.display = 'none';
                    }
                    guardarDatos();
                }
            });
            input.value = '';
        }

        function subirMiniaturaModal(input) {
            if (!_modalCard || !input.files.length) return;
            const file = input.files[0];
            subirACloudinary(file).then(url => {
                _modalCard.dataset.miniatura = url;
                const portadaImg = document.getElementById('modal-portada-img');
                const portadaPlaceholder = document.getElementById('modal-portada-placeholder');
                portadaImg.src = url;
                portadaImg.style.display = 'block';
                portadaPlaceholder.style.display = 'none';
                actualizarPreviewCard(_modalCard);
                guardarDatos();
            }).catch(() => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    _modalCard.dataset.miniatura = e.target.result;
                    const portadaImg = document.getElementById('modal-portada-img');
                    const portadaPlaceholder = document.getElementById('modal-portada-placeholder');
                    portadaImg.src = e.target.result;
                    portadaImg.style.display = 'block';
                    portadaPlaceholder.style.display = 'none';
                    actualizarPreviewCard(_modalCard);
                    guardarDatos();
                };
                reader.readAsDataURL(file);
            });
            input.value = '';
        }
        let _cardMiniaturaActual = null;
        
        function abrirSelectorMiniaturaCard(card) {
            if (!card) return;
            _cardMiniaturaActual = card;
            elementoIconoActual = null; // No es un icon-container normal
            tipoElementoActual = 'reforma-card'; // Tipo especial para tarjetas reforma/mobiliario
            
            const tipo = card.dataset.tipoReforma;
            const isReforma = tipo === 'reforma';
            const colorAccent = isReforma ? '#f97316' : '#3b82f6';
            const iconoActual = card.dataset.icono || (isReforma ? 'construction' : 'weekend');
            const colorActual = card.dataset.colorIcono || colorAccent;
            abrirModalIconos();
            mostrarOpcionIcono(); // Mostrar pestaña icono por defecto
            mostrarCategoriaIconos('reformas'); // Categoría relevante
            iconoTemporal = iconoActual;
            colorTemporal = colorActual;
            const preview = document.getElementById('iconoPreview');
            if (preview) { preview.textContent = iconoActual; }
            preview.style.color = colorActual;
            preview.classList.remove('text-slate-600');
            { const _el = document.getElementById('nombreIconoPreview'); if (_el) _el.textContent = iconoActual.replace(/_/g, ' '); }
            document.querySelectorAll('[data-color]').forEach(btn => {
                btn.classList.toggle('ring-4', btn.dataset.color === colorActual);
                btn.classList.toggle('ring-white', btn.dataset.color === colorActual);
            });
        }
        
        function subirImagenMiniatura(input) {
            if (!_cardMiniaturaActual || !input.files.length) return;
            const file = input.files[0];
            subirACloudinary(file).then(url => {
                _cardMiniaturaActual.dataset.miniatura = url;
                actualizarPreviewCard(_cardMiniaturaActual);
                guardarDatos();
            }).catch(() => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    _cardMiniaturaActual.dataset.miniatura = e.target.result;
                    actualizarPreviewCard(_cardMiniaturaActual);
                    guardarDatos();
                };
                reader.readAsDataURL(file);
            });
        }
        
        function eliminarMiniatura() {
            if (!_cardMiniaturaActual) return;
            delete _cardMiniaturaActual.dataset.miniatura;
            actualizarPreviewCard(_cardMiniaturaActual);
            guardarDatos();
        }

        function eliminarFotoModal(idx) {
            if (!_modalCard) return;
            const tipo = _modalCard.dataset.tipoReforma;
            const imagenes = JSON.parse(_modalCard.dataset.imagenes || '[]');
            imagenes.splice(idx, 1);
            _modalCard.dataset.imagenes = JSON.stringify(imagenes);
            actualizarPreviewCard(_modalCard);
            renderModalFotos(imagenes, tipo);
            const portadaImg = document.getElementById('modal-portada-img');
            const portadaPlaceholder = document.getElementById('modal-portada-placeholder');
            if (imagenes.length > 0) {
                portadaImg.src = imagenes[0];
                portadaImg.style.display = 'block';
                portadaPlaceholder.style.display = 'none';
            } else {
                portadaImg.style.display = 'none';
                portadaPlaceholder.style.display = 'flex';
            }
            guardarDatos();
        }

        function verFotoGrandeModal(img) {
            if (typeof verFotoGrande === 'function') verFotoGrande(img);
        }

        function archivarDesdeModal() {
            if (!_modalCard) return;
            const card = _modalCard;
            _cerrarModal();
            const listaId = card.dataset.tipoReforma === 'mobiliario' ? 'listaMobiliario' : 'listaReformas';
            if (typeof _archivados !== 'undefined') {
                if (!_archivados[listaId]) _archivados[listaId] = [];
                const _listaRef = document.getElementById(listaId);
                if (_listaRef) card._archivedPosition = Array.from(_listaRef.children).indexOf(card);
                _archivados[listaId].push(card);
            }
            card.remove();
            calculate();
            guardarDatos();
            actualizarBadgesArchivo();
        }

        function eliminarDesdeModal() {
            if (!_modalCard) return;
            const card = _modalCard;
            _cerrarModal();
            card.remove();
            calculate();
            guardarDatos();
        }

        function formatNotasText(cmd) {
            const ta = document.getElementById('modal-notas');
            if (!ta) return;
            const start = ta.selectionStart;
            const end   = ta.selectionEnd;
            const val   = ta.value;
            const sel   = val.slice(start, end);

            if (cmd === 'clear') {
                const target = sel || val;
                let cleaned = target
                    .replace(/\*\*(.+?)\*\*/g, '$1')  // Eliminar **bold**
                    .replace(/\*(.+?)\*/g, '$1')      // Eliminar *italic*
                    .replace(/&nbsp;/gi, ' ')         // Convertir &nbsp; a espacio normal
                    .replace(/&amp;/gi, '&')          // Convertir &amp; a &
                    .replace(/&lt;/gi, '<')           // Convertir &lt; a <
                    .replace(/&gt;/gi, '>')           // Convertir &gt; a >
                    .replace(/&quot;/gi, '"')         // Convertir &quot; a "
                    .replace(/&#39;/gi, "'")          // Convertir &#39; a '
                    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))  // Entidades numéricas decimales
                    .replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)))  // Entidades numéricas hexadecimales
                    .replace(/\u00A0/g, ' ')          // Reemplazar espacios duros Unicode
                    .replace(/\u200B/g, '')           // Eliminar espacios de ancho cero
                    .replace(/\u2060/g, '')           // Eliminar word joiner
                    .replace(/[ ]{2,}/g, ' ')         // Normalizar múltiples espacios a uno
                    .trim();                          // Eliminar espacios al inicio y final
                
                if (sel) {
                    ta.value = val.slice(0, start) + cleaned + val.slice(end);
                    ta.setSelectionRange(start, start + cleaned.length);
                } else {
                    ta.value = cleaned;
                }
            } else if (cmd === 'bold') {
                if (!sel) return;
                if (sel.startsWith('**') && sel.endsWith('**')) {
                    const inner = sel.slice(2, -2);
                    ta.value = val.slice(0, start) + inner + val.slice(end);
                    ta.setSelectionRange(start, start + inner.length);
                } else {
                    const wrapped = `**${sel}**`;
                    ta.value = val.slice(0, start) + wrapped + val.slice(end);
                    ta.setSelectionRange(start, start + wrapped.length);
                }
            } else if (cmd === 'italic') {
                if (!sel) return;
                if (sel.startsWith('*') && sel.endsWith('*') && !sel.startsWith('**')) {
                    const inner = sel.slice(1, -1);
                    ta.value = val.slice(0, start) + inner + val.slice(end);
                    ta.setSelectionRange(start, start + inner.length);
                } else {
                    const wrapped = `*${sel}*`;
                    ta.value = val.slice(0, start) + wrapped + val.slice(end);
                    ta.setSelectionRange(start, start + wrapped.length);
                }
            }

            ta.dispatchEvent(new Event('input'));
            ta.focus();
        }

        function duplicarDesdeModal() {
            if (!_modalCard) return;
            const card = _modalCard;
            const tipo       = card.dataset.tipoReforma || 'reforma';
            const nombre     = card.dataset.nombre || '';
            const valor      = card.dataset.valor || '0';
            const notas      = card.dataset.notas || '';
            const url        = card.dataset.url || '';
            const imagenes   = JSON.parse(card.dataset.imagenes || '[]');
            const icono      = card.dataset.icono || '';
            const colorIcono = card.dataset.colorIcono || '';
            const iconoImg   = card.dataset.iconoImagen || '';
            const miniatura  = card.dataset.miniatura || '';

            const listaId = tipo === 'mobiliario' ? 'listaMobiliario' : 'listaReformas';
            const lista = document.getElementById(listaId);
            if (!lista) return;
            const nuevaCard = crearPreviewCard(tipo, nombre, valor, notas, url, imagenes, icono, colorIcono, iconoImg, miniatura || null);
            if (card.nextSibling) {
                lista.insertBefore(nuevaCard, card.nextSibling);
            } else {
                lista.appendChild(nuevaCard);
            }

            _cerrarModal();
            calculate();
            guardarDatos();
            setTimeout(() => centrarCard(nuevaCard), 100);
        }
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') _cerrarModal();
        });
        // ── CLOUDINARY ──────────────────────────────────────────────
        const CLOUDINARY_CLOUD = 'dtzcrlyod';
        const CLOUDINARY_PRESET = 'seniorplaz_uploads';

        async function subirACloudinary(file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_PRESET);
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error('Error subiendo a Cloudinary');
            const data = await res.json();
            return data.secure_url;
        }

        async function subirRutaACloudinary(file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_PRESET);
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/raw/upload`, {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error('Error subiendo ruta a Cloudinary');
            const data = await res.json();
            return data.secure_url;
        }

        async function subirPdfACloudinary(file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_PRESET);
            formData.append('resource_type', 'raw');
            formData.append('use_filename', 'true');
            formData.append('unique_filename', 'true');
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/raw/upload`, {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error('Error subiendo PDF a Cloudinary');
            const data = await res.json();
            return data.secure_url;
        }
        // ────────────────────────────────────────────────────────────

        function comprimirImagen(imagenSrc, maxWidth = 600, quality = 0.6) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    const imagenComprimida = canvas.toDataURL('image/jpeg', quality);
                    resolve(imagenComprimida);
                };
                img.src = imagenSrc;
            });
        }
        function verificarEspacioLocalStorage() {
            try {
                const test = 'test';
                localStorage.setItem('test', test);
                localStorage.removeItem('test');
                return true;
            } catch (e) {
                return false;
            }
        }
        async function actualizarIndicadorAlmacenamiento() {
            try {
                let data = await cargarDesdeDB('seniorPlazAppData');
                if (!data) {
                    const dataLS = localStorage.getItem('seniorPlazAppData');
                    data = dataLS ? JSON.parse(dataLS) : {};
                }
                
                const dataString = JSON.stringify(data);
                const usedBytes = new Blob([dataString]).size;
                const maxBytes = 50 * 1024 * 1024; // ~50MB para IndexedDB (mucho más que localStorage)
                const percentage = Math.min(Math.round((usedBytes / maxBytes) * 100), 100);
                
                const percentElement = document.getElementById('storagePercent');
                const barElement = document.getElementById('storageBar');
                
                if (percentElement && barElement) {
                    percentElement.textContent = percentage + '%';
                    barElement.style.width = percentage + '%';
                    if (percentage < 60) {
                        barElement.className = 'h-full bg-blue-500 transition-all duration-300';
                    } else if (percentage < 85) {
                        barElement.className = 'h-full bg-orange-500 transition-all duration-300';
                    } else {
                        barElement.className = 'h-full bg-red-500 transition-all duration-300';
                    }
                }
                try {
                    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
                    let imagenesSize = 0;
                    const dataStr = JSON.stringify(parsedData);
                    const base64Matches = dataStr.match(/data:image\/[^;]+;base64,[^"']*/g) || [];
                    base64Matches.forEach(img => imagenesSize += new Blob([img]).size);
                    const dataSinImagenes = dataStr.replace(/data:image\/[^;]+;base64,[^"']*/g, '');
                    const datosSize = new Blob([dataSinImagenes]).size;
                    const iconosSize = (parsedData.iconosCuentas || '').length + 
                                       (parsedData.iconosInversiones || '').length + 
                                       (parsedData.iconosDonaciones || '').length;
                    const imagenesPct = Math.round((imagenesSize / usedBytes) * 100) || 0;
                    const datosPct = Math.round((datosSize / usedBytes) * 100) || 0;
                    const iconosPct = Math.round((iconosSize / usedBytes) * 100) || 0;
                    
                    const formatSize = (bytes) => {
                        if (bytes < 1024) return bytes + ' B';
                        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
                        return (bytes / 1024 / 1024).toFixed(2) + ' MB';
                    };
                    const indicator = document.getElementById('storageIndicator');
                    if (indicator) {
                        indicator.title = `Imágenes: ${imagenesPct}% (${formatSize(imagenesSize)})\nDatos: ${datosPct}% (${formatSize(datosSize)})\nIconos: ${iconosPct}% (${formatSize(iconosSize)})`;
                    }
                    { const _el = document.getElementById('tooltipImagenes'); if (_el) _el.textContent = formatSize(imagenesSize); }
                    { const _el = document.getElementById('tooltipDatos'); if (_el) _el.textContent = formatSize(datosSize); }
                    { const _el = document.getElementById('tooltipIconos'); if (_el) _el.textContent = formatSize(iconosSize); }
                    { const _el = document.getElementById('tooltipTotal'); if (_el) _el.textContent = formatSize(usedBytes); }
                    { const _el = document.getElementById('tooltipTotalSize'); if (_el) _el.textContent = formatSize(usedBytes); }
                    { const _el = document.getElementById('tooltipDisponible'); if (_el) _el.textContent = formatSize(maxBytes - usedBytes); }
                    
                } catch (e) {
                }
                
            } catch (e) {
            }
        }
        document.addEventListener('DOMContentLoaded', function() {
            const indicator = document.getElementById('storageIndicator');
            const tooltip = document.getElementById('storageTooltip');
            
            if (indicator && tooltip) {
                indicator.addEventListener('mouseenter', function() {
                    tooltip.style.opacity = '1';
                    tooltip.style.pointerEvents = 'auto';
                });
                
                indicator.addEventListener('mouseleave', function() {
                    tooltip.style.opacity = '0';
                    tooltip.style.pointerEvents = 'none';
                });
            }
        });
        const guardarDatosOriginal = guardarDatos;
        guardarDatos = function() {
            try {
                guardarDatosOriginal();
                actualizarIndicadorAlmacenamiento(); // Actualizar indicador
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                } else {
                    throw e;
                }
            }
        };
        window.guardarDatos = guardarDatos;
        
        function subirFotoReforma(input) {
            const files = input.files;
            if (!files || files.length === 0) return;
            
            if (!verificarEspacioLocalStorage()) {
            }
            
            const card = input.closest('.card-input-group');
            
            Array.from(files).forEach(async file => {
                try {
                    const url = await subirACloudinary(file);
                    agregarFotoReforma(card, url);
                } catch (e) {
                    const reader = new FileReader();
                    reader.onload = function(ev) {
                        agregarFotoReforma(card, ev.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        function agregarFotoReforma(card, imagenSrc) {
            const fotoContainer = card.querySelector('.reforma-foto-container');
            const fotosExistentes = fotoContainer.querySelectorAll('.foto-item');
            
            if (fotosExistentes.length === 0) {
                fotoContainer.innerHTML = '<div class="grid grid-cols-6 gap-2 fotos-grid-sortable"></div>';
            }
            
            const grid = fotoContainer.querySelector('.grid');
            const fotoDiv = document.createElement('div');
            fotoDiv.className = 'foto-item relative group cursor-move';
            fotoDiv.innerHTML = `
                <div class="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div class="bg-slate-900/90 text-white rounded p-1 cursor-grab active:cursor-grabbing" title="Arrastrar para reordenar">
                        <span class="material-symbols-rounded" style="font-size: 16px;">drag_indicator</span>
                    </div>
                </div>
                <img src="${imagenSrc}" class="reforma-imagen w-full rounded-lg object-cover bg-slate-900 cursor-pointer" style="aspect-ratio: 1/1;" onclick="verFotoGrande(this)">
                <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button onclick="eliminarEstaFoto(this)" class="bg-red-500/90 hover:bg-red-600 text-white rounded p-1" title="Eliminar">
                        <span class="material-symbols-rounded" style="font-size: 16px;">close</span>
                    </button>
                </div>
            `;
            grid.appendChild(fotoDiv);
            actualizarBotonAgregarFotos(card);
            inicializarSortableFotos(grid);
            guardarDatos();
        }
        
        function actualizarBotonAgregarFotos(card) {
            const fotoContainer = card.querySelector('.reforma-foto-container');
            const fotosActuales = fotoContainer.querySelectorAll('.reforma-imagen').length;
            const botonAnterior = fotoContainer.querySelector('.btn-agregar-fotos');
            if (botonAnterior) botonAnterior.remove();
            const botonDiv = document.createElement('div');
            botonDiv.className = 'btn-agregar-fotos mt-2';
            botonDiv.innerHTML = `
                    <label class="cursor-pointer flex items-center justify-center gap-2 bg-slate-900/50 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-lg p-3 transition-all group">
                        <span class="material-symbols-rounded text-slate-600 group-hover:text-indigo-400 text-sm">add_photo_alternate</span>
                        <span class="text-slate-600 text-xs group-hover:text-indigo-400">Añadir más fotos (${fotosActuales})</span>
                        <input type="file" accept="image/*" multiple onchange="subirFotoReforma(this)" style="display: none;">
                    </label>
                `;
            fotoContainer.appendChild(botonDiv);
        }
        
        function inicializarSortableFotos(grid) {
            if (grid.sortableInstance) {
                grid.sortableInstance.destroy();
            }
            
            const isMobile = window.innerWidth <= 768;
            
            grid.sortableInstance = new Sortable(grid, {
                animation: 150,
                easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                delay: 0, // Sin delay
                delayOnTouchOnly: false,
                touchStartThreshold: 5,
                forceFallback: true,
                fallbackClass: 'sortable-drag',
                fallbackOnBody: true,
                fallbackTolerance: 3,
                setData: function(dataTransfer, dragEl) {
                    const width = dragEl.offsetWidth;
                    dragEl.style.width = width + 'px';
                },
                onStart: function(evt) {
                    const width = evt.item.offsetWidth;
                    evt.item.style.width = width + 'px';
                },
                onChoose: function(evt) {
                    if (navigator.vibrate) navigator.vibrate(30);
                },
                onUnchoose: function(evt) {
                    evt.item.style.border = '';
                    evt.item.style.borderRadius = '';
                    evt.item.style.transform = '';
                    evt.item.style.boxShadow = '';
                    evt.item.style.width = '';
                },
                onEnd: function(evt) {
                    evt.item.style.width = '';
                    const mainEl = document.querySelector('main');
                    const containerEl = document.querySelector('.container');
                    document.body.classList.add('drag-ending');
                    document.documentElement.classList.add('drag-ending');
                    if (mainEl) mainEl.classList.add('drag-ending');
                    if (containerEl) containerEl.classList.add('drag-ending');
                    setTimeout(function() {
                        document.body.classList.remove('drag-ending');
                        document.documentElement.classList.remove('drag-ending');
                        if (mainEl) mainEl.classList.remove('drag-ending');
                        if (containerEl) containerEl.classList.remove('drag-ending');
                    }, 300);
                    guardarDatos();
                }
            });
        }
        
        function eliminarEstaFoto(button) {
            const fotoItem = button.closest('.foto-item');
            const card = button.closest('.card-input-group');
            fotoItem.remove();
            
            const fotoContainer = card.querySelector('.reforma-foto-container');
            const fotosRestantes = fotoContainer.querySelectorAll('.foto-item').length;
            
            if (fotosRestantes === 0) {
                fotoContainer.innerHTML = `
                    <label class="cursor-pointer flex items-center justify-center gap-2 bg-slate-900/50 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-lg p-4 transition-all group">
                        <span class="material-symbols-rounded text-slate-600 group-hover:text-indigo-400">add_photo_alternate</span>
                        <span class="text-slate-600 text-sm group-hover:text-indigo-400">Subir fotos (opcional)</span>
                        <input type="file" accept="image/*" multiple onchange="subirFotoReforma(this)" style="display: none;">
                    </label>
                `;
            } else {
                actualizarBotonAgregarFotos(card);
            }
            guardarDatos();
        }
        
        function verFotoGrande(img) {
            const container = img.closest('.fotos-grid-sortable, .modal-fotos-grid, [id^="modal-fotos"]');
            let fotos = [];
            if (container) {
                fotos = Array.from(container.querySelectorAll('img')).map(i => i.src);
            }
            if (fotos.length === 0) fotos = [img.src];
            let idx = fotos.indexOf(img.src);
            if (idx < 0) idx = 0;
            document.getElementById('lightbox-foto')?.remove();

            const modal = document.createElement('div');
            modal.id = 'lightbox-foto';
            modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.97);z-index:9999999;display:flex;align-items:center;justify-content:center;touch-action:none;';

            const render = () => {
                const hasPrev = idx > 0;
                const hasNext = idx < fotos.length - 1;
                modal.innerHTML = `
                    <button onclick="document.getElementById('lightbox-foto').remove()"
                        style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.12);border:none;color:white;border-radius:50%;width:44px;height:44px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:3;-webkit-tap-highlight-color:transparent;">
                        <span class="material-symbols-rounded" style="font-size:22px;">close</span>
                    </button>
                    ${fotos.length > 1 ? `
                    <button id="lb-prev"
                        style="position:absolute;left:12px;top:50%;transform:translateY(-50%);background:${hasPrev ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)'};border:none;color:${hasPrev ? 'white' : 'rgba(255,255,255,0.2)'};border-radius:50%;width:48px;height:48px;cursor:${hasPrev ? 'pointer' : 'default'};display:flex;align-items:center;justify-content:center;z-index:3;-webkit-tap-highlight-color:transparent;">
                        <span class="material-symbols-rounded" style="font-size:26px;">chevron_left</span>
                    </button>
                    <button id="lb-next"
                        style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:${hasNext ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)'};border:none;color:${hasNext ? 'white' : 'rgba(255,255,255,0.2)'};border-radius:50%;width:48px;height:48px;cursor:${hasNext ? 'pointer' : 'default'};display:flex;align-items:center;justify-content:center;z-index:3;-webkit-tap-highlight-color:transparent;">
                        <span class="material-symbols-rounded" style="font-size:26px;">chevron_right</span>
                    </button>
                    <div style="position:absolute;bottom:24px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.45);font-size:13px;font-family:Manrope,sans-serif;">${idx + 1} / ${fotos.length}</div>
                    ` : ''}
                    <img src="${fotos[idx]}"
                        style="max-width:100%;max-height:100dvh;width:auto;height:auto;object-fit:contain;border-radius:6px;padding:60px 70px;box-sizing:border-box;display:block;">
                `;
                if (hasPrev) modal.querySelector('#lb-prev')?.addEventListener('click', e => { e.stopPropagation(); idx--; render(); });
                if (hasNext) modal.querySelector('#lb-next')?.addEventListener('click', e => { e.stopPropagation(); idx++; render(); });
            };

            render();
            modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
            let lbTouchX = 0, lbTouchY = 0;
            modal.addEventListener('touchstart', e => {
                lbTouchX = e.touches[0].clientX;
                lbTouchY = e.touches[0].clientY;
            }, { passive: true });
            modal.addEventListener('touchend', e => {
                const dx = e.changedTouches[0].clientX - lbTouchX;
                const dy = Math.abs(e.changedTouches[0].clientY - lbTouchY);
                if (Math.abs(dx) > 50 && dy < 80) {
                    if (dx < 0 && idx < fotos.length - 1) { idx++; render(); }
                    else if (dx > 0 && idx > 0) { idx--; render(); }
                } else if (Math.abs(dx) < 10 && dy < 10) {
                    if (e.target === modal) modal.remove();
                }
            }, { passive: true });
            const onKey = e => {
                if (e.key === 'ArrowLeft' && idx > 0) { idx--; render(); }
                else if (e.key === 'ArrowRight' && idx < fotos.length - 1) { idx++; render(); }
                else if (e.key === 'Escape') { modal.remove(); document.removeEventListener('keydown', onKey); }
            };
            document.addEventListener('keydown', onKey);
            const observer = new MutationObserver(() => {
                if (!document.getElementById('lightbox-foto')) {
                    document.removeEventListener('keydown', onKey);
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true });

            document.body.appendChild(modal);
        }
        
        function cambiarFotoReforma(button) {
            const card = button.closest('.card-input-group');
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.multiple = true;
            const tempDiv = document.createElement('div');
            card.appendChild(tempDiv);
            tempDiv.appendChild(input);
            input.onchange = function() {
                subirFotoReforma(this);
            };
            input.click();
            tempDiv.remove();
        }
        
        function eliminarFotoReforma(button) {
            const card = button.closest('.card-input-group');
            const fotoContainer = card.querySelector('.reforma-foto-container');
            fotoContainer.innerHTML = `
                <label class="cursor-pointer flex items-center justify-center gap-2 bg-slate-900/50 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-lg p-4 transition-all group">
                    <span class="material-symbols-rounded text-slate-600 group-hover:text-indigo-400">add_photo_alternate</span>
                    <span class="text-slate-600 text-sm group-hover:text-indigo-400">Subir fotos (opcional)</span>
                    <input type="file" accept="image/*" multiple onchange="subirFotoReforma(this)" style="display: none;">
                </label>
            `;
            guardarDatos();
        }

        function subirImagenItemReforma(input) {
            const file = input.files[0];
            if (!file) return;
            
            if (!verificarEspacioLocalStorage()) {
            }
            
            const card = input.closest('.card-input-group');

            const mostrarImagen = (src) => {
                let imgContainer = card.querySelector('.image-preview-container');
                if (!imgContainer) {
                    imgContainer = document.createElement('div');
                    imgContainer.className = 'image-preview-container mt-3 relative group';
                    card.appendChild(imgContainer);
                }
                imgContainer.innerHTML = `
                    <img src="${src}" class="uploaded-image rounded-lg cursor-pointer hover:opacity-80 transition-opacity" alt="Imagen" style="max-height: 200px; width: auto;">
                    <div class="absolute top-2 right-2 flex gap-1">
                        <button onclick="cambiarTamanoImagen(this, 'small')" class="bg-slate-900/80 hover:bg-slate-800 text-white rounded p-1 text-xs" title="Pequeño">
                            <span class="material-symbols-rounded" style="font-size: 14px;">photo_size_select_small</span>
                        </button>
                        <button onclick="cambiarTamanoImagen(this, 'medium')" class="bg-slate-900/80 hover:bg-slate-800 text-white rounded p-1 text-xs" title="Mediano">
                            <span class="material-symbols-rounded" style="font-size: 14px;">photo_size_select_large</span>
                        </button>
                        <button onclick="cambiarTamanoImagen(this, 'large')" class="bg-slate-900/80 hover:bg-slate-800 text-white rounded p-1 text-xs" title="Grande">
                            <span class="material-symbols-rounded" style="font-size: 14px;">photo_size_select_actual</span>
                        </button>
                        <button onclick="eliminarImagenItem(this)" class="bg-red-500 hover:bg-red-600 text-white rounded p-1">
                            <span class="material-symbols-rounded" style="font-size: 14px;">close</span>
                        </button>
                    </div>
                `;
                guardarDatos();
            };

            subirACloudinary(file).then(mostrarImagen).catch(() => {
                const reader = new FileReader();
                reader.onload = (e) => mostrarImagen(e.target.result);
                reader.readAsDataURL(file);
            });
        }

        function cambiarTamanoImagen(btn, tamano) {
            const img = btn.closest('.image-preview-container').querySelector('.uploaded-image');
            
            if (tamano === 'small') {
                img.style.maxHeight = '100px';
            } else if (tamano === 'medium') {
                img.style.maxHeight = '200px';
            } else if (tamano === 'large') {
                img.style.maxHeight = '400px';
            }
            
            guardarDatos();
        }

        function toggleAsset(checkbox) {
            const card = checkbox.closest('.card-input-group');
            checkbox.checked ? card.classList.remove('disabled') : card.classList.add('disabled');
            calculate();
        }

        function toggleLabel(checkbox) {
            const card = checkbox.closest('.card-input-group');
            const label = card.querySelector('.asset-label');
            if (label) {
                label.style.display = checkbox.checked ? 'block' : 'none';
            }
        }

        function isCardActive(card) {
            const checkbox = card.querySelector('.use-asset-check');
            if (checkbox) return checkbox.checked;
            const icon = card.querySelector('.cuenta-check-icon');
            if (icon) return icon.dataset.checked === 'true';
            return !card.classList.contains('disabled');
        }

        function _parseActivoPersistido(value) {
            return !(value === false || value === 'false' || value === 0 || value === '0' || value === null);
        }

        function toggleCuentaCheck(btn) {
            if (typeof _undoPushInmediato === 'function') _undoPushInmediato();
            const card = btn.closest('.card-input-group');
            const icon = btn.querySelector('.cuenta-check-icon');
            const isChecked = icon.dataset.checked === 'true';
            const newChecked = !isChecked;
            icon.dataset.checked = newChecked ? 'true' : 'false';
            icon.style.color = newChecked ? '#10b981' : '#94a3b8';
            btn.childNodes.forEach(node => {
                if (node.nodeType === 3) node.textContent = newChecked ? 'Desactivar' : 'Activar';
            });
            newChecked ? card.classList.remove('disabled') : card.classList.add('disabled');
            guardarDatosAhora().catch(() => {});
            calculate();
        }

        function autoToggleCuenta(input) {
            const card = input.closest('.card-input-group');
            if (!card) return;
            (function() {
                if (typeof window.finanzasData === 'undefined' || !Array.isArray(window.finanzasData.operaciones)) return;
            })();

            const icon = card.querySelector('.cuenta-check-icon');
            if (!icon) return;
            const val = parseMoneyInput(input.value);
            const isChecked = icon.dataset.checked === 'true';
            const isDisabled = card.classList.contains('disabled');

            if (val <= 0 && !isDisabled) {
                icon.dataset.checked = 'false';
                icon.style.color = '#94a3b8';
                card.querySelector('[onclick="toggleCuentaCheck(this)"]')?.childNodes.forEach(node => {
                    if (node.nodeType === 3) node.textContent = 'Activar';
                });
                card.classList.add('disabled');
                guardarDatosAhora().catch(() => {});
            } else if (val > 0 && isDisabled) {
                icon.dataset.checked = 'true';
                icon.style.color = '#10b981';
                card.querySelector('[onclick="toggleCuentaCheck(this)"]')?.childNodes.forEach(node => {
                    if (node.nodeType === 3) node.textContent = 'Desactivar';
                });
                card.classList.remove('disabled');
                guardarDatosAhora().catch(() => {});
            }
        }
        function mostrarModalTipoIngreso() {
            document.getElementById('modalTipoIngreso').style.display = 'flex';
        }

        function cerrarModalTipoIngreso() {
            document.getElementById('modalTipoIngreso').style.display = 'none';
        }

        function addIngresoNomina() {
            addIngreso('Nueva Nómina', 0);
        }

        function addIngresoSimple(nombre = 'Nuevo Ingreso', cantidad = 0, frecuencia = 'mensual', icono = 'euro', colorIcono = '#10b981', iconoImagen = '') {
            const container = document.getElementById('listaIngresos');
            if (typeof _undoPushInmediato === 'function' && !_cargando) _undoPushInmediato();
            const div = document.createElement('div');
            div.className = "card-input-group animate-in slide-in-from-top-4 duration-500";
            div.dataset.tipo = "simple";
            div.dataset.frecuencia = frecuencia;
            if (iconoImagen) {
                div.dataset.iconoImagen = iconoImagen;
                div.dataset.icono = '';
            } else {
                div.dataset.icono = icono;
                div.dataset.colorIcono = colorIcono;
                div.dataset.iconoImagen = '';
            }
            
            const simbolo = obtenerSimboloFrecuencia(frecuencia);
            const iconoHTML = iconoImagen 
                ? `<img src="${iconoImagen}" class="w-full h-full object-cover rounded-xl">`
                : `<span class="material-symbols-rounded" style="color:${colorIcono}" data-longpress-icon>${icono}</span>`;
            
            div.innerHTML = `
                <div class="space-y-3">
                    <div class="flex items-center gap-3">
                        <div class="drag-handle cursor-grab p-2 -ml-2 text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0">
                            <span class="material-symbols-rounded">drag_indicator</span>
                        </div>
                        <div class="icon-container w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 cursor-pointer hover:bg-blue-500/20 transition-all flex-shrink-0 relative group" data-tipo="${iconoImagen ? 'imagen' : 'icono'}">
                            ${iconoHTML}
                            <div class="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                                <span class="material-symbols-rounded text-white text-xs">edit</span>
                            </div>
                        </div>
                        <input type="text" value="${nombre}" class="font-bold text-white text-sm focus:text-blue-400 transition-colors flex-1 bg-transparent min-w-0">
                        <div class="flex items-center gap-2 flex-shrink-0">
                            <button class="btn-menu-card" onclick="toggleFrecuenciaMenuIngreso(this)">
                                <span class="material-symbols-rounded">schedule</span>
                            </button>
                            <div class="btn-menu-card-wrapper"><button class="btn-menu-card" onclick="toggleCardMenu(this)"><span class="material-symbols-rounded">more_vert</span></button><div class="card-menu-dropdown"><button onclick="archivarCard(this)"><span class="material-symbols-rounded">archive</span>Archivar</button><button class="danger" onclick="eliminarCard(this, calculateIngresos)"><span class="material-symbols-rounded">delete</span>Eliminar</button></div></div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-slate-800/50 rounded-lg ingreso-cantidad-row" style="height:30px;">
                        <input type="text" inputmode="decimal" value="${cantidad ? fmt(cantidad) : '0'}" readonly onclick="_abrirModalCantidad(this)" oninput="fmtMoneyInput(this);updateIngresoSimple(this);calculateIngresos()" class="ingreso-simple-neto font-mono text-white font-bold text-center bg-transparent text-sm" style="width:110px;cursor:pointer;caret-color:transparent;">
                        <span class="frecuencia-simbolo text-white font-bold whitespace-nowrap text-xs ml-1">${simbolo}</span>
                    </div>
                </div>
            `;
            container.appendChild(div);
            guardarDatos();
            calculateIngresos();
            _syncEmptyStates && _syncEmptyStates();
        }

        function cambiarFrecuenciaIngreso(select) {
            const card = select.closest('.card-input-group');
            const frecuencia = select.value;
            const input = card.querySelector('.ingreso-simple-neto');
            const label = card.querySelector('.frecuencia-label');
            const simbolo = card.querySelector('.frecuencia-simbolo');
            const conversion = card.querySelector('.conversion-text');
            const valorActual = parseMoneyInput(input.value);
            
            card.dataset.frecuencia = frecuencia;
            
            if (frecuencia === 'mensual') {
                label.textContent = 'Cantidad Mensual';
                simbolo.textContent = '€/mes';
                conversion.textContent = fmt(valorActual * 12) + ' €/año';
            } else {
                label.textContent = 'Cantidad Anual';
                simbolo.textContent = '€/año';
                conversion.textContent = fmt(valorActual / 12) + ' €/mes';
            }
            
            calculateIngresos();
            guardarDatos();
        }

        function updateIngresoSimple(input) {
            const card = input.closest('.card-input-group');
            const cantidad = parseMoneyInput(input.value);
            const frecuencia = card.dataset.frecuencia || 'mensual';
            const conversion = card.querySelector('.conversion-text');
            
            if (frecuencia === 'mensual') {
                conversion.textContent = fmt(cantidad * 12) + ' €/año';
            } else {
                conversion.textContent = fmt(cantidad / 12) + ' €/mes';
            }
            
            calculateIngresos();
            guardarDatos();
        }

        function addIngreso(label = 'Nuevo Ingreso', brutoMes = 0, logoSrc = '', pdfBase64 = '', netoMesOverride = 0, _iconoImagen = '', _icono = '', _colorIcono = '') {
            const container = document.getElementById('listaIngresos');
            if (typeof _undoPushInmediato === 'function' && !_cargando) _undoPushInmediato();
            const div = document.createElement('div');
            div.className = "card-input-group animate-in slide-in-from-top-4 duration-500";
            div.dataset.tipo = "nomina";
            const netoMes = netoMesOverride > 0 ? netoMesOverride : calcularNetoMensual(brutoMes);
            const uniqueId = 'nomina_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            div.innerHTML = `
                <div class="space-y-4">
                    <div class="flex items-center gap-4">
                        <!-- Drag handle -->
                        <div class="drag-handle cursor-grab p-2 -ml-2 text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0">
                            <span class="material-symbols-rounded">drag_indicator</span>
                        </div>
                        <div class="icon-container w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 cursor-pointer hover:bg-emerald-500/20 transition-all flex-shrink-0 relative group" data-tipo="icono">
                            <span class="material-symbols-rounded" data-longpress-icon>euro</span>
                            <div class="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                                <span class="material-symbols-rounded text-white text-xs">edit</span>
                            </div>
                        </div>
                        <input type="text" value="${label}" class="font-bold text-white text-sm focus:text-emerald-400 transition-colors flex-1 bg-transparent min-w-0">
                        <button onclick="toggleDesglose(this)" class="p-2 text-slate-500 hover:text-emerald-400 rounded-lg transition-all flex-shrink-0" title="Ver desglose de nómina">
                            <span class="material-symbols-rounded">expand_more</span>
                        </button>
                        <div class="btn-menu-card-wrapper"><button class="btn-menu-card" onclick="toggleCardMenu(this)"><span class="material-symbols-rounded">more_vert</span></button><div class="card-menu-dropdown"><button onclick="archivarCard(this)"><span class="material-symbols-rounded">archive</span>Archivar</button><button class="danger" onclick="eliminarCard(this, calculateIngresos)"><span class="material-symbols-rounded">delete</span>Eliminar</button></div></div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="text-[9px] text-slate-600 font-bold uppercase tracking-widest block mb-1">Bruto Mensual</label>
                            <div class="flex items-center justify-center bg-slate-800/50 rounded-lg" style="height:30px;">
                                <input type="text" inputmode="decimal" value="${fmt(brutoMes)}" oninput="fmtMoneyInput(this);updateNetoFromBrutoMes(this);calculateIngresos()" class="ingreso-bruto-mes font-mono text-emerald-400 font-bold text-center bg-transparent text-sm" style="width:80px;">
                                <span class="text-emerald-400 font-bold text-xs whitespace-nowrap ml-1">€</span>
                            </div>
                        </div>
                        <div>
                            <label class="text-[9px] text-slate-600 font-bold uppercase tracking-widest block mb-1">Neto Mensual</label>
                            <div class="flex items-center justify-center bg-slate-800/50 rounded-lg" style="height:30px;">
                                <input type="text" inputmode="decimal" value="${fmt(netoMes)}" readonly onclick="_abrirModalCantidad(this)" oninput="fmtMoneyInput(this);updateBrutoFromNetoMes(this);calculateIngresos()" class="ingreso-neto-mes font-mono text-white font-bold text-center bg-transparent text-sm" style="width:80px;cursor:pointer;caret-color:transparent;">
                                <span class="text-white font-bold text-xs whitespace-nowrap ml-1">€</span>
                            </div>
                        </div>
                    </div>

                    <!-- DESGLOSE DESPLEGABLE -->
                    <div class="desglose-nomina" style="display: none;">
                        <div class="bg-slate-900/50 p-3 rounded-xl border border-slate-700 flex flex-col gap-2">
                            <!-- Lista de PDFs subidos -->
                            <div class="pdf-lista flex flex-col gap-1"></div>
                            <!-- Botón añadir PDF -->
                            <label class="pdf-btn-add cursor-pointer px-4 py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 transition-all" style="background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);border:1px solid #334155;color:#94a3b8;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94a3b8'">
                                <span class="material-symbols-rounded" style="font-size:16px;">upload_file</span>
                                <span class="hidden sm:inline">Añadir PDF de Nómina</span>
                                <input type="file" accept="application/pdf" multiple onchange="uploadNominaPDF(this)" style="display:none;">
                            </label>
                        </div>
                    </div>
                </div>
            `;
            if (_iconoImagen || _icono || _colorIcono) {
                const iconContainer = div.querySelector('.icon-container');
                if (iconContainer) {
                    if (_iconoImagen) {
                        iconContainer.innerHTML = `
                            <img src="${_iconoImagen}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 0.75rem;">
                            <div class="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                                <span class="material-symbols-rounded text-white text-xs">edit</span>
                            </div>
                        `;
                        iconContainer.dataset.tipo = 'imagen';
                        div.dataset.iconoImagen = _iconoImagen;
                    } else if (_icono) {
                        const iconEl = iconContainer.querySelector('.material-symbols-rounded');
                        if (iconEl) {
                            iconEl.textContent = _icono;
                            if (_colorIcono) iconEl.style.color = _colorIcono;
                        }
                        div.dataset.icono = _icono;
                        if (_colorIcono) div.dataset.colorIcono = _colorIcono;
                    }
                }
            }
            container.appendChild(div);
            guardarDatos();
            calculateIngresos();
            _syncEmptyStates && _syncEmptyStates();
        }

        function uploadLogo(input) {
            const file = input.files[0];
            if (file && file.type === 'image/png') {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const logoContainer = input.closest('.logo-container');
                    const defaultIcon = logoContainer.querySelector('.default-icon');
                    const logoImg = logoContainer.querySelector('.empresa-logo');
                    
                    logoImg.src = e.target.result;
                    logoImg.style.display = 'block';
                    defaultIcon.style.display = 'none';
                };
                reader.readAsDataURL(file);
            } else {
            }
        }

        function _pdfBtn(style) {
            return 'cursor-pointer rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all flex-shrink-0 px-2 py-1.5 sm:px-3 sm:py-2';
        }
        function _pdfBtnStyle(hover) {
            return 'background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);border:1px solid #334155;color:#94a3b8;';
        }
        function _renderPdfRow(lista, nombre, data) {
            const row = document.createElement('div');
            row.className = 'flex items-center gap-2 pdf-item';
            row.dataset.pdfData = data;
            const btnCls = _pdfBtn();
            const btnSty = _pdfBtnStyle();
            row.innerHTML =
                '<span class="material-symbols-rounded text-rose-500" style="font-size:16px;flex-shrink:0;">picture_as_pdf</span>' +
                '<span class="text-xs text-slate-400 truncate flex-1" style="max-width:120px;" title="' + nombre + '">' + nombre + '</span>' +
                '<button onclick="viewPDFItem(this)" class="' + btnCls + '" style="' + btnSty + '" onmouseover="this.style.color=\'white\'" onmouseout="this.style.color=\'#94a3b8\'" title="Ver PDF">' +
                    '<span class="material-symbols-rounded" style="font-size:14px;">visibility</span>' +
                    '<span class="hidden sm:inline">Ver</span>' +
                '</button>' +
                '<button onclick="downloadPDFItem(this)" class="' + btnCls + '" style="' + btnSty + '" onmouseover="this.style.color=\'#60a5fa\'" onmouseout="this.style.color=\'#94a3b8\'" title="Descargar PDF">' +
                    '<span class="material-symbols-rounded" style="font-size:14px;">download</span>' +
                    '<span class="hidden sm:inline">Bajar</span>' +
                '</button>' +
                '<button onclick="deletePDFItem(this)" class="' + btnCls + '" style="' + btnSty + '" onmouseover="this.style.color=\'#f87171\'" onmouseout="this.style.color=\'#94a3b8\'" title="Eliminar">' +
                    '<span class="material-symbols-rounded" style="font-size:14px;">delete</span>' +
                    '<span class="hidden sm:inline">Eliminar</span>' +
                '</button>';
            lista.appendChild(row);
        }
        function _esFuentePdfRemota(pdfSource) {
            return /^https?:\/\//i.test(String(pdfSource || ''));
        }
        function _obtenerFuentePdfDesdeRegistro(pdfItem) {
            if (!pdfItem || typeof pdfItem !== 'object') return '';
            return pdfItem.url || pdfItem.data || pdfItem.pdfUrl || pdfItem.pdfData || '';
        }
        function _crearRegistroPdfDesdeFila(row, defaultName) {
            const nombre = row.querySelector('span.truncate')?.textContent || defaultName || 'documento.pdf';
            const source = row.dataset.pdfData || '';
            return {
                nombre: nombre,
                data: source,
                url: _esFuentePdfRemota(source) ? source : ''
            };
        }
        function _esArchivoPdfValido(file) {
                if (!file) return false;
                const nombre = String(file.name || '').toLowerCase();
                const tipo = String(file.type || '').toLowerCase();
                return tipo === 'application/pdf' || /\.pdf$/i.test(nombre);
            }
        function _leerArchivoComoDataUrl(file) {
            return new Promise(function(resolve, reject) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    resolve(event.target.result);
                };
                reader.onerror = function() {
                    reject(new Error('No pude leer el PDF seleccionado.'));
                };
                reader.readAsDataURL(file);
            });
        }
        async function _obtenerFuentePdfSubida(file) {
            try {
                return await subirPdfACloudinary(file);
            } catch (error) {
                return _leerArchivoComoDataUrl(file);
            }
        }
        function _descargarDataUrlComoArchivo(dataUrl, fileName) {
                if (!dataUrl) return;
                try {
                    const match = String(dataUrl).match(/^data:([^;]+)?(;base64)?,(.*)$/);
                    if (!match) throw new Error('data-url-invalido');
                    const mime = match[1] || 'application/pdf';
                    const payload = match[3] || '';
                    let blob;
                    if (match[2]) {
                        const binary = atob(payload);
                        const bytes = new Uint8Array(binary.length);
                        for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
                        blob = new Blob([bytes], { type: mime });
                    } else {
                        blob = new Blob([decodeURIComponent(payload)], { type: mime });
                    }
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName || 'documento.pdf';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    setTimeout(function() { URL.revokeObjectURL(url); }, 1500);
                } catch (error) {
                    const a = document.createElement('a');
                    a.href = dataUrl;
                    a.download = fileName || 'documento.pdf';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }
            }
        async function _descargarPdfComoArchivo(pdfSource, fileName) {
            if (!pdfSource) return;
            if (!_esFuentePdfRemota(pdfSource)) {
                _descargarDataUrlComoArchivo(pdfSource, fileName);
                return;
            }
            try {
                const res = await fetch(pdfSource, { mode: 'cors' });
                if (!res.ok) throw new Error('No pude descargar el PDF remoto.');
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName || 'documento.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(function() { URL.revokeObjectURL(url); }, 1500);
            } catch (error) {
                const a = document.createElement('a');
                a.href = pdfSource;
                a.target = '_blank';
                a.rel = 'noopener';
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        }
        async function uploadNominaPDF(input) {
                const files = Array.from(input.files).filter(f => _esArchivoPdfValido(f) && f.size <= 5*1024*1024);
            if (!files.length) { input.value = ''; return; }
            const lista = input.closest('.desglose-nomina').querySelector('.pdf-lista');
            for (const file of files) {
                const pdfSource = await _obtenerFuentePdfSubida(file);
                _renderPdfRow(lista, file.name, pdfSource);
            }
            guardarDatos();
            input.value = '';
        }

        function downloadPDFItem(button) {
            const item = button.closest('.pdf-item');
            const data = item.dataset.pdfData;
            const nombre = item.querySelector('span.truncate')?.textContent || 'nomina.pdf';
            if (data) _descargarPdfComoArchivo(data, nombre);
        }
        function deletePDFItem(button) {
            button.closest('.pdf-item').remove();
            guardarDatos();
        }
        function deletePDF(button) { deletePDFItem(button); }

        const _pdfViewerState = {
            scriptPromise: null,
            renderToken: 0,
            lastDataUrl: '',
            lastSource: '',
            lastFileName: ''
        };

        function _ensurePdfViewerModal() {
            let overlay = document.getElementById('pdfViewerModal');
            if (overlay) return overlay;

            overlay = document.createElement('div');
            overlay.id = 'pdfViewerModal';
            overlay.style.cssText = 'display:none;position:fixed;inset:0;z-index:999999;background:rgba(2,6,23,0.82);padding:18px;align-items:center;justify-content:center;';
            overlay.innerHTML = ''
                + '<div id="pdfViewerPanel" style="width:min(1100px,100%);height:min(92vh,100%);background:#0f172a;border:1px solid rgba(148,163,184,0.2);border-radius:22px;box-shadow:0 24px 80px rgba(0,0,0,0.55);display:flex;flex-direction:column;overflow:hidden;">'
                + '  <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid rgba(148,163,184,0.12);background:rgba(15,23,42,0.96);">'
                + '    <div style="min-width:0;display:flex;align-items:center;gap:10px;">'
                + '      <span class="material-symbols-rounded" style="font-size:20px;color:#f87171;flex-shrink:0;">picture_as_pdf</span>'
                + '      <div style="min-width:0;">'
                + '        <div id="pdfViewerTitle" style="color:#f8fafc;font-size:14px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Documento PDF</div>'
                + '        <div id="pdfViewerSubtitle" style="color:#64748b;font-size:11px;margin-top:2px;">Visor dentro de la app</div>'
                + '      </div>'
                + '    </div>'
                + '    <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">'
                + '      <button id="pdfViewerDownloadBtn" style="padding:8px 12px;border-radius:10px;border:1px solid rgba(96,165,250,0.28);background:rgba(59,130,246,0.12);color:#bfdbfe;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;">'
                + '        <span class="material-symbols-rounded" style="font-size:16px;">download</span>Guardar'
                + '      </button>'
                + '      <button id="pdfViewerCloseBtn" style="width:36px;height:36px;border-radius:10px;border:1px solid rgba(148,163,184,0.18);background:rgba(15,23,42,0.7);color:#cbd5e1;cursor:pointer;display:flex;align-items:center;justify-content:center;">'
                + '        <span class="material-symbols-rounded" style="font-size:18px;">close</span>'
                + '      </button>'
                + '    </div>'
                + '  </div>'
                + '  <div id="pdfViewerBody" style="flex:1;overflow:auto;background:linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98));padding:18px;">'
                + '    <div id="pdfViewerContent" style="display:flex;flex-direction:column;align-items:center;gap:16px;min-height:100%;"></div>'
                + '  </div>'
                + '</div>';

            overlay.addEventListener('click', function (event) {
                if (event.target === overlay) {
                    cerrarPdfViewerModal();
                }
            });

            document.body.appendChild(overlay);

            var closeBtn = document.getElementById('pdfViewerCloseBtn');
            if (closeBtn) closeBtn.addEventListener('click', cerrarPdfViewerModal);

            var downloadBtn = document.getElementById('pdfViewerDownloadBtn');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', function () {
                    if (!_pdfViewerState.lastSource) return;
                    _descargarPdfComoArchivo(_pdfViewerState.lastSource, _pdfViewerState.lastFileName || 'documento.pdf');
                });
            }

            return overlay;
        }

        function _dataUrlToUint8Array(dataUrl) {
            const parts = String(dataUrl || '').split(',');
            const base64 = parts.length > 1 ? parts[1] : '';
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let index = 0; index < binary.length; index += 1) {
                bytes[index] = binary.charCodeAt(index);
            }
            return bytes;
        }

        async function _obtenerPdfUint8Array(pdfSource) {
            if (!pdfSource) throw new Error('PDF no disponible.');
            if (!_esFuentePdfRemota(pdfSource)) return _dataUrlToUint8Array(pdfSource);
            const response = await fetch(pdfSource, { mode: 'cors', cache: 'no-store' });
            if (!response.ok) throw new Error('No pude descargar el PDF desde Cloudinary.');
            const buffer = await response.arrayBuffer();
            return new Uint8Array(buffer);
        }

        function _crearCanvasPaginaPdf(pageWrapper) {
            let canvas = pageWrapper.querySelector('canvas');
            if (canvas) return canvas;
            canvas = document.createElement('canvas');
            canvas.style.cssText = 'display:block;width:100%;height:auto;border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,0.45);background:white;cursor:zoom-in;transform-origin:center top;transition:box-shadow .18s ease, transform .18s ease;';
            pageWrapper.appendChild(canvas);
            return canvas;
        }

        async function _renderPdfPageWithZoom(page, pageWrapper, bodyWidth, zoomLevel) {
            const safeBodyWidth = Math.max(280, bodyWidth || 280);
            const baseViewport = page.getViewport({ scale: 1 });
            const fitScale = Math.min(2.4, safeBodyWidth / baseViewport.width);
            const displayScale = fitScale * zoomLevel;
            const deviceScale = Math.min(window.devicePixelRatio || 1, 3);
            const renderScale = displayScale * deviceScale;
            const renderViewport = page.getViewport({ scale: renderScale });
            const displayViewport = page.getViewport({ scale: displayScale });
            const canvas = _crearCanvasPaginaPdf(pageWrapper);
            const context = canvas.getContext('2d', { alpha: false });

            canvas.width = Math.ceil(renderViewport.width);
            canvas.height = Math.ceil(renderViewport.height);
            canvas.style.maxWidth = Math.ceil(displayViewport.width) + 'px';

            await page.render({ canvasContext: context, viewport: renderViewport }).promise;
            canvas.dataset.zoomLevel = String(zoomLevel);
            canvas.style.cursor = zoomLevel > 1 ? 'zoom-out' : 'zoom-in';
            canvas.style.transform = 'scale(1)';
        }

        function _clampPdfZoomLevel(level) {
            return Math.max(1, Math.min(3, Number(level) || 1));
        }

        function _pdfTouchDistance(touchA, touchB) {
            const dx = touchA.clientX - touchB.clientX;
            const dy = touchA.clientY - touchB.clientY;
            return Math.hypot(dx, dy);
        }

        function _previewPdfPinchZoom(pageWrapper, zoomLevel) {
            const canvas = pageWrapper.querySelector('canvas');
            if (!canvas) return;
            const renderedZoom = parseFloat(canvas.dataset.zoomLevel || '1');
            const previewZoom = _clampPdfZoomLevel(zoomLevel);
            const scaleFactor = previewZoom / renderedZoom;
            canvas.style.transform = 'scale(' + scaleFactor + ')';
            canvas.style.boxShadow = scaleFactor > 1 ? '0 22px 62px rgba(0,0,0,0.55)' : '0 16px 48px rgba(0,0,0,0.45)';
        }

        function _bindPdfPageZoomGestures(pageWrapper, page, targetWidth, totalPages, subtitle, currentToken) {
            if (pageWrapper.dataset.zoomBound === '1') return;
            pageWrapper.dataset.zoomBound = '1';

            let pinchStartDistance = 0;
            let pinchStartZoom = 1;
            let pinchPreviewZoom = 1;
            let pinchMoved = false;

            const setSubtitle = function(text) {
                if (subtitle) subtitle.textContent = text;
            };

            const commitPinchZoom = async function() {
                if (pageWrapper.dataset.pinchActive !== '1') return;
                delete pageWrapper.dataset.pinchActive;
                const finalZoom = _clampPdfZoomLevel(pinchMoved ? pinchPreviewZoom : pinchStartZoom);
                const canvas = pageWrapper.querySelector('canvas');
                if (canvas) canvas.style.transform = 'scale(1)';
                if (currentToken !== _pdfViewerState.renderToken) return;
                await _renderPdfPageWithZoom(page, pageWrapper, targetWidth, finalZoom);
                setSubtitle(totalPages + ' página' + (totalPages === 1 ? '' : 's') + ' · toca o pellizca para ampliar');
                setTimeout(function() {
                    delete pageWrapper.dataset.blockClick;
                }, 180);
            };

            pageWrapper.addEventListener('touchstart', function(event) {
                if (event.touches.length !== 2) return;
                const [touchA, touchB] = event.touches;
                pinchStartDistance = _pdfTouchDistance(touchA, touchB);
                const canvas = pageWrapper.querySelector('canvas');
                pinchStartZoom = parseFloat(canvas?.dataset.zoomLevel || '1');
                pinchPreviewZoom = pinchStartZoom;
                pinchMoved = false;
                pageWrapper.dataset.pinchActive = '1';
                pageWrapper.dataset.blockClick = '1';
            }, { passive: true });

            pageWrapper.addEventListener('touchmove', function(event) {
                if (pageWrapper.dataset.pinchActive !== '1' || event.touches.length !== 2) return;
                const [touchA, touchB] = event.touches;
                const nextDistance = _pdfTouchDistance(touchA, touchB);
                if (!pinchStartDistance) return;
                pinchPreviewZoom = _clampPdfZoomLevel(pinchStartZoom * (nextDistance / pinchStartDistance));
                pinchMoved = pinchMoved || Math.abs(pinchPreviewZoom - pinchStartZoom) > 0.05;
                _previewPdfPinchZoom(pageWrapper, pinchPreviewZoom);
                setSubtitle(totalPages + ' página' + (totalPages === 1 ? '' : 's') + ' · zoom ' + pinchPreviewZoom.toFixed(2) + 'x');
                event.preventDefault();
            }, { passive: false });

            pageWrapper.addEventListener('touchend', function(event) {
                if (pageWrapper.dataset.pinchActive === '1' && event.touches.length < 2) {
                    commitPinchZoom();
                }
            }, { passive: true });

            pageWrapper.addEventListener('touchcancel', function() {
                if (pageWrapper.dataset.pinchActive === '1') commitPinchZoom();
            }, { passive: true });
        }

        async function _ensurePdfJsLoaded() {
            if (window.pdfjsLib) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                return window.pdfjsLib;
            }
            if (_pdfViewerState.scriptPromise) return _pdfViewerState.scriptPromise;

            _pdfViewerState.scriptPromise = new Promise(function (resolve, reject) {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
                script.async = true;
                script.onload = function () {
                    if (!window.pdfjsLib) {
                        reject(new Error('PDF.js no ha quedado disponible.'));
                        return;
                    }
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                    resolve(window.pdfjsLib);
                };
                script.onerror = function () {
                    reject(new Error('No pude cargar el visor PDF dentro de la app.'));
                };
                document.head.appendChild(script);
            });

            return _pdfViewerState.scriptPromise;
        }

        function cerrarPdfViewerModal() {
            const overlay = document.getElementById('pdfViewerModal');
            const content = document.getElementById('pdfViewerContent');
            if (content) content.innerHTML = '';
            if (overlay) overlay.style.display = 'none';
            document.body.style.overflow = '';
            _pdfViewerState.renderToken += 1;
        }

        async function abrirPdfViewerModal(dataUrl, fileName) {
            if (!dataUrl) return;

            const overlay = _ensurePdfViewerModal();
            const content = document.getElementById('pdfViewerContent');
            const title = document.getElementById('pdfViewerTitle');
            const subtitle = document.getElementById('pdfViewerSubtitle');
            const body = document.getElementById('pdfViewerBody');
            if (!overlay || !content || !body) return;

            _pdfViewerState.lastDataUrl = dataUrl;
            _pdfViewerState.lastSource = dataUrl;
            _pdfViewerState.lastFileName = fileName || 'documento.pdf';
            const currentToken = ++_pdfViewerState.renderToken;

            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            body.scrollTop = 0;
            if (title) title.textContent = _pdfViewerState.lastFileName;
            if (subtitle) subtitle.textContent = 'Cargando PDF...';
            content.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;min-height:240px;color:#94a3b8;">'
                + '<span class="material-symbols-rounded" style="font-size:34px;color:#60a5fa;animation:cloudSyncSpin 1.1s linear infinite;">progress_activity</span>'
                + '<span style="font-size:13px;font-weight:700;">Preparando visor PDF</span>'
                + '</div>';

            try {
                const pdfjsLib = await _ensurePdfJsLoaded();
                if (currentToken !== _pdfViewerState.renderToken) return;

                const pdfData = await _obtenerPdfUint8Array(dataUrl);
                const loadingTask = pdfjsLib.getDocument({ data: pdfData });
                const pdf = await loadingTask.promise;
                if (currentToken !== _pdfViewerState.renderToken) return;

                content.innerHTML = '';
                if (subtitle) subtitle.textContent = pdf.numPages + ' página' + (pdf.numPages === 1 ? '' : 's') + ' · toca o pellizca para ampliar';

                const targetWidth = Math.max(280, Math.min(body.clientWidth - 48, 920));

                for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
                    const page = await pdf.getPage(pageNumber);
                    if (currentToken !== _pdfViewerState.renderToken) return;

                    const wrapper = document.createElement('div');
                    wrapper.style.cssText = 'width:100%;display:flex;flex-direction:column;align-items:center;gap:8px;';

                    const label = document.createElement('div');
                    label.textContent = 'Página ' + pageNumber;
                    label.style.cssText = 'color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;';

                    const pageWrapper = document.createElement('div');
                    pageWrapper.style.cssText = 'width:100%;display:flex;justify-content:center;position:relative;';

                    wrapper.appendChild(label);
                    wrapper.appendChild(pageWrapper);
                    content.appendChild(wrapper);

                    await _renderPdfPageWithZoom(page, pageWrapper, targetWidth, 1);
                    _bindPdfPageZoomGestures(pageWrapper, page, targetWidth, pdf.numPages, subtitle, currentToken);

                    pageWrapper.addEventListener('click', async function () {
                        if (pageWrapper.dataset.blockClick === '1') return;
                        if (currentToken !== _pdfViewerState.renderToken) return;
                        const canvas = pageWrapper.querySelector('canvas');
                        if (!canvas || canvas.dataset.rendering === 'true') return;
                        const currentZoom = parseFloat(canvas.dataset.zoomLevel || '1');
                        const nextZoom = currentZoom >= 2 ? 1 : 2;
                        canvas.dataset.rendering = 'true';
                        try {
                            await _renderPdfPageWithZoom(page, pageWrapper, targetWidth, nextZoom);
                            if (subtitle) subtitle.textContent = pdf.numPages + ' página' + (pdf.numPages === 1 ? '' : 's') + ' · zoom ' + nextZoom.toFixed(0) + 'x';
                        } finally {
                            const updatedCanvas = pageWrapper.querySelector('canvas');
                            if (updatedCanvas) delete updatedCanvas.dataset.rendering;
                        }
                    });
                }
            } catch (error) {
                if (currentToken !== _pdfViewerState.renderToken) return;
                if (subtitle) subtitle.textContent = 'No pude renderizar el PDF dentro de la app';
                content.innerHTML = '<div style="width:min(820px,100%);margin:0 auto;display:flex;flex-direction:column;gap:14px;align-items:center;justify-content:center;min-height:240px;padding:18px;border:1px solid rgba(248,113,113,0.2);border-radius:18px;background:rgba(127,29,29,0.12);color:#fecaca;text-align:center;">'
                    + '<span class="material-symbols-rounded" style="font-size:34px;color:#fca5a5;">error</span>'
                    + '<div style="font-size:14px;font-weight:800;">No pude abrir el PDF en el visor interno</div>'
                    + '<div style="font-size:12px;line-height:1.5;color:#fca5a5;max-width:560px;">' + ((error && error.message) ? error.message : 'Error desconocido') + '</div>'
                    + '<iframe src="' + dataUrl + '" style="width:100%;min-height:70vh;border:none;border-radius:14px;background:white;"></iframe>'
                    + '</div>';
            }
        }

        function viewPDFItem(button) {
            const data = button.closest('.pdf-item').dataset.pdfData;
            const nombre = button.closest('.pdf-item').querySelector('span.truncate')?.textContent || 'nomina.pdf';
            if (data) abrirPdfViewerModal(data, nombre);
        }
        function viewPDF(button) { viewPDFItem(button); }
        function togglePanelDocsBancos() {
            const panel = document.getElementById('panel-docs-bancos');
            if (!panel) return;
            const isOpen = panel.style.display !== 'none';
            panel.style.display = isOpen ? 'none' : 'block';
        }

        async function uploadDocBanco(input) {
            const files = Array.from(input.files).filter(f => _esArchivoPdfValido(f) && f.size <= 10*1024*1024);
            if (!files.length) { input.value = ''; return; }
            const lista = document.querySelector('.pdf-lista-bancos');
            if (!lista) { input.value = ''; return; }
            for (const file of files) {
                const pdfSource = await _obtenerFuentePdfSubida(file);
                _renderPdfRow(lista, file.name, pdfSource);
            }
            guardarDatos();
            input.value = '';
        }

        function toggleDesglose(button) {
            const card = button.closest('.card-input-group');
            const desglose = card.querySelector('.desglose-nomina');
            const icon = button.querySelector('.material-symbols-rounded');
            
            if (desglose.style.display === 'none') {
                desglose.style.display = 'block';
                icon.textContent = 'expand_less';
                button.classList.add('text-emerald-400');
            } else {
                desglose.style.display = 'none';
                icon.textContent = 'expand_more';
                button.classList.remove('text-emerald-400');
            }
        }

        function calcularNetoMensual(brutoMes) {
            brutoMes = parseFloat(brutoMes) || 0;
            const r2 = x => Math.round(x * 100) / 100;
            const cotizacionCC    = r2(brutoMes * 0.0470);  // 4,70% Contingencias Comunes
            const cotizacionMEI   = r2(brutoMes * 0.0015);  // 0,15% MEI
            const cotizacionForm  = r2(brutoMes * 0.0010);  // 0,10% Formación
            const cotizacionDesemp= r2(brutoMes * 0.0155);  // 1,55% Desempleo
            const irpf            = r2(brutoMes * 0.1334);  // 13,34% IRPF
            const totalDeducciones = cotizacionCC + cotizacionMEI + cotizacionForm + cotizacionDesemp + irpf;
            return r2(brutoMes - totalDeducciones);
        }

        function calcularBrutoMensual(netoMes) {
            netoMes = (typeof netoMes === 'number') ? netoMes : (parseMoneyInput(String(netoMes)) || 0);
            if (!netoMes) return 0;
            let bruto = netoMes / 0.8016;
            for (let i = 0; i < 15; i++) {
                const netoCalc = calcularNetoMensual(bruto);
                const diff = netoMes - netoCalc;
                if (Math.abs(diff) < 0.001) break;
                bruto += diff / 0.8016;
            }
            return Math.round(bruto * 100) / 100;
        }

        function updateNetoFromBrutoMes(input) {
            const raw = input.value.replace(/,$/, '').replace(/,(\d*)$/, '.$1');
            const brutoMes = parseMoneyInput(raw) || parseMoneyInput(input.value);
            const netoMes = calcularNetoMensual(brutoMes);
            const card = input.closest('.card-input-group');
            
            card.querySelector('.ingreso-neto-mes').value = brutoMes > 0 ? fmt(netoMes) : '';
            card.querySelector('.ingreso-bruto-anual').innerText = fmt(brutoMes * 12);
            card.querySelector('.ingreso-neto-anual').innerText = fmt(netoMes * 12);
            
            calculateIngresos();
            guardarDatos();
        }

        function updateBrutoFromNetoMes(input) {
            const raw = input.value.replace(/,$/, '').replace(/,(\d*)$/, '.$1');
            const netoMes = parseMoneyInput(raw) || parseMoneyInput(input.value);
            const brutoMes = calcularBrutoMensual(netoMes);
            const card = input.closest('.card-input-group');
            
            card.querySelector('.ingreso-bruto-mes').value = netoMes > 0 ? fmt(brutoMes) : '';
            card.querySelector('.ingreso-bruto-anual').innerText = fmt(brutoMes * 12);
            card.querySelector('.ingreso-neto-anual').innerText = fmt(netoMes * 12);
            
            calculateIngresos();
            guardarDatos();
        }

        function calculateIngresos() {
            let totalNetoNominas = 0;
            let totalBrutoNominas = 0;
            let totalIngresosMes = 0; // Para el balance (todos los ingresos)
            document.querySelectorAll('#listaIngresos .card-input-group[data-tipo="nomina"]').forEach(card => {
                const neto = parseMoneyInput(card.querySelector('.ingreso-neto-mes').value);
                const bruto = parseMoneyInput(card.querySelector('.ingreso-bruto-mes').value);
                totalNetoNominas += neto;
                totalBrutoNominas += bruto;
            });
            document.querySelectorAll('#listaIngresos .card-input-group').forEach(card => {
                if (card.dataset.tipo === 'nomina') {
                    const neto = parseMoneyInput(card.querySelector('.ingreso-neto-mes').value);
                    totalIngresosMes += neto;
                } else if (card.dataset.tipo === 'simple') {
                    const cantidad = parseMoneyInput(card.querySelector('.ingreso-simple-neto').value);
                    const frecuencia = card.dataset.frecuencia || 'mensual';
                    const divisores = { 'mensual': 1, 'bimestral': 2, 'trimestral': 3, 'cuatrimestral': 4, 'semestral': 6, 'anual': 12 };
                    totalIngresosMes += cantidad / (divisores[frecuencia] || 1);
                }
            });
            
            const totalNetoNominasAnual = totalNetoNominas * 12;
            const totalBrutoNominasAnual = totalBrutoNominas * 12;
            const totalIngresosAnual = totalIngresosMes * 12;
            document.getElementById('totalBrutoMes').innerText = fmt(totalBrutoNominas);
            document.getElementById('totalBrutoAnual').innerText = fmt(totalBrutoNominasAnual);
            document.getElementById('totalNetoNominasMes').innerText = fmt(totalNetoNominas);
            document.getElementById('totalNetoNominasAnual').innerText = fmt(totalNetoNominasAnual);
            window.totalIngresosMes = totalIngresosMes;
            window.totalIngresosAnual = totalIngresosAnual;
            const esfuerzoTexto = document.getElementById('esfuerzoNominaTexto');
            if (esfuerzoTexto) {
                esfuerzoTexto.innerText = fmt(totalIngresosMes);
            }
            
            calculateBalance();
            calculate(); // Actualizar esfuerzo cuando cambian ingresos
        }
        function addGasto(label = 'Nuevo Gasto', cantidad = 0, frecuencia = 'mensual', icono = 'euro', colorIcono = '#ef4444', iconoImagen = '') {
            const container = document.getElementById('listaGastos');
            if (typeof _undoPushInmediato === 'function' && !_cargando) _undoPushInmediato();
            const div = document.createElement('div');
            div.className = "card-input-group animate-in slide-in-from-top-4 duration-500";
            div.dataset.frecuencia = frecuencia;
            if (iconoImagen) {
                div.dataset.iconoImagen = iconoImagen;
                div.dataset.icono = '';
            } else {
                div.dataset.icono = icono;
                div.dataset.colorIcono = colorIcono;
                div.dataset.iconoImagen = '';
            }
            const iconoHTML = iconoImagen 
                ? `<img src="${iconoImagen}" class="w-full h-full object-cover rounded-xl">`
                : `<span class="material-symbols-rounded" style="color:${colorIcono}" data-longpress-icon>${icono}</span>`;
            
            div.innerHTML = `
                <div class="space-y-3">
                    <div class="flex items-center gap-3">
                        <div class="drag-handle cursor-grab p-2 -ml-2 text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0">
                            <span class="material-symbols-rounded">drag_indicator</span>
                        </div>
                        <div class="icon-container w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 cursor-pointer hover:bg-rose-500/20 transition-all flex-shrink-0 relative group" data-tipo="${iconoImagen ? 'imagen' : 'icono'}">
                            ${iconoHTML}
                            <div class="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                                <span class="material-symbols-rounded text-white text-xs">edit</span>
                            </div>
                        </div>
                        <input type="text" value="${label}" class="font-bold text-white text-sm focus:text-rose-400 transition-colors flex-1 bg-transparent min-w-0">
                        <div class="flex items-center gap-2 flex-shrink-0">
                            <button class="btn-menu-card" onclick="toggleFrecuenciaMenu(this)">
                                <span class="material-symbols-rounded">schedule</span>
                            </button>
                            <div class="btn-menu-card-wrapper"><button class="btn-menu-card" onclick="toggleCardMenu(this)"><span class="material-symbols-rounded">more_vert</span></button></div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-slate-800/50 rounded-lg" style="height:30px;">
                        <input type="text" inputmode="decimal" value="${cantidad ? fmt(cantidad) : ''}" readonly onclick="_abrirModalCantidad(this)" oninput="fmtMoneyInput(this);calculateGastos();guardarDatos();" class="gasto-cantidad font-mono text-rose-400 font-bold text-center bg-transparent text-sm" style="width:80px;cursor:pointer;caret-color:transparent;">
                        <span class="gasto-simbolo text-rose-400 font-bold whitespace-nowrap text-xs ml-1">${obtenerSimboloFrecuencia(frecuencia)}</span>
                    </div>
                </div>
            `;
            container.appendChild(div);
            calculateGastos();
            guardarDatos();
            _syncEmptyStates && _syncEmptyStates();
        }

        function obtenerSimboloFrecuencia(frecuencia) {
            const simbolos = {
                'mensual': '€/mes',
                'bimestral': '€/2m',
                'trimestral': '€/3m',
                'cuatrimestral': '€/4m',
                'semestral': '€/6m',
                'anual': '€/año'
            };
            return simbolos[frecuencia] || '€/mes';
        }

        function cambiarFrecuenciaGasto(select) {
            const card = select.closest('.card-input-group');
            const frecuencia = select.value;
            const simbolo = card.querySelector('.gasto-simbolo');
            
            card.dataset.frecuencia = frecuencia;
            simbolo.textContent = obtenerSimboloFrecuencia(frecuencia);
            
            requestAnimationFrame(() => {
                calculateGastos();
                guardarDatos();
            });
        }

        function toggleFrecuenciaMenu(btn) {
            const existing = document.getElementById('floatingFrecuenciaMenu');
            if (existing) {
                const wasSame = existing._sourceBtn === btn;
                if (existing._scrollHandler) {
                    window.removeEventListener('scroll', existing._scrollHandler, true);
                }
                existing.remove();
                if (wasSame) return;
            }

            const card = btn.closest('.card-input-group');
            const frecuenciaActual = card.dataset.frecuencia || 'mensual';

            const floating = document.createElement('div');
            floating.id = 'floatingFrecuenciaMenu';
            floating._sourceBtn = btn;
            floating.style.cssText = 'position:fixed;background:rgba(15,23,42,0.97);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:6px;min-width:150px;z-index:150;box-shadow:0 10px 40px rgba(0,0,0,0.5);display:flex;flex-direction:column;gap:2px;';

            const opciones = [
                { value: 'mensual', label: 'Mensual' },
                { value: 'bimestral', label: 'Bimestral' },
                { value: 'trimestral', label: 'Trimestral' },
                { value: 'cuatrimestral', label: 'Cuatrimestral' },
                { value: 'semestral', label: 'Semestral' },
                { value: 'anual', label: 'Anual' }
            ];

            opciones.forEach(opcion => {
                const b = document.createElement('button');
                const isActive = opcion.value === frecuenciaActual;
                b.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;font-size:12px;font-family:Plus Jakarta Sans,sans-serif;font-weight:600;color:' + (isActive ? '#60a5fa' : '#94a3b8') + ';background:transparent;border:none;cursor:pointer;width:100%;text-align:left;transition:all 0.15s;';
                b.innerHTML = `<span class="material-symbols-rounded" style="font-size:16px;">${isActive ? 'check_circle' : 'radio_button_unchecked'}</span>${opcion.label}`;
                b.onmouseenter = () => { b.style.background = 'rgba(255,255,255,0.06)'; b.style.color = '#fff'; };
                b.onmouseleave = () => { b.style.background = 'transparent'; b.style.color = isActive ? '#60a5fa' : '#94a3b8'; };
                b.onclick = (e) => {
                    e.stopPropagation();
                    card.dataset.frecuencia = opcion.value;
                    const simbolo = card.querySelector('.gasto-simbolo');
                    simbolo.textContent = obtenerSimboloFrecuencia(opcion.value);
                    floating.remove();
                    calculateGastos();
                    guardarDatos();
                };
                floating.appendChild(b);
            });

            document.body.appendChild(floating);
            function updatePosition() {
                const rect = btn.getBoundingClientRect();
                floating.style.top = (rect.bottom + 6) + 'px';
                let left = rect.right - 150;
                if (left < 8) left = 8;
                floating.style.left = left + 'px';
            }
            updatePosition();
            const scrollHandler = () => updatePosition();
            window.addEventListener('scroll', scrollHandler, true);

            setTimeout(() => {
                document.addEventListener('click', function handler(e) {
                    if (!floating.contains(e.target) && e.target !== btn) {
                        floating.remove();
                        window.removeEventListener('scroll', scrollHandler, true);
                        document.removeEventListener('click', handler);
                    }
                });
            }, 0);
            floating._scrollHandler = scrollHandler;
        }

        function calculateGastos() {
            let totalGastosMes = 0;
            
            document.querySelectorAll('#listaGastos .card-input-group').forEach(card => {
                const input = card.querySelector('.gasto-cantidad');
                const cantidad = parseMoneyInput(input.value);
                const frecuencia = card.dataset.frecuencia || 'mensual';
                const divisores = { 'mensual': 1, 'bimestral': 2, 'trimestral': 3, 'cuatrimestral': 4, 'semestral': 6, 'anual': 12 };
                totalGastosMes += cantidad / (divisores[frecuencia] || 1);
            });
            
            const totalGastosAnual = totalGastosMes * 12;
            
            window._totalGastosMes = totalGastosMes;
            document.getElementById('totalGastosMes').innerText = fmt(totalGastosMes);
            document.getElementById('totalGastosAnual').innerText = fmt(totalGastosAnual);
            
            calculateBalance();
        }

        function toggleFrecuenciaMenuIngreso(btn) {
            const existing = document.getElementById('floatingFrecuenciaMenuIngreso');
            if (existing) {
                const wasSame = existing._sourceBtn === btn;
                if (existing._scrollHandler) window.removeEventListener('scroll', existing._scrollHandler, true);
                existing.remove();
                if (wasSame) return;
            }

            const card = btn.closest('.card-input-group');
            const frecuenciaActual = card.dataset.frecuencia || 'mensual';

            const floating = document.createElement('div');
            floating.id = 'floatingFrecuenciaMenuIngreso';
            floating._sourceBtn = btn;
            floating.style.cssText = 'position:fixed;background:rgba(15,23,42,0.97);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:6px;min-width:150px;z-index:150;box-shadow:0 10px 40px rgba(0,0,0,0.5);display:flex;flex-direction:column;gap:2px;';

            const opciones = [
                { value: 'mensual', label: 'Mensual' },
                { value: 'bimestral', label: 'Bimestral' },
                { value: 'trimestral', label: 'Trimestral' },
                { value: 'cuatrimestral', label: 'Cuatrimestral' },
                { value: 'semestral', label: 'Semestral' },
                { value: 'anual', label: 'Anual' }
            ];

            opciones.forEach(opcion => {
                const b = document.createElement('button');
                const isActive = opcion.value === frecuenciaActual;
                b.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;font-size:12px;font-family:Plus Jakarta Sans,sans-serif;font-weight:600;color:' + (isActive ? '#60a5fa' : '#94a3b8') + ';background:transparent;border:none;cursor:pointer;width:100%;text-align:left;transition:all 0.15s;';
                b.innerHTML = `<span class="material-symbols-rounded" style="font-size:16px;">${isActive ? 'check_circle' : 'radio_button_unchecked'}</span>${opcion.label}`;
                b.onmouseenter = () => { b.style.background = 'rgba(255,255,255,0.06)'; b.style.color = '#fff'; };
                b.onmouseleave = () => { b.style.background = 'transparent'; b.style.color = isActive ? '#60a5fa' : '#94a3b8'; };
                b.onclick = (e) => {
                    e.stopPropagation();
                    card.dataset.frecuencia = opcion.value;
                    const simbolo = card.querySelector('.frecuencia-simbolo');
                    if (simbolo) simbolo.textContent = obtenerSimboloFrecuencia(opcion.value);
                    floating.remove();
                    calculateIngresos();
                    guardarDatos();
                };
                floating.appendChild(b);
            });

            document.body.appendChild(floating);

            function updatePosition() {
                const rect = btn.getBoundingClientRect();
                floating.style.top = (rect.bottom + 6) + 'px';
                let left = rect.right - 150;
                if (left < 8) left = 8;
                floating.style.left = left + 'px';
            }
            updatePosition();

            const scrollHandler = () => updatePosition();
            window.addEventListener('scroll', scrollHandler, true);
            floating._scrollHandler = scrollHandler;

            setTimeout(() => {
                document.addEventListener('click', function handler(e) {
                    if (!floating.contains(e.target) && e.target !== btn) {
                        floating.remove();
                        window.removeEventListener('scroll', scrollHandler, true);
                        document.removeEventListener('click', handler);
                    }
                });
            }, 0);
        }

        function calculateBalance() {
            const gastosMes = window._totalGastosMes !== undefined 
                ? window._totalGastosMes 
                : parseFloat(document.getElementById('totalGastosMes').innerText.replace(/\./g, '').replace(',', '.')) || 0;
            const ingresosMes = window.totalIngresosMes || 0;
            
            const balance = ingresosMes - gastosMes;
            const capacidad = ingresosMes > 0 ? (balance / ingresosMes) * 100 : 0;
            const ahorroAnual = balance * 12;
            
            const balanceEl = document.getElementById('balanceMensual');
            balanceEl.innerText = fmt(balance) + ' €';
            balanceEl.className = 'font-mono font-black text-3xl ' + (balance >= 0 ? 'text-emerald-400' : 'text-rose-400');
            
            const capRounded = Math.round(capacidad * 100) / 100;
            document.getElementById('capacidadAhorro').innerText = (capRounded % 1 === 0 ? capRounded.toFixed(0) : capRounded.toFixed(2).replace('.', ',')) + '%';
            document.getElementById('ahorroAnual').innerText = fmt(ahorroAnual);
        }
        let saveTimeout;
        Object.defineProperty(window, '_getSaveTimeout', { get: () => saveTimeout });
        window._clearSaveTimeout = () => clearTimeout(saveTimeout);
        
        function obtenerIconoTitulo(textoTitulo) {
            const h2Elements = Array.from(document.querySelectorAll('h2, h3'));
            const elemento = h2Elements.find(h => h.textContent.includes(textoTitulo));
            if (!elemento) return null;
            
            const iconSpan = elemento.querySelector('.material-symbols-rounded, .material-symbols-rounded');
            if (!iconSpan) return null;
            
            return {
                icono: iconSpan.textContent.trim(),
                color: iconSpan.style?.color || ''
            };
        }
        
        function restaurarIconosTitulos(iconos) {
            const mapeoTitulos = {
                'cuentas': 'Cuentas Bancarias',
                'inversiones': 'Inversiones',
                'ayudaFamiliar': 'Ayuda Familiar',
                'ingresos': 'Mis Ingresos',
                'misGastos': 'Mis Gastos',
                'gastos': 'Gastos Mensuales',
                'precio': 'Precio de Compra',
                'hipoteca': 'Hipoteca para Cálculos',
                'simulaciones': 'Simulaciones de Bancos',
                'comparativa': 'Comparativa',
                'reformas': 'Reformas Estimadas',
                'dineroDisponible': 'Dinero Disponible',
                'gastoInicialTotal': 'Gasto Inicial Total',
                'dineroRestante': 'Dinero Restante',
                'resumenHipoteca': 'Resumen de la Hipoteca',
                'catastro': 'Datos Catastrales'
            };
            
            Object.keys(mapeoTitulos).forEach(key => {
                if (iconos[key]) {
                    const textoTitulo = mapeoTitulos[key];
                    const h2Elements = Array.from(document.querySelectorAll('h2, h3'));
                    const elemento = h2Elements.find(h => h.textContent.includes(textoTitulo));
                    if (elemento) {
                        const iconSpan = elemento.querySelector('.material-symbols-rounded, .material-symbols-rounded');
                        if (iconSpan && iconos[key]) {
                            if (typeof iconos[key] === 'object') {
                                iconSpan.textContent = iconos[key].icono;
                                if (iconos[key].color) {
                                    iconSpan.style.color = iconos[key].color;
                                }
                            } else {
                                iconSpan.textContent = iconos[key];
                            }
                        }
                    }
                }
            });
        }
        
        function mostrarIndicadorGuardado() {
            const indicator = document.getElementById('saveIndicator');
            if (!indicator) return; // Protección si el elemento no existe
            indicator.style.opacity = '1';
            setTimeout(() => {
                if (indicator) indicator.style.opacity = '0';
            }, 2000);
        }
        
        const DB_NAME = 'SeniorPlazAppDB';
        const DB_VERSION = 1;
        const STORE_NAME = 'datos';
        let db = null;
        let dbReadyPromise = null;
        function abrirDB() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, DB_VERSION);
                
                request.onerror = () => reject(request.error);
                request.onsuccess = () => {
                    db = request.result;
                    resolve(db);
                };
                
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME);
                    }
                };
            });
        }
        async function guardarEnDB(key, data) {
            try {
                if (!db) {
                    await abrirDB();
                }
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction([STORE_NAME], 'readwrite');
                    const store = transaction.objectStore(STORE_NAME);
                    const request = store.put(data, key);
                    
                    request.onsuccess = () => {
                        resolve();
                    };
                    request.onerror = () => {
                        reject(request.error);
                    };
                });
            } catch (error) {
            }
        }
        async function cargarDesdeDB(key) {
            try {
                if (!db) await abrirDB();
                
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction([STORE_NAME], 'readonly');
                    const store = transaction.objectStore(STORE_NAME);
                    const request = store.get(key);
                    
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            } catch (error) {
                return null;
            }
        }
        dbReadyPromise = abrirDB().then(() => {
        }).catch(err => {
        });
        function cargarPlano(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const planoImg = document.getElementById('planoImagen');
                const placeholder = document.getElementById('planoPlaceholder');
                
                planoImg.src = e.target.result;
                planoImg.style.display = 'block';
                placeholder.style.display = 'none';
                guardarDatos();
            };
            reader.readAsDataURL(file);
        }
        function eliminarPlano() {
            const planoImg = document.getElementById('planoImagen');
            const placeholder = document.getElementById('planoPlaceholder');
            
            planoImg.src = '';
            planoImg.style.display = 'none';
            placeholder.style.display = 'block';
            
            document.getElementById('planoInput').value = '';
            guardarDatos();
        }
        const _archivados = {};

        function toggleCardMenu(btn) {
            const existing = document.getElementById('floatingCardMenu');
            if (existing) {
                const wasSame = existing._sourceBtn === btn;
                if (existing._scrollHandler) {
                    window.removeEventListener('scroll', existing._scrollHandler, true);
                }
                existing.remove();
                if (wasSame) return;
            }

            const card = btn.closest('.card-input-group') || btn.closest('.simulacion-card');
            const lista = card ? card.closest('[id^="lista"]') : null;
            const listaId = lista ? lista.id : null;

            const floating = document.createElement('div');
            floating.id = 'floatingCardMenu';
            floating._sourceBtn = btn;
            floating.style.cssText = 'position:fixed;background:rgba(15,23,42,0.97);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:6px;min-width:150px;z-index:150;box-shadow:0 10px 40px rgba(0,0,0,0.5);display:flex;flex-direction:column;gap:2px;';

            function makeBtn(icon, label, isDanger, action) {
                const b = document.createElement('button');
                b.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;font-size:12px;font-family:Plus Jakarta Sans,sans-serif;font-weight:600;color:#94a3b8;background:transparent;border:none;cursor:pointer;width:100%;text-align:left;transition:all 0.15s;';
                b.innerHTML = `<span class="material-symbols-rounded" style="font-size:16px;">${icon}</span>${label}`;
                b.onmouseenter = () => { b.style.background = isDanger ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.06)'; b.style.color = isDanger ? '#ef4444' : '#fff'; };
                b.onmouseleave = () => { b.style.background = 'transparent'; b.style.color = '#94a3b8'; };
                b.onclick = (e) => { e.stopPropagation(); action(); floating.remove(); };
                return b;
            }
            if (listaId === 'listaCuentas' || listaId === 'listaInversiones') {
                const isDisabled = card.classList.contains('disabled');
                floating.appendChild(makeBtn('check_circle', isDisabled ? 'Activar' : 'Desactivar', false, () => {
                    if (card.classList.contains('disabled')) {
                        card.classList.remove('disabled');
                    } else {
                        card.classList.add('disabled');
                    }
                    try { calculate(); } catch(e) {}
                    guardarDatos();
                }));
            } else if (listaId === 'listaSimulaciones') {
                const checkIcon = card.querySelector('.simulacion-check-icon');
                const isChecked = checkIcon && checkIcon.dataset.checked === 'true';
                floating.appendChild(makeBtn('check_circle', isChecked ? 'Desactivar' : 'Activar', false, () => {
                    const toggleBtn = card.querySelector('.card-menu-dropdown button[onclick*="toggleSimulacionCheck"]');
                    if (toggleBtn) {
                        toggleSimulacionCheck(toggleBtn);
                    } else {
                        const newChecked = !isChecked;
                        if (newChecked) {
                            document.querySelectorAll('.simulacion-check-icon').forEach(otherIcon => {
                                if (otherIcon !== checkIcon) {
                                    otherIcon.dataset.checked = 'false';
                                    otherIcon.style.color = '#94a3b8';
                                    const otherCard = otherIcon.closest('.simulacion-card');
                                    const otherEtiqueta = otherCard?.querySelector('.etiqueta-seleccionada');
                                    if (otherEtiqueta) otherEtiqueta.style.display = 'none';
                                }
                            });
                        }
                        if (checkIcon) {
                            checkIcon.dataset.checked = newChecked ? 'true' : 'false';
                            checkIcon.style.color = newChecked ? '#10b981' : '#94a3b8';
                        }
                        
                        const etiqueta = card.querySelector('.etiqueta-seleccionada');
                        if (etiqueta) {
                            etiqueta.style.display = newChecked ? 'flex' : 'none';
                        }
                        
                        if (typeof updateInfoSimulacionSeleccionada === 'function') {
                            updateInfoSimulacionSeleccionada();
                        }
                        guardarDatos();
                    }
                }));
            }
            floating.appendChild(makeBtn('archive', 'Archivar', false, () => {
                if (!card || !listaId) return;
                if (!_archivados[listaId]) _archivados[listaId] = [];
                const _lista = document.getElementById(listaId);
                if (_lista) card._archivedPosition = Array.from(_lista.children).indexOf(card);
                _archivados[listaId].push(card);
                card.remove();
                try { calculate(); } catch(e) {}
                try { calculateIngresos(); } catch(e) {}
                try { calculateGastos(); } catch(e) {}
                try { updateComparador(); } catch(e) {}
                guardarDatos();
                actualizarBadgesArchivo();
            }));
            floating.appendChild(makeBtn('delete', 'Eliminar', true, () => {
                if (!card) return;
                card.remove();
                try { calculate(); } catch(e) {}
                try { calculateIngresos(); } catch(e) {}
                try { calculateGastos(); } catch(e) {}
                try { updateComparador(); } catch(e) {}
                guardarDatos();
            }));

            document.body.appendChild(floating);
            function updatePosition() {
                const rect = btn.getBoundingClientRect();
                floating.style.top = (rect.bottom + 6) + 'px';
                let left = rect.right - 150;
                if (left < 8) left = 8;
                floating.style.left = left + 'px';
            }
            updatePosition();
            const scrollHandler = () => updatePosition();
            window.addEventListener('scroll', scrollHandler, true);

            setTimeout(() => {
                document.addEventListener('click', function handler(e) {
                    if (!floating.contains(e.target) && e.target !== btn) {
                        floating.remove();
                        window.removeEventListener('scroll', scrollHandler, true);
                        document.removeEventListener('click', handler);
                    }
                });
            }, 0);
            floating._scrollHandler = scrollHandler;
        }
        function abrirArchivo(listaId) {
            const existing = document.getElementById('modalArchivo');
            if (existing) existing.remove();

            const archivados = _archivados[listaId] || [];

            const modal = document.createElement('div');
            modal.id = 'modalArchivo';
            modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:99998;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);';

            if (archivados.length === 0) {
                modal.innerHTML = `
                    <div style="background:rgba(15,23,42,0.97);border:1px solid rgba(59,130,246,0.2);border-radius:20px;padding:32px;max-width:400px;width:90%;text-align:center;">
                        <span class="material-symbols-rounded" style="font-size:48px;color:#334155;display:block;margin-bottom:12px;">archive</span>
                        <p style="color:#94a3b8;font-family:Plus Jakarta Sans,sans-serif;font-size:14px;font-weight:600;">No hay tarjetas archivadas</p>
                        <button onclick="document.getElementById('modalArchivo').remove()" style="margin-top:20px;padding:8px 20px;border-radius:10px;border:1px solid rgba(148,163,184,0.3);background:rgba(148,163,184,0.1);color:#94a3b8;font-family:Plus Jakarta Sans,sans-serif;font-weight:700;font-size:12px;cursor:pointer;">Cerrar</button>
                    </div>`;
            } else {
                const inner = document.createElement('div');
                inner.style.cssText = 'background:rgba(15,23,42,0.97);border:1px solid rgba(59,130,246,0.2);border-radius:20px;padding:24px;max-width:420px;width:90%;max-height:80%;overflow-y:auto;';
                inner.innerHTML = `
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
                        <span class="material-symbols-rounded" style="font-size:22px;color:#3b82f6;">archive</span>
                        <h3 style="margin:0;font-family:Plus Jakarta Sans,sans-serif;font-weight:800;font-size:16px;color:#fff;">Tarjetas Archivadas</h3>
                    </div>
                    <div id="listaArchivadosModal" style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px;"></div>
                    <div style="display:flex;gap:8px;justify-content:flex-end;">
                        <button onclick="document.getElementById('modalArchivo').remove()" style="padding:8px 16px;border-radius:10px;border:1px solid rgba(148,163,184,0.3);background:rgba(148,163,184,0.1);color:#94a3b8;font-family:Plus Jakarta Sans,sans-serif;font-weight:700;font-size:12px;cursor:pointer;">Cancelar</button>
                        <button onclick="desarchivarSeleccionados('${listaId}')" style="padding:8px 16px;border-radius:10px;border:1px solid rgba(59,130,246,0.4);background:rgba(59,130,246,0.15);color:#60a5fa;font-family:Plus Jakarta Sans,sans-serif;font-weight:700;font-size:12px;cursor:pointer;">Desarchivar seleccionados</button>
                    </div>`;
                const listaEl = inner.querySelector('#listaArchivadosModal');
                archivados.forEach((card, i) => {
                    const nombre = card.querySelector('input[type="text"]')?.value || `Tarjeta ${i+1}`;
                    let valorTexto = '';
                    const inputMonetario = card.querySelector('.ingreso-simple-neto, .gasto-cantidad, .ingreso-neto-mes, .cuenta-saldo-input, .money-input');
                    if (inputMonetario && inputMonetario.value) {
                        const num = parseMoneyInput(inputMonetario.value);
                        if (num) valorTexto = fmt(num) + ' €';
                    }
                    const label = document.createElement('label');
                    label.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;border:1px solid rgba(59,130,246,0.15);background:rgba(59,130,246,0.05);cursor:pointer;font-family:Plus Jakarta Sans,sans-serif;color:#94a3b8;font-size:13px;font-weight:600;';
                    label.innerHTML = `<input type="checkbox" data-idx="${i}" style="width:16px;height:16px;accent-color:#3b82f6;cursor:pointer;flex-shrink:0;">
                        <span class="material-symbols-rounded" style="font-size:18px;color:#3b82f6;flex-shrink:0;">archive</span>
                        <span style="flex:1;">${nombre}</span>
                        ${valorTexto ? `<span style="color:#3b82f6;font-family:Manrope,sans-serif;">${valorTexto}</span>` : ''}`;
                    listaEl.appendChild(label);
                });
                modal.appendChild(inner);
            }
            document.body.appendChild(modal);
        }

        function desarchivarSeleccionados(listaId) {
            const lista = document.getElementById(listaId);
            if (!lista || !_archivados[listaId]) return;
            if (typeof _undoPushInmediato === 'function') _undoPushInmediato();
            const checks = document.querySelectorAll('#listaArchivadosModal input[type="checkbox"]:checked');
            const idxs = Array.from(checks).map(c => parseInt(c.dataset.idx)).sort((a,b) => b-a);
            idxs.forEach(idx => {
                const card = _archivados[listaId][idx];
                if (card) {
                    function insertarEnPosicion(lista, nodo, pos) {
                        if (pos !== undefined && pos >= 0 && pos < lista.children.length) {
                            lista.insertBefore(nodo, lista.children[pos]);
                        } else {
                            lista.appendChild(nodo);
                        }
                    }
                    if (listaId === 'listaReformas' || listaId === 'listaMobiliario') {
                        const tipo = listaId === 'listaReformas' ? 'reforma' : 'mobiliario';
                        const isPreview = card.classList.contains('reforma-preview-card');
                        const nombre = isPreview ? (card.dataset.nombre || '') : (card.querySelector('input[type="text"]')?.value || '');
                        const valor = isPreview ? parseMoneyInput(card.dataset.valor || "0") : parseMoneyInput(card.querySelector('.reforma-input')?.value || "0");
                        const notas = isPreview ? (card.dataset.notas || '') : (card.querySelector('.reforma-notas')?.value || '');
                        const url = isPreview ? (card.dataset.url || '') : (card.querySelector('.reforma-url')?.value || '');
                        const imagenes = isPreview ? JSON.parse(card.dataset.imagenes || '[]') : Array.from(card.querySelectorAll('.reforma-imagen')).map(img => img.src);
                        const icono = card.dataset.icono || '';
                        const colorIcono = card.dataset.colorIcono || '';
                        const iconoImagen = card.dataset.iconoImagen || '';
                        const miniatura = card.dataset.miniatura || '';
                        const liked = card.dataset.liked === 'true';
                        const newCard = crearPreviewCard(tipo, nombre, valor, notas, url, imagenes, icono, colorIcono, iconoImagen, miniatura);
                        crearInputsOcultos(newCard, tipo, nombre, valor, notas, url, imagenes);
                        if (liked) {
                            newCard.dataset.liked = 'true';
                            const likeBtn = newCard.querySelector('.like-btn');
                            const icon = likeBtn?.querySelector('.material-symbols-rounded');
                            const ghostHeart = newCard.querySelector('.card-ghost-heart');
                            const accentColor = '#dc2626';
                            if (icon) icon.style.fontVariationSettings = "'FILL' 1";
                            if (likeBtn) { likeBtn.style.color = 'white'; likeBtn.style.borderColor = 'rgba(255,255,255,0.5)'; likeBtn.style.background = 'rgba(255,255,255,0.15)'; likeBtn.classList.add('liked'); }
                            if (ghostHeart) ghostHeart.style.display = 'flex';
                        }
                        
                        insertarEnPosicion(lista, newCard, card._archivedPosition);
                    } else {
                        const iconContainer = card.querySelector('.icon-container');
                        if (iconContainer && card.dataset) {
                            if (card.dataset.iconoImagen) {
                                iconContainer.innerHTML = `<img src="${card.dataset.iconoImagen}" class="w-full h-full object-cover rounded-xl">`;
                                iconContainer.dataset.tipo = 'imagen';
                            } else if (card.dataset.icono) {
                                const iconEl = iconContainer.querySelector('.material-symbols-rounded');
                                if (iconEl) {
                                    iconEl.textContent = card.dataset.icono;
                                    if (card.dataset.colorIcono) {
                                        iconEl.style.color = card.dataset.colorIcono;
                                    }
                                }
                            }
                        }
                        insertarEnPosicion(lista, card, card._archivedPosition);
                    }
                    _archivados[listaId].splice(idx, 1);
                }
            });
            document.getElementById('modalArchivo')?.remove();
            if (listaId === 'listaReformas') refrescarCarrusel('reforma');
            if (listaId === 'listaMobiliario') refrescarCarrusel('mobiliario');
            try { calculate(); } catch(e) {}
            try { calculateIngresos(); } catch(e) {}
            try { calculateGastos(); } catch(e) {}
            guardarDatos();
            actualizarBadgesArchivo(); // Actualizar badges tras desarchivar
        }
        function actualizarBadgesArchivo() {
            const listas = [
                'listaCuentas',
                'listaInversiones', 
                'listaIngresos',
                'listaGastos',
                'listaSimulaciones',
                'listaReformas',
                'listaMobiliario'
            ];
            
            listas.forEach(listaId => {
                const count = (_archivados[listaId] || []).length;
                const allButtons = document.querySelectorAll('button');
                
                allButtons.forEach(btn => {
                    const onclick = btn.getAttribute('onclick');
                    if (onclick && onclick.includes('abrirArchivo') && onclick.includes(listaId)) {
                        const badge = btn.querySelector('.archive-badge');
                        if (badge) {
                            if (count > 0) {
                                if (badge) { badge.textContent = count > 99 ? '99+' : count; }
                                badge.style.display = 'flex'; badge.removeAttribute('data-hidden');
                            } else {
                                badge.style.display = 'none'; badge.setAttribute('data-hidden','1');
                            }
                        }
                    }
                });
            });
        }

        function archivarCard(btn) {
            const card = btn.closest('.card-input-group') || btn.closest('.simulacion-card');
            if (!card) return;
            if (typeof _undoPushInmediato === 'function') _undoPushInmediato();
            const lista = card.closest('[id^="lista"]');
            const listaId = lista ? lista.id : null;
            if (listaId) {
                if (!_archivados[listaId]) _archivados[listaId] = [];
                card._archivedPosition = Array.from(lista.children).indexOf(card);
                const iconContainer = card.querySelector('.icon-container, .icon-container-banco');
                if (iconContainer) {
                    const img = iconContainer.querySelector('img');
                    const icon = iconContainer.querySelector('.material-symbols-rounded');
                    if (img && img.src && img.src.startsWith('data:')) {
                        card.dataset.iconoImagen = img.src;
                        card.dataset.icono = '';
                    } else if (icon) {
                        card.dataset.icono = icon.textContent || '';
                        card.dataset.colorIcono = icon.style.color || '';
                        card.dataset.iconoImagen = '';
                    }
                }
                
                _archivados[listaId].push(card);
            }
            card.remove();
            if (listaId === 'listaSimulaciones') updateComparador();
            guardarDatos();
            actualizarBadgesArchivo();
        }

        function eliminarCard(btn, calcFn) {
            const card = btn.closest('.card-input-group');
            if (!card) return;
            if (typeof _undoPushInmediato === 'function') _undoPushInmediato();
            const lista = card.closest('[id^="lista"]');
            const containerId = lista ? lista.id : null;
            card.remove();
            if (calcFn) calcFn();
            guardarDatos();
            _syncEmptyStates && _syncEmptyStates();
        }

        function _serializarDatos() {
        const datos = {
            version: '1.0',
            fecha: new Date().toISOString(),
            gymVisitado: true,
            cuentas: Array.from(document.querySelectorAll('#listaCuentas .card-input-group')).map(card => {
                const iconElement = card.querySelector('.icon-container .material-symbols-rounded');
                return {
                    nombre: card.querySelector('input[type="text"]')?.value || '',
                    valor: card.querySelector('.cuenta-saldo-input')?.value || 0,
                    activo: isCardActive(card),
                    icono: iconElement?.textContent || 'account_balance',
                    colorIcono: iconElement ? (iconElement.style?.color || '') : '',
                    imagen: (function(){ const s = card.querySelector('.icon-container img')?.src||''; return s.startsWith('data:') ? s : ''; })()
                };
            }),
            inversiones: Array.from(document.querySelectorAll('#listaInversiones .card-input-group')).map(card => {
                const iconElement = card.querySelector('.icon-container .material-symbols-rounded');
                return {
                    nombre: card.querySelector('input[type="text"]')?.value || '',
                    valor: card.querySelector('.cuenta-saldo-input')?.value || 0,
                    activo: isCardActive(card),
                    icono: iconElement?.textContent || 'show_chart',
                    colorIcono: iconElement ? (iconElement.style?.color || '') : '',
                    imagen: (function(){ const s = card.querySelector('.icon-container img')?.src||''; return s.startsWith('data:') ? s : ''; })()
                };
            }),
            donaciones: {
                madre: getDonValue('donMama'),
                padre: getDonValue('donPapa')
            },
            ingresos: Array.from(document.querySelectorAll('#listaIngresos .card-input-group')).map(card => {
                const esSimple = card.querySelector('.ingreso-simple-neto') !== null;
                const iconElement = card.querySelector('.icon-container .material-symbols-rounded');
                if (esSimple) {
                    return {
                        tipo: 'simple',
                        nombre: card.querySelector('input[type="text"]')?.value || '',
                        cantidad: parseMoneyInput(card.querySelector('.ingreso-simple-neto')?.value || '0'),
                        frecuencia: card.dataset.frecuencia || 'mensual',
                        icono: iconElement?.textContent || 'euro',
                        colorIcono: iconElement ? (iconElement.style?.color || '#10b981') : '#10b981',
                        iconoImagen: (function(){ const s = card.querySelector('.icon-container img')?.src||''; return s.startsWith('data:') ? s : ''; })()
                    };
                } else {
                    return {
                        tipo: 'nomina',
                        nombre: card.querySelector('input[type="text"]')?.value || '',
                        bruto: parseMoneyInput(card.querySelector('.ingreso-bruto-mes')?.value || '0'),
                        neto: parseMoneyInput(card.querySelector('.ingreso-neto-mes')?.value || '0'),
                        icono: iconElement?.textContent || 'euro',
                        colorIcono: iconElement ? (iconElement.style?.color || '#10b981') : '#10b981',
                        iconoImagen: (function(){ const s = card.querySelector('.icon-container img')?.src||''; return s.startsWith('data:') ? s : ''; })(),
                        pdfNominas: Array.from(card.querySelectorAll('.pdf-item')).map(r => _crearRegistroPdfDesdeFila(r, 'nomina.pdf'))
                    };
                }
            }),
            gastos: Array.from(document.querySelectorAll('#listaGastos .card-input-group')).map(card => {
                const iconElement = card.querySelector('.icon-container .material-symbols-rounded');
                return {
                    nombre: card.querySelector('input[type="text"]')?.value || '',
                    cantidad: parseMoneyInput(card.querySelector('.gasto-cantidad')?.value || '0'),
                    frecuencia: card.dataset.frecuencia || 'mensual',
                    icono: iconElement?.textContent || 'euro',
                    colorIcono: iconElement ? (iconElement.style?.color || '#ef4444') : '#ef4444',
                    iconoImagen: (function(){ const s = card.querySelector('.icon-container img')?.src||''; return s.startsWith('data:') ? s : ''; })()
                };
            }),
            hipoteca: {
                precioCasa: getDonValue('precioCasa'),
                percEntrada: document.getElementById('percEntrada')?.value || 20,
                percITP: document.getElementById('percITP')?.value || 10,
                gastoNotaria: document.getElementById('gastoNotaria')?.value || 2500
            },
            simulaciones: Array.from(document.querySelectorAll('.simulacion-card')).map(card => {
                const pdfData = Array.from(card.querySelectorAll('.pdf-item-banco')).map(r => _crearRegistroPdfDesdeFila(r, 'doc.pdf'));
                
                const iconContainer = card.querySelector('.icon-container-banco');
                
                return {
                    banco: card.querySelector('.banco-nombre')?.value || '',
                    tin: card.querySelector('.tin-input')?.value || 0,
                    tae: card.querySelector('.tae-input')?.value || 0,
                    plazo: card.querySelector('.plazo-input')?.value || 30,
                    cuota: card.querySelector('.cuota-input')?.value || 0,
                    seleccionada: card.querySelector('.simulacion-check-icon')?.dataset?.checked === 'true',
                    icono: card.querySelector('.icon-container-banco .material-symbols-rounded')?.textContent || '',
                    colorFondo: iconContainer ? (iconContainer.style?.background || '') : '',
                    iconoImagen: (function(){ const s = card.querySelector('.icon-container-banco img')?.src||''; return s.startsWith('data:') ? s : ''; })(),
                    pdf: pdfData,
                    bonos: {
                        nomina: card.querySelector('.bono-nomina')?.checked || false,
                        vida: card.querySelector('.bono-vida')?.checked || false,
                        hogar: card.querySelector('.bono-hogar')?.checked || false,
                        recibos: card.querySelector('.bono-recibos')?.checked || false,
                        tarjeta: card.querySelector('.bono-tarjeta')?.checked || false,
                        notas: card.querySelector('.notas-simulacion')?.value || ''
                    }
                };
            }),
            reformas: Array.from(document.querySelectorAll('#listaReformas .card-input-group, #listaMobiliario .card-input-group')).map(card => {
                const isPreview = card.classList.contains('reforma-preview-card');
                const iconElement = card.querySelector('.icon-container .material-symbols-rounded');
                return {
                    nombre: isPreview ? (card.dataset.nombre || '') : (card.querySelector('input[type="text"]')?.value || ''),
                    valor: isPreview ? (card.dataset.valor || 0) : parseMoneyInput(card.querySelector('.reforma-input')?.value || '0'),
                    notas: isPreview ? (card.dataset.notas || '') : (card.querySelector('.reforma-notas')?.value || ''),
                    url: isPreview ? (card.dataset.url || '') : (card.querySelector('.reforma-url')?.value || ''),
                    imagenes: isPreview ? JSON.parse(card.dataset.imagenes || '[]') : Array.from(card.querySelectorAll('.reforma-imagen')).map(img => img.src),
                    tipoReforma: card.dataset.tipoReforma || (card.closest('#listaMobiliario') ? 'mobiliario' : 'reforma'),
                    icono: isPreview ? (card.dataset.icono || (card.dataset.tipoReforma === 'mobiliario' ? 'weekend' : 'construction')) : (iconElement?.textContent || (card.dataset.tipoReforma === 'mobiliario' ? 'weekend' : 'construction')),
                    colorIcono: isPreview ? (card.dataset.colorIcono || '') : (iconElement ? (iconElement.style?.color || '') : ''),
                    iconoImagen: isPreview ? (card.dataset.iconoImagen || '') : (function(){ const s = card.querySelector('.icon-container img')?.src||''; return s.startsWith('data:') ? s : ''; })(),
                    miniatura: card.dataset.miniatura || '',
                    liked: card.dataset.liked === 'true'
                };
            }),
            mobiliario: [],
            docsBancos: Array.from(document.querySelectorAll('.pdf-lista-bancos .pdf-item')).map(r => _crearRegistroPdfDesdeFila(r, 'doc.pdf')),
            archivados: (function() {
                const result = {};
                const listas = ['listaCuentas','listaInversiones','listaIngresos','listaGastos','listaSimulaciones','listaReformas','listaMobiliario'];
                listas.forEach(listaId => {
                    const cards = _archivados[listaId] || [];
                    if (cards.length === 0) return;
                    result[listaId] = cards.map((card, _cardIdx) => { const _pos = card._archivedPosition; const _addPos = obj => { obj.archivedPosition = _pos; return obj; }; const _origCard = card; void _origCard; 
                        if (listaId === 'listaSimulaciones') {
                            const iconContainer = card.querySelector('.icon-container-banco');
                            let pdfData = null;
                            pdfData = Array.from(card.querySelectorAll('.pdf-item-banco')).map(r => _crearRegistroPdfDesdeFila(r, 'doc.pdf'));
                            return _addPos({
                                tipo: 'simulacion',
                                banco: card.querySelector('.banco-nombre')?.value || '',
                                tin: card.querySelector('.tin-input')?.value || 0,
                                tae: card.querySelector('.tae-input')?.value || 0,
                                plazo: card.querySelector('.plazo-input')?.value || 30,
                                cuota: card.querySelector('.cuota-input')?.value || 0,
                                seleccionada: card.querySelector('.simulacion-check-icon')?.dataset?.checked === 'true',
                                icono: card.querySelector('.icon-container-banco .material-symbols-rounded')?.textContent || '',
                                colorFondo: iconContainer ? (iconContainer.style?.background || '') : '',
                                iconoImagen: (function(){ const s = card.querySelector('.icon-container-banco img')?.src||''; return s.startsWith('data:') ? s : ''; })(),
                                pdf: pdfData,
                                bonos: {
                                    nomina: card.querySelector('.bono-nomina')?.checked || false,
                                    vida: card.querySelector('.bono-vida')?.checked || false,
                                    hogar: card.querySelector('.bono-hogar')?.checked || false,
                                    recibos: card.querySelector('.bono-recibos')?.checked || false,
                                    tarjeta: card.querySelector('.bono-tarjeta')?.checked || false,
                                    notas: card.querySelector('.notas-simulacion')?.value || ''
                                }
                            });
                        }
                        if (listaId === 'listaReformas' || listaId === 'listaMobiliario') {
                            const isPreview = card.classList.contains('reforma-preview-card');
                            const iconElement = card.querySelector('.icon-container .material-symbols-rounded');
                            return _addPos({
                                tipo: 'reforma',
                                nombre: isPreview ? (card.dataset.nombre||'') : (card.querySelector('input[type="text"]')?.value || ''),
                                valor: isPreview ? (card.dataset.valor||0) : parseMoneyInput(card.querySelector('.reforma-input')?.value || '0'),
                                notas: isPreview ? (card.dataset.notas||'') : (card.querySelector('.reforma-notas')?.value || ''),
                                url: isPreview ? (card.dataset.url||'') : (card.querySelector('.reforma-url')?.value || ''),
                                imagenes: isPreview ? JSON.parse(card.dataset.imagenes || '[]') : Array.from(card.querySelectorAll('.reforma-imagen')).map(img => img.src),
                                tipoReforma: card.dataset.tipoReforma || (listaId === 'listaMobiliario' ? 'mobiliario' : 'reforma'),
                                icono: isPreview ? (card.dataset.icono || (card.dataset.tipoReforma === 'mobiliario' ? 'weekend' : 'construction')) : (iconElement?.textContent || (card.dataset.tipoReforma === 'mobiliario' ? 'weekend' : 'construction')),
                                colorIcono: isPreview ? (card.dataset.colorIcono || '') : (iconElement ? (iconElement.style?.color || '') : ''),
                                iconoImagen: isPreview ? (card.dataset.iconoImagen || '') : (function(){ const s = card.querySelector('.icon-container img')?.src||''; return s.startsWith('data:') ? s : ''; })(),
                                miniatura: card.dataset.miniatura || '',
                                liked: card.dataset.liked === 'true'
                            });
                        }
                        if (listaId === 'listaIngresos') {
                            const iconElement = card.querySelector('.icon-container .material-symbols-rounded');
                            const esSimple = card.querySelector('.ingreso-simple-neto') !== null;
                            if (esSimple) {
                                return _addPos({ tipo: 'ingreso-simple', nombre: card.querySelector('input[type="text"]')?.value || '', cantidad: parseMoneyInput(card.querySelector('.ingreso-simple-neto')?.value || '0'), frecuencia: card.dataset.frecuencia || 'mensual', icono: iconElement?.textContent || 'euro', colorIcono: iconElement?.style?.color || '#10b981', iconoImagen: (function(){ const s = card.querySelector('.icon-container img')?.src||''; return s.startsWith('data:') ? s : ''; })() });
                            } else {
                                return _addPos({ tipo: 'ingreso-nomina', nombre: card.querySelector('input[type="text"]')?.value || '', bruto: parseMoneyInput(card.querySelector('.ingreso-bruto-mes')?.value || '0'), neto: parseMoneyInput(card.querySelector('.ingreso-neto-mes')?.value || '0'), icono: iconElement?.textContent || 'euro', colorIcono: iconElement?.style?.color || '#10b981', iconoImagen: (function(){ const s = card.querySelector('.icon-container img')?.src||''; return s.startsWith('data:') ? s : ''; })(), pdfNominas: Array.from(card.querySelectorAll('.pdf-item')).map(r => _crearRegistroPdfDesdeFila(r, 'nomina.pdf')) });
                            }
                        }
                        if (listaId === 'listaGastos') {
                            const iconElement = card.querySelector('.icon-container .material-symbols-rounded');
                            return _addPos({ tipo: 'gasto', nombre: card.querySelector('input[type="text"]')?.value || '', cantidad: parseMoneyInput(card.querySelector('.gasto-cantidad')?.value || '0'), frecuencia: card.dataset.frecuencia || 'mensual', icono: iconElement?.textContent || 'euro', colorIcono: iconElement?.style?.color || '#ef4444', iconoImagen: (function(){ const s = card.querySelector('.icon-container img')?.src||''; return s.startsWith('data:') ? s : ''; })() });
                        }
                        const iconElement = card.querySelector('.icon-container .material-symbols-rounded');
                        return _addPos({
                            tipo: listaId === 'listaCuentas' ? 'cuenta' : 'inversion',
                            nombre: card.querySelector('input[type="text"]')?.value || '',
                            valor: parseMoneyInput(card.querySelector('.cuenta-saldo-input, .money-input')?.value || '0'),
                            activo: isCardActive(card),
                            icono: iconElement?.textContent || 'account_balance',
                            colorIcono: iconElement?.style?.color || '#10b981',
                            imagen: (function(){ const s = card.querySelector('.icon-container img')?.src||''; return s.startsWith('data:') ? s : ''; })(),
                            iconoImagen: (function(){ const s = card.querySelector('.icon-container img')?.src||''; return s.startsWith('data:') ? s : ''; })()
                        });
                    });
                });
                return result;
            })(),
            titulo: document.getElementById('tituloApp')?.value || 'seniorplazapp',
            subtitulo: document.getElementById('subtituloApp')?.value || '',
            iconoPrincipal: document.querySelector('#iconoPrincipalContainer .material-symbols-rounded')?.textContent || '',
            iconoPrincipalImagen: (function(){ const s = document.querySelector('#iconoPrincipalContainer img')?.src||''; return s.startsWith('data:') ? s : ''; })(),
            vivienda: {
                plano: (function(){ const s = document.getElementById('planoImagen')?.src || ''; return s.startsWith('data:') ? s : ''; })(),
                iconoPlano: document.getElementById('iconoPlano')?.textContent || 'floor_plan',
                rooms360: window.rooms360 ? window.rooms360.map(room => ({
                    textureData: room.textureData,
                    name: room.name,
                    lon: room.lon,
                    lat: room.lat
                })) : []
            },
            catastro: {
                referencia: document.getElementById('refCatastral')?.value || '',
                localizacion: document.getElementById('catLocalizacion')?.value || '',
                clase: document.getElementById('catClase')?.value || 'Urbano',
                uso: document.getElementById('catUso')?.value || 'Residencial',
                superficie: document.getElementById('catSuperficie')?.value || 0,
                anio: document.getElementById('catAnio')?.value || 0,
                parcelaLoc: document.getElementById('catParcelaLoc')?.value || '',
                superficieParcela: document.getElementById('catSuperficieParcela')?.value || 0,
                participacion: document.getElementById('catParticipacion')?.value || 100,
                valor: getDonValue('catValor'),
                fotoVivienda: (function(){ const s = document.getElementById('imagenVivienda')?.src || ''; return s.startsWith('data:') ? s : ''; })()
            },
            iconosTitulos: {
                cuentas: obtenerIconoTitulo('Cuentas Bancarias'),
                inversiones: obtenerIconoTitulo('Inversiones'),
                ayudaFamiliar: obtenerIconoTitulo('Ayuda Familiar'),
                ingresos: obtenerIconoTitulo('Mis Ingresos'),
                misGastos: obtenerIconoTitulo('Mis Gastos'),
                gastos: obtenerIconoTitulo('Gastos Mensuales'),
                precio: obtenerIconoTitulo('Precio de Compra'),
                hipoteca: obtenerIconoTitulo('Hipoteca para Cálculos'),
                simulaciones: obtenerIconoTitulo('Simulaciones de Bancos'),
                comparativa: obtenerIconoTitulo('Comparativa'),
                reformas: obtenerIconoTitulo('Reformas Estimadas'),
                dineroDisponible: obtenerIconoTitulo('Dinero Disponible'),
                gastoInicialTotal: obtenerIconoTitulo('Gasto Inicial Total'),
                dineroRestante: obtenerIconoTitulo('Dinero Restante'),
                resumenHipoteca: obtenerIconoTitulo('Resumen de la Hipoteca'),
                catastro: obtenerIconoTitulo('Datos Catastrales')
            },
            vidaLaboral: typeof _VL !== 'undefined' ? {
                activas: _VL.state.activas,
                miniaturas: _VL.state.miniaturas
            } : null,
            finanzasData: (window.finanzasData ? {
                categorias: window.finanzasData.categorias || [],
                operaciones: window.finanzasData.operaciones || [],
                programados: window.finanzasData.programados || []
            } : null),
            nutricionData: window.nutricionData ? {
                comidas: window.nutricionData.comidas || [],
                registrosPeso: window.nutricionData.registrosPeso || [],
                objetivos: window.nutricionData.objetivos || { kcal: 2000, prot: 100, carbs: 250, grasas: 65 }
            } : null,

            agendaData: window.agendaData ? {
                habitos: window.agendaData.habitos || [],
                tareasRecurrentes: window.agendaData.tareasRecurrentes || [],
                tareas: window.agendaData.tareas || []
            } : null,
            gymCards: (function() {
                var hoy = _gymFechaKey(0);
                var hist = window._gymSesionesHistorial || {};
                var elInt = document.getElementById('gym-intervalo-label');
                var offsetActual = elInt ? parseInt(elInt.dataset.offset || 0) : 0;
                var filtroActual = elInt ? (elInt.dataset.filtro || 'dia') : 'dia';
                var viendoHoy = (filtroActual === 'dia' && offsetActual === 0);
                var out;
                if (viendoHoy) {
                    var paneles = ['pecho','espalda','brazo','pierna','cardio'];
                    out = {};
                    var totalCardsDOM = 0;
                    paneles.forEach(function(p) {
                        var panel = document.getElementById('gym-panel-' + p);
                        if (!panel) { out[p] = []; return; }
                        out[p] = Array.from(panel.querySelectorAll('.gym-card')).map(function(card) {
                            var imgEl = card.querySelector('.gym-card-img img');
                            var timeBadge = card.querySelector('.gym-card-time-badge');
                            var metricasCardio = _gymSerializarMetricasCardioCard(card);
                            return {
                                nombre:  card.querySelector('.gym-card-nombre')?.textContent?.trim() || '',
                                desc:    card.querySelector('.gym-card-desc')?.textContent?.trim() || '',
                                badge:   card.querySelector('.gym-card-badge-cat')?.textContent?.trim() || '',
                                badgeMaquina: card.querySelector('.gym-card-badge-maq')?.textContent?.trim() || '',
                                series:  card.querySelector('input.gym-card-series')?.value || '3',
                                reps:    card.querySelector('input.gym-card-reps')?.value || '12',
                                kg:      card.querySelector('input.gym-card-kg')?.value || '0',
                                rir:     card.querySelector('input.gym-card-rir')?.value || '',
                                rpe:     card.querySelector('input.gym-card-rpe')?.value || '',
                                cardioSeriesLabel: metricasCardio ? metricasCardio.cardioSeriesLabel : '',
                                cardioRepsLabel: metricasCardio ? metricasCardio.cardioRepsLabel : '',
                                cardioRirLabel: metricasCardio ? metricasCardio.cardioRirLabel : '',
                                cardioRpeLabel: metricasCardio ? metricasCardio.cardioRpeLabel : '',
                                imgSrc:  imgEl ? imgEl.src : '',
                                cardTimeSecs: timeBadge ? parseInt(timeBadge.dataset.totalSecs || 0) : 0,
                                completado: (function(c){ var cb = c.querySelector('.gym-check-btn'); return cb ? cb.dataset.completado === '1' : false; })(card),
                                rutaCoords: card.dataset.rutaCoords ? JSON.parse(card.dataset.rutaCoords) : null,
                                rutaNombre: card.dataset.rutaNombre || '',
                                rutaUrl:    card.dataset.rutaUrl || '',
                                rutaCsv:    card.dataset.rutaCsv || ''
                            };
                        });
                        totalCardsDOM += out[p].length;
                    });
                    var histHoyCards = hist[hoy] && hist[hoy].cards;
                    var histTotalCards = histHoyCards ? Object.values(histHoyCards).reduce(function(s,a){ return s + (Array.isArray(a) ? a.length : 0); }, 0) : 0;
                    var domHistorico = !!document.querySelector('.gym-panel-grid[data-historico="1"]');
                    if (domHistorico) {
                        out = histHoyCards || {};
                    } else if (totalCardsDOM > 0 || histTotalCards === 0) {
                        if (!hist[hoy]) hist[hoy] = {};
                        hist[hoy].cards = out;
                    } else {
                        out = histHoyCards;
                    }
                } else {
                    if (filtroActual === 'dia') {
                        var fechaDia = _gymFechaKey(offsetActual);
                        var cardsDOM = {};
                        ['pecho','espalda','brazo','pierna','cardio'].forEach(function(p) {
                            var panel = document.getElementById('gym-panel-' + p);
                            if (!panel) { cardsDOM[p] = []; return; }
                            cardsDOM[p] = Array.from(panel.querySelectorAll('.gym-card')).map(function(card) {
                                var imgEl = card.querySelector('.gym-card-img img');
                                var timeBadge = card.querySelector('.gym-card-time-badge');
                                var metricasCardio = _gymSerializarMetricasCardioCard(card);
                                return {
                                    nombre:  card.querySelector('.gym-card-nombre')?.textContent?.trim() || '',
                                    desc:    card.querySelector('.gym-card-desc')?.textContent?.trim() || '',
                                    badge:   card.querySelector('.gym-card-badge-cat')?.textContent?.trim() || '',
                                    badgeMaquina: card.querySelector('.gym-card-badge-maq')?.textContent?.trim() || '',
                                    series:  card.querySelector('input.gym-card-series')?.value || '3',
                                    reps:    card.querySelector('input.gym-card-reps')?.value || '12',
                                    kg:      card.querySelector('input.gym-card-kg')?.value || '0',
                                    rir:     card.querySelector('input.gym-card-rir')?.value || '',
                                    rpe:     card.querySelector('input.gym-card-rpe')?.value || '',
                                    cardioSeriesLabel: metricasCardio ? metricasCardio.cardioSeriesLabel : '',
                                    cardioRepsLabel: metricasCardio ? metricasCardio.cardioRepsLabel : '',
                                    cardioRirLabel: metricasCardio ? metricasCardio.cardioRirLabel : '',
                                    cardioRpeLabel: metricasCardio ? metricasCardio.cardioRpeLabel : '',
                                    imgSrc:  imgEl ? imgEl.src : '',
                                    cardTimeSecs: timeBadge ? parseInt(timeBadge.dataset.totalSecs || 0) : 0,
                                    completado: (function(c){ var cb = c.querySelector('.gym-check-btn'); return cb ? cb.dataset.completado === '1' : false; })(card),
                                    rutaCoords: card.dataset.rutaCoords ? JSON.parse(card.dataset.rutaCoords) : null,
                                    rutaNombre: card.dataset.rutaNombre || '',
                                    rutaUrl:    card.dataset.rutaUrl || '',
                                    rutaCsv:    card.dataset.rutaCsv || ''
                                };
                            });
                        });
                        if (!hist[fechaDia]) hist[fechaDia] = {};
                        hist[fechaDia].cards = cardsDOM;
                    }
                    out = (hist[hoy] && hist[hoy].cards) ? hist[hoy].cards : {};
                }
                return out; // guardamos plano para compatibilidad
            })(),
            gymTiempoSesion: (function() {
                var _elInt2 = document.getElementById('gym-intervalo-label');
                var _off2 = _elInt2 ? parseInt(_elInt2.dataset.offset||0) : 0;
                var _fil2 = _elInt2 ? (_elInt2.dataset.filtro||'dia') : 'dia';
                var _hoy2 = _gymFechaKey(0);
                var _hist2 = window._gymSesionesHistorial || {};
                if (_fil2 !== 'dia' || _off2 !== 0) {
                    return (_hist2[_hoy2] && _hist2[_hoy2].tiempo) ? _hist2[_hoy2].tiempo : 0;
                }
                var el = document.getElementById('gym-stat-tiempo');
                return el ? parseInt(el.dataset.totalSecs || 0) : 0;
            })(),
            gymHidratacion: (function() {
                var _elInt3 = document.getElementById('gym-intervalo-label');
                var _off3 = _elInt3 ? parseInt(_elInt3.dataset.offset||0) : 0;
                var _fil3 = _elInt3 ? (_elInt3.dataset.filtro||'dia') : 'dia';
                var _hoy3 = _gymFechaKey(0);
                var _hist3 = window._gymSesionesHistorial || {};
                if (_fil3 !== 'dia' || _off3 !== 0) {
                    return (_hist3[_hoy3] && _hist3[_hoy3].hidratacion) ? _hist3[_hoy3].hidratacion : 0;
                }
                var el = document.getElementById('gym-stat-hidratacion');
                return el ? parseFloat(el.dataset.litros || 0) : 0;
            })(),
            gymReposo: (function() {
                var _elInt4 = document.getElementById('gym-intervalo-label');
                var _off4 = _elInt4 ? parseInt(_elInt4.dataset.offset||0) : 0;
                var _fil4 = _elInt4 ? (_elInt4.dataset.filtro||'dia') : 'dia';
                var _hoy4 = _gymFechaKey(0);
                var _hist4 = window._gymSesionesHistorial || {};
                if (_fil4 !== 'dia' || _off4 !== 0) {
                    return (_hist4[_hoy4] && _hist4[_hoy4].reposo) ? _hist4[_hoy4].reposo : 0;
                }
                var el = document.getElementById('gym-stat-reposo');
                return el ? parseInt(el.dataset.totalSecs || 0) : 0;
            })(),
            gymPesoUsuario: (function() {
                var el = document.getElementById('gym-peso-usuario');
                return el ? parseFloat(el.value || 0) : 0;
            })(),
            gymSesionesHistorial: window._gymSesionesHistorial || {},
            gymArchivados: (window._gymArchivados && !Array.isArray(window._gymArchivados)) ? window._gymArchivados : {}
        };
        console.log('Guardando icono principal:', {
            icono: datos.iconoPrincipal,
            imagen: datos.iconoPrincipalImagen ? 'SÍ (base64)' : 'NO'
        });
            return datos;
        }

        let _ultimosDatos = null;
        let _cargando = false; // Bloquea guardarDatos durante cargarDatos // Referencia para forzar guardado en beforeunload
        var _ultimoGuardadoForzadoTs = 0;
        async function guardarDatosAhora() {
            clearTimeout(saveTimeout);
            if (_cargando) return;
            document.querySelectorAll('#listaCuentas .cuenta-saldo-input').forEach(function(inp) {
                inp.dataset.saldoPrev = parseMoneyInput(inp.value) || 0;
            });
            try {
                const datos = _serializarDatos();
                if (_undoRestaurando) {
                    _undoRestaurando = false;
                } else if (_snapshotActual !== null) {
                    _undoPushDebounced();
                }
                _snapshotActual = datos;
                _ultimosDatos = datos;
                await guardarEnDB('seniorPlazAppData', datos);
                mostrarIndicadorGuardado();
            } catch (error) {}
        }
        var _undoSnapshots = [];          // pila de snapshots anteriores (undo)
        var _redoSnapshots = [];          // pila de snapshots para rehacer (redo)
        var _snapshotActual = null;       // estado que está actualmente guardado
        var _undoPushTimeout = null;      // debounce para ediciones de texto
        var _undoRestaurando = false;     // true mientras se restaura un undo
        var MAX_UNDO_SNAPSHOTS = 30;

        function _undoCapturarEstadoActual() {
            if (_snapshotActual === null) return;
            var clone;
            try { clone = JSON.parse(JSON.stringify(_snapshotActual)); } catch(e) { clone = _snapshotActual; }
            _undoSnapshots.push(clone);
            if (_undoSnapshots.length > MAX_UNDO_SNAPSHOTS) _undoSnapshots.shift();
            if (!_undoRestaurando) _redoSnapshots = [];
            _undoActualizarBtnSnapshots();
        }
        window._undoCapturarEstadoActual = _undoCapturarEstadoActual;
        window._undoGetSnapshotActual = function() { return _snapshotActual; };
        window._undoSetSnapshotActual = function(s) { _snapshotActual = s; };
        window._undoPopSnapshot = function() {
            if (_undoSnapshots.length > 0) _undoSnapshots.pop();
            _undoActualizarBtnSnapshots();
        };

        function _undoActualizarBtnSnapshots() {
            var tieneUndo = _undoSnapshots.length > 0 || (window._agendaUndoStack && window._agendaUndoStack.length > 0);
            var totalPasos = _undoSnapshots.length + (window._agendaUndoStack ? window._agendaUndoStack.length : 0);
            ['btnUndo','btnUndoMobile'].forEach(function(id) {
                var btn = document.getElementById(id);
                if (!btn) return;
                btn.disabled = !tieneUndo;
                btn.style.opacity = tieneUndo ? '1' : '0.4';
                btn.style.cursor  = tieneUndo ? 'pointer' : 'not-allowed';
                btn.title = tieneUndo
                    ? 'Deshacer (' + totalPasos + ' paso' + (totalPasos > 1 ? 's' : '') + ')'
                    : 'Sin acciones que deshacer';
            });
            var tieneRedo = _redoSnapshots.length > 0;
            ['btnRedo','btnRedoMobile'].forEach(function(id) {
                var btn = document.getElementById(id);
                if (!btn) return;
                btn.disabled = !tieneRedo;
                btn.style.opacity = tieneRedo ? '1' : '0.4';
                btn.style.cursor  = tieneRedo ? 'pointer' : 'not-allowed';
                btn.title = tieneRedo
                    ? 'Rehacer (' + _redoSnapshots.length + ' paso' + (_redoSnapshots.length > 1 ? 's' : '') + ')'
                    : 'Sin acciones que rehacer';
            });
        }
        function _undoPushInmediato() {
            if (_undoRestaurando) return; // no capturar durante restauración
            clearTimeout(_undoPushTimeout);
            _undoPushTimeout = null;
            _snapAntesDeEditar = null;
            _undoCapturarEstadoActual();
        }
        var _snapAntesDeEditar = null;

        function _undoPushDebounced() {
            if (_undoRestaurando) return; // no capturar durante restauración (preserva redo)
            if (_undoPushTimeout === null && _snapshotActual !== null) {
                _snapAntesDeEditar = _snapshotActual; // estado ANTES de empezar a teclear
            }
            clearTimeout(_undoPushTimeout);
            _undoPushTimeout = setTimeout(function() {
                _undoPushTimeout = null;
                if (_snapAntesDeEditar === null) return;
                var cloneDebounce;
                try { cloneDebounce = JSON.parse(JSON.stringify(_snapAntesDeEditar)); } catch(e) { cloneDebounce = _snapAntesDeEditar; }
                _undoSnapshots.push(cloneDebounce);
                if (_undoSnapshots.length > MAX_UNDO_SNAPSHOTS) _undoSnapshots.shift();
                _snapAntesDeEditar = null;
                _undoActualizarBtnSnapshots();
            }, 1500);
        }

        window.undoEstado = function() {
            var gymSnack = document.getElementById('_gymUndoSnack');
            if (gymSnack) { clearTimeout(gymSnack._timer); gymSnack.remove(); }
            if (typeof _agendaUndoRestore === 'function' && window._agendaUndoStack && window._agendaUndoStack.length > 0) {
                _agendaUndoRestore();
                return;
            }
            if (_undoSnapshots.length === 0) return;
            var snapshot = _undoSnapshots.pop();
            if (!snapshot) return;
            if (_snapshotActual !== null) _redoSnapshots.push(_snapshotActual);
            if (_redoSnapshots.length > MAX_UNDO_SNAPSHOTS) _redoSnapshots.shift();
            clearTimeout(_undoPushTimeout);
            _undoPushTimeout = null;
            _snapAntesDeEditar = null;
            _undoActualizarBtnSnapshots();
            try {
                _undoRestaurando = true;
                _snapshotActual = snapshot;
                _aplicarSnapshotDOM(snapshot);
                guardarEnDB('seniorPlazAppData', snapshot).catch(function(e) {
                }).finally(function() {
                    if (_undoRestaurando) _undoRestaurando = false;
                });
            } catch(e) {
                _undoRestaurando = false;
            }
        };

        window.redoEstado = function() {
            if (_redoSnapshots.length === 0) return;
            var snapshot = _redoSnapshots.pop();
            if (!snapshot) return;
            if (_snapshotActual !== null) _undoSnapshots.push(_snapshotActual);
            if (_undoSnapshots.length > MAX_UNDO_SNAPSHOTS) _undoSnapshots.shift();
            clearTimeout(_undoPushTimeout);
            _undoPushTimeout = null;
            _snapAntesDeEditar = null;
            _undoActualizarBtnSnapshots();
            try {
                _undoRestaurando = true;
                _snapshotActual = snapshot;
                _aplicarSnapshotDOM(snapshot);
                guardarEnDB('seniorPlazAppData', snapshot).catch(function(e) {
                }).finally(function() {
                    if (_undoRestaurando) _undoRestaurando = false;
                });
            } catch(e) {
                _undoRestaurando = false;
            }
        };
        function _aplicarSnapshotDOM(snapshot) {
            window._undoSnapshotPendiente = snapshot;
            cargarDatos(); // cargarDatos leerá _undoSnapshotPendiente en lugar de IndexedDB
        }

        window._limpiarHistorialUndo = function() {
            _undoSnapshots = [];
            _snapshotActual = null;
            _snapAntesDeEditar = null;
            clearTimeout(_undoPushTimeout);
            _undoPushTimeout = null;
            _undoActualizarBtnSnapshots();
        };

        function guardarDatos() {
            if (_cargando) return; // No guardar mientras se está cargando
            document.querySelectorAll('#listaCuentas .cuenta-saldo-input').forEach(function(inp) {
                inp.dataset.saldoPrev = parseMoneyInput(inp.value) || 0;
            });
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                const doSave = async () => {
                try {
                    const datos = _serializarDatos();
                    if (_undoRestaurando) {
                        _undoRestaurando = false;
                        _snapshotActual = datos;
                        _ultimosDatos = datos;
                        await guardarEnDB('seniorPlazAppData', datos);
                        mostrarIndicadorGuardado();
                        return;
                    }
                    if (_snapshotActual !== null) {
                        _undoPushDebounced();
                    }
                    _snapshotActual = datos;
                    _ultimosDatos = datos;
                    await guardarEnDB('seniorPlazAppData', datos);
                    mostrarIndicadorGuardado();
                } catch (error) {
                }
                };
                doSave();
            }, 180);
        }
        function _forzarGuardadoSalida() {
            if (_cargando) return;
            var ahora = Date.now();
            if ((ahora - _ultimoGuardadoForzadoTs) < 500) return;
            _ultimoGuardadoForzadoTs = ahora;
            guardarDatosAhora().catch(function() {});
        }
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) _forzarGuardadoSalida();
        });
        document.addEventListener('pause', _forzarGuardadoSalida);
        window.addEventListener('pagehide', _forzarGuardadoSalida);
        window.addEventListener('beforeunload', function() {
            clearTimeout(saveTimeout);
            if (!db) return;
            try {
                const datos = _serializarDatos();
                const tx = db.transaction([STORE_NAME], 'readwrite');
                tx.objectStore(STORE_NAME).put(datos, 'seniorPlazAppData');
            } catch(e) {}
        });

        async function cargarDatos() {
            _cargando = true; // Bloquear guardarDatos durante la carga
            ['listaIngresos','listaGastos','listaSimulaciones','listaCuentas','listaInversiones','listaPosiciones','listaDeudas','listaReformas','listaMobiliario'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.innerHTML = '';
            });
            document.querySelectorAll('.pdf-lista-bancos, .pdf-lista-banco').forEach(el => { el.innerHTML = ''; });
            let datos = null;
            try {
                if (window._undoSnapshotPendiente) {
                    datos = window._undoSnapshotPendiente;
                    window._undoSnapshotPendiente = null;
                } else {
                    try {
                        datos = await cargarDesdeDB('seniorPlazAppData');
                    } catch(e) {
                    }
                }
                if (!datos) {
                    _cargando = false;
                    setTimeout(function() {
                        try { _snapshotActual = _serializarDatos(); } catch(e) {}
                    }, 100);
                    return;
                }

                if (!datos) return;
                if (datos.reformas) {
                    datos.reformas.forEach(r => {
                        if (r.tipoReforma === 'mobiliario' && r.icono === 'chair') r.icono = 'weekend';
                    });
                }
                if (datos.archivados) {
                    Object.values(datos.archivados).forEach(lista => {
                        if (Array.isArray(lista)) lista.forEach(r => {
                            if (r.tipoReforma === 'mobiliario' && r.icono === 'chair') r.icono = 'weekend';
                        });
                    });
                }
                const listaCuentas = document.getElementById('listaCuentas');
                const listaInversiones = document.getElementById('listaInversiones');
                const listaIngresos = document.getElementById('listaIngresos');
                const listaGastos = document.getElementById('listaGastos');
                const listaReformas = document.getElementById('listaReformas');
                const listaSimulaciones = document.getElementById('listaSimulaciones');
                const listaMobiliarioInit = document.getElementById('listaMobiliario');
                
                if (listaCuentas) listaCuentas.innerHTML = '';
                if (listaInversiones) listaInversiones.innerHTML = '';
                if (listaIngresos) listaIngresos.innerHTML = '';
                if (listaGastos) listaGastos.innerHTML = '';
                if (listaReformas) listaReformas.innerHTML = '';
                if (listaSimulaciones) listaSimulaciones.innerHTML = '';
                if (listaMobiliarioInit) listaMobiliarioInit.innerHTML = '';
                setTimeout(() => { _syncEmptyStates && _syncEmptyStates(); }, 100);
                datos.cuentas?.forEach(cuenta => {
                    addRow('listaCuentas', cuenta.nombre, parseMoneyInput(String(cuenta.valor)), 'text-emerald-400', 'account_balance', 
                           _parseActivoPersistido(cuenta.activo), cuenta.icono, cuenta.colorIcono, cuenta.imagen);
                });
                datos.inversiones?.forEach(inv => {
                    addRow('listaInversiones', inv.nombre, parseMoneyInput(String(inv.valor)), 'text-blue-400', 'show_chart', 
                           _parseActivoPersistido(inv.activo), inv.icono, inv.colorIcono, inv.imagen);
                });
                const tituloApp = document.getElementById('tituloApp');
                const subtituloApp = document.getElementById('subtituloApp');
                if (tituloApp) tituloApp.value = 'seniorplazapp.';
                if (subtituloApp) subtituloApp.value = 'DASHBOARD PERSONAL';
                const iconoPrincipalContainer = document.getElementById('iconoPrincipalContainer');
                console.log('Cargando icono principal:', {
                    icono: datos.iconoPrincipal,
                    tieneImagen: !!datos.iconoPrincipalImagen,
                    imagenLength: datos.iconoPrincipalImagen ? datos.iconoPrincipalImagen.length : 0
                });
                
                if (iconoPrincipalContainer) {
                    if (datos.iconoPrincipalImagen) {
                        iconoPrincipalContainer.className = 'icon-container-principal p-3 rounded-2xl cursor-pointer transition-all duration-300 group relative';
                        iconoPrincipalContainer.style.background = 'transparent';
                        iconoPrincipalContainer.innerHTML = `
                            <img src="${datos.iconoPrincipalImagen}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 0.75rem;">
                            <div class="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span class="material-symbols-rounded text-white text-sm">edit</span>
                            </div>
                        `;
                        attachIconLongPress(iconoPrincipalContainer, function(el) {
                            abrirSelectorIconoPrincipal(el);
                        });
                    } else if (datos.iconoPrincipal) {
                        iconoPrincipalContainer.className = 'icon-container-principal relative p-3 rounded-2xl text-white cursor-pointer transition-all duration-300 group';
                        iconoPrincipalContainer.style.cssText = 'background: linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(29, 78, 216, 0.3) 50%, rgba(37, 99, 235, 0.4) 100%);  border: 1px solid rgba(59, 130, 246, 0.2); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);';
                        
                        const iconoSpan = iconoPrincipalContainer.querySelector('.material-symbols-rounded');
                        if (iconoSpan) {
                            iconoSpan.textContent = datos.iconoPrincipal;
                        }
                    }
                }
                const donMama = document.getElementById('donMama');
                const donPapa = document.getElementById('donPapa');
                
                if (datos.donaciones) {
                    if (donMama) { donMama.value = datos.donaciones.madre; formatDonInput(donMama); }
                    if (donPapa) { donPapa.value = datos.donaciones.padre; formatDonInput(donPapa); }
                }
                let nominaIndex = 0;
                let simpleIndex = 0;
                
                datos.ingresos?.forEach((ing, index) => {
                    if (ing.tipo === 'simple') {
                        addIngresoSimple(
                            ing.nombre || 'Ingreso',
                            parseMoneyInput(String(ing.cantidad || 0)),
                            ing.frecuencia || 'mensual',
                            ing.icono || 'euro',
                            ing.colorIcono || '#10b981',
                            ing.iconoImagen || ''
                        );
                        simpleIndex++;
                    } else {
                        addIngreso(
                            ing.nombre,
                            parseMoneyInput(String(ing.bruto || 0)),
                            '', '',
                            parseMoneyInput(String(ing.neto || 0)),
                            ing.iconoImagen || '',
                            ing.icono || '',
                            ing.colorIcono || ''
                        );
                        const currentNominaIndex = nominaIndex;
                        nominaIndex++;
                        setTimeout(() => {
                            const allNominaCards = document.querySelectorAll('#listaIngresos .card-input-group[data-tipo="nomina"]');
                            const targetCard = allNominaCards[currentNominaIndex];
                            if (targetCard) {
                                const pdfs = ing.pdfNominas || (ing.pdfNomina ? [{nombre:'nomina.pdf', data:ing.pdfNomina}] : []);
                                if (pdfs.length) {
                                    const lista = targetCard.querySelector('.pdf-lista');
                                    if (lista) pdfs.forEach(p => _renderPdfRow(lista, p.nombre, _obtenerFuentePdfDesdeRegistro(p)));
                                }
                                const iconContainer = targetCard.querySelector('.icon-container');
                                if (iconContainer) attachIconLongPress(iconContainer, function(el) { abrirSelectorIconos(el); });
                            }
                        }, 50 + (index * 30));
                    }
                });
                datos.gastos?.forEach((gasto, index) => {
                    addGasto(
                        gasto.nombre, 
                        parseMoneyInput(String(gasto.cantidad)), 
                        gasto.frecuencia || 'mensual',
                        gasto.icono || 'euro',
                        gasto.colorIcono || '#ef4444',
                        gasto.iconoImagen || ''
                    );
                });
                if (datos.hipoteca) {
                    if (document.getElementById('precioCasa')) {
                        const elPrecio = document.getElementById('precioCasa'); if(elPrecio){ elPrecio.value = datos.hipoteca.precioCasa || 0; formatDonInput(elPrecio); }
                    }
                    if (document.getElementById('percEntrada')) {
                        document.getElementById('percEntrada').value = datos.hipoteca.percEntrada || 20;
                    }
                    if (document.getElementById('percITP')) {
                        document.getElementById('percITP').value = datos.hipoteca.percITP || 10;
                    }
                    if (document.getElementById('gastoNotaria')) {
                        document.getElementById('gastoNotaria').value = datos.hipoteca.gastoNotaria || 2500;
                    }
                }
                datos.simulaciones?.forEach(sim => {
                    addSimulacion(sim.banco, parseFloat(sim.tin), parseFloat(sim.tae), parseFloat(sim.cuota), sim.bonos || {}, sim.seleccionada || false, sim.icono || '', sim.iconoImagen || '', sim.colorFondo || '', sim.pdf || sim.pdfData || null);
                    if (sim.plazo) {
                        setTimeout(() => {
                            const lastCard = document.querySelector('.simulacion-card:last-child');
                            if (lastCard) {
                                lastCard.querySelector('.plazo-input').value = sim.plazo;
                            }
                        }, 50);
                    }
                });
                setTimeout(() => {
                    updateInfoSimulacionSeleccionada();
                }, 100);
                const listaMobiliario = document.getElementById('listaMobiliario');
                if (listaMobiliario) listaMobiliario.innerHTML = '';
                
                datos.reformas?.forEach(reforma => {
                    const tipo = reforma.tipoReforma === 'mobiliario' ? 'mobiliario' : 'reforma';
                    addReformaCompletaCargada(
                        tipo, 
                        reforma.nombre, 
                        reforma.valor, 
                        reforma.notas || '', 
                        reforma.url || '',
                        reforma.imagenes || (reforma.imagen ? [reforma.imagen] : []), 
                        (reforma.icono === 'chair' ? 'weekend' : reforma.icono) || '', 
                        reforma.colorIcono || '',
                        reforma.iconoImagen || '',
                        reforma.liked || false,
                        reforma.miniatura || ''
                    );
                });
                if (datos.archivados) {
                    Object.entries(datos.archivados).forEach(([listaId, items]) => {
                        if (!items || items.length === 0) return;
                        _archivados[listaId] = []; // limpiar siempre antes de cargar para evitar duplicados
                        items.forEach(item => {
                            try {
                                let cardNode = null;
                                if (item.tipo === 'simulacion') {
                                    addSimulacion(item.banco, parseFloat(item.tin), parseFloat(item.tae), parseFloat(item.cuota), item.bonos || {}, false, item.icono || '', item.iconoImagen || '', item.colorFondo || '', item.pdf || item.pdfData || null);
                                    const lista = document.getElementById('listaSimulaciones');
                                    if (lista && lista.lastElementChild) {
                                        cardNode = lista.lastElementChild;
                                        lista.removeChild(cardNode);
                                    }
                                } else if (item.tipo === 'reforma') {
                                    const tipo = item.tipoReforma === 'mobiliario' ? 'mobiliario' : 'reforma';
                                    const tempDiv = crearPreviewCard(tipo, item.nombre, item.valor, item.notas || '', item.url || '', item.imagenes || [], item.icono || '', item.colorIcono || '', item.iconoImagen || '', item.miniatura || '');
                                    crearInputsOcultos(tempDiv, tipo, item.nombre, item.valor, item.notas || '', item.url || '', item.imagenes || []);
                                    if (item.liked === true) {
                                        tempDiv.dataset.liked = 'true';
                                        const likeBtn = tempDiv.querySelector('.like-btn');
                                        const icon = likeBtn?.querySelector('.material-symbols-rounded');
                                        const ghostHeart = tempDiv.querySelector('.card-ghost-heart');
                                        const isReforma = tipo === 'reforma';
                                        const accentColor = '#dc2626';
                                        
                                        if (icon) {
                                            icon.style.fontVariationSettings = "'FILL' 1";
                                        }
                                        if (likeBtn) {
                                            likeBtn.style.color = 'white';
                                            likeBtn.style.borderColor = 'rgba(255,255,255,0.5)';
                                            likeBtn.style.background = 'rgba(255,255,255,0.15)';
                                            likeBtn.classList.add('liked');
                                        }
                                        if (ghostHeart) {
                                            ghostHeart.style.display = 'flex';
                                        }
                                    }
                                    
                                    cardNode = tempDiv;
                                } else if (item.tipo === 'ingreso-simple') {
                                    const frecuencia = item.frecuencia || 'mensual';
                                    const cantidad = parseMoneyInput(String(item.cantidad || 0));
                                    const icono = item.icono || 'euro';
                                    const colorIcono = item.colorIcono || '#10b981';
                                    const div = document.createElement('div');
                                    div.className = "card-input-group animate-in slide-in-from-top-4 duration-500";
                                    div.dataset.tipo = "simple";
                                    div.dataset.frecuencia = frecuencia;
                                    const simbolo = obtenerSimboloFrecuencia(frecuencia);
                                    const iconoHTML = item.iconoImagen
                                        ? `<img src="${item.iconoImagen}" class="w-full h-full object-cover rounded-xl">`
                                        : `<span class="material-symbols-rounded" style="color:${colorIcono}" data-longpress-icon>${icono}</span>`;
                                    div.innerHTML = `<div class="space-y-3">
                                        <div class="flex items-center gap-3">
                                            <div class="drag-handle cursor-grab p-2 -ml-2 text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0"><span class="material-symbols-rounded">drag_indicator</span></div>
                                            <div class="icon-container w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 cursor-pointer hover:bg-blue-500/20 transition-all flex-shrink-0 relative group" data-tipo="${item.iconoImagen ? 'imagen' : 'icono'}">${iconoHTML}</div>
                                            <input type="text" value="${item.nombre || 'Ingreso'}" class="font-bold text-white text-sm focus:text-blue-400 transition-colors flex-1 bg-transparent min-w-0">
                                            <div class="flex items-center gap-2 flex-shrink-0">
                                                <button class="btn-menu-card" onclick="toggleFrecuenciaMenuIngreso(this)"><span class="material-symbols-rounded">schedule</span></button>
                                                <div class="btn-menu-card-wrapper"><button class="btn-menu-card" onclick="toggleCardMenu(this)"><span class="material-symbols-rounded">more_vert</span></button><div class="card-menu-dropdown"><button onclick="archivarCard(this)"><span class="material-symbols-rounded">archive</span>Archivar</button><button class="danger" onclick="eliminarCard(this, calculateIngresos)"><span class="material-symbols-rounded">delete</span>Eliminar</button></div></div>
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-center bg-slate-800/50 rounded-lg ingreso-cantidad-row" style="height:30px;">
                                            <input type="text" inputmode="decimal" value="${cantidad ? fmt(cantidad) : ''}" readonly onclick="_abrirModalCantidad(this)" oninput="fmtMoneyInput(this);updateIngresoSimple(this);calculateIngresos()" class="ingreso-simple-neto font-mono text-white font-bold text-center bg-transparent text-sm" style="width:110px;cursor:pointer;caret-color:transparent;">
                                            <span class="frecuencia-simbolo text-white font-bold whitespace-nowrap text-xs ml-1">${simbolo}</span>
                                        </div>
                                    </div>`;
                                    if (item.iconoImagen) {
                                        div.dataset.iconoImagen = item.iconoImagen;
                                        div.dataset.icono = '';
                                    } else {
                                        div.dataset.icono = icono;
                                        div.dataset.colorIcono = colorIcono;
                                        div.dataset.iconoImagen = '';
                                    }
                                    cardNode = div;
                                } else if (item.tipo === 'ingreso-nomina') {
                                    addIngreso(
                                        item.nombre || 'Nómina',
                                        parseMoneyInput(String(item.bruto || 0)),
                                        '', '',
                                        parseMoneyInput(String(item.neto || 0)),
                                        item.iconoImagen || '',
                                        item.icono || '',
                                        item.colorIcono || ''
                                    );
                                    const lista = document.getElementById('listaIngresos');
                                    if (lista && lista.lastElementChild) {
                                        cardNode = lista.lastElementChild;
                                        lista.removeChild(cardNode);
                                        const pdfsArch = item.pdfNominas || (item.pdfNomina ? [{nombre:'nomina.pdf', data:item.pdfNomina}] : []);
                                        if (pdfsArch.length) {
                                            const listaArch = cardNode.querySelector('.pdf-lista');
                                            if (listaArch) pdfsArch.forEach(p => _renderPdfRow(listaArch, p.nombre, _obtenerFuentePdfDesdeRegistro(p)));
                                        }
                                    }
                                } else if (item.tipo === 'gasto') {
                                    const frecuencia = item.frecuencia || 'mensual';
                                    const cantidad = parseMoneyInput(String(item.cantidad || 0));
                                    const icono = item.icono || 'euro';
                                    const colorIcono = item.colorIcono || '#ef4444';
                                    const simbolo = obtenerSimboloFrecuencia(frecuencia);
                                    const div = document.createElement('div');
                                    div.className = "card-input-group animate-in slide-in-from-top-4 duration-500";
                                    div.dataset.frecuencia = frecuencia;
                                    const iconoHTML = item.iconoImagen
                                        ? `<img src="${item.iconoImagen}" class="w-full h-full object-cover rounded-xl">`
                                        : `<span class="material-symbols-rounded" style="color:${colorIcono}" data-longpress-icon>${icono}</span>`;
                                    div.innerHTML = `<div class="space-y-3">
                                        <div class="flex items-center gap-3">
                                            <div class="drag-handle cursor-grab p-2 -ml-2 text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0"><span class="material-symbols-rounded">drag_indicator</span></div>
                                            <div class="icon-container w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 cursor-pointer hover:bg-rose-500/20 transition-all flex-shrink-0 relative group" data-tipo="${item.iconoImagen ? 'imagen' : 'icono'}">${iconoHTML}</div>
                                            <input type="text" value="${item.nombre || 'Gasto'}" class="font-bold text-white text-sm focus:text-rose-400 transition-colors flex-1 bg-transparent min-w-0">
                                            <div class="flex items-center gap-2 flex-shrink-0">
                                                <button class="btn-menu-card" onclick="toggleFrecuenciaMenu(this)">
                                                    <span class="material-symbols-rounded">schedule</span>
                                                </button>
                                                <div class="btn-menu-card-wrapper"><button class="btn-menu-card" onclick="toggleCardMenu(this)"><span class="material-symbols-rounded">more_vert</span></button></div>
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-center bg-slate-800/50 rounded-lg" style="height:30px;">
                                            <input type="text" inputmode="decimal" value="${cantidad ? fmt(cantidad) : ''}" readonly onclick="_abrirModalCantidad(this)" oninput="fmtMoneyInput(this);calculateGastos();guardarDatos();" class="gasto-cantidad font-mono text-rose-400 font-bold text-center bg-transparent text-sm" style="width:80px;cursor:pointer;caret-color:transparent;">
                                            <span class="gasto-simbolo text-rose-400 font-bold whitespace-nowrap text-xs ml-1">${simbolo}</span>
                                        </div>
                                    </div>`;
                                    if (item.iconoImagen) {
                                        div.dataset.iconoImagen = item.iconoImagen;
                                        div.dataset.icono = '';
                                    } else {
                                        div.dataset.icono = icono;
                                        div.dataset.colorIcono = colorIcono;
                                        div.dataset.iconoImagen = '';
                                    }
                                    cardNode = div;
                                } else if (item.tipo === 'cuenta') {
                                    addRow('listaCuentas', item.nombre, parseMoneyInput(String(item.valor || 0)), 'text-emerald-400', item.icono || 'account_balance', _parseActivoPersistido(item.activo), item.icono, item.colorIcono, item.imagen || null);
                                    const lista = document.getElementById('listaCuentas');
                                    if (lista && lista.lastElementChild) {
                                        cardNode = lista.lastElementChild;
                                        lista.removeChild(cardNode);
                                    }
                                } else if (item.tipo === 'inversion') {
                                    addRow('listaInversiones', item.nombre, parseMoneyInput(String(item.valor || 0)), 'text-blue-400', item.icono || 'show_chart', _parseActivoPersistido(item.activo), item.icono, item.colorIcono, item.imagen || null);
                                    const lista = document.getElementById('listaInversiones');
                                    if (lista && lista.lastElementChild) {
                                        cardNode = lista.lastElementChild;
                                        lista.removeChild(cardNode);
                                    }
                                }
                                if (cardNode) {
                                    if (item.archivedPosition !== undefined) cardNode._archivedPosition = item.archivedPosition;
                                    _archivados[listaId].push(cardNode);
                                }
                            } catch(e) {
                            }
                        });
                    });
                }
                if (datos.vivienda) {
                    if (datos.vivienda.plano) {
                        const planoImg = document.getElementById('planoImagen');
                        const planoPlaceholder = document.getElementById('planoPlaceholder');
                        if (planoImg && planoPlaceholder) {
                            planoImg.src = datos.vivienda.plano;
                            planoImg.style.display = 'block';
                            planoPlaceholder.style.display = 'none';
                        }
                    }
                    if (datos.vivienda.iconoPlano) {
                        const iconoPlano = document.getElementById('iconoPlano');
                        if (iconoPlano) {
                            iconoPlano.textContent = datos.vivienda.iconoPlano;
                        }
                    }
                    if (datos.vivienda.rooms360 && Array.isArray(datos.vivienda.rooms360) && datos.vivienda.rooms360.length > 0) {
                        window.rooms360 = datos.vivienda.rooms360.map(room => ({
                            texture: null, // Se recreará cuando se inicialice el visor
                            textureData: room.textureData,
                            name: room.name || 'Sin foto',
                            lon: room.lon || 0,
                            lat: room.lat || 0
                        }));
                        window.currentRoomIndex = 0;
                        window.needsVisor360Init = true;
                    }
                }
                if (datos.catastro) {
                    const refCatastral = document.getElementById('refCatastral');
                    const catLocalizacion = document.getElementById('catLocalizacion');
                    const catClase = document.getElementById('catClase');
                    const catUso = document.getElementById('catUso');
                    const catSuperficie = document.getElementById('catSuperficie');
                    const catAnio = document.getElementById('catAnio');
                    const catParcelaLoc = document.getElementById('catParcelaLoc');
                    const catSuperficieParcela = document.getElementById('catSuperficieParcela');
                    const catParticipacion = document.getElementById('catParticipacion');
                    const catValor = document.getElementById('catValor');
                    
                    if (refCatastral) refCatastral.value = datos.catastro.referencia || '';
                    if (catLocalizacion) catLocalizacion.value = datos.catastro.localizacion || '';
                    if (catClase) catClase.value = datos.catastro.clase || 'Urbano';
                    if (catUso) catUso.value = datos.catastro.uso || 'Residencial';
                    if (catSuperficie) catSuperficie.value = datos.catastro.superficie || 0;
                    if (catAnio) catAnio.value = datos.catastro.anio || 0;
                    if (catParcelaLoc) catParcelaLoc.value = datos.catastro.parcelaLoc || '';
                    if (catSuperficieParcela) catSuperficieParcela.value = datos.catastro.superficieParcela || 0;
                    if (catParticipacion) catParticipacion.value = datos.catastro.participacion || 100;
                    if (catValor) {
                        const valorNumerico = datos.catastro.valor || 0;
                        const partes = valorNumerico.toString().split('.');
                        const parteEntera = parseInt(partes[0] || '0', 10);
                        const parteDecimal = partes[1] ? ',' + partes[1].slice(0, 2) : '';
                        catValor.value = parteEntera.toLocaleString('es-ES') + parteDecimal;
                    }
                    if (datos.catastro.fotoVivienda) {
                        const imgVivienda = document.getElementById('imagenVivienda');
                        const previewVivienda = document.getElementById('previewFotoVivienda');
                        if (imgVivienda && previewVivienda) {
                            imgVivienda.src = datos.catastro.fotoVivienda;
                            previewVivienda.style.display = 'block';
                        }
                    }
                }
                if (datos.iconosTitulos) {
                    restaurarIconosTitulos(datos.iconosTitulos);
                }
                if (datos.vidaLaboral && typeof _VL !== 'undefined') {
                    _VL.state.activas = datos.vidaLaboral.activas || { 0: true };
                    _VL.state.miniaturas = datos.vidaLaboral.miniaturas || {};
                    renderVidaLaboral();
                }
                if (datos.finanzasData) {
                    if (!window.finanzasData) window.finanzasData = { categorias: [], operaciones: [], programados: [] };
                    if (Array.isArray(datos.finanzasData.operaciones)) window.finanzasData.operaciones = datos.finanzasData.operaciones;
                    if (Array.isArray(datos.finanzasData.categorias)) window.finanzasData.categorias = datos.finanzasData.categorias;
                    if (Array.isArray(datos.finanzasData.programados)) window.finanzasData.programados = datos.finanzasData.programados;
                    if (!Array.isArray(window.finanzasData.programados)) window.finanzasData.programados = [];
                }
                if (datos.nutricionData) {
                    if (!window.nutricionData) window.nutricionData = { comidas: [], registrosPeso: [], objetivos: { kcal: 2000, prot: 100, carbs: 250, grasas: 65 } };
                    if (Array.isArray(datos.nutricionData.comidas)) window.nutricionData.comidas = datos.nutricionData.comidas;
                    if (Array.isArray(datos.nutricionData.registrosPeso)) window.nutricionData.registrosPeso = datos.nutricionData.registrosPeso;
                    if (datos.nutricionData.objetivos) window.nutricionData.objetivos = datos.nutricionData.objetivos;
                    if (typeof renderNutricion === 'function') renderNutricion();
                    if (typeof _nutriActualizarBadge === 'function') _nutriActualizarBadge();
                }
                if (datos.agendaData) {
                    if (!window.agendaData) window.agendaData = { habitos: [], tareasRecurrentes: [], tareas: [] };
                    if (Array.isArray(datos.agendaData.habitos)) window.agendaData.habitos = datos.agendaData.habitos;
                    if (Array.isArray(datos.agendaData.tareasRecurrentes)) window.agendaData.tareasRecurrentes = datos.agendaData.tareasRecurrentes;
                    if (Array.isArray(datos.agendaData.tareas)) window.agendaData.tareas = datos.agendaData.tareas;
                    setTimeout(function() {
                        try { if (typeof renderDiario === 'function') renderDiario(); } catch(e) {}
                        try { if (typeof renderHabitosSection === 'function') renderHabitosSection(); } catch(e) {}
                        try { if (typeof renderTareasSection === 'function') renderTareasSection(); } catch(e) {}
                    }, 150);
                }
                if (datos.gymSesionesHistorial) {
                    window._gymSesionesHistorial = datos.gymSesionesHistorial;
                    window._gymSesionesHistorialRestaurado = true;
                }
                if (datos.gymCards || datos.gymSesionesHistorial) {
                    var hoy = _gymFechaKey(0);
                    if (!window._gymSesionesHistorial) window._gymSesionesHistorial = {};
                    if (!datos.gymSesionesHistorial && datos.gymCards) {
                        if (!window._gymSesionesHistorial[hoy]) window._gymSesionesHistorial[hoy] = {};
                        window._gymSesionesHistorial[hoy].cards = datos.gymCards;
                    }
                    // Only load cards for today if they actually exist in the historial for today
                    var cardsHoy = (window._gymSesionesHistorial[hoy] && window._gymSesionesHistorial[hoy].cards)
                        ? window._gymSesionesHistorial[hoy].cards
                        : null; // Don't use fallback to avoid loading wrong day's exercises

                    ['pecho','espalda','brazo','pierna','cardio'].forEach(function(p) {
                        var panel = document.getElementById('gym-panel-' + p);
                        if (!panel) return;
                        panel.innerHTML = '';
                        var cards = cardsHoy ? (cardsHoy[p] || []) : [];
                        if (cards.length === 0) return;
                        var grid = document.createElement('div');
                        grid.className = 'gym-panel-grid';
                        panel.appendChild(grid);
                        cards.forEach(function(e) {
                            if (typeof _crearGymCardHTML === 'function') {
                                var cardHTML = '<div class="gym-card" style="background:rgba(15,23,42,0.7);border:2px solid rgba(234,179,8,0.2);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;">' + _crearGymCardHTML(e) + '</div>';
                                grid.insertAdjacentHTML('beforeend', cardHTML);
                                var newCard = grid.lastElementChild;
                                if (newCard && (_gymObjetoTieneMetricasCardio(e) || p === 'cardio') && typeof _gymAsignarMetricasCardioEnCard === 'function') _gymAsignarMetricasCardioEnCard(newCard, e);
                                if (newCard && typeof _gymAplicarModoCardioEnCard === 'function') _gymAplicarModoCardioEnCard(newCard);
                                if (e.cardTimeSecs && e.cardTimeSecs > 0) {
                                    var badge = newCard.querySelector('.gym-card-time-badge');
                                    var label = newCard.querySelector('.gym-card-time-label');
                                    if (badge && label) {
                                        badge.dataset.totalSecs = e.cardTimeSecs;
                                        var h = Math.floor(e.cardTimeSecs / 3600);
                                        var m = Math.floor((e.cardTimeSecs % 3600) / 60);
                                        var s = e.cardTimeSecs % 60;
                                        label.textContent = h > 0 ? h + 'h ' + String(m).padStart(2,'0') + 'm' : String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
                                        badge.style.display = 'flex'; badge.removeAttribute('data-hidden');
                                    }
                                }
                                if (e.rutaCoords && Array.isArray(e.rutaCoords) && e.rutaCoords.length >= 2) {
                                    newCard.dataset.rutaCoords = JSON.stringify(e.rutaCoords);
                                    if (e.rutaNombre) newCard.dataset.rutaNombre = e.rutaNombre;
                                    if (e.rutaUrl) newCard.dataset.rutaUrl = e.rutaUrl;
                                    if (e.rutaCsv) newCard.dataset.rutaCsv = e.rutaCsv;
                                }
                            }
                        });
                        if (typeof _initGymSortable === 'function') _initGymSortable(grid);
                    });
                    if (typeof _initAllGymCards === 'function') _initAllGymCards();
                }
                // LOAD STATS ONLY FOR TODAY FROM HISTORIAL (not from datos fallback which could be stale)
                var hoyStats = window._gymSesionesHistorial && window._gymSesionesHistorial[_gymFechaKey(0)];
                if (hoyStats) {
                    if (hoyStats.tiempo && hoyStats.tiempo > 0) {
                        var statEl = document.getElementById('gym-stat-tiempo');
                        if (statEl) {
                            var ts = hoyStats.tiempo;
                            statEl.dataset.totalSecs = ts;
                            var h = Math.floor(ts / 3600);
                            var m = Math.floor((ts % 3600) / 60);
                            var s = ts % 60;
                            statEl.textContent = h > 0 ? h + 'h ' + String(m).padStart(2,'0') + 'm' : String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
                        }
                    }
                    if (hoyStats.hidratacion) {
                        var hidEl = document.getElementById('gym-stat-hidratacion');
                        if (hidEl) { hidEl.dataset.litros = hoyStats.hidratacion; hidEl.textContent = parseFloat(hoyStats.hidratacion).toFixed(1).replace(',','.'); }
                    }
                    if (hoyStats.reposo && hoyStats.reposo > 0) {
                        var repEl = document.getElementById('gym-stat-reposo');
                        if (repEl) {
                            var rs = hoyStats.reposo;
                            repEl.dataset.totalSecs = rs;
                            var rh = Math.floor(rs / 3600), rm = Math.floor((rs % 3600) / 60), rsec = rs % 60;
                            repEl.textContent = rh > 0 ? rh + 'h ' + String(rm).padStart(2,'0') + 'm' : String(rm).padStart(2,'0') + ':' + String(rsec).padStart(2,'0');
                        }
                    }
                    if (hoyStats.calorias && hoyStats.calorias !== '—') {
                        var calEl = document.getElementById('gym-stat-calorias');
                        if (calEl) calEl.textContent = hoyStats.calorias;
                    }
                } else if (datos.gymTiempoSesion && datos.gymTiempoSesion > 0) {
                    // Fallback to datos only if no historial exists for today
                    var statEl = document.getElementById('gym-stat-tiempo');
                    if (statEl) {
                        var ts = datos.gymTiempoSesion;
                        statEl.dataset.totalSecs = ts;
                        var h = Math.floor(ts / 3600);
                        var m = Math.floor((ts % 3600) / 60);
                        var s = ts % 60;
                        statEl.textContent = h > 0 ? h + 'h ' + String(m).padStart(2,'0') + 'm' : String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
                    }
                }
                if (!hoyStats && datos.gymHidratacion) {
                    var hidEl = document.getElementById('gym-stat-hidratacion');
                    if (hidEl) { hidEl.dataset.litros = datos.gymHidratacion; hidEl.textContent = parseFloat(datos.gymHidratacion).toFixed(1).replace(',','.'); }
                }
                if (!hoyStats && datos.gymReposo && datos.gymReposo > 0) {
                    var repEl = document.getElementById('gym-stat-reposo');
                    if (repEl) {
                        var rs = datos.gymReposo;
                        repEl.dataset.totalSecs = rs;
                        var rh = Math.floor(rs / 3600), rm = Math.floor((rs % 3600) / 60), rsec = rs % 60;
                        repEl.textContent = rh > 0 ? rh + 'h ' + String(rm).padStart(2,'0') + 'm' : String(rm).padStart(2,'0') + ':' + String(rsec).padStart(2,'0');
                    }
                }
                if (datos.gymPesoUsuario && datos.gymPesoUsuario > 0) {
                    var pesoEl = document.getElementById('gym-peso-usuario');
                    if (pesoEl) { pesoEl.value = datos.gymPesoUsuario; }
                } else {
                    // Si no hay peso gym guardado, usar el último de nutrición
                    var registros = window.nutricionData?.registrosPeso;
                    if (registros && registros.length > 0) {
                        var ultimo = registros[registros.length - 1].peso;
                        var pesoEl2 = document.getElementById('gym-peso-usuario');
                        if (pesoEl2 && ultimo > 0) pesoEl2.value = ultimo;
                    }
                }
                if (datos.gymSesionesHistorial && !window._gymSesionesHistorialRestaurado) {
                    window._gymSesionesHistorial = datos.gymSesionesHistorial;
                }
                window._gymSesionesHistorialRestaurado = false;
                if (typeof gymCargarStatsParaIntervalo === 'function') {
                    setTimeout(gymCargarStatsParaIntervalo, 100);
                } else if (typeof gymRecalcularCalorias === 'function') {
                    gymRecalcularCalorias();
                }
                if (datos.gymArchivados && typeof datos.gymArchivados === 'object' && !Array.isArray(datos.gymArchivados)) {
                    window._gymArchivados = datos.gymArchivados;
                    if (typeof _actualizarBadgeGym === 'function') _actualizarBadgeGym();
                }
                if (datos.docsBancos && datos.docsBancos.length) {
                    const listaBancos = document.querySelector('.pdf-lista-bancos');
                    if (listaBancos) datos.docsBancos.forEach(p => _renderPdfRow(listaBancos, p.nombre, _obtenerFuentePdfDesdeRegistro(p)));
                }
                
                calculate();
                calculateIngresos();
                calculateGastos();
                migrarDropdownsCuentas();
                actualizarBadgesArchivo(); // Actualizar badges tras cargar datos
                document.querySelectorAll('.icon-container, .icon-container-principal, .icon-container-banco').forEach(ic => { if (ic.id !== 'iconoPrincipalContainer') aplicarLongPressIcono(ic); });
                ['listaReformas','listaMobiliario'].forEach(id => {
                    const c = document.getElementById(id);
                    if (c) actualizarZindexCards(c);
                });
                
            } catch (error) {
            } finally {
                _cargando = false; // Reactivar guardarDatos
                let _tabToRestore = (datos && datos.activeTab) || (function(){ try { return sessionStorage.getItem('_lastTab'); } catch(e){ return null; } })();
                if (_tabToRestore === 'patrimonio') _tabToRestore = 'mis-activos';
                if (_tabToRestore && document.getElementById(_tabToRestore)) {
                    window._restoringTab = true;
                    const _ws = document.getElementById('welcome-screen');
                    const _ma = document.getElementById('main-app');
                    const _mn = document.querySelector('nav');
                    const _mb = document.getElementById('mobileBottomNav');
                    if (_ws) { _ws.style.display = 'none'; _ws.classList.remove('visible'); }
                    if (_ma) { _ma.style.display = 'block'; _ma.style.opacity = '1'; }
                    if (_mn) { _mn.style.display = 'block'; }
                    if (_mb) { _mb.style.display = window.innerWidth <= 768 ? 'block' : 'none'; }
                    showTab(_tabToRestore, null);
                    if (_ma) _ma.style.opacity = '1';
                    window._restoringTab = false;
                }
                setTimeout(function() {
                    try {
                        if (_snapshotActual === null && typeof _serializarDatos === 'function') {
                            _snapshotActual = _serializarDatos();
                            _undoActualizarBtnSnapshots();
                        }
                    } catch(e) {}
                }, 50);
                setTimeout(function() {
                    try {
                        if (typeof cargarFinanzasData === 'function') cargarFinanzasData(); // migración localStorage→IndexedDB si procede
                        const tipoActivo = window._catTipoActivo || 'ALL';
                        if (typeof filtrarCategorias === 'function') filtrarCategorias(tipoActivo);
                        if (typeof catSwitchTipo === 'function') {
                            catSwitchTipo(null, tipoActivo, 'nueva');
                            catSwitchTipo(null, tipoActivo, 'editar');
                        }
                    } catch(e) {}
                }, 100);
            }
        }
        window._vistaReformaActiva = 'reforma';
        function _gymEmptyState(panel) {
            var empty = '<div class="gym-empty-state" style="background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:40px;text-align:center;"><span class="material-symbols-rounded" style="font-size:48px;color:#334155;display:block;margin-bottom:12px;">exercise</span><p style="color:#475569;font-size:14px;margin:0;">Registra tu primer ejercicio</p></div>';
            var hasCards = panel.querySelectorAll('.gym-card').length > 0;
            var existing = panel.querySelector('.gym-empty-state');
            if (!hasCards && !existing) panel.insertAdjacentHTML('beforeend', empty);
            if (hasCards && existing) existing.remove();
        }

        function cambiarVistaGym(vista) {
            window._vistaGymActiva = vista;
            if (typeof _actualizarBadgeGym === 'function') _actualizarBadgeGym();
            var _hidraLock = (function() {
                var el = document.getElementById('gym-stat-hidratacion');
                if (!el) return null;
                return {
                    litros: (el.dataset.litros || '0'),
                    text: (el.textContent || '0.0')
                };
            })();
            var paneles = ['pecho','espalda','brazo','pierna','cardio'];
            paneles.forEach(function(p) {
                var panel = document.getElementById('gym-panel-' + p);
                var btn   = document.getElementById('tab-gym-' + p);
                if (!panel || !btn) return;
                var activo = (p === vista);
                panel.style.display = activo ? '' : 'none';
                if (activo) {
                    btn.style.background  = 'linear-gradient(135deg,rgba(113,63,18,0.8) 0%,rgba(161,98,7,0.7) 50%,rgba(202,138,4,0.8) 100%)';
                    btn.style.boxShadow   = '0 0 20px rgba(234,179,8,0.4)';
                    btn.style.border      = '1px solid rgba(234,179,8,0.4)';
                    btn.style.color       = 'white';
                    _gymEmptyState(panel);
                } else {
                    btn.style.background  = 'transparent';
                    btn.style.boxShadow   = 'none';
                    btn.style.border      = '1px solid transparent';
                    btn.style.color       = '#64748b';
                }
            });
            setTimeout(function(){
                _initAllGymCards();
                _gymAplicarFiltrosActivos();
                // SYNC VISUAL STATE WITH STORED DATA
                var el_intervalo = document.getElementById('gym-intervalo-label');
                var offset = el_intervalo ? parseInt(el_intervalo.dataset.offset || 0) : 0;
                var fechaKey = _gymFechaKey(offset);
                if (window._gymSesionesHistorial && window._gymSesionesHistorial[fechaKey] && 
                    window._gymSesionesHistorial[fechaKey].cards && 
                    window._gymSesionesHistorial[fechaKey].cards[vista]) {
                    // Update all visible cards with stored completado state
                    var cardsInVista = window._gymSesionesHistorial[fechaKey].cards[vista];
                    var vistaPanel = document.getElementById('gym-panel-' + vista);
                    if (vistaPanel) {
                        vistaPanel.querySelectorAll('.gym-check-btn').forEach(function(btn, idx) {
                            if (cardsInVista[idx]) {
                                var shouldBeCompleted = cardsInVista[idx].completado === true || cardsInVista[idx].completado === '1';
                                btn.dataset.completado = shouldBeCompleted ? '1' : '0';
                                var icon = btn.querySelector('.material-symbols-rounded');
                                if (shouldBeCompleted) {
                                    btn.style.background = '#10b981';
                                    btn.style.border = '2px solid #10b981';
                                    if (icon) { icon.textContent = 'check'; icon.style.color = 'white'; icon.style.fontWeight = '700'; }
                                } else {
                                    btn.style.background = 'transparent';
                                    btn.style.border = '2px solid #334155';
                                    if (icon) { icon.textContent = 'check'; icon.style.color = '#475569'; icon.style.fontWeight = ''; }
                                }
                                var card = btn.closest('.gym-card');
                                if (card && typeof _gymSetCardLocked === 'function') _gymSetCardLocked(card, shouldBeCompleted);
                            }
                        });
                    }
                }
                if(typeof initTooltips==='function') initTooltips();
                // UPDATE COUNTER FOR CURRENT DAY (all categories combined)
                _gymActualizarStatEjercicios(fechaKey);
                // Keep hydration stable when only switching category tabs.
                if (_hidraLock) {
                    var hElLock = document.getElementById('gym-stat-hidratacion');
                    if (hElLock) {
                        hElLock.dataset.litros = _hidraLock.litros;
                        hElLock.textContent = _hidraLock.text;
                    }
                }
                // NOTE: We do NOT call gymCargarStatsParaIntervalo() here when category changes
                // Changing category should only show/hide panels and sync visual state
                // Re-rendering only happens when the interval (filtro/offset) changes
            }, 50);
        }
        function _initGymSwipeCells(card) {
            if (card.dataset.swipeInit === '1') return;
            card.dataset.swipeInit = '1';
            card.querySelectorAll('.gym-stat-cell').forEach(function(cell) {
                var inp = cell.querySelector('input.gym-stat-inp');
                if (!inp) return;
                var startX = null, stepped = false;
                var step = parseFloat(inp.step) || 1;
                var max = inp.max !== '' ? parseFloat(inp.max) : Infinity;
                var THRESHOLD = 35;

                cell.addEventListener('touchstart', function(e) {
                    if (e.touches.length !== 1) return;
                    if (e.target.closest('.gym-card-time-badge')) return;
                    startX = e.touches[0].clientX;
                    stepped = false;
                }, { passive: true });

                cell.addEventListener('touchmove', function(e) {
                    if (startX === null || stepped) return;
                    if (e.target.closest('.gym-card-time-badge')) return;
                    var dx = e.touches[0].clientX - startX;
                    if (Math.abs(dx) < THRESHOLD) return;
                    stepped = true;
                    var dir = dx > 0 ? 1 : -1;
                    var newVal = Math.min(max, Math.max(0, (parseFloat(inp.value) || 0) + dir * step));
                    newVal = Number.isInteger(step) ? Math.round(newVal) : newVal;
                    inp.value = newVal;
                    inp.dispatchEvent(new Event('input'));
                    if (navigator.vibrate) navigator.vibrate(8);
                    cell.style.background = 'rgba(148,163,184,0.25)';
                    cell.style.transition = 'background 0.06s';
                    clearTimeout(cell._swipeFlash);
                    cell._swipeFlash = setTimeout(function() {
                        cell.style.background = '';
                        cell.style.transition = 'background 0.3s';
                    }, 150);
                }, { passive: true });

                cell.addEventListener('touchend', function() { startX = null; stepped = false; });
                cell.addEventListener('touchcancel', function() { startX = null; stepped = false; });
            });
            var kgCell = card.querySelector('.gym-col-kg > div:first-child');
            var kgInp  = kgCell && kgCell.querySelector('input.gym-card-kg');
            if (kgCell && kgInp) {
                var _kgLpTimer = null, _kgLpStarted = false;
                kgCell.addEventListener('touchstart', function(e) {
                    if (e.target.closest('.gym-card-time-badge')) return;
                    _kgLpStarted = false;
                    _kgLpTimer = setTimeout(function() {
                        _kgLpStarted = true;
                        if (navigator.vibrate) navigator.vibrate([30, 20, 60]);
                        _gymAbrirKgDial(kgInp);
                    }, 400);
                }, { passive: true });
                kgCell.addEventListener('touchend', function() { clearTimeout(_kgLpTimer); });
                kgCell.addEventListener('touchcancel', function() { clearTimeout(_kgLpTimer); });
                kgCell.addEventListener('touchmove', function() { clearTimeout(_kgLpTimer); });
            }
            _initGymTimerBadge(card);
        }
        function _gymAbrirKgDial(kgInp) {
            var prev = document.getElementById('_gymKgDialOverlay');
            if (prev) prev.remove();

            var currentVal = parseFloat(kgInp.value) || 0;
            var step = parseFloat(kgInp.step) || 0.5;
            var maxVal = parseFloat(kgInp.max) || 999;
            var values = [];
            for (var v = 0; v <= maxVal; v = Math.round((v + step) * 10) / 10) values.push(v);

            var currentIdx = Math.round(values.indexOf(
                values.reduce(function(a, b) { return Math.abs(b - currentVal) < Math.abs(a - currentVal) ? b : a; })
            ));
            if (currentIdx < 0) currentIdx = 0;

            var esCardio = typeof _gymEsCardioCard === 'function' && _gymEsCardioCard(kgInp.closest('.gym-card'));
            var _dialColor    = esCardio ? '#fb923c' : '#eab308';
            var _dialColorRgb = esCardio ? '249,115,22' : '234,179,8';
            var _dialUnit     = esCardio ? 'km' : 'kg';
            var _dialTitle    = esCardio ? 'Distancia' : 'Peso';

            var overlay = document.createElement('div');
            overlay.id = '_gymKgDialOverlay';
            overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;';

            overlay.innerHTML = `
                <div id="_gymKgDialModal" style="background:#0f172a;border:1px solid rgba(${_dialColorRgb},0.3);border-radius:28px;width:220px;padding:24px 20px 20px;display:flex;flex-direction:column;align-items:center;gap:16px;box-shadow:0 32px 80px rgba(0,0,0,0.7);touch-action:none;">
                    <div style="display:flex;align-items:center;justify-content:space-between;width:100%;">
                        <span style="color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">${_dialTitle}</span>
                        <button id="_gymKgDialClose" style="background:none;border:none;color:#64748b;cursor:pointer;padding:4px;line-height:1;"><span class="material-symbols-rounded" style="font-size:20px;">close</span></button>
                    </div>

                    <!-- Valor actual grande -->
                    <div style="display:flex;align-items:baseline;gap:6px;">
                        <span id="_gymKgDialVal" style="color:${_dialColor};font-size:64px;font-weight:900;font-family:Manrope,sans-serif;line-height:1;min-width:110px;text-align:center;">${currentVal % 1 === 0 ? currentVal : currentVal.toFixed(1)}</span>
                        <span style="color:#94a3b8;font-size:18px;font-weight:700;">${_dialUnit}</span>
                    </div>

                    <!-- Dial rueda -->
                    <div style="position:relative;width:100%;height:220px;overflow:hidden;border-radius:18px;background:rgba(15,23,42,0.8);border:1px solid rgba(255,255,255,0.06);">
                        <!-- Gradientes arriba/abajo -->
                        <div style="position:absolute;top:0;left:0;right:0;height:70px;background:linear-gradient(to bottom,rgba(15,23,42,0.95),transparent);z-index:2;pointer-events:none;"></div>
                        <div style="position:absolute;bottom:0;left:0;right:0;height:70px;background:linear-gradient(to top,rgba(15,23,42,0.95),transparent);z-index:2;pointer-events:none;"></div>
                        <!-- Indicador central -->
                        <div style="position:absolute;top:50%;left:12px;right:12px;transform:translateY(-50%);height:52px;background:rgba(${_dialColorRgb},0.1);border:1px solid rgba(${_dialColorRgb},0.35);border-radius:12px;z-index:1;pointer-events:none;"></div>
                        <!-- Lista scrollable -->
                        <div id="_gymKgDialList" style="position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;touch-action:none;">
                            <div id="_gymKgDialTrack" style="display:flex;flex-direction:column;align-items:center;will-change:transform;"></div>
                        </div>
                    </div>

                    <!-- Botón confirmar -->
                    <button id="_gymKgDialOk" style="width:100%;padding:14px;background:linear-gradient(135deg,rgba(${_dialColorRgb},0.25),rgba(${_dialColorRgb},0.15));border:1px solid rgba(${_dialColorRgb},0.5);border-radius:16px;color:${_dialColor};font-size:15px;font-weight:800;font-family:Manrope,sans-serif;cursor:pointer;letter-spacing:0.03em;">Confirmar</button>
                </div>`;

            document.body.appendChild(overlay);
            var track = document.getElementById('_gymKgDialTrack');
            var ITEM_H = 52;
            var dialList = document.getElementById('_gymKgDialList');
            var CONTAINER_H = 220;
            var CENTER_Y = CONTAINER_H / 2; // 110px — línea central del contenedor
            var padEl = function() {
                var d = document.createElement('div');
                d.style.cssText = 'height:' + (CENTER_Y - ITEM_H / 2) + 'px;flex-shrink:0;';
                return d;
            };
            track.appendChild(padEl());
            values.forEach(function(v, i) {
                var item = document.createElement('div');
                item.dataset.idx = i;
                item.style.cssText = 'height:' + ITEM_H + 'px;display:flex;align-items:center;justify-content:center;width:100%;flex-shrink:0;font-size:26px;font-weight:800;font-family:Manrope,sans-serif;color:#475569;transition:color 0.1s;cursor:pointer;user-select:none;';
                item.textContent = v % 1 === 0 ? v : v.toFixed(1);
                track.appendChild(item);
            });
            track.appendChild(padEl());

            var activeIdx = currentIdx;

            function setIdx(idx) {
                idx = Math.max(0, Math.min(values.length - 1, idx));
                activeIdx = idx;
                var offset = -(idx * ITEM_H);
                track.style.transform = 'translateY(' + offset + 'px)';
                Array.from(track.children).forEach(function(child, ci) {
                    var itemIdx = ci - 1; // offset por padding
                    if (itemIdx < 0 || itemIdx >= values.length) return;
                    var dist = Math.abs(itemIdx - idx);
                    if (dist === 0) { child.style.color = _dialColor; child.style.fontSize = '28px'; }
                    else if (dist === 1) { child.style.color = '#94a3b8'; child.style.fontSize = '22px'; }
                    else { child.style.color = '#334155'; child.style.fontSize = '18px'; }
                });
                var v = values[idx];
                document.getElementById('_gymKgDialVal').textContent = v % 1 === 0 ? v : v.toFixed(1);
            }
            track.style.transition = 'none';
            setIdx(currentIdx);
            requestAnimationFrame(function() { track.style.transition = 'transform 0.12s cubic-bezier(0.25,0.1,0.25,1)'; });
            var touchStartY = 0, touchStartIdx = 0, lastY = 0, velY = 0, lastT = 0;
            dialList.addEventListener('touchstart', function(e) {
                e.preventDefault();
                var t = e.touches[0];
                touchStartY = t.clientY; lastY = t.clientY; lastT = Date.now();
                touchStartIdx = activeIdx;
                velY = 0;
                track.style.transition = 'none';
            }, { passive: false });

            dialList.addEventListener('touchmove', function(e) {
                e.preventDefault();
                var t = e.touches[0];
                var now = Date.now();
                velY = (t.clientY - lastY) / (now - lastT + 1);
                lastY = t.clientY; lastT = now;
                var dy = t.clientY - touchStartY;
                var idxDelta = -Math.round(dy / ITEM_H);
                var idx = Math.max(0, Math.min(values.length - 1, touchStartIdx + idxDelta));
                if (idx !== activeIdx) {
                    if (navigator.vibrate) navigator.vibrate(4);
                    setIdx(idx);
                }
            }, { passive: false });

            dialList.addEventListener('touchend', function(e) {
                track.style.transition = 'transform 0.25s cubic-bezier(0.25,0.1,0.25,1)';
                var flick = Math.round(-velY * 6);
                var targetIdx = Math.max(0, Math.min(values.length - 1, activeIdx + flick));
                setIdx(targetIdx);
            }, { passive: true });
            track.addEventListener('click', function(e) {
                var item = e.target.closest('[data-idx]');
                if (!item) return;
                setIdx(parseInt(item.dataset.idx));
            });
            document.getElementById('_gymKgDialOk').addEventListener('click', function() {
                kgInp.value = values[activeIdx];
                kgInp.dispatchEvent(new Event('input'));
                if (navigator.vibrate) navigator.vibrate([20, 10, 40]);
                overlay.remove();
            });
            document.getElementById('_gymKgDialClose').addEventListener('click', function() { overlay.remove(); });
            overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
        }
        function _gymStep(btn, dir) {
            var inp = btn.parentElement.querySelector('input');
            if (!inp) return;
            var val = parseFloat(inp.value) || 0;
            var max = parseFloat(inp.max ?? Infinity);
            var step = parseFloat(inp.step) || 1;
            val = Math.min(max, Math.max(0, val + dir * step));
            inp.value = Number.isInteger(step) ? Math.round(val) : val;
            inp.dispatchEvent(new Event('input'));
        }
        function _gymSetCardLocked(card, locked) {
            if (!card) return;
            card.dataset.locked = locked ? '1' : '0';
            var existingOverlay = card.querySelector('._gymLockOverlay');
            if (existingOverlay) existingOverlay.remove();
            var checkBtn = card.querySelector('.gym-check-btn');
            var menuBtn = card.querySelector('button[onclick*="toggleGymCardMenu"]');
            var dragHandle = card.querySelector('.gym-drag-handle');
            var body = card.querySelector('.gym-card-body');
            if (locked) {
                card.style.position = 'relative';
                if (body) body.style.opacity = '0.45';
                var overlay = document.createElement('div');
                overlay.className = '_gymLockOverlay';
                overlay.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;z-index:10;cursor:not-allowed;background:rgba(15,23,42,0.25);';
                card.appendChild(overlay);
                if (checkBtn) { checkBtn.style.position = 'relative'; checkBtn.style.zIndex = '20'; }
                if (menuBtn) { menuBtn.style.position = 'relative'; menuBtn.style.zIndex = '20'; }
                if (dragHandle) { dragHandle.style.position = 'relative'; dragHandle.style.zIndex = '20'; }
            } else {
                if (body) body.style.opacity = '';
                if (checkBtn) { checkBtn.style.position = ''; checkBtn.style.zIndex = ''; }
                if (menuBtn) { menuBtn.style.position = ''; menuBtn.style.zIndex = ''; }
                if (dragHandle) { dragHandle.style.position = ''; dragHandle.style.zIndex = ''; }
            }
        }
        function toggleEjercicioGym(btn) {
            var completado = btn.dataset.completado === '1';
            completado = !completado;
            btn.dataset.completado = completado ? '1' : '0';
            var icon = btn.querySelector('.material-symbols-rounded');
            var elIntervalo = document.getElementById('gym-intervalo-label');
            var offset = elIntervalo ? parseInt(elIntervalo.dataset.offset || 0) : 0;
            var fechaKey = _gymFechaKey(offset);
            if (completado) {
                btn.style.background = '#10b981';
                btn.style.border = '2px solid #10b981';
                icon.textContent = 'check';
                icon.style.color = 'white';
                icon.style.fontWeight = '700';
                btn.style.transform = 'scale(1.18)';
                if (navigator.vibrate) navigator.vibrate([40, 30, 80]);
                if (typeof _playPopSound === 'function') _playPopSound();
                btn.dataset.completado = '1';
                setTimeout(function(){ btn.style.transform = 'scale(1)'; }, 200);
            } else {
                btn.style.background = 'transparent';
                btn.style.border = '2px solid #334155';
                icon.textContent = 'check';
                icon.style.color = '#475569';
                icon.style.fontWeight = '';
                btn.dataset.completado = '0';
            }
            // UPDATE sessionStorage with the new completado state
            var card = btn.closest('.gym-card');
            if (card && card.dataset.panel && window._gymSesionesHistorial && window._gymSesionesHistorial[fechaKey]) {
                var panelCategory = card.dataset.panel;
                var cardIndex = parseInt(card.dataset.cardIndex || '-1', 10);
                if (window._gymSesionesHistorial[fechaKey].cards &&
                    window._gymSesionesHistorial[fechaKey].cards[panelCategory] &&
                    cardIndex >= 0 &&
                    window._gymSesionesHistorial[fechaKey].cards[panelCategory][cardIndex]) {
                    window._gymSesionesHistorial[fechaKey].cards[panelCategory][cardIndex].completado = completado;
                    window._gymSesionesHistorial[fechaKey].ejercicios = _gymContarCompletadosDesdeCards(window._gymSesionesHistorial[fechaKey].cards);
                }
            }
            _gymSetCardLocked(card, completado);
            _gymActualizarStatEjercicios(fechaKey);
            if (typeof guardarDatos === 'function') guardarDatos();
        }
        function toggleCronometroGym(btn) {
            var card = btn.closest('.gym-card');
            var display = card.querySelector('.gym-timer-display');
            var icon = btn.querySelector('.material-symbols-rounded');
            if (btn.dataset.running === '1') {
                clearInterval(window['_gymTimer_' + btn.dataset.timerId]);
                btn.dataset.running = '0';
                btn.style.background = 'rgba(234,179,8,0.12)';
                btn.style.borderColor = 'rgba(234,179,8,0.5)';
                icon.style.color = '#eab308';
                icon.textContent = 'timer';
            } else {
                var id = Date.now();
                btn.dataset.timerId = id;
                btn.dataset.running = '1';
                var start = Date.now() - (parseInt(btn.dataset.elapsed || 0) * 1000);
                btn.style.background = 'rgba(239,68,68,0.25)';
                btn.style.borderColor = 'rgba(239,68,68,0.8)';
                icon.style.color = '#ef4444';
                icon.textContent = 'stop_circle';
                window['_gymTimer_' + id] = setInterval(function() {
                    var elapsed = Math.floor((Date.now() - start) / 1000);
                    btn.dataset.elapsed = elapsed;
                    var m = Math.floor(elapsed / 60).toString().padStart(2,'0');
                    var s = (elapsed % 60).toString().padStart(2,'0');
                    display.textContent = m + ':' + s;
                }, 1000);
            }
        }

        function reiniciarCronometroGym(btn) {
            var card = btn.closest('.gym-card');
            var timerBtn = card.querySelector('.gym-timer-btn');
            var display = card.querySelector('.gym-timer-display');
            if (timerBtn.dataset.running === '1') {
                clearInterval(window['_gymTimer_' + timerBtn.dataset.timerId]);
                timerBtn.dataset.running = '0';
                var icon = timerBtn.querySelector('.material-symbols-rounded');
                timerBtn.style.background = 'rgba(234,179,8,0.12)';
                timerBtn.style.borderColor = 'rgba(234,179,8,0.5)';
                icon.style.color = '#eab308';
                icon.textContent = 'timer';
            }
            timerBtn.dataset.elapsed = '0';
            timerBtn.dataset.prevUploaded = '0';
            timerBtn.dataset.cardPrevUploaded = '0';
            display.textContent = '00:00';
        }
        var _gymResetTimerLPTimer = null;
        function _gymResetTimerLP(btn, phase) {
            if (phase === 'start') {
                if (_gymResetTimerLPTimer) clearTimeout(_gymResetTimerLPTimer);
                btn.style.background = 'rgba(234,179,8,0.3)';
                btn.style.borderColor = 'rgba(234,179,8,0.9)';
                _gymResetTimerLPTimer = setTimeout(function() {
                    _gymResetTimerLPTimer = null;
                    reiniciarCronometroGym(btn);
                    btn.style.background = 'rgba(234,179,8,0.12)';
                    btn.style.borderColor = 'rgba(234,179,8,0.5)';
                }, 600);
            } else {
                if (_gymResetTimerLPTimer) { clearTimeout(_gymResetTimerLPTimer); _gymResetTimerLPTimer = null; }
                btn.style.background = 'rgba(234,179,8,0.12)';
                btn.style.borderColor = 'rgba(234,179,8,0.5)';
            }
        }
        var _gymLongPressTimer = null;
        var _gymLongPressEl = null;
        function gymLongPressStart(el, fnName, borderColor) {
            gymLongPressEnd(el, null);
            _gymLongPressEl = el;
            el.style.borderColor = borderColor;
            el.style.opacity = '0.7';
            _gymLongPressTimer = setTimeout(function() {
                el.style.opacity = '1';
                window._gymLongPressFired = true;
                window[fnName](el);
            }, 600);
        }
        function gymLongPressEnd(el, borderColor) {
            if (_gymLongPressTimer) { clearTimeout(_gymLongPressTimer); _gymLongPressTimer = null; }
            el.style.opacity = '1';
            if (borderColor) el.style.borderColor = borderColor;
        }
        function gymResetCardTimeFromBadge(badge) {
            gymResetCardTime(badge);
        }
        function _gymResetStatCell(cell) {
            var inp = cell.querySelector('.gym-stat-inp');
            if (!inp) return;
            inp.value = '0';
            if (typeof guardarDatos === 'function') guardarDatos();
        }
        var _gymStatCellTimer = null;
        function _gymStatCellDown(el) {
            _gymStatCellUp();
            _gymStatCellTimer = setTimeout(function() { _gymResetStatCell(el); }, 600);
        }
        function _gymStatCellUp() {
            if (_gymStatCellTimer) { clearTimeout(_gymStatCellTimer); _gymStatCellTimer = null; }
        }

        function _initGymTimerBadge(card) {
            var badge = card.querySelector('.gym-card-time-badge');
            if (!badge || badge._badgeInit) return;
            badge._badgeInit = true;
            if (!badge.dataset.totalSecs || parseInt(badge.dataset.totalSecs) === 0) {
                badge.style.display = 'none'; badge.setAttribute('data-hidden','1');
            }
            var _lpt = null;
            var _lptFired = false;
            badge.addEventListener('touchstart', function(e) {
                e.stopPropagation();
                _lptFired = false;
                badge.style.opacity = '0.7';
                badge.style.borderColor = 'rgba(59,130,246,0.8)';
                _lpt = setTimeout(function() {
                    _lptFired = true;
                    badge.style.opacity = '1';
                    gymResetCardTime(badge);
                }, 600);
            }, { passive: false });
            badge.addEventListener('touchmove', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (_lpt) { clearTimeout(_lpt); _lpt = null; }
            }, { passive: false });
            badge.addEventListener('touchend', function(e) {
                e.stopPropagation();
                clearTimeout(_lpt); _lpt = null;
                badge.style.opacity = '1';
                badge.style.borderColor = 'rgba(59,130,246,0.35)';
                if (!_lptFired) {
                    e.preventDefault();
                    _gymEditarTimeBadge(badge);
                }
            }, { passive: false });
            badge.addEventListener('touchcancel', function() {
                if (_lpt) { clearTimeout(_lpt); _lpt = null; }
                badge.style.opacity = '1';
                badge.style.borderColor = 'rgba(59,130,246,0.35)';
            });
            badge.addEventListener('click', function() {
                _gymEditarTimeBadge(badge);
            });
        }

        function gymResetCardTime(badge) {
            badge.dataset.totalSecs = 0;
            var label = badge.querySelector('.gym-card-time-label');
            if (label) label.textContent = '00:00';
            badge.style.display = 'none'; badge.setAttribute('data-hidden','1');
            var card = badge.closest('.gym-card');
            if (card) {
                var timerBtn = card.querySelector('.gym-timer-btn');
                if (timerBtn) { timerBtn.dataset.prevUploaded = '0'; timerBtn.dataset.cardPrevUploaded = '0'; }
            }
            gymGuardarSesionHoy();
            setTimeout(function() {
                badge.style.display = 'none';
                badge.setAttribute('data-hidden', '1');
            }, 50);
        }
        function _gymEditarTimeBadge(badge) {
            var prev = document.getElementById('_modalGymTimeBadge');
            if (prev) prev.remove();
            var totalSecs = parseInt(badge.dataset.totalSecs || 0);
            var hh = Math.floor(totalSecs / 3600);
            var mm = Math.floor((totalSecs % 3600) / 60);
            var ss = totalSecs % 60;
            var overlay = document.createElement('div');
            overlay.id = '_modalGymTimeBadge';
            overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:10001;display:flex;align-items:center;justify-content:center;padding:16px;';
            overlay.innerHTML = '<div style="background:#0f172a;border:1px solid rgba(59,130,246,0.3);border-radius:20px;width:100%;max-width:280px;display:flex;flex-direction:column;overflow:hidden;">'
                + '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px 12px;border-bottom:1px solid rgba(255,255,255,0.05);">'
                + '<div style="display:flex;align-items:center;gap:8px;"><span class="material-symbols-rounded" style="font-size:18px;color:#60a5fa;">schedule</span><span style="color:#f1f5f9;font-size:14px;font-weight:800;">Tiempo registrado</span></div>'
                + '<button onclick="document.getElementById(\'_modalGymTimeBadge\').remove()" style="background:none;border:none;color:#64748b;cursor:pointer;padding:4px;"><span class="material-symbols-rounded" style="font-size:20px;">close</span></button>'
                + '</div>'
                + '<div style="padding:20px;display:flex;flex-direction:column;gap:16px;">'
                + '<div style="display:flex;align-items:flex-end;justify-content:center;gap:6px;">'
                + '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;"><span style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Horas</span><input id="_tbEditH" type="number" min="0" max="23" value="' + hh + '" style="width:62px;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.3);border-radius:10px;color:#93c5fd;font-size:22px;font-weight:900;font-family:Manrope,sans-serif;text-align:center;padding:8px 4px;outline:none;" onfocus="this.select()"></div>'
                + '<span style="color:#475569;font-size:24px;font-weight:900;padding-bottom:10px;">:</span>'
                + '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;"><span style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Min</span><input id="_tbEditM" type="number" min="0" max="59" value="' + String(mm).padStart(2,'0') + '" style="width:62px;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.3);border-radius:10px;color:#93c5fd;font-size:22px;font-weight:900;font-family:Manrope,sans-serif;text-align:center;padding:8px 4px;outline:none;" onfocus="this.select()"></div>'
                + '<span style="color:#475569;font-size:24px;font-weight:900;padding-bottom:10px;">:</span>'
                + '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;"><span style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Seg</span><input id="_tbEditS" type="number" min="0" max="59" value="' + String(ss).padStart(2,'0') + '" style="width:62px;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.3);border-radius:10px;color:#93c5fd;font-size:22px;font-weight:900;font-family:Manrope,sans-serif;text-align:center;padding:8px 4px;outline:none;" onfocus="this.select()"></div>'
                + '</div>'
                + '<div style="display:flex;gap:8px;">'
                + '<button onclick="document.getElementById(\'_modalGymTimeBadge\').remove()" style="flex:1;height:40px;border-radius:12px;border:1px solid rgba(71,85,105,0.4);background:rgba(71,85,105,0.1);color:#94a3b8;font-size:12px;font-weight:700;cursor:pointer;">Cancelar</button>'
                + '<button onclick="_gymConfirmarEditTimeBadge()" style="flex:2;height:40px;border-radius:12px;border:1px solid rgba(59,130,246,0.4);background:rgba(59,130,246,0.15);color:#60a5fa;font-size:12px;font-weight:700;cursor:pointer;">Confirmar</button>'
                + '</div>'
                + '</div>'
                + '</div>';
            overlay._targetBadge = badge;
            overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
            document.body.appendChild(overlay);
            setTimeout(function() { var inp = document.getElementById('_tbEditM'); if (inp) inp.focus(); }, 100);
        }
        function _gymConfirmarEditTimeBadge() {
            var overlay = document.getElementById('_modalGymTimeBadge');
            if (!overlay) return;
            var badge = overlay._targetBadge;
            var h = Math.max(0, parseInt(document.getElementById('_tbEditH')?.value || 0));
            var m = Math.max(0, Math.min(59, parseInt(document.getElementById('_tbEditM')?.value || 0)));
            var s = Math.max(0, Math.min(59, parseInt(document.getElementById('_tbEditS')?.value || 0)));
            var totalSecs = h * 3600 + m * 60 + s;
            if (badge) {
                badge.dataset.totalSecs = totalSecs;
                var label = badge.querySelector('.gym-card-time-label');
                if (label) label.textContent = h > 0 ? (h + 'h ' + String(m).padStart(2,'0') + 'm') : (String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0'));
                if (totalSecs > 0) { badge.style.display = 'flex'; badge.removeAttribute('data-hidden'); }
                else { badge.style.display = 'none'; badge.setAttribute('data-hidden','1'); }
            }
            overlay.remove();
            if (typeof gymGuardarSesionHoy === 'function') gymGuardarSesionHoy();
        }
        function gymResetCardio() {
            var el = document.getElementById('gym-stat-cardio-km');
            if (!el) return;
            var panelCardio = document.getElementById('gym-panel-cardio');
            if (panelCardio) {
                panelCardio.querySelectorAll('.gym-card .gym-card-kg').forEach(function(inp) {
                    inp.value = '0';
                });
            }
            el.dataset.totalKm = '0.00';
            el.textContent = '0.0';
            el.style.color = '#fb923c';
            var ctx = (typeof _gymContextoActivo === 'function') ? _gymContextoActivo() : null;
            if (ctx && ctx.esDia && typeof _gymActualizarStatCardioKm === 'function') _gymActualizarStatCardioKm(ctx.fechaKey);
            gymGuardarSesionHoy();
        }
        function gymResetHidratacion() {
            var el = document.getElementById('gym-stat-hidratacion');
            if (!el) return;
            el.dataset.litros = '0';
            el.textContent = '0.00';
            el.style.color = '#22d3ee';
            gymGuardarSesionHoy();
        }
        function gymResetReposo() {
            var el = document.getElementById('gym-stat-reposo');
            if (!el) return;
            el.dataset.totalSecs = 0;
            el.textContent = '00:00';
            el.style.color = '#c084fc';
            gymGuardarSesionHoy();
        }
        function gymResetTiempoTotal() {
            var el = document.getElementById('gym-stat-tiempo');
            if (!el) return;
            el.dataset.totalSecs = 0;
            el.textContent = '00:00';
            el.style.color = '#f1f5f9';
            document.querySelectorAll('.gym-timer-btn').forEach(function(b){ b.dataset.prevUploaded = '0'; });
            gymRecalcularCalorias();
            gymGuardarSesionHoy();
        }
        function gymEditarReposo() {
            if (window._gymLongPressFired) { window._gymLongPressFired = false; return; }
            if (_gymReposoRunning()) return;
            var modal = document.getElementById('modal-gym-reposo');
            var inp = document.getElementById('modal-gym-reposo-inp');
            var rEl = document.getElementById('gym-stat-reposo');
            var secs = parseInt(rEl ? rEl.dataset.totalSecs || 0 : 0);
            var mm = Math.floor(secs / 60), ss = secs % 60;
            if (inp) inp.value = String(mm).padStart(2,'0') + ':' + String(ss).padStart(2,'0');
            if (modal) { modal.style.display = 'flex'; setTimeout(function(){ if (inp) { inp.focus(); inp.select(); } }, 100); }
        }
        function gymConfirmarReposo() {
            var inp = document.getElementById('modal-gym-reposo-inp');
            if (!inp) return;
            var val = inp.value.trim();
            var totalSecs = 0;
            if (val.indexOf(':') >= 0) {
                var parts = val.split(':');
                totalSecs = (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0);
            } else {
                totalSecs = parseInt(val) || 0;
            }
            var rEl = document.getElementById('gym-stat-reposo');
            if (rEl) { rEl.dataset.totalSecs = totalSecs; rEl.textContent = _gymSecsToLabel(totalSecs); }
            document.getElementById('modal-gym-reposo').style.display = 'none';
            var elInt = document.getElementById('gym-intervalo-label');
            var filtro = elInt ? (elInt.dataset.filtro || 'dia') : 'dia';
            var offset = parseInt(elInt ? (elInt.dataset.offset || 0) : 0);
            if (filtro === 'dia' && offset === 0) {
                if (typeof gymGuardarSesionHoy === 'function') gymGuardarSesionHoy();
            } else if (filtro === 'dia') {
                var fechaKey = _gymFechaKey(offset);
                var sesiones = window._gymSesionesHistorial || {};
                if (sesiones[fechaKey]) { sesiones[fechaKey].reposo = totalSecs; if (typeof guardarDatos === 'function') guardarDatos(); }
            }
            _gymSyncBurbujaReposoConVisibilidad();
        }
        function gymAbrirModalPeso() {
            var modal = document.getElementById('modal-gym-peso');
            var inp = document.getElementById('modal-gym-peso-inp');
            var cur = document.getElementById('gym-peso-usuario')?.value;
            if (inp && cur && parseFloat(cur) > 0) inp.value = cur;
            if (modal) { modal.style.display = 'flex'; setTimeout(function(){ if(inp){ inp.focus(); inp.select(); } }, 100); }
        }
        function gymConfirmarPeso() {
            var inp = document.getElementById('modal-gym-peso-inp');
            var hidden = document.getElementById('gym-peso-usuario');
            if (inp && hidden) { hidden.value = inp.value; }
            document.getElementById('modal-gym-peso').style.display = 'none';
            gymRecalcularCalorias();
            // Sincronizar con registro de peso de nutrición
            var pesoVal = parseFloat(inp?.value);
            if (pesoVal > 0) {
                if (!window.nutricionData) window.nutricionData = { comidas: [], registrosPeso: [], objetivos: { kcal: 2000, prot: 100, carbs: 250, grasas: 65 } };
                var hoy = new Date(); var off = hoy.getTimezoneOffset(); var local = new Date(hoy.getTime() - off*60000);
                var fecha = local.toISOString().slice(0,10);
                var idx = window.nutricionData.registrosPeso.findIndex(function(r){ return r.fecha === fecha; });
                if (idx >= 0) window.nutricionData.registrosPeso[idx].peso = pesoVal;
                else window.nutricionData.registrosPeso.push({ fecha: fecha, peso: pesoVal, nota: '' });
                window.nutricionData.registrosPeso.sort(function(a,b){ return a.fecha.localeCompare(b.fecha); });
                if (typeof guardarDatos === 'function') guardarDatos();
                if (typeof _renderNutriPesoChart === 'function') _renderNutriPesoChart();
            }
        }
        document.addEventListener('click', function(e) {
            var modal = document.getElementById('modal-gym-peso');
            if (modal && modal.style.display === 'flex' && e.target === modal) modal.style.display = 'none';
        });
        function gymAjustarAgua(delta) {
            var el = document.getElementById('gym-stat-hidratacion');
            if (!el) return;
            var cur = Math.round(parseFloat(el.dataset.litros || 0) * 100);
            var next = Math.max(0, cur + Math.round(delta * 100));
            var valorFinal = next / 100;
            el.dataset.litros = valorFinal.toFixed(2);
            el.textContent = valorFinal.toFixed(2);
            if (typeof gymGuardarSesionHoy === 'function') gymGuardarSesionHoy();
        }
        window._gymReposoState = window._gymReposoState || { running: false, startAt: 0, intervalId: null };
        function _gymBubbleBridgeDisponible() {
            return !!(window.AndroidNotificador && typeof window.AndroidNotificador.showReposoBubble === 'function');
        }
        function _gymSolicitarPermisoBurbujaSiHaceFalta() {
            if (!_gymBubbleBridgeDisponible() || !_gymReposoRunning() || document.hidden) return;
            if (window._gymBubblePermissionRequested === '1') return;
            window._gymBubblePermissionRequested = '1';
            try {
                window.AndroidNotificador.showReposoBubble(String(window._gymReposoState.startAt || Date.now()));
                setTimeout(function() {
                    if (!document.hidden) _gymOcultarBurbujaReposo();
                }, 250);
            } catch (e) {
                window._gymBubblePermissionRequested = '0';
            }
        }
        function _gymMostrarBurbujaReposo() {
            if (!_gymBubbleBridgeDisponible() || !_gymReposoRunning()) return;
            try {
                window.AndroidNotificador.showReposoBubble(String(window._gymReposoState.startAt || Date.now()));
            } catch (e) {}
        }
        function _gymOcultarBurbujaReposo() {
            if (!_gymBubbleBridgeDisponible() || !window.AndroidNotificador || typeof window.AndroidNotificador.hideReposoBubble !== 'function') return;
            try {
                window.AndroidNotificador.hideReposoBubble();
            } catch (e) {}
        }
        function _gymSyncBurbujaReposoConVisibilidad() {
            if (!_gymReposoRunning()) {
                _gymOcultarBurbujaReposo();
                return;
            }
            if (document.hidden) {
                _gymMostrarBurbujaReposo();
                return;
            }
            _gymOcultarBurbujaReposo();
        }
        document.addEventListener('visibilitychange', function() {
            if (document.hidden && _gymReposoRunning()) _gymMostrarBurbujaReposo();
            setTimeout(_gymSyncBurbujaReposoConVisibilidad, 120);
        });
        document.addEventListener('pause', function() {
            if (_gymReposoRunning()) _gymMostrarBurbujaReposo();
            setTimeout(_gymSyncBurbujaReposoConVisibilidad, 120);
        });
        document.addEventListener('resume', function() {
            _gymOcultarBurbujaReposo();
            setTimeout(_gymSyncBurbujaReposoConVisibilidad, 180);
        });
        async function _gymCancelarNotifReposo() {
            return Promise.resolve();
        }
        async function _gymProgramarNotifReposo() {
            return Promise.resolve();
        }
        function _gymSyncNotifReposoConVisibilidad() {
        }
        function _gymReposoRunning() {
            return window._gymReposoState.running;
        }
        function _gymReposoRestoreBtn() {
            _gymReposoSetAllIcons(true);
        }

        function _gymReposoSetAllIcons(running) {
            document.querySelectorAll('.gym-reposo-btn').forEach(function(b) {
                var ic = b.querySelector('.material-symbols-rounded');
                if (running) {
                    b.style.background = 'rgba(168,85,247,0.3)';
                    b.style.borderColor = 'rgba(168,85,247,0.8)';
                    b.style.opacity = '';
                    b.style.pointerEvents = '';
                    if (ic) { ic.style.color = '#e9d5ff'; ic.textContent = 'pause'; }
                } else {
                    b.dataset.running = '0';
                    b.style.background = 'rgba(168,85,247,0.08)';
                    b.style.borderColor = 'rgba(168,85,247,0.4)';
                    b.style.opacity = '';
                    b.style.pointerEvents = '';
                    if (ic) { ic.style.color = '#c084fc'; ic.textContent = 'stop_circle'; }
                }
            });
        }
        function _gymReposoSetBloqueado(bloqueado) {
            document.querySelectorAll('.gym-reposo-btn').forEach(function(b) {
                b.style.opacity = bloqueado ? '0.3' : '';
                b.style.pointerEvents = bloqueado ? 'none' : '';
            });
        }

        function _gymReposoBloqueado() {
            var el = document.getElementById('gym-intervalo-label');
            if (!el) return false;
            return !(el.dataset.filtro === 'dia' && (parseInt(el.dataset.offset) || 0) === 0);
        }
        function toggleReposoGym(btn) {
            if (_gymReposoBloqueado()) return;
            var icon = btn.querySelector('.material-symbols-rounded');
            if (window._gymReposoState.running) {
                // Pararlo todo (ya sea la misma card u otra)
                clearInterval(window._gymReposoState.intervalId);
                window._gymReposoState.running = false;
                window._gymReposoState.intervalId = null;
                window._gymReposoState.activeBtn = null;
                _gymReposoSetAllIcons(false);
                _gymCancelarNotifReposo();
                _gymOcultarBurbujaReposo();
                gymGuardarSesionHoy();
            } else {
                var reposoEl = document.getElementById('gym-stat-reposo');
                var base = parseInt(reposoEl ? reposoEl.dataset.totalSecs || 0 : 0);
                var startAt = Date.now() - base * 1000;
                window._gymReposoState.running = true;
                window._gymReposoState.startAt = startAt;
                window._gymReposoState.activeBtn = btn;
                btn.dataset.running = '1';
                _gymReposoSetAllIcons(true);
                window._gymReposoState.intervalId = setInterval(function() {
                    var elapsed = Math.floor((Date.now() - window._gymReposoState.startAt) / 1000);
                    var rEl = document.getElementById('gym-stat-reposo');
                    if (rEl) {
                        rEl.dataset.totalSecs = elapsed;
                        var rh = Math.floor(elapsed/3600), rm = Math.floor((elapsed%3600)/60), rs = elapsed%60;
                        rEl.textContent = rh > 0 ? rh+'h '+String(rm).padStart(2,'0')+'m' : String(rm).padStart(2,'0')+':'+String(rs).padStart(2,'0');
                    }
                }, 1000);
                window._gymBubblePermissionRequested = window._gymBubblePermissionRequested || '0';
                _gymSolicitarPermisoBurbujaSiHaceFalta();
                _gymSyncBurbujaReposoConVisibilidad();
            }
        }
        function gymRecalcularCalorias() {
            var peso = parseFloat(document.getElementById('gym-peso-usuario')?.value || 0);
            var tiempoEl = document.getElementById('gym-stat-tiempo');
            var calEl = document.getElementById('gym-stat-calorias');
            if (!calEl) return;
            if (peso < 10) { calEl.textContent = '—'; return; }
            var totalSecs = parseInt(tiempoEl?.dataset.totalSecs || 0);
            if (totalSecs < 1) { calEl.textContent = '—'; return; }
            var horasTrabajo = totalSecs / 3600;
            var rpeValues = [];
            ['pecho','espalda','brazo','pierna','cardio'].forEach(function(p) {
                var panel = document.getElementById('gym-panel-' + p);
                if (!panel) return;
                panel.querySelectorAll('input.gym-card-rpe').forEach(function(inp) {
                    var v = parseFloat(inp.value);
                    if (!isNaN(v) && v > 0) rpeValues.push(v);
                });
            });
            var rpeAvg = rpeValues.length > 0 ? rpeValues.reduce(function(a,b){return a+b;},0) / rpeValues.length : 5;
            var panelCardio = document.getElementById('gym-panel-cardio');
            var tieneCardio = panelCardio && panelCardio.querySelectorAll('.gym-card').length > 0;
            var met = tieneCardio ? 7.5 : rpeAvg <= 3 ? 3.5 : rpeAvg <= 6 ? 5.0 : rpeAvg <= 8 ? 6.0 : 8.0;
            var kcal = Math.round(met * peso * horasTrabajo);
            calEl.textContent = kcal;
            gymGuardarSesionHoy();
            if (typeof _nutriRenderWidgets === 'function') _nutriRenderWidgets();
        }
        function _gymISODateLocal(dateObj) {
            var d = dateObj instanceof Date ? new Date(dateObj.getTime()) : new Date();
            var off = d.getTimezoneOffset();
            var local = new Date(d.getTime() - off * 60000);
            return local.toISOString().slice(0,10);
        }
        function _gymDateFromKey(fechaKey) {
            var parts = String(fechaKey || '').split('-');
            if (parts.length !== 3) return new Date();
            return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0, 0);
        }
        function _gymFechaLargaDesdeKey(fechaKey) {
            var txt = _gymDateFromKey(fechaKey).toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
            return txt ? txt.charAt(0).toUpperCase() + txt.slice(1) : '';
        }
        function _gymFechaCortaDesdeKey(fechaKey) {
            if (fechaKey === _gymFechaKey(0)) return 'Hoy';
            var txt = _gymDateFromKey(fechaKey).toLocaleDateString('es-ES', { day:'numeric', month:'short' });
            return txt ? txt.charAt(0).toUpperCase() + txt.slice(1) : 'Día';
        }
        function _gymOffsetDesdeFechaKey(fechaKey) {
            var hoy = _gymDateFromKey(_gymFechaKey(0));
            var fecha = _gymDateFromKey(fechaKey);
            return Math.round((fecha.getTime() - hoy.getTime()) / 86400000);
        }
        function _gymFechaKey(offsetDias) {
            var d = new Date();
            d.setDate(d.getDate() + (offsetDias || 0));
            return _gymISODateLocal(d);
        }
        function _gymIrAFechaKey(fechaKey) {
            if (!fechaKey) return;
            var el = document.getElementById('gym-intervalo-label');
            if (el) {
                el.dataset.filtro = 'dia';
                el.dataset.offset = String(_gymOffsetDesdeFechaKey(fechaKey));
                el.textContent = _gymFechaCortaDesdeKey(fechaKey);
            }
            var fechaEl = document.getElementById('gym-fecha-hoy');
            if (fechaEl) fechaEl.textContent = _gymFechaLargaDesdeKey(fechaKey);
            if (typeof gymCargarStatsParaIntervalo === 'function') gymCargarStatsParaIntervalo();
        }
        function _gymContextoActivo() {
            var el = document.getElementById('gym-intervalo-label');
            var filtro = el ? (el.dataset.filtro || 'dia') : 'dia';
            var offset = el ? parseInt(el.dataset.offset || 0) : 0;
            if (isNaN(offset)) offset = 0;
            var fechaKey = _gymFechaKey(offset);
            var domHistorico = !!document.querySelector('.gym-panel-grid[data-historico="1"]');
            return {
                filtro: filtro,
                offset: offset,
                fechaKey: fechaKey,
                esDia: filtro === 'dia',
                esHoy: filtro === 'dia' && offset === 0,
                domHistorico: domHistorico
            };
        }
        function _gymSecsToLabel(secs) {
            if (!secs || secs < 1) return '00:00';
            var h = Math.floor(secs/3600), m = Math.floor((secs%3600)/60), s = secs%60;
            return h > 0 ? h+'h '+String(m).padStart(2,'0')+'m' : String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
        }
        function _gymContarCompletadosDesdeCards(cardsPorPanel) {
            var total = 0;
            ['pecho','espalda','brazo','pierna','cardio'].forEach(function(p) {
                var lista = cardsPorPanel && cardsPorPanel[p];
                if (!Array.isArray(lista)) return;
                lista.forEach(function(card) {
                    if (!card) return;
                    var c = card.completado;
                    if (c === true || c === 1 || c === '1') total++;
                });
            });
            return total;
        }
        function _gymNum(v) {
            if (typeof v === 'string') v = v.replace(',', '.');
            var n = parseFloat(v);
            return isNaN(n) ? 0 : n;
        }
        function _gymFilterText(v) {
            return String(v || '').trim().toLowerCase();
        }
        function _gymEsVistaVisible(el) {
            if (!el) return false;
            var styles = window.getComputedStyle ? window.getComputedStyle(el) : null;
            if (!styles) return !!el.offsetParent || el === document.body;
            return styles.display !== 'none' && styles.visibility !== 'hidden';
        }
        function _actualizarMainNavHeightVar() {
            var nav = document.getElementById('mainNav');
            var altura = 0;
            if (nav) {
                var estilos = window.getComputedStyle ? window.getComputedStyle(nav) : null;
                var visible = !estilos || (estilos.display !== 'none' && estilos.visibility !== 'hidden');
                if (visible) altura = Math.ceil(nav.getBoundingClientRect().height || 0);
            }
            document.documentElement.style.setProperty('--main-nav-height', altura + 'px');
        }
        if (!window._mainNavHeightVarInit) {
            window._mainNavHeightVarInit = true;
            document.addEventListener('DOMContentLoaded', _actualizarMainNavHeightVar);
            window.addEventListener('load', _actualizarMainNavHeightVar);
            window.addEventListener('resize', _actualizarMainNavHeightVar);
            window.addEventListener('orientationchange', _actualizarMainNavHeightVar);
            setTimeout(_actualizarMainNavHeightVar, 0);
            setTimeout(_actualizarMainNavHeightVar, 300);
            var _mainNavObsTry = function() {
                var nav = document.getElementById('mainNav');
                if (!nav || typeof MutationObserver !== 'function') return;
                if (window._mainNavHeightVarObserver) return;
                window._mainNavHeightVarObserver = new MutationObserver(function() {
                    _actualizarMainNavHeightVar();
                });
                window._mainNavHeightVarObserver.observe(nav, { attributes: true, attributeFilter: ['style', 'class'] });
            };
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', _mainNavObsTry);
            } else {
                _mainNavObsTry();
            }
        }
        window._gymFilterUiState = window._gymFilterUiState || { active: null };
        function _gymEsModoFiltrosMovil() {
            return window.innerWidth <= 768;
        }
        function _gymActualizarLabelFechaDuplicado(modalFecha, fechaIso) {
            if (!modalFecha) return;
            var display = modalFecha.querySelector('#_gymDupDateInputDisplay');
            if (!display) return;
            if (fechaIso && typeof _formatFechaDisplay === 'function') {
                display.textContent = _formatFechaDisplay(fechaIso);
                return;
            }
            display.textContent = fechaIso || 'Seleccionar fecha';
        }
        function _gymSetFiltroMovilActivo(filterName) {
            var bar = document.getElementById('filtros-bar-gym');
            if (!bar) return;
            var next = filterName || null;
            if (!_gymEsModoFiltrosMovil()) next = null;
            bar.querySelectorAll('.gym-filter-slot').forEach(function(slot) {
                var isOpen = !!next && slot.dataset.filter === next;
                slot.classList.toggle('is-open', isOpen);
            });
            window._gymFilterUiState.active = next;
            if (next) {
                var input = bar.querySelector('.gym-filter-input-wrap[data-filter="' + next + '"] input');
                if (input) setTimeout(function() { try { input.focus(); input.select(); } catch (e) {} }, 120);
            }
        }
        function _gymResetStickyBarFixed() {
            var bar = document.getElementById('filtros-bar-gym');
            if (!bar) return;
            bar.style.position = '';
            bar.style.top = '';
            bar.style.left = '';
            bar.style.width = '';
            bar.style.right = '';
            bar.style.zIndex = '';
            if (bar._gymFixedPlaceholder) bar._gymFixedPlaceholder.style.display = 'none';
            bar.dataset.fixedActive = '0';
        }
        function _gymActualizarStickyBarFija() {
            var bar = document.getElementById('filtros-bar-gym');
            var section = document.getElementById('fitness-gimnasio');
            if (!bar || !section) return;
            if (!_gymEsVistaVisible(section)) {
                _gymResetStickyBarFixed();
                return;
            }
            var topBase = 12;
            var mainNav = document.getElementById('mainNav');
            if (mainNav && _gymEsVistaVisible(mainNav)) {
                topBase += Math.ceil(mainNav.getBoundingClientRect().height || 0);
            }
            var sectionRect = section.getBoundingClientRect();
            var rect = bar.getBoundingClientRect();
            var shouldFix = sectionRect.top <= topBase && sectionRect.bottom > (topBase + rect.height + 18);
            if (!bar._gymFixedPlaceholder) {
                var placeholder = document.createElement('div');
                placeholder.style.display = 'none';
                placeholder.style.width = '100%';
                placeholder.setAttribute('aria-hidden', 'true');
                bar.insertAdjacentElement('afterend', placeholder);
                bar._gymFixedPlaceholder = placeholder;
            }
            if (!shouldFix) {
                _gymResetStickyBarFixed();
                return;
            }
            var placeholderEl = bar._gymFixedPlaceholder;
            placeholderEl.style.display = 'block';
            placeholderEl.style.height = rect.height + 'px';
            placeholderEl.style.marginBottom = (window.getComputedStyle ? window.getComputedStyle(bar).marginBottom : '0px');
            bar.style.position = 'fixed';
            bar.style.top = topBase + 'px';
            bar.style.left = rect.left + 'px';
            bar.style.width = rect.width + 'px';
            bar.style.right = 'auto';
            bar.style.zIndex = '180';
            bar.dataset.fixedActive = '1';
        }
        if (!window._gymStickyBarFixedInit) {
            window._gymStickyBarFixedInit = true;
            var _gymStickyBarUpdate = function() {
                requestAnimationFrame(_gymActualizarStickyBarFija);
            };
            document.addEventListener('scroll', _gymStickyBarUpdate, true);
            window.addEventListener('scroll', _gymStickyBarUpdate, { passive: true });
            window.addEventListener('resize', _gymStickyBarUpdate);
            window.addEventListener('orientationchange', _gymStickyBarUpdate);
            document.addEventListener('DOMContentLoaded', _gymStickyBarUpdate);
            document.addEventListener('visibilitychange', function() { setTimeout(_gymActualizarStickyBarFija, 10); });
            window.addEventListener('pageshow', function() { setTimeout(_gymActualizarStickyBarFija, 30); });
            setTimeout(_gymStickyBarUpdate, 0);
            setTimeout(_gymStickyBarUpdate, 250);
        }
        function _gymLeerFiltrosActivos() {
            return {
                badge: _gymFilterText(document.getElementById('gym-filter-badge')?.value),
                maquina: _gymFilterText(document.getElementById('gym-filter-maquina')?.value)
            };
        }
        function _gymCardPasaFiltros(card, filtros) {
            if (!card) return true;
            var badge = _gymFilterText(card.querySelector('.gym-card-badge-cat')?.textContent);
            var maquina = _gymFilterText(card.querySelector('.gym-card-badge-maq')?.textContent);
            if (filtros.badge && badge.indexOf(filtros.badge) === -1) return false;
            if (filtros.maquina && maquina.indexOf(filtros.maquina) === -1) return false;
            return true;
        }
        function _gymAplicarFiltrosEnGrid(grid, filtros) {
            if (!grid) return;
            var cards = Array.from(grid.querySelectorAll(':scope > .gym-card'));
            var visibles = 0;
            cards.forEach(function(card) {
                var visible = _gymCardPasaFiltros(card, filtros);
                card.style.display = visible ? '' : 'none';
                if (visible) visibles++;
            });
            var emptyEl = grid._gymFilterEmptyEl;
            if (!emptyEl) {
                emptyEl = document.createElement('div');
                emptyEl.className = 'gym-filter-empty-state';
                emptyEl.style.cssText = 'display:none;background:rgba(15,23,42,0.45);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:18px 16px;text-align:center;color:#64748b;font-size:12px;font-weight:700;margin-top:10px;';
                emptyEl.textContent = 'No hay ejercicios que coincidan con esos filtros.';
                grid.insertAdjacentElement('afterend', emptyEl);
                grid._gymFilterEmptyEl = emptyEl;
            }
            emptyEl.style.display = (cards.length > 0 && visibles === 0) ? '' : 'none';
        }
        function _gymAplicarFiltrosActivos() {
            var filtros = _gymLeerFiltrosActivos();
            document.querySelectorAll('.gym-panel-grid').forEach(function(grid) {
                _gymAplicarFiltrosEnGrid(grid, filtros);
            });
        }
        function _gymInitFilterBar() {
            var bar = document.getElementById('filtros-bar-gym');
            if (!bar) return;
            var badgeInp = document.getElementById('gym-filter-badge');
            var maqInp = document.getElementById('gym-filter-maquina');
            if (badgeInp && badgeInp.dataset.filterInit !== '1') {
                badgeInp.dataset.filterInit = '1';
                badgeInp.addEventListener('input', _gymAplicarFiltrosActivos);
                badgeInp.addEventListener('focus', function() { _gymSetFiltroMovilActivo('badge'); });
            }
            if (maqInp && maqInp.dataset.filterInit !== '1') {
                maqInp.dataset.filterInit = '1';
                maqInp.addEventListener('input', _gymAplicarFiltrosActivos);
                maqInp.addEventListener('focus', function() { _gymSetFiltroMovilActivo('maquina'); });
            }
            if (bar.dataset.filterUiInit !== '1') {
                bar.dataset.filterUiInit = '1';
                bar.querySelectorAll('.gym-filter-toggle').forEach(function(btn) {
                    btn.addEventListener('click', function(ev) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        var filter = btn.dataset.filter || null;
                        if (!_gymEsModoFiltrosMovil()) {
                            var target = document.getElementById(filter === 'badge' ? 'gym-filter-badge' : 'gym-filter-maquina');
                            if (target) target.focus();
                            return;
                        }
                        _gymSetFiltroMovilActivo(window._gymFilterUiState.active === filter ? null : filter);
                    });
                });
                document.addEventListener('click', function(ev) {
                    if (!_gymEsModoFiltrosMovil()) return;
                    var activeBar = document.getElementById('filtros-bar-gym');
                    if (activeBar && !activeBar.contains(ev.target)) _gymSetFiltroMovilActivo(null);
                });
                window.addEventListener('resize', function() {
                    if (!_gymEsModoFiltrosMovil()) _gymSetFiltroMovilActivo(null);
                });
            }
        }
        function _gymCalcularKmCardioDesdeCards(cardsPorPanel) {
            var total = 0;
            var lista = cardsPorPanel && cardsPorPanel.cardio;
            if (!Array.isArray(lista)) return 0;
            lista.forEach(function(card) {
                if (!card) return;
                // En cardio, el campo de la derecha (gym-card-kg) representa KM.
                total += _gymNum(card.kg);
            });
            return Math.max(0, Math.round(total * 100) / 100);
        }
        function _gymActualizarStatCardioKm(fechaKey) {
            var el = document.getElementById('gym-stat-cardio-km');
            if (!el) return 0;
            var sesiones = window._gymSesionesHistorial || {};
            var key = fechaKey || _gymFechaKey(0);
            var s = sesiones[key] || {};
            var totalKm = 0;

            if (s.cards) {
                totalKm = _gymCalcularKmCardioDesdeCards(s.cards);
            } else {
                totalKm = _gymNum(s.cardio || 0);
            }

            if (totalKm === 0) {
                // Fallback visual en vivo antes de persistencia completa.
                var panelCardio = document.getElementById('gym-panel-cardio');
                if (panelCardio) {
                    panelCardio.querySelectorAll('.gym-card .gym-card-kg').forEach(function(inp) {
                        totalKm += _gymNum(inp.value);
                    });
                    totalKm = Math.max(0, Math.round(totalKm * 100) / 100);
                }
            }

            el.dataset.totalKm = totalKm.toFixed(2);
            el.textContent = totalKm.toFixed(1);
            return totalKm;
        }
        function _gymActualizarStatEjercicios(fechaKey) {
            var el = document.getElementById('gym-stat-ejercicios');
            if (!el) return 0;
            var sesiones = window._gymSesionesHistorial || {};
            var key = fechaKey || _gymFechaKey(0);
            var ses = sesiones[key];
            var total = (ses && ses.cards)
                ? _gymContarCompletadosDesdeCards(ses.cards)
                : document.querySelectorAll('.gym-check-btn[data-completado="1"]').length;
            el.textContent = total;
            return total;
        }
        function gymGuardarSesionDia(fechaKey) {
            if (!fechaKey) fechaKey = _gymFechaKey(0);
            var sesiones = window._gymSesionesHistorial || {};
            var cards = {};
            ['pecho','espalda','brazo','pierna','cardio'].forEach(function(p) {
                var panel = document.getElementById('gym-panel-' + p);
                if (!panel) { cards[p] = []; return; }
                cards[p] = Array.from(panel.querySelectorAll('.gym-card')).map(function(card) {
                    var imgEl = card.querySelector('.gym-card-img img');
                    var timeBadge = card.querySelector('.gym-card-time-badge');
                    var metricasCardio = _gymSerializarMetricasCardioCard(card);
                    return {
                        nombre: card.querySelector('.gym-card-nombre')?.textContent?.trim() || '',
                        desc:   card.querySelector('.gym-card-desc')?.textContent?.trim() || '',
                        badge:  card.querySelector('.gym-card-badge-cat')?.textContent?.trim() || '',
                        badgeMaquina: card.querySelector('.gym-card-badge-maq')?.textContent?.trim() || '',
                        series: card.querySelector('input.gym-card-series')?.value || '3',
                        reps:   card.querySelector('input.gym-card-reps')?.value || '12',
                        kg:     card.querySelector('input.gym-card-kg')?.value || '0',
                        rir:    card.querySelector('input.gym-card-rir')?.value || '',
                        rpe:    card.querySelector('input.gym-card-rpe')?.value || '',
                        cardioSeriesLabel: metricasCardio ? metricasCardio.cardioSeriesLabel : '',
                        cardioRepsLabel: metricasCardio ? metricasCardio.cardioRepsLabel : '',
                        cardioRirLabel: metricasCardio ? metricasCardio.cardioRirLabel : '',
                        cardioRpeLabel: metricasCardio ? metricasCardio.cardioRpeLabel : '',
                        imgSrc: imgEl ? imgEl.src : '',
                        cardTimeSecs: timeBadge ? parseInt(timeBadge.dataset.totalSecs || 0) : 0,
                        completado: (function(c){ var cb = c.querySelector('.gym-check-btn'); return cb ? cb.dataset.completado === '1' : false; })(card),
                        rutaCoords: card.dataset.rutaCoords ? JSON.parse(card.dataset.rutaCoords) : null,
                        rutaNombre: card.dataset.rutaNombre || '',
                        rutaUrl:    card.dataset.rutaUrl || '',
                        rutaCsv:    card.dataset.rutaCsv || ''
                    };
                });
            });
            var prev = sesiones[fechaKey] || {};
            var ejerciciosTotalesDia = _gymContarCompletadosDesdeCards(cards);
            var cardioKmDia = _gymCalcularKmCardioDesdeCards(cards);
            sesiones[fechaKey] = {
                tiempo:      parseInt(document.getElementById('gym-stat-tiempo')?.dataset.totalSecs || prev.tiempo || 0),
                reposo:      (fechaKey !== _gymFechaKey(0) && _gymReposoRunning()) ? (prev.reposo || 0) : parseInt(document.getElementById('gym-stat-reposo')?.dataset.totalSecs || prev.reposo || 0),
                hidratacion: parseFloat(document.getElementById('gym-stat-hidratacion')?.dataset.litros || prev.hidratacion || 0),
                cardio:      cardioKmDia,
                calorias:    document.getElementById('gym-stat-calorias')?.textContent || prev.calorias || '—',
                ejercicios:  ejerciciosTotalesDia,
                peso:        parseFloat(document.getElementById('gym-peso-usuario')?.value || prev.peso || 0),
                cards:       cards
            };
            window._gymSesionesHistorial = sesiones;
            if (typeof _gymActualizarStatCardioKm === 'function') _gymActualizarStatCardioKm(fechaKey);
            if (typeof guardarDatos === 'function') guardarDatos();
        }
        function gymGuardarSesionHoy() {
            var ctx = _gymContextoActivo();
            if (!ctx.esDia) return;
            if (!ctx.esHoy) {
                gymGuardarSesionDia(ctx.fechaKey);
                return;
            }
            // Defensive guard: never let a historical DOM snapshot overwrite today's key.
            if (ctx.domHistorico) return;

            var fecha = _gymFechaKey(0);
            var sesiones = window._gymSesionesHistorial || {};
            var cards = {};
            ['pecho','espalda','brazo','pierna','cardio'].forEach(function(p) {
                var panel = document.getElementById('gym-panel-' + p);
                if (!panel) { cards[p] = []; return; }
                cards[p] = Array.from(panel.querySelectorAll('.gym-card')).map(function(card) {
                    var imgEl = card.querySelector('.gym-card-img img');
                    var timeBadge = card.querySelector('.gym-card-time-badge');
                    var metricasCardio = _gymSerializarMetricasCardioCard(card);
                    return {
                        nombre: card.querySelector('.gym-card-nombre')?.textContent?.trim() || '',
                        desc:   card.querySelector('.gym-card-desc')?.textContent?.trim() || '',
                        badge:  card.querySelector('.gym-card-badge-cat')?.textContent?.trim() || '',
                        badgeMaquina: card.querySelector('.gym-card-badge-maq')?.textContent?.trim() || '',
                        series: card.querySelector('input.gym-card-series')?.value || '3',
                        reps:   card.querySelector('input.gym-card-reps')?.value || '12',
                        kg:     card.querySelector('input.gym-card-kg')?.value || '0',
                        rir:    card.querySelector('input.gym-card-rir')?.value || '',
                        rpe:    card.querySelector('input.gym-card-rpe')?.value || '',
                        cardioSeriesLabel: metricasCardio ? metricasCardio.cardioSeriesLabel : '',
                        cardioRepsLabel: metricasCardio ? metricasCardio.cardioRepsLabel : '',
                        cardioRirLabel: metricasCardio ? metricasCardio.cardioRirLabel : '',
                        cardioRpeLabel: metricasCardio ? metricasCardio.cardioRpeLabel : '',
                        imgSrc: imgEl ? imgEl.src : '',
                        cardTimeSecs: timeBadge ? parseInt(timeBadge.dataset.totalSecs || 0) : 0,
                        completado: (function(c){ var cb = c.querySelector('.gym-check-btn'); return cb ? cb.dataset.completado === '1' : false; })(card),
                        rutaCoords: card.dataset.rutaCoords ? JSON.parse(card.dataset.rutaCoords) : null,
                        rutaNombre: card.dataset.rutaNombre || '',
                        rutaUrl:    card.dataset.rutaUrl || '',
                        rutaCsv:    card.dataset.rutaCsv || ''
                    };
                });
            });
            var ejerciciosTotalesHoy = _gymContarCompletadosDesdeCards(cards);
            var cardioKmHoy = _gymCalcularKmCardioDesdeCards(cards);
            sesiones[fecha] = {
                tiempo:     parseInt(document.getElementById('gym-stat-tiempo')?.dataset.totalSecs || 0),
                reposo:     parseInt(document.getElementById('gym-stat-reposo')?.dataset.totalSecs || 0),
                hidratacion:parseFloat(document.getElementById('gym-stat-hidratacion')?.dataset.litros || 0),
                cardio:     cardioKmHoy,
                calorias:   document.getElementById('gym-stat-calorias')?.textContent || '—',
                ejercicios: ejerciciosTotalesHoy,
                peso:       parseFloat(document.getElementById('gym-peso-usuario')?.value || 0),
                cards:      cards
            };
            window._gymSesionesHistorial = sesiones;
            if (typeof _gymActualizarStatCardioKm === 'function') _gymActualizarStatCardioKm(fecha);
            if (typeof guardarDatos === 'function') guardarDatos();
        }
        function _gymRenderCards(panel, cards, readonly) {
            panel.querySelectorAll('.gym-panel-grid, ._gymHistoricoMsg, .gym-empty-state').forEach(function(el){ el.remove(); });
            if (!cards || cards.length === 0) {
                if (typeof _gymEmptyState === 'function') _gymEmptyState(panel);
                return;
            }
            var grid = document.createElement('div');
            grid.className = 'gym-panel-grid';
            panel.appendChild(grid);
            var panelCategory = panel.id.replace('gym-panel-', '');
            cards.forEach(function(e, index) {
                if (typeof _crearGymCardHTML !== 'function') return;
                var cardHTML = '<div class="gym-card" data-panel="' + panelCategory + '" data-card-index="' + index + '" style="background:rgba(15,23,42,0.7);border:2px solid rgba(234,179,8,0.2);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;">' + _crearGymCardHTML(e) + '</div>';
                grid.insertAdjacentHTML('beforeend', cardHTML);
                var newCard = grid.lastElementChild;
                if (newCard && (_gymObjetoTieneMetricasCardio(e) || panelCategory === 'cardio') && typeof _gymAsignarMetricasCardioEnCard === 'function') _gymAsignarMetricasCardioEnCard(newCard, e);
                if (newCard && typeof _gymAplicarModoCardioEnCard === 'function') _gymAplicarModoCardioEnCard(newCard);
                if (e.cardTimeSecs && e.cardTimeSecs > 0) {
                    var badge = newCard.querySelector('.gym-card-time-badge');
                    var label = newCard.querySelector('.gym-card-time-label');
                    if (badge && label) {
                        badge.dataset.totalSecs = e.cardTimeSecs;
                        var h = Math.floor(e.cardTimeSecs / 3600), m = Math.floor((e.cardTimeSecs % 3600) / 60), s = e.cardTimeSecs % 60;
                        label.textContent = h > 0 ? h + 'h ' + String(m).padStart(2,'0') + 'm' : String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
                        badge.style.display = 'flex'; badge.removeAttribute('data-hidden');
                    }
                }
                if (e.completado && newCard && typeof _gymSetCardLocked === 'function') _gymSetCardLocked(newCard, true);
                if (newCard && e.rutaCoords && Array.isArray(e.rutaCoords) && e.rutaCoords.length >= 2) {
                    newCard.dataset.rutaCoords = JSON.stringify(e.rutaCoords);
                    if (e.rutaNombre) newCard.dataset.rutaNombre = e.rutaNombre;
                    if (e.rutaUrl) newCard.dataset.rutaUrl = e.rutaUrl;
                    if (e.rutaCsv) newCard.dataset.rutaCsv = e.rutaCsv;
                }
            });
            _initGymSortable(grid);
            if (readonly) grid.dataset.historico = '1';
            if (typeof _gymUpdateBolts === 'function') setTimeout(function(){ _gymUpdateBolts(grid); }, 50);
            setTimeout(_gymAplicarFiltrosActivos, 0);
        }

        function gymCargarStatsParaIntervalo() {
            var el = document.getElementById('gym-intervalo-label');
            if (!el) return;
            var filtro = el.dataset.filtro || 'dia';
            var offset = parseInt(el.dataset.offset || 0);
            var sesiones = window._gymSesionesHistorial || {};
            var esHoy = (filtro === 'dia' && offset === 0);
            var _esMultiple = (filtro !== 'dia');
            // Lock/unlock reposo buttons based on whether we are viewing today
            if (typeof _gymReposoSetBloqueado === 'function') _gymReposoSetBloqueado(!esHoy);
            var _wrapper = document.getElementById('gym-controles-wrapper');
            var _histCont = document.getElementById('gym-historico-container');
            var _paneles = ['pecho','espalda','brazo','pierna','cardio'];
            if (_wrapper) _wrapper.style.display = _esMultiple ? 'none' : '';
            if (_histCont) _histCont.style.display = _esMultiple ? '' : 'none';
            _paneles.forEach(function(p) {
                var panel = document.getElementById('gym-panel-' + p);
                if (!panel) return;
                if (_esMultiple) {
                    panel.style.display = 'none';
                } else {
                    panel.style.display = p === (window._vistaGymActiva || 'pecho') ? '' : 'none';
                }
            });
            if (filtro === 'dia') {
                var fechaKey = _gymFechaKey(offset);
                var cardsFecha = esHoy ? null : (sesiones[fechaKey] && sesiones[fechaKey].cards);
                ['pecho','espalda','brazo','pierna','cardio'].forEach(function(p) {
                    var panel = document.getElementById('gym-panel-' + p);
                    if (!panel) return;
                    if (esHoy) {
                        var grid = panel.querySelector('.gym-panel-grid');
                        if (!grid || grid.dataset.historico === '1') {
                            var hoy = _gymFechaKey(0);
                            var cardsHoy = sesiones[hoy] && sesiones[hoy].cards && sesiones[hoy].cards[p];
                            panel.querySelectorAll('.gym-panel-grid, ._gymHistoricoMsg, .gym-empty-state').forEach(function(el){ el.remove(); });
                            _gymRenderCards(panel, cardsHoy);
                        } else {
                            if (!grid._sortable) _initGymSortable(grid);
                        }
                    } else {
                        panel.querySelectorAll('.gym-panel-grid, ._gymHistoricoMsg, .gym-empty-state').forEach(function(el){ el.remove(); });
                        if (cardsFecha && cardsFecha[p] && cardsFecha[p].length > 0) {
                            _gymRenderCards(panel, cardsFecha[p], true); // true = readonly
                        } else {
                            panel.insertAdjacentHTML('beforeend', '<div class="gym-empty-state" style="background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:40px;text-align:center;"><span class="material-symbols-rounded" style="font-size:48px;color:#334155;display:block;margin-bottom:12px;">interests</span><p style="color:#475569;font-size:14px;margin:0;">Sin sesiones en este día</p></div>');
                        }
                    }
                });
                if (esHoy) {
                    _initAllGymCards();
                    if (_gymReposoRunning()) { _gymReposoRestoreBtn(); }
                    var sHoy = sesiones[_gymFechaKey(0)];
                    if (sHoy) {
                        var tEl2 = document.getElementById('gym-stat-tiempo');
                        if (tEl2) { tEl2.dataset.totalSecs = sHoy.tiempo||0; tEl2.textContent = _gymSecsToLabel(sHoy.tiempo||0); }
                        var rEl2 = document.getElementById('gym-stat-reposo');
                        if (rEl2 && !_gymReposoRunning()) { rEl2.dataset.totalSecs = sHoy.reposo||0; rEl2.textContent = _gymSecsToLabel(sHoy.reposo||0); }
                        var hEl2 = document.getElementById('gym-stat-hidratacion');
                        if (hEl2) { hEl2.dataset.litros = parseFloat(sHoy.hidratacion||0).toFixed(2); hEl2.textContent = parseFloat(sHoy.hidratacion||0).toFixed(1).replace(',','.'); }
                        var cEl2 = document.getElementById('gym-stat-calorias');
                        if (cEl2) cEl2.textContent = sHoy.calorias || '—';
                        var eEl2 = document.getElementById('gym-stat-ejercicios');
                        if (eEl2) eEl2.textContent = _gymContarCompletadosDesdeCards((sHoy && sHoy.cards) || {});
                    }
                    _gymActualizarStatCardioKm(_gymFechaKey(0));
                    return;
                } else {
                    var sDia = sesiones[fechaKey] || {};
                    var tEl3 = document.getElementById('gym-stat-tiempo');
                    if (tEl3) { tEl3.dataset.totalSecs = sDia.tiempo||0; tEl3.textContent = _gymSecsToLabel(sDia.tiempo||0); }
                    var rEl3 = document.getElementById('gym-stat-reposo');
                    if (rEl3 && !_gymReposoRunning()) { rEl3.dataset.totalSecs = sDia.reposo||0; rEl3.textContent = _gymSecsToLabel(sDia.reposo||0); }
                    var hEl3 = document.getElementById('gym-stat-hidratacion');
                    if (hEl3) { hEl3.dataset.litros = parseFloat(sDia.hidratacion||0).toFixed(2); hEl3.textContent = parseFloat(sDia.hidratacion||0).toFixed(1).replace(',','.'); }
                    var cEl3 = document.getElementById('gym-stat-calorias');
                    if (cEl3) cEl3.textContent = sDia.calorias || '—';
                    var eEl3 = document.getElementById('gym-stat-ejercicios');
                    if (eEl3) eEl3.textContent = _gymContarCompletadosDesdeCards((sDia && sDia.cards) || {});
                    _gymActualizarStatCardioKm(fechaKey);
                    if (_gymReposoRunning()) setTimeout(function(){ _gymReposoSetAllIcons(true); }, 50);
                    return;
                }
            }
            var fechas = [];
            var hoy = new Date();
            if (filtro === 'dia') {
                var d = new Date(hoy); d.setDate(d.getDate() + offset);
                fechas = [_gymISODateLocal(d)];
            } else if (filtro === 'semana') {
                var lun = new Date(hoy);
                lun.setDate(hoy.getDate() - ((hoy.getDay()+6)%7) + offset*7);
                for (var i = 0; i < 7; i++) { var dd = new Date(lun); dd.setDate(lun.getDate()+i); fechas.push(_gymISODateLocal(dd)); }
            } else if (filtro === 'mes') {
                var year = hoy.getFullYear(), month = hoy.getMonth() + offset;
                while (month < 0) { month += 12; year--; }
                while (month > 11) { month -= 12; year++; }
                var dias = new Date(year, month+1, 0).getDate();
                for (var i = 1; i <= dias; i++) fechas.push(year+'-'+String(month+1).padStart(2,'0')+'-'+String(i).padStart(2,'0'));
            } else if (filtro === 'ano') {
                var y = hoy.getFullYear() + offset;
                for (var m2 = 0; m2 < 12; m2++) { var dias2 = new Date(y,m2+1,0).getDate(); for (var d2 = 1; d2 <= dias2; d2++) fechas.push(y+'-'+String(m2+1).padStart(2,'0')+'-'+String(d2).padStart(2,'0')); }
            } else if (filtro === 'todo') {
                fechas = Object.keys(sesiones).sort();
            } else if (filtro === 'rango') {
                var _rDesde = window._gymRangoDesde || '';
                var _rHasta = window._gymRangoHasta || '';
                fechas = Object.keys(sesiones).filter(function(f) {
                    if (_rDesde && f < _rDesde) return false;
                    if (_rHasta && f > _rHasta) return false;
                    return true;
                }).sort();
            }
            var totTiempo = 0, totReposo = 0, totHid = 0, totKcal = 0, totEj = 0, totCardio = 0;
            fechas.forEach(function(f) {
                var s = sesiones[f];
                if (!s) return;
                totTiempo  += (s.tiempo      || 0);
                totReposo  += (s.reposo      || 0);
                totHid     += parseFloat(s.hidratacion || 0);
                var kmDia = s.cards ? _gymCalcularKmCardioDesdeCards(s.cards) : parseFloat(s.cardio || 0);
                totCardio  += kmDia;
                if (s.calorias && s.calorias !== '—') totKcal += parseInt(s.calorias) || 0;
                var ejDia = s.cards ? _gymContarCompletadosDesdeCards(s.cards) : (s.ejercicios || 0);
                totEj      += ejDia;
            });
            var tEl = document.getElementById('gym-stat-tiempo');
            if (tEl) { tEl.dataset.totalSecs = totTiempo; tEl.textContent = _gymSecsToLabel(totTiempo); }
            var rEl = document.getElementById('gym-stat-reposo');
            if (rEl) { rEl.dataset.totalSecs = totReposo; rEl.textContent = _gymSecsToLabel(totReposo); }
            var hEl = document.getElementById('gym-stat-hidratacion');
            if (hEl) { hEl.dataset.litros = totHid.toFixed(2); hEl.textContent = totHid.toFixed(1).replace(',','.'); }
            var cEl = document.getElementById('gym-stat-calorias');
            if (cEl) cEl.textContent = totKcal > 0 ? totKcal : '—';
            var eEl = document.getElementById('gym-stat-ejercicios');
            if (eEl) eEl.textContent = totEj > 0 ? totEj : '0';
            var cdEl = document.getElementById('gym-stat-cardio-km');
            if (cdEl) {
                cdEl.dataset.totalKm = totCardio.toFixed(2);
                cdEl.textContent = totCardio > 0 ? totCardio.toFixed(1) : '0.0';
            }
            if (_esMultiple && _histCont) {
                var _DIAS_ES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
                var _MESES_ES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
                var _MESES_FULL = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

                var fechasConSesion = fechas.filter(function(f) {
                    if (!sesiones[f] || !sesiones[f].cards) return false;
                    return _paneles.some(function(p) { return sesiones[f].cards[p] && sesiones[f].cards[p].length > 0; });
                });

                var html = '';
                if (fechasConSesion.length === 0) {
                    html = '<div style="background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:40px;text-align:center;"><span class="material-symbols-rounded" style="font-size:48px;color:#334155;display:block;margin-bottom:12px;">interests</span><p style="color:#475569;font-size:14px;margin:0;">Sin sesiones en este período</p></div>';
                } else {
                    fechasConSesion.slice().reverse().forEach(function(fechaKey) {
                        var s = sesiones[fechaKey];
                        var d = new Date(fechaKey + 'T12:00:00');
                        var diaSem  = _DIAS_ES[d.getDay()];
                        var diaMes  = d.getDate();
                        var mes     = _MESES_FULL[d.getMonth()];
                        var hoyKey  = _gymFechaKey(0);
                        var esHoyBadge = fechaKey === hoyKey
                            ? '<span style="background:rgba(234,179,8,0.15);color:#eab308;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;padding:2px 7px;border-radius:6px;border:1px solid rgba(234,179,8,0.3);">HOY</span>'
                            : '';
                        var chips = [];
                        if (s.tiempo)      chips.push({ icon:'timer',          color:'#60a5fa', val: _gymSecsToLabel(s.tiempo) });
                        if (s.ejercicios)  chips.push({ icon:'exercise', color:'#10b981', val: s.ejercicios + ' ej.' });
                        if (s.calorias && s.calorias !== '—') chips.push({ icon:'local_fire_department', color:'#eab308', val: s.calorias + ' kcal' });
                        if (s.hidratacion) chips.push({ icon:'water_drop',     color:'#22d3ee', val: parseFloat(s.hidratacion).toFixed(1).replace(',','.') + ' L' });
                        if (s.cardio)      chips.push({ icon:'directions_run', color:'#f97316', val: parseFloat(s.cardio).toFixed(1) + ' km' });
                        if (s.reposo)      chips.push({ icon:'pause_circle',   color:'#a78bfa', val: _gymSecsToLabel(s.reposo) });

                        var chipsHtml = chips.map(function(c) {
                            return '<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:4px 10px;">'
                                 + '<span class="material-symbols-rounded" style="font-size:13px;color:'+c.color+';">'+c.icon+'</span>'
                                 + '<span style="color:#94a3b8;font-size:12px;font-weight:600;">'+c.val+'</span>'
                                 + '</span>';
                        }).join('');
                        var todosEj = [];
                        _paneles.forEach(function(p) { if (s.cards && s.cards[p]) todosEj = todosEj.concat(s.cards[p].map(function(e) { return Object.assign({}, e, { _panel: p }); })); });
                        var ejHtml = todosEj.map(function(ej) {
                            var label = ej.nombre || '—';
                            var tieneMetricasCardio = !!(ej.cardioSeriesLabel || ej.cardioRepsLabel || ej.cardioRirLabel || ej.cardioRpeLabel);
                            var esCardio = ej.badge === 'CARDIO' || tieneMetricasCardio || ej._panel === 'cardio';
                            var detalleHtml = '';
                            if (esCardio) {
                                // Show up to 4 cardio metric labels with values
                                var metPairs = [
                                    { lbl: ej.cardioSeriesLabel, val: ej.series },
                                    { lbl: ej.cardioRepsLabel,   val: ej.reps },
                                    { lbl: ej.cardioRirLabel,    val: ej.rir },
                                    { lbl: ej.cardioRpeLabel,    val: ej.rpe }
                                ].filter(function(p) { return p.lbl && p.val && p.val !== '0'; });
                                if (metPairs.length > 0) {
                                    detalleHtml = ' <span style="color:#64748b;font-size:10px;display:inline-flex;flex-wrap:wrap;gap:3px;">'
                                        + metPairs.map(function(p) {
                                            return '<span style="background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.2);border-radius:5px;padding:1px 5px;color:#fb923c;font-size:9px;font-weight:700;">'
                                                 + p.lbl + ' <span style="color:#94a3b8;font-weight:600;">' + p.val + '</span></span>';
                                          }).join('')
                                        + '</span>';
                                }
                            } else {
                                if (ej.series && ej.reps) {
                                    detalleHtml = ' <span style="color:#475569;font-size:10px;">'
                                        + '<span style="color:#64748b;font-size:9px;font-weight:700;">S</span>' + ej.series
                                        + '<span style="color:#334155;font-size:9px;font-weight:600;margin:0 2px;">×</span>'
                                        + '<span style="color:#64748b;font-size:9px;font-weight:700;">R</span>' + ej.reps
                                        + '</span>';
                                }
                            }
                            var maqHtml = ej.badgeMaquina ? '<span style="font-size:9px;font-weight:700;color:#64748b;border:1px solid rgba(71,85,105,0.3);border-radius:4px;padding:0 4px;margin-left:2px;">'+ej.badgeMaquina+'</span>' : '';
                            return '<span style="display:inline-flex;align-items:center;gap:5px;background:rgba(15,23,42,0.7);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:4px 10px;">'
                                 + (ej.badge ? '<span style="font-size:9px;font-weight:800;color:#eab308;text-transform:uppercase;letter-spacing:0.05em;">'+ej.badge+'</span><span style="color:#1e293b;font-size:9px;">·</span>' : '')
                                 + '<span style="color:#cbd5e1;font-size:12px;font-weight:600;">'+label+'</span>'
                                 + maqHtml
                                 + detalleHtml
                                 + '</span>';
                        }).join('');

                        html += '<div style="background:rgba(15,23,42,0.5);border:1px solid rgba(234,179,8,0.1);border-radius:14px;padding:14px 16px;margin-bottom:10px;">';
                        html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">'
                              + '<span style="color:#f1f5f9;font-size:14px;font-weight:800;">'+diaSem+' '+diaMes+' '+mes+'</span>'
                              + esHoyBadge
                              + '</div>';
                        if (chipsHtml) {
                            html += '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">'+chipsHtml+'</div>';
                        }
                        if (ejHtml) {
                            html += '<div style="display:flex;flex-wrap:wrap;gap:5px;">'+ejHtml+'</div>';
                        }
                        html += '</div>';
                    });
                }
                _histCont.innerHTML = html;
            }
        }

        function enviarTiempoGym(btn) {
            var card = btn.closest('.gym-card');
            var timerBtn = card.querySelector('.gym-timer-btn');
            var secs = parseInt(timerBtn.dataset.elapsed || 0);
            if (secs < 1) return;
            var statEl = document.getElementById('gym-stat-tiempo');
            if (statEl) {
                var prevUploaded = parseInt(timerBtn.dataset.prevUploaded || 0);
                var curSecs = parseInt(statEl.dataset.totalSecs || 0);
                var newAmount = secs - prevUploaded; // Lo nuevo a sumar
                var newSecs = curSecs + newAmount;   // Total = anterior + nuevo
                if (newSecs < 0) newSecs = 0;
                statEl.dataset.totalSecs = newSecs;
                timerBtn.dataset.prevUploaded = secs; // guardar el cronómetro actual
                var h = Math.floor(newSecs / 3600);
                var m = Math.floor((newSecs % 3600) / 60);
                var s = newSecs % 60;
                if (h > 0) {
                    statEl.textContent = h + 'h ' + String(m).padStart(2,'0') + 'm';
                } else {
                    statEl.textContent = String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
                }
            }
            var cardBadge = card.querySelector('.gym-card-time-badge');
            var cardLabel = card.querySelector('.gym-card-time-label');
            if (cardBadge && cardLabel) {
                var cardPrevUploaded = parseInt(timerBtn.dataset.cardPrevUploaded || 0);
                var cardCurSecs = parseInt(cardBadge.dataset.totalSecs || 0);
                var cardNewAmount = secs - cardPrevUploaded; // Lo nuevo a sumar
                var cardNewSecs = cardCurSecs + cardNewAmount; // Total = anterior + nuevo
                if (cardNewSecs < 0) cardNewSecs = 0;
                cardBadge.dataset.totalSecs = cardNewSecs;
                timerBtn.dataset.cardPrevUploaded = secs;
                var ch = Math.floor(cardNewSecs / 3600);
                var cm = Math.floor((cardNewSecs % 3600) / 60);
                var cs = cardNewSecs % 60;
                if (ch > 0) {
                    cardLabel.textContent = ch + 'h ' + String(cm).padStart(2,'0') + 'm';
                } else {
                    cardLabel.textContent = String(cm).padStart(2,'0') + ':' + String(cs).padStart(2,'0');
                }
                cardBadge.style.display = 'flex'; cardBadge.removeAttribute('data-hidden');
            }
            gymRecalcularCalorias();
            gymGuardarSesionHoy();
            btn.style.background = 'rgba(234,179,8,0.3)';
            btn.style.borderColor = 'rgba(234,179,8,0.9)';
            var icon = btn.querySelector('.material-symbols-rounded');
            if(icon){ icon.style.color = '#fde047'; }
            setTimeout(function() {
                btn.style.background = 'rgba(234,179,8,0.12)';
                btn.style.borderColor = 'rgba(234,179,8,0.5)';
                if(icon){ icon.style.color = '#eab308'; }
            }, 700);
        }
        function toggleGymCardMenu(btn) {
            var menu = btn.nextElementSibling;
            var isOpen = menu.style.display === 'block';
            document.querySelectorAll('.gym-card-menu').forEach(function(m) { m.style.display = 'none'; });
            document.querySelectorAll('.gym-card').forEach(function(c) { c.style.overflow = 'hidden'; });
            if (!isOpen) {
                menu.style.display = 'block';
                var card = btn.closest('.gym-card');
                if (card) card.style.overflow = 'visible';
                setTimeout(function() {
                    document.addEventListener('click', function closeMenu(e) {
                        if (!menu.contains(e.target) && e.target !== btn) {
                            menu.style.display = 'none';
                            if (card) card.style.overflow = 'hidden';
                            document.removeEventListener('click', closeMenu);
                        }
                    });
                }, 10);
            }
        }
        window._gymArchivados = (window._gymArchivados && !Array.isArray(window._gymArchivados)) ? window._gymArchivados : {};

        function _gymArchivadosEnCategoria(cat) {
            var c = cat || window._vistaGymActiva || 'pecho';
            if (!window._gymArchivados[c]) window._gymArchivados[c] = [];
            return window._gymArchivados[c];
        }

        function moverGymCard(btn) {
            var card = btn.closest('.gym-card');
            btn.closest('.gym-card-menu').style.display = 'none';
            var vistaActual = window._vistaGymActiva || 'pecho';
            var vistas = ['pecho','espalda','brazo','pierna','cardio'];
            var nombres = {pecho:'Pecho',espalda:'Espalda',brazo:'Brazo',pierna:'Pierna',cardio:'Cardio'};

            // Crear overlay de selección
            var overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.75);z-index:10001;display:flex;align-items:center;justify-content:center;padding:16px;';

            var opciones = vistas.filter(function(v) { return v !== vistaActual; }).map(function(v) {
                return '<button onclick="window._gymMoverDestino(\'' + v + '\')" style="width:100%;display:flex;align-items:center;gap:10px;padding:12px 16px;border:1px solid rgba(71,85,105,0.3);background:rgba(15,23,42,0.8);color:#f1f5f9;font-size:13px;font-weight:700;cursor:pointer;border-radius:10px;text-align:left;transition:background 0.15s;" onmouseover="this.style.background=\'rgba(234,179,8,0.12)\';this.style.borderColor=\'rgba(234,179,8,0.4)\'" onmouseout="this.style.background=\'rgba(15,23,42,0.8)\';this.style.borderColor=\'rgba(71,85,105,0.3)\'">'
                    + '<span class="material-symbols-rounded" style="font-size:18px;color:#64748b;">move_item</span>'
                    + nombres[v]
                    + '</button>';
            }).join('');

            overlay.innerHTML = '<div style="background:#0f172a;border:1px solid rgba(71,85,105,0.35);border-radius:20px;width:100%;max-width:320px;display:flex;flex-direction:column;overflow:hidden;">'
                + '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px 12px;border-bottom:1px solid rgba(255,255,255,0.05);">'
                + '<div style="display:flex;align-items:center;gap:8px;"><span class="material-symbols-rounded" style="font-size:18px;color:#64748b;">move_item</span><span style="color:#f1f5f9;font-size:14px;font-weight:800;">Mover</span></div>'
                + '<button onclick="this.closest(\'[style*=fixed]\').remove()" style="background:none;border:none;color:#64748b;cursor:pointer;padding:4px;"><span class="material-symbols-rounded" style="font-size:20px;">close</span></button>'
                + '</div>'
                + '<div style="padding:12px;display:flex;flex-direction:column;gap:6px;">' + opciones + '</div>'
                + '</div>';

            window._gymMoverDestino = function(destino) {
                overlay.remove();
                delete window._gymMoverDestino;

                // Capturar todo el estado de la card
                var nombre    = card.querySelector('.gym-card-nombre')?.textContent?.trim() || '';
                var desc      = card.querySelector('.gym-card-desc')?.textContent?.trim() || '';
                var badge     = card.querySelector('.gym-card-badge-cat')?.textContent?.trim() || '';
                var badgeMaq  = card.querySelector('.gym-card-badge-maq')?.textContent?.trim() || '';
                var series    = card.querySelector('input.gym-card-series')?.value || '0';
                var reps      = card.querySelector('input.gym-card-reps')?.value || '0';
                var kg        = card.querySelector('input.gym-card-kg')?.value || '0';
                var rir       = card.querySelector('input.gym-card-rir')?.value || '';
                var rpe       = card.querySelector('input.gym-card-rpe')?.value || '';
                var imgHTML   = card.querySelector('.gym-card-img')?.innerHTML || '';
                var checkBtn  = card.querySelector('.gym-check-btn');
                var completado = checkBtn ? (checkBtn.dataset.completado === '1') : false;
                var timerDisplay = card.querySelector('.gym-timer-display')?.textContent || '00:00';
                var badgeEl    = card.querySelector('.gym-card-time-badge');
                var badgeSecs  = badgeEl ? (badgeEl.dataset.totalSecs || '0') : '0';
                var badgeLabel = badgeEl ? (badgeEl.querySelector('.gym-card-time-label')?.textContent || '00:00') : '00:00';
                var badgeHidden = badgeEl ? badgeEl.hasAttribute('data-hidden') : true;
                var metricasCardio = _gymSerializarMetricasCardioCard(card);

                // Al mover entre categorías no cambia el total de ejercicios completados del día.

                // Eliminar card del panel origen con animación
                var panelOrigen = document.getElementById('gym-panel-' + vistaActual);
                card.style.transition = 'opacity 0.25s, transform 0.25s';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(function() {
                    card.remove();
                    if (typeof _gymEmptyState === 'function' && panelOrigen) _gymEmptyState(panelOrigen);
                    if (typeof _gymUpdateBolts === 'function' && panelOrigen) _gymUpdateBolts(panelOrigen.querySelector('.gym-panel-grid'));

                    // Insertar en el panel destino
                    var panelDestino = document.getElementById('gym-panel-' + destino);
                    if (!panelDestino) return;
                    var grid = panelDestino.querySelector('.gym-panel-grid');
                    if (!grid) {
                        grid = document.createElement('div');
                        grid.className = 'gym-panel-grid';
                        panelDestino.appendChild(grid);
                    }
                    var newCard = document.createElement('div');
                    newCard.className = 'gym-card';
                    newCard.style.cssText = 'background:rgba(15,23,42,0.7);border:2px solid rgba(234,179,8,0.2);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;opacity:0;transform:scale(0.95);transition:opacity 0.3s,transform 0.3s;';
                    newCard.innerHTML = _gymCardInnerHTML(nombre, desc, badge, series, reps, imgHTML, kg, badgeMaq, rir, rpe, completado, '00:00');
                    if ((metricasCardio || destino === 'cardio') && typeof _gymAsignarMetricasCardioEnCard === 'function') _gymAsignarMetricasCardioEnCard(newCard, metricasCardio || {});
                    if (typeof _gymAplicarModoCardioEnCard === 'function') _gymAplicarModoCardioEnCard(newCard);

                    // Restaurar badge de tiempo
                    var newBadgeEl = newCard.querySelector('.gym-card-time-badge');
                    if (newBadgeEl) {
                        newBadgeEl.dataset.totalSecs = badgeSecs;
                        if (badgeHidden) { newBadgeEl.setAttribute('data-hidden','1'); newBadgeEl.style.display='none'; }
                        else { newBadgeEl.removeAttribute('data-hidden'); newBadgeEl.style.display='flex'; }
                        var newLabel = newBadgeEl.querySelector('.gym-card-time-label');
                        if (newLabel) newLabel.textContent = badgeLabel;
                    }
                    var newTimerDisplay = newCard.querySelector('.gym-timer-display');
                    if (newTimerDisplay) newTimerDisplay.textContent = timerDisplay;

                    if (window.innerWidth < 768) {
                        newCard.querySelectorAll('.gym-stat-inp').forEach(function(inp) {
                            inp.setAttribute('readonly',''); inp.setAttribute('inputmode','none'); inp.setAttribute('tabindex','-1');
                        });
                    }
                    grid.appendChild(newCard);
                    requestAnimationFrame(function() { newCard.style.opacity='1'; newCard.style.transform='scale(1)'; });
                    if (typeof _initGymCardDrag === 'function') _initGymCardDrag(newCard);
                    if (typeof _gymUpdateBolts === 'function') _gymUpdateBolts(grid);
                    if (typeof initTooltips === 'function') initTooltips();
                    if (typeof _gymEmptyState === 'function') _gymEmptyState(panelDestino);

                    var elInt2 = document.getElementById('gym-intervalo-label');
                    var offset2 = elInt2 ? parseInt(elInt2.dataset.offset || 0) : 0;
                    _gymActualizarStatEjercicios(_gymFechaKey(offset2));
                    if (typeof guardarDatos === 'function') guardarDatos();
                }, 250);
            };

            overlay.addEventListener('click', function(e) { if (e.target === overlay) { overlay.remove(); delete window._gymMoverDestino; } });
            document.body.appendChild(overlay);
        }

        function archivarGymCard(btn) {
            var card = btn.closest('.gym-card');
            btn.closest('.gym-card-menu').style.display = 'none';
            var nombre  = card.querySelector('.gym-card-nombre')?.textContent?.trim() || '';
            var desc    = card.querySelector('.gym-card-desc')?.textContent?.trim() || '';
            var badge   = card.querySelector('.gym-card-badge-cat')?.textContent?.trim() || '';
            var badgeMaquina = card.querySelector('.gym-card-badge-maq')?.textContent?.trim() || '';
            var series  = card.querySelector('input.gym-card-series')?.value || '0';
            var reps    = card.querySelector('input.gym-card-reps')?.value || '0';
            var kg      = card.querySelector('input.gym-card-kg')?.value || '0';
            var rir     = card.querySelector('input.gym-card-rir')?.value || '';
            var rpe     = card.querySelector('input.gym-card-rpe')?.value || '';
            var metricasCardio = _gymSerializarMetricasCardioCard(card);
            var imgEl   = card.querySelector('.gym-card-img img');
            var imgSrc  = imgEl ? imgEl.src : '';
            var imgHTML = card.querySelector('.gym-card-img')?.innerHTML || '';
            var timeBadge = card.querySelector('.gym-card-time-badge');
            var cardTimeSecs = timeBadge ? parseInt(timeBadge.dataset.totalSecs || 0) : 0;
            var cardTimeLabel = card.querySelector('.gym-card-time-label')?.textContent?.trim() || '00:00';
            var checkBtn = card.querySelector('.gym-check-btn');
            if (checkBtn && checkBtn.dataset.completado === '1') {
                var el = document.getElementById('gym-stat-ejercicios');
                if (el) el.textContent = Math.max(0, parseInt(el.textContent||0) - 1);
            }
            var _vistaCat = window._vistaGymActiva || 'pecho';
            _gymArchivadosEnCategoria(_vistaCat).push({ nombre, desc, badge, badgeMaquina, series, reps, kg, rir, rpe, cardioSeriesLabel: metricasCardio ? metricasCardio.cardioSeriesLabel : '', cardioRepsLabel: metricasCardio ? metricasCardio.cardioRepsLabel : '', cardioRirLabel: metricasCardio ? metricasCardio.cardioRirLabel : '', cardioRpeLabel: metricasCardio ? metricasCardio.cardioRpeLabel : '', cardTimeSecs: cardTimeSecs, cardTimeLabel: cardTimeLabel, imgSrc, imgHTML, id: Date.now() });
            _actualizarBadgeGym();
            card.style.transition = 'opacity 0.3s, transform 0.3s';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(function() { card.remove(); if (typeof guardarDatos === 'function') guardarDatos(); var p=document.getElementById('gym-panel-'+(window._vistaGymActiva||'pecho')); if(p&&typeof _gymEmptyState==='function')_gymEmptyState(p); }, 300);
        }

        // ─── RUTAS (CARDIO) ──────────────────────────────────────────────────────
        function gymToggleRutaCardio(btn) {
            var card = btn.closest('.gym-card');
            btn.closest('.gym-card-menu').style.display = 'none';
            var existing = card.querySelector('.gym-ruta-section');
            if (existing) {
                var isHidden = existing.style.display === 'none';
                existing.style.display = isHidden ? 'block' : 'none';
                if (isHidden) {
                    var _md = existing.querySelector('.gym-ruta-map');
                    if (_md && _md._leafletMap) setTimeout(function() { _md._leafletMap.invalidateSize(); }, 50);
                }
                return;
            }
            var section = document.createElement('div');
            section.className = 'gym-ruta-section';
            section.style.cssText = 'border-top:1px solid rgba(255,255,255,0.06);padding:14px 14px 10px;';
            if (card.dataset.rutaCoords) {
                try { _gymRenderRutaEnSeccion(section, JSON.parse(card.dataset.rutaCoords), card, card.dataset.rutaNombre || ''); }
                catch(e) { _gymRutaEmptyState(section, card); }
            } else {
                _gymRutaEmptyState(section, card);
            }
            card.appendChild(section);
        }

        function _gymRutaEmptyState(section, card) {
            section.innerHTML = '<div style="text-align:center;padding:20px 12px;display:flex;flex-direction:column;align-items:center;gap:10px;">'
                + '<span class="material-symbols-rounded" style="font-size:44px;color:#334155;">route</span>'
                + '<p style="color:#475569;font-size:12px;font-weight:600;margin:0;">Sin ruta importada</p>'
                + '<div style="position:relative;overflow:hidden;padding:9px 18px;border-radius:12px;border:1px solid rgba(234,179,8,0.4);background:rgba(234,179,8,0.1);color:#eab308;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;">'
                + '<span class="material-symbols-rounded" style="font-size:16px;">upload_file</span>Importar ruta'
                + '<input type="file" accept=".gpx,.tcx,.kml,.geojson,.json,text/xml,application/gpx+xml,application/xml,application/json" multiple style="position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;display:block;" onchange="_gymProcesarArchivosRuta(this)">'
                + '</div>'
                + '</div>';
        }

        function _gymProcesarArchivosRuta(input) {
            var card = input.closest('.gym-card');
            var section = input.closest('.gym-ruta-section');
            if (!input.files || input.files.length === 0) return;
            var file = input.files[0];
            var reader = new FileReader();
            reader.onload = function(ev) {
                var text = ev.target.result;
                var name = file.name.toLowerCase();
                var coords = null;
                try {
                    if (name.endsWith('.gpx'))
                        coords = _gymParsarGPX(text);
                    else if (name.endsWith('.tcx'))
                        coords = _gymParsarTCX(text);
                    else if (name.endsWith('.kml'))
                        coords = _gymParsarKML(text);
                    else if (name.endsWith('.geojson') || name.endsWith('.json'))
                        coords = _gymParsarGeoJSON(text);
                    else if (name.endsWith('.fit') || name.endsWith('.kmz')) {
                        _gymRutaMostrarError(section, card, 'Formato ' + name.split('.').pop().toUpperCase() + ' no soportado. Usa GPX, TCX, KML o GeoJSON.');
                        return;
                    } else {
                        try { var obj = JSON.parse(text); if (obj && obj.type) coords = _gymParsarGeoJSON(text); } catch(e2) {}
                        if (!coords) {
                            if (text.indexOf('<gpx') >= 0)                        coords = _gymParsarGPX(text);
                            else if (text.indexOf('<TrainingCenterDatabase') >= 0) coords = _gymParsarTCX(text);
                            else if (text.indexOf('<kml') >= 0)                   coords = _gymParsarKML(text);
                        }
                    }
                } catch(parseErr) {
                    input.value = '';
                    _gymRutaMostrarError(section, card, 'Error al leer el archivo.');
                    return;
                }
                if (!coords || coords.length < 2) {
                    input.value = '';
                    _gymRutaMostrarError(section, card, 'No se encontraron puntos de ruta en el archivo.');
                    return;
                }
                coords = _gymSimplificarCoordenadas(coords, 500);
                card.dataset.rutaCoords = JSON.stringify(coords);
                card.dataset.rutaNombre = file.name;
                card.dataset.rutaUrl = '';
                _gymRenderRutaEnSeccion(section, coords, card, file.name);
                input.value = '';
                if (typeof gymGuardarSesionHoy === 'function') gymGuardarSesionHoy();
                else if (typeof guardarDatos === 'function') guardarDatos();
                subirRutaACloudinary(file).then(function(url) {
                    card.dataset.rutaUrl = url;
                    if (typeof gymGuardarSesionHoy === 'function') gymGuardarSesionHoy();
                    else if (typeof guardarDatos === 'function') guardarDatos();
                }).catch(function() {
                    // Cloudinary upload failed, data is still persisted locally via coords
                }).finally(function() {
                    input.value = '';
                });
            };
            reader.readAsText(file);
        }

        function _gymParsarGPX(text) {
            var xml = (new DOMParser()).parseFromString(text, 'text/xml');
            var c = [];
            xml.querySelectorAll('trkpt,rtept,wpt').forEach(function(p) {
                var la = parseFloat(p.getAttribute('lat')), lo = parseFloat(p.getAttribute('lon'));
                if (!isNaN(la) && !isNaN(lo)) c.push([la, lo]);
            });
            return c;
        }

        function _gymParsarTCX(text) {
            var xml = (new DOMParser()).parseFromString(text, 'text/xml');
            var c = [];
            xml.querySelectorAll('Position').forEach(function(p) {
                var la = parseFloat(p.querySelector('LatitudeDegrees') ? p.querySelector('LatitudeDegrees').textContent : NaN);
                var lo = parseFloat(p.querySelector('LongitudeDegrees') ? p.querySelector('LongitudeDegrees').textContent : NaN);
                if (!isNaN(la) && !isNaN(lo)) c.push([la, lo]);
            });
            return c;
        }

        function _gymParsarKML(text) {
            var xml = (new DOMParser()).parseFromString(text, 'text/xml');
            var c = [];
            xml.querySelectorAll('coordinates').forEach(function(el) {
                el.textContent.trim().split(/\s+/).forEach(function(pair) {
                    var p = pair.split(',');
                    if (p.length >= 2) { var lo = parseFloat(p[0]), la = parseFloat(p[1]); if (!isNaN(la) && !isNaN(lo)) c.push([la, lo]); }
                });
            });
            return c;
        }

        function _gymParsarGeoJSON(text) {
            var obj = JSON.parse(text);
            var c = [];
            function extr(geom) {
                if (!geom) return;
                if (geom.type === 'LineString') geom.coordinates.forEach(function(p) { if (p.length >= 2) c.push([p[1], p[0]]); });
                else if (geom.type === 'MultiLineString') geom.coordinates.forEach(function(l) { l.forEach(function(p) { if (p.length >= 2) c.push([p[1], p[0]]); }); });
                else if (geom.type === 'Point' && geom.coordinates.length >= 2) c.push([geom.coordinates[1], geom.coordinates[0]]);
                else if (geom.type === 'MultiPoint') geom.coordinates.forEach(function(p) { if (p.length >= 2) c.push([p[1], p[0]]); });
            }
            if (obj.type === 'Feature') extr(obj.geometry);
            else if (obj.type === 'FeatureCollection') obj.features.forEach(function(f) { extr(f.geometry); });
            else extr(obj);
            return c;
        }

        function _gymSimplificarCoordenadas(coords, max) {
            if (coords.length <= max) return coords;
            var out = [], step = coords.length / max;
            for (var i = 0; i < max; i++) out.push(coords[Math.round(i * step)]);
            return out;
        }

        function _gymRutaMostrarError(section, card, msg) {
            _gymRutaEmptyState(section, card);
            var errEl = document.createElement('p');
            errEl.style.cssText = 'color:#f87171;font-size:11px;font-weight:600;text-align:center;margin:-4px 0 4px;';
            errEl.textContent = msg;
            var inner = section.querySelector('div');
            if (inner) inner.insertAdjacentElement('afterbegin', errEl);
        }

        function _gymRenderRutaEnSeccion(section, coords, card, nombre) {
            section.innerHTML = '';

            var header = document.createElement('div');
            header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;padding:0 2px;';

            var info = document.createElement('div');
            info.style.cssText = 'display:flex;align-items:center;gap:6px;min-width:0;overflow:hidden;';
            var displayNombre = nombre || (coords.length + ' puntos');
            info.innerHTML = '<span class="material-symbols-rounded" style="font-size:15px;color:#eab308;flex-shrink:0;">route</span>'
                + '<span style="color:#94a3b8;font-size:11px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + displayNombre + '">' + displayNombre + '</span>';

            var btns = document.createElement('div');
            btns.style.cssText = 'display:flex;gap:6px;align-items:center;flex-shrink:0;';

            var replaceWrap = document.createElement('div');
            replaceWrap.style.cssText = 'position:relative;overflow:hidden;background:rgba(234,179,8,0.1);border:1px solid rgba(234,179,8,0.35);border-radius:7px;color:#eab308;padding:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;';

            var replaceInp = document.createElement('input');
            replaceInp.type = 'file'; replaceInp.accept = '.gpx,.tcx,.kml,.geojson,.json,text/xml,application/gpx+xml,application/xml,application/json'; replaceInp.multiple = true;
            replaceInp.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;display:block;';
            replaceInp.addEventListener('change', function() { _gymProcesarArchivosRuta(replaceInp); });

            var csvInp = document.createElement('input');
            csvInp.type = 'file'; csvInp.accept = '.csv,text/csv';
            csvInp.style.display = 'none';
            csvInp.addEventListener('change', function() { _gymProcesarCsvEstadisticas(csvInp, card, section); });

            var newBtn = document.createElement('div');
            newBtn.style.cssText = 'display:flex;align-items:center;justify-content:center;';
            newBtn.title = 'Nueva ruta';
            newBtn.innerHTML = '<span class="material-symbols-rounded" style="font-size:15px;pointer-events:none;">upload_file</span>';
            replaceWrap.appendChild(newBtn);
            replaceWrap.appendChild(replaceInp);

            var statsBtn = document.createElement('button');
            statsBtn.style.cssText = 'background:rgba(234,179,8,0.1);border:1px solid rgba(234,179,8,0.35);border-radius:7px;color:#eab308;padding:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;';
            statsBtn.title = 'Estadísticas';
            statsBtn.innerHTML = '<span class="material-symbols-rounded" style="font-size:15px;">bar_chart</span>';
            statsBtn.addEventListener('click', function() {
                var existingStats = section.querySelector('.gym-ruta-stats');
                if (existingStats) {
                    existingStats.style.display = existingStats.style.display === 'none' ? 'block' : 'none';
                } else if (card.dataset.rutaCsv) {
                    _gymRenderStatsCSV(section, card.dataset.rutaCsv);
                } else {
                    csvInp.click();
                }
            });

            var delBtn = document.createElement('button');
            delBtn.style.cssText = 'background:none;border:none;color:#64748b;cursor:pointer;padding:4px;display:flex;align-items:center;';
            delBtn.innerHTML = '<span class="material-symbols-rounded" style="font-size:16px;">delete</span>';
            delBtn.addEventListener('click', function() { _gymEliminarRuta(delBtn); });

            btns.appendChild(csvInp);
            btns.appendChild(replaceWrap);
            btns.appendChild(statsBtn);
            btns.appendChild(delBtn);
            header.appendChild(info);
            header.appendChild(btns);
            section.appendChild(header);

            var wrap = document.createElement('div');
            wrap.style.cssText = 'position:relative;border-radius:12px;overflow:hidden;height:220px;';
            var mapDiv = document.createElement('div');
            mapDiv.className = 'gym-ruta-map';
            mapDiv.style.cssText = 'width:100%;height:100%;';
            wrap.appendChild(mapDiv);
            section.appendChild(wrap);
            _gymCargarLeaflet(function() { _gymAnimarRutaMapa(mapDiv, coords, wrap); });
            if (card.dataset.rutaCsv) {
                _gymRenderStatsCSV(section, card.dataset.rutaCsv);
            }
        }

        function _gymEliminarRuta(btn) {
            var card = btn.closest('.gym-card');
            var section = btn.closest('.gym-ruta-section');
            delete card.dataset.rutaCoords;
            delete card.dataset.rutaNombre;
            delete card.dataset.rutaUrl;
            delete card.dataset.rutaCsv;
            _gymRutaEmptyState(section, card);
            if (typeof gymGuardarSesionHoy === 'function') gymGuardarSesionHoy();
            else if (typeof guardarDatos === 'function') guardarDatos();
        }

        function _gymProcesarCsvEstadisticas(input, card, section) {
            if (!input.files || input.files.length === 0) return;
            var file = input.files[0];
            var reader = new FileReader();
            reader.onload = function(ev) {
                var text = ev.target.result;
                card.dataset.rutaCsv = text;
                if (typeof gymGuardarSesionHoy === 'function') gymGuardarSesionHoy();
                else if (typeof guardarDatos === 'function') guardarDatos();
                _gymRenderStatsCSV(section, text);
            };
            reader.readAsText(file, 'UTF-8');
            input.value = '';
        }

        function _gymParsarCsvRuta(text) {
            var lines = text.trim().split(/\r?\n/);
            if (lines.length < 2) return null;
            function parseRow(line) {
                var result = [], inQ = false, val = '';
                for (var i = 0; i < line.length; i++) {
                    var c = line[i];
                    if (c === '"') { inQ = !inQ; }
                    else if (c === ',' && !inQ) { result.push(val.trim()); val = ''; }
                    else { val += c; }
                }
                result.push(val.trim());
                return result;
            }
            var headers = parseRow(lines[0]);
            var laps = [], resumen = null;
            for (var i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                var row = parseRow(lines[i]);
                var obj = {};
                headers.forEach(function(h, idx) { obj[h] = row[idx] || ''; });
                if (obj['Vueltas'] === 'Resumen') resumen = obj;
                else laps.push(obj);
            }
            return { laps: laps, resumen: resumen };
        }

        function _gymRenderStatsCSV(section, csvText) {
            var existing = section.querySelector('.gym-ruta-stats');
            if (existing) existing.remove();
            var data = _gymParsarCsvRuta(csvText);
            if (!data || data.laps.length === 0) return;
            var laps = data.laps, resumen = data.resumen;
            var statsDiv = document.createElement('div');
            statsDiv.className = 'gym-ruta-stats';
            statsDiv.style.cssText = 'margin-top:10px;';
            if (resumen) {
                var pills = document.createElement('div');
                pills.style.cssText = 'display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;';
                [
                    { icon:'route',                 label:'Distancia', value:(parseFloat(resumen['Distancia']||0)).toFixed(2)+' km', color:'#eab308' },
                    { icon:'local_fire_department', label:'Calorías',   value:(resumen['Calorías']||'—')+' kcal',                  color:'#f97316' },
                    { icon:'monitor_heart',         label:'FC media',   value:(resumen['Frecuencia cardiaca media']||'—')+' bpm',  color:'#ef4444' },
                    { icon:'favorite',              label:'FC máx',     value:(resumen['FC máxima']||'—')+' bpm',                  color:'#f87171' },
                    { icon:'speed',                 label:'Vel. media', value:(resumen['Velocidad media']||'—')+' km/h',           color:'#22c55e' },
                    { icon:'north',                 label:'Ascenso',    value:'+'+(resumen['Ascenso total']||'0')+' m',            color:'#60a5fa' }
                ].forEach(function(p) {
                    var pill = document.createElement('div');
                    pill.style.cssText = 'display:flex;align-items:center;gap:4px;background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:4px 7px;flex-shrink:0;';
                    pill.innerHTML = '<span class="material-symbols-rounded" style="font-size:11px;color:'+p.color+';">'+p.icon+'</span>'
                        +'<span style="color:#64748b;font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">'+p.label+'</span>'
                        +'<span style="color:#f1f5f9;font-size:10px;font-weight:800;">'+p.value+'</span>';
                    pills.appendChild(pill);
                });
                statsDiv.appendChild(pills);
            }
            var velValues  = laps.map(function(l){ return parseFloat(l['Velocidad media']||0); });
            var fcValues   = laps.map(function(l){ return parseFloat(l['Frecuencia cardiaca media']||0); });
            var tempValues = laps.map(function(l){ return parseFloat(l['Temperatura media']||0); });
            var lapLabels  = laps.map(function(l){
                var t = l['Tiempo acumulado'] || l['Tiempo'] || '';
                t = t.replace(/\.\d+$/, '');
                var parts = t.split(':');
                if (parts.length === 3) return parts[0] + ':' + parts[1];
                if (parts.length === 2) return parts[0] + ':00';
                return t;
            });
            if (velValues.some(function(v){ return v > 0; }))
                statsDiv.appendChild(_gymSvgAreaChart(lapLabels, velValues, 'Velocidad media', 'km/h', '#22d3ee'));
            if (fcValues.some(function(v){ return v > 0; }))
                statsDiv.appendChild(_gymSvgAreaChart(lapLabels, fcValues, 'Frecuencia cardíaca', 'ppm', '#f43f5e'));
            if (tempValues.some(function(v){ return v > 0; }))
                statsDiv.appendChild(_gymSvgAreaChart(lapLabels, tempValues, 'Temperatura', '°C', '#94a3b8'));
            section.appendChild(statsDiv);
        }

        function _gymSvgAreaChart(labels, values, title, unit, color) {
            var n = values.length;
            var wrap = document.createElement('div');
            wrap.style.cssText = 'margin-bottom:10px;';

            // Title row
            var titleRow = document.createElement('div');
            titleRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;padding:0 2px;';
            titleRow.innerHTML = '<div style="display:flex;align-items:center;gap:5px;">'
                + '<span style="width:8px;height:8px;border-radius:50%;background:'+color+';display:inline-block;flex-shrink:0;"></span>'
                + '<span style="color:#94a3b8;font-size:10px;font-weight:700;">'+title+'</span>'
                + '</div>';
            wrap.appendChild(titleRow);

            var avg = values.reduce(function(a,b){ return a+b; },0) / n;
            var maxVal = Math.max.apply(null, values);
            var minVal = Math.min.apply(null, values);
            var pad_v  = (maxVal - minVal) * 0.2 || maxVal * 0.1 || 1;
            var yTop    = maxVal + pad_v;
            var yBottom = Math.max(0, minVal - pad_v * 0.5);
            var range   = yTop - yBottom || 1;

            // Fixed viewBox — always fits container via width="100%"
            var W = 320, H = 110;
            var padL = 32, padR = 60, padT = 14, padB = 22;
            var chartW = W - padL - padR;
            var chartH = H - padT - padB;

            // Density thresholds
            var labelStep = Math.max(1, Math.ceil(n / 6));

            var NS = 'http://www.w3.org/2000/svg';
            var svg = document.createElementNS(NS, 'svg');
            var gradId = 'gcg_' + Math.random().toString(36).slice(2,8);
            svg.setAttribute('viewBox', '0 0 '+W+' '+H);
            svg.setAttribute('width', '100%');
            svg.setAttribute('preserveAspectRatio', 'none');
            svg.style.cssText = 'background:rgba(10,18,36,0.7);border-radius:10px;border:1px solid rgba(255,255,255,0.07);display:block;';

            // Gradient
            var defs = document.createElementNS(NS, 'defs');
            var grad = document.createElementNS(NS, 'linearGradient');
            grad.setAttribute('id', gradId); grad.setAttribute('x1','0'); grad.setAttribute('y1','0');
            grad.setAttribute('x2','0'); grad.setAttribute('y2','1');
            var s1 = document.createElementNS(NS,'stop'); s1.setAttribute('offset','0%'); s1.setAttribute('stop-color',color); s1.setAttribute('stop-opacity','0.4');
            var s2 = document.createElementNS(NS,'stop'); s2.setAttribute('offset','100%'); s2.setAttribute('stop-color',color); s2.setAttribute('stop-opacity','0.02');
            grad.appendChild(s1); grad.appendChild(s2); defs.appendChild(grad); svg.appendChild(defs);

            // Clip rect
            var clipId = 'gclip_'+gradId;
            var clipEl = document.createElementNS(NS,'clipPath'); clipEl.setAttribute('id',clipId);
            var clipRect = document.createElementNS(NS,'rect');
            clipRect.setAttribute('x',padL); clipRect.setAttribute('y',padT);
            clipRect.setAttribute('width',chartW); clipRect.setAttribute('height',chartH);
            clipEl.appendChild(clipRect); defs.appendChild(clipEl);

            // Grid lines
            [0, 0.5, 1].forEach(function(t) {
                var y = padT + chartH * (1-t);
                var gl = document.createElementNS(NS,'line');
                gl.setAttribute('x1',padL); gl.setAttribute('x2',W-padR);
                gl.setAttribute('y1',y); gl.setAttribute('y2',y);
                gl.setAttribute('stroke','rgba(255,255,255,0.06)'); gl.setAttribute('stroke-width','1');
                svg.appendChild(gl);
                var lv = document.createElementNS(NS,'text');
                lv.setAttribute('x',padL-5); lv.setAttribute('y',y+3.5);
                lv.setAttribute('text-anchor','end'); lv.setAttribute('fill','#475569');
                lv.setAttribute('font-size','8'); lv.setAttribute('font-family','Manrope,sans-serif');
                lv.textContent = Math.round(yBottom + range*t);
                svg.appendChild(lv);
            });

            // Point coords
            var pts = values.map(function(v,i){
                var x = padL + (n===1 ? chartW/2 : chartW*i/(n-1));
                var y = padT + chartH*(1-(v-yBottom)/range);
                return [x, Math.max(padT, Math.min(padT+chartH, y))];
            });

            // Average dashed line
            var avgY = padT + chartH*(1-(avg-yBottom)/range);
            avgY = Math.max(padT, Math.min(padT+chartH, avgY));
            var avgLine = document.createElementNS(NS,'line');
            avgLine.setAttribute('x1',padL); avgLine.setAttribute('x2',W-padR-2);
            avgLine.setAttribute('y1',avgY); avgLine.setAttribute('y2',avgY);
            avgLine.setAttribute('stroke','rgba(255,255,255,0.2)'); avgLine.setAttribute('stroke-width','1');
            avgLine.setAttribute('stroke-dasharray','3 3');
            svg.appendChild(avgLine);

            // Catmull-Rom smooth bezier — always, for all n
            function buildPath() {
                if (n === 1) return 'M '+pts[0][0]+' '+pts[0][1];
                var d = 'M '+pts[0][0]+' '+pts[0][1];
                var tension = 0.3;
                for (var i = 1; i < n; i++) {
                    var p0 = pts[Math.max(0, i-2)];
                    var p1 = pts[i-1];
                    var p2 = pts[i];
                    var p3 = pts[Math.min(n-1, i+1)];
                    var cp1x = p1[0] + (p2[0] - p0[0]) * tension;
                    var cp1y = p1[1] + (p2[1] - p0[1]) * tension;
                    var cp2x = p2[0] - (p3[0] - p1[0]) * tension;
                    var cp2y = p2[1] - (p3[1] - p1[1]) * tension;
                    d += ' C '+cp1x+' '+cp1y+' '+cp2x+' '+cp2y+' '+p2[0]+' '+p2[1];
                }
                return d;
            }
            var linePath = buildPath();
            var bottomY = padT + chartH;

            // Area fill
            var areaPath = document.createElementNS(NS,'path');
            areaPath.setAttribute('d', linePath+' L '+pts[n-1][0]+' '+bottomY+' L '+pts[0][0]+' '+bottomY+' Z');
            areaPath.setAttribute('fill','url(#'+gradId+')');
            areaPath.setAttribute('clip-path','url(#'+clipId+')');
            svg.appendChild(areaPath);

            // Stroke line
            var strokeEl = document.createElementNS(NS,'path');
            strokeEl.setAttribute('d', linePath);
            strokeEl.setAttribute('fill','none');
            strokeEl.setAttribute('stroke',color);
            strokeEl.setAttribute('stroke-width', n > 50 ? '1.5' : '2');
            strokeEl.setAttribute('stroke-linejoin','round');
            strokeEl.setAttribute('stroke-linecap','round');
            svg.appendChild(strokeEl);



            // X-axis labels — sparse for dense charts, always show first+last
            pts.forEach(function(p,i){
                if (i % labelStep !== 0 && i !== n-1) return;
                var xl = document.createElementNS(NS,'text');
                xl.setAttribute('x',p[0]); xl.setAttribute('y',H-5);
                xl.setAttribute('text-anchor','middle'); xl.setAttribute('fill','#475569');
                xl.setAttribute('font-size','6.5'); xl.setAttribute('font-family','Manrope,sans-serif');
                xl.setAttribute('font-weight','600');
                xl.textContent = labels[i];
                svg.appendChild(xl);
            });

            // Average label (pinned right, inside padR)
            var at = document.createElementNS(NS,'text');
            at.setAttribute('x', W-padR+4); at.setAttribute('y', avgY+3);
            at.setAttribute('text-anchor','start'); at.setAttribute('fill','rgba(255,255,255,0.3)');
            at.setAttribute('font-size','7'); at.setAttribute('font-family','Manrope,sans-serif');
            at.textContent = 'Med. '+avg.toFixed(1)+' '+unit;
            svg.appendChild(at);

            wrap.appendChild(svg);
            return wrap;
        }

        function _gymCargarLeaflet(cb) {
            if (window.L) { cb(); return; }
            if (window._leafletCargando) { (window._leafletCbs = window._leafletCbs || []).push(cb); return; }
            window._leafletCargando = true;
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
            var script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = function() {
                window._leafletCargando = false;
                cb();
                (window._leafletCbs || []).forEach(function(fn) { fn(); });
                window._leafletCbs = [];
            };
            document.head.appendChild(script);
        }

        function _gymAnimarRutaMapa(mapDiv, coords, wrap) {
            if (mapDiv._leafletMap) { try { mapDiv._leafletMap.remove(); } catch(e) {} mapDiv._leafletMap = null; }
            if (mapDiv._animId) { cancelAnimationFrame(mapDiv._animId); mapDiv._animId = null; }
            var latlngs = coords.map(function(c) { return [c[0], c[1]]; });
            var map = L.map(mapDiv, {
                zoomControl: false, attributionControl: false,
                dragging: false, scrollWheelZoom: false,
                doubleClickZoom: false, touchZoom: false, keyboard: false, tap: false
            });
            mapDiv._leafletMap = map;
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);
            map.fitBounds(L.latLngBounds(latlngs), { padding: [24, 24] });
            L.polyline(latlngs, { color: '#334155', weight: 2.5, opacity: 0.9 }).addTo(map);
            var yellowLine = L.polyline([], { color: '#eab308', weight: 3.5, opacity: 1 }).addTo(map);
            var dotIcon = L.divIcon({
                className: '',
                html: '<div style="width:14px;height:14px;background:#fbbf24;border-radius:50%;box-shadow:0 0 10px rgba(251,191,36,0.9);border:3px solid rgba(15,23,42,0.8);box-sizing:border-box;"></div>',
                iconSize: [14, 14], iconAnchor: [7, 7]
            });
            var dotMarker = L.marker(latlngs[0], { icon: dotIcon, zIndexOffset: 1000 }).addTo(map);
            var total = latlngs.length, FRAMES = 600, frame = 0;
            function step() {
                var vi = Math.min(Math.floor((frame / FRAMES) * total), total - 1);
                yellowLine.setLatLngs(latlngs.slice(0, vi + 1));
                dotMarker.setLatLng(latlngs[vi]);
                frame++;
                if (frame <= FRAMES) {
                    mapDiv._animId = requestAnimationFrame(step);
                } else {
                    mapDiv._animId = null;
                    yellowLine.setLatLngs(latlngs);
                    dotMarker.setLatLng(latlngs[total - 1]);
                    var replayBtn = document.createElement('button');
                    replayBtn.style.cssText = 'position:absolute;bottom:8px;right:8px;background:rgba(234,179,8,0.15);border:1px solid rgba(234,179,8,0.4);border-radius:8px;color:#eab308;padding:5px 9px;font-size:10px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:3px;font-family:Manrope,sans-serif;z-index:1000;';
                    replayBtn.innerHTML = '<span class="material-symbols-rounded" style="font-size:14px;">replay</span>';
                    replayBtn.onclick = function() {
                        replayBtn.remove(); frame = 0;
                        yellowLine.setLatLngs([]); dotMarker.setLatLng(latlngs[0]);
                        mapDiv._animId = requestAnimationFrame(step);
                    };
                    if (wrap) wrap.appendChild(replayBtn);
                }
            }
            map.whenReady(function() { setTimeout(function() { mapDiv._animId = requestAnimationFrame(step); }, 400); });
        }
        // ─────────────────────────────────────────────────────────────────────────

        function _actualizarBadgeGym() {
            var total = _gymArchivadosEnCategoria(window._vistaGymActiva || 'pecho').length;
            var badge = document.getElementById('gym-archive-badge');
            if (!badge) return;
            if (total > 0) {
                badge.textContent = total;
                badge.style.display = 'flex'; badge.removeAttribute('data-hidden');
            } else {
                badge.style.display = 'none'; badge.setAttribute('data-hidden','1');
            }
        }

        function abrirArchivadosGym() {
            var prev = document.getElementById('_modalArchivadosGym');
            if (prev) prev.remove();
            var archivados = _gymArchivadosEnCategoria(window._vistaGymActiva || 'pecho').slice();
            var overlay = document.createElement('div');
            overlay.id = '_modalArchivadosGym';
            overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;';
            overlay.innerHTML = `
                <div style="background:#0f172a;border:1px solid rgba(71,85,105,0.3);border-radius:20px;width:100%;max-width:560px;max-height:80vh;display:flex;flex-direction:column;">
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:20px 20px 14px;flex-shrink:0;">
                        <div style="display:flex;align-items:center;gap:10px;">
                            <span class="material-symbols-rounded" style="color:#64748b;font-size:20px;">archive</span>
                            <span style="color:#f1f5f9;font-size:15px;font-weight:800;">Ejercicios archivados</span>
                            <span style="background:rgba(59,130,246,0.2);color:#60a5fa;font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;">${archivados.length}</span>
                        </div>
                        <button onclick="document.getElementById('_modalArchivadosGym').remove()" style="background:none;border:none;color:#64748b;cursor:pointer;padding:4px;">
                            <span class="material-symbols-rounded" style="font-size:20px;">close</span>
                        </button>
                    </div>
                    <div id="_gymArchivadosLista" style="overflow-y:auto;padding:0 16px 24px;flex:1;">
                        ${archivados.length === 0
                            ? '<div style="text-align:center;color:#475569;font-size:13px;padding:40px 0;">No hay ejercicios archivados</div>'
                            : archivados.map(function(e) {
                                return `<div data-gym-arch-id="${e.id}" style="display:flex;align-items:center;gap:12px;background:rgba(15,23,42,0.7);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:12px 14px;margin-bottom:8px;">
                                    <div style="width:44px;height:44px;border-radius:10px;background:rgba(15,23,42,0.8);border:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;padding:4px;box-sizing:border-box;">${e.imgHTML}</div>
                                    <div style="flex:1;min-width:0;">
                                        <div style="color:#f1f5f9;font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${e.nombre}</div>
                                        <div style="color:#64748b;font-size:11px;margin-top:2px;">${e.badge} · ${e.series} series · ${e.reps} reps</div>
                                    </div>
                                    <button onclick="_restaurarGymCard(${e.id})" style="background:rgba(234,179,8,0.1);border:1px solid rgba(234,179,8,0.3);border-radius:9px;color:#eab308;font-size:11px;font-weight:700;padding:6px 12px;cursor:pointer;flex-shrink:0;">Restaurar</button>
                                </div>`;
                            }).join('')
                        }
                    </div>
                </div>`;
            document.body.appendChild(overlay);
            overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
        }

        function _restaurarGymCard(id) {
            var cat = window._vistaGymActiva || 'pecho';
            var lista = _gymArchivadosEnCategoria(cat);
            var idx = lista.findIndex(function(e) { return e.id === id; });
            if (idx === -1) return;
            var e = lista.splice(idx, 1)[0];
            var vistaActiva = window._vistaGymActiva || 'pecho';
            var panelBase = document.getElementById('gym-panel-' + vistaActiva) || document.getElementById('gym-panel-pecho');
            var grid = panelBase.querySelector('.gym-panel-grid');
            if (!grid) {
                grid = document.createElement('div');
                grid.className = 'gym-panel-grid';
                panelBase.appendChild(grid);
            }
            var emptyEl = panelBase.querySelector('.gym-empty-state');
            if (emptyEl) emptyEl.remove();
            var cardDiv = document.createElement('div');
            cardDiv.className = 'gym-card';
            cardDiv.style.cssText = 'background:rgba(15,23,42,0.7);border:2px solid rgba(234,179,8,0.2);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;opacity:0;transform:scale(0.95);transition:opacity 0.3s,transform 0.3s;';
            cardDiv.innerHTML = _crearGymCardHTML(e);
            if (e.cardTimeSecs > 0) {
                var _arqTimeBadge = cardDiv.querySelector('.gym-card-time-badge');
                if (_arqTimeBadge) {
                    _arqTimeBadge.dataset.totalSecs = e.cardTimeSecs;
                    _arqTimeBadge.style.display = 'flex';
                    _arqTimeBadge.removeAttribute('data-hidden');
                }
            }
            if ((_gymObjetoTieneMetricasCardio(e) || vistaActiva === 'cardio') && typeof _gymAsignarMetricasCardioEnCard === 'function') _gymAsignarMetricasCardioEnCard(cardDiv, e);
            if (typeof _gymAplicarModoCardioEnCard === 'function') _gymAplicarModoCardioEnCard(cardDiv);
            if (typeof _initGymCardDrag === 'function') _initGymCardDrag(cardDiv);
            if (typeof _initGymSwipeCells === 'function') _initGymSwipeCells(cardDiv);
            if (typeof initTooltips === 'function') setTimeout(initTooltips, 50);
            grid.appendChild(cardDiv);
            if (typeof _gymUpdateBolts === 'function') _gymUpdateBolts(grid);
            requestAnimationFrame(function() {
                cardDiv.style.opacity = '1';
                cardDiv.style.transform = 'scale(1)';
            });
            var item = document.querySelector('[data-gym-arch-id="' + id + '"]');
            if (item) item.remove();
            _actualizarBadgeGym();
            if (typeof guardarDatos === 'function') setTimeout(guardarDatos, 100);
            if (lista.length === 0) {
                var modal = document.getElementById('_modalArchivadosGym');
                if (modal) modal.remove();
            }
        }

        function _selBadgeTipo(tipo) {
            window._nuevoBadgeTipo = tipo;
            var btnA = document.getElementById('_badge_tipo_amarillo');
            var btnM = document.getElementById('_badge_tipo_maquina');
            if (!btnA || !btnM) return;
            if (tipo === 'amarillo') {
                btnA.style.border = '2px solid rgba(234,179,8,0.6)';
                btnA.style.background = 'rgba(234,179,8,0.12)';
                btnA.style.color = '#eab308';
                btnM.style.border = '2px solid rgba(71,85,105,0.3)';
                btnM.style.background = 'transparent';
                btnM.style.color = '#94a3b8';
            } else {
                btnM.style.border = '2px solid rgba(255,255,255,0.4)';
                btnM.style.background = 'rgba(15,23,42,0.8)';
                btnM.style.color = '#f1f5f9';
                btnA.style.border = '2px solid rgba(71,85,105,0.3)';
                btnA.style.background = 'transparent';
                btnA.style.color = '#94a3b8';
            }
        }
        var _GYM_CARDIO_TOP_OPTIONS = ['VEL MED','VEL MAX','POT MED','CAD MED','ASCEN','DESCEN'];
        var _GYM_CARDIO_BOTTOM_OPTIONS = ['FC MEDIA','FC MAX'];
        var _GYM_CARDIO_DEFAULT_LABELS = { series: 'POT MED', reps: 'CAD MED', rir: 'FC MEDIA', rpe: 'FC MAX' };

        function _gymNormalizarTextoMetricaCardio(valor) {
            return String(valor || '').trim().toUpperCase().replace(/\s+/g, ' ');
        }

        function _gymNormalizarGrupoMetricasCardio(valores, permitidas, porDefecto) {
            var lista = Array.isArray(valores) ? valores.slice() : [valores];
            var out = [];
            lista.forEach(function(valor) {
                valor = _gymNormalizarTextoMetricaCardio(valor);
                if (!valor || permitidas.indexOf(valor) === -1 || out.indexOf(valor) !== -1) return;
                out.push(valor);
            });
            porDefecto.forEach(function(valor) {
                valor = _gymNormalizarTextoMetricaCardio(valor);
                if (!valor || permitidas.indexOf(valor) === -1 || out.indexOf(valor) !== -1 || out.length >= 2) return;
                out.push(valor);
            });
            permitidas.forEach(function(valor) {
                if (out.indexOf(valor) !== -1 || out.length >= 2) return;
                out.push(valor);
            });
            return out.slice(0, 2);
        }

        function _gymNormalizarMetricasCardio(metricas) {
            metricas = metricas || {};
            var top = metricas.top || [metricas.series || metricas.cardioSeriesLabel, metricas.reps || metricas.cardioRepsLabel];
            var bottom = metricas.bottom || [metricas.rir || metricas.cardioRirLabel, metricas.rpe || metricas.cardioRpeLabel];
            var topNorm = _gymNormalizarGrupoMetricasCardio(top, _GYM_CARDIO_TOP_OPTIONS, [_GYM_CARDIO_DEFAULT_LABELS.series, _GYM_CARDIO_DEFAULT_LABELS.reps]);
            var bottomNorm = _gymNormalizarGrupoMetricasCardio(bottom, _GYM_CARDIO_BOTTOM_OPTIONS, [_GYM_CARDIO_DEFAULT_LABELS.rir, _GYM_CARDIO_DEFAULT_LABELS.rpe]);
            return {
                series: topNorm[0],
                reps: topNorm[1],
                rir: bottomNorm[0],
                rpe: bottomNorm[1],
                top: topNorm,
                bottom: bottomNorm
            };
        }

        function _gymCardTieneConfigCardio(card) {
            if (!card) return false;
            return _gymEsCardioCard(card)
                || !!card.dataset.cardioSeriesLabel
                || !!card.dataset.cardioRepsLabel
                || !!card.dataset.cardioRirLabel
                || !!card.dataset.cardioRpeLabel;
        }

        function _gymObjetoTieneMetricasCardio(obj) {
            return !!(obj && (obj.cardioSeriesLabel || obj.cardioRepsLabel || obj.cardioRirLabel || obj.cardioRpeLabel));
        }

        function _gymMetricasCardioDesdeCard(card) {
            return _gymNormalizarMetricasCardio({
                cardioSeriesLabel: card && card.dataset ? card.dataset.cardioSeriesLabel : '',
                cardioRepsLabel: card && card.dataset ? card.dataset.cardioRepsLabel : '',
                cardioRirLabel: card && card.dataset ? card.dataset.cardioRirLabel : '',
                cardioRpeLabel: card && card.dataset ? card.dataset.cardioRpeLabel : ''
            });
        }

        function _gymAsignarMetricasCardioEnCard(card, metricas) {
            if (!card) return;
            var normalizadas = _gymNormalizarMetricasCardio(metricas);
            card.dataset.cardioSeriesLabel = normalizadas.series;
            card.dataset.cardioRepsLabel = normalizadas.reps;
            card.dataset.cardioRirLabel = normalizadas.rir;
            card.dataset.cardioRpeLabel = normalizadas.rpe;
        }

        function _gymSerializarMetricasCardioCard(card) {
            if (!_gymCardTieneConfigCardio(card)) return null;
            var metricas = _gymMetricasCardioDesdeCard(card);
            return {
                cardioSeriesLabel: metricas.series,
                cardioRepsLabel: metricas.reps,
                cardioRirLabel: metricas.rir,
                cardioRpeLabel: metricas.rpe
            };
        }

        function _gymAplicarEstadoBadgeMetricaCardio(btn, activo) {
            if (!btn) return;
            btn.dataset.selected = activo ? '1' : '0';
            btn.style.background = activo ? 'rgba(249,115,22,0.16)' : 'rgba(255,255,255,0.04)';
            btn.style.borderColor = activo ? 'rgba(249,115,22,0.45)' : 'rgba(71,85,105,0.35)';
            btn.style.color = activo ? '#fb923c' : '#94a3b8';
            btn.style.boxShadow = activo ? '0 0 0 1px rgba(249,115,22,0.15) inset' : 'none';
        }

        function _gymMontarSelectorMetricasCardio(container, metricas) {
            if (!container) return;
            var normalizadas = _gymNormalizarMetricasCardio(metricas);
            container.style.display = 'block';
            container.innerHTML = '<div data-cardio-picker="1" style="display:flex;flex-direction:column;gap:10px;padding:10px 12px;background:rgba(249,115,22,0.05);border:1px solid rgba(249,115,22,0.18);border-radius:12px;">'
                + '<div style="color:#fb923c;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;">Métricas cardio</div>'
                + '<div>'
                + '<div style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px;">Primera fila · elige 2</div>'
                + '<div style="display:flex;flex-wrap:wrap;gap:6px;">'
                + _GYM_CARDIO_TOP_OPTIONS.map(function(op) {
                    return '<button type="button" data-cardio-group="top" data-cardio-value="' + op + '" style="padding:7px 10px;border-radius:999px;border:1px solid rgba(71,85,105,0.35);background:rgba(255,255,255,0.04);color:#94a3b8;font-size:11px;font-weight:800;letter-spacing:0.03em;cursor:pointer;transition:all 0.15s;">' + op + '</button>';
                }).join('')
                + '</div>'
                + '</div>'
                + '<div>'
                + '<div style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px;">Segunda fila · elige 2</div>'
                + '<div style="display:flex;flex-wrap:wrap;gap:6px;">'
                + _GYM_CARDIO_BOTTOM_OPTIONS.map(function(op) {
                    return '<button type="button" data-cardio-group="bottom" data-cardio-value="' + op + '" style="padding:7px 10px;border-radius:999px;border:1px solid rgba(71,85,105,0.35);background:rgba(255,255,255,0.04);color:#94a3b8;font-size:11px;font-weight:800;letter-spacing:0.03em;cursor:pointer;transition:all 0.15s;">' + op + '</button>';
                }).join('')
                + '</div>'
                + '</div>'
                + '</div>';
            var root = container.querySelector('[data-cardio-picker="1"]');
            if (!root) return;
            root.querySelectorAll('button[data-cardio-value]').forEach(function(btn) {
                var group = btn.dataset.cardioGroup;
                var value = _gymNormalizarTextoMetricaCardio(btn.dataset.cardioValue);
                var activo = group === 'top' ? normalizadas.top.indexOf(value) !== -1 : normalizadas.bottom.indexOf(value) !== -1;
                _gymAplicarEstadoBadgeMetricaCardio(btn, activo);
                btn.addEventListener('click', function() {
                    var groupBtns = Array.from(root.querySelectorAll('button[data-cardio-group="' + group + '"]'));
                    var seleccionados = groupBtns.filter(function(el) { return el.dataset.selected === '1'; });
                    if (btn.dataset.selected === '1') {
                        _gymAplicarEstadoBadgeMetricaCardio(btn, false);
                        return;
                    }
                    if (seleccionados.length >= 2) {
                        if (navigator.vibrate) navigator.vibrate(10);
                        return;
                    }
                    _gymAplicarEstadoBadgeMetricaCardio(btn, true);
                });
            });
        }

        function _gymLeerSelectorMetricasCardio(container) {
            if (!container) return _gymNormalizarMetricasCardio();
            var root = container.matches && container.matches('[data-cardio-picker="1"]') ? container : container.querySelector('[data-cardio-picker="1"]');
            if (!root) return _gymNormalizarMetricasCardio();
            var top = Array.from(root.querySelectorAll('button[data-cardio-group="top"][data-selected="1"]')).map(function(btn) {
                return _gymNormalizarTextoMetricaCardio(btn.dataset.cardioValue);
            });
            var bottom = Array.from(root.querySelectorAll('button[data-cardio-group="bottom"][data-selected="1"]')).map(function(btn) {
                return _gymNormalizarTextoMetricaCardio(btn.dataset.cardioValue);
            });
            return _gymNormalizarMetricasCardio({ top: top, bottom: bottom });
        }

        var _GYM_ALLOW_ADD_HISTORIAL = false;

        var _overlayNuevoEjercicio = null;
        function abrirNuevoEjercicio() {
            var _elIntA = document.getElementById('gym-intervalo-label');
            var _offA = _elIntA ? parseInt(_elIntA.dataset.offset || 0) : 0;
            var _filA = _elIntA ? (_elIntA.dataset.filtro || 'dia') : 'dia';
            if (!_GYM_ALLOW_ADD_HISTORIAL && _filA === 'dia' && _offA !== 0) return;
            var overlay = document.createElement('div');
            overlay.id = '_overlayNuevoEjercicio';
            overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;';
            overlay.innerHTML = `
                <div style="background:#0f172a;border:1px solid rgba(71,85,105,0.3);border-radius:20px;width:100%;max-width:420px;display:flex;flex-direction:column;overflow:hidden;">
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 20px 14px;flex-shrink:0;">
                        <span style="color:#f1f5f9;font-size:15px;font-weight:800;">Nuevo ejercicio</span>
                        <button onclick="this.closest('[style*=fixed]').remove()" style="background:none;border:none;color:#64748b;cursor:pointer;padding:4px;">
                            <span class="material-symbols-rounded" style="font-size:20px;">close</span>
                        </button>
                    </div>
                    <div style="padding:0 20px 24px;display:flex;flex-direction:column;gap:12px;">
                        <div>
                            <label style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;display:block;margin-bottom:6px;">Nombre</label>
                            <input id="_nuevo_nombre" type="text" placeholder="Ej: Press banca" style="width:100%;box-sizing:border-box;background:rgba(15,23,42,0.8);border:1px solid rgba(71,85,105,0.4);border-radius:10px;padding:10px 12px;color:#f1f5f9;font-size:13px;font-weight:600;outline:none;font-family:Manrope,sans-serif;">
                        </div>
                        <div>
                            <label style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;display:block;margin-bottom:6px;">Descripción</label>
                            <textarea id="_nuevo_desc" rows="2" placeholder="Descripción breve..." onkeydown="if(event.key==='Enter'){event.stopPropagation();}" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'" style="width:100%;box-sizing:border-box;background:rgba(15,23,42,0.8);border:1px solid rgba(71,85,105,0.4);border-radius:10px;padding:10px 12px;color:#f1f5f9;font-size:13px;font-weight:600;outline:none;resize:none;overflow:hidden;min-height:44px;font-family:Manrope,sans-serif;"></textarea>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                            <div>
                                <label style="color:#eab308;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;display:block;margin-bottom:6px;">Badge categoría</label>
                                <input id="_nuevo_badge" type="text" placeholder="Ej: Pecho" style="width:100%;box-sizing:border-box;background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.35);border-radius:10px;padding:10px 12px;color:#eab308;font-size:13px;font-weight:700;outline:none;font-family:Manrope,sans-serif;">
                            </div>
                            <div>
                                <label style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;display:block;margin-bottom:6px;">Código de máquina</label>
                                <input id="_nuevo_badge_maquina" type="text" placeholder="Ej: SEL-900" style="width:100%;box-sizing:border-box;background:rgba(15,23,42,0.9);border:1px solid rgba(255,255,255,0.2);border-radius:10px;padding:10px 12px;color:#f1f5f9;font-size:13px;font-weight:700;outline:none;font-family:Manrope,sans-serif;">
                            </div>
                        </div>
                        <div id="_nuevo_fila_series_reps_kg" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
                            <div>
                                <label style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;display:block;margin-bottom:6px;">Series</label>
                                <input id="_nuevo_series" type="number" placeholder="" min="1" max="99" onfocus="this.select()" style="width:100%;box-sizing:border-box;background:rgba(15,23,42,0.8);border:1px solid rgba(71,85,105,0.4);border-radius:10px;padding:10px 12px;color:#f1f5f9;font-size:13px;font-weight:600;outline:none;font-family:Manrope,sans-serif;text-align:center;">
                            </div>
                            <div>
                                <label style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;display:block;margin-bottom:6px;">Reps</label>
                                <input id="_nuevo_reps" type="number" placeholder="" min="1" max="999" onfocus="this.select()" style="width:100%;box-sizing:border-box;background:rgba(15,23,42,0.8);border:1px solid rgba(71,85,105,0.4);border-radius:10px;padding:10px 12px;color:#f1f5f9;font-size:13px;font-weight:600;outline:none;font-family:Manrope,sans-serif;text-align:center;">
                            </div>
                            <div>
                                <label style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;display:block;margin-bottom:6px;">KG</label>
                                <input id="_nuevo_kg" type="number" inputmode="decimal" placeholder="" min="0" max="999" step="0.5" onfocus="this.select()" style="width:100%;box-sizing:border-box;background:rgba(15,23,42,0.8);border:1px solid rgba(71,85,105,0.4);border-radius:10px;padding:10px 12px;color:#eab308;font-size:13px;font-weight:600;outline:none;font-family:Manrope,sans-serif;text-align:center;">
                            </div>
                        </div>
                        <div id="_nuevo_fila_km" style="display:none;">
                            <label style="color:#fb923c;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;display:block;margin-bottom:6px;">KM objetivo</label>
                            <input id="_nuevo_km" type="number" inputmode="decimal" placeholder="Ej: 5" min="0" max="999" step="0.1" onfocus="this.select()" style="width:100%;box-sizing:border-box;background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.4);border-radius:10px;padding:10px 12px;color:#fb923c;font-size:13px;font-weight:700;outline:none;font-family:Manrope,sans-serif;text-align:center;">
                        </div>
                        <div id="_nuevo_metricas_cardio_wrap" style="display:none;"></div>
                        <div style="height:6px;"></div>
                        <button onclick="_confirmarNuevoEjercicio()" style="width:100%;height:42px;border-radius:12px;border:1px solid rgba(234,179,8,0.5);background:rgba(234,179,8,0.12);color:#eab308;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.07em;cursor:pointer;">Añadir</button>
                    </div>
                </div>`;
            document.body.appendChild(overlay);
            _overlayNuevoEjercicio = overlay;
            var panelCardioActivo = (function(){
                var p = document.getElementById('gym-panel-cardio');
                return p && p.style.display !== 'none';
            })();
            if (panelCardioActivo) {
                var filaKm = document.getElementById('_nuevo_fila_km');
                var filaRest = document.getElementById('_nuevo_fila_series_reps_kg');
                var metricasWrap = document.getElementById('_nuevo_metricas_cardio_wrap');
                if (filaKm) filaKm.style.display = 'block';
                if (filaRest) filaRest.style.display = 'none';
                if (metricasWrap && typeof _gymMontarSelectorMetricasCardio === 'function') _gymMontarSelectorMetricasCardio(metricasWrap);
            }
            setTimeout(function(){ document.getElementById('_nuevo_nombre')?.focus(); }, 50);
        }

        function _confirmarNuevoEjercicio() {
            var nombre  = document.getElementById('_nuevo_nombre')?.value.trim() || 'Nuevo ejercicio';
            var desc    = document.getElementById('_nuevo_desc')?.value.trim() || '';
            var badge   = document.getElementById('_nuevo_badge')?.value.trim() || '';
            var badgeMaquina = document.getElementById('_nuevo_badge_maquina')?.value.trim() || '';
            var series  = document.getElementById('_nuevo_series')?.value || '0';
            var reps    = document.getElementById('_nuevo_reps')?.value || '0';
            var kg      = document.getElementById('_nuevo_kg')?.value || '0';
            var km      = parseFloat(document.getElementById('_nuevo_km')?.value || 0) || 0;
            var _vistaGymNueva = window._vistaGymActiva || 'pecho';
            var metricasCardioNuevo = _vistaGymNueva === 'cardio' && typeof _gymLeerSelectorMetricasCardio === 'function'
                ? _gymLeerSelectorMetricasCardio(document.getElementById('_nuevo_metricas_cardio_wrap'))
                : null;
            var _elIntC = document.getElementById('gym-intervalo-label');
            var _offsetC = _elIntC ? parseInt(_elIntC.dataset.offset || 0) : 0;
            var _filtroC = _elIntC ? (_elIntC.dataset.filtro || 'dia') : 'dia';
            var _viendoHoyC = (_filtroC === 'dia' && _offsetC === 0);

            if (!_viendoHoyC && _filtroC === 'dia') {
                var _fechaC = _gymFechaKey(_offsetC);
                var _sesC = window._gymSesionesHistorial || {};
                if (!_sesC[_fechaC]) _sesC[_fechaC] = {};
                if (!_sesC[_fechaC].cards) _sesC[_fechaC].cards = {pecho:[],espalda:[],brazo:[],pierna:[],cardio:[]};
                var _panelNomC = window._vistaGymActiva || 'pecho';
                if (!_sesC[_fechaC].cards[_panelNomC]) _sesC[_fechaC].cards[_panelNomC] = [];
                var _kgHist = (_panelNomC === 'cardio') ? ((km > 0 ? km : (parseFloat(kg || 0) || 0))) : kg;
                var _nuevoEjC = { nombre:nombre, desc:desc, badge:badge, badgeMaquina:badgeMaquina, series:series, reps:reps, kg:_kgHist, rir:'', rpe:'', imgSrc:'', cardTimeSecs:0, completado:false };
                if (_panelNomC === 'cardio' && metricasCardioNuevo) {
                    _nuevoEjC.cardioSeriesLabel = metricasCardioNuevo.series;
                    _nuevoEjC.cardioRepsLabel = metricasCardioNuevo.reps;
                    _nuevoEjC.cardioRirLabel = metricasCardioNuevo.rir;
                    _nuevoEjC.cardioRpeLabel = metricasCardioNuevo.rpe;
                }
                _sesC[_fechaC].cards[_panelNomC].push(_nuevoEjC);
                window._gymSesionesHistorial = _sesC;
                if (_overlayNuevoEjercicio) { _overlayNuevoEjercicio.remove(); _overlayNuevoEjercicio = null; }
                else { document.getElementById('_overlayNuevoEjercicio')?.remove(); }
                if (typeof gymCargarStatsParaIntervalo === 'function') gymCargarStatsParaIntervalo();
                if (typeof guardarDatos === 'function') setTimeout(guardarDatos, 100);
                return;
            }
            var panelActivo = null;
            ['pecho','espalda','brazo','pierna','cardio'].forEach(function(p){
                var panel = document.getElementById('gym-panel-' + p);
                if(panel && panel.style.display !== 'none') panelActivo = panel;
            });
            if(!panelActivo) panelActivo = document.getElementById('gym-panel-pecho');
            var esCardio = panelActivo.id === 'gym-panel-cardio';
            var grid = panelActivo.querySelector('.gym-panel-grid');
            if(!grid){
                grid = document.createElement('div');
                grid.className = 'gym-panel-grid';
                grid.style.cssText = '';
                panelActivo.appendChild(grid);
            }
            var card = document.createElement('div');
            card.className = 'gym-card';
            card.style.cssText = 'background:rgba(15,23,42,0.7);border:2px solid rgba(234,179,8,0.2);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;opacity:0;transform:scale(0.95);transition:opacity 0.3s,transform 0.3s;';
            card.innerHTML = _gymCardInnerHTML(nombre, desc, badge, series, reps,
                '<span class="material-symbols-rounded" style="font-size:38px;color:#334155;">exercise</span>', kg, badgeMaquina);
            if (panelActivo && panelActivo.id) card.dataset.panel = panelActivo.id.replace('gym-panel-', '');
            if (esCardio && metricasCardioNuevo && typeof _gymAsignarMetricasCardioEnCard === 'function') {
                _gymAsignarMetricasCardioEnCard(card, metricasCardioNuevo);
            }
            if (esCardio && km > 0) {
                var kmInpAdd = card.querySelector('.gym-card-kg');
                if (kmInpAdd) kmInpAdd.value = String(parseFloat(km.toFixed(1)));
            }
            if (typeof _gymAplicarModoCardioEnCard === 'function') _gymAplicarModoCardioEnCard(card);
            _initGymCardDrag(card);
            grid.appendChild(card);
            if (typeof _syncGymGridCardMeta === 'function') _syncGymGridCardMeta(grid);
            if (typeof _gymUpdateBolts === 'function') _gymUpdateBolts(grid);
            if (typeof _initGymSwipeCells === 'function') _initGymSwipeCells(card);
            if (window.innerWidth < 768) {
                card.querySelectorAll('.gym-stat-inp').forEach(function(inp) {
                    inp.setAttribute('readonly', '');
                    inp.setAttribute('inputmode', 'none');
                    inp.setAttribute('tabindex', '-1');
                });
            }
            requestAnimationFrame(function(){ card.style.opacity='1'; card.style.transform='scale(1)'; });
            var _ctxAdd = (typeof _gymContextoActivo === 'function') ? _gymContextoActivo() : null;
            if (_ctxAdd && _ctxAdd.esDia && typeof _gymActualizarStatCardioKm === 'function') {
                _gymActualizarStatCardioKm(_ctxAdd.fechaKey);
            }
            if (_overlayNuevoEjercicio) { _overlayNuevoEjercicio.remove(); _overlayNuevoEjercicio = null; }
            else { document.getElementById('_overlayNuevoEjercicio')?.remove(); }
            if (typeof guardarDatos === 'function') setTimeout(guardarDatos, 100);
            if (typeof _gymEmptyState === 'function') _gymEmptyState(panelActivo);
        }
        function _crearGymCardHTML(e) {
            var imgHTML = '';
            if (e.imgSrc && e.imgSrc.length > 0) {
                imgHTML = '<img src="' + e.imgSrc + '" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">';
            } else if (e.imgHTML && e.imgHTML.length > 0 && e.imgHTML.length < 500000) {
                imgHTML = e.imgHTML; // legacy compat
            }
            return _gymCardInnerHTML(
                e.nombre || '',
                e.desc || '',
                e.badge || '',
                e.series || '0',
                e.reps || '0',
                imgHTML,
                e.kg || '0',
                e.badgeMaquina || '',
                e.rir || '',
                e.rpe || '',
                e.completado || false,
                (e.cardTimeSecs > 0) ? (e.cardTimeLabel || '') : ''
            );
        }
        function _gymCardInnerHTML(nombre, desc, badge, series, reps, imgHTML, kg, badgeMaquina, rir, rpe, completado, tiempo) {
    // Si no se pasa tiempo (por ejemplo al crear uno nuevo), ponemos 00:00
    var tiempoDisplay = (tiempo && tiempo !== '') ? tiempo : '00:00';

    series = (series !== undefined && series !== null && series !== '') ? series : '0';
    reps   = (reps   !== undefined && reps   !== null && reps   !== '') ? reps   : '0';
    kg     = (kg     !== undefined && kg     !== null && kg     !== '') ? kg     : '0';
    rir    = (rir    !== undefined && rir    !== null && rir    !== '') ? rir    : '0';
    rpe    = (rpe    !== undefined && rpe    !== null && rpe    !== '') ? rpe    : '0';
    var dd = '<div class="gym-drag-handle" style="display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;cursor:grab;color:#334155;padding:0 2px;touch-action:none;user-select:none;">' + '<span class="material-symbols-rounded" style="font-size:26px;pointer-events:none;">drag_indicator</span>' + '</div>';
    var badgeMaqHTML = badgeMaquina ? '<div style="display:inline-flex;align-items:center;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.25);border-radius:7px;padding:2px 8px;margin-left:6px;flex-shrink:0;"><span class="gym-card-badge-maq" style="color:#e2e8f0;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">' + badgeMaquina + '</span></div>' : '';
    var badgeCatHTML = badge ? '<div style="display:inline-flex;align-items:center;background:rgba(234,179,8,0.15);border:1px solid rgba(234,179,8,0.4);border-radius:7px;padding:2px 8px;flex-shrink:0;"><span class="gym-card-badge-cat" style="color:#eab308;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">' + badge + '</span></div>' : '';
    var men = '<div style="display:flex;align-items:center;gap:6px;flex-shrink:0;"><div style="position:relative;"><button onclick="toggleGymCardMenu(this)" style="width:30px;height:30px;border-radius:8px;border:1px solid rgba(71,85,105,0.3);background:rgba(71,85,105,0.1);cursor:pointer;display:flex;align-items:center;justify-content:center;color:#64748b;transition:all 0.2s;"><span class="material-symbols-rounded" style="font-size:18px;">more_vert</span></button><div class="gym-card-menu" style="display:none;position:absolute;right:0;top:34px;background:#1e293b;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:4px;min-width:150px;z-index:50;box-shadow:0 8px 24px rgba(0,0,0,0.4);"><button onclick="editarGymCard(this)" style="width:100%;display:flex;align-items:center;gap:8px;padding:8px 10px;border:none;background:transparent;color:#f1f5f9;font-size:12px;font-weight:600;cursor:pointer;border-radius:8px;text-align:left;"><span class="material-symbols-rounded" style="font-size:15px;color:#94a3b8;">edit</span>Editar</button><button onclick="duplicarGymCard(this)" style="width:100%;display:flex;align-items:center;gap:8px;padding:8px 10px;border:none;background:transparent;color:#f1f5f9;font-size:12px;font-weight:600;cursor:pointer;border-radius:8px;text-align:left;"><span class="material-symbols-rounded" style="font-size:15px;color:#94a3b8;">content_copy</span>Duplicar</button><button onclick="archivarGymCard(this)" style="width:100%;display:flex;align-items:center;gap:8px;padding:8px 10px;border:none;background:transparent;color:#f1f5f9;font-size:12px;font-weight:600;cursor:pointer;border-radius:8px;text-align:left;"><span class="material-symbols-rounded" style="font-size:15px;color:#94a3b8;">archive</span>Archivar</button><button onclick="moverGymCard(this)" style="width:100%;display:flex;align-items:center;gap:8px;padding:8px 10px;border:none;background:transparent;color:#f1f5f9;font-size:12px;font-weight:600;cursor:pointer;border-radius:8px;text-align:left;"><span class="material-symbols-rounded" style="font-size:15px;color:#94a3b8;">move_item</span>Mover</button><button onclick="_gymResetCard(this)" style="width:100%;display:flex;align-items:center;gap:8px;padding:8px 10px;border:none;background:transparent;color:#f1f5f9;font-size:12px;font-weight:600;cursor:pointer;border-radius:8px;text-align:left;"><span class="material-symbols-rounded" style="font-size:15px;color:#94a3b8;">restart_alt</span>Resetear</button><button class="gym-menu-ruta" onclick="gymToggleRutaCardio(this)" style="display:none;width:100%;align-items:center;gap:8px;padding:8px 10px;border:none;background:transparent;color:#f1f5f9;font-size:12px;font-weight:600;cursor:pointer;border-radius:8px;text-align:left;"><span class="material-symbols-rounded" style="font-size:15px;color:#94a3b8;">route</span>Ruta</button><div style="height:1px;background:rgba(255,255,255,0.06);margin:3px 6px;"></div><button onclick="eliminarGymCard(this)" style="width:100%;display:flex;align-items:center;gap:8px;padding:8px 10px;border:none;background:transparent;color:#f1f5f9;font-size:12px;font-weight:600;cursor:pointer;border-radius:8px;text-align:left;"><span class="material-symbols-rounded" style="font-size:15px;color:#f87171;">delete</span>Eliminar</button></div></div></div>';
    var cellS = 'position:relative;background:rgba(15,23,42,0.5);border-radius:16px;padding:6px 46px;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;';
    var cellKG = 'background:rgba(15,23,42,0.5);border-radius:9px;padding:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;';
    var lblS  = 'font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#94a3b8;display:block;margin-bottom:2px;';
    var inpS  = 'width:100%;background:transparent;border:none;font-size:18px;font-weight:900;font-family:Manrope,sans-serif;outline:none;padding:0;line-height:1;text-align:center;';
    var isMobileGym = window.innerWidth < 768;
    var focusBlur = isMobileGym ? 'tabindex="-1" inputmode="none" readonly' : 'onfocus="this.select()" onblur="if(this.value===\'\' || this.value===\'.\'|| isNaN(this.value))this.value=\'0\'"';
    var lblRIR = '<div style="display:flex;align-items:center;justify-content:center;gap:2px;margin-bottom:2px;"><span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#94a3b8;line-height:1;">RIR</span><div class="tooltip-container" style="display:inline-flex;align-items:center;line-height:1;"><span class="material-symbols-rounded tooltip-icon" style="font-size:13px;color:#64748b;line-height:1;">info</span><span class="tooltip-text"><strong>RIR – Reps in Reserve</strong><br>Cuántas reps sentiste que podías hacer más antes del fallo técnico.<br><br><em>Ej: hiciste 10 reps pero podías 2 más → RIR = 2</em></span></div></div>';
    var lblRPE = '<div style="display:flex;align-items:center;justify-content:center;gap:2px;margin-bottom:2px;"><span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#94a3b8;line-height:1;">RPE</span><div class="tooltip-container" style="display:inline-flex;align-items:center;line-height:1;"><span class="material-symbols-rounded tooltip-icon" style="font-size:13px;color:#64748b;line-height:1;">info</span><span class="tooltip-text"><strong>RPE – Rate of Perceived Exertion</strong><br>Escala 1–10 de qué tan difícil fue la serie. 10 = máximo esfuerzo.<br><br><em>Ej: serie muy dura con algo de reserva → RPE = 8</em></span></div></div>';
    
    return '<div>'
         + '<div style="padding:18px 18px 16px;border-bottom:1px solid rgba(255,255,255,0.05);"><div style="display:flex;align-items:center;gap:14px;">' + dd + '<div style="flex:1;min-width:0;overflow:hidden;"><div style="display:flex;align-items:center;flex-wrap:nowrap;overflow:hidden;gap:4px;"><span class="gym-card-nombre" style="color:#f1f5f9;font-size:15px;font-weight:800;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;">' + nombre + '</span>' + badgeMaqHTML + badgeCatHTML + '</div><div class="gym-card-desc" style="color:#64748b;font-size:11px;font-weight:500;line-height:1.4;margin-top:3px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">' + desc + '</div></div>' + men + '</div></div>'
         + '<div class="gym-card-body" style="padding:14px 12px 12px;display:flex;gap:8px;align-items:stretch;overflow:hidden;flex:1;">'
         + '<div class="gym-card-img" onclick="var i=this.querySelector(\'img\');if(i&&typeof gymAbrirVisorImagen===\'function\')gymAbrirVisorImagen(i.src);" style="flex-shrink:0;width:150px;height:150px;border-radius:14px;background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.06);overflow:hidden;display:flex;align-items:center;justify-content:center;cursor:pointer;">' + imgHTML + '</div>'
         + '<div class="gym-col-series" style="flex:1;min-width:0;display:flex;flex-direction:column;gap:5px;">'
         + '<div class="gym-stat-cell" style="flex:1;border:1px solid rgba(255,255,255,0.07);border-radius:16px;' + cellS + '"><span class="gym-stat-lbl" style="' + lblS + '">Series</span><button onclick="_gymStep(this,-1)" class="gym-step-btn gym-step-minus desktop-only" style="position:absolute;left:0;top:0;bottom:0;width:42px;background:rgba(255,255,255,0.04);border:none;border-right:1px solid rgba(255,255,255,0.08);color:#64748b;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;border-radius:8px 0 0 8px;"><span class="material-symbols-rounded" style="font-size:18px;line-height:1;">remove</span></button><input type="number" min="1" max="99" value="' + series + '" class="gym-card-series gym-stat-inp" ' + focusBlur + ' style="color:#f1f5f9;' + inpS + '"><button onclick="_gymStep(this,1)" class="gym-step-btn gym-step-plus desktop-only" style="position:absolute;right:0;top:0;bottom:0;width:42px;background:rgba(255,255,255,0.04);border:none;border-left:1px solid rgba(255,255,255,0.08);color:#64748b;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;border-radius:0 8px 8px 0;"><span class="material-symbols-rounded" style="font-size:18px;line-height:1;">add</span></button></div>'
         + '<div class="gym-stat-cell" style="flex:1;border:1px solid rgba(255,255,255,0.07);border-radius:16px;' + cellS + '">' + lblRIR + '<button onclick="_gymStep(this,-1)" class="gym-step-btn gym-step-minus desktop-only" style="position:absolute;left:0;top:0;bottom:0;width:42px;background:rgba(255,255,255,0.04);border:none;border-right:1px solid rgba(255,255,255,0.08);color:#64748b;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;border-radius:8px 0 0 8px;"><span class="material-symbols-rounded" style="font-size:18px;line-height:1;">remove</span></button><input type="number" min="0" max="10" value="' + rir + '" class="gym-card-rir gym-stat-inp" ' + focusBlur + ' style="color:#f1f5f9;' + inpS + '"><button onclick="_gymStep(this,1)" class="gym-step-btn gym-step-plus desktop-only" style="position:absolute;right:0;top:0;bottom:0;width:42px;background:rgba(255,255,255,0.04);border:none;border-left:1px solid rgba(255,255,255,0.08);color:#64748b;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;border-radius:0 8px 8px 0;"><span class="material-symbols-rounded" style="font-size:18px;line-height:1;">add</span></button></div>'
         + '</div>'
         + '<div class="gym-col-reps" style="flex:1;min-width:0;display:flex;flex-direction:column;gap:5px;">'
         + '<div class="gym-stat-cell" style="flex:1;border:1px solid rgba(255,255,255,0.07);border-radius:16px;' + cellS + '"><span class="gym-stat-lbl" style="' + lblS + '">Reps</span><button onclick="_gymStep(this,-1)" class="gym-step-btn gym-step-minus desktop-only" style="position:absolute;left:0;top:0;bottom:0;width:42px;background:rgba(255,255,255,0.04);border:none;border-right:1px solid rgba(255,255,255,0.08);color:#64748b;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;border-radius:8px 0 0 8px;"><span class="material-symbols-rounded" style="font-size:18px;line-height:1;">remove</span></button><input type="number" min="1" max="999" value="' + reps + '" class="gym-card-reps gym-stat-inp" ' + focusBlur + ' style="color:#f1f5f9;' + inpS + '"><button onclick="_gymStep(this,1)" class="gym-step-btn gym-step-plus desktop-only" style="position:absolute;right:0;top:0;bottom:0;width:42px;background:rgba(255,255,255,0.04);border:none;border-left:1px solid rgba(255,255,255,0.08);color:#64748b;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;border-radius:0 8px 8px 0;"><span class="material-symbols-rounded" style="font-size:18px;line-height:1;">add</span></button></div>'
         + '<div class="gym-stat-cell" style="flex:1;border:1px solid rgba(255,255,255,0.07);border-radius:16px;' + cellS + '">' + lblRPE + '<button onclick="_gymStep(this,-1)" class="gym-step-btn gym-step-minus desktop-only" style="position:absolute;left:0;top:0;bottom:0;width:42px;background:rgba(255,255,255,0.04);border:none;border-right:1px solid rgba(255,255,255,0.08);color:#64748b;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;border-radius:8px 0 0 8px;"><span class="material-symbols-rounded" style="font-size:18px;line-height:1;">remove</span></button><input type="number" min="1" max="10" value="' + rpe + '" class="gym-card-rpe gym-stat-inp" ' + focusBlur + ' style="color:#f1f5f9;' + inpS + '"><button onclick="_gymStep(this,1)" class="gym-step-btn gym-step-plus desktop-only" style="position:absolute;right:0;top:0;bottom:0;width:42px;background:rgba(255,255,255,0.04);border:none;border-left:1px solid rgba(255,255,255,0.08);color:#64748b;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;border-radius:0 8px 8px 0;"><span class="material-symbols-rounded" style="font-size:18px;line-height:1;">add</span></button></div>'
         + '</div>'
         + '<div class="gym-col-kg" style="flex-shrink:0;width:150px;height:150px;display:flex;flex-direction:column;gap:6px;">'
         + '<div style="flex:1;border:1px solid rgba(234,179,8,0.4);' + cellKG + '"><span class="gym-stat-lbl" style="' + lblS + '">KG</span><input type="number" inputmode="decimal" step="0.5" value="' + kg + '" class="gym-card-kg gym-stat-inp gym-stat-kg" ' + focusBlur + ' style="color:#eab308;font-size:25px;font-weight:900;width:auto;background:transparent;border:none;font-family:Manrope,sans-serif;outline:none;padding:0;line-height:1;text-align:center;"></div>'
         + '<div class="gym-card-time-badge" style="display:none;align-items:center;justify-content:center;gap:4px;background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.35);border-radius:9px;padding:8px 6px;flex-shrink:0;transition:background 0.2s;touch-action:none;user-select:none;" data-hidden="1">'
         + '<span class="material-symbols-rounded" style="font-size:14px;color:#60a5fa;line-height:1;display:flex;align-items:center;">schedule</span>'
         // --- CAMBIO AQUÍ ---
         + '<span class="gym-card-time-label" style="color:#93c5fd;font-size:11px;font-weight:800;font-family:Manrope,sans-serif;font-variant-numeric:tabular-nums;line-height:1;display:flex;align-items:center;">' + tiempoDisplay + '</span>'
         + '</div>'
         + '</div>'
         + '</div>'
         + '<div style="border-top:1px solid rgba(255,255,255,0.05);padding:12px 18px 14px;display:flex;gap:6px;align-items:center;">'
         + '<div style="display:inline-flex;align-items:center;gap:6px;background:rgba(234,179,8,0.07);border:1px solid rgba(234,179,8,0.2);border-radius:14px;padding:6px 10px;flex-shrink:0;">'
         + '<button onclick="toggleCronometroGym(this)" class="gym-timer-btn" style="width:32px;height:32px;border-radius:50%;border:1.5px solid rgba(234,179,8,0.5);background:rgba(234,179,8,0.12);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;flex-shrink:0;"><span class="material-symbols-rounded" style="font-size:18px;color:#eab308;">timer</span></button>'
         // --- CAMBIO AQUÍ ---
         + '<span class="gym-timer-display" style="color:#eab308;font-size:14px;font-weight:800;font-family:Manrope,sans-serif;width:52px;min-width:52px;text-align:center;line-height:32px;letter-spacing:0.03em;">' + tiempoDisplay + '</span>'
         + '<button onclick="toggleReposoGym(this)" class="gym-reposo-btn" style="width:32px;height:32px;border-radius:50%;border:1.5px solid rgba(168,85,247,0.4);background:rgba(168,85,247,0.08);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s;"><span class="material-symbols-rounded" style="font-size:16px;color:#c084fc;">stop_circle</span></button>'
         + '<button ontouchstart="_gymResetTimerLP(this,\'start\')" ontouchend="_gymResetTimerLP(this,\'end\')" ontouchcancel="_gymResetTimerLP(this,\'cancel\')" onmousedown="_gymResetTimerLP(this,\'start\')" onmouseup="_gymResetTimerLP(this,\'end\')" onmouseleave="_gymResetTimerLP(this,\'cancel\')" style="width:32px;height:32px;border-radius:50%;border:1.5px solid rgba(234,179,8,0.5);background:rgba(234,179,8,0.12);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s;margin-left:6px;"><span class="material-symbols-rounded" style="font-size:16px;color:#eab308;">laps</span></button>'
         + '<button onclick="enviarTiempoGym(this)" style="width:32px;height:32px;border-radius:50%;border:1.5px solid rgba(234,179,8,0.5);background:rgba(234,179,8,0.12);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s;"><span class="material-symbols-rounded" style="font-size:16px;color:#eab308;">more_time</span></button>'
         + '</div>'
         + '<div style="flex:1;"></div>'
         + '<span class="gym-bolt-icon material-symbols-rounded" style="font-size:22px;color:#eab308;line-height:1;flex-shrink:0;transition:color 0.3s;font-variation-settings:\'FILL\' 1;">bolt</span>'
         + '<button onclick="toggleEjercicioGym(this)" class="gym-check-btn" data-completado="' + (completado ? '1' : '0') + '" style="width:34px;height:34px;border-radius:50%;border:2px solid ' + (completado ? '#10b981' : '#334155') + ';background:' + (completado ? '#10b981' : 'transparent') + ';cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;transition:all 0.2s;flex-shrink:0;"><span class="material-symbols-rounded" style="font-size:20px;color:' + (completado ? 'white' : '#475569') + ';line-height:1;' + (completado ? 'font-weight:700;' : '') + '">check</span></button>'
         + '</div>';
}

                        function _gymResetCard(btn) {
            var card = btn.closest('.gym-card');
            btn.closest('.gym-card-menu').style.display = 'none';
            card.querySelectorAll('.gym-stat-inp').forEach(function(inp) { inp.value = '0'; });
            var timerBtn = card.querySelector('.gym-timer-btn');
            var display = card.querySelector('.gym-timer-display');
            if (timerBtn) {
                if (timerBtn.dataset.running === '1') {
                    clearInterval(window['_gymTimer_' + timerBtn.dataset.timerId]);
                    timerBtn.dataset.running = '0';
                    var icon = timerBtn.querySelector('.material-symbols-rounded');
                    timerBtn.style.background = 'rgba(234,179,8,0.12)';
                    timerBtn.style.borderColor = 'rgba(234,179,8,0.5)';
                    if (icon) { icon.style.color = '#eab308'; icon.textContent = 'timer'; }
                }
                timerBtn.dataset.elapsed = '0';
                timerBtn.dataset.prevUploaded = '0';
            }
            if (display) display.textContent = '00:00';
            var badge = card.querySelector('.gym-card-time-badge');
            if (badge) {
                badge.dataset.totalSecs = '0';
                var badgeLabel = badge.querySelector('.gym-card-time-label');
                if (badgeLabel) badgeLabel.textContent = '00:00';
                badge.style.display = 'none';
                badge.setAttribute('data-hidden', '1');
            }
            if (typeof guardarDatos === 'function') guardarDatos();
        }

                        function duplicarGymCard(btn) {
            var card = btn.closest('.gym-card');
            btn.closest('.gym-card-menu').style.display = 'none';

            function _extraerDatosCard(c) {
                var imgEl = c.querySelector('.gym-card-img img');
                var metricasCardio = _gymSerializarMetricasCardioCard(c);
                return {
                    nombre:       c.querySelector('.gym-card-nombre')?.textContent?.trim() || '',
                    desc:         c.querySelector('.gym-card-desc')?.textContent?.trim() || '',
                    badge:        c.querySelector('.gym-card-badge-cat')?.textContent?.trim() || '',
                    badgeMaquina: c.querySelector('.gym-card-badge-maq')?.textContent?.trim() || '',
                    series:       c.querySelector('.gym-card-series')?.value || '3',
                    reps:         c.querySelector('.gym-card-reps')?.value || '12',
                    kg:           c.querySelector('.gym-card-kg')?.value || '0',
                    rir:          c.querySelector('.gym-card-rir')?.value || '',
                    rpe:          c.querySelector('.gym-card-rpe')?.value || '',
                    cardioSeriesLabel: metricasCardio ? metricasCardio.cardioSeriesLabel : '',
                    cardioRepsLabel: metricasCardio ? metricasCardio.cardioRepsLabel : '',
                    cardioRirLabel: metricasCardio ? metricasCardio.cardioRirLabel : '',
                    cardioRpeLabel: metricasCardio ? metricasCardio.cardioRpeLabel : '',
                    imgHTML:      imgEl ? '<img src="' + imgEl.src + '" style="width:100%;height:100%;object-fit:cover;border-radius:14px;">' : (c.querySelector('.gym-card-img')?.innerHTML || '')
                };
            }

            function _crearEInsertar(e, refCard, insertAfter) {
                var newCard = document.createElement('div');
                newCard.className = 'gym-card';
                newCard.style.cssText = 'background:rgba(15,23,42,0.7);border:2px solid rgba(234,179,8,0.2);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;opacity:0;transform:scale(0.95);transition:opacity 0.3s,transform 0.3s;';
                newCard.innerHTML = _gymCardInnerHTML(e.nombre, e.desc, e.badge, e.series, e.reps, e.imgHTML, e.kg, e.badgeMaquina, e.rir, e.rpe);
                if (insertAfter) refCard.after(newCard);
                else refCard.appendChild(newCard);
                if ((_gymObjetoTieneMetricasCardio(e) || _gymEsCardioCard(newCard)) && typeof _gymAsignarMetricasCardioEnCard === 'function') _gymAsignarMetricasCardioEnCard(newCard, e);
                if (typeof _gymAplicarModoCardioEnCard === 'function') _gymAplicarModoCardioEnCard(newCard);
                if (typeof _initGymCardDrag === 'function') _initGymCardDrag(newCard);
                if (typeof _initGymSwipeCells === 'function') _initGymSwipeCells(newCard);
                var _parentGrid = insertAfter ? refCard.parentNode : refCard;
                if (typeof _gymUpdateBolts === 'function') _gymUpdateBolts(_parentGrid);
                requestAnimationFrame(function() { newCard.style.opacity = '1'; newCard.style.transform = 'scale(1)'; });
                return newCard;
            }

            var offsetActual = parseInt((document.getElementById('gym-intervalo-label') || {}).dataset && document.getElementById('gym-intervalo-label').dataset.offset || 0);
            var e = _extraerDatosCard(card);
            function _panelNameDesdeGrid() {
                var panelKey = panelGrid ? (panelGrid.id || '').replace('gym-panel-','').replace('-grid','') : 'pecho';
                if (panelKey && ['pecho','espalda','brazo','pierna','cardio'].includes(panelKey)) return panelKey;
                var parentPanel = panelGrid ? panelGrid.closest('[id^="gym-panel-"]') : null;
                return parentPanel ? parentPanel.id.replace('gym-panel-','') : 'pecho';
            }
            function _capturarUndoDuplicado() {
                var histBackup = JSON.parse(JSON.stringify(window._gymSesionesHistorial || {}));
                var labelEl = document.getElementById('gym-intervalo-label');
                var offsetBak = labelEl ? labelEl.dataset.offset : '0';
                var filtroBak = labelEl ? labelEl.dataset.filtro : 'dia';
                if (labelEl) { labelEl.dataset.offset = '0'; labelEl.dataset.filtro = 'dia'; }
                var snapAntes = (typeof _serializarDatos === 'function') ? _serializarDatos() : null;
                if (labelEl) { labelEl.dataset.offset = offsetBak; labelEl.dataset.filtro = filtroBak; }
                window._gymSesionesHistorial = histBackup;
                if (snapAntes && typeof _undoCapturarEstadoActual === 'function') {
                    window._snapshotActual = snapAntes;
                    _undoCapturarEstadoActual();
                } else if (typeof _undoPushInmediato === 'function') {
                    _undoPushInmediato();
                }
            }
            function _duplicarEnFechaObjetivo(fechaKey, mensajeUndo) {
                var targetKey = fechaKey || _gymFechaKey(0);
                _capturarUndoDuplicado();
                if (typeof gymGuardarSesionDia === 'function') gymGuardarSesionDia(_gymFechaKey(offsetActual));
                var panelName = _panelNameDesdeGrid();
                var hist = window._gymSesionesHistorial;
                if (!hist) hist = window._gymSesionesHistorial = {};
                if (!hist[targetKey]) hist[targetKey] = {};
                if (!hist[targetKey].cards) hist[targetKey].cards = {};
                if (!hist[targetKey].cards[panelName]) hist[targetKey].cards[panelName] = [];
                hist[targetKey].cards[panelName].push({
                    nombre: e.nombre, desc: e.desc, badge: e.badge,
                    badgeMaquina: e.badgeMaquina, series: e.series,
                    reps: e.reps, kg: e.kg, rir: e.rir, rpe: e.rpe,
                    cardioSeriesLabel: e.cardioSeriesLabel || '', cardioRepsLabel: e.cardioRepsLabel || '',
                    cardioRirLabel: e.cardioRirLabel || '', cardioRpeLabel: e.cardioRpeLabel || '',
                    imgHTML: e.imgHTML, completado: false, cardTimeSecs: 0
                });
                _gymIrAFechaKey(targetKey);
                setTimeout(function() {
                    if (typeof _serializarDatos === 'function' && typeof guardarEnDB === 'function') {
                        var snap = _serializarDatos();
                        window._snapshotActual = snap;
                        guardarEnDB('seniorPlazAppData', snap);
                        if (typeof mostrarIndicadorGuardado === 'function') mostrarIndicadorGuardado();
                    }
                    if (mensajeUndo && typeof _gymMostrarUndo === 'function') {
                        _gymMostrarUndo(mensajeUndo, function() { undoEstado(); });
                    }
                }, 200);
            }
            function _abrirModalFechaObjetivo() {
                var previo = document.getElementById('_gymDupDateModal');
                if (previo) previo.remove();
                var fechaActual = _gymFechaKey(offsetActual);
                var modalFecha = document.createElement('div');
                modalFecha.id = '_gymDupDateModal';
                modalFecha.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.65);z-index:10055;display:flex;align-items:center;justify-content:center;padding:20px;';
                modalFecha.innerHTML = `
                    <div style="background:#0f172a;border:1px solid rgba(255,255,255,0.08);border-radius:24px;width:100%;max-width:360px;padding:20px 20px 24px;box-shadow:0 25px 60px rgba(0,0,0,0.6);">
                        <div style="color:#f1f5f9;font-size:15px;font-weight:800;margin-bottom:6px;">Enviar ejercicio a otro día</div>
                        <div style="color:#64748b;font-size:12px;margin-bottom:18px;">Selecciona la fecha destino en el calendario.</div>
                        <input id="_gymDupDateInput" type="hidden" value="${fechaActual}">
                        <button id="_gymDupDateTrigger" type="button" style="width:100%;min-height:52px;border-radius:14px;border:1px solid rgba(255,255,255,0.1);background:rgba(15,23,42,0.8);color:#f8fafc;padding:0 14px;font-size:14px;outline:none;display:flex;align-items:center;justify-content:space-between;gap:12px;text-align:left;cursor:pointer;">
                            <span style="display:flex;align-items:center;gap:10px;min-width:0;">
                                <span class="material-symbols-rounded" style="font-size:20px;color:#60a5fa;flex-shrink:0;">calendar_month</span>
                                <span id="_gymDupDateInputDisplay" style="min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${fechaActual}</span>
                            </span>
                            <span class="material-symbols-rounded" style="font-size:18px;color:#64748b;flex-shrink:0;">expand_more</span>
                        </button>
                        <div style="display:flex;gap:10px;margin-top:18px;">
                            <button id="_gymDupDateCancel" style="flex:1;height:44px;border-radius:14px;border:1px solid rgba(255,255,255,0.08);background:transparent;color:#64748b;font-size:13px;font-weight:700;cursor:pointer;">Cancelar</button>
                            <button id="_gymDupDateConfirm" style="flex:1;height:44px;border-radius:14px;border:1px solid rgba(59,130,246,0.4);background:rgba(59,130,246,0.16);color:#dbeafe;font-size:13px;font-weight:800;cursor:pointer;">Enviar</button>
                        </div>
                    </div>`;
                document.body.appendChild(modalFecha);
                var inputFecha = modalFecha.querySelector('#_gymDupDateInput');
                _gymActualizarLabelFechaDuplicado(modalFecha, fechaActual);
                var abrirSelector = function() {
                    if (!inputFecha) return;
                    if (typeof abrirCalAct2 === 'function') {
                        abrirCalAct2('_gymDupDateInput', function(valor) {
                            if (!valor) return;
                            _gymActualizarLabelFechaDuplicado(modalFecha, valor);
                        });
                        return;
                    }
                };
                var triggerFecha = modalFecha.querySelector('#_gymDupDateTrigger');
                if (triggerFecha) triggerFecha.onclick = abrirSelector;
                setTimeout(abrirSelector, 80);
                modalFecha.querySelector('#_gymDupDateCancel').onclick = function() { modalFecha.remove(); };
                modalFecha.addEventListener('click', function(ev) { if (ev.target === modalFecha) modalFecha.remove(); });
                modalFecha.querySelector('#_gymDupDateConfirm').onclick = function() {
                    var valor = inputFecha ? inputFecha.value : '';
                    if (!valor) return;
                    modalFecha.remove();
                    _duplicarEnFechaObjetivo(valor, 'Ejercicio enviado al ' + _gymFechaCortaDesdeKey(valor));
                };
            }

            if (offsetActual === 0) {
                var _snapAntesDeDuplicar = (typeof _serializarDatos === 'function') ? _serializarDatos() : null;
                if (_snapAntesDeDuplicar && typeof _undoCapturarEstadoActual === 'function') {
                    window._snapshotActual = _snapAntesDeDuplicar;
                    _undoCapturarEstadoActual();
                } else if (typeof _undoPushInmediato === 'function') {
                    _undoPushInmediato();
                }
                _crearEInsertar(e, card, true);
                setTimeout(function() {
                    if (typeof _serializarDatos === 'function' && typeof guardarEnDB === 'function') {
                        var snap = _serializarDatos();
                        window._snapshotActual = snap;
                        guardarEnDB('seniorPlazAppData', snap);
                        if (typeof mostrarIndicadorGuardado === 'function') mostrarIndicadorGuardado();
                    }
                }, 100);
                return;
            }
            var panelGrid = card.closest('.gym-panel-grid');
            var prev = document.getElementById('_gymDupModal');
            if (prev) prev.remove();
            var modal = document.createElement('div');
            modal.id = '_gymDupModal';
            modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.65);z-index:10050;display:flex;align-items:center;justify-content:center;padding:20px;';
            modal.innerHTML = `
                <div style="background:#0f172a;border:1px solid rgba(255,255,255,0.08);border-radius:24px;width:100%;max-width:380px;padding:20px 20px 24px;box-shadow:0 25px 60px rgba(0,0,0,0.6);animation:slideUp 0.25s ease-out;">
                    <div style="width:36px;height:4px;background:rgba(255,255,255,0.15);border-radius:2px;margin:0 auto 18px;"></div>
                    <div style="color:#f1f5f9;font-size:15px;font-weight:800;margin-bottom:3px;">Duplicar ejercicio</div>
                    <div style="color:#64748b;font-size:12px;margin-bottom:20px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">"${e.nombre || 'Sin nombre'}"</div>
                    <div style="display:flex;flex-direction:column;gap:10px;">
                        <button id="_gymDupHoy" style="width:100%;display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:16px;border:1px solid rgba(234,179,8,0.35);background:rgba(234,179,8,0.08);cursor:pointer;text-align:left;">
                            <div style="width:40px;height:40px;border-radius:12px;background:rgba(234,179,8,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <span class="material-symbols-rounded" style="font-size:20px;color:#eab308;">today</span>
                            </div>
                            <div>
                                <div style="color:#f1f5f9;font-size:13px;font-weight:800;">Enviar a la sesión de hoy</div>
                                <div style="color:#64748b;font-size:11px;margin-top:2px;">Se añade al panel de hoy y te lleva allí</div>
                            </div>
                        </button>
                        <button id="_gymDupOtroDia" style="width:100%;display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:16px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);cursor:pointer;text-align:left;">
                            <div style="width:40px;height:40px;border-radius:12px;background:rgba(148,163,184,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <span class="material-symbols-rounded" style="font-size:20px;color:#94a3b8;">calendar_month</span>
                            </div>
                            <div>
                                <div style="color:#f1f5f9;font-size:13px;font-weight:800;">Enviar a otro día</div>
                                <div style="color:#64748b;font-size:11px;margin-top:2px;">Abre el calendario y lo manda a la fecha que elijas</div>
                            </div>
                        </button>
                        <button id="_gymDupCancelar" style="width:100%;height:44px;border-radius:14px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:#64748b;font-size:13px;font-weight:700;cursor:pointer;margin-top:4px;">Cancelar</button>
                    </div>
                </div>`;
            document.body.appendChild(modal);
            modal.querySelector('#_gymDupCancelar').onclick = function() { modal.remove(); };
            modal.addEventListener('click', function(ev) { if (ev.target === modal) modal.remove(); });
            modal.querySelector('#_gymDupHoy').onclick = function() {
                modal.remove();
                _duplicarEnFechaObjetivo(_gymFechaKey(0), 'Ejercicio enviado a hoy');
            };
            modal.querySelector('#_gymDupOtroDia').onclick = function() {
                modal.remove();
                _abrirModalFechaObjetivo();
            };
        }
        function _gymModalConfirm(titulo, mensaje, onConfirm) {
            var prev = document.getElementById('_gymConfirmModal');
            if (prev) prev.remove();
            var modal = document.createElement('div');
            modal.id = '_gymConfirmModal';
            modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.65);z-index:10050;display:flex;align-items:center;justify-content:center;padding:20px;';
            modal.innerHTML = `
                <div style="background:#0f172a;border:1px solid rgba(239,68,68,0.35);border-radius:20px;width:100%;max-width:360px;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.6);">
                    <div style="padding:20px 20px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,0.06);">
                        <div style="width:38px;height:38px;border-radius:12px;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                            <span class="material-symbols-rounded" style="font-size:20px;color:#f87171;">delete_forever</span>
                        </div>
                        <div>
                            <div style="color:#f1f5f9;font-size:14px;font-weight:800;">${titulo}</div>
                            <div style="color:#94a3b8;font-size:12px;margin-top:2px;">${mensaje}</div>
                        </div>
                    </div>
                    <div style="padding:16px 20px;display:flex;gap:10px;">
                        <button id="_gymConfirmCancelar" style="flex:1;height:42px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#94a3b8;font-size:13px;font-weight:700;cursor:pointer;">Cancelar</button>
                        <button id="_gymConfirmOk" style="flex:1;height:42px;border-radius:12px;border:1px solid rgba(239,68,68,0.4);background:rgba(239,68,68,0.15);color:#f87171;font-size:13px;font-weight:700;cursor:pointer;">Eliminar</button>
                    </div>
                </div>`;
            document.body.appendChild(modal);
            modal.querySelector('#_gymConfirmCancelar').onclick = function() { modal.remove(); };
            modal.querySelector('#_gymConfirmOk').onclick = function() { modal.remove(); onConfirm(); };
            modal.addEventListener('click', function(e){ if(e.target===modal) modal.remove(); });
        }
        function _gymMostrarUndo(mensaje, onUndo) {
            var prev = document.getElementById('_gymUndoSnack');
            if (prev) { clearTimeout(prev._timer); prev.remove(); }
            var snack = document.createElement('div');
            snack.id = '_gymUndoSnack';
            snack.style.cssText = 'position:fixed;bottom:' + Math.max(24, _toastBottomOffsetPx()) + 'px;left:50%;transform:translateX(-50%);background:#1e293b;border:1px solid rgba(234,179,8,0.35);border-radius:14px;padding:12px 16px;display:flex;align-items:center;gap:14px;z-index:10060;box-shadow:0 8px 32px rgba(0,0,0,0.5);white-space:nowrap;max-width:min(calc(100vw - 32px), 420px);';
            snack.innerHTML = `<span style="color:#f1f5f9;font-size:13px;font-weight:600;">${mensaje}</span>
                <button id="_gymUndoBtn" style="background:rgba(234,179,8,0.15);border:1px solid rgba(234,179,8,0.4);border-radius:9px;color:#eab308;font-size:12px;font-weight:800;padding:5px 12px;cursor:pointer;display:flex;align-items:center;gap:5px;">
                    <span class="material-symbols-rounded" style="font-size:15px;">undo</span>Deshacer
                </button>`;
            document.body.appendChild(snack);
            snack.querySelector('#_gymUndoBtn').onclick = function() {
                clearTimeout(snack._timer);
                snack.remove();
                if (typeof window._undoPopSnapshot === 'function') window._undoPopSnapshot();
                onUndo();
            };
            snack._timer = setTimeout(function(){ if(snack.parentNode) snack.remove(); }, 5000);
        }

        function eliminarTodasGymCards() {
            var vistaActiva = window._vistaGymActiva || 'pecho';
            var panel = document.getElementById('gym-panel-' + vistaActiva);
            if (!panel) return;
            var offsetActual = parseInt((document.getElementById('gym-intervalo-label')||{}).dataset&&document.getElementById('gym-intervalo-label').dataset.offset || 0);
            var fechaKey = _gymFechaKey(offsetActual);
            var cardsDOM = panel.querySelectorAll('.gym-card');
            var cardsHist = window._gymSesionesHistorial && window._gymSesionesHistorial[fechaKey] && window._gymSesionesHistorial[fechaKey].cards && window._gymSesionesHistorial[fechaKey].cards[vistaActiva];
            if (cardsDOM.length === 0 && (!cardsHist || cardsHist.length === 0)) return;

            var nombreVista = {pecho:'Pecho',espalda:'Espalda',brazo:'Brazo',pierna:'Pierna',cardio:'Cardio'}[vistaActiva] || vistaActiva;
            _gymModalConfirm(
                '¿Eliminar todas las tarjetas?',
                nombreVista + ' · ' + cardsDOM.length + ' ejercicio' + (cardsDOM.length !== 1 ? 's' : ''),
                function() {
                    var snapshot = Array.from(cardsDOM).map(function(c){ return c.outerHTML; });
                    var snapshotHist = cardsHist ? JSON.parse(JSON.stringify(cardsHist)) : [];
                    var statEj = document.getElementById('gym-stat-ejercicios');
                    var prevEj = statEj ? parseInt(statEj.textContent||0) : 0;
                    var _snapAntesTodas = (typeof _serializarDatos === 'function') ? _serializarDatos() : null;
                    if (_snapAntesTodas && typeof _undoCapturarEstadoActual === 'function') {
                        window._snapshotActual = _snapAntesTodas;
                        _undoCapturarEstadoActual();
                    } else if (typeof _undoPushInmediato === 'function') {
                        _undoPushInmediato();
                    }
                    cardsDOM.forEach(function(card) {
                        var checkBtn = card.querySelector('.gym-check-btn');
                        if (checkBtn && checkBtn.dataset.completado === '1' && statEj) {
                            statEj.textContent = Math.max(0, parseInt(statEj.textContent||0) - 1);
                        }
                    });
                    var grid = panel.querySelector('.gym-panel-grid');
                    if (grid && grid._sortable) { grid._sortable.destroy(); grid._sortable = null; }
                    if (grid) grid.remove();
                    panel.querySelectorAll('.gym-card').forEach(function(c){ c.remove(); });
                    if (window._gymSesionesHistorial && window._gymSesionesHistorial[fechaKey]) {
                        if (!window._gymSesionesHistorial[fechaKey].cards) window._gymSesionesHistorial[fechaKey].cards = {};
                        window._gymSesionesHistorial[fechaKey].cards[vistaActiva] = [];
                    }
                    if (typeof _serializarDatos === 'function' && typeof guardarEnDB === 'function') {
                        var snapPostTodas = _serializarDatos();
                        window._snapshotActual = snapPostTodas;
                        guardarEnDB('seniorPlazAppData', snapPostTodas);
                        if (typeof mostrarIndicadorGuardado === 'function') mostrarIndicadorGuardado();
                    }
                    if (typeof _gymEmptyState === 'function') _gymEmptyState(panel);
                    _gymMostrarUndo('Tarjetas eliminadas', function() {
                        var g = panel.querySelector('.gym-panel-grid');
                        if (g && g._sortable) { g._sortable.destroy(); g._sortable = null; }
                        panel.innerHTML = '';
                        g = document.createElement('div');
                        g.className = 'gym-panel-grid';
                        panel.appendChild(g);
                        snapshot.forEach(function(html){ g.insertAdjacentHTML('beforeend', html); });
                        _initGymSortable(g);
                        _initAllGymCards();
                        if (window._gymSesionesHistorial && window._gymSesionesHistorial[fechaKey]) {
                            window._gymSesionesHistorial[fechaKey].cards[vistaActiva] = snapshotHist;
                        }
                        if (statEj) statEj.textContent = prevEj;
                        if (typeof guardarDatos === 'function') guardarDatos();
                    });
                }
            );
        }

        function eliminarGymCard(btn) {
            var card = btn.closest('.gym-card');
            btn.closest('.gym-card-menu').style.display = 'none';
            var snapshotHTML = card.outerHTML;
            var snapshotNext = card.nextElementSibling; // para reinsertar en posición correcta
            var snapshotPrev = card.previousElementSibling;
            var grid = card.closest('.gym-panel-grid');
            var panel = document.getElementById('gym-panel-' + (window._vistaGymActiva||'pecho'));
            var checkBtn = card.querySelector('.gym-check-btn');
            var eraCompletada = checkBtn && checkBtn.dataset.completado === '1';
            var statEj = document.getElementById('gym-stat-ejercicios');
            var prevEj = statEj ? parseInt(statEj.textContent||0) : 0;
            var nombre = card.querySelector('.gym-card-nombre')?.textContent?.trim() || 'Ejercicio';

            if (eraCompletada && statEj) statEj.textContent = Math.max(0, prevEj - 1);
            var _snapAntesElim = (typeof _serializarDatos === 'function') ? _serializarDatos() : null;
            if (_snapAntesElim && typeof _undoCapturarEstadoActual === 'function') {
                window._snapshotActual = _snapAntesElim;
                _undoCapturarEstadoActual();
            } else if (typeof _undoPushInmediato === 'function') {
                _undoPushInmediato();
            }
            card.style.transition = 'opacity 0.22s, transform 0.22s';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(function() {
                card.remove();
                if (panel && typeof _gymEmptyState === 'function') _gymEmptyState(panel);
                if (typeof _serializarDatos === 'function' && typeof guardarEnDB === 'function') {
                    var snapPost = _serializarDatos();
                    window._snapshotActual = snapPost;
                    guardarEnDB('seniorPlazAppData', snapPost);
                    if (typeof mostrarIndicadorGuardado === 'function') mostrarIndicadorGuardado();
                }

                _gymMostrarUndo('"' + nombre + '" eliminado', function() {
                    var g = panel && panel.querySelector('.gym-panel-grid');
                    if (!g) {
                        g = document.createElement('div');
                        g.className = 'gym-panel-grid';
                        if (panel) { panel.innerHTML = ''; panel.appendChild(g); }
                    } else {
                        panel.querySelectorAll('.gym-empty-state').forEach(function(e){ e.remove(); });
                    }
                    if (snapshotNext && snapshotNext.parentNode === g) {
                        snapshotNext.insertAdjacentHTML('beforebegin', snapshotHTML);
                    } else if (snapshotPrev && snapshotPrev.parentNode === g) {
                        snapshotPrev.insertAdjacentHTML('afterend', snapshotHTML);
                    } else {
                        g.insertAdjacentHTML('beforeend', snapshotHTML);
                    }
                    _initGymSortable(g);
                    _initAllGymCards();
                    if (eraCompletada && statEj) statEj.textContent = prevEj;
                    if (typeof guardarDatos === 'function') guardarDatos();
                });
            }, 220);
        }
        function editarGymCard(btn) {
            var card = btn.closest('.gym-card');
            btn.closest('.gym-card-menu').style.display = 'none';
            var imgBox = card.querySelector('.gym-card-img');
            var curNombre = card.querySelector('.gym-card-nombre')?.textContent?.trim() || '';
            var curDesc   = card.querySelector('.gym-card-desc')?.textContent?.trim() || '';
            var curBadge  = card.querySelector('.gym-card-badge-cat')?.textContent?.trim() || '';
            var curMaq    = card.querySelector('.gym-card-badge-maq')?.textContent?.trim() || '';
            var curImgHTML = imgBox ? imgBox.innerHTML : '';
            var curSeries = card.querySelector('.gym-card-series')?.value || '';
            var curReps   = card.querySelector('.gym-card-reps')?.value || '';
            var curKg     = card.querySelector('.gym-card-kg')?.value || '';
            var curRir    = card.querySelector('.gym-card-rir')?.value || '';
            var curRpe    = card.querySelector('.gym-card-rpe')?.value || '';
            var esCardioEdit = typeof _gymEsCardioCard === 'function' && _gymEsCardioCard(card);
            var curMetricasCardio = esCardioEdit && typeof _gymMetricasCardioDesdeCard === 'function'
                ? _gymMetricasCardioDesdeCard(card)
                : _gymNormalizarMetricasCardio();
            var pendingImgHTML = null;
            var overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.75);z-index:10001;display:flex;align-items:center;justify-content:center;padding:16px;';
            overlay.innerHTML = `
                <div style="background:#0f172a;border:1px solid rgba(71,85,105,0.35);border-radius:20px;width:100%;max-width:440px;display:flex;flex-direction:column;overflow:hidden;">
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px 12px;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,0.05);">
                        <span style="color:#f1f5f9;font-size:14px;font-weight:800;">Editar ejercicio</span>
                        <button onclick="this.closest('[style*=fixed]').remove()" style="background:none;border:none;color:#64748b;cursor:pointer;padding:4px;"><span class="material-symbols-rounded" style="font-size:20px;">close</span></button>
                    </div>
                    <div style="padding:16px 20px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;max-height:70vh;">
                        <div style="display:flex;gap:12px;align-items:flex-start;">
                            <div id="_edit_img_preview" style="flex-shrink:0;width:72px;height:72px;border-radius:10px;background:rgba(15,23,42,0.8);border:1px solid rgba(255,255,255,0.08);overflow:hidden;display:flex;align-items:center;justify-content:center;position:relative;cursor:pointer;" title="Clic para cambiar imagen">
                                ${curImgHTML}
                                <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0);display:flex;align-items:center;justify-content:center;transition:background 0.2s;border-radius:10px;" onmouseover="this.style.background='rgba(0,0,0,0.5)'" onmouseout="this.style.background='rgba(0,0,0,0)'">
                                    <span class="material-symbols-rounded" style="font-size:20px;color:rgba(255,255,255,0.8);">add_photo_alternate</span>
                                </div>
                            </div>
                            <div style="flex:1;display:flex;flex-direction:column;gap:8px;">
                                <input id="_edit_nombre" type="text" value="${curNombre}" placeholder="Nombre" style="width:100%;box-sizing:border-box;background:rgba(15,23,42,0.8);border:1px solid rgba(71,85,105,0.4);border-radius:9px;padding:8px 12px;color:#f1f5f9;font-size:13px;font-weight:700;outline:none;font-family:Manrope,sans-serif;">
                                <textarea id="_edit_desc" rows="2" placeholder="Descripción" onkeydown="if(event.key==='Enter'){event.stopPropagation();}" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'" style="width:100%;box-sizing:border-box;background:rgba(15,23,42,0.8);border:1px solid rgba(71,85,105,0.4);border-radius:9px;padding:8px 12px;color:#f1f5f9;font-size:12px;font-weight:500;outline:none;resize:none;overflow:hidden;min-height:44px;font-family:Manrope,sans-serif;">${curDesc}</textarea>
                            </div>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                            <div><label style="color:#eab308;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;display:block;margin-bottom:4px;">Badge categoría</label><input id="_edit_badge" type="text" value="${curBadge}" style="width:100%;box-sizing:border-box;background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.35);border-radius:9px;padding:8px 10px;color:#eab308;font-size:12px;font-weight:700;outline:none;font-family:Manrope,sans-serif;"></div>
                            <div><label style="color:#94a3b8;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;display:block;margin-bottom:4px;">Cód. máquina</label><input id="_edit_maq" type="text" value="${curMaq}" style="width:100%;box-sizing:border-box;background:rgba(15,23,42,0.9);border:1px solid rgba(255,255,255,0.18);border-radius:9px;padding:8px 10px;color:#f1f5f9;font-size:12px;font-weight:700;outline:none;font-family:Manrope,sans-serif;"></div>
                        </div>
                        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;">
                            <div><label style="color:#94a3b8;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;display:block;margin-bottom:4px;">${esCardioEdit ? curMetricasCardio.series : 'Series'}</label><input id="_edit_series" type="number" value="${curSeries}" min="${esCardioEdit ? '0' : '1'}" max="${esCardioEdit ? '3000' : '99'}" style="width:100%;box-sizing:border-box;background:rgba(15,23,42,0.8);border:1px solid rgba(71,85,105,0.4);border-radius:9px;padding:8px 6px;color:#f1f5f9;font-size:14px;font-weight:800;outline:none;font-family:Manrope,sans-serif;text-align:center;"></div>
                            <div><label style="color:#94a3b8;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;display:block;margin-bottom:4px;">${esCardioEdit ? curMetricasCardio.reps : 'Reps'}</label><input id="_edit_reps" type="number" value="${curReps}" min="${esCardioEdit ? '0' : '1'}" max="${esCardioEdit ? '250' : '999'}" style="width:100%;box-sizing:border-box;background:rgba(15,23,42,0.8);border:1px solid rgba(71,85,105,0.4);border-radius:9px;padding:8px 6px;color:#f1f5f9;font-size:14px;font-weight:800;outline:none;font-family:Manrope,sans-serif;text-align:center;"></div>
                            <div><label style="color:#94a3b8;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;display:block;margin-bottom:4px;">${esCardioEdit ? curMetricasCardio.rir : 'RIR'}</label><input id="_edit_rir" type="number" value="${curRir}" min="0" max="${esCardioEdit ? '250' : '10'}" style="width:100%;box-sizing:border-box;background:rgba(15,23,42,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:9px;padding:8px 6px;color:#f1f5f9;font-size:14px;font-weight:800;outline:none;font-family:Manrope,sans-serif;text-align:center;"></div>
                            <div><label style="color:#94a3b8;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;display:block;margin-bottom:4px;">${esCardioEdit ? curMetricasCardio.rpe : 'RPE'}</label><input id="_edit_rpe" type="number" value="${curRpe}" min="${esCardioEdit ? '0' : '1'}" max="${esCardioEdit ? '250' : '10'}" style="width:100%;box-sizing:border-box;background:rgba(15,23,42,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:9px;padding:8px 6px;color:#f1f5f9;font-size:14px;font-weight:800;outline:none;font-family:Manrope,sans-serif;text-align:center;"></div>
                            <div><label style="color:${esCardioEdit ? '#fb923c' : '#94a3b8'};font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;display:block;margin-bottom:4px;">${esCardioEdit ? 'KM' : 'KG'}</label><input id="_edit_kg" type="number" inputmode="decimal" value="${curKg}" min="0" step="${esCardioEdit ? '0.1' : '0.5'}" style="width:100%;box-sizing:border-box;background:rgba(15,23,42,0.8);border:1px solid ${esCardioEdit ? 'rgba(249,115,22,0.35)' : 'rgba(234,179,8,0.3)'};border-radius:9px;padding:8px 6px;color:${esCardioEdit ? '#fb923c' : '#eab308'};font-size:14px;font-weight:800;outline:none;font-family:Manrope,sans-serif;text-align:center;"></div>
                        </div>
                        <div id="_edit_metricas_cardio_wrap" style="display:${esCardioEdit ? 'block' : 'none'};"></div>
                        <button id="_edit_save_btn" style="width:100%;height:40px;border-radius:12px;border:1px solid rgba(59,130,246,0.5);background:rgba(59,130,246,0.15);color:#60a5fa;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.07em;cursor:pointer;margin-top:4px;">Guardar cambios</button>
                    </div>
                </div>`;
            document.body.appendChild(overlay);
            const _ed = overlay.querySelector('#_edit_desc'); if(_ed){ setTimeout(()=>{ _ed.style.height='auto'; _ed.style.height=_ed.scrollHeight+'px'; },0); }
            if (esCardioEdit && typeof _gymMontarSelectorMetricasCardio === 'function') {
                _gymMontarSelectorMetricasCardio(overlay.querySelector('#_edit_metricas_cardio_wrap'), curMetricasCardio);
            }
            overlay.addEventListener('click', function(e){ if(e.target === overlay) overlay.remove(); });
            var preview = overlay.querySelector('#_edit_img_preview');
            preview.addEventListener('click', function() {
                var inp = document.createElement('input');
                inp.type = 'file'; inp.accept = 'image/*,.svg';
                inp.onchange = async function() {
                    var file = inp.files[0]; if (!file) return;
                    var setSrc = function(src) {
                        pendingImgHTML = '<img src="' + src + '" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">';
                        var firstChild = preview.firstElementChild;
                        if (firstChild && firstChild.tagName !== 'DIV') firstChild.remove();
                        var img = document.createElement('img');
                        img.src = src;
                        img.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;object-fit:cover;border-radius:10px;';
                        preview.insertBefore(img, preview.firstChild);
                    };
                    try {
                        var url = await subirACloudinary(file);
                        setSrc(url);
                    } catch(e) {
                        var reader = new FileReader();
                        reader.onload = function(ev) { setSrc(ev.target.result); };
                        reader.readAsDataURL(file);
                    }
                };
                inp.click();
            });
            overlay.querySelector('#_edit_save_btn').onclick = function() {
    // Capturar estado del badge, timer y completado ANTES de reconstruir
    var oldCheckBtn     = card.querySelector('.gym-check-btn');
    var savedCompletado = oldCheckBtn ? (oldCheckBtn.dataset.completado === '1') : false;
    var oldTimerBtn    = card.querySelector('.gym-timer-btn');
    var oldBadge       = card.querySelector('.gym-card-time-badge');
    var oldTimerDisplay = card.querySelector('.gym-timer-display');
    var savedBadgeTotalSecs     = oldBadge ? (oldBadge.dataset.totalSecs || '0') : '0';
    var savedBadgeHidden        = oldBadge ? oldBadge.hasAttribute('data-hidden') : true;
    var savedBadgeDisplay       = oldBadge ? oldBadge.style.display : 'none';
    var savedBadgeLabel         = oldBadge ? (oldBadge.querySelector('.gym-card-time-label')?.textContent || '00:00') : '00:00';
    var savedElapsed            = oldTimerBtn ? (oldTimerBtn.dataset.elapsed || '0') : '0';
    var savedPrevUploaded       = oldTimerBtn ? (oldTimerBtn.dataset.prevUploaded || '0') : '0';
    var savedCardPrevUploaded   = oldTimerBtn ? (oldTimerBtn.dataset.cardPrevUploaded || '0') : '0';
    var savedTimerRunning       = oldTimerBtn ? (oldTimerBtn.dataset.running || '0') : '0';
    var savedTimerDisplay       = oldTimerDisplay ? (oldTimerDisplay.textContent || '00:00') : '00:00';

    var newNombre = overlay.querySelector('#_edit_nombre').value.trim();
    var newDesc   = overlay.querySelector('#_edit_desc').value.trim();
    var newBadge  = overlay.querySelector('#_edit_badge').value.trim();
    var newMaq    = overlay.querySelector('#_edit_maq').value.trim();
    var newSeries = overlay.querySelector('#_edit_series').value;
    var newReps   = overlay.querySelector('#_edit_reps').value;
    var newKg     = overlay.querySelector('#_edit_kg').value;
    var newRir    = overlay.querySelector('#_edit_rir').value;
    var newRpe    = overlay.querySelector('#_edit_rpe').value;
    var newMetricasCardio = esCardioEdit && typeof _gymLeerSelectorMetricasCardio === 'function'
        ? _gymLeerSelectorMetricasCardio(overlay.querySelector('#_edit_metricas_cardio_wrap'))
        : null;
    var finalImgHTML = pendingImgHTML || (imgBox ? imgBox.innerHTML : '');

    card.innerHTML = _gymCardInnerHTML(newNombre, newDesc, newBadge, newSeries, newReps, finalImgHTML, newKg, newMaq, newRir, newRpe, savedCompletado, '00:00');
    if (esCardioEdit && newMetricasCardio && typeof _gymAsignarMetricasCardioEnCard === 'function') _gymAsignarMetricasCardioEnCard(card, newMetricasCardio);

    // Restaurar estado del badge exactamente como estaba
    var newBadgeEl = card.querySelector('.gym-card-time-badge');
    var newLabelEl = newBadgeEl ? newBadgeEl.querySelector('.gym-card-time-label') : null;
    if (newBadgeEl) {
        newBadgeEl.dataset.totalSecs = savedBadgeTotalSecs;
        if (savedBadgeHidden) { newBadgeEl.setAttribute('data-hidden', '1'); newBadgeEl.style.display = 'none'; }
        else { newBadgeEl.removeAttribute('data-hidden'); newBadgeEl.style.display = savedBadgeDisplay || 'flex'; }
        if (newLabelEl) newLabelEl.textContent = savedBadgeLabel;
    }
    // Restaurar estado del cronómetro
    var newTimerBtn = card.querySelector('.gym-timer-btn');
    var newTimerDisplay = card.querySelector('.gym-timer-display');
    if (newTimerBtn) {
        newTimerBtn.dataset.elapsed          = savedElapsed;
        newTimerBtn.dataset.prevUploaded     = savedPrevUploaded;
        newTimerBtn.dataset.cardPrevUploaded = savedCardPrevUploaded;
        newTimerBtn.dataset.running          = savedTimerRunning;
    }
    if (newTimerDisplay) newTimerDisplay.textContent = savedTimerDisplay;

    if (typeof _gymAplicarModoCardioEnCard === 'function') _gymAplicarModoCardioEnCard(card);
    if (typeof _initGymCardDrag === 'function') _initGymCardDrag(card);
    var _ctxEdit = (typeof _gymContextoActivo === 'function') ? _gymContextoActivo() : null;
    if (_ctxEdit && _ctxEdit.esDia && typeof _gymActualizarStatCardioKm === 'function') {
        _gymActualizarStatCardioKm(_ctxEdit.fechaKey);
    }
    if (typeof initTooltips === 'function') initTooltips();
    overlay.remove();
    if (typeof guardarDatos === 'function') guardarDatos();
};
        }

        function _initGymCardDrag(card) { /* no-op */ }

        function _gymEsCardioCard(card) {
            if (!card) return false;
            var panel = card.dataset.panel || '';
            if (!panel) {
                var parent = card.closest('[id^="gym-panel-"]');
                panel = parent ? parent.id.replace('gym-panel-', '') : '';
            }
            return panel === 'cardio';
        }

        function _gymAplicarModoCardioEnCard(card) {
            if (!card) return;
            var isCardio = _gymEsCardioCard(card);
            var metricasCardio = _gymMetricasCardioDesdeCard(card);

            var inpSeries = card.querySelector('.gym-card-series');
            var inpReps = card.querySelector('.gym-card-reps');
            var inpRir = card.querySelector('.gym-card-rir');
            var inpRpe = card.querySelector('.gym-card-rpe');
            var inpKg = card.querySelector('.gym-card-kg');

            var lblSeries = inpSeries ? inpSeries.closest('.gym-stat-cell')?.querySelector('.gym-stat-lbl') : null;
            var lblReps = inpReps ? inpReps.closest('.gym-stat-cell')?.querySelector('.gym-stat-lbl') : null;
            var cellRir = inpRir ? inpRir.closest('.gym-stat-cell') : null;
            var cellRpe = inpRpe ? inpRpe.closest('.gym-stat-cell') : null;
            var lblRir = cellRir ? cellRir.querySelector('div:first-child > span:not(.material-symbols-rounded)') : null;
            var lblRpe = cellRpe ? cellRpe.querySelector('div:first-child > span:not(.material-symbols-rounded)') : null;
            var tipRir = cellRir ? cellRir.querySelector('.tooltip-container') : null;
            var tipRpe = cellRpe ? cellRpe.querySelector('.tooltip-container') : null;
            var lblKg = inpKg ? inpKg.closest('div')?.querySelector('.gym-stat-lbl') : null;

            if (lblSeries) lblSeries.textContent = isCardio ? metricasCardio.series : 'Series';
            if (lblReps) lblReps.textContent = isCardio ? metricasCardio.reps : 'Reps';
            if (lblRir) lblRir.textContent = isCardio ? metricasCardio.rir : 'RIR';
            if (lblRpe) lblRpe.textContent = isCardio ? metricasCardio.rpe : 'RPE';
            if (lblKg) lblKg.textContent = isCardio ? 'KM' : 'KG';

            [lblSeries, lblReps, lblRir, lblRpe].forEach(function(lbl) {
                if (!lbl) return;
                if (isCardio) {
                    lbl.style.whiteSpace = 'normal';
                    lbl.style.textAlign = 'center';
                    lbl.style.lineHeight = '1.1';
                    lbl.style.fontSize = '8px';
                    lbl.style.letterSpacing = '0.03em';
                } else {
                    lbl.style.whiteSpace = '';
                    lbl.style.textAlign = '';
                    lbl.style.lineHeight = '';
                    lbl.style.fontSize = '9px';
                    lbl.style.letterSpacing = '';
                }
            });

            if (tipRir) tipRir.style.display = isCardio ? 'none' : '';
            if (tipRpe) tipRpe.style.display = isCardio ? 'none' : '';

            if (inpSeries) {
                inpSeries.min = isCardio ? '0' : '1';
                inpSeries.max = isCardio ? '3000' : '99';
            }
            if (inpReps) {
                inpReps.min = isCardio ? '0' : '1';
                inpReps.max = isCardio ? '250' : '999';
            }
            if (inpRir) {
                inpRir.min = '0';
                inpRir.max = isCardio ? '250' : '10';
            }
            if (inpRpe) {
                inpRpe.min = isCardio ? '0' : '1';
                inpRpe.max = isCardio ? '250' : '10';
            }
            if (inpKg) {
                inpKg.min = '0';
                inpKg.step = isCardio ? '0.1' : '0.5';
                inpKg.inputMode = 'decimal';
                inpKg.style.color = isCardio ? '#fb923c' : '#eab308';
            }
            if (inpKg && inpKg.parentElement) {
                inpKg.parentElement.style.borderColor = isCardio ? 'rgba(249,115,22,0.4)' : 'rgba(234,179,8,0.4)';
            }

            card.dataset.cardioMode = isCardio ? '1' : '0';
            var rutaBtn = card.querySelector('.gym-menu-ruta');
            if (rutaBtn) rutaBtn.style.display = isCardio ? 'flex' : 'none';
        }

        function _syncGymGridCardMeta(grid) {
            if (!grid) return;
            var panel = grid.closest('[id^="gym-panel-"]');
            var panelCategory = panel ? panel.id.replace('gym-panel-', '') : '';
            Array.from(grid.querySelectorAll(':scope > .gym-card')).forEach(function(card, idx) {
                if (panelCategory) card.dataset.panel = panelCategory;
                card.dataset.cardIndex = String(idx);
                _gymAplicarModoCardioEnCard(card);
            });
        }

        function _initGymSortable(grid) {
            if (!grid) return;
            if (grid._sortable) { grid._sortable.destroy(); grid._sortable = null; }

            _syncGymGridCardMeta(grid);
            if (!window.Sortable) return;

            grid._sortable = new Sortable(grid, {
                animation: 150,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                draggable: '.gym-card',
                ghostClass: 'sortable-ghost',
                dragClass: 'sortable-drag',
                chosenClass: 'sortable-chosen',
                fallbackClass: 'sortable-fallback',
                fallbackOnBody: true,
                swapThreshold: 0.65,
                handle: '.gym-drag-handle',
                preventOnFilter: true,
                delay: 0,
                delayOnTouchOnly: false,
                touchStartThreshold: 3,
                forceFallback: true,
                fallbackTolerance: 0,
                onChoose: function() {
                    if (navigator.vibrate) navigator.vibrate(30);
                },
                onStart: function(evt) {
                    if (navigator.vibrate) navigator.vibrate(30);
                    var rect = evt.item.getBoundingClientRect();
                    var realWidth = rect.width;
                    var realHeight = rect.height;
                    var isMobile = window.innerWidth < 768;

                    evt.item.style.width = realWidth + 'px';
                    evt.item.style.height = realHeight + 'px';
                    setTimeout(function() {
                        var fallback = document.querySelector('.sortable-fallback');
                        if (fallback) {
                            fallback.style.width = realWidth + 'px';
                            fallback.style.height = realHeight + 'px';
                            fallback.style.opacity = '1';
                            fallback.style.visibility = 'visible';
                            fallback.style.background = 'rgba(15, 23, 42, 0.95)';
                            fallback.style.backdropFilter = 'blur(8px)';
                            fallback.style.webkitBackdropFilter = 'blur(8px)';
                            fallback.style.border = '2px solid rgba(99, 102, 241, 0.5)';
                            fallback.style.borderRadius = '20px';
                            fallback.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.5)';
                            fallback.style.transform = 'scale(1.05)';
                            fallback.style.transition = 'none';
                            fallback.style.cursor = 'grabbing';
                            fallback.style.zIndex = '100000';
                            if (isMobile) {
                                var lockedLeft = parseFloat(fallback.style.left) || rect.left;
                                var _axisLockCancelled = false;
                                grid._axisLockCancel = function() { _axisLockCancelled = true; };
                                (function lockX() {
                                    if (_axisLockCancelled || !fallback.isConnected) return;
                                    fallback.style.left = lockedLeft + 'px';
                                    requestAnimationFrame(lockX);
                                })();
                            }
                        }
                    }, 0);
                },
                onMove: function() {
                    var fallback = document.querySelector('.sortable-fallback');
                    if (fallback && fallback.style.opacity !== '1') {
                        fallback.style.opacity = '1';
                        fallback.style.visibility = 'visible';
                    }
                },
                onEnd: function(evt) {
                    if (grid._axisLockCancel) { grid._axisLockCancel(); delete grid._axisLockCancel; }
                    var mainEl = document.querySelector('main');
                    var containerEl = document.querySelector('.container');
                    document.body.classList.add('drag-ending');
                    document.documentElement.classList.add('drag-ending');
                    if (mainEl) mainEl.classList.add('drag-ending');
                    if (containerEl) containerEl.classList.add('drag-ending');

                    evt.item.style.width = '';
                    evt.item.style.height = '';

                    _syncGymGridCardMeta(grid);
                    if (evt && evt.from && evt.from !== grid) _syncGymGridCardMeta(evt.from);
                    if (evt && evt.to && evt.to !== grid) _syncGymGridCardMeta(evt.to);

                    setTimeout(function() {
                        document.body.classList.remove('drag-ending');
                        document.documentElement.classList.remove('drag-ending');
                        if (mainEl) mainEl.classList.remove('drag-ending');
                        if (containerEl) containerEl.classList.remove('drag-ending');
                    }, 100);

                    var elInt = document.getElementById('gym-intervalo-label');
                    var offset = elInt ? parseInt(elInt.dataset.offset || 0) : 0;
                    var fechaKey = _gymFechaKey(offset);
                    if (typeof gymGuardarSesionDia === 'function') gymGuardarSesionDia(fechaKey);
                    if (typeof _gymUpdateBolts === 'function') {
                        if (evt && evt.from && evt.from !== evt.to) _gymUpdateBolts(evt.from);
                        _gymUpdateBolts(evt && evt.to ? evt.to : grid);
                    }
                }
            });
        }
        function _gymUpdateBolts(grid) {
            if (!grid) {
                document.querySelectorAll('.gym-panel-grid').forEach(function(g) { _gymUpdateBolts(g); });
                return;
            }
            var cards = Array.from(grid.querySelectorAll(':scope > .gym-card'));
            var n = cards.length;
            cards.forEach(function(card, idx) {
                var bolt = card.querySelector('.gym-bolt-icon');
                if (!bolt) return;
                if (n <= 1) {
                    bolt.style.color = '#eab308'; // amarillo único
                } else {
                    var t = idx / (n - 1); // 0=primer (amarillo), 1=último (verde)
                    var r = Math.round(234 + (34 - 234) * t);
                    var g2 = Math.round(179 + (197 - 179) * t);
                    var b = Math.round(8 + (94 - 8) * t);
                    bolt.style.color = 'rgb(' + r + ',' + g2 + ',' + b + ')';
                }
            });
        }
        window._gymUpdateBolts = _gymUpdateBolts;

        function gymAbrirVisorImagen(src) {
            var overlay = document.createElement('div');
            overlay.id = '_gymImgVisor';
            overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;transition:opacity 0.2s;';
            overlay.innerHTML =
                '<button onclick="this.parentNode._closeVisor()" style="position:absolute;top:16px;right:16px;width:40px;height:40px;border-radius:50%;border:1.5px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.08);color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:1;"><span class="material-symbols-rounded" style="font-size:22px;">close</span></button>'
              + '<img src="' + src + '" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.8);transition:transform 0.2s;user-select:none;touch-action:none;">';
            overlay._closeVisor = function() {
                overlay.style.opacity = '0';
                setTimeout(function(){ overlay.remove(); }, 200);
            };
            overlay.addEventListener('click', function(e){ if (e.target === overlay) overlay._closeVisor(); });
            var touchStartY = 0;
            var img = overlay.querySelector('img');
            overlay.addEventListener('touchstart', function(e){ touchStartY = e.touches[0].clientY; }, { passive: true });
            overlay.addEventListener('touchmove', function(e){
                var dy = e.touches[0].clientY - touchStartY;
                if (dy > 0) img.style.transform = 'translateY(' + dy + 'px) scale(' + Math.max(0.85, 1 - dy/600) + ')';
            }, { passive: true });
            overlay.addEventListener('touchend', function(e){
                var dy = e.changedTouches[0].clientY - touchStartY;
                if (dy > 80) { overlay._closeVisor(); }
                else { img.style.transform = ''; }
            });
            document.body.appendChild(overlay);
        }
        function _initAllGymCards() {
            document.querySelectorAll('.gym-card').forEach(function(card) {
                if (typeof _gymAplicarModoCardioEnCard === 'function') _gymAplicarModoCardioEnCard(card);
                if (!card.dataset.dragInit) {
                    card.dataset.dragInit = '1';
                    card.removeAttribute('draggable');
                    _initGymCardDrag(card);
                }
                if (!card.dataset.swipeInit) {
                    _initGymSwipeCells(card); // también llama _initGymTimerBadge
                } else {
                    _initGymTimerBadge(card); // por si acaso ya tenía swipeInit
                }
                if (!card.dataset.cardioKmInputInit) {
                    var kmInp = card.querySelector('.gym-card-kg');
                    if (kmInp) {
                        kmInp.addEventListener('input', function() {
                            if (!_gymEsCardioCard(card)) return;
                            var ctx = (typeof _gymContextoActivo === 'function') ? _gymContextoActivo() : null;
                            if (!ctx || !ctx.esDia) return;
                            if (typeof _gymActualizarStatCardioKm === 'function') _gymActualizarStatCardioKm(ctx.fechaKey);
                            if (typeof gymGuardarSesionHoy === 'function') gymGuardarSesionHoy();
                        });
                    }
                    card.dataset.cardioKmInputInit = '1';
                }
                // Apply lock state based on check button data-completado
                var checkBtn = card.querySelector('.gym-check-btn');
                if (checkBtn && checkBtn.dataset.completado === '1' && typeof _gymSetCardLocked === 'function') {
                    _gymSetCardLocked(card, true);
                }
            });
            document.querySelectorAll('.gym-panel-grid').forEach(function(grid) {
                if (!grid._sortable) _initGymSortable(grid);
            });
            if (typeof initTooltips === 'function') initTooltips();
            if (typeof _gymUpdateBolts === 'function') _gymUpdateBolts();
        }
        document.addEventListener('DOMContentLoaded', function() {
            _gymInitFilterBar();
            _initAllGymCards();
            _gymAplicarFiltrosActivos();
            var p = document.getElementById('gym-panel-pecho');
            if (p && typeof _gymEmptyState === 'function') _gymEmptyState(p);
        });
        var _origCambiarVistaGym = typeof cambiarVistaGym === 'function' ? cambiarVistaGym : null;

        function cambiarVistaReforma(vista) {
            window._vistaReformaActiva = vista;
            var panelReformas = document.getElementById('seccion-reformas-panel');
            var panelMobiliario = document.getElementById('seccion-mobiliario-panel');
            var btnReforma = document.getElementById('tab-reforma-reforma');
            var btnMobiliario = document.getElementById('tab-reforma-mobiliario');

            if (panelReformas) panelReformas.style.display = vista === 'reforma' ? '' : 'none';
            if (panelMobiliario) panelMobiliario.style.display = vista === 'mobiliario' ? '' : 'none';

            var activeStyleReforma = { background: 'linear-gradient(135deg, rgba(154,52,18,0.8) 0%, rgba(194,65,12,0.7) 50%, rgba(234,88,12,0.8) 100%)', boxShadow: '0 0 20px rgba(249,115,22,0.5)', border: '1px solid rgba(249,115,22,0.4)', color: 'white' };
            var activeStyleMobiliario = { background: 'linear-gradient(135deg, rgba(30,58,138,0.8) 0%, rgba(29,78,216,0.7) 50%, rgba(37,99,235,0.8) 100%)', boxShadow: '0 0 20px rgba(59,130,246,0.5)', border: '1px solid rgba(59,130,246,0.3)', color: 'white' };
            var inactiveStyle = { background: 'transparent', boxShadow: 'none', border: '1px solid transparent', color: '#64748b' };

            [btnReforma, btnMobiliario].forEach(function(btn, i) {
                if (!btn) return;
                var isActive = (i === 0 && vista === 'reforma') || (i === 1 && vista === 'mobiliario');
                var s = isActive ? (i === 0 ? activeStyleReforma : activeStyleMobiliario) : inactiveStyle;
                btn.style.background = s.background;
                btn.style.boxShadow = s.boxShadow;
                btn.style.border = s.border;
                btn.style.color = s.color;
            });
        }
        function ordenarReformas(modo) {
            document.querySelectorAll('.filtro-reforma-btn').forEach(btn => {
                btn.style.borderColor = '#334155';
                btn.style.color = '#94a3b8';
            });
            const activeBtn = document.getElementById('filtro-' + modo);
            if (activeBtn) {
                activeBtn.style.borderColor = '#475569';
                activeBtn.style.color = 'white';
            }

            if (modo === 'ninguno') return; // Sin reordenar

            ['listaReformas', 'listaMobiliario'].forEach(listaId => {
                const lista = document.getElementById(listaId);
                if (!lista) return;
                const cards = Array.from(lista.querySelectorAll('.card-input-group'));
                if (cards.length < 2) return;

                cards.sort((a, b) => {
                    const va = parseMoneyInput(a.dataset.valor || "0") || parseMoneyInput(a.querySelector('.reforma-input')?.value || "0");
                    const vb = parseMoneyInput(b.dataset.valor || "0") || parseMoneyInput(b.querySelector('.reforma-input')?.value || "0");
                    return modo === 'mayor' ? vb - va : va - vb;
                });

                window._sortingCarrusel = true;
                cards.forEach(card => {
                    lista.appendChild(card);
                });
                window._sortingCarrusel = false;
                actualizarZindexCards(lista);
            });
        }

        var _filtroFavoritosActivo = false;

        function filtrarFavoritos() {
            _filtroFavoritosActivo = !_filtroFavoritosActivo;
            const btn = document.getElementById('filtro-favoritos');
            if (btn) {
                const icon = btn.querySelector('.material-symbols-rounded');
                if (_filtroFavoritosActivo) {
                    btn.style.setProperty('border-color', 'rgba(220,38,38,0.7)', 'important');
                    btn.style.setProperty('color', 'white', 'important');
                    btn.style.setProperty('background', 'linear-gradient(135deg,rgba(185,28,28,0.9) 0%,rgba(220,38,38,0.85) 50%,rgba(239,68,68,0.9) 100%)', 'important');
                    btn.style.boxShadow = '0 0 18px rgba(220,38,38,0.5)';
                    if (icon) { icon.style.fontVariationSettings = "'FILL' 1,'wght' 700,'GRAD' 0,'opsz' 24"; icon.style.setProperty('color', 'white', 'important'); }
                } else {
                    btn.style.removeProperty('border-color');
                    btn.style.removeProperty('color');
                    btn.style.removeProperty('background');
                    btn.style.boxShadow = '';
                    if (icon) { icon.style.fontVariationSettings = "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24"; icon.style.removeProperty('color'); }
                }
            }
            ['listaReformas', 'listaMobiliario'].forEach(listaId => {
                const lista = document.getElementById(listaId);
                if (!lista) return;
                lista.querySelectorAll('.reforma-preview-card').forEach(card => {
                    if (_filtroFavoritosActivo) {
                        card.style.display = card.dataset.liked === 'true' ? '' : 'none';
                    } else {
                        card.style.display = '';
                    }
                });
            });
        }

        function toggleLikeDesdeModal() {
            if (!_modalCard) return;
            const isLiked = _modalCard.dataset.liked === 'true';
            _modalCard.dataset.liked = (!isLiked).toString();
            const likeBtn = _modalCard.querySelector('.like-btn');
            const tipo = _modalCard.dataset.tipoReforma;
            const accentColor = '#dc2626';
            const icon = likeBtn?.querySelector('.material-symbols-rounded');
            const ghostHeart = _modalCard.querySelector('.card-ghost-heart');
            if (!isLiked) {
                if (icon) icon.style.fontVariationSettings = "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24";
                if (likeBtn) { likeBtn.style.color = 'white'; likeBtn.style.borderColor = 'rgba(255,255,255,0.5)'; likeBtn.style.background = 'rgba(255,255,255,0.15)'; likeBtn.classList.add('liked'); }
                if (ghostHeart) ghostHeart.style.display = 'flex';
            } else {
                if (icon) icon.style.fontVariationSettings = "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24";
                if (likeBtn) { likeBtn.style.color = ''; likeBtn.style.borderColor = ''; likeBtn.classList.remove('liked'); }
                if (ghostHeart) ghostHeart.style.display = 'none';
            }
            _actualizarCorazonModal(_modalCard);
            if (_filtroFavoritosActivo && isLiked) _modalCard.style.display = 'none';
            guardarDatos();
        }

        function _actualizarCorazonModal(card) {
            const heart = document.getElementById('modal-heart');
            if (!heart || !card) return;
            const isLiked = card.dataset.liked === 'true';
            heart.style.color = isLiked ? 'white' : '#475569';
            heart.style.background = 'transparent';
            heart.style.borderRadius = '0';
            heart.style.border = 'none';
            heart.style.fontVariationSettings = isLiked
                ? "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24"
                : "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24";
        }
        async function generarPDFReformas() {
            try {
                const { jsPDF } = window.jspdf;
                if (!jsPDF) { console.error('jsPDF no disponible'); return; }

                const doc = new jsPDF('p', 'mm', 'a4');
                const PAGE_W = 210, PAGE_H = 297;
                const ML = 14, MR = 14;
                const CW = PAGE_W - ML - MR;
                let y = 0;
                const fmt = n => {
                    const r = Math.round(n * 100) / 100;
                    return r.toLocaleString('es-ES', {
                        minimumFractionDigits: (r % 1 !== 0) ? 2 : 0,
                        maximumFractionDigits: (r % 1 !== 0) ? 2 : 0
                    });
                };

                const setupPage = () => {
                    doc.setFillColor(255, 255, 255);
                    doc.rect(0, 0, PAGE_W, PAGE_H, 'F');
                };

                const addNewPage = () => {
                    doc.addPage();
                    setupPage();
                    y = 16;
                };

                let cardsOnPage = 0;
                const MAX_CARDS_PER_PAGE = 3;
                const checkSpace = (needed, isCard) => {
                    const remaining = PAGE_H - 16 - y;
                    if (isCard && cardsOnPage >= MAX_CARDS_PER_PAGE) {
                        addNewPage();
                        cardsOnPage = 0;
                        return true;
                    }
                    if (remaining < needed) {
                        addNewPage();
                        if (isCard) cardsOnPage = 0;
                        return true;
                    }
                    return false;
                };
                const SCALE = 8;
                const srcToDataUrl = (src, sizeMM, cornerMM) => new Promise(resolve => {
                    const size = Math.round(sizeMM * SCALE);
                    const r    = Math.round((cornerMM !== undefined ? cornerMM : sizeMM / 7) * SCALE);
                    const img  = new Image();
                    img.onload = () => {
                        try {
                            const c = document.createElement('canvas');
                            c.width = size; c.height = size;
                            const ctx = c.getContext('2d');
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(0, 0, size, size);
                            ctx.beginPath();
                            ctx.moveTo(r, 0); ctx.arcTo(size, 0, size, size, r);
                            ctx.arcTo(size, size, 0, size, r);
                            ctx.arcTo(0, size, 0, 0, r);
                            ctx.arcTo(0, 0, size, 0, r);
                            ctx.closePath();
                            ctx.clip();
                            const asp = img.width / img.height;
                            let sw = img.width, sh = img.height, sx = 0, sy = 0;
                            if (asp > 1) { sw = img.height; sx = (img.width - sw) / 2; }
                            else if (asp < 1) { sh = img.width; sy = (img.height - sh) / 2; }
                            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, size, size);
                            resolve(c.toDataURL('image/png'));
                        } catch(e) { resolve(null); }
                    };
                    img.onerror = () => resolve(null);
                    img.crossOrigin = 'anonymous';
                    img.src = src;
                });
                const materialIconToDataUrl = (iconName, bgColor, iconColor, sizeMM, cornerMM) => new Promise(resolve => {
                    try {
                        const size = Math.round(sizeMM * SCALE);
                        const r    = Math.round((cornerMM !== undefined ? cornerMM : sizeMM / 4) * SCALE);
                        const c    = document.createElement('canvas');
                        c.width = size; c.height = size;
                        const ctx  = c.getContext('2d');
                        ctx.clearRect(0, 0, size, size);
                        ctx.beginPath();
                        ctx.moveTo(r, 0); ctx.arcTo(size, 0, size, size, r);
                        ctx.arcTo(size, size, 0, size, r);
                        ctx.arcTo(0, size, 0, 0, r);
                        ctx.arcTo(0, 0, size, 0, r);
                        ctx.closePath();
                        ctx.fillStyle = bgColor;
                        ctx.fill();
                        ctx.fillStyle = iconColor;
                        ctx.font = `${Math.round(size * 0.55)}px "Material Icons"`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(iconName, size / 2, size / 2);
                        resolve(c.toDataURL('image/png'));
                    } catch(e) { resolve(null); }
                });
                const hexToRgb = hex => {
                    const h = hex.replace('#','');
                    if (h.length === 3) {
                        return { r: parseInt(h[0]+h[0],16), g: parseInt(h[1]+h[1],16), b: parseInt(h[2]+h[2],16) };
                    }
                    return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) };
                };
                const cssColorToHex = (colorStr) => {
                    if (!colorStr) return null;
                    if (colorStr.startsWith('#')) return colorStr;
                    try {
                        const tmp = document.createElement('div');
                        tmp.style.color = colorStr;
                        document.body.appendChild(tmp);
                        const comp = window.getComputedStyle(tmp).color;
                        document.body.removeChild(tmp);
                        const m = comp.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                        if (m) return '#' + [m[1],m[2],m[3]].map(v=>parseInt(v).toString(16).padStart(2,'0')).join('');
                    } catch(e) {}
                    return null;
                };
                const getCardIconColors = (card, isPreview, accentFallback) => {
                    let iconColorHex = null;
                    let colorIconoRaw = card.dataset.colorIcono || '';
                    if (colorIconoRaw) {
                        iconColorHex = cssColorToHex(colorIconoRaw) || colorIconoRaw;
                    }
                    if (!iconColorHex || iconColorHex === '#') iconColorHex = accentFallback;
                    const rgb = hexToRgb(iconColorHex.startsWith('#') ? iconColorHex : accentFallback);
                    const bgColor = `rgba(${rgb.r},${rgb.g},${rgb.b},0.12)`;
                    return { iconColor: iconColorHex, bgColor };
                };
                const getCardThumb = (card, isPreview) => {
                    if (isPreview) {
                        if (card.dataset.iconoImagen && card.dataset.iconoImagen.startsWith('data:')) return { type: 'img', src: card.dataset.iconoImagen };
                        const th = card.querySelector('.card-thumbnail');
                        if (th && th.src && (th.src.startsWith('data:') || th.src.startsWith('blob:') || th.src.startsWith('http'))) return { type: 'img', src: th.src };
                        const placeholder = card.querySelector('.card-thumbnail-placeholder span');
                        if (placeholder && placeholder.textContent) return { type: 'icon', name: placeholder.textContent.trim() };
                        if (card.dataset.icono) return { type: 'icon', name: card.dataset.icono };
                        const imgs = JSON.parse(card.dataset.imagenes || '[]');
                        if (imgs.length > 0) return { type: 'img', src: imgs[0] };
                        return null;
                    } else {
                        const iconImg = card.querySelector('.icon-container img');
                        if (iconImg && iconImg.src && (iconImg.src.startsWith('data:') || iconImg.src.startsWith('blob:'))) return { type: 'img', src: iconImg.src };
                        const iconSpan = card.querySelector('.icon-container .material-symbols-rounded, .icon-container .material-symbols-rounded');
                        if (iconSpan) return { type: 'icon', name: iconSpan.textContent.trim() };
                        return null;
                    }
                };
                setupPage();
                y = 12;
                const headerH = 18;
                const headerY = y;
                doc.setFillColor(245, 246, 248);
                doc.roundedRect(ML, headerY, CW, headerH, 3, 3, 'F');
                doc.setDrawColor(218, 219, 224);
                doc.setLineWidth(0.22);
                doc.roundedRect(ML, headerY, CW, headerH, 3, 3, 'S');
                const hIconMM = 11;
                const hIconX  = ML + 4;
                const hIconY  = headerY + (headerH - hIconMM) / 2;
                const hIconDU = await materialIconToDataUrl('home', 'rgba(16,185,129,0.15)', '#10b981', hIconMM, hIconMM / 4);
                if (hIconDU) doc.addImage(hIconDU, 'PNG', hIconX, hIconY, hIconMM, hIconMM);

                const fecha = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
                const txtX  = hIconX + hIconMM + 4;
                const line1Y = headerY + headerH / 2 - 1.5;
                const line2Y = headerY + headerH / 2 + 4;

                doc.setFont(undefined, 'bold');
                doc.setFontSize(9);
                doc.setTextColor(18, 18, 18);
                doc.text('PRESUPUESTO PARA REFORMAS Y MOBILIARIO', txtX, line1Y);

                doc.setFont(undefined, 'normal');
                doc.setFontSize(7);
                doc.setTextColor(105, 107, 115);
                doc.text('VIVIENDA EN CARBAJOSA DE LA SAGRADA  ·  ' + fecha.toUpperCase(), txtX, line2Y);

                y = headerY + headerH + 5;
                const reformaCards    = Array.from(document.querySelectorAll('#listaReformas > div'));
                const mobiliarioCards = Array.from(document.querySelectorAll('#listaMobiliario > div'));

                if (reformaCards.length === 0 && mobiliarioCards.length === 0) {
                    doc.setTextColor(130,130,135);
                    doc.setFontSize(11);
                    doc.text('No hay elementos añadidos.', PAGE_W / 2, y + 20, { align: 'center' });
                    const _d=new Date(); doc.save('Presupuesto Reformas y Mobiliario '+String(_d.getDate()).padStart(2,'0')+'-'+String(_d.getMonth()+1).padStart(2,'0')+'-'+_d.getFullYear()+'.pdf');
                    return;
                }

                let totalRef = 0, totalMob = 0;
                reformaCards.forEach(c => { totalRef += parseMoneyInput(c.querySelector('.reforma-input')?.value || '0'); });
                mobiliarioCards.forEach(c => { totalMob += parseMoneyInput(c.querySelector('.reforma-input')?.value || '0'); });
                const renderSection = async (cards, tipo) => {
                    if (cards.length === 0) return;

                    const isReforma    = tipo === 'reforma';
                    const accentHex    = isReforma ? '#ea4d0f' : '#2563eb';
                    const accentBgHex  = isReforma ? 'rgba(234,77,15,0.12)' : 'rgba(37,99,235,0.12)';
                    const sectionTotal = isReforma ? totalRef : totalMob;
                    const sectionLabel = isReforma ? 'REFORMAS' : 'MOBILIARIO';
                    const sectionIcon  = isReforma ? 'construction' : 'weekend';
                    const remaining = PAGE_H - 16 - y;
                    if (remaining < 80) {
                        addNewPage();
                        cardsOnPage = 0;
                    }
                    const secIconMM = 11;
                    const secIconX  = ML + 2;
                    const secIconY  = y + 0.5;
                    const secIconDU = await materialIconToDataUrl(sectionIcon, accentBgHex, accentHex, secIconMM, secIconMM / 4);
                    if (secIconDU) doc.addImage(secIconDU, 'PNG', secIconX, secIconY, secIconMM, secIconMM);

                    const secTxtX = secIconX + secIconMM + 3.5;
                    const acRgb   = hexToRgb(accentHex);

                    doc.setFont(undefined, 'bold');
                    doc.setFontSize(11);
                    doc.setTextColor(18, 18, 18);
                    doc.text(sectionLabel, secTxtX, y + 6);

                    doc.setFont(undefined, 'normal');
                    doc.setFontSize(7);
                    doc.setTextColor(105, 107, 115);
                    doc.text(cards.length + ' elemento' + (cards.length !== 1 ? 's' : '') + '  ·  Total: ' + fmt(sectionTotal) + ' €', secTxtX, y + 11.5);

                    y += 18;
                    for (let i = 0; i < cards.length; i++) {
                        const card      = cards[i];
                        const isPreview = card.classList.contains('reforma-preview-card');

                        const titulo = isPreview ? (card.dataset.nombre || 'Sin nombre') : (card.querySelector('input[type="text"]')?.value || 'Sin nombre');
                        const valor  = isPreview ? parseMoneyInput(card.dataset.valor || '0') : parseMoneyInput(card.querySelector('.reforma-input')?.value || '0');
                        const url    = isPreview ? (card.dataset.url || '') : (card.querySelector('.reforma-url')?.value || '');
                        let notas    = isPreview ? (card.dataset.notas || '') : (card.querySelector('.reforma-notas')?.value || '');
                        if (notas) {
                            const tmp = document.createElement('div');
                            tmp.innerHTML = notas;
                            notas = (tmp.textContent || tmp.innerText || '').trim();
                        }

                        const thumbInfo = getCardThumb(card, isPreview);
                        const { iconColor, bgColor } = getCardIconColors(card, isPreview, accentHex);

                        let fotosArray = [];
                        if (isPreview) {
                            fotosArray = JSON.parse(card.dataset.imagenes || '[]');
                        } else {
                            const fg = card.querySelector('.fotos-grid-sortable');
                            if (fg) fotosArray = Array.from(fg.querySelectorAll('img')).map(im => im.src);
                        }
                        fotosArray = fotosArray.filter(s => s && (s.startsWith('data:image') || s.startsWith('blob:') || s.startsWith('http')));
                        const THUMB_MM = 14, PHOTO_MM = 20, PHOTO_GAP = 2.5, PER_ROW = 6;
                        const fotosDisplay = fotosArray.slice(0, PER_ROW);
                        doc.setFontSize(9.5);
                        const maxTitleW = CW - THUMB_MM - 45;
                        const titleLineCount = doc.splitTextToSize(titulo, maxTitleW).length;
                        doc.setFontSize(7);
                        const notasMaxW = CW - 14;
                        const notasLines = notas ? doc.splitTextToSize(notas, notasMaxW).slice(0, 3) : [];

                        const topH    = titleLineCount >= 2 ? 26 : 23;
                        const notasH  = notasLines.length > 0 ? (notasLines.length * 4.5 + 8) : 0;
                        const photosH = fotosDisplay.length > 0 ? (PHOTO_MM + 7) : 0;
                        const cardH   = topH + notasH + photosH + 3;

                        checkSpace(cardH + 5, true);
                        cardsOnPage++;
                        const CARD_R = 4;
                        doc.setFillColor(251, 252, 253);
                        doc.roundedRect(ML, y, CW, cardH, CARD_R, CARD_R, 'F');
                        doc.setDrawColor(220, 222, 228);
                        doc.setLineWidth(0.25);
                        doc.roundedRect(ML, y, CW, cardH, CARD_R, CARD_R, 'S');
                        const stripeW = 12, stripeH = Math.max(Math.ceil(cardH * SCALE), 8);
                        const stripeR = Math.round(CARD_R * SCALE);
                        const sc = document.createElement('canvas');
                        sc.width = stripeW * SCALE; sc.height = stripeH;
                        const sctx = sc.getContext('2d');
                        sctx.fillStyle = '#ffffff';
                        sctx.fillRect(0, 0, sc.width, sc.height);
                        const acRgbCard = hexToRgb(accentHex.startsWith('#') ? accentHex : '#ea4d0f');
                        sctx.fillStyle = `rgb(${acRgbCard.r},${acRgbCard.g},${acRgbCard.b})`;
                        sctx.beginPath();
                        sctx.moveTo(stripeR, 0);
                        sctx.lineTo(sc.width, 0);
                        sctx.lineTo(sc.width, sc.height);
                        sctx.lineTo(stripeR, sc.height);
                        sctx.arcTo(0, sc.height, 0, 0, stripeR);
                        sctx.arcTo(0, 0, sc.width, 0, stripeR);
                        sctx.closePath();
                        sctx.fill();
                        doc.addImage(sc.toDataURL('image/png'), 'PNG', ML, y, 3, cardH);
                        const tX = ML + 7, tY = y + 5;
                        let thumbDU = null;

                        if (thumbInfo) {
                            if (thumbInfo.type === 'img') {
                                thumbDU = await srcToDataUrl(thumbInfo.src, THUMB_MM, THUMB_MM / 5);
                            } else if (thumbInfo.type === 'icon') {
                                thumbDU = await materialIconToDataUrl(thumbInfo.name, bgColor, iconColor, THUMB_MM, THUMB_MM / 4);
                            }
                        }

                        if (thumbDU) {
                            doc.addImage(thumbDU, 'PNG', tX, tY, THUMB_MM, THUMB_MM);
                        } else {
                            doc.setFillColor(acRgb.r, acRgb.g, acRgb.b);
                            doc.roundedRect(tX, tY, THUMB_MM, THUMB_MM, 3, 3, 'F');
                        }
                        const textX = tX + THUMB_MM + 4.5;
                        doc.setFont(undefined, 'bold');
                        doc.setFontSize(9.5);
                        doc.setTextColor(18, 18, 18);
                        const titleLines = doc.splitTextToSize(titulo, maxTitleW);
                        const titleY = y + 10.5;
                        doc.text(titleLines[0], textX, titleY);
                        if (titleLines[1]) doc.text(titleLines[1], textX, titleY + 5);

                        if (url && url.trim()) {
                            const urlFinal = url.startsWith('http') ? url : 'https://' + url;
                            const tw = doc.getTextWidth(titleLines[0]);
                            doc.setDrawColor(acRgbCard.r, acRgbCard.g, acRgbCard.b);
                            doc.setLineWidth(0.25);
                            doc.line(textX, titleY + 0.7, textX + tw, titleY + 0.7);
                            doc.link(textX, titleY - 3.5, tw, 4.5, { url: urlFinal });
                        }
                        const tagBaseY = y + (titleLines[1] ? 19.5 : 16.5);
                        doc.setFont(undefined, 'bold');
                        doc.setFontSize(5.5);
                        const tagTxtW = doc.getTextWidth(sectionLabel);
                        const tagPad = 3, tagH2 = 5.5, tagW2 = tagTxtW + tagPad * 2;
                        const acRgbF = hexToRgb(accentHex);
                        doc.setFillColor(Math.round(acRgbF.r*0.13+255*0.87), Math.round(acRgbF.g*0.13+255*0.87), Math.round(acRgbF.b*0.13+255*0.87));
                        doc.roundedRect(textX, tagBaseY, tagW2, tagH2, 2.5, 2.5, 'F');
                        doc.setTextColor(acRgbF.r, acRgbF.g, acRgbF.b);
                        doc.text(sectionLabel, textX + tagW2/2, tagBaseY + 3.8, { align: 'center' });
                        doc.setFont(undefined, 'bold');
                        doc.setFontSize(12);
                        doc.setTextColor(acRgbF.r, acRgbF.g, acRgbF.b);
                        doc.text(fmt(valor) + ' €', ML + CW - 5, y + 11.5, { align: 'right' });
                        if (notasLines.length > 0) {
                            const nY = y + topH;
                            doc.setFillColor(242, 243, 246);
                            doc.roundedRect(ML + 6, nY, CW - 12, notasH - 2.5, 3, 3, 'F');
                            doc.setFont(undefined, 'normal');
                            doc.setFontSize(7);
                            doc.setTextColor(68, 70, 80);
                            for (let ni = 0; ni < notasLines.length; ni++) {
                                doc.text(notasLines[ni], ML + 9, nY + 5 + ni * 4.5);
                            }
                        }
                        if (fotosDisplay.length > 0) {
                            const photosStartY = y + topH + notasH;
                            let px = ML + 6;
                            for (let f = 0; f < fotosDisplay.length; f++) {
                                const py = photosStartY + 3.5;
                                try {
                                    const du = await srcToDataUrl(fotosDisplay[f], PHOTO_MM, 2.5);
                                    if (du) doc.addImage(du, 'PNG', px, py, PHOTO_MM, PHOTO_MM);
                                    else { doc.setFillColor(215,217,222); doc.roundedRect(px, py, PHOTO_MM, PHOTO_MM, 2.5, 2.5, 'F'); }
                                } catch(e) { doc.setFillColor(215,217,222); doc.roundedRect(px, py, PHOTO_MM, PHOTO_MM, 2.5, 2.5, 'F'); }
                                px += PHOTO_MM + PHOTO_GAP;
                            }
                        }

                        y += cardH + 4;
                    }
                };
                await renderSection(reformaCards, 'reforma');
                await renderSection(mobiliarioCards, 'mobiliario');
                const remaining = PAGE_H - 16 - y;
                if (remaining < 30) {
                    addNewPage();
                    cardsOnPage = 0;
                }
                y += 5;
                const totalGlobal = totalRef + totalMob;
                const totalBoxH   = 20;
                const totalBoxY   = y;

                doc.setFillColor(245, 246, 248);
                doc.roundedRect(ML, totalBoxY, CW, totalBoxH, 3, 3, 'F');
                doc.setDrawColor(218, 219, 224);
                doc.setLineWidth(0.22);
                doc.roundedRect(ML, totalBoxY, CW, totalBoxH, 3, 3, 'S');
                const euroIconMM = 12;
                const euroIconX  = ML + 4;
                const euroIconY  = totalBoxY + (totalBoxH - euroIconMM) / 2;
                const euroIconDU = await materialIconToDataUrl('euro', 'rgba(16,185,129,0.15)', '#10b981', euroIconMM, euroIconMM / 4);
                if (euroIconDU) doc.addImage(euroIconDU, 'PNG', euroIconX, euroIconY, euroIconMM, euroIconMM);

                const totalTxtX = euroIconX + euroIconMM + 4;
                const totalLine1Y = totalBoxY + totalBoxH / 2 - 3;
                const totalLine2Y = totalBoxY + totalBoxH / 2 + 4;

                doc.setFont(undefined, 'bold');
                doc.setFontSize(9);
                doc.setTextColor(18, 18, 18);
                doc.text('PRESUPUESTO TOTAL ESTIMADO', totalTxtX, totalLine1Y);

                doc.setFont(undefined, 'normal');
                doc.setFontSize(7);
                doc.setTextColor(105, 107, 115);
                doc.text('Reformas: ' + fmt(totalRef) + ' €   ·   Mobiliario: ' + fmt(totalMob) + ' €', totalTxtX, totalLine2Y);

                doc.setFont(undefined, 'bold');
                doc.setFontSize(15);
                doc.setTextColor(18, 18, 18);
                doc.text(fmt(totalGlobal) + ' €', ML + CW - 5, totalBoxY + totalBoxH / 2 + 2.5, { align: 'right' });
                (function(){ const _d=new Date(); const _dd=String(_d.getDate()).padStart(2,'0'); const _mm=String(_d.getMonth()+1).padStart(2,'0'); const _aa=_d.getFullYear(); doc.save('Presupuesto Reformas y Mobiliario '+_dd+'-'+_mm+'-'+_aa+'.pdf'); })();

            } catch (error) {
            }
        }
        async function exportarDatos() {
            try {
                const datos = _serializarDatos();
                if (!datos) return;
                await guardarEnDB('seniorPlazAppData', datos);

                const datosFormateados = JSON.stringify(datos, null, 2);
                const blob = new Blob([datosFormateados], { type: 'application/json;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const ahora = new Date();
                const dia = String(ahora.getDate()).padStart(2, '0');
                const mes = String(ahora.getMonth() + 1).padStart(2, '0');
                const año = ahora.getFullYear();
                const fecha = `${dia}-${mes}-${año}`;
                a.download = `Copia de seguridad (${fecha}).json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (error) {
            }
        }

        function _fusionarDatosBackup(copia, actual) {
            var base = copia && typeof copia === 'object' ? copia : {};
            var actuales = actual && typeof actual === 'object' ? actual : {};
            var fusionado = Object.assign({}, base);
            Object.keys(actuales).forEach(function(k) {
                if (Array.isArray(actuales[k]) && Array.isArray(base[k])) {
                    fusionado[k] = base[k].concat(actuales[k]);
                    return;
                }
                if (
                    actuales[k] && typeof actuales[k] === 'object' && !Array.isArray(actuales[k]) &&
                    base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])
                ) {
                    fusionado[k] = Object.assign({}, base[k], actuales[k]);
                    return;
                }
                if (typeof fusionado[k] === 'undefined' || fusionado[k] === null || fusionado[k] === '') {
                    fusionado[k] = actuales[k];
                }
            });
            return fusionado;
        }
        window._fusionarDatosBackup = _fusionarDatosBackup;

        function _preguntarModoImportacionBackup(nombreArchivo) {
            return new Promise(function(resolve) {
                var prev = document.getElementById('_backupImportModeModal');
                if (prev) prev.remove();
                var modal = document.createElement('div');
                modal.id = '_backupImportModeModal';
                modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:30000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);padding:20px;';
                modal.innerHTML = `
                    <div style="background:linear-gradient(135deg,#0f172a,#1e293b);border:1px solid rgba(59,130,246,0.3);border-radius:20px;padding:24px;max-width:360px;width:100%;box-shadow:0 24px 64px rgba(0,0,0,0.6);">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                            <span class="material-symbols-rounded" style="color:#60a5fa;font-size:24px;">upload_file</span>
                            <span style="color:white;font-size:16px;font-weight:700;">Importar copia</span>
                        </div>
                        <p style="color:#94a3b8;font-size:13px;margin:0 0 8px;">${nombreArchivo ? 'Archivo: ' + nombreArchivo : '¿Cómo quieres importar esta copia?'}</p>
                        <p style="color:#94a3b8;font-size:13px;margin:0 0 20px;">Elige si quieres reemplazar todo o fusionarlo con tus datos actuales.</p>
                        <div style="display:flex;flex-direction:column;gap:8px;">
                            <button id="_backupImportReplace" style="background:linear-gradient(135deg,rgba(239,68,68,0.3),rgba(220,38,38,0.2));border:1px solid rgba(239,68,68,0.4);border-radius:12px;color:white;padding:12px 16px;cursor:pointer;text-align:left;display:flex;align-items:center;gap:10px;">
                                <span class="material-symbols-rounded" style="color:#f87171;font-size:20px;">swap_horiz</span>
                                <div><div style="font-size:14px;font-weight:600;">Reemplazar datos</div><div style="font-size:11px;color:#94a3b8;margin-top:2px;">Borra lo actual y carga la copia</div></div>
                            </button>
                            <button id="_backupImportMerge" style="background:linear-gradient(135deg,rgba(16,185,129,0.3),rgba(5,150,105,0.2));border:1px solid rgba(16,185,129,0.4);border-radius:12px;color:white;padding:12px 16px;cursor:pointer;text-align:left;display:flex;align-items:center;gap:10px;">
                                <span class="material-symbols-rounded" style="color:#10b981;font-size:20px;">merge</span>
                                <div><div style="font-size:14px;font-weight:600;">Fusionar datos</div><div style="font-size:11px;color:#94a3b8;margin-top:2px;">Combina la copia con lo que ya tienes</div></div>
                            </button>
                            <button id="_backupImportCancel" style="background:none;border:1px solid rgba(255,255,255,0.1);border-radius:12px;color:#64748b;padding:10px 16px;cursor:pointer;font-size:13px;">Cancelar</button>
                        </div>
                    </div>`;
                document.body.appendChild(modal);
                function cerrar(valor) {
                    if (modal.parentNode) modal.remove();
                    resolve(valor);
                }
                modal.querySelector('#_backupImportReplace').onclick = function() { cerrar('reemplazar'); };
                modal.querySelector('#_backupImportMerge').onclick = function() { cerrar('fusionar'); };
                modal.querySelector('#_backupImportCancel').onclick = function() { cerrar(null); };
                modal.addEventListener('click', function(ev) { if (ev.target === modal) cerrar(null); });
            });
        }

        function importarDatos(input) {
            const file = input.files[0];
            if (!file) return;
            const btn = document.querySelector('button[title="Importar datos"]');
            const iconSpan = btn?.querySelector('span.material-symbols-rounded');
            const iconOrig = iconSpan?.textContent;
            if (iconSpan) { iconSpan.textContent = 'sync'; iconSpan.style.animation = 'spin 1s linear infinite'; }
            const restaurarIcono = (delay) => {
                setTimeout(() => {
                    if (iconSpan) {
                        iconSpan.textContent = iconOrig;
                        iconSpan.style.animation = '';
                        iconSpan.style.color = '';
                    }
                }, delay || 0);
            };

            const mostrarError = (msg) => {
                if (iconSpan) { iconSpan.textContent = 'error'; iconSpan.style.animation = ''; iconSpan.style.color = '#ef4444'; }
                alert('Error al importar: ' + msg);
                restaurarIcono(3000);
            };

            const mostrarOk = () => {
                if (iconSpan) { iconSpan.textContent = 'check_circle'; iconSpan.style.animation = ''; iconSpan.style.color = '#10b981'; }
                restaurarIcono(2000);
            };

            const reader = new FileReader();

            reader.onload = async function(e) {
                try {
                    const contenido = e.target.result;
                    if (!contenido || contenido.trim() === '') {
                        mostrarError('El archivo está vacío');
                        input.value = '';
                        return;
                    }

                    let datos;
                    try {
                        datos = JSON.parse(contenido);
                    } catch(parseErr) {
                        mostrarError('El archivo no es un JSON válido');
                        input.value = '';
                        return;
                    }

                    if (typeof datos !== 'object' || datos === null) {
                        mostrarError('Formato de archivo no reconocido');
                        input.value = '';
                        return;
                    }

                    let datosFinales = datos;
                    if (!window._restaurandoCopiaInterna) {
                        const accionImportacion = await _preguntarModoImportacionBackup(file.name);
                        if (!accionImportacion) {
                            input.value = '';
                            restaurarIcono();
                            return;
                        }
                        if (accionImportacion === 'fusionar') {
                            datosFinales = _fusionarDatosBackup(datos, (typeof _serializarDatos === 'function' ? (_serializarDatos() || {}) : {}));
                        }
                    }

                    const guardarYCargar = async () => {
                        try {
                            await guardarEnDB('seniorPlazAppData', datosFinales);
                        } catch(e) {
                        }
                        if (!window._restaurandoCopiaInterna) {
                            try {
                                const ts = Date.now();
                                const d = new Date(ts);
                                const fecha = d.toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' });
                                const hora  = d.toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' });
                                const nombreArchivo = file.name.replace(/\.json$/i, '').replace(/copia de seguridad/i, '').replace(/[()]/g, '').trim();
                                const etiqueta = (nombreArchivo || `Importado ${fecha}`) + ' · ' + hora;
                                await guardarEnDB('backup_snap_' + ts, { ts, etiqueta, datos: datosFinales });
                            } catch(e) {
                            }
                        }
                        window._restaurandoCopiaInterna = false;

                        input.value = '';
                        if (typeof cargarDatos === 'function') {
                            await cargarDatos();
                            if (typeof calculate === 'function') calculate();
                            mostrarOk();
                        }
                        if (typeof window._limpiarHistorialUndo === 'function') window._limpiarHistorialUndo();
                    };
                    guardarYCargar().catch(err => {
                        mostrarError('Error al importar: ' + err.message);
                    });

                } catch (error) {
                    mostrarError(error.message || 'Error desconocido');
                    input.value = '';
                }
            };

            reader.onerror = function(e) {
                mostrarError('No se pudo leer el archivo');
                input.value = '';
            };

            reader.readAsText(file, 'UTF-8');
        }
        document.addEventListener('input', guardarDatos);
        document.addEventListener('change', guardarDatos);

        function calculate() {
            let capTotal = 0;
            let totalCuentas = 0;
            let totalInversiones = 0;
            document.querySelectorAll('#listaCuentas .cuenta-saldo-input, #listaCuentas .money-input').forEach(input => {
                const card = input.closest('.card-input-group');
                const valor = parseMoneyInput(input.value);
                if (!card.classList.contains('disabled')) {
                    totalCuentas += valor;
                    capTotal += valor;
                }
            });
            document.querySelectorAll('#listaInversiones .cuenta-saldo-input, #listaInversiones .money-input').forEach(input => {
                const card = input.closest('.card-input-group');
                const valor = parseMoneyInput(input.value);
                if (!card.classList.contains('disabled')) {
                    totalInversiones += valor;
                    capTotal += valor;
                }
            });
            document.getElementById('totalCuentas').innerText = fmt(totalCuentas) + ' €';
            document.getElementById('totalInversiones').innerText = fmt(totalInversiones) + ' €';
            const totalCuentasMobile = document.getElementById('totalCuentasMobile');
            const totalInversionesMobile = document.getElementById('totalInversionesMobile');
            if (totalCuentasMobile) totalCuentasMobile.innerText = fmt(totalCuentas) + ' €';
            if (totalInversionesMobile) totalInversionesMobile.innerText = fmt(totalInversiones) + ' €';
            const donNeto = ( getDonValue('donMama') + getDonValue('donPapa') ) * 0.99;
            document.getElementById('donNeto').innerText = fmt(donNeto);
            
            const capitalDisponible = capTotal + donNeto;
            document.getElementById('finalCapital').innerText = fmt(capitalDisponible);
            let sumRef = 0;
            document.querySelectorAll('.reforma-preview-card').forEach(card => sumRef += parseMoneyInput(card.dataset.valor || "0"));
            document.querySelectorAll('#listaReformas .reforma-input, #listaMobiliario .reforma-input').forEach(input => {
                if (!input.closest('.reforma-preview-card')) sumRef += parseMoneyInput(input.value);
            });
            document.getElementById('totalReformas').innerText = fmt(sumRef);
            const precio = getDonValue('precioCasa');
            const pEntrada = parseInt(document.getElementById('percEntrada').value);
            const entrada = (precio * pEntrada) / 100;
            const percITP = parseFloat(document.getElementById('percITP').value) || 0;
            const itp = (precio * percITP) / 100;
            const notaria = parseMoneyInput(document.getElementById('gastoNotaria').value || "0");
            
            const gastoInicialTotal = entrada + itp + notaria + sumRef;

            document.getElementById('labelPercEntrada').innerText = pEntrada + '%';
            document.getElementById('valEntrada').innerText = fmt(entrada);
            document.getElementById('valITP').innerText = fmt(itp);
            document.getElementById('finalGastoIni').innerText = fmt(gastoInicialTotal);
            document.getElementById('valEntrada2').innerText = fmt(entrada);
            document.getElementById('percEntrada2').innerText = pEntrada; // Actualizar porcentaje entrada
            document.getElementById('valITP2').innerText = fmt(itp);
            document.getElementById('percITP2').innerText = percITP; // Actualizar porcentaje ITP
            document.getElementById('gastoNotaria2').innerText = fmt(notaria);
            document.getElementById('totalReformas2').innerText = fmt(sumRef);
            const checkboxSeleccionado = document.querySelector('.simulacion-check:checked');
            
            let cuota = 0;
            let plazo = 30;
            let interesFinal = 0;
            
            if (checkboxSeleccionado) {
                const card = checkboxSeleccionado.closest('.simulacion-card');
                cuota = parseMoneyInput(card.querySelector('.cuota-input').value);
                plazo = parseInt(card.querySelector('.plazo-input').value) || 30;
                const tin = parseMoneyInput(card.querySelector('.tin-input').value);
                interesFinal = tin;
            } else {
                plazo = 30;
                interesFinal = 2.8; // Valor por defecto
                const i = (interesFinal / 100) / 12;
                const n = Math.max(1, plazo * 12);
                const prestamo = Math.max(0, precio - entrada);
                
                if (i > 0) {
                    cuota = (prestamo * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
                } else {
                    cuota = prestamo / n;
                }
            }

            const prestamo = Math.max(0, precio - entrada);
            const n = plazo * 12;
            const totalIngresosMes = window.totalIngresosMes || 1583.80;
            const esfuerzo = (cuota / totalIngresosMes) * 100;
            let interesesTotales = 0;
            if (checkboxSeleccionado && interesFinal > 0) {
                const tin = interesFinal;
                const tasaMensual = (tin / 100) / 12;
                let capitalPendiente = prestamo;
                for (let mes = 1; mes <= n; mes++) {
                    const interesMes = capitalPendiente * tasaMensual;
                    const amortizacionMes = cuota - interesMes;
                    interesesTotales += interesMes;
                    capitalPendiente -= amortizacionMes;
                    if (capitalPendiente < 0.01) break;
                }
            } else {
                interesesTotales = (cuota * n) - prestamo;
            }

            document.getElementById('finalCuota').innerText = fmt(cuota);
            const esfuerzoRnd = Math.round(esfuerzo * 10) / 10;
            document.getElementById('finalEsfuerzo').innerText = (esfuerzoRnd % 1 === 0 ? esfuerzoRnd.toFixed(0) : esfuerzoRnd.toFixed(1).replace('.', ',')) + '%';
            document.getElementById('finalPrestamo').innerText = fmt(prestamo);
            document.getElementById('finalIntereses').innerText = fmt(interesesTotales);
            const dineroRestante = capitalDisponible - gastoInicialTotal;
            document.getElementById('finalCapital2').innerText = fmt(capitalDisponible);
            document.getElementById('totalDisponible').innerText = fmt(capitalDisponible);
            document.getElementById('dineroRestante').innerText = fmt(Math.max(0, dineroRestante));
            
            const remanenteColor = document.getElementById('remanenteColor');
            const remanenteMsg = document.getElementById('remanenteMsg');
            const remanenteCard = remanenteColor.closest('.p-6.rounded-3xl');
            const baseStyle = "font-size:clamp(1.4rem,3vw,2.2rem);line-height:1.2;letter-spacing:-0.02em;";
            
            if (dineroRestante >= 5000) {
                remanenteColor.className = 'font-mono font-black';
                remanenteColor.style.cssText = baseStyle + 'color:#34d399;text-shadow:0 0 15px rgba(52,211,153,0.4);';
                remanenteColor.closest('[style*="border"]').style.borderColor = '#10b981';
                remanenteColor.closest('[style*="border"]').style.boxShadow = '0 0 20px rgba(16,185,129,0.3)';
                if (remanenteCard) { remanenteCard.style.background = 'linear-gradient(135deg, rgba(16,185,129,0.07), rgba(59,130,246,0.05))'; remanenteCard.style.borderColor = 'rgba(16,185,129,0.3)'; }
                if (remanenteMsg) { remanenteMsg.textContent = 'Excelente colchón de seguridad'; }
            } else if (dineroRestante >= 2000) {
                remanenteColor.className = 'font-mono font-black';
                remanenteColor.style.cssText = baseStyle + 'color:#60a5fa;text-shadow:0 0 15px rgba(96,165,250,0.4);';
                remanenteColor.closest('[style*="border"]').style.borderColor = '#3b82f6';
                remanenteColor.closest('[style*="border"]').style.boxShadow = '0 0 20px rgba(59,130,246,0.3)';
                if (remanenteCard) { remanenteCard.style.background = 'linear-gradient(135deg, rgba(59,130,246,0.07), rgba(99,102,241,0.05))'; remanenteCard.style.borderColor = 'rgba(59,130,246,0.3)'; }
                if (remanenteMsg) { remanenteMsg.textContent = 'Fondo de emergencia adecuado'; }
            } else if (dineroRestante >= 0) {
                remanenteColor.className = 'font-mono font-black';
                remanenteColor.style.cssText = baseStyle + 'color:#fb923c;text-shadow:0 0 15px rgba(251,146,60,0.4);';
                remanenteColor.closest('[style*="border"]').style.borderColor = '#f97316';
                remanenteColor.closest('[style*="border"]').style.boxShadow = '0 0 20px rgba(249,115,22,0.3)';
                if (remanenteCard) { remanenteCard.style.background = 'linear-gradient(135deg, rgba(249,115,22,0.07), rgba(234,179,8,0.05))'; remanenteCard.style.borderColor = 'rgba(249,115,22,0.3)'; }
                if (remanenteMsg) { remanenteMsg.textContent = 'Fondo de emergencia ajustado'; }
            } else {
                remanenteColor.className = 'font-mono font-black';
                remanenteColor.style.cssText = baseStyle + 'color:#f87171;text-shadow:0 0 15px rgba(248,113,113,0.4);';
                remanenteColor.closest('[style*="border"]').style.borderColor = '#ef4444';
                remanenteColor.closest('[style*="border"]').style.boxShadow = '0 0 20px rgba(239,68,68,0.3)';
                if (remanenteCard) { remanenteCard.style.background = 'linear-gradient(135deg, rgba(239,68,68,0.07), rgba(225,29,72,0.05))'; remanenteCard.style.borderColor = 'rgba(239,68,68,0.3)'; }
                if (remanenteMsg) { remanenteMsg.textContent = 'Necesitas más capital'; }
            }
            const viab = gastoInicialTotal > 0 ? (capitalDisponible / gastoInicialTotal) * 100 : 100;
            document.getElementById('finalViab').innerText = Math.floor(viab) + '%';
            
            const card = document.getElementById('cardViabilidad');
            const msg = document.getElementById('viabMsg');
            const animacion = document.getElementById('viabilidadAnimacion');
            const remanenteBox = remanenteColor.closest('.total-box-animated');

            if (viab >= 100) {
                card.style.backgroundColor = "rgba(16, 185, 129, 0.5)";
                msg.innerText = "¡Operación Factible!";
                if (animacion) animacion.style.opacity = '0.6';
                if (remanenteBox) { remanenteBox.classList.remove('red-variant'); remanenteBox.classList.add('green-variant'); }
            } else if (viab >= 80) {
                card.style.backgroundColor = "rgba(245, 158, 11, 0.85)";
                msg.innerText = "Casi lo tienes (Ahorra un poco más)";
                if (animacion) animacion.style.opacity = '0';
                if (remanenteBox) { remanenteBox.classList.remove('red-variant'); remanenteBox.classList.add('green-variant'); }
            } else {
                card.style.backgroundColor = "rgba(225, 29, 72, 0.85)";
                msg.innerText = "Falta Capital Inicial";
                if (animacion) animacion.style.opacity = '0';
                if (remanenteBox) { remanenteBox.classList.remove('green-variant'); remanenteBox.classList.add('red-variant'); }
            }
        }

        function migrarDropdownsCuentas() {
            ['listaCuentas','listaInversiones'].forEach(listaId => {
                document.querySelectorAll('#' + listaId + ' .card-input-group').forEach(card => {
                    const dropdown = card.querySelector('.card-menu-dropdown');
                    if (!dropdown) return;
                    if (dropdown.querySelector('.cuenta-check-icon')) return; // ya tiene el botón
                    const isDisabled = card.classList.contains('disabled');
                    const btn = document.createElement('button');
                    btn.onclick = function() { toggleCuentaCheck(this); };
                    btn.innerHTML = '<span class="material-symbols-rounded cuenta-check-icon" data-checked="' + (isDisabled ? 'false' : 'true') + '" style="color:' + (isDisabled ? '#94a3b8' : '#10b981') + '">check_circle</span>' + (isDisabled ? 'Activar' : 'Desactivar');
                    dropdown.insertBefore(btn, dropdown.firstChild);
                });
            });
        }

        window.onload = async function() {
            const main = document.querySelector('main');
            const fecha = new Date().toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
            });
            main.setAttribute('data-fecha', fecha);
            actualizarIndicadorAlmacenamiento();
            let hayDatos = false;
            try { if (dbReadyPromise) await dbReadyPromise; } catch(e) {}
            try {
                const datosDB = await cargarDesdeDB('seniorPlazAppData');
                hayDatos = !!datosDB;
            } catch(e) {}
            
            if (hayDatos) {
                setTimeout(migrarDropdownsCuentas, 500);
            } else {
                addRow('listaCuentas', 'Trade Republic (4% TAE)', 21000, 'text-emerald-400', 'account_balance');
                addRow('listaCuentas', 'BBVA Nómina', 520, 'text-emerald-400', 'account_balance');
                addRow('listaCuentas', 'Efectivo / Otros', 133, 'text-emerald-400', 'account_balance');
                addRow('listaInversiones', 'ETF iShares S&P 500', 8000, 'text-blue-400', 'show_chart');
                addRow('listaInversiones', 'Bitcoin / Crypto', 9000, 'text-blue-400', 'currency_bitcoin', false);
                addIngreso('Nómina PANELAIS', 1975.79);
                addGasto('Alquiler / Vivienda', 600);
                addGasto('Supermercado y Comida', 300);
                addGasto('Transporte', 100);
                addGasto('Seguros', 80);
                addGasto('Telefonía e Internet', 50);
                addGasto('Ocio y Entretenimiento', 150);
                
                calculate();
            }
        };
        function abrirCatastro() {
            const refCatastral = document.getElementById('refCatastral').value.trim();
            
            if (!refCatastral) {
                return;
            }
            const refLimpia = refCatastral.replace(/[\s-]/g, '');
            const urlCatastro = `https://www1.sedecatastro.gob.es/Cartografia/mapa.aspx?refcat=${refLimpia}`;
            window.open(urlCatastro, '_blank');
        }

        function subirFotoVivienda(input) {
            const file = input.files[0];
            if (!file) return;
            
            subirACloudinary(file).then(url => {
                document.getElementById('imagenVivienda').src = url;
                document.getElementById('previewFotoVivienda').style.display = 'block';
                guardarDatos();
            }).catch(() => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('imagenVivienda').src = e.target.result;
                    document.getElementById('previewFotoVivienda').style.display = 'block';
                    guardarDatos();
                };
                reader.readAsDataURL(file);
            });
        }

        function eliminarFotoVivienda() {
            document.getElementById('imagenVivienda').src = '';
            document.getElementById('previewFotoVivienda').style.display = 'none';
            guardarDatos();
        }
        
        function addSimulacion(banco = '', tin = 0, tae = 0, cuota = 0, bonos = {}, seleccionada = false, icono = '', iconoImagen = '', colorFondo = '', pdfData = '') {
            const container = document.getElementById('listaSimulaciones');
            if (typeof _undoPushInmediato === 'function' && !_cargando) _undoPushInmediato();
            const div = document.createElement('div');
            div.className = "simulacion-card bg-gradient-to-br from-purple-500/5 to-indigo-500/5 p-6 rounded-2xl border-2 border-purple-500/30 animate-in slide-in-from-top-4 duration-500";
            const colorBanco = {
                'santander': '#EC0000',
                'bbva': '#004481',
                'caixabank': '#0077C8',
                'sabadell': '#0079C1',
                'bankinter': '#FF6600',
                'ing': '#FF6200',
                'unicaja': '#0098CE',
                'abanca': '#5CB615',
                'kutxabank': '#00A650',
                'ibercaja': '#004F9F',
                'banco popular': '#003D79',
                'openbank': '#00A859'
            };
            
            const bancoLower = banco.toLowerCase();
            const color = colorFondo || colorBanco[bancoLower] || '#a855f7';
            let contenidoIcono = '';
            if (iconoImagen) {
                contenidoIcono = `<img src="${iconoImagen}" class="w-full h-full object-cover rounded-xl">`;
            } else if (icono) {
                contenidoIcono = `<span class="material-symbols-rounded text-white" style="font-size: 28px;">${icono}</span>`;
            } else {
                contenidoIcono = `<span class="text-white font-black text-xl">${banco ? banco.charAt(0).toUpperCase() : '?'}</span>`;
            }
            
            div.innerHTML = `
                <!-- Header con nombre banco, checkbox y botón borrar -->
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <!-- Icono de drag (6 puntos) -->
                        <div class="drag-handle-banco cursor-grab p-2 -ml-2 text-slate-600 hover:text-slate-400 transition-colors">
                            <span class="material-symbols-rounded">drag_indicator</span>
                        </div>
                        <div class="icon-container-banco w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl cursor-pointer hover:opacity-80 transition-all relative group" data-tipo="${iconoImagen ? 'imagen' : (icono ? 'icono' : 'letra')}" style="background: ${color};">
                            ${contenidoIcono}
                            <div class="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span class="material-symbols-rounded text-white text-xs">edit</span>
                            </div>
                        </div>
                        <input type="text" value="${banco}" placeholder="Nombre del Banco" oninput="updateSimulacion(this); guardarDatos();" class="banco-nombre font-black text-white text-base bg-transparent border-b-2 border-transparent hover:border-purple-500/50 focus:border-purple-500 transition-all" style="max-width: 120px;">
                    </div>
                    <div class="btn-menu-card-wrapper"><button class="btn-menu-card" onclick="toggleCardMenu(this)"><span class="material-symbols-rounded">more_vert</span></button><div class="card-menu-dropdown"><button onclick="toggleSimulacionCheck(this)"><span class="material-symbols-rounded simulacion-check-icon" data-checked="${seleccionada ? 'true' : 'false'}" style="color:${seleccionada ? '#10b981' : '#94a3b8'}">check_circle</span>${seleccionada ? 'Desactivar' : 'Activar'}</button><button onclick="archivarCard(this)"><span class="material-symbols-rounded">archive</span>Archivar</button><button class="danger" onclick="eliminarSimulacion(this)"><span class="material-symbols-rounded">delete</span>Eliminar</button></div></div>
                </div>

                <!-- Resto del contenido -->
                <div class="space-y-4">

                    <!-- Etiqueta "SELECCIONADA" -->
                    <div class="etiqueta-seleccionada bg-emerald-500/20 border border-emerald-500/50 px-3 py-1.5 rounded-lg flex items-center gap-2" style="display: ${seleccionada ? 'flex' : 'none'};">
                        <span class="material-symbols-rounded text-emerald-400 text-sm">check_circle</span>
                        <span class="text-emerald-400 text-xs font-bold uppercase tracking-wider">Aplicada a cálculos</span>
                    </div>

                    <!-- Datos Principales -->
                    <div class="grid grid-cols-3 gap-3">
                        <div class="bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                            <label class="text-[9px] text-slate-500 font-bold uppercase block mb-1">TIN %</label>
                            <input type="number" step="0.01" value="${tin}" oninput="updateSimulacion(this); guardarDatos();" class="tin-input font-mono text-indigo-400 font-bold text-center w-full bg-transparent text-lg">
                        </div>
                        <div class="bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                            <label class="text-[9px] text-slate-500 font-bold uppercase block mb-1">TAE %</label>
                            <input type="number" step="0.01" value="${tae}" oninput="updateSimulacion(this); guardarDatos();" class="tae-input font-mono text-purple-400 font-bold text-center w-full bg-transparent text-lg">
                        </div>
                        <div class="bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                            <label class="text-[9px] text-slate-500 font-bold uppercase block mb-1">Plazo (años)</label>
                            <input type="number" value="30" oninput="updateSimulacion(this); guardarDatos();" class="plazo-input font-mono text-blue-400 font-bold text-center w-full bg-transparent text-lg">
                        </div>
                    </div>

                    <!-- Cuota Mensual -->
                    <div class="bg-gradient-to-r from-emerald-500/10 to-green-500/10 p-4 rounded-xl border-2 border-emerald-500/40">
                        <label class="text-[9px] text-emerald-400 font-bold uppercase block mb-2">Cuota Mensual</label>
                        <div class="flex items-center justify-center gap-2">
                            <input type="number" step="0.01" value="${cuota}" oninput="updateSimulacion(this); guardarDatos();" class="cuota-input font-mono text-white font-black text-center w-full bg-transparent text-2xl">
                            <span class="text-white font-bold text-xl">€/mes</span>
                        </div>
                    </div>

                    <!-- Bonificaciones -->
                    <div class="space-y-2">
                        <label class="text-[9px] text-purple-400 font-bold uppercase block">Bonificaciones</label>
                        <div class="space-y-1.5">
                            <label class="flex items-center gap-2 cursor-pointer p-2 hover:bg-purple-500/5 rounded-lg transition-all">
                                <input type="checkbox" ${bonos.nomina ? 'checked' : ''} onchange="updateSimulacion(this); guardarDatos();" class="bono-nomina custom-check">
                                <span class="text-xs text-slate-300">Domiciliar Nómina</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer p-2 hover:bg-purple-500/5 rounded-lg transition-all">
                                <input type="checkbox" ${bonos.vida ? 'checked' : ''} onchange="updateSimulacion(this); guardarDatos();" class="bono-vida custom-check">
                                <span class="text-xs text-slate-300">Seguro de Vida</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer p-2 hover:bg-purple-500/5 rounded-lg transition-all">
                                <input type="checkbox" ${bonos.hogar ? 'checked' : ''} onchange="updateSimulacion(this); guardarDatos();" class="bono-hogar custom-check">
                                <span class="text-xs text-slate-300">Seguro de Hogar</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer p-2 hover:bg-purple-500/5 rounded-lg transition-all">
                                <input type="checkbox" ${bonos.recibos ? 'checked' : ''} onchange="updateSimulacion(this); guardarDatos();" class="bono-recibos custom-check">
                                <span class="text-xs text-slate-300">Domiciliar Recibos</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer p-2 hover:bg-purple-500/5 rounded-lg transition-all">
                                <input type="checkbox" ${bonos.tarjeta ? 'checked' : ''} onchange="updateSimulacion(this); guardarDatos();" class="bono-tarjeta custom-check">
                                <span class="text-xs text-slate-300">Tarjeta de Crédito</span>
                            </label>
                        </div>
                    </div>

                    <!-- Notas -->
                    <div>
                        <label class="text-[9px] text-slate-500 font-bold uppercase block mb-2">Notas</label>
                        <textarea placeholder="Comisiones, vinculaciones, observaciones..." onchange="guardarDatos();" class="notas-simulacion w-full bg-slate-900/50 text-white text-xs p-3 rounded-lg border border-slate-700 focus:border-purple-500 transition-all resize-none" rows="2">${bonos.notas || ''}</textarea>
                    </div>

                    <!-- PDF del Banco -->
                    <div class="pdf-banco-container">
                        <label class="text-[9px] text-slate-500 font-bold uppercase block mb-2">Documento del Banco</label>
                        <div class="bg-slate-900/50 p-3 rounded-xl border border-slate-700 flex flex-col gap-2">
                            <div class="pdf-lista-banco flex flex-col gap-1"></div>
                            <div class="pdf-btn-add-banco px-4 py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 transition-all" style="position:relative;overflow:hidden;background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);border:1px solid #334155;color:#94a3b8;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94a3b8'">
                                <span class="material-symbols-rounded" style="font-size:16px;">upload_file</span>
                                <span class="hidden sm:inline">Añadir PDF de Simulación</span>
                                <input type="file" accept=".pdf,application/pdf" multiple onchange="subirPDFBanco(this)" style="position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;display:block;">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            container.appendChild(div);
            const iconoBanco = div.querySelector('.icon-container-banco');
            if (iconoBanco) {
                aplicarLongPressIcono(iconoBanco);
            }
            if (pdfData) {
                const lista = div.querySelector('.pdf-lista-banco');
                if (lista) {
                    const arr = Array.isArray(pdfData) ? pdfData : [pdfData];
                    arr.forEach(p => {
                        const pdfSource = _obtenerFuentePdfDesdeRegistro(p);
                        if (p && p.nombre && pdfSource) _renderPdfRowBanco(lista, p.nombre, pdfSource);
                    });
                }
            }
            
            guardarDatos();
            updateComparador();
        }

        function updateSimulacion(input) {
            updateComparador();
            const card = input.closest('.simulacion-card');
            const icon = card.querySelector('.simulacion-check-icon');
            if (icon && icon.dataset.checked === 'true') {
                updateInfoSimulacionSeleccionada();
            }
        }

        function _renderPdfRowBanco(lista, nombre, data) {
            const row = document.createElement('div');
            row.className = 'flex items-center gap-2 pdf-item-banco';
            row.dataset.pdfData = data;
            const btnCls = 'cursor-pointer rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all flex-shrink-0 px-2 py-1.5 sm:px-3 sm:py-2';
            const btnSty = 'background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);border:1px solid #334155;color:#94a3b8;';
            row.innerHTML =
                '<span class="material-symbols-rounded text-rose-500" style="font-size:16px;flex-shrink:0;">picture_as_pdf</span>' +
                '<span class="text-xs text-slate-400 truncate flex-1" style="max-width:120px;" title="' + nombre + '">' + nombre + '</span>' +
                '<button onclick="viewPDFItemBanco(this)" class="' + btnCls + '" style="' + btnSty + '" onmouseover="this.style.color=\'white\'" onmouseout="this.style.color=\'#94a3b8\'" title="Ver PDF">' +
                    '<span class="material-symbols-rounded" style="font-size:14px;">visibility</span>' +
                    '<span class="hidden sm:inline">Ver</span>' +
                '</button>' +
                '<button onclick="downloadPDFItemBanco(this)" class="' + btnCls + '" style="' + btnSty + '" onmouseover="this.style.color=\'#60a5fa\'" onmouseout="this.style.color=\'#94a3b8\'" title="Descargar PDF">' +
                    '<span class="material-symbols-rounded" style="font-size:14px;">download</span>' +
                    '<span class="hidden sm:inline">Bajar</span>' +
                '</button>' +
                '<button onclick="deletePDFItemBanco(this)" class="' + btnCls + '" style="' + btnSty + '" onmouseover="this.style.color=\'#f87171\'" onmouseout="this.style.color=\'#94a3b8\'" title="Eliminar">' +
                    '<span class="material-symbols-rounded" style="font-size:14px;">delete</span>' +
                    '<span class="hidden sm:inline">Eliminar</span>' +
                '</button>';
            lista.appendChild(row);
        }
        function viewPDFItemBanco(button) {
            const data = button.closest('.pdf-item-banco').dataset.pdfData;
            const nombre = button.closest('.pdf-item-banco').querySelector('span.truncate')?.textContent || 'simulacion.pdf';
            if (data) abrirPdfViewerModal(data, nombre);
        }
        function downloadPDFItemBanco(button) {
            const item = button.closest('.pdf-item-banco');
            const data = item.dataset.pdfData;
            const nombre = item.querySelector('span.truncate')?.textContent || 'simulacion.pdf';
            if (data) _descargarPdfComoArchivo(data, nombre);
        }
        function deletePDFItemBanco(button) {
            button.closest('.pdf-item-banco').remove();
            guardarDatos();
        }
        async function subirPDFBanco(input) {
            const files = Array.from(input.files).filter(f => _esArchivoPdfValido(f) && f.size <= 5*1024*1024);
            if (!files.length) { input.value = ''; return; }
            const lista = input.closest('.pdf-banco-container').querySelector('.pdf-lista-banco');
            for (const file of files) {
                const pdfSource = await _obtenerFuentePdfSubida(file);
                _renderPdfRowBanco(lista, file.name, pdfSource);
            }
            guardarDatos();
            input.value = '';
        }

        function eliminarSimulacion(btn) {
            const simCard = btn.closest('.simulacion-card');
            if (!simCard) return;
            if (typeof _undoPushInmediato === 'function') _undoPushInmediato();
            const lista = simCard ? simCard.closest('[id^="lista"]') : null;
            simCard.remove();
            updateComparador();
            guardarDatos();
        }

        function seleccionarSimulacion(checkbox) {
            document.querySelectorAll('.simulacion-check').forEach(check => {
                if (check !== checkbox) {
                    check.checked = false;
                    const etiquetaOtra = check.closest('.simulacion-card')?.querySelector('.etiqueta-seleccionada');
                    if (etiquetaOtra) etiquetaOtra.style.display = 'none';
                }
            });
            const card = checkbox.closest('.simulacion-card');
            const etiqueta = card?.querySelector('.etiqueta-seleccionada');
            if (etiqueta) {
                etiqueta.style.display = checkbox.checked ? 'flex' : 'none';
            }
            updateInfoSimulacionSeleccionada();
            calculate();
            guardarDatos();
        }

        function toggleSimulacionCheck(btn) {
            if (typeof _undoPushInmediato === 'function') _undoPushInmediato();
            const card = btn.closest('.simulacion-card');
            const icon = btn.querySelector('.simulacion-check-icon');
            const isChecked = icon.dataset.checked === 'true';
            const newChecked = !isChecked;
            if (newChecked) {
                document.querySelectorAll('.simulacion-check-icon').forEach(otherIcon => {
                    if (otherIcon !== icon) {
                        otherIcon.dataset.checked = 'false';
                        otherIcon.style.color = '#94a3b8';
                        const otherBtn = otherIcon.closest('button');
                        otherBtn.childNodes.forEach(node => {
                            if (node.nodeType === 3) node.textContent = 'Activar';
                        });
                        const otherCard = otherIcon.closest('.simulacion-card');
                        const otherEtiqueta = otherCard?.querySelector('.etiqueta-seleccionada');
                        if (otherEtiqueta) otherEtiqueta.style.display = 'none';
                    }
                });
            }
            icon.dataset.checked = newChecked ? 'true' : 'false';
            icon.style.color = newChecked ? '#10b981' : '#94a3b8';
            btn.childNodes.forEach(node => {
                if (node.nodeType === 3) node.textContent = newChecked ? 'Desactivar' : 'Activar';
            });
            const etiqueta = card?.querySelector('.etiqueta-seleccionada');
            if (etiqueta) {
                etiqueta.style.display = newChecked ? 'flex' : 'none';
            }
            updateInfoSimulacionSeleccionada();
            calculate();
            guardarDatos();
        }

        function updateInfoSimulacionSeleccionada() {
            const iconSeleccionado = document.querySelector('.simulacion-check-icon[data-checked="true"]');
            const infoDiv = document.getElementById('simulacionSeleccionadaInfo');
            const noSeleccionDiv = document.getElementById('noSimulacionSeleccionada');
            
            if (iconSeleccionado) {
                const card = iconSeleccionado.closest('.simulacion-card');
                const banco = card.querySelector('.banco-nombre').value || 'Sin nombre';
                const tin = card.querySelector('.tin-input').value || 0;
                const tae = card.querySelector('.tae-input').value || 0;
                const plazo = card.querySelector('.plazo-input').value || 30;
                const cuota = card.querySelector('.cuota-input').value || 0;
                const iconBancoOriginal = card.querySelector('.icon-container-banco');
                const logoBancoDestino = document.getElementById('logoBancoSeleccionado');
                
                if (iconBancoOriginal && logoBancoDestino) {
                    logoBancoDestino.innerHTML = iconBancoOriginal.innerHTML;
                    logoBancoDestino.style.background = iconBancoOriginal.style.background;
                    logoBancoDestino.className = iconBancoOriginal.className;
                    logoBancoDestino.classList.add('w-12', 'h-12', 'rounded-xl', 'flex', 'items-center', 'justify-center');
                    logoBancoDestino.style.cursor = 'default';
                    logoBancoDestino.removeAttribute('onclick');
                    logoBancoDestino.querySelectorAll('[onclick]').forEach(function(el){ el.removeAttribute('onclick'); });
                    logoBancoDestino.querySelectorAll('.opacity-0').forEach(function(el){ el.remove(); });
                }
                
                { const _el = document.getElementById('bancoSeleccionadoNombre'); if (_el) _el.textContent = banco; }
                { const _el = document.getElementById('cuotaSeleccionada'); if (_el) _el.textContent = fmt(parseMoneyInput(String(cuota))) + ' €'; }
                { const _el = document.getElementById('tinSeleccionado'); if (_el) _el.textContent = parseFloat(tin).toFixed(2) + '%'; }
                { const _el = document.getElementById('taeSeleccionado'); if (_el) _el.textContent = parseFloat(tae).toFixed(2) + '%'; }
                { const _el = document.getElementById('plazoSeleccionado'); if (_el) _el.textContent = plazo + ' años'; }
                
                infoDiv.style.display = 'block';
                noSeleccionDiv.style.display = 'none';
            } else {
                infoDiv.style.display = 'none';
                noSeleccionDiv.style.display = 'block';
            }
        }

        function updateComparador() {
            const simulaciones = document.querySelectorAll('.simulacion-card');
            const comparador = document.getElementById('comparadorSimulaciones');
            
            if (simulaciones.length === 0) {
                comparador.style.display = 'none';
                return;
            }
            
            comparador.style.display = 'block';
            
            let mejorCuota = { valor: Infinity, banco: '-' };
            let mejorTAE = { valor: Infinity, banco: '-' };
            let mejorTIN = { valor: Infinity, banco: '-' };
            
            simulaciones.forEach(card => {
                const banco = card.querySelector('.banco-nombre').value || 'Sin nombre';
                const cuota = parseMoneyInput(card.querySelector('.cuota-input').value);
                const tae = parseMoneyInput(card.querySelector('.tae-input').value);
                const tin = parseMoneyInput(card.querySelector('.tin-input').value);
                
                if (cuota > 0 && cuota < mejorCuota.valor) {
                    mejorCuota = { valor: cuota, banco: banco };
                }
                if (tae > 0 && tae < mejorTAE.valor) {
                    mejorTAE = { valor: tae, banco: banco };
                }
                if (tin > 0 && tin < mejorTIN.valor) {
                    mejorTIN = { valor: tin, banco: banco };
                }
            });
            
            { const _el = document.getElementById('mejorCuota'); if (_el) _el.textContent = mejorCuota.valor !== Infinity ? fmt(mejorCuota.valor) + ' €' : '-'; }
            { const _el = document.getElementById('bancoCuota'); if (_el) _el.textContent = mejorCuota.banco; }
            
            { const _el = document.getElementById('mejorTAE'); if (_el) _el.textContent = mejorTAE.valor !== Infinity ? mejorTAE.valor.toFixed(2) + ' %' : '-'; }
            { const _el = document.getElementById('bancoTAE'); if (_el) _el.textContent = mejorTAE.banco; }
            
            { const _el = document.getElementById('mejorTIN'); if (_el) _el.textContent = mejorTIN.valor !== Infinity ? mejorTIN.valor.toFixed(2) + ' %' : '-'; }
            { const _el = document.getElementById('bancoTIN'); if (_el) _el.textContent = mejorTIN.banco; }
        }
        async function generarPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            doc.setFillColor(15, 23, 42); // #0f172a
            doc.rect(0, 0, 210, 297, 'F');
            
            let y = 15;
            const margen = 12;
            const anchoUtil = 186;
            
            const fmt = (num) => {
                const r = Math.round(num * 100) / 100;
                const hasDec = (r % 1) !== 0;
                return r.toLocaleString('es-ES', { minimumFractionDigits: hasDec ? 2 : 0, maximumFractionDigits: hasDec ? 2 : 0 });
            };
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont(undefined, 'bold');
            const titulo = document.getElementById('tituloApp')?.value || 'seniorplazapp';
            doc.text(titulo, 105, y, { align: 'center' });
            
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(148, 163, 184);
            doc.text(`Generado: ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`, 105, y + 7, { align: 'center' });
            
            y = 32;
            const tarjeta = (x, y, w, h, colorBorde) => {
                doc.setFillColor(30, 41, 59); // slate-800
                doc.roundedRect(x, y, w, h, 2, 2, 'F');
                doc.setDrawColor(...colorBorde);
                doc.setLineWidth(0.6);
                doc.roundedRect(x, y, w, h, 2, 2, 'S');
            };
            const totalCuentas = Array.from(document.querySelectorAll('#listaCuentas .money-input'))
                .reduce((sum, input) => {
                    return !input.closest('.card-input-group').classList.contains('disabled') ? sum + (parseMoneyInput(input.value)) : sum;
                }, 0);
            
            const totalInversiones = Array.from(document.querySelectorAll('#listaInversiones .money-input'))
                .reduce((sum, input) => {
                    return !input.closest('.card-input-group').classList.contains('disabled') ? sum + (parseMoneyInput(input.value)) : sum;
                }, 0);
            
            const donMadre = getDonValue('donMama');
            const donPadre = getDonValue('donPapa');
            const capitalTotal = totalCuentas + totalInversiones + donMadre + donPadre;
            
            const ingresosMes = window.totalIngresosMes || 0;
            
            const gastosMes = window._totalGastosMes !== undefined ? window._totalGastosMes : (parseFloat(document.getElementById('totalGastosMes')?.innerText.replace(/\./g, '').replace(',', '.')) || 0);
            
            const balance = ingresosMes - gastosMes;
            const anchoCarta = 60;
            tarjeta(margen, y, anchoCarta, 22, [16, 185, 129]);
            doc.setFontSize(7);
            doc.setTextColor(148, 163, 184);
            doc.text('CAPITAL DISPONIBLE', margen + 3, y + 5);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(16, 185, 129);
            doc.text(fmt(capitalTotal) + ' €', margen + anchoCarta / 2, y + 15, { align: 'center' });
            tarjeta(margen + anchoCarta + 3, y, anchoCarta, 22, [59, 130, 246]);
            doc.setFontSize(7);
            doc.setTextColor(148, 163, 184);
            doc.text('INGRESOS/MES', margen + anchoCarta + 6, y + 5);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(59, 130, 246);
            doc.text(fmt(ingresosMes) + ' €', margen + anchoCarta + 3 + anchoCarta / 2, y + 15, { align: 'center' });
            const colorBalance = balance >= 0 ? [16, 185, 129] : [239, 68, 68];
            tarjeta(margen + (anchoCarta + 3) * 2, y, anchoCarta, 22, colorBalance);
            doc.setFontSize(7);
            doc.setTextColor(148, 163, 184);
            doc.text('BALANCE/MES', margen + (anchoCarta + 3) * 2 + 3, y + 5);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...colorBalance);
            doc.text(fmt(balance) + ' €', margen + (anchoCarta + 3) * 2 + anchoCarta / 2, y + 15, { align: 'center' });
            
            y += 28;
            tarjeta(margen, y, anchoUtil, 32, [99, 102, 241]);
            
            doc.setFontSize(9);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(99, 102, 241);
            doc.text('DESGLOSE DE CAPITAL', margen + 3, y + 6);
            
            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(203, 213, 225);
            
            let yInt = y + 13;
            doc.text('Cuentas bancarias:', margen + 4, yInt);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text(fmt(totalCuentas) + ' €', margen + anchoUtil - 4, yInt, { align: 'right' });
            doc.setFont(undefined, 'normal');
            doc.setTextColor(203, 213, 225);
            yInt += 5;
            
            doc.text('Inversiones:', margen + 4, yInt);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text(fmt(totalInversiones) + ' €', margen + anchoUtil - 4, yInt, { align: 'right' });
            doc.setFont(undefined, 'normal');
            doc.setTextColor(203, 213, 225);
            yInt += 5;
            
            if (donMadre + donPadre > 0) {
                doc.text('Donaciones:', margen + 4, yInt);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(255, 255, 255);
                doc.text(fmt(donMadre + donPadre) + ' €', margen + anchoUtil - 4, yInt, { align: 'right' });
            }
            
            y += 38;
            const precioCasa = getDonValue('precioCasa');
            const percEntrada = parseFloat(document.getElementById('percEntrada')?.value) || 20;
            const percITP = parseFloat(document.getElementById('percITP')?.value) || 10;
            const gastoNotaria = parseMoneyInput(document.getElementById('gastoNotaria')?.value || "0") || 2500;
            
            const entrada = precioCasa * (percEntrada / 100);
            const itp = precioCasa * (percITP / 100);
            const prestamo = precioCasa - entrada;
            const gastoInicial = entrada + itp + gastoNotaria;
            
            const simSeleccionada = document.querySelector('.simulacion-check:checked');
            let cuotaMensual = 0;
            let bancoSeleccionado = '-';
            
            if (simSeleccionada) {
                const card = simSeleccionada.closest('.simulacion-card');
                cuotaMensual = parseMoneyInput(card.querySelector('.cuota-input')?.value);
                bancoSeleccionado = card.querySelector('.banco-nombre')?.value || '-';
            }
            
            tarjeta(margen, y, anchoUtil, 48, [168, 85, 247]);
            
            doc.setFontSize(9);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(168, 85, 247);
            doc.text('COMPRA DE VIVIENDA', margen + 3, y + 6);
            
            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(203, 213, 225);
            
            yInt = y + 13;
            
            doc.text('Precio vivienda:', margen + 4, yInt);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text(fmt(precioCasa) + ' €', margen + anchoUtil - 4, yInt, { align: 'right' });
            doc.setFont(undefined, 'normal');
            doc.setTextColor(203, 213, 225);
            yInt += 5;
            
            doc.text(`Entrada (${percEntrada}%):`, margen + 4, yInt);
            doc.setTextColor(255, 255, 255);
            doc.text(fmt(entrada) + ' €', margen + anchoUtil - 4, yInt, { align: 'right' });
            doc.setTextColor(203, 213, 225);
            yInt += 5;
            
            doc.text(`ITP (${percITP}%):`, margen + 4, yInt);
            doc.setTextColor(255, 255, 255);
            doc.text(fmt(itp) + ' €', margen + anchoUtil - 4, yInt, { align: 'right' });
            doc.setTextColor(203, 213, 225);
            yInt += 5;
            
            doc.text('Notaría y registro:', margen + 4, yInt);
            doc.setTextColor(255, 255, 255);
            doc.text(fmt(gastoNotaria) + ' €', margen + anchoUtil - 4, yInt, { align: 'right' });
            yInt += 6;
            
            doc.setDrawColor(71, 85, 105);
            doc.setLineWidth(0.2);
            doc.line(margen + 4, yInt - 2, margen + anchoUtil - 4, yInt - 2);
            
            doc.setFont(undefined, 'bold');
            doc.setTextColor(239, 68, 68);
            doc.text('Gasto inicial:', margen + 4, yInt);
            doc.text(fmt(gastoInicial) + ' €', margen + anchoUtil - 4, yInt, { align: 'right' });
            yInt += 5;
            
            doc.setFont(undefined, 'normal');
            doc.setTextColor(203, 213, 225);
            doc.text('Importe a financiar:', margen + 4, yInt);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text(fmt(prestamo) + ' €', margen + anchoUtil - 4, yInt, { align: 'right' });
            yInt += 6;
            
            if (cuotaMensual > 0) {
                doc.setFontSize(7);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(148, 163, 184);
                doc.text('Banco: ' + bancoSeleccionado, margen + 4, yInt);
                doc.setFontSize(9);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(16, 185, 129);
                doc.text(fmt(cuotaMensual) + ' €/mes', margen + anchoUtil - 4, yInt, { align: 'right' });
            }
            
            y += 54;
            const dineroRestante = capitalTotal - gastoInicial;
            const esfuerzo = ingresosMes > 0 ? (cuotaMensual / ingresosMes) * 100 : 0;
            const balanceConHipoteca = balance - cuotaMensual;
            
            const esViable = dineroRestante >= 0 && esfuerzo <= 35 && balanceConHipoteca >= 0;
            const colorViabilidad = esViable ? [16, 185, 129] : esfuerzo <= 45 ? [251, 146, 60] : [239, 68, 68];
            
            tarjeta(margen, y, anchoUtil, 32, colorViabilidad);
            
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...colorViabilidad);
            const textoViabilidad = esViable ? '✓ OPERACIÓN VIABLE' : esfuerzo <= 45 ? '⚠ REVISAR CONDICIONES' : '✗ NO RECOMENDABLE';
            doc.text(textoViabilidad, 105, y + 9, { align: 'center' });
            
            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(203, 213, 225);
            
            yInt = y + 17;
            
            doc.text('Dinero restante:', margen + 4, yInt);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(dineroRestante >= 0 ? 16 : 239, dineroRestante >= 0 ? 185 : 68, dineroRestante >= 0 ? 129 : 68);
            doc.text(fmt(dineroRestante) + ' €', margen + anchoUtil - 4, yInt, { align: 'right' });
            doc.setFont(undefined, 'normal');
            doc.setTextColor(203, 213, 225);
            yInt += 5;
            
            doc.text('Esfuerzo hipotecario:', margen + 4, yInt);
            doc.setFont(undefined, 'bold');
            const colorEsfuerzo = esfuerzo <= 35 ? [16, 185, 129] : esfuerzo <= 45 ? [251, 146, 60] : [239, 68, 68];
            doc.setTextColor(...colorEsfuerzo);
            doc.text(esfuerzo.toFixed(1) + '%', margen + anchoUtil - 4, yInt, { align: 'right' });
            doc.setFont(undefined, 'normal');
            doc.setTextColor(203, 213, 225);
            yInt += 5;
            
            doc.text('Balance con hipoteca:', margen + 4, yInt);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(balanceConHipoteca >= 0 ? 16 : 239, balanceConHipoteca >= 0 ? 185 : 68, balanceConHipoteca >= 0 ? 129 : 68);
            doc.text(fmt(balanceConHipoteca) + ' €', margen + anchoUtil - 4, yInt, { align: 'right' });
            doc.setFontSize(6);
            doc.setTextColor(100, 116, 139);
            doc.text('seniorplazapp - ' + new Date().toLocaleDateString('es-ES'), 105, 290, { align: 'center' });
            doc.save(`seniorplazapp_${titulo.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
        }
        document.addEventListener('DOMContentLoaded', function() {
            const listasParaDragDrop = [
                'listaCuentas',
                'listaInversiones', 
                'listaIngresos',
                'listaGastos',
                'listaSimulaciones'
            ];
            
            listasParaDragDrop.forEach(listaId => {
                const elemento = document.getElementById(listaId);
                if (elemento) {
                    new Sortable(elemento, {
                        animation: 150,
                        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                        ghostClass: 'sortable-ghost',
                        dragClass: 'sortable-drag',
                        chosenClass: 'sortable-chosen',
                        fallbackClass: 'sortable-fallback',
                        fallbackOnBody: true,
                        swapThreshold: 0.65,
                        handle: '.drag-handle, .drag-handle-banco',
                        filter: '.btn-menu-card, .btn-menu-card-wrapper, .card-menu-dropdown',
                        preventOnFilter: true,
                        delay: 0,
                        delayOnTouchOnly: false,
                        touchStartThreshold: 3,
                        forceFallback: true,
                        fallbackTolerance: 0,
                        onChoose: function(evt) {
                            if (navigator.vibrate) navigator.vibrate(30);
                        },
                        onUnchoose: function(evt) {
                            evt.item.classList.remove('long-press-active');
                        },
                        onStart: function(evt) {
                            evt.item.classList.add('long-press-ready');
                            if (navigator.vibrate) navigator.vibrate(30);
                            const rect = evt.item.getBoundingClientRect();
                            const realWidth = rect.width;
                            const realHeight = rect.height;
                            
                            evt.item.style.width = realWidth + 'px';
                            evt.item.style.height = realHeight + 'px';
                            setTimeout(() => {
                                const fallback = document.querySelector('.sortable-fallback');
                                if (fallback) {
                                    fallback.style.width = realWidth + 'px';
                                    fallback.style.height = realHeight + 'px';
                                    fallback.style.opacity = '1';
                                    fallback.style.visibility = 'visible';
                                    fallback.style.background = 'rgba(15, 23, 42, 0.95)';
                                    fallback.style.backdropFilter = 'blur(8px)';
                                    fallback.style.webkitBackdropFilter = 'blur(8px)';
                                    fallback.style.border = '2px solid rgba(99, 102, 241, 0.5)';
                                    fallback.style.borderRadius = '12px';
                                    fallback.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.5)';
                                    fallback.style.transform = 'scale(1.05)';
                                    fallback.style.transition = 'none';
                                    fallback.style.cursor = 'grabbing';
                                    fallback.style.zIndex = '100000';
                                }
                            }, 0);
                        },
                        onMove: function(evt) {
                            const fallback = document.querySelector('.sortable-fallback');
                            if (fallback && fallback.style.opacity !== '1') {
                                fallback.style.opacity = '1';
                                fallback.style.visibility = 'visible';
                            }
                        },
                        onEnd: function(evt) {
                            document.body.classList.add('drag-ending');
                            document.documentElement.classList.add('drag-ending');
                            const mainEl = document.querySelector('main');
                            if (mainEl) mainEl.classList.add('drag-ending');
                            const containerEl = document.querySelector('.container');
                            if (containerEl) containerEl.classList.add('drag-ending');
                            
                            evt.item.classList.remove('long-press-active', 'long-press-ready');
                            evt.item.style.width = '';
                            evt.item.style.height = '';
                            setTimeout(() => {
                                document.body.classList.remove('drag-ending');
                                document.documentElement.classList.remove('drag-ending');
                                if (mainEl) mainEl.classList.remove('drag-ending');
                                if (containerEl) containerEl.classList.remove('drag-ending');
                            }, 100);
                            guardarDatos();
                            if (listaId === 'listaCuentas' || listaId === 'listaInversiones') {
                                calculate();
                            } else if (listaId === 'listaIngresos') {
                                calculateIngresos();
                            } else if (listaId === 'listaGastos') {
                                calculateGastos();
                            } else if (listaId === 'listaReformas') {
                                calculate();
                            } else if (listaId === 'listaSimulaciones') {
                                updateComparador();
                            }
                        }
                    });
                }
            });
            /*
            const esMobil = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            let dragActivo = false;
            let sortableInstancia = null;
            ['listaReformas', 'listaMobiliario'].forEach(listaId => {
                const lista = document.getElementById(listaId);
                if (!lista) return;

                const getWrapper = () => lista.closest('.carrusel-scroll-wrapper');
                let autoScrollInterval = null;

                const sortable = new Sortable(lista, {
                    animation: 200,
                    ghostClass: 'sortable-ghost',
                    dragClass: 'sortable-drag',
                    chosenClass: 'sortable-chosen',
                    fallbackClass: 'sortable-fallback',
                    handle: '.card-drag-handle',
                    filter: 'button, .card-thumbnail-wrapper, .card-titulo-preview, .card-precio-preview',
                    preventOnFilter: false,
                    delay: esMobil ? 100 : 0,
                    delayOnTouchOnly: true,
                    touchStartThreshold: 5,
                    forceFallback: true,
                    fallbackOnBody: true,
                    fallbackTolerance: 0,
                    swapThreshold: 0.65,
                    onChoose: function(evt) {
                        dragActivo = true;
                        sortableInstancia = sortable;
                        const w = getWrapper();
                        if (w) { 
                            w.classList.add('dragging-card'); 
                            w.style.touchAction = 'pan-x'; 
                        }
                        if (navigator.vibrate) navigator.vibrate(30);
                    },
                    onUnchoose: function(evt) {
                        const w = getWrapper();
                        if (w) { 
                            w.classList.remove('dragging-card'); 
                            w.style.overflowX = 'auto'; 
                            w.style.touchAction = 'pan-x'; 
                        }
                        if (autoScrollInterval) {
                            clearInterval(autoScrollInterval);
                            autoScrollInterval = null;
                        }
                    },
                    onStart: function(evt) {
                        if (navigator.vibrate) navigator.vibrate(30);
                        const rect = evt.item.getBoundingClientRect();
                        const realWidth = rect.width;
                        const realHeight = rect.height;
                        
                        evt.item.style.width = realWidth + 'px';
                        evt.item.style.height = realHeight + 'px';
                        setTimeout(() => {
                            const fallback = document.querySelector('.sortable-fallback');
                            if (fallback) {
                                fallback.style.width = realWidth + 'px';
                                fallback.style.height = realHeight + 'px';
                                fallback.style.opacity = '0.8';
                                fallback.style.visibility = 'visible';
                            }
                        }, 0);
                        const w = getWrapper();
                        if (!w) return;

                        let lastMouseX = evt.originalEvent ? evt.originalEvent.clientX : 0;

                        const handleMouseMove = (e) => {
                            lastMouseX = e.clientX;
                        };
                        
                        const handleTouchMove = (e) => {
                            if (e.touches && e.touches[0]) lastMouseX = e.touches[0].clientX;
                        };

                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('touchmove', handleTouchMove, { passive: true });

                        autoScrollInterval = setInterval(() => {
                            if (!w) return;
                            
                            const rect = w.getBoundingClientRect();
                            const edgeThreshold = 150;
                            const maxScrollSpeed = 15;
                            const distFromLeft = lastMouseX - rect.left;
                            const distFromRight = rect.right - lastMouseX;
                            if (distFromLeft < edgeThreshold && distFromLeft > 0) {
                                const speed = maxScrollSpeed * (1 - distFromLeft / edgeThreshold);
                                w.scrollLeft -= speed;
                            }
                            else if (distFromRight < edgeThreshold && distFromRight > 0) {
                                const speed = maxScrollSpeed * (1 - distFromRight / edgeThreshold);
                                w.scrollLeft += speed;
                            }
                        }, 16); // ~60fps
                        const cleanup = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('touchmove', handleTouchMove);
                            if (autoScrollInterval) {
                                clearInterval(autoScrollInterval);
                                autoScrollInterval = null;
                            }
                        };
                        evt.item._sortableCleanup = cleanup;
                    },
                    onEnd: function(evt) {
                        dragActivo = false;
                        sortableInstancia = null;
                        document.body.classList.add('drag-ending');
                        document.documentElement.classList.add('drag-ending');
                        const mainEl = document.querySelector('main');
                        if (mainEl) mainEl.classList.add('drag-ending');
                        const containerEl = document.querySelector('.container');
                        if (containerEl) containerEl.classList.add('drag-ending');
                        
                        evt.item.style.width = '';
                        evt.item.style.height = '';
                        const w = getWrapper();
                        if (w) { 
                            w.classList.remove('dragging-card'); 
                            w.style.overflowX = 'auto'; 
                            w.style.touchAction = 'pan-x'; 
                        }
                        if (typeof evt.item._sortableCleanup === 'function') {
                            evt.item._sortableCleanup();
                            delete evt.item._sortableCleanup;
                        }
                        if (autoScrollInterval) {
                            clearInterval(autoScrollInterval);
                            autoScrollInterval = null;
                        }
                        setTimeout(() => {
                            document.body.classList.remove('drag-ending');
                            document.documentElement.classList.remove('drag-ending');
                            if (mainEl) mainEl.classList.remove('drag-ending');
                            if (containerEl) containerEl.classList.remove('drag-ending');
                        }, 100);
                        
                        guardarDatos();
                        centrarCard(evt.item);
                    }
                });
            });
            document.addEventListener('mouseup', function(e) {
                if (dragActivo && sortableInstancia) {
                    setTimeout(() => {
                        document.querySelectorAll('.sortable-ghost, .sortable-drag, .sortable-chosen').forEach(el => {
                            el.classList.remove('sortable-ghost', 'sortable-drag', 'sortable-chosen');
                        });
                        dragActivo = false;
                        sortableInstancia = null;
                    }, 10);
                }
            }, true);

            document.addEventListener('touchend', function(e) {
                if (dragActivo && sortableInstancia) {
                    setTimeout(() => {
                        document.querySelectorAll('.sortable-ghost, .sortable-drag, .sortable-chosen').forEach(el => {
                            el.classList.remove('sortable-ghost', 'sortable-drag', 'sortable-chosen');
                        });
                        dragActivo = false;
                        sortableInstancia = null;
                    }, 10);
                }
            }, true);
            */
            function _activarDragEnding() {
                if (!document.querySelector('.sortable-ghost, .sortable-drag, .sortable-fallback')) return;
                const mainEl = document.querySelector('main');
                const containerEl = document.querySelector('.container');
                document.body.classList.add('drag-ending');
                document.documentElement.classList.add('drag-ending');
                if (mainEl) mainEl.classList.add('drag-ending');
                if (containerEl) containerEl.classList.add('drag-ending');
                setTimeout(function() {
                    document.body.classList.remove('drag-ending');
                    document.documentElement.classList.remove('drag-ending');
                    if (mainEl) mainEl.classList.remove('drag-ending');
                    if (containerEl) containerEl.classList.remove('drag-ending');
                }, 400);
            }
            document.addEventListener('touchend', _activarDragEnding, { capture: true, passive: true });
            document.addEventListener('mouseup', _activarDragEnding, { capture: true });
            document.addEventListener('contextmenu', function(e) {
                const tag = e.target.tagName.toLowerCase();
                if (tag === 'input' || tag === 'textarea') return; // permitir en campos de texto
                e.preventDefault();
                return false;
            }, true);
            document.addEventListener('selectstart', function(e) {
                const tag = e.target.tagName.toLowerCase();
                if (tag === 'input' || tag === 'textarea') return;
                e.preventDefault();
            }, true);
            document.addEventListener('input', function(e) {
                if (e.target.matches('input, textarea, select')) {
                    guardarDatos();
                }
            });
            document.addEventListener('change', function(e) {
                if (e.target.matches('input[type="checkbox"]')) {
                    guardarDatos();
                }
            });
            cargarDatos();
            setTimeout(() => { _syncEmptyStates && _syncEmptyStates(); }, 600);
            setTimeout(() => { _syncEmptyStates && _syncEmptyStates(); }, 1800);
            setTimeout(() => {
                document.querySelectorAll('.icon-container, .icon-container-principal, .icon-container-banco').forEach(ic => { if (ic.id !== 'iconoPrincipalContainer') aplicarLongPressIcono(ic); });
            }, 500); // Pequeño delay para asegurar que todo está cargado
        });
        window.abrirSelectorVL = function(idx) {
            window._vlMiniIdx = idx;
            const el = document.querySelector('#vlHeaderIconContainer') 
                     || document.querySelector(`#vlMiniActiva_${idx}`) 
                     || document.querySelector(`#vlMiniModal_${idx}`);
            if (!el) return;

            tipoElementoActual = 'vl-miniatura';
            elementoIconoActual = el;
            abrirModalIconos();
            mostrarOpcionIcono();
            const mini = window._VL && window._VL.state.miniaturas[idx];
            const imgPreview = document.getElementById('imgPreviewMiniatura');
            const previewContainer = document.getElementById('previewMiniatura');
            const noPreviewContainer = document.getElementById('noPreviewMiniatura');
            if (mini && imgPreview) {
                imgPreview.src = mini;
                if (previewContainer) previewContainer.style.display = 'block';
                if (noPreviewContainer) noPreviewContainer.style.display = 'none';
            } else {
                if (previewContainer) previewContainer.style.display = 'none';
                if (noPreviewContainer) noPreviewContainer.style.display = 'block';
            }
        };
    
