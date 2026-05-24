<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function show()
    {
        $settings = Setting::first();

        if (!$settings) {
            $settings = Setting::create();
        }

        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $settings = Setting::first();

        if (!$settings) {
            $settings = Setting::create();
        }

        $settings->update($request->all());

        return response()->json($settings);
    }
}
