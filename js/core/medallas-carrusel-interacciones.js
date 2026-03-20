
function _medalScrollCheck() {
    const el = document.getElementById('_medalScroll');
    if (!el) return;
    const atStart = el.scrollLeft <= 8;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    const fadeW = 80; // px del fade
    const left = atStart ? '0%' : `${fadeW}px`;
    const right = atEnd ? '100%' : `calc(100% - ${fadeW}px)`;
    const mask = `linear-gradient(to right, transparent 0%, black ${left}, black ${right}, transparent 100%)`;
    el.style.webkitMaskImage = mask;
    el.style.maskImage = mask;
    const fl = document.getElementById('_medalFadeLeft');
    const fr = document.getElementById('_medalFadeRight');
    if (fl) fl.style.display = 'none';
    if (fr) fr.style.display = 'none';
}
function _medalWheel(e) {
    e.preventDefault();
    const el = document.getElementById('_medalScroll');
    if (el) el.scrollLeft += e.deltaY * 0.8;
}
function _medalDragStart(e) {
    const el = e.currentTarget;
    el.style.cursor = 'grabbing';
    const startX = e.pageX - el.getBoundingClientRect().left;
    const scrollLeft = el.scrollLeft;
    function onMove(ev) {
        const x = ev.pageX - el.getBoundingClientRect().left;
        el.scrollLeft = scrollLeft - (x - startX);
    }
    function onUp() {
        el.style.cursor = 'grab';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
}

