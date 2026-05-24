import React, { useContext, useState, useEffect, useRef } from 'react';
import { DashboardContext } from '../context/DashboardContext';

export default function SecurityCenter() {
  const { securityAlerts } = useContext(DashboardContext);

  // Live Threat Clock State
  const [timeStr, setTimeStr] = useState('00:00:00');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Stats Simulation: increment blocked threat count periodically
  const [blockedThreats, setBlockedThreats] = useState(1402);
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockedThreats(prev => prev + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Canvas-based Topology Visualizer
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 160;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Node particles configuration
    const particles = [];
    const numParticles = 20;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() * 0.6) - 0.3,
        vy: (Math.random() * 0.6) - 0.3,
        radius: Math.random() * 2 + 1.5,
        pulse: Math.random() * Math.PI
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid layout mesh background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw connection wires
      ctx.strokeStyle = 'rgba(209, 255, 0, 0.15)';
      ctx.lineWidth = 0.8;
      for (let i = 0; i < numParticles; i++) {
        for (let j = i + 1; j < numParticles; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update node particles
      particles.forEach((p, idx) => {
        // Pulse size modulation
        p.pulse += 0.03;
        const currentRadius = p.radius + Math.sin(p.pulse) * 0.8;

        // Draw outer ring glow
        ctx.fillStyle = idx % 5 === 0 ? 'rgba(255, 59, 48, 0.15)' : 'rgba(209, 255, 0, 0.15)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw core node
        ctx.fillStyle = idx % 5 === 0 ? '#FF3B30' : '#D1FF00';
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Update positions
        p.x += p.vx;
        p.y += p.vy;

        // Bounce walls
        if (p.x < 0 || p.x > canvas.width) p.vx = -p.vx;
        if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy;
      });

      // Overlay text status
      ctx.fillStyle = 'rgba(229, 226, 225, 0.4)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('/// VISUALIZER_STREAM_ONLINE // REAL-TIME TOPOLOGY ///', canvas.width / 2, canvas.height - 15);

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="flex-grow p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-8">
      {/* Page Title Area */}
      <div className="flex items-end justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface uppercase tracking-tight">SECURITY_MATRIX</h1>
          <p className="font-data-mono text-data-mono text-on-surface-variant mt-2 uppercase">
            GLOBAL THREAT MONITORING // REAL-TIME
          </p>
        </div>
        <div className="font-data-mono text-data-mono text-volt-accent text-right leading-relaxed hidden sm:block">
          T-MINUS: <span id="clock" className="font-bold">{timeStr}</span><br />
          LOC: SECTOR_7G
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Row 1: High-Level Metrics */}
        {/* Security Score */}
        <div className="col-span-12 lg:col-span-4 bg-graphite-gray ring-1 ring-white/10 rounded-lg p-6 flex flex-col justify-between relative overflow-hidden group shadow-[4px_4px_0px_0px_#000000]">
          <div className="absolute inset-0 bg-volt-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex justify-between items-start mb-8 relative z-10">
            <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider">SYS_INTEGRITY_SCORE</span>
            <div className="bg-volt-accent text-tertiary-container px-2 py-1 rounded-sm font-label-caps text-label-caps flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 bg-tertiary-container rounded-full pulse-dot"></span>
              STABLE
            </div>
          </div>
          <div className="relative z-10 flex items-end gap-4">
            <span className="font-display-lg text-[64px] text-volt-accent font-bold leading-none">98.4</span>
            <span className="font-data-mono text-data-mono text-on-surface-variant mb-2">/ 100</span>
          </div>
        </div>

        {/* Threat Metrics */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-gutter">
          {/* Blocked Threats */}
          <div className="bg-surface-container-low ring-1 ring-white/10 rounded-lg p-6 flex flex-col justify-center shadow-[4px_4px_0px_0px_#000000]">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-signal-red">gpp_bad</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider">THREATS BLOCKED (24H)</span>
            </div>
            <div className="font-display-lg text-display-lg text-signal-red leading-none font-bold">
              {blockedThreats.toLocaleString()}
            </div>
            <div className="mt-4 w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
              <div className="bg-signal-red h-full w-[75%] transition-all duration-300"></div>
            </div>
          </div>

          {/* Active Rules */}
          <div className="bg-surface-container-low ring-1 ring-white/10 rounded-lg p-6 flex flex-col justify-center shadow-[4px_4px_0px_0px_#000000]">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-electric-blue">policy</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider">ACTIVE FIREWALL RULES</span>
            </div>
            <div className="font-display-lg text-display-lg text-on-surface leading-none font-bold">34,091</div>
            <div className="font-data-mono text-data-mono text-on-surface-variant mt-3 text-[12px]">
              +12 deployed since last cycle
            </div>
          </div>
        </div>

        {/* Row 2: Feeds */}
        {/* Critical Alerts Feed */}
        <div className="col-span-12 lg:col-span-6 bg-surface-container-low ring-1 ring-white/10 rounded-lg flex flex-col overflow-hidden shadow-[4px_4px_0px_0px_#000000]">
          <div className="p-4 border-b border-white/10 bg-surface-container/50 backdrop-blur-md flex justify-between items-center">
            <h3 className="font-label-caps text-label-caps text-on-surface font-bold tracking-wider">CRITICAL ALERTS FEED</h3>
            <span className="font-data-mono text-data-mono text-signal-red animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-signal-red rounded-full"></span>
              LIVE
            </span>
          </div>
          <div className="flex-grow overflow-y-auto max-h-[320px] p-2 divide-y divide-white/5">
            {securityAlerts.map(alert => (
              <div 
                key={alert.id} 
                className="flex items-start gap-4 p-3.5 hover:bg-surface-container transition-colors rounded group cursor-crosshair"
              >
                <div className="font-data-mono text-data-mono text-on-surface-variant mt-1 group-hover:text-signal-red transition-colors">
                  {alert.time}
                </div>
                <div className="flex-grow">
                  <div className="font-title-md text-title-md text-on-surface font-semibold mb-1 leading-tight group-hover:text-volt-accent transition-colors">
                    {alert.title}
                  </div>
                  <div className="font-body-base text-[13px] text-on-surface-variant">
                    {alert.message}
                  </div>
                </div>
                <div className={`shrink-0 border px-2 py-0.5 rounded font-label-caps text-[10px] ${
                  alert.severity === 'SEV-1' 
                    ? 'bg-signal-red/25 border-signal-red text-signal-red' 
                    : alert.severity === 'SEV-2' 
                    ? 'bg-[#FF9F0A]/25 border-[#FF9F0A] text-[#FF9F0A]' 
                    : 'bg-electric-blue/25 border-electric-blue text-electric-blue'
                }`}>
                  {alert.severity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Access Attempts */}
        <div className="col-span-12 lg:col-span-6 bg-surface-container-low ring-1 ring-white/10 rounded-lg flex flex-col overflow-hidden shadow-[4px_4px_0px_0px_#000000]">
          <div className="p-4 border-b border-white/10 bg-surface-container/50 backdrop-blur-md flex justify-between items-center">
            <h3 className="font-label-caps text-label-caps text-on-surface font-bold tracking-wider">ACCESS ATTEMPTS (LAST 1H)</h3>
            <button className="font-data-mono text-data-mono text-volt-accent hover:underline text-[12px]">VIEW_ALL</button>
          </div>
          <div className="p-4 flex-grow flex flex-col gap-2">
            <div className="grid grid-cols-12 gap-4 pb-2 border-b border-white/10 font-label-caps text-label-caps text-on-surface-variant tracking-wider text-[11px]">
              <div className="col-span-4">SOURCE IP</div>
              <div className="col-span-4">TARGET</div>
              <div className="col-span-4 text-right">STATUS</div>
            </div>
            
            <div className="grid grid-cols-12 gap-4 py-2 hover:bg-surface-container transition-colors rounded px-2 -mx-2 items-center text-[13px]">
              <div className="col-span-4 font-data-mono text-on-surface">192.168.1.45</div>
              <div className="col-span-4 text-on-surface-variant">Admin Console</div>
              <div className="col-span-4 text-right font-data-mono text-volt-accent font-bold">SUCCESS</div>
            </div>
            <div className="grid grid-cols-12 gap-4 py-2 hover:bg-surface-container transition-colors rounded px-2 -mx-2 items-center text-[13px]">
              <div className="col-span-4 font-data-mono text-on-surface">45.22.109.11</div>
              <div className="col-span-4 text-on-surface-variant">Database cluster</div>
              <div className="col-span-4 text-right font-data-mono text-signal-red font-bold">BLOCKED</div>
            </div>
            <div className="grid grid-cols-12 gap-4 py-2 hover:bg-surface-container transition-colors rounded px-2 -mx-2 items-center text-[13px]">
              <div className="col-span-4 font-data-mono text-on-surface">10.0.0.12</div>
              <div className="col-span-4 text-on-surface-variant">API Gateway</div>
              <div className="col-span-4 text-right font-data-mono text-volt-accent font-bold">SUCCESS</div>
            </div>
            <div className="grid grid-cols-12 gap-4 py-2 hover:bg-surface-container transition-colors rounded px-2 -mx-2 items-center text-[13px]">
              <div className="col-span-4 font-data-mono text-on-surface">188.166.19.82</div>
              <div className="col-span-4 text-on-surface-variant">Admin Console</div>
              <div className="col-span-4 text-right font-data-mono text-signal-red font-bold">BLOCKED</div>
            </div>
          </div>
        </div>

        {/* Row 3: Network Topology Canvas */}
        <div className="col-span-12 bg-graphite-gray ring-1 ring-white/10 rounded-lg p-6 relative overflow-hidden group shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between">
          <div className="relative z-10 flex justify-between items-start mb-4">
            <h3 className="font-label-caps text-label-caps text-on-surface font-bold tracking-wider">NETWORK TRAFFIC TOPOLOGY MESH</h3>
            <div className="flex gap-1">
              <div className="w-1.5 h-4 bg-volt-accent animate-[pulse_1s_infinite]"></div>
              <div className="w-1.5 h-4 bg-volt-accent animate-[pulse_1.2s_infinite]"></div>
              <div className="w-1.5 h-4 bg-volt-accent animate-[pulse_0.8s_infinite]"></div>
            </div>
          </div>
          
          {/* Animated Canvas */}
          <div className="relative w-full h-40 border border-white/5 bg-black/40 rounded flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
          </div>
        </div>
      </div>
    </div>
  );
}
