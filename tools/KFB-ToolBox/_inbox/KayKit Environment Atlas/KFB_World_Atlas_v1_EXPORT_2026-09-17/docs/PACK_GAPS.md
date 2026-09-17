# Pack-Lücken · was in den Screenshots steht und was wir wirklich haben

Stand 2026-09-16. Grundlage: Ordner in `georg-doc/kayfabizarro/media/3D_Assets/` (gelesen, nicht erinnert),
die Asset-Registry und die Promo-/Demo-Screenshots im `reference`-Ordner.

## 1 · Nutzbar im Repo (entpackt, Dateien da)

| Pack | Stand | Modul |
|---|---|---|
| KayKit Dungeon Pack 1.1 FREE | 207 Modelle, gltf | 4 |
| KayKit City Builder Bits 1.0 FREE | 41 Modelle, gltf | 2 |
| KayKit BoardGame Bits 1.0 FREE | 162 Modelle | Props, kein Raster |
| KayKit Forest Nature Pack 1.0 FREE | 105 Modelle, gltf | kein Raster, 1 Einheit ≈ 1 m |
| KayKit RPG Tools Bits 1.0 FREE | 49 Modelle, gltf | kein Raster |
| KayKit Block Bits / Fantasy Weapons / Halloween | indexiert | – |
| KayKit Adventurers, Skeletons, Mystery Series 6 + 7 | indexiert | – |
| Kenney City Kit (roads / commercial / suburban / industrial) | glb | 1 |
| Kenney Racing Kit | 112 Modelle, glb — **nur 33 per Ladeversuch bestätigt** (s.u.) | 1 |

## 2 · In den Screenshots zu sehen, im Repo **gar nicht vorhanden**

Diese Packs tauchen in den Promo-/Bundle-Bildern auf, es liegt aber kein Ordner in `media/3D_Assets/`:

- **Space Base Bits** (Screenshot „BITS BUNDLE 1 · SPACE BASE BITS", inkl. „+ ALTERNATE TEXTURE") — kein Pack-Ordner, keine Registry-Einträge.
- **Resource Bits** — nur Referenzbilder, kein Pack.
- **Medieval Hexagon Pack** — **jetzt entpackt im Repo** (S11): 87 Teile per Ladeversuch bestätigt, s. §6.
- **Holiday Bits** (CC0-Release Dez 2025, 55+ Modelle) — kein Pack.
- **Mixed Bag 1** (24 Modelle aus den Live-Show-Folgen 0–4) — kein Pack.
- **Restaurant Bits, Prototype Bits, Furniture Bits** — released, kein Pack.
- **Medieval Village (Exteriors / Interiors / Villagers)** — beim Autor noch in Arbeit, gibt es öffentlich noch nicht.

→ Für 1:1-Nachbauten dieser Screenshots fehlt schlicht die Geometrie. Entweder Pack beschaffen und entpackt einchecken, oder mit Kenney-Äquivalenten arbeiten (Space Base → `SciFI_Ultimate Space Kit_Quaternius`, Hexagon → `kenney_hexagon-kit` / `GLB_hexagon_kit`).

## 3 · EXTRA- / PAID-Tier · im FREE-Pack systematisch nicht enthalten

KayKit liefert pro Pack drei Stufen: **FREE** (CC0-Kern), **EXTRA** (Zusatzmodelle), **SOURCE** (Blender-Dateien).
Was in den Bundle-Promos zu sehen ist, stammt oft aus EXTRA.

### City Builder Bits
FREE hat 41 Teile: Basisplatte, 6 Straßenteile, 8 Gebäude (je mit und ohne Basis), Wasserturm, Straßenlaterne, 3 Ampeln, Bank, Busch, Kisten, Container, Hydrant, 2 Mülleimer, 5 Autos.
Im Bundle-Promo (Parkszene) zu sehen und **nicht** im FREE-Pack:
- Bäume (FREE hat nur `bush`), Hecken, Blumenbeete
- Parkwege, Rasenflächen, Teich/Brunnen
- geschwungene Bordsteine/Randeinfassungen für Parkflächen
- zusätzliche Fassaden-/Stockwerksteile für höhere Häuser

### Dungeon Pack
FREE deckt die Key-Art ab. EXTRA ergänzt weitere Props/Varianten — für den Nachbau der Key-Art nicht nötig.

### Platformer (Screenshot „EXTRA ONLY", blaue Hindernisbahn)
Komplett EXTRA-Tier. Im Repo liegt nur `Platformer Game Kit - Dec 2021` (anderer Ursprung, 113 Modelle) — **nicht** dieselbe Bahn. Ein 1:1 dieses Screenshots ist ohne EXTRA-Kauf nicht möglich.

### Holiday Bits
Kern-Pack ist CC0/FREE, EXTRA ergänzt 30+ Lebkuchen-Teile. Beides fehlt im Repo.

### Forest Nature Pack
FREE hat 105 Teile: Büsche (4 Familien), Gras (2 Familien, je mit `_Singlesided`-Variante), Felsen (3 Größenklassen), Bäume (4 belaubte + 2 kahle Familien).
In den Promo-Bildern zu sehen und **nicht** im FREE-Pack:
- Bodenplatten, Wege, Wasser/Teich, Klippen
- Baumstümpfe, Totholz, Pilze, Farne, Blumen
- Zäune, Brücken, Lagerplatz-Requisiten

### RPG Tools Bits
FREE hat 49 Teile (Schmiede-, Tischler-, Grabungs-, Expeditions- und Lichtwerkzeug).
Nicht enthalten: **Werkbank, Tisch, Regal, Boden** — jede Werkstattszene braucht dafür ein Möbel-Pack (Furniture Bits, nicht im Repo).

## 4 · Konsequenz für die Sprints

- Nachbaubar **heute**: Dungeon Key-Art (S1 ✓), Kenney-Straßenraster (S2 ✓), Racing-Strecken (S3 ✓), City Builder Sample (S4 ✓), City-Straßennetz aus gemessenen Anschlüssen (S5 ✓), Forest-Lichtung (S6 ✓), RPG-Tools-Werkstatt (S7 ✓), Racing-Setup mit Höhenkreuzung (S3b ✓, aus 33 bestätigten Teilen).
- Nachbaubar **nach Entpacken/Einchecken**: alles unter Punkt 2.
- Nicht nachbaubar ohne Kauf: die EXTRA-Inhalte unter Punkt 3 — dort ersetzen wir bewusst mit Kenney/Quaternius statt so zu tun, als hätten wir sie.

## 5 · Kenney Racing Kit · Namensprobe (S3b, 2026-09-17)

`github_get_tree` listet `media/3D_Assets/kenney_racing-kit/Models/` nicht (nur importierbare
Dateitypen, `.glb` fällt durch — gleiches Muster wie BoardGameBits). 5 Ladeversuch-Runden gegen
~110 aus dem Kontaktbogen (`Preview.png`) abgeleitete Kandidatennamen, dazu ein Abgleich mit
`shorepine/kenney` (Fremd-Repo, das Kenneys komplette CC0-Bibliothek spiegelt) — bestätigt
**112 Modelle** für das Kit, aber ohne eigene Dateinamenliste (auch dort nur Text-/Bild-Dateien
gelistet).

**33 von 112 bestätigt**, per direktem Ladeversuch gegen die Roh-URL:
`roadStart, roadStraight, roadStraightLong, roadStraightArrow, roadStraightLongBump, roadRamp,
roadRampLong, roadCrossing, roadPitStraight, roadCornerSmall, roadCornerLarge, roadCornerLarger,
roadSplit, roadSplitLarge, roadEnd, barrierRed, barrierWhite, fenceStraight, fenceCurved, pylon,
flagCheckers, billboard, grandStand, grandStandRound, treeLarge, treeSmall, grass, raceCarRed,
raceCarGreen, raceCarOrange, raceCarWhite, tent, ramp`.

**Nicht gefunden, trotz breiter Namenssuche** (u.a. `bridge*`, `tunnel*`, `building*`, `garage*`,
`pit*`, `lamp*`, `light*`, `banner*`, `screen*`, `tentRed/Green`, `grandStandLarge/Curved/A/B/C`,
`carA-D`, `raceCarBlue/Yellow/Black`, `fenceGate`, `sign*` — volle Liste in
`tools/probe-racing.html`): kein eigenes Brücken- oder Tunnelteil (die Brücke im Kit besteht aus
`roadRamp`/`roadRampLong`), kein Boxen-/Kontrollturm-Gebäude, keine Laterne, keine
Banner-Variante, keine Zelt-Farbvarianten (nur ein einziges `tent`-Modell), nur 4 Fahrzeugfarben
statt der augenscheinlich 5 im Kontaktbogen. Diese Lücken sind in S3b als solche benannt, nicht
mit geratener Ersatzgeometrie überspielt.

## 6 · KayKit Medieval Hexagon Pack · Namensprobe (S11, 2026-09-17)

Die `.gltf`-Dateien werden von `github_get_tree` nicht gelistet (nur die Atlas-PNGs je Unterordner)
— die Ordnerstruktur ist aber sichtbar und war der Schlüssel: `Assets/gltf/tiles/{base,coast,
coast/waterless,rivers,rivers/waterless,roads}`, `buildings/{blue,green,neutral,red,yellow}`,
`decoration/{nature,props}`. 3 Proberunden, ~1000 Kandidatennamen (`tools/probe-hex.html`).

**87 Teile bestätigt:** `hex_grass`, `hex_water`; `hex_coast_A…E` und `hex_coast_A…E_waterless`;
`hex_river_A…L` und `hex_river_A…J_waterless`; `hex_road_A…M`;
`building_{castle,church,windmill,watermill,market,blacksmith,mine,lumbermill,barracks,well,tavern,
home_A,home_B,tower_A,tower_B}_{blue,green,red,yellow}` (15 Typen × 4 Farben);
`tree_single_A/B`, `rock_single_A…E`, `hills_A…C`, `mountain_A…C`;
`barrel`, `ladder`, `sack`, `target`, `tent`, `wheelbarrow`.

**Lücken:**
- Der Ordner `buildings/neutral` enthält etwas (sein Atlas-PNG liegt da), aber keiner von ~50
  probierten Namen traf — die Benennung dieses Ordners ist offen.
- Die Kontaktbögen (`contents_buildings.jpg` u.a.) zeigen deutlich mehr als der FREE-Tier hergibt:
  Stadtmauern, Tore, Wachturm, Marktstände, Bogenschießstand, Katapult/Belagerung, Zaun, Kisten,
  Banner, Tische, Statuen, Felder/Scheunen. Gleiches FREE/EXTRA-Muster wie bei den anderen
  KayKit-Packs (§3) — ohne EXTRA-Kauf nicht nachbaubar, nicht mit Ersatzgeometrie überspielt.
- Die Anschlüsse der Straßen-/Fluss-/Küstenkacheln stecken in der **Atlas-Textur**, nicht in der
  Geometrie — ein Kantenlöser analog `lib/road-solver.js` braucht daher eine Farbprobe
  (`scanEdges()` in `lib/hex-grid.js`, angefangen, Klassifizierung noch nicht belastbar).
