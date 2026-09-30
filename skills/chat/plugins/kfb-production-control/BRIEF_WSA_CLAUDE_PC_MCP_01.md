# BRIEF · CLAUDE-PC-MCP-01 · expose KFB Production Control to Claude

Status: **READY FOR BACKEND / WSA EXECUTION**
Date: 2026-09-30
Owner: existing KFB Production Control Apps SDK/Site backend
Consumer: `skills/chat/plugins/kfb-production-control/`
Candidate: Draft PR #299 · branch `chatgpt-web/kfb-claude-production-control-plugin-01-2026-09-30`

## Goal

Expose the **existing** KFB Production Control capabilities through one authenticated remote HTTP MCP endpoint that Claude Code/Cowork can connect to.

Do not create a second persistence store, second workflow service or replacement Production Control app.

## Proven current state

- KFB Production Control is an **AppsSDKApp**.
- Current ChatGPT tool contract is working and backend artifact persistence has been probed successfully.
- Claude plugin candidate is already packaged and source-tested.
- The only missing seam is an externally consumable MCP endpoint/auth contract.
- The public browser Site URL must not be assumed to be the MCP endpoint.

## Required remote MCP capability

Expose the existing operations, preserving behavior and limits:

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

Backend names may remain `kfb_web_*`. Do not rename the current ChatGPT contract merely for Claude.

## Transport / auth

Target a standard **remote HTTP MCP** connection compatible with current Claude Code.

Requirements:

1. one explicit HTTPS MCP URL;
2. authenticated per user; no anonymous write path;
3. prefer supported OAuth/discovery for remote MCP when available;
4. no bearer token, cookie or signed capability URL committed to GitHub;
5. private artifact capability links remain short-lived and must not be published;
6. current authenticated user isolation must remain intact;
7. existing ChatGPT Production Control integration must continue to work.

If the Apps SDK hosting layer cannot expose the existing internal tool surface directly, add the thinnest adapter in front of the **same** backend/storage/authorization logic. Do not duplicate D1/R2 state.

## Plugin binding

The Claude plugin already expects:

```json
{
  "mcpServers": {
    "kfb-production-control": {
      "type": "http",
      "url": "${user_config.production_control_mcp_url}"
    }
  }
}
```

Therefore backend delivery is simply the exact MCP URL + supported auth flow. No secret belongs in the plugin repository.

## Disposable smoke workflow

Use a new disposable workflow:

`KFB-CLAUDE-PC-MCP-SMOKE-01`

From a real Claude Code/Cowork environment:

1. run `claude plugin validate skills/chat/plugins/kfb-production-control`;
2. load plugin and set `production_control_mcp_url`;
3. inspect `/mcp` and complete authentication;
4. invoke `/kfb-production-control:recover KFB-CLAUDE-PC-MCP-SMOKE-01`;
5. persist one `WIP_CHECKPOINT`;
6. save one deterministic small text artifact with expected SHA-256;
7. read the artifact back and verify bytes/SHA;
8. persist one `RETURN` containing artifact id/SHA and one next gate;
9. start a **fresh Claude session**;
10. recover the same workflow and prove the fresh session sees the Return/artifact and exact next gate without pasted chat context.

## Acceptance

PASS only when all are true:

- `claude plugin validate` passes in the real Claude environment;
- remote MCP is connected/authenticated;
- read works;
- checkpoint write works;
- artifact save/read/SHA works;
- Return works;
- fresh-session recovery works;
- ChatGPT-side Production Control remains operational;
- no cross-user record/artifact access;
- no Stage/Cloudflare/Hub product page was required.

## Evidence to return

- exact backend revision/deployment identifier;
- exact MCP endpoint **location** (URL may be stored in protected operational config if policy requires; do not put credentials in GitHub);
- auth mode;
- Claude version/environment;
- validator output;
- tool list observed through `/mcp`;
- smoke workflow record ids;
- artifact id, byte size and SHA-256;
- fresh-session recovery transcript/result summary;
- failures left visible;
- exactly one next gate.

## Stop rule

If two focused backend/transport attempts fail on the same seam, stop and export the failure state. Do not build a parallel Production Control service.

## No Stage / Live work

This is infrastructure transport. Do not create a Cloudflare Stage or KFB Hub human gate merely to prove MCP connectivity.
