<?php

use App\Models\Provider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

test('it automatically encrypts credentials when saving to database', function () {
    $credentials = ['token' => 'proxmox-token-secret', 'secret' => 'very-secret'];
    
    $provider = Provider::create([
        'name' => 'Home Lab Proxmox',
        'type' => 'proxmox',
        'credentials' => json_encode($credentials),
    ]);
    
    // Check database directly to see encrypted content
    $dbRow = DB::table('providers')->where('id', $provider->id)->first();
    
    expect($dbRow->credentials)->not->toContain('proxmox-token-secret');
    expect(base64_decode($dbRow->credentials))->toBeJson();
    
    // Check model retrieval decodes correctly
    $retrieved = Provider::find($provider->id);
    
    expect($retrieved->credentials)->toBe(json_encode($credentials));
});

test('it uses master key from environment via config', function () {
    config(['vortex.vault.master_key' => base64_encode('test-master-key-32-chars-long-!!!')]);
    
    $provider = Provider::create([
        'name' => 'Docker Socket',
        'type' => 'docker',
        'credentials' => 'socket-path-secret',
    ]);
    
    expect($provider->credentials)->toBe('socket-path-secret');
});
