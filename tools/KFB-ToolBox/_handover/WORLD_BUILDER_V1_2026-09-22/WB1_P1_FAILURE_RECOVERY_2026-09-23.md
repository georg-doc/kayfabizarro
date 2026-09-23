# WB1-P1 · Failure Recovery Export · 2026-09-23

Status: **CANDIDATE PRESERVED · BROWSER TEST TRANSPORT BLOCKED AFTER TWO PASSES**

## Exact state to resume

- Repository: `georg-doc/kayfabizarro`
- Branch: `chatgpt-web/world-builder-p1-environment-profile-2026-09-23`
- Base main used for the candidate: `fa5275ff2d881461f57bcfcaac45e4155e2862d9`
- P0 reconciliation checkpoint: `b5bb97c0bc2181287019d640009b939758b9e53c`
- P1 implementation checkpoint: `bbf9a8ead0750dcb69be68d4d1a2a7136bd25ceb`
- Candidate folder: `tools/KFB-ToolBox/world-building-preflight/environment-profile/`
- Schema: `kfb.environment-profile/1`
- Required first marker: `SOURCE OBJECT RENDERED · ENVIRONMENT PROOF UNLOCKED`

## What is preserved

The implementation checkpoint contains:
- standalone behavior/config core;
- environment rig with six-light nearest-source pool;
- WhackMan source flicker/falloff/fog/world-light values;
- separate local-visibility light;
- separate reversible MaterialProfileRef;
- real KayKit mounted-torch source object;
- real KayKit wall sample;
- owner-derived flame measurement;
- source-object-first proof mode;
- Portable Preview launch/stop scripts;
- static tests.

Repository-native result: **8/8 PASS** plus **4/4 module syntax checks PASS**.

## Failure gate

Required browser/visible proof could not run because the execution environment blocked Chromium
navigation before any application bytes loaded.

Attempt 1:
- target: `http://127.0.0.1:4176/`
- result: `net::ERR_BLOCKED_BY_ADMINISTRATOR`

Attempt 2:
- target: intercepted `https://wb1p1.test/index.html`
- result: `net::ERR_BLOCKED_BY_ADMINISTRATOR`

No third repair pass was attempted.

## What has NOT been established

Do not claim any of the following yet:
- source torch visibly rendered;
- zero browser-console errors;
- WebGL/GLTF runtime success;
- interactive DAY/DUSK, torch, local visibility or material controls verified;
- screenshot evidence;
- P1 complete;
- Stage/Public/Live status.

## Resume procedure

1. Use the exact branch/head above; do not rebuild the candidate from memory.
2. Serve `environment-profile/` over local HTTP as documented in `LOCAL_PREVIEW.md`.
3. First observe **SOURCE TORCH** alone. Confirm it is the real `torch_mounted.gltf`, not a substitute.
4. Confirm marker `SOURCE OBJECT RENDERED · ENVIRONMENT PROOF UNLOCKED`.
5. Switch to **ENVIRONMENT** only after step 4.
6. Verify:
   - DUSK global fog remains `FogExp2 0.019`;
   - active pool is never above 6;
   - multiple torch lights flicker asynchronously;
   - Local Visibility 0→1 changes local illumination without replacing fog/world light;
   - SOURCE → MATTE CANDIDATE → SOURCE is visually/reported reversible;
   - console errors = 0.
7. Capture one source-object isolation screenshot and one integrated environment screenshot if practical.
8. Update TEST_REPORT/RETURN only after those observations.
9. Do not start WB1-P2 until this gate passes.

## Public boundary

No Cloudflare Stage was created or requested in WB1-P1. No public URL is an acceptance surface for this
candidate.

## Exactly one next gate

**WB1-P1 Browser Verify.**
