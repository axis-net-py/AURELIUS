# Implementation Plan: Harvest and Sales Module

## Phase 1: Database Setup
1. [ ] Create Supabase migration with tables: `harvest_records`, `sales_contracts`.
2. [ ] Apply RLS policies for multi-tenancy.

## Phase 2: Localization
1. [ ] Update `src/locales/pt-BR.json`.
2. [ ] Update `src/locales/es.json`.

## Phase 3: Frontend Implementation
1. [ ] Implement `HarvestPage.tsx` with tabs, KPIs, and forms.
2. [ ] Implement yield productivity calculation logic.
3. [ ] Integrate Supabase logic for records and contracts.

## Phase 4: Integration
1. [ ] Add link to `Sidebar.tsx`.
2. [ ] Register route in `App.tsx`.

## Phase 5: Validation & Deployment
1. [ ] Run `npm run build`.
2. [ ] Stage, commit, and push.
