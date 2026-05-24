<?php

use App\Http\Controllers\Api\MetricsController;
use App\Http\Controllers\Api\NodeController;
use App\Http\Controllers\Api\SecurityController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/metrics', [MetricsController::class, 'index']);

Route::get('/nodes', [NodeController::class, 'index']);
Route::post('/nodes', [NodeController::class, 'store']);
Route::post('/nodes/{node}/reboot', [NodeController::class, 'reboot']);
Route::post('/nodes/{node}/halt', [NodeController::class, 'halt']);
Route::post('/nodes/{node}/start', [NodeController::class, 'start']);

Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::post('/users/{user}/toggle-lock', [UserController::class, 'toggleLock']);

Route::get('/security/alerts', [SecurityController::class, 'alerts']);
Route::get('/security/events', [SecurityController::class, 'events']);

Route::get('/settings', [SettingsController::class, 'show']);
Route::post('/settings', [SettingsController::class, 'update']);
