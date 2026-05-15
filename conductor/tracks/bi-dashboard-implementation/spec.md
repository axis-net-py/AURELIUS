# Specification: Financial Dashboard and BI Module

Implement a 'War Room' dashboard aggregating financial and operational data for real-time profitability analysis.

## Acceptance Criteria

- Database: Supabase SQL View/Function to aggregate Costs, Revenue, and Profit by season.
- Dashboard: 'War Room' layout with Recharts graphs (Cost vs. Revenue, Cost Distribution, Price Evolution).
- Performance Metrics: CPH, Break-even, Profit Margin.
- Currency Selector: Global state toggle (BRL/USD/PYG) for value conversion.
- Localization: Full i18n support in `pt-BR.json` and `es.json`.
- Integration: Dashboard as root route ('/') and primary icon in sidebar.
- Successful build (`npm run build`).
- Code committed and pushed.

## Files Impacted

- `supabase/migrations/...`
- `src/app/dashboard/DashboardPage.tsx`
- `src/locales/pt-BR.json`
- `src/locales/es.json`
- `src/App.tsx`
- `src/components/layout/Sidebar.tsx`
