# HANDOVER · WORLD-INTEGRATION-01 r2 → Georg Review / Web

## A · User intent
Die akzeptierte Hürth-Welt (PROCEED PASS) soll sich wie EIN Spiel anfühlen: saubere Boden-Lokomotion aus KayKit Character Animations (Idle → Walk → schneller → Run → Sprint, zurück, Rückwärts, Strafe, Sprung Start/Air/Land) ohne sichtbares Fußrutschen; Bewegung besitzt die Translation, Animation folgt. WB2-Editieren bleibt in derselben Welt. Hausfassaden (FACADE_RULE v1) und die Dach-/Schattenregeln gelten global, auch für normale Kölner Häuser, ohne Fake-Platten. Kein zweites Animation Lab, kein neuer Editor.

## B · Current result
- Dieselbe Seite, dieselbe WB2-Engine, dasselbe Szenendokument `kfb-worldbuilder-scene` v1; Play ↔ Edit (Tab), Raise/Lower, Radius per Rad, Object Move/Rotate/Scale/Drop, Save/Reload — unverändert.
- **Lokomotion (Consumer):** 12 semantische KayKit-Zustände gebunden und auf dieser Figur vermessen; 4 Tempostufen ohne eigenen Clip sind als *Playback-Variante* markiert (walk.fast, sprint, backward.fast, strafe.walk). Tempo je Stufe = gemessene Standfuß-Geschwindigkeit × Wiedergaberate; Wiedergaberate zur Laufzeit = gemessene Fahrt ÷ Clip-Tempo.
- **Gait Governor:** der Walker v25 wird pro Bild über seinen eigenen Parameter `speed` kommandiert (Rampe 3,2 m/s² hoch, 5,5 m/s² Auslauf). Zustände aus der Bewegung mit Hysterese-Bändern + Mindestverweildauer; zyklische Übergänge phasensynchron auf dem linken Fußaufsatz.
- **Sprung:** jump.start (steigen) → jump.air (ab Apex, vy ≤ 0) → jump.land (Bodenkontakt) → Bodenzustand. Physik besitzt die Höhe.
- **Strafe:** KayKit Running_Strafe_* schiebt den Standfuß in ±61° (gemessen), nicht 90°. Der Körper dreht um die Differenz, damit die Clip-Richtung auf der tatsächlichen Fahrt liegt → Rutschen 0,06 m/s bei 1,36 m/s.
- **Posturen:** C crouch (Crouching) · Z sneak (Sneaking) · X crawl (Crawling), jeweils mit eigenem Quell-Clip; Stand = Doppelstand-Frame des Clips.
- **Outline:** Pixelbeweis um den Graft-Kopf (6 Ansichten): 0 Geisterpixel / 108 767 sichtbare Pixel. Der Wirtskopf `Driver_Head` ist vollständig ausgeblendet (0 behaltene / 956 ausgeblendete Dreiecke). Regel verschärft: Tuschepass zeichnet genau das, was im Farbpass Tiefe schreibt.
- **OSM-Präsentation global:** FACADE_RULE v1 auf allen normalen Häusern (Hürth 6654 Fenster · 434 Türen; Köln 9682 Fenster · 370 Türen); orientEG + FrontSide/shadowSide Back + Flachdach-Routing (Solidität < 0,85) unverändert global; **neu FACE_NORMALS:** Wandnormalen nur aus Wanddreiecken — die Deckel teilten die Randvertices und kippten die oberste Wandreihe (heller Streifen unter dem Dach, gemessen n.y 0,48 → 0,16) und die unterste (unregelmäßiger dunkler Fußstreifen).
- **Host Support:** jedes Haus steht auf dem niedrigsten Geländepunkt unter seinem Grundriss; Raise/Lower unter einem Haus hebt/senkt Wände, Dach, Fenster, Türen zusammen; Walker-Boden = Dach auf Support. Keine Platte.
- **Köln im WorldBuilder:** Weltprofil `cologne` (Fixture cologne-dom-crop-v0, Spawn Trankgasse) mit Dom + Hbf als geschützte Landmarken-Owner (Platzierung validiert, OSM-Basis ausgeblendet, keine Fassadengrammatik auf Landmarkenteilen). Alstädten-Profil vorhanden.

## C · What changed this session
- `wi1-actor.js` r2: Inventar aller drei KayKit-Packs (Clipnamen im Report), kanonische Zustände, Varianten-Tabelle, Standfuß-Vektor + Richtung, linker Aufsatz, Halte-Frame, intrinsisches Rest-Rutschen je Clip, phasensyncroner Crossfade.
- `wi1-play.js` r2: Gait Governor, Stufen/Hysterese, Strafe-Ausrichtung, Posturen, Sprung ab Apex, `profile()`, `TRANSITIONS`. Befund: walk-controller normalisiert die Eingabe — r1-Rückwärts lief mit Gehtempo.
- `wi1-world.js`: Zonen alstaedten/cologne, Landmarken-Mount (wd1-landmark), `groundAt`, `onTerrain`/Support, `inkRule`, `inkGhostProbe`, `setSun` (nur Inspektion).
- `wd1-city.js` (additiv): FACE_NORMALS, Support-Datensätze + `makeSupport`, `out.detailMeshes`, Evidenz `stats.topRing`.
- `wb2d-app.js`: Zonenwahl im Scene-Drawer, `WORLD.onTerrain()` nach jedem Stroke, `WORLD.groundAt`, Mount mit `heightAt`, Bedienzeile, Fakten (Profil, Presenter, Support, Landmarken).
- `wi1-selftest.js`: 26 → 55 Assertions. DC: Tweaks `world`, `paceUp`, `sprint`; motionSet-Default `kaykit`.

## D · Source / owners / donors
| Quelle | Rolle | Pin | Status |
|---|---|---|---|
| walk-controller.js (Travel Combat v25) | Bewegung/Physik | @main | USED unverändert (UNPINNED_REMOTE) |
| KayKit Character Animations 1.1 Rig_Medium (General/MovementBasic/MovementAdvanced) | kanonische Basis-Lokomotion | @aa16a777a970 | USED |
| KFB Motion Library Rig_Medium | Alt-Set `kfb` | @main | DONOR_ONLY (nicht Vorgabe) |
| frizzlegraft-v1/graft-mount + headgraft | Figur/Kopf/Gesicht | raw.githack @main, Fallback jsDelivr @a46dbdff1503 | USED unverändert |
| wd1-seam/city/names/landmark (WB-D2) | OSM-Presenter | Projekt | USED (city additiv geändert) |
| cologne-world.v1 / cologne-landmarks.v1 (Option C lab-v9) | Dom/Hbf-Donor | @c049cae386e1 | USED (nur Köln) |
| Elastic Grotesque Clay V2 | Hausschalen | @0c59e92d | USED |
| skydome-shader via wd-sky.js | Himmel | @main | USED unverändert |
| KFB Animation Lab (locomotion.js, player.js, ground.js) | Binderegel + Sprungkette | lokal gelesen (r1) | DONOR_ONLY |

## E · Protected boundaries
Kein neuer Walker, keine eigene Physik, kein zweites Animation-Lab-UI (Welt zeigt nur eine Diagnosezeile im Play-HUD), keine neuen Clips, kein Umbau von Terrain/Sculpt/Persistenz, keine Landmarken-Geometrie, keine OSM-Erfindung, kein Race/Flight/CardCarrier, keine Korridor-Bake, keine Blender-Route.

## F · Current controls / workflow
Play: W gehen (halten ≥ 1,1 s → walk.fast) · S rückwärts (Shift → backward.fast) · A/D drehen · Q/E strafe (Shift → Lauf-Strafe) · Shift laufen (halten ≥ 1,1 s → sprint) · C crouch · Z sneak · X crawl (Umschalter) · Space springen · Maus ziehen = Kamera · Rad = Abstand · Tab = Edit.
Edit: 1 Objekt · 2 Raise · 3 Lower · Rad = Radius · Save / Reload oben · Scene-Drawer: Zone, Fakten, Welt-Selbsttest. Tweaks: world, motionSet, walkCadence, paceUp, sprint.

## G · Working / tested (ausgeführt)
Welt-Selbsttest 55/55 in Hürth und Köln (Werte in TEST_REPORT.md). WB2-Sandbox ohne `world` bootet unverändert (Key `kfb-wb2-terrain-sculpt-01`). Sichtprüfung im Preview: Hauswand/Dachkante/Fuß bei drei Sonnenwinkeln, Haus auf gehobenem Gelände, Köln mit Dom + Hbf.

## H · Open / tune / blocked
- `TUNE` backward: Walking_Backwards hat 0,12 m/s eigenes Rest-Rutschen im Quell-Clip (bei ×1,35 → ~0,17 m/s). Nicht über Tempo lösbar → Animation Lab.
- `TUNE` Variantenraten (walk.fast ×1,3 · sprint ×1,3 · backward.fast ×1,45 · strafe.walk ×0,72) sind Welt-Tuning, keine Lab-Wahrheit.
- `OPEN` Lücke walk.fast 0,95 → run 1,98 m/s: der Übergang läuft über eine 0,3-s-Rampe mit geklemmter Rate (kurz sichtbar).
- `OPEN` Straßenschilder-Masten, Resident, Boulder folgen dem Support über WB2-Snap bzw. gar nicht (Masten).
- `OPEN` Tile-Rand-Stufe bei Pinsel über die Kante (r1).
- `OPEN` Kamera-Kollision mit Gebäuden fehlt (r1).
- `OPEN` normalBias: der Donor-Wert 0,9 (WB-D1, 1120-m-Box ≈ 3,3 Texel) wurde von WB-D2 v0.10 durch shadowFollow (1,2 Texel) ersetzt, weil er Peter-Panning erzeugte. r2 behält shadowFollow; wörtliche 0,9 wären ein Rückschritt.
- `OPEN` Köln-Wasser ist flache Presenter-Farbe (wd1-water nicht gemountet); 5/369 Köln-Teile ohne Schale (degenerierte Ringe).
- `VOICE_INPUT_UNCERTAIN` Route „Lüt" → Dom → „Müllheim"/Mülheim → „SAG"/SAE — nicht aufgelöst, nichts importiert, keine Ersatzroute. `SOURCE_REQUIRED`: exakter Blender-MCP-Export/Pin.
- `NOT_RUN` Selbsttest in Alstädten, Mobil, Human Gate, WB2-Selbsttest 34/34.

## I · Rejected / superseded directions
- r1-Rückwärtsskalierung über `iy` (wirkungslos, Controller normalisiert).
- Strafe mit Körperdrehung in die Laufrichtung (r1, kein Strafe-Clip) → ersetzt durch Quell-Clips + gemessene Ausrichtung.
- Motion-Set-Vorgabe `kaykit-a` → `kaykit` (kanonisch, Alias bleibt).
- Sprung-Air erst am Clip-Ende (Jump_Start 0,6 s > Steigzeit 0,3 s → Air wurde nie erreicht).

## J · Next gate
**GEORG REVIEW · SHARED GROUND LOCOMOTION + GLOBAL OSM PRESENTATION IN THE REAL WORLD.**
