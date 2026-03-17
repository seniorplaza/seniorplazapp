
    function abrirSelectorMiniaturaGimnasio() {
        if (typeof window._setTipoElementoActual === 'function') window._setTipoElementoActual('gimnasio-miniatura-derecha');
        if (typeof abrirModalIconos === 'function') abrirModalIconos();
    }
    document.addEventListener('DOMContentLoaded', function() {
        const gWrap = document.getElementById('gimnasioMiniaturaDerechaWrap');
        const gEl   = document.getElementById('gimnasioMiniaturaDerechaIcono');
        const gImg  = localStorage.getItem('gimnasioMiniaturaDerechaImg');
        const gIcono = localStorage.getItem('gimnasioMiniaturaDerechaIcono');
        const gColor = localStorage.getItem('gimnasioMiniaturaDerechaColor');
        if (gImg && gWrap) {
            if (gEl) gEl.style.display = 'none';
            let imgEl = document.createElement('img');
            imgEl.className = 'gimnasio-mini-img';
            imgEl.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:10px;position:absolute;inset:0;';
            gWrap.style.position = 'relative';
            gWrap.style.overflow = 'hidden';
            imgEl.src = gImg;
            gWrap.appendChild(imgEl);
        } else if (gIcono && gEl) {
            gEl.textContent = gIcono;
            gEl.style.color = gColor || '#eab308';
        }
        if (gWrap && typeof attachIconLongPress === 'function') {
            attachIconLongPress(gWrap, function() {
                abrirSelectorMiniaturaGimnasio();
            });
        }
    });
    
