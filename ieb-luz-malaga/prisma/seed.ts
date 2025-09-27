import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário admin padrão
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@igrejabautista.com' },
    update: {},
    create: {
      email: 'admin@igrejabautista.com',
      name: 'Administrador',
      role: 'ADMIN',
    },
  });

  // Criar alguns versículos bíblicos de exemplo
  const verses = [
    {
      reference: 'João 3:16',
      text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
      book: 'João',
      chapter: 3,
      verse: 16,
      version: 'RVR1960',
    },
    {
      reference: 'Salmo 23:1',
      text: 'O Senhor é o meu pastor; nada me faltará.',
      book: 'Salmos',
      chapter: 23,
      verse: 1,
      version: 'RVR1960',
    },
    {
      reference: 'Filipenses 4:13',
      text: 'Posso todas as coisas naquele que me fortalece.',
      book: 'Filipenses',
      chapter: 4,
      verse: 13,
      version: 'RVR1960',
    },
  ];

  for (const verse of verses) {
    // Check if verse already exists
    const existingVerse = await prisma.bibleVerse.findFirst({
      where: { reference: verse.reference },
    });
    
    if (!existingVerse) {
      await prisma.bibleVerse.create({
        data: verse,
      });
    }
  }

  // Criar um evento de exemplo
  await prisma.event.upsert({
    where: { id: 'sample-event-1' },
    update: {},
    create: {
      id: 'sample-event-1',
      title: 'Culto Dominical',
      description: 'Culto de adoração e pregação da Palavra',
      startDate: new Date('2024-01-07T10:00:00Z'),
      endDate: new Date('2024-01-07T12:00:00Z'),
      location: 'Igreja Batista La Luz',
      capacity: 100,
      isPublic: true,
      organizerId: adminUser.id,
    },
  });

  console.log('Seed executado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async() => {
    await prisma.$disconnect();
  });
