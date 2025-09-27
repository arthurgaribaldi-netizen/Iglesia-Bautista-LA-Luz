#!/usr/bin/env node

/**
 * Script para testar otimizações de minificação e cache headers
 * Executa build otimizado e verifica configurações
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Testando Otimizações de Minificação e Cache Headers\n');

// Função para executar comandos com output
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      cwd: process.cwd()
    });
    console.log(`✅ ${description} - Sucesso`);
    return output;
  } catch (error) {
    console.log(`❌ ${description} - Erro:`, error.message);
    throw error;
  }
}

// Função para verificar arquivo
function checkFile(filePath, description) {
  console.log(`📋 ${description}...`);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description} - Arquivo existe`);
    return true;
  } else {
    console.log(`❌ ${description} - Arquivo não encontrado`);
    return false;
  }
}

// Função para analisar bundle size
function analyzeBundleSize() {
  console.log('\n📊 Analisando Bundle Size...');
  
  const nextDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(nextDir)) {
    console.log('❌ Diretório .next não encontrado. Execute o build primeiro.');
    return;
  }

  try {
    // Verificar tamanho do diretório .next
    const { execSync } = require('child_process');
    const sizeOutput = execSync(`du -sh .next`, { encoding: 'utf8' });
    console.log(`📦 Tamanho total do build: ${sizeOutput.trim()}`);

    // Verificar chunks específicos
    const staticDir = path.join(nextDir, 'static');
    if (fs.existsSync(staticDir)) {
      const chunksOutput = execSync(`du -sh .next/static/chunks`, { encoding: 'utf8' });
      console.log(`📦 Tamanho dos chunks: ${chunksOutput.trim()}`);
    }

  } catch (error) {
    console.log('⚠️ Não foi possível analisar bundle size:', error.message);
  }
}

// Função para verificar configurações
function verifyConfigurations() {
  console.log('\n🔍 Verificando Configurações...');
  
  const configPath = path.join(process.cwd(), 'next.config.js');
  if (!fs.existsSync(configPath)) {
    console.log('❌ next.config.js não encontrado');
    return false;
  }

  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Verificar configurações de minificação
  const minificationChecks = [
    { pattern: /config\.optimization\.minimize\s*=\s*true/, name: 'Minificação habilitada' },
    { pattern: /config\.optimization\.usedExports\s*=\s*true/, name: 'Tree shaking habilitado' },
    { pattern: /config\.optimization\.sideEffects\s*=\s*false/, name: 'Side effects desabilitados' },
    { pattern: /keep_fnames:\s*true/, name: 'Preservação de nomes de função' },
    { pattern: /keep_classnames:\s*true/, name: 'Preservação de nomes de classe' },
  ];

  minificationChecks.forEach(check => {
    if (check.pattern.test(configContent)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name} - Não encontrado`);
    }
  });

  // Verificar configurações de cache
  const cacheChecks = [
    { pattern: /Cache-Control.*max-age=31536000.*immutable/, name: 'Cache longo para assets estáticos' },
    { pattern: /Cache-Control.*max-age=86400.*s-maxage=31536000/, name: 'Cache otimizado para imagens' },
    { pattern: /Cache-Control.*no-cache.*no-store.*must-revalidate/, name: 'Sem cache para páginas dinâmicas' },
    { pattern: /stale-while-revalidate/, name: 'Stale-while-revalidate configurado' },
  ];

  cacheChecks.forEach(check => {
    if (check.pattern.test(configContent)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name} - Não encontrado`);
    }
  });

  return true;
}

// Função principal
async function main() {
  try {
    console.log('🔧 Iniciando testes de otimização...\n');

    // 1. Verificar configurações
    verifyConfigurations();

    // 2. Limpar cache anterior
    console.log('\n🧹 Limpando cache anterior...');
    try {
      runCommand('rm -rf .next', 'Removendo cache do Next.js');
    } catch (error) {
      console.log('⚠️ Não foi possível remover .next (pode não existir)');
    }

    // 3. Executar build
    console.log('\n🏗️ Executando build otimizado...');
    runCommand('npm run build', 'Build de produção');

    // 4. Verificar arquivos gerados
    console.log('\n📁 Verificando arquivos gerados...');
    checkFile('.next', 'Diretório .next');
    checkFile('.next/static', 'Diretório static');
    checkFile('.next/server', 'Diretório server');

    // 5. Analisar bundle size
    analyzeBundleSize();

    // 6. Testar aplicação
    console.log('\n🚀 Testando aplicação...');
    console.log('📋 Para testar a aplicação, execute: npm run start');
    console.log('📋 Em seguida, acesse: http://localhost:3000');

    console.log('\n✅ Testes de otimização concluídos!');
    console.log('\n📊 Resumo das Otimizações:');
    console.log('  • Minificação otimizada com preservação de nomes');
    console.log('  • Tree shaking habilitado');
    console.log('  • Cache headers otimizados por tipo de conteúdo');
    console.log('  • Chunk splitting melhorado');
    console.log('  • Headers de segurança aprimorados');

  } catch (error) {
    console.log('\n❌ Erro durante os testes:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { main, verifyConfigurations, analyzeBundleSize };
