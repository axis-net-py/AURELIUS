# Implementation Plan: Refactor Supabase Imports in Finance Forms

## Phase 1: Implementation

1.  [x] Update `src/app/finance/components/NewExpenseForm.tsx`:
    - Add `import { supabase } from '@/lib/supabase'` at the top.
    - Remove dynamic import logic from `onSubmit`.
2.  [x] Update `src/app/finance/components/NewRevenueForm.tsx`:
    - Add `import { supabase } from '@/lib/supabase'` at the top.
    - Remove dynamic import logic from `onSubmit`.

## Phase 2: Validation

1.  [x] Run `npm run build` to ensure the project builds correctly.
2.  [x] Run `npm run lint` to verify coding standards.

## Phase 3: Deployment

1.  [x] Stage changes: `git add src/app/finance/components/NewExpenseForm.tsx src/app/finance/components/NewRevenueForm.tsx`.
2.  [x] Commit changes: `git commit -m "fix: use static supabase import in expense/revenue forms"`.
3.  [ ] Push changes: `git push`. (Skipped: No remote configured)
