'use client'

import { lazy, Suspense } from 'react'
import { FormLoading } from '@/components/ui/page-loading'

// Lazy load do SermonForm
const SermonForm = lazy(() => import('./sermon-form').then(module => ({ default: module.SermonForm })))

interface LazySermonFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  loading?: boolean
}

export function LazySermonForm({ initialData, onSubmit, onCancel, loading }: LazySermonFormProps) {
  return (
    <Suspense fallback={<FormLoading />}>
      <SermonForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onCancel}
        loading={loading}
      />
    </Suspense>
  )
}
