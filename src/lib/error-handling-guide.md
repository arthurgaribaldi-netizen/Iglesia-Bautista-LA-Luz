# Guia de Tratamento de Erros - Sistema Padronizado

## Visão Geral

Este sistema padronizado de tratamento de erros foi implementado para melhorar a experiência do usuário (UX) ao fornecer mensagens consistentes, informativas e amigáveis em todo o sistema.

## Componentes Principais

### 1. Mensagens de Erro Padronizadas (`error-messages.ts`)

Centraliza todas as mensagens de erro, sucesso e validação do sistema.

```typescript
import { ERROR_MESSAGES, SUCCESS_MESSAGES, getErrorMessage } from '@/lib/error-messages'

// Usar mensagem de erro específica
const errorMsg = getErrorMessage('NETWORK_ERROR')

// Usar mensagem de sucesso
const successMsg = getErrorMessage('SAVED')
```

### 2. Sistema de Notificações (`notification-system.tsx`)

Substitui os `alert()` por notificações elegantes que não interrompem o fluxo do usuário.

```typescript
import { useToast } from '@/components/ui/notification-system'

function MyComponent() {
  const toast = useToast()

  const handleError = () => {
    toast.error('Erro de conexão', 'Não foi possível conectar ao servidor')
  }

  const handleSuccess = () => {
    toast.success('Sucesso', 'Dados salvos com sucesso')
  }
}
```

### 3. Hook de Tratamento de Erros (`use-error-handler.ts`)

Hook personalizado que simplifica o tratamento de erros em componentes.

```typescript
import { useErrorHandler } from '@/hooks/use-error-handler'

function MyComponent() {
  const { handleError, handleSuccess, executeWithErrorHandling } = useErrorHandler({
    context: 'USER_SAVE_ERROR'
  })

  const saveUser = async () => {
    await executeWithErrorHandling(
      async () => {
        const response = await fetch('/api/users', { method: 'POST' })
        if (!response.ok) {
          throw new Error('Falha ao salvar usuário')
        }
        return response.json()
      },
      'USER_SAVE_ERROR',
      'Não foi possível salvar o usuário'
    )
  }
}
```

## Como Usar

### 1. Em Componentes Funcionais

```typescript
'use client'

import { useErrorHandler } from '@/hooks/use-error-handler'
import { useToast } from '@/components/ui/notification-system'

export default function MyComponent() {
  const { handleError, handleSuccess } = useErrorHandler({
    context: 'MY_COMPONENT_ERROR'
  })
  const toast = useToast()

  const handleSubmit = async (data) => {
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        await handleError({ response }, 'Erro ao salvar dados')
        return
      }

      handleSuccess('Dados salvos com sucesso!')
    } catch (error) {
      handleError(error, 'Erro inesperado ao salvar')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Seu formulário aqui */}
    </form>
  )
}
```

### 2. Em APIs (Route Handlers)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getErrorMessageFromStatus } from '@/lib/error-messages'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validação
    if (!data.name) {
      return NextResponse.json(
        { success: false, message: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    // Processamento
    const result = await saveData(data)
    
    return NextResponse.json({
      success: true,
      message: 'Dados salvos com sucesso',
      data: result
    })
  } catch (error) {
    console.error('Erro na API:', error)
    
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
```

### 3. Validação de Formulários

```typescript
import { useFormErrorHandler, validationRules } from '@/hooks/use-error-handler'

function MyForm() {
  const { validateForm, validateField } = useFormErrorHandler()
  const [errors, setErrors] = useState({})

  const validationRules = {
    name: [validationRules.required],
    email: [validationRules.required, validationRules.email],
    age: [validationRules.number, validationRules.positiveNumber]
  }

  const handleSubmit = (data) => {
    if (!validateForm(data, validationRules)) {
      return // Erros já foram exibidos
    }

    // Continuar com o envio
  }
}
```

## Tipos de Mensagens

### Erros
- **validation**: Erros de validação de formulário
- **network**: Problemas de conexão
- **auth**: Problemas de autenticação
- **permission**: Problemas de permissão
- **notFound**: Recurso não encontrado
- **server**: Erros do servidor
- **upload**: Problemas com upload de arquivos
- **unknown**: Erros não categorizados

### Sucessos
- **saved**: Dados salvos
- **deleted**: Item excluído
- **updated**: Dados atualizados
- **created**: Item criado
- **uploaded**: Arquivo enviado

## Boas Práticas

### 1. Contexto Específico
Sempre forneça um contexto específico ao usar o `useErrorHandler`:

```typescript
const { handleError } = useErrorHandler({ 
  context: 'USER_DELETE_ERROR' 
})
```

### 2. Mensagens Amigáveis
Evite mensagens técnicas. Use linguagem clara e orientações:

```typescript
// ❌ Ruim
handleError(error, 'HTTP 500 Internal Server Error')

// ✅ Bom
handleError(error, 'Ocorreu um erro interno. Nossa equipe foi notificada.')
```

### 3. Ações Sugeridas
Sempre que possível, forneça uma ação que o usuário pode tomar:

```typescript
const errorMessage = {
  title: 'Arquivo muito grande',
  message: 'O arquivo excede o tamanho máximo permitido.',
  action: 'Escolher outro arquivo'
}
```

### 4. Logging para Desenvolvimento
Mantenha logs detalhados para debugging:

```typescript
try {
  await riskyOperation()
} catch (error) {
  console.error('Erro detalhado:', error)
  handleError(error, 'Mensagem amigável para o usuário')
}
```

## Migração de Código Existente

### Substituir `alert()`
```typescript
// ❌ Antes
alert('Erro ao salvar dados')

// ✅ Depois
toast.error('Erro', 'Erro ao salvar dados')
```

### Substituir `console.error()` em componentes
```typescript
// ❌ Antes
} catch (error) {
  console.error('Erro:', error)
}

// ✅ Depois
} catch (error) {
  handleError(error, 'Erro ao processar dados')
}
```

### Atualizar validações de formulário
```typescript
// ❌ Antes
if (!name) {
  setErrors({ name: 'Nome é obrigatório' })
}

// ✅ Depois
const validationRules = {
  name: [validationRules.required]
}
validateField(name, 'name', validationRules.name)
```

## Configuração do Provider

Certifique-se de que o `NotificationProvider` está configurado no layout raiz:

```typescript
// app/layout.tsx
import { NotificationProvider } from '@/components/ui/notification-system'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  )
}
```

## Exemplos Completos

Veja os arquivos atualizados para exemplos completos de implementação:
- `src/app/admin/configuracoes/page.tsx`
- `src/app/admin/contatos/page.tsx`
- `src/hooks/use-lazy-data.ts`
