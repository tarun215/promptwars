import React, { useState } from 'react';
import { X, Scale, MapPin, Star, CheckCircle2, Award } from 'lucide-react';
import { useLegalApp } from '../context/LegalAppContext';
import { PdfExportService } from '../services/pdfExporter';

export const LawyerReferralModal: React.FC = () => {
  const { showLawyerReferralModal, setShowLawyerReferralModal, activeDocument, lawyerPrepKit } = useLegalApp();
  const [connectedAttorney, setConnectedAttorney] = useState<string | null>(null);

  if (!showLawyerReferralModal) return null;

  const attorneys = [
    {
      id: 'att-1',
      name: 'Victoria Vance, Esq.',
      firm: 'Vance & Sterling LLP',
      location: 'Wilmington, Delaware & New York, NY',
      specialty: 'Enterprise SaaS & Commercial Tech Contracts',
      rating: 4.9,
      reviewsCount: 84,
      hourlyRate: '$450/hr (Free 15-min AI intake review)',
      jurisdictions: ['US', 'GLOBAL'],
      verifiedBar: 'Delaware Bar #58192'
    },
    {
      id: 'att-2',
      name: 'Marcus Sterling, J.D.',
      firm: 'Metropolitan Commercial Counsel',
      location: 'New York, NY',
      specialty: 'Commercial Real Estate & Triple-Net Leases',
      rating: 4.8,
      reviewsCount: 62,
      hourlyRate: '$395/hr',
      jurisdictions: ['US'],
      verifiedBar: 'NY Bar #419082'
    },
    {
      id: 'att-3',
      name: 'Elena Rostova, LL.M.',
      firm: 'Apex IP & Venture Legal',
      location: 'San Francisco, CA & London, UK',
      specialty: 'IP Assignment, Non-Competes & Contractor Law',
      rating: 5.0,
      reviewsCount: 112,
      hourlyRate: '$480/hr',
      jurisdictions: ['US', 'UK', 'EU'],
      verifiedBar: 'California State Bar #298410'
    }
  ];

  const handleConnect = (name: string) => {
    setConnectedAttorney(name);
    PdfExportService.exportLawyerPrepKitPdf(activeDocument, lawyerPrepKit);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-3xl rounded-2xl p-6 border border-slate-700 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            setShowLawyerReferralModal(false);
            setConnectedAttorney(null);
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Licensed Attorney Referral Network</h2>
            <p className="text-xs text-slate-400">
              Connect directly with verified bar-admitted attorneys experienced in your document's jurisdiction.
            </p>
          </div>
        </div>

        {connectedAttorney && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-semibold">Consultation Request Generated for {connectedAttorney}!</strong>
              <p className="text-slate-300 mt-1">
                Your Lawyer Consultation Prep Kit has been downloaded automatically. Send this packet to the attorney to streamline your intake call.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3.5">
          {attorneys.map((att) => (
            <div
              key={att.id}
              className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{att.name}</h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                    <Award className="w-3 h-3" /> {att.verifiedBar}
                  </span>
                </div>
                <p className="text-slate-300 font-medium">{att.firm} • {att.specialty}</p>
                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" /> {att.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-300">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {att.rating} ({att.reviewsCount} reviews)
                  </span>
                </div>
                <p className="text-cyan-300 font-mono text-[11px] pt-1">{att.hourlyRate}</p>
              </div>

              <button
                onClick={() => handleConnect(att.name)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm shrink-0"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Request Consultation Packet</span>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          <strong>Referral Notice:</strong> LexiGuard AI provides directories and automated prep kits as a convenience. We do not receive legal fee-splits and do not practice law.
        </div>
      </div>
    </div>
  );
};
