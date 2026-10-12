const fs = require('fs');
const path = require('path');
const https = require('https');

const texturesDir = path.join(__dirname, '..', 'public', 'textures');
if (!fs.existsSync(texturesDir)) {
  fs.mkdirSync(texturesDir, { recursive: true });
}

const textures = [
  { name: '2k_earth_daymap.jpg', url: 'https://raw.githubusercontent.com/gopi15699/solar-system-3d/main/public/textures/2k_earth_daymap.jpg' },
  { name: '2k_earth_nightmap.jpg', url: 'https://raw.githubusercontent.com/gopi15699/solar-system-3d/main/public/textures/2k_earth_nightmap.jpg' },
  { name: '2k_earth_clouds.jpg', url: 'https://raw.githubusercontent.com/gopi15699/solar-system-3d/main/public/textures/2k_earth_clouds.jpg' },
  { name: 'earth_normal_2048.jpg', url: 'https://raw.githubusercontent.com/gopi15699/solar-system-3d/main/public/textures/earth_normal_2048.jpg' },
  { name: 'earth_lights_2048.png', url: 'https://raw.githubusercontent.com/gopi15699/solar-system-3d/main/public/textures/earth_lights_2048.png' },
  { name: '2k_jupiter.jpg', url: 'https://raw.githubusercontent.com/gopi15699/solar-system-3d/main/public/textures/2k_jupiter.jpg' },
  { name: '2k_mars.jpg', url: 'https://raw.githubusercontent.com/gopi15699/solar-system-3d/main/public/textures/2k_mars.jpg' },
  { name: '2k_mercury.jpg', url: 'https://raw.githubusercontent.com/gopi15699/solar-system-3d/main/public/textures/2k_mercury.jpg' },
  { name: '2k_moon.jpg', url: 'https://raw.githubusercontent.com/gopi15699/solar-system-3d/main/public/textures/2k_moon.jpg' },
  { name: '2k_neptune.jpg', url: 'https://raw.githubusercontent.com/gopi15699/solar-system-3d/main/public/textures/2k_neptune.jpg' },
  { name: '2k_saturn.jpg', url: 'https://raw.githubusercontent.com/gopi15699/solar-system-3d/main/public/textures/2k_saturn.jpg' },
  { name: '2k_saturn_ring_alpha.png', url: 'https://raw.githubusercontent.com/gopi15699/solar-system-3d/main/public/textures/2k_saturn_ring_alpha.png' },
  { name: '2k_uranus.jpg', url: 'https://raw.githubusercontent.com/gopi15699/solar-system-3d/main/public/textures/2k_uranus.jpg' },
  { name: '2k_venus_atmosphere.jpg', url: 'https://raw.githubusercontent.com/gopi15699/solar-system-3d/main/public/textures/2k_venus_atmosphere.jpg' },
  { name: '8k_stars_milky_way.jpg', url: 'https://raw.githubusercontent.com/gopi15699/solar-system-3d/main/public/textures/8k_stars_milky_way.jpg' },
  { name: '2k_sun.jpg', url: 'https://raw.githubusercontent.com/M-Shaeer/ThreeJS-SolarSystem/main/textures/2k_sun.jpg' }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`Already exists: ${path.basename(dest)} (${fs.statSync(dest).size} bytes)`);
      return resolve();
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        fs.unlink(dest, () => {});
        return reject(new Error(`Failed to download ${url}: status code ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Downloaded: ${path.basename(dest)} (${fs.statSync(dest).size} bytes)`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log(`Downloading ${textures.length} high-res planetary textures...`);
  for (const item of textures) {
    const dest = path.join(texturesDir, item.name);
    try {
      await downloadFile(item.url, dest);
    } catch (err) {
      console.error(`Error downloading ${item.name}:`, err.message);
    }
  }
  console.log('All texture downloads finished.');
}

run();
