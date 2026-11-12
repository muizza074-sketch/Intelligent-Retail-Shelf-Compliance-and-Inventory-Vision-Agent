import React from 'react';
import {
  ScanLine,
  BarChart3,
  CheckSquare,
  BookOpen,
  History,
  AlertTriangle,
  PackageX,
  Tag,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Code2
} from 'lucide-react';

export type DashboardTab = 'scanner' | 'analytics' | 'actions' | 'catalog' | 'history';

interface SidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenJsonDrawer: () => void;
  urgentCount: number;
  oosCount: number;
  pricingCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  onOpenJsonDrawer,
  urgentCount,
  oosCount,
  pricingCount
}) => {
  const navItems = [
    {
      id: 'scanner' as DashboardTab,
      label: 'Shelf Scanner & Audit',
      description: 'Upload, capture & real-time CV analysis',
      icon: ScanLine,
      badge: 'Live'
    },
    {
      id: 'analytics' as DashboardTab,
      label: 'Audit Analytics & Trends',
      description: 'Store compliance curves & category charts',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'actions' as DashboardTab,
      label: 'Restock Action Center',
      description: 'Prioritized task list & run-sheets',
      icon: CheckSquare,
      badge: urgentCount > 0 ? `${urgentCount} Urgent` : null,
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
    },
    {
      id: 'catalog' as DashboardTab,
      label: 'Planogram Catalog Rules',
      description: 'Ideal SKU facings & price master',
      icon: BookOpen,
      badge: null
    },
    {
      id: 'history' as DashboardTab,
      label: 'Audit History Archive',
      description: 'Searchable historical store logs',
      icon: History,
      badge: '10 Logs'
    }
  ];

  const handleNavClick = (tab: DashboardTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-16 z-40 lg:z-10 h-[calc(100vh-4rem)] w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Section: Main Nav */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Store Operations
              </span>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl font-medium text-xs transition-all flex items-start gap-3 ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold shadow-xs ring-1 ring-blue-500/20'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                              item.badgeColor || 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5 font-normal">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section: Live Shelf Status Summary */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Active Shelf Voids
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Current Bay</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center justify-center gap-1 text-rose-600 dark:text-rose-400 mb-0.5">
                  <PackageX className="w-3.5 h-3.5" />
                  <span className="text-sm font-bold">{oosCount}</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Out-of-Stock</span>
              </div>

              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 mb-0.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="text-sm font-bold">{pricingCount}</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Price Alerts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Technical Recruiter inspection trigger & AI studio credit */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onOpenJsonDrawer}
            className="w-full group p-3 rounded-xl border border-purple-200 dark:border-purple-800/80 bg-purple-50/80 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors text-left"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                Recruiter JSON Inspector
              </span>
              <ArrowRight className="w-3 h-3 text-purple-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-purple-700/80 dark:text-purple-300/80 leading-snug">
              Inspect raw Gemini multimodal payload, tokens, and structured JSON schema.
            </p>
          </button>
        </div>
      </aside>
    </>
  );
};
