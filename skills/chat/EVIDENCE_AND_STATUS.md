# KFB Evidence and Status Vocabulary

Use these labels literally where practical.

## Work status

- `PROPOSAL` — suggested direction, not approved or implemented.
- `DECISION` — approved product/contract choice.
- `IMPLEMENTATION` — code/data/docs exist, not necessarily proven in runtime.
- `TESTED RESULT` — result supported by the named test context.
- `HUMAN FREEPLAY / GEORG PASS` — Georg personally accepted the visible/playable result.
- `DEFERRED` — intentionally postponed.
- `UNRESOLVED` — contradictory or insufficient evidence.
- `SUPERSEDED` — retained history replaced by a named successor.
- `ARCHIVED HISTORY` — historical reference only.

## Evidence ladder

1. Source read / donor identity
2. Static or numerical test
3. Integration/unit/regression test
4. Real browser/render/playback QA
5. Public deployment QA where relevant
6. Georg visual/freeplay acceptance

Do not skip labels between levels. A high-level PASS must name the level actually tested.

## Common non-equivalences

- donor PASS != consumer integration PASS
- GLTF geometry probe != rendered fit PASS
- Node test != browser gameplay PASS
- HTTP 200 != visible asset PASS
- browser automation PASS != Georg feel/look acceptance
- public mirror byte equality != gameplay acceptance
