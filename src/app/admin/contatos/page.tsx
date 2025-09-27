'use client'

import { useState, useEffect } from 'react'
import { useErrorHandler } from '@/hooks/use-error-handler'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  User,
  Search,
  Eye,
  EyeOff,
  Check,
  X,
  Reply
} from 'lucide-react'

interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function ContactsManager() {
  const { handleError, handleSuccess } = useErrorHandler({ context: 'CONTACT_LOAD_ERROR' })

  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRead, setFilterRead] = useState('all')

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contact')
      const data = await response.json()
      
      if (data.contacts) {
        setContacts(data.contacts)
      }
    } catch (error) {
      handleError(error, 'Erro ao carregar contatos')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (contactId: string) => {
    try {
      const response = await fetch(`/api/contact/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isRead: true })
      })

      if (response.ok) {
        setContacts(contacts.map(contact => 
          contact.id === contactId ? { ...contact, isRead: true } : contact
        ))
        
        if (selectedContact?.id === contactId) {
          setSelectedContact({ ...selectedContact, isRead: true })
        }
      }
    } catch (error) {
      handleError(error, 'Erro ao marcar como lido')
    }
  }

  const handleMarkAsUnread = async (contactId: string) => {
    try {
      const response = await fetch(`/api/contact/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isRead: false })
      })

      if (response.ok) {
        setContacts(contacts.map(contact => 
          contact.id === contactId ? { ...contact, isRead: false } : contact
        ))
        
        if (selectedContact?.id === contactId) {
          setSelectedContact({ ...selectedContact, isRead: false })
        }
      }
    } catch (error) {
      handleError(error, 'Erro ao marcar como não lido')
    }
  }

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Tem certeza que deseja excluir este contato?')) {
      return
    }

    try {
      const response = await fetch(`/api/contact/${contactId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setContacts(contacts.filter(contact => contact.id !== contactId))
        if (selectedContact?.id === contactId) {
          setSelectedContact(null)
        }
      }
    } catch (error) {
      handleError(error, 'Erro ao excluir contato')
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterRead === 'all' || 
                         (filterRead === 'read' && contact.isRead) ||
                         (filterRead === 'unread' && !contact.isRead)
    
    return matchesSearch && matchesFilter
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Agora mesmo'
    if (diffInHours < 24) return `${diffInHours}h atrás`
    if (diffInHours < 48) return 'Ontem'
    return `${Math.floor(diffInHours / 24)} dias atrás`
  }

  const unreadCount = contacts.filter(c => !c.isRead).length

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mensagens de Contato</h1>
          <p className="text-gray-600 mt-2">Gerencie mensagens recebidas da comunidade</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Mensagens</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contacts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Não Lidas</CardTitle>
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lidas</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {contacts.filter(c => c.isRead).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {contacts.filter(c => {
                  const today = new Date()
                  const contactDate = new Date(c.createdAt)
                  return contactDate.toDateString() === today.toDateString()
                }).length}
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
                    placeholder="Buscar mensagens..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="md:w-48">
                <select
                  value={filterRead}
                  onChange={(e) => setFilterRead(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas as mensagens</option>
                  <option value="unread">Não lidas</option>
                  <option value="read">Lidas</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contacts List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Mensagens</CardTitle>
                <CardDescription>
                  {filteredContacts.length} mensagem(s) encontrada(s)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedContact?.id === contact.id ? 'bg-blue-50 border-blue-200' : ''
                      } ${!contact.isRead ? 'border-l-4 border-l-blue-500' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className={`font-medium truncate ${!contact.isRead ? 'font-semibold' : ''}`}>
                              {contact.name}
                            </h4>
                            {!contact.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {contact.subject || 'Sem assunto'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {getRelativeTime(contact.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-2">
            {selectedContact ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>{selectedContact.name}</span>
                        {!selectedContact.isRead && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Nova
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {selectedContact.subject || 'Sem assunto'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!selectedContact.isRead ? (
                        <button
                          onClick={() => handleMarkAsRead(selectedContact.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Marcar como lida"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkAsUnread(selectedContact.id)}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                          title="Marcar como não lida"
                        >
                          <EyeOff className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteContact(selectedContact.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Excluir"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Email:</span>
                      <a 
                        href={`mailto:${selectedContact.email}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {selectedContact.email}
                      </a>
                    </div>
                    
                    {selectedContact.phone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Telefone:</span>
                        <a 
                          href={`tel:${selectedContact.phone}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {selectedContact.phone}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Data:</span>
                      <span>{formatDate(selectedContact.createdAt)}</span>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Mensagem:</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedContact.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <a
                      href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Contato via site'}`}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Reply className="w-4 h-4" />
                      <span>Responder</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Selecione uma mensagem
                  </h3>
                  <p className="text-gray-600">
                    Escolha uma mensagem na lista para visualizar os detalhes
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {filteredContacts.length === 0 && contacts.length > 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma mensagem encontrada
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros de busca
              </p>
            </CardContent>
          </Card>
        )}

        {contacts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma mensagem recebida
              </h3>
              <p className="text-gray-600">
                As mensagens de contato aparecerão aqui quando forem enviadas
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
