# ATTEMPT LOG · WB-ZONE-SEAM-01

## Candidate implementation

Implementation assembled on `chatgpt-web/wb-zone-seam-01-2026-09-27` from accepted WB2 head `58028b07d...`.

Key implementation checkpoints:
- `1d4b035e` — baked World Zone adapter behind existing seam;
- `7e59b2d3` — Cologne selects pinned bake + WB2 manifest ref;
- `ab28499d` — LOOK-TORSION calibration consumed by existing Elastic presenter;
- `785dac36` / `a3969595` — integrated Cologne runtime assertions and browser count;
- `8f8d7039` / `301b0448` / `6f3e60df` — exact seam test + owner checks + CI.

## Gate attempts

### Initial candidate · run 36291539816
Head: `6f3e60df4a43bb348040616fabc3fb726af0599d`

- manifest id: PASS
- manifest revision: PASS
- WorldBuilder storage contract: PASS
- frozen crop building parity: **FAIL · 368 !== 369**
- rule: vertex-average centre
- later static/browser steps: SKIPPED

### Repair 1 · run 36291711090
Head: `f01bb78a783f0e366b5baf6526cbbb7a96d456bc`

Change:
- vertex average replaced with polygon area centroid.

Result:
- first three contract checks PASS
- frozen crop building parity: **FAIL · 370 !== 369**
- later static/browser steps: SKIPPED

### Repair 2 · run 36291859889
Head: `2224d95d15fabb99a6a64f77ec863d37f9134fd3`

Change:
- polygon centroid replaced with bbox centre, matching current OSM City `cartoon-city.js#buildingCenter`.

Result:
- first three contract checks PASS
- frozen crop building parity: **FAIL · 370 !== 369**
- later static/browser steps: SKIPPED

## Stop decision

Two repairs failed the same gate. Per KFB stop rule:
**NO REPAIR 3. FREEZE + EXPORT.**
