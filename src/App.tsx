/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Camera,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  FileDown,
  ArrowRight,
  Sliders,
  Store,
  Info,
  Calendar,
  Search,
  ExternalLink
} from 'lucide-react';
import { Header } from './components/Header';
import { Sidebar, DashboardTab } from './components/Sidebar';
import { ShelfImageViewer } from './components/ShelfImageViewer';
import { ComplianceScoreCard } from './components/ComplianceScoreCard';
import { OutOfStockList } from './components/OutOfStockList';
import { PricingDiscrepancies } from './components/PricingDiscrepancies';
import { ActionListModal } from './components/ActionListModal';
import { AnalyticsView } from './components/AnalyticsView';
import { JsonPayloadDrawer } from './components/JsonPayloadDrawer';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { CatalogPlanogramView } from './components/CatalogPlanogramView';
import { SAMPLE_SHELVES } from './data/sampleShelves';
import { HISTORICAL_AUDITS } from './data/historicalAudits';
import { ShelfAuditResult, SampleShelfScenario } from './types/retail';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shelfiq_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('shelfiq_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('shelfiq_theme', 'light');
    }
  }, [isDark]);

  // Navigation and layout state
  const [activeTab, setActiveTab] = useState<DashboardTab>('scanner');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isJsonDrawerOpen, setIsJsonDrawerOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  // Active Store & Aisle
  const [selectedStore, setSelectedStore] = useState('Store #104 - Downtown Flagship');
  const [selectedAisle, setSelectedAisle] = useState('Aisle 04 • Bay 03 (Snack Foods)');

  // Active Shelf Inspection State
  const [currentScenario, setCurrentScenario] = useState<SampleShelfScenario>(SAMPLE_SHELVES[0]);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(SAMPLE_SHELVES[0].imageUrl);
  const [auditResult, setAuditResult] = useState<ShelfAuditResult>(SAMPLE_SHELVES[0].defaultData);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [historySearchTerm, setHistorySearchTerm] = useState('');

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Select preloaded sample scenario
  const handleSelectSample = (scenario: SampleShelfScenario) => {
    setCurrentScenario(scenario);
    setCurrentImageUrl(scenario.imageUrl);
    setAuditResult(scenario.defaultData);
    setSelectedAisle(scenario.aisle);
    setSelectedStore(scenario.store);
    setSelectedItemId(null);
    setAnalysisError(null);
  };

  // Convert uploaded/captured file to Base64 and run Gemini multimodal analysis
  const processAndAnalyzeImage = async (fileOrBase64: File | string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setSelectedItemId(null);

    let base64String = '';
    let previewUrl = '';
    let mimeType = 'image/jpeg';

    try {
      if (typeof fileOrBase64 === 'string') {
        base64String = fileOrBase64;
        previewUrl = fileOrBase64;
      } else {
        mimeType = fileOrBase64.type || 'image/jpeg';
        previewUrl = URL.createObjectURL(fileOrBase64);
        base64String = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(fileOrBase64);
        });
      }

      setCurrentImageUrl(previewUrl);

      // Call Express server endpoint
      const response = await fetch('/api/analyze-shelf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageBase64: base64String,
          mimeType,
          aisleCategory: currentScenario.category || 'General Supermarket Aisle',
          storeId: selectedStore,
          aisleId: selectedAisle
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data: ShelfAuditResult = await response.json();
      setAuditResult(data);
      setActiveTab('scanner');
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setAnalysisError(err.message || 'Failed to analyze shelf image. Using simulated fallback data.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // File drop handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        processAndAnalyzeImage(file);
      } else {
        setAnalysisError('Please upload a valid image file (JPEG, PNG, WEBP).');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processAndAnalyzeImage(e.target.files[0]);
    }
  };

  // Metrics for header & sidebar
  const urgentCount = auditResult?.actionList?.filter((a) => a.priority === 'URGENT').length || 0;
  const oosCount = auditResult?.outOfStockItems?.length || 0;
  const pricingCount = auditResult?.pricingDiscrepancies?.length || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans">
      {/* Top Application Header */}
      <Header
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        selectedStore={selectedStore}
        onSelectStore={setSelectedStore}
        onOpenJsonDrawer={() => setIsJsonDrawerOpen(true)}
        onOpenActionList={() => setIsActionModalOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        actionCount={auditResult?.actionList?.length || 0}
        isAnalyzing={isAnalyzing}
        modelName={auditResult?.meta?.model || 'gemini-3.8-flash'}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenJsonDrawer={() => setIsJsonDrawerOpen(true)}
          urgentCount={urgentCount}
          oosCount={oosCount}
          pricingCount={pricingCount}
        />

        {/* Dynamic Center Stage Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TAB 1: Live Shelf Scanner & Audit */}
          {activeTab === 'scanner' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Shelf Upload & Camera Toolbar */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Store className="w-4 h-4 text-blue-600" />
                      Aisle Shelf Scanner
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {selectedAisle}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Upload shelf photos via drag &amp; drop, snap a live camera photo, or choose from preloaded store bays.
                    </p>
                  </div>

                  {/* Actions: Upload & Camera buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
                    >
                      <Upload className="w-4 h-4 text-blue-500" />
                      <span>Upload Photo</span>
                    </button>

                    <button
                      onClick={() => setIsCameraModalOpen(true)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-colors shadow-xs"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Camera Scanner</span>
                    </button>
                  </div>
                </div>

                {/* Preloaded Sample Scenarios Strip */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Quick Load Pre-Configured Store Bays:
                    </span>
                    <span className="text-[10px] text-slate-400">Instant Demo Evaluation</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {SAMPLE_SHELVES.map((scenario) => {
                      const isCurrent = currentScenario.id === scenario.id;
                      return (
                        <button
                          key={scenario.id}
                          onClick={() => handleSelectSample(scenario)}
                          className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between ${
                            isCurrent
                              ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-blue-500/40 shadow-xs'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {scenario.title}
                            </span>
                            {isCurrent && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                            {scenario.aisle}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Drag & Drop Hot Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50'
                      : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30'
                  }`}
                >
                  <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-slate-400" />
                    <span>Drag and drop any store shelf image here, or browse files</span>
                  </p>
                </div>
              </div>

              {/* Error banner if any */}
              {analysisError && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{analysisError}</span>
                  </div>
                  <button
                    onClick={() => setAnalysisError(null)}
                    className="font-bold underline ml-2"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Center Image Stage with Bounding Box Overlay */}
              <ShelfImageViewer
                imageUrl={currentImageUrl}
                isAnalyzing={isAnalyzing}
                outOfStockItems={auditResult?.outOfStockItems || []}
                pricingDiscrepancies={auditResult?.pricingDiscrepancies || []}
                selectedItemId={selectedItemId}
                onSelectItem={setSelectedItemId}
              />

              {/* Requirement 1: Planogram Compliance Score Card */}
              {auditResult && (
                <ComplianceScoreCard
                  score={auditResult.complianceScore}
                  status={auditResult.complianceStatus}
                  executiveSummary={auditResult.executiveSummary}
                  planogram={auditResult.planogramAnalysis}
                  shelvesCount={auditResult.shelvesCount}
                />
              )}

              {/* Requirements 2 & 3: Two-Column Section for OOS Items and Pricing Alerts */}
              {auditResult && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Requirement 2: Out of Stock and Low Stock Identification */}
                  <OutOfStockList
                    items={auditResult.outOfStockItems}
                    selectedItemId={selectedItemId}
                    onSelectItem={setSelectedItemId}
                  />

                  {/* Requirement 3: Pricing Discrepancies */}
                  <PricingDiscrepancies
                    items={auditResult.pricingDiscrepancies}
                    selectedItemId={selectedItemId}
                    onSelectItem={setSelectedItemId}
                  />
                </div>
              )}

              {/* Requirement 4: Action List Preview Card */}
              {auditResult && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 border border-blue-800 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">
                        Work Order Ready
                      </span>
                      <h3 className="font-extrabold text-base">
                        Prioritized Restock Task List ({auditResult.actionList.length} Tasks)
                      </h3>
                    </div>
                    <p className="text-xs text-blue-200 max-w-xl">
                      Automated work order distribution with role assignments, estimated restock times, and downloadable run-sheets.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsActionModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-950 font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-2 shrink-0"
                  >
                    <FileDown className="w-4 h-4 text-blue-700" />
                    <span>View &amp; Download Action List</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Audit Analytics & Trends */}
          {activeTab === 'analytics' && <AnalyticsView />}

          {/* TAB 3: Restock Action Center */}
          {activeTab === 'actions' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileDown className="w-5 h-5 text-blue-600" />
                    Restock &amp; Correction Action Task Center
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Prioritized tasks generated from multimodal computer vision audit.
                  </p>
                </div>

                <button
                  onClick={() => setIsActionModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-2"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Open Interactive Work Order Sheet</span>
                </button>
              </div>

              {/* Embedded view of current actions */}
              <div className="space-y-3">
                {auditResult.actionList.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          {task.priority}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {task.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {task.location} • Assigned to: <strong>{task.assignedRole}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                        {task.estimatedMinutes} mins
                      </span>
                      <button
                        onClick={() => setIsActionModalOpen(true)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                      >
                        Manage Task
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Planogram Catalog Rules */}
          {activeTab === 'catalog' && <CatalogPlanogramView />}

          {/* TAB 5: Audit History Archive */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Audit History Archive
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Search and review all historical shelf inspections across store locations.
                  </p>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search aisle or category..."
                    value={historySearchTerm}
                    onChange={(e) => setHistorySearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Historical Table */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                      <th className="pb-3">Audit ID &amp; Date</th>
                      <th className="pb-3">Store &amp; Aisle</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Compliance Score</th>
                      <th className="pb-3">OOS Voids</th>
                      <th className="pb-3">Price Flags</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {HISTORICAL_AUDITS.filter(
                      (a) =>
                        a.aisle.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
                        a.category.toLowerCase().includes(historySearchTerm.toLowerCase())
                    ).map((audit) => (
                      <tr key={audit.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                          <div>{audit.id}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{audit.date}</div>
                        </td>
                        <td className="py-3">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{audit.aisle}</div>
                          <div className="text-[10px] text-slate-400">{audit.storeName}</div>
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-300">{audit.category}</td>
                        <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                          {audit.complianceScore}%
                        </td>
                        <td className="py-3 text-rose-500 font-mono font-bold">{audit.oosCount}</td>
                        <td className="py-3 text-purple-500 font-mono font-bold">{audit.pricingErrorsCount}</td>
                        <td className="py-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              audit.status === 'COMPLIANT'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : audit.status === 'NEEDS_ATTENTION'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {audit.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Recruiter JSON Inspector Drawer */}
      <JsonPayloadDrawer
        isOpen={isJsonDrawerOpen}
        onClose={() => setIsJsonDrawerOpen(false)}
        auditResult={auditResult}
      />

      {/* Action List Modal & Printable Run-Sheet */}
      <ActionListModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        actionList={auditResult?.actionList || []}
        storeName={selectedStore}
        aisleLocation={selectedAisle}
      />

      {/* Device Camera Live Snapshot Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={(base64) => processAndAnalyzeImage(base64)}
      />
    </div>
  );
}
