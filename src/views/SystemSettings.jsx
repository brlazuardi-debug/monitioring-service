import React, { useContext, useState } from 'react';
import { DashboardContext } from '../context/DashboardContext';

export default function SystemSettings() {
  const { settings, updateSettingField } = useContext(DashboardContext);

  // Local editing states (committed only when user clicks APPLY CHANGES)
  const [localSettings, setLocalSettings] = useState({ ...settings });
  const [activeSubTab, setActiveSubTab] = useState('general'); // 'general', 'api', 'notifications', 'maintenance'
  const [isSaved, setIsSaved] = useState(false);

  const handleFieldChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setIsSaved(false);
  };

  const handleApply = () => {
    Object.keys(localSettings).forEach(key => {
      updateSettingField(key, localSettings[key]);
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDiscard = () => {
    setLocalSettings({ ...settings });
    setIsSaved(false);
  };

  return (
    <div className="flex-1 max-w-container-max mx-auto px-margin-desktop py-12 w-full">
      {/* Settings Header */}
      <div className="mb-12 border-b border-white/10 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-display-lg text-headline-lg text-on-surface tracking-tighter mb-2 uppercase">SYSTEM CONFIGURATION</h2>
          <p className="font-body-base text-body-base text-on-surface-variant">
            Manage global operational parameters, telemetry warnings, and system profiles.
          </p>
        </div>
        <div className="flex gap-4">
          {isSaved && (
            <div className="self-center bg-volt-accent/10 border border-volt-accent/30 text-volt-accent font-data-mono text-[11px] px-3 py-2 rounded uppercase tracking-wider">
              CONFIG_APPLIED_SUCCESSFULLY
            </div>
          )}
          <button
            onClick={handleDiscard}
            className="px-6 py-2 border border-white/30 text-on-surface font-label-caps text-label-caps rounded hover:bg-white/5 transition-colors focus:outline-none"
          >
            DISCARD
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-volt-accent text-tertiary-container font-label-caps text-label-caps rounded hover:bg-tertiary transition-colors shadow-[4px_4px_0px_0px_#1C1C1E] focus:outline-none font-bold"
          >
            APPLY CHANGES
          </button>
        </div>
      </div>

      {/* Settings Layout: Sidebar Tabs + Content Area */}
      <div className="flex flex-col lg:flex-row gap-gutter items-start">
        {/* Internal Navigation Tabs */}
        <div className="w-full lg:w-1/4 flex-shrink-0 flex flex-col gap-2">
          <button
            onClick={() => setActiveSubTab('general')}
            className={`w-full text-left px-4 py-3.5 rounded font-label-caps text-label-caps flex items-center justify-between group transition-all ${
              activeSubTab === 'general'
                ? 'bg-surface-container-high border-l-2 border-volt-accent text-volt-accent'
                : 'border-l-2 border-transparent text-on-surface-variant hover:text-on-surface hover:bg-white/5'
            }`}
          >
            <span>GENERAL</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab('api')}
            className={`w-full text-left px-4 py-3.5 rounded font-label-caps text-label-caps flex items-center justify-between group transition-all ${
              activeSubTab === 'api'
                ? 'bg-surface-container-high border-l-2 border-volt-accent text-volt-accent'
                : 'border-l-2 border-transparent text-on-surface-variant hover:text-on-surface hover:bg-white/5'
            }`}
          >
            <span>API & INTEGRATIONS</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab('notifications')}
            className={`w-full text-left px-4 py-3.5 rounded font-label-caps text-label-caps flex items-center justify-between group transition-all ${
              activeSubTab === 'notifications'
                ? 'bg-surface-container-high border-l-2 border-volt-accent text-volt-accent'
                : 'border-l-2 border-transparent text-on-surface-variant hover:text-on-surface hover:bg-white/5'
            }`}
          >
            <span>NOTIFICATIONS</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab('maintenance')}
            className={`w-full text-left px-4 py-3.5 rounded font-label-caps text-label-caps flex items-center justify-between group transition-all ${
              activeSubTab === 'maintenance'
                ? 'bg-surface-container-high border-l-2 border-volt-accent text-volt-accent'
                : 'border-l-2 border-transparent text-on-surface-variant hover:text-on-surface hover:bg-white/5'
            }`}
          >
            <span>MAINTENANCE</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="w-full lg:w-3/4 flex flex-col gap-8">
          {activeSubTab === 'general' && (
            <>
              {/* Section: System Identity */}
              <div className="bg-graphite-gray border border-white/10 rounded-DEFAULT p-8 relative overflow-hidden shadow-[4px_4px_0px_0px_#000000]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-volt-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="font-label-caps text-label-caps text-on-surface mb-6 flex items-center gap-2 font-bold tracking-wider">
                  <span className="material-symbols-outlined text-volt-accent">memory</span>
                  SYSTEM IDENTITY
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-data-mono text-label-caps text-on-surface-variant uppercase">Instance Name</label>
                    <input
                      type="text"
                      value={localSettings.instanceName}
                      onChange={(e) => handleFieldChange('instanceName', e.target.value)}
                      className="bg-tertiary-container border border-white/20 text-on-surface font-body-base px-4 py-3 rounded focus:outline-none focus:border-volt-accent focus:ring-0 transition-colors w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-data-mono text-label-caps text-on-surface-variant uppercase">Environment</label>
                    <select
                      value={localSettings.environment}
                      onChange={(e) => handleFieldChange('environment', e.target.value)}
                      className="bg-tertiary-container border border-white/20 text-on-surface font-body-base px-4 py-3 rounded focus:outline-none focus:border-volt-accent focus:ring-0 transition-colors w-full appearance-none cursor-pointer"
                    >
                      <option value="prod">PRODUCTION_ENV</option>
                      <option value="staging">STAGING_ENV</option>
                      <option value="dev">DEVELOPMENT_ENV</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section: Alert Thresholds */}
              <div className="bg-graphite-gray border border-white/10 rounded-DEFAULT p-8 shadow-[4px_4px_0px_0px_#000000]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-label-caps text-label-caps text-on-surface flex items-center gap-2 font-bold tracking-wider">
                    <span className="material-symbols-outlined text-signal-red">warning</span>
                    ALERT THRESHOLDS
                  </h3>
                  <span className="px-2 py-1 bg-signal-red/10 text-signal-red font-label-caps text-label-caps rounded-sm border border-signal-red/20 font-bold">
                    CRITICAL_CONFIG
                  </span>
                </div>
                
                <div className="flex flex-col gap-8">
                  {/* Slider 1: CPU */}
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-end">
                      <div>
                        <label className="font-data-mono text-data-mono text-on-surface uppercase block mb-1">CPU Load Warning</label>
                        <span className="font-body-base text-[12px] text-on-surface-variant">Triggers automated scaling sequence and nodes critical highlight.</span>
                      </div>
                      <span className="font-data-mono text-volt-accent font-bold">{localSettings.cpuWarning}%</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="50"
                        max="98"
                        value={localSettings.cpuWarning}
                        onChange={(e) => handleFieldChange('cpuWarning', parseInt(e.target.value))}
                        className="w-full accent-volt-accent bg-tertiary-container h-2 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Slider 2: Memory */}
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-end">
                      <div>
                        <label className="font-data-mono text-data-mono text-on-surface uppercase block mb-1">Memory Allocation Alert</label>
                        <span className="font-body-base text-[12px] text-on-surface-variant">Initiates memory dump protocols and warnings triggers.</span>
                      </div>
                      <span className="font-data-mono text-signal-red font-bold">{localSettings.memoryWarning}%</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="60"
                        max="99"
                        value={localSettings.memoryWarning}
                        onChange={(e) => handleFieldChange('memoryWarning', parseInt(e.target.value))}
                        className="w-full accent-signal-red bg-tertiary-container h-2 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Operational Modes Toggles */}
              <div className="bg-graphite-gray border border-white/10 rounded-DEFAULT p-8 shadow-[4px_4px_0px_0px_#000000]">
                <h3 className="font-label-caps text-label-caps text-on-surface mb-6 flex items-center gap-2 font-bold tracking-wider">
                  <span className="material-symbols-outlined text-volt-accent">toggle_on</span>
                  OPERATIONAL MODES
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Auto scaling */}
                  <div 
                    onClick={() => handleFieldChange('autoScaling', !localSettings.autoScaling)}
                    className="p-4 border border-white/10 bg-tertiary-container rounded flex justify-between items-center hover:border-white/20 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-data-mono text-data-mono text-on-surface uppercase">Auto-Scaling</span>
                      <span className="font-body-base text-[12px] text-on-surface-variant">Dynamic node allocation</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-all border ${
                      localSettings.autoScaling 
                        ? 'bg-volt-accent border-volt-accent shadow-[0_0_10px_rgba(209,255,0,0.3)]' 
                        : 'bg-surface-container-high border-white/20'
                    }`}>
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-tertiary-container transition-all ${
                        localSettings.autoScaling ? 'right-1' : 'left-1 bg-on-surface-variant'
                      }`}></div>
                    </div>
                  </div>

                  {/* Verbose logging */}
                  <div 
                    onClick={() => handleFieldChange('verboseLogging', !localSettings.verboseLogging)}
                    className="p-4 border border-white/10 bg-tertiary-container rounded flex justify-between items-center hover:border-white/20 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-data-mono text-data-mono text-on-surface uppercase">Verbose Logging</span>
                      <span className="font-body-base text-[12px] text-on-surface-variant">Detailed telemetry data</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-all border ${
                      localSettings.verboseLogging 
                        ? 'bg-volt-accent border-volt-accent shadow-[0_0_10px_rgba(209,255,0,0.3)]' 
                        : 'bg-surface-container-high border-white/20'
                    }`}>
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-tertiary-container transition-all ${
                        localSettings.verboseLogging ? 'right-1' : 'left-1 bg-on-surface-variant'
                      }`}></div>
                    </div>
                  </div>

                  {/* Strict Mode */}
                  <div 
                    onClick={() => handleFieldChange('strictMode', !localSettings.strictMode)}
                    className="p-4 border border-white/10 bg-tertiary-container rounded flex justify-between items-center hover:border-white/20 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-data-mono text-data-mono text-on-surface uppercase">Strict Mode</span>
                      <span className="font-body-base text-[12px] text-on-surface-variant">Enforce zero-trust policies</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-all border ${
                      localSettings.strictMode 
                        ? 'bg-volt-accent border-volt-accent shadow-[0_0_10px_rgba(209,255,0,0.3)]' 
                        : 'bg-surface-container-high border-white/20'
                    }`}>
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-tertiary-container transition-all ${
                        localSettings.strictMode ? 'right-1' : 'left-1 bg-on-surface-variant'
                      }`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSubTab !== 'general' && (
            <div className="bg-graphite-gray border border-white/10 rounded p-8 text-center text-on-surface-variant opacity-60 uppercase font-data-mono shadow-[4px_4px_0px_0px_#000000]">
              /// Sub-section {activeSubTab.toUpperCase()} configuration is read-only in simulated trial cycle ///
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
