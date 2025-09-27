#!/usr/bin/env node

/**
 * Script para configurar o ambiente de CI/CD
 * Verifica dependências, configurações e gera tokens necessários
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Configurando CI/CD para IEB La Luz Málaga...\n');

// Função para gerar secrets seguros
function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Função para verificar se arquivo existe
function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, '..', filePath));
}

// Função para ler package.json
function readPackageJson() {
  try {
    const packagePath = path.join(__dirname, '..', 'package.json');
    return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  } catch (error) {
    console.error('❌ Erro ao ler package.json:', error.message);
    return null;
  }
}

// Função para verificar dependências
function checkDependencies(packageJson) {
  console.log('📦 Verificando dependências...');
  
  const requiredDeps = [
    'next',
    'react',
    'typescript',
    'eslint',
    'jest',
    'playwright',
    'prisma',
    '@supabase/supabase-js',
  ];

  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.dependencies[dep] && !packageJson.devDependencies[dep],
  );

  if (missingDeps.length > 0) {
    console.log('⚠️  Dependências ausentes:', missingDeps.join(', '));
    return false;
  }

  console.log('✅ Todas as dependências necessárias estão instaladas');
  return true;
}

// Função para verificar arquivos de configuração
function checkConfigFiles() {
  console.log('\n🔧 Verificando arquivos de configuração...');
  
  const configFiles = [
    '.github/workflows/ci.yml',
    '.github/workflows/release.yml',
    '.github/workflows/pr.yml',
    '.github/workflows/security-scan.yml',
    '.github/workflows/dependency-update.yml',
    '.github/dependabot.yml',
    '.eslintrc.security.js',
    '.prettierrc',
    'vercel.json',
    'jest.config.js',
    'playwright.config.ts',
  ];

  const missingFiles = configFiles.filter(file => !fileExists(file));

  if (missingFiles.length > 0) {
    console.log('❌ Arquivos de configuração ausentes:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
    return false;
  }

  console.log('✅ Todos os arquivos de configuração estão presentes');
  return true;
}

// Função para gerar arquivo de exemplo de variáveis de ambiente
function generateEnvExample() {
  console.log('\n🌍 Gerando arquivo .env.example...');
  
  const envExample = `# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/ieb_luz_malaga"
DIRECT_URL="postgresql://user:password@localhost:5432/ieb_luz_malaga"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# Autenticação
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${generateSecret()}"
JWT_SECRET="${generateSecret()}"

# APIs Externas
YOUTUBE_API_KEY="your_youtube_api_key"

# Monitoramento
SENTRY_DSN="your_sentry_dsn"
SENTRY_ORG="your_sentry_org"
SENTRY_PROJECT="your_sentry_project"

# Analytics
VERCEL_ANALYTICS_ID="your_analytics_id"

# Ambiente
NODE_ENV="development"
`;

  const envExamplePath = path.join(__dirname, '..', '.env.example');
  fs.writeFileSync(envExamplePath, envExample);
  console.log('✅ Arquivo .env.example criado');
}

// Função para gerar secrets para GitHub
function generateGitHubSecrets() {
  console.log('\n🔑 Gerando secrets para GitHub...');
  
  const secrets = {
    NEXTAUTH_SECRET: generateSecret(),
    JWT_SECRET: generateSecret(),
    SENTRY_AUTH_TOKEN: generateSecret(16),
  };

  console.log('📋 Secrets gerados (configure no GitHub):');
  console.log('='.repeat(50));
  Object.entries(secrets).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });
  console.log('='.repeat(50));
  
  console.log('\n📝 Instruções para configurar no GitHub:');
  console.log('1. Vá para Settings > Secrets and variables > Actions');
  console.log('2. Adicione cada secret acima');
  console.log('3. Configure também os tokens do Vercel');
}

// Função para verificar scripts do package.json
function checkPackageScripts(packageJson) {
  console.log('\n📜 Verificando scripts do package.json...');
  
  const requiredScripts = [
    'dev',
    'build',
    'start',
    'lint',
    'test',
    'test:ci',
    'test:e2e',
  ];

  const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);

  if (missingScripts.length > 0) {
    console.log('⚠️  Scripts ausentes:', missingScripts.join(', '));
    return false;
  }

  console.log('✅ Todos os scripts necessários estão configurados');
  return true;
}

// Função para criar arquivo de health check
function createHealthCheckEndpoint() {
  console.log('\n🏥 Criando endpoint de health check...');
  
  const healthCheckContent = `import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Verificações básicas de saúde
    const checks = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0'
    };

    return NextResponse.json(checks, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
`;

  const healthCheckPath = path.join(__dirname, '..', 'src', 'app', 'api', 'health', 'route.ts');
  const healthCheckDir = path.dirname(healthCheckPath);
  
  if (!fs.existsSync(healthCheckDir)) {
    fs.mkdirSync(healthCheckDir, { recursive: true });
  }
  
  fs.writeFileSync(healthCheckPath, healthCheckContent);
  console.log('✅ Endpoint /api/health criado');
}

// Função para verificar configuração do Prisma
function checkPrismaConfig() {
  console.log('\n🗄️  Verificando configuração do Prisma...');
  
  if (!fileExists('prisma/schema.prisma')) {
    console.log('❌ Arquivo prisma/schema.prisma não encontrado');
    return false;
  }

  console.log('✅ Configuração do Prisma encontrada');
  return true;
}

// Função principal
async function main() {
  console.log('🔍 Iniciando verificação de configuração...\n');

  // Ler package.json
  const packageJson = readPackageJson();
  if (!packageJson) {
    process.exit(1);
  }

  // Verificações
  const checks = [
    () => checkDependencies(packageJson),
    () => checkPackageScripts(packageJson),
    () => checkConfigFiles(),
    () => checkPrismaConfig(),
  ];

  let allPassed = true;
  for (const check of checks) {
    if (!check()) {
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log('\n🎉 Configuração básica verificada com sucesso!');
  } else {
    console.log('\n⚠️  Algumas verificações falharam. Corrija os problemas antes de prosseguir.');
  }

  // Gerar arquivos necessários
  generateEnvExample();
  generateGitHubSecrets();
  createHealthCheckEndpoint();

  console.log('\n📚 Próximos passos:');
  console.log('1. Configure os secrets no GitHub');
  console.log('2. Configure as variáveis de ambiente no Vercel');
  console.log('3. Execute: npm run build');
  console.log('4. Execute: npm run test');
  console.log('5. Faça push para o repositório para testar o CI/CD');

  console.log('\n✨ Configuração de CI/CD concluída!');
}

// Executar script
main().catch(console.error);
