# WS0 → Work / WS1 Integration Brief Candidate — Cascade Sphere Prototype Factory Maze R4
**2026-10-28 · PREPARATION / NOT AN AUTHORIZATION TO MODIFY CURRENT WS1.**
**This is the one Work-ready conceptual brief for later explicit WS0 approval.** It references existing PR #435, source R1–R3, R4 Blueprint, Contract Candidate, three Level Fixtures. Avoid creating a duplicate product spec outside the owner. Retain current single next gate `WS0_PLATFORMER_ASSET_INTAKE_AND_L01_SOURCE_GATE`.

## Product outcome / non-outcome
Deliver one coherent miniature source-authentic *Factory Maze* inside the **existing live WS1 R3F game owner**, with three short, readable runs. At every run an actual authored connection changes where Fluff goes. Core delight: switch/flow/bounce, then Goo/Minigun/repair, then a rooftop Mech-activated relay. Single renderer/movement/combat/audio/save. Preserve KFB Clay source material, creator identity and optional Sweet Supply theme without building a restaurant game. After standalone entry proof, a World-owned POI/portal can offer encounter + safe return.

**Non-outcome:** another low-poly separate three.js demo with fake player/collision/sound, a second universal WFC engine, all of Cologne, 500 agents, bespoke grappling hook, a new Card deck, a second game HUD, unmeasured FX overload, or a decorative nice picture with no working switch/packet consequence.

## Role and ownership before any code
- **WS0 (Game Design/Data + Asset Librarian):** confirms actual purchased Platformer FREE/EXTRA provenance, source hash, version, allowed public/private intake; pins chosen original assets and visual isolation; approves one L01 fixture and current design/3D canon; resolves which original Card(s), if any, appear.
- **Work Builder/Integrator (only productive writer, WS1 current owner):** re-fetch exact latest active WS1b source + current contracts; reconcile R4 candidate JSON with real data/API; implements one thin encounter adapter and L01, then upgrades L02/L03 after green evidence. Never write onto a stale `ws1/combo-r2` snapshot based solely on this brief.
- **Integration Tester (separate):** tests real graph/unit+host flows, actual source model render, mobile controls, save/reload and sound facts.
- **Independent Critic:** reads live scene via gameplay controls from real device/browser and scores tactile action/readability/visual source fidelity/scope at a named checkpoint.
- **Production Guard:** reviews evidence, chooses continue/repair/quarantine/stop. Only after assembled product and critic feedback can Georg decide PASS/TUNE/FAIL. Apply `skills/chat/KFB_INDEPENDENT_EXECUTION_GUARD_CONTRACT_2026-10-05.md`; no Builder self-acceptance.
- **Stage/Site:** no new Site on concept acceptance; if current target is Site-capable, prefer existing appropriate owner Site according to KFB Site-first policy. A Live launch is a separately owned decision. Do not invent a public URL.

## PREWORK P0: Exact sources and fixed fixture, not a giant asset migration
1. Read R4 Blueprint, candidate module contract, three fixtures and R3 asset-intake; choose 5–8 original source models and ONE factory palette.
2. Finish Platformer FREE/EXTRA asset source intake from provided Dropbox with original license, paths/size/digests, correct color textures and build visibility. Existing sealed `georg-doc/kayfabizarro-private-assets` V-538 manifest must be left unchanged; create a separate authorized intake destination if needed.
3. Isolate source models in actual Asset Librarian/Kit Lab: City Builder road T + building, Prototype floor/door/target, Platformer lever/button and conveyor, real Combat Mech/Minigun; Bakery case/croissant only for optional art variant. Check orthographic and gameplay view + bounding boxes, collision feet, actual material.
4. Pin exact current WS1b writer/branch/host, relevant Combat HitEvent, Audio, World Save, Player Save interfaces; emit KEEP/ADAPT/REJECT/SOURCE_REQUIRED per donor.
5. Freeze L01 one source junction, two routes, one switch, one destination, first short wave. Don't wait for full WFC/OSM or q103 if L01 doesn't use either.

## Integration path with explicit exits
### C0: pure rules test, no visual claim
- Parse candidate fixtures and validate unique node/edge IDs, endpoints, switch/socket target, initial blocked and final traversable routes, same seed/action order replay, blocked all-path WAIT, switch reverse, no premature packet arrivals, packet/receipt dedupe.
- Avoid separate `setInterval`/rAF. Use host-owned fixed tick; game state and world-save owner mapped before code.
- **Exit:** a pure test report with passing fixtures and one rerun, exact committed code, no visual acceptance claim.

### C1: L01 SWITCHYARD in the actual WS1 host
- Existing camera, player, input, assets, terrain, physics and one HUD; exact KayKit road/Prototype meshes and original materials, not rough greybox stand-ins declared final. Source lever activation changes canonical edge. One small Fluff group visibly queues, diverts, arrives in coherent route.
- One short continuous clip from normal Play; one reset/same-seed sequence. Mobile tap large enough to activate and source display unobscured.
- **Exit:** observable original model + input→route causal proof + visual/interactive desktop/mobile testing. No WFC mandatory.

### C2: L02 BLACK GOO BLOCK
- Combat owner emits real accepted ShotEvent→HitEvent. Only opted-in detachable shell hit; original intact KayKit model remains. Accepted hit changes local contamination/damage, yields candidate Fluff through source owner, repair consumes source-owned resource and changes a real edge/surface. Arrival sequence and save/reload remain source-identical.
- **Exit:** one shot→visual physical break→actual route blockage/open→resource→repair→arrival chain, independently verified no duplicates and no body collision mismatch.

### C3: L03 ROOFTOP RELAY
- Existing Mech flight/motion reaches validated roof station; source Platformer button actually mounted; pressure/contact triggers one edge, at most 2 short waves. Desktop direct third-person; mobile accessible approach or authorized Build interaction per same state truth. Test jump/land/contact/camera occlusion/sound.
- **Exit:** actor physically reaches/activates source switch, Fluff wave changes path and landmark receives packets, safe exit and return tested.

### C4: optional controlled procedural and narrative expansion
- Only once C1–C3 are real and measured: compare authored slot fill vs bounded deterministic tile-WFC (same seeds/camera); reject WFC if no discernible quality/variation advantage. Then try OSM validated small city patch, then sphere/H13 wrapper, then extra Card/Story Mode rule variants.
- One expansion per measured outcome; no simultaneous city+OSM+WFC+full physics explosion rewrite.

## Test matrix — executable acceptance scenarios for independent Tester
| ID | Level / condition | Required observed output |
| --- | --- | --- |
| F-01 | parse each fixture | stable unique IDs; no dangling edges or sockets |
| F-02 | L01 initial | no legal path to goal; arriving packets wait at valid node |
| F-03 | L01 activate one switch | e_jn open, e_js closed; path spawn→junction→north→goal |
| F-04 | L01 double trigger same intentId | one state change, one event, no duplicate receipt |
| F-05 | L02 shoot unmatched prop | no cell damage, no Fluff grant, no changed route |
| F-06 | L02 accepted Hit on shell | one cell becomes exposed; e_jr opens; final destination still blocked |
| F-07 | L02 repair without source resource | rejected; e_rg remains closed |
| F-08 | L02 eligible source-owned repair | e_rg opens; path reaches goal once |
| F-09 | L03 Mech remote activation without contact | rejected by movement/contact owner |
| F-10 | L03 owner-verified rooftop activation | e_jr opens; roof-to-goal path valid |
| F-11 | after complete reset and exact same action timeline | logical node/packet outcomes identical, visually randomized FX allowed |
| F-12 | user changes only Tech/Sweet theme | authoritative graph/event/arrival counts identical |
| F-13 | decorative WFC contradictions | fallback to authored valid map; no lost mandatory switch or landmark |
| F-14 | no/small screen, missing optional asset | game remains playable or marks local source blocker, no global boot death |
| F-15 | L02 WorldSave fresh load | one repaired/damaged source-linked state, player origin and scene validity preserved |
| F-16 | ejection/portal return | one safe return transform and idempotent reward; no second game renderer |
| F-17 | sound + VFX hit and repair | only subscribed accepted facts, nonexplosive repair has no invented boom |
| F-18 | actual phone/desktop | real gesture/button playability, face readability, measured scene/GPU p50/p95 |

**Do not assert the numerical expected packet arrivals in fixture data are observed.** They are expected outcomes contingent on accepted input/time, with no live simulation executed yet. C0 writes a pure packet simulator and tests them before calling them PASS. The current R4 fixture source-only check is just graph reachability under simulated edge changes.

## Acceptance packaging per phase
- exact repo/branch/pinned head and changed paths;
- current host contract/API and owner evidence;
- source pin and isolated visual donor manifest, source original vs scene screenshot;
- tests summary with counts (unit/host/browser/mobile/GPU) and time/device;
- 30–120s contiguous capture at play camera, no menu-only screenshot;
- performance with visible target device p50/p95, drawcalls/triangles, asset decoding failures, sound bus proof;
- `RETURN.md`, `TEST_REPORT.md` and additive changelog where owner contract specifies;
- exactly one next productive task / gate and issues for deferred nice-to-haves.

## Existing source anchors
- R1/R2/R3 documentation in this folder and existing Draft PR #435.
- `tools/world_atlas/source/lib/dungeon-grid.js`, `kit-lab.js`, `source/scenes/kaykit-city.js`.
- `tools/KFB-ToolBox/_inbox/KFB WhackMan v1-1/WHACKMAN_SESSION_2026-09-22/wm-maze.js`.
- Source-measured KayKit Bits Bundle 1.1, Platformer purchased Dropbox FREE/EXTRA, Mech Minigun/Axe source, Tiny Treats and Restaurant in main.
- `skills/chat/masterplan/KFB_PROCEDURAL_TERRAIN_WFC_OSM_LANDMARK_NPC_COMPOSITION_R1_2026-10-24.md` PR #447 (keep WFC local).
- `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/BRIEF_WS1_FLIGHT_DESTRUCTION_R1.md` (existing V-514 owner and event family).
- `skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md` (chill/fun, pull/don't gate, return and provenance).

**One immediate next WS0 step remains:** `WS0_PLATFORMER_ASSET_INTAKE_AND_L01_SOURCE_GATE` to turn candidate sources and L01 into a real source+host-pinned authorization. This brief is ready for WS0 discussion; its content must not be treated as Work/WS1 auto-execution approval.


---

## ADDITIVE R5 · 2026-10-28 · C1 organic cartoon feel (no change to C0 logic or WS1 authority)

**Georg experience input:** soften Destruction/Goo, add emotional Fluff reroute reactions, decorative surreal scale and sparse satisfying soft SFX. Read:
- `CASCADE_SPHERE_R5_CHILL_CARTOON_FEEL_WS0_ADDENDUM_2026-10-28.md` — complete source-aware reasoning and C1/C2/C3/optional WFC scope;
- `CASCADE_SPHERE_R5_PRESENTATION_CUE_CANDIDATE_2026-10-28.json` — five **candidate presentation-only fact→cue profiles**, source cue IDs currently unresolved, not a new event bus.

**Exactly one C1 feel outcome to prove together with F-01…F-18:** in the **actual WS1-hosted, source-authentic Switchyard**, the accepted route-switch input changes the real graph and triggers (1) a tactile lever squash/hinge/elastic recovery, (2) brief visible hesitation/bounce of at least one correctly routed Fluff at the *next legal junction*, and (3) one short existing Audio-owner sourced "soft wooden klonk"/plop cue if an asset is available. Sound unavailable or muted is a local audio-source limitation, not permission to invent audio files or block the graph. The same source action must remain recognizable with sound OFF and reduced movement.

**Do not add `mood_modifier` as authoritative event state.** Stable `runId/eventId/tick/type/subjectId` events remain untouched; the existing animation/media layer looks up a `PresentationCue` by accepted fact, source role and active Tech/Sweet theme. No second clock, move writer, FX trigger or audio mixer; animation never grants loot or steers pathfinding.

**C2 later** after existing real Combat HitEvent: soft Goo withdrawal/one organ-shaped lobe and source-authoritative inflate/settle on repair (not polygon storm). **C3 later**: one marshmallow contact bounce on real rooftop landing or Fluff descent. **Optional WFC** after authored gameplay passes: giant coffee cup/flower switch/sleeping bridge permitted only in source-verified scenic or measured snap-compatible roles; preserve collision, reachability, original OSM, camera and phone-readable route.

**Additional independent feel acceptance cases (new R5 cases; prior F-01…F-18 remain unchanged):**

| ID | Action / condition | Required observable result |
| --- | --- | --- |
| F-19 | L01 one accepted lever flip | Exactly one source-attached hinge/squash/elastic motion, returns to baseline; graph switch changes independent of tween. |
| F-20 | L01 Fluff rerouted at fork | At least one Fluff pauses/tilts/bounces at a legal node, then takes the correct path with no teleport/extra route event. |
| F-21 | same intent twice or reset/unmount mid-tween | No duplicated SFX or rewards, stale effects cleaned; later scene enters clean. |
| F-22 | L01 muted and reduced-motion | Source-visible lever state, clear direction/arrival, no unrequested camera shake; same logical route and result. |
| F-23 | Tech vs Sweet visual profiles | Same authoritative graph events, arrival counts and switch collision; audio profile changes only through existing KFB Audio owner. |
| F-24 | real focused mobile/desktop effect OFF vs SOFT | Source-authentic model/eyes/button remain legible; report actual render p50/p95, cue count, draw calls and relevant degradation rather than claiming free shaders. |

**Visual staging order:** Source isolation of true KayKit lever pivot + instanced Fluff visual, then one real 3–6-second action/feedback capture, then continuous full-run F-01…F-18. Don't create new scene/renderer to audition. The production Guard sees causal test, tactile test and actual source screenshot together; no automatic scene PASS from this document.

**Single immediate next gate UNCHANGED:** `WS0_PLATFORMER_ASSET_INTAKE_AND_L01_SOURCE_GATE`. R5 is an additive quality criterion for the subsequently authorized WS1 C1 source-real run, not a new blocking approval process or asset generation scope.


---

## ADDITIVE R6 · 2026-10-28 · Complete KayKit Platformer source atlas → Work source preflight (before gameplay code)

**Georg asks to understand every tile/prop/source and prepare measured modular assembly.** This adds a concrete Asset Librarian/World Atlas source preflight, not another game engine or a new gameplay gate. Keep R1–R5, F-01…F-24 and current WS0 intake goal.

**Read first (same owner folder):**
1. `KAYKIT_PLATFORMER_R6_FULL_SOURCE_INVENTORY_2026-10-28.json`: full 370 FREE and 525 EXTRA actual observed GLTF/BIN pairs, exact folder/filename metadata and tier differences; no SHA-256 yet.
2. `KAYKIT_PLATFORMER_R6_SEMANTIC_ATLAS_2026-10-28.json`: 171 role keys, each color family, suggested functional category; zero accepted connector/surface proof.
3. `KAYKIT_PLATFORMER_R6_GLTF_GEOMETRY_SAMPLES_2026-10-28.json`: 12 real GLTF JSON hierarchical/position accessor probes, including button/lever children, split cannon/saw, conveyor threads texture, ramp and pipe. Bounds are mesh-local hints, not final colliders.
4. `KAYKIT_PLATFORMER_R6_FOUR_MEASURED_BOARD_FIXTURES_CANDIDATE_2026-10-28.json`: four unassembled source test boards (seam, switch, belt-pipe, hazard).
5. `KAYKIT_PLATFORMER_R6_MODULAR_ATLAS_BUILD_BRIEF_2026-10-28.md` and `KAYKIT_PLATFORMER_R6_SOURCE_ATLAS_TEST_REPORT_2026-10-28.md`: step-by-step source extraction/measurement, validated port grammar, snap/Gizmo/world/generator integration and evidence limits.

**Authoring contract:** use existing Asset Librarian source refs, `World Atlas/kit-lab.js` measured bounding/contact, `dungeon-grid.js` canonical seams, `resident_atlas_s6/lib/studio.js` authoring TransformControls and KFB Assembly A0 AssetRef/Surface/Connector vocabulary. No separate JSON runtime owner or source registry. Only source pinned/rendered/physically verified pieces become approved Snap/WFC/Combat instances.

**Important source distinction:** official FREE and EXTRA folders can share all FREE filenames/sizes but hashes remain to be computed; don't publish `EXTRA has same bytes` as an established fact. Entire source pack is present on Dropbox, *not yet uploaded*. Neutral and colored models can carry overlapping names and are two independent role families until source identity and geometry prove equivalence.

**Additional future independent QA cases (old F-01…F-24 remain intact):**
| ID | Preflight | Required evidence |
| --- | --- | --- |
| F-25 | complete package intake | Exact 895 observed GLTF/BIN pairs + actual SHA-256/dependencies checked, reproducible source branch commit, real renderer load errors enumerated; no raw private credential leak |
| F-26 | moving composite source | actual original button/lever child nodes, measured pivot and reset, one animated source mesh not entire stand-in; source vs assembled photo pair |
| F-27 | true tile seams | real supported floor↔ramp, railing, pipe and conveyor port/collider/clearance tests; negative incompatible adjacency identified, no guessed dimensions from basename |
| F-28 | conveyor and source texture | `threads.png` loaded and UV movement separate from actual authoritative Fluff motion, verified belt direction and overhang |
| F-29 | source variants | blue/red/green/yellow real model/material parity on one representative family, neutral source identity distinct, same functional ports only after measured compatibility |
| F-30 | WFC author fallback | after C1 is green, optional local WFC only in permitted variant sockets; contradiction uses identical proven authored layout, visual effect cannot block player or shift real OSM roads |

**Do not block existing WS0 L01 on all 171 manual port measurements:** first automatically parse/load all; visually inspect source-critical 5–8 real models; measure four family boards as owner time allows. L01 genuinely requires one source-safe floor/road, one lever/button, one source-visible Fluff and one destination. All families can become catalogued in incremental release slices after source intake. Keep one next gate `WS0_PLATFORMER_ASSET_INTAKE_AND_L01_SOURCE_GATE` and a later separately approved WS1 build.


---

## ADDITIVE R7 · 2026-10-28 · Source Material Zones and Selective Animated KFB Terrain Colorbands

**User requirement:** identify which exact original KayKit Platformer model surfaces/parts are independent material slots, independently movable mesh nodes or UV-atlas color zones; allow KFB terrain-colored moving bands and surreal material mix on select blue tops/belts/props, not blindly on every face. Read:
- KAYKIT_PLATFORMER_R7_MATERIAL_ZONES_AND_TERRAIN_COLORBAND_WS0_2026-10-28.md (full source-backed strategy and constraints);
- KAYKIT_PLATFORMER_R7_MATERIAL_ZONE_GLTF_SOURCE_PROBES_2026-10-28.json (12 ORIGINAL GLTF materials, mesh primitives, child nodes);
- KAYKIT_PLATFORMER_R7_MATERIAL_ZONE_TARGETS_CANDIDATE_2026-10-28.json (8 exact targeted candidates, four optional presentation profiles);
- KAYKIT_PLATFORMER_R7_OFFLINE_MATERIAL_ZONE_SCANNER.py (offline source-only scanner, not executed on the full pack; needs source GLTF/BIN/PNG intake and optionally Pillow for actual atlas pixel sampling).

**Direct original source conclusion:** sampled blue platform and slope, pipes, neutral wood floor, colored red/green/yellow platforms = ONE primitive, ONE platformer material with atlas, so blue surfaces are **NOT independent material slots**. Button/lever/sawblade have separate original child mesh nodes sharing one source atlas material, allowing per-mesh cloned materials after source load; finer face recoloring requires UV/mask. EXTRA conveyor_4x4x1_blue has separate primitive material index 1 **threads** using threads.png, independent of platformer frame material index 0: lowest-risk first animated belt surface. Source atlases, UV masks and true visual geometry still require actual binary/pixel source probing and render proof.

**Material-zone guard:** add any KFB shader as recipient-owned **presentation/material profile**, never a gameplay condition, custom collision, second animation ticker, global shared material mutation or new material engine. Keep Source OFF→same exact original material, all clones disposed on reset; sample performance p50/p95 on real target Mac/phone with effects OFF/ON. KFB CANON_3D palette/lighting and current WS1 terrain-material owner remain authoritative; active WS1b API to be pinned by Work.

**Future acceptance cases (previous F-01…F-30 remain intact):**
| ID | Situation | Required actual WS1/Asset Librarian proof |
| --- | --- | --- |
| F-31 | original model + mask disabled | exact source KayKit atlas/material identity and lighting, no unintended global replacement |
| F-32 | L01 blue platform top masked colorband | upper surface colored/animated from KFB terrain profile while original side trims and underside remain unchanged under 0/90/180/270° rotations |
| F-33 | EXTRA conveyor special source material | threads.png primitive animates or receives colorbands separately from frame, actual authoritative Fluff routing unaffected by texture scrolling |
| F-34 | source button/lever child animation + tint | moving/tinted child stays independent of original base and of other cached switch instances, reset restores original pose |
| F-35 | actual model UV/face/material audit | indexed BIN UV+POSITION/PNG samples produce verifiable per-face zone candidate masks; red/green/yellow/neutral handling provenance checked |
| F-36 | creative mix and device QA | source original vs KFB Clay/band/surreal material blend rendered from same camera; mobile readability/visual continuity measured, reduced-motion fallback and shader/program/clone/dispose evidence |

**No original 525-model material atlas has yet been decoded/rendered** in WS1. The offline scanner is a prepared utility, not a source-authoritative runtime feature or already green extraction. Source material samples are *better than filenames*, but not evidence that a blue upper face has a distinct addressable UV palette region without BIN/PNG tests.

**One next gate unchanged:** WS0_PLATFORMER_ASSET_INTAKE_AND_L01_SOURCE_GATE. Include a source-real conveyor material-slot proof and one platform top/side mask comparison in the existing asset/visual intake, without blocking the basic L01 gameplay on all 525 source masks. No new Site/Stage/Live.
