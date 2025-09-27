'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  FileText, 
  Link as LinkIcon,
  MessageSquare, 
  Settings, 
  Users,
  BarChart3,
  Menu,
  X,
  LogOut,
  Church
} from 'lucide-react'

interface AdminSidebarProps {
  user: {
    name: string
    email: string
    role: string
  }
}

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Visão geral do sistema'
  },
  {
    title: 'Eventos',
    href: '/admin/eventos',
    icon: Calendar,
    description: 'Gerenciar eventos e atividades'
  },
  {
    title: 'Sermões',
    href: '/admin/sermoes',
    icon: BookOpen,
    description: 'Gerenciar sermões e estudos'
  },
  {
    title: 'Recursos',
    href: '/admin/recursos',
    icon: FileText,
    description: 'Documentos e materiais'
  },
  {
    title: 'Links Úteis',
    href: '/admin/links',
    icon: LinkIcon,
    description: 'Links importantes'
  },
  {
    title: 'Contatos',
    href: '/admin/contatos',
    icon: MessageSquare,
    description: 'Mensagens recebidas'
  },
  {
    title: 'Analytics',
    href: '/admin/youtube-analytics',
    icon: BarChart3,
    description: 'Estatísticas do YouTube'
  },
  {
    title: 'Usuários',
    href: '/admin/usuarios',
    icon: Users,
    description: 'Gerenciar usuários'
  },
  {
    title: 'Configurações',
    href: '/admin/configuracoes',
    icon: Settings,
    description: 'Configurações da igreja'
  }
]

export function AdminSidebar({ user }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'DELETE'
      })
      
      if (response.ok) {
        window.location.href = '/admin/login'
      }
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-white shadow-md hover:bg-gray-50"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-3">
              <Church className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Painel Admin</h1>
                <p className="text-sm text-gray-500">IEB La Luz Málaga</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg transition-colors group
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
