# Resident Story Zones · START HERE

Status: **CURRENT IDEATION / RECOVERY ENTRY · NO RUNTIME BUILD**

Repository: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/resident-story-zone-concept-2026-09-22`  
Owner: **KFB ToolBox / shared scene authoring**  
Reserved future Stage route: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/resident-story-zones/`  
Current public state: **NOT BUILT / NOT DEPLOYED / NOT PUBLIC_VERIFIED**

## Recover in this order

1. Read current `skills/chat/START_HERE.md`.
2. Read current `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`.
3. Read current `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`.
4. Read this folder's `LIVING_CONCEPT.md`.
5. Read this folder's `RETURN.md`.
6. For implementation questions, re-open the exact current owner docs named in `LIVING_CONCEPT.md` rather than relying on remembered snapshots.

GitHub current state overrides this handoff.

## Purpose

This is the recovery home for Georg's ongoing brainstorming about:

- Resident/NPC scene authoring;
- ChatterBox integration;
- nested editing from EyeRig / face / actor to scene / Story Zone / world;
- live Asset Librarian search;
- reusable micro-scenes and dioramas;
- authored paths, activities and mini-stories;
- Hex/world placement through existing world/surface owners.

## Important boundary

This folder is **not** a new runtime owner.

It routes to existing owners:

- Resident Atlas / actor composition;
- EyeRig / face / graft authoring;
- Motion/Animation owners;
- ChatterBox;
- Asset Registry / Librarian;
- shared in-scene editor and `kfb.scene-patch.v1`;
- current World Building / Surface Adapter lane;
- receiving world/game hosts for navigation, collision, camera, persistence and gameplay.

## Current concept checkpoint

The working proposal is:

> **Story Zone = a reusable, nested, non-destructive composition layer above existing asset/profile/activity owners and below the receiving world/runtime owner.**

The strongest shared authoring grammar is:

`EyeRig → Face → Head/Graft → Resident → Activity → Scene → Story Zone → World placement`

Each level remains independently editable through local transforms/profile parameters and owner-specific patches.

## Current recommended first proof

Do **not** build the general World Editor first.

First concrete fixture, when implementation is explicitly started:

**Lore Keeper · Open-Air Study Story Zone**

- real Lore Keeper Resident;
- writing lectern / study station;
- books / RPG archive props;
- optional bookshelf;
- backpack retained;
- compact open-air scenery that stays portable;
- LK-L1 study/read/think + one contextual ChatterBox interaction;
- then LK-L2 Desk ↔ Shelf path;
- only later LK-L3 book/Card POI discovery and collect/archive loop;
- save/reload;
- nested group edit;
- portable Story Zone recipe.

The earlier Park Bench fixture remains useful as a later minimal regression fixture, but is no longer first.

Parallel concept lane now also includes: **Social Attention + Gift Drive**, source-backed food-gift/gag framing, a semantic Reaction Library, **player-facing Triplet/Bubble gift conversations**, a bounded Gift Backpack with provenance, and the **Kayfabe Social Conflict Loop**. Backpack mesh/profile is presentation; Gift Inventory is state; Lean Memory preserves the history. ChatterBox never becomes Navigation, Animation, Inventory, Save or Combat owner.

## How to continue ideation

Append dated sections to `LIVING_CONCEPT.md`.

Use status labels:

- `USER DIRECTION`
- `PROPOSAL`
- `DECISION`
- `CORRECTION`
- `DEFERRED`
- `REJECTED`

Do not rewrite old entries to make the history cleaner.

## Current technical concept gate

Section 25 of `LIVING_CONCEPT.md` now defines **Minimal Resident Decision Loop v0**:

`ACTIVITY → PERCEIVE → NOTICE → CAN_INTERRUPT? → MOTIVES → SELECT → RESERVE → APPROACH → ENCOUNTER → REACT/COMMIT → MEMORY → RELEASE → RESUME`

First proposed runtime proof uses exactly two Residents + one real food gift. The next player-facing proof uses one Resident + player + one canonical Bubble Call + one gift commit into the bounded Backpack. No Combat/crowd/utility-AI dependency.

Reaction note: current targeted source search found partial face/eye reaction evidence, but no clearly named full-body Laugh/Cry clip. Treat those as animation inventory/authoring work until proven.

## Player gift / Backpack extension

Section 26 adds:

- canonical player Calls: `KayfaBINGO · KayfaBONGO · KayfaBOGGLE · BLÖDSINN!`;
- one- or two-turn in-world Bubble microconversations;
- gifts as social-completion rewards rather than right-answer prizes;
- bounded `PLAYER_GIFT_BACKPACK` with provenance;
- re-gifting to Residents through the same social grammar;
- visual Backpack profiles kept separate from inventory state;
- source-backed Backpack donors including Orc, Hoarder and sibling-mesh candidates from Hiker and Protagonist A/B;
- user correction: **Goth Girl + Elisa setting**, not “Crossgirl”; Elisa is context, not invented KayKit source.

## Shared Social / Gift Contract v0

The smallest shared data contract is now shaped and checked.

Read:

- `SOCIAL_GIFT_DATA_CONTRACT_v0.json`
- `SOCIAL_GIFT_FIXTURES_v0.json`
- `SOCIAL_GIFT_CONTRACT_CHECK.md`
- `LIVING_CONCEPT.md` §27

v0 defines exactly eight records:

`ActivityState · PerceptionCandidate · Motive · SocialPair · EncounterBit · PlayerCall · GiftInventoryItem · MemoryReceipt`

The three deterministic fixtures are:

- `RR-GIFT-01` Resident→Resident;
- `RP-GIFT-01` Resident→Player Bubble Call + Backpack;
- `PR-GIFT-01` Player→Resident re-gift with preserved provenance.

Static evidence:
- JSON parse **2/2 PASS**;
- record types **8/8 present**;
- fixtures **3/3 present**;
- invariants **12 recorded**.

This is **not** a runtime PASS.

## Current product decisions after contract v0

- **Persistence concept:** Session / Journey / Fractal Almanac owns Gift Inventory + provenance + Lean Memory journey records. Exact storage adapter remains implementation detail.
- **First gift:** Tiny Treats pink donut:
  `media/3D_Assets/Tiny_Treats_Baked_Goods_1.0_FREE/Assets/gltf/donut_pink.gltf`
- **Not a Georg gate:** canonical host actor/player IDs and exact ChatterBox caller/adapter seam. The implementer must recover these from the chosen current host/owner.

## One next gate

Choose and then prove the **first visible social gift encounter** with the pink donut.

Recommended smallest proof:
`Orc → player` or `Orc → Lore Keeper` → short Bubble/Banter → offer → accept → `TRANSFER_COMMIT` → Almanac/Journey provenance → release/resume.

No need to ask Georg for internal IDs or caller-function names before that build slice is prepared.
