#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔄 Reorganizando estrutura do projeto...');

// Lista de arquivos que devem ser movidos da pasta ieb-luz-malaga para a raiz
const filesToMove = [
  'package.json',
  'package-lock.json',
  'next.config.js',
  'tailwind.config.ts',
  'tsconfig.json',
  'postcss.config.mjs',
  'eslint.config.mjs',
  'jest.config.js',
  'playwright.config.ts',
  'prisma',
  'src',
  'public',
  'scripts',
  '.env.example',
  '.gitignore',
  '.gitattributes',
  'README.md',
  'LICENSE',
  'Dockerfile',
  'docker-compose.yml'
];

const sourceDir = './ieb-luz-malaga';
const targetDir = './';

function moveFile(source, target) {
  try {
    if (fs.existsSync(source)) {
      const targetPath = path.join(targetDir, path.basename(source));
      
      if (fs.statSync(source).isDirectory()) {
        if (fs.existsSync(targetPath)) {
          fs.rmSync(targetPath, { recursive: true, force: true });
        }
        fs.renameSync(source, targetPath);
        console.log(`✅ Moved directory: ${source} -> ${targetPath}`);
      } else {
        if (fs.existsSync(targetPath)) {
          fs.unlinkSync(targetPath);
        }
        fs.renameSync(source, targetPath);
        console.log(`✅ Moved file: ${source} -> ${targetPath}`);
      }
    } else {
      console.log(`⚠️  File not found: ${source}`);
    }
  } catch (error) {
    console.error(`❌ Error moving ${source}:`, error.message);
  }
}

// Mover arquivos principais
filesToMove.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  moveFile(sourcePath, targetDir);
});

// Mover arquivos de configuração ocultos
const hiddenFiles = ['.prettierrc', '.prettierignore', '.eslintignore', '.nycrc.json'];
hiddenFiles.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  moveFile(sourcePath, targetDir);
});

console.log('🎉 Reorganização concluída!');
console.log('📝 Próximos passos:');
console.log('1. Verificar se todos os arquivos foram movidos corretamente');
console.log('2. Atualizar vercel.json para usar a raiz');
console.log('3. Fazer commit das mudanças');
console.log('4. Fazer novo deploy no Vercel');
