# Modales Personalizados HEKO PORA

## Diseño Implementado

He agregado modales personalizados elegantes que reemplazan los `confirm()` y `alert()` nativos del navegador, siguiendo la guía de diseño HEKO PORA.

### Características del Diseño

#### 🎨 **Estética HEKO PORA**
- **Paleta de colores**: Usa los amarillos característicos (`--primary`, `--primary-strong`) con fondos cálidos
- **Gradientes sutiles**: Fondos con degradados de `#FFF9E6` a `#F4E8C5`
- **Glows ambientales**: Efectos de brillo flotantes en rojo (danger) o amarillo (warning) con blur de 80px
- **Tipografía**:
  - Títulos en **Sora** (bold, 1.75rem)
  - Textos en **Manrope** (regular)

#### ✨ **Animaciones & Micro-interacciones**
- **Entrada del modal**: Slide-up con bounce suave usando cubic-bezier(0.34, 1.56, 0.64, 1)
- **Overlay**: Fade-in con backdrop-blur de 8px
- **Icono central**: Pulso sutil continuo (scale 1 → 1.05)
- **Botones**: Efecto hover con translateY(-2px) y sombras intensificadas
- **Loading state**: Spinner animado mientras se procesa la acción

#### 🎯 **Dos Tipos de Modal**

1. **Tipo Danger (rojo)** - Eliminaciones permanentes
   - Icono: ⚠️ Triángulo de advertencia
   - Color: Gradiente rojo (#DC2626 → #991B1B)
   - Uso: Eliminar médicos, eliminar especialidades

2. **Tipo Warning (amarillo)** - Advertencias y confirmaciones
   - Icono: ⚠️ Círculo de exclamación
   - Color: Gradiente amarillo HEKO PORA
   - Uso: Cancelar formularios, descartar cambios

### Implementación Técnica

#### Componentes del Modal

```html
<div id="confirmModal" class="modal-overlay">
  <div class="modal-container">
    <div class="modal-glow danger"></div>
    <div class="modal-glow info"></div>
    <div class="modal-content">
      <div class="modal-icon">...</div>
      <h3 class="modal-title">...</h3>
      <p class="modal-message">...</p>
      <div class="modal-detail-box">...</div>
      <div class="modal-actions">
        <button class="modal-btn modal-btn-cancel">...</button>
        <button class="modal-btn modal-btn-danger">...</button>
      </div>
    </div>
  </div>
</div>
```

#### Manager JavaScript

El `ModalManager` gestiona todo el ciclo de vida del modal:

```javascript
ModalManager.show({
  title: '¿Eliminar Médico?',
  message: 'Esta acción eliminará permanentemente...',
  detailLabel: 'Médico a eliminar',
  detailValue: 'Dr. Juan Pérez',
  confirmText: 'Eliminar',
  cancelText: 'Cancelar',
  type: 'danger', // o 'warning'
  onConfirm: async () => {
    // Lógica asíncrona
    await deleteMedico(id);
  }
});
```

### Casos de Uso Actuales

#### ✅ Implementados

1. **Eliminar Médico**
   - Modal tipo `danger`
   - Muestra nombre completo del médico
   - Loading state durante la eliminación

2. **Eliminar Especialidad**
   - Modal tipo `danger`
   - Muestra nombre de la especialidad
   - Mensaje de éxito después de eliminar

3. **Cancelar Formulario de Médico**
   - Modal tipo `warning`
   - Detecta si está en modo edición o creación
   - Mensajes contextuales diferentes

4. **Inspeccionar Médico (Vista de Detalles)**
   - Modal personalizado con tabla elegante
   - Muestra información organizada en 4 secciones:
     - 📋 Información Personal (documento, fecha de nacimiento, edad)
     - 💼 Información Profesional (especialidad con badge, matrícula)
     - 🕐 Horario de Atención (horarios y días con badges individuales)
     - 📞 Información de Contacto (email, teléfono)
   - Diseño responsive con scroll interno
   - Efectos hover en filas de datos
   - Botón de cierre con animación de rotación
   - Se puede cerrar con ESC, click fuera, o botón de cerrar

### Controles & Accesibilidad

- ✅ **ESC**: Cierra el modal
- ✅ **Click fuera**: Cierra el modal
- ✅ **Loading state**: Deshabilita botones durante procesamiento
- ✅ **Bloqueo de scroll**: `body overflow:hidden` cuando modal activo
- ✅ **Responsive**: Mobile-first, se adapta a pantallas pequeñas

### Mejoras Visuales vs. Defaults del Navegador

| Aspecto | `confirm()` Nativo | Modal HEKO PORA |
|---------|-------------------|-----------------|
| Diseño | Genérico del OS | Branding personalizado |
| Animación | Ninguna | Slide-up + pulse + glow |
| Contexto | Solo texto | Título + mensaje + detalles destacados |
| Branding | Cero | 100% HEKO PORA |
| UX | Abrupto | Suave y elegante |
| Loading | No existe | Spinner integrado |
| Responsive | Fixed | Adaptive |

### Características del Modal de Inspección de Médico

#### 🎨 Diseño Visual

- **Estructura de tabla elegante**: Layout de 2 columnas (label + value)
- **Secciones organizadas**: Cada categoría de información tiene su propio contenedor con borde y fondo
- **Headers con íconos**: Cada sección tiene un header estilizado con ícono y borde inferior amarillo
- **Badges visuales**:
  - Especialidad con gradiente amarillo HEKO PORA
  - Días de atención como badges individuales con bordes
- **Efectos hover**: Cada fila de datos se desplaza sutilmente al pasar el mouse
- **Scroll personalizado**: Barra de scroll delgada con color amarillo HEKO PORA

#### ⚙️ Interactividad

- **Botón de cierre (X)**: Circular, esquina superior derecha con rotación al hover
- **Cierre múltiple**: ESC, click fuera del modal, o botón "Cerrar"
- **Animación de entrada**: Slide-up con bounce (heredado del modal base)
- **Responsive**: En mobile, las filas cambian a layout vertical

#### 📊 Información Mostrada

```javascript
viewMedico(id) {
  // Muestra:
  - Nombre completo con título "Dr."
  - Tipo y número de documento
  - Fecha de nacimiento y edad calculada
  - Especialidad (con badge destacado)
  - Matrícula profesional
  - Horario completo (inicio - fin)
  - Días de atención (badges individuales)
  - Email de contacto
  - Teléfono de contacto
}
```

### Próximos Pasos (Opcional)

Si quieres seguir mejorando los modales, podrías:

1. **Toast notifications** para mensajes de éxito/error (reemplazar `alert()` restantes)
2. ~~**Modal de vista detallada** al hacer click en "Ver detalles" del médico~~ ✅ **Completado**
3. **Confirmación de edición** cuando el formulario cambia de crear → editar
4. **Sonidos sutiles** al abrir/cerrar modales (opcional, muy sutil)

---

**Resultado:** Sistema de modales distintivo, coherente con la identidad HEKO PORA, que evita el "AI slop" mediante animaciones precisas, tipografía definida y paleta de marca consistente.
