const O = { headers: { Origin: 'https://letmecodex.github.io' } };
async function get(u, t = false) { try { const r = await fetch(u, O); const b = t ? await r.text() : Buffer.from(await r.arrayBuffer()); return { s: r.status, ct: r.headers.get('content-type'), acao: r.headers.get('access-control-allow-origin'), b }; } catch (e) { return { s: 'ERR ' + e.message }; } }
const caps = await get('https://trek.nasa.gov/tiles/Mars/EQ/CTX_beta01_uncontrolled_5m_Caltech/1.0.0/WMTSCapabilities.xml', true);
console.log(caps.b.replace(/\n\s*/g, ' ').slice(0, 4000));
const tileAt = (z, lat, lon) => { const d = 180 / 2 ** z; return [Math.floor((90 - lat) / d), Math.floor((lon + 180) / d)]; };
const tmpl = /template="([^"]+)"/.exec(caps.b)?.[1];
const tms = /<TileMatrixSet>([^<]+)<\/TileMatrixSet>/.exec(caps.b)?.[1];
console.log('TEMPLATE', tmpl, 'TMS', tms);
if (tmpl) for (let z = 0; z <= 13; z++) {
  const [y, x] = tileAt(z, -5.4, 137.8);
  const u = tmpl.replace('{Style}', 'default').replace('{TileMatrixSet}', tms).replace('{TileMatrix}', z).replace('{TileRow}', y).replace('{TileCol}', x);
  const r = await get(u); console.log('CTX', z, r.s, r.ct, r.acao, r.b?.length, u);
}
for (const l of ['Mars_Viking_MDIM21_ClrMosaic_global_232m', 'Mars_MGS_MOLA_ClrShade_merge_global_463m']) {
  const c = await get(`https://trek.nasa.gov/tiles/Mars/EQ/${l}/1.0.0/WMTSCapabilities.xml`, true);
  console.log(l, /template="([^"]+)"/.exec(c.b)?.[1], /<TileMatrixSet>([^<]+)<\/TileMatrixSet>/.exec(c.b)?.[1]);
}
