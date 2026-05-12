---
title: Connection Wizard UI (Ebony Style)
type: feature
created: 2026-05-11
status: done
baseline_commit: '4e99b002e3a59d76b22ad17dc33f6efca7d17fe3'
context: []
---

# Story 1.4: Connection Wizard UI (Ebony Style)

## Story

As an Admin,
I want a premium dark-themed Wizard UI for adding connections,
So that I have a high-quality onboarding experience.

## Acceptance Criteria

1. **Route Implementation:** Create a dedicated route at `/wizard` protected by authentication.
2. **Ebony Aesthetic:** Apply the premium "Ebony/Terminal" design language (deep blacks, glassmorphism, subtle glows, and high-contrast typography).
3. **Three-Step Flow:**
   - **Step 1: Introduction:** Overview of supported providers (Proxmox/Docker) and what credentials are required.
   - **Step 2: Data Entry:** Form for URL, Tokens/Keys, and Name.
   - **Step 3: Validation:** Technical handshake step (triggering driver-specific validation).
4. **Responsive Design:** Must be fully functional and aesthetically pleasing on mobile and desktop viewports.
5. **Accessibility:** Ensure WCAG 2.1 AA contrast guidelines and full-keyboard navigation for all inputs and buttons.
6. **Real-time Feedback:** Inputs must show validation feedback (success/error) as the user types or leaves a field.

## Tasks

- [x] Register `/wizard` route in `routes/web.php` and map to an Inertia controller.
- [x] Create `WizardController` to handle the step state and initial data.
- [x] Create the main Wizard container component at `resources/js/Pages/Wizard/Index.jsx`.
- [x] Implement Step 1: `Introduction.jsx`.
- [x] Implement Step 2: `ProviderForm.jsx` with validation logic.
- [x] Implement Step 3: `ValidationHandshake.jsx` (UI only for this story; backend logic comes in 1.5).
- [x] Add smooth framer-motion transitions between wizard steps.
- [x] Verify accessibility and contrast using browser dev tools.

## Developer Context

### Intent
The Connection Wizard is the "First Impression" of Vortex. It must feel like a high-end terminal interface, not a standard web form. We want the user to feel the precision and security of the system right from the start.

### Architecture Compliance
- **Framework:** Laravel + Inertia.js + React.
- **Styling:** Tailwind CSS 4 (CSS-first approach in `app.css`).
- **Icons:** `lucide-react`.
- **Animations:** `framer-motion`.

### Technical Notes
- Use a local state in the React component to manage the active step.
- Ensure the "Double-Envelope" encryption context is mentioned in the UI to reassure the user about security.
- The "Validation" step in this story will be a UI placeholder/simulation; the actual driver handshake will be implemented in Story 1.5.

### Previous Story Intelligence (Story 1.3)
- **Lessons Learned:** Ensure all route helpers (`route()`) are available via Ziggy.
- **UI Patterns:** Reuse the glassmorphism card styles from `Dashboard.jsx` and the input styles from `Login.jsx`.
- **Animation Pattern:** Use the `staggerChildren` transition pattern established in the Dashboard for a premium feel.

### References
- `architecture.md#5.3 Auth` (for consistency)
- `prd.md#FR1: Connection Wizard`
- `epics.md#Story 1.4`

## Suggested Review Order

**Backend & Routing**

- Added the wizard route and linked it to the new controller.
  [web.php:12](../../routes/web.php#L12)

- Implemented the entry point for the wizard page.
  [WizardController.php:10](../../app/Http/Controllers/WizardController.php#L10)

**UI & Experience**

- Main Wizard container with step management and Ebony design tokens.
  [Index.jsx:15](../../resources/js/Pages/Wizard/Index.jsx#L15)

- Introduction step with provider overview and security context.
  [Introduction.jsx:5](../../resources/js/Pages/Wizard/Introduction.jsx#L5)

- Data entry form with real-time field validation logic.
  [ProviderForm.jsx:5](../../resources/js/Pages/Wizard/ProviderForm.jsx#L5)

- Simulated handshake validation with premium status animations.
  [ValidationHandshake.jsx:5](../../resources/js/Pages/Wizard/ValidationHandshake.jsx#L5)

