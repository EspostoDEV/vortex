<?php

namespace App\Core\Drivers;

use App\Core\Contracts\ProviderInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DockerDriver implements ProviderInterface
{
    public function getName(): string
    {
        return 'docker';
    }

    public function getResources(array $config): array
    {
        return [];
    }

    public function validate(array $config): array
    {
        $url = rtrim($config['url'], '/');
        // Docker usually doesn't need auth for local TCP unless protected by TLS/Proxy
        
        try {
            $response = Http::timeout(10)
                ->withoutVerifying()
                ->get("{$url}/version");

            if ($response->successful()) {
                return [
                    'success' => true,
                    'message' => 'Secure link established with Docker Engine.',
                    'details' => $response->json() ?? []
                ];
            }

            return [
                'success' => false,
                'message' => "Docker API responded with status: {$response->status()}",
                'details' => []
            ];

        } catch (\Exception $e) {
            Log::error("Docker Handshake Error", [
                'url' => $url,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => "Network Error: Could not reach Docker host. " . $e->getMessage(),
                'details' => []
            ];
        }
    }
}
