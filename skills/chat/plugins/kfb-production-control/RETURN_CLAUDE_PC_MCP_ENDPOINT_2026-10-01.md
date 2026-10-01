# RETURN · CLAUDE-PC-MCP-01 · cloud endpoint binding

Status: **CLOUD_MCP_BOUND · CLAUDE_SMOKE_PENDING**  
Date: 2026-10-01

## Result

The missing endpoint is no longer missing.

- Production Control Site project: existing owner-private KFB Production Control.
- Streamable HTTP MCP: `https://kfb-production-control.frizzlebob.chatgpt.site/mcp`.
- OAuth resource: same URL, provisioned by Sites.
- Storage: existing Production Control D1/R2; no second service.
- Auth: Sites OAuth and authenticated per-user identity.
- Current contract: eleven `kfb_web_*` tools including direct/chunked artifact transport and cursor/chunk readback.
- Claude plugin `.mcp.json` now points directly to the endpoint.
- Plugin metadata version: 0.2.0.
- No credential is committed.

## Evidence

- Sites reports the current publication as MCP-ready and returns the exact endpoint and provisioned private plugin identity.
- Current Site source contains a streamable HTTP `POST /mcp` implementation with initialize, tools/list and authenticated tools/call.
- Existing ChatGPT/Codex Site tools remain backed by the same records/files.

## Not yet claimed

- `claude plugin validate` in a real Claude environment;
- OAuth completion from Claude Code/Cowork;
- fresh-Claude-session recovery.

## Exactly one next gate

Run `KFB-CLAUDE-PC-MCP-SMOKE-01` from Claude Code/Cowork using the updated plugin, then record validator output, eleven-tool discovery, text + binary SHA readback and fresh-session recovery.
