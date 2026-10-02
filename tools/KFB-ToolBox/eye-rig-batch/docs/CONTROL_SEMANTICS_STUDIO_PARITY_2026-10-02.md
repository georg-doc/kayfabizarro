# EyeRig Batch · Control Semantics / Studio Parity R1 · 2026-10-02

Status: **IMPLEMENTED · FOCUSED TEST PASS · STAGE PENDING**

## 2026-10-02 · CONTROL SEMANTICS / STUDIO PARITY R1

Georg found a real control leak: changing **Eye size (ring)** also changed eye seating depth because raw EyeRig v6 uses:

`C = surface - R * (0.24 + inset * 1.15)`, with `R = U * ring`.

### Donor comparison

Read before repair:

- Pet Studio v12 Face/Eyes UI · blob `90ec845ba09f7ed8a76124bb5b5b905a5e9ad82f`:
  - Spacing → `anchor.dx`
  - Height → `anchor.dy`
  - Eye size (ring) → `anchor.ring`
  - Gaze drift → `anchor.track`
  - Pupil size / Gloss / lashes
- shared EyeRig v6 remains the geometry owner.
- later ToolBox/Studio `face-mount.v1.js` · blob `5424bff3f9924587fa3d321138eb8b44915b6550` demonstrates the intended adapter pattern: keep owner fields, then correct mounting/surface semantics outside the raw geometry owner.

### Repair

No EyeRig-v6 fork.

Batch adapter now provides:

- `setRingPreserveCenter(newRing)`: changes ring while compensating the radius-relative internal inset so the eye-centre seat stays invariant;
- `setTrack(track)`: updates gaze amplitude directly without rebuilding the EyeRig;
- app routes `dx/dy`, `ring`, `track`, and `inset` through separate semantic paths;
- visible UI wording now follows Studio: **Spacing · Height · Eye size (ring) · Gaze drift**.

Intent matrix:

- Spacing → X placement only
- Height → Y placement only
- Eye size (ring) → size only; eye centre locked
- Inset → depth only
- Splay → orientation + surface seating (intentional coupled motion on curved head)
- Lid fit → lid geometry only
- Oval W/H/D/Tilt → eye shape only
- Pupil size → pupil geometry only
- Gaze drift → gaze amplitude only
- Converge → pupil aim only
- Gloss → material only

### Focused evidence

Head tested: `7d8198f43580c5e2725e59ec5c15c19aaed04c7c`

- focused source/contract checks: **16/16 PASS**
- app syntax: PASS
- adapter syntax: PASS
- ring/depth seat invariant: **252/252 numeric cases PASS**
- maximum numeric seat error: `8.881784197001252e-16`
- Track path verified as direct `anchor.track + _max` update, no `build()` call
- Studio-parity labels/hint verified

The historical broad 95/95 suite remains historical; this slice does not relabel it as current.

## Why the numeric Inset value may change when Eye size changes

EyeRig v6 stores inset in **eye-radius units**. To keep the physical eye centre fixed while radius changes, the adapter must recalculate that dimensionless internal number. This is deliberate compensation: the **visible depth does not move**, even though the stored `inset` coefficient changes.

No new profile schema was introduced; the existing EyeRig fields remain authoritative.

## One next gate

Mirror this exact implementation to the existing EyeRig Stage, then Georg checks:
1. Eye size over a large range while watching the eye centre;
2. Inset independently;
3. Height / Spacing independently;
4. one Splay test to confirm that its surface-following motion is the only intentional positional coupling.
