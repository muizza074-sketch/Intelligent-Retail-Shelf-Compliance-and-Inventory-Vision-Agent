import React, { useState } from 'react';
import {
  X,
  FileDown,
  Printer,
  FileSpreadsheet,
  Copy,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  AlertOctagon,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RestockActionItem } from '../types/retail';

interface ActionListModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionList: RestockActionItem[];
  storeName: string;
  aisleLocation: string;
  onUpdateActionStatus?: (id: string, status: 'PENDING' | 'IN_PROGRESS' | 'DONE') => void;
}

export const ActionListModal: React.FC<ActionListModalProps> = ({
  isOpen,
  onClose,
  actionList,
  storeName,
  aisleLocation,
  onUpdateActionStatus
}) => {
  const [tasks, setTasks] = useState<RestockActionItem[]>(actionList);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);

  // Sync state if actionList prop updates
  React.useEffect(() => {
    setTasks(actionList);
  }, [actionList]);

  if (!isOpen) return null;

  const handleToggleStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'DONE' ? 'PENDING' : t.status === 'IN_PROGRESS' ? 'DONE' : 'IN_PROGRESS';
          if (nextStatus === 'DONE') {
            confetti({
              particleCount: 45,
              spread: 60,
              origin: { y: 0.7 }
            });
          }
          if (onUpdateActionStatus) onUpdateActionStatus(id, nextStatus);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const completedCount = tasks.filter((t) => t.status === 'DONE').length;
  const totalMinutes = tasks.reduce((sum, t) => sum + (t.status !== 'DONE' ? t.estimatedMinutes : 0), 0);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filterType === 'ALL') return true;
    return t.type === filterType;
  });

  // Download CSV export
  const handleDownloadCsv = () => {
    const headers = ['Task ID', 'Priority', 'Type', 'Title', 'Assigned Role', 'Location', 'Est Minutes', 'Status', 'Details'];
    const rows = tasks.map((t) => [
      `"${t.id}"`,
      `"${t.priority}"`,
      `"${t.type}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.assignedRole}"`,
      `"${t.location}"`,
      t.estimatedMinutes,
      `"${t.status || 'PENDING'}"`,
      `"${t.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ShelfIQ_Restock_ActionList_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy plain text / markdown checklist
  const handleCopyChecklist = () => {
    const text = [
      `# ShelfIQ Restock Action List`,
      `Store: ${storeName}`,
      `Aisle: ${aisleLocation}`,
      `Generated: ${new Date().toLocaleString()}`,
      `Total Estimated Restock Time: ${totalMinutes} mins`,
      ``,
      ...tasks.map(
        (t) =>
          `- [${t.status === 'DONE' ? 'x' : ' '}] [${t.priority}] ${t.title} (${t.estimatedMinutes}m)\n  Location: ${t.location} | Role: ${t.assignedRole}\n  Details: ${t.details}`
      )
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Trigger Print dialog for clean printable run-sheet
  const handlePrint = () => {
    window.print();
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-white">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Prioritized Restock &amp; Correction Action List
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  {completedCount}/{tasks.length} Completed
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {storeName} • {aisleLocation}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Est. Work Remaining:</span>
              <strong className="text-slate-900 dark:text-white font-mono">{totalMinutes} mins</strong>
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
              title="Print Store Run-Sheet"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Run-Sheet</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
              title="Export CSV for ERP / Zebra devices"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleCopyChecklist}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-xs"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Tasks'}</span>
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Filter:
          </span>
          {['ALL', 'RESTOCK', 'RETAG', 'REPOSITION', 'FACING_PULL'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-md font-medium text-[11px] transition-colors whitespace-nowrap ${
                filterType === type
                  ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Task Cards List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {filteredTasks.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">
              No tasks match this filter.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isDone = task.status === 'DONE';
              const isInProgress = task.status === 'IN_PROGRESS';

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                      : isInProgress
                      ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-400 dark:border-blue-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {/* Checkbox status toggle */}
                      <button
                        onClick={() => handleToggleStatus(task.id)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                          isDone
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : isInProgress
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 dark:border-slate-700 hover:border-blue-500'
                        }`}
                        title="Click to toggle status (Pending -> In Progress -> Done)"
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4" />}
                        {isInProgress && <Clock className="w-3.5 h-3.5" />}
                      </button>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityStyle(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                        {task.type}
                      </span>

                      <h4
                        className={`text-sm font-bold text-slate-900 dark:text-white ${
                          isDone ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                      >
                        {task.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 shrink-0">
                      <div className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{task.estimatedMinutes}m</span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : isInProgress
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {task.status || 'PENDING'}
                      </span>
                    </div>
                  </div>

                  {/* Metadata: Location & Assignee */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 my-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{task.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-500" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {task.assignedRole}
                      </span>
                    </div>
                  </div>

                  {/* Details paragraph */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 leading-relaxed">
                    {task.details}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Work orders dynamically synchronized with handheld RF scanners.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Hidden Container for Clean Print Layout */}
      <div id="printable-action-sheet" className="hidden">
        <div style={{ padding: '24px', fontFamily: 'sans-serif', color: '#111827' }}>
          <div style={{ borderBottom: '2px solid #2563eb', paddingBottom: '12px', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>ShelfIQ • Store Restock Run-Sheet</h1>
            <p style={{ fontSize: '13px', color: '#4b5563', margin: '4px 0 0 0' }}>
              Store: {storeName} | Location: {aisleLocation} | Generated: {new Date().toLocaleString()}
            </p>
          </div>

          <div style={{ marginBottom: '16px', display: 'flex', gap: '24px', fontSize: '14px' }}>
            <div><strong>Total Tasks:</strong> {tasks.length}</div>
            <div><strong>Est. Duration:</strong> {totalMinutes} mins</div>
            <div><strong>Status:</strong> Ready for Shift Distribution</div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #d1d5db', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>[ ]</th>
                <th style={{ padding: '8px' }}>Priority</th>
                <th style={{ padding: '8px' }}>Type</th>
                <th style={{ padding: '8px' }}>Title &amp; Location</th>
                <th style={{ padding: '8px' }}>Assigned To</th>
                <th style={{ padding: '8px' }}>Est Min</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '8px', width: '30px' }}>[ ]</td>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>{t.priority}</td>
                  <td style={{ padding: '8px' }}>{t.type}</td>
                  <td style={{ padding: '8px' }}>
                    <div style={{ fontWeight: 'bold' }}>{t.title}</div>
                    <div style={{ color: '#4b5563', fontSize: '11px' }}>{t.location} • {t.details}</div>
                  </td>
                  <td style={{ padding: '8px' }}>{t.assignedRole}</td>
                  <td style={{ padding: '8px' }}>{t.estimatedMinutes}m</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px dashed #9ca3af', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <div>Store Manager Signature: ___________________________</div>
            <div>Date Verified: _______________</div>
          </div>
        </div>
      </div>
    </div>
  );
};
