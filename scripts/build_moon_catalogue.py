"""
Build src/data/moons.json: every known natural satellite with real orbits and sizes.

Sources
- Satellite list and codes: JPL SSD "Planetary Satellite Mean Elements"  https://ssd.jpl.nasa.gov/sats/elem/
- Orbits: JPL Horizons osculating elements relative to the planet's centre, ecliptic of J2000,
  at EPOCH (TDB). Same element set as the hand-written major moons in CatalogueData.ts.
- Mean radius and GM: JPL SSD "Planetary Satellite Physical Parameters" https://ssd.jpl.nasa.gov/sats/phys_par/
  then Wikipedia "Moons of <planet>" tables (diameter, absolute magnitude, group, discovery year),
  then the Horizons header, then the absolute magnitude with a dark (p = 0.04) albedo.

Usage:  python scripts/build_moon_catalogue.py [cache_dir]
Raw responses are cached in cache_dir so re-runs do not hit the servers again.
"""
import html
import json
import math
import os
import re
import sys
import time
import urllib.parse
import urllib.request

EPOCH = '2026-10-14'
EPOCH_JD = 2461327.5
CACHE = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '.moon-cache')
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'moons.json')
UA = {'User-Agent': 'solaris-moon-catalogue/1.0 (educational; https://github.com/LetMeCodex/solaris)'}
# JPL's table truncates or misspells a few names
NAME_FIX = {'Magaclite': 'Megaclite', 'Philophrosyn': 'Philophrosyne'}
# Pluto's small moons circle the Pluto-Charon barycentre (Pluto itself swings 2,100 km around it)
BARYCENTRIC = {'902', '903', '904', '905'}
PLANET_CODE = {'Earth': 399, 'Mars': 499, 'Jupiter': 599, 'Saturn': 699, 'Uranus': 799, 'Neptune': 899, 'Pluto': 999}

os.makedirs(CACHE, exist_ok=True)


def fetch(url: str, name: str) -> str:
    path = os.path.join(CACHE, name)
    if os.path.exists(path) and os.path.getsize(path) > 200:
        return open(path, encoding='utf-8').read()
    for attempt in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90) as r:
                text = r.read().decode('utf-8')
            open(path, 'w', encoding='utf-8').write(text)
            time.sleep(0.25)
            return text
        except Exception as e:  # network hiccup: back off and retry
            print('  retry', name, e)
            time.sleep(2 + attempt * 3)
    raise RuntimeError(f'could not fetch {url}')


def cells(row: str):
    return [re.sub(r'\s+', ' ', html.unescape(re.sub(r'<.*?>', '', c))).strip()
            for c in re.findall(r'<t[hd][^>]*>(.*?)</t[hd]>', row, re.S)]


def num(s: str):
    m = re.search(r'[-+−]?\d+(?:\.\d+)?', (s or '').replace('−', '-').replace(',', ''))
    return float(m.group(0)) if m else None


def norm(name: str) -> str:
    """'S2017_J_11', 'S/2017 J 11', '‡Kore♥' → comparable keys."""
    n = re.sub(r'[^A-Za-z0-9/ _]', '', name).strip()
    n = n.replace('_', ' ').replace('/', ' ')
    return re.sub(r'\s+', '', n).lower()


# 1. The satellite list
elem = fetch('https://ssd.jpl.nasa.gov/sats/elem/', 'elem.html')
i = elem.index('id="sat_elem"')
rows = [cells(r) for r in re.findall(r'<tr.*?</tr>', elem[i:elem.index('</table>', i)], re.S)][1:]
sats = []
seen = set()
for r in rows:
    planet, name, code = r[1], r[2], r[3]
    if code in seen:
        continue
    seen.add(code)
    sats.append({'planet': planet, 'jplName': name, 'code': code, 'jplA': num(r[7])})
print(len(sats), 'satellites')

# 2. Physical parameters (well-measured moons)
phys = {}
for r in re.findall(r'<tr.*?</tr>', fetch('https://ssd.jpl.nasa.gov/sats/phys_par/', 'phys.html'), re.S):
    c = cells(r)
    if len(c) >= 5 and re.fullmatch(r'\d+', c[2] or ''):
        phys[c[2]] = {'gm': num(c[3]), 'radius': num(c[4])}

# 3. Wikipedia tables: diameter, absolute magnitude, group, discovery year
wiki = {}
for planet in ['Jupiter', 'Saturn', 'Uranus', 'Neptune']:
    page = fetch(f'https://en.wikipedia.org/api/rest_v1/page/html/Moons_of_{planet}', f'Moons_of_{planet}.html')
    for t in re.findall(r'<table[^>]*wikitable[^>]*>.*?</table>', page, re.S):
        trs = re.findall(r'<tr.*?</tr>', t, re.S)
        if len(trs) < 10:
            continue
        head = [h.lower() for h in cells(trs[0])]
        col = lambda key: next((k for k, h in enumerate(head) if key in h), None)
        ci_name, ci_mag, ci_dia, ci_grp, ci_year = col('name'), col('mag'), col('meter'), col('group'), col('discovery')
        if ci_name is None or ci_dia is None:
            continue
        for tr in trs[1:]:
            c = cells(tr)
            if len(c) <= max(x for x in [ci_name, ci_dia] if x is not None):
                continue
            nm = re.sub(r'data-sort-value.*?>', '', c[ci_name])
            dia = re.sub(r"data-sort-value.*?'>", '', c[ci_dia])
            wiki[(planet, norm(nm))] = {
                'name': re.sub(r'[♦‡♥†*]', '', nm).strip(),
                'diameter': num(dia.split('(')[0]),
                'H': num(c[ci_mag]) if ci_mag is not None else None,
                'group': re.sub(r'\[.*?\]', '', c[ci_grp]).strip() if ci_grp is not None and ci_grp < len(c) else None,
                'year': num(re.sub(r"data-sort-value.*?'>", '', c[ci_year])) if ci_year is not None and ci_year < len(c) else None,
            }
print(len(wiki), 'wikipedia rows')


def horizons(code: str, center: int) -> str:
    q = {
        'format': 'text', 'COMMAND': f"'{code}'", 'OBJ_DATA': "'YES'", 'MAKE_EPHEM': "'YES'",
        'EPHEM_TYPE': "'ELEMENTS'", 'CENTER': f"'500@{center}'", 'START_TIME': f"'{EPOCH}'",
        'STOP_TIME': "'2026-10-15'", 'STEP_SIZE': "'1d'", 'REF_PLANE': "'ECLIPTIC'",
        'REF_SYSTEM': "'J2000'", 'OUT_UNITS': "'KM-S'", 'CSV_FORMAT': "'YES'",
    }
    return fetch('https://ssd.jpl.nasa.gov/api/horizons.api?' + urllib.parse.urlencode(q), f'h_{code}.txt')


def horizons_bary(code: str) -> str:
    q = {
        'format': 'text', 'COMMAND': f"'{code}'", 'OBJ_DATA': "'YES'", 'MAKE_EPHEM': "'YES'",
        'EPHEM_TYPE': "'ELEMENTS'", 'CENTER': "'500@9'", 'START_TIME': f"'{EPOCH}'",
        'STOP_TIME': "'2026-10-15'", 'STEP_SIZE': "'1d'", 'REF_PLANE': "'ECLIPTIC'",
        'REF_SYSTEM': "'J2000'", 'OUT_UNITS': "'KM-S'", 'CSV_FORMAT': "'YES'",
    }
    return fetch('https://ssd.jpl.nasa.gov/api/horizons.api?' + urllib.parse.urlencode(q), f'hb_{code}.txt')


out = []
for k, s in enumerate(sats):
    s['jplName'] = NAME_FIX.get(s['jplName'], s['jplName'])
    center = 9 if s['code'] in BARYCENTRIC else PLANET_CODE[s['planet']]
    txt = horizons(s['code'], center) if center != 9 else horizons_bary(s['code'])
    m = re.search(r'\$\$SOE\s*\n(.*?)\n', txt)
    if not m:
        print('  no elements for', s['jplName'], s['code'])
        continue
    v = [x.strip() for x in m.group(1).split(',')]
    ec, qr, inc, om, w, tp, n, ma, ta, a = (float(x) for x in v[2:12])
    hdr = txt[:txt.find('Ephemeris /')]
    hr = re.search(r'(?:Mean radius|Radius)\s*\(km\)\s*=\s*([\d.]+)', hdr)
    hradii = re.search(r'Radii[^:]*:\s*([\d.]+)\s*x\s*([\d.]+)\s*x\s*([\d.]+)', hdr)
    halb = re.search(r'Geometric Albedo\s*=\s*([\d.]+)', hdr)
    wk = wiki.get((s['planet'], norm(s['jplName'])))
    name = s['jplName']
    if re.fullmatch(r'S\d{4}_[A-Z]_\d+', name):
        y, p, nn = name[1:5], name[6], name.split('_')[2]
        name = f'S/{y} {p} {nn}'
    radius, src = None, None
    if s['code'] in phys and phys[s['code']]['radius']:
        radius, src = phys[s['code']]['radius'], 'JPL SSD physical parameters'
    elif wk and wk['diameter']:
        radius, src = wk['diameter'] / 2, 'published estimate'
    elif hradii:
        radius, src = (float(hradii.group(1)) * float(hradii.group(2)) * float(hradii.group(3))) ** (1 / 3), 'IAU radii'
    elif hr:
        radius, src = float(hr.group(1)), 'JPL Horizons'
    elif wk and wk['H'] is not None:
        radius, src = 1329 / math.sqrt(0.04) * 10 ** (-wk['H'] / 5) / 2, 'from absolute magnitude (albedo 0.04)'
    else:
        radius, src = 1.0, 'unknown (≈1 km assumed)'
    axes = [float(hradii.group(j)) for j in (1, 2, 3)] if hradii else None
    out.append({
        'id': s['code'],
        'name': name,
        'parent': s['planet'],
        'radiusKm': round(radius, 3),
        'radiusSource': src,
        'axesKm': axes,
        'gm': phys.get(s['code'], {}).get('gm'),
        'albedo': float(halb.group(1)) if halb else None,
        'H': wk['H'] if wk else None,
        'group': wk['group'] if wk and wk['group'] else None,
        'year': int(wk['year']) if wk and wk['year'] else None,
        'a': round(a, 3), 'e': round(ec, 8), 'i': round(inc, 6), 'node': round(om, 6), 'peri': round(w, 6),
        'M': round(ma, 6), 'n': n * 86400.0,  # deg/day
        'jplA': s['jplA'],  # JPL mean semi-major axis (km), the fallback when Horizons has no usable orbit
    })
    if k % 25 == 0:
        print(f'{k}/{len(sats)} {name} r={radius:.1f} km ({src})')

out.sort(key=lambda m: (list(PLANET_CODE).index(m['parent']), m['a']))
json.dump({'epochJd': EPOCH_JD, 'frame': 'ecliptic J2000, planet-centred', 'source': 'JPL Horizons osculating elements; JPL SSD; Wikipedia', 'moons': out},
          open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('wrote', len(out), 'moons to', OUT)
