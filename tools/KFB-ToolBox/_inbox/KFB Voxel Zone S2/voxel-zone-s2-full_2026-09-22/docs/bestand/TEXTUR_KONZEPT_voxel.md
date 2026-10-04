# Textur-Konzept für die Voxel-Box-Sprache (KFB)

**Frage von Georg (2026-07-25):** wie gehen wir mit Texturen um, damit es nicht repetitiv,
nicht kleinteilig und nicht fotorealistisch wirkt — und was taugt aus dem `Textures/`-Ordner?
Das hier ist die Antwort als Arbeitsgrundlage. Kurz, damit man sie anwenden kann.

## 1 Das mentale Modell: in dieser Welt macht die Textur NICHT den Look

Ein Voxel-/Papertoy-Bild liest sich über **Silhouette + Flächenwert**: Oberseite hell,
Seiten dunkler, harte Kante dazwischen. Alles, was ein *erkennbares Muster* mitbringt
(Ziegel, Planken, Grashalme, Holzfaser), kämpft gegen die Würfelgröße und fängt an zu kacheln.

Deshalb bekommt eine Fläche höchstens **drei** Textur-Aufgaben:

| Layer | Aufgabe | Frequenz | Woher |
|---|---|---|---|
| **Kante / Bevel** | Fläche vom Nachbarn trennen, „gebaut" wirken | 1 Kachel pro Fläche, ganze Wiederholungen | `edge3` (getestet) · edge1/2 als Variante |
| **Fleck / Verlauf** | Material lebt, Nachbarn hängen zusammen | **sehr** niederfrequent (1 Fleck über 4–8 Würfel) | prozedural (Welt-Noise) oder stark skalierte Foto-Map |
| **Korn** | Papier/Ton-Anmutung, tötet CG-Sauberkeit | fein, aber in **Welt**-Skala | `noise.png` |

Was **nicht** hierher gehört: Normal-/Bump-Maps (bei Cel-Shading unsichtbar bis hässlich),
Roughness-Detail, Displacement, und jede Map, deren Muster man einzeln erkennen kann.

## 2 Die vier Regeln, die die Fehler von heute erklären

1. **Ganze Wiederholungen, nie angeschnitten.** Eine Säule 6,3 Zellen hoch mit `repeat.y = 6,3`
   schneidet die Kachel an → Linien laufen als Streifen durch die Fläche. `floor(h + 0.5)`.
2. **Orientierung ist heilig.** UV-Rotation/Offset pro Instanz macht aus jedem Muster Bruch.
   Variation gehört auf **Werte** (Helligkeit, Sättigung, Ramp), nicht auf Ausrichtung.
3. **Variation muss gekoppelt sein.** Zufall pro Würfel liest sich als Glitch-Flickenteppich
   („Rotton, blau, blau"). Der Zufall muss aus einem **Orts-Rauschen** kommen, dann liegen
   Nachbarn im selben Fleck → es liest als Materialwechsel.
4. **Muster-Maßstab an der Welt, nicht an der Fläche.** Ziegel gehören über **Welt-UV**
   (triplanar) auf die Mauer: durchlaufend, aufrecht, Ziegelhöhe ~0,2–0,5 Einheiten.
   Pro-Face-Mapping macht aus jedem Würfel eine eigene Briefmarken-Wand.

## 3 Was mit dem vorhandenen `Textures/`-Satz geht (99 Material-Ordner, CC0)

Die Maps sind für PBR-Realismus gebaut — direkt genutzt sind sie zu klein und zu fotografisch.
Sie funktionieren aber als **Fleck-Layer**, wenn man sie so behandelt:

- **stark skalieren** (eine Kachel über mehrere Würfel, Welt-UV),
- **entsättigen + Kontrast dämpfen** (~50 %) und nur **multiplikativ** auflegen (20–60 %),
- **posterisieren** (3–5 Luminanz-Bänder) → aus dem Foto wird Cel/Claymation,
- Tint kommt immer aus der Story-Palette, nie aus der Textur.

So sind `Clay001/002/004`, `clay_floor_001`, `CardboardSet001`, `Chipboard*`, `Paper*`,
`Carpet016`/`Fabric*` (Filz), `dry_river_pebbles`, `marble_rock_02`, `rock_wall_16` sehr wohl
brauchbar — als **Terrassen-Charakter pro Biom**, nicht als Oberflächen-Detail. Genau die
Zuordnung steht schon in `zone-index.json` (Biom → Textur pro Ebene) — der Contract passt,
nur die Anwendung war falsch.

**Nicht brauchbar bleiben:** alles mit erkennbarem Objekt-Muster in Fotoauflösung
(Fliesen, Pflaster, Fingerprints, Ziegel in Nahsicht) als Face-Map.

## 4 Empfehlung (Reihenfolge)

1. **Jetzt:** `edge3` als einziger struktureller Layer + prozedurales Welt-Noise für Flecken +
   `noise.png`-Korn + Cel-Bänder. Kein Foto nötig, nichts wiederholt sich sichtbar.
   → genau das ist der aktuelle Stand von `KFB Voxel Zone S1.dc.html`.
2. **Nächster Schritt, wenn Biome eigenen Charakter brauchen:** pro Biom **eine** Foto-Map aus
   `Textures/` als gedämpfter Fleck-Layer über Welt-UV dazu (Rezept §3). Ein Regler „Material-Stärke",
   damit du den Punkt selbst findest.
3. **Neue Texturen suchen lohnt nur für einen Fall:** handgemalte/cartoon **Kanten- und
   Fleck-Kacheln** (wie edge3, nur mehr Auswahl). Photoreale Sets bringen nichts dazu.
4. **Nicht bauen:** Normal-Maps, Detail-Tiling, per-Face-Muster.

*Merksatz: in der Box-Sprache variiert man Werte, nicht Orientierungen — und Muster gehören
an die Welt, nicht an die Fläche.*


---

## 5 Entscheidung (2026-07-25, nach dem dritten Review): Material-System statt Textur-Bau

Georgs Einwand ist der richtige: kleinteilige Foto-Texturen funktionieren auf Entfernung nicht und
passen nicht in eine Welt aus klaren Boxen. Ab hier gilt:

**Aus dem Textur-Ordner bleibt genau EINES übrig: die edge-Kachel als Kanten-Fassung.**
Sie ist getestet, sie ist die visuelle Klammer, und sie liegt auf *allen* Materialien — deshalb
gehören unterschiedliche Boxen sichtbar zur selben Welt. edge1/edge2 sind Varianten davon,
kein Ersatz.

**Alles andere ist prozedural im Shader** — sechs Basis-Materialien, in Welt-Koordinaten:

| Material | Machart im Shader | Rolle |
|---|---|---|
| `karton` | breite Wolke + feine Wellfaser | Wellpappe-Wildnis |
| `ton` | weiche Knet-Blasen (smoothstep-Fleck) | Ton-Ebenen |
| `filz` | feiner Flor, entsättigt | Filz-Sumpf |
| `stein` | grobe Flecken + dunkle Fugen | Katakomben, Mauern |
| `papier` | fast flach, lange Striche | Zeitungsstadt, Kuppen |
| `glatt` | nichts, reine Palette | Referenz / UI-nahe Flächen |

Vorteile, warum das der schnellere Weg ist: **kein Download**, **keine Wiederholung** (Welt-Noise
statt Kachel), **Maßstab frei regelbar**, **Story-Palette bleibt die einzige Farbquelle** — und ein
Material ist eine Zeile im Shader, keine Datei-Suche. Terrassen tragen das Material, nicht einzelne
Würfel (sonst Flickenteppich).

Foto-Maps sind zu einem **Regler** degradiert (`Foto-Fleck-Layer`, default 0): wer will, legt eine
stark skalierte, entsättigte Map als Fleck darüber. Standardweg ist sie nicht mehr.

**Harte Cel-Kanten sind weg.** Statt Quantisierung jetzt *weiche* Wert-Bänder
(`smoothstep` innerhalb der Stufe, Regler `Wert-Bänder`) — gemalt statt Cartoon-Outline.

## 6 Was den Rest der Anmutung macht: LICHT, nicht Textur

Der verbleibende „gebastelt"-Eindruck kommt nicht von den Flächen, sondern von den Fugen: es fehlt
die Verschattung *zwischen* den Würfeln. Nächste Schritte in dieser Reihenfolge (jeder einzeln
sichtbar, keiner braucht neue Assets):

1. **Kontakt-Verschattung / Höhen-AO** — Würfel dunkeln nach unten und in Nischen ab
   (aus der Nachbarschaft im Höhenfeld berechnet, ein Instanz-Wert, kein Post-Effekt).
2. **Weiches Rim-Light in Story-Mode-Farbe** an den oberen Kanten → fasst die Zone zusammen.
3. **Höhen-Nebel / Tiefenauflösung** wie im Terrain-Shader (`exp2`-Fog in die Himmelsfarbe).
4. **Sanftes Glühen** auf den hellsten Kuppen (der `uGlow`-Kanal aus `voxel-terrain.js`).

Erst danach lohnt eine Feinjustage der Materialien.


## 7 Die Fassung wird prozedural — das System kommt ohne PNG aus (2026-07-25, 5. Runde)

Georgs Befund: auch mit einer einzigen Kachel bleibt ein **Raster** — jede Fläche trägt dieselbe
Fassung, das liest sich auf Distanz als Muster. Konsequenz: auch die Kanten-Fassung wird gerechnet.

**`kfbFrame(cellUv, worldPos, width)`** — das Prinzip von edge3, nur mathematisch:

- Abstand zum Zellenrand → weiche Fuge (`smoothstep`), Breite und Tiefe als Regler,
- **Breite moduliert aus Welt-Rauschen** → keine zwei Flächen gleich,
- **organisches Ausfransen** über ein zweites, feineres Rauschen (das „Abnutzungs-Fading", das an
  edge3 gefällt),
- **fleckenweises Auftreten**: ein sehr niederfrequentes Feld entscheidet, ob eine Region überhaupt
  Fugen zeigt. Das ist der eigentliche Hebel gegen das Raster — ohne ihn wirkt jede Zelle als Kachel,
- Oberseiten bekommen die Fassung gedämpft (0,55×), damit die Draufsicht ruhig bleibt.

**`kfbStripe(worldPos, normal)`** — streifige Seitenflächen aus **demselben** Rauschen
(warp-modulierter Sinus über die Welt-Höhe, nur auf Seitenflächen). Damit lassen sich hohe
Strukturen bauen, die **kein Fugenraster** brauchen: Streifen statt Zellen.

Regler: `Fugen-Tiefe` · `Fugen-Breite` (0 = fugenlos) · `Streifen (Seiten)` ·
Fassung umschaltbar **prozedural / edge3-PNG / aus** (der PNG-Weg bleibt als Referenz drin).

**Damit ist das System PNG-frei** — es lädt nur noch `noise.png` fürs Korn (und das ließe sich
ebenfalls rechnen). Kein Textur-Suchen, kein Kombinieren, kein Optimieren von Einzeldateien mehr.

### Übertrag auf die Kenney-Assets (für S4)

Kenney-GLBs bringen ihre `colormap.png` mit — die bleibt. Darüber lässt sich **dieselbe
Shader-Bibliothek als Overlay** legen: `kfbMaterial()` + die fleckenweise Abnutzung, multiplikativ,
in Welt-Koordinaten. Ergebnis: Kenney-Requisiten tragen dieselbe organische Alterung wie die
Voxel-Architektur — ohne die Assets anzufassen und ohne neue Texturen. Das ist die Naht, die aus
„Kenney-Requisiten in einer Voxel-Welt" **eine** Welt macht.


## 8 Der Standard-Weg gegen Wiederholung: stochastisches Sampling (2026-07-25, 6. Runde)

Befund: prozedurale Muster kippen ab einem gewissen Punkt selbst ins Repetitive, und die
Streifen/Schraffur wirken kleinteilig. Was ohne Ausnahme funktioniert hat, ist die **helle
Fugenkante** (edge3-Prinzip). Also: Fuge als Stilmittel behalten, Fläche mit **echten Texturen**
füllen — und die Wiederholung mit dem Verfahren brechen, das Games dafür benutzen.

**Stochastisches Sampling / Tiling-and-Blending** (Inigo Quilez; Heitz & Deliot, „Procedural
Stochastic Texturing by Tiling and Blending", Unity Labs 2019): pro virtueller Kachel ein
zufälliger Versatz, benachbarte Kacheln überblendet. Eine kleine Textur deckt beliebig große
Flächen, ohne dass ein Muster sichtbar wird. Kein Handbau, kein Vorprozess in unserer Variante
(2×2-Blend statt Histogramm-LUT), ein Regler von 0 (gekachelt) bis 1 (gebrochen).

Implementiert als `kfbStoch()` / `kfbStochTri()` in `kfb-box-material.js`.
Zusätzlich: die Textur wird **luminanz-normalisiert** aufgelegt (die Farbe kommt weiter aus der
Story-Palette), behält aber 42 % Eigenwert — sonst sehen Papier und Stein gleich hell aus.

**Demo: `KFB Material Bench.dc.html`** — fünf Blöcke nebeneinander, links nach rechts:
Papier (`Paper003`) · Karton (`CardboardSet001`) · Filz (`Fabric048`) · Ton (`Clay004`) ·
Stein (`rock_wall_16`). Gleiche weiße Fuge auf allen, Tusche-Kontur darüber. Regler:
Stochastik, Textur-Größe, Struktur-Stärke, Fugen-Stärke/-Breite, Story-Tint.

**Damit ist die Reihenfolge geklärt:** erst Material-Blöcke einzeln beurteilen (diese Bank),
dann die guten in die Zone übernehmen. Prozedurale Muster (Streifen, Schraffur) bleiben als
**Special Effect** im Werkzeugkasten, nicht als Grundausstattung.


### Review-Fix zur Bank (2026-07-25)

Der erste Wurf hat den A/B-Beweis nicht getragen — drei Ursachen, alle behoben:

1. **Kachel-Dichte zu grob:** `photoScale` 0,22 bei 4×4-Blöcken heißt *weniger als eine Kachel
   pro Fläche* — Wiederholung kann gar nicht entstehen. Regler heißt jetzt **„Kacheln pro Einheit"**
   (0,2–5, Default 1,6).
2. **Struktur wurde weggerechnet:** die Luminanz-Normalisierung nahm genau den lokalen Kontrast,
   der eine Textur sichtbar macht. Jetzt 72 % Rohwert + Kontrast-Anhebung.
3. **Versatz zu klein:** eine halbe Kachel reicht nicht, um das Muster zu brechen — jetzt freier
   Versatz über mehrere Kacheln.

Dazu **Block-Beschriftung in der 3D-Ansicht** (Sprite pro Block) plus Legende im Panel.
Belegt bei 3 Kacheln/Einheit: Stochastik 0 zeigt das wiederholte Muster pro Fläche, bei 1 ist es
eine durchlaufende, unregelmäßige Oberfläche.
