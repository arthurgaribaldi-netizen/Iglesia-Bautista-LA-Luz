'use client';

import { lazy, Suspense } from 'react';
import ErrorBoundary from '@/components/error-boundary';
import { YouTubePlayerFallback } from '@/components/ui/suspense-fallbacks';
import { IntersectionLazy } from './lazy-wrapper-enhanced';

// Lazy load YouTube Player component
const YouTubePlayer = lazy(() => 
  import('@/components/ui/youtube-player').then(module => ({ 
    default: module.YouTubePlayer 
  }))
);

interface LazyYouTubePlayerProps {
  channelId?: string;
  autoPlay?: boolean;
  showLatest?: boolean;
  priority?: 'high' | 'medium' | 'low';
  delay?: number;
  className?: string;
}

export function LazyYouTubePlayer({
  channelId = 'UCiahUfyUv3VbwrMjgLh-WzA',
  autoPlay = false,
  showLatest = true,
  priority = 'medium',
  delay = 200,
  className,
}: LazyYouTubePlayerProps) {
  return (
    <IntersectionLazy
      priority={priority}
      delay={delay}
      className={className}
      fallback={<YouTubePlayerFallback />}
      errorFallback={
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Error al cargar el reproductor de YouTube</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      }
    >
      {(isVisible) => (
        <Suspense fallback={<YouTubePlayerFallback />}>
          <YouTubePlayer
            channelId={channelId}
            autoPlay={autoPlay}
            showLatest={showLatest}
          />
        </Suspense>
      )}
    </IntersectionLazy>
  );
}
