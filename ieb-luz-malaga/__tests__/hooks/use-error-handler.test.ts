import { renderHook, act } from '@testing-library/react'
import { useErrorHandler, useFormErrorHandler, validationRules } from '../../src/hooks/use-error-handler'
import React from 'react'

// Mock do sistema de notificações
const mockShowError = jest.fn()
const mockShowSuccess = jest.fn()

jest.mock('../../src/components/ui/notification-system', () => ({
  useNotifications: () => ({
    showError: mockShowError,
    showSuccess: mockShowSuccess
  })
}))

// Mock dos error messages
jest.mock('../../src/lib/error-messages', () => ({
  getErrorMessage: jest.fn(),
  getErrorMessageFromStatus: jest.fn(),
  createValidationError: jest.fn(),
  CONTEXT_MESSAGES: {
    'form': 'Erro no formulário',
    'api': 'Erro na API',
    'network': 'Erro de conexão'
  }
}))

describe('useErrorHandler Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Error Handling', () => {
    it('should handle error with notification by default', () => {
      const { result } = renderHook(() => useErrorHandler())

      const error = new Error('Test error message')
      
      act(() => {
        result.current.handleError(error)
      })

      expect(mockShowError).toHaveBeenCalledWith(
        'Erro',
        'Test error message'
      )
    })

    it('should not show notification when showNotification is false', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      const { result } = renderHook(() => 
        useErrorHandler({ showNotification: false })
      )

      const error = new Error('Test error')
      
      act(() => {
        result.current.handleError(error)
      })

      expect(mockShowError).not.toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith('Erro capturado:', error)

      consoleSpy.mockRestore()
    })

    it('should handle custom error message', () => {
      const { result } = renderHook(() => useErrorHandler())

      act(() => {
        result.current.handleError(null, 'Custom error message')
      })

      expect(mockShowError).toHaveBeenCalledWith(
        'Erro',
        'Custom error message'
      )
    })

    it('should handle success messages', () => {
      const { result } = renderHook(() => useErrorHandler())

      act(() => {
        result.current.handleSuccess('Operation completed successfully', 'Success')
      })

      expect(mockShowSuccess).toHaveBeenCalledWith(
        'Success',
        'Operation completed successfully'
      )
    })

    it('should use default success title', () => {
      const { result } = renderHook(() => useErrorHandler())

      act(() => {
        result.current.handleSuccess('Operation completed')
      })

      expect(mockShowSuccess).toHaveBeenCalledWith(
        'Sucesso',
        'Operation completed'
      )
    })
  })

  describe('HTTP Error Handling', () => {
    it('should handle HTTP response errors', () => {
      const { getErrorMessageFromStatus } = require('../../src/lib/error-messages')
      getErrorMessageFromStatus.mockReturnValue({
        type: 'error',
        category: 'http',
        title: 'Erro HTTP',
        message: 'Server error',
        code: 'HTTP_500'
      })

      const { result } = renderHook(() => useErrorHandler())

      const httpError = {
        response: {
          status: 500
        }
      }

      act(() => {
        result.current.handleError(httpError)
      })

      expect(getErrorMessageFromStatus).toHaveBeenCalledWith(500)
      expect(mockShowError).toHaveBeenCalledWith(
        'Erro HTTP',
        'Server error'
      )
    })
  })

  describe('Coded Error Handling', () => {
    it('should handle errors with specific codes', () => {
      const { getErrorMessage } = require('../../src/lib/error-messages')
      getErrorMessage.mockReturnValue({
        type: 'error',
        category: 'validation',
        title: 'Erro de Validação',
        message: 'Invalid input',
        code: 'VALIDATION_ERROR'
      })

      const { result } = renderHook(() => useErrorHandler())

      const codedError = {
        code: 'VALIDATION_ERROR',
        message: 'Some validation failed'
      }

      act(() => {
        result.current.handleError(codedError)
      })

      expect(getErrorMessage).toHaveBeenCalledWith('VALIDATION_ERROR')
      expect(mockShowError).toHaveBeenCalledWith(
        'Erro de Validação',
        'Invalid input'
      )
    })
  })

  describe('Context-based Error Handling', () => {
    it('should handle errors with context', () => {
      const { result } = renderHook(() => 
        useErrorHandler({ context: 'form' })
      )

      act(() => {
        result.current.handleError(null)
      })

      expect(mockShowError).toHaveBeenCalledWith(
        'Erro',
        'Erro no formulário'
      )
    })

    it('should use fallback message when specified', () => {
      const { result } = renderHook(() => 
        useErrorHandler({ fallbackMessage: 'Custom fallback message' })
      )

      act(() => {
        result.current.handleError(null)
      })

      expect(mockShowError).toHaveBeenCalledWith(
        'Erro',
        'Custom fallback message'
      )
    })
  })

  describe('API Error Handling', () => {
    it('should handle API errors with JSON response', async () => {
      const { result } = renderHook(() => useErrorHandler())

      const mockResponse = {
        json: jest.fn().mockResolvedValue({
          message: 'API error message'
        })
      } as unknown as Response

      await act(async () => {
        await result.current.handleApiError(mockResponse, 'api')
      })

      expect(mockResponse.json).toHaveBeenCalled()
      expect(mockShowError).toHaveBeenCalledWith(
        'Erro',
        'API error message'
      )
    })

    it('should handle API errors without JSON response', async () => {
      const { result } = renderHook(() => useErrorHandler())

      const mockResponse = {
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      } as unknown as Response

      await act(async () => {
        await result.current.handleApiError(mockResponse, 'api')
      })

      expect(mockShowError).toHaveBeenCalled()
    })
  })

  describe('Execute with Error Handling', () => {
    it('should execute successful operation', async () => {
      const { result } = renderHook(() => useErrorHandler())

      const mockOperation = jest.fn().mockResolvedValue('success result')

      let operationResult: string | null = null

      await act(async () => {
        operationResult = await result.current.executeWithErrorHandling(
          mockOperation,
          'test-context'
        )
      })

      expect(mockOperation).toHaveBeenCalled()
      expect(operationResult).toBe('success result')
      expect(mockShowError).not.toHaveBeenCalled()
    })

    it('should handle operation errors', async () => {
      const { result } = renderHook(() => useErrorHandler())

      const mockOperation = jest.fn().mockRejectedValue(new Error('Operation failed'))

      let operationResult: string | null = null

      await act(async () => {
        operationResult = await result.current.executeWithErrorHandling(
          mockOperation,
          'test-context',
          'Custom error message'
        )
      })

      expect(mockOperation).toHaveBeenCalled()
      expect(operationResult).toBeNull()
      expect(mockShowError).toHaveBeenCalledWith(
        'Erro',
        'Custom error message'
      )
    })
  })
})

describe('useFormErrorHandler Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Field Validation', () => {
    it('should validate field successfully', () => {
      const { result } = renderHook(() => useFormErrorHandler())

      const rules = [
        {
          type: 'required',
          validate: validationRules.required,
          params: []
        }
      ]

      let validationResult: string | null = null

      act(() => {
        validationResult = result.current.validateField('valid value', 'testField', rules)
      })

      expect(validationResult).toBeNull()
      expect(mockShowError).not.toHaveBeenCalled()
    })

    it('should validate field and show error for invalid input', () => {
      const { createValidationError } = require('../../src/lib/error-messages')
      createValidationError.mockReturnValue({
        title: 'Erro de Validação',
        message: 'Campo é obrigatório'
      })

      const { result } = renderHook(() => useFormErrorHandler())

      const rules = [
        {
          type: 'required',
          validate: validationRules.required,
          params: []
        }
      ]

      let validationResult: string | null = null

      act(() => {
        validationResult = result.current.validateField('', 'testField', rules)
      })

      expect(validationResult).toBe('testField é obrigatório')
      expect(createValidationError).toHaveBeenCalledWith('testField', 'required', [])
      expect(mockShowError).toHaveBeenCalledWith(
        'Erro de Validação',
        'Campo é obrigatório'
      )
    })
  })

  describe('Form Validation', () => {
    it('should validate entire form successfully', () => {
      const { result } = renderHook(() => useFormErrorHandler())

      const formData = {
        title: 'Valid Title',
        email: 'valid@email.com'
      }

      const validationRules = {
        title: [
          {
            type: 'required',
            validate: validationRules.required,
            params: []
          }
        ],
        email: [
          {
            type: 'email',
            validate: validationRules.email,
            params: []
          }
        ]
      }

      let isValid: boolean = false

      act(() => {
        isValid = result.current.validateForm(formData, validationRules)
      })

      expect(isValid).toBe(true)
    })

    it('should validate entire form with errors', () => {
      const { createValidationError } = require('../../src/lib/error-messages')
      createValidationError.mockReturnValue({
        title: 'Erro de Validação',
        message: 'Campo é obrigatório'
      })

      const { result } = renderHook(() => useFormErrorHandler())

      const formData = {
        title: '',
        email: 'invalid-email'
      }

      const validationRules = {
        title: [
          {
            type: 'required',
            validate: validationRules.required,
            params: []
          }
        ],
        email: [
          {
            type: 'email',
            validate: validationRules.email,
            params: []
          }
        ]
      }

      let isValid: boolean = false

      act(() => {
        isValid = result.current.validateForm(formData, validationRules)
      })

      expect(isValid).toBe(false)
      expect(mockShowError).toHaveBeenCalledTimes(2) // Two validation errors
    })
  })
})

describe('Validation Rules', () => {
  describe('required', () => {
    it('should validate required field with value', () => {
      const result = validationRules.required('valid value', 'testField')
      expect(result).toBeNull()
    })

    it('should validate required field without value', () => {
      const result = validationRules.required('', 'testField')
      expect(result).toBe('testField é obrigatório')
    })

    it('should validate required field with whitespace only', () => {
      const result = validationRules.required('   ', 'testField')
      expect(result).toBe('testField é obrigatório')
    })
  })

  describe('email', () => {
    it('should validate valid email', () => {
      const result = validationRules.email('valid@email.com', 'emailField')
      expect(result).toBeNull()
    })

    it('should validate invalid email', () => {
      const result = validationRules.email('invalid-email', 'emailField')
      expect(result).toBe('emailField deve ser um email válido')
    })

    it('should allow empty email', () => {
      const result = validationRules.email('', 'emailField')
      expect(result).toBeNull()
    })
  })

  describe('minLength', () => {
    it('should validate string with sufficient length', () => {
      const minLength5 = validationRules.minLength(5)
      const result = minLength5('valid string', 'textField')
      expect(result).toBeNull()
    })

    it('should validate string with insufficient length', () => {
      const minLength5 = validationRules.minLength(5)
      const result = minLength5('hi', 'textField')
      expect(result).toBe('textField deve ter pelo menos 5 caracteres')
    })

    it('should allow empty string', () => {
      const minLength5 = validationRules.minLength(5)
      const result = minLength5('', 'textField')
      expect(result).toBeNull()
    })
  })

  describe('maxLength', () => {
    it('should validate string within max length', () => {
      const maxLength10 = validationRules.maxLength(10)
      const result = maxLength10('valid', 'textField')
      expect(result).toBeNull()
    })

    it('should validate string exceeding max length', () => {
      const maxLength10 = validationRules.maxLength(10)
      const result = maxLength10('this string is too long', 'textField')
      expect(result).toBe('textField deve ter no máximo 10 caracteres')
    })
  })

  describe('number', () => {
    it('should validate valid number string', () => {
      const result = validationRules.number('123', 'numberField')
      expect(result).toBeNull()
    })

    it('should validate valid decimal', () => {
      const result = validationRules.number('123.45', 'numberField')
      expect(result).toBeNull()
    })

    it('should validate invalid number string', () => {
      const result = validationRules.number('not-a-number', 'numberField')
      expect(result).toBe('numberField deve ser um número válido')
    })

    it('should allow empty value', () => {
      const result = validationRules.number('', 'numberField')
      expect(result).toBeNull()
    })
  })

  describe('positiveNumber', () => {
    it('should validate positive number', () => {
      const result = validationRules.positiveNumber('123', 'numberField')
      expect(result).toBeNull()
    })

    it('should validate positive decimal', () => {
      const result = validationRules.positiveNumber('123.45', 'numberField')
      expect(result).toBeNull()
    })

    it('should validate negative number', () => {
      const result = validationRules.positiveNumber('-123', 'numberField')
      expect(result).toBe('numberField deve ser um número positivo')
    })

    it('should validate zero', () => {
      const result = validationRules.positiveNumber('0', 'numberField')
      expect(result).toBe('numberField deve ser um número positivo')
    })

    it('should allow empty value', () => {
      const result = validationRules.positiveNumber('', 'numberField')
      expect(result).toBeNull()
    })
  })
})
