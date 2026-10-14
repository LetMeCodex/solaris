/** Fetches reference coordinates (with their globe) for curated landmarks from Wikipedia's API. */
const titles = [
  'Tycho (lunar crater)', 'Copernicus (lunar crater)', 'Tranquility Base', 'Shackleton (crater)', 'Mare Imbrium',
  'Olympus Mons', 'Valles Marineris', 'Gale (crater)', 'Jezero (crater)', 'Hellas Planitia',
  'Caloris Planitia', 'Hokusai (crater)', 'Rachmaninoff (crater)',
  'Maxwell Montes', 'Maat Mons', 'Aphrodite Terra',
  'Mount Everest', 'Grand Canyon', 'Richat Structure', 'Lake Baikal', 'Nile Delta',
];
for (let i = 0; i < titles.length; i += 10) {
  const batch = titles.slice(i, i + 10).map(encodeURIComponent).join('|');
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=coordinates&coprop=globe|type&redirects=1&format=json&titles=${batch}`;
  const r = await fetch(url, { headers: { 'User-Agent': 'SOLARIS landmark verification (github.com/LetMeCodex/solaris)' } });
  const j = await r.json();
  for (const p of Object.values(j.query.pages)) {
    const c = (p.coordinates || [])[0];
    console.log(`${p.title.padEnd(32)} ${c ? `${c.lat}\t${c.lon}\t${c.globe}\t${c.type ?? ''}` : 'NO COORDINATES'}`);
  }
}
