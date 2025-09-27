'use client';

import { Suspense, ReactNode } from 'react';
import { LoadingSpinner } from './suspense-fallbacks';

interface SearchParamsWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  className?: string
}

// Fallback padrão para componentes que usam search params
function DefaultSearchParamsFallback({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <LoadingSpinner size="sm" />
      <span className="ml-2 text-sm text-gray-500">Carregando...</span>
    </div>
  );
}

/**
 * Wrapper que adiciona Suspense boundary para componentes que usam useSearchParams()
 * 
 * @example
 * ```tsx
 * <SearchParamsWrapper>
 *   <ComponentThatUsesSearchParams />
 * </SearchParamsWrapper>
 * ```
 */
export function SearchParamsWrapper({ 
  children, 
  fallback,
  className = '' 
}: SearchParamsWrapperProps) {
  return (
    <Suspense fallback={fallback || <DefaultSearchParamsFallback className={className} />}>
      {children}
    </Suspense>
  );
}

/**
 * Higher-order component que adiciona Suspense boundary automaticamente
 * 
 * @example
 * ```tsx
 * const SuspendedComponent = withSearchParamsSuspense(MyComponent);
 * ```
 */
export function withSearchParamsSuspense<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode,
  className?: string,
) {
  return function SuspendedComponent(props: T) {
    return (
      <SearchParamsWrapper fallback={fallback} className={className}>
        <Component {...props} />
      </SearchParamsWrapper>
    );
  };
}

/**
 * Hook para verificar se os search params estão disponíveis
 * Útil para componentes que precisam aguardar os search params
 */
export function useSearchParamsReady() {
  // Esta função pode ser expandida para incluir lógica de verificação
  return {
    isReady: true,
    error: null,
  };
}
