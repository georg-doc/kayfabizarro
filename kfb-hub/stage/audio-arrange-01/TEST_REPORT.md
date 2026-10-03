# AUDIO-ARRANGE-01 DONOR REBASE · TEST REPORT

**Status:** PASS · PUBLIC STAGE PENDING  
**Tested head:** `3d85d7e2aa103ab0bb2b388c678584d9ece19484`  
**Run / job:** `37093077519 / 111117349198`

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

**24/24 PASS**

Proves:
- one AudioContext;
- real MP3 decode;
- 2 masters + 8 stems;
- stems all exactly 214.128 s;
- zero duration spread;
- exact sample-synchronous scheduling for reconstruction and arrangement;
- Cyclical master/stem timeline compatibility;
- fixed form gain map;
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

Artifact:
- ID `11262876991`
- size 307,312 bytes
- digest `sha256:e08c061ac8f580d469b07586c52dd8c52db3fa94dc191e3f77d71f951077df19`
- contains `results.json` + desktop screenshot.

## Not proven

Automation cannot decide:
- whether stem reconstruction sounds perceptually identical enough to the master;
- whether KFB ARRANGE improves or harms musicality;
- whether Cyclical Warmth is the preferred aesthetic donor versus Loping Groove;
- whether any future generated Suno donor should be stemmed.

Those are human listening decisions.

## Next gate

Public exact-route A/B listening only.
