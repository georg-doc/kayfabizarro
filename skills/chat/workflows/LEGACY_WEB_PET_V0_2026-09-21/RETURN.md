# KFB Legacy Web Pet v0 · RETURN

**Date:** 2026-09-21  
**Owner:** KFB ToolBox / Legacy Web Pet presentation adapter  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/legacy-web-pet-v0-2026-09-21`  
**Tested runtime head:** `f41c59a8178bf77266c0f776f2e20a7948ee6223`  
**Status:** WEB/HUB CANDIDATE PASS · MV3 BUILD PASS · EXTENSION INJECTION GATE FROZEN AFTER TWO ATTEMPTS

## Outcome built

One shared Legacy-pet presentation runtime now exists for two hosts:

1. KFB Hub / ordinary web-page embed;
2. Chrome MV3 extension.

The shared runtime uses the proven Rig_Legacy assembly path and real KayKit source assets. No second rig or animation owner was created.

### Web pet

- default character: Rogue;
- walk/run/idle/hop across the bottom viewport;
- real Three.js shadow map + `ShadowMaterial`;
- home/camp at bottom-right;
- exact Orc Warband banner;
- two hostname-stable Warband props chosen from Sword / Shield / HammerAxe;
- left-click → random real Legacy action + small 3D VFX burst + user-gesture WebAudio SFX;
- right-click pet/camp → compact character selector;
- character choices: Rogue / Knight / Mage / Barbarian;
- camp click → return home;
- full overlay remains pointer-transparent except measured pet/camp hitboxes.

### KFB Hub integration candidate

The branch `kfb-hub/index.html` loads:

`/kfb-hub/shared/legacy-web-pet/hub-mount.js`

by default.

`?pet=0` disables the pet.

This is **branch-only**. It has not been merged or published to the canonical Hub.

### Chrome extension candidate

Manifest V3 source exists under:

`extensions/kfb-legacy-web-pet/`

The extension executes bundled local JavaScript only. Three.js and the shared pet runtime are bundled by esbuild. Remote network access is limited to exact pinned GLTF/GLB assets on `raw.githubusercontent.com`.

LLM chat is deliberately deferred.

## Exact source pins

Dungeon characters:
`eb48f50489b9e4903ec1e3d2fb1837605ce7d792`

Rig_Legacy + Orc Warband props:
`10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0`

Camp GLBs:
- `orc_banner.gltf.glb`
- `orc_sword.gltf.glb`
- `orc_shield.gltf.glb`
- `orc_hammerAxe.gltf.glb`

The vendored `legacy-rig-adapter.v1.js` matches the proven donor Git blob:

`41ba111d264cb73f2b3fbd70370dbb0ba042c91d`

## Tested result

Authoritative run:
`35553968462`

Job:
`106193863972`

### Static/source contracts

**15/15 PASS**

Includes:
- MV3;
- arbitrary-site content-script target;
- no remote executable JS in extension frame;
- exact pins;
- exact Warband sources;
- real Legacy animation names;
- real 3D shadow path;
- click VFX;
- context-menu settings;
- user-gesture SFX;
- page pointer pass-through;
- exact vendored rig donor identity.

### Shared Web / Hub WebGL proof

**12/12 PASS**

Observed:
- HTTP 200;
- pet ready;
- default Rogue;
- camp props `hammeraxe,sword`;
- two distinct camp props;
- host present;
- click triggered real Legacy `HeavyAttack`;
- right-click settings visible;
- changed character to Mage;
- normal page link remained usable;
- 0 failed resources;
- 0 page/console errors.

The proof generated a full-page Web screenshot plus JSON evidence before the extension gate.

### MV3 build

**PASS**

The source bundles successfully to an unpacked-extension `dist/` candidate.

### Chrome extension arbitrary-page proof

**FROZEN FAIL**

Attempt 1:
- run `35553680781`;
- plain page HTTP PASS;
- verified no Hub pet script was present;
- timed out waiting 120 s for extension-injected `ready`.

Repair pass:
- changed only the Playwright launch to explicit bundled Chromium channel;
- runtime unchanged.

Attempt 2:
- run `35553968462`;
- plain page HTTP PASS;
- verified no Hub pet script was present;
- same 120 s timeout before extension-injected `ready`.

No evidence currently distinguishes:
- extension/content-script did not load;
- content script loaded but failed before creating the frame;
- frame was created but failed before reporting ready.

Therefore no third implementation guess is made in this slice.

## Evidence artifact

Run 4 artifact:
`10619267683`

Digest:
`sha256:da9bdfa9e0dd03c83f4335e61963449b7d559fc91e892867dd2c98843f361bf3`

The upload contains the successful web proof evidence. Extension ZIP packaging was skipped because the extension proof failed.

## Public deployment

Intended review route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/legacy-web-pet/`

**NOT PUBLISHED · NOT PUBLIC_VERIFIED.**

The canonical KFB Hub was not modified.

## Unresolved

- extension-load stage not observable yet;
- no validated installable ZIP artifact yet;
- no public Cloudflare Stage;
- no human visual review;
- no LLM chat.

## Exactly one next gate

**LWP-EXT-F1 · extension-load observability**

Fresh bounded diagnostic slice only:

1. make content-script entry observable immediately, before pet startup;
2. prove extension content script loaded on the plain test page;
3. prove whether the extension iframe is created;
4. capture first iframe boot/error/CSP state;
5. stop there.

Do not change Legacy animation, Web-pet behavior, camp, Hub integration or add LLM chat until this gate identifies the failing layer.
