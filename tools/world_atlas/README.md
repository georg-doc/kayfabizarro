# KFB Kit Lab · portabler Export

**Exportrevision:** 2026-09-17-r1
**Claude-Design-Projekttitel:** `KayKit Atlas Preflight Access`
**Selbstbezeichnung im Code:** `KFB Kit Lab` (Seiten S1–S13.3)
**Exportstatus:** `EXPORT_COMPLETE` · ein Test offen (`START_TEST_NOT_RUN`)

## Was das ist

15 eigenständige Browserseiten, die KayKit- und Kenney-Packs laden, ihre Bauteile **zur Laufzeit
messen** und aus den gemessenen Maßen Szenen lösen. Kein Build, keine Bundler-Kette: pro Seite eine
HTML-Datei plus ES-Module aus `source/lib/` und `source/scenes/`.

Der jüngste Stand ist `KayKit_Dungeon_Generator_S13_2.html` (BSP-Dungeon-Generator, zwei Ebenen,
Licht S13.3) mit `source/lib/dungeon-grid.js` und `source/lib/dungeon-light.js`.

## Assets liegen bewusst nicht im Paket

Alle `.gltf`/`.glb` werden zur Laufzeit von der **kanonischen RAW-URL** geladen:

```text
https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/
```

Das ist die Architektur, nicht eine Lücke. Georg hat den Exportauftrag an dieser Stelle korrigiert:
**alle Assets via GitHub.** Der Auftrag §3 verlangt „echte Bytes im Paket" — diese Forderung gilt
für dieses Projekt nicht. Ein Paket mit eingebetteten Packs hätte drei Nachteile und keinen Vorteil:
es veraltet gegenüber dem Asset-Repo, es sprengt jedes Größenbudget, und es erzeugt eine zweite
Wahrheit neben der Asset Registry.

Ebenso extern: **three.js 0.184.0** per Importmap von `unpkg.com` (gepinnte Version).

Das Paket ist damit **online** lauffähig, nicht offline — beabsichtigt. Es wurde keine
Ersatzgeometrie erzeugt und kein Modell nachgebaut.

## Ein offener Punkt

Der Start aus dem entpackten Paket über HTTP ist in der Exportumgebung **nicht ausgeführt**
(`NOT_RUN`, keine Shell). Alle übrigen Prüfungen liegen mit Zahlen vor. Siehe
`docs/TEST_REPORT.md`.

Davon unabhängig, und ein echter Mangel: die RAW-URL zeigt auf `main`, nicht auf einen
Commit-SHA — siehe `docs/KNOWN_ISSUES.md` §1.

## Namensfrage · ungelöst, nicht stillschweigend geklärt

Der Exportauftrag bezeichnet dieses Projekt als `KFB_World_Atlas_v1` und erwartet unter §4
Terrain-/Landmark-/Prop-Kombinationen, Pfad-Presets, Burg/Schloss/Mine und drei Travel-Basisvarianten.

**Das existiert hier so nicht.** Dieses Projekt ist eine Preflight-Werkbank für Pack-Geometrie.
Was an Atlas-nahen Teilen vorhanden ist, steht in `docs/FEATURE_PARITY.md`; was der Auftrag nennt
und hier fehlt, ebenfalls. `KayKit Atlas Preflight Access` und `KFB_World_Atlas_v1` sind in diesem Paket **nicht** gleichgesetzt.

## Start

Siehe `START_HERE.md`. Kurz: `python3 -m http.server` im Ordner `source/`, dann eine Seite öffnen.
`file://` funktioniert nicht (ES-Module + CORS).
