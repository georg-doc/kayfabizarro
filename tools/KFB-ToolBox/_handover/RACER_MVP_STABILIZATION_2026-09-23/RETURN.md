# RETURN · KFB Racer MVP Stabilization · RSTAB-1 · 2026-09-23

Status: **RSTAB-1 TECHNICAL PASS · HUMAN GEOMETRY GATE NEXT · NO RSTAB-2 YET**

## Runtime owner / candidate

Repository:

`georg-doc/KFB-Stunt-Car-Race`

Source lineage:

`main@cc80f4a1c6c509db9668df79fd53b13cee093a9d`
→ `KFB Cologne Race Option C-3/`

RSTAB-0:

- Draft PR #31
- `chat/racer-rstab0-audit-2026-09-23@58d837a5b858bdf7af178bcf0bb578d6ab018ff4`

RSTAB-1:

- Draft PR **#32**
- branch `chat/racer-rstab1-geometry-2026-09-23`
- exact runtime + bounded-CI candidate head `e9c72a404aff63d46762d9101a727a9e7f94a6b0`
- current branch additionally carries only RSTAB-1 Return/Recovery metadata after that runtime head.

No merge, Stage promotion or Live promotion is authorized.

## RSTAB-1 outcome

Two static geometry owners were repaired without changing route or accepted driving feel.

### Ground wedge / tunnel-cut seam

Root mismatch:

- visible shell is banked and rendered as a 14-facet cross-section;
- old ground-cut seam used one symmetric smooth-shell approximation.

On banked tunnel points the real left/right ground intersections are different, so one common half-width could place ground inside the visible shell on one side and leave a gap on the other.

Repair:

- `tunnelShellGroundSpan()` consumes the same banked 14 shell vertices used by the renderer;
- independent left/right ground-cut edges;
- 10-point smooth transition;
- 0.03 m hole-side seam clearance;
- no later `SLEW_M` mutation after a point is marked covered.

### Support pillars

Old code calculated the banked local support point but ignored its `y` and sized pillars from centerline height.

Repair:

- `structurePillarSpan()` uses each real local banked soffit endpoint;
- existing support cadence remains unchanged;
- support count remains **54**;
- no global shortening or deletion.

## Actual evidence

GitHub Actions:

- workflow `Racer RSTAB-1 geometry`
- run **35807766171**
- job **107012285119**
- Node **22.23.2**
- result **SUCCESS**

TAP result:

**5 tests · 5 PASS · 0 FAIL**

The bounded regression proves:

- route remains **598 points / 2063.844351 m**;
- support roster remains **54**;
- old support rule reproduces exactly the three RSTAB-0 penetrations **166 / 179 / 187**;
- repaired support rule yields **0** road penetrations;
- both rendered-shell side intersections resolve at all **44** tested tunnel-cut points;
- every fully covered cut edge matches its actual rendered shell seam + 0.03 m;
- transition edge step remains **< 1.1 m**;
- old symmetric-shell / `SLEW_M` runtime fallback is absent.

## Race evidence packet

On Draft PR #32:

`_handover/RACER_MVP_STABILIZATION_2026-09-23/RSTAB-1/`

contains:

- `TEST_REPORT.md`
- `LOCAL_PREVIEW.md`
- `CHANGELOG.md`
- `RETURN.md`

Race `RECOVERY.md` is updated on the same branch.

## Preserved boundaries

Unchanged:

- `cologne-route.v1.js`;
- all route control points;
- v0.8 FLOW / FEEL;
- camera;
- vehicle grounding;
- HUD / billboards;
- audio;
- trails;
- roster.

RSTAB-2 hard-curve work is **not started**.

## Browser / human status

This Web environment cannot execute the private C-3 WebGL surface.

Therefore:

- technical RSTAB-1 = **PASS**;
- human-visible WEDGE/PIER acceptance = **PENDING**;
- no screenshot/full-lap browser PASS is claimed.

The local development review procedure lives in the Race RSTAB-1 packet. Local HTTP is an edit-review surface, not the public acceptance surface.

## Public Stage

Historical route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/cologne-option-c/`

Current classification:

**HISTORICAL SNAPSHOT · NOT C-3 / NOT RSTAB-1 PROOF.**

No Cloudflare publication happened in RSTAB-1.

## Exactly one next gate

**RSTAB-1 HUMAN GEOMETRY GATE**

Review only:

1. tunnel/ground-cut approach in normal CHASE;
2. support endpoints around the previous 166 / 179 / 187 region.

Only a human **ACCEPT** advances the project to **RSTAB-2 hard-curve stability**.
