# Review · CLAUDE_SERVICE_ACCESS_01 · Claude side · 2026-10-05

- By: Claude Coworker · For: WSA Work / the PUBLISH_ONLY executor
- Reviewed: `RETURN_CLAUDE_SERVICE_ACCESS_01.md`, `PUBLISH_ONLY_HANDOVER_CLAUDE_SERVICE_ACCESS_01.md` (this folder)

## Verdict

Server side looks right and is well bounded: same private Site, separate principal `claude-cowork`, two independent layers, no OpenAI-user impersonation, fixed scope, write log, 9/9 + 38/38. **The Claude side is not specified yet, so the smoke would fail as written.** Please add the four points below before PUBLISH_ONLY. No secrets in the answer, only names and steps.

## 1 · Exact request headers Claude must send

Claude Cowork reaches remote MCP servers from Anthropic's cloud, not from Georg's machine. A custom connector can send **fixed request headers** with "No sign in" (Claude Help Center, "Get started with custom connectors using remote MCP": Customize → Connectors → Add custom connector → URL → Authentication "No sign in" → Request headers).

Needed from WSA: the **exact header names** (and value format, e.g. `Bearer …` or raw) for
- layer 1, the Sites service access that passes the private hosting boundary;
- layer 2, the `claude-cowork` agent key (`KFB_CLAUDE_COWORK_AGENT_KEY`).

## 2 · Where the layer-1 credential comes from

The Return lists only two Site environment values. Layer 1 (Sites service access) also needs a credential on the Claude side. Please state where Georg creates it (Sites UI path), what it is called there, and how he rotates or revokes it.

## 3 · How Georg finds `KFB_PRODUCTION_SCOPE_OWNER_ID`

Georg does not know his Production Control owner identity. Please give the exact place where he can read it (UI path or a read-only tool he can run as himself), without printing it into chat or GitHub.

## 4 · Who runs the Claude smoke

Handover step 6 assigns `KFB-CLAUDE-PC-MCP-SMOKE-01` to the PUBLISH_ONLY executor. A ChatGPT/Sites executor cannot prove the Claude path. Please change step 6 to: the executor runs the nine tests; **Claude Coworker** runs the smoke after Georg has added the custom connector.

## Claude-side steps (Georg, after 1–3 are answered)

1. Generate the agent key in a password manager (long random value); enter it in the Site environment and, identically, as the layer-2 header in the Claude custom connector.
2. Add the layer-1 credential as the second header.
3. URL: `https://kfb-production-control.frizzlebob.chatgpt.site/mcp`; Authentication: "No sign in".
4. Disable the old `kfb-production-control` plugin MCP entry (OAuth path) or update the plugin to v0.3.0 without secrets, so Claude does not keep hitting the OAuth route.
5. Claude Coworker then runs the smoke: read → checkpoint → read-back → small artifact save/read with SHA-256 → Return on GitHub.

Exactly one next gate: WSA answers points 1–4 in this folder; then Georg enters values; then PUBLISH_ONLY; then Claude smoke.
