#!/usr/bin/env node

/**
 * Gerenciador de Cache do Jest
 * Script para gerenciar o cache do Jest com otimizações avançadas
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { cacheConfig, cleanupCache, checkCacheHealth, optimizeCache } = require('../jest.cache.config.js');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function showHelp() {
  log('\n🔧 Jest Cache Manager - Gerenciador de Cache do Jest', 'cyan');
  log('='.repeat(50), 'cyan');
  log('\nComandos disponíveis:', 'bright');
  log('  status     - Mostra o status atual do cache', 'green');
  log('  clean      - Limpa o cache do Jest', 'yellow');
  log('  optimize   - Otimiza o cache para o ambiente atual', 'blue');
  log('  warmup     - Aquece o cache executando testes', 'magenta');
  log('  health     - Verifica a saúde do cache', 'green');
  log('  size       - Mostra o tamanho do cache', 'yellow');
  log('  help       - Mostra esta ajuda', 'cyan');
  log('\nExemplos:', 'bright');
  log('  npm run jest:cache status', 'green');
  log('  npm run jest:cache clean', 'yellow');
  log('  npm run jest:cache warmup', 'magenta');
  log('\n');
}

function showStatus() {
  log('\n📊 Status do Cache do Jest', 'cyan');
  log('='.repeat(30), 'cyan');
  
  const health = checkCacheHealth();
  
  log(`\nDiretório de cache: ${cacheConfig.cacheDirectory}`, 'blue');
  log(`Tamanho atual: ${health.size.toFixed(2)}MB`, health.healthy ? 'green' : 'yellow');
  log(`Arquivos: ${health.files}`, health.healthy ? 'green' : 'yellow');
  log(`Limite de tamanho: ${health.maxSize.toFixed(2)}MB`, 'blue');
  log(`Limite de arquivos: ${health.maxFiles}`, 'blue');
  
  if (health.healthy) {
    log('\n✅ Cache está saudável', 'green');
  } else {
    log('\n⚠️  Cache precisa de limpeza', 'yellow');
  }
  
  // Verifica se o diretório existe
  if (!fs.existsSync(cacheConfig.cacheDirectory)) {
    log('\n📁 Diretório de cache não existe - será criado na primeira execução', 'blue');
  }
}

function cleanCache() {
  log('\n🧹 Limpando cache do Jest...', 'yellow');
  
  try {
    // Remove diretório de cache completamente
    if (fs.existsSync(cacheConfig.cacheDirectory)) {
      fs.rmSync(cacheConfig.cacheDirectory, { recursive: true, force: true });
      log('✅ Cache removido completamente', 'green');
    } else {
      log('ℹ️  Cache já estava limpo', 'blue');
    }
    
    // Limpa cache do Jest
    try {
      execSync('npx jest --clearCache', { stdio: 'inherit' });
      log('✅ Cache do Jest limpo', 'green');
    } catch (error) {
      log('⚠️  Erro ao limpar cache do Jest (pode ser normal se não houver cache)', 'yellow');
    }
    
  } catch (error) {
    log(`❌ Erro ao limpar cache: ${error.message}`, 'red');
    process.exit(1);
  }
}

function optimizeCacheForEnvironment() {
  log('\n⚡ Otimizando cache para o ambiente atual...', 'blue');
  
  const isCI = process.env.CI === 'true';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  log(`Ambiente detectado: ${isCI ? 'CI/CD' : isDevelopment ? 'Desenvolvimento' : 'Produção'}`, 'cyan');
  
  const optimizedConfig = optimizeCache();
  
  log('\nConfigurações otimizadas:', 'bright');
  log(`  Babel TTL: ${optimizedConfig.transformCache.babel.ttl / (60 * 1000)} minutos`, 'green');
  log(`  TypeScript TTL: ${optimizedConfig.transformCache.typescript.ttl / (60 * 1000)} minutos`, 'green');
  log(`  Módulos Src TTL: ${optimizedConfig.moduleCache.srcModules.ttl / (60 * 1000)} minutos`, 'green');
  
  log('\n✅ Cache otimizado para o ambiente atual', 'green');
}

function warmupCache() {
  log('\n🔥 Aquecendo cache do Jest...', 'magenta');
  
  try {
    // Executa testes em modo silencioso para aquecer o cache
    log('Executando testes para aquecer o cache...', 'blue');
    execSync('npm run test:fast', { stdio: 'inherit' });
    log('✅ Cache aquecido com sucesso', 'green');
  } catch (error) {
    log('⚠️  Alguns testes falharam, mas o cache foi aquecido', 'yellow');
  }
}

function showCacheSize() {
  log('\n📏 Tamanho do Cache do Jest', 'cyan');
  log('='.repeat(30), 'cyan');
  
  const health = checkCacheHealth();
  
  log(`\nTamanho total: ${health.size.toFixed(2)}MB`, 'green');
  log(`Arquivos: ${health.files}`, 'green');
  
  if (health.size > 0) {
    const avgSize = (health.size * 1024 * 1024) / health.files;
    log(`Tamanho médio por arquivo: ${(avgSize / 1024).toFixed(2)}KB`, 'blue');
  }
  
  // Mostra breakdown por tipo de arquivo
  if (fs.existsSync(cacheConfig.cacheDirectory)) {
    log('\nBreakdown por tipo de arquivo:', 'bright');
    
    const extensions = {};
    let totalFiles = 0;
    
    function analyzeDirectory(dir) {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          analyzeDirectory(filePath);
        } else {
          const ext = path.extname(file);
          extensions[ext] = (extensions[ext] || 0) + 1;
          totalFiles++;
        }
      });
    }
    
    analyzeDirectory(cacheConfig.cacheDirectory);
    
    Object.entries(extensions)
      .sort(([,a], [,b]) => b - a)
      .forEach(([ext, count]) => {
        const percentage = ((count / totalFiles) * 100).toFixed(1);
        log(`  ${ext || '(sem extensão)'}: ${count} arquivos (${percentage}%)`, 'blue');
      });
  }
}

function checkCacheHealth() {
  log('\n🏥 Verificando saúde do cache...', 'green');
  
  const health = checkCacheHealth();
  
  log(`\nStatus: ${health.healthy ? '✅ Saudável' : '⚠️  Precisa de atenção'}`, health.healthy ? 'green' : 'yellow');
  log(`Tamanho: ${health.size.toFixed(2)}MB / ${health.maxSize.toFixed(2)}MB`, health.size < health.maxSize * 0.8 ? 'green' : 'yellow');
  log(`Arquivos: ${health.files} / ${health.maxFiles}`, health.files < health.maxFiles * 0.8 ? 'green' : 'yellow');
  
  if (!health.healthy) {
    log('\n💡 Recomendações:', 'bright');
    if (health.size > health.maxSize * 0.8) {
      log('  - Execute "npm run jest:cache clean" para limpar o cache', 'yellow');
    }
    if (health.files > health.maxFiles * 0.8) {
      log('  - Execute "npm run jest:cache clean" para remover arquivos antigos', 'yellow');
    }
  }
}

// Main function
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'status':
      showStatus();
      break;
    case 'clean':
      cleanCache();
      break;
    case 'optimize':
      optimizeCacheForEnvironment();
      break;
    case 'warmup':
      warmupCache();
      break;
    case 'health':
      checkCacheHealth();
      break;
    case 'size':
      showCacheSize();
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    default:
      log('❌ Comando não reconhecido', 'red');
      showHelp();
      process.exit(1);
  }
}

// Executa o script
if (require.main === module) {
  main();
}

module.exports = {
  showStatus,
  cleanCache,
  optimizeCacheForEnvironment,
  warmupCache,
  showCacheSize,
  checkCacheHealth,
};
