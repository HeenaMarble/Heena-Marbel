const fs = require('fs');
const html = fs.readFileSync('scratch/insta_embed.html', 'utf8');

// Find JSON objects or video strings
const regex = /"video_url":"([^"]+)"/g;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log('Found video_url:', JSON.parse(`"${match[1]}"`));
}

const displayRegex = /"display_url":"([^"]+)"/g;
while ((match = displayRegex.exec(html)) !== null) {
  console.log('Found display_url:', JSON.parse(`"${match[1]}"`));
}

const fallbackMp4 = html.match(/https:[^"'\\<>\s]+?\.mp4[^"'\\<>\s]*/gi);
console.log('fallbackMp4 count:', fallbackMp4 ? fallbackMp4.length : 0);
if (fallbackMp4) {
  console.log('First mp4:', fallbackMp4[0].replace(/\\u0026/g, '&'));
}
