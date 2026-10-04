# Übergabe · S13.3 Requisiten-Durchgang (Dungeon)

Stand 2026-09-17, nach S13.2. Architektur steht und ist geprüft
(`KayKit_Dungeon_Generator_S13_2.html`, `lib/dungeon-grid.js`). Dieses Blatt hält die **gemessenen**
Zahlen fest, die ein Requisiten-Durchgang braucht — damit er nicht bei Null anfängt und nicht
schätzt.

## Der Anlass

Georg an der fertigen Szene: „die Fackel, die vor der Wand schwebt — oder auch möglich: es gibt
noch eine Art wall-prop/Halterung, die genau die Lücke ausfüllt…?"

**Nachgemessen, nicht diskutiert.** Die Fackel schwebt nicht. Beispiel aus der laufenden Szene
(Saat A1, Feld 8×8): Fugenmitte bei x = −2,00, Wandplatte 1,00 dick, ihre Fläche also bei −1,50.
Die Rückenebene von `torch_mounted` liegt bei x = **−1,48**, also **0,02** davor. Der Sichtstrahl
der Kamera trifft die Fackel bei 4,11 und die Wand dahinter bei 4,79. Was als Lücke liest, ist die
**Silhouette des Bauteils** (der Halterungsring sitzt am Ende eines 0,62 langen Arms) plus der
fehlende Kontaktschatten an dieser Lichtrichtung.

**Es gibt keine separate Halterung im FREE-Tier.** 26 Kandidatennamen per Ladeversuch geprüft
(`torch_wall`, `wall_torch`, `sconce`, `bracket`, `wall_hook`, `hook`, `chain`, `chains`, `lantern`,
`lamp`, `banner_wall`, `cage_hanging`, `skull_wall`, `candle_stand`, `brazier`, `chandelier` …) —
**sieben** existieren, und drei davon tragen ihren Wandabstand schon im Pivot.
Ein weiterer Durchgang über 37 Namen für Geländer/Brüstung/Abschluss fand genau ein Teil:
**`barrier`** (4,00 × 1,10 × 0,50) — das ist seit S13.3 Architektur, nicht Requisite
(Fugenklasse `rail`).

| Teil | Grundfläche x × y × z | Asymmetrie z | z von … bis | Lesart |
|---|---|---|---|---|
| `torch_mounted` | 0,55 × 1,06 × 0,62 | **1,00** | 0,00 → 0,62 | Rücken **exakt in der Pivot-Ebene** → Pivot auf die Wandfläche, fertig. So gebaut. |
| `banner_shield_white` | 2,23 × 3,20 × 0,37 | **2,69** | **0,32** → 0,69 | trägt **0,32 Abstand** im Pivot: hängt an einer Stange vor der Wand, nicht auf ihr |
| `shelves` | 2,00 × 1,95 × 0,50 | **2,00** | **0,25** → 0,75 | eigenes Wandregal, 0,25 Abstand — **nicht** dasselbe wie `wall_shelves` (4 × 4 × 1,37, ein Wandteil) |
| `keyring_hanging` | 0,68 × 1,22 × 0,38 | 0,17 | −0,16 → 0,22 | fast mittig → Pivot auf die **Mittellinie** der Wand |
| `candle` | 0,33 × 0,87 × 0,33 | 0,03 | −0,17 → 0,16 | freistehend — **seit S13.3 vom Generator gesetzt** als Lichtquelle in der Zellecke, nicht mehr frei für den Requisiten-Durchgang |
| `torch` | 0,55 × 1,04 × 0,55 | 0,00 | −0,28 → 0,28 | freistehend, zentriert — **keine** Wandvariante |
| `wall_shelves` | 4,00 × 4,00 × 1,37 | 0,27 | −0,50 → 0,87 | Wandteil (Fugenklasse solid), Überstand 0,36 in **eine** Zelle |

**Regel daraus:** der Anker einer Wandrequisite ist nicht die Boxmitte und nicht die halbe
Wanddicke, sondern die **Asymmetrie ihrer eigenen Box**. Asymmetrie ≈ 1 heisst „Rücken im Pivot"
(Pivot auf die Wandfläche), Asymmetrie ≫ 1 heisst „Standoff ist Teil des Bauteils" (Pivot ebenfalls
auf die Wandfläche, der Abstand kommt von selbst), Asymmetrie ≈ 0 heisst „steht frei" (Pivot in die
Zelle). `layout()` in `lib/dungeon-grid.js` rechnet das schon so für die Fackel — die Funktion ist
für die anderen drei unverändert brauchbar.

## Was S13.2 an Platz übrig lässt (gemessen, nicht geschätzt)

- **Modul 4**, Zellmitte auf Vielfachen davon, Deckfläche der Bodenkachel y = 0, Ebenenabstand
  **4,05** (Hub von `stairs_wood`).
- **Überstände in die Zelle:** `wall_pillar` ist 1,50 dick bei Platte 1,02 → **0,24 auf beiden
  Seiten**; `wall_shelves` 0,36 auf **einer** Seite; `wall_cracked` dicker als seine Platte.
  Eine Zelle an einer solchen Fuge hat auf dieser Seite entsprechend weniger Platz.
- **Eckteile fressen die Zellecken:** ein `wall_corner`-Schenkel ist **2,0** lang und 1,0 dick,
  reicht also von seinem Gitterpunkt bis zur Mitte beider Nachbarfugen. Der Bereich innerhalb von
  0,5 um die Wandlinie ist an einer Ecke vollständig belegt.
- **Freier Radius in der Zellmitte** damit: 4,00 − 2 × 0,50 = **3,00** für eine Zelle zwischen zwei
  glatten Wänden, weniger an jeder Fuge mit Überstand.
- **Treppe:** belegt zwei Zellen plus Ankunftszelle; Lauf 6,00, Breite 3,30 — in ihrem Streifen ist
  kein Platz für Requisiten.
- **Fackeln** stehen schon: eine je sechs Zellen Raumfläche, nur auf Fugen ohne Überstand, Höhe
  0,55 × Wandhöhe. Eine Requisite darf nicht auf dieselbe Fuge.

## Gates für den Durchgang (Vorschlag, nach dem Muster S11/S13.2)

- keine Requisite in einem Durchgang (`door`-Fuge) oder auf einer Wand
- keine Requisite in einer Zelle, deren Fuge einen Überstand in genau diese Zelle hat
- keine Requisite im Treppenstreifen und nicht in der Ankunftszelle
- Bodenkontakt gemessen (`auditGround`/`snapToSurface` aus `lib/kit-lab.js`), nicht gesetzt
- Durchdringungen 0 nach `relaxOverlaps` mit **gemessenen** Fussabdruck-Radien (S11: sechs
  Kollisionen auf null)
- Wegegraph unverändert: eine Requisite darf keine Zelle unpassierbar machen — Breitensuche über
  die Zellen vor und nach dem Durchgang vergleichen
- Draufsicht-Pixelprobe: jede `door`-Fuge bleibt im Bild offen, jede Zellmitte bleibt Boden

## Nachgelieferte Teile (Georgs Asset-Übergabe, commit `10a7fdce`)

Aus `kfb.asset-handoff.v1`. Alles im Dungeon-Pack ist über `loadAsset('dungeon', name)` direkt
ladbar; die anderen Packs brauchen einen Eintrag in `PACKS` (`lib/kit-lab.js`).

| Teil | Pack | Stand |
|---|---|---|
| `candle_lit`, `candle_thin_lit` | Dungeon | **in Benutzung** als Lichtquelle, Flamme gelöst |
| `torch_lit` | Dungeon | vorhanden, **nicht gesetzt** — Flamme sitzt in der Schale, kein Trennschnitt |
| `candle`, `candle_thin` | Dungeon | stille Zwillinge, liefern die Trennhöhe |
| `candle_melted`, `candle_triple` | Dungeon | frei für den Requisiten-Durchgang (keine Flamme) |
| `shelf_small_candles` | Dungeon | Wandregal mit Kerzen — Wandrequisite, Asymmetrie messen |
| `torch`, `torch_burnt` | RPGToolsBits | anderer Atlas (`tools`), Maßstab prüfen |
| `skull_candle`, `shrine_candles`, `plaque_candles` | HalloweenBits | eigener Atlas, Pack in `PACKS` ergänzen |
| `fire-basket` | GLB_graveyard | **der fehlende Feuerkorb** für Licht in der Raummitte — Kenney-Colormap, Stilbruch prüfen |
| `campfire_*`, `Campfire_Base` | Kenney nature / Mystery | Lagerfeuer, für Aussen- oder Höhlenszenen |
| `fire_01/02(_a).png` | FX_Visual (brackeys) | Flammen-Sprites mit Alpha — Option für Glut/Rauch, aber ein Billboard passt schlechter zum Low-Poly als die Pack-Geometrie |

`kenney_survival-kit/campfire-pit.glb` ist im Manifest als **`dependencyStatus: missing`** markiert
(Textur `Textures/colormap.png` fehlt) — nicht verwenden, ohne die Textur nachzuziehen.

## Offen / Entscheidung Georg

- **Bereits belegt, nicht mehr frei:** `torch_mounted` (Wand) und `candle` (Zellecke) setzt der
  Generator seit S13.3 als **Lichtquellen**. Wer sie als Deko verschiebt, macht einen Raum
  unlesbar — die Leseprobe meldet das.
- **Georg liefert Props nach**, falls im FREE-Tier nichts passt. Bestandslage aus S13/S13.3:
  Fass, Kiste, Truhe, Regal, Bett, Tisch, Stuhl, Knochen, Schädel, Schüttgut existieren;
  **Falle, Statue, Sarkophag, Altar, Käfig, Kronleuchter, Kohlepfanne fehlen**. Ein Kerzenständer
  (`candle_stand`) fehlt ebenfalls — das wäre das Teil, das eine Kerze auf Hüfthöhe bringt und
  Licht in die Raummitte trägt, ohne den Weg zu verstellen.
- **Raumbedeutung UND Streu** (Georgs Wahl): der Typ bestimmt die Streuung, Dichte ~30 %,
  Requisiten dürfen **an Rändern** stehen, die Zellmitte bleibt frei — damit bleibt der Wegegraph
  unberührt und ist trotzdem prüfbar (Breitensuche vor und nach dem Durchgang vergleichen).
  Das Pack hat dafür **keine** Falle, Statue, Sarkophag, Altar, Käfig (S13, per Ladeversuch) —
  Bedeutung muss aus Fässern, Kisten, Regalen, Betten, Tischen, Knochen, Truhen entstehen.
- **Licht ist erledigt** (S13.3, `lib/dungeon-light.js`): drei Stimmungen, Punktlicht-Pool,
  Kontaktschatten an Wand und Boden, Leseprobe als Gate. Für Requisiten heißt das: jede neue
  Requisite braucht eine Bodenscheibe (`addContactShadows`) und darf die Leseprobe nicht unter
  die Schwelle drücken — ein Schrank vor der einzigen Fackel macht einen Raum unlesbar, und genau
  das fällt dann im Balken auf.
- **Zugekaufte Pack-Teile** (wall_end, T, Kreuz, Türblatt als Objekt, Fallen) würden mehrere
  Grenzen von S13 aufheben; dann lohnt ein Nachtrag am mentalen Modell, nicht am Generator.
