"""Contact sheets of stills (3x3, in the given order): python capture/sheet.py out/stills out/sheet name..."""
import subprocess, sys, os
src, prefix, names = sys.argv[1], sys.argv[2], sys.argv[3:]
names = [n for n in names if os.path.exists(os.path.join(src, n + '.jpg'))]
for k in range(0, len(names), 9):
    grp = names[k:k + 9]
    inputs, f = [], ''
    for i, n in enumerate(grp):
        inputs += ['-i', os.path.join(src, n + '.jpg')]
        f += f'[{i}]scale=640:360[v{i}];'
    while len(grp) < 9:
        i = len(grp); inputs += ['-f', 'lavfi', '-i', 'color=black:s=640x360:d=1']; f += f'[{i}]null[v{i}];'; grp = grp + ['-']
    lay = '|'.join(f'{(i % 3) * 640}_{(i // 3) * 360}' for i in range(9))
    f += ''.join(f'[v{i}]' for i in range(9)) + f'xstack=inputs=9:layout={lay}'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', f, '-frames:v', '1', f'{prefix}_{k // 9}.jpg'], check=True)
    print(f'{prefix}_{k // 9}.jpg', grp)
