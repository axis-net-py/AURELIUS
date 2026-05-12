# Specification: Tailwind v4 Configuration Fix

Resolve conflicts between `tailwind.config.js` and Tailwind v4's CSS-first configuration by simplifying the JS config and ensuring all design tokens live in `src/index.css`.

## Acceptance Criteria

- `tailwind.config.js` is reduced to only `darkMode: 'class'` and `content`.
- All design tokens (fonts, colors, border-radius) are managed within the `@theme` block in `src/index.css`.
- Missing tokens (if any) are added to `src/index.css`.
- Project builds successfully (`npm run build`).
- Changes are committed and pushed.

## Files Impacted

- `tailwind.config.js`
- `src/index.css`
