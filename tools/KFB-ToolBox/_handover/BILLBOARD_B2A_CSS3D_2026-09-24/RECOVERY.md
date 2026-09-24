# RECOVERY · Billboard B2a CSS3D · 2026-09-24

Status: **LOCAL/CI VERIFIED · PUBLIC STAGE NEXT**
Owner: **KFB ToolBox / Billboard Media Residency**
Branch: `chatgpt-web/billboard-b2a-css3d-2026-09-24`
Draft PR: **#199**
Base: accepted B1 `78f09f5e9b28b606a121bda1b43dcd8c8aff5f1a`
Tested integration head: `147b517efdfba78302af4e5e3ff48846b1f21f92`
Planned Stage: https://kayfabizarro.pages.dev/kfb-hub/pruefen/billboard-b2a/

Read:
1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/session-entry-use-what-works_v1.md`
5. `tools/KFB-ToolBox/_handover/BILLBOARD_MEDIA_LIVING_2026-09-24.md`
6. this file

## Proven donor gate

Official Three.js r160 `css3d_youtube.html` donor:
`mrdoob/three.js@d04539a76736ff500cae883d6a38b3dd8643c548/examples/css3d_youtube.html`

Isolation run `35951854457` / job `107481888424`: **9/9 PASS**.
Artifact `10787959850`; screenshot visibly shows the real YouTube player on the isolated CSS3D plane.

## Integration result

Current B2a:
- B0/B1 source files remain exact protected blobs;
- CSS3DRenderer uses the same camera as WebGL;
- one CSS3DObject matches the B1 panel world position/quaternion/dimensions;
- VIDEO loads the Travel-owned YouTube iframe directly on the billboard;
- iframe itself wins hit-test on the media surface;
- camera 3/4 view visibly and measurably changes the CSS3D plane perspective;
- mode exit unloads `about:blank` and hides the CSS3D Object3D;
- no modal exists;
- CARD/COVER/SLOGAN are visible again after the repair.

Integration run `35952766940` / job `107484912203`: **27/27 PASS**, 0 page errors, 0 first-party/CDN HTTP failures.
Artifact: `10788929677`.

### Preserved failed evidence / repair count

First integration candidate `7bed45398820b6bc629b24e0580866d697642946`:
- **26/28**;
- picture inspection showed black CARD and SLOGAN because the hidden CSS3D DOM plane still overlaid WebGL;
- two failed assertions also exposed that camera motion must be proved in screen-space, and DOM `style.display` is not the renderer-owned visibility contract.

Repair pass **1/2**:
- switched visibility to `CSS3DObject.visible`;
- kept iframe unload on exit;
- proof compares screen-space rect across camera views;
- new screenshots show card + slogan restored and inline YouTube perspective working.

## Exactly one next gate

**Publish the exact verified multi-file candidate to `/kfb-hub/pruefen/billboard-b2a/`, open that Cloudflare route, and prove the public revision before Georg review.**
