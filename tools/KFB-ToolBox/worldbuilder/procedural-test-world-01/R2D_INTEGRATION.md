# R2D → WB2 integration · current-main convergence

## Owner rule

WB2 is the sole renderer/world/edit/support owner.
R2D contributes deterministic world data and presentation adapters only.

## Exact donor

R2D v0 donor:
`tools/KFB-ToolBox/_inbox/KFB World Core R2D v0 Insel/kfb-r2d-session-2026-10-03/KFB_R2D_v0/island.js`
blob `6952697d7d3c9cd159ac3fdd924f24fa333c904d`.

## Reused seams

- `r2d-island-core.v1.js`: pure plan / height / masks.
- `r2d-presentation.v1.js`: body / underside / water / source-proven P1/P2 nature.
- `r2d-buildings.v1.js`: exact B1 siblings through existing `wd1-city.js / kfb-facade-rule-v1`.
- `world-integration-01/r2d-world.js`: WB2 adapter and world facts.
- Track Core remains road geometry owner.

## Consumer facts

Future consumers attach to:
`spawn`
`baseHeightAt(x,z)`
`groundAt(x,z,terrainHeight)`
`solidAt(x,z)`
`buildingAt(x,z)`
Track Core route/support facts.

They do not create parallel world/collision truth.

## Next after convergence

Build the four-node corridor as world data first.
No Player/Drive/Residents until that proof is green.
