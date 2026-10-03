# AUDIO-STEM-BED-02 · TEST REPORT

**Date:** 2026-10-03  
**Last proven runtime/public head:** `9433a901a83c043b2c5de235d65394facd8f9846`

## Donor census

Run `37130168026` · job `111223533180`: **14/14 PASS**.

## Exact source validation

**100/100 PASS**.

Coverage:
- build marker;
- five donor definitions;
- per-donor runtime stem-count / no-vocal-residual assertions;
- exact existence and size checks for all **44 runtime stem files**.

The same 44 source files were checked on `cloudflare-live` against `SOURCE.json`: matching SHA and size.

## Branch Chromium / WebAudio

Run `37131569261` · job `111227557364`: **18/18 PASS**.

Coverage includes:
- build/runtime export;
- all five donor definitions;
- every donor loads and starts all of its stems sample-synchronously;
- Activity changes the expected rhythmic target;
- Voice Focus ducks keyboard more strongly than bass;
- zero page errors;
- zero HTTP errors;
- zero external requests.

Artifact:
- `11276942436`
- `sha256:ffe70cc10635cdd942dd83cf0c7936dfdd3d545d844764434da653046d9e1410`

## Exact public Cloudflare Stage

Route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/audio-stem-bed-02/`

First proof run `37131286308`: **FAIL during publication window**.

Unchanged retry:
- run `37131567389`
- job `111227551183`
- **18/18 PASS**
- artifact `11276703064`
- digest `sha256:cc9c6ce56367086b6d69f2dd257eb3807f3d7f049ed6f48d12fabee68ce9cea0`

The failed first public run is retained as deployment timing evidence and is not counted as a code repair pass.

## Hub link

Publication source now contains an absolute direct Stage URL at:
`cloudflare-live@26bb3926bde5a2e1e519409d182a62b654cfba71`.

The public-proof workflow is extended in the metadata checkpoint to verify the public Hub carries the exact AUDIO-STEM-BED-02 card + direct URL. Record that follow-up run here after it completes.

## Human evidence

Not yet accepted. Automated audio execution cannot substitute for Georg's listening judgment.

**Next gate:** `GEORG_AUDIO_STEM_BED_02`.
