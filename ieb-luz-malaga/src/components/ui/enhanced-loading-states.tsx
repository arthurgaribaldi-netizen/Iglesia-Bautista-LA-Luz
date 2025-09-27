'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Enhanced loading states for different component types
interface LoadingStateProps {
  type?: 'skeleton' | 'spinner' | 'pulse' | 'dots' | 'progress';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  message?: string;
  progress?: number;
}

export function LoadingState({
  type = 'skeleton',
  size = 'md',
  className = '',
  message,
  progress,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const renderLoadingType = () => {
    switch (type) {
      case 'spinner':
        return (
          <div className={`${sizeClasses[size]} ${className}`}>
            <motion.div
              className="w-full h-full border-2 border-blue-200 border-t-blue-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        );

      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} ${className}`}>
            <motion.div
              className="w-full h-full bg-blue-200 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        );

      case 'dots':
        return (
          <div className={`flex space-x-1 ${className}`}>
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              />
            ))}
          </div>
        );

      case 'progress':
        return (
          <div className={`w-full ${className}`}>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress || 0}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {message && (
              <p className="text-sm text-gray-600 mt-2 text-center">{message}</p>
            )}
          </div>
        );

      case 'skeleton':
      default:
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {renderLoadingType()}
      {message && type !== 'progress' && (
        <p className="text-sm text-gray-600 mt-2 text-center">{message}</p>
      )}
    </div>
  );
}

// Component-specific loading fallbacks
export function YouTubePlayerLoadingFallback({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
      <div className="text-center">
        <LoadingState type="spinner" size="lg" />
        <p className="text-sm text-gray-600 mt-4">Cargando reproductor de YouTube...</p>
      </div>
    </div>
  );
}

export function DevotionalLoadingFallback({ 
  compact = false, 
  className = '' 
}: { 
  compact?: boolean; 
  className?: string; 
}) {
  return (
    <div className={`${compact ? 'w-full' : 'max-w-2xl mx-auto'} ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-2 mb-4">
          <LoadingState type="pulse" size="sm" />
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Cargando devocional del día...
        </p>
      </div>
    </div>
  );
}

export function DailyVerseLoadingFallback({ 
  compact = false, 
  className = '' 
}: { 
  compact?: boolean; 
  className?: string; 
}) {
  return (
    <div className={`${compact ? 'w-full' : 'max-w-2xl mx-auto'} ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-2 mb-4">
          <LoadingState type="dots" size="sm" />
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Cargando versículo del día...
        </p>
      </div>
    </div>
  );
}

export function NewsletterLoadingFallback({ 
  compact = false, 
  className = '' 
}: { 
  compact?: boolean; 
  className?: string; 
}) {
  return (
    <div className={`${compact ? 'w-full' : 'max-w-md mx-auto'} ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <p className="text-sm text-gray-600 mt-3 text-center">
          Cargando formulario de newsletter...
        </p>
      </div>
    </div>
  );
}

export function GoogleMapsLoadingFallback({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
      <div className="text-center">
        <LoadingState type="pulse" size="lg" />
        <p className="text-sm text-gray-600 mt-4">Cargando mapa...</p>
      </div>
    </div>
  );
}

// Error fallback components
export function ComponentErrorFallback({ 
  componentName, 
  onRetry, 
  className = '' 
}: { 
  componentName: string; 
  onRetry?: () => void; 
  className?: string; 
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="text-red-500 mb-4">
        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p className="text-sm">Error al cargar {componentName}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}

// Progressive loading indicator
export function ProgressiveLoadingIndicator({ 
  phase, 
  totalPhases = 4, 
  className = '' 
}: { 
  phase: number; 
  totalPhases?: number; 
  className?: string; 
}) {
  const progress = (phase / totalPhases) * 100;
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-xs text-gray-600 mb-2">
        <span>Fase {phase} de {totalPhases}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
