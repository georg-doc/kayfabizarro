# KFB World Lighting × Color Cohesion — Research Audit R1
Date: 2026-10-15
Status: RESEARCH + EXISTING-OWNER INTAKE · NOT IMPLEMENTED · NO R5/World runtime authorization
Owner: existing Travel/World environment presentation owner (consumed by WB2/ToolBox/Town/Story scenes)
Repository: georg-doc/kayfabizarro
Research branch: research/kfb-world-lighting-color-cohesion-r1-2026-10-15
Purpose: reconcile real KFB donors and free external resources before any lighting or color implementation.

## 1. Finding: we already own pieces; end-to-end look calibration is absent
The foundational document `skills/chat/masterplan/WORLD_COLOR_LIGHTING_COHESION_TBD_2026-09-15.md` correctly identifies the principal gap: heterogeneous source families do not become visually consistent simply by sharing a DirectionalLight. Its *one World Light Rig, small per-asset calibration, local light sources, character reference palette, mood presets, color grading last* direction stays authoritative. No verified cross-pack look stage is recorded there.

**Concrete existing source owners/donors (source existence ≠ integrated visual acceptance):**
1. **Travel / TinySkies atmosphere + day cycle.** `georg-doc/KFB-Travel-Globe` is Travel implementation SSOT; mirror `travel/wip/travel_globe_wsa/globe-v13/` contains `sky-presets.js`, `day-night.js`, `pet-lighting.js`, `light-budget.js`, `sun-shadow.js`, `weltstimmungen.js`. `day-night.js` is explicitly the ONE writer of lights/fog/sky with day/evening/night plateaus, bounded weather/mood weights. `pet-lighting.js` registers assets for sky-derived PMREM, subtle Story Tint and fill FOLLOW, not an eighth private sun. An important source limitation: historical terrain/ocean colors can be baked into geometry and may not match dynamically changing daylight.
2. **SKY3 isolated lab.** `tools/KFB-ToolBox/_inbox/KFB Skydome Gates SKY3/KFB_SKYDOME_SKY3_SESSION_CUT_2026-10-01_r1/`, especially `docs/MODULE.md`, `lab-sky/env-host.v3.js`, `spindle-sky.v5.js`, `cloud-family.v3.js`. `EnvironmentHost` explicitly owns single scene/renderer/light/time/weather/fog/shell state; shells are TinySkies gradient, Travel dome, Card Spindle. Supports clear/rain, day/evening/night/auto, four hue moods, night/day FX weights. Card Spindle uses actual six-card lineage. Jarlan Perez cloud GLB blob `acd9d653f31f249d0bcf11a8b6311594a9d6e153` is source donor, not Golden; untouched donor must be visibly isolated before recombination. SKY3 lab preview data ≠ four-island consumer acceptance.
3. **Current shared environment WIP SSOT.** `tools/KFB-ToolBox/docs/KFB_SKYDOME_ENVIRONMENT_SSOT_WIP.md` lives on `work/clay-style-ssot-2026-10-01` (not presumed merged on main). Binding rule: ONE EnvironmentHost, ONE opaque shell, ONE time/weather/light stack; three shell families are alternatives, never stacked. E0–E4 are donor isolation, shell isolation, spindle and cloud source comparison, lifecycle/performance, receiving scene. Do not use a reserved Stage route as publication evidence.
4. **ENV-PREVIEW-01 / PR #218**, branch `chatgpt-web/env-preview-01-2026-09-25`, OPEN DRAFT, unmerged, source head `88c64c29075f31d655f4777437bb1aa82069df17`. Historical evidence: owner checks 30/30, original consumer browser 15/15, Stage browser 9/9; Georg `PASS_WITH_TUNE`. This is a *real accepted presentation comparison surface*, not a new environment owner; night readability and shadow edges are TUNE items. Historical exact public route `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/environment-preview-01/` is NOT reverified in this research pass.
5. **WB1-P1 environment profile / PR #177**, branch `chatgpt-web/world-builder-p1-environment-profile-2026-09-23`, OPEN DRAFT, unmerged, source head `6cbe54f343a8b7fb07f1b6b9fe4e8a6e52bf509b`. Actual source-first KayKit torch + dusk `FogExp2`, nearest six-light pool, physical falloff, reversible `MaterialProfileRef`. Historical 8/8 repository tests + 4/4 syntax + public browser proof + Georg scope PASS. **Explicit existing caveat: demo's primary light placement and torch staging are NOT final production lighting canon.**
6. **Race-local environment recipes.** `kfb-hub/stunt-race/track-environment-lab/environment-recipes.json` has `facility` and `surreal` recipes with sunDirection, sky top/horizon, cloud, light, ambient, groundLight, fog and seed. Source-backed data-shape DONOR only; Race is not global lighting owner.
7. **Clay Golden, surfaces and shadows.** `tools/KFB-ToolBox/docs/KFB_CLAYMATION_STYLE_SSOT.md` + `KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md` and `LESSONS_SHADOWS.md` on `work/clay-style-ssot-2026-10-01`. K1/H0 v8 is *visual Golden*, K2/v10 only technical baseline with parity gate. Never replace with default KayKit materials or generic flat colors. K1 KayKit building_A fixed camera 6 m / 30° / K1 light; see Golden matrix for exact profiles. `LESSONS_SHADOWS.md` specifies fitted texel-snapped PCFSoft shadow frusta and contact geometry/normals before biased post-process. **Do NOT promote prior cozy-lit suggestion of VSM:** later shared shadow lessons identify VSM contact leakage regression. Current issue #247 remains owner-consumer shadow acceptance gap.
8. **KayKit creator/source-author lighting example.** `tools/asset_registry/librarian/_handover/KAYKIT_REFERENCE_ATLAS_2026-09-15/KAYKIT_DEMO_SCENE_LEARNINGS.md` records source-author day, night and indoor/dungeon scene-light example intentions, plus Forest Nature + Medieval Village cross-pack composition. This evidence is source text, **not inspected real reference pixels** and not a drop-in KFB light rig. Recover official example files/screenshots and visually isolate before adoption.
9. **Cozy research & Meshy.** `tools/KFB-ToolBox/_handover/ELISA_PRIORITY_STAGE_BUILDER_2026-09-15/RESEARCH_COZY_LOOK_ITHAPPY_FLYBRAIN_2026-09-15.md` proposes `cozy-lit`: rough matte material, warm key/cool ambient, limited contact AO, gentle fog, soft tonal ramps, modest grading. Original outside workflow was Gemini 2D watercolor → Meshy 3D → Blender → Unity; KFB proposal is **presentation layer on already-owned source geometry**, not adoption of the Meshy asset pipeline. Actual Meshy outputs must be registered with provenance/UV/normal/material/baked-light audit before any cross-pack comparison.
10. **Card/biome and WorldContext.** `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md` maps real authored deck/card semantics to `WORLD_RECIPE` / `BIOME_PROFILE`, preserving Card PDF over text-prompt guesses. `travel/travel-v16/terrain-v16/world-context.js` already derives a deterministic eight-dimensional CardSemanticVector, six D6 StoryModes and same palette for terrain/skydome. Reuse *contracts/determinism* and reconcile real current WB2 recipe ownership; do not independently clone legacy Terrain. `skills/chat/recovery/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md` is the story source of Town/Dystopia/Utopia/Protopia.

## 2. Where the user-facing look is currently incomplete
| Seam | Known source | Gap / proposed small comparison |
| --- | --- | --- |
| Shared sun + color temperature + exposure | Travel `day-night` / `sky-presets` | Measured same-camera cross-pack albedo/light response, one writer and exposure lock |
| Sky / horizon / ambient response | SKY3 EnvironmentHost, Travel PMREM, TinySkies gradient | Distinguish visible sky wallpaper from the HDR/PMREM that ACTUALLY lights materials; sync horizon, fog and env illumination; avoid duplicate shell |
| Clay/matte material | K1/H0 v8, K2/v10 | Hold Golden parity at day, dusk, night, including microdetail, eye and teeth colors, no plastic highlights |
| Buildings, Meshy and KKit actors | KayKit/Kenney/Quaternius/KFB donors, Registry | Material/texture/color-space/normal/roughness/emissive inventory, preserve identity and geometry |
| Contact shadows / AO | `LESSONS_SHADOWS.md`, issue #247 | Same shadow recipe across house/actor/terrain; no Peter-panning/bright seam at any mood |
| Biome + Card palette | WorldContext, Deck Card JSON, Joyride transition-atlas | Deterministic semantic `deckId + cardNumber + biomeId + seed`, not random per-frame RGB |
| Interiors & cinematic staging | WB1-P1 real torch pool, accepted ENV PREVIEW | Local motivated key/fill/practical lights as *additive signals* to global owner, not independent global rigs |
| Camera-dependent image | Travel camera owner, Hero/Story consumers | Fixed camera comparisons plus approved hero-shot camera; never let the lighting test replace gameplay camera |
| Performance | SKY3 0/4/12/24 cloud gates, renderer/light-budget | GPU timestamps/frame times, lights/shadow atlas/draw calls, PMREM bake costs, mobile target; no measured result yet |
| Four-world worldbuilding | Four-Island Story Recovery | Atmosphere serves lived history and social relation; not merely four color-filtered empty islands |

## 3. Color logic: semantic continuity without homogenization
**Protected hierarchy** (not a new schema authority):
`canonical Card PDF + Deck JSON identity → existing WORLD_RECIPE/BIOME_PROFILE → stable WorldContext palette / mood signals → current EnvironmentHost and receiving clay/material adapters → actual camera render`.
- Town: living historical hub; market, mine, material repairs, residences determine practical lighting; neutral/morning cozy is an illustration choice, not frozen canon.
- Utopia: persuasive polished public light with readable service/backstage contrast; avoid blanket sterile whiteness.
- Dystopia: anxious/crisis signage and local power-source lighting, but characters/cards must remain readable, not black silhouettes.
- Protopia: repaired, hand-built places with practical warm light, natural/cool ambient counterpoint; do not reduce theme to green tint.
- Surreal/Psychedelic: palette/horizon/sky/cloud response and selective motivated local emitters can expand hue contrast while keeping source Card/character legibility. Strong whole-scene chromatic shifts are **proposal-only** and tested after neutral parity.
- Story cinematics: narrative focal point controls optional motivated light and shot-specific exposure compensation under existing scene owner; do not create independent camera/renderer/light clock.

## 4. External donor shortlist (read source/license; none adopted)
The exact URLs, purpose, license state and use constraints are in `SOURCE_CANDIDATES.json`.
- **three.js Sky + PMREM / RoomEnvironment** — official code/documentation for sky and image-based lighting. Use as conceptual comparison/implementation helpers only if existing KFB module lacks the needed function.
- **Poly Haven** — CC0 high-dynamic-range outdoor/pure-sky illumination benchmarks (e.g. Kloppenheim overcast and Qwantani sunset). Download lower resolutions for testing; HDR/EXR is for real environment lighting; JPG wallpaper is mainly visual backdrop.
- **ambientCG** — CC0 HDRI environmental lighting; compare against Poly Haven, no automatic asset ingestion.
- **Kenney Skyboxes / Space** — CC0 stylized backgrounds, especially surreal sky graphics. These are SKY/BACKDROP donor candidates, **not automatically HDR illumination**.
- **pmndrs/drei Environment** and **drei-vanilla** — inspect color/light/shadow isolation patterns; React wrappers must not create new WebGL/runtime owners.
- **Godot Environment / ProceduralSky** — reference architecture and coherent sun→sky/ambient relationships, not direct port into Three.js.
- **Reddit community** — qualitative observations: warm/cool light balance, soft contact vs shadow contrast, not one automatic recipe; no community vote substitutes KFB fixed-camera A/B.

## 5. Known traps / contraindications
- Wallpaper JPEG by itself does **not** provide consistent physically lit clay surfaces. Need environment/IBL, directional key and correct color management. Avoid LDR as HDR source without acknowledging limitations.
- Sky/ambient + full-scene Story Tint + color grading may triple-shift hue; protect source colors, faces, Card art and emission.
- No duplicate Time-of-Day writer, global fog writer, sun, light loop, renderer or camera.
- Beware PMREM recapture every frame, texture color-space mislabeling, baking direct shadows twice into Meshy textures, excess real-time shadowed point lights, bloomy plastic appearance, overly uniform hemisphere flattening.
- Contrast between warm/cool can support form, but sky ambient should not erase low-frequency handmade clay relief. Grading is LAST.
- Do not invent a new `GRACEN` field or pipeline. Georg's phrase “Gracen-Daten” has no verified explicit matching canonical field in the searched default-branch sources; recover intended schema/source name before binding any field.
- Old KFB R4 is STOPPED, `F-R39 FAIL`, no Golden baseline. This research cannot silently build R5, overwrite WB2 or count as runtime acceptance.

## 6. Research / QA classification
Repository readback: 19 named KFB main/branch sources and two source-backed PR states sampled; NOT a complete line-by-line runtime audit of all engines or external models. External documentation/community sources are linked but not compiled into KFB, and their current runtime/license compatibility is untested. No screenshots were made here and no exact Stage URL opened; prior PR proof is historical.

Proposed next small integration-oriented evidence gate (only after current World story-visual gate permits a receiving scene): reuse accepted ENV-PREVIEW-01 or existing World/ToolBox host; isolate authentic donor assets; match the K1 fixed camera/light Golden; compare *neutral day, warm golden hour, narrative night* with a KayKit figure, KFB actor, building_A, Kenney/Quaternius/Meshy (where source-valid), tree, vehicle and real Card face. Change ONE relevant material/light signal at a time, capture same camera/exposure and diagnostics. Register each asset and source revision. No new runtime owner.
