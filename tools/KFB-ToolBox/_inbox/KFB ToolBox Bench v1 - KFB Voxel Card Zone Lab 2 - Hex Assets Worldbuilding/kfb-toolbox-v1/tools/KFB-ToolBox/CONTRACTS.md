# ToolBox · Verträge

Was jedes Modul zusichert und was es vom Aufrufer verlangt. Vertrag vor Code — wer eine dieser
Zusagen bricht, bekommt genau die Fehler, die in den READMEs als "schon hinter sich" stehen.

---

## kfb-fluid-v1

**Sichert zu**

- `gutter.wetCells` ist die **einzige** Wahrheit darüber, wo Flüssigkeit steht. Netz, Blasen
  und alles Weitere lesen sie. Keine zweite Nass-Prüfung.
- `measure().quads === measure().wet`. Jede nasse Zelle bekommt genau ein Quad.
- `measure().fluidY - measure().waterLevel === -SUB * 0.25`. Die gezeichnete Ebene liegt nie
  auf dem Höhenraster.
- Das Wassernetz ist **durchgehend** (geteilte Eckpunkte), nicht aus Einzel-Quads. Keine Nähte.
- Gleicher Seed + gleiche Parameter → identische Zellliste. Kein `Math.random` im Feld.

**Verlangt**

- `cell`, `halfX`, `halfZ`, `centerZ` müssen zum Terrain-Raster passen: Zellmitten auf
  `(n + 0.5) * cell`, `centerZ` bei gerader Reihenzahl auf `-cell/2`.
- `layout()` läuft **nachdem** der Zonenboden steht und **bevor** etwas darauf gestellt wird.
- `update(t, dt)` einmal pro Frame. `t` ist Sekunden seit Start, **nicht** dt.
- Wer die Wanne mit eigenem Material baut, prüft die Kalibrierung neu.

**Bricht sichtbar, wenn**

| Verstoß | Symptom |
|---|---|
| eigene Nass-Prüfung | dunkle Löcher in der Fläche, Blasen im Trockenen |
| `fluidY` auf das SUB-Raster gelegt | Schraffur-Flackern gegen Cube-Deckflächen |
| Carve schmaler als `reach()` | Terrain steht im Graben, Wasser über einem Loch |
| Quads statt Netz | helles Raster an den Nähten oder durchreißender Wannenboden |

---

## kfb-beam-v1

**Sichert zu**

- Der Schleier verdreht sich nie (zyklus-erhaltende Zuordnung).
- Kein Springen der Zuordnung im Stand (Hysterese 30 % + exponentieller Nachlauf).

**Verlangt**

- Die Zielecken kommen aus `applyMatrix4(card.matrixWorld)`, nicht aus Position + Größe.
- Boden- und Zielecken beide im **Umlauf** (nicht über Kreuz).
- `dt` wird übergeben, sonst läuft der Nachlauf mit falscher Rate.

---

## kfb-seeds-v1

**Sichert zu**

- Gleiche Karte → gleiche Welt, unabhängig von der Reihenfolge des Aufrufs.
- Der Signatur-Seed hängt nur an der Kartenidentität, nicht am Story-Modus.

**Verlangt**

- `buildBaseline(pool)` **vor** dem ersten `resolve()`. Ohne Basislinie ist jede Zone `heroic`.
- `toCard()` liefert die Feldnamen, die `cardSemanticVector` erwartet: `cardNumber`,
  `cardName`, `power`, `lore`, `gradeReason`, `role`. Die Kompaktform `t/p/l/g` ergibt einen
  leeren Vektor — und dann ändert sich pro Karte nichts.

**Prüfgröße**: `measure().devSpread`. Nahe 0 = die Übersetzung ist wirkungslos.

---

## kfb-cardstack-v1

**Sichert zu**

- `pose(p)` ist zustandsfrei: derselbe `p` ergibt dieselbe Pose, jederzeit neu auswertbar.

**Verlangt**

- Der Pivot hat seinen Ursprung auf der **Unterkante** des Blattes.
- `patchBend()` läuft vor dem ersten Render.
- `pose()` bekommt die **aktuelle** Deckhöhe übergeben, wenn der Zonenboden sich ändern kann —
  sonst schwebt der Stapel.

---

## Nicht als Modul geliefert: die Drone

Drei Zeilen Rezept, falls jemand sie nachbaut: zwei Sägezähne bei 55 Hz und 55·1,007 Hz
(Schwebung, kein Chorus), zusammen durch einen Tiefpass bei 260…1160 Hz, dazu gefiltertes
Rauschen im Bandpass bei 640 Hz. Ein LFO bei 0,07 Hz auf der Filterfrequenz, damit es atmet.
Lautstärke und Filteröffnung hängen am Kameraabstand (130 Einheiten still, 34 voll) — dieselben
Schwellen wie die Kartenberuhigung, damit Bild und Ton denselben Moment meinen.
Grundton folgt der Füllung: Säure 68 Hz, Schlacke 44 Hz, sonst 55 Hz.
AudioContext erst bei der ersten Nutzergeste, sonst blockt der Browser.
