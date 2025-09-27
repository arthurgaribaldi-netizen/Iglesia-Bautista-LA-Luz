import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  // Configurações básicas otimizadas
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  
  // Padrões de teste otimizados com priorização
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
  
  // Mapeamento de módulos otimizado com cache
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Mocks essenciais com cache
    '^@supabase/supabase-js$': '<rootDir>/__mocks__/@supabase/supabase-js.ts',
    '^@/lib/supabase$': '<rootDir>/__mocks__/@/lib/supabase.ts',
    '^@prisma/client$': '<rootDir>/__mocks__/@prisma/client.ts',
    '^@/lib/db$': '<rootDir>/__mocks__/@/lib/db.ts',
    '^bcryptjs$': '<rootDir>/__mocks__/bcryptjs.ts',
    '^jsonwebtoken$': '<rootDir>/__mocks__/jsonwebtoken.ts',
    '^winston$': '<rootDir>/__mocks__/winston.ts',
    '^winston-daily-rotate-file$': '<rootDir>/__mocks__/winston-daily-rotate-file.ts',
    '^@sentry/nextjs$': '<rootDir>/__mocks__/@sentry/nextjs.ts',
    '^@sentry/react$': '<rootDir>/__mocks__/@sentry/react.ts',
    '^@sentry/instrumentation$': '<rootDir>/__mocks__/@sentry/instrumentation.ts',
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
  
  // Configurações de performance otimizadas
  automock: false,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  
  // Configurações de timeout e workers otimizadas para testes assíncronos
  testTimeout: process.env.CI ? 180000 : 90000, // 3min em CI, 1.5min localmente
  maxWorkers: process.env.CI ? '25%' : '50%', // Reduzido para evitar problemas de memória
  workerIdleMemoryLimit: '128MB', // Reduzido para liberação mais rápida
  workerThreads: false, // Desabilitado para evitar problemas de memória
  
  // Configurações específicas para testes assíncronos
  testEnvironmentOptions: {
    // Timeout para operações assíncronas específicas
    customExportConditions: ['node', 'node-addons'],
    // Configurações adicionais para timeout
    beforeTimeout: 60000, // 1min para setup
    afterTimeout: 60000,  // 1min para teardown
  },
  
  // Configurações de transformação otimizadas
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { 
      presets: ['next/babel'],
      plugins: ['@babel/plugin-transform-runtime'],
      cacheDirectory: true,
      cacheCompression: false, // Desabilita compressão para velocidade
    }],
  },
  
  // Configurações de módulos otimizadas
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Configurações de cache otimizadas
  cacheDirectory: '<rootDir>/.jest-cache',
  cache: true,
  clearMocks: true,
  
  // Configurações de paralelização avançada
  maxConcurrency: 5, // Limita testes concorrentes
  bail: false, // Não para na primeira falha
  
  // Configurações de setup
  setupFiles: [],
  
  // Configurações de globals otimizadas
  globals: {
    'ts-jest': {
      useESM: true,
      isolatedModules: true, // Melhora performance
    },
  },
  
  // Configurações adicionais de performance
  verbose: process.env.JEST_VERBOSE === 'true',
  silent: process.env.JEST_SILENT === 'true',
  detectOpenHandles: process.env.CI === 'true',
  forceExit: process.env.CI === 'true',
  
  // Configurações de watch mode otimizadas
  // watchPlugins: process.env.CI ? [] : [
  //   'jest-watch-typeahead/filename',
  //   'jest-watch-typeahead/testname',
  // ],
  
  // Configurações de relatórios otimizadas
  reporters: ['default'],
  // reporters: process.env.CI ? [
  //   'default',
  //   ['jest-junit', { outputDirectory: 'test-results', outputName: 'junit.xml' }],
  //   ['jest-html-reporters', { 
  //     publicPath: './test-results',
  //     filename: 'report.html',
  //     expand: true
  //   }]
  // ] : ['default'],
  
  // Configurações de notificações
  notify: false,
  notifyMode: 'failure-change',
  
  // Configurações de erro otimizadas
  errorOnDeprecated: true,
  
  // Configurações de snapshot otimizadas
  snapshotSerializers: ['@testing-library/jest-dom'],
  
  // Configurações de transformação de módulos
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@testing-library|@babel/runtime))',
  ],
};

export default createJestConfig(customJestConfig);
