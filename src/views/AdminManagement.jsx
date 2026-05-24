import React, { useContext, useState } from 'react';
import { DashboardContext } from '../context/DashboardContext';

export default function AdminManagement() {
  const { users, toggleUserLock, inviteUser } = useContext(DashboardContext);

  // Invite user modal state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('OPERATOR');
  const [error, setError] = useState('');

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteName.trim()) {
      setError('Please provide a name.');
      return;
    }
    if (!inviteEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      setError('Please provide a valid email address.');
      return;
    }

    inviteUser(inviteName, inviteEmail, inviteRole);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('OPERATOR');
    setError('');
    setIsInviteOpen(false);
  };

  return (
    <div className="flex-1 max-w-[1440px] mx-auto px-margin-desktop py-12 flex flex-col gap-12 w-full">
      {/* Page Header */}
      <div className="flex justify-between items-end border-b border-white/10 pb-6 flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-label-caps text-label-caps text-volt-accent tracking-widest uppercase">ACCESS CONTROL</span>
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tighter uppercase">Admin Management</h1>
        </div>
        <button 
          onClick={() => setIsInviteOpen(true)}
          className="bg-volt-accent text-tertiary-container font-label-caps text-label-caps px-6 py-3 rounded-[4px] hover:bg-tertiary transition-colors shadow-[4px_4px_0px_0px_rgba(28,28,30,1)] hover:shadow-[2px_2px_0px_0px_rgba(28,28,30,1)] hover:translate-y-[2px] hover:translate-x-[2px] flex items-center gap-2 font-bold focus:outline-none"
        >
          <span className="material-symbols-outlined text-[16px]">person_add</span>
          INVITE USER
        </button>
      </div>

      {/* Data Density Area: Users Table Panel */}
      <div className="bg-surface-container-low border border-white/10 rounded-[2px] overflow-hidden shadow-[4px_4px_0px_0px_#000000]">
        {/* Table Header / Controls Area */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-surface/50 backdrop-blur-md">
          <h2 className="font-title-md text-title-md text-on-surface uppercase tracking-wider">Registered Identities</h2>
          <div className="flex gap-2">
            <button className="p-2 text-on-surface-variant hover:text-volt-accent border border-white/10 rounded hover:border-volt-accent/50 transition-colors">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-volt-accent border border-white/10 rounded hover:border-volt-accent/50 transition-colors">
              <span className="material-symbols-outlined text-[18px]">more_vert</span>
            </button>
          </div>
        </div>

        {/* The Data Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead className="sticky top-0 bg-surface-container-low/90 backdrop-blur-sm z-10 border-b border-white/10">
              <tr className="font-label-caps text-label-caps text-on-surface-variant text-[11px] tracking-wider">
                <th className="py-4 px-6 w-1/3">IDENTITY</th>
                <th className="py-4 px-6">ROLE_LEVEL</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-right">LAST_UPLINK</th>
                <th className="py-4 px-6 w-16 text-center">CMD</th>
              </tr>
            </thead>
            <tbody className="font-data-mono text-data-mono text-on-surface text-[13px] divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="group hover:bg-[#1C1C1E] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-volt-accent font-bold">
                        {user.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-body-base text-body-base font-semibold text-on-surface group-hover:text-volt-accent transition-colors">
                          {user.name}
                        </span>
                        <span className="text-[11px] text-on-surface-variant mt-0.5">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant uppercase font-semibold">{user.role}</td>
                  <td className="py-4 px-6">
                    <span className={`font-label-caps text-[9px] px-2 py-0.5 rounded-[2px] font-bold ${
                      user.status === 'ACTIVE' 
                        ? 'bg-volt-accent text-tertiary-container' 
                        : user.status === 'LOCKED'
                        ? 'border border-signal-red text-signal-red'
                        : 'bg-white/20 text-on-surface'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-on-surface-variant opacity-70">
                    {user.lastUplink}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button 
                      onClick={() => toggleUserLock(user.id)}
                      className="text-on-surface-variant hover:text-volt-accent opacity-0 group-hover:opacity-100 transition-all p-1.5 focus:outline-none"
                      title={user.status === 'LOCKED' ? 'Unlock User' : 'Lock User'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {user.status === 'LOCKED' ? 'lock_open' : 'lock'}
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination */}
        <div className="p-4 border-t border-white/10 bg-surface-container-low flex justify-between items-center font-data-mono text-data-mono text-on-surface-variant text-[12px] flex-wrap gap-4">
          <span>SHOWING 1-{users.length} OF {users.length} ENTRIES</span>
          <div className="flex gap-4 items-center">
            <button className="hover:text-volt-accent disabled:opacity-30" disabled>PREV</button>
            <div className="flex gap-2 text-[12px]">
              <span className="text-volt-accent border-b border-volt-accent pb-0.5 font-bold">01</span>
            </div>
            <button className="hover:text-volt-accent disabled:opacity-30" disabled>NEXT</button>
          </div>
        </div>
      </div>

      {/* Invite User Overlay Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-graphite-gray border border-white/20 rounded-DEFAULT p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-display-lg text-title-md text-on-surface uppercase tracking-widest border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-volt-accent">person_add</span>
              INVITE_NEW_OPERATOR
            </h2>

            {error && (
              <div className="mb-4 bg-signal-red/10 border border-signal-red/30 text-signal-red px-3 py-2 rounded text-[12px] font-data-mono uppercase">
                ERROR: {error}
              </div>
            )}

            <form onSubmit={handleInviteSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-data-mono text-label-caps text-on-surface-variant uppercase">Full Identity Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="bg-black border border-white/20 text-on-surface font-body-base px-3.5 py-2.5 rounded focus:outline-none focus:border-volt-accent focus:ring-0 w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-data-mono text-label-caps text-on-surface-variant uppercase">Secure Email Endpoint</label>
                <input
                  type="text"
                  placeholder="e.g. j.doe@monitor.sys"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="bg-black border border-white/20 text-on-surface font-body-base px-3.5 py-2.5 rounded focus:outline-none focus:border-volt-accent focus:ring-0 w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-data-mono text-label-caps text-on-surface-variant uppercase">Uplink Role Privilege</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="bg-black border border-white/20 text-on-surface font-body-base px-3.5 py-2.5 rounded focus:outline-none focus:border-volt-accent focus:ring-0 w-full cursor-pointer"
                >
                  <option value="OPERATOR">OPERATOR (Standard Read/Write)</option>
                  <option value="SUPERUSER">SUPERUSER (Full Administration)</option>
                  <option value="GUEST">GUEST (ReadOnly Telemetry)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setIsInviteOpen(false);
                  }}
                  className="px-4 py-2 border border-white/30 text-on-surface font-label-caps text-label-caps rounded hover:bg-white/5 transition-colors focus:outline-none"
                >
                  DISCARD
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-volt-accent text-primary-container font-label-caps text-label-caps font-bold rounded hover:bg-tertiary transition-colors shadow-[4px_4px_0px_0px_#1c1c1e] focus:outline-none"
                >
                  TRANSMIT_INVITE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
