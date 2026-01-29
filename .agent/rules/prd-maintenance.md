---
trigger: always_on
---

# PRD Maintenance (Policy)

Cuando hagas cambios en el repo:

1) Decide si el cambio afecta comportamiento observable del producto:
- rutas/pantallas/navegación
- UI/flows
- formularios/validaciones
- datos (Supabase: tablas/queries/auth)
- exportaciones/reportes
- reglas de negocio y flujos E2E

2) Si SÍ:
- Actualiza docs/PRD.md como último paso (solo secciones impactadas).
- No inventes features. Si falta evidencia: "Insufficient data to verify".

3) Si NO:
- Responde: "PRD unchanged (no product behavior change)."
- No toques docs/PRD.md.