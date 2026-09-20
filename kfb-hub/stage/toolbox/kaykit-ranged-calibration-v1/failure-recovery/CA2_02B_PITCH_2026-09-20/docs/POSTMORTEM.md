# Post-mortem

## Goal
Keep the acceptable fist/grip seating and lower standard Aim toward horizontal. No inline gizmo, locomotion changes or Arena ballistics ownership in this slice.

## Attempts

| Pass | X delta | Effective Euler | Aim world pitch | Result |
|---|---:|---|---:|---|
| 1 | -5° | [-19,77,0] | +12.471° | FAIL |
| 2 | +1.5° | [-12.5,77,0] | +5.151° | FAIL / STOP |

## Working
Exact gun donor, materials, fist seating, common Rig_Medium `handslotr`, muzzle extraction, release `0.150 s`, source-first Stage and prior public baseline.

## Proven
- More-negative X Euler raised the measured world muzzle pitch in pass 1.
- Pass 2 improved the pitch but still missed the ±3.5° gate.
- Current Aim proof samples a live looping clip after a wall-clock wait rather than an explicitly frozen action time.

## Hypotheses
- Loop phase contributes to visual/pitch variance.
- Two-point linear extrapolation predicts zero pitch near X Euler **-7.93°** (~+6.07° from Studio base). This is **NOT TESTED / NOT PROMOTED** and must not become a default.

## Decision
No third blind Euler pass. Preserve the candidate and switch authoring method.
