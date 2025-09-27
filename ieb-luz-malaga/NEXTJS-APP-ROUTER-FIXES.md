# Correções para Problemas do Next.js App Router no Ambiente de Teste

## Problemas Identificados

### 1. Configuração Incompatível - Static Export vs App Router
**Problema**: `next.config.js` está configurado com `output: 'export'` que é incompatível com App Router.

**Solução**: Criar configurações separadas para desenvolvimento/produção.

### 2. API Routes Não Funcionando nos Testes
**Problema**: Funções de API retornam `undefined` em vez de Response objects.

**Solução**: Corrigir implementação das API routes e mocks.

### 3. Intersection Observer Não Mockado
**Problema**: `observer.observe is not a function` em componentes que usam intersection observer.

**Solução**: Adicionar mock adequado para Intersection Observer.

### 4. Problemas de Memória no Jest
**Problema**: Jest worker running out of memory.

**Solução**: Otimizar configuração do Jest.

## Implementação das Correções

### 1. Criar next.config.production.js
```javascript
import path from 'path';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {
  // Remover output: 'export' para App Router
  // output: 'export', // REMOVIDO
  // trailingSlash: true, // REMOVIDO
  // skipTrailingSlashRedirect: true, // REMOVIDO
  
  // Manter outras configurações...
  compress: true,
  poweredByHeader: false,
  
  // ... resto da configuração
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
```

### 2. Atualizar jest.setup.js
```javascript
// Mock Intersection Observer
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

### 3. Corrigir jest.config.js
```javascript
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/__tests__/e2e/'],
  
  // Aumentar limite de memória
  maxWorkers: '25%', // Reduzido de 50%
  workerIdleMemoryLimit: '1GB', // Aumentado de 512MB
  
  // Otimizações de transformação
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  
  // Configurações de módulos otimizadas
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@supabase/supabase-js$': '<rootDir>/__mocks__/@supabase/supabase-js.ts',
  },
  
  // Configurações de cobertura mais restritivas
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/app/**/loading.tsx',
    '!src/app/**/error.tsx',
    '!src/app/**/not-found.tsx',
  ],
  
  // Timeout aumentado
  testTimeout: 60000,
  
  // Configurações de cache
  cacheDirectory: '<rootDir>/.jest-cache',
  
  // Configurações de setup
  setupFiles: [],
  
  // Configurações de globals
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
```

### 4. Criar Mock para API Routes
```javascript
// __mocks__/next/server.ts
export const NextRequest = class NextRequest {
  constructor(url, options = {}) {
    this.url = url;
    this.method = options.method || 'GET';
    this.headers = new Map();
    this._json = options.json || {};
  }
  
  async json() {
    return this._json;
  }
  
  async text() {
    return JSON.stringify(this._json);
  }
};

export const NextResponse = {
  json: (data, options = {}) => ({
    json: () => Promise.resolve(data),
    status: options.status || 200,
    headers: new Map(),
  }),
  
  error: (message, options = {}) => ({
    json: () => Promise.resolve({ message }),
    status: options.status || 500,
    headers: new Map(),
  }),
};
```

### 5. Atualizar package.json Scripts
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "build:static": "prisma generate && next build && next export",
    "build:production": "prisma generate && next build --config next.config.production.js",
    "test:ci": "jest --ci --coverage --watchAll=false --maxWorkers=25% --workerIdleMemoryLimit=1GB",
    "test:api": "jest --testPathPattern=api --maxWorkers=25%",
    "test:components": "jest --testPathPattern=components --maxWorkers=25%",
    "test:pages": "jest --testPathPattern=pages --maxWorkers=25%"
  }
}
```

### 6. Corrigir API Routes
Verificar se todas as API routes estão retornando NextResponse corretamente:

```typescript
// Exemplo de correção para API route
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Lógica da API
    const data = { /* dados */ };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
```

## Ordem de Implementação

1. **Primeiro**: Corrigir configuração do Next.js (remover static export)
2. **Segundo**: Atualizar mocks do Jest
3. **Terceiro**: Corrigir API routes
4. **Quarto**: Otimizar configuração do Jest
5. **Quinto**: Executar testes para verificar correções

## Verificação

Após implementar as correções, executar:
```bash
npm run test:ci
npm run test:api
npm run test:components
```

## Notas Importantes

- O App Router requer um servidor Node.js e não funciona com static export
- Para deploy estático, considere usar Pages Router ou uma solução alternativa
- Os mocks devem ser configurados antes dos testes serem executados
- A configuração de memória do Jest deve ser ajustada conforme o ambiente
