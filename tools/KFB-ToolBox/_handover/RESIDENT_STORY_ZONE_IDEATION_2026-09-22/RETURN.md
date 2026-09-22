# Resident Story Zones · RETURN

**Status:** IDEATION CHECKPOINT 1 · PERSISTED · NO RUNTIME BUILD  
**Date:** 2026-09-22

## Repository state

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/resident-story-zone-concept-2026-09-22`
- base main at slice start: `d68e5b55a9c9c08fe2483d46f3d0ea7dc190b8cb`
- Draft PR: `#174` · `https://github.com/georg-doc/kayfabizarro/pull/174`
- Stage route reserved: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/resident-story-zones/`
- Stage status: **NOT BUILT · NOT DEPLOYED · NOT PUBLIC_VERIFIED**

## Outcome

Created a durable ideation/recovery home for Georg's Resident/NPC + ChatterBox + World Builder authoring concept. Current first concrete fixture is now **Lore Keeper · Open-Air Study Story Zone**; the social layer now includes a proposed **Kayfabe Social Conflict Loop**.

The initial concept captures:

- nested authoring from EyeRig through world placement;
- Story Zone as a non-destructive composition layer;
- live Asset Librarian-backed search;
- actor/profile/activity ownership separation;
- a deterministic Activity / Beat Graph direction;
- ChatterBox as situated dialogue/reaction rather than movement/animation owner;
- portable local-coordinate scenes mountable into future Flat/Sphere/Torus/Hex/Dungeon hosts;
- base recipe + `kfb.scene-patch.v1` edits rather than flattened scene dumps;
- Lore Keeper open-air study/archive nook as the current first proof;
- staged LK-L1 study → LK-L2 Desk/Shelf → LK-L3 book/Card POI discovery progression;
- Activity Stations and semantic sockets;
- Kayfabe buddy-banter / optional social-melee / explicit repair loop;
- Bond, temporary Heat and topic stance kept separate;
- Lean Memory callbacks based on witnessed/participated social events rather than omniscient knowledge;
- Social Attention / proximity bands turn other Residents into candidate social POIs;
- Gift Drive makes giving source-backed props/food/Cards a recurring positive motive without creating a new economy;
- gift + insult/banter are deliberately compatible, with provenance/callbacks retained in Lean Memory;
- simple motive ordering preferred before any complex utility AI;
- Food gifts now have a source-backed candidate lane using existing KayKit Restaurant Bits and Tiny Treats Baked Goods/Bakery/Kitchen/Picnic sources;
- absurd claimed effects are separated from physical gift identity and actual gag outcome;
- Reaction Library semantics now cover micro/social/emotional/gag/repair/object reactions;
- targeted source search found partial laugh-face / surprised-eye evidence but no clearly named full-body Laugh/Cry clip, so body Laugh/Cry remains an animation inventory/authoring gate;
- Minimal Resident Decision Loop v0 now defines interruptibility, perception candidates, small motives, deterministic selection, Pair Lock, host-owned approach, bounded Encounter Bits, explicit transfer commit, compact memory and resume;
- first technical proof is exactly two Residents + one real food gift, no Combat/crowd/utility-AI dependency;
- player-facing Gift Conversations use the canonical KayfaBINGO/KayfaBONGO/KayfaBOGGLE/BLÖDSINN! call family;
- one- or two-turn Bubble microconversations may resolve into a gift without a hidden correct answer;
- bounded player Gift Backpack stores transferable social objects with provenance while Lean Memory stores their history;
- re-gifting is part of the same social loop rather than a separate inventory/quest system;
- source-backed Backpack donors now include Orc and Hoarder files plus Hiker and Protagonist A/B sibling-mesh candidates;
- Protagonist A/B are confirmed Rig_Medium actors with backpack sibling meshes; standalone extraction remains an authoring gate;
- shared social/gift contract v0 now exists as machine-readable JSON;
- v0 defines 8 shared records and 3 deterministic proof fixtures;
- explicit commit points now cover reservation, PlayerCall, accept, TRANSFER_COMMIT, memory commit and release;
- abort semantics prevent half-mutated gift ownership;
- contract aligns to `kfb.scene-patch.v1`, existing NIE adapter hook and MomentReceipt lean-memory direction;
- user correction recorded as **Goth Girl + Elisa setting**, not Crossgirl; Elisa is receiving context, not invented KayKit asset;
- Park Bench retained only as a later minimal/regression fixture.

## Files created so far

- `tools/KFB-ToolBox/_handover/RESIDENT_STORY_ZONE_IDEATION_2026-09-22/LIVING_CONCEPT.md`
- `tools/KFB-ToolBox/_handover/RESIDENT_STORY_ZONE_IDEATION_2026-09-22/START_HERE.md`
- `SOCIAL_GIFT_DATA_CONTRACT_v0.json`
- `SOCIAL_GIFT_FIXTURES_v0.json`
- `SOCIAL_GIFT_CONTRACT_CHECK.md`
- this `RETURN.md`

## Sources actually reviewed

Current GitHub versions of:

- central chat router/workflow/fresh-slice protocol;
- ToolBox START;
- World Building preflight;
- Resident Scene Modules WSA handoff;
- Resident Atlas Recovery + Return;
- shared in-scene editor briefing;
- MVP integration board;
- ChatterBox/Tourbus reuse addendum;
- current KFB Town living sections for NPCs, decks, activities and lean memory.

## Tests / evidence

This checkpoint is documentation/ideation only.

- source retrieval: PASS
- social gift contract JSON parse: **1/1 PASS**
- social gift fixtures JSON parse: **1/1 PASS**
- v0 record types present: **8/8 PASS**
- deterministic fixtures present: **3/3 PASS**
- contract invariants recorded: **12**
- branch creation: PASS
- first concept commit: PASS and exact branch head verified
- recovery entry commit: PASS and exact branch head/file verified
- runtime/browser tests: **NOT APPLICABLE / NOT RUN**
- Cloudflare/public browser proof: **NOT APPLICABLE / NOT RUN**

No implementation or public result is claimed.

## Protected owners retained

- Asset Registry / Librarian
- Resident Atlas / actor composition
- EyeRig / face / graft owners
- Motion/Animation owners
- ChatterBox
- `kfb.scene-patch.v1` shared in-scene editor seam
- current World Building / Surface Adapter lane
- receiving game/world owners for movement, collision, camera, navigation, persistence and gameplay

## Unresolved

- final naming of Story Zone / Scene Module;
- exact candidate schema after real source capability alignment;
- exact current Lore Keeper/lectern/bookshelf/RPG prop source identities and usable animation clips;
- smallest host-approved post-fight repair Activity set;
- first Social Attention distance/interruptibility rules in a real host scale;
- exact first Gift Intent source set per Resident and handoff animation capabilities;
- gift state/provenance seam without inventing a second inventory owner;
- exact first Gift Backpack slot count;
- exact Bubble choice adapter from canonical Calls into ChatterBox/Triplet context;
- standalone extraction/attachment proof for Protagonist A/B backpack sibling meshes;
- GiftInventoryItem persistence concept is decided: Session / Journey / Fractal Almanac; exact storage adapter remains implementation detail;
- canonical host actor/player IDs and ChatterBox caller seam are implementation-resolved details, not Georg gates;
- first visible food gift is decided: Tiny Treats `donut_pink.gltf`;
- exact inventory of reusable full-body laugh/cry/surprise/inspect/gift-accept clips across relevant rig families;
- exact semantic seam from ChatterBox social cue → host social state → optional Combat owner → repair beat;
- current 3D ChatterBox invocation/output contract;
- exact Asset Librarian insertion/search seam;
- path representation across different world surfaces;
- which specialist actor parameters should be exposed through shared nested editor scope;
- live-linked vs pinned Story Zone instances;
- first implementation owner/branch after ideation.

## One next gate

**Choose and prove the first visible pink-donut social gift encounter. Recommended smallest player-facing proof: Orc → player → one Bubble Call → offer/accept → TRANSFER_COMMIT → Almanac/Journey provenance → release/resume.**

Do not build a general World Editor, autonomous NPC system or separate social-combat engine yet.


## Branch divergence note

At the latest checkpoint:

- `main` moved repeatedly during this ideation session; do not trust an embedded historical main SHA as merge truth;
- this concept branch is based on an earlier main history and has continued additively;
- Draft PR #174 currently reports **mergeable: false** against the moved main base.

This does not block ideation/document persistence.

Before any merge/promotion, fetch the then-current `main`, reconcile the branch against it, and re-run the exact-file/head checks.

Do not auto-rebase or auto-merge during the current ideation gate.
