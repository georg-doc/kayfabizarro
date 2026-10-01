# CHANGELOG · RESIDENT-CHAT-PRESENTATION-01

## 2026-10-01 · shared-pool semantic output → existing NPC-CARD-SPEC-01 presentation seam

### SOURCE FIRST
- Stacked from deterministic kernel PR #305, head `5b595a075b789f683ef0871f8c24d95e96416449`.
- Reused existing NPC-CARD-SPEC-01 donor; no new actor, renderer, camera, mouth, gaze, bubble or Card owner.
- Exact donor recipe blob `e9b2aea0abc1bcb151fbc8cf5a08f7a6ae36689b` remains unchanged.
- Existing `scene / actor-a / actor-b / mouths` source-isolation lanes remain in the runner.
- Existing donor visual TUNE/Georg review remains open.

### IMPLEMENTATION
- Added donor-derived shared-pool provider using the tested kernel adapter.
- Donor A0/A1/B0/B1 text becomes one shared semantic pool at runtime.
- Existing beat mapping:
  - observation ← Subject
  - interpretation ← Connector
  - counter / implication ← Reframe
- Added optional synchronous `lineProvider` seam to existing runner.
- Exact `recipe.triplets` fallback remains active without provider.
- Existing host loads provider optionally and exposes `semanticReport()`.
- No LLM, TTS, persistence, reward or new timing/bubble engine.

### REPAIR PASS 1
- Initial CI: **9/14 PASS**.
- Root cause: staged ~26 s donor Triplets were correctly rejected under ordinary ambient ChatterBox word budget.
- Repair: mark the existing scene event `performanceMode:true`.
- No normal ChatterBox limit was weakened.

### TESTED RESULT
- tested head: `0bf02e9a311046d2730927b3cbf19634c87cbf3a`
- GitHub Actions run: `36854642474`
- job: `110344123565`
- syntax provider/runner/tests: PASS
- P01–P14: **14/14 PASS**
- fail: 0

### PUBLIC / VISUAL
- browser on stacked candidate: NOT TESTED
- Stage: NOT DEPLOYED
- Live: NOT PROMOTED
- human visual acceptance: NOT REQUESTED

### NEXT GATE
**VISIBLE BROWSER FIXTURE VERIFICATION** — run the existing donor host from the stacked branch and verify scene variants 0/1 plus actor-a, actor-b and mouths isolation lanes with the shared-pool provider visibly active. Only after that consider a public Stage.

## 2026-10-01 · headed browser fixture PASS

### BROWSER QA
- Added a QA-only headed Chromium/Xvfb consumer; donor scene code and recipe remain unchanged by the browser proof.
- CI reconstructs only historical source aliases from current canonical repo sources:
  - Card Viewer → `KFB Comic Card Deck Viewer v4 (WS0)/kfb-viewer.js`
  - Doomsday Clock PDF → `media/kfb/Deck_B_DYSTOPIA_-_ANATOMY_OF_A_TRAP web H.pdf`
  - Deck JSON → `KFB Comic Card Deck Viewer v4 (WS0)/decks/deck_b_dystopia.json`
  - Motion Library → `media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library_Rig_Medium.glb`
- QA reads the existing `semanticReport()`, `scene.report()`, `seek()`, `setReview()`, actor visibility, mouth talk state and existing bubble canvases.
- Five browser screenshots are generated: scene variant 0/1, actor-a, actor-b and mouths.

### BROWSER REPAIR HISTORY
- Attempt 1: QA harness-only URL constructor shadowing; no scene/runtime failure.
- Repair Pass 1: harness name fixed; full scene rendered, but opaque generic Chromium 404 console lines kept the gate red.
- Evidence artifact from that run already contained all five screenshots and correct provider/owner/isolation proof; donor reported its documented KayKit-idle fallback because its historical local Motion-Library copy was deliberately not packaged.
- Repair Pass 2: reconstruct Motion-Library alias from the current canonical source and validate exact HTTP response URL/status instead of opaque duplicate console lines.
- No third repair pass.

### TESTED RESULT
- exact implementation head: `7204b91eb340c615d7e0db45560f6d2c8d0b6d7a`
- workflow run: **36858274598 · SUCCESS**
- parity job: **110355897991 · SUCCESS**
- browser job: **110355898424 · SUCCESS**
- browser artifact: **11160566742**
- artifact digest: `sha256:ce47e8b3e8b772dbed399006144dc0fa73a8c7a225e1906b4488cf2a73cade44`
- browser report: **PASS · 0 runtime errors · 0 HTTP errors · 0 request failures**
- Motion Library: **33 clips**
- shared-pool provider: active
- both scene variants: visible
- all three source-isolation lanes: visible
- mouth/talk states: asserted
- existing bubble: asserted

### PUBLIC / HUMAN
- Stage: NOT DEPLOYED
- Live: NOT PROMOTED
- Georg/human mouth-face acceptance: NOT REQUESTED
- older donor visual TUNE remains open/deferred.

### NEXT GATE
**RESIDENT-CHAT-ENSEMBLE-01** — source-isolate Lorekeeper, Goth Girl, Clown and Witch from current Resident sources, then load the four real Residents into one deterministic shared-Triplet ChatterBox ensemble. Keep one speaker normal / two soft maximum. No live LLM yet.

