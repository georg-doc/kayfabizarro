# RETURN · KFB Production Control Claude Plugin · 2026-09-30

Status: **CANDIDATE · STATIC/BACKEND VERIFIED · MCP_BINDING_PENDING**

## Owner / source

- repository: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/kfb-claude-production-control-plugin-01-2026-09-30`
- Draft PR: **#299**
- base main read before closure: `852f1d945e8385cd46f36dc467766d4a9ee58acd`
- tested implementation head: `6c51df529fd8e076e2ba55b7fa4c4d0ac1d0857a`
- routing/metadata parent head: `033701c634ee29ce8e372f22519d40c061737eef`
- plugin root: `skills/chat/plugins/kfb-production-control/`
- exact final closure head: read the current PR/branch head; it is also pinned in the Production Control `RETURN` record written after this file lands.

This file cannot self-embed its own commit SHA without changing that SHA; the verified final branch head is therefore recorded externally in PR #299 metadata and the durable Production Control Return.

## Result

A private Claude plugin candidate now packages one KFB production-control protocol for:

- Claude Code / Cowork;
- Blender MCP authoring lanes;
- Claude Design handoffs;
- fresh-chat recovery;
- durable checkpoints;
- complete session-cut intake.

The plugin keeps current KFB owner boundaries. It does not become a game/runtime SSOT, movement/physics/camera owner, GitHub merge owner or Cloudflare deployment owner.

The remote Production Control MCP binding is configurable through required plugin user config. The browser Site URL is **not** silently assumed to be the MCP endpoint.

## Files changed in this slice

Plugin:
1. `.claude-plugin/plugin.json`
2. `.mcp.json`
3. `README.md`
4. `skills/control/SKILL.md`
5. `skills/recover/SKILL.md`
6. `skills/checkin/SKILL.md`
7. `skills/session-cut/SKILL.md`
8. `TEST_REPORT.md`
9. `CHANGELOG.md`
10. `SOURCE.json`
11. `RETURN.md`

Shared routing:
12. `skills/chat/START_HERE.md`
13. `skills/chat/REGISTRY.json`
14. `skills/chat/CHANGELOG.md`

## Actual tests / evidence

- static/source checks: **26/26 PASS**;
- implementation files fetched from exact branch: **7/7 PASS**;
- routing metadata files fetched after write with expected markers: **5/5 PASS**;
- Production Control backend artifact save/read/SHA probe: **PASS**;
  - 113 bytes;
  - SHA-256 `9d1001c260ed511d37be3b6fbc3e44c67a05fb0448932ee704fa6e46f6f0af54`;
  - record `0ee9cd76-93b6-4ba0-a677-e4c6c2a7cfd6`;
  - file `28a3027a-0c71-48a2-a1d9-fb533a54c1e6`.
- `claude plugin validate`: **NOT_RUN · CLAUDE_CLI_UNAVAILABLE** in this Web executor.
- external Claude -> Production Control MCP authentication/connection: **NOT_RUN · MCP_BINDING_PENDING**.

## Stage / Hub / human evidence

- Stage URL: **NOT_APPLICABLE / NOT CREATED**.
- Cloudflare: **NO CHANGE**.
- KFB Hub card: **NO CHANGE REQUIRED**. This slice currently has no meaningful human product decision or public acceptance surface; creating a card/Stage route would manufacture a pseudo-human gate.
- screenshots/browser proof: **NOT APPLICABLE** for the current transport-only gate.
- human acceptance: **NOT REQUESTED / NOT CLAIMED**.
- no merge or Live promotion performed.

## Unresolved

One blocker only:

**The exact externally reachable KFB Production Control remote MCP endpoint and authentication contract are not yet exposed/identified for Claude.**

The current ChatGPT-side Production Control tools prove the backend semantics, but that is not proof that Claude can connect to the same server externally.

## Exactly one next gate

**CLAUDE-PC-MCP-01**

Expose or identify the exact Production Control remote MCP endpoint/auth contract, then in a real Claude environment:

1. load/install this plugin;
2. run `claude plugin validate`;
3. verify `/mcp` connection/auth;
4. execute `recover -> checkpoint -> artifact upload -> RETURN`;
5. start a fresh session and recover the same owner/head/next gate from durable state.

No redesign, no second persistence system and no Stage/Live work before this gate passes.


## Endpoint discovery probe · 2026-09-30

Additional evidence after the initial Return:

- ChatGPT app permissions resolve `asdk_app_sites_dc4cf548624c8191b2cf51f4c2ee854e` as **KFB Production Control**.
- Plugin Creator inspection of that id fails with `TypeMismatchError: expected Plugin, got AppsSDKApp`. Therefore the existing control plane is an Apps SDK/Site app, not an editable Plugin Creator package whose server config can be read through that interface.
- Direct web discovery for the Site root, `/mcp`, `/.well-known/oauth-protected-resource` and `/.well-known/oauth-authorization-server` is unavailable from the current web executor.
- A repository-runtime HTTP probe cannot resolve the `chatgpt.site` hostname from this sandbox, so it cannot establish the endpoint independently.

Conclusion: **MCP_BINDING_PENDING is confirmed as a backend/exposure gate, not a missing Claude plugin file.** No endpoint or auth scheme was guessed.
