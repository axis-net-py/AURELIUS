# Specification: Inventory Management Module

Implement an inventory management system to control farm inputs (seeds, fertilizers, chemicals).

## Acceptance Criteria

- Database: `inventory` table with RLS.
- Dashboard: Summary cards (Total Value, Critical Items, Latest Entries).
- Table: Searchable and filterable list of inventory items.
- Forms: Add/Adjust inventory with Zod validation.
- Localization: Complete i18n support for all new strings.
- Integration: New page linked in `AppShell` and routed in `App.tsx`.
- Successful build (`npm run build`).
- Code committed and pushed.

## Files Impacted

- `supabase/migrations/...`
- `src/app/inventory/InventoryPage.tsx`
- `src/locales/pt-BR.json`
- `src/locales/es.json`
- `src/components/layout/AppShell.tsx`
- `src/App.tsx`
