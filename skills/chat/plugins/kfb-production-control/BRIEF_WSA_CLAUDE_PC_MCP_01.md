# BRIEF · CLAUDE-PC-MCP-01 · verify KFB Production Control in Claude

Status: **CLOUD ENDPOINT EXPOSED · PLUGIN BOUND · REAL CLAUDE SMOKE PENDING**  
Date: 2026-10-01  
Owner: existing KFB Production Control Site backend  
Consumer: `skills/chat/plugins/kfb-production-control/`  
Candidate: Draft PR #299 · branch `chatgpt-web/kfb-claude-production-control-plugin-01-2026-09-30`

## Proven current state

- The existing KFB Production Control Site is MCP-enabled.
- Exact streamable HTTP endpoint: `https://kfb-production-control.frizzlebob.chatgpt.site/mcp`.
- OAuth resource: the same endpoint; Sites owns OAuth and authenticated identity headers.
- The endpoint uses the same D1/R2 storage and per-user isolation as Production Control.
- Eleven tools are exposed: read, checkpoint, direct save, HTTPS import, chunked upload begin/chunk/finish/abort, artifact read, deterministic chunk read and temporary private link.
- The Claude plugin is bound directly to this URL; it no longer asks Georg to locate or type an endpoint.
- Existing ChatGPT/Codex Production Control access remains operational.

Do not create a second persistence store, workflow service or Production Control app.

## Remaining goal

Prove the existing endpoint from a real Claude Code/Cowork environment. Claude Design alone is not the transport-test host.

## Transport and auth rules

1. Use the exact endpoint above.
2. Complete the supported OAuth flow; do not add repository tokens.
3. No bearer token, cookie or signed capability URL goes into GitHub.
4. Keep user isolation and private artifact access intact.
5. Do not weaken the Site audience or add anonymous writes.
6. Do not rename or duplicate the current `kfb_web_*` contract.

## Disposable smoke workflow

Use exactly:

`KFB-CLAUDE-PC-MCP-SMOKE-01`

1. Run `claude plugin validate skills/chat/plugins/kfb-production-control`.
2. Load the plugin from this branch.
3. Confirm discovery of all eleven tools.
4. Authenticate to the remote MCP.
5. Recover the disposable workflow.
6. Persist one `WIP_CHECKPOINT`.
7. Save a deterministic small UTF-8 artifact and verify bytes/SHA-256 after readback.
8. Save a binary artifact larger than 256 KB, read it through cursor/chunk reads and verify the whole-file SHA.
9. Persist one `RETURN` with artifact IDs, SHAs and exactly one next gate.
10. Start a fresh Claude session and recover the same Return/artifacts without pasted context.
11. Confirm ChatGPT-side Production Control still reads/writes the owner's records.

## PASS requires

- real Claude plugin validation;
- OAuth connection;
- eleven-tool discovery;
- read/checkpoint/direct artifact and chunked binary readback;
- exact hashes;
- fresh-session recovery;
- no cross-user access;
- unchanged ChatGPT/Codex access.

## Evidence

Return Claude version/environment, plugin validator output, endpoint (never credentials), auth mode, observed tool list, record/file IDs, byte sizes, SHAs and the fresh-session recovery result.

## Stop rule

After two focused failures on the same Claude OAuth/transport seam, stop and export the evidence. Do not build a parallel service.

## No product Stage

This is infrastructure transport. Do not create a KFB game Stage, GitHub mirror or Cloudflare fallback to prove it.
