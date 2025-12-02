import { query } from './db/connect.js'

const PACIENTES_TABLE = 'PACIENTES'
const VALID_SEX = ['H', 'M']
const VALID_DOCUMENT_TYPES = ['cedula', 'pasaporte', 'dni']

const sanitizeString = value => `'${String(value).trim().replace(/'/g, "''")}'`

function toNullableInt(value) {
  if (value === undefined || value === null || value === '') return null
  const parsed = Number(value)
  if (!Number.isInteger(parsed)) {
    throw new Error('Expected a numeric value')
  }
  return parsed
}

function validatePaciente(payload = {}) {
  const {
    idHistorial,
    nombre,
    apellido,
    fechaNacimiento,
    lugarNacimiento,
    direccion,
    sexo = 'H',
    profesion,
    tipoDocumento,
    nroDocumento
  } = payload

  if (!nombre || typeof nombre !== 'string') throw new Error('El nombre es obligatorio.')
  if (!apellido || typeof apellido !== 'string') throw new Error('El apellido es obligatorio.')
  if (!fechaNacimiento || !/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimiento)) {
    throw new Error('La fecha de nacimiento debe tener formato YYYY-MM-DD.')
  }
  if (!lugarNacimiento || typeof lugarNacimiento !== 'string') throw new Error('El lugar de nacimiento es obligatorio.')
  if (!direccion || typeof direccion !== 'string') throw new Error('La dirección es obligatoria.')
  if (!VALID_SEX.includes(sexo)) throw new Error('El sexo debe ser H o M.')
  if (!VALID_DOCUMENT_TYPES.includes(tipoDocumento)) {
    throw new Error(`El tipo de documento debe ser uno de: ${VALID_DOCUMENT_TYPES.join(', ')}.`)
  }

  const parsedNroDocumento = toNullableInt(nroDocumento)
  if (parsedNroDocumento === null) throw new Error('El número de documento es obligatorio y debe ser numérico.')

  return {
    idHistorial: toNullableInt(idHistorial),
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    fechaNacimiento,
    lugarNacimiento: lugarNacimiento.trim(),
    direccion: direccion.trim(),
    sexo,
    profesion: profesion ? profesion.trim() : null,
    tipoDocumento,
    nroDocumento: parsedNroDocumento
  }
}

function buildInsertSql(paciente) {
  const columns = [
    'ID_HISTORIAL',
    'NOMBRE',
    'APELLIDO',
    'FECHA_NACIMIENTO',
    'LUGAR_NACIMIENTO',
    'DIRECCION',
    'SEXO',
    'PROFESION',
    'TIPO_DOCUMENTO',
    'NRO_DOCUMENTO'
  ]

  const values = [
    paciente.idHistorial ?? 'NULL',
    sanitizeString(paciente.nombre),
    sanitizeString(paciente.apellido),
    sanitizeString(paciente.fechaNacimiento),
    sanitizeString(paciente.lugarNacimiento),
    sanitizeString(paciente.direccion),
    sanitizeString(paciente.sexo),
    paciente.profesion ? sanitizeString(paciente.profesion) : 'NULL',
    sanitizeString(paciente.tipoDocumento),
    paciente.nroDocumento
  ]

  return `INSERT INTO ${PACIENTES_TABLE} (${columns.join(', ')}) VALUES (${values.join(', ')});`
}

async function createPaciente(payload) {
  const paciente = validatePaciente(payload)
  const insertSql = buildInsertSql(paciente)
  await query(insertSql)
  const [row] = await query('SELECT @@IDENTITY AS ID_PACIENTE')
  return row?.ID_PACIENTE ?? null
}

async function listPacientes({ limit = 20 } = {}) {
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
      PROFESION,
      TIPO_DOCUMENTO,
      NRO_DOCUMENTO
    FROM ${PACIENTES_TABLE}
    ORDER BY ID_PACIENTE DESC;
  `
  return query(sql)
}

export const PacientesRepository = {
  createPaciente,
  listPacientes,
  deletePaciente
}

async function deletePaciente(id) {
  const idPaciente = toNullableInt(id)
  if (!idPaciente) throw new Error('ID de paciente inválido.')
  const sql = `DELETE FROM ${PACIENTES_TABLE} WHERE ID_PACIENTE = ${idPaciente}`
  await query(sql)
  return true
}
