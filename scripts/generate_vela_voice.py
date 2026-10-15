"""
Generate Vela's voice lines with Kokoro-82M (Apache-2.0, https://huggingface.co/hexgrad/Kokoro-82M).

  pip install "kokoro>=0.9" soundfile        (needs PyTorch; ffmpeg on PATH)
  python scripts/generate_vela_voice.py [--voice af_heart] [--only id1,id2]

Reads src/companion/vela-lines.json and writes one MP3 per line to public/voice/vela/<id>.mp3,
plus manifest.json. Lines whose text did not change since the last run are skipped.
"""
import argparse, hashlib, json, os, re, subprocess, sys
import numpy as np
import soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LINES = os.path.join(ROOT, 'src', 'companion', 'vela-lines.json')
OUT = os.path.join(ROOT, 'public', 'voice', 'vela')


def safe(id_: str) -> str:
    return re.sub(r'[^A-Za-z0-9._-]', '_', id_)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--voice', default='af_heart')
    ap.add_argument('--speed', type=float, default=0.94)
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
        key = hashlib.sha1(f'{args.voice}|{args.speed}|{text}'.encode('utf-8')).hexdigest()[:12]
        name = f'{safe(id_)}.mp3'
        if manifest.get(id_, {}).get('key') == key and os.path.exists(os.path.join(OUT, name)):
            continue
        chunks = []
        for _, _, audio in pipe(text, voice=args.voice, speed=args.speed):
            chunks.append(audio.numpy() if hasattr(audio, 'numpy') else np.asarray(audio))
            chunks.append(np.zeros(int(24000 * 0.16), dtype=np.float32))  # a breath between phrases
        wav = os.path.join(OUT, '_tmp.wav')
        sf.write(wav, np.concatenate(chunks), 24000)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-ar', '24000', '-b:a', '48k',
                        os.path.join(OUT, name)], check=True)
        os.remove(wav)
        dur = sum(len(c) for c in chunks) / 24000
        manifest[id_] = {'file': name, 'key': key, 'seconds': round(dur, 2)}
        print(f'{id_:28s} {dur:5.1f}s', flush=True)

    json.dump(manifest, open(manifest_path, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    print('manifest:', len(manifest), 'lines')


if __name__ == '__main__':
    sys.exit(main())
