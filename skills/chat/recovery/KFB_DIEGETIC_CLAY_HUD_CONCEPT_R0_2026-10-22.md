# KFB · Diegetic Claymation Prop HUD R0 · 2026-10-22

**Status:** GEORG DESIGN DISCUSSION / PROPOSAL ONLY — no build authorization, no changed runtime, no human visual PASS, no Stage/Live. Intended as an **after-current-MVP HUD skin/interaction experiment**, not an expansion of blocked Island MVP R4.

**One receiving owner:** Existing KFB HUD/Flight line (R3 `hud-flight/kfb-hud.js`, `kfb-backpack.js`); reconcile with **K7 Knet-HUD** `lab-clay/clay-hud.v1.js` before modifying any HUD implementation. Current game/world, character, inventory, audio, card and input owners remain authoritative. WB2 R4 / PR #348 stays STOPPED, NO MVP; do not perform world/runtime fan-out.

## 1. Product intent

Replace the visually mismatched wooden-board HUD aesthetic with a **diegetic / object-based Claymation interface**: the player sees small recognizable objects from the same KFB world instead of generic rectangles or buttons. Must feel deliberately crafted and remain readable, unobtrusive and mechanically reliable in walking, driving, flight and combat.

The HUD objects behave like small tactile props with short, controlled motion reacting to game state; **not** a permanently tumbling interface and **not** an interactive 3D scene or a second game renderer.

## 2. Proposed constituent parts

| Component | R0 appearance & interaction | Source/ownership guard |
| --- | --- | --- |
| Six Fluff colours | Six small sphere objects, each matched to the authoritative world Fluff visual and actual canonical palette, each with readable numeric amount; absent colour = restrained semi-transparent/desaturated sphere, count 0; intake bounce only on collection, never arbitrary colour changes | Read real Fluff six-mode state and V-292 palette, do not reimplement player inventory/health/currency semantics. No assumptions about whether the 6 channels are HP, collectible ledger, currency, story modes. Distinct labels/shape/focus affordance for non-colour recognition. |
| Compass / speed / minimap | Closed: tactile KayKit/KKIT compass if verified, small legible speed readout on one face in Drive/Flight; walking shows bearing, no extraneous speed. Open: compass lid becomes map frame showing **real current player and world position**, not a baked illustration; orientation and fold animation remain physically plausible | Search exact compass source and inspect isolated mesh/texture/scale/rights before adoption. Real map/telemetry from existing world/locomotion owners, not independent navigation. If no suitable model, source-required; no invented replacement donor. |
| Fractal Almanac | Current authoritative KFB card art/text/ratios, presented as gently rounded thin clay-backed **3D cards**, with visible thickness and a stack; card fronts must not be stretched, redrawn, recoloured or replaced by generic tiles. Click/drag top card to open established viewer/reading interaction; stack never obscures card text | Original card/Deck/PDF viewer, single card-state owner, preserve readable proportions and source-backed art. Prefer flat textured planes or cached views; no high-poly geometry per card. |
| Action controls | Existing selected Primary / Secondary / pickup / active ability shown as source-backed 3D mini-props: e.g. blaster, boot for sprint, consumable; clear selection/state/cooldown and keyboard/gamepad/touch equivalence; unavailable greys/ghosts without being confused with enabled props | Item/equipment/action owners still decide slot assignment and use; no invented abilities or fantasy weapon models. Source objects must be shown isolated. |
| Bag / inventory | Existing KayKit Hoarder_Backpack mini (already in HUD Flight R3) **or** verified source-backed sack-like model if Georg prefers a loose coin-sack silhouette; clear item count on or anchored to prop; click opens the existing **20 slots** (5 × 4), optionally Clay-framed but not a replacement inventory | Reuse `kfb-backpack.js` bag overlay and real item list / save, not a second inventory. Current Hoarder_Backpack is a backpack, **not verified as the sack Georg describes**. Assess model rights before public build. |
| Radio / altitude / flight | Retain current R3 interaction model and Audio owner; surface only when mode-relevant. Condensed into the object language as appropriate; no additional console/dashboard chrome | Do not spawn a new audio mixer or change the existing event contract. |

## 3. Layout and motion grammar (candidate, not locked)

Top peripheral line: six Fluff spheres as a light-weight group; upper side: Almanac closed stack. Lower peripheral corners: hinged compass/speed/map and sack inventory; action mini-props near relevant thumb / click reach. Centre/play field/character remain unobstructed; mobile collapses secondary controls by mode rather than scaling everything to illegibility.

**Diegetic response to physics:** derive a **filtered visual-only signal** from existing velocity, turn-rate, acceleration and impact events, never directly feed HUD motion back into gameplay. Low amplitude, camera-independent object tilt/lag/spring: e.g. ±2–4 degrees and a few screen pixels (proposed bounds for test, not preapproved). Stronger reaction for braking/impact; no constant wobble, no nausea-inducing oscillation. Return promptly to rest. Distinguish interaction hover/press from vehicle shake: hit targets and text must stay fixed/stable; moving visible art does not move input hit areas. Reduced-motion option = static props. Never animate every numeric counter each frame; update on state events.

**Interactions:** object visual is only presentation; semantic DOM/hit layer supports keyboard focus, pointer/touch, gamepad, screen-reader labels, consistent click area. Need zero-state, loading-state and low-end fallback. No forced opacity reduction that makes numeric labels unreadable.

## 4. Performance architecture & hypotheses

**Preferred MVP A/B:** hybrid HUD. Keep six sphere graphics and numeric DOM/Canvas labels cheap; genuine 3D models limited to compass opening, bag, and occasionally active weapon/ability. Static props can be pre-rendered **from verified source models** into atlased/cached views with DOM/CSS transforms; use genuine animated 3D for opened or high-value objects only. Card front artwork stays flat texture with lightweight thickness/stack geometry. Reuse current render/context wherever technically possible.

**Known donor caveat:** R3 `kfb-backpack.js` already creates a **separate THREE.WebGLRenderer for the prop view**, renders a miniature and copies `r.domElement` onto 2D target canvases; `mountBackpackMini.tick(dt)` redraws continuously. One shared donor prop-renderer is preferable to a renderer **per object**, but even a single second WebGL context and repeated copying can cost GPU memory, CPU work, compositing and mobile robustness. Inventory opened with 20 independent animated GLTF previews would be a likely frame-time problem. Profile before deciding to keep/replace that donor strategy.

**Alternative:** one additional HUD scene/camera pass using the game's existing WebGLRenderer (not a second runtime owner), composited in defined viewport regions, only if it passes isolation and integration tests; watch WebGL state cleanup, depth/occlusion, transparent overdraw, resize, input and scene lighting. Otherwise use cached static thumbnails and only animate transforms.

**Target budgets, not measurements or promises:** aim for <1 ms additional HUD frame cost on representative focused desktop GPU, review mobile against a <2 ms incremental target where feasible, 60 fps frame budget 16.7 ms; avoid a significant memory rise and texture churn. Record before/after FPS **and** p95 CPU frame time, GPU timing if supported, draw calls, texture allocations, number of contexts, long tasks, battery/thermal effects on a real phone. Compare 0 props, cached thumbnails, continuous 3D and hybrid. Disable idle renders/event-driven redraws where practical. Per-profile fallbacks and low-motion mode required. No runtime metrics currently available, classify performance **UNKNOWN**.

## 5. Mandatory sources and visual gates

1. Read existing HUD R3 `docs/LIVING_HUD_FLIGHT.md`, `docs/SPRINT_R4_PLAN.md` plus K7 actual source; run **side-by-side HUD owner arbitration** first. No two HUD implementations.
2. Read shared Clay SSOT `tools/KFB-ToolBox/docs/KFB_CLAYMATION_STYLE_SSOT.md` and Golden Matrix from branch `work/clay-style-ssot-2026-10-01` (and check current authority on intake). Verify source objects **in isolation** before integrated screenshots. Asset URL loading alone is not object-identity proof.
3. Inspect actual KayKit compass candidate, bags/sacks, weapon and boot props (paths, licensing and origin, model geometry/textures). Existing Hoarder_Backpack is verified in repo; exact compass / sack are **not yet verified**. Paid KayKit Mystery assets may not be copied to public repos/CDN by default; check rights and private/public delivery.
4. Read six Fluff types/palette and authoritative state, canonical Almanac cards/Viewer/PDF, bag state/input/action slots, locomotion telemetry; a missing source remains SOURCE_REQUIRED, not a new placeholder.
5. Isolated Golden montage per object (unmodified donor → Clay interpretation → compact HUD render), then one single integrated HUD screenshot per mode (Walk / Drive / Flight), desktop + mobile; confirm card ratio and legibility.
6. Instrument continuous Drive + turns + braking + Fluff pickups + 20-slot open/closed while profiling performance and input reliability; check reduced motion and fallback; independent design critic / integrator acceptance.
7. Georg chooses **KEEP / TUNE / FAIL** on the smallest proof before any wider integration.

## 6. Bounded next gate

**WS0 HUD owner and donor intake R0.** Decide whether this is a post-MVP visual skin candidate in the current HUD Flight/K7 owner, and identify the exact producer/consumer code, verified compass/sack props, six-Fluff state API and target reference device. If approved later, WSA/Claude Code can build exactly **one isolated Fluff+Bag+Compass comparison** in the existing HUD Lab, not touch WB2 R4 or promote Live.

**Evidence as of proposal:** inspected current main at `7e1c4ab0f143b2f1c0f33017eb473574f20190c9`, R3 HUD source and donor handover, K7 references, Clay SSOT branch source, current WB2 PR #348 STOP status, WS1 branch head `effefbd98b4611ba9b7b746d8d5fa272e9a3b468`. Source read **only**: 0 original visual isolation, 0 new runtime render/test, 0 performance benchmarks, 0 published Site/Stage.
