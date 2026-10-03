# AUDIO-STEM-BED-02 · RECOVERY

**Status:** PUBLIC_VERIFIED · HUMAN LISTENING PENDING  
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

## Unresolved / deferred

- human listening across all five mood donors;
- signature-theme generation/selection and later stem export;
- Deck/weather/Race/Combat semantic integration;
- any harmonic analysis needed before future cross-song techniques.

## Exactly one next gate

**GEORG_AUDIO_STEM_BED_02** — listen to the direct Stage and judge emotional fit + retained musicality.

No merge or broad integration before that result.
