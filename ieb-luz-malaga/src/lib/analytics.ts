// Analytics and monitoring for YouTube integration
interface YouTubeAnalytics {
  apiCalls: number
  cacheHits: number
  cacheMisses: number
  errors: number
  lastCall: string
  averageResponseTime: number
}

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  metadata?: Record<string, any>
}

class YouTubeAnalyticsTracker {
  private metrics: YouTubeAnalytics = {
    apiCalls: 0,
    cacheHits: 0,
    cacheMisses: 0,
    errors: 0,
    lastCall: '',
    averageResponseTime: 0,
  };

  private performanceMetrics: PerformanceMetric[] = [];
  private responseTimes: number[] = [];

  // Track API call
  trackApiCall(cached: boolean, responseTime?: number) {
    this.metrics.apiCalls++;
    this.metrics.lastCall = new Date().toISOString();
    
    if (cached) {
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
    }

    if (responseTime) {
      this.responseTimes.push(responseTime);
      // Keep only last 100 response times for average calculation
      if (this.responseTimes.length > 100) {
        this.responseTimes = this.responseTimes.slice(-100);
      }
      
      this.metrics.averageResponseTime = 
        this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
    }

    // Store performance metric
    this.performanceMetrics.push({
      name: 'youtube_api_call',
      value: responseTime || 0,
      timestamp: Date.now(),
      metadata: {
        cached,
        channelId: 'UCiahUfyUv3VbwrMjgLh-WzA',
      },
    });

    // Keep only last 1000 metrics
    if (this.performanceMetrics.length > 1000) {
      this.performanceMetrics = this.performanceMetrics.slice(-1000);
    }
  }

  // Track error
  trackError(error: string, context?: string) {
    this.metrics.errors++;
    
    this.performanceMetrics.push({
      name: 'youtube_api_error',
      value: 1,
      timestamp: Date.now(),
      metadata: {
        error,
        context: context || 'unknown',
      },
    });
  }

  // Get current metrics
  getMetrics(): YouTubeAnalytics {
    return { ...this.metrics };
  }

  // Get performance metrics
  getPerformanceMetrics(limit: number = 100): PerformanceMetric[] {
    return this.performanceMetrics.slice(-limit);
  }

  // Get cache hit rate
  getCacheHitRate(): number {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    return total > 0 ? (this.metrics.cacheHits / total) * 100 : 0;
  }

  // Get API usage summary
  getUsageSummary() {
    return {
      totalApiCalls: this.metrics.apiCalls,
      cacheHitRate: this.getCacheHitRate(),
      averageResponseTime: Math.round(this.metrics.averageResponseTime),
      errorRate: this.metrics.apiCalls > 0 ? (this.metrics.errors / this.metrics.apiCalls) * 100 : 0,
      lastCall: this.metrics.lastCall,
    };
  }

  // Reset metrics (useful for testing)
  reset() {
    this.metrics = {
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errors: 0,
      lastCall: '',
      averageResponseTime: 0,
    };
    this.performanceMetrics = [];
    this.responseTimes = [];
  }
}

// Create singleton instance
export const youtubeAnalytics = new YouTubeAnalyticsTracker();

// Utility function to measure API response time
export function measureApiCall<T>(
  apiCall: () => Promise<T>,
  trackMetrics: boolean = true,
): Promise<T> {
  const startTime = Date.now();
  
  return apiCall().then(
    (result) => {
      const responseTime = Date.now() - startTime;
      if (trackMetrics) {
        youtubeAnalytics.trackApiCall(false, responseTime);
      }
      return result;
    },
    (error) => {
      const responseTime = Date.now() - startTime;
      if (trackMetrics) {
        youtubeAnalytics.trackError(error.message || 'Unknown error', 'api_call');
      }
      throw error;
    },
  );
}

// API endpoint to get analytics (for admin/monitoring)
export function getAnalyticsData() {
  return {
    metrics: youtubeAnalytics.getMetrics(),
    usageSummary: youtubeAnalytics.getUsageSummary(),
    performanceMetrics: youtubeAnalytics.getPerformanceMetrics(50),
    cacheStats: {
      hitRate: youtubeAnalytics.getCacheHitRate(),
      totalCalls: youtubeAnalytics.getMetrics().apiCalls,
    },
  };
}
