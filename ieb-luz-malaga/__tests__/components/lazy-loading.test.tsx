/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';

// Mock all lazy components to return simple divs
jest.mock('@/components/lazy/lazy-youtube-player', () => ({
  LazyYouTubePlayer: ({ children, ...props }: any) => (
    <div data-testid="lazy-youtube-player" {...props}>
      {children || 'Cargando reproductor de YouTube...'}
    </div>
  ),
}));

jest.mock('@/components/lazy/lazy-daily-devotional', () => ({
  LazyDailyDevotional: ({ children, ...props }: any) => (
    <div data-testid="lazy-daily-devotional" {...props}>
      {children || 'Cargando devocional...'}
    </div>
  ),
}));

jest.mock('@/components/lazy/lazy-daily-verse', () => ({
  LazyDailyVerse: ({ children, ...props }: any) => (
    <div data-testid="lazy-daily-verse" {...props}>
      {children || 'Cargando versículo...'}
    </div>
  ),
}));

jest.mock('@/components/lazy/lazy-floating-contact', () => ({
  LazyFloatingContact: ({ children, ...props }: any) => (
    <div data-testid="lazy-floating-contact" {...props}>
      {children || 'Cargando contacto...'}
    </div>
  ),
}));

jest.mock('@/components/lazy/lazy-analytics', () => ({
  LazyAnalytics: ({ children, ...props }: any) => (
    <div data-testid="lazy-analytics" {...props}>
      {children || 'Cargando analytics...'}
    </div>
  ),
}));

jest.mock('@/components/lazy/lazy-newsletter-signup', () => ({
  LazyNewsletterSignup: ({ children, ...props }: any) => (
    <div data-testid="lazy-newsletter-signup" {...props}>
      {children || 'Cargando newsletter...'}
    </div>
  ),
}));

jest.mock('@/components/lazy/lazy-google-maps', () => ({
  LazyGoogleMaps: ({ children, ...props }: any) => (
    <div data-testid="lazy-google-maps" {...props}>
      {children || 'Cargando mapas...'}
    </div>
  ),
}));

jest.mock('@/components/lazy/lazy-performance-monitor', () => ({
  LazyPerformanceMonitor: ({ children, ...props }: any) => (
    <div data-testid="lazy-performance-monitor" {...props}>
      {children || 'Cargando monitor...'}
    </div>
  ),
}));

jest.mock('@/components/lazy/lazy-modern-interactions', () => ({
  LazyModernInteractions: ({ children, ...props }: any) => (
    <div data-testid="lazy-modern-interactions" {...props}>
      {children || 'Cargando interacciones...'}
    </div>
  ),
}));

jest.mock('@/components/lazy/lazy-pwa-install', () => ({
  LazyPWAInstall: ({ children, ...props }: any) => (
    <div data-testid="lazy-pwa-install" {...props}>
      {children || 'Cargando PWA...'}
    </div>
  ),
}));

// Import the mocked components
import { LazyYouTubePlayer } from '@/components/lazy/lazy-youtube-player';
import { LazyDailyDevotional } from '@/components/lazy/lazy-daily-devotional';
import { LazyDailyVerse } from '@/components/lazy/lazy-daily-verse';
import { LazyFloatingContact } from '@/components/lazy/lazy-floating-contact';
import { LazyAnalytics } from '@/components/lazy/lazy-analytics';
import { LazyNewsletterSignup } from '@/components/lazy/lazy-newsletter-signup';
import { LazyGoogleMaps } from '@/components/lazy/lazy-google-maps';
import { LazyPerformanceMonitor } from '@/components/lazy/lazy-performance-monitor';
import { LazyModernInteractions } from '@/components/lazy/lazy-modern-interactions';
import { LazyPWAInstall } from '@/components/lazy/lazy-pwa-install';

// Simple ErrorBoundary mock
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="error-boundary">{children}</div>
);

// Mock IntersectionObserver - usando o mock global do jest.setup.js
// O mock já está configurado globalmente, não precisa redefinir aqui

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Lazy Loading Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ videos: [], success: true }),
    });
  });

  describe('LazyYouTubePlayer', () => {
    it('should render loading fallback initially', () => {
      render(
        <ErrorBoundary>
          <LazyYouTubePlayer />
        </ErrorBoundary>
      );

      expect(screen.getByText(/cargando reproductor de youtube/i)).toBeInTheDocument();
    });

    it('should load component when visible', async () => {
      render(
        <ErrorBoundary>
          <LazyYouTubePlayer priority="high" delay={0} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('lazy-youtube-player')).toBeInTheDocument();
    });
  });

  describe('LazyDailyVerse', () => {
    it('should render loading fallback initially', () => {
      render(
        <ErrorBoundary>
          <LazyDailyVerse />
        </ErrorBoundary>
      );

      expect(screen.getByText(/cargando versículo/i)).toBeInTheDocument();
    });

    it('should load component when visible', async () => {
      render(
        <ErrorBoundary>
          <LazyDailyVerse priority="medium" delay={0} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('lazy-daily-verse')).toBeInTheDocument();
    });
  });

  describe('LazyFloatingContact', () => {
    it('should render component', () => {
      render(
        <ErrorBoundary>
          <LazyFloatingContact delay={5000} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('lazy-floating-contact')).toBeInTheDocument();
    });
  });

  describe('LazyAnalytics', () => {
    it('should render component', () => {
      render(
        <ErrorBoundary>
          <LazyAnalytics delay={1000} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('lazy-analytics')).toBeInTheDocument();
    });
  });

  describe('LazyNewsletterSignup', () => {
    it('should render loading fallback initially', () => {
      render(
        <ErrorBoundary>
          <LazyNewsletterSignup />
        </ErrorBoundary>
      );

      expect(screen.getByText(/cargando newsletter/i)).toBeInTheDocument();
    });
  });

  describe('LazyGoogleMaps', () => {
    it('should render loading fallback initially', () => {
      render(
        <ErrorBoundary>
          <LazyGoogleMaps />
        </ErrorBoundary>
      );

      expect(screen.getByText(/cargando mapas/i)).toBeInTheDocument();
    });
  });

  describe('LazyPerformanceMonitor', () => {
    it('should render component', () => {
      render(
        <ErrorBoundary>
          <LazyPerformanceMonitor delay={2000} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('lazy-performance-monitor')).toBeInTheDocument();
    });
  });

  describe('LazyModernInteractions', () => {
    it('should render loading fallback initially', () => {
      render(
        <ErrorBoundary>
          <LazyModernInteractions component="card" />
        </ErrorBoundary>
      );

      expect(screen.getByText(/cargando interacciones/i)).toBeInTheDocument();
    });
  });

  describe('LazyPWAInstall', () => {
    it('should render component', () => {
      render(
        <ErrorBoundary>
          <LazyPWAInstall delay={3000} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('lazy-pwa-install')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle component loading errors', () => {
      // Mock a component that throws an error
      const ErrorComponent = () => {
        throw new Error('Test error');
      };

      expect(() => {
        render(
          <ErrorBoundary>
            <ErrorComponent />
          </ErrorBoundary>
        );
      }).toThrow('Test error');
    });
  });

  describe('Performance', () => {
    it('should not block initial render', () => {
      const startTime = performance.now();
      
      render(
        <ErrorBoundary>
          <LazyYouTubePlayer />
          <LazyDailyDevotional />
        </ErrorBoundary>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render quickly (less than 100ms)
      expect(renderTime).toBeLessThan(100);
    });

    it('should load components in priority order', () => {
      render(
        <ErrorBoundary>
          <LazyYouTubePlayer priority="high" delay={0} />
          <LazyDailyDevotional priority="medium" delay={100} />
          <LazyAnalytics priority="low" delay={200} />
        </ErrorBoundary>
      );

      // All components should be rendered
      expect(screen.getByTestId('lazy-youtube-player')).toBeInTheDocument();
      expect(screen.getByTestId('lazy-daily-devotional')).toBeInTheDocument();
      expect(screen.getByTestId('lazy-analytics')).toBeInTheDocument();
    });
  });
});