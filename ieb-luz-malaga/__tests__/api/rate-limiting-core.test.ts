import { rateLimitStore, getRateLimitInfo } from '@/lib/rate-limit';

describe('Rate Limiting Core Logic', () => {
  beforeEach(() => {
    // Clear any existing rate limit data
    rateLimitStore.store.clear();
  });

  describe('Rate Limit Store', () => {
    it('should track requests correctly', () => {
      const key = '192.168.1.1:contact';
      const entry = rateLimitStore.increment(key, 900000);
      
      expect(entry.count).toBe(1);
      expect(entry.resetTime).toBeGreaterThan(Date.now());
    });

    it('should increment count for same key', () => {
      const key = '192.168.1.2:contact';
      
      const entry1 = rateLimitStore.increment(key, 900000);
      expect(entry1.count).toBe(1);
      
      const entry2 = rateLimitStore.increment(key, 900000);
      expect(entry2.count).toBe(2);
    });

    it('should track different keys separately', () => {
      const key1 = '192.168.1.3:contact';
      const key2 = '192.168.1.4:contact';
      
      const entry1 = rateLimitStore.increment(key1, 900000);
      const entry2 = rateLimitStore.increment(key2, 900000);
      
      expect(entry1.count).toBe(1);
      expect(entry2.count).toBe(1);
    });

    it('should clean up expired entries', () => {
      const key = '192.168.1.5:contact';
      const entry = rateLimitStore.increment(key, 1000); // 1 second window
      
      expect(entry.count).toBe(1);
      
      // Wait for expiration and cleanup
      setTimeout(() => {
        rateLimitStore.cleanup();
        const expiredEntry = rateLimitStore.get(key);
        expect(expiredEntry).toBeUndefined();
      }, 1100);
    });

    it('should get remaining requests correctly', () => {
      const key = '192.168.1.6:contact';
      const maxRequests = 5;
      
      // First request
      rateLimitStore.increment(key, 900000);
      expect(rateLimitStore.getRemaining(key, maxRequests)).toBe(4);
      
      // Second request
      rateLimitStore.increment(key, 900000);
      expect(rateLimitStore.getRemaining(key, maxRequests)).toBe(3);
      
      // Third request
      rateLimitStore.increment(key, 900000);
      expect(rateLimitStore.getRemaining(key, maxRequests)).toBe(2);
    });
  });

  describe('Rate Limit Info', () => {
    it('should provide correct rate limit information', () => {
      const info = getRateLimitInfo('192.168.1.7', 'contact');
      
      expect(info).toMatchObject({
        key: '192.168.1.7:contact',
        limit: 5,
        windowMs: 900000, // 15 minutes
      });
      expect(info.remaining).toBeGreaterThanOrEqual(0);
      expect(info.remaining).toBeLessThanOrEqual(5);
    });

    it('should track remaining requests correctly', () => {
      const ip = '192.168.1.8';
      const endpoint = 'contact';
      
      // Make some requests
      for (let i = 0; i < 3; i++) {
        const key = `${ip}:${endpoint}`;
        rateLimitStore.increment(key, 900000);
      }
      
      const info = getRateLimitInfo(ip, endpoint);
      expect(info.remaining).toBe(2); // 5 - 3 = 2
    });
  });

  describe('Rate Limit Logic', () => {
    it('should detect when limit is exceeded', () => {
      const key = '192.168.1.9:contact';
      const maxRequests = 5;
      
      // Make requests up to the limit
      for (let i = 0; i < maxRequests; i++) {
        const entry = rateLimitStore.increment(key, 900000);
        expect(entry.count).toBe(i + 1);
      }
      
      // Next request should exceed the limit
      const exceededEntry = rateLimitStore.increment(key, 900000);
      expect(exceededEntry.count).toBe(maxRequests + 1);
      expect(exceededEntry.count > maxRequests).toBe(true);
    });

    it('should work with different endpoints', () => {
      const ip = '192.168.1.10';
      const contactKey = `${ip}:contact`;
      const newsletterKey = `${ip}:newsletter`;
      
      // Make requests to contact endpoint
      rateLimitStore.increment(contactKey, 900000);
      rateLimitStore.increment(contactKey, 900000);
      
      // Make requests to newsletter endpoint
      rateLimitStore.increment(newsletterKey, 3600000);
      
      // Check that they're tracked separately
      const contactEntry = rateLimitStore.get(contactKey);
      const newsletterEntry = rateLimitStore.get(newsletterKey);
      
      expect(contactEntry?.count).toBe(2);
      expect(newsletterEntry?.count).toBe(1);
    });
  });
});
