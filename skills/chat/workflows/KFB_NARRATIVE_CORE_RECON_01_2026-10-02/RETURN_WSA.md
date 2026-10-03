# RETURN_WSA · KFB-NARRATIVE-CORE-RECON-01 · feedback after Georg's review (2026-10-02)

- From: Claude Coworker (Opus 5.5) · To: WSA
- Repo / branch: `georg-doc/kayfabizarro` · `coworker/kfb-narrative-core-recon-01-2026-10-02`
- Folder: `skills/chat/workflows/KFB_NARRATIVE_CORE_RECON_01_2026-10-02/`
- No PR, no merge, no deploy, no runtime built. Clay City branch untouched.

## 1 · Short version

The recon was delivered as briefed (SOURCE_MAP, CANON_DELTA_LEDGER, architecture, event schema, slices, open decisions). Georg's review then **moved the centre of gravity**: the Kayfabulation table simulation is a **later King Kayfabian minigame**. The core now is **Residents in the cozy world**: a lean character system, Cards as world artefacts, the player carrying a Card, Residents speculating about it from their own deck knowledge, memory in Resident Social Memory, speech in semantic Triplets.

Future briefs should start from `RECON_REORIENTATION_2026-10-02.md`, not from the first-pass architecture.

## 2 · Georg's decisions on 2026-10-02 (stated by Georg)

1. **Kayfabulation sim = later minigame (R6).** The player kayfabulates at King Kayfabian; other Residents only give social calls; the King judges. Donors when it starts: Gameplay Engine v2 + Simulator v0.8. Hard rule: the story is told **as the Actor card**, never as the Resident or player persona.
2. **Now: get to know Residents and Cards.** AI-Town direction (NPCs living their own life), not a game simulation.
3. **Courier job first.** The player brings a Card from Resident A to Resident B; they speculate about meaning, role, claim and relation to their own world knowledge. Modelled as a social conflict situation, not as game turns. (= #272 Social Card Relay / `RESIDENT-SOCIAL-MEMORY-01`.)
4. **Signature Deck = a Resident's home world and world knowledge.** Residents also meet Cards that do not fit their own deck.
5. **Memory belongs in Resident Social Memory** (filtered view of the Journey). No second memory owner.
6. **Lean character system** with high-level **clamps in the Hunky & Dory shape** (clamp, core question/answer, hidden goal, fears, contradiction claims/reality, failure loop, triggers, defence, escalation style). Valued for its structure, not its content. Less complex than the H&D YAMLs. Personality, failure loops and traumas live in each Resident's JSON.
7. **Archetypes fill the sheets heuristically.** Residents should be archetypally contrary: different roles, opinions, ways of thinking, worldviews, and **different weightings in the shared Triplet pool**, so each has its own language.
8. **Lorekeeper and Officer Doppel-Denk are special meta roles**, not regular Residents for the first relay. Lorekeeper: meta-archivist with the overview of all decks, mentor on his island. Doppel-Denk: patrolling comic relief who wants order and sees Cards as unrest; his stance on the Anti-Rules deck (one deck of 130) is handled globally, not per deck.
9. **Real LLM calls for dialogue testing on the site** are wanted. Open: one call for all, or one per personality (with its Triplets, the Card JSON, optionally an RSS headline).
10. **Research current approaches first** instead of starting from the 2025 H&D build. Done: `NPC_SOCIAL_MODEL_RESEARCH_2026-10-02.md`.
11. **Triplets are the answer to drift and slop.** Preferred: the Triplet logic works as a **contextual dialogue rule**, lines refer clearly to the Card and leave the conclusion to the player. **Fluffolekt** (Smurf-language principle; "What the Fluff", "Stay Fluffy") as an extra abstraction layer. Guard: no confusing ping-pong between Residents. → `TRIPLET_DIALOGUE_RULE_NOTE_2026-10-02.md`.
12. **Hosting idea, not decided:** publish as a GPT Site (LLM calls, login for testers, backend). A Claude MCP for the site / Production Hub is a later topic, possibly together with WSA work.
13. Georg sends a **list with base info and the first regular Residents** later.

## 3 · Invariants for every brief from now on (copy as is)

Semantic Triplets from the one shared pool are the default speech · the Triplet is the grammar, the player's choice is the move (Town J-13), retorts are collectible (J-14) · Monkey-Island selectable lines, no free-text player input · in-world content English only · **no Claude- or LLM-written sample dialogue in briefs, docs or fixtures** (reference real `tripletId`s, real Card refs, real source quotes, or write `OPEN`) · the NPC never explains the closure (Town §11.3) · no motivational koans, no arbitrary X-with-Y combos (Town §12.1) · Therefore/But is a thinking aid, not a phrase (Town D36) · ChatterBox owns wording, host owns timing · one memory owner (Resident Social Memory) · the LLM never writes social state, POP or rewards · no merge, no Live promotion · stop after two failed repairs on the same gate.

## 4 · Proposed model (proposal, not decided)

From the research (AI Town, Generative Agents, Lyfe, Humanoid Agents, Concordia, Comme il Faut / Ensemble, Talk of the Town, Slice of Life, SPASM):

- **A · Social state, deterministic and small:** Lean Card clamps (archetype prefill + overrides) · closeness and heat per pair · **belief records per Resident and Card with a source** (`signature-deck | heard-from:<id> | seen | guessed`) · mood state (calm / stressed / breakdown / recovered) · a tiny set of social exchanges with preconditions and effects.
- **B · Voice, one LLM call per speaker:** context built only by A, the shared log projected into the speaker's own view (SPASM "Egocentric Context Projection"), output in Triplet form with anchored slots, Fluffolekt as a later transform, deterministic validator, generated lines logged and only pooled when Georg picks them.
- **C · Lean Memory inside Resident Social Memory:** receipts instead of prose, one rolling opinion line per known Resident and Card, no vector search at our scale.
- **Player:** the currently possible social exchanges are the Monkey-Island list; a tri-cut flip-book presentation is a candidate (Rolodex donor).

## 5 · Feedback on the original brief

- **Worked well:** stop rules, the explicit PR list (#305/#306/#308/#310) with second-owner risk, the "not KFV" rule, SOURCE_MAP and LEDGER before architecture. Keep this shape.
- **Adjust next time:** the brief centred on the table simulation and on CritEngine/NIE as narrative engines. The real centre was Residents and Cards (#272 line), which already had most of the design. **Check #272 and the Town living doc first** for any NPC or dialogue brief.
- **Speech invariants were missing from the brief** and got lost in the first pass (Triplets, Monkey Island, English, no sample dialogue). They are now in §3 above.
- **CritEngine status:** not empty. Its Living-Doc v0.9 records the Sprint-01 content as adopted; the files are just not split into `archetypes/` yet (ledger C-02). For Resident work it is a donor for conflict axes, not the owner.
- **Corrected:** the earlier claim that #305 gives BINGO/BONGO/BOGGLE/BLOEDSINN a different meaning from the public social calls (D-11) was wrong; see §7.6.

## 6 · What WSA should and should not brief now

**Do not brief yet:** R2 (first Social Card Relay build), any Kayfabulation sim build, any Open World integration, a new engine.

**Next brief, once Georg's Resident list is in (R1):**
1. Rewrite the lean card contract on the clamp field set plus belief records, Triplet weights and Fluffolekt rate; re-label Lorekeeper and Doppel-Denk as special roles; add the first regular Residents (source-backed values only, everything else `OPEN`).
2. Design (not build) the dialogue test bench: same Card and Resident pair, three arms (pool-only · rule-composed · free LLM), blind read by Georg, criteria in the rule note §3.5. Host open (GPT Site idea vs. Cloudflare Worker); keys are set by Georg only.

**Rolodex:** physical, comes later. Georg: it is only one example with a strong philosophy focus and unlikely to add much. **Not a gate.** The Gemini chat about it is recorded as DONOR.

## 7 · Georg's answers (2026-10-03)

1. **The LLM may also choose the social exchange** in tests (not only voice it). The social state still applies the effects; the LLM never writes POP or rewards.
2. **First exchange set accepted:** speculate, contradict, dismiss, claim, pass-on, gift.
3. **Koans and haikus are allowed forms; they are not calendar sayings.** Calendar sayings / motivational aphorisms are never wanted. (Town §12.1 "Motivationskoans" means the motivational aphorism, not the koan form.)
4. **First tests without Fluffolekt.** Fluffolekt stays a later layer.
5. There is no Resident list yet. **Do not put decisions to Georg in .md files**; ask in chat, with enough context that he can decide without opening files.
6. #305 operator naming (G-10): **closed, no rename.** The four social calls are the player's Monkey-Island answer options in the Resident chat (three standard reactions + BLÖDSINN as reject/cancel) and general social reactions everywhere; they link no Card. #305 already uses them that way: the call is an input that shapes which Triplet the Resident answers with. The earlier "double meaning" finding (ledger D-11) was wrong and is corrected there.

## 8 · Files in this folder

| File | State |
|---|---|
| `RETURN_WSA.md` | **this file**, entry point for WSA |
| `RECON_REORIENTATION_2026-10-02.md` | entry point for the new direction |
| `NPC_SOCIAL_MODEL_RESEARCH_2026-10-02.md` | research + three-layer proposal |
| `TRIPLET_DIALOGUE_RULE_NOTE_2026-10-02.md` | Triplet as dialogue rule, Fluffolekt, anti-ping-pong guards |
| `ROLODEX_GEMINI_DONOR_2026-10-02.md` | Gemini chat as DONOR, take/change/reject |
| `RESIDENT_LEAN_CHARACTER_CARD.md`, `resident-lean-card.v0.1.schema.json`, `residents/*.json` | v0.1 contract and two draft cards; to be rewritten in R1 |
| `PRODUCTIVE_SLICES.md` | R0–R6 (R0 revised in `RETURN.md`) |
| `OPEN_DECISIONS_FOR_GEORG.md` | partly superseded by §7 above |
| `SOURCE_MAP.md`, `CANON_DELTA_LEDGER.md` | inventory and ledger, still valid |
| `NARRATIVE_RUNTIME_ARCHITECTURE.md`, `KFB_SIM_EVENT_SCHEMA.json` | parked for R6 |
| `KFB_SIM01_ENTSCHEIDUNGEN.html` | withdrawn (notice only) |
