
// ── Horario Laboral ──────────────────────────────────────────────────────────
// Datos: { "YYYY-MM-DD": "mañana"|"tarde"|"vacaciones" }  (clave = día concreto)

window._horarioLaboral = {};
window._calLaboral = { anio: new Date().getFullYear(), mes: new Date().getMonth(), turnoSeleccionado: null };

function _cargarHorarioLaboral() {
    try { var s = localStorage.getItem('horarioLaboral'); if (s) window._horarioLaboral = JSON.parse(s); } catch(e) {}
}
function _guardarHorarioLaboral() {
    try { localStorage.setItem('horarioLaboral', JSON.stringify(window._horarioLaboral)); } catch(e) {}
}

function _getWeekNumber(date) {
    var d = new Date(date); d.setHours(0,0,0,0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    var yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function _toDateKey(date) {
    var y = date.getFullYear(), m = String(date.getMonth()+1).padStart(2,'0'), d = String(date.getDate()).padStart(2,'0');
    return y+'-'+m+'-'+d;
}

function _turnoColor(turno) {
    if (turno === 'mañana')    return { border: '#10b981', bg: 'rgba(16,185,129,0.18)', txt: '#10b981' };
    if (turno === 'tarde')     return { border: '#3b82f6', bg: 'rgba(59,130,246,0.18)', txt: '#3b82f6' };
    if (turno === 'vacaciones') return { border: '#eab308', bg: 'rgba(234,179,8,0.18)', txt: '#eab308' };
    return null;
}

function abrirCalendarioLaboral() {
    _cargarHorarioLaboral();
    window._calLaboral.anio = new Date().getFullYear();
    window._calLaboral.mes = new Date().getMonth();
    window._calLaboral.turnoSeleccionado = null;
    _renderCalendarioLaboral();
    document.getElementById('modalCalendarioLaboral').style.display = 'flex';
    _poblarHorarioLaboralExtra();
}

function _poblarHorarioLaboralExtra() {
    var ext = window._horarioLaboral._extra || {};
    var e_vac = document.getElementById('labVacaciones');
    if (e_vac) {
        e_vac.value = ext.vac?.v || '';
        document.getElementById('labVacacionesAnio').value = ext.vac?.a || window._calLaboral.anio;
        document.getElementById('labHorasConvenio').value = ext.hc?.v || '';
        document.getElementById('labHorasConvenioAnio').value = ext.hc?.a || window._calLaboral.anio;
        document.getElementById('labAsuntosPropios').value = ext.ap?.v || '';
        document.getElementById('labAsuntosPropiosAnio').value = ext.ap?.a || window._calLaboral.anio;
    }
}

function _guardarHorarioLaboralExtra() {
    if (!window._horarioLaboral) window._horarioLaboral = {};
    window._horarioLaboral._extra = {
        vac: { v: document.getElementById('labVacaciones').value, a: document.getElementById('labVacacionesAnio').value },
        hc:  { v: document.getElementById('labHorasConvenio').value, a: document.getElementById('labHorasConvenioAnio').value },
        ap:  { v: document.getElementById('labAsuntosPropios').value, a: document.getElementById('labAsuntosPropiosAnio').value }
    };
    _guardarHorarioLaboral();
}

function cerrarCalendarioLaboral() {
    document.getElementById('modalCalendarioLaboral').style.display = 'none';
    window._calLaboral.turnoSeleccionado = null;
}

function calLaboralNav(dir) {
    var d = new Date(window._calLaboral.anio, window._calLaboral.mes + dir, 1);
    window._calLaboral.anio = d.getFullYear();
    window._calLaboral.mes = d.getMonth();
    _renderCalendarioLaboral();
}

function abrirSelectorTurno() {
    document.getElementById('modalSelectorTurno').style.display = 'flex';
}

function cerrarSelectorTurno() {
    document.getElementById('modalSelectorTurno').style.display = 'none';
}

function seleccionarTurnoLaboral(turno) {
    window._calLaboral.turnoSeleccionado = turno;
    cerrarSelectorTurno();
    _renderCalendarioLaboral();
}

function cancelarTurnoLaboral() {
    window._calLaboral.turnoSeleccionado = null;
    _renderCalendarioLaboral();
}

function toggleDiaLaboral(dateKey) {
    var turno = window._calLaboral.turnoSeleccionado;
    if (!turno) return;
    if (window._horarioLaboral[dateKey] === turno) {
        delete window._horarioLaboral[dateKey];
    } else {
        window._horarioLaboral[dateKey] = turno;
    }
    _guardarHorarioLaboral();
    _renderCalendarioLaboral();
}

function _getNota(dateKey) {
    if (!window._horarioLaboral) return null;
    var notas = window._horarioLaboral._notas || {};
    var saved = notas[dateKey];
    if (saved === "") return null; // Eliminado explícitamente
    if (saved) return saved;

    var parts = dateKey.split('-');
    if (parts.length === 3) {
        var md = parts[1] + '-' + parts[2];
        var festivos = {
            '01-01': 'Año Nuevo',
            '01-06': 'Epifanía del Señor',
            '04-02': 'Jueves Santo',
            '04-03': 'Viernes Santo',
            '04-23': 'Fiesta de la Comunidad Autónoma',
            '05-01': 'Fiesta del Trabajo',
            '08-15': 'Asunción de la Virgen',
            '10-12': 'Fiesta Nacional de España',
            '11-02': 'Todos los Santos (se traslada al lunes)',
            '12-07': 'Día de la Constitución Española (se traslada al lunes)',
            '12-08': 'Inmaculada Concepción',
            '12-25': 'Natividad del Señor'
        };
        if (festivos[md]) return 'Festivo: ' + festivos[md];
    }
    return null;
}

function clikDiaLaboral(dateKey) {
    if (window._calLaboral.turnoSeleccionado) {
        toggleDiaLaboral(dateKey);
        return;
    }
    var nota = _getNota(dateKey);
    if (nota) {
        mostrarBocadilloNota(dateKey, nota);
    } else {
        abrirModalNotaLaboral(dateKey);
    }
}

function longPressDiaLaboral(dateKey) {
    if (window._calLaboral.turnoSeleccionado) return;
    var nota = _getNota(dateKey);
    if (nota) {
        abrirModalNotaLaboral(dateKey);
    }
}

var _labLongTimer = null;
var _labDidLong = false;
window.labTouchStart = function(dateKey) {
    _labDidLong = false;
    if (_labLongTimer) clearTimeout(_labLongTimer);
    _labLongTimer = setTimeout(function() {
        _labDidLong = true;
        if (navigator.vibrate) navigator.vibrate(40);
        longPressDiaLaboral(dateKey);
    }, 500);
};
window.labTouchEnd = function() {
    if (_labLongTimer) clearTimeout(_labLongTimer);
};
window.labClick = function(e, dateKey) {
    e.stopPropagation();
    if (_labDidLong) return; // Se ignorará el click si ya saltó el long press
    clikDiaLaboral(dateKey);
};
window.labContextMenu = function(e) {
    e.preventDefault();
};

var _diaActivoNota = null;
function abrirModalNotaLaboral(dateKey) {
    _diaActivoNota = dateKey;
    var nota = _getNota(dateKey) || '';
    var ta = document.getElementById('textoNotaLaboral');
    if (ta) ta.value = nota;
    var tit = document.getElementById('tituloNotaLaboral');
    if (tit) tit.textContent = nota ? 'Editar nota' : 'Añadir nota';
    var btnDel = document.getElementById('btnEliminarNotaLaboral');
    if (btnDel) btnDel.style.display = nota ? 'block' : 'none';
    var mod = document.getElementById('modalNotaLaboral');
    if (mod) mod.style.display = 'flex';
}

function cerrarModalNotaLaboral() {
    var mod = document.getElementById('modalNotaLaboral');
    if (mod) mod.style.display = 'none';
    _diaActivoNota = null;
}

function guardarNotaLaboral() {
    if (!_diaActivoNota) return;
    var ta = document.getElementById('textoNotaLaboral');
    var txt = ta ? ta.value.trim() : '';
    if (!window._horarioLaboral._notas) window._horarioLaboral._notas = {};
    if (txt) {
        window._horarioLaboral._notas[_diaActivoNota] = txt;
    } else {
        window._horarioLaboral._notas[_diaActivoNota] = "";
    }
    _guardarHorarioLaboral();
    cerrarModalNotaLaboral();
    _renderCalendarioLaboral();
}

function eliminarNotaLaboral() {
    if (!_diaActivoNota) return;
    if (!window._horarioLaboral._notas) window._horarioLaboral._notas = {};
    window._horarioLaboral._notas[_diaActivoNota] = "";
    _guardarHorarioLaboral();
    cerrarModalNotaLaboral();
    _renderCalendarioLaboral();
}

var _bocadilloTimer = null;
window.ocultarBocadillo = function() {
    var b = document.getElementById('bocadilloNotaLaboral');
    if (!b || b.style.opacity === '0') return;
    b.style.transition = 'opacity 0.2s ease, margin-top 0.2s ease';
    b.style.opacity = '0';
    b.style.marginTop = '20px';
    setTimeout(function() { b.style.display = 'none'; }, 200);
};

var _bStartX = 0, _bStartY = 0;
window.bocadilloTouchStart = function(e) {
    if(e.touches) {
        _bStartX = e.touches[0].clientX;
        _bStartY = e.touches[0].clientY;
    }
};
window.bocadilloTouchMove = function(e) {
    if(!e.touches) return;
    var dx = e.touches[0].clientX - _bStartX;
    var dy = e.touches[0].clientY - _bStartY;
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
        window.ocultarBocadillo();
    }
};

function mostrarBocadilloNota(dateKey, nota) {
    var b = document.getElementById('bocadilloNotaLaboral');
    var tb = document.getElementById('textoBocadilloLaboral');
    if (tb) tb.textContent = nota;
    if (b) {
        b.style.display = 'block';
        b.style.marginTop = '0px';
        setTimeout(function(){
            b.style.opacity = '1';
        }, 10);
        if (_bocadilloTimer) clearTimeout(_bocadilloTimer);
        _bocadilloTimer = setTimeout(function() {
            window.ocultarBocadillo();
        }, 3500);
    }
}

function _renderCalendarioLaboral() {
    var mes = window._calLaboral.mes;
    var anio = window._calLaboral.anio;
    var hoy = new Date(); hoy.setHours(0,0,0,0);
    var nombresMeses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    var nombresDias = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    var primerDia = new Date(anio, mes, 1);
    var diasMes = new Date(anio, mes+1, 0).getDate();
    var offset = (primerDia.getDay() + 6) % 7;
    var diasAnterior = new Date(anio, mes, 0).getDate();
    var turnoActivo = window._calLaboral.turnoSeleccionado;
    var horario = window._horarioLaboral;

    // Construir array de 42 celdas
    var allDays = [];
    for (var s = 0; s < offset; s++) {
        allDays.push({ dia: diasAnterior - offset + s + 1, esDelMes: false, date: new Date(anio, mes-1, diasAnterior-offset+s+1) });
    }
    for (var dia = 1; dia <= diasMes; dia++) {
        allDays.push({ dia: dia, esDelMes: true, date: new Date(anio, mes, dia) });
    }
    var resto = 42 - allDays.length;
    for (var s2 = 1; s2 <= resto; s2++) {
        allDays.push({ dia: s2, esDelMes: false, date: new Date(anio, mes+1, s2) });
    }

    var rowsHTML = '';
    for (var row = 0; row < 6; row++) {
        var rowDays = allDays.slice(row*7, row*7+7);
        if (!rowDays.length) break;

        var semNum = _getWeekNumber(rowDays[0].date);

        // Color de la semana: el turno más frecuente entre los días asignados
        var counts = {};
        rowDays.forEach(function(cell) {
            var t = horario[_toDateKey(cell.date)];
            if (t) counts[t] = (counts[t] || 0) + 1;
        });
        var turnoSemana = null, maxC = 0;
        Object.keys(counts).forEach(function(k) { if (counts[k] > maxC) { maxC = counts[k]; turnoSemana = k; } });
        var semColor = turnoSemana ? _turnoColor(turnoSemana).border : '#f97316';
        var rowBorder = turnoSemana ? _turnoColor(turnoSemana).border : 'transparent';
        var rowBg = turnoSemana ? _turnoColor(turnoSemana).bg.replace('0.18','0.05') : 'transparent';

        var daysHTML = rowDays.map(function(cell, i) {
            var dateKey = _toDateKey(cell.date);
            var esHoy = cell.date.getTime() === hoy.getTime();
            var turno = horario[dateKey];
            var col = turno ? _turnoColor(turno) : null;

            var esFestivo = false;
            var festivos = {
                '01-01': 'Año Nuevo',
                '01-06': 'Epifanía del Señor',
                '04-02': 'Jueves Santo',
                '04-03': 'Viernes Santo',
                '04-23': 'Fiesta de la Comunidad Autónoma',
                '05-01': 'Fiesta del Trabajo',
                '08-15': 'Asunción de la Virgen',
                '10-12': 'Fiesta Nacional de España',
                '11-02': 'Todos los Santos (se traslada al lunes)',
                '12-07': 'Día de la Constitución Española (se traslada al lunes)',
                '12-08': 'Inmaculada Concepción',
                '12-25': 'Natividad del Señor'
            };
            var md = String(cell.date.getMonth() + 1).padStart(2,'0') + '-' + String(cell.date.getDate()).padStart(2,'0');
            var descFestivo = festivos[md];
            
            var notaStr = _getNota(dateKey);
            var tieneNota = notaStr ? true : false;
            var notaDot = tieneNota ? '<div style="position:absolute;top:3px;right:3px;width:6px;height:6px;border-radius:50%;background:#ef4444;box-shadow:0 0 4px rgba(239,68,68,0.5);"></div>' : '';

            var pEvents = 'onclick="labClick(event, \''+dateKey+'\')" ontouchstart="labTouchStart(\''+dateKey+'\')" ontouchend="labTouchEnd()" ontouchcancel="labTouchEnd()" onmousedown="labTouchStart(\''+dateKey+'\')" onmouseup="labTouchEnd()" onmouseleave="labTouchEnd()" oncontextmenu="labContextMenu(event)"';
            var btnStyle = 'user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;width:100%;height:100%;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;z-index:1;';

            if (!col) {
                var dayBg = esHoy ? 'rgba(255,255,255,0.08)' : (descFestivo ? 'rgba(168,85,247,0.12)' : 'transparent');
                var txtC = !cell.esDelMes ? '#1e293b' : (esHoy ? '#f1f5f9' : (descFestivo ? '#c084fc' : '#94a3b8'));
                var fontWeight = descFestivo ? '800' : '500';
                var borderStyle = descFestivo ? 'border:1.5px solid rgba(168,85,247,0.5);' : 'border:none;';
                
                return '<div style="flex:1;aspect-ratio:1;display:flex;align-items:center;justify-content:center;padding:2px;" '+(descFestivo?'title="Festivo: '+descFestivo+'"':'')+'>'
                    + '<button '+pEvents+' style="'+btnStyle+'background:'+dayBg+';'+borderStyle+'color:'+txtC+';font-size:13px;font-weight:'+fontWeight+';">'
                    + cell.dia + notaDot + '</button></div>';
            }

            var prevTurno = i > 0 ? horario[_toDateKey(rowDays[i-1].date)] : null;
            var nextTurno = i < 6 ? horario[_toDateKey(rowDays[i+1].date)] : null;
            var conectaIzq = prevTurno === turno;
            var conectaDer = nextTurno === turno;

            var rTL = conectaIzq ? '0' : '10px';
            var rBL = conectaIzq ? '0' : '10px';
            var rTR = conectaDer ? '0' : '10px';
            var rBR = conectaDer ? '0' : '10px';
            var borderRadius = rTL+' '+rTR+' '+rBR+' '+rBL;
            var w = (conectaIzq && conectaDer) ? 'calc(100% + 4px)' : (conectaIzq || conectaDer) ? 'calc(100% + 2px)' : '100%';
            var ml = conectaIzq ? '-2px' : '0';
            var mr = conectaDer ? '-2px' : '0';
            var borderStyle = 'border:1.5px solid '+col.border+';'
                + (conectaIzq ? 'border-left:none;' : '')
                + (conectaDer ? 'border-right:none;' : '');
                
            var styleRect = btnStyle.replace('width:100%', 'width:'+w).replace('border-radius:50%', 'border-radius:'+borderRadius) 
                          + 'margin-left:'+ml+';margin-right:'+mr+';background:'+col.bg+';'+borderStyle+'color:'+col.txt+';font-size:13px;font-weight:800;';

            return '<div style="flex:1;aspect-ratio:1;display:flex;align-items:center;justify-content:center;padding:2px;overflow:visible;" '+(descFestivo?'title="Festivo: '+descFestivo+'"':'')+'>'
                + '<button '+pEvents+' style="'+styleRect+'">'
                + cell.dia 
                + (descFestivo ? '<div style="position:absolute;bottom:3px;bottom:2px;width:4px;height:4px;border-radius:50%;background:#c084fc;"></div>' : '') 
                + notaDot
                + '</button></div>';
        }).join('');

        rowsHTML += '<div style="display:flex;align-items:center;margin-bottom:3px;padding:0 4px;">'
            + '<div style="width:32px;flex-shrink:0;text-align:center;color:'+semColor+';font-size:10px;font-weight:700;">S'+semNum+'</div>'
            + daysHTML
            + '</div>';
    }

    var turnoActiColor = turnoActivo ? _turnoColor(turnoActivo) : null;
    var turnoIndicador = turnoActivo
        ? '<div style="display:flex;align-items:center;gap:8px;background:'+turnoActiColor.bg+';border:1px solid '+turnoActiColor.border+';border-radius:10px;padding:8px 12px;margin-bottom:12px;">'
            + '<span class="material-symbols-rounded" style="color:'+turnoActiColor.txt+';font-size:16px;">'+(turnoActivo==='mañana'?'wb_sunny':turnoActivo==='tarde'?'nights_stay':'beach_access')+'</span>'
            + '<span style="color:'+turnoActiColor.txt+';font-size:12px;font-weight:700;flex:1;">Toca días para marcar: '+turnoActivo+'</span>'
            + '<button onclick="cancelarTurnoLaboral()" style="background:none;border:none;color:#64748b;cursor:pointer;padding:0;display:flex;"><span class="material-symbols-rounded" style="font-size:16px;">close</span></button>'
          + '</div>'
        : '';

    var html = '<div style="padding:0 4px;">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding:0 4px;">'
            + '<button onclick="calLaboralNav(-1)" style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#60a5fa;cursor:pointer;display:flex;align-items:center;justify-content:center;"><span class="material-symbols-rounded" style="font-size:20px;">chevron_left</span></button>'
            + '<div style="text-align:center;"><div style="color:white;font-size:18px;font-weight:800;">'+nombresMeses[mes]+'</div><div style="color:#475569;font-size:13px;font-weight:600;">'+anio+'</div></div>'
            + '<button onclick="calLaboralNav(1)" style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#60a5fa;cursor:pointer;display:flex;align-items:center;justify-content:center;"><span class="material-symbols-rounded" style="font-size:20px;">chevron_right</span></button>'
        + '</div>'
        + turnoIndicador
        + '<div style="display:flex;align-items:center;margin-bottom:6px;padding:0 4px;">'
            + '<div style="width:32px;flex-shrink:0;"></div>'
            + nombresDias.map(function(d){ return '<div style="flex:1;text-align:center;color:#475569;font-size:11px;font-weight:700;">'+d+'</div>'; }).join('')
        + '</div>'
        + rowsHTML
        + '<div style="display:flex;gap:14px;justify-content:center;margin-top:14px;flex-wrap:wrap;">'
            + '<div style="display:flex;align-items:center;gap:5px;"><div style="width:12px;height:12px;border-radius:50%;border:1.5px solid #10b981;background:rgba(16,185,129,0.15);"></div><span style="color:#64748b;font-size:11px;font-weight:600;">Mañana</span></div>'
            + '<div style="display:flex;align-items:center;gap:5px;"><div style="width:12px;height:12px;border-radius:50%;border:1.5px solid #3b82f6;background:rgba(59,130,246,0.15);"></div><span style="color:#64748b;font-size:11px;font-weight:600;">Tarde</span></div>'
            + '<div style="display:flex;align-items:center;gap:5px;"><div style="width:12px;height:12px;border-radius:50%;border:1.5px solid #eab308;background:rgba(234,179,8,0.15);"></div><span style="color:#64748b;font-size:11px;font-weight:600;">Vacaciones</span></div>'
            + '<div style="display:flex;align-items:center;gap:5px;"><div style="width:12px;height:12px;border-radius:50%;border:1.5px solid rgba(168,85,247,0.5);background:rgba(168,85,247,0.12);"></div><span style="color:#64748b;font-size:11px;font-weight:600;">Festivo</span></div>'
        + '</div>'
    + '</div>';

    document.getElementById('calLaboralContenido').innerHTML = html;
}

_cargarHorarioLaboral();
