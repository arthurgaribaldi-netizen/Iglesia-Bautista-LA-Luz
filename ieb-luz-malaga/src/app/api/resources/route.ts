import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { shouldUseFallbacks, buildFallbacks } from '@/lib/build-fallbacks';

export async function GET(request: NextRequest) {
  try {
    // Skip database calls during build
    if (shouldUseFallbacks()) {
      return NextResponse.json({ resources: buildFallbacks.resources });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    
    const where = {
      isActive: true,
      ...(type && { type }),
      ...(category && { category }),
    };
    
    const resources = await prisma.spiritualResource.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({ resources });
  } catch (error) {
    logger.error('Erro ao buscar recursos:', error);
    // Return fallback data on error
    return NextResponse.json({ resources: buildFallbacks.resources });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const resource = await prisma.spiritualResource.create({
      data: {
        title: body.title,
        description: body.description,
        type: body.type,
        category: body.category,
        url: body.url,
        downloadUrl: body.downloadUrl,
        isActive: body.isActive ?? true,
      },
    });
    
    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    logger.error('Erro ao criar recurso:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
