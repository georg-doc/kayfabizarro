# RETURN · TOOLBOX-ANIMATION-PRODUCTION-06 rebrief · 2026-09-29

Status: **REBRIEF PREPARED · SOURCE PREFLIGHT COMPLETE · NO TOOL RUNTIME CHANGE**

## Exact state

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/toolbox-animation-production-06-rebrief-2026-09-29`
- Draft PR: **#286**
- PR creation head: `775daad3a1deed841a7f7c380ea6ddfe489c6225`
- base main: `09737a8f8fd7f71c979f292322c755d0f2c2168b`
- owner: existing KFB ToolBox / Animation Studio Claude Design project
- predecessor project: **KFB ToolBox Production-05**
- new working copy: **Production-06**
- Stage: none
- merge/live: not authorized

## Outcome

The previous ToolBox/Animation mega-brief is superseded as an execution shape, not discarded as source research.

Production-06 now has four independent gates:

1. **G1:** canonical Motion Catalog + seven Locomotion Set views + reusable State Player;
2. **G2:** standard Inline Editor as an independent reusable library;
3. **G3:** shared Clay Stage / Skydome / Grounding using pinned H0/K2/T3/T4 donors;
4. **G4:** Choreography Player + shared Clay VFX, starting with Gift / Debate / Brawl.

Only **G1** is current.

## Source findings that close prior uncertainty

- Motion catalog @ `95a8197...` loads and reports version `2026-09-29b`, 345 clips, two rigs and seven locomotion sets.
- Intake-05 return loads at the same ref.
- All **16 Intake-05 GLB paths exist** at that ref. The GitHub connector's text wrapper cannot decode most binary GLBs as UTF-8, but the failure occurs after binary retrieval rather than as 404/missing path.
- H0, K2, T3 and Skydome paths were verified at `c78f6f0...`.
- T4 was verified at `939224c...`.
- Choreo Lab return exists at the Motion ref and explicitly says Gift/Argument/Brawl are storyboards/contracts, not completed animation playback.

Therefore Claude should not ask Georg whether `libs/` exists before starting G1.

## Changed files

- `START_HERE.md`
- `SOURCE.json`
- `TEST_REPORT.md`
- `CHANGELOG.md`
- `RETURN.md`

## Checks actually run

- Motion catalog: 1/1 load PASS
- Intake-05 return: 1/1 load PASS
- Intake-05 GLB path existence: **16/16**
- Clay/Skydome donor path checks: **5/5**
- Choreo return path/read: 1/1 PASS
- runtime/browser/Claude Production-06 tests: **0** in this Web rebrief slice

## Protected boundaries

No Motion Library rewrite, no Resident Atlas rebuild, no World/Track work, no WorldBuilder runtime change, no ToolBox shell replacement.

Production-05 must remain unchanged.

## Unresolved

- Claude Production-05 current editable state is not represented by a complete GitHub Session Cut in this rebrief; Claude must duplicate that live project state into Production-06 before modifying it.
- The 16/16 binary path preflight is not a Claude/browser GLTFLoader proof; G1 must run the real loader.
- G2–G4 remain HOLD and may not be pulled into G1.

## Exactly one next gate

**Claude ToolBox/Animation: G1 only — create Production-06, preserve Production-05, then implement the catalog-driven 345-clip Library View, seven locomotion-set views and reusable state player.**
