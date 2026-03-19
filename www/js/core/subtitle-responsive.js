
    (function() {
        function ajustarSubtitulo() {
            var t = document.getElementById('tituloApp');
            var s = document.getElementById('subtituloApp');
            if (!t || !s) return;
            s.style.width = 'auto';
            s.style.letterSpacing = '0.22em';
            var tW = t.offsetWidth;
            var sW = s.offsetWidth;
            if (tW <= 0 || sW <= 0) return;
            var chars = s.value.length;
            if (chars < 2) return;
            var diff = tW - sW;
            var fsStr = getComputedStyle(s).fontSize;
            var fs = parseFloat(fsStr);
            var currentLS = parseFloat(getComputedStyle(s).letterSpacing) || 0;
            var extraPerChar = diff / (chars - 1);
            var newLS = currentLS + extraPerChar;
            s.style.letterSpacing = newLS + 'px';
        }
        if (document.readyState === 'complete') { ajustarSubtitulo(); }
        else { window.addEventListener('load', ajustarSubtitulo); }
    })();
    
