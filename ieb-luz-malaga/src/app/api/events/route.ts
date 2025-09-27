import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { shouldUseFallbacks, buildFallbacks } from '@/lib/build-fallbacks';

export async function GET(request: NextRequest) {
  try {
    // Skip database calls during build
    if (shouldUseFallbacks()) {
      return NextResponse.json({
        events: buildFallbacks.events,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const upcoming = searchParams.get('upcoming') === 'true';
    
    const skip = (page - 1) * limit;
    
    const where = upcoming ? {
      startDate: {
        gte: new Date(),
      },
      isPublic: true,
    } : {
      isPublic: true,
    };
    
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          organizer: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { startDate: 'asc' },
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);
    
    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Erro ao buscar eventos:', error);
    // Return fallback data on error
    return NextResponse.json({
      events: buildFallbacks.events,
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        pages: 1,
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        location: body.location,
        capacity: body.capacity,
        isPublic: body.isPublic ?? true,
        organizerId: body.organizerId, // Em produção, viria do token de autenticação
      },
    });
    
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    logger.error('Erro ao criar evento:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
