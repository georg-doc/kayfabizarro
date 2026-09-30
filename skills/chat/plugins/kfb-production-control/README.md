# KFB Production Control · Claude Plugin

Status: **EXPERIMENTAL v0.1.0**  
Workflow: `KFB-CLAUDE-PRODUCTION-CONTROL-PLUGIN-01`  
Owner: KFB production-routing layer. This plugin does not become a game/runtime owner.

## Purpose

One shared production protocol for:

- Claude Code / Cowork;
- Blender MCP authoring lanes;
- Claude Design handoffs;
- recovery after context loss;
- durable KFB Production Control checkpoints;
- session-cut ZIP intake.

GitHub/project SSOT remains authoritative for implementation facts. Production Control is the durable cross-agent working ledger and artifact inbox.

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

Configure `production_control_mcp_url` with the **exact remote MCP endpoint** for KFB Production Control, then inspect `/mcp`.

Do not guess the endpoint from the public Site URL. Authentication stays with the Production Control service (prefer remote MCP OAuth); no bearer token is stored in this plugin.

## Required Production Control tool contract

The connected MCP server must expose these current operations (backend names may retain the existing `kfb_web_*` prefix):

- `kfb_web_read`
- `kfb_web_checkpoint`
- `kfb_web_artifact_save`
- `kfb_web_artifact_import`
- `kfb_web_upload_begin`
- `kfb_web_upload_chunk`
- `kfb_web_upload_finish`
- `kfb_web_upload_abort`
- `kfb_web_artifact_read`
- `kfb_web_artifact_link`

Provider-neutral aliases are allowed later, but the plugin must not require a backend rename.

## Claude Design

Use the same protocol. If a Design canvas cannot load the plugin components directly, use Claude Code/Cowork + Design Sync or load the canonical KFB skill/brief into Design. The return path stays Production Control; do not create a Design-only check-in format.

## Blender MCP

Blender MCP remains an authoring lane unless the named project explicitly grants more ownership. Check-ins preserve source `.blend`/scripts where permitted, generated exports, evidence, actual audits/tests and one next gate. No automatic runtime merge or Stage/Live promotion.

## Current acceptance gate

The package structure and static contracts can be checked in GitHub. Full PASS requires a real Claude environment with the exact Production Control remote MCP endpoint:

`RECOVER -> CHECKPOINT -> ARTIFACT UPLOAD -> RETURN -> FRESH SESSION RECOVERY`.

Until that endpoint/auth path is verified, transport status is `MCP_BINDING_PENDING`, not PASS.
