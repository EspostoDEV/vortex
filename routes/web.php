<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/wizard', [\App\Http\Controllers\WizardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('wizard');
