# TEST REPORT · TOOLBOX-ANIMATION-PRODUCTION-06 rebrief preflight

Date: 2026-09-29  
Runtime/product tests: **0** — this Web slice only corrects the Claude execution brief.

## Source/path checks actually run

### Motion Library v5

At exact ref `95a8197c76c2bae4d12bfc867d54debe15ffc1f2`:

- catalog loaded: **1/1 PASS**
- catalog version: `2026-09-29b`
- catalog clipCount: **345**
- rigs: Rig_Medium + Rig_Large
- `locomotionSets`: **7**
- Intake 05 return loaded: **1/1 PASS**
- Intake-05 GLB paths checked: **16/16 EXIST**

Binary caveat: the GitHub connector's text-file wrapper successfully returned file metadata for two GLBs and hit `UnicodeDecodeError` after retrieving binary bytes for the others. No path returned 404. This is evidence that the files exist at the pin, **not** evidence that Claude's runtime loader has decoded them. G1 must run that real loader check.

### Clay / World presentation donors

Exact path checks:

- H0 @ `c78f6f0...`: **PASS**
- K2 @ `c78f6f0...`: **PASS**
- T3 @ `c78f6f0...`: **PASS**
- Skydome @ `c78f6f0...`: **PASS**
- T4 @ `939224c...`: **PASS**

Total: **5/5 donor path checks PASS**.

### Choreography evidence

`CHOREO_LAB_01_RETURN.md` exists at the Motion ref and explicitly reports Gift / Argument / Brawl as six-moment storyboards/contracts, not a fluid animation player. G4 therefore starts from evidence, not from a false playback PASS.

## Result

The former preflight question "does `libs/` really exist?" is closed enough to start G1. Do not spend Georg/Claude budget on asking for another location.

No claim is made that all 345 clips are already playable inside Production-06. That is G1's job.
