"""Turn label tracks into annotation tracks: each sky shot's main body centre + radius per frame
(undoing the site's label offset beside the disc), and the small companions' positions."""
import json, math, sys

FPS = 30
# shot: (main body, its true angular radius in degrees, ring?, starting vertical fov, zoom per second, companions)
SHOTS = {
    'sky_phobos_rise': ('Mars', math.degrees(math.asin(3389.5 / 9376)), False, 62, 0.05, []),
    'sky_io': ('Jupiter', math.degrees(math.asin(71492 / 421700)), False, 46, 0.05, ['Amalthea', 'Thebe']),
    'sky_enceladus': ('Saturn', math.degrees(math.asin(60268 / 238000)), True, 80, 0.05, ['Tethys', 'Janus']),
    'sky_saturn': (None, 0, False, 95, 0.04, ['Mimas', 'Enceladus']),
}

for name, (main, ang, ring, fov0, zoom, comps) in SHOTS.items():
    track = json.load(open(f'out/shots/{name}.track.json'))
    frames = []
    for i, f in enumerate(track):
        fov = fov0 * (1 - zoom * i / FPS)
        th = math.tan(math.radians(fov / 2))
        out = {}
        if main and main in f:
            x, y, _ = f[main]
            k = 2.75 if ring else 1.2
            off = (math.tan(math.radians(ang)) * k + 0.004) / th * 540
            out['main'] = [round(x - off, 1), round(y, 1), round(math.tan(math.radians(ang)) / th * 540, 1)]
        for c in comps:
            if c in f:
                x, y, _ = f[c]
                out[c] = [round(x - 0.006 / th * 540, 1), round(y, 1)]
        frames.append(out)
    json.dump(frames, open(f'remotion/data/{name}.json', 'w'))
    print(name, frames[len(frames) // 2])
