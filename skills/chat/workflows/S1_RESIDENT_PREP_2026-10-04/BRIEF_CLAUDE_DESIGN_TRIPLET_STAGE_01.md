# BRIEF · TRIPLET-STAGE-01 · Claude Design with Georg · 2026-10-05

- From: Claude Coworker · For: Claude Design, working live with Georg
- Belongs to: slice S1 "two Residents talk about one Card" (`skills/chat/workflows/KFB_COORDINATION_WSA_CLAUDE_2026-10-04/COORDINATION_PLAN_WSA_CLAUDE_2026-10-04.md`, branch `coworker/coordination-plan-2026-10-04`)
- Talk to Georg in German, short, plain, no jargon. All in-world content (Triplets, UI on the stage) is English.
- **Two parts in one session:** (A) the speech-bubble stage, (B) the Triplet pool work with Georg on that stage.

## 0 · Read first (GitHub `georg-doc/kayfabizarro`)

| What | Where | State |
|---|---|---|
| Two-Resident card scene: actors, EyeRig, PetMouth, bubble drawer `createBubbles`, Card, camera, beat timing | `tools/KFB-ToolBox/_inbox/KFB Resident Card Speculation Scene/npc-card-spec-01_2026-09-24/` (host `NPC Card Speculation Scene.dc.html`, `npc-card-spec-01/resident-scene.mjs`, `resident-card-speculation.recipe.json`); with the optional `lineProvider` seam on branch `chatgpt-web/resident-chat-presentation-01-2026-10-01` (PR #306, head `ba38ed7b`) | browser PASS 14/14; older mouth/face TUNE list still open |
| Four Residents in one scene (Lorekeeper, Goth Girl, Clown, Witch) on Resident Atlas S15 | branch `chatgpt-web/resident-chat-ensemble-01b-2026-10-01` (PR #310, head `7c6522fb`): `skills/chat/workflows/RESIDENT_CHAT_ENSEMBLE_01B_2026-10-01/` (`src/`, `qa/ensemble-browser.mjs`, `SOURCE.json`); host `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/KFB_Resident_Atlas_S15.html` | integration written, marked IMPLEMENTED_UNTESTED |
| The 20 candidate Triplets + Resident profiles | same branch: `src/resident-chat-ensemble-data.mjs` (`TRIPLET_POOL_SOURCE`, `RESIDENT_PROFILE_SOURCE`) | Site-authored CANDIDATE, never reviewed by Georg |
| Line selection kernel | branch `chatgpt-web/resident-chat-poc-01-2026-10-01` (PR #305, head `5b595a07`): `skills/chat/workflows/RESIDENT_CHAT_POC_01_2026-10-01/src/resident-chatter-adapter.v0.1.mjs` | tested 29/29 |
| Bubble layout donor (balanced wrap, registers, real font measuring) | `overworld/overworld-v13_2026-08-12/overworld-v13/bubble-layout.js` (+ `bubble-ts.js` in the same folder) | donor, not a promoted tool |
| Speech/thought look direction | branch `chatgpt-web/town-resident-social-memory-2026-09-28` (#272): `skills/chat/workflows/KFB_TOWN_RESIDENT_SOCIAL_MEMORY_2026-09-28/RESIDENT_BASE24_ARCHETYPE_MAP_2026-09-29.md` §9 | design direction |
| S1 prep: pair/Card options, lean cards v0.2 | this folder: `S1_RESIDENT_PREP_2026-10-04.md`, `resident-lean-card.v0.2.schema.json`, `residents/*.card.json` | prep |
| Functional reference (logic + review UI only, **not** the look) | this folder: `KFB_TRIPLET_POOL_REVIEW_STAGE_v1.html` | tested selection logic |
| Triplet work rules + tested pool gaps | this folder: `BRIEF_WEBCHAT_TRIPLET_POOL_01.md` §3, §4, §6, §7 | binding for part B |
| Card text | `media/kfb/Deck_A_UTOPIA_-_Forget_Utopia_web_H.pdf.json`, `media/kfb/Deck_B_DYSTOPIA_-_ANATOMY_OF_A_TRAP_web_H.pdf.json`; Card renderer `kfb-viewer.js` as used by NPC-CARD-SPEC-01 | source |

**Donor rule:** show each donor object in isolation before combining it. A loading URL is not proof that the donor was used.

## A · Speech-bubble stage

**Outcome:** one stage where two real Residents stand next to one real Card; a Resident's Triplet appears in a speech bubble; the player answers with four buttons; the other Resident replies.

1. **Residents:** the chosen pair from the existing Resident Atlas source (Goth Girl, Clown, Witch; Lorekeeper is a special role and not used). Use the existing actors, props, EyeRig and PetMouth owners where they are source-supported. No new rig, no substitute models.
2. **Card:** one real Card, visible on the stage through the existing Card owner. Default option A: `forget_utopia#11` *The Standing Ovation*. Options B and C are in `S1_RESIDENT_PREP_2026-10-04.md` §3.
3. **Speech bubble** (Base-24 §9): clean rectangular box, lightly rounded corners, high readability over 3D, **not** Claymation, **not** the Cavey/KFB ink-outline treatment. Reuse the speaker-tail/anchor semantics of the existing bubble owner under a new skin. One active speech bubble normally, two as soft maximum.
4. **Triplet reveal:** the three parts (subject / connector / reframe) appear one after another inside the bubble, like the three stacks of a flip book. Readable, short, not a slot machine.
5. **Thought bubble:** visually related but clearly different, for silence or an unsaid reaction. Silence is a valid output.
6. **Player answers:** four Monkey-Island buttons on the stage: **KayfaBINGO! · KayfaBOGGLE? · KayfaBONGO! · BLÖDSINN!** They are the `socialOperator` input to the #305 kernel (BINGO lands and hands closure back, BONGO keeps material, BOGGLE reframes, BLÖDSINN objects). They never link a Card. No free-text input.
7. **Line selection:** only through the #305 kernel with the #310 pool and profiles (deterministic, seeded). No LLM. No Fluffolekt in this round.
8. **Mouth and gaze** follow the speaking Resident through the existing owners; acting may expand, word count may not.

## B · Triplet pool work with Georg (on the same stage)

Follow `BRIEF_WEBCHAT_TRIPLET_POOL_01.md` §3 (rules), §5 (tasks), §6 (entry format), §7 (self-check). In short:

1. **Review mode:** Georg sees each of the 20 Triplets, can play it on the stage, and marks keep / cut / change with a note. Cut lines leave the pool immediately.
2. **Gaps** (tested): Clown and Witch have no COLLISION line, so BLÖDSINN! always falls back to one global line; Goth Girl has no own CATEGORY_SHIFT for BOGGLE; on pair B Clown falls silent on BONGO and BOGGLE; no line is anchored in a Card.
3. **New candidates only together with Georg in the session:** close the gaps for the chosen pair (per Resident at least 2 SYNERGY, 2 CATEGORY_SHIFT, 2 COLLISION) and add 3–4 Card-anchored lines per Resident. Maximum 24 new per round. Every new line is `status: "CANDIDATE"`, `author: "claude-design"` until Georg keeps it.
4. Rules that hold: each part carries meaning; ≤ 15 words; no stated conclusion; koans and haikus yes, calendar sayings / motivational aphorisms / X-with-Y / explained jokes no; respect each profile's `speechAvoid`; one shared pool; English.
5. **Export:** one JSON in the review format of the reference HTML (`kfb.triplet-pool-review/1`) with Georg's decisions, plus the kept pool as entries in the #310 pool format.

## Hand-back

- The usual Claude Design session cut into `tools/KFB-ToolBox/_inbox/` (runnable stage, sources, short RETURN: what was built, which donors were used and shown in isolation, what is still TUNE).
- The review/pool JSON from part B. Claude Coworker then commits the kept pool as the first reviewed pool for S1.

## Not in this job

No World Studio integration (that is the later S1 build run), no new dialogue/memory/animation/camera owner, no LLM, no Fluffolekt, no other Residents, no dark secrets or backstories, no Production Control writes, no merge, no Stage/Live promotion.

## Exactly one next gate

Georg plays the stage with the chosen pair and Card, and the pool has at least one kept line per social call for each of the two Residents.
