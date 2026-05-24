<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('instance_name')->default('MONITOR_SYS_v2_PROD');
            $table->string('environment')->default('prod');
            $table->integer('cpu_warning')->default(85);
            $table->integer('memory_warning')->default(92);
            $table->boolean('auto_scaling')->default(true);
            $table->boolean('verbose_logging')->default(false);
            $table->boolean('strict_mode')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
