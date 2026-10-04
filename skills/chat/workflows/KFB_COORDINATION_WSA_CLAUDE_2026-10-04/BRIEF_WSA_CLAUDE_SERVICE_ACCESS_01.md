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
3. **Two independent access layers are mandatory:**
   - **Sites service access credential** gets the request through the private hosting boundary;
   - a separate **Production Control agent key** identifies/authorizes the caller as `claude-cowork`.
   These are different secrets with different purposes and rotation.
4. Production Control maps the valid agent key to the explicit allow-listed principal **`claude-cowork`**. Do not synthesize or impersonate an OpenAI user id. `claude-design` may be added separately as read-only only if that is trivial after Cowork works.
5. **Data scope is explicit and shared:** `claude-cowork` reads/writes only the allow-listed shared **KFB production scope owned by Georg**, not records selected by `oai-authenticated-user-id` and not arbitrary user data. Existing human/OpenAI-user isolation remains unchanged for normal ChatGPT/Codex sessions.
6. `claude-cowork` may: read current and history (`kfb_web_read`, artifact reads/links), write checkpoint / Return (`kfb_web_checkpoint`), upload checked artifacts (`kfb_web_artifact_save`, `_import`, `upload_*`).
7. `claude-cowork` may not: delete anything, change layout, priority or board order, enumerate or touch any non-KFB/non-Georg production scope.
8. Every service write records **production scope + agent principal + time + source**; visible in Control history. The record is not falsely attributed to Georg's OpenAI user id.
9. Existing ChatGPT/Codex access and per-user isolation remain unchanged.

## Secret handling

- **Georg** creates/enters both secrets. Neither WSA nor Claude writes either value into chat, GitHub, briefs, Returns or logs.
- **Sites service credential:** configured only in the private Site/service-access boundary and matching Claude connector/service configuration.
- **Agent key:** configured only in Production Control's secret store and Claude's connector/plugin environment/header configuration. It maps to `claude-cowork`; it is not the Sites token and not an OpenAI user token.
- Claude side: verify which binding Cowork actually supports and document only header names/mechanism, never values. Either a claude.ai custom connector with fixed secret headers, or the plugin's `.mcp.json` headers referencing environment variables. If the plugin route needs a change, ship plugin v0.3.0 without secrets.
- Rotation/revocation: document independent one-step rotation for the Sites credential and the agent key. Revoking the agent key must disable `claude-cowork` without changing human ChatGPT access.

## Tests (real, counted)

1. Unauthenticated `POST /mcp` still `401` with discovery (unchanged).
2. Missing/wrong **Sites service credential** → private hosting boundary rejects; no MCP data.
3. Valid Sites credential + missing/wrong **agent key** → Production Control rejects; no KFB data.
4. Both credentials correct → `initialize` and `tools/list` return the **11** existing `kfb_web_*` tools.
5. `claude-cowork` read succeeds against the allow-listed shared KFB production scope even though no `oai-authenticated-user-id` exists.
6. Checkpoint write succeeds and appears in history with KFB production scope + `claude-cowork` + time + source; no Georg/OpenAI impersonation.
7. Attempt to read another/non-allow-listed user/scope → rejected/empty; forbidden actions (delete, priority/layout change) → rejected.
8. `/api/control` and the UI still require the private Site login.
9. Existing ChatGPT path still works unchanged (one read, one checkpoint under normal OpenAI user isolation).

## Then: Claude smoke (Claude Coworker runs it)

`KFB-CLAUDE-PC-MCP-SMOKE-01`: connect from Cowork → recover → checkpoint → small artifact upload with SHA-256 read-back → Return → fresh-session recover. Claude reports the result on GitHub.

## Not in this job

No public Site, no change to Hub or ToolBox visibility (Georg prefers them private), no second Control, no Claude Design write access, no merge, no Live promotion.

## Exactly one next gate

Production Control accepts the two-layer `claude-cowork` service path with the **nine** tests above passing, including shared-KFB-scope access without OpenAI-user impersonation. Then Claude runs the smoke.
