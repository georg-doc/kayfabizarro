# RECOVERY · PROCEDURAL BUILDING B1 → B2

Status: **RECOVERABLE · B1 PASS · NEXT = EXISTING FACADE OWNER INTEGRATION**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01

## Fresh-chat instruction

Do not ask Georg to reconstruct this chat.

Read:
1. `SOURCE.json`
2. `RETURN.md`
3. `B1_TEST_REPORT.md`
4. `B1_GOLDEN_CORPUS_EXTRACTION_2026-10-02.md`
5. `B1_THREE_LANE_SOURCE_CONTRACT.md`
6. parent B0 `RECOVERY.md`
7. parent WC1 `START_HERE.md` / `RETURN.md`

GitHub state overrides chat memory.

## Exact lane

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/wc1-procedural-building-b1-2026-10-02`
- Draft PR: #322
- base: `chatgpt-web/wc1-procedural-building-b0-2026-10-02@d2834b94492a972513b58053f7c80b374b97d7b5`
- tested head: `191f79bed81e2e5a0b5486033532b9f0b32335a7`
- Stage: none
- merge: none
- Live: none

Fetch branch head before writing; docs will be newer than tested head.

## Last proven result

**B1_SOURCE_BOUNDED_SIBLINGS_PASS**

Full Golden corpus:
22 real Hürth V2 buildings.

Three sibling lanes:
- compact-simple: 4-corner `371401529` → envelope `371401477`;
- ordinary-notched: 7-corner `371401481` → envelope `371401497`;
- large-complex: 9-corner `371401488` → envelope `371401495`.

All:
- preserve topology donor corner graph;
- hit source-derived target area/aspect;
- inherit source envelope height/roof-height;
- use existing roof role only;
- run through accepted Elastic V2;
- remain base anchored.

Final run/job:
`37041339236 / 110951929252`

Artifact:
`11241588200`
digest:
`sha256:213cce3bcc928d21fe95b01d767bea508d9f75acb7e49433b2dd5a46d2e32e95`

Generator blob:
`9d45280f6497b109856254a4d71f017b8e41ff21`

Repair Pass 1:
evidence selector sync only; geometry unchanged.

## Existing owners

Body/roof:
`Elastic Grotesque Clay V2 @0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`

Façade:
`kfb-facade-rule-v1`

Material:
separate parallel lane.

## Exactly one next gate

# PROCEDURAL BUILDING B2 · EXISTING FACADE OWNER INTEGRATION

Do not copy `facadeSpecs()` into a new B2 module.

Find and use the current real WorldBuilder / World Integration presenter that already owns:
- `FACADE_RULE v1`;
- semantic road context;
- party-wall context;
- deformed detail placement.

Feed the three B1 sibling objects through that owner and prove their façade behavior.

No material decision.
No second presenter/deformer.
No generic façade generator.
