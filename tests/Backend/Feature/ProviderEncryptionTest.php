<?php

use App\Models\Provider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

test('it automatically encrypts credentials when saving to database', function () {
    $secret = 'proxmox-token-secret-very-long-and-secure';
    
    $provider = Provider::create([
        'name' => 'Home Lab Proxmox',
        'type' => 'proxmox',
        'url' => 'https://proxmox.local:8006',
        'token_id' => 'root@pam!vortex',
        'token_secret' => $secret,
    ]);
    
    // Check database directly to see encrypted content
    $dbRow = DB::table('providers')->where('id', $provider->id)->first();
    
    expect($dbRow?->token_secret)->not->toBeNull();
    expect($dbRow->token_secret)->not->toBe($secret);
    
    // Verify it's a valid vault payload (base64 encoded JSON with specific keys)
    $decoded = base64_decode($dbRow->token_secret);
    expect($decoded)->not->toBeFalse();
    
    $payload = json_decode($decoded, true);
    expect($payload)->toBeArray();
    expect($payload)->toHaveKeys(['iv', 'tag', 'data']);
    
    // Check model retrieval decodes correctly (Full DB round-trip)
    $retrieved = Provider::find($provider->id);
    
    expect($retrieved->token_secret)->toBe($secret);
});

test('it uses master key from environment via config and fails on mismatch', function () {
    // KEYS MUST BE EXACTLY 32 BYTES (256 bits)
    $initialKey = base64_encode("12345678901234567890123456789012");
    $wrongKey   = base64_encode("09876543210987654321098765432109");
    
    config(['vortex.vault.master_key' => $initialKey]);
    
    $secret = 'socket-path-secret';
    
    $provider = Provider::create([
        'name' => 'Docker Socket',
        'type' => 'docker',
        'url' => 'unix:///var/run/docker.sock',
        'token_secret' => $secret,
    ]);
    
    // 1. Verify successful round-trip with correct key
    $retrieved = Provider::find($provider->id);
    expect($retrieved->token_secret)->toBe($secret);
    
    // 2. Verify decryption FAILS with wrong key (Negative Test)
    config(['vortex.vault.master_key' => $wrongKey]);
    
    // FORGET the singleton instance so it re-resolves with the NEW config key
    // This targets the VaultInterface bound in SecurityServiceProvider.
    app()->forgetInstance(\App\Core\Vault\Contracts\VaultInterface::class);
    
    // We expect an exact exception message from DoubleEnvelopeVault::decrypt
    expect(fn() => Provider::find($provider->id)->token_secret)
        ->toThrow(Exception::class, 'Decryption failed. Data might be tampered or keys are invalid.');
});
