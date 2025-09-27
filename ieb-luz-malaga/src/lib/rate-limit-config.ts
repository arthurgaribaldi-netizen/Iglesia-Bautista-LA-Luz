/**
 * Rate Limiting Configuration
 * 
 * This file contains the configuration for rate limiting across the application.
 * You can customize these values based on your needs.
 */

export const RATE_LIMIT_CONFIG = {
  // Contact API Configuration
  contact: {
    windowMs: parseInt(process.env.RATE_LIMIT_CONTACT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_CONTACT_MAX_REQUESTS || '5'),
    message: process.env.RATE_LIMIT_CONTACT_MESSAGE || 'Muitas tentativas de contato. Tente novamente em 15 minutos.',
  },
  
  // Newsletter API Configuration
  newsletter: {
    windowMs: parseInt(process.env.RATE_LIMIT_NEWSLETTER_WINDOW_MS || '3600000'), // 1 hour
    maxRequests: parseInt(process.env.RATE_LIMIT_NEWSLETTER_MAX_REQUESTS || '3'),
    message: process.env.RATE_LIMIT_NEWSLETTER_MESSAGE || 'Muitas tentativas de inscrição. Tente novamente em 1 hora.',
  },
  
  // General API Configuration
  general: {
    windowMs: parseInt(process.env.RATE_LIMIT_GENERAL_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_GENERAL_MAX_REQUESTS || '100'),
    message: process.env.RATE_LIMIT_GENERAL_MESSAGE || 'Muitas requisições. Tente novamente em 15 minutos.',
  },
  
  // Global Configuration
  enabled: process.env.RATE_LIMITING_ENABLED !== 'false',
  storeType: process.env.RATE_LIMIT_STORE_TYPE || 'memory',
  
  // Cleanup interval for memory store (in milliseconds)
  cleanupIntervalMs: 5 * 60 * 1000, // 5 minutes
  
  // Headers configuration
  headers: {
    limit: 'X-RateLimit-Limit',
    remaining: 'X-RateLimit-Remaining',
    reset: 'X-RateLimit-Reset',
    window: 'X-RateLimit-Window',
    retryAfter: 'Retry-After',
  },
} as const;

// Validation function to ensure configuration is valid
export function validateRateLimitConfig() {
  const errors: string[] = [];
  
  Object.entries(RATE_LIMIT_CONFIG).forEach(([key, config]) => {
    if (typeof config === 'object' && config !== null && 'windowMs' in config) {
      if (config.windowMs <= 0) {
        errors.push(`${key}.windowMs must be greater than 0`);
      }
      if (config.maxRequests <= 0) {
        errors.push(`${key}.maxRequests must be greater than 0`);
      }
    }
  });
  
  if (errors.length > 0) {
    throw new Error(`Invalid rate limit configuration: ${errors.join(', ')}`);
  }
}

// Export types for TypeScript
export type RateLimitConfigKey = keyof typeof RATE_LIMIT_CONFIG;
export type RateLimitEndpointConfig = typeof RATE_LIMIT_CONFIG.contact;
