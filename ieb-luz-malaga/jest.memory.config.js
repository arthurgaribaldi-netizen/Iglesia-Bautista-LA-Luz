/**
 * Configuração de Otimização de Memória para Jest
 * Este arquivo contém configurações avançadas para otimizar o uso de memória nos testes
 */

const os = require('os');

// Configurações de memória baseadas no sistema
const systemMemory = os.totalmem();
const systemCpus = os.cpus().length;
const availableMemory = os.freemem();

// Configurações de memória por ambiente
const memoryConfig = {
  // Configurações base do sistema
  system: {
    totalMemory: systemMemory,
    availableMemory: availableMemory,
    cpuCount: systemCpus,
    memoryPerCPU: Math.floor(systemMemory / systemCpus),
  },
  
  // Configurações de workers
  workers: {
    // Configurações por ambiente
    development: {
      maxWorkers: Math.min(systemCpus, 8), // Máximo 8 workers em desenvolvimento
      workerMemoryLimit: '512MB',
      workerIdleMemoryLimit: '256MB',
      workerThreads: true,
      maxConcurrency: 5,
    },
    
    ci: {
      maxWorkers: Math.min(Math.floor(systemCpus * 0.5), 4), // 50% dos cores, máximo 4
      workerMemoryLimit: '256MB',
      workerIdleMemoryLimit: '128MB',
      workerThreads: true,
      maxConcurrency: 3,
    },
    
    production: {
      maxWorkers: Math.min(Math.floor(systemCpus * 0.75), 6), // 75% dos cores, máximo 6
      workerMemoryLimit: '1GB',
      workerIdleMemoryLimit: '512MB',
      workerThreads: true,
      maxConcurrency: 4,
    },
  },
  
  // Configurações de garbage collection
  garbageCollection: {
    // Força GC após cada teste
    forceGCAfterTests: true,
    
    // Limpa mocks após cada teste
    clearMocksAfterTests: true,
    
    // Restaura mocks após cada teste
    restoreMocksAfterTests: true,
    
    // Configurações de timeout para cleanup
    cleanupTimeout: 5000,
  },
  
  // Configurações de transformação
  transform: {
    // Cache de transformação
    cacheDirectory: true,
    cacheCompression: false, // Desabilitado para velocidade
    
    // Configurações de Babel
    babel: {
      cacheDirectory: true,
      compact: false,
      minified: false,
    },
    
    // Configurações de TypeScript
    typescript: {
      isolatedModules: true,
      skipLibCheck: true,
      incremental: true,
    },
  },
  
  // Configurações de módulos
  modules: {
    // Cache de módulos
    cacheModules: true,
    
    // Configurações de resolução
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    
    // Configurações de transformação de módulos
    transformIgnorePatterns: [
      'node_modules/(?!(.*\\.mjs$|@testing-library|@babel/runtime))',
    ],
  },
  
  // Configurações de timeout
  timeouts: {
    // Timeout por tipo de teste
    unit: 10000,      // 10 segundos
    integration: 20000, // 20 segundos
    e2e: 60000,       // 60 segundos
    
    // Timeout por ambiente
    development: 30000, // 30 segundos
    ci: 20000,         // 20 segundos
    production: 15000,  // 15 segundos
  },
  
  // Configurações de paralelização
  parallelization: {
    // Configurações por tipo de teste
    unit: {
      parallel: true,
      maxConcurrency: 10,
    },
    
    integration: {
      parallel: true,
      maxConcurrency: 5,
    },
    
    e2e: {
      parallel: false,
      maxConcurrency: 1,
    },
  },
};

/**
 * Obtém configurações de memória para o ambiente atual
 */
function getMemoryConfig(environment = 'development') {
  const env = environment.toLowerCase();
  const workerConfig = memoryConfig.workers[env] || memoryConfig.workers.development;
  
  return {
    maxWorkers: workerConfig.maxWorkers,
    workerIdleMemoryLimit: workerConfig.workerIdleMemoryLimit,
    workerThreads: workerConfig.workerThreads,
    maxConcurrency: workerConfig.maxConcurrency,
    testTimeout: memoryConfig.timeouts[env] || memoryConfig.timeouts.development,
  };
}

/**
 * Obtém configurações de memória baseadas no tamanho do projeto
 */
function getMemoryConfigByProjectSize(testFileCount) {
  let config;
  
  if (testFileCount < 50) {
    // Projeto pequeno
    config = {
      maxWorkers: Math.min(systemCpus, 4),
      workerIdleMemoryLimit: '256MB',
      maxConcurrency: 3,
    };
  } else if (testFileCount < 200) {
    // Projeto médio
    config = {
      maxWorkers: Math.min(systemCpus, 6),
      workerIdleMemoryLimit: '512MB',
      maxConcurrency: 5,
    };
  } else {
    // Projeto grande
    config = {
      maxWorkers: Math.min(systemCpus, 8),
      workerIdleMemoryLimit: '1GB',
      maxConcurrency: 7,
    };
  }
  
  return config;
}

/**
 * Obtém configurações de memória baseadas no uso atual do sistema
 */
function getMemoryConfigBySystemLoad() {
  const memoryUsage = process.memoryUsage();
  const memoryUsagePercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
  
  let config;
  
  if (memoryUsagePercent > 80) {
    // Sistema com alta carga de memória
    config = {
      maxWorkers: Math.max(1, Math.floor(systemCpus * 0.25)),
      workerIdleMemoryLimit: '128MB',
      maxConcurrency: 2,
    };
  } else if (memoryUsagePercent > 60) {
    // Sistema com média carga de memória
    config = {
      maxWorkers: Math.max(2, Math.floor(systemCpus * 0.5)),
      workerIdleMemoryLimit: '256MB',
      maxConcurrency: 3,
    };
  } else {
    // Sistema com baixa carga de memória
    config = {
      maxWorkers: Math.floor(systemCpus * 0.75),
      workerIdleMemoryLimit: '512MB',
      maxConcurrency: 5,
    };
  }
  
  return config;
}

/**
 * Otimiza configurações de memória automaticamente
 */
function optimizeMemoryConfig() {
  const environment = process.env.NODE_ENV || 'development';
  const isCI = process.env.CI === 'true';
  
  let config;
  
  if (isCI) {
    config = getMemoryConfig('ci');
  } else {
    config = getMemoryConfig(environment);
  }
  
  // Ajusta baseado no uso atual do sistema
  const systemConfig = getMemoryConfigBySystemLoad();
  
  // Usa a configuração mais conservadora
  config.maxWorkers = Math.min(config.maxWorkers, systemConfig.maxWorkers);
  config.maxConcurrency = Math.min(config.maxConcurrency, systemConfig.maxConcurrency);
  
  return config;
}

/**
 * Monitora o uso de memória durante os testes
 */
function monitorMemoryUsage() {
  const initialMemory = process.memoryUsage();
  
  return {
    start: () => {
      const startMemory = process.memoryUsage();
      return {
        heapUsed: startMemory.heapUsed,
        heapTotal: startMemory.heapTotal,
        external: startMemory.external,
        rss: startMemory.rss,
        timestamp: Date.now(),
      };
    },
    
    end: (startMemory) => {
      const endMemory = process.memoryUsage();
      return {
        heapUsed: endMemory.heapUsed - startMemory.heapUsed,
        heapTotal: endMemory.heapTotal - startMemory.heapTotal,
        external: endMemory.external - startMemory.external,
        rss: endMemory.rss - startMemory.rss,
        duration: Date.now() - startMemory.timestamp,
      };
    },
    
    getCurrent: () => {
      const currentMemory = process.memoryUsage();
      return {
        heapUsed: currentMemory.heapUsed,
        heapTotal: currentMemory.heapTotal,
        external: currentMemory.external,
        rss: currentMemory.rss,
        heapUsedPercent: (currentMemory.heapUsed / currentMemory.heapTotal) * 100,
      };
    },
  };
}

module.exports = {
  memoryConfig,
  getMemoryConfig,
  getMemoryConfigByProjectSize,
  getMemoryConfigBySystemLoad,
  optimizeMemoryConfig,
  monitorMemoryUsage,
};
