# KFB Resident Life · POI Daily Intent, Living Patrols, Hit Escalation, Fluff & Lean Memory R0.6

**20 October 2026 · GEORG CONCEPT ADDENDUM / POST-MVP DESIGN · NOT A GAME RUNTIME IMPLEMENTATION**  
**Existing execution owners:** WS0 = character/decision/data contracts and intake; **WS1** (`ws1/r3f-frame`) = the **sole** current KFB game/actor/nav/Combat/PlayerSave/World runtime; Dramatis Personae = existing Asset Library tab referencing `kfb.character/1`; motion/face/audio/performance and POI/world sources remain their current respective owners.  
**One writing branch/outcome:** `georg-doc/kayfabizarro` / `recovery/kfb-minigames-fluff-source-bridge-2026-10-15`, existing [Draft PR #400](https://github.com/georg-doc/kayfabizarro/pull/400), **additive planning only**.  
**Related KFB design:** source recovery v0.3–v0.7.1; R0.1 Water Harvest, R0.2 Deck Homebase, R0.3 3D POI Compass, R0.4 Fluff/Card/Prop Pickup, R0.5 Card Ink Defense. Do not reopen old WB2/Lab 5192, create another NPC runtime or expand current WS1 work without WS0/human prioritisation.

## 0. What is genuinely there; do not reinvent it

**WS0 primary current policy:** `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/ARCHITECTURE_R1.md` (read blob `a7fc69a3552c09693a891bc76863483d3de928be`), V-228. `DECISIONS.md` on register branch head `f05ff325ad1ae3d706c648a40d9dec56e1a94816`, including V-181 (“cultural mechanics” as performance triggers), V-394 (one `kfb.character/1` per character), V-399 (Dramatis Personae Asset Library tab), V-416 (authored edits), V-465 (`kfb.scene-pack/1` and one `performance/1` timebase), V-396 and harvest/Fluff advances. **New canon 3D owner:** `CANON_3D/CANON_3D_R1.md` mandated by V-563 for any later visual production; do not bypass the source donor proof.

**Current WS1 branch** `ws1/r3f-frame` head observed `75daae0fe8b4b963043a21afe4d2d5daa3f0bd18`, `WS1_STATUS.md` §110 current index: running R3F/Rapier/ecctrl game, F1/C3 Fluff harvesting/source/animation and active terrain/look. Exact inspected source (this session):
- `ws1/kfb-planet/src/world/interactable.js`, blob `f77c01b96ebb5a061a53893388ceab6f9ed0f56c`: real `createInteractables`, host-only KeyE, nearest-one contextual action, hysteresis, **supports moving pos function**. An NPC can register an interaction on this **existing** owner, not add listeners or a parallel target selector.
- `ws1/kfb-planet/src/world/save.js`, blob `0a9c97a1008adf17adec97e8c1f2ef2e5814dd0b`: real **`kfb.save/1`** current schema with flags, Fluff by six kinds, collected source keys and player position/zone, version migration, storage fallback. **NO verified durable social-relationship / NPC episodic fields in this schema yet.** Do not stuff arbitrary memory into `flags` or claim full Lean Memory is implemented; use an owner-approved, versioned extension later.
- `ws1/kfb-planet/src/world/fluff.js`, blob `9541a6c99f70f1dab565be563135974a68291e0d`: live-source deterministic six Story-Mode Fluff distributions, source-grounded bounce/settle physics, auto-pickup by Walk/Drive and seeded release. NPC-hit drops should use **this same future resource owner**, after validating a genuine source-target drop route. Do not create a parallel Ball/Wallet simulation.
- `ws1/kfb-planet/src/ModuleHost.jsx`, blob `18bfd6da9587781825aa7cde7cbff6c901aa752d`: existing `create(options)→{object3d,update,dispose}` adapter and **one** R3F loop. Later actor intent/nav/performance consumers use WS1 host frame/budget and cleanup; never a new renderer or 500 private setIntervals.

**Strong older semantic precursors — PROPOSAL, not working current NPC AI:**
- `skills/chat/RESIDENT_LIFE_SEMANTIC_MODEL_PREP_2026-10-06.md`, blob `17e5e0e36eb7aaa949a077188bc1509a79681785`: four axes (Identity/Profile, Affect, Activity/Intent, Encounter/Relationship), `homePoi/workPoi/socialPoi`, `ActivityDefinition/Instance`, `ResidentPOI`, route families with variants/curiosity detours, interruption/resume, RelationshipMemory.
- `skills/chat/RESIDENT_LIFE_VERTICAL_SLICE_FIXTURE_01_2026-10-06.json`, blob `5b117e2300cf04836c50dd889ef8b3eea43666a5`: real candidate **Farmer_B**, Lorekeeper, performance source roles with POIs/rig references (fixture source, NOT accepted world placement).
- `skills/chat/RESIDENT_REACTION_ENCOUNTER_MATRIX_PREP_2026-10-06.md`, blob `776c79908e09d1802396a4498a86e3c10aab8f18`: event → Affect pulse → pose/gesture/face/Emanata/bubble/audio → resume, safety/interrupt priority, silent reaction valid. `RESIDENT_PERFORMANCE_EVENT_CONTRACT_PREP_2026-10-06.md`, blob `79fc0951de708323fdf527e723f008ca4ce96426`: eight performance channels; **presentation never writes gameplay truth**.
- `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/FIGURES_R1/CHARACTER_SCHEMA_R1.md`, blob `42e1a44522d30216a1dfcbc6df151ab3f8d37120`: `kfb.character/1` contains personal wants/irritations/triggers/failure loop, source-specific dialogue and motion preferences; `memory` is a **policy schema only**. Actual events live in PlayerSave/Lean event ledger/projection; **no duplicate live memories inside Character sheets**. Georg's individual character-approved values are `GEORG`, source `SOURCE`, proposals `DESIGN`, etc.
- `overworld/overworld/mob-ai.js`, blob `3d3f5a6957889642c24d82a6033097d884f83e37`: older working **2D donor** has state dwell, perception/notice, waypoint families, territory/leash, separation/obstacle steering, reputation aggro. DO NOT transfer 2D pixel speeds, world geometry, path writer or dialogue/collision into 3D WS1.
- `skills/chat/workflows/KFB_AI_GAME_ART_ACADEMY_MAKERSPACE_V05_2026-10-09/CARD_WORLD_REPUTATION_SIX_TIERS_V11.md` on sibling planning branch, blob `20077c267d9d173c5acb29e5a7a22906b99ffe88`: proposed six **derived** reaction/reputation tiers across World, Deck and individual NPC, backed by events and relationship state; **not** a new Fluff/stat or six persisted XP meters. Existing `GATEKEEPER_ENCOUNTER_GRAMMAR_V10.md` is optional later boundary interaction, not current NPC pathfinding.
- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md`, blob `ff4571348634181323059b0babad3b5d862e409c`, lists future `ENCOUNTER_RECEIPT`, `SOCIAL_RELATION`, `NPC_MEMORY_VIEW`, `MOMENT_RECEIPT` etc. Historical WB2 owner in that file superseded; today WS1 is runtime.
- `skills/chat/recovery/KFB_PICKUP_FLUFF_CARD_LOOT_SOCIAL_CALLS_R0_4_2026-10-15.md` on this PR protects stable `DropRef` offered/claimed/Almanac and original WhackMan ballistics donor, but WS1's actual `fluff.js` is now the closer/current bounce source.

**No evidence in this read that a complete NPC daily-life world AI, three-hit escalation, permanent per-NPC memory after respawn or live six-tier reputation is already wired to WS1.** This is an architecture and acceptance gap, not a request to rewrite working locomotion.

## 1. Creative model: Residents inhabit the world before the player arrives

NPC **`Intent`**, not arbitrary random walking:
- The **Farmer** tends actual fields/Fluff carrots, carries baskets to the market, stops near a neighbor, returns to a Farm Homebase.
- The **Lorekeeper** reads real Cards, goes to a meaningful Diorama/Bookstand/Archive POI, stops to discuss an authentic `CardRef`, visits a friendly NPC. The player may shoot this NPC too; their immortality/respawn is cartoon-world logic, **not** an unkillable UI.
- A little **Skeleton Warrior trio** marches/talks, wanders past the player, perhaps patrols a graveyard/bridge; may or may not be hostile depending on source-authored faction, attention, memory and what is happening. Some parade/drift, others investigate an incident. The skeleton group is a tiny **social formation** with leader/follower offsets and periodic re-formation, not three indistinguishable robots on a loop.
- **Utopia Fluff Bots** harvest/carry/roll giant balls, travel from resource POI to charger/conveyor, may react to theft or getting hit and call nearby colleagues. This consumes the already-authored Kayfabrick/Fluff-source rules, not a new resource-lifecycle writer.
- NPC interactions with NPCs are as important as player encounters: meeting, greeting, trading, dancing, helping, confronting, queueing at POI capacity or simply ignoring each other. Every genuine interaction begins from source role/intention, not generic small talk.

The visible goal is a **persistent impression of daily life**, not perfect continuous simulation of 130 scenes. World space, weather/time-daypart and authorized POIs bound all actions. The world can be cozy/absurd, but nothing wanders through walls, drops off cliffs or takes a 3D shortcut through someone's Diorama.

### Character and POI facts, exactly one owner each

**Dramatis Personae / WS0** curates character-authored *preferences* and context (home/work/social POI refs, daily tendencies, work/pleasure motives, response style, tolerance for provocation, signature Fluff hue where source-approved, faction, role and preferred motion categories) through `kfb.character/1`. These are **data proposals** until Georg/WS0 approves them, not undocumented modifications to existing `characters/*.json`. Do not hardcode Lorekeeper or skeleton dialogue into a generic runtime.

**World/WS1** owns reachable POI anchors/terrain, collider/nav support, active time/weather/WorldGraph/instance. An activity only selects a **verified** reachable/source-authored `poiRef`. Occupancy rules prevent 12 workers stacking at one stall. **Motion/Performance** maps actions to validated animation clips on actual rig (walk, stop, inspect, pick, carry, gift, warn, wind-up, dodge, hit, recover, collapse); Emotion/Event remains semantic. **ChatterBox/Triplet pool** chooses accepted English short dialogue grounded by actual Character/POI/Memory, with silence allowed. Emanata/Audio read, never set trust/HP/loot.

## 2. A small, performable Intent + Activity + Path scheduler

**Conceptual structure only — NOT current WS1 public APIs:**

```text
ResidentSchedule / Character preferences (WS0 authoring, no player memory)
  → Choose available source POI + ActivityDefinition (seeded utility/rule weighting)
  → Plan / follow a validated WS1 Nav route (terrain/ramps/doors/bridges)
  → Arrive → align/look → motion/prop ActivityBeat → short interaction/idle
  → Resume | Choose next authored POI | React to meaningful encounter
```

Choose between a **few meaningful activities**, not all possibilities at once. Utility formula candidate per tick (exposed for debugging):
`eligibleCapabilities × daypart/roleWeight × need/curiosity × proximity × relation × recentRepeatPenalty × tinySeededJitter`. The **repeat penalty** and short minimum hold avoid clockwork loops and per-frame flip-flopping. Periodically pick a new task/route at a human-visible timescale and let movement handle *real* position. Route variants pick one of two or three authenticated ways to the POI, with safe occasional social/curiosity detour. Stable per-NPC seed permits controlled test replay without making every NPC march in sync.

**Very small state set:** `IDLE/LOOK → SELECT_POI → TRAVEL → ACT → ENCOUNTER_INTERRUPT → RESUME/REPLAN`; orthogonal immediate `STAGGER/RECOVER`, `DEFEND/ATTACK`, `DOWNED/RESPAWN` interrupts. `EAT/WORK/WANDER` are **ActivityDefs**, not separate giant brain states. `MOVE` is owned by the existing WS1 controller, not a mini-game-local animation clip writer. State changes are meaningful, observable beats (stop and face, anticipate, move, arrive, look, gesture, recover).

**Early performance/scale:** 1–3 real residents first, each with 3 source POIs and 2 route families. A near-camera full actor gets live path/support + animation, a mid-range actor can update route/intent at coarse intervals, distant/off-screen Residents can be projected as `expectedPoi/nextBeat` **without** real-time pathfinding/animation/physics. Re-entering view resolves to a reachable supported point near scheduled activity, not visible teleport. Debug view must tell what/why: `residentId, currentIntent, POI, route, affect, relation, cooldown, sourceRefs`. No hundreds of idle AI loops, per-NPC audio mixers/React renderers or LLM calls per frame. One scheduler/clock from WS1 host; Nav and Animation remain separate owners.

## 3. Universal targeting + three-hit reaction ladder (Georg's proposal)

**Georg's toy-world rule:** **any physically present Resident may be targeted/hit**, including respected/meta figures like the Lorekeeper, not only monsters. No hidden unshootable “important quest NPC.” In Chill this is visibly *cartoon* damage/knockout, not realistic violence or permanent NPC elimination.

**Default 3-hit **encounter** sequence, design parameters (NOT final accepted balance):**

| Player hit | World/actor reaction and English Triplet opportunity | Fluff response | Relationship/aggression |
|---|---|---|---|
| **1st confirmed hit** | startled recoil/squash, turns toward player, checks whether an accident, short plain warning e.g. `"Was that you? Watch it."` | **1** small source-hued bouncing Fluff orb offered to player pickup | `ANNOYED`, attention/notice increases; routine interrupts briefly then can resume |
| **2nd confirmed hit** | more forceful angry posture, looks at weapon, warning and steps back or faces up e.g. `"Do that again, and we're having words."` | **3** small orbs as an authored candidate once-per-encounter event | `WARNED/THREATENED`, nearby affiliated NPCs may notice/help |
| **3rd confirmed hit** | threatened Resident **can fight back**, duel, throw, flee, shout for allies or contact guards depending **approved** personality/role/equipment and current Combat capabilities; source-specific e.g. `"All right. You asked for it."` | **no guaranteed additive exploit payout**; owner-defined budget / cooldown | `HOSTILE/DEFENDING` for this local encounter; the resident interrupts daily activity and makes a real combat intent |
| **subsequent hits / defeat** | short authored knockback/fall/bonk/KO and possible collapse/soft clay sink; no gore, no permanent deletion | optional **finite** KO Fluff reward within the *same resident encounter budget* | one meaningful player-hurt-me / defeated-me receipt, memory/relation update and cooldown |

This ladder should be broadly *available to all targetable Residents* but not every Resident acts identically. The Lorekeeper may use words, defensive magic or evasive tricks rather than pull an invented gun. The shy Farmer may retreat or recruit help, the Black Knight may challenge to a duel, Skeleton Warrior may counterattack, Hunky may command a machine, Dory may first appeal to empathy. **Character-specific response can replace the attack animation**, not universally exempt characters from being affected. If an NPC lacks a validated attack clip/equipment/driver, use a source-approved **flee/call-for-help** response; no fake attack montage.

**Scope rules to prevent degenerate Fluff farming:** the proposed `1 + 3` grant is **first encounter escalation**, not a refill every three seconds: per Resident and encounter source a finite authored drop budget / cooldown, plus no repeat grant from same hit/actionId; routine respawn cannot instantly reset the drop table. Fluff wallet uses currently approved six Story-Modes plus separate High/Low only where approved. Source signature hues may be a candidate D6 affiliation of a character/Deck/biome; **do not recolor NPCs** or call all hostile loot Low. Canonical Card grants do not come from simply shooting any important NPC or farming them on respawn.

**Controlled timing:** `hitCount` is a short local valid-hit **encounter/window**, not an eternal three-hit counter across years; sufficient separation/extended disengage can cool the current anger, while persistent reputation/memory influences future first-contact sensitivity. Reaction and aggression are independent of hit animation playback — only the **Combat owner-confirmed damage/touch event** advances state. Prevent multiple shot/projectile/FX events from counting the same collision three times.

**Chill & Fun contract:** no hard permadeath, no irreplaceable missed Card because NPC is downed, no automatic irreversible faction lockout or punishment for experimenting. The world can be annoyed, remember and react; reconciliation through gifts, favors, conversation, dancing or time is possible. Avoid rewarding repeated harassment significantly more than peaceful harvest/fishing/mining; the comedy is in consequences, not in making violence the optimal resource farm.

## 4. Defeat, respawn and Lean Memory with actual consequences

**Downed/KO** (cartoon collapse, small optional sourced prop/fluff burst, settle), `DESPAWN_PRESENTATION` (subtle sink/dissolve/clay fold if owner approved), `RESPAWN_ELIGIBLE` (stable validated Home/Work/spawn anchor after short understandable delay and out of direct line of sight), `RETURN_TO_ROUTINE`. It must be the **same stable residentId/characterId**, not a clone with a new memory. The current character sheet remains intact. Active quest/courier/card ownership, transfers, collectibles and World/PlayerSave must be preserved.

**Durable EVENT, not a transcript:** one `ENCOUNTER_RECEIPT` candidate when the Resident was first hurt, threatened/KO or reconciled (avoid storing every bullet/frame):
```text
{ eventId, playerId, residentId, worldInstanceRef, poiRef?,
  kind: HIT_WARNING | HOSTILE_RESPONSE | RESIDENT_DOWNED | RESPAWNED | RECONCILED,
  timestampOrSession, severity, witnessIds[], factionTags[], sceneOutcomeRef? }
```
These fields are *illustrative*, NOT accepted `kfb.save/1` schema. **WS1 Save owner** extends/migrates it with an approved versioned ledger or references; `NPC_MEMORY_VIEW` derives sparse salience and familiarity/antagonism from player-attested receipts. V-394 character `memory` field only defines *what is eligible to remember*, never the player's actual aggression log.

**After respawn:** a Lorekeeper could look up from a Card and say (DESIGN English sample, not approved dialogue-pool content) `"Back already? Last time you shot me."` — then decide to keep talking, scold, withdraw or retaliate sooner. A skeleton group may recognize the player and spread warning through **witness or approved faction rumor** (no omniscient global hostility); a Farmer may hesitate before trading. On the next genuine encounter one known attacker can start closer to `WARNED` or notice sooner, depending on recency and personality; memory slowly decays/changes through positive actions, not a permanent 100% aggro flag. Group reputation and individual relationship are **different projections from the same events**; do not mint a second standing currency.

**Witness/faction design:** neighboring NPCs notice with bounded hearing/line-of-sight, same zone, source role/relationships and current concern; they may flee/help/ask what's wrong. Not everybody in the Universe instantly knows the attack. One rumor propagation event may later trigger a dialogue in a supported place, sourced from actual event ID. This avoids a world that is either an amnesiac theme park or total police-state omniscience.

## 5. Motion + dialogue + combat contract

```text
WS0 Character / Dramatis Personae:
  personality, occupation, faction, home/work/social POI refs, capabilities,
  tolerance/defensive policy, approved original motion refs, memory policy

WS1 Scene / POI / Nav:
  real geometry/colliders/anchors + one present actor & one movement path owner
  → chosen ActivityInstance / current intended POI + genuine transforms

WS1 Combat owner:
  DamageOrHitConfirmed(actionId, targetResidentId, instigatorId)
  → atomic local hit escalation, source budget check
  → Affect/Relationship semantic event + approved source Fluff DropRefs
  → actor-safe response/attack/evade/KO and later return anchor
  → owner-specific save/ledger event once

Performance/ChatterBox/Audio read-only consumers:
  Intent/ActivityBeat/ReactionPulse → approved rig clip & face (one face driver)
  → accepted Triplet/context line or silence → optional SFX/Emanatum
  → recovery then resume or replan

Current WS1 `createInteractables`: attaches one dynamic `pos()`
 to a Resident and existing single E-key host interaction, no new control listener.
```

**No runtime code claimed.** Intent selection should not call generative AI at runtime; a small seedable utility scorer + finite-state transition system is enough. Storytelling uses source-authored short line pools / ChatterBox and can work in silence. Dialogue cannot decide whether a projectile actually hit, whether a player owns Fluff, or whether an NPC has respawned. WS1 character source mount uses the same real animation rig and single performance timebase `kfb.performance/1`; react pulses may temporarily override travel/harvest pose with correct interrupt/return, no losing props or stuck walk cycles.

**Rig & asset guard:** targetability means the **current actual collision/hit owner** reports plausible impact. No bounding sphere radius guessed from old 2D Overworld and no legacy `Rig_Legacy` animation onto Medium. The later proof shows real bone/hand/muzzle/weapon line, contact pose, knockback, world-ground contact and safe respawn in the actual KFB Clay scene under current CANON_3D. No dummy muzzle flashes, placeholder actor rigs or universal gun-bearing NPC.

## 6. A deliberately small progressive delivery, not 130 NPC brains

**Phase A · Daily living scene (lowest-risk, early, no Combat):**
- 1 source-verified **Farmer_B** (known `Digging` / pitchfork candidate) + 1 **Lorekeeper**, one real World Diorama route.
- 3 source-owned POIs each (Home, Work, Social), 2 validated route choices, at most one curiosity/social interruption; farmer tends source Fluff plants, Lorekeeper reads Card, they can meet.
- Show real position moves through valid walkable terrain, enters activity, reacts to player approach and *resumes* after interruption; no “teleport to task”, path collision errors, marching synchronized repeat, frozen animation/props, NPC ghost walking.
- WS1 debug overlay: `intent / target POI / reason / navigation phase / animation phase / eligible event`, motion and source donor proof. Compare walking speed/turn/contact visually on current Rig_Medium and current game camera.
- The NPC is **not forced to spawn** if a verified current World/Resident figure/POI is unavailable; first source-isolate and choose an accepted alternate source. Define entry/exit to current scene. No new engine.

**Phase B · Walking encounters and group behavior:**
- 3 authentic **Skeleton Warriors** as separate Residents but one optional patrol formation, valid source clips, two route variants, bounded separation and meet/ignore logic; player may be ignored, greeted, followed or challenged depending current faction and own actions.
- Add one source-authored social encounter with Farmer, e.g. sharing an actual Fluff ball or watching a performance. Group snapshots not continuous physics when offscreen.

**Phase C · Three-hit Chill escalation + Fluff feedback:**
- One chosen approved actor (then Lorekeeper as deliberate exceptional test): first valid hit → 1 Fluff orb, short surprise/warning; second → 3 orbs/warning; third → defend/flee/call reinforcement as owner-approved. Use **current `ws1/kfb-planet/src/world/fluff.js`** owned bounce/pickup after event authorization; no new economy.
- Prove hit counting is from Combat events, not animation or VFX, *exactly four* source-backed orbs per allowed encounter (illustrative first + second); no repeats on same event ID, no unlimited respawn farm or draining character role. Test all movement modes and no live “shoot through walls” collision; protect active plotline Card/courier transfers.

**Phase D · KO → respawn → memory → relationship, one actor:**
- Player defeats temporary cartoon NPC; authored downed animation and safe return; same ID, actual one Lean event receipt from WS1 Save owner, no duplicated actor/Audio/Wallet/animation mixer on re-entry or reload. NPC remembers *what this player did* on next meeting; gives shorter warning, changes dialogue/stance and later reconciles after genuine positive act.
- Validate `kfb.save/1` schema/version migration in real WS1 owner first; avoid fake permanent memory held solely in React state or local NPC object.

**Phase E · Scaled world life after accepted foundation:**
- multiple biomes/faction social behavior, actual reputation 6-tier projections from existing v1.1 planning, social rumor route, NPC-NPC assistance, pets/mounts, varied schedule dayparts, Combat Arena/card defense links and tool-sharing across World. Only when source volumes/performance/visuals and content authoring permit. Dramatis Personae edits become tested data contracts; no massive new authoring software.

**Prioritisation advice:** A (Farmer+Lorekeeper path + activity) is the earliest valuable foundation. C should **not** ship before A/B movement, current WS1 actor hit/source and Fluff drop semantics are measured. Stage the behavior while current WS1 L3/look and previously authorized gameplay work stay primary; WS0 may prioritize a small A source proof, not an uncontrolled new MVP tranche. The first scene must *look alive* as well as pass static logic tests.

## 7. Failure modes and acceptance list

- **Movement vs animation:** actor walk clip during zero displacement, skating, moonwalking, stair teleport, unreachable POI, walk through players/terrain, movement/physics overridden by an emote.
- **Lifetime/identity:** NPC instantly repops in front of the camera, wrong resident ID after respawn, old actor's event listener/mixer persists, same voice/face driver duplicated.
- **Aggro:** NPC attacks on one accidental collision irrespective of character and recent history, infinite chase/leash through portals or five friends silently aggro across the entire island, Third hit increments three times in one frame.
- **Loot:** Fluff given on every bullet, KO drops infinitely exploitable resources, duplicate `DropRef`/wallet, wrong signature D6 hue assigned by unsupported guess, no orb reachability after explosion.
- **Memory:** forgets confirmed KO on reload, remembers attacks never witnessed, treats a different Player as attacker, incorrectly converts six reputation views to six independent persisted stats.
- **Acting / character:** Lorekeeper is generically a guard with random pistol, skeletons use incompatible animation rig, Farmer permanently stuck in warning pose, every NPC delivers the same three lines, dialogue mechanically authorizes damage/loot.
- **UX:** quest NPC no longer reachable while combat-locking, no escape/reconciliation in Chill, unwanted omniscient punishment, excessive chatter or 130 always-active behavior loops.
- **Performance:** full AI/pathfinding/physics and ChatterBox LLM update every render frame, no distance/interest LOD, memory log grows on each animation tick, narrator and sound duplicated. One event owner and host clock; far NPCs should simulate intentions cheaply, not fully animate.
- **Visual:** 3D assets never isolated, stage lacks believable source 3D motion, collisions rely only on unit tests or generic cubes, KFB toon/clay canon bypassed.

**Future concrete tiny QA (once authorised):** repeat 3 scripted days with two different deterministic seeds + one random real play; one Farmer schedule, Lorekeeper encounter, optional 3-skeleton patrol; 3 valid impacts plus 1+3 Fluff balls; KO/respawn; one reload; one positive reconciliation. Verify event+memory/Fluff logs, player-camera video of actual source characters and original animation clips, stable FPS, no stuck walks, a single WS1 host controller and no extra renderer. This is a **proposed future test**, not an executed one.

## 8. Source/authority handoff

Read current `skills/chat/START_HERE.md`, `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `FRESH_CHAT_SLICE_PROTOCOL.md`, current WS0 `ARCHITECTURE_R1.md`, `DECISIONS.md`, current WS1 `WS1_STATUS.md` + the four inspected `ws1/kfb-planet/src` runtime files. Source owner priority outranks this addendum and historical WB2 notes.

**One next decision / routing gate for this concept:** `WS0_RESIDENT_LIFE_ESCALATION_R0_6_INTAKE`: WS0 reads R0.6, reconciles it with the existing V-394/399 character schema, Resident Life/Reaction/Performance donor sources and current `kfb.save/1`, and decides whether the **single small Phase A source-isolated daily-life scene** may be scheduled for WS1 when the active MVP priority permits. **No automatic combat or runtime work.** Future conditional Fluff source/owner audit continues under its previous scope; PR #400 is still a Draft planning/index route until explicitly merged/acknowledged. If no immediate WS1 capacity, mark DESIGN/DEFER and keep the source discoverable.

**Tests for THIS planning artifact:** real GitHub source reads only; NO new runtime, 3D scene, actor pathing, hit, respawn, persisted Lean Memory or performance proof. No public Site/Stage required. No implicit approval of per-character scripts or character edits.
