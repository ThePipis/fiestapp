# Criterios de Aceptación (Acceptance Criteria)

Este documento define los criterios de aceptación y flujos de prueba para las funcionalidades clave de **Fiestapp**.

## 1. Criterios de Aceptación por Feature

### F1: Gestión de Invitados
**Escenario: Crear un nuevo invitado**
*   **Given** que el usuario está en la pestaña "Invitados".
*   **When** hace clic en "Añadir", completa el nombre (> 2 caracteres), selecciona grupo y cantidad de personas, y pulsa "Guardar".
*   **Then** el modal se cierra, aparece el nuevo invitado en la tabla y las estadísticas del Dashboard se actualizan.

**Escenario: Cambiar estado desde la tabla**
*   **Given** que existe un invitado con estado "Pendiente".
*   **When** el usuario abre el dropdown de estado en la fila y selecciona "Confirmado".
*   **Then** el badge cambia de color (verde), el estado se guarda en la base de datos y el contador de "Confirmados" en el Dashboard aumenta.

### F2: Control de Presupuesto
**Escenario: Registrar un gasto con abonos**
*   **Given** que el usuario abre el formulario de "Añadir Registro".
*   **When** ingresa un concepto, costo de 100, selecciona a "Jose" como responsable y escribe un abono de 40.
*   **Then** la UI muestra "Falta S/ 60.00" y la barra de progreso en la tabla muestra un 40%.

**Escenario: Validar exceso de pago**
*   **Given** un gasto con costo de 100.
*   **When** el usuario ingresa abonos que suman 120.
*   **Then** la sección de abonos se resalta en rojo y aparece un mensaje de advertencia indicando el monto excedido.

### F3: Exportación de Datos
**Escenario: Exportar lista a PDF/Excel**
*   **Given** que hay al menos un registro en la tabla.
*   **When** el usuario pulsa el botón "Excel (.xlsx)" o "PDF".
*   **Then** se descarga automáticamente un archivo con el formato correcto, conteniendo encabezados, datos alineados y un resumen de totales.

---

## 2. Flujos E2E Críticos

### Flujo Happy Path: Ciclo Dorado
1.  **Ingreso:** El usuario abre la app y ve el resumen en 0.
2.  **Invitados:** Añade 2 invitados (Familia, 2 adultos c/u).
3.  **Acción:** Confirma a uno de ellos. El Dashboard marca 2 personas confirmadas y 2 pendientes.
4.  **Gasto:** Añade "Local" por S/ 1500. Registra abono de S/ 500.
5.  **Cierre:** Exporta el PDF para enviar el reporte.
    *   *Resultado esperado:* Datos persistentes tras recargar la página.

### Flujo Negativo 1: Validación de Formulario
1.  El usuario intenta guardar un invitado sin nombre o con solo 1 letra.
2.  *Resultado esperado:* El botón de guardado no procesa la acción y se muestra el mensaje "El nombre es obligatorio".

### Flujo Negativo 2: Interrupción de Red
1.  El usuario apaga internet e intenta borrar un gasto.
2.  *Resultado esperado:* La app no debe romperse. El estado de TanStack Query debería manejar el reintento o mostrar que la acción falló.

---

## 3. Casos Edge (Casos de Borde)

| Caso | Comportamiento Esperado |
| :--- | :--- |
| **Tablas Vacías** | Mostrar el componente `EmptyState` con el mensaje: "No hay registros registrados todavía". |
| **Monto 0 en Gastos** | El porcentaje de progreso debe marcar 100% o 0% sin causar errores de división por cero. |
| **Combres muy largos** | El texto en la tabla debe truncarse o ajustarse sin romper el layout del `StatusDropdown`. |
| **Portal Dropdown en Scroll** | Al hacer scroll en la tabla, el menú desplegable (Portal) debe cerrarse para evitar quedar huérfano en la pantalla. |
| **Costo Nulo** | Si el costo es nulo, el sistema debe tratarlo como 0 para cálculos estadísticos. |

---
*Este documento es la base para las pruebas de QA y validación de usuario final.*
