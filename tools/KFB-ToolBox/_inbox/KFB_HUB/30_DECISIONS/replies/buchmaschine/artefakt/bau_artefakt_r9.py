# Baut die Artefakt-Fassung R9 (Buchmaschine: 30-s-Trailer-Loop und Game-Piece in der HyperNorm-Kammer) aus dem Repo-Spiegel der Probebühne.
# Eine Quelle, zwei Ausgaben: tools/buchmaschine/kammer.html im Repo, hier index.html fürs Artefakt (Ordnerstruktur ab Repo-Wurzel bleibt).
# python3 bau_artefakt_r9.py <repo-spiegel> <zielordner>
# Abweichungen nur fürs Artefakt: Buch als glTF-JSON (Artefakte liefern kein .glb), Help-Deck-Bilder verkleinert (< 2 MB, Figuren WebP mit Alpha),
# private Dateien unter tools/buchmaschine/_privat und pd_pool_klein (nicht im Repo, nur im privaten Artefakt).
import json, os, re, shutil, struct, base64, sys
from PIL import Image

repo, ziel = sys.argv[1:3]
def kopie(rel, dst=None):
    d = os.path.join(ziel, dst or rel); os.makedirs(os.path.dirname(d), exist_ok=True); shutil.copyfile(os.path.join(repo, rel), d)

# 1) Seite: kammer.html → index.html (ohne doctype/head/body; der Artefakt-Rahmen setzt sie), Pfade von tools/buchmaschine/ auf Wurzel
s = open(os.path.join(repo, 'tools/buchmaschine/kammer.html'), encoding='utf-8').read()
s = s.replace('../../', './')
for a, b in [("'./energy-arc.r1.buchmaschine.js'", "'./tools/buchmaschine/energy-arc.r1.buchmaschine.js'"), ("'./ton.js'", "'./tools/buchmaschine/ton.js'"),
             ("fetch('ton_belegung.json')", "fetch('tools/buchmaschine/ton_belegung.json')"), ("fetch('ton_karte.json')", "fetch('tools/buchmaschine/ton_karte.json')"),
             ("'_privat/", "'tools/buchmaschine/_privat/"), ("url: 'pd_pool_klein/", "url: 'tools/buchmaschine/pd_pool_klein/"),
             ("loadAsync('tools/buchmaschine/_privat/buch/KFB_Buch_Mensch.r3.glb')", "loadAsync('tools/buchmaschine/_privat/buch/KFB_Buch_Mensch.r3.gltf.json')"),
             ("`./engine/hypernorm/test/daten/help/karte_0${n}.png`", "`./engine/hypernorm/test/daten/help/karte_0${n}.jpg`")]:
    assert a in s, a; s = s.replace(a, b)
s = re.sub(r"'tools/buchmaschine/_privat/bots/([A-Za-z0-9_.]+)\.glb'", r"'tools/buchmaschine/_privat/bots/\1.gltf.json'", s)
for a, b in []:
    assert a in s, a; s = s.replace(a, b)
titel = re.search(r'<title>(.*?)</title>', s).group(1)
style = re.search(r'<style>(.*?)</style>', s, re.S).group(1)
imap = re.search(r'(<script type="importmap">.*?</script>)', s, re.S).group(1)
koerper = re.search(r'<body>(.*)</body>', s, re.S).group(1).replace('<button id="ton">Ton an</button></div>', '<button id="ton">Ton an</button><a href="voxel.html" style="color:#ffd9a0;padding:6px 4px">Voxel-Relief ▸</a></div>')
os.makedirs(ziel, exist_ok=True)
open(os.path.join(ziel, 'index.html'), 'w', encoding='utf-8').write(f'<title>Buchmaschine Testbühne</title>\n<style>{style}</style>\n{imap}\n{koerper.strip()}\n')

# 2) Quelltext und Engine (Ordner wie im Repo)
QUELL = ['vendor/three/three.module.js', 'vendor/three/three.core.js', 'src/core/rezept.js', 'src/core/cueBus.js', 'src/scenelets/hnKammer.js', 'src/data/choreo/buchmaschine_trailer.r2.json', 'src/data/choreo/buchmaschine_trailer.r3.json', 'src/assets/cards/KayfaBizarro_Card_Backside_01_lowrez.png',
         'src/data/vfx/energy-arc.r1.json', 'src/vendor/clay/kfb-clay.v1.2.js', 'tools/buchmaschine/energy-arc.r1.buchmaschine.js', 'tools/buchmaschine/ton.js',
         'tools/buchmaschine/ton_belegung.json', 'tools/buchmaschine/ton_karte.json']
QUELL += ['src/scenelets/buchmaschine/' + f for f in ('schaelen.js', 'bildVoxel.js', 'rostLook.js')]
QUELL += ['src/card-edge/' + f for f in ('kfb-card-edge.js', 'kfb-ink-canon.js', 'kfb-card-format.js', 'kfb-card-builder.js')]
QUELL += ['src/vendor/codevember-orrery/' + f for f in os.listdir(os.path.join(repo, 'src/vendor/codevember-orrery'))]
QUELL += ['vendor/addons/' + f for f in ('controls/OrbitControls.js', 'loaders/GLTFLoader.js', 'utils/BufferGeometryUtils.js', 'utils/SkeletonUtils.js', 'postprocessing/EffectComposer.js', 'postprocessing/RenderPass.js',
          'postprocessing/UnrealBloomPass.js', 'postprocessing/OutputPass.js', 'postprocessing/ShaderPass.js', 'postprocessing/MaskPass.js', 'postprocessing/Pass.js', 'shaders/CopyShader.js', 'shaders/LuminosityHighPassShader.js', 'shaders/OutputShader.js')]
QUELL += ['engine/hypernorm/' + f for f in ('adapter/fassade.mjs', 'adapter/fassade.worker.mjs', 'adapter/flaeche.mjs', 'darsteller.mjs', 'kern.mjs', 'material.mjs', 'schriftpool.mjs', 'hypernorm.gen.mjs', 'pins.json', 'raum/raum.mjs', 'raum/rezepte.mjs')]
QUELL += ['engine/hypernorm/fonts/' + f for f in os.listdir(os.path.join(repo, 'engine/hypernorm/fonts'))]
for r in QUELL: kopie(r)

# 3) Private Dateien: Rost, Seiten, Klänge, pd_pool_klein; Buch als glTF-JSON mit eingebetteten Daten
for sub in ('rost', 'seiten', 'ton'):
    for f in os.listdir(os.path.join(repo, 'tools/buchmaschine/_privat', sub)): kopie(f'tools/buchmaschine/_privat/{sub}/{f}')
for root, _, fs in os.walk(os.path.join(repo, 'tools/buchmaschine/pd_pool_klein')):
    for f in fs: kopie(os.path.relpath(os.path.join(root, f), repo))
def glb_json(rel, ausrel):
    d = open(os.path.join(repo, rel), 'rb').read(); l = struct.unpack('<I', d[12:16])[0]; j = json.loads(d[20:20 + l]); off = 20 + l; bl = struct.unpack('<I', d[off:off + 4])[0]
    j['buffers'][0]['uri'] = 'data:application/octet-stream;base64,' + base64.b64encode(d[off + 8:off + 8 + bl]).decode()
    os.makedirs(os.path.dirname(os.path.join(ziel, ausrel)), exist_ok=True); open(os.path.join(ziel, ausrel), 'w').write(json.dumps(j, separators=(',', ':')))
for f in os.listdir(os.path.join(repo, 'tools/buchmaschine/_privat/bots')):
    if f.endswith('.glb'): glb_json('tools/buchmaschine/_privat/bots/' + f, 'tools/buchmaschine/_privat/bots/' + f[:-4] + '.gltf.json')
d = open(os.path.join(repo, 'tools/buchmaschine/_privat/buch/KFB_Buch_Mensch.r3.glb'), 'rb').read()
l = struct.unpack('<I', d[12:16])[0]; j = json.loads(d[20:20 + l]); off = 20 + l; bl = struct.unpack('<I', d[off:off + 4])[0]
j['buffers'][0]['uri'] = 'data:application/octet-stream;base64,' + base64.b64encode(d[off + 8:off + 8 + bl]).decode()
os.makedirs(os.path.join(ziel, 'tools/buchmaschine/_privat/buch'), exist_ok=True)
open(os.path.join(ziel, 'tools/buchmaschine/_privat/buch/KFB_Buch_Mensch.r3.gltf.json'), 'w').write(json.dumps(j, separators=(',', ':')))

# 4) Help-Deck verkleinert: Figuren WebP mit Alpha, Karten/Seite JPG, jedes < 2 MB; Manifest mit neuen Dateinamen und Maßen
mpfad = 'engine/hypernorm/test/daten/help-deck.hn-media.json'; m = json.load(open(os.path.join(repo, mpfad)))
os.makedirs(os.path.join(ziel, 'engine/hypernorm/test/daten/help'), exist_ok=True)
for it in m['items']:
    im = Image.open(os.path.join(repo, 'engine/hypernorm/test/daten', it['file']))
    if im.width > 2048: im = im.resize((2048, round(im.height * 2048 / im.width)), Image.LANCZOS)
    if it['kind'] == 'figure': neu = it['file'].rsplit('.', 1)[0] + '.webp'; im.save(os.path.join(ziel, 'engine/hypernorm/test/daten', neu), 'WEBP', quality=86, method=6); it['mime'] = 'image/webp'
    else: neu = it['file'].rsplit('.', 1)[0] + '.jpg'; im.convert('RGB').save(os.path.join(ziel, 'engine/hypernorm/test/daten', neu), 'JPEG', quality=86); it['mime'] = 'image/jpeg'
    it['file'] = neu; it['width'], it['height'] = im.width, im.height; it['bytes'] = os.path.getsize(os.path.join(ziel, 'engine/hypernorm/test/daten', neu)); it.pop('sha256', None)
m['note'] = m.get('note', '') + ' · Artefakt-Fassung: Bilder verkleinert (WebP/JPG < 2 MB), sha256 entfernt.'
json.dump(m, open(os.path.join(ziel, mpfad), 'w'), ensure_ascii=False, indent=1)
groesste = max(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(ziel) for f in fs)
print('gebaut', ziel, 'Dateien:', sum(len(fs) for _, _, fs in os.walk(ziel)), 'größte Datei MB:', round(groesste / 1e6, 2))
