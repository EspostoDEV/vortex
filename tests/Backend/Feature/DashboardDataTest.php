<?php

namespace Tests\Backend\Feature;

use App\Models\Provider;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class DashboardDataTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_receives_providers_and_resources(): void
    {
        $user = User::factory()->create();
        
        Provider::create([
            'name' => 'Test Provider',
            'type' => 'proxmox',
            'url' => 'http://localhost',
            'token_id' => 'id',
            'token_secret' => 'secret',
        ]);

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->has('providers')
                ->has('resources')
            );
    }
}
