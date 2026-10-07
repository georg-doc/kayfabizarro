# CORE_REQUESTS — assets module

## 1. Add `HEX_PROP_SCALE = 4.5` to `src/core/units.ts` (hex-pack props are ~1.7× too big)
Evidence (my shots): `tools/out/assets/scale_r2__assets.lineup.png` (current), `tools/out/assets/scale_r3__assets.lineup_proposed.png` (proposed), `scale_r2__assets.door.png`.

Measured (StaticAsset.bounds, metres; Knight measured from skinned vertices in Idle_A):
| Item | at HEX_SCALE 7.5 | at 4.5 | real-world ref |
|---|---|---|---|
| Knight (CHAR_SCALE 0.75) | 1.89 | — | |
| home_A door opening (vertex data: leaf top 0.28 u, arch 0.287 u, frame 0.315 u, width 0.154 u) | 2.15 m clear / 2.36 m frame / 1.16 m wide | (buildings stay 7.5) | door/Knight = 1.14 clear, 1.25 frame → OK |
| barrel | 1.59 (= Knight chest) | 0.95 (= Knight belly) | ~0.9–1.0 |
| crate_A_big | 1.58 | 0.95 | |
| crate_A_small | 1.05 | 0.63 | |
| wheelbarrow | 1.41 tall, 3.8 long | 0.85 / 2.3 | ~0.7 / 1.5 |
| ladder | 5.77 | 3.46 | |
| sack | 0.47 | 0.28 | |
| weaponrack / target | 1.80 / 2.26 | 1.08 / 1.36 | |
| tent, flag_* | 3.87 / 2.08 | keep 7.5 | camp-sized already |

Recommendation: `export const HEX_PROP_SCALE = 0.6 * HEX_SCALE; // 4.5` in `units.ts`. **Nothing else is needed**:
`AssetLibrary.packScale()` already uses `HEX_PROP_SCALE` for `hex/decoration/props/*` (except `tent`, `flag_*`)
as soon as the constant exists, so `get(id).bounds/parts` and `scaleOf(id)` switch automatically. The scale
showcase's "proposed" row detects it and stops double-scaling.

Not recommended: **KayKit Medieval Builder Pack 1.0/Models** as a prop source — it contains NO small props (objects:
archeryrange, barracks, bridge, castle, house, mill, well, wall_*, detail_forest/rocks/trees … only). It is a hex-tile
pack at the SAME scale as the hexagon pack (its hex tiles are 2 × 2.309 units, `house` 0.91 units tall), not character
scale. So no files to copy for props.

## 2. `BUILDER_SCALE` should be 7.5, not 1 (only matters if the Builder pack is ever used)
`KayKit Medieval Builder Pack 1.0/Models/tiles/hex/gltf/hex_forest.gltf.glb` bounds 2 × 1 × 2.309 units = identical
footprint to the hexagon pack. At BUILDER_SCALE 1 a house would be 0.9 m tall.

## 3. Drop `forest/Grass_1_Mesh`, `Grass_2_Mesh`, `Grass_1_SingleSided_Mesh`, `Grass_2_SingleSided_Mesh` from the copy
They have no material → three's default white material (the only reason the forest pack shows 2 canonical materials
instead of 1; they render as white sticks, see `gallery_r1__assets.gallery_forest.png`). Use `Grass_*_Color1`.
Write them out of `tools/assets-used.json` (or a deny-list in `tools/copy-assets.mjs`).

## 4. Widen `AssetLibraryApi` in `src/core/types.ts`
Other modules cast to reach `url()`, `scaleOf()` (character/player.ts, camera/standin.ts). Please add:
```ts
url(id: string): string | null;
scaleOf(id: string): number;
allMaterials(): import('three').Material[];
materialStats(): { materials: Record<string, number>; textures: string[] };
```
All already implemented in `library.ts`.

## 5. `tools/shoot.mjs`: retry once on "Execution context was destroyed"
Vite full-reloads the page whenever another builder saves a file; ~1 in 3 of my shoots died with
`page.evaluate: Execution context was destroyed`. A single retry of goto+waitForReady (like
`src/modules/assets/tools/probe.mjs` does) would remove that flake for every agent.

---
**Integrator 2026-10-06:** #1–#5 applied (HEX_PROP_SCALE = 0.6·HEX_SCALE, BUILDER_SCALE 7.5, Grass_*_Mesh deny-list, AssetLibraryApi widened, shoot.mjs retries reloads).
