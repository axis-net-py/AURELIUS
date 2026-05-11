# AURELIUS-main Project Guidelines

## Project Overview

AURELIUS-main is a React + TypeScript + Vite application for agricultural management. It features authentication, financial tracking, inventory management, machinery tracking, reports, and season-based harvest/input tracking with WhatsApp integration.

## Commands

- Development: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Preview: `npm run preview`

## Code Style

- Use TypeScript for all new code
- Functional components with React Hooks
- Tailwind CSS for styling (via @tailwindcss/vite)
- Early returns for error handling
- Zod for form validation and data parsing
- React Query for server state management
- Zustand for client state management
- Follow existing patterns in the codebase

## Project Structure

```
/src
  /app - Main application pages (route-based structure)
  /components - Reusable UI components
  /i18n.ts - Internationalization configuration
  /lib - Utility functions and Supabase client
  /locales - Translation files (es.json, pt-BR.json)
  /services - Business logic services
  /store - Zustand stores
  /types - TypeScript type definitions
  /assets - Static assets
  App.tsx - Root component
  main.tsx - Entry point
  index.css - Global CSS
```

## Key Features & Patterns

### Authentication
- Uses Supabase for auth
- AuthProvider component manages auth state
- LoginPage handles user authentication
- Protected routes should check auth state

### State Management
- Zustand stores in `/src/store` for client state
- React Query (`@tanstack/react-query`) for server state
- Supabase real-time subscriptions where applicable

### Forms
- React Hook Form with Zod validation
- Consistent UI using Radix UI components
- Follow existing form patterns in finance and seasons modules

### Internationalization
- i18next configured in `/src/i18n.ts`
- Translation files in `/src/locales`
- Use `t()` function for translations
- Language detection and persistence configured

### Styling
- Tailwind CSS v4 via `@tailwindcss/vite`
- Custom utility classes in components
- Follow existing Tailwind patterns
- Use lucide-react for icons

### Database
- Supabase backend via `/src/lib/supabase.ts`
- Types generated from schema (if applicable)
- Follow Supabase best practices for queries

## Development Workflow

1. Read README.md first to understand project context
2. Before editing a file, read its content to understand existing patterns
3. After making changes, run `npm run lint` to check for issues
4. Test changes in development with `npm run dev`
5. For UI changes, verify responsiveness and accessibility
6. When adding new features, follow existing module patterns

## Database & Supabase

- Supabase client initialized in `/src/lib/supabase.ts`
- Use proper TypeScript types for database operations
- Handle loading and error states in queries
- Consider real-time subscriptions for live updates

## Testing & Verification

- No formal test setup currently - verify changes manually
- Ensure AI service integrations work correctly
- Verify form validation and submission flows
- Check that internationalization works for all languages
- Test responsive design on mobile and desktop

## Environment Variables

- See `.env.example` for required variables
- Supabase URL and anon key required
- API keys for AI services (Anthropic, OpenAI)
- WhatsApp verification token for webhook

## AI Integration

- Anthropic and OpenAI APIs configured
- Services in `/src/services` directory
- Follow existing patterns for AI service calls
- Handle API errors and loading states appropriately