// Mock para @sentry/react
import React from 'react';

export const init = jest.fn();
export const captureException = jest.fn();
export const captureMessage = jest.fn();
export const addBreadcrumb = jest.fn();
export const setContext = jest.fn();
export const setUser = jest.fn();
export const setTag = jest.fn();
export const setLevel = jest.fn();
export const withScope = jest.fn((callback) => callback({}));
export const getCurrentHub = jest.fn(() => ({
  getClient: jest.fn(() => ({
    getOptions: jest.fn(() => ({})),
  })),
  getScope: jest.fn(() => ({
    setContext: jest.fn(),
    setUser: jest.fn(),
    setTag: jest.fn(),
    setLevel: jest.fn(),
    addBreadcrumb: jest.fn(),
  })),
}));

// Mock para componentes React específicos
export const ErrorBoundary = ({ children, fallback, onError }) => {
  const [hasError, setHasError] = React.useState(false);
  
  React.useEffect(() => {
    if (hasError && onError) {
      onError(new Error('Test error'));
    }
  }, [hasError, onError]);
  
  if (hasError) {
    return fallback || React.createElement('div', null, 'Error occurred');
  }
  
  return children;
};

export const Profiler = ({ children, id, onRender }) => {
  React.useEffect(() => {
    if (onRender) {
      onRender(id, 'mount', 0, 0, 0, 0, {});
    }
  }, [id, onRender]);
  
  return children;
};

// Mock para hooks específicos do React
export const useSentry = jest.fn(() => ({
  captureException,
  captureMessage,
  addBreadcrumb,
  setContext,
  setUser,
  setTag,
  setLevel,
}));

export const useSentryTransaction = jest.fn(() => ({
  startTransaction: jest.fn(() => ({
    setTag: jest.fn(),
    setData: jest.fn(),
    finish: jest.fn(),
    setStatus: jest.fn(),
  })),
  startSpan: jest.fn((options, callback) => {
    const span = {
      setTag: jest.fn(),
      setData: jest.fn(),
      finish: jest.fn(),
      setStatus: jest.fn(),
    };
    return callback(span);
  }),
}));

export const useSentrySpan = jest.fn((options, callback) => {
  const span = {
    setTag: jest.fn(),
    setData: jest.fn(),
    finish: jest.fn(),
    setStatus: jest.fn(),
  };
  return callback(span);
});

// Mock para performance
export const startTransaction = jest.fn(() => ({
  setTag: jest.fn(),
  setData: jest.fn(),
  finish: jest.fn(),
  setStatus: jest.fn(),
}));

export const startSpan = jest.fn((options, callback) => {
  const span = {
    setTag: jest.fn(),
    setData: jest.fn(),
    finish: jest.fn(),
    setStatus: jest.fn(),
  };
  return callback(span);
});

// Mock para tracing
export const trace = jest.fn((options, callback) => callback());
export const traceAsync = jest.fn((options, callback) => callback());

// Mock para métricas
export const metrics = {
  increment: jest.fn(),
  decrement: jest.fn(),
  gauge: jest.fn(),
  histogram: jest.fn(),
  distribution: jest.fn(),
};

// Mock para profiling
export const startProfiling = jest.fn();
export const stopProfiling = jest.fn();

// Mock para replay
export const replayIntegration = jest.fn(() => ({}));

// Mock para browser tracing
export const browserTracingIntegration = jest.fn(() => ({}));

// Mock para session replay
export const sessionReplayIntegration = jest.fn(() => ({}));

// Mock para feedback
export const feedbackIntegration = jest.fn(() => ({}));

// Mock para integrations
export const integrations = {
  replayIntegration,
  browserTracingIntegration,
  sessionReplayIntegration,
  feedbackIntegration,
};

// Mock para utils
export const getClient = jest.fn(() => ({
  getOptions: jest.fn(() => ({})),
}));

export const getCurrentScope = jest.fn(() => ({
  setContext: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
  setLevel: jest.fn(),
  addBreadcrumb: jest.fn(),
}));

export const getIsolationScope = jest.fn(() => ({
  setContext: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
  setLevel: jest.fn(),
  addBreadcrumb: jest.fn(),
}));

// Mock para breadcrumbs
export const breadcrumb = {
  add: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
};

// Mock para context
export const context = {
  set: jest.fn(),
  get: jest.fn(),
  clear: jest.fn(),
};

// Mock para user
export const user = {
  set: jest.fn(),
  get: jest.fn(),
  clear: jest.fn(),
};

// Mock para tags
export const tags = {
  set: jest.fn(),
  get: jest.fn(),
  clear: jest.fn(),
};

// Mock para level
export const level = {
  set: jest.fn(),
  get: jest.fn(),
};

// Mock para fingerprint
export const fingerprint = {
  set: jest.fn(),
  get: jest.fn(),
  clear: jest.fn(),
};

// Mock para extra
export const extra = {
  set: jest.fn(),
  get: jest.fn(),
  clear: jest.fn(),
};

// Mock para attachments
export const attachments = {
  add: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
};

// Mock para event processors
export const eventProcessors = {
  add: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
};

// Mock para error processors
export const errorProcessors = {
  add: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
};

// Mock para transaction processors
export const transactionProcessors = {
  add: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
};

// Mock para envelope processors
export const envelopeProcessors = {
  add: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
};

// Mock para integrations
export const integration = {
  add: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
};

// Mock para transports
export const transports = {
  add: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
};

// Mock para logger
export const logger = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Mock para SDK
export const SDK_VERSION = '7.0.0';

// Mock para default export
export default {
  init,
  captureException,
  captureMessage,
  addBreadcrumb,
  setContext,
  setUser,
  setTag,
  setLevel,
  withScope,
  getCurrentHub,
  ErrorBoundary,
  Profiler,
  useSentry,
  useSentryTransaction,
  useSentrySpan,
  startTransaction,
  startSpan,
  trace,
  traceAsync,
  metrics,
  startProfiling,
  stopProfiling,
  integrations,
  getClient,
  getCurrentScope,
  getIsolationScope,
  breadcrumb,
  context,
  user,
  tags,
  level,
  fingerprint,
  extra,
  attachments,
  eventProcessors,
  errorProcessors,
  transactionProcessors,
  envelopeProcessors,
  integration,
  transports,
  logger,
  SDK_VERSION,
};
