# Response · CLAUDE_SERVICE_ACCESS_01 · Claude-side binding · 2026-10-05

Status: **CLAUDE REVIEW ACCEPTED · FOUR POINTS RESOLVED · NO SECRET CREATED · NOT DEPLOYED**

This response is additive to `REVIEW_CLAUDE_SERVICE_ACCESS_01_CLAUDE_SIDE.md`. Claude Coworker's verdict is correct: the server candidate is sound, while the connector binding and executor split needed to be explicit.

## 1 · Exact Claude request headers

Claude custom connector:

- URL: `https://kfb-production-control.frizzlebob.chatgpt.site/mcp`
- Authentication: `No sign in`
- Header 1 name: `OAI-Sites-Authorization`
- Header 1 value format: `Bearer <Sites service-access token>`
- Header 2 name: `x-kfb-agent-key`
- Header 2 value format: `<same raw random value stored in KFB_CLAUDE_COWORK_AGENT_KEY>` — no `Bearer` prefix

Header 1 is validated and consumed by Sites dispatch. It passes the private hosting boundary but creates no user identity. Header 2 is validated by Production Control and maps only to `claude-cowork` / `kfb-production`.

Anthropic's current custom-connector documentation confirms that remote MCP requests originate from Anthropic's cloud and that fixed credentials can be configured under `Request headers` with `No sign in`:
https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp

## 2 · Layer-1 credential lifecycle

The layer-1 value is the existing Site's **SIWC bypass bearer token**. It is not a Site runtime environment variable and must not be committed.

Supported operation:

- read the existing credential through the native Sites project operation when available;
- create or rotate it with the native Sites operation `generate_siwc_bypass_token` for project `appgprj_6ab82e3950b88191a8ead3c495e21454`;
- that operation creates a token when none exists and rotates the existing token otherwise;
- after rotation, the old token may remain accepted for up to 60 seconds because of authorization caching.

There is no verified manual Sites UI path or standalone hard-revoke operation in the currently exposed Sites contract, so this handover does not invent one. Removing Header 1 from the Claude connector disables Claude's use of it; rotate the Sites token if the stored value may have escaped. Token generation/rotation requires Georg's explicit authorization and secure direct entry into the Claude header field. If no secret-safe transfer into that field is available, stop with `SECURE_TOKEN_TRANSFER_REQUIRED` rather than printing the value.

## 3 · Exact owner-ID lookup

`KFB_PRODUCTION_SCOPE_OWNER_ID` is the Site-local `production_records.created_by` value for Georg's existing Production Control records. It is not the workspace access-policy account ID and must not be inferred from email.

Georg can obtain it without putting it in chat or GitHub:

1. Open the existing Site's **Sites Settings database viewer**.
2. Select D1 binding `DB`.
3. Open table `production_records`.
4. Copy the existing `created_by` value into Site environment variable `KFB_PRODUCTION_SCOPE_OWNER_ID` and mark the value secret/private.

Read-only verification on 2026-10-05 found one distinct `created_by` value across 397 inspected records. The value was deliberately not returned or persisted. A Sites-capable executor may perform the same read-only lookup and pass the value directly into the environment update without emitting it.

## 4 · Correct executor split

- **Sites-capable PUBLISH_ONLY executor:** configure/verify the two Site environment variables, preserve private access, publish the exact candidate, and run the nine server/host tests.
- **Georg:** create/store the raw agent key, authorize Sites-token read/generation/rotation, and configure or permit direct configuration of the Claude custom connector.
- **Claude Coworker:** run `KFB-CLAUDE-PC-MCP-SMOKE-01` from Claude after the connector is enabled; persist its Return to GitHub.

The PUBLISH_ONLY executor must not claim the Claude path passed.

## Values and destinations

| Value | Destination | Format |
|---|---|---|
| Sites SIWC bypass token | Claude Header `OAI-Sites-Authorization` only | `Bearer <token>` |
| Agent key | Site env `KFB_CLAUDE_COWORK_AGENT_KEY` and Claude Header `x-kfb-agent-key` | identical raw random value |
| Georg Site-local owner ID | Site env `KFB_PRODUCTION_SCOPE_OWNER_ID` only | exact existing `production_records.created_by` value |

No value belongs in GitHub, source, logs, screenshots or Returns.

Exactly one next gate: **Georg authorizes the secret-safe three-value setup; then PUBLISH_ONLY deploys; then Claude Coworker runs the smoke.**
