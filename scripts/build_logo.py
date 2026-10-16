"""Draw the static Solaris icons (favicon.svg / .ico, apple-touch, PWA) from the logo geometry.

The geometry mirrors src/ui/brand/logo.ts. Run: python scripts/build_logo.py (needs Pillow).
"""
import math
from pathlib import Path
from PIL import Image, ImageDraw

INK = '#dcab76'
NIGHT = '#0e0e0f'
OUTER = (50, 50, 45.7)
INNER = (52.6, 49.4, 33.9)
STROKE = 1.6
SUN = (44.6, 50, 17.4)
STAR = (74.5, 50, 7.1, 2.3)
W_OUT = (-138, 5.0, 26)
W_IN = (75.6, 4.9, 1.5, 15)
GAP = 2.4
PUB = Path(__file__).resolve().parent.parent / 'public'


def at(o, a):
    return o[0] + o[2] * math.cos(math.radians(a)), o[1] + o[2] * math.sin(math.radians(a))


def gap_deg(o, r):
    return math.degrees(math.asin(min(0.9, (r + GAP) / o[2])))


def orbit_path(o, a, r):
    g = gap_deg(o, r)
    p = lambda d: '%.3f %.3f' % at(o, d)
    return f'M {p(a + g)} A {o[2]} {o[2]} 0 1 1 {p(a - g + 360)}'


def star_pts(scale=1.0):
    cx, cy, R, r = STAR
    out = []
    for i in range(16):
        a = math.radians(-90 + i * 22.5)
        rr = r if i % 2 else (R if i % 4 == 0 else R * 0.62)
        rr *= scale
        out.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return out


def svg():
    p = at(OUTER, W_OUT[0])
    q = at(INNER, W_IN[0])
    star = ' '.join('%.3f,%.3f' % s for s in star_pts())
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Solaris: the Sun inside two orbits, a world on each, a star beside it (src/ui/brand/logo.ts) -->
  <style>
    .o {{ animation: o linear infinite; }}
    .s {{ animation: s 3.2s ease-in-out infinite; transform-origin: {STAR[0]}px {STAR[1]}px; }}
    @keyframes o {{ to {{ transform: rotate(-360deg); }} }}
    @keyframes s {{ 0%, 100% {{ transform: scale(0.8); }} 50% {{ transform: scale(1.08) rotate(22.5deg); }} }}
    @media (prefers-reduced-motion: reduce) {{ .o, .s {{ animation: none; }} }}
  </style>
  <rect width="100" height="100" rx="22" fill="{NIGHT}"/>
  <g transform="translate(13 13) scale(0.74)">
  <g fill="none" stroke="{INK}" stroke-width="{STROKE * 1.6}" stroke-linecap="round">
    <g class="o" style="transform-origin: {OUTER[0]}px {OUTER[1]}px; animation-duration: {W_OUT[2]}s">
      <path d="{orbit_path(OUTER, W_OUT[0], W_OUT[1] * 1.2)}"/>
      <circle cx="{p[0]:.3f}" cy="{p[1]:.3f}" r="{W_OUT[1] * 1.2}" fill="{INK}" stroke="none"/>
    </g>
    <g class="o" style="transform-origin: {INNER[0]}px {INNER[1]}px; animation-duration: {W_IN[3]}s">
      <path d="{orbit_path(INNER, W_IN[0], W_IN[1] * 1.2)}"/>
      <circle cx="{q[0]:.3f}" cy="{q[1]:.3f}" r="{W_IN[1] * 1.2 - W_IN[2]}" stroke-width="{W_IN[2] * 1.6}"/>
    </g>
  </g>
  <circle cx="{SUN[0]}" cy="{SUN[1]}" r="{SUN[2]}" fill="{INK}"/>
  <polygon class="s" points="{star}" fill="{INK}"/>
  </g>
</svg>
'''


def png(size, tile=True, pad=None, maskable=False):
    """Supersampled raster of the still mark; `pad` shrinks it inside the tile (maskable icons)."""
    if pad is None:
        pad = (0.2 if maskable else 0.13 if size >= 40 else 0.04) if tile else 0.0
    S = size * 8
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if tile:
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=0 if maskable else 0.22 * S, fill=NIGHT)
    k = S / 100 * (1 - 2 * pad)
    off = S * pad
    X = lambda v: off + v * k
    small = size < 40
    lw = (STROKE * (2.6 if small else 1.6)) * k
    out_r = W_OUT[1] * (1.5 if small else 1.2)
    in_r = W_IN[1] * (1.4 if small else 1.2)

    def orbit(o, a, r):
        g = gap_deg(o, r)
        box = [X(o[0] - o[2]), X(o[1] - o[2]), X(o[0] + o[2]), X(o[1] + o[2])]
        d.arc(box, a + g, a - g + 360, fill=INK, width=max(1, round(lw)))

    orbit(OUTER, W_OUT[0], out_r)
    orbit(INNER, W_IN[0], in_r)
    circ = lambda cx, cy, r, **kw: d.ellipse([X(cx - r), X(cy - r), X(cx + r), X(cy + r)], **kw)
    circ(*SUN, fill=INK)
    p = at(OUTER, W_OUT[0])
    circ(p[0], p[1], out_r, fill=INK)
    q = at(INNER, W_IN[0])
    iw = W_IN[2] * (2.4 if small else 1.6) * k
    circ(q[0], q[1], in_r, outline=INK, width=max(1, round(iw)), fill=NIGHT if tile else None)
    d.polygon([(X(x), X(y)) for x, y in star_pts(1.3 if small else 1.0)], fill=INK)
    return img.resize((size, size), Image.LANCZOS)


if __name__ == '__main__':
    (PUB / 'favicon.svg').write_text(svg(), encoding='utf-8')
    png(180).save(PUB / 'apple-touch-icon.png')
    png(192).save(PUB / 'icon-192.png')
    png(512).save(PUB / 'icon-512.png')
    png(512, maskable=True).save(PUB / 'icon-maskable-512.png')
    # Each size drawn on its own, so the 16 px one gets its bolder lines
    sizes = [16, 32, 48, 64, 256]
    png(256).save(PUB / 'favicon.ico', sizes=[(n, n) for n in sizes], append_images=[png(n) for n in sizes[:-1]])
    print('icons written')
