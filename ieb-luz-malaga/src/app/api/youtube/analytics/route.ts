import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsData } from '@/lib/analytics';
import { youtubeCache } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    // Check if user has permission to view analytics
    // In a real app, you'd check authentication/authorization here
    const authHeader = request.headers.get('authorization');
    
    // Simple check for development - in production, use proper auth
    if (process.env.NODE_ENV === 'production' && !authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    // Add timeout protection for analytics data fetching
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Analytics data fetch timeout')), 8000);
    });

    const analyticsPromise = Promise.resolve().then(() => {
      const analyticsData = getAnalyticsData();
      const cacheStats = youtubeCache.getStats();

      return {
        ...analyticsData,
        cache: cacheStats,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      };
    });

    const result = await Promise.race([analyticsPromise, timeoutPromise]);

    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Analytics API Error:', error);
    
    // Return fallback data instead of error to prevent page crashes
    const fallbackData = {
      metrics: {
        apiCalls: 0,
        cacheHits: 0,
        cacheMisses: 0,
        errors: 1,
        lastCall: new Date().toISOString(),
        averageResponseTime: 0,
      },
      usageSummary: {
        totalApiCalls: 0,
        cacheHitRate: 0,
        averageResponseTime: 0,
        errorRate: 100,
        lastCall: new Date().toISOString(),
      },
      cache: {
        totalEntries: 0,
        validEntries: 0,
        expiredEntries: 0,
        memoryUsage: 0,
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    
    return NextResponse.json(fallbackData, { status: 200 });
  }
}

// Reset analytics data (for testing/admin purposes)
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (process.env.NODE_ENV === 'production' && !authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    // Import here to avoid circular dependency
    const { youtubeAnalytics } = await import('@/lib/analytics');
    
    youtubeAnalytics.reset();
    youtubeCache.clear();

    return NextResponse.json({
      message: 'Analytics data reset successfully',
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Analytics Reset Error:', error);
    
    return NextResponse.json(
      { error: 'Failed to reset analytics data' },
      { status: 500 },
    );
  }
}
