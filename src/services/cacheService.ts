export interface CacheStats {
  hits: number;
  misses: number;
  totalRequests: number;
  hitRatio: number;
  estimatedTokensSaved: number;
  latencySavedMs: number;
}

export class LRUCacheService<T> {
  private capacity: number;
  private ttlMs: number;
  private cache: Map<string, { value: T; expiresAt: number }>;
  private hits: number = 0;
  private misses: number = 0;
  private estimatedTokensSaved: number = 0;
  private latencySavedMs: number = 0;

  constructor(capacity: number = 100, ttlMinutes: number = 60) {
    this.capacity = capacity;
    this.ttlMs = ttlMinutes * 60 * 1000;
    this.cache = new Map();
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    const now = Date.now();

    if (!item) {
      this.misses++;
      return null;
    }

    if (now > item.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // Refresh position in Map for LRU order
    this.cache.delete(key);
    this.cache.set(key, item);

    this.hits++;
    this.estimatedTokensSaved += 450; // Average prompt token count
    this.latencySavedMs += 320; // Average LLM generation latency avoided
    return item.value;
  }

  set(key: string, value: T): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Remove oldest (first) item
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs
    });
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    this.estimatedTokensSaved = 0;
    this.latencySavedMs = 0;
  }

  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      totalRequests: total,
      hitRatio: total > 0 ? Math.round((this.hits / total) * 100) / 100 : 0,
      estimatedTokensSaved: this.estimatedTokensSaved,
      latencySavedMs: this.latencySavedMs
    };
  }
}

// Global Singletons for Platform Caches
export const queryResultCache = new LRUCacheService<{ answer: string; citations: any[]; suggestedFollowUps: string[] }>(100, 30);
export const vectorEmbeddingCache = new LRUCacheService<Float32Array>(500, 120);
export const documentAnalysisCache = new LRUCacheService<any>(50, 60);
