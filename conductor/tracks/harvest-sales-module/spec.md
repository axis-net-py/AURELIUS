# Specification: Harvest and Sales Management Module

Implement an integrated management system for harvest records and sales contracts, enabling yield tracking and revenue management.

## Acceptance Criteria

- Database: `harvest_records` and `sales_contracts` tables with RLS policies.
- Interface: `HarvestPage.tsx` with tabs for Harvest Records and Sales Contracts.
- Dashboard: KPIs for Total Harvested, Average Yield, and Projected Gross Revenue.
- Forms: New Harvest Record and New Sales Contract forms with Zod validation.
- Logic: Automatic yield productivity calculation (quantity / field area).
- Localization: Full i18n support in `pt-BR.json` and `es.json`.
- Integration: Sidebar link and route configuration.
- Successful build (`npm run build`).
- Code committed and pushed.

## Files Impacted

- `supabase/migrations/...`
- `src/app/harvest/HarvestPage.tsx`
- `src/locales/pt-BR.json`
- `src/locales/es.json`
- `src/components/layout/Sidebar.tsx`
- `src/App.tsx`
