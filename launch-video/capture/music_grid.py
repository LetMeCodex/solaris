"""Detailed grid of one track: every beat, the energy per beat, and novelty peaks (section changes)."""
import sys
import numpy as np
import librosa

f = sys.argv[1]
y, sr = librosa.load(f, sr=22050, mono=True)
hop = 512
onset = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
tempo, beats = librosa.beat.beat_track(onset_envelope=onset, sr=sr, hop_length=hop, start_bpm=120)
bt = librosa.frames_to_time(beats, sr=sr, hop_length=hop)
print("tempo", tempo, "n beats", len(bt))
print("beat interval median", np.median(np.diff(bt)).round(4))
rms = librosa.feature.rms(y=y, hop_length=hop)[0]
low = librosa.feature.rms(y=librosa.effects.preemphasis(y, coef=-0.97), hop_length=hop)[0]
for i, t in enumerate(bt):
    fr = beats[i]
    e = rms[fr:fr + 20].mean()
    o = onset[max(0, fr - 2):fr + 3].max()
    print(f"{i:3d} {t:6.2f}  e={'#' * int(e / rms.max() * 40):40s} on={o:5.1f}")
# Section boundaries from chroma/mfcc novelty
S = librosa.feature.mfcc(y=y, sr=sr, hop_length=hop, n_mfcc=13)
bounds = librosa.segment.agglomerative(S, 8)
print("sections:", np.round(librosa.frames_to_time(bounds, sr=sr, hop_length=hop), 2).tolist())
