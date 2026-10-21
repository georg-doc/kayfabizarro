# Erzeugt im Spiel-Zweig (Standard ~/kfb-ws1/kfb-planet-pw, sonst KFB_GAME):
#   src/world/probeHeight.js                 Höhenfunktion der Gelände-Probe 1:1 (kein Abschreiben, Muster gen_terrain3.py)
#   src/data/worlds/kfb-world-probe.r1.json  Spiel-Rezept = Vorlage „Sanfte Hügel“ mit Wasserstand 0, erzeugt von recipe() der Probe selbst
#   test/fixtures/probe-height.golden.json   500 Punkte + __hgt der Probe (mit/ohne Anker) für den Paritätstest ohne laufenden Server
# Rezept und Bezugswerte holt probe_height_ref.mjs aus der gebauten Probe (http://localhost:8751/, frischer Browser).
import re, json, os, sys, hashlib, subprocess, urllib.request, random, math, datetime
HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.expanduser('~/kfb-ws1/probe/gelaende-probe.html'); G = os.path.expanduser(os.environ.get('KFB_GAME', '~/kfb-ws1/kfb-planet-pw'))
PRESET = 'Sanfte Hügel'
s = open(P, encoding='utf-8').read()

def cut(a, b, incl_b=False):   # Text von Marke a bis vor Marke b (beide genau einmal)
    assert s.count(a) == 1, 'Marke nicht eindeutig: ' + a
    i = s.index(a); j = s.index(b, i)
    return s[i:j + (len(b) if incl_b else 0)]
def line(a):   # ganze Zeile ab Marke a
    assert s.count(a) == 1, 'Marke nicht eindeutig: ' + a
    i = s.index(a); return s[i:s.index('\n', i)]
def must(t):   # Wortlaut, den das Spiel nachbildet (Abweichung = Probe geändert → Port prüfen)
    assert s.count(t) >= 1, 'Probe geändert, Port prüfen: ' + t

NOISE = cut('const m289 = ', '\n\n  // Höhenfunktion: eine Quelle')
HEIGHT = cut('const S = {};', '  // Voxel-Säule:').rstrip('\n')
DIO = cut('const dioSDJS = ', '  function pushDio(').rstrip('\n')
RINGY = line('const ringY = (A) => ')
SEED = line('const sd = S.seed; S.sx = ')
PRESETS = cut('const PRESETS = {', 'const DEFAULT = ') + line('const DEFAULT = ')
R2UI = cut('function recipeToUI(r) {', '  const say = (t) =>').rstrip('\n')
NUM = json.loads(re.search(r"const NUM = (\[[^\]]*\]);", s).group(1).replace("'", '"'))
BOOL = json.loads(re.search(r"const BOOL = (\[[^\]]*\]);", s).group(1).replace("'", '"'))
for t in ["for (const k of NUM) S[k] = parseFloat($(k).value);", "for (const k of BOOL) S[k] = $(k).checked;", "S.fluid = +$('fluid').value",
          "for (const k of NUM) if (p[k] != null) $(k).value = p[k];", "for (const k of BOOL) if (p[k] != null) $(k).checked = !!p[k];",
          "setUI(PRESETS[DEFAULT]); $('grid').checked = false;", "setUI(recipeToUI(r)); markPreset(null); RC.dirty = false; update();",
          "const wl = S.water * S.amp + 0.15, kit = S.fluid === 3", "BANK.L = U.uBankL.value = wl; BANK.D = U.uBankD.value = kit && S.water > 0.005 && !S.vox ? 1.5 : 0",
          '<option value="3">Wasser · Island Kit (F2)</option>', 'window.__hgt = (x, z) => hgt(x, z);']:
    must(t)
assert re.search(r'<select id="fluid"><option value="3">', s), 'Fluid-Grundwert nicht mehr 3'
# GZERO-Abkürzung im Port (gG nur bei Tafelkante/Terrassen): jede Zeile von hgt() mit gG muss Deklaration, Tafelkanten- oder Terrassenzweig sein
HGT = cut('function hgt(px, py) {', '\n  const BANK = ')
for l in HGT.split('\n'):
    if 'gG' in l: assert l.strip().startswith(('let gG = 0; if (!GZERO)', 'if (S.plateau < 0.999)', 'if (S.steps >= 1)', 'else { const s = h * S.steps;')), 'gG neu verwendet, GZERO-Abkürzung prüfen: ' + l.strip()[:80]

# Regler aus dem HTML: Bereich, Schritt, Grundwert (ohne value: Mitte, auf Raster) bzw. checked
def snap(v, mn, mx, st):
    k = math.floor((v - mn) / st + 0.5); d = len(str(st).split('.')[1]) if '.' in str(st) else 0
    y = round(mn + k * st, d); return y - st if y > mx else y
inputs = {}
for m in re.finditer(r'<input type="(range|checkbox)" id="(\w+)"([^>]*)>', s):
    typ, iid, rest = m.groups(); at = dict(re.findall(r'(\w+)="([^"]*)"', rest))
    if iid not in NUM and iid not in BOOL: continue
    if typ == 'range':
        mn, mx, st = float(at['min']), float(at['max']), float(at.get('step', '1'))
        v = float(at['value']) if 'value' in at else snap(mn + (mx - mn) / 2, mn, mx, st)
        num = lambda x: int(x) if x == int(x) else x
        inputs[iid] = {'type': 'range', 'min': num(mn), 'max': num(mx), 'step': num(st), 'value': num(v)}
    else:
        inputs[iid] = {'type': 'checkbox', 'checked': bool(re.search(r'\bchecked\b', rest))}
for k in ['scale', 'amp', 'oct', 'ridge', 'warp', 'macro', 'seed', 'valley', 'plateau', 'steps', 'sharp', 'maxslope', 'water']:
    assert inputs.get(k, {}).get('type') == 'range', 'Höhenregler fehlt: ' + k
for k in ['ether', 'berm', 'vox', 'grid']:
    assert inputs.get(k, {}).get('type') == 'checkbox', 'Schalter fehlt: ' + k
UI = json.dumps({'NUM': NUM, 'BOOL': BOOL, 'inputs': inputs}, ensure_ascii=False, separators=(',', ':'))

blocks = [NOISE, HEIGHT, DIO, RINGY, SEED, PRESETS, R2UI]
sha = hashlib.sha256('\n'.join(blocks).encode('utf-8')).hexdigest()[:16]
ln = lambda t: s[:s.index(t)].count('\n') + 1
meta = {'source': 'probe/gelaende-probe.html', 'blocksSha256': sha, 'generated': datetime.date.today().isoformat(), 'NE0': '600/256',
        'lines': {'snoise': ln(NOISE), 'hgt': ln(HEIGHT), 'dioModJS': ln(DIO), 'ringY': ln(RINGY), 'recipeToUI': ln(R2UI), 'PRESETS': ln(PRESETS)}}

# Die gebaute Probe (Server) muss dieselben Zeilen enthalten, sonst stimmen Rezept und Bezugswerte nicht mit der Quelle überein
URL = os.environ.get('KFB_PROBE_URL', 'http://localhost:8751/')
served = urllib.request.urlopen(URL, timeout=10).read().decode('utf-8')
for b in blocks: assert b in served, 'Server-Probe weicht von der Quelle ab (neu bauen?): ' + b[:60]

ind = lambda t: '  ' + t
tpl = open(os.path.join(HERE, 'probeHeight.tpl.js'), encoding='utf-8').read()
js = (tpl.replace('/*@META@*/', json.dumps(meta, ensure_ascii=False)).replace('/*@UI@*/', UI).replace('/*@PRESETS@*/', PRESETS).replace('/*@RECIPE_TO_UI@*/', R2UI)
      .replace('/*@NOISE@*/', ind(NOISE)).replace('/*@HEIGHT@*/', ind(HEIGHT)).replace('/*@DIO@*/', ind(DIO)).replace('/*@RINGY@*/', ind(RINGY)).replace('/*@SEED@*/', ind(SEED)))
assert '/*@' not in js
os.makedirs(G + '/src/world', exist_ok=True); open(G + '/src/world/probeHeight.js', 'w', encoding='utf-8').write(js)

# Rezept über recipe() der Probe (Vorlage anklicken, Wasserstand-Regler auf 0)
node = lambda *a: subprocess.run(['node', os.path.join(HERE, 'probe_height_ref.mjs'), *a], check=True, capture_output=True, text=True).stdout
rtxt = node('recipe', PRESET); recipe = json.loads(rtxt)
assert recipe['schema'].startswith('kfb.terrain-recipe/') and recipe['stylize']['waterLevel'] == 0
os.makedirs(G + '/src/data/worlds', exist_ok=True); open(G + '/src/data/worlds/kfb-world-probe.r1.json', 'w', encoding='utf-8').write(rtxt + '\n')

# Bezugswerte: 500 feste Punkte (Spielwelt, Anker der Probe, weit draußen), Rezept über die Probe-Oberfläche, Flüsse aus, Wasser 0
rnd = random.Random(20261021); pts = []
def disc(n, cx, cz, r):
    for _ in range(n): a = rnd.random() * 2 * math.pi; q = r * math.sqrt(rnd.random()); pts.append([round(cx + math.cos(a) * q, 4), round(cz + math.sin(a) * q, 4)])
disc(350, 0, 0, 300); disc(50, 0, 0, 40); disc(50, 0, 70, 25); disc(50, 0, 0, 1500)
tmp = os.path.join(os.environ.get('TMPDIR', '/tmp'), 'kfb-gen-height'); os.makedirs(tmp, exist_ok=True)
open(tmp + '/recipe.json', 'w').write(rtxt); open(tmp + '/pts.json', 'w').write(json.dumps(pts))
ref = json.loads(node('sample', tmp + '/recipe.json', tmp + '/pts.json'))
assert ref['state']['rivOff'] and ref['state']['water'] == 0, ref['state']
gold = {'schema': 'kfb.probe-height-golden/1', 'source': URL, 'blocksSha256': sha, 'recipe': 'src/data/worlds/kfb-world-probe.r1.json', 'note': 'Probe: Rezept übernommen, Flüsse aus, Wasser 0',
        'anchors': ref['anchors'], 'points': pts, 'withAnchors': ref['withAnchors'], 'noAnchors': ref['noAnchors']}
os.makedirs(G + '/test/fixtures', exist_ok=True); open(G + '/test/fixtures/probe-height.golden.json', 'w').write(json.dumps(gold, separators=(',', ':')) + '\n')
print('ok', len(js), 'Zeichen · Rezept', PRESET, '· Anker der Probe', len(ref['anchors']), '· sha', sha)
