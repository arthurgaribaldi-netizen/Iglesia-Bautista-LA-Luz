import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { checkAlerts } from '@/lib/alerts';

export async function POST(request: NextRequest) {
  const user = await requireAdmin(request);
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const metrics = await request.json();
    checkAlerts(metrics);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process alerts' }, { status: 500 });
  }
}
