import { PrismaClient } from '@prisma/client';
import { shouldUseFallbacks, buildFallbacks } from './build-fallbacks';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
};

// Configuração para Supabase PostgreSQL
const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder",
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Skip database connection during build if SKIP_DATABASE_CHECK is set
let finalPrisma: PrismaClient;

if (shouldUseFallbacks()) {
  // Create a more robust mock prisma client for build time
  const mockPrisma = new Proxy({} as PrismaClient, {
    get(target, prop) {
      if (typeof prop === 'string') {
        return new Proxy({}, {
          get() {
            return () => Promise.resolve(null);
          }
        });
      }
      return target[prop as keyof PrismaClient];
    }
  });
  
  // Add common Prisma methods to prevent runtime errors
  Object.assign(mockPrisma, {
    $connect: () => Promise.resolve(),
    $disconnect: () => Promise.resolve(),
    $transaction: (callback: any) => Promise.resolve(callback(mockPrisma)),
    $queryRaw: () => Promise.resolve([]),
    $executeRaw: () => Promise.resolve(0),
  });
  
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = mockPrisma as PrismaClient;
  finalPrisma = mockPrisma;
} else {
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
  finalPrisma = prisma;
}

export { finalPrisma as prisma };

// Re-export fallback utilities for convenience
export { shouldUseFallbacks, buildFallbacks } from './build-fallbacks';

// Legacy exports for backward compatibility
export const shouldSkipDatabase = shouldUseFallbacks;
export const fallbackData = buildFallbacks;