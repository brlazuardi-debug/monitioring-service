import React, { useContext, useState } from 'react';
import { DashboardContext } from '../context/DashboardContext';
import DeployNodeModal from './DeployNodeModal';

export default function Layout({ children }) {
  const { activeView, setActiveView, settings } = useContext(DashboardContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search input state
  const [searchVal, setSearchVal] = useState('');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'admin', label: 'Admin', icon: 'admin_panel_settings' },
    { id: 'catalog', label: 'Catalog', icon: 'inventory_2' },
    { id: 'nodes', label: 'Nodes', icon: 'analytics' },
    { id: 'security', label: 'Security', icon: 'security' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <div className="flex min-h-screen w-full bg-black text-on-surface font-body-base antialiased">
      {/* SideNavBar - Persistent on md+, fixed left */}
      <nav className="fixed left-0 top-0 h-full w-64 flex flex-col z-50 pt-16 pb-8 bg-surface-container-low border-r border-white/10 shadow-[4px_0px_0px_0px_rgba(0,0,0,1)]">
        {/* User Identity / Avatar Header */}
        <div className="px-6 py-6 border-b border-white/10 mb-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-graphite-gray overflow-hidden border border-white/10 flex-shrink-0">
              <img 
                alt="System Operator Avatar" 
                className="w-full h-full object-cover grayscale opacity-80" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEs_wfyC1KHcF9rQQEurn94NvUFvrww8DbZhavYjVVBMfQJbh3udwi1vpwsbLfvnY-i5JzY5irP1IaYg3755qU0p_K1uWRqccfeydZugf0ZwFkZqV6sxEJ3sgiNPN_AhqGArn7DBvaQBQPSdiBYZNPyi95OfIo8hAJ5cMG1Bztmlwba9OIk1Yh48RIkP2fzUojiN3r-cNdg5-K-cB-IOY4Y3E2WxLrcOXwoOqkygPWpZH3z0ofBQ5XdajgR9JOOkcmJMs-eN0FLfMm"
              />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-label-caps text-label-caps text-on-surface truncate">OPERATOR_01</span>
              <span className="font-data-mono text-data-mono text-volt-accent truncate">ROOT_ACCESS</span>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full mt-2 bg-transparent border border-white/30 text-on-surface font-label-caps text-label-caps py-2 rounded hover:border-volt-accent hover:text-volt-accent transition-all duration-200"
          >
            NEW_NODE
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-1">
          {menuItems.map(item => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-4 px-6 py-3.5 transition-all duration-200 active:scale-[0.97] text-left ${
                  isActive 
                    ? 'text-volt-accent bg-surface-container-high border-r-4 border-volt-accent font-bold' 
                    : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-label-caps text-label-caps tracking-widest uppercase">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Brand Info */}
        <div className="px-6 mt-auto pt-4 flex flex-col gap-1 border-t border-white/5">
          <span className="font-label-caps text-[10px] tracking-[0.2em] text-on-surface-variant opacity-50">SYS_CORE_v2.0</span>
          <span className="font-data-mono text-[10px] text-volt-accent uppercase">{settings.environment}_ENV</span>
        </div>
      </nav>

      {/* Main Content Area Wrapper (accounts for sidebar width) */}
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        {/* TopAppBar */}
        <header className="fixed top-0 right-0 left-64 z-40 flex justify-between items-center px-margin-desktop h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10">
          {/* Brand/Instance Name */}
          <div className="flex items-center gap-6">
            <span className="font-display-lg text-headline-lg font-bold tracking-tighter text-on-surface">
              {settings.instanceName}
            </span>
            {/* Search Input */}
            <div className="hidden md:flex items-center bg-surface-container-low ring-1 ring-white/10 rounded px-3 py-1.5 w-64 focus-within:ring-volt-accent transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant mr-2 text-[18px]">search</span>
              <input
                type="text"
                placeholder="Search parameters..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="bg-transparent border-none outline-none text-body-base font-body-base text-on-surface w-full placeholder-on-surface-variant/50 focus:ring-0 p-0"
              />
            </div>
          </div>

          {/* Active status indicator & User actions */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-surface-container border border-white/10 rounded">
              <div className="w-2 h-2 rounded-full bg-volt-accent pulse-dot-volt"></div>
              <span className="font-label-caps text-label-caps text-volt-accent font-bold tracking-wider">SYSTEM_LIVE</span>
            </div>
            
            <div className="flex items-center gap-4 text-on-surface-variant">
              <button 
                onClick={() => setActiveView('security')} 
                className="hover:text-volt-accent transition-colors duration-150 active:opacity-85 relative p-1"
                aria-label="Alerts"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-signal-red"></span>
              </button>
              <button 
                onClick={() => setActiveView('settings')}
                className="hover:text-volt-accent transition-colors duration-150 active:opacity-85 p-1"
                aria-label="Profile"
              >
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </div>
          </div>
        </header>

        {/* Canvas Body (adds top padding to clear header) */}
        <main className="flex-grow pt-16 flex flex-col">
          {children}
        </main>
      </div>

      {/* Deploy Node Modal overlay */}
      <DeployNodeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
