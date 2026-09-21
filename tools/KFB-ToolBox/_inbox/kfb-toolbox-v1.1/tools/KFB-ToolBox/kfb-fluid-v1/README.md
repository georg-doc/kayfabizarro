# kfb-fluid-v1 — Wasser, Gräben, Flüsse

Der Wassergraben um eine Card Zone: Wanne, Oberfläche, Uferverlauf, Flusslauf, Strömung,
Blasen. Herausgelöst aus **KFB Card Zone Lab v2** (2026-09).

## Dateien

| Datei | Was | three.js nötig |
|---|---|---|
| `kfb-fluid-field.js` | Feldmathematik: welche Zelle, wie hoch, wie nass, wohin fließt es | nein |
| `kfb-fluid-shader.js` | ShaderMaterial + Netz-Erzeugung + Füllungs-Tabelle | ja |
| `kfb-gutter.js` | Zusammenbau: Wanne als InstancedMesh, Wasser als Netz, Terrain-Bindung | ja |
| `kfb-bubbles.js` | Aufsteigende Blasen aus nassen Zellen | ja |
| `index.js` | Sammel-Einstieg + `mountFluidSystem()` | ja |

Die Trennung ist Absicht: `kfb-fluid-field.js` lässt sich ohne Renderer testen. Zellzahlen,
Wasserlinie und Strömungsvektoren sind Zahlen, keine Screenshots.

## Kürzester Weg

```js
import { mountFluidSystem } from './kfb-fluid-v1/index.js';
import * as boxKit from './kfb-box-material.js';

const water = mountFluidSystem({
  THREE, scene, terrain, boxKit,    // terrain = voxel-terrain v10 (optional), boxKit nicht
  cell: 3, halfX: 24, halfZ: 13.5, centerZ: -1.5,
  rows: 3, river: true, riverWidth: 3, seed: 42,
  zoneTopAt: (x, z) => zone.topAt(x, z),
  palette: wc.palette,
});
water.layout(zone.cells());          // nach jeder Änderung am Zonenboden
// im Loop:
water.update(t, dt);                 // t = Sekunden seit Start, dt = Frame-Zeit
console.table(water.measure());
```

`mountFluidSystem` ruft `terrain.setCarve()`, `terrain.setCarvePath()` und
`terrain.setZones()` selbst auf. Ohne Terrain funktioniert alles außer der Ufer-Anpassung
an die Geländehöhe.

## Das Niveau-Modell

```
Zonenboden, Hauptniveau   ──────────────   Modus der Zellhöhen
Wasserlinie               ─ ─ ─ ─ ─ ─ ─    1,5 D6-Stufen darunter   (klassifiziert)
gezeichnete Ebene         ─ ─ ─ ─ ─ ─ ─    nochmal 0,25 Stufen tiefer
Wannenboden               ______________   eine halbe Zelle tiefer
Außenufer                 Terrainhöhe, aber nie unter der Wasserlinie
```

Zwei Höhen für das Wasser, nicht eine. **waterLevel** klassifiziert (nass/trocken, rastet auf
`SUB = cell/6`), **fluidY** wird gezeichnet und liegt bewusst NICHT auf dem Raster — sonst wird
die Ebene mit Cube-Deckflächen koplanar und der Tiefenpuffer streitet. Das war im Lab das
sichtbare Flackern.

## Die fünf Fehler, die dieses Modul schon hinter sich hat

1. **Grabenbreite als Bruchteil der Zonenkante.** Ergab auf der kurzen Achse eine einzige
   Reihe — aus jedem schrägen Blickwinkel von ihrer eigenen Wand verdeckt. `rows` zählt jetzt
   Zellreihen.
2. **Carve mit gemeinsamem Pad.** Der Ring ist pro Achse bemessen (Chebyshev), der Carve war es
   nicht: auf der kurzen Achse fehlte dem Graben die Außenwand.
3. **Ufer mit Höhendeckel.** Der Deckel griff bei fast jeder Zelle, also war das Ziel praktisch
   immer der Deckel und nie das Terrain — ein gleichmäßig hohes Band mit rechteckiger
   Außenkante. Der gezeichnete Rahmen, nur eine Reihe weiter außen.
4. **Ufer-Rauschen über achsenparallele Koordinaten.** Unter Spiegelung unverändert, also auf
   beiden Achsen deckungsgleich. Jetzt läuft es über die Bogenlänge `perimS()`.
5. **fbm direkt verwendet.** Der Wert clustert um 0,5 (gemessen 0,44…0,79); die Quantisierung
   schluckte die Streuung weg. Dafür gibt es `spread()`.

Dazu die Nebenwirkung, die am längsten gebraucht hat: **eine Wahrheit für "nass"**. Liegt eine
Zelle unter der Wasserlinie, muss sie auch unter `WMARGIN` liegen, sonst gilt sie als nass,
bekommt aber kein Quad — dunkle Löcher in der Fläche. `field.isWet()` ist die einzige Stelle,
an der das entschieden wird; Netz, Blasen und Audio lesen sie alle.

## Strömung

`aFlow` ist ein **Vertex-Attribut**, kein Uniform: Stillwasser und Fluss liegen im selben Netz.
Betrag 0 = isotropes Wabern, Betrag 1 = voller Längstransport. Die Stärke rampt über den Abstand
zum Lauf aus, auch in den Graben hinein — sonst schaltet die Animation an der Mündung hart um.

## Messung

```js
water.measure()
// { cells, wet, dry, river, waterLevel, fluidY, quads, vertices, flowMax, calibration, bubbles }
```

Gemessen auf der ToolBox Bench (cell 3, halfX 24, halfZ 13.5, rows 3, Fluss an, Breite 3,
Stufen 0.60, Absenkung 0.0, Seed 42, Modus forbidden, Füllung Säure):

| Größe | Wert |
|---|---|
| Grabenzellen | 274 |
| davon nass | 202 |
| davon Fluss | 88 |
| Wasser-Quads | 202 |
| Wasserlinie y | −0.75 |
| gezeichnete Ebene y | −0.875 (Δ −0.125 = SUB·0.25) |
| Strömung max | 1.000 |
| Wasser-Texturen | dudv+map geladen |
| Wannen-Material | kfb-box-material |
| Ufer-Kalibrierung | 0.598 |

## Texturen sind nicht optional

Beide aus dem KFB-Repo, als SourceRef geladen — **nicht mitkopieren** (KFB-Regel 1):

- `media/3D_Assets/KFB/waterdudv.jpg` → Verzerrung
- `media/3D_Assets/KFB/water.jpg` → Struktur (entsättigt, multiplikativ; **nicht** Farbquelle)

`mountFluidSystem` lädt beide automatisch. Der Code läuft auch ohne sie — aber dann ist es
ein **anderer Shader-Pfad**: `texture2D` auf einen leeren Sampler liefert Null, `duv` wird
zur Konstanten −0.3 (keine Verzerrung mehr) und `tex` wird 1.0 (keine Struktur). Übrig bleibt
ein flaches Rauschfeld. Genau das war der Fehler in v1.0.0 — siehe
`../POSTMORTEM_2026-09-21_SHADER.md`.

`measure().textures` sagt, ob sie hängen. `FEHLEN` heißt: das Bild ist nicht das Lab-Bild.

## Wortlaut

Vertex- und Fragment-Shader sind Zeile für Zeile aus
`KFB Card Zone Lab v2.dc.html#buildFluidSurface()`. Der Schaum-Block ist in der Quelle
konstruktiv tot (`u = 0.5` → `shore = 1` → `foam = 0`) und bleibt hier tot. Eine Kopie, die
abgeschalteten Code einschaltet, ist keine Kopie.

## Status

`TESTED RESULT` — v1.1.0, mountet und läuft auf `KFB ToolBox Bench.dc.html`, Zahlen oben
gemessen, Bild in `screenshots/01-beweis.png`.

v1.0.0 war ein Nachbau (Schaum eingeschaltet, Texturen fehlten, falsches Wannenmaterial) —
Post Mortem in `../POSTMORTEM_2026-09-21_SHADER.md`.
