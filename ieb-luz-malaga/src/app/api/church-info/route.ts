import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { shouldUseFallbacks, buildFallbacks } from '@/lib/build-fallbacks';

export async function GET() {
  try {
    // Skip database calls during build
    if (shouldUseFallbacks()) {
      return NextResponse.json({
        churchInfo: buildFallbacks.churchInfo
      });
    }

    const churchInfo = await prisma.churchInfo.findFirst({
      orderBy: { updatedAt: 'desc' },
    });
    
    if (!churchInfo) {
      return NextResponse.json(
        { message: 'Informações da igreja não encontradas' },
        { status: 404 },
      );
    }
    
    return NextResponse.json({ churchInfo });
  } catch (error) {
    logger.error('Erro ao buscar informações da igreja:', error);
    // Return fallback data on error
    return NextResponse.json({
      churchInfo: buildFallbacks.churchInfo
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // First, try to find existing church info
    const existingChurchInfo = await prisma.churchInfo.findFirst();
    
    let churchInfo;
    if (existingChurchInfo) {
      // Update existing record
      churchInfo = await prisma.churchInfo.update({
        where: { id: existingChurchInfo.id },
        data: {
          name: body.name,
          location: body.location,
          cif: body.cif,
          ministryNumber: body.ministryNumber,
          email: body.email,
          phone: body.phone,
          address: body.address,
          website: body.website,
          youtubeChannel: body.youtubeChannel,
          facebookPage: body.facebookPage,
          instagramPage: body.instagramPage,
        },
      });
    } else {
      // Create new record
      churchInfo = await prisma.churchInfo.create({
        data: {
          name: body.name,
          location: body.location,
          cif: body.cif,
          ministryNumber: body.ministryNumber,
          email: body.email,
          phone: body.phone,
          address: body.address,
          website: body.website,
          youtubeChannel: body.youtubeChannel,
          facebookPage: body.facebookPage,
          instagramPage: body.instagramPage,
        },
      });
    }
    
    return NextResponse.json(churchInfo);
  } catch (error) {
    logger.error('Erro ao atualizar informações da igreja:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
