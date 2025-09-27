import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown for production tests...');
  
  // Aqui você pode adicionar lógica de limpeza se necessário
  // Por exemplo, limpar dados de teste, fechar conexões, etc.
  
  console.log('✅ Global teardown completed successfully');
}

export default globalTeardown;
