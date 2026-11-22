# KFB Game Loop R17 · Ride the Consequences: Framing, NPC Reactions and Lean World Echoes
2026-10-29 · GEORG CREATIVE CORRECTION / ADDITIVE CONCEPT · NOT RUNTIME OR NEW GLOBAL SSOT

**Owner:** existing KFB_HUB/30_DECISIONS/replies design lane, Draft PR #460; receiving owners remain current Card/Almanac, Resident Life/ChatterBox, WS1 World/Save/Combat, HyperNorm/Media and Audio/Motion. **This R17 corrects the R16 AUDIO TYPO without rewriting or silently accepting the incorrect historic motto.**

## 1 · Canonical motto and source recovery
**Correct Georg motto: “You choose something, ride the consequences.”**
R16 transcribed “invite the consequences”; that is an AUDIO BUG and is explicitly SUPERSEDED for all future briefs, PR summaries and design handoffs. Earlier R16 is preserved as versioned history only. “Ride” inherits the physical *Rollercoaster* and consequence-cascade metaphor: player initiates an action, then experiences its unfolding response, sometimes after a delay and not fully under player control.

An **actual older GitHub donor** uses the close phrase **“you hit, now ride the consequences”** in `travel/KFB Travel Globe v13-1/globe-v13/fx-bus.js`. That module describes time-delayed effect beats, single source owners and bounded duration. It is **evidence of prior physical FX direction, not evidence that NPC social reactions are already implemented or governed by this FX bus**.

## 2 · The premise: choices have effects, not author-certified meaning
A player may collect, play, offer, deliver, sell or contest a canonical Card; stage it as an important discovery, a silly claim, a suspected hoax, a conspiracy theory, a spiritual insight or an official bulletin; wear a Heel/Face role; suppress/reveal its display; or ignore everyone. **The original `deckId:cardNumber`, Card PDF, Power/Lore and provenance do not change with the chosen sales pitch.**

The player's **public performance/frame** is an in-world social act. It can shape who listens, who distrusts the speaker, who is irritated, who finds the claim intriguing, who decides to investigate, and whether the next encounter is more awkward, comic, hostile or supportive. A declaration such as “baseless conspiracy theory” or “important source worth examining” is always **attributed to the speaker**, never an omniscient factual classification by the game.

**Consequences are not an epistemic score**: agreement is not enlightenment, anger is not proof of being right, censorship is not proof of a hidden truth, contradiction is not a forced therapy arc. The audience may ignore a pitch entirely; the scene may fail to produce any social ripple.

## 3 · A small model of plausible emergence: six lenses, not a psycho-simulator
This is an editorial/heuristic *selection model*, NOT a proposed new person-state schema or accepted runtime formula:
1. **Source/claim:** actual Card and authored context; degree of thematic match, surprise, contradiction with something the NPC already knows; real evidence stays distinct from rhetorical packaging.
2. **Speaker and framing:** known relationship/reputation with the presenter; humorous, alarmist, official, conspiratorial, curious, modest or commercial delivery; claims attributed to actor. The player's intent is **not mind-read**.
3. **Receiver:** authored Resident biography, institution/job, current needs, interests, social ties, existing Card knowledge and historical first-exposure order (R5).
4. **Situation and witnesses:** public vs private, nearby audience, current activity, power imbalance, actual object/POI condition; a face-to-face argument differs from a noisy billboard.
5. **Affect and bandwidth:** brief surprise/annoyance/amusement/avoidance reaction as already proposed in Resident Life; temporary affect decays, no accumulating permanent resentment for every repeated line.
6. **Aftereffect:** optional remembered meaningful encounter/rumor, changed contact/access, next Card lead, temporary faction/POI response, altered facade/Ink/media placement or quiet continuation; source-backed and idempotent.

**A small response palette** suffices: inquire, accept the gift without endorsing, counter-question, joke, dispute, warn, dismiss, avoid, report/censor, reciprocate, remain silent. Reactions must have *character reasons* and may be partly unpredictable through bounded seeded tie breaks, not arbitrary LLM randomness. Each NPC can retain mutually inconsistent past statements without an automatic “belief corrected” state.

**Philosophical / communication / psychoanalytic inspiration:** framing and attribution, cognitive dissonance, motivated reasoning, social identity, competing interpretations, image/performance and self-serving rationalization may inspire **authored situations and heuristic choices**. Do **not** present these theories as equally established science, diagnostic instruments, complete models of a human mind or reliable detectors of real player psychological traits. Avoid forced “positive learning.”

## 4 · Diegetic “World opinion” without anthropomorphizing the engine
The KFB world is a **responsive living toy**, not a sentient meta-judge or a second AI director. Its apparent “opinion” emerges from **inhabitants and institutions doing things**:
- A newsroom edits a Billboard headline or leaves conspicuous gaps.
- A Men in Black crew covers a Card building with bounded Goo; an opposing Resident peels a seam; either may claim a benefit.
- A crowd changes the tone of a show; a shopkeeper refuses a handoff or offers a comically exploitative purchase; a courier reroutes.
- Clay props, color/Fluff, lamps, noise, route signage or music visibly respond to actual world state.

These are **situated authored/heuristic consequences** with named owner/witness attribution, not a global “World believes X” field. A calm facade can hide real disagreement; a noisy collage can fail to persuade anyone. HyperNorm is a presentation/visibility process, not a fact-check oracle.

## 5 · Compact mechanism: one event, limited cascade, lean receipts
**Conceptual sequence (not a new JSON/API contract):**
`PLAY / DELIVER / COVER / REVEAL → attributed Card + frame + context → observer-specific reaction selection → physical/performance feedback → optional consequential event receipt → later replay/return variation`.

- Reuse `RESIDENT_KNOWLEDGE_PROFILE` and current ChatterBox **SHOW IT → SPIN IT → SELL IT** for distinct source-grounded Resident responses; not compulsory Triplets, rapping or endless lecturing.
- Reuse `RESIDENT_REACTION_ENCOUNTER_MATRIX_PREP_2026-10-06.md` priority/affect/reaction principles: one high-priority pulse, pose/face/micro-motion, bubble or silence, then resume/replan; **no LLM call required**.
- Reuse actual World/Save and Lean Event Memory to store only significant receipts: true Card ref, who handed/presented it, actual public frame where relevant, witnessed event, resulting action, source/time/POI and affected NPC refs. **No recording an inferred player's ideology or belief state**; no duplicate Card/quest reward on replay.
- Propagate at most bounded witness-to-witness impressions when a real encounter/source connection exists; no instantly omniscient faction news, unbounded gossip network or expensive per-NPC always-on inference.
- Treat R5 order as a *possible selection cue*, not psychological certainty. The same final Cards and different encounter orders may produce different, still plausible reactions.

**“Ride” is temporal:** action feedback now, brief socially legible response next, optional delayed physical or social echo on revisit. Use accepted single-owner FX/Motion/Audio for timing and display, not the older Travel FX donor directly as a new live reaction engine.

## 6 · Minimal paper comparison, not a new mini-game program
One verified Card, one place, **two authored Residents** with different profiles, and two *attributed pitches*:
- Pitch A from the player: “dangerous, baseless conspiracy story” (fictional claim, not game fact).
- Pitch B from the player: “unusual find that might repay a closer look” (also not game fact).

Observe whether reactions diverge for identifiable reasons and whether a changed delivery produces a remembered conversational consequence **without** an authorial truth verdict. Test a return visit and one different exposure order. A third silence/no-interest outcome is allowed. The player may keep the Card, leave the world, or switch sides.

**Evaluate:** recognizable player cause, comprehensible specific NPC response, fun/satirical physical feedback, bounded runtime cost, memory continuity/no duplication, no forced ideology or conversion. **Not:** that a player became more enlightened, tolerant, convinced or was psychologically measured.

## 7 · Relation to R15/R16, scope, one next gate
R15 remains **No Philosopher King / Universe in a Nutshell**. R16 remains a historical source of its four-axis choice/interpretation/consequence architecture, but its incorrect word **“invite” is replaced by “ride”**. The corrected motto is both **Rollercoaster physical consequence** and **socially situated communication consequence**. This is the smallest correction of the error while preserving source history.

**Source read:** actual GitHub `travel/KFB Travel Globe v13-1/globe-v13/fx-bus.js` (prior phrase); `skills/chat/RESIDENT_LIFE_SEMANTIC_MODEL_PREP_2026-10-06.md`, `skills/chat/RESIDENT_REACTION_ENCOUNTER_MATRIX_PREP_2026-10-06.md` (planning, not running); `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md`; `DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md`; R5/R15/R16 and Global Intent.

**Tests:** 0 runtime, 0 browser, 0 player playtests, 0 source-isolated visual proof. No edits to existing Card/World/Resident runtime, Stage/Site/Live, central Hub/SSOT or earlier versioned concepts. Island R4 remains NO MVP.

**One next gate:** WS0/Georg editorial intake of **R17 corrected motto + bounded NPC/world reaction principles** into existing Bigger Picture/Global Intent. A later physical test requires separate current-owner authorization; no new reaction runtime from this document.
