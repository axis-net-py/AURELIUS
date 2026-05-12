# Implementation Plan: Field Operations Module

## Phase 1: Database Setup
1. [ ] Create Supabase migration with tables: `field_operations`, `operation_inputs`.
2. [ ] Implement database trigger `deduct_inventory` to subtract `quantity_used` on insert.
3. [ ] Apply RLS policies.

## Phase 2: Localization
1. [ ] Update `src/locales/pt-BR.json` (keys for title, operation types, inputs).
2. [ ] Update `src/locales/es.json` (keys for title, operation types, inputs).

## Phase 3: Frontend Implementation
1. [ ] Implement `OperationsPage.tsx` with activity timeline, multi-step entry form.
2. [ ] Use `react-hook-form` + `FieldArray` for inputs.
3. [ ] Integrate Supabase logic for cross-table inserts and inventory cost capture.

## Phase 4: Integration
1. [ ] Add link to `Sidebar.tsx`.
2. [ ] Register route in `App.tsx`.

## Phase 5: Validation & Deployment
1. [ ] Run `npm run build`.
2. [ ] Stage, commit, and push.
