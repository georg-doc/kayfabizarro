# Rig_Large reviewed batch + lid color fix · 2026-09-20

Status: IMPLEMENTED CANDIDATE

## Accepted Large profiles

Source:
`tools/KFB-ToolBox/_inbox/eye-rig-large.batch.json`
at `main@52532aee17f85324a6d04ab53150216f00ac5d89`
blob `f55db82d1a76ba9362df261cf66517859abbf953`.

Accepted profiles:
- Monstrosity
- Black Knight
- Demon Lord
- Orc Brute

Their placement / size / inset / oval values are copied into:
`data/rig-large-reviewed.v1.json`.

The old common fallback lid base `#b58f83` is deliberately not persisted in the reviewed copy.

## Lid color bug

Problem:
all generic actors inherited the same fallback lid base instead of their own source face/head color.

Repair:
- new `lib/face-color-sampler.v1.js`;
- reuses the same canvas / UV / flipY sampling pattern already proven in `graft-biped.v1.js`;
- samples the source head texture around the current EyeRig eye positions;
- chooses the dominant sampled palette color;
- stores it as `sourceFace.faceColor`;
- applies it to EyeRig as `eye.baseColor`;
- EyeRig v6 keeps ownership of the actual lid darkening.

Explicit actor colors remain authoritative. GothGirl therefore keeps its existing explicit face color.

## Persistence order

`class start → accepted reviewed actor profile → local/session override`.

The accepted Large batch seeds the four actors, while newer local edits still win.

## Tests

- full persisted contract suite: 95/95 PASS
- app syntax: PASS
- face-color sampler syntax: PASS
- generic cleanup syntax: PASS
- EyeRig adapter syntax: PASS

## Human check

Reload the Stage and inspect the four Large actors.

Expected:
- the accepted eye placements remain;
- lid tones are no longer the same pink fallback;
- each generic actor derives its lid base from its own source head/face texture and EyeRig darkens it.
