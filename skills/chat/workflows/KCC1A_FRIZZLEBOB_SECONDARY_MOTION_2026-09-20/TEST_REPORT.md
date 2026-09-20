# KCC-1A · FrizzleBob Secondary Motion Facts · TEST REPORT

**Date:** 2026-09-20  
**Branch:** `chatgpt-web/frizzlebob-secondary-motion-kcc1a-2026-09-20`  
**Exact tested source head:** `7a2a774a59d52cc4c7d48ec3997a1912652d5e11`  
**Workflow:** KCC-1A Secondary Motion Facts  
**Run:** `35529859288`  
**Status:** LOCAL TECHNICAL + BROWSER PASS · PUBLIC CLOUDFLARE NOT CLAIMED

## Result

**43 / 43 PASS**

- Node contract: **28 / 28 PASS**
- Local browser bench: **15 / 15 PASS**
- failed HTTP/resources: **0**
- page/console errors: **0**

## Node contract · 28 / 28

The exact Race presentation-hook names are accepted without creating new runtime ownership:

- `longitudinalAcceleration`
- `lateralAcceleration`
- `angularVelocity`
- `impactImpulse`
- `relativeAirflowVector`
- `speedNormalized`
- `stuntState`

Proven:

- exact output schema;
- rest motion output = zero;
- deterministic identical JSON for identical inputs;
- input object remains unmutated;
- energy/root/tip/flutter stay bounded;
- `stuntState` is cloned;
- forward airflow and reverse airflow produce opposite drag sign;
- crosswind roll is symmetric;
- airflow can energize a stationary visual actor;
- seed changes flutter phase without changing root target;
- explicit time changes flutter without hidden state;
- scalar angular velocity maps to yaw compatibility;
- vector angular velocity maps all three axes;
- impact strength clamps;
- extreme numeric inputs remain finite and bounded.

Node result emitted by the workflow:

`KCC1A_TEST_RESULT 28/28 PASS`

## Browser bench · 15 / 15

Local route under the workflow:

`http://127.0.0.1:4173/kfb-hub/stage/toolbox/frizzlebob-secondary-motion-kcc1a/`

Proven in Chromium/Playwright:

1. HTTP 200;
2. explicit `NO EAR MESH` label;
3. explicit “No placeholder ears are rendered here” scope guard;
4. canonical `race-secondary-facts.v1.js` provenance visible;
5. deterministic flutter canvas exists;
6. Rest preset: energy 0.000;
7. Rest preset: flutter amplitude 0.000;
8. Rest preset: root pitch/roll/yaw all 0.000;
9. Crosswind preset energizes the adapter;
10. Crosswind produces non-zero root roll;
11. Crosswind enables flutter;
12. output schema visible in JSON;
13. Impact preset emits impact fact 0.85;
14. no failed HTTP/resources;
15. no page/console errors.

Measured Crosswind sample from browser evidence:

- energy: `0.935732`
- airflow strength: `0.850867`
- root: pitch `0.549099`, roll `-0.46178`, yaw `-0.161115`
- tip: pitch `0.908395`, roll `-0.452911`, yaw `-0.244231`
- flutter amplitude: `0.27922`
- flutter frequency: `8.227245 Hz`

These are **presentation candidates**, not approved ear-angle values.

## Evidence artifact

Artifact ID: `10611241424`  
Name: `kcc1a-browser-evidence`  
ZIP size: `219401` bytes  
Digest: `sha256:803cee1e83d31f0a24353fb268acdc74b2a4bfbcac259efd4572340d2eb50eb4`  
Expires: 2026-10-04

Artifact files:

- `desktop.png`
- `browser.json`

## Source ownership checked

Current Race hook contract:

`kfb-hub/stunt-race/track-environment-lab/host/RACE_FLOW_RUNTIME_CONFIG.json`

Adapter:

`tools/KFB-ToolBox/kfb-rigs-embed-v3/secondary-motion/race-secondary-facts.v1.js`

Existing spring behavior remains:

`tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/actor-wobble.v1.js`

No ear geometry, KayKit skeleton, vehicle root, contact physics, input handling or gameplay state was changed.

## Public Stage

Intended future review route:

https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/frizzlebob-secondary-motion-kcc1a/

This URL is **NOT PUBLIC_VERIFIED** in KCC-1A. The earlier KCC-0 Cloudflare marker gate proved that the current public project was not serving the new Stage files from main. Do not call KCC-1A live until the exact Cloudflare revision is visibly present.

## Dropbox / Rubber recon

Dropbox title search found no 3D `eraser` / `Radiergummi` GLB/GLTF donor. Returned “rubber” hits were Rubber Duck 2D assets and a Rubber Ball POC document, so they are not admissible substitutes.

## Game Development Studio

`GAME_DEV_CLI_UNAVAILABLE`

Repository-native GitHub Actions + Playwright evidence was used.
