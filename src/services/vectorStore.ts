import { CitationReference, LegalDocument } from '../types';
import { vectorEmbeddingCache } from './cacheService';

export interface EmbeddedChunk {
  id: string;
  documentId: string;
  clauseId: string;
  clauseTitle: string;
  text: string;
  vector: Float32Array;
}

export class VectorStoreService {
  private static chunks: EmbeddedChunk[] = [];
  private static readonly VOCAB_SIZE = 256;

  private static tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);
  }

  /**
   * High-Efficiency Float32Array Vector Generation with LRU Caching
   */
  static getVector(tokens: string[]): Float32Array {
    const cacheKey = tokens.slice(0, 20).join('-');
    const cached = vectorEmbeddingCache.get(cacheKey);
    if (cached) return cached;

    const vector = new Float32Array(this.VOCAB_SIZE);

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      let hash = 0;
      for (let j = 0; j < token.length; j++) {
        hash = (hash << 5) - hash + token.charCodeAt(j);
        hash |= 0;
      }
      const index = Math.abs(hash) % this.VOCAB_SIZE;
      vector[index] += 1.0 / Math.sqrt(tokens.length || 1);
    }

    // L2-Normalization for unit sphere cosine distance
    let sumSq = 0;
    for (let i = 0; i < this.VOCAB_SIZE; i++) {
      sumSq += vector[i] * vector[i];
    }
    const magnitude = Math.sqrt(sumSq) || 1;
    for (let i = 0; i < this.VOCAB_SIZE; i++) {
      vector[i] /= magnitude;
    }

    vectorEmbeddingCache.set(cacheKey, vector);
    return vector;
  }

  /**
   * Fast Vector Dot Product (Cosine Similarity on Unit Vectors)
   */
  private static cosineSimilarity(vecA: Float32Array, vecB: Float32Array): number {
    let dot = 0;
    for (let i = 0; i < this.VOCAB_SIZE; i++) {
      dot += vecA[i] * vecB[i];
    }
    return Math.max(0, Math.min(1, dot));
  }

  static indexDocument(doc: LegalDocument): void {
    this.chunks = this.chunks.filter((c) => c.documentId !== doc.id);

    doc.clauses.forEach((clause) => {
      const fullText = `${clause.title} ${clause.originalText} ${clause.tags.join(' ')}`;
      const tokens = this.tokenize(fullText);
      const vector = this.getVector(tokens);

      this.chunks.push({
        id: `chunk-${clause.id}`,
        documentId: doc.id,
        clauseId: clause.id,
        clauseTitle: clause.title,
        text: clause.originalText,
        vector
      });
    });
  }

  static search(query: string, documentId?: string, topK: number = 3): CitationReference[] {
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0 || this.chunks.length === 0) {
      return [];
    }
    const queryVec = this.getVector(queryTokens);

    let candidateChunks = this.chunks;
    if (documentId) {
      candidateChunks = candidateChunks.filter((c) => c.documentId === documentId);
    }

    const scored = candidateChunks.map((chunk) => {
      const similarity = this.cosineSimilarity(queryVec, chunk.vector);
      const chunkLower = chunk.text.toLowerCase();
      let keywordBoost = 0;
      queryTokens.forEach((qt) => {
        if (chunkLower.includes(qt)) {
          keywordBoost += 0.08;
        }
      });

      return {
        chunk,
        score: Math.min(0.99, similarity + keywordBoost)
      };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK).map((item) => ({
      clauseId: item.chunk.clauseId,
      clauseTitle: item.chunk.clauseTitle,
      snippet: item.chunk.text.length > 180 ? item.chunk.text.substring(0, 180) + '...' : item.chunk.text,
      relevanceScore: Math.round(item.score * 100) / 100
    }));
  }

  static getIndexedCount(): number {
    return this.chunks.length;
  }

  static clearIndex(): void {
    this.chunks = [];
  }
}
