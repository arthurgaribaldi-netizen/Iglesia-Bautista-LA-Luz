/**
 * Performance monitoring script for lazy loading implementation
 * This script measures the impact of lazy loading on page performance
 */

import { componentLogger } from './logger';

interface PerformanceMetrics {
  componentName: string;
  loadTime: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  phase: number;
  timestamp: number;
}

interface LoadingStats {
  totalComponents: number;
  loadedComponents: number;
  failedComponents: number;
  averageLoadTime: number;
  phases: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

class LazyLoadingPerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private startTimes: Map<string, number> = new Map();
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.initializePerformanceObserver();
    this.setupGlobalListeners();
  }

  private initializePerformanceObserver() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'measure' && entry.name.includes('-load-time')) {
            const componentName = entry.name.replace('-load-time', '');
            this.recordMetric(componentName, entry.duration);
          }
        });
      });

      try {
        this.observer.observe({ entryTypes: ['measure'] });
      } catch (error) {
        componentLogger.warn('PerformanceObserver not supported:', error);
      }
    }
  }

  private setupGlobalListeners() {
    // Listen for custom lazy loading events
    if (typeof window !== 'undefined') {
      window.addEventListener('lazy-component-start', (event: Event) => {
        const customEvent = event as CustomEvent;
        this.startTimes.set(customEvent.detail.componentName, performance.now());
      });

      window.addEventListener('lazy-component-end', (event: Event) => {
        const customEvent = event as CustomEvent;
        const startTime = this.startTimes.get(customEvent.detail.componentName);
        if (startTime) {
          const loadTime = performance.now() - startTime;
          this.recordMetric(customEvent.detail.componentName, loadTime);
          this.startTimes.delete(customEvent.detail.componentName);
        }
      });

      window.addEventListener('lazy-component-error', (event: Event) => {
        const customEvent = event as CustomEvent;
        componentLogger.error(`Lazy loading error for ${customEvent.detail.componentName}:`, customEvent.detail.error);
      });
    }
  }

  private recordMetric(componentName: string, loadTime: number) {
    const priority = this.getComponentPriority(componentName);
    const phase = this.getComponentPhase(componentName);

    this.metrics.push({
      componentName,
      loadTime,
      priority,
      phase,
      timestamp: Date.now(),
    });

    // Log component load performance
    componentLogger.logComponentLoad(componentName, loadTime, priority);
  }

  private getComponentPriority(componentName: string): 'critical' | 'high' | 'medium' | 'low' {
    const priorityMap: Record<string, 'critical' | 'high' | 'medium' | 'low'> = {
      'header': 'critical',
      'footer': 'critical',
      'breadcrumbs': 'critical',
      'youtube-player': 'high',
      'modern-interactions': 'high',
      'daily-devotional': 'medium',
      'daily-verse': 'medium',
      'analytics': 'low',
      'performance-monitor': 'low',
      'floating-contact': 'low',
      'newsletter-signup': 'low',
      'google-maps': 'low',
      'pwa-install': 'low',
    };

    return priorityMap[componentName] || 'medium';
  }

  private getComponentPhase(componentName: string): number {
    const phaseMap: Record<string, number> = {
      'header': 1,
      'footer': 1,
      'breadcrumbs': 1,
      'youtube-player': 2,
      'modern-interactions': 2,
      'daily-devotional': 3,
      'daily-verse': 3,
      'analytics': 4,
      'performance-monitor': 4,
      'floating-contact': 4,
      'newsletter-signup': 4,
      'google-maps': 4,
      'pwa-install': 4,
    };

    return phaseMap[componentName] || 3;
  }

  public getStats(): LoadingStats {
    const totalComponents = this.metrics.length;
    const loadedComponents = this.metrics.filter(m => m.loadTime > 0).length;
    const failedComponents = totalComponents - loadedComponents;
    const averageLoadTime = loadedComponents > 0 
      ? this.metrics.reduce((sum, m) => sum + m.loadTime, 0) / loadedComponents 
      : 0;

    const phases = {
      critical: this.metrics.filter(m => m.priority === 'critical').length,
      high: this.metrics.filter(m => m.priority === 'high').length,
      medium: this.metrics.filter(m => m.priority === 'medium').length,
      low: this.metrics.filter(m => m.priority === 'low').length,
    };

    return {
      totalComponents,
      loadedComponents,
      failedComponents,
      averageLoadTime,
      phases,
    };
  }

  public getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  public getPhaseMetrics(phase: number): PerformanceMetrics[] {
    return this.metrics.filter(m => m.phase === phase);
  }

  public getPriorityMetrics(priority: 'critical' | 'high' | 'medium' | 'low'): PerformanceMetrics[] {
    return this.metrics.filter(m => m.priority === priority);
  }

  public generateReport(): string {
    const stats = this.getStats();
    const metrics = this.getMetrics();

    let report = `
# Lazy Loading Performance Report
Generated: ${new Date().toISOString()}

## Summary
- Total Components: ${stats.totalComponents}
- Loaded Components: ${stats.loadedComponents}
- Failed Components: ${stats.failedComponents}
- Average Load Time: ${stats.averageLoadTime.toFixed(2)}ms

## Phase Breakdown
- Critical: ${stats.phases.critical} components
- High: ${stats.phases.high} components
- Medium: ${stats.phases.medium} components
- Low: ${stats.phases.low} components

## Component Details
`;

    metrics.forEach(metric => {
      report += `- ${metric.componentName}: ${metric.loadTime.toFixed(2)}ms (${metric.priority})\n`;
    });

    return report;
  }

  public exportMetrics(): string {
    return JSON.stringify({
      stats: this.getStats(),
      metrics: this.getMetrics(),
      timestamp: Date.now(),
    }, null, 2);
  }

  public clearMetrics() {
    this.metrics = [];
    this.startTimes.clear();
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Global instance
let performanceMonitor: LazyLoadingPerformanceMonitor | null = null;

export function initializeLazyLoadingMonitor(): LazyLoadingPerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new LazyLoadingPerformanceMonitor();
  }
  return performanceMonitor;
}

export function getLazyLoadingMonitor(): LazyLoadingPerformanceMonitor | null {
  return performanceMonitor;
}

// Utility functions for components to use
export function markLazyComponentStart(componentName: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('lazy-component-start', {
      detail: { componentName }
    }));
  }
}

export function markLazyComponentEnd(componentName: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('lazy-component-end', {
      detail: { componentName }
    }));
  }
}

export function markLazyComponentError(componentName: string, error: Error) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('lazy-component-error', {
      detail: { componentName, error }
    }));
  }
}

// Initialize monitor automatically in browser
if (typeof window !== 'undefined') {
  initializeLazyLoadingMonitor();
}

export default LazyLoadingPerformanceMonitor;
