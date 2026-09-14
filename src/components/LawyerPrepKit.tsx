import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  Layers, 
  Download, 
  Copy, 
  Check, 
  FileSpreadsheet
} from 'lucide-react';
import { useLegalApp } from '../context/LegalAppContext';
import { PdfExportService } from '../services/pdfExporter';

export const LawyerPrepKit: React.FC = () => {
  const { activeDocument, lawyerPrepKit, addAuditLog } = useLegalApp();
  const [activeTab, setActiveTab] = useState<'questions' | 'timeline' | 'matrix'>('questions');
  const [copied, setCopied] = useState(false);

  const handleExportPdf = () => {
    PdfExportService.exportLawyerPrepKitPdf(activeDocument, lawyerPrepKit);
    addAuditLog('EXPORT_LAWYER_PREP_KIT_PDF');
  };

  const handleCopyQuestions = () => {
    const text = `CONSULTATION QUESTIONS FOR ATTORNEY (${activeDocument.title}):\n\n` +
      lawyerPrepKit.criticalQuestions
        .map((q, i) => `${i + 1}. [${q.priority.toUpperCase()}] ${q.question}\n   Context: ${q.contextWhyAsk}`)
        .join('\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addAuditLog('COPY_LAWYER_QUESTIONS');
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Phase 3: Attorney Consultation Readiness Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300 font-medium">{activeDocument.title}</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white">Lawyer Consultation Preparation Kit</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-generate high-leverage legal questions, obligation grids, and key timelines to maximize your legal consultation value.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyQuestions}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{copied ? 'Questions Copied!' : 'Copy Questions'}</span>
          </button>
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Attorney Briefing Kit (PDF)</span>
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-3 px-5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'questions'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Strategic Attorney Questions ({lawyerPrepKit.criticalQuestions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 px-5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'timeline'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Key Dates Timeline</span>
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`pb-3 px-5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'matrix'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Party Obligation Matrix</span>
        </button>
      </div>

      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-xl border border-indigo-500/20 text-xs text-indigo-200 bg-indigo-950/20">
            <strong className="text-white font-semibold">💡 Strategic Consultation Tip:</strong> Bring these specific questions to your legal counsel. They focus directly on the highest-risk terms identified in your document to minimize billing hours and focus discussion.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lawyerPrepKit.criticalQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-cyan-400">QUESTION #{idx + 1}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      q.priority === 'high' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {q.priority} Priority • {q.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug mb-2">{q.question}</h4>
                  <p className="text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <strong className="text-indigo-300">Why Ask: </strong> {q.contextWhyAsk}
                  </p>
                </div>

                <div className="text-[11px] font-mono text-slate-400 truncate pt-2">
                  Reference: "{q.relevantClauseSnippet}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Critical Contractual Milestones & Deadlines
          </h3>

          <div className="relative pl-6 border-l-2 border-indigo-500/30 space-y-6">
            {lawyerPrepKit.timeline.map((event) => (
              <div key={event.id} className="relative space-y-1 text-xs">
                <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-950 border-2 border-indigo-400" />
                <span className="text-[11px] font-mono text-amber-400 font-bold">{event.dateOrTrigger}</span>
                <h4 className="text-sm font-bold text-white">{event.title}</h4>
                <p className="text-slate-300 leading-relaxed">{event.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span>Responsible Party: <strong className="text-slate-200">{event.responsibleParty}</strong></span>
                  <span>•</span>
                  <span className="uppercase text-indigo-400 font-semibold">{event.urgency} Urgency</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'matrix' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Bilateral Party Obligations Matrix
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="py-3 px-4">Party Obligated</th>
                  <th className="py-3 px-4">Specific Obligation</th>
                  <th className="py-3 px-4">Timeline / Frequency</th>
                  <th className="py-3 px-4">Default Penalty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {lawyerPrepKit.obligationsMatrix.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/50">
                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">{item.party}</td>
                    <td className="py-3 px-4 text-slate-300 leading-relaxed">{item.obligation}</td>
                    <td className="py-3 px-4 font-mono text-amber-300 whitespace-nowrap">{item.frequencyOrDeadline}</td>
                    <td className="py-3 px-4 text-rose-300 font-medium">{item.penaltyForNonCompliance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
