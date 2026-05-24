<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = ['timestamp', 'level', 'message', 'process'];

    protected function casts(): array
    {
        return [
            'timestamp' => 'datetime',
        ];
    }
}
