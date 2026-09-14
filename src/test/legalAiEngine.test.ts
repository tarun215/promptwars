import { describe, it, expect } from 'vitest';
import { LegalAiEngine } from '../services/legalAiEngine';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';

describe('LegalAiEngine', () => {
  const sampleDoc = SAMPLE_DOCUMENTS[0];

  describe('Flesch-Kincaid NLP Scoring Engine', () => {
    it('should calculate readability metrics for text', () => {
      const text = 'The parties hereto unconditionally covenant and agree to indemnify and hold harmless the respective affiliates.';
      const score = LegalAiEngine.calculateReadability(text);

      expect(score.gradeLevel).toBeGreaterThan(0);
      expect(score.readingEase).toBeDefined();
      expect(score.wordCount).toBeGreaterThan(5);
      expect(score.readingTimeMinutes).toBeGreaterThan(0);
    });

    it('should show improved reading ease for simplified text', () => {
      const complex = 'Notwithstanding anything to the contrary contained herein, in no event shall either party be liable for consequential damages.';
      const simple = 'Neither side is responsible for indirect damages.';

      const scoreComplex = LegalAiEngine.calculateReadability(complex);
      const scoreSimple = LegalAiEngine.calculateReadability(simple);

      expect(scoreSimple.gradeLevel).toBeLessThan(scoreComplex.gradeLevel);
      expect(scoreSimple.readingEase).toBeGreaterThan(scoreComplex.readingEase);
    });
  });

  describe('Risk Scoring Heuristics', () => {
    it('should compute comprehensive risk scorecard for a legal document', () => {
      const riskScorecard = LegalAiEngine.evaluateDocumentRisk(sampleDoc);

      expect(riskScorecard.overallScore).toBeGreaterThanOrEqual(0);
      expect(riskScorecard.overallScore).toBeLessThanOrEqual(100);
      expect(riskScorecard.overallTier).toMatch(/low|medium|high|critical/);
      expect(riskScorecard.findings.length).toBeGreaterThan(0);
      expect(riskScorecard.scoreBreakdown).toBeDefined();
    });
  });

  describe('Multi-Contract Comparator', () => {
    it('should compare two documents and produce detailed diff matrix', () => {
      const docA = SAMPLE_DOCUMENTS[0];
      const docB = SAMPLE_DOCUMENTS[1];
      const comparison = LegalAiEngine.compareContracts(docA, docB);

      expect(comparison.similarityScore).toBeGreaterThan(0);
      expect(comparison.diffs.length).toBeGreaterThan(0);
      expect(comparison.negotiationRecommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Lawyer Prep Kit Generator', () => {
    it('should generate questions, facts, and timeline for legal counsel', () => {
      const prepKit = LegalAiEngine.generateLawyerPrepKit(sampleDoc);

      expect(prepKit.consultationOverview).toContain(sampleDoc.title);
      expect(prepKit.criticalQuestions.length).toBeGreaterThan(0);
      expect(prepKit.keyFacts.length).toBeGreaterThan(0);
      expect(prepKit.timeline.length).toBeGreaterThan(0);
      expect(prepKit.obligationsMatrix.length).toBeGreaterThan(0);
    });
  });

  describe('Scenario Dispute Simulation', () => {
    it('should model hypothetical scenarios with consequences and mitigations', () => {
      const simulation = LegalAiEngine.simulateScenario(sampleDoc, 'payment delay');

      expect(simulation.title).toBeDefined();
      expect(simulation.likelyOutcome).toBeDefined();
      expect(simulation.riskShift).toMatch(/increases|decreases|neutral/);
      expect(simulation.financialExposureImpact).toBeDefined();
      expect(simulation.suggestedCounterClause).toBeDefined();
      expect(simulation.relevantClauseIds.length).toBeGreaterThan(0);
    });
  });
});
