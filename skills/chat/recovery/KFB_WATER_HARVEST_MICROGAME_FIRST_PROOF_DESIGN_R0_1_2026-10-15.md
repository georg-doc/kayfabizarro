# KFB Water Harvest · first memorable Minigame / post-MVP concept R0.1

**2026-10-15 · DESIGN / SOURCE-INVENTORY ADDENDUM, NOT IMPLEMENTATION**  
**Owner:** KFB Island Worldbuilder Lab; authored on the existing recovery/intake branch `recovery/kfb-minigames-fluff-source-bridge-2026-10-15`.  
**Current Route:** [Fluff v0.3–v0.7.1 source recovery](./KFB_POSTMVP_MINIGAMES_FLUFF_SOURCE_RECOVERY_2026-10-15.md), Draft [PR #400](https://github.com/georg-doc/kayfabizarro/pull/400).  
**Scope:** one post-MVP design prototype choice, not a new runtime owner, MVP milestone, accepted world scene, Stage route or declaration that Claude Code has acknowledged the handoff.  
**Source truth:** original v0.6 fishing/farming and v0.7.1 blast-mining/living-loot still own the full ideation; this document is a *short focused receiver-ready illustration*. Updated Lab source/published playable state must still be inspected by Claude Code.

## 1 · Design thesis / world reason before interaction

**KFB is not a survival-game systems demo; the pond must be a place where people already have a reason to be.** One bounded accessible source-backed water location near a real environment/Resident scene, selected later by the actual Lab, supports at least two play styles:

- **Quiet Fishing:** a meditative WoW-style 1-tap cast, floating bobber, irregular bite, forgiving timed tap, short catch performance and a tactile reveal.
- **Cartoon Blast Fishing:** a source Clown toy-bomb *plops* into the water, pauses comedically, produces a carefully staged massive clay/soot/water ripple, and shoots a handful of strange fish / Fluff pellets / real props in organically irregular trajectories. Short bounces, micro-splashes, float / settle / retrieve.
- Both are optional and playable in **Chill & Fun**. The scenic delight stands on its own; neither method is a required route to a canonical Card nor permitted to be a deterministic high-efficiency grind machine.

**Georg's broader world intent:** Plants, objects, fish and rocks may wobble/react/speak with brief situation-aware KFB humor. A fake "dead" cross-eyed fish might insist on being a red herring; this does not require animal-realism, gore, generated filler or an NPC brain attached to every prop. Every visible object must come from an accepted source, or be an explicitly owner-approved generated/modified derivative — never pass a stock primitive off as an existing KayKit original.

## 2 · Source facts, confirmed directly 2026-10-15

| Capability | Exact current GitHub source | What it does **not** prove |
|---|---|---|
| Seven fishing motion clips | `registry/resources/v1/motions.jsonl` blob `1f266ab2e9e57db63f5596ba83f616872b502909` references `Fishing_Cast, Fishing_Idle, Fishing_Bite, Fishing_Tug, Fishing_Struggling, Fishing_Reeling, Fishing_Catch` from `media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_Tools.glb`. Registered actor refs include Driver and FrizzleBob graft. | No accepted fishing rod, exact hand socket, avatar-rig proof, bobber, correct actor/body pose, or fishing controller. |
| Source Clown bomb | `tools/resident_atlas_s6/data/cast.js` blob `5e918ae1521e63d121558fb7aff4fd1f8239baec` includes `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/assets/gltf/clown_bomb.gltf` twice as **promo-extra** | No throwable/equippable bomb, fuse/throw animation, approved water interaction or explosion. No real-world explosive instructions are part of the fiction. |
| 3D Farmer props for optional later farm connection | Same Atlas donor has `dirt_plot.gltf`, `carrot.gltf`, `lettuce.gltf`, Farmer_A/B work motions. | Not a farm loop or offline growth system. |
| Existing Clay explosion/smoke candidate bank | `tools/KFB-ToolBox/_inbox/KFB_VFX_01_REVIEW/RETURN_VFX_01.md`; distinct Brackeys, cartoon smoke, Tiny Swords strips, Kenney particles. | Not proven same-renderer World VFX, current KFB Clay pass, or water/splash shader. Source-isolate before reuse. |
| Historic radial ripple donor | `tools/KFB-ToolBox/_inbox/KFB StoryMap v1/sma1-map-animator.js`. | Not current Island Lab water shader or surface-impulse API. Existing World/Water/Material owner must own the accepted water response. |
| Actual receiver | Lab `src/island/spec.ts` blob `7d2271fc5de115f9ce97c21e41c7c5a2a7d2106e`; Lab `src/main.ts` blob `3820f3c957eacb170be61daf470fe63bcafd1d1d` on historical `sync/lab-rkit-2026-10-09`. God Mode planned recipe `docs/SPEC_WORLDBUILDER_GODMODE_VISION_R1.md` blob `ca1f2968e15d594c5a64e1b6ba3b200d07346702` reserves `nodes[]` (`resource/water/farm/craft/stage`) **after MVP**. | Lab runtime's inspected `IslandSpec` does not itself prove an active accepted water activity-node schema, player save or loot wallet. Never inject speculative fields into current MVP code under a documentation gate. |

**Explicit SOURCE_REQUIRED:** current water/shore source and contact height; water impulse/render and LOD; actual fish/rod/bobber/boot; avatar hand socket and usable clips; catch/reaction actor behavior; owner API for Bag+Wallet+Score+Card/Almanac; seed/persistence; exact ambient resident/pond geography. Since source object visuals were **not rendered here**, no donor can be labeled visually proven in this slice.

## 3 · One rule/result, two performances — no duplicate game

The **single World/Environment-owned node** answers: Is this water surface reachable and eligible? Which ecology/loot source refs, visit constraints and world context apply? One Gameplay/Resource-Activity owner later resolves a **single** event ID and authoritative outcome. Different methods select interaction timing, visual choreography and *permitted* content biases but **cannot reroll or independently pay extra resources**.

Illustrative (not a deployed API) action contract:

```text
ResourceActivityRequest { actionId, sourceNodeRef, actorRef,
                          method: QUIET_FISH | CARTOON_BLAST_WATER,
                          selectedToolRef?, difficultyProfileRef? }
→ validate existing World node / actor / source asset / bag capacity /
  reward-budget & cooldown / method permissions
→ resolve ONE owned CatchResult with stable reward IDs & visual seed
→ commit a single idempotent event:
   World resource depletion / cooldown, offered drops,
   authorized Fluff item/material / score eligibility and Memory receipt
→ visual event plays (can replay harmlessly without economic effects)
→ source-backed drops: offered → claimed/recycled/declined/expired
→ bag/score/almanac owner grants EXACTLY ONCE (including interrupted FX/reload)
```

**Critical detail from v0.7.1:** Showing a fish flying does NOT mean it was already taken into the Bag. `DropRef` or current accepted inventory receipt must track offered vs claimed independently. Fluff can auto-collect by safe proximity; a source-authentic unique item is optionally inspected/taken by the player. Grey junk is not allowed to spam 20 Bag slots, and a fast-driving player is never stopped by an unsolicited modal. Card instances always use real `deckId+cardNumber` and original PDF, with current Almanac/provenance authority. `Fluff Score lifetime` is separate from spendable six-D6 High/Low wallet and older Fluff-HP.

**Fairness:** Do not make blasting the only viable way to catch unique Cards or gain significantly more Fluff/hour than quiet fishing by default. A method can be more spectacular and yield distinct *authored oddities*, or another social repercussion, without building an optimal grind exploit.

## 4 · The deliberate 10–20-second "Cartoon Blast" visual loop

**Scene:** one source-verified shoreline/pond with world biography and at least one source-appropriate Resident/activity in reach. Avoid generic blue plane surrounded by random props; integrate geology/bank/water contact within the World owner's current accepted clay/material grammar.

1. **Aim/throw (0–2s illustrative):** one approved clown toy prop on a valid water node; a short readable toss/fall and oversized `plop`. No realistic ignition instructions, no Combat weapon ballistics or damage effect.
2. **Anticipation (2–4s):** water settles unnaturally, one comic bubble and tiny surface motion, silence/held Resident gaze. The sound beat has more personality than a 40-particle spray.
3. **Knet explosion (4–6s):** owner-fed local radial ripple/deformation + one visible sculpted surface surge; convincing clay-cloud volume, soot puffs, water splashes. KFB Audio owns mix/timing, KFB VFX/Surface owns presentation. VFX can be sprite/instanced 2.5D *only if* convincing in actual game camera.
4. **Loot firework (6–9s):** a **small bounded** sourced selection (illustratively 4–7 output pieces, not a promise of fixed amount) rises on separated arcs. Bias masses, buoyancy, angular gaps, distances. A seeded minimum-distance / clustered-distribution sampler makes a naturally asymmetric, legible display; avoid a perfect ring or 50 identical spheres.
5. **Bounce / float (9–12s):** elastic fish with X-eyes and Fluff spheres briefly rebound, make little localized `plip` splashes, bob and settle into reachable pickup areas. An object that visually sinks must have a safe, explicit pickup/receipt path; no inaccessible rare loot.
6. **Afterglow (12–20s):** a Resident registers what happened (one specific physical reaction or short written line, not generic quips), the water gradually calms, the player chooses pickup/inspection or walks away; no menu takeover.

**Proportions and timings are visual creative guidance, not a measured performance target.** Motion reduction and audio quiet modes preserve hit/event cues; don't require flashing or sustained camera shake. This first proof is not a new outdoor physics/weapon simulation. Use few authored source-aware curves and instanced particles rather than rigid-body simulation for each flying carrot.

### The calm contrast: ordinary fishing
Single `CAST → FLOAT_WAIT → BITE_WINDOW → REEL → REVEAL` loop using existing seven motion clips *only after* a complete actor + real fishing prop + source shoreline proof. Touch/click has forgiving cues; missed bite is harmless. A `Fluff-Fish` can later be squeezed/kneaded once into finite D6 High/Low Fluff via the existing crafting contract; the original item is consumed. Again no double score on catch + process + trade.

## 5 · Other environments use the SAME adapter, not a "universal farming engine"

- **Mines/rock:** `MINE_TAP` or fictional `CARTOON_BLAST_EARTH`; same resolver, earth/chunk/squash/smoke visual profile instead of water ripple. Existing Caveman mine is a story opportunity; real target shape and World Damage rights require proof. Boxel Blitz POC crescendo may donate auditory *grammar*, never its AudioContext or full gameplay.
- **Farm:** `PLANT / HARVEST` at source-verified Farmer dirt plots; carrots, lettuce and future source-approved Fluff crops. Time/growth/capped offline progression belongs to single player/world save, never a freely manipulated client wall clock. No forced daily login or dead crops after vacation.
- **Trees/gardens:** shake Fluff-fruit; cheap bend/wobble with select particle/auto-collect; no punching through geometry or conjuring Flora source truth.
- **Cosmic ponds/alien gardens:** later unique source/biome rules at approved WorldInstances; not every colored shader or toxic liquid is fishable.
- **World reactivity:** source-backed props may wiggle, protest, dance, become collectible or remain merely delightful, with bounded motion/ChatterBox and audio budgets. The reaction isn't always a resource payout.

## 6 · First actual after-MVP proof selection: ONLY ONE

**Recommended first source-isolation target:** SOURCE-backed **Clown bomb → water ripple → elastic scatter** because it gives immediate visual KFB identity, but it is conditional on finding and accepting a real compatible current World water surface. If the water shader is unready, the correct behavior is to preserve the seam as UNKNOWN and choose a different already-compatible original (e.g. `FISHING` actor/rod original or existing World mine `MINE_TAP`) rather than building a new off-brand fluid engine to force this concept.

The **first gameplay-authorized integration** must be smaller than a whole lake/farm/casino:
- one true approved existing water source + one source toy-bomb,
- one real owner-accepted impact/ripple candidate,
- one small authored particle/object set shown in isolation then integration,
- one deterministic ActivityResult/DropRef transaction,
- one easy pickup and reload, no duplicate score, no missing reward,
- a visible original-game-camera clip and independent critic result,
- no production World edit, player save or public Stage until the owning MVP source/gates and Georg explicitly authorize it.

### Conditional acceptance questions (post-MVP only)
1. Does the unmodified source bomb actually render as the KayKit original in isolation, including scale/grip?
2. Does the *current* Lab Water/Surface owner show a correct water surface at a real supported reachable bank?
3. Does the impact cause a local expanding wave without corrupting shore/support/wet mask or Track Core?
4. Do all emitted fish/props have verified source IDs and grounded visual comparison?
5. Does a seeded second replay make the same believable irregular shower, at acceptable GPU/CPU/audio budget?
6. Does reward state survive abort/reload and prevent double grants?
7. Can Calm Fishing still offer the same main resource/card path without compulsory blasting?
8. Does this look *distinctively KFB claymation*, attractive in one visible before/after video, not like a generic particle plugin?
9. Is the user protected from accidental no-return effects, camera/input hijack, and loud flashes?
10. Did the Lab's current authorized builder, independent tester/critic and Production Guard accept the actual output?

**Existing single immediate recovery gate remains `CLAUDE_CODE_RECOVERY_INTAKE_CONFIRMATION`**: actual Claude Code controller must acknowledge PR #400 and current Lab SSOT; this chat cannot impersonate Claude Code. **Existing deferred implementation gate `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT`** opens only after an accepted playable foundation and explicit Georg approval. This note does not silently promote either gate.

## 7 · Source references and truthful result

- Recovery bridge: `skills/chat/recovery/KFB_POSTMVP_MINIGAMES_FLUFF_SOURCE_RECOVERY_2026-10-15.md`.
- Original full documents: v0.6 `KFB_FISHING_FARMING_CARTOON_BLAST_ENVIRONMENT_V0_6_2026-10-09.md` blob `c8637f7ddddbc45b90957b0e7565171b7677acd1` and v0.7.1 `KFB_BLAST_MINING_CASCADE_AND_LOOT_SOCIAL_CALLS_V0_7_2026-10-09.md` blob `cb8a71f41612ee29ae50c179a25c696cf1c79998`, both on `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`.
- Earlier Lab architecture review `REVIEW_POSTMVP_CONCEPTS_ARCH_FIT_R1.md` blob `0fe38ff8245df45e36416b1cf02c7c7fd56d2d23` on `sync/lab-rkit-2026-10-09`.
- Direct source and code: `registry/resources/v1/motions.jsonl`, `tools/resident_atlas_s6/data/cast.js`, `tools/KFB-ToolBox/_inbox/KFB_VFX_01_REVIEW/RETURN_VFX_01.md`, `tools/KFB-ToolBox/_inbox/KFB StoryMap v1/sma1-map-animator.js`, Lab `src/island/spec.ts` and `src/main.ts` at current inspected branch.
- **Test status:** this document has source/static contract evidence only. No visual proof, direct source assets rendered, WebGL Water seam, actor rig motion, reward runtime, save pipeline, browser test, public Site/Stage or active Lab acceptance performed. No PR auto-merge.
