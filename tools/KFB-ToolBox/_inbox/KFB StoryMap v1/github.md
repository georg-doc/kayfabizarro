repo: georg-doc/kayfabizarro
branch: planning/storytelling-map-animator-v1-2026-09-20
prev_branch: stage/storytelling-maps-v1-t2-media-standee-2026-09-20
path: skills/chat/workflows/KFB_STORYTELLING_MAPS_V1_2026-09-20/ + kfb-hub/stage/storytelling-maps/ + media/3D_Assets/KayKit_BoardGameBits_1.0_FREE/
asset_branch: asset/kaykit-bits-bundle1-2026-09-20
release_name: KFB StoryMap v1
release_target: main
release_state: NICHT GEPUSHT — dieser Arbeitskontext kann aus GitHub lesen, aber nicht schreiben.
  Der Kandidat liegt vollständig als `KFB StoryMap v1.dc.html` + `sma1-map-animator.js` im Projekt
  und ist bereit, von Georg auf main zu landen.

## Sync history

date: 2026-09-21 — see prior bullets below.

## Last sync

date: 2026-09-22T00:00:00Z
commit: 197132dc014b0b3679c95939d355b450c6f0ba8d (chatgpt-web/card-zone-v3-h0-parity-2026-09-21, PR #161)

### Updated in this project

- **Water shader re-sourced.** Replaced the ToolBox-Bench-derived `kfb-fluid-v1/kfb-fluid-shader.js`
  (a diminished form, not the source) with `kfb-fluid-v2/card-zone-v2-fluid-source.js` — source-locked
  1:1 against the real running Card Zone Lab v2 donor blob `43eea82f8727d3581e50374d6263e48a28241d3b`
  (10/10 parity: vertex GLSL 13/13, fragment GLSL 31/31, 5/5 fluid colors, both original textures,
  color-spaces, RepeatWrapping, anisotropy 8, material flags, `uTime` semantics). Sea geometry
  (`buildSeaGeometry`, quad mesh from the wet-cell mask) stays map-owned; `aFlow` is written via
  the donor's `setCardZoneV2ConstantFlow`. `kfb-fluid-v1/` deleted.

### Prior sync — Updated in this project

- **Als KFB StoryMap v1 angelegt.** Der Kandidat `KFB SMA1 Map Animator.dc.html` ist nach
  `KFB StoryMap v1.dc.html` umbenannt (ein Einstieg, kein zweiter Zweig); das Laufzeitmodul behält
  den Donor-Namen `sma1-map-animator.js`, weil die Donor-Pins in docs/SMA1-GATE.md darauf zeigen.
- `GLTFLoader` war nie importiert — das Modul hatte ihn bis zu den Board Game Bits nicht gebraucht,
  weil die Landmarks über den img2threejs-Adapter kommen. Eine Zeile.
- docs/SMA1-GATE.md hat jetzt „Offen für die nächste Sitzung“: Würfelphysik
  (`3d-dice/dice-box-threejs`, in T1 als gepinnter Donor bewiesen) und der laufende Warband-Orc
  (Rig_Legacy, 6 Knochen / 30 Clips — erst Kompatibilitätstabelle Clip × Prop an einer Figur, dann
  der Orc), dazu die zwei Deformer-Lücken (Küstenbögen in der Ebene, Voxel als Instanced-Attribute).

- Render loop fixed: the rAF fallback was a one-shot check, so when rAF stalled nothing re-armed and every action/camera/water tick froze. `setInterval` is now the driver, rAF a bonus, one timestamp guards against double-stepping.
- Board game bits placed Diplomacy-style: one KayKit bit per country over 12 area units, names taken from the verified registry run (not guessed), parented into `inner` so they follow explode / rotate / height / clearance.

- Snapshot export/import (`kfb.storymap-snapshot/v1`, rings pre-projected as flat x,z at 2 decimals) so the live OpenPlanetData catalogue can be pinned — the P1 item its own SOURCE_SPEC names. One shared `buildPiece` now serves GeoJSON and snapshot.
- Cartoon deformer wired from `travel/wip/travel_globe_wsa/kfb-cartoon-deform.js` @ main onto the landmarks (its actual geometry class); documented why it does NOT transfer to flat country outlines or to in-plane coastline bowing.
- Adjustable edge height, and a clearance guard: a rotated piece lifts over board, water and neighbouring pieces instead of intersecting them.

- UI rebuilt on the Environment Atlas idiom (`tools/KFB-ToolBox/_inbox/KayKit Environment Atlas + Dungeon Generator …/KayKit_Sample_Atlas_S20.html` @ main): one sticky 26px-button bar with `aria-pressed` state, narrow `.card` side column, its tokens verbatim. Fixes the split-screen unusability and the "Wasser aus" label ambiguity (that was the state, not the action).
- Voxels now carry `edge3.jpg` from `kfb-voxel-world-v1` on box UVs; terrain v10's own shader math is deliberately not copied (its README warns instance-coloured cubes land ~2.4× too bright and points to `calibrate()`, but no terrain v10 is in this scene to calibrate against).

- Added the voxel view: the map raster now also encodes land ownership, a chamfer distance-to-coast gives terraced heights on the donor's D6 step (cell/6), and an InstancedMesh draws ~one voxel per land cell coloured from the palette owner. `voxel-terrain.js` was checked and is procedural-only (no external field setter), so only its raster convention, colour owner and edge texture transfer.

- Added the sea: `kfb-fluid-v1/kfb-fluid-shader.js` copied verbatim from the attached KFB ToolBox Bench and driven by a map-derived wet-cell mask (7 947 cells); interior rings now feed the mask so big lakes appear. Board top darkened to seabed so the fluid layer reads.

- Fixed the triangle wedges across Norway/Denmark: the donor's index-step ring decimation (`sampleRing`, every nth point, max 480) self-intersects across narrow fjords and earcut spans the fill. Faces now triangulate the full-resolution contour.

- SMA1 palette now comes from its owner `travel/travel-v16/terrain-v16/world-palettes.js` @ main (NAMED_PALETTES verbatim, piece colours sampled from the ramp); the hand-written hex set was removed. Toolbar split into three wrapping pills with the view modes moved into the info panel — no hidden horizontal scroll.

- SMA1: added an outline-free view (pieces lifted 0.62 u so cast shadows and darkened side walls draw the edge) and a Cologne-Race-Track palette alongside the donor pastels; retry for missing countries now actually implemented.

- SMA1 UI reworked onto the Resident Atlas idiom (`tools/resident_atlas/index.html` @ main): object fills the frame, floating `.box` chrome, bottom toolbar pill, slide-away info panel, its colour tokens verbatim. Added a "Fehlende nachladen" retry for the flaky live boundary catalogue.

- SMA1 ink corrected to the real SSOT: `skills/kfb-ink-canon.js` (INK_CANON_VERSION 2, band family) loaded via jsDelivr, presets Ink / Bend / Torn with Ink as default; side faces carry the ink per Combat Arena `arena-ring.v1.js`. Miter clamp + duplicate-point removal killed the spike artefacts; a pen cap keeps small countries readable.

- SMA1: added `KFB SMA1 Map Animator.dc.html` + `sma1-map-animator.js` — the Europe Cartoon Map Board forked into a reversible puzzle-piece animator (40/40 countries, centroid pivots, 7 actions, 4 cameras, real Grotesque Eiffel donor, Travel carpet-waver ripple, canonical reset error 0).

- Added `KFB VL1 Card Rig.dc.html` + `vl1-cardrig.js` — VL1 Responsive Rounded Card Rig visual lab.
- Forked the T2 Media Standee runtime (scene, seating, material binding) instead of rebuilding it.
- New ShapeRig: mesh-space 9-slice deformation on the exact KayKit donor, thresholds re-measured at runtime.
- Added `KFB KayKit Bits Katalog.dc.html` + `kaykit-catalog.js` — 3D catalogue driven by the KFB Asset Registry pack shard; 162 models loaded and measured, incl. all 28 `domino_tile_{a}-{b}`.
- Eye placement copied verbatim from `pet-eye-rig.v6.js` (U = half height, -Z raycast fit); start values from the uploaded `eye-rig-large.batch.json` calibrationStart.
- Both labs switched to on-demand rendering (rAF fires once in this preview) — see the post mortem in docs/VL1-QA-GATE.md.
- VL1 accepted; added `KFB VL1b Media Fit.dc.html` + `vl1b-mediafit.js` (COVER / CONTAIN / focal).
- Added `docs/VL1-QA-GATE.md` with the mandatory Q&A block, GATE/NAHT notes and deferred items.

## Screen map

| Screen / file | Built from repo files |
|---|---|
| KFB VL1 Card Rig.dc.html | skills/chat/workflows/KFB_STORYTELLING_MAPS_V1_2026-09-20/CLAUDE_DESIGN_BRIEF_VISUAL_LAB_V1.md · CARD_RIG_V1.md · START_HERE.md · RECOVERY.md |
| KFB StoryMap v1.dc.html (vormals KFB SMA1 Map Animator.dc.html) | tools/kfb-cartoon-map-board/src/app.js @ dadf2fa3 (fork) · data/europe-p0/SOURCE_SPEC.json · CLAUDE_DESIGN_BRIEF_MAP_ANIMATOR_V1.md · MAP_ANIMATOR_DONOR_MATRIX.md |
| sma1-map-animator.js (palette) | travel/travel-v16/terrain-v16/world-palettes.js @ main — NAMED_PALETTES 1:1, ramp sampled for piece colours |
| KFB StoryMap v1.dc.html (UI) | tools/resident_atlas/index.html @ main — layout idiom, .box treatment, toolbar, slide-away panel, colour tokens |
| sma1-map-animator.js (ink) | skills/kfb-ink-canon.js @ main · KFB Combat Arena/combat-arena-v1/arena-ring.v1.js @ main (edge = ink, polygonOffset) · skills/kfb-embed-bundle v3/SOP_KFB-Karte-und-Tuschekante.md |
| sma1-map-animator.js | app.js @ dadf2fa3 · tools/img2threejs pilot-01/02/03 + styles @ dadf2fa3 (via jsDelivr) · KFB-Travel-Globe travel/terrain-planets-v1/card-carrier.js @ 8614282a (ripple maths) |
| docs/SMA1-GATE.md | the three planning docs + the donor pins above |
| KFB VL1b Media Fit.dc.html | fork of the accepted VL1 candidate · CARD_RIG_V1.md "Media mapping" section |
| vl1b-mediafit.js | vl1-cardrig.js (fork) · CARD_RIG_V1.md media policies cover/contain/focal |
| vl1-cardrig.js | kfb-hub/stage/storytelling-maps/t2-media-standee/src/main.js (fork) · CARD_RIG_V1.md (measured corner bands) |
| runtime donors (loaded, not copied) | media/3D_Assets/KayKit_BoardGameBits_1.0_FREE/Assets/gltf/playercard_knight_red.gltf · playerstand_red.gltf @ pin a6b9220a0b42d50a9de9804fad22e84dde2c322c |
| KFB KayKit Bits Katalog.dc.html | registry/assets/v1/packs/kaykit-boardgamebits-1-0-free.json @ 26c00b98a60e · tools/asset_registry/librarian/ |
| kaykit-catalog.js | registry pack shard (rawPinned per asset) · tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js @ 5650b6c5 (placement copied verbatim) |
| docs/VL1-QA-GATE.md | skills/session-entry-use-what-works_v1.md · skills/chat/ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md · skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md |

## Resolved

- Domino blocker CLOSED. Real name pattern is `domino_tile_{a}-{b}.gltf` (hyphen). All 28 load.
  Root cause of the miss: I probed guessed names instead of reading
  `registry/assets/v1/packs/*.json`, which lists every asset with a pinned raw URL.
  Rule for next time: the Asset Registry / Librarian is the SSOT — follow the path to the end
  before probing anything.
- The GitHub browsing tools do not list `.gltf`/`.bin` in asset folders — only images. Use the
  registry shard, never a tree listing, to enumerate 3D assets.

## Local source

- `kfb-fluid-v1/` (ToolBox Bench, now identified as a diminished form) was removed 2026-09-22.
- `kfb-fluid-v2/card-zone-v2-fluid-source.js` copied from
  `tools/KFB-ToolBox/_handover/CARD_ZONE_V2_FLUID_SHADER_SOURCE_2026-09-22/card-zone-v2-fluid-source.js`
  on branch `chatgpt-web/card-zone-v3-h0-parity-2026-09-21` — the source-locked real donor, verbatim.

## Notes for the next session

- **Frisch anfangen für Würfel und Orc.** Einstieg: `docs/SMA1-GATE.md` → „Offen für die nächste
  Sitzung“, dann diese Datei. Donor und Reihenfolge stehen dort; nichts davon neu entscheiden.

- `github_get_tree` silently omits `.gltf`, `.bin` and `.mjs` from its listings. `pilot-06/viewer.mjs`
  and all 162 KayKit models exist but never appear. Read the path or the asset registry; never
  conclude "missing" from a tree listing.
- `raw.githubusercontent.com` serves `.mjs` as `text/plain`, so `import()` fails. Use
  `cdn.jsdelivr.net/gh/owner/repo@sha/...` for ES modules — that is what the map board already
  does for the ink canon. `fetch()` of JSON is fine on raw.
- `requestAnimationFrame` fires once in the design preview. Any animated three.js page needs an
  explicit render on state change, and a timer fallback if it needs a continuous clock.

## Notes

- Nothing was published to Cloudflare from here. The Stage route
  `/kfb-hub/stage/storytelling-maps/visual-lab-v1/` is NOT claimed.
- No repo files were written. This project is the visual-lab candidate only.
