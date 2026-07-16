# MamQi Booth

Version: 1.0.0

---

# Project Overview

MamQi Booth is a web-based photobooth application built with Next.js.

The initial goal is to promote Risol MamQi using an iPad Mini 6.

Future versions may support commercial rental services such as:

- Birthday
- Wedding
- Corporate Event
- Exhibition
- Bazaar
- CFD
- Multi Event
- Multi Client

Every implementation must be scalable for future versions.

Never optimize only for the current version.

---

# Tech Stack

Framework:
- Next.js 16
- React 19
- TypeScript

Styling:
- Tailwind CSS

Deployment:
- Vercel

Version Control:
- Git
- GitHub

Package Manager:
- npm

---

# Development Philosophy

Write clean code.

Write maintainable code.

Avoid unnecessary abstraction.

Avoid over engineering.

Prefer readability over cleverness.

---

# Coding Standards

Always use TypeScript.

Never use JavaScript.

Never use "any".

Prefer explicit types.

Always use ES Modules.

Use async/await.

Avoid Promise.then().

---

# Components

Use Functional Components only.

Prefer Server Components.

Only use "use client" when absolutely necessary.

Each component should have a single responsibility.

Maximum component size:

200 lines

If larger, split into smaller components.

---

# Folder Structure

Use Feature Based Architecture.

Example:

features/
    camera/
    countdown/
    frame/
    gif/
    boomerang/
    qr/
    share/

Do not place business logic inside app/.

app should only contain routing.

---

# Naming Convention

Components

PascalCase

Example

CameraPreview.tsx

CountdownOverlay.tsx

QRDownloadModal.tsx

---

Hooks

camelCase

Example

useCamera.ts

useCountdown.ts

useFullscreen.ts

---

Utilities

camelCase

Example

downloadImage.ts

mergeImages.ts

formatDate.ts

---

Types

PascalCase

Example

CameraSettings.ts

QRCodeData.ts

FrameOptions.ts

---

Constants

UPPER_SNAKE_CASE

Example

MAX_PHOTO_COUNT

DEFAULT_COUNTDOWN

FRAME_RATIO

---

# Styling

Use Tailwind CSS.

Do not use CSS Modules.

Do not use inline styles unless absolutely required.

Keep styling consistent.

Avoid duplicated classes.

---

# State Management

Prefer React State.

Prefer Context for shared state.

Do not introduce Redux, Zustand, MobX or other global state libraries unless there is a clear requirement.

---

# API

Keep API logic inside services/.

Never call fetch directly from UI components.

---

# Hooks

Hooks must contain reusable logic only.

No UI inside hooks.

---

# Components

UI components should not contain business logic.

Business logic belongs inside hooks or services.

---

# Error Handling

Handle every async operation.

Never ignore errors.

Always display user-friendly messages.

---

# Logging

Use console.log only during development.

Remove debug logs before release.

---

# Comments

Write comments only when necessary.

Code should explain itself.

Avoid obvious comments.

---

# Imports

Always use alias:

@/

Example

import CameraPreview from "@/features/camera/components/CameraPreview";

Never use long relative imports.

---

# Assets

Store all assets inside public/.

public/

logos/

frames/

icons/

sounds/

images/

---

# Documentation

Every Sprint must update:

README.md

CHANGELOG.md

Sprint document

---

# Git Commit Convention

Use Conventional Commits.

Examples

feat:

fix:

refactor:

style:

docs:

chore:

test:

build:

---

# Branch Strategy

main

Production

develop

Development

feature/<feature-name>

New Feature

fix/<bug-name>

Bug Fix

---

# Performance

Avoid unnecessary re-render.

Memoize only when needed.

Optimize images.

Lazy load heavy components.

---

# Accessibility

Buttons must be accessible.

Images require alt text.

Keyboard navigation should work.

---

# Security

Never expose secrets.

Never hardcode API keys.

Always validate user input.

---

# Future Compatibility

Every implementation should support future features without major rewrites.

Possible future features include:

- Rental Mode
- Admin Dashboard
- Multi Event
- AI Background
- GIF
- Boomerang
- Analytics
- Cloud Gallery
- Email
- WhatsApp
- QR Download
- Branding
- White Label

---

# AI Assistant Instructions

Before generating code, read:

- `docs/PROJECT_RULES.md`
- `docs/PROJECT_CONTEXT.md`
- `docs/CODING_GUIDE.md`
- `docs/PROMPT_GUIDE.md`

If you generate code:

Follow every rule in this document.

Do not over engineer.

Prefer simple solutions.

Keep files organized.

Maintain feature-based architecture.

Write production-ready code.

Always explain significant architectural decisions.

If multiple implementations exist:

Recommend the simplest scalable solution.
