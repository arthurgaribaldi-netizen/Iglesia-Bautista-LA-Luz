import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

// Links organizacionais baseados no site original
const organizationalLinks = [
  {
    title: 'Unión Evangélica Bautista de España (UEBE)',
    url: 'https://uebe.org',
    description: 'Organización nacional que agrupa a las iglesias bautistas de España',
    category: 'organizacion-nacional',
    isActive: true,
  },
  {
    title: 'Facultad Protestante de Teología',
    url: 'https://fptmadrid.org',
    description: 'Centro de formación teológica protestante en Madrid',
    category: 'educacion',
    isActive: true,
  },
  {
    title: 'FEREDE',
    url: 'https://ferede.org',
    description: 'Federación de Entidades Religiosas Evangélicas de España',
    category: 'organizacion-nacional',
    isActive: true,
  },
  {
    title: 'Actualidad Evangélica',
    url: 'https://actualidadevangelica.es',
    description: 'Portal de noticias y actualidad del mundo evangélico',
    category: 'medios',
    isActive: true,
  },
  {
    title: 'Alianza Evangélica Española',
    url: 'https://alianzaevangelica.org',
    description: 'Organización que promueve la unidad entre iglesias evangélicas',
    category: 'organizacion-nacional',
    isActive: true,
  },
  {
    title: 'Artículos del Pastor',
    url: '#',
    description: 'Reflexiones y artículos del pastor de la iglesia',
    category: 'recursos-pastorales',
    isActive: true,
  },
  {
    title: 'Buenas Noticias TV',
    url: 'https://buenasnoticiastv.com',
    description: 'Canal de televisión cristiana en español',
    category: 'medios',
    isActive: true,
  },
  {
    title: 'El Eco Bautista',
    url: 'https://elecobautista.com',
    description: 'Revista digital bautista con noticias y artículos',
    category: 'medios',
    isActive: true,
  },
  {
    title: 'Salvación en Cristo',
    url: 'https://salvacionencristo.org',
    description: 'Recursos para evangelización y discipulado',
    category: 'evangelizacion',
    isActive: true,
  },
];

const categories = {
  'organizacion-nacional': {
    name: 'Organización Nacional',
    description: 'Organizaciones bautistas y evangélicas a nivel nacional',
    icon: '🏛️',
  },
  'educacion': {
    name: 'Educación',
    description: 'Instituciones de formación teológica y ministerial',
    icon: '🎓',
  },
  'medios': {
    name: 'Medios de Comunicación',
    description: 'Revistas, periódicos y canales de televisión cristianos',
    icon: '📺',
  },
  'recursos-pastorales': {
    name: 'Recursos Pastorales',
    description: 'Materiales y recursos para pastores y líderes',
    icon: '📚',
  },
  'evangelizacion': {
    name: 'Evangelización',
    description: 'Recursos para evangelización y discipulado',
    icon: '✝️',
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const active = searchParams.get('active');

    // Filtrar por categoría si se especifica
    let filteredLinks = organizationalLinks;
    if (category) {
      filteredLinks = organizationalLinks.filter(link => link.category === category);
    }

    // Filtrar por estado activo si se especifica
    if (active === 'true') {
      filteredLinks = filteredLinks.filter(link => link.isActive);
    }

    // Agregar información de categoría a cada link
    const linksWithCategory = filteredLinks.map(link => ({
      ...link,
      categoryInfo: categories[link.category as keyof typeof categories],
    }));

    return NextResponse.json({
      success: true,
      data: linksWithCategory,
      categories: categories,
      total: linksWithCategory.length,
    });

  } catch (error) {
    logger.error('Error fetching organizational links:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, url, description, category } = body;

    // Validar datos
    if (!title || !url || !category) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 },
      );
    }

    // Verificar si la categoría existe
    if (!categories[category as keyof typeof categories]) {
      return NextResponse.json(
        { success: false, error: 'Categoría no válida' },
        { status: 400 },
      );
    }

    // Guardar en la base de datos
    const link = await prisma.usefulLink.create({
      data: {
        title,
        url,
        description,
        category,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: link,
    });

  } catch (error) {
    logger.error('Error creating organizational link:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, url, description, category, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID requerido' },
        { status: 400 },
      );
    }

    const link = await prisma.usefulLink.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(url && { url }),
        ...(description && { description }),
        ...(category && { category }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({
      success: true,
      data: link,
    });

  } catch (error) {
    logger.error('Error updating organizational link:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID requerido' },
        { status: 400 },
      );
    }

    await prisma.usefulLink.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Link eliminado correctamente',
    });

  } catch (error) {
    logger.error('Error deleting organizational link:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
