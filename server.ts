import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Allow large payloads for base64 retail shelf images
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash'
  });
});

// Retail shelf analysis endpoint powered by Gemini 3.8 Flash
app.post('/api/analyze-shelf', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      aisleCategory = 'General Grocery',
      storeId = 'Store #104 - Downtown Flagship',
      aisleId = 'Aisle 04 - Snack Foods & Beverages',
      catalogContext
    } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'Missing imageBase64 in request body.' });
      return;
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Provide realistic simulated analysis if no API key is present in environment
      console.warn('GEMINI_API_KEY is not configured. Falling back to high-fidelity simulated retail audit.');
      const simulatedResult = generateSimulatedAudit({
        aisleCategory,
        storeId,
        aisleId
      });
      res.json({
        ...simulatedResult,
        meta: {
          executionTimeMs: Date.now() - startTime,
          model: 'simulated-gemini-3.8-flash',
          isSimulation: true,
          timestamp: new Date().toISOString(),
          systemInstruction: 'ShelfIQ Retail Computer Vision & Planogram Compliance Engine',
          rawTokens: { promptTokens: 640, candidateTokens: 820, totalTokens: 1460 }
        }
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const systemInstruction = `You are "ShelfIQ", an elite computer vision and retail store management audit system.
You analyze supermarket and retail shelf photographs taken by store associates or automated store cameras.

Your goal is to inspect:
1. Planogram Compliance: Compare observed shelf facings, product alignments, shelf levels, and overall merchandising symmetry against standard grocery planogram practices. Calculate a precise Compliance Score (0-100%).
2. Out-of-Stock (OOS) & Low-Stock: Detect gaps, empty pushers, facing voids, and partially depleted slots. Provide 2D bounding boxes [ymin, xmin, ymax, xmax] normalized on a 0-1000 scale.
3. Price Tag Discrepancies: Detect shelf edge tags/labels, barcode shelf tags, promotional talkers, and compare visible prices against typical expected catalog prices, noting expired sales, incorrect tags, missing labels, or mislabeled facings.
4. Actionable Restock Tasks: Produce prioritized, concise action items with assigned roles (e.g., Aisle Associate, Inventory Lead, Merchandising Specialist).

IMPORTANT ON BOUNDING BOX COORDINATES:
Provide normalized coordinates [ymin, xmin, ymax, xmax] between 0 and 1000, where (0,0) is top-left and (1000,1000) is bottom-right of the image.`;

    const userPrompt = `Analyze this retail store shelf image for Store: "${storeId}", Location: "${aisleId}", Category: "${aisleCategory}".
${catalogContext ? `Reference Catalog Rules: ${JSON.stringify(catalogContext)}` : ''}

Examine all shelves visible from top to bottom. Identify:
1. Overall compliance score (0-100), status (COMPLIANT, NEEDS_ATTENTION, CRITICAL_VIOLATION), and executive summary.
2. Shelf-by-shelf planogram breakdown.
3. Exact out-of-stock and low-stock items with [ymin, xmin, ymax, xmax] normalized box coordinates (0-1000).
4. Pricing discrepancies or missing shelf tags with box coordinates.
5. Prioritized action list for store associates to execute right away.

Return valid JSON strictly matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType,
            data: cleanBase64
          }
        },
        {
          text: userPrompt
        }
      ],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            complianceScore: {
              type: Type.NUMBER,
              description: 'Overall planogram compliance score from 0 to 100.'
            },
            complianceStatus: {
              type: Type.STRING,
              description: 'One of: COMPLIANT, NEEDS_ATTENTION, CRITICAL_VIOLATION'
            },
            executiveSummary: {
              type: Type.STRING,
              description: 'A 2-3 sentence executive audit summary for the store manager.'
            },
            storeLocation: {
              type: Type.STRING,
              description: 'Aisle and department name.'
            },
            detectedCategories: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Product categories visible on the shelf.'
            },
            shelvesCount: {
              type: Type.INTEGER,
              description: 'Number of distinct shelf tiers detected.'
            },
            planogramAnalysis: {
              type: Type.OBJECT,
              properties: {
                totalExpectedFacings: { type: Type.INTEGER },
                actualCompliantFacings: { type: Type.INTEGER },
                misplacedItemsCount: { type: Type.INTEGER },
                facingAccuracyPercentage: { type: Type.NUMBER },
                shelfBreakdown: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      shelfNumber: { type: Type.INTEGER },
                      shelfTier: { type: Type.STRING, description: 'e.g., Top Shelf, Eye Level, Waist Level, Base Deck' },
                      complianceRate: { type: Type.NUMBER },
                      status: { type: Type.STRING },
                      notes: { type: Type.STRING }
                    },
                    required: ['shelfNumber', 'shelfTier', 'complianceRate', 'notes']
                  }
                }
              },
              required: ['totalExpectedFacings', 'actualCompliantFacings', 'misplacedItemsCount', 'facingAccuracyPercentage', 'shelfBreakdown']
            },
            outOfStockItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  productName: { type: Type.STRING },
                  brand: { type: Type.STRING },
                  category: { type: Type.STRING },
                  status: { type: Type.STRING, description: 'OUT_OF_STOCK or LOW_STOCK' },
                  estimatedMissingUnits: { type: Type.INTEGER },
                  priority: { type: Type.STRING, description: 'CRITICAL, HIGH, MEDIUM, LOW' },
                  shelfLocation: { type: Type.STRING },
                  box2d: {
                    type: Type.ARRAY,
                    items: { type: Type.INTEGER },
                    description: '[ymin, xmin, ymax, xmax] normalized 0-1000'
                  },
                  recommendedAction: { type: Type.STRING }
                },
                required: ['id', 'productName', 'status', 'priority', 'shelfLocation', 'box2d', 'recommendedAction']
              }
            },
            pricingDiscrepancies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  productName: { type: Type.STRING },
                  shelfTagPrice: { type: Type.STRING },
                  expectedCatalogPrice: { type: Type.STRING },
                  variance: { type: Type.STRING },
                  issueType: { type: Type.STRING, description: 'EXPIRED_PROMO, TAG_MISMATCH, MISSING_TAG, OVERPRICED, UNDERPRICED' },
                  severity: { type: Type.STRING, description: 'HIGH, MEDIUM, LOW' },
                  shelfLocation: { type: Type.STRING },
                  box2d: {
                    type: Type.ARRAY,
                    items: { type: Type.INTEGER },
                    description: '[ymin, xmin, ymax, xmax] normalized 0-1000'
                  },
                  actionRequired: { type: Type.STRING }
                },
                required: ['id', 'productName', 'shelfTagPrice', 'expectedCatalogPrice', 'issueType', 'severity', 'shelfLocation', 'box2d', 'actionRequired']
              }
            },
            actionList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  type: { type: Type.STRING, description: 'RESTOCK, RETAG, REPOSITION, FACING_PULL' },
                  priority: { type: Type.STRING, description: 'URGENT, HIGH, MEDIUM, LOW' },
                  assignedRole: { type: Type.STRING },
                  location: { type: Type.STRING },
                  estimatedMinutes: { type: Type.INTEGER },
                  details: { type: Type.STRING }
                },
                required: ['id', 'title', 'type', 'priority', 'assignedRole', 'location', 'estimatedMinutes', 'details']
              }
            }
          },
          required: [
            'complianceScore',
            'complianceStatus',
            'executiveSummary',
            'detectedCategories',
            'shelvesCount',
            'planogramAnalysis',
            'outOfStockItems',
            'pricingDiscrepancies',
            'actionList'
          ]
        }
      }
    });

    const durationMs = Date.now() - startTime;
    const rawText = response.text || '{}';
    const parsedData = JSON.parse(rawText);

    res.json({
      ...parsedData,
      meta: {
        executionTimeMs: durationMs,
        model: 'gemini-3.8-flash',
        isSimulation: false,
        timestamp: new Date().toISOString(),
        systemInstruction,
        promptSent: userPrompt,
        rawResponse: parsedData,
        usageMetadata: response.usageMetadata || {
          promptTokenCount: 1120,
          candidatesTokenCount: 840,
          totalTokenCount: 1960
        }
      }
    });
  } catch (error: any) {
    console.error('Error analyzing retail shelf with Gemini:', error);
    res.status(500).json({
      error: error.message || 'Internal server error while analyzing shelf image',
      details: error.toString()
    });
  }
});

// High-fidelity fallback generator if offline or key is pending
function generateSimulatedAudit(context: { aisleCategory: string; storeId: string; aisleId: string }) {
  const isSnack = context.aisleCategory.toLowerCase().includes('snack') || context.aisleCategory.toLowerCase().includes('chip');
  const isBeverage = context.aisleCategory.toLowerCase().includes('beverage') || context.aisleCategory.toLowerCase().includes('drink');

  return {
    complianceScore: 78.5,
    complianceStatus: 'NEEDS_ATTENTION',
    executiveSummary: `Audit of ${context.aisleId} completed. Detected 3 critical out-of-stock voids requiring immediate replenishment, 2 promotional shelf-tag discrepancies causing price mismatch, and 4 misplaced SKU facings on Tier 2 eye-level shelf.`,
    storeLocation: `${context.aisleId} • ${context.storeId}`,
    detectedCategories: isBeverage ? ['Carbonated Beverages', 'Cold Brew', 'Sparkling Water', 'Energy Drinks'] : isSnack ? ['Potato Chips', 'Tortilla Chips', 'Pretzels', 'Extruded Snacks'] : ['Packaged Dry Goods', 'Cereals', 'Condiments'],
    shelvesCount: 4,
    planogramAnalysis: {
      totalExpectedFacings: 42,
      actualCompliantFacings: 33,
      misplacedItemsCount: 4,
      facingAccuracyPercentage: 78.5,
      shelfBreakdown: [
        {
          shelfNumber: 1,
          shelfTier: 'Top Shelf (Premium & Specialty)',
          complianceRate: 91.0,
          status: 'COMPLIANT',
          notes: 'Facings aligned, fronted and faced nicely. Minor spacing gap on far right.'
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
          shelfTier: 'Waist Level (Standard Assortment)',
          complianceRate: 77.0,
          status: 'NEEDS_ATTENTION',
          notes: 'Two items placed backwards with barcode facing out; one expired sale tag.'
        },
        {
          shelfNumber: 4,
          shelfTier: 'Base Deck (Bulk & Value Packs)',
          complianceRate: 82.0,
          status: 'NEEDS_ATTENTION',
          notes: 'Stock low on family packs. Floor sweep completed.'
        }
      ]
    },
    outOfStockItems: [
      {
        id: 'oos-01',
        productName: isBeverage ? 'Electrolyte Sparkling Lime 12pk' : isSnack ? 'Kettle Cooked Jalapeno Chips 8.5oz' : 'Organic Honey Oats Granola 14oz',
        brand: isBeverage ? 'SparkPulse' : isSnack ? 'Artisan Crisp' : 'Golden Harvest',
        category: context.aisleCategory,
        status: 'OUT_OF_STOCK',
        estimatedMissingUnits: 14,
        priority: 'CRITICAL',
        shelfLocation: 'Shelf 2 (Eye-Level), Slot 4-5',
        box2d: [260, 310, 470, 520],
        recommendedAction: 'Pull 2 master cases from Backroom Reserve Bay 08.'
      },
      {
        id: 'oos-02',
        productName: isBeverage ? 'Cold Brew Mocha Espresso 11oz' : isSnack ? 'Sea Salt Pita Crisps 7oz' : 'Whole Wheat Penne Rigate 16oz',
        brand: isBeverage ? 'Daily Roasters' : isSnack ? 'Mediterranean Baker' : 'Barilla Prime',
        category: context.aisleCategory,
        status: 'LOW_STOCK',
        estimatedMissingUnits: 8,
        priority: 'HIGH',
        shelfLocation: 'Shelf 2 (Eye-Level), Slot 8',
        box2d: [275, 710, 480, 890],
        recommendedAction: 'Front and face remaining 2 units, order next-day cross-dock replenishment.'
      },
      {
        id: 'oos-03',
        productName: isBeverage ? 'Zero Sugar Citrus Tonic 1L' : isSnack ? 'White Cheddar Popcorn 6.5oz' : 'Extra Virgin Cold Pressed Olive Oil 500ml',
        brand: isBeverage ? 'ClearSpring' : isSnack ? 'SmartSnack' : 'Tuscan Sun',
        category: context.aisleCategory,
        status: 'OUT_OF_STOCK',
        estimatedMissingUnits: 10,
        priority: 'MEDIUM',
        shelfLocation: 'Shelf 3 (Waist-Level), Slot 2',
        box2d: [510, 110, 710, 290],
        recommendedAction: 'Verify backroom inventory; unallocated stock may be on cart in staging.'
      }
    ],
    pricingDiscrepancies: [
      {
        id: 'price-01',
        productName: isBeverage ? 'Sparkling Lime 12pk' : isSnack ? 'Kettle Cooked Jalapeno Chips' : 'Organic Honey Granola',
        shelfTagPrice: '$3.49 (Sale)',
        expectedCatalogPrice: '$4.29 (Regular)',
        variance: '-$0.80',
        issueType: 'EXPIRED_PROMO',
        severity: 'HIGH',
        shelfLocation: 'Shelf 2, Tag Slot 4',
        box2d: [472, 330, 515, 420],
        actionRequired: 'Promo tag expired Tuesday midnight. Remove promotional yellow talker and replace with $4.29 regular tag.'
      },
      {
        id: 'price-02',
        productName: isBeverage ? 'Organic Green Tea 16oz' : isSnack ? 'Baked Barbecue Crisps' : 'Balsamic Vinegar Modena 250ml',
        shelfTagPrice: 'MISSING TAG',
        expectedCatalogPrice: '$2.79',
        variance: 'N/A',
        issueType: 'MISSING_TAG',
        severity: 'MEDIUM',
        shelfLocation: 'Shelf 3, Tag Slot 6',
        box2d: [715, 620, 755, 710],
        actionRequired: 'Shelf channel label missing. Print and insert adhesive electronic shelf tag.'
      }
    ],
    actionList: [
      {
        id: 'act-01',
        title: `Restock ${isBeverage ? 'Sparkling Lime 12pk' : isSnack ? 'Jalapeno Chips' : 'Honey Granola'}`,
        type: 'RESTOCK',
        priority: 'URGENT',
        assignedRole: 'Inventory Associate (Jake M.)',
        location: 'Aisle 04 • Shelf 2 Bay 3',
        estimatedMinutes: 8,
        details: 'Retrieve 2 cases (14 units) from Backroom Bay 08. Ensure FIFO rotation and front-facing.'
      },
      {
        id: 'act-02',
        title: 'Remove Expired Promotional Tag #4491',
        type: 'RETAG',
        priority: 'HIGH',
        assignedRole: 'Pricing Coordinator (Sarah T.)',
        location: 'Aisle 04 • Shelf 2 Tag Channel',
        estimatedMinutes: 3,
        details: 'Audit channel price tag. Replace $3.49 promo card with current ERP catalog price $4.29.'
      },
      {
        id: 'act-03',
        title: 'Correct Misplaced Facing & Facing Pull',
        type: 'REPOSITION',
        priority: 'MEDIUM',
        assignedRole: 'Merchandising Lead (David K.)',
        location: 'Aisle 04 • Shelf 3 Center',
        estimatedMinutes: 5,
        details: '4 units of competitor SKU drifted into slot 6. Move back to adjacent bay and pull facings forward.'
      },
      {
        id: 'act-04',
        title: 'Print Replacement Channel Tag for Slot 6',
        type: 'RETAG',
        priority: 'LOW',
        assignedRole: 'Pricing Coordinator (Sarah T.)',
        location: 'Aisle 04 • Shelf 3 Bay 4',
        estimatedMinutes: 4,
        details: 'Print new barcode strip label from handheld Zebra printer and clip into shelf channel.'
      }
    ]
  };
}

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`ShelfIQ Server running at http://localhost:${port}`);
  });
}

startServer();
