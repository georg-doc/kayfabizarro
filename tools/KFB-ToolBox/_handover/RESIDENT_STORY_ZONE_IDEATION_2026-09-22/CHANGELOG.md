# Resident Story Zones · CHANGELOG

Additive history. Do not rewrite prior entries to erase superseded ideas.

## 2026-09-22 · Initial ideation capture

### USER DIRECTION
- Preserve an ongoing NPC/Resident + ChatterBox + World Builder brainstorming thread in GitHub so chat failure does not lose it.
- Author reusable scenes ranging from one Resident with a few props to complex animated dioramas.
- Use the existing in-scene 3D editor and live asset search.
- Support nested editing from EyeRig / face / graft / actor up through scene groups and world modules.
- Allow authored activities, paths and local interactions such as blacksmith/miner loops.
- Make these modules placeable into the larger world/Hex authoring system.

### PROPOSAL
- Introduced **Story Zone** as a working term for a reusable non-destructive scene composition.
- Proposed one hierarchical authoring grammar:
  `EyeRig → Face → Head/Graft → Resident → Activity → Scene → Story Zone → World placement`.
- Story Zone sits above existing asset/profile/activity owners and below the receiving world/runtime owner.
- Proposed local-coordinate composition plus future host Surface Adapter mount.
- Proposed Activity / Beat Graphs before any general autonomous NPC AI.
- Proposed a Zone Context Packet for situated ChatterBox calls.
- Proposed **Park Bench micro-scene** as the smallest first implementation fixture and **Forge micro-story** as the second.

### SOURCE ALIGNMENT
Confirmed this concept must reuse rather than replace:
- Resident Atlas;
- Resident Scene Module seam;
- shared `kfb.scene-patch.v1` editor;
- Asset Registry / Librarian;
- ChatterBox donors;
- current World Building / Surface Adapter preflight;
- existing Motion/Animation/EyeRig/face owners.

### IMPLEMENTATION STATUS
Documentation only. No runtime change, browser test, Stage deployment or public verification.


## 2026-09-22 · Activity Stations extension

### PROPOSAL
- Add **Activity Stations** as object/place-side affordances: bench seat, anvil work target, mine entry, pickup/dropoff, conversation and SFX/VFX anchors.
- Bind Residents through capability/activity adapters instead of scripting character-specific coordinates/clips into every scene.
- Allow Story Zones to use either a concrete cast or reusable role slots such as `role.blacksmith` / `role.miner`.
- Add semantic sockets/anchors for drag-and-drop authoring.
- Prefer breadcrumb scope navigation for nested editing so the scene remains visually dominant.


## 2026-09-22 · Lore Keeper first fixture + Kayfabe social loop

### USER DIRECTION
- **Lore Keeper** replaces Park Bench as the first concrete Story Zone proof.
- Build a portable open-air study/archive nook around the existing Lore Keeper, writing lectern, books/RPG props, optional bookshelf and backpack.
- Grow activity in stages: LK-L1 study/read/think; LK-L2 Desk ↔ Shelf; LK-L3 local book/Card POI discovery and archive loop.
- Avoid spending the first gate on pencil-scale hand alignment or a full enclosed library.
- NPC social life remains chill & fun / best-buddy by default, while permitting intense banter, provocation, arguments and optional cartoon/Kayfabe fights.
- After social combat, visible relational repair is part of the encounter: help-up, laugh, shared activity/drink, friendly boast or amicable separation.
- Destruction/rebuilding can use the same cartoon worldview where suitable: damage creates play/work and some Residents may enjoy having something to rebuild.

### PROPOSAL
- Keep **Bond / familiarity**, **temporary Kayfabe Heat**, **topic stance** and **current scene context** separate instead of one friend/enemy score.
- Add a reusable social encounter grammar:
  `MEET → BANTER → TEASE/COUNTER → optional PROVOKE/CHALLENGE → optional KAYFABE_SCRAP → REPAIR → RESUME`.
- ChatterBox may emit semantic social cues but cannot start Combat or write damage.
- A future `KAYFABE_SCRAP` mode would be a bounded, non-hostile social-combat request consumed by the existing Combat/Melee owner.
- Lean Memory stores compact social event receipts and actual knowledge paths, not full transcripts or omniscient NPC knowledge.
- Cards may become remembered social topics without turning opinions into personality/ideology scores.
- The satire should be shown through behaviour rather than explained: fierce disagreement / absurd escalation / immediate friendship repair.

### CORRECTION
- Park Bench remains a useful later regression/minimal fixture but is no longer the first Story Zone implementation candidate.

### IMPLEMENTATION STATUS
Documentation/ideation only. No NPC AI, ChatterBox runtime, Melee integration, Story Zone runtime or public Stage result was built in this checkpoint.


## 2026-09-22 · Social Attention + Gift Drive

### USER DIRECTION
- Model NPC-to-NPC notice/engagement somewhat like MMO aggro: another Resident entering range can become a social Point of Interest.
- Proximity is not automatically hostile; it can trigger greeting, banter, gifting, showing an object/Card, shared activity or challenge.
- Giving things should be a major social motive: every Resident may have something they would like to give another Resident.
- Gifts can be props, food, Cards or other real source-backed objects.
- Gift-giving may happen simultaneously with insults, mockery, provocation and rough buddy-banter.
- A Resident visibly carrying a signature prop may eventually give that object or an equivalent gift-state to another Resident.

### SOURCE ALIGNMENT
- Existing Town direction already includes Market giving/trading.
- Existing Town direction already treats gift provenance as meaningful state.
- No new economy/currency or second inventory owner is introduced.

### PROPOSAL
- Add `SOCIAL_ATTENTION_RADIUS` / staged perception bands: FAR → NOTICE → ENGAGE → PERSONAL.
- Another Resident becomes a candidate social POI rather than an automatic interaction.
- Add lightweight per-Resident **Gift Intents**, source-backed through Asset Registry/Librarian.
- Allow gift sources from carried signature props, local-world items or already-proven activity-produced items.
- Social grammar may include:
  `NOTICE → APPROACH → BANTER → OFFER_GIFT → REACT → optional COUNTER-GIFT / CHALLENGE / SCRAP → REPAIR → RESUME`.
- Gift and insult are intentionally compatible.
- Prefer simple ordered social motives before any complex utility AI.
- Reuse Activity Station / semantic-socket grammar for handoff, show-item, accept, help-up and walk-together beats.
- Store compact gift provenance + Lean Memory event receipts; no full-transcript or omniscient-memory model.
- Do not reduce gifts to numeric friendship points; use them to create callbacks, visible props, return-gift motives and shared history.
- Add cooldown/one-pending-intent rules to avoid gift spam and infinite reciprocal loops.

### IMPLEMENTATION STATUS
Documentation/ideation only. No social perception runtime, navigation AI, inventory/economy system, gift transfer runtime or browser Stage was built.


## 2026-09-22 · Food Gifts + Reaction Library + Decision Loop v0

### USER DIRECTION
- Use KayKit food props and Tiny Treats food/venue packs as a major practical Gift Drive source.
- Gift framing may include bizarre taste claims and absurd promised effects rather than fixed repeated lines.
- Example concept directions include an Orc offering Lore Keeper an ominous miracle donut for baldness and a Skeleton giving Goth Girl a mood-improving present that produces a cartoon soot/flame gag followed by shared floor-rolling laughter.
- Add triggerable reaction concepts including laughter, crying and other short/emotional/cartoon reactions.
- Prioritize the **minimal technical Resident decision loop** before a per-character gift taxonomy.

### SOURCE EVIDENCE
- Repo source contains Tiny Treats Baked Goods, Bakery Interior, Charming Kitchen and Pleasant Picnic pack trees.
- Repo source contains KayKit Restaurant Bits food assets including `food_burger.gltf`, `food_stew.gltf`, `food_dinner.gltf` and multiple ingredient props.
- Targeted repo search found a documented **laugh face tile** for the Action Figure head and semantic `surprised` EyeRig state evidence.
- Targeted repo search did **not** locate a clearly named full-body `Laugh` or `Cry` animation clip. Laugh/Cry body reactions remain an explicit animation inventory/authoring gate rather than a claimed capability.

### PROPOSAL · Food / Reaction
- Separate gift object, claimed effect, visible gag outcome and social aftermath.
- Add Gift Gag grammar:
  `NOTICE → APPROACH → BANTER → CLAIM/HYPE → OFFER → ACCEPT/OPEN → GAG → SHOCK_BEAT → REACTION_PAIR → REPAIR/CALLBACK → RESUME`.
- Add semantic Reaction Library categories: micro, social, emotional, gag/impact, repair and object reactions.
- Add semantic triggers such as `gift.gag.soot`, `social.sharedLaugh`, `emotion.cry`.
- Motion/Animation owner resolves exact clips; missing reactions fall back or remain visually unsupported rather than inventing animation evidence.

### PROPOSAL · Minimal Resident Decision Loop v0
- Residents remain in their current Activity most of the time and reconsider only at interruptible beats or meaningful events.
- Core loop:
  `ACTIVITY → PERCEIVE → NOTICE → CAN_INTERRUPT? → MOTIVES → SELECT → RESERVE → APPROACH → ENCOUNTER → REACT/COMMIT → MEMORY → RELEASE → RESUME`.
- First motive set remains small: RESPOND, GIFT, CALLBACK, SHOW, BANTER, SHARED_ACTIVITY, CHALLENGE, INSPECT_POI, CONTINUE.
- Use explicit priority + small per-character biases before any opaque utility-score system.
- Add seeded tie-breaks for reproducible variation.
- Add a Pair Lock / Social Reservation so crowds do not simultaneously target one Resident.
- Host navigation owns physical approach; social logic must abort safely if path/target/availability changes.
- Gift ownership changes only at explicit `TRANSFER_COMMIT`.
- Durable Lean Memory is written only after meaningful completed Bits.
- Per-pair cooldowns / reacquisition blocks prevent infinite gift or banter loops.
- Debug authoring should expose why a motive was selected.

### FIRST TECHNICAL PROOF
Exactly two Residents + one real food gift:
1. ordinary Activities;
2. recipient enters Social Attention;
3. giver reaches interruptible beat;
4. GIFT selected and explained;
5. Pair Lock;
6. host-owned approach;
7. short banter;
8. single transfer commit;
9. one receiver reaction;
10. shared settle/laugh;
11. one compact Memory receipt;
12. both resume.

No Combat, crowd AI or complex utility scoring in this first proof.

### IMPLEMENTATION STATUS
Documentation/ideation only. No Resident decision runtime, Reaction Library runtime, food handoff runtime, animation authoring or public Stage proof was built.


## 2026-09-22 · Player Gift Conversations + Backpack Inventory

### USER DIRECTION
- Extend Gift Drive to NPC→player and player→NPC.
- NPC gifts should usually resolve through a short in-world Monkey-Island-like conversation rather than a detached reward popup.
- Use Triplets / ChatterBox and the existing call family: KayfaBINGO / KayfaBOGGLE / KayfaBONGO / BLÖDSINN!.
- One or two player choices are enough before a gift offer.
- Player receives an early visible Backpack with deliberately limited capacity.
- Gifts in the Backpack can later be re-gifted to Residents.
- Backpack acts as a social-memory inventory metaphor, not a survival/weight system.
- User correction: intended scene reference is **Goth Girl + Elisa**, not “Crossgirl”.
- Protagonist A/B backpack designs are desired presentation candidates for the Elisa-oriented setting with Goth Girl.

### SOURCE ALIGNMENT
- Canonical labels confirmed in current Overworld/KFB sources:
  `KayfaBINGO · KayfaBONGO · KayfaBOGGLE · BLÖDSINN!`;
  IDs remain `bingo/bongo/boggle`.
- Current S38 donor evidence confirms Protagonist_A and Protagonist_B as Rig_Medium figures with visible backpack sibling meshes.
- Protagonist backpack meshes are source-backed inside the character files, while free-standing promo backpacks are Blender-separated copies, not normal standalone source files.
- Additional current backpack donors include Orc Backpack, Hoarder Backpack and Hiker_Backpack sibling mesh.
- Goth Girl remains a source-backed Resident.
- Elisa is treated as receiving setting/context in this concept; no KayKit Elisa actor/source is invented.

### PROPOSAL
- Player Bubble Calls are conversation moves, not a right/wrong quiz.
- Typical player gift flow:
  `NPC NOTICE → Triplet → PLAYER_CALL → NPC_REPLY → optional PLAYER_CALL → GIFT_OFFER → ACCEPT/DEFER → TRANSFER_COMMIT → BACKPACK → MEMORY → RELEASE`.
- Gift normally rewards social completion/engagement, not one “correct” Call.
- Backpack visual profile and Gift Inventory remain separate.
- Gift Inventory records canonical source ref + provenance; it never duplicates model binaries.
- Inventory and Lean Memory remain separate:
  inventory = what player currently carries;
  memory = what happened around it.
- Re-gifting preserves provenance and creates new recipient callbacks.
- Limited capacity should create curation / circulation, not grind.
- Protagonist A/B backpack sibling meshes become visual donor candidates requiring their own extraction/attachment proof before use as selectable standalone player backpacks.

### FIRST PLAYER-FACING PROOF
After the basic two-NPC gift proof:
1. one Resident notices player;
2. one real food Gift Intent;
3. Bubble opens;
4. one canonical player Call;
5. one NPC reply;
6. gift offered and accepted;
7. exactly one TRANSFER_COMMIT;
8. Backpack displays one item reference + provenance;
9. exactly one Lean Memory receipt;
10. interaction releases to world control.

Second proof: player gives the same object to another Resident while origin provenance remains readable.

### IMPLEMENTATION STATUS
Documentation/ideation only. No player dialogue UI, Backpack inventory runtime, backpack extraction, save integration or public Stage proof was built.


## 2026-09-22 · Shared Social / Gift Data Contract v0

### CONTRACT SHAPED
Added:
- `SOCIAL_GIFT_DATA_CONTRACT_v0.json`
- `SOCIAL_GIFT_FIXTURES_v0.json`
- `SOCIAL_GIFT_CONTRACT_CHECK.md`
- Living Concept §27 commentary.

### V0 RECORDS
Exactly eight shared record types:
- ActivityState
- PerceptionCandidate
- Motive
- SocialPair
- EncounterBit
- PlayerCall
- GiftInventoryItem
- MemoryReceipt

### COMMIT POINTS
The contract makes these explicit:
- SocialPair reservation;
- PlayerCall creation;
- gift accepted;
- `TRANSFER_COMMIT`;
- MemoryReceipt commit;
- release/resume.

Gift ownership changes only at `TRANSFER_COMMIT`.

### SOURCE ALIGNMENT
- `kfb.scene-patch.v1` remains scene-transform owner.
- `NIE_ADAPTER_HOOK.md` remains bounded semantic-generation contract donor.
- existing MomentReceipt direction remains Lean Memory architecture donor.
- canonical Calls verified, including `bloedsinn → BLÖDSINN!`.
- first fixture gift points to real KayKit Restaurant Bits `food_burger.gltf`.

### FIXTURES
- `RR-GIFT-01` Resident→Resident;
- `RP-GIFT-01` Resident→Player Bubble Call + Backpack;
- `PR-GIFT-01` Player→Resident re-gift preserving provenance.

### STATIC EVIDENCE
- contract JSON parse **1/1 PASS**;
- fixture JSON parse **1/1 PASS**;
- records **8/8 present**;
- fixtures **3/3 present**;
- invariants **12 recorded**.

### IMPLEMENTATION STATUS
Contract/documentation only.

No social runtime, navigation, ChatterBox integration, Bubble UI, animation, Backpack attachment, inventory/save persistence, browser test or Cloudflare Stage result is claimed.


## 2026-09-22 · Almanac persistence + pink donut

### USER DECISION
- Gift Inventory persistence belongs conceptually to the existing **Session / Journey / Fractal Almanac** layer together with journey events and Lean Memory.
- Do not create a separate gift-save system.
- First visible Gift proof uses **Tiny Treats `donut_pink.gltf`**, replacing the temporary burger fixture.
- Exact source:
  `media/3D_Assets/Tiny_Treats_Baked_Goods_1.0_FREE/Assets/gltf/donut_pink.gltf`.

### SOURCE ALIGNMENT
- Existing KFB source describes Fractal Almanac as collection, Journey Memory, Replay/Story layer and Save metaphor.
- `donut_pink.gltf` is Registry/source-backed and already referenced by an existing KFB donor.

### CONTRACT UPDATE
- `SOCIAL_GIFT_DATA_CONTRACT_v0.json` now records the persistence concept decision and first gift asset.
- all three `SOCIAL_GIFT_FIXTURES_v0.json` fixtures now use the pink donut.
- contract evidence updated accordingly.

### HUMAN-GATE SIMPLIFICATION
The following are implementation details, not questions Georg must answer:
- canonical host actor/player IDs;
- exact ChatterBox caller/adapter seam.

Implementation must recover these from the chosen host and existing ChatterBox owner.

### IMPLEMENTATION STATUS
No runtime implementation, visual carry/handoff proof, browser test or public Stage result was built.
