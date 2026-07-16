# MamQi Booth Prompt Guide

Version: 1.0.0

---

## Purpose

This guide makes AI-assisted work consistent, scoped, and reviewable. Structured prompts reduce assumptions and keep implementation aligned with MamQi Booth’s product and engineering documentation.

## Required Reading

Before requesting or generating implementation, read:

- `docs/PROJECT_RULES.md`
- `docs/PROJECT_CONTEXT.md`
- `docs/CODING_GUIDE.md`
- `docs/PROMPT_GUIDE.md`

## Standard Prompt Structure

Every implementation prompt should include:

1. **Role** — the expertise expected from the AI.
2. **Context** — relevant product, user, and business information.
3. **Current State** — existing behavior, files, and limitations.
4. **Task** — the specific outcome requested.
5. **Requirements** — functional and quality expectations.
6. **Constraints** — prohibited actions and scope boundaries.
7. **Output** — expected deliverables.
8. **Acceptance Criteria** — verifiable completion conditions.

## Reusable Template

```text
ROLE
[Expected expertise]

CONTEXT
[Relevant product and user context]

CURRENT STATE
[Existing files, behavior, and limitations]

TASK
[Specific requested outcome]

REQUIREMENTS
- [Requirement]

CONSTRAINTS
- [Constraint]

OUTPUT
[Expected deliverables]

ACCEPTANCE CRITERIA
- [Verifiable outcome]
```

## Prompt Rules

- Never invent requirements.
- Ask for clarification when scope is ambiguous.
- Never create unnecessary folders or abstractions.
- Never install packages or change configuration without approval.
- Never rewrite architecture without a clear reason and approval.
- Explain significant architectural decisions before implementation.
- Prefer browser-native APIs and the simplest scalable solution.

## Prompt Quality

Good prompts are explicit, focused, context-aware, constrained, and measurable. Avoid vague requests such as “build everything,” “improve the project,” or “optimize” without identifying the affected scope and intended outcome.

## Sprint Start

Every sprint begins by reviewing `docs/PROJECT_RULES.md`, `docs/PROJECT_CONTEXT.md`, `docs/CODING_GUIDE.md`, and `docs/PROMPT_GUIDE.md`.
