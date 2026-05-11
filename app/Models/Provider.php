<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    use HasFactory;

    protected $casts = [
        'credentials' => \App\Core\Vault\Casts\DoubleEnvelopeCast::class,
    ];

    protected $fillable = [
        'name',
        'type',
        'credentials',
    ];
}
