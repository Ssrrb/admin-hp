import path from 'path'
import Sybase from 'sybase'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const sybaseHost = process.env.SYBASE_HOST
const sybasePort = Number(process.env.SYBASE_PORT)
const sybaseDb = process.env.SYBASE_DB
const sybaseUser = process.env.SYBASE_USER
const sybasePassword = process.env.SYBASE_PASSWORD
const dbDisabled = process.env.SKIP_DB === 'true' || process.env.SYBASE_DISABLED === 'true'

if (dbDisabled) {
  console.warn('Sybase connection disabled (SKIP_DB/SYBASE_DISABLED=true); DB calls will throw until enabled.')
}

// Allow overriding the Java bridge location; falls back to the one bundled with the npm package.
const javaBridgeJar =
  process.env.SYBASE_JAVA_BRIDGE ||
  path.join(__dirname, '..', 'node_modules', 'sybase', 'JavaSybaseLink', 'dist', 'JavaSybaseLink.jar')

const db = new Sybase(sybaseHost, sybasePort, sybaseDb, sybaseUser, sybasePassword, false, javaBridgeJar, {
  extraLogs: process.env.SYBASE_DEBUG === 'true'
})

let connectPromise = null

function ensureConnection () {
  if (dbDisabled) {
    return Promise.resolve(null)
  }

  if (db.isConnected()) {
    return Promise.resolve(db)
  }

  if (connectPromise) {
    return connectPromise
  }

  connectPromise = new Promise((resolve, reject) => {
    db.connect(err => {
      connectPromise = null

      if (err) {
        return reject(err)
      }

      return resolve(db)
    })
  })

  return connectPromise
}

async function query (sql) {
  if (dbDisabled) {
    throw new Error('Database is disabled via SKIP_DB/SYBASE_DISABLED.')
  }

  const connection = await ensureConnection()

  return new Promise((resolve, reject) => {
    connection.query(sql, (err, data) => {
      if (err) {
        return reject(err)
      }

      return resolve(data)
    })
  })
}

async function disconnect () {
  if (db.isConnected()) {
    db.disconnect()
  }
}

export {
  db,
  ensureConnection,
  query,
  disconnect
}
