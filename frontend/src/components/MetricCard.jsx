import React from 'react';

export default function MetricCard({ title, value, subtitle, icon: Icon, delta, deltaType = 'positive', glow = false }) {
  return (
    <div className={`p-5 rounded-2xl ${glow ? 'glass-panel-glow' : 'glass-panel'} transition hover:border-slate-700`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 tracking-wide">{title}</span>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
            <Icon className="w-4 h-4 text-emerald-400" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-black text-white tracking-tight">{value}</h3>
        {delta && (
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
            deltaType === 'positive' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' : 'bg-red-950 text-red-400 border border-red-800/60'
          }`}>
            {delta}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}
