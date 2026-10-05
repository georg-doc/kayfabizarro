# PUBLISH_ONLY handover · CLAUDE_SERVICE_ACCESS_01

> **HOLD · Georg decision 2026-10-05. Do not execute this handover unless Georg explicitly reactivates it.** Current coordination uses GitHub instead; see `DECISION_CLAUDE_SERVICE_ACCESS_DEFERRED_2026-10-05.md`.

Use this only after Georg has created the agent key and authorized the secret-safe setup. There are **three values in two destinations**.

Site runtime environment:

- `KFB_CLAUDE_COWORK_AGENT_KEY` — secret, independently rotatable agent key;
- `KFB_PRODUCTION_SCOPE_OWNER_ID` — Georg's existing Production Control owner identity used only as the fixed backing owner for the `kfb-production` scope.

Claude custom connector request headers:

- `OAI-Sites-Authorization` = `Bearer <Sites SIWC bypass token>`;
- `x-kfb-agent-key` = the exact raw value stored in `KFB_CLAUDE_COWORK_AGENT_KEY`.

The Sites token is not a Site environment variable. `KFB_PRODUCTION_SCOPE_OWNER_ID` is the existing Site-local `production_records.created_by` value, not an access-policy account ID. Resolve it in Sites Settings → database viewer → `DB` → `production_records` → `created_by`, or with the equivalent read-only native database tools. Do not print it.

The Sites token is read from the existing project or created/rotated through the native `generate_siwc_bypass_token` operation after Georg explicitly authorizes that action. Rotation may leave the old token accepted for up to 60 seconds. No verified manual UI path or standalone hard-revoke operation is claimed.

Do not place any value in GitHub, chat, logs, screenshots or Return files.

## Exact existing Site

- URL: `https://kfb-production-control.frizzlebob.chatgpt.site`
- project ID: `appgprj_6ab82e3950b88191a8ead3c495e21454`
- access mode: `custom` / owner-private
- candidate Site source: `cfe4c7917b90acaabd3fdc36565df2051fad0faf`
- archive SHA-256: `d606e4358a5cbf4682251673ed44f76dd1ad9305d3d7098f22801861c1002150`

## Publish-only operation

1. Open the existing Site source and verify the exact candidate commit above.
2. Resolve the existing owner ID without output and configure both Site environment variables as secret/private values.
3. Securely read or, only with Georg's explicit authorization, create/rotate the Sites SIWC bypass token.
4. Georg configures the Claude connector at the exact `/mcp` URL with Authentication `No sign in` and the two exact headers above. Disable the old OAuth/plugin entry before smoke so Claude does not select the wrong connection.
5. Save one Site version from the exact candidate source/archive and deploy it privately to the same Site. Do not change access mode.
6. The PUBLISH_ONLY executor runs the same nine server/host tests against the deployed version. It must not claim a Claude-path PASS.
7. **Claude Coworker** runs `KFB-CLAUDE-PC-MCP-SMOKE-01`: read → checkpoint → read-back → small artifact save/read with SHA-256 → GitHub Return.
8. Return Site project/version/deployment/source IDs and the separately reported Claude smoke status. Do not redesign or change product data.

Forbidden: new Site, public access, Cloudflare substitute, Hub/ToolBox/Combat changes, merge, Live promotion, secret output.

Exactly one next gate: **Georg authorizes/configures the secret-safe three-value setup; a low-cost Sites-capable executor deploys; Claude Coworker performs the smoke.**
