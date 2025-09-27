'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { ErrorMessage, MessageType } from '@/lib/error-messages'

interface Notification extends ErrorMessage {
  id: string
  timestamp: number
  autoClose?: boolean
  duration?: number
}

interface NotificationContextType {
  notifications: Notification[]
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  showError: (title: string, message: string, action?: string) => void
  showSuccess: (title: string, message: string) => void
  showWarning: (title: string, message: string) => void
  showInfo: (title: string, message: string) => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: React.ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const showNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const timestamp = Date.now()
    
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp,
      autoClose: notification.autoClose ?? true,
      duration: notification.duration ?? (notification.type === 'error' ? 8000 : 5000)
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto remove se configurado
    if (newNotification.autoClose) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
  }, [removeNotification])

  const showError = useCallback((title: string, message: string, action?: string) => {
    showNotification({
      type: 'error',
      category: 'unknown',
      title,
      message,
      action,
      code: 'CUSTOM_ERROR'
    })
  }, [showNotification])

  const showSuccess = useCallback((title: string, message: string) => {
    showNotification({
      type: 'success',
      category: 'validation',
      title,
      message,
      code: 'CUSTOM_SUCCESS'
    })
  }, [showNotification])

  const showWarning = useCallback((title: string, message: string) => {
    showNotification({
      type: 'warning',
      category: 'unknown',
      title,
      message,
      code: 'CUSTOM_WARNING'
    })
  }, [showNotification])

  const showInfo = useCallback((title: string, message: string) => {
    showNotification({
      type: 'info',
      category: 'unknown',
      title,
      message,
      code: 'CUSTOM_INFO'
    })
  }, [showNotification])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const contextValue: NotificationContextType = {
    notifications,
    showNotification,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    removeNotification,
    clearAllNotifications
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  )
}

interface NotificationContainerProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

function NotificationContainer({ notifications, onRemove }: NotificationContainerProps) {
  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

interface NotificationItemProps {
  notification: Notification
  onRemove: (id: string) => void
}

function NotificationItem({ notification, onRemove }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getTextColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-800'
      case 'error':
        return 'text-red-800'
      case 'warning':
        return 'text-yellow-800'
      case 'info':
        return 'text-blue-800'
      default:
        return 'text-gray-800'
    }
  }

  return (
    <div
      className={`
        ${getBackgroundColor()}
        border rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out
        transform translate-x-0 opacity-100
        hover:shadow-xl
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium ${getTextColor()}`}>
            {notification.title}
          </h4>
          <p className={`text-sm mt-1 ${getTextColor()} opacity-90`}>
            {notification.message}
          </p>
          
          {notification.action && (
            <button
              className={`text-xs font-medium mt-2 ${getTextColor()} hover:underline`}
              onClick={() => {
                // Aqui você pode implementar ações específicas baseadas no código
                onRemove(notification.id)
              }}
            >
              {notification.action}
            </button>
          )}
        </div>
        
        <button
          onClick={() => onRemove(notification.id)}
          className={`flex-shrink-0 ml-2 ${getTextColor()} opacity-70 hover:opacity-100 transition-opacity`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Hook para mostrar notificações de forma mais simples
export function useToast() {
  const { showError, showSuccess, showWarning, showInfo } = useNotifications()

  return {
    error: showError,
    success: showSuccess,
    warning: showWarning,
    info: showInfo
  }
}
