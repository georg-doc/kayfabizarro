# TEST REPORT · RESIDENT-CHAT-POC-01 · deterministic adapter kernel

Date: 2026-10-01  
Status: **TESTED PASS · HEADLESS SEMANTIC KERNEL ONLY**

## Scope

This report covers only the pure deterministic Resident semantic adapter.

It does **not** claim:
- live LLM generation;
- ChatterBox runtime integration;
- Resident 3D presentation integration;
- TTS/audio;
- browser/Stage/public verification;
- Georg human acceptance.

## Exact tested source

Repository: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/resident-chat-poc-01-2026-10-01`  
Tested branch head before this evidence write: `83dc10a567835aa0e509b11b85cbd882389c579d`

Exact branch blobs executed:

- `src/resident-chatter-adapter.v0.1.mjs`
  - GitHub blob: `bc3cf5194747bcb71b2b93bcfdec349c9db710f2`
- `test/resident-chatter-adapter.test.mjs`
  - GitHub blob: `9af4260f24ab5eeec3656066c38c7962c5208fc9`

The local execution copies were checked with `git hash-object`; both hashes matched the GitHub branch blobs exactly before execution.

## Environment

- Node.js `v22.16.0`
- no npm dependencies
- no network dependency
- no optional helper CLI required

## Commands actually run

```text
node --check src/resident-chatter-adapter.v0.1.mjs
node --check test/resident-chatter-adapter.test.mjs
node --test test/resident-chatter-adapter.test.mjs
```

## Results

Syntax:
- adapter: **PASS**
- test suite: **PASS**

Node test runner:
- tests: **29**
- pass: **29**
- fail: **0**
- skipped: **0**
- todo: **0**
- suites: **0**
- measured run duration: approximately **85 ms**

### Kernel contract · T01–T25

**25/25 PASS**

Coverage includes:

1. Lorekeeper uses the shared pool.
2. Goth Girl uses the same shared pool.
3. Clown uses the same shared pool.
4. Witch uses the same shared pool.
5. No private Resident pool required.
6. Observed source fact can satisfy eligibility.
7. Unseen source fact is rejected.
8. HEARD cannot satisfy OBSERVED.
9. Absent Resident does not inherit Card context.
10. Same Witch under INTRIGUED vs IRRITATED can select different valid candidates.
11. Same Affect across Residents does not collapse signature methods.
12. SILENCE is a valid output.
13. KayfaBingo can land and return closure to the player.
14. KayfaBongo must carry established semantic material.
15. KayfaBoggle must reframe established material.
16. BLÖDSINN! objects without mutating hostility.
17. Authored Fluff-o-lect target passes.
18. Random/unlisted Fluff-o-lect target fails.
19. Borrowed signature requires unlock and retains provenance.
20. Borrowed signature is transformed by the current speaker method.
21. Repetition penalty prevents a signature catchphrase loop.
22. `transformIntent` survives selection unchanged.
23. Adapter output cannot write reward/POP state.
24. Adapter output cannot write animation/bone/clip state.
25. Fixed RNG is deterministic.

### Existing authoring regressions · R01–R04

**4/4 PASS**

- **R01 · Doomsday Clock:** one shared Card context still produces four distinct Resident methods.
- **R02 · World Event:** Witch Affect changes semantic consequence while Goth Girl may correctly remain silent.
- **R03 · HEARD vs OBSERVED:** asymmetric knowledge remains intact; an absent Lorekeeper stays ignorant.
- **R04 · Borrowed Signature:** Clown can reuse a Lorekeeper semantic motif only after unlock, retains provenance, transforms it through his own method, and receives no private Lorekeeper memory.

## Ownership checks

PASS:

- no write to `mob-ai.js`;
- no write to `chatter-2d.js`;
- no write to `bubble-layout.js`;
- no write to `bubble-ts.js`;
- no movement/camera/reward owner introduced;
- no private per-Resident phrase bank introduced;
- no direct persistent-memory write;
- no exact animation/bone/clip command in adapter output.

Protected model remains:

`host event → speaker knowledge filter → shared Triplet pool → Resident signature + Attitude/Affect weighting → validated semantic candidate → existing ChatterBox/presentation owners`

## Open items

- Candidate pool/profile content is still authoring candidate, not promoted character canon.
- No actual `NPC-CARD-SPEC-01` presentation consumer has consumed adapter output yet.
- ChatterBox speaker/timing integration is therefore still unproven in a real Resident scene.
- Live LLM contextual rewriting remains intentionally deferred.
- No Stage route is needed for this headless kernel.

## Exactly one next gate

**RESIDENT-CHAT-PRESENTATION-01:** mount deterministic adapter output into one isolated existing `NPC-CARD-SPEC-01` presentation fixture, replacing only its local fixed Triplet recipe while preserving its existing actor, mouth, gaze, bubble, renderer and camera owners. No live LLM yet.
