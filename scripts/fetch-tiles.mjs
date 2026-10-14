// Downloads the public NASA/USGS imagery tiles listed in scripts/tiles-wanted.txt into tiles-cache/<sha1(url)>
// so the Playwright journeys can replay real imagery offline. Public endpoints only; no keys.
import fs from 'node:fs';
import crypto from 'node:crypto';
const urls = fs.readFileSync('scripts/tiles-wanted.txt', 'utf8').split('\n').filter(Boolean);
fs.mkdirSync('tiles-cache', { recursive: true });
const stats = { ok: 0, fail: 0, bytes: 0, byHost: {} };
let i = 0;
async function worker() {
  while (i < urls.length) {
    const url = urls[i++];
    const host = new URL(url).host;
    stats.byHost[host] ??= { ok: 0, fail: 0 };
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const r = await fetch(url, { headers: { Origin: 'https://letmecodex.github.io' } });
        const buf = Buffer.from(await r.arrayBuffer());
        if (r.ok && /image/.test(r.headers.get('content-type') || '')) {
          fs.writeFileSync('tiles-cache/' + crypto.createHash('sha1').update(url).digest('hex'), buf);
          stats.ok++; stats.byHost[host].ok++; stats.bytes += buf.length;
        } else { stats.fail++; stats.byHost[host].fail++; console.log('FAIL', r.status, url); }
        break;
      } catch (e) { if (attempt === 2) { stats.fail++; stats.byHost[host].fail++; console.log('ERR', e.message, url); } }
    }
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
console.log(JSON.stringify(stats));
