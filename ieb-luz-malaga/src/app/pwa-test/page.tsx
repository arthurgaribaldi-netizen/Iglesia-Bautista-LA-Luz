'use client';

import { useState, useEffect } from 'react';
import { pwaLogger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePWAInstall } from '@/components/pwa-install';
import { CheckCircle, XCircle, Download, Smartphone, Wifi, WifiOff } from 'lucide-react';

export default function PWATestPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<'checking' | 'registered' | 'not-supported' | 'error'>('checking');
  const [pwaFeatures, setPwaFeatures] = useState({
    serviceWorker: false,
    manifest: false,
    installPrompt: false,
    offline: false,
  });

  const { isInstallable, isInstalled, install, canInstall } = usePWAInstall();

  useEffect(() => {
    // Check online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    // Check service worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(() => {
          setServiceWorkerStatus('registered');
          setPwaFeatures(prev => ({ ...prev, serviceWorker: true }));
        })
        .catch(() => {
          setServiceWorkerStatus('error');
        });
    } else {
      setServiceWorkerStatus('not-supported');
    }

    // Check manifest
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      setPwaFeatures(prev => ({ ...prev, manifest: true }));
    }

    // Check install prompt
    if (canInstall) {
      setPwaFeatures(prev => ({ ...prev, installPrompt: true }));
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [canInstall]);

  const handleInstall = async() => {
    if (canInstall) {
      const success = await install();
      if (success) {
        pwaLogger.log('installed successfully!');
      }
    }
  };

  const testOffline = () => {
    setPwaFeatures(prev => ({ ...prev, offline: true }));
  };

  const FeatureCheck = ({ feature, label, description }: { feature: boolean; label: string; description: string }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg border">
      {feature ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <XCircle className="w-5 h-5 text-red-500" />
      )}
      <div>
        <h3 className="font-medium">{label}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">PWA Test - IEB La Luz Málaga</h1>
        <p className="text-gray-600">
          Esta página te permite probar todas las funcionalidades de la Progressive Web App.
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            {isOnline ? <Wifi className="w-5 h-5 text-green-500" /> : <WifiOff className="w-5 h-5 text-red-500" />}
            Estado de Conexión
          </h2>
          <p className={isOnline ? 'text-green-600' : 'text-red-600'}>
            {isOnline ? 'Conectado a Internet' : 'Sin conexión a Internet'}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {isOnline 
              ? 'La aplicación está funcionando normalmente' 
              : 'Algunas funciones pueden estar limitadas sin conexión'
            }
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-500" />
            Estado de la PWA
          </h2>
          <p className={isInstalled ? 'text-green-600' : 'text-orange-600'}>
            {isInstalled ? 'PWA Instalada' : 'PWA Disponible para Instalar'}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {isInstalled 
              ? 'La aplicación está instalada como app nativo' 
              : 'Puedes instalar la aplicación en tu dispositivo'
            }
          </p>
        </Card>
      </div>

      {/* PWA Features */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Funcionalidades PWA</h2>
        <div className="space-y-3">
          <FeatureCheck
            feature={pwaFeatures.serviceWorker}
            label="Service Worker"
            description="Permite funcionamiento offline y cache de recursos"
          />
          <FeatureCheck
            feature={pwaFeatures.manifest}
            label="Web App Manifest"
            description="Define metadatos para la instalación de la app"
          />
          <FeatureCheck
            feature={pwaFeatures.installPrompt}
            label="Prompt de Instalación"
            description="Permite instalar la app como aplicación nativa"
          />
          <FeatureCheck
            feature={isOnline ? pwaFeatures.offline : true}
            label="Funcionamiento Offline"
            description="La app funciona sin conexión a internet"
          />
        </div>
      </Card>

      {/* Service Worker Status */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Service Worker</h2>
        <div className="flex items-center gap-3 mb-4">
          {serviceWorkerStatus === 'registered' && <CheckCircle className="w-5 h-5 text-green-500" />}
          {serviceWorkerStatus === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
          {serviceWorkerStatus === 'not-supported' && <XCircle className="w-5 h-5 text-red-500" />}
          {serviceWorkerStatus === 'checking' && <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
          
          <span className="font-medium">
            {serviceWorkerStatus === 'registered' && 'Service Worker Registrado'}
            {serviceWorkerStatus === 'error' && 'Error en Service Worker'}
            {serviceWorkerStatus === 'not-supported' && 'Service Worker No Soportado'}
            {serviceWorkerStatus === 'checking' && 'Verificando Service Worker...'}
          </span>
        </div>
        
        {serviceWorkerStatus === 'registered' && (
          <p className="text-sm text-gray-600">
            El Service Worker está funcionando correctamente. La app puede funcionar offline.
          </p>
        )}
        
        {serviceWorkerStatus === 'error' && (
          <p className="text-sm text-red-600">
            Hubo un problema al registrar el Service Worker. Revisa la consola para más detalles.
          </p>
        )}
        
        {serviceWorkerStatus === 'not-supported' && (
          <p className="text-sm text-red-600">
            Tu navegador no soporta Service Workers. Usa Chrome, Firefox, Safari o Edge moderno.
          </p>
        )}
      </Card>

      {/* Installation */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Instalación</h2>
        
        {isInstalled ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-green-600 mb-2">¡PWA Instalada!</h3>
            <p className="text-gray-600">
              La aplicación está instalada en tu dispositivo. Puedes acceder desde la pantalla de inicio.
            </p>
          </div>
        ) : isInstallable ? (
          <div className="text-center py-8">
            <Download className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Instalar Aplicación</h3>
            <p className="text-gray-600 mb-4">
              Puedes instalar esta aplicación en tu dispositivo para un acceso más rápido.
            </p>
            <Button onClick={handleInstall} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Instalar App
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-orange-600 mb-2">No Disponible</h3>
            <p className="text-gray-600 mb-4">
              La instalación no está disponible. Esto puede deberse a:
            </p>
            <ul className="text-left text-sm text-gray-600 space-y-1 max-w-md mx-auto">
              <li>• Ya está instalada</li>
              <li>• Navegador no soporta PWA</li>
              <li>• Falta conexión HTTPS</li>
              <li>• Falta manifest.json</li>
            </ul>
          </div>
        )}
      </Card>

      {/* Test Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Pruebas</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Prueba Offline</h3>
            <p className="text-sm text-gray-600 mb-3">
              Desconecta tu internet y recarga la página para probar el funcionamiento offline.
            </p>
            <Button variant="outline" onClick={testOffline}>
              Marcar como Probado
            </Button>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Instrucciones para Mobile</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Android (Chrome):</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Abre la página en Chrome</li>
                <li>Toca el menú (⋮) y selecciona "Instalar app"</li>
                <li>O espera a que aparezca el banner de instalación</li>
              </ul>
              
              <p><strong>iOS (Safari):</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Abre la página en Safari</li>
                <li>Toca el botón de compartir (□↑)</li>
                <li>Selecciona "Añadir a pantalla de inicio"</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
