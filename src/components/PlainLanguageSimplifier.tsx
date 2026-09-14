import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Zap, 
  TrendingDown, 
  Download,
  FileCheck2,
  FileText
} from 'lucide-react';
import { useLegalApp } from '../context/LegalAppContext';
import { LegalClause } from '../types';
import { PdfExportService } from '../services/pdfExporter';

export const PlainLanguageSimplifier: React.FC = () => {
  const { activeDocument, toneStyle, setToneStyle, riskScorecard, addAuditLog, recordTokenUsage } = useLegalApp();
  const [selectedClauseId, setSelectedClauseId] = useState<string>(activeDocument.clauses[0]?.id || '');
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const selectedClause: LegalClause = activeDocument.clauses.find((c) => c.id === selectedClauseId) || activeDocument.clauses[0];

  if (!selectedClause) {
    return (
      <div className="p-8 text-center text-slate-400">
        No clauses found in this document. Please upload or select another document.
      </div>
    );
  }

  const handleCopy = () => {
    const textToCopy = toneStyle === 'bulleted' 
      ? selectedClause.simplifiedText.bulleted.join('\n• ') 
      : toneStyle === 'executive' 
      ? selectedClause.simplifiedText.executive 
      : selectedClause.simplifiedText.plain;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addAuditLog('COPY_SIMPLIFIED_CLAUSE');
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const text = toneStyle === 'bulleted' 
        ? selectedClause.simplifiedText.bulleted.join('. ') 
        : selectedClause.simplifiedText.plain;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      recordTokenUsage('SIMPLIFY', 120, 45, 180);
    }
  };

  const handleExportPdf = () => {
    PdfExportService.exportDocumentReport(activeDocument, riskScorecard);
    addAuditLog('EXPORT_DOCUMENT_PDF');
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Phase 2: Plain-Language AI Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300 font-medium">{activeDocument.title}</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white">Side-by-Side Plain-Language Simplifier</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Converts dense legalese into 8th-grade accessible English with quantified readability scoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-700/80 p-1 rounded-xl">
            <button
              onClick={() => setToneStyle('plain')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                toneStyle === 'plain'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Plain English (Public)
            </button>
            <button
              onClick={() => setToneStyle('executive')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                toneStyle === 'executive'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Executive Brief
            </button>
            <button
              onClick={() => setToneStyle('bulleted')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                toneStyle === 'bulleted'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Action Checklist
            </button>
          </div>

          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {activeDocument.clauses.map((clause, idx) => {
          const isSelected = clause.id === selectedClause.id;
          return (
            <button
              key={clause.id}
              onClick={() => setSelectedClauseId(clause.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500 shadow-glow-indigo'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-300">
                {idx + 1}
              </span>
              <span>{clause.clauseNumber} — {clause.title.substring(0, 24)}...</span>
              {clause.riskLevel === 'critical' && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl border border-rose-500/20 bg-rose-950/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-rose-300">Original Legalese Complexity</span>
            <span className="text-xs font-mono font-bold text-rose-400">Grade {selectedClause.readabilityOriginal.gradeLevel}</span>
          </div>
          <p className="text-sm font-bold text-white mb-2">{selectedClause.readabilityOriginal.gradeLabel}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Reading Ease: {selectedClause.readabilityOriginal.readingEase}/100</span>
            <span>Complex Words: {selectedClause.readabilityOriginal.complexWordsPercentage}%</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-emerald-300">Simplified Readability</span>
            <span className="text-xs font-mono font-bold text-emerald-400">Grade {selectedClause.readabilitySimplified.gradeLevel}</span>
          </div>
          <p className="text-sm font-bold text-white mb-2">{selectedClause.readabilitySimplified.gradeLabel}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Reading Ease: {selectedClause.readabilitySimplified.readingEase}/100</span>
            <span>Est. Time: {selectedClause.readabilitySimplified.readingTimeMinutes} min</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-cyan-300">Cognitive Load Reduction</span>
            <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              -{(selectedClause.readabilityOriginal.gradeLevel - selectedClause.readabilitySimplified.gradeLevel).toFixed(1)} Grades
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Readability improved by +{Math.round(selectedClause.readabilitySimplified.readingEase - selectedClause.readabilityOriginal.readingEase)} ease points.
          </p>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full w-[82%]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-slate-200">Original Clause ({selectedClause.clauseNumber})</h3>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
              Raw Contract Text
            </span>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800/80 text-xs font-mono text-slate-300 leading-relaxed overflow-y-auto max-h-72">
            {selectedClause.originalText}
          </div>

          {selectedClause.riskExplanation && (
            <div className="mt-4 p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs">
              <p className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Legal Risk Analysis:
              </p>
              <p className="text-slate-300 leading-relaxed">{selectedClause.riskExplanation}</p>
            </div>
          )}
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-indigo-500/40 bg-indigo-950/10 flex flex-col shadow-glow-indigo">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-indigo-500/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                GenAI Plain Language Translation ({toneStyle.toUpperCase()} MODE)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeak}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isSpeaking
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title={isSpeaking ? 'Stop speech' : 'Read aloud with AI voice'}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 transition-colors"
                title="Copy simplified text"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-xl border border-indigo-500/20 text-xs text-slate-100 leading-relaxed overflow-y-auto max-h-72">
            {toneStyle === 'plain' && (
              <p className="text-slate-100 text-sm leading-relaxed">{selectedClause.simplifiedText.plain}</p>
            )}
            {toneStyle === 'executive' && (
              <p className="text-slate-100 text-sm leading-relaxed font-medium">
                {selectedClause.simplifiedText.executive}
              </p>
            )}
            {toneStyle === 'bulleted' && (
              <ul className="space-y-2">
                {selectedClause.simplifiedText.bulleted.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-200">
                    <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedClause.actionRequired && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
              <p className="font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                Actionable Recommendation:
              </p>
              <p className="text-slate-300 leading-relaxed">{selectedClause.actionRequired}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
