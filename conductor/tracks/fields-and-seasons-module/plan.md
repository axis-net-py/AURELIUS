# Implementation Plan: Fields and Crop Seasons Module

## Phase 1: Database Setup
1. [ ] Create Supabase migration with tables: `fields`, `crop_seasons`, `field_crops`.
2. [ ] Apply RLS policies for multi-tenancy.

## Phase 2: Localization
1. [ ] Update `src/locales/pt-BR.json` (keys for title, tabs, labels).
2. [ ] Update `src/locales/es.json` (keys for title, tabs, labels).

## Phase 3: Frontend Implementation
1. [ ] Implement `CropsPage.tsx` using `shadcn/ui` Tabs, Cards, and Dialogs.
2. [ ] Add forms for Field/Season creation using `zod` and `react-hook-form`.
3. [ ] Integrate Supabase fetch/insert logic.

## Phase 4: Integration
1. [ ] Add link to `Sidebar.tsx`.
2. [ ] Register route in `App.tsx`.

## Phase 5: Validation & Deployment
1. [ ] Run `npm run build`.
2. [ ] Stage, commit, and push changes.
