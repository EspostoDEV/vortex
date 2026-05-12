<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'url',
        'token_id',
        'token_secret',
    ];

    protected $casts = [
        'token_secret' => \App\Core\Vault\Casts\DoubleEnvelopeCast::class,
    ];
}
