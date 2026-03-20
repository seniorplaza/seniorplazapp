/**
 * notifications-agenda.js
 * Programa notificaciones locales (Android) para recordatorios de tareas,
 * hábitos y tareas recurrentes usando @capacitor/local-notifications.
 * Solo se activa en contexto nativo Capacitor; en desktop no hace nada.
 */
(function () {
    'use strict';

    // No hacer nada en desktop (navegador web)
    if (!window.Capacitor || !Capacitor.isNativePlatform()) return;

    var CHANNEL_ID = 'agenda-reminders';
    var _ln = null;

    function _getLN() {
        if (_ln) return _ln;
        try { _ln = Capacitor.Plugins.LocalNotifications; } catch (e) {}
        return _ln;
    }

    // Hash determinista de string → entero positivo único para IDs de notificación
    function _hashId(str, seed) {
        var h = 5381 + (seed | 0);
        for (var i = 0; i < str.length; i++) {
            h = (((h << 5) + h) + str.charCodeAt(i)) | 0;
        }
        return (Math.abs(h) % 2000000000) + 1;
    }

    // Convierte índice de día de la app (0=Lun..6=Dom) al weekday de Capacitor (1=Dom,2=Lun..7=Sáb)
    function _capWeekday(appDay) {
        // appDay: 0=Lun,1=Mar,2=Mié,3=Jue,4=Vie,5=Sáb,6=Dom
        // cap:    2=Lun,3=Mar,4=Mié,5=Jue,6=Vie,7=Sáb,1=Dom
        return [2, 3, 4, 5, 6, 7, 1][appDay] || 2;
    }

    function _parseHM(horaStr) {
        var p = (horaStr || '00:00').split(':');
        return { hour: parseInt(p[0]) || 0, minute: parseInt(p[1]) || 0 };
    }

    function _hoyStr() {
        return new Date().toISOString().split('T')[0];
    }

    // Inicializa el canal de Android y solicita permiso de notificaciones
    async function _init() {
        var ln = _getLN();
        if (!ln) return;
        try {
            await ln.createChannel({
                id: CHANNEL_ID,
                name: 'Recordatorios de Agenda',
                description: 'Notificaciones de tareas y hábitos',
                importance: 5,          // IMPORTANCE_HIGH
                visibility: 1,          // VISIBILITY_PUBLIC
                vibration: true,
                lights: true,
                lightColor: '#60a5fa'
            });
            await ln.requestPermissions();
            window._notifAgendaReady = true;
            _esperarDataYProgramar();
        } catch (e) {
            console.warn('[NotifAgenda] init:', e);
        }
    }

    // Espera a que agendaData esté disponible (carga asíncrona desde IndexedDB)
    function _esperarDataYProgramar() {
        if (window.agendaData) {
            programarNotificacionesAgenda();
            return;
        }
        var intentos = 0;
        var iv = setInterval(function () {
            intentos++;
            if (window.agendaData) {
                clearInterval(iv);
                programarNotificacionesAgenda();
            } else if (intentos > 30) { // máx 15 segundos
                clearInterval(iv);
            }
        }, 500);
    }

    // Construye la lista de notificaciones a partir de agendaData
    function _buildNotifs(data) {
        var notifs = [];
        var hoy = _hoyStr();

        // ── TAREAS (puntuales) ─────────────────────────────────────────────────
        (data.tareas || []).forEach(function (t) {
            if (t.completada) return;
            if (t.fecha && t.fecha < hoy) return;
            var recs = (t.recordatorios && t.recordatorios.length) ? t.recordatorios : (t.hora ? [t.hora] : []);
            if (!recs.length) return;

            recs.forEach(function (horaStr, i) {
                var hm = _parseHM(horaStr);
                var fecha = t.fecha || hoy;
                var dt = new Date(
                    fecha + 'T' +
                    String(hm.hour).padStart(2, '0') + ':' +
                    String(hm.minute).padStart(2, '0') + ':00'
                );
                if (dt <= new Date()) return; // ya pasó
                notifs.push({
                    id: _hashId(t.id, i),
                    title: t.nombre || 'Tarea',
                    body: (t.nota && t.nota.trim()) ? t.nota.substring(0, 120) : 'Tienes una tarea pendiente',
                    channelId: CHANNEL_ID,
                    schedule: { at: dt, allowWhileIdle: true },
                    extra: { tipo: 'tarea', id: t.id }
                });
            });
        });

        // ── HÁBITOS + TAREAS RECURRENTES ──────────────────────────────────────
        var recurrentes = (data.habitos || []).concat(data.tareasRecurrentes || []);
        recurrentes.forEach(function (item) {
            if (item.fechaFin && item.fechaFin < hoy) return; // expirado
            var recs = (item.recordatorios && item.recordatorios.length) ? item.recordatorios : (item.hora ? [item.hora] : []);
            if (!recs.length) return;

            var frec = item.frecuencia || 'todos_dias';
            var diasSemana = item.diasSemana || [];
            var diasMes = item.diasMes || [];
            var esHabito = !item.subtipo || item.subtipo === 'habito' || item.subtipo === 'sino' || item.subtipo === 'cantidad' || item.subtipo === 'lista';
            var cuerpo = (item.desc && item.desc.trim()) ? item.desc.substring(0, 120) : (esHabito ? 'Recordatorio de hábito' : 'Tarea recurrente');

            recs.forEach(function (horaStr, i) {
                var hm = _parseHM(horaStr);
                var baseId = item.id + '_r' + i;

                if (frec === 'todos_dias' || frec === 'cada_x_dias' || frec === 'veces_periodo') {
                    // ── Diario ──
                    notifs.push({
                        id: _hashId(baseId, 0),
                        title: item.nombre || 'Recordatorio',
                        body: cuerpo,
                        channelId: CHANNEL_ID,
                        schedule: { on: { hour: hm.hour, minute: hm.minute }, repeats: true, allowWhileIdle: true },
                        extra: { tipo: item.subtipo || 'habito', id: item.id }
                    });

                } else if (frec === 'dias_semana') {
                    // ── Lun–Vie (o días seleccionados) ──
                    var dias = diasSemana.length ? diasSemana : [0, 1, 2, 3, 4];
                    dias.forEach(function (appDay) {
                        notifs.push({
                            id: _hashId(baseId + '_d' + appDay, 0),
                            title: item.nombre || 'Recordatorio',
                            body: cuerpo,
                            channelId: CHANNEL_ID,
                            schedule: { on: { weekday: _capWeekday(appDay), hour: hm.hour, minute: hm.minute }, repeats: true, allowWhileIdle: true },
                            extra: { tipo: item.subtipo || 'habito', id: item.id }
                        });
                    });

                } else if (diasSemana.length) {
                    // ── Días de semana personalizados ──
                    diasSemana.forEach(function (appDay) {
                        notifs.push({
                            id: _hashId(baseId + '_d' + appDay, 0),
                            title: item.nombre || 'Recordatorio',
                            body: cuerpo,
                            channelId: CHANNEL_ID,
                            schedule: { on: { weekday: _capWeekday(appDay), hour: hm.hour, minute: hm.minute }, repeats: true, allowWhileIdle: true },
                            extra: { tipo: item.subtipo || 'habito', id: item.id }
                        });
                    });

                } else if (frec === 'dias_mes' && diasMes.length) {
                    // ── Días específicos del mes ──
                    diasMes.forEach(function (dayNum) {
                        notifs.push({
                            id: _hashId(baseId + '_m' + dayNum, 0),
                            title: item.nombre || 'Recordatorio',
                            body: cuerpo,
                            channelId: CHANNEL_ID,
                            schedule: { on: { day: dayNum, hour: hm.hour, minute: hm.minute }, repeats: true, allowWhileIdle: true },
                            extra: { tipo: item.subtipo || 'habito', id: item.id }
                        });
                    });

                } else {
                    // ── Fallback: diario ──
                    notifs.push({
                        id: _hashId(baseId, 99),
                        title: item.nombre || 'Recordatorio',
                        body: cuerpo,
                        channelId: CHANNEL_ID,
                        schedule: { on: { hour: hm.hour, minute: hm.minute }, repeats: true, allowWhileIdle: true },
                        extra: { tipo: item.subtipo || 'habito', id: item.id }
                    });
                }
            });
        });

        return notifs;
    }

    // Cancela todas las notificaciones pendientes y programa las nuevas
    async function programarNotificacionesAgenda() {
        if (!window._notifAgendaReady) return;
        var ln = _getLN();
        if (!ln || !window.agendaData) return;

        try {
            // Cancelar pendientes anteriores
            var pending = await ln.getPending();
            if (pending && pending.notifications && pending.notifications.length) {
                await ln.cancel({
                    notifications: pending.notifications.map(function (n) { return { id: n.id }; })
                });
            }

            var notifs = _buildNotifs(window.agendaData);
            if (!notifs.length) return;

            // Programar en lotes de 50 (límite recomendado)
            for (var i = 0; i < notifs.length; i += 50) {
                await ln.schedule({ notifications: notifs.slice(i, i + 50) });
            }
        } catch (e) {
            console.warn('[NotifAgenda] schedule error:', e);
        }
    }

    // ── Hooks ─────────────────────────────────────────────────────────────────

    // Exponer globalmente por si se necesita llamar desde otro lugar
    window.programarNotificacionesAgenda = programarNotificacionesAgenda;

    // Envolver guardarAgendaData para reprogramar tras cada guardado
    var _origGuardar = window.guardarAgendaData;
    window.guardarAgendaData = function () {
        if (typeof _origGuardar === 'function') _origGuardar.apply(this, arguments);
        setTimeout(programarNotificacionesAgenda, 500);
    };

    // Reprogramar cuando la app vuelve al primer plano
    document.addEventListener('resume', function () {
        setTimeout(programarNotificacionesAgenda, 1000);
    });

    // Arrancar
    _init();

})();
