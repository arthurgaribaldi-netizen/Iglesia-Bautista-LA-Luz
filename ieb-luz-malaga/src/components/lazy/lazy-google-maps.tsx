'use client';

import { lazy, Suspense } from 'react';
import ErrorBoundary from '@/components/error-boundary';
import { IntersectionLazy } from './lazy-wrapper-enhanced';

// Lazy load Google Maps component
const GoogleMaps = lazy(() => 
  import('@/components/ui/google-maps').then(module => ({ 
    default: module.GoogleMaps 
  }))
);

interface LazyGoogleMapsProps {
  priority?: 'high' | 'medium' | 'low';
  delay?: number;
  className?: string;
  [key: string]: any; // Allow other props to be passed through
}

export function LazyGoogleMaps({
  priority = 'low',
  delay = 600,
  className,
  ...props
}: LazyGoogleMapsProps) {
  return (
    <IntersectionLazy
      priority={priority}
      delay={delay}
      className={className}
      fallback={
        <div className="flex items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <div className="animate-pulse mb-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
            <p className="text-sm text-gray-500">Cargando mapa...</p>
          </div>
        </div>
      }
      errorFallback={
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm">Error al cargar el mapa</p>
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
          <div className="flex items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <div className="animate-pulse mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
              </div>
              <p className="text-sm text-gray-500">Cargando mapa...</p>
            </div>
          </div>
        }>
          <GoogleMaps 
            address={props.address || "Avenida Antonio Gaudí, 4, Málaga, España"}
            {...props} 
          />
        </Suspense>
      )}
    </IntersectionLazy>
  );
}
