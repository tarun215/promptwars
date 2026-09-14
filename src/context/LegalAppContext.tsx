import React, { createContext, useContext, useState } from 'react';
import { 
  AuditLogEntry, 
  ComparisonReport, 
  Jurisdiction, 
  LawyerPrepKitData, 
  LegalDocument, 
  RiskScorecard, 
  Role, 
  TokenUsageMetric 
} from '../types';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';
import { LegalAiEngine } from '../services/legalAiEngine';
import { SecurityService } from '../services/security';

export type ActiveTab = 
  | 'simplifier' 
  | 'clauses' 
  | 'rag_chat' 
  | 'summaries' 
  | 'comparator' 
  | 'risk_engine' 
  | 'lawyer_prep' 
  | 'scenario_sandbox' 
  | 'glossary' 
  | 'enterprise_audit'
  | 'quality_scorecard';

interface LegalAppContextType {
  documents: LegalDocument[];
  activeDocument: LegalDocument;
  setActiveDocumentId: (id: string) => void;
  activeComparisonDoc: LegalDocument;
  setActiveComparisonDocId: (id: string) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userRole: Role;
  setUserRole: (role: Role) => void;
  jurisdiction: Jurisdiction;
  setJurisdiction: (j: Jurisdiction) => void;
  toneStyle: 'plain' | 'executive' | 'bulleted';
  setToneStyle: (t: 'plain' | 'executive' | 'bulleted') => void;
  
  riskScorecard: RiskScorecard;
  comparisonReport: ComparisonReport;
  lawyerPrepKit: LawyerPrepKitData;
  
  addCustomDocument: (doc: LegalDocument) => void;
  deleteDocument: (id: string) => void;
  
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, status?: 'SUCCESS' | 'ENCRYPTED' | 'FLAGGED') => void;
  
  tokenMetrics: TokenUsageMetric[];
  recordTokenUsage: (operation: TokenUsageMetric['operation'], promptTokens: number, completionTokens: number, latencyMs: number) => void;
  totalSpentUsd: number;
  
  showLawyerReferralModal: boolean;
  setShowLawyerReferralModal: (show: boolean) => void;
  showQualityModal: boolean;
  setShowQualityModal: (show: boolean) => void;
}

const LegalAppContext = createContext<LegalAppContextType | undefined>(undefined);

export const LegalAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<LegalDocument[]>(SAMPLE_DOCUMENTS);
  const [activeDocumentId, setActiveDocumentIdState] = useState<string>(SAMPLE_DOCUMENTS[0].id);
  const [activeComparisonDocId, setActiveComparisonDocIdState] = useState<string>(SAMPLE_DOCUMENTS[1].id);
  const [activeTab, setActiveTab] = useState<ActiveTab>('simplifier');
  const [userRole, setUserRole] = useState<Role>('legal_reviewer');
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('US');
  const [toneStyle, setToneStyle] = useState<'plain' | 'executive' | 'bulleted'>('plain');
  const [showLawyerReferralModal, setShowLawyerReferralModal] = useState<boolean>(false);
  const [showQualityModal, setShowQualityModal] = useState<boolean>(false);

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(SecurityService.getAuditLogs());
  const [tokenMetrics, setTokenMetrics] = useState<TokenUsageMetric[]>([
    {
      id: 'tok-1',
      timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
      model: 'Claude 3.7 Sonnet',
      operation: 'RAG_QA',
      promptTokens: 842,
      completionTokens: 215,
      totalTokens: 1057,
      costUsd: 0.0058,
      latencyMs: 380
    },
    {
      id: 'tok-2',
      timestamp: new Date(Date.now() - 60000).toLocaleTimeString(),
      model: 'Claude 3.7 Sonnet',
      operation: 'RISK_ANALYSIS',
      promptTokens: 1240,
      completionTokens: 380,
      totalTokens: 1620,
      costUsd: 0.0094,
      latencyMs: 510
    }
  ]);

  const activeDocument = documents.find((d) => d.id === activeDocumentId) || documents[0];
  const activeComparisonDoc = documents.find((d) => d.id === activeComparisonDocId) || documents[1] || documents[0];

  const riskScorecard = LegalAiEngine.evaluateDocumentRisk(activeDocument);
  const comparisonReport = LegalAiEngine.compareContracts(activeDocument, activeComparisonDoc);
  const lawyerPrepKit = LegalAiEngine.generateLawyerPrepKit(activeDocument);

  const setActiveDocumentId = (id: string) => {
    setActiveDocumentIdState(id);
    const target = documents.find((d) => d.id === id);
    if (target) {
      SecurityService.logAction(
        userRole,
        `${userRole}@organization.legal`,
        'DOCUMENT_VIEW_SWITCH',
        target.id,
        target.fileName
      );
      setAuditLogs(SecurityService.getAuditLogs());
    }
  };

  const setActiveComparisonDocId = (id: string) => {
    setActiveComparisonDocIdState(id);
  };

  const addCustomDocument = (doc: LegalDocument) => {
    setDocuments((prev) => [doc, ...prev]);
    setActiveDocumentIdState(doc.id);
    SecurityService.logAction(
      userRole,
      `${userRole}@organization.legal`,
      'DOCUMENT_UPLOAD_AND_INGEST',
      doc.id,
      doc.fileName
    );
    setAuditLogs(SecurityService.getAuditLogs());
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => {
      const filtered = prev.filter((d) => d.id !== id);
      if (activeDocumentId === id && filtered.length > 0) {
        setActiveDocumentIdState(filtered[0].id);
      }
      return filtered;
    });
    SecurityService.logAction(
      userRole,
      `${userRole}@organization.legal`,
      'DOCUMENT_GDPR_PURGE',
      id,
      'Deleted Record'
    );
    setAuditLogs(SecurityService.getAuditLogs());
  };

  const addAuditLog = (action: string, status: 'SUCCESS' | 'ENCRYPTED' | 'FLAGGED' = 'SUCCESS') => {
    SecurityService.logAction(
      userRole,
      `${userRole}@organization.legal`,
      action,
      activeDocument.id,
      activeDocument.fileName,
      status
    );
    setAuditLogs(SecurityService.getAuditLogs());
  };

  const recordTokenUsage = (
    operation: TokenUsageMetric['operation'],
    promptTokens: number,
    completionTokens: number,
    latencyMs: number
  ) => {
    const costUsd = Math.round(((promptTokens * 0.000003) + (completionTokens * 0.000015)) * 10000) / 10000;

    const newMetric: TokenUsageMetric = {
      id: `tok-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      model: 'Claude 3.7 Sonnet (GenAI)',
      operation,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      costUsd,
      latencyMs
    };

    setTokenMetrics((prev) => [newMetric, ...prev.slice(0, 49)]);
  };

  const totalSpentUsd = Math.round(tokenMetrics.reduce((acc, curr) => acc + curr.costUsd, 0) * 10000) / 10000;

  return (
    <LegalAppContext.Provider
      value={{
        documents,
        activeDocument,
        setActiveDocumentId,
        activeComparisonDoc,
        setActiveComparisonDocId,
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
        jurisdiction,
        setJurisdiction,
        toneStyle,
        setToneStyle,
        riskScorecard,
        comparisonReport,
        lawyerPrepKit,
        addCustomDocument,
        deleteDocument,
        auditLogs,
        addAuditLog,
        tokenMetrics,
        recordTokenUsage,
        totalSpentUsd,
        showLawyerReferralModal,
        setShowLawyerReferralModal,
        showQualityModal,
        setShowQualityModal
      }}
    >
      {children}
    </LegalAppContext.Provider>
  );
};

export const useLegalApp = () => {
  const context = useContext(LegalAppContext);
  if (!context) {
    throw new Error('useLegalApp must be used within a LegalAppProvider');
  }
  return context;
};
