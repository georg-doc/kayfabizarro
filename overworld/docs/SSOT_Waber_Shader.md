# SSOT — Waber- und Morph-Shader (Herkunft, Pfade, Zahlen)

**Stand:** 2026-08-09 · **Auftrag:** Georg, 9.8.: *»als gute Waber & Morph Shader hatten wir ja die
Skydome-Shader von KFB Travel v12 → da müssen nur die Parameter für Frequenz etc. angepasst werden →
unbedingt mit Pfad und Info persistieren!«*

Dieses Blatt ist die eine Stelle, an der steht, **wo der Shader liegt, was er kann und mit welchen
Zahlen er läuft.** Wer den Waber ins 2D-Terrain holt, liest hier und nicht im Gedächtnis.

---

## 1 Wo er liegt

| Was | Pfad |
|---|---|
| Quelle (WebGL / three.js) | `terrain-v12/skydome-shader.js` — 350 Zeilen |
| Läuft in | `KFB Travel v12.dc.html` |
| Statische Himmel (Texturen) | `media/3D_Assets/Textures/Skyboxes/` im Repo |
| 2D-Nachfahre, schon im Overworld | `overworld/skyshade-2d.js` (`OW_SHADE`, `shade-v1.0`) |

**Wichtig, damit niemand Zeit verliert:** die Quelle ist **GLSL auf einer three.js-Kuppel**. Das
Overworld ist eine 2D-Leinwand — der Code lässt sich nicht einsetzen, der **Algorithmus** schon.
`OW_SHADE` ist bereits die CPU-Übersetzung davon (dieselben Regler `warp` · `contrast` · `flow`);
was fehlt, ist die **Faltung** — und genau die macht den Waber organisch statt wolkig.

---

## 2 Die beiden Verfahren

### `'S'` — Nebel
Domain-warped fbm über 4 Oktaven, Farbrampe in drei Farben, dazu »flow ribbons«.
Kette: `fbm` als **Vektor** (drei Aufrufe mit Versatz 5.2 / 9.1) verzerrt die Richtung, dann `fbm`
auf dem verzerrten Feld, dann ein zweites feineres `fbm` als Detail.

```
w      = vec3(fbm(dir*0.75 + ph*0.5), fbm(dir*0.75 + ph*0.5 + 5.2), fbm(dir*0.75 - ph*0.35 + 9.1)) * warp
warped = dir*0.7 + w
field  = fbm(warped*0.95 + ph*0.4)
detail = fbm(warped*2.6 - ph*0.7)
ribbon = sin(ph*3.0*flow + field*6.283 + dir.y*3.5)
```

Die **Frequenzen** sind die Zahlen, die Georg meint: Grundfeld 0,75 · verzerrtes Feld 0,95 · Detail
2,6. Für Boden statt Himmel müssen sie hoch (kleinere Flecken), für Fluide runter.

### `'A'` — Waber (das eigentlich Gesuchte)
Kaleidoskopisch **gefaltetes** domain-warped Rauschen: drei Faltungen mit zwei Drehungen dazwischen.
Herkunft: RC-v11.

```
q = dir*uScale
q += vec3(fbm(q*0.6+ph*0.4), fbm(q*0.6+4.1-ph*0.3), fbm(q*0.6+8.7)) * (twist*0.5)   // bricht die Symmetrie
q = abs(q) - foldOff;        q = rotY(q,  twist)
q = abs(q) - foldOff*0.7;    q = rotY(q, -twist*1.3)
q = abs(q) - foldOff*0.5
n = fbm(q + ph)
```

**Warum das nicht wiederholt:** `abs(q) - off` klappt den Raum an einer Ebene; drei Faltungen mit
zwei Drehungen zwischen ihnen ergeben ein Muster, dessen Periode aus drei nicht kommensurablen
Schritten zusammengesetzt ist. Der Vektor-Warp **vor** der ersten Faltung bricht die Symmetrie, damit
die Faltebenen nicht auf der Blickachse zusammenlaufen (das war der Nadelstich im Zenit).
Standard: `uScale 0.9`, `uFoldOff (0.92, 1.08, 0.92)`.

---

## 3 Die Zahlen je Story-Mode (`MODE_FEEL`)

Reihenfolge wie die Story-Modi: Tragic · Comic · Absurd · Heroic · Mystical · Forbidden.

| # | Modus | warp | twist | contrast | flow |
|---|---|---|---|---|---|
| 0 | Tragic | 0,7 | 0,35 | 0,8 | 0,5 |
| 1 | Comic | 1,1 | 0,60 | 1,1 | 1,4 |
| 2 | Absurd | 1,7 | 0,95 | 1,4 | 1,7 |
| 3 | Heroic | 1,0 | 0,45 | 1,5 | 1,1 |
| 4 | Mystical | 0,9 | 0,50 | 0,9 | 0,7 |
| 5 | Forbidden | 1,5 | 0,80 | 1,6 | 1,3 |

Uniforms, die von außen gesetzt werden: `uPhase` (integriert, läuft nie in eine Schleife) ·
`uEnergy` · `uBeat` · `uWorldMix` · `uExposure` · `uColA/B/C` · `uSphWarp` · `uContrast` · `uFlow` ·
`uSpeed` · `uScale` · `uTwist` · `uFoldOff`.

**Der Antrieb ist eine Integration, kein Modulo.** `uPhase` wird aufaddiert und nie zurückgesetzt —
deshalb läuft das Bild nie in eine Schleife. Wer es auf `t % T` umstellt, baut die Wiederholung
selbst ein.

---

## 4 Was `OW_SHADE` heute schon hat, und was fehlt

`overworld/skyshade-2d.js` führt zehn Paletten mit denselben Reglern:

- sechs Biome, gedämpft (`hof` · `wildnis` · `goblins` · `verlies` · `lager` · `wasserland`),
  `modus: 'overlay'`, `alpha` 0,16–0,20 — sie **tönen** den gebackenen Boden, sie ersetzen ihn nicht;
- vier Fluide, deckend (`wasser` · `bubblegum` · `oel` · `saeure`), `modus: 'source-over'`, mit
  `glanz` (Öl) und `puls` (Säure) als Eigenheiten.

**Es fehlt die Faltung.** Heute rechnet `OW_SHADE` auf einem Gitter (`schritt: 26` Weltpixel,
`maxGitter: 88`, `jedes: 3` Bilder) — das ist die Sparfassung, die die 90-ms-Falle vermeidet, aber
sie hat kein `abs(q) - off`. Der nächste Schritt ist also nicht »Shader portieren«, sondern
**drei Faltungen und zwei Drehungen in die Backfunktion einsetzen** und die drei Frequenzen aus §2
auf Feldmaßstab bringen.

---

## 5 Randbedingungen für den 2D-Einsatz (nicht verhandelbar)

1. **Der Waber gehört in die Kachel.** Kein Composite über bildschirmgroße Flächen — gemessen am
   8.8.: 90 ms je Bild. Die Pixelarbeit passiert einmal beim Backen über 512², nicht jedes Bild über
   die Bühne.
2. **Nicht-Wiederholung kommt aus Überlagerung, nicht aus Auflösung.** Zwei bis drei gebackene
   Schichten, je mit eigener Driftrichtung, eigenem Tempo und einem aus der Feldposition gesäten
   Phasenversatz. Zwei gegenläufig rotierende Spiralen ergeben eine Schwebung, deren Periode
   praktisch nie erreicht wird.
3. **Boden fast unmerklich, Fluide deutlich.** Sonst schwimmt der Untergrund unter den Sprites.
4. **Voller Fluss im Ruhezustand, gedämpft bei Aggro.** Ein Fluss, dem man mit den Augen folgen will,
   konkurriert mit dem Skelett, das auf einen zuläuft. Das ist derselbe Regler wie die Shader-Drossel
   im Kampf — nur mit einem Grund statt einer Ausrede.
5. **Auf »läuft« gaten, nicht auf »existiert«.** Ohne `OW_SHADE` muss die Fläche eine Farbe bekommen,
   nicht ein Loch.
