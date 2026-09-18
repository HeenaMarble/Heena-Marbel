const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.js'));

const temples = ['/temple1.jpg', '/temple2.jpg', '/temple3.jpg'];
let tIndex = 0;

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace all unsplash links with cycling temple images
  content = content.replace(/https:\/\/images\.unsplash\.com\/[^"'\s]+/g, () => {
    const replacement = temples[tIndex];
    tIndex = (tIndex + 1) % temples.length;
    return replacement;
  });

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('Replaced all unsplash images with temple images.');
