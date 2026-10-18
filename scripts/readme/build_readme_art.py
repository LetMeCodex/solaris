"""
Builds the animated artwork for the README into docs/readme/.

GitHub shows SVGs as images: no web fonts, no scripts. So every word here is drawn as vector
paths from open-licence fonts (OFL, fetched into scripts/readme/.fonts/), the planets are wrapped
in the same real surface maps the site uses (embedded as data URIs), and all motion is SMIL.

    node scripts/readme/export_vela.mjs      (Vela's pixel frames, from the report's sprite code)
    python scripts/readme/build_readme_art.py

The clips (docs/readme/*.webp) are cut with ffmpeg from the launch film's captured shots.
"""
from __future__ import annotations

import base64
import io
import json
import math
import random
import urllib.request
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
OUT = ROOT / 'docs' / 'readme'
FONTS = HERE / '.fonts'
OUT.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------- palette (the site's own)
VOID = '#05040a'
STAR = '#f3e7d3'
ASH = '#ada6bc'
DUST = '#e0916a'
AMBER = '#f4cd72'
MINT = '#6dfcc0'
ICE = '#8fa8ff'

# ---------------------------------------------------------------- fonts → paths
GF = 'https://github.com/google/fonts/raw/main/ofl/'
FONT_FILES = {
    'Montserrat-VF.ttf': 'montserrat/Montserrat%5Bwght%5D.ttf',
    'InstrumentSerif-Italic.ttf': 'instrumentserif/InstrumentSerif-Italic.ttf',
    'JetBrainsMono-VF.ttf': 'jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf',
    'VT323-Regular.ttf': 'vt323/VT323-Regular.ttf',
}


def fetch_fonts() -> None:
    FONTS.mkdir(exist_ok=True)
    for name, url in FONT_FILES.items():
        if not (FONTS / name).exists():
            urllib.request.urlretrieve(GF + url, FONTS / name)


def num(v: float) -> str:
    s = f'{v:.1f}'
    return s[:-2] if s.endswith('.0') else s


class Face:
    def __init__(self, file: str, wght: float | None = None):
        f = TTFont(FONTS / file)
        if wght is not None and 'fvar' in f:
            f = instancer.instantiateVariableFont(f, {'wght': wght})
        self.font = f
        self.gs = f.getGlyphSet()
        self.cmap = f.getBestCmap()
        self.upm = f['head'].unitsPerEm
        self.hmtx = f['hmtx']

    def advances(self, text: str, size: float, track: float = 0) -> list[float]:
        s = size / self.upm
        return [self.hmtx[self.cmap.get(ord(c), self.cmap[ord('?')])][0] * s + track for c in text]

    def width(self, text: str, size: float, track: float = 0) -> float:
        return sum(self.advances(text, size, track)) - track

    def path(self, text: str, size: float, x: float, y: float, track: float = 0, anchor: str = 'start') -> tuple[str, float]:
        w = self.width(text, size, track)
        if anchor == 'middle':
            x -= w / 2
        elif anchor == 'end':
            x -= w
        s = size / self.upm
        d = []
        for c, adv in zip(text, self.advances(text, size, track)):
            g = self.cmap.get(ord(c))
            if g:
                pen = SVGPathPen(self.gs, ntos=num)
                self.gs[g].draw(TransformPen(pen, (s, 0, 0, -s, x, y)))
                d.append(pen.getCommands())
            x += adv
        return ''.join(d), w


fetch_fonts()
WORD = Face('Montserrat-VF.ttf', 200)
SANS = Face('Montserrat-VF.ttf', 500)
SERIF = Face('InstrumentSerif-Italic.ttf')
MONO = Face('JetBrainsMono-VF.ttf', 400)
PIXEL = Face('VT323-Regular.ttf')


def text(face: Face, s: str, size: float, x: float, y: float, fill: str, track: float = 0, anchor: str = 'start', extra: str = '') -> str:
    d, _ = face.path(s, size, x, y, track, anchor)
    return f'<path d="{d}" fill="{fill}"{extra}/>'


# ---------------------------------------------------------------- images
def data_uri(img: Image.Image, fmt: str = 'WEBP', q: int = 78) -> str:
    b = io.BytesIO()
    img.save(b, fmt, quality=q)
    mime = 'image/webp' if fmt == 'WEBP' else 'image/jpeg'
    return f'data:{mime};base64,' + base64.b64encode(b.getvalue()).decode()


THUMBS = ROOT / 'public' / 'textures' / 'thumbs'
MAPS = {
    'Sun': 'sun.webp', 'Mercury': 'mercury.webp', 'Venus': 'venus_atmosphere.webp', 'Earth': 'earth_daymap.webp',
    'Mars': 'mars.webp', 'Jupiter': 'jupiter.webp', 'Saturn': 'saturn.webp', 'Uranus': 'uranus.webp', 'Neptune': 'neptune.webp',
}


def map_uri(name: str, w: int = 128) -> str:
    im = Image.open(THUMBS / MAPS[name]).convert('RGB')
    return data_uri(im.resize((w, w // 2), Image.LANCZOS), q=80)


_uid = [0]


def uid(p: str) -> str:
    _uid[0] += 1
    return f'{p}{_uid[0]}'


def globe(name: str, cx: float, cy: float, r: float, light: float = 180, spin: float = 30, uri: str | None = None) -> str:
    """A real surface map wrapped into a disc, turning, shaded from the side the Sun is on."""
    c, s = uid('c'), uid('s')
    href = uri or map_uri(name)
    lx = 50 + math.cos(math.radians(light)) * 32
    ly = 50 - math.sin(math.radians(light)) * 32
    sun = name == 'Sun'
    shade = (
        f'<radialGradient id="{s}"><stop offset="0" stop-color="#fff4d8" stop-opacity="0.35"/><stop offset="0.65" stop-color="#ff9a3c" stop-opacity="0"/><stop offset="1" stop-color="#6a1400" stop-opacity="0.7"/></radialGradient>'
        if sun
        else f'<radialGradient id="{s}" cx="{lx}%" cy="{ly}%" r="85%"><stop offset="0" stop-color="#fff" stop-opacity="0.18"/><stop offset="0.36" stop-color="#000" stop-opacity="0"/><stop offset="0.64" stop-color="#000" stop-opacity="0.6"/><stop offset="0.86" stop-color="#000" stop-opacity="0.95"/></radialGradient>'
    )
    w = 4 * r
    ring = ''
    if name == 'Saturn':
        ring = (
            f'<ellipse cx="{num(cx)}" cy="{num(cy)}" rx="{num(r * 2.2)}" ry="{num(r * 0.55)}" fill="none" stroke="#e8d7b0" stroke-opacity="0.55" stroke-width="{num(r * 0.32)}" transform="rotate(-14 {num(cx)} {num(cy)})"/>'
        )
    front = ''
    if name == 'Saturn':
        # the near half of the ring passes in front of the planet
        k = uid('k')
        front = (
            f'<clipPath id="{k}"><rect x="{num(cx - r * 3)}" y="{num(cy)}" width="{num(r * 6)}" height="{num(r * 2)}" transform="rotate(-14 {num(cx)} {num(cy)})"/></clipPath>'
            f'<g clip-path="url(#{k})">{ring}</g>'
        )
    return (
        f'<defs><clipPath id="{c}"><circle cx="{num(cx)}" cy="{num(cy)}" r="{num(r)}"/></clipPath>{shade}</defs>'
        f'{ring}'
        f'<g clip-path="url(#{c})"><g>'
        f'<image href="{href}" x="{num(cx - 5 * r)}" y="{num(cy - r)}" width="{num(w)}" height="{num(2 * r)}" preserveAspectRatio="none"/>'
        f'<image href="{href}" x="{num(cx - r)}" y="{num(cy - r)}" width="{num(w)}" height="{num(2 * r)}" preserveAspectRatio="none"/>'
        f'<animateTransform attributeName="transform" type="translate" from="0 0" to="{num(w)} 0" dur="{spin}s" repeatCount="indefinite"/>'
        f'</g><circle cx="{num(cx)}" cy="{num(cy)}" r="{num(r)}" fill="url(#{s})"/></g>'
        f'{front}'
    )


def stars(n: int, w: int, h: int, seed: int, avoid: tuple[float, float, float, float] | None = None) -> str:
    rnd = random.Random(seed)
    out = []
    for _ in range(n):
        x, y = rnd.uniform(0, w), rnd.uniform(0, h)
        if avoid and avoid[0] < x < avoid[2] and avoid[1] < y < avoid[3]:
            continue
        r = rnd.choice([0.5, 0.6, 0.7, 0.8, 1.0, 1.2])
        col = rnd.choice([STAR, STAR, STAR, '#cdd8ff', '#ffd9b0'])
        a, b = rnd.uniform(0.2, 0.5), rnd.uniform(0.8, 1)
        out.append(
            f'<circle cx="{num(x)}" cy="{num(y)}" r="{r}" fill="{col}"><animate attributeName="opacity" values="{b:.2f};{a:.2f};{b:.2f}" dur="{rnd.uniform(2.4, 6):.1f}s" begin="-{rnd.uniform(0, 5):.1f}s" repeatCount="indefinite"/></circle>'
        )
    return ''.join(out)


def svg(w: int, h: int, body: str, title: str, desc: str, defs: str = '') -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-labelledby="t d">'
        f'<title id="t">{title}</title><desc id="d">{desc}</desc><defs>{defs}</defs>{body}</svg>'
    )


def write(name: str, content: str) -> None:
    (OUT / name).write_text(content, encoding='utf-8')
    print(f'{name:28s} {len(content.encode()) / 1024:7.1f} KB')


# ---------------------------------------------------------------- the journey of one photon
LIGHT_S_PER_AU = 499.004784
STOPS = [
    ('Sun', 0.0, None),
    ('Mercury', 0.387098, 'Everything, all at once'),
    ('Venus', 0.723332, 'A tour, in motion'),
    ('Earth', 1.000001, 'What is real'),
    ('Mars', 1.523679, 'How it works'),
    ('Jupiter', 5.2026, 'Meet Vela'),
    ('Saturn', 9.5549, 'The field report'),
    ('Uranus', 19.2184, 'Run it yourself'),
    ('Neptune', 30.110, 'Inside the code'),
    ('Sagittarius A*', None, 'Credits, at the edge of the map'),
]
RADII = {'Mercury': 2440, 'Venus': 6052, 'Earth': 6371, 'Mars': 3390, 'Jupiter': 69911, 'Saturn': 58232, 'Uranus': 25362, 'Neptune': 24622}


def light_time(au: float | None) -> str:
    if au is None:
        return 'T+27,000 years'
    t = round(au * LIGHT_S_PER_AU)
    return f'T+{t // 3600:02d}:{t % 3600 // 60:02d}:{t % 60:02d}'


def rail_x(au: float, x0: float, x1: float) -> float:
    """Light-time on a log scale, so Mercury and Neptune share one line."""
    k = math.log(1 + au / 0.25) / math.log(1 + 30.11 / 0.25)
    return x0 + (x1 - x0) * k


# ---------------------------------------------------------------- banner
def banner() -> None:
    W, H = 1280, 540
    sky = Image.open(ROOT / 'public' / 'report' / 'sky.webp').convert('RGB')
    sw, sh = sky.size
    band = sky.crop((int(sw * 0.25), int(sh * 0.5 - sh * 0.16), int(sw * 0.75), int(sh * 0.5 + sh * 0.16))).resize((1280, 420), Image.LANCZOS)
    band_uri = data_uri(band, 'JPEG', 72)
    sun_uri = data_uri(Image.open(ROOT / 'public' / 'textures' / '2k_sun.jpg').convert('RGB').resize((512, 256), Image.LANCZOS), 'JPEG', 80)

    defs = (
        '<radialGradient id="bg" cx="18%" cy="80%" r="95%"><stop offset="0" stop-color="#160c0a"/><stop offset="0.45" stop-color="#08060c"/><stop offset="1" stop-color="#040308"/></radialGradient>'
        '<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
        '<mask id="bandmask" maskUnits="userSpaceOnUse" x="-160" y="40" width="1600" height="420"><rect x="-160" y="40" width="1600" height="420" fill="url(#fade)"/></mask>'
        '<radialGradient id="corona"><stop offset="0" stop-color="#fff2d0" stop-opacity="0.95"/><stop offset="0.18" stop-color="#ffc56a" stop-opacity="0.55"/><stop offset="0.45" stop-color="#ff7a2a" stop-opacity="0.14"/><stop offset="1" stop-color="#ff5a1a" stop-opacity="0"/></radialGradient>'
        '<linearGradient id="word" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe2b8"/><stop offset="0.5" stop-color="#f3e7d3"/><stop offset="1" stop-color="#cfd8ff"/></linearGradient>'
        '<linearGradient id="tail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffd28a" stop-opacity="0"/><stop offset="1" stop-color="#fff6e0" stop-opacity="1"/></linearGradient>'
        '<radialGradient id="flash"><stop offset="0" stop-color="#fff1d0" stop-opacity="0.9"/><stop offset="1" stop-color="#ffb35c" stop-opacity="0"/></radialGradient>'
        '<clipPath id="frame"><rect width="1280" height="540" rx="18"/></clipPath>'
    )
    b = ['<g clip-path="url(#frame)">', f'<rect width="{W}" height="{H}" fill="url(#bg)"/>']
    # the Milky Way, from the same Gaia map the report sits on
    b.append(f'<g opacity="0.5" transform="rotate(-9 640 260)"><image href="{band_uri}" x="-160" y="40" width="1600" height="420" mask="url(#bandmask)" preserveAspectRatio="none"/></g>')
    b.append(stars(150, W, H, 7))

    # the Sun, rising out of the lower left corner, with its real photosphere
    scx, scy, sr = 70, 470, 120
    b.append(f'<circle cx="{scx}" cy="{scy}" r="{sr * 3.4}" fill="url(#corona)"><animate attributeName="r" values="{sr * 3.3};{sr * 3.6};{sr * 3.3}" dur="7s" repeatCount="indefinite"/></circle>')
    b.append(globe('Sun', scx, scy, sr, spin=90, uri=sun_uri))

    # the rail: one photon, Sun to Neptune, on a log scale of light-time
    x0, x1, ry = scx + sr + 30, 1196, 470
    b.append(f'<line x1="{x0}" y1="{ry}" x2="{x1}" y2="{ry}" stroke="{STAR}" stroke-opacity="0.16"/>')
    loop = 9.0
    for name, au, _ in STOPS[1:9]:
        x = rail_x(au, x0, x1)
        r = 3.2 + 2.6 * math.sqrt(RADII[name] / 6371) ** 0.9
        r = min(r, 15)
        k = (x - x0) / (x1 - x0) * 0.82  # the photon covers the rail in 82% of the loop
        b.append(f'<circle cx="{num(x)}" cy="{ry}" r="{num(r * 3.2)}" fill="url(#flash)" opacity="0"><animate attributeName="opacity" values="0;0;0.95;0;0" keyTimes="0;{max(0, k - 0.005):.3f};{k + 0.01:.3f};{min(0.99, k + 0.12):.3f};1" dur="{loop}s" repeatCount="indefinite"/></circle>')
        b.append(globe(name, x, ry, r, light=180, spin=18 + r))
        b.append(text(MONO, name.upper(), 9.5, x, ry + r + 22, STAR, 1.6, 'middle', ' opacity="0.72"'))
        b.append(text(MONO, light_time(au)[2:], 8.5, x, ry + r + 36, DUST, 0.6, 'middle', ' opacity="0.8"'))
    b.append(
        f'<g><rect x="-70" y="{ry - 1.2}" width="70" height="2.4" rx="1.2" fill="url(#tail)"/><circle cx="0" cy="{ry}" r="2.6" fill="#fff6e0"/>'
        f'<animateTransform attributeName="transform" type="translate" values="{x0} 0;{x1} 0;{x1} 0" keyTimes="0;0.82;1" dur="{loop}s" repeatCount="indefinite"/>'
        f'<animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.03;0.8;0.84;1" dur="{loop}s" repeatCount="indefinite"/></g>'
    )

    # the wordmark, each letter arriving in turn
    word = 'SOLARIS'
    size, track = 116, 64
    total = WORD.width(word, size, track)
    x = 640 - total / 2 + 18
    adv = WORD.advances(word, size, track)
    for i, (ch, a) in enumerate(zip(word, adv)):
        d, _ = WORD.path(ch, size, x, 238)
        delay = 0.25 + i * 0.11
        b.append(
            f'<path d="{d}" fill="url(#word)" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="{delay:.2f}s" dur="0.9s" fill="freeze"/>'
            f'<animateTransform attributeName="transform" type="translate" from="0 26" to="0 0" begin="{delay:.2f}s" dur="1.1s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" keyTimes="0;1"/></path>'
        )
        x += a
    # a hairline that draws itself under the word
    b.append(f'<line x1="452" y1="276" x2="828" y2="276" stroke="{DUST}" stroke-width="1" stroke-dasharray="376" stroke-dashoffset="376"><animate attributeName="stroke-dashoffset" from="376" to="0" begin="1.1s" dur="1.4s" fill="freeze" calcMode="spline" keySplines="0.7 0 0.2 1" keyTimes="0;1"/></line>')
    b.append(f'<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="1.4s" dur="1.2s" fill="freeze"/>')
    b.append(text(SERIF, 'The real Solar System, in your browser, set to now.', 31, 640, 322, STAR, 0, 'middle'))
    b.append(text(MONO, '478 WORLDS  ·  12,596 REAL STARS  ·  NASA JPL POSITIONS, THIS SECOND', 11, 640, 354, ASH, 2.2, 'middle'))
    b.append('</g>')
    # corner marks, like a plate in an observatory archive
    b.append(text(MONO, 'SOLARIS · LIGHT TRAVEL', 10, 40, 44, DUST, 2.4))
    b.append(text(MONO, 'J2000 ECLIPTIC · TDB', 10, 1240, 44, ASH, 2.4, 'end', ' opacity="0.7"'))
    for cx, cy in ((24, 24), (1256, 24), (1256, 516)):
        b.append(f'<path d="M{cx - 6} {cy}h12M{cx} {cy - 6}v12" stroke="{DUST}" stroke-opacity="0.6"/>')
    b.append(f'<rect x="0.5" y="0.5" width="1279" height="539" rx="18" fill="none" stroke="{STAR}" stroke-opacity="0.08"/>')
    b.append('</g>')
    write('banner.svg', svg(W, H, ''.join(b), 'SOLARIS', 'The real Solar System, in your browser, set to now. A photon leaves the Sun and lights each planet as it passes.', defs))


# ---------------------------------------------------------------- section headers: stops on the journey
def headers() -> None:
    W, H = 1280, 200
    for i, (name, au, title) in enumerate(STOPS[1:], start=1):
        defs = (
            '<linearGradient id="hbg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#08060d"/><stop offset="1" stop-color="#0d0910"/></linearGradient>'
            '<radialGradient id="halo"><stop offset="0" stop-color="#ffb070" stop-opacity="0.22"/><stop offset="1" stop-color="#ffb070" stop-opacity="0"/></radialGradient>'
            '<linearGradient id="lit" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffd28a" stop-opacity="0.15"/><stop offset="1" stop-color="#ffd28a" stop-opacity="0.9"/></linearGradient>'
            '<clipPath id="hf"><rect width="1280" height="200" rx="16"/></clipPath>'
            '<filter id="bhglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>'
        )
        b = ['<g clip-path="url(#hf)">', f'<rect width="{W}" height="{H}" fill="url(#hbg)"/>', stars(46, W, H, 100 + i)]
        # the world itself, on the right, lit from the Sun's side
        gx, gy, gr = 1150, 100, 62
        b.append(f'<circle cx="{gx}" cy="{gy}" r="{gr * 2.1}" fill="url(#halo)"/>')
        if name == 'Sagittarius A*':
            b.append(
                f'<g transform="rotate(-18 {gx} {gy})"><ellipse cx="{gx}" cy="{gy}" rx="{gr * 1.7}" ry="{gr * 0.42}" fill="none" stroke="#ff9a3c" stroke-width="22" stroke-opacity="0.5" filter="url(#bhglow)"/><ellipse cx="{gx}" cy="{gy}" rx="{gr * 1.7}" ry="{gr * 0.42}" fill="none" stroke="#ffb15a" stroke-width="9" stroke-opacity="0.7"/>'
                f'<ellipse cx="{gx}" cy="{gy}" rx="{gr * 1.7}" ry="{gr * 0.42}" fill="none" stroke="#fff0c8" stroke-width="2" stroke-dasharray="14 22"><animate attributeName="stroke-dashoffset" from="0" to="-72" dur="1.6s" repeatCount="indefinite"/></ellipse></g>'
                f'<circle cx="{gx}" cy="{gy}" r="{gr * 0.8}" fill="none" stroke="#ffcf8a" stroke-width="6" stroke-opacity="0.7" filter="url(#bhglow)"/><circle cx="{gx}" cy="{gy}" r="{gr * 0.78}" fill="none" stroke="#fff0c8" stroke-width="2" stroke-opacity="0.95"/>'
                f'<circle cx="{gx}" cy="{gy}" r="{gr * 0.72}" fill="#000"/>'
            )
        else:
            b.append(globe(name, gx, gy, gr if name != 'Saturn' else gr * 0.72, light=180, spin=40))
        # the stamp and the title
        b.append(text(MONO, light_time(au), 13, 56, 64, AMBER, 1.2))
        tw = MONO.width(light_time(au), 13, 1.2)
        b.append(text(MONO, ' ·  ' + name.upper(), 13, 56 + tw, 64, ASH, 2.4))
        b.append(f'<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="0.15s" dur="0.9s" fill="freeze"/>'
                 f'<animateTransform attributeName="transform" type="translate" from="-18 0" to="0 0" begin="0.15s" dur="1.1s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" keyTimes="0;1"/>'
                 + text(SERIF, title, 58, 52, 132, STAR) + '</g>')
        # the rail: every stop on the journey, the ones behind us lit
        x0, x1, ry = 56, 1010, 168
        xs = [x0] + [rail_x(a, x0 + 30, x1 - 60) for _, a, _ in STOPS[1:9]] + [x1]
        cur = xs[i]
        prev = xs[i - 1]
        b.append(f'<line x1="{x0}" y1="{ry}" x2="{x1}" y2="{ry}" stroke="{STAR}" stroke-opacity="0.12"/>')
        b.append(f'<line x1="{x0}" y1="{ry}" x2="{num(prev)}" y2="{ry}" stroke="#ffd28a" stroke-opacity="0.6" stroke-width="1.2"/>')
        b.append(
            f'<line x1="{num(prev)}" y1="{ry}" x2="{num(prev)}" y2="{ry}" stroke="#ffd28a" stroke-width="1.2"><animate attributeName="x2" from="{num(prev)}" to="{num(cur)}" begin="0.3s" dur="1.6s" fill="freeze" calcMode="spline" keySplines="0.6 0 0.2 1" keyTimes="0;1"/></line>'
        )
        for k, x in enumerate(xs):
            on = k < i
            b.append(f'<circle cx="{num(x)}" cy="{ry}" r="{2.2 if k else 4}" fill="{"#ffd28a" if on or k == 0 else "none"}" stroke="{STAR}" stroke-opacity="{0 if on or k == 0 else 0.35}"/>')
        b.append(
            f'<circle cx="{num(prev)}" cy="{ry}" r="3.2" fill="#fff6e0"><animate attributeName="cx" from="{num(prev)}" to="{num(cur)}" begin="0.3s" dur="1.6s" fill="freeze" calcMode="spline" keySplines="0.6 0 0.2 1" keyTimes="0;1"/></circle>'
            f'<circle cx="{num(cur)}" cy="{ry}" r="4" fill="none" stroke="#ffd28a" opacity="0"><animate attributeName="r" values="4;16" begin="1.9s;pulse{i}.end+1.2s" dur="1.6s" id="pulse{i}"/><animate attributeName="opacity" values="0.9;0" begin="1.9s;pulse{i}.end+1.2s" dur="1.6s"/></circle>'
        )
        b.append(text(MONO, f'{i:02d} / 09', 10, x1, ry - 14, ASH, 1.6, 'end', ' opacity="0.6"'))
        b.append(f'<rect x="0.5" y="0.5" width="1279" height="199" rx="16" fill="none" stroke="{STAR}" stroke-opacity="0.07"/></g>')
        slug = name.lower().replace(' ', '').replace('*', '')
        write(f'stop-{i:02d}-{slug}.svg', svg(W, H, ''.join(b), f'{light_time(au)} · {name}: {title}', f'Stop {i} of 9 on a photon\'s journey from the Sun: {name}.', defs))


# ---------------------------------------------------------------- numbers that roll in like an odometer
def numbers() -> None:
    W, H = 1280, 230
    items = [('478', 'WORLDS'), ('12,596', 'REAL STARS'), ('142', 'TESTS PASSING'), ('572', 'LINES FOR VELA'), ('23', 'LIVE FIGURES'), ('30', 'SOURCES, CREDITED')]
    size = 58
    dh = 70  # one digit's slot
    digit_d = {str(n): WORD.path(str(n), size, 0, 0)[0] for n in range(10)}
    dw = WORD.width('0', size) + 2
    cw = W / len(items)
    defs = '<clipPath id="nf"><rect width="1280" height="230" rx="16"/></clipPath>' + ''.join(f'<path id="g{n}" d="{d}"/>' for n, d in digit_d.items())
    b = ['<g clip-path="url(#nf)">', f'<rect width="{W}" height="{H}" fill="#07060b"/>', stars(40, W, H, 31)]
    col = 0
    for j, (v, label) in enumerate(items):
        cx = cw * j + cw / 2
        widths = [dw if ch.isdigit() else WORD.width(',', size) + 2 for ch in v]
        x = cx - sum(widths) / 2
        base_y = 118
        for ch, w in zip(v, widths):
            if ch.isdigit():
                t = int(ch)
                win = uid('w')
                b.append(f'<clipPath id="{win}"><rect x="{num(x - 2)}" y="{base_y - dh + 12}" width="{num(w + 4)}" height="{dh}"/></clipPath>')
                strip = ''.join(f'<use href="#g{n % 10}" x="{num(x)}" y="{base_y + k * dh}"/>' for k, n in enumerate(range(0, 20)))
                end = -(10 + t) * dh
                dur = 1.4 + col * 0.12
                b.append(
                    f'<g clip-path="url(#{win})"><g fill="{STAR}">{strip}'
                    f'<animateTransform attributeName="transform" type="translate" from="0 0" to="0 {end}" dur="{dur:.2f}s" begin="0.2s" fill="freeze" calcMode="spline" keySplines="0.2 0.7 0.1 1" keyTimes="0;1"/></g></g>'
                )
                col += 1
            else:
                b.append(text(WORD, ch, size, x, base_y, STAR))
            x += w
        b.append(text(MONO, label, 10.5, cx, 160, ASH, 2.2, 'middle'))
        b.append(f'<line x1="{num(cx - 14)}" y1="182" x2="{num(cx + 14)}" y2="182" stroke="{DUST}" stroke-opacity="0.7"/>')
        if j:
            b.append(f'<line x1="{num(cw * j)}" y1="56" x2="{num(cw * j)}" y2="176" stroke="{STAR}" stroke-opacity="0.07"/>')
    b.append(f'<rect x="0.5" y="0.5" width="1279" height="229" rx="16" fill="none" stroke="{STAR}" stroke-opacity="0.07"/></g>')
    write('numbers.svg', svg(W, H, ''.join(b), 'Solaris in numbers', '478 worlds, 12,596 real stars, 142 tests passing, 572 lines for Vela, 23 live figures, 30 sources credited.', defs))


# ---------------------------------------------------------------- Vela says hello
def vela() -> None:
    W, H = 1280, 300
    data = json.loads((HERE / 'vela.json').read_text())
    px = 8
    vx, vy = 120, 70

    def frame(name: str) -> str:
        return ''.join(f'<rect x="{x * px}" y="{y * px}" width="{px + 0.3}" height="{px + 0.3}" fill="{c}"/>' for x, y, c in data['frames'][name])

    # one 6-second loop: wave, wave, then look, blink, look
    seq = [('wave1', 0, 0.4), ('wave2', 0.4, 0.8), ('wave1', 0.8, 1.2), ('wave2', 1.2, 1.6), ('open', 1.6, 4.6), ('blink', 4.6, 4.75), ('open', 4.75, 6.0)]
    loop = 6.0
    frames = []
    for name in ('wave1', 'wave2', 'open', 'blink'):
        times = sorted({0.0, 1.0} | {round(s / loop, 4) for _, s, _ in seq} | {round(e / loop, 4) for _, _, e in seq})
        vals = []
        for t in times:
            tt = t * loop
            on = any(n == name and s <= tt < e for n, s, e in seq) or (t == 1.0 and seq[0][0] == name)
            vals.append('1' if on else '0')
        frames.append(f'<g opacity="{vals[0]}"><animate attributeName="opacity" values="{";".join(vals)}" keyTimes="{";".join(f"{t:.4f}" for t in times)}" dur="{loop}s" calcMode="discrete" repeatCount="indefinite"/>{frame(name)}</g>')

    defs = (
        '<radialGradient id="vglow"><stop offset="0" stop-color="#6dfcc0" stop-opacity="0.32"/><stop offset="1" stop-color="#6dfcc0" stop-opacity="0"/></radialGradient>'
        '<clipPath id="vf"><rect width="1280" height="300" rx="16"/></clipPath>'
    )
    b = ['<g clip-path="url(#vf)">', f'<rect width="{W}" height="{H}" fill="#06080a"/>', stars(50, W, H, 77)]
    b.append(f'<circle cx="{vx + 92}" cy="{vy + 96}" r="150" fill="url(#vglow)"/>')
    b.append(f'<g transform="translate({vx} {vy})"><g>{"".join(frames)}<animateTransform attributeName="transform" type="translate" values="0 0;0 -7;0 0" dur="2.6s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" keyTimes="0;0.5;1"/></g></g>')
    b.append(f'<ellipse cx="{vx + 92}" cy="{vy + 196}" rx="46" ry="5" fill="#6dfcc0" opacity="0.12"><animate attributeName="rx" values="46;38;46" dur="2.6s" repeatCount="indefinite"/></ellipse>')

    # the speech bubble, typed out
    bx, by, bw, bh = 370, 50, 840, 196
    b.append(f'<path d="M{bx + 18} {by}h{bw - 36}a18 18 0 0 1 18 18v{bh - 36}a18 18 0 0 1 -18 18h-{bw - 36}a18 18 0 0 1 -18 -18v-58l-26 -16l26 -6v-{bh - 36 - 80}a18 18 0 0 1 18 -18z" fill="#071512" fill-opacity="0.92" stroke="{MINT}" stroke-opacity="0.45"/>')
    b.append(f'<circle cx="{bx + 32}" cy="{by + 34}" r="3.5" fill="{MINT}"><animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite"/></circle>')
    b.append(text(MONO, 'VELA', 11, bx + 46, by + 38, MINT, 3))
    lines = [
        "Hi! I'm Vela. I live inside Solaris.",
        'I know where every planet is, this very second, and I have',
        "an hour of things to say. Just don't take me near the black hole.",
    ]
    t = 0.6
    ly = by + 86
    for k, line in enumerate(lines):
        d, w = PIXEL.path(line, 30, bx + 30, ly)
        clip = uid('tc')
        adv = PIXEL.advances(line, 30)
        xs, acc = [], 0.0
        for a in adv:
            acc += a
            xs.append(acc)
        steps = len(xs)
        dur = steps * 0.034
        vals = ';'.join(num(v) for v in [0] + xs)
        kt = ';'.join(f'{n / steps:.4f}' for n in range(steps + 1))
        b.append(
            f'<clipPath id="{clip}"><rect x="{bx + 30}" y="{ly - 26}" width="0" height="34"><animate attributeName="width" values="{vals}" keyTimes="{kt}" calcMode="discrete" begin="{t:.2f}s" dur="{dur:.2f}s" fill="freeze"/></rect></clipPath>'
            f'<path d="{d}" fill="#e2fff4" clip-path="url(#{clip})"/>'
        )
        t += dur + 0.25
        ly += 40
    # the caret, waiting after the last word
    last_w = PIXEL.width(lines[-1], 30)
    b.append(f'<rect x="{num(bx + 34 + last_w)}" y="{ly - 40 - 22}" width="11" height="24" fill="{MINT}" opacity="0"><animate attributeName="opacity" values="0;1;0" keyTimes="0;0.5;1" dur="1s" begin="{t:.2f}s" repeatCount="indefinite" calcMode="discrete"/></rect>')
    b.append(f'<rect x="0.5" y="0.5" width="1279" height="299" rx="16" fill="none" stroke="{MINT}" stroke-opacity="0.12"/></g>')
    write('vela.svg', svg(W, H, ''.join(b), 'Vela says hello', "Vela, Solaris's pixel guide: Hi! I'm Vela. I live inside Solaris. I know where every planet is, this very second, and I have an hour of things to say. Just don't take me near the black hole.", defs))


# ---------------------------------------------------------------- the pipeline, with a photon running through it
def pipeline() -> None:
    W, H = 1280, 290
    nodes = [
        ('NASA JPL', 'elements for 478', 'worlds, J2000'),
        ('TDB clock', 'UTC + 69.184 s,', 'days from J2000'),
        ('Kepler solver', 'Newton–Raphson', 'to 1e-12'),
        ('IAU rotation', 'real poles and', 'prime meridians'),
        ('Floating origin', 'the universe moves,', 'not the camera'),
        ('WebGL2', 'three.js, every', 'frame, live'),
    ]
    nw, gap = 176, 26
    x0 = (W - (nw * 6 + gap * 5)) / 2
    cy = 140
    loop = 7.0
    defs = (
        '<clipPath id="pf"><rect width="1280" height="290" rx="16"/></clipPath>'
        '<linearGradient id="ptail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffd28a" stop-opacity="0"/><stop offset="1" stop-color="#fff6e0"/></linearGradient>'
    )
    b = ['<g clip-path="url(#pf)">', f'<rect width="{W}" height="{H}" fill="#07060b"/>', stars(36, W, H, 55)]
    first = x0 + nw / 2
    last = x0 + 5 * (nw + gap) + nw / 2
    b.append(f'<line x1="{num(first)}" y1="{cy}" x2="{num(last)}" y2="{cy}" stroke="{DUST}" stroke-opacity="0.35" stroke-dasharray="3 5"><animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite"/></line>')
    for i, (t1, s1, s2) in enumerate(nodes):
        x = x0 + i * (nw + gap)
        k = (x + nw / 2 - first) / (last - first) * 0.85
        b.append(
            f'<rect x="{num(x)}" y="{cy - 62}" width="{nw}" height="124" rx="14" fill="#0d0a12" stroke="{STAR}" stroke-opacity="0.12"/>'
            f'<rect x="{num(x)}" y="{cy - 62}" width="{nw}" height="124" rx="14" fill="none" stroke="#ffd28a" stroke-width="1.4" opacity="0"><animate attributeName="opacity" values="0;0;1;0.15;0" keyTimes="0;{max(0, k - 0.02):.3f};{k + 0.01:.3f};{min(0.97, k + 0.14):.3f};1" dur="{loop}s" repeatCount="indefinite"/></rect>'
        )
        b.append(text(MONO, f'{i + 1:02d}', 10, x + 18, cy - 34, DUST, 1.5))
        b.append(text(SANS, t1, 16, x + 18, cy - 6, STAR))
        b.append(text(MONO, s1, 10.5, x + 18, cy + 22, ASH))
        b.append(text(MONO, s2, 10.5, x + 18, cy + 38, ASH))
    b.append(
        f'<g><rect x="-60" y="{cy - 1.2}" width="60" height="2.4" rx="1.2" fill="url(#ptail)"/><circle cx="0" cy="{cy}" r="3.4" fill="#fff6e0"/>'
        f'<animateTransform attributeName="transform" type="translate" values="{num(first)} 0;{num(last)} 0;{num(last)} 0" keyTimes="0;0.85;1" dur="{loop}s" repeatCount="indefinite"/>'
        f'<animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.03;0.83;0.87;1" dur="{loop}s" repeatCount="indefinite"/></g>'
    )
    b.append(text(MONO, 'EVERY FRAME, FOR EVERY WORLD', 10.5, 640, 252, ASH, 3, 'middle', ' opacity="0.75"'))
    b.append(f'<rect x="0.5" y="0.5" width="1279" height="289" rx="16" fill="none" stroke="{STAR}" stroke-opacity="0.07"/></g>')
    write('pipeline.svg', svg(W, H, ''.join(b), 'How a planet gets on screen', 'NASA JPL elements, a TDB clock, a Kepler solver, IAU rotation, a floating origin and WebGL2, every frame for every world.', defs))


# ---------------------------------------------------------------- the field report, as a card
def report_card() -> None:
    W, H = 1280, 360
    hero = Image.open(ROOT / 'public' / 'textures' / 'nebulae' / 'cosmic-cliffs.webp').convert('RGB')
    hw, hh = hero.size
    ch = int(hw * H / W)
    top = max(0, (hh - ch) // 2)
    crop = hero.crop((0, top, hw, top + ch)).resize((W, H), Image.LANCZOS)
    uri = data_uri(crop, 'JPEG', 74)
    defs = (
        '<linearGradient id="rshade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#05040a" stop-opacity="0.96"/><stop offset="0.55" stop-color="#05040a" stop-opacity="0.7"/><stop offset="1" stop-color="#05040a" stop-opacity="0.1"/></linearGradient>'
        '<clipPath id="rf"><rect width="1280" height="360" rx="18"/></clipPath>'
        '<clipPath id="eye"><circle cx="1150" cy="82" r="30"/></clipPath>'
    )
    b = ['<g clip-path="url(#rf)">', f'<g transform="translate(640 180)"><g><image href="{uri}" x="-640" y="-180" width="{W}" height="{H}" preserveAspectRatio="xMidYMid slice"/><animateTransform attributeName="transform" type="scale" values="1;1.08;1" dur="30s" repeatCount="indefinite"/></g></g>', f'<rect width="{W}" height="{H}" fill="url(#rshade)"/>']
    b.append(text(MONO, 'FIELD REPORT  ·  16 CHAPTERS  ·  23 LIVE FIGURES', 11, 64, 86, DUST, 2.6))
    b.append(text(SERIF, 'How Solaris was made', 74, 60, 176, STAR))
    b.append(text(SANS, 'Where every number and image comes from, how each part is drawn,', 17, 64, 222, ASH))
    b.append(text(SANS, 'what broke and how it was fixed. Explained by Vela.', 17, 64, 248, ASH))
    b.append(f'<g><rect x="64" y="282" width="236" height="44" rx="22" fill="none" stroke="{DUST}" stroke-opacity="0.8"/>' + text(MONO, 'READ THE REPORT  →', 12, 182, 309, STAR, 2.2, 'middle') + '</g>')
    # an eyepiece, the sky slewing past its reticle
    b.append(f'<circle cx="1150" cy="82" r="38" fill="#08060c" stroke="{DUST}" stroke-opacity="0.8"/>')
    rnd = random.Random(4)
    pts = ''.join(f'<circle cx="{num(rnd.uniform(1110, 1270))}" cy="{num(rnd.uniform(46, 118))}" r="{rnd.choice([0.7, 1, 1.3])}" fill="{STAR}"/>' for _ in range(36))
    b.append(f'<g clip-path="url(#eye)"><g>{pts}<g transform="translate(-80 0)">{pts}</g><animateTransform attributeName="transform" type="translate" from="0 0" to="-80 0" dur="9s" repeatCount="indefinite"/></g></g>')
    b.append(f'<path d="M1150 58v16M1150 90v16M1126 82h16M1158 82h16" stroke="{ICE}" stroke-width="1.2"/>')
    b.append(f'<g transform="translate(1150 82)"><path d="M-14 -8v-6h6M8 -14h6v6M14 8v6h-6M-8 14h-6v-6" stroke="{DUST}" stroke-width="1.6" fill="none"><animateTransform attributeName="transform" type="scale" values="1;0.75;1" dur="3s" repeatCount="indefinite"/></path></g>')
    b.append(f'<rect x="0.5" y="0.5" width="1279" height="359" rx="18" fill="none" stroke="{DUST}" stroke-opacity="0.25"/></g>')
    write('report.svg', svg(W, H, ''.join(b), 'The field report: how Solaris was made', 'A technical report in 16 chapters with 23 live figures, explained by Vela.', defs))


# ---------------------------------------------------------------- the two doors
def buttons() -> None:
    for name, label, sub, col in (('launch', 'LAUNCH SOLARIS', 'solarises.vercel.app', AMBER), ('read', 'READ THE FIELD REPORT', 'how it was made', DUST)):
        lw = MONO.width(label, 13, 2.6)
        W, H = int(lw + 120), 64
        defs = (
            f'<linearGradient id="sh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{col}" stop-opacity="0"/><stop offset="0.5" stop-color="{col}" stop-opacity="0.35"/><stop offset="1" stop-color="{col}" stop-opacity="0"/></linearGradient>'
            f'<clipPath id="bc"><rect x="1" y="1" width="{W - 2}" height="{H - 2}" rx="31"/></clipPath>'
        )
        b = [
            f'<rect x="1" y="1" width="{W - 2}" height="{H - 2}" rx="31" fill="#08060c"/>',
            f'<g clip-path="url(#bc)"><rect x="-120" y="0" width="120" height="{H}" fill="url(#sh)"><animate attributeName="x" values="-120;{W};{W}" keyTimes="0;0.45;1" dur="4.5s" repeatCount="indefinite"/></rect></g>',
            f'<rect x="1" y="1" width="{W - 2}" height="{H - 2}" rx="31" fill="none" stroke="{col}" stroke-opacity="0.75"/>',
            f'<circle cx="34" cy="32" r="5" fill="{col}"><animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/></circle>',
            f'<circle cx="34" cy="32" r="11" fill="none" stroke="{col}" stroke-opacity="0.4"/>',
            text(MONO, label, 13, 60, 30, STAR, 2.6),
            text(MONO, sub, 10, 60, 46, ASH, 1.2),
        ]
        write(f'button-{name}.svg', svg(W, H, ''.join(b), label.title(), sub, defs))


if __name__ == '__main__':
    banner()
    headers()
    numbers()
    vela()
    pipeline()
    report_card()
    buttons()
