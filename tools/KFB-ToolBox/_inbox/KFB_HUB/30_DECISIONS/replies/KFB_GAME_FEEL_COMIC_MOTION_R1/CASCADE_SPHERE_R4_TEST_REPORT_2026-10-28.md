# Cascade Sphere / Prototype Factory Maze R4 — Source, contract and fixture QA
**2026-10-28. Documentation and pure graph-validation only.**

## Exactly what was done
- Added and fetched back four files on the existing WS0 Game Design Draft PR #435 branch:
  1. `CASCADE_SPHERE_R4_INTEGRATION_BLUEPRINT_2026-10-28.md` (event reducer, asset/game/owner boundaries, WFC optional algorithm, acceptance).
  2. `CASCADE_SPHERE_R4_MODULE_CONTRACT_CANDIDATE_2026-10-28.json` (7 candidate adapters, event vocabulary/dedupe, WFC tiles/constraints, no new owner).
  3. `CASCADE_SPHERE_R4_LEVEL_FIXTURES_2026-10-28.json` (three explicit directed graphs with source candidates, sockets, owner-bound action effects, expected routes and waves).
  4. `CASCADE_SPHERE_R4_WORK_INTEGRATION_BRIEF_2026-10-28.md` (Work handoff roles/phases and 18 future independent verification cases F-01…F-18).
- JSON parse **2/2** (module contract and three-fixture set).
- Actually evaluated **32/32 source-text/editorial/typed-contract invariants PASS**: source/owner preservation, stop guard, WFC bounded opt-in/fallback, distinct Goo/damage/Ink, Combat/Audio/World authority, D6/q103 caution, Qiva separation, exact three fixtures, 18 Work test cases and one WS0 asset/fixture gate.
- **Pure fixture graph check: 3/3 PASS.** One directed BFS implementation was executed privately over the literal committed fixture content, applying the explicitly listed action edge deltas and checking node/edge validity, empty initial route, exact post-action path and repeated deterministic route:
  - L01 `spawn→junction→north→goal` after `switch-north`.
  - L02 `spawn→junction→repairBay→goal` after `shoot-corrupt-shell` + `repair-conduit`.
  - L03 `spawn→junction→roof→goal` after `activate-roof`.
  These checks show planned graph reachability and action deltas only, **NOT** packet physics, player contact, live Combat events, actual model loading, WFC generation, packet arrival counts or the full game.
- Did not add a new global rules/asset/procedural SSOT. The JSON schemas are design candidates and the fixture level coordinates schematic; source sizing/physics/APIs still require actual WS0/WS1 intake.

## Tests NOT run
- Full event reducer/packet-wave simulator/dedupe/rewind/save/load, Node/Vitest automated repository tests: **0**.
- Existing WS1/WS1b host assembly, real Mech movement/Combat, functional switches, physical colliders, GLTF decode/material/visual source isolation: **0**.
- Runtime WFC contradiction/fallback, OSM geo normalization in target game, sphere/portal entry, sound, actual Card/Quest, desktop/mobile real input, GPU p50/p95, screenshots, browser, CI, Site, Cloudflare Stage or Live: **0**.
- No purchased source/binary pack transfer. The prior R3 verified Dropbox links/CC0 remain past independent source facts; not rerun here.

## Known blockers and explicit deferrals
- Current active private WS1b head/API and true Combat HitEvent + Save + Input/Audio/Asset consumer port, visually verified 5–8 original source assets and platformer FREE/EXTRA hashed intake.
- One meaningful L01 player choice must be playtested in context, not derived from the route vector.
- q103 color rule, proper optional Card/Quest semantics, mobile support and asset pinning open at WS0.
- Mech axe/grapple, city-scale OSM/WFC, multi-wave complexity and full Mindscape world are optional later proof scopes.

## Next gate
**WS0_PLATFORMER_ASSET_INTAKE_AND_L01_SOURCE_GATE** — source/license/hash + actual isolated donor render and pin active WS1b receiver; choose a single L01 physical one-switch/two-route one-wave fixture. Then separately authorize a Work/WS1 integration along R4's C0 → C1 → C2 → C3 sequence. Do not auto-merge/live.
