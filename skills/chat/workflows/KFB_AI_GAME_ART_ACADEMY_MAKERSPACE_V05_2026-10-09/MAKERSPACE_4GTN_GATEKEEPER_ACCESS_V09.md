# KFB Maker Space · 4GTN Gatekeeper / Diegetic Access v0.9
**Date:** 2026-10-09 · PRODUCT/LORE + AUTHORING CONTRACT PROPOSAL ONLY · NOT AN IMPLEMENTED GATE, ECONOMY OR LOGIN SYSTEM
**Owner:** KFB AI Game Art Academy / Maker Space for Academy scene, character/narrative interaction and learning-facing permission grammar. **Receiving owners:** WorldBuilder WB2/WorldGraph/Thresholds/Flight; Resident Atlas/Rig_Large/ChatterBox; KFB Fluff/Crafting/Almanac owner for resource/wallet/recipes; God Mode/Player Save/authorization for persistent grants. None are replaced by Academy.
**Branch:** `planning/kfb-ai-game-art-academy-makerspace-v05-2026-10-09` in `georg-doc/kayfabizarro`.

## 0. User's diegetic objective
The Makerspace is a special/earnable **world zone** rather than a login form or ordinary dashboard. Author/God Mode holders may enter in the editor by their existing legitimate authority. Ordinary players may meet a source-backed guardian at a toll-like road checkpoint and receive a **certificate, key, access prop, resident gift, invitation or Fluff-crafted pass**, then cross the boundary. An energy-sphere-like **flight perimeter** expresses the same permission boundary: driving, walking, flight and portals must check **one shared grant**. An optional Hard-mode challenge or VIP presentation may alter how the pass is acquired; basic Academy/Feynman instruction must remain accessible through a non-grind learning route.

## 1. Actual 4GTN asset source recovered (NOT visually isolated here)
- `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/data/cast.js` on main, blob `ba8038f6e5b4305fe97baa4edaed82703c0b207b`.
- `residentId: 'gtn'`, name `4GTN`, status `candidate-only`; pack `KayKit Mystery Series 6 · Character 7 · January 2026 - 4GTN`.
- Real original normal model path: `media/3D_Assets/KayKit_Mystery_Series6/7 - January 2026 - 4GTN/4GTN.glb`.
- Real overgrown model: `media/3D_Assets/KayKit_Mystery_Series6/7 - January 2026 - 4GTN/4GTN_Forgotten.glb`. These are **two actual distinct geometries**, NOT material states; the moss/folliage is baked into the forgotten model. No automatic intermediate growth state.
- Source Katana: `media/3D_Assets/KayKit_Mystery_Series6/7 - January 2026 - 4GTN/gltf/4GTN_Katana.gltf`.
- **Rig_Large** on both. Atlas notes actual Rig_Medium pose collapses/ground penetration despite bindings; must not use wrong rig family.
- The atlas references `Melee_2H_Idle` for clean katana posture, `Idle_B` for forgotten; no native dormant/sleep/awaken/guard admit animation is proved. Initial visual proof may use source clip + ChatterBox/eye/gesture from existing owners; do not invent a complete duty animation.
- Do not assert that this candidate is already a working in-game resident, academy access guard or visually accepted NPC. Source model must be shown in isolation before adding checkpoint or sphere.

## 2. Exact other owner/source alignment
- Current Fluff planning branch `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`, last checked HEAD `2c5a1e547d510b075e1ab266610733a121b08d17`: 
  - `skills/chat/KFB_FLUFF_CRAFTING_ALMANAC_LAYER_CONCEPT_V0_3_2026-10-09.md` blob `950f11df2178045fb7351f0470b2441d8a24773e`;
  - `skills/chat/KFB_PLAY_CRAFT_LEARN_OPTIONAL_SURVIVAL_PROFILES_V0_4_2026-10-09.md` blob `de686cf04f47d5fe6008cd6316223851fbccb5c1`;
  - `skills/chat/KFB_FLUFF_CRAFTING_ALMANAC_LAYER_RETURN_2026-10-09.md` blob `8db0cf272eeff907041bbd0e9a80bef87538c4fe`.
- That owner explicitly chooses **CHILL & FUN / PULL DON'T GATE** default; Standard/Hard opt-in; Academy fundamentals are accessible even in Hard. Six source-backed D6 Story Modes × HIGH/LOW are **12 typed stackable materials**, not a new seventh color, and not historical derived `fluff` HP or POP. **One Wallet + one CraftRequest/recipe resolver**, no second Makerspace currency/transaction owner.
- Current Island Worldbuilder Lab R2.1 (on `sync/lab-rkit-2026-10-09` in the Fluff planning contract) lists harvest/Backpack/God Mode as post-MVP; don't widen Lab Drive Loop or stopped WB2 R4. Separate Lab and R4 owners are not conflated.
- Existing `skills/chat/recovery/KFB_ISLAND_MVP_FROZEN_MATRIX_2026-10-07.md` includes **F-S13 state-dependent Threshold Door**: locally ordinary pass-through before unlock, future portal/instance route when unlocked; derive the checkpoint semantics from existing World threshold/portal owner. This is not a ready Academy gate implementation.
- World architecture `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md` defines typed God Mode actions, WorldGraph/instances, PlayerSave and separated runtime/authoring/persistence.
- Resident ChatterBox/rig/audio and source-proven dialogue remain their existing owners, and the Player access grant must never depend on a stochastic LLM response.

## 3. Access architecture — one grant, multiple visual doors

The gatekeeper, toll station, energy sphere, portal, teleport/fast travel, flight and reconnect are **presentations of ONE deterministic World-owned AccessDecision**, not six distinct auth systems.

Illustrative semantics (NOT callable current APIs or adopted schemas):
`checkAccess(playerId,makerspaceWorldId,requestedAction,challengeProfile,grantRefs) -> {allow|deny, reasonCode, grantRef?, permittedEntryAnchor, grantVersion}`.
Enforce on the **authoritative world/instance route** at boundary crossing/spawn/portal and again on mutable Maker actions; client-side mesh/collider/particle changes must not be treated as security. An unprivileged player cannot fly above/under the boundary, enter from another portal, use an old invite token, or reconnect past the guardian to bypass access. If unauthorized, return player safely outside via the existing portal/last-safe-anchor logic and show a readable, nonpunitive reason. No permanently trapping/one-way zone.

Suggested minimal world state:
- `LOCKED_DISCOVERABLE`: roadcheckpoint visible, 4GTN dialogue + route to earn access, restricted flight volume; optional external lesson access remains available.
- `GRANT_AVAILABLE`: player has earned one recognized permission by encounter, authored tutorial, skill challenge, invitation, quest or valid craft request. A represented key/credential is a **visual token** backed by a grant (not mere 3D pickup mesh).
- `GRANTED`: one active grant authorizes entry via road, walking or unlocked flight/portal; avoids two permission stacks.
- `INSIDE`: world zone active, maker actions separately permission-scoped; authorize safe exit/return.
- `REVOKED_OR_EXPIRED`: only when product rules explicitly allow, recheck at next transition; never delete learner competence or personal saved artifacts as a side effect.

## 4. Suggested routes to access (proposal; preserve playful default)

**Author/God Mode:** existing authenticated privileged editor grant, no Fluff price, no fake universal VIP login bypass. Author mode may *preview* gate behavior under unprivileged simulated profile for testing.

**Player standard/chill:** optional short introduction from a source-backed NPC/tutorial; obtain a real credential by an encounter/first safe interaction, a crafted pass with modest D6 High/Low Fluff ingredients, or a valid invite. Multiple comparable routes, no grind or permanent lockout for beginner learners.

**Player Hard/challenge:** an optional meaningful alternate quest/resource alchemy/Resident trial may earn a special badge, visual variation, gate dialogue or cosmetic VIP presentation. It must not block the core Academy learning content or make skill E0-E5 and Feynman mastery purchasable. Same underlying permission semantics; higher challenge produces narrative provenance, not higher basic learning entitlement.

**Creator crafting:** a `CraftRequest` for a gate key is resolved by the existing Fluff/Crafting wallet owner. Consume materials and create persistent grant/provenance **once** only after validation, with idempotency on retry/reconnect; no separate Academy wallet. Key item in Backpack and grant record must reference same event/receipt. Card rewards remain canonical Almanac identity, not duplicated in Bag.

**Learning certificate:** separate a narrative “Workshop Invitation / Apprentice Pass / Guild Token” access prop from an actual pedagogical skill certificate. Access pass does **not** assert learner has demonstrated E3/E4/E5 competence. True mastery evidence is issued only by the Adaptive Learning Core after observed correct tool actions; badge/Key is play permission only.

## 5. Diegetic staging, character & flights

**World entrance:** one source-backed toll/checkpoint module at an actual road/track approach, with 4GTN Forgotten as preferred mascot and katana grounded to original model; a source-proven clay border/payment/display prop. No concrete booth prop claimed selected yet. Stage only after actual original model, checkpoint donor and road support isolation. Existing Track Core/World controls roads/arrival collision; God Mode cannot add a second road generator.

**World barrier:** an understated energy shell over Maker island that reads visibly from outside and supports walk/drive/flight modes (aesthetics may be soft/low-vibration/high-vibration thematic), but physically robust access enforcement is the **WorldGraph boundary/grant**, not a shader or infinite collision sphere. Avoid blocking legitimate air movement through unrelated parts of the map, false occlusion or whole-world GPU-intensive bloom.

**Story:** 4GTN's overgrown form embodies technical rigidity being reclaimed by organic life. Candidate dialogue: it may inspect the invitation, recognize curiosity, and reveal a route—without reciting generic compliance metrics. One short, source-authored conversation and physical action before adding chatter. Permission result is deterministic; dialogue/voice may vary in ChatterBox without altering entitlement.

**Dome:** after entry the workshop remains spatially open; skydome and energy sphere are different effects/owners: Sky/Material owner paints atmosphere, World threshold owner handles access and Flight owner responds to transitions. Do not introduce a second postprocessing/material graph.

**Accessibility:** entry is never solely dependent on perfect controller precision, voice/chat microphone, combat victory, high-end GPU, time-limited reaction or payment. Use interaction alternative (on foot, clear prompt) and an exit route; hard-mode optional.

## 6. Cheap proof and owners — NOT World implementation

**Current Academy one gate remains:** `ACADEMY_MAKERSPACE_VISUAL_SOURCE_PROOF_R1` (functional source isolation). Gatekeeper concept adds only **one optional character/threshold reference** to the visual study; it does NOT replace or expand required A/B/C, World R4 STOP or Fluff deferred gate `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT`.

First isolated visualization:
A. source original 4GTN Forgotten model and default 4GTN model separately, one actual Rig_Large idle each; screenshots with source commit/loader/renderer, scale/grounding; no fake overlay growth.
B. existing real KFB threshold/road/portal concept donor source independently (F-S13 is a requirement, not proof); inspect current actual implementation or mark SOURCE_REQUIRED.
C. one actual KFB Academy Drag/MediaSurface original functional proof still remains required by active Academy gate; the 4GTN mini-presentation should be a non-blocking overlay/companion, not another gate.
Only after original isolation may Claude Design create a single **PROPOSAL** storyboard: player arrives at 4GTN toll → shows pass / gets quest → gate reaction + sphere passes → safe return. Do not claim a playable access system.

## 7. Next responsibilities

**Academy Webchat:** persist this concept, asset ref and exact Fluff sibling source pins in existing Academy branch and Production Control. No write to Fluff planning branch or World runtime; sibling branch retains its own Return. 
**Claude Design (next preferred visual executor, not launched):** source-isolate actual 4GTN original pair and a current gate/threshold/road prop, then add one optional entrance concept frame AFTER functional original A/B/C proof. Only real source appearance; one rig family.
**Claude Code or ChatGPT Work (sequential technical fallback only):** when visual environment cannot test source-GLB/Rig_Large, threshold, owner authorization, export and safe route via actual existing renderer. No new API implemented in this planning slice.
**Receiving World/Fluff owners later:** formalize grant source, access persistence, difficulty/crafting grant issuance and flight crossing only after named executable gates; not now.
**Georg:** no setup needed now. Later choose short creative dialogue and actual product review, not before source proof.

**No automatic Stage/Live, new public Academy Site, World R5, merge or second runtime.**
