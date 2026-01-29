---
trigger: glob
globs: apps/web/{app,pages,src,components,lib,hooks,services,schemas,utils,public}/** pnpm-lock.yaml pnpm-workspace.yaml turbo.json package.json
---

# PRD Maintenance (Diff-based)

This rule only runs for product-impacting files (Glob match).

1) Scope:
- run: git diff --name-only
- run: git diff

2) Update docs/PRD.md:
- Only update sections impacted by the diff:
  - routes/navigation/screens
  - features per view
  - forms + validations (schemas + handlers)
  - UX states (loading/empty/error/success)
  - data layer (Supabase: tables/queries/auth)
  - exports/reports
  - E2E flows (Given/When/Then)

3) Rules:
- Never invent features.
- If not verifiable: write "Insufficient data to verify" and point to candidate files.