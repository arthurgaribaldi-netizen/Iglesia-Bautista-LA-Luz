import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { shouldUseFallbacks, buildFallbacks } from '@/lib/build-fallbacks';

export async function GET(request: NextRequest) {
  try {
    // Skip database calls during build
    if (shouldUseFallbacks()) {
      return NextResponse.json({
        sermons: buildFallbacks.sermons,
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
    const search = searchParams.get('search') || '';
    
    const skip = (page - 1) * limit;
    
    const where = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { pastor: { contains: search, mode: 'insensitive' as const } },
        { series: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {};
    
    const [sermons, total] = await Promise.all([
      prisma.sermon.findMany({
        where,
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.sermon.count({ where }),
    ]);
    
    return NextResponse.json({
      sermons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Erro ao buscar sermões:', error);
    // Return fallback data on error
    return NextResponse.json({
      sermons: buildFallbacks.sermons,
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
    
    const sermon = await prisma.sermon.create({
      data: {
        title: body.title,
        pastor: body.pastor,
        date: new Date(body.date),
        audioUrl: body.audioUrl,
        videoUrl: body.videoUrl,
        transcript: body.transcript,
        series: body.series,
        description: body.description,
        authorId: body.authorId, // Em produção, viria do token de autenticação
      },
    });
    
    return NextResponse.json(sermon, { status: 201 });
  } catch (error) {
    logger.error('Erro ao criar sermão:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
