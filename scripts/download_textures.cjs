/**
 * Re-downloads the planetary surface textures into public/textures/ from their original publishers.
 *
 *  - Solar System Scope (https://www.solarsystemscope.com/textures/) — CC BY 4.0, based on NASA imagery.
 *    Attribution is required wherever the app is published (see ASSETS.md).
 *  - three.js example textures (https://github.com/mrdoob/three.js, MIT) for Earth's normal map and
 *    night lights.
 *
 * The Milky Way sky (gaia_sky.webp) and galaxy disk (milky_way_disk.webp) are processed assets and
 * are documented in ASSETS.md; they are not fetched here.
 *
 * Usage: node scripts/download_textures.cjs   (existing files are kept)
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const texturesDir = path.join(__dirname, '..', 'public', 'textures');
fs.mkdirSync(texturesDir, { recursive: true });

const SSS = 'https://www.solarsystemscope.com/textures/download';
const THREE_PLANETS = 'https://raw.githubusercontent.com/mrdoob/three.js/r170/examples/textures/planets';

const textures = [
  { name: '2k_sun.jpg', url: `${SSS}/2k_sun.jpg` },
  { name: '2k_mercury.jpg', url: `${SSS}/2k_mercury.jpg` },
  { name: '2k_venus_atmosphere.jpg', url: `${SSS}/2k_venus_atmosphere.jpg` },
  { name: '2k_earth_daymap.jpg', url: `${SSS}/2k_earth_daymap.jpg` },
  { name: '2k_earth_nightmap.jpg', url: `${SSS}/2k_earth_nightmap.jpg` },
  { name: '2k_earth_clouds.jpg', url: `${SSS}/2k_earth_clouds.jpg` },
  { name: '2k_moon.jpg', url: `${SSS}/2k_moon.jpg` },
  { name: '2k_mars.jpg', url: `${SSS}/2k_mars.jpg` },
  { name: '2k_jupiter.jpg', url: `${SSS}/2k_jupiter.jpg` },
  { name: '2k_saturn.jpg', url: `${SSS}/2k_saturn.jpg` },
  { name: '2k_saturn_ring_alpha.png', url: `${SSS}/2k_saturn_ring_alpha.png` },
  { name: '2k_uranus.jpg', url: `${SSS}/2k_uranus.jpg` },
  { name: '2k_neptune.jpg', url: `${SSS}/2k_neptune.jpg` },
  { name: 'earth_normal_2048.jpg', url: `${THREE_PLANETS}/earth_normal_2048.jpg` },
  { name: 'earth_lights_2048.png', url: `${THREE_PLANETS}/earth_lights_2048.png` },
];

function downloadFile(url, dest, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        const { statusCode = 0, headers } = response;
        if (statusCode >= 300 && statusCode < 400 && headers.location) {
          response.resume();
          if (redirectsLeft <= 0) return reject(new Error(`Too many redirects for ${url}`));
          const next = new URL(headers.location, url).toString();
          return downloadFile(next, dest, redirectsLeft - 1).then(resolve, reject);
        }
        if (statusCode !== 200) {
          response.resume();
          return reject(new Error(`Failed to download ${url}: HTTP ${statusCode}`));
        }
        // Write to a temporary file first so a failed transfer never leaves a truncated texture
        const tmp = `${dest}.part`;
        const file = fs.createWriteStream(tmp);
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            fs.renameSync(tmp, dest);
            console.log(`Downloaded: ${path.basename(dest)} (${fs.statSync(dest).size} bytes)`);
            resolve();
          });
        });
        file.on('error', (err) => {
          fs.rmSync(tmp, { force: true });
          reject(err);
        });
      })
      .on('error', reject);
  });
}

async function run() {
  console.log(`Checking ${textures.length} planetary textures...`);
  let failures = 0;
  for (const item of textures) {
    const dest = path.join(texturesDir, item.name);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`Already exists: ${item.name}`);
      continue;
    }
    try {
      await downloadFile(item.url, dest);
    } catch (err) {
      failures++;
      console.error(`Error downloading ${item.name}: ${err.message}`);
    }
  }
  console.log(failures ? `Finished with ${failures} failure(s).` : 'All textures present.');
  process.exitCode = failures ? 1 : 0;
}

run();
