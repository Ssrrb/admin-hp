import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const sybaseHost = process.env.SYBASE_HOST
const sybasePort = Number(process.env.SYBASE_PORT)
const sybaseDb = process.env.SYBASE_DB
const sybaseUser = process.env.SYBASE_USER
const sybasePassword = process.env.SYBASE_PASSWORD
const dbDisabled = process.env.SKIP_DB === 'true' || process.env.SYBASE_DISABLED === 'true'

if (dbDisabled) {
  console.warn('Sybase connection disabled (SKIP_DB/SYBASE_DISABLED=true); DB calls will throw until enabled.')
}

let SybaseDriver = null
let db = null
let connectPromise = null

function resolveJavaBridge () {
  return (
    process.env.SYBASE_JAVA_BRIDGE ||
    path.join(__dirname, '..', 'node_modules', 'sybase', 'JavaSybaseLink', 'dist', 'JavaSybaseLink.jar')
  )
}

async function loadDriver () {
  if (SybaseDriver) return SybaseDriver

  try {
    const module = await import('sybase')
    SybaseDriver = module.default ?? module
    return SybaseDriver
  } catch (error) {
    throw new Error(
      `Sybase driver is not installed. Install the "sybase" package or set SKIP_DB=true to bypass DB calls. ${error.message}`
    )
  }
}

async function ensureConnection () {
  if (dbDisabled) return null
  if (db?.isConnected?.()) return db
  if (connectPromise) return connectPromise

  const Sybase = await loadDriver()
  const javaBridgeJar = resolveJavaBridge()

  db = new Sybase(sybaseHost, sybasePort, sybaseDb, sybaseUser, sybasePassword, false, javaBridgeJar, {
    extraLogs: process.env.SYBASE_DEBUG === 'true'
  })

  connectPromise = new Promise((resolve, reject) => {
    db.connect(err => {
      connectPromise = null
      if (err) return reject(err)
      return resolve(db)
    })
  })

  return connectPromise
}

async function query (sql) {
  if (dbDisabled) throw new Error('Database is disabled via SKIP_DB/SYBASE_DISABLED.')
  if (!sql) throw new Error('SQL is required')

  const connection = await ensureConnection()

  return new Promise((resolve, reject) => {
    connection.query(sql, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

async function disconnect () {
  if (db?.isConnected?.()) {
    db.disconnect()
  }
}

export {
  ensureConnection,
  query,
  disconnect
}
