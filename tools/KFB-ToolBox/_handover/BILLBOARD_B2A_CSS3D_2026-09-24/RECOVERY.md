# RECOVERY · Billboard B2a CSS3D · 2026-09-24

Status: **HUMAN_ACCEPTED · FRONT-ONLY FIX VERIFIED · B2B RESEARCH NEXT**
Owner: **KFB ToolBox / Billboard Media Residency**
Branch: `chatgpt-web/billboard-b2a-css3d-2026-09-24`
Draft PR: **#199**
Recovered public-proof head before recovery-doc checkpoint: `bed7f74e5bca3efb51a7eb3ab12819ad4a46af09`
Base: accepted B1 `78f09f5e9b28b606a121bda1b43dcd8c8aff5f1a`
Final tested runtime head: `89065825448846beb2649082fc0c1bf25df20ccb`
Final Cloudflare publication commit: `983929385c3be74a42ec88c29f601c08b90b5a05`
Direct review route: https://kayfabizarro.pages.dev/kfb-hub/pruefen/billboard-b2a/

Read after context loss:
1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/session-entry-use-what-works_v1.md`
5. `tools/KFB-ToolBox/_handover/BILLBOARD_MEDIA_LIVING_2026-09-24.md`
6. this file
7. `RETURN.md` and `TEST_REPORT.md`
8. exact PR #199 state/head

## Timeout recovery

The previous chat/tool turn ended during the public-stage handoff. Per KFB rules this was treated as **UNKNOWN**, not success.

GitHub inspection now proves:
- the metadata/evidence commit `ffbe4a1a401011d8b6cff075b2e4d1c32557f79f` exists;
- the Cloudflare wrapper was published on `cloudflare-live` at `be24c154889fb96c20e99ef2b86dd2ced44007be`;
- PR #199 advanced to `bed7f74e5bca3efb51a7eb3ab12819ad4a46af09` with the public-proof workflow;
- the exact B2a `SOURCE.json` marker reached Cloudflare;
- public browser job `107486764345` completed **SUCCESS**;
- public checks: **22/22 PASS**, 0 page errors, 0 tracked HTTP errors;
- public artifact: `10789313140`.

Conclusion: **the writes were present; no duplicate retry is needed.**

## Protected sources

- B0 `bb-scene.js` blob `235b062f9d575a49a4c98d8be57d04d43acc2213` unchanged.
- B0 `bb0-boot.js` blob `57392b87c0344648695e1ef6d62f6f70a9dd942b` unchanged.
- Accepted B1 `bb1-boot.js` blob `1326f4117f9c605d778b2a54352ca7e8b723deba` copied unchanged as reference.
- B2a adds only the CSS3D inline-video seam.

## Proven sequence

### Donor isolation
Official Three.js r160 donor:
`mrdoob/three.js@d04539a76736ff500cae883d6a38b3dd8643c548/examples/css3d_youtube.html`

Run `35951854457` / job `107481888424`: **9/9 PASS**.

### Integration
First integration candidate `7bed45398820b6bc629b24e0580866d697642946`: **26/28 + visual fail** because hidden CSS3D DOM still blacked CARD/SLOGAN.

Repair pass **1/2** moved visibility to `CSS3DObject.visible`.

Verified integration run `35952766940` / job `107484912203`: **27/27 PASS**, 0 page errors, 0 tracked first-party/CDN HTTP failures.

### Public Cloudflare
Run `35953227597` / public job `107486764345`: **22/22 PASS**, 0 page errors, 0 tracked HTTP errors.

Public proof verifies:
- quarter retained;
- cover retained;
- real YouTube iframe inline on the 3D billboard;
- iframe directly receives pointer events;
- exact 16:9/world dimensions;
- 3/4 camera perspective moves with the billboard;
- mode exit unloads iframe to `about:blank`;
- slogan retained;
- no modal player.

## Deferred / not started

- B2b Living Mockup / Collage surface: planned only.
- B2c Talking City Lights / KFB face: planned only.
- B3 cartoon / Elastic-Toon billboard body: deferred.
- Curtain C1: HOLD.

## Exactly one next gate

**Georg reviews B2a on the direct Cloudflare route and decides PASS/TUNE for inline YouTube.**


## 2026-09-25 · human rear-side tune · CLOSED

Georg accepted the inline-video direction but identified one remaining visual defect: the CSS3D YouTube plane rotated through the side and was mirrored on the rear instead of revealing the normal billboard backside. He then explicitly asked ChatGPT to build/fix/check it in.

### Attempt 1 · CSS backface rule only · FAIL
- head `ba7043d46cffc642d9a13be1b515b31e2192c86c`;
- run `36066418717`, job `107857553235`;
- **28/29**;
- artifact `10836446767`;
- `backface-visibility:hidden` computed correctly, but the cross-origin iframe still won the rear hit-test and remained visibly mirrored.

### Repair pass 1 · panel-normal hemisphere cull · PASS
- runtime head `89065825448846beb2649082fc0c1bf25df20ccb`;
- CSS backface rule retained as defense-in-depth;
- CSS3DObject visibility is now additionally owned by the accepted panel world normal vs camera direction;
- front hemisphere: iframe visible/clickable;
- rear hemisphere: CSS3DObject hidden, leaving the original Kenney/WebGL billboard backside visible.

Integration:
- run `36066988954`, job `107859397766`;
- **29/29 PASS**;
- 0 page errors; 0 tracked first-party/CDN HTTP errors;
- artifact `10836726983`.

Public Cloudflare:
- publication `cloudflare-live@983929385c3be74a42ec88c29f601c08b90b5a05`;
- rerun public job `107860680693`;
- **24/24 PASS**;
- 0 page errors; 0 tracked HTTP errors;
- public artifact `10836432703`;
- screenshot `04-video-back.png`: normal tan billboard backside only; no mirrored YouTube surface.

B2a is now **HUMAN_ACCEPTED** per Georg's conditional acceptance + explicit check-in instruction.

## Exactly one next gate

**B2b research/options memo for Living Mockup / Collage surfaces only; no runtime implementation until selected.**
