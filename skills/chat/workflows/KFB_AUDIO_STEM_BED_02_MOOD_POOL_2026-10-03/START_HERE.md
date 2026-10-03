# AUDIO-STEM-BED-02 · START HERE

**Status:** R2 HUMAN_ACCEPTED  
**Date:** 2026-10-03  
**Owner:** KFB Audio & Soundscape Baseline v1  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/audio-stem-bed-02-mood-pool-2026-10-03`  
**Draft PR:** #346  
**Public Stage:** `https://kayfabizarro.pages.dev/kfb-hub/stage/audio-stem-bed-02/`

## Goal

Extend the validated adaptive Suno-stem technique from one neutral donor to a small emotional gameplay pool without inventing a replacement music engine.

**Authored Suno performance → per-donor phase-locked stems → KFB runtime weighting.**

No note generation, phrase slicing, time-stretching or pitched stem mixing between songs.

## Runtime donor pool

| Mood | Donor | BPM | Runtime stems |
|---|---|---:|---:|
| Neutral | Cyclical Warmth | 76 | 8 |
| Awe / Revelation | Awe Before Drama | 82 | 9 |
| Sunshine / Festival | Buant Groove | 105 | 8 |
| Grief / Loss | Dorian Rests | 66 | 10 |
| Dark / Boss Combat | Stalking Groove | 107 | 9 |

**Total:** 44 runtime stems.

Vocal separation residuals in Buant Groove, Dorian Rests and Stalking Groove are intentionally excluded.

## Controls

- **Activity**
- **Road-Lift**
- **Night**
- **Voice Focus**

One AudioContext remains owner. A selected donor starts all of its stems at one shared AudioContext time; donor switching stops the previous family and loads the next family on its own authored timeline.

## Proven evidence

Last proven runtime/public-proof head before closure metadata:
`9433a901a83c043b2c5de235d65394facd8f9846`

- Emotional donor census: **14/14 PASS** · run `37130168026` · job `111223533180`.
- Exact source validator: **100/100 PASS**.
- Current-head Chromium/WebAudio: **18/18 PASS** · run `37131569261` · job `111227557364`.
- Branch proof artifact: `11276942436` · `sha256:ffe70cc10635cdd942dd83cf0c7936dfdd3d545d844764434da653046d9e1410`.
- Exact Cloudflare Stage: **18/18 PASS** · run `37131567389` · job `111227551183`.
- Public proof artifact: `11276703064` · `sha256:cc9c6ce56367086b6d69f2dd257eb3807f3d7f049ed6f48d12fabee68ce9cea0`.
- Stage publication source: `cloudflare-live@9d541e79fa7dc10ef5b80ce08b8d3b25d9d1e327`.
- Hub direct-link fix: `cloudflare-live@26bb3926bde5a2e1e519409d182a62b654cfba71`.

The first public proof run `37131286308` failed during the publication window; the unchanged retry passed after the Stage became available. It is retained as deployment-timing evidence, not reclassified as a runtime defect.

## Latest public Stage + Hub proof

Workflow run `37132531736` / job `111230330130` proved both acceptance surfaces in one run:

- exact Stage: **18/18 PASS**;
- public Hub: HTTP **200**;
- AUDIO-STEM-BED-02 card present: **true**;
- exact direct Stage URL present in public Hub: **true**;
- public proof artifact: `11277367768`;
- digest: `sha256:1d2e0616148e232af0f9cd36f695245de86fc1656196399d3c6f9a9d88b3770c`.

Hub route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/hub-ui-v2/`

## Signature identity

`KFB_SIGNATURE_THEME_SUNO_PROMPT_v1.md` defines **BEETLE RUMBLE** as a separate reusable KFB signature-theme authoring target.

Current state: **PROMPT ONLY**. No signature-theme master/stems are promoted by this slice.

## Protected boundaries

- Audio & Soundscape Baseline remains the shared coordination owner.
- Travel / Race / Combat retain gameplay and runtime truth.
- No cross-song harmonic compatibility is assumed.
- No real Deck/weather/Race telemetry integration is added.
- No automatic merge or Live promotion.
- Legacy `kfb-hub/index.html` source sync was abandoned after two failed boundary-repair attempts and rolled back; the current public Hub owner is `kfb-hub/stage/hub-ui-v2/index.html` on `cloudflare-live`, which is publicly verified.

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

**GEORG_AUDIO_STEM_BED_02**

Listen across Neutral / Awe / Sunshine / Grief / Boss and the retained presets.

Decision question:

**Do the five authored donor families give useful emotional/gameplay range while the runtime controls remain musical rather than sounding like a generic remix?**
