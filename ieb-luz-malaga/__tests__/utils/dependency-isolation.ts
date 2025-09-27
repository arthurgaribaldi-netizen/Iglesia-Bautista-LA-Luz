// Utilitários para verificar e garantir isolamento de dependências nos testes
import { jest } from '@jest/globals';

/**
 * Verifica se todas as dependências externas estão sendo mockadas
 */
export const verifyDependencyIsolation = () => {
  const isolationReport = {
    prisma: false,
    supabase: false,
    sentry: false,
    bcrypt: false,
    jwt: false,
    winston: false,
    googleCloud: false,
    errors: [] as string[],
  };

  try {
    // Verificar Prisma
    const { prisma } = require('@/lib/db');
    isolationReport.prisma = jest.isMockFunction(prisma.user.findMany);
    
    if (!isolationReport.prisma) {
      isolationReport.errors.push('Prisma não está sendo mockado corretamente');
    }

    // Verificar Supabase
    const { supabase } = require('@/lib/supabase');
    isolationReport.supabase = jest.isMockFunction(supabase.from);
    
    if (!isolationReport.supabase) {
      isolationReport.errors.push('Supabase não está sendo mockado corretamente');
    }

    // Verificar Sentry
    const sentry = require('@sentry/nextjs');
    isolationReport.sentry = jest.isMockFunction(sentry.captureException);
    
    if (!isolationReport.sentry) {
      isolationReport.errors.push('Sentry não está sendo mockado corretamente');
    }

    // Verificar bcryptjs
    const bcrypt = require('bcryptjs');
    isolationReport.bcrypt = jest.isMockFunction(bcrypt.hash);
    
    if (!isolationReport.bcrypt) {
      isolationReport.errors.push('bcryptjs não está sendo mockado corretamente');
    }

    // Verificar jsonwebtoken
    const jwt = require('jsonwebtoken');
    isolationReport.jwt = jest.isMockFunction(jwt.sign);
    
    if (!isolationReport.jwt) {
      isolationReport.errors.push('jsonwebtoken não está sendo mockado corretamente');
    }

    // Verificar Winston
    const winston = require('winston');
    isolationReport.winston = jest.isMockFunction(winston.createLogger);
    
    if (!isolationReport.winston) {
      isolationReport.errors.push('Winston não está sendo mockado corretamente');
    }

    // Verificar Google Cloud Storage
    const { Storage } = require('@google-cloud/storage');
    isolationReport.googleCloud = jest.isMockFunction(Storage);
    
    if (!isolationReport.googleCloud) {
      isolationReport.errors.push('Google Cloud Storage não está sendo mockado corretamente');
    }

  } catch (error) {
    isolationReport.errors.push(`Erro ao verificar isolamento: ${error.message}`);
  }

  return isolationReport;
};

/**
 * Configura ambiente de teste com isolamento completo
 */
export const setupIsolatedTestEnvironment = () => {
  // Limpar todos os mocks
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();

  // Configurar mocks globais
  setupGlobalMocks();
  
  // Configurar variáveis de ambiente de teste
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.SENTRY_DSN = 'https://test@sentry.io/test';
  
  // Desabilitar logging em testes
  jest.spyOn(console, 'log').mockImplementation();
  jest.spyOn(console, 'warn').mockImplementation();
  jest.spyOn(console, 'error').mockImplementation();
  jest.spyOn(console, 'info').mockImplementation();
  jest.spyOn(console, 'debug').mockImplementation();
};

/**
 * Limpa ambiente de teste após execução
 */
export const cleanupTestEnvironment = () => {
  // Restaurar console
  jest.restoreAllMocks();
  
  // Limpar variáveis de ambiente
  delete process.env.DATABASE_URL;
  delete process.env.JWT_SECRET;
  delete process.env.SENTRY_DSN;
  
  // Restaurar NODE_ENV
  process.env.NODE_ENV = 'development';
};

/**
 * Configura mocks globais necessários
 */
const setupGlobalMocks = () => {
  // Mock de fetch se não estiver disponível
  if (!global.fetch) {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
      })
    );
  }

  // Mock de Headers se não estiver disponível
  if (!global.Headers) {
    global.Headers = class Headers {
      private headers = new Map();
      
      constructor(init?: any) {
        if (init) {
          Object.entries(init).forEach(([key, value]) => {
            this.headers.set(key.toLowerCase(), value);
          });
        }
      }
      
      get(name: string) {
        return this.headers.get(name.toLowerCase());
      }
      
      set(name: string, value: string) {
        this.headers.set(name.toLowerCase(), value);
      }
      
      has(name: string) {
        return this.headers.has(name.toLowerCase());
      }
    };
  }
};

/**
 * Verifica se um teste está executando em ambiente isolado
 */
export const assertTestIsolation = (testName: string) => {
  const report = verifyDependencyIsolation();
  
  if (report.errors.length > 0) {
    throw new Error(
      `Teste "${testName}" não está executando em ambiente isolado:\n${report.errors.join('\n')}`
    );
  }
  
  return true;
};

/**
 * Mock de dados de teste padronizados
 */
export const createMockTestData = {
  user: (overrides = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'ADMIN',
    createdAt: new Date('2025-01-01T00:00:00Z'),
    ...overrides,
  }),
  
  sermon: (overrides = {}) => ({
    id: 'test-sermon-id',
    title: 'Test Sermon',
    pastor: 'Test Pastor',
    date: new Date('2025-01-01T00:00:00Z'),
    audioUrl: null,
    videoUrl: 'https://youtube.com/watch?v=test',
    transcript: null,
    series: 'Test Series',
    description: 'Test Description',
    createdAt: new Date('2025-01-01T00:00:00Z'),
    authorId: 'test-user-id',
    ...overrides,
  }),
  
  event: (overrides = {}) => ({
    id: 'test-event-id',
    title: 'Test Event',
    description: 'Test Event Description',
    startDate: new Date('2025-01-01T10:00:00Z'),
    endDate: new Date('2025-01-01T12:00:00Z'),
    location: 'Test Location',
    capacity: 100,
    isPublic: true,
    createdAt: new Date('2025-01-01T00:00:00Z'),
    organizerId: 'test-user-id',
    ...overrides,
  }),
  
  contact: (overrides = {}) => ({
    id: 'test-contact-id',
    name: 'Test Contact',
    email: 'contact@example.com',
    phone: '+1234567890',
    subject: 'Test Subject',
    message: 'Test Message',
    isRead: false,
    createdAt: new Date('2025-01-01T00:00:00Z'),
    ...overrides,
  }),
  
  churchInfo: (overrides = {}) => ({
    id: 'test-church-info-id',
    name: 'Igreja Bautista La Luz',
    location: 'Málaga, Spain',
    cif: 'TEST123456789',
    ministryNumber: 'TEST123',
    email: 'info@iglesialaluz.com',
    phone: '+34123456789',
    address: 'Test Address, Málaga',
    website: 'https://iglesialaluz.com',
    youtubeChannel: 'https://youtube.com/@iglesialaluz',
    facebookPage: 'https://facebook.com/iglesialaluz',
    instagramPage: 'https://instagram.com/iglesialaluz',
    updatedAt: new Date('2025-01-01T00:00:00Z'),
    createdAt: new Date('2025-01-01T00:00:00Z'),
    ...overrides,
  }),
};

/**
 * Utilitário para simular erros de dependência
 */
export const simulateDependencyError = (dependency: string, error: Error) => {
  switch (dependency) {
    case 'prisma':
      const { prisma } = require('@/lib/db');
      prisma.user.findMany.mockRejectedValue(error);
      break;
    case 'supabase':
      const { supabase } = require('@/lib/supabase');
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error }),
          }),
        }),
      });
      break;
    case 'bcrypt':
      const bcrypt = require('bcryptjs');
      bcrypt.hash.mockRejectedValue(error);
      break;
    case 'jwt':
      const jwt = require('jsonwebtoken');
      jwt.sign.mockImplementation(() => { throw error; });
      break;
    default:
      throw new Error(`Dependência não reconhecida: ${dependency}`);
  }
};

/**
 * Utilitário para verificar se mocks foram chamados corretamente
 */
export const verifyMockCalls = {
  prisma: (model: string, operation: string, expectedCalls: number = 1) => {
    const { prisma } = require('@/lib/db');
    const mockMethod = prisma[model][operation];
    expect(mockMethod).toHaveBeenCalledTimes(expectedCalls);
  },
  
  supabase: (table: string, operation: string, expectedCalls: number = 1) => {
    const { supabase } = require('@/lib/supabase');
    expect(supabase.from).toHaveBeenCalledWith(table);
    const mockFrom = supabase.from.mock.results[0]?.value;
    if (mockFrom && mockFrom[operation]) {
      expect(mockFrom[operation]).toHaveBeenCalledTimes(expectedCalls);
    }
  },
  
  sentry: (operation: string, expectedCalls: number = 1) => {
    const sentry = require('@sentry/nextjs');
    expect(sentry[operation]).toHaveBeenCalledTimes(expectedCalls);
  },
};

// Teste para verificar se os utilitários funcionam
describe('Dependency Isolation Utils', () => {
  it('should verify dependency isolation', () => {
    const report = verifyDependencyIsolation();
    expect(report).toHaveProperty('prisma');
    expect(report).toHaveProperty('supabase');
    expect(report).toHaveProperty('sentry');
    expect(report).toHaveProperty('bcrypt');
    expect(report).toHaveProperty('jwt');
    expect(report).toHaveProperty('winston');
    expect(report).toHaveProperty('googleCloud');
    expect(report).toHaveProperty('errors');
  });

  it('should create mock test data', () => {
    const user = createMockTestData.user();
    const sermon = createMockTestData.sermon();
    const event = createMockTestData.event();
    const contact = createMockTestData.contact();
    const churchInfo = createMockTestData.churchInfo();

    expect(user).toHaveProperty('id', 'test-user-id');
    expect(sermon).toHaveProperty('id', 'test-sermon-id');
    expect(event).toHaveProperty('id', 'test-event-id');
    expect(contact).toHaveProperty('id', 'test-contact-id');
    expect(churchInfo).toHaveProperty('id', 'test-church-info-id');
  });

  it('should setup isolated test environment', () => {
    expect(() => setupIsolatedTestEnvironment()).not.toThrow();
    expect(process.env.NODE_ENV).toBe('test');
  });

  it('should cleanup test environment', () => {
    setupIsolatedTestEnvironment();
    cleanupTestEnvironment();
    expect(process.env.NODE_ENV).toBe('development');
  });
});
