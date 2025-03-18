import { sigmaApi } from '../services/api';

describe('Sigma API Integration', () => {
  test('getTopStreams should return streams and stats', async () => {
    const result = await sigmaApi.getTopStreams();
    
    // Check if we got a response
    expect(result).not.toBeNull();
    
    if (result) {
      // Check stats structure
      expect(result.stats).toHaveProperty('totalViewers');
      expect(result.stats).toHaveProperty('activeBroadcasters');
      expect(result.stats).toHaveProperty('topCategory');
      
      // Check streams array
      expect(Array.isArray(result.streams)).toBe(true);
      
      // If we have streams, check their structure
      if (result.streams.length > 0) {
        const stream = result.streams[0];
        expect(stream).toHaveProperty('id');
        expect(stream).toHaveProperty('title');
        expect(stream).toHaveProperty('viewerCount');
        expect(stream).toHaveProperty('thumbnailUrl');
        expect(stream).toHaveProperty('streamerName');
        expect(stream).toHaveProperty('url');
        expect(stream).toHaveProperty('category');
        expect(stream.platform).toBe('sigma');
      }

      // Log the first stream for visual inspection
      console.log('\nFirst stream details (if available):');
      if (result.streams[0]) {
        console.log(JSON.stringify(result.streams[0], null, 2));
      }
    }
  });
});
