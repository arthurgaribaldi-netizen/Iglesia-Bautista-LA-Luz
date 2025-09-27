'use client'

import { useState, useEffect } from 'react'
import { useErrorHandler } from '@/hooks/use-error-handler'
import { useToast } from '@/components/ui/notification-system'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Settings, 
  Church, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Save,
  Edit,
  X,
  Building,
  Users,
  Calendar
} from 'lucide-react'

interface ChurchInfo {
  id?: string
  name: string
  location: string
  cif?: string
  ministryNumber?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  youtubeChannel?: string
  facebookPage?: string
  instagramPage?: string
}

export default function ChurchSettings() {
  const { handleError, handleSuccess } = useErrorHandler({ context: 'CONFIG_LOAD_ERROR' })
  const toast = useToast()

  const [churchInfo, setChurchInfo] = useState<ChurchInfo>({
    name: 'Iglesia Evangélica Bautista La Luz',
    location: 'Málaga, Espanha',
    cif: 'R2900286B',
    ministryNumber: '016332',
    email: 'info@iglesiabautistalaluz.es',
    phone: '+34 952 123 456',
    address: 'Avenida Antonio Gaudí, 4, 29004 Málaga, Espanha',
    website: 'https://iglesiabautistalaluz.es',
    youtubeChannel: 'https://youtube.com/@iglesiabautistalaluz',
    facebookPage: 'https://facebook.com/iglesiabautistalaluz',
    instagramPage: 'https://instagram.com/iglesiabautistalaluz'
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [errors, setErrors] = useState<Partial<ChurchInfo>>({})

  useEffect(() => {
    fetchChurchInfo()
  }, [])

  const fetchChurchInfo = async () => {
    try {
      const response = await fetch('/api/church-info')
      const data = await response.json()
      
      if (data.churchInfo) {
        setChurchInfo(data.churchInfo)
      }
    } catch (error) {
      handleError(error, 'Erro ao carregar informações da igreja')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ChurchInfo> = {}

    if (!churchInfo.name.trim()) {
      newErrors.name = 'Nome da igreja é obrigatório'
    }

    if (!churchInfo.location.trim()) {
      newErrors.location = 'Localização é obrigatória'
    }

    if (churchInfo.email && !churchInfo.email.includes('@')) {
      newErrors.email = 'Email inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/church-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(churchInfo)
      })

      if (response.ok) {
        setEditing(false)
        setErrors({})
        handleSuccess('Informações salvas com sucesso!')
      } else {
        await handleError({ response }, 'Erro ao salvar informações')
      }
    } catch (error) {
      handleError(error, 'Erro ao salvar informações')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setErrors({})
    fetchChurchInfo() // Recarregar dados originais
  }

  const handleChange = (field: keyof ChurchInfo, value: string) => {
    setChurchInfo(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
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
            <h1 className="text-3xl font-bold text-gray-900">Configurações da Igreja</h1>
            <p className="text-gray-600 mt-2">Gerencie as informações básicas da igreja</p>
          </div>
          <div className="flex items-center space-x-3">
            {editing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancelar</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Salvando...' : 'Salvar'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </button>
            )}
          </div>
        </div>

        {/* Church Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Church className="w-5 h-5" />
                <span>Informações Básicas</span>
              </CardTitle>
              <CardDescription>
                Dados principais da igreja
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Igreja *
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={churchInfo.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{churchInfo.name}</p>
                )}
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localização *
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={churchInfo.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.location ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <p className="text-gray-900">{churchInfo.location}</p>
                )}
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CIF
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={churchInfo.cif || ''}
                      onChange={(e) => handleChange('cif', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{churchInfo.cif || 'Não informado'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número do Ministério
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={churchInfo.ministryNumber || ''}
                      onChange={(e) => handleChange('ministryNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{churchInfo.ministryNumber || 'Não informado'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>Informações de Contato</span>
              </CardTitle>
              <CardDescription>
                Como as pessoas podem entrar em contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={churchInfo.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{churchInfo.email || 'Não informado'}</span>
                  </div>
                )}
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={churchInfo.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{churchInfo.phone || 'Não informado'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço
                </label>
                {editing ? (
                  <textarea
                    value={churchInfo.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-gray-900">{churchInfo.address || 'Não informado'}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Online Presence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Presença Online</span>
            </CardTitle>
            <CardDescription>
              Links para redes sociais e canais online
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Oficial
                </label>
                {editing ? (
                  <input
                    type="url"
                    value={churchInfo.website || ''}
                    onChange={(e) => handleChange('website', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 truncate">
                      {churchInfo.website || 'Não informado'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canal YouTube
                </label>
                {editing ? (
                  <input
                    type="url"
                    value={churchInfo.youtubeChannel || ''}
                    onChange={(e) => handleChange('youtubeChannel', e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 truncate">
                      {churchInfo.youtubeChannel || 'Não informado'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Página Facebook
                </label>
                {editing ? (
                  <input
                    type="url"
                    value={churchInfo.facebookPage || ''}
                    onChange={(e) => handleChange('facebookPage', e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 truncate">
                      {churchInfo.facebookPage || 'Não informado'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Página Instagram
                </label>
                {editing ? (
                  <input
                    type="url"
                    value={churchInfo.instagramPage || ''}
                    onChange={(e) => handleChange('instagramPage', e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 truncate">
                      {churchInfo.instagramPage || 'Não informado'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Informações do Sistema</span>
            </CardTitle>
            <CardDescription>
              Dados sobre o sistema administrativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Sistema Ativo</h3>
                <p className="text-sm text-gray-600">Painel administrativo funcionando</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Usuários</h3>
                <p className="text-sm text-gray-600">Sistema de autenticação ativo</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Última Atualização</h3>
                <p className="text-sm text-gray-600">{new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
