'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Componente que só renderiza no cliente, evitando problemas de hidration
 * 
 * @example
 * ```tsx
 * <ClientOnly fallback={<Skeleton />}>
 *   <ComponentThatUsesWindow />
 * </ClientOnly>
 * ```
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Use setTimeout to ensure this runs after the initial render
    const timer = setTimeout(() => {
      setHasMounted(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
