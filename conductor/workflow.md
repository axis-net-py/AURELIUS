# Development Workflow: Agro Manager

## Methodology

- **Iterative Development**: Small, focused tracks.
- **Context-First**: Define specs and plans before implementation.
- **TDD (where applicable)**: Write tests to verify changes.

## Development Loop

1. **Intake**: Analyze requirements or bugs.
2. **Context**: Update artifacts in `conductor/` if necessary.
3. **Spec**: Define clear acceptance criteria in `conductor/tracks/<track-id>/spec.md`.
4. **Plan**: Break down tasks in `conductor/tracks/<track-id>/plan.md`.
5. **Implement**: Surgical code changes with automated tools where possible.
6. **Validate**: Run linting (`npm run lint`) and manual verification.

## Standards

- **TypeScript**: Mandatory for all new code.
- **Styling**: Tailwind CSS v4 utility classes.
- **Naming**: Consistent camelCase for variables/functions, PascalCase for components.
- **Formatting**: Adhere to existing ESLint configuration.

## Quality Gates

- Linting must pass.
- Type checking must pass.
- Acceptance criteria must be met.
- Responsive design verification.
- i18n support for all translations.
