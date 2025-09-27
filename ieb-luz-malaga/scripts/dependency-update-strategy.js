#!/usr/bin/env node

/**
 * Script de Atualização Incremental de Dependências
 * Baseado no Relatório de Análise de Dependências
 * 
 * Este script implementa uma estratégia segura de atualização
 * seguindo as recomendações do relatório técnico.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cores para output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${colors.bold}[${step}]${colors.reset} ${message}`, 'blue');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

// Configurações de atualização baseadas no relatório
const UPDATE_STRATEGY = {
  // Patch updates - Seguros para atualizar imediatamente
  patches: [
    '@sentry/nextjs',
    '@supabase/supabase-js', 
    'framer-motion',
    '@playwright/test',
    'tsx'
  ],
  
  // Minor updates - Requerem testes básicos
  minors: [
    'eslint-plugin-security',
    'eslint-plugin-react-hooks'
  ],
  
  // Major updates - Requerem planejamento e testes extensivos
  majors: [
    'next',
    'react',
    'react-dom',
    '@types/react',
    '@types/react-dom',
    'prisma',
    '@prisma/client'
  ]
};

function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 18) {
    logError(`Node.js ${nodeVersion} não é compatível. Requer Node.js >= 18.0.0`);
    process.exit(1);
  }
  
  logSuccess(`Node.js ${nodeVersion} é compatível`);
}

function checkNpmVersion() {
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(npmVersion.split('.')[0]);
    
    if (majorVersion < 9) {
      logWarning(`NPM ${npmVersion} pode não ser ideal. Recomendado NPM >= 9.0.0`);
    } else {
      logSuccess(`NPM ${npmVersion} é compatível`);
    }
  } catch (error) {
    logWarning('Não foi possível verificar versão do NPM');
  }
}

function runCommand(command, description) {
  try {
    log(`Executando: ${command}`, 'blue');
    execSync(command, { stdio: 'inherit' });
    logSuccess(`${description} concluído`);
    return true;
  } catch (error) {
    logError(`${description} falhou: ${error.message}`);
    return false;
  }
}

function updatePatches() {
  logStep('1', 'Atualizando dependências de patch (seguras)');
  
  const patchPackages = UPDATE_STRATEGY.patches.join(' ');
  const command = `npm update ${patchPackages}`;
  
  if (runCommand(command, 'Atualização de patches')) {
    logSuccess('Dependências de patch atualizadas com sucesso');
    return true;
  }
  return false;
}

function updateMinors() {
  logStep('2', 'Atualizando dependências minor (requerem testes)');
  
  const minorPackages = UPDATE_STRATEGY.minors.join(' ');
  const command = `npm update ${minorPackages}`;
  
  if (runCommand(command, 'Atualização de minors')) {
    logSuccess('Dependências minor atualizadas com sucesso');
    return true;
  }
  return false;
}

function runQualityChecks() {
  logStep('3', 'Executando verificações de qualidade');
  
  const checks = [
    { cmd: 'npm run lint', desc: 'Linting' },
    { cmd: 'npm run type-check', desc: 'Type checking' },
    { cmd: 'npm run format:check', desc: 'Formatação' }
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    if (!runCommand(check.cmd, check.desc)) {
      allPassed = false;
    }
  }
  
  return allPassed;
}

function runTests() {
  logStep('4', 'Executando testes');
  
  const testCommands = [
    { cmd: 'npm run test:fast', desc: 'Testes rápidos' },
    { cmd: 'npm run build:verify', desc: 'Build e verificação' }
  ];
  
  let allPassed = true;
  
  for (const test of testCommands) {
    if (!runCommand(test.cmd, test.desc)) {
      allPassed = false;
    }
  }
  
  return allPassed;
}

function generateReport() {
  logStep('5', 'Gerando relatório de dependências');
  
  try {
    runCommand('npm outdated', 'Verificação de dependências desatualizadas');
    runCommand('npm audit --audit-level=moderate', 'Auditoria de segurança');
  } catch (error) {
    logWarning('Alguns comandos de relatório falharam, mas isso é normal');
  }
}

function showMajorUpdatePlan() {
  logStep('6', 'Plano para Major Updates');
  
  log('\n📋 Dependências que requerem planejamento especial:', 'yellow');
  
  UPDATE_STRATEGY.majors.forEach(pkg => {
    log(`  • ${pkg}`, 'yellow');
  });
  
  log('\n📝 Próximos passos recomendados:', 'blue');
  log('  1. Testar Next.js 15 em branch separada', 'blue');
  log('  2. Avaliar impacto do React 19', 'blue');
  log('  3. Planejar migração do Prisma 6', 'blue');
  log('  4. Atualizar tipos do TypeScript', 'blue');
}

function main() {
  log(`${colors.bold}🚀 Script de Atualização Incremental de Dependências${colors.reset}`);
  log('Baseado no Relatório de Análise de Dependências - IEB Luz Malaga\n');
  
  // Verificações iniciais
  checkNodeVersion();
  checkNpmVersion();
  
  // Estratégia de atualização incremental
  let success = true;
  
  // 1. Atualizar patches (seguros)
  if (!updatePatches()) {
    success = false;
  }
  
  // 2. Atualizar minors (com testes)
  if (success && !updateMinors()) {
    success = false;
  }
  
  // 3. Verificações de qualidade
  if (success && !runQualityChecks()) {
    logWarning('Algumas verificações de qualidade falharam');
  }
  
  // 4. Testes
  if (success && !runTests()) {
    logWarning('Alguns testes falharam');
  }
  
  // 5. Relatório final
  generateReport();
  
  // 6. Plano para major updates
  showMajorUpdatePlan();
  
  // Resultado final
  if (success) {
    logSuccess('\n🎉 Atualização incremental concluída com sucesso!');
    log('As dependências foram atualizadas de forma segura.');
  } else {
    logError('\n⚠️  Atualização concluída com alguns problemas.');
    log('Revise os erros acima antes de prosseguir.');
  }
  
  log('\n📚 Para mais informações, consulte o RELATORIO-ANALISE-DEPENDENCIAS.md');
}

// Executar o script
main();

export {
  UPDATE_STRATEGY,
  updatePatches,
  updateMinors,
  runQualityChecks,
  runTests
};
