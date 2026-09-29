const https = require('https');

async function fetchJson(url, options = {}) {
  return new Promise((resolve) => {
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    }).on('error', (err) => resolve({ error: err.message }));
  });
}

async function testResolvers() {
  const shortcode = 'DdJWnTnzMBs';
  const instaUrl = `https://www.instagram.com/reel/${shortcode}/`;

  console.log('Testing Instagram resolver for:', instaUrl);

  // Method 1: Public snapinsta / fastdl / cobalt resolver
  try {
    const res1 = await fetchJson(`https://api.cobalt.tools/api/json`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    console.log('Cobalt test:', res1);
  } catch (e) {
    console.log('Cobalt error:', e.message);
  }
}

testResolvers();
