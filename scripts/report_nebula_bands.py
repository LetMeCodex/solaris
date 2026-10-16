"""Split a nebula picture into brightness bands (as Solaris's 3D nebula stage does) for the report's figure.
python scripts/report_nebula_bands.py public/textures/nebulae/cosmic-cliffs.webp public/report/media/neb-band"""
import sys
import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGBA')
im.thumbnail((1000, 1000))
a = np.asarray(im).astype(np.float32) / 255.0
rgb, alpha = a[..., :3], a[..., 3]
lum = (0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]) * alpha
edges = np.quantile(lum[alpha > 0.02], np.linspace(0, 1, 8))
for k in range(7):
    lo, hi = edges[k], edges[k + 1]
    # soft band membership so layers overlap a little, like the shader's smooth thresholds
    w = np.clip((lum - lo) / max(1e-4, (hi - lo) * 0.35), 0, 1) * np.clip((hi + (hi - lo) * 0.35 - lum) / max(1e-4, (hi - lo) * 0.35), 0, 1)
    layer = np.dstack([rgb, alpha * w])
    Image.fromarray((layer * 255).astype(np.uint8), 'RGBA').save(f'{out}-{k}.webp', quality=80)
    print(k, f'{lo:.3f}–{hi:.3f}')
