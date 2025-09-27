// Utilitários para facilitar o uso dos mocks do Supabase nos testes
import { supabase, supabaseAdmin } from '@/lib/supabase';

// Tipos para os dados de teste
export interface MockSermon {
  id: number
  title: string
  date: string
  description: string
  video_url: string
  created_at: string
  updated_at: string
}

export interface MockEvent {
  id: number
  title: string
  date: string
  description: string
  location: string
  created_at: string
  updated_at: string
}

export interface MockChurchInfo {
  id: number
  name: string
  address: string
  phone: string
  email: string
  description: string
  created_at: string
  updated_at: string
}

// Função para configurar mock de sucesso
export const mockSupabaseSuccess = (data: any) => {
  const mockFrom = jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => ({
          data: Array.isArray(data) ? data[0] : data,
          error: null,
        })),
        data: Array.isArray(data) ? data : [data],
        error: null,
      })),
      order: jest.fn(() => ({
        data: Array.isArray(data) ? data : [data],
        error: null,
      })),
      data: Array.isArray(data) ? data : [data],
      error: null,
    })),
    insert: jest.fn(() => {
      const insertResult: any = {
        data: { id: 1, ...data },
        error: null,
      };
      insertResult.select = jest.fn(() => ({
        data: Array.isArray(data) ? data : [data],
        error: null,
      }));
      return insertResult;
    }),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        data: { id: 1, ...data },
        error: null,
      })),
      data: { id: 1, ...data },
      error: null,
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(() => ({
        data: { id: 1 },
        error: null,
      })),
      data: { id: 1 },
      error: null,
    })),
  }))

  ;(supabase.from as jest.Mock).mockImplementation(mockFrom)
  ;(supabaseAdmin.from as jest.Mock).mockImplementation(mockFrom);
};

// Função para configurar mock de erro
export const mockSupabaseError = (message: string, code?: string) => {
  const mockFrom = jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => ({
          data: null,
          error: { message, code, details: null, hint: null },
        })),
        data: null,
        error: { message, code, details: null, hint: null },
      })),
      order: jest.fn(() => ({
        data: null,
        error: { message, code, details: null, hint: null },
      })),
      data: null,
      error: { message, code, details: null, hint: null },
    })),
    insert: jest.fn(() => ({
      data: null,
      error: { message, code, details: null, hint: null },
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        data: null,
        error: { message, code, details: null, hint: null },
      })),
      data: null,
      error: { message, code, details: null, hint: null },
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(() => ({
        data: null,
        error: { message, code, details: null, hint: null },
      })),
      data: null,
      error: { message, code, details: null, hint: null },
    })),
  }))

  ;(supabase.from as jest.Mock).mockImplementation(mockFrom)
  ;(supabaseAdmin.from as jest.Mock).mockImplementation(mockFrom);
};

// Função para configurar mock de dados vazios
export const mockSupabaseEmpty = () => {
  mockSupabaseSuccess([]);
};

// Dados de teste pré-definidos
export const testData = {
  sermons: [
    {
      id: 1,
      title: 'Test Sermon 1',
      date: '2025-01-01',
      description: 'Test Description 1',
      video_url: 'https://youtube.com/watch?v=test1',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
    {
      id: 2,
      title: 'Test Sermon 2',
      date: '2025-01-02',
      description: 'Test Description 2',
      video_url: 'https://youtube.com/watch?v=test2',
      created_at: '2025-01-02T00:00:00Z',
      updated_at: '2025-01-02T00:00:00Z',
    },
  ] as MockSermon[],
  events: [
    {
      id: 1,
      title: 'Test Event 1',
      date: '2025-01-01',
      description: 'Test Description 1',
      location: 'Test Location 1',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
    {
      id: 2,
      title: 'Test Event 2',
      date: '2025-01-02',
      description: 'Test Description 2',
      location: 'Test Location 2',
      created_at: '2025-01-02T00:00:00Z',
      updated_at: '2025-01-02T00:00:00Z',
    },
  ] as MockEvent[],
  churchInfo: {
    id: 1,
    name: 'Igreja Bautista La Luz',
    address: 'Test Address',
    phone: '123-456-7890',
    email: 'test@example.com',
    description: 'Test Description',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  } as MockChurchInfo,
};

// Função para resetar todos os mocks
export const resetSupabaseMocks = () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
};

// Função para verificar se uma função do Supabase foi chamada
export const expectSupabaseCall = (
  table: string,
  operation: 'select' | 'insert' | 'update' | 'delete',
) => {
  expect(supabase.from).toHaveBeenCalledWith(table);
  const mockFrom = (supabase.from as jest.Mock).mock.results[0].value;
  expect(mockFrom[operation]).toHaveBeenCalled();
};

// Função para verificar se uma função do Supabase foi chamada com parâmetros específicos
export const expectSupabaseCallWith = (
  table: string,
  operation: 'select' | 'insert' | 'update' | 'delete',
  params: any,
) => {
  expect(supabase.from).toHaveBeenCalledWith(table);
  const mockFrom = (supabase.from as jest.Mock).mock.results[0].value;
  expect(mockFrom[operation]).toHaveBeenCalledWith(params);
};

// Teste simples para evitar erro do Jest
describe('Supabase Mock Utils', () => {
  it('should export utility functions', () => {
    expect(typeof mockSupabaseSuccess).toBe('function');
    expect(typeof mockSupabaseError).toBe('function');
    expect(typeof mockSupabaseEmpty).toBe('function');
    expect(typeof resetSupabaseMocks).toBe('function');
    expect(typeof expectSupabaseCall).toBe('function');
    expect(typeof expectSupabaseCallWith).toBe('function');
  });

  it('should have test data available', () => {
    expect(testData.sermons).toBeDefined();
    expect(testData.events).toBeDefined();
    expect(testData.churchInfo).toBeDefined();
    expect(Array.isArray(testData.sermons)).toBe(true);
    expect(Array.isArray(testData.events)).toBe(true);
  });
});