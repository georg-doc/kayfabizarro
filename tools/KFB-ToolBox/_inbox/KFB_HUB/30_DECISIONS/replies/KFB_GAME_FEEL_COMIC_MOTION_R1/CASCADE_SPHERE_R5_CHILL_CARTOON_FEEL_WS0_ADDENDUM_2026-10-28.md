# Cascade Sphere R5 · Chill Cartoon Feel / Organic Event Feedback
**2026-10-28 · ADDITIVE GEORG INPUT + CRITICAL DESIGN INTEGRATION. DESIGN ONLY — NO RUNTIME, NO NEW ANIMATION/AUDIO ASSET, NOT CANON.**
**Owner:** same existing WS0/KFB_HUB Game Design lane, existing Draft PR #435. **Receiver:** only the current WS1/WS1b R3F game host after source/asset/host proof. R1–R4 remain authoritative for gameplay/topology/owner routing; this addendum only refines presentation and its future acceptance evidence. **One next gate remains WS0_PLATFORMER_ASSET_INTAKE_AND_L01_SOURCE_GATE** and now includes one sample feel cue when L01 is authorized.

## 1. User-proposed experiential target
- Chill/fun rather than militaristic intensity: tactile soft-clay destruction, soft squish/wobble/plop, Black Goo visibly breathing/contracting, colorful material recovery rather than welding.
- Fluff must act like small cartoon inhabitants, including a brief surprise/question/hover/turn/bounce at a route switch, not snap instantly through an invisible algorithm.
- Surreal WFC-set dressing: playful dramatic scale shifts, giant melted coffee cup/cassette, fantastical switch-as-flower or living bridge, theatrical but still legible/playable.
- Explicit C1 feel gate: a real switch visibly deforms and one Fluff visibly reacts to the route change; soft sound is part of the experience, with mobile/silent accessibility.
- These are **candidate art/game feel choices, not assertions that a polished runtime exists**. "50% comes from sound" is useful emphasis, not an empirical measurable KPI.

## 2. Evidence-backed KFB sources rechecked
1. `ws1/kfb-planet/src/modules/fluffSuck.js` @ `ws1/combo-r2` (read directly): source Suck stages `charge .3 / stretch .4 / plop .1 / fly .4 / swallow .2` seconds; source uses an instanced volume-preserving squash/stretched ball and `onCue(cue, job)`. **Useful animation/feel DONOR only**: it's suction/collection, not a proven general rerouting emotion/AI animation system.
2. `travel/wip/travel_globe_wsa/kfb-deform-instanced.js` @ main: source instance attributes with optional squash/deform and bounded presets; candidate deformation technique, **no WS1 integration proof**. Do not globally warp targetable/physical assets without collider truth.
3. `skills/kfb-cartoon-animation/references/75-vfx-audio-camera-comic-motion.md` @ main: one primary semantic action, optional subordinate support, purposeful quiet/silence, stable seeded irregularity, recovery and no indiscriminate camera shake or stacked impact rings.
4. `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/SPEC_CARTOON_VFX_SHAPES_R1.md` @ WS0 register: organic lobed single volumes, big/medium/small hierarchy, life-cycle, 2–3-tone mass, source contact and nonrepetition. Do **not** implement goo as stacked uniform white balls or unstructured spawn spam.
5. WS0 V-514 `BRIEF_WS1_FLIGHT_DESTRUCTION_R1.md`: Combat-authoritative ShotEvent→HitEvent then separately subscribed visual/audio; current historical target and budget are donor constraints, not measured current Mech QA.
6. Existing Audio Flight/Crash R1 Draft PR #428 source and hosted Audio Site documented in prior R3/R4 sources; reuse existing mixer/buses/ducking/clock rather than adding AudioContext or generating new paid assets.
7. Existing R4 `CASCADE_SPHERE_R4_MODULE_CONTRACT_CANDIDATE_2026-10-28.json` and three fixtures: action graph and packet facts are authoritative; presentation is subordinate.

## 3. Core architectural decision proposal: FACT → CUE, not FACT + MOOD baked into physics
**NO normative mood modifier in the canonical game event.** The source event envelope carries immutable causal state (`runId,eventId,tick,type,subjectId,payload`) and **nothing dependent on camera/theme/animation preference**.
A separate recipient-owned `PresentationCue`/recipe **candidate** maps `factType + sourceSemanticRole + activeTheme + supportedCapability` → `animationPresetId, audioCueIntent, intensityBand, durationBeats, anchorRef, semanticVfx, accessibilityFallback`.
- Mapping is data in the existing game/presentation owner, not a new dispatcher or global event bus. Existing facts cannot wait on animations to complete.
- Deformation/tween curves use existing host animation time; no new clock/rAF. Reseeded ornamental variation stable per `runId+eventId+objectId`, no random jitter in each frame. A deterministic replay checks gameplay state, not exact randomized eye blinks.
- Trigger only from *accepted factual events*. One `SWITCH_ACCEPTED` produces one primary flip cue even when keyboard and touch produce duplicate intents; one `HIT_ACCEPTED` has one primary contact accent. A `PACKET_ROUTED` observation may yield one small reaction per affected Fluff, but repeated camera frames/route reads cannot retrigger.
- Audio owner interprets audio intent; no fabricated filename/source. Missing audio asset or muted audio leaves readable 3D contact and color/material result, with optional subtitle/emanata in safe space.
- A quiet physical sound + short body pose is preferable to an extended multi-layer audiovisual burst for everyday interactions.
- Mood is a **theme-dependent presentation profile** (tech, sweet, dreamlike) and a player preference/intensity setting, not a new KFB D6 Story Mode nor an invented Fluff color mechanic.

## 4. The smallest expressive C1 "switch-and-squish" signature
**Input:** Player activates one verified real KayKit lever/button at junction. `SWITCH_ACCEPTED` updates directed route seam once on fixed tick and emits a single unique event; all actual packets keep legal positions.
**On-screen cue candidate timeline measured relative to accepted host tick, not a separate simulation:**
- **0–120 ms**: switch leans into input and holds very briefly, using original source mesh transform/pivot/temporary child mesh; don't change collider/path until authoritative event has already changed.
- **120–320 ms**: switch overshoots and springs back with damped elastic tween. Exactly one soft wooden/ceramic "klonk"/plop audio intent (host mixer), short audible tail; timing *candidates*, not accepted animation clips.
- **At a route choice node within ~120–450 ms after noticing new routing:** one Fluff character stops/bounces/tilts in surprise, optionally tiny cartoon `?` Emanata only if readable, then joins the selected legal path. **Important:** if the packet already travels on an edge, it finishes that edge or an explicitly validated turnaround; it never snaps to another edge midair. Logical route state may change immediately while the body blends without position cheating.
- **Next 300–600 ms:** first delivery begins to visibly take the new route; optional soft compress/recover body, one small trail only if it makes direction clearer. Queue and path outcome remain legible from isometric mobile view.
- **Important usability:** source-authentic actor eyes and real source lever remain visible; never cover players' line of travel, HUD/card faces, or goal with giant VFX/letters. Skip optional emotes and trails if screen density or reduced-motion profile demands it.
- **Acceptance:** as C1 is run in the actual existing WS1 owner, a source-real switch visibly bends/recovers ONCE, a source-real or visually validated instanced Fluff responds in place and correctly turns, sound gesture is sourced via one Audio owner and fallback silent still communicates. One actual before/after path + seed/retry remains functionally identical with or without cue.

### Different levels, different tactile staging
- **L02 Goo:** infected shell breathes gently (visual-only shader phase) without periodic gameplay infection events; on `HIT_ACCEPTED` Goo recoils/withdraws into a few softly animated lobes or puddle shapes. The exposed shell stays a separate opted-in destructible target, not the original KayKit City Builder source model. Use few soft splats rather than shrapnel; if optional attack intensity differs, don't force a violent boom. Optional "grooving puddle" is tertiary, not new enemy AI.
- **L02 Repair:** only after `REPAIR_ACCEPTED` do material and object poses inflate/settle like soft clay or a balloon. Actual collider and graph edge change follows *world-authoritative* accepted repair, not the end of tween; visuals may temporarily over/under-shoot and must clear on reset/unload.
- **L03 Rooftop:** one marshmallow stretch/short bounce on an approved landing/contact or packet descent. Flight camera/Jetpack/landing owner remains unchanged, safety and contact readability first.
- **Sweet Supply:** softer bounce/short bell or wooden tap and icing-like colors with source Bakery props; actual graph and event IDs identical to Tech theme. Avoid sound saturation from dozens of packets by grouping same-batch audio.

## 5. WFC "Decorator of the Absurd": visual freedom within proven functional boundaries
WFC does **not** acquire "total freedom". A giant coffee cup, melting cassette deck, cartoon blossom, sleeping bridge-creature or unusual organic node can be considered only as an **eligible decoration or verified snap-compatible actuator prefab**.
- Required fixed source graph, reachable buttons, route arcs, camera/character silhouette, spawn/goal and physical clearance stay protected by hard constraints from R4.
- Separate large-scale visual hero props from small adjacency tiles. Gigantic scenic objects belong in *author-selected landmark/POI slots* with tested view corridor/landing clearance, not random adjacent tile variants that collide with the Maze.
- If a scenic object becomes a switch or bridge, it needs exactly the same measured socket, physical collision/surface and contact behavior as the original actuator/bridge. Its living animation is subordinate to accepted route state. Semantic actor object requires actual source/rig donor; do not rename an unavailable cube as a source-real prop.
- Preserve original KayKit assets recognizably under KFB Clay/Warper; decoration may distort material/secondary shapes without silently moving collision hulls or occluding the scene. Keep seed-locked spectacle.
- WFC's first measured comparison remains **authored L01 visual variations vs bounded local tile-WFC**; reject if charm/readability/performance fails. No new WFC engine in C1.

## 6. Accessibility/comfort, mobile perf, debug acceptance
- Three **presentation intensity profiles** are candidates, not three separate physics simulations: `SOFT` (default gentle animation & one cue), `PLAYFUL` (extra bounce/secondary flare), `REDUCED` (lower motion, no distracting camera shake/trails and visual-state clarity, compatible with reduced-motion preference if host exposes it).
- Audio: sound off/muted/reduced must still show cause and result; no guaranteed 50% subjective contribution. Respect KFB Audio bus/headroom/polyphony; use source-owned cues, duck for speech/dialog, no rapid click on every individual Fluff ball.
- Perf: same source and core graph, compare effect OFF vs SOFT/PLAYFUL using actual target mobile/desktop browser. Measure p50/p95, draw calls, transparent overdraw, active tweens & pooled particle count; no absolute frame budget claim before host device measurements. One primary response per fact, group optional accents, cap active cues and clean on replay, blur/tab change, level unload and portal exit.
- QA: one accepted switch produces exactly one visible lever motion; packet physically reaches fork before deciding; all cues removed on reset; no second route event from animations; synchronized enough that visual state not contradict game truth; muted and reduced-motion scene still readable.

## 7. Integration/decisions for WS0
**Keep C0 technical contract exactly as before.** Add the tiny R5 `PresentationCue` mapping as **candidate consumer data**, not a modification to existing game event or another runtime owner. C1 add only **one lever elastic motion + one Fluff hesitation/bounce + one source-owned sound intent**; no full emotion engine, music generation, emotion-color system, new shader stack or fake runtime demo. C2 inherits Goo breathing/soft breakup and repair inflation; C3 inherits marshmallow landing.
**No new question to Georg is a blocker now**: WS0 source-isolates real lever/pivot and a single Fluff visual donor, pins available Audio cue IDs and tests first sequence against C1 physical contact. Actual taste and sound acceptance follow browser gameplay; keep parameters tunable in the existing visual-owner surface.
**One next gate unchanged:** `WS0_PLATFORMER_ASSET_INTAKE_AND_L01_SOURCE_GATE`, now with optional isolated lever animation/audio feel preview *only if source-ready*. No new Stage/Site or Live, no auto-merge.
