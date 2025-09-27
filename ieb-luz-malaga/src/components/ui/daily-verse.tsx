'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, RefreshCw, Share2 } from 'lucide-react';
import { useIsClient } from '@/hooks/use-is-client';

interface DailyVerse {
  reference: string
  text: string
  type: 'proverbio' | 'verso-oro'
}

interface DailyVerseProps {
  type?: 'proverbio' | 'verso-oro' | 'both'
  showTitle?: boolean
  compact?: boolean
}

export function DailyVerse({ type = 'both', showTitle = true, compact = false }: DailyVerseProps) {
  const [verse, setVerse] = useState<DailyVerse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isClient = useIsClient();

  const fetchVerse = useCallback(async() => {
    try {
      setLoading(true);
      const response = await fetch('/api/devotionals?type=verse');
      const data = await response.json();
      
      if (data.success) {
        setVerse(data.data);
      } else {
        setError('Error al cargar el versículo');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerse();
  }, [type, fetchVerse]);

  const getTitle = () => {
    if (!verse) return '';
    return verse.type === 'proverbio' ? 'Proverbio del día' : 'Verso de oro';
  };

  const getIcon = () => {
    if (!verse) return BookOpen;
    return verse.type === 'proverbio' ? BookOpen : BookOpen;
  };

  const shareVerse = useCallback(async() => {
    if (!verse || !isClient) return;
    
    const shareText = `${verse.reference}: "${verse.text}"`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: getTitle(),
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareText);
        }
      }
    } else if (navigator.clipboard) {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText);
    }
  }, [verse, getTitle, isClient]);

  if (loading) {
    return (
      <Card className={compact ? 'w-full' : 'max-w-md mx-auto'}>
        <CardHeader>
          <Skeleton className="h-5 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (error || !verse) {
    return (
      <Card className={compact ? 'w-full' : 'max-w-md mx-auto'}>
        <CardContent className="text-center py-8">
          <p className="text-red-600 mb-4">{error || 'No se pudo cargar el versículo'}</p>
          <Button onClick={fetchVerse} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Si se especifica un tipo y no coincide, no mostrar nada
  if (type !== 'both' && verse.type !== type) {
    return null;
  }

  const Icon = getIcon();

  return (
    <Card className={compact ? 'w-full' : 'max-w-md mx-auto'}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary" />
            {showTitle && (
              <CardTitle className="text-lg">
                {getTitle()}
              </CardTitle>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={shareVerse}
              title="Compartir versículo"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchVerse}
              title="Nuevo versículo"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-sm font-medium text-primary mb-2">
              {verse.reference}
            </p>
            <blockquote className="text-gray-700 dark:text-gray-300 italic text-center leading-relaxed">
              "{verse.text}"
            </blockquote>
          </div>
          
          {!compact && (
            <div className="text-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchVerse}
                className="text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Nuevo versículo
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Componentes específicos para cada tipo
export function ProverbioDelDia({ compact = false }: { compact?: boolean }) {
  return <DailyVerse type="proverbio" compact={compact} />;
}

export function VersoDeOro({ compact = false }: { compact?: boolean }) {
  return <DailyVerse type="verso-oro" compact={compact} />;
}

// Componente compacto para sidebar
export function DailyVerseCompact() {
  return <DailyVerse showTitle={false} compact={true} />;
}
