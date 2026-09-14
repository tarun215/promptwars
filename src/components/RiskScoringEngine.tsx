import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { useLegalApp } from '../context/LegalAppContext';
import { PdfExportService } from '../services/pdfExporter';

export const RiskScoringEngine: React.FC = () => {
  const { activeDocument, riskScorecard, addAuditLog } = useLegalApp();

  const handleExportScorecard = () => {
    PdfExportService.exportDocumentReport(activeDocument, riskScorecard);
    addAuditLog('EXPORT_RISK_SCORECARD_PDF');
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'critical':
        return {
          badge: 'bg-rose-600 text-white',
          text: 'text-rose-400',
          border: 'border-rose-500/40',
          bg: 'bg-rose-950/20',
          glow: 'shadow-glow-rose'
        };
      case 'high':
        return {
          badge: 'bg-amber-600 text-white',
          text: 'text-amber-400',
          border: 'border-amber-500/40',
          bg: 'bg-amber-950/20',
          glow: ''
        };
      case 'medium':
        return {
          badge: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40',
          text: 'text-yellow-400',
          border: 'border-yellow-500/30',
          bg: 'bg-yellow-950/20',
          glow: ''
        };
      default:
        return {
          badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
          text: 'text-emerald-400',
          border: 'border-emerald-500/30',
          bg: 'bg-emerald-950/20',
          glow: 'shadow-glow-emerald'
        };
    }
  };

  const colors = getTierColor(riskScorecard.overallTier);

  const breakdownBars = [
    { label: 'Liability & Indemnity Exposure', value: riskScorecard.scoreBreakdown.liabilityExposure, color: 'from-rose-500 to-amber-500' },
    { label: 'Termination & Data Retention Asymmetry', value: riskScorecard.scoreBreakdown.terminationAsymmetry, color: 'from-amber-500 to-yellow-500' },
    { label: 'Payment Terms & Late Penalties', value: riskScorecard.scoreBreakdown.paymentClarity, color: 'from-yellow-500 to-cyan-500' },
    { label: 'Intellectual Property & Work-for-Hire Retention', value: riskScorecard.scoreBreakdown.ipRetention, color: 'from-cyan-500 to-indigo-500' },
    { label: 'Regulatory & Compliance Strictness', value: riskScorecard.scoreBreakdown.complianceStrictness, color: 'from-indigo-500 to-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">
              Phase 3: Multi-Factor Risk Scoring Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300 font-medium">{activeDocument.title}</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white">Document Risk Scorecard & Exposure Matrix</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated multi-dimensional risk tiering, asymmetric clause detection, and AI mitigation guidance.
          </p>
        </div>

        <button
          onClick={handleExportScorecard}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Risk Scorecard (PDF)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`lg:col-span-4 glass-panel p-6 rounded-2xl border ${colors.border} ${colors.bg} ${colors.glow} flex flex-col items-center justify-center text-center space-y-3`}>
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center">
            {riskScorecard.overallTier === 'critical' || riskScorecard.overallTier === 'high' ? (
              <ShieldAlert className="w-8 h-8 text-rose-400" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            )}
          </div>

          <div>
            <div className="text-4xl font-mono font-bold text-white tracking-tight">
              {riskScorecard.overallScore}<span className="text-xl text-slate-400">/100</span>
            </div>
            <span className={`inline-block mt-2 text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full ${colors.badge}`}>
              {riskScorecard.overallTier} Risk Tier
            </span>
          </div>

          <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
            {riskScorecard.summary}
          </p>
        </div>

        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Dimensional Risk Decomposition
            </span>
            <span className="text-xs font-mono text-slate-400">Higher = Greater Risk Exposure</span>
          </h3>

          <div className="space-y-3 pt-1">
            {breakdownBars.map((bar, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">{bar.label}</span>
                  <span className="text-slate-100 font-mono font-bold">{bar.value}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className={`bg-gradient-to-r ${bar.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${bar.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Detailed AI Reasoning & Clause-Level Mitigations ({riskScorecard.findings.length})
        </h3>

        {riskScorecard.findings.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            No critical or high-risk findings detected in this agreement.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskScorecard.findings.map((finding, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2.5 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{finding.clauseTitle}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Impact: {finding.impactScore}/10
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{finding.issue}</p>
                </div>

                <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-200">Recommended Redline: </strong>
                    <span>{finding.recommendation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
