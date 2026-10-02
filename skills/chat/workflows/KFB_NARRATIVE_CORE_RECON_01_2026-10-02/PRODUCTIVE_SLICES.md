# KFB-NARRATIVE-CORE-RECON-01 · PRODUCTIVE_SLICES

Small, executable slices derived from the architecture. Each has one owner, one agent, one output, measurable tests and stop gates. Order matters: S0 must be answered before S1 can start; S2–S6 come after S1 and stay headless until S5.

General stop rules for every slice: stop on a missing source; stop if CritEngine would have to look finished; stop if a rule would change silently; stop if a second narrative, dialogue or memory owner would appear; stop after two failed repair passes on the same gate; no Open-World integration, no merge, no Live promotion, no UI redesign.

---

## S0 · KFB-NARRATIVE-DECISIONS-01 (Georg, 15 minutes)

- **Owner:** Georg · **Agent:** none (Coworker prepares, Georg answers)
- **Input:** `OPEN_DECISIONS_FOR_GEORG.md`
- **Output:** answers to G-01, G-02, G-04, G-06, G-11, G-12 (the SIM-01 blockers); the others can wait.
- **Test:** each blocker has a one-line answer recorded in the branch.
- **Stop gate:** SIM-01 does not start while G-02 (donors) or G-06 (persona source) is open.

## S1 · KFB-KAYFABULATION-SIM-01 (first build)

- **Owner:** Kayfabulation Game Director (new module, one owner)
- **Agent:** Claude Coworker (or a Claude Code/Web chat with a real checkout) · **Model:** Opus 5.5 · **Reasoning:** High
- **Location:** `tools/kfb-kayfabulation-sim/` on a new branch of `georg-doc/kayfabizarro` (proposal; confirm in G-13)
- **Inputs (donors, pinned):**
  - Public #kfb rules (fetched copy pinned in the slice folder)
  - Starter bundle v1.4 (`kfb-starter-bundle-v1.4.json`) or a fresh build from the deck SSOT via `build_sim_bundle_from_ssot.py`
  - Simulator v0.8 `pkg/src/kfb-sim-src.html`: Match Card shape, corpus loader, `parseWithRepair`/`sanitize`/retry/fallback, design tokens, four-readings after-show
  - Gameplay Engine v2: turn loop with King step, Quest Fail, social calls, `callBias`/disposition, NDJSON log, `playtest_postprocessor.py`, `check_repair.py`
  - Persona profiles for **Hunky, Dory, FrizzleBob** from the source chosen in G-06, pinned with `canon:false`
  - `KFB_SIM_EVENT_SCHEMA.json` (this recon)
- **Output:**
  - `kfb-kayfabulation-director.mjs` (pure ES module, no DOM, no network): `createSession`, `apply(decision)`, `fold(events)`, `view(seat)`
  - `providers/decision-disposition.mjs` (deterministic sim seats), `providers/tell-template.mjs` (deterministic text from card lore + persona voice lines), optional `providers/tell-llm.mjs` behind a flag (G-12)
  - `table.html`: minimal table UI using the Simulator v0.8 tokens (no redesign): seats 1–6, human/sim toggle per seat, stage, quest die, King marker, call buttons, log
  - `replay.mjs`: rebuild any state from an NDJSON log
  - RETURN, TEST_REPORT, SOURCE.json, CHANGELOG
- **Minimum behaviour (from the brief):** real cards · 1–6 seats · human or sim per seat · Hunky, Dory, FrizzleBob · story mode independent of persona · full Actor/3 Scenes/Quest contract · Show it/Spin it/Sell it · Quest Die + King's verdict · reproducible replay log · take over any sim seat at any event boundary · structured events for later 3D · no LLM in render or gameplay hot path.
- **Tests (all automated, headless Node):**
  1. Every emitted event validates against `KFB_SIM_EVENT_SCHEMA.json` (100 %).
  2. Same seed + same decisions ⇒ byte-identical NDJSON (determinism), 20 seeds.
  3. `fold(log)` reproduces final state for 50 random sessions (replay).
  4. Rule tests from PUB, one per rule: hand of 3, draw after tell, Ritual on every card incl. Actor and Quest, Story-Mode rolled every turn, Stage fill-before-overwrite, Actor switch leaves Stage unchanged, only the King moves the die, King = next seat and passes each turn, BLÖDSINN upheld ⇒ no move, < 1 ⇒ Quest Fail (unless `safeFloor`), 6 ⇒ next turn is Finale, Finale teller keeps Quest when `trophyRule`, KayfaBINGO ⇒ +1 card, KayfaBOGGLE ⇒ question/answer events, KayfaBONGO ⇒ restatement event.
  5. Seat take-over: 1 000 random take-over points, state continuity 100 %.
  6. Seat counts 1, 2, 3, 6 run to Finale or Quest Fail without deadlock.
  7. No `fetch`/LLM call in `apply()`; optional LLM provider only via an async boundary, its outputs logged and never re-called on replay.
  8. Layer Zero: `check_repair.py`-equivalent scan on all template texts, `slopScore` reported.
  9. `playtest_postprocessor.py` reads the new log (adapter allowed) and reports KPIs.
- **Stop gates:** G-02/G-06 unanswered; any rule in test 4 needs a change to PUB to pass; persona file would have to be edited to look canonical; LLM needed in `apply()`; two failed repairs on the same test.

## S2 · KFB-SIM-QA-BRIDGE-01

- **Owner:** Cowork gameplay lane (existing QA owner)
- **Agent:** Claude Coworker · Sonnet-class model · Reasoning: Medium
- **Input:** SIM-01 logs; `playtest_postprocessor.py`, `batch_runner.py`
- **Output:** postprocessor adapter for `kfb.sim-event/0.1`; coverage report seat-count × deck function; no dashboard redesign.
- **Tests:** existing GM v2 sample logs still produce identical KPIs; new logs produce the same KPI keys.
- **Stop gate:** a KPI needs grades visible to sim seats (blind rule).

## S3 · KFB-PERSONA-PIN-01 (with CritEngine, not instead of it)

- **Owner:** CritEngine lane
- **Agent:** Claude Coworker or the CritEngine chat · Opus · High
- **Input:** S01 YAML bundle, revision note v0.2, CtP YAML, HDT, GM roster, Georg's G-04/G-06 answers
- **Output:** `CritEngine/schema/archetype.schema.yaml` + validated `archetypes/{frizzlebob,hunky,dory}.yaml` (only the three SIM-01 needs), each with `sources[]` and `canon:true|false`; nothing else.
- **Tests:** schema parse; three YAMLs validate; every field traces to a source line.
- **Stop gate:** a field has no source; Hunky/Dory definitions still contradict after G-04.

## S4 · KFB-MEMORY-OWNER-01 (decision + adapter, no store yet)

- **Owner:** the owner chosen in G-11
- **Agent:** Claude Coworker · Opus · High
- **Input:** `crit_memory.py` + `crit_memory.json`, PR #272 design, SIM-01 `memory_receipt` events
- **Output:** one memory contract document + adapter mapping receipts to the chosen store; the other design marked donor.
- **Tests:** 14 existing crit_memory episodes re-derivable from receipts; blind-QA firewall (`blindQaSafe:false` never injected) holds.
- **Stop gate:** two writers to the same store.

## S5 · KFB-TABLE-TO-RESIDENT-BRIDGE-01 (first embodiment)

- **Owner:** Presentation (ChatterBox/NPC-CARD-SPEC-01 owners unchanged)
- **Agent:** ChatGPT-Web/Claude Web with Actions (same lane as #305/#306) · Opus/strong model · High
- **Input:** one recorded SIM-01 session log; #306 `lineProvider` seam; #310 result
- **Output:** two Residents perform `card_sold` and `story_told` of a recorded turn in the existing card scene; Triplet kernel keeps ambient lines only.
- **Tests:** no change to actor/mouth/gaze/bubble/camera owners (#306 parity tests stay green); the scene reads the log, never the Director.
- **Stop gate:** the Triplet pool would have to narrate a table turn (second dialogue owner); D-11 unresolved.

## S6 · KFB-CULTURE-DIRECTOR-01 (one mechanic)

- **Owner:** Culture Director (new) with the existing runtime owners as executors
- **Agent:** Claude Coworker · Opus · High
- **Input:** SIM-01 events, #272 AIDA/POI contract, Brick Fish seam
- **Output:** a pure function `events → WorldIntent[]` for exactly one mechanic first (proposal: `gift_offer`/`gift_open` after KayfaBINGO, because it needs no combat physics), plus `intent_resolved/rejected` handling.
- **Tests:** deterministic mapping; every intent cites `reason` seqs; rejected intents logged; no direct body/camera/physics calls.
- **Stop gate:** runtime owner missing for the chosen mechanic.

---

## Dependency picture

```
S0 ─► S1 ─┬─► S2
          ├─► S3 (can start in parallel with S1 if G-06 says "wait for CritEngine")
          ├─► S4
          └─► S5 (needs #310 PASS) ─► S6
```
