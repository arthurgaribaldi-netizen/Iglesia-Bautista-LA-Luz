'use client';

import { lazy, Suspense } from 'react';
import ErrorBoundary from '@/components/error-boundary';
import { IntersectionLazy } from './lazy-wrapper-enhanced';

// Lazy load Newsletter Signup component
const NewsletterSignup = lazy(() => 
  import('@/components/ui/newsletter-signup').then(module => ({ 
    default: module.NewsletterSignup 
  }))
);

const LazyNewsletterSignupCompact = lazy(() => 
  import('@/components/ui/newsletter-signup').then(module => ({ 
    default: module.NewsletterSignupCompact 
  }))
);

interface LazyNewsletterSignupProps {
  compact?: boolean;
  priority?: 'high' | 'medium' | 'low';
  delay?: number;
  className?: string;
}

export function LazyNewsletterSignup({
  compact = false,
  priority = 'low',
  delay = 500,
  className,
}: LazyNewsletterSignupProps) {
  const Component = compact ? LazyNewsletterSignupCompact : NewsletterSignup;

  return (
    <IntersectionLazy
      priority={priority}
      delay={delay}
      className={className}
      fallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      }
      errorFallback={
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Error al cargar el formulario de newsletter</p>
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
        <Suspense fallback={
          <div className="flex items-center justify-center p-8">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        }>
          <Component compact={compact} />
        </Suspense>
      )}
    </IntersectionLazy>
  );
}

// Export the compact version for backward compatibility
export const NewsletterSignupCompact = (props: Omit<LazyNewsletterSignupProps, 'compact'>) => (
  <LazyNewsletterSignup {...props} compact={true} />
);
