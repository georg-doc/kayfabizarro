# RETURN · PROCEDURAL BUILDING B0

Status: **GOLDEN FAMILY SOURCE ISOLATION PASS**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01

## Outcome

B0 successfully anchors the first ordinary low-rise procedural building family to the accepted Hürth V2 geometry without introducing a new deformer.

Exact family spec:
`B0_GOLDEN_FAMILY_SPEC_2026-10-02.md`

Canonical recovery:
`RECOVERY.md`

## Exact state

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/wc1-procedural-building-b0-2026-10-02`
- Draft PR: #319
- base: P2 recovery head `b36e79cfc3bf927fd975ced7f2e9961ba8e930ab`
- tested head: `86d5512fdf40b5fc9a2f83b2be6ff6666e82f062`
- Stage: none
- merge: none
- Live: none

## Golden controls

- compact flat: `way/371401529`
- larger gable: `way/371401492`
- compact hip: `way/371401475`

All from the accepted 22-building Hürth V2 viewer corpus.

## Proven result

Final run/job:
`37034478056 / 110929154453`

Evidence:
`11238965649`
`sha256:b867700e2974c2392391195cc57cee6c267b85acd0ee41172b6c34f274776650`

For all three Golden controls:
- exact V2 source pin;
- exact source id/height/roof;
- V2 body hash == B0 body hash;
- V2 roof hash == B0 roof hash;
- base anchored;
- four separated review stages;
- one renderer;
- no material decision;
- no WC1 integration.

Raw KayKit `building_A` is source-proven separately as cartoon-DNA side donor and is not the deformation owner.

## Known boundary

Normal-building façade authority is `kfb-facade-rule-v1`.

B0 does not clone it into the isolation viewer; this avoids a second façade owner.

The known roof-lid/overhang tune is explicitly deferred rather than guessed.

## Exactly one next gate

**PROCEDURAL BUILDING B1 · GOLDEN FAMILY SIBLINGS**

Measure the full 22-building Hürth fixture and derive bounded sibling variation from actual source distributions before generating any new building family members.
