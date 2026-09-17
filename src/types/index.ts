export type Role = 'admin' | 'legal_reviewer' | 'standard_user' | 'compliance_auditor';

export type Jurisdiction = 'US' | 'UK' | 'EU' | 'INDIA' | 'GLOBAL';

export type SecurityPermission = 
  | 'VIEW_DOC'
  | 'SIMPLIFY_DOC'
  | 'RAG_QUERY'
  | 'COMPARE_DOC'
  | 'RUN_SIMULATION'
  | 'EXPORT_PDF'
  | 'AUDIT_LOG_VIEW'
  | 'GDPR_PURGE'
  | 'ADMIN_OVERRIDE';

export type ClauseCategory = 
  | 'risk'
  | 'obligation'
  | 'deadline'
  | 'indemnity'
  | 'termination'
  | 'intellectual_property'
  | 'payment'
  | 'penalty'
  | 'confidentiality'
  | 'liability'
  | 'general';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ReadabilityMetrics {
  gradeLevel: number;
  gradeLabel: string;
  readingEase: number;
  readingTimeMinutes: number;
  wordCount: number;
  sentenceCount: number;
  complexWordsPercentage: number;
}

export interface LegalClause {
  id: string;
  clauseNumber: string;
  title: string;
  originalText: string;
  simplifiedText: {
    plain: string;
    executive: string;
    bulleted: string[];
  };
  category: ClauseCategory;
  riskLevel: RiskLevel;
  riskExplanation: string;
  actionRequired?: string;
  deadline?: string;
  keyParties?: string[];
  tags: string[];
  readabilityOriginal: ReadabilityMetrics;
  readabilitySimplified: ReadabilityMetrics;
}

export interface LegalDocument {
  id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'custom';
  documentType: 'Master Services Agreement' | 'Commercial Lease' | 'Independent Contractor NDA' | 'Terms of Service' | 'Other';
  uploadedAt: string;
  isEncrypted: boolean;
  jurisdiction: Jurisdiction;
  rawText: string;
  clauses: LegalClause[];
  metadata: {
    partyA: string;
    partyB: string;
    effectiveDate: string;
    governingLaw: string;
    contractValue?: string;
  };
}

export interface RiskFinding {
  clauseId: string;
  clauseTitle: string;
  riskLevel: RiskLevel;
  issue: string;
  recommendation: string;
  impactScore: number;
}

export interface RiskScorecard {
  overallScore: number;
  overallTier: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  findings: RiskFinding[];
  scoreBreakdown: {
    liabilityExposure: number;
    terminationAsymmetry: number;
    paymentClarity: number;
    ipRetention: number;
    complianceStrictness: number;
  };
}

export interface ComparisonDiff {
  clauseTitle: string;
  category: ClauseCategory;
  status: 'identical' | 'modified' | 'added_in_b' | 'missing_in_b';
  docAText?: string;
  docBText?: string;
  analysis: string;
  severity: 'favorable_to_a' | 'favorable_to_b' | 'neutral' | 'high_risk';
}

export interface ComparisonReport {
  docAId: string;
  docBId: string;
  docATitle: string;
  docBTitle: string;
  executiveSummary: string;
  similarityScore: number;
  diffs: ComparisonDiff[];
  missingCrucialClauses: string[];
  negotiationRecommendations: string[];
}

export interface CitationReference {
  clauseId: string;
  clauseTitle: string;
  snippet: string;
  relevanceScore: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: CitationReference[];
  suggestedFollowUps?: string[];
  isStreaming?: boolean;
}

export interface LawyerQuestion {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  question: string;
  contextWhyAsk: string;
  relevantClauseSnippet: string;
}

export interface KeyTimelineEvent {
  id: string;
  dateOrTrigger: string;
  title: string;
  description: string;
  responsibleParty: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface PartyObligation {
  id: string;
  party: string;
  obligation: string;
  frequencyOrDeadline: string;
  penaltyForNonCompliance: string;
}

export interface LawyerPrepKitData {
  consultationOverview: string;
  keyFacts: { label: string; value: string }[];
  criticalQuestions: LawyerQuestion[];
  timeline: KeyTimelineEvent[];
  obligationsMatrix: PartyObligation[];
}

export interface ScenarioSimulation {
  id: string;
  title: string;
  scenarioPrompt: string;
  likelyOutcome: string;
  riskShift: 'increases' | 'decreases' | 'neutral';
  financialExposureImpact: string;
  suggestedCounterClause: string;
  relevantClauseIds: string[];
}

export interface LegalTermGlossaryItem {
  term: string;
  pronunciation?: string;
  plainMeaning: string;
  latinOrigin?: string;
  exampleContext: string;
  jurisdictionNotes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userRole: Role;
  userEmail: string;
  action: string;
  documentId?: string;
  documentName?: string;
  ipAddress: string;
  status: 'SUCCESS' | 'ENCRYPTED' | 'FLAGGED';
  hash?: string;
  prevHash?: string;
}

export interface TokenUsageMetric {
  id: string;
  timestamp: string;
  model: string;
  operation: 'RAG_QA' | 'SIMPLIFY' | 'RISK_ANALYSIS' | 'COMPARE' | 'SCENARIO';
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
  latencyMs: number;
  cachedPercentage?: number;
}
