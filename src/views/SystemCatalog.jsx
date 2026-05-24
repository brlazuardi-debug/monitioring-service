import React, { useContext, useState } from 'react';
import { DashboardContext } from '../context/DashboardContext';

export default function SystemCatalog() {
  const { nodes, setActiveView, setActiveNodeId } = useContext(DashboardContext);

  // Table filtering and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Compute metrics summaries from dynamic nodes list
  const totalNodesCount = nodes.length;
  
  const onlineNodes = nodes.filter(n => n.status !== 'OFFLINE');
  const totalHealthSum = onlineNodes.reduce((acc, curr) => acc + curr.health, 0);
  const avgHealth = onlineNodes.length > 0 ? (totalHealthSum / onlineNodes.length) : 0;

  const criticalNodes = nodes.filter(n => n.status === 'CRITICAL');
  const warningNodes = nodes.filter(n => n.status === 'WARNING');

  // Filter nodes according to search and status selection
  const filteredNodes = nodes.filter(node => {
    const matchesSearch = 
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.ip.includes(searchQuery);

    const matchesStatus = 
      statusFilter === 'All' || 
      node.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const statuses = ['All', 'STABLE', 'WARNING', 'CRITICAL', 'OFFLINE', 'SINKRONISASI'];

  return (
    <div className="flex-1 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-8">
      {/* Page Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2 tracking-tight uppercase">System Catalog</h1>
          <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl">
            Global inventory of active hardware nodes and virtualized software services. Monitor status and health metrics in real-time.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto z-20">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container text-on-surface font-data-mono text-data-mono pl-10 pr-4 py-2 rounded-DEFAULT border border-white/10 focus:border-volt-accent focus:ring-0 focus:outline-none transition-colors placeholder:text-on-surface-variant"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center justify-between gap-3 bg-surface-container border border-white/10 px-4 py-2 rounded-DEFAULT text-on-surface hover:border-white/30 transition-colors font-label-caps text-label-caps uppercase min-w-[150px] focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">filter_list</span>
                <span>{statusFilter === 'All' ? 'All Status' : statusFilter}</span>
              </div>
              <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
            </button>

            {isFilterDropdownOpen && (
              <div className="absolute right-0 mt-1 w-full bg-graphite-gray border border-white/10 rounded shadow-lg z-30 font-label-caps text-label-caps">
                {statuses.map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatusFilter(st);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-surface-container-high transition-colors ${
                      statusFilter === st ? 'text-volt-accent bg-surface-container' : 'text-on-surface-variant'
                    }`}
                  >
                    {st === 'All' ? 'ALL STATUS' : st}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metric Summary Bento Grid */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Total Nodes */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-graphite-gray border border-white/10 rounded-DEFAULT p-6 shadow-[4px_4px_0px_0px_#000000] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-white/5 group-hover:text-white/10 transition-colors duration-500">
            <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>dns</span>
          </div>
          <div className="relative z-10">
            <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-4">Total Nodes</div>
            <div className="font-display-lg text-display-lg text-on-surface font-bold leading-none">{totalNodesCount}</div>
            <div className="mt-3 flex items-center gap-2 font-data-mono text-data-mono text-volt-accent text-[12px]">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              <span>Online: {onlineNodes.length}</span>
            </div>
          </div>
        </div>

        {/* Network Health */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-graphite-gray border border-white/10 rounded-DEFAULT p-6 shadow-[4px_4px_0px_0px_#000000]">
          <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-4">Avg Network Health</div>
          <div className="font-display-lg text-display-lg text-volt-accent font-bold leading-none">
            {avgHealth.toFixed(1)}%
          </div>
          <div className="w-full bg-surface-container mt-5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-volt-accent h-full transition-all duration-500" style={{ width: `${avgHealth}%` }}></div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="col-span-12 lg:col-span-6 bg-graphite-gray border border-white/10 rounded-DEFAULT p-6 shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Active Alerts</div>
            <div className="bg-signal-red/20 text-signal-red px-2 py-1 rounded-[2px] font-data-mono text-data-mono font-bold flex items-center gap-1.5 text-[11px]">
              <div className="w-1.5 h-1.5 rounded-full bg-signal-red animate-pulse"></div>
              {criticalNodes.length} CRITICAL
            </div>
          </div>
          <div className="space-y-2 font-data-mono text-data-mono text-on-surface text-[12px]">
            {criticalNodes.slice(0, 2).map((n, i) => (
              <div 
                key={n.id} 
                onClick={() => {
                  setActiveNodeId(n.id);
                  setActiveView('nodes');
                }}
                className="flex justify-between items-center border-b border-white/5 pb-2 cursor-pointer hover:text-signal-red"
              >
                <span className="text-on-surface-variant font-bold">{n.name}</span>
                <span className="text-signal-red">CRITICAL_STATE</span>
                <span className="text-on-surface-variant opacity-50">{n.region}</span>
              </div>
            ))}
            {warningNodes.slice(0, 1).map((n, i) => (
              <div 
                key={n.id} 
                onClick={() => {
                  setActiveNodeId(n.id);
                  setActiveView('nodes');
                }}
                className="flex justify-between items-center border-b border-white/5 pb-2 cursor-pointer hover:text-[#FF9F0A]"
              >
                <span className="text-on-surface-variant font-bold">{n.name}</span>
                <span className="text-[#FF9F0A]">WARNING_STATE</span>
                <span className="text-on-surface-variant opacity-50">{n.region}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Inventory Data Table */}
      <div className="mt-6 flex flex-col">
        {/* Table Header */}
        <div className="flex items-center px-4 py-3 bg-surface/90 backdrop-blur-md border-b border-white/20 sticky top-16 z-10 font-label-caps text-label-caps text-on-surface-variant tracking-wider uppercase text-[11px]">
          <div className="w-12">Sts</div>
          <div className="flex-1 min-w-[150px]">Identifier</div>
          <div className="w-32 hidden sm:block">Type</div>
          <div className="w-32 hidden md:block">Region</div>
          <div className="w-24 text-right">Health</div>
          <div className="w-24 text-right hidden lg:block">Load</div>
          <div className="w-12 text-right"></div>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col font-data-mono text-data-mono text-on-surface text-[13px] border-b border-white/10">
          {filteredNodes.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant opacity-50 font-label-caps tracking-widest uppercase">
              No matching nodes found in the catalog directory.
            </div>
          ) : (
            filteredNodes.map((node, index) => {
              const statusColor = 
                node.status === 'STABLE' 
                  ? 'border-volt-accent bg-volt-accent/20' 
                  : node.status === 'SINKRONISASI' 
                  ? 'border-electric-blue bg-electric-blue/20' 
                  : node.status === 'WARNING' 
                  ? 'border-[#FF9F0A] bg-[#FF9F0A]/20' 
                  : node.status === 'CRITICAL'
                  ? 'border-signal-red bg-signal-red pulse-dot'
                  : 'border-white/30 bg-transparent';

              return (
                <div 
                  key={node.id}
                  onClick={() => {
                    setActiveNodeId(node.id);
                    setActiveView('nodes');
                  }}
                  className={`group flex items-center px-4 py-4 border-b border-white/5 hover:bg-graphite-gray transition-colors cursor-pointer ${
                    index % 2 === 1 ? 'bg-white/[0.01]' : ''
                  } ${node.status === 'CRITICAL' ? 'bg-signal-red/5 border-b-signal-red/10' : ''}`}
                >
                  <div className="w-12 flex items-center">
                    <div className={`w-3 h-3 rounded-full border ${statusColor}`}></div>
                  </div>
                  <div className="flex-1 min-w-[150px] font-bold group-hover:text-volt-accent transition-colors">
                    {node.name}
                  </div>
                  <div className="w-32 hidden sm:block text-on-surface-variant">{node.type}</div>
                  <div className="w-32 hidden md:block text-on-surface-variant">{node.region}</div>
                  
                  <div className={`w-24 text-right font-bold ${
                    node.status === 'OFFLINE' 
                      ? 'text-on-surface-variant' 
                      : node.health < 50 
                      ? 'text-signal-red' 
                      : node.health < 90 
                      ? 'text-[#FF9F0A]' 
                      : 'text-volt-accent'
                  }`}>
                    {node.status === 'OFFLINE' ? 'OFFLINE' : `${node.health}%`}
                  </div>

                  <div className="w-24 text-right hidden lg:block text-on-surface-variant">
                    {node.status === 'OFFLINE' ? '--' : `${node.load}%`}
                  </div>
                  <div className="w-12 flex justify-end">
                    <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                      chevron_right
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
