# S1 prep · Residents and Card for "two Residents talk about one Card" · 2026-10-04

- By: Claude Coworker, on Georg's request (prep while Georg is away; no build, no runtime change)
- Belongs to: `COORDINATION_PLAN_WSA_CLAUDE_2026-10-04.md` slice S1
- Decisions are asked from Georg **in chat**, not in this file.

## 1 · What already exists (found on GitHub, not new)

PR #310 (`RESIDENT-CHAT-ENSEMBLE-01B`, head `7c6522fb`) already holds most of what S1 needs:

| Piece | Where | State |
|---|---|---|
| Four Residents loaded together (Lorekeeper, Goth Girl, Clown, Witch), Rig_Medium, with props | `qa/ensemble-browser.mjs`, `SOURCE.json` (Resident Atlas S15 host) | source isolation + ensemble proof written; one player turn with Clown answering a **KayfaBINGO!** |
| Resident profiles (method, core want, core irritation, deck candidate, speech-avoid list, attitude, preferred social calls) | `src/resident-chat-ensemble-data.mjs` → `RESIDENT_PROFILE_SOURCE` | Site-authored **CANDIDATE** (Production Control file `dcbbde71…`) |
| Shared Triplet pool: 4 global + 16 signature Triplets (4 per Resident), with relation and tags | same file → `TRIPLET_POOL_SOURCE` | **AUTHORING_CANDIDATE** (Production Control file `0d7d3aea…`), never reviewed by Georg |
| Social calls as inputs | same file → `socialOperators` (BINGO land / BONGO hold / BOGGLE reframe / BLÖDSINN object) | matches Georg 2026-10-03 |
| Kernel + scene seam | #305 `prepareResidentTurn` @`5b595a07`, #306 @`ba38ed7b` | tested |
| Residents already inside World Studio | `wb2-party.v1.js` mounts Resident Atlas S16 band/disco at pin `b6afb431` | running in the four-island candidate |

Consequence: S1 needs **no new authoring system**. It needs Georg's choice of pair and Card, Georg's review of the 20 candidate Triplets, and one wiring run into World Studio.

## 2 · Lean cards (clamp shape) for the three regular Residents

Lorekeeper is a special role (meta-archivist / mentor) and is not used for S1.

- Schema: `resident-lean-card.v0.2.schema.json`. It holds the H&D-shaped clamp set (clamp, method, core want, core irritation, contradiction, failure loop, fears, escalation style, hidden goal, dark secret, speech-avoid). Every field is `{v, src, status}` with status `SOURCE | DESIGN | PREFILL | OPEN | CONFLICT`. Dialogue fields are impossible by schema.
- Cards: `residents/goth-girl.card.json`, `residents/clown.card.json`, `residents/witch.card.json`.
- **SOURCE**: everything from the #310 profile data (marked as Site-authored candidate).
- **DESIGN**: from Base-24 (#272), meaning Jung drive, journey function, friction engine, habitat and deck lane.
- **PREFILL** (archetype heuristic, Georg asked for this on 2026-10-02): only `clamp`, `failureLoop`, `fears`. Short keyword anchors, needing Georg's OK.
- **OPEN**: hidden goal, dark secret, deck stance, signature cards, closeness/heat defaults. None of these is needed for S1.
- Checks: schema meta-valid; all 3 cards 0 errors; rejected on purpose: PREFILL without value, a language owner other than ChatterBox, any extra field such as a sample line.

## 3 · Pair and Card candidates for S1 (KFB Town)

Card source: the three-futures decks that match the World Studio islands (`media/kfb/kfb-index.json`: `forget_utopia`, `ignore_dystopia`, `embrace_protopia`). Power lines quoted from the deck JSON.

| Option | Pair | Card | Why it fits the existing pool |
|---|---|---|---|
| **A (recommended)** | Goth Girl × Clown | `forget_utopia#11` **The Standing Ovation**: "Reward applause faster than questions. Make doubt feel rude." | Both have pool Triplets on applause/consensus (`gothgirl.applause.01`, `core.applause.01`, `clown.consensus.01`). Strongest contrast: earned reaction vs. forcing a visible stake. |
| B | Witch × Clown | `ignore_dystopia#30` **The Cortisol Economy**: "Sell the cortisol spike, then sell the relief, to the exact same customer." | Witch's dose/variable Triplets (`witch.dose.01`, `witch.variable.01`) against Clown's stake/theory Triplets. |
| C (fastest) | Goth Girl × Witch | `ignore_dystopia#1` **The Doomsday Clock**: "Set a public timer near midnight and move the hands by announcement, never by event." | Already the proven Card of the #306 scene; Witch's falsifier/condition Triplets. Weaker contrast. |

## 4 · What Georg decides (in chat)

1. Pair and Card: A, B or C.
2. The 20 candidate Triplets: keep, cut or change (they become the first reviewed pool).
3. OK for the PREFILL anchors (clamp, failure loop, fears) of the chosen pair.

## 5 · What the S1 build run then does (for WSA Work, after W1)

Consume #305 kernel + #310 data module + the chosen lean cards in World Studio on KFB Town: two Residents from the existing Resident Atlas source, one real Card, player answers with the four social calls as Monkey-Island buttons, Journey stores one receipt, revisit changes one reaction. No LLM, no Fluffolekt, no new dialogue or memory owner. Brief follows after Georg's choices and W1.
