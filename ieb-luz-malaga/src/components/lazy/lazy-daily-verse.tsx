'use client';

import { lazy, Suspense } from 'react';
import ErrorBoundary from '@/components/error-boundary';
import { DailyVerseFallback } from '@/components/ui/suspense-fallbacks';
import { IntersectionLazy } from './lazy-wrapper-enhanced';

// Lazy load Daily Verse component
const DailyVerse = lazy(() => 
  import('@/components/ui/daily-verse').then(module => ({ 
    default: module.DailyVerse 
  }))
);

const DailyVerseCompact = lazy(() => 
  import('@/components/ui/daily-verse').then(module => ({ 
    default: module.DailyVerseCompact 
  }))
);

interface LazyDailyVerseProps {
  compact?: boolean;
  priority?: 'high' | 'medium' | 'low';
  delay?: number;
  className?: string;
}

export function LazyDailyVerse({
  compact = false,
  priority = 'medium',
  delay = 400,
  className,
}: LazyDailyVerseProps) {
  const Component = compact ? DailyVerseCompact : DailyVerse;

  return (
    <IntersectionLazy
      priority={priority}
      delay={delay}
      className={className}
      fallback={<DailyVerseFallback compact={compact} />}
      errorFallback={
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">Error al cargar el versículo del día</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      }
    >
      {(isVisible) => (
        <Suspense fallback={<DailyVerseFallback compact={compact} />}>
          <Component compact={compact} />
        </Suspense>
      )}
    </IntersectionLazy>
  );
}
