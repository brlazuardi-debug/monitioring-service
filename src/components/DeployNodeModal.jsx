import React, { useState, useContext } from 'react';
import { DashboardContext } from '../context/DashboardContext';

export default function DeployNodeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { deployNode } = useContext(DashboardContext);
  const [name, setName] = useState('');
  const [type, setType] = useState('Hardware');
  const [region, setRegion] = useState('US-EAST');
  const [ip, setIp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Node identifier is required.');
      return;
    }
    if (!ip.trim() || !/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(ip)) {
      setError('Please provide a valid IPv4 address.');
      return;
    }

    deployNode(name, type, region, ip);
    setName('');
    setType('Hardware');
    setRegion('US-EAST');
    setIp('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-graphite-gray border border-white/20 rounded-DEFAULT p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
        <h2 className="font-display-lg text-title-md text-on-surface uppercase tracking-widest border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-volt-accent">dns</span>
          DEPLOY_NEW_NODE
        </h2>

        {error && (
          <div className="mb-4 bg-signal-red/10 border border-signal-red/30 text-signal-red px-3 py-2 rounded text-[12px] font-data-mono uppercase">
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-data-mono text-label-caps text-on-surface-variant uppercase">Node Identifier</label>
            <input
              type="text"
              placeholder="e.g. ND-delta-07"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black border border-white/20 text-on-surface font-body-base px-3.5 py-2.5 rounded focus:outline-none focus:border-volt-accent focus:ring-0 transition-colors w-full uppercase"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-data-mono text-label-caps text-on-surface-variant uppercase">System Architecture</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-black border border-white/20 text-on-surface font-body-base px-3.5 py-2.5 rounded focus:outline-none focus:border-volt-accent focus:ring-0 transition-colors w-full cursor-pointer"
            >
              <option value="Hardware">Hardware Node (Bare-Metal)</option>
              <option value="Service">Software Container (Virtualized)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-data-mono text-label-caps text-on-surface-variant uppercase">Deployment Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="bg-black border border-white/20 text-on-surface font-body-base px-3.5 py-2.5 rounded focus:outline-none focus:border-volt-accent focus:ring-0 transition-colors w-full cursor-pointer"
            >
              <option value="US-EAST">US-EAST (Virginia)</option>
              <option value="US-WEST">US-WEST (Oregon)</option>
              <option value="EU-WEST">EU-WEST (Ireland)</option>
              <option value="EU-CENTRAL">EU-CENTRAL (Frankfurt)</option>
              <option value="AP-SOUTH">AP-SOUTH (Mumbai)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-data-mono text-label-caps text-on-surface-variant uppercase">IP Interface Address</label>
            <input
              type="text"
              placeholder="e.g. 192.168.10.45"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="bg-black border border-white/20 text-on-surface font-data-mono text-data-mono px-3.5 py-2.5 rounded focus:outline-none focus:border-volt-accent focus:ring-0 transition-colors w-full"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-white/30 text-on-surface font-label-caps text-label-caps rounded hover:bg-white/5 transition-colors focus:outline-none"
            >
              DISCARD
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-volt-accent text-primary-container font-label-caps text-label-caps font-bold rounded hover:bg-tertiary transition-colors shadow-[4px_4px_0px_0px_#1c1c1e] focus:outline-none"
            >
              INITIALIZE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
