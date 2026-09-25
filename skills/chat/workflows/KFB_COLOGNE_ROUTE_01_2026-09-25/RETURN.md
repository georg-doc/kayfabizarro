# RETURN · KFB Cologne Route 01 planning · 2026-09-25

## CURRENT RETURN ADDENDUM · 2026-09-26

### Final metadata checkpoint

- central `skills/chat/START_HERE.md`: updated to the Playable Track R0 → OSM execution lane;
- central `skills/chat/CHANGELOG.md`: additive 2026-09-26 entry added;
- KFB Hub source: Web Prep card = READY, Claude Design card = AFTER WEB PREP, Route 01 card updated;
- PR #216 title/body updated to the current Track R0 → OSM sequence;
- PR remains open/unmerged; no auto-merge enabled;
- exact final branch head is recorded in the PR handoff comment after this Return write, because a file cannot contain the hash of the commit that contains itself.

**Status:** TRACK-FIRST EXECUTION BRIEFS PERSISTED · NO TRACK IMPLEMENTATION YET · NO NEW STAGE/LIVE CLAIM

### New direction persisted

Georg clarified that Blender MCP is already working on the missing connector/offset track pieces and requested the next production chain for a new playable track, with OSM planned jointly but integrated after the track baseline is proven.

Current sequence:

`Blender MCP → WEB-PREP-TRACK-R0 → CLAUDE PLAYABLE-TRACK-R0 → WEB REHOME/TEST → OSM PREP → CLAUDE OSM COMPOSITION`.

This is not an architectural postponement of OSM: `OSM_SEAM_CONTRACT.md` is a required Web-prep output before Claude assembles Track R0.

### New files

- `TRACK_TO_OSM_EXECUTION_LADDER_2026-09-26.md`
- `WEBCHAT_PLAYABLE_TRACK_R0_PREP_BRIEF.md`
- `CLAUDE_DESIGN_PLAYABLE_TRACK_R0_BRIEF.md`

Updated:

- `START_HERE.md`
- `EVIDENCE_AND_GAP_MATRIX.md`
- `CHANGELOG.md`
- `RECOVERY.md`
- this `RETURN.md`
- central router/changelog/Hub metadata are updated in this same handoff.

### GitHub evidence

At the 2026-09-26 check:

- no GitHub-visible `rkit-10` branch/PR was found;
- Georg's Blender MCP work is therefore recorded as user-reported in progress, not as source-complete;
- Race PR #12 is retained as the existing continuous Hürth→Ehrenfeld OSM corridor/receiver donor;
- it is not misrepresented as the desired Hürth→Dom→Rhein→Mülheimer Brücke→SAE geography.

### Tests in this update

- new runtime tests: **0**
- new Blender tests: **0**
- new browser tests: **0**
- new Stage/public deployments: **0**

This update writes execution briefs and source-routing evidence only.

### Reserved future Stage

`https://kayfabizarro.pages.dev/kfb-hub/stage/race/playable-track-r0/`

Status: **RESERVED · NOT LIVE · NOT PUBLIC_VERIFIED**.

### Exactly one next gate

`WEB-PREP-TRACK-R0`.

The Web chat first recovers/pins the latest Blender MCP output, selects one exact existing Race runtime owner, creates `PLAYABLE_TRACK_R0.recipe.json` + `OSM_SEAM_CONTRACT.md`, and hands Claude Design a closed source pack.

---

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
