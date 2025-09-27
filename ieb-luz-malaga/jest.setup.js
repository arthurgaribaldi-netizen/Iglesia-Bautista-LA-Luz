import '@testing-library/jest-dom';

// ============================================================================
// CONFIGURAÇÕES DE TIMEOUT PARA TESTES ASSÍNCRONOS
// ============================================================================

// Configuração global de timeout para testes assíncronos
jest.setTimeout(process.env.CI ? 180000 : 90000); // 3min em CI, 1.5min localmente

// Configuração de timeout para waitFor - otimizada para diferentes tipos de teste
const DEFAULT_TIMEOUT = process.env.CI ? 30000 : 15000; // 30s em CI, 15s localmente
const DEFAULT_INTERVAL = 50; // 50ms entre verificações
const FAST_TIMEOUT = process.env.CI ? 10000 : 5000; // 10s em CI, 5s localmente
const SLOW_TIMEOUT = process.env.CI ? 60000 : 30000; // 1min em CI, 30s localmente

// Extensão do waitFor com timeout customizado e melhor tratamento de erros
global.waitForWithTimeout = async (callback, options = {}) => {
  const { 
    timeout = DEFAULT_TIMEOUT, 
    interval = DEFAULT_INTERVAL,
    message = 'Condition not met within timeout'
  } = options;
  
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = async () => {
      try {
        const result = await callback();
        if (result) {
          resolve(result);
        } else if (Date.now() - startTime >= timeout) {
          reject(new Error(`${message} after ${timeout}ms`));
        } else {
          setTimeout(check, interval);
        }
      } catch (error) {
        if (Date.now() - startTime >= timeout) {
          reject(new Error(`${message} after ${timeout}ms: ${error.message}`));
        } else {
          setTimeout(check, interval);
        }
      }
    };
    
    check();
  });
};

// Helper para testes rápidos
global.waitForFast = (callback, options = {}) => 
  global.waitForWithTimeout(callback, { ...options, timeout: FAST_TIMEOUT });

// Helper para testes lentos
global.waitForSlow = (callback, options = {}) => 
  global.waitForWithTimeout(callback, { ...options, timeout: SLOW_TIMEOUT });

// Helper para aguardar com retry automático
global.waitForWithRetry = async (callback, options = {}) => {
  const { maxRetries = 3, retryDelay = 1000, ...waitOptions } = options;
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await global.waitForWithTimeout(callback, waitOptions);
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  throw lastError;
};

// ============================================================================
// MOCKS ESSENCIAIS PARA TESTES - OTIMIZADOS COM TIMEOUT
// ============================================================================

// Mock global objects essenciais com cache
const createCachedMock = (factory) => {
  let instance = null;
  return (...args) => {
    if (!instance) {
      instance = factory(...args);
    }
    return instance;
  };
};

// Mock global objects essenciais
global.Request = global.Request || class Request {
  constructor(input, init = {}) {
    this.url = input;
    this.method = init.method || 'GET';
    this.headers = new Headers(init.headers);
    this.body = init.body;
    this._json = init.json;
  }
  
  async json() {
    if (this._json) return this._json;
    return typeof this.body === 'string' ? JSON.parse(this.body || '{}') : {};
  }
  
  async text() {
    return typeof this.body === 'string' ? this.body : JSON.stringify(this._json || {});
  }
};

global.Response = global.Response || class Response {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.statusText = init.statusText || 'OK';
    this.headers = new Headers(init.headers);
    this.ok = this.status >= 200 && this.status < 300;
  }
  
  async json() {
    return typeof this.body === 'string' ? JSON.parse(this.body || '{}') : this.body;
  }
  
  async text() {
    return typeof this.body === 'string' ? this.body : JSON.stringify(this.body || {});
  }
};

global.Headers = global.Headers || class Headers {
  constructor(init) {
    this._headers = new Map();
    if (init) {
      if (Array.isArray(init)) {
        init.forEach(([key, value]) => {
          this._headers.set(key.toLowerCase(), value);
        });
      } else {
        Object.entries(init).forEach(([key, value]) => {
          this._headers.set(key.toLowerCase(), value);
        });
      }
    }
  }
  
  get(name) {
    return this._headers.get(name.toLowerCase());
  }
  
  set(name, value) {
    this._headers.set(name.toLowerCase(), value);
  }
  
  has(name) {
    return this._headers.has(name.toLowerCase());
  }
  
  delete(name) {
    this._headers.delete(name.toLowerCase());
  }
  
  entries() {
    return this._headers.entries();
  }
  
  keys() {
    return this._headers.keys();
  }
  
  values() {
    return this._headers.values();
  }
};

// ============================================================================
// MOCKS DO NEXT.JS - OTIMIZADOS
// ============================================================================

// Mock Next.js router (App Router) com cache
const mockRouterMethods = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => mockRouterMethods),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  usePathname: jest.fn(() => '/'),
  useParams: jest.fn(() => ({})),
  useRoute: jest.fn(() => ({})),
  notFound: jest.fn(() => {
    throw new Error('Not Found');
  }),
  redirect: jest.fn((url) => {
    throw new Error(`Redirect to ${url}`);
  }),
}));

// Mock Next.js server components
jest.mock('next/server', () => ({
  NextRequest: class NextRequest {
    constructor(input, init = {}) {
      this.url = input;
      this.method = init.method || 'GET';
      this.headers = new Map(Object.entries(init.headers || {}));
      this.body = init.body;
      this._json = init.json || {};
    }
    
    async json() {
      return typeof this.body === 'string' ? JSON.parse(this.body || '{}') : this._json;
    }
    
    async text() {
      return typeof this.body === 'string' ? this.body : JSON.stringify(this._json);
    }
    
    get nextUrl() {
      return {
        searchParams: new URLSearchParams(this.url.split('?')[1] || ''),
      };
    }
  },
  NextResponse: {
    json: jest.fn((data, init = {}) => {
      const response = new global.Response(JSON.stringify(data), {
        status: init.status || 200,
        statusText: init.statusText || 'OK',
        headers: {
          'Content-Type': 'application/json',
          ...init.headers,
        },
      });
      // IMPORTANTE: Garantir que o método json existe
      response.json = jest.fn().mockResolvedValue(data);
      return response;
    }),
    redirect: jest.fn((url, init = {}) => {
      const response = new global.Response('', {
        status: init.status || 302,
        statusText: init.statusText || 'Found',
        headers: {
          'Location': url,
          ...init.headers,
        },
      });
      response.json = jest.fn().mockResolvedValue({});
      return response;
    }),
    error: jest.fn((message, init = {}) => {
      const response = new global.Response(JSON.stringify({ message }), {
        status: init.status || 500,
        statusText: init.statusText || 'Internal Server Error',
        headers: {
          'Content-Type': 'application/json',
          ...init.headers,
        },
      });
      response.json = jest.fn().mockResolvedValue({ message });
      return response;
    }),
  },
}));

// ============================================================================
// MOCKS DE SUPABASE - OTIMIZADOS
// ============================================================================

// Mock Supabase com cache e performance otimizada
const createSupabaseQueryMock = () => ({
  select: jest.fn(() => ({
    eq: jest.fn(() => ({
      single: jest.fn(() => Promise.resolve({ data: null, error: null })),
      data: Promise.resolve([]),
      error: null,
    })),
    order: jest.fn(() => Promise.resolve({ data: [], error: null })),
    data: Promise.resolve([]),
    error: null,
  })),
  insert: jest.fn(() => ({
    select: jest.fn(() => Promise.resolve({ data: [{ id: 1 }], error: null })),
    data: Promise.resolve({ id: 1 }),
    error: null,
  })),
  update: jest.fn(() => ({
    eq: jest.fn(() => Promise.resolve({ data: { id: 1 }, error: null })),
    data: Promise.resolve({ id: 1 }),
    error: null,
  })),
  delete: jest.fn(() => ({
    eq: jest.fn(() => Promise.resolve({ data: { id: 1 }, error: null })),
    data: Promise.resolve({ id: 1 }),
    error: null,
  })),
});

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => createSupabaseQueryMock()),
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signInWithPassword: jest.fn(() => Promise.resolve({ data: { user: null, session: null }, error: null })),
      signUp: jest.fn(() => Promise.resolve({ data: { user: null, session: null }, error: null })),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
      getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    },
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(() => Promise.resolve({ data: { path: 'test-path' }, error: null })),
        download: jest.fn(() => Promise.resolve({ data: new Blob(), error: null })),
        remove: jest.fn(() => Promise.resolve({ data: [{ name: 'test-file' }], error: null })),
        getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'https://example.com/test-file' } })),
        list: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    },
  },
}));

// ============================================================================
// MOCKS DE PRISMA - OTIMIZADOS
// ============================================================================

// Factory para criar mocks de modelo Prisma com cache
const createPrismaModelMock = () => ({
  findFirst: jest.fn(() => Promise.resolve(null)),
  findUnique: jest.fn(() => Promise.resolve(null)),
  findMany: jest.fn(() => Promise.resolve([])),
  create: jest.fn(() => Promise.resolve({ id: 1 })),
  update: jest.fn(() => Promise.resolve({ id: 1 })),
  delete: jest.fn(() => Promise.resolve({ id: 1 })),
  count: jest.fn(() => Promise.resolve(0)),
  upsert: jest.fn(() => Promise.resolve({ id: 1 })),
  aggregate: jest.fn(() => Promise.resolve({ _count: { _all: 0 } })),
  groupBy: jest.fn(() => Promise.resolve([])),
});

const mockPrisma = {
  churchInfo: createPrismaModelMock(),
  event: createPrismaModelMock(),
  sermon: createPrismaModelMock(),
  usefulLink: createPrismaModelMock(),
  resource: createPrismaModelMock(),
  organizationalLink: createPrismaModelMock(),
  alert: createPrismaModelMock(),
  newsletter: createPrismaModelMock(),
  devotional: createPrismaModelMock(),
  contact: createPrismaModelMock(),
  $connect: jest.fn(() => Promise.resolve()),
  $disconnect: jest.fn(() => Promise.resolve()),
  $transaction: jest.fn((callback) => callback(mockPrisma)),
};

jest.mock('@/lib/db', () => ({
  prisma: mockPrisma,
}));

// Export mockPrisma for use in tests
global.mockPrisma = mockPrisma;

// ============================================================================
// MOCKS DE WEB APIs - OTIMIZADOS
// ============================================================================

// Mock IntersectionObserver com cache e controle de timing otimizado
// Compatível com Framer Motion e outros componentes que usam IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: jest.fn().mockImplementation((callback, options = {}) => {
    const observedElements = new Set();
    const timeoutIds = new Set();
    const isConnected = true;
    
    // Helper para criar entry de intersection
    const createIntersectionEntry = (element, isIntersecting = true) => ({
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: element.getBoundingClientRect?.() || { 
        top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 
      },
      intersectionRect: isIntersecting ? (element.getBoundingClientRect?.() || { 
        top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 
      }) : { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 },
      rootBounds: { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 },
      target: element,
      time: Date.now(),
    });
    
    const observer = {
      callback,
      options,
      observedElements,
      isConnected: () => isConnected,
      
      observe: jest.fn((element) => {
        if (!element || !isConnected) return;
        
        observedElements.add(element);
        
        // Simula callback assíncrono com timeout controlado
        // Usa requestAnimationFrame para melhor timing em testes
        const scheduleCallback = () => {
          if (!isConnected || !observedElements.has(element)) return;
          
          const timeoutId = setTimeout(() => {
            timeoutIds.delete(timeoutId);
            
            if (isConnected && observedElements.has(element)) {
              try {
                const entry = createIntersectionEntry(element, true);
                callback([entry], observer);
              } catch (error) {
                console.warn('IntersectionObserver callback error:', error);
              }
            }
          }, options.delay || 0);
          
          timeoutIds.add(timeoutId);
        };
        
        // Use requestAnimationFrame se disponível, senão setTimeout
        if (typeof requestAnimationFrame !== 'undefined') {
          requestAnimationFrame(scheduleCallback);
        } else {
          scheduleCallback();
        }
      }),
      
      unobserve: jest.fn((element) => {
        observedElements.delete(element);
      }),
      
      disconnect: jest.fn(() => {
        observedElements.clear();
        // Limpa todos os timeouts pendentes
        timeoutIds.forEach(id => clearTimeout(id));
        timeoutIds.clear();
      }),
      
      // Método para simular mudanças de visibilidade (útil para testes)
      simulateIntersection: jest.fn((element, isIntersecting = true) => {
        if (!isConnected || !observedElements.has(element)) return;
        
        try {
          const entry = createIntersectionEntry(element, isIntersecting);
          callback([entry], observer);
        } catch (error) {
          console.warn('IntersectionObserver simulateIntersection error:', error);
        }
      }),
    };
    
    return observer;
  }),
});

// Também definir no global para compatibilidade
global.IntersectionObserver = window.IntersectionObserver;

// Mock requestAnimationFrame para compatibilidade com IntersectionObserver
if (typeof requestAnimationFrame === 'undefined') {
  global.requestAnimationFrame = jest.fn((callback) => {
    return setTimeout(callback, 16); // ~60fps
  });
  global.cancelAnimationFrame = jest.fn((id) => {
    clearTimeout(id);
  });
}

// Mock ResizeObserver otimizado
global.ResizeObserver = jest.fn().mockImplementation((callback) => {
  const observedElements = new Set();
  
  return {
    observe: jest.fn((element) => {
      observedElements.add(element);
    }),
    unobserve: jest.fn((element) => {
      observedElements.delete(element);
    }),
    disconnect: jest.fn(() => {
      observedElements.clear();
    }),
  };
});

// Mock fetch API com cache de respostas e controle de timeout
const mockFetchCache = new Map();
const activeRequests = new Set();

global.fetch = jest.fn((url, options = {}) => {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  
  if (mockFetchCache.has(cacheKey)) {
    return Promise.resolve(mockFetchCache.get(cacheKey));
  }
  
  // Simula delay de rede com timeout controlado
  const networkDelay = options.delay || Math.random() * 100; // 0-100ms por padrão
  const timeout = options.timeout || 5000; // 5s timeout por padrão
  
  const requestId = Math.random().toString(36);
  activeRequests.add(requestId);
  
  const response = {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    json: () => Promise.resolve({ 
      events: [], 
      videos: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 }
    }),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  };
  
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      activeRequests.delete(requestId);
      reject(new Error(`Fetch timeout after ${timeout}ms for ${url}`));
    }, timeout);
    
    setTimeout(() => {
      clearTimeout(timeoutId);
      activeRequests.delete(requestId);
      mockFetchCache.set(cacheKey, response);
      resolve(response);
    }, networkDelay);
  });
});

// Função para limpar requests ativos (útil para cleanup de testes)
global.clearActiveRequests = () => {
  activeRequests.clear();
};

// Mock Web APIs adicionais
global.MutationObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(() => []),
}));

global.PerformanceObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(() => []),
}));

// ============================================================================
// CONFIGURAÇÕES DE AMBIENTE
// ============================================================================

// Mock process properties
Object.defineProperty(process, 'uptime', {
  value: () => 3600,
  writable: true,
});

Object.defineProperty(process, 'memoryUsage', {
  value: () => ({
    rss: 100000000,
    heapTotal: 50000000,
    heapUsed: 30000000,
    external: 10000000,
    arrayBuffers: 5000000,
  }),
  writable: true,
});

// Mock os module
jest.mock('os', () => ({
  platform: () => 'linux',
  arch: () => 'x64',
  release: () => '5.4.0-test',
  cpus: () => [{ model: 'Test CPU', speed: 2400 }],
  totalmem: () => 8589934592, // 8GB
  freemem: () => 4294967296, // 4GB
  uptime: () => 3600, // 1 hour
  tmpdir: () => '/tmp',
  homedir: () => '/home/test',
  userInfo: () => ({ username: 'test', uid: 1000, gid: 1000 }),
}));