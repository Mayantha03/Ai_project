import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function ExplainabilityCard({ title, reasons = [], score, confidence, isCrossFaculty }) {
  return (
    <div className="rounded-2xl glass-panel-glow p-5 space-y-4 border border-emerald-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-950 border border-brand-800/80 flex items-center justify-center text-brand-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">{title || "AI Reasoning & Explainability"}</h4>
            <p className="text-[11px] text-slate-400">Transparency breakdown of AI decision factors</p>
          </div>
        </div>

        {score !== undefined && (
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">AI Match Score</span>
            <span className="text-base font-extrabold text-emerald-400">{score}%</span>
          </div>
        )}
      </div>

      {isCrossFaculty && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>Cross-Faculty Space Sharing Activated:</strong> Assigned across faculties to eliminate room shortage without scheduling delay.
          </span>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Contributing Factors:</p>
        <ul className="space-y-1.5">
          {reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {confidence !== undefined && (
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            Model Confidence:
          </span>
          <span className="font-semibold text-slate-200">{(confidence * 100).toFixed(0)}% (Validated $R^2$)</span>
        </div>
      )}
    </div>
  );
}
