'use client'

import { lazy, Suspense } from 'react'
import { CardLoading } from '@/components/ui/page-loading'

// Lazy load dos componentes pesados do dashboard
const DashboardStats = lazy(() => import('./dashboard-stats').then(module => ({ default: module.DashboardStats })))

interface LazyDashboardStatsProps {
  stats: any
}

export function LazyDashboardStats({ stats }: LazyDashboardStatsProps) {
  return (
    <Suspense fallback={<CardLoading count={4} />}>
      <DashboardStats stats={stats} />
    </Suspense>
  )
}
