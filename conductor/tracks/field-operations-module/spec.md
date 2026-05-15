# Specification: Field Operations Module

Implement an integrated management system for farm field operations, tracking inputs and machinery usage while automatically deducting stock.

## Acceptance Criteria

- Database: `field_operations` and `operation_inputs` tables with RLS policies.
- Database Trigger: Automatic inventory deduction when an operation is logged.
- Interface: `OperationsPage.tsx` with a timeline of activities and a multi-item entry form.
- Logic: Capture inventory cost at the time of application.
- Localization: Full i18n support in `pt-BR.json` and `es.json`.
- Integration: New page linked in `AppShell` and routed in `App.tsx`.
- Successful build (`npm run build`).
- Code committed and pushed.

## Files Impacted

- `supabase/migrations/...`
- `src/app/operations/OperationsPage.tsx`
- `src/locales/pt-BR.json`
- `src/locales/es.json`
- `src/components/layout/AppShell.tsx`
- `src/App.tsx`
