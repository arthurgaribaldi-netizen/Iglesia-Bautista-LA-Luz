'use client';

import { lazy, Suspense, ComponentType, useState, useEffect } from 'react';
import ErrorBoundary from '@/components/error-boundary';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingSpinner } from '@/components/ui/suspense-fallbacks';
import { markLazyComponentStart, markLazyComponentEnd, markLazyComponentError } from '@/lib/lazy-loading-monitor';

// Enhanced lazy loading wrapper with error boundaries and loading states
interface LazyComponentProps {
  fallback?: React.ReactNode;
  errorFallback?: React.ComponentType<{ error: Error; resetError: () => void }> | null;
  className?: string;
  priority?: 'high' | 'medium' | 'low';
  delay?: number;
}

// Default loading fallback
const DefaultLoadingFallback = ({ className }: { className?: string }) => (
  <div className={`flex items-center justify-center p-8 ${className}`}>
    <LoadingSpinner size="lg" />
  </div>
);

// Default error fallback
const DefaultErrorFallback = ({ error, retry }: { error?: Error; retry?: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-red-500 mb-4">
      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <p className="text-sm">Error al cargar el componente</p>
      {error && <p className="text-xs text-gray-500 mt-1">{error.message}</p>}
    </div>
    {retry && (
      <button
        onClick={retry}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Reintentar
      </button>
    )}
  </div>
);

// Higher-order component for lazy loading with enhanced features
export function withLazyLoading<T extends object>(
  Component: ComponentType<T>,
  options: LazyComponentProps = {}
) {
  const LazyComponent = lazy(() => 
    Promise.resolve({ default: Component })
  );

  return function EnhancedLazyComponent(props: T & LazyComponentProps) {
    const { 
      fallback, 
      errorFallback, 
      className, 
      priority = 'medium',
      delay = 0,
      ...componentProps 
    } = props;

    const loadingFallback = fallback || <DefaultLoadingFallback className={className} />;
    const errorFallbackComponent = errorFallback || DefaultErrorFallback;

    return (
      <ErrorBoundary fallback={errorFallbackComponent}>
        <Suspense fallback={loadingFallback}>
          <LazyComponent {...(componentProps as any)} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}

// Intersection Observer based lazy loading with priority
interface IntersectionLazyProps {
  children: (isVisible: boolean) => React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  priority?: 'high' | 'medium' | 'low';
  delay?: number;
}

export function IntersectionLazy({
  children,
  fallback = <DefaultLoadingFallback />,
  errorFallback = <DefaultErrorFallback />,
  threshold = 0.1,
  rootMargin = '50px',
  className,
  priority = 'medium',
  delay = 0,
}: IntersectionLazyProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [componentName] = useState(() => `intersection-lazy-${Date.now()}`);

  useEffect(() => {
    if (!ref) return;

    // Priority-based delay
    const priorityDelay = {
      high: 0,
      medium: 100,
      low: 300,
    }[priority];

    const totalDelay = delay + priorityDelay;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          markLazyComponentStart(componentName);
          
          setTimeout(() => {
            setIsVisible(true);
            setHasLoaded(true);
            markLazyComponentEnd(componentName);
            observer.disconnect();
          }, totalDelay);
        }
      },
      { 
        threshold,
        rootMargin,
      }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, threshold, rootMargin, priority, delay, componentName]);

  return (
    <div ref={setRef} className={className}>
      <ErrorBoundary 
        fallback={({ error }) => {
          markLazyComponentError(componentName, error);
          return errorFallback;
        }}
      >
        {hasLoaded ? children(isVisible) : fallback}
      </ErrorBoundary>
    </div>
  );
}

// Gradual loading hook for progressive enhancement
export function useGradualLoading(components: string[], delay = 100) {
  const [loadedComponents, setLoadedComponents] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadComponent = (componentName: string, index: number) => {
      setTimeout(() => {
        setLoadedComponents(prev => new Set([...prev, componentName]));
      }, index * delay);
    };

    components.forEach((component, index) => {
      loadComponent(component, index);
    });
  }, [components, delay]);

  return loadedComponents;
}

// Priority-based loading manager
export class LoadingPriorityManager {
  private static instance: LoadingPriorityManager;
  private loadedComponents = new Set<string>();
  private loadingQueue: Array<{ name: string; priority: number; callback: () => void }> = [];

  static getInstance(): LoadingPriorityManager {
    if (!LoadingPriorityManager.instance) {
      LoadingPriorityManager.instance = new LoadingPriorityManager();
    }
    return LoadingPriorityManager.instance;
  }

  addToQueue(name: string, priority: number, callback: () => void) {
    if (this.loadedComponents.has(name)) {
      callback();
      return;
    }

    this.loadingQueue.push({ name, priority, callback });
    this.loadingQueue.sort((a, b) => b.priority - a.priority);
    this.processQueue();
  }

  private processQueue() {
    if (this.loadingQueue.length === 0) return;

    const { name, callback } = this.loadingQueue.shift()!;
    this.loadedComponents.add(name);
    callback();
  }

  isLoaded(name: string): boolean {
    return this.loadedComponents.has(name);
  }
}

