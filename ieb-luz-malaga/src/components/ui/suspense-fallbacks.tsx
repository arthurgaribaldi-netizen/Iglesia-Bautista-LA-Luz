'use client';

import { Skeleton } from './skeleton';
import { Card, CardContent, CardHeader } from './card';
import { 
  YouTubePlayerLoadingFallback,
  DevotionalLoadingFallback,
  DailyVerseLoadingFallback,
  NewsletterLoadingFallback,
  GoogleMapsLoadingFallback,
  ComponentErrorFallback,
} from './enhanced-loading-states';

// YouTube Player Loading Fallback
export function YouTubePlayerFallback() {
  return <YouTubePlayerLoadingFallback />;
}

// Devotional Loading Fallback
export function DevotionalFallback({ compact = false }: { compact?: boolean }) {
  return <DevotionalLoadingFallback compact={compact} />;
}

// Daily Verse Loading Fallback
export function DailyVerseFallback({ compact = false }: { compact?: boolean }) {
  return <DailyVerseLoadingFallback compact={compact} />;
}

// Events Loading Fallback
export function EventsFallback() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Sermons Loading Fallback
export function SermonsFallback() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Contact Form Loading Fallback
export function ContactFormFallback() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

// Map Loading Fallback
export function MapFallback() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            Cargando mapa...
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Performance Monitor Fallback
export function PerformanceMonitorFallback() {
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs font-mono z-50">
      <div>LCP: Cargando...</div>
      <div>CLS: Cargando...</div>
      <div>FCP: Cargando...</div>
    </div>
  );
}

// Generic Loading Spinner
export function LoadingSpinner({ size = 'md', className = '' }: { 
  size?: 'sm' | 'md' | 'lg'
  className?: string 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
  };
  
  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
}

// Page Loading Fallback
export function PageLoadingFallback() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-64 mx-auto mb-6" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-64 w-full" />
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
