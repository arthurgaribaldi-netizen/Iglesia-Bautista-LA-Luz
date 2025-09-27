'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Link as LinkIcon, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink,
  Search,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react'

interface UsefulLink {
  id: string
  title: string
  url: string
  description?: string
  category?: string
  isActive: boolean
  createdAt: string
}

const LINK_CATEGORIES = [
  'ministerio',
  'estudos',
  'devocionais',
  'musica',
  'missao',
  'educacao',
  'saude',
  'social',
  'outros'
]

export default function LinksManager() {
  const [links, setLinks] = useState<UsefulLink[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLink, setEditingLink] = useState<UsefulLink | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links')
      const data = await response.json()
      
      if (data.links) {
        setLinks(data.links)
      }
    } catch (error) {
      console.error('Erro ao carregar links:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLink = () => {
    setEditingLink(null)
    setShowForm(true)
  }

  const handleEditLink = (link: UsefulLink) => {
    setEditingLink(link)
    setShowForm(true)
  }

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Tem certeza que deseja excluir este link?')) {
      return
    }

    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setLinks(links.filter(link => link.id !== linkId))
      } else {
        alert('Erro ao excluir link')
      }
    } catch (error) {
      console.error('Erro ao excluir link:', error)
      alert('Erro ao excluir link')
    }
  }

  const handleToggleActive = async (link: UsefulLink) => {
    try {
      const response = await fetch(`/api/links/${link.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...link,
          isActive: !link.isActive
        })
      })

      if (response.ok) {
        setLinks(links.map(l => 
          l.id === link.id ? { ...l, isActive: !l.isActive } : l
        ))
      }
    } catch (error) {
      console.error('Erro ao atualizar link:', error)
    }
  }

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !filterCategory || link.category === filterCategory
    
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      ministerio: 'Ministério',
      estudos: 'Estudos',
      devocionais: 'Devocionais',
      musica: 'Música',
      missao: 'Missão',
      educacao: 'Educação',
      saude: 'Saúde',
      social: 'Social',
      outros: 'Outros'
    }
    return labels[category] || category
  }

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Links Úteis</h1>
            <p className="text-gray-600 mt-2">Gerencie links importantes para a comunidade</p>
          </div>
          <button
            onClick={handleCreateLink}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Link</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Links</CardTitle>
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{links.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {links.filter(l => l.isActive).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorias</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(links.map(l => l.category).filter(Boolean)).size}
              </div>
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
                    placeholder="Buscar links..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="md:w-64">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas as categorias</option>
                  {LINK_CATEGORIES.map(category => (
                    <option key={category} value={category}>{getCategoryLabel(category)}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Links List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLinks.map((link) => (
            <Card key={link.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <LinkIcon className="w-5 h-5 text-blue-600" />
                      <span>{link.title}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      {link.category && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {getCategoryLabel(link.category)}
                        </span>
                      )}
                      {link.isActive ? (
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
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ExternalLink className="w-4 h-4" />
                  <span className="truncate">{getDomainFromUrl(link.url)}</span>
                </div>

                {link.description && (
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {link.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-xs text-gray-500">
                    Criado em: {formatDate(link.createdAt)}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Abrir link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleToggleActive(link)}
                      className={`p-1 rounded ${
                        link.isActive 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={link.isActive ? 'Desativar' : 'Ativar'}
                    >
                      {link.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEditLink(link)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
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

        {filteredLinks.length === 0 && links.length > 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum link encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros de busca
              </p>
            </CardContent>
          </Card>
        )}

        {links.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum link cadastrado
              </h3>
              <p className="text-gray-600 mb-4">
                Comece adicionando links úteis para a comunidade
              </p>
              <button
                onClick={handleCreateLink}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Adicionar Primeiro Link</span>
              </button>
            </CardContent>
          </Card>
        )}

        {/* Link Form Modal - Simplified for now */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingLink ? 'Editar Link' : 'Novo Link'}
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
