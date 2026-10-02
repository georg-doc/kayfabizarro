# NPC Social Model Research · 2026-10-02

- Executor: Claude Coworker (Opus 5.5) · requested by Georg after the reorientation
- Question: how should KFB model Resident characters, Lean Memory and emergent social behaviour, given what exists **today**, instead of starting from the Hunky & Dory build of 2025?
- Status: research + proposal. Nothing decided, nothing built. Georg may add further repos.
- Invariants still apply: Triplets default speech, Monkey-Island choices, English in-world, no Claude-written sample dialogue, one memory owner (Resident Social Memory).

---

## 1. What exists (checked 2026-10-02)

| Line of work | Character definition | Memory | Who decides what happens | Take for KFB | Leave |
|---|---|---|---|---|---|
| **Generative Agents** (Park et al. 2023) · [repo](https://github.com/joonspk-research/generative_agents) | Seed paragraph | Memory stream, importance score, reflection, plans | LLM, every step | Reflection as compression of many events into one opinion | LLM planning on every tick (cost) |
| **AI Town** (a16z) · [repo](https://github.com/a16z-infra/ai-town), [ARCHITECTURE.md](https://github.com/a16z-infra/ai-town/blob/main/ARCHITECTURE.md) | `name` + one prose `identity` paragraph + one `plan` sentence (`data/characters.ts`) | After each conversation the LLM summarises it; the summary is embedded; at the next meeting the top 3 memories for "what do you think about X" are injected | Engine owns all game state; agents only submit inputs. Agents mix rules and LLM. Conversations have exactly two members | Engine-owns-state rule; per-conversation summary; two-person conversations; "what do I think of X" as the retrieval key | Prose identity (no structure, drifts); vector DB (not needed at 24 NPCs); Convex stack |
| **Lyfe Agents** (2023) · [arXiv 2310.02172](https://arxiv.org/abs/2310.02172) | Persona + goals | Summarize-and-Forget: working / recent / long-term, redundancy removal | LLM picks a high-level option; cheap non-LLM rules run actions until a trigger | LLM only on option change; reported ~$0.5 vs ~$25 per agent per human-hour | Embedding-based long-term memory (not needed at our scale) |
| **Humanoid Agents** (EMNLP demo 2023) · [arXiv 2310.05418](https://arxiv.org/pdf/2310.05418) | Persona + basic needs + emotion | Generative-Agents memory | LLM, nudged by needs/emotion | **Closeness as an integer per pair** (0–30, bands distant → very close) | Hunger/energy needs |
| **Project Sid / PIANO** (Altera 2024) · [arXiv 2411.00114](https://arxiv.org/pdf/2411.00114) | Persona | Several concurrent modules | Central decision module keeps parallel outputs coherent | Evidence that roles, norms and culture can spread between agents (relevant to Gift / Dance culture later) | 1000-agent scale |
| **Concordia** (DeepMind) · [repo](https://github.com/google-deepmind/concordia) | Entities composed of small components | Component-based | A **Game Master** entity simulates the world and resolves actions (tabletop pattern); active in 2026 | Component idea = our card fields; GM = our deterministic host | Python research library as runtime |
| **Generative agents of 1,000 people** (Park et al. 2024) · [arXiv 2411.10109](https://arxiv.org/abs/2411.10109v1) | ~2 h interview transcripts | — | — | Rich personas beat brief descriptions (84.62 % vs ~70–72 % agreement). For fiction, read this as: depth matters, but it can be **structured** depth (clamps, loops, beliefs), not long prose | Real-person fidelity is a different goal |
| **Comme il Faut / Prom Week** (2011–12) · [Prom Week paper](http://www.ben-samuel.com/wp-content/uploads/2015/09/FDG-2011-Prom-Week-Social-Physics-as-Gameplay.pdf) | Traits, statuses, relationship networks | Social facts database | **Social exchanges**: authored social actions with preconditions and effects on relationships ("social physics") | Social exchange = our unit of interaction (speculate, dismiss, gossip, gift …) | Fully hand-authored dialogue per exchange (does not scale to our Card count) |
| **Ensemble Engine** (CiF successor, JS, open source) · [repo](https://github.com/ensemble-engine/ensemble) | Schema of traits/relations/statuses + volition rules | Social record over time | Rules compute who wants to do what to whom | JavaScript; readable as a donor for rule shapes | Adopting it as a dependency (small project, 85 open issues, maintenance state unchecked) |
| **Talk of the Town** (Ryan & Mateas, Game AI Pro 3) · [chapter](https://www.researchgate.net/publication/335746180_Simulating_Character_Knowledge_Phenomena_in_Talk_of_the_Town) | Townspeople with beliefs | **Belief records with a source**: observed, told (true or false), transferred, confabulated; repetition can make a lie believed | Discrete interactions propagate knowledge | Exactly our card speculation: knowledge from own Signature Deck vs heard from another Resident vs guessed | — |
| **Paradise** (Ensemble + GPT-3, FDG 2024) · [ACM](https://dl.acm.org/doi/10.1145/3649921.3659841) | Ensemble model | Ensemble | Simulation informs dialogue **and** dialogue informs simulation | Warning: authors call authoring "unmanageable", an unstable balance between prompts, the social model and the mapping between them | Letting LLM output write back into social state freely |
| **Slice of Life** (Treanor, Samuel, Nelson, FDG 2024 + 2025) · [FDG25 abstract](https://www.kmjn.org/publications/SliceOfLife_FDG25-abstract.html) | Ensemble with Social Practices Engine | Social state | **Symbolic engine controls gameplay and builds the prompt; the LLM only voices the line** "without giving up authorial control of the gameplay or story" | **Closest match to KFB.** Symbolic state → grounded prompt → LLM as language layer only | — |
| **SPASM** (2026) · [arXiv 2604.09212](https://arxiv.org/abs/2604.09212) | Schema-sampled personas | One perspective-agnostic dialogue history | **Egocentric Context Projection**: the shared history is projected deterministically into each speaker's own view before every generation; this substantially reduced persona drift and, under human validation, eliminated "echoing" (one agent mirroring the other) | Answers Georg's "one call or one per personality" question in favour of **one call per speaker from one shared log** | — |
| **Attractor States** (Ko & Geiping, 2026) · [arXiv 2606.30571](https://arxiv.org/abs/2606.30571) | — | — | Open-ended LLM-LLM debates settle into model-specific attractors; some models pull partners toward their style (Claude Haiku toward metacommentary) | Keep exchanges short and externally steered; watch for convergence; mixing models per character is a possible experiment | Open-ended free dialogue loops |
| **Agent memory products 2026** (Mem0, Letta/MemGPT, Zep) · [comparison](https://vectorize.io/articles/mem0-vs-letta) | — | Mem0: passive fact extraction. Letta: agent edits tiered blocks (core always in context). Zep: temporal graph (when a fact was true) | — | Letta's small always-in-prompt **core block**; Zep's "valid from/until" on beliefs | Running one of them as infrastructure (built for assistants, oversized for us) |
| **Shipped games** · [inZOI + ACE](https://www.nvidia.com/en-us/geforce/news/nvidia-ace-naraka-bladepoint-inzoi-launch-this-month/), [AI-native games survey 2026](https://arxiv.org/html/2607.00527v2), [1001 Nights](https://ar5iv.labs.arxiv.org/html/2308.12915) | inZOI: on-device small model. Suck Up!: GPT NPCs, persuasion as core loop. 1001 Nights: player tells stories to an AI King (still a demo) | — | — | 1001 Nights is a direct reference for the later King minigame (R6). The survey frames the core design question: which rules stay fixed, where players get semantic freedom, what happens when the model invents something the game state cannot support | — |

---

## 2. What this means for KFB (proposal)

The field has split into two camps. Pure LLM agents (Generative Agents, AI Town, Sid) get lively but drift, cost a lot and lose authorial control. Pure social physics (CiF, Ensemble, Versu, Talk of the Town) stays controllable but needs hand-written text. The 2024/25 hybrids (Slice of Life) and the 2026 stability work (SPASM) converge on one pattern: **symbolic social state decides, the LLM only speaks, each speaker sees only its own projection of one shared record.**

That pattern fits every invariant KFB already has: Triplets as the language layer, one memory owner, a deterministic host, Monkey-Island choices.

### Three layers

**A · Social state (deterministic, small, authored)**
- Lean Card per Resident: high-level clamps in the H&D shape (clamp, core question/answer, hidden goal, fears, contradiction claims/reality, failure loop, trigger words, defence, escalation style), prefilled from the archetype, overridden where Georg says so.
- Per pair: one closeness integer and one heat value (Humanoid Agents + H&D `baseline_heat`).
- Per Resident and Card: **belief records** `{cardRef, claim, source: signature-deck | heard-from:<id> | seen | guessed, confidence, since}` (Talk of the Town + Zep's time stamp). Card speculation is the comparison of two Residents' belief records about the same Card.
- Mood state: calm / stressed / breakdown / recovered (from CtP-YAML), which shortens and hardens speech.
- A small set of **social exchanges** with preconditions and effects (CiF): for example speculate, contradict, dismiss, claim, pass-on, gift. Kept deliberately tiny (Paradise warning).

**B · Voice (LLM, one call per speaker)**
- Input is built by layer A only: own Lean Card, own Triplet weights, the Card JSON, own belief record, the last few turns **projected into this speaker's view** (SPASM/ECP), optionally one external headline (H&D `earth_signal` path).
- Output must use Triplet form (subject / connector / reframe) and reference pool `tripletId`s where possible. Anything new is tagged `generated`, stays in the test log, and only enters the pool when Georg picks it.
- The LLM never writes social state. Layer A applies the exchange's effects (avoids the Paradise feedback mess).

**C · Lean Memory (inside Resident Social Memory)**
- Facts, not prose: one receipt per exchange (who, what Card, which exchange, outcome).
- One rolling opinion line per known Resident and per known Card, refreshed by summarize-and-forget (Lyfe) when it changes, kept in a small core block that always goes into the prompt (Letta idea).
- No vector search at our scale. Retrieval key is AI Town's "what do I think of X", answered by a lookup.

**Player (Monkey Island)**
- The available social exchanges at this moment (layer A) are the choice list. Each choice is shown as a line from the pool, or voiced by layer B in Triplet form. The joke stays in the choosing.

### Single call or one per personality
Evidence favours one call per speaker with partitioned context (SPASM: less drift, no echoing) plus external turn control (H&D heat + trigger words). A single call is still worth one A/B run in the test bench, because it is cheap to try and gives Georg a direct comparison.

### Where Hunky & Dory stays useful
As a **field set**, not as content: the clamp structure, failure loop, state machine and pair dynamics map one-to-one into layer A. The H&D running-memory and earth-signal paths map into C and B. The 2025 prompts are donors for B, to be rewritten for Triplet output.

---

## 3. Risks

- **Authoring blow-up** (Paradise): keep exchanges ≤ 8 for the first test; no rule touches more than two Residents.
- **Drift and echoing**: short exchanges (3–6 turns), Card and own clamps re-injected every turn, ECP projection.
- **Model attractors**: log and compare runs; consider different models per archetype as an experiment only.
- **Cost**: one small model per turn, LLM only when an exchange fires, never on idle ticks (Lyfe).
- **Slop drift**: generated lines never become canon without Georg's pick.

## 4. Open for Georg

1. Is "symbolic state decides, LLM only speaks" the direction, or should the LLM also choose the social exchange in tests?
2. Should the first exchange set be fixed now (speculate, contradict, dismiss, claim, pass-on, gift) or come from your list?
3. Further repos/projects you want checked before the card contract is rewritten.

## 5. Sources used

Repos: [a16z-infra/ai-town](https://github.com/a16z-infra/ai-town) · [joonspk-research/generative_agents](https://github.com/joonspk-research/generative_agents) · [google-deepmind/concordia](https://github.com/google-deepmind/concordia) · [ensemble-engine/ensemble](https://github.com/ensemble-engine/ensemble) · [altera-al/project-sid](https://github.com/altera-al/project-sid/blob/main/README.md)

Papers and articles: [Lyfe Agents](https://arxiv.org/abs/2310.02172) · [Humanoid Agents](https://arxiv.org/pdf/2310.05418) · [Project Sid](https://arxiv.org/pdf/2411.00114) · [1,000 People](https://arxiv.org/abs/2411.10109v1) · [Prom Week](http://www.ben-samuel.com/wp-content/uploads/2015/09/FDG-2011-Prom-Week-Social-Physics-as-Gameplay.pdf) · [Talk of the Town knowledge](https://www.researchgate.net/publication/335746180_Simulating_Character_Knowledge_Phenomena_in_Talk_of_the_Town) · [Paradise](https://dl.acm.org/doi/10.1145/3649921.3659841) · [Slice of Life FDG24](https://www.kmjn.org/publications/SliceOfLife_FDG24.pdf) · [Slice of Life FDG25](https://www.kmjn.org/publications/SliceOfLife_FDG25-abstract.html) · [SPASM](https://arxiv.org/abs/2604.09212) · [Attractor States](https://arxiv.org/abs/2606.30571) · [Mem0 vs Letta](https://vectorize.io/articles/mem0-vs-letta) · [AI-Native Games survey](https://arxiv.org/html/2607.00527v2) · [inZOI / NVIDIA ACE](https://www.nvidia.com/en-us/geforce/news/nvidia-ace-naraka-bladepoint-inzoi-launch-this-month/) · [1001 Nights](https://ar5iv.labs.arxiv.org/html/2308.12915)

Local donors: `CritEngine/inbox/HUNKY_DORY_CtP-YAML-v6-5-2.yaml`, `CritEngine/inbox/HD_DIALOG_GENERATOR_FINDINGS_2026-05-25.md`, `CLAUDE/gvw/AI_Hunky&Dory/Hunky&Dory Emergent Alien Lens Dialoge Generator/hunky-dory/characters/*.json`.
