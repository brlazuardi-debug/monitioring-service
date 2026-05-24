const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Helper for real API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.message || `API error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Fetch failure on endpoint ${endpoint}:`, error);
    throw error;
  }
}

// In-memory mock store for fallback when VITE_USE_MOCK_API is enabled
const mockStore = {
  settings: {
    instanceName: 'MONITOR_SYS_v2_PROD',
    environment: 'prod',
    cpuWarning: 85,
    memoryWarning: 92,
    autoScaling: true,
    verboseLogging: false,
    strictMode: true,
  },
  metrics: {
    cpu: 42,
    memory: 8.4,
    memoryMax: 16.0,
    disk: 2.1,
    diskMax: 2.6,
    network: 94,
  },
  nodes: [
    { id: 'ND-alpha-01', name: 'ND-alpha-01', type: 'Hardware', region: 'US-EAST', uptime: '94D 12H 04M', health: 100, load: 42, status: 'STABLE', ip: '192.168.10.45', temp: 68, clock: 3.8, power: 142 },
    { id: 'ND-beta-04', name: 'ND-beta-04', type: 'Hardware', region: 'US-WEST', uptime: '12D 06H 12M', health: 99, load: 65, status: 'STABLE', ip: '192.168.10.46', temp: 55, clock: 3.2, power: 110 },
    { id: 'ND-gamma-12', name: 'ND-gamma-12', type: 'Service', region: 'EU-WEST', uptime: '4D 22H 15M', health: 100, load: 30, status: 'SINKRONISASI', ip: '192.168.20.12', temp: 40, clock: 2.8, power: 85 },
    { id: 'SRV-NEXUS-01', name: 'SRV-NEXUS-01', type: 'Hardware', region: 'US-EAST', uptime: '120D 04H 22M', health: 100, load: 42, status: 'STABLE', ip: '192.168.10.1', temp: 58, clock: 3.6, power: 120 },
    { id: 'DB-CORE-READ-02', name: 'DB-CORE-READ-02', type: 'Service', region: 'EU-WEST', uptime: '45D 18H 33M', health: 84, load: 91, status: 'WARNING', ip: '192.168.20.45', temp: 72, clock: 3.0, power: 95 },
    { id: 'NODE-EU-04', name: 'NODE-EU-04', type: 'Hardware', region: 'EU-CENTRAL', uptime: '15D 11H 08M', health: 41, load: 99, status: 'CRITICAL', ip: '192.168.30.4', temp: 86, clock: 4.2, power: 195 },
    { id: 'CACHE-MEM-08', name: 'CACHE-MEM-08', type: 'Service', region: 'AP-SOUTH', uptime: '0D 00H 00M', health: 0, load: 0, status: 'OFFLINE', ip: '192.168.40.8', temp: 0, clock: 0, power: 0 },
  ],
  users: [
    { id: '1', name: 'John Doe', email: 'j.doe@monitor.sys', role: 'SUPERUSER', status: 'ACTIVE', lastUplink: '00:02:14 AGO', initials: 'JD' },
    { id: '2', name: 'Sarah Miller', email: 's.miller@monitor.sys', role: 'OPERATOR', status: 'ACTIVE', lastUplink: '01:14:09 AGO', initials: 'SM' },
    { id: '3', name: 'Alan Turing', email: 'guest_774@external.net', role: 'GUEST', status: 'OFFLINE', lastUplink: '48:12:00 AGO', initials: 'AT' },
    { id: '4', name: 'Richard K.', email: 'r.k@monitor.sys', role: 'OPERATOR', status: 'LOCKED', lastUplink: '--:--:--', initials: 'RK' },
  ],
  alerts: [
    { id: 1, time: '14:02:11', title: 'DDoS Mitigation Activated', message: 'Traffic spike detected on Node Alpha-7. Null routing initiated.', severity: 'SEV-1' },
    { id: 2, time: '13:45:00', title: 'Unauthorized Protocol Access', message: 'Attempted SSH connection via non-standard port 8080 blocked.', severity: 'SEV-3' },
    { id: 3, time: '12:10:55', title: 'Malware Signature Matched', message: 'Payload dropped in quarantine. Origin IP flagged for global ban.', severity: 'SEV-2' },
  ],
  events: [
    { id: 1, timestamp: '2026-05-24 14:02:11', level: 'CRITICAL', message: 'Thermal throttling engaged. Core temp exceeded 85C.', process: 'sys_kernel' },
    { id: 2, timestamp: '2026-05-24 13:45:00', level: 'INFO', message: 'Routine diagnostic completed. All systems nominal.', process: 'diag_daemon' },
    { id: 3, timestamp: '2026-05-24 11:20:05', level: 'WARN', message: 'Network interface eth1 packet loss spike detected (2%).', process: 'net_monitor' },
    { id: 4, timestamp: '2026-05-24 08:00:00', level: 'INFO', message: 'Daily log rotation successful.', process: 'logrotate' },
    { id: 5, timestamp: '2026-05-24 22:15:30', level: 'INFO', message: 'Configuration sync from master node [OK].', process: 'cfg_sync' },
  ]
};

export const apiService = {
  // Config state checks
  isMockMode: () => USE_MOCK,
  getBaseUrl: () => BASE_URL,

  // Get current system general metrics
  getMetrics: async () => {
    if (USE_MOCK) {
      // Simulate live random updates for CPU and Network in Mock mode
      const nextCpu = Math.max(10, Math.min(98, mockStore.metrics.cpu + Math.floor(Math.random() * 9) - 4));
      const nextNetwork = Math.max(10, Math.min(250, mockStore.metrics.network + Math.floor(Math.random() * 21) - 10));
      mockStore.metrics.cpu = nextCpu;
      mockStore.metrics.network = nextNetwork;
      return { ...mockStore.metrics };
    }
    return apiRequest('/metrics');
  },

  // Nodes management endpoints
  getNodes: async () => {
    if (USE_MOCK) {
      // Simulate live variation of active online nodes
      mockStore.nodes = mockStore.nodes.map(node => {
        if (node.status === 'OFFLINE' || node.status === 'REBOOTING') return node;
        const loadDelta = Math.floor(Math.random() * 7) - 3;
        const nextLoad = Math.max(5, Math.min(100, node.load + loadDelta));
        const tempDelta = Math.floor(Math.random() * 5) - 2;
        const nextTemp = Math.max(35, Math.min(92, node.temp + tempDelta));
        const powerDelta = Math.floor(Math.random() * 11) - 5;
        const nextPower = Math.max(40, Math.min(250, node.power + powerDelta));
        
        let nextStatus = node.status;
        if (nextLoad >= mockStore.settings.cpuWarning) {
          nextStatus = 'CRITICAL';
        } else if (nextLoad >= 80) {
          nextStatus = 'WARNING';
        } else {
          nextStatus = node.status === 'CRITICAL' || node.status === 'WARNING' ? 'STABLE' : node.status;
        }

        return { ...node, load: nextLoad, temp: nextTemp, power: nextPower, status: nextStatus };
      });
      return [...mockStore.nodes];
    }
    return apiRequest('/nodes');
  },

  deployNode: async (name, type, region, ip) => {
    if (USE_MOCK) {
      const newNode = {
        id: name,
        name,
        type,
        region: region.toUpperCase(),
        uptime: '0D 00H 00M',
        health: 100,
        load: 10,
        status: 'STABLE',
        ip,
        temp: 32,
        clock: type === 'Hardware' ? 3.2 : 2.5,
        power: type === 'Hardware' ? 95 : 45,
      };
      mockStore.nodes.push(newNode);

      // Add audit log
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      mockStore.events.unshift({
        id: mockStore.events.length + 1,
        timestamp,
        level: 'INFO',
        message: `New Node ${name} registered successfully at IP ${ip}.`,
        process: 'sys_core',
      });

      return newNode;
    }
    return apiRequest('/nodes', {
      method: 'POST',
      body: JSON.stringify({ name, type, region, ip })
    });
  },

  rebootNode: async (nodeId) => {
    if (USE_MOCK) {
      mockStore.nodes = mockStore.nodes.map(n => {
        if (n.id === nodeId) {
          return { ...n, status: 'REBOOTING', load: 0, temp: 25, power: 15 };
        }
        return n;
      });

      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      mockStore.events.unshift({
        id: mockStore.events.length + 1,
        timestamp,
        level: 'WARN',
        message: `Reboot command sent to node ${nodeId}. Diagnostic cycles engaged.`,
        process: 'sys_power',
      });

      // Simulates reboot finishing in 5s
      setTimeout(() => {
        mockStore.nodes = mockStore.nodes.map(n => {
          if (n.id === nodeId && n.status === 'REBOOTING') {
            return { ...n, status: 'STABLE', load: 25, temp: 48, power: 90 };
          }
          return n;
        });
        const readyTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
        mockStore.events.unshift({
          id: mockStore.events.length + 1,
          timestamp: readyTime,
          level: 'INFO',
          message: `Node ${nodeId} has successfully completed reboot sequence.`,
          process: 'sys_power',
        });
      }, 5000);

      return { status: 'REBOOTING' };
    }
    return apiRequest(`/nodes/${nodeId}/reboot`, { method: 'POST' });
  },

  haltNode: async (nodeId) => {
    if (USE_MOCK) {
      mockStore.nodes = mockStore.nodes.map(n => {
        if (n.id === nodeId) {
          return { ...n, status: 'OFFLINE', load: 0, temp: 20, power: 0, health: 0 };
        }
        return n;
      });

      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      mockStore.events.unshift({
        id: mockStore.events.length + 1,
        timestamp,
        level: 'CRITICAL',
        message: `Node ${nodeId} has been manually halted. Operational status: OFFLINE.`,
        process: 'sys_power',
      });
      return { status: 'OFFLINE' };
    }
    return apiRequest(`/nodes/${nodeId}/halt`, { method: 'POST' });
  },

  startNode: async (nodeId) => {
    if (USE_MOCK) {
      mockStore.nodes = mockStore.nodes.map(n => {
        if (n.id === nodeId) {
          return { ...n, status: 'STABLE', load: 15, temp: 35, power: 60, health: 100 };
        }
        return n;
      });

      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      mockStore.events.unshift({
        id: mockStore.events.length + 1,
        timestamp,
        level: 'INFO',
        message: `Node ${nodeId} received boot signal. Initializing subsystems.`,
        process: 'sys_power',
      });
      return { status: 'STABLE' };
    }
    return apiRequest(`/nodes/${nodeId}/start`, { method: 'POST' });
  },

  // Users management endpoints
  getUsers: async () => {
    if (USE_MOCK) return [...mockStore.users];
    return apiRequest('/users');
  },

  toggleUserLock: async (userId) => {
    if (USE_MOCK) {
      mockStore.users = mockStore.users.map(u => {
        if (u.id === userId) {
          const nextStatus = u.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
          const nextUplink = nextStatus === 'ACTIVE' ? '00:00:01 AGO' : '--:--:--';
          return { ...u, status: nextStatus, lastUplink: nextUplink };
        }
        return u;
      });
      return mockStore.users.find(u => u.id === userId);
    }
    return apiRequest(`/users/${userId}/toggle-lock`, { method: 'POST' });
  },

  inviteUser: async (name, email, role) => {
    if (USE_MOCK) {
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
      const newUser = {
        id: String(mockStore.users.length + 1),
        name,
        email,
        role: role.toUpperCase(),
        status: 'ACTIVE',
        lastUplink: '00:00:00 AGO',
        initials,
      };
      mockStore.users.push(newUser);
      return newUser;
    }
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, role })
    });
  },

  // Security and event logs endpoints
  getSecurityAlerts: async () => {
    if (USE_MOCK) return [...mockStore.alerts];
    return apiRequest('/security/alerts');
  },

  getSystemEvents: async () => {
    if (USE_MOCK) return [...mockStore.events];
    return apiRequest('/security/events');
  },

  // Settings configuration endpoints
  getSettings: async () => {
    if (USE_MOCK) return { ...mockStore.settings };
    return apiRequest('/settings');
  },

  updateSettings: async (settingsData) => {
    if (USE_MOCK) {
      mockStore.settings = { ...mockStore.settings, ...settingsData };
      return { ...mockStore.settings };
    }
    return apiRequest('/settings', {
      method: 'POST',
      body: JSON.stringify(settingsData)
    });
  }
};
