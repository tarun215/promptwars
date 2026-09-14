import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  FileDiff, 
  Download, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useLegalApp } from '../context/LegalAppContext';
import { PdfExportService } from '../services/pdfExporter';

export const ContractComparator: React.FC = () => {
  const {
    documents,
    activeDocument,
    setActiveDocumentId,
    activeComparisonDoc,
    setActiveComparisonDocId,
    comparisonReport,
    addAuditLog
  } = useLegalApp();

  const [selectedDiffIndex, setSelectedDiffIndex] = useState<number>(0);

  const activeDiff = comparisonReport.diffs[selectedDiffIndex] || comparisonReport.diffs[0];

  const handleExportPdf = () => {
    PdfExportService.exportComparisonPdf(comparisonReport);
    addAuditLog('EXPORT_COMPARISON_PDF');
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Phase 3: Multi-Document AI Comparator
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300 font-medium">Redline & Inconsistency Engine</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white">Multi-Contract Diff & Gap Detection Engine</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare two versions of an agreement or evaluate counterpart contract redlines against your baseline standard.
          </p>
        </div>

        <button
          onClick={handleExportPdf}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Comparison Report (PDF)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-5 glass-panel p-4 rounded-xl border border-slate-800">
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Document A (Baseline / Primary)</label>
          <div className="relative">
            <select
              value={activeDocument.id}
              onChange={(e) => setActiveDocumentId(e.target.value)}
              className="w-full appearance-none bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id} className="bg-slate-900">
                  📄 {d.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        <div className="md:col-span-2 glass-panel p-3 rounded-xl border border-indigo-500/30 text-center bg-indigo-950/20 shadow-glow-indigo">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-300">Alignment</span>
          <div className="text-xl font-mono font-bold text-white mt-0.5">
            {comparisonReport.similarityScore}%
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full"
              style={{ width: `${comparisonReport.similarityScore}%` }}
            />
          </div>
        </div>

        <div className="md:col-span-5 glass-panel p-4 rounded-xl border border-slate-800">
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Document B (Comparison Target / Counterparty)</label>
          <div className="relative">
            <select
              value={activeComparisonDoc.id}
              onChange={(e) => setActiveComparisonDocId(e.target.value)}
              className="w-full appearance-none bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id} className="bg-slate-900">
                  📄 {d.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {comparisonReport.missingCrucialClauses.length > 0 && (
        <div className="glass-panel p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-amber-300 font-semibold">Missing Crucial Clauses Detected (Gap Analysis):</strong>
            <p className="text-slate-300">
              The following standard commercial protections are absent from the compared versions:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {comparisonReport.missingCrucialClauses.map((item, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded bg-amber-900/40 text-amber-200 border border-amber-500/30 font-medium text-[11px]">
                  ⚠️ {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2 max-h-[560px] overflow-y-auto">
          <h4 className="text-xs font-bold text-white mb-2 flex items-center justify-between">
            <span>Compared Sections ({comparisonReport.diffs.length})</span>
            <span className="text-[10px] text-slate-400 font-mono">Select to Redline</span>
          </h4>

          {comparisonReport.diffs.map((diff, idx) => {
            const isSelected = idx === selectedDiffIndex;
            return (
              <button
                key={idx}
                onClick={() => setSelectedDiffIndex(idx)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                  isSelected
                    ? 'bg-indigo-600/30 border-indigo-500 shadow-glow-indigo text-white'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold truncate">{diff.clauseTitle}</span>
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    diff.status === 'identical'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : diff.status === 'modified'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {diff.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{diff.analysis}</p>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileDiff className="w-4 h-4 text-cyan-400" />
                {activeDiff.clauseTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Category: <span className="text-slate-300 font-mono uppercase">{activeDiff.category}</span>
              </p>
            </div>

            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
              activeDiff.severity === 'high_risk'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              {activeDiff.severity === 'high_risk' ? '⚠️ High Asymmetry' : 'Neutral Term'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 block mb-1.5">
                DOC A: {activeDocument.title.substring(0, 28)}...
              </span>
              <p className="text-xs font-mono text-slate-200 leading-relaxed max-h-48 overflow-y-auto">
                {activeDiff.docAText || 'N/A'}
              </p>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-cyan-400 block mb-1.5">
                DOC B: {activeComparisonDoc.title.substring(0, 28)}...
              </span>
              <p className="text-xs font-mono text-slate-200 leading-relaxed max-h-48 overflow-y-auto">
                {activeDiff.docBText || 'N/A'}
              </p>
            </div>
          </div>

          <div className="p-4 bg-indigo-950/20 border border-indigo-500/30 rounded-xl text-xs space-y-1.5">
            <span className="font-bold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              GenAI Comparison Analysis & Impact:
            </span>
            <p className="text-slate-200 leading-relaxed">{activeDiff.analysis}</p>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 mb-2">Negotiation Harmonization Guidance</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {comparisonReport.negotiationRecommendations.map((rec, rIdx) => (
                <li key={rIdx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
