import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { ClientOnly } from '@/components/ui/client-only';

describe('ClientOnly Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should render fallback on server side', () => {
    const TestComponent = () => (
      <ClientOnly fallback={<div data-testid="fallback">Server Fallback</div>}>
        <div data-testid="client-content">Client Content</div>
      </ClientOnly>
    );

    const { container } = render(<TestComponent />);
    
    // Should show fallback initially
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('client-content')).not.toBeInTheDocument();
  });

  it('should render children after hydration', async () => {
    // Use fake timers for this test
    jest.useFakeTimers();
    
    const TestComponent = () => (
      <ClientOnly fallback={<div data-testid="fallback">Loading...</div>}>
        <div data-testid="client-content">Client Content</div>
      </ClientOnly>
    );

    const { container } = render(<TestComponent />);
    
    // Initially should show fallback
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('client-content')).not.toBeInTheDocument();
    
    // Fast-forward timers to trigger useEffect
    act(() => {
      jest.runAllTimers();
    });
    
    // After hydration, should show client content
    await waitFor(() => {
      expect(screen.getByTestId('client-content')).toBeInTheDocument();
    }, { timeout: 1000 });
    
    // Fallback should be removed
    expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();
    
    jest.useRealTimers();
  });

  it('should render null fallback by default', () => {
    const TestComponent = () => (
      <ClientOnly>
        <div data-testid="client-content">Client Content</div>
      </ClientOnly>
    );

    const { container } = render(<TestComponent />);
    
    // Should render nothing initially (null fallback)
    expect(container.firstChild).toBeNull();
  });

  it('should handle complex children', async () => {
    jest.useFakeTimers();
    
    const TestComponent = () => (
      <ClientOnly fallback={<div>Loading...</div>}>
        <div>
          <h1>Title</h1>
          <p>Content</p>
          <button>Click me</button>
        </div>
      </ClientOnly>
    );

    const { container } = render(<TestComponent />);
    
    // Initially should show fallback
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Fast-forward timers
    act(() => {
      jest.runAllTimers();
    });
    
    // After hydration, should show complex child
    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    }, { timeout: 1000 });
    
    jest.useRealTimers();
  });

  it('should handle multiple ClientOnly components', async () => {
    jest.useFakeTimers();
    
    const TestComponent = () => (
      <div>
        <ClientOnly fallback={<div data-testid="fallback-1">Loading 1...</div>}>
          <div data-testid="content-1">Content 1</div>
        </ClientOnly>
        <ClientOnly fallback={<div data-testid="fallback-2">Loading 2...</div>}>
          <div data-testid="content-2">Content 2</div>
        </ClientOnly>
      </div>
    );

    const { container } = render(<TestComponent />);
    
    // Initially should show both fallbacks
    expect(screen.getByTestId('fallback-1')).toBeInTheDocument();
    expect(screen.getByTestId('fallback-2')).toBeInTheDocument();
    
    // Fast-forward timers
    act(() => {
      jest.runAllTimers();
    });
    
    // After hydration, should show both contents
    await waitFor(() => {
      expect(screen.getByTestId('content-1')).toBeInTheDocument();
      expect(screen.getByTestId('content-2')).toBeInTheDocument();
    }, { timeout: 1000 });
    
    // Fallbacks should be removed
    expect(screen.queryByTestId('fallback-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('fallback-2')).not.toBeInTheDocument();
    
    jest.useRealTimers();
  });

  it('should not cause hydration mismatch', async () => {
    jest.useFakeTimers();
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const TestComponent = () => (
      <ClientOnly fallback={<div>Server</div>}>
        <div>Client</div>
      </ClientOnly>
    );

    const { container } = render(<TestComponent />);
    
    // Fast-forward timers
    act(() => {
      jest.runAllTimers();
    });
    
    // Wait for hydration
    await waitFor(() => {
      expect(screen.getByText('Client')).toBeInTheDocument();
    }, { timeout: 1000 });
    
    // Should not have hydration mismatch errors
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('hydration')
    );
    
    consoleSpy.mockRestore();
    jest.useRealTimers();
  });
});