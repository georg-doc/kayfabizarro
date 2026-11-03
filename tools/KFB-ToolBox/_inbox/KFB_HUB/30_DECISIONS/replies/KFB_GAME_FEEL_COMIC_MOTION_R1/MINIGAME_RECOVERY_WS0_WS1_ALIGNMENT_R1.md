# KFB Gameplay Ideation R1 · Minigame/Fluff Recovery R0.1–R0.5 × WS0/WS1 source alignment

**19.10.2026 · DESIGN / SOURCE RECONCILIATION ONLY — NOT CANON, NOT GAMEPLAY.**
**This is an additive companion to `CONCEPT_R1.md`, not a new Game Design or Minigames SSOT.**
**Owner of this document:** existing KFB Hub/Register Game Design & Fractal Canvas concept lane. WS0 owns decisions/registry/data; **WS1/WS1b is the only productive game world/runtime author**. Existing Card, Combat, Camera, UI, Audio, 2D, Video and other subsystem owners are retained.
**Document writer branch:** `planning/kfb-game-feel-comic-motion-ideation-r1-2026-10-19` · Draft PR #435 against `docs/kfb-decisions-register-2026-10-11`.
**Original concept sources and Recovery PR:** untouched. No merge, new World/Combat/Inventory/GameSave owner, no public route or implementation authorization.

## 1 · What was missing from the prior R1 concept packet?

Prior `CONCEPT_R1.md` truly read/cross-linked the Six Dimensions/NATHAL/D6 concept, the 16-deck/49-card research and Flatworld Gutter. It had **not** directly read and integrated the full original Fluff v0.3–v0.7.1 and Recovery R0.1–R0.5 corpus. This addendum closes that **reading/routing gap only**. It does not retrospectively claim the old R1 reviewed what it did not.

**Source proof in this pass (GitHub `fetch_file` successful):**

### Recovery / active addenda, all at PR #400 head
**Branch:** `recovery/kfb-minigames-fluff-source-bridge-2026-10-15@c98551da936ccd556cf566b66cea2d0404d7128d`; **PR #400 OPEN/DRAFT/UNMERGED**.

1. `skills/chat/recovery/KFB_POSTMVP_MINIGAMES_FLUFF_SOURCE_RECOVERY_2026-10-15.md` · blob `48ec1fc132de218faf701ea4fbd9d53d827a09f0` · source map and original owner/history.
2. `skills/chat/recovery/KFB_POSTMVP_MINIGAMES_FLUFF_RECOVERY_RETURN_2026-10-15.md` · blob `2555e8e5cfc29011bb8d47405798bf1423760cbf`.
3. `skills/chat/recovery/KFB_WATER_HARVEST_MICROGAME_FIRST_PROOF_DESIGN_R0_1_2026-10-15.md` · blob `e84ca1468b1ce97d196d0b38bb7c6acc6cc70b03`.
4. `skills/chat/recovery/KFB_DECK_HOMEBASE_COLLECTION_PROGRESSION_R0_2_2026-10-15.md` · blob `517e06369bee5af237bb2a271c43d17c9d823005`.
5. `skills/chat/recovery/KFB_HOME_RETURN_STONE_POI_3D_COMPASS_R0_3_2026-10-15.md` · blob `44e575114ac8246de4fad3c93300295c5ee3cc25` (includes mandatory up/down pitch).
6. `skills/chat/recovery/KFB_PICKUP_FLUFF_CARD_LOOT_SOCIAL_CALLS_R0_4_2026-10-15.md` · blob `095a8cac360940a3d69babe91c26419dea74a804`.
7. `skills/chat/recovery/KFB_CARD_INK_DEFENSE_OPEN_WORLD_ENCOUNTER_R0_5_2026-10-17.md` · blob `2bcfa063f07100be26626ac5615f3d3ba12eb894`.

### Original authored source, all at historical planning head
**Branch:** `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09@b75faea954188f5dcd57133a996abe3321a7c7db`.

8. `skills/chat/KFB_FLUFF_CRAFTING_ALMANAC_LAYER_CONCEPT_V0_3_2026-10-09.md` · blob `950f11df2178045fb7351f0470b2441d8a24773e`.
9. `skills/chat/KFB_PLAY_CRAFT_LEARN_OPTIONAL_SURVIVAL_PROFILES_V0_4_2026-10-09.md` · blob `de686cf04f47d5fe6008cd6316223851fbccb5c1`.
10. `skills/chat/KFB_GENESIS_CONSTELLATION_UFO_COSMIC_ISLANDS_V0_5_2026-10-09.md` · blob `e9a954db836a2bbc41c0c440cef0708fcaaa5e90`.
11. `skills/chat/KFB_FISHING_FARMING_CARTOON_BLAST_ENVIRONMENT_V0_6_2026-10-09.md` · blob `c8637f7ddddbc45b90957b0e7565171b7677acd1`.
12. `skills/chat/KFB_BLAST_MINING_CASCADE_AND_LOOT_SOCIAL_CALLS_V0_7_2026-10-09.md` · blob `cb8a71f41612ee29ae50c179a25c696cf1c79998`.

This is **12/12 direct readable files** (7 Recovery + 5 Originals). The source bridge labels the originals **v0.3–v0.7.1**; this audit did not establish additional complete authored **v0.8/v0.9** original Minigame files. Do not silently claim those versions exist or have been read.

## 2 · Current WS0 governance and explicit uptake

Read current `docs/kfb-decisions-register-2026-10-11@a30d174a4207886e4bbfe796ad75702200ab871d`:
- `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/DECISIONS.md` · blob `48449565e577163999677f0c14ff3f0698875ceb`; extracted exact V-rows.
- `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/ARCHITECTURE_R1.md` · blob `b388870adddc0901bf456aa54959bb42d69b5c47`. **V-228:** WS0 owns decision/data, only WS1 builds the R3F runtime. Lab is historical donor, WB2 R4 is separate stopped program.
- `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/WS0_ACK_CARD_INK_DEFENSE_R0_5_2026-10-17.md` · blob `77026d46a3feacffdaa972335e4cd0ea6001fdeb`. This is a **real WS0 ACK** of R0.5 as planned **post-MVP**, even though PR #400 has no human review comments; do **not** repeat the previous proposed gate `WS0_CARD_INK_DEFENSE_INTAKE_ACK` as if no ACK exists.
- `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/BRIEF_WS1_FLIGHT_DESTRUCTION_R1.md` · blob `39737458348367859f4bfca033798bfb625471d7`. V-514 is an **authorized WS1 block**, not completed live gameplay proof.

| Source topic | Exact steering decision | What is settled vs open |
|---|---|---|
| Homebase target navigation | **V-333 / V-334** | Real 3D Clay arrow with target bearing/distance; **flight pitch required**. HUD R4 shifts arrow into world above actor/vehicle, rather than generic HUD corner; single game HUD renderer. Return Stone/Home anchor beyond compass is not shown as independently implemented. |
| Six Fluff Story-Mode colors / recipe | **V-368** | Six types in all zones, weighted by story; proposed one-each → one Card. High/Low still source data. Exact recipe and economy are **TBD**, not proof of a new chemistry system. |
| Dioramas, reactive trunks, crop/fluff, mini-activities | **V-369 / V-371** | Accepted into planning; includes wind/shaking Fluff, drift collect, wandering Mimic chest, postcards→Almanac, landmark field notes and story dice. Item availability/asset isolation and implementation remain owner-gated. |
| Save provenance | **V-396** | WS0 says `kfb.save/1` contains Cards, Fluff and rolls. Supersedes older v0.3 “no PlayerSave in Lab” assumptions for current WS1. Exact current save-grant idempotency **not rerun here**. |
| Card Ink Defense | **V-405** | **Acknowledged/scheduled as post-MVP**: authentic Card lure in living world, small infected creatures ink-censor Card, optional defend/heal/recover, one authentic receipt+Almanac. First eventual proof **small open-world Card Defense**; vertical Card-Hex later. Not yet built. |
| Flight + destruction + Fluff yields | **V-514** | Explicitly authorized WS1 block after R1a; donor Seed World and Fluff suck, `ShotEvent/HitEvent` as present brief design. Source read does not prove current full block completion. |
| Black Goo supply chain | **V-531** | Men in Black Robo-arm/trichter extracts Fluff, black Goo feeds ink-censor monsters. WSB figures + WS1 mechanics. |
| Restoring color vs Black Goo | **V-532** | Player Fluff shots/wash via same arm; **color rule q103 OPEN** (A any, B matching, C gradual). Bubble censorship q104 is **proposal**, not globally approved dialogue change. |
| Kayfabrizieren / build-suck reversal | **V-533** | One arm/trichter/suction visual language for **build and dismantle** using Fluff resource. Real placement, grants and scene changes belong to WS1/approved owners; no competing authoring/runtime. |
| Video / comic motion | **V-527** | Dedicated **WSV Video & Motion Studio** already owns Remotion/HyperFrames/HeyGen authoring. Earlier suggestion to create a new Remotion/video pipeline must be redirected to WSV; source Warp Studio remains candidate-only. |

## 3 · Current WS1 implementation evidence, not live playtest

Read `ws1/r3f-frame@1ebebb9b411e66b880c0f3978a2135fb0e3cb8ab`:
- `WS1_STATUS.md` · blob `9ebb8ecfede80bf0ec739b2a80f75b054470d19d` latest sections **§96 / §95 / §94**, through 18.10. night.
- `WS1_HANDOVER.md` · blob `64402db5c8399d3e49e6b38e8eeb24ef5c3396e0`. **V-539 WS1 → WS1b MacBook** handover, snapshot `ws1/combo-r2` (published per source) and local Git bundle; not permission to merge.
- **WS1 itself reports** `combo/r2@d762916` and a preview build with R1a racer engine, Fluff suction `kfb-fluff-suck.v1.js`, source-specific harvesting/pickups, C1/C2/C3b, cartoon flight and prototype lanterns. Reported full test **61/62**, remaining failure `c3g` lamp/lantern luminance (placeholder). These are WS1's authored reports, **not new independent tests** in this chat and **not an independently opened/visually verified live URL**.
- V-514 full flight/destruction block and V-405 Card Ink Defense have **no new acceptance proof here**. The oldest v0.3–v0.7.1 source said *Island Worldbuilder Lab* because it predates current V-228 and WS1; this is **historical provenance, not current owner assignment**.

## 4 · One consolidated mechanic family instead of competing minigame engines

The original corpus and WS0's newer decisions form a single candidate **Fluff ↔ World ↔ Card ↔ Resident ↔ Almanac** cause/response circuit:

1. **Encounter source:** real tree/farm/pond/mine/Mimic/Resident/card POI, with real Deck/World/Actor asset IDs.
2. **Perform small action:** optional harvest (calm / theatrical), trade/gift, collect, build/dismantle, reveal or defend. The active owner commits the one event; every VFX burst is not a grant.
3. **World replies visibly:** source-authentic squish/bounce/settle, short Fluff suction, a social gesture, tangible repaired/change-of-color state, or ink gradually obscuring/restoring the real PDF-sourced Card image.
4. **Collection tiers:** ordinary Fluff is easy proximity/drive-compatible pickup; a genuine Card (`deckId+cardNumber`) gets source-accurate PDF/OK reveal and one claim/almanac receipt; interesting props trigger optional **Social Calls**, not compulsory dialogue or anonymous RPG loot. Never create a second Card/Wallet/Inventory state machine.
5. **Remember/return:** source-validated Card/Activity provenance and a small visual change make returning to a Deck Homebase meaningful. A home-return anchor and target-aware 3D compass are navigation aids, not generic fast travel or moral locks.

### What does this change in the *earlier* five game-feel proposals?

- **G1 invitation** becomes a specific authored *Fluff/loot/card/social* affordance before tooltip: a real Farmer_B, Mimic, Card POI or source pond physically invites action.
- **G2 two views** should use *existing* Hunky/Dory harvest vs care, Black Goo censorship vs Fluff cure, and verified D6/Deck perspective donors; not a new six-element mechanic nor six color filters.
- **G3 return recognition** should first exploit Deck Homebase progress, `kfb.save/1` source, real ID/provenance and Almanac, not invent a parallel persistent reaction/XP engine.
- **G4 contact/acting/response** has strong pre-existing fixtures: `Water Blast → Ripple → scatter → pickup`, `Brick-Fish → hit → social response`, `Card attack → ink stamp → cure`, and `fluff-suck → build`. Use local effect/pose hold if it improves readability; keep damage/save authority stable.
- **G5 Gutter** stays an **interpretive/visual Flatworld proposal** for adjacent Deck contexts. It must not become an automatic new Card battle topology, teleport mechanic, forced world gate, or reinterpretation of D6 as colored rooms.
- **WS1 suggestion #3 wind** partially duplicates **V-371 Fluff-Böe**, so start there; no new global weather authority. **#6 photo mode** overlaps **V-371 postcard → Almanac**; reuse photo/camera intent and V-527 WSV rather than make a competing sharing layer. **#8 input replay** helps test exactly-once Card/Fluff claims, but a `transform ghost` and a `deterministic event/input replay` remain different problems. **#10 value/silhouette views** test real Card visibility during progressive black ink, without falsely labeling coverage as shading.

### High-value future interaction proposals (not runnable scope)

**One genuinely small calm encounter:** a source-verified existing orchard/crop Resident handles Fluff; player sees/sucks/collects it through the reported WS1 prototype; one actual Card/interesting Prop would later offer an optional original-Card reveal and Almanac receipt. A two-minute encounter must **not pretend Card claim is implemented** if only Fluff suction exists.

**One future Card Ink encounter:** a real source-backed Card under an approved terrain projection attracts few actual Combat donor creatures; black Goo adds ink to source-local Card coverage, and a local player action/healing reveals it. In Chill, full censorship must remain reversible. Exact ink treatment and Fluff color matching remain future source/human gates. No mandatory Monster fights to obtain ordinary Cards.

**Video extension:** WSV, not WS1 or a new studio, may later consume original Card art + event timeline + proper real Resident/2D puppet source for a motion-comic recap. This is presentation reuse, **not proof of existing Remotion integration**.

## 5 · Evidence / disagreements / one next gate

**Sources directly fetched:** 12 original/recovery MD files, 3 register/ACK/WS1 brief source files, current decision/architecture/WS1 status/handover, current branch heads and PR metadata. **No** new runtime, render, browser, source-object isolated proof, physics, sound, save-reload, gameplay or Stage tests: **0**.
**WS0 uptake is confirmed by exact decision rows and ACK; full WS1 implementation is NOT.** Current PR #400 remains independent and open. Its older closing ask `WS0_CARD_INK_DEFENSE_INTAKE_ACK` is **already satisfied by V-405/ACK**; do not block future planning on another identical acknowledgment.
**Unresolved:** WS1b's current working code beyond handover, Card ink material/world proof, exact original Card/PDF mapping at visual level, Black Goo color matching q103, censorship bubble q104, actual 3D compass flight proof, Deck Homebase persistence/event idempotency, fully composed G1/G4 encounter, future authorizing human gate. Additional “v0.8/v0.9” mini-concept originals not established.
**No public stage route** needed for document-only source alignment. No merge, no main/register write, no Hub metadata alteration.

**Exactly one next conceptual gate:** **WS0 Game Design maps ONE source-backed, presently WS1-feasible, two-minute `Fluff acquisition → optional meaningful resident/card response` encounter** against the actual new WS1b owner/preview state, explicitly separating existing mechanics from conceptual post-MVP Card Ink/Crafting. Decide in WS0 whether the encounter is worth a later bounded WS1 proof; do not authorize/build it from this document.
