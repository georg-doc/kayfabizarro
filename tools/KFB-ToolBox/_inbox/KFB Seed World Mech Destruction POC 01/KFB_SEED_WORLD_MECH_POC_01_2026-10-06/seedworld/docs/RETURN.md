# RETURN · KFB Seed World Mech Destruction · POC 01 · 2026-10-05

**RESEARCH PLAYGROUND · NOT WORLD STUDIO · NOT COMBAT ARENA**

## Plain language
A seed alone now produces an open clay world: rolling terrain, a curved street grid, blocks, parcels, 300–600 procedural buildings within the streaming radius, trees, and smaller satellite towns. Each seed picks one of five settlement types. The real KayKit Combat Mech flies through it in third person, and you can switch between two real sources. The real Minigun spins and chews through façade cells. Rockets blow out walls; unsupported upper parts wait briefly and then collapse. A destroyed building that leaves the active area is stored as 2-bit cell states. When you come back, the same damage is rebuilt from seed + recipe + those bits.

## Repo / branch / head
- Repo read: `georg-doc/kayfabizarro` main `30558ae3b990352adb4d010278c7a43e6965b0b1` (read only)
- Suggested branch: `claude-design/seed-world-mech-destruction-poc-01-2026-10-05`
- Suggested root: `tools/KFB-ToolBox/_inbox/KFB_SEED_WORLD_MECH_DESTRUCTION_POC_01_2026-10-05/`
- **Nothing pushed.** Claude Design cannot push; no branch, no PR, no head exists yet.

## Files (this Claude Design project)
`KFB Seed World Mech Destruction POC 01.dc.html`, `seedworld/sw-gen.js`, `sw-mesh.js`, `sw-worker.js`, `sw-world.js`, `sw-destruct.js`, `sw-mech.js`, `sw-app.js`, `seedworld/docs/*`, `seedworld/screens/01–14`. Changed elsewhere: `github.md` (read note only). Untouched: WB2 / PR #348, Combat Arena / PR #19, Reality Lab files.

## Donor pins
See `SOURCE.json`. Short version: osm_building_grammar `81f1b50` (concept + default values) · Combat Mech A `b7f6013` (patch-3, Flight Family 01 gate 1) · CombatMech.glb + Minigun `2c92dd13` · Rig_Medium clips `aa16a777` · clay_floor_001 `30558ae`.

## How it differs from what already existed in this project
- **Reality Lab r3** was a fixed reconstructed corridor plus a KayKit ring, with object-level kills. It is replaced here by a seeded, streamed, procedural world with cell-level destruction.
- **rr-flight.js** was re-implemented as the single transform owner. Additions: two sources, straight and homing rockets, impulses, camera collision.
- **rr-destruct.js** was not reused. Its pooled-instancing pattern carried over, but the destruction model is new (cells, support, promotion, persistence).

## Measured
12 / 12 checks PASS (`TEST_REPORT.md`). Bench A–E in pumped mode: 3.8–11.3 ms average per frame, 167–237 draw calls on average, 1.0–1.5 M triangles, 182–360 visible buildings, peaks of 150 debris / 5 projectiles / 584 VFX (at cap) / 4 promoted (`PERFORMANCE_BUDGET.md`, `benchmark.json`). Vsync FPS in a visible tab was **not** measured.

## Evidence (`seedworld/screens/`)
01 intact settlement from the air · 02 flying mech in third person · 03 Minigun on a façade · 04 rocket impact · 05 delayed partial collapse · 06 active debris · 07 settled rubble · 08 same building after fly-away + return · 09 F1 during the rocket stress case · 10 source-isolation gates 1–6 · 11 mech B (Atlas CombatMech.glb) flying · 12–14 settlement types toytown / machiya / werkhafen.

## Unresolved
1. Frame rate and pointer lock in a visible top-level tab were not measured; the preview frame throttles rAF and blocks pointer lock.
2. Triangle load is 1.1–1.5 M, mostly LOD0 window instances.
3. Hip roofs promote into gable-like roof cells, so there is a small visual pop on the first hit.
4. On demotion, live settled rubble is replaced by the deterministic reconstruction rubble, so positions jump.
5. The clay look is a stand-in (clay_floor_001 triplanar). The K2 `clay-material.v10.js` owner was not consumed.
6. Mech B is the Atlas pose, frozen and without flight clips. Mech A clips are still a gate-1 candidate.
7. Minigun CPU cost: one long aim raycast per round.
8. Bench C after the shader warm-up and the promotion-cap fix has not been re-measured.
9. Repository persistence and the handover cut into the suggested inbox root are still open.

## Exactly one next gate
**Georg opens the page in a top-level tab, flies for five minutes, runs BENCH, and answers: PASS / TUNE / FAIL.**
If PASS: do not add content. Next comes the architectural question: which proven pieces become reusable World/Combat modules, and which stay POC-only.
