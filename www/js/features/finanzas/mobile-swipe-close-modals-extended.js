
(function() {
    // Swipe-to-close desactivado: los modales solo se cierran con X o Guardar/Confirmar
    return;
    const closeFns = {
        'modalEditarOp':           () => { document.getElementById('modalEditarOp').style.display = 'none'; },
        'modalAddGasto':           () => { if (typeof cerrarModalAddGasto === 'function') cerrarModalAddGasto(); else document.getElementById('modalAddGasto').style.display = 'none'; },
        'modalProgramado':         () => { if (typeof cerrarModalProgramado === 'function') cerrarModalProgramado(); },
        'modalEditarProgramado':   () => { if (typeof cerrarModalEditarProgramado === 'function') cerrarModalEditarProgramado(); },
        'modalSelectorCuenta':     () => { document.getElementById('modalSelectorCuenta').style.display = 'none'; },
        'modalIconos':             () => { if (typeof cerrarModalIconos === 'function') cerrarModalIconos(); else document.getElementById('modalIconos').style.display = 'none'; },
        'modalActividad':          () => { if (typeof cerrarModalActividad === 'function') cerrarModalActividad(); else document.getElementById('modalActividad').style.display = 'none'; },
        'modalEstadisticasHabito': () => { document.getElementById('modalEstadisticasHabito').style.display = 'none'; },
        'modalCalHistorico':       () => { document.getElementById('modalCalHistorico').style.display = 'none'; },
        'modalIntervaloTiempo':    () => { if (typeof cerrarModalIntervalo === 'function') cerrarModalIntervalo(); else document.getElementById('modalIntervaloTiempo').style.display = 'none'; },
        'modalNuevaCategoria':     () => { document.getElementById('modalNuevaCategoria').style.display = 'none'; },
        'modalEditarCategoria':    () => { document.getElementById('modalEditarCategoria').style.display = 'none'; },
    };

    function resetInner(inner) {
        if (!inner) return;
        inner.style.transition = '';
        inner.style.transform  = '';
        inner.style.opacity    = '';
    }

    function attachSwipe(overlayId, closeFn) {
        const overlay = document.getElementById(overlayId);
        if (!overlay) return;
        if (overlay.classList.contains('finanzas-scroll-modal')) return;

        function getInner() {
            for (let i = 0; i < overlay.children.length; i++) {
                const c = overlay.children[i];
                if (c.offsetHeight > 60) return c;
            }
            return overlay.children[0] || null;
        }
        const obs = new MutationObserver(() => {
            if (overlay.style.display !== 'none') resetInner(getInner());
        });
        obs.observe(overlay, { attributes: true, attributeFilter: ['style'] });

        let startY = 0, startX = 0, dragging = false, inner = null;

        overlay.addEventListener('touchstart', function(e) {
            if (window.innerWidth > 768) return;
            inner = getInner();
            if (!inner) return;
            const touch = e.touches[0];
            const rect = inner.getBoundingClientRect();
            if (touch.clientX < rect.left || touch.clientX > rect.right ||
                touch.clientY < rect.top  || touch.clientY > rect.bottom) { inner = null; return; }
            if (inner.scrollTop > 10) { inner = null; return; }
            startY = touch.clientY;
            startX = touch.clientX;
            dragging = true;
            inner.style.transition = 'none';
        }, { passive: true });

        overlay.addEventListener('touchmove', function(e) {
            if (!dragging || !inner) return;
            const touch = e.touches[0];
            const dy = touch.clientY - startY;
            const dx = touch.clientX - startX;
            if (Math.abs(dx) > Math.abs(dy) + 10) { dragging = false; resetInner(inner); return; }
            if (dy > 0) {
                inner.style.transform = `translateY(${dy}px)`;
                inner.style.opacity   = String(Math.max(0.4, 1 - dy / 280));
            }
        }, { passive: true });

        overlay.addEventListener('touchend', function(e) {
            if (!dragging || !inner) return;
            dragging = false;
            const dy = e.changedTouches[0].clientY - startY;
            const _inner = inner;
            inner = null;
            _inner.style.transition = 'transform 0.22s ease, opacity 0.22s ease';
            if (dy > 80) {
                _inner.style.transform = 'translateY(110%)';
                _inner.style.opacity   = '0';
                setTimeout(() => { closeFn(); resetInner(_inner); }, 230);
            } else {
                resetInner(_inner);
            }
        }, { passive: true });
    }

    function initSwipes() {
        Object.entries(closeFns).forEach(([id, fn]) => attachSwipe(id, fn));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSwipes);
    } else {
        initSwipes();
    }
})();

