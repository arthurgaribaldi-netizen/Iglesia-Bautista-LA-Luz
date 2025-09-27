import { NextRequest } from 'next/server'
import { prisma } from './db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'igreja-luz-malaga-secret-key'

export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'EDITOR' | 'MEMBER'
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User
    return decoded
  } catch {
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.password) {
      return null
    }

    // Verificar senha hasheada
    const isValidPassword = await verifyPassword(password, user.password)
    
    if (isValidPassword) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }

    return null
  } catch (error) {
    console.error('Erro na autenticação:', error)
    return null
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  const cookieToken = request.cookies.get('auth-token')?.value
  return cookieToken || null
}

export async function requireAuth(request: NextRequest): Promise<User | null> {
  const token = getTokenFromRequest(request)
  if (!token) {
    return null
  }

  return verifyToken(token)
}

export async function requireAdmin(request: NextRequest): Promise<User | null> {
  const user = await requireAuth(request)
  if (!user || user.role !== 'ADMIN') {
    return null
  }
  return user
}

export async function requireEditorOrAdmin(request: NextRequest): Promise<User | null> {
  const user = await requireAuth(request)
  if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
    return null
  }
  return user
}
