import express from 'express'
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'
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
            secure: true, // solo se envia por https
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
    res.send('Logout')
})

app.get('/protected', (req, res) => {
    // TODO: if sesion del usuario
    const token = req.cookies.access_token
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    try {
        const data = jwt.verify(token, SECRET_JWT_KEY)
        res.render('protected', data) // _id, username
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
