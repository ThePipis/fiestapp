---
description: Útil para antes de TestSprite, o cuando hiciste muchos cambios y quieres refrescar PRD.
---

---
description: Update docs/PRD.md from repo (diff-based, product-only)
---

1) Scope:
- run: git diff --name-only
- run: git diff

2) Extraer SOLO hechos verificables:
- rutas/pantallas (Next app/ o pages/ y navegación real)
- features por pantalla
- forms: campos + validaciones desde schemas/handlers
- estados UX observables
- data layer: Supabase tables/queries/auth SOLO si aparecen en código
- export/report: xlsx/jspdf y entrypoints

3) Escribir docs/PRD.md:
- edita SOLO secciones impactadas
- agrega/ajusta flujos E2E Given/When/Then testables

4) Salida:
- guardar docs/PRD.md
- resumen breve de cambios