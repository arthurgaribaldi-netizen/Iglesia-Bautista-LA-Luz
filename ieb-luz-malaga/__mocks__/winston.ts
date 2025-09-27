// Mock global do Winston para testes
const mockLogger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  add: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
  close: jest.fn(),
  query: jest.fn(),
  stream: jest.fn(),
  startTimer: jest.fn(),
  configure: jest.fn(),
  child: jest.fn(() => mockLogger),
};

const mockFormat = {
  combine: jest.fn(() => 'combined-format'),
  timestamp: jest.fn(() => 'timestamp-format'),
  errors: jest.fn(() => 'errors-format'),
  json: jest.fn(() => 'json-format'),
  colorize: jest.fn(() => 'colorize-format'),
  simple: jest.fn(() => 'simple-format'),
  printf: jest.fn(() => 'printf-format'),
  label: jest.fn(() => 'label-format'),
  metadata: jest.fn(() => 'metadata-format'),
  ms: jest.fn(() => 'ms-format'),
  splat: jest.fn(() => 'splat-format'),
  uncolorize: jest.fn(() => 'uncolorize-format'),
};

const mockTransports = {
  Console: jest.fn(() => ({
    name: 'console',
    level: 'info',
  })),
  File: jest.fn(() => ({
    name: 'file',
    level: 'info',
  })),
  Http: jest.fn(() => ({
    name: 'http',
    level: 'info',
  })),
  Stream: jest.fn(() => ({
    name: 'stream',
    level: 'info',
  })),
};

const mockWinston = {
  createLogger: jest.fn(() => mockLogger),
  format: mockFormat,
  transports: mockTransports,
  addColors: jest.fn(),
  cli: jest.fn(),
  exceptions: {
    handle: jest.fn(),
    unhandle: jest.fn(),
  },
  exitOnError: jest.fn(),
  level: 'info',
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  log: jest.fn(),
  query: jest.fn(),
  stream: jest.fn(),
  startTimer: jest.fn(),
  configure: jest.fn(),
  add: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
  close: jest.fn(),
  child: jest.fn(() => mockLogger),
};

// Mock do winston-daily-rotate-file
const mockDailyRotateFile = jest.fn(() => ({
  name: 'daily-rotate-file',
  level: 'info',
  filename: 'test.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
}));

// Exportar os mocks
export default mockWinston;
export { mockDailyRotateFile as DailyRotateFile };
export { mockFormat as format };
export { mockTransports as transports };

// Para compatibilidade com importações nomeadas
export const createLogger = mockWinston.createLogger;
export const format = mockFormat;
export const transports = mockTransports;
