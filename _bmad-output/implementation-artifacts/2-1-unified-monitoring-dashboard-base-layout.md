---
id: 2.1
title: Unified Monitoring Dashboard (Base Layout)
key: 2-1-unified-monitoring-dashboard-base-layout
type: story
epic: 1
status: ready-for-dev
priority: high
assignee: developer
created_at: '2026-05-12'
updated_at: '2026-05-12'
---

# Story 2.1: Unified Monitoring Dashboard (Base Layout)

## Story Statement
As an Admin, I want a premium 3-column Ebony layout with a searchable resource sidebar, so that I can manage my entire lab from a single context.

## Business Value
This story establishes the "Control Plane" UI foundation. It transitions the app from a static landing page to a functional command center, providing the visual structure necessary for real-time monitoring and resource orchestration.

## Acceptance Criteria

### UI/UX & Layout
- [ ] **Given** an authenticated user accessing `/dashboard`.
- [ ] **Then** a 3-column layout must be rendered:
    1.  **Column 1 (Sidebar Nav):** Fixed narrow sidebar for global navigation (Dashboard, Wizard, Logs, Settings).
    2.  **Column 2 (Resource List):** Scrollable list of all linked Proxmox/Docker resources, grouped by provider.
    3.  **Column 3 (Main Stage):** Large central area for "In-Focus" resource details or the visual dependency graph.
- [ ] **And** the "Ebony/Terminal" design tokens must be strictly followed (Dark background, vibrant success/warning accents).
- [ ] **And** a "Search Resource" input must be present in the Resource List column, filtering items in real-time.

### Data & Interaction
- [ ] **When** the dashboard loads, it must receive the current list of `Providers` and their initial `Resources` (VMs/Containers) from the backend.
- [ ] **Then** resources must be displayed with their basic identity (Name, Type, UUID) and a "Status" indicator.
- [ ] **And** clicking a resource in the list should mark it as "Selected" (visual highlight).

## Technical Requirements & Guardrails

### Frontend (React/Inertia)
- **Component Splitting:** Do NOT keep everything in `Dashboard.jsx`. Refactor into:
    - `SidebarNav.jsx` (The fixed nav).
    - `ResourceSidebar.jsx` (The column with groups and search).
    - `DashboardLayout.jsx` (A wrapper to maintain the 3-column grid).
- **State Management:** Prepare the structure for **Zustand** integration. For this story, use Inertia props for the initial list.
- **Animations:** Use `Framer Motion` for staggered entry of resource list items.
- **Accessibility:** Ensure keyboard navigation (`Tab`, `Enter`) works for the resource list and search.

### Backend (Laravel)
- **Controller:** Update `DashboardController` (or the dashboard route) to eager load `Providers` and their associated resources.
- **Data Shape:** Return resources grouped by provider type for easy rendering.

## Architecture Compliance
- **Strict `snake_case`:** All props passed from PHP to React must be `snake_case`.
- **Stateless UI:** The UI should reflect the data sent from the backend without maintaining local persistent state (until Zustand is introduced for telemetry).

## Dev Notes & Learnings
- **Previous Work:** We already fixed the basic navigation links in the current `Dashboard.jsx`. This story expands that into a professional layout.
- **Mocking:** Since we have `VORTEX_SIMULATION=true`, the dashboard should display resources from the "Mock Proxmox" provider created in previous tests.

## Files to Create/Modify
- `app/Http/Controllers/DashboardController.php` (If not existing, or update web.php closure)
- `resources/js/Pages/Dashboard.jsx` (Refactor)
- `resources/js/Components/Dashboard/SidebarNav.jsx` (New)
- `resources/js/Components/Dashboard/ResourceSidebar.jsx` (New)
- `resources/js/Components/Dashboard/DashboardLayout.jsx` (New)

## Tasks

- [x] **Task 1: Backend Data Provisioning**
    - [x] Update dashboard route/controller to fetch providers and resources.
    - [x] Create Backend test for dashboard data integrity.
- [x] **Task 2: Frontend Component Refactoring**
    - [x] Create `DashboardLayout.jsx` wrapper.
    - [x] Create `SidebarNav.jsx` (Global navigation).
    - [x] Create `ResourceSidebar.jsx` (Resource list + Search).
- [x] **Task 3: Main Dashboard Assembly**
    - [x] Refactor `Dashboard.jsx` to use the new layout and components.
    - [x] Implement search filtering logic for resources.
- [x] **Task 4: Final Validation**
    - [x] Perform E2E navigation check.
    - [x] Verify responsive layout across breakpoints.

## Dev Agent Record

### Implementation Plan
1.  **Phase 1:** Backend - Ensure `Dashboard` receives a structured object of providers and their resources.
2.  **Phase 2:** Layout - Establish the 3-column grid system.
3.  **Phase 3:** Components - Build the sidebar and resource list with Framer Motion.
4.  **Phase 4:** Search - Add client-side filtering.

### Debug Log
- [2026-05-12 10:00] Initializing Story 2.1.

### Completion Notes
Implemented the 3-column Ebony layout. The dashboard now receives live-mocked resources from providers. Key refactors include composite ID generation to prevent React key collisions and a performant search filter using useMemo.

## File List
- `app/Http/Controllers/DashboardController.php` (UPDATE/NEW)
- `resources/js/Components/Dashboard/DashboardLayout.jsx` (NEW)
- `resources/js/Components/Dashboard/SidebarNav.jsx` (NEW)
- `resources/js/Components/Dashboard/ResourceSidebar.jsx` (NEW)
- `resources/js/Pages/Dashboard.jsx` (UPDATE)

## Change Log
- [2026-05-12] Story initialized for development.

## Status
Status: `done`

---
**Status Update:** Ultimate context engine analysis completed - comprehensive developer guide created.
