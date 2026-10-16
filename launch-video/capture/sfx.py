"""Synthesise the film's sound design (no samples): riser, impact, whoosh, shimmer, tick."""
import numpy as np, soundfile as sf, os, sys

SR = 48000
OUT = sys.argv[1] if len(sys.argv) > 1 else 'public/audio/sfx'
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(d * SR)) / SR


def lowpass(x, cut):
    # one-pole, run twice for a softer slope; cut may vary per sample
    a = np.exp(-2 * np.pi * np.broadcast_to(cut, x.shape) / SR)
    y = np.zeros_like(x)
    for _ in range(2):
        acc = 0.0
        for i in range(len(x)):
            acc = (1 - a[i]) * x[i] + a[i] * acc
            y[i] = acc
        x = y.copy()
    return y


def reverb(x, decay=2.2, mix=0.35):
    n = int(decay * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir = lowpass(ir, 5000.0)
    wet = np.pad(np.convolve(x, ir), (0, 1))[: len(x) + n]
    wet /= np.max(np.abs(wet)) + 1e-9
    out = np.pad(x, (0, n)) * (1 - mix) + wet * mix * np.max(np.abs(x))
    return out


def stereo(x, width=0.0):
    d = int(0.011 * SR * width)
    l, r = x, np.pad(x, (d, 0))[: len(x)] if d else x
    return np.stack([l, r], 1)


def save(name, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.89
    sf.write(os.path.join(OUT, name), x, SR)
    print(name, f'{len(x) / SR:.2f}s')


# Riser: noise opening up + a rising tone, 3.2 s, ends exactly at the hit
d = 3.2; tt = t(d); k = (tt / d) ** 2.2
noise = rng.standard_normal(len(tt))
riser = lowpass(noise, 300 + 9000 * k) * k
tone = np.sin(2 * np.pi * np.cumsum(110 + 660 * k ** 1.5) / SR) * 0.35 * k
save('riser.wav', stereo(riser * 0.8 + tone, 1))

# Impact: sub drop + a body thump + bright air, long tail
d = 4.0; tt = t(d)
sub = np.sin(2 * np.pi * np.cumsum(70 * np.exp(-tt * 1.6) + 32) / SR) * np.exp(-tt * 1.1)
thump = lowpass(rng.standard_normal(len(tt)), 900.0) * np.exp(-tt * 18) * 2.5
air = lowpass(rng.standard_normal(len(tt)), 7000.0) * np.exp(-tt * 3.5) * 0.25
imp = reverb(sub * 1.2 + thump + air, 2.6, 0.3)[: int(4 * SR)]
save('impact.wav', stereo(imp, 1))

# Whoosh: a band of noise sweeping past
d = 1.6; tt = t(d); env = np.sin(np.pi * np.clip(tt / 1.2, 0, 1)) ** 2
w = lowpass(rng.standard_normal(len(tt)), 400 + 5000 * env) * env
save('whoosh.wav', stereo(w, 1))

# Shimmer: bell-like partials for the lockup
d = 5.0; tt = t(d)
sh = sum(np.sin(2 * np.pi * f * tt + p) * a for f, p, a in [(880, 0, 1), (1318.5, 1, 0.6), (1760, 2, 0.4), (2637, 0.5, 0.25)])
sh *= np.exp(-tt * 0.9) * (1 - np.exp(-tt * 30)) * (0.75 + 0.25 * np.sin(2 * np.pi * 5.5 * tt))
save('shimmer.wav', stereo(reverb(sh, 3.0, 0.5)[: int(5 * SR)], 1))

# Tick: a soft high click for the light-clock
d = 0.4; tt = t(d)
tk = np.sin(2 * np.pi * 3200 * tt) * np.exp(-tt * 70) + lowpass(rng.standard_normal(len(tt)), 6000.0) * np.exp(-tt * 120) * 0.3
save('tick.wav', stereo(tk, 0))
