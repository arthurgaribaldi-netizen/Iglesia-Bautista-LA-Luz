import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';
import { RATE_LIMIT_CONFIG, validateRateLimitConfig } from './rate-limit-config';

// Rate limiting configuration interface
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string; // Custom error message
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
}

// Validate configuration on import
try {
  validateRateLimitConfig();
} catch (error) {
  logger.error('Rate limit configuration error:', error);
}

// Use configuration from config file
export const RATE_LIMIT_CONFIGS = {
  contact: RATE_LIMIT_CONFIG.contact,
  newsletter: RATE_LIMIT_CONFIG.newsletter,
  general: RATE_LIMIT_CONFIG.general,
} as const;

// In-memory store for rate limiting (in production, consider using Redis)
interface RateLimitEntry {
  count: number;
  resetTime: number;
  firstRequest: number;
}

class RateLimitStore {
  private store = new Map<string, RateLimitEntry>();

  get(key: string): RateLimitEntry | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    // Clean up expired entries
    if (Date.now() > entry.resetTime) {
      this.store.delete(key);
      return undefined;
    }

    return entry;
  }

  set(key: string, entry: RateLimitEntry): void {
    this.store.set(key, entry);
  }

  increment(key: string, windowMs: number): RateLimitEntry {
    const now = Date.now();
    const existing = this.get(key);

    if (!existing) {
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + windowMs,
        firstRequest: now,
      };
      this.set(key, newEntry);
      return newEntry;
    }

    existing.count++;
    this.set(key, existing);
    return existing;
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  // Get remaining requests for a key
  getRemaining(key: string, maxRequests: number): number {
    const entry = this.get(key);
    if (!entry) return maxRequests;
    return Math.max(0, maxRequests - entry.count);
  }

  // Get reset time for a key
  getResetTime(key: string): number | null {
    const entry = this.get(key);
    return entry ? entry.resetTime : null;
  }
}

// Global rate limit store
const rateLimitStore = new RateLimitStore();

// Clean up expired entries every 5 minutes
setInterval(() => {
  rateLimitStore.cleanup();
}, RATE_LIMIT_CONFIG.cleanupIntervalMs);

// Generate rate limit key based on IP and endpoint
function generateKey(ip: string, endpoint: string): string {
  return `${ip}:${endpoint}`;
}

// Get client IP address
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  // Fallback to connection IP
  return request.ip || 'unknown';
}

// Main rate limiting function
export function rateLimit(config: RateLimitConfig) {
  return async (request: NextRequest, endpoint: string): Promise<NextResponse | null> => {
    // Check if rate limiting is enabled
    if (!RATE_LIMIT_CONFIG.enabled) {
      return null;
    }

    try {
      const clientIP = getClientIP(request);
      const key = generateKey(clientIP, endpoint);
      
      const entry = rateLimitStore.increment(key, config.windowMs);
      
      // Check if limit exceeded
      if (entry.count > config.maxRequests) {
        const remainingTime = Math.ceil((entry.resetTime - Date.now()) / 1000);
        
        return NextResponse.json(
          {
            success: false,
            error: 'Rate limit exceeded',
            message: config.message || 'Muitas requisições. Tente novamente mais tarde.',
            retryAfter: remainingTime,
            limit: config.maxRequests,
            remaining: 0,
            resetTime: entry.resetTime,
          },
          {
            status: 429,
            headers: {
              [RATE_LIMIT_CONFIG.headers.retryAfter]: remainingTime.toString(),
              [RATE_LIMIT_CONFIG.headers.limit]: config.maxRequests.toString(),
              [RATE_LIMIT_CONFIG.headers.remaining]: '0',
              [RATE_LIMIT_CONFIG.headers.reset]: entry.resetTime.toString(),
              [RATE_LIMIT_CONFIG.headers.window]: config.windowMs.toString(),
            },
          }
        );
      }

      // Add rate limit headers to successful responses
      const remaining = config.maxRequests - entry.count;
      
      // In test environment or when NextResponse.next is not available, return null
      // The actual API route will handle the response
      if (typeof NextResponse.next !== 'function') {
        return null;
      }
      
      const response = NextResponse.next();
      
      response.headers.set(RATE_LIMIT_CONFIG.headers.limit, config.maxRequests.toString());
      response.headers.set(RATE_LIMIT_CONFIG.headers.remaining, remaining.toString());
      response.headers.set(RATE_LIMIT_CONFIG.headers.reset, entry.resetTime.toString());
      response.headers.set(RATE_LIMIT_CONFIG.headers.window, config.windowMs.toString());
      
      return null; // Allow request to proceed
    } catch (error) {
      logger.error('Rate limiting error:', error);
      // In case of error, allow the request to proceed
      return null;
    }
  };
}

// Convenience functions for specific endpoints
export const rateLimitContact = rateLimit(RATE_LIMIT_CONFIGS.contact);
export const rateLimitNewsletter = rateLimit(RATE_LIMIT_CONFIGS.newsletter);
export const rateLimitGeneral = rateLimit(RATE_LIMIT_CONFIGS.general);

// Utility function to get rate limit info for monitoring
export function getRateLimitInfo(ip: string, endpoint: string) {
  const key = generateKey(ip, endpoint);
  const config = RATE_LIMIT_CONFIGS[endpoint as keyof typeof RATE_LIMIT_CONFIGS] || RATE_LIMIT_CONFIGS.general;
  
  return {
    key,
    remaining: rateLimitStore.getRemaining(key, config.maxRequests),
    resetTime: rateLimitStore.getResetTime(key),
    limit: config.maxRequests,
    windowMs: config.windowMs,
  };
}

// Export store for testing purposes
export { rateLimitStore };
