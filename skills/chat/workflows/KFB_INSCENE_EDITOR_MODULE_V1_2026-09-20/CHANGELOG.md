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


## 2026-09-22 · isolated Stage + public gate

- packaged the already-tested Resident + Dungeon hosts under `kfb-hub/stage/toolbox/scene-patch-v1/` with shared modules copied from the same candidate;
- isolated Stage mirror run `35539447295`: **13/13 PASS**, 0 browser errors;
- atomically copied the 13 tested mirror blobs to `cloudflare-live` at `2c2de267b9413b262d51152408e616751c1e8e85`;
- patched the current publication Hub in place at `f0c269904de722b86260e1657928e9a1936127b4` with direct Scene Patch review links;
- public QA attempt 1 failed at public child-route readiness; source/publication Git state was re-read and remained correct;
- exactly one public-sync retry is allowed; no visual/runtime rebuild and no automatic Live promotion;
- captured the subsequent ToolBox consolidation direction separately as GitHub issue #167 rather than mixing it into this old branch.


## 2026-09-22 · public verified

- public QA run `35671642443` attempt 2 succeeded without changing the Scene-Patch runtime;
- exact `kayfabizarro.pages.dev` Stage root, Resident host and Dungeon host all loaded with the expected build/source markers;
- public assertions **13/13 PASS**, 0 page/console errors;
- public proof artifact `10671626183`, digest `sha256:356dbf12428252b54040e50a4077767e0cac3234c74982adbdaf4ca28a4bb2cf`;
- Stage is now PUBLIC_VERIFIED and linked from the KFB Hub;
- exactly one gate remains: Georg's Resident-prop + Dungeon-candle interaction review;
- no automatic main merge and no Live promotion.
