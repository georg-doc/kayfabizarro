# KFB Look Composition 01 · 2026-09-24

Status: **CURRENT DIRECTION FROM GEORG · SUPERSEDES THE "PORTABLE BUNDLE" NEXT STEP IN CHAT_RECOVERY_CURRENT.md**
Owner of this lane: the Elastic Grotesque Clay chat (PR #194), widened from "Hürth block" to "KFB world look & feel".
Apply first: `skills/session-entry-use-what-works_v1.md` (take what works, show the picture, say what changed).

## 1 · Georg's direction (verbatim intent)

The cartoon 3D look is not composed in isolation. It is built **together with**
the landmarks (StoryMap, landmark slices, OSM zones) and the world shader & texture work (triplanar etc.),
into one look & feel: **colour worlds, weather and sky dome from TinySkies**.

## 2 · Transport is solved — stop the portable bundle

- The tested V2 runs unchanged at **`https://kayfabizarro.pages.dev/kfb-hub/pruefen/huerth-look/`**
  (tiny wrapper: original index.html + `<base href>` to jsDelivr @`0c59e92d`). Human-verified in Chrome, 3 panels render, 0 console errors.
- `HUERTH01_V2_PORTABLE.html` @`f1f95108` fails in real Chrome (`SyntaxError: Function statements require a function name`, `ReferenceError: THREE is not defined`, `Identifier 'clamp' has already been declared`). Do **not** repair it. Park it.
- Rule for every future review: publish the unchanged multi-file app via the same wrapper pattern under `kfb-hub/pruefen/<name>/` on `cloudflare-live`. No chat-preview copies, no bundling, no simplified mirrors.

## 3 · World base this look is for

Decided by Georg (see `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TERRAIN_FIRST_RESET_2026-09-23.md`):

- ground = **our continuous terrain editor** (WB1 scene editor + WB2 sculpt, PR #186/#190, ZyFou/ProceduralTerrains lineage, MIT);
- first world shape = **sphere** (ZyFou Planet mode is the donor), later arbitrary shapes;
- Travel Globe is **out** as world base (its polygon anatomy cannot take the racetrack);
- from TinySkies only (modules need host global `THREE` + relative `sky-presets.js`; wrap explicitly): **sky dome, sky effects, clouds, weather, day/night, world moods, camera-flight idea**;
- Hex / voxel constructs, OSM zones and landmarks are **content placed on that ground**, not the ground.

## 4 · Donors — reuse, do not rebuild

| Ingredient | Exact source | Take | Do not |
|---|---|---|---|
| Building form language | `tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/` @`0c59e92d`, `STYLE_BENCHMARK.md`, palette `KFB_WONKY_90S_CLAY_V1` | V2 geometry grammar | return to box extrusion / cubist stacking / V1 |
| Georg's open TUNE (given on V1, re-check on V2) | `HUMAN_RESULT_HUERTH01_2026-09-24.md` on #194 | offset windows (cartoon logic), doors of different sizes, colour worlds in the spirit of 90s cartoon suburbia (mood reference only, no copied designs) | treat as new style exploration |
| Landmarks | viewer `tools/img2threejs/landmarks/pilot-06/`; style `tools/img2threejs/styles/landmark-world-style.mjs`, `tools/img2threejs/styles/landmark-style-profiles.v1.json`; catalogue `tools/img2threejs/docs/GENIUS_LOCI_CANDIDATES_2026-09-19.md` | Grotesque default, six identity colour zones per landmark, hue-only world coupling | a second landmark deformer |
| Story/tactical map | `tools/KFB-ToolBox/_inbox/KFB StoryMap v1/`, note `_handover/CLAUDE_DESIGN_WORLD_RACER_2026-09-22/STORYTELLING_MAP_WORLD_DONOR_2026-09-22.md` | canonical-vs-presentation split, Ink/Shadow profiles, D6 terraces | StoryMap water look, StoryMap as world owner |
| OSM zones | `tools/osm-city-lab/` datasets `ehrenfeld-v0`, `huerth-v0`, `dom-zentrum-v0` | normalized geometry as placed zones | a second city system |
| Surface shader & texture | `tools/KFB-ToolBox/_inbox/KFB World Design Setup (1)/WORLDDESIGN_LAB_2026-09-23/deliverables/` — `wd-look.js` (triplanar, RGB palette "Derek", colour vs value), `wd-macro.js` (seamless macro texture), `wd-ink.js`, `wd-light.js` (BASELINE/WHACKMAN), `wd-terrain.js`, `wd-voxel.js`, `textures/` | shader injection that keeps SOURCE lossless; comparison bank grammar (SOURCE / TRIPLANAR / CLAY / COMBINED) | material replacement, per-asset hand recolouring |
| Voxel palettes | `tools/KFB-ToolBox/_inbox/KFB Voxel Zone S2/voxel-zone-s2-full_2026-09-22/` (`kfb-box-material.js`, `terrain/world-context.js` STORY_PALETTES) | story palettes as colour-world input | whole world voxel |
| Sky, weather, moods (TinySkies) | `travel/wip/travel_globe_wsa/globe-v13/` — `sky-presets.js`, `sky-atmosphere.js`, `day-night.js`, `weltstimmungen.js`, `rain-overlay.js`, `starfield.js`, `sun-shadow.js`, `light-budget.js`; skydome shader `travel/KFB Travel Combat v25/terrain-v25/skydome-shader.js`; public pinned snapshot `tools/img2threejs/styles/travel-visual-snapshot.v1.json` | sky dome, clouds, rain, DAY/EVENING/NIGHT rig; rule: **mood shifts hue, not saturation/lightness** | Travel terrain, flight runtime |
| Look contract shape | `skills/chat/workflows/RACETRACK_WORLD_LOOK_AND_3D_HUD_V1_2026-09-19/START_HERE.md` § W1 | colour/light/form/pack roles + anti-drift sentence per role | a new contract format |

## 5 · Slice LC-01 · one composed look bench

One page, four synchronized views, one camera (WorldDesign Lab bench grammar):

1. a WB2 terrain patch (continuous, sculpted) with triplanar ground material;
2. one Hürth V2 block on it (TUNE items applied once);
3. one Pilot-06 landmark (Grotesque, own identity colours);
4. one small OSM zone edge (road ribbon + green).

Switches: **3 colour worlds** × **TinySkies sky/weather** (DAY, EVENING, NIGHT, RAIN) × Ink / Shadow profile.
Output: `WORLD_LOOK_CONTRACT.md` (W1 shape) with the three colour worlds as data, not prose.

## 6 · Done when

Georg opens `kfb-hub/pruefen/look-komposition/` and sees terrain, houses, landmark and zone read as **one world** in all three colour worlds and under at least DAY + RAIN.
Georg then says ACCEPT / TUNE ONCE / REJECT. Only after ACCEPT: Blender/Geometry-Nodes recipe and application to the sphere world.

## 7 · Stop rules

- No renderer rewrite, no substitute preview, no bundling.
- After two "that is not V2" remarks: stop building, diff against `0c59e92d`, report differences only.
- Each claim of "fixed" names what is different in the picture.
