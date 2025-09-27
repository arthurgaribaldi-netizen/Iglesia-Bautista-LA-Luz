'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink, Calendar, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  publishedAt: string
  duration: string
  isLive?: boolean
  liveViewers?: number
}

interface YouTubePlayerProps {
  channelId?: string
  autoPlay?: boolean
  showLatest?: boolean
}

export function YouTubePlayer({ 
  channelId = 'UCiahUfyUv3VbwrMjgLh-WzA', 
  autoPlay = false,
  showLatest = true, 
}: YouTubePlayerProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [currentVideo, setCurrentVideo] = useState<YouTubeVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  const fetchVideos = useCallback(async() => {
    try {
      setLoading(true);
      const response = await fetch(`/api/youtube/videos?channelId=${channelId}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar vídeos');
      }
      
      const data = await response.json();
      setVideos(data.videos || []);
      
      if (data.videos && data.videos.length > 0) {
        // Use showLatest to determine which video to show
        // If showLatest is true, show the first video (latest), otherwise show a random or specific video
        const videoToShow = showLatest ? data.videos[0] : data.videos[Math.floor(Math.random() * Math.min(3, data.videos.length))];
        setCurrentVideo(videoToShow);
        setIsLive(videoToShow.isLive || false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [channelId, showLatest]);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }, []);

  const formatDuration = useCallback((duration: string) => {
    if (!duration) return '';
    // Remove PT prefix and format duration
    const cleanDuration = duration.replace('PT', '');
    return cleanDuration;
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Memoize formatted videos for performance
  const formattedVideos = useMemo(() => {
    return videos.map((video: YouTubeVideo) => ({
      ...video,
      formattedDate: formatDate(video.publishedAt),
      formattedDuration: formatDuration(video.duration),
    }));
  }, [videos, formatDate, formatDuration]);

  // Handle keyboard navigation
  const handleVideoKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>, video: YouTubeVideo) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setCurrentVideo(video);
    }
  }, []);

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 mb-4">Cargando...</p>
          <Skeleton className="aspect-video w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6 text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={fetchVideos} variant="outline">
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentVideo) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Nenhum vídeo encontrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Video Player */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-black" data-testid="youtube-player" data-channel-id={channelId}>
            {isLive ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full mb-4">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="font-semibold">AO VIVO</span>
                    {currentVideo.liveViewers && (
                      <span className="text-sm">({currentVideo.liveViewers} assistindo)</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{currentVideo.title}</h3>
                  <Button 
                    asChild 
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <a 
                      href={`https://www.youtube.com/watch?v=${currentVideo.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Assistir ao Vivo
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${currentVideo.id}${autoPlay ? '?autoplay=1' : ''}`}
                title={`Player de vídeo: ${currentVideo.title}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                aria-label={`Player do YouTube para o vídeo: ${currentVideo.title}`}
              />
            )}
          </div>
          
          {/* Video Info */}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {currentVideo.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex items-center gap-1" aria-label={`Publicado em ${formatDate(currentVideo.publishedAt)}`}>
                <Calendar className="w-4 h-4" aria-hidden="true" />
                {formatDate(currentVideo.publishedAt)}
              </div>
              {currentVideo.duration && (
                <div className="flex items-center gap-1" aria-label={`Duração: ${formatDuration(currentVideo.duration)}`}>
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  {formatDuration(currentVideo.duration)}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {currentVideo.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Video List */}
      {formattedVideos.length > 1 && (
        <div className="space-y-2">
          <h4 className="font-semibold" id="video-list-heading">Outros Vídeos</h4>
          <div className="grid gap-2" role="list" aria-labelledby="video-list-heading">
            {formattedVideos.slice(1, 4).map((video: YouTubeVideo & { formattedDate: string; formattedDuration: string }) => (
              <Card 
                key={video.id} 
                className={`cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-church-primary ${
                  currentVideo?.id === video.id ? 'ring-2 ring-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setCurrentVideo(video)}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => handleVideoKeyDown(e, video)}
                tabIndex={0}
                role="button"
                aria-label={`Assistir vídeo: ${video.title}`}
                aria-pressed={currentVideo?.id === video.id}
              >
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <div className="relative flex-shrink-0">
                      <Image 
                        src={video.thumbnail} 
                        alt={video.title}
                        width={80}
                        height={48}
                        className="w-20 h-12 object-cover rounded"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        sizes="80px"
                      />
                      {video.isLive && (
                        <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                          AO VIVO
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm line-clamp-2 mb-1">
                        {video.title}
                      </h5>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{video.formattedDate}</span>
                        {video.formattedDuration && (
                          <>
                            <span aria-hidden="true">•</span>
                            <span>{video.formattedDuration}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            asChild
          >
            <a 
              href={`https://www.youtube.com/channel/${channelId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Ver Todos os Vídeos no YouTube
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
