import { useEffect, useState } from 'react';
import { useMetricStore } from '@/Stores/useMetricStore';

export function useTelemetryStream() {
    const updateResource = useMetricStore(state => state.updateResource);
    const setResources   = useMetricStore(state => state.setResources);
    // null = connecting (no banner shown); true = online; false = dropped (show banner)
    const [isConnected, setIsConnected] = useState(null);

    useEffect(() => {
        let retryCount = 0;
        const maxRetries = 10;
        let retryTimer = null;
        let channelCleanup = null;

        // Named handler references so unbind is targeted and won't clobber global listeners
        const onConnected = () => {
            setIsConnected(true);
            // AC4: Re-hydrate store on reconnection to recover events missed during the gap
            fetch(route('resources.index'))
                .then(r => r.ok ? r.json() : null)
                .then(data => { if (Array.isArray(data)) setResources(data); })
                .catch(() => { /* best-effort, silent */ });
        };
        const onDisconnected = () => setIsConnected(false);
        const onUnavailable  = () => setIsConnected(false);

        function setup() {
            if (!window.Echo) {
                retryCount++;
                if (retryCount >= maxRetries) {
                    console.error(
                        '[useTelemetryStream] window.Echo unavailable after',
                        maxRetries,
                        'retries. Ensure bootstrap.js is loaded before Dashboard renders.'
                    );
                    setIsConnected(false);
                    return;
                }
                retryTimer = setTimeout(setup, 300);
                return;
            }

            const echo       = window.Echo;
            const connection = echo.connector.pusher.connection;

            // Bind with named references — each can be unbound individually
            connection.bind('connected',    onConnected);
            connection.bind('disconnected', onDisconnected);
            connection.bind('unavailable',  onUnavailable);

            // Sync initial banner state without waiting for the next event
            const currentState = connection.state;
            if (currentState === 'connected')                                     setIsConnected(true);
            else if (currentState === 'disconnected' || currentState === 'unavailable') setIsConnected(false);
            // else: 'connecting' — leave as null so no false banner shows on boot

            const channel = echo.private('telemetry');
            channel.listen('ResourceMetricsUpdated', (e) => {
                if (e.id) {
                    const { id, ...data } = e;
                    updateResource(id, data);
                }
            });

            channelCleanup = () => {
                channel.stopListening('ResourceMetricsUpdated');
                echo.leaveChannel('private-telemetry');
                // Targeted unbind — does NOT remove listeners from other components
                connection.unbind('connected',    onConnected);
                connection.unbind('disconnected', onDisconnected);
                connection.unbind('unavailable',  onUnavailable);
            };
        }

        setup();

        return () => {
            clearTimeout(retryTimer);
            if (channelCleanup) channelCleanup();
        };
    }, [updateResource, setResources]);

    return { isConnected };
}
