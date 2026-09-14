import React, { useState } from 'react';
import { 
  FileText, 
  CheckSquare, 
  Copy, 
  Check, 
  Download, 
  Clock, 
  Sparkles, 
  ListChecks
} from 'lucide-react';
import { useLegalApp } from '../context/LegalAppContext';
import { PdfExportService } from '../services/pdfExporter';

export const SummaryGenerator: React.FC = () => {
  const { activeDocument, riskScorecard, addAuditLog } = useLegalApp();
  const [activeTab, setActiveTab] = useState<'executive' | 'detailed' | 'checklist'>('executive');
  const [copied, setCopied] = useState(false);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCompletedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checklistItems = activeDocument.clauses.map((clause) => ({
    id: `chk-${clause.id}`,
    clauseNumber: clause.clauseNumber,
    title: clause.title,
    action: clause.actionRequired || `Verify compliance with ${clause.title} obligations.`,
    deadline: clause.deadline || 'Prior to agreement signing',
    riskLevel: clause.riskLevel,
    party: clause.keyParties ? clause.keyParties[0] : 'Legal Team'
  }));

  const handleCopySummary = () => {
    let text = '';
    if (activeTab === 'executive') {
      text = `EXECUTIVE LEGAL SUMMARY: ${activeDocument.title}\n\n${riskScorecard.summary}\n\nGoverning Law: ${activeDocument.metadata.governingLaw}\nParties: ${activeDocument.metadata.partyA} vs ${activeDocument.metadata.partyB}`;
    } else if (activeTab === 'checklist') {
      text = `ACTION CHECKLIST FOR ${activeDocument.title}:\n` + checklistItems.map((c, i) => `${i + 1}. [${c.deadline}] ${c.title}: ${c.action}`).join('\n');
    } else {
      text = activeDocument.clauses.map((c) => `${c.clauseNumber} ${c.title}:\n${c.simplifiedText.executive}`).join('\n\n');
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addAuditLog('COPY_SUMMARY_TEXT');
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Phase 2: Intelligent Summarization Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300 font-medium">{activeDocument.title}</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white">Executive Summaries & Action Checklist</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-generate executive briefings, operational milestones, and prioritized negotiation checklists.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={() => {
              PdfExportService.exportDocumentReport(activeDocument, riskScorecard);
              addAuditLog('EXPORT_SUMMARY_PDF');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report (PDF)</span>
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('executive')}
          className={`pb-3 px-5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'executive'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Executive Brief</span>
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`pb-3 px-5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'checklist'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListChecks className="w-4 h-4" />
          <span>Action Checklist & Deadlines ({checklistItems.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('detailed')}
          className={`pb-3 px-5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'detailed'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Clause-by-Clause Breakdown</span>
        </button>
      </div>

      {activeTab === 'executive' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Executive Legal Brief
            </h3>
            
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-xs leading-relaxed text-slate-200 space-y-3">
              <p>
                This agreement establishes a binding commercial relationship between <strong>{activeDocument.metadata.partyA}</strong> and <strong>{activeDocument.metadata.partyB}</strong>, governed under <strong>{activeDocument.metadata.governingLaw}</strong>.
              </p>
              <p className="text-slate-300">
                {riskScorecard.summary}
              </p>
            </div>

            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider pt-2">Key Critical Points to Review</h4>
            <div className="space-y-2.5">
              {activeDocument.clauses.slice(0, 3).map((cl) => (
                <div key={cl.id} className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                  <div className="text-xs">
                    <p className="font-bold text-white mb-0.5">{cl.clauseNumber} — {cl.title}</p>
                    <p className="text-slate-300 leading-relaxed">{cl.simplifiedText.executive}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-white">Document Snapshot</h4>
              <div className="flex justify-between text-slate-400 py-1 border-b border-slate-800">
                <span>Contract Type:</span>
                <span className="text-slate-200 font-medium">{activeDocument.documentType}</span>
              </div>
              <div className="flex justify-between text-slate-400 py-1 border-b border-slate-800">
                <span>Effective Date:</span>
                <span className="text-slate-200 font-medium">{activeDocument.metadata.effectiveDate}</span>
              </div>
              <div className="flex justify-between text-slate-400 py-1 border-b border-slate-800">
                <span>Total Value:</span>
                <span className="text-cyan-400 font-mono font-medium">{activeDocument.metadata.contractValue || 'Standard'}</span>
              </div>
              <div className="flex justify-between text-slate-400 py-1">
                <span>Risk Status:</span>
                <span className={`font-bold uppercase ${riskScorecard.overallTier === 'critical' ? 'text-rose-400' : 'text-amber-400'}`}>
                  {riskScorecard.overallTier}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'checklist' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-emerald-400" />
              Prioritized Action & Compliance Checklist
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {Object.values(completedItems).filter(Boolean).length} of {checklistItems.length} completed
            </span>
          </div>

          <div className="space-y-3">
            {checklistItems.map((item) => {
              const isChecked = !!completedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/40 opacity-75'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-4 h-4 mt-0.5 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span className={`font-bold ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                        {item.clauseNumber} — {item.title}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-950/60 border border-amber-500/20 px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {item.deadline}
                      </span>
                    </div>
                    <p className={`leading-relaxed ${isChecked ? 'text-slate-400 line-through' : 'text-slate-300'}`}>
                      {item.action}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'detailed' && (
        <div className="space-y-4">
          {activeDocument.clauses.map((clause) => (
            <div key={clause.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{clause.clauseNumber} — {clause.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {clause.category.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed pt-1">{clause.simplifiedText.executive}</p>
              {clause.actionRequired && (
                <p className="text-emerald-400 font-medium">💡 Recommendation: {clause.actionRequired}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
