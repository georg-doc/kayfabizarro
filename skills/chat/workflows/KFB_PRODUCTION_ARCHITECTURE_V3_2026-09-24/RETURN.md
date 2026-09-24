# RETURN · KFB Production Architecture v3 · 2026-09-24

Status: **ARCHITECTURE CANDIDATE READY · UNMERGED · NO LIVE PROMOTION**

## Exact state

- Repo: `georg-doc/kayfabizarro`
- Branch: `chatgpt-web/production-architecture-v3-2026-09-24`
- Draft PR: **#204**
- Base: `main@9431dcb8da0158a75d0988d52fc1e7a49aac21f1`
- Implementation/evidence checkpoint before this Return: `5b9fb57f0be8c015bdf744b550a4e61a415c553e`
- Public Stage: **not created**
- Live promotion: **not authorized**

## Actual result

The KFB production method is now specified as a lightweight self-service architecture instead of a micro-gate/control-plane loop.

Prepared:
- production/review/recovery separation;
- GitHub Bridge for read-only authoring executors;
- chat-first real 3D review;
- one-active-integration-PR-per-owner default;
- compact typed status model;
- four copy-ready self-service jobs;
- current source locks for ToolBox, Blender Residents and WorldBuilder;
- machine-readable Hub briefing catalog;
- WorldBuilder R1→R5 capability gradient.

## Files

- `START_HERE.md` — architecture contract;
- `SELF_SERVICE_BRIEFINGS.md` — copy-ready jobs;
- `INPUT_LOCKS.json` — current pins;
- `HUB_BRIEFING_CATALOG.json` — READY/HOLD Hub cards;
- `TEST_REPORT.md` — 20/20 checks;
- `CHANGELOG.md` — additive architecture history;
- top-level `skills/chat/START_HERE.md` — routes new work to v3 candidate.

## Current self-service queue

READY:
- Web Quick 3D Review;
- ToolBox Coherent Integration 01;
- Blender Resident Performance Batch 01.

HOLD, already fully briefed:
- WorldBuilder Capability R1 — waits only for Georg's WB-W0 PASS/TUNE/REJECT on scale + traversability. No new planning review is required after that answer.

## Tests/evidence

**20/20 PASS**:
- both JSON contracts parse;
- all catalog jobs resolve to input locks;
- Hub bucket/status contract valid;
- 4/4 jobs avoid mandatory Work and Cloudflare in the normal loop;
- WorldBuilder status separates source/pr/deploy heads;
- all seven pinned current PR heads revalidated against GitHub;
- router link present.

No product runtime or visual-product claim is made by these tests.

## Hub state

The new briefing shelf is prepared as `HUB_BRIEFING_CATALOG.json`.

The current public Hub remains owned by HUB-CTRL PR #202 / `cloudflare-live`. This slice deliberately does **not** copy or overwrite that owner's files from an older main base.

Safe integration path:
- HUB-CTRL consumes the v3 catalog after architecture acceptance;
- then the public Hub may expose the READY jobs in one cheap publication batch.

## Unresolved

- existing 85-open-PR backlog is not cleaned in this architecture slice;
- HUB-CTRL #202 does not yet consume the v3 briefing catalog;
- legacy process docs remain in history; v3 router note overrides conflicting production-method guidance only on this branch until merge.

## One next gate

**ARCH-V3 HUMAN GATE:** Georg confirms that the prepared self-service model is the desired production default.

After PASS:
1. mount `HUB_BRIEFING_CATALOG.json` into the current HUB-CTRL owner;
2. run one cheap PR-hygiene pass to close clearly SUPERSEDED/FROZEN/REJECTED historical PRs without deleting history;
3. start product work directly from READY briefings.

No further architecture review is required before each individual READY job.
