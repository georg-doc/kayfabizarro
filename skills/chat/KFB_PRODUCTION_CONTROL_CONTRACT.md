# KFB Production Control Contract

Status: CURRENT BINDING CONTRACT  
Date: 2026-10-03  
Owner: Georg / KFB

This contract prevents briefing drift, repository sprawl, timeout loops and technically green but unusable handoffs.

## Before a brief is sent

The Lead must verify the newest GitHub versions of:

1. main router;
2. current owner SSOT;
3. current active branch Return/Recovery;
4. Georg's latest decision;
5. specialist feedback already committed.

Conflicts stop the brief. The Lead asks; it does not invent a synthesis.

## Every brief

Keep the brief compact. It must name:
- one **exact executor surface**; never bare `ChatGPT`. Use e.g. `ChatGPT Web Chat`, `ChatGPT Work/WSA`, `Claude Design`, `Blender MCP`, or `PUBLISH_ONLY / Sites-capable executor`;
- one product outcome;
- one owner;
- one direct read-first GitHub source;
- protected boundary;
- done/acceptance condition.

For substantial Work/WSA/One-Shot jobs, also include the compact `INDEPENDENT EXECUTION` role block.

Reference global contracts instead of restating them. Do **not** copy large policy/checklist text into each brief. Site-only or chat-only context is invalid.

## User-facing updates

Follow `PLAIN_LANGUAGE_HANDOFF_STANDARD.md`.

Use the four-part status/executor/user-action/next-result format for substantial handoffs, phase changes and closures.

Ordinary progress updates should be direct and brief; do not add formatting ceremony merely to satisfy process. Repository metadata remains evidence, not the lead.

## Every active owner

Has one current SSOT front door. It says what works, what Georg accepted, what failed, what source priority applies and who acts next. Failed candidates cannot remain current routing targets.

## Every branch

Is classified as one of:

- being built;
- ready for Georg's review;
- accepted awaiting reconciliation/merge;
- failed/archive;
- blocked.

Only one **production writer/integration candidate** exists per owner at a time. Parallel read-only research, testing, critic/guard review and donor/source preparation are allowed when they do not mutate the same owner.

## Every timeout

Means UNKNOWN. Read the actual state once; retry only when the intended write/deployment is demonstrably absent.

After two failures of the **same operation**, stop retrying that operation and preserve its evidence. Do not automatically stop the parent slice/One-Shot. The Production Guard escalates only if the failed operation demonstrably blocks the named outcome.

Never start a new branch merely because a write or deployment response timed out.

## Every publication

GitHub holds durable sources. KFB Production Control indexes them in plain language. Cloudflare Stage is reserved for a real browser/gameplay review and is never required for documentation-only work.

## Every MVP claim

Requires the requested loop on the intended product surface, understandable without debug palettes, and a human gameplay/look/sound decision from Georg. Passing automated tests is not an MVP.

## Role boundaries

- Georg decides product look, sound, feel, story and priorities.
- Work/Lead reconciles current truth and issues complete briefs.
- Blender MCP owns 3D/rig/animation preparation.
- Claude Design owns visual/interaction design from pinned sources.
- Web Chat performs bounded research/intake/admin work.
- Codex/WSA integrates accepted work into the canonical runtime.

No role silently reorders Georg's priorities or replaces another owner's accepted work.

### Production Control provenance labels

For every Production Control record, `sourceAgent` must begin with the **exact execution surface**, never bare `ChatGPT`.

Allowed examples:
- `ChatGPT Web Chat · GPT-5.6 Sol`
- `ChatGPT Work/WSA`
- `Claude Design`
- `Claude Coworker`
- `Blender MCP`
- `PUBLISH_ONLY / Sites-capable executor`

Model name is optional provenance **after** the surface. It never replaces the surface label.

Historical records containing `ChatGPT · <model>` are legacy provenance and must not be interpreted as the executor surface.


## 2026-10-04 · Visible-source / donor-scope firewall

This is binding after the PR #348 legacy-OSM contamination incident.

### Donor scope is typed

Every reused donor must declare independent authority for:
- `MECHANISM`
- `PRESENTATION`
- `CONTENT`
- `DATA`

Each class is `KEEP / ALLOWED / HOLD / REJECT / SOURCE_REQUIRED`.

A PASS in one class grants no authority in the others.

Example:
a Hürth/OSM building donor may be KEEP for support/facade mechanism while REJECT for visible KFB Town content.

### Visible source firewall

Before any integrated KFB human candidate:
1. enumerate visible source families actually loaded/rendered;
2. compare them to the current World Recipe / accepted source allowlist;
3. fail the candidate if a rejected legacy visible family is active;
4. do not hide source contamination behind green runtime/browser tests.

Current MVP firewall:
`skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/MVP_VISIBLE_SOURCE_FIREWALL_2026-10-04.json`.

### Fixtures are non-product by default

Technical fixtures, historical OSM labs, recovery worlds and old review assets may feed:
- tests;
- measurements;
- support/contact logic;
- provenance.

They may not silently become visible product content.

A fixture becomes visible product content only by explicit current product selection.

### Separate world status classes

Never summarize all of these as one generic “world PASS”:
- `TOPOLOGY_PASS`
- `OWNER_PASS`
- `BROWSER_RUNTIME_PASS`
- `VISUAL_FOUNDATION_UNREVIEWED`
- `HUMAN_VISUAL_PASS / HUMAN_VISUAL_FAIL`

Human visual FAIL overrides any implication of visual acceptance from the technical classes.

### One-Shot implication

Do not respond to a visible-source failure by fragmenting the project back into serial micro-slices.

Preserve valid integrated work, remove/quarantine the contaminated visible source, and continue in one integrated recovery/completion pass unless a real stop condition is reached.



## 2026-10-04 · Execution-mode precedence / postmortem rule budget

Before applying generic slice rules, resolve the current execution mode from the named owner/router:

1. `ONE_SHOT`
2. `BOUNDED_SLICE`
3. `RECOVERY`
4. `RESEARCH`

The explicit current execution mode outranks generic fresh-chat defaults.

### ONE_SHOT

- one user assignment;
- one product outcome;
- internal crash-safe commits/tests/Returns;
- continue automatically across successful internal checkpoints;
- no new Georg-facing executor prompt after each checkpoint;
- optional defects quarantine/defer;
- stop the parent One-Shot only for a real owner/source contradiction, genuinely missing outcome-critical source, a Georg-only decision, or a Production Guard finding that the named outcome itself is blocked; repeated local repair failure alone is not enough.

### BOUNDED_SLICE

Use the normal fresh-chat slice return model.

### RECOVERY

Preserve candidate, diagnose, salvage, route one recovery outcome.

### RESEARCH

Do not mutate runtime/product state unless separately authorized.

### Postmortem rule budget

A postmortem should simplify future execution.

Do not add a new independent blocking rule when an existing rule can be:
- clarified;
- narrowed;
- superseded;
- or given explicit precedence.

Every new process rule must answer:
- what old ambiguity it replaces;
- where it sits in precedence;
- how it reduces Georg's operational burden.

More rules without precedence are control-plane debt.

