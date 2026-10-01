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
