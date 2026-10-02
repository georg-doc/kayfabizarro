# KFB-NARRATIVE-CORE-RECON-01 · SOURCE_MAP

Recon date: 2026-10-02 · Executor: Claude Coworker (Opus 5.5) · Read-only recon, nothing built, nothing merged.

Every row below was opened in this session. "Read" = full file; "Skim" = structure + the parts quoted in the ledger. Dropbox paths are relative to `~/Dropbox/`. GitHub rows are `georg-doc/kayfabizarro`.

## Status vocabulary

| Status | Meaning |
|---|---|
| **CANON** | Public rule anchor. Wins every conflict about how the game is played. |
| **CANON-SUPPORT** | Georg-authored theory/system text that explains the canon but does not override it. |
| **DONOR** | Real, working or documented artefact whose contracts can be reused. Not a runtime owner. |
| **CANDIDATE** | Proposal or tested slice not accepted as canon or owner. |
| **PLANNED / INCOMPLETE** | Declared SSOT whose implementation folders are empty. |
| **LEGACY** | Superseded or drifted; keep for provenance only. |
| **UNAVAILABLE** | Path exists but content is not readable locally (0-byte Dropbox placeholder, broken zip). |

## 1 · Rule canon

| Source | Path | Status | Owner | Role | Read |
|---|---|---|---|---|---|
| Public KFB rules (EN + DE) | https://kayfabizarro.pages.dev/#kfb (fetched 2026-10-02) | **CANON** | Georg | Actor + 3 Scene slots + Quest; Card Ritual *Show it · Spin it · Sell it*; 5 turn beats; Story-Mode Die (1 Tragic · 2 Comic · 3 Absurd · 4 Heroic · 5 Mystical · 6 Forbidden); Quest Die is a tracker 1 Setup → 6 Finale, moved only by the rotating **King Kayfabian** (+2/+1/0/−1); below 1 = Quest Fail; social calls KayfaBINGO! / KayfaBOGGLE? / KayfaBONGO! / BLÖDSINN!; 1–6 people; solo play with four gears (A Journal, B Reasoning, C Solo Adventure, D Sandbox); FrizzleTips (5, optional, physical play) and **FrizzleBob's KayfabeTips (5)**: Therefore/But · Yes, and · We follow people, not props · The weirder the card, the straighter your face · One real picture beats ten big ideas | Read (rules section) |
| Rule delta Sandbox ↔ live #kfb | `KAYFABIZARRO WORKSPACE/gameplay_simulation/documentation/RULES_DELTA_sandbox_vs_live_kfb.md` | DONOR (analysis) | Cowork lane, 2026-06-14 | Earlier proof that LLM sandboxes drift from the live rules (missing King, missing Quest Fail, BLÖDSINN by majority) | Read |

"KFV Validation" was searched for and is not used anywhere in this recon or its outputs.

## 2 · Cards (content SSOT)

| Source | Path | Status | Owner | Role | Read |
|---|---|---|---|---|---|
| Deck SSOT | `…/MODIFIED PROTOTYPES (PDFs, uncompressed, v05)/KAYFABIZARRO WORKSPACE/decks/*.json` (443 files incl. ID/non-ID pairs) | **CANON-SUPPORT (content SSOT)** | Cowork deck lane | Real cards: `title/power/lore`, grades, `readings[]`, `playtests[]`, `worstCards`. No role field (Actor/Scene/Quest is assigned at play time, matching the public rule of thumb) | Skim (listing + STATUS.md) |
| Starter bundle v1.4 | `CLAUDE/CritEngine/KFB Finance + Kayfabe Simulator/kfb-starter-bundle-v1.4.json` | DONOR (derived) | built by `build_sim_bundle_from_ssot.py` | 13 decks / 711 cards, slim `{n,name,power,lore,g}`, `roleHint` per deck, 4 presets | Read (structure) |
| Bundle builder | `…/gameplay_simulation/engine/build_sim_bundle_from_ssot.py` | DONOR | Cowork lane | Reproducible SSOT → bundle | Skim |

## 3 · Kayfabulation runtimes that already exist

| Source | Path | Status | Owner | Role | Read |
|---|---|---|---|---|---|
| **KayfaBizarro Simulator v0.8** (claude.ai artefact) | `CLAUDE/CritEngine/KFB Finance + Kayfabe Simulator/` → `pkg/src/kfb-sim-src.html` (74 KB), `pkg/dist/kfb-simulator-v0.8.html`, `pkg/build.py`, `pkg/qa/smoke_test.py` | **DONOR** (working, live in claude.ai per handover) | Simulator lane (claude.ai) | Solo Gear "E": Match Card (1 Actor · 3 Scenes · 1 Quest) → split-call LLM Director (8 beats JSON, then 4-readings finale) → click-through comic, Quest-Die track, player pencil synthesis. `parseWithRepair`, `sanitizeBeats`, `fallbackFinale`, `epToken`, Match-Card JSON export/import | Read: handover, rebuild briefing, Layer Zero, prompt + engine functions |
| Simulator handover v0.8 | `…/_rebuild_briefing/HANDOVER_kfb-simulator_v0.8.md` | DONOR (contract doc) | same | Architecture, beat contract `{p,sp,m,d,die,v}`, four-readings matrix, design tokens, decision log | Read |
| Layer Zero canon | `…/_rebuild_briefing/01_LAYER_ZERO_canon.md` | **CANON-SUPPORT (style floor)** | Georg / frizzlebob-kayfabizarro skill | Anti-slop floor, Rent Rule, Story-Mode → FrizzleBob voice map (Tragic→bedside … Forbidden→analyst) | Read |
| **KFB Gameplay Engine (GM protocol)** | `…/KAYFABIZARRO WORKSPACE/gameplay_simulation/engine/` (`GM_PROTOCOL.md`, `ENGINE_SPEC_v2.md`, `playtest_postprocessor.py`, `playtest_personas.json`, `kfb_roster_players.yaml`, `crit_memory.py`, `check_repair*.py`, `batch_runner.py`) + `memory/crit_memory.json` | **DONOR** (multi-seat, King-step, NDJSON log, KPIs, cross-episode memory) | Cowork gameplay lane, 2026-06-14 | The only existing **1–6 seat** simulation: rotating King (next crit judges), Quest Fail, social calls with per-crit `callBias`, NDJSON per turn, 6-player A.I. cast + 6 QA probes, bounded per-crit memory (ON for play, OFF for blind QA) | Read: README, spec v2, GM rules + NDJSON, roster, memory sample |

The brief named Simulator v0.8 as *the* donor. The recon found a second, complementary donor that it did not name: the gameplay engine is the multi-seat rules engine; v0.8 is the single-table LLM director with a finished UI and finale design. See ledger D-14.

## 4 · NIE (Narrative Intelligence Engine)

Root `(DB) CS 2020 Krazy Karnikl/Krazy Kayfabizarro/PACKAGES & BOOKLETS/fractal-almanac/MD NARRATIVE INTELLIGENCE ENGINE/`. Progressive selection per `START_HERE_paths.md` Path 5 (Kayfabizarro Session) + Path 7 (writers' room) + Cluster E/G. No bulk load.

| Source | Status | Role | Read |
|---|---|---|---|
| `00_system/START_HERE_paths.md` v1 | CANON-SUPPORT (navigation) | Minimum file sets per task; says "158 active files", "14 cognitive archetypes" in roundtable | Read |
| `00_system/master_cross_reference_matrix.md` v1.1 | CANON-SUPPORT (navigation) | Clusters; says "218 files", Mnemosyne Quill "13 Genkit flows" | Skim |
| `00_system/OPERATION_MODES.md` v1 | CANON-SUPPORT | GENERATE / ANALYZE / PLAY; PLAY says "set Quest Die to 3 (neutral)", "8-step turn" | Read |
| `01_engine/narrative_field_solver.md` v4 | CANON-SUPPORT (theory) | Forces: tension, mystery, irony, revelation, stakes, transformation; scene force analysis; pipeline fragments → motifs → conflict field → forces → grammar → beats | Read |
| `engine_prompts/mnemosyne_quill_flows.md` (M66) | DONOR (prompt architecture) | 16 listed flows (header says 13), cast FrizzleBob · Mizzie Glitchwell · Lord Quantumund · Hunky · Dory; Flow 7 Hunky-Dory dialogue | Skim |
| `engine_prompts/advisory_council_simulation.md` | DONOR (format) | 5 advisor archetypes (Prophet, Investigator, Trickster, Historian-Poet, Mediator) + custom template; decision-support | Skim |
| `engine_prompts/multi_voice_roundtable.md` | DONOR (format) | 16 positions incl. non-speaking Silence Filter and Referee; satire-first | Skim |
| `narrative_patterns/warburg_cutup_collage_ai.md` | CANON-SUPPORT (theory) | Warburg atlas, cut-up, collage, AI co-creation | Skim |
| `narrative_patterns/mnemosyne_tafel_system.md` (M65) | DONOR (data model) | Tafel = 12–15 fragments, 15 fragment types in fixed order, 9 meta-tags, 5 board types, 10 re-feelings | Skim |
| `kayfabizarro/kayfabizarro_core_system.md` (M49) | CANON-SUPPORT (philosophy) | 3 levels (material/narrative/conceptual), Warburg/Schechner/Gabriel/Foucault pillars, add-ons (King Kayfabian, Mood Cards …) | Read |
| `kayfabizarro/kayfabizarro_freestyle_rules.md` (M50) v1.0 | **LEGACY vs public canon** (older rules text) | 8-step turn, heckling round, HUMBUG, Quest Pressure +1/+2, Wrestler Intro "Name/Claim/Threaten" | Read |

## 5 · CritEngine (declared persona SSOT)

Root `CLAUDE/CritEngine/`.

| Source | Status | Role | Read |
|---|---|---|---|
| `CLAUDE.md` | **CONTENT ADOPTED, FILES NOT SPLIT, RESOLVER NOT BUILT** (corrected 02.10., see ledger C-02) | Declares SSOT for engine.js v2.x, 8 archetype YAMLs, 8×8 conflict matrix, resolver | Read |
| `livedocs/main-chat-v0_1.html` (Living-Doc v0.9, 2026-05-27) | **CANON-SUPPORT (decision log of CritEngine)** | Sprint-01 adopted, cast locked to 8 poles, 6 conflict axes, Sprint-02 pending (split, tier/masks/ctp_voice_anchor, visual fixes); gameplay-sandbox use case with `gameplay.*` YAML layer | Read (added 02.10.) |
| `inbox/frizzlecrit-matrix-handover-v1_2.html` | DONOR | 7×7 matrix + YAML-v3 proposal, engine/hub status | Skim (added 02.10.) |
| `inbox/BRIEFING_2026-05-23_kfr-bizarro-gameplay-sandbox.md` | CANON-SUPPORT (use case) | "1–6 FrizzleCrits sit/play/interact", Crits as visible actors in the rules runtime | Skim (added 02.10.) |
| `decisions/00_BOOT_2026-05-23.md` | adopted decision | "Daten vor Code"; v2.0 deterministic resolver, v2.1 LLM variant | Read |
| `archetypes/`, `matrix/`, `engine/`, `schema/` | **EMPTY except README.md** (verified by listing) | — | Read |
| `archetypes/README.md` cast | PLANNED | FrizzleBob (Trickster), Hunky (Senex), Dory (Puer), Mr Shark, Hobbes, Dr Checkov, Roboto, Norm (+ reserve Löwe) | Read |
| `inbox/HUNKY_DORY_CtP-YAML-v6-5-2.yaml` | DONOR (other universe) | *Cancel This Planet!* monolith: Hunky (reality janitor, control), Dory (moral inquisitor/archivist), GodGPT, MephistoBro, Norman; conflict vectors, escalation engine, relationship dynamics, voice guardrails, character state machine | Skim |
| `inbox/HANDOVER_for_CritEngine_Chat_v0_2_Delta.md` | CANDIDATE (input) | Renamed 8 poles: Uncle FrizzleBob, Lord Hunky, Lady Dory, Aunt Sophia, Mr Roboto, Mister Bommel, Miss Jenny, NPC Norman | Skim |
| `inbox/REVISION_NOTE_for_CritEngine_Sprint_02_v0_2.md` | CANDIDATE (review) | Accepts Sprint-01 runtime formula `trigger → failure_spiral → speech → destabilize partner → repair → re-entry`, `repair_affinities`, `symbolic_neighbors`; lists 3 visual drifts to revise | Skim |
| `inbox/CLAUDE_HANDOVER_StoryRunner_v3_0.md` | DONOR (pattern) | Next.js/Genkit runner: YAML world bundles + JSON logic bundles, graceful-coercion normaliser, deterministic audit scorer | Skim |
| `_legacy/POINTERS.md` | LEGACY index | 8 copies of v1 `engine.js` (sprite/walk physics, not narrative) | Read |
| Sprint-01 YAML bundle | `CLAUDE/FractalAlmanacComicCreator/sprints/CritEngine-Sprint-01/frizzlecrits_final_canonical_yaml_bundle_v_0_1.md` + 18 phase files | **ADOPTED content** per Living-Doc v0.9 (not yet split into `archetypes/`, visual drifts pending) | Skim (ids, FrizzleBob, Hunky, Dory) |

## 6 · FrizzleCrits and Hunky & Dory

| Source | Status | Role | Read |
|---|---|---|---|
| `CLAUDE/FrizzleCrits/README.md` | DONOR (lane map) | Consumer and visual embodiment; 14 vision blueprints, warns "Runtime zuerst / JSON statt Metapher" | Read |
| `decisions/RUNTIME_PICK_2026-05-17.md` | LEGACY for this scope | Electron + Next.js MVP, one room, Hunky, chat, markdown persistence | Read |
| `decisions/CRITENGINE_SPINOUT_2026-05-23.md` | adopted decision | Engine questions move to CritEngine; FrizzleCrits keeps comic, pixel cast, MVP runtime, H&D bridge | Read |
| `lib/hunky_dory_dialogue.ts` | DONOR (LLM flow, Genkit) | Input: Mnemosyne Tafel fragments + topic → output: title, 4–9 panels of Hunky/Dory lines + metaFragment, footer. Fully LLM | Read |

## 7 · NOS/AOS

| Source | Status | Role | Read |
|---|---|---|---|
| `CLAUDE/gvw/VaultGvW/meta/NOS-AOS_architecture_handoff_v1.md` | CANON-SUPPORT (method) | Briefing → Dossier → Lens → Output Format; lenses FrizzleBob-Loriot / Hunky & Dory / Alien Overlord; "Lens exists officially only after 5 real outputs + one-page poetics" | Read |
| `CLAUDE/gvw/VaultGvW/meta/nos_aos_analyst_runtime_briefing_v1.md` | CANON-SUPPORT (stance) | Analyst runtime briefing; DOCUMENTED / PLAUSIBLE / SPECULATIVE separation; Play > Explanation | Skim (headings) |

## 8 · Mnemosyne apps

| Source | Status | Role |
|---|---|---|
| `(DB) …/Cancel This Comic/FrizzleCasts_CancelThis_Comic/00 Mnemosyne App/Mnemosyne Quill 3.1/*` | **UNAVAILABLE** (all four files 0 bytes, zip unreadable; Dropbox placeholders) | App source not verifiable locally. Flows known only through NIE M66 and `hunky_dory_dialogue.ts` |
| same folder, `Mnemosyne Quill 3.0`, Journey v2.5 docs, zips | not opened | Listed only |

## 9 · GitHub Resident PRs (WSA-requested)

| PR | Exact head (2026-10-02) | Relevant files | Claimed owner | Actual input → output | Det./LLM | Status for this recon |
|---|---|---|---|---|---|---|
| **#305** RESIDENT-CHAT-POC-01 | `5b595a075b789f683ef0871f8c24d95e96416449` (tested adapter blob `bc3cf519…`, tests `9af4260f…`) | `skills/chat/workflows/RESIDENT_CHAT_POC_01_2026-10-01/src/resident-chatter-adapter.v0.1.mjs`, `test/…`, `SOURCE.json`, `.github/workflows/resident-chat-poc-01.yml` | "Candidate only. ChatterBox remains owner of timing/budget/presentation"; host `mob-ai.js` = WHEN, `chatter-2d.js` = WHAT, Resident Atlas = character truth, Journey/#272 = memory | `prepareResidentTurn({speakerId, residentProfile, event, knowledgeItems, pool, socialOperator, affectState, priorSemantic, recentTripletIds, unlockedTripletRefs, fluffOlect, rng})` → `{kind:'turn'|'silence', tripletId, semantic{subject,connector,reframe,transformIntent}, utterance, presentationHints, memoryCandidates:[]}`; refuses reward/pop/bone/clip/animation fields | **Deterministic** (seedable rng, no LLM). 29/29 tests | **DONOR for the presentation layer (ambient Resident speech).** Conflict: reuses BINGO/BONGO/BOGGLE/BLÖDSINN as triplet-transformation operators with meanings that differ from the public calls (ledger D-11) |
| **#306** RESIDENT-CHAT-PRESENTATION-01 | `ba38ed7b9dd9ec0cb3373cbe0ea6ad06a45fa4ff` (impl. tested at `7204b91e…`), stacked on #305 | `…/RESIDENT_CHAT_PRESENTATION_01_2026-10-01/donor-semantic-provider.mjs`, `qa/browser-fixture.mjs`, `test/presentation-provider.test.mjs`, edits in `tools/KFB-ToolBox/_inbox/KFB Resident Card Speculation Scene/npc-card-spec-01_2026-09-24/…/resident-scene.mjs` | Preserves NPC-CARD-SPEC-01 as actor/mouth/gaze/bubble/camera owner | Adds an optional synchronous `lineProvider` seam: #305 output → existing two-Resident card scene (real card *The Doomsday Clock*). Subject → observation, Connector → interpretation, Reframe → counter | Deterministic. 14/14 parity + headed browser PASS | **CANDIDATE presentation consumer.** It is *not* a card/NPC data contract (WSA expected that); the card-scene contract itself is NPC-CARD-SPEC-01 (2026-09-24 inbox) |
| **#308** RESIDENT-CHAT-ENSEMBLE-01 | `6585217636fb37331b7f9e673ac1ef8dd0ba35c8` | `…/RESIDENT_CHAT_ENSEMBLE_01_2026-10-01/RECOVERY.md` | none new | Source isolation of 4 Residents (Lorekeeper, Goth Girl, Clown, Witch); stopped after repair budget | Deterministic (asset loading only) | **LEGACY (stopped, preserved)**; resolved the promo-vs-source contract |
| **#310** RESIDENT-CHAT-ENSEMBLE-01B | `7c6522fb24774ca5753fe8b5551b920479cc50dd` (body names impl. head `923d5f87…`) | 11 files, +2236 | none new | Fresh 4/4 source-isolation attempt; ensemble runtime not built yet | Deterministic | **CANDIDATE embodiment prerequisite**, not a dialogue owner |
| *#272* (referenced by #305/#306) | `992ea98955cfb32ef777be8b2abb737989ed9cd2` | `skills/chat/workflows/KFB_TOWN_RESIDENT_SOCIAL_MEMORY_2026-09-28/` (`resident-aida-poi.v0.1.json`) | "Resident Social Memory" design owner | Design only: witness-specific Lean Memory, social threads, POIs, AIDA loop, Brick Fish + reaction choreography as seams | n/a (design) | **CANDIDATE memory design.** Must be reconciled with `crit_memory.py` before any memory is built (ledger D-13) |

### Second-owner check for the PRs

- #305/#306 do **not** create a second narrative owner: they never touch quest, verdict, story mode or cards as rules. They **would** become a second *dialogue* owner if Kayfabulation table talk were routed through the Triplet pool. Rule for the architecture: Triplets/ChatterBox = ambient and presentation speech only.
- #305 returns `memoryCandidates: []` and writes nothing; no second memory owner today. #272 and `crit_memory.py` are two memory designs; neither is an implemented runtime owner yet.
- #308/#310 are embodiment source gates; no owner conflict.

## 10 · Noted only (not pulled into this recon, per WSA)

- World / performance dependencies: #307 (floating-island corridor), #309 (Clay perf, Blender MCP), #311 + #313 (procedural props), #314 (OSM city streaming).
- Embodiment / animation dependencies: #275 (Motion Library v4, 263 clips), #312 (Mesh2Motion retarget).
- Control plane / Hub: #299 (Production Control plugin), #302 (Hub redirect), #303 (control-plane recovery), #304 (Asset Librarian).
- The Clay City branch (`coworker/clay-city-mvp-01-2026-09-28`) is not an integration target here.
