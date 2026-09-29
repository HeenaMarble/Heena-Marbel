const https = require('https');

function testThumbnail(shortcode) {
  const url = `https://www.instagram.com/p/${shortcode}/media/?size=l`;
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    console.log('Status code for', shortcode, ':', res.statusCode);
    console.log('Location header:', res.headers.location);
  }).on('error', (err) => {
    console.error('Error:', err);
  });
}

testThumbnail('DdJWnTnzMBs');
