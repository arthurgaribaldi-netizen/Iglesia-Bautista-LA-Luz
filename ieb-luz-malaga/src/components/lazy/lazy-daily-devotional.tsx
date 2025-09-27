'use client';

import { lazy, Suspense } from 'react';
import ErrorBoundary from '@/components/error-boundary';
import { DevotionalFallback } from '@/components/ui/suspense-fallbacks';
import { IntersectionLazy } from './lazy-wrapper-enhanced';

// Lazy load Daily Devotional component
const DailyDevotional = lazy(() => 
  import('@/components/ui/daily-devotional').then(module => ({ 
    default: module.DailyDevotional 
  }))
);

const DailyDevotionalCompact = lazy(() => 
  import('@/components/ui/daily-devotional').then(module => ({ 
    default: module.DailyDevotionalCompact 
  }))
);

interface LazyDailyDevotionalProps {
  showSource?: boolean;
  compact?: boolean;
  priority?: 'high' | 'medium' | 'low';
  delay?: number;
  className?: string;
}

export function LazyDailyDevotional({
  showSource = true,
  compact = false,
  priority = 'medium',
  delay = 300,
  className,
}: LazyDailyDevotionalProps) {
  const Component = compact ? DailyDevotionalCompact : DailyDevotional;

  return (
    <IntersectionLazy
      priority={priority}
      delay={delay}
      className={className}
      fallback={<DevotionalFallback compact={compact} />}
      errorFallback={
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-sm">Error al cargar el devocional</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      }
    >
      {(isVisible) => (
        <Suspense fallback={<DevotionalFallback compact={compact} />}>
          <Component showSource={showSource} compact={compact} />
        </Suspense>
      )}
    </IntersectionLazy>
  );
}
