<?php

use App\Core\Vault\DoubleEnvelopeVault;

test('it can encrypt and decrypt a value using double envelope', function () {
    $appKey = 'base64:ADSY7zJXpGuBKy6+8LYrtCtacmQnaJp8hHFBZK40ofE=';
    $masterKey = base64_encode(random_bytes(32));
    
    $vault = new DoubleEnvelopeVault($appKey, $masterKey);
    
    $secret = 'vortex-ultra-secret-token';
    
    $encrypted = $vault->encrypt($secret);
    
    expect($encrypted)->not->toBe($secret);
    expect(base64_decode($encrypted))->toBeJson();
    
    $decrypted = $vault->decrypt($encrypted);
    
    expect($decrypted)->toBe($secret);
});

test('it throws exception for invalid payload', function () {
    $vault = new DoubleEnvelopeVault('key1', 'key2');
    
    expect(fn () => $vault->decrypt('invalid-base64'))->toThrow(Exception::class);
});

test('it throws exception if decryption fails with wrong keys', function () {
    $appKey = 'key1';
    $masterKey = 'key2';
    $vault = new DoubleEnvelopeVault($appKey, $masterKey);
    
    $encrypted = $vault->encrypt('secret');
    
    $wrongVault = new DoubleEnvelopeVault($appKey, 'wrong-master-key');
    
    expect(fn () => $wrongVault->decrypt($encrypted))->toThrow(Exception::class, 'Decryption failed');
});
