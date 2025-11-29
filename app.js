import express from 'express'
import { PORT } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()
app.set('view engine', 'ejs')
// Parse JSON bodies so req.body is populated
app.use(express.json())

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await UserRepository.login({ username, password })
        res.json(user)
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
    res.render('protected', { section: 'dashboard', name: 'Admin' })
    // TODO: else 401
})

app.get('/admin/pacientes', (req, res) => {
    // TODO: if sesion del usuario
    res.render('protected', { section: 'pacientes', name: 'Admin' })
    // TODO: else 401
})

app.get('/admin/medicos', (req, res) => {
    // TODO: if sesion del usuario
    res.render('protected', { section: 'medicos', name: 'Admin' })
    // TODO: else 401
})

app.get('/admin/especialidades', (req, res) => {
    // TODO: if sesion del usuario
    res.render('protected', { section: 'especialidades', name: 'Admin' })
    // TODO: else 401
})

app.get('/admin/consultorios', (req, res) => {
    // TODO: if sesion del usuario
    res.render('protected', { section: 'consultorios', name: 'Admin' })
    // TODO: else 401
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
