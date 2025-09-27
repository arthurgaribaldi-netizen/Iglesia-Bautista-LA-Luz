#!/usr/bin/env node

/**
 * Script to verify that console.log statements are properly removed in production builds
 * This script checks the built JavaScript files to ensure no console.log statements remain
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('🔍 Verificando limpeza de console.log em produção...\n');

// Check if .next directory exists
const nextDir = path.join(projectRoot, '.next');
if (!fs.existsSync(nextDir)) {
  console.log('❌ Diretório .next não encontrado. Execute "npm run build" primeiro.');
  process.exit(1);
}

// Function to recursively find JavaScript files
function findJSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findJSFiles(filePath, fileList);
    } else if (file.endsWith('.js') && !file.includes('node_modules')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Find all JavaScript files in .next directory
const jsFiles = findJSFiles(nextDir);

console.log(`📁 Encontrados ${jsFiles.length} arquivos JavaScript para verificar...\n`);

let totalConsoleLogs = 0;
let filesWithConsoleLogs = [];

// Check each file for console.log statements
jsFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Look for console.log patterns (but not console.error which should remain)
    const consoleLogMatches = content.match(/console\.log\(/g);
    const consoleWarnMatches = content.match(/console\.warn\(/g);
    const consoleInfoMatches = content.match(/console\.info\(/g);
    const consoleDebugMatches = content.match(/console\.debug\(/g);
    
    const totalMatches = (consoleLogMatches?.length || 0) + 
                       (consoleWarnMatches?.length || 0) + 
                       (consoleInfoMatches?.length || 0) + 
                       (consoleDebugMatches?.length || 0);
    
    if (totalMatches > 0) {
      totalConsoleLogs += totalMatches;
      filesWithConsoleLogs.push({
        file: path.relative(projectRoot, filePath),
        consoleLogs: consoleLogMatches?.length || 0,
        consoleWarns: consoleWarnMatches?.length || 0,
        consoleInfos: consoleInfoMatches?.length || 0,
        consoleDebugs: consoleDebugMatches?.length || 0,
        total: totalMatches
      });
    }
  } catch (error) {
    console.log(`⚠️  Erro ao ler arquivo ${filePath}:`, error.message);
  }
});

// Report results
if (totalConsoleLogs === 0) {
  console.log('✅ Sucesso! Nenhum console.log encontrado nos arquivos de produção.');
  console.log('🎉 A limpeza de console.log foi aplicada corretamente!');
} else {
  console.log(`❌ Encontrados ${totalConsoleLogs} console.log/warn/info/debug nos arquivos de produção:`);
  console.log('');
  
  filesWithConsoleLogs.forEach(file => {
    console.log(`📄 ${file.file}:`);
    if (file.consoleLogs > 0) console.log(`   - ${file.consoleLogs} console.log`);
    if (file.consoleWarns > 0) console.log(`   - ${file.consoleWarns} console.warn`);
    if (file.consoleInfos > 0) console.log(`   - ${file.consoleInfos} console.info`);
    if (file.consoleDebugs > 0) console.log(`   - ${file.consoleDebugs} console.debug`);
    console.log(`   Total: ${file.total}`);
    console.log('');
  });
  
  console.log('💡 Verifique a configuração do Terser no next.config.js');
  console.log('💡 Certifique-se de que drop_console está configurado corretamente');
}

// Check console.error statements (these should remain)
console.log('\n🔍 Verificando console.error (devem permanecer)...');
let totalConsoleErrors = 0;

jsFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const consoleErrorMatches = content.match(/console\.error\(/g);
    
    if (consoleErrorMatches) {
      totalConsoleErrors += consoleErrorMatches.length;
    }
  } catch (error) {
    // Ignore errors
  }
});

console.log(`✅ ${totalConsoleErrors} console.error encontrados (correto - devem permanecer)`);

// Performance impact estimation
const estimatedSavings = totalConsoleLogs * 50; // Rough estimate: 50 bytes per console.log
console.log(`\n📊 Estimativa de economia de tamanho: ~${estimatedSavings} bytes`);
console.log(`📊 Estimativa de melhoria de performance: ~${Math.round(totalConsoleLogs * 0.1)}ms em dispositivos lentos`);

console.log('\n✨ Verificação concluída!');
