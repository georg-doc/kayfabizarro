# AUDIO-STEM-BED-02 · RECOVERY

**Status:** R2 HUMAN_ACCEPTED  
**Owner:** KFB Audio & Soundscape Baseline v1  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/audio-stem-bed-02-mood-pool-2026-10-03`  
**Draft PR:** #346  
**Stage:** `https://kayfabizarro.pages.dev/kfb-hub/stage/audio-stem-bed-02/`

Resume here.

## Last proven runtime/public state

- proof head: `9433a901a83c043b2c5de235d65394facd8f9846`;
- donor census: **14/14 PASS**;
- exact source validator: **100/100 PASS**;
- Chromium/WebAudio: **18/18 PASS**;
- exact public Stage: **18/18 PASS**;
- five donors / **44 runtime stems**;
- public Stage source: `cloudflare-live@9d541e79fa7dc10ef5b80ce08b8d3b25d9d1e327`;
- direct Hub link source: `cloudflare-live@26bb3926bde5a2e1e519409d182a62b654cfba71`;
- combined public Stage + Hub proof: run `37132531736` / job `111230330130` / artifact `11277367768`.

## Architecture

Authored Suno performances are Ground Truth. KFB selects one donor family and controls phase-locked stem gains / Night filtering only.

Do not introduce:
- note generation;
- phrase slicing;
- time-stretch;
- pitched cross-song stem mixing;
- a second AudioContext/runtime owner;
- local Travel/Race/Combat gameplay truth.

Vocal separation residuals stay excluded.

## Signature-theme status

`BEETLE RUMBLE` authoring brief exists in `KFB_SIGNATURE_THEME_SUNO_PROMPT_v1.md`.

No generated master or stem package is accepted yet.

## Failure recovery · legacy Hub source sync

The AUDIO runtime did **not** fail. Only the optional attempt to mirror the new card into the older branch-side `kfb-hub/index.html` source failed at an object-boundary splice.

Two repair attempts on the same gate were reached:

1. metadata commit `257f9b45d426d989dd8eb34e5857f49c86580e99` inserted the card with the previous object's closing brace displaced;
2. repair commit `4700cefdb436ae90fa1f1167fca37bc8727d6259` moved that boundary but duplicated the next opening brace.

Per recovery policy, no third repair is attempted. The branch-side legacy Hub file is restored to the last known-good pre-sync version from `9433a901a83c043b2c5de235d65394facd8f9846`.

Full export:
- `FAILURE_RECOVERY_HUB_SOURCE_SYNC.md`
- `FAILURE_RECOVERY_EXPORT.json`

The **current public Hub is unaffected** and is verified at `https://kayfabizarro.pages.dev/kfb-hub/stage/hub-ui-v2/` with the exact direct Stage link.

## R1 diagnosis · NOT PROMOTED

Repair head `3163bc68f7cfcaf357702c16025d044c905a29cc` restored all 50 available stems and changed neutral stem gains to unity.

Branch QA run `37135022508`:
- exact source/syntax steps: PASS;
- browser diagnosis: **FAIL at 39 checks**;
- artifact: `11278097681`;
- digest: `sha256:5a40710bb6bd4bd6ca8f62be47932d5e36c7048fbab1aa280fbfda465159fcad`.

The failure was diagnostic: sample-level master↔MP3-stem correlation is not a reliable certification metric, and the Buant all-stem result did not beat the old weighted result under that metric. R1 is therefore **not published** and is not treated as the musical fix.

Architecture pivot for repair pass 2:
- original uploaded masters are Ground Truth for the four new donors;
- `Cyclical Warmth` alone keeps the previously heard stem-adaptive path;
- Awe / Buant / Dorian / Stalking run MASTER-SAFE until each stem family is individually listening-certified;
- their stems remain available as source/donor material, not active replacement mixes.

## Unresolved / deferred

- human listening across all five mood donors;
- signature-theme generation/selection and later stem export;
- Deck/weather/Race/Combat semantic integration;
- any harmonic analysis needed before future cross-song techniques.

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

**Exactly one next gate:** `KFB_SIGNATURE_THEME_GENERATION_01` — test Buant Groove first: MASTER REFERENCE vs PLAY GAME BED must preserve the original song identity; then spot-check Awe / Dorian / Stalking and the retained Cyclical stem path.

## HUMAN LISTENING RESULT · R2 PASS · 2026-10-03

Georg reviewed the repaired public R2 and accepted it: **“das hört sich jetzt alles besser an, können wir so nehmen.”**

Interpretation:
- R2 is **HUMAN_ACCEPTED** for the current five-donor music-bed architecture;
- the earlier v0.1 HUMAN FAIL remains retained as historical evidence;
- `Cyclical Warmth` stays the only currently stem-certified donor;
- Awe / Buant / Dorian / Stalking remain master-safe; their stems stay source inventory until separately certified;
- no automatic merge or consumer integration is implied.

Exactly one next gate:
**KFB_SIGNATURE_THEME_GENERATION_01** — generate and audition the new signature-theme master from the v2 Suno prompt before pulling stems.

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

**GEORG_AUDIO_STEM_BED_02** — listen to the direct Stage and judge emotional fit + retained musicality.

No merge or broad integration before that result.
