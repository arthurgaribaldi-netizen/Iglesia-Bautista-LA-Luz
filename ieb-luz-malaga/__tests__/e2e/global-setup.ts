import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for production tests...');
  
  // Verificar se a aplicação está acessível
  const baseURL = process.env.BASE_URL || 'https://your-production-url.com';
  
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Aguardar a aplicação estar pronta
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    
    // Verificar se a página carregou corretamente
    const title = await page.title();
    if (!title) {
      throw new Error('Page title is empty - application may not be ready');
    }
    
    console.log(`✅ Application is ready at ${baseURL}`);
    console.log(`📄 Page title: ${title}`);
    
    await browser.close();
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
  
  console.log('✅ Global setup completed successfully');
}

export default globalSetup;
