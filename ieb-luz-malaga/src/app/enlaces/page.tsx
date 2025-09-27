import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Globe, BookOpen, Tv, Users, Cross } from 'lucide-react';
import Link from 'next/link';

// Dados dos links organizacionais (em produção viriam da API)
const organizationalLinks = [
  {
    title: 'Unión Evangélica Bautista de España (UEBE)',
    url: 'https://uebe.org',
    description: 'Organización nacional que agrupa a las iglesias bautistas de España',
    category: 'organizacion-nacional',
    icon: Globe,
  },
  {
    title: 'Facultad Protestante de Teología',
    url: 'https://fptmadrid.org',
    description: 'Centro de formación teológica protestante en Madrid',
    category: 'educacion',
    icon: BookOpen,
  },
  {
    title: 'FEREDE',
    url: 'https://ferede.org',
    description: 'Federación de Entidades Religiosas Evangélicas de España',
    category: 'organizacion-nacional',
    icon: Globe,
  },
  {
    title: 'Actualidad Evangélica',
    url: 'https://actualidadevangelica.es',
    description: 'Portal de noticias y actualidad del mundo evangélico',
    category: 'medios',
    icon: Tv,
  },
  {
    title: 'Alianza Evangélica Española',
    url: 'https://alianzaevangelica.org',
    description: 'Organización que promueve la unidad entre iglesias evangélicas',
    category: 'organizacion-nacional',
    icon: Users,
  },
  {
    title: 'Artículos del Pastor',
    url: '#',
    description: 'Reflexiones y artículos del pastor de la iglesia',
    category: 'recursos-pastorales',
    icon: BookOpen,
  },
  {
    title: 'Buenas Noticias TV',
    url: 'https://buenasnoticiastv.com',
    description: 'Canal de televisión cristiana en español',
    category: 'medios',
    icon: Tv,
  },
  {
    title: 'El Eco Bautista',
    url: 'https://elecobautista.com',
    description: 'Revista digital bautista con noticias y artículos',
    category: 'medios',
    icon: Tv,
  },
  {
    title: 'Salvación en Cristo',
    url: 'https://salvacionencristo.org',
    description: 'Recursos para evangelización y discipulado',
    category: 'evangelizacion',
    icon: Cross,
  },
];

const categories = {
  'organizacion-nacional': {
    name: 'Organización Nacional',
    description: 'Organizaciones bautistas y evangélicas a nivel nacional',
    color: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
  },
  'educacion': {
    name: 'Educación',
    description: 'Instituciones de formación teológica y ministerial',
    color: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
  },
  'medios': {
    name: 'Medios de Comunicación',
    description: 'Revistas, periódicos y canales de televisión cristianos',
    color: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800',
  },
  'recursos-pastorales': {
    name: 'Recursos Pastorales',
    description: 'Materiales y recursos para pastores y líderes',
    color: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800',
  },
  'evangelizacion': {
    name: 'Evangelización',
    description: 'Recursos para evangelización y discipulado',
    color: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
  },
};

export default function EnlacesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Enlaces de Interés
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Conexiones importantes con organizaciones bautistas y evangélicas
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-400">
              Descubre recursos, organizaciones y medios de comunicación que fortalecen 
              nuestra comunidad de fe y nos conectan con el cuerpo de Cristo en España y el mundo.
            </p>
          </div>
        </div>
      </section>

      {/* Links por categoría */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
            const categoryLinks = organizationalLinks.filter(link => link.category === categoryKey);
            
            if (categoryLinks.length === 0) return null;

            return (
              <div key={categoryKey} className="mb-16">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {categoryInfo.name}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {categoryInfo.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryLinks.map((link, index) => {
                    const Icon = link.icon;
                    const isExternal = link.url !== '#';
                    
                    return (
                      <Card key={index} className={`${categoryInfo.color} hover:shadow-lg transition-shadow`}>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg leading-tight">
                                {link.title}
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <CardDescription className="mb-4 text-gray-700 dark:text-gray-300">
                            {link.description}
                          </CardDescription>
                          
                          {isExternal ? (
                            <Button 
                              variant="outline" 
                              className="w-full" 
                              asChild
                            >
                              <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Visitar Sitio
                              </a>
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              className="w-full" 
                              disabled
                            >
                              Próximamente
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Conoces algún enlace útil?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Si conoces algún recurso o organización que pueda ser útil para nuestra comunidad, 
            no dudes en contactarnos.
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/contato">Sugerir Enlace</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
