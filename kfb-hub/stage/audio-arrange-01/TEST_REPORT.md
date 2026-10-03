# AUDIO-ARRANGE-01 DONOR REBASE · TEST REPORT

**Status:** PUBLIC_VERIFIED · HUMAN A/B PENDING  
**Tested head:** `e7e55078208a031207a67299d54015f67aa78a29`  
**Run / job:** `37093867717 / 111119683066`

## Source validation

**29/29 PASS**

Proves:
- build/source markers;
- 76 BPM / 4/4 / 64-bar contract;
- two exact masters;
- eight exact stem files;
- exact byte sizes;
- eight fixed form sections.

## Chromium / WebAudio

**25/25 PASS**

Proves:
- one AudioContext;
- real MP3 decode;
- 2 masters + 8 stems;
- stems all exactly 214.128 s;
- zero duration spread;
- exact sample-synchronous scheduling for reconstruction and arrangement;
- Cyclical master/stem timeline compatibility;
- fixed form gain map;
- A/B mode gain calibration;
- SPACE reduced;
- PSY wet path increased;
- no page/console errors;
- no HTTP failures;
- no external runtime requests.

## Decoded audio measurements

| source | duration s | onset s | rms | peak |
|---|---:|---:|---:|---:|
| Cyclical master | 213.200 | 0.08 | 0.15970 | 0.60613 |
| Loping master | 204.000 | 0.04 | 0.14616 | 0.59465 |
| Drums | 214.128 | 0.48 | 0.10225 | 0.53565 |
| Bass | 214.128 | 0.48 | 0.07265 | 0.32057 |
| Guitar | 214.128 | 0.12 | 0.02355 | 0.28175 |
| Keyboard | 214.128 | 0.12 | 0.06275 | 0.44469 |
| Percussion | 214.128 | 1.26 | 0.00259 | 0.12592 |
| Strings | 214.128 | 76.32 | 0.00329 | 0.08129 |
| Synth | 214.128 | 0.56 | 0.03997 | 0.23535 |
| Brass | 214.128 | 70.56 | 0.01399 | 0.22194 |

## Evidence

Source artifact:
- ID `11263208942`
- digest `sha256:b22361501dc0db8ab08d773a5e73b6d3e721ea82e9d3589c27bad6ae8c4b0a22`
- contains `results.json` + desktop screenshot.

## Public exact-route proof

- Stage: `https://kayfabizarro.pages.dev/kfb-hub/stage/audio-arrange-01/`
- publication: `cloudflare-live@9761d68b83da0e8c091fe22e9edbb8d00054a9c7`
- Cloudflare Pages check `111120414788`: **SUCCESS**
- public run/job: `37094037185 / 111120175674`
- exact public Chromium/WebAudio: **25/25 PASS**
- passed on retry attempt 3
- artifact: `11262928219`
- digest: `sha256:d8dbdff3eb862d23402cdc3dd90670ef68388712651c3bc53dd3ca3d7024de3c`
- external runtime requests: **0**

## Not proven

Automation cannot decide:
- whether stem reconstruction sounds perceptually identical enough to the master;
- whether KFB ARRANGE improves or harms musicality;
- whether Cyclical Warmth is the preferred aesthetic donor versus Loping Groove;
- whether any future generated Suno donor should be stemmed.

Those are human listening decisions.

## Next gate

**GEORG_AUDIO_ARRANGE_AB_01** — human musical A/B only.
