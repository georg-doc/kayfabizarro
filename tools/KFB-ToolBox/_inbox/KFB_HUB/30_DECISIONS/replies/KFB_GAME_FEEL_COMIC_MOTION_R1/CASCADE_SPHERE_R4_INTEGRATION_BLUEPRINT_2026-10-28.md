# KFB Cascade Sphere / Prototype Factory Maze — Integration Blueprint R4
**28 October 2026 · SOURCE-GROUNDED PREPRODUCTION / DESIGN CONTRACT CANDIDATE, NOT CANON, NO EXECUTABLE PRODUCT.**

## 0 · Scope and authority
- User asks to prepare gameplay rules, module boundaries, WFC alternatives, three actual level fixtures, Combat/Destruction, KayKit/Fluff/Goo/Mindscape and a minimized Work integration. This is an additive continuation of R1 Mech/OSM, R2 KayKit 3-level Prototype Factory Maze and R3 Sweet Supply + purchased Platformer source intake. Preserve prior docs; no silent overrides or newly adopted decisions.
- **Design/Data:** existing KFB_HUB WS0 Game Design/Fractal Canvas lane. **Only productive world/game writer:** active WS1/WS1b R3F host, its actual active source/head must be re-pinned by Work. Combat Arena owns hits/enemies/health/weapons; World/Surface/Track own contacts and placement; PlayerSave/WorldSave/Almanac own persistence; existing Audio Site owns buses/cues and host clock; Asset Librarian owns exact source models; HyperNormalisation/Mindspace owns media and sphere storytelling; World/Portal owns enter/safe return.
- **Do not reopen** stopped WB2 four-island R4 or create new host/runner/input/camera/renderer/audio/asset library. No new PR/site/Cloudflare product; existing Draft PR #435 remains the concept home. Technical source contract files below are **candidate fixtures**, not automatically executable schemas/SSOT.
- One WS0 next decision gate remains **WS0_PLATFORMER_ASSET_INTAKE_AND_L01_SOURCE_GATE**. This packet gives that gate most of the required decisions/tests to compare, not a second review queue.

## 1 · ONE architecture, FIVE concerns
`SceneRecipe → validated RouteGraph + authored level + asset/socket manifest → EncounterState → canonical intents/events → visual/audio/WorldSave adapters`.
A. **Asset/Geometry**: original KayKit GLTF/texture/binary & measured source pivots, footprints, sockets; visual presentation (technological Factory or Sweet Supply) does not change route graph.
B. **RouteGraph**: immutable topology plus mutable edge status, stable node/edge IDs, target route and cached reverse distances. WhackMan BFS and Dungeon seam solver are donors only.
C. **EncounterState**: packets, affected node/cell state, switch orientation, wave schedule, objective, action dedupe; a deterministic pure-state reducer *only* for this encounter, not a global second World store.
D. **Actions**: only authorized world-action intents dispatched by one existing host: SWITCH, SHOOT, COLLECT, REPAIR/PLACE; spectators/build mode may preview. The authoritative World/Combat callback returns accepted/rejected facts; VFX never author state.
E. **Presentation/receipts**: existing Mech, Camera, Card/Ink, Audio, shader/Goo, Save/Almanac modules receive facts and render them; one returned result receipt, no second game clock or inventory.

### Candidate interfaces (shapes, not code to graft blindly)
- `mountEncounter({host, recipe, sourceAssets, savePort, combatPort, audioPort, worldPort})` is a **proposed WS1 adapter signature**, not verified existing runtime API. Work must map to actual host lifecycle.
- `dispatchIntent({intentId, actorId, kind, targetRef, tick, requestedVariant})` → validation against fixed phase, actor reach, valid socket, owner state, idempotency; only if valid emits `ActionAccepted`.
- Combat owns `ShotEvent→HitEvent` (existing V-514); encounter listens to a **validated** `HitEvent` on an opted-in `infectedShellCellId`; it does not raycast a second time or damage an intact original KayKit building.
- Placement requires host-validated collider/support/clearance; `RepairAccepted` authoritatively changes one graph connector and an existing World-owned persistent instance/damage override.
- `PacketArrived` / `PacketLost` facts derive from route simulation, never particle or collision render callbacks. One save receipt and one Quest event ID per factual milestone.
- Event envelope candidate: `{schema:"kfb.cascade.event/0.1-candidate", runId, seq, tick, eventId, type, actorId?, subjectId, causeEventId?, payload, sourceRef?}`. Event identity is stable under same seed/inputs, no `Date.now()` as game logic.
- `resetRun()` means restore authored baseline + same seed on explicit retry; `returnWorld()` restores player/scene ownership and emits one outcome receipt through current World/Save, never saves every cosmetic particle.

## 2 · Phase machine and minimal decisions
States: `READY → RUNNING ↔ INTERVENTION → RESOLVING → RESULT → EXITED`; `PAUSED` is a host presentation/interaction state, not a new simulation time authority. Only one active runId; old async assets/events from prior run may not mutate current state. No retroactive packet double-counts.
- RUNNING uses single host tick or a documented fixed-step divisor; packets advance on graph edge progress with safe waiting/no-route semantics.
- INTERVENTION temporarily holds affected packet at node until accepted switch/repair; rendering may continue. An actual Mech landing/action only accepted if movement owner validates approach/contact; mobile can use **accessible Build mode** to remotely drag a module before Run, but gameplay contact challenges must be accessible through host-supported movement aids rather than fake remote hit registration.
- RESOLVING records authoritative arrival/loss/contamination, then result. There is no forced countdown to fail while the player is reading a Card in Chill.
- Puzzle source must have two meaningful alternatives; if all routes truly blocked then show waiting/repair and never invent a successful flow.
- All missions can be reset from session baseline; optional per-world memory retains a run outcome, not deleted source artifacts.

## 3 · Routing, waves and topology
- **Route truth:** nodes = connected POI/roads/pads/roof stations; edges = canonical sorted endpoint ID + directed semantics, status open/closed/one-way/contaminated; socket refs = stable owner-known physical transforms. Use source exact measured width, clearance and slope; avoid importing Dungeon's 4 m dimension by habit.
- Route recomputation on edge/switch/repair change only; use WhackMan BFS/distance donors for first few unweighted hops. If conveyor weight/steepness/speed later varies, use deterministic Dijkstra/A* only when route cost is actually needed; never pretend BFS is shortest weighted path.
- **Packets:** render candidates are lightweight eye-bearing spheres or source-backed pop-ups; logical IDs and progress authoritative. Packet render instancing does not imply per-instance skinned bunnies supported. First candidate 8–24 logical packets, with source-ready small wave tested on real phone.
- **Waves:** deterministic `spawnTick`, pace, source, target; no new requestAnimationFrame, worker timer or sound clock. Overflow queues at actual nodes; max waiting/retry bounded to avoid simulation stalls. One route recalculation on switch; no continuous per-packet graph search.
- **Adversaries:** first Goo state infects one socket/edge; later 1–2 source-backed physical threats. A hostile creature and cosmetic Goo particle do not both score the same `PacketLost`.
- A level may be a cozy routing puzzle or Combat variant with exactly same graph state; in Chill mode enemies optional; don't make friendly Fluff destruction the win condition.

## 4 · WFC: narrowly scoped option, hard graph constraints first
Recommended order:
1. **Authored topology** (for L01–L03): spawn, destination, two routes and one authored meaningful switch fixed and validated.
2. **Template/adjacency selection**: choose exact source-known prefabs (City road, Prototype floor, Platformer ramp, façade/window) by N/E/S/W and optional UP/DOWN connector contracts. If a few hand-made templates suffice, **skip WFC**.
3. **Optional small tile-WFC** only inside noncritical, free connector slots, not on fixed POIs/critical route edges. Each tile must specify exact source asset role, connector faces, rotations, measured bounds, approach clearance, layer/elevation, theme tags, rarity weight, real asset pin. WFC selects compatible presentation modules; never recomputes validated route topology from random texture adjacency.
4. Weighted entropy choice with seeded deterministic RNG, hard-constraint propagation, bounded backtracking and deterministic fallback to original authored module (or reject seed). No infinite retry. After WFC, run global checks: spawn→destination reachability, switch consequence, all mandatory contact buttons accessible, no overlaps, roof/road support, no floating stairs/doors, real collider-to-graph agreement. **Local WFC cannot prove global solvability**.
5. OSM city is a later *immutable source graph* of streets/junctions; preserve street geometry and source/height/provenance. WFC may dress eligible plots/sci-fi annexes, NOT move the Cologne Cathedral or reroute real roads. Seeded local region can be embedded in KFB Open World with two separately recorded coordinates (original OSM local origin and scene/world transform).
6. Log contradiction reasons and tile ID; if no valid WFC solve, use authored fallback and preserve player flow. WFC is an experiment to justify by A/B comparison against direct constrained templates, not a mandatory dependency.

### Optional constraint grammar example (not actual measured asset):
`tile: "city-road-t"`, `ports: {N:"road",E:"road",S:null,W:"road",UP:null,DOWN:"support"}`; `tile: "factory-pad"`, `ports: {N:"walk",E:"walk",S:"walk",W:"walk",DOWN:"support"}`. Real orientation and dimensions must come from isolated actual model. `road` and `walk` aren't automatically compatible; require deliberate adapter/transition tile and collider check. Theme-specific food/technical props share geometry classes only when same measured support contract.

## 5 · Combat, destruction, goo and build: event cascade, not second engine
**One factual chain**: Player intent → existing Combat hit -> target shell cell state change → graph edge update → packet reroute/wait → Fluff yield/collection through current Fluff/Suck owner → source-valid repair socket → route reopened -> authentic arrival -> Save/Quest. FX/audio subscribe to the accepted facts, never serve as causality.
- Prefer P0 one detachable, opted-in **adaptation shell/conduit** attached to an untouched original KayKit building GLTF; don't attempt generic fracture of all KayKit meshes. The Seed World POC `sw-destruct` zellbasierte Recompilation, persistence and collapse is a pattern donor, not an integrated WS1 proof.
- Building state candidate: `INTACT → CORRUPTED → EXPOSED/DAMAGED → REPAIRED`; damage and infection **independent fields**. Repair requires accepted ResourceRef/Fluff count from existing owner; no duplicate item grant. Each transition owns affected graph edge only where truly linked.
- Ink censoring a Card's display is distinct from Goo contamination of a world node. Cure color q103 still OPEN; P0 can use one neutral recover action and defer color matching to WS0.
- Minigun present in source and Seed World POC; energy Axe model located but mount/contact/clip unverified; Grappling has no source-proven host movement behavior and remains deferred. Jetpack/flight only via active WS1 movement owner, not sw-mech's standalone controller.
- SFX/VFX order: charge/aim → contact -> small clay puff/fracture -> bounce/Fluff -> repaired settle; one existing Audio bus/mixer; effect budgets from V-514 as **historical candidate** (3 nearby smoke meshes, 11 atlas sprites, p95 target 2ms), remeasure in actual game, use reduced complexity on mobile.
- Goo/art warping may change surface appearance but must not alter collision invisibly; source city/landmark silhouette remains recognizable.

## 6 · Narrative, Card/Quest, Sweet Supply and Qiva
- Actor + 3 Scene Cards + Quest Card form **authored scenario recipe**, not a five-card compulsory onboarding UI. Card identity `deckId+cardNumber` unchanged; only WS0 Card registry supplies authentic PDF art and eligibility. New technical labels remain design examples, not fake canonical cards.
- Six existing KFB Story Modes Tragic, Comic, Absurd, Heroic, Mystical, Forbidden; no invented RGB assignment. Fluff colors source-table/decision q103 must be pinned before a color-based mandatory puzzle. Quest Die +2/+1/0/-1 candidate story-feedback tied to one accepted world event ID, not duplicate VFX callback or a claim of analog rule equivalence.
- Two **skins with the same logical fixture**: Tech Factory uses packets, bad queue and control relay; Sweet Supply uses ingredients, bakery display, charming Kitchen/Restaurant source objects and warm candy rewards. No second recipe simulator, Chef AI, shop economy or inventory until the core is demonstrably fun.
- **Qiva later**: export synthetic/true event provenance with no company secrets for separate replay. KFB game outcomes cannot be claimed as Qiva predictive success.
- Open World/Mindscape later: scene instance spawned by existing World/Portal, safeReturn and result receipt. Visual Sphere shell uses existing H13/audio/portal owner; bounded game can stand alone first.

## 7 · Work integration phases: frozen outcomes and independent evidence
**A · WS0 source intake / artist isolation** (not Work runtime): complete official Platformer FREE/EXTRA Dropbox-to-GitHub, license + hash + version inventory; choose 5–8 actual source donor objects (City Builder junction, Prototype target/door, Platformer switch/belt/ramp, Mech weapon, Bakery display), measure and isolated visual proof, source pins. Distinct from private sealed V-538 LFS manifest.
**B · Fixture/solver preflight**: consume machine-readable scenario fixtures and candidate schema; pure Node or Vitest tests for route graph, switch, packet occupancy and idempotency. These are lightweight *module tests*, not a new game host.
**C · WS1 L01 (only authorized game code)**: mount one real scene in existing R3F host, one user-intent switch + one wave + observable rerouting, fixed seed/reset. Source visuals, 2 mobile and 2 desktop framed views, 60–120s full playable capture, no second controller. Same logical fixture A/B technical and Sweet skin.
**D · L02**: real combat HitEvent adapter, detachable corrupted shell, one repair socket and one reload receipt. A true route change measured after shot/repair.
**E · L03**: existing flight/landing and two elevations, source button, one defense wave; Grapple optional and isolated later; don't block product if it isn't in current owner.
**F · optional after levels green**: WFC visual variants, OSM city cropping, Mindscape shell and performance variants. Each must compare on same level/seed and justify complexity.
**Evidence roles for Work:** Builder/Integrator sole code writer; separate Integration Tester facts; independent Critic of live 3D/gameplay; Production Guard continue/repair/quarantine/stop; Georg owns aesthetic/play PASS/TUNE/FAIL after actual integrated scene. New features cannot be accepted only from static source checks.

### Must-pass product checks
1. Source-true asset actual GLTF and original material, scene-size bboxes and active colliders; no substitution.
2. One authored L01 route with clear cause and visible switch; exact same seed/intent timeline has same **logical** result under reload (FX variation allowed).
3. One packet counted exactly once; switch and save idempotent; no duplicate Quest Die pushes.
4. One player movement owner, one AudioContext, one hit authority, one WorldSave owner; asset loading failure degrades that local module only.
5. Actual physical door/button/repair socket reach, not just graph connectivity; one runtime screenshot/clip and independent screenshot critic.
6. Host performance measured at focused real desktop and mobile device, frame p50/p95, GPU/CPU/render objects, drawcalls, load size. Thresholds must be selected by WS0/target devices, not presented as achieved.
7. World return/enter preserves world and player origin without trapped actor or erased source layout.

## 8 · Stop/defer list and exact one next gate
Do not integrate first: 2.3km Cologne, global WFC, fully mutable city skyline, general destruction of every source GLTF, arbitrary 3D build gizmo in action play, 500 animated skinned bunnies, 6-color tactical economy, real Qiva link, grapple, full free-roam sphere, separate mobile game engine, second asset registry or new audio site.

**ONE NEXT GATE: WS0_PLATFORMER_ASSET_INTAKE_AND_L01_SOURCE_GATE.** WS0 receives this blueprint + machine-readable fixture/test suite, verifies actual FREE/EXTRA source/rights and current WS1b active receiving head, source-isolates selected original donors, and chooses **one L01 two-path one-switch one-wave source-known fixture** (Tech Factory primary, Sweet Supply visual variation). Then existing authorized Work/WS1 integration proceeds L01 → L02 → L03, with independent tests/critic and no premature live or merge.
