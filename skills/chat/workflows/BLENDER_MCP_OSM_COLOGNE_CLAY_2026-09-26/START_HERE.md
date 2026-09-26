# BL-OSM-CLAY-01 · OSM Cologne × Clay Look · Blender MCP briefing

Status: **READY · BLENDER MCP LOOK POC · SOURCE-EXACT CITY INPUT · NO RUNTIME PROMOTION**  
Date: 2026-09-26  
Prepared for: Georg / KFB  
Executor: **Blender MCP / Claude Code · BLENDER_STANDARD**  
Receiving owners remain: **OSM City Lab → WorldBuilder / named consumer**  
No new geography, terrain, movement, collision, Track-Core or landmark owner is created here.

## Outcome

Build one compact, source-exact **Köln Dom/Hbf clay-look comparison in Blender** using the current KFB OSM City data and the current Claybound visual benchmark.

This is deliberately **not** “import all of Cologne and make it pretty”.

The first result must answer one visual question:

> Can the current exact OSM Cologne massing be given a convincing soft / tactile / hand-shaped clay presentation in Blender, while preserving geographic identity and a clean route back to the web/GLB WorldBuilder?

Return a side-by-side proof before wider city conversion.

## Read first

1. KFB chat production router / Fresh Chat / Stage rules.
2. Current OSM City Lab:
   - `tools/osm-city-lab/START_HERE.md`
   - `tools/osm-city-lab/README.md`
   - `tools/osm-city-lab/docs/CARTOON_MASSING.md`
   - `tools/osm-city-lab/docs/LANDMARK_OVERRIDES.md`
3. Current Cologne dataset:
   - `tools/osm-city-lab/data/dom-zentrum-v0/CLAUDE_CONTEXT.json`
   - `tools/osm-city-lab/data/dom-zentrum-v0/PROVENANCE.json`
   - `tools/osm-city-lab/data/dom-zentrum-v0/SOURCE_SPEC.json`
   - `tools/osm-city-lab/data/dom-zentrum-v0/normalized.json`
4. Blender-MCP working rules:
   - `tools/KFB-ToolBox/_inbox/KFB Racetrack Blender Kit/ONBOARDING_BLENDER_MCP_CHAT.md`
5. Current Claybound/KlayBound benchmark input:
   - `georg-doc/KFB-Stunt-Car-Race/_handover/KLAYBOUND_CLAYBOUND_VISUAL_BENCHMARK_WSA_INPUT_2026-09-26.md`
   - KFB intake: `tools/KFB-ToolBox/_inbox/KFB KlayBound POC 01.zip`
6. Before touching a current World/Race branch, re-fetch its exact Recovery/Return. This POC itself must not write their runtime.

## Exact KFB source truth

At preparation time the public City Lab source on `georg-doc/kayfabizarro` contains:

- dataset: `dom-zentrum-v0`;
- bbox: `50.9325, 6.9460 → 50.9515, 6.9785`;
- origin: `50.942000, 6.962250`;
- normalized bounds: about `2279.652 × 2115.070 m`;
- 6,351 buildings;
- 5,236 roads / 2,523 driveable roads;
- 665 railway ways;
- exact Dom source: OSM `way/4532022`;
- exact HBF anchor: OSM `node/2399559029`;
- Hohenzollernbrücke: OSM `relation/5460390`;
- Deutzer Brücke: OSM `relation/3837695`.

Relevant pinned blobs observed during preparation:

- `normalized.json` → `14d3f09da6e14fb7f5dc9478f78be9f876bffab9`;
- `PROVENANCE.json` → `d4bcefd0e10c65efda929e5f7be03d2f4e10780b`;
- `SOURCE_SPEC.json` → `e2311553d5adf12149be947f23f08aca9e8595ed`;
- `CLAUDE_CONTEXT.json` → `ae0d12b3dc59e1312386bf1ea925eb0ffbb749ca`.

**GitHub state wins. Re-fetch before execution.**

Blender is an authoring/look oracle here. **OSM City Lab remains the geography/provenance/export owner.**

## Protected boundaries

- Do not query a fresh independent Cologne city and silently replace `dom-zentrum-v0`.
- Do not make Blosm, BlenderGIS, MOSAIQ, BlendSwap or Blender the new OSM truth.
- Do not deform the collision/export truth. Clay deformation is a presentation mesh/profile until a receiver explicitly accepts it.
- Do not change roads, route connectivity, terrain height, Race contact, WorldBuilder persistence or camera ownership.
- Do not replace Dom/HBF landmark owners. Procedural source footprints remain fallback until a landmark asset is independently accepted and fitted.
- Do not convert the whole 2.3 × 2.1 km dataset in the first gate.
- Do not hide failed imports with proxy cubes or generic buildings.
- Every external material/model donor is shown **in isolation first** before integration.

## Current visual benchmark

Georg selected Claybound as the current visual comparison benchmark:

- web reference: https://claybound-56949.web.app/
- discussion/reference: https://www.reddit.com/r/playmygame/comments/1whbinx/claybound_cozy_platformer_where_everything_is/?tl=de

Treat Claybound as **visual reference only**, not a code/asset donor.

For review use five axes:

1. silhouette / massing;
2. surface continuity and consistent clay-detail scale;
3. matte material + soft contact/form light;
4. simple but intentional form language;
5. calm readable camera/presentation.

The current KFB KlayBound POC is useful directionally but remains below this benchmark.

---

# Research intake · clay materials

## A · BlendSwap 29812 · first direct donor

https://blendswap.com/blend/29812

- title: **Clay shader**;
- author: **jafdet**;
- Blender 2.9x / Cycles;
- fingerprint-oriented clay shader;
- license shown by BlendSwap: **CC-BY**.

Use it first as an isolated **material donor**, not as the entire look solution.

Required:
1. append/open the donor material in a clean test scene;
2. render it on one neutral rounded cube + sphere;
3. record author/license/source;
4. only then adapt it to the Cologne source objects.

Because it is an older Cycles material, inspect node compatibility rather than assuming a current-Blender clean import.

## B · BlendSwap Procedural Material Pack 25508 · preferred CC0 A/B

https://blendswap.com/blend/25508

- Blender 2.8x / Cycles;
- **CC0**;
- includes Clay **and Asphalt** plus other procedural materials;
- source page says the materials work in Eevee and Cycles, with some displacement limits in Eevee.

This is useful for a compact **building clay + road asphalt** comparison without mixing unrelated proprietary material sources.

## C · BlendSwap Clay Blob 2445 · tactile texture reference

https://blendswap.com/blend/2445

- legacy Blender Internal source;
- **CC0**;
- includes a texture made from a scanned kneaded-eraser/clay-like surface.

Do not use its old renderer setup as architecture. Treat the texture/surface character as optional tactile-source reference.

## D · BlendSwap Procedural Clay 22286 · lower-priority comparison

https://blendswap.com/blend/22286

- Blender 2.7x / Cycles;
- **CC-BY**;
- simple procedural noise clay.

Useful only if A/B do not give enough separation. Do not expand the first test to a shader catalogue.

## E · Poly Haven Clay Plaster · CC0 PBR reference

https://polyhaven.com/a/clay_plaster

- **CC0**;
- real PBR maps including diffuse, displacement, normal and roughness;
- physically measured texture scale is published by Poly Haven.

Use as an optional third texture-scale/bake reference, not as a mandatory weathered wall look. Avoid letting cracks/weathering dominate the KFB clay language.

## Optional BlendSwap MCP sidecar

BlendSwap now documents a remote asset MCP endpoint:

- docs: https://blendswap.com/3d-mcp-api/docs
- server: `https://blendswap.com/api/mcp`

It is an **asset search/download MCP**, not Blender viewport control. If the Claude/Blender client can connect it and Georg supplies a BlendSwap API key, it may be used to search/get/download source assets. Before every download show author, license, format and cost/credit facts. Otherwise use the browser/manual download path.

---

# Research intake · OSM → Blender oracles

These are **comparison/import oracles only**. The KFB City Lab data remains authoritative.

## 1 · MOSAIQ OSM → Blender · best bounded oracle to try

Repo: https://github.com/TUMFTM/MOSAIQ-OpenStreetMap-to-Blender-Add-On  
License in repository: **Apache-2.0**.

Current README documents:

- local `.osm` / `.osm.pbf` import;
- bounding-box clipping before geometry creation;
- buildings from footprints/heights;
- road ribbons;
- sidewalks, parking and crosswalks;
- trees/tree rows;
- GLB POI prefabs by OSM tag naming;
- tested with Blender 4.4;
- `pyosmium` as the Python dependency.

Why this is interesting for KFB: its GLB POI seam could later consume verified KayKit City furniture, while the import remains a comparison oracle.

**For this POC:** feed it only a snapshot/export matching the current KFB Cologne source frame if easy. Do not let a fresh MOSAIQ query supersede City Lab provenance.

## 2 · BlenderGIS · georeferencing oracle

Repo: https://github.com/domlysz/BlenderGIS  
License in repository: **GPL-3.0**.

Useful features include OSM XML import, scene georeferencing, raster/DEM tools and terrain/geodata utilities.

Use it to answer coordinate/georeference questions or cross-check placement. Do not start a second City pipeline around it.

## 3 · Blosm · broad visual/reference importer

Repo: https://github.com/vvoovv/blosm

The project documents OSM building/road/terrain import and more advanced texture/forest options in its Pro line.

Use only if MOSAIQ/BlenderGIS cannot answer the current import/look question. Avoid “one-click new Cologne” becoming the source of truth.

---

# BL-OSM-CLAY-01 · exact first Blender gate

## Goal

Make a **small Dom/HBF source crop** look convincingly clay-made while retaining exact source identity.

The crop must be derived from the current City Lab data around:

- Dom `way/4532022`;
- HBF `node/2399559029`;
- enough immediate surrounding buildings/roads to judge street rhythm.

Do not choose a prettier unrelated block.

## Phase 0 · fresh Blender workspace

Apply the current Blender-MCP onboarding rules:

- fresh Blender file;
- additive saves only;
- scripts saved as real `.py` files;
- split jobs before the 60 s MCP timeout;
- write checkpoint JSON for long imports;
- inspect every result yourself before showing Georg;
- two failed repair passes on the same gate → STOP/export.

## Phase 1 · SOURCE ISOLATION first

Write the smallest importer/adapter that reads the **current KFB normalized Cologne source**.

Produce:

- ordinary source buildings with OSM IDs retained;
- source roads needed for the crop;
- exact local-metre scale;
- explicit Blender axis mapping;
- no clay deformation;
- no replacement landmark model.

Save/render:

- `00_SOURCE_EXACT.blend`;
- `00_SOURCE_EXACT_3Q.png`;
- `00_SOURCE_EXACT_TOP.png`;
- `osm_object_map.json`.

The visual proof must show that the real KFB source object is in Blender **before** a material is applied.

## Phase 2 · donor isolation

Create one neutral material test scene and show:

- A: BlendSwap 29812;
- B: CC0 Procedural Material Pack clay;
- C: optional Poly Haven / Clay Blob reference only if it adds a materially different result.

Same sphere, same rounded cube, same light, same camera.

Save `01_CLAY_DONORS_CONTACT_SHEET.png` and `MATERIAL_PROVENANCE.md`.

Do not tune the Cologne city yet.

## Phase 3 · three comparable city profiles

Apply exactly these first:

### SOURCE_CLEAN
Exact KFB source massing, neutral matte material.

### CLAY_SURFACE_ONLY
Exact geometry + selected clay surface/bump/roughness. No silhouette deformation.

### CLAY_FORM_SURFACE
Same material plus a restrained presentation-only geometry treatment:

- bevel/round hard edges;
- low-frequency object-normalized deformation;
- ground anchored;
- stronger variation toward upper mass only where appropriate;
- deterministic seed from OSM identity;
- no per-building hand-authored rescue pass.

This mirrors the current City Lab cartoon rule: source/collision truth stays clean; visual massing may bow/round/skew.

## Phase 4 · material scale + lighting

The main failure to avoid is “box city with noisy texture”.

Requirements:

- clay detail uses a coherent physical/world scale across small and large objects;
- fingerprints/bump do not scale independently per object;
- rough/matte response dominates;
- avoid plastic gloss;
- use soft readable key/fill/contact shadows;
- keep one camera/exposure across A/B/C comparison;
- no depth-of-field or dramatic lighting that hides geometry.

## Phase 5 · runtime/export reality check

KFB runtime remains web/Three.js/GLB.

Therefore:

- do not assume a complex Cycles node network will survive glTF;
- for a candidate runtime handoff, bake what is needed to standard PBR maps (BaseColor / Normal / Roughness / AO as appropriate);
- geometry-level clay deformation must exist in the exported presentation mesh if it is required for silhouette;
- keep a clean/source geometry path separate;
- record texture dimensions, world scale, mesh counts and material count.

No runtime integration in this job.

## Phase 6 · one review artifact

Return one compact comparison:

`SOURCE_CLEAN | CLAY_SURFACE_ONLY | CLAY_FORM_SURFACE`

Required views:

- street / low 3/4;
- elevated 3/4;
- top/footprint sanity;
- one close material crop.

Also include the isolated donor contact sheet.

Georg’s review questions, maximum three:

1. Does **CLAY_FORM_SURFACE** read as genuinely hand-shaped rather than OSM boxes with a clay texture?
2. Is the fingerprint/surface scale believable across buildings and street elements?
3. Which route should continue: SOURCE_CLEAN, SURFACE_ONLY, or FORM+SURFACE?

## Deliverables

Keep them together under a named Blender handoff folder:

- `BL_OSM_CLAY_01.blend`;
- importer/adapter `.py` files;
- `osm_object_map.json`;
- `CLAY_PROFILES.json`;
- `MATERIAL_PROVENANCE.md`;
- donor isolation contact sheet;
- city A/B/C contact sheet;
- optional presentation GLB + baked maps;
- `RETURN.md` with actual tests, known defects and exact source pins.

Do not publish a Cloudflare Stage for the Blender experiment itself.

---

# Blender MCP queue · other current KFB to-dos

These are recorded for the same Blender production chat, but **must not silently expand BL-OSM-CLAY-01**.

## NOW · BL-OSM-CLAY-01
This briefing. Cologne source-exact clay look proof.

## NEXT GATE · Track Core 1A
Current architecture: PR #219.

Track Core decision: one base Track Core; pieces are data.  
Blender MCP is the **independent oracle/proof consumer**, not the route/runtime owner.

Do not start 1A before **TRACK-CORE-0** has produced the current frame/slot/parameter/marking/piece contract and Georg’s language gate has resolved the authoritative core.

## REVIEW FIRST · SC01 bridge scenery shells
Current PR #226.

Scenery-only suspension-bridge family; no drivable deck/road geometry. Current next gate is **Georg look review in Blender**. Keep it separate from OSM Clay.

## DESIGN FIRST · Billboard B3
Current PR #225 is explicitly **not usable** and exists as exploration evidence only.

Do not “fix” those meshes directly. Next gate is a design concept round; only then return to Blender topology.

## SEPARATE TOOLBOX OWNER · FrizzleBob Blender body-family rig
Current MVP direction requests:

- complete FrizzleBob rig + ears;
- compatibility with KayKit Legacy / Rig_Medium / Rig_Large where the owning ToolBox contract allows;
- preserve Motion Library compatibility;
- Surf poses for card flight in Animation Lab.

Do not mix this character-rig work into the Cologne scene.

## SEPARATE PERFORMANCE OWNER · Orc Warband drummer
Existing Blender lane keeps the accepted leader/guitarist and needs a real combat-motion comparison for the drummer before rebuilding the performance.

Use a separate Blender file; do not contaminate the Cologne scene or the accepted band source.

## SEPARATE CITY PRESENTATION · KayKit city furniture
Current OSM City Lab PR #223 is presentation-only and already isolates real KayKit streetlights / traffic lights / benches / hydrants / dumpsters.

If BL-OSM-CLAY-01 later needs a prop-scale check, consume that owner’s accepted source rather than making new street furniture in Blender.

---

# Definition of done

This preparation becomes a useful Blender result only when:

1. the exact KFB Cologne source crop is visibly proven in isolation;
2. at least BlendSwap 29812 and one permissive alternative are visibly compared in isolation;
3. the city comparison contains SOURCE_CLEAN / CLAY_SURFACE_ONLY / CLAY_FORM_SURFACE under the same camera/light;
4. OSM IDs and local-metre identity survive;
5. runtime export limitations are documented instead of hidden;
6. no world/road/collision/landmark owner changed;
7. Georg gets one compact visual decision, not a new dashboard.

Exactly one next gate after the Blender return:

**Georg chooses the clay direction; only then does the Web/WorldBuilder owner adapt the accepted material/form recipe into the current OSM/World presentation path.**
