
(function(){
    window._filtroOp = {
        cuentas: null,      // null = todas, o Set de índices
        categorias: null,   // null = todas, o Set de ids
        tipos: null,        // null = todos, o Set de strings
        etiquetas: null,    // null = todas, o Set de strings
        nota: ''            // string para buscar en note
    };
    window.abrirModalFiltroOp = function() {
        _renderFiltroOp();
        const overlay = document.getElementById('modal-filtro-op-overlay');
        const panel   = document.getElementById('modal-filtro-op-panel');
        panel.style.maxHeight = Math.floor(window.innerHeight * 0.88) + 'px';
        overlay.style.display = 'block';
        panel.style.display   = 'block';
        requestAnimationFrame(() => {
            panel.style.transform = 'translate(-50%,-50%)';
            panel.style.opacity   = '1';
            overlay.style.opacity = '1';
        });
    };
    window.cerrarModalFiltroOp = function() {
        const panel   = document.getElementById('modal-filtro-op-panel');
        const overlay = document.getElementById('modal-filtro-op-overlay');
        panel.style.transform = 'translate(-50%,-60%)';
        panel.style.opacity   = '0';
        overlay.style.opacity = '0';
        setTimeout(() => {
            panel.style.display   = 'none';
            overlay.style.display = 'none';
        }, 320);
    };
    function _renderFiltroOp() {
        const fd = window.finanzasData;
        if (!fd) return;
        setTimeout(_actualizarBadgeFiltro, 0);
        const cuentasEl = document.getElementById('filtro-op-cuentas');
        cuentasEl.innerHTML = '';
        const cuentasList = typeof _getCuentasTraspaso === 'function' ? _getCuentasTraspaso() : [];
        const cuentasActivas = window._filtroOp.cuentas;
        const btnTodas = _crearFilaFiltro('account_balance_wallet','#60a5fa','Todas las cuentas', cuentasActivas === null, () => {
            window._filtroOp.cuentas = null;
            _renderFiltroOp();
        });
        cuentasEl.appendChild(btnTodas);
        cuentasList.forEach(cuenta => {
            const idx = cuenta.idx;
            const nombre = cuenta.nombre;
            const iconData = cuenta.thumb;
            const sel = cuentasActivas !== null && cuentasActivas.has(idx);
            const btn = _crearFilaFiltroConThumb(iconData, nombre, sel, () => {
                if (window._filtroOp.cuentas === null) window._filtroOp.cuentas = new Set();
                const s = window._filtroOp.cuentas;
                if (s.has(idx)) s.delete(idx); else s.add(idx);
                if (s.size === 0) window._filtroOp.cuentas = null;
                _renderFiltroOp();
            });
            cuentasEl.appendChild(btn);
        });
        if (cuentasList.length === 0) {
            cuentasEl.innerHTML += '<div style="color:#475569;font-size:12px;padding:8px 4px;">Sin cuentas registradas</div>';
        }
        const catEl = document.getElementById('filtro-op-categorias');
        catEl.innerHTML = '';
        const catActivas = window._filtroOp.categorias;
        const etiqActivas = window._filtroOp.etiquetas;

        (fd.categorias || []).forEach(cat => {
            const selCat = catActivas !== null && catActivas.has(cat.id);
            const tags = cat.tags || [];
            const color = cat.color || '#94a3b8';
            const wrap = document.createElement('div');
            wrap.style.cssText = `border-radius:12px;overflow:hidden;border:1px solid ${selCat ? color+'55' : 'rgba(51,65,85,0.3)'};background:${selCat ? color+'0d' : 'rgba(15,23,42,0.5)'};transition:border-color 0.15s;`;
            const rowCat = document.createElement('div');
            rowCat.style.cssText = 'display:flex;align-items:center;gap:10px;padding:11px 14px;cursor:pointer;';
            const leftPart = document.createElement('div');
            leftPart.style.cssText = 'display:flex;align-items:center;gap:10px;flex:1;min-width:0;';
            const thumbHtml = cat?.svgData
                ? `<div style="width:28px;height:28px;border-radius:8px;background:${color};display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg viewBox="${cat.svgData.vb}" width="16" height="16" style="fill:white;display:block;" xmlns="http://www.w3.org/2000/svg">${cat.svgData.svg}</svg></div>`
                : `<div style="width:28px;height:28px;border-radius:8px;background:${color};display:flex;align-items:center;justify-content:center;flex-shrink:0;"><span class="material-symbols-rounded" style="font-size:17px;color:white;line-height:1;display:flex;">${cat.icon||'label'}</span></div>`;
            leftPart.innerHTML = `
                ${thumbHtml}
                <span style="color:white;font-size:14px;font-weight:600;flex:1;">${cat.name}</span>
                <span style="width:20px;height:20px;border-radius:50%;background:#3b82f6;flex-shrink:0;display:${selCat?'flex':'none'};align-items:center;justify-content:center;"><span class="material-symbols-rounded" style="font-size:14px;color:white;line-height:1;">check</span></span>
            `;
            leftPart.addEventListener('click', () => {
                if (window._filtroOp.categorias === null) window._filtroOp.categorias = new Set();
                const s = window._filtroOp.categorias;
                if (s.has(cat.id)) s.delete(cat.id); else s.add(cat.id);
                if (s.size === 0) window._filtroOp.categorias = null;
                _renderFiltroOp();
            });

            rowCat.appendChild(leftPart);
            if (tags.length > 0) {
                const tagsBadge = document.createElement('span');
                const selTagCount = tags.filter(t => etiqActivas && etiqActivas.has(t)).length;
                if (selTagCount > 0) {
                    tagsBadge.textContent = selTagCount;
                    tagsBadge.style.cssText = `background:${color};color:white;font-size:10px;font-weight:800;min-width:18px;height:18px;border-radius:9px;padding:0 4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-right:4px;`;
                    rowCat.appendChild(tagsBadge);
                }
                const arrow = document.createElement('span');
                arrow.className = 'material-symbols-rounded';
                arrow.style.cssText = `font-size:18px;color:#475569;opacity:0.8;flex-shrink:0;transition:transform 0.2s;cursor:pointer;`;
                arrow.textContent = 'expand_more';
                arrow.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const body = wrap.querySelector('.cat-tags-body');
                    const open = body.style.display !== 'none';
                    body.style.display = open ? 'none' : 'block';
                    arrow.style.transform = open ? '' : 'rotate(180deg)';
                });
                rowCat.appendChild(arrow);
                const tagsBody = document.createElement('div');
                tagsBody.className = 'cat-tags-body';
                tagsBody.style.cssText = `display:none;padding:0 12px 10px 12px;display:flex;flex-wrap:wrap;gap:6px;display:none;`;
                tags.forEach(tag => {
                    const selTag = etiqActivas !== null && etiqActivas.has(tag);
                    const chip = document.createElement('button');
                    chip.style.cssText = `display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.15s;border:1px solid ${selTag ? color : color+'55'};background:${selTag ? color+'33' : color+'11'};color:${color};line-height:1;`;
                    chip.innerHTML = `
                        <span class="material-symbols-rounded" style="font-size:13px;line-height:1;flex-shrink:0;">${selTag ? 'check' : 'label'}</span>
                        <span style="line-height:1;white-space:nowrap;">${tag}</span>
                    `;
                    chip.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (window._filtroOp.etiquetas === null) window._filtroOp.etiquetas = new Set();
                        const s = window._filtroOp.etiquetas;
                        if (s.has(tag)) s.delete(tag); else s.add(tag);
                        if (s.size === 0) window._filtroOp.etiquetas = null;
                        _renderFiltroOp();
                    });
                    tagsBody.appendChild(chip);
                });
                wrap.appendChild(rowCat);
                wrap.appendChild(tagsBody);
            } else {
                wrap.appendChild(rowCat);
            }

            catEl.appendChild(wrap);
        });

        if ((fd.categorias || []).length === 0) {
            catEl.innerHTML = '<div style="color:#475569;font-size:12px;padding:8px 4px;">Sin categorías registradas</div>';
        }
        const tiposActivos = window._filtroOp.tipos;
        ['EXPENSE','INCOME','TRANSFER','ADJUST'].forEach(t => {
            const btn = document.getElementById('ftipo-' + t);
            if (!btn) return;
            if (tiposActivos === null || tiposActivos.has(t)) {
                btn.classList.add('activo');
            } else {
                btn.classList.remove('activo');
            }
        });
        const notaInput = document.getElementById('filtro-op-nota-input');
        if (notaInput && notaInput !== document.activeElement) {
            notaInput.value = window._filtroOp.nota || '';
        }
    }

    function _crearFilaFiltro(icono, color, label, activo, cb) {
        const btn = document.createElement('button');
        btn.className = 'filtro-op-row' + (activo ? ' activo' : '');
        btn.innerHTML = `
            <span class="material-symbols-rounded" style="font-size:20px;color:${color};">${icono}</span>
            <span style="flex:1;color:white;font-size:14px;font-weight:600;">${label}</span>
            <span class="filtro-check" style="${activo?'width:20px;height:20px;border-radius:50%;background:#3b82f6;flex-shrink:0;display:flex;align-items:center;justify-content:center;':'display:none;width:20px;height:20px;border-radius:50%;background:#3b82f6;flex-shrink:0;align-items:center;justify-content:center;'}"><span class="material-symbols-rounded" style="font-size:14px;color:white;line-height:1;">check</span></span>
        `;
        btn.addEventListener('click', cb);
        return btn;
    }

    function _crearFilaFiltroConThumb(thumb, label, activo, cb) {
        const btn = document.createElement('button');
        btn.className = 'filtro-op-row' + (activo ? ' activo' : '');
        let thumbHtml = '';
        if (thumb && thumb.tipo === 'img') {
            thumbHtml = `<img src="${thumb.src}" style="width:28px;height:28px;border-radius:8px;object-fit:cover;flex-shrink:0;">`;
        } else {
            const icono = (thumb && thumb.icon) ? thumb.icon : 'account_balance';
            const color = (thumb && thumb.color) ? thumb.color : '#94a3b8';
            thumbHtml = `<span class="material-symbols-rounded" style="font-size:20px;color:${color};flex-shrink:0;">${icono}</span>`;
        }
        btn.innerHTML = `
            ${thumbHtml}
            <span style="flex:1;color:white;font-size:14px;font-weight:600;">${label}</span>
            <span class="filtro-check" style="${activo?'width:20px;height:20px;border-radius:50%;background:#3b82f6;flex-shrink:0;display:flex;align-items:center;justify-content:center;':'display:none;width:20px;height:20px;border-radius:50%;background:#3b82f6;flex-shrink:0;align-items:center;justify-content:center;'}"><span class="material-symbols-rounded" style="font-size:14px;color:white;line-height:1;">check</span></span>
        `;
        btn.addEventListener('click', cb);
        return btn;
    }
    window.toggleFiltroTipo = function(tipo) {
        if (window._filtroOp.tipos === null) {
            window._filtroOp.tipos = new Set([tipo]);
        } else {
            const s = window._filtroOp.tipos;
            if (s.has(tipo)) { s.delete(tipo); if (s.size === 0) window._filtroOp.tipos = null; }
            else { s.add(tipo); if (s.size === 4) window._filtroOp.tipos = null; }
        }
        _renderFiltroOp();
    };
    window.aplicarFiltroOp = function() {
        cerrarModalFiltroOp();
        renderHistorialOperaciones();
        _actualizarBadgeFiltro();
    };
    window.restablecerFiltroOp = function() {
        window._filtroOp = { cuentas: null, categorias: null, tipos: null, etiquetas: null, nota: '' };
        const notaInput = document.getElementById('filtro-op-nota-input');
        if (notaInput) notaInput.value = '';
        _renderFiltroOp();
        renderHistorialOperaciones();
        _actualizarBadgeFiltro();
        cerrarModalFiltroOp();
    };
    function _actualizarBadgeFiltro() {
        const f = window._filtroOp;
        const activo = f.cuentas !== null || f.categorias !== null || f.tipos !== null || f.etiquetas !== null || (f.nota && f.nota.length > 0);
        ['filtro-op-badge','filtro-op-badge-mobile'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = activo ? 'block' : 'none';
        });
        ['btn-filtro-op','btn-filtro-op-mobile'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (activo) {
                el.style.borderColor = '';
                el.style.background  = '';
                el.style.animation   = '';
            } else {
                el.style.borderColor = '';
                el.style.background  = '';
                el.style.animation   = '';
            }
        });
        const bc = document.getElementById('filtro-badge-cuentas');
        if (bc) { const n = f.cuentas ? f.cuentas.size : 0; bc.textContent = n; bc.style.display = n ? 'flex' : 'none'; }
        const bcat = document.getElementById('filtro-badge-categorias');
        if (bcat) { const n = f.categorias ? f.categorias.size : 0; bcat.textContent = n; bcat.style.display = n ? 'flex' : 'none'; }
        const bt = document.getElementById('filtro-badge-tipos');
        if (bt) { const n = f.tipos ? f.tipos.size : 0; bt.textContent = n; bt.style.display = n ? 'flex' : 'none'; }
        const be = document.getElementById('filtro-badge-etiquetas');
        if (be) { const n = f.etiquetas ? f.etiquetas.size : 0; be.textContent = n; be.style.display = n ? 'flex' : 'none'; }
        const bn = document.getElementById('filtro-badge-nota');
        if (bn) { bn.style.display = (f.nota && f.nota.length > 0) ? 'flex' : 'none'; }
    }

    window._actualizarBadgeFiltroNota = _actualizarBadgeFiltro;
    const _origRender = window.renderHistorialOperaciones;
    window.renderHistorialOperaciones = function() {
        if (!window.finanzasData) return;
        const f = window._filtroOp;
        const _origFiltrar = window.filtrarOperacionesPorPeriodo;
        const _wrappedFiltrar = function(ops, ...args) {
            let result = _origFiltrar(ops, ...args);
            if (f.cuentas !== null) {
                result = result.filter(op =>
                    f.cuentas.has(op.accountId) ||
                    f.cuentas.has(op.toAccountId) ||
                    f.cuentas.has(op.fromAccountId)
                );
            }
            if (f.categorias !== null) {
                result = result.filter(op => f.categorias.has(op.categoryId));
            }
            if (f.tipos !== null) {
                result = result.filter(op => f.tipos.has(op.type));
            }
            if (f.etiquetas !== null) {
                result = result.filter(op => op.subtag && f.etiquetas.has(op.subtag));
            }
            if (f.nota && f.nota.length > 0) {
                result = result.filter(op => (op.comment && op.comment.toLowerCase().includes(f.nota)) || (op.note && op.note.toLowerCase().includes(f.nota)));
            }
            return result;
        };
        const backup = window.filtrarOperacionesPorPeriodo;
        window.filtrarOperacionesPorPeriodo = _wrappedFiltrar;
        _origRender();
        window.filtrarOperacionesPorPeriodo = backup;
    };

})();

