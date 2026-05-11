# Story 1.1: Project Bootstrap & Environment Setup

Status: review

## Story

As a Developer,
I want a clean Laravel 11 setup with Inertia, React, and Taskfile automation,
so that I have a solid, manual foundation without opinionated kit bloat.

## Acceptance Criteria

1. Laravel 11 installed via `composer create-project`. [Architecture: 2.2]
2. Inertia.js (Server & Client) configured for React 18. [Architecture: 5.1]
3. Laravel Fortify installed and configured in headless mode.
4. `Taskfile.yaml` exists with `setup`, `dev`, and `test` commands. [Architecture: 2.2]
5. Project structure follows the defined tree:
    - `app/Core` (Domain Logic)
    - `tests/Backend` (Pest)
    - `tests/Frontend` (Vitest)
6. Styling uses Vanilla CSS (Initial reset/base styles included). [Architecture: 5.3]

## Tasks / Subtasks

- [x] Initialize Laravel 11 project
- [x] Install and configure Inertia.js (Middleware, app.blade.php)
- [x] Install React 18 and `@inertiajs/react` dependencies
- [x] Configure Vite for React (`vite.config.js`)
- [x] Install and publish Laravel Fortify in headless mode
- [x] Create `Taskfile.yaml` with `setup`, `dev`, and `test` commands
- [x] Create required directory structure (app/Core, tests/*)
- [x] Setup initial CSS reset and Ebony design tokens in `resources/css/app.css`

## Dev Notes

- **Manual Install Only:** DO NOT use Laravel Breeze, Jetstream, or any other starter kits.
- **Naming Convention:** Strictly follow `snake_case` for all backend and frontend keys.
- **Styling:** Use Vanilla CSS. Focus on high-contrast dark mode (Ebony) from the start.
- **Taskfile:** The `setup` command should handle `composer install`, `npm install`, and `.env` creation.

### Project Structure Notes

- Alignment with `architecture.md`:
  - Domain logic goes into `app/Core`.
  - Framework logic (Controllers/Middleware) remains in `app/Http`.
  - Persistence remains in `app/Models` but interfaces should be in `app/Core`.

### References

- [Source: architecture.md#2.2 Implementation Standard]
- [Source: architecture.md#5.1 Technology Stack]
- [Source: epics.md#Story 1.1]

## Dev Agent Record

### Agent Model Used

Antigravity v1.0

### Completion Notes List

### File List

- `composer.json` (Modified: Added Inertia, Fortify, Passkeys)
- `package.json` (Modified: Added React, Inertia, Vite plugin)
- `bootstrap/app.php` (Modified: Registered Inertia middleware)
- `bootstrap/providers.php` (Modified: Registered Fortify provider)
- `config/fortify.php` (Created via publish)
- `resources/views/app.blade.php` (Created: Inertia template)
- `resources/js/app.jsx` (Created: React entry point)
- `resources/js/Pages/Dashboard.jsx` (Created: Test page)
- `vite.config.js` (Modified: Configured React)
- `Taskfile.yaml` (Created: Automation)
- `app/Core/` (Created: Domain directory)
- `tests/Backend/` (Created/Reorganized: Feature/Unit tests)
- `resources/css/app.css` (Modified: Reset & Ebony tokens)
- `phpunit.xml` (Modified: Updated test paths)
