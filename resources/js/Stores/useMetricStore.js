import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const storeConfig = (set) => ({
    resources: {},
    updateQueue: {},
    flushTimeout: null,

    // Set the entire collection (used for hydration)
    setResources: (resourcesList) => {
        if (!Array.isArray(resourcesList)) {
            console.warn('setResources expected an array, got:', resourcesList);
            return;
        }

        const resourcesMap = resourcesList.reduce((acc, res) => {
            if (res && res.id) {
                // Ensure it's using the composite ID from the backend
                acc[res.id] = res;
            }
            return acc;
        }, {});
        
        set({ resources: resourcesMap }, false, 'setResources');
    },

    // Update a specific resource's metrics/status with simple rate-buffering (100ms)
    updateResource: (id, data) => {
        set((state) => {
            const queue = { ...state.updateQueue };
            
            // Upsert mechanism for unknown IDs arriving before hydration
            const existing = state.resources[id] || { id, status: 'unknown', metrics: {} };
            
            queue[id] = {
                ...existing,
                ...data,
                metrics: data.metrics 
                    ? { ...existing.metrics, ...data.metrics }
                    : existing.metrics
            };

            // If a flush is already scheduled, just update the queue
            if (state.flushTimeout) {
                return { updateQueue: queue };
            }

            // Otherwise, schedule a flush
            const timeout = setTimeout(() => {
                set((flushState) => ({
                    resources: { ...flushState.resources, ...flushState.updateQueue },
                    updateQueue: {},
                    flushTimeout: null
                }), false, 'flushUpdates');
            }, 100);

            return { updateQueue: queue, flushTimeout: timeout };
        }, false, 'queueUpdate');
    },
});

export const useMetricStore = create(
    import.meta.env.DEV 
        ? devtools(storeConfig, { name: 'VortexTelemetry' }) 
        : storeConfig
);
