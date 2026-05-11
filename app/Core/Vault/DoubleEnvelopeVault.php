<?php

namespace App\Core\Vault;

use App\Core\Vault\Contracts\VaultInterface;
use Exception;
use SensitiveParameter;

class DoubleEnvelopeVault implements VaultInterface
{
    private string $key;
    private const ALGORITHM = 'aes-256-gcm';

    public function __construct(
        #[SensitiveParameter] string $appKey,
        #[SensitiveParameter] string $masterKey
    ) {
        // Derive a 32-byte key from both keys
        $this->key = hash_hmac('sha256', $appKey, $masterKey, true);
    }

    /**
     * @inheritDoc
     */
    public function encrypt(#[SensitiveParameter] string $value): string
    {
        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length(self::ALGORITHM));
        
        $ciphertext = openssl_encrypt(
            $value,
            self::ALGORITHM,
            $this->key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag
        );

        if ($ciphertext === false) {
            throw new Exception('Encryption failed.');
        }

        // Return base64 encoded JSON with IV, Ciphertext, and Auth Tag
        return base64_encode(json_encode([
            'iv' => base64_encode($iv),
            'tag' => base64_encode($tag),
            'data' => base64_encode($ciphertext),
        ]));
    }

    /**
     * @inheritDoc
     */
    public function decrypt(#[SensitiveParameter] string $payload): string
    {
        $json = json_decode(base64_decode($payload), true);

        if (!$json || !isset($json['iv'], $json['tag'], $json['data'])) {
            throw new Exception('Invalid encryption payload.');
        }

        $iv = base64_decode($json['iv']);
        $tag = base64_decode($json['tag']);
        $ciphertext = base64_decode($json['data']);

        $plaintext = openssl_decrypt(
            $ciphertext,
            self::ALGORITHM,
            $this->key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag
        );

        if ($plaintext === false) {
            throw new Exception('Decryption failed. Data might be tampered or keys are invalid.');
        }

        return $plaintext;
    }
}
