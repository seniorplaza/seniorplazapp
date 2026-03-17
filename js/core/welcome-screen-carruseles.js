
        function _mostrarWelcome() {
            const welcome = document.getElementById('welcome-screen');
            if (!welcome) return;
            try { if (sessionStorage.getItem('_lastTab')) return; } catch(e) {}
            const hora = new Date().getHours();
            const saludo = document.getElementById('welcomeSaludo');
            const fecha  = document.getElementById('welcomeFecha');
            if (saludo) saludo.textContent =
                hora < 12 ? '¡Buenos días, David!' : hora < 21 ? '¡Buenas tardes, David!' : '¡Buenas noches, David!';
            if (fecha) fecha.textContent =
                new Date().toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long', year:'numeric' }).toUpperCase();
            welcome.style.display  = 'flex';
            welcome.style.opacity  = '1';
            welcome.classList.remove('hidden');
            welcome.classList.add('visible');
            _welcomeSortGrid();
            const cards = welcome.querySelectorAll('.welcome-nav-card');
            setTimeout(() => {
                cards.forEach(card => card.classList.add('card-visible'));
            }, 80);
        }
        (function() {
            try {
                if (!sessionStorage.getItem('_lastTab')) return;
                const ma = document.getElementById('main-app');
                const ws = document.getElementById('welcome-screen');
                if (ws) ws.style.display = 'none';
                if (ma) { ma.style.display = 'block'; ma.style.opacity = '0'; }
                document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            } catch(e) {}
        })();
        _mostrarWelcome();

        const carruselConfig = {
            reforma:   { track: 'carrusel-reformas',   wrapper: 'carrusel-reformas-wrapper',   dots: 'dots-reformas',   lista: 'listaReformas',   empty: 'empty-reformas',   badge: 'badge-reformas',   arrL: 'arr-ref-left',  arrR: 'arr-ref-right' },
            mobiliario: { track: 'carrusel-mobiliario', wrapper: 'carrusel-mobiliario-wrapper', dots: 'dots-mobiliario', lista: 'listaMobiliario', empty: 'empty-mobiliario', badge: 'badge-mobiliario', arrL: 'arr-mob-left',  arrR: 'arr-mob-right' }
        };

        function scrollCarrusel(seccion, direction) {
            const wrapper = document.getElementById(carruselConfig[seccion].wrapper);
            if (wrapper) wrapper.scrollBy({ left: direction === 'left' ? -280 : 280, behavior: 'smooth' });
        }

        function getActiveIndex(track, wrapper) {
            const cards = track.querySelectorAll('.reforma-preview-card');
            if (!cards.length) return -1;
            const center = (wrapper || track).scrollLeft + (wrapper || track).clientWidth / 2;
            let best = 0, minDist = Infinity;
            cards.forEach((c, i) => {
                const cardCenter = c.offsetLeft + c.offsetWidth / 2;
                const d = Math.abs(cardCenter - center);
                if (d < minDist) { minDist = d; best = i; }
            });
            return best;
        }

        function onCarruselScroll(seccion) {
            const cfg = carruselConfig[seccion];
            const wrapper = document.getElementById(cfg.wrapper);
            if (!wrapper) return;
            const { scrollLeft, scrollWidth, clientWidth } = wrapper;
            const arrL = document.getElementById(cfg.arrL);
            const arrR = document.getElementById(cfg.arrR);
            const lista = document.getElementById(cfg.lista);
            const cards = lista ? lista.querySelectorAll('.reforma-preview-card') : [];
            if (arrL) arrL.style.display = (cards.length > 1 && scrollLeft > 10) ? 'flex' : 'none';
            if (arrR) arrR.style.display = (cards.length > 1 && scrollLeft < scrollWidth - clientWidth - 10) ? 'flex' : 'none';
            wrapper.classList.toggle('scrolled-left', scrollLeft > 10);

            const isMobile = window.innerWidth < 769;

            if (!_cargando && isMobile) {
                if (!wrapper._rafPending) {
                    wrapper._rafPending = true;
                    requestAnimationFrame(() => {
                        wrapper._rafPending = false;
                        const wrapperRect = wrapper.getBoundingClientRect();
                        const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;
                        const maxDist = wrapperRect.width * 0.6;
                        const rects = Array.from(cards).map(c => c.getBoundingClientRect());
                        rects.forEach((rect, i) => {
                            const dist = Math.abs((rect.left + rect.width / 2) - wrapperCenter);
                            const ratio = Math.max(0, 1 - dist / maxDist);
                            const lift = ratio * 16;
                            cards[i].style.transform = `translateY(-${lift}px) scale(${1 + ratio * 0.03})`;
                            cards[i].style.zIndex = Math.round(ratio * 10);
                        });
                    });
                }
            }

            if (!_cargando) {
                clearTimeout(wrapper._dialDebounce);
                wrapper._dialDebounce = setTimeout(() => {
                    const dotsEl = document.getElementById(cfg.dots);
                    if (!dotsEl || cards.length === 0) return;
                    const isMobile = window.innerWidth < 769;
                    let idx;
                    if (isMobile) {
                        const wrapperRect = wrapper.getBoundingClientRect();
                        const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;
                        let minDist = Infinity;
                        Array.from(cards).forEach((card, i) => {
                            const rect = card.getBoundingClientRect();
                            const dist = Math.abs((rect.left + rect.width / 2) - wrapperCenter);
                            if (dist < minDist) { minDist = dist; idx = i; }
                        });
                    } else {
                        idx = Array.from(cards).findIndex(c => c.classList.contains('active-card'));
                        if (idx < 0) idx = 0;
                    }
                    dotsEl.querySelectorAll('.carrusel-dot').forEach((dot, i) => {
                        dot.classList.toggle('active', i === idx);
                    });
                }, 60);
            }
        }

        function refrescarCarrusel(seccion) {
            const cfg = carruselConfig[seccion];
            const track = document.getElementById(cfg.track);
            const lista = document.getElementById(cfg.lista);
            if (!track || !lista) return;
            const cards = lista.querySelectorAll('.reforma-preview-card');
            const count = cards.length;
            const badge = document.getElementById(cfg.badge);
            if (badge) badge.textContent = count;
            const badgeMobile = document.getElementById(cfg.badge + '-mobile');
            if (badgeMobile) badgeMobile.textContent = count;
            const empty = document.getElementById(cfg.empty);
            if (empty) empty.style.display = count === 0 ? 'flex' : 'none';
            const dotsEl = document.getElementById(cfg.dots);
            if (dotsEl) {
                const activeIdx = Array.from(cards).findIndex(c => c.classList.contains('active-card'));
                const dotActivo = activeIdx >= 0 ? activeIdx : 0;
                dotsEl.innerHTML = '';
                for (let i = 0; i < count; i++) {
                    const d = document.createElement('div');
                    d.className = 'carrusel-dot carrusel-dot-' + seccion + (i === dotActivo ? ' active' : '');
                    d.onclick = () => {
                        const card = lista.querySelectorAll('.reforma-preview-card')[i];
                        if (!card) return;
                        lista.querySelectorAll('.reforma-preview-card').forEach(c => c.classList.remove('active-card'));
                        card.classList.add('active-card');
                        dotsEl.querySelectorAll('.carrusel-dot').forEach((dot, idx) => dot.classList.toggle('active', idx === i));
                        scrollToCard(card);
                    };
                    dotsEl.appendChild(d);
                }
            }
            if (count > 0) {
                onCarruselScroll(seccion);
            }
        }

        function scrollToCard(card) {
            if (!card) return;
            const wrapper = card.closest('.carrusel-scroll-wrapper');
            if (!wrapper) return;
            wrapper._programmaticScroll = true;
            const cardLeft = card.getBoundingClientRect().left;
            const wrapperLeft = wrapper.getBoundingClientRect().left;
            const targetScrollLeft = wrapper.scrollLeft + cardLeft - wrapperLeft - (wrapper.clientWidth / 2) + (card.offsetWidth / 2);
            wrapper.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
            clearTimeout(wrapper._scrollTimer);
            wrapper._scrollTimer = setTimeout(() => { wrapper._programmaticScroll = false; }, 600);
        }

        function centrarCard(card) {
            const seccion = card.dataset.tipoReforma === 'mobiliario' ? 'mobiliario' : 'reforma';
            const track = document.getElementById(carruselConfig[seccion].track);
            if (!track) return;
            const cards = track.querySelectorAll('.reforma-preview-card');
            const dotsEl = document.getElementById(carruselConfig[seccion].dots);
            cards.forEach(c => c.classList.remove('active-card'));
            requestAnimationFrame(() => {
                card.classList.add('active-card');
                if (dotsEl) {
                    const idx = Array.from(cards).indexOf(card);
                    Array.from(dotsEl.children).forEach((d, i) => d.classList.toggle('active', i === idx));
                }
                scrollToCard(card);
            });
        }

        function initCarruselObserver(seccion) {
            const lista = document.getElementById(carruselConfig[seccion].lista);
            if (!lista) return;
            let _debounce;
            new MutationObserver(() => {
                if (window._sortingCarrusel) return;
                clearTimeout(_debounce);
                _debounce = setTimeout(() => refrescarCarrusel(seccion), 120);
            }).observe(lista, { childList: true });
        }

        function initCarruseles() {
            ['reforma', 'mobiliario'].forEach(s => {
                initCarruselObserver(s);
                refrescarCarrusel(s);
            });
        }

        document.addEventListener('DOMContentLoaded', () => setTimeout(initCarruseles, 500));
        document.getElementById('mag-btn')?.addEventListener('click', () => setTimeout(initCarruseles, 600));
        window._welcomeGo = function(tabId, cardEl) {
            try {
                const visits = JSON.parse(localStorage.getItem('_welcomeVisits') || '{}');
                visits[tabId] = (visits[tabId] || 0) + 1;
                localStorage.setItem('_welcomeVisits', JSON.stringify(visits));
            } catch(e) {}
            const welcome = document.getElementById('welcome-screen');
            const mainApp = document.getElementById('main-app');
            const mainNav = document.getElementById('mainNav');
            const mobileBottomNav = document.getElementById('mobileBottomNav');
            _detenerPulsacionesTarjetas();
            mainApp.style.display = 'block';
            mainApp.style.opacity = '0';
            if (mainNav) { mainNav.style.display = 'block'; mainNav.style.opacity = '0'; }
            if (window.innerWidth <= 768) {
                if (mobileBottomNav) { mobileBottomNav.style.display = 'block'; mobileBottomNav.style.position = 'fixed'; mobileBottomNav.style.bottom = '0'; mobileBottomNav.style.top = 'auto'; }
            } else {
                if (mobileBottomNav) mobileBottomNav.style.display = 'none';
            }
            showTab(tabId, null);
            if (typeof calculate === 'function') calculate();
            welcome.style.display = 'none';
            welcome.style.opacity = '';
            mainApp.style.opacity = '1';
            if (mainNav) mainNav.style.opacity = '1';
            setTimeout(() => { if (typeof initTooltips === 'function') initTooltips(); }, 100);
        };

        function _detenerPulsacionesTarjetas() {}

        function _welcomeGo(tabId) {
            try {
                const visits = JSON.parse(localStorage.getItem('_welcomeVisits') || '{}');
                visits[tabId] = (visits[tabId] || 0) + 1;
                localStorage.setItem('_welcomeVisits', JSON.stringify(visits));
            } catch(e) {}
            const welcome      = document.getElementById('welcome-screen');
            const mainApp      = document.getElementById('main-app');
            const mainNav      = document.querySelector('nav');
            const mobileBottomNav = document.getElementById('mobileBottomNav');
            _welcomeGoNow(tabId, welcome, mainApp, mainNav, mobileBottomNav);
        }

        function _welcomeSortGrid() {
            try {
                const visits = JSON.parse(localStorage.getItem('_welcomeVisits') || '{}');
                const grid = document.getElementById('welcomeGrid');
                if (!grid) return;
                const cards = Array.from(grid.querySelectorAll('.welcome-nav-card'));
                cards.sort((a, b) => {
                    const idA = (a.getAttribute('onclick') || '').match(/'([^']+)'/)?.[1] || '';
                    const idB = (b.getAttribute('onclick') || '').match(/'([^']+)'/)?.[1] || '';
                    return (visits[idB] || 0) - (visits[idA] || 0);
                });
                cards.forEach(c => grid.appendChild(c));
            } catch(e) {}
        }

        function _welcomeGoNow(tabId, welcome, mainApp, mainNav, mobileBottomNav) {
            _detenerPulsacionesTarjetas();
            try { sessionStorage.setItem('_lastTab', tabId); } catch(e) {}
            welcome.style.display = 'none';
            welcome.style.transition = '';
            welcome.style.opacity = '';
            mainApp.style.display = 'block';
            mainApp.style.opacity = '1';
            if (mainNav) { mainNav.style.display = 'block'; mainNav.style.opacity = '1'; }
            if (window.innerWidth <= 768) {
                if (mobileBottomNav) { mobileBottomNav.style.display = 'block'; mobileBottomNav.style.position = 'fixed'; mobileBottomNav.style.bottom = '0'; mobileBottomNav.style.top = 'auto'; }
            } else {
                if (mobileBottomNav) mobileBottomNav.style.display = 'none';
            }
            showTab(tabId, null);
            if (typeof calculate === 'function') calculate();
            setTimeout(() => { if (typeof initTooltips === 'function') initTooltips(); }, 100);
        };
        function sincronizarTituloMobile() {
            const titulo = document.getElementById('tituloApp').value;
            const tituloMobile = document.getElementById('tituloMobile');
            if (tituloMobile) {
                tituloMobile.textContent = titulo;
            }
        }
        
        function sincronizarSubtituloMobile() {
            const subtitulo = document.getElementById('subtituloApp').value;
            const subtituloMobile = document.getElementById('subtituloMobile');
            if (subtituloMobile) {
                subtituloMobile.textContent = subtitulo;
            }
        }
        
        function sincronizarIconoMobile() {
            const iconoPrincipal = document.querySelector('#iconoPrincipalContainer .material-symbols-rounded');
            const iconoMobile = document.querySelector('#iconoPrincipalMobile .material-symbols-rounded');
            if (iconoPrincipal && iconoMobile) {
                if (iconoMobile) { iconoMobile.textContent = iconoPrincipal.textContent; }
            }
        }
        window.addEventListener('load', function() {
            const tituloApp = document.getElementById('tituloApp');
            const subtituloApp = document.getElementById('subtituloApp');
            if (tituloApp) tituloApp.value = 'seniorplazapp.';
            if (subtituloApp) subtituloApp.value = 'DASHBOARD PERSONAL';
            sincronizarTituloMobile();
            sincronizarSubtituloMobile();
            sincronizarIconoMobile();
        });
        function formatDonInput(input) {
            const raw = input.value;
            if (/,$/.test(raw) || /,\d?$/.test(raw)) return;
            const parts = raw.replace(/\./g, '').split(',');
            const intPart = parts[0].replace(/[^0-9]/g, '');
            const decPart = parts[1] !== undefined ? ',' + parts[1].replace(/[^0-9]/g, '').slice(0, 2) : '';
            if (intPart === '' && decPart === '') { input.value = ''; return; }
            const num = parseInt(intPart || '0', 10);
            input.value = (!isNaN(num) ? num.toLocaleString('es-ES') : '0') + decPart;
        }

        function getDonValue(id) {
            const el = document.getElementById(id);
            if (!el) return 0;
            return parseMoneyInput(el.value || "0");
        }

        function autoResizeDon(input) {
            const len = input.value.length || 1;
            input.style.width = Math.min(Math.max(len * 12 + 16, 40), 180) + 'px';
        }
        window.addEventListener('load', function() {
            ['donMama','donPapa'].forEach(function(id) {
                const el = document.getElementById(id);
                if (el) autoResizeDon(el);
            });
        });
        document.addEventListener('click', function(e) {
            const cardReforma = e.target.closest('.reforma-preview-card[data-tipo-reforma]');
            if (!cardReforma && !e.target.closest('#filtros-bar')) {
                document.querySelectorAll('.reforma-preview-card[data-tipo-reforma].active-card').forEach(c => c.classList.remove('active-card'));
            }
        });

        function autoResizeMoneyInput(input) {
            const val = input.value || '0';
            const len = val.length || 1;
            if (window.innerWidth <= 640) {
                input.setAttribute('size', Math.max(len, 2));
                input.style.width = '';  // dejar que size controle el ancho
            } else {
                input.removeAttribute('size');
                input.style.width = Math.min(Math.max(len * 9 + 16, 40), 110) + 'px';
            }
        }
        document.addEventListener('input', function(e) {
            const cls = e.target.className || '';
            if (cls.includes('ingreso-simple-neto') || cls.includes('ingreso-bruto-mes') || 
                cls.includes('ingreso-neto-mes') || cls.includes('gasto-cantidad')) {
                autoResizeMoneyInput(e.target);
            }
        });
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.ingreso-simple-neto, .ingreso-bruto-mes, .ingreso-neto-mes, .gasto-cantidad').forEach(autoResizeMoneyInput);
        });
        const _moneyObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                m.addedNodes.forEach(function(node) {
                    if (node.querySelectorAll) {
                        node.querySelectorAll('.ingreso-simple-neto, .ingreso-bruto-mes, .ingreso-neto-mes, .gasto-cantidad').forEach(autoResizeMoneyInput);
                    }
                });
            });
        });
        document.addEventListener('DOMContentLoaded', function() {
            _moneyObserver.observe(document.body, { childList: true, subtree: true });
        });
        window.addEventListener('resize', function() {
            document.querySelectorAll('.ingreso-simple-neto, .ingreso-bruto-mes, .ingreso-neto-mes, .gasto-cantidad').forEach(autoResizeMoneyInput);
        });
        ;(function() {
            let _touchCard = null;
            let _touchMoved = false;
            let _touchStartX = 0;
            let _touchStartY = 0;

            function activarCard(card) {
                if (_touchCard && _touchCard !== card) desactivarCard(_touchCard);
                _touchCard = card;
                card.classList.add('touch-active');
            }
            function desactivarCard(card) {
                if (!card) return;
                card.classList.remove('touch-active');
                if (_touchCard === card) _touchCard = null;
            }

            ['listaReformas','listaMobiliario'].forEach(function(id) {
                const lista = document.getElementById(id);
                if (!lista) return;

                lista.addEventListener('touchstart', function(e) {
                    const card = e.target.closest('.reforma-preview-card');
                    if (!card) return;
                    _touchMoved = false;
                    _touchStartX = e.touches[0].clientX;
                    _touchStartY = e.touches[0].clientY;
                    activarCard(card);
                }, { passive: true });

                lista.addEventListener('touchmove', function(e) {
                    const dx = Math.abs(e.touches[0].clientX - _touchStartX);
                    const dy = Math.abs(e.touches[0].clientY - _touchStartY);
                    if (dx > 8 || dy > 8) _touchMoved = true;
                }, { passive: true });

                lista.addEventListener('touchend', function() {
                    setTimeout(function() {
                        if (_touchCard) desactivarCard(_touchCard);
                    }, 400);
                }, { passive: true });

                lista.addEventListener('touchcancel', function() {
                    if (_touchCard) desactivarCard(_touchCard);
                }, { passive: true });
            });
        })();
    
