repo: georg-doc/kayfabizarro
branch: main
path: registry/assets/v1, media/3D_Assets, tools/osm-city-lab/data/dom-zentrum-v0, kfb-hub/stunt-race/track-lab
planning-branch: planning/cologne-race-option-c-claude-r3-2026-09-20
planning-path: skills/chat/workflows/KFB_COLOGNE_RACE_OPTION_C_2026-09-20

travel-repo: georg-doc/KFB-Travel-Globe
travel-branch: main
travel-path: travel/globe-v13, travel/terrain-planets-v1
travel-note: Implementation-SSOT für Travel. In dieses Projekt kopierte Dateien liegen unverändert in lab-v8/vendor-travel und werden nie bearbeitet.

secondary-repo: georg-doc/KFB-Stunt-Car-Race
secondary-branch: main
secondary-path: 3D Assets/KayKit_Space_Base_Bits_1.0_FREE, skills/, _handover/SPRINTS_2026-09-10

benchmark-repo: KilledByAPixel/SP13KTRA
benchmark-revision: 166ad838
benchmark-note: FILAMENT #02, All rights reserved. Maßstab für Tempo und Taktschläge — und ab 2026-09-22 ein VERFAHREN: die Kamera auf der Streckenschiene (code/game.js updateCamera, gelesen @166ad838). Kein Code, keine Zahl, keine Kurventabelle, keine Koordinate, kein Weltmaßstab, keine Palette, kein Netz übernommen.

hud-brief-repo: georg-doc/KFB-Stunt-Car-Race
hud-brief-branch: design/hud-v4-game-alignment-2026-09-20
hud-brief-path: _handover/HUD_V4_GAME_ALIGNMENT_2026-09-20/HUD_V4_CHANGE_BRIEF.md
hud-brief-pr: 30
hud-brief-head: f4436c83c674bc5bde017a0c33ca19e5da682894

## Last sync
date: 2026-09-22T03:06:16Z
commit: 2ff8b350beefe02912bbff6eeeead3882e583d08

### Updated in this project
- **Verfolgerkamera auf die Streckenschiene gesetzt** (`lab-v9/cologne-play.v1.js` `railClamp`).
  Gelesen: KilledByAPixel/SP13KTRA @166ad838 `code/game.js` `updateCamera()` — dort hält ein
  Projizieren der Wunschlage auf die Route plus Seiten- und Höhenklemme die Kamera im freien
  Fahrkorridor, ohne jeden Szenerie-Collider. Genau das fehlte hier: unser Strahl zog die Kamera
  nachträglich vor Fassaden und in den Wagen. Übernommen ist das Verfahren, keine Zahl.
- **Kamera wird gesetzt statt nachgezogen** (Start, `reset()`, `setMode()`), wie der Spender in
  `gameStart`. Befund: ohne das kroch sie vom Ursprung über die halbe Karte und zeigte unterwegs
  das Innere der Fahrbahn.
- **Neu: `lab-v9/cologne-palette.v1.js`** — harmonische Farbpaletten in OKLCH über sieben Zonen
  und fünf Schemata, gemessene Tafel-Palette als Anker, `kfb-palette/v1` als JSON-Vertrag mit
  Export/Import und Seed. Schnittstelle für Karten-/Zonen-Seeds und einen KFB Track/Zone Editor.
- **Vier gemessene Korrekturen an der Welt:** Querverband der Hohenzollernbrücke war eine
  50 × 24-m-Platte (jetzt drei Stäbe), Gebäudepfeiler standen nach dem 6-%-Einzug im Korridor
  (jetzt geprüft und verworfen, `city.pierSkipped`), Himmelskörper hingen ab 5° und lasen als
  Kugel im Bauwerk (jetzt 10°), Nick/Wank senkten das Heck 0,35 m unter die Fahrbahn (Aufbauhöhe
  trägt die Drehung mit).
- **Befund, der fast Schaden angerichtet hat:** `Box3.setFromObject` liefert ohne
  `scene.updateMatrixWorld(true)` für nie gezeichnete Objekte die LOKALE Lage. Der neue
  Korridor-Schrubber hielt deshalb den ganzen Dom für ein Hindernis auf der Startgeraden.

### Vorher (2026-09-20T13:16:39Z)
commit: 2ff8b350beefe02912bbff6eeeead3882e583d08

### Updated in this project
- **Kölner Genius Loci gebaut** (`lab-v9/cologne-landmarks.v1.js`): Hohenzollernbrücke, Deutzer
  Brücke, Hauptbahnhof, Museum Ludwig, Philharmonie — je auf dem gemessenen OSM-Anker aus
  `CLAUDE_CONTEXT.json`.
- **Befund, der die Bauweise bestimmt hat:** es gibt keinen Spender. Der gepinnte Asset-Handoff
  `tools/KFB-ToolBox/_inbox/kfb-RACE_TRACK+UI_asset-handoff-animation-lab (7).json` führt 213
  Assets und keine Kölner Landmarke; `tools/img2threejs/docs/GENIUS_LOCI_CANDIDATES_V1.json`
  führt 22 Kandidaten von der Akropolis bis Guggenheim, ebenfalls nichts aus Köln. Gebaut wurde
  deshalb nach der Vorschrift, die der Katalog für genau diesen Fall selbst angibt:
  `"sourceStrategy": "OSM footprint + public dimensions + authored low-poly modules"`.
- **Konflikt gemessen und zugunsten von OSM entschieden:** die Hohenzollernbrücke liegt mit
  Fahrbahn auf y 12 und Bögen bis y 37 dort, wo das Rheindeck der Strecke bei y 14–18 lief.
  Verschoben wurde die Strecke, nicht die Brücke — sie steigt auf y 30–46 und fliegt darüber.
- **Torkette** aus dem Handoff (overheadRound, overheadLights, overheadRoundColored, overhead):
  8 Bögen alle 249,7 m, Lichte nachgemessen 8,00–9,57 m, im Tunnel keins. Durchfahrt-Klang
  synthetisiert, weil unter `media/3D_Assets/Sounds` nur Musik liegt.
- **Countdown als Ersatz deklariert:** das Kenney Racing Kit führt keine Ziffern (Regex über
  alle 213 Handoff-Assets plus 19 geratene Dateinamen, alle 404). Verwendet werden
  `Platformer Game Kit - Dec 2021/Level and Mechanics/glTF/Numbers_{1,2,3}.gltf`.
- **Steuerung gemessen repariert.** Meine Herleitung war dreimal falsch; jetzt wird die Bewegung
  am laufenden Bild auf den Kamera-Rechtsvektor projiziert. A −2,7 links, D +15,9 rechts,
  Q −4,9 Drift links, E +13,1 Drift rechts.

### Vorher (2026-09-20T06:10:00Z)

### Updated in this project
- **HUD v4 gegen den Änderungsbrief umgesetzt** (KFB-Stunt-Car-Race, PR #30, Head f4436c83c674):
  Tacho 132 × 90, Zahl in Bangers 38 px ohne `KM/H`, eine stufenlose Farbrampe über die vier
  Stopps des Briefs für Zahl UND Bogen, Grip kühl / Boost warm gepulst, Mini-map 100 px mit
  weicher Hover-Vergrößerung auf 132, Almanach 92 px mit 420 ms und 45 ms Versatz, Race-State
  oben links mit reserviertem, leerem Score-Platz.
- **Eine bewusste Abweichung von §6** (Radio raus aus dem Driving-HUD): Georgs mündliche Ansage
  in derselben Runde war "nur 3 Buttons & Slider per Default" und "im Radio sollen die Controls
  sein". Umgesetzt ist die Ansage, die Abweichung steht in RETURN.md.
- **Befund an der Bogenlänge:** der Halbkreis mit r=52 ist 163,4 Einheiten lang, nicht 204.
  Mit dem Schätzwert füllte die Tempoanzeige bei halbem Tempo nur 62 %.
- KFB Power Donut Drive als Antrieb und Quelle für Spur und Speedlines, Ugur-Würfel als
  Begleiter, Kaskadenstäbe am Bandrand.

### Vorher (2026-09-20T05:37:46Z)
commit: 2ff8b350beefe02912bbff6eeeead3882e583d08

### Updated in this project
- **Himmel aus der TinySkies-/Travel-Linie übernommen** (`lab-v9/cologne-sky.v1.js`): Spender
  `travel/travel-v16/terrain-v16/skydome-shader.js` @f747574d4283, Variante S — domain-verzerrtes
  4-Oktaven-fbm, Stimmungsrampe, Flussbänder, 1 800 funkelnde Sterne. Gelesen und angepasst, nicht
  kopiert. Eine bewusste Abweichung: die Farbstopps colA/B/C kommen aus den gemessenen Option-C-
  Tafeln statt aus den Travel-Story-Paletten. Verzerrung und Kontrast gegenüber dem Spender halbiert.
- Dazu die Spender-Grammatik von `sky-cards.js` @e4c2d3a03e58 (dort count 7) und `sky-dice.js`
  @e342997e4a5f (`media/3D_Assets/dice_ugur_lowpoly.glb`).
- **Sechs Quaternius-Himmelskörper** aus `media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/
  Environment/GLTF/`: `Planet_1..6.gltf` (62–151 kB) und `Rock_1/2.gltf`. Byteweise geprüft,
  Puffer und Bild eingebettet, Hülle rund 3,8 Einheiten. Verteilung über den goldenen Winkel mit
  Streuung je Körper, Sonnenfenster frei.
- **Befund an der Aufhängung:** erste Platzierung bei 9–42 Grad Höhe lag vollständig außerhalb des
  Blickfelds der Verfolgerkamera. Gemessen und auf 5–24 Grad gesenkt.

### Vorher (2026-09-20T04:58:00Z)
- **Cologne Race Option C gebaut** (`KFB Cologne Race Option C.dc.html` + `lab-v9/`): spielbarer
  Dom Loop, 1 997,4 m, 598 Stützpunkte, Basisbreite 18,0 m. Strecke von Grund auf für die echte
  Kölner Geografie geschrieben; FILAMENT #02 diente nur als Maßstab für Tempo und Taktschläge.
- **Beide Option-C-Tafeln einzeln geöffnet und gemessen**, bevor irgendetwas gebaut wurde.
  `lab-v9/option-c-style.v1.js` führt jede Farbe mit ihrem gemessenen Flächenanteil:
  Fahrbahn #279797 (Tafel 01, 11,70 %), Schulter #d8956b (Tafel 02, 5,04 %), Himmel #88243c
  (Tafel 02, 4,43 %). Keine Farbe erfunden, keine "verbessert".
- **850 echte OSM-Gebäudegrundrisse** aus `dom-zentrum-v0/normalized.json` im 340-m-Korridor
  verbaut (17 058 Dreiecke), Höhen aus OSM 3–46,5 m, BuildingElastic nach der Grammatik von
  `tools/osm-city-lab/src/style/cartoon-city.js`. Rhein als `relation/11280522:0`, Dom auf
  `way/4532022` mit dem akzeptierten Spender `koelner-dom v0.2`, Faktor 1,873.
- **Race v0.8 unverändert übernommen** (`RACE_FLOW_RUNTIME_CONFIG` + `RACE_FEEL_V08_CONFIG`),
  kein zweiter Controller. Fahrzeugrahmen aus den glTF-Accessoren gemessen: Maßstab 5,1551,
  2,16 × 1,90 × 4,16 m, Radstand 2,586 m, Spur 1,815 m.
- **Befund an der Ordneransicht, wieder bestätigt:** unter `media/3D_Assets/kenney_racing-kit/`
  listet das Repo nur Preview.png und Sample.png. `billboard.glb` (14 520 B) und
  `camera_exclusive.glb` (11 560 B) sind trotzdem da — Byte-Abfrage auf den exakten Pfad.
- **Befund am Licht:** eine gesättigte Sonnenfarbe (#fed95a) multipliziert das teale Band nach
  GRÜN. Das Licht trägt jetzt warmes Weiß, die Farbe bleibt beim Material.
- **Befund an der Bandkante:** bei 41 m/s reichte der weiche Rückhalt aus v0.8 allein nicht —
  das Fahrzeug verließ das Rheindeck und blieb in der Luft stehen, weil die Höhe am Streckenband
  hängt. Harte Kante ergänzt.
- Echtes KFB-Kartenbild auf der Kenney-Tafel über den `quarter()`-Vertrag aus
  `overworld/overworld/card-art-2d.js`: Forget Utopia, Karte 7, Seite 3, Quadrant 2.

### Vorher
date: 2026-09-19T00:25:00Z

### Updated in this project
- **Zweites Repo aufgenommen:** `georg-doc/KFB-Travel-Globe` (Implementation-SSOT für Travel).
  Sieben Dateien aus `travel/globe-v13` byteweise nach `lab-v8/vendor-travel/` kopiert und dort
  UNVERÄNDERT betrieben — `carpet.js` und `flight-controls.js` rechnen den Flug, die Werkbank
  liest nur. Damit gibt es keinen zweiten Flight-Controller.
- Neue Naht `lab-v8/travel-flight-seam.v1.js`: ein Block, Herkunft je Feld (8× TRAVEL, 4×
  DERIVED genau einmal, 2× UNAVAILABLE). Erweitert die Naht, die Travel für `card-carrier.js`
  schon führt (`speed/bank/pitchTilt/boosting/climbIn`), statt eine zweite danebenzustellen.
- Neuer gemessener Flugrahmen `lab-v8/flight-frame.v1.js` und Flight-Deformer
  `lab-v8/flight-deformer.v1.js`: Nicken/Gieren um die Hüllenmitte, Rollen um die Flügelebene.
  Die Rad-Paar-Regel läuft im Flug nicht — ein Fahrwerk ist Bodenkontakt, kein Fluganker.
- Vier Fixtures über einen Maßstabssprung von Faktor 82 gemessen und bewegt: airplane-a 3,777 u
  Spannweite, paper-plane 0,121 u, spaceship-a, spaceship-rae 9,949 u.
- Neue Oberfläche `KFB Vehicle Lab v4.dc.html` (Motion-Strip unten, Messwerte einklappbar).
  v3 bleibt unverändert.

### Vorher
date: 2026-09-18T20:05:00Z

### Updated in this project
- Neuer Asset-Handoff `kfb.asset-handoff.v1` (consumer `animation-lab`, sourceCommit `29aac1061bdd`, 141 Assets) gegen die Fixture-Liste gerechnet: **112 Assets waren nicht referenziert**, davon rund zwanzig Fahrzeuge.
- `lab-v7/fixture-adapters.v3.js`: importiert v2 und hängt **15 Bodenfixtures** an (46 → 61) sowie **10 Flug-Fixtures** als eigene Ebene. Jede Zeile aus dem Handoff generiert. `Paper Plane` steht nicht im Handoff — Pfad byteweise geprüft (3216 B @ 29aac106) und mit `via: repo` geführt.
- Alle 25 neuen Zeilen im Browser geladen und vermessen. Befund: die Rad-Paar-Regel verwirft Traktor-Hinterachse, Schubkarrenrad und Rollstuhl-Lenkrollen korrekt; `rover-round` meldet 1 Rad und ist damit ein offener Verdacht auf eine Lücke im Insel-Weg.
- Neue Oberfläche `KFB Cartoon Vehicle Deformer Lab v2.dc.html` im Schnitt von `tools/resident_atlas_s6/KFB_Resident_Atlas_S6.html`: warm-dunkle Bühne, Auswahlfelder statt Knopfreihen, Zeitleiste im Dock, Tab »Flug«. v1 bleibt unverändert.
- `PLAN_flight_deformer.md`: drei Schnitte (Lage, Form, Ereignisse), gemessene Ersatzanker für ein Fahrzeug ohne Räder, Klapprad-Brücke über die bestehenden `steer/susp/spin`-Gruppen.

### Vorher
date: 2026-09-18T17:15:00Z

### Updated in this project
- Drei neue Motion-Familien gebaut: `lab-v7/vehicle-manoeuvre.v1.js` (Rückwärts, Wenden, Einparken), `lab-v7/vehicle-twowheel.v1.js` (Zwei-Rad-Schräglage, frei und an der Bande), `lab-v7/vehicle-tumble.v1.js` (Fassrolle mit wandernder Drehachse, gerundeter Umdrehungszahl, ballistisch abgeleiteter Landestärke). Lautwörter aus Vorgabe AUS.
- **FX-Quelle geprüft, nichts kopiert.** `media/3D_Assets/FX_Visual` enthält keine 3D-Effektnetze: `kenney_smoke-particles/PNG` liegt als Einzelbilder in fünf Ordnern (Black smoke 25, White puff 25, Explosion 9, Fart 9, Flash 9) und ist direkt als Billboard-Sprite verwendbar; `explosions_smoke` liefert GEPACKTE Spritesheets mit `.plist`-Bildlagen (siehe `explosion_smoke_HowTo_v01.md`) und müsste erst zerlegt werden. Folge für diese Linie: alle Effekte sind kamerazugewandte Billboards, keine Volumen.
- **VFX-Vorlagen im Repo gefunden und als Grundlage der nächsten Runde vermerkt**, statt neu zu erfinden: `travel/travel-v16/terrain-v16/speed-lines.js` (portiert aus TinySkies `client/src/game/SpeedLines.ts` @ 2659a5cc) sowie `travel/KFB Travel Globe v13-1/globe-v13/` mit `contrails.js` (Comic-Speedlines am Fahrzeug), `drift-smoke.js`, `impact-dust.js`, `carpet-wake.js`, `post-radial.js`. Planung in `PLAN_vehicle_vfx_flightmode.md`.
- **Befund an den Modellen: kein Fahrzeug hat einen Türknoten.** Acht Fixtures geprüft; Kenney und KayKit haben 6–8 Knoten (Karosserie plus vier Räder), die Poly-by-Google-Modelle sind nach MATERIAL getrennt (`Object003_1 … _6`). Einzige Ausnahme: `garbage-truck` bringt `arm`, `body`, `trash` als eigene Knoten mit. Der geplante Ausstieg wird darum als Ducken gebaut, nicht als Tür.

## Screen map

| Screen / Datei | Repo-Quellen |
|---|---|
| `KFB Cologne Race Option C.dc.html` · `lab-v9/cologne-*.v1.js` | kayfabizarro @2ff8b350beef: Tafeln `travel/wip/travel_globe_wsa/_inbox/KFB Racer Option C - …(1).png`+`(2).png`; OSM `tools/osm-city-lab/data/dom-zentrum-v0/{CLAUDE_CONTEXT,normalized}.json`; Gebäude-Grammatik `tools/osm-city-lab/src/style/cartoon-city.js`; Dom `tools/img2threejs/prototypes/koelner-dom/v0.2/index.html` + `tools/img2threejs/styles/landmark-style-profiles.v1.json`; Bewegung `kfb-hub/stunt-race/track-lab/RACE_{FLOW_RUNTIME,FEEL_V08}_CONFIG.json`; HUD `kfb-hub/stage/stunt-world/hud-game-v3/SOURCE.json`; Karten `media/kfb/index.json` + `overworld/overworld/card-art-2d.js`; Modelle `media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE`, `media/3D_Assets/kenney_racing-kit`. Benchmark KilledByAPixel/SP13KTRA @166ad838 — gelesen; aus `code/game.js` updateCamera das VERFAHREN der Streckenschienen-Kamera übernommen, kein Code und keine Zahl |
| `KFB Vehicle Lab v4.dc.html` · `lab-v8/*` | KFB-Travel-Globe: `travel/globe-v13/{carpet,flight-controls,spherical-math,terrain-surface,globe-field,globe-biome,simplex-noise}.js` (kopiert, unverändert), `travel/terrain-planets-v1/card-carrier.js` + `travel/globe-v13/globe-poc.js` (Naht-Vorlage, nur gelesen), `travel/CONTRACT.md`, `WSA_START.md`, `AGENTS.md`; kayfabizarro: `skills/chat/workflows/VEHICLE_DEFORMER_V3_TINYSKIES_2026-09-19/START_HERE.md`, Flug-Modelle unter `media/3D_Assets/{KFB,SciFI_Ultimate Space Kit_Quaternius}` @ 29aac106 |
| `lab-v7/fixture-adapters.v3.js` · `KFB Cartoon Vehicle Deformer Lab v2.dc.html` · `PLAN_flight_deformer.md` | `uploads/kfb-asset-handoff-animation-lab (6)` = `data/handoff-animation-lab-29aac106.json` (kayfabizarro @ 29aac106); UI-Vorbild kayfabizarro: `tools/resident_atlas_s6/KFB_Resident_Atlas_S6.html`; Modelle unter `media/3D_Assets/{KayKit_Mystery_Series6,Frankensteining,SciFI_Ultimate Space Kit_Quaternius,GLB_mini_chars,KFB,kenney_prototype-kit,KayKit_Medieval_Hexagon_Pack_1.0_FREE}` |
| `lab-v7/vehicle-manoeuvre.v1.js` · `lab-v7/vehicle-twowheel.v1.js` · `lab-v7/vehicle-tumble.v1.js` | KFB-Stunt-Car-Race: `skills/kfb-cartoon-animation_v2.md` (§1.2, §2.4, §2.5, §8.3, §10, §12, §15); Geometrie durchweg am geladenen Modell gemessen, keine Repo-Zahl übernommen |
| `PLAN_vehicle_vfx_flightmode.md` (Paket A, VFX) | kayfabizarro: `travel/travel-v16/terrain-v16/speed-lines.js`, `travel/KFB Travel Globe v13-1/globe-v13/{contrails,drift-smoke,impact-dust,carpet-wake,post-radial}.js`; Material `media/3D_Assets/FX_Visual/kenney_smoke-particles/PNG/*` (Einzelbilder) und `…/explosions_smoke/*` (gepackt, `.plist`) |
| `PLAN_vehicle_vfx_flightmode.md` (Paket B, Ausstieg) | kayfabizarro: `media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_{Medium,Large}/*.glb`; Maßregel aus `lab-v4/player.js` (Hüftspur in Medium-Maß auf Mannequin_Large 3,981 u) |

| Screen / Datei | Repo-Quellen |
|---|---|
| `KFB Vehicle Lab v1.dc.html` · `lab-v7/registry-vehicles.v1.js` | kayfabizarro: `registry/assets/v1/packs/kenney-car-kit.json`, `…/kenney-toy-car-kit.json`, `…/kenney-racing-kit.json`, `registry/assets/v1/manifest.json`; Modelle unter `media/3D_Assets/kenney_car-kit`, `…/kenney_toy-car-kit`, `…/kenney_racing-kit` |
| `lab-v7/cardeform.v1.js` | KFB-Stunt-Car-Race: `_inbox/KFB TRAVEL GLOBE re-home WS0/.../travel/kfb-cartoon-deform.js` (Technik-Vorbild) |
| `lab-v7/vehicle-fishtail.v1.js` | KFB-Stunt-Car-Race: `skills/kfb-cartoon-animation_v2.md` (§1.2, §2.4, §2.5, §8.3, §10, §12) |
| `lab-v7/carrig.v2.js` | wie v1, eine gemessene Änderung: Dicke-Schwelle 1,3 im Knoten-Weg (erzwungen von `spacetruck_large.gltf`, Verhältnis 1,407) |
| `lab-v7/carrig.v1.js` | KFB-Stunt-Car-Race: `_handover/SPRINTS_2026-09-10/F2_VEHICLE_REVIEW/source/frankenstein/race/src/vehicles.v1.js` (Inselregel, Radachse) |
| `lab-v7/fixtures.v1.js` | KFB-Stunt-Car-Race: `skills/kfb-cartoon-animation_v2.md` (§2, §11, §12) |
| `KFB Cartoon Vehicle Deformer Lab.dc.html` · `lab-v7/fixture-adapters.v2.js` · `lab-v7/vehicle-cartoon-deformer.v2.js` | `uploads/kfb-race-track-asset-handoff-generic-runtime.json` (Georgs Handoff, kayfabizarro @ 10a7fdce6b); kayfabizarro: `registry/assets/v1/packs/kaykit-city-builder-bits-1-0-free.json`, Modelle unter `media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE`, `media/3D_Assets/KFB`, `media/3D_Assets/Frankensteining`; KFB-Stunt-Car-Race: `_handover/CLAUDE_DESIGN_CARTOON_VEHICLE_DEFORMER_BRIEF_2026-09-17.md` |
| `lab-v7/fixture-adapters.v2.js` · Gruppe `spacebits` | kayfabizarro: `registry/assets/v1/packs/kaykit-space-base-bits-1-0-free.json`, `media/3D_Assets/KayKit_Space_Base_Bits_1.0_FREE/Assets/gltf/spacetruck{,_large,_trailer}.gltf` @ `eb48f50489b9` |
| `3D Assets/KayKit_Space_Base_Bits_1.0_FREE/*` | KFB-Stunt-Car-Race, gleicher Pfad (contents.png, sample.png, License.txt, spacebits_texture.png) |

## Sync history

### 2026-09-18T01:52:00Z
date: 2026-09-18T01:52:00Z
commit: eb48f50489b9e4903ec1e3d2fb1837605ce7d792

### Updated in this project
- KayKit Space Base Bits aufgenommen: `spacetruck`, `spacetruck_large`, `spacetruck_trailer` als neue Fixture-Gruppe `spacebits` — 46 Fixtures statt 43.
- Befund B2 erledigt: das Pack liegt jetzt in `kayfabizarro/media/3D_Assets` und im Registry-Pack `kaykit-space-base-bits-1-0-free`; glTF, `.bin` und Textur byteweise geprüft, Pin `eb48f50489b9`.
- Zwei neue Deformer-Profile `SPACE_HAULER` und `TRAILER_TOWED` (beide nicht abgestimmt, Struktur deklariert).
- `registry-vehicles.v1.js`: die drei Zeilen von `available: false` auf gepinnt und ladbar gestellt.
- Neue Motion-Familie `lab-v7/vehicle-fishtail.v1.js` (Schlingern): Drehung um die gemessene Vorderachse, Gegenroll nachlaufend, Gegenlenkung abgeleitet.
- Neue Rig-Fassung `lab-v7/carrig.v2.js`: Dicke-Schwelle der Radsuche nach Weg getrennt (1,3 Knoten, 1,5 Insel).

### 2026-09-17T19:48:00Z
date: 2026-09-17T19:48:00Z
commit: 10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0

### Updated in this project
- Fahrzeugliste auf Georgs Asset-Handoff umgestellt (`kfb.asset-handoff.v1` @ 10a7fdce6b): 43 Fixtures, davon 25 aus dem Handoff und 18 aus dem Registry, Herkunft je Zeile.
- Nachgetragen, was fehlte: KayKit City Builder Cars (5) und die Poly-by-Google-Fahrzeuge (7).
- Neuer gruppenbasierter Deformer `lab-v7/vehicle-cartoon-deformer.v2.js` samt Profilen und zwölf Testsequenzen; Shader-Fassung `cardeform.v1.js` überholt.
- Neue Werkbank `KFB Cartoon Vehicle Deformer Lab.dc.html`; Rückmeldung in `RETURN_cartoon_vehicle_deformer.md`.

### Vorherige Runde
- Fahrzeugliste aus den Registry-Packs gezogen (kenney-car-kit, -toy-car-kit, -racing-kit): 22 Fahrzeuge mit gepinnten RAW-Adressen.
- Neue Fahrzeug-Linie `lab-v7/` plus Oberfläche `KFB Vehicle Lab v1.dc.html` (Rig, Cartoon-Deformer, fünf Fixtures, Telemetrie-Naht).
- Befund: KayKit Space Base Bits liegt nicht im Registry und ist im Browser nicht ladbar (RAW-Fehler, `.bin` nicht kopierbar) — Abhilfe als `.glb` in `media/3D_Assets`.
- Stand-Dokument `LIVING_VEHICLES.md` angelegt.

### 2026-09-17T18:33:30Z
- Erstaufnahme: Space-Base-Bits-Inventar gelesen (57 glTF, 3 Fahrzeuge), Vorarbeit `kfb-cartoon-deform.js` und `vehicles.v1.js` gelesen, `github.md` angelegt.
