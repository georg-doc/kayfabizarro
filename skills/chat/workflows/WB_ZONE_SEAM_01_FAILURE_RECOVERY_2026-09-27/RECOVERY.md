# RECOVERY · WB-ZONE-SEAM-01 · 2026-09-27

Status: **ARCHIVED_FAILED_CANDIDATE · STOP RULE ACTIVE**  
Owner: **existing WorldBuilder / OSM City Lab seam**  
Repo: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/wb-zone-seam-01-2026-09-27`  
Draft PR: **#252**  
Stacked base: PR #190 / `chatgpt-web/worldbuilder-wb2-terrain-sculpt-2026-09-23@58028b07d7618926c40ffaec3bd4053dc88c0efd`

## Goal

Consume the accepted WORLD-ZONE-BAKE-01 Cologne package inside the real WB2 / World Integration owner, while carrying the LOOK-TORSION architecture pass into the existing `wd1-city.js` Elastic presenter.

No new WorldBuilder, no new presenter, no pseudo human-review page, no Hürth R2 repair.

## What is proven

- WORLD-ZONE-BAKE-01 donor is pinned to PR #241 head `3b4909d4c83b704662e66b60212e7f20ba5cf662`.
- Manifest schema/id/revision validate: `kfb.world-zone.manifest.v1 · cologne-dom-zentrum-v0 · 2026-09-24.1`.
- WorldBuilder storage contract validates: **zone manifest reference + transform only**.
- The adapter uses baked normalized semantics + baked support/collision; no runtime Overpass path is introduced.
- Hürth and Alstädten sources remain on their existing fixtures.
- Protected landmarks retain `wd1-landmark.js`.
- LOOK-TORSION is consumed only as a height-dependent calibration of the existing Elastic deformer; no second deformation owner was created.
- Historical Track conflict ids are retained only as deferred metadata because the current WB2 world does not mount a Race Track socket.

## Failure evidence

The first blocking gate is exact parity with the already-frozen Cologne presentation crop:
**frozen fixture = 369 buildings**.

The documented crop wording is only:
`buildings/landuse by centroid inside`.

Three plausible deterministic interpretations produced different results on the same baked normalized source:

| Run | Candidate rule | Result | Workflow |
|---|---|---:|---|
| initial | vertex-average centre | **368** | 36291539816 |
| repair 1 | polygon area centroid | **370** | 36291711090 |
| repair 2 | bbox centre, matching current City `buildingCenter` donor | **370** | 36291859889 |

All three runs passed the manifest id/revision/WorldBuilder-storage assertions before failing at building-count parity.

Because the seam gate fails first, **World r2 static checks, Hürth browser, Cologne browser and WB2 34/34 were not executed for this candidate**. Do not infer a runtime PASS.

## Proven cause vs unknown

**PROVEN**
- the baked package itself reaches and passes its identity/storage contract;
- the mismatch is in reconstruction of the historical frozen crop selection;
- the surviving crop metadata is insufficient to distinguish the exact original 369-building rule;
- two repair passes on the same gate are exhausted.

**UNKNOWN**
- exact identity of the boundary building(s) responsible for 368/370 ↔ 369;
- whether the old generator used strict boundary comparison, epsilon, pre-rounded centre, another centroid helper, or one additional filter not preserved in the fixture metadata.

Do not encode a special-case building id or silently relax parity.

## Salvage

Retain the candidate branch unchanged as engineering evidence. See `SALVAGE_MAP.md`.

## Exactly one next gate

**WB-ZONE-CROP-PARITY-01 · diagnostic only.**

On a fresh diagnostic branch, read the pinned 7.2 MB baked `normalized.json` and frozen fixture in a repository-native script and print:
- missing/extra building ids for vertex-average, area-centroid and bbox-centre rules;
- each differing building's exact centre(s), bbox and relation to the four crop boundaries;
- strict `<` vs inclusive `<=` and a named rounding/epsilon test.

The gate passes only when one deterministic rule reproduces **exactly the frozen 369-id set**, not merely the count.

No renderer, WorldBuilder runtime, Stage page or human review is needed for this diagnostic.

Only after that PASS may WB-ZONE-SEAM-01 be restarted from this preserved candidate.
