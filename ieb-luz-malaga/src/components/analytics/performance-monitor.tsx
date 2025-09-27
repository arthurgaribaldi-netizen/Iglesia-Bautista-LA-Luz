'use client';

import { useEffect, useState, Suspense } from 'react';
import { useWebVitals } from '@/hooks/use-web-vitals';
import { PerformanceMonitorFallback } from '@/components/ui/suspense-fallbacks';

interface PerformanceMetrics {
  lcp: number | null
  cls: number | null
  fcp: number | null
  ttfb: number | null
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    cls: null,
    fcp: null,
    ttfb: null,
  });

  useWebVitals();

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
        }
        if (entry.entryType === 'first-contentful-paint') {
          setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
        }
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-contentful-paint'] });

    return () => observer.disconnect();
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <Suspense fallback={<PerformanceMonitorFallback />}>
      <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs font-mono z-50">
        <div>LCP: {metrics.lcp ? `${metrics.lcp.toFixed(0)}ms` : 'N/A'}</div>
        <div>CLS: {metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}</div>
        <div>FCP: {metrics.fcp ? `${metrics.fcp.toFixed(0)}ms` : 'N/A'}</div>
      </div>
    </Suspense>
  );
}