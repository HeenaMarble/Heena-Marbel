const ffmpegPath = require('ffmpeg-static');
const { execSync } = require('child_process');
const path = require('path');

const inputImage = path.join(__dirname, 'public', 'hero-bg.jpg');
const outputVideo = path.join(__dirname, 'public', 'hero-bg.mp4');

// Generate a 10 second video from the static image using a slow zoom effect (Ken Burns)
console.log('Generating video from image...');
try {
  // Command: loop the image, apply a zoompan filter for 10 seconds (30 fps), output as mp4
  const command = `"${ffmpegPath}" -loop 1 -i "${inputImage}" -vf "zoompan=z='min(zoom+0.0005,1.5)':d=300:s=1280x720" -c:v libx264 -t 10 -pix_fmt yuv420p -y "${outputVideo}"`;
  execSync(command, { stdio: 'inherit' });
  console.log('Video generated successfully at public/hero-bg.mp4');
} catch (error) {
  console.error('Failed to generate video:', error.message);
}
