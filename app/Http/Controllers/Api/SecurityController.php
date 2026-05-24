<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\Event;

class SecurityController extends Controller
{
    public function alerts()
    {
        return response()->json(Alert::all());
    }

    public function events()
    {
        return response()->json(Event::orderBy('timestamp', 'desc')->get());
    }
}
