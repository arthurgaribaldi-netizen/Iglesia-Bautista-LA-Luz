import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  // Configurações de timeout otimizadas para testes assíncronos
  timeout: process.env.CI ? 60000 : 30000, // 60s em CI, 30s localmente
  expect: {
    timeout: process.env.CI ? 15000 : 10000, // 15s em CI, 10s localmente
  },
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    
    // Configurações adicionais para estabilidade
    actionTimeout: 10000, // Timeout para ações como click, fill
    navigationTimeout: 30000, // Timeout para navegação
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
