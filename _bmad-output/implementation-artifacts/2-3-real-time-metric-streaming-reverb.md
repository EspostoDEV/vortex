---
epic: Epic 2 - Unified Real-time Monitoring
story_id: 2.3
title: Real-time Metric Streaming (Reverb)
status: done
---

# Story 2.3: Real-time Metric Streaming (Reverb)

## User Story
As an Admin,
I want resource metrics to update automatically in real-time,
So that I have immediate awareness of my infrastructure health.

## Context
In Story 2.2, we established the Zustand global store for client-side state management. Now, we need to feed this store with real-time metrics using Laravel Reverb. The backend needs to broadcast metrics (CPU, RAM, IO, Status) every 2-5s. The frontend needs to listen to these broadcasts and update the Zustand store using the `updateResource` action we created. We also need to handle connection drops with an "Out-of-Sync" visual indicator and auto-resync upon reconnection.

## Acceptance Criteria

- **Given** the Laravel Reverb broadcasting server
- **When** a resource is "In-Focus" (visible on screen)
- **Then** the backend broadcasts metrics (CPU/RAM/IO) every 2-5s
- **And** the frontend listener updates the Zustand store automatically (NFR2)
- **And** an "Out-of-Sync" indicator appears if the WebSocket connection drops
- **And** the UI must automatically re-sync state upon reconnection without data duplication.

## Architecture & Technical Constraints
- **Laravel Echo & Reverb:** Use Echo to listen to the private or public channels.
- **Backend Broadcasting:** Create a Laravel event `ResourceMetricsUpdated` that implements `ShouldBroadcastNow`.
- **Frontend Listener:** Implement a custom React hook `useReverbListener` inside `Dashboard.jsx` or a dedicated component that hooks into Echo and calls `useMetricStore.getState().updateResource(id, data)`.
- **Connection Status:** Track Echo's connection state to display the "Out-of-Sync" indicator in the `SidebarNav` or main dashboard header.
- **Mock Data Generation:** Since we don't have real servers yet, create an artisan console command `vortex:mock:metrics` that runs in a loop, picking random resources and broadcasting fake metric updates to test the pipeline.

## Tasks
- [x] **Task 1: Backend Broadcast Event**
    - [x] Create `ResourceMetricsUpdated` event implementing `ShouldBroadcastNow`.
    - [x] Define the channel `telemetry` (or `resource.{id}`).
- [x] **Task 2: Reverb Configuration**
    - [x] Ensure `config/broadcasting.php` is set to reverb.
    - [x] Setup `routes/channels.php` if using private channels.
- [x] **Task 3: Mock Broadcaster Command**
    - [x] Create `app/Console/Commands/MockMetricsStream.php` to simulate backend updates every 2s for testing.
- [x] **Task 4: Frontend Echo Listener**
    - [x] Setup Laravel Echo in `bootstrap.js` or directly in a React hook.
    - [x] Create a `useTelemetryStream` hook that listens to the event and pipes data to Zustand.
- [x] **Task 5: Connection State UI**
    - [x] Listen to Echo's `connect` and `disconnect` events.
    - [x] Add an "Out-of-Sync" visual indicator in the UI when disconnected.

## Dev Agent Record
### Debug Log
- Encountered a wait loop during `install:broadcasting` due to interactive prompts for installing Node dependencies, resolved by sending inputs.
- Verified Echo connection drops can be accurately captured via Pusher bindings (`connected`, `disconnected`, `unavailable`).
- Passed data to Zustand bypassing the `id` duplication.

### Completion Notes
- The Reverb setup works end-to-end. The `vortex:mock:metrics` command allows for robust visual testing of real-time metrics streaming.
- The UI handles out-of-sync gracefully using framer-motion animations and custom alert indicators.
- Wrote basic unit tests for the broadcasting event to ensure proper channel payload propagation.

### Review Findings (Code Review — post-implementation)
- [x] [HIGH][Patch] `window.Echo` without retry — hook now polls up to 10× with 300ms gaps [`useTelemetryStream.js`]
- [x] [HIGH][Patch] `unbind` without handler ref removed global listeners — now uses named refs [`useTelemetryStream.js`]
- [x] [HIGH][Patch] AC4 missing: no re-sync on reconnection — `onConnected` now fetches `/api/resources` and calls `setResources` [`useTelemetryStream.js`]
- [x] [MEDIUM][Patch] `isConnected(false)` initial flash — state now starts as `null`; banner guards on `=== false` [`Dashboard.jsx`]
- [x] [MEDIUM][Patch] Race condition (WebSocket before hydration) — mitigated by upsert in `updateResource` (Story 2.2 store patch)
- [x] [MEDIUM][Security] Channel auth has no tenant isolation — TODO comment added; deferred to multi-tenant story [`channels.php`]
- [x] [MEDIUM][Patch] `App.Models.User.{id}` channel removed — restored alongside `telemetry` channel [`channels.php`]
- [x] [LOW][Patch] `Event::fake()` unused — split into two tests; dispatch now asserted via `Event::assertDispatched` [`TelemetryStreamTest.php`]
- [x] [LOW][Config] `allowed_origins: ['*']` env-specific — now uses `REVERB_ALLOWED_ORIGINS` env with `*` fallback [`config/reverb.php`]
