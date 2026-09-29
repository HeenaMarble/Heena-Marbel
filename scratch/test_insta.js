const https = require('https');

async function testInsta(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const videoMatches = [...body.matchAll(/https:\/\/[^"'\\]+\.mp4[^"'\\]*/g)].map(m => m[0]);
        const imgMatches = [...body.matchAll(/https:\/\/[^"'\\]+\.jpg[^"'\\]*/g)].map(m => m[0]);
        console.log('Status code:', res.statusCode);
        console.log('Found video URLs count:', videoMatches.length);
        if (videoMatches.length > 0) {
          console.log('Sample video URL:', videoMatches[0].replace(/\\u0026/g, '&'));
        }
        console.log('Found img URLs count:', imgMatches.length);
        resolve({ videoMatches, imgMatches });
      });
    }).on('error', (err) => {
      console.log('Error:', err.message);
      resolve(null);
    });
  });
}

testInsta('https://www.instagram.com/reel/DdJWnTnzMBs/embed/');
