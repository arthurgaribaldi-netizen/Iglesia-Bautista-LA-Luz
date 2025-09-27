'use client';

import { lazy, Suspense } from 'react';
import ErrorBoundary from '@/components/error-boundary';

// Lazy load Analytics components
const GoogleAnalytics = lazy(() => 
  import('@/components/analytics/google-analytics').then(module => ({ 
    default: module.GoogleAnalytics 
  }))
);

const PerformanceMonitor = lazy(() => 
  import('@/components/analytics/performance-monitor').then(module => ({ 
    default: module.PerformanceMonitor 
  }))
);

const YouTubeDashboard = lazy(() => 
  import('@/components/analytics/youtube-dashboard').then(module => ({ 
    default: module.YouTubeDashboard 
  }))
);

interface LazyAnalyticsProps {
  component?: 'google' | 'performance' | 'youtube';
  delay?: number;
  priority?: 'high' | 'medium' | 'low';
}

export function LazyAnalytics({
  component = 'google',
  delay = 1000,
  priority = 'low',
}: LazyAnalyticsProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Load analytics after a delay to not block initial page load
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!shouldLoad) return null;

  const Component = {
    google: GoogleAnalytics,
    performance: PerformanceMonitor,
    youtube: YouTubeDashboard,
  }[component];

  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
}

// Import useState and useEffect
import { useState, useEffect } from 'react';
