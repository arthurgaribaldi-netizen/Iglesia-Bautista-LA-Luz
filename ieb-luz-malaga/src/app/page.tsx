import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Church, Calendar, BookOpen, Users, Clock, Sparkles, Heart, Star } from "lucide-react";  
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LazyWrapper } from "@/components/ui/lazy-wrapper";
import { LazyYouTubePlayer } from "@/components/lazy/lazy-youtube-player";
import { LazyDailyDevotional } from "@/components/lazy/lazy-daily-devotional";
import { LazyDailyVerse } from "@/components/lazy/lazy-daily-verse";
import { LazyFloatingContact } from "@/components/lazy/lazy-floating-contact";
import { 
  YouTubePlayerFallback, 
  DevotionalFallback, 
  DailyVerseFallback, 
} from "@/components/ui/suspense-fallbacks";
import { SSRModernCard } from "@/components/ui/ssr-modern-card";

// Dynamic page - no static generation
export const dynamic = 'force-dynamic';
export const revalidate = false;

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>
      
      {/* Hero Section - 2025 Clean & Professional */}
      <section id="main-content" className="relative bg-white dark:bg-gray-900" role="banner" aria-label="Seção principal">
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Welcome Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 mb-8">
              <Sparkles className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Comunidad de Fe desde 1995</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              IEB La Luz
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6">
              Iglesia Evangélica Bautista La Luz Málaga
            </p>
            
            <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Una comunidad de fe en Málaga donde puedes crecer espiritualmente, 
              conectar con otros creyentes y descubrir el amor de Dios.
            </p>
            
            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
                asChild
              >
                <Link href="/transmissoes">
                  <span className="mr-2">📺</span>
                  Ver Cultos en Vivo
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 px-8 py-3 text-lg font-semibold transition-all duration-300" 
                asChild
              >
                <Link href="/contato">
                  <span className="mr-2">💒</span>
                  Visite-nos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stream Section - Clean & Simple */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 mb-6">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium">EN VIVO</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Transmisión en Vivo
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Acompañe nuestros cultos dominicales en tiempo real
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
              <LazyYouTubePlayer 
                channelId="UCiahUfyUv3VbwrMjgLh-WzA"
                autoPlay={false}
                showLatest={true}
                priority="high"
                delay={100}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section - Clean & Clear */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900" role="region" aria-label="Horários de culto">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 mb-6">
              <Clock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Horarios de Culto</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Ven a Adorar con Nosotros
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Únete a nuestra comunidad en estos horarios especiales
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Worship Schedule Card */}
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Domingo</h3>
                  <p className="text-gray-600 dark:text-gray-400">Día de Adoración</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="font-medium text-gray-900 dark:text-white">Escuela Bíblica Dominical</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">11:00</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <span className="font-medium text-gray-900 dark:text-white">Culto de Adoración</span>
                  <span className="text-lg font-bold text-amber-600 dark:text-amber-400">18:00</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="font-medium text-gray-900 dark:text-white">Estudio Bíblico (Miércoles)</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">19:30</span>
                </div>
              </div>
            </Card>
            
            {/* Events Card */}
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Próximos Eventos</h3>
                  <p className="text-gray-600 dark:text-gray-400">Actividades Especiales</p>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Consulta nuestra agenda de eventos y actividades especiales.
              </p>
              
              <Button 
                variant="outline" 
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20" 
                asChild
              >
                <Link href="/eventos" className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Ver Eventos
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Daily Resources Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800" role="region" aria-label="Recursos diários">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Recursos Diarios
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
              Alimenta tu fe cada día con devocionales y versículos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Devocional del día */}
            <LazyDailyDevotional 
              compact={true}
              priority="medium"
              delay={200}
            />
            
            {/* Versículo del día */}
            <LazyDailyVerse 
              compact={true}
              priority="medium"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Features Section - Clean Ministry Cards */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900" role="region" aria-label="Nossos ministérios">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 mb-6">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">💒 Nuestros Ministerios</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Descubre Nuestra Comunidad
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explora cómo puedes involucrarte y crecer en nuestra familia espiritual
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Bible Study Card */}
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Escuela Bíblica</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Profundiza tu conocimiento de las Escrituras a través de estudios bíblicos
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                📖 Domingos 11:00
              </div>
            </Card>
            
            {/* Community Card */}
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ministerios</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Conéctate con otros creyentes y participa en nuestros ministerios
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium">
                👥 Ministerios Activos
              </div>
            </Card>
            
            {/* Worship Card */}
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Church className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Adoración</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Celebra y adora a Dios a través de música, oración y predicación
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                🎵 Domingos 18:00
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Clean & Simple */}
      <section className="py-16 md:py-24 bg-blue-600" role="region" aria-label="Chamada para ação">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-white">
              Ven a Visitarnos
            </h2>
            <p className="text-base md:text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
              Estamos ansiosos por conocerte y darte la bienvenida a nuestra comunidad de fe en Málaga.
            </p>
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
              asChild
            >
              <Link href="/contato" className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Ponte en Contacto
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Floating Contact Button */}
      <LazyFloatingContact 
        delay={3000}
        priority="low"
        showMobileBanner={true}
      />
    </div>
  );
}
