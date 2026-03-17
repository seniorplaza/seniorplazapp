
window.toggleFiltroAccordion = function(btn) {
    const acc = btn.closest('.filtro-accordion');
    const body = acc.querySelector('.filtro-accordion-body');
    const isOpen = acc.classList.contains('abierto');
    body.style.display = isOpen ? 'none' : 'block';
    acc.classList.toggle('abierto', !isOpen);
};

