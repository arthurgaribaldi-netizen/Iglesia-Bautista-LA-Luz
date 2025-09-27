'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Calendar, Heart, ExternalLink } from 'lucide-react';

interface DevotionalData {
  id: string
  title: string
  content: string
  verse: string
  prayer: string
  date: string
  source: string
}

interface DevotionalSource {
  name: string
  description: string
  url: string
}

interface DailyDevotionalProps {
  showSource?: boolean
  compact?: boolean
}

export function DailyDevotional({ showSource = true, compact = false }: DailyDevotionalProps) {
  const [devotional, setDevotional] = useState<DevotionalData | null>(null);
  const [source, setSource] = useState<DevotionalSource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevotional = useCallback(async() => {
    try {
      setLoading(true);
      const response = await fetch('/api/devotionals?type=daily');
      const data = await response.json();
      
      if (data.success) {
        setDevotional(data.data);
        setSource(data.source);
      } else {
        setError('Error al cargar el devocional');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevotional();
  }, [fetchDevotional]);

  if (loading) {
    return (
      <Card className={compact ? 'w-full' : 'max-w-2xl mx-auto'}>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !devotional) {
    return (
      <Card className={compact ? 'w-full' : 'max-w-2xl mx-auto'}>
        <CardContent className="text-center py-8">
          <p className="text-red-600 mb-4">{error || 'No se pudo cargar el devocional'}</p>
          <Button onClick={fetchDevotional} variant="outline">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={compact ? 'w-full' : 'max-w-2xl mx-auto'}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">
              {compact ? 'Devocional' : 'Devocional del Día'}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            {new Date(devotional.date).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>
        <CardDescription>
          {devotional.title}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Versículo */}
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Versículo del día:
          </p>
          <p className="text-blue-800 dark:text-blue-200 italic">
            "{devotional.verse}"
          </p>
        </div>

        {/* Contenido */}
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {devotional.content}
          </p>
        </div>

        {/* Oración */}
        <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-green-600" />
            <p className="font-medium text-green-900 dark:text-green-100">
              Oración:
            </p>
          </div>
          <p className="text-green-800 dark:text-green-200 italic">
            {devotional.prayer}
          </p>
        </div>

        {/* Fuente */}
        {showSource && source && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fuente: {source.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {source.description}
                </p>
              </div>
              {source.url !== '#' && (
                <Button variant="outline" size="sm" asChild>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Visitar
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Componente compacto para sidebar
export function DailyDevotionalCompact() {
  return <DailyDevotional showSource={false} compact={true} />;
}
