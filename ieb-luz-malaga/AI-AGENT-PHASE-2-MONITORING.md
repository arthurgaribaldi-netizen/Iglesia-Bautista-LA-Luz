# 🤖 AI Agent Prompt - FASE 2: Sistema de Monitoramento
## Site IEB La Luz Málaga - Implementação de Monitoramento Avançado

### 📋 **CONTEXTO DA FASE**

Você é um agente AI especializado em implementação de sistemas de monitoramento para aplicações Next.js. Esta é a **FASE 2** de um projeto de melhorias técnicas para o site da Igreja Evangélica Bautista La Luz Málaga.

**Pré-requisito**: Fase 1 (Framework de Testes) deve estar concluída
**Objetivo da Fase**: Implementar sistema completo de monitoramento (Sentry + Analytics + Core Web Vitals)
**Duração Estimada**: 1 semana (5 dias úteis)
**Prioridade**: 🔴 ALTA
**Complexidade**: Média

### 🎯 **OBJETIVOS ESPECÍFICOS DA FASE 2**

1. **Configurar Sentry** para error tracking e performance monitoring
2. **Implementar Google Analytics 4** com Core Web Vitals
3. **Criar dashboard de monitoramento** administrativo
4. **Configurar alertas automáticos** para problemas críticos
5. **Implementar logging estruturado** com Winston

### 📁 **ESTRUTURA ATUAL DO PROJETO**

```
ieb-luz-malaga/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── types/
├── __tests__/              # ✅ Fase 1 concluída
├── .github/workflows/      # ✅ Fase 1 concluída
└── package.json
```

### 🔧 **TAREFAS DETALHADAS - DIA A DIA**

#### **DIA 1: Configuração Sentry**

**Objetivo**: Implementar error tracking e performance monitoring com Sentry

**Tarefas**:
1. **Instalar dependências Sentry**:
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configurar Sentry** (`sentry.client.config.ts`):
   ```typescript
   import * as Sentry from '@sentry/nextjs'
   
   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
     replaysSessionSampleRate: 0.1,
     replaysOnErrorSampleRate: 1.0,
     integrations: [
       new Sentry.Replay({
         maskAllText: true,
         blockAllMedia: true,
       }),
     ],
     beforeSend(event) {
       // Filter out non-critical errors in production
       if (process.env.NODE_ENV === 'production') {
         if (event.exception) {
           const error = event.exception.values?.[0]
           if (error?.type === 'ChunkLoadError' || error?.type === 'Loading chunk') {
             return null
           }
         }
       }
       return event
     },
   })
   ```

3. **Configurar Sentry Server** (`sentry.server.config.ts`):
   ```typescript
   import * as Sentry from '@sentry/nextjs'
   
   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
   })
   ```

4. **Configurar Sentry Edge** (`sentry.edge.config.ts`):
   ```typescript
   import * as Sentry from '@sentry/nextjs'
   
   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
   })
   ```

5. **Atualizar next.config.js** com Sentry:
   ```javascript
   const { withSentryConfig } = require('@sentry/nextjs')
   
   const nextConfig = {
     // ... configuração existente
   }
   
   const sentryWebpackPluginOptions = {
     org: process.env.SENTRY_ORG,
     project: process.env.SENTRY_PROJECT,
     silent: true,
   }
   
   module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)
   ```

6. **Criar middleware de monitoramento** (`src/middleware.ts`):
   ```typescript
   import { NextResponse } from 'next/server'
   import type { NextRequest } from 'next/server'
   import * as Sentry from '@sentry/nextjs'
   
   export function middleware(request: NextRequest) {
     // Track page views
     Sentry.addBreadcrumb({
       category: 'navigation',
       message: `Navigated to ${request.nextUrl.pathname}`,
       level: 'info',
     })
   
     // Track API performance
     if (request.nextUrl.pathname.startsWith('/api/')) {
       const start = Date.now()
       const response = NextResponse.next()
       const duration = Date.now() - start
   
       Sentry.addBreadcrumb({
         category: 'api',
         message: `API call to ${request.nextUrl.pathname} took ${duration}ms`,
         level: 'info',
         data: { duration, path: request.nextUrl.pathname },
       })
   
       return response
     }
   
     return NextResponse.next()
   }
   
   export const config = {
     matcher: [
       '/((?!_next/static|_next/image|favicon.ico).*)',
     ],
   }
   ```

#### **DIA 2: Google Analytics 4 e Core Web Vitals**

**Objetivo**: Implementar analytics avançado com métricas de performance

**Tarefas**:
1. **Instalar dependências Analytics**:
   ```bash
   npm install @vercel/analytics gtag
   ```

2. **Criar componente Analytics** (`src/components/analytics/google-analytics.tsx`):
   ```typescript
   'use client'
   
   import Script from 'next/script'
   import { usePathname, useSearchParams } from 'next/navigation'
   import { useEffect } from 'react'
   
   const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID
   
   export function GoogleAnalytics() {
     const pathname = usePathname()
     const searchParams = useSearchParams()
   
     useEffect(() => {
       if (!GA_TRACKING_ID) return
   
       const url = pathname + searchParams.toString()
       gtag('config', GA_TRACKING_ID, {
         page_path: url,
       })
     }, [pathname, searchParams])
   
     if (!GA_TRACKING_ID) return null
   
     return (
       <>
         <Script
           strategy="afterInteractive"
           src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
         />
         <Script
           id="google-analytics"
           strategy="afterInteractive"
           dangerouslySetInnerHTML={{
             __html: `
               window.dataLayer = window.dataLayer || [];
               function gtag(){dataLayer.push(arguments);}
               gtag('js', new Date());
               gtag('config', '${GA_TRACKING_ID}', {
                 page_path: window.location.pathname,
               });
             `,
           }}
         />
       </>
     )
   }
   ```

3. **Criar hook para Core Web Vitals** (`src/hooks/use-web-vitals.ts`):
   ```typescript
   'use client'
   
   import { useEffect } from 'react'
   import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'
   
   export function useWebVitals() {
     useEffect(() => {
       const sendToAnalytics = (metric: any) => {
         // Send to Google Analytics
         if (typeof gtag !== 'undefined') {
           gtag('event', metric.name, {
             event_category: 'Web Vitals',
             event_label: metric.id,
             value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
             non_interaction: true,
           })
         }
   
         // Send to Sentry
         if (typeof window !== 'undefined' && (window as any).Sentry) {
           (window as any).Sentry.addBreadcrumb({
             category: 'web-vitals',
             message: `${metric.name}: ${metric.value}`,
             level: 'info',
             data: {
               name: metric.name,
               value: metric.value,
               id: metric.id,
               delta: metric.delta,
             },
           })
         }
       }
   
       getCLS(sendToAnalytics)
       getFID(sendToAnalytics)
       getFCP(sendToAnalytics)
       getLCP(sendToAnalytics)
       getTTFB(sendToAnalytics)
     }, [])
   }
   ```

4. **Criar componente de monitoramento de performance** (`src/components/analytics/performance-monitor.tsx`):
   ```typescript
   'use client'
   
   import { useEffect, useState } from 'react'
   import { useWebVitals } from '@/hooks/use-web-vitals'
   
   interface PerformanceMetrics {
     lcp: number | null
     fid: number | null
     cls: number | null
     fcp: number | null
     ttfb: number | null
   }
   
   export function PerformanceMonitor() {
     const [metrics, setMetrics] = useState<PerformanceMetrics>({
       lcp: null,
       fid: null,
       cls: null,
       fcp: null,
       ttfb: null,
     })
   
     useWebVitals()
   
     useEffect(() => {
       const observer = new PerformanceObserver((list) => {
         for (const entry of list.getEntries()) {
           if (entry.entryType === 'largest-contentful-paint') {
             setMetrics(prev => ({ ...prev, lcp: entry.startTime }))
           }
           if (entry.entryType === 'first-input') {
             setMetrics(prev => ({ ...prev, fid: (entry as any).processingStart - entry.startTime }))
           }
           if (entry.entryType === 'first-contentful-paint') {
             setMetrics(prev => ({ ...prev, fcp: entry.startTime }))
           }
         }
       })
   
       observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'first-contentful-paint'] })
   
       return () => observer.disconnect()
     }, [])
   
     // Only show in development
     if (process.env.NODE_ENV !== 'development') return null
   
     return (
       <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs font-mono z-50">
         <div>LCP: {metrics.lcp ? `${metrics.lcp.toFixed(0)}ms` : 'N/A'}</div>
         <div>FID: {metrics.fid ? `${metrics.fid.toFixed(0)}ms` : 'N/A'}</div>
         <div>CLS: {metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}</div>
         <div>FCP: {metrics.fcp ? `${metrics.fcp.toFixed(0)}ms` : 'N/A'}</div>
       </div>
     )
   }
   ```

5. **Atualizar layout principal** (`src/app/layout.tsx`):
   ```typescript
   import { GoogleAnalytics } from '@/components/analytics/google-analytics'
   import { PerformanceMonitor } from '@/components/analytics/performance-monitor'
   
   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="es">
         <head>
           <GoogleAnalytics />
         </head>
         <body>
           {children}
           <PerformanceMonitor />
         </body>
       </html>
     )
   }
   ```

#### **DIA 3: Dashboard de Monitoramento**

**Objetivo**: Criar dashboard administrativo para visualizar métricas

**Tarefas**:
1. **Criar API de métricas** (`src/app/api/admin/metrics/route.ts`):
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { getServerSession } from 'next-auth'
   import { authOptions } from '@/lib/auth'
   
   export async function GET(request: NextRequest) {
     const session = await getServerSession(authOptions)
     
     if (!session || session.user.role !== 'admin') {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
     }
   
     // Mock data - in production, this would come from your analytics service
     const metrics = {
       performance: {
         lcp: 2.1,
         fid: 45,
         cls: 0.05,
         fcp: 1.2,
         ttfb: 180,
       },
       errors: {
         total: 12,
         critical: 2,
         resolved: 8,
         new: 4,
       },
       traffic: {
         pageViews: 1250,
         uniqueVisitors: 890,
         bounceRate: 0.35,
         avgSessionDuration: 180,
       },
       uptime: {
         current: 99.9,
         last24h: 99.8,
         last7d: 99.7,
       },
     }
   
     return NextResponse.json(metrics)
   }
   ```

2. **Criar componente de dashboard** (`src/components/admin/metrics-dashboard.tsx`):
   ```typescript
   'use client'
   
   import { useEffect, useState } from 'react'
   import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
   import { Badge } from '@/components/ui/badge'
   import { AlertTriangle, CheckCircle, Clock, Users, Eye, Zap } from 'lucide-react'
   
   interface MetricsData {
     performance: {
       lcp: number
       fid: number
       cls: number
       fcp: number
       ttfb: number
     }
     errors: {
       total: number
       critical: number
       resolved: number
       new: number
     }
     traffic: {
       pageViews: number
       uniqueVisitors: number
       bounceRate: number
       avgSessionDuration: number
     }
     uptime: {
       current: number
       last24h: number
       last7d: number
     }
   }
   
   export function MetricsDashboard() {
     const [metrics, setMetrics] = useState<MetricsData | null>(null)
     const [loading, setLoading] = useState(true)
   
     useEffect(() => {
       const fetchMetrics = async () => {
         try {
           const response = await fetch('/api/admin/metrics')
           const data = await response.json()
           setMetrics(data)
         } catch (error) {
           console.error('Error fetching metrics:', error)
         } finally {
           setLoading(false)
         }
       }
   
       fetchMetrics()
       const interval = setInterval(fetchMetrics, 30000) // Update every 30 seconds
   
       return () => clearInterval(interval)
     }, [])
   
     if (loading) {
       return <div className="p-6">Loading metrics...</div>
     }
   
     if (!metrics) {
       return <div className="p-6 text-red-500">Error loading metrics</div>
     }
   
     const getPerformanceStatus = (value: number, threshold: number, type: 'lower' | 'higher' = 'lower') => {
       if (type === 'lower') {
         return value <= threshold ? 'good' : 'warning'
       } else {
         return value >= threshold ? 'good' : 'warning'
       }
     }
   
     return (
       <div className="p-6 space-y-6">
         <h1 className="text-3xl font-bold">Dashboard de Monitoramento</h1>
         
         {/* Performance Metrics */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">LCP</CardTitle>
               <Zap className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{metrics.performance.lcp}s</div>
               <Badge variant={getPerformanceStatus(metrics.performance.lcp, 2.5) === 'good' ? 'default' : 'destructive'}>
                 {getPerformanceStatus(metrics.performance.lcp, 2.5) === 'good' ? 'Good' : 'Needs Improvement'}
               </Badge>
             </CardContent>
           </Card>
   
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">FID</CardTitle>
               <Clock className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{metrics.performance.fid}ms</div>
               <Badge variant={getPerformanceStatus(metrics.performance.fid, 100) === 'good' ? 'default' : 'destructive'}>
                 {getPerformanceStatus(metrics.performance.fid, 100) === 'good' ? 'Good' : 'Needs Improvement'}
               </Badge>
             </CardContent>
           </Card>
   
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">CLS</CardTitle>
               <AlertTriangle className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{metrics.performance.cls}</div>
               <Badge variant={getPerformanceStatus(metrics.performance.cls, 0.1) === 'good' ? 'default' : 'destructive'}>
                 {getPerformanceStatus(metrics.performance.cls, 0.1) === 'good' ? 'Good' : 'Needs Improvement'}
               </Badge>
             </CardContent>
           </Card>
   
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">FCP</CardTitle>
               <Zap className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{metrics.performance.fcp}s</div>
               <Badge variant={getPerformanceStatus(metrics.performance.fcp, 1.8) === 'good' ? 'default' : 'destructive'}>
                 {getPerformanceStatus(metrics.performance.fcp, 1.8) === 'good' ? 'Good' : 'Needs Improvement'}
               </Badge>
             </CardContent>
           </Card>
         </div>
   
         {/* Error Tracking */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
               <AlertTriangle className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{metrics.errors.total}</div>
               <p className="text-xs text-muted-foreground">Last 24 hours</p>
             </CardContent>
           </Card>
   
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Critical</CardTitle>
               <AlertTriangle className="h-4 w-4 text-red-500" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-red-500">{metrics.errors.critical}</div>
               <p className="text-xs text-muted-foreground">Requires immediate attention</p>
             </CardContent>
           </Card>
   
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Resolved</CardTitle>
               <CheckCircle className="h-4 w-4 text-green-500" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-green-500">{metrics.errors.resolved}</div>
               <p className="text-xs text-muted-foreground">Fixed in last 24h</p>
             </CardContent>
           </Card>
   
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">New</CardTitle>
               <AlertTriangle className="h-4 w-4 text-yellow-500" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-yellow-500">{metrics.errors.new}</div>
               <p className="text-xs text-muted-foreground">First occurrence</p>
             </CardContent>
           </Card>
         </div>
   
         {/* Traffic Metrics */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Page Views</CardTitle>
               <Eye className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{metrics.traffic.pageViews.toLocaleString()}</div>
               <p className="text-xs text-muted-foreground">Last 24 hours</p>
             </CardContent>
           </Card>
   
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
               <Users className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{metrics.traffic.uniqueVisitors.toLocaleString()}</div>
               <p className="text-xs text-muted-foreground">Last 24 hours</p>
             </CardContent>
           </Card>
   
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
               <Users className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{(metrics.traffic.bounceRate * 100).toFixed(1)}%</div>
               <p className="text-xs text-muted-foreground">Lower is better</p>
             </CardContent>
           </Card>
   
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
               <Clock className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{Math.floor(metrics.traffic.avgSessionDuration / 60)}m</div>
               <p className="text-xs text-muted-foreground">Average duration</p>
             </CardContent>
           </Card>
         </div>
       </div>
     )
   }
   ```

3. **Criar página de monitoramento** (`src/app/admin/monitoring/page.tsx`):
   ```typescript
   import { MetricsDashboard } from '@/components/admin/metrics-dashboard'
   import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
   
   export default function MonitoringPage() {
     return (
       <div className="container mx-auto py-6">
         <MetricsDashboard />
       </div>
     )
   }
   ```

#### **DIA 4: Sistema de Alertas e Logging**

**Objetivo**: Implementar alertas automáticos e logging estruturado

**Tarefas**:
1. **Instalar dependências de logging**:
   ```bash
   npm install winston winston-daily-rotate-file
   ```

2. **Criar sistema de logging** (`src/lib/logger.ts`):
   ```typescript
   import winston from 'winston'
   import DailyRotateFile from 'winston-daily-rotate-file'
   
   const logFormat = winston.format.combine(
     winston.format.timestamp(),
     winston.format.errors({ stack: true }),
     winston.format.json()
   )
   
   const logger = winston.createLogger({
     level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
     format: logFormat,
     defaultMeta: { service: 'ieb-luz-malaga' },
     transports: [
       new DailyRotateFile({
         filename: 'logs/error-%DATE%.log',
         datePattern: 'YYYY-MM-DD',
         level: 'error',
         maxSize: '20m',
         maxFiles: '14d',
       }),
       new DailyRotateFile({
         filename: 'logs/combined-%DATE%.log',
         datePattern: 'YYYY-MM-DD',
         maxSize: '20m',
         maxFiles: '14d',
       }),
     ],
   })
   
   if (process.env.NODE_ENV !== 'production') {
     logger.add(new winston.transports.Console({
       format: winston.format.combine(
         winston.format.colorize(),
         winston.format.simple()
       )
     }))
   }
   
   export default logger
   ```

3. **Criar sistema de alertas** (`src/lib/alerts.ts`):
   ```typescript
   import logger from './logger'
   
   interface AlertConfig {
     type: 'error' | 'performance' | 'security' | 'uptime'
     threshold: number
     message: string
     severity: 'low' | 'medium' | 'high' | 'critical'
   }
   
   const alertConfigs: AlertConfig[] = [
     {
       type: 'performance',
       threshold: 2.5,
       message: 'LCP exceeded threshold',
       severity: 'high',
     },
     {
       type: 'error',
       threshold: 10,
       message: 'High error rate detected',
       severity: 'critical',
     },
     {
       type: 'uptime',
       threshold: 99.5,
       message: 'Uptime below threshold',
       severity: 'critical',
     },
   ]
   
   export function checkAlerts(metrics: any) {
     alertConfigs.forEach(config => {
       let value = 0
       
       switch (config.type) {
         case 'performance':
           value = metrics.performance?.lcp || 0
           break
         case 'error':
           value = metrics.errors?.total || 0
           break
         case 'uptime':
           value = metrics.uptime?.current || 100
           break
       }
   
       const shouldAlert = config.type === 'uptime' 
         ? value < config.threshold 
         : value > config.threshold
   
       if (shouldAlert) {
         logger.error(`ALERT: ${config.message}`, {
           type: config.type,
           severity: config.severity,
           value,
           threshold: config.threshold,
           timestamp: new Date().toISOString(),
         })
   
         // Send to Sentry
         if (typeof window !== 'undefined' && (window as any).Sentry) {
           (window as any).Sentry.captureMessage(config.message, {
             level: config.severity === 'critical' ? 'error' : 'warning',
             tags: {
               alertType: config.type,
               severity: config.severity,
             },
             extra: {
               value,
               threshold: config.threshold,
             },
           })
         }
       }
     })
   }
   ```

4. **Criar API de alertas** (`src/app/api/admin/alerts/route.ts`):
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { getServerSession } from 'next-auth'
   import { authOptions } from '@/lib/auth'
   import { checkAlerts } from '@/lib/alerts'
   
   export async function POST(request: NextRequest) {
     const session = await getServerSession(authOptions)
     
     if (!session || session.user.role !== 'admin') {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
     }
   
     try {
       const metrics = await request.json()
       checkAlerts(metrics)
       
       return NextResponse.json({ success: true })
     } catch (error) {
       return NextResponse.json({ error: 'Failed to process alerts' }, { status: 500 })
     }
   }
   ```

5. **Atualizar componente de métricas** para incluir alertas:
   ```typescript
   // Adicionar ao MetricsDashboard
   useEffect(() => {
     const fetchMetrics = async () => {
       try {
         const response = await fetch('/api/admin/metrics')
         const data = await response.json()
         setMetrics(data)
         
         // Check for alerts
         await fetch('/api/admin/alerts', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(data),
         })
       } catch (error) {
         console.error('Error fetching metrics:', error)
       } finally {
         setLoading(false)
       }
     }
   
     fetchMetrics()
     const interval = setInterval(fetchMetrics, 30000)
   
     return () => clearInterval(interval)
   }, [])
   ```

#### **DIA 5: Integração e Otimizações**

**Objetivo**: Integrar todos os sistemas e otimizar configurações

**Tarefas**:
1. **Criar arquivo de configuração de ambiente** (`.env.example`):
   ```env
   # Sentry
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
   SENTRY_ORG=your_sentry_org
   SENTRY_PROJECT=your_sentry_project
   
   # Google Analytics
   NEXT_PUBLIC_GA_ID=your_ga_id_here
   
   # Monitoring
   MONITORING_ENABLED=true
   ALERT_EMAIL=admin@ieblaluzmalaga.com
   ```

2. **Criar script de setup** (`scripts/setup-monitoring.js`):
   ```javascript
   const fs = require('fs')
   const path = require('path')
   
   console.log('Setting up monitoring...')
   
   // Create logs directory
   const logsDir = path.join(process.cwd(), 'logs')
   if (!fs.existsSync(logsDir)) {
     fs.mkdirSync(logsDir)
     console.log('✅ Created logs directory')
   }
   
   // Create .env.local if it doesn't exist
   const envPath = path.join(process.cwd(), '.env.local')
   if (!fs.existsSync(envPath)) {
     const envContent = `# Copy from .env.example and fill in your values
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
NEXT_PUBLIC_GA_ID=
MONITORING_ENABLED=true
`
     fs.writeFileSync(envPath, envContent)
     console.log('✅ Created .env.local template')
   }
   
   console.log('🎉 Monitoring setup complete!')
   console.log('📝 Next steps:')
   console.log('1. Fill in your .env.local with actual values')
   console.log('2. Run: npm run dev')
   console.log('3. Visit /admin/monitoring to see the dashboard')
   ```

3. **Atualizar package.json** com scripts de monitoramento:
   ```json
   {
     "scripts": {
       "setup:monitoring": "node scripts/setup-monitoring.js",
       "logs:view": "tail -f logs/combined-$(date +%Y-%m-%d).log",
       "logs:error": "tail -f logs/error-$(date +%Y-%m-%d).log"
     }
   }
   ```

4. **Criar documentação de monitoramento** (`MONITORING.md`):
   ```markdown
   # 📊 Sistema de Monitoramento - IEB La Luz Málaga
   
   ## Configuração
   
   ### 1. Variáveis de Ambiente
   Copie `.env.example` para `.env.local` e configure:
   - `NEXT_PUBLIC_SENTRY_DSN`: DSN do Sentry
   - `NEXT_PUBLIC_GA_ID`: ID do Google Analytics
   
   ### 2. Dashboard
   Acesse `/admin/monitoring` para ver métricas em tempo real.
   
   ### 3. Logs
   - Logs gerais: `logs/combined-YYYY-MM-DD.log`
   - Logs de erro: `logs/error-YYYY-MM-DD.log`
   
   ## Métricas Monitoradas
   
   - **Performance**: LCP, FID, CLS, FCP, TTFB
   - **Errors**: Total, críticos, resolvidos, novos
   - **Traffic**: Page views, visitantes únicos, bounce rate
   - **Uptime**: Disponibilidade atual e histórica
   
   ## Alertas
   
   - LCP > 2.5s: Alerta de performance
   - Erros > 10/hora: Alerta crítico
   - Uptime < 99.5%: Alerta crítico
   ```

5. **Criar testes para monitoramento** (`__tests__/monitoring.test.ts`):
   ```typescript
   import { checkAlerts } from '@/lib/alerts'
   
   describe('Alert System', () => {
     it('should trigger performance alert for high LCP', () => {
       const metrics = {
         performance: { lcp: 3.0 },
         errors: { total: 5 },
         uptime: { current: 99.9 },
       }
   
       const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
       checkAlerts(metrics)
       expect(consoleSpy).toHaveBeenCalled()
       consoleSpy.mockRestore()
     })
   
     it('should trigger error alert for high error count', () => {
       const metrics = {
         performance: { lcp: 2.0 },
         errors: { total: 15 },
         uptime: { current: 99.9 },
       }
   
       const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
       checkAlerts(metrics)
       expect(consoleSpy).toHaveBeenCalled()
       consoleSpy.mockRestore()
     })
   })
   ```

### 📊 **MÉTRICAS DE SUCESSO DA FASE 2**

#### **Monitoramento**
- **Sentry**: Configurado e funcionando
- **Google Analytics**: Ativo e coletando dados
- **Core Web Vitals**: Monitorados em tempo real
- **Dashboard**: Funcional e atualizado

#### **Alertas**
- **Sistema de alertas**: Funcionando
- **Logging**: Estruturado e rotativo
- **Notificações**: Configuradas para problemas críticos

#### **Performance**
- **Tempo de resposta**: <500ms para APIs
- **Uptime**: >99.9%
- **Error rate**: <0.1%

### 🔍 **CHECKLIST DE VALIDAÇÃO**

#### **Configuração**
- [ ] Sentry configurado e funcionando
- [ ] Google Analytics 4 ativo
- [ ] Core Web Vitals sendo coletados
- [ ] Dashboard de monitoramento acessível

#### **Alertas e Logging**
- [ ] Sistema de alertas funcionando
- [ ] Logs sendo gerados corretamente
- [ ] Rotação de logs configurada
- [ ] Alertas sendo enviados para Sentry

#### **Integração**
- [ ] Todos os sistemas integrados
- [ ] Métricas sendo coletadas
- [ ] Dashboard atualizando em tempo real
- [ ] Testes de monitoramento passando

### 📝 **ENTREGÁVEIS DA FASE 2**

1. **Código**:
   - Sentry configurado
   - Google Analytics 4 implementado
   - Dashboard de monitoramento
   - Sistema de alertas
   - Logging estruturado

2. **Configurações**:
   - Variáveis de ambiente
   - Scripts de setup
   - Configurações de logging

3. **Documentação**:
   - Guia de monitoramento
   - Instruções de configuração
   - Troubleshooting

### 🚀 **PRÓXIMA FASE**

Após completar a Fase 2, a **Fase 3** focará em:
- Sistema de Cache Avançado (Redis + Vercel Edge Cache)
- Otimizações de performance
- Estratégias de cache inteligente

---

**✅ STATUS**: Pronto para implementação
**⏱️ DURAÇÃO**: 5 dias úteis
**🎯 FOCO**: Monitoramento e observabilidade completa
