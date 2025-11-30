/*==============================================================*/
/* DBMS name:      Sybase SQL Anywhere 11                       */
/* Created on:     30/11/2025 02:04:05                          */
/*==============================================================*/


if exists(select 1 from sys.sysforeignkey where role='FK_AGENDAS_REFERENCE_MEDICOS') then
    alter table AGENDAS
       delete foreign key FK_AGENDAS_REFERENCE_MEDICOS
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_AGENDAS_REFERENCE_TURNOS') then
    alter table AGENDAS
       delete foreign key FK_AGENDAS_REFERENCE_TURNOS
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_AGENDAS_REFERENCE_SEGUROSM') then
    alter table AGENDAS
       delete foreign key FK_AGENDAS_REFERENCE_SEGUROSM
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_CANCELAC_REFERENCE_TURNOS') then
    alter table CANCELACIONES
       delete foreign key FK_CANCELAC_REFERENCE_TURNOS
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_CANCELAC_REFERENCE_PACIENTE') then
    alter table CANCELACIONES
       delete foreign key FK_CANCELAC_REFERENCE_PACIENTE
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_CORREOS_REFERENCE_MEDICOS') then
    alter table CORREOS
       delete foreign key FK_CORREOS_REFERENCE_MEDICOS
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_CORREOS_REFERENCE_PACIENTE') then
    alter table CORREOS
       delete foreign key FK_CORREOS_REFERENCE_PACIENTE
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_MEDICOS_REFERENCE_SUCURSAL') then
    alter table MEDICOS
       delete foreign key FK_MEDICOS_REFERENCE_SUCURSAL
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_MEDICOS_REFERENCE_ESPECIAL') then
    alter table MEDICOS
       delete foreign key FK_MEDICOS_REFERENCE_ESPECIAL
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_PACIENTE_REFERENCE_HISTORIA') then
    alter table PACIENTES
       delete foreign key FK_PACIENTE_REFERENCE_HISTORIA
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_SUCURSAL_REFERENCE_CIUDADES') then
    alter table SUCURSALES
       delete foreign key FK_SUCURSAL_REFERENCE_CIUDADES
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_SUSPENSI_REFERENCE_PACIENTE') then
    alter table SUSPENSIONES
       delete foreign key FK_SUSPENSI_REFERENCE_PACIENTE
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_TELEFONO_REFERENCE_MEDICOS') then
    alter table TELEFONOS
       delete foreign key FK_TELEFONO_REFERENCE_MEDICOS
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_TELEFONO_REFERENCE_PACIENTE') then
    alter table TELEFONOS
       delete foreign key FK_TELEFONO_REFERENCE_PACIENTE
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_TURNOS_REFERENCE_MEDICOS') then
    alter table TURNOS
       delete foreign key FK_TURNOS_REFERENCE_MEDICOS
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_TURNOS_REFERENCE_PACIENTE') then
    alter table TURNOS
       delete foreign key FK_TURNOS_REFERENCE_PACIENTE
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_TURNOS_REFERENCE_ESPECIAL') then
    alter table TURNOS
       delete foreign key FK_TURNOS_REFERENCE_ESPECIAL
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_TURNOS_REFERENCE_CANCELAC') then
    alter table TURNOS
       delete foreign key FK_TURNOS_REFERENCE_CANCELAC
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_TURNOS_REFERENCE_SUSPENSI') then
    alter table TURNOS
       delete foreign key FK_TURNOS_REFERENCE_SUSPENSI
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_TURNOS_REFERENCE_USUARIOS') then
    alter table TURNOS
       delete foreign key FK_TURNOS_REFERENCE_USUARIOS
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_TURNOS_REFERENCE_HORARIOS') then
    alter table TURNOS
       delete foreign key FK_TURNOS_REFERENCE_HORARIOS
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_TURNOS_REFERENCE_CALENDAR') then
    alter table TURNOS
       delete foreign key FK_TURNOS_REFERENCE_CALENDAR
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_USUARIOS_REFERENCE_CORREOS') then
    alter table USUARIOS
       delete foreign key FK_USUARIOS_REFERENCE_CORREOS
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_HORARIOS_REFERENCE_MEDICOS') then
    alter table HORARIOS
       delete foreign key FK_HORARIOS_REFERENCE_MEDICOS
end if;

if exists(
   select 1 from sys.systable 
   where table_name='AGENDAS'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table AGENDAS
end if;

if exists(
   select 1 from sys.systable 
   where table_name='CALENDARIOS'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table CALENDARIOS
end if;

if exists(
   select 1 from sys.systable 
   where table_name='CANCELACIONES'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table CANCELACIONES
end if;

if exists(
   select 1 from sys.systable 
   where table_name='CIUDADES'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table CIUDADES
end if;

if exists(
   select 1 from sys.systable 
   where table_name='CORREOS'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table CORREOS
end if;

if exists(
   select 1 from sys.systable 
   where table_name='ESPECIALIDADES'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table ESPECIALIDADES
end if;

if exists(
   select 1 from sys.systable 
   where table_name='HISTORIALES'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table HISTORIALES
end if;

if exists(
   select 1 from sys.systable 
   where table_name='HORARIOS'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table HORARIOS
end if;

if exists(
   select 1 from sys.systable 
   where table_name='MEDICOS'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table MEDICOS
end if;

if exists(
   select 1 from sys.systable 
   where table_name='PACIENTES'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table PACIENTES
end if;

if exists(
   select 1 from sys.systable 
   where table_name='SEGUROSMEDICOS'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table SEGUROSMEDICOS
end if;

if exists(
   select 1 from sys.systable 
   where table_name='SUCURSALES'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table SUCURSALES
end if;

if exists(
   select 1 from sys.systable 
   where table_name='SUSPENSIONES'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table SUSPENSIONES
end if;

if exists(
   select 1 from sys.systable 
   where table_name='TELEFONOS'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table TELEFONOS
end if;

if exists(
   select 1 from sys.systable 
   where table_name='TURNOS'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table TURNOS
end if;

if exists(
   select 1 from sys.systable 
   where table_name='USUARIOS'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table USUARIOS
end if;

if exists(select 1 from sys.sysusertype where type_name='DOM_BOOLEAN') then
   drop domain DOM_BOOLEAN
end if;

if exists(select 1 from sys.sysusertype where type_name='DOM_DECIMAL') then
   drop domain DOM_DECIMAL
end if;

if exists(select 1 from sys.sysusertype where type_name='DOM_ENTERO') then
   drop domain DOM_ENTERO
end if;

if exists(select 1 from sys.sysusertype where type_name='DOM_FECHA') then
   drop domain DOM_FECHA
end if;

if exists(select 1 from sys.sysusertype where type_name='DOM_HORA') then
   drop domain DOM_HORA
end if;

if exists(select 1 from sys.sysusertype where type_name='DOM_ID') then
   drop domain DOM_ID
end if;

if exists(select 1 from sys.sysusertype where type_name='DOM_TEXTO_CORTO') then
   drop domain DOM_TEXTO_CORTO
end if;

if exists(select 1 from sys.sysusertype where type_name='DOM_TEXTO_LARGO') then
   drop domain DOM_TEXTO_LARGO
end if;

if exists(select 1 from sys.sysusertype where type_name='DOM_TEXTO_MEDIO') then
   drop domain DOM_TEXTO_MEDIO
end if;

/*==============================================================*/
/* Domain: DOM_BOOLEAN                                          */
/*==============================================================*/
create domain DOM_BOOLEAN as bit;

/*==============================================================*/
/* Domain: DOM_DECIMAL                                          */
/*==============================================================*/
create domain DOM_DECIMAL as decimal(18, 2) default 0;

/*==============================================================*/
/* Domain: DOM_ENTERO                                           */
/*==============================================================*/
create domain DOM_ENTERO as int default 0;

/*==============================================================*/
/* Domain: DOM_FECHA                                            */
/*==============================================================*/
create domain DOM_FECHA as date default getdate();

/*==============================================================*/
/* Domain: DOM_HORA                                             */
/*==============================================================*/
create domain DOM_HORA as time default current timestamp;

/*==============================================================*/
/* Domain: DOM_ID                                               */
/*==============================================================*/
create domain DOM_ID as int default autoincrement;

/*==============================================================*/
/* Domain: DOM_TEXTO_CORTO                                      */
/*==============================================================*/
create domain DOM_TEXTO_CORTO as varchar(50);

/*==============================================================*/
/* Domain: DOM_TEXTO_LARGO                                      */
/*==============================================================*/
create domain DOM_TEXTO_LARGO as varchar(150);

/*==============================================================*/
/* Domain: DOM_TEXTO_MEDIO                                      */
/*==============================================================*/
create domain DOM_TEXTO_MEDIO as varchar(100);

/*==============================================================*/
/* Table: AGENDAS                                               */
/*==============================================================*/
create table AGENDAS 
(
   ID_AGENDA            DOM_ID                         not null default autoincrement,
   ID_MEDICO            int                            null,
   ID_TURNO             int                            null,
   ID_SEGURO            int                            null,
   ESTADO               DOM_BOOLEAN                    not null,
   constraint PK_AGENDAS primary key clustered (ID_AGENDA)
);

/*==============================================================*/
/* Table: CALENDARIOS                                           */
/*==============================================================*/
create table CALENDARIOS 
(
   ID_CALENDARIO        DOM_ID                         not null default autoincrement,
   FECHA                DOM_FECHA                      not null,
   constraint PK_CALENDARIOS primary key clustered (ID_CALENDARIO)
);

/*==============================================================*/
/* Table: CANCELACIONES                                         */
/*==============================================================*/
create table CANCELACIONES 
(
   ID_CANCELACION       DOM_ID                         not null default autoincrement,
   ID_TURNO             int                            null,
   ID_PACIENTE          int                            null,
   FECHA                DOM_FECHA                      not null,
   MOTIVO               DOM_TEXTO_MEDIO                not null,
   constraint PK_CANCELACIONES primary key clustered (ID_CANCELACION)
);

/*==============================================================*/
/* Table: CIUDADES                                              */
/*==============================================================*/
create table CIUDADES 
(
   ID_CIUDAD            DOM_ID                         not null default autoincrement,
   NOMBRE               DOM_TEXTO_MEDIO                not null default 'Asuncion'
      constraint CKC_NOMBRE_CIUDADES check (NOMBRE in ('Asuncion','Luque','Fernando de la Mora','San Lorenzo','Mariano Roque Alonso')),
   constraint PK_CIUDADES primary key clustered (ID_CIUDAD)
);

/*==============================================================*/
/* Table: CORREOS                                               */
/*==============================================================*/
create table CORREOS 
(
   ID_CORREO            DOM_ID                         not null default autoincrement,
   ID_MEDICO            int                            null,
   ID_PACIENTE          int                            null,
   CORREO               DOM_TEXTO_LARGO                not null,
   constraint PK_CORREOS primary key clustered (ID_CORREO)
);

/*==============================================================*/
/* Table: ESPECIALIDADES                                        */
/*==============================================================*/
create table ESPECIALIDADES 
(
   ID_ESPECIALIDAD      DOM_ID                         not null default autoincrement,
   NOMBRE               DOM_TEXTO_MEDIO                not null,
   constraint PK_ESPECIALIDADES primary key clustered (ID_ESPECIALIDAD)
);

/*==============================================================*/
/* Table: HISTORIALES                                           */
/*==============================================================*/
create table HISTORIALES 
(
   ID_HISTORIAL         DOM_ID                         not null default autoincrement,
   CONDICIONES_FISICAS  DOM_TEXTO_LARGO                not null,
   ALERGIAS             DOM_TEXTO_MEDIO                not null,
   ENFERMEDADES_PREVIAS DOM_TEXTO_LARGO                not null,
   CONDICIONES_SALUD    DOM_TEXTO_LARGO                not null,
   PESO                 DOM_DECIMAL                    not null,
   ESTATURA             DOM_ENTERO                     not null,
   TIPO_SANGRE          DOM_TEXTO_CORTO                not null,
   HABITOS              DOM_TEXTO_LARGO                not null,
   CIRUGIAS_PREVIAS     DOM_TEXTO_LARGO                not null,
   ANTECEDENTES         DOM_TEXTO_LARGO                not null,
   constraint PK_HISTORIALES primary key clustered (ID_HISTORIAL)
);

/*==============================================================*/
/* Table: HORARIOS                                              */
/*==============================================================*/
create table HORARIOS
(
   ID_HORARIO           DOM_ID                         not null default autoincrement,
   ID_MEDICO            int                            null,
   FECHA                DOM_FECHA                      null,
   HORA_INICIO          DOM_HORA                       not null,
   HORA_FIN             DOM_HORA                       not null,
   DIAS_ATENCION        DOM_TEXTO_MEDIO                null,
   ESTADO               DOM_TEXTO_CORTO                not null default 'Dis'
      constraint CKC_ESTADO_HORARIOS check (ESTADO in ('Dis','Res','Can','Act','Ina')),
   constraint PK_HORARIOS primary key clustered (ID_HORARIO)
);

/*==============================================================*/
/* Table: MEDICOS                                               */
/*==============================================================*/
create table MEDICOS
(
   ID_MEDICO            DOM_ID                         not null default autoincrement,
   ID_ESPECIALIDAD      int                            null,
   ID_SUCURSAL          int                            null,
   NOMBRE               DOM_TEXTO_CORTO                not null,
   APELLIDO             DOM_TEXTO_CORTO                not null,
   MATRICULA            DOM_ENTERO                     not null,
   FECHA_NACIMIENTO     DOM_FECHA                      not null
      constraint CKC_FECHA_NACIMIENTO_MEDICOS check (FECHA_NACIMIENTO <= getdate()),
   TIPO_DOCUMENTO       DOM_TEXTO_CORTO                not null
      constraint CKC_TIPO_DOCUMENTO_MEDICOS check (TIPO_DOCUMENTO in ('cedula','pasaporte','dni')),
   NRO_DOCUMENTO        DOM_ENTERO                     not null,
   constraint PK_MEDICOS primary key clustered (ID_MEDICO)
);

/*==============================================================*/
/* Table: PACIENTES                                             */
/*==============================================================*/
create table PACIENTES 
(
   ID_PACIENTE          DOM_ID                         not null default autoincrement,
   ID_HISTORIAL         int                            null,
   NOMBRE               DOM_TEXTO_CORTO                not null,
   APELLIDO             DOM_TEXTO_CORTO                not null,
   FECHA_NACIMIENTO     DOM_FECHA                      not null,
   LUGAR_NACIMIENTO     DOM_TEXTO_MEDIO                not null,
   DIRECCION            DOM_TEXTO_LARGO                not null,
   SEXO                 DOM_TEXTO_CORTO                not null default 'M'
      constraint CKC_SEXO_PACIENTE check (SEXO in ('H','M')),
   PROFESION            DOM_TEXTO_MEDIO                null,
   TIPO_DOCUMENTO       DOM_TEXTO_CORTO                not null
      constraint CKC_TIPO_DOCUMENTO_PACIENTE check (TIPO_DOCUMENTO in ('cedula','pasaporte','dni')),
   NRO_DOCUMENTO        DOM_ENTERO                     not null,
   constraint PK_PACIENTES primary key clustered (ID_PACIENTE)
);

/*==============================================================*/
/* Table: SEGUROSMEDICOS                                        */
/*==============================================================*/
create table SEGUROSMEDICOS 
(
   ID_SEGURO            DOM_ID                         not null default autoincrement,
   NOMBRE               DOM_TEXTO_MEDIO                not null,
   TIPO                 DOM_TEXTO_CORTO                not null
      constraint CKC_TIPO_SEGUROSM check (TIPO in ('Pub','Pri')),
   ESTADO               DOM_BOOLEAN                    not null,
   COBERTURA            DOM_TEXTO_LARGO                not null,
   constraint PK_SEGUROSMEDICOS primary key clustered (ID_SEGURO)
);

/*==============================================================*/
/* Table: SUCURSALES                                            */
/*==============================================================*/
create table SUCURSALES 
(
   ID_SUCURSAL          DOM_ID                         not null default autoincrement,
   ID_CIUDAD            int                            null,
   DIRECCION            DOM_TEXTO_LARGO                not null,
   BARRIO               DOM_TEXTO_MEDIO                not null,
   ACTIVO               DOM_BOOLEAN                    not null,
   constraint PK_SUCURSALES primary key clustered (ID_SUCURSAL)
);

/*==============================================================*/
/* Table: SUSPENSIONES                                          */
/*==============================================================*/
create table SUSPENSIONES 
(
   ID_SUSPENSION        DOM_ID                         not null default autoincrement,
   ID_PACIENTE          int                            null,
   FECHA_INICIO         DOM_FECHA                      not null,
   FECHA_FIN            DOM_FECHA                      not null,
   MOTIVO               DOM_TEXTO_MEDIO                not null,
   constraint PK_SUSPENSIONES primary key clustered (ID_SUSPENSION)
);

/*==============================================================*/
/* Table: TELEFONOS                                             */
/*==============================================================*/
create table TELEFONOS 
(
   ID_TELEFONO          DOM_ID                         not null default autoincrement,
   ID_MEDICO            int                            null,
   ID_PACIENTE          int                            null,
   TELEFONO             DOM_TEXTO_CORTO                not null,
   constraint PK_TELEFONOS primary key clustered (ID_TELEFONO)
);

/*==============================================================*/
/* Table: TURNOS                                                */
/*==============================================================*/
create table TURNOS 
(
   ID_TURNO             DOM_ID                         not null default autoincrement,
   ID_MEDICO            int                            null,
   ID_PACIENTE          int                            null,
   ID_ESPECIALIDAD      int                            null,
   ID_CANCELACION       int                            null,
   ID_SUSPENSION        int                            null,
   ID_USUARIO           int                            null,
   ID_HORARIO           int                            null,
   ID_CALENDARIO        int                            null,
   MODALIDAD            DOM_TEXTO_CORTO                not null
      constraint CKC_MODALIDAD_TURNOS check (MODALIDAD in ('P','V')),
   ESTADO               DOM_TEXTO_CORTO                not null default 'Dis',
   ASEGURADO            DOM_BOOLEAN                    not null,
   constraint PK_TURNOS primary key clustered (ID_TURNO)
);

/*==============================================================*/
/* Table: USUARIOS                                              */
/*==============================================================*/
create table USUARIOS 
(
   ID_USUARIO           DOM_ID                         not null default autoincrement,
   ID_CORREO            int                            null,
   NOMBRE               DOM_TEXTO_LARGO                not null,
   CONTRASENA           DOM_TEXTO_LARGO                not null,
   FECHA_CREADO         DOM_FECHA                      not null,
   ROL                  DOM_TEXTO_CORTO                not null
      constraint CKC_ROL_USUARIOS check (ROL in ('P','M','A')),
   constraint PK_USUARIOS primary key clustered (ID_USUARIO)
);

alter table AGENDAS
   add constraint FK_AGENDAS_REFERENCE_MEDICOS foreign key (ID_MEDICO)
      references MEDICOS (ID_MEDICO)
      on update restrict
      on delete restrict;

alter table AGENDAS
   add constraint FK_AGENDAS_REFERENCE_TURNOS foreign key (ID_TURNO)
      references TURNOS (ID_TURNO)
      on update restrict
      on delete restrict;

alter table AGENDAS
   add constraint FK_AGENDAS_REFERENCE_SEGUROSM foreign key (ID_SEGURO)
      references SEGUROSMEDICOS (ID_SEGURO)
      on update restrict
      on delete restrict;

alter table CANCELACIONES
   add constraint FK_CANCELAC_REFERENCE_TURNOS foreign key (ID_TURNO)
      references TURNOS (ID_TURNO)
      on update restrict
      on delete restrict;

alter table CANCELACIONES
   add constraint FK_CANCELAC_REFERENCE_PACIENTE foreign key (ID_PACIENTE)
      references PACIENTES (ID_PACIENTE)
      on update restrict
      on delete restrict;

alter table CORREOS
   add constraint FK_CORREOS_REFERENCE_MEDICOS foreign key (ID_MEDICO)
      references MEDICOS (ID_MEDICO)
      on update restrict
      on delete restrict;

alter table CORREOS
   add constraint FK_CORREOS_REFERENCE_PACIENTE foreign key (ID_PACIENTE)
      references PACIENTES (ID_PACIENTE)
      on update restrict
      on delete restrict;

alter table MEDICOS
   add constraint FK_MEDICOS_REFERENCE_SUCURSAL foreign key (ID_SUCURSAL)
      references SUCURSALES (ID_SUCURSAL)
      on update restrict
      on delete restrict;

alter table MEDICOS
   add constraint FK_MEDICOS_REFERENCE_ESPECIAL foreign key (ID_ESPECIALIDAD)
      references ESPECIALIDADES (ID_ESPECIALIDAD)
      on update restrict
      on delete restrict;

alter table PACIENTES
   add constraint FK_PACIENTE_REFERENCE_HISTORIA foreign key (ID_HISTORIAL)
      references HISTORIALES (ID_HISTORIAL)
      on update restrict
      on delete restrict;

alter table SUCURSALES
   add constraint FK_SUCURSAL_REFERENCE_CIUDADES foreign key (ID_CIUDAD)
      references CIUDADES (ID_CIUDAD)
      on update restrict
      on delete restrict;

alter table SUSPENSIONES
   add constraint FK_SUSPENSI_REFERENCE_PACIENTE foreign key (ID_PACIENTE)
      references PACIENTES (ID_PACIENTE)
      on update restrict
      on delete restrict;

alter table TELEFONOS
   add constraint FK_TELEFONO_REFERENCE_MEDICOS foreign key (ID_MEDICO)
      references MEDICOS (ID_MEDICO)
      on update restrict
      on delete restrict;

alter table TELEFONOS
   add constraint FK_TELEFONO_REFERENCE_PACIENTE foreign key (ID_PACIENTE)
      references PACIENTES (ID_PACIENTE)
      on update restrict
      on delete restrict;

alter table TURNOS
   add constraint FK_TURNOS_REFERENCE_MEDICOS foreign key (ID_MEDICO)
      references MEDICOS (ID_MEDICO)
      on update restrict
      on delete restrict;

alter table TURNOS
   add constraint FK_TURNOS_REFERENCE_PACIENTE foreign key (ID_PACIENTE)
      references PACIENTES (ID_PACIENTE)
      on update restrict
      on delete restrict;

alter table TURNOS
   add constraint FK_TURNOS_REFERENCE_ESPECIAL foreign key (ID_ESPECIALIDAD)
      references ESPECIALIDADES (ID_ESPECIALIDAD)
      on update restrict
      on delete restrict;

alter table TURNOS
   add constraint FK_TURNOS_REFERENCE_CANCELAC foreign key (ID_CANCELACION)
      references CANCELACIONES (ID_CANCELACION)
      on update restrict
      on delete restrict;

alter table TURNOS
   add constraint FK_TURNOS_REFERENCE_SUSPENSI foreign key (ID_SUSPENSION)
      references SUSPENSIONES (ID_SUSPENSION)
      on update restrict
      on delete restrict;

alter table TURNOS
   add constraint FK_TURNOS_REFERENCE_USUARIOS foreign key (ID_USUARIO)
      references USUARIOS (ID_USUARIO)
      on update restrict
      on delete restrict;

alter table TURNOS
   add constraint FK_TURNOS_REFERENCE_HORARIOS foreign key (ID_HORARIO)
      references HORARIOS (ID_HORARIO)
      on update restrict
      on delete restrict;

alter table TURNOS
   add constraint FK_TURNOS_REFERENCE_CALENDAR foreign key (ID_CALENDARIO)
      references CALENDARIOS (ID_CALENDARIO)
      on update restrict
      on delete restrict;

alter table USUARIOS
   add constraint FK_USUARIOS_REFERENCE_CORREOS foreign key (ID_CORREO)
      references CORREOS (ID_CORREO)
      on update restrict
      on delete restrict;

alter table HORARIOS
   add constraint FK_HORARIOS_REFERENCE_MEDICOS foreign key (ID_MEDICO)
      references MEDICOS (ID_MEDICO)
      on update restrict
      on delete cascade;

