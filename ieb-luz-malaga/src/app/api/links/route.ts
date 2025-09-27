import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { shouldUseFallbacks, buildFallbacks } from '@/lib/build-fallbacks';

export async function GET(request: NextRequest) {
  try {
    // Skip database calls during build
    if (shouldUseFallbacks()) {
      return NextResponse.json({ links: buildFallbacks.links });
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    
    const where = {
      isActive: true,
      ...(category && { category }),
    };
    
    const links = await prisma.usefulLink.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({ links });
  } catch (error) {
    logger.error('Erro ao buscar links:', error);
    // Return fallback data on error
    return NextResponse.json({ links: buildFallbacks.links });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const link = await prisma.usefulLink.create({
      data: {
        title: body.title,
        url: body.url,
        description: body.description,
        category: body.category,
        isActive: body.isActive ?? true,
      },
    });
    
    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    logger.error('Erro ao criar link:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
