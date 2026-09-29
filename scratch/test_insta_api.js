const https = require('https');

async function testFetch(url, postData = null, headers = {}) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: postData ? 'POST' : 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        ...headers
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data.substring(0, 300) });
        }
      });
    });

    req.on('error', (err) => resolve({ error: err.message }));
    if (postData) req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    req.end();
  });
}

async function run() {
  const shortcode = 'DdJWnTnzMBs';
  const url = `https://www.instagram.com/reel/${shortcode}/`;

  // Test publer / snapinsta public endpoint
  console.log('Testing public resolver...');
  const r1 = await testFetch('https://api.publer.io/v1/tools/media-downloader', JSON.stringify({ url }), {
    'Content-Type': 'application/json'
  });
  console.log('Publer status:', r1.status, 'Response:', r1.data || r1.raw);
}

run();
