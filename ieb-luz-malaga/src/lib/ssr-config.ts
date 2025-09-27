/**
 * SSR Configuration
 * Forces all pages to use Server-Side Rendering
 */

// Force dynamic rendering for all pages
export const dynamic = 'force-dynamic';

// Disable static generation
export const revalidate = false;

// Force SSR for all routes
export const runtime = 'nodejs';

// SSR metadata
export const metadata = {
  title: 'Igreja Bautista La Luz - Málaga',
  description: 'Uma comunidade cristã vibrante em Málaga, Espanha',
  keywords: ['igreja', 'bautista', 'málaga', 'espanha', 'cristão', 'evangélico'],
  authors: [{ name: 'Igreja Bautista La Luz' }],
  creator: 'Igreja Bautista La Luz',
  publisher: 'Igreja Bautista La Luz',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// SSR headers
export const headers = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

// Force SSR for specific route segments
export function generateStaticParams() {
  // Return empty array to force SSR
  return [];
}

// SSR-specific configuration
export const ssrConfig = {
  // Force all pages to be server-rendered
  forceDynamic: true,
  
  // Disable static optimization
  staticPageGenerationTimeout: 0,
  
  // Enable server components
  serverComponents: true,
  
  // Disable client-side hydration for static content
  clientComponents: false,
  
  // SSR-specific optimizations
  optimizations: {
    // Minimize JavaScript bundle
    minimizeJS: true,
    
    // Optimize CSS
    optimizeCSS: true,
    
    // Enable compression
    compress: true,
    
    // Disable unnecessary features for SSR
    disableClientSideFeatures: [
      'framer-motion',
      'client-only',
      'dynamic-imports'
    ]
  }
};
