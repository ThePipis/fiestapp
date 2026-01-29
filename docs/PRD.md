# Product Requirements Document (PRD): Fiestapp

## 1. Resumen y Objetivo del Producto
**Fiestapp** es una aplicación web diseñada para la organización integral de eventos (específicamente la fiesta de 70 años de Mamá Zara). Su objetivo es centralizar la gestión de invitados, el control detallado del presupuesto con registro de abonos individuales y la logística de tareas en una sola plataforma interactiva con diseño premium.

## 2. Usuarios y Roles
- **Usuario General (Organizador):** Único rol identificado en el código. Tiene acceso total a la visualización, creación, edición y eliminación de datos en todas las secciones.
- **Roles Especiales:** *Insufficient data to verify*. No se observa lógica de autenticación (RBAC) o perfiles diferenciados en los archivos `src/hooks/*` o `src/store/*`.

## 3. Navegación: Rutas y Pantallas
La aplicación opera como una **SPA (Single Page Application)** bajo una única ruta de Next.js.

| Ruta | Pantalla/Vista | Mecanismo de Navegación |
| :--- | :--- | :--- |
| `/` | Dashboard / Home | Carga inicial del componente `Home` (`app/page.tsx`). |
| - | Invitados | Estado `activeTab === 'invitados'`. |
| - | Presupuesto | Estado `activeTab === 'presupuesto'`. |
| - | Logística | Estado `activeTab === 'logistica'`. |

## 4. Features por Pantalla

### A. Dashboard General (`DashboardHeader`)
- **Visualización:** Resumen de estadísticas en tiempo real (Total lista, confirmados, pendientes y presupuesto total).
- **Regla:** Excluye invitados con estado 'Cancelado' de las sumas totales.

### B. Control de Asistencia (`GuestsView`)
- **Acciones:** Añadir, Editar, Eliminar invitado. Cambio de estado interactivo mediante Dropdown. Exportación a Excel y PDF.
- **Reglas:** 
    - El dropdown de estado usa **React Portals** para evitar recortes por `overflow`.
    - Los botones de gestión siempre están visibles.

### C. Gestión de Presupuesto (`ExpensesView`)
- **Acciones:** Añadir, Editar, Eliminar gasto. Registro de pagos por responsable. Exportación a Excel y PDF.
- **Reglas:** 
    - Cálculo automático de progreso (barra visual).
    - Desglose de abonos por persona (Jose, Luis, Carlos).

### D. Logística y Tareas (`TasksView`)
- **Acciones:** Marcar/Desmarcar tarea como completada. Eliminar tarea.
- **Regla:** Actualización inmediata en base de datos al togglear el estado.

## 5. Formularios: Campos y Validaciones
*(Verificado en `src/schemas/index.ts` y componentes `.tsx`)*

### Formulario de Invitados
- `nombre`: Mín. 2 caracteres. **Obligatorio**.
- `adultos`: Entero (Mín. 1).
- `ninos`: Entero (Mín. 0).
- `grupo`: Selección múltiple/texto.
- `responsable`: Selección múltiple de encargados del invitado.

### Formulario de Gastos
- `item`: Concepto (Mín. 2 caracteres). **Obligatorio**.
- `costo`: Valor numérico (Mín. 0).
- `responsable`: Selección de encargados del pago.
- `pagos`: Dinámico (Monto por cada responsable).
- **Validación Especial:** Feedback en tiempo real si la suma de pagos supera el costo total.

## 6. Estados UX
- **Loading:** Implementado en vistas de lista mediante esqueletos o mensajes de carga condicionales.
- **Empty:** Mensaje descriptivo centrado cuando los arrays de datos de Supabase están vacíos.
- **Error:** Manejado por el estado global de TanStack Query (no se visualizan toast notifications personalizadas aún).
- **Success:** El cierre del modal tras el submit indica éxito de la operación.

## 7. Integraciones Verificadas
- **Supabase (Backend):** 
    - Cliente configurado en `lib/supabase.ts`.
    - Tablas: `invitados`, `gastos`, `tareas`.
    - Operaciones: `select`, `insert`, `update`, `delete`.
- **Exportación:** Librerías `xlsx` y `jsPDF` integradas en `exportService.ts`.
- **Iconografía/Animación:** `Lucide-React` y `Framer Motion`.

## 8. Flujos E2E Priorizados
1. **Flujo de Asistencia:** Añadir invitado -> Confirmar estado -> Verificar Dashboard.
2. **Flujo de Pago:** Crear gasto -> Registrar abono parcial -> Verificar barra de progreso -> Registrar abono total -> Verificar estado "Pagado".
3. **Flujo de Reporte:** Exportar datos a PDF y verificar la concordancia con los datos en pantalla.

## 9. No Alcance (Out of Scope / No verificado)
- **Autenticación de Usuarios:** No existe login/logout implementado en el frontend.
- **IA/Asistente:** Pantalla en estado de Placeholder ("Próximamente").
- **Historial de Cambios:** No se registra quién realizó cada modificación.
- **Multi-evento:** La app está hardcodeada para un único evento (70 años Mamá Zara).
- **Formulario de Tareas:** *Insufficient data to verify*. Se encuentra el esquema y la vista, pero el componente de formulario de creación no está conectado al modal de la misma forma que invitados/gastos.

---
*Documento PRD generado en base al estado actual del repositorio.*
