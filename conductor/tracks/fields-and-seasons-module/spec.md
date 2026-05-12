# Specification: Fields and Crop Seasons Module

Implement an integrated management system for farm fields (talhões) and crop cycles (safras), enabling cost-per-hectare control.

## Acceptance Criteria

- Database: `fields`, `crop_seasons`, `field_crops` tables with RLS policies.
- Interface: `CropsPage.tsx` with tabs for Fields and Seasons.
- Fields Tab: Grid of cards showing name, area, and status.
- Seasons Tab: List of crops with status and dates.
- Forms: Add Field, Add Season with Zod validation.
- Localization: Full i18n support in `pt-BR.json` and `es.json`.
- Integration: Sidebar link and route configuration.
- Successful build (`npm run build`).

## Files Impacted

- `supabase/migrations/...`
- `src/app/crops/CropsPage.tsx`
- `src/locales/pt-BR.json`
- `src/locales/es.json`
- `src/components/layout/Sidebar.tsx`
- `src/App.tsx`
