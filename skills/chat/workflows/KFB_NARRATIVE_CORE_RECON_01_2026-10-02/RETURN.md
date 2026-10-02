# RETURN · KFB-NARRATIVE-CORE-RECON-01 (reoriented 2026-10-02)

- Executor: Claude Coworker (Opus 5.5)
- Repo / branch: `georg-doc/kayfabizarro` · `coworker/kfb-narrative-core-recon-01-2026-10-02`
- Folder: `skills/chat/workflows/KFB_NARRATIVE_CORE_RECON_01_2026-10-02/`
- No PR, no merge, no deploy, no runtime built.

## What changed after Georg's review

1. **Centre of gravity.** The Kayfabulation table simulation is a later King Kayfabian minigame. The core is Residents with a lean character system, Cards as world artefacts, the player bringing a Card, Residents speculating from their Signature-Deck knowledge, memory in Resident Social Memory (PR #272 line). → `RECON_REORIENTATION_2026-10-02.md`
2. **Speech invariants made explicit.** Semantic Triplets from the shared pool as default, Monkey-Island selectable lines, English in-world, no Claude-written sample dialogue in any brief. → reorientation §2, ledger D-17, repeated in every slice
3. **Tell-as-Actor rule** kept for the later minigame (ledger C-01).
4. **CritEngine status corrected** (content adopted per Living-Doc v0.9; files not split; ledger C-02).
5. **Decision page withdrawn** (`KFB_SIM01_ENTSCHEIDUNGEN.html` is now a notice).

## Files

| File | State |
|---|---|
| `RECON_REORIENTATION_2026-10-02.md` | **new**, the current entry point |
| `RESIDENT_LEAN_CHARACTER_CARD.md` | **new**, contract proposal for the lean character system (pointer-based, no dialogue) |
| `resident-lean-card.v0.1.schema.json` | **new**, JSON Schema 2020-12 |
| `residents/lorekeeper.card.json`, `residents/officer-doppel-denk.card.json` | **new**, first two cards, only source-backed values, everything else `OPEN` / `CONFLICT` |
| `PRODUCTIVE_SLICES.md` | **rewritten**, Resident-first (R0 to R6) |
| `OPEN_DECISIONS_FOR_GEORG.md` | **rewritten**, 6 short authoring questions |
| `SOURCE_MAP.md`, `CANON_DELTA_LEDGER.md` | inventory, ledger extended (C-01 to C-03, D-17, D-18) |
| `NARRATIVE_RUNTIME_ARCHITECTURE.md` | still valid for owners/layers; its Game Director layer is deferred to R6 |
| `KFB_SIM_EVENT_SCHEMA.json` | parked draft for the R6 minigame |

## Checks

- Lean-card schema is meta-valid (Draft 2020-12). Both cards validate with 0 errors. Two broken variants are rejected: SOURCE without value or source, and a language owner other than ChatterBox.
- No Claude-written dialogue line in any remaining file. The Doppel-Denk profile's illustrative lines (marked "not canon" in its source) are deliberately not copied.
- Every SOURCE/DESIGN value names its file: #272 docs @`992ea989`, #310 QA @`7c6522fb`.

## Update later on 2026-10-02 (Georg)

- **Lorekeeper and Officer Doppel-Denk are special meta roles**, not regular Residents for the first Card Relay. Lorekeeper: meta-archivist with the overview of all decks, mentor on his island. Doppel-Denk: patrolling comic relief who wants order and sees Cards as unrest; his stance to the Anti-Rules deck is handled globally, not per deck. Their two card files stay as drafts and will be re-labelled in the contract rewrite.
- **Character system:** high-level clamps in the Hunky & Dory shape (clamp, core question, hidden goal, fears, contradiction, failure loop, triggers, escalation) as a blueprint, prefilled heuristically from archetypes, Residents archetypally contrary, each with its own weighting of the shared Triplet pool. LLM calls wanted for testing on the site.
- **Research first:** `NPC_SOCIAL_MODEL_RESEARCH_2026-10-02.md` (AI Town and successors, social physics, Slice of Life, SPASM). Proposal: symbolic social state decides, LLM only speaks, one call per speaker from one shared log.
- **Triplet as dialogue rule + Fluffolekt:** `TRIPLET_DIALOGUE_RULE_NOTE_2026-10-02.md`.
- Hosting idea (Georg, not decided): publish as a GPT Site with LLM calls, login and backend.
- Georg will send a list with base info and the first characters. Then: rewrite the lean card contract on the clamp field set, add the first Residents.

## Exactly one next gate

**R0 · RESIDENT-CARDS-AUTHORING-01 (revised).** Georg sends the list with base info and the first regular Residents, plus the Rolodex and any further repos. The six questions in `OPEN_DECISIONS_FOR_GEORG.md` are superseded where they concern Lorekeeper and Doppel-Denk (special roles). After that, R1 (contract rewrite on the clamp field set + intake) and R2 (first Social Card Relay = #272's `RESIDENT-SOCIAL-MEMORY-01`) with two regular, archetypally contrary Residents.
