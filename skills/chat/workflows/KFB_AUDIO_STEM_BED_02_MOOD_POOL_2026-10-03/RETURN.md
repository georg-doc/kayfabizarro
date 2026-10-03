# AUDIO-STEM-BED-02 · RETURN

**Date:** 2026-10-03  
**Status:** R2 PUBLIC_VERIFIED · HUMAN RETEST PENDING  
**Repo / branch / PR:** `georg-doc/kayfabizarro` · `chatgpt-web/audio-stem-bed-02-mood-pool-2026-10-03` · Draft PR #346

## Result

The adaptive Suno-stem proof now has five authored mood families instead of one:

- Neutral · Cyclical Warmth · 76 BPM · 8 stems
- Awe · Awe Before Drama · 82 BPM · 9 stems
- Sunshine · Buant Groove · 105 BPM · 8 stems
- Grief · Dorian Rests · 66 BPM · 10 stems
- Boss · Stalking Groove · 107 BPM · 9 stems

**44 runtime stems total.**

The runtime preserves one AudioContext and starts each selected donor's stem family phase-locked. Controls remain Activity / Road-Lift / Night / Voice Focus. Vocal residual stems are excluded.

## Evidence

- donor census: **14/14 PASS**;
- exact source validation: **100/100 PASS**;
- current-head Chromium/WebAudio: **18/18 PASS**;
- exact public Cloudflare Stage: **18/18 PASS**;
- last proven runtime/public head: `9433a901a83c043b2c5de235d65394facd8f9846`;
- branch proof: run `37131569261` / job `111227557364` / artifact `11276942436`;
- public proof: run `37131567389` / job `111227551183` / artifact `11276703064`;
- public route: `https://kayfabizarro.pages.dev/kfb-hub/stage/audio-stem-bed-02/`.

## Public Hub proof

Run `37132531736` / job `111230330130`:
- Stage browser/WebAudio: **18/18 PASS**;
- Hub HTTP: **200**;
- Mood Pool card: **present**;
- direct `https://kayfabizarro.pages.dev/kfb-hub/stage/audio-stem-bed-02/` URL: **present**;
- artifact `11277367768`;
- digest `sha256:1d2e0616148e232af0f9cd36f695245de86fc1656196399d3c6f9a9d88b3770c`.

The optional mirror into legacy branch source `kfb-hub/index.html` was rolled back after two failed boundary repairs. This does not affect the verified current public Hub (`hub-ui-v2`). See `FAILURE_RECOVERY_HUB_SOURCE_SYNC.md`.

## Signature theme

`BEETLE RUMBLE` is prepared as a separate KFB signature-theme Suno authoring brief. This slice does not claim generated signature audio.

## Retained boundaries

No note generator, phrase slicer, time-stretcher, cross-song pitched stem mixer, consumer gameplay writer, auto-merge or Live promotion was added.

## Unresolved

Human listening remains the product acceptance gap. Signature-theme audio and consumer semantics are deferred until after that. The abandoned legacy-Hub source mirror is documented separately and is not the current public Hub owner.

## R2 repair · PUBLIC_VERIFIED · HUMAN RETEST PENDING

R2 deliberately stops generalizing the Cyclical stem recipe to every song.

Runtime policy:
- **Cyclical Warmth** — `stem-certified`; retains the already-heard AUDIO-STEM-BED-01 adaptive stem path.
- **Awe Before Drama** — `master-safe`.
- **Buant Groove** — `master-safe`.
- **Dorian Rests** — `master-safe`.
- **Stalking Groove** — `master-safe`.

For the four new donors, the actual game bed is now the byte-identical uploaded **original master**. Their 42 source stems remain in the donor library but are not decoded or used at runtime until each donor passes its own listening certification.

Adaptive controls on MASTER-SAFE donors are bounded master-level processing only:
- Activity: small presence change;
- Road-Lift: small low-shelf/presence lift;
- Night: bounded low-pass/presence change;
- Voice Focus: global master duck.

### Evidence

Final R2 branch head before metadata close:
`9555fd0e45edb99804bb9b477f662b210723d308`

Branch:
- run `37135402751`
- job `111238803148`
- **31/31 PASS**
- Buant snapshot: `runtimePolicy=master-safe`, `mode=master-safe`, `starts=1`, `loadedStemCount=0`, `masterLoaded=true`
- artifact `11278327849`
- digest `sha256:6abdd70abe4df4a1ede81bd25d90ab9600942dca39ed34f96780d0bc7ef2a0d1`

Publication:
- `cloudflare-live@b2c9521c446db334f36797d7aa94482c09495fb8`
- exact original master blobs for Awe / Buant / Dorian / Stalking copied from `main` and SHA-verified.

Public:
- run `37135399619`
- job `111238793524`
- attempts 1–2: deployment window, R2 marker not yet visible
- attempt 3: **31/31 PASS**
- public Hub: HTTP **200**, card present, direct Stage URL present
- artifact `11278332936`
- digest `sha256:d9bd422d6285168aaa480baa36ee454ca5e87a8bac9e8bfa9b3ff2a34f3483c0`

Direct retest:
`https://kayfabizarro.pages.dev/kfb-hub/stage/audio-stem-bed-02/`

The previous human FAIL remains valid for the superseded v0.1 stem-pool mix. R2 is a repair candidate, **not yet HUMAN_ACCEPTED**.

**Exactly one next gate:** `GEORG_AUDIO_STEM_BED_02_R2` — test Buant Groove first: MASTER REFERENCE vs PLAY GAME BED must preserve the original song identity; then spot-check Awe / Dorian / Stalking and the retained Cyclical stem path.

## HUMAN LISTENING RESULT · FAIL · 2026-10-03

Georg rejected AUDIO-STEM-BED-02 after listening to the public Stage.

Observed failure:
- **Buant Groove is not recognizably preserved**;
- result sounds **slow/lame and buggy**;
- audible output is dominated by **plopping / sparse transients**;
- the original melody / musical identity is effectively missing.

This overrides all previous `PUBLIC_VERIFIED · HUMAN LISTENING PENDING` product status. Automated 100/100 source and 18/18 browser checks proved execution only; they did **not** prove musical fidelity.

Immediate technical suspicion to verify:
- Buant Groove's Suno stem package contains `0 Lead Vocals.mp3` and `1 Backing Vocals.mp3` even though the donor is intended as instrumental;
- those two residuals were excluded from the runtime pool;
- Suno stem separation may have classified important lead/melodic instrumental content into those residual channels;
- the runtime mix also attenuates several melodic/color stems strongly, so even a complete stem set may not reconstruct the master at the default weights.

No consumer integration, merge or Live promotion is allowed from this candidate.

**Exactly one next gate:** `AUDIO-STEM-BED-02-R1_MASTER_RECONSTRUCTION` — prove Buant Groove MASTER vs ALL-STEMS unity reconstruction vs current weighted mix and identify the missing musical content before any remix repair.

## Previous gate (superseded)

**GEORG_AUDIO_STEM_BED_02**.
