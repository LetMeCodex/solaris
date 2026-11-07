"""Tempo, beat grid, and energy curve of each Solaris track (to choose and cut the second film)."""
import sys, glob, os
import numpy as np
import librosa

files = sys.argv[1:] or sorted(glob.glob(r"C:\Users\anish jha\.gemini\antigravity\scratch\solaris\public\music\*.mp3"))
for f in files:
    y, sr = librosa.load(f, sr=22050, mono=True)
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
    bt = librosa.frames_to_time(beats, sr=sr)
    rms = librosa.feature.rms(y=y, hop_length=sr // 2)[0]  # half-second energy
    curve = (rms / rms.max() * 9).round().astype(int)
    onset = librosa.onset.onset_strength(y=y, sr=sr)
    # the biggest hits: onset peaks well above the median
    pk = librosa.util.peak_pick(onset, pre_max=20, post_max=20, pre_avg=40, post_avg=40, delta=onset.std() * 2.5, wait=40)
    hits = librosa.frames_to_time(pk, sr=sr)
    print(f"\n{os.path.basename(f)}  tempo={float(np.atleast_1d(tempo)[0]):.1f}  first beats={np.round(bt[:6], 2).tolist()}")
    print("  energy/0.5s:", "".join(str(c) for c in curve))
    print("  hits:", np.round(hits, 2).tolist()[:24])
