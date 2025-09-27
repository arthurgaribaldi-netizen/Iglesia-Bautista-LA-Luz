'use client'

import React, { useState } from 'react'
import { useErrorHandler } from '@/hooks/use-error-handler'
import { useToast } from '@/components/ui/notification-system'
import { FormField, SelectField } from '@/components/ui/form-field'
import { validationRules } from '@/hooks/use-error-handler'

/**
 * Componente de demonstração do sistema de tratamento de erros
 * Mostra diferentes tipos de mensagens e cenários de erro
 */
export function ErrorDemo() {
  const { handleError, handleSuccess, executeWithErrorHandling } = useErrorHandler({
    context: 'DEMO_ERROR'
  })
  const toast = useToast()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    category: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Simular diferentes tipos de erro
  const simulateNetworkError = async () => {
    await executeWithErrorHandling(
      async () => {
        // Simular erro de rede
        const response = await fetch('/api/non-existent-endpoint')
        if (!response.ok) {
          throw new Error('Falha na conexão')
        }
      },
      'NETWORK_ERROR',
      'Erro de conexão simulado'
    )
  }

  const simulateServerError = async () => {
    await executeWithErrorHandling(
      async () => {
        // Simular erro 500
        const response = await fetch('/api/simulate-500')
        if (response.status === 500) {
          throw { response: { status: 500 } }
        }
      },
      'SERVER_ERROR'
    )
  }

  const simulateValidationError = () => {
    setErrors({})
    const newErrors: Record<string, string> = {}

    // Validar nome
    if (!formData.name.trim()) {
      newErrors.name = validationRules.required(formData.name, 'Nome') || ''
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = validationRules.required(formData.email, 'Email') || ''
    } else if (!formData.email.includes('@')) {
      newErrors.email = validationRules.email(formData.email, 'Email') || ''
    }

    // Validar idade
    if (formData.age && isNaN(Number(formData.age))) {
      newErrors.age = validationRules.number(formData.age, 'Idade') || ''
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Dados inválidos', 'Verifique os campos destacados em vermelho')
      return false
    }

    return true
  }

  const simulateSuccess = () => {
    toast.success('Operação concluída', 'Dados processados com sucesso!')
  }

  const simulateWarning = () => {
    toast.warning('Atenção', 'Esta é uma operação importante. Tem certeza?')
  }

  const simulateInfo = () => {
    toast.info('Informação', 'Esta é uma mensagem informativa')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (simulateValidationError()) {
      handleSuccess('Formulário válido', 'Todos os dados foram validados com sucesso!')
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Demonstração do Sistema de Erros
        </h1>
        <p className="text-gray-600">
          Teste diferentes tipos de mensagens e cenários de erro
        </p>
      </div>

      {/* Botões de demonstração */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Cenários de Erro</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button
            onClick={simulateNetworkError}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Erro de Rede
          </button>
          
          <button
            onClick={simulateServerError}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Erro do Servidor
          </button>
          
          <button
            onClick={simulateValidationError}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            Erro de Validação
          </button>
          
          <button
            onClick={simulateSuccess}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Sucesso
          </button>
          
          <button
            onClick={simulateWarning}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
          >
            Aviso
          </button>
          
          <button
            onClick={simulateInfo}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Informação
          </button>
        </div>
      </div>

      {/* Formulário de demonstração */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Formulário de Demonstração</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Nome Completo"
            name="name"
            value={formData.name}
            onChange={(value) => handleFieldChange('name', value)}
            placeholder="Digite seu nome"
            required
            error={errors.name}
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(value) => handleFieldChange('email', value)}
            placeholder="seu@email.com"
            required
            error={errors.email}
          />

          <FormField
            label="Idade"
            name="age"
            type="number"
            value={formData.age}
            onChange={(value) => handleFieldChange('age', value)}
            placeholder="25"
            error={errors.age}
          />

          <SelectField
            label="Categoria"
            name="category"
            value={formData.category}
            onChange={(value) => handleFieldChange('category', value)}
            options={[
              { value: 'admin', label: 'Administrador' },
              { value: 'user', label: 'Usuário' },
              { value: 'guest', label: 'Convidado' }
            ]}
          />

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Validar Formulário
          </button>
        </form>
      </div>

      {/* Instruções */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Como usar este sistema
        </h3>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• <strong>Erro de Rede:</strong> Simula falha de conexão</li>
          <li>• <strong>Erro do Servidor:</strong> Simula erro 500 do servidor</li>
          <li>• <strong>Erro de Validação:</strong> Valida campos obrigatórios</li>
          <li>• <strong>Sucesso:</strong> Mostra mensagem de sucesso</li>
          <li>• <strong>Aviso:</strong> Mostra mensagem de atenção</li>
          <li>• <strong>Informação:</strong> Mostra mensagem informativa</li>
        </ul>
      </div>
    </div>
  )
}
