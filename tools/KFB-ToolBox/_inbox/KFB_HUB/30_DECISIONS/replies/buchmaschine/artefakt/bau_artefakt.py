# Baut die Artefakt-Seiten der Buchmaschinen-Testbühne aus den Bühnenquellen (eine Quelle, zwei Ausgaben: Probebühne und Artefakt).
# python3 bau_artefakt.py <maschine.html> <voxel.html> <zielordner>
# Schreibt <ziel>/index.html (ohne doctype/head/body: der Artefakt-Rahmen setzt sie) und <ziel>/voxel.html (eigene Seite, vollständig).
import re, sys

maschine, voxel, ziel = sys.argv[1:4]
PFADE = [
    ('"three":"../gateA/vendor/three-build/three.module.js"', '"three":"./vendor/three/three.module.js"'),
    ('"three/addons/":"../gateA/vendor/addons/"', '"three/addons/":"./vendor/addons/"'),
    ("'../gateA/donor/", "'./donor/"),
    ("'../kfbsrc/vendor/clay/", "'./kfb/"),
    ("'../gateD/schaelen.js'", "'./modul/schaelen.js'"),
    ("'./schaelen.js'", "'./modul/schaelen.js'"),
    ("'./rostLook.js'", "'./modul/rostLook.js'"),
    ("'./bildVoxel.js'", "'./modul/bildVoxel.js'"),
    ("'./vfx/energy-arc.r1.js'", "'./modul/vfx/energy-arc.r1.js'"),
    ("loadAsync('buch/KFB_Buch_Mensch.r3.glb')", "loadAsync('buch/KFB_Buch_Mensch.r3.gltf.json')"),   # Artefakte liefern kein .glb aus: Buch als glTF-JSON mit eingebetteten Daten
]
def pfade(s):
    for a, b in PFADE: s = s.replace(a, b)
    return s

# ---- Maschine → index.html
s = pfade(open(maschine, encoding='utf-8').read())
style = re.search(r'<style>(.*?)</style>', s, re.S).group(1)
imap = re.search(r'(<script type="importmap">.*?</script>)', s, re.S).group(1)
koerper = re.search(r'<body>(.*)</body>', s, re.S).group(1)
UI_ALT = re.search(r'<div id="ui">.*?</div>', koerper, re.S).group(0)
UI_NEU = ('<div id="ui"><button id="rw">◀ rückwärts</button><button id="st0">❚❚ halt</button><button id="fw" class="on">vorwärts ▶</button>'
          '<select id="sb" aria-label="Sternbild"><option value="orrery">Orrery</option></select><button id="au" class="on">Ablauf</button>'
          '<select id="kam" aria-label="Kamera"><option value="frei">Kamera frei</option><option value="totale">Totale</option><option value="nah">Nah</option><option value="weit">Weit</option></select>'
          '<button id="ton">Ton an</button><a id="vx" href="voxel.html">Voxel-Relief ▸</a></div>'
          '<div id="kopf"><b>Buchmaschine</b> · Testbühne R6 · Orrery-Mechanik, WSB-Buch, Schälhaut, Tesla-Bögen, Rost-Grundfassung</div>')
koerper = koerper.replace(UI_ALT, UI_NEU)
# Ton: Klangspieler der Testbühne an die Ereignisse hängen
koerper = koerper.replace("import { rostLook, verlaufUmgebung } from './modul/rostLook.js'",
    "import { rostLook, verlaufUmgebung } from './modul/rostLook.js'\nimport { createTon } from './modul/ton.js'")
koerper = koerper.replace("const melde = (typ, staerke = 1, ort = null) => ereignisse.push(",
    "const tonSpieler = createTon({ belegung: await (await fetch('ton/belegung.json')).json(), karte: await (await fetch('ton/karte.json')).json() })\n"
    "ton.onclick = async () => { if (tonSpieler.laeuft) { tonSpieler.aus(); ton.textContent = 'Ton an'; ton.classList.remove('on') } else { await tonSpieler.an(); ton.textContent = 'Ton aus'; ton.classList.add('on') } }\n"
    "const melde = (typ, staerke = 1, ort = null) => ereignisse.push(")
koerper = koerper.replace("ereignisse.push({ typ, t: +simZeit.toFixed(3), staerke: +staerke.toFixed(2), rueck: speed < 0 ? 1 : 0, ort: ort ? ort.toArray().map((v) => +v.toFixed(2)) : null })",
    "(() => { const e = { typ, t: +simZeit.toFixed(3), staerke: +staerke.toFixed(2), rueck: speed < 0 ? 1 : 0, ort: ort ? ort.toArray().map((v) => +v.toFixed(2)) : null }; tonSpieler.melde(e); if (ereignisse.length > 2000) ereignisse.splice(0, 1000); return e })()")
koerper = koerper.replace("  buch.updateMatrixWorld(true)\n  haut.update(", "  tonSpieler.rascheln(haut.lose / 300)\n  buch.updateMatrixWorld(true)\n  haut.update(")
# Kamera-Auswahl
koerper = koerper.replace("frame()\n</script>", "kam.onchange = () => { if (kam.value !== 'frei') setCam(kam.value) }\nframe()\n</script>")
css = style + ('#kopf{position:fixed;left:12px;top:10px;color:#dfe3ea;font:13px system-ui;background:#0007;padding:6px 10px;border-radius:8px}'
               '#ui{flex-wrap:wrap;right:12px}#ui a{color:#ffd9a0;font:14px system-ui;padding:6px 4px}')
open(f'{ziel}/index.html', 'w', encoding='utf-8').write(f'<title>Buchmaschine Testbühne</title>\n<style>{css}</style>\n{imap}\n{koerper.strip()}\n')

# ---- Voxel-Gate → voxel.html (zweite Seite, eigener vollständiger Rahmen)
v = pfade(open(voxel, encoding='utf-8').read())
v = v.replace('<body>', '<body><div style="position:fixed;left:12px;top:10px;color:#dfe3ea;font:13px system-ui;background:#0007;padding:6px 10px;border-radius:8px;z-index:2"><b>Voxel-Relief</b> · Membran schält, Relief wächst, zerfällt, fliegt wieder ein · <a href="index.html" style="color:#ffd9a0">◂ Maschine</a> · <a href="voxel.html" style="color:#ffd9a0">neu starten</a></div>')
# im Artefakt läuft das Gate live (die Probebühne nimmt Bild für Bild auf)
v = v.replace("window.__bereit = true", "window.__bereit = true\nrenderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix()\naddEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix() })\nlet uhr = performance.now(); (function lauf() { const t = performance.now(), dt = Math.min(0.05, (t - uhr) / 1000); uhr = t; if (zeit < 19.5) schritt(dt); composer.render(); requestAnimationFrame(lauf) })()")
open(f'{ziel}/voxel.html', 'w', encoding='utf-8').write(v)
print('gebaut:', f'{ziel}/index.html', f'{ziel}/voxel.html')
