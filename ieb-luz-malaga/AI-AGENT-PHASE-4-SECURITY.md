# 🤖 AI Agent Prompt - FASE 4: Segurança e Autenticação
## Site IEB La Luz Málaga - Implementação de Segurança Avançada

### 📋 **CONTEXTO DA FASE**

Você é um agente AI especializado em implementação de sistemas de segurança para aplicações Next.js. Esta é a **FASE 4** de um projeto de melhorias técnicas para o site da Igreja Evangélica Bautista La Luz Málaga.

**Pré-requisitos**: Fases 1-3 (Testes, Monitoramento, Cache) devem estar concluídas
**Objetivo da Fase**: Implementar segurança avançada (Rate Limiting, Headers, 2FA, Proteção)
**Duração Estimada**: 1 semana (5 dias úteis)
**Prioridade**: 🟡 MÉDIA
**Complexidade**: Média

### 🎯 **OBJETIVOS ESPECÍFICOS DA FASE 4**

1. **Implementar Rate Limiting** para proteção contra abuse
2. **Configurar Security Headers** (CSP, HSTS, X-Frame-Options)
3. **Adicionar 2FA** para administradores
4. **Implementar validação de entrada** robusta
5. **Configurar proteção CSRF** e XSS

### 🔧 **TAREFAS DETALHADAS - DIA A DIA**

#### **DIA 1: Rate Limiting e Proteção Básica**

**Objetivo**: Implementar rate limiting e proteções básicas

**Tarefas**:
1. **Instalar dependências de segurança**:
   ```bash
   npm install express-rate-limit @types/express-rate-limit
   npm install helmet @types/helmet
   npm install express-validator
   ```

2. **Criar middleware de rate limiting** (`src/lib/rate-limit.ts`):
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   
   interface RateLimitConfig {
     windowMs: number
     max: number
     message: string
     standardHeaders: boolean
     legacyHeaders: boolean
   }
   
   const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
   
   export function rateLimit(config: RateLimitConfig) {
     return (request: NextRequest) => {
       const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
       const now = Date.now()
       const windowMs = config.windowMs
       const max = config.max
   
       const key = `${ip}:${request.nextUrl.pathname}`
       const current = rateLimitMap.get(key)
   
       if (!current || now > current.resetTime) {
         rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
         return NextResponse.next()
       }
   
       if (current.count >= max) {
         return NextResponse.json(
           { error: config.message },
           { 
             status: 429,
             headers: {
               'Retry-After': Math.ceil((current.resetTime - now) / 1000).toString(),
               'X-RateLimit-Limit': max.toString(),
               'X-RateLimit-Remaining': '0',
               'X-RateLimit-Reset': new Date(current.resetTime).toISOString(),
             }
           }
         )
       }
   
       current.count++
       return NextResponse.next()
     }
   }
   
   // Rate limit configurations
   export const rateLimits = {
     api: rateLimit({
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 100, // 100 requests per window
       message: 'Too many requests from this IP, please try again later.',
       standardHeaders: true,
       legacyHeaders: false,
     }),
     auth: rateLimit({
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 5, // 5 login attempts per window
       message: 'Too many authentication attempts, please try again later.',
       standardHeaders: true,
       legacyHeaders: false,
     }),
     contact: rateLimit({
       windowMs: 60 * 60 * 1000, // 1 hour
       max: 3, // 3 contact form submissions per hour
       message: 'Too many contact form submissions, please try again later.',
       standardHeaders: true,
       legacyHeaders: false,
     }),
   }
   ```

3. **Atualizar APIs com rate limiting**:
   ```typescript
   // src/app/api/contact/route.ts
   import { rateLimits } from '@/lib/rate-limit'
   
   export async function POST(request: NextRequest) {
     // Apply rate limiting
     const rateLimitResponse = rateLimits.contact(request)
     if (rateLimitResponse) return rateLimitResponse
   
     // ... resto da implementação
   }
   ```

4. **Criar middleware de segurança** (`src/middleware.ts`):
   ```typescript
   import { NextResponse } from 'next/server'
   import type { NextRequest } from 'next/server'
   import { rateLimits } from '@/lib/rate-limit'
   
   export function middleware(request: NextRequest) {
     const response = NextResponse.next()
   
     // Security headers
     response.headers.set('X-Frame-Options', 'DENY')
     response.headers.set('X-Content-Type-Options', 'nosniff')
     response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
     response.headers.set('X-XSS-Protection', '1; mode=block')
     response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
   
     // Content Security Policy
     const csp = [
       "default-src 'self'",
       "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
       "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
       "img-src 'self' data: https: blob:",
       "font-src 'self' https://fonts.gstatic.com",
       "connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com",
       "frame-src 'self' https://www.youtube.com",
       "object-src 'none'",
       "base-uri 'self'",
       "form-action 'self'",
       "frame-ancestors 'none'",
     ].join('; ')
   
     response.headers.set('Content-Security-Policy', csp)
   
     // Apply rate limiting to API routes
     if (request.nextUrl.pathname.startsWith('/api/')) {
       const rateLimitResponse = rateLimits.api(request)
       if (rateLimitResponse) return rateLimitResponse
     }
   
     return response
   }
   
   export const config = {
     matcher: [
       '/((?!_next/static|_next/image|favicon.ico).*)',
     ],
   }
   ```

#### **DIA 2: Validação de Entrada e Sanitização**

**Objetivo**: Implementar validação robusta de dados de entrada

**Tarefas**:
1. **Criar schemas de validação** (`src/lib/validations.ts`):
   ```typescript
   import { z } from 'zod'
   import { zx } from 'zodix'
   
   // Contact form validation
   export const contactSchema = z.object({
     name: z.string()
       .min(2, 'Name must be at least 2 characters')
       .max(50, 'Name must be less than 50 characters')
       .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Name can only contain letters and spaces'),
     email: z.string()
       .email('Invalid email address')
       .max(100, 'Email must be less than 100 characters'),
     phone: z.string()
       .optional()
       .refine((val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val), 'Invalid phone number'),
     message: z.string()
       .min(10, 'Message must be at least 10 characters')
       .max(1000, 'Message must be less than 1000 characters')
       .refine((val) => !/<script|javascript:|on\w+=/i.test(val), 'Invalid characters detected'),
     honeypot: z.string().optional().refine((val) => !val, 'Bot detected'),
   })
   
   // Event creation validation
   export const eventSchema = z.object({
     title: z.string()
       .min(3, 'Title must be at least 3 characters')
       .max(100, 'Title must be less than 100 characters'),
     description: z.string()
       .min(10, 'Description must be at least 10 characters')
       .max(2000, 'Description must be less than 2000 characters'),
     date: z.string()
       .datetime('Invalid date format'),
     location: z.string()
       .min(3, 'Location must be at least 3 characters')
       .max(100, 'Location must be less than 100 characters'),
     image: z.string()
       .url('Invalid image URL')
       .optional(),
   })
   
   // User registration validation
   export const userSchema = z.object({
     name: z.string()
       .min(2, 'Name must be at least 2 characters')
       .max(50, 'Name must be less than 50 characters'),
     email: z.string()
       .email('Invalid email address'),
     password: z.string()
       .min(8, 'Password must be at least 8 characters')
       .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
         'Password must contain uppercase, lowercase, number and special character'),
     role: z.enum(['admin', 'user']).default('user'),
   })
   ```

2. **Criar utilitários de sanitização** (`src/lib/sanitize.ts`):
   ```typescript
   import DOMPurify from 'isomorphic-dompurify'
   
   export function sanitizeHtml(html: string): string {
     return DOMPurify.sanitize(html, {
       ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
       ALLOWED_ATTR: [],
     })
   }
   
   export function sanitizeString(input: string): string {
     return input
       .trim()
       .replace(/[<>]/g, '') // Remove potential HTML tags
       .replace(/javascript:/gi, '') // Remove javascript: protocol
       .replace(/on\w+=/gi, '') // Remove event handlers
   }
   
   export function validateEmail(email: string): boolean {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
     return emailRegex.test(email) && email.length <= 100
   }
   
   export function validatePhone(phone: string): boolean {
     const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
     return phoneRegex.test(phone)
   }
   ```

3. **Atualizar API de contato** com validação:
   ```typescript
   // src/app/api/contact/route.ts
   import { contactSchema } from '@/lib/validations'
   import { sanitizeString, validateEmail } from '@/lib/sanitize'
   
   export async function POST(request: NextRequest) {
     try {
       const body = await request.json()
       
       // Validate input
       const validatedData = contactSchema.parse(body)
       
       // Sanitize data
       const sanitizedData = {
         name: sanitizeString(validatedData.name),
         email: validatedData.email.toLowerCase().trim(),
         phone: validatedData.phone ? sanitizeString(validatedData.phone) : undefined,
         message: sanitizeString(validatedData.message),
       }
       
       // Additional validation
       if (!validateEmail(sanitizedData.email)) {
         return NextResponse.json(
           { error: 'Invalid email address' },
           { status: 400 }
         )
       }
       
       // Process contact form
       // ... resto da implementação
       
       return NextResponse.json({ success: true })
     } catch (error) {
       if (error instanceof z.ZodError) {
         return NextResponse.json(
           { error: 'Validation failed', details: error.errors },
           { status: 400 }
         )
       }
       
       return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
       )
     }
   }
   ```

#### **DIA 3: Autenticação 2FA**

**Objetivo**: Implementar autenticação de dois fatores para administradores

**Tarefas**:
1. **Instalar dependências 2FA**:
   ```bash
   npm install speakeasy qrcode @types/qrcode
   npm install --save-dev @types/speakeasy
   ```

2. **Criar utilitários 2FA** (`src/lib/2fa.ts`):
   ```typescript
   import speakeasy from 'speakeasy'
   import QRCode from 'qrcode'
   
   export interface TwoFactorSecret {
     secret: string
     qrCodeUrl: string
     backupCodes: string[]
   }
   
   export function generateTwoFactorSecret(userEmail: string): TwoFactorSecret {
     const secret = speakeasy.generateSecret({
       name: `IEB La Luz (${userEmail})`,
       issuer: 'IEB La Luz Málaga',
       length: 32,
     })
   
     const backupCodes = Array.from({ length: 10 }, () => 
       Math.random().toString(36).substring(2, 8).toUpperCase()
     )
   
     return {
       secret: secret.base32,
       qrCodeUrl: secret.otpauth_url!,
       backupCodes,
     }
   }
   
   export function verifyTwoFactorToken(secret: string, token: string): boolean {
     return speakeasy.totp.verify({
       secret,
       encoding: 'base32',
       token,
       window: 2, // Allow 2 time windows for clock drift
     })
   }
   
   export function generateQRCode(url: string): Promise<string> {
     return QRCode.toDataURL(url, {
       width: 200,
       margin: 2,
       color: {
         dark: '#000000',
         light: '#FFFFFF',
       },
     })
   }
   ```

3. **Criar API de 2FA** (`src/app/api/auth/2fa/setup/route.ts`):
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { getServerSession } from 'next-auth'
   import { authOptions } from '@/lib/auth'
   import { generateTwoFactorSecret, generateQRCode } from '@/lib/2fa'
   import { supabase } from '@/lib/supabase'
   
   export async function POST(request: NextRequest) {
     const session = await getServerSession(authOptions)
     
     if (!session || session.user.role !== 'admin') {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
     }
   
     try {
       const { email } = await request.json()
       
       // Generate 2FA secret
       const twoFactorData = generateTwoFactorSecret(email)
       const qrCode = await generateQRCode(twoFactorData.qrCodeUrl)
   
       // Store secret in database (encrypted)
       const { error } = await supabase
         .from('user_2fa')
         .upsert({
           user_id: session.user.id,
           secret: twoFactorData.secret,
           backup_codes: twoFactorData.backupCodes,
           created_at: new Date().toISOString(),
         })
   
       if (error) {
         throw new Error(error.message)
       }
   
       return NextResponse.json({
         secret: twoFactorData.secret,
         qrCode,
         backupCodes: twoFactorData.backupCodes,
       })
     } catch (error) {
       return NextResponse.json(
         { error: 'Failed to setup 2FA' },
         { status: 500 }
       )
     }
   }
   ```

4. **Criar API de verificação 2FA** (`src/app/api/auth/2fa/verify/route.ts`):
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { getServerSession } from 'next-auth'
   import { authOptions } from '@/lib/auth'
   import { verifyTwoFactorToken } from '@/lib/2fa'
   import { supabase } from '@/lib/supabase'
   
   export async function POST(request: NextRequest) {
     const session = await getServerSession(authOptions)
     
     if (!session) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
     }
   
     try {
       const { token, backupCode } = await request.json()
   
       // Get user's 2FA secret
       const { data: user2FA, error: fetchError } = await supabase
         .from('user_2fa')
         .select('secret, backup_codes')
         .eq('user_id', session.user.id)
         .single()
   
       if (fetchError || !user2FA) {
         return NextResponse.json(
           { error: '2FA not configured' },
           { status: 400 }
         )
       }
   
       let isValid = false
   
       if (backupCode) {
         // Verify backup code
         isValid = user2FA.backup_codes.includes(backupCode)
         
         if (isValid) {
           // Remove used backup code
           const updatedCodes = user2FA.backup_codes.filter(code => code !== backupCode)
           await supabase
             .from('user_2fa')
             .update({ backup_codes: updatedCodes })
             .eq('user_id', session.user.id)
         }
       } else {
         // Verify TOTP token
         isValid = verifyTwoFactorToken(user2FA.secret, token)
       }
   
       if (!isValid) {
         return NextResponse.json(
           { error: 'Invalid 2FA token' },
           { status: 400 }
         )
       }
   
       // Update session with 2FA verified
       // This would typically involve updating the JWT token
       
       return NextResponse.json({ success: true })
     } catch (error) {
       return NextResponse.json(
         { error: 'Failed to verify 2FA' },
         { status: 500 }
       )
     }
   }
   ```

#### **DIA 4: Proteção CSRF e XSS**

**Objetivo**: Implementar proteções contra CSRF e XSS

**Tarefas**:
1. **Instalar dependências de segurança**:
   ```bash
   npm install csrf @types/csrf
   npm install cookie @types/cookie
   ```

2. **Criar middleware CSRF** (`src/lib/csrf.ts`):
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { createHash, randomBytes } from 'crypto'
   import { serialize, parse } from 'cookie'
   
   const CSRF_SECRET = process.env.CSRF_SECRET || 'your-secret-key'
   
   export function generateCSRFToken(): string {
     const token = randomBytes(32).toString('hex')
     const hash = createHash('sha256')
       .update(token + CSRF_SECRET)
       .digest('hex')
     return `${token}.${hash}`
   }
   
   export function verifyCSRFToken(token: string): boolean {
     if (!token || !token.includes('.')) return false
   
     const [tokenPart, hashPart] = token.split('.')
     const expectedHash = createHash('sha256')
       .update(tokenPart + CSRF_SECRET)
       .digest('hex')
   
     return expectedHash === hashPart
   }
   
   export function setCSRFCookie(response: NextResponse): void {
     const token = generateCSRFToken()
     const cookie = serialize('csrf-token', token, {
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       sameSite: 'strict',
       maxAge: 60 * 60 * 24, // 24 hours
       path: '/',
     })
   
     response.headers.set('Set-Cookie', cookie)
   }
   
   export function getCSRFToken(request: NextRequest): string | null {
     const cookies = parse(request.headers.get('cookie') || '')
     return cookies['csrf-token'] || null
   }
   ```

3. **Criar API de CSRF token** (`src/app/api/csrf/route.ts`):
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { setCSRFCookie, generateCSRFToken } from '@/lib/csrf'
   
   export async function GET(request: NextRequest) {
     const response = NextResponse.json({ success: true })
     setCSRFCookie(response)
     
     const token = generateCSRFToken()
     return NextResponse.json({ token })
   }
   ```

4. **Atualizar formulários com CSRF**:
   ```typescript
   // src/components/contact-form.tsx
   'use client'
   
   import { useState, useEffect } from 'react'
   import { Button } from '@/components/ui/button'
   import { Input } from '@/components/ui/input'
   import { Textarea } from '@/components/ui/textarea'
   
   export function ContactForm() {
     const [csrfToken, setCsrfToken] = useState('')
     const [formData, setFormData] = useState({
       name: '',
       email: '',
       message: '',
     })
   
     useEffect(() => {
       // Fetch CSRF token
       fetch('/api/csrf')
         .then(res => res.json())
         .then(data => setCsrfToken(data.token))
     }, [])
   
     const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault()
       
       const response = await fetch('/api/contact', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'X-CSRF-Token': csrfToken,
         },
         body: JSON.stringify(formData),
       })
       
       if (response.ok) {
         alert('Message sent successfully!')
         setFormData({ name: '', email: '', message: '' })
       } else {
         alert('Error sending message')
       }
     }
   
     return (
       <form onSubmit={handleSubmit} className="space-y-4">
         <input type="hidden" name="csrf-token" value={csrfToken} />
         
         <Input
           type="text"
           placeholder="Name"
           value={formData.name}
           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
           required
         />
         
         <Input
           type="email"
           placeholder="Email"
           value={formData.email}
           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
           required
         />
         
         <Textarea
           placeholder="Message"
           value={formData.message}
           onChange={(e) => setFormData({ ...formData, message: e.target.value })}
           required
         />
         
         <Button type="submit">Send Message</Button>
       </form>
     )
   }
   ```

#### **DIA 5: Headers de Segurança e Auditoria**

**Objetivo**: Implementar headers de segurança e sistema de auditoria

**Tarefas**:
1. **Criar utilitário de headers de segurança** (`src/lib/security-headers.ts`):
   ```typescript
   import { NextResponse } from 'next/server'
   
   export function addSecurityHeaders(response: NextResponse): NextResponse {
     // Prevent clickjacking
     response.headers.set('X-Frame-Options', 'DENY')
     
     // Prevent MIME type sniffing
     response.headers.set('X-Content-Type-Options', 'nosniff')
     
     // XSS Protection
     response.headers.set('X-XSS-Protection', '1; mode=block')
     
     // Referrer Policy
     response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
     
     // HSTS
     response.headers.set(
       'Strict-Transport-Security',
       'max-age=31536000; includeSubDomains; preload'
     )
     
     // Content Security Policy
     const csp = [
       "default-src 'self'",
       "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
       "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
       "img-src 'self' data: https: blob:",
       "font-src 'self' https://fonts.gstatic.com",
       "connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com",
       "frame-src 'self' https://www.youtube.com",
       "object-src 'none'",
       "base-uri 'self'",
       "form-action 'self'",
       "frame-ancestors 'none'",
       "upgrade-insecure-requests",
     ].join('; ')
     
     response.headers.set('Content-Security-Policy', csp)
     
     // Permissions Policy
     const permissionsPolicy = [
       'camera=()',
       'microphone=()',
       'geolocation=()',
       'interest-cohort=()',
     ].join(', ')
     
     response.headers.set('Permissions-Policy', permissionsPolicy)
     
     return response
   }
   ```

2. **Criar sistema de auditoria** (`src/lib/audit.ts`):
   ```typescript
   import logger from './logger'
   
   interface AuditEvent {
     userId?: string
     action: string
     resource: string
     details?: Record<string, any>
     ip?: string
     userAgent?: string
   }
   
   export function logAuditEvent(event: AuditEvent): void {
     logger.info('AUDIT_EVENT', {
       timestamp: new Date().toISOString(),
       ...event,
     })
   }
   
   export function logSecurityEvent(event: AuditEvent): void {
     logger.warn('SECURITY_EVENT', {
       timestamp: new Date().toISOString(),
       ...event,
     })
   }
   
   export function logAdminAction(event: AuditEvent): void {
     logger.info('ADMIN_ACTION', {
       timestamp: new Date().toISOString(),
       ...event,
     })
   }
   ```

3. **Atualizar middleware** com headers de segurança:
   ```typescript
   // src/middleware.ts
   import { NextResponse } from 'next/server'
   import type { NextRequest } from 'next/server'
   import { addSecurityHeaders } from '@/lib/security-headers'
   import { rateLimits } from '@/lib/rate-limit'
   import { logSecurityEvent } from '@/lib/audit'
   
   export function middleware(request: NextRequest) {
     const response = NextResponse.next()
   
     // Add security headers
     addSecurityHeaders(response)
   
     // Apply rate limiting
     if (request.nextUrl.pathname.startsWith('/api/')) {
       const rateLimitResponse = rateLimits.api(request)
       if (rateLimitResponse) {
         logSecurityEvent({
           action: 'RATE_LIMIT_EXCEEDED',
           resource: request.nextUrl.pathname,
           ip: request.ip || 'unknown',
           userAgent: request.headers.get('user-agent') || 'unknown',
         })
         return rateLimitResponse
       }
     }
   
     // Log suspicious activity
     if (request.nextUrl.pathname.includes('..') || 
         request.nextUrl.pathname.includes('<script>') ||
         request.nextUrl.pathname.includes('javascript:')) {
       logSecurityEvent({
         action: 'SUSPICIOUS_REQUEST',
         resource: request.nextUrl.pathname,
         ip: request.ip || 'unknown',
         userAgent: request.headers.get('user-agent') || 'unknown',
       })
     }
   
     return response
   }
   ```

4. **Criar página de auditoria** (`src/app/admin/audit/page.tsx`):
   ```typescript
   import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
   import { Badge } from '@/components/ui/badge'
   
   export default function AuditPage() {
     // This would fetch audit logs from your logging system
     const auditLogs = [
       {
         id: 1,
         timestamp: '2025-01-15T10:30:00Z',
         action: 'LOGIN',
         user: 'admin@ieblaluzmalaga.com',
         ip: '192.168.1.1',
         details: { success: true },
       },
       {
         id: 2,
         timestamp: '2025-01-15T10:25:00Z',
         action: 'RATE_LIMIT_EXCEEDED',
         user: null,
         ip: '192.168.1.100',
         details: { endpoint: '/api/contact' },
       },
     ]
   
     return (
       <div className="container mx-auto py-6">
         <h1 className="text-3xl font-bold mb-6">Audit Logs</h1>
         
         <div className="space-y-4">
           {auditLogs.map((log) => (
             <Card key={log.id}>
               <CardHeader>
                 <div className="flex justify-between items-center">
                   <CardTitle className="text-lg">{log.action}</CardTitle>
                   <Badge variant={log.action.includes('RATE_LIMIT') ? 'destructive' : 'default'}>
                     {log.action}
                   </Badge>
                 </div>
                 <CardDescription>
                   {new Date(log.timestamp).toLocaleString()}
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="space-y-2">
                   <p><strong>IP:</strong> {log.ip}</p>
                   {log.user && <p><strong>User:</strong> {log.user}</p>}
                   {log.details && (
                     <p><strong>Details:</strong> {JSON.stringify(log.details)}</p>
                   )}
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
       </div>
     )
   }
   ```

### 📊 **MÉTRICAS DE SUCESSO DA FASE 4**

#### **Segurança**
- **Rate Limiting**: Ativo em todas as APIs
- **Security Headers**: 100% implementados
- **2FA**: Configurado para administradores
- **Validação**: 100% dos inputs validados

#### **Proteção**
- **CSRF**: Proteção ativa
- **XSS**: Prevenção implementada
- **Auditoria**: Logs de segurança ativos
- **Headers**: A+ em security score

### 🔍 **CHECKLIST DE VALIDAÇÃO**

#### **Rate Limiting**
- [ ] APIs protegidas contra abuse
- [ ] Configurações apropriadas
- [ ] Headers de rate limit
- [ ] Logs de violações

#### **Segurança**
- [ ] Headers de segurança implementados
- [ ] CSP configurado
- [ ] HSTS ativo
- [ ] XSS protection ativo

#### **Autenticação**
- [ ] 2FA configurado
- [ ] Backup codes funcionando
- [ ] QR code generation
- [ ] Verificação de tokens

#### **Validação**
- [ ] Schemas de validação
- [ ] Sanitização de dados
- [ ] CSRF protection
- [ ] Auditoria ativa

### 📝 **ENTREGÁVEIS DA FASE 4**

1. **Código**:
   - Rate limiting implementado
   - Headers de segurança
   - Sistema 2FA
   - Validação robusta

2. **Configurações**:
   - Middleware de segurança
   - Schemas de validação
   - Configurações de CSRF

3. **Documentação**:
   - Guia de segurança
   - Instruções de 2FA
   - Políticas de auditoria

### 🚀 **PRÓXIMA FASE**

Após completar a Fase 4, a **Fase 5** focará em:
- Acessibilidade Avançada
- Conformidade WCAG 2.1 AA
- Testes de acessibilidade automatizados

---

**✅ STATUS**: Pronto para implementação
**⏱️ DURAÇÃO**: 5 dias úteis
**🎯 FOCO**: Segurança e proteção contra vulnerabilidades
