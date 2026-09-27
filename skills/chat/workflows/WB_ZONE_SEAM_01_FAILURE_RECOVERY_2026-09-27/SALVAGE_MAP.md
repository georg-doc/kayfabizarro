# SALVAGE MAP · WB-ZONE-SEAM-01

| Part | Status | Reason | Next owner |
|---|---|---|---|
| WORLD-ZONE manifest loader / validation | REUSE_CANDIDATE | identity/storage assertions pass | WorldBuilder seam after parity gate |
| WB2 `zoneRef = manifest + transform` | REUSE_CANDIDATE | matches bake contract | WorldBuilder |
| baked support/collision → `heightAt` seam | REUSE_CANDIDATE | contract-shaped, not runtime-regressed yet | WorldBuilder after parity gate |
| railway/Hbf presentation metadata reuse | NEEDS_ISOLATED_TEST | deliberately outside v1 bake schema | existing presenter |
| historical Track conflicts deferred/inactive | REUSE_CANDIDATE | correct owner boundary; current WB2 has no Track socket | Race/World socket later |
| LOOK-TORSION height profile in `wd1-city.js` | REUSE_CANDIDATE | uses existing Elastic owner; browser not reached | World presenter after parity gate |
| vertex-average crop | REJECTED_FOUNDATION | 368/369 | none |
| polygon-area centroid crop | REJECTED_FOUNDATION | 370/369 | none |
| bbox-centre crop | REJECTED_FOUNDATION | 370/369 | none |
| full current branch | ARCHIVED_FAILED | blocked before runtime regression | diagnostic gate only |

Do not cherry-pick the runtime candidate into PR #190 until WB-ZONE-CROP-PARITY-01 passes.
