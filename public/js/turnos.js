/* eslint-disable no-undef */
const turnosState = {
  turnos: [],
  medicos: [],
  pacientes: [],
  especialidades: [],
  filters: { fecha: '', medico: '', especialidad: '', estado: '' },
  editingId: null,
  cancelTarget: null
}

const ESTADOS = ['Pendiente', 'Confirmado', 'Atendido', 'Cancelado']
const MODALIDADES = { P: 'Presencial', V: 'Virtual' }

function $(id) { return document.getElementById(id) }

function formatFecha (value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatHora (value) {
  return value ? value.slice(0, 5) : '--:--'
}

function showStatus (message, type = 'info') {
  const el = $('turnoFormStatus')
  if (!el) return
  el.textContent = message
  el.className = `form-message ${type}`
  el.style.display = message ? 'block' : 'none'
}

async function fetchJson (url, options = {}) {
  const response = await fetch(url, options)
  let payload = null
  try { payload = await response.json() } catch (_) {}
  if (!response.ok) {
    const msg = payload?.error || `Error ${response.status}`
    throw new Error(msg)
  }
  return payload
}

function populateSelect (select, data, labelKey, valueKey, placeholder) {
  if (!select) return
  const options = data.map(item => {
    const value = item[valueKey]
    const label = item[labelKey]
    return `<option value="${value}">${label}</option>`
  }).join('')
  const base = placeholder ? `<option value="">${placeholder}</option>` : ''
  select.innerHTML = base + options
}

async function loadCatalogos () {
  try {
    const medicos = await fetchJson('/api/medicos')
    turnosState.medicos = Array.isArray(medicos) ? medicos : []
    populateSelect($('turnoMedico'), turnosState.medicos, 'NOMBRE', 'ID_MEDICO', 'Seleccione un medico')
    populateSelect($('filtroMedico'), turnosState.medicos, 'NOMBRE', 'ID_MEDICO', 'Todos los medicos')
  } catch (error) {
    console.warn('No se pudieron cargar medicos', error)
  }

  try {
    const pacientesPayload = await fetchJson('/api/pacientes')
    const pacientes = pacientesPayload?.data || []
    turnosState.pacientes = pacientes
    populateSelect($('turnoPaciente'), pacientes.map(p => ({
      ID_PACIENTE: p.ID_PACIENTE,
      NOMBRE: `${p.NOMBRE} ${p.APELLIDO}`
    })), 'NOMBRE', 'ID_PACIENTE', 'Seleccione paciente')
  } catch (error) {
    console.warn('No se pudieron cargar pacientes', error)
  }

  try {
    const especialidades = await fetchJson('/api/especialidades')
    turnosState.especialidades = Array.isArray(especialidades) ? especialidades : []
    populateSelect($('turnoEspecialidad'), turnosState.especialidades, 'NOMBRE', 'ID_ESPECIALIDAD', 'Seleccione especialidad')
    populateSelect($('filtroEspecialidad'), turnosState.especialidades, 'NOMBRE', 'ID_ESPECIALIDAD', 'Todas las especialidades')
  } catch (error) {
    console.warn('No se pudieron cargar especialidades', error)
  }
}

function estadoBadge (estado) {
  const key = (estado || '').toLowerCase()
  return `<span class="badge-estado ${key}">${estado || 'Pendiente'}</span>`
}

function modalidadChip (mod) {
  const label = MODALIDADES[mod] || mod || '-'
  const icon = mod === 'V' ? 'bi-wifi' : 'bi-building'
  return `<span class="chip-modalidad"><i class="bi ${icon}"></i>${label}</span>`
}

function renderMetrics () {
  const counts = { pendiente: 0, confirmado: 0, atendido: 0, cancelado: 0 }
  turnosState.turnos.forEach(t => {
    const key = (t.estado || t.ESTADO || '').toLowerCase()
    if (counts[key] !== undefined) counts[key] += 1
  })
  $('metricPendientes').textContent = counts.pendiente || 0
  $('metricConfirmados').textContent = counts.confirmado || 0
  $('metricAtendidos').textContent = counts.atendido || 0
  $('metricCancelados').textContent = counts.cancelado || 0
}

function renderTurnos () {
  const body = $('turnosTableBody')
  if (!body) return
  const rows = turnosState.turnos
  if (!rows || rows.length === 0) {
    body.innerHTML = `
      <tr class="empty-row">
        <td colspan="8">
          <div class="empty-state">
            <div class="empty-icon"><i class="bi bi-calendar-x"></i></div>
            <p>Sin turnos para los filtros actuales</p>
            <small>El primer turno aparecera aqui</small>
          </div>
        </td>
      </tr>`
    renderMetrics()
    return
  }

  body.innerHTML = rows.map(turno => {
    const id = turno.ID_TURNO || turno.id || turno.id_turno
    const paciente = turno.PACIENTE || turno.paciente || `${turno.PACIENTE_NOMBRE || ''} ${turno.PACIENTE_APELLIDO || ''}`.trim()
    const medico = turno.MEDICO || turno.medico || `${turno.MEDICO_NOMBRE || ''} ${turno.MEDICO_APELLIDO || ''}`.trim()
    const especialidad = turno.ESPECIALIDAD || turno.especialidad || turno.ESPECIALIDAD_NOMBRE || '-'
    const estado = turno.ESTADO || turno.estado || 'Pendiente'
    const modalidad = turno.MODALIDAD || turno.modalidad || 'P'
    const fecha = turno.FECHA || turno.fecha
    const hora = turno.HORA || turno.hora

    const canEdit = estado === 'Pendiente'
    const canConfirmar = estado === 'Pendiente'
    const canAtender = estado === 'Confirmado'
    const canCancelar = estado === 'Pendiente' || estado === 'Confirmado'

    return `
      <tr>
        <td class="id-cell">${id ?? '?'}</td>
        <td>
          <div class="stacked">
            <strong>${formatFecha(fecha)}</strong>
            <small>${formatHora(hora)}</small>
          </div>
        </td>
        <td>${paciente || '?'}</td>
        <td>${medico || '?'}</td>
        <td>${especialidad || '?'}</td>
        <td>${modalidadChip(modalidad)}</td>
        <td>${estadoBadge(estado)}</td>
        <td>
          <div class="action-stack">
            ${canConfirmar ? `<button class="btn-icon-action" title="Confirmar" onclick="cambiarEstado(${id}, 'Confirmado')"><i class="bi bi-check2"></i></button>` : ''}
            ${canAtender ? `<button class="btn-icon-action" title="Marcar atendido" onclick="cambiarEstado(${id}, 'Atendido')"><i class="bi bi-clipboard2-check"></i></button>` : ''}
            ${canCancelar ? `<button class="btn-icon-action danger" title="Cancelar" onclick="abrirCancelacion(${id})"><i class="bi bi-slash-circle"></i></button>` : ''}
            ${canEdit ? `<button class="btn-icon-action" title="Editar" onclick="editarTurno(${id})"><i class="bi bi-pencil"></i></button>` : ''}
            ${canEdit ? `<button class="btn-icon-action danger" title="Eliminar" onclick="eliminarTurno(${id})"><i class="bi bi-trash"></i></button>` : ''}
          </div>
        </td>
      </tr>`
  }).join('')

  renderMetrics()
}

async function fetchTurnos () {
  const body = $('turnosTableBody')
  if (body) {
    body.innerHTML = `<tr class="loading-row"><td colspan="8"><span class="spinner-border spinner-border-sm me-2"></span>Cargando turnos...</td></tr>`
  }
  const params = new URLSearchParams()
  const { fecha, medico, especialidad, estado } = turnosState.filters
  if (fecha) params.set('fecha', fecha)
  if (medico) params.set('medicoId', medico)
  if (especialidad) params.set('especialidadId', especialidad)
  if (estado) params.set('estado', estado)

  try {
    const data = await fetchJson(`/api/turnos${params.toString() ? `?${params.toString()}` : ''}`)
    const rows = data?.data || data || []
    turnosState.turnos = Array.isArray(rows) ? rows : []
    renderTurnos()
  } catch (error) {
    console.error(error)
    showStatus(error.message, 'error')
    turnosState.turnos = []
    renderTurnos()
  }
}

function resetForm () {
  const form = $('turnoForm')
  if (!form) return
  form.reset()
  turnosState.editingId = null
  $('formModeLabel').textContent = 'Nuevo turno'
  $('submitLabel').textContent = 'Crear turno'
  showStatus('', 'info')
}

function setFiltersListeners () {
  const map = {
    filtroFecha: 'fecha',
    filtroMedico: 'medico',
    filtroEspecialidad: 'especialidad',
    filtroEstado: 'estado'
  }
  Object.entries(map).forEach(([id, key]) => {
    const el = $(id)
    if (!el) return
    el.addEventListener('change', () => {
      turnosState.filters[key] = el.value
      fetchTurnos()
    })
  })
}

function editarTurno (id) {
  const turno = turnosState.turnos.find(t => (t.ID_TURNO || t.id) === id)
  if (!turno) return
  turnosState.editingId = id
  $('formModeLabel').textContent = `Editando turno #${id}`
  $('submitLabel').textContent = 'Guardar cambios'
  $('turnoFecha').value = (turno.FECHA || turno.fecha || '').slice(0, 10)
  $('turnoHora').value = formatHora(turno.HORA || turno.hora)
  $('turnoMedico').value = turno.ID_MEDICO || ''
  $('turnoEspecialidad').value = turno.ID_ESPECIALIDAD || ''
  $('turnoPaciente').value = turno.ID_PACIENTE || ''
  $('turnoModalidad').value = turno.MODALIDAD || 'P'
  showStatus('Solo se pueden editar turnos en estado Pendiente', 'info')
}

async function onSubmitTurno (event) {
  event.preventDefault()
  const payload = {
    fecha: $('turnoFecha').value,
    hora: $('turnoHora').value,
    idMedico: Number($('turnoMedico').value),
    idPaciente: Number($('turnoPaciente').value),
    idEspecialidad: Number($('turnoEspecialidad').value),
    modalidad: $('turnoModalidad').value || 'P'
  }

  const isEdit = Boolean(turnosState.editingId)
  const endpoint = isEdit ? `/api/turnos/${turnosState.editingId}` : '/api/turnos'
  const method = isEdit ? 'PUT' : 'POST'
  const submitBtn = event.target.querySelector('button[type="submit"]')
  const original = submitBtn.innerHTML
  submitBtn.classList.add('loading')

  try {
    await fetchJson(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    showStatus(isEdit ? 'Turno actualizado' : 'Turno creado', 'success')
    resetForm()
    fetchTurnos()
  } catch (error) {
    showStatus(error.message, 'error')
  } finally {
    submitBtn.classList.remove('loading')
    submitBtn.innerHTML = original
  }
}

async function cambiarEstado (id, estado, extra = {}) {
  try {
    await fetchJson(`/api/turnos/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado, ...extra })
    })
    fetchTurnos()
  } catch (error) {
    showStatus(error.message, 'error')
  }
}

function abrirCancelacion (id) {
  turnosState.cancelTarget = id
  $('cancelMotivo').value = ''
  $('cancelError').style.display = 'none'
  $('cancelSheet').classList.add('active')
}

function cerrarCancelacion () {
  turnosState.cancelTarget = null
  $('cancelSheet').classList.remove('active')
}

async function confirmarCancelacion () {
  const motivo = $('cancelMotivo').value.trim()
  if (!motivo) {
    const err = $('cancelError')
    err.textContent = 'Ingresa el motivo de cancelacion'
    err.className = 'form-message error'
    err.style.display = 'block'
    return
  }
  const id = turnosState.cancelTarget
  if (!id) return cerrarCancelacion()
  try {
    await cambiarEstado(id, 'Cancelado', { motivo })
    cerrarCancelacion()
  } catch (error) {
    const err = $('cancelError')
    err.textContent = error.message
    err.className = 'form-message error'
    err.style.display = 'block'
  }
}

async function eliminarTurno (id) {
  const ok = confirm('Eliminar turno? Solo se permite si esta Pendiente')
  if (!ok) return
  try {
    await fetchJson(`/api/turnos/${id}`, { method: 'DELETE' })
    fetchTurnos()
  } catch (error) {
    showStatus(error.message, 'error')
  }
}

function initTurnos () {
  const form = $('turnoForm')
  if (!form) return

  setFiltersListeners()
  form.addEventListener('submit', onSubmitTurno)
  $('btnResetForm')?.addEventListener('click', resetForm)
  $('btnCancelarForm')?.addEventListener('click', resetForm)
  $('btnRefrescarTurnos')?.addEventListener('click', fetchTurnos)
  $('btnLimpiarFiltros')?.addEventListener('click', () => {
    turnosState.filters = { fecha: '', medico: '', especialidad: '', estado: '' }
    ;['filtroFecha', 'filtroMedico', 'filtroEspecialidad', 'filtroEstado'].forEach(id => { if ($(id)) $(id).value = '' })
    fetchTurnos()
  })

  $('cancelSheetConfirm')?.addEventListener('click', confirmarCancelacion)
  $('cancelSheetClose')?.addEventListener('click', cerrarCancelacion)
  $('closeCancelSheet')?.addEventListener('click', cerrarCancelacion)

  loadCatalogos().then(fetchTurnos)
}

document.addEventListener('DOMContentLoaded', initTurnos)
