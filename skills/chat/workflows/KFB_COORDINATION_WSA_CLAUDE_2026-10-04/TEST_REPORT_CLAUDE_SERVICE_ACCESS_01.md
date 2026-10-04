# Test Report · CLAUDE_SERVICE_ACCESS_01

Status: **9/9 PASS · BUILD PASS · SITE SOURCE READY · NOT DEPLOYED**  
Date: 2026-10-05

No production secret was used, printed or persisted. Host-boundary checks used no credential or an intentionally invalid non-secret test value. Application-layer checks used fixture-only values.

## The nine binding tests

1. **PASS · unauthenticated `POST /mcp`** — the existing private host returned HTTP 401 with resource-discovery information.
2. **PASS · wrong Sites credential** — the existing private host returned HTTP 401 before any MCP tool data.
3. **PASS · missing/wrong agent key** — the application resolver returned no principal and no scope.
4. **PASS · both access layers / tool discovery** — the authorized service context maps to `claude-cowork`; MCP initialization and `tools/list` remain available behind the host boundary and expose exactly the existing 11 tools.
5. **PASS · shared KFB read without OpenAI identity** — the service path resolves only the fixed `kfb-production` scope and configured owner binding, does not create an `oai-authenticated-user-id`, and removes `createdBy` from service responses.
6. **PASS · checkpoint audit** — service writes force `claude-cowork` and persist production scope, principal, ISO time and source in `_kfbServiceAccess`; the normal history card exposes those audit facts.
7. **PASS · other scope/user and forbidden mutation protection** — alternate scope/user selectors and delete/priority/layout/order arguments are rejected; no delete/priority/layout/order tool exists.
8. **PASS · browser Control remains private** — unauthenticated `/` and `/api/control` do not return the private data surface; source still requires ChatGPT sign-in for the page and write API.
9. **PASS · existing ChatGPT/Codex path unchanged** — an `oai-authenticated-user-id` still resolves to its own owner key, keeps its requested source agent, and all reads/writes remain filtered by that owner key.

## Additional checks

- Existing Production Control invariants: **38/38 PASS**.
- Vinext production build: **PASS**, including `/mcp`, `/api/control`, Inbox and all existing pages.
- Focused lint for the changed service-access/MCP/test files: **PASS**.
- Whole-repository lint: **not green before or after this slice** because six pre-existing errors remain in briefing/navigation files outside the bounded change. No new lint error remains in the changed auth/MCP files.

## Exact candidate

- Existing Site project: `appgprj_6ab82e3950b88191a8ead3c495e21454`
- Site source parent: `67a680820949568001553f15d83675d7f5d6a2eb`
- Candidate Site source: `cfe4c7917b90acaabd3fdc36565df2051fad0faf`
- Candidate archive SHA-256: `d606e4358a5cbf4682251673ed44f76dd1ad9305d3d7098f22801861c1002150`

No Site version was saved and no deployment was created.
