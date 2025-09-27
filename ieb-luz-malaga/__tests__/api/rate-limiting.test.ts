import { NextRequest } from 'next/server';
import { rateLimitContact, rateLimitNewsletter, getRateLimitInfo, rateLimitStore } from '@/lib/rate-limit';

// Mock NextResponse for testing
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
      headers: {
        get: (key: string) => init?.headers?.[key],
        set: jest.fn(),
      },
    })),
    next: jest.fn(() => ({ 
      headers: {
        get: jest.fn(),
        set: jest.fn(),
      },
    })),
  },
}));

// Mock NextRequest for testing
function createMockRequest(ip: string = '192.168.1.1'): NextRequest {
  const headers = new Headers();
  headers.set('x-forwarded-for', ip);
  
  return {
    headers,
    ip,
    nextUrl: new URL('http://localhost:3000/api/test'),
  } as NextRequest;
}

describe('Rate Limiting Implementation', () => {
  beforeEach(() => {
    // Clear any existing rate limit data
    rateLimitStore.store.clear();
  });

  describe('Contact API Rate Limiting', () => {
    it('should allow requests within the limit', async () => {
      const request = createMockRequest('192.168.1.1');
      
      // First 5 requests should be allowed
      for (let i = 0; i < 5; i++) {
        const response = await rateLimitContact(request, 'contact');
        expect(response).toBeNull(); // Null means request is allowed
      }
    });

    it('should block requests exceeding the limit', async () => {
      const request = createMockRequest('192.168.1.2');
      
      // First 5 requests should be allowed
      for (let i = 0; i < 5; i++) {
        const response = await rateLimitContact(request, 'contact');
        expect(response).toBeNull();
      }
      
      // 6th request should be blocked
      const blockedResponse = await rateLimitContact(request, 'contact');
      expect(blockedResponse).not.toBeNull();
      expect(blockedResponse?.status).toBe(429);
    });

    it('should include proper headers in blocked response', async () => {
      const request = createMockRequest('192.168.1.3');
      
      // Exceed the limit
      for (let i = 0; i < 6; i++) {
        await rateLimitContact(request, 'contact');
      }
      
      const blockedResponse = await rateLimitContact(request, 'contact');
      
      expect(blockedResponse?.headers.get('X-RateLimit-Limit')).toBe('5');
      expect(blockedResponse?.headers.get('X-RateLimit-Remaining')).toBe('0');
      expect(blockedResponse?.headers.get('Retry-After')).toBeDefined();
    });

    it('should return proper JSON response for blocked requests', async () => {
      const request = createMockRequest('192.168.1.4');
      
      // Exceed the limit
      for (let i = 0; i < 6; i++) {
        await rateLimitContact(request, 'contact');
      }
      
      const blockedResponse = await rateLimitContact(request, 'contact');
      const responseBody = await blockedResponse?.json();
      
      expect(responseBody).toMatchObject({
        success: false,
        error: 'Rate limit exceeded',
        limit: 5,
        remaining: 0,
      });
      expect(responseBody.message).toContain('contato');
    });
  });

  describe('Newsletter API Rate Limiting', () => {
    it('should allow requests within the newsletter limit', async () => {
      const request = createMockRequest('192.168.1.5');
      
      // First 3 requests should be allowed
      for (let i = 0; i < 3; i++) {
        const response = await rateLimitNewsletter(request, 'newsletter');
        expect(response).toBeNull();
      }
    });

    it('should block requests exceeding the newsletter limit', async () => {
      const request = createMockRequest('192.168.1.6');
      
      // First 3 requests should be allowed
      for (let i = 0; i < 3; i++) {
        const response = await rateLimitNewsletter(request, 'newsletter');
        expect(response).toBeNull();
      }
      
      // 4th request should be blocked
      const blockedResponse = await rateLimitNewsletter(request, 'newsletter');
      expect(blockedResponse).not.toBeNull();
      expect(blockedResponse?.status).toBe(429);
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
  });

  describe('Different IP Addresses', () => {
    it('should track rate limits separately for different IPs', async () => {
      const request1 = createMockRequest('192.168.1.10');
      const request2 = createMockRequest('192.168.1.11');
      
      // Both IPs should be able to make requests independently
      const response1 = await rateLimitContact(request1, 'contact');
      const response2 = await rateLimitContact(request2, 'contact');
      
      expect(response1).toBeNull();
      expect(response2).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle requests with no IP gracefully', async () => {
      const request = createMockRequest('unknown');
      
      const response = await rateLimitContact(request, 'contact');
      // Should not throw an error, either allow or block based on 'unknown' IP
      expect(response).toBeDefined();
    });

    it('should handle malformed IP addresses', async () => {
      const request = createMockRequest('invalid-ip');
      
      const response = await rateLimitContact(request, 'contact');
      expect(response).toBeDefined();
    });
  });

  describe('Rate Limit Store', () => {
    it('should track requests correctly', () => {
      const key = '192.168.1.20:contact';
      const entry = rateLimitStore.increment(key, 900000);
      
      expect(entry.count).toBe(1);
      expect(entry.resetTime).toBeGreaterThan(Date.now());
    });

    it('should clean up expired entries', () => {
      const key = '192.168.1.21:contact';
      const entry = rateLimitStore.increment(key, 1000); // 1 second window
      
      expect(entry.count).toBe(1);
      
      // Wait for expiration and cleanup
      setTimeout(() => {
        rateLimitStore.cleanup();
        const expiredEntry = rateLimitStore.get(key);
        expect(expiredEntry).toBeUndefined();
      }, 1100);
    });
  });
});
