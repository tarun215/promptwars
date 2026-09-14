import React from 'react';
import { AlertTriangle, ExternalLink, Scale, MapPin } from 'lucide-react';
import { useLegalApp } from '../context/LegalAppContext';

export const DisclaimerBanner: React.FC = () => {
  const { jurisdiction, setShowLawyerReferralModal } = useLegalApp();

  return (
    <div className="bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-amber-950/40 border-y border-amber-500/20 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-amber-200/90">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <p>
            <strong className="font-semibold text-amber-300">Important Legal Disclaimer:</strong> LexiGuard AI provides informational analysis and automated translation assistance. It does <em>not</em> constitute formal legal advice or create an attorney-client relationship.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>Jurisdiction: {jurisdiction} Law</span>
          </div>

          <button
            onClick={() => setShowLawyerReferralModal(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-indigo-300 hover:text-indigo-200 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/30 px-2.5 py-1 rounded transition-colors"
          >
            <Scale className="w-3.5 h-3.5 text-indigo-400" />
            <span>Consult a Licensed Lawyer</span>
            <ExternalLink className="w-3 h-3 text-indigo-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
