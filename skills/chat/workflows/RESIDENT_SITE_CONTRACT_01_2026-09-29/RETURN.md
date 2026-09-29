# RETURN · RESIDENT-SITE-CONTRACT-01 · 2026-09-29

Status: **REBRIEF PREPARED · NO RUNTIME CHANGE · CLAUDE RESIDENT/SCENERY OWNER**

## Exact state

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/resident-site-contract-01-2026-09-29`
- base main: `09737a8f8fd7f71c979f292322c755d0f2c2168b`
- owner: existing Resident Atlas / Resident Scenery Claude Design project
- Stage: none
- merge/live: not authorized

## Outcome

The Resident/Scenery project is rebriefed around one bounded result:

**extract the current Graveyard as the first terrain-aware Site Module without making Resident Atlas a second WorldBuilder.**

The brief preserves the correct owner split:

- Actor consumes host contact/ground;
- Site Module declares placement/terrain requirements;
- WorldBuilder remains sole terrain deformation owner.

## Current runtime delta classification

The following is preserved as **USER_REPORTED_NOT_YET_IN_GITHUB_SESSION_CUT** and must be checkpointed by Claude before further implementation:

- ~50 fps at 1280×720;
- ground correction applied every render frame while expensive measurement stays throttled;
- ~4 mm hysteresis to suppress support-foot height flutter;
- Band/Disco private grounds disabled in favour of one host ground;
- host terrain lowered beneath Graveyard floor so the open grave remains open.

No repository-level performance PASS is claimed yet.

## Files

- `START_HERE.md` — complete Claude Resident/Scenery rebrief
- `SOURCE.json` — exact routing/source facts and classification
- `CHANGELOG.md`
- `RETURN.md`

## Checks actually performed

Documentation/source reconciliation only:

- current KFB router/workflow/proportionality/review rules read;
- current Resident Atlas Session Cut lineage read;
- current S40 host-ground convention read;
- current WorldBuilder Terrain-First routing read;
- exact main base re-read before branch creation;
- every write read back from the named branch.

Runtime/browser/performance tests: **0** in this Web rebrief slice.

## Protected boundaries

No change to WorldBuilder terrain/save/reload, OSM/Cologne seam, Race/Track, Travel/TinySkies, Motion Library, Scene Patch or Asset Librarian.

## Unresolved

- the ~50 fps/current grounding build still needs a complete Claude Session Cut;
- actual draw calls, triangles, DPR/renderScale and shadow budget for that build are not yet durable;
- `kfb.site-placement/0.1-candidate` field names remain candidate until existing Scene Patch/World Recipe fields are checked for reuse;
- no WorldBuilder consumer has been implemented.

## Exactly one next gate

**Claude Resident/Scenery: first checkpoint the current good performance/grounding state, then extract RESIDENT-SITE-CONTRACT-01 and validate it against the three internal synthetic terrain fixtures.**

WorldBuilder consumption remains the later separate `WORLD-SITE-CONSUMER-01` Web slice.
