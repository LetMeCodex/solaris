"""
Build public/data/small-bodies.json: real orbits of the Solar System's small bodies.

Source: NASA/JPL Small-Body Database Query API  https://ssd-api.jpl.nasa.gov/doc/sbdb_query.html
Heliocentric osculating elements (ecliptic J2000) at each object's own epoch.

Populations
- main:     main-belt asteroids, H < 14.5 (the ~33,000 largest, roughly D > 4 km)
- hilda:    Hildas (3:2 with Jupiter), part of the same query
- trojan:   Jupiter Trojans, H < 14.5
- neo:      near-Earth asteroids flagged potentially hazardous
- centaur:  Centaurs (between Jupiter and Neptune)
- tno:      every known trans-Neptunian object (Kuiper belt, plutinos, scattered disc, detached)
- comet:    numbered periodic comets plus a few great long-period ones

Each body: [a AU, e, i deg, node deg, peri deg, M deg, epoch JD, H, D km or -1]
(comets: [q AU, e, i, node, peri, tp JD, epoch JD, 0, -1, name])

Usage: python scripts/build_small_bodies.py [cache_dir]
"""
import json
import os
import sys
import time
import urllib.parse
import urllib.request

CACHE = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '.sb-cache')
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'data', 'small-bodies.json')
UA = {'User-Agent': 'solaris-small-bodies/1.0 (educational; https://github.com/LetMeCodex/solaris)'}
API = 'https://ssd-api.jpl.nasa.gov/sbdb_query.api'
os.makedirs(CACHE, exist_ok=True)


def query(name: str, params: dict) -> dict:
    path = os.path.join(CACHE, name + '.json')
    if os.path.exists(path):
        return json.load(open(path, encoding='utf-8'))
    url = API + '?' + urllib.parse.urlencode(params)
    for attempt in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=300) as r:
                data = json.loads(r.read().decode('utf-8'))
            json.dump(data, open(path, 'w', encoding='utf-8'))
            time.sleep(1)
            return data
        except Exception as e:
            print('  retry', name, e)
            time.sleep(3 + attempt * 5)
    raise RuntimeError('failed ' + name)


AST_FIELDS = 'full_name,a,e,i,om,w,ma,epoch,H,diameter,class'


def f(x, nd):
    try:
        return round(float(x), nd)
    except (TypeError, ValueError):
        return None


def asteroids(name: str, extra: dict):
    d = query(name, {'fields': AST_FIELDS, 'sb-kind': 'a', 'full-prec': '0', **extra})
    out = []
    for r in d['data']:
        full, a, e, i, om, w, ma, ep, H, D, cls = r
        row = [f(a, 5), f(e, 5), f(i, 3), f(om, 3), f(w, 3), f(ma, 3), f(ep, 1), f(H, 2), f(D, 1)]
        if None in row[:7] or row[0] <= 0 or row[1] >= 1:
            continue
        if row[7] is None:
            row[7] = 99.0
        if row[8] is None:
            row[8] = -1
        out.append((cls, row, full.strip()))
    return out


pops = {k: [] for k in ['main', 'hilda', 'trojan', 'neo', 'centaur', 'tno']}
named = []  # the biggest of each population keep their names for labels

for cls, row, full in asteroids('belt145', {'sb-class': 'IMB,MBA,OMB,MCA', 'sb-cdata': json.dumps({'AND': ['H|LT|14.5']})}):
    pops['hilda' if 3.7 < row[0] < 4.2 else 'main'].append(row)
for cls, row, full in asteroids('trojans', {'sb-class': 'TJN', 'sb-cdata': json.dumps({'AND': ['H|LT|14.5']})}):
    pops['trojan'].append(row)
for cls, row, full in asteroids('pha', {'sb-group': 'pha'}):
    pops['neo'].append(row)
for cls, row, full in asteroids('centaurs', {'sb-class': 'CEN'}):
    pops['centaur'].append(row)
for cls, row, full in asteroids('tnos', {'sb-class': 'TNO'}):
    pops['tno'].append(row)
    if row[7] < 4.0:
        named.append({'name': full, 'pop': 'tno', 'H': row[7], 'D': row[8], 'el': row[:7]})

# Comets: numbered periodic, then a handful of great long-period comets by designation
COMET_FIELDS = 'full_name,q,e,i,om,w,tp,epoch'
comets = []
d = query('comets_numbered', {'fields': COMET_FIELDS, 'sb-kind': 'c', 'sb-ns': 'n', 'full-prec': '0'})
for r in d['data']:
    full, q, e, i, om, w, tp, ep = r
    row = [f(q, 5), f(e, 6), f(i, 3), f(om, 3), f(w, 3), f(tp, 3), f(ep, 1), 0, -1, full.strip()]
    if None in row[:7] or row[1] >= 1:
        continue
    comets.append(row)
GREAT = ['C/1995 O1', 'C/2020 F3', 'C/2023 A3', 'C/1996 B2', 'C/2006 P1', 'C/2011 L4', 'C/2022 E3']
for des in GREAT:
    try:
        with urllib.request.urlopen(urllib.request.Request(
                'https://ssd-api.jpl.nasa.gov/sbdb.api?' + urllib.parse.urlencode({'sstr': des}), headers=UA), timeout=60) as r:
            o = json.loads(r.read().decode('utf-8'))
        el = {x['name']: x['value'] for x in o['orbit']['elements']}
        row = [f(el['q'], 5), f(el['e'], 6), f(el['i'], 3), f(el['om'], 3), f(el['w'], 3), f(el['tp'], 3),
               f(o['orbit']['epoch'], 1), 0, -1, o['object']['fullname']]
        if row[1] is not None and row[1] < 1:
            comets.append(row)
        time.sleep(0.5)
    except Exception as ex:
        print('  comet', des, ex)

out = {
    'source': 'NASA/JPL Small-Body Database (ssd-api.jpl.nasa.gov), osculating heliocentric ecliptic J2000 elements',
    'fields': 'a AU, e, i, node, peri, M (deg), epoch JD, H, D km (-1 unknown)',
    'cometFields': 'q AU, e, i, node, peri, tp JD, epoch JD, 0, -1, name',
    'populations': pops,
    'comets': comets,
    'namedTno': sorted(named, key=lambda n: n['H'])[:40],
}
json.dump(out, open(OUT, 'w', encoding='utf-8'), separators=(',', ':'))
for k, v in pops.items():
    print(k, len(v))
print('comets', len(comets), 'named tno', len(named))
print('wrote', OUT, os.path.getsize(OUT) // 1024, 'KB')
