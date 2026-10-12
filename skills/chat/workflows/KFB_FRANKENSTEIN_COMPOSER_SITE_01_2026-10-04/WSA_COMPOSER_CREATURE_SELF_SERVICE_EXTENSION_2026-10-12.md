# WSA ONE_SHOT EXTENSION · Finish existing FrankenStein Composer + integrated Creature Self-Service
Date: 2026-10-12
Status: **PRODUCT STEERING / SITE-OWNER INTAKE, NOT IMPLEMENTED OR HUMAN-ACCEPTED**
Owner: KFB ToolBox / existing FrankenStein Composer; executor: **ONE ChatGPT Work / WSA Integrator**
Repo: georg-doc/kayfabizarro
Receiving branch: `planning/frankenstein-composer-gpt-site-2026-10-04` · Draft PR **#355**.
Donor-only research: Draft PR **#390**, branch `planning/kfb-creature-lab-01-rig-qa-2026-10-12`; consume its `START_HERE.md`, `TEST_MATRIX.json` and RETURN **read-only**. PR #390 is NOT a separate prerequisite executor, runtime, standalone app or second active product branch.

## Product outcome

Deliver one coherent existing **KFB FrankenStein Composer GPT Site** where Georg can (A) source-select, mount, pose, animate and round-trip proven KFB/KayKit actor compositions and (B) generate/mutate one simple **synthetic** SDF-derived fantastical creature using deterministic browser-local parameters and seed, pose it, check skinning quality and export/reload it — **zero LLM/Work inference per generated creature**. Preserve the accepted source identity and look of real donors. No new KFB app/Site/branding.

This extends the 2026-10-04 Composer ONE_SHOT, not a new parallel build; current authoring/motion/face/material/Asset Registry owners remain authoritative. Synthetic creatures are allowed **only** within the Creature mode and may never substitute missing source-fidelity donors (e.g., Eraser remains SOURCE_REQUIRED).

## Latest reconciliation requirement (before touching runtime)

As of 2026-10-12 GitHub Draft PR #355 head `38d489ff0436f4102640647184f97ff5d7564ffb` had **7 documentation/planning files and no checked-in current Composer frontend source**. Current `skills/chat/KFB_SITE_SURFACE_REGISTRY_2026-10-04.json` on main nevertheless says existing private GPT Site `https://kfb-frankenstein-composer.frizzlebob.chatgpt.site` is `SITE_DEPLOYED_PRIVATE_SOURCE_FIRST`: GothGirl, Black Knight, FrizzleBob v5 and Pencil source-isolation was checked; **COMPOSITE_MOTION_INTEGRATION_OPEN**. This is a registry-recorded state, NOT independent verification of that exact currently served revision in this chat.

**First WSA action:** access the existing authenticated GPT Site project; identify and export its *actual source and deployment revision* into the existing owner branch without overwriting working current Site artifacts. Compare with PR #355 and the current owner Return; prove exact original modules/source-isolated objects before modifying. If GPT Site project/source access is unavailable, report `EXISTING_SITE_SOURCE_UNAVAILABLE`, preserve everything and do NOT produce a lookalike replacement Site, parallel runtime or fake Live claim. Treat the historic 2026-10-04 Return's "Site not created" as superseded where contradicted by the 2026-10-12 registry; exact visible site behavior still needs inspection.

## Required WSA phases (internal checkpoints, not separate jobs)

### Phase 1 – Close existing Composer product seams FIRST (P0)
- Real GothGirl Rig_Medium + pinned FrizzleBob head/FaceHost/EyeRig/brows/clay lids composite in same genuine frontend; source object shown alone before integration.
- Real Black Knight Rig_Large path, rig family-specific compatible motion, no Medium/Large mix or fake substitute meshes.
- Pencil genuine PropActor source + working gaze/blink/brows/lids; Eraser disabled SOURCE_REQUIRED until authentic source exists.
- Pose/motion audition on the same actual composition; one skeleton mixer and current KFB face owner.
- Durable saved Actor Recipe, export/import, fresh/reload preserving IDs, transforms, rig family, animations, unknown data and face parameters. Test on existing actual Site source plus repository-native local proof.
- Preserve existing Site appearance/functionality; no simplification, generic UI shell or replacement branding.
**Gate 1:** measurable P0 composite, motion and round-trip passes. A source-isolation-only Site is not a completed Composer.

### Phase 2 – Native Creature mode inside same owner (P1, after Gate 1)
- Use `tools/KFB-ToolBox/_handover/CREATURE_LAB_01_2026-10-12/` from Draft PR #390 as verified **method/QA briefing** (not executable code, no completed tests).
- Implement reusable deterministic `seed + recipe → SDF/isovolume → welded mesh → minimal skin/rig → KFB semantic material role → pose QA → export` with browser-local JS/TS/WASM/Worker where viable; **no compulsory Blender, remote AI service, Claude/Work token, proprietary runtime or server job for each new variant**. An offline worker/build preparation step is acceptable for initial implementation, but user-facing `Generate/Mutate` must be local and self-service.
- One actual test species **CL01-A Fassbeiner** first, with controls for body/limb proportions, fixed-seed regeneration, 2–3 visible variants, functioning basic pose/rig and source-isolated visual evidence. Show generated geometry **before** rig and materials, because unlike licensed donor objects it is intentionally synthetic test geometry.
- Headless QA must inspect evaluated skinned mesh per pose/region for stretch/compression, normalized weights, topology and at least one deliberately bad leg-midline weight assignment that is correctly detected. Do NOT treat a single universal stretch threshold as proof of quality; use measured region thresholds and observable negative controls.
- Save recipe + version/seed/parameters + rig/material refs and export actual GLB; fresh browser reload/import reconstructs the same pose/appearance and predictable diagnostics. Retain all current Actor Recipe fields and existing tool ownership. Do not overwrite the existing `kfb.pets/1` schema to fit this experiment; add a scoped companion candidate when necessary.
- `Schleifenschwanz` and `Turmhals` are follow-on QA fixtures. Include only if the same core can generate/test them cheaply after CL01-A passes; they must NOT block the single-creator outcome or create a second authoring app.
- No baked GPT illustrations or static model swap masquerading as a live generator.
**Gate 2:** user can generate, mutate, pose and export a real novel mesh locally, and bad-weight QA catches the seeded defect.

### Phase 3 – Real Site integration and human acceptance
- Integrate into the existing authenticated Site without interrupting its core Composer capabilities. One source/owner, shared controls, no duplicate EyeRig, Surface renderer, rig mixer, export or Asset Librarian.
- Test actual desktop and mobile browser usability with representative states, reload/import and generated variant; record source/revision markers, errors, performance and screenshots.
- Current PR #355 expressly requires a *formal Cloudflare KFB-Hub review Stage* downstream: the direct `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/frankenstein-composer/` route must serve the same integrated revision and be linked from KFB Hub; only claim `PUBLIC_VERIFIED` after opening it and visibly confirming revision + expected behavior. GPT Site remains PRIMARY.
- No auto-merge, no Live promotion. Georg decides visual/functional human acceptance after genuine end-to-end proof.

## Independent execution / budget

Follow `skills/chat/KFB_INDEPENDENT_EXECUTION_GUARD_CONTRACT_2026-10-05.md`:
- Outcome: existing Composer completed plus one working self-service Creature mode.
- Builder/only writer: WSA Work Integrator for receiving PR #355.
- Tester: repository-native deterministic QA and actual browser/Site verification.
- Independent Critic: read-only proportional review of result and preserved source fidelity.
- Guard: sole authority to classify smallest failing seam and STOP/QUARANTINE.
- Human gate: Georg real integrated Actor + Creature UX/visual PASS/TUNE/FAIL on formal Stage.

After two non-improving repairs, quarantine optional creature subfeature or individual fixture and continue Composer P0. If the *core* cannot be delivered, preserve/return concrete blocker; do not endlessly rebuild a new editor. No inflated "all features" scope beyond these named seams.

## Existing contracts and latest source
Read current `skills/chat/START_HERE.md`, `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`, `tools/KFB-ToolBox/docs/CONTRACTS.md`, Composer `WSA_WORK_ONE_SHOT.md` and `RETURN.md`, PR #355, donor PR #390 and existing Site registry. This addendum supersedes older "Claude Code builds a separate Creature Lab before WSA" sequencing; it does not grant a second writer or authorize changing unrelated World/Resident/Motion projects.

## Return and ONE next gate

Persist implementation, actual evidence/tests and final Return as phase-boundary checkpoints on **one receiving PR #355**; after each write fetch exact branch head and intended files. Do not churn central Hub/router for planning status alone. Return changed files, actual tests, verified Site/Stage URLs and version, screenshots, open items and **one next gate**.

**NEXT GATE: WSA_RECOVER_EXISTING_COMPOSER_SITE_SOURCE_AND_CLOSE_P0_CORE**. After P0 proof, continue Phase 2 inside the same ONE_SHOT without asking Georg to manually start another job.
