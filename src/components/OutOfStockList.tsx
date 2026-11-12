import React, { useState } from 'react';
import {
  PackageX,
  AlertCircle,
  MapPin,
  Crosshair,
  ArrowRight,
  TrendingDown,
  Layers,
  PlusCircle,
  Check
} from 'lucide-react';
import { OutOfStockItem } from '../types/retail';

interface OutOfStockListProps {
  items: OutOfStockItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  onAddToRunSheet?: (item: OutOfStockItem) => void;
}

export const OutOfStockList: React.FC<OutOfStockListProps> = ({
  items,
  selectedItemId,
  onSelectItem,
  onAddToRunSheet
}) => {
  const [filter, setFilter] = useState<'ALL' | 'OUT_OF_STOCK' | 'LOW_STOCK'>('ALL');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const filteredItems = items.filter((item) => {
    if (filter === 'ALL') return true;
    return item.status === filter;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  const handleAdd = (item: OutOfStockItem) => {
    setAddedIds((prev) => new Set(prev).add(item.id));
    if (onAddToRunSheet) onAddToRunSheet(item);
  };

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <PackageX className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Out-of-Stock &amp; Low-Stock Identification
              <span className="text-[11px] font-mono px-2 py-0.2 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold">
                {items.length} Detected
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Bounding boxes pinpoint exact shelf gaps and missing facing counts.
            </p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'ALL'
                ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setFilter('OUT_OF_STOCK')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'OUT_OF_STOCK'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            OOS Only
          </button>
          <button
            onClick={() => setFilter('LOW_STOCK')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'LOW_STOCK'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Low Stock
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            No items matching selected filter.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isSelected = selectedItemId === item.id;
            const isOos = item.status === 'OUT_OF_STOCK';
            const isAdded = addedIds.has(item.id);

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(isSelected ? null : item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? isOos
                      ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 shadow-sm ring-1 ring-rose-400/50'
                      : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 shadow-sm ring-1 ring-amber-400/50'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(
                        item.priority
                      )}`}
                    >
                      {item.priority}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isOos ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {isOos ? 'Out-of-Stock' : 'Low Stock Warning'}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {item.productName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      -{item.estimatedMissingUnits} units missing
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.shelfLocation}</span>
                  </div>

                  {/* Normalized Bounding Box Label */}
                  <div className="flex items-center gap-1 font-mono text-[10px] bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded">
                    <Crosshair className="w-3 h-3 text-slate-400" />
                    <span>Box: [{item.box2d.join(', ')}]</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-white shrink-0">Action:</span>
                    <span>{item.recommendedAction}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(item);
                    }}
                    disabled={isAdded}
                    className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                      isAdded
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3" />
                        Added
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-3 h-3" />
                        Add to Task List
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
