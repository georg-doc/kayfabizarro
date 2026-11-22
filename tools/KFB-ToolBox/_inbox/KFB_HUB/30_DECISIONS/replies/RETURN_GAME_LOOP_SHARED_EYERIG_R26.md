# RETURN · R26 Shared EyeRig / Black Fluff Aggro / Cure / Skydome
2026-11-01 · SOURCE-AUDITED DESIGN HANDOFF · NO RUNTIME CHANGE

**Repo:** georg-doc/kayfabizarro
**Branch:** planning/kfb-game-loop-fluff-economy-r2-2026-10-29
**Draft PR:** #460, target docs/kfb-decisions-register-2026-10-11, no merge
**Concept owner:** existing KFB_HUB / 30_DECISIONS/replies; Georg/WS0 human editorial gate
**Receiving owners:** existing ToolBox EyeRig v6, visual Eye-Goo layer, Black Fluffer Goo/Heal, Resident Life/Affect, Combat MobBrain/Gunfight, existing Sky/World. No new runtime/state owner.
**Concept checkpoint:** df309c3ca093d81cd3b54438df3a6c447912472a
**Changelog checkpoint:** 0f96cd1cdda766ce6e49fb1483fe2b7c6260d650
Final exact GitHub head read back after this Return write.

## Output and source findings
- New `GAME_LOOP_SHARED_EYERIG_AGGRO_HEAL_SKYDOME_R26.md`: user-requested canonical white-eyed normal and black-eyed/red-pupil Goo/active-threat visual grammar, shared across Residents, Mannequins, Monsters and Skydome eye motif. Internal infection, aggression and cure remain independent state concepts with the existing respective owners; EyeRig never triggers aggro or heals entities.
- Appended R26 entry to `GAME_LOOP_FLUFF_ECONOMY_CHANGELOG.md` without altering R2–R8 and R12–R25. R9–R11 are older local-only drafts.
- This Return.

GitHub source truth: canonical `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js` at blob `853bcf5fb090dd6564fda8bc83d0b4cb527e6b26` already creates separate MeshPhysicalMaterial eyeball (#f3ede2) and pupil (#070707) meshes, lids and gaze/blink controls, `eyeFrame()` anchor and `petOverlay`. Renderer-neutral `kfb.eye-rig.protocol/1` provides gaze/emote/blink/kinetics/life semantics **but NO current eye color/emission state API**. Proposed normal / goo idle / goo aggro / cure looks are NOT current exported code.

WS0 source `BACKLOG_BLACKFLUFF_INFECTION_R1.md` of 2026-10-22 explicitly points to an `eye-goo v1.1` attachment on EyeRig v6, black eye/red pupil and infection as NOT-MVP backlog; the exact actual overlay file and live integration were NOT verified. `BRIEF_WS1_DARK_FLUFFER_R1.md` requires cure to white cartoon eyes, stop Goo spitting and colored drops from the existing six Fluff families. Preserve the existing Black-Fluffer gameplay owner and avoid a seventh resource.

**Sky integration detail:** same eye appearance/gaze semantics and look, but the EyeRig v6 build assumes a host body/head mesh to ray-fit. A thin existing-owner Sky anchor must provide an appropriate host and gaze coordinates; don't assert an unchanged EyeRig can mount on the giant skydome without adaptation. Glowing red sky eyes are not themselves proof of live combat hostility.

## Actual tests / unresolved
Source files and documentation read directly from GitHub; exact R26 doc and changelog GitHub readback verified; Return readback follows. Runtime tests **0**, browser tests **0**, playtests **0**, original eye object isolation screenshots **0**, sky source visual test **0**, Goo/Combat integration tests **0**. No source GLB/textures/shaders or public site/Stage/Live, no Hub/router/global SSOT or World R4 status change, no merge.

Open: exact eye-goo v1.1 source pin; owner-controlled appearance API or overlay reuse; aggro-state hysteresis threshold under Combat owner; eye color emission/bloom and mobile performance proof; Sky's current feature branch/host proof.

## One next gate
**Georg/WS0 accepts a single canonical EyeRig look contract for normal, Goo, active aggro and healing across NPCs and Skydome.** The existing EyeRig/Black-Fluffer receiving owner then locates the real eye-goo file and performs one source-isolated white→black/red→cured-white visual proof before runtime integration.
