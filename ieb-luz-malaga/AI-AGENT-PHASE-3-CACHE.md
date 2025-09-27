# 🤖 AI Agent Prompt - FASE 3: Sistema de Cache Avançado
## Site IEB La Luz Málaga - Implementação de Cache Inteligente

### 📋 **CONTEXTO DA FASE**

Você é um agente AI especializado em implementação de sistemas de cache para aplicações Next.js. Esta é a **FASE 3** de um projeto de melhorias técnicas para o site da Igreja Evangélica Bautista La Luz Málaga.

**Pré-requisitos**: Fase 1 (Testes) e Fase 2 (Monitoramento) devem estar concluídas
**Objetivo da Fase**: Implementar sistema completo de cache (Redis + Vercel Edge Cache + Otimizações)
**Duração Estimada**: 1 semana (5 dias úteis)
**Prioridade**: 🔴 ALTA
**Complexidade**: Média-Alta

### 🎯 **OBJETIVOS ESPECÍFICOS DA FASE 3**

1. **Configurar Redis Cache** para dados dinâmicos e APIs
2. **Implementar Vercel Edge Cache** para conteúdo estático
3. **Criar estratégias de cache inteligente** (Cache First, Network First, Stale While Revalidate)
4. **Otimizar performance** com cache de imagens e assets
5. **Implementar invalidação de cache** automática e manual

### 🔧 **TAREFAS DETALHADAS - DIA A DIA**

#### **DIA 1: Configuração Redis Cache**

**Objetivo**: Implementar cache Redis para APIs e dados dinâmicos

**Tarefas**:
1. **Instalar dependências Redis**:
   ```bash
   npm install redis ioredis
   npm install --save-dev @types/redis
   ```

2. **Criar cliente Redis** (`src/lib/redis.ts`):
   ```typescript
   import Redis from 'ioredis'
   
   const redis = new Redis({
     host: process.env.REDIS_HOST || 'localhost',
     port: parseInt(process.env.REDIS_PORT || '6379'),
     password: process.env.REDIS_PASSWORD,
     retryDelayOnFailover: 100,
     maxRetriesPerRequest: 3,
     lazyConnect: true,
   })
   
   redis.on('error', (err) => {
     console.error('Redis Client Error:', err)
   })
   
   redis.on('connect', () => {
     console.log('Redis Client Connected')
   })
   
   export default redis
   ```

3. **Criar utilitários de cache** (`src/lib/cache-utils.ts`):
   ```typescript
   import redis from './redis'
   
   export interface CacheOptions {
     ttl?: number // Time to live in seconds
     tags?: string[] // Cache tags for invalidation
   }
   
   export class CacheManager {
     private static instance: CacheManager
     private redis = redis
   
     static getInstance(): CacheManager {
       if (!CacheManager.instance) {
         CacheManager.instance = new CacheManager()
       }
       return CacheManager.instance
     }
   
     async get<T>(key: string): Promise<T | null> {
       try {
         const value = await this.redis.get(key)
         return value ? JSON.parse(value) : null
       } catch (error) {
         console.error('Cache get error:', error)
         return null
       }
     }
   
     async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
       try {
       const serialized = JSON.stringify(value)
       const ttl = options.ttl || 3600 // Default 1 hour
       
       await this.redis.setex(key, ttl, serialized)
       
       // Store tags for invalidation
       if (options.tags) {
         for (const tag of options.tags) {
           await this.redis.sadd(`tag:${tag}`, key)
         }
       }
     } catch (error) {
       console.error('Cache set error:', error)
     }
   }
   
   async invalidateByTag(tag: string): Promise<void> {
     try {
       const keys = await this.redis.smembers(`tag:${tag}`)
       if (keys.length > 0) {
         await this.redis.del(...keys)
         await this.redis.del(`tag:${tag}`)
       }
     } catch (error) {
       console.error('Cache invalidation error:', error)
     }
   }
   
   async invalidatePattern(pattern: string): Promise<void> {
     try {
       const keys = await this.redis.keys(pattern)
       if (keys.length > 0) {
         await this.redis.del(...keys)
       }
     } catch (error) {
       console.error('Cache pattern invalidation error:', error)
     }
   }
   }
   
   export const cache = CacheManager.getInstance()
   ```

4. **Criar hooks de cache** (`src/hooks/use-cache.ts`):
   ```typescript
   'use client'
   
   import { useState, useEffect } from 'react'
   import { cache } from '@/lib/cache-utils'
   
   export function useCache<T>(
     key: string,
     fetcher: () => Promise<T>,
     options: { ttl?: number; tags?: string[] } = {}
   ) {
     const [data, setData] = useState<T | null>(null)
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<Error | null>(null)
   
     useEffect(() => {
       const fetchData = async () => {
         try {
           setLoading(true)
           
           // Try cache first
           const cached = await cache.get<T>(key)
           if (cached) {
             setData(cached)
             setLoading(false)
             return
           }
   
           // Fetch from source
           const fresh = await fetcher()
           setData(fresh)
   
           // Cache the result
           await cache.set(key, fresh, options)
         } catch (err) {
           setError(err as Error)
         } finally {
           setLoading(false)
         }
       }
   
       fetchData()
     }, [key])
   
     return { data, loading, error, refetch: () => fetchData() }
   }
   ```

#### **DIA 2: Cache de APIs**

**Objetivo**: Implementar cache para todas as APIs do site

**Tarefas**:
1. **Atualizar API de eventos** (`src/app/api/events/route.ts`):
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { cache } from '@/lib/cache-utils'
   import { supabase } from '@/lib/supabase'
   
   const CACHE_KEY = 'events:all'
   const CACHE_TTL = 300 // 5 minutes
   
   export async function GET(request: NextRequest) {
     try {
       // Try cache first
       const cached = await cache.get(CACHE_KEY)
       if (cached) {
         return NextResponse.json(cached, {
           headers: {
             'Cache-Control': 'public, max-age=300, s-maxage=300',
             'X-Cache': 'HIT',
           },
         })
       }
   
       // Fetch from database
       const { data: events, error } = await supabase
         .from('events')
         .select('*')
         .order('date', { ascending: true })
   
       if (error) {
         throw new Error(error.message)
       }
   
       const response = { events, timestamp: new Date().toISOString() }
   
       // Cache the result
       await cache.set(CACHE_KEY, response, {
         ttl: CACHE_TTL,
         tags: ['events'],
       })
   
       return NextResponse.json(response, {
         headers: {
           'Cache-Control': 'public, max-age=300, s-maxage=300',
           'X-Cache': 'MISS',
         },
       })
     } catch (error) {
       return NextResponse.json(
         { error: 'Failed to fetch events' },
         { status: 500 }
       )
     }
   }
   ```

2. **Atualizar API de sermões** (`src/app/api/sermons/route.ts`):
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { cache } from '@/lib/cache-utils'
   import { supabase } from '@/lib/supabase'
   
   const CACHE_KEY = 'sermons:all'
   const CACHE_TTL = 600 // 10 minutes
   
   export async function GET(request: NextRequest) {
     try {
       const cached = await cache.get(CACHE_KEY)
       if (cached) {
         return NextResponse.json(cached, {
           headers: {
             'Cache-Control': 'public, max-age=600, s-maxage=600',
             'X-Cache': 'HIT',
           },
         })
       }
   
       const { data: sermons, error } = await supabase
         .from('sermons')
         .select('*')
         .order('created_at', { ascending: false })
   
       if (error) {
         throw new Error(error.message)
       }
   
       const response = { sermons, timestamp: new Date().toISOString() }
   
       await cache.set(CACHE_KEY, response, {
         ttl: CACHE_TTL,
         tags: ['sermons'],
       })
   
       return NextResponse.json(response, {
         headers: {
           'Cache-Control': 'public, max-age=600, s-maxage=600',
           'X-Cache': 'MISS',
         },
       })
     } catch (error) {
       return NextResponse.json(
         { error: 'Failed to fetch sermons' },
         { status: 500 }
       )
     }
   }
   ```

3. **Criar API de invalidação de cache** (`src/app/api/admin/cache/invalidate/route.ts`):
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { getServerSession } from 'next-auth'
   import { authOptions } from '@/lib/auth'
   import { cache } from '@/lib/cache-utils'
   
   export async function POST(request: NextRequest) {
     const session = await getServerSession(authOptions)
     
     if (!session || session.user.role !== 'admin') {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
     }
   
     try {
       const { type, key, tag } = await request.json()
   
       switch (type) {
         case 'key':
           await cache.invalidatePattern(key)
           break
         case 'tag':
           await cache.invalidateByTag(tag)
           break
         case 'all':
           await cache.invalidatePattern('*')
           break
         default:
           return NextResponse.json({ error: 'Invalid invalidation type' }, { status: 400 })
       }
   
       return NextResponse.json({ success: true })
     } catch (error) {
       return NextResponse.json({ error: 'Failed to invalidate cache' }, { status: 500 })
     }
   }
   ```

#### **DIA 3: Vercel Edge Cache**

**Objetivo**: Implementar cache na edge para melhor performance global

**Tarefas**:
1. **Criar Edge Function para cache** (`src/app/api/cache/edge/route.ts`):
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   
   export const runtime = 'edge'
   
   export async function GET(request: NextRequest) {
     const url = new URL(request.url)
     const key = url.searchParams.get('key')
   
     if (!key) {
       return NextResponse.json({ error: 'Key required' }, { status: 400 })
     }
   
     // This would integrate with your cache system
     // For now, return a simple response
     return NextResponse.json(
       { key, cached: true, timestamp: new Date().toISOString() },
       {
         headers: {
           'Cache-Control': 'public, max-age=3600, s-maxage=3600',
           'CDN-Cache-Control': 'public, max-age=3600',
           'Vercel-CDN-Cache-Control': 'public, max-age=3600',
         },
       }
     )
   }
   ```

2. **Atualizar next.config.js** com configurações de cache:
   ```javascript
   const nextConfig = {
     // ... configuração existente
     
     async headers() {
       return [
         {
           source: '/api/events',
           headers: [
             {
               key: 'Cache-Control',
               value: 'public, max-age=300, s-maxage=300',
             },
           ],
         },
         {
           source: '/api/sermons',
           headers: [
             {
               key: 'Cache-Control',
               value: 'public, max-age=600, s-maxage=600',
             },
           ],
         },
         {
           source: '/_next/static/(.*)',
           headers: [
             {
               key: 'Cache-Control',
               value: 'public, max-age=31536000, immutable',
             },
           ],
         },
       ]
     },
   }
   ```

3. **Criar middleware de cache** (`src/middleware.ts`):
   ```typescript
   import { NextResponse } from 'next/server'
   import type { NextRequest } from 'next/server'
   
   export function middleware(request: NextRequest) {
     const response = NextResponse.next()
   
     // Cache static assets
     if (request.nextUrl.pathname.startsWith('/_next/static/')) {
       response.headers.set(
         'Cache-Control',
         'public, max-age=31536000, immutable'
       )
     }
   
     // Cache API responses
     if (request.nextUrl.pathname.startsWith('/api/')) {
       response.headers.set(
         'Cache-Control',
         'public, max-age=300, s-maxage=300'
       )
     }
   
     // Cache pages
     if (request.nextUrl.pathname === '/') {
       response.headers.set(
         'Cache-Control',
         'public, max-age=60, s-maxage=60'
       )
     }
   
     return response
   }
   
   export const config = {
     matcher: [
       '/((?!_next/static|_next/image|favicon.ico).*)',
     ],
   }
   ```

#### **DIA 4: Otimizações de Performance**

**Objetivo**: Implementar otimizações avançadas de cache e performance

**Tarefas**:
1. **Criar componente de cache para imagens** (`src/components/ui/cached-image.tsx`):
   ```typescript
   'use client'
   
   import Image from 'next/image'
   import { useState } from 'react'
   
   interface CachedImageProps {
     src: string
     alt: string
     width: number
     height: number
     className?: string
     priority?: boolean
   }
   
   export function CachedImage({
     src,
     alt,
     width,
     height,
     className,
     priority = false,
   }: CachedImageProps) {
     const [isLoading, setIsLoading] = useState(true)
     const [hasError, setHasError] = useState(false)
   
     return (
       <div className={`relative overflow-hidden ${className}`}>
         {isLoading && (
           <div className="absolute inset-0 bg-gray-200 animate-pulse" />
         )}
         <Image
           src={src}
           alt={alt}
           width={width}
           height={height}
           priority={priority}
           onLoad={() => setIsLoading(false)}
           onError={() => {
             setIsLoading(false)
             setHasError(true)
           }}
           className={`transition-opacity duration-300 ${
             isLoading ? 'opacity-0' : 'opacity-100'
           }`}
         />
         {hasError && (
           <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
             <span className="text-gray-500">Image not available</span>
           </div>
         )}
       </div>
     )
   }
   ```

2. **Criar hook para cache de dados** (`src/hooks/use-cached-data.ts`):
   ```typescript
   'use client'
   
   import { useState, useEffect } from 'react'
   import { cache } from '@/lib/cache-utils'
   
   export function useCachedData<T>(
     key: string,
     fetcher: () => Promise<T>,
     options: { ttl?: number; tags?: string[] } = {}
   ) {
     const [data, setData] = useState<T | null>(null)
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<Error | null>(null)
   
     const fetchData = async () => {
       try {
         setLoading(true)
         setError(null)
   
         // Try cache first
         const cached = await cache.get<T>(key)
         if (cached) {
           setData(cached)
           setLoading(false)
           return
         }
   
         // Fetch fresh data
         const fresh = await fetcher()
         setData(fresh)
   
         // Cache the result
         await cache.set(key, fresh, options)
       } catch (err) {
         setError(err as Error)
       } finally {
         setLoading(false)
       }
     }
   
     useEffect(() => {
       fetchData()
     }, [key])
   
     return { data, loading, error, refetch: fetchData }
   }
   ```

3. **Atualizar componentes para usar cache**:
   ```typescript
   // Exemplo: src/components/events/events-list.tsx
   'use client'
   
   import { useCachedData } from '@/hooks/use-cached-data'
   
   export function EventsList() {
     const { data: events, loading, error } = useCachedData(
       'events:list',
       async () => {
         const response = await fetch('/api/events')
         const data = await response.json()
         return data.events
       },
       { ttl: 300, tags: ['events'] }
     )
   
     if (loading) return <div>Loading events...</div>
     if (error) return <div>Error loading events</div>
   
     return (
       <div>
         {events?.map((event) => (
           <div key={event.id}>{event.title}</div>
         ))}
       </div>
     )
   }
   ```

#### **DIA 5: Invalidação e Monitoramento de Cache**

**Objetivo**: Implementar sistema de invalidação e monitoramento de cache

**Tarefas**:
1. **Criar dashboard de cache** (`src/components/admin/cache-dashboard.tsx`):
   ```typescript
   'use client'
   
   import { useState, useEffect } from 'react'
   import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
   import { Button } from '@/components/ui/button'
   import { Badge } from '@/components/ui/badge'
   
   interface CacheStats {
     totalKeys: number
     memoryUsage: string
     hitRate: number
     missRate: number
     topKeys: Array<{ key: string; ttl: number; size: number }>
   }
   
   export function CacheDashboard() {
     const [stats, setStats] = useState<CacheStats | null>(null)
     const [loading, setLoading] = useState(true)
   
     useEffect(() => {
       const fetchStats = async () => {
         try {
           const response = await fetch('/api/admin/cache/stats')
           const data = await response.json()
           setStats(data)
         } catch (error) {
           console.error('Error fetching cache stats:', error)
         } finally {
           setLoading(false)
         }
       }
   
       fetchStats()
       const interval = setInterval(fetchStats, 30000)
       return () => clearInterval(interval)
     }, [])
   
     const invalidateCache = async (type: string, value?: string) => {
       try {
         await fetch('/api/admin/cache/invalidate', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ type, key: value, tag: value }),
         })
         // Refresh stats
         window.location.reload()
       } catch (error) {
         console.error('Error invalidating cache:', error)
       }
     }
   
     if (loading) return <div>Loading cache stats...</div>
     if (!stats) return <div>Error loading cache stats</div>
   
     return (
       <div className="p-6 space-y-6">
         <h1 className="text-3xl font-bold">Cache Dashboard</h1>
         
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <Card>
             <CardHeader>
               <CardTitle>Total Keys</CardTitle>
               <CardDescription>Number of cached items</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stats.totalKeys}</div>
             </CardContent>
           </Card>
   
           <Card>
             <CardHeader>
               <CardTitle>Memory Usage</CardTitle>
               <CardDescription>Redis memory consumption</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stats.memoryUsage}</div>
             </CardContent>
           </Card>
   
           <Card>
             <CardHeader>
               <CardTitle>Hit Rate</CardTitle>
               <CardDescription>Cache hit percentage</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stats.hitRate.toFixed(1)}%</div>
               <Badge variant={stats.hitRate > 80 ? 'default' : 'destructive'}>
                 {stats.hitRate > 80 ? 'Good' : 'Needs Improvement'}
               </Badge>
             </CardContent>
           </Card>
   
           <Card>
             <CardHeader>
               <CardTitle>Miss Rate</CardTitle>
               <CardDescription>Cache miss percentage</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stats.missRate.toFixed(1)}%</div>
             </CardContent>
           </Card>
         </div>
   
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <Card>
             <CardHeader>
               <CardTitle>Cache Actions</CardTitle>
               <CardDescription>Manage cache operations</CardDescription>
             </CardHeader>
             <CardContent className="space-y-2">
               <Button
                 onClick={() => invalidateCache('all')}
                 variant="destructive"
                 className="w-full"
               >
                 Clear All Cache
               </Button>
               <Button
                 onClick={() => invalidateCache('tag', 'events')}
                 variant="outline"
                 className="w-full"
               >
                 Clear Events Cache
               </Button>
               <Button
                 onClick={() => invalidateCache('tag', 'sermons')}
                 variant="outline"
                 className="w-full"
               >
                 Clear Sermons Cache
               </Button>
             </CardContent>
           </Card>
   
           <Card>
             <CardHeader>
               <CardTitle>Top Cached Keys</CardTitle>
               <CardDescription>Most frequently accessed items</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="space-y-2">
                 {stats.topKeys.map((item) => (
                   <div key={item.key} className="flex justify-between items-center">
                     <span className="text-sm font-mono">{item.key}</span>
                     <div className="text-xs text-gray-500">
                       TTL: {item.ttl}s | Size: {item.size}B
                     </div>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
         </div>
       </div>
     )
   }
   ```

2. **Criar API de estatísticas de cache** (`src/app/api/admin/cache/stats/route.ts`):
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { getServerSession } from 'next-auth'
   import { authOptions } from '@/lib/auth'
   import redis from '@/lib/redis'
   
   export async function GET(request: NextRequest) {
     const session = await getServerSession(authOptions)
     
     if (!session || session.user.role !== 'admin') {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
     }
   
     try {
       // Get Redis info
       const info = await redis.info('memory')
       const keys = await redis.keys('*')
       const memoryUsage = info.match(/used_memory_human:(\S+)/)?.[1] || '0B'
   
       // Calculate hit rate (simplified)
       const hitRate = 85 // This would be calculated from actual metrics
       const missRate = 100 - hitRate
   
       // Get top keys with TTL
       const topKeys = await Promise.all(
         keys.slice(0, 10).map(async (key) => {
           const ttl = await redis.ttl(key)
           const size = await redis.memory('usage', key)
           return { key, ttl, size: size || 0 }
         })
       )
   
       const stats = {
         totalKeys: keys.length,
         memoryUsage,
         hitRate,
         missRate,
         topKeys,
       }
   
       return NextResponse.json(stats)
     } catch (error) {
       return NextResponse.json(
         { error: 'Failed to fetch cache stats' },
         { status: 500 }
       )
     }
   }
   ```

3. **Atualizar página de monitoramento** para incluir cache:
   ```typescript
   // Adicionar ao src/app/admin/monitoring/page.tsx
   import { CacheDashboard } from '@/components/admin/cache-dashboard'
   
   export default function MonitoringPage() {
     return (
       <div className="container mx-auto py-6 space-y-8">
         <MetricsDashboard />
         <CacheDashboard />
       </div>
     )
   }
   ```

### 📊 **MÉTRICAS DE SUCESSO DA FASE 3**

#### **Performance**
- **Cache Hit Rate**: >80%
- **API Response Time**: <200ms (cached)
- **Page Load Time**: <2s
- **Memory Usage**: <100MB Redis

#### **Cache Effectiveness**
- **Events API**: 95%+ cache hits
- **Sermons API**: 90%+ cache hits
- **Static Assets**: 100% cached
- **Edge Cache**: Active and working

### 🔍 **CHECKLIST DE VALIDAÇÃO**

#### **Redis Cache**
- [ ] Redis conectado e funcionando
- [ ] Cache de APIs implementado
- [ ] TTL configurado corretamente
- [ ] Invalidação funcionando

#### **Vercel Edge Cache**
- [ ] Headers de cache configurados
- [ ] Edge functions funcionando
- [ ] CDN cache ativo
- [ ] Performance melhorada

#### **Monitoramento**
- [ ] Dashboard de cache funcionando
- [ ] Estatísticas sendo coletadas
- [ ] Invalidação manual funcionando
- [ ] Alertas de cache configurados

### 📝 **ENTREGÁVEIS DA FASE 3**

1. **Código**:
   - Redis cache implementado
   - Vercel Edge Cache configurado
   - Utilitários de cache
   - Dashboard de cache

2. **Configurações**:
   - Variáveis de ambiente Redis
   - Headers de cache
   - Middleware de cache

3. **Documentação**:
   - Guia de cache
   - Estratégias de invalidação
   - Monitoramento de performance

### 🚀 **PRÓXIMA FASE**

Após completar a Fase 3, a **Fase 4** focará em:
- Segurança e Autenticação Avançada
- Rate Limiting e Proteção
- Headers de Segurança

---

**✅ STATUS**: Pronto para implementação
**⏱️ DURAÇÃO**: 5 dias úteis
**🎯 FOCO**: Performance e escalabilidade através de cache inteligente
