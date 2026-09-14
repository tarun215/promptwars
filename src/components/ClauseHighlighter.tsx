import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Download,
  Tag,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { useLegalApp } from '../context/LegalAppContext';
import { ClauseCategory, RiskLevel } from '../types';
import { PdfExportService } from '../services/pdfExporter';

export const ClauseHighlighter: React.FC = () => {
  const { activeDocument, riskScorecard, addAuditLog } = useLegalApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [expandedClauses, setExpandedClauses] = useState<Record<string, boolean>>({
    [activeDocument.clauses[0]?.id || '']: true,
    [activeDocument.clauses[1]?.id || '']: true
  });

  const toggleExpand = (id: string) => {
    setExpandedClauses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getCategoryBadge = (category: ClauseCategory) => {
    switch (category) {
      case 'liability':
      case 'risk':
        return { label: 'Risk & Liability', color: 'bg-rose-500/10 text-rose-300 border-rose-500/30' };
      case 'obligation':
        return { label: 'Party Obligation', color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' };
      case 'deadline':
      case 'payment':
        return { label: 'Payment / Deadline', color: 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
      case 'indemnity':
        return { label: 'Indemnification', color: 'bg-purple-500/10 text-purple-300 border-purple-500/30' };
      case 'intellectual_property':
        return { label: 'Intellectual Property', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' };
      default:
        return { label: 'General / Boilerplate', color: 'bg-slate-500/10 text-slate-300 border-slate-500/30' };
    }
  };

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'critical':
        return { label: 'CRITICAL RISK', color: 'bg-rose-600 text-white font-bold' };
      case 'high':
        return { label: 'HIGH RISK', color: 'bg-amber-600 text-white font-bold' };
      case 'medium':
        return { label: 'MODERATE RISK', color: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' };
      default:
        return { label: 'STANDARD / LOW', color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' };
    }
  };

  const filteredClauses = activeDocument.clauses.filter((clause) => {
    const matchesSearch = 
      clause.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.clauseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || clause.category === selectedCategory;
    const matchesRisk = selectedRisk === 'all' || clause.riskLevel === selectedRisk;

    return matchesSearch && matchesCategory && matchesRisk;
  });

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Phase 2: Semantic Clause Classifier
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300 font-medium">{activeDocument.title}</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white">Smart Clause Highlighter & Tag Engine</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Color-coded inline clause classification highlighting obligations, deadlines, and high-risk liabilities.
          </p>
        </div>

        <button
          onClick={() => {
            PdfExportService.exportDocumentReport(activeDocument, riskScorecard);
            addAuditLog('EXPORT_CLAUSE_HIGHLIGHTS_PDF');
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Annotated Summary</span>
        </button>
      </div>

      <div className="glass-panel p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search clauses, keywords, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Clause Types</option>
              <option value="liability" className="bg-slate-900">Liability & Caps</option>
              <option value="payment" className="bg-slate-900">Payment & Fees</option>
              <option value="indemnity" className="bg-slate-900">Indemnification</option>
              <option value="termination" className="bg-slate-900">Termination & Data</option>
              <option value="intellectual_property" className="bg-slate-900">IP & Works</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Risk Tiers</option>
              <option value="critical" className="bg-slate-900">Critical Risk Only</option>
              <option value="high" className="bg-slate-900">High Risk Only</option>
              <option value="medium" className="bg-slate-900">Moderate Risk</option>
              <option value="low" className="bg-slate-900">Standard / Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredClauses.length === 0 ? (
          <div className="glass-panel p-8 text-center text-slate-400 text-xs rounded-xl">
            No clauses match your search or filter criteria.
          </div>
        ) : (
          filteredClauses.map((clause) => {
            const isExpanded = !!expandedClauses[clause.id];
            const catBadge = getCategoryBadge(clause.category);
            const riskBadge = getRiskBadge(clause.riskLevel);

            return (
              <div
                key={clause.id}
                className={`glass-panel rounded-2xl border transition-all ${
                  clause.riskLevel === 'critical'
                    ? 'border-rose-500/40 bg-rose-950/10 shadow-glow-rose'
                    : clause.riskLevel === 'high'
                    ? 'border-amber-500/30 bg-amber-950/10'
                    : 'border-slate-800 bg-slate-900/40'
                }`}
              >
                <div
                  onClick={() => toggleExpand(clause.id)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="font-mono text-xs font-bold text-slate-300 px-2 py-1 rounded bg-slate-800 border border-slate-700">
                      {clause.clauseNumber}
                    </span>
                    <h3 className="text-sm font-bold text-white tracking-tight">{clause.title}</h3>
                    
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catBadge.color}`}>
                      {catBadge.label}
                    </span>

                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${riskBadge.color}`}>
                      {riskBadge.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {clause.deadline && (
                      <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {clause.deadline}
                      </span>
                    )}
                    <button className="p-1 rounded text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-800/80">
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {clause.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono text-slate-300 bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-rose-400" />
                        Raw Clause Text:
                      </h4>
                      <p className="text-xs font-mono text-slate-300 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                        {clause.originalText}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-cyan-300 mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        Plain-Language Translation:
                      </h4>
                      <p className="text-xs text-slate-100 bg-slate-900/90 p-3.5 rounded-xl border border-cyan-500/20 leading-relaxed font-sans">
                        {clause.simplifiedText.plain}
                      </p>
                    </div>

                    {clause.actionRequired && (
                      <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-300 font-semibold">Recommended Strategic Step: </strong>
                          <span className="text-slate-200">{clause.actionRequired}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
