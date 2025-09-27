import { ClientOnly } from '@/components/ui/client-only';
import { PWAInstall } from '@/components/pwa-install';

interface PWAClientOnlyProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Wrapper para PWAInstall que só renderiza no cliente
 * Evita problemas de hidration com APIs do navegador
 */
export function PWAClientOnly({ className, children }: PWAClientOnlyProps) {
  return (
    <ClientOnly fallback={null}>
      <PWAInstall className={className}>
        {children}
      </PWAInstall>
    </ClientOnly>
  );
}
