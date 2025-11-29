const { ensureConnection, query, disconnect } = require('./connect')

async function insertAndReturnId (sql) {
  await query(sql)
  const identity = await query('select @@identity as id')

  if (!identity) {
    return null
  }

  if (Array.isArray(identity)) {
    return identity[0] ? identity[0].id || identity[0].ID : null
  }

  return identity.id || identity.ID || null
}

async function seed () {
  await ensureConnection()

  const cityId = await insertAndReturnId(
    "insert into CIUDADES (PAIS, NOMBRE) values ('Paraguay', 'Asuncion')"
  )

  const branchId = await insertAndReturnId(
    `insert into SUCURSALES (ID_CIUDAD, DIRECCION, BARRIO, ACTIVO)
     values (${cityId}, 'Av. Mariscal Lopez 1000', 'Recoleta', 1)`
  )

  const hospitalId = await insertAndReturnId(
    `insert into HOSPITALES (ID_SUCURSAL, NOMBRE, PAIS)
     values (${branchId}, 'Hospital Central Heko', 'Paraguay')`
  )

  const specialtyId = await insertAndReturnId(
    `insert into ESPECIALIDADES (ID_HOSPITAL, NOMBRE)
     values (${hospitalId}, 'Clinica Medica')`
  )

  const seguroId = await insertAndReturnId(
    `insert into SEGUROSMEDICOS (NOMBRE, TIPO, ESTADO, COBERTURA)
     values ('Seguro Demo', 'Pri', 1, 'Plan basico de cobertura ambulatoria')`
  )

  const documentoId = await insertAndReturnId(
    "insert into DOCUMENTOS (TIPO, FECHA_VENCIMIENTO, NUMERO) values ('CI', '2030-12-31', 1234567)"
  )

  const historialId = await insertAndReturnId(
    `insert into HISTORIALES
     (CONDICIONES_FISICAS, ALERGIAS, ENFERMEDADES_PREVIAS, CONDICIONES_SALUD, PESO, ESTATURA, TIPO_SANGRE, HABITOS, CIRUGIAS_PREVIAS, ANTECEDENTES)
     values ('Sin antecedentes relevantes', 'Ninguna', 'Ninguna', 'Buen estado general', 72.5, 175, 'O+', 'Activo', 'Ninguna', 'Sin antecedentes')`
  )

  const pacienteId = await insertAndReturnId(
    `insert into PACIENTES
     (ID_DOCUMENTO, ID_HISTORIAL, NOMBRE, APELLIDO, FECHA_NACIMIENTO, LUGAR_NACIMIENTO, DIRECCION, SEXO, PROFESION)
     values (${documentoId}, ${historialId}, 'Ana', 'Benitez', '1992-04-10', 'Asuncion', 'Calle Misiones 500', 'M', 'Ingeniera')`
  )

  const medicoId = await insertAndReturnId(
    `insert into MEDICOS (ID_HOSPITAL, NOMBRE, APELLIDO, MATRICULA, ESTADO)
     values (${hospitalId}, 'Luis', 'Gonzalez', 45879, 'Lic')`
  )

  const correoPacienteId = await insertAndReturnId(
    `insert into CORREOS (ID_PACIENTE, CORREO) values (${pacienteId}, 'ana.benitez@example.com')`
  )

  // eslint-disable-next-line no-unused-vars
  const correoMedicoId = await insertAndReturnId(
    `insert into CORREOS (ID_MEDICO, CORREO) values (${medicoId}, 'luis.gonzalez@example.com')`
  )

  const usuarioId = await insertAndReturnId(
    `insert into USUARIOS (ID_CORREO, NOMBRE, CONTRASENA, FECHA_CREADO, ROL)
     values (${correoPacienteId}, 'Ana Benitez', 'demo123', '2024-12-01', 'P')`
  )

  await insertAndReturnId(
    `insert into TELEFONOS (ID_PACIENTE, TELEFONO) values (${pacienteId}, '+595971000001')`
  )

  await insertAndReturnId(
    `insert into TELEFONOS (ID_MEDICO, TELEFONO) values (${medicoId}, '+595971000999')`
  )

  const turnoId = await insertAndReturnId(
    `insert into TURNOS
     (ID_MEDICO, ID_PACIENTE, ID_ESPECIALIDAD, ID_USUARIO, FECHA, HORA, MODALIDAD, ESTADO, ASEGURADO)
     values (${medicoId}, ${pacienteId}, ${specialtyId}, ${usuarioId}, '2025-02-01', '09:00:00', 'P', 'Dis', 1)`
  )

  await insertAndReturnId(
    `insert into AGENDAS (ID_MEDICO, ID_TURNO, ID_SEGURO, ESTADO)
     values (${medicoId}, ${turnoId}, ${seguroId}, 1)`
  )

  await insertAndReturnId(
    `insert into CANCELACIONES (ID_TURNO, ID_PACIENTE, FECHA, MOTIVO)
     values (${turnoId}, ${pacienteId}, '2025-02-10', 'Reprogramado para demostracion')`
  )

  console.log('Sample data inserted successfully.')
}

seed()
  .catch(err => {
    console.error('Error inserting sample data:', err)
    process.exitCode = 1
  })
  .finally(async () => {
    await disconnect()
  })
