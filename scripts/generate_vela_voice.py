"""
Generate Vela's voice lines with Kokoro-82M (Apache-2.0, https://huggingface.co/hexgrad/Kokoro-82M).

  pip install "kokoro>=0.9" soundfile        (needs PyTorch; ffmpeg on PATH)
  python scripts/generate_vela_voice.py [--voice af_heart] [--only id1,id2]

Reads src/companion/vela-lines.json and writes one MP3 per line to public/voice/vela/<id>.mp3,
plus manifest.json. Lines whose text did not change since the last run are skipped.

Delivery: Kokoro's natural rate (speed 1.0), then a light finishing chain so she sounds like a
person talking rather than a reader: long pauses between phrases are shortened (keeping a short
breath), loudness is levelled across lines (EBU R128), a touch of low-mid warmth is added and the
harsh top is softened, with tiny fades so lines never click in or out.
"""
import argparse, hashlib, json, os, re, subprocess, sys
import numpy as np
import soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LINES = os.path.join(ROOT, 'src', 'companion', 'vela-lines.json')
OUT = os.path.join(ROOT, 'public', 'voice', 'vela')


# Finishing chain (ffmpeg): shorten pauses over ~0.3 s to a 0.2 s breath, warm the low mids a
# little, soften the harsh top, level the loudness, fade the edges
FINISH = ','.join([
    'silenceremove=start_periods=1:start_threshold=-50dB:stop_periods=-1:stop_duration=0.3:stop_threshold=-48dB:stop_silence=0.2',
    'equalizer=f=220:t=q:w=1.0:g=1.5',
    'equalizer=f=6500:t=q:w=1.2:g=-1.5',
    'loudnorm=I=-17:TP=-2:LRA=8',
    'afade=t=in:d=0.015',
    'areverse,afade=t=in:d=0.06,areverse',
])


def safe(id_: str) -> str:
    return re.sub(r'[^A-Za-z0-9._-]', '_', id_)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--voice', default='af_heart')
    ap.add_argument('--speed', type=float, default=1.0)
    ap.add_argument('--only', default='')
    args = ap.parse_args()

    from kokoro import KPipeline  # imported late so --help works without it

    lines = json.load(open(LINES, encoding='utf-8'))
    os.makedirs(OUT, exist_ok=True)
    manifest_path = os.path.join(OUT, 'manifest.json')
    manifest = json.load(open(manifest_path, encoding='utf-8')) if os.path.exists(manifest_path) else {}
    only = set(filter(None, args.only.split(',')))
    pipe = KPipeline(lang_code=args.voice[0])

    for id_, text in lines.items():
        if only and id_ not in only:
            continue
        key = hashlib.sha1(f'{args.voice}|{args.speed}|{FINISH}|{text}'.encode('utf-8')).hexdigest()[:12]
        name = f'{safe(id_)}.mp3'
        if manifest.get(id_, {}).get('key') == key and os.path.exists(os.path.join(OUT, name)):
            continue
        chunks = []
        for _, _, audio in pipe(text, voice=args.voice, speed=args.speed):
            chunks.append(audio.numpy() if hasattr(audio, 'numpy') else np.asarray(audio))
            chunks.append(np.zeros(int(24000 * 0.12), dtype=np.float32))  # a breath between phrases
        wav = os.path.join(OUT, '_tmp.wav')
        sf.write(wav, np.concatenate(chunks), 24000)
        out = os.path.join(OUT, name)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-af', FINISH, '-ac', '1', '-ar', '24000',
                        '-b:a', '56k', out], check=True)
        os.remove(wav)
        dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out],
                                   capture_output=True, text=True, check=True).stdout.strip())
        manifest[id_] = {'file': name, 'key': key, 'seconds': round(dur, 2)}
        print(f'{id_:28s} {dur:5.1f}s', flush=True)

    # Lines that were removed: drop their recordings too
    if not only:
        for gone in [k for k in manifest if k not in lines]:
            f = os.path.join(OUT, manifest.pop(gone)['file'])
            if os.path.exists(f):
                os.remove(f)
            print('removed', gone)
    json.dump(manifest, open(manifest_path, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    print('manifest:', len(manifest), 'lines')


if __name__ == '__main__':
    sys.exit(main())
