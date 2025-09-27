import { NextRequest, NextResponse } from 'next/server';
import { youtubeCache, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';
import { youtubeAnalytics } from '@/lib/analytics';

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

interface YouTubeApiResponse {
  items: Array<{
    id: string
    snippet: {
      title: string
      description: string
      publishedAt: string
      thumbnails: {
        medium: { url: string }
        high: { url: string }
      }
      liveBroadcastContent: 'live' | 'upcoming' | 'none'
    }
    contentDetails?: {
      duration: string
    }
    statistics?: {
      viewCount: string
    }
  }>
}

export async function GET() {
  const startTime = Date.now();
  
  try {
    const channelId = 'UCiahUfyUv3VbwrMjgLh-WzA'; // Fixed channel ID for static generation
    
    // Check cache first
    const cacheKey = CACHE_KEYS.VIDEOS_LIST(channelId);
    const cachedVideos = youtubeCache.get<YouTubeVideo[]>(cacheKey);
    
    if (cachedVideos) {
      youtubeAnalytics.trackApiCall(true, 0); // Cache hit, no response time
      return NextResponse.json({ 
        videos: cachedVideos,
        cached: true,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Get YouTube API key from environment variables
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'YouTube API key not configured' },
        { status: 500 },
      );
    }

    // First, get the uploads playlist ID for the channel
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`,
    );
    
    if (!channelResponse.ok) {
      throw new Error('Failed to fetch channel data');
    }
    
    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 },
      );
    }
    
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Get videos from the uploads playlist
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=10&key=${apiKey}`,
    );
    
    if (!videosResponse.ok) {
      throw new Error('Failed to fetch videos');
    }
    
    const videosData = await videosResponse.json();
    
    if (!videosData.items || videosData.items.length === 0) {
      return NextResponse.json({ videos: [] });
    }

    // Get video IDs for detailed information
    const videoIds = videosData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
    
    // Get detailed video information including duration and live status
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${apiKey}`,
    );
    
    if (!detailsResponse.ok) {
      throw new Error('Failed to fetch video details');
    }
    
    const detailsData = await detailsResponse.json();
    
    // Transform the data to our interface
    const videos: YouTubeVideo[] = detailsData.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      duration: item.contentDetails?.duration || '',
      isLive: item.snippet.liveBroadcastContent === 'live',
      liveViewers: item.snippet.liveBroadcastContent === 'live' 
        ? parseInt(item.statistics?.viewCount || '0') 
        : undefined,
    }));

    // Sort videos: live streams first, then by published date (newest first)
    videos.sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    // Cache the results
    youtubeCache.set(cacheKey, videos, CACHE_TTL.VIDEOS_LIST);

    // Track API call with response time
    const responseTime = Date.now() - startTime;
    youtubeAnalytics.trackApiCall(false, responseTime);

    return NextResponse.json({ 
      videos,
      cached: false,
      timestamp: new Date().toISOString(),
      responseTime,
    });
    
  } catch (error) {
    console.error('YouTube API Error:', error);
    
    // Track error
    youtubeAnalytics.trackError(
      error instanceof Error ? error.message : 'Unknown error',
      'youtube_api',
    );
    
    // Return mock data for development if API fails
    const mockVideos: YouTubeVideo[] = [
      {
        id: 'dQw4w9WgXcQ',
        title: 'Culto Dominical - IEB La Luz Málaga',
        description: 'Transmissão ao vivo do culto dominical da Igreja Evangélica Bautista La Luz Málaga.',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        publishedAt: new Date().toISOString(),
        duration: 'PT1H30M',
        isLive: true,
        liveViewers: 25,
      },
      {
        id: 'jNQXAC9IVRw',
        title: 'Estudo Bíblico - Livro de João',
        description: 'Estudo bíblico semanal sobre o Evangelho de João.',
        thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 'PT45M',
      },
    ];
    
    return NextResponse.json({ videos: mockVideos });
  }
}
