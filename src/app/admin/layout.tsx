'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { PageLoading } from '@/components/ui/page-loading'
import { useErrorHandler } from '@/hooks/use-error-handler'

interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'EDITOR' | 'MEMBER'
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { handleError } = useErrorHandler()

  // Rotas que não precisam de autenticação
  const publicRoutes = ['/admin/login']
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    const checkAuth = async () => {
      // Se for rota pública, não verificar autenticação
      if (isPublicRoute) {
        setLoading(false)
        return
      }

      try {
        setAuthError(null)
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (data.success && data.user) {
          setUser(data.user)
          
          // Verificar se o usuário tem permissão para acessar rotas administrativas
          if (data.user.role === 'MEMBER' && pathname !== '/admin') {
            router.push('/admin')
            return
          }
        } else {
          // Se não estiver autenticado, redirecionar para login
          router.push('/admin/login')
          return
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        setAuthError('Erro de conexão. Verifique sua internet.')
        handleError(error as Error, 'Erro na autenticação')
        
        // Em caso de erro, redirecionar para login após um delay
        setTimeout(() => {
          router.push('/admin/login')
        }, 2000)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, pathname, isPublicRoute, handleError])

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <PageLoading 
          message="Verificando autenticação..." 
          size="lg" 
        />
      </div>
    )
  }

  // Se for rota pública (login), renderizar sem layout
  if (isPublicRoute) {
    return <>{children}</>
  }

  // Se houver erro de autenticação, mostrar mensagem
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Erro de Autenticação</h2>
            <p className="text-gray-600 mb-4">{authError}</p>
            <p className="text-sm text-gray-500">Redirecionando para o login...</p>
          </div>
        </div>
      </div>
    )
  }

  // Se não há usuário autenticado, não renderizar nada (será redirecionado)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar user={user} />
      
      {/* Main content */}
      <div className="lg:ml-80">
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<PageLoading message="Carregando conteúdo..." />}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
