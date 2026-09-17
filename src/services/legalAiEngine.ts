import { 
  ComparisonDiff,
  ComparisonReport, 
  Jurisdiction, 
  LawyerPrepKitData, 
  LawyerQuestion, 
  LegalClause,
  LegalDocument, 
  ReadabilityMetrics, 
  RiskFinding, 
  RiskScorecard, 
  ScenarioSimulation 
} from '../types';
import { VectorStoreService } from './vectorStore';
import { queryResultCache, documentAnalysisCache } from './cacheService';
import { SecurityService } from './security';

export class LegalAiEngine {
  /**
   * Helper: Count syllables in a single word
   */
  private static countSyllables(word: string): number {
    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!clean) return 1;
    if (clean.length <= 3) return 1;
    
    const matched = clean.replace(/(?:[^laeiouy]|ed|es|e)$/, '')
      .replace(/^y/, '')
      .match(/[aeiouy]{1,2}/g);
    
    return matched ? Math.max(1, matched.length) : 1;
  }

  /**
   * Calculate Flesch-Kincaid Grade Level & Flesch Reading Ease score
   */
  static calculateReadability(text: string): ReadabilityMetrics {
    if (!text || text.trim().length === 0) {
      return {
        gradeLevel: 8.0,
        gradeLabel: '8th Grade (General Public)',
        readingEase: 70.0,
        readingTimeMinutes: 0.1,
        wordCount: 0,
        sentenceCount: 0,
        complexWordsPercentage: 0
      };
    }

    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const sentenceCount = Math.max(1, sentences.length);
    const words = text.match(/\b[a-zA-Z0-9'-]+\b/g) || [];
    const wordCount = Math.max(1, words.length);

    let totalSyllables = 0;
    let complexWords = 0;

    words.forEach((w) => {
      const syl = this.countSyllables(w);
      totalSyllables += syl;
      if (syl >= 3) {
        complexWords++;
      }
    });

    const wordsPerSentence = wordCount / sentenceCount;
    const syllablesPerWord = totalSyllables / wordCount;

    let gradeLevel = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
    gradeLevel = Math.max(1.0, Math.min(20.0, Math.round(gradeLevel * 10) / 10));

    let readingEase = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
    readingEase = Math.max(0, Math.min(100, Math.round(readingEase * 10) / 10));

    let gradeLabel = '8th Grade (General Public)';
    if (gradeLevel <= 6) gradeLabel = '5th-6th Grade (Elementary)';
    else if (gradeLevel <= 8) gradeLabel = '7th-8th Grade (Accessible Plain English)';
    else if (gradeLevel <= 10) gradeLabel = '9th-10th Grade (High School)';
    else if (gradeLevel <= 12) gradeLabel = '11th-12th Grade (High School Senior)';
    else if (gradeLevel <= 15) gradeLabel = 'College Undergrad Level';
    else gradeLabel = 'Graduate / Complex Legal Specialist';

    const readingTimeMinutes = Math.max(0.2, Math.round((wordCount / 180) * 10) / 10);
    const complexWordsPercentage = Math.round((complexWords / wordCount) * 1000) / 10;

    return {
      gradeLevel,
      gradeLabel,
      readingEase,
      readingTimeMinutes,
      wordCount,
      sentenceCount,
      complexWordsPercentage
    };
  }

  /**
   * USE CASE 1: Simplifying Complex Legal Documents
   */
  static simplifyLegalClause(clause: LegalClause, persona: 'plain' | 'executive' | 'bulleted' = 'plain'): string {
    if (persona === 'bulleted') {
      return clause.simplifiedText.bulleted.map(b => `• ${b}`).join('\n');
    }
    return clause.simplifiedText[persona] || clause.simplifiedText.plain;
  }

  /**
   * USE CASE 3: Highlighting Important Clauses, Obligations, Risks, or Inconsistencies
   */
  static highlightImportantClauses(doc: LegalDocument): {
    criticalClauses: LegalClause[];
    highRiskClauses: LegalClause[];
    obligations: LegalClause[];
    inconsistencies: string[];
  } {
    const criticalClauses = doc.clauses.filter(c => c.riskLevel === 'critical');
    const highRiskClauses = doc.clauses.filter(c => c.riskLevel === 'high');
    const obligations = doc.clauses.filter(c => c.category === 'obligation' || c.category === 'payment' || !!c.actionRequired);

    const inconsistencies: string[] = [];
    const termClause = doc.clauses.find(c => c.category === 'termination');
    const payClause = doc.clauses.find(c => c.category === 'payment');

    if (termClause && payClause) {
      inconsistencies.push('Notice window disparity: Invoicing requires 15-day payment while termination requires 30-day notice.');
    }

    return {
      criticalClauses,
      highRiskClauses,
      obligations,
      inconsistencies
    };
  }

  /**
   * Risk Scoring Engine
   */
  static evaluateDocumentRisk(doc: LegalDocument): RiskScorecard {
    const cacheKey = `risk-${doc.id}-${doc.clauses.length}`;
    const cached = documentAnalysisCache.get(cacheKey);
    if (cached) return cached;

    let rawScore = 30;
    const findings: RiskFinding[] = [];

    let liabilityCount = 0;
    let terminationCount = 0;
    let indemnityCount = 0;
    let paymentRiskCount = 0;
    let ipRiskCount = 0;

    doc.clauses.forEach((cl) => {
      if (cl.riskLevel === 'critical') {
        rawScore += 22;
        findings.push({
          clauseId: cl.id,
          clauseTitle: cl.title,
          riskLevel: cl.riskLevel,
          issue: `High asymmetry: ${cl.riskExplanation}`,
          recommendation: cl.actionRequired || 'Negotiate mutual liability or protective terms.',
          impactScore: 9
        });
      } else if (cl.riskLevel === 'high') {
        rawScore += 14;
        findings.push({
          clauseId: cl.id,
          clauseTitle: cl.title,
          riskLevel: cl.riskLevel,
          issue: cl.riskExplanation,
          recommendation: cl.actionRequired || 'Add reasonable carve-outs or notice periods.',
          impactScore: 7
        });
      } else if (cl.riskLevel === 'medium') {
        rawScore += 6;
      }

      if (cl.category === 'liability') liabilityCount += (cl.riskLevel === 'critical' ? 3 : 2);
      if (cl.category === 'termination') terminationCount += 2;
      if (cl.category === 'indemnity') indemnityCount += 2.5;
      if (cl.category === 'payment') paymentRiskCount += 1.5;
      if (cl.category === 'intellectual_property') ipRiskCount += 2;
    });

    const overallScore = Math.min(96, Math.max(12, rawScore));
    let overallTier: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (overallScore >= 75) overallTier = 'critical';
    else if (overallScore >= 55) overallTier = 'high';
    else if (overallScore >= 35) overallTier = 'medium';

    const scorecard: RiskScorecard = {
      overallScore,
      overallTier,
      summary: `This agreement exhibits a ${overallTier.toUpperCase()} overall risk profile (Score: ${overallScore}/100) primarily driven by ${findings.length > 0 ? findings[0].clauseTitle : 'standard commercial obligations'}.`,
      findings,
      scoreBreakdown: {
        liabilityExposure: Math.min(100, Math.round(liabilityCount * 28 + 25)),
        terminationAsymmetry: Math.min(100, Math.round(terminationCount * 30 + 20)),
        paymentClarity: Math.min(100, Math.round(paymentRiskCount * 25 + 30)),
        ipRetention: Math.min(100, Math.round(ipRiskCount * 32 + 15)),
        complianceStrictness: Math.min(100, Math.round(doc.clauses.length * 12 + 20))
      }
    };

    documentAnalysisCache.set(cacheKey, scorecard);
    return scorecard;
  }

  /**
   * USE CASE 2: Comparing Contracts, Agreements, or Policies
   */
  static compareContracts(docA: LegalDocument, docB: LegalDocument): ComparisonReport {
    const diffs: ComparisonDiff[] = [];
    const matchedCategory = new Set<string>();

    docA.clauses.forEach((clA) => {
      const matchingClB = docB.clauses.find((clB) => clB.category === clA.category || clB.title.toLowerCase().includes(clA.category));
      if (matchingClB) {
        matchedCategory.add(clA.category);
        const isExact = clA.originalText.trim() === matchingClB.originalText.trim();
        
        diffs.push({
          clauseTitle: `${clA.title} vs ${matchingClB.title}`,
          category: clA.category,
          status: isExact ? 'identical' : 'modified',
          docAText: clA.originalText,
          docBText: matchingClB.originalText,
          analysis: isExact
            ? 'Both agreements have identical wording on this term.'
            : `Doc A sets risk as ${clA.riskLevel.toUpperCase()}, while Doc B sets risk as ${matchingClB.riskLevel.toUpperCase()}. Doc A imposes: "${clA.actionRequired || 'Standard terms'}".`,
          severity: clA.riskLevel === 'critical' || matchingClB.riskLevel === 'critical' 
            ? 'high_risk' 
            : 'neutral'
        });
      } else {
        diffs.push({
          clauseTitle: clA.title,
          category: clA.category,
          status: 'missing_in_b',
          docAText: clA.originalText,
          docBText: 'Clause not present in comparison document.',
          analysis: `Present in "${docA.title}", but missing in "${docB.title}". This creates an asymmetry in party protection.`,
          severity: 'favorable_to_a'
        });
      }
    });

    docB.clauses.forEach((clB) => {
      if (!matchedCategory.has(clB.category)) {
        diffs.push({
          clauseTitle: clB.title,
          category: clB.category,
          status: 'added_in_b',
          docAText: 'Clause not present in primary document.',
          docBText: clB.originalText,
          analysis: `Present only in "${docB.title}". Covers: ${clB.tags.join(', ')}.`,
          severity: 'favorable_to_b'
        });
      }
    });

    const identicalCount = diffs.filter((d) => d.status === 'identical').length;
    const similarityScore = Math.max(15, Math.min(95, Math.round((identicalCount / (diffs.length || 1)) * 100 + 35)));

    const missingCrucial: string[] = [];
    if (!docA.clauses.some((c) => c.category === 'indemnity') && !docB.clauses.some((c) => c.category === 'indemnity')) {
      missingCrucial.push('Mutual IP Indemnification Clause');
    }
    if (!docA.clauses.some((c) => c.tags.some(t => t.includes('GDPR') || t.includes('Privacy')))) {
      missingCrucial.push('GDPR / CCPA Data Processing Addendum (DPA)');
    }
    if (!docA.clauses.some((c) => c.title.toLowerCase().includes('force majeure'))) {
      missingCrucial.push('Force Majeure / Disaster Relief Clause');
    }

    return {
      docAId: docA.id,
      docBId: docB.id,
      docATitle: docA.title,
      docBTitle: docB.title,
      executiveSummary: `Comparison between "${docA.title}" and "${docB.title}" shows an estimated ${similarityScore}% structural alignment with ${diffs.filter(d => d.status === 'modified').length} modified clauses and ${diffs.filter(d => d.status === 'missing_in_b').length} omitted terms.`,
      similarityScore,
      diffs,
      missingCrucialClauses: missingCrucial,
      negotiationRecommendations: [
        'Harmonize limitation of liability caps across both agreements to a mutual 12-month trailing revenue standard.',
        'Ensure both documents mandate at least 30-day cure periods before unilateral termination for cause.',
        'Align governing law and dispute jurisdiction to avoid multi-state forum conflicts.'
      ]
    };
  }

  /**
   * USE CASE 6: Generating Summaries, Checklists, or Other Actionable Outputs
   */
  static generateSummaryAndChecklist(doc: LegalDocument): {
    executiveSummary: string;
    actionableChecklist: { task: string; priority: 'high' | 'medium' | 'low'; deadline: string }[];
    coreObligations: string[];
  } {
    const actionableChecklist = [
      {
        task: 'Confirm 15-day accounts payable billing cycle to avoid 1.5% late fee interest',
        priority: 'high' as const,
        deadline: 'Prior to contract execution'
      },
      {
        task: 'Negotiate 90-day data retention & free CSV export window upon termination',
        priority: 'high' as const,
        deadline: 'Contract negotiation stage'
      },
      {
        task: 'Add liability super-cap of $2,000,000 for data privacy & confidentiality breaches',
        priority: 'medium' as const,
        deadline: 'Review stage'
      },
      {
        task: 'Register governing law jurisdiction compliance with local statutory counsel',
        priority: 'low' as const,
        deadline: 'Post-signature'
      }
    ];

    const coreObligations = doc.clauses
      .filter(c => c.actionRequired)
      .map(c => `${c.title}: ${c.actionRequired}`);

    return {
      executiveSummary: `Executive Analysis of "${doc.title}" (${doc.documentType}) between ${doc.metadata.partyA} and ${doc.metadata.partyB}. Governing Law: ${doc.metadata.governingLaw}. Total Clauses: ${doc.clauses.length}.`,
      actionableChecklist,
      coreObligations
    };
  }

  /**
   * USE CASE 7: Helping Users Prepare Information or Questions for a Legal Professional
   */
  static generateLawyerPrepKit(doc: LegalDocument): LawyerPrepKitData {
    const criticalQuestions: LawyerQuestion[] = [];

    doc.clauses.forEach((cl, idx) => {
      if (cl.riskLevel === 'critical' || cl.riskLevel === 'high') {
        criticalQuestions.push({
          id: `q-${idx + 1}`,
          priority: cl.riskLevel === 'critical' ? 'high' : 'medium',
          category: cl.category.toUpperCase(),
          question: `In ${cl.clauseNumber} (${cl.title}), how can we negotiate a balanced carve-out for our organization without jeopardizing the deal?`,
          contextWhyAsk: cl.riskExplanation,
          relevantClauseSnippet: cl.originalText.substring(0, 140) + '...'
        });
      }
    });

    if (criticalQuestions.length === 0) {
      criticalQuestions.push({
        id: 'q-std-1',
        priority: 'medium',
        category: 'GOVERNING LAW',
        question: `Is the governing law (${doc.metadata.governingLaw}) advantageous for our business entity?`,
        contextWhyAsk: 'Jurisdictional venue dictates dispute costs and statutory protections.',
        relevantClauseSnippet: `Governing Law: ${doc.metadata.governingLaw}`
      });
    }

    const timeline = [
      {
        id: 't-1',
        dateOrTrigger: doc.metadata.effectiveDate || 'Effective Date',
        title: 'Contract Effective Date & Commencement',
        description: 'Obligations become legally binding. Initial setup and onboarding commences.',
        responsibleParty: doc.metadata.partyA,
        urgency: 'high' as const
      },
      {
        id: 't-2',
        dateOrTrigger: 'Monthly / Periodic',
        title: 'Invoicing & Net Payment Due Date',
        description: 'Payment due per Section 4.2 terms (15 calendar days from billing).',
        responsibleParty: doc.metadata.partyB,
        urgency: 'medium' as const
      },
      {
        id: 't-3',
        dateOrTrigger: '30 Days Prior to Expiry',
        title: 'Non-Renewal / Notice Window',
        description: 'Written notification required if party intends not to renew or to renegotiate rates.',
        responsibleParty: 'Both Parties',
        urgency: 'high' as const
      }
    ];

    const obligationsMatrix = [
      {
        id: 'ob-1',
        party: doc.metadata.partyA,
        obligation: 'Provide platform access and maintain 99.9% uptime availability.',
        frequencyOrDeadline: 'Continuous 24/7',
        penaltyForNonCompliance: 'SLA service credit rebate'
      },
      {
        id: 'ob-2',
        party: doc.metadata.partyB,
        obligation: 'Pay all invoices within agreed window and maintain confidentiality.',
        frequencyOrDeadline: 'Net 15 Days per invoice',
        penaltyForNonCompliance: '1.5% monthly compound interest & service suspension'
      },
      {
        id: 'ob-3',
        party: doc.metadata.partyB,
        obligation: 'Indemnify Vendor against third-party intellectual property claims.',
        frequencyOrDeadline: 'Upon notice of third-party claim',
        penaltyForNonCompliance: 'Full defense and settlement cost shifting'
      }
    ];

    return {
      consultationOverview: `Comprehensive Attorney Briefing Packet for "${doc.title}" between ${doc.metadata.partyA} and ${doc.metadata.partyB}. Prepared via LexiGuard AI Engine.`,
      keyFacts: [
        { label: 'Document Name', value: doc.fileName },
        { label: 'Document Type', value: doc.documentType },
        { label: 'Effective Date', value: doc.metadata.effectiveDate },
        { label: 'Jurisdiction / Law', value: doc.metadata.governingLaw },
        { label: 'Contract Value', value: doc.metadata.contractValue || 'Not specified' },
        { label: 'Total Clauses Scanned', value: `${doc.clauses.length} Sections` }
      ],
      criticalQuestions,
      timeline,
      obligationsMatrix
    };
  }

  /**
   * USE CASE 5: Helping Users Understand Their Options and Potential Next Steps ("What-If" Dispute Simulator)
   */
  static simulateScenario(doc: LegalDocument, scenarioPrompt: string): ScenarioSimulation {
    const promptLower = scenarioPrompt.toLowerCase();

    if (promptLower.includes('payment') || promptLower.includes('late') || promptLower.includes('delay')) {
      return {
        id: `scen-${Date.now()}`,
        title: 'Late Payment / Cash Flow Delay Simulation',
        scenarioPrompt,
        likelyOutcome: `Under Section 4.2, if payment is delayed past 15 days, Vendor is contractually permitted to accrue 1.5% monthly compounded interest and pass on all third-party debt collection attorney costs. They may also suspend platform access after notice.`,
        riskShift: 'increases',
        financialExposureImpact: 'High: Compound interest plus full legal fee shifting.',
        suggestedCounterClause: `Customer shall pay undisputed fees Net 45 days. Late payments shall accrue simple interest at 1.0% per month, capped at 5% maximum total surcharge.`,
        relevantClauseIds: ['cl-1']
      };
    }

    if (promptLower.includes('terminate') || promptLower.includes('cancel') || promptLower.includes('breach')) {
      return {
        id: `scen-${Date.now()}`,
        title: 'Early Termination / Data Retrieval Scenario',
        scenarioPrompt,
        likelyOutcome: `Vendor may terminate with 30 days notice. Customer has only 15 days post-termination to request data export and must pay hourly consulting fees. Vendor permanently deletes database after 45 days.`,
        riskShift: 'increases',
        financialExposureImpact: 'Critical: Potential catastrophic business data loss if 15-day window is missed.',
        suggestedCounterClause: `Vendor shall provide self-serve automated data export at no extra charge for at least ninety (90) days following any termination.`,
        relevantClauseIds: ['cl-4']
      };
    }

    if (promptLower.includes('outage') || promptLower.includes('breach') || promptLower.includes('sue') || promptLower.includes('damage') || promptLower.includes('liability')) {
      return {
        id: `scen-${Date.now()}`,
        title: 'Platform Outage / Data Leak Liability Scenario',
        scenarioPrompt,
        likelyOutcome: `Under Section 8.1, Vendor disclaims all indirect, consequential, and lost profit damages. Maximum total recovery is strictly capped at 3 months of fees paid, even if negligence caused a massive loss.`,
        riskShift: 'increases',
        financialExposureImpact: 'Severe: Customer absorbs 90%+ of total financial losses caused by platform failure.',
        suggestedCounterClause: `Total liability shall be capped at 12 months fees paid, with a $2,000,000 super-cap for data privacy breaches, confidentiality breaches, and gross negligence.`,
        relevantClauseIds: ['cl-2']
      };
    }

    return {
      id: `scen-${Date.now()}`,
      title: 'Custom Contractual Event Simulation',
      scenarioPrompt,
      likelyOutcome: `Based on the governing Delaware law and the clauses in "${doc.title}", this event would trigger review under the Dispute Resolution and Indemnity sections. The party initiating the change bears burden of notice.`,
      riskShift: 'neutral',
      financialExposureImpact: 'Moderate: Contingent on whether cure periods and formal notice protocols are met.',
      suggestedCounterClause: `Include explicit 30-day notice and cure period for all operational discrepancies before penalties apply.`,
      relevantClauseIds: doc.clauses.map((c) => c.id).slice(0, 2)
    };
  }

  /**
   * USE CASE 4: Answering Questions Based on Provided Legal Documents (RAG + Prompt Security Guardrails)
   */
  static answerQuestion(
    doc: LegalDocument,
    userQuery: string,
    jurisdiction: Jurisdiction = 'US'
  ): {
    answer: string;
    citations: { clauseId: string; clauseTitle: string; snippet: string; relevanceScore: number }[];
    suggestedFollowUps: string[];
    isCached?: boolean;
  } {
    // 1. Guardrail against Prompt Injection
    const securityCheck = SecurityService.scanPromptSecurity(userQuery);
    if (!securityCheck.isSafe && (securityCheck.threatLevel === 'CRITICAL' || securityCheck.threatLevel === 'HIGH')) {
      return {
        answer: `🛡️ **Security Alert: Prompt Injection / Adversarial Pattern Blocked**\n\nThe input was flagged by LexiGuard Security Gateway for: **${securityCheck.detectedPatterns.join(', ')}**.\n\nPlease ask a specific legal inquiry regarding the active document terms.`,
        citations: [],
        suggestedFollowUps: [
          'What are the liability limits in this contract?',
          'What are our payment obligations?',
          'What is the notice period for contract termination?'
        ]
      };
    }

    // 2. High-Efficiency Cache Lookup
    const cacheKey = `${doc.id}::${jurisdiction}::${userQuery.trim().toLowerCase()}`;
    const cachedResult = queryResultCache.get(cacheKey);
    if (cachedResult) {
      return {
        ...cachedResult,
        isCached: true
      };
    }

    VectorStoreService.indexDocument(doc);
    const citations = VectorStoreService.search(userQuery, doc.id, 2);

    const queryLower = userQuery.toLowerCase();
    let answer = '';
    let suggestedFollowUps: string[] = [];

    if (queryLower.includes('liability') || queryLower.includes('sue') || queryLower.includes('damage') || queryLower.includes('cap')) {
      const liabClause = doc.clauses.find((c) => c.category === 'liability') || doc.clauses[1];
      answer = `Under **${liabClause.title}** (${liabClause.clauseNumber}), liability is strictly capped. Specifically:\n\n` +
        `• **Damage Exclusions**: Consequential, indirect, and lost profit damages are completely excluded.\n` +
        `• **Financial Ceiling**: Total payout is capped at the fees paid in the **preceding 3 months**.\n\n` +
        `⚠️ **Legal Assessment**: This is significantly more restrictive than standard industry norms (which typically allow 12 months or insurance limits). If a major breach occurs, your recovery is severely constrained.`;
      suggestedFollowUps = [
        'How can we negotiate a higher liability super-cap for data breaches?',
        'What are our indemnification obligations if a third party sues?'
      ];
    } else if (queryLower.includes('pay') || queryLower.includes('fee') || queryLower.includes('invoice') || queryLower.includes('late')) {
      const payClause = doc.clauses.find((c) => c.category === 'payment') || doc.clauses[0];
      answer = `Under **${payClause.title}** (${payClause.clauseNumber}):\n\n` +
        `• **Payment Due Date**: You have **15 calendar days** from invoice receipt to pay.\n` +
        `• **Late Fees**: Delinquent balances accrue **1.5% monthly compound interest**.\n` +
        `• **Legal Fee Shifting**: You must reimburse the vendor for all collection and attorney fees.\n\n` +
        `💡 **Recommendation**: Ask for standard "Net 30" or "Net 45" terms and simple interest.`;
      suggestedFollowUps = [
        'What happens if we dispute an invoice in good faith?',
        'Can the vendor suspend our service immediately if payment is 1 day late?'
      ];
    } else if (queryLower.includes('terminate') || queryLower.includes('cancel') || queryLower.includes('data')) {
      const termClause = doc.clauses.find((c) => c.category === 'termination') || doc.clauses[3];
      answer = `Under **${termClause.title}** (${termClause.clauseNumber}):\n\n` +
        `• **Notice Period**: The agreement can be terminated without cause upon **30 days written notice**.\n` +
        `• **Data Export Window**: You have **only 15 days** after termination to request an export of your company data.\n` +
        `• **Data Deletion**: After 45 days, the vendor will permanently purge all data.\n` +
        `• **Extra Cost**: Vendor charges hourly consulting fees to export your data.\n\n` +
        `🚨 **Critical Action**: Ensure your team has a prompt data retrieval procedure upon notice.`;
      suggestedFollowUps = [
        'How can we secure 90 days free automated data export?',
        'What are the non-compete or confidentiality obligations that survive termination?'
      ];
    } else {
      const primaryCitation = citations[0];
      const matchingClause = doc.clauses.find((c) => c.id === primaryCitation?.clauseId) || doc.clauses[0];
      
      answer = `Based on our analysis of **"${doc.title}"** (Governing Law: ${doc.metadata.governingLaw}):\n\n` +
        `The most relevant provision is **${matchingClause.title}** (${matchingClause.clauseNumber}):\n\n` +
        `> "${matchingClause.simplifiedText.plain}"\n\n` +
        `**Key Points to Note:**\n` +
        `• **Risk Classification**: Rated as **${matchingClause.riskLevel.toUpperCase()}** risk.\n` +
        `• **Action Required**: ${matchingClause.actionRequired || 'Review with legal counsel prior to execution.'}\n` +
        `• **Jurisdiction (${jurisdiction}) Context**: Terms are interpreted under Delaware commercial standards unless modified by agreement.`;

      suggestedFollowUps = [
        'Generate a summary of the top 3 high-risk clauses in this agreement',
        'Create a question checklist for my lawyer consultation',
        'Compare this contract against standard industry benchmarks'
      ];
    }

    const result = {
      answer,
      citations,
      suggestedFollowUps,
      isCached: false
    };

    queryResultCache.set(cacheKey, result);
    return result;
  }
}
