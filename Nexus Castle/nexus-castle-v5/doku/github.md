repo: georg-doc/lietz-nexus
branch: main
path: client/public/assets/themes/tiny-swords-cc0, client/src/game, client/src/game/terrain

## Last sync

date: 2026-09-01T13:40:00Z

### Updated in this project

- **`KFB SpinBallPop v4.html`** (Kopie von v3) — Kamerabewegung als abschaltbare Option (Default aus),
  Durchlässe gemessen und drei Engstellen gefixt, Spielfeld ist jetzt eine echte KFB-Karte.
- **CardBuilder eingebaut**, aus `georg-doc/kayfabizarro@main` zur Laufzeit über **jsdelivr**:
  `skills/kfb-card-builder.js` (zieht `kfb-ink-canon.js` + `kfb-card-format.js` relativ nach —
  Regel 7, eine Herkunft je Modul-Stack). Der frühere **pages.dev-Import des Ink-Kanons ist
  entfernt**; die Attrappen-Karte malt jetzt mit `builder.ink`.
- Karten-Daten über raw: `media/kfb/index.json` (133 Decks, 6321 Karten) + je ein Deck-JSON und
  die zugehörige PDF-Seite. `pool()` wird bewusst NICHT benutzt — es lädt alle Deck-JSONs.
- **three-Konflikt entschieden statt umgangen:** der Builder bekommt die THREE-Instanz des Spiels
  (0.185.1) übergeben. Er benutzt nur Group, Mesh, PlaneGeometry, MeshBasicMaterial, CanvasTexture,
  SRGBColorSpace, DoubleSide — zwischen 0.160 und 0.185 unverändert. Kein zweiter three-Build.
- Laufzeit-Bezug unverändert: `dice_ugur_lowpoly.glb`, `kenney_prototype-kit/**`.
- **Kartenschnitt: blindes Viertel** (Entscheidung Georg). Zwei Laufzeit-Messverfahren gebaut und
  verworfen — Begründung als Zahl: 116 von 130 Decks haben genau vier Karten je Seite. Offen bleibt
  `deck.cardGrid` **im Manifest** für die Decks, die ihre Karten mit Rand platzieren.
- v4 eingecheckt und exportiert: `HANDOVER-SpinBallPop-v4.md`, Paket unter `export/`.
- Nichts dauerhaft kopiert.

### Vorige Einträge

### Vorige Einträge

### Updated in this project

- **`KFB SpinBallPop v2.html` ist `red-reddington/web-demos@main → neon-gutter/index.html`**, als Datei
  im Projekt (nicht nachgebaut). Physik, Flipper-Feel, Plunger, Audio, HUD unangetastet; vier
  KFB-Eingriffe: Kartenformat-Vorlauf (`CARD_AR 1.74`, Querformat mit `pad`), Ugur-Würfel als Kugel,
  KFB-Karte mit Ink-Outline unter dem durchsichtigen Lack, Kenney-Körper auf den Bumpern.
  Lizenzlage (MIT-Badge ohne LICENSE-Datei) in `HANDOVER-SpinBallPop-v1.md` §7 — vor Auslieferung
  klären.
- Aus `georg-doc/kayfabizarro` zur Laufzeit geladen, nichts dauerhaft kopiert:
  `media/3D_Assets/Dice/dice_ugur_lowpoly.glb` ·
  `media/3D_Assets/kenney_prototype-kit/Models/GLB format/shape-cylinder.glb` ·
  `skills/kfb-ink-canon.js` (v2, Preset `card`).
- Voriger Eigenbau `KFB SpinBallPop v1.dc.html` geparkt (Fehlschlag SBP-08 im Changelog).
- Bestandsprüfung: der Verzeichnisbaum zeigt **keine** GLB (nur Text und Bilder). Binärbestand über
  die GitHub-API geprüft — `CATALOG/github_status.json` ist veraltet und meldet vorhandene
  Kenney-Kits als „local".


- v4.4: Fraktions-Register aus `georg-doc/kayfabizarro` — **40 Blätter gemessen**, nichts kopiert:
  `Tiny Swords (Enemy Pack)/Enemy Pack/Enemies/**` (Goblin Raiders, Pirate Fish, Caveborn,
  Einzelgänger), `Tiny Swords (Update 010)/Factions/{Knights,Goblins}` + `Resources/Gold Mine`,
  `Tiny Swords (Free Pack)/Units/Blue Units/Pawn` (Idle-Blätter, 1536×192 = 8 Frames).
  Messkopien der zwei Pawn-Idle-Blätter nach dem Messen gelöscht.

- v4.3: Editor um Undo/Redo, Requisiten-Werkzeug und Karten-Slots erweitert — keine neuen Quellen.

- v4.1: Elevated Ground kommt jetzt aus `Tiny Swords (Free Pack)/Terrain/Tileset/Tilemap_color1.png` (gemessen 576×384 = 9×6, Sp. 5–8 Gras + Klippe) und `Tileset/Shadow.png` (192er Stempel); aus dem Steinblatt nur noch die Treppe.

- v4.0: `Nexus Castle v4.dc.html` gebaut — Elevation/Shadow/Bridge-Blätter aus `lietz-nexus` gemessen (Elevation 256×512 = 4×8), Plateau + Klippe + Treppe unter der Burg.

- v3.15: Ressourcen-Blätter, Sheep, Pawn-Träger, Lancer/Monk und `Blue Buildings/House3` (Depot) aus `Tiny Swords (Free Pack)` — alle vor Gebrauch gemessen, per raw-URL geladen, Messkopien gelöscht.

- v3.14: Kopf-Icons aus `Tiny Swords (Free Pack)/UI Elements/UI Elements/Icons` (gemessen 64×64, eingesetzt 32 px): Icon_11 Log, Icon_10 Settings, Icon_09 Hide UI, Icon_07 Show UI — per raw-URL, Messkopien gelöscht.

- v3.9: Header nutzt `UI/Ribbons/Ribbon_Red_3Slides.png` (gemessen 192×64, als ein Bild 1:1); Slice-HUD-Versuch verworfen.
- Geprüft: `Factions/Knights/Troops` in `kayfabizarro` (Update 010) enthält nur Warrior/Archer/Pawn — Lancer und Monk liegen im Free Pack und sind noch nicht gemessen.

- `Nexus Village v3.dc.html` gebaut: ATLAS-Baukasten (Pack/Pfad/Frame/Rolle je Blatt), Foam als 192-px-Stempel, keine Shadow-Ebene ohne Elevation, Baeume nur im Inland, Wolken, Tageszeit 0-24 h, Particle FX (Feuer/Rauch/Explosion/Splash), Gebaeude-Hover/Klick, Unit-Schatten entfernt.
- Assets zusaetzlich aus `georg-doc/kayfabizarro`: `media/2D_Assets/Tiny Swords (Free Pack)` (Clouds, Particle FX, Water Rocks, Rubber Duck) — per raw-URL, nichts dauerhaft kopiert.
- `Nexus Village v2.dc.html` gebaut: Vollflaechen-Dorf ohne Dashboard-Chrome, In-Game-UI auf Tiny-Swords-UI-Assets, Shantell Sans.
- Tile-Logik nach Pixel-Frog-Tilemap-Guide korrigiert: 64-px-Kacheln, Ebenen Wasser → Foam → Flat Ground → Shadow, 4x4-Autotile mit Spalte/Zeile 3 als "single".
- Renderer-Logik aus `TerrainRenderer.ts` und `road-network.ts` portiert: Wegenetz mit BFS-Pathfinding, Sand-Wege auf Kachelraster, ein Schatten pro Objekt, Tiefensortierung nach Fuss-Y.
- `Nexus Village v1.dc.html` bleibt als dunkle Chrome-Variante liegen.
- Nichts dauerhaft kopiert — alle Assets per raw.githubusercontent (CORS `*`); Messkopien wurden nach dem Abgleich geloescht.

## Weitere Quellen

- `FulAppiOS/Agent-Quest@main` — `client/src/editor/**` (Editor-Aufbau, Werkzeugliste) und
  `client/src/editor/types/map.ts` (**MapConfig v1**, von uns übernommen). `server/data/maps/template.json`
  ist eine 300-KB-Beispielkarte. Nur gelesen, nichts kopiert.
- `spritefusion.com/tilesets/tiny-swords` — freier Web-Tilemap-Editor mit Tiny Swords, 64×64,
  Autotile, JSON/TMX-Export. Taugt als Terrain-Zulieferer (kennt keine Gebäude, NPCs, Wege).

## Screen map

| Ebene im POC | Quelle |
|---|---|
| Helden-Sprites, Frame-Indizes, Farb-Fallbacks | `client/src/game/themes/tiny-swords-cc0.ts` |
| Bauten (Library/Forge/Arena/Castle/Tower/Tavern) | `client/public/assets/themes/tiny-swords-cc0/BuildingsCustom/*.png` |
| Boden, Schatten, Wasser, Schaum | `Terrain/Ground/Tilemap_Flat.png`, `Terrain/Ground/Shadows.png`, `Terrain/Water/Water.png`, `Terrain/Water/Foam/Foam.png` |
| Kachel-Regeln (Ebenen, Shadow-Versatz, 64 px) | pixelfrog-assets.itch.io — Tilemap Guide (Devlog 1138989) |
| Wege, Kreuzungen, Pathfinding | `client/src/game/data/road-network.ts`, `client/src/game/terrain/TerrainRenderer.ts` |
| Aktivitaets→Haus-Mapping, Weltmasse | `client/src/game/data/building-layout.ts` |
| Agenten-/Event-Typen | `server/src/types.ts` |
| In-Game-UI (Panels, Buttons, Ribbons, Pointer) | `client/public/assets/themes/tiny-swords-cc0/UI/**` |
| Wolken, Particle FX, Water Rocks, Ente | `georg-doc/kayfabizarro`: `media/2D_Assets/Tiny Swords (Free Pack)/Terrain/Decorations/**`, `.../Particle FX/**` |
| Fraktionen: Kader + Lager (Raiders, Pirate Fish, Caveborn, Einzelgänger) | `georg-doc/kayfabizarro`: `media/2D_Assets/Tiny Swords (Enemy Pack)/Enemy Pack/Enemies/**` |
| Fraktionen: Goblins 010, Ritter-Bauten, Goldmine | `georg-doc/kayfabizarro`: `media/2D_Assets/Tiny Swords (Update 010)/Factions/**`, `Resources/Gold Mine` |
| Goldmine-Kader (Bergmann, Träger) | `georg-doc/kayfabizarro`: `media/2D_Assets/Tiny Swords (Free Pack)/Units/Blue Units/Pawn` |
| Sidescroller (Backlog, Stilbruch gewollt) | `georg-doc/kayfabizarro`: `media/2D_Assets/TreasureHunters`, `Pirate_Bomb`, `Kings_and_Pigs` (letzterer im Repo derzeit leer) |
| Jukebox-Tracks, UI-SFX | `georg-doc/kayfabizarro`: `media/3D_Assets/Sounds/jukebox.json`, `media/3D_Assets/Audio/ui-sfx.json` |
| SpinBallPop: Skelett und Physik (die ganze Datei) | `red-reddington/web-demos`: `neon-gutter/index.html` — als `KFB SpinBallPop v2.html` im Projekt, Physik unverändert |
| SpinBallPop: Spielkugel | `georg-doc/kayfabizarro`: `media/3D_Assets/Dice/dice_ugur_lowpoly.glb` |
| SpinBallPop: Bumper, Pfosten | `georg-doc/kayfabizarro`: `media/3D_Assets/kenney_prototype-kit/Models/GLB format/**` |
| SpinBallPop: Spielfeld-Karte (v4) | `georg-doc/kayfabizarro`: `skills/kfb-card-builder.js` (jsdelivr) + `media/kfb/index.json` und Deck-PDFs (raw) |

## Sync history

- 2026-09-01T13:40:00Z — v4 eingecheckt: CardBuilder über jsdelivr, pages.dev-Ink-Import entfernt
  (Regel 7), Karten-Registry über raw gelesen, Schnitt = blindes Viertel. Export unter `export/`.

- 2026-08-14T15:31:04Z — v4.4: Fraktions-Register aus `georg-doc/kayfabizarro`, 40 Blätter gemessen,
  nichts kopiert (Details in den Einträgen oben).

- 2026-08-14T07:00:00Z — v4.0/v4.1: Elevation-, Shadow- und Bridge-Blätter aus `lietz-nexus` und dem
  Free Pack gemessen, Plateau + Klippe + Treppe unter der Burg gebaut.

- 2026-08-14T01:50:07Z — `Nexus Village v1.dc.html` gebaut (Weg B, dunkle Nexus-Chrome), Sheet-Specs und Haus-Mapping aus dem Fork uebernommen.
- 2026-08-01T01:28:04Z — `georg-doc/kayfabizarro` (media/kfb, skills): KFB MED Deck Viewer v2 gebaut, v1 geparkt.
- 2026-08-01T00:32:31Z — KFB v1 gebaut, `kfb-ink-canon.js`, `kfb-card-format.js` und Scheren-Assets kopiert.
