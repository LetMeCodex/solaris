"""Extend Helios Overture by repeating a 4-bar phrase on the beat grid, for the inserted Skies act.
python capture/extend_music.py <in.mp3> <out.mp3>"""
import subprocess, sys, numpy as np, soundfile as sf, tempfile, os

DOWNBEAT, BAR = 16.37, 0.6275 * 4
AT, FROM, BARS = 11, 7, 4          # insert at bar 11 a copy of bars 7..10
src, dst = sys.argv[1], sys.argv[2]
tmp = os.path.join(tempfile.gettempdir(), 'helios_src.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ar', '48000', '-ac', '2', tmp], check=True)
x, sr = sf.read(tmp)
s = lambda t: int(round(t * sr))
# Cut on the beats the music actually plays (its tempo drifts a little from the grid)
import librosa
yb, srb = librosa.load(src, sr=22050)
_, beats = librosa.beat.beat_track(y=yb, sr=srb, units='time')
onsets = librosa.onset.onset_detect(y=yb, sr=srb, units='time', backtrack=True)
def real(n):
    g = DOWNBEAT + n * BAR
    # the tracked beat sits a steady fraction of a beat late; keep that phase, take the beat nearest the grid
    near = beats[np.argmin(np.abs(beats - g - 0.6 * BAR / 4))] - 0.6 * BAR / 4
    return near
ca, cb, cc = real(FROM), real(FROM + BARS), real(AT)
print(f'real bar {FROM}: {ca:.3f}  bar {FROM + BARS}: {cb:.3f}  bar {AT}: {cc:.3f}')
cut, a, b = s(cc), s(ca), s(cb)
X = int(0.04 * sr)  # 40 ms equal-power crossfades at each join
fade = np.sin(np.linspace(0, np.pi / 2, X))[:, None]

def join(p, q):
    # p ends, q begins: overlap the last X of p with the first X of q
    mid = p[-X:] * fade[::-1] + q[:X] * fade
    return np.concatenate([p[:-X], mid, q[X:]])

head = x[: cut + X // 2]
loop = x[a - X // 2: b + X // 2]
tail = x[cut - X // 2:]
y = join(join(head, loop), tail)
print(f'SKY_SHIFT = {(b - a) / sr:.4f}; inserted {(b - a) / sr:.3f} s at {cut / sr:.3f} s; {len(x) / sr:.2f} -> {len(y) / sr:.2f} s')
out = os.path.join(tempfile.gettempdir(), 'helios_ext.wav')
sf.write(out, y, sr)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', out, '-b:a', '320k', dst], check=True)
