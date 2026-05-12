# Specification: Refactor Supabase Imports in Finance Forms

Refactor `NewExpenseForm.tsx` and `NewRevenueForm.tsx` to use static Supabase imports for better performance and consistency.

## Acceptance Criteria

- `NewExpenseForm.tsx` uses `import { supabase } from '@/lib/supabase'` at the top.
- `NewRevenueForm.tsx` uses `import { supabase } from '@/lib/supabase'` at the top.
- Dynamic imports (`await import('@/lib/supabase')`) are removed from `onSubmit` functions in both files.
- Project builds successfully (`npm run build`).
- Changes are committed and pushed to the remote repository.

## Files Impacted

- `src/app/finance/components/NewExpenseForm.tsx`
- `src/app/finance/components/NewRevenueForm.tsx`
