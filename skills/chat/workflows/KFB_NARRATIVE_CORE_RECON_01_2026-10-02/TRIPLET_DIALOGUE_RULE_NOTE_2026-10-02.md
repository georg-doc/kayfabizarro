# Triplet as Dialogue Rule · Design Note · 2026-10-02

- Status: **Georg's direction (stated 2026-10-02) + proposal for the mechanics.** Nothing built, nothing decided beyond Georg's own words.
- Companion to `NPC_SOCIAL_MODEL_RESEARCH_2026-10-02.md` (layer B "Voice").
- No sample dialogue in this file, on purpose (invariant D-17). Mechanics are described through slots, anchors and checks only.

---

## 1 · Georg's direction (paraphrased, German original in the session)

Triplets are his answer to drift and AI slop. Together with a persistent memory layer, a line is either taken from the pool or, preferably, the **Triplet logic itself works as a contextual dialogue rule**: a semantically smart linking of Triplet parts, so that lines refer clearly to the Card (its buzzwords and content) and form a small koan- or Zen-like pattern that leaves the conclusion to the reader.

**Fluffolekt** works like Smurf language: carrying verbs or other words are replaced by fluff forms. "What the Fluff" and "Stay Fluffy" are already anchored as catchphrases. Triplets and Fluffolekt add abstraction layers on top of plain dialogue.

Guard: this must not turn into a confusing AI-slop ping-pong between characters for the player. Aim: humorous, satirical, varied, orchestrated through LLM calls. The exact semantic logic is still to be worked out.

Georg has a **Rolodex** where this was worked through with reveal cards (Aufdeckkarten) as examples. Not found in the repo default branch or the connected Dropbox folders on 2026-10-02 → `NEEDS_SOURCE` (Georg to drop it).

---

## 2 · Canon this builds on (do not re-decide)

| Source | What it already fixes |
|---|---|
| Town `LIVING_KFB_TOWN.md` J-13 | Conversations follow Monkey-Island logic. **The Triplet is the grammar, the choice is the move.** |
| Town J-14 | Retorts are collectible; listening becomes a collecting mechanic. |
| Town §07 / J-15 | Encounter sends beats; animation layer and text layer pick independently. NPC memory is a filtered view of the Journey. |
| Town §11.3 | **The player makes the connection; the NPC delivers no closing interpretation.** |
| Town §12.1 (S001) | **Each of the three Triplet parts carries meaning**; a bare middle part is too thin; more weight is not more words. **Fluffolekt uses the situation as the carrier of meaning, not as an excuse for three unintelligible fragments.** Rejected: generic AI gags, arbitrary X-with-Y combos, object-acting fillers, **motivational koans**. Fluffolekt / Fluff-o-lect is a fixed name. |
| Town §13.1 (D36) | South-Park causality (Therefore/But) is a **thinking and checking aid, not a mandatory phrase**; the lexical template sounded like advertising. |
| Town §13.5 (P23) | Distinguish visible motif, card text, game knowledge and interpretation; no invented "seen" details. |
| `CHATTERBOX_TOURBUS_REUSE_2026-09-14.md` §5 (Tourbus v2) | `Subject / Connector / Reframe` names the sentence roles; they may deliberately carry SHOW IT / SPIN IT / SELL IT. Fractal: the same operation at sentence, card-sequence, ride, room or Almanac scale. Player closure is not explained by the NPC. |
| #305 kernel @`5b595a07` | Deterministic `prepareResidentTurn`, shared pool, signature Triplets. |
| WS1 A2 / A6 | Grammar `fragment → turn → gap → player closure`; closure relations BECAUSE / BUT / SO / THEN / MEANWHILE / AGAIN, anti-closure AND THEN. Read together with D36: these are **relations**, not words that must be printed. |
| Base-24 Archetype Map §8 | Lean Character Card already lists Triplet flavour and a Fluff-o-lect field per Resident. |

**One tension to settle (Georg):** "koan / Zen-like" (now) vs. "no motivational koans" (§12.1). Proposed reading: allowed is the **open-gap** form, anchored in a concrete Card and situation, whose relation the player completes. Rejected stays the **motivational aphorism**: generic, self-help tone, true anywhere and about nothing.

---

## 3 · Proposal: from pool lookup to rule

Pool lines stay first choice. When no pool Triplet matches the situation, the rule composes one. The rule is what keeps generated lines from becoming slop.

### 3.1 Slots must be anchored

Each part of the Triplet must point to a concrete anchor id, otherwise the line is rejected:

| Slot | Anchor sources (layer A of the research note) |
|---|---|
| **Subject** | A Card field (title, buzzword, visible motif, stated claim; §13.5 distinctions) or the speaker's own belief record about the Card |
| **Connector** | A **relation** chosen by the social state (for example concede, contradict, shift, repeat, misread, trade): the A6 relations plus the social exchange that fired. Printed as content, not as a fixed connective word (D36). |
| **Reframe** | The speaker's lens: Signature-Deck lane, worldview tag, clamp field (core question, contradiction, failure-loop step, trigger word) |

The **gap** is the end of the line. No conclusion is stated; the Monkey-Island list offers the closing moves to the player.

This makes "anti-slop" mechanically checkable: a line with an unanchored slot, or with the same anchor in all three slots, fails.

### 3.2 Fluffolekt as a transform layer

Applied after composition, never instead of it:
- Replaces **one carrying word** (verb first, otherwise a noun) per line with a fluff form.
- **Never replaces the Card anchor token.** The reference to the Card stays literal and readable; that is what keeps the game legible.
- Rate per Resident (archetype prefill) and per mood state (CtP state machine: stressed / breakdown shift the rate).
- "What the Fluff" and "Stay Fluffy" are reserved interjections with a small budget, not decoration on every line.
- Exact fluff word list: `NEEDS_SOURCE` (existing Fluffolekt definition to be located; do not invent a new lexicon).

### 3.3 Guards against ping-pong

- Short exchanges (3–6 turns), then the player gets the floor.
- Every turn must **move** something: a new anchor, or a new relation on the same anchor. Same anchor plus same relation twice in a row is rejected.
- No reply-to-reply chain beyond two NPC turns without a player choice.
- Card anchor literal in at least every other line, so the player never loses what is being talked about.
- Fallback: a plain pool line, or silence (Town 11.1: quiet is a valid state).

### 3.4 Role of the LLM

The LLM fills slots under the rule and returns structured output: `subjectAnchor`, `relation`, `reframeAnchor`, `surface`, `fluffApplied`. A deterministic validator checks anchors, guards and English. Rejected outputs fall back to the pool. Accepted generated lines are logged as `generated` and enter the pool only when Georg picks them (research note §2-B).

Context per call (SPASM-style projection): own Lean Card, own Triplet weights and fluff rate, the Card JSON, own belief record, the last turns from this speaker's perspective, optional one external signal (H&D `earth_signal` / NIE hook order Card → situation → faction → relation → local history → RSS).

### 3.5 How to judge it

Blind A/B/C read by Georg on the same Card and pair: pool-only · rule-composed · free LLM. Criteria: does every line clearly refer to the Card; do the two voices stay distinct; does the gap invite a choice; slop flags (generic, motivational, X-with-Y, explaining the joke).

---

## 4 · Open

1. Koan reading (§2 tension): confirm "open gap yes, motivational aphorism no".
2. The Rolodex with reveal-card examples (`NEEDS_SOURCE`).
3. The existing Fluffolekt definition / word list (`NEEDS_SOURCE`).
4. Relation set for the connector: A6 relations only, or A6 plus the social exchanges from the research note.
