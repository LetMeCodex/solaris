"""
Draws the smooth rainbow behind the back cover's barcode, red at the left and violet at the right.
The dark lines are not in this picture: they are drawn crisply over it from a line list.

    python scripts/book/build_spectrum.py
"""
from pathlib import Path

from PIL import Image

OUT = Path(__file__).resolve().parents[2] / 'public' / 'book' / 'spectrum.webp'
SIZE = 512
STOPS = [
    (0.00, (205, 52, 16)), (0.16, (240, 78, 26)), (0.30, (255, 104, 36)), (0.40, (255, 136, 46)), (0.46, (255, 196, 96)), (0.52, (255, 248, 224)),
    (0.57, (255, 252, 236)), (0.63, (176, 244, 176)), (0.72, (64, 214, 132)), (0.86, (34, 176, 112)), (1.00, (14, 112, 84)),
]


def colour(t):
    for (a, ca), (b, cb) in zip(STOPS, STOPS[1:]):
        if t <= b:
            k = (t - a) / (b - a)
            return tuple(round(x + (y - x) * k) for x, y in zip(ca, cb))
    return STOPS[-1][1]


img = Image.new('RGB', (SIZE, SIZE))
for x in range(SIZE):
    c = colour(x / (SIZE - 1))
    for y in range(SIZE):
        img.putpixel((x, y), c)
img.save(OUT, quality=92)
print(OUT, OUT.stat().st_size)
