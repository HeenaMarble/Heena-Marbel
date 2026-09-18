const https = require('https');
const fs = require('fs');

https.get('https://www.pexels.com/search/videos/marble%20texture/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Extract mp4 urls
    const regex = /https:\/\/[^"']+\.mp4[^"']*/g;
    const matches = data.match(regex);
    if (matches && matches.length > 0) {
      console.log('Found video URL:', matches[0]);
    } else {
      console.log('No video URL found');
    }
  });
}).on('error', err => {
  console.log('Error:', err.message);
});
