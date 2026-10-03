# Insel-Baustein · Design-Pattern für die MVP-Slice

Die Insel ist **ein** Baustein mit festen Modulen. Jedes Modul hat einen Besitzer, einen Eingang und einen Ausgang. Es gibt kein Aufsatz-Gelände und keine angeklebten Teile. Diese Trennung hat sich in der Session bewährt. Die Unterseite ist gescheitert, weil sie dagegen verstoßen hat (drei Teile, die sich nur ungefähr treffen).

## Datenfluss
```
Seed + Biom ──► P  Plan        Umriss (2D-SDF aus Hexzellen), Schwerpunkt, Ø
             ──► M  Masken     Fahrbahn · Gehweg · Plätze · Gebäude · Vegetation · Rand   (vor jeder Deko!)
             ──► H  Höhenfeld  natural(x,z) + Straßenbett/Damm/Einschnitt, Biom-Gelände (amp, fq, terrace)
             ──► T  Track Core Straße als Slots (Mitte, Breite) → Fahrbahn-Mesh, Bordkante, Brüstung  [einziger Fahrbahn-Owner]
             ──► K  Körper     Scholle v7: Oberseite + Rand + Felskörper als EIN Mesh             [ersetzt Unterseite v6]
             ──► D  Deko       Bäume/Büsche nur in »Vegetation«, Felsen nur im Rand, Landmarke + Haus auf Plätzen
             ──► S  Stil       Knete v10 (Oberfläche) · Himmel aus sky-core · Licht inkl. warmem Gegenlicht von unten
```

## Regeln
1. **Masken vor Deko.** Nichts steht auf der Straße oder im Wasser, weil die Deko nur in ihre Maske darf.
2. **Ein Mesh für den Körper.** Oberseite, Kante und Felskörper teilen Ecken. Keine getrennten Ringe, keine Überlappung.
3. **Biom = Tabelle, kein Code.** `BIOMES` in `island.js`: pal, sky, terr, under (→ künftig Scholle-Parameter), trees, bushes, treeF, lmk, house. Neues Biom = neue Zeile.
4. **Modelle nur per Pin.** KayKit Forest, Hexagon, Snow, Festive über `RAW(pin, pfad)`. Liste in `ASSET_MANIFEST.json`.
5. **Fremde Modelle nicht verformen.** Low-Poly-Modelle mit Einzelteilen (Hexagon Pack) zerreißen beim Glätten. Sie bekommen nur die Knet-Oberfläche. Für runderen Look siehe S3.
6. **Messwerte im UI.** Tiefe/Ø, Zacken, Dreiecke, Bauzeit, Silhouette gegen Ziel. Die Abnahme macht Georg am Bild.

## Scholle-Parameter (scholle-bench.js, PRESETS)
`depth` wahre Tiefe/Ø · `prof` Breite je Zehntel der Tiefe (gemessen) · `rim` Randdicke/Ø · `inset` · `zack`/`zackD` Zahl und Länge der Zacken · `saw` Sägezahn · `off` Spitzenversatz · `lobes` Umriss · `bands` Farbbänder der Oberseite · `body` Felsfarbe · `elev` Blickwinkel der Benchmark-Kamera (nur für den Vergleich).

## Anschluss an die MVP-Slice
- Mehrere Inseln: je Insel ein Plan und ein Seed, Brücken als Track-Core-Strecke zwischen Plänen.
- Figuren: FrizzleBob über `mountGraft()` (kfb-rigs-embed-v3), CapsuleCarl über `mountCarl()`. Kein eigenes Rig.
- Portale (Hub): Plätze aus Maske »Plätze« sind die Andockpunkte für Projektportale.
