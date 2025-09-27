#!/usr/bin/env node

/**
 * Script para corrigir problemas de minificação no build
 * Resolve o erro "TypeError: tF is not a function"
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Iniciando correção de problemas de minificação...');

// 1. Limpar cache do Next.js
console.log('📁 Limpando cache do Next.js...');
try {
  execSync('rm -rf .next', { stdio: 'inherit' });
  console.log('✅ Cache do Next.js limpo');
} catch (error) {
  console.log('⚠️  Cache do Next.js já estava limpo ou não existe');
}

// 2. Limpar cache do npm
console.log('📦 Limpando cache do npm...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ Cache do npm limpo');
} catch (error) {
  console.log('⚠️  Erro ao limpar cache do npm:', error.message);
}

// 3. Regenerar Prisma Client
console.log('🗄️  Regenerando Prisma Client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client regenerado');
} catch (error) {
  console.log('⚠️  Erro ao regenerar Prisma Client:', error.message);
}

// 4. Verificar configuração do Next.js
console.log('⚙️  Verificando configuração do Next.js...');
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  const config = fs.readFileSync(nextConfigPath, 'utf8');
  
  // Verificar se as configurações de minificação estão presentes
  const hasKeepFnames = config.includes('keep_fnames: true');
  const hasKeepClassnames = config.includes('keep_classnames: true');
  const hasTerserConfig = config.includes('TerserPlugin');
  
  if (hasKeepFnames && hasKeepClassnames && hasTerserConfig) {
    console.log('✅ Configuração de minificação está correta');
  } else {
    console.log('⚠️  Configuração de minificação pode estar incompleta');
  }
} else {
  console.log('❌ Arquivo next.config.js não encontrado');
}

// 5. Verificar dependências
console.log('📋 Verificando dependências...');
try {
  execSync('npm audit --audit-level=moderate', { stdio: 'inherit' });
  console.log('✅ Dependências verificadas');
} catch (error) {
  console.log('⚠️  Algumas dependências podem ter vulnerabilidades');
}

// 6. Executar build de teste
console.log('🏗️  Executando build de teste...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build executado com sucesso!');
} catch (error) {
  console.log('❌ Build falhou:', error.message);
  console.log('💡 Verifique os logs acima para mais detalhes');
}

console.log('🎉 Correção de minificação concluída!');
console.log('📝 Se o problema persistir, verifique:');
console.log('   - Logs de build detalhados');
console.log('   - Configurações de ambiente');
console.log('   - Dependências específicas que podem estar causando o problema');
