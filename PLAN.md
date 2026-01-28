# Plan de Refactorización - Fiestapp

Refactorización de una aplicación monolítica Firebase/React a una arquitectura profesional con Next.js, TypeScript, Tailwind CSS y Supabase, siguiendo los estándares del BUNDLE "Web Wizard".

## 🛠 Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Base de Datos & Auth:** Supabase
- **Estado Remoto:** TanStack Query (React Query)
- **Estado Local:** Zustand
- **Formularios:** React Hook Form + Zod
- **Iconos:** Lucide React
- **Animaciones:** Framer Motion / Tailwind Animate

## 📋 Tareas

### 1. Inicialización del Proyecto 🏗️
- [x] Crear estructura de monorepo con Turborepo (opcional pero recomendado según reglas) o estructura Next.js profesional.
- [x] Configurar TypeScript, ESLint y Prettier.
- [x] Configurar Tailwind CSS con una paleta de colores premium (HSL).
- [x] Configurar Supabase Client.

### 2. Infraestructura de Base de Datos (Supabase) 🗄️
- [x] Crear tabla `invitados` con RLS.
- [x] Crear tabla `gastos` con RLS.
- [x] Crear tabla `tareas` con RLS.
- [x] Configurar tipos de TypeScript generados por Supabase.

### 3. Capa de Datos y Lógica 🧠
- [x] Implementar Hooks personalizados para CRUD (`useGuests`, `useExpenses`, `useTasks`).
- [x] Configurar Zustand para estado global mínimo (filtros, tabs activos).
- [x] Implementar esquemas de validación con Zod.

### 4. Componentes y UI 🎨
- [x] Crear Layout principal con diseño premium.
- [x] Refactorizar Dashboard de métricas con animaciones.
- [x] Crear componentes atómicos (Button, Input, Badge, Table, Modal).
- [x] Implementar sistema de pestañas (Tabs).
- [ ] Refactorizar formularios con React Hook Form. (En proceso)

### 5. Funcionalidades Especiales ✨
- [ ] Migrar motor de exportación (Excel/PDF).
- [ ] Implementar asistente AI (Gemini) integrado.
- [ ] Añadir micro-interacciones y estados de carga pulidos.

### 6. QA y Despliegue 🚀
- [ ] Realizar pruebas de flujo completo.
- [ ] Verificar políticas RLS.
- [ ] Limpieza de código sobrante (`index.jsx`).

## 📅 Roadmap Detallado
1. **Fase 1 (Ahora):** Estructura base y Supabase Schema.
2. **Fase 2:** CRUD y Hooks.
3. **Fase 3:** UI de alta fidelidad y Dashboards.
4. **Fase 4:** Exportación y Asistente AI.
