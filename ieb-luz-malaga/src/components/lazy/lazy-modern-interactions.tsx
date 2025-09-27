'use client';

import { lazy, Suspense } from 'react';
import ErrorBoundary from '@/components/error-boundary';
import { IntersectionLazy } from './lazy-wrapper-enhanced';

// Lazy load Modern Interactions components
const ModernCard = lazy(() => 
  import('@/components/ui/modern-interactions').then(module => ({ 
    default: module.ModernCard 
  }))
);

const ModernScrollIndicator = lazy(() => 
  import('@/components/ui/modern-interactions').then(module => ({ 
    default: module.ModernScrollIndicator 
  }))
);

const ModernButton = lazy(() => 
  import('@/components/ui/modern-interactions').then(module => ({ 
    default: module.RippleButton 
  }))
);

const MicroInteractions = lazy(() => 
  import('@/components/ui/modern-interactions').then(module => ({ 
    default: module.FloatingActionButton 
  }))
);

interface LazyModernInteractionsProps {
  component?: 'card' | 'scroll-indicator' | 'button' | 'micro-interactions';
  priority?: 'high' | 'medium' | 'low';
  delay?: number;
  className?: string;
  [key: string]: any; // Allow other props to be passed through
}

export function LazyModernInteractions({
  component = 'card',
  priority = 'medium',
  delay = 100,
  className,
  ...props
}: LazyModernInteractionsProps) {
  const Component = {
    card: ModernCard,
    'scroll-indicator': ModernScrollIndicator,
    button: ModernButton,
    'micro-interactions': MicroInteractions,
  }[component];

  return (
    <IntersectionLazy
      priority={priority}
      delay={delay}
      className={className}
      fallback={
        <div className="flex items-center justify-center p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      }
      errorFallback={
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-xs">Error al cargar interacciones</p>
          </div>
        </div>
      }
    >
      {(isVisible) => (
        <Suspense fallback={
          <div className="flex items-center justify-center p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        }>
          <Component 
            children={props.children || <div>Loading...</div>}
            {...props} 
          />
        </Suspense>
      )}
    </IntersectionLazy>
  );
}
