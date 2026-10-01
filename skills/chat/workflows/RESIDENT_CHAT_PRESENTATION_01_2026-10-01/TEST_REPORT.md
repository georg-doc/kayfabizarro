# TEST REPORT · RESIDENT-CHAT-PRESENTATION-01

Date: 2026-10-01  
Status: **SOURCE/PRESENTATION PARITY PASS · HEADED BROWSER PASS**

## Scope

This report covers the deterministic semantic-to-presentation seam only.

It proves that the existing NPC-CARD-SPEC-01 donor text can pass through the tested Resident Chatter kernel and return into the existing beat/presentation runner without replacing actor, face, mouth, gaze, bubble, renderer, camera or Card owners.

It does **not** claim:
- visible browser rendering on this branch;
- human mouth/face acceptance;
- Stage/public verification;
- live LLM generation;
- TTS/audio;
- persistent memory.

## Exact stacked source

Repository: `georg-doc/kayfabizarro`

Presentation branch:
`chatgpt-web/resident-chat-presentation-01-2026-10-01`

Draft PR:
**#306**

Stacked kernel:
- PR #305
- kernel head: `5b595a075b789f683ef0871f8c24d95e96416449`
- adapter blob: `bc3cf5194747bcb71b2b93bcfdec349c9db710f2`
- kernel gate: **29/29 PASS**

Exact presentation donor:
- NPC-CARD-SPEC-01 recipe blob: `e9b2aea0abc1bcb151fbc8cf5a08f7a6ae36689b`
- recipe status: **unchanged**
- actors: FrizzleBob Driver Graft + GothGirl
- real Card: **The Doomsday Clock**
- isolation lanes: `scene | actor-a | actor-b | mouths`

## Integration under test

Provider:
`skills/chat/workflows/RESIDENT_CHAT_PRESENTATION_01_2026-10-01/donor-semantic-provider.mjs`

Runner seam:
existing `npc-card-spec-01/resident-scene.mjs` gains one optional synchronous `lineProvider`.

Fallback:
if no provider is supplied, the exact previous `recipe.triplets` path remains active.

Host:
existing `NPC Card Speculation Scene.dc.html` attempts to load the provider and falls back to `recipe.triplets` if unavailable.

Shared-pool parity mapping:

```text
observation    ← Subject
interpretation ← Connector
counter        ← Reframe
implication    ← Reframe
```

The donor's existing A0/A1/B0/B1 text is converted into one runtime shared pool. No replacement prose is authored for this parity slice.

## Run 1 · failed gate

GitHub Actions run:
`36854545942`

Result:
- syntax provider: PASS
- syntax donor runner: PASS
- syntax test: PASS
- parity tests: **9/14 PASS**
- failures: P04–P08

Observed failure:
the deterministic kernel returned no eligible Triplet for all donor text-selection tests.

Proven cause:
NPC-CARD-SPEC-01 is an explicit staged ~26 s Card performance. The provider had presented its multi-line donor Triplets to the kernel as ordinary ambient ChatterBox. The kernel correctly enforced the ordinary ~15-word default and rejected the longer performance Triplets.

This was not a knowledge, pool, variant, ownership or text-parity failure.

## Repair Pass 1

Change:
`event.performanceMode = true`

No other budget/owner behavior changed.

Why this is valid:
the kernel already contains a deliberate longer-speech path for explicit performance mode. The repair classifies this existing staged donor correctly instead of weakening the normal ChatterBox compression rule.

## Run 2 · final tested source

Tested presentation head:
`0bf02e9a311046d2730927b3cbf19634c87cbf3a`

GitHub Actions:
- workflow: `resident-chat-presentation-01`
- run: **36854642474**
- job: **110344123565**
- conclusion: **SUCCESS**

Checks:
- semantic provider syntax: PASS
- donor runner syntax: PASS
- test syntax: PASS
- P01–P14: **14/14 PASS**
- fail: **0**
- duration: ~96 ms

## P01–P14 coverage

1. exact NPC-CARD-SPEC-01 recipe donor blob unchanged;
2. exact deterministic kernel blob unchanged from PR #305;
3. donor Triplets become one shared four-entry pool;
4. actor A variant 0 byte-for-text parity;
5. actor A variant 1 byte-for-text parity;
6. actor B variants 0/1 byte-for-text parity;
7. Subject/Connector/Reframe map onto existing beat keys;
8. provider report is deterministic and does not mutate recipe;
9. runner has optional provider plus exact local fallback;
10. source-isolation lanes remain `scene / actor-a / actor-b / mouths`;
11. host wires provider optionally and retains fallback;
12. provider URL resolves from exact donor host to shared workflow source;
13. actor, mouth, EyeRig and Card source ownership remains unchanged;
14. presentation provider adds no LLM, fetch, reward or persistence path.

## What is proven

**PASS**
- deterministic shared-pool output can supply the exact existing donor text;
- both A/B donor variants remain available;
- semantic units drive the existing line keys;
- original recipe remains unchanged;
- fallback remains intact;
- isolation lanes remain intact;
- actor/face/Card ownership remains intact;
- no second timing or bubble engine is introduced;
- no LLM/TTS/persistence is introduced.

## Headed browser verification

Final tested implementation head:
`7204b91eb340c615d7e0db45560f6d2c8d0b6d7a`

GitHub Actions:
- run: **36858274598**
- parity job: **110355897991 · SUCCESS**
- browser job: **110355898424 · SUCCESS**

Artifact:
- id: **11160566742**
- digest: `sha256:ce47e8b3e8b772dbed399006144dc0fa73a8c7a225e1906b4488cf2a73cade44`
- files: five PNG screenshots + `browser-proof.json`

Browser report assertions:
- `result = PASS`
- `errors = []`
- `httpErrors = []`
- `requestFailures = []`
- active semantic source matches RESIDENT-CHAT-POC-01 deterministic adapter
- shared pool entries = **4**
- A variants = **2**
- B variants = **2**
- EyeRig owners = **2**
- Mouth owners = **2**
- Mixers = **2**
- Motion Library = **33 clips**
- Card = **The Doomsday Clock**
- scene variant 0 = bubble visible + B talking
- scene variant 1 = bubble visible + B talking
- actor-a = A visible / B hidden / A talking
- actor-b = A hidden / B visible / B talking
- mouths = both visible / alternating talk state

The browser job used a real headed Chromium process under Xvfb. The document remained visible (`document.hidden === false`).

### Browser repair sequence

Browser attempt 1:
- QA harness failed before scene validation because local constant `URL` shadowed the URL constructor.

Repair Pass 1:
- QA-only rename to `HOST_URL`.
- scene rendered and emitted all five screenshots;
- gate still failed on two opaque Chromium generic 404 console messages;
- evidence already proved provider/owners/variants/isolation/talk.

Repair Pass 2:
- restored the donor's historical local Motion-Library alias from the current canonical repo source in the CI workspace;
- QA now records exact non-OK HTTP responses and ignores only opaque duplicate console resource messages;
- final browser run PASS with **0 HTTP errors** and Motion Library **33 clips** loaded.

No third repair pass was used.

## What is proven

**PASS**
- deterministic shared-pool output supplies the exact existing donor text;
- source parity remains 14/14;
- provider imports and scene mounts in a real browser;
- both scene variants render;
- existing bubble appears while the selected speaker talks;
- actor-a / actor-b / mouths source-isolation views render and expose the intended talk state;
- canonical Motion Library loads instead of the historical fallback;
- no essential HTTP or request failure remains;
- original donor recipe is still unchanged;
- no live LLM, reward or persistence path exists.

## What is not proven

**OPEN / DEFERRED**
- Georg/human acceptance of the older donor mouth/face look;
- four-Resident ensemble;
- player-to-Resident interaction in that ensemble;
- live LLM generation;
- TTS/audio;
- persistent runtime Lean Memory;
- public Stage / Live.

The visible donor TUNE history remains open but does not block the next semantic/ensemble slice.

## Exactly one next gate

**RESIDENT-CHAT-ENSEMBLE-01**

Source-isolate Lorekeeper, Goth Girl, Clown and Witch from current Resident sources, then load the four real Residents into one deterministic ChatterBox ensemble with shared Triplets, Attitude/Affect and 1-normal/2-soft-max speech budget. No live LLM yet.
