const https = require('https');
const fs = require('fs');

https.get('https://www.instagram.com/reel/DdJWnTnzMBs/embed/', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    fs.writeFileSync('scratch/insta_embed.html', body);
    console.log('Saved HTML, length:', body.length);
  });
});
