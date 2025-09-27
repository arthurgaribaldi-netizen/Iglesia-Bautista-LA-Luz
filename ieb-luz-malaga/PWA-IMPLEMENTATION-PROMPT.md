# PROMPT PARA IMPLEMENTAÇÃO DE PWA - IEB La Luz Málaga

## 🎯 MISSÃO: IMPLEMENTAR PROGRESSIVE WEB APP (PWA)

Você é um **Desenvolvedor Frontend Sênior** especializado em PWA e otimização mobile. Sua missão é transformar o site da Iglesia Evangélica Bautista La Luz Málaga em uma Progressive Web App instalável.

### 📋 CONTEXTO DO PROJETO
- **Projeto**: Site da igreja (https://ieblaluzmalaga.es/)
- **Stack**: Next.js 14, TypeScript, Tailwind CSS
- **Objetivo**: Tornar o site instalável no mobile como app nativo
- **Status**: Fase 1 - PWA Implementation

## 🚀 OBJETIVOS ESPECÍFICOS

### 1. **Web App Manifest**
Criar `public/manifest.json` com:
```json
{
  "name": "IEB La Luz Málaga",
  "short_name": "IEB La Luz",
  "description": "Iglesia Evangélica Bautista La Luz Málaga - Sitio oficial",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "es",
  "categories": ["religion", "lifestyle"],
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "Sermones",
      "short_name": "Sermones",
      "description": "Biblioteca de sermones",
      "url": "/sermoes",
      "icons": [{ "src": "/icon-192x192.png", "sizes": "192x192" }]
    },
    {
      "name": "Eventos",
      "short_name": "Eventos",
      "description": "Próximos eventos",
      "url": "/eventos",
      "icons": [{ "src": "/icon-192x192.png", "sizes": "192x192" }]
    }
  ]
}
```

### 2. **Service Worker**
Criar `public/sw.js` com estratégia de cache:
```javascript
const CACHE_NAME = 'ieb-luz-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/sobre',
  '/sermoes',
  '/eventos',
  '/recursos',
  '/contato',
  '/manifest.json'
];

// Cache First Strategy para recursos estáticos
// Network First Strategy para APIs
// Stale While Revalidate para páginas HTML
```

### 3. **Ícones PWA**
Gerar ícones em `public/`:
- `icon-192x192.png` (192x192px)
- `icon-512x512.png` (512x512px)
- `apple-touch-icon.png` (180x180px)
- `favicon.ico` (32x32px)

**Design dos ícones**:
- Fundo: Azul (#3b82f6)
- Símbolo: Cruz ou lâmpada (representando "La Luz")
- Estilo: Moderno, minimalista
- Formato: PNG com transparência

### 4. **Meta Tags PWA**
Atualizar `src/app/layout.tsx`:
```typescript
export const metadata = {
  // ... metadata existente
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'IEB La Luz'
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  }
}

// Adicionar no <head>:
<link rel="manifest" href="/manifest.json" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="IEB La Luz" />
<meta name="mobile-web-app-capable" content="yes" />
```

### 5. **Componente de Instalação PWA**
Criar `src/components/pwa-install.tsx`:
```typescript
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('PWA instalado com sucesso')
    }
    
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Download className="h-6 w-6 text-blue-600" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              Instalar IEB La Luz
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Acesso rápido como app nativo
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleInstall} size="sm">
            Instalar
          </Button>
          <Button 
            onClick={() => setShowInstallPrompt(false)} 
            variant="outline" 
            size="sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
```

### 6. **Página Offline**
Criar `src/app/offline/page.tsx`:
```typescript
import { Button } from '@/components/ui/button'
import { Wifi, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-6 p-8">
        <Wifi className="h-16 w-16 text-gray-400 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sin conexión a internet
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-md">
          No hay conexión a internet. Algunas páginas pueden estar disponibles offline.
        </p>
        <div className="space-y-3">
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
          <div>
            <Link href="/">
              <Button variant="outline">
                Ir al inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 7. **Registro do Service Worker**
Criar `src/lib/pwa.ts`:
```typescript
export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registrado com sucesso:', registration)
        })
        .catch((error) => {
          console.log('Falha no registro do SW:', error)
        })
    })
  }
}

export function unregisterSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister()
      })
    })
  }
}
```

## 🎨 DESIGN DOS ÍCONES

### Especificações Técnicas
- **Formato**: PNG com transparência
- **Estilo**: Flat design, minimalista
- **Cores**: 
  - Primária: #3b82f6 (azul)
  - Secundária: #ffffff (branco)
  - Accent: #fbbf24 (dourado)

### Elementos Visuais
- **Símbolo principal**: Cruz estilizada ou lâmpada
- **Texto**: "IEB" ou "La Luz"
- **Fundo**: Gradiente sutil ou sólido
- **Bordas**: Arredondadas (8px radius)

## 📱 TESTES OBRIGATÓRIOS

### Dispositivos de Teste
- **Android**: Chrome, Samsung Internet
- **iOS**: Safari, Chrome
- **Desktop**: Chrome, Edge, Firefox

### Checklist de Funcionalidades
- [ ] Manifest carrega corretamente
- [ ] Service Worker registra sem erros
- [ ] Ícones aparecem na tela inicial
- [ ] App abre em modo standalone
- [ ] Funcionamento offline básico
- [ ] Prompt de instalação aparece
- [ ] Shortcuts funcionam
- [ ] Meta tags aplicadas corretamente

## 🚀 IMPLEMENTAÇÃO STEP-BY-STEP

### Passo 1: Manifest
1. Criar `public/manifest.json`
2. Configurar metadados básicos
3. Definir ícones e cores

### Passo 2: Service Worker
1. Criar `public/sw.js`
2. Implementar estratégias de cache
3. Configurar fallbacks offline

### Passo 3: Ícones
1. Gerar ícones em diferentes tamanhos
2. Otimizar para diferentes dispositivos
3. Testar em tela inicial

### Passo 4: Meta Tags
1. Atualizar `layout.tsx`
2. Adicionar meta tags PWA
3. Configurar viewport mobile

### Passo 5: Componentes
1. Criar componente de instalação
2. Implementar página offline
3. Registrar service worker

### Passo 6: Testes
1. Testar em dispositivos reais
2. Verificar funcionamento offline
3. Validar prompt de instalação

## 📊 MÉTRICAS DE SUCESSO

### Performance
- **Carregamento inicial**: < 2s
- **Cache hit rate**: > 80%
- **Tempo offline**: Funcionamento básico

### Usabilidade
- **Installability**: Prompt aparece corretamente
- **Standalone mode**: App abre sem browser
- **Offline experience**: Páginas essenciais disponíveis

### Técnicas
- **Lighthouse PWA score**: > 90
- **Service Worker**: Registra sem erros
- **Manifest**: Valida sem warnings

## 🔧 COMANDOS ÚTEIS

```bash
# Testar PWA localmente
npm run dev
# Abrir Chrome DevTools > Application > Manifest
# Verificar Service Worker em Application > Service Workers

# Build para produção
npm run build
npm run start

# Testar em dispositivo móvel
# Usar ngrok ou similar para tunnel local
```

## 🚨 REGRAS IMPORTANTES

1. **NUNCA** quebrar funcionalidades existentes
2. **SEMPRE** testar em dispositivos reais
3. **SEMPRE** manter compatibilidade com iOS
4. **SEMPRE** otimizar para performance
5. **SEMPRE** documentar mudanças

## 🎯 RESULTADO ESPERADO

Após implementação completa:
- ✅ Site instalável como app nativo
- ✅ Funcionamento offline básico
- ✅ Experiência mobile otimizada
- ✅ Prompt de instalação funcional
- ✅ Ícones personalizados da igreja
- ✅ Performance melhorada com cache

**Tempo Estimado**: 2-3 dias
**Prioridade**: Alta
**Impacto**: Experiência mobile significativamente melhorada

---

**INSTRUÇÕES FINAIS**: Implemente cada passo sequencialmente, testando após cada etapa. Mantenha o foco na experiência do usuário e na missão espiritual da igreja. O PWA deve facilitar o acesso à comunidade e aos recursos espirituais.
