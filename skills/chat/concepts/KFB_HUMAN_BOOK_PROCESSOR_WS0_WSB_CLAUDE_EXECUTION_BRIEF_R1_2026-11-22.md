# KFB Human Nature Book Processor · WS0 → WSB + Claude module execution brief R1
**Date:** 2026-11-22  
**Status:** GEORG CREATIVE / PRODUCTION DECISION RECORDED · BRIEF ONLY · NOT SPAWNED · NOT BUILT · NOT VISUAL-TESTED  
**Owning review vehicle:** `georg-doc/kayfabizarro` · Draft PR #477 · `planning/kfb-human-nature-book-processor-scenelet-r0-2026-11-22`  
**Creative lead:** WS0 Lead (existing); WS0 spawns **one dedicated Claude child chat** to build the complete **BOOK PROCESSOR** module.  
**Book 3D production:** WSB / Blender MCP, existing WSB workstation/asset-production lane; WSB makes the source-faithful book and its rig/export, **not** a new in-game runtime owner.  
**Final game receiver:** existing WB2 / KFB WorldBuilder owns scene/world integration and placement, with WSA as existing technical integrator when activated. Do not spawn a parallel scene runtime or replace WorldBuilder.  
**Protected:** Island MVP R4 STOP/NO MVP; no R5 or world geometry/Stage authorization from this document. No new Card/PDF, Audio, Clay material or camera/input owners. Stage route = NONE while brief-only.

## 1. Creative direction confirmed by Georg (2026-11-22)

The `06-orrery` example provides **gear/kinematic mechanics, not visual styling**. Its polished shiny golden brass finish and luxury antique-planetarium presentation are explicitly **REJECTED as KFB target styling**.

The machine is **used, dirty, imperfect, off-kilter DIY salvage**, but materially legible and visually delightful. Strong KFB claymation/cartoon character, not polished CGI and not a generic steampunk showcase. Variegated materials **within one purposeful machine**:
- rusty, pitted **scrap steel / iron**, matte, faded paint, patina at plausible wear points (not uniform rust overlays);
- **matte hard rubber** sprockets/buffers/wheels, irregular molded edges, slight edge wear, dark soot/charcoal;
- **kneaded/claylike / toy-material** gear bodies or protected covers, with KFB hand scale marks, softened silhouettes, restrained asymmetry;
- optional reused cast/painted metal, old worn plastic, repaired brackets, uneven screw heads, bolts, wire wraps, patched belts and hand-painted identification marks if these perform a causal role.

**Overall:** handmade heterogeneous kitbash construction, playful silhouette, salvaged components visibly repaired, selective skewed perspective and quirky non-symmetrical machine assembly. Material contrast and rhythmic gear choreography should carry appeal. NO ubiquitous brass/gold, chrome, polished lacquer, glossy wet clay, wood HUD, generic UI plaques, noisy/grainy all-over rust, faux cardboard/ink/paper shader replacement or invented KFB branding.

The source BOOK remains exact original artwork, not repainted with KFB mud/rust, and must be clearly identifiable even against elaborate machine.

## 2. Functional stylization contract — how to be wonky and still mesh

**Core principle:** deliberately irregular *appearance*, precisely functional *kinematic skeleton*.

1. Keep each **driven gear's pitch circle, shaft pivot, axis orientation, tooth engagement and gear-pair center distance** mechanically coherent. Donor `06-orrery/train.ts` provides actual tooth counts/ratios/phase; `gears.ts` provides involute geometry. Adapt only after independently rendering its original donor.
2. Keep mating tooth profiles within a working clearance; do **not** independently nonuniform-scale/warp the driven teeth, randomly offset axle positions, or skew gear planes. A cartoon asymmetric tooth on the load-bearing involute flank will bind/clip unless revalidated.
3. Put asymmetry in **spokes, rims outside mesh, hubs, axles, housing, guards, crooked brackets, painted surfaces, shaft collars and attached non-contact sculpture**. Toy-clay softening can affect non-contact face geometry. Use decorative distorted false-tooth covers only where they do NOT visually promise impossible mesh.
4. If visible eccentric/wobble is desirable, put it into **off-axis decorative disks, slightly wandering guards, belts, counterweights, an idler not under load**, or animated soft-body trim; maintain true concentric engaging teeth and synced phases in functional gears.
5. A larger, more playful toy-like tooth profile is possible, but it needs a **matched pair**, verified phase, clearance and mesh-error proof, not merely scaling the existing tooth ring.
6. Gear turn directions and rotations must follow ratios, not individually chosen idle tweens. Reverse crank should reverse actual movement and page-feed sequence consistently.
7. Wobbly perspective can be expressed through camera/composition, apparent shaft leaning away from the engagement zone, stylized mounting and asymmetric noncritical parts; do not compromise page roller pinch, blade path or collision/contact.
8. The machine has readable operations: grip the actual book → open or unbind → feed a **real page** → scan/cut → classify → recompose/reset. Every decorative motion earns its purpose. Do not mix random spinning wheels with an unconnected book.
9. **Close-up stop-frame checks:** shaft centers, tooth clearances, reverse, loop seam, output contacts; no frozen interpenetrations, tooth popping, jitter or asynchronous gear drift.
10. Geometry/performance: shared instanced bolt meshes, restrained visible gear count, LOD and low animation state overhead; no blanket rigid-body simulation of all pages/gears and no new independent simulation engine by default.

## 3. Visual/material direction matrix (design targets, NOT accepted material presets)

| Functional role | Material family | Character, evidence to show |
| --- | --- | --- |
| Primary drive gears | worn painted steel / matte dark iron | visible phase, worn chamfer, uneven *paint*, clean meshing |
| Secondary/idler gears | charcoal hard rubber, soft-toy composite | thick rounded body, smooth functional teeth, scuffs only where touching |
| Large visual gear / flywheel | roughened clay-molded shell over mechanical drive core | finger traces and subtle squish in **non-mating** portions |
| Casing, clamps, guards | mismatched salvaged painted steel/plastic | bent silhouette, visible patched joints, no overly clean symmetry |
| Belts, feed rollers | rubber, textured canvas belt | tactile motion and believable compression at page contact |
| Scanner, blades, optics | selectively serviceable iron/steel, utilitarian lens | sharply delineated cutting edge/readable optics amid matte machinery |
| Fasteners/repairs | reused bolts, clamps, hand-assembled strap | construction logic, not decorative trinket clutter |
| Book | exact cover/page print files | preserved source color/typography, readable, honest spine/fore-edge |

Material implementation MUST route through existing `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md`, `skills/chat/KFB_STYLE_REFERENCE_ROUTER_2026-10-07.md` and current KFB Clay Style SSOT / Golden; do not fork clay shader or apply a universal dirty overlay to source book pages. WSB `media/3D_Assets/WSB_BLENDER/STATUS.md` warns about former glistening/oily clay candidates; matte goal is explicit, exact shader parameters remain Golden-controlled.

## 4. Ownership / spawn architecture

**WS0 Lead:** owns creative briefing, visual standards, donor selection, sequencing, acceptance package and spawning one dedicated Claude module chat. The child builds the BOOK PROCESSOR candidate **within a single module boundary**, not a new open-world engine. WS0 documents that child's actual session/branch only *when spawned*, not before.

**WSB / Blender MCP:** produce a real **BOOK asset** from author production PDFs and precise size specs. Deliver editable `.blend`, export `.glb` with named hinges/cover/paper pivots, material/texture manifest, reliable origin/pivots/scale, closed/open rig actions or motion anchors, separate actual cover/spine/fore-edge maps, one real readable original facing spread; source-isolated front, side, back, three-quarter/open screenshots. Book shouldn't be a textured box. Keep its copyright/source identity.

**Claude child (spawned by WS0 Lead, not by this chat):** obtain verified book asset from WSB plus isolated Orrery original donor, design/build module's machinery, animation loops, input/inspection/rescue, scenelet state machine and adapter emitting existing-world/Card/Almanac events. It may own *internal* module presentation code, but **not** world traversal/placement, player camera/input, PDF registry/render, audio mixing, physics owner or deployment. One coordinated writer per changed runtime surface; integration of shared files only through owning integrator when authorized.

**WSA / WB2 later:** responsible for integrating an accepted module as one anchored scenelet, preserving world topology, player controls, collision truth, persistence, performance and existing Card/Almanac routing. This concept does not authorize R5/World runtime changes.

**Independent QA/Critic / Production Guard:** compare original donor in isolation vs adapted output, check mechanical contact/kinematics and source-book fidelity, preserve no-Stage/NO-ACCEPTANCE vocabulary. Human Georg visual preference/feel gate after real sample only.

## 5. Production order & critical gates

**Gate A: source isolation** — current original `06-orrery` demo shown alone with working crank, gear mesh, reverse/disassembly; screenshots and source version. Meanwhile WSB proves the **original** print-book asset with actual cover/spine/back + one double-spread in isolation; missing print source = `SOURCE_REQUIRED`, no false placeholder.

**Gate B: material A/B/C proof on one ORIGINAL meshed gear pair** — same tooth geometry, same light/camera, three distinct salvage directions (e.g. worn iron / rubber + salvaged iron / clay-bodied toy metal). Show movement, close-up and screenshot; DON'T cover entire machine with first texture guess. WS0 chooses material language from comparison, not a generic keyword.

**Gate C: reversible KFB module** — integrated machine loop `CLOSED BOOK → OPEN → PAGE FEED → SCAN/CUT → REASSEMBLE → RESET`, no book destroyed permanently. One readable page + one visible true gear pair + one actor/player intervention. Standalone product/browser evidence before any WorldBuilder integration.

**Gate D: only later receiving world seam** — WS0/WSA attach one bounded source-backed scenelet into existing WB2 after separate authority and a satisfying world-model reason for its place. No speculative KFB Town location or second runtime.

**Expected evidence for real module:** before/after original donor and actual KFB adaptation, 4 angles for book, near/far gear screenshots or short clips, mesh phase error and clearance numbers from math/source, hand-crank reverse proof, 1 full autonomous loop + interaction + quit/re-enter, CPU/GPU cost and browser FPS on target hardware (only measured values), all sources + licenses + Blender outputs + test/Return.

## 6. Launch note for WS0 Lead (dispatch, not performed by this chat)

> Spin up ONE dedicated Claude chat for BOOK PROCESSOR Scenelet, linked to `georg-doc/kayfabizarro` Draft PR #477 and this brief; coordinate real book model with existing WSB Blender MCP. Follow GitHub START_HERE, CHAT_GITHUB_KFB_STAGE_WORKFLOW, FRESH_CHAT_SLICE_PROTOCOL, current World/Clay/Card SSOT and R4 STOP. First show actual Orrery gears and WSB original book in isolation, then run a gear-pair material visual A/B/C (rusty DIY, mixed hard rubber/clay/tin, matte and visibly repaired). Preserve mathematically true gear engagement. Build complete independent module within existing ownership, not a new world/physics/Deck runtime. Return exact source branch/head, assets, tests, screenshots, later direct Stage route only if separately authorized, unresolved and one next gate. No auto-merge or Live.

**This R1 document records the user's execution/visual decision only; it does not claim the Claude chat was spawned, WSB was started, or a render occurred.**
