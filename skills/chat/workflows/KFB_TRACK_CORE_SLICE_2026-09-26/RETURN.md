# RETURN · KFB Track Core planning · 2026-09-26

**Status:** PLAN COMPLETE · NO IMPLEMENTATION · NO STAGE · NO LIVE

## Defects / open first
- **Census incomplete:** four track-geometry branches in Race, and the physics collider path, are not read yet. That is the first gate.
- **Language decision open:** the core has to exist once, and JS vs. Python is still undecided. JS is recommended because editor and game are web. Georg decides.
- **RKIT-11 is frozen, not accepted:** its bridge, loop, hop and transition are an acceptance test for the core, not kit canon.
- **Hub card not added:** `kfb-hub/index.html` is a generated file (see the 24.09 incident), so no hand-edited Hub card was added. WSA adds the card through the Production Desk config if wanted.

## Repository / branch
- `georg-doc/kayfabizarro`, branch `georg-doc-patch-2` (web-upload branch name; the intended name was chat/track-core-slice-plan-2026-09-26), stacked on PR #216 (`chat/cologne-route-01-plan-2026-09-25`).
- Companion candidate: Race branch `chat/rkit-11-rhein-run-2026-09-26`, stacked on Race PR #41.

## Files
- added: `skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/{START_HERE,EVIDENCE,CHANGELOG,RETURN}.md`

## Outcome
Georg's rule is now recoverable: **one base track, everything else is pieces**. There are no parallel track systems and no per-case fixes. Transitions are interpolations of one slot profile, and markings are their own layer. The recipe from #216 stays the single truth.

## Tests
0 (planning).

## Exactly one next gate
**TRACK-CORE-0 · Census + core contract** (see `START_HERE.md` §8).
