# G1 · Town Source-Isolation · lokales Original-Lab-Protokoll R2
Stand: 2026-10-10 · **ausführbare Testanweisung, nicht ausgeführt / nicht visuell freigegeben**

## 1. Verifizierte Bestandteile (kein zweiter World-Owner)
- Eigentümer und einzig vorgesehene Laufzeit: bestehendes **KFB Island Worldbuilder Lab** auf `sync/lab-rkit-2026-10-09`.
- Viewer ist bereits vorhanden: `tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/originals.html` und `src/originals.ts`, Three.js 0.186.1 + `FBXLoader`.
- Exakte Quelldateien unter dem privaten lokalen Lab-`public/assets/streakbyte/Models`: `LPFI_PortLand/Floting Base.fbx` (300.044 Byte; Dropbox-Original), `LPFL_BackyardLand/Backyard Base.fbx` (47.996 Byte). Assets niemals ins öffentliche Repo kopieren.
- Das Original-Lab definiert `BASES` mit den IDs `port` und `backyard`. Es veröffentlicht `window.__kfb.info`, `analyze(id)`, `setCamera(preset)`; sein vorhandenes `tools/shoot.mjs` erzeugt Bilder und JSON-Log.
- Historische Bilder (2026-10-08; **kein** isoliertes G1-Vieransichten-Paar): Dropbox `/CLAUDE/KFB Island Worldbuilder Lab/tools/out/orig__all.jpg`, `orig__forest.jpg`, `orig__pond.jpg`, `orig__beach.jpg`. Historischer Lauf `orig.json` hat `ready=true`, **1** 404 in Browserconsole, sonst 0 PageErrors.
- **Wichtige Quellgrenze:** `originals.ts` lädt die PortLand-Atlastextur und legt **dieselbe Textur auf alle Originalbasen**, auch Backyard. Deshalb dürfen seine Farben bei einer Quelle-gegen-Quelle-Materialprüfung nicht als native Backyard-Materialidentität akzeptiert werden. Das erste Gate bewertet **Geometrie/Silhouette/Unterseite**, nicht endgültiges Material.

## 2. Bereits gemessener Vergleich (Original-Lab vom 8. Oktober)
Das ist eine *historische, auf W=60 normierte* Messung aus `tools/out/measure.json`, keine neue G1-Source-Isolation.

| Messung | Port / Hafen | Backyard / Garten |
|---|---:|---:|
| Dreiecke (Originalmessung) | 1.585 | 700 |
| Unterseiten-Tiefpunkte (Algorithmus) | 6 | 22 |
| relative Gras-/Deckplatte zu W | 0,026 | 0,037 |
| Erdmasse-Tiefe zu W | 0,434 | 0,506 |
| Tiefe, falls auf 40 MC Breite vereinheitlicht | ca. 30,52 H | ca. 35,59 H |
| relative Deckplatte, falls auf 40 MC Breite vereinheitlicht | ca. 1,83 H | ca. 2,60 H |

Rechenbasis: `H=3.64` Lab-Einheiten, `MC=6.4` Lab-Einheiten, Town-Zielbreite `40 MC = 256 Lab = 70,33 H`. Eine Umrechnung aus der alten **W=60 Norm** wäre `256/60 ≈ 4,267`. **Das ist ausdrücklich kein nativer FBX-Importfaktor.** Dessen Wert ist `256 / max(window.__kfb.info.port.size[0], window.__kfb.info.port.size[2])` und muss lokal am Original ausgelesen werden.

**Vorläufige Ableitung:** Port bietet bei vergleichbarer Breite die weniger ausgezackte Unterseite (6 statt 22 lokale Tiefpunkte), geringere Tiefenmasse und ist mit 1.585 Dreiecken innerhalb des 20k-Gates. Kein technischer Messwert beweist die verlangte runde Kante, organische Erdalterung oder KayKit-Kompatibilität. Port bleibt **A zur Sichtprüfung**, Backyard **B**, nicht Georgs `picked`.

## 3. Tatsächliche Source-Isolation herstellen (lokale, rückbaubare Diagnose, nicht GitHub-Runtime)
In der **lokalen Lab-Kopie** (nicht im `main`/Runtime-PR) die existierende `src/originals.ts` temporär diagnostisch erweitern. Exakter Zielanker ist die bestehende Funktion `setCamera(p: any)`. Diese Funktion lokal **nur für den Messlauf** durch die folgende ersetzen; danach aus dem lokalen Sicherungsexemplar wiederherstellen. Das alte Viewer-Modul, die Original-FBX und der Renderer bleiben Eigentümer; keine neue Runtime/kein Zweit-Viewer.

```ts
function setCamera(p: any) {
  if (p === 'all') {
    for (const [, w] of objs) w.visible = true;
    controls.target.set(0, -10, 0);
    camera.position.set(60, 140, 330);
    controls.update();
    return;
  }
  const [id, angle = '34'] = String(p).split(':');
  const targetObject = objs.get(id);
  if (!targetObject) throw new Error('G1_UNKNOWN_SOURCE_ID:' + id);
  for (const [key, w] of objs) w.visible = (key === id);
  const bbox = new THREE.Box3().setFromObject(targetObject);
  const center = bbox.getCenter(new THREE.Vector3());
  const span = bbox.getSize(new THREE.Vector3());
  const radius = Math.max(span.x, span.y, span.z) * 2.7;
  const direction = angle === 'front' ? new THREE.Vector3(0, 0, 1)
    : angle === 'side' ? new THREE.Vector3(1, 0, 0)
    : angle === 'below' ? new THREE.Vector3(0.2, -1, 0.25)
    : angle === '34' ? new THREE.Vector3(0.75, 0.6, 1)
    : (() => { throw new Error('G1_UNKNOWN_ANGLE:' + angle); })();
  controls.target.copy(center);
  camera.position.copy(center).add(direction.normalize().multiplyScalar(radius));
  camera.up.set(0, 1, 0);
  controls.update();
}
```

**Kontrollhinweis:** Das ist ein temporärer Diagnose-Ersatz für `setCamera`, **kein** dauerhaftes Einchecken der Lab-Runtime. Vorher Datei kopieren, danach wiederherstellen. Bei G1-Bauarbeit nicht unbemerkt parallel zur RKIT-/Lab-Steuerung die Quelldatei verändern; den lokalen Executor koordinieren.

## 4. Vier Ansichten/Objekt, Messprotokoll, kein Fake-PASS
Im bestehenden lokalen Lab nach Patch und Sicherung:

```bash
pnpm dev
# In einem zweiten Terminal im Lab-Verzeichnis:
node tools/shoot.mjs --base http://127.0.0.1:5192 --url /originals.html --name g1_port_v1 --png --size 1200x900 --presets 'port:front,port:34,port:side,port:below' --eval 'window.__kfb.info;;window.__kfb.analyze("port")'
node tools/shoot.mjs --base http://127.0.0.1:5192 --url /originals.html --name g1_backyard_v1 --png --size 1200x900 --presets 'backyard:front,backyard:34,backyard:side,backyard:below' --eval 'window.__kfb.info;;window.__kfb.analyze("backyard")'
```

Erwartete (noch **nicht erzeugte**) Dateien: `tools/out/g1_port_v1__port_front.png`, `...port_34.png`, `...port_side.png`, `...port_below.png`; analoge vier für Backyard sowie `g1_port_v1.json`, `g1_backyard_v1.json`.

**Pflichtchecks in jedem Bild/Log:** Nur das benannte Original sichtbar; identische Neutral-Lichtung/Kameraentfernung nach Objektbreite; kein anderes Modell/Props/Tricktext; 3/4 zeigt tragende Oberfläche und Silhouette, below zeigt tatsächliche Unterseite; Aufnahme-Canvas ohne Error; `__kfb.analyze` trianguliert >0, `__kfb.info.port.size` und `info.backyard.size` enthalten positive native X/Y/Z; nativer `k2Factor = 256 / Math.max(size[0],size[2])` getrennt für beide; inhaltlicher Farbvergleich erst mit korrekt zugeordnetem Originalmaterial.

**Abbruch / Evidenzstatus:** Wenn lokale Assets fehlen oder der Viewer nicht lädt: in Recovery `SOURCE_VISUAL_BLOCKED` statt `PASS` eintragen; keine Fantasie-Ansichten generieren, kein synthetisches Modell als Original verkaufen. Der Lauf benötigt keinen Cloudflare-/Live-Gate.

## 5. Übergabe ans G1-Blatt
Nur nach tatsächlichem Lauf Screenshots als Referenzen **mit Quelle/Ansicht/Datum** verlinken, nicht als generierte `referenceViews` und nicht als `goldenRef`. Gekaufte FBX bleiben privat; veröffentlichte Vorschaubilder nur im Rahmen der tatsächlichen Pack-Lizenz. `picked` bleibt `null`, bis Georg konkret die Form wählt. Anschließend G1-JSON/Markdown, Recovery, additive Changelog und Testbericht nachführen.

**Genau ein Gate:** Quellobjekte Port vs Backyard isoliert als echte vier Bilder pro Objekt plus native bbox in K2 prüfen. Keine neue Insel bauen.
