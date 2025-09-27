#!/usr/bin/env node

/**
 * Script simplificado para estratégia de implementação gradual de testes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TESTS_DIR = path.join(__dirname, '..', '__tests__');
const BACKUP_DIR = path.join(__dirname, '..', '__tests__backup');

console.log('🧪 Estratégia de Implementação Gradual de Testes');
console.log('📁 Diretório de testes:', TESTS_DIR);
console.log('📦 Diretório de backup:', BACKUP_DIR);

const command = process.argv[2];

switch (command) {
  case 'backup':
    console.log('📦 Criando backup dos testes existentes...');
    
    if (fs.existsSync(BACKUP_DIR)) {
      fs.rmSync(BACKUP_DIR, { recursive: true });
    }
    
    fs.cpSync(TESTS_DIR, BACKUP_DIR, { recursive: true });
    console.log('✅ Backup criado em:', BACKUP_DIR);
    break;
    
  case 'disable':
    console.log('📦 Criando backup...');
    
    if (fs.existsSync(BACKUP_DIR)) {
      fs.rmSync(BACKUP_DIR, { recursive: true });
    }
    
    fs.cpSync(TESTS_DIR, BACKUP_DIR, { recursive: true });
    console.log('✅ Backup criado');
    
    console.log('🚫 Desabilitando todos os testes...');
    
    const testFiles = getAllTestFiles(TESTS_DIR);
    console.log(`📋 Encontrados ${testFiles.length} arquivos de teste`);
    
    testFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // Adiciona comentário de desabilitação no início do arquivo
      const disabledContent = `// DISABLED FOR GRADUAL IMPLEMENTATION - ${new Date().toISOString()}\n// Original file backed up in __tests__backup\n\n${content}`;
      
      // Renomeia o arquivo para .disabled
      const disabledFile = file.replace(/\.(test|spec)\.(ts|tsx|js|jsx)$/, '.disabled.$2');
      fs.writeFileSync(disabledFile, disabledContent);
      fs.unlinkSync(file);
      
      console.log(`   Disabled: ${path.relative(TESTS_DIR, file)}`);
    });
    
    console.log(`✅ ${testFiles.length} testes desabilitados`);
    break;
    
  case 'list':
    console.log('📋 Testes disponíveis para reativação:');
    
    const disabledFiles = [];
    
    function findDisabledFiles(dir) {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          findDisabledFiles(fullPath);
        } else if (item.match(/\.disabled\.(ts|tsx|js|jsx)$/)) {
          const originalName = item.replace('.disabled.', '.test.');
          disabledFiles.push(path.relative(TESTS_DIR, fullPath).replace(/\.disabled\.(ts|tsx|js|jsx)$/, '.test.$1'));
        }
      });
    }
    
    findDisabledFiles(TESTS_DIR);
    
    if (disabledFiles.length === 0) {
      console.log('   Nenhum teste desabilitado encontrado');
    } else {
      disabledFiles.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file}`);
      });
    }
    break;
    
  case 'enable':
    const testName = process.argv[3];
    if (!testName) {
      console.log('❌ Especifique o nome do teste para reativar');
      console.log('Uso: node test-strategy.js enable <nome-do-teste>');
      break;
    }
    
    console.log(`🔄 Reativando teste: ${testName}`);
    
    const disabledFile = path.join(TESTS_DIR, testName.replace(/\.(test|spec)\.(ts|tsx|js|jsx)$/, '.disabled.$2'));
    const originalFile = path.join(TESTS_DIR, testName);
    
    if (!fs.existsSync(disabledFile)) {
      console.log(`❌ Arquivo desabilitado não encontrado: ${disabledFile}`);
      break;
    }
    
    const content = fs.readFileSync(disabledFile, 'utf8');
    
    // Remove comentários de desabilitação
    const enabledContent = content
      .replace(/^\/\/ DISABLED FOR GRADUAL IMPLEMENTATION.*\n/gm, '')
      .replace(/^\/\/ Original file backed up in __tests__backup\n\n/gm, '');
    
    fs.writeFileSync(originalFile, enabledContent);
    fs.unlinkSync(disabledFile);
    
    console.log(`✅ Teste reativado: ${testName}`);
    break;
    
  case 'restore':
    console.log('🔄 Restaurando todos os testes do backup...');
    
    if (!fs.existsSync(BACKUP_DIR)) {
      console.log('❌ Backup não encontrado');
      break;
    }
    
    // Remove diretório atual de testes
    if (fs.existsSync(TESTS_DIR)) {
      fs.rmSync(TESTS_DIR, { recursive: true });
    }
    
    // Restaura do backup
    fs.cpSync(BACKUP_DIR, TESTS_DIR, { recursive: true });
    
    console.log('✅ Testes restaurados do backup');
    break;
    
  default:
    console.log(`
🧪 Estratégia de Implementação Gradual de Testes

Comandos disponíveis:
  backup     - Criar backup dos testes existentes
  disable    - Desabilitar todos os testes (cria backup automaticamente)
  enable     - Reativar um teste específico
  list       - Listar testes disponíveis para reativação
  restore    - Restaurar todos os testes do backup

Exemplos:
  node scripts/test-strategy.js backup
  node scripts/test-strategy.js disable
  node scripts/test-strategy.js list
  node scripts/test-strategy.js enable utils/supabase-mock-utils.test.ts
  node scripts/test-strategy.js restore

Estratégia recomendada:
1. npm run test-strategy disable
2. Corrigir problemas de infraestrutura
3. npm run test-strategy enable <teste-simples>
4. Repetir passo 3 para cada teste
    `);
}

// Função para listar todos os arquivos de teste
function getAllTestFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/)) {
        files.push(fullPath);
      }
    });
  }
  
  traverse(dir);
  return files;
}