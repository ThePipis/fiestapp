#  REPORTE QA - FIESTAPP

| ID | Pantalla/Ruta | Elemento | Acción Probada | Resultado Actual | Severidad | Recomendación Breve |
|---|---|---|---|---|---|---|
| QA-001 | Logística y Tareas `/tareas` | Modal "AÑADIR TAREA" - "NUEVA TAREA" button | Click en NUEVA TAREA | Modal abre con título "FORMULARIO" pero está completamente vacío - sin campos ni contenido | P1 | Completar el formulario con campos de entrada (título, descripción, prioridad, responsable, fecha límite, etc.). Crear mock data structure para tareas. |
| QA-002 | Configuración `/config` | Panel principal | Navegación a tab CONFIGURACIÓN | Muestra placeholder "PANEL DE ADMINISTRACIÓN PRÓXIMAMENTE..." sin funcionalidad | P2 | Reemplazar placeholder con interfaz real o hidden state. Implementar configuración básica (tema, permisos, datos evento) con mock. |
| QA-003 | Todas las pantallas | Spinners cian persistentes | Navegar entre tabs, ejecutar acciones (guardar, eliminar, cambiar estado) | Múltiples spinners cian permanecen visibles en botones (PDF, EXCEL, estado, botones de navegación) aún después de completar acciones | P2 | Implementar manejo correcto de loading states: mostrar spinner SOLO durante la acción, ocultarlo cuando complete. Usar timeouts o callbacks de mock para simular delays. |
| QA-004 | Invitados, Presupuesto | Formularios (AÑADIR INVITADO, AÑADIR GASTO) | Submit sin datos | Validación funciona correctamente mostrando errores | Positivo ✓ | Mantener validación. Considerar validar también números negativos en monto. |
| QA-005 | Presupuesto `/presupuesto` | Formulario AÑADIR GASTO | Seleccionar responsable + ingresar monto | "REGISTRO DE ABONOS" aparece dinámicamente mostrando desglose de pago | Positivo ✓ | Feature funciona bien. Considerar agregar soporte para múltiples responsables con montos individuales. |
| QA-006 | Invitados, Presupuesto, Logística | Navegación de tab | Presionar Escape en modales abiertos | Modal se cierra correctamente | Positivo ✓ | Mantener. Considerar agregar confirmación si hay cambios sin guardar. |
| QA-007 | Invitados `/invitados` | Búsqueda | Escribir "automation" en search | Búsqueda funciona, filtra resultados, muestra X para limpiar | Positivo ✓ | Implementar debounce si no existe, para reducir re-renders. |
| QA-008 | Invitados, Presupuesto | Filtros (TODOS, PENDIENTE, CONFIRMADO) | Click en cada filtro | Filtros funcionan, actualizan tabla correctamente | Positivo ✓ | Mantener. Considerar agregar indicador visual de filtro activo más claro. |
| QA-009 | Invitados | CRUD Completo | Crear, editar, eliminar, cambiar estado | Todas las operaciones funcionan, datos se actualizan en tiempo real | Positivo ✓ | Mantener lógica. Considerar agregar confirmación antes de eliminar. |
| QA-010 | Presupuesto | Totales dinámicos | Agregar gasto de S/150 | Totales se actualizan correctamente: PAGADO 0%, PENDIENTE 100%, monto S/650 | Positivo ✓ | Mantener. Verificar que cálculos sean correctos con múltiples responsables. |

***

#  PROMPT PARA GOOGLE ANTIGRAVITY

## TAREA 1: Completar Modal Vacío de Logística y Tareas

**Objetivo:**  
Implementar el modal de creación de tareas en la sección Logística y Tareas, reemplazando el placeholder vacío por un formulario funcional con mock data.

**Cambios Necesarios:**
- Localiza el componente que renderiza el modal "FORMULARIO" dentro de `/tareas` o `LogisticaCard.tsx`
- Reemplaza el modal vacío con un formulario que contenga:
  - Campo de texto: "Título de la Tarea" (requerido)
  - Campo de textarea: "Descripción" (opcional)
  - Dropdown: "Prioridad" (Alta, Media, Baja)
  - Dropdown: "Responsable" (JOSE, LUIS, CARLOS, ZARA)
  - Input de fecha: "Fecha Límite"
  - Checkbox: "¿Completada?" (default: false)
- Agrega botones: CERRAR y GUARDAR CAMBIOS
- Implementa validación: título es obligatorio
- Add mock state para tareas (Array vacío inicial)

**Mock Data:**
```javascript
// tasks.mock.ts
export const initialTasks = [];

export const taskPriorities = ["Alta", "Media", "Baja"];
export const taskResponsibles = ["JOSE", "LUIS", "CARLOS", "ZARA"];

// Estructura de tarea
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "Alta" | "Media" | "Baja";
  responsible: string;
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
}
```

**Criterios de Aceptación:**
- Given: Usuario abre sección "Logística y Tareas" y clickea "NUEVA TAREA"
- When: Se abre el modal de formulario
- Then: El modal muestra todos los campos mencionados, validación funciona, y guardar agrega tarea a la lista con estado PENDIENTE

**Notas de Implementación:**
- Busca archivos con palabras clave: "FORMULARIO", "Logística", "tareas", "NUEVA TAREA"
- El componente probablemente esté en `/pages/tareas.tsx` o `/components/LogisticaCard.tsx`
- Usa Radix UI Dialog (ya presente en el proyecto) para el modal
- Implementa un handler `handleAddTask(formData)` que valide y agregue a mock state

***

## TAREA 2: Remover Spinners Persistentes y Implementar Loading States Correctos

**Objetivo:**  
Eliminar spinners cian que permanecen visibles después de completar acciones, e implementar un sistema de loading states que muestre spinner SOLO durante la acción.

**Cambios Necesarios:**
- Localiza archivos donde se usan spinner/loader components (busca `cian`, `spinner`, `loading`, `aria-label="cargando"`)
- Identifica en qué componentes se aplican estos spinners: botones de descarga (PDF, EXCEL), cambio de estado, navegación
- Reemplaza spinners persistentes con un sistema de loading state:
  - `isLoading` boolean state por acción
  - Mostrar spinner SOLO si `isLoading === true`
  - Ocultar spinner cuando acción completa
- Para cada acción mock, usa `setTimeout` para simular delay (200-500ms):
  ```javascript
  const handleDownloadPDF = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simula delay
    // Trigger mock download
    setIsLoading(false);
  };
  ```

**Mock Data:**
No requiere datos nuevos, solo refactorización de estado.

**Criterios de Aceptación:**
- Given: Usuario clickea botón PDF/EXCEL
- When: Se inicia la acción
- Then: Se muestra spinner cian
- And: Después de 300ms, spinner desaparece y botón vuelve a estado normal

**Notas de Implementación:**
- Busca en todos los componentes: `[ref_195]` (EXCEL), `[ref_202]` (PDF), dropdowns de estado
- El spinner está probablemente en: `<LoadingSpinner />`, `<Spinner />`, o ícono con clase `spinner-cian`
- Revisa archivos en `/components` que contengan "Spinner", "Loading", "Loader"
- Asegúrate de cancelar timeouts si el componente se desmonta

***

## TAREA 3: Implementar Confirmación de Eliminación

**Objetivo:**  
Agregar un dialog de confirmación antes de eliminar invitados o gastos, para prevenir eliminaciones accidentales.

**Cambios Necesarios:**
- Localiza botones "Eliminar invitado" y "Eliminar gasto"
- Reemplaza el click directo con un modal de confirmación:
  ```
  "¿Estás seguro de que deseas eliminar [nombre del invitado/concepto del gasto]?
   Esta acción no puede revertirse."
  ```
- Botones: CANCELAR y CONFIRMAR ELIMINACIÓN
- Solo elimina si usuario clickea CONFIRMAR
- Muestra toast de éxito después de eliminar

**Mock Data:**
No requiere datos nuevos.

**Criterios de Aceptación:**
- Given: Usuario clickea ícono papelera en fila de invitado/gasto
- When: Se abre modal de confirmación
- Then: Modal muestra el nombre/concepto a eliminar
- And: Si clickea CANCELAR, cierra modal sin eliminar
- And: Si clickea CONFIRMAR, elimina y muestra toast "Eliminado correctamente"

**Notas de Implementación:**
- Busca archivos: "Eliminar invitado", "Eliminar gasto", referencias a `[ref_258]`, `[ref_885]`, `[ref_1511]`, `[ref_1556]`
- Usa Radix AlertDialog para el modal de confirmación
- El componente está probablemente en: `/components/InvitadosTable.tsx`, `/components/GastosTable.tsx`

***

## TAREA 4: Completar Panel de Configuración

**Objetivo:**  
Reemplazar el placeholder "PANEL DE ADMINISTRACIÓN PRÓXIMAMENTE..." con interfaz funcional de configuración básica.

**Cambios Necesarios:**
- Localiza la pantalla CONFIG en ruta `/config`
- Reemplaza placeholder con secciones configurables:
  - **Datos del Evento**: Nombre anfitrión (Mamá Zara), fecha, hora, lugar, descripción
  - **Responsables**: Tabla/lista de responsables (JOSE, LUIS, CARLOS, ZARA) con opciones editar/eliminar
  - **Preferencias**: Tema (claro/oscuro), idioma, notificaciones
- Cada sección debe tener botón EDITAR que abre modal con campos editables
- Guardar cambios actualiza mock data

**Mock Data:**
```javascript
// event.config.mock.ts
export const eventConfig = {
  honoredGuest: "Mamá Zara",
  eventDate: "2026-05-23",
  eventTime: "19:00",
  eventLocation: "Lima, Perú - El Rímac, Centro Histórico",
  eventDescription: "Un tributo a la vida, la sabiduría y el amor de Mamá Zara...",
  responsibles: [
    { id: 1, name: "JOSE", role: "Coordinador General" },
    { id: 2, name: "LUIS", role: "Logística" },
    { id: 3, name: "CARLOS", role: "Presupuesto" },
    { id: 4, name: "ZARA", role: "Asistencia" },
  ],
  preferences: {
    theme: "dark",
    language: "es",
    notifications: true,
  }
};
```

**Criterios de Aceptación:**
- Given: Usuario navega a sección Configuración
- When: Página carga
- Then: Se muestra interfaz con 3 secciones principales (Evento, Responsables, Preferencias)
- And: Cada sección tiene botón EDITAR
- And: Al clickear EDITAR, abre modal con campos editables
- And: Al guardar, los cambios se reflejan en la interfaz

**Notas de Implementación:**
- Busca archivo que renderize "PANEL DE ADMINISTRACIÓN PRÓXIMAMENTE..." (probablemente en `pages/config.tsx` o `/components/ConfigPanel.tsx`)
- Crea componentes separados para cada sección: `EventSettings.tsx`, `ResponsiblesManager.tsx`, `PreferencesPanel.tsx`
- Usa mismo patrón de modal que en invitados y gastos

***

## TAREA 5: Agregar Validación de Números Negativos en Formularios de Monto

**Objetivo:**  
Prevenir que usuarios ingresen montos negativos o cero en campos de monto (gastos, abonos).

**Cambios Necesarios:**
- Localiza inputs numéricos en:
  - Formulario AÑADIR GASTO: "MONTO ESTIMADO"
  - Formulario de ABONOS dentro de gastos: campos "S/ 0.00"
- Agrega validación:
  - No permitir números negativos (min="0")
  - No permitir cero (min="0.01" o validación en submit)
  - Mostrar error: "El monto debe ser mayor a 0" si intenta ingresar ≤0
- Deshabilitar botón GUARDAR si monto es inválido

**Mock Data:**
No requiere datos nuevos.

**Criterios de Aceptación:**
- Given: Usuario intenta ingresar monto negativo o cero
- When: Clickea en GUARDAR CAMBIOS
- Then: Muestra error "El monto debe ser mayor a 0"
- And: Botón GUARDAR permanece deshabilitado hasta corregir el valor

**Notas de Implementación:**
- Busca componentes con spinbutton `type="number"` (referencias `[ref_1600]`, `[ref_474]`, `[ref_1739]`)
- Agrega validación en función `handleSubmit` antes de guardar
-