# RETURN · KFB Cologne Race · Option C · Elastic Cartoon World

Status: **CLAUDE DESIGN HANDOFF · NOT PUBLISHED · NOT LIVE**
Date: 2026-09-20T04:58:00Z
Producer: Claude Design
Next gate: Georg human visual/freeplay review of Option C

## Source

- Claude build/export name: `KFB Cologne Race Option C.dc.html` + `lab-v9/`
- Option-C authority board 01: `travel/wip/travel_globe_wsa/_inbox/KFB Racer Option C - ChatGPT Image 20. Sept. 2026, 05_06_22 (1).png` · blob `59fd27fcb5dae48bc159093427a3e688cc83b6a4` · 1672×941
- Option-C authority board 02: `travel/wip/travel_globe_wsa/_inbox/KFB Racer Option C - ChatGPT Image 20. Sept. 2026, 05_06_22 (2).png` · blob `ac0bf0064c8af8235a49b97d3b7e5e8196ed5579` · 1448×1086
- Option A authority status: **deferred until after Georg Option-C gate** — not opened, not sampled
- OSM raw export: `tools/osm-city-lab/data/dom-zentrum-v0/` · CLAUDE_CONTEXT blob `ae0d12b3dc59` · normalized blob `14d3f09da6e1`
- OSM source timestamp / endpoint: `2026-09-20T03:20:04Z` · overpass-api.de · raw sha256 `8ab058da444eee7bd54c367aec770bbe10c4bef2ddda636cd95b886f5dca244c`
- FILAMENT #02 benchmark pin: `KilledByAPixel/SP13KTRA` @`166ad838`, `code/levels.js` blob `75189173db4f`, circuit index 1. **License All rights reserved — used only as a benchmark for tempo and memorable beats. No source, no corner table, no coordinate, no palette, no mesh, no world scale taken.**
- Public Race baseline pin: `kfb-hub/stunt-race/track-lab/RACE_FLOW_RUNTIME_CONFIG.json` blob `27ce5d67b1aa` and `RACE_FEEL_V08_CONFIG.json` blob `38afec4b9eaf` — values used verbatim, no retune
- Vehicle assets used: `car_hatchback.gltf` (10 952 B + bin 53 564 B), `car_sedan.gltf` (10 928 B + bin 55 332 B), `car_stationwagon.gltf` (10 970 B + bin 56 172 B), texture `citybits_texture.png` (19 885 B)
- Vehicle deformer pin: `vehicle-cartoon-deformer.v2.js` blob `ce82a6265abb` — **read, not wired in this slice** (see Unresolved)
- HUD donor pin: `kfb-hub/stage/stunt-world/hud-game-v3/SOURCE.json` blob `affb1ba1d175` — its four visual rules implemented
- Billboard/CardBuilder pins: `media/kfb/index.json` blob `af276a8b941a` (kfb-deck-registry/v2), crop contract from `overworld/overworld/card-art-2d.js` blob `9485bdee2d87` (`quarter()` path)
- Kenney props used: `billboard.glb` (14 520 B), `camera_exclusive.glb` (11 560 B)
- Repo pin for every RAW load: `2ff8b350beefe02912bbff6eeeead3882e583d08`

## Implemented

State only what actually exists.

- **playable Dom Loop:** yes — closed circuit, 23 authored control points, 598 samples, **1 997,4 m**, base width 18,0 m (STANDARD from the KFB ladder), width profile per control point, banking derived from smoothed curvature and capped at ±0,42 rad
- **tunnel:** yes — one covered beat, half-shell tube plus glowing arch ribs every 7,5 m, topology tag `TUNNEL`
- **Rhine:** yes — OSM `relation/11280522:0`, 126 points, KFB shader (flow bands, crest foam, sun glint), not a flat blue plane
- **Dom:** yes — accepted donor `koelner-dom v0.2` at scale 1,873, rotated −90° so the twin towers face west, anchored on `way/4532022` at x −301,298 / z −75,744. Built extent **82,4 × 157,3 × 119,9 m**; OSM tag height 157,38 m matches
- **building passages:** buildings that overlap the track corridor span it instead of blocking it — the block begins above 11,0 m clearance and rests on piers at the footprint vertices outside the corridor. Nothing is deleted to make room; a building too low to span, or standing wholly on the ribbon, is left out and counted
- **OSM/OMS buildings:** yes — **850 real footprints** of 1 047 inside the 340 m route corridor, 17 058 triangles, per-building BuildingElastic (lean, bend, taper, twist, stable OSM-id seed) after the `cartoon-city.js` grammar. Heights from OSM (3–46,5 m). A 46 m clearance circle is carved around each hero camera
- **vehicles:** three selectable KayKit cars, measured from the glTF accessors, scale 5,1551 → 2,16 × 1,90 × 4,16 m, wheelbase 2,586 m, track 1,815 m, wheel radius 0,371 m, forward axis +Z, wheel bottom set to y=0
- **trails:** yes — two lateral ribbons capped at 0,44 m half-width each against the vehicle's 1,08 m half-width, so they never exceed the rear. Speed lengthens them, it does not widen them. Sampled every 0,35 m of travel, sided by the trail's own tangent, fading to zero — they follow hard steering without breaking
- **propulsion orb:** yes — toggleable, pulse rate and scale follow speed, stronger on boost, four curated colours as a tweak. Presentation only; movement does not read it
- **HUD:** speedometer retained (arc + needle + numeral), mini-map draws the **actual route geometry** colour-coded by topology (teal SURFACE_BOUND, warm STRUCTURE, dashed yellow TUNNEL) with the Dom as a map marker, Almanac cards landscape 16:10 fanning downward carrying **real capture frames**, radio = 3 large icon controls + volume slider, no microtext
- **billboard/card art:** yes — Kenney billboard carries a **real KFB deck page**. Live run: *Forget Utopia*, card 7, page 3, quadrant 2, via the `quarter()` contract. No invented card art
- **CCTV hero cameras:** 3, each with `cameraId / routeS / position / lookAt / FOV / shotType / triggerRadius / heroPriority`, criteria named: Dom reveal opening · Tunnel exit · Rhine bridge sweep. Trigger fires a flash and writes a capture with metadata into the Almanac
- **skydome:** yes — the TinySkies/Travel donor `skydome-shader.js` (blob f747574d4283, variant S: domain-warped 4-octave fbm, mood ramp, flow ribbons, 1 800-point twinkling star field), read and adapted. One deliberate change: the colour stops come from the measured Option-C boards, not from the Travel story palettes. Warp and contrast are halved against the donor — at donor strength the sky became a marble wall and took the track's attention
- **sky bodies:** 6 Quaternius planets and rocks (`Planet_1..6`, `Rock_1/2` from the SciFi Ultimate Space Kit, buffers and images embedded, hull ~3,8 units) placed on a golden-angle skeleton with per-body jitter, biased low toward the horizon where a driver actually looks, with the sun window kept clear
- **sky dice:** 4, from the `sky-dice.js` donor asset `media/3D_Assets/dice_ugur_lowpoly.glb`
- **sky cards:** the loaded real KFB card is also hung in the dome, following the `sky-cards.js` grammar
- **start / finish:** the real Kenney `roadStart.glb` pulled to the 20,7 m track width (factor 16,434), flanked by two chequered flags
- **checkpoints:** three drive-through gates from `overheadLights.glb` at route fractions 0,20 / 0,47 / 0,72, each scaled to its local track width and then verified for headroom — measured clearance 8,21 / 8,33 / 8,20 m against an 8 m floor
- **close orbit:** yes — mandatory inspection camera, 14,5 m orbit
- **chase:** yes — speed-reactive distance and FOV
- **oblique:** yes — 330 m high review camera

## Tests

- **browser:** Chromium preview, WebGL2
- **viewport:** 1848 × 1120 device pixels (924 × 560 CSS)
- **boot:** clean. Load order route → OSM context → Rhine → Dom → vehicle → CCTV → billboard → OMS → card
- **interaction checks:** gas/steer/drift/boost/jump all respond; lap counter advances; review modes switch; vehicle swap reloads and re-measures; orb and trails toggle; radio buttons bind; evidence panel reflects live state
- **page/script errors:** none. Verified with `performance.getEntriesByType('resource').filter(r => r.responseStatus >= 400)` → empty, 24 resources
- **failed HTTP assets:** none. All six pinned RAW donors returned 200 (normalized.json 7 198 533 B, car_hatchback.gltf 10 952 B, car_hatchback.bin 53 564 B, billboard.glb 14 520 B, camera_exclusive.glb 11 560 B, media/kfb/index.json 48 368 B)
- **missing assets:** none used. **Finding:** the repo's directory listing under `media/3D_Assets/kenney_racing-kit/` shows only Preview.png and Sample.png — the GLBs exist and were confirmed by byte query on the exact path
- **screenshots:** `screenshots/01-c.png` … `09-c.png` plus `donor-isolation.html`
- **performance basics:** 118–120 fps steady at 924 × 560, ~17 k building triangles plus track and props

## Protected owners

- [x] no second Race controller — FLOW and FEEL read verbatim from the two pinned mirrors
- [x] no invented OSM labelled as OSM — every footprint, the Rhine ring, the Dom outline and all anchors come from the cached dataset
- [x] no copied/adapted/derived SP13KTRA circuit geometry, source, palette, data or assets
- [x] no fake KFB/MED cards — real deck PDF, real page, real quadrant
- [x] no TC-01 black-ribbon foundation — the roadbed is the measured teal #279797, never black
- [x] no generic replacement HUD — HUD v3 rules implemented
- [x] no Live/public claim

## Export roster

```
KFB Cologne Race Option C.dc.html        Spielbare Design Component (Einstiegspunkt)
lab-v9/option-c-style.v1.js              gemessene Farbautoritaet mit Messanteilen
lab-v9/cologne-route.v1.js               Dom Loop, Kontrollpunkte, Spline, Heldenkameras
lab-v9/cologne-track.v1.js               TrackFlowDeformer
lab-v9/cologne-world.v1.js               BuildingElastic, Rhein, LandmarkElastic Dom, Boden
lab-v9/cologne-play.v1.js                Race v0.8 Bewegung, Fahrzeug, Trails, Orb, Kameras
lab-v9/cologne-props.v1.js               Kenney-Requisiten, Kartenbild-Pipeline
lab-v9/cologne-stage.v1.js               Buehne und Naht zur Oberflaeche
lab-v9/probe.html                        Ladetest der sechs gepinnten RAW-Spender
tools/osm-city-lab/data/dom-zentrum-v0/  CLAUDE_CONTEXT, PROVENANCE, SOURCE_SPEC, CREDITS (Kopie)
ref/option-c-board-01.png                Tafel 01, Arbeitskopie fuer die Messung
ref/option-c-board-02.png                Tafel 02, Arbeitskopie fuer die Messung
KFB_COLOGNE_OPTION_C_EXPORT/donor-isolation.html   acht Spender einzeln, vermessen
KFB_COLOGNE_OPTION_C_EXPORT/screenshots/           Browser-Belege
KFB_COLOGNE_OPTION_C_EXPORT/RETURN.md              dieses Dokument
KFB_COLOGNE_OPTION_C_EXPORT/SOURCE.json            Spender-Pins maschinenlesbar
KFB_COLOGNE_OPTION_C_EXPORT/TEST_REPORT.md         Testprotokoll
KFB_COLOGNE_OPTION_C_EXPORT/CHANGELOG.md           Aenderungen dieser Runde
KFB_COLOGNE_OPTION_C_EXPORT/STAGE_METADATA.json    Einbau-Metadaten
KFB_COLOGNE_OPTION_C_EXPORT/standalone/README.md   warum der Build verzeichnisbasiert ist
```

## GitHub metadata

Public repo: `georg-doc/kayfabizarro`
Suggested implementation branch: `claude/cologne-race-option-c-2026-09-20`
Intended Stage route: `https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/cologne-option-c/`

**Metadata only.** Claude Design has no push, no PR, no CI and no Cloudflare access. Nothing here is committed, deployed or verified as live. Work/ChatGPT performs those gates.

## HUD v4 · umgesetzt gegen den Änderungsbrief

Quelle: georg-doc/KFB-Stunt-Car-Race, Branch design/hud-v4-game-alignment-2026-09-20,
_handover/HUD_V4_GAME_ALIGNMENT_2026-09-20/HUD_V4_CHANGE_BRIEF.md (PR #30, Head f4436c83c674).

| Brief | Stand |
|---|---|
| §1 Tacho 132 × 90 | 132 × 90 |
| §1 Mini-map 96–104 | 100, bei Hover 132 |
| §1 Almanac-Karte 88–96 | 92 |
| §1 Race-State max 110 × 44 | oben links, 110 breit |
| §2 Bangers zuerst, Irish Grover zweite Wahl | beide über Google Fonts geladen, in dieser Reihenfolge im Stack |
| §2 Zahl 36–40 px, KM/H weg, optisch mittig, feste Ziffernbreite | 38 px, kein KM/H, tabular-nums |
| §3 eine fortlaufende Farbfunktion für Zahl UND Bogen | eine Rampe über die vier Stopps des Briefs, stufenlos |
| §3 Grip kühl und ruhig, Boost warmer additiver Puls | Grip cyan ohne Puls, Boost orange gepulst darüber |
| §3 rote Zone kommt vom Tempo, nicht vom Boost | die Rampe hängt allein an speedNormalized |
| §4 Hover 240–300 ms auf, Austritt 300–340 ms | 260 ms auf, 320 ms zu |
| §4 echte Route, kein Oval | unverändert echte Route |
| §5 420 ms, cubic-bezier(.22,.78,.22,1), 40–50 ms Versatz | 420 ms, genau diese Kurve, 45 ms Versatz |
| §7 Waypoint zurückgestellt | nicht gebaut |
| §8 Anthrazit/Dunkelbraun, keine Pastellpalette | HUD-Grund rgba(20,16,14,…) |
| §9 geschützte Besitzer | Bewegung, Physik, Kamera, Streckengeometrie, Route unangetastet |

**Eine bewusste Abweichung von §6.** Der Brief nimmt die Radio-Controls aus dem Driving-HUD.
Georg hat in derselben Runde ausdrücklich "nur 3 Buttons & Slider per Default" und "im Radio
sollen die Controls sein" verlangt. Umgesetzt ist die mündliche Ansage: der Default-Kopf trägt
Burger, Prev, Play, Next und den Lautstärkeregler; alles Übrige liegt hinter dem Burger in
lesbarer Größe. Oben links sitzt der Race-State, der Score-Platz ist reserviert und LEER —
kein erfundener Wert, wie §6 es verlangt.

## Cologne genius loci · built

**The finding first, because it decided the method.** There is no donor to load:
the pinned asset handoff carries 213 assets and not one is Cologne (checked for
dom / kölsch / koeln / cologne / landmark / brewery / kiosk — zero hits), and the
project's own genius-loci catalogue `tools/img2threejs/docs/GENIUS_LOCI_CANDIDATES_V1.json`
lists 22 candidates from the Acropolis to the Guggenheim with nothing from Cologne.

Built instead by the rule that catalogue states for exactly this case —
`"sourceStrategy": "OSM footprint + public dimensions + authored low-poly modules"`:
WHERE comes only from the measured OSM anchors in `CLAUDE_CONTEXT.json`, HOW from
authored Option-C modules using publicly documented principal dimensions. No scans,
no borrowed meshes.

| Landmark | OSM anchor | built extent | dimension basis |
|---|---|---|---|
| Hohenzollernbrücke | relation/5460390 · x −211,8 / z −62,1 | 418 × 39,8 × 30 m | ~409 m, three arch spans, ~25 m rise |
| Deutzer Brücke | relation/3837695 · x 266,2 / z −622,4 | 437 × 16,1 × 32 m | ~437 m, box girder |
| Hauptbahnhof | node/2399559029 · x −223,0 / z 87,3 | 257 × 50,9 × 68,7 m | platform hall ~255 × 64 m, barrel roof ~24 m |
| Museum Ludwig | node/633480736 · x −156,3 / z −129,7 | 135 × 31,7 × 92,7 m | sawtooth zinc roof, ~135 × 90 m |
| Kölner Philharmonie | node/633480737 · x −100,0 / z −154,1 | 108 × 21,2 × 114,8 m | plaza surface with conical swelling |

**How landmarks are kept off the track.** Three levers in order, each reported per landmark:
a small capped offset; shrinking my OWN module (that is mine, OSM owns only the anchor); and
vertical separation, where a route passing above the arch crown is not a conflict. The clearance
test is the rotated rectangle against all 598 route points — an earlier circular test with radius
max(sx,sz)/2 made a 255 m train hall unclearable although it lies lengthwise beside the track,
and an inflated 72 m bridge margin from that era threw the Hohenzollernbrücke away entirely where
the real gap was 21 m. Current state: four landmarks exactly on their OSM anchor, Hauptbahnhof
with a declared 28 m offset, none shrunk.

**One measured conflict, resolved in favour of OSM.** The Hohenzollernbrücke stands on its
real anchor: deck at y 12, arches reaching y 37. The old Rhine deck of the route ran at
y 14–18 and passed straight through it. The bridge was not moved — OSM owns the WHERE.
The route climbs instead, to y 30–46, and now flies over the real bridge. A 46 m clearance
circle is also carved in the OMS block field around every landmark so no generic massing
grows through them.

## Route audit

`stage.auditRoute({clearanceM, step})` samples every third of the 598 route points against
every mesh reaching into the driving volume (ribbon plus headroom). This round: **40 → 4 → 0**, measured at step 1 (every one of the 598 route points against 463 meshes).

Nothing left. The last four turned out to be three false positives (the audit filter tested only
the first named ancestor, so the chequered flags' own glTF names hid `flagCheckers` from it) and
one real obstruction — a bridge pier on the ribbon at the tunnel mouth.

Excluded from the count, with reasons: the city meshes are merged by tone, so their bounding
box spans half the map and says nothing about individual houses — the load-bearing test for
buildings is the point-in-polygon test at build time (`city.portals` / `city.skipped`). The
start line, the gates and the vehicle's own drive stand in the driving volume by design.

**The cause of "still driving through buildings".** The corridor test only sampled footprint
EDGES, within a ~30 m search radius. A large building whose edges are all farther away while
the route runs through its middle passed the test untouched. Point-in-polygon answers that
directly: 73 buildings are now dropped (previously 0), 2 get a passage.

## Passages · measured

| | length | width | clearance |
|---|---|---|---|
| Tunnel (s 369,4–485,9) | 120,1 m | 12,7–16,2 m | 11,5 m |
| 8 gates | — | 13,0–22,4 m, each following the local ribbon | 9,0 m |

Vehicle height 1,90 m. Screenshot proof of driving through: `screenshots/0*-passage.png`,
`screenshots/0*-cam.png`.

**Gates use the bridge-arch construction.** Two attempts failed before this: scaled Kenney models
(a slender arch became a slab across the road), then an invented portal of thick pale tubes that
matched neither the architecture nor the palette. The Hohenzollernbrücke arch already worked —
a parabolic run of short segments on abutments — so the gates now carry that construction,
spanned to the local ribbon width and recoloured. Its hangers were dropped: on a bridge they
carry the deck, on a gate they stood as six columns across the driving line.

**The finish line is a texture on the ribbon**, not a stack of floating tiles — a strip following
width and banking, UV-mapped to a seamlessly repeating 2 × 2 chequer.

**The Kenney gates were removed.** They are modelled to their own lane width; scaling one up to
an 18 m ribbon turned a slender arch into a slab lying across the road. Distorting a model so it
fits is the wrong way round. Gates are now parametric track components built from the local
width, banking and tangent — two base shapes, palette colours, no scaled model anywhere.

## Unresolved

1. **Vehicle cartoon deformer not wired.** `vehicle-cartoon-deformer.v2.js` (blob `ce82a6265abb`) was read and pinned, but this slice drives the KayKit model rigid — only steering, wheel spin, pitch and roll. The squash/stretch seam is declared, not connected.
2. **Dom long axis is 18 % short.** Donor v0.2 gives 119,9 m along the nave against OSM's 146,0 m footprint; the height 157,3 m matches the tag. The profile already says `DOM_V0_2_ACCEPTED_STYLE_NEEDS_MODULAR_GROTESQUE_MIGRATION` — this measurement is one more argument for that migration.
3. **No single-file standalone.** One was built (133 KB) and failed in the browser: the stage is an ES module graph with an `importmap`, and inlining the modules removes their resolution point. `standalone/README.md` records the measurement and names the directory build that does run.
4. **normalized.json is fetched whole at runtime** (7,2 MB). It works and it keeps the data pinned at source, but a Dom-corridor slice file would cut the first load substantially.
5. **Buildings carry no window or roof detail** beyond the coloured cap plate. `windowCodesForBuilding()` exists in the donor and is unused here.
6. **No opponents.** The world supports overtaking width; there is no AI field.
7. **Radio needs one user gesture** before audio plays — browser autoplay policy. The three tracks are pinned but unheard until the play button is pressed.
8. **Almanac holds captures, not KFB cards.** The rule asks for real KFB landscape cards; the fan currently shows real race captures in landscape. The card pipeline is proven on the billboard and can feed the fan next.

## Exactly one next gate

Georg human visual/freeplay review of **Option C**. Option A does not start before that.
