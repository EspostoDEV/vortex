<?php

namespace App\Core\Drivers;

use App\Core\Contracts\ProviderInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProxmoxDriver implements ProviderInterface
{
    public function getName(): string
    {
        return 'proxmox';
    }

    public function validate(array $config): array
    {
        $url = rtrim($config['url'], '/');
        $tokenId = $config['token_id'] ?? '';
        $tokenSecret = $config['token_secret'] ?? '';

        try {
            // Proxmox API Token Handshake
            $response = Http::withHeaders([
                'Authorization' => "PVEAPIToken={$tokenId}={$tokenSecret}",
                'Accept' => 'application/json',
            ])
            ->timeout(10)
            ->withoutVerifying() // Common in home labs with self-signed certs
            ->get("{$url}/api2/json/version");

            if ($response->successful()) {
                return [
                    'success' => true,
                    'message' => 'Secure link established with Proxmox VE.',
                    'details' => $response->json('data') ?? []
                ];
            }

            $errorMsg = $response->status() === 401 
                ? 'Authentication failed: Invalid Token ID or Secret.' 
                : "Connection failed with status: {$response->status()}";

            return [
                'success' => false,
                'message' => $errorMsg,
                'details' => []
            ];

        } catch (\Exception $e) {
            Log::error("Proxmox Handshake Error", [
                'url' => $url,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => "Network Error: Could not reach host. " . $e->getMessage(),
                'details' => []
            ];
        }
    }
}
