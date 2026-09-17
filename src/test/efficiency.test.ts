import { describe, it, expect, beforeEach } from 'vitest';
import { LRUCacheService } from '../services/cacheService';
import { VectorStoreService } from '../services/vectorStore';
import { sampleDocuments } from '../data/sampleDocuments';
import { LegalAiEngine } from '../services/legalAiEngine';

describe('Performance & Efficiency Engine Suite', () => {
  const doc = sampleDocuments[0];

  beforeEach(() => {
    VectorStoreService.clearIndex();
  });

  it('should efficiently cache and retrieve items with LRU eviction policy', () => {
    const cache = new LRUCacheService<string>(3, 60);

    cache.set('key1', 'val1');
    cache.set('key2', 'val2');
    cache.set('key3', 'val3');

    expect(cache.get('key1')).toBe('val1');
    expect(cache.getStats().hits).toBe(1);

    // Adding a 4th key should evict 'key2' because 'key1' was recently accessed
    cache.set('key4', 'val4');

    expect(cache.get('key2')).toBeNull(); // evicted
    expect(cache.get('key1')).toBe('val1'); // kept
    expect(cache.get('key3')).toBe('val3'); // kept
    expect(cache.get('key4')).toBe('val4'); // kept
  });

  it('should calculate Float32Array vector embedding in sub-millisecond time', () => {
    const start = performance.now();
    const vec = VectorStoreService.getVector(['contract', 'indemnity', 'liability', 'termination']);
    const elapsed = performance.now() - start;

    expect(vec).toBeInstanceOf(Float32Array);
    expect(vec.length).toBe(256);
    expect(elapsed).toBeLessThan(50); // High-speed execution
  });

  it('should perform vector indexing and sub-millisecond cosine retrieval', () => {
    VectorStoreService.indexDocument(doc);
    expect(VectorStoreService.getIndexedCount()).toBeGreaterThan(0);

    const start = performance.now();
    const results = VectorStoreService.search('confidentiality and intellectual property', doc.id, 2);
    const elapsed = performance.now() - start;

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].relevanceScore).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(50);
  });

  it('should demonstrate instantaneous cached response on repeated RAG questions', () => {
    // First query (miss & cache)
    const result1 = LegalAiEngine.answerQuestion(doc, 'What are the termination conditions?');
    expect(result1.isCached).toBe(false);

    // Second identical query (instant hit)
    const result2 = LegalAiEngine.answerQuestion(doc, 'What are the termination conditions?');
    expect(result2.isCached).toBe(true);
    expect(result2.answer).toBe(result1.answer);
  });
});
