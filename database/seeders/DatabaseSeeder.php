<?php

namespace Database\Seeders;

use App\Models\Alert;
use App\Models\Event;
use App\Models\Node;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Setting::create();

        Node::insert([
            ['id' => 'ND-alpha-01', 'name' => 'ND-alpha-01', 'type' => 'Hardware', 'region' => 'US-EAST', 'uptime' => '94D 12H 04M', 'health' => 100, 'load' => 42, 'status' => 'STABLE', 'ip' => '192.168.10.45', 'temp' => 68, 'clock' => 3.8, 'power' => 142],
            ['id' => 'ND-beta-04', 'name' => 'ND-beta-04', 'type' => 'Hardware', 'region' => 'US-WEST', 'uptime' => '12D 06H 12M', 'health' => 99, 'load' => 65, 'status' => 'STABLE', 'ip' => '192.168.10.46', 'temp' => 55, 'clock' => 3.2, 'power' => 110],
            ['id' => 'ND-gamma-12', 'name' => 'ND-gamma-12', 'type' => 'Service', 'region' => 'EU-WEST', 'uptime' => '4D 22H 15M', 'health' => 100, 'load' => 30, 'status' => 'SINKRONISASI', 'ip' => '192.168.20.12', 'temp' => 40, 'clock' => 2.8, 'power' => 85],
            ['id' => 'SRV-NEXUS-01', 'name' => 'SRV-NEXUS-01', 'type' => 'Hardware', 'region' => 'US-EAST', 'uptime' => '120D 04H 22M', 'health' => 100, 'load' => 42, 'status' => 'STABLE', 'ip' => '192.168.10.1', 'temp' => 58, 'clock' => 3.6, 'power' => 120],
            ['id' => 'DB-CORE-READ-02', 'name' => 'DB-CORE-READ-02', 'type' => 'Service', 'region' => 'EU-WEST', 'uptime' => '45D 18H 33M', 'health' => 84, 'load' => 91, 'status' => 'WARNING', 'ip' => '192.168.20.45', 'temp' => 72, 'clock' => 3.0, 'power' => 95],
            ['id' => 'NODE-EU-04', 'name' => 'NODE-EU-04', 'type' => 'Hardware', 'region' => 'EU-CENTRAL', 'uptime' => '15D 11H 08M', 'health' => 41, 'load' => 99, 'status' => 'CRITICAL', 'ip' => '192.168.30.4', 'temp' => 86, 'clock' => 4.2, 'power' => 195],
            ['id' => 'CACHE-MEM-08', 'name' => 'CACHE-MEM-08', 'type' => 'Service', 'region' => 'AP-SOUTH', 'uptime' => '0D 00H 00M', 'health' => 0, 'load' => 0, 'status' => 'OFFLINE', 'ip' => '192.168.40.8', 'temp' => 0, 'clock' => 0, 'power' => 0],
        ]);

        User::insert([
            ['id' => 1, 'name' => 'John Doe', 'email' => 'j.doe@monitor.sys', 'password' => bcrypt('password'), 'role' => 'SUPERUSER', 'status' => 'ACTIVE', 'last_uplink' => '00:02:14 AGO', 'initials' => 'JD'],
            ['id' => 2, 'name' => 'Sarah Miller', 'email' => 's.miller@monitor.sys', 'password' => bcrypt('password'), 'role' => 'OPERATOR', 'status' => 'ACTIVE', 'last_uplink' => '01:14:09 AGO', 'initials' => 'SM'],
            ['id' => 3, 'name' => 'Alan Turing', 'email' => 'guest_774@external.net', 'password' => bcrypt('password'), 'role' => 'GUEST', 'status' => 'OFFLINE', 'last_uplink' => '48:12:00 AGO', 'initials' => 'AT'],
            ['id' => 4, 'name' => 'Richard K.', 'email' => 'r.k@monitor.sys', 'password' => bcrypt('password'), 'role' => 'OPERATOR', 'status' => 'LOCKED', 'last_uplink' => '--:--:--', 'initials' => 'RK'],
        ]);

        Alert::insert([
            ['time' => '14:02:11', 'title' => 'DDoS Mitigation Activated', 'message' => 'Traffic spike detected on Node Alpha-7. Null routing initiated.', 'severity' => 'SEV-1'],
            ['time' => '13:45:00', 'title' => 'Unauthorized Protocol Access', 'message' => 'Attempted SSH connection via non-standard port 8080 blocked.', 'severity' => 'SEV-3'],
            ['time' => '12:10:55', 'title' => 'Malware Signature Matched', 'message' => 'Payload dropped in quarantine. Origin IP flagged for global ban.', 'severity' => 'SEV-2'],
        ]);

        Event::insert([
            ['timestamp' => '2026-05-24 14:02:11', 'level' => 'CRITICAL', 'message' => 'Thermal throttling engaged. Core temp exceeded 85C.', 'process' => 'sys_kernel'],
            ['timestamp' => '2026-05-24 13:45:00', 'level' => 'INFO', 'message' => 'Routine diagnostic completed. All systems nominal.', 'process' => 'diag_daemon'],
            ['timestamp' => '2026-05-24 11:20:05', 'level' => 'WARN', 'message' => 'Network interface eth1 packet loss spike detected (2%).', 'process' => 'net_monitor'],
            ['timestamp' => '2026-05-24 08:00:00', 'level' => 'INFO', 'message' => 'Daily log rotation successful.', 'process' => 'logrotate'],
            ['timestamp' => '2026-05-24 22:15:30', 'level' => 'INFO', 'message' => 'Configuration sync from master node [OK].', 'process' => 'cfg_sync'],
        ]);
    }
}
