# Laravel Backend Integration Guide

This guide describes how to connect the React.js front-end dashboard to a **Laravel** backend API.

---

## 1. Environment Configuration

In the React project root, configure the [.env](file:///d:/PROJECT/Dashboard%20Monitoring%20F/.env) file:

```env
# Disable client-side mock/simulation mode
VITE_USE_MOCK_API=false

# Point to your Laravel local dev server URL
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 2. CORS Setup (Laravel Backend)

To allow the React front-end (running on `http://localhost:5173` by default) to make requests to the Laravel backend (running on `http://localhost:8000`), ensure CORS is enabled.

In your Laravel project, update `config/cors.php` (Laravel 9/10) or configure the CORS middleware in `bootstrap/app.php` (Laravel 11):

```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173'], // React local server origin
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

---

## 3. Database Migrations

Create the following database tables in Laravel to persist the dashboard states:

### Nodes Migration
```php
Schema::create('nodes', function (Blueprint $table) {
    $table->string('id')->primary(); // e.g. "ND-alpha-01"
    $table->string('name');
    $table->string('type'); // "Hardware", "Service"
    $table->string('region');
    $table->string('uptime')->default('0D 00H 00M');
    $table->integer('health')->default(100);
    $table->integer('load')->default(10);
    $table->string('status')->default('STABLE'); // "STABLE", "WARNING", "CRITICAL", "OFFLINE", "REBOOTING"
    $table->string('ip');
    $table->integer('temp')->default(35);
    $table->double('clock', 3, 1)->default(3.0);
    $table->integer('power')->default(90);
    $table->timestamps();
});
```

### Users Migration
```php
Schema::create('operators', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('role'); // "SUPERUSER", "OPERATOR", "GUEST"
    $table->string('status')->default('ACTIVE'); // "ACTIVE", "LOCKED", "OFFLINE"
    $table->string('last_uplink')->default('--:--:--');
    $table->string('initials', 2);
    $table->timestamps();
});
```

### Settings Migration
```php
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
```

---

## 4. API Route Declarations (`routes/api.php`)

Add the following API endpoints in Laravel to align with the [api.js](file:///d:/PROJECT/Dashboard%20Monitoring%20F/src/services/api.js) client:

```php
use App\Http\Controllers\Api\MetricsController;
use App\Http\Controllers\Api\NodeController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\SecurityController;

// 1. General Metrics
Route::get('/metrics', [MetricsController::class, 'index']);

// 2. Nodes Inventory & Actions
Route::get('/nodes', [NodeController::class, 'index']);
Route::post('/nodes', [NodeController::class, 'store']);
Route::post('/nodes/{id}/reboot', [NodeController::class, 'reboot']);
Route::post('/nodes/{id}/halt', [NodeController::class, 'halt']);
Route::post('/nodes/{id}/start', [NodeController::class, 'start']);

// 3. User Administration
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::post('/users/{id}/toggle-lock', [UserController::class, 'toggleLock']);

// 4. Global Settings Config
Route::get('/settings', [SettingsController::class, 'index']);
Route::post('/settings', [SettingsController::class, 'update']);

// 5. Logs & Alerts
Route::get('/security/alerts', [SecurityController::class, 'alerts']);
Route::get('/security/events', [SecurityController::class, 'events']);
```

---

## 5. Example Controller Implementations

Here is how your Laravel controller responses should look to match the React state format.

### NodeController Example
```php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
        $validated = $request->validate([
            'name' => 'required|string|unique:nodes,name',
            'type' => 'required|string',
            'region' => 'required|string',
            'ip' => 'required|ip',
        ]);

        $node = Node::create([
            'id' => $validated['name'],
            'name' => $validated['name'],
            'type' => $validated['type'],
            'region' => strtoupper($validated['region']),
            'ip' => $validated['ip'],
            'uptime' => '0D 00H 00M',
            'health' => 100,
            'load' => 10,
            'status' => 'STABLE',
            'temp' => 32,
            'clock' => $validated['type'] === 'Hardware' ? 3.2 : 2.5,
            'power' => $validated['type'] === 'Hardware' ? 95 : 45,
        ]);

        return response()->json($node, 201);
    }

    public function reboot($id)
    {
        $node = Node::findOrFail($id);
        $node->update(['status' => 'REBOOTING']);
        
        // Log event logic ...
        
        return response()->json(['status' => 'REBOOTING']);
    }

    public function halt($id)
    {
        $node = Node::findOrFail($id);
        $node->update(['status' => 'OFFLINE', 'load' => 0, 'power' => 0, 'health' => 0]);
        
        // Log event logic ...
        
        return response()->json(['status' => 'OFFLINE']);
    }

    public function start($id)
    {
        $node = Node::findOrFail($id);
        $node->update(['status' => 'STABLE', 'load' => 15, 'power' => 60, 'health' => 100]);
        
        // Log event logic ...
        
        return response()->json(['status' => 'STABLE']);
    }
}
```

### MetricsController Example (Real Telemetry Integration)
```php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Node;

class MetricsController extends Controller
{
    public function index()
    {
        // Compute average load and sum traffic dynamically from actual nodes in database
        $nodes = Node::where('status', '!=', 'OFFLINE')->get();
        $avgCpu = $nodes->avg('load') ?? 10;
        
        // Return metrics model matching React layout format
        return response()->json([
            'cpu' => round($avgCpu),
            'memory' => 8.4,
            'memoryMax' => 16.0,
            'disk' => 2.1,
            'diskMax' => 2.6,
            'network' => $nodes->sum('power') / 4, // dummy dynamic relation example
        ]);
    }
}
```
