"""
Cuts the book's footage from the launch film's 1080p shots, into public/book/clips/.

Space is mostly black, so each shot is measured and its exposure stretched for the press: the
blacks are set just above the floor and the brightest detail is brought up to full. Each clip
plays forwards then backwards, so a panel can loop for ever without a jump.

    python scripts/book/build_clips.py
"""
import subprocess
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'launch-video' / 'out' / 'shots'
OUT = ROOT / 'public' / 'book' / 'clips'
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1024, 576
SECONDS = 3.2


def sample(path: Path) -> np.ndarray:
    """Eight small frames across the first few seconds, as luminance."""
    raw = subprocess.run(
        ['ffmpeg', '-v', 'error', '-t', str(SECONDS), '-i', str(path), '-vf', 'fps=2.5,scale=256:144', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(raw, 'uint8').astype('float32')


for src in sorted(SRC.glob('*.mp4')):
    if src.stem == 'probe':
        continue
    y = sample(src)
    lo = max(0.0, float(np.percentile(y, 3)) - 2)
    hi = max(lo + 24, float(np.percentile(y, 99.6)))
    # lift the mid-tones of mostly black frames, so the subject reads
    gamma = 0.62 if np.median(y) < 28 else 0.8
    lut = f"clip(pow(max(val-{lo:.1f},0)/{hi - lo:.1f},{gamma})*255,0,255)"
    vf = (
        f"[0:v]trim=0:{SECONDS},setpts=PTS-STARTPTS,fps=12,scale={W}:{H}:flags=lanczos,format=rgb24,"
        f"lutrgb=r='{lut}':g='{lut}':b='{lut}',eq=saturation=1.5,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,format=yuv420p[v]"
    )
    out = OUT / f'{src.stem}.mp4'
    subprocess.run(
        ['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-filter_complex', vf, '-map', '[v]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-movflags', '+faststart', '-an', str(out)],
        check=True,
    )
    print(f'{src.stem:18s} lo {lo:5.1f} hi {hi:5.1f} gamma {gamma}  {out.stat().st_size / 1024:6.0f} KB')
