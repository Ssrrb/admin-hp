// Especialidades Database
const especialidadesDB = [];

function initEspecialidades() {
    const searchInput = document.getElementById('searchEspecialidad');
    const form = document.getElementById('especialidadForm');
    const cancelBtn = document.getElementById('cancelEdit');

    // Load initial data
    loadEspecialidades();

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            renderEspecialidades(this.value.toLowerCase());
        });
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const idInput = document.getElementById('especialidadId');
            const nombreInput = document.getElementById('nombreEspecialidad');
            const descripcionInput = document.getElementById('descripcionEspecialidad');
            const submitBtn = form.querySelector('button[type="submit"]');

            const id = idInput.value;
            const nombre = nombreInput.value.trim();
            const descripcion = descripcionInput.value.trim();

            if (!nombre) {
                alert('El nombre de la especialidad es requerido');
                return;
            }

            // Loading state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Guardando...';

            try {
                const url = id ? `/api/especialidades/${id}` : '/api/especialidades';
                const method = id ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nombre, descripcion })
                });

                const data = await response.json();

                if (response.ok) {
                    // Reload list
                    await loadEspecialidades();
                    resetEspecialidadForm();
                    // Show success feedback (optional)
                } else {
                    alert('Error: ' + data.error);
                }
            } catch (error) {
                console.error('Error saving especialidad:', error);
                alert('Error al guardar la especialidad');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    // Cancel edit
    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetEspecialidadForm);
    }
}

async function loadEspecialidades() {
    try {
        const response = await fetch('/api/especialidades');
        const data = await response.json();

        especialidadesDB.length = 0;
        especialidadesDB.push(...data.map(esp => ({
            id: esp.ID_ESPECIALIDAD,
            nombre: esp.NOMBRE,
            descripcion: esp.DESCRIPCION || '',
            medicosCount: esp.CANTIDAD_MEDICOS || 0 // Assuming API returns this or we calculate it
        })));

        renderEspecialidades();
    } catch (error) {
        console.error('Error loading especialidades:', error);
        const listContainer = document.getElementById('especialidadesList');
        if (listContainer) {
            listContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon" style="border-color: var(--danger); color: var(--danger);">
                    <i class="bi bi-exclamation-triangle"></i>
                </div>
                <p>Error al cargar especialidades</p>
                <small>${error.message}</small>
            </div>
        `;
        }
    }
}

function renderEspecialidades(searchTerm = '') {
    const listContainer = document.getElementById('especialidadesList');
    if (!listContainer) return;

    const filtered = especialidadesDB.filter(esp =>
        esp.nombre.toLowerCase().includes(searchTerm) ||
        esp.descripcion.toLowerCase().includes(searchTerm)
    );

    if (filtered.length === 0) {
        listContainer.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">
                <i class="bi bi-search"></i>
            </div>
            <p>${searchTerm ? 'No se encontraron resultados' : 'No hay especialidades registradas'}</p>
            <small>${searchTerm ? 'Intenta con otro término de búsqueda' : 'Registra la primera especialidad usando el formulario'}</small>
        </div>
    `;
        return;
    }

    listContainer.innerHTML = filtered.map(esp => `
    <div class="specialty-card" onclick="editSpecialty(${esp.id})">
        <div class="specialty-icon-badge">
            ${esp.nombre.charAt(0).toUpperCase()}
        </div>
        <div class="specialty-info">
            <h5>${esp.nombre}</h5>
            <p>${esp.descripcion || 'Sin descripción'}</p>
            <div class="specialty-meta">
                <i class="bi bi-people-fill"></i>
                <span>${esp.medicosCount} médicos registrados</span>
            </div>
        </div>
        <div class="specialty-actions">
            <button class="btn-icon-action" onclick="event.stopPropagation(); editSpecialty(${esp.id})" title="Editar">
                <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-icon-action danger" onclick="event.stopPropagation(); deleteSpecialty(${esp.id})" title="Eliminar">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    </div>
`).join('');
}

function resetEspecialidadForm() {
    const form = document.getElementById('especialidadForm');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelEdit');
    const idInput = document.getElementById('especialidadId');

    if (form) {
        form.reset();
        idInput.value = '';
        formTitle.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Nueva Especialidad';
        submitBtn.innerHTML = '<i class="bi bi-save me-2"></i>Guardar Especialidad';
        cancelBtn.style.display = 'none';

        // Remove highlight from card
        document.querySelectorAll('.specialty-card').forEach(c => c.style.borderColor = '');
    }
}

function editSpecialty(id) {
    const especialidad = especialidadesDB.find(e => e.id === id);
    if (!especialidad) return;

    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelEdit');
    const idInput = document.getElementById('especialidadId');
    const nombreInput = document.getElementById('nombreEspecialidad');
    const descripcionInput = document.getElementById('descripcionEspecialidad');

    // Fill form
    idInput.value = especialidad.id;
    nombreInput.value = especialidad.nombre;
    descripcionInput.value = especialidad.descripcion;

    // Update UI
    formTitle.innerHTML = '<i class="bi bi-pencil-square me-2"></i>Editar Especialidad';
    submitBtn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Actualizar';
    cancelBtn.style.display = 'inline-flex';

    // Scroll to form on mobile
    if (window.innerWidth < 968) {
        document.querySelector('.specialty-form-panel').scrollIntoView({ behavior: 'smooth' });
    }

    // Highlight selected card
    /*
    document.querySelectorAll('.specialty-card').forEach(c => c.style.borderColor = '');
    const selectedCard = [...document.querySelectorAll('.specialty-card')].find(c =>
        c.querySelector('h5').textContent === especialidad.nombre
    );
    if (selectedCard) selectedCard.style.borderColor = 'var(--primary)';
    */
}

async function deleteSpecialty(id) {
    const especialidad = especialidadesDB.find(e => e.id === id);
    if (!especialidad) return;

    ModalManager.show({
        title: '¿Eliminar Especialidad?',
        message: 'Esta acción no se puede deshacer. Si hay médicos asignados a esta especialidad, no se podrá eliminar.',
        detailLabel: 'Especialidad',
        detailValue: especialidad.nombre,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'danger',
        onConfirm: async () => {
            try {
                const response = await fetch(`/api/especialidades/${id}`, {
                    method: 'DELETE'
                });

                const data = await response.json();

                if (response.ok) {
                    await loadEspecialidades();
                    resetEspecialidadForm();
                } else {
                    alert('Error: ' + data.error);
                    throw new Error(data.error);
                }
            } catch (error) {
                alert('Error al eliminar especialidad: ' + error.message);
                throw error;
            }
        }
    });
}

// Initialize if the script is loaded and the form exists
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('especialidadForm')) {
        initEspecialidades();
    }
});
