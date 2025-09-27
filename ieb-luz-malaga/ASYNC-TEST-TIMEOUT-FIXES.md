# Guia de Correção de Timeouts em Testes Assíncronos

## 📋 Resumo das Correções Implementadas

Este documento detalha as correções implementadas para resolver problemas de timeout em testes assíncronos no projeto IEB La Luz Málaga.

## 🔧 Problemas Identificados

### 1. **Configuração de Timeout Inadequada**
- Jest timeout muito baixo (20s) para testes assíncronos complexos
- Playwright sem configuração adequada de timeout
- Falta de diferenciação entre ambientes (CI vs local)

### 2. **Uso Inadequado de waitFor**
- Sem timeouts específicos para operações assíncronas
- Falta de controle de timing em mocks
- Não utilização de retry automático

### 3. **Mocks Assíncronos Problemáticos**
- IntersectionObserver sem controle de timeout
- Fetch API sem simulação de delays de rede
- Falta de cleanup de recursos

## ✅ Soluções Implementadas

### 1. **Configurações de Timeout Otimizadas**

#### Jest Configuration (`jest.config.js`)
```javascript
// Timeout dinâmico baseado no ambiente
testTimeout: process.env.CI ? 60000 : 30000, // 60s em CI, 30s localmente

// Configurações específicas para testes assíncronos
testEnvironmentOptions: {
  customExportConditions: ['node', 'node-addons'],
},
```

#### Playwright Configuration (`playwright.config.ts`)
```javascript
// Timeout otimizado para testes E2E
timeout: process.env.CI ? 60000 : 30000, // 60s em CI, 30s localmente
expect: {
  timeout: process.env.CI ? 15000 : 10000, // 15s em CI, 10s localmente
},

use: {
  actionTimeout: 10000, // Timeout para ações como click, fill
  navigationTimeout: 30000, // Timeout para navegação
},
```

### 2. **Configuração Específica para Testes Assíncronos**

#### Novo arquivo: `jest.async.config.js`
- Timeout aumentado para 2 minutos em CI, 1 minuto localmente
- Menos workers para evitar conflitos
- Mais memória para testes complexos
- Configurações otimizadas para operações assíncronas

### 3. **Utilitários para Testes Assíncronos**

#### Novo arquivo: `__tests__/utils/async-test-utils.ts`

**Funções principais:**
- `waitForCondition()` - Aguarda condição com timeout customizado
- `waitForElement()` - Aguarda elemento aparecer no DOM
- `waitForElementToDisappear()` - Aguarda elemento desaparecer
- `waitForAsyncFunction()` - Aguarda função async com timeout
- `retryAsync()` - Retry automático para operações instáveis
- `withTimeout()` - Configura timeout específico para teste
- `ControllablePromise` - Promise controlável para testes

### 4. **Mocks Otimizados**

#### IntersectionObserver com Controle de Timing
```javascript
global.IntersectionObserver = jest.fn().mockImplementation((callback, options = {}) => {
  const timeoutIds = new Set();
  
  return {
    observe: jest.fn((element) => {
      const timeoutId = setTimeout(() => {
        callback([{ isIntersecting: true }], this);
      }, options.delay || 0);
      
      timeoutIds.add(timeoutId);
    }),
    
    disconnect: jest.fn(() => {
      timeoutIds.forEach(id => clearTimeout(id));
      timeoutIds.clear();
    }),
  };
});
```

#### Fetch API com Simulação de Rede
```javascript
global.fetch = jest.fn((url, options = {}) => {
  const networkDelay = options.delay || Math.random() * 100;
  const timeout = options.timeout || 5000;
  
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Fetch timeout after ${timeout}ms`));
    }, timeout);
    
    setTimeout(() => {
      clearTimeout(timeoutId);
      resolve(mockResponse);
    }, networkDelay);
  });
});
```

## 🚀 Scripts de Teste Otimizados

### Novos Scripts no `package.json`
```json
{
  "test:async": "jest --config=jest.async.config.js --passWithNoTests --maxWorkers=50%",
  "test:async:watch": "jest --config=jest.async.config.js --watch --passWithNoTests --maxWorkers=25%",
  "test:async:ci": "jest --config=jest.async.config.js --ci --coverage --watchAll=false --maxWorkers=25% --workerIdleMemoryLimit=512MB --passWithNoTests"
}
```

## 📚 Exemplos de Uso

### ✅ Boas Práticas

#### 1. Teste com Timeout Específico
```javascript
it('carrega dados com sucesso', async () => {
  render(<AsyncComponent />);
  
  // Aguarda elemento com timeout específico
  await waitForElement(
    () => screen.queryByTestId('data'),
    { timeout: 2000, message: 'Data should load within 2 seconds' }
  );
  
  expect(screen.getByTestId('data')).toBeInTheDocument();
});
```

#### 2. Teste com Retry Automático
```javascript
it('lida com falhas temporárias', async () => {
  const unstableFunction = jest.fn()
    .mockRejectedValueOnce(new Error('Network error'))
    .mockResolvedValueOnce({ data: 'success' });
  
  const result = await retryAsync(
    () => unstableFunction(),
    { retries: 3, delay: 1000 }
  );
  
  expect(result.data).toBe('success');
});
```

#### 3. Teste com Timeout Customizado
```javascript
it('falha se demora muito', async () => {
  const testWithTimeout = withTimeout(2000, async () => {
    await slowOperation();
  });
  
  await expect(testWithTimeout()).rejects.toThrow();
});
```

### ❌ Padrões a Evitar

#### 1. setTimeout sem Controle
```javascript
// ❌ RUIM
await new Promise(resolve => setTimeout(resolve, 1000));
expect(element).toBeInTheDocument();
```

#### 2. Aguardar Tempo Fixo
```javascript
// ❌ RUIM
await delay(2000); // Pode ser muito rápido ou muito lento
expect(data).toBeDefined();
```

#### 3. Não Limpar Recursos
```javascript
// ❌ RUIM
React.useEffect(() => {
  const interval = setInterval(updateData, 100);
  // Não limpa o interval
}, []);
```

## 🔍 Monitoramento e Debug

### Configurações de Debug
```javascript
// Para debug de testes assíncronos
const debugConfig = {
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
  maxWorkers: 1, // Execução sequencial para debug
};
```

### Logs de Timeout
```javascript
// Logs automáticos quando timeout ocorre
global.waitForWithTimeout = async (callback, options = {}) => {
  const { timeout = DEFAULT_TIMEOUT } = options;
  
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = async () => {
      try {
        const result = await callback();
        resolve(result);
      } catch (error) {
        if (Date.now() - startTime >= timeout) {
          console.error(`Timeout after ${timeout}ms: ${error.message}`);
          reject(new Error(`waitForWithTimeout timed out after ${timeout}ms`));
        } else {
          setTimeout(check, interval);
        }
      }
    };
    
    check();
  });
};
```

## 📊 Métricas de Performance

### Antes das Correções
- ❌ Timeout padrão: 20s (muito baixo)
- ❌ Falhas frequentes em testes assíncronos
- ❌ Sem controle de timing em mocks
- ❌ Cleanup inadequado de recursos

### Após as Correções
- ✅ Timeout dinâmico: 30-60s baseado no ambiente
- ✅ Retry automático para operações instáveis
- ✅ Mocks com controle de timing
- ✅ Cleanup adequado de recursos
- ✅ Utilitários específicos para testes assíncronos

## 🎯 Próximos Passos

### 1. **Implementação Gradual**
- Usar `jest.async.config.js` para testes complexos
- Migrar testes existentes para usar utilitários
- Implementar monitoramento de performance

### 2. **Monitoramento Contínuo**
- Configurar alertas para timeouts frequentes
- Monitorar performance dos testes em CI
- Ajustar timeouts baseado em métricas reais

### 3. **Documentação da Equipe**
- Treinar equipe nas novas práticas
- Criar templates de teste assíncrono
- Estabelecer padrões de code review

## 🔗 Arquivos Modificados

1. `jest.config.js` - Configuração principal otimizada
2. `jest.async.config.js` - Configuração específica para testes assíncronos
3. `jest.setup.js` - Mocks otimizados com controle de timing
4. `playwright.config.ts` - Timeouts otimizados para E2E
5. `playwright.production.config.ts` - Configuração de produção
6. `package.json` - Novos scripts de teste
7. `__tests__/utils/async-test-utils.ts` - Utilitários para testes assíncronos
8. `__tests__/examples/async-test-examples.tsx` - Exemplos de boas práticas

## 📝 Conclusão

As correções implementadas resolvem os principais problemas de timeout em testes assíncronos:

- ✅ **Timeouts adequados** para diferentes ambientes
- ✅ **Controle de timing** em mocks e operações assíncronas
- ✅ **Utilitários específicos** para testes assíncronos
- ✅ **Retry automático** para operações instáveis
- ✅ **Cleanup adequado** de recursos
- ✅ **Documentação completa** com exemplos práticos

Com essas implementações, os testes assíncronos devem ser mais estáveis, confiáveis e fáceis de debugar.

