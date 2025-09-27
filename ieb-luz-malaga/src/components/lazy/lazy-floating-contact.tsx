'use client';

import { lazy, Suspense, useState, useEffect } from 'react';
import ErrorBoundary from '@/components/error-boundary';
import { useIsClient } from '@/hooks/use-is-client';

// Lazy load Floating Contact component
const FloatingContact = lazy(() => 
  import('@/components/ui/floating-contact').then(module => ({ 
    default: module.FloatingContact 
  }))
);

const MobileContactBanner = lazy(() => 
  import('@/components/ui/floating-contact').then(module => ({ 
    default: module.MobileContactBanner 
  }))
);

interface LazyFloatingContactProps {
  delay?: number;
  priority?: 'high' | 'medium' | 'low';
  showMobileBanner?: boolean;
}

export function LazyFloatingContact({
  delay = 3000, // Show after 3 seconds
  priority = 'low',
  showMobileBanner = true,
}: LazyFloatingContactProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;

    // Load floating contact after delay
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [isClient, delay]);

  if (!shouldLoad) return null;

  return (
    <>
      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <FloatingContact />
        </Suspense>
      </ErrorBoundary>
      
      {showMobileBanner && (
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <MobileContactBanner />
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  );
}
