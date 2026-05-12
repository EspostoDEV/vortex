---
epic: Epic 2 - Unified Real-time Monitoring
story_id: 2.3
title: Real-time Metric Streaming (Reverb)
status: ready-for-dev
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
- [ ] **Task 1: Backend Broadcast Event**
    - [ ] Create `ResourceMetricsUpdated` event implementing `ShouldBroadcastNow`.
    - [ ] Define the channel `telemetry` (or `resource.{id}`).
- [ ] **Task 2: Reverb Configuration**
    - [ ] Ensure `config/broadcasting.php` is set to reverb.
    - [ ] Setup `routes/channels.php` if using private channels.
- [ ] **Task 3: Mock Broadcaster Command**
    - [ ] Create `app/Console/Commands/MockMetricsStream.php` to simulate backend updates every 2s for testing.
- [ ] **Task 4: Frontend Echo Listener**
    - [ ] Setup Laravel Echo in `bootstrap.js` or directly in a React hook.
    - [ ] Create a `useTelemetryStream` hook that listens to the event and pipes data to Zustand.
- [ ] **Task 5: Connection State UI**
    - [ ] Listen to Echo's `connect` and `disconnect` events.
    - [ ] Add an "Out-of-Sync" visual indicator in the UI when disconnected.

## Dev Agent Record
### Debug Log
*(Leave empty - to be filled during development)*

### Completion Notes
*(Leave empty - to be filled during development)*
