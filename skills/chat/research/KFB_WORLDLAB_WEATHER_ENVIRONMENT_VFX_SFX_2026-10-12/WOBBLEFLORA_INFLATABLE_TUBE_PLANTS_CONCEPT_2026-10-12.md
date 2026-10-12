# KFB World Lab · Wobbleflora / Inflatable Tube Plants · concept note · 2026-10-12

**Status:** GEORG IDEA + BOUNDED IMPLEMENTATION PROPOSAL / DOCUMENTED ONLY. **Not built, not rendered, not human accepted, not adopted into the WorldBuilder runtime.**
**Owner:** existing KFB World Lab Environment/Scenery research; prospective runtime consumers are existing WB2 world-object/terrain-placement owner and SKY3/Travel EnvironmentHost (wind), KFB Audio (music/beat), optional EyeRig / Resident Performance for faces. No new world, weather, audio, resident or render owner.
**Route:** existing research branch `research/kfb-worldlab-weather-environment-vfx-sfx-2026-10-12` · Draft PR #389, supplemental concept; not a source/licensing inventory addition, public route or formal Stage gate.

## 1 · Georg's intent (preserved)
Place two or three colorful, tubular cactus-/plant-/creature-like inflatable figures in the middle/background of an island/biome. The figures may have two long waving arms, additional tendrils/outgrowths, and an optional pair of expressive KFB EyeRig cartoon eyes. Their inflated, bendy silhouettes rhythmically sway, fold, re-inflate and pop upright like the familiar advertising wind-driven tube dancers. Respond to ambient wind, local mood and existing music/beat; groups can make staggered waves or a stadium-style La-Ola. Colors, proportions, attitude and frequency should belong to each biome/island instead of being generic decoration.

**Working name only:** Wobbleflora. Not an approved branding or biological canon. **Presentation class:** placeable scenery/ambient actor, not a new NPC AI/locomotion owner; optional later encounter/performance hook is deferred.

## 2 · Lowest-cost technical approach

**Recommended MVP: animation illusion, not pneumatic/cloth simulation.**
- Geometry: one tapered, capped tube mesh with a bendable longitudinal 5–9-control-point/bone centerline; radial low-poly ring sections, smoothed silhouette, KFB Clay/material family. Base/ground contact remains locked to the authoritative terrain anchor. Arms are optional two smaller children with independently delayed spring response attached to body-local joints. Extras are configured branches, not separately simulated cloth.
- Pose: deterministic continuous phase + low-frequency drift + spring/damped follow-through. Drive lateral lean by an existing read-only wind vector/gust envelope, with greater deflection at the free end. Use a bounded curvature and delayed tip overshoot, not uniform whole-object rotation. Fake 'air pressure' via an authored scalar that raises/lowers the backbone: full inflation = erect/stiffer; pressure dip = upper sections buckle, then delayed recovery; keep base stable, clamp stretch/self-intersection. Pressure never changes physics/traversal truth.
- Timing: derive from one existing scene update/clock; per-instance stable seed, phase offset and biome parameters. Read beats/BPM or music intensity from the existing KFB Audio owner when available; do not parse audio in a second AudioContext. Wind and music can combine with weighted envelopes, yielding to stronger authored event cues. Valid silence/unavailable music falls back to ambient wind/idle.
- Choreography: `solo` (free-running offset), `pair` (call/response), `wave` (phase delay proportional to distance along the placed group, explicit order), `unison` (shared downbeat). A La-Ola should have clearly visible sequential crest and reset, not three copied identical motions. No hardcoded score or generic emote loop.
- Eyes: when requested, source-isolate current EyeRig v6 and attach in body-local space; consume presentation/kinetics only (head tilt, blink, gaze). Face follows the bending surface with offset and correct facing; no competing Affect/Resident AI owner. EyeRig v5 in `media/3D_Assets/build/pet-eye-rig.v5.js` is an inspected historical behavior donor (life/kinetics), not proof the present v6 drop-in adapter works.
- Materials: derive palette, scale, stem fullness and optional markings from selected biome/Clay style. Candidate examples (not canon): dusty cactus greens/ocre in arid islands; reed/aquatic tones near water; saturated festival pair where authored scene motivation exists. No material/style replacement, generic UI chrome or new branding.

**Rendering/LOD decision for later isolated proof:** prefer existing Three.js mesh/skin or current accepted deformation module; use CPU spring state + GPU skinning where compatible. A vertex-shader-only centerline deformation can be compared if source shows lower cost. No broad custom physics/softbody engine. Far distance: fewer segments / reduced update rate or a frozen silhouette. Instancing only if distinct motion and EyeRig attachment remain correct. Preserve disposal and frame-budget evidence.

## 3 · Suggested tiny isolated preview

**One self-contained source-isolated scene module, not a parallel WorldBuilder:** three source-derived Wobbleflora variants on one neutral ground anchor plane, separately showing the actual generated 3D tube shape in isolation first, then in the accepted KFB Clay setting. One 1-stem, one 2-arm, one asymmetric cactus/branch variant. Compare the same fixed camera/seed across:
1. IDLE: slow independent spring sway, eyes blink optionally.
2. WIND: directional bend + gust, tip delay; anchor doesn't slip.
3. MUSIC: existing read-only beat data, unison and offset; speech/mute does not break it.
4. LA-OLA: left-to-right sequential crest through three placed objects, then settle.
5. DEFLATE/REINFLATE: authored upper-body buckle and convincing recovery without clipping the terrain.

Control data (candidate adapter shape, not adopted schema): `{biomePalette, shapePreset, scale, armCount, anchorId, seed, windGain, springDamping, pressure, musicGain, groupId, groupOrder, phaseOffset, eyesEnabled}`. Read-only inputs `{sceneTime, windVector, gust, beatPhase, beatStrength, moodCue}`; output is transform/deformation/face presentation only. Only one existing animation/scene loop writes the placement pose. Keep input defaults stable and bounded.

## 4 · Evidence and acceptance for an authorized later build

- Actual source mesh/object isolated on neutral background before Clay/integrated scene; no generated screenshots substituted for implementation proof.
- A/B sequential contact sheet or 6–12s clip for wind, beat, LA-OLA and fold/recovery using fixed seeds, timestamped frames, no audible performance invented.
- Verify pinned terrain base, branch attachments, eye facing and silhouettes across camera near/far and phone-size framing.
- Verify dynamic toggles and absent-beat fallback, deterministic re-entry/fresh load if persistence is involved, pause/resume/dispose, stable silence, shared AudioContext only.
- Profile three simultaneous modules on the target mobile/browser: frame time, CPU updates, draw calls and mesh deformation/perf; record actual figures, don't claim preset budget PASS without measurement.

## 5 · Source/owner routing (checked 2026-10-12)

- `tools/img2threejs/docs/IDEATION_LIVING_TOY_WORLD_2026-09-19.md` — existing Living Toy response layers IDLE / MUSIC / IMPACT, group geometry concept; donor method only, no world-authority transfer.
- `media/3D_Assets/build/pet-eye-rig.v5.js` — inspected original EyeRig v5 life/kinetics idea; current EyeRig v6 to be source-isolated before reuse.
- `travel/KFB Travel Globe v13-1/docs/CHANGELOG_v12.md` — documented historical `ts-flora.js` vegetation wind by height and shared wind clock; inspect actual current code before adopting.
- `skills/chat/RESIDENT_PERFORMANCE_EVENT_CONTRACT_PREP_2026-10-06.md` — face/kinetics remain presentation consumers, not emotional or movement truth.
- This research owner's `RESEARCH.md`, `RETURN.md`, `CLAUDE_CODE_WSA_INTAKE_2026-10-12.md` — source-first gate and SKY3/Travel/Audio ownership.

## 6 · Guards / disposition

**NOT AUTHORIZED:** WorldBuilder R4 repair or R5 start; geometry insertion into Islands; any Live/public Stage/Site; a second sky/wind/audio/animation runtime; invented EyeRig integration results; changed `SOURCES.json` licensing counts. Four-Island story direction and current F-R39 FAIL / NO GOLDEN remain unchanged.

**Disposition:** KEEP AS OPTIONAL PROPOSAL in the World Lab scenery backlog, and include when a later existing-owner source-isolated ambient animation/design slice is explicitly scoped. This is **not** an additional blocking step for the existing weather/SFX research work.

**Single current parent-project gate unchanged:** `KFB WEATHER/SFX THREE-SCENARIO SOURCE-ISOLATION AUDIT`. Wobbleflora's proposed first *local* verification if individually authorized: show one truly deforming source-built tube in isolation, then the three-object synchronized wave.
