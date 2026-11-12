import React from 'react';
import {
  Layers,
  Sparkles,
  Sun,
  Moon,
  Code2,
  FileDown,
  Building2,
  Cpu,
  Menu,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
  selectedStore: string;
  onSelectStore: (store: string) => void;
  onOpenJsonDrawer: () => void;
  onOpenActionList: () => void;
  onToggleMobileSidebar: () => void;
  actionCount: number;
  isAnalyzing: boolean;
  modelName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleDark,
  selectedStore,
  onSelectStore,
  onOpenJsonDrawer,
  onOpenActionList,
  onToggleMobileSidebar,
  actionCount,
  isAnalyzing,
  modelName = 'gemini-3.8-flash'
}) => {
  return (
    <header className="sticky top-0 z-30 border-b transition-colors bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Branding & Mobile Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-lg text-slate-900 dark:text-white">Shelf<span className="text-blue-600 dark:text-blue-400">IQ</span></span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 uppercase tracking-wider">Retail Vision</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span>Planogram &amp; Shelf Auditor</span>
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Model Status & Store Selector */}
        <div className="hidden md:flex items-center gap-3">
          {/* Store Switcher */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-200">
            <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <select
              value={selectedStore}
              onChange={(e) => onSelectStore(e.target.value)}
              className="bg-transparent font-medium focus:outline-none cursor-pointer pr-1 text-slate-800 dark:text-slate-200"
            >
              <option value="Store #104 - Downtown Flagship">Store #104 - Downtown Flagship</option>
              <option value="Store #208 - Metro West">Store #208 - Metro West</option>
              <option value="Store #315 - Suburban Hub">Store #315 - Suburban Hub</option>
            </select>
          </div>

          {/* Model Beacon */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-[11px] font-medium text-indigo-700 dark:text-indigo-300">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAnalyzing ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isAnalyzing ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>
            <Cpu className="w-3 h-3 text-indigo-500" />
            <span>{isAnalyzing ? 'Analyzing Image...' : modelName}</span>
          </div>
        </div>

        {/* Right Actions: Recruiter Drawer, Restock List, Dark Mode */}
        <div className="flex items-center gap-2">
          {/* Action List Button */}
          <button
            onClick={onOpenActionList}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            title="Open Prioritized Restock Action List"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Action List</span>
            {actionCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-bold">
                {actionCount}
              </span>
            )}
          </button>

          {/* Technical Recruiter JSON Inspection Button */}
          <button
            onClick={onOpenJsonDrawer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors shadow-xs"
            title="Inspect raw Gemini JSON payload & prompt for technical evaluators"
          >
            <Code2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">JSON Inspector</span>
            <span className="text-[10px] uppercase font-bold px-1 py-0.2 rounded bg-purple-200 dark:bg-purple-900/80 text-purple-800 dark:text-purple-200">
              Dev
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
