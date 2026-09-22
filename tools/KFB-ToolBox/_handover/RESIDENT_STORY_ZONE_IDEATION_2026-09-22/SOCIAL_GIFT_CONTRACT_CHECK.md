# Social Gift Data Contract v0 · Contract Check

**Date:** 2026-09-22  
**Status:** STATIC CONTRACT EVIDENCE · NO RUNTIME / BROWSER CLAIM

## Checked files

- `SOCIAL_GIFT_DATA_CONTRACT_v0.json`
- `SOCIAL_GIFT_FIXTURES_v0.json`

## Static results

- contract JSON parse: **1/1 PASS**
- fixtures JSON parse: **1/1 PASS**
- v0 record types present: **8/8**
  - ActivityState
  - PerceptionCandidate
  - Motive
  - SocialPair
  - EncounterBit
  - PlayerCall
  - GiftInventoryItem
  - MemoryReceipt
- deterministic documentation fixtures present: **3/3**
  - RR-GIFT-01
  - RP-GIFT-01
  - PR-GIFT-01
- hard invariants recorded in contract: **12**

## Source facts rechecked

### Player Calls

Current Overworld glossary / runner source supports these code IDs and labels:

- `bingo` → KayfaBINGO
- `bongo` → KayfaBONGO
- `boggle` → KayfaBOGGLE
- `bloedsinn` → BLÖDSINN!

The `bloedsinn` ID was explicitly rechecked before retaining the contract.

### Chatter semantic boundary

`overworld/docs/NIE_ADAPTER_HOOK.md` already defines a bounded request/response hook with:

- situation / relationship / heat;
- fallback;
- deadline;
- context budget;
- response text / tell / bubble / emote / timing hints.

Therefore this contract stores encounter context/refs and does not invent a second text-generation protocol.

### Lean Memory donor

`GAME_DEV_STUDIO_ASSET_PACKAGING_LIVING.md` already defines `MomentReceipt` as compact reconstructible event state rather than a full Three.js/session dump.

The proposed `MemoryReceipt` follows that lean/ref-based rule.

### Scene editing

`kfb.scene-patch.v1` remains the shared transform/edit patch contract.

The social contract does not contain scene-transform ownership.

### Real food fixture source

The fixture gift points to:

`media/3D_Assets/KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/food_burger.gltf`

Repo source presence is confirmed.

This proves identity/source existence only, **not** carry scale, attachment, handoff animation or visual acceptance.

## Important non-claims

Not tested / not claimed:

- social runtime;
- navigation;
- Pair Lock concurrency;
- Bubble UI;
- ChatterBox integration;
- animation/reaction resolution;
- Backpack extraction/attachment;
- inventory persistence;
- transfer atomicity in a real save owner;
- Lean Memory persistence;
- browser result;
- Cloudflare Stage.

## Result

**STATIC CONTRACT SHAPE PASS**

This means the proposal is internally readable and source-aligned enough for the next owner-resolution gate.

It does **not** mean the social/gift system works in runtime.
