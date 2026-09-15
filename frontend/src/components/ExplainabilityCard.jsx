import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function ExplainabilityCard({ title, reasons = [], score, confidence, isCrossFaculty, featureImportances }) {
  return (
    <div className="rounded-2xl bg-white p-5 space-y-4 border border-emerald-300 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 tracking-wide">{title || "AI Reasoning & Explainability"}</h4>
            <p className="text-[11px] text-slate-500">Transparency breakdown of AI decision factors</p>
          </div>
        </div>

        {score !== undefined && (
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">AI Match Score</span>
            <span className="text-base font-extrabold text-emerald-600">{score}%</span>
          </div>
        )}
      </div>

      {isCrossFaculty && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <span>
            <strong>Cross-Faculty Space Sharing Activated:</strong> Assigned across faculties to eliminate room shortage without scheduling delay.
          </span>
        </div>
      )}

      {/* Feature Importance Visual Breakdown */}
      {featureImportances && Object.keys(featureImportances).length > 0 && (
        <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Random Forest Feature Importance Weights:</p>
          <div className="space-y-1.5 text-xs">
            {Object.entries(featureImportances).map(([feat, val], idx) => {
              const pct = Math.round(val * 100);
              return (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between text-[11px] text-slate-700 font-medium">
                    <span>{feat}</span>
                    <span className="font-bold text-emerald-700">{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Contributing Factors:</p>
        <ul className="space-y-1.5">
          {reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {confidence !== undefined && (
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Model Confidence:
          </span>
          <span className="font-semibold text-slate-800">{(confidence * 100).toFixed(0)}% (Validated R²)</span>
        </div>
      )}
    </div>
  );
}
