# RETURN · RESIDENT-CHAT-POC-01 · deterministic ChatterBox Resident kernel

Date: 2026-10-01  
Status: **TESTED PASS · HEADLESS SEMANTIC KERNEL · DRAFT PR · NOT MERGED**

## Repository / branch / PR

- Repository: `georg-doc/kayfabizarro`
- Branch: `chatgpt-web/resident-chat-poc-01-2026-10-01`
- Draft PR: **#305**
- Base at slice start: `main@5e42cb6c29bf0f323db0f780454542d04834d4f4`
- Handoff metadata head immediately before this Return write: `06fbc4aa7fa885a14205523229c12c6e28147461`
- Stage: **NOT REQUIRED / NOT DEPLOYED**
- Live: **NOT PROMOTED**
- Human acceptance: **NOT REQUESTED**

The exact final branch head is the commit containing this Return plus any strictly metadata-only read-back closure; verify it from PR #305 before continuation.

## Outcome

Built one pure deterministic Resident semantic adapter that prepares validated semantic material for the **existing ChatterBox path**.

It does not create a new dialogue engine.

Protected ownership remains:

```text
host / mob-ai                → WHEN / behavior / timing
ChatterBox / chatter-2d      → WHAT / speech-content route
bubble-layout + bubble-ts    → visible presentation
Resident Atlas               → actor / set / rig truth
Journey / Resident Social Memory
                             → episodic provenance / meaningful memory
resident-chatter-adapter     → knowledge filter + shared-pool semantic selection only
```

## Implemented kernel

Main module:

`skills/chat/workflows/RESIDENT_CHAT_POC_01_2026-10-01/src/resident-chatter-adapter.v0.1.mjs`

Exact tested blob:

`bc3cf5194747bcb71b2b93bcfdec349c9db710f2`

Exports:

- `prepareResidentTurn(input)`
- `inspectResidentKnowledge(input)`
- `validateResidentTurn(output)`

The adapter supports:

- one shared KFB Semantic Triplet pool;
- per-Resident signature weighting, not private phrase databases;
- SOURCE / OBSERVED / HEARD knowledge filtering;
- baseline Attitude + transient Affect weighting;
- KayfaBingo / KayfaBongo / KayfaBoggle / BLÖDSINN! semantic operators;
- authored Fluff-o-lect variants only;
- borrowed Signature Triplets only after unlock/provenance;
- speaker-specific transformed borrowed fallbacks;
- repetition penalty;
- deterministic RNG;
- first-class SILENCE;
- semantic presentation hints only.

It cannot directly write:

- POP / rewards;
- movement;
- camera;
- animation clips;
- bones/transforms;
- persistent memory;
- character canon.

## Tests

Test module:

`skills/chat/workflows/RESIDENT_CHAT_POC_01_2026-10-01/test/resident-chatter-adapter.test.mjs`

Exact tested blob:

`9af4260f24ab5eeec3656066c38c7962c5208fc9`

### Contract tests

**T01–T25 = 25/25 PASS**

Covers:

- all four Residents using the same pool;
- no private Resident pool requirement;
- visible vs unseen facts;
- HEARD != OBSERVED;
- absent Resident does not inherit Card context;
- Witch INTRIGUED vs IRRITATED;
- same Affect does not collapse different Residents;
- SILENCE;
- BINGO / BONGO / BOGGLE / BLÖDSINN!;
- authored vs random Fluff-o-lect;
- borrowed Signature provenance + transformation;
- repetition protection;
- `transformIntent`;
- no reward/POP write;
- no animation/bone/clip write;
- deterministic fixed RNG.

### Regression fixtures

**R01–R04 = 4/4 PASS**

- R01: real **The Doomsday Clock** semantic pattern preserves four distinct Resident methods.
- R02: world event / Witch Affect + valid Goth Girl silence.
- R03: HEARD vs OBSERVED asymmetry.
- R04: Lorekeeper signature motif borrowed by Clown without private-knowledge transfer.

### Total

**29/29 PASS · 0 failures**

GitHub Actions:

- workflow: `resident-chat-poc-01`
- evidence run: **36853118451**
- evidence head: `8c43e23ac1b9cd2d36a1176e6836837db390cff0`
- conclusion: **SUCCESS**
- job: `deterministic-kernel`
- syntax adapter: PASS
- syntax tests: PASS
- Node tests: **29/29 PASS**

The implementation/test blobs remained unchanged through the subsequent metadata commits.

## Source / design references retained

Current ChatterBox donor pins:

- `chatter-2d.js@5817807624d6df7430ad399be763e1fa3385ac8b`
- `mob-ai.js@a6f2127aaf243e08afa8b031e9445541633544a4`
- `bubble-layout.js@e84bbe454badddfbdaa64018e7e70de269a38a79`
- `bubble-ts.js@c1a00182ba502419491cbf895bc269588554b566`

Next presentation donor:

- `NPC-CARD-SPEC-01` recipe blob `e9b2aea0abc1bcb151fbc8cf5a08f7a6ae36689b`

Related Resident culture/memory design remains owned by Draft PR **#272**. This kernel does not replace its Lean Memory, POI/AIDA, Signature Deck or epistemic-culture contract.

## Changed files

Current candidate adds/updates:

1. `.github/workflows/resident-chat-poc-01.yml`
2. `skills/chat/workflows/RESIDENT_CHAT_POC_01_2026-10-01/src/resident-chatter-adapter.v0.1.mjs`
3. `skills/chat/workflows/RESIDENT_CHAT_POC_01_2026-10-01/test/resident-chatter-adapter.test.mjs`
4. `skills/chat/workflows/RESIDENT_CHAT_POC_01_2026-10-01/TEST_REPORT.md`
5. `skills/chat/workflows/RESIDENT_CHAT_POC_01_2026-10-01/SOURCE.json`
6. `skills/chat/workflows/RESIDENT_CHAT_POC_01_2026-10-01/CHANGELOG.md`
7. this `RETURN.md`
8. `skills/chat/START_HERE.md`
9. `skills/chat/CHANGELOG.md`
10. `kfb-hub/index.html`

Router/Hub changes only register the candidate and its one next gate. They do not publish a Stage.

## Public / visual evidence

- Browser/3D integration: **NOT TESTED**
- screenshots: **0**
- Cloudflare Stage deployments: **0**
- public URL: **none required for this headless kernel**
- Live promotion: **0**

No public/human visual claim is made.

## Unresolved / deferred

- Shared Triplet pool/Profile authoring remains **candidate content**, not promoted character canon.
- The deterministic output has not yet driven actual Resident mouth/gaze/bubble presentation.
- Existing ChatterBox runtime timing/budget has not yet consumed this Resident adapter in a real scene.
- Lean Memory persistence is not implemented by this kernel.
- Live LLM contextual rewriting is intentionally deferred.
- TTS/audio is intentionally deferred.
- Four-Resident 3D scene is intentionally deferred.
- PR #272 Resident Social Memory design and its Travel Social Card Relay candidate remain separate owners/lines.
- No auto-merge is authorized.

## Exactly one next gate

**RESIDENT-CHAT-PRESENTATION-01**

Use one isolated existing `NPC-CARD-SPEC-01` presentation fixture.

Replace **only** its local fixed Triplet recipe with deterministic `resident-chatter-adapter.v0.1` output.

Preserve:

- existing FrizzleBob/Goth Girl actor sources;
- existing mouth owner;
- existing gaze owner;
- existing bubble owner;
- existing renderer/camera;
- current ChatterBox timing/speech-budget ownership;
- real Card source.

Acceptance target:

1. exact existing donor shown/source-pinned;
2. deterministic shared-pool output visibly drives the two-Resident scene;
3. one normal speaker / bounded reply;
4. mouth + gaze + bubble follow the selected semantic turn;
5. no live LLM yet;
6. no second dialogue/timing/presentation owner.
