'use client';

import { useEffect, useState } from 'react';

interface BundleOptimizerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}

/**
 * BundleOptimizer - Component that delays rendering of non-critical components
 * to improve initial page load performance
 */
export function BundleOptimizer({ 
  children, 
  fallback = null, 
  delay = 100 
}: BundleOptimizerProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!shouldRender) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * IntersectionObserverOptimizer - Only renders components when they're about to be visible
 */
export function IntersectionObserverOptimizer({ 
  children, 
  fallback = null,
  rootMargin = '50px',
  threshold = 0.1
}: BundleOptimizerProps & {
  rootMargin?: string;
  threshold?: number;
}) {
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
      { rootMargin, threshold }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, rootMargin, threshold]);

  return (
    <div ref={setRef}>
      {isVisible ? children : fallback}
    </div>
  );
}

/**
 * CriticalResourcePreloader - Preloads critical resources
 */
export function CriticalResourcePreloader() {
  useEffect(() => {
    // Preload critical fonts
    const preloadFont = (href: string, as: string = 'font', type: string = 'font/woff2') => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      link.type = type;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // Preload critical fonts
    preloadFont('/fonts/inter.woff2');
    
    // Preload critical images if needed
    const criticalImages = [
      '/logo.png',
      '/og-image.svg'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = src;
      link.as = 'image';
      document.head.appendChild(link);
    });
  }, []);

  return null;
}
