/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-return-assign */
// Médicos database
const medicosDB = []

async function loadEspecialidadesForMedicos () {
  try {
    const response = await fetch('/api/especialidades')
    const especialidades = await response.json()

    // Cargar en el filtro de especialidades
    const filterSelect = document.getElementById('filterEspecialidad')
    if (filterSelect) {
      const currentValue = filterSelect.value
      filterSelect.innerHTML = '<option value="">Todas las especialidades</option>'
      especialidades.forEach(esp => {
        const option = document.createElement('option')
        option.value = esp.ID_ESPECIALIDAD
        option.textContent = esp.NOMBRE
        filterSelect.appendChild(option)
      })
      filterSelect.value = currentValue
    }

    // Cargar en el formulario de registro
    const formSelect = document.getElementById('especialidad')
    if (formSelect) {
      const currentValue = formSelect.value
      formSelect.innerHTML = '<option value="" disabled selected></option>'
      especialidades.forEach(esp => {
        const option = document.createElement('option')
        option.value = esp.ID_ESPECIALIDAD
        option.textContent = esp.NOMBRE
        formSelect.appendChild(option)
      })
      if (currentValue) formSelect.value = currentValue
    }
  } catch (error) {
    console.error('Error al cargar especialidades:', error)
  }
}

function initMedicos () {
  const btnAgregarMedico = document.getElementById('btnAgregarMedico')
  const btnVolverLista = document.getElementById('btnVolverLista')
  const searchInput = document.getElementById('searchMedico')
  const filterEspecialidad = document.getElementById('filterEspecialidad')
  const medicosListView = document.getElementById('medicosListView')
  const medicosFormView = document.getElementById('medicosFormView')

  // Cargar especialidades primero
  loadEspecialidadesForMedicos()

  if (btnAgregarMedico) {
    btnAgregarMedico.addEventListener('click', function () {
      // Reset form for new medico
      const form = document.getElementById('registroMedicoForm')
      if (form) {
        form.reset()
        document.getElementById('medicoId').value = ''

        // Reset all checkboxes
        const checkboxes = form.querySelectorAll('input[type="checkbox"]')
        checkboxes.forEach(cb => cb.checked = false)

        // Reset form title
        const formHeader = document.querySelector('.form-header h3')
        if (formHeader) {
          formHeader.textContent = 'Registrar Nuevo Médico'
        }

        // Reset submit button text
        const submitBtn = form.querySelector('.btn-primary-custom')
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i><span>Registrar Médico</span>'
        }
      }

      medicosListView.style.display = 'none'
      medicosFormView.style.display = 'block'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  if (btnVolverLista) {
    btnVolverLista.addEventListener('click', function () {
      // Reset form when going back
      const form = document.getElementById('registroMedicoForm')
      if (form) {
        form.reset()
        document.getElementById('medicoId').value = ''

        // Reset all checkboxes
        const checkboxes = form.querySelectorAll('input[type="checkbox"]')
        checkboxes.forEach(cb => cb.checked = false)

        // Reset form title
        const formHeader = document.querySelector('.form-header h3')
        if (formHeader) {
          formHeader.textContent = 'Registrar Nuevo Médico'
        }

        // Reset submit button text
        const submitBtn = form.querySelector('.btn-primary-custom')
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i><span>Registrar Médico</span>'
        }
      }

      medicosFormView.style.display = 'none'
      medicosListView.style.display = 'block'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const specialty = filterEspecialidad ? filterEspecialidad.value : ''
      renderMedicos(this.value.toLowerCase(), specialty)
    })
  }

  // Filter functionality
  if (filterEspecialidad) {
    filterEspecialidad.addEventListener('change', function () {
      const search = searchInput ? searchInput.value.toLowerCase() : ''
      renderMedicos(search, this.value)
    })
  }

  // Load data from API
  loadMedicos()

  // Initialize form logic
  initMedicoForm()
}

async function loadMedicos () {
  try {
    const response = await fetch('/api/medicos')
    const data = await response.json()

    medicosDB.length = 0
    medicosDB.push(...data.map(medico => {
      // Formatear fecha de nacimiento
      let fechaNacimiento = 'No disponible'
      if (medico.FECHA_NACIMIENTO) {
        const fecha = new Date(medico.FECHA_NACIMIENTO)
        fechaNacimiento = fecha.toLocaleDateString('es-AR')
      }

      // Calcular edad
      let edad = ''
      if (medico.FECHA_NACIMIENTO) {
        const hoy = new Date()
        const nacimiento = new Date(medico.FECHA_NACIMIENTO)
        let edadCalculada = hoy.getFullYear() - nacimiento.getFullYear()
        const mes = hoy.getMonth() - nacimiento.getMonth()
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
          edadCalculada--
        }
        edad = `${edadCalculada} años`
      }

      // Formatear horario de atención
      let horario = 'Horario no configurado'
      let diasAtencion = []
      if (medico.HORA_INICIO && medico.HORA_FIN) {
        // Formatear las horas (eliminar segundos si existen)
        const horaInicio = medico.HORA_INICIO.substring(0, 5)
        const horaFin = medico.HORA_FIN.substring(0, 5)
        horario = `${horaInicio} - ${horaFin}`

        if (medico.DIAS_ATENCION) {
          diasAtencion = medico.DIAS_ATENCION.split(',')
        }
      }

      return {
        id: medico.ID_MEDICO,
        nombre: medico.NOMBRE,
        apellido: medico.APELLIDO,
        dni: medico.NRO_DOCUMENTO,
        tipoDocumento: medico.TIPO_DOCUMENTO,
        fechaNacimiento,
        edad,
        especialidad: medico.ID_ESPECIALIDAD,
        especialidadNombre: medico.ESPECIALIDAD_NOMBRE || 'Sin especialidad',
        matricula: medico.MATRICULA,
        email: medico.EMAIL || 'Sin email',
        telefono: medico.TELEFONO || 'Sin teléfono',
        horario,
        diasAtencion,
        horaInicio: medico.HORA_INICIO ? medico.HORA_INICIO.substring(0, 5) : '',
        horaFin: medico.HORA_FIN ? medico.HORA_FIN.substring(0, 5) : ''
      }
    }))

    renderMedicos()
  } catch (error) {
    console.error('Error al cargar médicos:', error)
  }
}

function renderMedicos (searchTerm = '', specialtyFilter = '') {
  const listContainer = document.getElementById('medicosList')
  const countElement = document.getElementById('medicosCount')

  if (!listContainer) return

  const filtered = medicosDB.filter(medico => {
    const matchesSearch =
            medico.nombre.toLowerCase().includes(searchTerm) ||
            medico.apellido.toLowerCase().includes(searchTerm) ||
            medico.matricula.toLowerCase().includes(searchTerm)
    const matchesSpecialty = !specialtyFilter || medico.especialidad === specialtyFilter
    return matchesSearch && matchesSpecialty
  })

  if (countElement) {
    countElement.textContent = filtered.length
  }

  if (filtered.length === 0) {
    listContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-icon">
                <i class="bi bi-person-x"></i>
            </div>
            <p>${searchTerm || specialtyFilter ? 'No se encontraron médicos' : 'No hay médicos registrados'}</p>
            <small>${searchTerm || specialtyFilter ? 'Intenta con otros criterios de búsqueda' : 'Comienza agregando un nuevo profesional médico'}</small>
        </div>
    `
    return
  }

  listContainer.innerHTML = filtered.map(medico => {
    const initials = `${medico.nombre.charAt(0)}${medico.apellido.charAt(0)}`.toUpperCase()

    // Formatear días de atención
    let diasTexto = ''
    if (medico.diasAtencion && medico.diasAtencion.length > 0) {
      const diasMap = {
        lunes: 'Lun',
        martes: 'Mar',
        miercoles: 'Mié',
        jueves: 'Jue',
        viernes: 'Vie',
        sabado: 'Sáb',
        domingo: 'Dom'
      }
      diasTexto = medico.diasAtencion.map(d => diasMap[d] || d).join(', ')
    }

    return `
        <div class="medico-card">
            <div class="medico-avatar">${initials}</div>
            <div class="medico-name">Dr. ${medico.nombre} ${medico.apellido}</div>
            <div class="medico-specialty">${medico.especialidadNombre || 'Sin especialidad'}</div>
            <div class="medico-info">
                <div class="medico-info-item">
                    <i class="bi bi-card-text"></i>
                    <span>Mat. ${medico.matricula}</span>
                </div>
                <div class="medico-info-item">
                    <i class="bi bi-clock"></i>
                    <span>${medico.horario}</span>
                </div>
                ${diasTexto
? `<div class="medico-info-item">
                    <i class="bi bi-calendar-week"></i>
                    <span>${diasTexto}</span>
                </div>`
: ''}
                <div class="medico-info-item">
                    <i class="bi bi-envelope"></i>
                    <span>${medico.email}</span>
                </div>
                <div class="medico-info-item">
                    <i class="bi bi-telephone"></i>
                    <span>${medico.telefono}</span>
                </div>
            </div>
            <div class="medico-actions">
                <button class="btn-icon-action" title="Ver detalles" onclick="viewMedico(${medico.id})">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn-icon-action" title="Editar" onclick="editMedico(${medico.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-icon-action danger" title="Eliminar" onclick="deleteMedico(${medico.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `
  }).join('')
}

function viewMedico (id) {
  const medico = medicosDB.find(m => m.id === id)
  if (!medico) return

  // Set modal title
  document.getElementById('medicoDetailsName').textContent = `Dr. ${medico.nombre} ${medico.apellido}`

  // Set personal information
  document.getElementById('detailDocumento').textContent = `${medico.tipoDocumento.toUpperCase()} ${medico.dni}`
  document.getElementById('detailFechaNacimiento').textContent = medico.fechaNacimiento || 'No disponible'

  // Show/hide age row
  if (medico.edad) {
    document.getElementById('detailEdadRow').style.display = 'grid'
    document.getElementById('detailEdad').textContent = medico.edad
  } else {
    document.getElementById('detailEdadRow').style.display = 'none'
  }

  // Set professional information
  document.getElementById('detailEspecialidad').textContent = medico.especialidadNombre || 'Sin especialidad'
  document.getElementById('detailMatricula').textContent = medico.matricula

  // Set schedule information
  document.getElementById('detailHorario').textContent = medico.horario

  // Set días de atención with badges
  const diasContainer = document.getElementById('detailDias')
  if (medico.diasAtencion && medico.diasAtencion.length > 0) {
    const diasMap = {
      lunes: 'Lunes',
      martes: 'Martes',
      miercoles: 'Miércoles',
      jueves: 'Jueves',
      viernes: 'Viernes',
      sabado: 'Sábado',
      domingo: 'Domingo'
    }
    diasContainer.innerHTML = medico.diasAtencion
      .map(dia => `<span class="dia-badge">${diasMap[dia] || dia}</span>`)
      .join('')
  } else {
    diasContainer.innerHTML = 'No configurado'
  }

  // Set contact information
  document.getElementById('detailEmail').textContent = medico.email || 'Sin email'
  document.getElementById('detailTelefono').textContent = medico.telefono || 'Sin teléfono'

  // Show modal
  const modal = document.getElementById('medicoDetailsModal')
  modal.classList.add('active')
  document.body.style.overflow = 'hidden'
}

// Initialize medico details modal close handlers
document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('medicoDetailsModal')
  const closeBtn = document.getElementById('closeMedicoDetails')
  const closeDetailBtn = document.getElementById('closeDetailBtn')

  function closeMedicoModal () {
    modal.classList.remove('active')
    document.body.style.overflow = ''
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMedicoModal)
  }

  if (closeDetailBtn) {
    closeDetailBtn.addEventListener('click', closeMedicoModal)
  }

  // Close on overlay click
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeMedicoModal()
      }
    })
  }

  // Close on ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeMedicoModal()
    }
  })
})

function editMedico (id) {
  const medico = medicosDB.find(m => m.id === id)
  if (medico) {
    // Show form view
    document.getElementById('medicosListView').style.display = 'none'
    document.getElementById('medicosFormView').style.display = 'block'

    // Set the medico ID for edit mode
    document.getElementById('medicoId').value = medico.id

    // Update form title
    const formHeader = document.querySelector('.form-header h3')
    if (formHeader) {
      formHeader.textContent = 'Editar Médico'
    }

    // Update submit button text
    const submitBtn = document.querySelector('#registroMedicoForm .btn-primary-custom')
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i><span>Actualizar Médico</span>'
    }

    // Fill form with data
    document.getElementById('nombre').value = medico.nombre
    document.getElementById('apellido').value = medico.apellido
    document.getElementById('tipoDocumento').value = medico.tipoDocumento
    document.getElementById('dni').value = medico.dni

    // Convertir fecha al formato YYYY-MM-DD para el input type="date"
    if (medico.fechaNacimiento && medico.fechaNacimiento !== 'No disponible') {
      const partes = medico.fechaNacimiento.split('/')
      if (partes.length === 3) {
        const fechaISO = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`
        document.getElementById('fechaNacimiento').value = fechaISO
      }
    }

    document.getElementById('matricula').value = medico.matricula
    document.getElementById('especialidad').value = medico.especialidad
    document.getElementById('email').value = medico.email
    document.getElementById('telefono').value = medico.telefono

    // Cargar horarios
    if (medico.horaInicio) {
      document.getElementById('horaInicio').value = medico.horaInicio
    }
    if (medico.horaFin) {
      document.getElementById('horaFin').value = medico.horaFin
    }

    // Cargar días de atención
    if (medico.diasAtencion && medico.diasAtencion.length > 0) {
      medico.diasAtencion.forEach(dia => {
        const checkbox = document.getElementById(dia)
        if (checkbox) {
          checkbox.checked = true
        }
      })
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

async function deleteMedico (id) {
  const medico = medicosDB.find(m => m.id === id)
  if (!medico) return

  ModalManager.show({
    title: '¿Eliminar Médico?',
    message: 'Esta acción eliminará permanentemente todos los datos del médico, incluyendo su historial y asignaciones.',
    detailLabel: 'Médico a eliminar',
    detailValue: `Dr. ${medico.nombre} ${medico.apellido}`,
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    type: 'danger',
    onConfirm: async () => {
      try {
        const response = await fetch(`/api/medicos/${id}`, {
          method: 'DELETE'
        })

        const data = await response.json()

        if (response.ok) {
          await loadMedicos()
          // Show success message (you can add a toast notification here)
        } else {
          alert('Error al eliminar médico: ' + data.error)
          throw new Error(data.error)
        }
      } catch (error) {
        alert('Error al eliminar médico: ' + error.message)
        throw error
      }
    }
  })
}

// Form validation and interactivity
function initMedicoForm () {
  const registroForm = document.getElementById('registroMedicoForm')
  const formMessage = document.getElementById('formMessage')

  if (registroForm) {
    // Tipo de documento interactivity
    const tipoDocSelect = document.getElementById('tipoDocumento')
    const dniInput = document.getElementById('dni')
    const dniHint = dniInput?.parentElement.querySelector('.field-hint')

    if (tipoDocSelect && dniInput) {
      tipoDocSelect.addEventListener('change', function () {
        const tipo = this.value

        // Add highlight animation
        dniInput.classList.add('documento-field-highlight')
        setTimeout(() => {
          dniInput.classList.remove('documento-field-highlight')
        }, 600)

        switch (tipo) {
          case 'cedula':
            dniInput.setAttribute('pattern', '[0-9]{7,8}')
            dniInput.setAttribute('maxlength', '8')
            if (dniHint) dniHint.textContent = '7-8 dígitos'
            break
          case 'dni':
            dniInput.setAttribute('pattern', '[0-9]{7,8}')
            dniInput.setAttribute('maxlength', '8')
            if (dniHint) dniHint.textContent = '7-8 dígitos'
            break
          case 'pasaporte':
            dniInput.setAttribute('pattern', '[A-Z0-9]{6,12}')
            dniInput.removeAttribute('maxlength')
            if (dniHint) dniHint.textContent = 'Letras y números'
            break
        }
        dniInput.value = ''
        dniInput.focus()
      })
    }

    // Add smooth focus animations to inputs
    const inputs = registroForm.querySelectorAll('.form-control-custom')
    inputs.forEach(input => {
      // Auto-format DNI input based on document type
      if (input.id === 'dni') {
        input.addEventListener('input', function (e) {
          const tipoDoc = tipoDocSelect?.value
          if (tipoDoc === 'pasaporte') {
            this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12)
          } else {
            this.value = this.value.replace(/\D/g, '').slice(0, 8)
          }
        })
      }

      // Auto-format phone input
      if (input.id === 'telefono') {
        input.addEventListener('input', function (e) {
          this.value = this.value.replace(/\D/g, '').slice(0, 10)
        })
      }

      // Auto-format matricula input (only numbers)
      if (input.id === 'matricula') {
        input.addEventListener('input', function (e) {
          this.value = this.value.replace(/\D/g, '')
        })
      }

      // Add ripple effect on focus
      input.addEventListener('focus', function () {
        this.parentElement.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        this.parentElement.style.transform = 'scale(1.01)'
      })

      input.addEventListener('blur', function () {
        this.parentElement.style.transform = 'scale(1)'
      })
    })

    // Checkbox interactions
    const checkboxes = registroForm.querySelectorAll('.dia-checkbox input[type="checkbox"]')
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function () {
        const label = this.nextElementSibling
        if (this.checked) {
          // Stagger animation for visual feedback
          label.style.animation = 'none'
          setTimeout(() => {
            label.style.animation = 'pulse 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
          }, 10)
        }
      })
    })

    // Form submission handler
    registroForm.addEventListener('submit', async function (e) {
      e.preventDefault()

      // Check if we're in edit mode
      const medicoId = document.getElementById('medicoId').value
      const isEditMode = medicoId && medicoId !== ''

      // Add loading state
      registroForm.classList.add('form-loading')
      const submitBtn = registroForm.querySelector('.btn-primary-custom')
      const originalText = submitBtn.innerHTML
      submitBtn.innerHTML = `<span style="opacity: 0.6;">${isEditMode ? 'Actualizando...' : 'Registrando...'}</span>`

      // Validate at least one day is selected
      const diasSeleccionados = registroForm.querySelectorAll('input[name="dias[]"]:checked')
      if (diasSeleccionados.length === 0) {
        showMessage('Por favor selecciona al menos un día de atención', 'error')
        registroForm.classList.remove('form-loading')
        submitBtn.innerHTML = originalText
        return
      }

      // Collect form data
      const formData = new FormData(registroForm)
      const data = {}

      // Convert FormData to object
      for (const [key, value] of formData.entries()) {
        if (key === 'dias[]') {
          if (!data.dias) data.dias = []
          data.dias.push(value)
        } else {
          data[key] = value
        }
      }

      // Validate required numeric fields
      if (!data.dni || data.dni.trim() === '') {
        showMessage('El número de documento es requerido', 'error')
        registroForm.classList.remove('form-loading')
        submitBtn.innerHTML = originalText
        return
      }

      if (!data.matricula || data.matricula.trim() === '') {
        showMessage('La matrícula profesional es requerida', 'error')
        registroForm.classList.remove('form-loading')
        submitBtn.innerHTML = originalText
        return
      }

      if (!data.especialidad || data.especialidad === '') {
        showMessage('Debes seleccionar una especialidad', 'error')
        registroForm.classList.remove('form-loading')
        submitBtn.innerHTML = originalText
        return
      }

      try {
        // Prepare data for API
        const medicoData = {
          nombre: data.nombre,
          apellido: data.apellido,
          tipoDocumento: data.tipoDocumento,
          nroDocumento: parseInt(data.dni),
          fechaNacimiento: data.fechaNacimiento,
          matricula: parseInt(data.matricula),
          idEspecialidad: parseInt(data.especialidad),
          email: data.email,
          telefono: data.telefono,
          idSucursal: null,
          horaInicio: data.horaInicio,
          horaFin: data.horaFin,
          diasAtencion: data.dias ? data.dias.join(',') : null
        }

        console.log('Datos a enviar:', medicoData)
        console.log('Modo edición:', isEditMode)

        // Choose endpoint and method based on mode
        const url = isEditMode ? `/api/medicos/${medicoId}` : '/api/medicos'
        const method = isEditMode ? 'PUT' : 'POST'

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(medicoData)
        })

        const result = await response.json()

        if (response.ok) {
          // Show success message
          showMessage(isEditMode ? '¡Médico actualizado exitosamente!' : '¡Médico registrado exitosamente!', 'success')

          // Reset form and go back to list after success
          setTimeout(() => {
            registroForm.reset()
            checkboxes.forEach(cb => cb.checked = false)
            document.getElementById('medicoId').value = ''

            // Go back to list view and reload data
            document.getElementById('medicosFormView').style.display = 'none'
            document.getElementById('medicosListView').style.display = 'block'
            loadMedicos()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }, 1500)
        } else {
          showMessage('Error: ' + result.error, 'error')
        }
      } catch (error) {
        showMessage(`Error al ${isEditMode ? 'actualizar' : 'registrar'} médico: ` + error.message, 'error')
      } finally {
        registroForm.classList.remove('form-loading')
        submitBtn.innerHTML = originalText
      }
    })

    // Cancel button handler
    const cancelBtn = registroForm.querySelector('.btn-secondary-custom')
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        const medicoId = document.getElementById('medicoId').value
        const isEditMode = medicoId && medicoId !== ''

        ModalManager.show({
          title: '¿Cancelar registro?',
          message: isEditMode
            ? 'Los cambios realizados no se guardarán.'
            : 'Se perderán todos los datos ingresados en el formulario.',
          confirmText: 'Sí, cancelar',
          cancelText: 'Continuar editando',
          type: 'warning',
          onConfirm: async () => {
            registroForm.reset()
            checkboxes.forEach(cb => cb.checked = false)
            formMessage.style.display = 'none'
            document.getElementById('medicoId').value = ''

            // Go back to list view if exists
            const medicosFormView = document.getElementById('medicosFormView')
            const medicosListView = document.getElementById('medicosListView')
            if (medicosFormView && medicosListView) {
              medicosFormView.style.display = 'none'
              medicosListView.style.display = 'block'
            }

            // Scroll to top smoothly
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            })
          }
        })
      })
    }

    // Show message helper
    function showMessage (message, type) {
      formMessage.textContent = message
      formMessage.className = 'form-message ' + type
      formMessage.style.display = 'block'

      // Scroll to message
      formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

      // Auto-hide success messages
      if (type === 'success') {
        setTimeout(() => {
          formMessage.style.opacity = '0'
          setTimeout(() => {
            formMessage.style.display = 'none'
            formMessage.style.opacity = '1'
          }, 300)
        }, 5000)
      }
    }

    // Add pulse animation for checkboxes
    const style = document.createElement('style')
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.08); }
            100% { transform: scale(1.05); }
        }
    `
    document.head.appendChild(style)
  }
}

// Initialize if the script is loaded and the list view exists
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('medicosListView')) {
    initMedicos()
  }
})
