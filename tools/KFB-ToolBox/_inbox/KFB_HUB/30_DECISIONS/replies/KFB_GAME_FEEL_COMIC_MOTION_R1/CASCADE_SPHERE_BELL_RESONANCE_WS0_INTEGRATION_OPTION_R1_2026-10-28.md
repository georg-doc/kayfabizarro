# WS0 · Bell Resonance × Current KFB MVP × Cascade Sphere · Additive integration option R1
Date: 2026-10-28
Status: **RESEARCH / OPTIONAL CONSUMER DESIGN — NOT A NEW V-DECISION, NOT PART OF CASCADE R3 TIER-0 ACCEPTANCE**.
Writer/owner: existing WS0 Game Design / Fractal Canvas conceptual lane, PR #435, branch planning/kfb-game-feel-comic-motion-ideation-r1-2026-10-19.
Receiving owners: current private main-game WS1/WS1b R3F, existing Audio owner KFB Audio #365 and unpublished immersive candidate #455, OSM/World/HyperNorm existing owners. Bell physics research stays in Draft PR #458; not copied or promoted here. No new gameplay/camera/clock/store/audio-host/routing/site owner.

## 0 · Authority check and update to prior switchyard ideation
**Newer WS0 binding source overrides earlier web-chat switchyard estimates:**
- Register branch docs/kfb-decisions-register-2026-10-11, file replies/WS0_AN_WSA_V962_CASCADE_SPHERE_POC_R3.md (V-962, 968, 971, 981) = **BRIEF-GATE PASS / design first, not implementation pass**.
- Companion replies/KONZEPT_CASCADE_SPHERE_GAME_IN_GAME_R1.md is V-968. 
- New private implementation source repo georg-doc/KFB-Stunt-Car-Race; future branch **poc/cascade-sphere-r0** and **its own protected GPT Site** after WS0 design acceptance. No commits to game/proc-world-ws0. Verify that future branch actually exists when executor starts; this note does not create or deploy it.
- Main-game donor game/proc-world-ws0 at least @9fc8d09, refetch current branch before each build phase. Confirm exact FB_CANON, weapon muzzle +Z, jetpack and locomotion; preserve checks.
- KayKit Platformer EXTRA **already available** on separate private `assets/kaykit-platformer-r1` @5c6096a, path `kaykit_platformer_r1/` (525 gltf+bin, source README+sha256). Previous PR #435 R1 claim `Platformer SOURCE_REQUIRED` was based on older PUBLIC registry snapshot and is superseded for the private Cascade R3 build; do not re-download or invent a new source.
- Existing host contract **KFB_HOST_CONTRACT_R3F_R1.md v1.2**: exactly one R3F/Three renderer and ModuleHost, `create(options)->{object3d,update(dt,ctx),dispose()}`, module never imports React/Store/creates input map, host writes state via callback; v1.3 is explicitly withdrawn. `cascade-core` alone owns encounter state; `field-gen`, `skin-*`, `play-input`, `audio-cues` are consumers/derivations. No independent tick/state/audio world. Runtime package patterned after site/mvp-r3-dist; protected auth on every external deep route must actually be tested before sharing with Stefan.
- R3 explicitly demands stylized authentic Cologne OSM subset→2×2 m grid→source-backed WFC with landmark constraints, first FrizzleBob + Jetpack + Fluff-firing Gatling, touch/grapple and Goo. Earlier simple Maze-first or Combat Mech-first proposals must NOT silently overwrite R3. Main game Robo-Arm/Trichter stays original while Cascade Sphere has its own approved Gatling Fluff-cleanup meaning (V-609/V-532). A single 2–4-minute golden run precedes optional 4GTN, Sweet Supply, Qiva and future skins.
- Budget: at most TWO meaningful improvement rounds per stage, no repeated critic loop. First independent end-to-end test is distinct from builder and cannot self-certify; acceptance only after real site/delivered clip. New ElevenLabs sounds need separate Georg GO.
- WSA user paste still says `V-962 R2` despite supplied current file title `R3`: use the exact R3 GitHub file and V-968 source; do not route to an older R2.

## 1 · Bell source reality (research state) and hard distinction
Bell R7 actual research:
- `georg-doc/kayfabizarro` Bell Draft PR #458 (`research/kfb-bell-resonance-mindscapes-r1-2026-10-28`), R7 COMSOL Liberty Bell and Dropbox GLB audit. 2 user Dropbox original GLB *metadata* (3.86 MB and 127.98 MB) checked, **0 true GLB bytes parsed/rendered**, original model identity / rights unverified. R3 pseudo-SVG/Canvas bell visual already rejected by Georg. Only actual 3D source donor can become a physical/landmark object after source isolation/rights/geometry.
- Genuine CC0/PD field-recording pages documented but **0 original real bell sound bytes downloaded, solo auditioned or measured**. Synthetic R2 wav sample exists as explicitly synthetic *design/demonstration*, not a real church bell or source-complete historical sound.
- COMSOL Liberty Bell physical model uses scanned bell replica and simplified solid for eigenmodes; its examples of cracked/intact and pitch tuning DO NOT yield production-ready KFB mode vectors or playable content.
- Bell physics: temporal FFT/sound onset can control amplitude/decay but **cannot uniquely tell where 3D bell nodes/antinodes are**. A correct 3D modal shape requires actual mesh correspondence and FEM/measurement; simple oscillating decorative rings, personified bronze lore and fake psychophysics forbidden.
- No current published production Bell adapter, historically authenticated bell sample or in-game spatial emitter has been independently accepted. Do NOT mark this a requirement that would block V-962 R3 POC.

## 2 · A: CURRENT KFB MVP / future Mindscape or Spatial Sound Landmark
**A1 · Primary recommendation: one spatial bell sound landmark (optional existing host consumer)**
Use **one verified/licensed/authenticated CC0 or PD real bell recording** associated with a source identity/rights receipt. Put it at a named, existing World POI or author-owned fictional campanile slot with the World/OSM owner supplying `poiId`, transform, radius and visibility/occlusion hints. The audio authoring Site is a sound donor/workbench, NOT a shared runtime AudioContext across the game and Site. The *game runtime* owns exactly one audio graph/controller; sound adapter uses its existing emitter bus or pre-existing PannerNode/ConvolverNode and mixer/ducking, never instantiates a parallel context.
- From distance: one subtle localized dry toll/late reflections and attenuation. Closer: stronger direct-to-reverb ratio and meaningful obstruction/tower occlusion if existing game audio system supports it; don't invent verified HRTF or IR measurements.
- Crossfade/duck against existing bed using existing Audio owner. Fall back to mono, muted or reduced spatial mix for accessibility/CPU; visual cues remain usable without headphones. Spatial 3D positioning and binaural beats are **distinct**; Schumann 7.83Hz is an EM environmental mode not audible bell pitch.
- Optional state authority: World POI reports `discovered`/distance/entry, audio only *subscribes*. No bell sound triggers grant, teleport, quest or save event. No added current-MVP required row; existing R4 world recovery state is not reopened by this proposal.
- Visual: a bona-fide 3D bell from accepted Asset Librarian/historical geometry ONLY when isolated and license-proved; otherwise introduce the spatial location with already verified tower/POI geometry without fabricating the bell model. Do not claim the sound is from that real Cologne church unless actual recording/object/place identity is documented.

**A2 · Mindscape resonance portal (second gate, later)**
One optional `Resonance Landmark` can serve as diegetic transition/invitation: approaching it changes the audible soundstage then reveals an already valid authored Mindscape/Instance portal. **World/portal owner** decides destination, save/return and authorization; bell audio cannot own portal routing. Keep field separation `ACOUSTIC_FACT` vs `FICTIONAL_RESONANCE`, never lore about bronze storing memories. A scientifically inspired 3D cutaway/mode viewer only after R7 true-source geometry and FE proof (A3 later).
**A3 · Scientific 3D Bell Atlas** = separate research/authoring capability beyond current MVP, only when original 3D mesh, FE-derived mode vectors and authentic acoustic measures pass. Avoid importing COMSOL into browser runtime or treating downloadable marketplace model as validated solid.

## 3 · B: CASCADE SPHERE · best small optional use
**B0 (preferred, nonblocking): Bell as a world-readable spatial marker tied to existing outcome events.**
Place ONE `signal-bell/relay-tower` at a current R3 OSM author-owned landmark slot that source/WS0 visually approves. Do NOT replace the required R3 first-level soft elastic switch/Fluff reaction/short cue. Optionally play an existing audio cue (thematic bell only when source-approved) on:
1. `route.fork_activated` — short punctual cue coming from the correct node/tower;
2. `fluff.sink_delivered` — stable, less frequent success cadence, not a note for every visual particle;
3. `goo.node_cured` — resolve/damped-then-clear local sonic state;
4. `level.completed` — distant/broad sound rather than an extra Score/Almanac grant.
The **canonical cascade-core** owns all trigger conditions, state and dedup event IDs. Visual bell motion and mixer are subscribers; neither read music playback to determine graph or successful delivery. Events must be deduped by scenarioSeed+tick+entity+eventKind to avoid rerender/reset double cues. Distance/source position passed through host; no duplicate SFX streams.

**B1 (later, meaningful mechanic rather than decorative sound): Resonance Relay / Timed Gate**
In a *later* optional level, one existing actual 3D floor/roof switch at a bell-relay tower sends `activateRelay(nodeId)` into cascade-core; core validates player reach/contact plus authority, and toggles an existing graph edge for a bounded in-game tick window. The bell toll is a spatial and audible explanation of the window; the graph mutation occurs **immediately by the core**, not at `audio.onended`. One wave can traverse the fork before it closes. Hold-preview/Shadow Impact displays expected route change through existing host UI; mute/reduced motion players see the edge/gate indicator and packet routing unchanged.
- Future pitch/partials variation may encode two **valid gate states** if an actual selected audio source supports it; no 'frequency healing' or synthetic source falsely tagged authentic.
- Clear alternative solution required (clean/rebuild route without timed gate) so a player never needs precise rhythm or stereo listening to pass. Control is tap/one hold within the existing play-input path. The Rooftop ring point is reachable via verified Jetpack/optional Grapple, never built solely on a decorative bell mesh raycast.
- Avoid a new `BellClock` or physics runtime: timer/ticks come from current cascade-core; audio may be late without altering state. Future bell tower 3D model only if truly source-isolated; sound beacons may be anchored to source-verified existing town modules.

**B2 (optional presentation or Qiva metaphor): broadcast/cadence**
Bell pulse can audibly summarize one real route change, source arrival or alarm as one event per situation, consistent with Qiva's deliberately small number of hotspots. Do NOT integrate Qiva data/analytics or whole campaign in R3, and no Compliance/KPI-jargon or explanatory object humour.

## 4 · Exact minimal adapters and ownership
**Data proposal only, NOT current executable source:**
```js
// Existing cascade-core emits authoritative activity events; no audio semantics inside core.
{eventId, levelId, tick, nodeId, kind:"route.fork_activated"|"fluff.sink_delivered"|"goo.node_cured"|"level.completed"}
// Host/World supplies transforms of already-authored points; audio never owns the graph.
{poiId, nodeId, position:[x,y,z], soundRef, sourceRightsRef, acousticClass:"REAL_CC0_PD"|"ORIGINAL_SYNTHETIC"}
```
- `cascade-core`: exact event once, owns route, Goo and gameplay state. Audio cannot mutate graph.
- `skin-* / bell-visual`: only accepted 3D world object; host ModuleHost R1.2 create/update/dispose or pure data, reads events and host state, no own React scene/fog/camera/controller.
- `audio-cues`: map events to catalog IDs in the existing audio service; Panner/attenuation belongs to audio owner and sound routing. No new ElevenLabs or Suno without Georg approval. If no accepted real bell file, mark `SOURCE_REQUIRED` and keep default R3 cue; never invent a placeholder toll or download paid sound.
- `game/host`: one rendering loop, fixed 1/60 physics, host source/POI transform, input, listener pose, suitable graphics budget.
- `asset-librarian`: identity, per-file license/hash + source isolation of real 3D bell model; no automatic pose or physics suitability decision.
- `HyperNorm/World/Portal`: optional owned transition, destination & return, not this Bell module.
- `Card/Save`: grants only from existing receipt owner, independent of sounds.

## 5 · Gate plan respecting R3 token budget / P0 limits
Do **NOT** alter the already-approved R3 brief, add a new 25th test, demand a Bell donor before building, or write into the private `poc/cascade-sphere-r0` branch without receiving-owner authorization.
- Current WSA **source gate and design package first**: ask WS0 only to consider Bell as *optional* sound/landmark candidate on one existing locator. No added Stage/Site art, no special Bell asset requirement, no FEM. Georg's approved R3 first 2–4min golden run remains P0 and excludes this optional source until after product proof.
- After R3 playable core is green: two small independent options, A1 one source-checked real bell recorded/spatialized as a World landmark, and B0 one **deduped** R3 event cue from it. Prove one POI position, distance audible, one quiet/one strong cue, mute/reduced motion, one legitimate event and no duplicate after reset; verify performance on actual protected Site.
- If game fun justifies another step: B1 one timed relay with 2 valid solutions using existing graph; no FE mesh required.
- Later: A2 Mindscape portal and A3 FEM-mode visualization; original bell sound + real 3D mesh acquisition and physical calibration have independent research gates in PR #458.
- Two non-improving repair passes on optional Bell seam = freeze/export seam and continue R3. Independent final test covers actual game R3, not a Bell-only extra acceptance before core play.
- User copy correction: WSA paste must say **V-962 R3** not R2, and use current V-968; do not reuse superseded R0 version.

## 6 · Explicit unknowns / one next action
OPEN: real bell CC0/PD audio bytes+license receipt and dry audition; real bell 3D source-object and license/isolation; actual host game spatial emitter interface, in-browser mixing and distance model; safe optional R3 audio cue; no real scene test. R7 research currently 0 downloads/0 accepted live sources/0 FE.
PROTECTED: main MVP module, existing audio/site #365/#455, private R3 proposed POC branch, host v1.2, current 24 R3 checks, current protected Site and independent WSA test. 
**One next design action:** `WS0_CASCADE_R3_OPTIONAL_BELL_LANDMARK_DECISION_AFTER_SOURCE_DESIGN_GATE`: at already planned WS0 source/design review, keep R3 P0 independent and mark Bell A1/B0 optional; later ask whether to do one source-authentic spatial landmark/cue. This is a review question within existing WS0 package, **not a new mandatory Georg gate**.
