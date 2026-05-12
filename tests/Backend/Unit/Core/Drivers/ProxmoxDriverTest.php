<?php

use App\Core\Drivers\ProxmoxDriver;
use Illuminate\Support\Facades\Http;

test('proxmox driver validates successful handshake', function () {
    Http::fake([
        '*/api2/json/version' => Http::response(['data' => ['version' => '8.1.3']], 200),
    ]);

    $driver = new ProxmoxDriver();
    $result = $driver->validate([
        'url' => 'https://pve.local:8006',
        'token_id' => 'vortex!test',
        'token_secret' => 'secret-key'
    ]);

    expect($result['success'])->toBeTrue()
        ->and($result['message'])->toContain('Secure link established')
        ->and($result['details']['version'])->toBe('8.1.3');
});

test('proxmox driver handles authentication failure', function () {
    Http::fake([
        '*/api2/json/version' => Http::response([], 401),
    ]);

    $driver = new ProxmoxDriver();
    $result = $driver->validate([
        'url' => 'https://pve.local:8006',
        'token_id' => 'wrong',
        'token_secret' => 'wrong'
    ]);

    expect($result['success'])->toBeFalse()
        ->and($result['message'])->toContain('Authentication failed');
});

test('proxmox driver handles connection errors', function () {
    Http::fake([
        '*/api2/json/version' => function () {
            throw new \Exception('Connection Timed Out');
        },
    ]);

    $driver = new ProxmoxDriver();
    $result = $driver->validate([
        'url' => 'https://offline-host:8006',
        'token_id' => 'test',
        'token_secret' => 'test'
    ]);

    expect($result['success'])->toBeFalse()
        ->and($result['message'])->toContain('Network Error');
});
