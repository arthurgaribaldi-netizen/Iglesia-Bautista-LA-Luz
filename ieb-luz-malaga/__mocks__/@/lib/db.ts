// Mock para @/lib/db - Isolamento do cliente Prisma
import { PrismaClient } from '@prisma/client';

// Mock do cliente Prisma
const mockPrisma = new PrismaClient();

// Mock de todos os modelos do schema
const createModelMock = () => ({
  findUnique: jest.fn(() => Promise.resolve(null)),
  findFirst: jest.fn(() => Promise.resolve(null)),
  findMany: jest.fn(() => Promise.resolve([])),
  create: jest.fn(() => Promise.resolve({ id: 'mock-id' })),
  update: jest.fn(() => Promise.resolve({ id: 'mock-id' })),
  delete: jest.fn(() => Promise.resolve({ id: 'mock-id' })),
  count: jest.fn(() => Promise.resolve(0)),
  upsert: jest.fn(() => Promise.resolve({ id: 'mock-id' })),
  aggregate: jest.fn(() => Promise.resolve({ _count: { _all: 0 } })),
  groupBy: jest.fn(() => Promise.resolve([])),
});

// Configurar mocks para todos os modelos
Object.assign(mockPrisma, {
  user: createModelMock(),
  sermon: createModelMock(),
  event: createModelMock(),
  contact: createModelMock(),
  bibleVerse: createModelMock(),
  spiritualResource: createModelMock(),
  usefulLink: createModelMock(),
  churchInfo: createModelMock(),
  devotional: createModelMock(),
  newsletter: createModelMock(),
  member: createModelMock(),
  
  // Métodos de conexão e transação
  $connect: jest.fn(() => Promise.resolve()),
  $disconnect: jest.fn(() => Promise.resolve()),
  $transaction: jest.fn((callback) => Promise.resolve(callback(mockPrisma))),
  $queryRaw: jest.fn(() => Promise.resolve([])),
  $executeRaw: jest.fn(() => Promise.resolve(0)),
  $runCommandRaw: jest.fn(() => Promise.resolve({})),
});

// Mock das funções de fallback
export const shouldUseFallbacks = jest.fn(() => false);
export const buildFallbacks = jest.fn(() => ({}));

// Exportar o cliente mockado
export const prisma = mockPrisma;

// Exportar funções de fallback mockadas
export { shouldUseFallbacks, buildFallbacks };

// Legacy exports para compatibilidade
export const shouldSkipDatabase = shouldUseFallbacks;
export const fallbackData = buildFallbacks;

// Utilitários para testes
export const mockPrismaResponse = (model: string, operation: string, data: any) => {
  if (mockPrisma[model] && mockPrisma[model][operation]) {
    mockPrisma[model][operation].mockResolvedValue(data);
  }
};

export const mockPrismaError = (model: string, operation: string, error: Error) => {
  if (mockPrisma[model] && mockPrisma[model][operation]) {
    mockPrisma[model][operation].mockRejectedValue(error);
  }
};

export const resetPrismaMocks = () => {
  Object.keys(mockPrisma).forEach(key => {
    if (typeof mockPrisma[key] === 'object' && mockPrisma[key] !== null) {
      Object.keys(mockPrisma[key]).forEach(method => {
        if (jest.isMockFunction(mockPrisma[key][method])) {
          mockPrisma[key][method].mockReset();
        }
      });
    }
  });
};

export default mockPrisma;
