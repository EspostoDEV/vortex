<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Core\Drivers\ProxmoxDriver;
use App\Core\Drivers\DockerDriver;

class WizardController extends Controller
{
    public function index()
    {
        return Inertia::render('Wizard/Index');
    }

    public function validate(Request $request)
    {
        $data = $request->validate([
            'provider_type' => 'required|in:proxmox,docker',
            'url' => 'required|url',
            'token_id' => 'required|string',
            'token_secret' => 'required|string',
        ]);

        $driver = $data['provider_type'] === 'proxmox' 
            ? new ProxmoxDriver() 
            : new DockerDriver();

        $result = $driver->validate($data);

        return response()->json($result);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'provider_type' => 'required|in:proxmox,docker',
            'url' => 'required|url',
            'token_id' => 'required|string',
            'token_secret' => 'required|string',
        ]);

        $provider = Provider::create([
            'name' => $data['name'],
            'type' => $data['provider_type'],
            'url' => $data['url'],
            'token_id' => $data['token_id'],
            'token_secret' => $data['token_secret'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Connection established and persisted successfully.',
            'provider_id' => $provider->id
        ]);
    }
}
