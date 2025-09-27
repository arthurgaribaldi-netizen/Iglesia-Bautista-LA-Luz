import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, generateToken } from '../../../../lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const user = await authenticateUser(email, password)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email ou senha inválidos' },
        { status: 401 }
      )
    }

    const token = generateToken(user)
    
    const response = NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

    // Definir cookie seguro
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 horas
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Dados inválidos', errors: error.issues },
        { status: 400 }
      )
    }

    console.error('Erro no login:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Logout realizado com sucesso'
  })

  response.cookies.delete('auth-token')
  return response
}
