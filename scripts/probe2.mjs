const O = { headers: { Origin: 'https://letmecodex.github.io' } };
async function get(u, asText = false) {
  try { const r = await fetch(u, O); const b = asText ? await r.text() : Buffer.from(await r.arrayBuffer());
    return { s: r.status, ct: r.headers.get('content-type'), acao: r.headers.get('access-control-allow-origin'), b }; }
  catch (e) { return { s: 'ERR ' + e.message }; }
}
const eox = await get('https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml', true);
console.log('ACCESS', /<ows:AccessConstraints>([\s\S]*?)<\/ows:AccessConstraints>/.exec(eox.b)?.[1]);
console.log('FEES', /<ows:Fees>([\s\S]*?)<\/ows:Fees>/.exec(eox.b)?.[1]);
for (const m of eox.b.matchAll(/<Layer>([\s\S]*?)<\/Layer>/g)) {
  const id = /<ows:Identifier>([^<]+)</.exec(m[1])?.[1];
  if (!/^s2cloudless(-20\d\d)?$/.test(id)) continue;
  console.log('LAYERMETA', id, (/<ows:Title>([^<]+)</.exec(m[1])||[])[1], (/<ows:Abstract>([\s\S]*?)<\/ows:Abstract>/.exec(m[1])||[])[1]?.slice(0,400), [...m[1].matchAll(/TileMatrixSetLimits[\s\S]*?<\/TileMatrixSetLimits>/g)].map(x=>x[0].replace(/\s+/g,' ').slice(0,300)).join(' | '));
}
// deepest level near a land point (lat 36.1, lon -112.1 Grand Canyon) for WGS84 grids with 180° level-0 tiles
const tileAt = (z, lat, lon, deg0 = 180) => { const d = deg0 / 2 ** z; return [Math.floor((90 - lat) / d), Math.floor((lon + 180) / d)]; };
async function deepest(name, tmpl, maxZ, lat, lon) {
  for (let z = 0; z <= maxZ; z++) {
    const [y, x] = tileAt(z, lat, lon);
    const r = await get(tmpl.replace('{z}', z).replace('{y}', y).replace('{x}', x));
    console.log(name, 'z=' + z, r.s, r.ct, 'acao=' + r.acao, r.b?.length);
  }
}
await deepest('S2-2016', 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless/default/WGS84/{z}/{y}/{x}.jpg', 18, 36.1, -112.1);
await deepest('S2-2024', 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2024/default/WGS84/{z}/{y}/{x}.jpg', 18, 36.1, -112.1);
await deepest('KAGUYA', 'https://trek.nasa.gov/tiles/Moon/EQ/Kaguya_TCortho_Mosaic_Global_4096ppd/1.0.0/default/default028mm/{z}/{y}/{x}.png', 11, -43.31, -11.36);
await deepest('CTX', 'https://trek.nasa.gov/tiles/Mars/EQ/CTX_beta01_uncontrolled_5m_Caltech/1.0.0/default/default028mm/{z}/{y}/{x}.png', 12, -5.4, 137.8);
await deepest('LOI', 'https://trek.nasa.gov/tiles/Mercury/EQ/Mercury_MESSENGER_MDIS_Basemap_LOI_Mosaic_Global_166m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg', 8, 30.5, 170.2);
// Trek mosaic catalogs (titles + layer ids)
for (const body of ['Mars', 'Moon', 'Mercury', 'Venus']) {
  const u = `https://trek.nasa.gov/${body.toLowerCase()}/TrekServices/ws/index/eq/searchItems?proj=urn:ogc:def:crs:EPSG::104905&start=0&rows=60&facetKeys=itemType&facetValues=Mosaic&intersects=false`;
  const r = await get(u, true); console.log('CATALOG', body, r.s, r.b?.slice(0, 1500));
}
