# TEST REPORT · KFB Production Control Claude Plugin · v0.1.0

Date: 2026-09-30
Workflow: `KFB-CLAUDE-PRODUCTION-CONTROL-PLUGIN-01`
Branch: `chatgpt-web/kfb-claude-production-control-plugin-01-2026-09-30`
Implementation head tested: `bfde7da0ff59ce53d5c8c7ad04adf14242d32e01`

## Static/source checks

Result: **26/26 PASS**

Checked against the current Anthropic Claude Code plugin/skills/MCP documentation on 2026-09-30:

- plugin root uses `.claude-plugin/plugin.json`;
- skills use `skills/<name>/SKILL.md`;
- MCP uses root `.mcp.json`;
- plugin name is kebab-case;
- manifest and MCP files parse as JSON;
- required Production Control MCP URL is declared as user configuration;
- MCP transport is `type: "http"`;
- MCP URL references `${user_config.production_control_mcp_url}`;
- all four skills have parseable YAML-style frontmatter with name + description;
- write-oriented `checkin` and `session-cut` skills set `disable-model-invocation: true`;
- session-cut skill routes to current canonical `skills/session_ZIP_v1.md`;
- timeout => UNKNOWN rule present;
- two-failed-repair-pass stop rule present;
- no automatic deploy/merge/Live promotion rule present;
- no token/secret/password field is stored in the plugin manifest;
- README exposes `MCP_BINDING_PENDING` rather than claiming an unverified remote connection.

Official references:
- https://code.claude.com/docs/en/plugins
- https://code.claude.com/docs/en/plugins-reference
- https://code.claude.com/docs/en/skills
- https://code.claude.com/docs/en/mcp

## GitHub source verification

Result: **7/7 intended implementation files fetched back from the exact branch head**

Verified files:
1. `.claude-plugin/plugin.json`
2. `.mcp.json`
3. `README.md`
4. `skills/control/SKILL.md`
5. `skills/recover/SKILL.md`
6. `skills/checkin/SKILL.md`
7. `skills/session-cut/SKILL.md`

## Production Control backend probe

Result: **PASS for current backend artifact save/read semantics**

Disposable artifact:
- name: `KFB_CLAUDE_PLUGIN_E2E_PROBE.txt`
- size: 113 bytes
- expected SHA-256: `9d1001c260ed511d37be3b6fbc3e44c67a05fb0448932ee704fa6e46f6f0af54`
- returned SHA-256: same
- record id: `0ee9cd76-93b6-4ba0-a677-e4c6c2a7cfd6`
- file id: `28a3027a-0c71-48a2-a1d9-fb533a54c1e6`
- `kfb_web_artifact_read`: inline UTF-8 content matched the written probe.

This proves the existing Production Control backend operation used by the plugin contract, not the external Claude transport.

## NOT RUN / BLOCKED

### Claude CLI validator

`claude plugin validate`: **NOT_RUN**

Reason: the `claude` CLI is unavailable in this execution environment. This is recorded once and is not treated as a product failure.

### External Claude -> Production Control MCP connection

Status: **MCP_BINDING_PENDING**

The exact externally reachable Production Control MCP URL/auth handshake is not exposed by the current ChatGPT-side tool metadata and was intentionally not guessed from the browser Site URL.

Therefore these acceptance steps are **NOT_RUN**:
- install/load the plugin in a real Claude Code/Cowork environment;
- `claude plugin validate <plugin-dir>`;
- remote MCP authentication/connection;
- fresh Claude `recover -> checkpoint -> artifact upload -> return -> fresh-session recover`.

## Current conclusion

The repository package and current backend contract are source-tested. The plugin is not yet transport-accepted in Claude.

Exactly one next gate:

**CLAUDE-PC-MCP-01 · expose or identify the exact remote Production Control MCP endpoint/auth contract, then run `claude plugin validate` and the five-step fresh-session end-to-end probe.**
