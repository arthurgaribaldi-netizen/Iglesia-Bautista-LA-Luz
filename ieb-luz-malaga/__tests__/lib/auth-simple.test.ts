import { hashPassword, verifyPassword } from '../../src/lib/auth'

// Mock do bcrypt
jest.mock('bcryptjs')

describe('Auth Library - Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const mockHashedPassword = 'hashedPassword123'
      const bcrypt = require('bcryptjs')
      bcrypt.hash.mockResolvedValue(mockHashedPassword)

      const password = 'plainPassword123'
      const result = await hashPassword(password)

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 12)
      expect(result).toBe(mockHashedPassword)
    })

    it('should handle hashing errors', async () => {
      const error = new Error('Hashing failed')
      const bcrypt = require('bcryptjs')
      bcrypt.hash.mockRejectedValue(error)

      await expect(hashPassword('password')).rejects.toThrow('Hashing failed')
    })
  })

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const bcrypt = require('bcryptjs')
      bcrypt.compare.mockResolvedValue(true)

      const result = await verifyPassword('password', 'hashedPassword')
      
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword')
      expect(result).toBe(true)
    })

    it('should reject incorrect password', async () => {
      const bcrypt = require('bcryptjs')
      bcrypt.compare.mockResolvedValue(false)

      const result = await verifyPassword('wrongPassword', 'hashedPassword')
      
      expect(result).toBe(false)
    })
  })
})
