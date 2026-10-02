# Rolodex · Gemini chat as DONOR · 2026-10-02

- Source: an earlier Gemini chat Georg pasted into the session on 2026-10-02 ("hier erstmal gemini damals dazu").
- Status: **DONOR**, not canon. The physical Rolodex ("Rolo-Deck") is in Hürth; Georg brings it later. Georg: it is only one example with a strong philosophy focus and unlikely to add much → **not a gate**. Character list also later.
- **The example fragments, NPC names and example dialogue in the Gemini chat are not copied here and must not be reused** (invariant D-17; they also conflict with Town §12.1, see below).
- Companion to `TRIPLET_DIALOGUE_RULE_NOTE_2026-10-02.md`.

## What the donor proposes

1. **Physical metaphor.** The object is sold as a three-part ring-bound desk flip book (German: Tischaufsteller mit Ringbindung, 3-geteilt; English: split-page flip book / tri-cut flip chart). In the game the three stacks flip before a line appears, so the player sees the speaker's mindset "click into place".
2. **Weighted pool.** Every fragment in slot A (subject/state), B (coupling/action), C (object/valuation) carries a weight per archetype. A Resident's archetype vector is multiplied with the fragment weights; each slot is drawn by weighted random sampling, with a small floor so rare picks stay possible.
3. **Triplet as LLM seed.** The rolled triplet plus NPC profile plus situation go into a prompt; the LLM writes 2–3 sentences of character dialogue that must "enforce the logic of the triplet", returned as JSON (triplet ids, visual string, dialogue, optional audio cue).
4. **Gameplay hooks.** Gifts or items can shift a Resident's archetype vector permanently and so unlock other fragments. Structure in the triplet lets small, cheap models stay consistent.

## Assessment against KFB canon

| Donor element | Verdict | Why |
|---|---|---|
| Tri-cut flip book as visible UI | **TAKE** | Fits Town J-13 (the Triplet is the grammar, the choice is the move) and the Cut-and-Play table look. A strong presentation for the Monkey-Island choice list too: the player flips a stack. Presentation owner: ChatterBox / bubble layer, not a new runtime. |
| Archetype weight per fragment, weighted sampling | **TAKE, extend** | Same as the "own weighting of the shared Triplet pool" Georg asked for. Extend: weights come from the Lean Card (archetype prefill + overrides) and mood state, and sampling is **filtered by context first** (Card anchor, relation chosen by social state), then weighted by personality. Personality alone does not make a line fit the situation. |
| Gifts shift weights / unlock fragments | **TAKE as idea** | Connects to Gift culture (#272) and collectible retorts (J-14). Amount and rule: Georg. |
| Independent random draw per slot | **CHANGE** | Three independent draws produce arbitrary combinations, which Town §12.1 rejects ("beliebige X-mit-Y-Kombinationen"). Slots must be linked: B is chosen as a relation that fits A, C comes from the speaker's lens on that pair (rule note §3.1). |
| LLM expands the triplet into 2–3 free sentences | **REJECT as default** | This turns the triplet back into a hidden prompt and lets the LLM write ordinary prose, which reintroduces drift and slop and states the conclusion. Georg's direction is the opposite: the triplet **is** the line, with a gap left to the player (Town §11.3). Allowed use of the LLM: choose and lightly bind anchored fragments, apply Fluffolekt, return structured output (rule note §3.4). Free expansion can stay as one arm of the A/B/C test. |
| Philosophical / abstract fragment vocabulary | **REPLACE** | Generic abstractions are true anywhere and about nothing (the rejected "motivational koan"). Fragments should be anchored in Cards, Signature Decks and clamps. The donor's own second draft already moved to a context-agnostic subject/action/target layout; KFB goes further and makes the Card the anchor. |
| Cheap small models | **TAKE** | Matches research note (Lyfe cost argument). |

## Open

- The physical Rolodex: which reveal-card (Aufdeckkarten) examples it holds, and whether its three stacks map to Subject/Connector/Reframe, to SHOW/SPIN/SELL, or both (Tourbus v2 allows deliberate overlap).
