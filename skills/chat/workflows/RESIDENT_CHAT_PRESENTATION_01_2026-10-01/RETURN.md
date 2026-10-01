# RETURN · RESIDENT-CHAT-PRESENTATION-01

Date: 2026-10-01  
Status: **SOURCE INTEGRATION PASS · 14/14 · HEADED BROWSER PASS · DRAFT STACKED PR**

## Repository / branch / PR

- Repository: `georg-doc/kayfabizarro`
- Branch: `chatgpt-web/resident-chat-presentation-01-2026-10-01`
- Draft PR: **#306**
- Stacked base: PR #305 / `chatgpt-web/resident-chat-poc-01-2026-10-01@5b595a075b789f683ef0871f8c24d95e96416449`
- Browser-tested implementation head: `7204b91eb340c615d7e0db45560f6d2c8d0b6d7a`
- Stage: **NOT DEPLOYED**
- Live: **NOT PROMOTED**
- Human acceptance: **NOT REQUESTED**

## Outcome

The tested deterministic Resident Chatter kernel now feeds the **existing NPC-CARD-SPEC-01 presentation runner** through one optional semantic line seam.

No second presentation runtime was created.

The original donor presentation remains owner of:

- FrizzleBob Driver Graft;
- GothGirl;
- EyeRig ×2;
- PetMouth ×2;
- mixers / motion;
- bubble drawer;
- renderer;
- camera;
- Card owner;
- beat timing;
- source-isolation lanes.

## Source-first donor

Exact donor recipe:

`tools/KFB-ToolBox/_inbox/KFB Resident Card Speculation Scene/npc-card-spec-01_2026-09-24/npc-card-spec-01/resident-card-speculation.recipe.json`

Blob:

`e9b2aea0abc1bcb151fbc8cf5a08f7a6ae36689b`

Status:

**UNCHANGED**

Existing source-isolation lanes remain:

- `scene`
- `actor-a`
- `actor-b`
- `mouths`

Real Card remains:

**The Doomsday Clock**

The donor's older mouth/face visual TUNE list remains open. This slice does not silently turn prior browser rendering into human acceptance.

## Implemented integration

### Shared-pool provider

`skills/chat/workflows/RESIDENT_CHAT_PRESENTATION_01_2026-10-01/donor-semantic-provider.mjs`

Tested provider blob:

`b407aa724bd21b440a76961cefe07957a6be9113`

Behavior:

- imports the exact tested PR #305 adapter;
- derives one four-entry shared pool from existing A0/A1/B0/B1 donor Triplets;
- authors no replacement dialogue for this parity proof;
- selects one deterministic Triplet per speaker/variant;
- marks the existing staged Card scene as explicit `performanceMode`;
- emits exact donor semantic units.

### Existing runner seam

Modified:

`npc-card-spec-01/resident-scene.mjs`

Blob:

`2fe796111c8d14afc7c3620c35676759225c723b`

Change:

- adds optional synchronous `lineProvider`;
- keeps exact `recipe.triplets` fallback;
- reports semantic source;
- does not change actors, faces, mouth/gaze ownership, bubble drawing, timing, renderer or camera.

Mapping:

```text
observation    ← Subject
interpretation ← Connector
counter        ← Reframe
implication    ← Reframe
```

### Existing host

Modified:

`NPC Card Speculation Scene.dc.html`

Blob:

`beedba387ee05ab3c43856e41b78aa75ccf5a21b`

Change:

- optional provider import;
- fallback to `recipe.triplets` if provider unavailable;
- passes provider into existing runner;
- exposes `semanticReport()` for deterministic verification.

No replacement UI or generic chat chrome was added.

## Test history

### Run 1

GitHub Actions run:
`36854545942`

Result:
**9/14 PASS**

Root cause:
the staged ~26 s Card-performance Triplets were initially evaluated as ordinary ambient ChatterBox and correctly rejected by the normal short-speech budget.

### Repair Pass 1

Only change:
`event.performanceMode = true`

This uses the existing explicit performance-mode path. It does not weaken the normal ChatterBox budget.

### Final source test

Tested head:
`0bf02e9a311046d2730927b3cbf19634c87cbf3a`

GitHub Actions:
- run: **36854642474**
- job: **110344123565**
- conclusion: **SUCCESS**
- provider syntax: PASS
- donor runner syntax: PASS
- test syntax: PASS
- P01–P14: **14/14 PASS**
- fail: **0**
- duration: ~96 ms

## P01–P14 proof

The automated suite proves:

1. exact donor recipe blob unchanged;
2. exact deterministic kernel blob unchanged;
3. one shared four-entry semantic pool;
4. A variant 0 exact text parity;
5. A variant 1 exact text parity;
6. B variants 0/1 exact text parity;
7. Subject/Connector/Reframe map to existing beat keys;
8. deterministic provider does not mutate recipe;
9. optional provider + exact fallback;
10. source-isolation lanes retained;
11. host optional wiring + fallback retained;
12. provider URL resolves to shared workflow source;
13. actor, mouth, EyeRig and Card ownership unchanged;
14. no LLM, fetch, reward or persistence path.

## Changed files relative to kernel PR #305

1. `.github/workflows/resident-chat-presentation-01.yml`
2. `skills/chat/workflows/RESIDENT_CHAT_PRESENTATION_01_2026-10-01/donor-semantic-provider.mjs`
3. `skills/chat/workflows/RESIDENT_CHAT_PRESENTATION_01_2026-10-01/test/presentation-provider.test.mjs`
4. `skills/chat/workflows/RESIDENT_CHAT_PRESENTATION_01_2026-10-01/SOURCE.json`
5. `skills/chat/workflows/RESIDENT_CHAT_PRESENTATION_01_2026-10-01/TEST_REPORT.md`
6. `skills/chat/workflows/RESIDENT_CHAT_PRESENTATION_01_2026-10-01/CHANGELOG.md`
7. this `RETURN.md`
8. existing donor `resident-scene.mjs` — narrow optional semantic seam only
9. existing donor host — optional provider wiring only

## What is proven

**SOURCE / INTEGRATION PASS**

- shared-pool kernel output can feed the exact donor semantic lines;
- both donor variants survive;
- existing beat slots consume Subject/Connector/Reframe;
- original recipe is untouched;
- fallback is intact;
- source-isolation modes are intact;
- actor/face/Card owner boundaries are intact.

## Headed browser proof

Exact tested implementation head:

`7204b91eb340c615d7e0db45560f6d2c8d0b6d7a`

GitHub Actions:
- workflow: `resident-chat-presentation-01`
- run: **36858274598**
- presentation-parity job: **110355897991 · SUCCESS**
- browser-proof job: **110355898424 · SUCCESS**
- Resource Registry run: **36858274601 · SUCCESS**

Browser evidence artifact:
- artifact id: **11160566742**
- name: `resident-chat-presentation-browser-proof`
- size: **1,601,902 bytes**
- digest: `sha256:ce47e8b3e8b772dbed399006144dc0fa73a8c7a225e1906b4488cf2a73cade44`
- contents: `browser-proof.json` + five PNG screenshots.

Final browser report:
- result: **PASS**
- runtime/page errors: **0**
- essential HTTP errors: **0**
- request failures: **0**
- semantic provider: **ACTIVE**
- shared donor pool entries: **4**
- EyeRig owners: **2**
- Mouth owners: **2**
- Mixers: **2**
- Motion Library: **KFB_Motion_Library_Rig_Medium.glb · 33 clips**
- Card: **The Doomsday Clock**
- scene variant 0: visible bubble + GothGirl talking
- scene variant 1: visible bubble + GothGirl talking
- `actor-a`: A visible / B hidden / A talking
- `actor-b`: A hidden / B visible / B talking
- `mouths`: both visible / alternating talk state

The five screenshots prove the actual donor objects in isolation as well as the two scene variants. This is automated browser evidence, not Georg acceptance.

### Browser repair history

Initial browser attempt:
- failed in QA harness before scene validation because the harness constant `URL` shadowed the global URL constructor.
- scene/runtime not implicated.

Repair Pass 1:
- harness-only rename to `HOST_URL`.
- scene rendered fully and produced all five screenshots.
- gate still failed because Chromium emitted two opaque generic 404 console lines.
- artifact `11160370107` proved provider, Card, owners, variants, isolation lanes and talk states were already working.
- donor report showed the documented KayKit-idle fallback because the historical local Motion-Library alias was intentionally absent from the Scene package.

Repair Pass 2:
- restored the historical Motion-Library alias **in CI only** from the current canonical KFB Motion Library;
- changed QA to validate exact HTTP response URL/status instead of treating Chromium's opaque generic resource-console line as proof of an essential failure;
- did not modify donor recipe, actor, mouth, gaze, bubble, Card, camera, renderer or beat timing;
- final run **PASS**.

## What remains unproven

**OPEN / DEFERRED**

- human visual acceptance of the older NPC-CARD-SPEC-01 mouth/face look;
- four-Resident ensemble loading;
- player interaction in the four-Resident ensemble;
- live LLM generation;
- TTS/audio;
- persistent runtime Lean Memory integration;
- public Stage / Live promotion.

The donor's older mouth/face TUNE list remains visible history. It is not a blocker for the next semantic/ensemble proof and is not silently marked accepted.

No Stage was manufactured for this technical browser gate.

## Exactly one next gate

**RESIDENT-CHAT-ENSEMBLE-01**

Build the first four-Resident deterministic ensemble with:

1. exact current source-object isolation for **Lorekeeper, Goth Girl, Clown and Witch** before integration;
2. the four real source-backed Residents loaded in one scene;
3. the tested shared KFB Semantic Triplet Pool / ResidentProfile weighting;
4. baseline Attitude + transient Affect;
5. one active speaker normally, two soft maximum for reply/interjection;
6. one bounded NPC↔NPC micro-conversation and one player-targeted interaction seam;
7. existing mouth/gaze/bubble/animation owners only where source-supported;
8. no live LLM yet.

Do not create a second ChatterBox, memory, animation, camera, movement or reward owner.  
No public Stage until the four-Resident result is a meaningful human-review milestone.  
No auto-merge.
