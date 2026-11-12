import React, { useState, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Layers,
  PackageX,
  Tag,
  AlertTriangle,
  Maximize2,
  Info
} from 'lucide-react';
import { OutOfStockItem, PricingDiscrepancy } from '../types/retail';

interface ShelfImageViewerProps {
  imageUrl: string;
  isAnalyzing: boolean;
  outOfStockItems: OutOfStockItem[];
  pricingDiscrepancies: PricingDiscrepancy[];
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
}

type OverlayFilter = 'ALL' | 'OOS' | 'PRICING' | 'NONE';

export const ShelfImageViewer: React.FC<ShelfImageViewerProps> = ({
  imageUrl,
  isAnalyzing,
  outOfStockItems,
  pricingDiscrepancies,
  selectedItemId,
  onSelectItem
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [filter, setFilter] = useState<OverlayFilter>('ALL');
  const [hoveredBox, setHoveredBox] = useState<{
    id: string;
    title: string;
    subtitle: string;
    type: 'OOS' | 'PRICE';
    x: number;
    y: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 1));
  const handleResetZoom = () => setZoomLevel(1);

  // Helper to convert 0-1000 normalized coordinates to CSS percentage strings
  const getBoxStyle = (box2d: [number, number, number, number]) => {
    const [ymin, xmin, ymax, xmax] = box2d;
    const top = Math.max(0, Math.min(100, ymin / 10));
    const left = Math.max(0, Math.min(100, xmin / 10));
    const height = Math.max(3, Math.min(100 - top, (ymax - ymin) / 10));
    const width = Math.max(3, Math.min(100 - left, (xmax - xmin) / 10));

    return {
      top: `${top}%`,
      left: `${left}%`,
      height: `${height}%`,
      width: `${width}%`
    };
  };

  const showOos = filter === 'ALL' || filter === 'OOS';
  const showPricing = filter === 'ALL' || filter === 'PRICING';

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
      {/* Top Bar with Overlay Controls & Zoom */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 text-white z-20 relative">
        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            Layers:
          </span>
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
              filter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All ({outOfStockItems.length + pricingDiscrepancies.length})
          </button>
          <button
            onClick={() => setFilter('OOS')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors flex items-center gap-1 ${
              filter === 'OOS'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            OOS Voids ({outOfStockItems.length})
          </button>
          <button
            onClick={() => setFilter('PRICING')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors flex items-center gap-1 ${
              filter === 'PRICING'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            Price Tags ({pricingDiscrepancies.length})
          </button>
          <button
            onClick={() => setFilter('NONE')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'NONE'
                ? 'bg-slate-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Hide
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 text-slate-300">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="p-1.5 rounded-md hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono px-1 min-w-[42px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 2.5}
            className="p-1.5 rounded-md hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        ref={containerRef}
        className="relative w-full aspect-16/10 sm:aspect-16/9 bg-slate-950 overflow-auto flex items-center justify-center cursor-default select-none"
      >
        <div
          className="relative transition-transform duration-200 origin-center max-w-full max-h-full"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Base Retail Shelf Image */}
          <img
            src={imageUrl}
            alt="Retail Store Shelf View"
            className="block w-full h-auto object-contain max-h-[580px] rounded"
          />

          {/* Real-time Scanning Laser Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-laser" />
              <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[1px] flex items-center justify-center">
                <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-medium shadow-2xl flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Gemini Vision 3.8 Flash: Auditing Facings &amp; Bounding Boxes...
                </div>
              </div>
            </div>
          )}

          {/* Bounding Box Overlays (Only visible when not analyzing) */}
          {!isAnalyzing && (
            <div className="absolute inset-0 pointer-events-auto">
              {/* 1. Out-of-Stock and Low-Stock Bounding Boxes */}
              {showOos &&
                outOfStockItems.map((item) => {
                  const isSelected = selectedItemId === item.id;
                  const isLow = item.status === 'LOW_STOCK';
                  const style = getBoxStyle(item.box2d);

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectItem(isSelected ? null : item.id)}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredBox({
                          id: item.id,
                          title: item.productName,
                          subtitle: `${item.status === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Low Stock'} • ${item.estimatedMissingUnits} units missing`,
                          type: 'OOS',
                          x: rect.left + rect.width / 2,
                          y: rect.top
                        });
                      }}
                      onMouseLeave={() => setHoveredBox(null)}
                      className={`absolute cursor-pointer transition-all duration-150 border-2 rounded-md ${
                        isLow
                          ? isSelected
                            ? 'border-amber-400 bg-amber-400/30 shadow-[0_0_12px_rgba(251,191,36,0.8)] z-30'
                            : 'border-amber-400/80 bg-amber-500/15 hover:bg-amber-400/30 hover:border-amber-300'
                          : isSelected
                          ? 'border-rose-500 bg-rose-500/35 shadow-[0_0_16px_rgba(244,63,94,0.9)] z-30'
                          : 'border-rose-500/85 bg-rose-500/15 hover:bg-rose-500/30 hover:border-rose-400'
                      }`}
                      style={style}
                    >
                      {/* Badge tag on top edge */}
                      <span
                        className={`absolute -top-3 left-1 text-[9px] font-mono font-bold px-1 py-0.2 rounded shadow text-white uppercase whitespace-nowrap ${
                          isLow ? 'bg-amber-600' : 'bg-rose-600'
                        }`}
                      >
                        {isLow ? 'LOW' : 'OOS'} -{item.estimatedMissingUnits}
                      </span>
                    </div>
                  );
                })}

              {/* 2. Pricing Discrepancies Bounding Boxes */}
              {showPricing &&
                pricingDiscrepancies.map((item) => {
                  if (!item.box2d) return null;
                  const isSelected = selectedItemId === item.id;
                  const style = getBoxStyle(item.box2d);

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectItem(isSelected ? null : item.id)}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredBox({
                          id: item.id,
                          title: item.productName,
                          subtitle: `Shelf: ${item.shelfTagPrice} vs Catalog: ${item.expectedCatalogPrice}`,
                          type: 'PRICE',
                          x: rect.left + rect.width / 2,
                          y: rect.top
                        });
                      }}
                      onMouseLeave={() => setHoveredBox(null)}
                      className={`absolute cursor-pointer transition-all duration-150 border-2 rounded-md ${
                        isSelected
                          ? 'border-purple-400 bg-purple-500/35 shadow-[0_0_15px_rgba(192,132,252,0.9)] z-30'
                          : 'border-purple-400/80 bg-purple-500/20 hover:bg-purple-400/35 hover:border-purple-300'
                      }`}
                      style={style}
                    >
                      <span className="absolute -top-3 left-1 text-[9px] font-mono font-bold px-1 py-0.2 rounded shadow text-white uppercase whitespace-nowrap bg-purple-700">
                        {item.issueType.replace('_', ' ')}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredBox && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full mb-2 px-3 py-1.5 rounded-lg bg-slate-900/95 border border-slate-700 text-white text-xs shadow-2xl backdrop-blur-md"
          style={{ left: hoveredBox.x, top: hoveredBox.y - 8 }}
        >
          <div className="font-bold flex items-center gap-1.5">
            {hoveredBox.type === 'OOS' ? (
              <PackageX className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            ) : (
              <Tag className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            )}
            <span className="truncate max-w-[220px]">{hoveredBox.title}</span>
          </div>
          <div className="text-[11px] text-slate-300 mt-0.5">{hoveredBox.subtitle}</div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          Click any highlighted bounding box to jump to item details &amp; restock actions.
        </span>
        <span className="hidden sm:inline font-mono text-[10px] text-slate-500">
          Coordinates normalized [0-1000]
        </span>
      </div>
    </div>
  );
};
