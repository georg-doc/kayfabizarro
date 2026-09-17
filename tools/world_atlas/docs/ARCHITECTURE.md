# Architektur

## Schichten

```text
Seite (S1…S13.2, je eine HTML-Datei)
  ├─ Importmap → three 0.184.0 (unpkg)
  ├─ lib/kit-lab.js        Messkern · Loader · Viewer · Audits · Pixelprobe
  ├─ lib/<solver>.js       Gitter-/Kettenlogik der jeweiligen Familie
  ├─ lib/dungeon-light.js  Lichtrig (nur S13.2)
  └─ scenes/<szene>.js     komponierte Szene, wo die Seite nicht selbst komponiert
```

Es gibt keinen gemeinsamen Anwendungsrahmen und keinen Router. Jede Seite ist ein eigener
Einstiegspunkt; `lib/` ist die geteilte Bibliothek. `tools/` sind Messsonden ohne Produktrolle.

## Das tragende Prinzip: gemessen statt angenommen

Kein Maß ist im Code als Konstante gesetzt, die nicht aus einer Sonde stammt. `measure()` liest
nach dem Laden die gerenderte Bounding-Box jedes Bauteils; `measured` ist die Karte
`name → {size, min, max}`. Alle Platzierungen rechnen gegen diese Karte, nicht gegen Nennmaße.
Das ist mehrfach der Unterschied zwischen richtig und falsch gewesen — die Belege stehen in
`../CHANGELOG.md` und in `github.md` (`docs/SOURCE_github.md`).

## Zwei Merkmalsträger, zwei Modelle

| Pack | Merkmal sitzt auf | Solver |
|---|---|---|
| Medieval Hexagon | der **Kachel** (6 Kanten, Klassen g/s/w) | `hex-grid.js`, `TILE_EDGES` |
| Dungeon | der **Fuge** (Kante zwischen zwei Zellen) | `dungeon-grid.js`, Fugenliste als Set `min|max` |

Im Dungeon ist der Boden die Zelle und die Wand ein eigenes Objekt auf der Kante. Die Fugenliste ist
ein Set mit kanonischem Schlüssel — zwei Objekte auf einer Fuge sind damit strukturell unmöglich,
nicht bloß geprüft.

Fünf Fugenklassen: `solid`, `door` (nur `wall_doorway`, die einzige begehbare), `gate`
(sichtbar, gesperrt), `open`, `rail` (`barrier`, gemessen 4,00 × 1,10 × 0,50 — Balkonkante).

## Warum BSP

Das Pack hat kein `wall_end`, kein T und kein Kreuz. Also müssen alle Wandzüge geschlossen und
achsparallel sein und in `wall_corner` einlaufen. BSP erzeugt ausschließlich Rechtecke mit rechten
Winkeln — es ist nicht gewählt, sondern die einzige passende Zerlegung. Die Wandlänge folgt aus dem
gemessenen Eckschenkel 2,0 (= halbe Fugenlänge): Fuge ohne Ecke → volles Teil, mit einer Ecke →
`wall_half`, mit zwei Ecken → kein Teil.

Die Treppe wird **zuerst** gesetzt: gemessener Hub 4,05, Lauf länger als ein Modul, braucht einen
reservierten Streifen und einen Schacht ohne Boden. Der Rest wird darum gelöst.

## Prüfverfahren: zwei unabhängige Proben auf die fertige Szene

Masken-Audits prüfen den Solver gegen sich selbst — in S11 blieben sie grün, während jede Kurve
spiegelverkehrt lag. Deshalb prüfen hier zwei Proben die **assemblierte Szene**:

1. **Draufsicht-Pixelprobe** (`makeTopDownProbe`): rendert flach eingefärbt und liest Pixel an
   Weltkoordinaten. Findet Lage und Identität. Kann Begehbarkeit **nicht** sehen — von oben ist ein
   Durchgang ein Rechteck wie jede Wand.
2. **Waagerechter Strahl** quer durch jede Fuge in Türhöhe. Türen müssen ihn durchlassen, Wände
   nicht. Diese Probe hat das Türblatt `wall_doorway_door` gefunden, das jede Tür versperrte.

Regel daraus: **jede neue Darstellung braucht ihre eigene Gegenprobe gegen die Geometrie**, nicht
gegen die vorige Darstellung. Dreimal belegt (UV-Scan, Pixel-Scan, SVG-Diagramm — dieselbe Achse
gekippt).

## Licht (S13.3)

Ein schattenwerfendes Key-Light von oben plus Hemisphäre tragen die Lesbarkeit; Fackeln und Kerzen
sind Akzent (2,4 cd in Promo, Reichweite 9). Punktlichter werfen **keine** Schatten — ein Punktlicht
im Bauteil projiziert dessen Silhouette hyperbolisch auf den Boden. Abfall ist `decay 1` (1/r),
nicht physikalisch 1/r²: bei 0,8 Abstand zur Wand und 0,1–0,15 herausragenden Mauersteinen bekommt
der vordere Stein sonst das Doppelte des hinteren (der „Spiegelkabinett"-Effekt).

Lichtempfänger werden je Etage über Ebenen-Masken getrennt; ohne Schattenkarten gibt es keine
Verdeckung, also schien Licht der unteren Etage durch den 0,15 dünnen Boden. Gemessen 0 Leckagen.

Die Flamme ist Pack-Geometrie, freigestellt über eine **Texel-Familie** am UV-Schwerpunkt, die sonst
nirgends im Teil vorkommt (grün 0,117,80 an der Wandfackel; hellwarm 246,151,117 bei r>235 und
r−b>100 an der Kerze). 4 von 4 Leuchtbauteilen gelöst.

## Abhängigkeitsrichtung

```text
Asset Registry (georg-doc/kayfabizarro)  ← nur lesender Konsument, keine Rückschreibung
        ↓ RAW-URL
lib/kit-lab.js PACKS
        ↓
Solver → Szene → Audits/Proben → Prüfbalken
```

Dieses Projekt schreibt nirgends. Es hat keinen Server, keine Persistenz und keinen Zustand über
den Seitenaufruf hinaus.
