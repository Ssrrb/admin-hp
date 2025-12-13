# Plan Turnos y Agenda

## Objetivo
Implementar CRUD de turnos/agenda con validaciones criticas y UI integrada al panel HEKO Pora.

## Alcance
- Backend: API /api/turnos con ciclo de vida Pendiente -> Confirmado -> {Atendido, Cancelado}, cancelaciones trazables y reglas de negocio.
- Datos: Repositorio Turnos + uso de medicos/pacientes/especialidades/suspensiones/horarios.
- Frontend: Vista Turnos con filtros, agenda y acciones de estado/cancelacion.

## Tareas
1) Backend
- Crear repositorio turnos (consultas, validaciones de solapamiento por medico/fecha/hora, bloqueo medico en licencia/inactivo, paciente suspendido, respeto de horarios activos).
- Endpoints /api/turnos: listar (filtros fecha/medico/especialidad/estado), crear (solo Pendiente), actualizar estado (Confirmar, Atender, Cancelar con motivo/usuario/fecha), borrar/editar solo Pendiente.
- Registrar cancelacion vinculada con motivo/usuario/fecha y asociar turno->cancelacion.

2) Frontend
- Nueva vista EJS de Turnos + enlaces en navbar/layout/scripts/styles.
- JS para cargar opciones (medicos, pacientes, especialidades), validar disponibilidad en cliente, CRUD y cambios de estado; mostrar motivos de cancelacion.
- UI de agenda/tabla con filtros y badges de estado; formularios para nuevo turno y cancelacion.

3) Estilos & UX
- CSS especifico (tonalidad HEKO), estados resaltados, modales de confirmacion/rechazo, feedback de errores.

4) Datos & Config
- Ajustar seeds/mocks si aplica (SKIP_DB support). Evitar escribir en DB real si SKIP_DB=true.

5) Pruebas
- Probar flujos: creacion pendiente, confirmacion, atencion, cancelacion con motivo, intento de solape, medico lic/retirado, paciente suspendido, edicion/borrado solo Pendiente.
