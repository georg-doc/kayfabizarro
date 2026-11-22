import sys, os, subprocess, wave, tempfile, json
import numpy as np
stems, bpm, off = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
def lade(p, fs=8000):
    t = tempfile.mktemp(suffix='.wav')
    subprocess.run(['afconvert', '-f', 'WAVE', '-d', f'LEI16@{fs}', '-c', '1', p, t], check=True)
    with wave.open(t) as w: x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    os.remove(t); return x, fs
takt = 4 * 60 / bpm
res = {}
dauer = 0
for f in sorted(os.listdir(stems)):
    if not f.endswith('.mp3') or 'Vocals' in f: continue
    x, fs = lade(os.path.join(stems, f)); dauer = max(dauer, len(x) / fs)
    n = int((len(x) / fs - off) // takt)
    e = [float(np.sqrt(np.mean(x[int((off + i * takt) * fs):int((off + (i + 1) * takt) * fs)] ** 2) + 1e-12)) for i in range(n)]
    res[f.split(' ', 1)[1][:-4]] = e
namen = list(res); n = min(len(v) for v in res.values())
M = np.array([res[k][:n] for k in namen])
Mn = M / (M.max(axis=1, keepdims=True) + 1e-9)
print('dauer', round(dauer, 1), 's  takte', n, 'taktlaenge', round(takt, 3))
print('takt  zeit  ' + ' '.join(k[:5].ljust(5) for k in namen) + '  summe')
for i in range(n):
    print(f'{i+1:4d} {off + i*takt:6.1f} ' + ' '.join(('#' * int(round(v * 5))).ljust(5) for v in Mn[:, i]) + f'  {Mn[:, i].sum():.1f}')
json.dump({'bpm': bpm, 'offset': off, 'takt_s': takt, 'stems': namen, 'energie': Mn.round(3).tolist()}, open(sys.argv[4], 'w'))
