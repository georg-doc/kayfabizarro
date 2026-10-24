# Claude Code / WSA intake — KFB Look Calibration, NOT new light engine
2026-10-15 · Status: RESEARCH HANDOFF · activation contingent on current World story/visual authority
Research source: `RESEARCH_AUDIT.md` + `SOURCE_CANDIDATES.json`
Target owner: existing Travel/World environment presentation owner and selected current ToolBox/World receiving scene.
Productive World R4 remains STOPPED / NO MVP; no R5, geometry or WB2 code authorization follows from this intake.

## A. Read-first recovery
1. `skills/chat/START_HERE.md`, `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`.
2. `skills/chat/masterplan/WORLD_COLOR_LIGHTING_COHESION_TBD_2026-09-15.md`.
3. `tools/KFB-ToolBox/docs/KFB_CLAYMATION_STYLE_SSOT.md`, `KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md`, `KFB_SKYDOME_ENVIRONMENT_SSOT_WIP.md`, `LESSONS_SHADOWS.md` on current source branch `work/clay-style-ssot-2026-10-01`.
4. SKY3 exact `docs/MODULE.md` and E0–E4; real Travel `day-night.js`, `sky-presets.js`, `pet-lighting.js` + current implementation SSOT `georg-doc/KFB-Travel-Globe`.
5. Existing ENV PREVIEW PR #218 (accepted with tune, UNMERGED), WB1-P1 PR #177 (source-isolated torch, NOT final light-staging canon), Race `environment-recipes.json` (data shape only), KayKit `KAYKIT_DEMO_SCENE_LEARNINGS.md`.
6. `DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md`, `travel/travel-v16/terrain-v16/world-context.js` (seeded legacy reference), `KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md` and current Four-Island A/B/FAIL gate.

## B. Roles / guard
- Owner: Travel/World EnvironmentHost is only writer of time, global ambient/hemisphere, sun, sky, fog and weather. Receiving world chooses recipe and mood signals. No new scene light loop.
- Camera: the existing gameplay/cinematic camera owner only. Calibration test positions are fixed observations, not a new game camera.
- Material: KFB Clay SSOT; preserve K1/H0 visual Golden and v10 parity policy. Source-asset calibration is reversible and small.
- Cards: authoritative PDF + Card JSON/Registry; no invented “Gracen” numeric field until schema provenance is verified.
- Builder/Integrator: existing owner-native Claude Code/WSA, after authorized receiving slice.
- Tester: independent source/visual/performance comparison against same assets/cameras.
- Critic: independent assessment of identity, scene composition, overexposure, night readability, contacts/texture quality.
- Production Guard: decides core vs quarantinable failures, no auto R5/Live.
- Only production writer: current receiving World/Travel integration owner (no research-branch runtime writes).
- STOP/Georg gate: Four-Island visual direction A/B/FAIL remains binding; visual look comparisons require real source images before promotion.

## C. Minimum fixed comparison set (8+ real artifacts)
A. exact original KayKit character and one existing KKit/Resident rig; B. FrizzleBob/current KFB clay actor; C. original KayKit `building_A` vs fixed K1 Golden; D. source-verified Kenney house/prop; E. actual Quaternius prop; F. authored vegetation/tree; G. original vehicle; H. actual dark and light Card face with real PDF crop. If a Meshy model with lawful provenance is available, add it as a distinct ninth asset; do NOT substitute unverified Meshy for source-verified families.
First show EACH original source object isolated; original source + known Golden + candidate same camera/scale/light. For buildings also compare the established 6m/30° K1 gate; no generic placeholder or custom replacement branding.

## D. Minimum 3 moods × 2 rendering treatments
Keep source and camera identical across each mode:
1. `day`: readable natural daylight, key+sky/IBL, calibrated matte clay, real contact.
2. `golden-hour`: warm directional key vs cooler ambient; source color retains identity, highlights not clipped.
3. `story-night`: global dusk/night, 1–2 motivated/local practical lamps (e.g. existing torch/UFO), face/card/eye readable.
For every state compare neutral source-owner behavior with a candidate `cozy-lit` layer. Only AFTER day/night passes, demonstrate one deliberate `surreal`/psychedelic accent controlled by the real Deck/World mood; do not create new palettes or extra sun rigs in the slice.
Control sun direction, exposure, sky ambient, PMREM origin, fog, color-space, roughness, shadow frustum, AO and grading separately. Grading runs last.

## E. Proposed data handoff — illustrative, NOT adopted schema
```text
Canonical Card (deckId, cardNumber) + existing WORLD_RECIPE
  → existing BIOME_PROFILE / WorldContext semantic palette + seed
  → named EnvironmentHost mood input (time, weather, sky shell, fog, light-response)
  → current clay material per-family calibration + existing local motivated-light pool
  → single receiving renderer + owned camera
```
Do not define a new `CardLightDirector` runtime, second Scene, per-asset sun, new Card ink logic or second WorldRecipe. Card imagery may inform palettes but source Card face itself stays ungraded/readable where required; preserve original asset color/roughness.

## F. Cheap staged evidence gates (not yet executed)
- **F0 provenance and isolation:** exact source objects and upstream repo/license/version; copied-source equality or hash; KayKit source-author Godot day/night/interior examples available? If not: `REFERENCE_UNINSPECTED`.
- **F1 neutral same-camera A/B:** Day + Golden Hour + Night; K1 building, actor/eyes, real card, Kenney/Quaternius, vegetation; no bright seams, no floating contacts. Night actor/door/navigation/card legible.
- **F2 real sky–light consistency:** rotate/switch one shell at a time; verify sun/sky/fog/PMREM coherency and sane tinted-clay response; repeated switching/leak check; no second writer, no PMREM bake per frame.
- **F3 semantic color and story:** same seeded Card/Deck/biome yields reproducible palette+fog+sky+light; four existing story worlds remain distinct scenes with social anchors, not just color filters.
- **F4 performance and human result:** capture same-resolution before/after visible FPS frame time, shader/pipeline counts, shadow map, draw calls; mobile target where available, 0/4/12/24 clouds only if source-approved; human review on genuine chosen consumer/Stage, not synthetic diagnostic. Produce source-isolated screenshots, not just HTML state/loaded URLs.

## G. Research priorities / return fields
1. Confirm current `sky-presets/day-night` and SKY3 transitions are actually active in chosen receiving owner rather than lab-only.
2. Recover actual KayKit creator Godot day/night/indoor examples, screenshots and source author’s method; compare to existing KFB light rig, not blindly port it.
3. Audit exact existing ENV PREVIEW/PR #218 and WB1-P1/PR #177 donors in isolation; preserve scope PASS, open TUNE and no final lighting canon claim.
4. Choose just ONE small CC0 HDRI overcast and ONE sunset, and optional Kenney sky wallpaper; record resolution, encoding, color space, orientation, permission, exact file/hash and why HDRI vs backdrop.
5. Measure cross-asset brightness/material mismatch before compensating with scene grading; pin fixed renders, not anecdotal “cozy”.
6. Trace Card/biome palette provenance; `Gracen` or `GRACEN` has no confirmed field in main search, do not fabricate one.

Return: repo, owning branch/PR/head, source donor hashes, imported rights, camera/asset matrix, independent test counts, actual screenshots and revision if built, unresolved issues and EXACTLY ONE next gate. No automatic merge, Site/public deployment or Live claim; only use direct `kayfabizarro.pages.dev` when a current formal Stage gate specifically requires and is visibly verified.

## Exactly one next gate for this research slice
`OWNER-ACCEPTED_EXISTING-HOST_LOOK_CALIBRATION_INTAKE`: the current World/Travel integrator reconciles this source audit with the active Four-Island visual gate and picks the existing host and exact genuine objects for F0→F1. Do not activate World runtime work before the story gate permits it.
