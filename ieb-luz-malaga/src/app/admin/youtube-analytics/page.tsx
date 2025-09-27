"use client";

import { YouTubeDashboard } from '@/components/analytics/youtube-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, BarChart3, Settings } from 'lucide-react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function YouTubeAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Painel Administrativo</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Monitoramento e análise da integração com YouTube
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Settings className="w-4 h-4" />
              <span className="font-medium">Área Restrita</span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Esta página contém informações sensíveis sobre o desempenho da API. 
              Acesso restrito a administradores.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status da API</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Ativa</div>
              <p className="text-xs text-muted-foreground">
                Integração funcionando normalmente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Canal Monitorado</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">IEB La Luz Málaga</div>
              <p className="text-xs text-muted-foreground">
                ID: UCiahUfyUv3VbwrMjgLh-WzA
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Última Verificação</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {new Date().toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                Verificação automática ativa
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <YouTubeDashboard />

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Cache</CardTitle>
              <CardDescription>
                Configurações atuais do sistema de cache
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">TTL da Lista de Vídeos:</span>
                <span className="text-sm font-medium">10 minutos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">TTL dos Detalhes:</span>
                <span className="text-sm font-medium">30 minutos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">TTL das Informações do Canal:</span>
                <span className="text-sm font-medium">24 horas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Máximo de Entradas:</span>
                <span className="text-sm font-medium">Ilimitado</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limites da API</CardTitle>
              <CardDescription>
                Informações sobre os limites da YouTube Data API v3
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Quota Diária:</span>
                <span className="text-sm font-medium">10.000 unidades</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Custo por Lista:</span>
                <span className="text-sm font-medium">1 unidade</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Custo por Detalhes:</span>
                <span className="text-sm font-medium">1 unidade/vídeo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Rate Limit:</span>
                <span className="text-sm font-medium">100 req/100s</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Ações Administrativas</CardTitle>
              <CardDescription>
                Ferramentas para gerenciar a integração com YouTube
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Atualizar Dados
                </button>
                <button 
                  onClick={() => {
                    if (confirm('Tem certeza que deseja limpar todos os dados de cache e analytics?')) {
                      fetch('/api/youtube/analytics', { method: 'DELETE' })
                        .then(() => window.location.reload())
                        .catch(console.error);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Limpar Cache
                </button>
                <a 
                  href="https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Ver Quota no Google Cloud
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
