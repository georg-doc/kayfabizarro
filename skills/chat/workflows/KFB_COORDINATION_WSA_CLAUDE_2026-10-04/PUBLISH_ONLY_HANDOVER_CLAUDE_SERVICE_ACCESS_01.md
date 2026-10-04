# PUBLISH_ONLY handover · CLAUDE_SERVICE_ACCESS_01

Use this only after Georg has created and entered both runtime values in the existing private Site:

- `KFB_CLAUDE_COWORK_AGENT_KEY` — secret, independently rotatable agent key;
- `KFB_PRODUCTION_SCOPE_OWNER_ID` — Georg's existing Production Control owner identity used only as the fixed backing owner for the `kfb-production` scope.

Do not place either value in GitHub, chat, logs, screenshots or Return files.

## Exact existing Site

- URL: `https://kfb-production-control.frizzlebob.chatgpt.site`
- project ID: `appgprj_6ab82e3950b88191a8ead3c495e21454`
- access mode: `custom` / owner-private
- candidate Site source: `cfe4c7917b90acaabd3fdc36565df2051fad0faf`
- archive SHA-256: `d606e4358a5cbf4682251673ed44f76dd1ad9305d3d7098f22801861c1002150`

## Publish-only operation

1. Open the existing Site source and verify the exact candidate commit above.
2. Confirm both environment variable names exist without reading or returning their values.
3. Save one Site version from the exact candidate source/archive.
4. Deploy that saved version privately to the same Site. Do not change access mode.
5. Run the same nine tests against the deployed version. Use the real secrets only through secure runtime/header entry; never echo them.
6. Run Claude smoke `KFB-CLAUDE-PC-MCP-SMOKE-01`: read, one checkpoint, read-back, one small artifact save/read.
7. Return Site project/version/deployment/source IDs and smoke status only. Do not redesign or change product data.

Forbidden: new Site, public access, Cloudflare substitute, Hub/ToolBox/Combat changes, merge, Live promotion, secret output.

Exactly one next gate: **Georg enters the two values; a low-cost Sites-capable executor performs this PUBLISH_ONLY handover and Claude smoke.**
