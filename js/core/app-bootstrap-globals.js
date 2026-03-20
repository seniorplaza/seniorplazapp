
    function _localDateStr(d) { const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),dd=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${dd}`; }
    function toggleFinanzasDropdown(button) {
        const dropdown = document.getElementById('finanzasDropdown');
        const isOpen = dropdown.classList.contains('show');
        
        if (isOpen) {
            cerrarFinanzasDropdown();
        } else {
            const rect = button.getBoundingClientRect();
            dropdown.style.position = 'fixed';
            dropdown.style.top = (rect.bottom + 8) + 'px';
            dropdown.style.left = (rect.left + rect.width / 2) + 'px';
            dropdown.style.transform = 'translateX(-50%)';
            dropdown.style.zIndex = '10002';

            dropdown.classList.add('show');
            const backdrop = document.getElementById('mobileBackdrop');
            if (backdrop) backdrop.classList.add('active');
            setTimeout(() => {
                document.addEventListener('click', cerrarFinanzasDropdownOutside);
            }, 0);
        }
    }
    
    function cerrarFinanzasDropdown() {
        const dropdown = document.getElementById('finanzasDropdown');
        dropdown.classList.remove('show');
        document.removeEventListener('click', cerrarFinanzasDropdownOutside);
        const backdrop = document.getElementById('mobileBackdrop');
        if (backdrop) backdrop.classList.remove('active');
    }
    
    function cerrarFinanzasDropdownOutside(e) {
        const dropdown = document.getElementById('finanzasDropdown');
        const button = e.target.closest('[onclick*="toggleFinanzasDropdown"]');
        if (!dropdown.contains(e.target) && !button) {
            cerrarFinanzasDropdown();
        }
    }
    function toggleViviendaDropdown(button) {
        const dropdown = document.getElementById('viviendaDropdown');
        const isOpen = dropdown.classList.contains('show');
        if (isOpen) {
            cerrarViviendaDropdown();
        } else {
            const rect = button.getBoundingClientRect();
            dropdown.style.position = 'fixed';
            dropdown.style.top = (rect.bottom + 8) + 'px';
            dropdown.style.left = (rect.left + rect.width / 2) + 'px';
            dropdown.style.transform = 'translateX(-50%)';
            dropdown.style.zIndex = '10002';
            dropdown.classList.add('show');
            const backdrop = document.getElementById('mobileBackdrop');
            if (backdrop) backdrop.classList.add('active');
            setTimeout(() => {
                document.addEventListener('click', cerrarViviendaDropdownOutside);
            }, 0);
        }
    }

    function cerrarViviendaDropdown() {
        const dropdown = document.getElementById('viviendaDropdown');
        dropdown.classList.remove('show');
        document.removeEventListener('click', cerrarViviendaDropdownOutside);
        const backdrop = document.getElementById('mobileBackdrop');
        if (backdrop) backdrop.classList.remove('active');
    }

    function cerrarViviendaDropdownOutside(e) {
        const dropdown = document.getElementById('viviendaDropdown');
        const button = e.target.closest('[onclick*="toggleViviendaDropdown"]');
        if (!dropdown.contains(e.target) && !button) {
            cerrarViviendaDropdown();
        }
    }

    function toggleAgendaDropdown(button) {
        const dropdown = document.getElementById('agendaDropdown');
        const isOpen = dropdown.classList.contains('show');
        if (isOpen) {
            cerrarAgendaDropdown();
        } else {
            cerrarFinanzasDropdown && cerrarFinanzasDropdown();
            cerrarViviendaDropdown && cerrarViviendaDropdown();
            const rect = button.getBoundingClientRect();
            dropdown.style.position = 'fixed';
            dropdown.style.top = (rect.bottom + 8) + 'px';
            dropdown.style.left = (rect.left + rect.width / 2) + 'px';
            dropdown.style.transform = 'translateX(-50%)';
            dropdown.style.zIndex = '10002';
            dropdown.classList.add('show');
            const backdrop = document.getElementById('mobileBackdrop');
            if (backdrop) backdrop.classList.add('active');
            setTimeout(() => {
                document.addEventListener('click', cerrarAgendaDropdownOutside);
            }, 0);
        }
    }

    function cerrarAgendaDropdown() {
        const dropdown = document.getElementById('agendaDropdown');
        if (!dropdown) return;
        dropdown.classList.remove('show');
        document.removeEventListener('click', cerrarAgendaDropdownOutside);
        const backdrop = document.getElementById('mobileBackdrop');
        if (backdrop) backdrop.classList.remove('active');
    }

    function cerrarAgendaDropdownOutside(e) {
        const dropdown = document.getElementById('agendaDropdown');
        const button = e.target.closest('[onclick*="toggleAgendaDropdown"]');
        if (!dropdown.contains(e.target) && !button) {
            cerrarAgendaDropdown();
        }
    }
    function toggleFitnessDropdown(button) {
        const dropdown = document.getElementById('fitnessDropdown');
        const isOpen = dropdown.classList.contains('show');
        if (isOpen) {
            cerrarFitnessDropdown();
        } else {
            cerrarFinanzasDropdown && cerrarFinanzasDropdown();
            cerrarViviendaDropdown && cerrarViviendaDropdown();
            cerrarAgendaDropdown && cerrarAgendaDropdown();
            const rect = button.getBoundingClientRect();
            dropdown.style.position = 'fixed';
            dropdown.style.top = (rect.bottom + 8) + 'px';
            dropdown.style.left = (rect.left + rect.width / 2) + 'px';
            dropdown.style.transform = 'translateX(-50%)';
            dropdown.style.zIndex = '10002';
            dropdown.classList.add('show');
            const backdrop = document.getElementById('mobileBackdrop');
            if (backdrop) backdrop.classList.add('active');
            setTimeout(() => {
                document.addEventListener('click', cerrarFitnessDropdownOutside);
            }, 0);
        }
    }

    function cerrarFitnessDropdown() {
        const dropdown = document.getElementById('fitnessDropdown');
        if (!dropdown) return;
        dropdown.classList.remove('show');
        document.removeEventListener('click', cerrarFitnessDropdownOutside);
        const backdrop = document.getElementById('mobileBackdrop');
        if (backdrop) backdrop.classList.remove('active');
    }

    function cerrarFitnessDropdownOutside(e) {
        const dropdown = document.getElementById('fitnessDropdown');
        const button = e.target.closest('[onclick*="toggleFitnessDropdown"]');
        if (!dropdown.contains(e.target) && !button) {
            cerrarFitnessDropdown();
        }
    }
    
    if (!window.nutricionData) {
        window.nutricionData = { comidas: [], registrosPeso: [], objetivos: { kcal: 2000, prot: 100, carbs: 250, grasas: 65 } };
    }
    if (!window.nutricionData.objetivos) {
        window.nutricionData.objetivos = { kcal: 2000, prot: 100, carbs: 250, grasas: 65 };
    }
    if (!window.finanzasData) {
        window.finanzasData = {
            categorias: [],
            operaciones: [],
            programados: [],
            cuentaActiva: null,
            categoriaSeleccionada: null,
            tipoOperacionActual: 'EXPENSE',
            filtroTemporal: 'mes'
        };
    }
    
    function cargarFinanzasData() {
        if (Array.isArray(window.finanzasData.categorias) && window.finanzasData.categorias.length > 0) return;
        if (Array.isArray(window.finanzasData.operaciones) && window.finanzasData.operaciones.length > 0) return;
        try {
            const saved = localStorage.getItem('finanzasData');
            if (saved) {
                const data = JSON.parse(saved);
                if (Array.isArray(data.categorias)) window.finanzasData.categorias = data.categorias;
                if (Array.isArray(data.operaciones)) window.finanzasData.operaciones = data.operaciones;
                if (typeof guardarDatos === 'function') guardarDatos();
                try { localStorage.removeItem('finanzasData'); } catch(e) {}
            } else {
                if (!Array.isArray(window.finanzasData.operaciones)) window.finanzasData.operaciones = [];
                if (!Array.isArray(window.finanzasData.categorias)) window.finanzasData.categorias = [];
            }
        } catch(e) {
        }
    }
    
    function guardarFinanzasData() {
        if (typeof guardarDatos === 'function') {
            guardarDatos();
        } else {
            try {
                localStorage.setItem('finanzasData', JSON.stringify({
                    categorias: window.finanzasData.categorias,
                    operaciones: window.finanzasData.operaciones,
                    programados: window.finanzasData.programados || []
                }));
            } catch (e) {}
        }
    }
    if (!window.agendaData) {
        window.agendaData = { habitos: [], tareasRecurrentes: [], tareas: [] };
    }
    function cargarAgendaData() {
        const a = window.agendaData;
        if ((a.habitos && a.habitos.length > 0) || (a.tareas && a.tareas.length > 0) || (a.tareasRecurrentes && a.tareasRecurrentes.length > 0)) return;
        try {
            const s = localStorage.getItem('agendaData');
            if (s) {
                const d = JSON.parse(s);
                window.agendaData = Object.assign({ habitos:[], tareasRecurrentes:[], tareas:[] }, d);
                if (typeof guardarDatos === 'function') guardarDatos();
                try { localStorage.removeItem('agendaData'); } catch(e) {}
            }
        } catch(e) {}
    }
    function guardarAgendaData() {
        if (typeof guardarDatos === 'function') {
            guardarDatos();
        } else {
            try { localStorage.setItem('agendaData', JSON.stringify(window.agendaData)); } catch(e) {}
        }
    }
    window.guardarAgendaData = guardarAgendaData;
    window.cargarAgendaData = cargarAgendaData;
    window._modalAddGastoModo = 'euro';

    function _setModalAddGastoCamposVisibles(visible) {
        const modal = document.getElementById('modalAddGasto');
        if (!modal) return;
        modal.querySelectorAll('[data-euro-campo]').forEach(el => {
            if (visible) {
                if (el.id === 'modalGastoCuentaSection') el.style.display = window._modalGastoDesdeOperaciones ? 'block' : 'none';
                else if (el.id === 'modalSubtagSection') { /* se maneja internamente */ }
                else if (el.id === 'modalGastoFrecSection') el.style.display = window._modalGastoDesdeOperaciones ? 'none' : 'block';
                else el.style.display = '';
            } else {
                if (el.id === 'modalSubtagSection') { /* nunca ocultar desde aquí */ }
                else el.style.display = 'none';
            }
        });
    }

    function toggleModalAddGastoModo(modo) {
        if (!modo) modo = window._modalAddGastoModo === 'euro' ? 'book' : 'euro';
        window._modalAddGastoModo = modo;
        const btnEuro = document.getElementById('modalAddGastoModoEuro');
        const btnBook = document.getElementById('modalAddGastoModoBook');
        const titulo = document.getElementById('modalAddGastoTitulo');
        const actDiv = document.getElementById('modalAddGastoActividadDiv');
        if (btnEuro) {
            btnEuro.style.background = modo === 'euro' ? 'rgba(59,130,246,0.9)' : 'transparent';
            btnEuro.style.boxShadow = modo === 'euro' ? '0 2px 8px rgba(59,130,246,0.35)' : 'none';
            btnEuro.querySelector('span').style.color = modo === 'euro' ? '#fff' : '#475569';
        }
        if (btnBook) {
            btnBook.style.background = modo === 'book' ? 'rgba(59,130,246,0.9)' : 'transparent';
            btnBook.style.boxShadow = modo === 'book' ? '0 2px 8px rgba(59,130,246,0.35)' : 'none';
            btnBook.querySelector('span').style.color = modo === 'book' ? '#fff' : '#475569';
        }

        if (modo === 'book') {
            if (titulo) titulo.textContent = 'Nueva Actividad';
            _setModalAddGastoCamposVisibles(false);
            renderModalCategorias(window._modalGastoTipo);
            const actContainer = document.getElementById('modalAddGastoActividadDiv');
            if (actContainer) {
                actContainer.style.display = 'block';
                actContainer.innerHTML = `
                <p style="color:#94a3b8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px 0;">Selecciona el tipo</p>
                <div style="display:flex;flex-direction:column;gap:10px;">
                    <button onclick="actIniciarDesdeModal('habito')" style="display:flex;align-items:center;gap:12px;width:100%;background:rgba(16,185,129,0.08);border:1.5px solid rgba(16,185,129,0.25);border-radius:14px;padding:14px 16px;cursor:pointer;">
                        <div style="width:38px;height:38px;border-radius:11px;background:rgba(16,185,129,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><span class="material-symbols-rounded" style="color:#10b981;font-size:20px;">repeat</span></div>
                        <div style="text-align:left;"><div style="color:white;font-size:14px;font-weight:700;">Hábito</div><div style="color:#64748b;font-size:12px;">Seguimiento continuo de un comportamiento</div></div>
                        <span class="material-symbols-rounded" style="color:#334155;font-size:18px;margin-left:auto;">chevron_right</span>
                    </button>
                    <button onclick="actIniciarDesdeModal('tareaRecurrente')" style="display:flex;align-items:center;gap:12px;width:100%;background:rgba(59,130,246,0.08);border:1.5px solid rgba(59,130,246,0.25);border-radius:14px;padding:14px 16px;cursor:pointer;">
                        <div style="width:38px;height:38px;border-radius:11px;background:rgba(59,130,246,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><span class="material-symbols-rounded" style="color:#60a5fa;font-size:20px;">event_repeat</span></div>
                        <div style="text-align:left;"><div style="color:white;font-size:14px;font-weight:700;">Tarea Recurrente</div><div style="color:#64748b;font-size:12px;">Tarea que se repite según una programación</div></div>
                        <span class="material-symbols-rounded" style="color:#334155;font-size:18px;margin-left:auto;">chevron_right</span>
                    </button>
                    <button onclick="actIniciarDesdeModal('tarea')" style="display:flex;align-items:center;gap:12px;width:100%;background:rgba(245,158,11,0.08);border:1.5px solid rgba(245,158,11,0.25);border-radius:14px;padding:14px 16px;cursor:pointer;">
                        <div style="width:38px;height:38px;border-radius:11px;background:rgba(245,158,11,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><span class="material-symbols-rounded" style="color:#f59e0b;font-size:20px;">task_alt</span></div>
                        <div style="text-align:left;"><div style="color:white;font-size:14px;font-weight:700;">Tarea</div><div style="color:#64748b;font-size:12px;">Una tarea puntual con fecha y hora</div></div>
                        <span class="material-symbols-rounded" style="color:#334155;font-size:18px;margin-left:auto;">chevron_right</span>
                    </button>
                </div>`;
            }
        } else {
            const isIncome = window._modalGastoTipo === 'INCOME';
            if (titulo) titulo.textContent = isIncome ? 'Nuevo Ingreso' : 'Nuevo Gasto';
            _setModalAddGastoCamposVisibles(true);
            if (actDiv) actDiv.style.display = 'none';
            renderModalCategorias(window._modalGastoTipo);
        }
    }

    function actIniciarDesdeModal(tipo) {
        const catId = window._modalGastoCatSeleccionada;
        const cat = catId && window.finanzasData ? window.finanzasData.categorias.find(c => c.id === catId) : null;
        const catInfo = cat ? { icono: cat.icon, color: cat.color, nombre: cat.name } : {};
        document.getElementById('modalAddGasto').style.display = 'none';

        window._actState = {
            tipo,
            subtipo: null,
            paso: 0,
            pasos: tipo === 'tarea' ? ['definicion'] : ['evaluacion', 'definicion', 'frecuencia', 'cuando'],
            datos: { categoria: catInfo }
        };
        abrirModalActividadConEstado();
    }
    cargarAgendaData();
        (function() {
            function blockCtx(e) {
                var t = e.target ? e.target.tagName.toLowerCase() : '';
                var el = e.target;
                if (t === 'input' || t === 'textarea') return;
                while (el) {
                    if (el.classList && (el.classList.contains('dropdown-content') || 
                        el.classList.contains('dropdown-menu') ||
                        el.classList.contains('dropdown-trigger'))) {
                        return;
                    }
                    el = el.parentElement;
                }
                
                e.preventDefault();
                return false;
            }
            document.addEventListener('contextmenu', blockCtx, true);
            window.addEventListener('contextmenu', blockCtx, true);
            document.addEventListener('selectstart', function(e) {
                var t = e.target ? e.target.tagName.toLowerCase() : '';
                var el = e.target;
                if (t === 'input' || t === 'textarea') return;
                while (el) {
                    if (el.classList && (el.classList.contains('dropdown-content') || 
                        el.classList.contains('dropdown-menu') ||
                        el.classList.contains('dropdown-trigger'))) {
                        return;
                    }
                    el = el.parentElement;
                }
                
                e.preventDefault();
            }, true);
            var _lp = null;
            document.addEventListener('touchstart', function(e) {
                var el = e.target;
                var tag = el ? el.tagName.toLowerCase() : '';
                if (tag === 'input' || tag === 'textarea') return;
                _lp = setTimeout(function() { _lp = null; }, 500);
            }, { passive: true });

            document.addEventListener('touchend', function() {
                if (_lp) { clearTimeout(_lp); _lp = null; }
            }, { passive: true });
        })();
    
