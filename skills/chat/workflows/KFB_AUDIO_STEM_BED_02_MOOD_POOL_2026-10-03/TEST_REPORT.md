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

## Combined public Stage + Hub proof

After the Hub direct-link workflow check was added:

- run `37132531736`
- job `111230330130`
- conclusion: **SUCCESS**
- exact Stage QA: **18/18 PASS**
- Hub URL: `https://kayfabizarro.pages.dev/kfb-hub/stage/hub-ui-v2/`
- Hub HTTP: **200**
- `audio-stem-bed-02-2026-10-03` card present: **true**
- exact Stage URL present: **true**
- artifact: `11277367768`
- digest: `sha256:1d2e0616148e232af0f9cd36f695245de86fc1656196399d3c6f9a9d88b3770c`

This is the current public acceptance-surface proof.

## Legacy Hub source-sync recovery

The public Hub itself passed. A separate optional attempt to mirror the card into the older branch-side `kfb-hub/index.html` source hit two object-boundary repair failures and was stopped under the two-pass rule. That file is restored to its pre-attempt valid content. Evidence and salvage map are in `FAILURE_RECOVERY_HUB_SOURCE_SYNC.md`.

## Human evidence

Not yet accepted. Automated audio execution cannot substitute for Georg's listening judgment.

**Next gate:** `GEORG_AUDIO_STEM_BED_02`.

## R2 master-ground-truth repair

### Final branch head

- head `9555fd0e45edb99804bb9b477f662b210723d308`
- run `37135402751`
- job `111238803148`
- **31/31 PASS**
- artifact `11278327849`
- digest `sha256:6abdd70abe4df4a1ede81bd25d90ab9600942dca39ed34f96780d0bc7ef2a0d1`

Buant Groove proof:
- original master loaded: **true**;
- runtime policy: `master-safe`;
- active game-bed sources: **1**;
- loaded stem sources: **0**;
- errors: **0**.

This proves R2 cannot reproduce the rejected Buant stem-remix path.

### Public R2

- publication: `cloudflare-live@b2c9521c446db334f36797d7aa94482c09495fb8`;
- exact Stage: `https://kayfabizarro.pages.dev/kfb-hub/stage/audio-stem-bed-02/`;
- run `37135399619` / job `111238793524`;
- attempts 1–2 saw the pre-deployment page;
- unchanged attempt 3: **31/31 PASS**;
- public Hub: HTTP 200 / card present / direct URL present;
- artifact `11278332936`;
- digest `sha256:d9bd422d6285168aaa480baa36ee454ca5e87a8bac9e8bfa9b3ff2a34f3483c0`.

Automated proof establishes source/runtime/publication identity. Musical acceptance remains Georg's listening gate.
