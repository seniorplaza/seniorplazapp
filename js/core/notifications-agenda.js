/**
 * notifications-agenda.js
 * Programa notificaciones locales (Android) usando AlarmManager nativo
 * a través de AndroidNotificador.agendarNotificaciones().
 * Solo se activa en contexto nativo Capacitor; en desktop no hace nada.
 */
(function () {
    'use strict';

    if (!window.Capacitor || !Capacitor.isNativePlatform()) return;

    var DAYS_AHEAD = 30;
    var LS_KEY     = '_notifIds';
    var _iconBitmapCache = Object.create(null);

    function _hashId(str) {
        var h = 5381;
        for (var i = 0; i < str.length; i++) {
            h = (((h << 5) + h) + str.charCodeAt(i)) | 0;
        }
        return (Math.abs(h) % 2000000000) + 1;
    }

    function _parseHM(horaStr) {
        var p = (horaStr || '00:00').split(':');
        return { hour: parseInt(p[0]) || 0, minute: parseInt(p[1]) || 0 };
    }

    function _padTime(h, m) {
        return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
    }

    function _dateToStr(d) {
        return d.getFullYear() + '-' +
               String(d.getMonth() + 1).padStart(2, '0') + '-' +
               String(d.getDate()).padStart(2, '0');
    }

    function _hoyStr() {
        return _dateToStr(new Date());
    }

    function _appWeekday(d) {
        return (d.getDay() + 6) % 7;
    }

    function _materialIconBitmapDataUrl(iconName) {
        if (!iconName) return '';
        if (_iconBitmapCache[iconName]) return _iconBitmapCache[iconName];
        try {
            var canvas = document.createElement('canvas');
            var size = 128;
            canvas.width = size;
            canvas.height = size;
            var ctx = canvas.getContext('2d');
            if (!ctx) return '';
            ctx.clearRect(0, 0, size, size);
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '700 84px "Material Symbols Rounded"';
            ctx.fillText(String(iconName), size / 2, size / 2 + 2);
            var dataUrl = canvas.toDataURL('image/png');
            _iconBitmapCache[iconName] = dataUrl;
            return dataUrl;
        } catch (e) {
            return '';
        }
    }

    function _resolveIconBitmapDataUrl(icono, svgData) {
        if (svgData && svgData.vb && svgData.svg) return '';
        return _materialIconBitmapDataUrl(icono);
    }

    function _categoriaVisual(item) {
        try {
            var cats = window.finanzasData && window.finanzasData.categorias;
            var cat = (cats && item.categoriaId)
                ? cats.find(function (c) { return c.id === item.categoriaId; })
                : null;
            if (!cat && cats && item.categoria) {
                cat = cats.find(function (c) {
                    return c.icon === item.categoria.icono
                        || (item.categoria.nombre && c.name === item.categoria.nombre)
                        || (item.categoria.color && c.color === item.categoria.color && c.icon === item.categoria.icono);
                });
            }
            var icono = (cat && cat.icon) || (item.categoria && item.categoria.icono) || 'category';
            var svgData = (item.categoria && item.categoria.svgData)
                || (cat && cat.svgData)
                || (typeof window._getSvgDataForIcon === 'function' ? window._getSvgDataForIcon(icono) : null)
                || null;
            var iconoImagen = (cat && cat.iconoImagen) || (item.categoria && item.categoria.iconoImagen) || null;

            return {
                color: (cat && cat.color) || (item.categoria && item.categoria.color) || null,
                icono: icono,
                svgData: svgData,
                iconoImagen: iconoImagen
            };
        } catch (e) {
            return { color: null, icono: 'category', svgData: null };
        }
    }

    function _descripcionTarea(t) {
        var txt = (t.nota && t.nota.trim())
            ? t.nota.trim()
            : ((t.desc && t.desc.trim())
                ? t.desc.trim()
                : (t.descripcion && t.descripcion.trim() ? t.descripcion.trim() : ''));
        return txt ? txt.substring(0, 120) : (t.nombre || 'Tarea');
    }

    function _descripcionRecurrente(item, esHabito) {
        var txt = (item.desc && item.desc.trim())
            ? item.desc.trim()
            : ((item.nota && item.nota.trim())
                ? item.nota.trim()
                : (item.descripcion && item.descripcion.trim() ? item.descripcion.trim() : ''));
        if (txt) return txt.substring(0, 120);
        return item.nombre || (esHabito ? 'Habito' : 'Tarea recurrente');
    }

    function _parseReminderTimerTarget(item) {
        if (!item || !item.esRecordatorio || !item.timerTargetAt) return null;
        var target = new Date(item.timerTargetAt);
        return isNaN(target.getTime()) ? null : target;
    }

    function _debeDispararse(item, dateStr, appWd) {
        var frec       = item.frecuencia || 'todos_dias';
        var diasSemana = item.diasSemana || [];
        var diasMes    = item.diasMes    || [];

        if (frec === 'todos_dias' || frec === 'cada_x_dias' || frec === 'veces_periodo') return true;
        if (frec === 'dias_semana') {
            var activos = diasSemana.length ? diasSemana : [0, 1, 2, 3, 4];
            return activos.indexOf(appWd) >= 0;
        }
        if (diasSemana.length) return diasSemana.indexOf(appWd) >= 0;
        if (frec === 'dias_mes' && diasMes.length) {
            return diasMes.indexOf(parseInt(dateStr.split('-')[2])) >= 0;
        }
        return true;
    }

    function _resizarFotoBase64(dataUrl, size) {
        try {
            var img = new Image();
            img.src = dataUrl;
            if (!img.naturalWidth) return '';
            var canvas = document.createElement('canvas');
            canvas.width = size; canvas.height = size;
            var ctx = canvas.getContext('2d');
            var s = Math.min(img.naturalWidth, img.naturalHeight);
            var sx = (img.naturalWidth - s) / 2;
            var sy = (img.naturalHeight - s) / 2;
            ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);
            return canvas.toDataURL('image/jpeg', 0.75).split(',')[1] || '';
        } catch (e) { return ''; }
    }

    function _buildNotifsNative(data) {
        var notifs = [];
        var now    = new Date();
        var hoy    = _hoyStr();

        (data.tareas || []).forEach(function (t) {
            if (t.completada) return;
            var timerTarget = _parseReminderTimerTarget(t);
            var visual = _categoriaVisual(t);
            var color  = visual.color || (t.esRecordatorio ? '#22d3ee' : '#f59e0b');
            var cuerpo = _descripcionTarea(t);
            var svgData = visual.svgData || null;
            var iconBitmapDataUrl = _resolveIconBitmapDataUrl(visual.icono, svgData);
            var _img = visual.iconoImagen || '';
            var fotoUrl = (_img && _img.startsWith('http')) ? _img : '';
            var fotoBase64 = (!fotoUrl && _img && _img.startsWith('data:')) ? _resizarFotoBase64(_img, 192) : '';

            if (timerTarget) {
                if (timerTarget <= now) return;
                notifs.push({
                    id:        _hashId('tarea_timer_' + t.id + '_' + timerTarget.getTime()),
                    titulo:    t.nombre || (t.esRecordatorio ? 'Recordatorio' : 'Tarea'),
                    cuerpo:    cuerpo,
                    colorHex:  color,
                    itemId:    t.id,
                    tipo:      'tarea',
                    iconName:  visual.icono || 'category',
                    svgVb:     (svgData && svgData.vb) ? String(svgData.vb) : '',
                    svgContent:(svgData && svgData.svg) ? String(svgData.svg) : '',
                    iconBitmapDataUrl: iconBitmapDataUrl,
                    fotoUrl:    fotoUrl,
                    fotoBase64: fotoBase64,
                    horaOriginal: _padTime(timerTarget.getHours(), timerTarget.getMinutes()),
                    timestamp: timerTarget.getTime()
                });
                return;
            }

            if (t.fecha && t.fecha < hoy) return;
            var recs = (t.recordatorios && t.recordatorios.length) ? t.recordatorios : (t.hora ? [t.hora] : []);
            if (!recs.length) return;

            recs.forEach(function (horaStr, i) {
                var hm = _parseHM(horaStr);
                var dt = new Date((t.fecha || hoy) + 'T' + _padTime(hm.hour, hm.minute) + ':00');
                if (dt <= now) return;
                notifs.push({
                    id:        _hashId('tarea_' + t.id + '_' + i),
                    titulo:    t.nombre || (t.esRecordatorio ? 'Recordatorio' : 'Tarea'),
                    cuerpo:    cuerpo,
                    colorHex:  color,
                    itemId:    t.id,
                    tipo:      'tarea',
                    iconName:  visual.icono || 'category',
                    svgVb:     (svgData && svgData.vb) ? String(svgData.vb) : '',
                    svgContent:(svgData && svgData.svg) ? String(svgData.svg) : '',
                    iconBitmapDataUrl: iconBitmapDataUrl,
                    fotoUrl:    fotoUrl,
                    fotoBase64: fotoBase64,
                    horaOriginal: _padTime(hm.hour, hm.minute),
                    timestamp: dt.getTime()
                });
            });
        });

        var recurrentes = (data.habitos || []).concat(data.tareasRecurrentes || []);
        recurrentes.forEach(function (item) {
            if (item.fechaFin && item.fechaFin < hoy) return;
            var recs = (item.recordatorios && item.recordatorios.length) ? item.recordatorios : (item.hora ? [item.hora] : []);
            if (!recs.length) return;
            var esHabito = !item.subtipo || item.subtipo === 'habito' || item.subtipo === 'sino' || item.subtipo === 'cantidad' || item.subtipo === 'lista';
            var visual = _categoriaVisual(item);
            var color  = visual.color || (esHabito ? '#10b981' : '#60a5fa');
            var cuerpo = _descripcionRecurrente(item, esHabito);
            var tipo   = item.subtipo || (esHabito ? 'habito' : 'recurrente');
            var svgData = visual.svgData || null;
            var iconBitmapDataUrl = _resolveIconBitmapDataUrl(visual.icono, svgData);
            var _img2 = visual.iconoImagen || '';
            var fotoUrl = (_img2 && _img2.startsWith('http')) ? _img2 : '';
            var fotoBase64 = (!fotoUrl && _img2 && _img2.startsWith('data:')) ? _resizarFotoBase64(_img2, 192) : '';

            for (var d = 0; d < DAYS_AHEAD; d++) {
                var fecha   = new Date(now.getTime() + d * 86400000);
                var dateStr = _dateToStr(fecha);
                if (item.fechaFin && dateStr > item.fechaFin) break;
                if (item.fechaInicio && dateStr < item.fechaInicio) continue;
                if (!_debeDispararse(item, dateStr, _appWeekday(fecha))) continue;

                recs.forEach(function (horaStr, i) {
                    var hm = _parseHM(horaStr);
                    var dt = new Date(dateStr + 'T' + _padTime(hm.hour, hm.minute) + ':00');
                    if (dt <= now) return;
                    notifs.push({
                        id:        _hashId(item.id + '_' + dateStr + '_' + i),
                        titulo:    item.nombre || 'Recordatorio',
                        cuerpo:    cuerpo,
                        colorHex:  color,
                        itemId:    item.id,
                        tipo:      tipo,
                        iconName:  visual.icono || 'category',
                        svgVb:     (svgData && svgData.vb) ? String(svgData.vb) : '',
                        svgContent:(svgData && svgData.svg) ? String(svgData.svg) : '',
                        iconBitmapDataUrl: iconBitmapDataUrl,
                        fotoUrl:    fotoUrl,
                        fotoBase64: fotoBase64,
                        horaOriginal: _padTime(hm.hour, hm.minute),
                        timestamp: dt.getTime()
                    });
                });
            }
        });

        return notifs;
    }

    function _getAndroid() {
        return window.AndroidNotificador || null;
    }

    function _guardarIds(ids) {
        try { localStorage.setItem(LS_KEY, JSON.stringify(ids)); } catch (e) {}
    }

    function _getIds() {
        try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch (e) { return []; }
    }

    function programarNotificacionesAgenda() {
        var android = _getAndroid();
        if (!android || !window.agendaData) return;
        try {
            var prevIds = _getIds();
            if (prevIds.length) android.cancelarNotificaciones(JSON.stringify(prevIds));

            var notifs = _buildNotifsNative(window.agendaData);
            _guardarIds(notifs.length ? notifs.map(function (n) { return n.id; }) : []);
            if (!notifs.length) return;
            android.agendarNotificaciones(JSON.stringify(notifs));
        } catch (e) {
            console.warn('[NotifAgenda] programar:', e);
        }
    }

    window._notifLogradoNativo = function (tipo, itemId) {
        try {
            var data = window.agendaData;
            if (!data) return;
            var hoy = _hoyStr();
            if (tipo === 'tarea') {
                var t = (data.tareas || []).find(function (x) { return x.id === itemId; });
                if (t) { t.estado = 'completada'; t.completada = true; if (typeof guardarAgendaData === 'function') guardarAgendaData(); }
            } else {
                var esHabito = (tipo === 'habito' || tipo === 'sino' || tipo === 'cantidad' || tipo === 'lista');
                var arr  = esHabito ? (data.habitos || []) : (data.tareasRecurrentes || []);
                var item = arr.find(function (x) { return x.id === itemId; });
                if (item) {
                    if (!item.registros) item.registros = [];
                    var idx = item.registros.findIndex(function (r) { return r.fecha === hoy; });
                    if (idx >= 0) item.registros[idx].completado = true;
                    else item.registros.push({ fecha: hoy, completado: true });
                    if (typeof guardarAgendaData === 'function') guardarAgendaData();
                }
            }
            if (typeof _renderPreservandoDesc === 'function') _renderPreservandoDesc();
            if (typeof renderHabitosSection === 'function') renderHabitosSection();
        } catch (e) { console.warn('[NotifAgenda] logradoNativo:', e); }
    };

    function _aplicarHoraPospuesta(item, horaOriginal, horaNueva) {
        if (!item) return false;
        var changed = false;
        var recs = Array.isArray(item.recordatorios) ? item.recordatorios.slice() : [];

        if (recs.length) {
            if (horaOriginal) {
                var idx = recs.indexOf(horaOriginal);
                if (idx >= 0) {
                    recs[idx] = horaNueva;
                    changed = true;
                } else {
                    recs.push(horaNueva);
                    changed = true;
                }
            } else {
                recs[0] = horaNueva;
                changed = true;
            }

            // Evitar duplicados y mantener orden HH:mm
            recs = Array.from(new Set(recs)).sort();
            item.recordatorios = recs;
            item.hora = recs[0] || item.hora || '';
            return changed;
        }

        if (item.hora) {
            if (horaOriginal && item.hora !== horaOriginal) {
                item.recordatorios = [item.hora, horaNueva].sort();
            } else {
                item.hora = horaNueva;
                item.recordatorios = [horaNueva];
            }
            return true;
        }

        item.hora = horaNueva;
        item.recordatorios = [horaNueva];
        return true;
    }

    // Llamada desde nativo para aplicar acciones pendientes al abrir/reanudar app.
    window._notifAplicarAccionesPendientes = function (acciones) {
        try {
            var data = window.agendaData;
            if (!data || !Array.isArray(acciones) || !acciones.length) return;
            var changed = false;

            acciones.forEach(function (a) {
                if (!a) return;

                // Accion logrado pendiente (app estaba cerrada al pulsar "Logrado")
                if (a.accion === 'logrado') {
                    var tipo = a.tipo || '';
                    var itemId = a.itemId || '';
                    if (!itemId) return;
                    var hoy = _hoyStr();
                    if (tipo === 'tarea') {
                        var t = (data.tareas || []).find(function (x) { return x.id === itemId; });
                        if (t) { t.estado = 'completada'; t.completada = true; changed = true; }
                    } else {
                        var esHabito = (tipo === 'habito' || tipo === 'sino' || tipo === 'cantidad' || tipo === 'lista');
                        var arr2 = esHabito ? (data.habitos || []) : (data.tareasRecurrentes || []);
                        var it2 = arr2.find(function (x) { return x.id === itemId; });
                        if (it2) {
                            if (!it2.registros) it2.registros = [];
                            var idx2 = it2.registros.findIndex(function (r) { return r.fecha === hoy; });
                            if (idx2 >= 0) it2.registros[idx2].completado = true;
                            else it2.registros.push({ fecha: hoy, completado: true });
                            changed = true;
                        }
                    }
                    return;
                }

                if (a.accion !== 'posponer') return;
                var tipo = a.tipo || '';
                var itemId = a.itemId || '';
                var horaOriginal = a.horaOriginal || '';
                var horaNueva = a.horaNueva || '';
                if (!itemId || !horaNueva) return;

                if (tipo === 'tarea') {
                    var t = (data.tareas || []).find(function (x) { return x.id === itemId; });
                    if (t) changed = _aplicarHoraPospuesta(t, horaOriginal, horaNueva) || changed;
                    return;
                }

                var esHabito = (tipo === 'habito' || tipo === 'sino' || tipo === 'cantidad' || tipo === 'lista');
                var arr = esHabito ? (data.habitos || []) : (data.tareasRecurrentes || []);
                var it = arr.find(function (x) { return x.id === itemId; });
                if (it) changed = _aplicarHoraPospuesta(it, horaOriginal, horaNueva) || changed;
            });

            if (changed) {
                if (typeof guardarAgendaData === 'function') guardarAgendaData();
                if (typeof _renderPreservandoDesc === 'function') _renderPreservandoDesc();
                if (typeof renderHabitosSection === 'function') renderHabitosSection();
                if (typeof renderTareasSection === 'function') renderTareasSection();
            }
        } catch (e) {
            console.warn('[NotifAgenda] aplicarPendientes:', e);
        }
    };

    async function _pedirPermiso() {
        try {
            var ln = Capacitor.Plugins && Capacitor.Plugins.LocalNotifications;
            if (ln) await ln.requestPermissions();
        } catch (e) { console.warn('[NotifAgenda] permiso:', e); }
    }

    function _esperarDataYProgramar() {
        if (window.agendaData) { programarNotificacionesAgenda(); return; }
        var intentos = 0;
        var iv = setInterval(function () {
            intentos++;
            if (window.agendaData) { clearInterval(iv); programarNotificacionesAgenda(); }
            else if (intentos > 30) clearInterval(iv);
        }, 500);
    }

    window.programarNotificacionesAgenda = programarNotificacionesAgenda;

    var _origGuardar = window.guardarAgendaData;
    window.guardarAgendaData = function () {
        if (typeof _origGuardar === 'function') _origGuardar.apply(this, arguments);
        setTimeout(programarNotificacionesAgenda, 500);
    };

    document.addEventListener('resume', function () {
        setTimeout(programarNotificacionesAgenda, 1000);
    });

    _pedirPermiso().then(function () { _esperarDataYProgramar(); });

})();
