import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z, ZodIssue } from 'zod';

// Validation schema for search parameters
const searchParamsSchema = z.object({
  q: z.string().min(1, 'Query de busca é obrigatória').max(500, 'Query muito longa'),
  version: z.string().optional().default('RVR1960'),
  book: z.string().optional(),
  chapter: z.string().optional(),
  verse: z.string().optional(),
  useRegex: z.string().optional().default('false'),
  useAllBibles: z.string().optional().default('false'),
});

// Lista de livros da Bíblia para validação
const bibleBooks = [
  'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio',
  'Josué', 'Jueces', 'Rut', '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes',
  '1 Crónicas', '2 Crónicas', 'Esdras', 'Nehemías', 'Ester',
  'Job', 'Salmos', 'Proverbios', 'Eclesiastés', 'Cantares',
  'Isaías', 'Jeremías', 'Lamentaciones', 'Ezequiel', 'Daniel',
  'Oseas', 'Joel', 'Amós', 'Abdías', 'Jonás', 'Miqueas',
  'Nahum', 'Habacuc', 'Sofonías', 'Hageo', 'Zacarías', 'Malaquías',
  'Mateo', 'Marcos', 'Lucas', 'Juan', 'Hechos', 'Romanos',
  '1 Corintios', '2 Corintios', 'Gálatas', 'Efesios', 'Filipenses',
  'Colosenses', '1 Tesalonicenses', '2 Tesalonicenses', '1 Timoteo',
  '2 Timoteo', 'Tito', 'Filemón', 'Hebreos', 'Santiago', '1 Pedro',
  '2 Pedro', '1 Juan', '2 Juan', '3 Juan', 'Judas', 'Apocalipsis',
];

// Bible search API endpoint
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Validate search parameters
    const validationResult = searchParamsSchema.safeParse({
      q: searchParams.get('q') || '',
      version: searchParams.get('version') || 'RVR1960',
      book: searchParams.get('book') || undefined,
      chapter: searchParams.get('chapter') || undefined,
      verse: searchParams.get('verse') || undefined,
      useRegex: searchParams.get('useRegex') || 'false',
      useAllBibles: searchParams.get('useAllBibles') || 'false',
    });
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Parâmetros inválidos',
          details: validationResult.error.issues.map((err: ZodIssue) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }
    
    const { q: query, version, book, chapter, verse, useRegex, useAllBibles } = validationResult.data;
    
    // Construir condições de busca
    const whereConditions: {
      text?: {
        search?: string;
        contains?: string;
        mode?: 'insensitive';
      };
      book?: string;
      chapter?: number;
      verse?: number;
      version?: string;
    } = {};
    
    // Busca por texto
    if (query) {
      if (useRegex === 'true') {
        // Busca com regex (cuidado com segurança)
        whereConditions.text = {
          search: query.replace(/[^a-zA-Z0-9\s]/g, ''), // Sanitizar regex
        };
      } else {
        // Busca simples por palavra-chave
        whereConditions.text = {
          contains: query,
          mode: 'insensitive',
        };
      }
    }
    
    // Busca por livro específico
    if (book) {
      const bookMatch = bibleBooks.find(b => 
        b.toLowerCase().includes(book.toLowerCase()) ||
        book.toLowerCase().includes(b.toLowerCase()),
      );
      if (bookMatch) {
        whereConditions.book = bookMatch;
      }
    }
    
    // Busca por capítulo específico
    if (chapter) {
      whereConditions.chapter = parseInt(chapter);
    }
    
    // Busca por versículo específico
    if (verse) {
      whereConditions.verse = parseInt(verse);
    }
    
    // Versão da Bíblia
    if (useAllBibles !== 'true') {
      whereConditions.version = version;
    }
    
    // Buscar versículos
    const verses = await prisma.bibleVerse.findMany({
      where: whereConditions,
      orderBy: [
        { book: 'asc' },
        { chapter: 'asc' },
        { verse: 'asc' },
      ],
      take: 100, // Aumentar limite para busca avançada
    });
    
    // Se não encontrou nada, tentar buscar por referência
    let referenceResults: Array<{
      id: string
      reference: string
      text: string
      book: string
      chapter: number
      verse: number
      version: string
      createdAt: Date
    }> = [];
    if (verses.length === 0) {
      const referencePattern = /^(\d*\s*[A-Za-záàâãéèêíìîóòôõúùûç]+)\s+(\d+):(\d+)(?:-(\d+))?$/i;
      const match = query.match(referencePattern);
      
      if (match) {
        const [, book, chapter, startVerse, endVerse] = match;
        const bookName = book.trim();
        
        referenceResults = await prisma.bibleVerse.findMany({
          where: {
            book: {
              contains: bookName,
            },
            chapter: parseInt(chapter),
            verse: {
              gte: parseInt(startVerse),
              ...(endVerse ? { lte: parseInt(endVerse) } : {}),
            },
            version: version,
          },
          orderBy: { verse: 'asc' },
        });
      }
    }
    
    const results = verses.length > 0 ? verses : referenceResults;
    
    return NextResponse.json({
      query,
      version,
      results: results.map((verse: {
        reference: string
        text: string
        book: string
        chapter: number
        verse: number
      }) => ({
        reference: verse.reference,
        text: verse.text,
        book: verse.book,
        chapter: verse.chapter,
        verse: verse.verse,
      })),
      total: results.length,
    });
  } catch (error) {
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('connection')) {
        return NextResponse.json(
          { 
            error: 'Erro de conexão com o banco de dados',
            message: 'Tente novamente em alguns instantes',
          },
          { status: 503 },
        );
      }
      
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { 
            error: 'Timeout na consulta',
            message: 'A consulta demorou muito para ser processada',
          },
          { status: 408 },
        );
      }
    }
    
    // Generic error response
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        ...(process.env.NODE_ENV === 'development' && { 
          details: error instanceof Error ? error.message : 'Unknown error',
        }),
      },
      { status: 500 },
    );
  }
}
