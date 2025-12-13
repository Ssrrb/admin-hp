import { Router } from 'express'
import { PacientesRepository } from '../repositories/pacientes-repository.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const pacientes = await PacientesRepository.listPacientes()
    res.json({ data: pacientes })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const id = await PacientesRepository.createPaciente(req.body ?? {})
    res.status(201).json({ id })
  } catch (error) {
    const message = error.message || 'No se pudo registrar el paciente.'
    const status = message.includes('obligatorio') || message.includes('formato') ? 400 : 500
    res.status(status).json({ error: message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await PacientesRepository.deletePaciente(req.params.id)
    res.json({ message: 'Paciente eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
