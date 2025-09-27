import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

const initAdminSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
});

export async function POST(request: NextRequest) {
  try {
    // Verificar se já existe um admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: 'Administrador já foi inicializado' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { email, password, name } = initAdminSchema.parse(body);

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criar usuário admin
    const admin = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
        role: 'ADMIN',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Administrador criado com sucesso',
      admin,
    });
  } catch (error) {
    logger.error('Erro ao inicializar admin:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Dados inválidos', errors: error.errors },
        { status: 400 }
      );
    }

    // Verificar se é erro de email duplicado
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { success: false, message: 'Email já está em uso' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar se já existe um admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      initialized: !!existingAdmin,
      admin: existingAdmin,
    });
  } catch (error) {
    logger.error('Erro ao verificar status do admin:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
