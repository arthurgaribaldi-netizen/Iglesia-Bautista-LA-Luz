import { renderHook } from '@testing-library/react';
import { useBreadcrumbs, useCustomBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { BreadcrumbItem } from '@/components/ui/breadcrumbs';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = require('next/navigation').usePathname as jest.MockedFunction<typeof require('next/navigation').usePathname>;

describe('useBreadcrumbs Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty array for root path', () => {
    mockUsePathname.mockReturnValue('/');
    
    const { result } = renderHook(() => useBreadcrumbs());
    
    expect(result.current).toEqual([]);
  });

  it('should generate breadcrumbs for known routes', () => {
    mockUsePathname.mockReturnValue('/sobre');
    
    const { result } = renderHook(() => useBreadcrumbs());
    
    expect(result.current).toEqual([
      { label: 'Sobre Nós', href: '/sobre' }
    ]);
  });

  it('should generate breadcrumbs for admin routes', () => {
    mockUsePathname.mockReturnValue('/admin/eventos');
    
    const { result } = renderHook(() => useBreadcrumbs());
    
    expect(result.current).toEqual([
      { label: 'Eventos', href: '/admin/eventos' }
    ]);
  });

  it('should generate breadcrumbs for nested admin routes', () => {
    mockUsePathname.mockReturnValue('/admin/configuracoes');
    
    const { result } = renderHook(() => useBreadcrumbs());
    
    expect(result.current).toEqual([
      { label: 'Configurações', href: '/admin/configuracoes' }
    ]);
  });

  it('should generate fallback breadcrumbs for unknown routes', () => {
    mockUsePathname.mockReturnValue('/unknown-route');
    
    const { result } = renderHook(() => useBreadcrumbs());
    
    expect(result.current).toEqual([
      { label: 'Unknown Route', href: '/unknown-route' }
    ]);
  });

  it('should generate fallback breadcrumbs for kebab-case routes', () => {
    mockUsePathname.mockReturnValue('/my-custom-page');
    
    const { result } = renderHook(() => useBreadcrumbs());
    
    expect(result.current).toEqual([
      { label: 'My Custom Page', href: '/my-custom-page' }
    ]);
  });

  it('should generate multiple breadcrumbs for nested paths', () => {
    mockUsePathname.mockReturnValue('/admin/eventos/edit');
    
    const { result } = renderHook(() => useBreadcrumbs());
    
    expect(result.current).toEqual([
      { label: 'Eventos', href: '/admin/eventos' },
      { label: 'Edit', href: '/admin/eventos/edit' }
    ]);
  });

  it('should handle complex nested paths', () => {
    mockUsePathname.mockReturnValue('/admin/recursos/categories/subcategory');
    
    const { result } = renderHook(() => useBreadcrumbs());
    
    expect(result.current).toEqual([
      { label: 'Recursos', href: '/admin/recursos' },
      { label: 'Categories', href: '/admin/recursos/categories' },
      { label: 'Subcategory', href: '/admin/recursos/categories/subcategory' }
    ]);
  });

  it('should memoize results for same pathname', () => {
    mockUsePathname.mockReturnValue('/sobre');
    
    const { result, rerender } = renderHook(() => useBreadcrumbs());
    const firstResult = result.current;
    
    rerender();
    const secondResult = result.current;
    
    expect(firstResult).toBe(secondResult); // Same reference due to memoization
  });

  it('should update when pathname changes', () => {
    const { result, rerender } = renderHook(() => useBreadcrumbs());
    
    mockUsePathname.mockReturnValue('/sobre');
    rerender();
    expect(result.current).toEqual([{ label: 'Sobre Nós', href: '/sobre' }]);
    
    mockUsePathname.mockReturnValue('/eventos');
    rerender();
    expect(result.current).toEqual([{ label: 'Eventos', href: '/eventos' }]);
  });
});

describe('useCustomBreadcrumbs Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return custom items when provided', () => {
    const customItems: BreadcrumbItem[] = [
      { label: 'Custom 1', href: '/custom1' },
      { label: 'Custom 2', href: '/custom2' }
    ];
    
    mockUsePathname.mockReturnValue('/sobre');
    
    const { result } = renderHook(() => useCustomBreadcrumbs(customItems));
    
    expect(result.current).toEqual(customItems);
  });

  it('should return auto-generated breadcrumbs when no custom items provided', () => {
    mockUsePathname.mockReturnValue('/sobre');
    
    const { result } = renderHook(() => useCustomBreadcrumbs());
    
    expect(result.current).toEqual([
      { label: 'Sobre Nós', href: '/sobre' }
    ]);
  });

  it('should return auto-generated breadcrumbs when custom items is undefined', () => {
    mockUsePathname.mockReturnValue('/eventos');
    
    const { result } = renderHook(() => useCustomBreadcrumbs(undefined));
    
    expect(result.current).toEqual([
      { label: 'Eventos', href: '/eventos' }
    ]);
  });

  it('should memoize custom items', () => {
    const customItems: BreadcrumbItem[] = [
      { label: 'Custom Item', href: '/custom' }
    ];
    
    const { result, rerender } = renderHook(() => useCustomBreadcrumbs(customItems));
    const firstResult = result.current;
    
    rerender();
    const secondResult = result.current;
    
    expect(firstResult).toBe(secondResult);
  });

  it('should update when custom items change', () => {
    const { result, rerender } = renderHook(() => useCustomBreadcrumbs());
    
    const customItems1: BreadcrumbItem[] = [{ label: 'Item 1', href: '/item1' }];
    rerender({ customItems: customItems1 });
    expect(result.current).toEqual(customItems1);
    
    const customItems2: BreadcrumbItem[] = [{ label: 'Item 2', href: '/item2' }];
    rerender({ customItems: customItems2 });
    expect(result.current).toEqual(customItems2);
  });
});
