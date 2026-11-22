# KFB Game Loop R26 · Shared EyeRig / Aggro + Goo Healing / Skydome Eyes
2026-11-01 · GEORG CREATIVE STEERING / COMMENTED DESIGN · **CONCEPT ONLY / NO NEW EYE RUNTIME**

**Owning concept slice:** existing KFB_HUB `30_DECISIONS/replies` on Draft PR #460, branch `planning/kfb-game-loop-fluff-economy-r2-2026-10-29`. Receiving owners: **canonical ToolBox 3D EyeRig v6**, existing 2D/3D semantic eye protocol and EyeRig look/overlay owner, Resident Life/Combat aggro, Dark Fluffer infection/heal owner, Sky/World presentation and Audio. **No second eye geometry/animation system or independent Skydome eye controller.** Georg/WS0 approves the design; receiving owners prove visuals separately.

## 1 · Core visual grammar
Use the **same canonical EyeRig architecture** for residents, Mannequin Medium/Large, monsters/enemies, Dark Fluffers and the separately progressing giant **Black Fluff Cartoon Eyes** in the Skydome.

- **NORMAL / HEALED:** existing near-white cartoon eyeball + near-black pupil, existing lid/gaze/blink/gloss, optional character-specific happy/angry brows.
- **CORRUPTED / GOO-AFFECTED:** dark/black **eyeball (sclera)** and red pupil with a restrained dim glow even during passive observation if the actual Goo state warrants this look; retain exactly the original eye geometry, gaze/kinetics/blink.
- **ACTIVE THREAT / AGGRO:** red pupil becomes visibly luminous, target gaze may focus and lids may change, while the **Combat/Resident owner** has already confirmed hostile intent or target acquisition. Eye visuals never decide aggro.
- **CURED / RECOVERED:** on a confirmed infection/heal transition, fade or switch back to white eyeball / black pupil and remove the corruption-specific glow; existing owner also removes Goo-spitting/infection behavior and resolves the game state. **A cured NPC may still be annoyed, refuse or behave autonomously**; healing is not a forced ideological conversion.
- **SKYDOME:** consume exactly the same eye appearance/gaze/animation semantics in another host scale/anchor; eye behavior and material semantics are common, only sky placement/gaze target, LOD and renderer presentation differ. Red sky pupils can signify an uncanny/possibly threatening glance, but **must not imply a globally omniscient simulation or spawn combat by default**.

A helpful rule: black eyeball is primarily a **Goo/visual corruption look**; bright red pupil is a **high-salience active threat cue**. A noninfected hostile NPC can optionally receive an active-threat accent under source-owned Combat rules, but **do not automatically imply Goo infection from mere hostility**. If black-eye/red-pupil is used as a universal gameplay warning, WS0 must decide whether a separate look cue distinguishes true Goo infection from unrelated aggression. The current recommendation keeps **infection vs aggro separate internally** and modulates red emission, not treating all angry people as infected.

## 2 · Existing actual source facts, not invented capabilities
**EyeRig-v6 donor**: `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js` (checked blob `853bcf5fb090dd6564fda8bc83d0b4cb527e6b26`). Its current `build()` creates **separate eyeball Mesh** with `MeshPhysicalMaterial.color=0xf3ede2`, **separate pupil Mesh** with `color=0x070707`, independent upper/lower lids, and per-eye nested groups. Both eyes follow the same actual EyeRig implementation. Its eye mesh descendants have `userData.petOverlay=true`, useful for owner-side separation from character surface materials; **this does not itself prove immunity to every fullscreen postprocess**. `eyeFrame()` exposes an eye-relative anchoring seam.

**Public EyeRig protocol**: `tools/2D Animation Studio/shared/eye-rig/eye-rig-protocol.v1.json`, schema `kfb.eye-rig.protocol/1`, covers `eyeFrame`, gaze `setGazeFollow`/`pointTo`, `applyEmote`, blink, kinetics, life and update. It includes **no documented `setCorruption`, `setEyeMaterial` or emissive red-pupil style**. `applyEmote({pupil:'normal'|'wide'})` is not a color state. **Do not invent current public API success**.

**Previous WS0 Goo design**:
- `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/BACKLOG_BLACKFLUFF_INFECTION_R1.md` on base branch (V-665, 22 Oct) explicitly proposes black eyeballs and glowing red pupils through **`eye-goo v1.1` overlay on every EyeRig-v6 face** (V-664). Infection, attacks, healing and short player control-loss later; backlog explicitly **NOT MVP / NOT BUILT**. Its prose mentions some pre-existing `eye-goo` donor, but **no exact source path/verified implementation was discovered in this source read**. SOURCE_REQUIRED: do not claim a built live overlay merely from backlog.
- `BRIEF_WS1_DARK_FLUFFER_R1.md` (21 Oct) says **heal rather than kill**: cured Fluffer gets white Cartoon eyes, stops spewing censorship Goo and drops colorful Fluff using **only the existing six Fluff types**. Multiple competing origin stories remain rumor, not canon. Reuse this established behavior contract; do not introduce a seventh resource or a replacement infection engine.
- Resident Life owns affect/reaction, Combat/MobBrain/Gunfight owns hostility/targeting/damage, Goo/Heal owner owns corruption and treatment state. EyeRig **only presents** actor/sky state.

## 3 · State wiring without another writer
Conceptual *consumer mapping*, not a new global schema:
`(GooState?, CombatAggroState, ActualHealReceipt) → selected shared EyeAppearance → canonical EyeRig-v6 material/overlay controls → World / Skydome viewer`.

**Threat activation should be meaningful and stable**, not a noisy single-distance threshold:
- Existing actor combat state may consider actual target acquisition, path/visibility, attack readiness/intent and cooldown; distance alone must not force enemies into permanent bright-red eyes.
- Use separate **entry/exit hysteresis and brief hold** in the owning aggro FSM to avoid flickering at boundaries. Exact numbers unknown until consumer tests; do not hardcode universal thresholds here.
- An attack/aggro state should produce one **visual reaction pulse**, **not a duplicate gameplay attack trigger from the pupil shader**.
- Infection state can remain active after an immediate attack ended; eye look may stay black/dim red, while full glow follows active aggression. On actual cure, Goo influence clears and normal eye colors restore. A different non-Goo Combat threat may remain hostile under an appropriate separate cue.
- Reuse the actor `eyeFrame()`, current point-to/gaze/blink/kinetics timing. On mesh rebuild (EyeRig `gen` increments), appearance owner must reapply the semantic look idempotently. Do not write brittle `eye.children[0]` indices from the gameplay owner.

## 4 · The leanest technical route under the existing EyeRig owner
**Preferred: existing `eye-goo v1.1` overlay if source provenance verified**, or a **thin owner-controlled appearance/material variant in EyeRig v6** if the donor is absent/unfit. Leave native geometry/animation intact. For each EyeRig, prepare a very small finite **look palette**:
- `normal`: off-white + near-black, no emissive red;
- `goo_idle`: dark-black eyeball + dim crimson pupil;
- `goo_aggro`: dark-black eyeball + bright-red/emissive pupil;
- `cure_transition`: short reversible/accessible recovery to normal.
These identifiers are **proposal names**, not current exported API. Existing EyeRig material currently supports separate eyeball and pupil colors; a narrowly defined `setAppearance/look` seam would be a later source owner modification, not a new rig/protocol version until acceptance. Do not add a public method to protocol/main branch in this concept slice.

**Material/render details for future proof:** separate material instances/pool per appearance variant; never mutate one globally shared material so every NPC changes at once. For red, prefer a low-cost emissive term or tiny anchored pupil halo that stays visible in day/night and moves with pupil; no full-screen bloom requirement. Eye whites and lid tones should remain KFB clay/cartoon recognisable; use shared eyes outside a HyperNorm body shader/material when possible. A *full-screen* post-effect still needs an explicit eye exclusion mask/second pass by the existing graphics owner; `petOverlay` on its own does not guarantee exclusion.

**Skydome adapter:** the canonical EyeRig build currently expects `ch.inner` and an actual head/body mesh to ray-fit its eye placement. A vast open sky **cannot instantiate that constructor unchanged without a compatible source/host anchor**. Reuse the **same eye geometry/appearance/blink/gaze math** through an owner-approved thin Sky anchor/scale adapter, or a source-approved EyeRig host, not a second independently authored eye stack. Gaze mapping must be projected from actual camera/player target in world/sky frame, no magic per-frame eye teleport. Sky palette state may be authored as ominous/cosmetic separate from combat aggro and must not force universal hostile targeting.

**Performance:** 1–3 R24 occupants per affected building remain Georg's cartoon target, not arbitrary global mob floods. Separate eyes and pupils increase draw costs; with few near active agents use original rigs first, test material sharing and true device metrics before optimizing. Distant Sky eyes may need LOD/phase update at their own owner; do not make massive red-pupil bloom or EyeRig instancing an onboarding dependency.

## 5 · Small demonstration / acceptance gate, proposed only
One **unchanged EyeRig-v6 resident or verified Mannequin Medium donor** visually shown in isolation first. Show actual baseline native eye geometry/color and its gaze/blink. In the **same camera/lighting/rig** show:
1. `normal` (white/black);
2. `goo_idle` (black/dim-red);
3. `goo_aggro` (black/bright-red) following a **synthetic but explicitly labeled owner-authored aggro state**;
4. `cure` → correct restoration of native EyeRig white/black with no material leakage, no rebuild/disposing regression.

Then, **only if the current Skydome eye feature source and owner are located**, show those same looks in a **separate isolated** sky-host proof, with eye geometry/gaze behavior demonstrably from the canonical donor. Require real source object renders/screenshots and clip animation, not a loaded URL. Verify the existing Goo/Heal receipt and actual Combat target state source before any claim of integrated World gameplay. Do not substitute fresh generic emoji/sprite eyes for the real EyeRig.

**Actual R26 evidence:** GitHub source docs and exact file readbacks only. No live EyeRig modification, source-object screenshot, Skydome proof, eye-goo source file verification, Combat integration, model render or browser/gameplay test. 0 runtime tests; 0 browser; 0 playtests; 0 visual donor isolation. No Stage/Site/Live, PR merge, new canonical feature owner or central Hub/SSOT update. World R4 remains NO MVP. R9–R11 historical local-only drafts not on this branch.

**Exactly one next gate:** **Georg/WS0 approves a shared canonical EyeRig-v6 normal/goo/aggro/healed appearance contract for Residents and Sky**, then source-isolate the original EyeRig and locate the existing `eye-goo v1.1` implementation before a narrowly authorized receiver-owner visual fixture. Keep healing and combat state independent.
