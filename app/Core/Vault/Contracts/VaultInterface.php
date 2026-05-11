<?php

namespace App\Core\Vault\Contracts;

use SensitiveParameter;

interface VaultInterface
{
    /**
     * Encrypt the given value.
     */
    public function encrypt(#[SensitiveParameter] string $value): string;

    /**
     * Decrypt the given value.
     */
    public function decrypt(#[SensitiveParameter] string $payload): string;
}
