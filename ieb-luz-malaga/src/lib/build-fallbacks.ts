/**
 * Sistema de Fallbacks para Build Time
 * 
 * Este arquivo contém configurações e utilitários para garantir que
 * a aplicação funcione corretamente durante o processo de build,
 * mesmo quando o banco de dados não está disponível.
 */

import { buildLogger } from './logger';

export interface BuildConfig {
  skipDatabaseCheck: boolean;
  useFallbackData: boolean;
  environment: 'development' | 'production' | 'test';
}

/**
 * Verifica se devemos usar dados de fallback
 */
export const shouldUseFallbacks = (): boolean => {
  return (
    process.env.SKIP_DATABASE_CHECK === 'true' ||
    process.env.NODE_ENV === 'test' ||
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes('placeholder') ||
    process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL
  );
};

/**
 * Configuração de build atual
 */
export const getBuildConfig = (): BuildConfig => {
  return {
    skipDatabaseCheck: process.env.SKIP_DATABASE_CHECK === 'true',
    useFallbackData: shouldUseFallbacks(),
    environment: (process.env.NODE_ENV as BuildConfig['environment']) || 'development',
  };
};

/**
 * Dados de fallback para diferentes cenários
 */
export const buildFallbacks = {
  // Informações básicas da igreja
  churchInfo: {
    name: 'Iglesia Evangélica Bautista La Luz',
    location: 'Málaga, Espanha',
    address: 'Avenida Antonio Gaudí, 4, 29004 Málaga, Espanha',
    email: 'info@ieb-luz-malaga.com',
    phone: '+34 952 123 456',
    website: 'https://ieb-luz-malaga.com',
    youtubeChannel: '',
    facebookPage: '',
    instagramPage: '',
    cif: '',
    ministryNumber: '',
  },

  // Sermões de exemplo
  sermons: [
    {
      id: 'fallback-sermon-1',
      title: 'La Fe que Mueve Montañas',
      pastor: 'Pastor Principal',
      date: new Date().toISOString(),
      audioUrl: null,
      videoUrl: null,
      transcript: 'En este sermón exploramos la importancia de la fe en nuestras vidas. La fe es el fundamento de nuestra relación con Dios y nos permite superar cualquier obstáculo que se presente en nuestro camino.',
      series: 'Serie de Fe',
      description: 'Un mensaje inspirador sobre la fe que transforma vidas',
      author: { name: 'Pastor Principal' },
      createdAt: new Date().toISOString(),
    },
    {
      id: 'fallback-sermon-2',
      title: 'El Amor de Dios',
      pastor: 'Pastor Principal',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 semana atrás
      audioUrl: null,
      videoUrl: null,
      transcript: 'Reflexionamos sobre el amor incondicional de Dios hacia nosotros y cómo este amor debe reflejarse en nuestras relaciones con los demás.',
      series: 'Serie de Amor',
      description: 'Una reflexión profunda sobre el amor divino',
      author: { name: 'Pastor Principal' },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ],

  // Eventos de exemplo
  events: [
    {
      id: 'fallback-event-1',
      title: 'Culto Dominical',
      description: 'Nuestro culto dominical regular donde nos reunimos para adorar a Dios y compartir la Palabra',
      startDate: new Date().toISOString(),
      endDate: null,
      location: 'Iglesia Evangélica Bautista La Luz',
      capacity: 100,
      isPublic: true,
      organizer: { name: 'Pastor Principal' },
      createdAt: new Date().toISOString(),
    },
    {
      id: 'fallback-event-2',
      title: 'Estudio Bíblico',
      description: 'Estudio semanal de la Biblia para profundizar en las Escrituras',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias no futuro
      endDate: null,
      location: 'Iglesia Evangélica Bautista La Luz',
      capacity: 30,
      isPublic: true,
      organizer: { name: 'Pastor Principal' },
      createdAt: new Date().toISOString(),
    }
  ],

  // Recursos espirituais
  resources: [
    {
      id: 'fallback-resource-1',
      title: 'Guía de Estudio Bíblico',
      description: 'Una guía completa para el estudio personal y grupal de la Biblia',
      type: 'guide',
      category: 'estudio',
      url: '#',
      downloadUrl: '#',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'fallback-resource-2',
      title: 'Devocional Diario',
      description: 'Reflexiones diarias para fortalecer tu vida espiritual',
      type: 'devotional',
      category: 'devocional',
      url: '#',
      downloadUrl: '#',
      isActive: true,
      createdAt: new Date().toISOString(),
    }
  ],

  // Links úteis
  links: [
    {
      id: 'fallback-link-1',
      title: 'Unión Evangélica Bautista de España',
      url: 'https://uebe.org',
      description: 'Sitio web oficial de la UEBE',
      category: 'organizacional',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'fallback-link-2',
      title: 'Facultad Protestante de Teología',
      url: 'https://fptmadrid.org',
      description: 'Centro de formación teológica protestante',
      category: 'educacion',
      isActive: true,
      createdAt: new Date().toISOString(),
    }
  ],

  // Devocional do dia
  devotional: {
    id: 'fallback-devotional-1',
    title: 'Reflexión del Día',
    content: `En este día especial, reflexionamos sobre la importancia de mantener nuestra fe firme en Dios. La Palabra nos enseña que "el justo por la fe vivirá" (Romanos 1:17).

Cada día es una oportunidad para crecer espiritualmente y acercarnos más a nuestro Salvador. Debemos aprovechar cada momento para servir al Señor y a nuestros hermanos en la fe.

La vida cristiana no es un camino fácil, pero con la ayuda del Espíritu Santo y la comunidad de creyentes, podemos superar cualquier obstáculo que se presente en nuestro camino.`,
    verse: 'Romanos 1:17',
    prayer: `Señor, te agradecemos por este nuevo día que nos has regalado. Ayúdanos a caminar en fe y a ser testimonio de tu amor en todo lo que hagamos. Que nuestra vida refleje tu gloria y que podamos ser instrumentos de bendición para otros. En el nombre de Jesús, amén.`,
    date: new Date().toISOString().split('T')[0],
    source: 'la-buena-semilla',
  },

  // Versículo do dia
  verse: {
    reference: 'Juan 3:16',
    text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
    type: 'verso-oro',
  },

  // Informações de paginação padrão
  pagination: {
    page: 1,
    limit: 10,
    total: 1,
    pages: 1,
  },
};

/**
 * Utilitário para criar respostas de API com fallbacks
 */
export const createFallbackResponse = (data: any, pagination?: any) => {
  return {
    ...data,
    ...(pagination && { pagination: pagination || buildFallbacks.pagination }),
    _fallback: true, // Flag para identificar que são dados de fallback
  };
};

/**
 * Log de informações de build para debugging
 */
export const logBuildInfo = () => {
  const config = getBuildConfig();
  buildLogger.logBuildConfig({
    environment: config.environment,
    skipDatabaseCheck: config.skipDatabaseCheck,
    useFallbackData: config.useFallbackData,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
  });
};
