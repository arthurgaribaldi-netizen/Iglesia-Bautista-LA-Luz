'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  Link as LinkIcon,
  Search,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react'

interface Resource {
  id: string
  title: string
  description?: string
  type: string
  category?: string
  url?: string
  downloadUrl?: string
  isActive: boolean
  createdAt: string
}

const RESOURCE_TYPES = [
  'devotional',
  'guide',
  'magazine',
  'pastor_resource',
  'study_material',
  'music',
  'video',
  'other'
]

const RESOURCE_CATEGORIES = [
  'estudos_biblicos',
  'devocionais',
  'ministerio',
  'musica',
  'infantil',
  'jovens',
  'adultos',
  'família',
  'outros'
]

export default function ResourcesManager() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources')
      const data = await response.json()
      
      if (data.resources) {
        setResources(data.resources)
      }
    } catch (error) {
      console.error('Erro ao carregar recursos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateResource = () => {
    setEditingResource(null)
    setShowForm(true)
  }

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource)
    setShowForm(true)
  }

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm('Tem certeza que deseja excluir este recurso?')) {
      return
    }

    try {
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setResources(resources.filter(resource => resource.id !== resourceId))
      } else {
        alert('Erro ao excluir recurso')
      }
    } catch (error) {
      console.error('Erro ao excluir recurso:', error)
      alert('Erro ao excluir recurso')
    }
  }

  const handleToggleActive = async (resource: Resource) => {
    try {
      const response = await fetch(`/api/resources/${resource.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...resource,
          isActive: !resource.isActive
        })
      })

      if (response.ok) {
        setResources(resources.map(r => 
          r.id === resource.id ? { ...r, isActive: !r.isActive } : r
        ))
      }
    } catch (error) {
      console.error('Erro ao atualizar recurso:', error)
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = !filterType || resource.type === filterType
    const matchesCategory = !filterCategory || resource.category === filterCategory
    
    return matchesSearch && matchesType && matchesCategory
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      devotional: 'Devocional',
      guide: 'Guia',
      magazine: 'Revista',
      pastor_resource: 'Recurso Pastoral',
      study_material: 'Material de Estudo',
      music: 'Música',
      video: 'Vídeo',
      other: 'Outro'
    }
    return labels[type] || type
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      estudos_biblicos: 'Estudos Bíblicos',
      devocionais: 'Devocionais',
      ministerio: 'Ministério',
      musica: 'Música',
      infantil: 'Infantil',
      jovens: 'Jovens',
      adultos: 'Adultos',
      família: 'Família',
      outros: 'Outros'
    }
    return labels[category] || category
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Recursos Espirituais</h1>
            <p className="text-gray-600 mt-2">Gerencie materiais e documentos da igreja</p>
          </div>
          <button
            onClick={handleCreateResource}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Recurso</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Recursos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resources.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resources.filter(r => r.isActive).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Download</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resources.filter(r => r.downloadUrl).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Link</CardTitle>
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resources.filter(r => r.url).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar recursos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos os tipos</option>
                  {RESOURCE_TYPES.map(type => (
                    <option key={type} value={type}>{getTypeLabel(type)}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas as categorias</option>
                  {RESOURCE_CATEGORIES.map(category => (
                    <option key={category} value={category}>{getCategoryLabel(category)}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {getTypeLabel(resource.type)}
                      </span>
                      {resource.category && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {getCategoryLabel(resource.category)}
                        </span>
                      )}
                      {resource.isActive ? (
                        <span className="inline-flex items-center text-green-600 text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-gray-500 text-xs">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Inativo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {resource.description && (
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {resource.description}
                  </p>
                )}

                {/* Links */}
                <div className="space-y-2">
                  {resource.url && (
                    <div className="flex items-center space-x-2 text-sm">
                      <LinkIcon className="w-4 h-4 text-blue-600" />
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 truncate"
                      >
                        Ver Link
                      </a>
                    </div>
                  )}
                  
                  {resource.downloadUrl && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Download className="w-4 h-4 text-green-600" />
                      <a 
                        href={resource.downloadUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 truncate"
                      >
                        Download
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-xs text-gray-500">
                    Criado em: {formatDate(resource.createdAt)}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleActive(resource)}
                      className={`p-1 rounded ${
                        resource.isActive 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={resource.isActive ? 'Desativar' : 'Ativar'}
                    >
                      {resource.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEditResource(resource)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteResource(resource.id)}
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

        {filteredResources.length === 0 && resources.length > 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum recurso encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros de busca
              </p>
            </CardContent>
          </Card>
        )}

        {resources.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum recurso cadastrado
              </h3>
              <p className="text-gray-600 mb-4">
                Comece adicionando materiais espirituais para a comunidade
              </p>
              <button
                onClick={handleCreateResource}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Adicionar Primeiro Recurso</span>
              </button>
            </CardContent>
          </Card>
        )}

        {/* Resource Form Modal - Simplified for now */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingResource ? 'Editar Recurso' : 'Novo Recurso'}
              </h2>
              <p className="text-gray-600 mb-4">
                Formulário completo será implementado na próxima versão.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
