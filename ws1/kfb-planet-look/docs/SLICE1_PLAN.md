# Slice 1 · Welt-Boden + Fluff-Ernte · Vorarbeit (Branch `s1/weltboden`)

Stand 17.10.2026. Basis kfb-planet main @8ce5ac5. Grundlage: V-341, V-342, V-368–V-371, WS0_TO_WS1 vom 16.10. (Slice-Plan R2), Bühnen-Ränder `data/kfb-stage-edges-r1-2026-10-16` @d4e24f15, WS1_STATUS §60–§64.

Diese Vorarbeit ist reine Logik, in Node geprüft, ohne Browser. Sie ist noch nicht in `Stage.jsx` oder M1 eingebaut. Den Einbau und die Browser-Prüfung macht die Owner-Sitzung.

## 1 · Was gebaut wurde

| Datei | Was sie tut | Test |
|---|---|---|
| `src/world/terrainStitch.js` | Rechnet aus einem Eintrag der Bühnen-Ränder (`kfb.stage-edges/1`) die Terrain-Schürze in Metern (u × `scale_m_per_u`). `ground` schließt am `footprint` an, `plinth` am `footprintBase`, `island` bekommt nichts (`null`). Der Außenring ist eine Höhenlinie des Abstandsfelds um den Umriss. Er ist dadurch immer ein einfacher Ring, liegt ganz außen und hat runde Ecken wie eine ausgewaschene Düne (V-341). Dazu: Zwischenringe, ein Dreiecksnetz (Reißverschluss zwischen Ringen mit verschiedener Punktzahl), `blendAt(x, z)` für ein Höhenfeld-Gelände und die Bodenfarbe `fromColors(edgePalette)` (V-342, die drei größten Anteile). | `node test/unit/terrainStitch.mjs` |
| `src/modules/terrainStitch3d.js` | Dünnes Modul nach Host-Vertrag R1.2: BufferGeometry mit Eckfarben (Rand → Zonenboden), ohne Texturen. Das Material ist austauschbar. | im selben Test (three in Node) |
| `src/data/stages/kfb-stage-edges.r1.json` | Kopie der WS0-Datei, blob-gleich mit @d4e24f15 (`ccee2cbd`). | – |
| `src/world/fluff.js` | Sechs Sorten = sechs Story-Modes mit den V-292-Farben (Quelle `kfb-cartoon-palette.js` `STORY_MODES`). Gewichte je Zone: Hauptsorte 40 %, jede andere mindestens 8 %, Summe 1; optional mit Biom-Vorliebe. Verteilung von N Kügelchen auf Baum- und Busch-Punkte nach Seed. Windfall: fester Schritt (1/120 s), Flug exakt ballistisch, Stoß mit Restitution und Reibung, Rollen mit Hangabtrieb, Ruhe. Fluff-Böe (V-371). Aufsammeln zu Fuß und im Fahrzeug, als Kapsel zwischen zwei Bildern, damit schnelle Fahrt nichts überspringt; beim Driften zusätzlich im Bogen vor dem Auto (V-371). `createFluffField` hält den Zustand einer Zone, kann optional nachwachsen und überspringt schon gesammelte Kügelchen aus dem Spielstand. | `node test/unit/fluff.mjs` |
| `src/modules/fluffField3d.js` | Dünnes Modul: ein InstancedMesh für alle Kügelchen, also ein Draw Call. Gesammelte Kügelchen bekommen Größe 0. | im selben Test |
| `src/world/save.js` | Spielstand `kfb.save/1` mit Version, Zeitstempel, Flags, Fluff-Zählern je Sorte, gesammelten Schlüsseln und Spielerposition samt Zone. Laden prüft und repariert. Ein kaputter Stand wird zum frischen Stand, der Rohtext bleibt unter `kfb.save.bak`. Bei einer neueren Version wird nichts überschrieben. Dazu ein Migrations-Stub (Version 0 → 1) und ein Speicher mit localStorage (jeder Zugriff in try/catch) oder Speicher-Ersatz in Node. | `node test/unit/save.mjs` |
| `src/world/interactable.js` | Register `{ id, pos, radius, label, action }`. `nearest()` gibt genau ein Ziel oder `null`. Bei Gleichstand gewinnt, wer zuerst angemeldet war; mit Hysterese gegen Flackern. `prompt()` liefert genau einen Hinweis, `trigger()` führt die Aktion für den einen Tasten-Router aus. Keine Listener. | `node test/unit/interactable.mjs` |
| `src/world/perfBudget.js` | Budget nach V-370 als Konstanten. Auswertung aus `renderer.info` und Bildzeiten: p95 in ms, fps und je Posten bestanden/nicht bestanden/nicht gemessen. Dazu ein Ringpuffer für Bildzeiten und eine Zeile fürs Debug-Overlay. | `node test/unit/perfBudget.mjs` |
| `test/unit/_report.mjs` | `report()` wie in `test/_page.mjs`, aber ohne Playwright-Import. | – |

Messwerte aus den Tests:
- 15 Bühnen mit Anschluss und 4 Inseln ohne.
- Außenring bei allen 15 einfach und überall ≥ 3,99 m vom Rand (Schürze 4 m).
- Das Netz deckt die Ringfläche ab. Einzige Ausnahme: eine Falte von 0,38 m² in einer Kerbe von `prison_panopticon` (0,25 % Überlappung).
- Ein Kügelchen kommt aus 0,5–5 m Höhe in 0,9–2,8 s zur Ruhe; die Energie steigt in keinem Schritt.

## 2 · Was die Owner-Sitzung noch einbauen und im Browser prüfen muss

1. **Maßstab zuerst (V-345):**
   - Alle Fluff-Werte (Kronenhöhe, Sammelradien 0,8 m zu Fuß und 1,9 m im Fahrzeug, Wurfgeschwindigkeit) sind in J17-Metern gedacht.
   - Solange `worldScale.js` nicht in main ist, ist die Welt etwa 1,54-mal größer. Dann die Werte über `options.fall` bzw. `PICKUP` mit 1/0,65 skalieren oder erst nach V-345 einbauen.
   - Die Bühnen-Daten brauchen keinen Faktor; sie sind schon in WS0-Metern.
2. **Terrain-Schürze in `Stage.jsx` / Meshy-Bühne:**
   - Bühnen-IDs zuordnen: `goblin` → `goblin_bank`, `atlantis` → `atlantis`, `comic` → `comic_broadcast`, `utopia` → `utopia_stage`.
   - Setzt die Hülle `options.scale` zum Abstimmen, muss dieselbe Zahl als `stitchOptions.scale` mit.
   - `outerY` = Höhe des umgebenden Geländes, in M1 `terrainHeight` aus `m1-terrain.js` (Boden −0,125 m). Den Innenring auf den Bühnenboden legen und Z-Fighting mit dem Gelände prüfen (polygonOffset oder 1–2 cm anheben).
   - Die Schürze in die Ziele von `toneSplit` aufnehmen (V-346, Boden ohne Tonemapping) und das Knet-Material aus `clayLook`/`makeClayFamily` mit Eckfarben anschließen.
   - Besser auf Dauer: Das Gelände selbst anschließen. Mit `blendAt(x, z)` je Geländepunkt Höhe und Farbe mischen; dann ist die Schürze nur noch Rückfall.
3. **Bäume, Büsche und Fluff in M1:**
   - Bäume und Büsche aus dem KayKit Forest Nature Pack setzen (Liste §5).
   - Ihre Stammfüße als `spawns` an `createFluffField` geben, `ground` = Geländehöhe; dann das Modul `createFluffField3d` einhängen.
   - Im Auto liefert `collector()` Position, Vorbild-Position, `mode: 'vehicle'`, Geschwindigkeit und den Drift-Zustand von K2B (Q/E).
   - Eine Böe ab und zu auslösen (`field.gust()`); Rammen eines Baums ruft `field.shake(spawnId)`.
   - Zähler nur als Debug-Anzeige (§44.3).
4. **Spielstand:**
   - `createSaveStore()` einmal beim Start, `load()`, die Schlüssel als `collected` an die Felder geben.
   - Bei `onCollect` den Stand mit `withHarvest()` fortschreiben. Gespeichert wird gedrosselt (z. B. alle 2 s und beim Zonenwechsel), nicht jedes Bild.
   - Reload-Test im Browser: Fluff-Zähler und gesammelte Kügelchen bleiben erhalten.
5. **interactable:**
   - Eine Register-Instanz im Host anlegen. Module geben ihre Ziele zurück (Vorschlag für R1.3: Feld `interactables` wie `bubbleAnchors`, angemeldet und abgemeldet von `ModuleHost`).
   - Der Hud zeigt `prompt(playerPos)`. In `hostKeys.js` ruft der Handler für `ACTION_KEYS.talk` `trigger()` und dann `e.preventDefault()`.
   - Prüfen, dass E = talk für den heutigen Dialog weiter geht.
6. **Leistungs-Overlay:**
   - In `useFrame` `createFrameSampler().push(dt * 1000)` und `gl.info.render` lesen. Bei mehreren Render-Pässen muss `autoReset = false` mit eigenem `reset()` je Bild gesetzt werden, sonst zählen die Calls nur den letzten Pass.
   - Die Ladegröße kommt aus `performance.getEntriesByType('resource')` (`transferSize`).
   - Anzeige mit `overlayLine(evaluate(...))` hinter einem Debug-Schalter.
7. **Browser-Tests (neu, Playwright):**
   - Schürze ohne Spalt zur Bühne, Farbe gleich `ground`.
   - Böe → alle liegen nach ≤ 6 s.
   - Drüberfahren sammelt; der Zähler steigt um die Sorte.
   - Reload behält den Stand.
   - Overlay-Werte für drei Zonen mit verschiedener Hauptsorte (Beweisbild V-368).
   - Zum Schluss `test/contract-static.mjs` und die ganze Testreihe.

## 3 · Offene Fragen an WS0 / Georg

1. **Bodenfarbe:** `fromColors` ordnet die drei Vorgaben nach Rollen-Passung, nicht nach Anteil. Bei der Goblin-Bank wird so `#a67e5a` (11 % Anteil) zum Boden, nicht das dunkle `#4e4341` (57 %). Ist das gewollt, oder soll der größte Anteil Boden sein?
2. **Sockel-Bühnen (giza_pyramid, portal_ruin):**
   - Höhe: Soll das Gelände am `footprintBase` auf Bühnenboden-Höhe anschließen? Dann ist der Sockel verdeckt; das ist heute so (`plinthDrop_m = 0`). Oder tiefer, damit der Sockel sichtbar bleibt?
   - Farbe: Heute kommt sie aus `footprintBase.edgePalette`. Richtig so, oder soll die obere `edgePalette` gelten?
3. **marble_terraces:** Der Rand liegt auf der unteren Terrasse (−0,305 u). Die Figuren stehen nach Slot auf −0,042 u. Die Schürze folgt dem Rand (y = 0). Bitte bestätigen.
4. **Schürze:**
   - Breite: Vorgabe 4 m mit 3 Ringen.
   - Kerben: Kerben schmaler als etwa 8 m werden vom Außenring überbrückt und mit Schürze gefüllt (Treppen, Säulen). Stört das an Eingängen?
   - Langfristig: Schürze oder Höhenfeld-Anschluss? WS1 empfiehlt das Höhenfeld.
5. **Fluff-Balance:**
   - Wie viele Kügelchen je Zone (Vorschlag 18–30)?
   - Nachwachsen nach wie vielen Sekunden?
   - Sammelradien 0,8 m zu Fuß und 1,9 m im Fahrzeug.
   - Drift-Bogen: 2,2-facher Radius, 140°, ab 7,5 m/s, wie `driftMinSpeed` aus K2B.
   - High/Low bleibt vorerst ohne Rolle (V-368).
6. **Spielstand:**
   - Sollen Karten, d6-Würfe und Story-Mode-Würfel schon in `kfb.save/1`? Heute sind nur Flags möglich. Sonst kommt das mit R1.3.
   - Wohin später (GPT-Site)? Der Speicher-Adapter ist dafür austauschbar.
7. **Budget:** Zählen die MB als übertragene (komprimierte) oder als entpackte Größe? Heute: `transferSize`, MB = 10⁶ Byte.
8. **Forest-Pack-Inhalt:** FLUFF_WORLD_DRESSING_R1 nennt „211 Modelle inkl. Schnee-Varianten“. Im Repo sind es 105 glTF-Modelle; die 211 sind Dateien mit `.bin` und Textur. Es gibt nur Color1 und keine Schnee-Varianten. Schnee-Bäume gibt es im Kenney Holiday Kit (`tree-snow-a/b/c.glb`). Reicht das für Schnee-Zonen?
9. **Host-Vertrag R1.3:** Vorschlag `interactables: [{ id, pos, radius, label, action }]` als optionales Modul-Feld wie `bubbleAnchors`. Dazu `save` als Host-Dienst und kein Modul-Zugriff auf localStorage.

## 4 · Vorschlag: WS0-Vorlagen-Zeilen für F1 (Spender aus dem Repo)

WS0 hat am 16.10. gebeten: „Vorlagen-Zeilen schlagt ihr aus dem Repo vor (Spender mit Pfad)“. Alle Pfade stammen aus dem lokalen Klon (`git ls-tree` / `git grep`), Commit = letzter Stand der Datei.

| Zeile | Funktion | Spender (Pfad @Commit, Zeilen) | Was übernommen wird | Was nicht | Abnahme |
|---|---|---|---|---|---|
| F1a | Spielstand `kfb.save/1` | `overworld/overworld/journey.js` @53d9be371 (main), Z. 1–7 Kanon, 18–30 `emptySave`, 66–90 `migrate`/`read`/`write`, 92–99 Export | ein Save-Schema mit `version` und Migrator-Kette, localStorage in try/catch, Export als JSON-Datei, Regel „die Welt wird nie gespeichert“ | Felder der Overworld (Ruf, Diary, Held-Werte) | Rundreise, kaputt → frisch, neuere Version unangetastet (`test/unit/save.mjs`), Reload im Browser |
| F1a′ | Sicherung vor Umbau | `tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/src/main.ts` @64ae61fe7 (Branch `sync/lab-snapshot-2026-10-11`), Z. 146 Laden, 189 `STORE_PRE_K2`, 232 Speichern | Rohstand einmal sichern, bevor migriert oder überschrieben wird (bei uns `kfb.save.bak`) | Welt-Daten im selben Speicher (bleiben in `kfb.world-save/1`, WORLD_CONTRACT_R1) | `.bak` entsteht bei kaputtem oder neuerem Stand |
| F1b | interactable + ein Prompt | `overworld/overworld/overworld-game-v10.js` @53d9be371 (main), Z. 4316–4332 | nächster Ort in Reichweite, Reichweite je Ziel, genau ein Hinweis „E — Label: Hinweis“, Wechsel nur bei Änderung | DOM-Prompt im Spiel-Code (bei uns Hud + `hostKeys.js`) | nearest/Gleichstand/außer Reichweite/Abmelden (`test/unit/interactable.mjs`), im Browser kein Flackern zwischen zwei NPCs |
| F1b′ | Anmeldung über die Modul-Hülle | `src/ModuleHost.jsx` (kfb-planet, `bubbleAnchors` nach Vertrag R1.2 §4) | gleiches Muster für `interactables` | – | Anmelden vor, Abmelden nach `dispose()` |
| F1c | Performance-Overlay | `tools/KFB-ToolBox/_inbox/KFB Seed World Mech Destruction POC 01/KFB_SEED_WORLD_MECH_POC_01_2026-10-06/seedworld/sw-app.js` @97c891c00 (main), Z. 19 `autoReset = false`, 76 `reset()`, 92 fps/ms/calls/tris, 217–227 Speicher, 290 Höchstwerte | Messung je Bild trotz mehrerer Pässe, Speicher-Zähler, Höchstwerte über ein Fenster | eigene Render-Schleife (bei uns R3F `useFrame`) | Overlay-Werte je Slice (V-370) |
| F1c′ | Budget-Objekt + Messung | `KFB Combat Arena/combat-arena-v2/host.v2.js` @bcba56530 (main), Z. 32 `BUDGET`, 407–470 Messung | Budget als eine Konstante, Messung aus mehreren Bildern | Median statt p95 (bei uns p95 nach V-370) | `test/unit/perfBudget.mjs` |
| F1c″ | Calls/Dreiecke im Lab | `tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/src/inspect.ts` @64ae61fe7 (`sync/lab-snapshot-2026-10-11`), Z. 69–85; `…/KFB World Core R0A · Clay World Donor/WORLD_CORE_MOBILITY_R0A_2026-09-29/lab-world/clay-world.r0a.js` @39bc606cd (main), Z. 56, 60, 585–592 | gleiche Zählweise wie im Lab, damit Werte vergleichbar sind | – | – |

Für die Fluff-Physik gibt es keinen Spender im Repo. Gesucht wurde nach `windfall`, `fluff harvest` und `restitution` außerhalb von Physik-Engines; gefunden wurden nur Engine-Code und HUD-Zähler. Darum ist der Integrator ein Neubau nach V-370 („einfacher Bounce-Integrator, keine Physik-Engine“). Er braucht eine eigene Vorlagen-Zeile oder WS0-Freigabe.

## 5 · Bäume und Büsche im Repo (Reihenfolge V-369, nichts geladen)

1. **KayKit Forest Nature Pack** (zuerst): `media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/` (main, letzter Stand @f045a5311), Textur `…/Textures/forest_texture.png`.
   - 105 glTF, alle `_Color1`, keine Schnee-Varianten.
   - Bäume: `Tree_1_A–C`, `Tree_2_A–E`, `Tree_3_A–C`, `Tree_4_A–C`, kahl `Tree_Bare_1_A–C`, `Tree_Bare_2_A–C` (20).
   - Büsche: `Bush_1_A–G`, `Bush_2_A–F`, `Bush_3_A–C`, `Bush_4_A–F` (22).
   - Dazu Gras (20) und Steine (43).
2. **Tiny Treats** (danach):
   - Pretty Park `media/3D_Assets/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/` (@29aac1061): `tree.gltf`, `tree_large.gltf`, `bush.gltf`, `bush_large.gltf`, `hedge_corner/straight/straight_long.gltf`, `flower_A/B.gltf`.
   - House Plants `media/3D_Assets/Tiny_Treats_House_Plants_1.0_FREE 2/Assets/gltf/` (@9843e75df): `cactus_A–D`, Monstera, Pothos, Sansevieria, Yucca, ZZ-Plant (klein/mittel/groß, mit und ohne Topf). Für Wüste oder Innenräume.
   - Pleasant Picnic `media/3D_Assets/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/` (@29aac1061) hat keine Pflanzen, nur Picknick-Teile (Apfel, Korb, Decken). Gut als Deko an Fundorten.
3. **Kenney** (zuletzt):
   - Nature Kit `media/3D_Assets/kenney_nature-kit/Models/GLTF format/` (@6d58a9e5d; Dateien sind `.glb`): `tree_*` in default/dark/fall (blocks, cone, default, detailed, fat, oak, plateau, simple, small, tall, thin), Palmen, `tree_pine*`, `plant_bush*`, `cactus_short/tall`.
   - Holiday Kit `media/3D_Assets/kenney_holiday-kit/Models/GLB format/`: `tree-snow-a/b/c.glb`, `tree.glb`, `tree-decorated(-snow).glb` für Schnee.
   - Weitere Einzelstücke in Fantasy Town, Tower Defense, Platformer und Survival.

## 6 · Annahmen

- Maßstab: `M_PER_RIG = 0.616381042`, `WORLD_K ≈ 0.6509` (J17-Meter, V-345). Die Bühnen-Daten bleiben in WS0-Metern (`scale_m_per_u`).
- Umlaufsinn der Ränder: „clockwise seen from above“ (x rechts, +z zum Betrachter) ist gleichbedeutend mit Shoelace-Fläche in (x, z) > 0. Alle 19 Bühnen erfüllen das.
- Seeds: FNV-1a über Text-Teile plus `mulberry32` aus `kfb-cartoon-palette.js`. Gleiche Zone und gleicher Seed ergeben dieselbe Verteilung.
