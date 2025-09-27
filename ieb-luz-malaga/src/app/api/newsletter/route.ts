import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { logger } from '@/lib/logger';

// Schema de validação para newsletter
const newsletterSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados
    const validationResult = newsletterSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Datos inválidos',
          details: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const { email, name } = validationResult.data;

    // Verificar se o email já está cadastrado
    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email }
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Este email ya está suscrito al newsletter' 
          },
          { status: 409 }
        );
      } else {
        // Reativar assinatura
        const reactivatedSubscriber = await prisma.newsletter.update({
          where: { email },
          data: { 
            isActive: true,
            name: name || existingSubscriber.name,
            unsubscribedAt: null
          }
        });

        return NextResponse.json({
          success: true,
          message: 'Newsletter reactivado correctamente',
          data: reactivatedSubscriber
        });
      }
    }

    // Criar nova assinatura
    const newSubscriber = await prisma.newsletter.create({
      data: {
        email,
        name,
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Suscripción al newsletter exitosa',
      data: newSubscriber
    });

  } catch (error) {
    logger.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor', 
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Construir condições de busca
    const whereConditions: any = {};
    if (active === 'true') {
      whereConditions.isActive = true;
    }

    // Buscar assinantes com paginação
    const subscribers = await prisma.newsletter.findMany({
      where: whereConditions,
      orderBy: { subscribedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    // Contar total
    const total = await prisma.newsletter.count({
      where: whereConditions
    });

    // Estatísticas
    const stats = await prisma.newsletter.groupBy({
      by: ['isActive'],
      _count: {
        isActive: true
      }
    });

    // Processar estatísticas
    const activeCount = stats.find(stat => stat.isActive === true)?._count.isActive || 0;
    const inactiveCount = stats.find(stat => stat.isActive === false)?._count.isActive || 0;

    return NextResponse.json({
      success: true,
      data: subscribers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        active: activeCount,
        inactive: inactiveCount,
        total: activeCount + inactiveCount,
      },
    });

  } catch (error) {
    logger.error('Error fetching newsletter subscribers:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor', 
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email requerido', 
        },
        { status: 400 },
      );
    }

    // Verificar se o email existe
    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email }
    });

    if (!existingSubscriber) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email no encontrado en el newsletter' 
        },
        { status: 404 }
      );
    }

    if (!existingSubscriber.isActive) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Este email ya está desuscrito del newsletter' 
        },
        { status: 409 }
      );
    }

    // Desativar assinatura (soft delete)
    const unsubscribedSubscriber = await prisma.newsletter.update({
      where: { email },
      data: { 
        isActive: false,
        unsubscribedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Desuscripción exitosa',
      data: unsubscribedSubscriber
    });

  } catch (error) {
    logger.error('Error unsubscribing from newsletter:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor', 
      },
      { status: 500 },
    );
  }
}
