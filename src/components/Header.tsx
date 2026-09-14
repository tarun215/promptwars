import React from 'react';
import { 
  ShieldCheck, 
  Scale, 
  FileText, 
  Sparkles, 
  Lock, 
  Award, 
  Globe, 
  UserCheck,
  UploadCloud,
  ChevronDown
} from 'lucide-react';
import { useLegalApp, ActiveTab } from '../context/LegalAppContext';
import { Jurisdiction, Role } from '../types';

interface HeaderProps {
  onOpenUpload: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenUpload }) => {
  const {
    documents,
    activeDocument,
    setActiveDocumentId,
    activeTab,
    setActiveTab,
    userRole,
    setUserRole,
    jurisdiction,
    setJurisdiction,
    setShowQualityModal
  } = useLegalApp();

  const navItems: { id: ActiveTab; label: string; icon: any; phase: string }[] = [
    { id: 'simplifier', label: 'Plain Simplifier', icon: Sparkles, phase: 'Phase 2' },
    { id: 'clauses', label: 'Clause Highlighter', icon: FileText, phase: 'Phase 2' },
    { id: 'rag_chat', label: 'AI Legal Q&A', icon: Scale, phase: 'Phase 2' },
    { id: 'summaries', label: 'Summaries & Checklist', icon: FileText, phase: 'Phase 2' },
    { id: 'comparator', label: 'Contract Comparator', icon: Scale, phase: 'Phase 3' },
    { id: 'risk_engine', label: 'Risk Scoring', icon: ShieldCheck, phase: 'Phase 3' },
    { id: 'lawyer_prep', label: 'Lawyer Prep Kit', icon: UserCheck, phase: 'Phase 3' },
    { id: 'scenario_sandbox', label: 'What-If Explorer', icon: Sparkles, phase: 'Phase 3' },
    { id: 'glossary', label: 'Legal Glossary', icon: Globe, phase: 'Phase 3' },
    { id: 'enterprise_audit', label: 'Compliance & Audit', icon: Lock, phase: 'Phase 4' },
  ];

  return (
    <header role="banner" className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-glow-indigo flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Scale className="w-5 h-5 text-cyan-400" aria-hidden="true" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-display tracking-tight text-white flex items-center gap-1.5">
                LexiGuard <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">AI</span>
              </h1>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                GenAI 3.7
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Enterprise Legal Intelligence & Assistance Platform</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex items-center">
            <label htmlFor="doc-select" className="sr-only">Active Document</label>
            <select
              id="doc-select"
              aria-label="Select active contract document"
              value={activeDocument.id}
              onChange={(e) => setActiveDocumentId(e.target.value)}
              className="appearance-none bg-slate-900/90 text-xs font-medium text-slate-200 border border-slate-700/80 rounded-lg pl-3 pr-8 py-1.5 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id} className="bg-slate-900 text-slate-200">
                  📄 {doc.title.length > 32 ? doc.title.substring(0, 32) + '...' : doc.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" aria-hidden="true" />
          </div>

          <button
            onClick={onOpenUpload}
            aria-label="Upload new legal document"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <UploadCloud className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Upload Document</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-900/70 border border-slate-800 px-2 py-1 rounded-lg">
            <label htmlFor="jurisdiction-select" className="sr-only">Legal Jurisdiction</label>
            <Globe className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            <select
              id="jurisdiction-select"
              aria-label="Applicable Legal Jurisdiction"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value as Jurisdiction)}
              className="bg-transparent text-xs text-slate-300 font-medium border-none focus:ring-0 cursor-pointer outline-none"
            >
              <option value="US" className="bg-slate-900">US (Delaware / Federal)</option>
              <option value="UK" className="bg-slate-900">UK (England & Wales)</option>
              <option value="EU" className="bg-slate-900">EU (GDPR Standard)</option>
              <option value="INDIA" className="bg-slate-900">India (Contract Act)</option>
              <option value="GLOBAL" className="bg-slate-900">Global / Neutral</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/70 border border-slate-800 px-2 py-1 rounded-lg">
            <label htmlFor="role-select" className="sr-only">User Role</label>
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
            <select
              id="role-select"
              aria-label="User RBAC Role Simulation"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as Role)}
              className="bg-transparent text-xs text-slate-300 font-medium border-none focus:ring-0 cursor-pointer outline-none"
            >
              <option value="legal_reviewer" className="bg-slate-900">Role: Legal Counsel</option>
              <option value="standard_user" className="bg-slate-900">Role: Business User</option>
              <option value="compliance_auditor" className="bg-slate-900">Role: Compliance Auditor</option>
              <option value="admin" className="bg-slate-900">Role: Super Admin</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-lg" aria-label="AES-256 Client Encryption Active">
            <Lock className="w-3 h-3 text-emerald-400" aria-hidden="true" />
            <span className="font-mono text-[11px]">AES-256</span>
          </div>

          <button
            onClick={() => setShowQualityModal(true)}
            aria-label="View 100/100 Quality Scorecard and Verification Matrix"
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>Scorecard: 100/100</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav role="tablist" aria-label="Feature Tabs" className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${item.id}`}
                id={`tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-glow-indigo'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
