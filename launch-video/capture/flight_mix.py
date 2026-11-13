"""The third film's sound pieces, from the game's own audio (public/voice/radio, public/audio/jet):
radio calls put through a UHF set (band-limited, driven, a hiss under them, a key click and a
squelch tail), the engine start, a long engine pass for the Earth montage, mask breathing.
Writes launch-video/public/audio/flight/*.wav.  Usage: python capture/flight_mix.py"""
import os, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.dirname(ROOT)
OUT = os.path.join(ROOT, 'public', 'audio', 'flight')
os.makedirs(OUT, exist_ok=True)


def ff(args):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *args], check=True)


def radio(line_id, name, hiss=0.02):
    src = os.path.join(SITE, 'public', 'voice', 'radio', f'{line_id}.mp3')
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src], capture_output=True, text=True).stdout)
    total = dur + 0.3
    voice = ('highpass=f=300,highpass=f=300,lowpass=f=2500,lowpass=f=2500,equalizer=f=1200:t=q:w=1.2:g=3,'
             'acompressor=threshold=-24dB:ratio=6:attack=3:release=120:makeup=8,asoftclip=type=tanh:threshold=0.6,'
             'highpass=f=300,lowpass=f=2400,adelay=60:all=1')
    fc = (f'[0:a]aresample=48000,{voice}[v];'
          f'anoisesrc=d={total}:c=pink:r=48000:a={hiss},highpass=f=500,lowpass=f=2600,afade=t=in:d=0.02,afade=t=out:st={dur + 0.06}:d=0.03[h];'
          # key click, and the squelch tail when the carrier drops
          f'sine=f=700:d=0.018:r=48000,volume=0.25[k];'
          f'anoisesrc=d=0.11:c=white:r=48000:a=0.2,highpass=f=1400,lowpass=f=3400,afade=t=out:st=0.07:d=0.04,adelay={int((dur + 0.1) * 1000)}:all=1[s];'
          f'[v][h][k][s]amix=inputs=4:normalize=0,alimiter=limit=0.9[o]')
    ff(['-i', src, '-filter_complex', fc, '-map', '[o]', '-ar', '48000', '-ac', '2', os.path.join(OUT, f'{name}.wav')])
    print(name, f'{total + 0.2:.2f}s')


radio('start.2', 'radio_start')
radio('mach1.2', 'radio_mach')
radio('karman.1', 'radio_karman', hiss=0.03)
radio('body.Saturn', 'radio_saturn', hiss=0.04)

JET = os.path.join(SITE, 'public', 'audio', 'jet')
# Engine start, heard from the cockpit
ff(['-i', os.path.join(JET, 'engine_start.mp3'), '-af', 'lowpass=f=3200,afade=t=in:d=0.15,afade=t=out:st=4.2:d=1.0,volume=1.3', '-t', '5.2', '-ar', '48000', '-ac', '2', os.path.join(OUT, 'engine_start.wav')])
# A long pass under the Earth montage: the engine at power, behind the canopy, swelling and easing
ff(['-stream_loop', '6', '-i', os.path.join(JET, 'engine_high.mp3'), '-af', 'lowpass=f=1500,bass=g=4:f=120,tremolo=f=0.35:d=0.35,afade=t=in:d=1.2,afade=t=out:st=10.2:d=1.8,volume=0.9', '-t', '12', '-ar', '48000', '-ac', '2', os.path.join(OUT, 'engine_pass.wav')])
# Mask breathing: three calm breaths
ins = []
for n in (1, 4, 7):
    ins += ['-i', os.path.join(JET, f'breath_calm_{n}.mp3')]
ff([*ins, '-filter_complex', '[0:a]apad=pad_dur=0.5[a];[1:a]apad=pad_dur=0.5[b];[a][b][2:a]concat=n=3:v=0:a=1,afade=t=out:st=5:d=0.5[o]', '-map', '[o]', '-t', '5.5', '-ar', '48000', '-ac', '2', os.path.join(OUT, 'breath.wav')])
print('done')
