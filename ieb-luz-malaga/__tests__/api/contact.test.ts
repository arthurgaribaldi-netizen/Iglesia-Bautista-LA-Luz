// DISABLED FOR GRADUAL IMPLEMENTATION - 2025-09-23T19:35:40.061Z
// Original file backed up in __tests__backup

import { POST } from '@/app/api/contact/route';
import { NextRequest } from 'next/server';

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    contact: {
      create: jest.fn(),
    },
  },
}));

describe('/api/contact', () => {
  const { prisma } = require('@/lib/db');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('validates required fields', async() => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('validates email format', async() => {
    const formData = {
      name: 'John Doe',
      email: 'invalid-email',
      subject: 'Test subject',
      message: 'Test message',
    };

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('processes valid contact form', async() => {
    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test subject',
      message: 'Test message',
    };

    prisma.contact.create.mockResolvedValue({ id: 1, ...formData });

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
  });

  it('handles database errors', async() => {
    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test subject',
      message: 'Test message',
    };

    prisma.contact.create.mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
  });
});
