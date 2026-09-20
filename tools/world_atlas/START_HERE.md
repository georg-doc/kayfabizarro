# Start

## Voraussetzungen

Ein aktueller Desktop-Browser mit WebGL2 und Internetzugang. Kein Node, kein npm, kein Build.
Internetzugang ist **erforderlich und beabsichtigt**: Modelle kommen über die kanonische RAW-URL
aus `georg-doc/kayfabizarro`, three.js von unpkg (siehe `README.md`).

## Starten

```sh
cd source
python3 -m http.server 8080
```

Dann im Browser:

| Seite | URL |
|---|---|
| Dungeon-Generator (jüngster Stand) | http://localhost:8080/KayKit_Dungeon_Generator_S13_2.html |
| **R02 Room Blueprint · S14** | http://localhost:8080/KayKit_Dungeon_Room_Blueprint_S14.html |
| Dungeon-Modell / Pack-Inventar | http://localhost:8080/KayKit_Dungeon_Model_S13.html |
| Hex-Insel | http://localhost:8080/KayKit_Hex_Realm_S11.html |
| Hex-Kacheltabelle | http://localhost:8080/KayKit_Hex_Tile_Model_S12.html |

Die vollständige Liste der 15 Seiten steht in `EXPORT_MANIFEST.json` unter `pages`.

`file://` schlägt fehl: die Seiten verwenden ES-Module und laden Modelle per CORS.

## Was zuerst prüfen

1. Lädt `KayKit_Dungeon_Generator_S13_2.html` und zeigt der Prüfbalken in der Leiste („☰",
   Abschnitt **Stand**) grüne Zahlen? Dann sind Modelle, Messung und Proben durchgelaufen.
2. Bleibt der Balken bei „messe Bauteile…" stehen oder meldet die Konsole 404 auf
   `raw.githubusercontent.com`, ist der Asset-Pfad das Problem, nicht der Code.
   Siehe `docs/KNOWN_ISSUES.md` §1.

## Messwerkzeuge

`source/tools/` enthält 11 Sonden, mit denen die Pack-Maße ursprünglich ermittelt wurden
(`probe-dungeon-parts.html`, `truth-hex-axes.html`, `measure.html` …). Sie sind Teil des
Arbeitsverfahrens, nicht Beiwerk: jede Zahl in `lib/` kommt aus einer dieser Seiten.


## S14 · R02 Room Blueprint

Aktueller isolierter Room-Authoring-Kandidat: `source/KayKit_Dungeon_Room_Blueprint_S14.html`.
Er übernimmt die bereits akzeptierte S21-R02-Komposition und den In-place-Editor in den World-Atlas-Owner.
Browser/editor: **15/15 PASS**. Blender: echte `.blend` gebaut; automatisches Linux-Review-Rendering nach
dem Save an EGL blockiert und gemäß Recovery-Regel eingefroren. Siehe
`rooms/R02_s21_blueprint/TEST_REPORT.md` und
`failure-recovery/S14_BLENDER_REVIEW_GATE_2026-09-20/START_HERE.md`.

S14 ist noch **kein BSP-/Raid-Runtime-Modul**. Genau das bleibt bis zur menschlichen Room-/Blender-Abnahme getrennt.
