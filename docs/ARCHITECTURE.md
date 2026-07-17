# Architecture

## Purpose

High-level overview of the project architecture.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

## Layout

- `app/` — App Router entry points and layouts.
- `features/` — Feature-based modules owning their own components, hooks, services, and types.
- `components/` — Shared UI primitives.
- `lib/` — Shared utilities.
- `docs/` — Project documentation.

## State

- Session state is owned by `features/session/hooks/useSession.ts`.
- Local UI state is kept inside the component that needs it.
