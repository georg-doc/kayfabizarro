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
- `ACCESS_PROP_CANDIDATES_v0.json`
- `VFX_CANDIDATE_LANE_v0.json`
- `ACCESS_VFX_SOURCE_CHECK.md`
- `ORC_BAND_WORLD_LIFE_START_HERE.md`
- `ORC_BAND_DONOR_CHECK.md`
- `ORC_BAND_WORLD_LIFE_RECIPE_v0.json`
- `ORC_BAND_WORLD_BUILDER_POC_BRIEF.md`
- `MUSIC_COLLECTIBLE_JUKEBOX_v0.json`
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
- Access key/keyring/keycard exact source check: **PASS**
- gold/silver separate source variants: **NOT PROVEN / DEFERRED**
- VFX linked handoff inspected: **132 candidates / 91 FX_Visual**
- existing `kfb-vfx.js` donor reuse path: **SOURCE VERIFIED**
- curated `media/3D_Assets/KFB/` snapshot enumerated: **140 entries**
- Orc Band user handoff inspected: **211 candidates**
- exact Orc/WarDrum/electric-guitar/mic/trumpet sources: **SOURCE VERIFIED**
- Toy Soldier reveal donor: **SOURCE/RECIPE VERIFIED**
- shared Guitar-playing clip: **NOT PRESENT / PROCEDURAL DONOR USED**
- Rig_Large drum clip: **NOT PRESENT / AUTHORING ADAPTER REQUIRED**
- trumpet-to-mouth play clip: **NOT PROVEN / DEFERRED**
- Orc Band runtime/browser/Stage: **NOT BUILT / NOT RUN**
- Music Collectible / Backpack HUD / visualizer runtime: **NOT BUILT / NOT RUN**
- Tourbus source identity: **VERIFIED / PINNED**
- Tourbus band-specific presentation/branding: **DEFERRED**
- Tourbus driving/vehicle integration: **DEFERRED TO VEHICLE OWNER**
- MP3 audible review in this chat: **NOT AVAILABLE THROUGH GITHUB CONNECTOR**
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
- first gold/silver key material/source proof;
- first AccessProp runtime consumer/target proof;
- first isolated VFX donor proof for muzzle/slash/impact/blood/world cue;
- exact held-electric-guitar profile on Orc Raider;
- exact procedural War Drum strike adapter on Rig_Large;
- Legacy microphone/trumpet mouth-performance proof;
- final Suno Orc Band stems and world-scale spatial-audio tuning;
- canonical Jukebox promotion of the already human-selected Orc Band signature candidate;
- per-track BPM/loop/beat-offset metadata for the selected track;
- 20-slot Backpack HUD runtime and its save owner adapter;
- Track Unlock / Almanac persistence adapter and Jukebox catalog promotion;
- full-mix visualizer proof before any paid stem download;
- Offica seeded spawn cadence / cooldown after forced-spawn proof;
- optional Combat-owner handoff and return for the Orc Band interruption;
- gift state/provenance seam without inventing a second inventory owner;
- exact first Gift Backpack slot count;
- exact Bubble choice adapter from canonical Calls into ChatterBox/Triplet context;
- standalone extraction/attachment proof for Protagonist A/B backpack sibling meshes;
- GiftInventoryItem persistence concept is decided: Session / Journey / Fractal Almanac; exact storage adapter remains implementation detail;
- canonical host actor/player IDs and ChatterBox caller seam are implementation-resolved details, not Georg gates;
- first visible food gift is decided: Tiny Treats `donut_pink.gltf`;
- first Player Proof is decided: **Orc → Player → pink donut**;
- Access Props / Keys are now an additive physical-access lane for mini-games, decks, worlds, dungeons, portals/events/scenes;
- exact key/keyring/keycard source candidates are pinned; gold/silver remain desired visual/access variants with source proof pending;
- VFX candidate lane now reuses the existing `kfb-vfx.js` donor rather than inventing a second VFX runtime;
- candidate VFX families include muzzle, slash/sweep, impact, electric/blitz, blood, explosion, fire/smoke, dirt/scorch and access/world cues;
- historical donor rejection of blood is preserved; current user direction reopens stylized blood FX as a candidate;
- `media/3D_Assets/KFB/` is recorded as Georg's curated future donor shortlist, not a second registry;
- Orc Band World-Life packet is now prepared as a future WorldBuilder fixture;
- band identity is now **The KayfaBizarros**;
- exact bouncing bandleader is pinned to `character_orcB.gltf` at user-pinned commit `e0037d79...`;
- exact Tourbus donor is pinned to `Truck Armored by Quaternius - VvX8nmoCN5.glb`;
- Tourbus first use is parked scenic landmark only; later driving/deformation stays with the existing Vehicle / Cartoon Vehicle Deformer owner;
- Music Collectible / Jukebox lane now separates track unlocks from physical cassette artifacts;
- **Permitless Funk** is now the human-selected Orc Band signature-style candidate, using `Rubbish Groove 2min A extend 01.mp3`;
- Legacy frontman direction is now black-ponytail/dark-topknot Orc with beat-synced root bounce + squash/stretch + seeded hype variation;
- exact black-ponytail bandleader mapping is resolved: `character_orcB.gltf`;
- first visualizer remains full-mix beat/level/pulse driven; no stems required for v0;
- a RoadTrip sibling track is desired in the same Permitless-Funk family, with more open-road/cruising atmosphere and no Race/final-lap urgency;
- unlocked tracks persist in Session/Journey/Fractal Almanac and do not consume the 20 physical Backpack slots;
- proposed Backpack HUD is a compact icon + 4×5 / 20-slot overlay for physical transferable/access objects;
- current canonical Jukebox/Music Bus is reused for on-foot/dungeon/flight/vehicle/Race playback rather than creating a second radio engine;
- live Band audio is spatial/diegetic while personal Radio is global; v0 ducks/fades Radio near live performance zones;
- current audio donor already exposes beat/level/pulse/bpm, enough for a no-stems first Orc Band visualizer;
- six current Orc Band track files are recorded as candidates, not canonical Jukebox entries;
- current KFB pool includes a Car Radio with tape player plus multiple cassette/tape donors; exact Michael-Fuchs duplicate pair is noted;
- cast is pinned to Legacy `character_orcB` bandleader + Rig_Medium Orc Raider + Rig_Large Orc Brute;
- real War Drum / stick and electric guitar A/B source candidates are pinned;
- current source truth says no shared guitar-playing clip and no Rig_Large drum clip, so performance adapters are procedural/authoring candidates rather than invented animation names;
- Offica Doppeldenk now concretely consumes the Toy Soldier/Nutcracker donor and Resident Atlas 4.8 s gift-box reveal;
- Offica patrol generalizes into `kfb.patrol-resident.v0` while navigation remains host-owned;
- spatial audio direction now references an existing KFB WebAudio HRTF/inverse-distance donor and real technical drum/guitar stems;
- current Town Offica characterization is reused rather than reinvented;
- old Performance Suite War-Drum-source gap is superseded additively by current Resident Atlas/source evidence;
- exact inventory of reusable full-body laugh/cry/surprise/inspect/gift-accept clips across relevant rig families;
- exact semantic seam from ChatterBox social cue → host social state → optional Combat owner → repair beat;
- current 3D ChatterBox invocation/output contract;
- exact Asset Librarian insertion/search seam;
- path representation across different world surfaces;
- which specialist actor parameters should be exposed through shared nested editor scope;
- live-linked vs pinned Story Zone instances;
- first implementation owner/branch after ideation.

## One next gate

**Current execution gate remains WorldBuilder WB1-P1 → P2 after completed P0. Music/HUD/Jukebox work is prepared but deferred. After P1/P2, the Orc Band packet may consume one selected track for its first World-Life/music visualizer proof. The Orc→Player pink-donut proof remains the first player-social proof.**

Do not build a general World Editor, autonomous NPC system or separate social-combat engine yet.


## Branch divergence note

At the latest checkpoint:

- `main` moved repeatedly during this ideation session; do not trust an embedded historical main SHA as merge truth;
- this concept branch is based on an earlier main history and has continued additively;
- Draft PR #174 currently reports **mergeable: false** against the moved main base.

This does not block ideation/document persistence.

Before any merge/promotion, fetch the then-current `main`, reconcile the branch against it, and re-run the exact-file/head checks.

Do not auto-rebase or auto-merge during the current ideation gate.
