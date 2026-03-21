
window._editTareaId   = null;
window._editTareaTipo = null;
window._editTareaFrecSel  = 'todos_dias';
window._editTareaDiasSel  = [];
window._editTareaSubitems = [];

function _editTareaAddSubitem() {
    const input = document.getElementById('editTareaSubitemInput');
    if (!input || !input.value.trim()) return;
    window._editTareaSubitems.push({ texto: input.value.trim(), completado: false });
    input.value = '';
    _editTareaRenderSubitems();
}

function _editTareaRenderSubitems() {
    const list = document.getElementById('editTareaSubitemList');
    if (!list) return;
    list.innerHTML = window._editTareaSubitems.map((it, i) => `
        <div data-idx="${i}" style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:10px 12px;">
            <span class="edit-subitem-drag material-symbols-rounded" style="color:#475569;font-size:16px;flex-shrink:0;cursor:grab;touch-action:none;">drag_indicator</span>
            <span style="color:#e2e8f0;font-size:13px;flex:1;">${it.texto}</span>
            <button onclick="_editTareaDeleteSubitem(${i})" style="background:none;border:none;color:#64748b;cursor:pointer;padding:0;display:flex;">
                <span class="material-symbols-rounded" style="font-size:18px;">delete</span>
            </button>
        </div>`).join('');
    if (list._sortable) { list._sortable.destroy(); list._sortable = null; }
    const _initSubitemSortable = () => {
        list._sortable = new Sortable(list, {
            handle: '.edit-subitem-drag',
            animation: 150,
            ghostClass: 'subitem-sortable-ghost',
            chosenClass: 'subitem-sortable-chosen',
            dragClass: 'subitem-sortable-drag',
            forceFallback: true,
            fallbackClass: 'subitem-sortable-fallback',
            scroll: true,
            scrollSensitivity: 60,
            scrollSpeed: 10,
            onEnd: function(evt) {
                if (evt.oldIndex === evt.newIndex) return;
                const moved = window._editTareaSubitems.splice(evt.oldIndex, 1)[0];
                window._editTareaSubitems.splice(evt.newIndex, 0, moved);
                Array.from(list.children).forEach((el, i) => el.dataset.idx = i);
            }
        });
    };
    if (window.Sortable) {
        _initSubitemSortable();
    } else {
        const _s = document.createElement('script');
        _s.src = 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js';
        _s.onload = _initSubitemSortable;
        document.head.appendChild(_s);
    }
}

function _editTareaDeleteSubitem(i) {
    window._editTareaSubitems.splice(i, 1);
    _editTareaRenderSubitems();
}

function abrirEditarTarea(id, tipo) {
    const arr = tipo === 'tarea' ? (window.agendaData.tareas||[]) : (window.agendaData.tareasRecurrentes||[]);
    const item = arr.find(x => x.id === id);
    if (!item) return;

    window._editTareaId   = id;
    window._editTareaTipo = tipo;
    window._editTareaFrecSel  = item.frecuencia || 'todos_dias';
    window._editTareaDiasSel  = [...(item.diasSemana||[])];

    const esRecurrente = tipo === 'tareaRecurrente';
    const esRecordatorio = tipo === 'tarea' && !!item.esRecordatorio;
    const color = esRecurrente ? '#60a5fa' : '#f59e0b';
    const subitemsWrap = document.getElementById('editTareaSubitemsWrap');
    const recordatoriosWrap = document.getElementById('editTareaRecordatoriosWrap');
    const categoriaWrap = document.getElementById('editTareaCatContainer');
    document.getElementById('editTareaTituloHeader').textContent = esRecurrente ? 'Editar tarea recurrente' : (esRecordatorio ? 'Editar recordatorio' : 'Editar tarea');
    document.getElementById('editTareaNombre').value = item.nombre || '';
    const _etd = document.getElementById('editTareaDesc'); _etd.value = item.nota || item.desc || ''; setTimeout(()=>{ _etd.style.height='auto'; _etd.style.height=_etd.scrollHeight+'px'; },0);
    window._editTareaSubitems = esRecordatorio ? [] : (item.subitems || []).map(s => ({ ...s }));
    _editTareaRenderSubitems();
    window._editTareaRecs = esRecordatorio ? [] : [...(item.recordatorios || (item.hora ? [item.hora] : []))];
    window._editTareaHora = '';
    _editRenderRecList('tarea');
    _editActualizarHoraDisp('tarea');
    window._editTareaCatObj = item.categoria || null;
    window._editTareaCatId = item.categoriaId || _editResolveCatId(item.categoria) || null;
    window._editTareaEtiqueta = item.etiqueta || null;
    _editRenderCatDropdown('tarea');
    if (categoriaWrap) categoriaWrap.style.display = esRecordatorio ? 'none' : 'block';
    if (subitemsWrap) subitemsWrap.style.display = esRecordatorio ? 'none' : 'block';
    if (recordatoriosWrap) recordatoriosWrap.style.display = esRecordatorio ? 'none' : 'block';
    document.getElementById('editTareaFechaWrap').style.display = esRecurrente || esRecordatorio ? 'none' : 'block';
    if (!esRecurrente) {
        document.getElementById('editTareaFecha').value = item.fecha || '';
        const fmt = item.fecha ? new Date(item.fecha + 'T00:00:00').toLocaleDateString('es-ES', {day:'numeric',month:'short',year:'numeric'}) : 'Sin fecha';
        document.getElementById('editTareaFechaDisp').textContent = fmt;
    }
    document.getElementById('editTareaFrecWrap').style.display = esRecurrente ? 'block' : 'none';
    if (esRecurrente) { _renderEditTareaFrecGrid(); _renderEditTareaDiasSemana(); }
    document.getElementById('editTareaDiasSemanaWrap').style.display = esRecurrente && window._editTareaFrecSel === 'dias_semana' ? 'block' : 'none';

    document.getElementById('modalEditarTarea').style.display = 'flex';
}

function cerrarEditarTarea() {
    document.getElementById('modalEditarTarea').style.display = 'none';
    window._editTareaId = null;
    window._editTareaTipo = null;
}

function _renderEditTareaFrecGrid() {
    const opciones = [
        { v:'todos_dias',    label:'Todos los días', icon:'event' },
        { v:'dias_semana',   label:'Días semana',    icon:'view_week' },
        { v:'cada_x_dias',   label:'Cada X días',    icon:'autorenew' },
        { v:'veces_periodo', label:'X veces/período',icon:'repeat' },
    ];
    const sel   = window._editTareaFrecSel;
    const color = '#60a5fa';
    document.getElementById('editTareaFrecGrid').innerHTML = opciones.map(o => `
        <button onclick="editTareaSelFrec('${o.v}')" style="display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:12px;border:1.5px solid ${sel===o.v?color:'rgba(255,255,255,0.08)'};background:${sel===o.v?'rgba(96,165,250,0.12)':'transparent'};color:${sel===o.v?color:'#64748b'};cursor:pointer;font-size:12px;font-weight:${sel===o.v?'700':'500'};">
            <span class="material-symbols-rounded" style="font-size:16px;">${o.icon}</span>${o.label}
        </button>`).join('');
    document.getElementById('editTareaDiasSemanaWrap').style.display = sel === 'dias_semana' ? 'block' : 'none';
}

function editTareaSelFrec(v) {
    window._editTareaFrecSel = v;
    _renderEditTareaFrecGrid();
    _renderEditTareaDiasSemana();
}

function _renderEditTareaDiasSemana() {
    const dias  = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    const sel   = window._editTareaDiasSel;
    const color = '#60a5fa';
    document.getElementById('editTareaDiasSemana').innerHTML = dias.map((d,i) => `
        <button onclick="editTareaToggleDia(${i})" style="width:40px;height:40px;border-radius:50%;border:1.5px solid ${sel.includes(i)?color:'rgba(255,255,255,0.1)'};background:${sel.includes(i)?'rgba(96,165,250,0.15)':'transparent'};color:${sel.includes(i)?color:'#64748b'};cursor:pointer;font-size:12px;font-weight:700;">${d}</button>`).join('');
}

function editTareaToggleDia(i) {
    const idx = window._editTareaDiasSel.indexOf(i);
    if (idx >= 0) window._editTareaDiasSel.splice(idx,1); else window._editTareaDiasSel.push(i);
    _renderEditTareaDiasSemana();
}

function guardarEditarTarea() {
    const id   = window._editTareaId;
    const tipo = window._editTareaTipo;
    if (!id || !tipo) return;

    const arr  = tipo === 'tarea' ? (window.agendaData.tareas||[]) : (window.agendaData.tareasRecurrentes||[]);
    const item = arr.find(x => x.id === id);
    if (!item) return;

    item.nombre = document.getElementById('editTareaNombre').value.trim() || item.nombre;
    const notaVal = document.getElementById('editTareaDesc').value.trim();
    item.nota = notaVal;
    item.desc = notaVal;
    if (item.esRecordatorio) {
        delete item.fecha;
        delete item.hora;
        delete item.recordatorios;
        delete item.subitems;
        delete item.categoriaId;
        delete item.etiqueta;
        item.categoria = { icono: 'notifications', color: '#22d3ee', nombre: 'Recordatorios' };
    } else {
        item.subitems = window._editTareaSubitems.length ? window._editTareaSubitems : undefined;
    }

    if (!item.esRecordatorio) {
        item.recordatorios = [...(window._editTareaRecs || [])];
        item.hora = item.recordatorios[0] || '';
    }
    if (!item.esRecordatorio && window._editTareaCatId) {
        const cats = (window.finanzasData && window.finanzasData.categorias) || [];
        const cat = cats.find(c => c.id === window._editTareaCatId);
        if (cat) { item.categoriaId = cat.id; item.categoria = { icono: cat.icon, color: cat.color, nombre: cat.name }; }
    }
    if (!item.esRecordatorio && window._editTareaEtiqueta !== undefined) item.etiqueta = window._editTareaEtiqueta;

    if (tipo === 'tarea' && !item.esRecordatorio) {
        const fechaVal = document.getElementById('editTareaFecha').value;
        if (fechaVal) item.fecha = fechaVal;
    } else if (tipo === 'tareaRecurrente') {
        item.frecuencia = window._editTareaFrecSel;
        item.diasSemana = [...window._editTareaDiasSel];
    }

    guardarAgendaData();
    cerrarEditarTarea();
    if (typeof renderDiario === 'function') renderDiario();
    if (typeof renderTareasSection === 'function') renderTareasSection();
    if (typeof _mostrarToast === 'function') _mostrarToast('check_circle','#10b981', item.esRecordatorio ? 'Recordatorio actualizado' : 'Cambios guardados');
}

