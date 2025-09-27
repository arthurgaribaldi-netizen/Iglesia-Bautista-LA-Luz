import { NextResponse } from 'next/server'
import { prisma } from '../../../../ieb-luz-malaga/src/lib/db'
import { hashPassword } from '../../../../lib/auth'

export async function POST() {
  try {
    // Verificar se já existe um admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin já existe' },
        { status: 400 }
      )
    }

    // Criar usuário admin inicial
    const adminPassword = await hashPassword('admin123')
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@igreja.com',
        name: 'Administrador',
        role: 'ADMIN',
        password: adminPassword,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Admin criado com sucesso',
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    })
  } catch (error) {
    console.error('Erro ao criar admin:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
