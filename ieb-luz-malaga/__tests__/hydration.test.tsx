import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { FloatingContact } from '@/components/ui/floating-contact';
import { ModernScrollIndicator } from '@/components/ui/modern-interactions';
import { PWAInstall } from '@/components/pwa-install';
import { DailyVerse } from '@/components/ui/daily-verse';
import { ClientOnly } from '@/components/ui/client-only';

// Mock para APIs do cliente
const mockWindow = {
  matchMedia: jest.fn(() => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })),
  navigator: {
    share: jest.fn(),
    clipboard: {
      writeText: jest.fn(),
    },
  },
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  scrollY: 0,
  innerHeight: 800,
  location: {
    href: 'http://localhost:3000',
  },
};

const mockDocument = {
  documentElement: {
    scrollHeight: 2000,
  },
  querySelector: jest.fn(() => null),
};

// Setup global mocks
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockWindow.matchMedia,
});

Object.defineProperty(window, 'navigator', {
  writable: true,
  value: mockWindow.navigator,
});

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  value: mockWindow.addEventListener,
});

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  value: mockWindow.removeEventListener,
});

Object.defineProperty(window, 'scrollY', {
  writable: true,
  value: mockWindow.scrollY,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  value: mockWindow.innerHeight,
});

Object.defineProperty(window, 'location', {
  writable: true,
  value: mockWindow.location,
});

Object.defineProperty(document, 'documentElement', {
  writable: true,
  value: mockDocument.documentElement,
});

Object.defineProperty(document, 'querySelector', {
  writable: true,
  value: mockDocument.querySelector,
});

// Mock fetch para APIs
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      success: true,
      data: {
        reference: 'João 3:16',
        text: 'Porque Deus amou o mundo de tal maneira...',
        type: 'verso-oro',
      },
    }),
  })
) as jest.Mock;

describe('Hydration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console.error to catch hydration warnings
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('ThemeProvider', () => {
    it('should not cause hydration mismatch', async () => {
      const TestComponent = () => (
        <ThemeProvider>
          <div data-testid="theme-content">Theme Content</div>
        </ThemeProvider>
      );

      const { container } = render(<TestComponent />);
      
      // Wait for hydration to complete
      await waitFor(() => {
        expect(screen.getByTestId('theme-content')).toBeInTheDocument();
      });

      // Check that no hydration errors were logged
      expect(console.error).not.toHaveBeenCalledWith(
        expect.stringContaining('Hydration')
      );
    });
  });

  describe('ThemeToggle', () => {
    it('should render consistently between server and client', async () => {
      const TestComponent = () => (
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const { container } = render(<TestComponent />);
      
      // Wait for client-side hydration
      await waitFor(() => {
        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();
      });

      // Verify no hydration warnings
      expect(console.error).not.toHaveBeenCalledWith(
        expect.stringContaining('Hydration')
      );
    });
  });

  describe('ClientOnly Component', () => {
    it('should render fallback on server and content on client', async () => {
      const TestComponent = () => (
        <ClientOnly fallback={<div data-testid="fallback">Loading...</div>}>
          <div data-testid="client-content">Client Content</div>
        </ClientOnly>
      );

      const { container } = render(<TestComponent />);
      
      // Initially should show fallback
      expect(screen.getByTestId('fallback')).toBeInTheDocument();
      
      // After hydration, should show client content
      await waitFor(() => {
        expect(screen.getByTestId('client-content')).toBeInTheDocument();
      });

      expect(console.error).not.toHaveBeenCalledWith(
        expect.stringContaining('Hydration')
      );
    });
  });

  describe('FloatingContact', () => {
    it('should not cause hydration mismatch with scroll events', async () => {
      const TestComponent = () => (
        <FloatingContact />
      );

      const { container } = render(<TestComponent />);
      
      // Wait for client-side initialization
      await waitFor(() => {
        // Component should not be visible initially (3 second delay)
        expect(container.firstChild).toBeNull();
      });

      // Simulate time passing
      jest.advanceTimersByTime(3000);

      await waitFor(() => {
        // Now should be visible
        expect(container.firstChild).not.toBeNull();
      });

      expect(console.error).not.toHaveBeenCalledWith(
        expect.stringContaining('Hydration')
      );
    });
  });

  describe('ModernScrollIndicator', () => {
    it('should handle scroll events without hydration issues', async () => {
      const TestComponent = () => (
        <ModernScrollIndicator />
      );

      const { container } = render(<TestComponent />);
      
      // Initially should not render (not client)
      expect(container.firstChild).toBeNull();
      
      // After hydration, should render
      await waitFor(() => {
        expect(container.firstChild).not.toBeNull();
      });

      // Simulate scroll event
      Object.defineProperty(window, 'scrollY', { value: 100 });
      window.dispatchEvent(new Event('scroll'));

      await waitFor(() => {
        const progressBar = container.querySelector('[style*="width"]');
        expect(progressBar).toBeInTheDocument();
      });

      expect(console.error).not.toHaveBeenCalledWith(
        expect.stringContaining('Hydration')
      );
    });
  });

  describe('PWAInstall', () => {
    it('should handle PWA APIs without hydration mismatch', async () => {
      const TestComponent = () => (
        <PWAInstall />
      );

      const { container } = render(<TestComponent />);
      
      // Should not render initially (not supported)
      expect(container.firstChild).toBeNull();
      
      // After hydration, should still not render (not supported in test)
      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });

      expect(console.error).not.toHaveBeenCalledWith(
        expect.stringContaining('Hydration')
      );
    });
  });

  describe('DailyVerse', () => {
    it('should handle navigator APIs without hydration issues', async () => {
      const TestComponent = () => (
        <DailyVerse />
      );

      const { container } = render(<TestComponent />);
      
      // Should show loading initially
      await waitFor(() => {
        expect(screen.getByText(/Cargando|Loading/)).toBeInTheDocument();
      });

      // After API call completes
      await waitFor(() => {
        expect(screen.getByText('João 3:16')).toBeInTheDocument();
      });

      // Test share functionality
      const shareButton = container.querySelector('button[title*="Compartir"]');
      if (shareButton) {
        shareButton.click();
        
        await waitFor(() => {
          expect(mockWindow.navigator.share).toHaveBeenCalled();
        });
      }

      expect(console.error).not.toHaveBeenCalledWith(
        expect.stringContaining('Hydration')
      );
    });
  });

  describe('Integration Tests', () => {
    it('should render multiple client components without hydration conflicts', async () => {
      const TestComponent = () => (
        <ThemeProvider>
          <div>
            <ThemeToggle />
            <ClientOnly fallback={<div>Loading...</div>}>
              <FloatingContact />
            </ClientOnly>
            <ModernScrollIndicator />
          </div>
        </ThemeProvider>
      );

      const { container } = render(<TestComponent />);
      
      // Wait for all components to hydrate
      await waitFor(() => {
        expect(container.querySelector('button')).toBeInTheDocument();
      });

      // Verify no hydration errors
      expect(console.error).not.toHaveBeenCalledWith(
        expect.stringContaining('Hydration')
      );
    });
  });
});
