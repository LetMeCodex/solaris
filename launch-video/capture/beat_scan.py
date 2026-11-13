"""Tempo, first downbeat and energy curve of a track, with numpy only (librosa's numba needs an
older numpy than is installed). Usage: python capture/beat_scan.py track.mp3 [...]"""
import subprocess, sys, os
import numpy as np

SR = 22050
HOP = 256


def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def onset_env(x):
    n = 1024
    frames = 1 + (len(x) - n) // HOP
    win = np.hanning(n)
    prev = None
    env = np.zeros(frames)
    for i in range(frames):
        S = np.log1p(40 * np.abs(np.fft.rfft(x[i * HOP:i * HOP + n] * win)))
        if prev is not None:
            env[i] = np.maximum(S - prev, 0).sum()
        prev = S
    return env


for f in sys.argv[1:]:
    x = load(f)
    env = onset_env(x)
    env = env - np.convolve(env, np.ones(40) / 40, 'same')
    env = np.maximum(env, 0)
    fps = SR / HOP
    ac = np.correlate(env, env, 'full')[len(env) - 1:]
    lo, hi = int(fps * 60 / 180), int(fps * 60 / 70)
    lag = lo + int(np.argmax(ac[lo:hi]))
    bpm = 60 * fps / lag
    # phase: the offset whose comb catches the most onset energy
    best = max(range(lag), key=lambda p: env[p::lag].sum())
    first = best / fps
    rms = np.array([np.sqrt(np.mean(x[i:i + SR // 2] ** 2)) for i in range(0, len(x) - SR // 2, SR // 2)])
    curve = ''.join(str(int(round(v / rms.max() * 9))) for v in rms)
    # the strongest hits
    idx = np.argsort(env)[::-1]
    hits = []
    for i in idx:
        t = i / fps
        if all(abs(t - h) > 1.5 for h in hits):
            hits.append(t)
        if len(hits) >= 10:
            break
    print(f'{os.path.basename(f)}  bpm={bpm:.1f}  beat={60 / bpm:.4f}s  first={first:.3f}s  dur={len(x) / SR:.1f}s')
    print('  energy/0.5s:', curve)
    print('  hits:', sorted(round(h, 2) for h in hits))
