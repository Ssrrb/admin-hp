import express from 'express'
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'
import { EspecialidadRepository } from './especialidad-repository.js'
import { MedicoRepository } from './medico-repository.js'
import pacientesRouter from './routes/pacientes.routes.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()
app.set('view engine', 'ejs')
// Parse JSON bodies so req.body is populated
app.use(express.json())
app.use(cookieParser())
//Middlewares funciones por donde pasan las peticiones
// Serve static files from the 'public' directory
app.use(express.static('public'))

app.use((req, res, next) => {
  req.session = req.session ?? {} // ensure session object exists
  const token = req.cookies.access_token
  let data = null
  req.session.user = data
  if (token) {
    try {
      data = jwt.verify(token, SECRET_JWT_KEY)
      req.session.user = data
    } catch (error) { }
  }
  next() // seguir a la siguiente ruta o middleware


})

const requireAuth = (req, res, next) => {
  if (!req.session?.user) {
    const expectsJson = req.path.startsWith('/api') || req.headers.accept?.includes('application/json')
    if (expectsJson) return res.status(401).json({ error: 'Unauthorized' })
    return res.redirect('/')
  }
  next()
}

app.get('/', (req, res) => {
  const { user } = req.session
  res.render('index', { user })

})

app.post('/login', async (req, res) => {
  const { username, password } = req.body ?? {}
  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_JWT_KEY, { expiresIn: '1h' })
    res.cookie('access_token', token, {
      httpOnly: true, // la cookie solo se puede leer desde el servidor
      secure: process.env.NODE_ENV === 'production', // solo se envia por https en producción
      sameSite: 'strict', // evita ataques de phishing
      maxAge: 60 * 60 * 1000 // 1 hora
    })
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
  res.clearCookie('access_token')
  res.json({ redirectTo: '/' })
})

app.use('/api/pacientes', requireAuth, pacientesRouter)

app.get('/protected', requireAuth, (req, res) => {
  const name = req.session.user?.username ?? 'Usuario'
  res.render('layout', { section: 'dashboard', name })
})

app.get('/admin/pacientes', requireAuth, (req, res) => {
  const name = req.session.user?.username ?? 'Admin'
  res.render('layout', { section: 'pacientes', name })
})

app.get('/admin/medicos', requireAuth, (req, res) => {
  const name = req.session.user?.username ?? 'Admin'
  res.render('layout', { section: 'medicos', name })
})

app.get('/admin/especialidades', requireAuth, (req, res) => {
  const name = req.session.user?.username ?? 'Admin'
  res.render('layout', { section: 'especialidades', name })
})

app.get('/admin/consultorios', requireAuth, (req, res) => {
  const name = req.session.user?.username ?? 'Admin'
  res.render('layout', { section: 'consultorios', name })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
