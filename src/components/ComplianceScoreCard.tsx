import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Layers,
  ChevronRight,
  TrendingUp,
  Percent,
  Check,
  Sparkles
} from 'lucide-react';
import { PlanogramAnalysis, ComplianceStatus } from '../types/retail';

interface ComplianceScoreCardProps {
  score: number;
  status: ComplianceStatus;
  executiveSummary: string;
  planogram: PlanogramAnalysis;
  shelvesCount: number;
}

export const ComplianceScoreCard: React.FC<ComplianceScoreCardProps> = ({
  score,
  status,
  executiveSummary,
  planogram,
  shelvesCount
}) => {
  // SVG circular progress parameters
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getStatusColor = (s: ComplianceStatus) => {
    switch (s) {
      case 'COMPLIANT':
        return {
          text: 'text-emerald-700 dark:text-emerald-400',
          bg: 'bg-emerald-50 dark:bg-emerald-950/60',
          border: 'border-emerald-200 dark:border-emerald-800',
          stroke: '#10b981',
          label: 'Compliant'
        };
      case 'NEEDS_ATTENTION':
        return {
          text: 'text-amber-700 dark:text-amber-400',
          bg: 'bg-amber-50 dark:bg-amber-950/60',
          border: 'border-amber-200 dark:border-amber-800',
          stroke: '#f59e0b',
          label: 'Needs Attention'
        };
      case 'CRITICAL_VIOLATION':
      default:
        return {
          text: 'text-rose-700 dark:text-rose-400',
          bg: 'bg-rose-50 dark:bg-rose-950/60',
          border: 'border-rose-200 dark:border-rose-800',
          stroke: '#ef4444',
          label: 'Critical Violation'
        };
    }
  };

  const statusTheme = getStatusColor(status);

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      {/* Header & Gauge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Radial Score Gauge */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={statusTheme.stroke}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {Math.round(score)}%
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Match</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Planogram Compliance Score
              </h2>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusTheme.bg} ${statusTheme.text} ${statusTheme.border}`}
              >
                {statusTheme.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              Comparison of live shelf photograph against master merchandiser layout rules.
            </p>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto text-center border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-4">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <div className="text-xs text-slate-400 font-medium">Compliant</div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {planogram.actualCompliantFacings}/{planogram.totalExpectedFacings}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <div className="text-xs text-slate-400 font-medium">Misplaced</div>
            <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
              {planogram.misplacedItemsCount} SKUs
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <div className="text-xs text-slate-400 font-medium">Tiers</div>
            <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {shelvesCount} Shelves
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary Quote Callout */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 leading-relaxed flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Executive AI Summary: </span>
          <span>{executiveSummary}</span>
        </div>
      </div>

      {/* Shelf-by-Shelf Breakdown */}
      <div>
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Tier-by-Tier Compliance Breakdown</span>
          <span className="text-[10px] text-slate-400 font-normal">Top to Bottom Deck</span>
        </h3>

        <div className="space-y-2">
          {planogram.shelfBreakdown.map((shelf) => {
            const isGood = shelf.complianceRate >= 85;
            const isWarning = shelf.complianceRate >= 70 && shelf.complianceRate < 85;

            return (
              <div
                key={shelf.shelfNumber}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                      T{shelf.shelfNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {shelf.shelfTier}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isGood
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : isWarning
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {shelf.complianceRate}%
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        isGood
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : isWarning
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {shelf.status}
                    </span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isGood ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, shelf.complianceRate))}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {shelf.notes}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
