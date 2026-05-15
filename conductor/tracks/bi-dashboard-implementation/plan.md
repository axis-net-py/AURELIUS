# Implementation Plan: Financial Dashboard and BI Module

## Phase 1: Database Setup
1. [ ] Create Supabase migration to add `financial_summary` view/RPC.
2. [ ] Ensure RLS policies are applied.

## Phase 2: Localization
1. [ ] Update `src/locales/pt-BR.json` with dashboard keys.
2. [ ] Update `src/locales/es.json` with dashboard keys.

## Phase 3: Frontend Implementation
1. [ ] Create `DashboardPage.tsx` with Recharts charts.
2. [ ] Implement currency conversion logic using `Zustand`.
3. [ ] Implement KPI calculation logic (CPH, Break-even, Margin).
4. [ ] Integrate with Supabase via TanStack Query.

## Phase 4: Integration
1. [ ] Update `Sidebar.tsx` to set `DashboardPage` as the primary navigation item.

## Phase 5: Validation & Deployment
1. [ ] Run `npm run build`.
2. [ ] Stage, commit, and push.
