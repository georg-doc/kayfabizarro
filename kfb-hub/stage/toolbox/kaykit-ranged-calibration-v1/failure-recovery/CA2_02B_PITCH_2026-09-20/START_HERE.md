# CA2-02b Pitch · Failure Recovery

Status: **ARCHIVED_FAILED_CANDIDATE · DO NOT PROMOTE**

Two bounded pitch corrections failed the same near-horizontal Aim gate. Stop rule reached; no third blind Euler repair is allowed.

Read: `SOURCE_SNAPSHOT.md` → `docs/POSTMORTEM.md` → `docs/ATTEMPT_LOG.md` → `docs/NEXT_GATE.md`.

Editable failed source is preserved under `source/`.

The canonical public Stage was not replaced and remains the previous proven baseline:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/kaykit-ranged-calibration-v1/`

## One next gate

Consume a transform from Georg's external/universal inline 3D gizmo while the exact `Ranged_1H_Aiming` clip is frozen at a deterministic action time. Keep position/offset, scale, socket, muzzle geometry and release timing locked. Export one transform, then rerun one browser gate.
