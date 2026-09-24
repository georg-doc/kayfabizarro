# TEST REPORT · KFB Production Architecture v3 · 2026-09-24

Status: **20/20 CONTRACT CHECKS PASS**

Scope: architecture/job-card consistency only. No product runtime, Cloudflare deployment or visual product acceptance is claimed.

## Checks

1. `INPUT_LOCKS.json` parses.
2. `HUB_BRIEFING_CATALOG.json` parses.
3. Four self-service input locks exist.
4. Four Hub briefing cards exist.
5. Every briefing `inputLock` resolves.
6. Every Hub bucket is one of READY / RUNNING / REVIEW / HOLD / DONE.
7. 4/4 prepared jobs mark Cloudflare as not required for the normal production loop.
8. 4/4 prepared jobs mark Work/WSA as not required.
9. WorldBuilder status distinguishes `sourceHead`, `prHead`, `deployHead`.
10. WorldBuilder public gate uses a direct `kayfabizarro.pages.dev` URL.
11. Architecture defines separate PRODUCTION / REVIEW / RECOVERY modes.
12. Self-service document contains all four jobs A–D.
13. Top-level Chat router points to Production Architecture v3.
14. ToolBox PR #185 lock matches current head `2833674b36be707fa4d14c8b532faee78ef3ba28`.
15. Blender MCP proof PR #192 lock matches current head `b49fb6e1adde070d658e1cc21dadb3294164cb29`.
16. Orc Warband PR #195 lock matches current head `9dda7957a33e69926265c1e3a69028a4b35b26f0`.
17. Motion Library PR #197 lock matches current head `bf0eace2332a48f0b220318ad7567c68cc6dfbad`.
18. WB-W0 PR #203 lock matches current head `40fe2c10959a2022694a2342482e04dd34cbe7be`.
19. WB2 PR #190 lock matches current head `5a98e674184ea4694a5ad7d696d8cc84c1618bdf`.
20. Shared editor PR #186 lock matches current head `7267185cdbdc60e576b946ee589f0b2e932c8c8b`.

## Deliberately not tested

- current HUB-CTRL PR #202 UI consumption of the new briefing catalog;
- Cloudflare publication;
- product behavior of ToolBox / Blender outputs / WorldBuilder;
- cleanup/closure of the existing open PR backlog.

Those are not required to prove the architecture/job definitions are internally coherent.
