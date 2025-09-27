// ============================================================================
// EXEMPLO DE TESTE ASSÍNCRONO OTIMIZADO - BOAS PRÁTICAS
// ============================================================================

import { render, screen, waitFor } from '@testing-library/react';
import { waitForCondition, waitForElement, delay, withTimeout } from '../utils/async-test-utils';

// Exemplo de componente que usa operações assíncronas
const AsyncComponent = ({ onDataLoad, isLoading }) => {
  const [data, setData] = React.useState(null);
  
  React.useEffect(() => {
    const loadData = async () => {
      // Simula carregamento de dados
      await delay(1000);
      const result = { id: 1, name: 'Test Data' };
      setData(result);
      onDataLoad?.(result);
    };
    
    loadData();
  }, [onDataLoad]);
  
  if (isLoading) return <div data-testid="loading">Loading...</div>;
  
  return (
    <div>
      {data ? (
        <div data-testid="data">{data.name}</div>
      ) : (
        <div data-testid="no-data">No data available</div>
      )}
    </div>
  );
};

describe('AsyncComponent - Testes Otimizados', () => {
  beforeEach(() => {
    // Limpa todos os timers e mocks antes de cada teste
    jest.clearAllTimers();
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    // Restaura timers reais após cada teste
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  // ✅ BOM: Teste com timeout específico e controle de timing
  it('carrega dados com sucesso', async () => {
    const onDataLoad = jest.fn();
    
    render(<AsyncComponent onDataLoad={onDataLoad} isLoading={false} />);
    
    // Aguarda o elemento de dados aparecer com timeout específico
    await waitForElement(
      () => screen.queryByTestId('data'),
      { timeout: 2000, message: 'Data should load within 2 seconds' }
    );
    
    expect(screen.getByTestId('data')).toHaveTextContent('Test Data');
    expect(onDataLoad).toHaveBeenCalledWith({ id: 1, name: 'Test Data' });
  });

  // ✅ BOM: Teste com controle manual de timers
  it('mostra loading state durante carregamento', async () => {
    render(<AsyncComponent isLoading={true} />);
    
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByTestId('data')).not.toBeInTheDocument();
  });

  // ✅ BOM: Teste com retry automático para operações instáveis
  it('lida com falhas temporárias de carregamento', async () => {
    const unstableLoadData = jest.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ id: 1, name: 'Test Data' });
    
    // Mock do componente com função instável
    const UnstableComponent = () => {
      const [data, setData] = React.useState(null);
      
      React.useEffect(() => {
        const loadData = async () => {
          try {
            const result = await unstableLoadData();
            setData(result);
          } catch (error) {
            // Retry após delay
            setTimeout(() => {
              unstableLoadData().then(setData);
            }, 100);
          }
        };
        
        loadData();
      }, []);
      
      return data ? (
        <div data-testid="data">{data.name}</div>
      ) : (
        <div data-testid="loading">Loading...</div>
      );
    };
    
    render(<UnstableComponent />);
    
    // Aguarda o sucesso após o retry
    await waitForElement(
      () => screen.queryByTestId('data'),
      { timeout: 3000 }
    );
    
    expect(screen.getByTestId('data')).toHaveTextContent('Test Data');
    expect(unstableLoadData).toHaveBeenCalledTimes(2);
  });

  // ✅ BOM: Teste com timeout customizado usando withTimeout
  it('falha se carregamento demora muito', async () => {
    const slowLoadData = jest.fn().mockImplementation(async () => {
      await delay(5000); // 5 segundos - muito lento
      return { id: 1, name: 'Slow Data' };
    });
    
    const SlowComponent = () => {
      const [data, setData] = React.useState(null);
      
      React.useEffect(() => {
        slowLoadData().then(setData);
      }, []);
      
      return data ? (
        <div data-testid="data">{data.name}</div>
      ) : (
        <div data-testid="loading">Loading...</div>
      );
    };
    
    // Teste com timeout de 2 segundos (deve falhar)
    const testWithTimeout = withTimeout(2000, async () => {
      render(<SlowComponent />);
      
      await waitForElement(
        () => screen.queryByTestId('data'),
        { timeout: 1000 } // Timeout menor que o delay
      );
    });
    
    await expect(testWithTimeout()).rejects.toThrow();
  });

  // ✅ BOM: Teste de cleanup adequado
  it('limpa recursos ao desmontar', async () => {
    const cleanupSpy = jest.fn();
    const abortController = new AbortController();
    
    const ComponentWithCleanup = () => {
      React.useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('/api/data', {
              signal: abortController.signal
            });
            return response.json();
          } catch (error) {
            if (error.name === 'AbortError') {
              cleanupSpy();
            }
          }
        };
        
        fetchData();
        
        return () => {
          abortController.abort();
        };
      }, []);
      
      return <div>Component</div>;
    };
    
    const { unmount } = render(<ComponentWithCleanup />);
    
    // Desmonta o componente
    unmount();
    
    // Aguarda o cleanup ser executado
    await waitForCondition(
      () => cleanupSpy.mock.calls.length > 0,
      { timeout: 1000 }
    );
    
    expect(cleanupSpy).toHaveBeenCalled();
  });

  // ✅ BOM: Teste com múltiplas operações assíncronas
  it('coordena múltiplas operações assíncronas', async () => {
    const loadUserData = jest.fn().mockResolvedValue({ id: 1, name: 'User' });
    const loadSettings = jest.fn().mockResolvedValue({ theme: 'dark' });
    
    const MultiAsyncComponent = () => {
      const [user, setUser] = React.useState(null);
      const [settings, setSettings] = React.useState(null);
      const [isReady, setIsReady] = React.useState(false);
      
      React.useEffect(() => {
        const loadAllData = async () => {
          const [userData, settingsData] = await Promise.all([
            loadUserData(),
            loadSettings()
          ]);
          
          setUser(userData);
          setSettings(settingsData);
          setIsReady(true);
        };
        
        loadAllData();
      }, []);
      
      if (!isReady) return <div data-testid="loading">Loading...</div>;
      
      return (
        <div>
          <div data-testid="user">{user.name}</div>
          <div data-testid="settings">{settings.theme}</div>
        </div>
      );
    };
    
    render(<MultiAsyncComponent />);
    
    // Aguarda ambos os dados carregarem
    await waitForElement(
      () => screen.queryByTestId('user'),
      { timeout: 2000 }
    );
    
    await waitForElement(
      () => screen.queryByTestId('settings'),
      { timeout: 2000 }
    );
    
    expect(screen.getByTestId('user')).toHaveTextContent('User');
    expect(screen.getByTestId('settings')).toHaveTextContent('dark');
    expect(loadUserData).toHaveBeenCalledTimes(1);
    expect(loadSettings).toHaveBeenCalledTimes(1);
  });
});

// ============================================================================
// PADRÕES A EVITAR EM TESTES ASSÍNCRONOS
// ============================================================================

describe('Padrões Problemáticos - NÃO FAZER', () => {
  // ❌ RUIM: Usar setTimeout sem controle
  it('NÃO FAZER: setTimeout sem controle', async () => {
    const Component = () => {
      const [data, setData] = React.useState(null);
      
      React.useEffect(() => {
        setTimeout(() => {
          setData('data');
        }, 1000);
      }, []);
      
      return <div>{data}</div>;
    };
    
    render(<Component />);
    
    // ❌ Problema: Pode falhar se o componente demorar mais que 1s
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    expect(screen.getByText('data')).toBeInTheDocument();
  });

  // ❌ RUIM: Aguardar tempo fixo sem verificar condição
  it('NÃO FAZER: aguardar tempo fixo', async () => {
    const Component = () => {
      const [data, setData] = React.useState(null);
      
      React.useEffect(() => {
        fetch('/api/data').then(res => res.json()).then(setData);
      }, []);
      
      return <div>{data}</div>;
    };
    
    render(<Component />);
    
    // ❌ Problema: Pode ser muito rápido ou muito lento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    expect(screen.getByText('data')).toBeInTheDocument();
  });

  // ❌ RUIM: Não limpar recursos
  it('NÃO FAZER: não limpar recursos', async () => {
    const Component = () => {
      const [data, setData] = React.useState(null);
      
      React.useEffect(() => {
        const interval = setInterval(() => {
          setData(Date.now());
        }, 100);
        
        // ❌ Problema: Não limpa o interval
        // return () => clearInterval(interval);
      }, []);
      
      return <div>{data}</div>;
    };
    
    const { unmount } = render(<Component />);
    
    // ❌ Problema: Interval continua rodando após desmontar
    unmount();
  });
});

