# KFB FrankenStein Composer · Optional Wireface Face Driver MVP · Source/Test Report R1
Date: 2026-10-13
Status: **ADAPTER + ADDITIVE ACTOR RECIPE IMPLEMENTED / SOURCE CONTRACT QA GREEN / VENDOR SDK + SITE NOT INTEGRATED**
Owner: `georg-doc/kayfabizarro`, existing Draft PR **#355**, branch `planning/frankenstein-composer-gpt-site-2026-10-04`.
Private Site: https://kfb-frankenstein-composer.frizzlebob.chatgpt.site — at earlier Work Return **v4**, **NOT republished in this slice**. Existing Composer browser WebGL GLB/JSON human acceptance still open.

## Scope completed IN ACTUAL GITHUB SOURCE
1. `kfb-hub/stage/toolbox/frankenstein-composer/wireface-face-driver-contract.mjs` — **new** dependency-injected optional vendor face boundary. Git blob `74d03061ccaa61c2a2f85e3414b8d4b46cca77e7`. Four modes `KFB_NATIVE`, `WIREFACE_MESH`, `WIREFACE_MODEL`, `WIREFACE_SCREEN`. For Wireface it requires source visual proof receipt, licensing/distribution review, real measured head-node/mount and exclusive per-region face channels. `attachWireface` calls only a provided real `sdk.attachFace`, never constructs a placeholder head or new Three scene. `bindOwnerAudio` delegates to an existing source/context via `face.listenTo`, never creates `AudioContext`. Both actual vendor and real-skin behavior are **NOT** verified.
2. Existing `kfb-hub/stage/toolbox/frankenstein-composer/app.js` — **minimal additive** `composition.faceDriver:'KFB_NATIVE'` plus `wirefaceCompanion:null` native default in current reversible actor recipe, blob `da5b06812b0b776cbdf79d782ee7af944a76fead`. Current source still uses the same real GothGirl Rig_Medium/Black Knight Rig_Large, FrizzleBob v5 body/head source and Three 0.160 engine; no new selector or SDK imported/published yet.
3. `kfb-hub/stage/toolbox/frankenstein-composer/tests/wireface-face-driver-contract.mjs` — **new** repo-native Node ESM negative-contract harness, blob `8edda5022fa6d693a34f9149d7468b91dde1f901`. Shows adapter seam behavior with **stub SDK only**, not real vendor implementation. Node test file created, but separately invoking `node ...mjs` was not performed in this Web-Chat executor.

## Executed tests, precisely described
- Imported **exact committed adapter text** into a V8 isolate for semantic function execution against a small fixture matching current Composer Actor Recipe shape: **17/17 PASS**. Native mode stays native; validated vendor mode and source mount; rejected unisolated URL donor, absent licensing review, unmeasured head, simultaneous EyeRig/Mouth writer, secondary audio-clock owner, missing SDK, wrong head node, unverified source isolation and missing existing source audio. Stubbed vendor `attachFace` and `listenTo` verified *injection plumbing only*. Did not use real SDK or render a pixel.
- Compared **actual GitHub app.js / adapter / test / original 22-case baseline suite / WSA brief**: **25/25 static contract assertions PASS**: one Three renderer, authentic body/head refs, original source/composite/motion code present, native-only recipe default, existing `kfb.pets/1`, guarded Wireface head/audio/ownership and unmodified no-mock vendor policy. These aren't 22/22 baseline test execution, and cannot establish DOM/WebGL success.
- After every actual GitHub source write, fetched exact branch head + source file, HEAD-vs-commit comparison and content readback; all completed writes verified. Branch head will be finalized after owner Return/START_HERE.
- No Site publisher exists in this chat. **No Site revision was published or browser A/B shown**. Nothing should be marked `WIREFACE_CONNECTED` or `SDK_VERIFIED`.
- Vendor documentation from previous proven donor matrix `WIREFACE_OPTIONAL_FACE_DONOR_MATRIX_2026-10-13.md` describes `@wireface/sdk/three`, FaceMesh/ModelFace/FaceScreen, attachFace, listenTo. Live vendor `wireface.dev/docs/three` could not be opened by web tool in this session. Revalidate actual API/package bytes and license in Work *before* activating in the real Site. Search surfaced an unrelated `styk-tv/wireface` (Babylon.js), explicitly prohibited as a replacement.
- Source license: vendor's Personal / Developer / Enterprise terms are reported in previous matrix and MUST be verified with actual SDK rights for commercial KFB games before distributing vendor bundle. No licence accepted, purchase made, or source/vendor artifacts copied into this repo.

## Existing audio failure and viable MVP proof
Georg stated the prior local eSpeak audio is poorly intelligible. **No audio source was selected or accepted in this run**; real MVP hearing requires a genuinely intelligible recorded voice clip with exact SHA, equal level/timing on both face modes, no second TTS player and no additional AudioContext. Native Composer face may be only a static visual stack: if so, label A `KFB_NATIVE_VISUAL_BASELINE` and B `WIREFACE_REAL_LIPSYNC`, not equivalent native lip-sync. Human hearing, lip-sync, clay character visual fidelity and cold actor+face-recipe round trip are still **0/NOT_RUN**.

## ACCEPTANCE REQUIRED / next gate
One Sites-capable Work/WSA task, as defined in `WSA_WIREFACE_FACE_DRIVER_MVP_ONE_SHOT_2026-10-13.md`, must in current Composer owner:
- visually isolate exact existing GothGirl head donor and **real** Wireface face object;
- verify actual vendor SDK API/license and load against current single Three renderer;
- add in-place small native/Wireface A/B control;
- mount on real measured node, switch cleanly, test with **one intelligible identical audio clip** and original body motion;
- preserve active original EyeRig/PetMouth ownership and KFB Audio single clock;
- persist/import/export separate Wireface companion and original actor with no false self-contained GLB claim;
- pass real browser visual/audible/in-app Site revision proof and former v4 QA, then ask Georg KEEP/TUNE/CUT.

**Next one gate:** `COMPOSER_WIREFACE_REAL_SOURCE_ISOLATION_AND_FACE_A_B_MVP_R1`, one existing Composer PR #355 / Site, Work/WSA implementation. No additional Owner, Cloudflare, merge or Live.
