<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Node;
use Illuminate\Http\Request;

class NodeController extends Controller
{
    public function index()
    {
        return response()->json(Node::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'region' => 'required|string',
            'ip' => 'required|string',
        ]);

        $id = $data['name'];

        $node = Node::create([
            'id' => $id,
            'name' => $data['name'],
            'type' => $data['type'],
            'region' => strtoupper($data['region']),
            'uptime' => '0D 00H 00M',
            'health' => 100,
            'load' => 10,
            'status' => 'STABLE',
            'ip' => $data['ip'],
            'temp' => 32,
            'clock' => $data['type'] === 'Hardware' ? 3.2 : 2.5,
            'power' => $data['type'] === 'Hardware' ? 95 : 45,
        ]);

        Event::create([
            'level' => 'INFO',
            'message' => "New Node {$data['name']} registered successfully at IP {$data['ip']}.",
            'process' => 'sys_core',
        ]);

        return response()->json($node, 201);
    }

    public function reboot(Node $node)
    {
        $node->update(['status' => 'REBOOTING', 'load' => 0, 'temp' => 25, 'power' => 15]);

        Event::create([
            'level' => 'WARN',
            'message' => "Reboot command sent to node {$node->id}. Diagnostic cycles engaged.",
            'process' => 'sys_power',
        ]);

        return response()->json(['status' => 'REBOOTING']);
    }

    public function halt(Node $node)
    {
        $node->update(['status' => 'OFFLINE', 'load' => 0, 'temp' => 20, 'power' => 0, 'health' => 0]);

        Event::create([
            'level' => 'CRITICAL',
            'message' => "Node {$node->id} has been manually halted. Operational status: OFFLINE.",
            'process' => 'sys_power',
        ]);

        return response()->json(['status' => 'OFFLINE']);
    }

    public function start(Node $node)
    {
        $node->update(['status' => 'STABLE', 'load' => 15, 'temp' => 35, 'power' => 60, 'health' => 100]);

        Event::create([
            'level' => 'INFO',
            'message' => "Node {$node->id} received boot signal. Initializing subsystems.",
            'process' => 'sys_power',
        ]);

        return response()->json(['status' => 'STABLE']);
    }
}
