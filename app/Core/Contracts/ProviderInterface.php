<?php

namespace App\Core\Contracts;

interface ProviderInterface
{
    /**
     * Perform a handshake with the remote provider to validate connectivity and credentials.
     *
     * @param array $config
     * @return array ['success' => bool, 'message' => string, 'details' => array]
     */
    public function validate(array $config): array;

    /**
     * Get a unique identifier for the driver.
     *
     * @return string
     */
    public function getName(): string;
}
