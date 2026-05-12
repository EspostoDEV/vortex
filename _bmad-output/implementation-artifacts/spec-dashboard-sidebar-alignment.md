---
title: Dashboard Sidebar Icon Alignment Fix
type: bugfix
created: 2026-05-11
status: done
baseline_commit: '1545ae6179471a6ad1ac36ecd16b8a2c9bb1f97a'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sidebar icons in the Dashboard (middle nav group and logout button) are shifted to the left instead of being horizontally centered within the sidebar.

**Approach:** Apply `flex` centering utilities to both the group containers and the individual button/link elements to ensure consistent Ebony-style symmetry.

## Boundaries & Constraints

**Always:** Maintain the 80px (`w-20`) width of the sidebar and the existing Ebony color palette.

**Ask First:** If any layout change affects the visibility of the "Double-Envelope Active" status indicator at the bottom.

**Never:** Change the sidebar into a collapsible menu or change its background color.

</frozen-after-approval>

## Code Map

- `resources/js/Pages/Dashboard.jsx` -- Primary UI component containing the sidebar navigation structure.

## Tasks & Acceptance

**Execution:**
- [x] `resources/js/Pages/Dashboard.jsx` -- Add `flex flex-col items-center` to the middle nav container and center-align all button/link icons.

**Acceptance Criteria:**
- Given the Dashboard is loaded, when inspecting the sidebar, then all icons (Shield, Dashboard, Activity, Terminal, Power) must be perfectly centered horizontally.
- Given the sidebar width is 80px, when measuring the distance from the left and right edges to the icons, then they must be equal.

## Spec Change Log

## Design Notes

The current misalignment happens because the `div` containing the navigation items lacks its own flex centering, causing its block-level children to align to the start. Adding `flex flex-col items-center` to the container and ensuring the buttons themselves use `flex items-center justify-center` will fix this.

## Verification

**Manual checks (if no CLI):**
- Visually verify alignment using browser developer tools and the provided Ebony UI screenshot as a reference.

## Suggested Review Order

- Added flex centering to the middle navigation group container.
  [Dashboard.jsx:42](../../resources/js/Pages/Dashboard.jsx#L42)

- Centered individual nav buttons and the logout link content.
  [Dashboard.jsx:54](../../resources/js/Pages/Dashboard.jsx#L54)
