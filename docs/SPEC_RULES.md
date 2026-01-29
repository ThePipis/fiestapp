# Especificaciones y Reglas de Negocio

Este documento detalla las reglas de negocio, validaciones y modelo de datos inferido del código fuente de **Fiestapp**.

## 1. Reglas de Negocio (Constraints)

### Gestión de Presupuesto (Gastos)
- **Cálculo de Pagos:** El monto pagado total de un ítem es la suma de los valores numéricos contenidos en el campo JSON `pagos`.
- **Validación de Exceso:** Se considera "Exceso" cuando la suma de pagos individuales supera el `costo` definido para el ítem. El sistema alerta visualmente pero permite el registro si el usuario lo decide (según comportamiento observado en `ExpenseForm.tsx`).
- **Estados de Pago:** 
    - `Pagado`: Suma de pagos ≥ Costo.
    - `En Proceso`: Suma de pagos > 0 y < Costo.
    - `Pendiente`: Suma de pagos = 0.

### Gestión de Asistencia (Invitados)
- **Cálculos de Dashboard:** Los invitados con estado `Cancelado` son excluidos de las estadísticas generales de la lista.
- **Cuantificación:** El total de personas por registro es la suma de `adultos` + `ninos`.
- **Estados de Invitado:** Restringidos a `Pendiente`, `Confirmado` y `Cancelado` (utilizados en `StatusDropdown`).
- **Confirmados:** Solo se suman al total de confirmados aquellos cuya propiedad `estado` es estrictamente igual a `Confirmado`.

### Logística (Tareas)
- **Completado:** Las tareas tienen un estado booleano `completada` que alterna visualmente entre un estado de "Pendiente" (Clock) y "Listo" (Check).

## 2. Validaciones por Campo (Frontend)

Las validaciones son gestionadas mediante **Zod** (`src/schemas/index.ts`):

### Invitados (`GuestSchema`)
| Campo | Tipo | Validación / Restricción |
| :--- | :--- | :--- |
| `nombre` | String | Mínimo 2 caracteres. Obligatorio. |
| `vinculo` | String | Opcional (Default: ""). |
| `grupo` | String | Default: "Familia Directa". |
| `adultos` | Number | Entero. Mínimo 1. |
| `ninos` | Number | Entero. Mínimo 0. |
| `responsable` | Array | Array de strings (nombres). Default: []. |
| `estado` | String | Default: "Pendiente". |

### Gastos (`ExpenseSchema`)
| Campo | Tipo | Validación / Restricción |
| :--- | :--- | :--- |
| `item` | String | Mínimo 2 caracteres (Concepto). Obligatorio. |
| `categoria` | String | Default: "General". |
| `costo` | Number | Mínimo 0. |
| `responsable` | Array | Array de strings. Default: []. |
| `pagos` | Record | Objeto `{ string: number }`. Default: {}. |

### Tareas (`TaskSchema`)
| Campo | Tipo | Validación / Restricción |
| :--- | :--- | :--- |
| `descripcion` | String | Mínimo 3 caracteres. Obligatorio. |
| `responsable` | String | Opcional (Default: ""). |
| `completada` | Boolean | Default: false. |

## 3. Permisos y Roles

- **Inferencia:** No se han detectado políticas de Seguridad a Nivel de Fila (RLS) específicas ni manejo de roles (Admin/User) en la implementación actual de los hooks.
- **Acceso:** Las operaciones se realizan mediante el cliente de Supabase con una clave anónima.

## 4. Modelo de Datos Inferido (Supabase)

Estructura detectada en `src/types/supabase.ts`:

### Tabla: `invitados`
- `id`: `uuid` (Primary Key, autogenerado).
- `nombre`: `text` (Not Null).
- `vinculo`: `text` (Nullable).
- `grupo`: `text` (Nullable).
- `adultos`: `int4` (Nullable).
- `ninos`: `int4` (Nullable).
- `responsable`: `_text` (Array de Texto, Nullable).
- `estado`: `text` (Nullable).
- `created_at`: `timestamptz` (Nullable).

### Tabla: `gastos`
- `id`: `uuid` (Primary Key, autogenerado).
- `item`: `text` (Not Null).
- `categoria`: `text` (Nullable).
- `costo`: `numeric` (Nullable).
- `responsable`: `_text` (Array de Texto, Nullable).
- `pagos`: `jsonb` (Nullable, estructura dinámica).
- `created_at`: `timestamptz` (Nullable).

### Tabla: `tareas`
- `id`: `uuid` (Primary Key, autogenerado).
- `descripcion`: `text` (Not Null).
- `responsable`: `text` (Nullable).
- `completada`: `boolean` (Nullable).
- `created_at`: `timestamptz` (Nullable).

---
*Fin de la especificación.*
