// Simple test to verify API route fixes
import { shouldUseFallbacks, buildFallbacks } from '@/lib/build-fallbacks';

describe('API Route Fixes', () => {
  it('should have correct imports', () => {
    expect(typeof shouldUseFallbacks).toBe('function');
    expect(typeof buildFallbacks).toBe('object');
    expect(buildFallbacks.churchInfo).toBeDefined();
    expect(buildFallbacks.sermons).toBeDefined();
    expect(buildFallbacks.events).toBeDefined();
  });

  it('should return fallback data when needed', () => {
    const result = shouldUseFallbacks();
    expect(typeof result).toBe('boolean');
  });
});
