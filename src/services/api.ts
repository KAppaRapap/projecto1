// API service for handling Twitch and YouTube API requests
import axios from 'axios';

// YouTube API constants
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

// Types
export type StreamData = {
  id: string;
  title: string;
  viewerCount: number;
  thumbnailUrl: string;
  streamerName: string;
  url: string;
  category: string;
};

export type PlatformStats = {
  totalViewers: number;
  activeBroadcasters?: number;
  topCategory?: string;
};

// Twitch API constants
const TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || '';
const TWITCH_CLIENT_SECRET = process.env.NEXT_PUBLIC_TWITCH_CLIENT_SECRET || '';
const TWITCH_API_URL = 'https://api.twitch.tv/helix';
const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/token';

// Twitch API
// YouTube API
export const youtubeApi = {


  // Get trending videos from YouTube
  getTrendingVideos: async (): Promise<{ streams: StreamData[], stats: PlatformStats } | null> => {
    try {
      if (!YOUTUBE_API_KEY) {
        throw new Error('YouTube API key is required');
      }

      // Validate API key format (basic check)
      if (!/^[A-Za-z0-9_-]+$/.test(YOUTUBE_API_KEY)) {
        throw new Error('Invalid YouTube API key format');
      }

      let url = `${YOUTUBE_API_URL}/videos?part=snippet,statistics,liveStreamingDetails&chart=mostPopular&maxResults=20&regionCode=US&key=${YOUTUBE_API_KEY}`;
      
      const response = await axios.get(url);
      const videos = response.data.items;

      if (!videos || videos.length === 0) {
        console.warn('No videos returned from YouTube API');
        return {
          streams: [],
          stats: {
            totalViewers: 0,
            activeBroadcasters: 0,
            topCategory: 'Unknown'
          }
        };
      }

      const streams: StreamData[] = videos
        .filter((video: any) => video.snippet && video.statistics)
        .map((video: any) => ({
          id: video.id,
          title: video.snippet.title,
          viewerCount: parseInt(video.statistics.viewCount) || 0,
          thumbnailUrl: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url || '',
          streamerName: video.snippet.channelTitle,
          url: `https://www.youtube.com/watch?v=${video.id}`,
          category: video.snippet.categoryId || 'Unknown'
        }));

      const totalViewers = streams.reduce((acc, stream) => acc + stream.viewerCount, 0);

      return {
        streams,
        stats: {
          totalViewers,
          activeBroadcasters: streams.length,
          topCategory: streams[0]?.category || 'Unknown'
        }
      };
    } catch (error: any) {
      // Rethrow the error to be handled by the component
      if (axios.isAxiosError(error)) {
        // Let the component handle the specific error types
        throw error;
      } else {
        console.error('Error fetching YouTube data:', error);
        throw new Error(`YouTube API error: ${error.message}`);
      }
    }
  }
};

// Twitch API
export const twitchApi = {
  // Get access token for Twitch API
  getAccessToken: async () => {
    try {
      const response = await axios.post(`${TWITCH_AUTH_URL}?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials&scope=channel:read:stream_key`);
      if (response.data.access_token) {
        return response.data.access_token;
      } else {
        throw new Error('Two-factor authentication required. Please enable 2FA in your Twitch account settings.');
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        console.error('Two-factor authentication required for this action');
        throw new Error('Two-factor authentication required. Please enable 2FA in your Twitch account settings.');
      }
      console.error('Error getting Twitch access token:', error);
      return null;
    }
  },



  // Get streams from Twitch
  getTopStreams: async (): Promise<{ streams: StreamData[], stats: PlatformStats } | null> => {
    try {
      if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
        throw new Error('Twitch API credentials are required');
      }

      // Get access token
      const accessToken = await twitchApi.getAccessToken();
      if (!accessToken) {
        throw new Error('Failed to get Twitch access token');
      }

      // Get top streams
      let url = `${TWITCH_API_URL}/streams?first=20&sort=viewers`;
      

      const streamsResponse = await axios.get(url, {
        headers: {
          'Client-ID': TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${accessToken}`
        }
      });

      // Transform the response data
      const streams: StreamData[] = streamsResponse.data.data.map((stream: any) => ({
        id: stream.id,
        title: stream.title,
        viewerCount: stream.viewer_count,
        thumbnailUrl: stream.thumbnail_url.replace('{width}', '640').replace('{height}', '360'),
        streamerName: stream.user_name,
        url: `https://twitch.tv/${stream.user_login}`,
        category: stream.game_name || 'Unknown'
      }));

      // Calculate total viewers from streams
      const totalViewers = streams.reduce((acc, stream) => acc + stream.viewerCount, 0);

      // Return streams and stats
      return {
        streams,
        stats: {
          totalViewers,
          activeBroadcasters: streams.length,
          topCategory: streams[0]?.title || 'Unknown'
        }
      };
    } catch (error) {
      console.error('Error fetching Twitch data:', error);
      return null;
    }
  },
};
