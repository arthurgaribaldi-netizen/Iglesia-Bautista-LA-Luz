'use client'

import { AdminLayout } from '@/components/admin/admin-layout'
import { LazyDashboardStats } from '@/components/admin/lazy-dashboard-stats'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  Users, 
  Clock
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDashboardData } from '@/hooks/use-lazy-data'

interface DashboardStats {
  totalEvents: number
  upcomingEvents: number
  totalSermons: number
  totalContacts: number
  totalResources: number
  totalLinks: number
  recentContacts: Array<{
    id: string
    name: string
    subject: string
    createdAt: string
  }>
  recentEvents: Array<{
    id: string
    title: string
    startDate: string
  }>
}

export default function AdminDashboard() {
  const { data: stats, loading, error, refetch } = useDashboardData()

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-red-600 text-center">
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar dados</h3>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Visão geral do sistema administrativo</p>
        </div>

        {/* Stats Cards and Recent Activity - Lazy Loaded */}
        {stats && <LazyDashboardStats stats={stats} />}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesso rápido às funcionalidades mais usadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a 
                href="/admin/eventos" 
                className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Calendar className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium">Novo Evento</p>
                  <p className="text-sm text-gray-600">Criar evento ou atividade</p>
                </div>
              </a>
              
              <a 
                href="/admin/sermoes" 
                className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BookOpen className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium">Adicionar Sermão</p>
                  <p className="text-sm text-gray-600">Upload de sermão ou estudo</p>
                </div>
              </a>
              
              <a 
                href="/admin/contatos" 
                className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageSquare className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-medium">Ver Contatos</p>
                  <p className="text-sm text-gray-600">Responder mensagens</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
