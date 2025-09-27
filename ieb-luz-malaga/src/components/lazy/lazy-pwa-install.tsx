'use client';

import { lazy, Suspense, useState, useEffect } from 'react';
import ErrorBoundary from '@/components/error-boundary';

// Lazy load PWA Install component
const PWAInstall = lazy(() => 
  import('@/components/pwa-install').then(module => ({ 
    default: module.PWAInstall 
  }))
);

interface LazyPWAInstallProps {
  delay?: number;
  priority?: 'high' | 'medium' | 'low';
  enableInDevelopment?: boolean;
}

export function LazyPWAInstall({
  delay = 5000, // Show PWA install prompt after 5 seconds
  priority = 'low',
  enableInDevelopment = false,
}: LazyPWAInstallProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Only load in production or if explicitly enabled in development
    if (process.env.NODE_ENV === 'development' && !enableInDevelopment) {
      return;
    }

    // Load PWA install component after a delay
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, enableInDevelopment]);

  if (!shouldLoad) return null;

  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <PWAInstall />
      </Suspense>
    </ErrorBoundary>
  );
}
