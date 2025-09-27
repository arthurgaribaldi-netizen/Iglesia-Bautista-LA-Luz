'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { LazySermonForm } from '@/components/admin/sermons/lazy-sermon-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Play,
  Download,
  Search,
  Filter
} from 'lucide-react'

interface Sermon {
  id: string
  title: string
  pastor: string
  date: string
  series?: string
  description?: string
  audioUrl?: string
  videoUrl?: string
  transcript?: string
  author: {
    name: string
  }
}

export default function SermonsManager() {
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSeries, setFilterSeries] = useState('')

  useEffect(() => {
    fetchSermons()
  }, [])

  const fetchSermons = async () => {
    try {
      const response = await fetch('/api/sermons')
      const data = await response.json()
      
      if (data.sermons) {
        setSermons(data.sermons)
      }
    } catch (error) {
      console.error('Erro ao carregar sermões:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSermon = () => {
    setEditingSermon(null)
    setShowForm(true)
  }

  const handleEditSermon = (sermon: Sermon) => {
    setEditingSermon(sermon)
    setShowForm(true)
  }

  const handleDeleteSermon = async (sermonId: string) => {
    if (!confirm('Tem certeza que deseja excluir este sermão?')) {
      return
    }

    try {
      const response = await fetch(`/api/sermons/${sermonId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSermons(sermons.filter(sermon => sermon.id !== sermonId))
      } else {
        alert('Erro ao excluir sermão')
      }
    } catch (error) {
      console.error('Erro ao excluir sermão:', error)
      alert('Erro ao excluir sermão')
    }
  }

  const handleSubmitSermon = async (formData: any) => {
    setFormLoading(true)

    try {
      const sermonData = {
        ...formData,
        date: formData.date,
        authorId: 'temp-id' // Em produção, viria da autenticação
      }

      const url = editingSermon ? `/api/sermons/${editingSermon.id}` : '/api/sermons'
      const method = editingSermon ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sermonData)
      })

      if (response.ok) {
        setShowForm(false)
        setEditingSermon(null)
        fetchSermons() // Recarregar lista
      } else {
        const error = await response.json()
        alert(error.message || 'Erro ao salvar sermão')
      }
    } catch (error) {
      console.error('Erro ao salvar sermão:', error)
      alert('Erro ao salvar sermão')
    } finally {
      setFormLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const filteredSermons = sermons.filter(sermon => {
    const matchesSearch = sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.pastor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.series?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = !filterSeries || sermon.series === filterSeries
    
    return matchesSearch && matchesFilter
  })

  const uniqueSeries = Array.from(new Set(sermons.map(s => s.series).filter(Boolean)))

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Sermões</h1>
            <p className="text-gray-600 mt-2">Organize e publique sermões da igreja</p>
          </div>
          <button
            onClick={handleCreateSermon}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Sermão</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Sermões</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sermons.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Áudio</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sermons.filter(s => s.audioUrl).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Vídeo</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sermons.filter(s => s.videoUrl).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Séries Ativas</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueSeries.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por título, pastor ou série..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="md:w-64">
                <select
                  value={filterSeries}
                  onChange={(e) => setFilterSeries(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas as séries</option>
                  {uniqueSeries.map(series => (
                    <option key={series} value={series}>{series}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sermons List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSermons.map((sermon) => (
            <Card key={sermon.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{sermon.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {sermon.series && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                          {sermon.series}
                        </span>
                      )}
                      {formatDate(sermon.date)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{sermon.pastor}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(sermon.date)}</span>
                </div>

                {sermon.description && (
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {sermon.description}
                  </p>
                )}

                {/* Media indicators */}
                <div className="flex items-center space-x-4 pt-2">
                  {sermon.audioUrl && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Play className="w-4 h-4" />
                      <span className="text-xs">Áudio</span>
                    </div>
                  )}
                  
                  {sermon.videoUrl && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <Play className="w-4 h-4" />
                      <span className="text-xs">Vídeo</span>
                    </div>
                  )}
                  
                  {sermon.transcript && (
                    <div className="flex items-center space-x-1 text-blue-600">
                      <Download className="w-4 h-4" />
                      <span className="text-xs">Transcrição</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-xs text-gray-500">
                    Por: {sermon.author.name}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditSermon(sermon)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSermon(sermon.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSermons.length === 0 && sermons.length > 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum sermão encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros de busca
              </p>
            </CardContent>
          </Card>
        )}

        {sermons.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum sermão cadastrado
              </h3>
              <p className="text-gray-600 mb-4">
                Comece adicionando o primeiro sermão da igreja
              </p>
              <button
                onClick={handleCreateSermon}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Adicionar Primeiro Sermão</span>
              </button>
            </CardContent>
          </Card>
        )}

        {/* Sermon Form Modal - Lazy Loaded */}
        {showForm && (
          <LazySermonForm
            initialData={editingSermon ? {
              title: editingSermon.title,
              pastor: editingSermon.pastor,
              date: editingSermon.date,
              series: editingSermon.series || '',
              description: editingSermon.description || '',
              audioUrl: editingSermon.audioUrl || '',
              videoUrl: editingSermon.videoUrl || '',
              transcript: editingSermon.transcript || ''
            } : undefined}
            onSubmit={handleSubmitSermon}
            onCancel={() => {
              setShowForm(false)
              setEditingSermon(null)
            }}
            loading={formLoading}
          />
        )}
      </div>
    </AdminLayout>
  )
}
