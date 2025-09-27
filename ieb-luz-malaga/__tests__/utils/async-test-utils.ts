// ============================================================================
// UTILITÁRIOS PARA TESTES ASSÍNCRONOS - OTIMIZADOS
// ============================================================================

/**
 * Aguarda uma condição ser verdadeira com timeout customizado
 * @param {Function} condition - Função que retorna boolean ou Promise<boolean>
 * @param {Object} options - Opções de timeout e intervalo
 * @returns {Promise} Promise que resolve quando a condição é verdadeira
 */
export const waitForCondition = async (condition, options = {}) => {
  const {
    timeout = process.env.CI ? 30000 : 15000, // Usar novos timeouts otimizados
    interval = 50, // Reduzido para melhor responsividade
    message = 'Condition not met within timeout'
  } = options;

  const startTime = Date.now();
  
  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        const result = await condition();
        if (result) {
          resolve(result);
        } else if (Date.now() - startTime >= timeout) {
          reject(new Error(`${message} (${timeout}ms)`));
        } else {
          setTimeout(check, interval);
        }
      } catch (error) {
        if (Date.now() - startTime >= timeout) {
          reject(new Error(`${message}: ${error.message}`));
        } else {
          setTimeout(check, interval);
        }
      }
    };
    
    check();
  });
};

/**
 * Aguarda um elemento aparecer no DOM
 * @param {Function} getElement - Função que retorna o elemento
 * @param {Object} options - Opções de timeout
 * @returns {Promise<Element>} Promise que resolve com o elemento
 */
export const waitForElement = async (getElement, options = {}) => {
  return waitForCondition(
    () => {
      const element = getElement();
      return element && element.isConnected;
    },
    {
      message: 'Element not found in DOM',
      ...options
    }
  );
};

/**
 * Aguarda um elemento desaparecer do DOM
 * @param {Function} getElement - Função que retorna o elemento
 * @param {Object} options - Opções de timeout
 * @returns {Promise<void>} Promise que resolve quando o elemento desaparece
 */
export const waitForElementToDisappear = async (getElement, options = {}) => {
  return waitForCondition(
    () => {
      const element = getElement();
      return !element || !element.isConnected;
    },
    {
      message: 'Element still present in DOM',
      ...options
    }
  );
};

/**
 * Aguarda uma função async completar com timeout
 * @param {Function} asyncFunction - Função assíncrona para executar
 * @param {Object} options - Opções de timeout
 * @returns {Promise} Promise que resolve com o resultado da função
 */
export const waitForAsyncFunction = async (asyncFunction, options = {}) => {
  const {
    timeout = process.env.CI ? 30000 : 15000, // Timeouts já otimizados
    message = 'Async function timed out'
  } = options;

  return Promise.race([
    asyncFunction(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error(message)), timeout)
    )
  ]);
};

/**
 * Simula delay controlado para testes
 * @param {number} ms - Milissegundos para aguardar
 * @returns {Promise<void>} Promise que resolve após o delay
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Executa uma função com retry automático
 * @param {Function} fn - Função para executar
 * @param {Object} options - Opções de retry
 * @returns {Promise} Promise que resolve com o resultado
 */
export const retryAsync = async (fn, options = {}) => {
  const {
    retries = 3,
    delay: delayMs = 1000,
    backoff = 1.5,
    timeout = process.env.CI ? 60000 : 30000
  } = options;

  let lastError;
  let currentDelay = delayMs;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await Promise.race([
        fn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Function timeout')), timeout)
        )
      ]);
    } catch (error) {
      lastError = error;
      
      if (attempt === retries) {
        throw lastError;
      }
      
      await delay(currentDelay);
      currentDelay *= backoff;
    }
  }
};

/**
 * Limpa todos os timers e promises pendentes
 * Útil para cleanup entre testes
 */
export const clearAllAsync = () => {
  // Limpa timers
  jest.clearAllTimers();
  
  // Limpa requests ativos se disponível
  if (global.clearActiveRequests) {
    global.clearActiveRequests();
  }
  
  // Limpa mocks
  jest.clearAllMocks();
};

/**
 * Configura timeout específico para um teste
 * @param {number} timeout - Timeout em milissegundos
 * @param {Function} testFn - Função do teste
 * @returns {Function} Função do teste com timeout configurado
 */
export const withTimeout = (timeout, testFn) => {
  return async (...args) => {
    const originalTimeout = jest.getTimeout();
    jest.setTimeout(timeout);
    
    try {
      return await testFn(...args);
    } finally {
      jest.setTimeout(originalTimeout);
    }
  };
};

/**
 * Mock de Promise que pode ser resolvida/rejeitada externamente
 * Útil para testes que precisam controlar timing de promises
 */
export class ControllablePromise {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
  
  then(onFulfilled, onRejected) {
    return this.promise.then(onFulfilled, onRejected);
  }
  
  catch(onRejected) {
    return this.promise.catch(onRejected);
  }
  
  finally(onFinally) {
    return this.promise.finally(onFinally);
  }
}

/**
 * Cria um mock de função assíncrona com controle de timing
 * @param {*} returnValue - Valor a ser retornado
 * @param {Object} options - Opções de timing
 * @returns {Function} Mock function com controle de timing
 */
export const createAsyncMock = (returnValue, options = {}) => {
  const { delay: delayMs = 0, shouldReject = false } = options;
  
  return jest.fn().mockImplementation(async (...args) => {
    if (delayMs > 0) {
      await delay(delayMs);
    }
    
    if (shouldReject) {
      throw new Error('Mock async function rejected');
    }
    
    return typeof returnValue === 'function' ? returnValue(...args) : returnValue;
  });
};

// Exporta utilitários para uso global em testes
if (typeof global !== 'undefined') {
  global.waitForCondition = waitForCondition;
  global.waitForElement = waitForElement;
  global.waitForElementToDisappear = waitForElementToDisappear;
  global.waitForAsyncFunction = waitForAsyncFunction;
  global.delay = delay;
  global.retryAsync = retryAsync;
  global.clearAllAsync = clearAllAsync;
  global.withTimeout = withTimeout;
  global.ControllablePromise = ControllablePromise;
  global.createAsyncMock = createAsyncMock;
}

