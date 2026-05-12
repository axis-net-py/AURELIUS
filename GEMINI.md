# GEMINI.md - Project Mandates

This project follows the **Context-Driven Development** methodology managed via the `conductor/` directory.

## Core Rules

1. **Context Priority**: Always read `conductor/index.md` and related artifacts before starting work.
2. **Work Units**: All work must be tracked as "tracks" in `conductor/tracks/`.
3. **Spec and Plan**: Every track must have a `spec.md` and `plan.md` before implementation.
4. **Technology Alignment**: Strictly adhere to the technologies listed in `conductor/tech-stack.md`.
5. **Coding Standards**: Follow the guidelines in `conductor/code_styleguides/`.
6. **Workflow Compliance**: Adhere to the process defined in `conductor/workflow.md`.

## Quality Gates

- **Linting**: Run `npm run lint` and fix all issues before finishing a track.
- **Type Safety**: Ensure no TypeScript errors are introduced.
- **Verification**: Manually verify feature completeness and performance as specified in the track's spec.
