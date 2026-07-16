# MamQi Booth Coding Guide

Version: 1.0.0

---

## Purpose

This guide defines implementation standards for MamQi Booth. Its goal is consistent, readable, maintainable code that supports the current product scope without unnecessary complexity.

## Required Reading

Before implementation, read:

- `docs/PROJECT_RULES.md`
- `docs/PROJECT_CONTEXT.md`
- `docs/CODING_GUIDE.md`
- `docs/PROMPT_GUIDE.md`

## General Principles

- Keep solutions simple and focused.
- Avoid duplication when a clear reuse case exists.
- Do not build functionality before it is required.
- Favor composition and clear responsibilities.
- Prefer maintainability over cleverness.

## Structure and Ownership

- Keep routing and route composition in `app/`.
- Create feature folders only when implementation begins.
- A feature owns its components, hooks, services, and types when needed.
- Keep business logic independent from UI components.
- Create shared abstractions only when multiple features require them.

## TypeScript and Components

- Use TypeScript. Do not use `any`.
- Use functional components only.
- Prefer Server Components; use client components only when browser APIs, events, state, or effects require them.
- Give each component one responsibility and keep it under 200 lines.
- Keep hooks under 150 lines, services under 200 lines, and utilities under 100 lines.

## Hooks, Services, and Utilities

- Hooks contain reusable logic and never render UI.
- Services handle business logic, browser integrations, storage, and API communication.
- UI components must not contain business logic.
- Prefer pure utilities for small reusable transformations.

## Styling and Accessibility

- Use Tailwind CSS.
- Avoid CSS Modules and inline styles unless required.
- Build kiosk-first interfaces with large touch targets and minimal text.
- Ensure keyboard-accessible controls, labelled inputs, meaningful image alt text, and focus-managed dialogs.

## Browser and Dependency Policy

- Prefer browser-native APIs before adding dependencies.
- Use the MediaDevices API for camera access unless a clear need requires otherwise.
- Handle asynchronous failures with user-friendly messages and retry where appropriate.
- Do not install packages or change configuration without approval.

## Quality Expectations

- Use alias imports from `@/`.
- Remove debug logging before release.
- Run relevant checks before completion.
- Update `README.md`, `CHANGELOG.md`, sprint documentation, and decisions when a change requires it.
