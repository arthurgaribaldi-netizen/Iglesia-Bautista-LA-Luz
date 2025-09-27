import { componentLogger } from './logger';

// Gradual Loading Strategy Configuration
export interface LoadingStrategy {
  priority: 'critical' | 'high' | 'medium' | 'low';
  delay: number;
  intersectionThreshold: number;
  rootMargin: string;
  retryAttempts: number;
  retryDelay: number;
}

export const LOADING_STRATEGIES: Record<string, LoadingStrategy> = {
  // Critical components - load immediately
  critical: {
    priority: 'critical',
    delay: 0,
    intersectionThreshold: 0,
    rootMargin: '0px',
    retryAttempts: 3,
    retryDelay: 1000,
  },
  
  // High priority - load quickly after critical
  high: {
    priority: 'high',
    delay: 100,
    intersectionThreshold: 0.1,
    rootMargin: '100px',
    retryAttempts: 3,
    retryDelay: 1000,
  },
  
  // Medium priority - load when visible or after delay
  medium: {
    priority: 'medium',
    delay: 300,
    intersectionThreshold: 0.1,
    rootMargin: '50px',
    retryAttempts: 2,
    retryDelay: 2000,
  },
  
  // Low priority - load last or on user interaction
  low: {
    priority: 'low',
    delay: 1000,
    intersectionThreshold: 0.05,
    rootMargin: '25px',
    retryAttempts: 1,
    retryDelay: 3000,
  },
};

// Component-specific loading configurations
export const COMPONENT_LOADING_CONFIG = {
  // Layout components - critical
  header: LOADING_STRATEGIES.critical,
  footer: LOADING_STRATEGIES.critical,
  breadcrumbs: LOADING_STRATEGIES.critical,
  
  // Core UI components - high priority
  button: LOADING_STRATEGIES.high,
  card: LOADING_STRATEGIES.high,
  input: LOADING_STRATEGIES.high,
  
  // Interactive components - medium priority
  youtubePlayer: LOADING_STRATEGIES.medium,
  dailyDevotional: LOADING_STRATEGIES.medium,
  dailyVerse: LOADING_STRATEGIES.medium,
  modernInteractions: LOADING_STRATEGIES.medium,
  
  // Non-critical components - low priority
  analytics: LOADING_STRATEGIES.low,
  performanceMonitor: LOADING_STRATEGIES.low,
  floatingContact: LOADING_STRATEGIES.low,
  newsletterSignup: LOADING_STRATEGIES.low,
  googleMaps: LOADING_STRATEGIES.low,
  pwaInstall: LOADING_STRATEGIES.low,
};

// Progressive loading phases
export const LOADING_PHASES = {
  // Phase 1: Critical components (0-100ms)
  critical: {
    components: ['header', 'footer', 'breadcrumbs', 'button', 'card'],
    maxDelay: 100,
  },
  
  // Phase 2: High priority components (100-500ms)
  high: {
    components: ['youtubePlayer', 'modernInteractions'],
    maxDelay: 500,
  },
  
  // Phase 3: Medium priority components (500ms-2s)
  medium: {
    components: ['dailyDevotional', 'dailyVerse'],
    maxDelay: 2000,
  },
  
  // Phase 4: Low priority components (2s+)
  low: {
    components: ['analytics', 'performanceMonitor', 'floatingContact', 'newsletterSignup'],
    maxDelay: 5000,
  },
};

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals thresholds
  LCP: 2500, // Largest Contentful Paint
  FID: 100,  // First Input Delay
  CLS: 0.1,  // Cumulative Layout Shift
  
  // Custom thresholds
  componentLoadTime: 1000, // Max time for component to load
  intersectionDelay: 100,  // Delay before intersection observer triggers
  retryTimeout: 5000,      // Timeout for retry attempts
};

// Loading state management
export class LoadingStateManager {
  private static instance: LoadingStateManager;
  private loadedComponents = new Set<string>();
  private loadingComponents = new Set<string>();
  private failedComponents = new Set<string>();
  private loadingStartTimes = new Map<string, number>();

  static getInstance(): LoadingStateManager {
    if (!LoadingStateManager.instance) {
      LoadingStateManager.instance = new LoadingStateManager();
    }
    return LoadingStateManager.instance;
  }

  startLoading(componentName: string): void {
    this.loadingComponents.add(componentName);
    this.loadingStartTimes.set(componentName, Date.now());
  }

  finishLoading(componentName: string): void {
    this.loadingComponents.delete(componentName);
    this.loadedComponents.add(componentName);
    this.loadingStartTimes.delete(componentName);
  }

  failLoading(componentName: string): void {
    this.loadingComponents.delete(componentName);
    this.failedComponents.add(componentName);
    this.loadingStartTimes.delete(componentName);
  }

  isLoaded(componentName: string): boolean {
    return this.loadedComponents.has(componentName);
  }

  isLoading(componentName: string): boolean {
    return this.loadingComponents.has(componentName);
  }

  hasFailed(componentName: string): boolean {
    return this.failedComponents.has(componentName);
  }

  getLoadingTime(componentName: string): number | null {
    const startTime = this.loadingStartTimes.get(componentName);
    return startTime ? Date.now() - startTime : null;
  }

  getLoadingStats() {
    return {
      loaded: this.loadedComponents.size,
      loading: this.loadingComponents.size,
      failed: this.failedComponents.size,
      total: this.loadedComponents.size + this.loadingComponents.size + this.failedComponents.size,
    };
  }
}

// Utility functions for loading strategy
export function getLoadingStrategy(componentName: string): LoadingStrategy {
  return (COMPONENT_LOADING_CONFIG as any)[componentName] || LOADING_STRATEGIES.medium;
}

export function shouldLoadComponent(componentName: string, phase: keyof typeof LOADING_PHASES): boolean {
  return LOADING_PHASES[phase].components.includes(componentName);
}

export function getPhaseDelay(phase: keyof typeof LOADING_PHASES): number {
  return LOADING_PHASES[phase].maxDelay;
}

// Performance monitoring for lazy loading
export function measureComponentLoadTime(componentName: string, startTime: number): void {
  const loadTime = Date.now() - startTime;
  
  // Log performance metrics
  if (typeof window !== 'undefined' && window.performance) {
    window.performance.mark(`${componentName}-loaded`);
    window.performance.measure(
      `${componentName}-load-time`,
      `${componentName}-start`,
      `${componentName}-loaded`
    );
  }
  
  // Log component load performance
  componentLogger.logComponentLoad(componentName, loadTime);
}
