// Mock dedicado para @prisma/client
// Fornece isolamento completo do Prisma Client nos testes

export const PrismaClient = jest.fn().mockImplementation(() => ({
  // Modelos principais
  user: {
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
  },
  
  sermon: {
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
  },
  
  event: {
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
  },
  
  contact: {
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
  },
  
  churchInfo: {
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
  },
  
  devotional: {
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
  },
  
  newsletter: {
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
  },
  
  usefulLink: {
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
  },
  
  resource: {
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
  },
  
  organizationalLink: {
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
  },
  
  alert: {
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
  },
  
  bibleVerse: {
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
  },
  
  spiritualResource: {
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
  },
  
  member: {
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
  },

  // Métodos de conexão e transação
  $connect: jest.fn(() => Promise.resolve()),
  $disconnect: jest.fn(() => Promise.resolve()),
  $transaction: jest.fn((callback) => Promise.resolve(callback(this))),
  $queryRaw: jest.fn(() => Promise.resolve([])),
  $executeRaw: jest.fn(() => Promise.resolve(0)),
  $runCommandRaw: jest.fn(() => Promise.resolve({})),
}));

// Exportar instância mockada
export const prisma = new PrismaClient();

// Utilitários para testes
export const mockPrismaResponse = (data: any) => data;
export const mockPrismaError = (message: string) => new Error(message);

// Factory para criar dados de teste
export const createMockData = {
  user: (overrides = {}) => ({
    id: 'mock-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'MEMBER',
    createdAt: new Date(),
    ...overrides,
  }),
  
  sermon: (overrides = {}) => ({
    id: 'mock-sermon-id',
    title: 'Test Sermon',
    pastor: 'Test Pastor',
    date: new Date(),
    audioUrl: null,
    videoUrl: null,
    transcript: null,
    series: null,
    description: null,
    createdAt: new Date(),
    authorId: 'mock-user-id',
    ...overrides,
  }),
  
  event: (overrides = {}) => ({
    id: 'mock-event-id',
    title: 'Test Event',
    description: null,
    startDate: new Date(),
    endDate: null,
    location: null,
    capacity: null,
    isPublic: true,
    createdAt: new Date(),
    organizerId: 'mock-user-id',
    ...overrides,
  }),
  
  contact: (overrides = {}) => ({
    id: 'mock-contact-id',
    name: 'Test Contact',
    email: 'contact@example.com',
    phone: null,
    subject: null,
    message: 'Test message',
    isRead: false,
    createdAt: new Date(),
    ...overrides,
  }),
};

export default PrismaClient;
