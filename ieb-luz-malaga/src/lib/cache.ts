// Simple in-memory cache for YouTube API responses
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      memoryUsage: this.cache.size,
    };
  }
}

// Create a singleton instance
export const youtubeCache = new MemoryCache();

// Cache keys
export const CACHE_KEYS = {
  CHANNEL_INFO: (channelId: string) => `channel:${channelId}`,
  VIDEOS_LIST: (channelId: string) => `videos:${channelId}`,
  VIDEO_DETAILS: (videoIds: string) => `details:${videoIds}`,
} as const;

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  CHANNEL_INFO: 24 * 60 * 60 * 1000, // 24 hours
  VIDEOS_LIST: 10 * 60 * 1000, // 10 minutes
  VIDEO_DETAILS: 30 * 60 * 1000, // 30 minutes
} as const;
