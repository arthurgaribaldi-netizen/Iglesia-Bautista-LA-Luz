import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to force SSR for all routes
 * This ensures that all pages are server-side rendered
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Force SSR headers
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  // Add SSR-specific headers
  response.headers.set('X-Render-Mode', 'SSR');
  response.headers.set('X-Static-Generation', 'false');
  
  // Disable static optimization
  response.headers.set('X-Static-Page', 'false');
  
  // Force dynamic rendering
  response.headers.set('X-Dynamic-Render', 'true');

  return response;
}

// Apply middleware to all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};