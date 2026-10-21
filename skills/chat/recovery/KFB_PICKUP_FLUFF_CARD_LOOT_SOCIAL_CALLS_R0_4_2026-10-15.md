# KFB Playmation Pickup · Fluff Orbs, Canonical Card Reveal, Living Props & Social Calls R0.4

**Date:** 2026-10-15 · **Status:** GEORG AUTHOR CLARIFICATION / SOURCE-GROUNDED POST-MVP PLANNING, NOT IMPLEMENTED  
**Single receiving World/Gameplay owner:** current KFB Island Worldbuilder Lab / Claude Code steering. **Documentation branch:** `recovery/kfb-minigames-fluff-source-bridge-2026-10-15` · Draft PR #400 · no new second runtime.  
**Parents:** `KFB_POSTMVP_MINIGAMES_FLUFF_SOURCE_RECOVERY_2026-10-15.md`, `KFB_WATER_HARVEST_MICROGAME_FIRST_PROOF_DESIGN_R0_1_2026-10-15.md`, `KFB_DECK_HOMEBASE_COLLECTION_PROGRESSION_R0_2_2026-10-15.md`; original long-form v0.6 / v0.7.1 remains the verbatim creative source.

## 0 · Core author decision

All ordinary source-authored `ResourceActivity` methods — quiet fishing, theatrical cartoon blast fishing, cartoon blast mining, Caveman mine-tap, Fluff plants/trees/carrots, Resident gifts, ordinary World pickups — may scatter **a small visible, tactile family of collectable KFB clay Fluff orbs and honest source-backed item/card/prop drops**. After the cascade these objects **bounce, squash, roll or briefly hover**, then settle at an **easy Medium-Rig pickup height** near reachable World/ground/water support, like a warm and readable cozy platformer. The player acquires common Fluff by *walking through* a generous controlled pickup envelope rather than jumping or clicking 15 times. Cards and interesting Props create a small source-truth preview and optional contextual Social Calls. This extends an already documented intention; it does NOT add another economy, new Card source, generic loot rarity database or hidden quest requirement.

The public KFB Freestyle Rules and canonical Card identity are not changed by this adaptation. The visual World should feel like an alive hand-made clay toy, not an RPG UI grid floating at a POI.

## 1 · Precise existing donor findings

| Donor | GitHub source verified | Safe conclusion and crucial limit |
|---|---|---|
| **KFB WhackMan real Pickup bounce** | `tools/KFB-ToolBox/_inbox/KFB WhackMan v1-1/WHACKMAN_SESSION_2026-09-22/wm-gate-c.js` (main blob `79116eef1922b49b1faf4a464c03158d12bbcf34`), §“Sammelgut nach Knoten”, §“Aufsammeln”, §“Sammelgut: Ballistik” | Code calculates real source-mesh bounds, canonical pickup `baseX/baseY/baseZ` anchors, impulse/velocity/gravity/spin, impact squash & diminishing bounce, idle bob and a short upward shrinking pickup flight. Existing `wm-collide.js` Bounce family noted in `POSTMORTEM_CHANGELOG.md` blob `8fc3b6d29a9c65a7a5452fa75fc049ff0c9a870a`. **Source code DONOR, not already imported/current-Lab proof**. |
| **WhackMan important pitfalls** | Same source: actor is **PrototypePete `Rig_Legacy`**, radius uses measured XZ distance and does **not** test height; `WhackMan` node graph governs placement. `POSTMORTEM_CHANGELOG.md` records NaN from missing baseY on special/story pickups, resolved by saving actual initial base; body collisions/camera are local to WhackMan | For KFB Medium-Rig, do NOT copy literal WhackMan scene scale, collision radius, XZ-only far-away pickup, player motor or audio/loop; use a real source-verified Medium Rig capsule/footprint and **vertical bound** for air/flight. Preserve exact world support height, no NaN, no through-wall/terrain collection. |
| **Existing digital Card Reveal** | `overworld/docs/MASTERPLAN_overworld.md` main blob `5b36e8a0ef91fa2b4464122a02130776c23c623c` §4.2 reports `Card-Acquisition-Screen` chain **WIN → real Card revealed with context → OK → Fractal Almanac fly-in** functioning on that **older 2D Runner**; Card enters `collected` only on **OK**. Legacy `overworld/overworld/overworld-game.js` source shows `OW_REVEAL.show`. | This is an existing 2D/UI presentation/transaction **donor**, not a demonstrated current 3D Lab pickup or automatic permission to duplicate the Card/Almanac state. Maintain original PDF Card crop + `deckId+cardNumber`. |
| **Already persisted v0.7.1 interaction** | `skills/chat/KFB_BLAST_MINING_CASCADE_AND_LOOT_SOCIAL_CALLS_V0_7_2026-10-09.md` on `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`, blob `cb8a71f41612ee29ae50c179a25c696cf1c79998`: §2 levels 0–3, §4 `ActivityResult` / `DropRef` and §5 source economy truth | Common Fluff autopickup; gray junk without full Bag; unique Prop/Loot Card has small optional inspect panel; `offered → claimed/recycled/declined/expired`; canonical Card vs generic item; Social Calls are **local digital UI adaptations**, not rewritten global analog rules. |
| **Source-owned Card presentation** | `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md` main blob `15f8fce5428bfc6c2725b9e3042e9a8a83966468` | Original PDF art and actual Card ID win. Auxiliary Hero Shots are **attachments**, never allowed to replace the printed Canon Card. |
| **Current future World/scale** | `tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/docs/SCALE_CONTRACT_K2.md` on `sync/lab-rkit-2026-10-09`, blob `26cf4c0ca33612f2d3a5259871d8532391566e2b`: Medium figure ≈ `H=3.64` Lab units (Mummy B; Farmer A 3.85), MacroCell 6.4, use **H** not invented ordinary metres, with geometry/source measurements. Current Lab Masterplan R2.1 / `REVIEW_POSTMVP_CONCEPTS_ARCH_FIT_R1.md` states future pickup gameplay after MVP, player inventory/Wallet not yet accepted in reviewed source. | Heights/visual sizes below are **relative authoring proposals**; verify current accepted scale, capsule, world supports and real play camera before use. No current accepted `FluffOrb` mesh/material or real float/height measurements claimed. |

## 2 · Animation staging: source activity → scatter → poised pickup → short collect

**One cinematic grammar for water, mine and harvest, not separate drop physics systems**:

1. **SOURCE-OWNED EVENT:** source-valid World node and chosen method commit **one** authoritative `ActivityResult` with stable dropRefs, class/source IDs, content and a **deterministic `visualSeed`**. Multiple VFX sparks/balls must not mean multiple resource awards.
2. **EMIT:** small organic grouped spread, credible weight, source-appropriate water splash or clayed earth/dust, tangent/radial velocity and staggered start. Keep actual valid landing/collection footprint anchored to the World; no VFX deciding its own persistent loot positions.
3. **BOUNCE:** impulse up/out, gravity, yaw/spin and elastic squash/stretch on contact. 1–3 visually satisfying diminishing secondary hops may replay WhackMan's **shape grammar**, but do not inherit its exact physics constants, independent audio, Legacy Rig motor or custom wall collision. A source-aware lightweight animation/instanced curve is enough in crowded areas.
4. **SETTLE:** safe `surfaceY` of World, or a *very subtle* anchored bob at **calibrated shin–knee / lower-torso readable height** relative to **current Medium Rig H** (not fixed “1m” or untested WhackMan unit conversion), with a small `baseY` recorded for **all** drop classes, stable `baseX/Z`, orientation and organic individual phase. Larger card/prop can float more upright at an accessible reading height; if ground contact better expresses the donor, keep it grounded. No unrealistic thick glowing halo, perfect grid or uniform sinusoidal chorus.
5. **PROXIMITY:** the owner's Player motion/interaction capsule triggers *only eligible reachable* offerings. Friendly horizontal+vertical margin based on measured player/prop dimensions, source floor/water support and World collision/occlusion/instance ID; this works by walking through and can optionally use a short comfortable magnet pull. **Do not require jump, exact center collision or mouse click on Fluff.** In Drive/Flight use a separately proven owner-approved accessible collection corridor; no impossible through-mountain/x-ray pickup. No sudden braking or modal interruption at vehicle speed.
6. **PICKUP FEEDBACK:** one authoritative claimed ID triggers a little `squish → lift/arc → shrink/pop → HUD material increment` plus owner-audio cue. It is a **presentation of the granted item**, not the operation minting it. The visual can retry without repeating credits; on disconnect/reload, offered/claimed truth wins over an unfinished animation. A batch of a dozen Fluff orbs gets a single compact `+N Fluff` feedback rather than 12 alerts.

**Material and place consistency:** D6 color families and High/Low polarity are preserved; the same resource in a Protopia garden, Caveman mine or cosmic pond may use nearby authored response materials and lighting, but do not reassign D6 hues or convert low/high into good/evil. Normal vs Weird/Living drops may grin, look around or speak *when actually touched*, without blanket AI filler.

## 3 · Pickup interaction tier: fast Fluff, theatrical Cards, interesting Props

| Class | Immediate proximity response | Optional view/choice | Grant owner |
|---|---|---|---|
| **Colored Fluff balls / basic stackable materials** | Auto pickup; short WhackMan-like shrink-flight; +N aggregate; no OK | Maybe tap for an optional brief material fact, never a mandatory transaction gate | One authoritative material Wallet and eligible Lifetime Fluff score receipt |
| **Canonical Card** | Proximity marks one `offered` collectible, draws a **real original PDF Card** large via existing Card Viewer/Reveal, optionally tiny 3D swoop of source mini Card | **OK / KayfaBINGO!** confirms Card claim once; `KayfaBOGGLE?` may inspect genuine Card Title/Power/Lore and context without granting yet; `KayfaBONGO!` can postpone and keep safe offer. Card flies to the Fractal Almanac **after successful claim**. | Single `deckId+cardNumber` PlayerSave/Almanac owner; courier custody exceptions honored |
| **Ordinary or grey-world junk Prop** | May auto-recycle or ignore by player preference; optional short pop label | Inspect / take / leave / recycle; no auto 20-slot Bag spam | Current Item/Bag/Wallet owner |
| **Unusual, unique or talking Prop** | Small 3D/true source render with one readable prompt, not a blocking full-screen ad | **KayfaBINGO!** keep, **KayfaBOGGLE?** ask it one context-grounded question, **KayfaBONGO!** decline/postpone, optional **BLÖDSINN!** challenge its dubious *claim* | Real Item/Bag owner on confirmed take only; no CardRef minted unless item really is a registered canonical Card |
| **Immediate Power-up** | Collect on touch and activate only if the verified gameplay-effect/Combat/Travel owner already defines it; visually different from a Card | Short info/limited choice as appropriate; duration/effect source-owned; no fake arbitrary boost | Existing actual Power-up/Combat/Travel owner, once-only |

**Social-Call guardrail:** In the public tabletop rules the calls are story/improv moves, not universally `Inventory.add()` commands. These are **local digital KFB offers**, already proposed in v0.7.1 and consistent with the local Golden Journey social beat. Preserve spelling **KayfaBINGO! / KayfaBOGGLE? / KayfaBONGO! / BLÖDSINN!** and make plain accessible alternatives **Take / Ask / Leave / Challenge**. **BLÖDSINN! does not automatically delete a Card or item;** it may question absurd lore, provoke a counterclaim or prompt a harmless second perspective. The owner can determine the specific playful reaction. Do not hardwire BLÖDSINN as garbage deletion.

**Item self-explanation:** The new author's `Trickfisch` is a **working joke/source character, not a verified canonical model**. A briefly speaking or arguing fish, Fluff pellet or dubious object may explain how its **source-referenced** material/reagent/recipe relationship can be used (e.g. Witch Cauldron conversion) through *one existing ChatterBox/Triplet/Voice layer*, but speech is **not a grant authorization**, not unrestricted random lore and not evidence the player owns a recipe. A Fluff pellet may be silent most of the time yet offer a bounded optional joke on `BOGGLE`. Actual Card art/semantic JSON controls a Card's explanation. Do not manufacture full NPC brains or a second LLM runtime for common resources.

**Camera and flow:** At normal walking speed the first unusual Card find can invite a **compact large Card reveal / optional pause** with `OK`; on Drive/Flight do not hijack controls. Store one visible `Recent Finds` or protected World Drop offer; after safely slowing/dismounting, player may open the same genuine Card reveal and confirm. If screen dismissed, offer persists according to source item rules, with expiry only for harmless common drops and no accidental loss of rare/Card/quest items. `BOGGLE` or `BLÖDSINN` return to the same offered state. Player can keep exploring; completion of mission/receipt never happens just because VFX passed near the camera.

## 4 · Minimal source-driven acquisition state machine (proposed, NOT live API)

```text
ResourceActivityResult (ONE source event / visual seed / source-authored dropRefs)
  → SpawnVisual(landingAnchor + actor-readable pose + optional XZ/vertical bounce)
  → DropRef.OFFERED
  → on actual player proximity:
       FLUFF_BASIC: ValidateWalletEligibility → ClaimOnce → tiny pop → HUD
       CARD:       CardSourceRef / PDF reveal → [OK/BINGO → ClaimOnce → Almanac fly-in]
                         ↘ BOGGLE explanation / BLÖDSINN challenge → remains OFFERED
                         ↘ BONGO postpone → remains OFFERED or safeguarded Recent Find
       UNIQUE_PROP: Owner item preview → [Keep | Ask | Leave | Challenge] → ClaimOnce if Keep
       POWERUP:    Owner-specific activate-on-touch → receipt once / VFX after outcome
  → CLAIMED / DECLINED / RECYCLED / PROTECTED_RECENT_FIND / EXPIRED (owner rules only)
```

Each drop gets a **stable `DropRef` + item/card source reference**, and an **idempotent claimed receipt**. A single event may produce multiple *true distinct drop contents*, but physics/particle count does not affect contents. Prevent double claims after collision overlaps, reload, teleport, Drive/Flight passes or multiple buttons. Inventory capacity checked before destructive removal of a rare offered item; canon Cards appear in Almanac rather than consuming Backpack slots. The Fluff Wallet, HP/POP, cumulative score, Card completion and story Memory are not one interchangeable number. World-side destruction/surface/water data has its own owner; a flying debris proxy alone cannot remove rock or fish population state.

## 5 · One later tiny proof, before mass authoring

**Existing recovery gate first:** `CLAUDE_CODE_RECOVERY_INTAKE_CONFIRMATION` still needs the owning Claude Code session to acknowledge Draft PR #400 and its current Lab SSOT. Only after playable core and explicit Georg approval can `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT` include a **bounded Pickup Presentation + Claim proof** as part of the first Fluff vertical slice, NOT an extra current P0.

**Minimal truthful demo:** one source-grounded World scene, accepted Medium-Rig player, 3 normal D6 source-backed Fluff balls and ONE real original CardRef or accepted unusual Prop. Trigger a source-valid small `ActivityResult` (source tree/mine, or a valid accepted Water Blast, not obligatory new explosions). Show original WhackMan pickup source on its own before transplanting only its measured bounce/shrink impulse grammar, using K2 accepted scale and source player collisions. Balls hop then settle above confirmed ground, player walks across and collects 3/3, one aggregated HUD count. Original Card/Prop hovers, *offers* a true Card PDF/3D object preview; BOGGLE explanation does not claim; BINGO/OK claims exactly once and Almanac receives it; BONGO leaves offer safe. Retest two same-frame overlaps, abort during card reveal, walk away, Drive/Flight pass, reload and disabled voice, original camera at normal play scale, one authoritative Item/Card/Wallet/Audio owner. The test is only PASSED when player can actually do this in the approved receiving game/runtime; static source presence is not product acceptance.

**No post-MVP source art accepted here:** specific orb mesh/material, Card 3D thumbnail, true Medium-Rig support, radius, pickup animation renderer, screen space or Audio/Voice are **SOURCE_REQUIRED**. No new generic chrome, replacements, second collision engine, new World or Combat player motor or separate Card/Almanac/Score source. Exact source GLB visual isolation and native render comparison required before adoption.

**Do not change next/current Island MVP, private/published Site, Cloudflare or Hub router.** This R0.4 is documentation-only on the open unmerged Recovery PR, no auto-merge/Live.

## 6 · Source paths read for this addendum

- `tools/KFB-ToolBox/_inbox/KFB WhackMan v1-1/WHACKMAN_SESSION_2026-09-22/wm-gate-c.js` blob `79116eef1922b49b1faf4a464c03158d12bbcf34`.
- `tools/KFB-ToolBox/_inbox/KFB WhackMan v1-1/WHACKMAN_SESSION_2026-09-22/POSTMORTEM_CHANGELOG.md` blob `8fc3b6d29a9c65a7a5452fa75fc049ff0c9a870a`.
- `overworld/docs/MASTERPLAN_overworld.md` blob `5b36e8a0ef91fa2b4464122a02130776c23c623c`, `overworld/overworld/overworld-game.js` blob `d1ceca35c7adeab49eec495387042a51b00c8fcf`.
- `skills/chat/KFB_BLAST_MINING_CASCADE_AND_LOOT_SOCIAL_CALLS_V0_7_2026-10-09.md` blob `cb8a71f41612ee29ae50c179a25c696cf1c79998`, original planning branch.
- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md` blob `15f8fce5428bfc6c2725b9e3042e9a8a83966468`.
- `tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/docs/SCALE_CONTRACT_K2.md` blob `26cf4c0ca33612f2d3a5259871d8532391566e2b`, Lab sync branch.
- Current Recovery R0.1–R0.3 and source register on this existing PR.

**Tests actually executed for THIS R0.4:** GitHub source reads only. NO playable Medium-Rig/WhackMan donor isolation, new gameplay/PlayerSave/Item state, original PDF Hero Shot visual, browser, Stage/Site, audio or real-world 3D pickup test.
