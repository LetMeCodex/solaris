"""
Build the nebulae of the Solaris sky (public/textures/nebulae/).

  python scripts/build_nebulae.py --src <folder with the source photographs> [--look <folder with the reference looks>]

Three are real photographs (downloaded once into --src, credits in public/textures/nebulae/SOURCES.md):
  mystic-mountain  Hubble, "Mystic Mountain" in the Carina Nebula (ESA/Hubble heic1007a)
  cosmic-cliffs    JWST, the "Cosmic Cliffs" of NGC 3324 (ESA/Webb weic2205a)
  helix            VISTA, the Helix Nebula (ESO eso1205a)
The rest are procedural: domain-warped noise shaped like the kinds of nebula the sky is full of
(an emission cloud, a ring, a supernova shell, filaments, a dusty lagoon).

Each texture is an RGBA WebP made for premultiplied blending: RGB is the light (the black sky
removed, so it adds onto the real stars) and alpha is how much dust dims the stars behind it. Edges
fade out on an irregular, cloudy line, so no rectangle is ever visible. A '_lite' copy at half size
is written for phones.

With --look, a photograph's colours are moved towards a reference image (Reinhard transfer in Lab),
so the sky matches the look you chose.
"""
import argparse, json, os
import numpy as np
import cv2

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'textures', 'nebulae')
rng = np.random.default_rng(7)

PHOTOS = {
    # name: (source file, look file, look strength, crop box (x0,y0,x1,y1 as fractions), output width)
    'mystic-mountain': ('mm_o.tif', '2.png', 0.55, (0.0, 0.0, 1.0, 1.0), 2560),
    'cosmic-cliffs': ('cc_l.jpg', '3.webp', 0.35, (0.0, 0.0, 1.0, 1.0), 4096),
    'helix': ('hx_l.jpg', '4.webp', 0.8, (0.14, 0.14, 0.86, 0.86), 3072),
}


def to_float(img):
    return img.astype(np.float32) / 255.0


def lab_transfer(src, ref, strength):
    """Reinhard colour transfer in Lab, blended by strength."""
    s = cv2.cvtColor(src, cv2.COLOR_RGB2LAB).astype(np.float32)
    r = cv2.cvtColor(ref, cv2.COLOR_RGB2LAB).astype(np.float32)
    out = s.copy()
    for c in range(3):
        sm, ss = s[..., c].mean(), s[..., c].std() + 1e-6
        rm, rs = r[..., c].mean(), r[..., c].std() + 1e-6
        out[..., c] = (s[..., c] - sm) * (rs / ss) + rm
    out = np.clip(out, 0, 255).astype(np.uint8)
    moved = cv2.cvtColor(out, cv2.COLOR_LAB2RGB)
    return cv2.addWeighted(moved, strength, src, 1 - strength, 0)


def fbm(h, w, octaves=6, base=4, persistence=0.55, seed=None):
    """Fractal noise in 0..1 (sum of upscaled random fields)."""
    g = np.random.default_rng(seed if seed is not None else int(rng.integers(1 << 30)))
    acc = np.zeros((h, w), np.float32)
    amp, total = 1.0, 0.0
    for o in range(octaves):
        n = base * 2 ** o
        f = g.random((n + 1, n + 1)).astype(np.float32)
        acc += amp * cv2.resize(f, (w, h), interpolation=cv2.INTER_CUBIC)
        total += amp
        amp *= persistence
    acc /= total
    return (acc - acc.min()) / (np.ptp(acc) + 1e-6)


def warp(field, strength, seed):
    h, w = field.shape
    dx = (fbm(h, w, 5, 3, seed=seed) - 0.5) * strength * w
    dy = (fbm(h, w, 5, 3, seed=seed + 1) - 0.5) * strength * h
    xs, ys = np.meshgrid(np.arange(w, dtype=np.float32), np.arange(h, dtype=np.float32))
    return cv2.remap(field, xs + dx, ys + dy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)


def edge_mask(h, w, seed, inner=0.62, roughness=0.35, ellipse=True):
    """1 inside, 0 at the border, along a cloudy irregular line."""
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    u, v = (xs + 0.5) / w * 2 - 1, (ys + 0.5) / h * 2 - 1
    d = np.sqrt(u * u + v * v) if ellipse else np.maximum(np.abs(u), np.abs(v))
    n = fbm(h, w, 5, 3, seed=seed)
    d = d + (n - 0.5) * roughness
    return np.clip((1.0 - d) / (1.0 - inner), 0, 1) ** 1.6


def ramp(t, stops):
    """Colour ramp: stops = [(pos, (r,g,b)), ...] with 0..1 colours."""
    t = np.clip(t, 0, 1)
    out = np.zeros(t.shape + (3,), np.float32)
    for i in range(len(stops) - 1):
        p0, c0 = stops[i]
        p1, c1 = stops[i + 1]
        m = (t >= p0) & (t <= p1)
        k = ((t[m] - p0) / max(1e-6, p1 - p0))[:, None]
        out[m] = np.array(c0) * (1 - k) + np.array(c1) * k
    return out


def save(name, rgb, alpha, width):
    """rgb, alpha float 0..1; writes full and lite WebP (RGBA)."""
    h0, w0 = alpha.shape
    height = round(width * h0 / w0)
    rgba = np.dstack([np.clip(rgb, 0, 1), np.clip(alpha, 0, 1)])
    rgba8 = (rgba * 255 + 0.5).astype(np.uint8)
    big = cv2.resize(rgba8, (width, height), interpolation=cv2.INTER_AREA if width < w0 else cv2.INTER_LANCZOS4)
    lite = cv2.resize(rgba8, (width // 2, height // 2), interpolation=cv2.INTER_AREA)
    for img, suffix in ((big, ''), (lite, '_lite')):
        path = os.path.join(OUT, f'{name}{suffix}.webp')
        cv2.imwrite(path, cv2.cvtColor(img, cv2.COLOR_RGBA2BGRA), [cv2.IMWRITE_WEBP_QUALITY, 86])
    print(f'{name:18s} {width}x{height}  {os.path.getsize(os.path.join(OUT, name + ".webp")) / 1e6:.1f} MB')
    return width / height


def photo(name, src_dir, look_dir):
    file, look, strength, crop, width = PHOTOS[name]
    img = cv2.imread(os.path.join(src_dir, file), cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    h, w = img.shape[:2]
    x0, y0, x1, y1 = crop
    img = img[int(y0 * h):int(y1 * h), int(x0 * w):int(x1 * w)]
    # Work at the output size (the Webb mosaic is 14k wide)
    scale = min(1.0, (width * 1.25) / img.shape[1])
    if scale < 1:
        img = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
    if look_dir and look and os.path.exists(os.path.join(look_dir, look)):
        ref = cv2.imread(os.path.join(look_dir, look), cv2.IMREAD_COLOR)
        img = lab_transfer(img, cv2.cvtColor(ref, cv2.COLOR_BGR2RGB), strength)
    f = to_float(img)
    # Remove the sky's own background so only the nebula and its stars add light
    floor = np.percentile(f.reshape(-1, 3), 6, axis=0)
    f = np.clip((f - floor) / (1 - floor), 0, 1)
    hh, ww = f.shape[:2]
    mask = edge_mask(hh, ww, seed=len(name) * 13, inner=0.5 if name == 'helix' else 0.42, roughness=0.42)
    lum = f.mean(axis=2)
    cloud = cv2.GaussianBlur(lum, (0, 0), max(2, ww / 300))
    alpha = np.clip(cloud * 1.6, 0, 0.55) * mask
    return save(name, f * mask[..., None], alpha, width)


def stars(h, w, n, seed):
    g = np.random.default_rng(seed)
    out = np.zeros((h, w), np.float32)
    for _ in range(n):
        x, y = int(g.random() * w), int(g.random() * h)
        r = 0.6 + g.random() ** 6 * 3.0
        cv2.circle(out, (x, y), int(np.ceil(r * 2)), float(0.3 + g.random() * 0.7), -1, lineType=cv2.LINE_AA)
    return cv2.GaussianBlur(out, (0, 0), 1.1)


def procedural(name, kind, size=2048):
    h = w = size
    s = abs(hash(name)) % 10000
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    u, v = (xs + 0.5) / w * 2 - 1, (ys + 0.5) / h * 2 - 1
    r = np.sqrt(u * u + v * v)
    base = warp(fbm(h, w, 7, 3, seed=s), 0.25, s + 5)
    detail = warp(fbm(h, w, 7, 6, 0.6, seed=s + 9), 0.12, s + 11)
    ridge = 1 - np.abs(detail - 0.5) * 2  # soft bright strands
    # Thin filaments: the zero-crossings of smooth noise, curled by a warp
    net = warp(1 - np.abs(fbm(h, w, 3, 5, 0.5, seed=s + 31) - 0.5) * 2, 0.18, s + 33)
    net2 = warp(1 - np.abs(fbm(h, w, 3, 9, 0.5, seed=s + 35) - 0.5) * 2, 0.1, s + 37)
    if kind == 'cloud':  # an emission nebula: glowing hydrogen, oxygen at the edge, dark lanes of dust
        dens = np.clip(base * 1.5 - 0.35 - r * 0.55, 0, 1) ** 1.3
        dust = np.clip(fbm(h, w, 6, 5, seed=s + 21) * 1.8 - 1.0, 0, 1) * (dens > 0.05)
        col = ramp(dens, [(0, (0.0, 0.0, 0.0)), (0.15, (0.45, 0.06, 0.12)), (0.45, (0.95, 0.32, 0.45)), (0.75, (1.0, 0.75, 0.78)), (1, (1, 0.95, 0.9))])
        teal = np.clip(dens * 2 - 0.2, 0, 1) * np.clip(0.6 - r, 0, 1)
        col += teal[..., None] * np.array([0.05, 0.4, 0.45])
        light = col * (0.25 + 0.75 * ridge[..., None] ** 1.5) * (1 - dust[..., None] * 0.85)
        alpha = np.clip(dens * 0.8 + dust * 0.6, 0, 0.7)
    elif kind == 'ring':  # a ring nebula: a hollow shell lit by the hot stars inside it
        shell = np.exp(-((r - 0.42 - (base - 0.5) * 0.25) ** 2) / 0.018)
        dens = np.clip(shell * (0.4 + base) * 1.2, 0, 1)
        col = ramp(dens, [(0, (0, 0, 0)), (0.3, (0.55, 0.05, 0.08)), (0.7, (0.95, 0.25, 0.22)), (1, (1, 0.7, 0.55))])
        light = col * (0.35 + 0.65 * ridge[..., None])
        alpha = np.clip(dens * 0.6, 0, 0.6)
    elif kind == 'shell':  # a supernova remnant: orange filaments over a blue synchrotron glow
        body = np.clip(1 - (r / (0.5 + (base - 0.5) * 0.25)) ** 2, 0, 1)
        fil = np.clip(net ** 14 * 1.6 + net2 ** 18 * 0.9, 0, 1) * body ** 0.6
        glow = body ** 1.5 * (0.25 + 0.35 * fbm(h, w, 5, 4, seed=s + 41))
        light = glow[..., None] * np.array([0.32, 0.5, 1.0]) + fil[..., None] * np.array([1.0, 0.52, 0.2])
        alpha = np.clip(body * 0.2 + fil * 0.3, 0, 0.55)
    elif kind == 'filaments':  # the cirrus of an old supernova: thin arcs of oxygen and hydrogen
        band = np.exp(-((r - 0.55 - (base - 0.5) * 0.35) ** 2) / 0.02)
        side = np.clip((u * 0.8 - v * 0.6 + 0.4) * 1.5, 0, 1)
        fil = np.clip(net ** 18 * 2.2 + net2 ** 24, 0, 1) * band * side
        tint = fbm(h, w, 3, 2, seed=s + 3)[..., None]
        light = fil[..., None] * (np.array([0.3, 0.9, 1.0]) * tint + np.array([1.0, 0.35, 0.42]) * (1 - tint)) * 1.3
        alpha = np.clip(fil * 0.3, 0, 0.45)
    else:  # 'lagoon': a broad pink cloud cut through by one dark lane
        dens = np.clip(base * 1.6 - 0.25 - r * 0.6, 0, 1) ** 1.1
        lane = np.exp(-((v - u * 0.35 + (detail - 0.5) * 0.4) ** 2) / 0.006)
        col = ramp(dens, [(0, (0, 0, 0)), (0.2, (0.7, 0.14, 0.32)), (0.55, (1.0, 0.55, 0.7)), (1, (1, 0.95, 0.92))])
        light = col * 1.5 * (0.45 + 0.55 * ridge[..., None]) * (1 - lane[..., None] * 0.9)
        alpha = np.clip(dens * 0.6 + lane * dens * 1.4, 0, 0.75)
    star = stars(h, w, 70, s + 40)[..., None] * np.array([0.9, 0.95, 1.0])
    mask = edge_mask(h, w, s + 50, inner=0.25, roughness=0.3)
    light = (light * 0.95 + star) * mask[..., None]
    return save(name, light, alpha * mask, size)


PROCEDURAL = {
    'orion-cloud': 'cloud',
    'rosette-ring': 'ring',
    'crab-shell': 'shell',
    'veil-filaments': 'filaments',
    'lagoon-lane': 'lagoon',
    'north-america': 'cloud',
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', required=True)
    ap.add_argument('--look', default='')
    ap.add_argument('--only', default='')
    a = ap.parse_args()
    os.makedirs(OUT, exist_ok=True)
    only = set(filter(None, a.only.split(',')))
    aspects = {}
    for name in PHOTOS:
        if not only or name in only:
            aspects[name] = photo(name, a.src, a.look)
    for name, kind in PROCEDURAL.items():
        if not only or name in only:
            aspects[name] = procedural(name, kind)
    meta_path = os.path.join(OUT, 'nebulae.json')
    meta = json.load(open(meta_path)) if os.path.exists(meta_path) else {}
    meta.update({k: round(v, 4) for k, v in aspects.items()})
    json.dump(meta, open(meta_path, 'w'), indent=1)


if __name__ == '__main__':
    main()
