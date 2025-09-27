'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { LazyEventForm } from '@/components/admin/events/lazy-event-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  MapPin, 
  Users,
  Eye,
  EyeOff
} from 'lucide-react'

interface Event {
  id: string
  title: string
  description?: string
  startDate: string
  endDate?: string
  location?: string
  capacity?: number
  isPublic: boolean
  organizer: {
    name: string
  }
}

export default function EventsManager() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      
      if (data.events) {
        setEvents(data.events)
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = () => {
    setEditingEvent(null)
    setShowForm(true)
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setShowForm(true)
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) {
      return
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setEvents(events.filter(event => event.id !== eventId))
      } else {
        alert('Erro ao excluir evento')
      }
    } catch (error) {
      console.error('Erro ao excluir evento:', error)
      alert('Erro ao excluir evento')
    }
  }

  const handleSubmitEvent = async (formData: any) => {
    setFormLoading(true)

    try {
      const eventData = {
        ...formData,
        startDate: `${formData.startDate}T${formData.startTime}`,
        endDate: formData.endDate ? `${formData.endDate}T${formData.endTime || '23:59'}` : null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        organizerId: 'temp-id' // Em produção, viria da autenticação
      }

      const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events'
      const method = editingEvent ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      })

      if (response.ok) {
        setShowForm(false)
        setEditingEvent(null)
        fetchEvents() // Recarregar lista
      } else {
        const error = await response.json()
        alert(error.message || 'Erro ao salvar evento')
      }
    } catch (error) {
      console.error('Erro ao salvar evento:', error)
      alert('Erro ao salvar evento')
    } finally {
      setFormLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date()
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
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Eventos</h1>
            <p className="text-gray-600 mt-2">Crie e organize eventos da igreja</p>
          </div>
          <button
            onClick={handleCreateEvent}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Evento</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximos Eventos</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.filter(event => isUpcoming(event.startDate)).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventos Públicos</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.filter(event => event.isPublic).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {formatDate(event.startDate)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1">
                    {event.isPublic ? (
                      <Eye className="w-4 h-4 text-green-600" title="Público" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" title="Privado" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(event.startDate)}</span>
                  {event.endDate && (
                    <>
                      <span>-</span>
                      <span>{formatTime(event.endDate)}</span>
                    </>
                  )}
                </div>

                {event.location && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                )}

                {event.capacity && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Capacidade: {event.capacity}</span>
                  </div>
                )}

                {event.description && (
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {event.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-xs text-gray-500">
                    Por: {event.organizer.name}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
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

        {events.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum evento cadastrado
              </h3>
              <p className="text-gray-600 mb-4">
                Comece criando seu primeiro evento para a igreja
              </p>
              <button
                onClick={handleCreateEvent}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Criar Primeiro Evento</span>
              </button>
            </CardContent>
          </Card>
        )}

        {/* Event Form Modal - Lazy Loaded */}
        {showForm && (
          <LazyEventForm
            initialData={editingEvent ? {
              title: editingEvent.title,
              description: editingEvent.description || '',
              startDate: editingEvent.startDate.split('T')[0],
              startTime: editingEvent.startDate.split('T')[1]?.substring(0, 5) || '',
              endDate: editingEvent.endDate?.split('T')[0] || '',
              endTime: editingEvent.endDate?.split('T')[1]?.substring(0, 5) || '',
              location: editingEvent.location || '',
              capacity: editingEvent.capacity?.toString() || '',
              isPublic: editingEvent.isPublic
            } : undefined}
            onSubmit={handleSubmitEvent}
            onCancel={() => {
              setShowForm(false)
              setEditingEvent(null)
            }}
            loading={formLoading}
          />
        )}
      </div>
    </AdminLayout>
  )
}
