# Postmortem · WSA Lead Briefing and Production-Control Failure · 2026-10-03

**Status:** CURRENT LESSONS LEARNED · LEAD PROCESS MUST CHANGE  
**Owner:** WSA / Work Lead  
**Impact:** repeated briefing drift, rejected animation prototypes, fragmented GitHub state, unclear ownership, wasted Work/model budget and no accepted playable mobility MVP

## 1. Incident in one sentence

The Lead repeatedly converted incomplete or stale technical evidence into new briefs without first reconciling the latest GitHub state, Georg's explicit priorities and the specialist lane's current knowledge; this created plausible-looking but product-wrong assignments, more branches and tests, and repeated regressions instead of a stable playable build.

This is a Lead and production-control failure. It is not mainly a Blender, Claude Design or downstream implementation failure.

## 2. What Georg experienced

Georg repeatedly received:

- PR numbers, hashes, gate labels and test counters instead of a comprehensible production status;
- briefs that referenced stale, inaccessible or Site-only sources;
- technically green candidates that were presented as progress although the visible result was rejected;
- old test worlds and meta panels instead of the requested playable slice;
- new branches and descendants before accepted work had been merged and routed;
- repeated requests to reconstruct paths, choose between internal identifiers or re-explain already decided priorities;
- Cloudflare and browser timeouts that were treated as production events rather than infrastructure failures;
- no dependable answer to the basic questions: what works, who acts next, what Georg must decide, and what becomes playable afterward.

The cumulative effect was loss of trust and substantial budget consumption without a human-accepted mobility MVP.

## 3. Immediate animation incident

### What should have happened

The binding source order was already known:

1. KayKit Character Animations 1.1 for every role it actually covers;
2. Mixamo / KFB Motion Library only for a demonstrated gap or a missing transition;
3. visual review on the KayKit Mannequin before product-character and runtime integration;
4. creator-video evidence beside our own frames where the creator demonstrates the intended use.

### What happened instead

- A Mixamo-derived locomotion ladder became the primary browser candidate.
- An automated technical pass was treated as evidence of product readiness.
- The candidate failed Georg's visual and gameplay review.
- The portable animation skill then recorded this provisional candidate as the current proven runtime state.
- The next corrective brief incorrectly used the ActionFigure as the neutral fixture and did not require the complete eight-file KayKit inventory.
- The Lead paraphrased that stale brief without first reading Blender/Coworker's newer correction already present on GitHub.

### The concrete briefing errors

The bad Lead brief said or implied:

- ActionFigure as the first comparison actor;
- a generic list of native animations rather than all eight Rig_Medium source files;
- no explicit Rig_Large inventory gap;
- no creator-video comparison workflow;
- no explicit distinction between native gaps and roles that Mixamo may later fill;
- no warning that Running_B must not be silently renamed to Sprint;
- no full inventory of stealth, carry-run, dodge, combat, ranged, simulation and tools.

Blender/Coworker's corrected brief fixed these points by using `Mannequin_Medium`, reviewing all eight files, stating the gaps honestly, requiring pictures first and separating measurements into an appendix.

## 4. Why the Lead briefings kept failing

### Failure A · Memory and synthesis were used before current-source reconciliation

The Lead relied on chat history and an earlier prepared brief instead of reading the newest active GitHub commit before answering. In a fast-moving multi-agent repository, this guarantees drift.

**Rule:** no new brief may be issued until current main, the active owner branch, its latest Return/Recovery and Georg's most recent decision have been read together.

### Failure B · Simplification removed product-critical constraints

The attempt to make the brief short removed the very distinctions that prevented a wrong implementation: Mannequin versus product actor, eight source files versus a locomotion subset, native gaps versus replacement permission, and creator evidence versus general animation knowledge.

**Rule:** plain language is not permission to omit source hierarchy, complete inventory, negative constraints or acceptance evidence.

### Failure C · A product actor was confused with a diagnostic fixture

The ActionFigure is relevant to the product. The Mannequin is the correct diagnostic actor because its body halves expose gait order and it is used by the source pack/tutorials. The Lead collapsed those two roles.

**Rule:** every visual/animation brief must name diagnostic fixture, product actor and the order in which they are used.

### Failure D · Specialist knowledge was treated as optional feedback

Blender MCP held better rig, source-package and animation context than the Lead. The Lead nevertheless rewrote the task from a partial overview instead of treating the specialist's evidence as an input that had to be reconciled.

**Rule:** the Lead coordinates precedence and product intent; it must not overrule a specialist source audit without explicit contradictory evidence or a Georg decision.

### Failure E · Technical success was confused with product progress

Passing loaders, tests and browser checks proved that code ran. They did not prove correct source choice, animation quality, usable controls, visual clarity or an MVP.

**Rule:** automated green is technical evidence only. `Playable`, `accepted` and `MVP` require the real product surface and Georg's human result.

### Failure F · Repository bookkeeping became the product narrative

Internal identifiers replaced the answer Georg needed. This also hid that many PRs were research, documentation, archived failures or stacked descendants rather than usable features.

**Rule:** user-facing status is always expressed as product state. Repository identifiers appear only in a final executor appendix.

### Failure G · Too many open lanes existed without a merge/reconciliation discipline

New work was repeatedly based on different ancestors. Accepted knowledge remained in draft branches and session cuts. Later briefs had to compensate by listing more pins and exceptions, making every handoff more fragile.

**Rule:** no new descendant integration branch while its required parent remains unclassified. Every active branch must be one of: review candidate, accepted awaiting merge, rejected/archive, or blocked. Only one active integration candidate per product owner.

### Failure H · Cloudflare/Site transport was mixed with product completion

Deployment timeouts and broken routes repeatedly consumed work that did not improve the product. Site publication was sometimes treated as the next gate even when the underlying artifact was not ready for human review.

**Rule:** GitHub is the durable source. KFB Production Control is the readable control plane. Cloudflare Stage is used only for a real browser/gameplay review that cannot be judged from files or images. A timeout is infrastructure UNKNOWN, never a product task.

### Failure I · The Lead handed unfinished coordination back to Georg

Georg was asked to locate briefs, upload missing context, choose branches and interpret statuses. This inverted responsibility.

**Rule:** the producing/executing chat closes its own Return, routes the next owner and supplies a self-contained start message. Georg decides look, sound, feel, story and priorities — not repository plumbing.

## 5. Why the existing safeguards did not work

The repository already contained useful rules about SSOTs, timeouts, Return/Recovery, source isolation and stop-after-two-repairs. They failed operationally because:

- they were distributed across long documents;
- current routing documents themselves became stale;
- there was no preflight check that a new brief had read the newest owner branch;
- there was no machine-checkable source-priority declaration;
- there was no single plain-language dashboard showing product state and next executor;
- status words were derived from technical events instead of human product acceptance;
- no one enforced closure of accepted work into canonical SSOTs before new branches began.

The lesson is not to write more unconnected process documents. The lesson is to create one enforceable production contract and one current control plane.

## 6. Binding corrective actions

### A. Briefing preflight

Before any implementation brief is released, the Lead must produce a short source-resolution block:

- current product owner;
- current human-accepted baseline;
- newest active owner branch/Return;
- Georg's latest relevant decisions;
- specialist feedback already present;
- source priority;
- known gaps;
- work explicitly rejected or archived.

If any item conflicts, stop and ask. Do not synthesize a new priority.

### B. Complete brief package

Every executable brief must contain:

- one visible/audible/playable outcome;
- named executor and appropriate model/reasoning;
- direct GitHub read-first file;
- complete input inventory;
- source hierarchy and protected owners;
- forbidden substitutions;
- plain-language acceptance criteria;
- expected return;
- stop conditions;
- a copy-ready start message.

A Site-only link, chat-memory reference or unexplained identifier is invalid.

### C. Human decision ledger

Every Georg decision that changes priority, look, feel or scope must be written once in a stable decision ledger with:

- the decision in Georg's language;
- what it supersedes;
- affected owners/consumers;
- date and evidence link.

Current SSOTs must reference it. Later agents may not silently reinterpret it.

### D. SSOT drift protection

Each product owner has exactly one current SSOT front door. It must state:

- what works;
- what is accepted;
- what failed and must not be reused;
- current source priority;
- current next executor/task;
- direct links to implementation and evidence.

A scheduled/read-only audit should flag:

- two documents claiming current ownership;
- a current document pointing to a closed/rejected candidate;
- a branch-local current truth with no main/router pointer;
- stale version pins after a shared module advances;
- a brief that uses a Site URL without GitHub sources.

### E. Branch and merge discipline

- New branches start from the current accepted baseline, not from an arbitrary open draft.
- One branch equals one bounded outcome.
- Broad asset libraries and runtime changes are not mixed into the same PR.
- Stacked branches must list their parent and cannot be merged out of order.
- Accepted candidates are reconciled into the canonical owner before another integration pass begins.
- Rejected candidates are closed/archived and removed from current routers.
- No automatic merge; the user-facing dashboard must say whether a merge is actually needed and who performs it.

### F. Timeout and publication discipline

- A write/deploy timeout is `UNKNOWN`.
- Read the actual ref, file or deployment once.
- Retry only if the write is absent.
- After two failed attempts, preserve the candidate and stop.
- Documentation/source work does not need Cloudflare.
- Stage publication happens only for a real human review surface.
- The exact public page must be opened before claiming it is available.

### G. Playable-MVP discipline

No new integration lane may call itself MVP until the requested loop is visibly playable without debug-only controls or explanatory meta UI.

For mobility the sequence is:

1. native KayKit source review;
2. accepted native family plus only proven gap fills;
3. clean automatic locomotion in one simple playable island;
4. enter/drive/exit using the same character;
5. combat stress test in the same world;
6. resident/NPC interaction loop.

Each step preserves the prior playable loop. A regression stops the next step.

## 7. Control-plane requirement

KFB Production Control must become the readable index, not another source of truth.

For every active work item it displays, in plain language:

- product area;
- current state: not built / being built / ready to review / accepted / failed;
- what the user can see or play now;
- next executor and task;
- whether Georg must decide anything;
- one direct GitHub source link;
- one direct review link only when a real review surface exists;
- dependencies and superseded work hidden by default but available on demand.

The dashboard must not lead with hashes, PR numbers, test totals or internal gate names. Those belong in an expandable technical section.

## 8. Responsibility map

- **Georg:** product direction and visual/audio/gameplay decisions.
- **Work/Lead:** source reconciliation, priorities, complete briefs, SSOT health and readable dashboard.
- **Blender MCP:** authoritative 3D/rig/animation/asset preparation and evidence.
- **Claude Design:** visual/interaction design from pinned GitHub sources and golden samples.
- **Web Chat:** bounded research, source intake and low-cost repository/control-plane maintenance.
- **Codex/WSA:** integration into the canonical runtime only after source and product gates are clear.

The Lead does not replace specialist judgement. Specialists do not silently change product priority. Conflicts return to Georg with a short, contextualized question.

## 9. Current recovery decision

The corrected Blender/Coworker files on the current KayKit-native branch supersede the original Lead brief:

- revised Blender baseline uses `Mannequin_Medium` first;
- all eight Rig_Medium files are inventoried;
- Rig_Large limitations are stated;
- native gaps remain gaps;
- creator-video scanning is a parallel evidence task;
- pictures and a plain KEEP/HOLD/REJECT table precede measurements;
- Mixamo remains forbidden until a native gap is proven.

Blender may continue with the Mannequin review from that corrected brief. No browser/world integration should start before Georg has reviewed its visual return.

## 10. Acceptance test for this process correction

This postmortem is only effective when a fresh chat can answer, without transcript history:

1. What works right now?
2. What failed and must not be reused?
3. Who acts next?
4. What exact source do they read?
5. What does Georg need to decide?
6. What becomes playable afterward?

If the answer requires decoding PRs, hashes or old chats, production control is still failing.
