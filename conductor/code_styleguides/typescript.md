# TypeScript Style Guide: Agro Manager

## Core Principles

- **Strict Typing**: Avoid `any`. Use interfaces and types for all data structures.
- **Functional Components**: Prefer functional components with hooks over class components.
- **Props Definition**: Use TypeScript interfaces for component props.

## Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`).
- **Hooks**: camelCase starting with `use` (e.g., `useAuth.ts`).
- **Services**: camelCase (e.g., `financeService.ts`).
- **Types/Interfaces**: PascalCase.

## Error Handling

- **Early Returns**: Check for error conditions early and return.
- **Type Guards**: Use type guards for safe data processing.

## State Management Patterns

- **Zustand**: Keep stores focused and modular in `/src/store`.
- **React Query**: Use for all server data fetching and mutations.

## Components

- Keep components small and focused.
- Extract complex logic into custom hooks.
- Use Tailwind CSS v4 utility classes for styling.
