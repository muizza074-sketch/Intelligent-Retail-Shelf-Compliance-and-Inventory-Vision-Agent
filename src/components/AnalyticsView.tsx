import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart2,
  PieChart,
  Calendar,
  Building2,
  CheckCircle2,
  AlertTriangle,
  PackageX,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Layers
} from 'lucide-react';
import {
  HISTORICAL_AUDITS,
  CATEGORY_ANALYTICS,
  TREND_DATA_30D,
  PRICING_ERROR_DISTRIBUTION
} from '../data/historicalAudits';

export const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7D' | '14D' | '30D'>('30D');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // KPI calculations
  const totalAudits = HISTORICAL_AUDITS.length;
  const avgCompliance = Math.round(
    HISTORICAL_AUDITS.reduce((acc, a) => acc + a.complianceScore, 0) / totalAudits
  );
  const totalOosFound = HISTORICAL_AUDITS.reduce((acc, a) => acc + a.oosCount, 0);
  const totalPricingErrors = HISTORICAL_AUDITS.reduce((acc, a) => acc + a.pricingErrorsCount, 0);

  // SVG Line Chart points calculation
  const chartHeight = 160;
  const chartWidth = 500;
  const minScore = 60;
  const maxScore = 100;

  const points = TREND_DATA_30D.map((item, index) => {
    const x = (index / (TREND_DATA_30D.length - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - ((item.score - minScore) / (maxScore - minScore)) * (chartHeight - 40) - 20;
    return { x, y, ...item };
  });

  const svgPathD = points.reduce((acc, curr, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`;
  }, '');

  const areaPathD = `${svgPathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Retail Audit Intelligence &amp; Compliance Trends
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cross-aisle computer vision analytics, planogram adherence, and out-of-stock drift.
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300">
          {(['7D', '14D', '30D'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                timeRange === range
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {range === '7D' ? 'Last 7 Days' : range === '14D' ? 'Last 14 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Headline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Overall Planogram Match</span>
            <span className="flex items-center text-emerald-600 font-bold text-[11px]">
              <ArrowUpRight className="w-3.5 h-3.5" /> +4.2%
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {avgCompliance}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${avgCompliance}%` }} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Out-of-Stock Voids Prevented</span>
            <span className="flex items-center text-rose-500 font-bold text-[11px]">
              <PackageX className="w-3.5 h-3.5" /> {totalOosFound} active
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            94.8%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Average On-Shelf Availability</p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Shelf Tag Price Accuracy</span>
            <span className="flex items-center text-purple-600 font-bold text-[11px]">
              <Tag className="w-3.5 h-3.5" /> {totalPricingErrors} errors
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            96.4%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">ERP vs Visible Shelf Tag Match</p>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Total Bay Audits Conducted</span>
            <span className="text-blue-600 font-bold text-[11px]">3 Stores</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {totalAudits * 8}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">100% Automated Vision Verification</p>
        </div>
      </div>

      {/* Row 2: Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: 30-Day Trend Area Chart (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                Storewide Planogram Adherence Trend
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Daily compliance percentage across all aisles
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Target: &gt;85%
            </span>
          </div>

          {/* SVG Trendline Chart */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-44 overflow-visible"
            >
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1="20" x2={chartWidth - 20} y2="20" stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity="0.25" />
              <line x1="20" y1="70" x2={chartWidth - 20} y2="70" stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity="0.25" />
              <line x1="20" y1="120" x2={chartWidth - 20} y2="120" stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity="0.25" />

              {/* Area */}
              <path d={areaPathD} fill="url(#trendGradient)" />

              {/* Line */}
              <path d={svgPathD} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />

              {/* Data points */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4.5"
                    className="fill-white dark:fill-slate-900 stroke-blue-600"
                    strokeWidth="2.5"
                  />
                  <text
                    x={p.x}
                    y={p.y - 10}
                    textAnchor="middle"
                    className="text-[10px] font-mono font-bold fill-slate-700 dark:fill-slate-300"
                  >
                    {p.score}%
                  </text>
                  <text
                    x={p.x}
                    y={chartHeight - 4}
                    textAnchor="middle"
                    className="text-[9px] fill-slate-400 font-medium"
                  >
                    {p.day}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Chart 2: Pricing Discrepancy Donut Distribution */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-600" />
              Pricing Error Breakdown
            </h3>
            <span className="text-[11px] text-slate-400">91 Total Alerts</span>
          </div>

          {/* Sliced List */}
          <div className="space-y-3">
            {PRICING_ERROR_DISTRIBUTION.map((item) => (
              <div key={item.type} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[190px]">
                    {item.type}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {item.percentage}% ({item.count})
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300">
            <strong>Key Insight:</strong> 46% of pricing penalties arise from expired weekly promotional talkers left past Tuesday reset.
          </div>
        </div>
      </div>

      {/* Row 3: Category Performance & Aisle Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Compliance Leaderboard */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            Department Planogram Compliance Ranking
          </h3>

          <div className="space-y-3">
            {CATEGORY_ANALYTICS.map((cat, idx) => (
              <div
                key={cat.name}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold flex items-center justify-center text-slate-700 dark:text-slate-300">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {cat.name}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {cat.audits} audits • {cat.oosRate}% OOS rate
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {cat.compliance}%
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-medium">
                      {cat.pricingAccuracy}% Price Acc.
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      cat.compliance >= 85
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {cat.compliance >= 85 ? 'Passed' : 'Needs Attn'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Store Audits Activity Log */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Recent Automated Audit Feed
            </h3>
            <span className="text-xs text-slate-400">Latest 5 inspections</span>
          </div>

          <div className="space-y-2.5 overflow-hidden">
            {HISTORICAL_AUDITS.slice(0, 5).map((audit) => (
              <div
                key={audit.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {audit.aisle}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {audit.date}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {audit.storeName} • {audit.auditor}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {audit.complianceScore}%
                    </span>
                    <span className="block text-[10px] text-rose-500 font-medium">
                      {audit.oosCount} OOS
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      audit.status === 'COMPLIANT'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : audit.status === 'NEEDS_ATTENTION'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {audit.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
