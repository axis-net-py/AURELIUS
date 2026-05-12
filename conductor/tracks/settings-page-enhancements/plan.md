# Implementation Plan: SettingsPage Enhancements

## Phase 1: Localization

1. [x] Update `src/locales/pt-BR.json` with new keys.
2. [x] Update `src/locales/es.json` with new keys.

## Phase 2: Implementation (`SettingsPage.tsx`)

1. [x] Add `address` and `phone` to `farmSchema`.
2. [x] Replace hardcoded strings with `t()`.
3. [x] Add `useState` for `isDark` and update `toggleTheme` logic.
4. [x] Implement mobile-first layout update.
5. [x] Integrate WhatsApp section.
6. [x] Integrate Currency section.
7. [x] Update `Switch` component.

## Phase 3: Validation

1. [x] Run `npm run build`.

## Phase 4: Deployment

1. [x] Stage and commit changes.
2. [x] Push changes.
