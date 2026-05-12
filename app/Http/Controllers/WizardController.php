<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class WizardController extends Controller
{
    public function index()
    {
        return Inertia::render('Wizard/Index');
    }
}
