import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = await requireAdmin(request);
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Mock data - in production, this would come from your analytics service
  const metrics = {
    performance: {
      lcp: 2.1,
      cls: 0.05,
      fcp: 1.2,
      ttfb: 180,
    },
    errors: {
      total: 12,
      critical: 2,
      resolved: 8,
      new: 4,
    },
    traffic: {
      pageViews: 1250,
      uniqueVisitors: 890,
      bounceRate: 0.35,
      avgSessionDuration: 180,
    },
    uptime: {
      current: 99.9,
      last24h: 99.8,
      last7d: 99.7,
    },
  };

  return NextResponse.json(metrics);
}
