'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from './admin-sidebar'
import { PageLoading } from '@/components/ui/page-loading'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()

        if (data.success) {
          setUser(data.user)
        } else {
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return <PageLoading />
  }

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
