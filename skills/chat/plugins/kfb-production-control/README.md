# KFB Production Control · Claude Plugin

Status: **v0.2.0 · CLOUD MCP BOUND · REAL CLAUDE SMOKE PENDING**  
Workflow: `KFB-CLAUDE-PRODUCTION-CONTROL-PLUGIN-01`  
Owner: KFB production-routing layer. This plugin does not become a game/runtime owner.

## Purpose

One shared production protocol for Claude Code/Cowork, Blender MCP authoring lanes, Claude Design handoffs, recovery after context loss, durable checkpoints and compact session-cut intake.

GitHub/project SSOT remains authoritative for implementation facts. Production Control is the durable cross-agent working ledger and artifact inbox.

## Bound remote MCP

Exact streamable-HTTP endpoint:

`https://kfb-production-control.frizzlebob.chatgpt.site/mcp`

The endpoint is provisioned by the existing KFB Production Control Site and uses the same D1/R2 storage and per-user isolation as the Hub. Sites owns OAuth at the hosting boundary. No token, cookie or signed capability URL is stored in this repository.

The plugin's `.mcp.json` already contains the endpoint; no URL guessing or user-supplied endpoint is required.

## Plugin skills

- `/kfb-production-control:control` — load the standing KFB production protocol.
- `/kfb-production-control:recover [workflow]` — recover owner, branch/head, last result and one next gate.
- `/kfb-production-control:checkin [workflow]` — persist a deliberate checkpoint/Return.
- `/kfb-production-control:session-cut [workflow]` — execute the current KFB session-cut contract and upload the result.

The write-oriented skills are user-invoked. The `control` and `recover` skills may be selected automatically when relevant.

## Development install

From a checkout containing this directory:

```bash
claude --plugin-dir skills/chat/plugins/kfb-production-control
```

Then allow the OAuth connection for `kfb-production-control` and inspect `/mcp`. Do not substitute the browser root URL for the endpoint above.

## Current Production Control tool contract

- `kfb_web_read`
- `kfb_web_checkpoint`
- `kfb_web_artifact_save`
- `kfb_web_artifact_import`
- `kfb_web_upload_begin`
- `kfb_web_upload_chunk`
- `kfb_web_upload_finish`
- `kfb_web_upload_abort`
- `kfb_web_artifact_read`
- `kfb_web_artifact_read_chunk`
- `kfb_web_artifact_link`

## Claude Design and Blender MCP

Claude Design may consume the same briefs and Returns, but the real transport smoke belongs in Claude Code/Cowork because it must load a remote MCP plugin and prove fresh-session recovery.

Blender MCP remains an authoring lane unless the named project explicitly grants more ownership. Check-ins preserve source files/scripts where permitted, exports, evidence, tests and one next gate. No automatic runtime merge or Stage/Live promotion.

## Remaining acceptance gate

The cloud endpoint and plugin binding are no longer missing. Full PASS still requires one real Claude Code/Cowork run:

`RECOVER -> CHECKPOINT -> ARTIFACT UPLOAD -> RETURN -> FRESH SESSION RECOVERY`

Until that passes, status is `CLOUD_MCP_BOUND · CLAUDE_SMOKE_PENDING`, not transport failure and not full acceptance.
