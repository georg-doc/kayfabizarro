# CHANGELOG · KFB 3D in-scene editor module

## 2026-09-20 · Scene Patch v1 · two-host seam

- started fresh from current `main@6c1b02a3338c005127d45bc7bff3ecbb785f1342` on `toolbox/scene-patch-adapter-v1-2026-09-20`;
- reused S38 `edit-layer.js` as the interaction donor instead of inventing a third Three.js editor;
- extracted host-neutral `kfb.scene-patch.v1` session mechanics;
- integrated Resident Atlas first with Habitat/Prop editing while protecting the animated actor;
- first Resident browser gate exposed non-serialisable reject diagnostics; repaired the shared API and retained the failed run as evidence;
- Resident passed real Chromium/WebGL after repair;
- integrated Dungeon S13.2 second, editing only real candle/light props and preserving generator ownership;
- first Dungeon gate exposed an overly broad UI-picker replacement that cut the original `rayProbe`/control section;
- rebuilt the host from exact main and replaced only the actual UI picker;
- final two-host run `35538997214`: Resident **20/20**, Dungeon **22/22**, combined **42/42 PASS**, 0 browser errors;
- no Tiny Treats, actor posing, Recipe bake-back or Live promotion in this slice.
