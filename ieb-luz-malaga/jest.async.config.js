import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  // Configurações básicas otimizadas para testes assíncronos
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  
  // Padrões de teste otimizados
  testMatch: [
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/__tests__/components/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/__tests__/api/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/__tests__/hooks/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/__tests__/utils/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/__tests__/pages/**/*.{js,jsx,ts,tsx}',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/__tests__/e2e/',
    '<rootDir>/coverage/',
    '<rootDir>/test-results/',
    '<rootDir>/playwright-report/',
    '<rootDir>/__tests__backup/',
    '<rootDir>/logs/',
    '<rootDir>/scripts/',
  ],
  
  // Mapeamento de módulos otimizado
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Mocks essenciais
    '^@supabase/supabase-js$': '<rootDir>/__mocks__/@supabase/supabase-js.ts',
    '^winston$': '<rootDir>/__mocks__/winston.ts',
    '^winston-daily-rotate-file$': '<rootDir>/__mocks__/winston-daily-rotate-file.ts',
    '^@sentry/nextjs$': '<rootDir>/__mocks__/@sentry/nextjs.ts',
    '^@sentry/react$': '<rootDir>/__mocks__/@sentry/react.ts',
    '^framer-motion$': '<rootDir>/__mocks__/framer-motion.ts',
    '^next-themes$': '<rootDir>/__mocks__/next-themes.ts',
    '^react-hook-form$': '<rootDir>/__mocks__/react-hook-form.ts',
    '^@hookform/resolvers$': '<rootDir>/__mocks__/@hookform/resolvers.ts',
    '^zod$': '<rootDir>/__mocks__/zod.ts',
    '^@google-cloud/storage$': '<rootDir>/__mocks__/@google-cloud/storage.ts',
    '^googleapis$': '<rootDir>/__mocks__/googleapis.ts',
    '^sharp$': '<rootDir>/__mocks__/sharp.ts',
    '^canvas$': '<rootDir>/__mocks__/canvas.ts',
    // Mapeamentos para assets estáticos
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
  },
  
  // Configuração de cobertura otimizada
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/app/**/loading.tsx',
    '!src/app/**/error.tsx',
    '!src/app/**/not-found.tsx',
    '!src/app/**/layout.tsx',
    '!src/app/**/page.tsx',
    '!src/app/globals.css',
    '!src/instrumentation.ts',
    '!src/middleware.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Configurações de performance otimizadas para testes assíncronos
  automock: false,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  
  // Configurações de timeout otimizadas para testes assíncronos
  testTimeout: process.env.CI ? 120000 : 60000, // 2min em CI, 1min localmente
  maxWorkers: process.env.CI ? '25%' : '50%', // Menos workers para testes assíncronos
  workerIdleMemoryLimit: '512MB', // Mais memória para testes complexos
  workerThreads: true,
  
  // Configurações específicas para testes assíncronos
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  
  // Configurações de transformação otimizadas
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { 
      presets: ['next/babel'],
      plugins: ['@babel/plugin-transform-runtime'],
      cacheDirectory: true,
      cacheCompression: false,
    }],
  },
  
  // Configurações de módulos otimizadas
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Configurações de cache otimizadas
  cacheDirectory: '<rootDir>/.jest-cache',
  cache: true,
  clearMocks: true,
  
  // Configurações de paralelização otimizadas para testes assíncronos
  maxConcurrency: 3, // Menos concorrência para testes assíncronos
  bail: false,
  
  // Configurações de setup
  setupFiles: [],
  
  // Configurações de globals otimizadas
  globals: {
    'ts-jest': {
      useESM: true,
      isolatedModules: true,
    },
  },
  
  // Configurações adicionais de performance
  verbose: process.env.JEST_VERBOSE === 'true',
  silent: process.env.JEST_SILENT === 'true',
  detectOpenHandles: process.env.CI === 'true',
  forceExit: process.env.CI === 'true',
  
  // Configurações de snapshot otimizadas
  snapshotSerializers: ['@testing-library/jest-dom'],
  
  // Configurações de transformação de módulos
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@testing-library|@babel/runtime))',
  ],
};

export default createJestConfig(customJestConfig);

