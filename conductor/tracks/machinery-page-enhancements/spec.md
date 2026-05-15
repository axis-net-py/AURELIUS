# Specification: MachineryPage Enhancements

Refactor the `MachineryPage` to use live data and implement maintenance and fuel logging functionality.

## Acceptance Criteria

- Replace mock machinery data with a live Supabase query.
- Add "Maintenance" and "Fuel" buttons to each machine card.
- Implement modal forms for logging maintenance and fuel, saving to Supabase.
- Localize all UI strings in `MachineryPage.tsx`.
- Fix syntax errors in the `select` options.
- Successful build (`npm run build`).
- Changes committed and pushed.

## Files Impacted

- `src/app/machinery/MachineryPage.tsx`
