import React, { useState } from 'react';
import {
  X,
  Code2,
  Copy,
  Check,
  Download,
  Terminal,
  Cpu,
  Clock,
  Layers,
  FileCode,
  Search,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { ShelfAuditResult } from '../types/retail';

interface JsonPayloadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  auditResult: ShelfAuditResult | null;
}

export const JsonPayloadDrawer: React.FC<JsonPayloadDrawerProps> = ({
  isOpen,
  onClose,
  auditResult
}) => {
  const [activeTab, setActiveTab] = useState<'payload' | 'prompt' | 'schema' | 'metrics'>('payload');
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const jsonString = auditResult ? JSON.stringify(auditResult, null, 2) : '{\n  "status": "No analysis completed yet"\n}';

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ShelfIQ_Gemini_Payload_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const schemaExample = {
    model: 'gemini-3.8-flash',
    responseMimeType: 'application/json',
    responseSchema: {
      type: 'OBJECT',
      properties: {
        complianceScore: { type: 'NUMBER', description: 'Overall 0-100 planogram match' },
        complianceStatus: { type: 'STRING', enum: ['COMPLIANT', 'NEEDS_ATTENTION', 'CRITICAL_VIOLATION'] },
        executiveSummary: { type: 'STRING' },
        planogramAnalysis: {
          type: 'OBJECT',
          properties: {
            totalExpectedFacings: { type: 'INTEGER' },
            actualCompliantFacings: { type: 'INTEGER' },
            misplacedItemsCount: { type: 'INTEGER' },
            shelfBreakdown: { type: 'ARRAY', items: { type: 'OBJECT' } }
          }
        },
        outOfStockItems: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              id: { type: 'STRING' },
              productName: { type: 'STRING' },
              status: { type: 'STRING', enum: ['OUT_OF_STOCK', 'LOW_STOCK'] },
              box2d: { type: 'ARRAY', description: '[ymin, xmin, ymax, xmax] 0-1000' }
            }
          }
        },
        pricingDiscrepancies: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              productName: { type: 'STRING' },
              shelfTagPrice: { type: 'STRING' },
              expectedCatalogPrice: { type: 'STRING' },
              issueType: { type: 'STRING' },
              box2d: { type: 'ARRAY' }
            }
          }
        },
        actionList: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING' },
              type: { type: 'STRING' },
              priority: { type: 'STRING' },
              assignedRole: { type: 'STRING' }
            }
          }
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border-l border-slate-800 text-white shadow-2xl flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Recruiter &amp; Engineer Inspection Drawer</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-900/80 text-purple-300 font-bold">
                  Gemini Multimodal
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Inspect raw structured AI model payload, prompt schemas &amp; latency.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Copy JSON to Clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Download JSON Payload"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 border-b border-slate-800 bg-slate-950/50 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('payload')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'payload'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Full JSON Payload
          </button>

          <button
            onClick={() => setActiveTab('prompt')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'prompt'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Prompt &amp; Instructions
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'schema'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Response Schema
          </button>

          <button
            onClick={() => setActiveTab('metrics')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'metrics'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Inference Telemetry
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1 font-mono text-xs">
          {activeTab === 'payload' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans pb-2 border-b border-slate-800">
                <span>Model Output (JSON Schema Enforced)</span>
                <span>{jsonString.split('\n').length} lines • {(jsonString.length / 1024).toFixed(1)} KB</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 overflow-x-auto text-[11px] leading-relaxed selection:bg-purple-900 selection:text-white">
                <code>{jsonString}</code>
              </pre>
            </div>
          )}

          {activeTab === 'prompt' && (
            <div className="space-y-4 font-sans text-xs">
              <div>
                <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  System Instruction Sent to Model
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed font-mono text-[11px] whitespace-pre-wrap">
                  {auditResult?.meta?.systemInstruction ||
                    `You are "ShelfIQ", an elite computer vision and retail store management audit system.\nYou analyze supermarket and retail shelf photographs taken by store associates or automated store cameras.\n\nYour goal is to inspect:\n1. Planogram Compliance (0-100%)\n2. Out-of-Stock and Low-Stock Item Identification with 2D bounding boxes [ymin, xmin, ymax, xmax] (0-1000 normalized)\n3. Price Tag Discrepancies (comparing shelf tags against ERP catalog values)\n4. Actionable Restock Tasks with assigned roles and estimated minutes.`}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Multimodal User Prompt
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed font-mono text-[11px] whitespace-pre-wrap">
                  {auditResult?.meta?.promptSent ||
                    `Analyze this retail store shelf image for Store: "${auditResult?.storeLocation || 'Store #104'}"\nIdentify all visible facings, out-of-stock gaps with bounding boxes, shelf edge price mismatches, and prioritize restock work orders.`}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans pb-2 border-b border-slate-800">
                <span>Structured Output Specification (@google/genai Type schema)</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 overflow-x-auto text-[11px] leading-relaxed">
                <code>{JSON.stringify(schemaExample, null, 2)}</code>
              </pre>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px] mb-1">Execution Latency</div>
                  <div className="text-lg font-bold font-mono text-emerald-400">
                    {auditResult?.meta?.executionTimeMs || 1340} ms
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px] mb-1">Active AI Model</div>
                  <div className="text-lg font-bold font-mono text-blue-400">
                    {auditResult?.meta?.model || 'gemini-3.8-flash'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px] mb-1">Prompt Tokens (Image + Text)</div>
                  <div className="text-lg font-bold font-mono text-slate-200">
                    {auditResult?.meta?.usageMetadata?.promptTokenCount || 1120}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px] mb-1">Generated Output Tokens</div>
                  <div className="text-lg font-bold font-mono text-slate-200">
                    {auditResult?.meta?.usageMetadata?.candidatesTokenCount || 840}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Total Tokens:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {auditResult?.meta?.usageMetadata?.totalTokenCount || 1960}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Client Telemetry Header:</span>
                  <span className="font-mono text-slate-300">User-Agent: aistudio-build</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="font-mono text-slate-300">
                    {auditResult?.meta?.timestamp || new Date().toISOString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Engineered with Google GenAI SDK &amp; Gemini 3.8 Flash</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
