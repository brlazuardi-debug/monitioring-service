<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'instance_name', 'environment', 'cpu_warning', 'memory_warning',
        'auto_scaling', 'verbose_logging', 'strict_mode',
    ];

    protected function casts(): array
    {
        return [
            'auto_scaling' => 'boolean',
            'verbose_logging' => 'boolean',
            'strict_mode' => 'boolean',
        ];
    }
}
