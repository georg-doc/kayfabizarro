# RETURN · KFB Racer MVP Stabilization · RSTAB-0 · 2026-09-23

Status: **RSTAB-0 MAPPED · RACE DRAFT PR #31 · NO RUNTIME REPAIR**

## Runtime owner

`georg-doc/KFB-Stunt-Car-Race`

Locked Claude export:

`main@cc80f4a1c6c509db9668df79fd53b13cee093a9d`
→ `KFB Cologne Race Option C-3/`

RSTAB-0 branch / PR:

- branch: `chat/racer-rstab0-audit-2026-09-23`
- Draft PR: `georg-doc/KFB-Stunt-Car-Race#31`
- exact verified Race branch head at this coordination update: `58d837a5b858bdf7af178bcf0bb578d6ab018ff4`

No merge or Live promotion is authorized.

## Source lock

C-3 GitHub ↔ Dropbox unpacked roster:

- **38/38 files**
- **1,118,828 B** on each side
- **0** path/size differences

Dropbox ZIP:

- revision `65c1befc3cb9b4602da6f`
- size `285032 B`
- content hash `a90393e9625a513a2450b131f5fd446f5025c77b6ab297e2216e6e3e24276075`

## RSTAB-0 result

Three P0 owners are separated:

### RSTAB-WEDGE-01 · CORE_BLOCKER

Current human ground-wedge report remains open. Source owner is localized to the C-3 ground-cut ↔ tunnel-shell seam around route indices ~75–140. Existing `auditRoute()` excludes ground geometry, so historical zero-intrusion results do not close this gate.

### RSTAB-CURVE-01 · CORE_BLOCKER

First major hard bend:

- peak route index 176
- 29.4%
- s≈589.1 m
- radius ≈35.3 m
- bank ≈24.0°

Unchanged v0.8 full-steer radius at 41 m/s is ≈61.6 m. The route is source-smooth but locally outside the ordinary v0.8 steering envelope at normal maximum race speed. Do not globally retune driving feel to mask it.

### RSTAB-PIER-01 · CORE_BLOCKER

**54/54** generated `structure-pillar` placements were source-audited.

Three deterministic downhill supports extend above the banked local road surface:

- index 166: +0.38 m
- index 179: +1.89 m
- index 187: +0.61 m

The existing `auditRoute()` excludes `structure-*`, so its old zero count never tested this support-clearance case.

## Carried later gates

- tunnel dark/brown sightline;
- vehicle grounding / ride-height presentation;
- engine/audio chain;
- trail/speedline folding.

They remain recorded but do not delay the first static-geometry repair.

## Evidence packet

Race PR #31:

`_handover/RACER_MVP_STABILIZATION_2026-09-23/RSTAB-0/`

contains:

- `SOURCE_LOCK.md`
- `LOCAL_PREVIEW.md`
- `RACER_SHOWSTOPPER_MATRIX.md`
- `TEST_REPORT.md`
- `CHANGELOG.md`
- `RETURN.md`

Race `RECOVERY.md` is updated on the same branch.

## Actual checks

- source roster: **38/38**
- route: **598/598**
- supports: **54/54**
- deterministic support penetrations: **3**
- required showstopper entries: **7/7**
- runtime files changed: **0**
- new browser runs claimed: **0**
- new screenshots claimed: **0**
- public deployment claims: **0**

`game-dev` unavailable once; repository-native fallback used. No sealed Game Development Studio claim.

## Local preview

From a local Race checkout:

```bash
cd "KFB Cologne Race Option C-3"
python3 -m http.server 8787 --bind 127.0.0.1
```

Open:

`http://127.0.0.1:8787/KFB%20Cologne%20Race%20Option%20C.dc.html`

## Stage

Historical intended route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/cologne-option-c/`

Status for C-3 / RSTAB-0:

**NOT PUBLISHED · NOT PUBLIC_VERIFIED**

The existing Stage must not be used as proof of the C-3 candidate.

## Exactly one next gate

**RSTAB-1 · static geometry intrusions — ground wedges + support pillars.**

No curve tuning until those static geometry ambiguities are removed.
