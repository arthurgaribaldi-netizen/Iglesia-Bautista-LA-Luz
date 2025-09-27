'use client'

import { lazy, Suspense } from 'react'
import { PageLoading } from '@/components/ui/page-loading'

// Lazy load das páginas admin secundárias
const ContatosPage = lazy(() => import('@/app/admin/contatos/page').then(module => ({ default: module.default })))
const RecursosPage = lazy(() => import('@/app/admin/recursos/page').then(module => ({ default: module.default })))
const LinksPage = lazy(() => import('@/app/admin/links/page').then(module => ({ default: module.default })))
const ConfiguracoesPage = lazy(() => import('@/app/admin/configuracoes/page').then(module => ({ default: module.default })))

interface LazyAdminPageProps {
  pageType: 'contatos' | 'recursos' | 'links' | 'configuracoes'
}

export function LazyAdminPage({ pageType }: LazyAdminPageProps) {
  const renderPage = () => {
    switch (pageType) {
      case 'contatos':
        return <ContatosPage />
      case 'recursos':
        return <RecursosPage />
      case 'links':
        return <LinksPage />
      case 'configuracoes':
        return <ConfiguracoesPage />
      default:
        return <div>Página não encontrada</div>
    }
  }

  return (
    <Suspense fallback={<PageLoading message="Carregando página..." />}>
      {renderPage()}
    </Suspense>
  )
}
