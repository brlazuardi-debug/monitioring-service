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
        Schema::create('nodes', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('type');
            $table->string('region');
            $table->string('uptime')->default('0D 00H 00M');
            $table->integer('health')->default(100);
            $table->integer('load')->default(0);
            $table->string('status')->default('STABLE');
            $table->string('ip');
            $table->integer('temp')->default(32);
            $table->float('clock')->default(2.5);
            $table->integer('power')->default(95);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nodes');
    }
};
