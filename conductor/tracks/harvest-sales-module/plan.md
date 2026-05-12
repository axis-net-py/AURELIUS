# Implementation Plan: Harvest and Sales Module

## Phase 1: Database Setup
1. [x] Create Supabase migration with tables: `harvest_records`, `sales_contracts`.
2. [x] Apply RLS policies for multi-tenancy.

## Phase 2: Localization
1. [x] Update `src/locales/pt-BR.json`.
2. [x] Update `src/locales/es.json`.

## Phase 3: Frontend Implementation
1. [x] Implement `HarvestPage.tsx` with tabs, KPIs, and forms.
2. [x] Implement yield productivity calculation logic.
3. [x] Integrate Supabase logic for records and contracts.

## Phase 4: Integration
1. [x] Add link to `Sidebar.tsx`.
2. [x] Register route in `App.tsx`.

## Phase 5: Validation & Deployment
1. [x] Run `npm run build`.
2. [x] Stage, commit, and push.
