# KFB · Game Feel × Playable Comic × Motion Comics · Ideation R1

**19.10.2026 · DESIGN / RESEARCH / PROPOSAL — not Canon, not an implementation authorization.**
**One owning lane:** existing KFB_HUB Register / KFB Game Design–Fractal Canvas concept work. Runtime consumers retain their current owners (WB2/Open World, Joyride/Track, Motion/Resident, Surface/Material, Camera, Audio, Cards/Almanac, 2D Animation Studio). No new system owner.
**Repository:** `georg-doc/kayfabizarro` · **branch:** `planning/kfb-game-feel-comic-motion-ideation-r1-2026-10-19`.
**Branch source:** current Register `docs/kfb-decisions-register-2026-10-11@a30d174a4207886e4bbfe796ad75702200ab871d`.
**Inputs:** Georg's ten WS1 concepts, Georg's request for realistic extra game ideas, and the pre-existing Warp Studio/Remotion/2D discussion. No code or 3D source asset changed.

## 0 · Design thesis: make a playable comic, not a shopping list of effects

**Chill & fun cosmic roadtrip + a living claymation toy world** remains primary. Visual staging should reward *doing something with the world*: an object is seen, a Resident offers a reason to approach, the player responds, the world visibly answers, and something is different when the player returns. A meaningful panel boundary, stop-frame, photo or sound is a *read of that exchange*, not a substitute for it.

Hierarchy of value:
1. **Invitation / readable situation:** a visible Resident, Fluff/object, sound or trace induces curiosity without a waypoint wall.
2. **Action / response:** one existing interaction (approach, give, throw, question, ride, help, observe).
3. **Consequences / new relation:** a Resident/prop reacts and changes an immediate choice; optionally one existing owner preserves state for return.
4. **Editorial presentation:** purposeful pose hold / hit-stop / ink / framing / sound highlights a decisive moment.
5. **Replay / authorship:** only after the loop works, an optional photo, card memory or captured vignette.

KFB's prior world-model failure (R4 = **STOPPED / NO MVP / F-R39 FAIL**) remains a hard boundary: shader tricks cannot upgrade a world of disconnected props into an inhabited place. The Four-Island Story Vision A/B/FAIL gate and the canonical four worlds remain unchanged.

## 1 · WS1's ten proposals: reuse, not ten new feature workstreams

| # | Proposal | Design ranking | Provenance / necessary correction | Smallest meaningful future gate |
|---|---|---|---|---|
| 1 | **Held-pose stop-motion / “on twos”** | **A · signature style, optional** | Quantize **sampled visual body pose**, not authoritative world position, collisions, movement input, camera or audio time. Prefer per-role/per-camera tuning (NPC gestures ≈12 fps candidate, active controlled actor 24/30/continuous A/B); 12 is a candidate, not a universal constant. Avoid updating a whole mixer only every 1/12 s if that delays action markers, events or root-motion/contact. | Same real Resident and scene, continuous vs held 12/24 pose, camera/control at normal rate; contact and legibility test. |
| 2 | **Hit-stop / impact hold** | **A · reuse existing** | Code already contains `overworld/overworld/game-feel.js` and `KFB Boxel Blitz/boxelblitz-v4/dice.v4.js` hit-stop donors. Not a “missing feature.” Use local presentation pause/impulse before ever freezing a shared simulation clock. Never queue duplicate contacts or mute player input by accident. 40–80 ms is test range, not accepted timing. | Compare sourced donor in isolation, then a Brick-Fish/contact or chosen combat beat at 0 / short / medium hold. |
| 3 | **World wind + optional guiding cue** | **A · strong world coherence if sourced** | Existing `travel/travel-v16/terrain-v16/card-carrier.js` has a scoped calm/wind parameter; flora/wind precedents exist. Source status is **donor only**; no verified unified Open World wind owner. Distinguish ambient directional wind from a **requested** temporary orientation cue; avoid automatically rotating all weather/grasses/physics toward tracked destination. Player may ignore cue. | One authored place with two real reactive objects and a visible objective; ambient wind vs summoned guiding accent compared. |
| 4 | **Camera-to-actor obstacle dither** | **A · legibility** | Dither is not free or global: actor-camera occlusion trace, object-specific mask, KFB clay/ink/material and shadow implications, temporal noise and alpha-test edges must be checked. Do not dither story-relevant Resident faces or turn a solid wall into fake walkability. | Real orchard/column source and accepted material shown in isolation; blocked vs masked camera view, readability and frame timing. |
| 5 | **Tilt-shift / focus falloff** | **C · camera-only presentation** | May work for a carefully staged overview/photo. Blur must not hide eyes, active action, cards, speech bubbles, terrain contact or road hazards. No global driving DOF. Cost/platform comparison required; subtle fixed-depth-vignette/camera framing may outperform costly bokeh. | Static overview A/B on target GPU; readability and cost. |
| 6 | **Photo mode** | **B · shareable plus QA** | High utility for screenshots, art direction and later comic/video repurposing. A canvas PNG export already exists in a Racer image path per WS1; **not independently verified here** as reusable. Browser CORS/tainted canvas, renderer size/pixel ratio and UI omission can block export. Reuse camera and frame capture owner. | Same source scene screenshots with repeatable camera/time/seed; show clear PNG output. |
| 7 | **Personal best ghost** | **C · optional Joyride play** | Optional, noncompetitive and no rankings required. Prefer transform/time playback for a visual ghost, NOT deterministic input replay masquerading as a guaranteed identical trajectory; never collide with real vehicle or obscure track visibility. Transparent clay may look visually wrong: test ink silhouette or echo/trail alternative. | One seeded track lap, record/playback ghost and seek/reset behavior. |
| 8 | **Input/seed capture and replay** | **A · test infrastructure first** | Determinism is **UNPROVEN** globally. A fixed tick and seed are necessary but insufficient when physics callbacks, actual asset loading, timers, camera/UI/audio or floating-point drift differ. Capture timestamp/tick, normalized intent, seed, build+asset version, critical authoritative state checkpoints. Distinguish *input replay for regression* from *transform capture for ghosts*. No duplicate movement owner. | Repeat one saved 60-second walk/drive/interaction twice after full reload and measure transform/event delta; assert a failure rather than “exact replay” by assumption. |
| 9 | **Animals reacting to proximity** | **B · use only verified assets** | A flock can use instancing, but “30–60 birds one draw call” is not assured for heterogeneous materials and animation. No new generic birds made from cubes; invoke **KFB asset search** and show genuine individual donor object first. Better reaction: 1–3 timed local creatures with specific flee/land/recover read before a swarm budget. | Source-isolated creature(s), one near/far encounter, measured CPU/GPU and resident/camera read. |
| 10 | **Value / posterize / silhouette QA views** | **A · internal art direction** | Reuse existing KFB Styleguide/Ink and actual material owner. Grayscale+value bands and silhouette are diagnostic overlays **not replacement visual canon**. Always compare default final frame at gameplay distance, day/night and any dialogue view. | Same approved view three modes plus unmodified image and source-known contrast/readability checks. |

Priority is a **design recommendation**, not a new WS1 scheduling authority; hours/days cost claims are unverified until owner-specific integration audit.

## 2 · Five additional gameplay-first proposals (not extra feature waves)

### G1 · **An invitation readable without text** — Highest value
Use an existing Resident/body clip + a specific prop activity to point to something that can be done: Farmer_B interrupts Fluff work and gestures to a problem, or a Clown's interrupted action exposes a card-relevant object. First show *who wants what* without a quest marker or an explanation bubble. Only then optional ChatterBox/Triplet response. **Source:** existing Resident choreography #369, Golden Journey, Pull Don't Gate. **FAIL:** player sees animation but cannot infer any possible response.

### G2 · **One object, two viewpoints, one reversible action** — Highest value
A real, stable object changes *social meaning* when approached via Hunky/Dory or two Resident contexts, but does not duplicate world state. Example **DESIGN ONLY**: the same source-backed Fluff-bearing tree is framed as Hunky's harvest resource and Dory's cared-for garden; the player can inspect, help, collect, or walk on. A single visible reaction provides the next curiosity. Three canonical `D6 Story Modes` or “Heim portals” are **NOT** inserted; operations like `LOCATE/RELATE/CHECK/ACT` are optional interpretation lenses and not new buttons/currencies. **FAIL:** only the tint changes and nothing playable differs.

### G3 · **Return recognition rather than a bigger quest log** — High value
One tiny owner-backed trace survives departure and return: moved Fluff, repaired object, changed prop pose, or an existing Resident acknowledging the previous action. The Almanac can cite the real event/card provenance, but must not mint a new card or run a second persistence state-machine. This is the smallest argument that the world was already living. **FAIL:** everything snaps to the identical state after deliberate revisit without an authored reason.

### G4 · **Contact → acting → response → recover** — High value
Treat throwing Brick-Fish, gifting, Fluff shaping and small collisions as *three or four readable beats*, not random particles: anticipation (already existing pose), contact, reaction/readable social response, recovery. A small optional hit-stop is used only at contact. Audio, Emanata and camera each receive limited budgets from `skills/kfb-cartoon-animation/references/75-vfx-audio-camera-comic-motion.md`. Avoid auto-physics-driven slapstick for every prop. **FAIL:** VFX is abundant but the cause/result cannot be identified.

### G5 · **Gutter as editorial play, not a decorative portal** — Candidate / Gate dependent
Link `planning/kfb-flatworld-comic-gutter-r1-2026-10-18`: a black ink zone boundary and white gutter are allowed to *stage a change of context*. The player sees evidence or action on one side, makes an interpretation or transition, and meets a consequential counterpoint on the next panel. No universal floor of white paper, forced geometry, new warp manager or automatic conversion of the four islands into tiles. The next flatworld gate is still **source-isolated two-zone design comparison vs Four-Island A/B**. **FAIL:** plain white gap/teleport effect without meaningful neighboring scenes.

## 3 · Production companion: stills and editable comic motion (not game runtime)

The existing **2D Animation Studio** owns source-exact 2D rig/deformation and SVG/browser playback; ToolBox 3D EyeRig retains facial semantics. Existing documentation:
- `tools/2D Animation Studio/START_HERE.md`
- `tools/KFB-ToolBox/docs/2D_ANIMATION_STUDIO_BRIDGE.md`
- `skills/KFB_Cartoon_Authoring_System_Living_Brief_v0.1.md`
- `skills/kfb-cartoon-animation/references/05-2d-2_5d-compatibility.md`

Design option: original KFB comic art → source-isolated layer/anchor decomposition → editable limited puppet motion (either within existing 2D owner or external Warp Studio as evaluated *donor*) → exported image sequence → Remotion or existing owner-owned compositor for panel pacing, sound, captions, and 16:9/9:16 output. **Not proven:** Warp Studio availability on Georg's operating system; no production MCP connection or KFB↔Remotion export pipeline was validated. AI video may be a *deliberate, short effect shot*, never automatically replace stable character/source identity.

Shared semantics to compare across gameplay/video, **not shared implementation**: anticipation → action → contact/reaction → hold/return; `12 fps` held pose experiments; real speaker look; one camera intent; captions/ink remain protected. Do not build another actor runtime or duplicate EyeRig/ChatterBox.

## 4 · Explicit bridge to parallel web-chat concept work

**Parallel research, read at live branch heads on 19.10.2026:**
1. `research/kfb-six-dimensions-fractal-d6-r1-2026-10-18@f6ba31657a459d1ffba13d28f14e412ddfe9d33c` → `replies/KFB_SIX_DIMENSIONS_FRACTAL_D6_R1/CONCEPT_R1.md`, `RETURN.md`. **D6 modes / color accents ≠ historical Heim/color map** (`exactHistoricalD6DimensionColorMapping: null`). `Encounter → Attend → Ask → Reframe → Test/Act → Remember`; optional story lenses, not six shader filters or fixed movement modes.
2. `research/kfb-six-dimensions-deck-donors-r1-2026-10-18@789c2eaee5d558dda71944824803702a8c42544c` → `replies/RESEARCH_KFB_SIX_DIMENSIONS_DECKS_R1/DECK_DONOR_AUDIT_R1.md`. The 16 shortlisted decks and 49 verified card-number/title pairs are **candidate source pins**, no new card concepts or automatic visual approval. One real 3-card triplet, original imagery and interpretation difference are the owning next gate.
3. `planning/kfb-flatworld-comic-gutter-r1-2026-10-18@954431f78949d7919a1a31b1cd8ff353c001124d` → `skills/chat/masterplan/KFB_FLATWORLD_COMIC_GUTTER_DESIGN_2026-10-18.md`. White Gutter/black panel edge as **design proposal**, not existing world geometry or second engine.
4. Existing Web-chat game core brief: `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/BRIEF_WEBCHAT_GAME_DESIGN_R1.md` (13.10.2026, Register branch). The concrete loop is *seconds → 10–20-minute session → revisit*, on a chill roadtrip with characters, cards, Fluff, music; not a feature buffet.
5. KFB Game Bigger Picture: `skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md`. Fractal provenance chain and **PULL, DON'T GATE** win over cosmetic features.
6. Blender MCP resident performance #369 `blender/resident-performance-choreography-2026-10-07` is a **motion donor**, not an authorization to modify WB2; on that isolated branch, 34 behaviours per rig have measured coverage, with one authored shrug and unresolved seams. Source before reuse.

**Source of future acceptance:** WS0 / current owning Game Design and actual Four-Island authority, not this concept branch.

## 5 · One concrete prospective 2-minute encounter, no new assets

*Sketch, not proof, player-facing copy or world canon.*

- **0:00–0:20 — Notice:** a source-verified Farmer_B performing already documented Fluff work, another real Resident attends; visual cue survives with audio muted.
- **0:20–0:45 — Approach:** camera grants visibility; no generic question marker. Farmer's interruption and gaze create an invitation.
- **0:45–1:10 — Choose:** player gives an already sourced small Fluff item / asks / keeps walking. Use actual source-backed activity if an existing owner supports it; otherwise this remains storyboard only.
- **1:10–1:35 — Social answer:** recipient's pose and small response acknowledge the choice; one semantic visual impact/hold only if an event warrants it. No dialogue text invented here.
- **1:35–2:00 — Return hook:** the changed prop/relationship remains legible; existing Card/Almanac can refer to a real encounter when provenance exists. Optional adjacent card/world perspective points elsewhere.

**What is fun?** Recognition, agency, an unexpected but causally intelligible reaction and renewed curiosity — not XP, a forced quest or a tooltip.

**Practical comparison:** Without WS1 effects, does the encounter already work? If no, fix situation/read first. With held-pose and one contact accent, is it clearer or simply more theatrical? If not clearer, omit effect. Then test whether the neighboring card/gutter changes the *read*, not just background color.

## 6 · A deliberately small decision shortlist

**Round P0 — gameplay before look**: G1 invitation + G4 response in one existing-source encounter, no new animation library or world runtime. **Success question:** “After 30 seconds, do I know what I want to try, and does the world respond?”

**Round P1 — style polish on a validated scene**: per-role 12/24/continuous pose sample, sourced hit-stop donor and camera dither as *separate A/Bs*, not a bundle. Retain baseline unchanged. Test responsiveness, contact, silhouette, eye/bubble/ink legibility.

**Round P2 — memory and interpretation**: G3 single return trace; G2 alternative reading; only then consider G5 comic-gutter adjacency against the parallel A/B design decision.

**Developer-enabling aids** (can run independently if owners authorize): #8 input/state log and #10 silhouette/value modes for objective debugging. #6 photo QA capture opportunistically if the same camera owner already exposes it.

**Defer:** tilt-shift, flocks, transparent PB ghosts, new six-axis mechanics, world-scale wind simulation, new frame-rate engines, new UI, a cloned 2D Studio, automatic AI video style replacement.

## 7 · Guardrails and acceptance

- No unnamed new actors/assets; KFB **asset search** before any missing asset. Loading an asset URL does **not** prove donor image/geometry match; inspect source object alone first.
- Retain existing Camera/Motion/World/Surface/Material/Audio/Progress/Card/2D owners; no second simulation clock, RNG authority, dialogue engine or compositor inside WB2.
- **Pose sampling is visual; game time and input remain authoritative**. A local hit-stop must not halt critical physics/event processing without specific accepted ownership.
- Source-backed before/after; include runtime responsiveness and frame-timing. Test actual Mac GPU instead of promising “free shader.” Visual proof only on actual allowed product surface when a later slice calls for one.
- Nothing here authorizes WB2 R5, island geometry, World A/B PASS, Stage/Site publishing, merging, or a Canon change. `DESIGN / PROPOSAL` only.
- Do not alter any parallel 6D, Deck Donor or Flatworld branch: coordinate by exact cross-links; PRs remain independent.

## 8 · One next gate

**WS0 / current Game Design owner conducts a short *design* triage on one sourced two-minute encounter**: confirm G1/G4 as the leading *fun* candidate or replace it with a more compelling existing-source encounter. Compare the story/causality read **before** approving visual polish. D6/Flatworld branches retain their own existing source/design gates. No build, no MVP promotion.
