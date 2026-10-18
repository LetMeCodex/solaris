// Exports Vela's pixel frames for the README art, from the same sprite code the report draws her with.
//   node scripts/readme/export_vela.mjs   →   scripts/readme/vela.json
import { build } from 'esbuild';
import fs from 'node:fs';

const out = await build({ entryPoints: ['src/report/vela/sprite.ts'], bundle: true, format: 'esm', write: false, logLevel: 'warning' });
const { draw, W, H } = await import('data:text/javascript;base64,' + Buffer.from(out.outputFiles[0].text).toString('base64'));
const base = { mouth: 'smile', arms: 'down', costume: 'none', gaze: [0, 0], cheeks: true, sweat: false, star: 1 };
const frames = {
  open: draw({ ...base, eyes: 'open' }),
  blink: draw({ ...base, eyes: 'blink', star: 0 }),
  wave1: draw({ ...base, eyes: 'happy', mouth: 'grin', arms: 'wave1' }),
  wave2: draw({ ...base, eyes: 'happy', mouth: 'grin', arms: 'wave2', star: 0 }),
};
fs.writeFileSync('scripts/readme/vela.json', JSON.stringify({ W, H, frames }));
console.log('vela.json', Object.fromEntries(Object.entries(frames).map(([k, v]) => [k, v.length])));
