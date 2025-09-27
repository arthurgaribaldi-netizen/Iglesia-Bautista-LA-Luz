import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { shouldUseFallbacks, buildFallbacks } from '@/lib/build-fallbacks';

// Tipos para devocionais
interface DevotionalData {
  id: string
  title: string
  content: string
  verse: string
  prayer: string
  date: string
  source: 'la-buena-semilla' | 'guia-ummbe' | 'revista-unidos-uebe' | 'pastor-ricks'
}

// Dados mockados dos devocionais (em produção, viriam de APIs externas)
const devotionalSources = {
  'la-buena-semilla': {
    name: 'La Buena Semilla',
    description: 'Devocional diario de La Buena Semilla',
    url: 'https://labuenasemilla.net',
  },
  'guia-ummbe': {
    name: 'Guía UMMBE',
    description: 'Guía de la Unión de Mujeres Misioneras Bautistas de España',
    url: 'https://ummbe.org',
  },
  'revista-unidos-uebe': {
    name: 'Revista Unidos UEBE',
    description: 'Revista de la Unión Evangélica Bautista de España',
    url: 'https://uebe.org',
  },
  'pastor-ricks': {
    name: 'Pastor Rick\'s',
    description: 'Reflexiones del Pastor Rick',
    url: '#',
  },
};

// Devocional do dia (mockado - em produção viria de API externa)
const getTodaysDevotional = (): DevotionalData => {
  const today = new Date();
  const sources = Object.keys(devotionalSources) as Array<keyof typeof devotionalSources>;
  const source = sources[today.getDate() % sources.length];
  
  return {
    id: `devotional-${today.toISOString().split('T')[0]}`,
    title: `Reflexión del ${today.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
    content: `En este día especial, reflexionamos sobre la importancia de mantener nuestra fe firme en Dios. La Palabra nos enseña que "el justo por la fe vivirá" (Romanos 1:17). 

Cada día es una oportunidad para crecer espiritualmente y acercarnos más a nuestro Salvador. Debemos aprovechar cada momento para servir al Señor y a nuestros hermanos en la fe.

La vida cristiana no es un camino fácil, pero con la ayuda del Espíritu Santo y la comunidad de creyentes, podemos superar cualquier obstáculo que se presente en nuestro camino.`,
    verse: 'Romanos 1:17',
    prayer: `Señor, te agradecemos por este nuevo día que nos has regalado. Ayúdanos a caminar en fe y a ser testimonio de tu amor en todo lo que hagamos. Que nuestra vida refleje tu gloria y que podamos ser instrumentos de bendición para otros. En el nombre de Jesús, amén.`,
    date: today.toISOString().split('T')[0],
    source: source as DevotionalData['source'],
  };
};

// Versículo do dia (mockado - em produção viria de API externa)
const getTodaysVerse = () => {
  const verses = [
    {
      reference: 'Proverbios 21:17',
      text: 'Hombre necesitado será el que ama el deleite, Y el que ama el vino y los ungüentos no se enriquecerá.',
      type: 'proverbio',
    },
    {
      reference: '1ra Samuel 3:19',
      text: 'Y Samuel creció, y Jehová estaba con él, y no dejó caer a tierra ninguna de sus palabras.',
      type: 'verso-oro',
    },
    {
      reference: 'Juan 3:16',
      text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
      type: 'verso-oro',
    },
    {
      reference: 'Proverbios 3:5-6',
      text: 'Fíate de Jehová de todo tu corazón, Y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, Y él enderezará tus veredas.',
      type: 'proverbio',
    },
  ];
  
  const today = new Date();
  const index = today.getDate() % verses.length;
  return verses[index];
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const source = searchParams.get('source');

    // Skip database calls during build
    if (shouldUseFallbacks()) {
      if (type === 'daily') {
        return NextResponse.json({
          success: true,
          data: buildFallbacks.devotional,
          source: devotionalSources[buildFallbacks.devotional.source as keyof typeof devotionalSources],
        });
      }
      
      if (type === 'verse') {
        const verse = getTodaysVerse();
        return NextResponse.json({
          success: true,
          data: verse,
        });
      }
      
      if (type === 'sources') {
        return NextResponse.json({
          success: true,
          data: devotionalSources,
        });
      }
      
      // Return fallback devotional by default
      return NextResponse.json({
        success: true,
        data: buildFallbacks.devotional,
        source: devotionalSources[buildFallbacks.devotional.source as keyof typeof devotionalSources],
      });
    }

    if (type === 'daily') {
      const devotional = getTodaysDevotional();
      return NextResponse.json({
        success: true,
        data: devotional,
        source: devotionalSources[devotional.source as keyof typeof devotionalSources],
      });
    }

    if (type === 'verse') {
      const verse = getTodaysVerse();
      return NextResponse.json({
        success: true,
        data: verse,
      });
    }

    if (type === 'sources') {
      return NextResponse.json({
        success: true,
        data: devotionalSources,
      });
    }

    // Retornar devocional do dia por padrão
    const devotional = getTodaysDevotional();
    return NextResponse.json({
      success: true,
      data: devotional,
      source: devotionalSources[devotional.source as keyof typeof devotionalSources],
    });

  } catch (error) {
    logger.error('Error fetching devotionals:', error);
    // Return fallback data on error
    return NextResponse.json({
      success: true,
      data: buildFallbacks.devotional,
      source: devotionalSources[buildFallbacks.devotional.source as keyof typeof devotionalSources],
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, verse, prayer, source } = body;

    // Validar dados
    if (!title || !content || !verse || !prayer || !source) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 },
      );
    }

    // TODO: Salvar devocional personalizado quando o modelo for criado
    // Por enquanto, apenas retornamos sucesso sem salvar no banco
    // const devotional = await prisma.devotional.create({
    //   data: {
    //     title,
    //     content,
    //     verse,
    //     prayer,
    //     source,
    //     date: new Date().toISOString().split('T')[0]
    //   }
    // })

    return NextResponse.json({
      success: true,
      message: 'Devocional criado com sucesso',
    });

  } catch (error) {
    logger.error('Error creating devotional:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
