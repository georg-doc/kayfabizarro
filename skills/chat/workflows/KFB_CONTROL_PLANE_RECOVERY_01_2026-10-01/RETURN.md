# KFB Control Plane Recovery 01 · Return

Status: **IMPLEMENTED + TESTED ON DRAFT · NOT MERGED · NO STAGE**

## Result

The current Production Hub remains the human navigator, but active work no longer depends on the Hub being readable by every agent.

Implemented:
- active briefing contract with portable fallback;
- Claude Design Site-only briefing protection;
- explicit Work/WSA missing-capability gate;
- workflow-first / `limit <= 20` Production-Control recovery rule;
- removal of routine Fresh Chat → Work review routing;
- corrected Hub owner/compatibility wording;
- bounded backend repair escalation packet.

## Source

Repository: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/kfb-control-plane-recovery-01-2026-10-01`
Draft review: `#303` stacked only on the current Hub-entrypoint migration candidate.
Verified implementation/evidence head before this Return: `85e57aaa6a18abee17e3890badf9a019e81b06ad`.

No second runtime owner was introduced.

## Changed / added

- `skills/chat/workflows/KFB_CONTROL_PLANE_RECOVERY_01_2026-10-01/START_HERE.md`
- `briefing-contract.v1.mjs`
- `briefing-contract.test.mjs`
- `TEST_REPORT.md`
- `SOURCE.json`
- `WORK_ESCALATION_BACKEND_READ.md`
- this Return
- `skills/chat/START_HERE.md`
- `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
- `skills/chat/REGISTRY.json`
- `skills/chat/adapters/claude-design.md`
- `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/START_HERE.md`
- `skills/chat/CHANGELOG.md`
- `kfb-hub/README.md`

## Actual evidence

- briefing validator: **13/13 PASS** on Node v22.16.0;
- router consistency: **8/8 PASS**;
- workflow-specific Production-Control checkpoint/readback: **1/1 PASS**;
- every GitHub write in this slice was followed by exact commit/file readback.

## Public / Stage

Stage route: **NONE**.
Reason: this is a technical control-plane contract; there is no useful human Stage decision.

No Cloudflare publication, merge or Live promotion was performed.

## Unresolved

1. The Production-Control server still has the observed broad `kfb_web_read({limit:100})` failure. This repository slice applies a safe operating rule; it does not claim the server fixed.
2. The Production-Control briefing generator/UI still needs to adopt `briefing-contract.v1.mjs` (or equivalent validation) so bad active briefs cannot be emitted.
3. Existing active Claude briefs that are Site-only need GitHub/self-contained fallbacks when touched; they were not bulk-rewritten here.

## Exactly one next gate

**Production-Control briefing-generator adoption:** validate every newly ACTIVE/READY brief against the portable source + WSA escalation contract. If server-source access is required for the broad-read repair, use only the prepared bounded escalation packet and stop on unrelated failure.
