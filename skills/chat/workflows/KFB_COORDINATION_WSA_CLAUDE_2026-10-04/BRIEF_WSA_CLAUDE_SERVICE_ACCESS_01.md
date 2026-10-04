# BRIEF · CLAUDE_SERVICE_ACCESS_01 · WSA Work · 2026-10-05

- Go: **Georg, 2026-10-05** ("1. ja")
- Basis: WSA's own access analysis (forwarded by Georg 2026-10-05) and `COORDINATION_PLAN_WSA_CLAUDE_2026-10-04.md` §5 (corrected)
- Owner: **KFB Production Control** (existing Site, existing D1/R2). No second Site, no new service.
- Executor: WSA Work, one bounded run. Low-cost executor for the later re-publish only.

## Problem (agreed)

Claude's remote MCP client cannot use the private Site: the OAuth flow ends at the OpenAI authorization server (metadata path returns HTML), and the tools expect `oai-authenticated-user-id`, an OpenAI identity Claude never has. `POST /mcp` and `/.well-known/oauth-protected-resource/mcp` themselves work correctly. Public access is not an option: `/api/control` has no own auth check and relies on the private boundary.

## Outcome

Claude Cowork reaches the **same** `/mcp` endpoint through a narrow service principal, while the Site stays private.

1. Production Control stays `custom` / private.
2. Same endpoint: `https://kfb-production-control.frizzlebob.chatgpt.site/mcp`.
3. A fixed secret request header on the Claude side; Sites service access lets the request through the private hosting boundary.
4. Production Control maps it to an explicit allow-listed principal **`claude-cowork`** (separately **`claude-design`**, read-only, only if cheap).
5. `claude-cowork` may: read current and history (`kfb_web_read`, artifact reads/links), write checkpoint / Return (`kfb_web_checkpoint`), upload checked artifacts (`kfb_web_artifact_save`, `_import`, `upload_*`).
6. `claude-cowork` may not: delete anything, change layout, priority or board order, touch other users' records.
7. Every write records agent principal, time and source; visible in the Control history.
8. Existing ChatGPT/Codex access and per-user isolation unchanged.

## Secret handling

- **Georg** creates and enters the secret, on both sides. Neither WSA nor Claude writes the value into chat, GitHub, briefs, Returns or logs.
- Claude side: verify which binding the Cowork client actually supports and document only the mechanism, never the value. Either a claude.ai custom connector with a fixed request header (Georg enters it in Connector settings), or the plugin's `.mcp.json` `headers` referencing an environment variable. If the plugin route needs a change, ship it as plugin v0.3.0 without any secret.
- Rotation: document how Georg rotates or revokes the secret in one step.

## Tests (real, counted)

1. Unauthenticated `POST /mcp` still `401` with discovery (unchanged).
2. Wrong or missing header → rejected; no data in the response.
3. Correct header → `initialize` and `tools/list` return the eleven `kfb_web_*` tools.
4. `claude-cowork` read succeeds; checkpoint write succeeds and appears in history with principal + time + source.
5. Forbidden actions (delete, priority/layout change) → rejected.
6. `/api/control` and the UI still require the private Site login.
7. Existing ChatGPT path still works (one read, one checkpoint).

## Then: Claude smoke (Claude Coworker runs it)

`KFB-CLAUDE-PC-MCP-SMOKE-01`: connect from Cowork → recover → checkpoint → small artifact upload with SHA-256 read-back → Return → fresh-session recover. Claude reports the result on GitHub.

## Not in this job

No public Site, no change to Hub or ToolBox visibility (Georg prefers them private), no second Control, no Claude Design write access, no merge, no Live promotion.

## Exactly one next gate

Production Control accepts the `claude-cowork` principal with the seven tests above passing. Then Claude runs the smoke.
