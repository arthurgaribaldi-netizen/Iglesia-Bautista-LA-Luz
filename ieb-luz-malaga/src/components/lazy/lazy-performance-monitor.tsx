'use client';

import { lazy, Suspense, useState, useEffect } from 'react';
import ErrorBoundary from '@/components/error-boundary';

// Lazy load Performance Monitor component
const PerformanceMonitor = lazy(() => 
  import('@/components/analytics/performance-monitor').then(module => ({ 
    default: module.PerformanceMonitor 
  }))
);

interface LazyPerformanceMonitorProps {
  delay?: number;
  priority?: 'high' | 'medium' | 'low';
  enableInDevelopment?: boolean;
}

export function LazyPerformanceMonitor({
  delay = 2000,
  priority = 'low',
  enableInDevelopment = false,
}: LazyPerformanceMonitorProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Only load in production or if explicitly enabled in development
    if (process.env.NODE_ENV === 'development' && !enableInDevelopment) {
      return;
    }

    // Load performance monitor after a delay to not interfere with initial page load
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, enableInDevelopment]);

  if (!shouldLoad) return null;

  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <PerformanceMonitor />
      </Suspense>
    </ErrorBoundary>
  );
}
