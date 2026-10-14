/**
 * Probes the planetary imagery services SOLARIS streams from, exactly as the deployed site would:
 * cross-origin GET requests carrying the GitHub Pages origin. Prints status, content type, size and
 * the Access-Control-Allow-Origin header, and finds each layer's deepest available zoom level.
 *
 * Usage: node scripts/verify-tile-sources.mjs
 */
const ORIGIN = 'https://letmecodex.github.io';

async function probe(url) {
  try {
    const r = await fetch(url, { headers: { Origin: ORIGIN }, redirect: 'follow' });
    const buf = await r.arrayBuffer();
    return {
      status: r.status,
      type: r.headers.get('content-type'),
      bytes: buf.byteLength,
      acao: r.headers.get('access-control-allow-origin'),
      text: (r.headers.get('content-type') || '').includes('xml') ? Buffer.from(buf).toString('utf8') : '',
    };
  } catch (e) {
    return { status: 'ERR ' + e.message };
  }
}

const TREK = [
  ['Moon', 'LRO_WAC_Mosaic_Global_303ppd_v02', 'jpg'],
  ['Mars', 'Mars_Viking_MDIM21_ClrMosaic_global_232m', 'jpg'],
  ['Mars', 'Mars_MO_THEMIS-IR-Day_mosaic_global_100m_v12_clon0_ly', 'png'],
  ['Mercury', 'Mercury_MESSENGER_MDIS_Basemap_EnhancedColor_Mosaic_Global_665m', 'jpg'],
  ['Mercury', 'Mercury_MESSENGER_MDIS_Basemap_BDR_Mosaic_Global_166m', 'jpg'],
  ['Venus', 'Venus_Magellan_C3-MDIR_Colorized_Global_Mosaic_6600m', 'jpg'],
  ['Venus', 'Venus_Magellan_Global_C3-MDIR_Mosaic_2025m', 'jpg'],
  ['Ceres', 'Ceres_Dawn_FC_HAMO_ClrShade_DLR_Global_60ppd_Oct2016', 'jpg'],
  ['Vesta', 'Vesta_Dawn_HAMO_DTM_DLR_Global_48ppd', 'jpg'],
];

const GIBS = [
  ['BlueMarble_NextGeneration', '500m', 'jpeg', ['', 'default/', '2004-08-01/']],
  ['BlueMarble_ShadedRelief_Bathymetry', '500m', 'jpeg', ['', 'default/', '2004-08-01/']],
];

const line = (label, r) =>
  console.log(`${label.padEnd(98)} ${String(r.status).padEnd(5)} ${(r.type || '').padEnd(24)} ${String(r.bytes ?? '').padStart(8)}  ACAO=${r.acao}`);

console.log('== NASA Solar System Treks (WMTS, equirectangular) ==');
for (const [body, layer, ext] of TREK) {
  const base = `https://trek.nasa.gov/tiles/${body}/EQ/${layer}/1.0.0`;
  const caps = await probe(`${base}/WMTSCapabilities.xml`);
  line(`${body}/${layer} caps`, caps);
  if (caps.status !== 200) continue;
  const fmt = (caps.text.match(/<Format>([^<]+)<\/Format>/) || [])[1];
  const levels = [...caps.text.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<TileMatrix>\s*<ows:Identifier>(\d+)<\/ows:Identifier>/g)].map((m) => +m[1]);
  const tpl = (caps.text.match(/template="([^"]+)"/) || [])[1];
  console.log(`   format=${fmt} levels=${levels.join(',')} template=${tpl}`);
  for (const sep of ['/', '//']) {
    const r = await probe(`${base}${sep}default/default028mm/0/0/0.${ext}`);
    line(`   tile 0/0/0 (sep '${sep}')`, r);
  }
  const maxL = Math.max(...levels);
  for (const z of [maxL, maxL + 1]) {
    const r = await probe(`${base}/default/default028mm/${z}/${2 ** z / 2}/${2 ** z}.${ext}`);
    line(`   tile z=${z} centre`, r);
  }
}

console.log('\n== NASA GIBS (WMTS, EPSG:4326) ==');
for (const [layer, tms, ext, times] of GIBS) {
  for (const t of times) {
    const url = `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/${layer}/default/${t}${tms}/0/0/0.${ext}`;
    line(url.replace('https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/', ''), await probe(url));
  }
  for (const z of [7, 8]) {
    const url = `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/${layer}/default/${tms}/${z}/40/120.${ext}`;
    line(`   z=${z}`, await probe(url));
  }
}
