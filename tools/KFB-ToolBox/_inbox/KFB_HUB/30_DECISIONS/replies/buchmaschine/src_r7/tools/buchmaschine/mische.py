# Tonspur für Belegvideos der Buchmaschine: Ereignis-Protokoll der Probebühne + Belegung TON_BELEGUNG_R1.json (WS0) → WAV.
# Nur für die Belegvideos. Im Spiel spielt der Audio-Host (V-1957) dieselben Ereignisse.
# python3 -I mische.py <ereignisse.json> <out.wav> <belegung.json> <karte.json> <ffmpeg>
import json, subprocess, sys, random
import numpy as np

ev_pfad, out_pfad, beleg_pfad, karte_pfad, ffmpeg = sys.argv[1:6]
SR = 48000
log = json.load(open(ev_pfad)); B = json.load(open(beleg_pfad))['ereignisse']; karte = json.load(open(karte_pfad))
dauer = log['frames'] / log['fps']
mix = np.zeros((int(dauer * SR) + SR, 2), np.float32)
rnd = random.Random(1122)
_cache = {}

def lade(i):
    if i not in _cache:
        if i not in karte: _cache[i] = None; return None
        roh = subprocess.run([ffmpeg, '-loglevel', 'error', '-i', karte[i], '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
        _cache[i] = np.frombuffer(roh, np.float32).reshape(-1, 2).copy() if roh else None
    return _cache[i]

def setze(i, t, pegel, tonhoehe=1.0, pan=0.0, max_s=None):
    a = lade(i)
    if a is None: return
    if tonhoehe != 1.0:   # Tonhöhe über Abspieltempo (wie playbackRate)
        n = int(len(a) / tonhoehe); x = np.linspace(0, len(a) - 1, n)
        a = np.stack([np.interp(x, np.arange(len(a)), a[:, c]) for c in (0, 1)], 1).astype(np.float32)
    if max_s:
        n = min(len(a), int(max_s * SR)); a = a[:n].copy(); f = min(n, int(0.08 * SR)); a[n - f:] *= np.linspace(1, 0, f)[:, None]
    l, r = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
    s = int(t * SR); e = min(len(mix), s + len(a))
    if s >= len(mix): return
    mix[s:e, 0] += a[:e - s, 0] * pegel * l * 1.41; mix[s:e, 1] += a[:e - s, 1] * pegel * r * 1.41

pan_von = lambda e: float(np.clip((e['ort'][0] if e.get('ort') else 0) / 7.0, -0.8, 0.8))
gespielt = []   # Zeitpunkte für die Kappe (14 je Sekunde)
def kappe_ok(t):
    while gespielt and gespielt[0] < t - 1: gespielt.pop(0)
    if len(gespielt) >= 14: return False
    gespielt.append(t); return True

zahn_n = 0; schub_t = -9; schub_n = 0; blitz_an = []
for e in sorted(log['ereignisse'], key=lambda e: e['t']):
    t, typ, st = e['t'], e['typ'], e['staerke']
    if typ == 'zahn':
        zahn_n += 1
        if zahn_n % 2: continue
        Z = B['zahn']; ids = Z['ids'][::-1] if e.get('rueck') else Z['ids']
        if kappe_ok(t): setze(ids[(zahn_n // 2) % 2], t, Z['pegel'], 0.9 if e.get('rueck') else rnd.uniform(*Z['tonhoehe']), pan_von(e) * 0.3)
    elif typ == 'einrasten':
        Z = B['einrasten']
        if t - schub_t > 1.0: schub_t, schub_n = t, 0
        if schub_n >= Z['je_schub'] or rnd.random() > 0.25: continue
        schub_n += 1; lo, hi = Z['tonhoehe_nach_groesse']
        if kappe_ok(t): setze(rnd.choice(Z['ids']), t, Z['pegel'], hi - (hi - lo) * min(1, st), pan_von(e))
    elif typ == 'schlag':
        Z = B['schlag']; i = rnd.choice(Z['ids']); g = min(Z['pegel_max'], st * Z['pegel_max'])
        setze(i, t, g, 1.0, pan_von(e)); setze(i, t + 0.12, g * 0.6, 1.05, pan_von(e))
    elif typ == 'dampf':
        Z = B['dampf']; i = Z['ids'][0]
        if st >= 0.8: setze(i, t, Z['kraeftig']['pegel'], 1.0, 0, Z['kraeftig']['dauer_s'])
        elif kappe_ok(t): setze(i, t, Z['gelenk']['pegel'], rnd.uniform(*Z['gelenk']['tonhoehe']), pan_von(e), Z['gelenk']['dauer_s'])
    elif typ == 'umbau':
        Z = B['umbau']; setze(rnd.choice(Z['ids']), t, Z['pegel'])
        for i in Z.get('unterlage', {}).get('ids', []): setze(i, t, Z['unterlage']['pegel'])   # fehlt die Datei, bleibt es still
    elif typ == 'blitz':
        Z = B['blitz']; blitz_an = [x for x in blitz_an if x > t]
        if len(blitz_an) >= Z['max_gleichzeitig'] or not kappe_ok(t): continue
        i = Z['ids'][1] if st > 0.7 else rnd.choice([Z['ids'][0], Z['ids'][2], Z['ids'][3]])
        setze(i, t, Z['pegel'] * (0.7 + 0.3 * st), rnd.uniform(0.95, 1.1), pan_von(e)); blitz_an.append(t + 0.4)
    elif typ == 'schaelen':
        Z = B['schaelen']
        if kappe_ok(t): setze(rnd.choice(Z['ids']), t, Z['pegel'], rnd.uniform(*Z['tonhoehe']), pan_von(e))

# Rascheln als Schicht: Papierklänge hintereinander, Pegel je Bild aus der Zahl fallender Kacheln
R = B['rascheln']; teile = [lade(i) for i in R['ids']]; teile = [x for x in teile if x is not None]
if teile and max(log['rascheln']) > 0:
    schicht = np.concatenate(teile * (int(dauer / sum(len(x) for x in teile) * SR) + 2))[:len(mix)]
    huell = np.interp(np.arange(len(mix)) / SR, np.arange(len(log['rascheln'])) / log['fps'], log['rascheln']).astype(np.float32)
    mix += schicht * (huell * R['pegel_max'])[:, None]

mix = mix[:int(dauer * SR)]
spitze = float(np.abs(mix).max()) or 1.0
mix *= min(1.0, 0.89 / spitze)   # höchstens −1 dBFS
subprocess.run([ffmpeg, '-loglevel', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', out_pfad], input=mix.astype(np.float32).tobytes())
print(out_pfad, 'Spitze vorher', round(spitze, 3), 'Ereignisse', len(log['ereignisse']))
