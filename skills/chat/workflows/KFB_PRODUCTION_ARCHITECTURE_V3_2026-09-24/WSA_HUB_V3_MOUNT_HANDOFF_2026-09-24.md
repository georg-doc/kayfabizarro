# WSA HANDOFF · HUB-V3-MOUNT · 2026-09-24

Status: **READY FOR EXISTING HUB-CTRL OWNER · NO WORK REQUIRED**
Architecture source: `georg-doc/kayfabizarro#204`
Hub owner: `georg-doc/kayfabizarro#202`

## Execution profile

- profile: `WEB_STANDARD`
- executor: ChatGPT Web / existing HUB-CTRL owner
- model: GPT-5.6 Sol
- reasoning: medium
- budget: STANDARD
- Work: **not needed**
- Cowork: **not needed**
- Claude Design: only if a bounded visual polish is requested after functional mount

This is a registry/UI mount, not another architecture review.

## Read first

From current PR #204 branch:
- `START_HERE.md`
- `HUB_BRIEFING_CATALOG.json`
- `STRAND_BRIEFINGS.md`
- `SELF_SERVICE_BRIEFINGS.md`
- `EXECUTION_DISPATCH_POLICY_2026-09-24.md`
- `RETURN.md`

Before writing:
- fetch current PR #204 head;
- fetch current HUB-CTRL PR #202 head;
- do not trust an older copied SHA.

## Current v3 catalog contract

At preparation time:
- 13 primary strands;
- 79 product/self-service jobs;
- 36 READY;
- 43 HOLD;
- catalog schema `kfb.hub-briefing-catalog/7`;
- every catalog job has:
  - executor;
  - executionProfile;
  - model;
  - reasoning;
  - budget;
  - optional secondaryProfiles;
  - promptSection;
  - sourceSet;
  - READY/HOLD dependency state.

Top-level `executionProfiles` resolves stable profile ids to current model recommendations.

## HUB-CTRL boundary

Current HUB-CTRL #202 already owns:
- public KFB Hub route;
- Production Desk registry;
- never-empty recovery behavior;
- Today/review operational lanes;
- render/build/tests;
- current public publication path.

Do **not** create a second Hub.
Do **not** replace `lanes.json` with 79 jobs.

## Required mount shape

Keep two distinct data surfaces:

### A · Operational lanes / Today
Existing HUB-CTRL lane registry remains owner for:
- LOOK_AT;
- RUNNING;
- CAN_START;
- WAITING;
- current reviews;
- current PR/head/freshness state.

This answers:
**what is happening now?**

### B · Self-service production catalog
Mount v3 as a separate additive registry/data surface, e.g.
`registry/production/v1/self_service.json`
or an equivalently named additive file.

This answers:
**what can I start, and what comes later?**

Do not force self-service jobs into the operational-lane schema.

## Self-service Hub UX

Default view:
- strand cards, not 79 job cards;
- 13 strands;
- each strand shows:
  - target product;
  - READY count;
  - HOLD count;
  - current READY jobs;
  - progress/capability summary where available.

Expanded strand:
- jobs grouped READY / HOLD;
- dependency text;
- title / outcome;
- Executor;
- Model;
- Reasoning;
- Budget;
- profile id;
- optional secondary executor profile;
- copy-start action.

P2 rule:
- P2 READY items remain available inside their strand;
- do not surface them in default Today while P0/P1 work exists.

## Prompt source · no manual duplication

Do not copy/paste 79 prompts by hand into Hub config.

The architecture catalog provides `promptSection`.

Canonical prompt bodies live in:
- `STRAND_BRIEFINGS.md`;
- `SELF_SERVICE_BRIEFINGS.md`.

Preferred build behavior:
- read the current briefing source;
- extract the named `## <promptSection>` section;
- materialize/copy the paste-ready prompt in generated registry output;
- fail visibly if a section cannot be resolved.

A prompt extraction failure must not blank the Hub.

## Execution metadata display

Every briefing must visibly expose a compact line such as:

`Web · GPT-5.6 Sol · Medium · Standard budget`

or

`Blender MCP · Claude Sonnet 5 · High · High budget`

with the stable profile id available in the drawer.

Secondary profiles are escalation/additive tools, not co-equal default executors.

## Cost-control rules to preserve

- Work is capability-escalation only.
- Cowork is not default for GitHub-only work.
- Opus is not default.
- Claude Design is visual refinement on an accepted functional owner.
- Blender MCP is only for jobs that genuinely need Blender.
- one focused repair pass may raise effort;
- after two failed passes on one gate: stop/recovery.

Current `wsa.json` may remain `NOT_NEEDED` after the mount if no Work-only capability is required.

## IK addition

New READY briefing:
`IK-CCDIK-PARITY-01`

Display:
- Web;
- GPT-5.6 Sol;
- High reasoning;
- High budget;
- no Work;
- no Cloudflare.

It compares current Resident Atlas IK against the upstream Three.js CCD solver. It is not an instruction to replace the current Puppet before A/B proof.

## Public publication

Mount implementation/tests first.

Then one publication batch through the existing HUB-CTRL publication owner.

Human acceptance surface remains:
`https://kayfabizarro.pages.dev/kfb-hub/`

Do not claim the expanded v3 catalog is public until that exact URL is opened and visibly shows the new strand/self-service surface.

## Required tests

At minimum:

1. v3 catalog JSON parses;
2. every job resolves an execution profile;
3. every job resolves its prompt section;
4. strand count = source catalog count;
5. job count = source catalog count;
6. READY/HOLD counts match source;
7. P2 filtering works;
8. operational lanes remain present;
9. malformed self-service catalog falls back without blanking Hub;
10. existing never-empty Hub recovery still passes;
11. exact public route is browser-opened after publication.

## Do not do

- no architecture rewrite;
- no new model-ranking exercise;
- no Work session to “review all jobs”;
- no Cowork pass over all briefs;
- no second Hub owner;
- no manual 79-card wall;
- no merge/promotion beyond the named HUB-CTRL publication action.

## Return

Return:
- exact repo / HUB-CTRL branch / PR / head;
- changed files;
- actual tests;
- generated self-service counts;
- screenshot/browser proof;
- exact public KFB Hub URL if published and verified;
- unresolved items;
- one next gate.

Exactly one task:
**mount v3 self-service + execution metadata into the existing Hub owner, then verify once.**
