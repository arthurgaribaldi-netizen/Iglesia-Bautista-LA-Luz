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
      
      {/* Hero Section - 2025 Professional Design */}
      <section id="main-content" className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" role="banner" aria-label="Seção principal">
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--church-primary)) 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, hsl(var(--church-accent)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px, 40px 40px',
          }} />
        </div>
        
        {/* Minimal Floating Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-10 blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full opacity-8 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative container mx-auto px-4 py-40 lg:py-48">
          <div className="text-center max-w-4xl mx-auto">
            {/* Welcome Badge - SSR Compatible */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-blue-200 dark:border-blue-700 mb-12 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Una Comunidad de Fe desde 1995</span>
            </div>
            
            {/* Main Heading - SSR Compatible */}
            <h1 className="text-5xl xs:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 font-display animate-fade-in-up">
              <span className="text-gray-900 dark:text-white">
                IEB La Luz
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-up animation-delay-200">
              Iglesia Evangélica Bautista La Luz Málaga
            </p>
            
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
              Una comunidad de fe donde puedes crecer espiritualmente, 
              conectar con otros creyentes y descubrir el amor de Dios.
            </p>
            
            {/* Single Primary CTA - SSR Compatible */}
            <div className="flex justify-center animate-fade-in-up animation-delay-600">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-16 py-6 text-xl font-bold shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 border-2 border-blue-500/20 hover:border-blue-400/40 hover:scale-105 active:scale-95" 
                asChild
              >
                <Link href="/transmissoes">
                  <span className="mr-3">📺</span>
                  Ver Transmissões
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stream Section - 2025 Professional Design */}
      <section className="py-32 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 mb-8">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-3"></div>
              <span className="text-sm font-medium">EN VIVO</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white font-display">
              Transmisión en Vivo
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Acompañe nuestros cultos dominicales en tiempo real desde la comodidad de su hogar
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Glassmorphism Container */}
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20">
                <LazyYouTubePlayer 
                  channelId="UCiahUfyUv3VbwrMjgLh-WzA"
                  autoPlay={false}
                  showLatest={true}
                  priority="high"
                  delay={100}
                />
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-amber-400 rounded-full opacity-60"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-orange-400 rounded-full opacity-40"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section - 2025 Professional Design */}
      <section className="py-32 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800" role="region" aria-label="Horários de culto">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-blue-200 dark:border-blue-700 mb-8">
              <Clock className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Horarios de Culto</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white font-display">
              Ven a Adorar con Nosotros
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Únete a nuestra comunidad en estos horarios especiales de adoración
            </p>
          </div>
          
          <div className="grid grid-cols-1 tablet-sm:grid-cols-2 gap-8 tablet-md:gap-12 max-w-6xl mx-auto">
            {/* Worship Schedule Card */}
            <SSRModernCard hoverEffect={true}>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center hover:rotate-3 transition-transform duration-200">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Domingo</h3>
                  <p className="text-gray-600 dark:text-gray-400">Día de Adoración</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl border border-blue-200 dark:border-blue-700 hover:scale-102 transition-transform duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-gray-900 dark:text-white">Escola Bíblica</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">11:00</span>
                </div>
                
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-2xl border border-amber-200 dark:border-amber-700 hover:scale-102 transition-transform duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-gray-900 dark:text-white">Culto de Adoração</span>
                  </div>
                  <span className="text-lg font-bold text-amber-600 dark:text-amber-400">18:00</span>
                </div>
              </div>
            </SSRModernCard>
            
            {/* Events Card */}
            <SSRModernCard hoverEffect={true}>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center hover:rotate-3 transition-transform duration-200">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Próximos Eventos</h3>
                  <p className="text-gray-600 dark:text-gray-400">Actividades Especiales</p>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Consulta nuestra agenda de eventos y actividades especiales que enriquecen nuestra comunidad de fe.
              </p>
              
              <div className="hover:scale-102 active:scale-98 transition-transform duration-200">
                <Button 
                  variant="outline" 
                  className="w-full py-4 text-lg font-semibold border-2 border-blue-600 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/20" 
                  asChild
                >
                  <Link href="/eventos" className="flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Ver Eventos
                  </Link>
                </Button>
              </div>
            </SSRModernCard>
          </div>
        </div>
      </section>

      {/* Daily Resources Section */}
      <section className="py-32 bg-gray-50 dark:bg-gray-800" role="region" aria-label="Recursos diários">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white font-display">
              Recursos Diarios
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Alimenta tu fe cada día con devocionales y versículos
            </p>
          </div>
          
          <div className="grid grid-cols-1 tablet-sm:grid-cols-2 gap-8 tablet-md:gap-12 max-w-6xl mx-auto">
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

      {/* Features Section - 2025 Professional Ministry Cards */}
      <section className="py-32 bg-white dark:bg-gray-900" role="region" aria-label="Nossos ministérios">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-blue-200 dark:border-blue-700 mb-8">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">💒 Nuestros Ministerios</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white font-display">
              Descubre Nuestra Comunidad
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Explora cómo puedes involucrarte y crecer en nuestra familia espiritual
            </p>
          </div>
          
          <div className="grid grid-cols-1 tablet-sm:grid-cols-2 tablet-lg:grid-cols-3 gap-8 tablet-md:gap-12 max-w-7xl mx-auto">
            {/* Bible Study Card */}
            <SSRModernCard hoverEffect={true} className="h-full">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 hover:scale-110 hover:rotate-3 transition-transform duration-300">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-display">Estudio Bíblico</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                  Profundiza tu conocimiento de las Escrituras a través de estudios semanales que transforman vidas
                </p>
                <div className="inline-flex items-center px-6 py-3 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200">
                  📖 Domingos 11:00
                </div>
              </div>
            </SSRModernCard>
            
            {/* Community Card */}
            <SSRModernCard hoverEffect={true} className="h-full">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-8 hover:scale-110 hover:rotate-3 transition-transform duration-300">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-display">Comunidad</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                  Conéctate con otros creyentes y forma parte de nuestra familia espiritual en Cristo
                </p>
                <div className="inline-flex items-center px-6 py-3 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200">
                  👥 Crecimiento Juntos
                </div>
              </div>
            </SSRModernCard>
            
            {/* Worship Card */}
            <SSRModernCard hoverEffect={true} className="h-full">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-8 hover:scale-110 hover:rotate-3 transition-transform duration-300">
                  <Church className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-display">Adoración</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                  Celebra y adora a Dios a través de música, oración y predicación que toca el corazón
                </p>
                <div className="inline-flex items-center px-6 py-3 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200">
                  🎵 Domingos 18:00
                </div>
              </div>
            </SSRModernCard>
          </div>
        </div>
      </section>

      {/* CTA Section - 2025 Professional Design */}
      <section className="py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden" role="region" aria-label="Chamada para ação">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, white 2px, transparent 2px),
                             radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px, 30px 30px',
          }} />
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white font-display animate-fade-in-up">
              Ven a Visitanos
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              Estamos ansiosos por conocerte y darte la bienvenida a nuestra comunidad de fe.
            </p>
            <div className="animate-fade-in-up animation-delay-400 hover:scale-105 active:scale-95 transition-transform duration-300">
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 px-16 py-6 text-xl font-bold shadow-2xl hover:shadow-white/30 transition-all duration-300 border-2 border-white/20 hover:border-white/40" 
                asChild
              >
                <Link href="/contato" className="flex items-center gap-3">
                  <Heart className="w-5 h-5" />
                  Ponte en Contacto
                </Link>
              </Button>
            </div>
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
