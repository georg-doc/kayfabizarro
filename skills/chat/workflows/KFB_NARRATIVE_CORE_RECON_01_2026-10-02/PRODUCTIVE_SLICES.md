# KFB-NARRATIVE-CORE-RECON-01 · PRODUCTIVE_SLICES (rewritten 2026-10-02)

Resident-first order after Georg's review (`RECON_REORIENTATION_2026-10-02.md`). The first-pass "SIM-01" is now the late slice R6.

**Invariants for every slice (copy into every brief):**
semantic Triplets from the one shared pool are the default speech · Monkey-Island selectable lines, retorts collectible · in-world content English only · no Claude-written sample dialogue in briefs, docs or fixtures (reference real `tripletId`s, real Card refs, real source quotes, or write `OPEN`) · ChatterBox owns wording, host owns timing · one memory owner (Resident Social Memory, filtered view of the Journey) · no merge, no Live promotion · stop after two failed repairs on the same gate.

---

## R0 · RESIDENT-CARDS-AUTHORING-01 (Georg, short)

- **Owner:** Georg · **Agent:** none
- **Input:** `residents/lorekeeper.card.json`, `residents/officer-doppel-denk.card.json`, their `openQuestions`
- **Output:** answers for the OPEN authoring fields that the first proof needs: Doppel-Denk deck stance (A/B/C) and actor; Lorekeeper Signature Deck; one line of dark secret / backstory direction each (optional for R2).
- **Stop gate:** R2 does not invent any of these.

## R1 · RESIDENT-LEAN-CARD-INTAKE-01

- **Owner:** KFB Town Resident Social Memory (#272 line)
- **Agent:** ChatGPT-Web/Claude Web with Actions or Coworker · strong model · Reasoning: Medium
- **Input:** this recon's `resident-lean-card.v0.1.schema.json` + two cards; #272 docs (Base-24 §8, Doppel-Denk §17, Signature Decks §4); shared Triplet pool (read, not edit)
- **Output:** the receiving owner adopts or adjusts the card contract; both cards land next to the #272 docs; the Triplet pool is read and real signature `tripletId`s are filled where they exist (no new lines written).
- **Tests:** both cards validate; every SOURCE/DESIGN value resolves to a real file; zero sentences in `speech`; zero non-English in-world strings.
- **Stop gate:** a needed Triplet does not exist in the pool (record `NEEDS_SOURCE`, do not author it).

## R2 · RESIDENT-SOCIAL-MEMORY-01 · first Social Card Relay (the next real build)

Exactly the gate #272 already names, content step 2.
- **Owner:** Resident Social Memory (memory) · ChatterBox + #305 kernel (speech) · NPC-CARD-SPEC-01 owners (actors, mouth, gaze, bubbles, camera) · world owner (routes)
- **Agent:** the Resident lane (ChatGPT-Web with Actions, like #305/#306) or Coworker with a real checkout · strong model · Reasoning: High
- **Input:** two Lean Cards (after R0/R1), one real Card from the deck SSOT, #305 kernel @`5b595a07`, #306 seam @`ba38ed7b`, #310 result
- **Flow:** Resident A hands the Card to the player (Card enters Almanac as discovered) → player walks to Resident B → Monkey-Island choice list for SHOW / SPIN / SELL → B reacts through the Triplet kernel with `knowledgeSource` = signature-deck vs. heard → A or a witness reacts (speculation triangle) → visible reaction choreography → one `card-relay` Lean Memory receipt → both resume routines.
- **Tests:** speech only from the pool (every line has a `tripletId`); player choices are a list, not free text; English only; one receipt, no inventory ledger; resume works; revisit changes one response because of the receipt.
- **Stop gate:** a second dialogue or memory store would be needed; a Triplet would have to be invented.

## R3 · RESIDENT-CULTURE-01 (one beat)

- One KISS Gift **or** one Brick Fish **or** one Signature Dance beat triggered by an R2 outcome, through existing Motion Library / Combat owners. One beat only.

## R4 · RESIDENT-DECK-MAPPING-01

- Signature Deck mapping pass for the next 3–5 Residents (Signature Decks §20): `deckRef`, stance, 3–7 Signature Cards, worldview tags, deck goal. Content work, no runtime.

## R5 · Exceptional Card acquisition adapter (later)

- A minigame (Combat / Card Zone / Race) produces one missing Card that re-enters the social loop (Card Relay §18).

## R6 · KING-KAYFABULATION-MINIGAME-01 (later; formerly "SIM-01")

- Player composes Actor + 3 Scenes + Quest from collected Cards at King Kayfabian; Residents only give social calls; the King judges.
- Donors when it starts: Gameplay Engine v2 (King step, calls, NDJSON), Simulator v0.8 (Match Card, look, optional four-readings after-show), parked `KFB_SIM_EVENT_SCHEMA.json`, WS1 A6 closure operators (BECAUSE / BUT / SO / THEN / MEANWHILE / AGAIN, anti-closure AND THEN).
- Hard rule test carried over: the story is told **as the Actor card**, never as the Resident or player persona.

```
R0 ─► R1 ─► R2 ─► R3
            └──► R4 ─► R5 ─► R6
```
