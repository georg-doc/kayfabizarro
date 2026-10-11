# Vorlagen-Inventur · Joyride-Rückgrat, Inseln, Strecken-Editor, God-Mode, HUD, Audio · R1

- **Stand:** 2026-10-10 spät · read only, nothing built.
- **Course:** Georg / steering. J17 is the gold standard for the whole look (`docs/POSTMORTEM_JOYRIDE_REGRESS_R1.md`).
- **Method:**
  - file lists, code headers and docs;
  - three own measurements in the Lab: demo scenes, sizes, screenshots;
  - three read-only search agents.
- **Three.js versions:**
  - all Joyride and Track Core runtimes are **three 0.160** (unpkg / jsDelivr import map);
  - Resident Atlas 0.184; HUD R3 0.170;
  - the Lab is **0.186.1**.
  - Every 1:1 takeover needs an r160/170/184 → r186 check.

## (1) Joyride-Rückgrat 1:1

| Teil | Pfad | three | läuft? | 1:1 | fehlt |
|---|---|---|---|---|---|
| **J17 FB Cabrio** (gold standard) | `KFB Joyride J17 · FB Cabrio/JOYRIDE_J17_2026-10-01/code/` (`KFB Joyride J17 · FB Cabrio.dc.html`, `lab-drive/joyride-drive.j10.js`, `lab-travel/*.j17.js`, `pinned/`) | 0.160 | **not on its own**: an overlay on J16 r2 (START_HERE). GLBs come from jsDelivr | everything, once laid over J16 r2 | J16 r2 base set |
| **J16 r2** (J17 base) | `KFB_JOYRIDE_J16_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r2.zip`; unzipped copy in `KFB Open World Visual Terrain Recovery Lab/donors/joyride-j16r2/` + `…/donors/joyride-j17-overlay/` | 0.160 | partly. The stream `p1b.v2.stream.json` is split into 6 parts (~10.7 MB) and must be joined. The VTR donor copy is missing `lab-track/data/`, the print texture `ref/clay-joebinns` and `blender/tc1-race-tube.v1.glb` | `lab-track`, `lab-clay`, `lab-vfx`, `lab-hud`, `bb-scene`, `support.js` | joined stream, print texture, network for CDN models |
| Track look / world (stage) | `lab-track/track-look.v5.js` (`boot()`, `WORLDS` canyon / bucht / otown: orange clay strand `#ef5a22`, road `#3d4a60/#566680`, cartoon pillars with elephant foot, table / hills / towers / trees) + `stream-to-three.v5.mjs`, `transition-atlas.v1`, `road-markings.m1/m2`, `crown-ao`, `tunnel-clay.tc1.js` | 0.160 | runs from a **precomputed stream JSON** (`window.__KFB_T4_STREAM`), **no Track Core at runtime** | yes | runtime track build |
| Banking, loops, spirals, jumps | Track Core v0.12 (Joyride `lab-track/core/track-core.v012.mjs`): `CURVE_EASE bankDeg` + `autoBank {gain 26, limit 24°}`, `LOOP` (3D teardrop), `SPIRAL`, KICKER / AIR / LANDING; recipes `lab-track/parcours/p1-recipes.js` | – | Node yes | yes | – |
| Physics | `kfb-drive.k2b.js` | – | yes | **already in the Lab** (vendored, md5 identical) | – |
| Cartoon squash (J17) | k2b squash spring + j10 l.289 `holder.scale(1+.12sq, 1−.18sq, 1+.06sq)`; barrier wobble `lean-pass.l2.js` | 0.160 | yes | yes | – |
| Full vehicle deformer v2 | `KFB Vehicle + Rigging + Animation Lab(3)/lab-v7/vehicle-cartoon-deformer.v2.js` (+ `carrig.v2.js`, `deformer-profiles.json`); proof `WEB-RACE-DEF-01/index.html` | 0.160 | proof page runs with network | presentation module, takeover feasible | **never wired into J17**; two local copies with different md5s (choose one) |
| Camera J17 | j10 l.254–334: chase on the track rail (`CAM.height`, `follow`, `camUp` follows road-up), free orbit up to 40, orbit / contact / board modes | 0.160 | yes | yes | Lab `src/play/camera.ts` is a Seed-World spring arm, **not a J17 port** |
| Palettes | `WORLDS` in track-look.v5; already mirrored 1:1 in `src/palettes.ts` (canyon, bucht, otown) | – | – | yes | – |
| Track editor | "KFB Streckenbauer" `KFB Racetrack Blender Kit/TRACK-CORE/S13_V012_2026-09-28/builder/index.html` (+ worker; same as `~/Developer/rkit-r3/trackcore/builder`) | 0.160 | yes over HTTP (core v0.12, live recompile in a worker) | yes, as the start of the editor | **piece list + inspector only**; no dragging of control points, no graph editing (FORK / JOIN read only). The path-drag editor "P4" is planned only (`rkit-r3/docs/ROAD_CONSTRUCTOR_BEHAVIOUR_NOTES.md`) |

**Not a donor:** "KFB Joyride 01" (PlayCanvas / ammo); J14 / J15 / J05 (superseded by J16 r2).

**Postmortem in brief:**
- The masterplan look sentence ("Joyride racetrack throughout") had no owner and no test. The Lab built a dark-blue asphalt road with beige sidewalks and RKIT kerbs.
- Actions:
  - J17 becomes the gold standard with a side-by-side test against `chase-curve.jpg` / `chase-straight.jpg`;
  - take over the Joyride world first;
  - RKIT kerbs only inside Georg's town.

## (2) Inseln im Raum (8 StreakByte-Demo-Inseln, unverändert)

| Teil | Pfad | three | läuft? | 1:1 | fehlt |
|---|---|---|---|---|---|
| Demo viewer | `src/demo-scenes.ts` + `demo-scenes.html?scene=01…08` (presets unity / overview / side / top) | 0.186 | **yes** (Lab). 0 errors in all 8 scenes (`docs/research/streakbyte-demo-shots_2026-10-10/shots.json`) | the loader (JSON → FBX per object, Unity matrix, x-mirror, `K`/`KM` units) | only a viewer: one scene per page, not a world |
| Scene data | `public/assets/streakbyte/scenes/01…08_*.json` (`items[]`: fbx, mesh id, Unity 4×4 matrix; `cameras[]`), models / textures in `public/assets/streakbyte/{Models,Textures}` (Unity EULA, local only) | – | – | yes | – |
| Base meshes | `src/originals.ts`, `src/island/originals-layer.ts` (comparison row, recoloured) | 0.186 | yes | – | not the full scene |

**Sizes (measured):**

| Szene | Objekte | eindeutige Meshes | Ausdehnung (Unity m) |
|---|---|---|---|
| 01 Port | 141 | 40 | 23.6 × 17.3 × 21.0 |
| 02 River | 96 | 44 | |
| 03 Backyard | 107 | 43 | 20.7 × 19.0 × 22.3 |
| 04 Beach | 56 | 39 | |
| 05 PirateCave | 134 | 74 | |
| 06 Iceland | 72 | 45 | |
| 07 PondLand | 94 | 25 | |
| 08 Forest | 74 | 36 | 21.6 × 22.3 × 20.3 |

**Scale Unity m → K2: there is no single factor.** The props inside the scenes have different scales:
- Port: bench 0.94 m long, house 2.65 m high, lighthouse 5.75 m (miniature);
- Backyard: chairs 1.68 m, table 1.2 m high (≈ 2× oversized);
- Forest: house 7.35 m.

The SCALE_CONTRACT_K2 has no StreakByte factor yet. **Proposal:** one measured factor per scene by the door / bench rule (door 1.2 H, bench seat ≈ 0.5 H). The islands stay unchanged as whole scenes; only the scene root is scaled.

**Loading into one world (no build, the path only):**
- Pull the loader out of `demo-scenes.ts` as `loadDemoScene(id) → THREE.Group` (one atlas material, unchanged).
- Root scale = factor per scene; place in the world by the anchor table (Masterplan §2: heights / clusters).
- Instance identical meshes: 25–74 unique meshes per scene, so draw calls drop from ~100 to ~40 per scene. Important after today's perf probe.
- The one atlas material stays (no clay, "as they are").

**Screenshots:**
- 32 images (8 × unity / overview / side / top, 1600 × 1000) + `shots.json` + `streakbyte-demo-shots_2026-10-10.zip` (3.4 MB) in `docs/research/streakbyte-demo-shots_2026-10-10/`. Local only (Unity EULA).
- Checked on a contact sheet: all islands fully in frame, no black frames.

## (3) Anschluss: Auf- und Abfahrten (Track Core)

| Teil | Pfad | Kann | fehlt |
|---|---|---|---|
| **Track Core 0.16.1** (newest) | `~/Developer/rkit-r3/trackcore/track-core.mjs` (CHANGELOG 0.16.1, `test-v016.mjs` 116 checks) | pure JS, Node | **only there** (outside Dropbox, not a git repo, private); Dropbox has v0.15 (`RKIT-R3/private/atlas_v015/`) and v0.14 |
| On / off ramps | v0.14+: `EXIT` / `ENTRY` (gore area, guide-wall nose, crash cushion; ramp keeps the family; `to` without an ENTRY = hard error), `DIVERGE` / `CONVERGE` (C2 swing-out) | yes | – |
| Junctions T / X / **Y 120°** | v0.13+: `JUNCTION` with n arms (`arms:[0,120,240]`), kerb corners, zebra, stop lines, lane graph, max arm gap 180°; minimum straights in `assemblies/junction_minimums.mjs` (masterplan §3) | yes | junction nodes only for the TOWN family |
| Height / bridges | CREST / DIP (≤ 8 %), SPIRAL rise, half-ramps; v0.15 `SUPPORT_CATALOGUE` C1 ground↔bridge, C2 bridge↔rim; `world_overlap` / `cross_clearance` (7 m); families TOWN / COUNTRY / MOUNTAIN / HIGHWAY / RACE / COSMIC / DRIVING_SCHOOL; transitions B1–B7 | yes | height-variable pillars (P2) not built; stone-arch renders FAIL |
| Island link (example) | `rkit-r3/trackcore/assemblies/a1b_islands.mjs`: rim highway → EXIT → junction → ENTRY; town street across the island; family change in the connector over the void | template | Gate 1b judged FAIL |
| Joyride core v0.12 | ROUNDABOUT, FORK / JOIN, PIT_LANE, SPLIT / MERGE, CONNECT | yes | **no** JUNCTION / ENTRY / EXIT. The VTR roads adapter is built on v0.12, hence "T-Kreuzung fehlt" |
| Road-bed seam | `kfb.road-bed/1`, Lab `public/roadbeds/rkit_hub.roadbed.v2.json` (rkitVersion 0.16), `src/island/roadbed.ts`, `play/drive.ts` | k2b on the road bed | ramp part, town entrance, ring road |
| Docs | Construction sheet v7 (`rkit-r3/docs/bauweise/index.html`, Georg PASS 09.10.; renders flagged 10.10.), `KFB_PROFILE_FAMILIES_v014_K2.md`, `skills/chat/KFB_OPEN_WORLD_ROAD_TRACK_CORE_CANON_2026-10-07.md` (Track Core owns the road kit, Joyride owns the look) | | |

**Important:** the Joyride runtime builds no tracks; it reads offline-compiled streams (v0.12). For a track editor between islands, Track Core (0.16 for ENTRY / EXIT / JUNCTION) has to run in the browser (worker, as in the Streckenbauer), and its output has to go through the Joyride look (`stream-to-three.v5` / `track-look.v5`). Gap: v0.16 stream → v5 look is not tested (v5 knows v0.12 streams).

## (4) God-Mode-Insel-Editor

| Teil | Pfad | three | läuft? | 1:1 | fehlt |
|---|---|---|---|---|---|
| **In-place editor** (Resident Atlas S17) | `KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-10-04_r2/lib/edit-layer.js` (`makeEditLayer(viewer, canvas, {getRoot, recordOf})`: picking, on-object menu, TransformControls move / rotate / scale G/R/S, world / local, undo / redo); docs `EDITOR_3D_INLINE_01.md`, `SNAP_EDITOR_CONTRACT_01.md` | 0.184 | yes (HTML + import map, GLBs from raw GitHub) | yes | JS not TS; menu still has text labels (B1 icon row not built) |
| Snap | `…/lib/snap.js` (`makeSnap`: grid 0.05 / 15° / scale 0.05, connector (edges, ends, tol 0.35), mount (`handslot`, tol 0.55)) | 0.184 | yes | yes | no terrain / island snap; tolerances not measured |
| Ground / sink | `…/lib/grounding.js` (`makeGrounding`: `ground()` ray down, tol 0.012; `groundOnSlope()` = lowest point under the bbox, so the uphill side sinks) | 0.184 | yes | yes | no explicit sink-% control; figure scale, coupled to `atlas.js` |
| Older generic edit layer | `KFB_WORLD_INTEGRATION_01_…_2026-09-25_r2/tools/KFB-ToolBox/lib/edit-layer.js` | 0.160 | via WB2 | – | no snap / ground |
| **Asset Librarian live search** | Index `registry/assets/v1/{manifest.json, catalog.jsonl (16,726 rows, ~20 MB), rigfacts.jsonl, packs/*.json (125), decks/*.json}`. Live base `raw.githubusercontent.com/georg-doc/kayfabizarro/bot/asset-registry-update/registry/assets/v1` (CORS `*`, no token). Search UI `tools/asset_registry/librarian/` (`search.js` `applyFilters`, `thumb3d.js` `attach3DThumbnail`) | 0.160 (UI) | static, yes | `search.js` + `thumb3d.js` are easy to lift; rows have `assetId, name, kind, format, packId, path, source.rawPinned` | no ready thumbnails, no server search, no license field per row; 20 MB JSONL heavy for a live overlay (pack index first, rows lazily); refresh button / freshness line open; `main` copy stale (bot PRs not merged) |
| **Lab God-Mode** | `src/editor.ts` (441 lines): modes view / form (outline handles, insert / delete points, move the island) / build (KayKit buildings, TransformControls), sliders, JSON save / load | 0.186 | Lab | yes | **no terrain brush**, no snap, no undo |
| Terrain deformer (per object) | `src/island/terrain.ts` `IslandField.addEmbed/removeEmbed/clearEmbeds` (sink, rise, falloff, downhill asymmetry, kind boulder / outcrop / rim, contact darkening); `?terrain=r2d/old`; recipe `kfb.island-config/1` with `edits: []` (never filled) | 0.186 | Lab | yes | free strokes |
| **Terrain brush (accepted)** | WB2 sculpt `KFB_WORLD_INTEGRATION_01_…_r2/tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/terrain-sculpt.js` (pure, raise / lower strokes, c2 falloff, serializable → fits recipe `edits[]`; Georg accepted) + UI `wb2-design-01/WB2_DESIGN_01_SOURCE.html` / `wb2d-app.js` (brush ring, radius by mouse wheel, undo) | 0.160 | yes | yes, core 1:1 onto the island field (final height = base + sculpt delta) | smooth, flatten, paint |
| Grounding / groups (Lab) | `src/environment/grounding.ts`: `footRadii`, `footPolygon`, `radiusToward`, `nest` (cluster 1 : 3 : rest = staffel 1 / 0.62 / 0.38), `fan` (debris fan downhill), `rollToRest`; `place.ts` `placeEnvironment` (rule-of-three groups, transition clusters without loners, path companions, rim rocks; `put` sinks 5–15 %; `overrides` survive regeneration) | 0.186 | Lab | yes | **no saum code** (concept only); grounding.ts used only in `probe2.ts` |
| **Pattern brush** | **none** in any KFB project | – | – | building blocks: WB2 brush ring + stroke model + `nest` / `fan` / `rollToRest` + `put` | the stroke → scatter adapter (the brush itself) |
| Vision spec | `docs/SPEC_WORLDBUILDER_GODMODE_VISION_R1.md`: archetypes, palette, terrain, placement, track editor (Track Core `CONNECT`, anchors `kfb.road-bed/1`); island = recipe incl. strokes in `edits[]` | | | | |

## (5) HUD = Claude-Design-HUD R3, komplett (Korrektur Georg: Joyride-HUD nicht, auch nicht als Funktionsvorbild)

Base: `~/Dropbox/CLAUDE/KFB HUD Flight Board - Flight VFX/KFB_HUD_FLIGHT_SESSION_CUT_2026-10-09_r1/` (`README_HANDOVER.md` = API).

| Teil | Datei (`hud-flight/`) | three | läuft? | 1:1 | fehlt |
|---|---|---|---|---|---|
| HUD core | `kfb-hud.js` (41 KB): `createHud({mode, palette, host, island, stations, autoTick, fonts})` → `setSpeed/setAltitude/setThrust/setEnergy/setHeading/setIsland/setFluff/addFluff/setMode/getMode/tick/fit/dispose`, `radio`, `backpack`. Knet plaques walk / drive / fly, mode change as a knead animation, fluff counter, compass + island name, radio, backpack slot | none (pure DOM overlay `div[data-kfb-hud=r1]`, `pointer-events:none` except radio and pack) | yes, as a module | **all** | Google Fonts (Bangers, Nunito Sans, VT323, JetBrains Mono) load from the CDN unless `fonts:false`; plaques are still smooth (R4-2/3 knead texture open) |
| Backpack | `kfb-backpack.js` (25 KB): `createPropLibrary`, `createPropRenderer`, `mountBackpackMini`, `createBagOverlay` (20 slots, cassette deck; events `insertTape/eject/ownSong/use/change/open/close`) | THREE injected + `three/addons/loaders/GLTFLoader.js` | needs network (KayKit / Tiny Treats glTF raw GitHub, commit-pinned, CC0) | **all** | Inventory owner = a simple list in the game state. `createPropRenderer` makes a **second WebGLRenderer** (`preserveDrawingBuffer`) for item previews |
| Data | `kfb-jukebox-data.js` (8 KB): `BIOMES` (burg / dystopia / utopia / protopia, each with `pal` + `hud{primary,accent}` + `sky`), `TRACKS` (12 own KFB songs, commit-pinned), `BIOME_STATIONS` (Radio Kayfabian, Demon FM, Utopia Inc. Radio, Feldfunk), `TAPES`, `ITEMS`, `PACK_MODEL`, `DEFAULT_BAG`, `BAG_SLOTS=20` | none | yes | **all** | the 8 demo islands are not biomes: an island → biome table is needed (see (6)) |
| Flight VFX | `kfb-flight-vfx.js` (33 KB): `createFlightVfx`, `createSpeedTrails`, `hoverPose`, `FLIGHT_IDLE` | `import * as THREE from 'three'` | needs scene / camera / body | yes, if cheap | no jetpack in the Lab yet (anchors), `surfaceAt` exists (`travel.surfaceAt`). **Proposal: skip in this slice** (fly mode has no vehicle yet), leave the plaque |
| Board | `KFB HUD Flight Board.dc.html`, `support.js`, `hud-board-scene.js` | 0.170 | reference only | no | – |

**r170 → r186 check (what touches three):**
- `kfb-backpack.js` and `kfb-flight-vfx.js` patch shader chunks via `onBeforeCompile` (`<common>`, `<begin_vertex>`, `<normal_fragment_maps>`, `<color_fragment>`, `<clipping_planes_fragment>`, `<emissivemap_fragment>`). If a chunk name changed, the patch silently stops applying, so check each chunk name in r186 at build time.
- `kfb-flight-vfx.js` uses a `ShaderMaterial` with `gl_FragColor` (still works through three's GLSL3 shim).
- The second WebGLRenderer = a second GL context. Measure it (only while the bag is open, or render once into an image and dispose).

**Mode mapping (Masterplan §3c, §4 "one HUD"):**

| Spielzustand | HUD mode |
|---|---|
| travel WALK | `walk`: fluff + compass / island name, no tacho |
| travel AUTO (car) | `drive`: knead tacho (k2b speed), radio, fluff |
| fly | `fly` plaque exists; no fly state yet |

- **New, the only own build:** the **Game ↔ God-Mode switch**, a plaque in HUD style (`HudParts`, palette from `resolvePalette`). It switches between `?play=travel` and `src/editor.ts`.
- **K7 knead material:** `clay-hud.v1.js` (K7) cannot be found anywhere. The nearest is `KFB Combat Arena KayKit/…/combat-arena-v6/clay-hud.v6.js` (DOM: `applyLook`, `clayFilters`, needs `lab-hud/fingerprints-512.png`). **Not in this slice**: HUD R3 as is.
- **Debug:** today's Lab overlays (stats, metrics) only with `?debug=1`.

## (6) Klang: Audio-Bett je Insel + diegetisches Radio

| Teil | Pfad | läuft? | 1:1 | fehlt |
|---|---|---|---|---|
| **Music owner** `song-transport.js` (named by the HUD R3 README) | `KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-10-04_r2/lib/song-transport.js` (149 lines, md5 identical in all 5 Resident Atlas cuts) | yes | `createSongTransport(song)`: one `<audio>`, fetch from raw GitHub with **git blob SHA-1 check**, beat clock (`bpm`, `phaseOffset`, `tempoMap`), `play/pause/load/level/bass`; `loadPlaylist(url)` | creates its **own AudioContext** (analyser) → must take a shared context; expects `{repoPath, commit, gitBlob, bpm, phaseOffset}`, while `TRACKS` has `{path, commit, bpm}` (adapter; `gitBlob` from `git ls-tree`) |
| Bed + mixer (Joyride radio) | `donors/joyride-j16r2/lab-hud/cologne-audio.v1.js` (96 lines): layers **BED / MUSIC / SFX, one mixer**, `createEngineBed` (gain, pitch by speed), `ENGINE_POOL` from `media/3D_Assets/Audio/KFB Racer/` (own pin `26c00b98`) | yes in J16 | the layer pattern + engine bed (car) | no ambience layer per island; own `new AudioContext()` too |
| Voice Layer (PR #379, not merged) | branch `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`: `real-pool-adapter.js`, `VOICE_LAYER_INTEGRATION_CONTRACT.md` | UMD | – | creates no AudioContext. The contract says the "KFB Audio" owner holds context, mix and ducking (acceptance: exactly **one** AudioContext); those owner files were **not found** → ChatterBox not yet (as ordered) |
| Private audio intake | merged on main: `skills/chat/ASSET_LIBRARIAN_PRIVATE_AUDIO_INTAKE_PREP_2026-10-08.md`, `tools/asset_registry/private_projection.py` | – | rule: private binaries **never** become public raw URLs; fields `audioClass` (MUSIC / SFX / UI / VOICE / AMBIENCE), `loopClass`, `license` | never infer BPM / rights / loop / role from a filename → my island mapping below is marked as **title heuristic** |
| Ticker | Clay Stage R2 (`KFB Clay Stage + Curtain R2 …/code/KFB_Clay_Stage_R2/billboards/stage.js`, `KFB_Billboard_Family_v1/sequence.js`: `loadPools`, `selectQuote`); quote pool PR #354 (not merged) | – | – | **no separate ticker module**; the HUD R3 radio already has a VT323 ticker line (`setTrack`, `setSource`) → ticker = HUD R3 |

**Sources on GitHub main** (`media/3D_Assets/…`, @ dccf75ca):
- **Own songs:**
  - `Sounds/KFB RoadTrip JukeBox v2` (62 songs + stems, incl. `KFB COZY STYLE C · BASE Stems (81 BPM)`);
  - Van Freestyle, Shepards Coaster, Kayfabizarro 02.2 / 06 HOOK.
- **Cozy Tunes:** `Sounds/Cozy Tunes - The Classics/Audio/ogg/Tracks/` (24 ogg, Pizza Doggy). **No license file in the repo; purchased** → handle as private: playable locally, no new copies on GitHub, steering to clarify the existing location.
- **Ambience:**
  - `Audio/Environment`: `ambient_wind`, `water_babbling_loop`, `water_dripping`, `water_splashing`, `ice_in_water`, `gurgling`, `fire_lighting`;
  - `Audio/ElevenLabs Audio`: `DSGNBass-Low_droning_ambient`, `DSGNDron-Ultra-high-quality`, `DSGNBass-Dark_cinematic_groun…`, `Seamless_heavy_rain`, `Seamless_light_stead…`, `Seamless_quirky_work…`.
- **Other:**
  - `Audio/Music/Birthday Radio - VOLE CC0` (6, CC0);
  - `Audio/Cartoonish Music Pack` (10, license to check);
  - Kenney SFX (CC0).

**Island → sound (title heuristic, proposal; loop suitability not checked):**

| Insel | Biom-Sender (HUD R3) | Cozy Tunes | Ambience-Bett | Grund |
|---|---|---|---|---|
| 01 Port | Radio Kayfabian (burg) | Wanderer's Tale, Golden Gleam | water_splashing + ambient_wind | harbour = town hub, departure |
| 02 River | Feldfunk (protopia) | Wildflowers By The River, Gentle Breeze | water_babbling_loop | flowing water |
| 03 Backyard | Feldfunk | Chickens In The Meadow, Sheep, Sunlight Through Leaves | ambient_wind (quiet) | farm / garden |
| 04 Beach | Utopia Inc. Radio (utopia) | Pineapple Under The Sea, Floating Dream | water_splashing | light, sunny |
| 05 PirateCave | Demon FM (dystopia) | Strange Worlds, Forgotten Biomes | water_dripping + DSGNBass Low droning | cave, dark |
| 06 Iceland | Utopia Inc. Radio | Polar Lights, What Clouds Are Made Of | ambient_wind + ice_in_water | cold, airy |
| 07 PondLand | Feldfunk | Ducks In A Pond, Evening Harmony | gurgling / water_babbling | pond |
| 08 Forest | Radio Kayfabian | Whispering Woods, Wind Over The Trees, Tales from the Vienna Woods | ambient_wind | forest |

The island → biome column also drives the HUD palette (`BIOMES[x].hud`).

**Owner design (template-first, no new mixer of my own):**
- **One `AudioContext`, three layers after `cologne-audio.v1`:**
  - BED = island ambience, crossfading by nearest island;
  - MUSIC = `song-transport` with the shared context;
  - SFX = later.
- **Radio = HUD R3 `hud.radio`:**
  - playlists = biome station + Cozy Tunes + cassettes from the backpack;
  - display / ticker = `setTrack` / `setSource`.
- **First user gesture** unlocks the context (browser rule).
