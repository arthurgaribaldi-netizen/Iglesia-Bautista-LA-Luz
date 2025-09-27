/**
 * Configuração avançada de cache para Jest
 * Este arquivo contém estratégias de cache otimizadas para melhorar a performance dos testes
 */

const path = require('path');
const fs = require('fs');

// Configurações de cache
const cacheConfig = {
  // Diretório de cache
  cacheDirectory: path.join(process.cwd(), '.jest-cache'),
  
  // Configurações de limpeza de cache
  cacheCleanup: {
    // Limpa cache a cada 7 dias
    maxAge: 7 * 24 * 60 * 60 * 1000,
    // Limpa cache quando excede 500MB
    maxSize: 500 * 1024 * 1024,
    // Limpa cache quando excede 1000 arquivos
    maxFiles: 1000,
  },
  
  // Configurações de cache por tipo de arquivo
  fileTypeCache: {
    '.ts': { ttl: 24 * 60 * 60 * 1000 }, // 24 horas
    '.tsx': { ttl: 24 * 60 * 60 * 1000 }, // 24 horas
    '.js': { ttl: 12 * 60 * 60 * 1000 }, // 12 horas
    '.jsx': { ttl: 12 * 60 * 60 * 1000 }, // 12 horas
    '.json': { ttl: 7 * 24 * 60 * 60 * 1000 }, // 7 dias
  },
  
  // Configurações de cache de transformação
  transformCache: {
    babel: {
      enabled: true,
      ttl: 24 * 60 * 60 * 1000, // 24 horas
      compression: false, // Desabilitado para velocidade
    },
    typescript: {
      enabled: true,
      ttl: 12 * 60 * 60 * 1000, // 12 horas
      isolatedModules: true,
    },
  },
  
  // Configurações de cache de módulos
  moduleCache: {
    nodeModules: {
      enabled: true,
      ttl: 7 * 24 * 60 * 60 * 1000, // 7 dias
      exclude: ['@testing-library', 'jest'],
    },
    srcModules: {
      enabled: true,
      ttl: 2 * 60 * 60 * 1000, // 2 horas
    },
  },
};

/**
 * Limpa o cache do Jest baseado nas configurações
 */
function cleanupCache() {
  const cacheDir = cacheConfig.cacheDirectory;
  
  if (!fs.existsSync(cacheDir)) {
    return;
  }
  
  const now = Date.now();
  let totalSize = 0;
  let fileCount = 0;
  
  function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        processDirectory(filePath);
      } else {
        fileCount++;
        totalSize += stats.size;
        
        // Remove arquivos antigos
        if (now - stats.mtime.getTime() > cacheConfig.cacheCleanup.maxAge) {
          fs.unlinkSync(filePath);
          console.log(`Cache limpo: ${filePath}`);
        }
      }
    });
  }
  
  processDirectory(cacheDir);
  
  // Remove diretórios vazios
  function removeEmptyDirectories(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        removeEmptyDirectories(filePath);
        if (fs.readdirSync(filePath).length === 0) {
          fs.rmdirSync(filePath);
        }
      }
    });
  }
  
  removeEmptyDirectories(cacheDir);
  
  console.log(`Cache cleanup concluído: ${fileCount} arquivos, ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
}

/**
 * Verifica se o cache está dentro dos limites
 */
function checkCacheHealth() {
  const cacheDir = cacheConfig.cacheDirectory;
  
  if (!fs.existsSync(cacheDir)) {
    return { healthy: true, size: 0, files: 0 };
  }
  
  let totalSize = 0;
  let fileCount = 0;
  
  function calculateSize(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        calculateSize(filePath);
      } else {
        fileCount++;
        totalSize += stats.size;
      }
    });
  }
  
  calculateSize(cacheDir);
  
  const sizeMB = totalSize / 1024 / 1024;
  const healthy = totalSize < cacheConfig.cacheCleanup.maxSize && 
                  fileCount < cacheConfig.cacheCleanup.maxFiles;
  
  return {
    healthy,
    size: sizeMB,
    files: fileCount,
    maxSize: cacheConfig.cacheCleanup.maxSize / 1024 / 1024,
    maxFiles: cacheConfig.cacheCleanup.maxFiles,
  };
}

/**
 * Otimiza o cache para o ambiente atual
 */
function optimizeCache() {
  const isCI = process.env.CI === 'true';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isCI) {
    // Em CI, cache mais agressivo
    cacheConfig.transformCache.babel.ttl = 60 * 60 * 1000; // 1 hora
    cacheConfig.transformCache.typescript.ttl = 30 * 60 * 1000; // 30 minutos
    cacheConfig.moduleCache.srcModules.ttl = 60 * 60 * 1000; // 1 hora
  } else if (isDevelopment) {
    // Em desenvolvimento, cache mais conservador
    cacheConfig.transformCache.babel.ttl = 2 * 60 * 60 * 1000; // 2 horas
    cacheConfig.transformCache.typescript.ttl = 60 * 60 * 1000; // 1 hora
    cacheConfig.moduleCache.srcModules.ttl = 30 * 60 * 1000; // 30 minutos
  }
  
  return cacheConfig;
}

module.exports = {
  cacheConfig,
  cleanupCache,
  checkCacheHealth,
  optimizeCache,
};
