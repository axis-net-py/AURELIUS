# Implementation Plan: AppShell FAB Enhancements

## Phase 1: Implementation

1. [x] Update `src/components/layout/AppShell.tsx`:
    - Replace `import { Send } from 'lucide-react'` with `import { Sparkles } from 'lucide-react'`.
    - Change FAB class names to `fixed bottom-20 right-4 lg:bottom-8 lg:right-8 ...`.
    - Replace `<Send ... />` with `<Sparkles ... />`.

## Phase 2: Validation

1. [x] Run `npm run build`.

## Phase 3: Deployment

1. [x] Stage and commit changes.
2. [x] Push changes.
