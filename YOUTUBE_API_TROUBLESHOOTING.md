# YouTube API Troubleshooting Guide

This guide will help you resolve the "403 Forbidden" error when using the YouTube Data API v3.

## Common Causes for 403 Errors

1. **API Key Issues**:
   - Invalid API key
   - API key restrictions (domain, IP, etc.)
   - API key not properly formatted

2. **API Not Enabled**:
   - YouTube Data API v3 not enabled for your Google Cloud project

3. **Quota Issues**:
   - Daily quota exceeded
   - Project quota limit reached

## Testing Your API Key

We've included a test script to help diagnose issues with your YouTube API key. Run:

```bash
node src/scripts/test-youtube-api.js YOUR_API_KEY
```

Or use your existing API key from .env.local:

```bash
node src/scripts/test-youtube-api.js
```

The script will provide specific guidance based on the error received.

## Step-by-Step Solutions

### 1. Verify Your API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Check that your API key is correct and active
3. Verify any API key restrictions (HTTP referrers, IP addresses, etc.)

### 2. Enable the YouTube Data API v3

1. Go to [YouTube Data API v3](https://console.cloud.google.com/apis/library/youtube.googleapis.com)
2. Make sure you're in the correct project
3. Click "Enable"
4. Wait a few minutes for the changes to propagate

### 3. Create a New API Key

If your current key is having issues:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" > "API Key"
3. Set appropriate restrictions (optional but recommended)
4. Copy the new key and update your `.env.local` file:
   ```
   NEXT_PUBLIC_YOUTUBE_API_KEY=your_new_api_key
   ```

### 4. Check Quota Usage

1. Go to [API Dashboard](https://console.cloud.google.com/apis/dashboard)
2. Look for "YouTube Data API v3" and check your quota usage
3. If exceeded, wait until tomorrow or request a quota increase

## Additional Resources

- [YouTube Data API Documentation](https://developers.google.com/youtube/v3/docs)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)
