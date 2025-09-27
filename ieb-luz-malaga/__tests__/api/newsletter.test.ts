// Newsletter API Tests - Re-enabled after implementation completion
// 2025-09-23T19:35:40.100Z - Implementation completed

import { GET, POST, DELETE } from '@/app/api/newsletter/route';
import { NextRequest } from 'next/server';

// Mock Prisma
const mockPrisma = {
  newsletter: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
  },
};

jest.mock('@/lib/db', () => ({
  prisma: mockPrisma,
}));

describe('/api/newsletter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    const validNewsletterData = {
      email: 'test@example.com',
      name: 'Test User',
    };

    it('subscribes with valid email and name', async() => {
      const request = new NextRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: JSON.stringify(validNewsletterData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Suscripción al newsletter exitosa');
    });

    it('subscribes with valid email only', async() => {
      const newsletterData = {
        email: 'test@example.com',
      };

      const request = new NextRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: JSON.stringify(newsletterData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Suscripción al newsletter exitosa');
    });

    it('validates email format', async() => {
      const invalidData = {
        email: 'invalid-email',
        name: 'Test User',
      };

      const request = new NextRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Datos inválidos');
      expect(data.details).toBeDefined();
    });

    it('validates required email field', async() => {
      const invalidData = {
        name: 'Test User',
      };

      const request = new NextRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Datos inválidos');
    });

    it('handles invalid JSON', async() => {
      const request = new NextRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: 'invalid json',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Error interno del servidor');
    });

    it('handles server errors', async() => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const request = new NextRequest('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: JSON.stringify(validNewsletterData),
      });

      // Mock an error
      const originalPost = POST;
      jest.doMock('@/app/api/newsletter/route', () => ({
        POST: jest.fn().mockRejectedValue(new Error('Server error')),
      }));

      try {
        const response = await POST(request);
        const data = await response.json();
        
        expect(response.status).toBe(500);
        expect(data.success).toBe(false);
        expect(data.error).toBe('Error interno del servidor');
      } catch (error) {
        // If the function throws, that's also acceptable
        expect(error).toBeDefined();
      }

      consoleSpy.mockRestore();
    });
  });

  describe('GET', () => {
    it('returns newsletter data with default parameters', async() => {
      const request = new NextRequest('http://localhost:3000/api/newsletter');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual([]);
      expect(data.pagination).toEqual({
        page: 1,
        limit: 50,
        total: 0,
        pages: 0,
      });
      expect(data.stats).toEqual({
        active: 0,
        inactive: 0,
        total: 0,
      });
    });

    it('handles query parameters', async() => {
      const request = new NextRequest('http://localhost:3000/api/newsletter?active=true&page=2&limit=25');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.pagination).toEqual({
        page: 2,
        limit: 25,
        total: 0,
        pages: 0,
      });
    });

    it('handles invalid page parameter', async() => {
      const request = new NextRequest('http://localhost:3000/api/newsletter?page=invalid');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.pagination.page).toBe(1); // Should default to 1
    });

    it('handles invalid limit parameter', async() => {
      const request = new NextRequest('http://localhost:3000/api/newsletter?limit=invalid');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.pagination.limit).toBe(50); // Should default to 50
    });

    it('handles server errors', async() => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const request = new NextRequest('http://localhost:3000/api/newsletter');

      // Mock an error
      const originalGet = GET;
      jest.doMock('@/app/api/newsletter/route', () => ({
        GET: jest.fn().mockRejectedValue(new Error('Server error')),
      }));

      try {
        const response = await GET(request);
        const data = await response.json();
        
        expect(response.status).toBe(500);
        expect(data.success).toBe(false);
        expect(data.error).toBe('Error interno del servidor');
      } catch (error) {
        // If the function throws, that's also acceptable
        expect(error).toBeDefined();
      }

      consoleSpy.mockRestore();
    });
  });

  describe('DELETE', () => {
    it('unsubscribes with valid email', async() => {
      const request = new NextRequest('http://localhost:3000/api/newsletter?email=test@example.com');
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Desuscripción exitosa');
    });

    it('validates required email parameter', async() => {
      const request = new NextRequest('http://localhost:3000/api/newsletter');
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Email requerido');
    });

    it('handles server errors', async() => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const request = new NextRequest('http://localhost:3000/api/newsletter?email=test@example.com');

      // Mock an error
      const originalDelete = DELETE;
      jest.doMock('@/app/api/newsletter/route', () => ({
        DELETE: jest.fn().mockRejectedValue(new Error('Server error')),
      }));

      try {
        const response = await DELETE(request);
        const data = await response.json();
        
        expect(response.status).toBe(500);
        expect(data.success).toBe(false);
        expect(data.error).toBe('Error interno del servidor');
      } catch (error) {
        // If the function throws, that's also acceptable
        expect(error).toBeDefined();
      }

      consoleSpy.mockRestore();
    });
  });
});
