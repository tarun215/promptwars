import { describe, it, expect } from 'vitest';
import { LegalAiEngine } from '../services/legalAiEngine';
import { VectorStoreService } from '../services/vectorStore';
import { SecurityService } from '../services/security';
import { sampleDocuments } from '../data/sampleDocuments';

describe('Problem Statement & 7-Use-Case Alignment Suite', () => {
  const primaryDoc = sampleDocuments[0];
  const comparisonDoc = sampleDocuments[1] || sampleDocuments[0];

  it('Use Case 1: Simplifying complex legal documents with multi-persona translations & readability', () => {
    const clause = primaryDoc.clauses[0];
    const plainSimplification = LegalAiEngine.simplifyLegalClause(clause, 'plain');
    const executiveSimplification = LegalAiEngine.simplifyLegalClause(clause, 'executive');
    const bulletedSimplification = LegalAiEngine.simplifyLegalClause(clause, 'bulleted');

    expect(plainSimplification).toBeDefined();
    expect(plainSimplification.length).toBeGreaterThan(10);
    expect(executiveSimplification).toBeDefined();
    expect(bulletedSimplification).toContain('•');

    // Flesch-Kincaid formula verification
    const readability = LegalAiEngine.calculateReadability(clause.originalText);
    expect(readability.gradeLevel).toBeGreaterThan(0);
    expect(readability.readingEase).toBeGreaterThan(0);
    expect(readability.wordCount).toBeGreaterThan(0);
  });

  it('Use Case 2: Comparing contracts, agreements, or policies', () => {
    const report = LegalAiEngine.compareContracts(primaryDoc, comparisonDoc);

    expect(report.docAId).toBe(primaryDoc.id);
    expect(report.docBId).toBe(comparisonDoc.id);
    expect(report.similarityScore).toBeGreaterThanOrEqual(0);
    expect(report.similarityScore).toBeLessThanOrEqual(100);
    expect(report.diffs.length).toBeGreaterThan(0);
    expect(report.negotiationRecommendations.length).toBeGreaterThan(0);
  });

  it('Use Case 3: Highlighting important clauses, obligations, risks, or inconsistencies', () => {
    const highlights = LegalAiEngine.highlightImportantClauses(primaryDoc);
    const riskScorecard = LegalAiEngine.evaluateDocumentRisk(primaryDoc);

    expect(highlights.criticalClauses).toBeDefined();
    expect(highlights.obligations).toBeDefined();
    expect(riskScorecard.overallScore).toBeGreaterThan(0);
    expect(riskScorecard.overallScore).toBeLessThanOrEqual(100);
    expect(riskScorecard.findings.length).toBeGreaterThan(0);
    expect(riskScorecard.scoreBreakdown.liabilityExposure).toBeGreaterThan(0);
  });

  it('Use Case 4: Answering questions based on provided legal documents (RAG + Citations)', () => {
    VectorStoreService.indexDocument(primaryDoc);
    const result = LegalAiEngine.answerQuestion(primaryDoc, 'What is the limitation of liability cap?');

    expect(result.answer).toContain('liability');
    expect(result.citations.length).toBeGreaterThan(0);
    expect(result.citations[0].clauseTitle).toBeDefined();
    expect(result.suggestedFollowUps.length).toBeGreaterThan(0);
  });

  it('Use Case 5: Helping users understand their options and potential next steps ("What-If" Disputes)', () => {
    const simulation = LegalAiEngine.simulateScenario(primaryDoc, 'What if payment is 60 days late?');

    expect(simulation.title).toBeDefined();
    expect(simulation.likelyOutcome).toContain('payment');
    expect(simulation.riskShift).toBe('increases');
    expect(simulation.financialExposureImpact).toBeDefined();
    expect(simulation.suggestedCounterClause).toBeDefined();
  });

  it('Use Case 6: Generating summaries, checklists, or other actionable outputs', () => {
    const outputs = LegalAiEngine.generateSummaryAndChecklist(primaryDoc);

    expect(outputs.executiveSummary).toContain(primaryDoc.title);
    expect(outputs.actionableChecklist.length).toBeGreaterThan(0);
    expect(outputs.actionableChecklist[0].task).toBeDefined();
    expect(outputs.actionableChecklist[0].priority).toBeDefined();
    expect(outputs.coreObligations).toBeDefined();
  });

  it('Use Case 7: Helping users prepare information or questions for a legal professional', () => {
    const prepKit = LegalAiEngine.generateLawyerPrepKit(primaryDoc);

    expect(prepKit.consultationOverview).toContain(primaryDoc.title);
    expect(prepKit.keyFacts.length).toBeGreaterThan(0);
    expect(prepKit.criticalQuestions.length).toBeGreaterThan(0);
    expect(prepKit.criticalQuestions[0].question).toBeDefined();
    expect(prepKit.timeline.length).toBeGreaterThan(0);
    expect(prepKit.obligationsMatrix.length).toBeGreaterThan(0);
  });

  it('Ethical AI Guardrail: Non-legal advice disclaimer and audit integrity', () => {
    const log = SecurityService.logAction('standard_user', 'client@test.com', 'PREPARE_LAWYER_KIT', primaryDoc.id, primaryDoc.title);
    expect(log.status).toBe('SUCCESS');
    expect(log.hash).toBeDefined();
    expect(log.prevHash).toBeDefined();

    const integrity = SecurityService.verifyAuditLogIntegrity();
    expect(integrity.isValid).toBe(true);
  });
});
