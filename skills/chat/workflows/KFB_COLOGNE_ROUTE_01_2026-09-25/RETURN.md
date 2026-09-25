# RETURN · KFB Cologne Route 01 planning · 2026-09-25

**Status:** PLAN + IMPLEMENTATION BRIEF COMPLETE · NO RUNTIME IMPLEMENTATION · NO STAGE · NO LIVE PROMOTION

## Repository / branch

- planning repo: `georg-doc/kayfabizarro`
- branch: `chat/cologne-route-01-plan-2026-09-25`
- base: `main@8504afa9d14ad46855d0c590bc30eea0fc38d15d`
- implementation owner remains: `georg-doc/KFB-Stunt-Car-Race`
- final exact branch head is returned in the PR/handoff after this Return commit is written and verified.

## Outcome

The accepted direction is now explicit and recoverable:

- Hürth → Dom → Rhein → Mülheimer Brücke → SAE is Route 01.
- Real OSM routes, authored routes and seeded/generated routes all compile into the same semantic route recipe.
- The route centre-line is the durable object.
- Surface/cross-section, edge treatment, structure and stunt modules are independent layers.
- Therefore one continuous route can be ordinary city street, open road, fenced industrial lane, elevated race track, loop branch and ordinary street again without changing movement/runtime ownership.
- A future simple editor places semantic gestures/anchors; the compiler calculates the intermediate spline, bank, grade, transitions, supports and geometry.
- Tokyo Drift is a reusable S/chicane/hairpin recipe plus Race assist profile, not a bespoke track asset.

## Files added

- `skills/chat/workflows/KFB_COLOGNE_ROUTE_01_2026-09-25/START_HERE.md`
- `skills/chat/workflows/KFB_COLOGNE_ROUTE_01_2026-09-25/CLAUDE_BLENDER_MCP_BRIEF.md`
- `skills/chat/workflows/KFB_COLOGNE_ROUTE_01_2026-09-25/EVIDENCE_AND_GAP_MATRIX.md`
- `skills/chat/workflows/KFB_COLOGNE_ROUTE_01_2026-09-25/CHANGELOG.md`
- `skills/chat/workflows/KFB_COLOGNE_ROUTE_01_2026-09-25/RECOVERY.md`
- this `RETURN.md`

## Files updated

- `skills/chat/START_HERE.md` — current router pointer;
- `skills/chat/CHANGELOG.md` — additive planning entry;
- `kfb-hub/index.html` — new Briefing/next-gate card.

## Source evidence used

Current GitHub state was reread before planning. The evidence matrix pins the observed heads for:

- kayfabizarro main;
- Race main;
- Race PRs #34–#41;
- RKIT kit guide and WSA handover;
- RKIT-03 Return;
- RKIT-08/09 stunt handover;
- Hürth OSM pilot;
- World Integration 01 Return/current state.

## Actual tests/checks

This is a planning slice, therefore:

- Blender/runtime/browser tests executed: **0**
- new Stage deployments: **0**
- new public/live claims: **0**

GitHub write discipline:

- each planning/router/Hub write was followed by exact branch-ref and intended-file readback;
- the first plan write succeeded, while the initial branch verification URL was invalid; it was treated as UNKNOWN until the exact commit, file and git ref were successfully re-read;
- no duplicate retry commit was created.

## Stage / human link

None. This slice creates no browser candidate, so no human Stage test URL is claimed.

The KFB Hub receives a planning card only.

## Unresolved

- RKIT-10 geometry is not built yet.
- Full Hürth→SAE OSM corridor is not pinned yet.
- LOOP_REAL remains geometry/metadata donor until Race drives it.
- Drift assist tuning is later Race work.
- Simple editor and seeded generator are architecture targets, not current implementation.

## Exactly one next gate

**RKIT-10 · Modular Route Adapters v1**

Use `CLAUDE_BLENDER_MCP_BRIEF.md`.

Prove the actual donors in isolation, then build:

1. CURVE_EASE / BANK_EASE;
2. OFFSET_S / CHICANE / HAIRPIN_180;
3. STREET_TO_TRACK_ADAPTER;
4. GRADE / CREST / DIP / BRIDGE_APPROACH;

and one compact street → drift → existing stunt socket/bypass → bridge approach → street recipe.

No full Cologne build before this gate.
