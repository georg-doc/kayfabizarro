# Minimal Work/WSA escalation · Production-Control broad read

Status: **PREPARED · NOT STARTED**
Workflow: `KFB-CONTROL-PLANE-RECOVERY-01`

Use this only if repairing the Production-Control server query requires source/runtime access unavailable to Web.

## Why Work is justified

Missing capability:
The Web-visible KFB Production Control connector exposes read/checkpoint/artifact APIs but not the Site/server implementation that executes the failing `production_files` query.

## Prepared evidence

Observed in ChatGPT Web on 2026-10-01:
- `kfb_web_read({limit:100})` → server-side query failure while resolving `production_files`;
- `kfb_web_read({limit:20})` → PASS;
- `kfb_web_read({workflow:"KFB-CONTROL-PLANE-RECOVERY-01",limit:20})` → PASS after checkpoint.

Current repository contract:
`skills/chat/workflows/KFB_CONTROL_PLANE_RECOVERY_01_2026-10-01/START_HERE.md`.

## One task

Repair only the broad-read server path so the existing API can return up to its advertised maximum without failing on the file join/query.

## Forbidden

- no Hub redesign;
- no new briefing architecture;
- no model/reasoning retuning;
- no project-status rewrite;
- no GitHub owner replacement;
- no unrelated database cleanup;
- no Stage/Cloudflare changes unless strictly required to deploy this exact server fix.

## Success check

Against the repaired deployed server:
1. exact-workflow read with `limit:20` returns successfully;
2. unfiltered read with `limit:20` returns successfully;
3. unfiltered read with `limit:100` returns successfully;
4. returned records retain attached-file metadata where present.

## Stop condition

On the first unrelated failure, preserve the candidate and evidence and return to Web. Do not begin a general Production-Control refactor.

## Return

Return exact source/deployment revision, the three read results above, and any still-open backend limitation.
