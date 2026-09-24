# TEST REPORT · KFB Production Architecture v3 · 2026-09-24

Status: **31/31 CONTRACT CHECKS PASS**

Scope: architecture, self-service production strands, source locks and Hub briefing definitions. No product runtime, Cloudflare deployment or visual product acceptance is claimed.

## Structure / catalog

1. `INPUT_LOCKS.json` parses as `kfb.production-architecture.v3-input-locks/2`.
2. `HUB_BRIEFING_CATALOG.json` parses as `kfb.hub-briefing-catalog/2`.
3. Five production strands exist: ToolBox, Animation/Residents, WorldBuilder, Racer/World, Quick Review.
4. Nineteen copy-ready job cards exist.
5. At least eight current jobs are immediately READY.
6. Every HOLD card names its exact dependency.
7. 19/19 normal jobs do not require Cloudflare.
8. 19/19 normal jobs do not require Work/WSA.
9. Every briefing source set resolves to an input-lock job or strand.
10. Every Hub job has a matching copy-ready prompt in `SELF_SERVICE_BRIEFINGS.md` or `STRAND_BRIEFINGS.md`.
11. WorldBuilder status separates `sourceHead`, `prHead`, `deployHead`.
12. WB-W0 review route is direct `https://kayfabizarro.pages.dev/…`.

## Product-intent preservation

13. Independent left/right EyeRig editing is explicitly recorded as a real missing capability rather than falsely claimed as existing.
14. Resident Atlas Bone-Posing + `studio-patch.json` is retained as the Pose Studio donor.
15. Motion roadmap contains phase alignment / timeScale / hysteresis rather than hard Shift Walk→Run switching.
16. Racer→World bridge and reusable Race Visual Module are explicitly represented.
17. Top-level Chat router still points to Production Architecture v3.
18. Fractal editing distinguishes owner-specific operations for bones, EyeRig eyes and world props.
19. Pose-before-Blender rule is explicit: static corrections stay in browser tools when possible.

## Current source-head validation

20. EyeRig PR #104 = `e277c3456651d314a01adea046e0105d2a12cdd1`.
21. KayKit creator/KCL PR #107 = `fc49a336af57adb6317b74211b3318d004d96de5`.
22. Motion Lab PR #127 = `7c8cc218ec46dabb20409c9e0b5368afcf5845c6`.
23. ToolBox integration PR #185 = `2833674b36be707fa4d14c8b532faee78ef3ba28`.
24. Shared editor PR #186 = `7267185cdbdc60e576b946ee589f0b2e932c8c8b`.
25. WB2 PR #190 = `5a98e674184ea4694a5ad7d696d8cc84c1618bdf`.
26. Blender MCP proof PR #192 = `b49fb6e1adde070d658e1cc21dadb3294164cb29`.
27. Orc Warband PR #195 = `9dda7957a33e69926265c1e3a69028a4b35b26f0`.
28. Motion Library PR #197 = `bf0eace2332a48f0b220318ad7567c68cc6dfbad`.
29. WB-W0 PR #203 = `40fe2c10959a2022694a2342482e04dd34cbe7be`.
30. Private Racer PR #33 = `71e7051b2eea1ad731912b634f44ce5ba0218736`.
31. Resident Atlas source pin remains `10f661a542e2553b4d3433bfc5b45dfc1401e660`.

## Deliberately not tested

- HUB-CTRL PR #202 consumption of the expanded v3 catalog;
- public Hub publication;
- product runtime behavior of the future jobs;
- cleanup/closure of historical open PRs.

Those are separate integration/product actions and are not required to prove that the complete production strands are internally defined and recoverable.
