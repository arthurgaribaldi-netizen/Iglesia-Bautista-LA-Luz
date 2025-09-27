'use client'

import { useCallback } from 'react'
import { useNotifications } from '@/components/ui/notification-system'
import { 
  ErrorMessage, 
  getErrorMessage, 
  getErrorMessageFromStatus, 
  createValidationError,
  CONTEXT_MESSAGES 
} from '@/lib/error-messages'

interface ErrorHandlerOptions {
  showNotification?: boolean
  context?: string
  fallbackMessage?: string
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { showError, showSuccess } = useNotifications()
  const { showNotification = true, context, fallbackMessage } = options

  const handleError = useCallback((
    error: any, 
    customMessage?: string,
    customOptions?: Partial<ErrorHandlerOptions>
  ) => {
    const opts = { ...options, ...customOptions }
    
    // Se não deve mostrar notificação, apenas log
    if (!opts.showNotification) {
      console.error('Erro capturado:', error)
      return
    }

    let errorMessage: ErrorMessage

    // Determinar tipo de erro e criar mensagem apropriada
    if (error?.response?.status) {
      // Erro HTTP
      errorMessage = getErrorMessageFromStatus(error.response.status)
    } else if (error?.code && typeof error.code === 'string') {
      // Erro com código específico
      errorMessage = getErrorMessage(error.code)
    } else if (error?.message) {
      // Erro com mensagem personalizada
      errorMessage = {
        type: 'error',
        category: 'unknown',
        title: 'Erro',
        message: error.message,
        code: 'CUSTOM_ERROR'
      }
    } else if (customMessage) {
      // Mensagem customizada fornecida
      errorMessage = {
        type: 'error',
        category: 'unknown',
        title: 'Erro',
        message: customMessage,
        code: 'CUSTOM_ERROR'
      }
    } else if (context && CONTEXT_MESSAGES[context as keyof typeof CONTEXT_MESSAGES]) {
      // Mensagem baseada no contexto
      errorMessage = {
        type: 'error',
        category: 'unknown',
        title: 'Erro',
        message: CONTEXT_MESSAGES[context as keyof typeof CONTEXT_MESSAGES],
        code: 'CONTEXT_ERROR'
      }
    } else {
      // Erro genérico
      errorMessage = getErrorMessage('UNKNOWN_ERROR')
    }

    // Usar mensagem de fallback se especificada
    if (fallbackMessage && errorMessage.message === 'Erro inesperado') {
      errorMessage.message = fallbackMessage
    }

    showError(errorMessage.title, errorMessage.message, errorMessage.action)
  }, [showError, options, fallbackMessage, context])

  const handleSuccess = useCallback((
    message: string,
    title: string = 'Sucesso'
  ) => {
    showSuccess(title, message)
  }, [showSuccess])

  const handleValidationError = useCallback((
    field: string,
    rule: string,
    ...args: any[]
  ) => {
    const errorMessage = createValidationError(field, rule as any, ...args)
    showError(errorMessage.title, errorMessage.message)
  }, [showError])

  // Função para tratar erros de API de forma específica
  const handleApiError = useCallback(async (response: Response, context?: string) => {
    try {
      const errorData = await response.json()
      
      if (errorData.message) {
        handleError(null, errorData.message, { context })
      } else {
        handleError(null, undefined, { context })
      }
    } catch {
      // Se não conseguir parsear o JSON, usar o status code
      handleError({ response }, undefined, { context })
    }
  }, [handleError])

  // Função para executar operações com tratamento de erro
  const executeWithErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    errorContext?: string,
    customErrorMessage?: string
  ): Promise<T | null> => {
    try {
      return await operation()
    } catch (error) {
      handleError(error, customErrorMessage, { context: errorContext })
      return null
    }
  }, [handleError])

  return {
    handleError,
    handleSuccess,
    handleValidationError,
    handleApiError,
    executeWithErrorHandling
  }
}

// Hook específico para formulários
export function useFormErrorHandler() {
  const { handleValidationError, handleError } = useErrorHandler()

  const validateField = useCallback((
    value: any,
    fieldName: string,
    rules: ValidationRule[]
  ): string | null => {
    for (const rule of rules) {
      const error = rule.validate(value, fieldName)
      if (error) {
        handleValidationError(fieldName, rule.type, rule.params)
        return error
      }
    }
    return null
  }, [handleValidationError])

  const validateForm = useCallback((
    data: Record<string, any>,
    validationRules: Record<string, ValidationRule[]>
  ): boolean => {
    let hasErrors = false

    for (const [field, rules] of Object.entries(validationRules)) {
      const error = validateField(data[field], field, rules)
      if (error) {
        hasErrors = true
      }
    }

    return !hasErrors
  }, [validateField])

  return {
    validateField,
    validateForm,
    handleError
  }
}

// Tipos para validação
interface ValidationRule {
  type: string
  validate: (value: any, fieldName: string) => string | null
  params?: any[]
}

// Regras de validação comuns
export const validationRules = {
  required: (value: any, fieldName: string) => 
    !value || (typeof value === 'string' && !value.trim()) 
      ? `${fieldName} é obrigatório` 
      : null,
      
  email: (value: string, fieldName: string) =>
    value && !value.includes('@') 
      ? `${fieldName} deve ser um email válido` 
      : null,
      
  minLength: (min: number) => (value: string, fieldName: string) =>
    value && value.length < min 
      ? `${fieldName} deve ter pelo menos ${min} caracteres` 
      : null,
      
  maxLength: (max: number) => (value: string, fieldName: string) =>
    value && value.length > max 
      ? `${fieldName} deve ter no máximo ${max} caracteres` 
      : null,
      
  number: (value: any, fieldName: string) =>
    value && isNaN(Number(value)) 
      ? `${fieldName} deve ser um número válido` 
      : null,
      
  positiveNumber: (value: any, fieldName: string) =>
    value && (isNaN(Number(value)) || Number(value) <= 0) 
      ? `${fieldName} deve ser um número positivo` 
      : null
}
