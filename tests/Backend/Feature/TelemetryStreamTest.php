<?php

use App\Events\ResourceMetricsUpdated;
use Illuminate\Support\Facades\Event;
use Illuminate\Broadcasting\PrivateChannel;

it('can be dispatched and is caught by Event::fake', function () {
    Event::fake();

    $resourceId = 'provider1-resourceA';
    $data = [
        'metrics' => ['cpu' => 50],
        'status'  => 'running',
    ];

    event(new ResourceMetricsUpdated($resourceId, $data));

    Event::assertDispatched(ResourceMetricsUpdated::class, function ($e) use ($resourceId) {
        return $e->resourceId === $resourceId;
    });
});

it('broadcasts on the private telemetry channel with correct payload', function () {
    $resourceId = 'provider1-resourceA';
    $data = [
        'metrics' => ['cpu' => 50],
        'status'  => 'running',
    ];

    $event = new ResourceMetricsUpdated($resourceId, $data);
    $channels = $event->broadcastOn();

    expect($channels[0])->toBeInstanceOf(PrivateChannel::class)
        ->and($channels[0]->name)->toBe('private-telemetry')
        ->and($event->broadcastWith())->toBe([
            'id'      => 'provider1-resourceA',
            'metrics' => ['cpu' => 50],
            'status'  => 'running',
        ]);
});
