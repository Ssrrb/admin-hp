import DBLocal from 'db-local'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from './config.js'
const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
})

export class UserRepository {
    static async create({ username, password }) {
        // 1. Todas las validaciones van aquí opcional usar zod
        Validation.username(username)
        Validation.password(password)

        // 2. Asegurarse que el username no exista
        const user = User.findOne({ username })
        if (user) throw new Error('User already exists')

        const _id = crypto.randomUUID()
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS) // saltear la contraseña

        User.create({ _id, username, password: hashedPassword }).save()
        return _id
    }

    static async login({ username, password }) {
        Validation.username(username)
        Validation.password(password)
        // Encontramos el usuario y comparamos la contraseña
        const user = User.findOne({ username })
        if (!user) throw new Error('User not found')

        const isValid = await bcrypt.compareSync(password, user.password)
        if (!isValid) throw new Error('Invalid password')
        const { password: _, ...publicUser } = user
        return publicUser
    }
}

class Validation {
    static username(username) {
        if (typeof username !== 'string') throw new Error('Username must be a string')
        if (username.length < 3) throw new Error('Username must be at least 3 characters long')
    }

    static password(password) {
        if (typeof password !== 'string') throw new Error('Password must be a string')
        if (password.length < 3) throw new Error('Password must be at least 3 characters long')
    }
}
