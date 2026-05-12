# Specification: SettingsPage Enhancements

Improve the `SettingsPage` by adding missing fields, sections, and fixing UI/UX issues.

## Acceptance Criteria

- Fix hardcoded strings in `SettingsPage.tsx` using `t()`.
- Add "address" and "phone" fields to the farm profile form.
- Add WhatsApp section (Card) with phone number input and informational text.
- Add Currency section (Card) using `CurrencySelector`.
- Apply mobile-first layout (vertical stacking).
- Fix theme switch state to reflect current `isDark` state.
- Update `pt-BR.json` and `es.json` with new keys.
- Successful build (`npm run build`).

## Files Impacted

- `src/app/settings/SettingsPage.tsx`
- `src/locales/pt-BR.json`
- `src/locales/es.json`
