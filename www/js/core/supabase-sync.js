(function () {
    const CONFIG = Object.freeze({
        supabaseUrl: 'https://uospeezksosukewznwkx.supabase.co',
        publishableKey: 'sb_publishable_ptqXC6LvOsOQtQOCGB4SOQ_FiSdfbMR',
        snapshotTable: 'user_snapshots',
        assetBucket: 'app-assets',
        assetPrefix: 'sbasset://',
        defaultEmail: 'seniorplazaml@gmail.com',
        syncDelayMs: 2800,
        deviceKey: 'sp_sync_device_id_v1',
        emailKey: 'sp_sync_email_v1',
        metaKey: 'sp_sync_meta_v1',
        localDbName: 'SeniorPlazAppDB',
        localStoreName: 'datos',
        localSnapshotKey: 'seniorPlazAppData'
    });

    const NO_CHANGE = Symbol('no_change');

    let supabaseClient = null;
    let supabaseLoadPromise = null;
    let localDbPromise = null;
    let activeSession = null;
    let activeUser = null;
    let realtimeChannel = null;
    let syncTimer = null;
    let syncInFlight = false;
    let queuedSync = false;
    let queuedReason = '';
    let initialSyncRunning = false;
    let initialSyncDone = false;
    let applyingRemote = false;
    let lastSyncedHash = '';
    let lastSeenRemoteHash = '';
    const uploadCache = new Map();
    const downloadCache = new Map();

    function byId(id) {
        return document.getElementById(id);
    }

    function setText(id, value) {
        const node = byId(id);
        if (node) node.textContent = value;
    }

    function show(id, visible) {
        const node = byId(id);
        if (node) node.style.display = visible ? '' : 'none';
    }

    function safeStorageGet(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value == null ? fallback : value;
        } catch (error) {
            return fallback;
        }
    }

    function safeStorageSet(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
        }
    }

    function loadMeta() {
        try {
            return JSON.parse(safeStorageGet(CONFIG.metaKey, '{}')) || {};
        } catch (error) {
            return {};
        }
    }

    function saveMeta(patch) {
        const nextMeta = Object.assign(loadMeta(), patch || {});
        safeStorageSet(CONFIG.metaKey, JSON.stringify(nextMeta));
        return nextMeta;
    }

    function getDeviceId() {
        let deviceId = safeStorageGet(CONFIG.deviceKey, '');
        if (deviceId) return deviceId;
        if (window.crypto && typeof window.crypto.randomUUID === 'function') {
            deviceId = window.crypto.randomUUID();
        } else {
            deviceId = 'device-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
        }
        safeStorageSet(CONFIG.deviceKey, deviceId);
        return deviceId;
    }

    function formatTimestamp(value) {
        if (!value) return 'Todavia sin sincronizar';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return 'Todavia sin sincronizar';
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function friendlyErrorMessage(error) {
        const raw = (error && error.message) ? String(error.message) : 'Error desconocido';
        if (/user_snapshots/i.test(raw) && /does not exist|not exist|42P01/i.test(raw)) {
            return 'Falta crear la tabla cloud. Ejecuta el SQL de setup en Supabase.';
        }
        if (/app-assets/i.test(raw) && /not found|does not exist/i.test(raw)) {
            return 'Falta crear el bucket privado app-assets en Supabase.';
        }
        if (/Invalid login credentials/i.test(raw)) {
            return 'El codigo OTP no es valido o ha caducado.';
        }
        if (/No pude cargar la libreria cloud de Supabase/i.test(raw) || /La libreria Supabase/i.test(raw)) {
            return 'No he podido cargar la libreria cloud en la web. Haz Ctrl+F5 y vuelve a probar.';
        }
        return raw;
    }

    function setButtonBusy(button, busy, busyLabel) {
        if (!button) return;
        if (!button.dataset.idleLabel) {
            button.dataset.idleLabel = button.textContent.trim();
        }
        button.disabled = !!busy;
        button.style.opacity = busy ? '0.7' : '1';
        button.style.cursor = busy ? 'wait' : 'pointer';
        button.textContent = busy ? busyLabel : button.dataset.idleLabel;
    }

    function renderMeta() {
        const meta = loadMeta();
        const emailInput = byId('cloudSyncEmail');
        if (emailInput && !emailInput.value) {
            emailInput.value = safeStorageGet(CONFIG.emailKey, CONFIG.defaultEmail);
        }
        setText('cloudSyncCurrentEmail', activeUser ? (activeUser.email || '') : '');
        setText('cloudSyncLastSync', formatTimestamp(meta.lastSyncedAt));
        setText('cloudSyncLastDevice', meta.lastDevice || 'Sin dispositivo');
        show('cloudSyncLoggedOut', !activeUser);
        show('cloudSyncLoggedIn', !!activeUser);
    }

    function setStatus(mode, title, detail) {
        const badge = byId('cloudSyncBadge');
        const icon = byId('cloudSyncStatusIcon');
        const pill = byId('cloudSyncLivePill');

        const variants = {
            auth: { badge: 'LOGIN', icon: 'mail', badgeBg: 'rgba(30,41,59,0.8)', badgeBorder: 'rgba(148,163,184,0.2)', badgeColor: '#cbd5e1', iconColor: '#93c5fd' },
            disconnected: { badge: 'LOCAL', icon: 'cloud_off', badgeBg: 'rgba(30,41,59,0.8)', badgeBorder: 'rgba(148,163,184,0.2)', badgeColor: '#cbd5e1', iconColor: '#94a3b8' },
            offline: { badge: 'OFFLINE', icon: 'cloud_off', badgeBg: 'rgba(120,53,15,0.45)', badgeBorder: 'rgba(251,191,36,0.28)', badgeColor: '#fbbf24', iconColor: '#fbbf24' },
            syncing: { badge: 'SYNC', icon: 'sync', badgeBg: 'rgba(30,64,175,0.32)', badgeBorder: 'rgba(96,165,250,0.32)', badgeColor: '#93c5fd', iconColor: '#93c5fd' },
            synced: { badge: 'ACTIVO', icon: 'cloud_done', badgeBg: 'rgba(6,95,70,0.35)', badgeBorder: 'rgba(16,185,129,0.3)', badgeColor: '#6ee7b7', iconColor: '#6ee7b7' },
            error: { badge: 'ERROR', icon: 'error', badgeBg: 'rgba(127,29,29,0.4)', badgeBorder: 'rgba(248,113,113,0.28)', badgeColor: '#fca5a5', iconColor: '#fca5a5' }
        };

        const variant = variants[mode] || variants.disconnected;
        setText('cloudSyncStatusText', title || 'Sincronizacion local');
        setText('cloudSyncStatusDetail', detail || 'Tus datos siguen guardandose en este dispositivo.');

        if (badge) {
            badge.textContent = variant.badge;
            badge.style.background = variant.badgeBg;
            badge.style.borderColor = variant.badgeBorder;
            badge.style.color = variant.badgeColor;
        }
        if (icon) {
            icon.textContent = variant.icon;
            icon.style.color = variant.iconColor;
            icon.style.animation = mode === 'syncing' ? 'spin 1.1s linear infinite' : '';
        }
        if (pill) {
            pill.textContent = mode === 'syncing' ? 'SYNC' : 'AUTO';
            pill.style.color = mode === 'error' ? '#fca5a5' : '#93c5fd';
            pill.style.borderColor = mode === 'error' ? 'rgba(248,113,113,0.28)' : 'rgba(96,165,250,0.24)';
            pill.style.background = mode === 'error' ? 'rgba(127,29,29,0.24)' : 'rgba(30,64,175,0.14)';
        }
    }

    function isOnline() {
        return typeof navigator === 'undefined' ? true : navigator.onLine !== false;
    }

    function hasUsableSnapshot(snapshot) {
        return !!(snapshot && typeof snapshot === 'object' && Object.keys(snapshot).length > 0);
    }

    function getSnapshotStamp(snapshot, fallbackDate) {
        const snapshotStamp = snapshot && snapshot.fecha ? new Date(snapshot.fecha).getTime() : 0;
        const fallbackStamp = fallbackDate ? new Date(fallbackDate).getTime() : 0;
        return Math.max(snapshotStamp || 0, fallbackStamp || 0);
    }

    function hasSupabaseLibrary() {
        return !!(window.supabase && typeof window.supabase.createClient === 'function');
    }

    function loadRemoteScript(src) {
        return new Promise(function (resolve, reject) {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.crossOrigin = 'anonymous';
            script.onload = function () {
                if (hasSupabaseLibrary()) {
                    resolve(true);
                    return;
                }
                reject(new Error('La libreria Supabase no ha quedado disponible tras cargar ' + src));
            };
            script.onerror = function () {
                reject(new Error('No pude cargar la libreria Supabase desde ' + src));
            };
            document.head.appendChild(script);
        });
    }

    async function loadSupabaseModule(src) {
        const module = await import(src);
        if (!module || typeof module.createClient !== 'function') {
            throw new Error('El modulo Supabase no expone createClient.');
        }

        window.supabase = Object.assign({}, window.supabase || {}, {
            createClient: module.createClient
        });
        return true;
    }

    async function ensureSupabaseLibrary() {
        if (hasSupabaseLibrary()) return true;
        if (supabaseLoadPromise) return supabaseLoadPromise;

        supabaseLoadPromise = (async function () {
            const scriptSources = [
                'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
                'https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.js'
            ];
            const moduleSources = [
                'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm',
                'https://esm.sh/@supabase/supabase-js@2?bundle'
            ];

            for (let index = 0; index < scriptSources.length; index += 1) {
                try {
                    await loadRemoteScript(scriptSources[index]);
                    if (hasSupabaseLibrary()) return true;
                } catch (error) {
                }
            }

            for (let index = 0; index < moduleSources.length; index += 1) {
                try {
                    await loadSupabaseModule(moduleSources[index]);
                    if (hasSupabaseLibrary()) return true;
                } catch (error) {
                }
            }

            throw new Error('No pude cargar la libreria cloud de Supabase en este navegador.');
        })();

        try {
            return await supabaseLoadPromise;
        } finally {
            if (!hasSupabaseLibrary()) {
                supabaseLoadPromise = null;
            }
        }
    }

    function getSupabaseClient() {
        if (supabaseClient) return supabaseClient;
        if (!hasSupabaseLibrary()) return null;
        supabaseClient = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.publishableKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        });
        return supabaseClient;
    }

    function openLocalDb() {
        if (localDbPromise) return localDbPromise;
        localDbPromise = new Promise(function (resolve, reject) {
            const request = indexedDB.open(CONFIG.localDbName, 1);
            request.onerror = function () {
                reject(request.error);
            };
            request.onsuccess = function () {
                resolve(request.result);
            };
            request.onupgradeneeded = function (event) {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(CONFIG.localStoreName)) {
                    db.createObjectStore(CONFIG.localStoreName);
                }
            };
        });
        return localDbPromise;
    }

    async function readLocalSnapshotFromDb() {
        const db = await openLocalDb();
        return new Promise(function (resolve, reject) {
            const tx = db.transaction([CONFIG.localStoreName], 'readonly');
            const store = tx.objectStore(CONFIG.localStoreName);
            const request = store.get(CONFIG.localSnapshotKey);
            request.onsuccess = function () {
                resolve(request.result || null);
            };
            request.onerror = function () {
                reject(request.error);
            };
        });
    }

    async function writeLocalSnapshotToDb(snapshot) {
        const db = await openLocalDb();
        return new Promise(function (resolve, reject) {
            const tx = db.transaction([CONFIG.localStoreName], 'readwrite');
            const store = tx.objectStore(CONFIG.localStoreName);
            const request = store.put(snapshot, CONFIG.localSnapshotKey);
            request.onsuccess = function () {
                resolve();
            };
            request.onerror = function () {
                reject(request.error);
            };
        });
    }

    async function readCurrentLocalSnapshot() {
        if (typeof window._serializarDatos === 'function') {
            try {
                return window._serializarDatos();
            } catch (error) {
            }
        }
        return readLocalSnapshotFromDb();
    }

    async function applySnapshotLocally(snapshot) {
        await writeLocalSnapshotToDb(snapshot);
        if (typeof window.cargarDatos === 'function') {
            await window.cargarDatos();
        }
        if (typeof window.calculate === 'function') {
            try {
                window.calculate();
            } catch (error) {
            }
        }
        if (typeof window._limpiarHistorialUndo === 'function') {
            try {
                window._limpiarHistorialUndo();
            } catch (error) {
            }
        }
    }

    async function sha256HexFromBytes(bytes) {
        if (window.crypto && window.crypto.subtle) {
            const digest = await window.crypto.subtle.digest('SHA-256', bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
            return Array.from(new Uint8Array(digest)).map(function (part) {
                return part.toString(16).padStart(2, '0');
            }).join('');
        }

        let hash = 0;
        for (let index = 0; index < bytes.length; index += 1) {
            hash = ((hash << 5) - hash + bytes[index]) | 0;
        }
        return 'fallback-' + Math.abs(hash).toString(16);
    }

    async function sha256HexFromText(text) {
        const bytes = new TextEncoder().encode(text);
        return sha256HexFromBytes(bytes);
    }

    function isDataUrl(value) {
        return typeof value === 'string' && /^data:[^;]+;base64,/i.test(value);
    }

    function mimeToExtension(mime) {
        const value = String(mime || '').toLowerCase();
        if (value === 'image/jpeg') return 'jpg';
        if (value === 'image/svg+xml') return 'svg';
        if (value === 'application/pdf') return 'pdf';
        if (value === 'text/csv') return 'csv';
        const compact = value.split('/')[1] || 'bin';
        return compact.split('+')[0].replace(/[^a-z0-9]/g, '') || 'bin';
    }

    function dataUrlToParts(dataUrl) {
        const match = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/i);
        if (!match) throw new Error('Formato de archivo no compatible para la nube.');
        const mime = match[1].toLowerCase();
        const base64 = match[2];
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) {
            bytes[index] = binary.charCodeAt(index);
        }
        return {
            mime: mime,
            bytes: bytes,
            extension: mimeToExtension(mime)
        };
    }

    function arrayBufferToDataUrl(buffer, mime) {
        const bytes = new Uint8Array(buffer);
        const chunkSize = 0x8000;
        let binary = '';
        for (let index = 0; index < bytes.length; index += chunkSize) {
            binary += String.fromCharCode.apply(null, bytes.subarray(index, index + chunkSize));
        }
        return 'data:' + mime + ';base64,' + btoa(binary);
    }

    function makeAssetRef(path, mime) {
        return CONFIG.assetPrefix + encodeURIComponent(path) + '|' + encodeURIComponent(mime || 'application/octet-stream');
    }

    function parseAssetRef(ref) {
        if (typeof ref !== 'string' || ref.indexOf(CONFIG.assetPrefix) !== 0) return null;
        const parts = ref.slice(CONFIG.assetPrefix.length).split('|');
        return {
            path: decodeURIComponent(parts[0] || ''),
            mime: decodeURIComponent(parts[1] || 'application/octet-stream')
        };
    }

    async function walkAsync(value, mapper) {
        const mapped = await mapper(value);
        if (mapped !== NO_CHANGE) return mapped;

        if (Array.isArray(value)) {
            const out = [];
            for (let index = 0; index < value.length; index += 1) {
                out.push(await walkAsync(value[index], mapper));
            }
            return out;
        }

        if (value && typeof value === 'object') {
            const out = {};
            const entries = Object.entries(value);
            for (let index = 0; index < entries.length; index += 1) {
                const entry = entries[index];
                out[entry[0]] = await walkAsync(entry[1], mapper);
            }
            return out;
        }

        return value;
    }

    async function uploadDataUrlAndGetRef(dataUrl, userId) {
        const parts = dataUrlToParts(dataUrl);
        const assetHash = await sha256HexFromBytes(parts.bytes);
        const cacheKey = assetHash + '|' + parts.mime;
        if (uploadCache.has(cacheKey)) {
            return uploadCache.get(cacheKey);
        }

        const path = userId + '/' + assetHash + '.' + parts.extension;
        const ref = makeAssetRef(path, parts.mime);
        uploadCache.set(cacheKey, ref);

        const client = getSupabaseClient();
        const result = await client.storage.from(CONFIG.assetBucket).upload(path, parts.bytes, {
            contentType: parts.mime,
            cacheControl: '3600',
            upsert: false
        });

        if (result.error && !/duplicate|already exists|exists/i.test(String(result.error.message || ''))) {
            uploadCache.delete(cacheKey);
            throw result.error;
        }

        return ref;
    }

    async function downloadRefAsDataUrl(ref) {
        if (downloadCache.has(ref)) return downloadCache.get(ref);
        const asset = parseAssetRef(ref);
        if (!asset || !asset.path) throw new Error('Referencia de archivo cloud no valida.');

        const client = getSupabaseClient();
        const result = await client.storage.from(CONFIG.assetBucket).download(asset.path);
        if (result.error) throw result.error;

        const buffer = await result.data.arrayBuffer();
        const dataUrl = arrayBufferToDataUrl(buffer, asset.mime);
        downloadCache.set(ref, dataUrl);
        return dataUrl;
    }

    async function serializeSnapshotForCloud(snapshot, userId) {
        return walkAsync(snapshot, async function (value) {
            if (isDataUrl(value)) {
                return uploadDataUrlAndGetRef(value, userId);
            }
            return NO_CHANGE;
        });
    }

    async function restoreSnapshotFromCloud(snapshot) {
        return walkAsync(snapshot, async function (value) {
            if (typeof value === 'string' && value.indexOf(CONFIG.assetPrefix) === 0) {
                return downloadRefAsDataUrl(value);
            }
            return NO_CHANGE;
        });
    }

    async function fetchRemoteSnapshotRow() {
        if (!activeUser) return null;
        const client = getSupabaseClient();
        const result = await client
            .from(CONFIG.snapshotTable)
            .select('user_id, snapshot, snapshot_hash, updated_at, updated_by')
            .eq('user_id', activeUser.id)
            .maybeSingle();

        if (result.error) throw result.error;
        return result.data || null;
    }

    async function applyRemoteRow(row, reason) {
        if (!row || !row.snapshot) return;

        clearTimeout(syncTimer);
        applyingRemote = true;
        setStatus('syncing', 'Aplicando datos remotos...', 'Descargando cambios desde Supabase.');

        try {
            const restoredSnapshot = await restoreSnapshotFromCloud(row.snapshot);
            await applySnapshotLocally(restoredSnapshot);
            lastSyncedHash = row.snapshot_hash || await sha256HexFromText(JSON.stringify(row.snapshot));
            lastSeenRemoteHash = lastSyncedHash;
            initialSyncDone = true;
            saveMeta({
                lastSyncedAt: row.updated_at || new Date().toISOString(),
                lastDevice: row.updated_by || 'cloud',
                lastSyncedHash: lastSyncedHash,
                lastPullReason: reason || 'remote'
            });
            setStatus('synced', 'Sincronizacion activa', 'La nube se ha aplicado en este dispositivo.');
        } catch (error) {
            setStatus('error', 'No pude aplicar la nube', friendlyErrorMessage(error));
        } finally {
            renderMeta();
            setTimeout(function () {
                applyingRemote = false;
            }, 700);
        }
    }

    async function pushLocalSnapshot(reason) {
        if (!activeUser || applyingRemote) return;
        if (!isOnline()) {
            setStatus('offline', 'Sin internet', 'Seguimos guardando todo en local hasta recuperar conexion.');
            return;
        }
        if (syncInFlight) {
            queuedSync = true;
            queuedReason = reason || 'queued';
            return;
        }

        syncInFlight = true;
        setStatus('syncing', 'Subiendo cambios...', 'Guardando la ultima version en Supabase.');

        try {
            const localSnapshot = await readCurrentLocalSnapshot();
            if (!hasUsableSnapshot(localSnapshot)) {
                setStatus('auth', 'Sesion lista', 'Todavia no hay datos locales que subir.');
                initialSyncDone = true;
                return;
            }

            const cloudSnapshot = await serializeSnapshotForCloud(localSnapshot, activeUser.id);
            const cloudHash = await sha256HexFromText(JSON.stringify(cloudSnapshot));
            if (cloudHash === lastSyncedHash) {
                initialSyncDone = true;
                saveMeta({
                    lastSyncedAt: new Date().toISOString(),
                    lastDevice: getDeviceId(),
                    lastSyncedHash: cloudHash,
                    lastPushReason: reason || 'noop'
                });
                setStatus('synced', 'Sincronizacion activa', 'No habia cambios pendientes.');
                return;
            }

            const nowIso = new Date().toISOString();
            const payload = {
                user_id: activeUser.id,
                snapshot: cloudSnapshot,
                snapshot_hash: cloudHash,
                updated_by: getDeviceId(),
                app_version: localSnapshot.version || '1.0',
                updated_at: nowIso
            };

            const client = getSupabaseClient();
            const result = await client
                .from(CONFIG.snapshotTable)
                .upsert(payload, { onConflict: 'user_id' })
                .select('updated_at, snapshot_hash, updated_by')
                .single();

            if (result.error) throw result.error;

            lastSyncedHash = result.data && result.data.snapshot_hash ? result.data.snapshot_hash : cloudHash;
            lastSeenRemoteHash = lastSyncedHash;
            initialSyncDone = true;
            saveMeta({
                lastSyncedAt: result.data && result.data.updated_at ? result.data.updated_at : nowIso,
                lastDevice: payload.updated_by,
                lastSyncedHash: lastSyncedHash,
                lastPushReason: reason || 'auto'
            });
            setStatus('synced', 'Sincronizacion activa', 'Los cambios locales ya estan en la nube.');
        } catch (error) {
            setStatus('error', 'No pude subir los datos', friendlyErrorMessage(error));
        } finally {
            syncInFlight = false;
            renderMeta();
            if (queuedSync) {
                const nextReason = queuedReason || 'queued';
                queuedSync = false;
                queuedReason = '';
                scheduleSync(nextReason, CONFIG.syncDelayMs);
            }
        }
    }

    function scheduleSync(reason, delayMs) {
        if (!activeUser || applyingRemote || !initialSyncDone) return;
        if (!isOnline()) {
            setStatus('offline', 'Sin internet', 'Los cambios se quedan en este dispositivo hasta volver a conectarte.');
            return;
        }
        clearTimeout(syncTimer);
        syncTimer = setTimeout(function () {
            pushLocalSnapshot(reason || 'auto-local');
        }, typeof delayMs === 'number' ? delayMs : CONFIG.syncDelayMs);
    }

    async function pullLatestRemote(reason) {
        if (!activeUser) return;
        try {
            setStatus('syncing', 'Leyendo nube...', 'Buscando la ultima version remota.');
            const row = await fetchRemoteSnapshotRow();
            if (!row || !row.snapshot) {
                setStatus('auth', 'La nube aun esta vacia', 'Sube primero una version local para inicializar Supabase.');
                return;
            }
            await applyRemoteRow(row, reason || 'manual-pull');
        } catch (error) {
            setStatus('error', 'No pude leer la nube', friendlyErrorMessage(error));
        }
    }

    async function runInitialSync() {
        if (!activeUser || initialSyncRunning) return;

        initialSyncRunning = true;
        setStatus('syncing', 'Preparando sincronizacion...', 'Comparando el dispositivo con GitHub Pages y Supabase.');

        try {
            const [remoteRow, localSnapshot] = await Promise.all([
                fetchRemoteSnapshotRow(),
                readCurrentLocalSnapshot()
            ]);

            if (!remoteRow || !remoteRow.snapshot) {
                initialSyncDone = true;
                if (hasUsableSnapshot(localSnapshot)) {
                    await pushLocalSnapshot('bootstrap-cloud');
                } else {
                    setStatus('auth', 'Sesion lista', 'La nube esta preparada. Empezara a sincronizar cuando haya datos.');
                }
                return;
            }

            const localStamp = getSnapshotStamp(localSnapshot);
            const remoteStamp = getSnapshotStamp(remoteRow.snapshot, remoteRow.updated_at);

            if (!hasUsableSnapshot(localSnapshot) || remoteStamp > localStamp + 1000) {
                await applyRemoteRow(remoteRow, 'initial-remote-wins');
                return;
            }

            if (localStamp > remoteStamp + 1000) {
                initialSyncDone = true;
                await pushLocalSnapshot('initial-local-wins');
                return;
            }

            lastSyncedHash = remoteRow.snapshot_hash || '';
            lastSeenRemoteHash = lastSyncedHash;
            initialSyncDone = true;
            saveMeta({
                lastSyncedAt: remoteRow.updated_at || new Date().toISOString(),
                lastDevice: remoteRow.updated_by || 'cloud',
                lastSyncedHash: lastSyncedHash,
                lastSyncMode: 'already-aligned'
            });
            setStatus('synced', 'Sincronizacion activa', 'La web y este dispositivo ya estaban alineados.');
        } catch (error) {
            setStatus('error', 'No pude arrancar la sincronizacion', friendlyErrorMessage(error));
        } finally {
            renderMeta();
            initialSyncRunning = false;
        }
    }

    async function handleRealtimePayload(payload) {
        if (!payload || !payload.new || !activeUser) return;
        const row = payload.new;
        if (!row.snapshot) return;
        if (row.updated_by && row.updated_by === getDeviceId()) return;
        if (row.snapshot_hash && row.snapshot_hash === lastSyncedHash) return;
        if (row.snapshot_hash && row.snapshot_hash === lastSeenRemoteHash) return;
        lastSeenRemoteHash = row.snapshot_hash || '';
        await applyRemoteRow(row, 'realtime');
    }

    async function subscribeToRealtime() {
        const client = getSupabaseClient();
        if (!client || !activeUser) return;

        if (realtimeChannel) {
            try {
                await client.removeChannel(realtimeChannel);
            } catch (error) {
            }
            realtimeChannel = null;
        }

        try {
            if (activeSession && client.realtime && typeof client.realtime.setAuth === 'function') {
                await client.realtime.setAuth(activeSession.access_token);
            }
        } catch (error) {
        }

        realtimeChannel = client
            .channel('seniorplazapp-sync-' + activeUser.id)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: CONFIG.snapshotTable,
                filter: 'user_id=eq.' + activeUser.id
            }, function (payload) {
                setTimeout(function () {
                    handleRealtimePayload(payload);
                }, 0);
            })
            .subscribe();
    }

    async function handleAuthState(event, session) {
        activeSession = session || null;
        activeUser = activeSession && activeSession.user ? activeSession.user : null;
        renderMeta();

        if (!activeUser) {
            initialSyncDone = false;
            lastSyncedHash = '';
            lastSeenRemoteHash = '';
            if (realtimeChannel && supabaseClient) {
                try {
                    await supabaseClient.removeChannel(realtimeChannel);
                } catch (error) {
                }
            }
            realtimeChannel = null;
            setStatus('auth', 'Login requerido', 'Accede con tu email para activar la sincronizacion entre la app y la web.');
            return;
        }

        setStatus('syncing', 'Sesion iniciada', 'Conectando el dispositivo con Supabase...');
        await subscribeToRealtime();
        await runInitialSync();
    }

    async function sendOtp(button) {
        try {
            await ensureSupabaseLibrary();
        } catch (error) {
            setStatus('error', 'Supabase no se ha cargado', friendlyErrorMessage(error));
            return;
        }

        const client = getSupabaseClient();
        if (!client) {
            setStatus('error', 'Supabase no se ha cargado', 'Revisa tu conexion y vuelve a intentarlo.');
            return;
        }

        const email = String((byId('cloudSyncEmail') && byId('cloudSyncEmail').value) || '').trim().toLowerCase();
        if (!email) {
            setStatus('error', 'Falta el email', 'Introduce el email con el que vas a entrar en app y web.');
            return;
        }

        safeStorageSet(CONFIG.emailKey, email);
        setButtonBusy(button, true, 'Enviando...');
        setStatus('syncing', 'Enviando codigo OTP...', 'Revisa tu correo y escribe el codigo de 6 digitos.');

        try {
            const result = await client.auth.signInWithOtp({
                email: email,
                options: {
                    shouldCreateUser: true
                }
            });

            if (result.error) throw result.error;
            setStatus('auth', 'Codigo enviado', 'Ya puedes introducir el OTP recibido por email.');
        } catch (error) {
            setStatus('error', 'No pude enviar el codigo', friendlyErrorMessage(error));
        } finally {
            setButtonBusy(button, false);
        }
    }

    async function verifyOtp(button) {
        try {
            await ensureSupabaseLibrary();
        } catch (error) {
            setStatus('error', 'Supabase no se ha cargado', friendlyErrorMessage(error));
            return;
        }

        const client = getSupabaseClient();
        if (!client) {
            setStatus('error', 'Supabase no se ha cargado', 'La libreria cloud no esta disponible ahora mismo.');
            return;
        }

        const email = String((byId('cloudSyncEmail') && byId('cloudSyncEmail').value) || '').trim().toLowerCase();
        const token = String((byId('cloudSyncOtp') && byId('cloudSyncOtp').value) || '').trim();
        if (!email || !token) {
            setStatus('error', 'Faltan datos', 'Necesitas email y codigo OTP para iniciar sesion.');
            return;
        }

        safeStorageSet(CONFIG.emailKey, email);
        setButtonBusy(button, true, 'Entrando...');
        setStatus('syncing', 'Verificando codigo...', 'Creando la sesion segura para web y app.');

        try {
            const result = await client.auth.verifyOtp({
                email: email,
                token: token,
                type: 'email'
            });

            if (result.error) throw result.error;
            if (byId('cloudSyncOtp')) byId('cloudSyncOtp').value = '';
            await handleAuthState('SIGNED_IN', result.data ? result.data.session : null);
        } catch (error) {
            setStatus('error', 'No pude iniciar sesion', friendlyErrorMessage(error));
        } finally {
            setButtonBusy(button, false);
        }
    }

    async function signOutCloud() {
        try {
            await ensureSupabaseLibrary();
        } catch (error) {
            setStatus('error', 'Supabase no se ha cargado', friendlyErrorMessage(error));
            return;
        }

        const client = getSupabaseClient();
        if (!client) return;
        try {
            await client.auth.signOut();
            await handleAuthState('SIGNED_OUT', null);
        } catch (error) {
            setStatus('error', 'No pude cerrar la sesion', friendlyErrorMessage(error));
        }
    }

    function hookSavePipeline() {
        if (typeof window.guardarDatos !== 'function') return false;
        if (window.guardarDatos.__supabaseWrapped) return true;

        const originalSave = window.guardarDatos;
        const wrappedSave = function () {
            const result = originalSave.apply(this, arguments);
            if (!applyingRemote) {
                scheduleSync('auto-local', CONFIG.syncDelayMs);
            }
            return result;
        };

        wrappedSave.__supabaseWrapped = true;
        window.guardarDatos = wrappedSave;
        return true;
    }

    async function initSupabaseSync() {
        renderMeta();

        try {
            await ensureSupabaseLibrary();
        } catch (error) {
            setStatus('error', 'Supabase no se ha cargado', friendlyErrorMessage(error));
            return;
        }

        const client = getSupabaseClient();
        if (!client) {
            setStatus('error', 'Supabase no se ha cargado', 'La app seguira funcionando en local hasta que haya conexion.');
            return;
        }

        hookSavePipeline();
        setStatus('auth', 'Login requerido', 'Accede con tu email para activar la sincronizacion entre movil y web.');

        client.auth.onAuthStateChange(function (event, session) {
            setTimeout(function () {
                handleAuthState(event, session);
            }, 0);
        });

        setTimeout(async function () {
            hookSavePipeline();
            try {
                const result = await client.auth.getSession();
                if (result.error) throw result.error;
                await handleAuthState('INITIAL_SESSION', result.data ? result.data.session : null);
            } catch (error) {
                setStatus('error', 'No pude recuperar la sesion', friendlyErrorMessage(error));
            }
        }, 1200);

        window.addEventListener('online', function () {
            if (activeUser) {
                setStatus('syncing', 'Conexion recuperada', 'Reanudando la sincronizacion con Supabase...');
                scheduleSync('online', 600);
            } else {
                setStatus('auth', 'Login requerido', 'La conexion ha vuelto. Inicia sesion para sincronizar.');
            }
        });

        window.addEventListener('offline', function () {
            setStatus('offline', 'Sin internet', 'Tus cambios siguen guardandose en este dispositivo.');
        });

        document.addEventListener('visibilitychange', function () {
            if (!document.hidden && activeUser) {
                hookSavePipeline();
                scheduleSync('visibility-return', 900);
            }
        });
    }

    window.cloudSyncEnviarCodigo = function (button) {
        sendOtp(button);
    };

    window.cloudSyncVerificarCodigo = function (button) {
        verifyOtp(button);
    };

    window.cloudSyncCerrarSesion = function () {
        signOutCloud();
    };

    window.cloudSyncForcePush = function (button) {
        setButtonBusy(button, true, 'Subiendo...');
        pushLocalSnapshot('manual-push').finally(function () {
            setButtonBusy(button, false);
        });
    };

    window.cloudSyncForcePull = function (button) {
        setButtonBusy(button, true, 'Bajando...');
        pullLatestRemote('manual-pull').finally(function () {
            setButtonBusy(button, false);
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSupabaseSync);
    } else {
        initSupabaseSync();
    }
})();