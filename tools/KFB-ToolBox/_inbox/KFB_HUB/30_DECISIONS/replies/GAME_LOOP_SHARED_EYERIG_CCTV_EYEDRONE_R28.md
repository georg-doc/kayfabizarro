# KFB Game Loop R28 · Shared EyeRig Surveillance Hosts: CCTV + Flying Eye Drone
Date: 2026-11-01 · Georg creative steering · ADDITIVE CONCEPT / SOURCE-AUDITED / NO RUNTIME IMPLEMENTATION

**One concept owner:** KFB_HUB `30_DECISIONS/replies`, existing Draft PR #460, branch `planning/kfb-game-loop-fluff-economy-r2-2026-10-29`.
**One human decision authority:** Georg / WS0.
**Receiving runtime owners (unchanged):** canonical ToolBox 3D EyeRig v6 / FaceHost / R26-R27 appearance and modifiers; existing World/WB2+Mob/Resident/Cue state; existing Motion/prop rigs; Sky/Environment host; current KFB Audio/VFX mixer and Destruction event source. This design must not create a second eye, gaze, drone flight, camera, Sky, character, AI or audio engine.

## 1. Outcome and user intent
**Two physically distinct surveillance hosts, ONE canonical KFB claymation EyeRig:**
1. **CCTV Eye / camera host** — an actual source camera body pivots in *pan + tilt*, with a source-owned EyeRig at its lens/front. It may track a player, resident, Card, ChatterBox gesture, News scene or HyperNorm event. Host rotation follows broad direction; pupils refine the local aim.
2. **Flying Eye Drone** — an expressive flying cartoon eyeball with clay lids, a **toy-like top rotor/propeller** and a compact hovering motion. One eye/orb with a propeller can be the entire vehicle; do not default to generic military quadcopter hardware.

**Priority:** a low-cost, immediately legible propeller-eye with idle hover, slight bob, controlled yaw, short patrol and gaze; **wing-beat Flying Eye** remains a deliberate post-MVP variant because synchronized flapping/lift, banking, wing-root deformation and natural vertical velocity require additional motion/physics proof. This is not the DuckTales branded propeller hat: toy cap silhouette is a visual trope, and approved source/rights need independent review.

**Mood and interpretation:** KFB Happy-Panopticon/Mindprison/Brave New World News satire. Camera and drone may act as propaganda props, witnesses, comic nuisances, card guards, limited enemies or ambiguous observers. Their apparent attention does NOT prove omniscient Big Brother or create a global `player is guilty` meter. The same eyes may be neutral, goofy, black/red (Goo/active threat), hypnotized spiral, heart, star or X (if approved through R27). Host changes never overwrite ChatterBox, Combat, Card or Goo state.

## 2. Verified donor inventory (now substantially better sourced than the previous chat draft)
### A. Existing source-backed CCTV camera already integrated in a previous **non-live** donor
- Exact asset: `media/3D_Assets/kenney_racing-kit/Models/GLTF format/camera_exclusive.glb` (11,560 bytes in the recorded donor).
- Existing source: `tools/KFB-ToolBox/_inbox/KFB Cologne Race Option C-2/lab-v9/cologne-props.v1.js`, blob `70d829cc53a9f5bca9987d3552da5d36bf34b188`: `buildCCTV(THREE, GLTFLoader, cams)` actually loads that Kenney source, measures bounding box, clones it, assigns physical holder position and `holder.lookAt(c.lookAt)`, and stages three CCTV hero capture cameras with independent IDs/triggers; not yet a pan/tilt EyeRig assembly.
- Isolated source-viewer donor: `tools/KFB-ToolBox/_inbox/KFB Cologne Race Option C-2/docs/donor-isolation.html` blob `9007307655536253191fc4c35e32cb070f59de27`: code creates a real-viewer cell for the GLB and measures dimensions/bytes. **Code exists but a fresh in-this-slice browser screenshot and physical lens isolation were NOT run**. Its `docs/RETURN.md` says NOT PUBLISHED / NOT LIVE and visual acceptance outstanding; do not infer a passed source-object proof for today's host.
- Other registry alternative: `media/3D_Assets/KFB/Camera by Kai Fan - 1pI-40LVzWX.glb`, in `registry/assets/v1/packs/kfb.json`, asset size 501,164 bytes. Not verified as a CCTV body or as a cartoon eye host: **compare the original object visibly first**.
- Georg reports other collected CCTV camera models, but a targeted Dropbox **title-only CCTV/camera/security search** found screenshots, code and generic camera refs rather than an unambiguous CCTV GLB. Do not pretend these were inspected; search a supplied folder if he wishes to shortlist more.

### B. Actual source-backed propeller + existing **measured motion donor**
- `media/3D_Assets/KFB/Propeller by Poly by Google - 7IXU7duFN7t.glb`, source registry `registry/assets/v1/packs/kfb.json`, **34,232 B**, pinned asset blob `2f909105f782bc08ba95d05e6cca020d1db4ebe5` @ snapshot `073b79c3fb4052f7f4691976663ffc0c9449f7f3`. Dropbox exact file `/Mac/Documents/Codex/2026-09-28/hi/work/kayfabizarro-import/media/3D_Assets/KFB/Propeller by Poly by Google - 7IXU7duFN7t.glb`, file id `id:KeQLaY5-IIAAAAAAAAeMdg`, 34,232 B, metadata verified.
- **Existing real geometry/rotor donor:** `tools/KFB-ToolBox/_inbox/KFB Cologne Race Option C-2/lab-v9/drive-mods.v1.js`, blob `571dbe40088121b429d0f5343a49bc32719b6e97`. It measures the Poly propeller bounds (~66.74×6.52×55.86), deduces the rotational axis and hub rather than guessing, exports `buildPropeller` and owns *only carrier-local presentation*. The carrier/world owns actual position, velocity and physical movement. **Reuse this source before authoring a second propeller rotor module**; acceptance of the old Cologne Race donor does not mean the new Eye Drone is integrated.
- Additional Dropbox drone body candidate: `VR DRONE by Dave404 - 580fbWUqqbh.glb`, `/Mac/Downloads/VR DRONE by Dave404 - 580fbWUqqbh.glb`, id `id:KeQLaY5-IIAAAAAAAAx_7A`, size 1,023,364 B, modified 2026-10-28. Metadata confirmed. **Shape, proportions, license and whether it supports inserting an EyeRig are NOT visual/source-verified.** It is an alternative inspection candidate, NOT the default final cartoon character.
- The strongest first visual candidate is **canonical EyeRig eyeball/eyelids as the protagonist's visible body plus attached measured Poly rotor**, rather than hiding it inside a large unfamiliar drone shell. But EyeRig v6 requires a valid `ch.inner` head/body host and ray-fit; use actual existing owner-approved FaceHost/anchor adapter, not a newly duplicated improvised rig.

### C. Canonical eye and motion interface
- `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`, blob `853bcf5fb090dd6564fda8bc83d0b4cb527e6b26`: genuine separate eyeball/pupil/lids, `eyeFrame()`, gaze, blink, pupil size/gloss, splay/converge, `applyEmote`.
- `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/lib/frizzlegraft/anchored-eyes.v1.js`, blob `f646cee822c4aaef984179316e925848c03cb2fc`, uses a measured FaceHost and attaches actual EyeRig to existing source anchors on host characters. This is the primary **attachment pattern** to inspect; it is not automatically suited to a camera shell without measurement.
- Existing R26 `GAME_LOOP_SHARED_EYERIG_AGGRO_HEAL_SKYDOME_R26.md`: white/black normal vs black/red Goo and actual aggro. Existing R27 `GAME_LOOP_SHARED_EYERIG_EXPRESSION_MODIFIERS_R27.md`: X/spiral/heart/star/tear/gloss proposals; many are **NOT implemented** although some metadata flags exist.
- If the eye host has a single giant eye rather than two, the **current EyeRig v6 is a two-eye construction**; a one-eye geometry/visibility profile would be a *small owner-approved alternative source arrangement* AFTER donor isolation, not a new eye simulation or an assertion that EyeRig v6 already supports monocular mode.

## 3. One host interface, not a new runtime API (semantic pseudocontract, pending receiving owner)
`WORLD/SCENE INTENT → existing surveillance host transform → canonical EyeRig eyeFrame/gaze/appearance → current Audio/VFX emitter`.

**Host-specific output controls:**
- CCTV: mounted carrier transform, yaw/pitch pivots, local lens anchor/front vector, neutral/home pose, max pan/tilt, slew speed, easing, no-go stops and per-host camera silhouette.
- Flying Eye: actual carrier/World owner position, hover height, small bob/wobble, yaw, pitch cap, patrol/return, target-relative focus, rotor axis/angle/speed and optional sound emitter; **no independent physics world, lift solver or boids agent**.
- Both: same eye gaze target semantics, blink, upper/lower lids, material/expressions and an event-to-presentation cue, with only a source-approved adapter mapping world targets into local EyeRig eye-relative coordinates.

**Target acquisition is external** (presenter/ChatterBox points to Card, World prop script observes player, Combat targets a player, or drone patrol reaches POI). The eye never changes gameplay ownership based on its gaze. Sky/Orb hosts are optional further receivers, never independent EyeRig forks.

### Two-stage aim hierarchy
1. Target outside comfortable local pupil arc → **host rotates** its *carrier* in source-limited yaw/pitch, with a small delay/ease. For a sky-host, use its own transform rules.
2. Once target enters the front arc → **EyeRig pupillary microtracking** with existing `pointTo` / `setGazeFollow`, lids/splay/converge as appropriate.
3. On a strong beat (speaker's gesture, Card reveal, destruction, selected news statement), a **bounded look pulse** may snap/hold/release to the indicated world object.
4. On loss of target → release focus and return to authored idle scanning/drifting without endless loops, per-host update budget.

**Technical truth:** the existing CCTV `holder.lookAt` is source-present, but **separate movable pan-tilt gimbal pivots, occlusion/FOV and moving EyeRig focus are not confirmed features**. R28 plans their measured host adapter only; no performance or correct geometry claim.

## 4. Cartoon flying eye minimal behavior (future Stage after owner gate)
**Motion**: subtle vertical hover bob + phase-offset micro-drift, medium-speed yaw turn; source rotor spins independently around measured axis with visible start/stop easing, not a flat rotating texture. The down/up travel should feel springy and physically readable, with tiny anticipation and recovery. Light, airy rotor buzz under one KFB Audio owner, spatial cue/servos only on salient action. No free-floating antenna or extra parts without source proof.

**MVP variants**:
- *Propeller Eye* (preferred): compact eye body, clay lids, Poly rotor on top, small optional underside housing only if original source shape supports it.
- *VR Drone shell* (secondary): inspect the actual Dave404 GLB alone, do not force a generic realistic drone if it conceals the eyes.
- *Flapping Flying Eye* (DEFER): root/wing hinged beat, varying amplitude with vertical lift; needs separate Animation/Motion owner proof and a source wing donor before any gameplay demand.
- *Winged cartoon creature/rotor hybrid* (DEFER) if later stylistically approved. Avoid copied Disney hat designs or distinctive branding.

## 5. In-fiction scene uses and constraints
**CCTV**: Prison Panopticon maze, HyperNormalisation Goo buildings, suspicious BNWN/Mizzie News screen, presentation gestures, a MIB tower orb/eye, curious surveillance prop. Source camera may look at the speaker → the indicated Card → back to speaker; can make mistaken/conflicting narrative interpretations.

**Flying Eye**: patrol tiny corridor, float near a billboard, watch a Card/lootbox, briefly follow the player, flee if hit, emote X if actually disabled, respond to real Goo/cure owner. No arbitrary all-seeing world-state inference or per-frame LLM. Friendly, incompetent, helpful and hostile modes can coexist across actual character profiles; red pupil is an authored caution cue, not automatic proof of moral hostility.

**Audio**: reuse single KFB `VOICE / WORLD_SFX / LOCAL_AMBIENCE / DIEGETIC_MUSIC` sound owner and existing Travel/FX timing donors. Small rotor/servo/soft scan/surprise/beep cues; no second AudioContext. Dialogue/eye movement follows source event beats and muted alternatives; accessible captions/reduced motion/no strobe.

## 6. Smallest actual proof, acceptance tests NOT YET PERFORMED
**P0 source/material gate**: Original Kenney `camera_exclusive.glb` shown unmodified in 3D **isolation** (front, side, lens region, material/pivot dimensions, license and source revision); original Poly propeller separately with measured hub and motor. Optional Dave404 VR Drone separate isolated source object. A loaded URL alone is NOT donor appearance evidence.
**P1 host gate**: One accepted CCTV source shell + *existing* EyeRig-v6 attached to its actual measured lens opening. Verify pan, tilt with real bounds, local eye gaze, blinks, head/host/source transforms, moving target and return-to-neutral, source recognizable. No second eye state writer.
**P1 drone gate**: One canonical eye host with actual source propeller. Hover/bob, yaw, rotor spin, pupil follow on one moving point, neutral → R26 alert → normal and one R27 expression *only if that variant is already proven by its own source owner*. Verify clear animation and foot/ground/prop collision with existing World.
**P1 event gate**: One authored ChatterBox gesture cue in a tiny source-owned scenelet and one local World surveil/scan beat, each tied to actual target IDs; no NPC or World AI rewrite. On the Globe/Town no forced HUD or cutscene.
**P2 deferred**: wing-flap physics, flocking/swarm, no-camera-to-eye visual mutation, full Combat follow/chase, generative news, multiple active drone patrols.
**Visual proof to collect in receiving slice**: isolated object screenshots, frame-by-frame 3–4 second source animation, stable source/rig revisions, mobile and desktop frame timing, reduced-motion alt, disposal/reload, current owner CI/test counts. No acceptance claimed in R28.

## 7. Constraints and source-status
**Verified GitHub sources**: EyeRig v6 and R26/R27; CCTV original Kenney camera through Cologne Race Option C-2 `buildCCTV` + donor-isolation.html + NOT-PUBLISHED Return; Poly propeller source registry and `drive-mods.v1.js` existing geometric rotor donor; R4 World freeze / One Audio owner. **Verified Dropbox files**: actual Dave404 `VR DRONE` GLB and Poly source GLB, metadata only. No Dropbox files copied/shared or reuploaded.

**Not yet verified**: active MIB Tower Orb scene's exact current mesh/owner, current live Skydome eye feature branch, visible source CCTV shape in this session, Dave404 model suitability, face-host monocular adaptation, actual propeller+eye rendering, source attribution/use license, current WB2 World consumer. R28 source/file readbacks are documentation tests only.

**Actual tests:** 0 runtime, 0 browser, 0 player, 0 3D isolation, 0 audio/animation, 0 published Site/Stage. No code changes, new assets, new project URL, KFB Hub/router/central SSOT, Live promotion or automatic merge. World R4 remains NO MVP until its named acceptance owner proves otherwise.

## Exactly one next gate
**Georg/WS0 editorial intake:** accept **two shared EyeRig surveillance hosts (source-backed Kenney CCTV + preferred top-propeller Flying Eye) as the R28 MVP visual direction**, then authorize the existing ToolBox EyeRig/Prop+World owner to perform **one isolated source-object comparison of the real Kenney CCTV camera and the Poly propeller** before any integrated host or drone world gameplay.
