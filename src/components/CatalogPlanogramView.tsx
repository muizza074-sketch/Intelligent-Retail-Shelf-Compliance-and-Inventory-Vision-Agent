import React from 'react';
import {
  BookOpen,
  Layers,
  Tag,
  CheckCircle2,
  AlertCircle,
  Package,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const CatalogPlanogramView: React.FC = () => {
  const planogramTiers = [
    {
      tierNumber: 1,
      name: 'Tier 1: Top Shelf (Specialty & Organic)',
      targetFacings: 8,
      guideline: 'Single facing per SKU. Fronted with minimum 4 units depth. Lentil & veggie crisps on left, artisan popcorn on right.',
      skus: [
        { name: 'Artisan Lentil Crisps 5oz', upc: '08492019482', price: '$4.49', status: 'Optimal' },
        { name: 'Organic Blue Corn Tortilla 10oz', upc: '08492019483', price: '$4.99', status: 'Optimal' },
        { name: 'Avocado Oil Sea Salt Chips 6oz', upc: '08492019484', price: '$5.29', status: 'Optimal' }
      ]
    },
    {
      tierNumber: 2,
      name: 'Tier 2: Eye Level (High-Velocity Revenue Drivers)',
      targetFacings: 14,
      guideline: 'CRITICAL ZONE: Prime merchandising eye-level (48"-58" above floor). Strict 2-3 facings per SKU. Never allow adjacent competitor encroachment into voids.',
      skus: [
        { name: 'Kettle Cooked Jalapeno Chips 8.5oz', upc: '07119283741', price: '$4.29', status: 'High Void Risk' },
        { name: 'Sea Salt & Vinegar Potato Crisps 7oz', upc: '07119283742', price: '$3.99', status: 'Low Stock' },
        { name: 'Habanero Cheddar Waves 8oz', upc: '07119283743', price: '$4.29', status: 'Optimal' }
      ]
    },
    {
      tierNumber: 3,
      name: 'Tier 3: Waist Level (Core National Brands)',
      targetFacings: 12,
      guideline: 'Standard family snack assortment. Price tag channels must strictly reflect Tuesday ERP catalog prices. Remove expired sale tags by 00:00 Wednesday.',
      skus: [
        { name: 'Aged White Cheddar Popcorn 6oz', upc: '06228394811', price: '$3.79', status: 'Optimal' },
        { name: 'Baked Barbecue Crisps 7.5oz', upc: '06228394812', price: '$3.99', status: 'Missing Channel Tag' },
        { name: 'Classic Salted Pretzels 16oz', upc: '06228394813', price: '$3.49', status: 'Optimal' }
      ]
    },
    {
      tierNumber: 4,
      name: 'Tier 4: Base Deck (Bulk & Party Size Packs)',
      targetFacings: 8,
      guideline: 'Heavy party bags (16oz+). Stacked 2-high maximum. Floor sweeps required between shifts.',
      skus: [
        { name: 'Party Size Classic Waves 15oz', upc: '05118273641', price: '$5.99', status: 'Optimal' },
        { name: 'Mega Cheddar Party Barrel 20oz', upc: '05118273642', price: '$6.49', status: 'Optimal' }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Planogram Master Catalog Rules (Aisle 04)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            HQ Merchandising blueprint specifications used by the computer vision audit engine.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            HQ Verified Q4-2026
          </span>
        </div>
      </div>

      {/* Tier Grid */}
      <div className="space-y-4">
        {planogramTiers.map((tier) => (
          <div
            key={tier.tierNumber}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-mono font-bold flex items-center justify-center text-xs">
                  T{tier.tierNumber}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {tier.name}
                  </h3>
                  <span className="text-xs text-slate-400">
                    Target Facings: {tier.targetFacings} units
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              {tier.guideline}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-2">SKU Item Description</th>
                    <th className="pb-2">Barcode UPC</th>
                    <th className="pb-2">Target Price</th>
                    <th className="pb-2">Shelf Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {tier.skus.map((sku) => (
                    <tr key={sku.upc}>
                      <td className="py-2.5 font-medium text-slate-900 dark:text-white">
                        {sku.name}
                      </td>
                      <td className="py-2.5 font-mono text-slate-400">{sku.upc}</td>
                      <td className="py-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {sku.price}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            sku.status === 'Optimal'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {sku.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
