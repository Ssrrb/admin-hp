import { query } from './db/connect.js'

export class EspecialidadRepository {
  static async create ({ nombre }) {
    const sql = `
      INSERT INTO ESPECIALIDADES (NOMBRE)
      VALUES ('${nombre}')
    `
    await query(sql)

    // Obtener el ID de la especialidad recién insertada
    const sqlGetId = `
      SELECT ID_ESPECIALIDAD
      FROM ESPECIALIDADES
      WHERE NOMBRE = '${nombre}'
      ORDER BY ID_ESPECIALIDAD DESC
    `
    const result = await query(sqlGetId)
    return result[0].ID_ESPECIALIDAD
  }

  static async findAll () {
    const sql = 'SELECT * FROM ESPECIALIDADES ORDER BY ID_ESPECIALIDAD DESC'
    const result = await query(sql)
    return result
  }

  static async findById (id) {
    const sql = `SELECT * FROM ESPECIALIDADES WHERE ID_ESPECIALIDAD = ${id}`
    const result = await query(sql)
    return result && result.length > 0 ? result[0] : null
  }

  static async update ({ id, nombre }) {
    const sql = `
      UPDATE ESPECIALIDADES
      SET NOMBRE = '${nombre}'
      WHERE ID_ESPECIALIDAD = ${id}
    `
    const result = await query(sql)
    return result
  }

  static async delete (id) {
    const sql = `DELETE FROM ESPECIALIDADES WHERE ID_ESPECIALIDAD = ${id}`
    const result = await query(sql)
    return result
  }
}
