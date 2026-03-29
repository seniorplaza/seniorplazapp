
window._mceCategoryId = null;
window._mceCategoryIsIncome = false;

function _mceIrAOperaciones() {
    const catId = window._mceCategoryId;
    document.getElementById('modalCatEst').style.display = 'none';
    if (window._filtroOp) {
        window._filtroOp.cuentas = null;
        window._filtroOp.tipos = null;
        window._filtroOp.etiquetas = null;
        window._filtroOp.nota = '';
        window._filtroOp.categorias = catId ? new Set([catId]) : null;
    }
    if (typeof showTab === 'function') showTab('finanzas-operaciones', null);
    setTimeout(function() {
        if (typeof aplicarFiltroOp === 'function') aplicarFiltroOp();
    }, 50);
}

function _abrirModalCatEst(data) {
    const m = document.getElementById('modalCatEst');
    window._mceCategoryId = data.categoryId || null;
    window._mceCategoryIsIncome = data.isIncome || false;
    if (window._estNavDesde && window._estNavHasta) {
        window._mceEstDesde = window._estNavDesde;
        window._mceEstHasta = window._estNavHasta;
    } else {
        const _f = window._estFiltro || 'mes';
        const _o = window._estNavOffset || 0;
        const _n = new Date();
        if (_f === 'mes') {
            const _d = new Date(_n.getFullYear(), _n.getMonth() + _o, 1);
            window._mceEstDesde = new Date(_d.getFullYear(), _d.getMonth(), 1);
            window._mceEstHasta = new Date(_d.getFullYear(), _d.getMonth() + 1, 0, 23, 59, 59, 999);
        } else if (_f === 'ano') {
            const _y = _n.getFullYear() + _o;
            window._mceEstDesde = new Date(_y, 0, 1);
            window._mceEstHasta = new Date(_y, 11, 31, 23, 59, 59, 999);
        } else if (_f === 'semana') {
            const _l = new Date(_n); _l.setDate(_n.getDate() - ((_n.getDay()+6)%7) + _o*7); _l.setHours(0,0,0,0);
            window._mceEstDesde = _l;
            window._mceEstHasta = new Date(_l); window._mceEstHasta.setDate(_l.getDate()+6); window._mceEstHasta.setHours(23,59,59,999);
        } else if (_f === 'dia') {
            const _d2 = new Date(_n); _d2.setDate(_n.getDate()+_o);
            window._mceEstDesde = new Date(_d2); window._mceEstDesde.setHours(0,0,0,0);
            window._mceEstHasta = new Date(_d2); window._mceEstHasta.setHours(23,59,59,999);
        } else if (_f === 'rango') {
            const _ed = document.getElementById('est-fecha-desde');
            const _eh = document.getElementById('est-fecha-hasta');
            window._mceEstDesde = _ed && _ed.value ? new Date(_ed.value) : null;
            window._mceEstHasta = _eh && _eh.value ? new Date(_eh.value) : null;
        } else { window._mceEstDesde = null; window._mceEstHasta = null; }
    }
    window._mceEstLabel = (document.getElementById('est-intervalo-label') || {}).textContent || '';
    window._mceEstFiltro = window._estFiltro || 'mes';
    const color = data.color;
    const isIncome = data.isIncome;
    const pctTotal = data.totalOfType > 0 ? Math.round(data.amount / data.totalOfType * 100) : 0;
    const fmt = n => n.toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2}) + ' €';

    const isImageOnly = data.iconContent.includes('<img');
    const iconEl = document.getElementById('mce-icon');
    iconEl.style.background = isImageOnly ? 'transparent' : color;
    iconEl.style.border = isImageOnly ? 'none' : `1.5px solid ${color}88`;
    iconEl.style.overflow = 'hidden';
    iconEl.innerHTML = data.iconContent;
    document.getElementById('mce-name').textContent = data.name;
    document.getElementById('mce-count').textContent = data.catOps.length + ' operacion' + (data.catOps.length !== 1 ? 'es' : '');

    const amountEl = document.getElementById('mce-amount');
    amountEl.innerHTML = `<div style="text-align:right;">
        <div style="color:${isIncome?'#10b981':'#ef4444'};font-size:20px;font-weight:900;font-family:Manrope,sans-serif;">${isIncome?'+':'-'}${fmt(data.amount)}</div>
        <div style="color:#64748b;font-size:11px;font-weight:700;margin-top:2px;">${pctTotal}% del total</div>
    </div>`;
    const etWrap = document.getElementById('mce-etiquetas-wrap');
    const etEl = document.getElementById('mce-etiquetas');
    if (data.etiquetas.length > 0) {
        etEl.innerHTML = data.etiquetas.map(et =>
            `<span style="background:${color}22;color:${color};border:1px solid ${color}55;border-radius:20px;padding:4px 10px;font-size:12px;font-weight:700;">${et}</span>`
        ).join('');
        etWrap.style.display = 'block';
    } else {
        etWrap.style.display = 'none';
    }
    const opsEl = document.getElementById('mce-ops');
    opsEl.innerHTML = '';
    const _getOpKeys = op => {
        const keys = [];
        if (op.subtag) keys.push(op.subtag);
        (op.etiquetas||[]).forEach(et => { if (!keys.includes(et)) keys.push(et); });
        return keys.length > 0 ? keys : ['__sin__'];
    };

    const todasClaves = [...new Set(data.catOps.flatMap(op => _getOpKeys(op).filter(k => k !== '__sin__')))];
    const opsSinEtiqueta = data.catOps.filter(op => _getOpKeys(op)[0] === '__sin__');

    const grupos = {};
    todasClaves.forEach(clave => {
        const opsEt = data.catOps.filter(op => _getOpKeys(op).includes(clave));
        grupos[clave] = { ops: opsEt, total: opsEt.reduce((s,o) => s + o.amount, 0) };
    });
    if (opsSinEtiqueta.length > 0) {
        grupos['__sin__'] = { ops: opsSinEtiqueta, total: opsSinEtiqueta.reduce((s,o) => s + o.amount, 0) };
    }

    const grupoKeys = Object.keys(grupos);
    const hayEtiquetas = todasClaves.length > 0;

    if (!hayEtiquetas) {
        opsEl.innerHTML = data.catOps.map(op => {
            const fecha = new Date(op.date).toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'2-digit'});
            const pctOp = data.amount > 0 ? Math.round(op.amount / data.amount * 100) : 0;
            const etStr = (op.etiquetas||[]).map(et =>
                `<span style="background:${color}22;color:${color};border:1px solid ${color}44;border-radius:20px;padding:3px 8px;font-size:11px;font-weight:700;">${et}</span>`
            ).join('');
            const subtagStr = op.subtag ? `<span style="background:${color}22;color:${color};border:1px solid ${color}44;border-radius:20px;padding:3px 8px;font-size:11px;font-weight:700;">${op.subtag}</span>` : '';
            const tieneChips = etStr || subtagStr;
            return `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);gap:10px;">
                <div style="flex:1;min-width:0;">
                    ${tieneChips ? `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:3px;">${subtagStr}${etStr}</div>` : ''}
                    ${op.comment ? `<div style="color:#e2e8f0;font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${op.comment}</div>` : ''}
                    <div style="color:#475569;font-size:10px;margin-top:2px;">${fecha}</div>
                </div>
                <div style="flex-shrink:0;text-align:right;">
                    <div style="color:${isIncome?'#10b981':'#ef4444'};font-size:13px;font-weight:800;font-family:Manrope,sans-serif;">${fmt(op.amount)}</div>
                    <div style="color:#64748b;font-size:10px;margin-top:1px;">${pctOp}%</div>
                </div>
            </div>`;
        }).join('');
    } else {
        grupoKeys.forEach((etKey, gi) => {
            const grupo = grupos[etKey];
            const esSinEtiqueta = etKey === '__sin__';
            const etLabel = esSinEtiqueta ? 'Sin etiqueta' : etKey;
            const pctGrupo = data.amount > 0 ? Math.round(grupo.total / data.amount * 100) : 0;
            const grupoId = 'mce-grp-' + gi;

            const wrapper = document.createElement('div');
            wrapper.style.cssText = `border:1px solid ${esSinEtiqueta ? 'rgba(255,255,255,0.08)' : color+'44'};border-radius:14px;overflow:hidden;flex:1;`;
            const header = document.createElement('div');
            header.style.cssText = `display:flex;align-items:center;justify-content:space-between;padding:11px 14px;cursor:pointer;background:${esSinEtiqueta ? 'rgba(255,255,255,0.03)' : color+'15'};gap:10px;`;
            header.innerHTML = `
                <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">
                    <span style="background:${esSinEtiqueta?'rgba(71,85,105,0.3)':color+'33'};color:${esSinEtiqueta?'#64748b':color};border:1px solid ${esSinEtiqueta?'rgba(71,85,105,0.4)':color+'55'};border-radius:20px;padding:3px 10px;font-size:12px;font-weight:700;white-space:nowrap;">${etLabel}</span>
                    <span style="color:#64748b;font-size:11px;font-weight:600;">${grupo.ops.length} op · ${pctGrupo}%</span>
                </div>
                <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
                    <span style="color:${isIncome?'#10b981':'#ef4444'};font-size:13px;font-weight:800;font-family:Manrope,sans-serif;">${fmt(grupo.total)}</span>
                    <span class="material-symbols-rounded" id="${grupoId}-chev" style="font-size:18px;color:#475569;transition:transform 0.2s;">expand_more</span>
                </div>`;
            const body = document.createElement('div');
            body.id = grupoId;
            body.style.cssText = 'display:none;';
            const opsHTML = grupo.ops.map(op => {
                const fecha = new Date(op.date).toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'2-digit'});
                const pctOp = data.amount > 0 ? Math.round(op.amount / data.amount * 100) : 0;
                const etStr = (op.etiquetas||[]).map(et =>
                    `<span style="background:${color}22;color:${color};border:1px solid ${color}44;border-radius:20px;padding:3px 8px;font-size:11px;font-weight:700;">${et}</span>`
                ).join('');
                const subtagStr = op.subtag ? `<span style="background:${color}22;color:${color};border:1px solid ${color}44;border-radius:20px;padding:3px 8px;font-size:11px;font-weight:700;">${op.subtag}</span>` : '';
                const tieneChips = etStr || subtagStr;
                return `<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 14px;border-top:1px solid rgba(255,255,255,0.05);gap:10px;">
                    <div style="flex:1;min-width:0;">
                        ${tieneChips ? `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:3px;">${subtagStr}${etStr}</div>` : ''}
                        ${op.comment ? `<div style="color:#e2e8f0;font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${op.comment}</div>` : ''}
                        <div style="color:#475569;font-size:10px;margin-top:2px;">${fecha}</div>
                    </div>
                    <div style="flex-shrink:0;text-align:right;">
                        <div style="color:${isIncome?'#10b981':'#ef4444'};font-size:13px;font-weight:800;font-family:Manrope,sans-serif;">${fmt(op.amount)}</div>
                        <div style="color:#64748b;font-size:10px;margin-top:1px;">${pctOp}%</div>
                    </div>
                </div>`;
            }).join('');

            body.innerHTML = opsHTML;
            header.addEventListener('click', function() {
                const isOpen = body.style.display !== 'none';
                body.style.display = isOpen ? 'none' : 'block';
                const chev = document.getElementById(grupoId + '-chev');
                if (chev) chev.style.transform = isOpen ? '' : 'rotate(180deg)';
            });

            wrapper.appendChild(header);
            wrapper.appendChild(body);

            const row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;';
            row.appendChild(wrapper);
            if (!esSinEtiqueta) {
                const btnOp = document.createElement('button');
                btnOp.style.cssText = 'flex-shrink:0;width:36px;height:36px;border-radius:12px;background:#1a2030;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;';
                btnOp.innerHTML = '<span class="material-symbols-rounded" style="font-size:20px;color:#94a3b8;">receipt</span>';
                btnOp.title = 'Ver en Operaciones';
                btnOp.addEventListener('click', function() { _mceIrAOperacionesConEtiqueta(etKey); });
                row.appendChild(btnOp);
            }
            opsEl.appendChild(row);
        });
    }

    m.style.display = 'flex';
}

function _mceIrAOperacionesConEtiqueta(etiqueta) {
    const catId = window._mceCategoryId;
    document.getElementById('modalCatEst').style.display = 'none';
    if (window._filtroOp) {
        window._filtroOp.cuentas = null;
        window._filtroOp.tipos = null;
        window._filtroOp.nota = '';
        window._filtroOp.categorias = catId ? new Set([catId]) : null;
        window._filtroOp.etiquetas = etiqueta ? new Set([etiqueta]) : null;
    }
    if (window._mceEstDesde && window._mceEstHasta) {
        window._opNavDesde = window._mceEstDesde;
        window._opNavHasta = window._mceEstHasta;
        window._opNavOffset = 0;
    } else {
        window._opNavDesde = null;
        window._opNavHasta = null;
        window._opNavOffset = 0;
        if (typeof setOpFiltro === 'function') setOpFiltro(window._mceEstFiltro || 'todo', window._mceEstLabel || 'Todo');
        else window._opFiltro = window._mceEstFiltro || 'todo';
    }
    const labelEl = document.getElementById('op-intervalo-label');
    if (labelEl && window._mceEstLabel) labelEl.textContent = window._mceEstLabel;
    if (typeof showTab === 'function') showTab('finanzas-operaciones', null);
    setTimeout(function() {
        if (window._mceEstDesde && window._mceEstHasta) {
            window._opNavDesde = window._mceEstDesde;
            window._opNavHasta = window._mceEstHasta;
        }
        const lbl = document.getElementById('op-intervalo-label');
        if (lbl && window._mceEstLabel) lbl.textContent = window._mceEstLabel;
        if (typeof renderHistorialOperaciones === 'function') renderHistorialOperaciones();
    }, 80);
}

