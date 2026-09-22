# SOURCE SNAPSHOT · Hybrid Surface v2 frozen candidate

Frozen runtime/code head: `7cbad52b55fb9ec2300aa4b25ca92b0997ce448a`

## Source files

| Path | Git blob | bytes |
|---|---|---:|
| `.github/workflows/toolbox-hybrid-surface-v2.yml` | `3c0838e01c2186dc77b097a3f974ac28bb263992` | 1813 |
| `kfb-hub/stage/toolbox/hybrid-surface-scene-lab-v2/index.html` | `0e4029063e2d6a0bbaeb8a51b39b137ccc73cb2f` | 4785 |
| `kfb-hub/stage/toolbox/hybrid-surface-scene-lab-v2/hybrid-surface.v2.js` | `13480031b312d43766076c1d0086679ec74bc843` | 10390 |
| `kfb-hub/stage/toolbox/hybrid-surface-scene-lab-v2/lab.mjs` | `c1767e1a1181e989ab2b7c54eb85964cbeec2a58` | 21781 |
| `kfb-hub/stage/toolbox/hybrid-surface-scene-lab-v2/proof.mjs` | `5606c93c23a50de59737a220505d03ea62e77c54` | 10378 |
| `kfb-hub/stage/toolbox/hybrid-surface-scene-lab-v2/SOURCE.json` | `1afdbb186944003a8ad0d682efa5e86c0008ec16` | 2090 |

## Exact donors retained

World:
- World pin `bc1441eb8ff9a2df0e15e778b44b73f97eb63d76`
- `tools/world_atlas/source/lib/kit-lab.js` · blob `964d4187665f1786067ff5917de80df5f086fc91`
- `tools/world_atlas/source/scenes/dungeon-promo.js` · blob `2d2ba81b35d2277553470582ae93b30f6ec197ac`
- recipe `CQ-S1_KAYKIT_DUNGEON_PROMO`

Actors pin `bdaea0648f27c0f16e0a737bfba237eb54dd4cbb`:
- Legacy Orc A · Rig_Legacy
- ActionFigure · Rig_Medium
- GothGirl · Rig_Medium
- FrizzleBob Driver Graft · Rig_Medium
- Black Knight · Rig_Large

RGB brush donor:
- predecessor tested runtime `15f2f1714d62b606033b8624964e481c6d99d59f`
- existing `kfb-rgb-triplanar.v1.js` generator only; v2 does not replace that donor.

## Measured head-size calibration

Canonical target head metric: **1.0929430509813036**  
Metric: cube-root of exact matched head-node bounding-box volume.  
Reference: median of ActionFigure + GothGirl + FrizzleBob Driver source-head metrics.

| Actor | Head proxy | scale | final total height |
|---|---|---:|---:|
| Legacy Orc A | `character_orcAHead` | 0.9580576869 | **1.6845816963** |
| ActionFigure | `ActionFigure_Head_1/2` | 1.0000000000 | **2.3222830204** |
| GothGirl | `GothGirl_Head` | 0.9205969171 | **2.0357667418** |
| FrizzleBob Driver | `Driver_Head` | 1.0444884939 | **2.6064509025** |
| Black Knight | `BlackKnight_Head` | 0.7838843083 | **3.6775523513** |

All five final head metrics matched the target within the proof tolerance. Legacy < Medium median and Large > Medium median both passed.
