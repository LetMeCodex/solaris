const fs = require('fs');
const path = require('path');

const base = 'C:\\Users\\anish jha\\.gemini\\antigravity\\brain\\1f66eb6f-7084-48d7-bc1a-234fc074e68d';

const copies = [
  { src: path.join(base, '.system_generated', 'steps', '771', 'media_0.png'), dest: path.join(base, 'phase4_overview_cinematic.png') },
  { src: path.join(base, '.system_generated', 'steps', '803', 'media_0.png'), dest: path.join(base, 'phase4_earth_cinematic.png') },
  { src: path.join(base, '.system_generated', 'steps', '811', 'media_0.png'), dest: path.join(base, 'phase4_saturn_cinematic.png') },
  { src: path.join(base, '.system_generated', 'steps', '819', 'media_0.png'), dest: path.join(base, 'phase4_mars_cinematic.png') },
  { src: path.join(base, '.system_generated', 'steps', '827', 'media_0.png'), dest: path.join(base, 'phase4_jupiter_cinematic.png') },
  { src: path.join(base, '.system_generated', 'steps', '835', 'media_0.png'), dest: path.join(base, 'phase4_catalogue_drawer.png') }
];

for (const { src, dest } of copies) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${path.basename(dest)}: ${fs.statSync(dest).size} bytes`);
  } else {
    console.error(`Missing source: ${src}`);
  }
}
