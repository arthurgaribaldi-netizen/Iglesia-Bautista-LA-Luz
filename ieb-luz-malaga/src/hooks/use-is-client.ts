'use client';

import { useEffect, useState } from 'react';

/**
 * Hook para verificar se o componente está sendo executado no cliente
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isClient = useIsClient();
 *   
 *   if (!isClient) {
 *     return <Skeleton />;
 *   }
 *   
 *   return <div>{window.location.href}</div>;
 * }
 * ```
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Use setTimeout to ensure this runs after the initial render
    const timer = setTimeout(() => {
      setIsClient(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  return isClient;
}
