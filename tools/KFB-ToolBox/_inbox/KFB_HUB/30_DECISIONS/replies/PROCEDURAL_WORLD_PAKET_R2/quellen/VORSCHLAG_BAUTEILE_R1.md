# Vorschlag · Codes je Bauteil statt je Fläche (V-809 Teil 2) · WSB · 2026-10-25
Nur Vorschlag, nichts gebaut. Probe: `vorschlag_bauteile/` (Skripte `scripts/bauteile_probe.py`, `scripts/bauteile_render.py`), Blatt `vorschlag_bauteile/PROBE_bauteile_theater_mesa.jpg`. Ob gebaut wird, entscheidet WS0.

## Warum
Die B9-Teile sind Texturflecken: Fugen, gemalte dunkle Linien und die Voronoi-Ersatzteilung großer glatter Flächen. Eine Flächen-Regel über diesen Teilen (V-808, r808b) zerlegt gekrümmte glatte Flächen in viele Stücke, deshalb bleiben die Flecken (Bühnenlippe, Sockel, Mesa-Felskörper). Der Vorschlag teilt deshalb nach der Geometrie des Spiel-Meshes.

## Wie die Bauteile entstehen
1. **Verschweißen:** Ecken des Spiel-Meshes nach Lage verschweißen (Raster 1e-5 der Bühnendiagonale). Zwei Dreiecke sind Nachbarn, wenn sie eine Kante teilen.
2. **Knick:** Eine Kante ist Knick, wenn die Dreiecksnormalen um mehr als **40°** abweichen. Bauteil = zusammenhängende Dreiecke ohne Knick.
   - Glatte, gekrümmte Flächen ohne Knick (Bühnenlippe, Sockelrund, Felskörper) bleiben ein Bauteil. Genau das soll die Flecken beseitigen.
3. **Fehlform „schluckt zu viel“** (Mesa-Wahrzeichen 46 % in der Knick-Probe): Ein Bauteil über **15 % der Bühnenfläche** wird nach vorherrschender Richtung (oben, unten, ±x, ±z) geteilt und neu zusammengesetzt.
   - Probe: größtes Bauteil Theater 9,6 %, Mesa 10,9 %.
4. **An die Stein-IDs rasten:** Jeder B9-Stein (V-406, COLOR_1.RG) gehört ganz zu dem Bauteil, das den größten Teil seiner Fläche hat. Ein Bauteil ist damit eine Gruppe von Steinen.
   - Es gibt keine neue Eckentrennung; „ein Code je Stein“ bleibt wahr.

## Code je Bauteil
- Flächengewichtete Mehrheit der Stein-Codes nach den V-806-Regeln (Wand und Turm, Oberseite, Laub).
- Die V-806-Ausnahmen gehen vor und behalten ihren Code: Boden 0, Laub 6/7/8, schlanke Türme und Amphitheater-Bögen 1, ohne Rolle 255.
- Fokus bleibt genau ein Teil (V-808): ganzer Rahmen bzw. Wahrzeichen-Fläche, Code 5; Bildschirmfläche 255 (V-329).
- **Abgelöst würde die V-808-Zeile:** „Ein Code gilt je zusammenhängender Fläche: Flächen, die über Kanten verbunden sind und deren Normalen höchstens 35° vom Mittel der Fläche abweichen …“. An ihre Stelle träte: „Ein Code gilt je Bauteil des Spiel-Meshes (Knickkanten > 40°, Bauteil ≤ 15 % der Bühne, an Stein-IDs gerastet)“. Ausnahmen und Fokus aus V-806/V-808 bleiben.

## Stein-IDs (V-406)
- R+G (Stein-ID) bleibt Byte für Byte, das Sprengsel-Modul sieht dieselben Steine. Nur B (Rolle) wird je Bauteil gesetzt.
- Weil Bauteile Steingruppen sind, bleibt „ein Code je Stein“ wahr. Steine eines Bauteils tragen denselben Code, ihre IDs unterscheiden sie für die Sprengsel weiter.
- Für WS1 kann die Zuordnung Stein → Bauteil als GLB-Extra (`kfb_r803.bauteile`) mitgehen. Nötig ist sie für die Laufzeit nicht.

## Was unverändert bleibt
„Bauteil“ ist nur die Einteilung für den Code in COLOR_1. Mesh, Normalen, UV, COLOR_0, Materialien, Bilder und die Browser-Fassung bleiben byte-gleich (V-136). Das Hash-Gate prüft das wie bei r808b.

## Gate-Prüfung
Die Bauteile mit demselben Skript und denselben Parametern neu berechnen; die Teilung ist deterministisch. Dann prüfen:
- je Bauteil genau ein Code, außer bei Ausnahme-Steinen;
- je Stein genau ein Code;
- Code 5 nur am Fokus, Bildschirm 255;
- kein Bauteil über 15 %;
- R+G, A, COLOR_0 und alle übrigen Kanäle byte-gleich zur Quelle;
- Asset-Pass vollständig (M5).

## Probe (Diagnose, ohne Kritiker)
| Bühne | Dreiecke | Roh-Bauteile | nach Rasten | geteilt (> 15 %) | größtes | Steine umgesetzt |
|---|---|---|---|---|---|---|
| Theater | 435 484 | 26 024 | 1385 | 1 | 9,6 % | 731 von 7976 |
| Mesa | 199 742 | 16 021 | 1074 | 1 | 10,9 % | 283 von 2833 |

- **Theater:** Die Bauteile folgen den Bauteilen des Modells (Säulen, Gesimse, Vorhänge, Felder). Die Säulen werden `tower`, der Korpus `hill[0]`, viel ruhiger als das Stein-Mosaik. An der linken Seitenwand bleiben einzelne `tower`-Flecken: Steine, die zwei Bauteile überspannen.
- **Mesa:** Die Gesteinsschichten werden zu vielen Blöcken, der Code ist weithin einheitlich `hill[0]`. Auf der Kappe bleiben einzelne `rock`-Flecken.
- Die Probebilder sind enger gerahmt als die ungetönte Spalte (eigene Kamera der Vorschau).

## Offene Punkte
- Meshy-Oberflächen sind uneben, deshalb gibt es 16 000–26 000 Roh-Bauteile. Erst das Rasten an die Steine macht daraus 1000–1400 brauchbare Bauteile. Ein höherer Knickwinkel (50–60°) wäre zu prüfen.
- Die restlichen Flecken kommen aus den B9-Codes selbst, weil die Mehrheit mit den heuristischen Codes zählt. Bessere Ruhe brächte ein Code je Bauteil aus der Geometrie: Richtung (Oberseite → top, steil → hill[0], schlank → tower). Das wäre eine weitere Regeländerung.
- Aufwand für den Bau aller 21 B9-Dateien: Skript steht als Probe. Bau, Gate-Erweiterung und Bildpaare kosten etwa einen halben Tag.
