# FAIL_ANALYSIS · why the Birthday/WSA Curtain presentation failed, measured against the donor

## A · What the donor already does right
- Real two-panel compute cloth, symmetric open/close, no stripe artifact in motion (donor-02…04 moving frames).
- Closed state covers the centre (slight overlap), recloses cleanly after a full cycle (donor-06).

## B · What the donor gets wrong (found in isolation, frames in screenshots/donor-*)
| # | Finding | Evidence | Consequence |
|---|---|---|---|
| D1 | Opening slides **all** pins by one offset (`hookOffset = open × 1.55`). The panel translates; it never gathers. The lagging hem produces a diagonal flag-like splay; open panels leave the frame. | donor-02, donor-05 | reads as two flags on a rail, not a stage drape |
| D2 | Render-mesh loop uses `y < clothNumSegmentsX` (30) while the sim has 40 rows → the lower 25 % is simulated but never drawn. | code line in `_setupMesh` | curtain looks short; hem never reaches a floor |
| D3 | Material is `transparent, opacity 0.85`. | mat-01: actor visible through the closed donor material | a loading/reveal cover that does not cover |
| D4 | Both panels coplanar with 6 cm overlap. | donor-01 centre line | visible seam / z-fight at the centre |
| D5 | Cloth is authored horizontal and falls into place. | first ~300 frames | cannot be shown immediately as a settled cover |
| D6 | No rail, rings, pelmet, proscenium or floor; white sheen 1.0 on #8c3f37; HDR esplanade background. | donor-01 | satin sheet floating in a plaza, no theatre read |
| D7 | WebGPU only; page-visibility timer → frozen in hidden/background frames. | handover + probe | needs host-owned clock and an explicit fallback state |

## C · Consumer failure (Birthday/Astra, Golden Journey Beat 0) diagnosed
1. **Identity moved off the curtain.** The flow put a clay BLÖDSINN! plaque and an Enter plaque in front of the curtain and let them carry loading and identity. Because the donor curtain itself had no theatre read (D1, D6), the sign had to compensate. Fix here: the stage carries identity; no plaque, sign or wordmark exists in the candidate.
2. **Cover was not a cover.** D3 + D4 make the closed state leak the world behind it. Fix: opaque cloth, right panel 3.5 cm behind, masking border above the rail.
3. **Cheap motion.** D1 (translation) is the "cheap/wrong curtain behavior". Fix: pins gather toward the wing with pleat depth derived from pin spacing.
4. **Loading feedback had no physical carrier**, so it became UI. Fix: footlight level follows real loader progress; a single small text line, removable.
5. **Enter/click feedback unreliable.** Fix: one input path (Enter/click → `requestReveal()`), and the core refuses to open until the host sets `revealAllowed`, so the visible prompt only appears when the host fact is true.
6. **Process pattern (FAILURE_TIMELINE):** abstraction before inventory and late visible frames. Here the donor was rendered unchanged first and every tune is tied to a donor frame.
