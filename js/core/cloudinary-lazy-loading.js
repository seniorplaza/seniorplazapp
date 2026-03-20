
// ── Lazy loading global para imágenes de Cloudinary ─────────────────
(function() {
    function aplicarLazy(img) {
        if (!img.src || !img.src.includes('res.cloudinary.com')) return;
        if (img.loading === 'lazy') return;
        img.loading = 'lazy';
        // Decoding async para no bloquear el hilo principal
        img.decoding = 'async';
    }
    // Imágenes ya existentes
    document.querySelectorAll('img').forEach(aplicarLazy);
    // Imágenes nuevas añadidas dinámicamente
    new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
            m.addedNodes.forEach(function(node) {
                if (node.nodeType !== 1) return;
                if (node.tagName === 'IMG') { aplicarLazy(node); return; }
                node.querySelectorAll && node.querySelectorAll('img').forEach(aplicarLazy);
            });
        });
    }).observe(document.body, { childList: true, subtree: true });
})();

