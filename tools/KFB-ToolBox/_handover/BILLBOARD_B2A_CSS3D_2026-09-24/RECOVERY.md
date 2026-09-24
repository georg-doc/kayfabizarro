# RECOVERY · Billboard B2a CSS3D · 2026-09-24

Status: **INTEGRATION PROOF IN PROGRESS**
Owner: **KFB ToolBox / Billboard Media Residency**
Branch: `chatgpt-web/billboard-b2a-css3d-2026-09-24`
Draft PR: **#199**
Base: accepted B1 `78f09f5e9b28b606a121bda1b43dcd8c8aff5f1a`
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
Screenshot visibly shows the real YouTube player on the isolated CSS3D plane.

## Current implementation

B2a now forks accepted B1 and adds only `bb2a-boot.js` + B2a HTML:
- B0/B1 sources copied unchanged beside it;
- CSS3DRenderer uses the same camera as WebGL;
- one CSS3DObject matches the B1 panel world position/quaternion/dimensions;
- VIDEO loads the Travel-owned YouTube iframe directly on the billboard;
- mode exit unloads it;
- no modal exists.

Exactly one next gate:
**B2a integration browser proof: front + 3/4 perspective + mode-exit cleanup.**
