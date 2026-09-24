# BACKLOG + SPRINT PLAN · KFB Cologne World · draft 2026-09-24

For a fresh chat. Order per Georg: **Hürth → Rhine/Mülheim/SAE → Ehrenfeld → Kölner Ringe as a track extension.**
Every sprint starts with the same shell (`KFB WB-D1 · Cologne World Shell.dc.html`) and the same seam (`wd1-seam.js`). New areas come in as a new zone source, never as a second presenter.

## Source status (checked 2026-09-24, kayfabizarro@c049cae386e1)
| Area | OSM in the repo | Status |
|---|---|---|
| Dom/Hbf | `osm-city-lab/data/dom-zentrum-v0/` normalized + CLAUDE/DESIGN_CONTEXT | used (frozen crop) |
| Hürth | `osm-city-lab/data/huerth-v0/normalized.json` + `scenes/huerth-v0.json` | **available** |
| Ehrenfeld → Hürth corridor | `data/ehrenfeld-huerth-corridor-v0/` (QUERY_PLAN, SOURCE_SPEC, PROVENANCE) · `evidence/ehrenfeld-huerth-route.json` · `docs/CORRIDOR_*` | plan + route evidence; **normalized geometry needs checking** |
| Ehrenfeld | `data/ehrenfeld-v0/` (SOURCE_SPEC, PROVENANCE, STYLE) | **normalized.json not in the tree**, source workflow needed |
| Mülheim / SAE (Carlswerkstr. 11c) | — | **no cache**. The dom-zentrum bbox ends at 50.9515 N; Mülheimer Brücke and Carlswerk lie north of it |
| Kölner Ringe | dom-zentrum partial (Hansaring, Theodor-Heuss-Ring, Ebertplatz) | southern Ringe (to Ubierring) outside the bbox |

Rule (brief + OSM City Lab policy): **no new OSM fetch in Claude Design.** New caches come from the OSM City Lab / WORLD-ZONE-BAKE lane; Claude Design uses only committed data.

---

## Sprint 1 · WB-D2 · Hürth
**Goal:** Hürth as a second zone in the same shell. Roads/rails are linked to the Dom zone by reference; the zones do not have to border each other geographically.
- S1.1 Freeze a Hürth crop from `huerth-v0/normalized.json` (like `cologne-dom-crop-v0`) → `fixtures/huerth-crop-v0.json`. Show 01 FIXTURE in isolation first.
- S1.2 Zone switcher in the shell: `loadZone` per zone. The palette, Elastic Clay, ground map and water presets stay identical.
- S1.3 Link roads/tracks: from `ehrenfeld-huerth-route.json` / `CORRIDOR_*`, only as a **socket chain** (as with the track socket). No drivable geometry of our own.
- S1.4 Pick one landmark for Hürth, e.g. a church or a known building from `heroCandidates`, and place it under the override contract.
- Gate: same look as Dom/Hbf; zone switch without reload; 0 console errors; corridor sockets carry source refs.
- Dependency: corridor geometry via WORLD-ZONE-BAKE-01 or the OSM City Lab corridor.

## Sprint 2 · WB-D3 · Rhine → Mülheimer Brücke → SAE Institute (Carlswerkstraße 11c, 51063 Köln-Mülheim)
**Goal:** an Rhine-bank strip from Dom/Hbf north to Mülheim, with the Mülheimer Brücke as a landmark and the SAE / Carlswerk area as the destination zone.
- S2.0 **Blocker:** request an OSM cache. It needs a new SOURCE_SPEC in the OSM City Lab (bbox roughly Dom north edge → Mülheim/Carlswerk) and one cached refresh. Not in Claude Design.
- S2.1 Rhine as one continuous water body with river flow along the bank (cz2-scaled preset). Test river bends. A flow centerline would have to come from the bake.
- S2.2 Mülheimer Brücke landmark. No donor exists (the Option C catalogue has Hohenzollern/Deutzer only). Options: Option-C-style low-poly from public dimensions, or Blender → GLB.
- S2.3 SAE / Carlswerk: brick-hall character (sawtooth roofs from OSM `roof:shape` if present). Map to Elastic Clay; no photo textures.
- Gate: continuous Rhine bank without a zone seam at the handover; the bridge is readable from the bank camera.

## Sprint 3 · WB-D4 · Ehrenfeld (Grimmstraße 8, 50823 Köln)
**Goal:** Ehrenfeld as a dense residential zone. It shows whether the cartoon grammar stays readable in narrow streets.
- S3.0 Check the source: `ehrenfeld-v0` has no normalized.json in the tree. Normalise it via the OSM City Lab or take it from the corridor.
- S3.1 Street camera at 1.7 m: this is where the ground-map resolution matters (0.2 m/px now). Likely: tiled ground map or LOD rings.
- S3.2 Ehrenfeld landmark: e.g. Heliosturm, if it is in `heroCandidates`, otherwise name it.
- Gate: street view without blur or aliasing; building distances do not look narrower than in OSM.

## Sprint 4 · WB-D5 · Kölner Ringe as a race-track extension
**Goal:** the Ringe as a track-socket chain: Ebertplatz → Hansaring → … → Ubierring.
- S4.0 Extend the OSM coverage south, or cover it via the Sprint 2 cache.
- S4.1 Ring segments as sockets by reference (like CP0→CP2). The track module comes from the race/track owner.
- S4.2 Ring-typical landmarks, e.g. Ebertplatz fountain, Rudolfplatz Hahnentorburg. Name the donor for each, or mark it missing.
- Gate: socket chain closed, with no building conflicts or with conflicts reported to the bake.

---

## Carry-over backlog (from this session)
- [ ] Georg acceptance of WB-D1 recorded formally
- [ ] WB-ZONE-SEAM-01 (next integration gate, see HANDOVER)
- [ ] Skydome presets in the app settings, like water (Georg: test them in combination)
- [ ] Hbf/Dom as final hero assets, e.g. via Blender → GLB through the same override contract (check the Blender MCP first)
- [ ] Ground map for close-ups: tiling / LOD instead of a single 4096 px map
- [ ] Rail geometry (3D) instead of the map, once the track/rail owner defines drivability
- [ ] Socket tag hidden behind buildings (occlusion)
- [ ] Owner feedback: Elastic Clay orientation, edit-layer `hidden`, Option C Rhine mirror
- [ ] Standalone/live version: needs a JS build + hosting (see HOUSEKEEPING, WorldDesign Lab finding)
