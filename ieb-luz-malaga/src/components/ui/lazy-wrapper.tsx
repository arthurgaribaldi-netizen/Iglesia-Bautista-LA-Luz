'use client';

import { Suspense, lazy, ComponentType, ReactNode, useState, useEffect } from 'react';
import { Skeleton } from './skeleton';
import { LoadingSpinner } from './suspense-fallbacks';

interface LazyWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  className?: string
}

// Default fallback component
const DefaultFallback = ({ className }: { className?: string }) => (
  <div className={`flex items-center justify-center p-8 ${className}`}>
    <LoadingSpinner size="lg" />
  </div>
);

export function LazyWrapper({ 
  children, 
  fallback = <DefaultFallback />,
  className, 
}: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      <div className={className}>
        {children}
      </div>
    </Suspense>
  );
}

// Higher-order component for lazy loading
export function withLazyLoading<T extends object>(
  Component: ComponentType<T>,
  fallback?: ReactNode,
) {
  const LazyComponent = lazy(() => 
    Promise.resolve({ default: Component }),
  );

  return function LazyLoadedComponent(props: T) {
    return (
      <Suspense fallback={fallback || <DefaultFallback />}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    );
  };
}

// Hook for intersection observer based lazy loading
export function useLazyLoad(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, threshold]);

  return [setRef, isVisible] as const;
}

// Component for lazy loading with intersection observer
interface LazyIntersectionProps {
  children: (isVisible: boolean) => ReactNode
  fallback?: ReactNode
  threshold?: number
  className?: string
}

export function LazyIntersection({ 
  children, 
  fallback = <DefaultFallback />,
  threshold = 0.1,
  className, 
}: LazyIntersectionProps) {
  const [ref, isVisible] = useLazyLoad(threshold);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children(isVisible) : fallback}
    </div>
  );
}
