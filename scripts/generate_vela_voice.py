"""
Record Vela's lines in her own voice with Chatterbox (MIT, https://github.com/resemble-ai/chatterbox).

  pip install chatterbox-tts                 (needs PyTorch with CUDA; ffmpeg on PATH)
  python scripts/generate_vela_voice.py --ref path/to/vela_reference.wav [--only id1,id2] [--force]

The reference recording is not part of the repository (it is a real person's voice, used with their
permission); pass it with --ref.

Reads src/companion/vela-lines.json and writes one MP3 per line to public/voice/vela/<id>.mp3,
plus manifest.json. Lines whose text did not change since the last run are skipped.

How a line is made:
  1. Speech. Lines with sound tags ([laugh] [chuckle] [sigh] [gasp] [sniff] [crying] [fear]
     [whispering] [surprised] [happy] [clear throat]) go through Chatterbox Turbo, which performs the
     tags as real sounds: her giggle, a gasp, a sniffle. Plain lines go through the full Chatterbox
     model, conditioned on the reference with a low CFG so it keeps her pacing.
  2. Voice conversion onto the reference (ChatterboxVC), so every line carries the same timbre.
  3. A finishing chain: long pauses trimmed to a breath, loudness levelled (EBU R128), soft fades.
A take whose length is far off what the text needs (a skipped or babbled phrase) is re-recorded
with another seed.
"""
import argparse, hashlib, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LINES = os.path.join(ROOT, 'src', 'companion', 'vela-lines.json')
OUT = os.path.join(ROOT, 'public', 'voice', 'vela')
VERSION = 'cb4'
TAG = re.compile(r'\[[a-z ]+\]')

FINISH = ','.join([
    'silenceremove=start_periods=1:start_threshold=-50dB:stop_periods=-1:stop_duration=0.45:stop_threshold=-48dB:stop_silence=0.35',
    'loudnorm=I=-17:TP=-2:LRA=9',
    'afade=t=in:d=0.015',
    'areverse,afade=t=in:d=0.08,areverse',
])


def safe(id_: str) -> str:
    return re.sub(r'[^A-Za-z0-9._-]', '_', id_)


def spoken_seconds(text: str) -> float:
    """Roughly how long the words take to say (about 14 characters a second)."""
    return len(TAG.sub('', text).strip()) / 14.0


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--ref', required=True, help='reference recording of her voice (wav)')
    ap.add_argument('--only', default='')
    ap.add_argument('--force', action='store_true')
    ap.add_argument('--lines', default=LINES, help='lines to record (default: the website companion)')
    ap.add_argument('--out', default=OUT, help='where the recordings go')
    args = ap.parse_args()
    lines_path, out_dir = args.lines, args.out

    import torch, torchaudio, soundfile as sf
    from chatterbox.tts import ChatterboxTTS
    from chatterbox.tts_turbo import ChatterboxTurboTTS
    from chatterbox.vc import ChatterboxVC

    ref_key = hashlib.sha1(open(args.ref, 'rb').read()).hexdigest()[:8]
    lines = json.load(open(lines_path, encoding='utf-8'))
    os.makedirs(out_dir, exist_ok=True)
    manifest_path = os.path.join(out_dir, 'manifest.json')
    manifest = json.load(open(manifest_path, encoding='utf-8')) if os.path.exists(manifest_path) else {}
    only = set(filter(None, args.only.split(',')))
    dev = 'cuda' if torch.cuda.is_available() else 'cpu'
    tts = turbo = None
    vc = ChatterboxVC.from_pretrained(device=dev)
    vc.set_target_voice(args.ref)  # analyse her voice once, not for every line
    tmp = os.path.join(out_dir, '_tmp')

    def save_manifest():
        json.dump(manifest, open(manifest_path, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)

    # Plain lines first, then the ones with sounds, so only one speech model is on the GPU at a time
    order = sorted(lines.items(), key=lambda kv: bool(TAG.search(kv[1])))
    for n, (id_, text) in enumerate(order):
        if only and id_ not in only:
            continue
        key = hashlib.sha1(f'{VERSION}|{ref_key}|{FINISH}|{text}'.encode('utf-8')).hexdigest()[:12]
        name = f'{safe(id_)}.mp3'
        if not args.force and manifest.get(id_, {}).get('key') == key and os.path.exists(os.path.join(out_dir, name)):
            continue
        tagged = bool(TAG.search(text))
        want = spoken_seconds(text)
        best = None
        for attempt in range(4):
            torch.manual_seed(11 + attempt * 101)
            with torch.inference_mode():
                if tagged:
                    if turbo is None:
                        tts = None
                        torch.cuda.empty_cache()
                        turbo = ChatterboxTurboTTS.from_pretrained(device=dev)
                        turbo.prepare_conditionals(args.ref)
                    wav, sr = turbo.generate(text, temperature=0.8), turbo.sr
                else:
                    if tts is None:
                        tts = ChatterboxTTS.from_pretrained(device=dev)
                        tts.prepare_conditionals(args.ref, exaggeration=0.5)
                    wav, sr = tts.generate(text, exaggeration=0.5, cfg_weight=0.3, temperature=0.7), tts.sr
                torchaudio.save(tmp + '_a.wav', wav.cpu(), sr)
                conv = vc.generate(tmp + '_a.wav')
            torchaudio.save(tmp + '_b.wav', conv.cpu(), vc.sr)
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp + '_b.wav', '-af', FINISH, '-ac', '1', '-ar', '24000',
                            tmp + '_c.wav'], check=True)
            dur = sf.info(tmp + '_c.wav').duration
            # Sounds (laughs, sobs) add time, so tagged lines get more room
            ratio = dur / max(0.6, want)
            ok = 0.55 < ratio < (2.6 if tagged else 1.9)
            score = abs(ratio - (1.25 if tagged else 1.0))
            if best is None or score < best[0]:
                best = (score, dur)
                os.replace(tmp + '_c.wav', tmp + '_best.wav')
            if ok:
                break
            print(f'  retake {id_} ({dur:.1f}s for ~{want:.1f}s)', flush=True)
        out = os.path.join(out_dir, name)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp + '_best.wav', '-ac', '1', '-b:a', '64k', out], check=True)
        for f in ('_a.wav', '_b.wav', '_c.wav', '_best.wav'):
            if os.path.exists(tmp + f):
                os.remove(tmp + f)
        manifest[id_] = {'file': name, 'key': key, 'seconds': round(best[1], 2)}
        print(f'[{n + 1}/{len(lines)}] {id_:28s} {best[1]:5.1f}s {"T" if tagged else ""}', flush=True)
        if n % 10 == 0:
            save_manifest()

    # Lines that were removed: drop their recordings too
    if not only:
        for gone in [k for k in manifest if k not in lines]:
            f = os.path.join(out_dir, manifest.pop(gone)['file'])
            if os.path.exists(f):
                os.remove(f)
            print('removed', gone)
    save_manifest()
    print('manifest:', len(manifest), 'lines')


if __name__ == '__main__':
    sys.exit(main())
