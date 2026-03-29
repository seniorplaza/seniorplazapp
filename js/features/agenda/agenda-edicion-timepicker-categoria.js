
window._editTimePickerTarget = null; // 'habito' | 'tarea'

function _editAbrirTimePicker(target) {
    window._editTimePickerTarget = target;
    const hora = target === 'habito' ? (window._editHabitoHora || '') : (window._editTareaHora || '');
    if (hora) {
        const [hh, mm] = hora.split(':').map(Number);
        window._tp = { h: hh || 0, m: mm || 0 };
    } else {
        const now = new Date();
        window._tp = { h: now.getHours(), m: Math.floor(now.getMinutes()/5)*5 };
    }
    window._tpConfirmarOrig = window._tpConfirmarOrig || window.tpConfirmar;
    window.tpConfirmar = function() {
        const hh = String(window._tp.h).padStart(2,'0');
        const mm = String(window._tp.m).padStart(2,'0');
        const horaStr = hh + ':' + mm;
        const t = window._editTimePickerTarget;
        window._editPickerHora = horaStr;
        if (t === 'habito') { window._editHabitoHora = horaStr; _editActualizarHoraDisp('habito'); }
        else if (t === 'tarea') { window._editTareaHora = horaStr; _editActualizarHoraDisp('tarea'); }
        else { window._tpConfirmarOrig && window._tpConfirmarOrig(); }
        document.getElementById('modalTimePicker').style.display = 'none';
        window._editTimePickerTarget = null;
        window.tpConfirmar = function() {
            const hh2 = String(window._tp.h).padStart(2,'0');
            const mm2 = String(window._tp.m).padStart(2,'0');
            window._timePickerHora = hh2+':'+mm2;
            const display = document.getElementById('actRecordatorioDisplay');
            if (display) { display.textContent = window._timePickerHora; display.style.color = '#f1f5f9'; }
            document.getElementById('modalTimePicker').style.display = 'none';
            actAddRecordatorio();
        };
    };
    abrirTimePickerRecordatorio._orig ? abrirTimePickerRecordatorio._orig() : abrirTimePickerRecordatorio();
    _tpRender && _tpRender();
}

function _editClearHora(target) {
    if (target === 'habito') { window._editHabitoHora = ''; _editActualizarHoraDisp('habito'); }
    else { window._editTareaHora = ''; _editActualizarHoraDisp('tarea'); }
}

function _editActualizarHoraDisp(target) {
    const hora = target === 'habito' ? window._editHabitoHora : window._editTareaHora;
    const dispId = target === 'habito' ? 'editHabitoHoraDisp' : 'editTareaHoraDisp';
    const clearId = target === 'habito' ? 'editHabitoHoraClear' : 'editTareaHoraClear';
    const disp = document.getElementById(dispId);
    const clearBtn = document.getElementById(clearId);
    if (disp) { disp.textContent = hora || 'Añadir hora...'; disp.style.color = hora ? '#f1f5f9' : '#64748b'; }
    if (clearBtn) clearBtn.style.display = 'none'; // ya no se usa clear, se usa remove por item
}

function _editRenderCatDropdown(target) {
    const containerId = target === 'habito' ? 'editHabitoCatContainer' : 'editTareaCatContainer';
    const cont = document.getElementById(containerId);
    if (!cont) return;
    const catIdKey = target === 'habito' ? '_editHabitoCatId' : '_editTareaCatId';
    const etqKey   = target === 'habito' ? '_editHabitoEtiqueta' : '_editTareaEtiqueta';
    const selId = window[catIdKey] || null;
    const cats = (window.finanzasData && window.finanzasData.categorias) || [];
    let selCat = (selId && selId !== '__fake__') ? (cats.find(c => c.id === selId) || null) : null;
    if (!selCat) {
        const catObjKey = target === 'habito' ? '_editHabitoCatObj' : '_editTareaCatObj';
        if (window[catObjKey]) selCat = _editCatObjectToFake(window[catObjKey]);
    }
    const bgColor = selCat ? selCat.color : '#334155';
    const icon    = selCat ? selCat.icon  : 'category';
    const nombre  = selCat ? selCat.name  : 'Sin categoría';
    const selTag  = window[etqKey] || null;
    const listId  = 'editCatList_' + target;
    const chevId  = 'editCatChev_' + target;

    const _iconHtml = (c, size) => {
        if (typeof _catIconHTML === 'function') return _catIconHTML(c, size);
        return `<span class="material-symbols-rounded" style="color:${c.iconColor||'white'};font-size:${size}px;">${c.icon||'category'}</span>`;
    };
    let items = cats.map(c => {
        const isSel = c.id === selId;
        const iconH = (typeof _catIconHTML === 'function') ? _catIconHTML(c, 22)
            : `<span class="material-symbols-rounded" style="color:${c.iconColor||'white'};font-size:22px;">${c.icon||'category'}</span>`;
        return `<button onclick="_editSelCat('${target}','${c.id}')" class="modal-cat-btn-item${isSel ? ' selected' : ''}">
            <div class="modal-cat-icon-sq" style="background:${c.iconoImagen ? 'transparent' : c.color};border:none;">${iconH}</div>
            <div class="modal-cat-label">${c.name}</div>
        </button>`;
    }).join('');

    let etqHtml = '';
    if (selCat && selCat.tags && selCat.tags.length) {
        const tagBtns = selCat.tags.map(tag => {
            const active = selTag === tag;
            return `<button onclick="_editSelEtiqueta('${target}','${tag}')" style="padding:5px 12px;border-radius:20px;border:1.5px solid ${active?selCat.color:'rgba(255,255,255,0.1)'};background:${active?selCat.color+'22':'transparent'};color:${active?selCat.color:'#64748b'};font-size:12px;font-weight:700;cursor:pointer;">${tag}</button>`;
        }).join('');
        etqHtml = `<div style="margin-top:10px;"><label style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:6px;">Etiqueta</label><div style="display:flex;flex-wrap:wrap;gap:6px;">${tagBtns}</div></div>`;
    }
    const existingLabel = cont.querySelector('label');
    const labelHTML = existingLabel ? existingLabel.outerHTML : '';
    const selCatForBtn = selCat || { color: bgColor, icon: icon, iconColor: 'white' };
    cont.innerHTML = labelHTML + `
        <div style="position:relative;">
            <button onclick="_editToggleCatList('${target}')" style="display:flex;align-items:center;gap:10px;width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:12px 14px;cursor:pointer;box-sizing:border-box;">
                <div style="width:40px;height:40px;border-radius:12px;background:${selCat && selCat.iconoImagen ? 'transparent' : bgColor};display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;">${_iconHtml(selCatForBtn, 20)}</div>
                <div style="flex:1;text-align:left;"><div style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">CATEGORÍA</div><div style="color:${selCat?selCat.color:'#94a3b8'};font-size:14px;font-weight:800;">${nombre}</div></div>
                <span id="${chevId}" class="material-symbols-rounded" style="color:#64748b;font-size:20px;transition:transform 0.2s;">expand_more</span>
            </button>
            <div id="${listId}" style="display:none;margin-top:6px;background:rgba(10,18,35,0.98);border:1px solid rgba(59,130,246,0.2);border-radius:14px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.5);max-height:280px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(59,130,246,0.4) transparent;"><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:6px;">${items}</div></div>
        </div>
        ${etqHtml}`;
}

function _editToggleCatList(target) {
    const listId = 'editCatList_' + target;
    const chevId = 'editCatChev_' + target;
    const list = document.getElementById(listId);
    const chev = document.getElementById(chevId);
    if (!list) return;
    const open = list.style.display === 'none';
    list.style.display = open ? 'block' : 'none';
    if (chev) chev.style.transform = open ? 'rotate(180deg)' : '';
}

function _editSelCat(target, id) {
    const key = target === 'habito' ? '_editHabitoCatId' : '_editTareaCatId';
    const etqKey = target === 'habito' ? '_editHabitoEtiqueta' : '_editTareaEtiqueta';
    window[key] = id;
    window[etqKey] = null;
    _editRenderCatDropdown(target);
}

function _editSelEtiqueta(target, tag) {
    const key = target === 'habito' ? '_editHabitoEtiqueta' : '_editTareaEtiqueta';
    window[key] = window[key] === tag ? null : tag;
    _editRenderCatDropdown(target);
}

function _editAddRecordatorio(target) {
    const hora = window._editHabitoHora || window._editTareaHora || window._timePickerEditHora;
    const recsKey = target === 'habito' ? '_editHabitoRecs' : '_editTareaRecs';
    if (!window._editPickerHora) return;
    const h = window._editPickerHora;
    if (!window[recsKey]) window[recsKey] = [];
    if (!window[recsKey].includes(h)) {
        window[recsKey].push(h);
        window[recsKey].sort();
    }
    window._editPickerHora = null;
    window._editHabitoHora = '';
    window._editTareaHora = '';
    _editActualizarHoraDisp(target);
    _editRenderRecList(target);
}

function _editRenderRecList(target) {
    const recsKey = target === 'habito' ? '_editHabitoRecs' : '_editTareaRecs';
    const listId  = target === 'habito' ? 'editHabitoRecList' : 'editTareaRecList';
    const list = document.getElementById(listId);
    if (!list) return;
    const recs = window[recsKey] || [];
    list.innerHTML = recs.map((r, i) => `
        <div style="display:flex;align-items:center;gap:10px;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:11px;padding:10px 14px;">
            <span class="material-symbols-rounded" style="color:#60a5fa;font-size:16px;flex-shrink:0;">alarm</span>
            <span style="color:#e2e8f0;font-size:14px;font-weight:700;flex:1;">${r}</span>
            <button onclick="_editRemoveRecordatorio('${target}',${i})" style="background:none;border:none;color:#475569;cursor:pointer;padding:0;display:flex;align-items:center;" onmouseover="this.style.color='#f87171'" onmouseout="this.style.color='#475569'">
                <span class="material-symbols-rounded" style="font-size:18px;">close</span>
            </button>
        </div>`).join('');
}

function _editResolveCatId(categoria) {
    if (!categoria) return null;
    const cats = (window.finanzasData && window.finanzasData.categorias) || [];
    if (categoria.nombre) {
        const c = cats.find(c => c.name === categoria.nombre);
        if (c) return c.id;
    }
    if (categoria.icono && categoria.color) {
        const c = cats.find(c => c.icon === categoria.icono && c.color === categoria.color);
        if (c) return c.id;
    }
    if (categoria.icono) {
        const c = cats.find(c => c.icon === categoria.icono);
        if (c) return c.id;
    }
    return null;
}
function _editCatObjectToFake(categoria) {
    if (!categoria) return null;
    return { id: '__fake__', color: categoria.color || '#334155', icon: categoria.icono || 'category', name: categoria.nombre || 'Sin categoría', tags: [] };
}

function _editRemoveRecordatorio(target, i) {
    const key = target === 'habito' ? '_editHabitoRecs' : '_editTareaRecs';
    if (window[key]) { window[key].splice(i, 1); _editRenderRecList(target); }
}


