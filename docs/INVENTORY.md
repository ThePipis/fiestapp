# Inventario del Proyecto: Fiestapp

## 1. Rutas (Next.js Routes)

| Ruta | Componente Renderizado | Propósito |
| :--- | :--- | :--- |
| `/` | `Home` (`app/page.tsx`) | Página principal que actúa como Dashboard y contenedor de vistas mediante pestañas. |

*Nota: La navegación entre secciones se maneja mediante estado interno (`activeTab` en Zustand) y no mediante rutas de React Router o Next.js adicionales.*

## 2. Pantallas / Pages (Componentes de Vista)

| Pantalla | Componente | Propósito |
| :--- | :--- | :--- |
| **Resumen General** | `DashboardHeader` | Muestra estadísticas clave: Total invitados, Confirmados, Pendientes y Presupuesto total. |
| **Control de Asistencia** | `GuestsView` | Gestión de invitados: visualización, cambio de estado (Portal Dropdown), edición y borrado. |
| **Control de Gastos** | `ExpensesView` | Gestión del presupuesto: visualización de pagos, progreso por ítem, resumen financiero (Pagado vs Pendiente). |
| **Logística y Tareas** | `TasksView` | Gestión de tareas: visualización en tarjetas, marcado como completada y borrado. |
| **Asistente AI** | (Placeholder) | Sección planificada para interacción con IA. |
| **Consola Admin** | (Placeholder) | Sección planificada para administración avanzada. |

## 3. Formularios

### Formulario de Invitados (`GuestForm.tsx`)
*   **Campos:**
    *   `nombre`: Texto (mín. 2 caracteres).
    *   `vinculo`: Texto (opcional).
    *   `grupo`: Texto (default: 'Familia Directa').
    *   `adultos`: Número entero (mín. 1).
    *   `ninos`: Número entero (mín. 0).
    *   `responsable`: Selección múltiple (array de strings).
    *   `estado`: Texto (default: 'Pendiente').
*   **Validaciones:** Zod (`GuestSchema`).
*   **Submit Behavior:** Usa `useMutation` para insertar o actualizar en la tabla `invitados`. Invalida la query `['invitados']`.

### Formulario de Gastos (`ExpenseForm.tsx`)
*   **Campos:**
    *   `item`: Texto (mín. 2 caracteres).
    *   `categoria`: Texto (default: 'General').
    *   `costo`: Número (mín. 0).
    *   `responsable`: Selección múltiple (array de strings).
    *   `pagos`: Registro (clave-valor: responsable -> monto pagado).
*   **Validaciones:** Zod (`ExpenseSchema`). Mensaje en tiempo real de "Monto Faltante/Exceso".
*   **Submit Behavior:** Usa `useMutation` para insertar o actualizar en la tabla `gastos`. Invalida la query `['gastos']`.

### Formulario de Tareas
*   **Estado:** *Insufficient data to verify*. Se observa el esquema (`TaskSchema`) pero no el componente `.tsx` de formulario implementado en el sistema de modales.

## 4. Estados UX

*   **Loading:** Implementado mediante esqueletos o mensajes de "Cargando..." condicionales usando la propiedad `isLoading` de TanStack Query en `GuestsView`, `ExpensesView` y `TasksView`.
*   **Empty:** El componente `DataTable` muestra un mensaje personalizado (`emptyMessage`) cuando no hay datos disponibles.
*   **Error:** Capturado por los hooks de TanStack Query recuperando el objeto `error` de Supabase.
*   **Success:** *Insufficient data to verify*. No se observa el uso de librerías de notificaciones (toast) en los hooks de mutación actuales.

## 5. Integraciones y Datos

### Supabase (PostgreSQL)
*   **Instancia:** Configurada en `lib/supabase.ts` usando variables de entorno.
*   **Tablas Verificadas:**
    1.  `invitados`: Almacena lista de asistentes.
    2.  `gastos`: Almacena presupuesto y abonos.
    3.  `tareas`: Almacena pendientes logísticos.
*   **Queries:** Select directo con ordenamiento (`nombre`, `item`, `created_at`).
*   **Auth:** Configurado en el cliente, pero no se visualiza implementación de login por el momento.

## 6. Eventos Clave

| Evento | Implementación |
| :--- | :--- |
| **CRUD Invitados** | Create, Update (estado y datos), Delete. Exportación a Excel y PDF. |
| **CRUD Gastos** | Create, Update (incluye gestión de abonos), Delete. Exportación a Excel y PDF. |
| **CRUD Tareas** | Delete, Update (toggle 'completada'). Create pendiente de formulario. |
| **Navegación** | Cambio de `activeTab` en Zustand. |
| **Modales** | Manejo centralizado en `useAppStore` (`isModalOpen`, `modalType`, `editingId`). |
| **Exportación** | Servicio `exportService.ts` usando `xlsx` y `jspdf`. |

---
*Documento generado automáticamente basado en el análisis factual del código fuente.*
