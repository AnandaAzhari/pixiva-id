# ADR-001: Project Architecture

## Status

Accepted

## Date

2026-07-15

## Context

MamQi Booth is a kiosk-first web photobooth application designed primarily for iPad Mini 6. Version 1 promotes Risol MamQi through a simple customer photo experience.

Future versions may support commercial rental use cases, including multiple events, client branding, administration, and additional capture or sharing capabilities. The project requires an architecture that supports incremental growth without building unnecessary complexity before it is needed.

## Problem Statement

The project must keep Version 1 focused while remaining maintainable as new capabilities are introduced. The architecture must provide:

- Clear separation of routing, UI, and business logic.
- Independent ownership for future features.
- A lightweight runtime suitable for an iPad kiosk.
- Consistent guidance for developers and AI coding assistants.
- Documentation that preserves product and engineering decisions over time.

## Decision

MamQi Booth will use the following architecture and development approach:

- **Next.js 16** provides a stable web application framework, routing, rendering model, and Vercel deployment path.
- **React 19** provides a component model suitable for interactive kiosk experiences.
- **TypeScript** improves correctness, communicates intent, and supports long-term maintainability.
- **Tailwind CSS** provides consistent, touch-friendly styling without introducing a large custom styling layer.
- **App Router** owns routes, layouts, metadata, and route-level composition.
- **Feature-Based Architecture** groups implementation by product capability as features are introduced, keeping ownership clear and reducing unrelated coupling.
- **Browser-native APIs first** minimize dependencies and bundle size, particularly for camera and media capabilities.
- **Documentation-first development** keeps product scope, engineering rules, roadmap, and decisions visible before implementation begins.
- **AI-assisted development** follows the documented project context, avoids assumptions, and recommends the simplest scalable solution.

Business logic must remain outside the App Router and independent from UI components where practical. Folders and shared abstractions are created only when an implemented feature requires them.

## Alternatives Considered

### Traditional MVC

Not selected because it does not align naturally with the component and feature-oriented model of the application.

### Layer-Based Architecture

Not selected because global component, service, hook, and type layers would introduce indirection before multiple features require shared ownership.

### Monolithic Components

Not selected because combining UI, state, and business logic makes kiosk flows harder to maintain, test, and evolve.

### Premature Microservices

Not selected because Version 1 does not require distributed-system complexity or additional operational overhead.

### Heavy State Management Libraries

Not selected because React state and Context API are sufficient for the current product scope. A dedicated state library requires a demonstrated need.

## Consequences

### Positive

- Features can evolve independently as product scope grows.
- The codebase remains easier to understand and maintain.
- Dependencies and client-side JavaScript remain constrained.
- Documentation improves onboarding and AI-assisted collaboration.
- Architecture decisions remain traceable over time.

### Trade-offs

- Documentation requires ongoing maintenance.
- Planning before implementation adds a small upfront cost.
- Shared abstractions may be introduced later than in a layer-first structure.

These trade-offs are accepted because they reduce long-term complexity and lower the risk of major rewrites.

## Future Impact

This architecture supports incremental introduction of Rental Mode, Multi Event, Admin Dashboard, QR Download, WhatsApp Share, GIF, Boomerang, AI Background, and White Label capabilities.

Each capability can be planned and implemented as a focused addition without requiring unrelated areas of the application to be rewritten.

## References

- `docs/PROJECT_RULES.md`
- `docs/PROJECT_CONTEXT.md`
- `docs/CODING_GUIDE.md`
- `docs/PROMPT_GUIDE.md`
- `docs/ROADMAP.md`

## Decision Summary

- Use Next.js 16, React 19, TypeScript, and Tailwind CSS.
- Use App Router for routes and route-level composition only.
- Keep business logic outside `app/` and separate from UI.
- Add feature boundaries only when implementation begins.
- Prefer feature ownership over premature global abstractions.
- Prefer browser-native APIs and minimal dependencies.
- Use documentation as the shared source of truth.
- Require AI-assisted work to follow documented scope and constraints.
- Favor simple, maintainable decisions over speculative architecture.
