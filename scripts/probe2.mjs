const O = { headers: { Origin: 'https://letmecodex.github.io' } };
async function get(u, asText = false) {
  try { const r = await fetch(u, O); const b = asText ? await r.text() : Buffer.from(await r.arrayBuffer());
    return { s: r.status, ct: r.headers.get('content-type'), acao: r.headers.get('access-control-allow-origin'), b }; }
  catch (e) { return { s: 'ERR ' + e.message }; }
}
const line = (n, r) => console.log(n.padEnd(70), r.s, r.ct, r.acao, r.b ? r.b.length : '');
// GIBS capabilities: list layers with their TileMatrixSet
const caps = await get('https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml', true);
console.log('GIBS caps', caps.s, caps.b?.length);
const want = /BlueMarble|Landsat|WELD|ShadedRelief|Bathymetry|ASTER|SRTM|Coastlines|Reference_Labels|Reference_Features|VIIRS_CityLights|Black_Marble|BlackMarble/i;
for (const m of caps.b.matchAll(/<Layer>([\s\S]*?)<\/Layer>/g)) {
  const id = /<ows:Identifier>([^<]+)</.exec(m[1])?.[1]; if (!id || !want.test(id)) continue;
  const tms = [...m[1].matchAll(/<TileMatrixSet>([^<]+)</g)].map(x => x[1]).join(',');
  const fmt = [...m[1].matchAll(/<Format>([^<]+)</g)].map(x => x[1]).join(',');
  const tmpl = /template="([^"]+)"/.exec(m[1])?.[1];
  const dims = /<Dimension>[\s\S]*?<Default>([^<]+)<[\s\S]*?<Value>([^<]+)</.exec(m[1]);
  console.log('LAYER', id, tms, fmt, dims ? 'time default=' + dims[1] + ' values=' + dims[2].slice(0, 60) : '', tmpl);
}
// tile matrix set definitions
for (const m of caps.b.matchAll(/<TileMatrixSet>\s*<ows:Identifier>([^<]+)<\/ows:Identifier>([\s\S]*?)<\/TileMatrixSet>/g)) {
  const lv = [...m[2].matchAll(/<TileMatrix>[\s\S]*?<ows:Identifier>([^<]+)<[\s\S]*?<ScaleDenominator>([^<]+)<[\s\S]*?<TileWidth>(\d+)<[\s\S]*?<MatrixWidth>(\d+)<\/MatrixWidth>\s*<MatrixHeight>(\d+)</g)].map(x => `${x[1]}:${x[4]}x${x[5]}`);
  console.log('TMS', m[1], lv.join(' '));
}
const B = 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/';
for (const [n, u] of [
  ['bathy 0', B + 'BlueMarble_ShadedRelief_Bathymetry/default/500m/0/0/0.jpeg'],
  ['bathy 7', B + 'BlueMarble_ShadedRelief_Bathymetry/default/500m/7/30/40.jpeg'],
  ['bathy 8', B + 'BlueMarble_ShadedRelief_Bathymetry/default/500m/8/60/80.jpeg'],
  ['shadedrelief 7', B + 'BlueMarble_ShadedRelief/default/500m/7/30/40.jpeg'],
]) line(n, await get(u));
// EOX Sentinel-2 cloudless
const eox = await get('https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml', true);
console.log('EOX caps', eox.s, eox.acao, eox.b?.length);
if (eox.b) {
  for (const m of eox.b.matchAll(/<Layer>([\s\S]*?)<\/Layer>/g)) {
    const id = /<ows:Identifier>([^<]+)</.exec(m[1])?.[1];
    const tms = [...m[1].matchAll(/<TileMatrixSet>([^<]+)</g)].map(x => x[1]).join(',');
    const tmpl = /template="([^"]+)"/.exec(m[1])?.[1];
    console.log('EOXLAYER', id, tms, tmpl);
  }
  for (const m of eox.b.matchAll(/<TileMatrixSet>\s*<ows:Identifier>([^<]+)<\/ows:Identifier>([\s\S]*?)<\/TileMatrixSet>/g)) {
    const lv = [...m[2].matchAll(/<MatrixWidth>(\d+)<\/MatrixWidth>\s*<MatrixHeight>(\d+)</g)].map(x => `${x[1]}x${x[2]}`);
    const tl = /<TopLeftCorner>([^<]+)</.exec(m[2])?.[1]; const tw = /<TileWidth>(\d+)/.exec(m[2])?.[1];
    console.log('EOXTMS', m[1], 'tl=' + tl, 'tw=' + tw, lv.join(' '));
  }
  const ab = /<ows:AccessConstraints>([^<]+)</.exec(eox.b)?.[1]; const fees = /<ows:Fees>([^<]+)</.exec(eox.b)?.[1];
  console.log('EOX access', ab, 'fees', fees);
}
// Trek layer capabilities for richer layers
const trek = (body, layer) => `https://trek.nasa.gov/tiles/${body}/EQ/${layer}/1.0.0/WMTSCapabilities.xml`;
for (const [b, l] of [
  ['Mars', 'Mars_MO_THEMIS-IR-Day_mosaic_global_100m_v12'],
  ['Mars', 'Mars_MGS_MOLA_ClrShade_merge_global_463m'],
  ['Mars', 'CTX_beta01_uncontrolled_5m_Caltech'],
  ['Mars', 'Mars_MRO_CTX_mosaic_beta01_200ppd'],
  ['Mars', 'MDIM21_ClrMosaic_global_232m'],
  ['Mars', 'Mars_Viking_ClrMosaic_global_925m'],
  ['Moon', 'LRO_LOLAKaguya_ClrHillshade_60N60S_512ppd'],
  ['Moon', 'LRO_WAC_Mosaic_Global_303ppd_v02'],
  ['Moon', 'Kaguya_TCortho_Mosaic_Global_4096ppd'],
  ['Moon', 'Lunar_LRO_LROC-WAC_Mosaic_global_100m_June2013'],
  ['Mercury', 'Mercury_MESSENGER_MDIS_Basemap_EnhancedColor_Mosaic_Global_665m'],
  ['Mercury', 'Mercury_MESSENGER_MDIS_Basemap_LOI_Mosaic_Global_166m'],
  ['Mercury', 'Mercury_MESSENGER_MDIS_Basemap_MD3Color_Mosaic_Global_665m'],
  ['Mercury', 'Mercury_MESSENGER_USGS_ClrShade_Global_2km'],
  ['Venus', 'Venus_Magellan_C3-MDIR_ClrTopo_Global_Mosaic_6600m'],
  ['Venus', 'Venus_Magellan_Topography_Global_4641m_v02'],
]) {
  const r = await get(trek(b, l), true);
  const lv = r.b && r.s === 200 ? [...r.b.matchAll(/<TileMatrix>\s*<ows:Identifier>([^<]+)</g)].map(x => x[1]).join(',') : '';
  const fmt = r.b && r.s === 200 ? /<Format>([^<]+)</.exec(r.b)?.[1] : '';
  console.log('TREK', b, l, r.s, r.acao, fmt, 'levels', lv);
}
// Trek layer catalog search API (layer list)
for (const body of ['Mars', 'Moon', 'Mercury', 'Venus']) {
  const u = `https://trek.nasa.gov/${body.toLowerCase()}/TrekServices/ws/index/eq/searchItems?proj=urn:ogc:def:crs:EPSG::104905&start=0&rows=60&facetKeys=itemType&facetValues=Mosaic&intersects=false`;
  const r = await get(u, true);
  console.log('CATALOG', body, r.s, r.b ? r.b.length : '');
  if (r.s === 200) try { const j = JSON.parse(r.b); for (const d of (j.response?.docs || [])) console.log('  ', d.productLabel || d.title, '|', d.layerId || d.productId, '|', d.endPoint || ''); } catch (e) { console.log('  parse', e.message, r.b.slice(0, 200)); }
}
