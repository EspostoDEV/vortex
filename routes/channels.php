<?php

use Illuminate\Support\Facades\Broadcast;

// Default user channel for notifications/2FA callbacks — do NOT remove
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Telemetry metrics channel — any authenticated user may listen
// TODO (Story 2.x): restrict to resources owned by the user's providers for multi-tenant isolation
Broadcast::channel('telemetry', function ($user) {
    return $user !== null;
});
