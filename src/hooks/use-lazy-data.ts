'use client'

import { useState, useEffect, useCallback } from 'react'
import { useErrorHandler } from './use-error-handler'

interface UseLazyDataOptions {
  delay?: number
  retries?: number
  retryDelay?: number
}

interface UseLazyDataReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useLazyData<T>(
  fetchFn: () => Promise<T>,
  options: UseLazyDataOptions = {}
): UseLazyDataReturn<T> {
  const { delay = 0, retries = 3, retryDelay = 1000 } = options
  const { handleError } = useErrorHandler({ showNotification: false })
  
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    let attempts = 0
    const maxAttempts = retries + 1

    while (attempts < maxAttempts) {
      try {
        // Simular delay se especificado
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay))
        }

        const result = await fetchFn()
        setData(result)
        setLoading(false)
        return
      } catch (err) {
        attempts++
        
        if (attempts >= maxAttempts) {
          // Log do erro para debugging
          console.error('Erro após tentativas:', err)
          
          // Definir mensagem de erro amigável
          const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados'
          setError(errorMessage)
          setLoading(false)
          return
        }
        
        // Aguardar antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      }
    }
  }, [fetchFn, delay, retries, retryDelay])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch
  }
}

// Hook específico para dados do dashboard
export function useDashboardData() {
  return useLazyData(async () => {
    // Simular dados por enquanto - em produção, criar endpoint específico
    const mockStats = {
      totalEvents: 12,
      upcomingEvents: 3,
      totalSermons: 45,
      totalContacts: 8,
      totalResources: 15,
      totalLinks: 22,
      recentContacts: [
        {
          id: '1',
          name: 'Maria Silva',
          subject: 'Informações sobre culto',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'João Santos',
          subject: 'Ajuda com estudos bíblicos',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      recentEvents: [
        {
          id: '1',
          title: 'Culto Dominical',
          startDate: new Date(Date.now() + 86400000).toISOString()
        },
        {
          id: '2',
          title: 'Estudo Bíblico',
          startDate: new Date(Date.now() + 172800000).toISOString()
        }
      ]
    }
    
    return mockStats
  }, {
    delay: 300, // Simular carregamento
    retries: 2
  })
}

// Hook para dados de eventos
export function useEventsData() {
  return useLazyData(async () => {
    const response = await fetch('/api/events')
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao carregar eventos')
    }
    
    return data.events || []
  }, {
    retries: 2,
    retryDelay: 1500
  })
}

// Hook para dados de sermões
export function useSermonsData() {
  return useLazyData(async () => {
    const response = await fetch('/api/sermons')
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao carregar sermões')
    }
    
    return data.sermons || []
  }, {
    retries: 2,
    retryDelay: 1500
  })
}
