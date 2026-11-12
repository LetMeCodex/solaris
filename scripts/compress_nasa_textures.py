"""
Compress the NASA Eyes models' textures in place: every PNG and JPEG a .gltf refers to becomes a
WebP (at most 2048 px on its longer side), and the .gltf files are rewritten to point at them.

  python scripts/compress_nasa_textures.py [public/nasa/models]

The photographic textures were most of the models' weight (about 410 of 700 MB, as PNG and JPEG,
which git cannot compress further). As WebP they are a fraction of that and look the same at the
sizes the spacecraft are seen at: colour maps at quality 82, normal maps (whose small errors
show as bumps) at 90; an alpha channel is kept only where it is not fully opaque. three.js's
GLTFLoader reads WebP images directly; geometry (.bin) is left as it is (git's own compression
already takes it to about a third).

Safe to run again: images already converted are skipped, and the originals are deleted only
after every .gltf that used them points at the new file.
"""
import json, os, sys
from concurrent.futures import ProcessPoolExecutor
from urllib.parse import quote, unquote

from PIL import Image

MAX_SIDE = 2048


def scan(root: str):
    """Every .gltf, and for each PNG/JPEG it uses: the roles it plays (normal map or not)."""
    gltfs = []
    roles: dict[str, set] = {}
    for d, _, files in os.walk(root):
        for f in files:
            if not f.lower().endswith('.gltf'):
                continue
            path = os.path.join(d, f)
            g = json.load(open(path, encoding='utf-8'))
            gltfs.append(path)
            normal_tex = {m['normalTexture']['index'] for m in g.get('materials', []) if 'normalTexture' in m}
            images = g.get('images', [])
            for ti, t in enumerate(g.get('textures', [])):
                src = t.get('source')
                if src is None or src >= len(images):
                    continue
                uri = images[src].get('uri', '')
                if uri and not uri.startswith('data:') and uri.lower().endswith(('.png', '.jpg', '.jpeg')):
                    p = os.path.normpath(os.path.join(d, unquote(uri)))
                    roles.setdefault(p, set()).add('normal' if ti in normal_tex else 'colour')
            for img in images:
                uri = img.get('uri', '')
                if uri and not uri.startswith('data:') and uri.lower().endswith(('.png', '.jpg', '.jpeg')):
                    roles.setdefault(os.path.normpath(os.path.join(d, unquote(uri))), set())
    return gltfs, roles


def target_for(src: str, taken: set) -> str:
    base, ext = os.path.splitext(src)
    out = base + '.webp'
    if out in taken:
        out = f'{base}_{ext[1:].lower()}.webp'
    taken.add(out)
    return out


def convert(job):
    src, dst, normal = job
    if not os.path.exists(src):
        return src, dst, 0, 0, 'missing'
    if os.path.exists(dst):
        return src, dst, os.path.getsize(src), os.path.getsize(dst), 'exists'
    img = Image.open(src)
    img.load()
    has_alpha = img.mode in ('RGBA', 'LA', 'PA') or (img.mode == 'P' and 'transparency' in img.info)
    img = img.convert('RGBA' if has_alpha else 'RGB')
    if has_alpha and img.getchannel('A').getextrema() == (255, 255):
        img = img.convert('RGB')
    w, h = img.size
    if max(w, h) > MAX_SIDE:
        k = MAX_SIDE / max(w, h)
        img = img.resize((max(1, round(w * k)), max(1, round(h * k))), Image.LANCZOS)
    img.save(dst, 'WEBP', quality=90 if normal else 82, method=5)
    return src, dst, os.path.getsize(src), os.path.getsize(dst), 'ok'


def main() -> None:
    root = sys.argv[1] if len(sys.argv) > 1 else os.path.join('public', 'nasa', 'models')
    gltfs, roles = scan(root)
    taken: set = set()
    plan = {src: target_for(src, taken) for src in sorted(roles)}
    jobs = [(src, dst, 'normal' in roles[src]) for src, dst in plan.items()]
    before = after = 0
    done = {}
    with ProcessPoolExecutor() as pool:
        for src, dst, a, b, state in pool.map(convert, jobs, chunksize=4):
            if state == 'missing':
                print('missing (left as is):', os.path.relpath(src, root))
                continue
            before += a
            after += b
            done[src] = dst
    # Point every .gltf at the new files
    for path in gltfs:
        d = os.path.dirname(path)
        g = json.load(open(path, encoding='utf-8'))
        changed = False
        for img in g.get('images', []):
            uri = img.get('uri', '')
            if not uri or uri.startswith('data:'):
                continue
            p = os.path.normpath(os.path.join(d, unquote(uri)))
            if p in done:
                img['uri'] = quote(os.path.relpath(done[p], d).replace(os.sep, '/'), safe='/')
                img['mimeType'] = 'image/webp'
                changed = True
        if changed:
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(g, f, separators=(',', ':'))
    # Only now let the originals go
    for src in done:
        if os.path.exists(src):
            os.remove(src)
    print(f'{len(done)} textures: {before / 1e6:.1f} MB -> {after / 1e6:.1f} MB; {len(gltfs)} .gltf files updated')


if __name__ == '__main__':
    main()
