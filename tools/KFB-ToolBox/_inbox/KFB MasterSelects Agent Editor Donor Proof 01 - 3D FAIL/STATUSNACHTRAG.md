# Statusnachtrag — eine Datei muss von Hand geändert werden

Das Hochladen eines Ordners kann eine **bestehende** Datei nicht ändern. Diese eine Änderung
fehlt deshalb nach dem Upload und sollte nachgezogen werden.

## Warum das wichtig ist

In `skills/chat/research/KFB_MASTERSELECTS_AGENT_EDITOR_DONOR_PROOF_2026-10-12.md` steht am Ende:

> **QUEUED / DEFERRED — executor not started.**

Das stimmt nicht mehr. Wer das liest, führt den ganzen Test ein zweites Mal aus.

## Wie

1. Auf GitHub die Datei `skills/chat/research/KFB_MASTERSELECTS_AGENT_EDITOR_DONOR_PROOF_2026-10-12.md` öffnen
2. Stift-Symbol (Edit) rechts oben
3. Ganz nach unten scrollen
4. Den kompletten Block unterhalb der Trennlinie anhängen
5. Commit

Es wird nichts überschrieben, nur angehängt. Das alte Briefing bleibt als Historie stehen.

---

## EXECUTED · 2026-10-12 · Claude Code (local macOS)

The Wiedervorlage above is **closed**. `MASTERSELECTS_SOURCE_ISOLATED_AGENT_BRIDGE_PROOF_01` was executed, and the
follow-up gate `MASTERSELECTS_3D_RASTER_READBACK_ENV_PROOF_02` was executed in the same session. The sections above
are preserved unchanged as the original briefing.

Result against the acceptance matrix:

| Gate | Result |
|---|---|
| SOURCE_ISOLATED | PASS |
| GRAPH_SCENE | **FAIL** (UNKNOWN after Proof 01, resolved to FAIL by Gate 02) |
| MCP_CONTROL | PASS |
| PERSISTENCE | PASS |
| LICENSE_BOUNDARY | PASS |
| KFB_OWNER_PROTECTION | PASS |

Upstream pin confirmed byte-exact and unmodified: `db912a05028eada21d37ec76d5317a36de865af2`, v3.1.8, AGPL-3.0-only,
0 tracked file modifications. Automated tests run against the pin: `mcp:smoke` PASS (12 control tools),
`test:security` 118/118, `test:kernel-boundary` 42/42.

**What was proven.** The browser is genuinely the execution authority — the MCP bridge does not reimplement editor
state. Policy is enforced (mutating tools and sensitive read-only tools both require explicit confirmation), dry run
resolves schema without mutating, every call carries a durable audit record with idempotency key and entity diff, and
edits are reversible in both directions. Persistence survives a full document reload from the OPFS repository.

**What failed.** No 3D raster output could be produced on this machine (macOS 26.6.2 / Apple M4 / Chrome 147 /
hardware WebGPU Metal 3). Reproduced in two differently launched browsers, with a working positive control: the
upstream's own pure-2D golden fixture renders (`meanLuma 58.19`, hash `7a5c08a9`) while the universal 3D fixture is
blank at every sample (hash `1f116dc5`). Present 3D content also suppresses otherwise-working 2D output and leaves
the renderer degraded. This is environment-scoped and is **not** a claim that the donor's 3D is broken elsewhere.

**Caveat worth carrying forward.** Both `runWorkerFirst*GoldenFixture` tools return `failures: []` even when every
captured frame is blank — they record observation data and do not assert non-blank. A green run from these tools is
not evidence that anything rendered.

**Decision route.** `ADAPT PATTERN` — reimplement the agent-control pattern natively in KFB (single state owner,
policy-gated tool registry, dry run, idempotency keys, entity-diff audit, reversible ops). `DIRECT CODE REUSE`
remains not authorized (AGPL-3.0-only). `EXTERNAL TOOL` is downgraded to conditional: 3D work would require
re-testing on the actual target machine first.

Return and evidence:
- `skills/chat/research/KFB_MASTERSELECTS_PROOF_01_KLARTEXT_2026-10-12.md` (plain language, start here)
- `skills/chat/research/KFB_MASTERSELECTS_PROOF_01_RETURN_2026-10-12.md`
- `skills/chat/research/KFB_MASTERSELECTS_PROOF_01_GATE_02_RESULT_2026-10-12.md`
- `skills/chat/research/KFB_MASTERSELECTS_PROOF_01_TEST_REPORT_2026-10-12.md`
- `skills/chat/research/KFB_MASTERSELECTS_PROOF_01_SOURCE_2026-10-12.json`
- `skills/chat/research/KFB_MASTERSELECTS_PROOF_01_EVIDENCE_2026-10-12/`

No KFB runtime write, no merge, no Site or Stage publication, no Live promotion. Island R4 STOP and the Four-Island
A/B gate are untouched.

**Next gate: MASTERSELECTS_3D_UPSTREAM_ISSUE_CONFIRMATION_03** — report the reproduction upstream (fixture names,
fingerprint hashes, exact environment) and ask whether 3D is expected to work on Apple Silicon / Chrome 147, or
re-test on a second GPU/OS. A cheap external question, not an engineering slice.
