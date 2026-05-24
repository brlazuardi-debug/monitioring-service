import React, { createContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  // Navigation State
  const [activeView, setActiveView] = useState('dashboard');
  const [activeNodeId, setActiveNodeId] = useState('ND-alpha-01');

  // React Global Sub-States
  const [settings, setSettings] = useState({
    instanceName: 'MONITOR_SYS_v2_PROD',
    environment: 'prod',
    cpuWarning: 85,
    memoryWarning: 92,
    autoScaling: true,
    verboseLogging: false,
    strictMode: true,
  });

  const [metrics, setMetrics] = useState({
    cpu: 42,
    memory: 8.4,
    memoryMax: 16.0,
    disk: 2.1,
    diskMax: 2.6,
    network: 94,
  });

  const [nodes, setNodes] = useState([]);
  const [users, setUsers] = useState([]);
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [systemEvents, setSystemEvents] = useState([]);

  // Load Initial Settings, Users, Alerts, Events and Nodes
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [initSettings, initNodes, initUsers, initAlerts, initEvents] = await Promise.all([
          apiService.getSettings(),
          apiService.getNodes(),
          apiService.getUsers(),
          apiService.getSecurityAlerts(),
          apiService.getSystemEvents()
        ]);
        
        setSettings(initSettings);
        setNodes(initNodes);
        setUsers(initUsers);
        setSecurityAlerts(initAlerts);
        setSystemEvents(initEvents);
      } catch (err) {
        console.error("Error loading initial dashboard data from API:", err);
      }
    }
    loadInitialData();
  }, []);

  // Periodic Telemetry Updates (fetches metrics and nodes status every 3s)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [nextMetrics, nextNodes] = await Promise.all([
          apiService.getMetrics(),
          apiService.getNodes()
        ]);
        setMetrics(nextMetrics);
        setNodes(nextNodes);
      } catch (err) {
        console.error("Error updating telemetry stats from API:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // API Integration Actions
  const toggleUserLock = async (id) => {
    try {
      const updatedUser = await apiService.toggleUserLock(id);
      // Synchronize in-state representation
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
    } catch (err) {
      alert(`API action failed: ${err.message}`);
    }
  };

  const inviteUser = async (name, email, role) => {
    try {
      const newUser = await apiService.inviteUser(name, email, role);
      setUsers(prev => [...prev, newUser]);
    } catch (err) {
      alert(`API action failed: ${err.message}`);
    }
  };

  const deployNode = async (name, type, region, ip) => {
    try {
      const newNode = await apiService.deployNode(name, type, region, ip);
      setNodes(prev => [...prev, newNode]);
      
      // Reload system event logs to reflect the deployment log
      const updatedEvents = await apiService.getSystemEvents();
      setSystemEvents(updatedEvents);
    } catch (err) {
      alert(`API action failed: ${err.message}`);
    }
  };

  const updateSettingField = async (key, value) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    try {
      await apiService.updateSettings(updatedSettings);
    } catch (err) {
      console.error(`API config save failed for ${key}:`, err);
    }
  };

  const rebootNode = async (nodeId) => {
    try {
      await apiService.rebootNode(nodeId);
      
      // Instantly set local node state to REBOOTING
      setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: 'REBOOTING', load: 0, temp: 25, power: 15 } : n));
      
      // Refresh event logs
      const updatedEvents = await apiService.getSystemEvents();
      setSystemEvents(updatedEvents);

      // In mock mode, the API client simulates completion after 5s. We periodically pull updates,
      // but let's schedule an explicit pull in 6s to immediately reflect online state.
      if (apiService.isMockMode()) {
        setTimeout(async () => {
          const freshNodes = await apiService.getNodes();
          const freshEvents = await apiService.getSystemEvents();
          setNodes(freshNodes);
          setSystemEvents(freshEvents);
        }, 5500);
      }
    } catch (err) {
      alert(`API action failed: ${err.message}`);
    }
  };

  const haltNode = async (nodeId) => {
    try {
      await apiService.haltNode(nodeId);
      setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: 'OFFLINE', load: 0, temp: 20, power: 0, health: 0 } : n));
      
      const updatedEvents = await apiService.getSystemEvents();
      setSystemEvents(updatedEvents);
    } catch (err) {
      alert(`API action failed: ${err.message}`);
    }
  };

  const startNode = async (nodeId) => {
    try {
      await apiService.startNode(nodeId);
      setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: 'STABLE', load: 15, temp: 35, power: 60, health: 100 } : n));
      
      const updatedEvents = await apiService.getSystemEvents();
      setSystemEvents(updatedEvents);
    } catch (err) {
      alert(`API action failed: ${err.message}`);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        activeView,
        setActiveView,
        activeNodeId,
        setActiveNodeId,
        settings,
        updateSettingField,
        metrics,
        nodes,
        users,
        toggleUserLock,
        inviteUser,
        deployNode,
        securityAlerts,
        systemEvents,
        rebootNode,
        haltNode,
        startNode,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
