# WORLD MONUMENTS01 · Atomium / Stage Scenery · Claude Code + WSA handover
Date: 2026-10-14
Status: **PLANNING / INTAKE READY · NO 3D PRODUCTION PASS · TUNE LATER**
Existing owner: `georg-doc/kayfabizarro/tools/img2threejs/` (Landmark authoring donor); receiving executor: Claude Code / WSA Work. No new runtime owner.

## Product outcome
Recover the accepted Claude Design visual language and prepare **one reusable Atomium monument/prop family** that can later serve as a modular stage/scenery object for the **next authorized KFB MVP slice**, without inserting anything into the stopped Open World build. Provide one real mobile 3D review in the existing accepted Site/preview route if applicable, plus source-isolated donor proof; prepare scene placements/adapters as **proposal only** until receiving MVP owner authorizes them. This is **not** a request to reopen WorldBuilder R4, start R5, or approve four-island geometry.

## What is actually accepted
Georg's **PASS · TUNE LATER** applies to the *original Claude Design WORLD MONUMENTS01 session cut r1* as design/handoff reference, **not** to the Atomium proof in this chat. Following the quick mobile chat demonstration, Georg's verdict was **“sieht noch sehr roh aus”**: the chat proof is **ROUGH / NOT ACCEPTED / NOT KFB STYLE-VALIDATED**. Do not spend this handover polishing the demo.

- Accepted source: `tools/KFB_WORLD_MONUMENTS01_CLAUDE_DESIGN_SESSION_CUT_2026-10-12_r1.zi`, uploaded GitHub main commit `7ea1385ac5cd3b7092407ad527baf98315b4c919`, blob `6fddd4cc802e6afeae9d49361ca74c7f9e7baf08`, 2,626,367 bytes.
- Original decision and constraints: `tools/img2threejs/docs/WORLD_MONUMENTS01_CLAUDE_DESIGN_PASS_RETURN_2026-10-12.md`.
- Production Control source mirror: workflow `KFB-WORLD-MONUMENTS01-2026-10-12`, file id `3e3d98b9-2ab8-4992-8904-9d1af8ae1d12`, mirror filename `.bin` (renamed for inbox allowlist); SHA-256 `075ca47e473d6744918db9ad88c051cea3810e94d23a9cc43c4263f893e866a9`.
- **Boundary:** Archive was not decoded or inventoried in this GitHub-checkpoint chat. Do not claim any specific atomium object, mesh, material, texture, rig or stage in it until actually inspected.

## Current chat prototype: exact scope of the rough idea
An ephemeral `AppBlock` named **“Atomium · Mobile 3D Formstudie”** was rendered in the chat. It was a self-contained 2D-canvas projection with 3D coordinate math, **not Three.js/WebGL**, not a saved GitHub prototype, and not a deployed/reproducible Mobile Preview. The sketch includes:
- nine procedurally drawn spheres (eight cube corners plus centre) and 20 connecting rods (12 cube edges plus eight centre spokes);
- pointer/touch drag for yaw/pitch, pinch/wheel zoom, reset/front/top, optional auto-rotation;
- three **invented** provisional palettes named Warm clay, Silver and Patina;
- screen-space gradients and line hatching, not actual KFB clay material, source meshes or rig;
- no standalone asset, glTF/GLB export, mobile browser QA, dedicated public Site or runtime integration.

The chat sketch is **negative/comparison evidence only**. Do not cite it as implementation donor, use its generic styles as a target, or pass it off as the accepted Claude Design approach. If reconstructing it would waste time, skip it; recover the real source instead.

## Existing reusable KFB donors (source-isolate before integration)
Read current GitHub files/heads; historical evidence is not proof of a new Atomium run:
- `tools/img2threejs/docs/WSA_REVIEW_PACKAGE_LANDMARKS_2026-09-19.md` and `tools/img2threejs/README.md` — owner, accepted/rejected history, backlog.
- `tools/img2threejs/docs/LANDMARK_WORLD_STYLE_V1_RETURN_2026-09-19.md` and `tools/img2threejs/landmarks/pilot-06/` — accepted **City Grotesque** landmark default and existing world-style bridge.
- `tools/img2threejs/landmarks/pilot-05/` and `docs/LANDMARK_BAND_RIG_V2_RETURN_2026-09-19.md` — semantic groups/pivots and attachment integrity; Spasskaya-specific donor, **do not assert it already handles Atomium**.
- `tools/img2threejs/styles/landmark-style-profiles.v1.json` — existing palette/identity grammar; adapt rather than add parallel material owner.
- `tools/img2threejs/docs/GENIUS_LOCI_CANDIDATES_V1.json` — Atomium is a **P1 graph-monument candidate**, not already an implemented/accepted mesh.
- `tools/osm-city-lab/docs/LANDMARK_OVERRIDES.md` — City Lab owns geographical placement / metre fit / fallback.
- Existing KFB Clay/Material Surface donor contracts must be freshly read and **actual source renders isolated**, not simulated via warm-colour gradient.

Reuse `tools/img2threejs` authoring / viewer / geometry infrastructure wherever applicable. Registry/Librarian remains identity owner; City Lab geography, Travel movement/contact/persistence, Race driving/physics/camera/gameplay, KFB Audio mixing and WorldBuilder ownership stay intact. No second rendering, state, physics or audio runtime.

## Proposed modular scenery contract (not canon until source evaluation)
Produce a clean, inspectable hierarchy with stable named groups: `AtomiumRoot`, `Nodes`, `Struts`, `Base`, and optional `Details`/ `PresentationRig`; graph connectivity must be explicit. Expose reversible authoring parameters for node size, connection radius, stylization/deformation intensity and surface profile. Keep world units/ground anchor, silhouette, orientation, grouped pivots and optional LOD bounded. If exporting GLB, prove **semantic nodes survive export+import**: the existing material-zone exporter may flatten hierarchy. Do not invent collision/contact; use non-physics preview first.

For an MVP Stage/Scenery receiver, design only an adapter manifest concept: source asset id/revision, transform/world anchor, staging role (`backdrop`, `hero`, `interactive-candidate`), style preset, LOD, optional beat/impact **signals owned by existing consumers**, and proof/approval state. **No automatic mounting in next MVP slide/slice** before the receiving owner and scenario are identified. One monument is sufficient; no prefab flood, second world model, generic stage furniture or replacement branding.

## Claude Code / WSA execution route
1. **Source intake and isolation:** inspect the binary cut locally (including determining whether `.zi` is a misnamed ZIP); inventory exact design assets and extract/render the real accepted source object(s) in isolation with file paths/screenshots. If Atomium does not exist in the cut, prove the actual source style system/objects in isolation first and mark geometry as **new adaptation**, not a donor reuse.
2. **Reuse map and receiving boundary:** compare the source against Pilot 05/06, style contracts, material/Clay donors and asset registry. Select one existing viewer/host. Do not reopen Four-Island R4/R5.
3. **One bounded Atomium authoring candidate:** implement original-source-grounded modular geometry, real material/lighting and mobile orbit/zoom; preserve object-group hierarchy; optional isolated GLB export only if verified.
4. **QA:** source-isolation screenshots, desktop and portrait-mobile interactive browser proof, touch/zoom/framing, geometry/graph constraints, performance information if actually measured, fresh re-load if exporting. Independent tester and critic check only implemented features; Production Guard classifies issues.
5. **Return:** exact repository, branch, Draft PR, HEAD, changed files, current-source check counts, screenshots, real Site or public Stage route **only if published and opened at the expected revision**, unresolved/TUNE LATER and exactly one next gate. Existing Site is primary; do not create a Cloudflare page solely for this planning handover.

## Tune later (nonblocking)
Clay microtexture/patina polish; highly accurate historical proportions; fine strut junction details; richer animation/reactive pulses; optional night or biome lighting comparisons; OSM/Travel/Race gameplay placement, collision, sound sync, multi-monument variants and automatic scenery assembly. Escalate only proven outcome-critical issues.

## Explicit status and next gate
This check-in is **documentation/handover only**: 0 new 3D source commits, 0 new runtime tests, 0 browser acceptance tests, 0 Site/Stage publication and 0 live promotion. No screenshot of the accepted cut's isolated source has yet been supplied here.

**One next gate: `ATOMIUM_SOURCE_ISOLATION_TO_MODULAR_PREVIEW_R1`** — Claude Code/WSA demonstrates one authentic isolated WORLD MONUMENTS01 donor/style object and one source-grounded, mobile-reviewable modular Atomium candidate, then returns evidence for Georg's future visual decision.
