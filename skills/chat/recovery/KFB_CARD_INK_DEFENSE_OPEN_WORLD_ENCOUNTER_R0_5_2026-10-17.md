# KFB Card Ink Defense · Drawn-in-Clay Card Zones, Censorship Monsters & Vertical Encounters R0.5

**Date:** 2026-10-17 · **Status:** COMMENTED GEORG IDEATION / SOURCE RECONCILIATION ONLY — NOT a playable integration.  
**One receiving current runtime owner:** KFB WS1, `ws1/r3f-frame` (R3F/Rapier/ecctrl), under WS0 source/data/decision steering `docs/kfb-decisions-register-2026-10-11` / `ARCHITECTURE_R1.md` (V-228).  
**Documentation writer:** existing Fluff/Minigames recovery branch `recovery/kfb-minigames-fluff-source-bridge-2026-10-15`, Draft PR #400, `georg-doc/kayfabizarro`. No new renderer, second Combat runtime, Stage route or production World.  
**Product goal:** a scattered **canonical KFB Card** can be an optional, compelling temporary battlefield in the living clay world. A few infected ink-blot monsters converge on it, spit canon-black ink and threaten to censor its visible artwork. The player may defend/heal the card through existing Combat/Travel/Resident mechanics, recover a genuine Card with one owner-backed receipt and add a meaningful Almanac memory. Later a source-proven vertical Card-Hex platforming variant can expand the same encounter family.

## 0 · WS0 intake: what is actually accepted as of 17 October

**YES, some recovered concepts have been taken into WS0 decisions, independently of PR reviews.** Current steering ref `docs/kfb-decisions-register-2026-10-11` observed HEAD `255b25cfeaedb6ea83315b03faaf8c970f502c01`; `DECISIONS.md` and `ARCHITECTURE_R1.md` read from exact branch.
- **V-333 / V-334:** 3D target arrow and pitch in Flight from Web Chat R0.3, plus HUD R4 radial Social Calls, moved to a world-space arrow and one HUD. No fake separate 3D compass UI owner.
- **V-368:** six Story-Mode Fluff hues and six-ball Card recipe proposal with practical all-biome resource distribution, High/Low still retained as data. **WS1 Slice 1**, no automatic hard gate.
- **V-369 / V-371:** Diorama kit, living chests/props, Fluff activities, drifting pickup, song landmark, Almanac field notes etc. accepted for scheduling.
- **V-082 / V-181:** resource nodes and “cultural mechanics” including gifts, dance, debate, brawl, fishing etc. remain non-MVP designs.
- **V-396:** WS0 says `kfb.save/1` already contains Card, Fluff inventory and rolls; earlier recovery note from October 9 that PlayerSave has no implementation is **historical** for the old Lab, NOT reliable for current WS1. Exact current runtime/readback not re-tested in this ideation.
- **V-209 / V-213 / V-228:** WS1 R3F/Rapier/ecctrl is sole productive scene/runtime; WS0 registers decisions/data; Claude Design yields pictures/specs; old Island Worldbuilder Lab 5192 is donor library, not game owner. **Do not follow older v0.3–v0.7.1 prose that assigns the productive World runtime to WB2 or Lab**; current steering wins.
- **PR #400 itself:** as of this audit, open/draft/unmerged and **zero human issue comments, zero PR reviews and zero inline review comments**, only Cloudflare bot auto-deploy note. This is NOT proof WS0 read every R0.1–R0.4 document. Only specific above V-decisions are confirmed WS0 uptake. WS0 must explicitly accept/schedule new Card Ink Defense.

## 1 · Combat source donor inventory: real files, boundaries, chronology

**Canonical donor repo:** `georg-doc/KFB-Combat-Arena` main observed HEAD `f6a59ad15b9ffcf3164b0ab013f223962b63f61f`. The donor is a standalone historical Arena, not the WS1 world engine.

| Exact Combat file / status | Verified source role | Limit / integration caution |
|---|---|---|
| `combat-arena-v1/arena-ring.v1.js` (blob `4a066fa1ead6d771ec3052d57e6f6b40befc414a`) | A real **source PDF/Cardbuilder-sourced KFB card as flat walkable combat surface**; canonical outline source, card level stack and vertical concept. | Flat/special-purpose Arena card material, **not** current WS1 clay Terrain source. No assumption that UV projection onto slopes is solved. |
| `combat-arena-v2/mobs.v2.js` (blob `02928eee3c351b1694a1097e17779bbdb2290050`) + `modules/kfb-monster-roster.js` (blob `48586e56e3b43d3e4b608e15cce53059f56c770d`) | Spawn separation, mob navigation/look and real 21 Quaternius MonsterCuteCubes source meshes. Native attack clips generally `Bite_Front`, NOT a guaranteed native **Spit** clip. | Can donate appearance / choreography / size audits only; cannot copy legacy Mob brain, damage owner, animation mixers or three@0.160 host into R3F. Some flyers have `Flying`, walkers lack fly clips; source roster identifies explicit substitutions. |
| `combat-arena-v3/spuck.v3.js` (blob `26b2bb9b0e1446c592a55a891fb6b43135953dbc`) | Source **procedural spit sequence**: ~0.34s readable turn/anticipation, actual muzzle aligned with visible facing, 3–5 small droplets, ballistic travel (~0.42–0.95s), impact **then** write ink. | Source contains known historical repair notes for spit coming from the enemy's back / falling from mid-body. Do not infer all native Monster rig animations spit or blindly bind to the current actor. Re-prove source muzzle and current animation event before inclusion. |
| `combat-arena-v3/zensur.v3.js` (blob `d5585b942d08d5d95a370eefb73df44c006445f2`) | Canvas ink source of truth: each hit stamps one of 36 Kenney splat masks into **KFB ink #1f1a14** in Card-local UV; defined measurable coverage, loss condition at fully censored card; child of Card geometry so transform stays aligned. | Source of historical *isolated* censorship truth. Does not own current WS1 terrain, PlayerSave, Card collection or new 3D actor/hit authority. |
| `combat-arena-v3/flood.v3.js` (blob `3a4502973167709a5fea6e19a5e28f8dff1bcec1`) | Only visual GPU ink spread, Canvas censorship events remain authority; ping-pong shader and local Card mask; fixes noted for stair-stepping/pixelated edges and readback. | Expensive/discontinuous donor; do not drop a new full-window GPU flood into WS1 or call ink opacity a substitute for gameplay cover truth. Adapt only if current WS1 material and performance budget allow. |
| `docs/ENTWURF_zensur-und-heilung.md` (blob `e55bdd2e6e8a9be5e1dee85ee8ef92e085e35edb`) | **Original Georg metanarrative:** infected monsters **censor** Cards. FrizzleBob conceptually **heals, not kills**; rehabilitated monsters have readable white cartoon eyes, stop spitting and may leave flower trails. Card becomes a visual threat-clock; intervening means risking hits. | Some S13/S14 healing/flower ideas were proposals and are not automatically proven runtime animations. Preserve as candidate. Do not rewrite infection as generic evil/rage enemies or assume every boss is lethal. |

**Related platformer source:** `georg-doc/KFB-Combat-Arena` PR #18 (planning) and PR #19 (Coworker one-shot) remain OPEN/DRAFT/UNMERGED. PR #19 `STATUS.json` source branch `coworker/card-hex-ascent-one-shot-2026-10-04` reports an S3 technical **PUBLIC_VERIFIED/HUMAN_GATE** (4 Card stages, three KayKit Hex traversal family zones, assisted jumps, ranged fights, result/restart). An independent current browser or Georg human **PASS** was not performed here; original screenshot critic still flags look/coherence issues. Another current PR #20 explicitly calls some Card-Hex donor visuals human-failed and preserves them as references. Treat PR #19 as a **measured historical traversal/encounter research donor**, not a production-ready replacement World or user-approved level look. Do not name old reserved Stage as new acceptance target.

**Additional Card/Ink authority:** `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md` and current Deck Registry define original `deckId+cardNumber` + source PDF/Card JSON + Almanac provenance. `skills/kfb-ink-canon.js` / current WS0 Card Builder/Viewer own the KFB printed outline; the Arena donor must reuse actual source ink and card proportions, not author a second KFB border renderer.

## 2 · Author's gameplay beat: a Canon Card becomes a lure in the living world

A found Card is first a **source-authorized World/Deck POI**, not instantly a combat arena everywhere.

**Illustrative encounter (Chill default, entirely optional unless specifically authored as a short challenge):**
1. While exploring a Diorama, player approaches a real `CardRef` represented by a **small flat printed Card / embossed Card zone** on the actual source-backed Clay terrain, its KFB ink outline readable at normal camera height. The card's worldview/topic gives the scene a reason to exist. This remains the *same original Card*, not a new offbrand poster. Noncombat pickups elsewhere continue to work.
2. Player taps/steps near it; one short ink/semantic *activation beat* acts as a **diegetic attractor**. A real approved `CardZoneRef` / Encounter authoring node requests a compact, seeded, capped wave from the **existing WS1 combat/enemy owner**, never a separate randomly spawning monster factory.
3. A few non-playable **infected MonsterCuteCubes** enter from grounded, eligible, visible points with safe spawn distance and anticipation; the card is their *reason for appearing*. They may try to walk across or **spit** on the Card, not necessarily attack the player first. Visual directions, attack origin, gaze and current actual rig matter; no enemy silently emerging inside player capsule or below terrain.
4. Each valid sourced hit places one canonical-looking ink stamp in the **Card-local censorship overlay**. The stain may slowly connect/fill (not a giant black rectangle), while the original Card can still be recognized. **One source event → one coverage modification; ink particles/VFX do not issue awards or duplicate hit events.**
5. The player can interact through a simple Combat-approved response: repel/cure an infected creature, interrupt its spit beat, use an approved item/Fluff/VFX countermeasure, or choose a contextual ChatterBox/social intervention **if that capability is accepted**. No forced invented weapon/ability, no free-form LLM text controlling HP or rewards. Curing/flowers is an appealing author-canon treatment to verify later.
6. Success (defend/clean/reconcile encounter) triggers a satisfying **ink lift/peel/reveal of the real Card art** and source-only `DropRef.OFFERED`. Then existing R0.4 **OK / KayfaBINGO!** Card acquisition path grants exactly once and files provenance in the same Fractal Almanac; optional `KayfaBOGGLE?` can inspect meaning. Quest/Resident/Deck Homebase may recognize that authentic receipt.
7. If the Card becomes black before the player acts, **the authored challenge is temporarily lost or reset**. **Do not permanently erase, corrupt, counterfeit or remove the canonical Card in Chill.** It may reappear after a readable recovery, later return, rescue/cleanup task or alternate peaceful path. A repeated fail must not create duplicate reward rolls. The source original Card never becomes an irreversible black PNG. Standard/Hard may later tune threat/recovery, not change Card identity.

**Narrative upside:** an authentic Card is a *worldview time capsule*, while monsters physically **censor it**. The player isn't just farming XP; defending, healing or recovering a Card makes a contested interpretation visible. The older Zensur concept's threat-clock is genuinely diegetic: remaining visible Card surface expresses urgency without a separate HUD countdown. Sickness/official censorship can be framed through Academy/Prison Planet lore if the actual authored story approves; do not invent a canonical Academy origin for the infection by inference alone.

## 3 · Visual grammar: a Card drawn IN clay terrain, not generic paper plane

The user wants a Card/Zone that visually **belongs to the clay world**. Treat it as a *card-shaped physical/drawn zone*, not a glossy floating UI/green-screen quad:
- **Ground truth:** WS1 World/Terrain owner supplies surface location, tangent/normal, valid support and collider; flat cards use a shallow **source-Card plate/decal/embedded print** just above the existing surface, slope-aware within acceptable tilt. Does **not** carve new collision terrain or own the topography. A true playable Card floor/platform later requires the existing actual physics/platform owner to approve it as a deliberate bounded source object.
- **Card truth:** original PDF/Card image and actual Card aspect ratio/crop remain readable at close inspection. World-sized version may use native resolution/LOD while fully collected Card remains the true original source PDF; no AI-redrawn picture masquerading as Card. Card title + KFB ink outline `#1f1a14` from current ink SSOT remains correct. Avoid discoloring the original asset by using random biome tint to overwrite the print.
- **Clay integration:** modest irregular clay edge/ink emboss and `edgePalette`-compatible world-to-card transition (rim/soft supported contact); no straight ungrounded rectangle that floats over an uneven terrain mesh. At normal 3/4 gameplay camera Card silhouette remains recognisable. Source clayed surroundings, lower-right ink-outline/shadow logic, adequate shadow/contact, organic boundary marking; *no generic neon box or portal ring unless that module is source-justified*.
- **Censorship overlay:** the black splotches conform to the printed Card's **local UV/surface**, and its growing boundary follows Card mask; not the entire World terrain shader. Dynamic ink may darken just the Card while background clay stays its owner material. No uncontrolled second fullscreen compositing system, no texture race, no thick aliased dark polygon; use donor's event-source / visual-flood separation.
- **Return visual:** peel/lift the ink, maybe small clay curl/fragments/flower clue once defended; the Card itself becomes a small original-looking animated pickup and flows into the true existing PDF Hero Reveal/Almanac path. A Card printed on ground is not a permanent destructible terrain sticker, and the ink cannot turn the permanent PDF/Card registry black.
- **World scale:** make the *small* found Card readable as Card at source Medium-Rig K2/WS1 accepted scale, but don't enlarge it so one pickup always occupies a full football-field-sized arena. For explicit Card-Hex stages, the Card-shaped platform may be substantially larger and its structural perimeter is a gameplay boundary, unlike an ordinary find on the ground.

## 4 · Two distinct encounter scales, one card/combat truth

**A. Small Open-World Card Defense (first later proof):**
- one true Card on real current WS1 World ground, one optional encounter POI, **2–3 sourced monsters** as illustrative upper bound subject to owner budget, short spitting/ink threat, optional player combat/heal, one afterglow/loot receipt;
- duration should suit Chill & Fun and allow walking away/retrying instead of locking the current world; most deck Cards can still be picked up peacefully per Deck Homebase R0.2;
- the World is not converted into the v3 Arena host. WS1 owns actor controller, combat/lifecycle, camera, spawn and entry/exit. Arena contributes donor *behaviour and look*, consumed through a short bounded semantic action contract. No second AnimationMixer/audio/Three context/Ink owner as new runtime.

**B. Card-Hex Vertical Encounter (future):**
- open a source-approved Card-Zone/portal/threshold into a small **bounded multilevel stage** assembled from current authentic KayKit Hex terrain pieces, with card-printed platforms, actual traversal collision and assisted jump according to accepted WS1 locomotion and original Card-Hex Ascent learnings;
- different stages may contain their own genuine `CardRef` and defense encounters while the player ascends/descends. Larger battle builds a raid/mini-platformer layered into the open World and returns to source safe anchors;
- the benchmark PR #19 is a research / S3 technical predecessor, not an authority to ship another movement engine or copy all Hex visuals. Preserve source camera and correct KFB clay edge grammar, no hard-coded second jump/physics/gravity loop, no auto-created “levels” from arbitrary QR/PDF cells.
- Card acquisition/provenance and source Deck completion from R0.2 still use one Card/PlayerSave/Almanac owner even when the battle happened in a vertical room.

## 5 · Contract boundaries and high-value proof sequence (not live APIs)

```text
World/source authoring: known DeckRef/CardRef + WorldInstanceRef
  + real CardZoneNode (source terrain support, spawnEligible points,
    encounter style + approved player arrival/exit), existing WS1 owner

Player & Combat gameplay (sole WS1 runtime):
  optional EncounterIntent(sourceNodeId, CardRef, difficultyProfile)
  → validate known source card / gameplay reachability / player safety
  → seed one capped monster wave at accepted spawn supports
  → source-backed Mob state + explicit attack/spit event clock
  → valid attack impact → CensorshipCoverageEvent(cardZoneLocalUV, sourceEnemyRef)
  → actual gameplay coverage truth (not GPU texture pixel noise)
  → player accepted combat/healing interaction → DEFENDED | INTERRUPTED | BLACKED_OUT
  → owner-backed GrantOnce CardRef OFFERED, with protected pickup/Almanac claim

Presentation donors only:
  MonsterCuteCubes source/visible clips
  Spuck v3 anticipation+droplet curves
  Zensur v3 source canonical ink stamps/UV coverage
  Flood v3 bounded visual spread if actual WS1 shader budget allows
  shared SFX/VFX/ChatterBox/Clay, no extra render loop
```

**Important:** `EncounterIntent`, `CensorshipCoverageEvent`, `GrantOnce` are **concept vocabulary, not currently implemented APIs**. Existing WS1 world save `kfb.save/1` is reported by V-396 to contain Cards, Fluff and dice; the live exact shape and code must be inspected before adopting new encounter fields. Never add second PlayerSave or store player quest/ink history inside a global WorldRecipe.

**Technical caveats:** legacy spuck/zensur/flood donor uses Three r160 and its own host/Canvas. WS1 uses R3F, Rapier, ecctrl with host R1.2. Only individually measured components/behavior/parameters are reused. A pre-existing eye/mouth/animation source is not a muzzle-attachment proof. Ink coverage, HP and combat event logs must agree on real event hits, not VFX spawn counts. Avoid deep-copying shaders that conflict with KFB Ink/Clay/WS1 material roles.

## 6 · One smallest later vertical proof

**Do not implement now and do not expand current WS1 L3/Look/HUD or playable MVP gates.** The current owner's ongoing critical path is Mesa look/L3, resident/asset fidelity, R3F movement/audio and accepted scene work. WS0 should first confirm receipt of this exact R0.5 source and decide where it fits **after** current product gates.

First bounded **source-fidelity proof** when authorised:
1. Show the unmodified real PDF Card and source Combat `arena-ring` card **individually**, and one authentic World clay terrain/support; no URL-only proof.
2. Show the Quaternius MonsterCuteCubes source in original attack/walk poses; source spit donor independently with visible muzzle, correct current rigs and actual 3D room. Do not attribute native spit clips to monsters when attack is Bite_Front.
3. One real CardZone physically readable and terrain-contacted on current WS1 terrain with correct Card/Ink outlines under actual accepted lighting, without changing ground physics.
4. One infected monster approaches from valid spawn; readable wind-up, projectile arcs, one **visible** ink stamp that grows on the Card only; actual World and PDF unchanged.
5. One player interaction (existing approved combat ability or cure) stops further ink and yields one protected authentic Card; original Card view and Almanac claim idempotent across repeat and fresh reload.
6. Run in actual WS1 scene/camera with fixed source identifiers, under its own current G0→G5 acceptance; independently check no 2nd renderer, jump motor, Controller, ink save owner, Combat AI, SFX transport or extra grant. In Chill, a blacked-out card remains recoverable and most other cards are peacefully findable.

Afterwards, *separately* consider a Card-Hex vertical 2–3-level variant only if current WS1 Source/Physics/Level designer accepts the Card-Hex traversal donor. Do not bind two unaccepted seams as one mandatory MVP obstacle.

**One next handoff gate for this documentation slice:** `WS0_CARD_INK_DEFENSE_INTAKE_ACK` — **WS0 explicitly reads/accepts or TUNEs the R0.5 concept** in its current steering register/Production Hub and either associates it with a deferred WS1 work item or leaves it as future design. This is a planning acknowledgment, NOT authorization to implement. The existing R0.1–R0.4 Recovery/PR #400 is currently open/draft; user-authorised expansion of that concept thread does not prove WS0 had reviewed all previous version details. Subsequent real game work still requires current named WS1 human approval and source isolation; no new public Stage/Site route is needed to archive a concept.

## 7 · Exact source location map

- WS0 register: `georg-doc/kayfabizarro@docs/kfb-decisions-register-2026-10-11` `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/{DECISIONS.md,ARCHITECTURE_R1.md,CHANGELOG.md}` head at reading `255b25cfeaedb6ea83315b03faaf8c970f502c01`.
- Current WS1: `georg-doc/kayfabizarro@ws1/r3f-frame`, `WS1_STATUS.md` latest §69, head `d65f5c264299c202199de69b27b20b0fb2d12f42` at reading.
- Combat donor main: `georg-doc/KFB-Combat-Arena@f6a59ad15b9ffcf3164b0ab013f223962b63f61f` (paths and blobs above), open Draft PR #18/#19/#20. `slices/card-hex-combat-ascent-benchmark/STATUS.json` on PR #19 has historical S3 technical proof, no Georg human acceptance established.
- Current/old Card SSOT: `media/kfb/index.json` + approved Card files, `skills/kfb-ink-canon.js`, Deck PDF crop/Almanac pipelines, source historical `DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md`.
- Recovery index / Play/Craft/Collect: `skills/chat/recovery/KFB_POSTMVP_MINIGAMES_FLUFF_SOURCE_RECOVERY_2026-10-15.md`, R0.1 Water Harvest, R0.2 Deck Homebase, R0.3 Compass, R0.4 WhackMan/Pickup Social Calls, all on recovery Draft PR #400.

**Evidence limitations:** code and GitHub source inspection, exact WS0 decisions, PR metadata/comments and historical authored test/QA reports only. ZERO new KFB visual donor isolation, Unity/R3F integration, preview build, browser Combat flow, live Stage/Site revision validation, interactive PlayerSave/Combat/censor test or author acceptance in this chat.
