import { query } from './db/connect.js'

const PACIENTES_TABLE = 'PACIENTES'
const VALID_SEX = ['H', 'M']

const sanitizeString = value => `'${String(value).trim().replace(/'/g, "''")}'`

function toNullableInt (value) {
  if (value === undefined || value === null || value === '') return null
  const parsed = Number(value)
  if (!Number.isInteger(parsed)) {
    throw new Error('Expected a numeric value')
  }
  return parsed
}

function validatePaciente (payload = {}) {
  const {
    idDocumento,
    idHistorial,
    nombre,
    apellido,
    fechaNacimiento,
    lugarNacimiento,
    direccion,
    sexo = 'M',
    profesion
  } = payload

  if (!nombre || typeof nombre !== 'string') throw new Error('El nombre es obligatorio.')
  if (!apellido || typeof apellido !== 'string') throw new Error('El apellido es obligatorio.')
  if (!fechaNacimiento || !/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimiento)) {
    throw new Error('La fecha de nacimiento debe tener formato YYYY-MM-DD.')
  }
  if (!lugarNacimiento || typeof lugarNacimiento !== 'string') throw new Error('El lugar de nacimiento es obligatorio.')
  if (!direccion || typeof direccion !== 'string') throw new Error('La dirección es obligatoria.')
  if (!VALID_SEX.includes(sexo)) throw new Error('El sexo debe ser H o M.')

  return {
    idDocumento: toNullableInt(idDocumento),
    idHistorial: toNullableInt(idHistorial),
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    fechaNacimiento,
    lugarNacimiento: lugarNacimiento.trim(),
    direccion: direccion.trim(),
    sexo,
    profesion: profesion ? profesion.trim() : null
  }
}

function buildInsertSql (paciente) {
  const columns = [
    'ID_DOCUMENTO',
    'ID_HISTORIAL',
    'NOMBRE',
    'APELLIDO',
    'FECHA_NACIMIENTO',
    'LUGAR_NACIMIENTO',
    'DIRECCION',
    'SEXO',
    'PROFESION'
  ]

  const values = [
    paciente.idDocumento ?? 'NULL',
    paciente.idHistorial ?? 'NULL',
    sanitizeString(paciente.nombre),
    sanitizeString(paciente.apellido),
    sanitizeString(paciente.fechaNacimiento),
    sanitizeString(paciente.lugarNacimiento),
    sanitizeString(paciente.direccion),
    sanitizeString(paciente.sexo),
    paciente.profesion ? sanitizeString(paciente.profesion) : 'NULL'
  ]

  return `INSERT INTO ${PACIENTES_TABLE} (${columns.join(', ')}) VALUES (${values.join(', ')});`
}

async function createPaciente (payload) {
  const paciente = validatePaciente(payload)
  const insertSql = buildInsertSql(paciente)
  await query(insertSql)
  const [row] = await query('SELECT @@IDENTITY AS ID_PACIENTE')
  return row?.ID_PACIENTE ?? null
}

async function listPacientes ({ limit = 20 } = {}) {
  const safeLimit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : 20
  const sql = `
    SELECT TOP ${safeLimit}
      ID_PACIENTE,
      NOMBRE,
      APELLIDO,
      FECHA_NACIMIENTO,
      LUGAR_NACIMIENTO,
      DIRECCION,
      SEXO,
      PROFESION
    FROM ${PACIENTES_TABLE}
    ORDER BY ID_PACIENTE DESC;
  `
  return query(sql)
}

export const PacientesRepository = {
  createPaciente,
  listPacientes
}
