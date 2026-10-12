# INTAKE — MasterSelects Agent-Editor Donor Proof 01

Routing note for the next chat/agent. Georg reads `ZUERST_LESEN.md` instead.

**This is a completed research return, not a candidate and not an implementation.**
`READY_FOR_INTEGRATION` does not apply. Nothing here asks to be merged into a runtime.

| | |
|---|---|
| Owner | KFB Surface / Material Language research (existing, no parallel owner) |
| Repo / branch | `georg-doc/kayfabizarro` / `planning/hybrid-baked-clay-texture-architecture-2026-10-07` |
| KFB head at execution | `1128054cbcb7eac7e861a8d14ffd20533df0ac13` (re-verified unchanged after the run) |
| Upstream donor pin | `Sportinger/MasterSelects` @ `db912a05028eada21d37ec76d5317a36de865af2`, v3.1.8, AGPL-3.0-only |
| Executed | 2026-10-12, Claude Code, local macOS |
| KFB writes | none · no merge · no Site/Stage publish · no Live promotion |

## Closes

`skills/chat/research/KFB_MASTERSELECTS_AGENT_EDITOR_DONOR_PROOF_2026-10-12.md`
— its "Wiedervorlage · QUEUED / DEFERRED" section is now obsolete.
**Apply `STATUSNACHTRAG.md` to that file**, otherwise the next fresh chat will read
"executor not started" and re-run work that is already done.

## Result

| Gate | Result |
|---|---|
| SOURCE_ISOLATED | PASS |
| GRAPH_SCENE | **FAIL** |
| MCP_CONTROL | PASS |
| PERSISTENCE | PASS |
| LICENSE_BOUNDARY | PASS |
| KFB_OWNER_PROTECTION | PASS |

Tests against the pin: `mcp:smoke` PASS (12 control tools), `test:security` 118/118,
`test:kernel-boundary` 42/42.

## Decision route

- **ADAPT PATTERN** — reimplement the agent-control pattern natively in KFB: one state owner,
  policy-gated tool registry, dry run, idempotency keys, entity-diff audit, reversible ops,
  durable save verified by fresh reload. All of that was proven working in the donor.
- **DIRECT CODE REUSE** — still **not authorized** (AGPL-3.0-only, network-use obligation).
- **EXTERNAL TOOL** — downgraded to *conditional*: no 3D raster output could be produced on
  Apple Silicon / Chrome 147. Re-test on the actual target machine before assuming it.

## Trap worth carrying forward

The donor's own `runWorkerFirst*GoldenFixture` tools return `failures: []` even when every
captured frame is blank — they record observation data and do not assert non-blank.
**A green run from such a tool is not evidence that anything rendered.** Worth checking whether
any KFB verification tool has the same shape.

## Where this ideally ends up

The sibling research returns live flat in `skills/chat/research/` as
`KFB_<TOPIC>_<KIND>_<DATE>.md`. If someone later routes this out of `_inbox`, that is the
tidy destination. Intake is fine as-is; no rework needed for the content to be usable.

## Next gate

**MASTERSELECTS_3D_UPSTREAM_ISSUE_CONFIRMATION_03** — report the reproduction upstream
(fixture names, fingerprint hashes `1f116dc5` blank vs `7a5c08a9` rendered, exact environment)
and ask whether 3D is expected to work on Apple Silicon / Chrome 147, or re-test on a second
GPU/OS. External question, not an engineering slice.
