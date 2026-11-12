import React from 'react';
import {
  Tag,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Crosshair,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PricingDiscrepancy } from '../types/retail';

interface PricingDiscrepanciesProps {
  items: PricingDiscrepancy[];
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  onCreateRetagOrder?: (item: PricingDiscrepancy) => void;
}

export const PricingDiscrepancies: React.FC<PricingDiscrepanciesProps> = ({
  items,
  selectedItemId,
  onSelectItem,
  onCreateRetagOrder
}) => {
  const getIssueBadge = (type: string) => {
    switch (type) {
      case 'EXPIRED_PROMO':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'MISSING_TAG':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'TAG_MISMATCH':
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-800';
    }
  };

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Pricing Discrepancy Alerts
              <span className="text-[11px] font-mono px-2 py-0.2 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold">
                {items.length} Flagged
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Comparing visible shelf edge tags against real-time central ERP catalog prices.
            </p>
          </div>
        </div>
      </div>

      {/* Discrepancies Grid */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            No pricing discrepancies detected in this shelf audit.
          </div>
        ) : (
          items.map((item) => {
            const isSelected = selectedItemId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(isSelected ? null : item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-500 shadow-sm ring-1 ring-purple-400/50'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getIssueBadge(
                        item.issueType
                      )}`}
                    >
                      {item.issueType.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.productName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {item.shelfLocation}
                    </span>
                  </div>
                </div>

                {/* Price Comparison Block */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center mb-3">
                  <div>
                    <span className="text-[10px] font-medium text-slate-400 block mb-0.5">
                      Shelf Edge Tag
                    </span>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
                      {item.shelfTagPrice}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-medium text-slate-400 block mb-0.5">
                      Catalog Expected
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {item.expectedCatalogPrice}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-medium text-slate-400 block mb-0.5">
                      Price Variance
                    </span>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">
                      {item.variance || 'Mismatch'}
                    </span>
                  </div>
                </div>

                {/* Required Action & Coordinate info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
                    <span className="font-bold text-purple-700 dark:text-purple-400 shrink-0">
                      Required Action:
                    </span>
                    <span>{item.actionRequired}</span>
                  </div>

                  {item.box2d && (
                    <div className="shrink-0 flex items-center gap-1 font-mono text-[10px] text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded self-start sm:self-auto">
                      <Crosshair className="w-3 h-3" />
                      <span>[{item.box2d.join(', ')}]</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
