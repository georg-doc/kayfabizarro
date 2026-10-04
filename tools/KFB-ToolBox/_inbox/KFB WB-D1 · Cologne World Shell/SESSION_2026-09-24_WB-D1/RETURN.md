# RETURN · WB-DESIGN-PARALLEL-01 · Cologne World Visual / Authoring Shell · 2026-09-24

Status: **CANDIDATE · visual review pending (Georg)** · ran parallel to WORLD-ZONE-BAKE-01, without depending on it.
Note: no document named "KFB Production Architecture v3" was found on `georg-doc/kayfabizarro@main` (c049cae386e1) or in `KFB-Travel-Globe@main`. This job was run against the brief text plus the current owners.

## Artifact
`KFB WB-D1 · Cologne World Shell.dc.html`, plus `wd1-boot.js` · `wd1-seam.js` · `wd1-city.js` · `wd1-landmark.js` · `fixtures/cologne-dom-crop-v0.json`
Reused from this project without changes: `w0-region.js`, `w0-ink.js` (WB-W0), `support.js`.

Three views in one scene, in the order the brief asks for:
- **01 FIXTURE**: the frozen crop on its own, as a clean extrusion with neutral colours and the Dom's OSM footprint in red.
- **02 LANDMARK**: the Dom donor on its own, twice. Left: `buildDom()` exactly as delivered. Right: the same donor with height-dependent tower bend and torsion.
- **03 SHELL**: both integrated into the WB-W0 region, with the edit layer and the track socket. This is the default view.

## Exact source refs
| What | Ref |
|---|---|
| OSM fixture | `tools/osm-city-lab/data/dom-zentrum-v0/normalized.json` + `CLAUDE_CONTEXT.json` @`2ff8b350beefe02912bbff6eeeead3882e583d08` (Option C pin). Raw sha256 `8ab058da…`, OSM base 2026-09-20T03:20:04Z, © OSM contributors, ODbL. Frozen crop x −620…180 / z −300…300: 369 buildings · 844 road parts · 36 landuse · 5 water |
| Region / ground | WB-W0 `w0-region.js` (`crossSection`, `routeFromRacer`, `buildTerrain`, `rectZone`) · `w0-ink.js` |
| Route + track cross-section | `lab-v9/cologne-route.v1.js` CONTROL_POINTS[0..2] · TRACK_WIDTH.STANDARD @c049cae386e1 |
| Landmark donor | `lab-v9/cologne-world.v1.js` `buildDom` (LandmarkElastic Dom) · `buildRhine` @c049cae386e1 |
| Building grammar | **Elastic Grotesque Clay V2** `tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs` (`buildElasticShell`, `buildElasticRoof`, `protectedDetails`) @`0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`, fed with the fixture's own OSM `roof`/`materialClass`/`minHeightM`; `cartoon-city.js` `stableHash`/`deformPoint` + `styles/kfb-city-v0.json` @c049cae386e1 |
| Palette | `KFB_WONKY_90S_CLAY_V1` (copied verbatim from `viewer.mjs` @0c59e92d: walls/roofs/windows/doors/ground/road/curb/path) for the city · `lab-v9/option-c-style.v1.js` `C` for the socket |
| Water | `tools/KFB-ToolBox/_inbox/KFB StoryMap v1/kfb-fluid-v2/card-zone-v2-fluid-source.js` @c049cae386e1: GLSL verbatim from Card Zone Lab v2 (blob 43eea82f), plus `media/3D_Assets/KFB/waterdudv.jpg` + `water.jpg`. Proof line: `wasser-texturen dudv+map geladen` (the check the 2026-09-21 post-mortem asks for) |
| Editor | `tools/KFB-ToolBox/lib/edit-layer.js` `makeEditLayer` @`8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e` |
| Landmark contract | `tools/osm-city-lab/docs/LANDMARK_OVERRIDES.md` (entry shape, base-building policy) |
| Sky / light | `travel/wip/travel_globe_wsa/globe-v13/sky-presets.js` DAY · `buildLightRig` · `paintRadialSky` |

## Answers to the four questions (for Georg to judge)
1. **Does it read as one KFB world?** Candidate yes. The palette comes from one measured source, the massing from one grammar, and ink is applied to objects only.
2. **Does the stronger landmark bend/torsion work?** At 1.0×/1.2× grotesque, the two towers splay outwards, nod forwards and twist in opposite directions. The tip moves 14.7 m on a 157 m tower. The nave does not bend. Two sliders let you tune it.
3. **Are roads, buildings and landmarks hierarchical?** The layers stack in this order: plate → green/water → footways → curb → carriageway → socket. The Dom is the only stone-grey mass and is roughly 5× the height of the city around it.
4. **Are the controls legible without dominating?** QUIET is the default: one toolbar row plus a 7-button menu at the object. Details open in a drawer only when asked.

## Landmarks · KFB pass (Georg 2026-09-24)
- **Hbf** added through `lab-v9/cologne-landmarks.v1.js` `buildGeniusLoci(THREE, anchors, null)`. Only `hauptbahnhof` is kept; with `route=null` no clear-of-route offset is applied.
  - Anchor: node/2399559029.
  - Yaw −55.1°, from a length-weighted PCA of `CLAUDE_CONTEXT.hbfRailways` within 130 m. This axis is stored frozen in the fixture.
  - Fitted to the OSM hall roofs (Verifier finding: counting corners matched nothing, because the real roofs extend well beyond the donor).
    - Pass 1 uses area overlap (2 m sampling): way/461757215 · 461757217.
    - Their envelope in the hall-axis frame is 363.1 × 100.5 m, so the donor is scaled ×1.389 / ×1.543 in x/z. The 24 m barrel height is kept.
    - The centre sits 37.4 m from the station node; this offset is recorded in `placement.fit`.
    - Pass 2 marks every train_station/roof/transportation part with ≥ 30 % of its area under the hall as base: **8 parts, hidden after validation** (Δ 0 m, axis Δ 0°).
    - The side platform canopies outside the hall (way/189870933/34, 189862543/49, 141206229, 189869467, 1359653827) stay as real OSM geometry.
- **Dom + Hbf colour:** mapped from the donor grey to `KFB_WONKY_90S_CLAY_V1` via `colorSlot(id, role)` and lifted slightly (saturation ×1.12, lightness +0.03).
  - Roles: stone · second · upper · accent · glass.
  - The donor stays raw in 02 LANDMARK (left) for comparison.
- **Clay body:** both landmarks use the city's own grammar (`deformElasticXZ`) with fixed, small factors:
  - Dom: belly 0.035 · twist 1.5°.
  - Hbf: belly 0.025 · taper 0.02 · twist 0.5°.
- **No base plates:** Dom `foundation` and Hbf `plinth` are hidden; the hall is lowered by 5 m.
- **Hbf end walls removed:** the donor's two massive 'gable' boxes stood as orange slabs at both hall ends once the hall was fitted to the OSM roofs.
- **Main rails:** the rail lines come from `DESIGN_CONTEXT.json` `railways` (same pin, clipped to the crop) and are stored frozen in the fixture and in the seam as `zone.railways`.
  - Shown: OSM `railway=rail` without a `service` tag, without tunnels, layer ≥ 0. That is 60 parts, including the 4 bridge parts.
  - Drawn as **geometry** (v0.7): bed band 4.4 m, InstancedMesh sleepers 2.6 × 0.12 × 0.35 m every 1.6 m, two steel bands 0.22 m, 1.6 m gauge (slightly exaggerated). Colours come from the V2 palette.
  - The centerlines are kept so they can later be driven like roads. Heights, viaducts and the drivable track belong to WORLD-ZONE-BAKE-01 / the track owner.
- **Socket:** diagonal gold hatching at 55 % opacity plus a gold edge and end pins. No road colour and no lane dashes, so it reads as an empty place.
- **Roof artefacts:** there were two causes.
  1. Shadow acne from mixed-oriented EG triangles: mirrored z plus arbitrary OSM ring direction. Fixed with `orientEG` (the wall sample decides, the caps are corrected per triangle), plus FrontSide + shadowSide Back and normalBias 0.9.
  2. Crossing ridges on concave footprints: roofs with solidity < 0.85 are routed to `flat`. This is a host setting and is counted.

## Streets / ground level (v0.7)
- Street joins: ways are chained by class and width, butt caps, and a junction disc sized to the widest road at the node.
- Ground level: Dom lowered by 1.87 m after the foundation was removed; lower half of the Hbf glass barrel hidden; `min_height` only kept when another part carries it.
- Socket conflicts are hidden by default (ghosts off).

## Purely visual decisions that are safe to keep
- Buildings use Elastic Grotesque Clay V2 with the V2 palette. `blockPull` points at the Dom centroid (host setting; the viewer used the block centre).
- Roads, footways, curbs and green are drawn as **one ground map** (a 4096 px canvas at 0.2 m/px, with round joins and caps). This replaces the old road geometry: no end discs, no overlapping bands, no z-fighting.
- Water uses the Card Zone v2 fluid over a painted riverbed. The foam stays off, as in the source. The Rhine flows at aFlow (−0.24, −0.97).
- **Ink is off by default** (same as WorldDesign Lab v1); it can be switched on in the drawer.
- Buttons are opaque, and the active button is solid gold-brown.
- Doors and windows follow the shell. Their placement is copied verbatim from `protectedDetails()` (same random sequence); each one is built as a curved plate whose vertices go through `deformElasticXZ/Y` and the facade normal at their own height. This is a host delta.
- The toolbar is segmented and left-aligned, with details pinned top-right. The socket label is a fixed-size screen tag instead of a 3D sprite. The status line hides itself after 5 s.
- **Water settings live in the app** (details → Water · settings), with a separate setting per class (river / still / sea slot) stored in localStorage `kfb-wd1-water-v1`:
  - presets `CZ2 · scaled` (fragment shader verbatim; the only delta is in the vertex shader: `vW.xz × scale`, `aFlow × flow`), `CZ2 · source` (the Lab exactly) and `OC · buildRhine` (Rhine only);
  - fluid (the source's 5 fluids), scale, flow and textures on/off.
  - Defaults: river CZ2 scaled 0.15 / flow 1; still 0.4 / 0; sea 0.08 / 0.
  - Rhine flow direction = PCA of the OSM river polygon, pointing north. `normalized.json` has no Rhine centerline; its waterLines are the canal and drains only.
- The palette split: Option-C tones on buildings and roofs, kfb-city-v0 palette on the ground, a teal track reserved for the socket.
- Layer heights from kfb-city-v0 `layers`, plus polygonOffset for each layer.
- Roads drawn as joined bands with a clamped miter and end discs.
- The tower delta: tessellation plus `deformPoint` at a multiple of the grotesque preset. The body stays unbent.
- Ink on objects only, fading between 260 and 1500 m.
- A light factor of 0.6 on all rig lights (host setting). The owner's ratios are unchanged.
- The socket look: deep-teal plate, gold edge at ±13.14 m, cream dashes at ±9 m (DASH 5 / GAP 7), gold end pins.
- The QUIET chrome.

## Still depends on WORLD-ZONE-BAKE-01
- The real zone contents. Today `loadZone({kind:'frozen-fixture'})` loads them; the adapter for `kind:'world-zone-bake'` is deliberately not written.
- Elevation. The fixture has none, so `heightAt` returns 0. WB-W0 terrain lies around the city plate, and the hills outside the crop are region terrain, not geography.
- **8 OSM buildings inside the track socket**: Hbf Empfangshalle, three station roofs, Deichmannhaus and others. They are ghosted here and not resolved.
- 111 tunnel/underground road parts are hidden rather than represented.
- Landuse beyond green/water, the Rhine beyond the crop edge, and the base-building rule. That rule currently hides the 6 OSM parts that have ≥ 60 % of their corners inside the Dom footprint or within 3 m of it.

## Findings (named, not fixed)
- The donor Dom's long axis is 119.9 m against 145.2 m in OSM (0.83). This is the known Option-C open item and belongs to the donor.
- The Option C mirror is **not confirmed**. From reading the code, `cologne-world.v1.js buildRhine` flips z (`rotateX(π/2)` + `scale(1,1,−1)`) while `buildCity`/`buildDom` use source z directly. That would put the Rhine mirrored against the buildings. Check it in the Option C runtime.
- Under the edit layer, `hidden` on an element with inline `display:flex` has no effect, so the object menu never disappears. This shell adds a `[hidden]` reset; WorldBuilder v1 probably has the same bug.
- The TinySkies sky is a screen gradient, so it looks odd at street height. This was already named in WB-W0.

## One next integration gate
**WB-ZONE-SEAM-01**: once WORLD-ZONE-BAKE-01 delivers one baked zone for the same Dom/Hbf bbox, write only the `world-zone-bake` adapter in `wd1-seam.js`. Then switch this shell from the frozen fixture to the bake without touching the presenter, the landmark or the editor.
PASS means all of the following:
- same view, same palette, same Dom placement;
- the 8 socket conflicts are resolved by the bake (not by the shell);
- `heightAt` comes from the bake;
- 0 console errors.
