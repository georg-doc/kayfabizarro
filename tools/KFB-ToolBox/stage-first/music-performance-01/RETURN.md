# RETURN · MUSIC-PERF-01

**Date:** 2026-09-24  
**Status:** CI PASS · REVIEW CANDIDATE  
**Repo:** `georg-doc/kayfabizarro`  
**Receiving owner:** ToolBox PR #185  
**Stacked branch:** `web/music-perf-01-2026-09-24`  
**Tested head:** `d834f1d4819dc972e2f4aeeedee4c559cbe8afbd`

## Outcome

MUSIC-PERF-01 turns one real KFB song + source-backed Resident performance into a reusable synchronized scene recipe without creating a new music or animation runtime.

Delivered flow:

`ToolBox → Music → exact ORB Source Object → song clock / bar ruler → Performance recipe → Play / Scrub / Loop`

Reusable contract:

`kfb.resident-performance.v1`

Current proof recipe:

`kayfabizarros-rubbish-groove-v1`

It contains:

- `songRef`
- BPM
- phase offset
- bar offset
- performer ids
- per-performer action/choreography refs
- start / loop / finish markers
- Stage recipe
- Camera recipe

## First real performance

Song:

`Rubbish Groove 2min A extend 01.mp3`

- exact blob `368eb5ae8fafcfba1cce3ba3f80488378fe056b0`
- 100 BPM
- phase offset 0.465 s

Performance donor:

ORB-P1 v5 / PR #195

- exact GLB blob `446b044ed7c68bf877afc0f456f0aa87cc390b46`
- Leader / `bounce` / 8 beats / **Georg PASS**
- Guitarist / `strum` / 1 beat / **Georg PASS**
- Drummer / `drum` / 2 beats / **HOLD**

Source Object mode shows all three exactly as the donor supplies them.

Performance mode applies the reusable recipe and disables the unaccepted drummer without modifying the donor.

## Implementation

New lane:

`tools/KFB-ToolBox/stage-first/music-performance-01/`

Existing ToolBox coherent integration gets one additive `Music` navigation control.

Existing `motion-library.v1.js` remains the general Motion Library owner. ORB's authored embedded actions are referenced from the donor rather than copied into the catalogue.

For reliable authoring scrub, the preview transport fetches the exact MP3 once and uses one Blob-backed HTMLAudio element. This is still one song transport and does not bake sound into clips.

## Tested result

- **22/22 static/source/owner PASS**
- **29/29 Chromium playback PASS**
- syntax PASS
- run `36033971182`
- job `107749357266`
- artifact `10822609381`
- digest `sha256:0d5950361fa3ae74b90c4b3afb31a01fdc97953616a60fa371d156518e6ff69d`

Screenshots:

- Source Object
- Performance
- Mobile

See `TEST_REPORT.md`.

## Protected owners retained

- ToolBox coherent integration / roster / persistence
- Resident Atlas / Studio authoring
- Motion Library
- ORB-P1 donor
- KFB song source
- consumer audio runtimes

No second music player per Resident, no universal animation engine, no donor rebuild.

## Unresolved

- Georg has not yet reviewed this Music Performance UI/playback.
- Drummer remains HOLD; MUSIC-PERF-01 does not reopen ORB-D1.
- 8-bar working loop and camera recipe are candidate defaults.
- receiving ToolBox branch is active and must be refreshed before integration.
- public Stage has not yet been published/verified.

## One next gate

**Publish the exact tested candidate to the fixed ToolBox Music Performance Stage and ask Georg to review only:**

1. does Source Object visibly match the original ORB donor?
2. do leader + guitarist feel phase-locked to the song during play/scrub?
3. is the beat/bar ruler useful without feeling like a DAW?

No merge or broad Resident/Town integration before that gate.
