# KCC-1A · FrizzleBob Secondary Motion Facts · RETURN

**Date:** 2026-09-20  
**Repo:** `georg-doc/kayfabizarro`  
**Owner:** KFB ToolBox / Character compatibility  
**Branch:** `chatgpt-web/frizzlebob-secondary-motion-kcc1a-2026-09-20`  
**Stacked Draft PR:** #148  
**Base:** KCC-0 branch / Draft PR #147  
**Exact tested source head:** `7a2a774a59d52cc4c7d48ec3997a1912652d5e11`  
**Status:** LOCAL CONTRACT + BROWSER PASS · PUBLIC CLOUDFLARE BLOCKED  
**Intended Stage route:** https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/frizzlebob-secondary-motion-kcc1a/

## Outcome

KCC-1A prepares FrizzleBob ear dangle/flutter for Race **without touching the ear mesh**.

It adds one pure adapter:

`sampleRaceSecondaryFacts(facts, options)`

Source:

`tools/KFB-ToolBox/kfb-rigs-embed-v3/secondary-motion/race-secondary-facts.v1.js`

The adapter consumes only the current Race presentation hooks:

- `longitudinalAcceleration`
- `lateralAcceleration`
- `angularVelocity`
- `impactImpulse`
- `relativeAirflowVector`
- `speedNormalized`
- `stuntState`

and returns bounded, dimensionless root/tip/flutter facts.

## Ownership preserved

KCC-1A owns only presentation normalization.

Still owned elsewhere:

- Race: vehicle root/world movement, contact physics, gameplay/input;
- Motion Lab: KayKit motion profiles;
- existing FrizzleBob graft: head/face attachment;
- `actor-wobble.v1.js`: existing secondary spring behavior;
- future KCC-1B ear adapter: actual mesh-specific angle/deformation limits.

No hidden clock, random source, velocity integration, position integration or second physics owner was added.

## Evidence

Workflow run:
`35529859288`

Result:
**43 / 43 PASS**

- Node contract: 28/28
- local Chromium/Playwright bench: 15/15
- failed HTTP/resources: 0
- page/console errors: 0

Evidence artifact:

- ID: `10611241424`
- name: `kcc1a-browser-evidence`
- digest: `sha256:803cee1e83d31f0a24353fb268acdc74b2a4bfbcac259efd4572340d2eb50eb4`
- files: `desktop.png`, `browser.json`

Full report:
`skills/chat/workflows/KCC1A_FRIZZLEBOB_SECONDARY_MOTION_2026-09-20/TEST_REPORT.md`

## HTML review bench

Branch source:

`kfb-hub/stage/toolbox/frizzlebob-secondary-motion-kcc1a/`

The bench provides:

- Rest / Cruise / Crosswind / Brake / Impact presets;
- current Race signal sliders;
- normalized energy/airflow facts;
- root + tip target facts;
- deterministic flutter amplitude/value/frequency;
- deterministic flutter trace;
- live output JSON;
- explicit `NO EAR MESH` and no-placeholder scope guard.

This is intentionally a facts/tuning bench, not a fake visual ear demo.

## Public Stage status

The intended Cloudflare route is **not accepted as public evidence**.

KCC-0 public proof run `35528646651` showed that Cloudflare returned the root KFB page instead of the exact new Stage `SOURCE.json`. Therefore KCC-1A was not copied into main/public Stage and no “live” claim is made.

## Dropbox sanity

- The 2026-09-20 Cologne copy of `KFB_ANIMATION_LAB_v2_FRIZZLEBOB_GRAFT_BRIEFING.md` is text-identical to the previously inspected copy.
- No 3D Eraser/Radiergummi GLB/GLTF source was found.
- Rubber Duck 2D assets and the Rubber Ball POC are not accepted substitutes.

## Game Development Studio

`GAME_DEV_CLI_UNAVAILABLE`

Repository-native GitHub Actions + Playwright evidence used.

## Changed files in KCC-1A

1. `.github/workflows/kcc1a-secondary-motion-test.yml`
2. `skills/chat/workflows/KCC1A_FRIZZLEBOB_SECONDARY_MOTION_2026-09-20/START_HERE.md`
3. `skills/chat/workflows/KCC1A_FRIZZLEBOB_SECONDARY_MOTION_2026-09-20/TEST_REPORT.md`
4. `tools/KFB-ToolBox/kfb-rigs-embed-v3/secondary-motion/race-secondary-facts.v1.js`
5. `tools/KFB-ToolBox/kfb-rigs-embed-v3/secondary-motion/race-secondary-facts.v1.test.mjs`
6. `kfb-hub/stage/toolbox/frizzlebob-secondary-motion-kcc1a/index.html`
7. `kfb-hub/stage/toolbox/frizzlebob-secondary-motion-kcc1a/bench.mjs`
8. `kfb-hub/stage/toolbox/frizzlebob-secondary-motion-kcc1a/local-proof.mjs`

## Unresolved

- no replacement ear donor has been visually approved;
- current `ears.v2` remains the active geometry/behavior path;
- Cloudflare Stage publication remains an infrastructure blocker;
- Rubber/Eraser 3D source remains missing.

## One next gate

**KCC-1B · Ear Source Isolation + Choice**

Before integration:

1. render the current `FrizzleBob_Yellow.gltf` ears alone as the baseline;
2. render at least one real alternative donor alone;
3. measure base width, length, thickness, orientation and available deformation topology;
4. compare front / side / ¾;
5. Georg chooses the source/shape.

A repository candidate to inspect — **not yet approved and not assumed suitable** — is:
`media/3D_Assets/quaternius_cc0-bald-rabbit-1274.glb`.

Only after source acceptance may KCC-1B attach the chosen geometry to the measured FrizzleBob head host and map KCC-1A facts through the existing spring behavior.
