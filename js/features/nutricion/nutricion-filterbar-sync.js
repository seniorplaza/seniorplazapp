
// ── Sincronizar ancho de filtros con el container del main en móvil ──
(function() {
    function syncFilterBars() {
        if (window.innerWidth >= 769) return;
        const main = document.querySelector('main');
        if (!main) return;
        const rect = main.getBoundingClientRect();
        // 12px padding del main + 4px del border del container = 16px cada lado
        const left  = Math.round(rect.left + 16);
        const right = Math.round(window.innerWidth - rect.right + 16);
        ['filtros-bar', 'filtros-bar-gym', 'filtros-bar-nutri'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.style.left  = left + 'px';
            el.style.right = right + 'px';
            el.style.width = 'auto';
        });
    }
    document.addEventListener('DOMContentLoaded', () => {
        syncFilterBars();
        setTimeout(syncFilterBars, 100);
        setTimeout(syncFilterBars, 500);
    });
    window.addEventListener('resize', syncFilterBars);
    if (document.readyState === 'complete') {
        syncFilterBars();
        setTimeout(syncFilterBars, 100);
    }
})();

