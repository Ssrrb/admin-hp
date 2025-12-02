import { Router } from 'express'
import { EspecialidadRepository } from '../especialidad-repository.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const especialidades = await EspecialidadRepository.findAll()
    res.json(especialidades)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  const { nombre = '' } = req.body ?? {}
  const nombreLimpio = nombre.trim()

  if (!nombreLimpio) {
    return res.status(400).json({ error: 'El nombre de la especialidad es requerido' })
  }

  try {
    const id = await EspecialidadRepository.create({ nombre: nombreLimpio })
    res.status(201).json({ id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { nombre = '' } = req.body ?? {}
  const nombreLimpio = nombre.trim()

  if (!nombreLimpio) {
    return res.status(400).json({ error: 'El nombre de la especialidad es requerido' })
  }

  try {
    const especialidad = await EspecialidadRepository.findById(id)
    if (!especialidad) {
      return res.status(404).json({ error: 'Especialidad no encontrada' })
    }

    await EspecialidadRepository.update({ id, nombre: nombreLimpio })
    res.json({ message: 'Especialidad actualizada correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const especialidad = await EspecialidadRepository.findById(id)
    if (!especialidad) {
      return res.status(404).json({ error: 'Especialidad no encontrada' })
    }

    await EspecialidadRepository.delete(id)
    res.json({ message: 'Especialidad eliminada correctamente' })
  } catch (error) {
    const status = error.message.includes('No se puede eliminar la especialidad') ? 400 : 500
    res.status(status).json({ error: error.message })
  }
})

export default router
