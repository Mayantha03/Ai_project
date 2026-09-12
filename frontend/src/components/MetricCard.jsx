import React from 'react';

export default function MetricCard({ title, value, subtitle, icon: Icon, delta, deltaType = 'positive', glow = false }) {
  return (
    <div className={`p-5 rounded-2xl ${glow ? 'glass-panel-glow bg-white border-emerald-300' : 'glass-panel bg-white border-slate-200'} transition hover:border-slate-300 shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 tracking-wide">{title}</span>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <Icon className="w-4 h-4 text-emerald-600" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
        {delta && (
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
            deltaType === 'positive' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {delta}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
}
