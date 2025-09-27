import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, Heart, BookOpen, Music } from "lucide-react";
import { SSRModernCard } from "@/components/ui/ssr-modern-card";

// Force SSR for this page
export const dynamic = 'force-dynamic';
export const revalidate = false;

interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  capacity?: number;
  isPublic: boolean;
  organizer: {
    name: string;
  };
}

// SSR-compatible events data
const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "Culto Dominical",
    description: "Nuestro servicio de adoración semanal donde nos reunimos para adorar a Dios en comunidad",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Iglesia Bautista La Luz",
    isPublic: true,
    organizer: { name: "Pastor Principal" }
  },
  {
    id: "2", 
    title: "Estudio Bíblico",
    description: "Estudio profundo de las Escrituras para crecer en conocimiento y fe",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Salón de Estudios",
    isPublic: true,
    organizer: { name: "Equipo de Liderazgo" }
  },
  {
    id: "3",
    title: "Reunión de Oración",
    description: "Momento especial de oración y comunión con Dios y la comunidad",
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Capilla Principal",
    isPublic: true,
    organizer: { name: "Ministerio de Oración" }
  }
];

const allEvents: Event[] = [
  ...upcomingEvents,
  {
    id: "4",
    title: "Conferencia de Jóvenes",
    description: "Evento especial para jóvenes y adolescentes con temas relevantes para su crecimiento espiritual",
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Centro de Conferencias",
    isPublic: true,
    organizer: { name: "Ministerio Juvenil" }
  },
  {
    id: "5",
    title: "Retiro Espiritual",
    description: "Tiempo de reflexión y crecimiento espiritual en un ambiente tranquilo",
    startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Centro de Retiros",
    isPublic: true,
    organizer: { name: "Equipo Pastoral" }
  }
];

export default function EventosPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventIcon = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('culto') || titleLower.includes('adoración')) return <Music className="w-5 h-5" />;
    if (titleLower.includes('estudio') || titleLower.includes('bíblico')) return <BookOpen className="w-5 h-5" />;
    if (titleLower.includes('oración') || titleLower.includes('oracion')) return <Heart className="w-5 h-5" />;
    return <Calendar className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen py-8">
      <main className="container mx-auto px-4" role="main">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
            <span className="text-gray-900 dark:text-white">Eventos</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Únete a nuestros eventos y actividades especiales que enriquecen nuestra comunidad de fe
          </p>
        </section>

        {/* Próximos Eventos */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 mb-8">
              <Calendar className="w-4 h-4 mr-3" />
              <span className="text-sm font-medium">Próximos Eventos</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              No te Pierdas Nada
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Participa en nuestras próximas actividades y conecta con la comunidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <SSRModernCard key={event.id} className={`animate-fade-in-up animation-delay-${(index + 1) * 200}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white">
                    {getEventIcon(event.title)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {event.organizer.name}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{formatDate(event.startDate)}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  )}
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                  Ver Detalles
                </Button>
              </SSRModernCard>
            ))}
          </div>
        </section>

        {/* Todos los Eventos */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Calendario Completo
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explora todos nuestros eventos y actividades programadas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allEvents.map((event, index) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-white">
                      {getEventIcon(event.title)}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900 dark:text-white">
                        {event.title}
                      </CardTitle>
                      <CardDescription>
                        {event.organizer.name}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {event.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      {event.description}
                    </p>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <SSRModernCard className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              ¿Quieres Organizar un Evento?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Si tienes una idea para un evento o actividad, no dudes en contactarnos. 
              Estamos siempre abiertos a nuevas propuestas que fortalezcan nuestra comunidad.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Contactar Organizadores
            </Button>
          </SSRModernCard>
        </section>
      </main>
    </div>
  );
}