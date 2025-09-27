import { GET } from '@/app/api/church-info/route';
import { NextRequest } from 'next/server';

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    churchInfo: {
      findFirst: jest.fn(),
    },
  },
}));

// Mock build-fallbacks
jest.mock('@/lib/build-fallbacks', () => ({
  shouldUseFallbacks: jest.fn(() => true),
  buildFallbacks: {
    churchInfo: {
      name: 'Test Church',
      location: 'Test Location',
    },
  },
}));

describe('/api/church-info', () => {
  it('should return fallback data when shouldUseFallbacks is true', async () => {
    const request = new NextRequest('http://localhost:3000/api/church-info');
    
    const response = await GET();
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.churchInfo.name).toBe('Test Church');
  });
});
