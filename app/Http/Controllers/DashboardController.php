<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use App\Core\Drivers\MockDriver;
use App\Core\Drivers\ProxmoxDriver;
use App\Core\Drivers\DockerDriver;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $providers = Provider::all();
        $resources = [];

        foreach ($providers as $provider) {
            $driver = $this->resolveDriver($provider->type);
            
            // In a real scenario, we'd pass the decrypted config to the driver
            $config = [
                'url' => $provider->url,
                'token_id' => $provider->token_id,
                'token_secret' => $provider->token_secret,
            ];

            try {
                // TODO: In Epic 2.3, this will be moved to an async background job with Reverb
                $providerResources = $driver->getResources($config);
                foreach ($providerResources as $res) {
                    $res['provider_id'] = $provider->id;
                    $res['provider_name'] = $provider->name;
                    $res['id'] = "{$provider->id}-{$res['id']}";
                    $resources[] = $res;
                }
            } catch (\Exception $e) {
                \Log::error("Failed to fetch resources for provider {$provider->name}: " . $e->getMessage());
                // For now, we just skip the provider. In the future, mark as 'offline'.
            }
        }

        return Inertia::render('Dashboard', [
            'providers' => $providers,
            'resources' => $resources,
        ]);
    }

    protected function resolveDriver(string $type)
    {
        if (config('vortex.simulation_mode')) {
            return new MockDriver();
        }

        return match ($type) {
            'proxmox' => new ProxmoxDriver(),
            'docker' => new DockerDriver(),
            default => throw new \Exception("Unknown provider type: {$type}"),
        };
    }
}
