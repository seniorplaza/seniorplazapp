/**
 * Tuya Sockets Control
 * Controla los enchufes FILTRO y ESCRITORIO via Tuya OpenAPI
 */

const TUYA_API_KEY    = 'q8qytffvh3edp7axkraw';
const TUYA_API_SECRET = '529b2fbca9c94a8ca8d7421474fd5dff';
const TUYA_BASE_URL   = 'https://openapi.tuyaeu.com';

let _tuyaToken    = null;
let _tuyaTokenExp = 0;

// --- Crypto helpers ---

async function _sha256Hex(str) {
    const data = new TextEncoder().encode(str);
    const buf  = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function _hmacSha256Upper(secret, message) {
    const keyData = new TextEncoder().encode(secret);
    const msgData = new TextEncoder().encode(message);
    const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig  = await crypto.subtle.sign('HMAC', key, msgData);
    return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

async function _buildHeaders(token, method, path, body) {
    const t        = Date.now();
    const bodyStr  = (typeof body === 'string') ? body : (body ? JSON.stringify(body) : '');
    const bodyHash = await _sha256Hex(bodyStr);
    const strToSign = [method, bodyHash, '', path].join('\n');
    const signStr   = TUYA_API_KEY + (token || '') + t + strToSign;
    const sign      = await _hmacSha256Upper(TUYA_API_SECRET, signStr);

    const headers = {
        'client_id':    TUYA_API_KEY,
        'sign':         sign,
        't':            String(t),
        'sign_method':  'HMAC-SHA256',
        'Content-Type': 'application/json'
    };
    if (token) headers['access_token'] = token;
    return headers;
}

// --- HTTP helper (usa CapacitorHttp nativo para evitar CORS) ---

async function _http(method, path, body, token) {
    // Serializar body a string para que la firma y el envío sean idénticos
    const bodyStr = body ? JSON.stringify(body) : '';
    const headers = await _buildHeaders(token || '', method, path, body || null);
    const url     = TUYA_BASE_URL + path;

    // Capacitor nativo
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
        const { CapacitorHttp } = window.Capacitor.Plugins;
        const opts = { url, headers, method };
        if (bodyStr) opts.data = bodyStr;
        const res = await CapacitorHttp.request(opts);
        return typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
    }

    // Fallback navegador
    const opts = { method, headers };
    if (bodyStr) opts.body = bodyStr;
    const res = await fetch(url, opts);
    return res.json();
}

// --- Token ---

async function _getToken() {
    if (_tuyaToken && Date.now() < _tuyaTokenExp) return _tuyaToken;

    const data = await _http('GET', '/v1.0/token?grant_type=1', null, '');
    if (!data.success) throw new Error(data.msg || 'Token error');

    _tuyaToken    = data.result.access_token;
    _tuyaTokenExp = Date.now() + (data.result.expire_time - 60) * 1000;
    return _tuyaToken;
}

// --- Device status & command ---

async function _getStatus(deviceId) {
    const token = await _getToken();
    const path  = `/v1.0/devices/${deviceId}/status`;
    const data  = await _http('GET', path, null, token);
    if (!data.success) throw new Error(data.msg);
    const sw = data.result.find(d => d.code === 'switch_1');
    return sw ? sw.value : false;
}

async function _sendCommand(deviceId, on) {
    const token   = await _getToken();
    const path    = `/v1.0/devices/${deviceId}/commands`;
    const bodyStr = JSON.stringify({ commands: [{ code: 'switch_1', value: on }] });
    const data    = await _http('POST', path, bodyStr, token);
    if (!data.success) throw new Error(data.msg);
    return data.result;
}

// --- UI helpers ---

function _applySocketUI(nombre, on) {
    const sw    = document.getElementById('switch'  + nombre);
    const track = document.getElementById('track'   + nombre);
    const thumb = document.getElementById('thumb'   + nombre);
    const icon  = document.getElementById('icon'    + nombre);
    const label = document.getElementById('estado'  + nombre);
    if (!sw) return;

    sw.checked             = on;
    track.style.background = on ? '#3b82f6' : '#334155';
    thumb.style.transform  = on ? 'translateX(22px)' : 'translateX(0)';
    icon.style.color       = on ? '#3b82f6' : '#64748b';
    label.textContent      = on ? 'Encendido' : 'Apagado';
    label.style.color      = on ? '#3b82f6'   : '#64748b';
}

function _mostrarError(msg) {
    const el = document.getElementById('socketError');
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 5000);
}

// --- Public API ---

async function abrirModalSockets() {
    const modal = document.getElementById('modalSockets');
    modal.style.display = 'flex';
    document.getElementById('socketError').style.display = 'none';

    ['Filtro', 'Escritorio'].forEach(n => {
        document.getElementById('estado' + n).textContent = 'Cargando...';
    });

    try {
        const [onFiltro, onEscritorio] = await Promise.all([
            _getStatus('bfa224ba6f56531d50u10e'),
            _getStatus('bf646439a304e0cb3banap')
        ]);
        _applySocketUI('Filtro',     onFiltro);
        _applySocketUI('Escritorio', onEscritorio);
    } catch (e) {
        _mostrarError('Error: ' + e.message);
        ['Filtro', 'Escritorio'].forEach(n => {
            document.getElementById('estado' + n).textContent = 'Sin conexión';
        });
    }
}

function cerrarModalSockets() {
    document.getElementById('modalSockets').style.display = 'none';
}

async function toggleSocket(deviceId, nombre, on) {
    document.getElementById('estado' + nombre).textContent = on ? 'Encendiendo...' : 'Apagando...';
    try {
        await _sendCommand(deviceId, on);
        _applySocketUI(nombre, on);
    } catch (e) {
        _mostrarError('Error ' + nombre + ': ' + e.message);
        _applySocketUI(nombre, !on);
    }
}

document.getElementById('modalSockets').addEventListener('click', function(e) {
    if (e.target === this) cerrarModalSockets();
});
