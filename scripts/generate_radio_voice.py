"""
The radio voices: every line in scripts/radio_lines.json said by its speaker, in its mood, with
Chatterbox (MIT, https://github.com/resemble-ai/chatterbox) and stored DRY: the radio's crackle,
the band-limiting and the helmet are added live, in src/flight/audio/RadioChain.ts.

  python scripts/generate_radio_voice.py                     # makes what is missing or changed
  python scripts/generate_radio_voice.py --only body.Mars    # ids starting with this
  python scripts/generate_radio_voice.py --redo              # everything again
  python scripts/generate_radio_voice.py --ref pilot=me.wav  # a speaker in your own voice

Needs Chatterbox (pip install chatterbox-tts; PyTorch with CUDA), openai-whisper (the check),
ffmpeg on the path. The models come from Hugging Face (ResembleAI/chatterbox, chatterbox-turbo).

The voices. Each speaker has a reference recording in scripts/radio_refs/<speaker>.flac. They are
made here, once, from Chatterbox's own stock voices (no real person's voice is copied): the pilot
is the stock voice of Chatterbox, the controller that of Chatterbox Turbo, and the wingman and
mission control are the pilot's voice resampled up and down (pitch and formants moved together:
a smaller, younger throat; a bigger, older one), so the four never sound alike. `--ref
speaker=file.wav` swaps one for a recording of your own (10-20 s, one voice, no music).

How a line is made:
  1. Speech, conditioned on the speaker's reference. Lines with sound tags ([laugh] [chuckle]
     [sigh] [gasp] [groan] [fear] ...) go through Chatterbox Turbo, which performs the tags as
     real sounds; plain lines through Chatterbox, with the mood's exaggeration and pacing.
  2. Voice conversion onto the reference (ChatterboxVC): every line in the same throat.
  3. The check: Whisper transcribes the take back. Missing or extra words (a skipped phrase, a
     babbled ending, a tag read out as a word), or a length far off what the words need, and the
     line is made again with another seed (up to 5 times; the best take is kept).
  4. Finishing: pauses longer than 0.6 s shortened, silence trimmed, loudness levelled (EBU R128,
     -19 LUFS), soft fades; 24 kHz mono MP3 into public/voice/radio/, and manifest.json.
A line whose text, mood and voice did not change since the last run is skipped.
"""
import argparse, difflib, gc, hashlib, json, os, re, subprocess, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LINES = os.path.join(ROOT, 'scripts', 'radio_lines.json')
OUT = os.path.join(ROOT, 'public', 'voice', 'radio')
REFS = os.path.join(ROOT, 'scripts', 'radio_refs')
TMP = os.path.join(ROOT, 'scripts', '.radio_tmp')
VERSION = 'cb1'
TAG = re.compile(r'\[[a-z ]+\]')
SR_OUT = 24000

# What the stock voices say to make the references: ordinary radio talk, ~12 s, so the voice
# conversion learns a speaker talking the way they will talk
REF_TEXT = {
    'pilot': ["Solaris One-One, airborne, passing two thousand for flight level three-five-zero.",
              "Okay, fuel's good, oxygen's good. We'll call you level. Thanks, see you on the other side."],
    'wing': ["Two's up. Visual on lead, tally the field, rejoining on your left wing now.",
             "Man, look at that sky. Okay, okay, I'm in position. Two's ready when you are."],
    'control': ["Solaris One-One, radar contact. Climb and maintain flight level three-five-zero.",
                "Traffic, two o'clock, ten miles, opposite direction. Contact departure, good day."],
    'mission': ["Solaris, this is mission control. We have you on telemetry, all systems nominal.",
                "Take your time out there. Every word is a little slower to reach us now. We're with you."],
}

FINISH = ','.join([
    # pauses: a breath, not a gap
    'silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.06:'
    'stop_periods=-1:stop_duration=0.6:stop_threshold=-46dB:stop_silence=0.4',
    'areverse,silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.12,areverse',
    'highpass=f=70',
    'loudnorm=I=-19:TP=-2:LRA=9',
    'afade=t=in:d=0.012',
    'areverse,afade=t=in:d=0.06,areverse',
])

FILLERS = {'uh', 'um', 'mm', 'mmm', 'hmm', 'hnn', 'oh', 'ah', 'huh', 'woo', 'whoa', 'ha', 'hah', 'okay', 'ok'}
ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split()
TENS = 'x x twenty thirty forty fifty sixty seventy eighty ninety'.split()


def say_number(n: int) -> str:
    if n < 20:
        return ONES[n]
    if n < 100:
        return TENS[n // 10] + ('' if n % 10 == 0 else ' ' + ONES[n % 10])
    if n < 1000:
        return ONES[n // 100] + ' hundred' + ('' if n % 100 == 0 else ' and ' + say_number(n % 100))
    if n < 1_000_000:
        return say_number(n // 1000) + ' thousand' + ('' if n % 1000 == 0 else ' ' + say_number(n % 1000))
    return ' '.join(ONES[int(c)] for c in str(n))


def words(text: str, digits_one_by_one: bool = False) -> list[str]:
    """Lower-case words, tags dropped, numbers spelt out, the little noises left out."""
    t = TAG.sub(' ', text).lower().replace('-', ' ').replace(',', '')
    t = re.sub(r'\d+', lambda m: ' '.join(ONES[int(c)] for c in m.group()) if digits_one_by_one else say_number(int(m.group())), t)
    t = t.replace('’', "'").replace('g-', 'g ')
    ws = re.findall(r"[a-z']+", t)
    return [w.strip("'") for w in ws if w.strip("'") and w.strip("'") not in FILLERS]


def compare(want: str, heard: str) -> tuple[float, float]:
    """(missing, extra): the share of the script's words not heard, and of heard words not in it."""
    a = words(want)
    best = (1.0, 1.0)
    for one_by_one in (False, True):
        b = words(heard, one_by_one)
        sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
        hit = sum(m.size for m in sm.get_matching_blocks())
        r = (1 - hit / max(1, len(a)), (len(b) - hit) / max(1, len(a)))
        if sum(r) < sum(best):
            best = r
    return best


def spoken_seconds(text: str) -> float:
    """Roughly how long the words take to say, ~15 characters a second on the radio."""
    return len(TAG.sub('', text).strip()) / 15.0


def _run(cmd: list[str]) -> subprocess.CompletedProcess:
    """Runs a tool, trying again a few times: on a busy Windows machine a process can fail to start
    at all (0xC0000142) through no fault of its own."""
    for attempt in range(5):
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode == 0:
            return r
        time.sleep(2 + 3 * attempt)
    raise subprocess.CalledProcessError(r.returncode, cmd, r.stdout, r.stderr)


def ff(args: list[str]) -> None:
    _run(['ffmpeg', '-y', '-loglevel', 'error', *args])


def duration(path: str) -> float:
    out = _run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path]).stdout.strip()
    return float(out)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--only', default='', help='ids starting with this')
    ap.add_argument('--redo', action='store_true', help='make every line again')
    ap.add_argument('--ref', action='append', default=[], help='speaker=recording.wav: that speaker in your voice')
    ap.add_argument('--new-refs', action='store_true', help='make the stock references again')
    a = ap.parse_args()

    import torch, torchaudio, whisper
    from chatterbox.tts import ChatterboxTTS
    from chatterbox.tts_turbo import ChatterboxTurboTTS
    from chatterbox.vc import ChatterboxVC

    spec = json.load(open(LINES, encoding='utf-8'))
    dev = 'cuda' if torch.cuda.is_available() else 'cpu'
    for d in (OUT, REFS, TMP):
        os.makedirs(d, exist_ok=True)

    # Only one speech model on a 6 GB card at a time
    models: dict[str, object] = {}

    def model(kind: str):
        if kind not in models:
            for k in list(models):
                del models[k]
            gc.collect()
            torch.cuda.empty_cache()
            models[kind] = (ChatterboxTTS if kind == 'tts' else ChatterboxTurboTTS).from_pretrained(device=dev)
        return models[kind]

    # --- The reference voices
    refs = {s: os.path.join(REFS, f'{s}.flac') for s in spec['cast']}
    for r in a.ref:
        s, path = r.split('=', 1)
        assert s in refs, f'no speaker {s}'
        refs[s] = os.path.abspath(path)
    for s, cast in sorted(spec['cast'].items(), key=lambda kv: kv[1]['base']):
        if os.path.exists(refs[s]) and not (a.new_refs and refs[s].startswith(REFS)):
            continue
        m = None  # (let go of the other model first)
        m = model(cast['base'])
        parts = []
        for i, text in enumerate(REF_TEXT[s]):
            torch.manual_seed(7 + i)
            with torch.inference_mode():
                if cast['base'] == 'tts':
                    w = m.generate(text, exaggeration=0.45, cfg_weight=0.5, temperature=0.7)
                else:
                    w = m.generate(text, temperature=0.7)
            p = os.path.join(TMP, f'ref_{s}_{i}.wav')
            torchaudio.save(p, w.cpu(), m.sr)
            parts.append(p)
        k = cast['shift']
        inputs = sum((['-i', p] for p in parts), [])
        ff([*inputs, '-filter_complex',
            ''.join(f'[{i}]' for i in range(len(parts))) + f'concat=n={len(parts)}:v=0:a=1,'
            f'asetrate={m.sr}*{k},aresample={SR_OUT},atempo={1 / k:.4f},loudnorm=I=-20:TP=-2',
            '-ac', '1', '-ar', str(SR_OUT), refs[s]])
        print(f'reference {s}: {duration(refs[s]):.1f}s ({cast["base"]}, x{k})', flush=True)

    ref_key = {s: hashlib.sha1(open(p, 'rb').read()).hexdigest()[:8] for s, p in refs.items()}

    # --- What to make
    man_path = os.path.join(OUT, 'manifest.json')
    manifest = json.load(open(man_path, encoding='utf-8')) if os.path.exists(man_path) else {}

    def key_of(line: dict) -> str:
        mood = spec['moods'][line['mood']]
        return hashlib.sha1(f"{VERSION}|{ref_key[line['speaker']]}|{json.dumps(mood)}|{FINISH}|{line['text']}"
                            .encode('utf-8')).hexdigest()[:12]

    todo = [l for l in spec['lines'] if l['id'].startswith(a.only) and (
        a.redo or manifest.get(l['id'], {}).get('key') != key_of(l) or not os.path.exists(os.path.join(OUT, l['id'] + '.mp3')))]
    # Plain lines first, then the tagged ones (one speech model at a time)
    todo.sort(key=lambda l: bool(TAG.search(l['text'])))
    print(f'{len(todo)} lines to make', flush=True)
    if not todo:
        return

    m = None
    # (the check runs on the CPU: a 6 GB card is full with the speech models)
    asr = whisper.load_model('base', device='cpu')
    conds: dict[tuple[str, str], object] = {}

    def save_manifest():
        json.dump(manifest, open(man_path, 'w', encoding='utf-8', newline='\n'), indent=1, ensure_ascii=False)

    for n, line in enumerate(todo):
        sp, text = line['speaker'], line['text']
        mood = spec['moods'][line['mood']]
        tagged = bool(TAG.search(text))
        kind = 'turbo' if tagged else 'tts'
        if kind not in models:
            m = None
        m = model(kind)
        if (kind, sp) not in conds:
            if kind == 'tts':
                m.prepare_conditionals(refs[sp], exaggeration=mood['exaggeration'])
            else:
                m.prepare_conditionals(refs[sp])
            conds[(kind, sp)] = m.conds
        m.conds = conds[(kind, sp)]
        # The voice conversion runs on the loaded model's own decoder (the same weights; a second
        # copy does not fit a 6 GB card), onto the speaker's reference
        vc = ChatterboxVC(m.s3gen, dev, ref_dict=m.conds.gen)

        want = spoken_seconds(text)
        best = None
        for attempt in range(5):
            torch.manual_seed(1000 * (n + 1) + 17 * attempt)
            with torch.inference_mode():
                if tagged:
                    w = m.generate(text, temperature=mood['temperature'])
                else:
                    w = m.generate(text, exaggeration=mood['exaggeration'], cfg_weight=mood['cfg'],
                                   temperature=mood['temperature'])
                torchaudio.save(os.path.join(TMP, 'a.wav'), w.cpu(), m.sr)
                conv = vc.generate(os.path.join(TMP, 'a.wav'))
            torchaudio.save(os.path.join(TMP, 'b.wav'), conv.cpu(), vc.sr)
            ff(['-i', os.path.join(TMP, 'b.wav'), '-af', FINISH, '-ac', '1', '-ar', str(SR_OUT), os.path.join(TMP, 'c.wav')])
            dur = duration(os.path.join(TMP, 'c.wav'))
            heard = asr.transcribe(os.path.join(TMP, 'c.wav'), language='en', fp16=False,
                                   condition_on_previous_text=False)['text'].strip()
            missing, extra = compare(text, heard)
            ratio = dur / max(0.7, want)
            ok = missing <= 0.2 and extra <= 0.2 and 0.6 < ratio < (2.4 if tagged else 1.8)
            score = missing * 2 + extra + abs(ratio - (1.2 if tagged else 1.0)) * 0.3
            print(f'  {line["id"]} take {attempt + 1}: {dur:.1f}s (~{want:.1f}) missing {missing:.2f} extra {extra:.2f}'
                  f' {"KEEP" if ok else "again"} | {heard[:100]}', flush=True)
            if best is None or score < best[0]:
                best = (score, dur, heard, ok)
                os.replace(os.path.join(TMP, 'c.wav'), os.path.join(TMP, 'best.wav'))
            if ok:
                break
        fname = line['id'] + '.mp3'
        ff(['-i', os.path.join(TMP, 'best.wav'), '-ac', '1', '-ar', str(SR_OUT), '-c:a', 'libmp3lame', '-b:a', '48k',
            os.path.join(OUT, fname)])
        manifest[line['id']] = {'file': fname, 'seconds': round(duration(os.path.join(OUT, fname)), 2),
                                'text': re.sub(r'\s+', ' ', TAG.sub('', text)).strip(),
                                'speaker': sp, 'mood': line['mood'], 'trigger': line['trigger'],
                                'key': key_of(line), 'heard': best[2]}
        if not best[3]:
            manifest[line['id']]['unsure'] = True
        print(f'[{n + 1}/{len(todo)}] {line["id"]:20s} {best[1]:5.1f}s {"T" if tagged else " "} {"" if best[3] else "UNSURE"}', flush=True)
        save_manifest()

    # Lines that were removed: their recordings go too
    if not a.only:
        ids = {l['id'] for l in spec['lines']}
        for gone in [k for k in manifest if k not in ids]:
            f = os.path.join(OUT, manifest.pop(gone)['file'])
            if os.path.exists(f):
                os.remove(f)
            print('removed', gone)
    save_manifest()
    for f in os.listdir(TMP):
        os.remove(os.path.join(TMP, f))
    print('manifest:', len(manifest), 'lines,', sum(1 for v in manifest.values() if v.get('unsure')), 'unsure', flush=True)


if __name__ == '__main__':
    sys.exit(main())
