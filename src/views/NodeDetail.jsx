import React, { useContext } from 'react';
import { DashboardContext } from '../context/DashboardContext';

export default function NodeDetail() {
  const { 
    nodes, 
    activeNodeId, 
    setActiveNodeId, 
    systemEvents, 
    rebootNode, 
    haltNode, 
    startNode 
  } = useContext(DashboardContext);

  // Retrieve selected node details
  const node = nodes.find(n => n.id === activeNodeId) || nodes[0];

  // System logs specific to the active node name
  const filteredEvents = systemEvents.filter(
    e => e.message.toLowerCase().includes(node.name.toLowerCase()) || e.process === 'sys_kernel'
  );

  return (
    <div className="flex-1 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            {/* Status Chip */}
            <span className={`px-2 py-1 text-black font-label-caps text-label-caps rounded-[2px] tracking-widest ${
              node.status === 'STABLE' || node.status === 'SINKRONISASI' 
                ? 'bg-volt-accent' 
                : node.status === 'CRITICAL' || node.status === 'WARNING'
                ? 'bg-signal-red text-white'
                : node.status === 'REBOOTING'
                ? 'bg-electric-blue text-white animate-pulse'
                : 'bg-white/30 text-white'
            }`}>
              {node.status}
            </span>
            <span className="font-data-mono text-data-mono text-on-surface-variant uppercase">
              UPTIME: {node.status === 'OFFLINE' ? '--' : node.uptime}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <h1 className="font-display-lg text-display-lg text-on-surface uppercase tracking-tight">
              {node.name}
            </h1>
            {/* Node Selector Selector */}
            <select
              value={activeNodeId}
              onChange={(e) => setActiveNodeId(e.target.value)}
              className="bg-graphite-gray border border-white/10 text-on-surface text-[12px] font-data-mono px-2 py-1 rounded focus:outline-none cursor-pointer"
            >
              {nodes.map(n => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-4">
          {node.status === 'OFFLINE' ? (
            <button
              onClick={() => startNode(node.id)}
              className="px-4 py-2 border border-volt-accent/50 text-volt-accent font-label-caps text-label-caps rounded DEFAULT hover:bg-volt-accent/15 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm focus:outline-none"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              BOOT_UP
            </button>
          ) : (
            <>
              <button
                onClick={() => rebootNode(node.id)}
                disabled={node.status === 'REBOOTING'}
                className="px-4 py-2 border border-white/30 text-on-surface font-label-caps text-label-caps rounded DEFAULT hover:bg-white/5 disabled:opacity-50 transition-colors duration-200 flex items-center gap-2 backdrop-blur-sm focus:outline-none"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                REBOOT
              </button>
              <button
                onClick={() => haltNode(node.id)}
                className="px-4 py-2 border border-white/30 text-signal-red font-label-caps text-label-caps rounded DEFAULT hover:bg-signal-red/10 transition-colors duration-200 flex items-center gap-2 backdrop-blur-sm focus:outline-none"
              >
                <span className="material-symbols-outlined text-[16px]">power_settings_new</span>
                HALT
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Core Temperature */}
        <div className="col-span-12 md:col-span-4 bg-graphite-gray border border-white/10 rounded-lg p-6 shadow-[4px_4px_0px_0px_#000000] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-volt-accent/5 rounded-bl-full group-hover:bg-volt-accent/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant tracking-wider">Core Temperature</h3>
            <span className="material-symbols-outlined text-volt-accent">thermostat</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="font-display-lg text-display-lg text-on-surface leading-none">
              {node.status === 'OFFLINE' ? '--' : node.temp}
            </span>
            <span className="font-data-mono text-data-mono text-on-surface-variant mb-2">°C</span>
          </div>
          <div className="mt-4 w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${node.temp > 80 ? 'bg-signal-red' : 'bg-volt-accent'}`} 
              style={{ width: `${node.status === 'OFFLINE' ? 0 : node.temp}%` }}
            ></div>
          </div>
        </div>

        {/* Clock Speed */}
        <div className="col-span-12 md:col-span-4 bg-graphite-gray border border-white/10 rounded-lg p-6 shadow-[4px_4px_0px_0px_#000000] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-volt-accent/5 rounded-bl-full group-hover:bg-volt-accent/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant tracking-wider">Clock Speed</h3>
            <span className="material-symbols-outlined text-volt-accent">speed</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="font-display-lg text-display-lg text-on-surface leading-none">
              {node.status === 'OFFLINE' ? '--' : node.clock.toFixed(1)}
            </span>
            <span className="font-data-mono text-data-mono text-on-surface-variant mb-2">GHz</span>
          </div>
          <div className="mt-4 font-data-mono text-data-mono text-volt-accent flex items-center gap-1">
            {node.status === 'OFFLINE' ? (
              <span className="text-on-surface-variant opacity-50">Offline</span>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_upward</span>
                <span>+0.2 GHz vs Target</span>
              </>
            )}
          </div>
        </div>

        {/* Power Draw */}
        <div className="col-span-12 md:col-span-4 bg-graphite-gray border border-white/10 rounded-lg p-6 shadow-[4px_4px_0px_0px_#000000] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-signal-red/5 rounded-bl-full group-hover:bg-signal-red/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant tracking-wider">Power Draw</h3>
            <span className="material-symbols-outlined text-signal-red">bolt</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="font-display-lg text-display-lg text-on-surface leading-none">
              {node.status === 'OFFLINE' ? '--' : node.power}
            </span>
            <span className="font-data-mono text-data-mono text-on-surface-variant mb-2">W</span>
          </div>
          <div className="mt-4 w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${node.power > 150 ? 'bg-signal-red' : 'bg-volt-accent'}`} 
              style={{ width: `${node.status === 'OFFLINE' ? 0 : Math.min(100, (node.power / 250) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Performance Telemetry (Chart) */}
        <div className="col-span-12 md:col-span-8 bg-graphite-gray border border-white/10 rounded-lg p-6 min-h-[300px] flex flex-col relative shadow-[4px_4px_0px_0px_#000000]">
          <div className="flex justify-between items-center mb-6 z-10">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant tracking-wider">Performance Telemetry (1H)</h3>
            <div className="flex gap-2 items-center">
              <span className={`w-2 h-2 rounded-full ${node.status === 'OFFLINE' ? 'bg-white/20' : 'bg-volt-accent pulse-dot'}`}></span>
              <span className="font-data-mono text-data-mono text-volt-accent text-[12px] tracking-wider uppercase">
                {node.status === 'OFFLINE' ? 'SYNC DISCONNECTED' : 'LIVE SYNC'}
              </span>
            </div>
          </div>

          {/* Chart Drawing */}
          <div className="flex-1 relative w-full border-b border-l border-white/10">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="w-full h-px bg-white/5"></div>
              <div className="w-full h-px bg-white/5"></div>
              <div className="w-full h-px bg-white/5"></div>
              <div className="w-full h-px bg-white/5"></div>
            </div>

            {/* Line overlay */}
            <div className="absolute inset-0 overflow-hidden">
              {node.status !== 'OFFLINE' && (
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path 
                    d="M0,80 L10,75 L20,85 L30,60 L40,65 L50,40 L60,50 L70,30 L80,45 L90,20 L100,25" 
                    fill="none" 
                    stroke="#D1FF00" 
                    strokeWidth="2" 
                    vectorEffect="non-scaling-stroke"
                  ></path>
                  <path 
                    d="M0,80 L10,75 L20,85 L30,60 L40,65 L50,40 L60,50 L70,30 L80,45 L90,20 L100,25 L100,100 L0,100 Z" 
                    fill="url(#voltGradient)" 
                    opacity="0.15"
                  ></path>
                  <defs>
                    <linearGradient id="voltGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#D1FF00" stopOpacity="1"></stop>
                      <stop offset="100%" stopColor="#131313" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              )}
            </div>
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between mt-2 font-data-mono text-data-mono text-on-surface-variant/50 text-[10px]">
            <span>T-60m</span>
            <span>T-45m</span>
            <span>T-30m</span>
            <span>T-15m</span>
            <span>NOW</span>
          </div>
        </div>

        {/* Hardware Specifications */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-high border border-white/10 rounded-lg p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_#000000]">
          <div>
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-6 border-b border-white/10 pb-2 uppercase tracking-widest">Hardware Specs</h3>
            <div className="space-y-4 text-[13px]">
              <div className="flex justify-between items-center">
                <span className="font-body-base text-on-surface-variant">Architecture</span>
                <span className="font-data-mono text-on-surface">x86_64 / ZEN3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-base text-on-surface-variant">Memory</span>
                <span className="font-data-mono text-on-surface">{node.type === 'Hardware' ? '128GB ECC DDR4' : '32GB Virtualized'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-base text-on-surface-variant">Storage</span>
                <span className="font-data-mono text-on-surface">{node.type === 'Hardware' ? '4TB NVMe SSD' : '500GB SSD Mount'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-base text-on-surface-variant">Network</span>
                <span className="font-data-mono text-on-surface">{node.type === 'Hardware' ? 'Dual 10GbE SFP+' : '1Gbps Gateway Interface'}</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="font-body-base text-on-surface-variant">IP Address</span>
              <span className="font-data-mono text-volt-accent">{node.ip}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Event Log Table */}
      <div className="bg-graphite-gray border border-white/10 rounded-lg overflow-hidden shadow-[4px_4px_0px_0px_#000000]">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-surface-container-low/50 backdrop-blur-md">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">System Event Log</h3>
          <button className="font-data-mono text-data-mono text-volt-accent hover:underline flex items-center gap-1 text-[12px]">
            <span className="material-symbols-outlined text-[14px]">download</span>
            EXPORT CSV
          </button>
        </div>
        <div className="overflow-x-auto max-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-graphite-gray/90 backdrop-blur-sm z-10 border-b border-white/10">
              <tr className="font-label-caps text-label-caps text-on-surface-variant text-[11px] tracking-wider">
                <th className="py-3 px-6 w-48">Timestamp</th>
                <th className="py-3 px-6 w-32">Level</th>
                <th className="py-3 px-6">Message</th>
                <th className="py-3 px-6 w-32">Process</th>
              </tr>
            </thead>
            <tbody className="font-data-mono text-data-mono text-on-surface text-[12px] divide-y divide-white/5">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 px-6 text-center text-on-surface-variant opacity-50 uppercase">
                    No matching syslog streams found.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event, index) => (
                  <tr key={event.id || index} className="hover:bg-surface-container-high transition-colors">
                    <td className="py-3 px-6 text-on-surface-variant whitespace-nowrap">{event.timestamp}</td>
                    <td className={`py-3 px-6 font-bold ${
                      event.level === 'CRITICAL' ? 'text-signal-red' : event.level === 'WARN' ? 'text-[#FF9F0A]' : 'text-volt-accent'
                    }`}>{event.level}</td>
                    <td className="py-3 px-6 text-on-surface">{event.message}</td>
                    <td className="py-3 px-6 text-on-surface-variant whitespace-nowrap">{event.process}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
