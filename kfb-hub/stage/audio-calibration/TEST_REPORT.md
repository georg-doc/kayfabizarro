# AUDIO-CAL-01 · TEST REPORT

**Date:** 2026-09-24  
**Status:** CI PASS · BROWSER/WEBAUDIO PASS · HUMAN LISTENING PENDING  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `web/kfb-audio-soundscape-baseline-2026-09-24`  
**Tested head:** `7013f43a0501c824deb2c5541c1971c2b979a4e6`

## GitHub Actions

- Workflow: `AUDIO-CAL-01 branch QA`
- Run: `36024697531`
- Job: `107718140193`
- Conclusion: **SUCCESS**
- Environment: Ubuntu 24.04 · Node 22.23.2 · Playwright 1.51.1 · Chromium 134

## Manifest / catalog validation

Validator: `tools/audio/validate-audio-manifests.mjs`

**6 / 6 report groups PASS · 0 failures**

| Group | Result |
|---|---:|
| shared `Audio/sfx.json` | **13 / 13** paths exist |
| repaired `Audio/ui-sfx.json` | **16 / 16** paths exist |
| `Audio/jukebox.json` | **1 / 1** path exists |
| `Sounds/jukebox.json` | **10 / 10** paths exist |
| AUDIO-CAL-01 `SOURCE.json` | **11 / 11** asset paths exist |
| shared audio catalog | **1 / 1** exact count match |

Catalog truth in the tested checkout:

- total audio files: **1732**
- `Audio/`: **1687**
- `Sounds/`: **45**

## Browser / WebAudio validation

`kfb-hub/stage/audio-calibration/qa.mjs`

**31 / 31 PASS**

The browser proof covers:

- exact `AUDIO-CAL-01-v1` source marker;
- one exported calibration runtime;
- exactly three named scene controls;
- explicit user-started Web Audio;
- exactly **one AudioContext**;
- AudioContext reaches `running`;
- three persistent reference loops;
- ten decoded reference buffers;
- no asset/decode load errors;
- diegetic music timeline advances;
- Ring/Performance foreground music state;
- voice-focus ducking of music;
- voice-focus ducking of ambience;
- **music timeline continues while ducked**;
- duck release restores the mix;
- impact, crowd, cascade, storm-calibration and vehicle events all fire;
- Graveyard/Night keeps music near-silent while wind remains present;
- desktop viewport fits;
- mobile viewport fits;
- mobile scene controls stack correctly;
- no page/console errors;
- no failed HTTP asset requests.

## Proof artifact

- Artifact: `audio-cal-01-proof`
- Artifact ID: `10819176933`
- Files: **3**
  - `results.json`
  - desktop screenshot
  - mobile screenshot
- Size: **500781 bytes**
- Digest: `sha256:05b9776cc3d501a77360e6ee6660278e1137fb793756aa3a817cb555e2c91012`
- Retention through: 2026-10-08

## Evidence boundary

This PASS proves source integrity, WebAudio lifecycle, decode/playback, scene-state changes, semantic event wiring, ducking behavior and the fact that music keeps progressing under voice focus.

It does **not** prove:

- that a particular browser TTS voice sounds like FrizzleBob;
- that the speech/music/SFX balance is aesthetically correct;
- that the procedural storm accent is an accepted thunder asset;
- that one applause file is a sufficient sustained crowd bed;
- human listening acceptance on laptop, phone or headphones.

Those remain the AUDIO-CAL-01 human listening gate.


## Public Cloudflare verification

**Status: PUBLIC_VERIFIED · HUMAN LISTENING PENDING**

Publication:
- `cloudflare-live@a8e2af8f79f33b51f638222f203a28f3e1c15b23`
- Cloudflare Pages check `107727186186`: **SUCCESS**
- deploy completion: 2026-09-24T16:26:22Z
- preview deployment id: `15173f7d`

Exact-route proof:
- URL: `https://kayfabizarro.pages.dev/kfb-hub/stage/audio-calibration/`
- workflow: `36025670884`, attempt 3
- job: `107731456493`
- result: **31/31 PASS**
- artifact: `10819978496`
- digest: `sha256:49ef9b156efadaced6d257f8768ba553a780a443a6bd13666014781e7a2fd3c2`
- proof files: `results.json` + desktop screenshot + mobile screenshot

Attempts 1–2 are retained as publication timing evidence; both ended before Cloudflare reported the `a8e2af8f…` deployment successful. No runtime repair was required.

Automated public PASS is not sonic acceptance. Browser TTS voice identity and the subjective mix remain Georg's human listening gate.
