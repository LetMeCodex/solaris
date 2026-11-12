"""
The cockpit's recorded sounds: cut, levelled and looped from real recordings into public/audio/jet/.

  python scripts/build_cockpit_sounds.py --src <folder with the downloads>
  python scripts/build_cockpit_sounds.py --betty      # Betty's warnings (Chatterbox, see below)

The recordings are from Pixabay (Pixabay Content License: free to use in an app, no attribution
needed; most first published on Freesound). Download them into one folder under these names:

  gasmask.mp3     "Gas Mask breath"                 pixabay.com/sound-effects/film-special-effects-gas-mask-breath-69348/
  mask046709.mp3  "046709_Mask Breathing Sound"     pixabay.com/sound-effects/people-046709-mask-breathing-sound-73978/
  grunt1.mp3      "Male Exertion Grunts"            pixabay.com/sound-effects/people-male-exertion-grunts-352689/
  grunt2.mp3      "Male Exertion Grunts 02"         pixabay.com/sound-effects/people-male-exertion-grunts-02-352731/
  f22idle.mp3     "Idle F-22 Jet Plane"             pixabay.com/sound-effects/film-special-effects-idle-f-22-jet-plane-33685/
  derrick.mp3     "Starting of jet engine"          pixabay.com/sound-effects/film-special-effects-starting-of-jet-engine-286108/
  atmos.mp3       "Airplane atmos"                  pixabay.com/sound-effects/technology-airplane-atmos-22955/
  valve.mp3       "Pneumatic Valve Toggle Kit"      pixabay.com/sound-effects/household-pneumatic-valve-toggle-kit-pressure-release-amp-shut-off-503718/
  airhiss.mp3     "Air Hiss"                        pixabay.com/sound-effects/film-special-effects-air-hiss-102406/

What is made (src/flight/JetAudio.ts plays them):
  breath_calm_1..10  one whole breath each through a mask, in and out, with the valve's puff
                     (cut by hand from "Gas Mask breath")
  breath_deep_1..5   heavier, slower breaths in a sealed mask (after a hard pull, on full power)
  strain_1..4        the grunt of the anti-G straining manoeuvre, one each
  gsuit_in, gsuit_out  the suit's valve filling the bladders; the vent as they empty
  engine_idle        a seamless loop of an idling jet engine (crossfaded end into start)
  engine_high        a seamless loop of the same kind of engine wound up near full power
  canopy             a seamless loop of the airframe's rumble through a sealed cabin
Breaths and grunts are levelled to the same loudness, so the player's random pick and small
level changes are the only differences between them.

Betty (--betty): the cockpit's voice warnings ("Pull up, pull up", "Altitude, altitude",
"Warning, overheat"), said by Chatterbox's stock voice (Chatterbox Turbo's, resampled a little
higher, so she is not the controller), converted onto that voice and checked by Whisper, like the
radio lines (scripts/generate_radio_voice.py; needs the same packages).
"""
import argparse, os, subprocess, sys
import numpy as np
import soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'audio', 'jet')
SR = 32000


def load(path: str, sr: int = SR) -> np.ndarray:
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def save(x: np.ndarray, name: str, lufs: float, sr: int = SR, kbps: int = 64) -> None:
    tmp = os.path.join(OUT, '_tmp.wav')
    sf.write(tmp, x.astype(np.float32), sr)
    # Two-pass-free loudness: measure, then gain (keeps short one-shots exact)
    stats = subprocess.run(['ffmpeg', '-v', 'info', '-i', tmp, '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                           capture_output=True, text=True).stderr
    i_lufs = float(stats.rsplit('I:', 1)[1].split('LUFS')[0])
    gain = lufs - i_lufs
    peak = float(np.max(np.abs(x))) * 10 ** (gain / 20)
    if peak > 0.89:  # never clip: a little under full scale
        gain -= 20 * np.log10(peak / 0.89)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', f'volume={gain:.2f}dB', '-ac', '1', '-ar', str(sr),
                    '-c:a', 'libmp3lame', '-b:a', f'{kbps}k', os.path.join(OUT, name + '.mp3')], check=True)
    os.remove(tmp)
    print(f'{name:16s} {len(x) / sr:5.2f}s  {i_lufs:6.1f} -> {i_lufs + gain:6.1f} LUFS', flush=True)


def fade(x: np.ndarray, a: float, b: float, sr: int = SR) -> np.ndarray:
    x = x.copy()
    na, nb = int(a * sr), int(b * sr)
    if na:
        x[:na] *= np.sin(np.linspace(0, np.pi / 2, na)) ** 2
    if nb:
        x[-nb:] *= np.cos(np.linspace(0, np.pi / 2, nb)) ** 2
    return x


def seamless(x: np.ndarray, overlap: float, sr: int = SR) -> np.ndarray:
    """A loop whose end runs into its start: the last `overlap` s crossfaded (equal power) over the first."""
    n = int(overlap * sr)
    t = np.linspace(0, np.pi / 2, n)
    head = x[:n] * np.sin(t) + x[-n:] * np.cos(t)
    return np.concatenate([head, x[n:-n]])


GAS_BREATHS = [(1.0, 4.1), (5.5, 8.6), (10.6, 13.5), (14.5, 17.6), (18.9, 21.7), (22.5, 25.4), (26.2, 29.2),
               (29.9, 33.3), (34.3, 37.2), (38.9, 41.2)]
DEEP_BREATHS = [(0.0, 2.75), (3.15, 5.85), (6.6, 9.8), (10.05, 12.65), (13.25, 15.8)]
GRUNTS = {'grunt1.mp3': [(0.08, 1.0), (1.15, 1.8)], 'grunt2.mp3': [(0.08, 0.95), (1.05, 1.9)]}


def build(src: str) -> None:
    os.makedirs(OUT, exist_ok=True)
    s = lambda name: os.path.join(src, name)
    for old in [f for f in os.listdir(OUT) if f.startswith(('breath_', 'strain_'))]:
        os.remove(os.path.join(OUT, old))

    # --- Breaths (24 kHz is plenty)
    bsr = 24000
    gas = load(s('gasmask.mp3'), bsr)
    # (cut by hand: the room between its breaths is too busy for a detector; each runs from just
    # before the inhale to the end of the exhale's puff)
    for k, (a, b) in enumerate(GAS_BREATHS, 1):
        save(fade(gas[int(a * bsr):int(b * bsr)], 0.08, 0.3, bsr), f'breath_calm_{k}', -24, bsr, 48)
    deep = load(s('mask046709.mp3'), bsr)
    for k, (a, b) in enumerate(DEEP_BREATHS, 1):
        save(fade(deep[int(a * bsr):int(b * bsr)], 0.05, 0.3, bsr), f'breath_deep_{k}', -24, bsr, 48)

    # --- Straining grunts: two in each file
    k = 0
    for f, cuts in GRUNTS.items():
        x = load(s(f), bsr)
        for a, b in cuts:
            k += 1
            save(fade(x[int(a * bsr):int(b * bsr)], 0.01, 0.12, bsr), f'strain_{k}', -22, bsr, 48)

    # --- G-suit: the valve's two bursts of air in; the long hiss out
    v = load(s('valve.mp3'))
    gin = np.concatenate([fade(v[int(2.05 * SR):int(2.62 * SR)], 0.01, 0.12), np.zeros(int(0.12 * SR)),
                          fade(v[int(3.08 * SR):int(3.85 * SR)], 0.01, 0.2)])
    save(gin, 'gsuit_in', -24)
    save(fade(load(s('airhiss.mp3')), 0.01, 0.4), 'gsuit_out', -26)

    # --- Loops (crossfaded end into start; levelled)
    idle = load(s('f22idle.mp3'))[int(0.5 * SR):int(18.8 * SR)]
    save(seamless(idle, 1.5), 'engine_idle', -20, kbps=96)
    high = load(s('derrick.mp3'))[int(30 * SR):int(58 * SR)]
    save(seamless(high, 2.0), 'engine_high', -20, kbps=96)
    cab = load(s('atmos.mp3'))[int(10 * SR):int(40 * SR)]
    save(seamless(cab, 2.0), 'canopy', -22, kbps=80)


BETTY = {
    'betty_pullup': 'Pull up. Pull up.',
    'betty_altitude': 'Altitude. Altitude.',
    'betty_overheat': 'Warning. Overheat.',
}


def betty() -> None:
    """Betty, in Chatterbox's stock (Turbo) voice nudged higher; flat and clear."""
    import re, torch, torchaudio, whisper
    from chatterbox.tts import ChatterboxTTS
    from chatterbox.tts_turbo import ChatterboxTurboTTS
    from chatterbox.vc import ChatterboxVC
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from generate_radio_voice import compare
    dev = 'cuda' if torch.cuda.is_available() else 'cpu'
    tmp = os.path.join(ROOT, 'scripts', '.radio_tmp')
    os.makedirs(tmp, exist_ok=True)
    ref = os.path.join(ROOT, 'scripts', 'radio_refs', 'betty.flac')
    if not os.path.exists(ref):
        turbo = ChatterboxTurboTTS.from_pretrained(device=dev)
        torch.manual_seed(5)
        w = turbo.generate('Warning. Engine fire, left. Caution. Fuel low. Altitude. Pull up. '
                           'Warning. Bingo fuel. Caution. Hydraulic pressure.', temperature=0.6)
        torchaudio.save(os.path.join(tmp, 'betty_ref.wav'), w.cpu(), turbo.sr)
        k = 1.06
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(tmp, 'betty_ref.wav'), '-af',
                        f'asetrate={turbo.sr}*{k},aresample=24000,atempo={1 / k:.4f},loudnorm=I=-20:TP=-2',
                        '-ac', '1', ref], check=True)
        del turbo
        torch.cuda.empty_cache()
    tts = ChatterboxTTS.from_pretrained(device=dev)
    tts.prepare_conditionals(ref, exaggeration=0.25)
    vc = ChatterboxVC(tts.s3gen, dev, ref_dict=tts.conds.gen)
    asr = whisper.load_model('base', device='cpu')
    for name, text in BETTY.items():
        for attempt in range(6):
            torch.manual_seed(31 + attempt)
            with torch.inference_mode():
                w = tts.generate(text, exaggeration=0.25, cfg_weight=0.6, temperature=0.5)
                torchaudio.save(os.path.join(tmp, 'a.wav'), w.cpu(), tts.sr)
                conv = vc.generate(os.path.join(tmp, 'a.wav'))
            torchaudio.save(os.path.join(tmp, 'b.wav'), conv.cpu(), vc.sr)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(tmp, 'b.wav'), '-af',
                            'silenceremove=start_periods=1:start_threshold=-45dB,areverse,'
                            'silenceremove=start_periods=1:start_threshold=-45dB,areverse,'
                            'loudnorm=I=-18:TP=-2,afade=t=in:d=0.01', '-ac', '1', '-ar', '24000',
                            os.path.join(tmp, 'c.wav')], check=True)
            heard = asr.transcribe(os.path.join(tmp, 'c.wav'), language='en', fp16=False)['text']
            missing, extra = compare(text, heard)
            print(f'  {name} take {attempt + 1}: missing {missing:.2f} extra {extra:.2f} | {heard.strip()}', flush=True)
            if missing == 0 and extra == 0:
                break
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(tmp, 'c.wav'), '-c:a', 'libmp3lame', '-b:a', '48k',
                        os.path.join(OUT, name + '.mp3')], check=True)
    for f in ('a.wav', 'b.wav', 'c.wav', 'betty_ref.wav'):
        if os.path.exists(os.path.join(tmp, f)):
            os.remove(os.path.join(tmp, f))


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', help='folder with the downloaded recordings')
    ap.add_argument('--betty', action='store_true')
    a = ap.parse_args()
    if a.src:
        build(a.src)
    if a.betty:
        betty()
    if not (a.src or a.betty):
        ap.print_help()
