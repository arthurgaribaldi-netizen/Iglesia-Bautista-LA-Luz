'use client'

import { lazy, Suspense } from 'react'
import { FormLoading } from '@/components/ui/page-loading'

// Lazy load do EventForm
const EventForm = lazy(() => import('./event-form').then(module => ({ default: module.EventForm })))

interface LazyEventFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  loading?: boolean
}

export function LazyEventForm({ initialData, onSubmit, onCancel, loading }: LazyEventFormProps) {
  return (
    <Suspense fallback={<FormLoading />}>
      <EventForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onCancel}
        loading={loading}
      />
    </Suspense>
  )
}
