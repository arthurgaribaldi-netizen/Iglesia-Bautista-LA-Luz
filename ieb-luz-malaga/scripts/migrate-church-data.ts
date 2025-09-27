import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dados baseados no site original da IEB La Luz Málaga
const churchData = {
  // Informações da igreja
  churchInfo: {
    name: "Iglesia Evangélica Bautista La Luz",
    location: "Málaga, España",
    cif: "R2900286B",
    ministryNumber: "016332",
    website: "https://ieblaluzmalaga.es/",
  },

  // Horários regulares baseados no site original
  regularSchedule: [
    {
      title: "Estudio Bíblico y Escuela Dominical",
      description: "Estudio bíblico presencial",
      day: "Domingo",
      time: "11:00",
      location: "Templo Principal",
      type: "study",
      recurring: "weekly",
    },
    {
      title: "Culto de la Tarde",
      description: "Culto de adoração com transmissão en directo",
      day: "Domingo", 
      time: "18:00",
      location: "Templo Principal",
      type: "worship",
      recurring: "weekly",
      isLiveStream: true,
    },
  ],

  // Recursos espirituais mencionados no site original
  spiritualResources: [
    {
      title: "La Buena Semilla",
      description: "Devocional diario",
      type: "devotional",
      category: "Devocional",
    },
    {
      title: "Guía UMMBE", 
      description: "Guía de estudio bíblico",
      type: "guide",
      category: "Estudio",
    },
    {
      title: "Revista Unidos UEBE",
      description: "Revista de la Unión Evangélica Bautista de España",
      type: "magazine", 
      category: "Revista",
    },
    {
      title: "Pastor Rick's",
      description: "Recursos del Pastor Rick",
      type: "pastor_resource",
      category: "Pastor",
    },
  ],

  // Enlaces de interés do site original
  usefulLinks: [
    {
      title: "Unión Evangélica Bautista de España (UEBE)",
      url: "https://www.uebe.org/",
      description: "Sitio web oficial de la UEBE",
    },
    {
      title: "Facultad Protestante de Teología",
      url: "https://www.fpt.es/",
      description: "Formación teológica protestante",
    },
    {
      title: "FEREDE",
      url: "https://www.ferede.org/",
      description: "Federación de Entidades Religiosas Evangélicas de España",
    },
    {
      title: "Actualidad Evangélica",
      url: "https://www.actualidadevangelica.es/",
      description: "Noticias del mundo evangélico",
    },
    {
      title: "Alianza Evangélica Española",
      url: "https://www.alianzaevangelica.org/",
      description: "Alianza Evangélica Española",
    },
    {
      title: "Buenas Noticias TV",
      url: "https://www.buenasnoticiastv.com/",
      description: "Televisión cristiana",
    },
    {
      title: "El Eco Bautista",
      url: "https://www.eleco.org/",
      description: "Revista bautista",
    },
    {
      title: "Salvación en Cristo",
      url: "https://www.salvacionencristo.com/",
      description: "Recursos de evangelización",
    },
  ],

  // Versículos bíblicos mencionados no site original
  featuredVerses: [
    {
      reference: "Hebreos 10:24-25",
      text: "Y considerémonos unos a otros para estimularnos al amor y a las buenas obras; no dejando de congregarnos, como algunos tienen por costumbre, sino exhortándonos; y tanto más, cuanto veis que aquel día se acerca.",
      book: "Hebreos",
      chapter: 10,
      verse: 24,
      version: "RVR1960",
    },
    {
      reference: "Proverbios 21:25",
      text: "El deseo del perezoso le mata, Porque sus manos no quieren trabajar.",
      book: "Proverbios", 
      chapter: 21,
      verse: 25,
      version: "RVR1960",
    },
    {
      reference: "Ezequiel 25:15",
      text: "Así ha dicho Jehová el Señor: Por lo que hicieron los filisteos con venganza, cuando se vengaron con despecho de ánimo, destruyendo por antiguas enemistades;",
      book: "Ezequiel",
      chapter: 25, 
      verse: 15,
      version: "RVR1960",
    },
  ],
};

async function migrateChurchData() {
  try {
    // Criar usuário administrador padrão
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@ieblaluz.es' },
      update: {},
      create: {
        email: 'admin@ieblaluz.es',
        name: 'Administrador IEB La Luz',
        role: 'ADMIN',
      },
    });

    // Migrar versículos bíblicos
    for (const verse of churchData.featuredVerses) {
      await prisma.bibleVerse.upsert({
        where: { 
          reference_version: {
            reference: verse.reference,
            version: verse.version,
          },
        },
        update: verse,
        create: verse,
      });
    }

    // Migrar eventos regulares (horários fixos)
    for (const schedule of churchData.regularSchedule) {
      // Para eventos semanais, criar instâncias para os próximos domingos
      if (schedule.recurring === 'weekly') {
        const currentDate = new Date();
        
        // Encontrar próximo domingo
        const daysUntilSunday = (7 - currentDate.getDay()) % 7;
        const nextSunday = new Date(currentDate);
        nextSunday.setDate(currentDate.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
        
        // Criar eventos para os próximos 4 domingos
        for (let i = 0; i < 4; i++) {
          const eventDate = new Date(nextSunday);
          eventDate.setDate(nextSunday.getDate() + (i * 7));
          
          const eventDateTime = new Date(eventDate);
          const [hours, minutes] = schedule.time.split(':');
          eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

          await prisma.event.create({
            data: {
              title: schedule.title,
              description: schedule.description,
              startDate: eventDateTime,
              endDate: new Date(eventDateTime.getTime() + 2 * 60 * 60 * 1000), // +2 horas
              location: schedule.location,
              isPublic: true,
              organizerId: adminUser.id,
            },
          });
        }
      }
    }

    // Criar alguns sermões de exemplo baseados no contexto da igreja
    const sampleSermons = [
      {
        title: "La Importancia de Congregarse",
        pastor: "Pastor Principal",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 semana atrás
        series: "Hebreos 10:24-25",
        description: "Reflexión sobre la importancia de congregarse regularmente como comunidad de fe.",
        transcript: "En Hebreos 10:24-25, el autor nos exhorta a considerar unos a otros para estimularnos al amor y a las buenas obras, no dejando de congregarnos...",
      },
      {
        title: "El Trabajo y la Diligencia",
        pastor: "Pastor Principal", 
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 semanas atrás
        series: "Proverbios 21:25",
        description: "Estudio sobre la importancia del trabajo diligente según las Escrituras.",
        transcript: "El libro de Proverbios nos enseña mucho sobre la sabiduría práctica. En el capítulo 21, versículo 25, encontramos una advertencia sobre la pereza...",
      },
      {
        title: "La Justicia de Dios",
        pastor: "Pastor Principal",
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 semanas atrás  
        series: "Ezequiel 25:15",
        description: "Reflexión sobre la justicia divina y el juicio de Dios.",
        transcript: "El profeta Ezequiel nos presenta un mensaje de juicio y justicia divina. En el capítulo 25, versículo 15, vemos cómo Dios actúa con justicia...",
      },
    ];

    for (const sermon of sampleSermons) {
      await prisma.sermon.create({
        data: {
          ...sermon,
          authorId: adminUser.id,
        },
      });
    }

    // Migrar recursos espirituais
    for (const resource of churchData.spiritualResources) {
      await prisma.spiritualResource.create({
        data: resource,
      });
    }

    // Migrar links úteis
    for (const link of churchData.usefulLinks) {
      await prisma.usefulLink.create({
        data: link,
      });
    }

    // Criar informações da igreja
    await prisma.churchInfo.create({
      data: churchData.churchInfo,
    });

  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  migrateChurchData()
    .then(() => {
      process.exit(0);
    })
    .catch((_error) => {
      process.exit(1);
    });
}

export { migrateChurchData, churchData };
