import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { rateLimitContact } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Assunto deve ter pelo menos 5 caracteres'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitContact(request, 'contact');
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();
    
    // Validar dados
    const validatedData = contactSchema.parse(body);
    
    // Salvar no banco de dados
    const contact = await prisma.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || '',
        subject: validatedData.subject,
        message: validatedData.message,
      },
    });
    
    // Aqui você pode adicionar envio de email usando Resend
    // await sendContactEmail(validatedData)
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        id: contact.id,
        churchInfo: {
          name: 'Iglesia Evangélica Bautista La Luz',
          address: 'Avenida Antonio Gaudí, 4, 29004 Málaga, Espanha',
          cif: 'R2900286B',
          ferede: '016332',
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Dados inválidos',
          errors: error.issues, 
        },
        { status: 400 },
      );
    }
    
    logger.error('Erro ao processar contato:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro interno do servidor', 
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    
    return NextResponse.json({ contacts });
  } catch (error) {
    logger.error('Erro ao buscar contatos:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
