<?php

namespace App\Providers;

use App\Core\Vault\Contracts\VaultInterface;
use App\Core\Vault\DoubleEnvelopeVault;
use Illuminate\Support\ServiceProvider;

class SecurityServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(VaultInterface::class, function ($app) {
            return new DoubleEnvelopeVault(
                config('app.key'),
                config('vortex.vault.master_key')
            );
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
