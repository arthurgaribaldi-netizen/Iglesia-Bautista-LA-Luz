import { 
  hashPassword, 
  verifyPassword, 
  generateToken, 
  verifyToken, 
  getTokenFromRequest,
  authenticateUser,
  requireAuth,
  requireAdmin,
  requireEditorOrAdmin
} from '../../src/lib/auth'
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Mock do Prisma
jest.mock('../../src/lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn()
    }
  }
}))

// Mock do bcrypt
jest.mock('bcryptjs')

// Mock do jwt
jest.mock('jsonwebtoken')

describe('Auth Library', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'ADMIN' as const,
    password: 'hashedPassword123'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.JWT_SECRET = 'test-secret-key'
  })

  afterEach(() => {
    delete process.env.JWT_SECRET
  })

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const mockHashedPassword = 'hashedPassword123'
      ;(bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword)

      const password = 'plainPassword123'
      const result = await hashPassword(password)

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 12)
      expect(result).toBe(mockHashedPassword)
    })

    it('should handle hashing errors', async () => {
      const error = new Error('Hashing failed')
      ;(bcrypt.hash as jest.Mock).mockRejectedValue(error)

      await expect(hashPassword('password')).rejects.toThrow('Hashing failed')
    })
  })

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

      const result = await verifyPassword('password', 'hashedPassword')
      
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword')
      expect(result).toBe(true)
    })

    it('should reject incorrect password', async () => {
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      const result = await verifyPassword('wrongPassword', 'hashedPassword')
      
      expect(result).toBe(false)
    })
  })

  describe('generateToken', () => {
    it('should generate valid JWT token', () => {
      const mockToken = 'generated.jwt.token'
      ;(jwt.sign as jest.Mock).mockReturnValue(mockToken)

      const user = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN' as const
      }

      const result = generateToken(user)

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        'test-secret-key',
        { expiresIn: '24h' }
      )
      expect(result).toBe(mockToken)
    })
  })

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const mockDecodedUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN'
      }
      ;(jwt.verify as jest.Mock).mockReturnValue(mockDecodedUser)

      const result = verifyToken('valid.token')

      expect(jwt.verify).toHaveBeenCalledWith('valid.token', 'test-secret-key')
      expect(result).toEqual(mockDecodedUser)
    })

    it('should return null for invalid token', () => {
      ;(jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token')
      })

      const result = verifyToken('invalid.token')

      expect(result).toBeNull()
    })
  })

  describe('getTokenFromRequest', () => {
    it('should extract token from Authorization header', () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('Bearer valid.token.here')
        },
        cookies: {
          get: jest.fn()
        }
      } as unknown as NextRequest

      const result = getTokenFromRequest(mockRequest)

      expect(result).toBe('valid.token.here')
      expect(mockRequest.headers.get).toHaveBeenCalledWith('authorization')
    })

    it('should extract token from cookies', () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue(null)
        },
        cookies: {
          get: jest.fn().mockReturnValue({ value: 'cookie.token.here' })
        }
      } as unknown as NextRequest

      const result = getTokenFromRequest(mockRequest)

      expect(result).toBe('cookie.token.here')
      expect(mockRequest.cookies.get).toHaveBeenCalledWith('auth-token')
    })

    it('should return null when no token found', () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue(null)
        },
        cookies: {
          get: jest.fn().mockReturnValue(undefined)
        }
      } as unknown as NextRequest

      const result = getTokenFromRequest(mockRequest)

      expect(result).toBeNull()
    })
  })

  describe('authenticateUser', () => {
    const { prisma } = require('../../src/lib/db')

    it('should authenticate valid user', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

      const result = await authenticateUser('test@example.com', 'password')

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      })
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role
      })
    })

    it('should return null for non-existent user', async () => {
      prisma.user.findUnique.mockResolvedValue(null)

      const result = await authenticateUser('nonexistent@example.com', 'password')

      expect(result).toBeNull()
    })

    it('should return null for invalid password', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      const result = await authenticateUser('test@example.com', 'wrongPassword')

      expect(result).toBeNull()
    })

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed')
      prisma.user.findUnique.mockRejectedValue(error)

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const result = await authenticateUser('test@example.com', 'password')

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('Erro na autenticação:', error)

      consoleSpy.mockRestore()
    })
  })

  describe('requireAuth', () => {
    it('should return user for valid token', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('Bearer valid.token')
        },
        cookies: {
          get: jest.fn()
        }
      } as unknown as NextRequest

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN'
      }
      ;(jwt.verify as jest.Mock).mockReturnValue(mockUser)

      const result = await requireAuth(mockRequest)

      expect(result).toEqual(mockUser)
    })

    it('should return null for missing token', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue(null)
        },
        cookies: {
          get: jest.fn().mockReturnValue(undefined)
        }
      } as unknown as NextRequest

      const result = await requireAuth(mockRequest)

      expect(result).toBeNull()
    })
  })

  describe('requireAdmin', () => {
    it('should return user for admin role', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('Bearer valid.token')
        },
        cookies: {
          get: jest.fn()
        }
      } as unknown as NextRequest

      const adminUser = {
        id: 'user-123',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'ADMIN'
      }
      ;(jwt.verify as jest.Mock).mockReturnValue(adminUser)

      const result = await requireAdmin(mockRequest)

      expect(result).toEqual(adminUser)
    })

    it('should return null for non-admin user', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('Bearer valid.token')
        },
        cookies: {
          get: jest.fn()
        }
      } as unknown as NextRequest

      const memberUser = {
        id: 'user-123',
        email: 'member@example.com',
        name: 'Member User',
        role: 'MEMBER'
      }
      ;(jwt.verify as jest.Mock).mockReturnValue(memberUser)

      const result = await requireAdmin(mockRequest)

      expect(result).toBeNull()
    })
  })

  describe('requireEditorOrAdmin', () => {
    it('should return user for admin role', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('Bearer valid.token')
        },
        cookies: {
          get: jest.fn()
        }
      } as unknown as NextRequest

      const adminUser = {
        id: 'user-123',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'ADMIN'
      }
      ;(jwt.verify as jest.Mock).mockReturnValue(adminUser)

      const result = await requireEditorOrAdmin(mockRequest)

      expect(result).toEqual(adminUser)
    })

    it('should return user for editor role', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('Bearer valid.token')
        },
        cookies: {
          get: jest.fn()
        }
      } as unknown as NextRequest

      const editorUser = {
        id: 'user-123',
        email: 'editor@example.com',
        name: 'Editor User',
        role: 'EDITOR'
      }
      ;(jwt.verify as jest.Mock).mockReturnValue(editorUser)

      const result = await requireEditorOrAdmin(mockRequest)

      expect(result).toEqual(editorUser)
    })

    it('should return null for member role', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('Bearer valid.token')
        },
        cookies: {
          get: jest.fn()
        }
      } as unknown as NextRequest

      const memberUser = {
        id: 'user-123',
        email: 'member@example.com',
        name: 'Member User',
        role: 'MEMBER'
      }
      ;(jwt.verify as jest.Mock).mockReturnValue(memberUser)

      const result = await requireEditorOrAdmin(mockRequest)

      expect(result).toBeNull()
    })
  })
})
