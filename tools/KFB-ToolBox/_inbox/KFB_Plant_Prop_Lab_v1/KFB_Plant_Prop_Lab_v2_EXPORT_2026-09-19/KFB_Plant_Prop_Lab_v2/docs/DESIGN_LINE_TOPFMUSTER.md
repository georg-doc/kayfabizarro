# Design-Linie · Topfmuster (S19)

Ersetzt das Zellraster aus S18. Ein Raster füllt eine Fläche; eine Grammatik baut ein Gefäss.

## Die vier Regeln

1. **Leserichtung.** Von unten nach oben: Fuss → Hauptregister (35–50 % der Höhe) →
   Begleitregister → Kranz unter dem Rand. Kein Topf beginnt mit dem lauten Motiv am Fuss.
2. **Eine laute Stimme.** Höchstens ein Register trägt ein lautes Glyph
   (Punkt, Raute, Zahn, Schuppe, Kreuzblume). Alles andere ist leise
   (Greca, Welle, Doppellinie, Balken, leer).
3. **Wenige, grosse Formen.** Lautes Register 3–10 Motive um den Umfang, leise bis 22.
   Die Zahl folgt der **gemessenen** Bandproportion (quadratische Zellen), nicht dem Regler —
   der Regler verschiebt nur den Maßstab um diesen Anker. Ohne das zerläuft eine Raute
   auf einem flachen Topf zum Zickzackstreifen.
4. **Eine Konturstärke.** Alle zehn Glyphen liefern ein normiertes Feld (`d < 1` = innen,
   `d = 1` = Kontur). Dieselbe Strichstärke über den ganzen Topf — das ist der eigentliche
   Träger von „aus einem Guss", stärker als jede Farbwahl.

## Farbregel

Heller Grund, gesättigtes Motiv, dritte Stimme als Akzent, fast schwarzer Rahmen.
Alle zwölf Paletten folgen ihr; sie unterscheiden sich in Harmonie und Temperatur,
nicht im Aufbau. Gemessen wird, nicht behauptet: `contrastRatio(Grund, Motiv) ≥ 2,6`
ist ein Abnahmetor im Bericht.

Der S18-Fehler war hier: Terrakotta, Kobalt und Tinte hatten einen dunklen Grund mit
fast ebenso dunklem Motiv — aus drei Metern ein brauner Fleck.
`invert` („Dunkler Grund") tauscht Grund und Motiv, lässt Akzent und Rahmen stehen.

## Einzigartigkeit ohne Stilbruch

| Schraube | wirkt auf | brauchbarer Bereich |
|---|---|---|
| `seed` | Registerzahl, Glyphenwahl, Position der lauten Stimme, Phasen | — |
| `wobble` | Registergrenzen und Glyphenmitte, langsame Sinuswelle (die Hand) | 0,25–0,50 |
| `variance` | je Glyph-Instanz: Grösse ±, Höhenversatz, Farbtausch Motiv↔Akzent | 0,30–0,60 |

## Biome

`paletteForBiome(biome, seed)` zieht deterministisch aus der Palettenliste der Zone
(frei / Wüste / Dschungel / Küste / Markt / Hochland / Nacht). Ein Level-Bauer sagt „Wüste"
statt zwölf Paletten zu sortieren; derselbe Seed liefert in derselben Zone denselben Topf.
Palette von Hand wählen setzt `paletteLocked` und hebt den Biomzwang auf.

## Abnahmetore (im `patReport`, nicht im Gewissen)

`oneLoudVoice` · `loudNotAtFoot` · `countsInRange` · `noAdjacentRepeat` ·
`groundReadsAsGround` (≥ 2,6:1) · `frameIsDarkest`

## Bekannte Grenzen

- Flache Töpfe (Verhältnis Umfang/Höhe > 4,2) bekommen höchstens 3 Register — gemessene
  Folge, keine Vorliebe: darunter ist jedes Band schmaler als ein Glyph breit.
- Der UV-Canvas-Weg zeichnet denselben Registerstapel, ist aber Vergleichsbild:
  die Quell-UVs sind nachweislich nicht zylindrisch abgewickelt (r(Umfang) ≈ 0,01).
- Die Greca ist im Shader aus drei Balken gebaut. Sie liest als Mäander, ist aber kein
  echter Stufenmäander mit verschränkten Haken. Offen als P2.
