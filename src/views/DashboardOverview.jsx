import React, { useContext, useState } from 'react';
import { DashboardContext } from '../context/DashboardContext';

export default function DashboardOverview() {
  const { metrics, nodes, securityAlerts, setActiveView, setActiveNodeId } = useContext(DashboardContext);

  // Filter nodes to show top 3 for dashboard overview list
  const activeNodes = nodes.filter(n => n.status !== 'OFFLINE').slice(0, 3);

  // Custom Chart State for SVG Hover Interaction
  const [hoverIndex, setHoverIndex] = useState(null);
  const chartData = [
    { time: '00:00', load: 60 },
    { time: '03:00', load: 45 },
    { time: '06:00', load: 50 },
    { time: '09:00', load: 35 },
    { time: '12:00', load: 70 },
    { time: '15:00', load: 40 },
    { time: '18:00', load: 65 },
    { time: '21:00', load: 55 },
    { time: 'Now', load: metrics.cpu }
  ];

  // SVG Coordinates calculation for chartData (100x100 viewBox)
  const getSvgCoordinates = () => {
    const width = 100;
    const height = 100;
    const paddingLeft = 10;
    const paddingRight = 10;
    const graphWidth = width - paddingLeft - paddingRight;

    return chartData.map((d, index) => {
      const x = paddingLeft + (index / (chartData.length - 1)) * graphWidth;
      // Invert Y coordinate so higher loads are near top (0 is top, 100 is bottom)
      const y = 90 - (d.load / 100) * 80; // keep within 10% to 90% range
      return { x, y, load: d.load, time: d.time };
    });
  };

  const coords = getSvgCoordinates();
  const pathD = coords.reduce((acc, c, idx) => {
    return acc + `${idx === 0 ? 'M' : 'L'}${c.x.toFixed(2)},${c.y.toFixed(2)} `;
  }, '');

  // Fill path for background gradient
  const fillD = `${pathD} L${coords[coords.length - 1].x.toFixed(2)},95 L${coords[0].x.toFixed(2)},95 Z`;

  return (
    <div className="flex-1 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-1 uppercase tracking-tight">
            Dashboard Utama
          </h1>
          <p className="font-data-mono text-data-mono text-on-surface-variant uppercase tracking-wider">
            System Status: <span className="text-volt-accent font-bold">Nominal</span>
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-graphite-gray border border-white/10 px-3 py-1.5 rounded-sm">
          <div className="w-2 h-2 rounded-full bg-volt-accent pulse-dot"></div>
          <span className="font-data-mono text-data-mono text-on-surface uppercase tracking-wider">Live Feed</span>
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* CPU Card */}
        <div className="solid-panel p-5 rounded-lg flex flex-col gap-4 relative overflow-hidden brutalist-shadow">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase">Penggunaan CPU</span>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">memory</span>
          </div>
          <div>
            <div className="font-display-lg text-display-lg text-on-surface">
              {metrics.cpu}<span className="text-title-md">%</span>
            </div>
          </div>
          <div className="w-full bg-primary-container h-1.5 rounded-full mt-2">
            <div 
              className="bg-volt-accent h-full rounded-full transition-all duration-500" 
              style={{ width: `${metrics.cpu}%` }}
            ></div>
          </div>
        </div>

        {/* Memory Card */}
        <div className="solid-panel p-5 rounded-lg flex flex-col gap-4 relative overflow-hidden brutalist-shadow">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase">Memori Aktif</span>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">storage</span>
          </div>
          <div>
            <div className="font-display-lg text-display-lg text-on-surface">
              {metrics.memory.toFixed(1)}<span className="text-title-md font-data-mono ml-0.5">GB</span>
            </div>
          </div>
          <div className="w-full bg-primary-container h-1.5 rounded-full mt-2">
            <div 
              className="bg-electric-blue h-full rounded-full transition-all duration-500" 
              style={{ width: `${(metrics.memory / metrics.memoryMax) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Disk Card */}
        <div className="solid-panel p-5 rounded-lg flex flex-col gap-4 relative overflow-hidden brutalist-shadow">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase">Kapasitas Disk</span>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">hard_drive</span>
          </div>
          <div>
            <div className="font-display-lg text-display-lg text-on-surface">
              {metrics.disk.toFixed(1)}<span className="text-title-md font-data-mono ml-0.5">TB</span>
            </div>
          </div>
          <div className="w-full bg-primary-container h-1.5 rounded-full mt-2">
            <div 
              className="bg-surface-tint h-full rounded-full transition-all duration-500" 
              style={{ width: `${(metrics.disk / metrics.diskMax) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Network Card */}
        <div className="solid-panel p-5 rounded-lg flex flex-col gap-4 relative overflow-hidden brutalist-shadow border-error/35">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase">Lalu Lintas Jaringan</span>
            <span className="material-symbols-outlined text-signal-red text-[18px]">router</span>
          </div>
          <div>
            <div className="font-display-lg text-display-lg text-signal-red">
              {metrics.network}<span className="text-title-md font-data-mono ml-0.5">MB/s</span>
            </div>
          </div>
          <div className="w-full bg-primary-container h-1.5 rounded-full mt-2 flex">
            <div className="bg-signal-red h-full rounded-l-full" style={{ width: '85%' }}></div>
            <div className="bg-surface-tint h-full rounded-r-full" style={{ width: '15%' }}></div>
          </div>
          <div className="absolute top-4 right-4">
            <div className="bg-signal-red text-black font-data-mono text-[9px] px-1.5 py-0.5 rounded-sm uppercase font-bold tracking-wider">
              Kritis
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart + Sidebar panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Main Chart Area */}
        <div className="lg:col-span-8 glass-panel rounded-xl p-6 flex flex-col gap-6 relative">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h2 className="font-title-md text-title-md text-on-surface uppercase tracking-wider">Beban Sistem (Live Telemetry)</h2>
            <div className="flex gap-2">
              <button className="px-2.5 py-1 bg-surface-container-highest text-on-surface text-data-mono font-data-mono rounded-sm border border-white/10 hover:border-volt-accent transition-colors text-[11px]">1H</button>
              <button className="px-2.5 py-1 bg-volt-accent text-primary-container text-data-mono font-data-mono rounded-sm font-bold text-[11px]">24H</button>
              <button className="px-2.5 py-1 bg-surface-container-highest text-on-surface text-data-mono font-data-mono rounded-sm border border-white/10 hover:border-volt-accent transition-colors text-[11px]">7D</button>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full h-64 sm:h-80 relative mt-4">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-white/5 w-full h-0"></div>
              <div className="border-b border-white/5 w-full h-0"></div>
              <div className="border-b border-white/5 w-full h-0"></div>
              <div className="border-b border-white/5 w-full h-0"></div>
              <div className="border-b border-white/10 w-full h-0"></div>
            </div>

            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-on-surface-variant font-data-mono text-[10px] pb-4 pointer-events-none z-10">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            {/* Chart Graphic */}
            <svg 
              className="w-full h-full absolute inset-0 pl-8 pb-4 overflow-visible" 
              preserveAspectRatio="none" 
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient id="glow" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#D1FF00" stopOpacity="0.3"></stop>
                  <stop offset="100%" stopColor="#D1FF00" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              {/* Fill Area under the line */}
              <path d={fillD} fill="url(#glow)"></path>
              
              {/* Line path */}
              <path 
                className="chart-path" 
                d={pathD} 
                fill="none" 
                stroke="#D1FF00" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
                vectorEffect="non-scaling-stroke"
              ></path>

              {/* Plot Points and interactive hover hitboxes */}
              {coords.map((pt, idx) => (
                <g key={idx}>
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    fill={hoverIndex === idx ? '#D1FF00' : '#131313'} 
                    r={hoverIndex === idx ? 2.5 : 1.5} 
                    stroke="#D1FF00" 
                    strokeWidth="1" 
                    vectorEffect="non-scaling-stroke"
                  ></circle>
                  {/* Hover detector overlay */}
                  <rect
                    x={pt.x - 4}
                    y={0}
                    width={8}
                    height={100}
                    fill="transparent"
                    className="cursor-crosshair"
                    onMouseEnter={() => setHoverIndex(idx)}
                    onMouseLeave={() => setHoverIndex(null)}
                  />
                </g>
              ))}
            </svg>

            {/* Live Tooltip based on SVG point hover */}
            {hoverIndex !== null && (
              <div 
                className="absolute bg-graphite-gray border border-volt-accent px-3 py-2 rounded shadow-lg pointer-events-none z-20 font-data-mono text-[11px]"
                style={{
                  left: `${(coords[hoverIndex].x / 100) * 100}%`,
                  top: `${Math.max(10, (coords[hoverIndex].y / 100) * 100 - 15)}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="text-volt-accent font-bold uppercase">{chartData[hoverIndex].time}</div>
                <div className="text-on-surface">Beban: {chartData[hoverIndex].load}%</div>
              </div>
            )}

            {/* X-Axis Labels */}
            <div className="absolute bottom-0 left-8 right-0 flex justify-between text-on-surface-variant font-data-mono text-[10px] pointer-events-none">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>Now</span>
            </div>
          </div>
        </div>

        {/* Side Panel Grid */}
        <div className="lg:col-span-4 flex flex-col gap-gutter w-full">
          {/* Active Nodes List */}
          <div className="solid-panel rounded-xl flex flex-col overflow-hidden brutalist-shadow">
            <div className="bg-surface-container-low p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-label-caps text-label-caps text-on-surface font-bold tracking-wider">Node Aktif</h3>
              <div className="bg-tertiary text-tertiary-container font-data-mono text-[10px] px-1.5 py-0.5 rounded-sm uppercase font-bold tracking-wider">
                Normal
              </div>
            </div>
            <div className="flex flex-col">
              {activeNodes.map(node => (
                <div 
                  key={node.id}
                  onClick={() => {
                    setActiveNodeId(node.id);
                    setActiveView('nodes');
                  }}
                  className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-surface-container-high transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      node.status === 'CRITICAL' ? 'bg-signal-red' : 'bg-volt-accent pulse-dot'
                    }`}></div>
                    <span className="font-data-mono text-data-mono text-on-surface group-hover:text-volt-accent transition-colors">
                      {node.name}
                    </span>
                  </div>
                  <span className="font-data-mono text-data-mono text-on-surface-variant text-[12px]">
                    {node.status === 'SINKRONISASI' ? 'SINKRONISASI' : `${node.load}% Load`}
                  </span>
                </div>
              ))}
              <button 
                onClick={() => setActiveView('catalog')}
                className="p-3 text-center text-volt-accent font-label-caps text-[11px] hover:bg-white/5 transition-colors uppercase tracking-widest border-t border-white/5"
              >
                Lihat Semua Node Catalog
              </button>
            </div>
          </div>

          {/* Security Alerts List */}
          <div className="solid-panel rounded-xl flex flex-col overflow-hidden brutalist-shadow">
            <div className="bg-surface-container-low p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-label-caps text-label-caps text-on-surface font-bold tracking-wider">Peringatan Keamanan</h3>
              <div className="bg-error text-on-error font-data-mono text-[10px] px-1.5 py-0.5 rounded-sm uppercase font-bold tracking-wider">
                Alerts
              </div>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {securityAlerts.slice(0, 2).map(alert => (
                <div 
                  key={alert.id}
                  onClick={() => setActiveView('security')}
                  className="border-l-2 border-signal-red pl-3 py-1 flex flex-col gap-1 cursor-pointer hover:bg-white/5 transition-colors rounded-r"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-data-mono text-data-mono text-signal-red text-[12px] font-bold">{alert.title}</span>
                    <span className="font-data-mono text-[10px] text-on-surface-variant">{alert.time}</span>
                  </div>
                  <span className="font-body-base text-[12px] text-on-surface-variant line-clamp-1">
                    {alert.message}
                  </span>
                </div>
              ))}
              {/* Firmware alert placeholder matching html design */}
              <div 
                onClick={() => setActiveView('security')}
                className="border-l-2 border-volt-accent pl-3 py-1 flex flex-col gap-1 cursor-pointer hover:bg-white/5 transition-colors rounded-r"
              >
                <div className="flex justify-between items-center">
                  <span className="font-data-mono text-data-mono text-volt-accent text-[12px] font-bold">Firmware Update</span>
                  <span className="font-data-mono text-[10px] text-on-surface-variant">1h ago</span>
                </div>
                <span className="font-body-base text-[12px] text-on-surface-variant line-clamp-1">
                  Node ND-alpha-01 requires immediate patch applied.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
