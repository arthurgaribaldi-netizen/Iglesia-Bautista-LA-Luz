// Mock para jsonwebtoken - Isolamento de operações JWT
import { jest } from '@jest/globals';

// Mock para dados de usuário de teste
const mockUser = {
  id: 'mock-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'ADMIN',
};

export const sign = jest.fn((payload: any, secret: string, options?: any) => {
  // Simula geração de token JWT
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = Buffer.from(`mock-signature-${Date.now()}`).toString('base64url');
  
  return `${header}.${payloadEncoded}.${signature}`;
});

export const verify = jest.fn((token: string, secret: string, options?: any) => {
  // Simula verificação de token JWT
  if (token === 'invalid-token') {
    throw new Error('invalid token');
  }
  
  if (token === 'expired-token') {
    const error = new Error('jwt expired') as any;
    error.name = 'TokenExpiredError';
    throw error;
  }
  
  // Retorna payload mockado para tokens válidos
  return mockUser;
});

export const decode = jest.fn((token: string, options?: any) => {
  // Simula decodificação de token (sem verificação)
  if (token === 'invalid-token') {
    return null;
  }
  
  return mockUser;
});

export const signSync = jest.fn((payload: any, secret: string, options?: any) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = Buffer.from(`mock-signature-${Date.now()}`).toString('base64url');
  
  return `${header}.${payloadEncoded}.${signature}`;
});

export const verifySync = jest.fn((token: string, secret: string, options?: any) => {
  if (token === 'invalid-token') {
    throw new Error('invalid token');
  }
  
  if (token === 'expired-token') {
    const error = new Error('jwt expired') as any;
    error.name = 'TokenExpiredError';
    throw error;
  }
  
  return mockUser;
});

// Utilitários para testes
export const mockJwtSuccess = (payload: any = mockUser) => {
  const mockToken = `mock.token.${Date.now()}`;
  sign.mockReturnValue(mockToken);
  verify.mockReturnValue(payload);
  signSync.mockReturnValue(mockToken);
  verifySync.mockReturnValue(payload);
  return mockToken;
};

export const mockJwtError = (error: Error) => {
  sign.mockImplementation(() => { throw error; });
  verify.mockImplementation(() => { throw error; });
  signSync.mockImplementation(() => { throw error; });
  verifySync.mockImplementation(() => { throw error; });
};

export const mockJwtExpired = () => {
  const error = new Error('jwt expired') as any;
  error.name = 'TokenExpiredError';
  verify.mockImplementation(() => { throw error; });
  verifySync.mockImplementation(() => { throw error; });
};

export const mockJwtInvalid = () => {
  const error = new Error('invalid token');
  verify.mockImplementation(() => { throw error; });
  verifySync.mockImplementation(() => { throw error; });
};

export const setMockUser = (user: any) => {
  Object.assign(mockUser, user);
};

export const resetJwtMocks = () => {
  jest.clearAllMocks();
  
  // Reset para comportamento padrão
  sign.mockImplementation((payload: any, secret: string, options?: any) => {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = Buffer.from(`mock-signature-${Date.now()}`).toString('base64url');
    
    return `${header}.${payloadEncoded}.${signature}`;
  });
  
  verify.mockImplementation((token: string, secret: string, options?: any) => {
    if (token === 'invalid-token') {
      throw new Error('invalid token');
    }
    
    if (token === 'expired-token') {
      const error = new Error('jwt expired') as any;
      error.name = 'TokenExpiredError';
      throw error;
    }
    
    return mockUser;
  });
};

// Exportar classes de erro para testes
export const TokenExpiredError = class TokenExpiredError extends Error {
  constructor(message: string, expiredAt?: Date) {
    super(message);
    this.name = 'TokenExpiredError';
    (this as any).expiredAt = expiredAt;
  }
};

export const JsonWebTokenError = class JsonWebTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JsonWebTokenError';
  }
};

export const NotBeforeError = class NotBeforeError extends Error {
  constructor(message: string, date?: Date) {
    super(message);
    this.name = 'NotBeforeError';
    (this as any).date = date;
  }
};

export default {
  sign,
  verify,
  decode,
  signSync,
  verifySync,
  mockJwtSuccess,
  mockJwtError,
  mockJwtExpired,
  mockJwtInvalid,
  setMockUser,
  resetJwtMocks,
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
};
