// Sistema de upload de arquivos
// Em produção, implementar com AWS S3, Cloudinary, ou similar

import { useState } from 'react'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
  filename?: string
  size?: number
}

export async function uploadFile(file: File, type: 'audio' | 'video' | 'document' | 'image'): Promise<UploadResult> {
  try {
    // Validações básicas
    const maxSize = getMaxSizeForType(type)
    if (file.size > maxSize) {
      return {
        success: false,
        error: `Arquivo muito grande. Máximo permitido: ${formatFileSize(maxSize)}`
      }
    }

    // Validar tipo de arquivo
    if (!isValidFileType(file, type)) {
      return {
        success: false,
        error: `Tipo de arquivo inválido para ${type}`
      }
    }

    // Simular upload - em produção, implementar upload real
    await simulateUpload(file)

    // Simular URL retornada
    const filename = generateUniqueFilename(file.name)
    const url = `https://uploads.iglesiabautistalaluz.es/${type}/${filename}`

    return {
      success: true,
      url,
      filename,
      size: file.size
    }
  } catch (error) {
    console.error('Erro no upload:', error)
    return {
      success: false,
      error: 'Erro interno no upload'
    }
  }
}

function getMaxSizeForType(type: string): number {
  const sizes = {
    image: 5 * 1024 * 1024, // 5MB
    audio: 50 * 1024 * 1024, // 50MB
    video: 200 * 1024 * 1024, // 200MB
    document: 10 * 1024 * 1024 // 10MB
  }
  return sizes[type as keyof typeof sizes] || sizes.document
}

function isValidFileType(file: File, type: string): boolean {
  const validTypes = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    audio: ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/ogg'],
    video: ['video/mp4', 'video/webm', 'video/ogg'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  }
  
  const allowedTypes = validTypes[type as keyof typeof validTypes]
  return allowedTypes ? allowedTypes.includes(file.type) : false
}

function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  return `${timestamp}_${random}.${extension}`
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

async function simulateUpload(file: File): Promise<void> {
  // Simular tempo de upload baseado no tamanho do arquivo
  const uploadTime = Math.min(file.size / (1024 * 1024), 5) * 1000 // Max 5 segundos
  await new Promise(resolve => setTimeout(resolve, uploadTime))
}

// Hook para upload com progresso
export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File, type: 'audio' | 'video' | 'document' | 'image') => {
    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const result = await uploadFile(file, type)
      
      clearInterval(progressInterval)
      setProgress(100)

      if (!result.success) {
        setError(result.error || 'Erro no upload')
        return result
      }

      return result
    } catch (error) {
      setError('Erro inesperado no upload')
      return { success: false, error: 'Erro inesperado no upload' }
    } finally {
      setUploading(false)
      setTimeout(() => {
        setProgress(0)
        setError(null)
      }, 2000)
    }
  }

  return { upload, uploading, progress, error }
}

// Componente de upload com drag & drop
export function FileUploadZone({ 
  onUpload, 
  type, 
  accept, 
  maxSize 
}: {
  onUpload: (file: File) => void
  type: 'audio' | 'video' | 'document' | 'image'
  accept: string
  maxSize: number
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const { uploading, progress, error } = useFileUpload()

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const file = files[0]
      if (file.size <= maxSize) {
        onUpload(file)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.size <= maxSize) {
        onUpload(file)
      }
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragOver 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
      } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
    >
      {uploading ? (
        <div className="space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-600">Enviando arquivo...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">{progress}% concluído</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {isDragOver ? 'Solte o arquivo aqui' : 'Arraste um arquivo aqui ou clique para selecionar'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Máximo: {formatFileSize(maxSize)}
              </p>
            </div>
            <input
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              className="hidden"
              id={`file-upload-${type}`}
            />
            <label
              htmlFor={`file-upload-${type}`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              Selecionar Arquivo
            </label>
          </div>
          
          {error && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
