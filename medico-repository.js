import { query } from './db/connect.js'

export class MedicoRepository {
  static async create ({
    nombre,
    apellido,
    tipoDocumento,
    nroDocumento,
    fechaNacimiento,
    matricula,
    idEspecialidad,
    email,
    telefono,
    idSucursal = null,
    horaInicio = null,
    horaFin = null,
    diasAtencion = null
  }) {
    // Validar tipo de documento
    const tiposPermitidos = ['cedula', 'pasaporte', 'dni']
    if (!tiposPermitidos.includes(tipoDocumento)) {
      throw new Error(`Tipo de documento inválido. Debe ser: ${tiposPermitidos.join(', ')}`)
    }

    // Insertar el médico
    const sqlMedico = `
      INSERT INTO MEDICOS (
        NOMBRE,
        APELLIDO,
        TIPO_DOCUMENTO,
        NRO_DOCUMENTO,
        FECHA_NACIMIENTO,
        MATRICULA,
        ID_ESPECIALIDAD,
        ID_SUCURSAL
      )
      VALUES (
        '${nombre}',
        '${apellido}',
        '${tipoDocumento}',
        ${nroDocumento},
        '${fechaNacimiento}',
        ${matricula},
        ${idEspecialidad},
        ${idSucursal || 'NULL'}
      )
    `
    await query(sqlMedico)

    // Obtener el ID del médico recién insertado
    const sqlGetId = `
      SELECT ID_MEDICO
      FROM MEDICOS
      WHERE NRO_DOCUMENTO = ${nroDocumento}
      ORDER BY ID_MEDICO DESC
    `
    const medicoResult = await query(sqlGetId)
    const idMedico = medicoResult[0].ID_MEDICO

    // Insertar correo si se proporciona
    if (email) {
      const sqlCorreo = `
        INSERT INTO CORREOS (ID_MEDICO, CORREO)
        VALUES (${idMedico}, '${email}')
      `
      await query(sqlCorreo)
    }

    // Insertar teléfono si se proporciona
    if (telefono) {
      const sqlTelefono = `
        INSERT INTO TELEFONOS (ID_MEDICO, TELEFONO)
        VALUES (${idMedico}, '${telefono}')
      `
      await query(sqlTelefono)
    }

    // Insertar horario si se proporciona
    if (horaInicio && horaFin) {
      const sqlHorario = `
        INSERT INTO HORARIOS (ID_MEDICO, HORA_INICIO, HORA_FIN, DIAS_ATENCION, ESTADO)
        VALUES (${idMedico}, '${horaInicio}', '${horaFin}', ${diasAtencion ? `'${diasAtencion}'` : 'NULL'}, 'Act')
      `
      await query(sqlHorario)
    }

    return idMedico
  }

  static async findAll () {
    const sql = `
      SELECT
        m.ID_MEDICO,
        m.NOMBRE,
        m.APELLIDO,
        m.TIPO_DOCUMENTO,
        m.NRO_DOCUMENTO,
        m.FECHA_NACIMIENTO,
        m.MATRICULA,
        m.ID_ESPECIALIDAD,
        m.ID_SUCURSAL,
        e.NOMBRE as ESPECIALIDAD_NOMBRE,
        c.CORREO as EMAIL,
        t.TELEFONO,
        h.HORA_INICIO,
        h.HORA_FIN,
        h.DIAS_ATENCION
      FROM MEDICOS m
      LEFT JOIN ESPECIALIDADES e ON m.ID_ESPECIALIDAD = e.ID_ESPECIALIDAD
      LEFT JOIN CORREOS c ON m.ID_MEDICO = c.ID_MEDICO
      LEFT JOIN TELEFONOS t ON m.ID_MEDICO = t.ID_MEDICO
      LEFT JOIN HORARIOS h ON m.ID_MEDICO = h.ID_MEDICO AND h.ESTADO = 'Act'
      ORDER BY m.ID_MEDICO DESC
    `
    const result = await query(sql)
    return result
  }

  static async findById (id) {
    const sql = `
      SELECT
        m.ID_MEDICO,
        m.NOMBRE,
        m.APELLIDO,
        m.TIPO_DOCUMENTO,
        m.NRO_DOCUMENTO,
        m.FECHA_NACIMIENTO,
        m.MATRICULA,
        m.ID_ESPECIALIDAD,
        m.ID_SUCURSAL,
        e.NOMBRE as ESPECIALIDAD_NOMBRE,
        c.CORREO as EMAIL,
        t.TELEFONO,
        h.HORA_INICIO,
        h.HORA_FIN,
        h.DIAS_ATENCION
      FROM MEDICOS m
      LEFT JOIN ESPECIALIDADES e ON m.ID_ESPECIALIDAD = e.ID_ESPECIALIDAD
      LEFT JOIN CORREOS c ON m.ID_MEDICO = c.ID_MEDICO
      LEFT JOIN TELEFONOS t ON m.ID_MEDICO = t.ID_MEDICO
      LEFT JOIN HORARIOS h ON m.ID_MEDICO = h.ID_MEDICO AND h.ESTADO = 'Act'
      WHERE m.ID_MEDICO = ${id}
    `
    const result = await query(sql)
    return result && result.length > 0 ? result[0] : null
  }

  static async findByEspecialidad (idEspecialidad) {
    const sql = `
      SELECT
        m.ID_MEDICO,
        m.NOMBRE,
        m.APELLIDO,
        m.TIPO_DOCUMENTO,
        m.NRO_DOCUMENTO,
        m.FECHA_NACIMIENTO,
        m.MATRICULA,
        m.ID_ESPECIALIDAD,
        m.ID_SUCURSAL,
        e.NOMBRE as ESPECIALIDAD_NOMBRE,
        c.CORREO as EMAIL,
        t.TELEFONO,
        h.HORA_INICIO,
        h.HORA_FIN,
        h.DIAS_ATENCION
      FROM MEDICOS m
      LEFT JOIN ESPECIALIDADES e ON m.ID_ESPECIALIDAD = e.ID_ESPECIALIDAD
      LEFT JOIN CORREOS c ON m.ID_MEDICO = c.ID_MEDICO
      LEFT JOIN TELEFONOS t ON m.ID_MEDICO = t.ID_MEDICO
      LEFT JOIN HORARIOS h ON m.ID_MEDICO = h.ID_MEDICO AND h.ESTADO = 'Act'
      WHERE m.ID_ESPECIALIDAD = ${idEspecialidad}
      ORDER BY m.APELLIDO, m.NOMBRE
    `
    const result = await query(sql)
    return result
  }

  static async update ({
    id,
    nombre,
    apellido,
    tipoDocumento,
    nroDocumento,
    fechaNacimiento,
    matricula,
    idEspecialidad,
    email,
    telefono,
    idSucursal = null,
    horaInicio = null,
    horaFin = null,
    diasAtencion = null
  }) {
    // Validar tipo de documento
    const tiposPermitidos = ['cedula', 'pasaporte', 'dni']
    if (!tiposPermitidos.includes(tipoDocumento)) {
      throw new Error(`Tipo de documento inválido. Debe ser: ${tiposPermitidos.join(', ')}`)
    }

    // Actualizar médico
    const sqlMedico = `
      UPDATE MEDICOS
      SET
        NOMBRE = '${nombre}',
        APELLIDO = '${apellido}',
        TIPO_DOCUMENTO = '${tipoDocumento}',
        NRO_DOCUMENTO = ${nroDocumento},
        FECHA_NACIMIENTO = '${fechaNacimiento}',
        MATRICULA = ${matricula},
        ID_ESPECIALIDAD = ${idEspecialidad},
        ID_SUCURSAL = ${idSucursal || 'NULL'}
      WHERE ID_MEDICO = ${id}
    `
    await query(sqlMedico)

    // Actualizar o insertar correo
    if (email) {
      const sqlCheckCorreo = `SELECT ID_CORREO FROM CORREOS WHERE ID_MEDICO = ${id}`
      const correoResult = await query(sqlCheckCorreo)

      if (correoResult && correoResult.length > 0) {
        const sqlUpdateCorreo = `
          UPDATE CORREOS
          SET CORREO = '${email}'
          WHERE ID_MEDICO = ${id}
        `
        await query(sqlUpdateCorreo)
      } else {
        const sqlInsertCorreo = `
          INSERT INTO CORREOS (ID_MEDICO, CORREO)
          VALUES (${id}, '${email}')
        `
        await query(sqlInsertCorreo)
      }
    }

    // Actualizar o insertar teléfono
    if (telefono) {
      const sqlCheckTelefono = `SELECT ID_TELEFONO FROM TELEFONOS WHERE ID_MEDICO = ${id}`
      const telefonoResult = await query(sqlCheckTelefono)

      if (telefonoResult && telefonoResult.length > 0) {
        const sqlUpdateTelefono = `
          UPDATE TELEFONOS
          SET TELEFONO = '${telefono}'
          WHERE ID_MEDICO = ${id}
        `
        await query(sqlUpdateTelefono)
      } else {
        const sqlInsertTelefono = `
          INSERT INTO TELEFONOS (ID_MEDICO, TELEFONO)
          VALUES (${id}, '${telefono}')
        `
        await query(sqlInsertTelefono)
      }
    }

    // Actualizar o insertar horario
    if (horaInicio && horaFin) {
      const sqlCheckHorario = `SELECT ID_HORARIO FROM HORARIOS WHERE ID_MEDICO = ${id} AND ESTADO = 'Act'`
      const horarioResult = await query(sqlCheckHorario)

      if (horarioResult && horarioResult.length > 0) {
        const sqlUpdateHorario = `
          UPDATE HORARIOS
          SET HORA_INICIO = '${horaInicio}',
              HORA_FIN = '${horaFin}',
              DIAS_ATENCION = ${diasAtencion ? `'${diasAtencion}'` : 'NULL'}
          WHERE ID_MEDICO = ${id} AND ESTADO = 'Act'
        `
        await query(sqlUpdateHorario)
      } else {
        const sqlInsertHorario = `
          INSERT INTO HORARIOS (ID_MEDICO, HORA_INICIO, HORA_FIN, DIAS_ATENCION, ESTADO)
          VALUES (${id}, '${horaInicio}', '${horaFin}', ${diasAtencion ? `'${diasAtencion}'` : 'NULL'}, 'Act')
        `
        await query(sqlInsertHorario)
      }
    }

    return true
  }

  static async delete (id) {
    // Eliminar correos asociados
    const sqlDeleteCorreos = `DELETE FROM CORREOS WHERE ID_MEDICO = ${id}`
    await query(sqlDeleteCorreos)

    // Eliminar teléfonos asociados
    const sqlDeleteTelefonos = `DELETE FROM TELEFONOS WHERE ID_MEDICO = ${id}`
    await query(sqlDeleteTelefonos)

    // Eliminar médico
    const sqlDeleteMedico = `DELETE FROM MEDICOS WHERE ID_MEDICO = ${id}`
    const result = await query(sqlDeleteMedico)
    return result
  }
}
