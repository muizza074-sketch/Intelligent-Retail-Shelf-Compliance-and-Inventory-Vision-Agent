import { HistoricalAudit } from '../types/retail';

export const HISTORICAL_AUDITS: HistoricalAudit[] = [
  {
    id: 'AUD-8821',
    date: '2026-11-11 16:45',
    storeId: 'store-104',
    storeName: 'Store #104 - Downtown Flagship',
    aisle: 'Aisle 04 (Snack Foods)',
    category: 'Snack Foods',
    complianceScore: 78.5,
    oosCount: 3,
    pricingErrorsCount: 2,
    status: 'NEEDS_ATTENTION',
    auditor: 'Store Associate M. Chen',
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'AUD-8820',
    date: '2026-11-11 14:15',
    storeId: 'store-104',
    storeName: 'Store #104 - Downtown Flagship',
    aisle: 'Cooler 02 (Chilled Beverages)',
    category: 'Chilled Beverages',
    complianceScore: 91.2,
    oosCount: 1,
    pricingErrorsCount: 1,
    status: 'COMPLIANT',
    auditor: 'Shift Mgr. D. Ross',
    imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'AUD-8819',
    date: '2026-11-10 11:30',
    storeId: 'store-208',
    storeName: 'Store #208 - Metro West',
    aisle: 'Aisle 07 (Breakfast Cereals)',
    category: 'Breakfast & Pantry',
    complianceScore: 68.4,
    oosCount: 2,
    pricingErrorsCount: 1,
    status: 'CRITICAL_VIOLATION',
    auditor: 'Inventory Specialist T. Diaz',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'AUD-8818',
    date: '2026-11-10 09:20',
    storeId: 'store-104',
    storeName: 'Store #104 - Downtown Flagship',
    aisle: 'Aisle 12 (Skincare & Health)',
    category: 'Personal Care',
    complianceScore: 86.0,
    oosCount: 1,
    pricingErrorsCount: 1,
    status: 'NEEDS_ATTENTION',
    auditor: 'Store Associate M. Chen',
    imageUrl: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'AUD-8817',
    date: '2026-11-09 17:10',
    storeId: 'store-104',
    storeName: 'Store #104 - Downtown Flagship',
    aisle: 'Aisle 02 (Condiments & Sauces)',
    category: 'Pantry',
    complianceScore: 89.4,
    oosCount: 2,
    pricingErrorsCount: 0,
    status: 'COMPLIANT',
    auditor: 'Merchandise Lead A. Patel'
  },
  {
    id: 'AUD-8816',
    date: '2026-11-08 15:00',
    storeId: 'store-315',
    storeName: 'Store #315 - Suburban Hub',
    aisle: 'Aisle 05 (Canned Goods)',
    category: 'Pantry',
    complianceScore: 74.0,
    oosCount: 4,
    pricingErrorsCount: 3,
    status: 'NEEDS_ATTENTION',
    auditor: 'Shift Mgr. L. Vance'
  },
  {
    id: 'AUD-8815',
    date: '2026-11-07 10:45',
    storeId: 'store-104',
    storeName: 'Store #104 - Downtown Flagship',
    aisle: 'Aisle 09 (Baking & Flour)',
    category: 'Baking',
    complianceScore: 94.5,
    oosCount: 0,
    pricingErrorsCount: 0,
    status: 'COMPLIANT',
    auditor: 'Store Associate M. Chen'
  },
  {
    id: 'AUD-8814',
    date: '2026-11-06 13:20',
    storeId: 'store-208',
    storeName: 'Store #208 - Metro West',
    aisle: 'Aisle 03 (Pasta & Grains)',
    category: 'Pantry',
    complianceScore: 82.1,
    oosCount: 2,
    pricingErrorsCount: 1,
    status: 'NEEDS_ATTENTION',
    auditor: 'Inventory Specialist T. Diaz'
  },
  {
    id: 'AUD-8813',
    date: '2026-11-05 16:30',
    storeId: 'store-104',
    storeName: 'Store #104 - Downtown Flagship',
    aisle: 'Cooler 01 (Dairy & Milk)',
    category: 'Dairy',
    complianceScore: 79.8,
    oosCount: 3,
    pricingErrorsCount: 1,
    status: 'NEEDS_ATTENTION',
    auditor: 'Shift Mgr. D. Ross'
  },
  {
    id: 'AUD-8812',
    date: '2026-11-04 11:15',
    storeId: 'store-315',
    storeName: 'Store #315 - Suburban Hub',
    aisle: 'Aisle 01 (Bakery & Breads)',
    category: 'Bakery',
    complianceScore: 92.0,
    oosCount: 1,
    pricingErrorsCount: 0,
    status: 'COMPLIANT',
    auditor: 'Merchandise Lead A. Patel'
  }
];

export const CATEGORY_ANALYTICS = [
  { name: 'Snack Foods', compliance: 82, oosRate: 7.2, audits: 48, pricingAccuracy: 94 },
  { name: 'Chilled Beverages', compliance: 90, oosRate: 3.8, audits: 62, pricingAccuracy: 98 },
  { name: 'Breakfast & Cereals', compliance: 74, oosRate: 11.5, audits: 39, pricingAccuracy: 89 },
  { name: 'Personal Care & Beauty', compliance: 88, oosRate: 4.6, audits: 45, pricingAccuracy: 93 },
  { name: 'Dairy & Eggs', compliance: 84, oosRate: 6.1, audits: 58, pricingAccuracy: 96 },
  { name: 'Pantry & Canned', compliance: 86, oosRate: 5.4, audits: 51, pricingAccuracy: 97 }
];

export const TREND_DATA_30D = [
  { day: 'Day 1', score: 76, oos: 14, pricing: 8 },
  { day: 'Day 5', score: 79, oos: 12, pricing: 7 },
  { day: 'Day 10', score: 81, oos: 9, pricing: 5 },
  { day: 'Day 15', score: 78, oos: 11, pricing: 6 },
  { day: 'Day 20', score: 85, oos: 7, pricing: 4 },
  { day: 'Day 25', score: 83, oos: 8, pricing: 3 },
  { day: 'Today', score: 87, oos: 5, pricing: 2 }
];

export const PRICING_ERROR_DISTRIBUTION = [
  { type: 'Expired Promotional Tags', count: 42, percentage: 46, color: '#f59e0b' },
  { type: 'Missing Shelf Channel Tags', count: 26, percentage: 29, color: '#ef4444' },
  { type: 'Barcode / SKU Mismatch', count: 14, percentage: 15, color: '#8b5cf6' },
  { type: 'Price Overcharge Discrepancy', count: 9, percentage: 10, color: '#3b82f6' }
];
