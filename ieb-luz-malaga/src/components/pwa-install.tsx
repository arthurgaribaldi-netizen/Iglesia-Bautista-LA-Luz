'use client';

import { useState, useEffect } from 'react';
import { pwaLogger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { useIsClient } from '@/hooks/use-is-client';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallProps {
  className?: string;
  children?: React.ReactNode;
}

export function PWAInstall({ className, children }: PWAInstallProps = {}) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;
    
    // Check if PWA is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return true;
      }
      
      // Check for iOS Safari
      if ((window.navigator as Navigator & { standalone?: boolean }).standalone === true) {
        setIsInstalled(true);
        return true;
      }
      
      return false;
    };

    // Check if PWA is supported
    const checkSupport = () => {
      const hasServiceWorker = 'serviceWorker' in navigator;
      const hasManifest = !!document.querySelector('link[rel="manifest"]');
      const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
      
      return hasServiceWorker && hasManifest && isHTTPS;
    };

    setIsSupported(checkSupport());
    
    if (checkIfInstalled()) {
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install prompt after a delay (not immediately)
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check periodically if app was installed
    const checkInterval = setInterval(() => {
      if (checkIfInstalled()) {
        clearInterval(checkInterval);
      }
    }, 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearInterval(checkInterval);
    };
  }, [isClient]);

  const handleInstallClick = async() => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        pwaLogger.log('User accepted the install prompt');
      } else {
        pwaLogger.log('User dismissed the install prompt');
      }
    } catch (error) {
      pwaLogger.error('Error during install prompt:', error);
    } finally {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    if (isClient) {
      sessionStorage.setItem('pwa-install-dismissed', 'true');
    }
  };

  const handleClose = () => {
    setShowInstallPrompt(false);
  };

  // Don't show if not supported, already installed, or dismissed this session
  if (!isSupported || isInstalled || !showInstallPrompt) {
    return null;
  }

  // Check if user dismissed this session
  if (isClient && sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm ${className || ''}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {children || 'Instalar App'}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
              Instala IEB La Luz en tu dispositivo para un acceso más rápido y una mejor experiencia.
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={handleInstallClick}
                size="sm"
                className="text-xs h-8 px-3"
              >
                <Download className="w-3 h-3 mr-1" />
                Instalar
              </Button>
              
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
                className="text-xs h-8 px-3"
              >
                Ahora no
              </Button>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Smartphone className="w-3 h-3" />
            <span>Acceso directo desde la pantalla de inicio</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
            <Monitor className="w-3 h-3" />
            <span>Funciona sin conexión a internet</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for PWA installation status
export function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isClient]);

  const install = async() => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      return choiceResult.outcome === 'accepted';
    } catch (error) {
      pwaLogger.error('Error during install prompt:', error);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    install,
    canInstall: !!deferredPrompt,
  };
}
