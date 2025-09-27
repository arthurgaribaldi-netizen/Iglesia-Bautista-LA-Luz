#!/usr/bin/env node

/**
 * Script para verificar problemas de produção
 * Executa verificações básicas antes do deploy
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração de produção...\n');

// Verificar se arquivos críticos existem
const criticalFiles = [
  'package.json',
  'next.config.js',
  'vercel.json',
  'prisma/schema.prisma',
  'src/app/layout.tsx',
  'src/app/page.tsx',
];

console.log('📁 Verificando arquivos críticos:');
criticalFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Verificar configuração do package.json
console.log('\n📦 Verificando package.json:');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  
  // Verificar scripts necessários
  const requiredScripts = ['build', 'start', 'dev'];
  requiredScripts.forEach(script => {
    const exists = packageJson.scripts && packageJson.scripts[script];
    console.log(`  ${exists ? '✅' : '❌'} Script "${script}"`);
  });
  
  // Verificar dependências críticas
  const criticalDeps = ['next', 'react', 'react-dom', '@prisma/client'];
  criticalDeps.forEach(dep => {
    const exists = packageJson.dependencies && packageJson.dependencies[dep];
    console.log(`  ${exists ? '✅' : '❌'} Dependência "${dep}"`);
  });
  
} catch (error) {
  console.log('  ❌ Erro ao ler package.json:', error.message);
}

// Verificar configuração do Vercel
console.log('\n🚀 Verificando vercel.json:');
try {
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'vercel.json'), 'utf8'));
  
  const hasBuildCommand = vercelConfig.buildCommand;
  const hasOutputDir = vercelConfig.outputDirectory;
  const hasFramework = vercelConfig.framework;
  
  console.log(`  ${hasBuildCommand ? '✅' : '❌'} buildCommand configurado`);
  console.log(`  ${hasOutputDir ? '✅' : '❌'} outputDirectory configurado`);
  console.log(`  ${hasFramework ? '✅' : '❌'} framework configurado`);
  
} catch (error) {
  console.log('  ❌ Erro ao ler vercel.json:', error.message);
}

// Verificar schema do Prisma
console.log('\n🗄️ Verificando schema do Prisma:');
try {
  const schema = fs.readFileSync(path.join(__dirname, '..', 'prisma/schema.prisma'), 'utf8');
  
  const hasProvider = schema.includes('provider = "postgresql"');
  const hasDatasource = schema.includes('datasource db');
  const hasModels = schema.includes('model ');
  
  console.log(`  ${hasProvider ? '✅' : '❌'} Provider PostgreSQL configurado`);
  console.log(`  ${hasDatasource ? '✅' : '❌'} Datasource configurado`);
  console.log(`  ${hasModels ? '✅' : '❌'} Modelos definidos`);
  
} catch (error) {
  console.log('  ❌ Erro ao ler schema.prisma:', error.message);
}

// Verificar variáveis de ambiente necessárias
console.log('\n🔧 Variáveis de ambiente necessárias:');
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_SITE_URL',
  'YOUTUBE_API_KEY',
];

requiredEnvVars.forEach(envVar => {
  console.log(`  ⚠️  ${envVar} - Configure no painel do Vercel`);
});

console.log('\n📋 Checklist de produção:');
console.log('  □ Configurar variáveis de ambiente no Vercel');
console.log('  □ Configurar banco de dados PostgreSQL');
console.log('  □ Executar migrações do Prisma');
console.log('  □ Configurar YouTube API (opcional)');
console.log('  □ Fazer deploy');
console.log('  □ Testar URLs críticas');

console.log('\n✨ Verificação concluída!');
console.log('📖 Consulte PRODUCTION-FIXES.md para instruções detalhadas.');
