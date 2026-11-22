# The Invisible Handshake · R0.3 Static Design Test Report · 2026-11-17

**Status:** DESIGN DATA / CONSTRUCTED EXAMPLE CHECKS ONLY. No human playtesting, no game runtime, no UI/Stage, no new print masters, no independent critic signoff. Existing R0 `TEST_REPORT_R0.md` continues to govern the R0 prototype tests; no retrospective upgrades.

**Owner:** `games/invisible-handshake/` · **branch:** `design/invisible-handshake-paper-r0-2026-11-17` · **PR #475**.
**Target:** `POWER_SPHERES_KAYFABE_BIZARRO_R03_2026-11-17.md`.

## Checks actually executed
In a JavaScript reader of the exact GitHub R0.3 source on the owner branch:

| Check | Result |
|---|---|
| Parse 30 N01–N30 candidate institution rows | PASS · 30 |
| Unique institution names within candidate grid | PASS · 30 distinct |
| Unique thematic sphere labels | PASS · 6 |
| Directed SUPPLIES → NEEDS pairs five times each | PASS · 6/6 |
| Fixed 56-slot arithmetic (6+30+12+8) | PASS |
| All pair labels use only RESOURCES/RULES/INFLUENCE | PASS |
| Re-score constructed three-sphere POACH example under unchanged R0 scoring | PASS · A 9→4; B 4→9 |
| Source explicitly marks no human playtest | PASS |

**8/8 structural assertions**. The scoring example is a **constructed state calculation, not a playtest**. Costs from unchanged R0 rule: attacker 1 FAVOR; defender single 1 FAVOR VETO opportunity. One such successful POACH can swing relative points by **10** (+5 B, −5 A), so balance is **UNRESOLVED / high-risk** even though arithmetic passes. Does not demonstrate six-player pacing or final-session competitiveness.

## Research inspection and source limitations
- Directly read the current R0.2 and R0 source from PR #475, Research Atlas game brief on PR #394 and existing KFB MKULTRA/Monarch `BRIEF.md`, `CARDWAY_IDEAS.md`, `SOCIETAL_PSYCHOLOGY_ADDENDUM_2026-10-16.md`, `RETURN.md` on its read-only donor branch.
- External web reads: TikTok USDS official January 2026 JV description (15% Oracle / Silver Lake / MGX each, ByteDance 19.9%); Nvidia August 2026 compute finance announcement and SEC filing; November 2026 Reuters/AP **allegations** of a honeytrap investigation, not confirmed compromise; NATO ACT cognitive warfare concept; Stanford philosophical entries; Michael Hartmann 2025 essay. Source URLs and tier boundaries are in R0.3 design file. No source asserts a secret organization controls all six spheres.
- No original card/PDF asset was isolated or visually integrated. R0.3 is text-only systems ideation; no claim of donor visual reuse.

## Boundaries and one next gate
- No further deck expansion, no new card art, no new numerical resources, no KFB owner movement or existing runtime changes.
- **Next gate:** physical 12-proxy-card first-play selecting actors across all six spheres and testing the 9→4 / 4→9 POACH swing, one veto, and dual Kayfabe/Bizarro readings. Only after that meaningful human test decide KEEP/TUNE/FAIL and whether to update PDF print masters.
