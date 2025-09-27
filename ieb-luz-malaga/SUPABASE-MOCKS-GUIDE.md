# Guia de Mocks do Supabase

Este guia explica como usar os mocks do Supabase configurados no projeto para testes.

## Configuração

Os mocks do Supabase estão configurados em:
- `__mocks__/@supabase/supabase-js.ts` - Mock da biblioteca do Supabase
- `__mocks__/@/lib/supabase.ts` - Mock do cliente Supabase do projeto
- `jest.setup.js` - Configuração global dos mocks
- `__tests__/utils/supabase-mock-utils.ts` - Utilitários para facilitar o uso

## Como Usar

### 1. Importar os utilitários

```typescript
import { 
  mockSupabaseSuccess, 
  mockSupabaseError, 
  mockSupabaseEmpty, 
  testData,
  expectSupabaseCall 
} from '../utils/supabase-mock-utils'
```

### 2. Configurar mocks de sucesso

```typescript
// Mock com dados específicos
mockSupabaseSuccess(testData.sermons)

// Mock com dados customizados
mockSupabaseSuccess([
  {
    id: 1,
    title: 'Custom Sermon',
    date: '2025-01-01',
    description: 'Custom Description',
    video_url: 'https://youtube.com/watch?v=custom',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  }
])
```

### 3. Configurar mocks de erro

```typescript
// Mock com erro genérico
mockSupabaseError('Database connection failed')

// Mock com erro específico
mockSupabaseError('Row not found', 'PGRST116')
```

### 4. Configurar mocks de dados vazios

```typescript
// Mock retornando array vazio
mockSupabaseEmpty()
```

### 5. Verificar chamadas do Supabase

```typescript
// Verificar se uma tabela foi consultada
expectSupabaseCall('sermons', 'select')

// Verificar se uma operação foi chamada com parâmetros específicos
expectSupabaseCallWith('sermons', 'insert', { title: 'New Sermon' })
```

## Exemplo Completo

```typescript
import { GET } from '@/app/api/sermons/route'
import { NextRequest } from 'next/server'
import { 
  mockSupabaseSuccess, 
  mockSupabaseError, 
  testData 
} from '../utils/supabase-mock-utils'

describe('/api/sermons', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns sermons data', async () => {
    // Configurar mock com dados de teste
    mockSupabaseSuccess(testData.sermons)

    const request = new NextRequest('http://localhost:3000/api/sermons')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.sermons).toHaveLength(2)
  })

  it('handles database errors', async () => {
    // Configurar mock com erro
    mockSupabaseError('Database connection failed')

    const request = new NextRequest('http://localhost:3000/api/sermons')
    const response = await GET(request)
    
    expect(response.status).toBe(500)
  })
})
```

## Dados de Teste Disponíveis

O arquivo `supabase-mock-utils.ts` inclui dados de teste pré-definidos:

- `testData.sermons` - Array de sermões de teste
- `testData.events` - Array de eventos de teste
- `testData.churchInfo` - Informações da igreja de teste

## Funcionalidades dos Mocks

### Cliente Supabase (`supabase`)
- `from()` - Acesso a tabelas
- `auth` - Autenticação
- `storage` - Armazenamento de arquivos
- `realtime` - WebSockets em tempo real

### Cliente Admin (`supabaseAdmin`)
- `from()` - Acesso a tabelas com privilégios admin
- `auth.admin` - Operações administrativas de autenticação

### Operações de Tabela
- `select()` - Consultas
- `insert()` - Inserções
- `update()` - Atualizações
- `delete()` - Exclusões

## Limpeza de Mocks

Sempre limpe os mocks entre os testes:

```typescript
beforeEach(() => {
  jest.clearAllMocks()
})
```

Ou use a função utilitária:

```typescript
import { resetSupabaseMocks } from '../utils/supabase-mock-utils'

beforeEach(() => {
  resetSupabaseMocks()
})
```

## Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Executar testes específicos
npm test sermons.test.ts
```

## Troubleshooting

### Mock não está funcionando
1. Verifique se o arquivo está na pasta `__mocks__`
2. Verifique se o `jest.setup.js` está configurado corretamente
3. Verifique se o `jest.config.js` tem o `moduleNameMapper` correto

### Erro de importação
1. Verifique se o caminho do import está correto
2. Verifique se o arquivo `supabase-mock-utils.ts` existe

### Teste falhando
1. Verifique se o mock está configurado antes da chamada da função
2. Verifique se os dados do mock correspondem ao que a função espera
3. Use `console.log` para debugar os dados retornados
