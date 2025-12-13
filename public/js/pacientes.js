/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const pacientesState = {
  rows: []
}

function formatDateEs (value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-AR', { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
}

function showPacienteStatus (message, type = 'info') {
  const statusEl = document.getElementById('pacienteFormStatus')
  if (!statusEl) return
  statusEl.textContent = message
  statusEl.className = `form-message ${type}`
  statusEl.style.display = message ? 'block' : 'none'
}

function renderPacientes () {
  const tableBody = document.getElementById('pacientesTableBody')
  const countEl = document.getElementById('pacientesCount')
  if (!tableBody) return

  const rows = pacientesState.rows ?? []
  if (countEl) countEl.textContent = rows.length

  if (rows.length === 0) {
    tableBody.innerHTML = `
        <tr class="empty-row">
            <td colspan="9">
                <div class="empty-state">
                    <div class="empty-icon"><i class="bi bi-inbox"></i></div>
                    <p>Sin pacientes cargados</p>
                    <small>Registra el primero para verlo aquí</small>
                </div>
            </td>
        </tr>
    `
    return
  }

  tableBody.innerHTML = rows.map(paciente => {
    const sexo = paciente.SEXO ?? paciente.sexo ?? 'M'
    const tipoDocumento = paciente.TIPO_DOCUMENTO ?? paciente.tipo_documento ?? paciente.tipoDocumento ?? ''
    const nroDocumento = paciente.NRO_DOCUMENTO ?? paciente.nro_documento ?? paciente.nroDocumento ?? ''

    return `
        <tr>
            <td class="id-cell">${paciente.ID_PACIENTE ?? paciente.id_paciente ?? paciente.id ?? '—'}</td>
            <td>
                <div class="stacked">
                    <strong>${paciente.NOMBRE ?? paciente.nombre ?? ''} ${paciente.APELLIDO ?? paciente.apellido ?? ''}</strong>
                    <small class="muted">${paciente.LUGAR_NACIMIENTO ?? paciente.lugar_nacimiento ?? ''}</small>
                </div>
            </td>
            <td>${tipoDocumento ? `${tipoDocumento.toUpperCase()} ${nroDocumento}` : '—'}</td>
            <td>${formatDateEs(paciente.FECHA_NACIMIENTO ?? paciente.fecha_nacimiento)}</td>
            <td>${paciente.LUGAR_NACIMIENTO ?? paciente.lugar_nacimiento ?? '—'}</td>
            <td><span class="badge-soft">${paciente.DIRECCION ?? paciente.direccion ?? '—'}</span></td>
            <td><span class="chip ${sexo === 'H' ? 'chip-info' : 'chip-primary'}">${sexo}</span></td>
            <td>${paciente.PROFESION ?? paciente.profesion ?? '—'}</td>
            <td>
                <button class="btn-icon-action danger" onclick="deletePaciente(${paciente.ID_PACIENTE ?? paciente.id_paciente ?? paciente.id})" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `
  }).join('')
}

async function fetchPacientes () {
  const tableBody = document.getElementById('pacientesTableBody')
  if (tableBody) {
    tableBody.innerHTML = `
        <tr>
            <td colspan="9" class="loading-row">
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Cargando pacientes...
            </td>
        </tr>
    `
  }

  try {
    console.log('Fetching pacientes...')
    const response = await fetch('/api/pacientes')
    console.log('Response status:', response.status)
    const payload = await response.json()
    console.log('Payload:', payload)
    if (!response.ok) {
      throw new Error(payload.error || 'No se pudieron obtener los pacientes.')
    }
    pacientesState.rows = payload.data || []
    renderPacientes()
  } catch (error) {
    showPacienteStatus(error.message, 'error')
  }
}

function initPacientes () {
  const form = document.getElementById('pacienteForm')
  if (!form) return

  const submitBtn = form.querySelector('button[type="submit"]')
  const refreshBtn = document.getElementById('refreshPacientes')
  const docInput = document.getElementById('pacienteDocumento')
  const docTypeSelect = document.getElementById('pacienteTipoDocumento')
  const histInput = document.getElementById('pacienteHistorial')
  const sexoSelect = document.getElementById('pacienteSexo')

        ;[docInput, histInput].forEach(input => {
    input?.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '').slice(0, 10)
    })
  })

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    showPacienteStatus('', 'info')

    const payload = {
      nombre: form.nombre.value.trim(),
      apellido: form.apellido.value.trim(),
      fechaNacimiento: form.fechaNacimiento.value,
      lugarNacimiento: form.lugarNacimiento.value.trim(),
      direccion: form.direccion.value.trim(),
      sexo: sexoSelect?.value || 'H',
      profesion: form.profesion.value.trim() || undefined,
      tipoDocumento: docTypeSelect?.value || 'cedula',
      nroDocumento: form.nroDocumento.value ? Number(form.nroDocumento.value) : undefined,
      idHistorial: form.idHistorial.value ? Number(form.idHistorial.value) : undefined
    }

    const originalText = submitBtn.innerHTML
    submitBtn.disabled = true
    submitBtn.innerHTML = '<span style="opacity:0.7;">Guardando...</span>'

    try {
      const response = await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo registrar el paciente.')
      }

      showPacienteStatus(`Paciente registrado (ID ${data.id ?? 'pendiente'})`, 'success')
      form.reset()
      if (sexoSelect) sexoSelect.value = 'H'
      if (docTypeSelect) docTypeSelect.value = 'cedula'
      await fetchPacientes()
    } catch (error) {
      showPacienteStatus(error.message, 'error')
    } finally {
      submitBtn.disabled = false
      submitBtn.innerHTML = originalText
    }
  })

  refreshBtn?.addEventListener('click', fetchPacientes)
  fetchPacientes()
}

async function deletePaciente (id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este paciente?')) return

  try {
    const response = await fetch(`/api/pacientes/${id}`, {
      method: 'DELETE'
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'No se pudo eliminar el paciente')
    }

    showPacienteStatus('Paciente eliminado correctamente', 'success')
    await fetchPacientes()
  } catch (error) {
    console.error('Error deleting paciente:', error)
    showPacienteStatus(error.message, 'error')
  }
}

// Initialize if the script is loaded and the form exists
// eslint-disable-next-line semi
document.addEventListener('DOMContentLoaded', initPacientes);
