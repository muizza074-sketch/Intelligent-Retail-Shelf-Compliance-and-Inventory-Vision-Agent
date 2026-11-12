export type ComplianceStatus = 'COMPLIANT' | 'NEEDS_ATTENTION' | 'CRITICAL_VIOLATION';
export type StockStatus = 'OUT_OF_STOCK' | 'LOW_STOCK';
export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type PricingIssueType = 'EXPIRED_PROMO' | 'TAG_MISMATCH' | 'MISSING_TAG' | 'OVERPRICED' | 'UNDERPRICED';
export type ActionType = 'RESTOCK' | 'RETAG' | 'REPOSITION' | 'FACING_PULL';

export interface ShelfTierBreakdown {
  shelfNumber: number;
  shelfTier: string;
  complianceRate: number;
  status: 'COMPLIANT' | 'NEEDS_ATTENTION' | 'CRITICAL_VIOLATION' | string;
  notes: string;
}

export interface PlanogramAnalysis {
  totalExpectedFacings: number;
  actualCompliantFacings: number;
  misplacedItemsCount: number;
  facingAccuracyPercentage: number;
  shelfBreakdown: ShelfTierBreakdown[];
}

export interface OutOfStockItem {
  id: string;
  productName: string;
  brand?: string;
  category?: string;
  status: StockStatus;
  estimatedMissingUnits: number;
  priority: PriorityLevel;
  shelfLocation: string;
  box2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0-1000
  recommendedAction: string;
}

export interface PricingDiscrepancy {
  id: string;
  productName: string;
  shelfTagPrice: string;
  expectedCatalogPrice: string;
  variance?: string;
  issueType: PricingIssueType;
  severity: PriorityLevel;
  shelfLocation: string;
  box2d?: [number, number, number, number];
  actionRequired: string;
}

export interface RestockActionItem {
  id: string;
  title: string;
  type: ActionType;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  assignedRole: string;
  location: string;
  estimatedMinutes: number;
  details: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'DONE';
}

export interface ShelfAuditMeta {
  executionTimeMs: number;
  model: string;
  isSimulation: boolean;
  timestamp: string;
  systemInstruction?: string;
  promptSent?: string;
  rawResponse?: any;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
}

export interface ShelfAuditResult {
  complianceScore: number;
  complianceStatus: ComplianceStatus;
  executiveSummary: string;
  storeLocation: string;
  detectedCategories: string[];
  shelvesCount: number;
  planogramAnalysis: PlanogramAnalysis;
  outOfStockItems: OutOfStockItem[];
  pricingDiscrepancies: PricingDiscrepancy[];
  actionList: RestockActionItem[];
  meta?: ShelfAuditMeta;
}

export interface HistoricalAudit {
  id: string;
  date: string;
  storeId: string;
  storeName: string;
  aisle: string;
  category: string;
  complianceScore: number;
  oosCount: number;
  pricingErrorsCount: number;
  status: ComplianceStatus;
  auditor: string;
  imageUrl?: string;
}

export interface SampleShelfScenario {
  id: string;
  title: string;
  category: string;
  aisle: string;
  store: string;
  description: string;
  imageUrl: string;
  defaultData: ShelfAuditResult;
}
