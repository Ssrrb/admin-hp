import { Router } from 'express'
import { MedicoRepository } from '../repositories/medico-repository.js'

const router = Router()

const DOCUMENT_TYPES = ['cedula', 'pasaporte', 'dni']

class ValidationError extends Error {}

const trimValue = (value) => String(value ?? '').trim()

function parseMedicoPayload (body = {}) {
  const nombre = trimValue(body.nombre)
  const apellido = trimValue(body.apellido)
  const tipoDocumento = trimValue(body.tipoDocumento).toLowerCase()
  const nroDocumento = Number(body.nroDocumento)
  const fechaNacimiento = trimValue(body.fechaNacimiento)
  const matricula = Number(body.matricula)
  const idEspecialidad = Number(body.idEspecialidad)
  const email = trimValue(body.email)
  const telefono = trimValue(body.telefono)
  const idSucursal = body.idSucursal !== undefined && body.idSucursal !== null && body.idSucursal !== ''
    ? Number(body.idSucursal)
    : null
  const horaInicio = trimValue(body.horaInicio)
  const horaFin = trimValue(body.horaFin)
  const diasAtencion = body.diasAtencion ? trimValue(body.diasAtencion) : null

  if (!nombre) throw new ValidationError('El nombre es obligatorio')
  if (!apellido) throw new ValidationError('El apellido es obligatorio')
  if (!DOCUMENT_TYPES.includes(tipoDocumento)) {
    throw new ValidationError(`El tipo de documento debe ser uno de: ${DOCUMENT_TYPES.join(', ')}`)
  }
  if (!Number.isInteger(nroDocumento)) {
    throw new ValidationError('El número de documento es obligatorio y debe ser numérico')
  }
  if (!fechaNacimiento || !/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimiento)) {
    throw new ValidationError('La fecha de nacimiento debe tener formato YYYY-MM-DD')
  }
  if (!Number.isInteger(matricula)) {
    throw new ValidationError('La matrícula es obligatoria y debe ser numérica')
  }
  if (!Number.isInteger(idEspecialidad)) {
    throw new ValidationError('La especialidad es obligatoria')
  }
  if (!email) throw new ValidationError('El correo electrónico es obligatorio')
  if (!telefono) throw new ValidationError('El teléfono es obligatorio')
  if (idSucursal !== null && !Number.isInteger(idSucursal)) {
    throw new ValidationError('El ID de sucursal debe ser numérico')
  }
  if (horaInicio && !/^\d{2}:\d{2}/.test(horaInicio)) {
    throw new ValidationError('Hora de inicio inválida')
  }
  if (horaFin && !/^\d{2}:\d{2}/.test(horaFin)) {
    throw new ValidationError('Hora de fin inválida')
  }

  return {
    nombre,
    apellido,
    tipoDocumento,
    nroDocumento,
    fechaNacimiento,
    matricula,
    idEspecialidad,
    email,
    telefono,
    idSucursal,
    horaInicio: horaInicio || null,
    horaFin: horaFin || null,
    diasAtencion
  }
}

router.get('/', async (req, res) => {
  try {
    const medicos = await MedicoRepository.findAll()
    res.json(medicos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  const medicoId = Number(req.params.id)
  if (!Number.isInteger(medicoId)) {
    return res.status(400).json({ error: 'ID de médico inválido' })
  }

  try {
    const medico = await MedicoRepository.findById(medicoId)
    if (!medico) return res.status(404).json({ error: 'Médico no encontrado' })
    res.json(medico)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const payload = parseMedicoPayload(req.body ?? {})
    const id = await MedicoRepository.create(payload)
    res.status(201).json({ id })
  } catch (error) {
    const status = error instanceof ValidationError ? 400 : 500
    res.status(status).json({ error: error.message })
  }
})

router.put('/:id', async (req, res) => {
  const medicoId = Number(req.params.id)
  if (!Number.isInteger(medicoId)) {
    return res.status(400).json({ error: 'ID de médico inválido' })
  }

  try {
    const existing = await MedicoRepository.findById(medicoId)
    if (!existing) return res.status(404).json({ error: 'Médico no encontrado' })

    const payload = parseMedicoPayload(req.body ?? {})
    await MedicoRepository.update({ id: medicoId, ...payload })
    res.json({ message: 'Médico actualizado correctamente' })
  } catch (error) {
    const status = error instanceof ValidationError ? 400 : 500
    res.status(status).json({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  const medicoId = Number(req.params.id)
  if (!Number.isInteger(medicoId)) {
    return res.status(400).json({ error: 'ID de médico inválido' })
  }

  try {
    const existing = await MedicoRepository.findById(medicoId)
    if (!existing) return res.status(404).json({ error: 'Médico no encontrado' })

    await MedicoRepository.delete(medicoId)
    res.json({ message: 'Médico eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
