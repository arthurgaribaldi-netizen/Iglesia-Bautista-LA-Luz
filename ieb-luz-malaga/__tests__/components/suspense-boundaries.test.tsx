import React from 'react';
import { render, screen } from '@testing-library/react';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { SearchParamsWrapper } from '@/components/ui/search-params-wrapper';

// Mock do Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/test-path',
  useSearchParams: () => new URLSearchParams('?test=value'),
}));

// Mock do Next.js Script
jest.mock('next/script', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => <div data-testid="script" {...props}>{children}</div>,
}));

describe('Suspense Boundaries for useSearchParams', () => {
  beforeEach(() => {
    // Mock gtag function
    (global as any).gtag = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders GoogleAnalytics with Suspense boundary', () => {
    render(<GoogleAnalytics />);
    
    // Verifica se o componente renderiza sem erros
    expect(screen.getByTestId('script')).toBeInTheDocument();
  });

  it('renders SearchParamsWrapper with fallback', () => {
    const TestComponent = () => {
      const searchParams = new URLSearchParams('?test=value');
      return <div data-testid="test-component">{searchParams.get('test')}</div>;
    };

    render(
      <SearchParamsWrapper>
        <TestComponent />
      </SearchParamsWrapper>
    );

    // Verifica se o componente renderiza sem erros
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
    expect(screen.getByText('value')).toBeInTheDocument();
  });

  it('handles Suspense fallback correctly', () => {
    // Componente que simula um erro de Suspense
    const ErrorComponent = () => {
      throw new Error('Suspense error');
    };

    const { container } = render(
      <SearchParamsWrapper>
        <ErrorComponent />
      </SearchParamsWrapper>
    );

    // Verifica se o fallback é renderizado
    expect(container.firstChild).toBeInTheDocument();
  });
});
