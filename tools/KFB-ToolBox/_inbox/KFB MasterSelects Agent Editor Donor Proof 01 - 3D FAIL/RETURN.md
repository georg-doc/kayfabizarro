# RETURN — MASTERSELECTS_SOURCE_ISOLATED_AGENT_BRIDGE_PROOF_01

Status: **EXECUTED · 5 of 6 gates PASS · GRAPH_SCENE = FAIL (resolved by Gate 02, see `GATE_02_RESULT.md`)**

> **Update 2026-10-12, after Gate 02:** `GRAPH_SCENE` was UNKNOWN in the first pass and is now **FAIL**.
> Gate 02 reproduced the blank 3D output in a normally launched Chrome with default flags and hardware WebGPU,
> and established a working positive control (2D fixture renders at luma 58.19). The blank result is real,
> not a harness artifact. Everything else in this Return stands unchanged.
Owner: KFB Surface / Material Language research — cross-cutting authoring/agent evaluation only.
No second World, Scene, Audio, Academy, Asset or Material runtime owner was created.

## Identity

| Field | Value |
|---|---|
| KFB repo | `georg-doc/kayfabizarro` |
| KFB branch | `planning/hybrid-baked-clay-texture-architecture-2026-10-07` |
| KFB head (read, and re-verified live after the run) | `1128054cbcb7eac7e861a8d14ffd20533df0ac13` |
| KFB head commit subject | `docs(research): mark MasterSelects isolated proof for Wiedervorlage` |
| Upstream donor | `Sportinger/MasterSelects` |
| Upstream pin (verified byte-exact, and still `master` head) | `db912a05028eada21d37ec76d5317a36de865af2` |
| Upstream version / license | 3.1.8 / AGPL-3.0-only |
| Changed KFB files | **none** |

## Acceptance matrix

| Gate | Result | Evidence |
|---|---|---|
| SOURCE_ISOLATED | **PASS** | Unmodified upstream at the pin launched locally; original editor UI with runtime identity "MASTERSELECTS 3.1.8" visible; 0 tracked file modifications. `evidence/01`, `02` |
| GRAPH_SCENE | **FAIL** (was UNKNOWN) | Scene identity proven (camera/light/model clips, scene-unit transforms, shared composition id, revision deltas). But no 3D raster output in either browser launch mode, while a 2D positive control renders. See `GATE_02_RESULT.md`. `evidence/03`, `06`, `08`, `raw_gate02/` |
| MCP_CONTROL | **PASS** | 241 devBridge / 128 chat tools with live schemas + policy; read-only phase first; dry run mutated nothing; one audited reversible `setTransform` (rev 74→77) reversed by `undo`; full audit record + merged history. `evidence/10`–`12`, `raw/*` |
| PERSISTENCE | **PASS** | `saveProject` then full page reload; project reopened from OPFS with exact values intact. `evidence/13`, `14` |
| LICENSE_BOUNDARY | **PASS** | AGPL-3.0-only documented; hosted kernel explicitly outside the repo and outside that licence; ordinary media outputs not AGPL-encumbered; **zero code moved into KFB**. |
| KFB_OWNER_PROTECTION | **PASS** | 0 writes to KFB, 0 local commits, 0 pushes, no Site/Stage publication, no merge, no Live promotion. Remote head unchanged. |

No synthetic PASS was recorded. The one gate that could not be proven is reported as UNKNOWN, not as a donor capability claim.

## What was proven about the donor

1. **The browser really is the execution authority.** The MCP bridge does not reimplement editor state: every call landed in the live tab, against the loaded project, and returned the editor's own state revisions.
2. **The policy layer is real, not decorative.** Mutating tools require `confirm`; so do read-only tools flagged `sensitiveDataAccess`. Dry run resolves schema and policy without touching state.
3. **Operations are auditable and reversible.** Each call carries an idempotency key, a source, timestamps and an entity-level diff; `undo`/`redo` moved the same edit in both directions.
4. **Persistence is genuinely durable, not in-memory.** A full document reload restored the exact authored transform from the repository.

This is the pattern worth taking seriously for KFB agent-assisted authoring: one owner of state, a policy-gated tool surface in front of it, an audit trail, and reversible operations.

## Blocker — RESOLVED BY GATE 02

**3D content produced no visible raster output on this machine, and suppressed working 2D output.**

Gate 02 ran the same pinned build in two differently launched Chrome instances (Playwright-driven vs. directly
launched with default flags). Both reported hardware WebGPU (`apple`/`metal-3`, ANGLE Metal Renderer Apple M4)
and both produced identical blank frames (hash `1f116dc5`) for the universal 3D/Gaussian/CAD fixture at every
sample time. The pure 2D fixture on a freshly reloaded renderer rendered correctly (`nonBlankRatio 1`,
`meanLuma 58.19`, hash `7a5c08a9`), which proves the measurement path is sound.

Scope: this says the 3D pipeline could not be made to render on macOS 26.6.2 / Apple M4 / Chrome 147 at commit
`db912a05`. It does not claim the donor's 3D is broken for its author or on other hardware. Full detail and the
run-by-run table are in `GATE_02_RESULT.md`.

## Unverified / not attempted

- Hosted AI kernel, credits, `bridge_send_chat_message`, model-backed chat — deliberately not used (no hosted credentials; brief forbids requiring them).
- `captureAppScreenshot` and `probeSameOriginRequest` were not exercised (sensitive-access helpers; not needed once the control path was proven).
- Native Helper (ws://127.0.0.1:9876) not connected; downloads unavailable.
- Path-traced render mode, splat/CAD content, export and performance characteristics — out of scope.
- No KFB performance was benchmarked using this external editor.

## Risks for KFB

1. **AGPL-3.0-only.** Direct code reuse remains **not authorized**. The licence can cover a larger combined program, and section 13 adds a network-use source obligation. A legal/product decision must precede any reuse. Ordinary rendered media outputs are explicitly *not* AGPL-encumbered.
2. **Hosted dependency.** The private kernel is separate and credit-gated; an agent workflow that drifts into the chat surface acquires a paid external dependency.
3. **Local bridge exposure.** The dev bridge mints a bearer token and grants file roots covering the user's Desktop, Documents, Downloads and Videos. Keep it on localhost only.
4. **Dependency weight.** 536 npm packages, ~1.4 GB `node_modules`, ~306 MB checkout, Node pinned to exactly 24.16.0.

## Decision route recommendation

**ADAPT PATTERN** — document KFB-native agent tool/scene/persistence patterns modelled on what was proven here
(single state owner, policy-gated tool registry, dry run, idempotency keys, entity-diff audit, reversible ops).
This is the durable value found, and it is independent of the 3D result.
**EXTERNAL TOOL** — now conditional: the 3D capability did not render on this hardware, so adopting MasterSelects
as an offline creative tool for 3D/scenelet work would require re-testing on the actual target machine first.
**DIRECT CODE REUSE** remains not authorized (AGPL-3.0-only).

## Next gate (exactly one)

Gate 02 is **done** — it answered its question and flipped `GRAPH_SCENE` to FAIL.

**MASTERSELECTS_3D_UPSTREAM_ISSUE_CONFIRMATION_03** — report the reproduction upstream (fixture names, fingerprint
hashes, exact environment) and ask whether 3D is expected to work on Apple Silicon / Chrome 147, or re-test on a
second GPU/OS. That answer decides whether the 3D angle is permanently closed for KFB or merely deferred.
It is a cheap external question, not an engineering slice.

## Persistence status of this packet

Written to disk at `KFB_MASTERSELECTS_PROOF_01_2026-10-12/`.
**Not committed and not pushed** — no verified GitHub write credential was available, and a push to the shared repo is an
outward-facing action that was not authorized. Intended repo-relative destination when authorized:
`skills/chat/research/KFB_MASTERSELECTS_AGENT_EDITOR_DONOR_PROOF_2026-10-12_RETURN/`
