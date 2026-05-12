<?php

namespace App\Core\Drivers;

use App\Core\Contracts\ProviderInterface;

class MockDriver implements ProviderInterface
{
    public function getName(): string
    {
        return 'mock';
    }

    public function getResources(array $config): array
    {
        return [
            [
                'id' => '100',
                'name' => 'mock-vm-01',
                'type' => 'vm',
                'status' => 'running',
                'metrics' => ['cpu' => 12, 'ram' => 45]
            ],
            [
                'id' => '101',
                'name' => 'mock-vm-02',
                'type' => 'vm',
                'status' => 'stopped',
                'metrics' => ['cpu' => 0, 'ram' => 0]
            ],
            [
                'id' => 'container-01',
                'name' => 'mock-container',
                'type' => 'container',
                'status' => 'running',
                'metrics' => ['cpu' => 5, 'ram' => 20]
            ],
        ];
    }

    public function validate(array $config): array
    {
        // Simulate a small delay for realism
        usleep(800000);

        return [
            'success' => true,
            'message' => '[SIMULATION] Secure link established via Mock Driver.',
            'details' => [
                'version' => 'VORTEX-MOCK-1.0',
                'node' => 'vortex-core-01',
                'simulated' => true,
                'timestamp' => now()->toIso8601String(),
            ]
        ];
    }
}
