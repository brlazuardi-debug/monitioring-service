<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|string',
        ]);

        $initials = collect(explode(' ', $data['name']))
            ->map(fn($w) => strtoupper(substr($w, 0, 1)))
            ->take(2)
            ->join('');

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt('password'),
            'role' => strtoupper($data['role']),
            'status' => 'ACTIVE',
            'last_uplink' => '00:00:00 AGO',
            'initials' => $initials,
        ]);

        return response()->json($user, 201);
    }

    public function toggleLock(User $user)
    {
        $nextStatus = $user->status === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
        $nextUplink = $nextStatus === 'ACTIVE' ? '00:00:01 AGO' : '--:--:--';

        $user->update(['status' => $nextStatus, 'last_uplink' => $nextUplink]);

        return response()->json($user);
    }
}
