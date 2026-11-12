import { SampleShelfScenario } from '../types/retail';

export const SAMPLE_SHELVES: SampleShelfScenario[] = [
  {
    id: 'shelf-snacks',
    title: 'Snack Foods & Artisan Chips',
    category: 'Snack Foods',
    aisle: 'Aisle 04 • Bay 03',
    store: 'Store #104 - Downtown Flagship',
    description: 'High velocity potato crisps, kettle chips, and extruded corn snacks with empty facing voids and promotional sale tags.',
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80',
    defaultData: {
      complianceScore: 78.5,
      complianceStatus: 'NEEDS_ATTENTION',
      executiveSummary: 'Audit of Aisle 04 completed. 3 critical out-of-stock facing voids detected in high-margin kettle chips. 2 promotional shelf-tag discrepancies causing margin erosion, and 4 misplaced SKU facings on Tier 2 eye-level.',
      storeLocation: 'Aisle 04 • Store #104 - Downtown Flagship',
      detectedCategories: ['Potato Chips', 'Tortilla Chips', 'Pretzels', 'Extruded Snacks'],
      shelvesCount: 4,
      planogramAnalysis: {
        totalExpectedFacings: 42,
        actualCompliantFacings: 33,
        misplacedItemsCount: 4,
        facingAccuracyPercentage: 78.5,
        shelfBreakdown: [
          {
            shelfNumber: 1,
            shelfTier: 'Top Shelf (Specialty & Organic)',
            complianceRate: 92.0,
            status: 'COMPLIANT',
            notes: 'Facing alignment intact. Minor spacing gap on far right artisan lentil crisps.'
          },
          {
            shelfNumber: 2,
            shelfTier: 'Eye Level (High Velocity Movers)',
            complianceRate: 64.0,
            status: 'CRITICAL_VIOLATION',
            notes: 'Severe void detected in slots 4-6. Neighboring brand encroaching into empty facing.'
          },
          {
            shelfNumber: 3,
            shelfTier: 'Waist Level (Core Brands)',
            complianceRate: 77.0,
            status: 'NEEDS_ATTENTION',
            notes: 'Two items placed backwards with barcode facing outward; one expired promotional talker.'
          },
          {
            shelfNumber: 4,
            shelfTier: 'Base Deck (Value & Party Packs)',
            complianceRate: 81.0,
            status: 'NEEDS_ATTENTION',
            notes: 'Stock low on family party size bags. Facings pulled forward unevenly.'
          }
        ]
      },
      outOfStockItems: [
        {
          id: 'oos-s1',
          productName: 'Kettle Cooked Jalapeno Chips 8.5oz',
          brand: 'Artisan Crisp Co.',
          category: 'Snack Foods',
          status: 'OUT_OF_STOCK',
          estimatedMissingUnits: 14,
          priority: 'CRITICAL',
          shelfLocation: 'Shelf 2 (Eye-Level), Slot 4-5',
          box2d: [260, 310, 480, 520],
          recommendedAction: 'Pull 2 master cases (14 units) from Backroom Reserve Bay 08.'
        },
        {
          id: 'oos-s2',
          productName: 'Sea Salt & Vinegar Potato Crisps 7oz',
          brand: 'Valley Farms',
          category: 'Snack Foods',
          status: 'LOW_STOCK',
          estimatedMissingUnits: 8,
          priority: 'HIGH',
          shelfLocation: 'Shelf 2 (Eye-Level), Slot 8',
          box2d: [275, 710, 480, 890],
          recommendedAction: 'Front and face remaining 2 units; flag automatic reorder in inventory system.'
        },
        {
          id: 'oos-s3',
          productName: 'Aged White Cheddar Popcorn 6oz',
          brand: 'SmartSnack Pure',
          category: 'Snack Foods',
          status: 'OUT_OF_STOCK',
          estimatedMissingUnits: 11,
          priority: 'MEDIUM',
          shelfLocation: 'Shelf 3 (Waist-Level), Slot 2',
          box2d: [520, 110, 715, 290],
          recommendedAction: 'Verify backroom inventory; unallocated stock may be on cart in staging.'
        }
      ],
      pricingDiscrepancies: [
        {
          id: 'price-s1',
          productName: 'Kettle Cooked Jalapeno Chips',
          shelfTagPrice: '$3.49 (Sale)',
          expectedCatalogPrice: '$4.29 (Regular)',
          variance: '-$0.80',
          issueType: 'EXPIRED_PROMO',
          severity: 'HIGH',
          shelfLocation: 'Shelf 2, Tag Slot 4',
          box2d: [480, 330, 525, 420],
          actionRequired: 'Promo tag expired Tuesday midnight. Remove promotional yellow talker and replace with $4.29 regular tag.'
        },
        {
          id: 'price-s2',
          productName: 'Baked Barbecue Crisps',
          shelfTagPrice: 'MISSING TAG',
          expectedCatalogPrice: '$3.99',
          variance: 'N/A',
          issueType: 'MISSING_TAG',
          severity: 'MEDIUM',
          shelfLocation: 'Shelf 3, Tag Slot 6',
          box2d: [720, 620, 765, 710],
          actionRequired: 'Shelf channel label missing. Print and insert adhesive electronic shelf tag.'
        }
      ],
      actionList: [
        {
          id: 'act-s1',
          title: 'Restock Jalapeno Chips 8.5oz (14 units)',
          type: 'RESTOCK',
          priority: 'URGENT',
          assignedRole: 'Inventory Associate (Jake M.)',
          location: 'Aisle 04 • Shelf 2 Bay 3',
          estimatedMinutes: 8,
          details: 'Retrieve 2 cases (14 units) from Backroom Bay 08. Ensure FIFO rotation and front-facing.',
          status: 'PENDING'
        },
        {
          id: 'act-s2',
          title: 'Remove Expired Promotional Tag #4491',
          type: 'RETAG',
          priority: 'HIGH',
          assignedRole: 'Pricing Coordinator (Sarah T.)',
          location: 'Aisle 04 • Shelf 2 Tag Channel',
          estimatedMinutes: 3,
          details: 'Audit channel price tag. Replace $3.49 promo card with current ERP catalog price $4.29.',
          status: 'PENDING'
        },
        {
          id: 'act-s3',
          title: 'Correct Misplaced Facing & Facing Pull',
          type: 'REPOSITION',
          priority: 'MEDIUM',
          assignedRole: 'Merchandising Lead (David K.)',
          location: 'Aisle 04 • Shelf 3 Center',
          estimatedMinutes: 5,
          details: '4 units of competitor SKU drifted into slot 6. Move back to adjacent bay and pull facings forward.',
          status: 'IN_PROGRESS'
        },
        {
          id: 'act-s4',
          title: 'Print Replacement Channel Tag for Slot 6',
          type: 'RETAG',
          priority: 'LOW',
          assignedRole: 'Pricing Coordinator (Sarah T.)',
          location: 'Aisle 04 • Shelf 3 Bay 4',
          estimatedMinutes: 4,
          details: 'Print new barcode strip label from handheld Zebra printer and clip into shelf channel.',
          status: 'PENDING'
        }
      ],
      meta: {
        executionTimeMs: 1340,
        model: 'gemini-3.8-flash',
        isSimulation: false,
        timestamp: new Date().toISOString(),
        systemInstruction: 'ShelfIQ Retail Computer Vision & Planogram Compliance Engine',
        promptSent: 'Analyze this retail store shelf image for Store: "Store #104 - Downtown Flagship", Location: "Aisle 04 - Snack Foods"...',
        usageMetadata: {
          promptTokenCount: 1120,
          candidatesTokenCount: 840,
          totalTokenCount: 1960
        }
      }
    }
  },
  {
    id: 'shelf-beverage',
    title: 'Chilled Beverages & Energy Drinks',
    category: 'Chilled Beverages',
    aisle: 'Cooler 02 • Wall Vault',
    store: 'Store #104 - Downtown Flagship',
    description: 'Glass-door refrigerated merchandiser containing craft sodas, cold brews, and sparkling botanical water cans.',
    imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1200&q=80',
    defaultData: {
      complianceScore: 91.2,
      complianceStatus: 'COMPLIANT',
      executiveSummary: 'Cooler 02 in excellent condition. High facings compliance (91.2%). Single out-of-stock spot on bottom shelf cold brew; 1 pricing tag mismatch on organic ginger tonic.',
      storeLocation: 'Cooler 02 • Store #104 - Downtown Flagship',
      detectedCategories: ['Cold Brew Coffee', 'Sparkling Tonics', 'Kombucha', 'Natural Sodas'],
      shelvesCount: 5,
      planogramAnalysis: {
        totalExpectedFacings: 50,
        actualCompliantFacings: 46,
        misplacedItemsCount: 1,
        facingAccuracyPercentage: 91.2,
        shelfBreakdown: [
          { shelfNumber: 1, shelfTier: 'Top Shelf (Craft Sodas)', complianceRate: 96.0, status: 'COMPLIANT', notes: 'Perfect alignment; glide racks gliding smoothly.' },
          { shelfNumber: 2, shelfTier: 'Upper Eye Level (Functional Waters)', complianceRate: 94.0, status: 'COMPLIANT', notes: 'All facings fronted.' },
          { shelfNumber: 3, shelfTier: 'Lower Eye Level (Cold Brews)', complianceRate: 88.0, status: 'COMPLIANT', notes: 'One facing pushed back 3 cans deep.' },
          { shelfNumber: 4, shelfTier: 'Waist Level (Probiotic Drinks)', complianceRate: 90.0, status: 'COMPLIANT', notes: 'Minor tag tilt on slot 3.' },
          { shelfNumber: 5, shelfTier: 'Base Shelf (Multi-Packs)', complianceRate: 84.0, status: 'NEEDS_ATTENTION', notes: 'Empty slot where 4-pack nitro brew belongs.' }
        ]
      },
      outOfStockItems: [
        {
          id: 'oos-b1',
          productName: 'Nitro Cold Brew Dark Roast 4-Pack',
          brand: 'Roastworks',
          category: 'Chilled Beverages',
          status: 'OUT_OF_STOCK',
          estimatedMissingUnits: 6,
          priority: 'HIGH',
          shelfLocation: 'Shelf 5 (Base Deck), Slot 2',
          box2d: [760, 220, 940, 420],
          recommendedAction: 'Pull 1 carton from Walk-in Cooler Rack B-2.'
        }
      ],
      pricingDiscrepancies: [
        {
          id: 'price-b1',
          productName: 'Sparkling Ginger Lime Tonic 12oz',
          shelfTagPrice: '$2.99',
          expectedCatalogPrice: '$3.49',
          variance: '-$0.50',
          issueType: 'TAG_MISMATCH',
          severity: 'MEDIUM',
          shelfLocation: 'Shelf 2, Slot 5',
          box2d: [380, 520, 415, 600],
          actionRequired: 'Update electronic shelf label to match nationwide catalog price of $3.49.'
        }
      ],
      actionList: [
        {
          id: 'act-b1',
          title: 'Replenish Nitro Cold Brew 4-Packs',
          type: 'RESTOCK',
          priority: 'HIGH',
          assignedRole: 'Cooler Stocker (Elena R.)',
          location: 'Cooler 02 • Shelf 5',
          estimatedMinutes: 6,
          details: 'Restock 6 units from Walk-in Cooler Rack B-2; rotate oldest stock to front.',
          status: 'PENDING'
        },
        {
          id: 'act-b2',
          title: 'Update Ginger Lime Tonic Price Tag',
          type: 'RETAG',
          priority: 'MEDIUM',
          assignedRole: 'Pricing Coordinator (Sarah T.)',
          location: 'Cooler 02 • Shelf 2',
          estimatedMinutes: 2,
          details: 'Transmit wireless update to electronic tag #7712.',
          status: 'PENDING'
        }
      ],
      meta: {
        executionTimeMs: 1190,
        model: 'gemini-3.8-flash',
        isSimulation: false,
        timestamp: new Date().toISOString(),
        systemInstruction: 'ShelfIQ Retail Computer Vision & Planogram Compliance Engine',
        usageMetadata: { promptTokenCount: 980, candidatesTokenCount: 710, totalTokenCount: 1690 }
      }
    }
  },
  {
    id: 'shelf-cereal',
    title: 'Breakfast Cereals & Whole Grains',
    category: 'Breakfast & Pantry',
    aisle: 'Aisle 07 • Bay 02',
    store: 'Store #208 - Metro West',
    description: 'Dry cereal boxes, granolas, and rolled oats with multiple gaps and overhanging promotional tags.',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    defaultData: {
      complianceScore: 68.4,
      complianceStatus: 'CRITICAL_VIOLATION',
      executiveSummary: 'Significant planogram deviations in Aisle 07. Compliance at 68.4%. Multiple empty facings on family favorite cereals and mismatched price flags from last week promo circular.',
      storeLocation: 'Aisle 07 • Store #208 - Metro West',
      detectedCategories: ['Toasted Flakes', 'Granola Clusters', 'Oat Bran', 'Kid Cereals'],
      shelvesCount: 4,
      planogramAnalysis: {
        totalExpectedFacings: 36,
        actualCompliantFacings: 24,
        misplacedItemsCount: 6,
        facingAccuracyPercentage: 68.4,
        shelfBreakdown: [
          { shelfNumber: 1, shelfTier: 'Top Shelf (Health & Adult Cereals)', complianceRate: 75.0, status: 'NEEDS_ATTENTION', notes: 'Gaps between bran flaked SKUs.' },
          { shelfNumber: 2, shelfTier: 'Eye Level (Popular Brand Cereals)', complianceRate: 58.0, status: 'CRITICAL_VIOLATION', notes: 'Wide empty void in middle 3 slots. Competitor box double-faced illegally.' },
          { shelfNumber: 3, shelfTier: 'Waist Level (Kids Sweet Cereals)', complianceRate: 72.0, status: 'NEEDS_ATTENTION', notes: 'Disordered facings and turned boxes.' },
          { shelfNumber: 4, shelfTier: 'Base Deck (Oatmeal & Bulk Bags)', complianceRate: 68.0, status: 'NEEDS_ATTENTION', notes: 'Low stock on 32oz rolled oats.' }
        ]
      },
      outOfStockItems: [
        {
          id: 'oos-c1',
          productName: 'Honey Almond Crunch Cereal 18oz',
          brand: 'Sunrise Harvest',
          category: 'Breakfast & Pantry',
          status: 'OUT_OF_STOCK',
          estimatedMissingUnits: 16,
          priority: 'CRITICAL',
          shelfLocation: 'Shelf 2 (Eye-Level), Slot 3-4',
          box2d: [280, 240, 520, 540],
          recommendedAction: 'Full shelf replenishment: 2 cases from Reserve Row 3.'
        },
        {
          id: 'oos-c2',
          productName: 'Ancient Grain Granola Clusters 12oz',
          brand: 'PureOrigins',
          category: 'Breakfast & Pantry',
          status: 'OUT_OF_STOCK',
          estimatedMissingUnits: 10,
          priority: 'HIGH',
          shelfLocation: 'Shelf 1, Slot 6',
          box2d: [80, 680, 260, 880],
          recommendedAction: 'Check top-stock riser or order from warehouse.'
        }
      ],
      pricingDiscrepancies: [
        {
          id: 'price-c1',
          productName: 'Honey Almond Crunch Cereal',
          shelfTagPrice: '$2.99 (BOGO Promo)',
          expectedCatalogPrice: '$4.79 (Regular)',
          variance: '-$1.80',
          issueType: 'EXPIRED_PROMO',
          severity: 'HIGH',
          shelfLocation: 'Shelf 2, Slot 3',
          box2d: [520, 290, 560, 390],
          actionRequired: 'Remove obsolete BOGO promotional blade.'
        }
      ],
      actionList: [
        {
          id: 'act-c1',
          title: 'Emergency Restock Honey Almond Crunch (16 units)',
          type: 'RESTOCK',
          priority: 'URGENT',
          assignedRole: 'Inventory Associate (Marco P.)',
          location: 'Aisle 07 • Shelf 2',
          estimatedMinutes: 10,
          details: 'Retrieve 2 cases from Backroom Reserve Row 3; reset facings to 3-wide.',
          status: 'PENDING'
        },
        {
          id: 'act-c2',
          title: 'Strip Expired BOGO Promo Blade',
          type: 'RETAG',
          priority: 'HIGH',
          assignedRole: 'Pricing Lead (Sarah T.)',
          location: 'Aisle 07 • Shelf 2 Channel',
          estimatedMinutes: 2,
          details: 'Remove cardboard sale blade and check base digital price tag.',
          status: 'PENDING'
        }
      ],
      meta: {
        executionTimeMs: 1410,
        model: 'gemini-3.8-flash',
        isSimulation: false,
        timestamp: new Date().toISOString(),
        usageMetadata: { promptTokenCount: 1190, candidatesTokenCount: 890, totalTokenCount: 2080 }
      }
    }
  },
  {
    id: 'shelf-health',
    title: 'Health, Beauty & Skincare',
    category: 'Personal Care',
    aisle: 'Aisle 12 • Bay 01',
    store: 'Store #104 - Downtown Flagship',
    description: 'High-value skincare lotions, moisturizers, and sunscreens with anti-theft fixtures and shelf pusher trays.',
    imageUrl: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=1200&q=80',
    defaultData: {
      complianceScore: 86.0,
      complianceStatus: 'NEEDS_ATTENTION',
      executiveSummary: 'Personal care audit indicates strong facing discipline (86.0%). One high-ticket anti-aging serum out of stock in locking case; 1 price tag missing on SPF 50 sunscreen.',
      storeLocation: 'Aisle 12 • Store #104 - Downtown Flagship',
      detectedCategories: ['Hydrating Serums', 'Day Lotions', 'SPF Sunscreens', 'Cleansers'],
      shelvesCount: 4,
      planogramAnalysis: {
        totalExpectedFacings: 28,
        actualCompliantFacings: 24,
        misplacedItemsCount: 2,
        facingAccuracyPercentage: 86.0,
        shelfBreakdown: [
          { shelfNumber: 1, shelfTier: 'Top Shelf (Premium Serums)', complianceRate: 80.0, status: 'NEEDS_ATTENTION', notes: 'Locking keeper empty for 1 SKU.' },
          { shelfNumber: 2, shelfTier: 'Eye Level (Daily Moisturizers)', complianceRate: 92.0, status: 'COMPLIANT', notes: 'Spring pushers functioning properly.' },
          { shelfNumber: 3, shelfTier: 'Waist Level (Sunscreens & SPF)', complianceRate: 85.0, status: 'COMPLIANT', notes: '1 tag peeled off shelf channel.' },
          { shelfNumber: 4, shelfTier: 'Base Shelf (Value Cleansers)', complianceRate: 88.0, status: 'COMPLIANT', notes: 'Good alignment and stock depth.' }
        ]
      },
      outOfStockItems: [
        {
          id: 'oos-h1',
          productName: 'Hyaluronic Peptide Night Serum 1.7oz',
          brand: 'DermaLuxe Botanics',
          category: 'Personal Care',
          status: 'OUT_OF_STOCK',
          estimatedMissingUnits: 4,
          priority: 'HIGH',
          shelfLocation: 'Shelf 1 (Top Shelf, Security Case), Slot 3',
          box2d: [120, 410, 310, 580],
          recommendedAction: 'Keyholder required: Retrieve 4 units from high-security lockup cage.'
        }
      ],
      pricingDiscrepancies: [
        {
          id: 'price-h1',
          productName: 'Mineral Broad Spectrum SPF 50',
          shelfTagPrice: 'MISSING TAG',
          expectedCatalogPrice: '$18.99',
          variance: 'N/A',
          issueType: 'MISSING_TAG',
          severity: 'HIGH',
          shelfLocation: 'Shelf 3, Slot 4',
          box2d: [680, 480, 725, 590],
          actionRequired: 'High price item missing tag. Customers asking staff for price check. Print new tag immediately.'
        }
      ],
      actionList: [
        {
          id: 'act-h1',
          title: 'Stock Peptide Night Serum from High-Value Lockup',
          type: 'RESTOCK',
          priority: 'HIGH',
          assignedRole: 'Assistant Store Manager (Keyholder)',
          location: 'Aisle 12 • Security Case',
          estimatedMinutes: 5,
          details: 'Retrieve 4 boxes from lockup cage and insert into security acrylic keeper.',
          status: 'PENDING'
        },
        {
          id: 'act-h2',
          title: 'Print Shelf Tag for Mineral SPF 50',
          type: 'RETAG',
          priority: 'HIGH',
          assignedRole: 'Pricing Coordinator (Sarah T.)',
          location: 'Aisle 12 • Shelf 3 Channel',
          estimatedMinutes: 3,
          details: 'Generate $18.99 barcode shelf label.',
          status: 'PENDING'
        }
      ],
      meta: {
        executionTimeMs: 1280,
        model: 'gemini-3.8-flash',
        isSimulation: false,
        timestamp: new Date().toISOString(),
        usageMetadata: { promptTokenCount: 1040, candidatesTokenCount: 760, totalTokenCount: 1800 }
      }
    }
  }
];
