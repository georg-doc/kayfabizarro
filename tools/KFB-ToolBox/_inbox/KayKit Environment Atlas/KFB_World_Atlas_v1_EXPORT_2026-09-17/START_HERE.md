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
