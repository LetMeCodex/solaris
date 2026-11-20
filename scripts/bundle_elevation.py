"""Bundle Tilezen Terrarium coverage (SRTM/GMTED/ETOPO; credits in ASSETS.md)."""
import concurrent.futures, json, math, pathlib, re, urllib.request
root = pathlib.Path(__file__).resolve().parents[1]
out = root / 'public' / 'data' / 'elevation'
keys = {(3, x, y) for y in range(8) for x in range(8)}
text = (root / 'src/explorer/Landmarks.ts').read_text(encoding='utf-8')
for match in re.finditer(r"\{ id: 'earth-[^']+'[^\n]+?body: 'Earth', lat: (-?[\d.]+), lon: (-?[\d.]+)", text):
    lat, lon = map(float, match.groups())
    z = 8; n = 2 ** z
    x = int((lon + 180) / 360 * n)
    phi = math.radians(max(-85, min(85, lat)))
    y = int((1 - math.asinh(math.tan(phi)) / math.pi) / 2 * n)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            keys.add((z, (x + dx) % n, max(0, min(n - 1, y + dy))))
def fetch(key):
    z, x, y = key
    dest = out / str(z) / str(x) / f'{y}.png'
    if dest.exists(): return dest.stat().st_size
    url = f'https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{z}/{x}/{y}.png'
    data = urllib.request.urlopen(url, timeout=30).read()
    if not data.startswith(b'\x89PNG\r\n\x1a\n'): raise ValueError('Invalid elevation PNG')
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    return len(data)
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    sizes = list(pool.map(fetch, sorted(keys)))
print(f'Bundled {len(sizes)} elevation tiles, {sum(sizes)/1048576:.2f} MiB')
(root / 'src/data/elevationTiles.json').write_text(json.dumps([f'{z}/{x}/{y}' for z, x, y in sorted(keys)]), encoding='utf-8')
