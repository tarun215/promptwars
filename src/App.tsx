import React, { useState } from 'react';
import { LegalAppProvider, useLegalApp } from './context/LegalAppContext';
import { Header } from './components/Header';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { PlainLanguageSimplifier } from './components/PlainLanguageSimplifier';
import { ClauseHighlighter } from './components/ClauseHighlighter';
import { RagChatInterface } from './components/RagChatInterface';
import { SummaryGenerator } from './components/SummaryGenerator';
import { ContractComparator } from './components/ContractComparator';
import { RiskScoringEngine } from './components/RiskScoringEngine';
import { LawyerPrepKit } from './components/LawyerPrepKit';
import { ScenarioExplorer } from './components/ScenarioExplorer';
import { GlossaryEngine } from './components/GlossaryEngine';
import { EnterpriseAuditDashboard } from './components/EnterpriseAuditDashboard';
import { ObservabilityDashboard } from './components/ObservabilityDashboard';
import { DocumentIngestionModal } from './components/DocumentIngestionModal';
import { LawyerReferralModal } from './components/LawyerReferralModal';
import { QualityScorecardModal } from './components/QualityScorecardModal';
import { ShieldCheck, Scale, Activity } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab } = useLegalApp();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#080c16] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header onOpenUpload={() => setIsUploadModalOpen(true)} />

      <DisclaimerBanner />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'simplifier' && <PlainLanguageSimplifier />}
        {activeTab === 'clauses' && <ClauseHighlighter />}
        {activeTab === 'rag_chat' && <RagChatInterface />}
        {activeTab === 'summaries' && <SummaryGenerator />}
        {activeTab === 'comparator' && <ContractComparator />}
        {activeTab === 'risk_engine' && <RiskScoringEngine />}
        {activeTab === 'lawyer_prep' && <LawyerPrepKit />}
        {activeTab === 'scenario_sandbox' && <ScenarioExplorer />}
        {activeTab === 'glossary' && <GlossaryEngine />}
        {activeTab === 'enterprise_audit' && (
          <div className="space-y-8">
            <EnterpriseAuditDashboard />
            <ObservabilityDashboard />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-12 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-200">LexiGuard AI Platform</span>
            <span>•</span>
            <span>All 4 Phases Fully Delivered</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> SOC 2 & GDPR Ready
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Activity className="w-3.5 h-3.5" /> WCAG 2.1 AA Compliant
            </span>
            <span>•</span>
            <span className="text-slate-400">
              Informational AI Assistant — Not Formal Legal Counsel
            </span>
          </div>
        </div>
      </footer>

      <DocumentIngestionModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
      <LawyerReferralModal />
      <QualityScorecardModal />
    </div>
  );
};

export function App() {
  return (
    <LegalAppProvider>
      <MainContent />
    </LegalAppProvider>
  );
}

export default App;
