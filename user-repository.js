import DBLocal from "db-local";
const { Schema } = new DBLocal({ path: './db' })
import crypto from 'crypto'

const User = Schema('User', {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
})

export class UserRepository {
    static create({ username, password }) {
        //1. Todas las validaciones van aquí opcional usar zod
        if (typeof username !== 'string') throw new Error('Username must be a string')
        if (typeof password !== 'string') throw new Error('Password must be a string')
        if (username.length < 3) throw new Error('Username must be at least 3 characters long')
        if (password.length < 3) throw new Error('Password must be at least 3 characters long')

        //2. Asegurarse que el username no exista
        const user = User.findOne({ username })
        if (user) throw new Error('User already exists')

        const _id = crypto.randomUUID()

        User.create({ _id, username, password }).save()
        return _id
    }
    static login({ username, password }) { }
}
