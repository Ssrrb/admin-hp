import express from 'express'
import { PORT } from './config.js'
import { UserRepository } from './user-repository.js'
import { EspecialidadRepository } from './especialidad-repository.js'
import { MedicoRepository } from './medico-repository.js'

const app = express()
app.set('view engine', 'ejs')
// Parse JSON bodies so req.body is populated
app.use(express.json())
// Serve static files from the 'public' directory
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body ?? {}
  try {
    const user = await UserRepository.login({ username, password })
    // For now respond with a JSON payload so the client JS can decide where to go
    res.json({ redirectTo: '/protected', user })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body ?? {}
    const id = await UserRepository.create({ username, password })
    res.status(201).json({ id })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/logout', (req, res) => {
  res.send('Logout')
})

app.get('/protected', (req, res) => {
  // TODO: if sesion del usuario
  const name = req.query.username ?? 'Admin'
  res.render('protected', { section: 'dashboard', name })
  // TODO: else 401
})

app.get('/admin/pacientes', (req, res) => {
  // TODO: if sesion del usuario
  const name = req.query.username ?? 'Admin'
  res.render('protected', { section: 'pacientes', name })
  // TODO: else 401
})

app.get('/admin/medicos', (req, res) => {
  // TODO: if sesion del usuario
  const name = req.query.username ?? 'Admin'
  res.render('protected', { section: 'medicos', name })
  // TODO: else 401
})

app.get('/admin/especialidades', (req, res) => {
  // TODO: if sesion del usuario
  const name = req.query.username ?? 'Admin'
  res.render('protected', { section: 'especialidades', name })
  // TODO: else 401
})

app.get('/admin/consultorios', (req, res) => {
  // TODO: if sesion del usuario
  const name = req.query.username ?? 'Admin'
  res.render('protected', { section: 'consultorios', name })
  // TODO: else 401
})

// ============================================
// API Routes - Especialidades
// ============================================

// Obtener todas las especialidades
app.get('/api/especialidades', async (req, res) => {
  try {
    const especialidades = await EspecialidadRepository.findAll()
    res.json(especialidades)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Obtener una especialidad por ID
app.get('/api/especialidades/:id', async (req, res) => {
  try {
    const { id } = req.params
    const especialidad = await EspecialidadRepository.findById(id)
    if (!especialidad) {
      return res.status(404).json({ error: 'Especialidad no encontrada' })
    }
    res.json(especialidad)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Crear una nueva especialidad
app.post('/api/especialidades', async (req, res) => {
  try {
    const { nombre } = req.body
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' })
    }
    const idEspecialidad = await EspecialidadRepository.create({ nombre })
    res.status(201).json({ success: true, idEspecialidad })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Actualizar una especialidad
app.put('/api/especialidades/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nombre } = req.body
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' })
    }
    await EspecialidadRepository.update({ id, nombre })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Eliminar una especialidad
app.delete('/api/especialidades/:id', async (req, res) => {
  try {
    const { id } = req.params
    await EspecialidadRepository.delete(id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============================================
// API Routes - Médicos
// ============================================

// Obtener todos los médicos
app.get('/api/medicos', async (req, res) => {
  try {
    const { especialidad } = req.query
    let medicos
    if (especialidad) {
      medicos = await MedicoRepository.findByEspecialidad(especialidad)
    } else {
      medicos = await MedicoRepository.findAll()
    }
    res.json(medicos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Obtener un médico por ID
app.get('/api/medicos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const medico = await MedicoRepository.findById(id)
    if (!medico) {
      return res.status(404).json({ error: 'Médico no encontrado' })
    }
    res.json(medico)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Crear un nuevo médico
app.post('/api/medicos', async (req, res) => {
  try {
    const {
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
      horaInicio,
      horaFin,
      diasAtencion
    } = req.body

    // Validaciones básicas
    if (!nombre || !apellido || !tipoDocumento || !nroDocumento || !matricula || !idEspecialidad) {
      return res.status(400).json({
        error: 'Los campos nombre, apellido, tipo de documento, número de documento, matrícula y especialidad son requeridos'
      })
    }

    // Validar que la fecha de nacimiento no sea mayor a la fecha actual
    if (fechaNacimiento) {
      const fechaNac = new Date(fechaNacimiento)
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0) // Resetear horas para comparar solo fechas
      if (fechaNac > hoy) {
        return res.status(400).json({
          error: 'La fecha de nacimiento no puede ser mayor a la fecha actual'
        })
      }
    }

    const idMedico = await MedicoRepository.create({
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
      horaInicio,
      horaFin,
      diasAtencion
    })

    res.status(201).json({ success: true, idMedico })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Actualizar un médico
app.put('/api/medicos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const {
      nombre,
      apellido,
      tipoDocumento,
      nroDocumento,
      fechaNacimiento,
      matricula,
      idEspecialidad,
      email,
      telefono,
      idSucursal
    } = req.body

    // Validaciones básicas
    if (!nombre || !apellido || !tipoDocumento || !nroDocumento || !matricula || !idEspecialidad) {
      return res.status(400).json({
        error: 'Los campos nombre, apellido, tipo de documento, número de documento, matrícula y especialidad son requeridos'
      })
    }

    // Validar que la fecha de nacimiento no sea mayor a la fecha actual
    if (fechaNacimiento) {
      const fechaNac = new Date(fechaNacimiento)
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0) // Resetear horas para comparar solo fechas
      if (fechaNac > hoy) {
        return res.status(400).json({
          error: 'La fecha de nacimiento no puede ser mayor a la fecha actual'
        })
      }
    }

    await MedicoRepository.update({
      id,
      nombre,
      apellido,
      tipoDocumento,
      nroDocumento,
      fechaNacimiento,
      matricula,
      idEspecialidad,
      email,
      telefono,
      idSucursal
    })

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Eliminar un médico
app.delete('/api/medicos/:id', async (req, res) => {
  try {
    const { id } = req.params
    await MedicoRepository.delete(id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
