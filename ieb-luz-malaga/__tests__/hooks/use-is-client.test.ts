import { renderHook, act } from '@testing-library/react';
import { useIsClient } from '@/hooks/use-is-client';

// Mock timers
jest.useFakeTimers();

describe('useIsClient Hook', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  it('should initially return false', () => {
    const { result } = renderHook(() => useIsClient());
    
    expect(result.current).toBe(false);
  });

  it('should return true after setTimeout completes', () => {
    const { result } = renderHook(() => useIsClient());
    
    expect(result.current).toBe(false);
    
    // Fast-forward time to trigger setTimeout
    act(() => {
      jest.runAllTimers();
    });
    
    expect(result.current).toBe(true);
  });

  it('should handle multiple renders correctly', () => {
    const { result, rerender } = renderHook(() => useIsClient());
    
    expect(result.current).toBe(false);
    
    // Rerender the hook
    rerender();
    
    expect(result.current).toBe(false);
    
    // Fast-forward time
    act(() => {
      jest.runAllTimers();
    });
    
    expect(result.current).toBe(true);
  });

  it('should clean up timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { unmount } = renderHook(() => useIsClient());
    
    // Unmount before timeout completes
    unmount();
    
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });

  it('should maintain state across rerenders', () => {
    const { result, rerender } = renderHook(() => useIsClient());
    
    // Initial state
    expect(result.current).toBe(false);
    
    // Fast-forward time to set isClient to true
    act(() => {
      jest.runAllTimers();
    });
    
    expect(result.current).toBe(true);
    
    // Rerender should maintain the true state
    rerender();
    
    expect(result.current).toBe(true);
  });

  it('should work with multiple instances', () => {
    const { result: result1 } = renderHook(() => useIsClient());
    const { result: result2 } = renderHook(() => useIsClient());
    
    // Both should start as false
    expect(result1.current).toBe(false);
    expect(result2.current).toBe(false);
    
    // Fast-forward time
    act(() => {
      jest.runAllTimers();
    });
    
    // Both should become true
    expect(result1.current).toBe(true);
    expect(result2.current).toBe(true);
  });
});