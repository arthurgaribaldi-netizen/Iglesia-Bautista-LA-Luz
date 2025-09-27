// Mock para @sentry/instrumentation - Isolamento completo do Sentry
import { jest } from '@jest/globals';

// Mock para registro de instrumentação
export const register = jest.fn(async () => {
  // Simula registro de instrumentação sem efeitos colaterais
  return Promise.resolve();
});

// Mock para hooks de transição de roteador
export const onRouterTransitionStart = jest.fn(() => {
  // Simula hook de transição sem efeitos colaterais
  return () => {};
});

// Mock para instrumentação específica do servidor
export const registerServerInstrumentation = jest.fn(async () => {
  return Promise.resolve();
});

// Mock para instrumentação específica do edge
export const registerEdgeInstrumentation = jest.fn(async () => {
  return Promise.resolve();
});

// Mock para instrumentação específica do cliente
export const registerClientInstrumentation = jest.fn(async () => {
  return Promise.resolve();
});

// Utilitários para testes
export const mockSentryInstrumentationSuccess = () => {
  register.mockResolvedValue(undefined);
  onRouterTransitionStart.mockReturnValue(() => {});
  registerServerInstrumentation.mockResolvedValue(undefined);
  registerEdgeInstrumentation.mockResolvedValue(undefined);
  registerClientInstrumentation.mockResolvedValue(undefined);
};

export const mockSentryInstrumentationError = (error: Error) => {
  register.mockRejectedValue(error);
  registerServerInstrumentation.mockRejectedValue(error);
  registerEdgeInstrumentation.mockRejectedValue(error);
  registerClientInstrumentation.mockRejectedValue(error);
};

export const resetSentryInstrumentationMocks = () => {
  jest.clearAllMocks();
  
  // Reset para comportamento padrão
  register.mockResolvedValue(undefined);
  onRouterTransitionStart.mockReturnValue(() => {});
  registerServerInstrumentation.mockResolvedValue(undefined);
  registerEdgeInstrumentation.mockResolvedValue(undefined);
  registerClientInstrumentation.mockResolvedValue(undefined);
};

export default {
  register,
  onRouterTransitionStart,
  registerServerInstrumentation,
  registerEdgeInstrumentation,
  registerClientInstrumentation,
  mockSentryInstrumentationSuccess,
  mockSentryInstrumentationError,
  resetSentryInstrumentationMocks,
};
