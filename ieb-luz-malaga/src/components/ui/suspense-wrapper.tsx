'use client';

import { Suspense, ReactNode } from 'react';
import { LoadingSpinner, PageLoadingFallback } from './suspense-fallbacks';

interface SuspenseWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  type?: 'page' | 'component' | 'inline'
  className?: string
}

export function SuspenseWrapper({ 
  children, 
  fallback, 
  type = 'component',
  className = '', 
}: SuspenseWrapperProps) {
  let defaultFallback: ReactNode;

  switch (type) {
    case 'page':
      defaultFallback = <PageLoadingFallback />;
      break;
    case 'inline':
      defaultFallback = (
        <div className={`flex items-center justify-center p-4 ${className}`}>
          <LoadingSpinner size="sm" />
        </div>
      );
      break;
    case 'component':
    default:
      defaultFallback = (
        <div className={`flex items-center justify-center p-8 ${className}`}>
          <LoadingSpinner size="md" />
        </div>
      );
      break;
  }

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}

// Higher-order component para lazy loading
export function withSuspense<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode,
  type: 'page' | 'component' | 'inline' = 'component',
) {
  return function SuspendedComponent(props: T) {
    return (
      <SuspenseWrapper fallback={fallback} type={type}>
        <Component {...props} />
      </SuspenseWrapper>
    );
  };
}

// Hook para error boundaries com Suspense
export function useSuspenseError() {
  // Esta função pode ser expandida para incluir error handling
  return {
    hasError: false,
    error: null,
    resetError: () => {},
  };
}
