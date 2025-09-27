'use client'

import { lazy, Suspense } from 'react'

// Lazy load de componentes UI pesados
const Card = lazy(() => import('./card').then(module => ({ default: module.Card })))
const CardContent = lazy(() => import('./card').then(module => ({ default: module.CardContent })))
const CardDescription = lazy(() => import('./card').then(module => ({ default: module.CardDescription })))
const CardHeader = lazy(() => import('./card').then(module => ({ default: module.CardHeader })))
const CardTitle = lazy(() => import('./card').then(module => ({ default: module.CardTitle })))

const Button = lazy(() => import('./button').then(module => ({ default: module.Button })))
const Input = lazy(() => import('./input').then(module => ({ default: module.Input })))
const Textarea = lazy(() => import('./textarea').then(module => ({ default: module.Textarea })))
const Select = lazy(() => import('./select').then(module => ({ default: module.Select })))

// Loading fallback para componentes UI
function UIComponentLoading({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  )
}

// Wrappers com Suspense
export function LazyCard({ children, ...props }: any) {
  return (
    <Suspense fallback={<UIComponentLoading className="h-32 w-full" />}>
      <Card {...props}>{children}</Card>
    </Suspense>
  )
}

export function LazyCardContent({ children, ...props }: any) {
  return (
    <Suspense fallback={<UIComponentLoading className="h-24 w-full" />}>
      <CardContent {...props}>{children}</CardContent>
    </Suspense>
  )
}

export function LazyCardDescription({ children, ...props }: any) {
  return (
    <Suspense fallback={<UIComponentLoading className="h-4 w-3/4" />}>
      <CardDescription {...props}>{children}</CardDescription>
    </Suspense>
  )
}

export function LazyCardHeader({ children, ...props }: any) {
  return (
    <Suspense fallback={<UIComponentLoading className="h-16 w-full" />}>
      <CardHeader {...props}>{children}</CardHeader>
    </Suspense>
  )
}

export function LazyCardTitle({ children, ...props }: any) {
  return (
    <Suspense fallback={<UIComponentLoading className="h-6 w-1/2" />}>
      <CardTitle {...props}>{children}</CardTitle>
    </Suspense>
  )
}

export function LazyButton({ children, ...props }: any) {
  return (
    <Suspense fallback={<UIComponentLoading className="h-10 w-24" />}>
      <Button {...props}>{children}</Button>
    </Suspense>
  )
}

export function LazyInput({ ...props }: any) {
  return (
    <Suspense fallback={<UIComponentLoading className="h-10 w-full" />}>
      <Input {...props} />
    </Suspense>
  )
}

export function LazyTextarea({ ...props }: any) {
  return (
    <Suspense fallback={<UIComponentLoading className="h-24 w-full" />}>
      <Textarea {...props} />
    </Suspense>
  )
}

export function LazySelect({ children, ...props }: any) {
  return (
    <Suspense fallback={<UIComponentLoading className="h-10 w-full" />}>
      <Select {...props}>{children}</Select>
    </Suspense>
  )
}
