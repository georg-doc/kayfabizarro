# KFB Gatekeeper / Threshold Encounter Grammar v1.0
**2026-10-09 · Academy/MakerSpace narrative concept and contract · NOT IMPLEMENTED**
**Owner of this additive planning:** KFB AI Game Art Academy / Maker Space for diegetic visual/learning use. **Future receiving owners:** existing WorldBuilder / Threshold / WorldGraph for access + PlayerSave + collision, Resident Life / Performance for actor pose/affect, ChatterBox for dialogue, Motion/EyeRig/Audio for presentation, Card/Almanac for canonical Card identity and Kayfabulation play, Fluff/Crafting wallet for optional toll or keys.
**Repo/branch:** `georg-doc/kayfabizarro` / `planning/kfb-ai-game-art-academy-makerspace-v05-2026-10-09`.
**Routing:** existing Academy `ACADEMY_MAKERSPACE_VISUAL_SOURCE_PROOF_R1` unchanged. This is a future reusable gate grammar and **not** an instruction to create multiple implementation/runtime jobs. R4 STOP/NO MVP, Four-Island A/B and Fluff's deferred gate are unchanged.

## The artistic idea

A threshold is a tiny adventure scene, **not a login screen**. A source-verified Resident stands at a narratively meaningful boundary (bridge, island entrance, mine, castle door, disco or makerspace). Their motive and disposition explain the terms of entry. One brief encounter offers playful, source-backed routes to pass; one short physical release/acknowledgment concludes it. The threshold itself can be a barrier, lever, drawbridge, gate, robot stepping sideways, weapon-lowering or portal. Every animation/voice flourish is driven by an actual World-owned access decision.

**Default: CHILL & FUN / PULL, DON'T GATE.** Per the sibling Fluff/Survival v0.4 planning, basic navigation/story exploration and Academy fundamentals are not an arduous locked progression ladder. Provide a discoverable, short alternate action instead of permanent denial; no grind/toll tax required for every user. Standard/Hard can add one contextual challenge, extra narrative provenance or a nonexclusive accolade, never multiply the underlying authorization runtimes.

## Reuse established truth and presentation owners

- World Frozen Matrix F-S13 has a **state-dependent Threshold Door** candidate, not a production-verified generic gate library. World WB2 owns actual entry/route/portal instance, terrain/track support, collision, flight and PlayerSave.
- Existing God Mode/Lean Memory `SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md` defines typed authoring actions, one input router and separate world/player records. The Gate is a reusable **world-module recipe/visual consumer**, not a second scene or edit owner.
- Resident Performance event contract `skills/chat/RESIDENT_PERFORMANCE_EVENT_CONTRACT_PREP_2026-10-06.md` defines channels: Base Pose, Relational Pose, Gesture, Micro-motion, Face, Emanata, Bubble/Speech, Audio. `skills/chat/RESIDENT_REACTION_ENCOUNTER_MATRIX_PREP_2026-10-06.md` states: *semantic event → affect → pose/proximity → gesture/face → optional emanata/bubble/audio → resume*. Presentation never grants rights or changes World truth.
- Motion presets `skills/kfb-cartoon-animation/references/76-kfb-motion-presets.md` define anticipation/action/contact/follow-through/recovery plus budgets and resource cleanup. Do not author 20 bespoke gate animations before showing genuine native rig clips, or mix Rig_Medium with Rig_Large.
- ChatterBox's current real pool and Voice Layer remain existing dialogue/Audio owners. LLM-authored optional lines cannot decide access, overwrite dialogue truth or force an NPC to speak. Silence/nod is valid.
- Kayfabizarro Freestyle Rules source `Kayfabizarro_Freestyle_Rules_v18-4.md` (source's internal title may say v18.1; source ID/file name v18-4): **Character Card + three Scene slots + Quest Card = five table cards**. Slots are a *play configuration*, not an established permanent five-card fee. Preserve original `deckId+cardNumber`, Almanac provenance and exact Card art. In Freestyle the social calls are: `KayfaBINGO` = recognition it landed; `KayfaBONGO` = replace mechanistic power statement with narrative; `KayfaBOGGLE` = one concrete clarifying question answered in 1–2 sentences. These are **not** generic three multiple-choice answers or random quiz gates.
- Canonical gameplay Overworld glossar `overworld/docs/GLOSSAR_KFB.md` maps `bingo/bongo/boggle` to KFB HUD/stat labels. Distinguish clickable *social-action presentation* from permanent numerical stat mutation. Do not invent three fresh stat/action controllers.
- Fluff planning `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09` owns D6 × HIGH/LOW wallet/CraftRequest and optional CHILL/STANDARD/HARD policy. No second toll wallet or random Fluff debit.
- Current Atlas `tools/resident_atlas_s6/data/cast.js` pins **Black Knight** as a candidate `Rig_Large` source with shield/sword; current 4GTN original and Forgotten `Rig_Large` source in `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/data/cast.js`, status candidate-only. Legacy RPG builder has four class bases/head variants; a specific gnome/troll model is **NOT PINNED** and cannot appear as an accepted donor without asset discovery/source proof.

## Single encounter lifecycle (semantics, not a callable production API)

`WORLD_THRESHOLD_NEARBY → NPC_NOTICE → PLAYER_OPTION / PROOF → WORLD_EVALUATE → GRANT / FRIENDLY_REDIRECT → PERFORMANCE_CUE → WORLD_PASSABLE → RESUME`

1. *TRIGGER* on grounded player approach to semantic threshold anchor (or Player explicitly engages NPC). Use existing World proximity/input. No magical auto-teleport through dialog.
2. *NOTICE* current Resident performs oriented attentive pose / EyeRig gaze; one short dialogue or silence.
3. *OFFER*: 1–3 viable options by authorized difficulty profile. Examples: show an already held Card/key, converse, quick puzzle, offer valid recipe ingredient, return later, use chill invitation. Options have deterministic IDs from an existing encounter/recipe owner, not LLM-made monetary values.
4. *CHECK*: World/PlayerSave/Fluff/Card owner evaluates typed predicates against canonical facts; avoid free-text LLM grading for authorization. Even a dialogue puzzle uses enumerated intent/option outcome or accountable human/quest state, not arbitrary generated verdict.
5. *DECIDE*: deterministic `ALLOW`, `DENY_WITH_HINT`, `PENDING_ONE_SHORT_ACTION`, or `ALREADY_GRANTED`. Pre-commit grant should be idempotent, no double wallet spending.
6. *PRESENT*: Resident/ChatterBox/Motion/EyeRig/Audio consume the decision and give personality; physical door/bridge/boom/energy boundary animates to match. NPC never independently owns collision or player rights.
7. *COMMIT + VERIFY*: World owner persists grant, updates threshold state and supports walk/drive/flight/portal/reconnect consistently; do not claim success based on a prop animation. If save fails, do not open real crossing; display nonpunitive retry.
8. *RECOVER*: return actor/weapon/gate to correct idle, clear temporary VFX, audio cues and facial overrides; release interaction lock. Reentry should be smooth and not replay quest rewards.
9. *EXIT / RETURN*: always a safe way to leave; optional easy/offline rehearsal without permanent game penalties.

Recommended `AccessDecision` is the **same conceptual World-owned** evaluator already referenced in MakerSpace v0.9. `GatekeeperEncounterRecipe` stores only content/display and references to existing owner predicates, asset/clip IDs and valid outcome routes. It does NOT make a second persistence/auth/action source.

## Presentation choreography as reusable semantic actions

Not a new set of runtime animation files; an **event vocabulary** for the existing Resident Performance Composer when accepted:

| Semantic action | Body / face / prop | World-side consequence |
|---|---|---|
| `GATE_NOTICE` | Turn/look, attentive or suspicious posture, blink/head tilt | None |
| `GATE_REQUEST_PROOF` | Present palm/hand, lean toward Card/item, inspect | None |
| `GATE_BOGGLE_CLARIFY` | Curious eye/eyebrow/head tilt, brief bubble | None |
| `GATE_BONGO_REFRAME` | Small head shake or amused gesture, invite story version | None |
| `GATE_BINGO_ACK` | Recognizing nod, approving expression; one concise sound | None |
| `GATE_GRANT_REACT` | Arm/sword lower or step aside, bow, open posture | **Only after** World-owned grant success |
| `GATE_REFUSE_SOFT` | Sigh/shrug, one useful hint, no threat to newcomer | World remains blocked but player retains reachable next action |
| `GATE_OPEN_PRESENT` | Barrier lifts / portal brightens / robot makes room | Mirrors World threshold route state; not access authority |
| `GATE_RETURN_IDLE` | Restore weapon hand, stance, eye state, audio and VFX | No duplicate reward |

**Performances carry:** `semanticEventRef, performerSourceRef, rigFamily, chosenSourceClipRef?, pose/gesture/eye/bubble/audio channels, optional worldPropAnchor, duration/recovery, source/evidence limitations`. Chosen Clip refs remain **UNVERIFIED** until source isolation on proper rig. Pose/eye/motion methods stay owned by Resident Performance/EyeRig; no hardcoded identical sword-lowering for all skeletons/robots.

## Four illustrative encounter recipes — examples, not accepted gameplay

### A. 4GTN Forgotten · Maker Space
**Role:** bittersweet overgrown samurai automaton, a technical access function softened by organic life. **Source:** 4GTN Forgotten GLB `Rig_Large`, candidate-only. **Place:** source-backed road checkpoint, invisible permission across flight/portal, visible restrained energy shell.
**Easy:** one friendly introduction or Found Apprentice Invitation, one short exchange; may pass by immediately available alternate. **Hard optional:** one clue/quest/key crafted via authorized Fluff wallet. **Grant cue:** Katana lower OR measured step-aside/nod if clips permit, boom/barrier retracts, safe route opens. The gate's actual rights belong to World, not robot.

### B. Black Knight · King Kayfabian's Castle (creative PROPOSAL, castle not source accepted)
**Role:** castle guard, proud, suspicious of administrative credentials yet persuadable by story. **Source:** `tools/resident_atlas_s6/data/cast.js` `black-knight`, `Rig_Large`, candidate; real shield/sword. **Easy:** present one valid Quest invitation or complete a short, **optional** five-card Kayfabulation where original **one Character + one Quest + three Scene slots** are populated by actual Card refs; Cards are not consumed as payment. The player's exact spoken story is not graded by an untrusted LLM. **Hard optional:** three distinct previously collected Scene Cards plus current authorized Character/Quest Card can be a *challenge-specific* unlock if the Card/Quest owner approves. This is **NOT general canon**. A KayfaBINGO acknowledgment, KayfaBONGO gentle reframe or KayfaBOGGLE clarification is social feedback; all routes end in short satisfying clearance or a clear alternate. **Cue:** shield lowers, blade is safely repositioned and guard clears doorway; do not assume waving clip exists for Rig_Large.

### C. Mine Watch / Bridge Toll
**Role:** avaricious or tired bridge troll or gnome, from a **SOURCE_REQUIRED** approved Legacy/KayKit donor not yet identified; can use a source-verified alternative only when explicitly labeled. **Easy:** helpful one-clue comic exchange, trade or physically performable gesture; alternative walk-around when story warrants. **Hard:** a known small coin/resource/crafted item, nonexclusive way to avoid. **Cue:** barrier lever/chained boom/single stomp + reluctant step aside, no invented clip. If no actual gnome/troll model is confirmed, do not fabricate one.

### D. Disco VIP / Censored Deck
**Role:** satirical bouncer, clerk or NPC from existing approved Resident Atlas source to be chosen. **Easy:** one absurd but plausible exchange (“VIP = Very Improbable Person”), invitation/Resident relation/one Card gag. **Hard:** optional earned VIP flourish or a mini-scene. **Censored deck:** if content is actually restricted, permission is World/Content-rights policy, not bribable; if “censored” is satire, show fictional ban as narrative obstacle with a readily discoverable workaround. Never promise real-world prohibited access or pay to bypass genuine platform permissions. **Cue:** rope/latch/reel/curtain parting + short celebratory music stinger from existing Audio owner.

## Kayfabulation minigame – digital and analog parity

Present the exact **one Character / three Scene / one Quest** five-card relationship as an in-world holographic table, using source Cards and the existing Card Builder/Ink/Almanac owners. In the Freestyle game the 3 Scene cards can be replaced/reframed; a gate-specific challenge may pin/ask for three relevant collected Cards, but do not declare this the general card-game rule. On a 1–2-minute Chill Mode micro-play: show cards, narrator frames quest, choose one Scene and give one answer/pantomime, optional BOGGLE clarification or BONGO rephrase, NPC responds, pass. Full Kayfabulation with 1–6 friends remains separate/free-play and may be analog with physical Cards, no imposed rigid digital judge. **If solo accessibility matters, allow text, selection, pantomime and skip/story-assist**, never microphone-only.

Reuse semantic `KayfaBINGO / KayfaBONGO / KayfaBOGGLE` through existing ChatterBox/interaction presentation; the canonical named calls have specific meanings and should not be a right-answer multiple choice. Store an optional `PlayMomentReceipt` linked to Card refs and quest/world provenance under existing Almanac/Lean Memory owner, not a parallel Card record. Do not deduct original Cards from collections when the scene ends.

## Difficulty and anti-friction

- CHILL (default): usually no longer than one interaction and one short task, clear clue and friendly release. Most routes stay discoverable, alternate paths exist, no expensive toll or loss on a mistaken answer.
- STANDARD: slightly more meaningful request without endless dialogue.
- HARD opt-in: a related puzzle/earned special provenance/extra animation, still no mandatory unfair resource grind for basic exploration or Academy learning. No duplicate NPC state, no coercive timed gate, no paywall.
- Admin God Mode: authorized editor preview and legitimate access as per existing user rights, not merely a fictional prop or bypass in a shared-world security check.
- External world/portal/flight route always uses the **same** World authorization; no “jump over the bridge troll” security exploit if a zone is genuinely gated. A physical bridge can be walked around *only if that is an authored allowed alternate*, not an authorization bypass.
- Infinite retry allowed with stable idempotent world transition; character never permanently blocks a child/beginner user by an LLM misunderstanding.

## Tiny first visual proof and scope control

No new Gatekeeper production gate. **Same current Academy visual source gate:** `ACADEMY_MAKERSPACE_VISUAL_SOURCE_PROOF_R1`.
Within optional character source isolation choose A 4GTN and B Black Knight from proper Rig_Large source (individually), plus one appropriate real barrier prop sourced from registry; only then assemble concept board/short motion storyboard (pose→ack→clear→reset). The dedicated World threshold and Fluff economic execution remain with existing owners after product authority, not part of this chat.

**Next recommended actor:** Claude Design, source-faithful visual/choreography reference as nonblocking optional extension to Academy proof. **If real browser/clip evidence cannot be established in Design:** sequential single Claude Code/ChatGPT Work source/animation proof only. **World/Resident Performance owners later:** evaluate event grammar and user-visible gate only after their own active gates. **Georg:** no immediate operational action; later review the real visible gate feeling. **No auto-merge, public Site/Stage, World R5 or new economy/runtime owner.**
