'use client'

import { useState } from 'react'
import { BookOpen, Calendar, User, Link, FileText, Save, X, Upload } from 'lucide-react'

interface SermonFormData {
  title: string
  pastor: string
  date: string
  series: string
  description: string
  audioUrl: string
  videoUrl: string
  transcript: string
}

interface SermonFormProps {
  initialData?: Partial<SermonFormData>
  onSubmit: (data: SermonFormData) => void
  onCancel: () => void
  loading?: boolean
}

export function SermonForm({ initialData, onSubmit, onCancel, loading }: SermonFormProps) {
  const [formData, setFormData] = useState<SermonFormData>({
    title: initialData?.title || '',
    pastor: initialData?.pastor || '',
    date: initialData?.date || '',
    series: initialData?.series || '',
    description: initialData?.description || '',
    audioUrl: initialData?.audioUrl || '',
    videoUrl: initialData?.videoUrl || '',
    transcript: initialData?.transcript || ''
  })

  const [errors, setErrors] = useState<Partial<SermonFormData>>({})
  const [uploadingAudio, setUploadingAudio] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<SermonFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório'
    }

    if (!formData.pastor.trim()) {
      newErrors.pastor = 'Nome do pastor é obrigatório'
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof SermonFormData, value: string) => {
    setFormData(prev => ({
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

  const handleFileUpload = async (file: File, type: 'audio' | 'video') => {
    const setUploading = type === 'audio' ? setUploadingAudio : setUploadingVideo
    const field = type === 'audio' ? 'audioUrl' : 'videoUrl'
    
    setUploading(true)
    
    try {
      // Simular upload - em produção, implementar upload real
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular URL retornada
      const mockUrl = `https://example.com/uploads/${type}/${file.name}`
      handleChange(field, mockUrl)
      
      alert(`${type === 'audio' ? 'Áudio' : 'Vídeo'} enviado com sucesso!`)
    } catch (error) {
      alert(`Erro ao enviar ${type === 'audio' ? 'áudio' : 'vídeo'}`)
    } finally {
      setUploading(false)
    }
  }

  const getTodayString = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                {initialData ? 'Editar Sermão' : 'Novo Sermão'}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título e Pastor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Sermão *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: A Fé que Move Montanhas"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pastor/Pregador *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.pastor}
                    onChange={(e) => handleChange('pastor', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.pastor ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Pastor João Silva"
                  />
                </div>
                {errors.pastor && (
                  <p className="text-red-500 text-sm mt-1">{errors.pastor}</p>
                )}
              </div>
            </div>

            {/* Data e Série */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data do Sermão *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    max={getTodayString()}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.date ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Série (opcional)
                </label>
                <input
                  type="text"
                  value={formData.series}
                  onChange={(e) => handleChange('series', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Estudos em Gálatas"
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Breve descrição do sermão, versículos principais..."
                />
              </div>
            </div>

            {/* Upload de Arquivos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Upload de Áudio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arquivo de Áudio
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      {formData.audioUrl ? 'Áudio carregado ✓' : 'Clique para enviar áudio'}
                    </p>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, 'audio')
                      }}
                      disabled={uploadingAudio}
                      className="hidden"
                      id="audio-upload"
                    />
                    <label
                      htmlFor="audio-upload"
                      className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${
                        uploadingAudio ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {uploadingAudio ? 'Enviando...' : 'Selecionar Áudio'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Upload de Vídeo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arquivo de Vídeo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      {formData.videoUrl ? 'Vídeo carregado ✓' : 'Clique para enviar vídeo'}
                    </p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, 'video')
                      }}
                      disabled={uploadingVideo}
                      className="hidden"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${
                        uploadingVideo ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {uploadingVideo ? 'Enviando...' : 'Selecionar Vídeo'}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* URLs Alternativas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL do Áudio (alternativa)
                </label>
                <div className="relative">
                  <Link className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.audioUrl}
                    onChange={(e) => handleChange('audioUrl', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://exemplo.com/audio.mp3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL do Vídeo (alternativa)
                </label>
                <div className="relative">
                  <Link className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => handleChange('videoUrl', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>
            </div>

            {/* Transcrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transcrição (opcional)
              </label>
              <textarea
                value={formData.transcript}
                onChange={(e) => handleChange('transcript', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Transcrição completa do sermão..."
              />
              <p className="text-xs text-gray-500 mt-1">
                A transcrição ajuda na busca e acessibilidade do conteúdo
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || uploadingAudio || uploadingVideo}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Salvando...' : 'Salvar Sermão'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
