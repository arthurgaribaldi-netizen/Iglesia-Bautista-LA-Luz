'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, Clock, AlertCircle, Database } from 'lucide-react';

interface AnalyticsData {
  metrics: {
    apiCalls: number
    cacheHits: number
    cacheMisses: number
    errors: number
    lastCall: string
    averageResponseTime: number
  }
  usageSummary: {
    totalApiCalls: number
    cacheHitRate: number
    averageResponseTime: number
    errorRate: number
    lastCall: string
  }
  cache: {
    totalEntries: number
    validEntries: number
    expiredEntries: number
    memoryUsage: number
  }
  timestamp: string
}

export function YouTubeDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async() => {
    try {
      setLoading(true);
      setError(null);
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('/api/youtube/analytics', {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Timeout: A requisição demorou muito para responder');
        } else {
          setError(err.message);
        }
      } else {
        setError('Erro desconhecido ao carregar analytics');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Erro ao Carregar Analytics
          </CardTitle>
          <CardDescription>
            Não foi possível carregar os dados de analytics do YouTube
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={fetchAnalytics} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
            <Button 
              onClick={() => {
                // Show fallback data
                setAnalytics({
                  metrics: {
                    apiCalls: 0,
                    cacheHits: 0,
                    cacheMisses: 0,
                    errors: 1,
                    lastCall: new Date().toISOString(),
                    averageResponseTime: 0,
                  },
                  usageSummary: {
                    totalApiCalls: 0,
                    cacheHitRate: 0,
                    averageResponseTime: 0,
                    errorRate: 100,
                    lastCall: new Date().toISOString(),
                  },
                  cache: {
                    totalEntries: 0,
                    validEntries: 0,
                    expiredEntries: 0,
                    memoryUsage: 0,
                  },
                  timestamp: new Date().toISOString(),
                });
                setError(null);
              }}
              variant="secondary"
            >
              Mostrar Dados Vazios
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Nenhum dado de analytics disponível</p>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const formatDuration = (ms: number) => {
    return `${ms.toFixed(0)}ms`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">YouTube Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Última atualização: {formatTime(analytics.timestamp)}
          </p>
        </div>
        <Button onClick={fetchAnalytics} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Chamadas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.usageSummary.totalApiCalls}</div>
            <p className="text-xs text-muted-foreground">
              Última: {formatTime(analytics.usageSummary.lastCall)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Cache</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.usageSummary.cacheHitRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.metrics.cacheHits} hits / {analytics.metrics.cacheMisses} misses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(analytics.usageSummary.averageResponseTime)}</div>
            <p className="text-xs text-muted-foreground">
              Tempo de resposta da API
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Erro</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.usageSummary.errorRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.metrics.errors} erros totais
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cache Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Cache</CardTitle>
          <CardDescription>
            Informações sobre o sistema de cache em memória
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{analytics.cache.totalEntries}</div>
              <p className="text-sm text-muted-foreground">Total de Entradas</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.cache.validEntries}</div>
              <p className="text-sm text-muted-foreground">Válidas</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analytics.cache.expiredEntries}</div>
              <p className="text-sm text-muted-foreground">Expiradas</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.cache.memoryUsage}</div>
              <p className="text-sm text-muted-foreground">Uso de Memória</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Dicas de Performance</CardTitle>
          <CardDescription>
            Recomendações baseadas nas métricas atuais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analytics.usageSummary.cacheHitRate < 50 && (
              <div className="flex items-center gap-2 text-orange-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Taxa de cache baixa. Considere aumentar o TTL do cache.</span>
              </div>
            )}
            {analytics.usageSummary.averageResponseTime > 2000 && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Tempo de resposta alto. Verifique a conectividade com a API do YouTube.</span>
              </div>
            )}
            {analytics.usageSummary.errorRate > 5 && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Taxa de erro alta. Verifique a configuração da API key.</span>
              </div>
            )}
            {analytics.usageSummary.cacheHitRate >= 80 && 
             analytics.usageSummary.averageResponseTime < 1000 && 
             analytics.usageSummary.errorRate < 2 && (
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Performance excelente! Sistema funcionando otimamente.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
