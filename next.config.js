import path from 'path';
import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSR-Only Configuration
  reactStrictMode: true,
  
  // App Router compatible configuration
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  // Force SSR for all pages - no static generation
  output: 'standalone',
  
  // Disable all static optimization to force SSR
  staticPageGenerationTimeout: 0,
  
  // Force dynamic rendering for all routes
  experimental: {
    forceSwcTransforms: true,
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Experimental features for SSR and App Router
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    instrumentationHook: true,
    serverComponentsExternalPackages: ['@prisma/client'],
    forceSwcTransforms: true,
  },

  // Skip database connection during build to prevent prerendering errors
  env: {
    SKIP_DATABASE_CHECK: 'true',
  },

  // Headers for caching and security
  async headers() {
    return [
      // Global security headers
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Next.js static assets - long-term caching (1 year)
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Static assets - long-term caching (1 year)
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Images and media files - medium-term caching (1 day client, 1 year CDN)
      {
        source: '/:path*\\.(png|jpg|jpeg|gif|webp|svg|ico|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=31536000',
          },
        ],
      },
      // Fonts - long-term caching (1 year)
      {
        source: '/:path*\\.(woff|woff2|eot|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // CSS and JS files - medium-term caching (1 hour client, 1 day CDN)
      {
        source: '/:path*\\.(css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
        ],
      },
      // Static pages - short-term caching with revalidation (1 hour client, 1 day CDN)
      {
        source: '/(sobre|contato|recursos|ministerios|eventos)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
          },
        ],
      },
      // Home page - medium-term caching (30 minutes client, 1 hour CDN)
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=3600',
          },
        ],
      },
      // Dynamic pages - no caching
      {
        source: '/(admin|api)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      // Service Worker - no caching
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      // Manifest files - short-term caching (1 hour)
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ];
  },

  // SSR-optimized webpack config
  webpack: (config, { dev, isServer }) => {
    // SSR optimizations
    if (!dev && !isServer) {
      // Keep basic optimizations for SSR
      config.optimization.minimize = true;
      
      // Optimize for SSR bundle size
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      };
    }

    // Module resolution optimizations
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': new URL('./src', import.meta.url).pathname,
    };

    return config;
  },
};

const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
};

// Temporarily disable Sentry for build issues
// export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
export default nextConfig;
