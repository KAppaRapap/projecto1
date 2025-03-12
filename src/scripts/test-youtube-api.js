// Simple script to test the YouTube API key
const axios = require('axios');

// Get API key from command line arguments or environment variable
const apiKey = process.argv[2] || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

if (!apiKey) {
  console.error('Error: No API key provided.');
  console.log('Usage: node test-youtube-api.js YOUR_API_KEY');
  process.exit(1);
}

console.log('Testing YouTube API key...');

// Test the API key with a simple request
const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=1&key=${apiKey}`;

axios.get(url)
  .then(response => {
    console.log('✅ Success! Your YouTube API key is working correctly.');
    console.log('Response data:', JSON.stringify(response.data, null, 2));
  })
  .catch(error => {
    console.error('❌ Error testing YouTube API key:');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Status: ${error.response.status}`);
      console.error('Error data:', JSON.stringify(error.response.data, null, 2));
      
      // Provide specific guidance based on error codes
      if (error.response.status === 403) {
        if (error.response.data.error && error.response.data.error.errors) {
          const errors = error.response.data.error.errors;
          
          if (errors.some(e => e.reason === 'dailyLimitExceeded' || e.reason === 'quotaExceeded')) {
            console.log('\n🔍 DIAGNOSIS: API quota has been exceeded.');
            console.log('SOLUTION: Wait until tomorrow when the quota resets, or create a new project with a new API key.');
          } else if (errors.some(e => e.reason === 'accessNotConfigured')) {
            console.log('\n🔍 DIAGNOSIS: The YouTube Data API v3 is not enabled for this project.');
            console.log('SOLUTION: Enable the YouTube Data API v3 in the Google Cloud Console:');
            console.log('1. Go to https://console.cloud.google.com/apis/library/youtube.googleapis.com');
            console.log('2. Make sure you\'re in the correct project');
            console.log('3. Click "Enable"');
            console.log('4. Wait a few minutes for the changes to propagate');
          } else {
            console.log('\n🔍 DIAGNOSIS: Your API key may be invalid or restricted.');
            console.log('SOLUTION: Check your API key restrictions in the Google Cloud Console:');
            console.log('1. Go to https://console.cloud.google.com/apis/credentials');
            console.log('2. Find your API key and check its restrictions');
            console.log('3. Consider creating a new API key with appropriate restrictions');
          }
        }
      } else if (error.response.status === 400) {
        console.log('\n🔍 DIAGNOSIS: Bad request - there might be an issue with the API key format.');
        console.log('SOLUTION: Verify that your API key is correctly formatted and doesn\'t contain any spaces or special characters.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from the server. Check your internet connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    
    console.log('\n📋 GENERAL TROUBLESHOOTING STEPS:');
    console.log('1. Verify your API key is correct');
    console.log('2. Make sure the YouTube Data API v3 is enabled for your project');
    console.log('3. Check if you have any API key restrictions (HTTP referrers, IP addresses, etc.)');
    console.log('4. Ensure you haven\'t exceeded your daily quota');
    console.log('5. Create a new API key if necessary');
  });
