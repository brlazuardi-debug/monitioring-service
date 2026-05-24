<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Node;

class MetricsController extends Controller
{
    public function index()
    {
        $nodes = Node::all();

        $cpu = $nodes->avg('load');
        $memoryUsed = $nodes->sum('memory') ?: $nodes->count() * 0.5;
        $memoryMax = $nodes->sum('memory_max') ?: $nodes->count() * 2;
        $diskUsed = $nodes->sum('disk') ?: $nodes->count() * 0.2;
        $diskMax = $nodes->sum('disk_max') ?: $nodes->count() * 1;
        $network = $nodes->avg('load') * 2.2;

        return response()->json([
            'cpu' => round($cpu, 1),
            'memory' => round($memoryUsed, 1),
            'memoryMax' => round($memoryMax, 1),
            'disk' => round($diskUsed, 1),
            'diskMax' => round($diskMax, 1),
            'network' => round($network, 1),
        ]);
    }
}
