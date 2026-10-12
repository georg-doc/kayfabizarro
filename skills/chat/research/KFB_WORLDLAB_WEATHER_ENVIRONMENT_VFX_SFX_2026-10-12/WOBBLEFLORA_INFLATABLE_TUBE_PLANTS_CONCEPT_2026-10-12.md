# KFB World Lab · Wobbleflora / Inflatable Tube Plants · concept note · 2026-10-12

**Status:** GEORG IDEA + BOUNDED IMPLEMENTATION PROPOSAL / DOCUMENTED ONLY. **Not built, not rendered, not human accepted, not adopted into the WorldBuilder runtime.**
**Corrected canonical product/authoring owner (Georg clarification, 2026-10-12):** **KFB Plant Prop Lab / Living Plants** (`skills/chat/workflows/PLANT_PROP_LAB_2026-09-18/START_HERE.md`), not an independent World Lab scenery/animation engine. This PR #389 is only the existing World Lab research *intake carrier*; any build is to be scoped in the existing Plant Prop Lab authoring lane. Downstream consumers stay existing WB2 placement and SKY3/Travel EnvironmentHost wind + KFB Audio beat + existing EyeRig v6/Resident face presentation; no second world, weather, audio, resident or render owner.
**Route:** existing research branch `research/kfb-worldlab-weather-environment-vfx-sfx-2026-10-12` · Draft PR #389, supplemental concept; not a source/licensing inventory addition, public route or formal Stage gate.

## 0A · Georg's explicit ownership clarification · KFB Plants = Plant Prop Lab

**Georg correction:** The earlier KFB Plants slice already contains living, potted, expressive plants and EyeRig eyes. Wobbleflora must be treated as a **new procedural plant form and motion preset within the established KFB Plant Prop Lab / Living Plants family**, not as a separate world animation system, standalone Resident/Character, or unrelated inflatable decoration. Preserve source, shared rig, PlantRecipe, biome palette and EyeRig identity.

### Verified current GitHub source (checked 2026-10-12)
- `skills/chat/workflows/PLANT_PROP_LAB_2026-09-18/START_HERE.md` — project SSOT, PLANT-0..4, existing plant, pot and living overlay ownership; no consumer world/Resident ownership.
- `skills/chat/workflows/PLANT_PROP_LAB_2026-09-18/MENTAL_MODEL.md` — PlantRecipe, roots/pivots, `eyeAnchor`, scale classes TABLETOP/ROOM/GARDEN/LANDMARK/PROJECT_ISLAND, L0 STATIC–L5 CHARACTER proposal. An eyed plant is **not** automatically a Resident.
- `tools/KFB-ToolBox/_inbox/KFB_Plant_Prop_Lab_v1/KFB_Plant_Prop_Lab_v2_EXPORT_2026-09-19/KFB_Plant_Prop_Lab_v2/README.md` — **existing v2 source modules** `src/plant-recipe.js`, `src/plant-rig.js`, `src/plant-eyes.js`, `src/plant-pattern.js` with biome/palette roles. Historical S18/S19 handoff/evidence is not a fresh runtime test.
- `.../src/plant-rig.js` — inspected pivot rig with deterministic seed phases, springs, read-only wind input, per-pot `SquashWrap`, delayed crown motion, STATIC/AMBIENT/AWARE, **no world transform or collision ownership**.
- `.../src/plant-eyes.js` — inspected actual existing KFB EyeRig v6 adapter with authored/measured FaceHost and selectable `pot`, `crown`, `float`; **reuse this first**, not an EyeRig v5 donor or fresh fork. Isolated visual proof still needed for tubular surfaces.
- `.../docs/SPRINT_19_CARTOON_DEFORMER.md` — planned instanced `plant-deformer.js` additive shader deformation (real bend/bow, squash/stretch, leaf/tip follow-through) over existing prop rig. **CONTRACT BEFORE CODE / NOT IMPLEMENTED**. No mandatory bones: the prior '5–9 bone centerline' is just a fallback candidate if existing shader/rig cannot produce convincing tube buckling after actual isolation, not the default architecture.
- `.../docs/SPRINT_20_LIVING_PLANTS.md` — planned clip grammar `idle/breathe/wind/shake/interact/startle/wilt/perk`, layering and TinySkies/OMS visual stages. **CONTRACT BEFORE CODE / NOT IMPLEMENTED**.
- `.../docs/BACKLOG_PLANT_PROP.md` — existing P0 source-revision pinning and mixed-pot overlap audits; neither is magically cleared by this idea. Cactus/succulent pieces already exist, whereas some flower/fungus sources remain unverified/missing in audited packs.

### Additive implementation concept within Plant Lab (not adopted yet)
- `PlantRecipe` receives a *candidate* derived tube-body/branch shape source alongside original canonical plant/pot refs, with stable seed, biome palette and optional EyeRig face host. Preserve all original meshes and recipes. Existing PlantRecipe container assumptions must be checked before allowing a **potless ground-anchored variant**; do not make it a new world-anchor schema.
- Use **current `makePropRig()` and existing `plant-eyes` adapter** for stationary root, ambient spring and gaze/blink. For recognizable air-dancer inflation and upper-joint collapse, **test the already-specified S19 Plant Deformer path first**; only if source isolation fails justify skin/bones or another local deformation technique. The tube is an authored/derived plant geometry, *not* a copy of a Tiny Treats/Quaternius mesh that does not actually exist.
- Drive `wind` and `wilt/perk` as existing/pending plant performance semantics; a `pressure` envelope can modulate stiffness/shape without new physical pressure simulation. `music` and `group wave` are **read-only timing choreographies** of the same plant pose layer using the one KFB Audio clock and stable per-plant phase offsets, not a new mixer, clip runtime, second wind owner or Resident choreography owner.
- Distinguish `pot + plant` (S18 original) and `ground-rooted tube plant` (new candidate) with the same authoring identity. No fabricated normal/flower source or new biology canon. WorldBuilder R4/F-R39 remains STOPPED.
- **First conditional proof, only when separately authorized:** source-isolate a real current v2 plant with EyeRig and pivot motion, **then** one derived tube with the same rig in isolation; if geometry buckling needs S19, prove that one deformation seam first; show a deterministic 3-plant staggered La-Ola only after individual source/rig identity passes. Compare at phone distance and record actual frames/perf, not concept imagery.

**Disposition:** PLANT PROP LAB FAMILY EXTENSION / DESIGN INTENT RECORDED; implementation **NOT STARTED**. The World Lab research parent next gate `KFB WEATHER/SFX THREE-SCENARIO SOURCE-ISOLATION AUDIT` is unchanged and is not the Wobbleflora build gate.

## 1 · Georg's intent (preserved)
Place two or three colorful, tubular cactus-/plant-/creature-like inflatable figures in the middle/background of an island/biome. The figures may have two long waving arms, additional tendrils/outgrowths, and an optional pair of expressive KFB EyeRig cartoon eyes. Their inflated, bendy silhouettes rhythmically sway, fold, re-inflate and pop upright like the familiar advertising wind-driven tube dancers. Respond to ambient wind, local mood and existing music/beat; groups can make staggered waves or a stadium-style La-Ola. Colors, proportions, attitude and frequency should belong to each biome/island instead of being generic decoration.

**Working name only:** Wobbleflora. Not an approved branding or biological canon. **Presentation class:** placeable scenery/ambient actor, not a new NPC AI/locomotion owner; optional later encounter/performance hook is deferred.

## 2 · Lowest-cost technical approach

**Recommended MVP: animation illusion, not pneumatic/cloth simulation. Reuse existing Plant Prop Lab v2 pivot rig + EyeRig adapter first; S19's planned shader Deformer is the first bend/buckle candidate. Any explicit bones/centerline below are fallback design options, not an authorized replacement or proven necessity.**
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


## 7 · Georg 2026-10-12 art-direction supplement · pot and ground are equal, macro Crazy-Cat ceramics

**AUTHORITATIVE OWNER DETAIL:** [KFB Plant Prop Lab's Wobbleflora + Crazy-Cat pottery art-direction note](../../workflows/PLANT_PROP_LAB_2026-09-18/WOBBLEFLORA_CRAZY_CAT_POT_STYLE_DIRECTION_2026-10-12.md), added to **this same draft PR branch**. This document is only its cross-owner World Lab intake; resolve visual choices and native PlantRecipe/rig in the original KFB Plants owner.

- **Both potted and ground-rooted Wobbleflora are primary visual embodiments.** Oversized colored hand-painted pots are not mere supports; in Crazy-Cat scenes they can provide the main graphic mass. The same tube/cactus family can also stand directly on authored terrain or mix with normal potted plants in deterministic scene clusters. Existing `plant-recipe.js` currently builds pot containers; ground-rooted execution remains **NOT IMPLEMENTED** and needs the real receiving world placement owner.
- **Pot patterns:** enlarge and simplify current S19 register-based motifs rather than re-introducing a tile/micro-pattern generator. Preserve one dominant motif register, few glyph repeats, larger calm areas, bold existing contour/palette grammar. Candidate **3–5 hero repeats, 0–1 quiet companion** are LOOKDEV suggestions, *not changes to the S19 current 3–10/quiet limits or a tested source result*. Mexican-influenced folk/ceramic graphic rhythm and Crazy-Cat style are inspiration only, not direct reproduction of a specific pattern.
- **Native implementation order:** actual existing source pot/pattern + plant/eyes in isolation → macro-pot same-seed, same-camera A/B → a source-derived potted tube using current Plant Rig/EyeRig and only later verified S19 Deformer → ground-rooted compatibility → optional mixed three-plant La-Ola. Do not promote a synthetic conceptual image to proof of actual original design.
- **State:** documented/proposed, no new source asset, no 3D geometry or real browser visual acceptance, no runtime/new physics, no world R5, Stage/Site or Live. Parent World Lab weather/SFX next gate remains unchanged; the optional Plant Lab next gate is source-isolated macro pot A/B.
