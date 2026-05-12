## Deferred from: code review of 2-2-zustand-telemetry-store (2026-05-12)
- Deep merge metrics recursively [`useMetricStore.js`:31] — Current implementation merges only one level deep, which is acceptable if metrics are scalars, but deferred for future complexity.
