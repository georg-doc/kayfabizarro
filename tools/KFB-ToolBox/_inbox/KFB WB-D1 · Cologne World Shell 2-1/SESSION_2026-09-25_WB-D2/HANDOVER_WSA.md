# HANDOVER · WSA Lead Chat · WB-D2 · Sprint 1 · 2026-09-25

**Additive to** `SESSION_2026-09-24_WB-D1/HANDOVER_WSA.md`. Everything there still applies: owner boundaries, seam, host settings, findings 1–5, and the WB-ZONE-SEAM-01 gate.
**Status:** CANDIDATE. Georg says "top!" about the Hürth-Alstädten look and the shadow fix. The sign anchoring is still open (B2).

## What is new
- **Three zones, one shell, one seam:**
  - `cologne-dom`: full, with region, landmarks and socket.
  - `huerth`: lite.
  - `alstaedten`: lite, plus homebase.
  - Zone switch uses the chip, and still reloads (S1.2 open).
- **Global facade rule** `kfb-facade-rule-v1` for all zones (CHANGELOG v0.9).
- **Contact shadows fixed** (v0.10). The shadow box now follows the camera, and wall feet are sunk below ground.
- **Street names**, module `wd1-names.js`. Two views, road text and floating signs, plus the homebase marker (v0.12).
- **Stotzheimer Str. 26 is the homebase** of zone `alstaedten` (`way/372632503`).

## Findings for other lanes (continue the numbering)
6. **`huerth-v0` is mislabelled (OSM City Lab):** the source label says "Stotzheimer Straße pilot", but the bbox centre 50.8659 / 6.877 is Hürth-Mitte. Stotzheimer Str. 26 lies ≈ 1.97 km NNW, at 50.88335 / 6.86070. Fix the SOURCE_SPEC or rename the dataset.
7. **Rule deviation to reconcile:** `huerth-alstaedten-v0` was fetched inside Claude Design (OSM API 0.6 map, on Georg's request). The OSM City Lab should re-cache it with a SOURCE_SPEC and PROVENANCE. The fixture is then swapped behind the same seam, and no presenter change is needed.
8. **Height coverage in Alstädten:** only 23 of 1108 buildings carry `building:levels`, and none has `height`. 675 heights are seeded. NRW 3D building data (LoD1/LoD2, open data) would give real heights. Georg can get the data.
9. **Shadow finding for every three.js lane (WB-W0, WorldBuilder):** a large `normalBias` or `bias` on a long depth range causes peter-panning, meaning the shadow detaches from the object's foot. Scale `normalBias` to the texel size and keep near/far tight.
10. **Ground-map resolution is the common root** of the pixelated rails (v0.7) and the pixelated road edges (B1). One ground canvas at 0.17–0.2 m/px cannot carry thin lines at street level.

## CHANGE LOCK (additive only)
**Frozen: do not edit. A change means a new id or version beside the old one:**
- `fixtures/*.json`: new data goes into a new fixture id. Never rewrite a frozen fixture.
- Seam field names in `wd1-seam.js`: fields may only be added. v0.11 added `home`.
- `FACADE_RULE` `kfb-facade-rule-v1`: changes become `…-v2`, and v1 stays selectable.
- Palette `KFB_WONKY_90S_CLAY_V1`, and the donor pins @c049cae386e1 · @0c59e92d · edit-layer @8922d4b1.
- `w0-region.js` and `w0-ink.js` are **shared** with WB-W0 and stay unchanged.
- `CHANGELOG.md` is append-only. Entries are never rewritten, only corrected by a newer entry.

**Allowed additively:**
- new zones in `ZONES`;
- new modules (`wd1-*.js`);
- new drawer sections and DC props;
- new host settings, each named in this handover.

**Needs the WSA lead's OK:** anything that touches the owner boundaries: new OSM fetches, the drivability or collision model, or the track module.

## Open (this lane)
- **B1** · pixelated road edges. **B2** · sign anchoring at the road edge. **S1.2** · live zone switch. **S1.3** · shared frame and connections. **S1.4** · Hürth landmark. Details are in `BACKLOG_SPRINTS.md`.

## Next integration gate (unchanged, plus)
- **WB-ZONE-SEAM-01**, as in the 24.09 handover.
- **Plus:** before the next WB-D sprint, the **new WorldBuilder/editor** is integrated. The shell has to dock onto it through the seam and its edit-layer, not the other way round. See `START_NEXT_CHAT.md`.
