import { describe, it, expect } from 'vitest';
import { VectorStoreService } from '../services/vectorStore';
import { LegalDocument } from '../types';

describe('VectorStoreService', () => {
  const mockDoc: LegalDocument = {
    id: 'doc-test-1',
    title: 'Test NDA Agreement',
    fileName: 'test_nda.pdf',
    fileType: 'pdf',
    documentType: 'Independent Contractor NDA',
    uploadedAt: '2025-01-01',
    isEncrypted: false,
    jurisdiction: 'US',
    metadata: {
      partyA: 'Acme Corp',
      partyB: 'Beta LLC',
      effectiveDate: '2025-01-01',
      governingLaw: 'California',
      contractValue: '$0'
    },
    rawText: 'This is a test non-disclosure agreement.',
    clauses: [
      {
        id: 'cl-indemnity',
        clauseNumber: 'Sec 1',
        title: 'Indemnification Obligations',
        category: 'indemnity',
        riskLevel: 'high',
        tags: ['Indemnity', 'Liability'],
        originalText: 'Customer agrees to defend, indemnify, and hold harmless Vendor from any and all claims, damages, liabilities, and legal expenses without cap.',
        simplifiedText: {
          plain: 'You pay for all vendor lawsuits without any dollar limit.',
          executive: 'Uncapped indemnity risk for customer.',
          bulleted: ['Customer indemnifies vendor', 'No liability cap']
        },
        riskExplanation: 'Uncapped indemnity poses unlimited financial risk.',
        actionRequired: 'Cap indemnity to contract value.',
        readabilityOriginal: {
          gradeLevel: 14.2,
          gradeLabel: 'College Senior',
          readingEase: 35.0,
          readingTimeMinutes: 1,
          wordCount: 20,
          sentenceCount: 1,
          complexWordsPercentage: 30
        },
        readabilitySimplified: {
          gradeLevel: 7.0,
          gradeLabel: '7th Grade',
          readingEase: 80.0,
          readingTimeMinutes: 0.5,
          wordCount: 10,
          sentenceCount: 1,
          complexWordsPercentage: 5
        }
      },
      {
        id: 'cl-termination',
        clauseNumber: 'Sec 2',
        title: 'Termination for Convenience',
        category: 'termination',
        riskLevel: 'medium',
        tags: ['Termination', '30-day notice'],
        originalText: 'Either party may terminate this agreement upon thirty (30) calendar days written notice to the other party.',
        simplifiedText: {
          plain: 'Either side can cancel with 30 days notice.',
          executive: '30-day mutual termination right.',
          bulleted: ['Mutual termination', '30 days notice']
        },
        riskExplanation: 'Standard termination window.',
        actionRequired: 'Accept as standard.',
        readabilityOriginal: {
          gradeLevel: 10.0,
          gradeLabel: 'High School',
          readingEase: 55.0,
          readingTimeMinutes: 0.5,
          wordCount: 16,
          sentenceCount: 1,
          complexWordsPercentage: 15
        },
        readabilitySimplified: {
          gradeLevel: 6.0,
          gradeLabel: '6th Grade',
          readingEase: 85.0,
          readingTimeMinutes: 0.3,
          wordCount: 8,
          sentenceCount: 1,
          complexWordsPercentage: 0
        }
      }
    ]
  };

  it('should correctly index document and extract searchable chunks', () => {
    VectorStoreService.indexDocument(mockDoc);
    const results = VectorStoreService.search('indemnity liability defense', mockDoc.id, 2);

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].clauseId).toBe('cl-indemnity');
    expect(results[0].relevanceScore).toBeGreaterThanOrEqual(0.1);
  });

  it('should return relevant citations for termination queries', () => {
    VectorStoreService.indexDocument(mockDoc);
    const results = VectorStoreService.search('how to cancel with thirty days notice', mockDoc.id, 1);

    expect(results.length).toBe(1);
    expect(results[0].clauseId).toBe('cl-termination');
    expect(results[0].clauseTitle).toBe('Termination for Convenience');
  });

  it('should handle empty or whitespace-only search queries gracefully', () => {
    const results = VectorStoreService.search('   ');
    expect(results).toEqual([]);
  });
});
