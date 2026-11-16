---
kind: system
engine: three
---

# Low-poly trees

Grows a faceted low-poly tree in three.js from six archetypes, then rigs it so it can walk on its roots, jump, stomp and swing. One mesh, about 1,500 triangles, vertex colours and no textures.

It's the [Lowpoly Tree Generator](https://github.com/rand-monster/lowpoly-tree-generator) by [Pajama Studio](https://rand.monster/editor/trees) (MIT, © 2026 Rand Monster contributors), steered by Patch's block controls, on a small island Patch made for it. Every tree comes from plain parameters: the wood is one welded solid, the crown is clusters of facets, and the same parameters always grow the same tree. In the live demo, hold WASD to walk and let go to stop, Shift runs, Space jumps (try it in the water), F swings, and R or Reset puts everything back as it opened, sliders included. Clicking the ground sends the tree there, and clicking the tree stops it. Drag looks around and scroll zooms.

## What this owns

- **Renderer:** Neither: `buildLowpolyTreeGeometry` returns a plain `BufferGeometry`, and the material is yours (vertex colours). The `WebGLRenderer` in `src/demo.js` is the demo's.
- **Frame loop:** It doesn't draw the frame. For a rigged tree, call `updateLowpolyTreeWalkRig` or `updateLowpolyTreePresetRig` from your own loop, or play the baked clips with an `AnimationMixer`. A still tree needs no call.
- **three:** `package.json` pins 0.185.1, `three-bvh-csg` 0.0.18 and `three-mesh-bvh` 0.9.7, and it also ran on three 0.186.1. The generator imports only `three-bvh-csg`, which uses `three-mesh-bvh` and asks for `>=0.9.7`. geometry-painter asks for 0.9.11 and also ran on 0.9.7, so 0.9.7 suits a game with both, though the two haven't been run together.
- **Copy:** `vendor/lowpoly-tree-generator/src/`, with the `@rand-monster/lowpoly-tree-generator` aliases from `vite.config.mjs`. `src/walker.js`, to walk it, imports `SEA`, `heightAt` and `shared` from the demo's `src/world.js`, so bring that file or replace those three.

## Credits

The generator, its archetypes, vines, rig, motion presets and animation controller are Pajama Studio's work, published as Rand Monster's open-source tree core. `vendor/lowpoly-tree-generator/` is their commit `4377dd6`, unedited, with their `LICENSE`, `CREDITS.md` and `THIRD_PARTY_NOTICES.md`. Please keep that notice if you ship it. Its live editor is [Rand Monster Tree Forge](https://rand.monster/editor/trees).

Patch added `src/`: the island, the water, the effects, skinning the vines onto the rig, and the walking. No textures, models or sounds: everything you see is made in code. Licences go in `dist/licenses/` with every build.

## Grow a tree

Install `three` (tested with 0.185), `three-bvh-csg` 0.0.18 and `three-mesh-bvh` 0.9.7. Here the generator is `vendor/lowpoly-tree-generator/src/`; `vite.config.mjs` aliases it to its package name.

```js
import * as THREE from 'three';
import { buildLowpolyTreeGeometry, createLowpolyTreeRecipe } from '@rand-monster/lowpoly-tree-generator';
import { createLowpolyTreeArchetypeParams } from '@rand-monster/lowpoly-tree-generator/archetypes';

const params = createLowpolyTreeArchetypeParams('groveBloom', { canopySeed: 104 }); // anything below overrides it
const recipe = createLowpolyTreeRecipe(params);
const { geometry, stats } = buildLowpolyTreeGeometry(recipe, { triangleBudget: 2600 });

const tree = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
tree.name = 'csg-union-wood-and-lowpoly-canopy'; // the name the rig looks for
tree.castShadow = tree.receiveShadow = true;
const root = new THREE.Group();
root.add(tree);
scene.add(root);
```

- **Archetypes:** `ancientGuardian`, `windCrownedSentinel`, `weepingLantern`, `forkedShrine`, `stormClaw`, `groveBloom`. An archetype is only a parameter object. `LOWPOLY_TREE_PARAMETER_DEFAULTS` lists all of them, about 130.
- **Welding takes 80 to 600 ms a tree**, so grow trees in a worker, as `src/tree-worker.js` does, or before the level starts. A tight `triangleBudget` costs more (it retries at lower resolutions), not less: 500 can take over a second where 2,600 takes 100 to 250 ms.
- **For a slider, use the preview.** `buildLowpolyTreePreviewGeometry(recipe)` skips the welding and takes 1 to 2 ms. The wood overlaps inside, which doesn't show, and the rig works on it. The demo shows previews while a slider moves, in a second worker, then swaps in the welded tree once it rests (`grow` in `src/demo.js`).
- **The dispose is yours:** the geometry has no scene state, and you own it.
- **Scattering a forest:** reuse a few geometries. The base entry point doesn't load the rig, so static trees stay cheap.

## Export it

The geometry is a plain indexed `BufferGeometry`, so three's exporter takes it. Bake the motions into clips first and they go in the file:

```js
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { createLowpolyTreePresetClips, createLowpolyTreeRig } from '@rand-monster/lowpoly-tree-generator/animation';

const rig = createLowpolyTreeRig(root, recipe);
const clips = createLowpolyTreePresetClips(rig); // TreeIdle, TreeWind, TreeWalk, TreeRun, TreeStomp, TreeAttack
const glb = await new GLTFExporter().parseAsync(root, { binary: true, animations: clips });
```

## Make it walk

`createLowpolyTreeRig(root, recipe)` swaps the named mesh for a `SkinnedMesh`. Its bones follow the trunk, roots and branches, and the roots work as feet. Create the rig while `root` is at the origin and not yet moved. Then, each frame, either pose it live:

```js
import { updateLowpolyTreePresetRig, updateLowpolyTreeWalkRig } from '@rand-monster/lowpoly-tree-generator/animation';

updateLowpolyTreeWalkRig(rig, phase * 1.12, 1.48 * walking, 1.12, { windStrength: 1, windTimeSeconds: time, windDuration: 4.2 });
updateLowpolyTreePresetRig(rig, 'attack', secondsIntoIt, { duration: 0.85, strength: 2.05, windStrength: 1, windTimeSeconds: time });
```

or play the baked clips with three's `AnimationMixer`. Things worth knowing:

- **Blend by strength.** The presets each start from the rest pose, so raising the walk's strength from 0 to full is the blend from standing to walking, and with strength 0 it's standing in the wind. Stomp and attack start and end at rest by themselves.
- **The rig animates on the spot.** Moving the tree is yours: `src/walker.js` moves it, turns it to face where it goes (its front is +Z), follows the ground, and adds a waddle, a crouch and a landing, with leaves, dust and splashes. Copy that file into a game; it only needs a `heightAt(x, z)` and the effects it's given. Drive it with `walker.steer(x, z, run)` every frame a key is down and `walker.letGo()` when it's up, or `walkTo(x, z)`, `act('jump' | 'attack' | 'stomp')`, `stop()` and `reset()`.
- **There's no jump preset.** The jump here is `walker.js` moving the whole tree with a squash and stretch, then a stomp when it lands.
- **Vines are a still mesh the rig doesn't know about.** `hangVines` in `walker.js` skins them to the rig and swings the free ones on a chain of three springs. Upstream mentions a gameplay vine solver that isn't in its open-source repo.
- **`createLowpolyTreeAnimationController({ clips })`** returns a serializable state machine (states, transitions on `speed`, `attack` and `stomp` triggers, an additive wind layer) to read into your own animator. **`createLowpolyTreeLiveAnimationProfile()`** holds tunable durations and strengths per motion; the speeds and strengths in `walker.js` are its defaults.

## What the demo changes

The archetypes' roots are wide and flow together into a skirt, so `src/params.js` makes them 40% narrower, 22% longer and more spread out, to read as feet. Seed 0 is otherwise the archetype as drawn. The generator's seeds only move leaves and vines, so `varied()` in the same file also turns the roots and branches and changes the bends and lengths a little for a new tree.

The demo draws with WebGL 2, so it runs without WebGPU. Where there's no WebGL 2 it shows a message in the frame instead.

## Controls

The block page talks to the demo over the `patch-block` message channel (`lib/patch-block.js`). Setting `archetype` puts every slider back as that archetype drew it. Setting `seed` keeps what you've set and grows the rest differently. Either way the demo sends every parameter's new value back in a `state`. `reset` puts every control back at its default too, and sends them all in a `state`. Moves aren't triggers, because a person has them in the frame: agents play them with the `pose` control. Each parameter control's id is the generator's own parameter name in snake case: `base_radius` is `baseRadius`.

<!-- controls -->
**For people** (the block page shows these):

| id | Control | Type | Range | What it does |
|---|---|---|---|---|
| `archetype` | Archetype | choice | `ancientGuardian`, `windCrownedSentinel`, `weepingLantern`, `forkedShrine`, `stormClaw`, `groveBloom`; default `ancientGuardian` | Which kind of tree: six silhouettes, each its own parameters and colours. |
| `height` | Height | number | 1.8 to 5.5, default 3.18 | How tall the trunk is, in metres. |
| `branch_length` | Branch reach | number | 0.4 to 2.4, default 1.5 | How far the main branches reach, in metres: a tight ball of a tree, or a wide spreading one. |
| `crown` | Leaves | number | 0.4 to 2×, default 1.3 | How full the crown is: a few small clusters on bare branches, or a heavy mass of leaves. |
| `hue` | Leaf colour | number | -180 to 180°, default 0 | Turns the leaves round the colour wheel from the archetype's own colours. |

Triggers: `new` (New tree): A new seed: the same archetype, grown differently. `reset` (Reset): Everything back to the start: the archetype and every slider at their defaults, the tree where it began and standing still, and the view.

**For agents** (steer them over the channel, or pass the parameters to `createLowpolyTreeRecipe`):

| id | Control | Type | Range | What it does |
|---|---|---|---|---|
| `gnarl` | Gnarl | number | 0 to 3, default 1 | How crooked the trunk is: 0 stands straight as a pole, and above 1 it bends further than the archetype. |
| `seed` | Seed | number | 0 to 9999, default 0 | The same seed always grows the same tree. 0 is the archetype as it was drawn. |
| `base_radius` | Trunk width | number | 0.15 to 0.9, default 0.56 | The trunk's radius at the base, in metres. |
| `bend_x` | Bend sideways | number | -1.2 to 1.2, default 0.2 | How far the trunk bends along X at its middle. |
| `bend_z` | Bend forward | number | -1.2 to 1.2, default -0.12 | How far the trunk bends along Z at its middle. |
| `upper_bend_x` | Upper bend | number | -1.2 to 1.2, default -0.18 | A second bend higher up, which makes S shapes against the first. |
| `profile_twist_turns` | Trunk twist | number | -1.5 to 1.5, default 0.28 | Turns of real faceted twist along the trunk. Adds no triangles. |
| `root_count` | Roots | number | 0 to 12, default 8 | How many roots: these are the feet it walks on. |
| `root_length` | Root length | number | 0.3 to 2.2, default 1.49 | How far the roots reach, in metres. |
| `root_width` | Root width | number | 0.08 to 0.5, default 0.23 | How wide each root is: wide ones flow together into a skirt. |
| `branch_count` | Branches | number | 0 to 8, default 5 | How many main branches leave the trunk. |
| `branch_lift` | Branch lift | number | -0.6 to 1.6, default 0.58 | How much the main branches rise: negative droops. |
| `secondary_branch_count` | Forks | number | 0 to 16, default 10 | How many smaller branches fork off the main ones. |
| `secondary_branch_length` | Fork length | number | 0.2 to 1.6, default 0.82 | How long the forks are, in metres. |
| `canopy_cluster_count` | Leaf clusters | number | 1 to 24, default 11 | How many clusters of leaves the crown has. |
| `canopy_radius` | Cluster size | number | 0.2 to 1.2, default 0.56 | The radius of a cluster of leaves, in metres. |
| `canopy_height_scale` | Cluster shape | number | 0.4 to 1.4, default 0.66 | Flat clusters below 1, tall above. |
| `canopy_irregularity` | Cluster roughness | number | 0 to 0.5, default 0.22 | How uneven each cluster's facets are. |
| `bark_color` | Bark | color | default #6f6758 | The colour of the wood. |
| `canopy_color_top` | Crown top | color | default #d5bd4d | The colour of the leaves' sunlit faces. |
| `canopy_color_side` | Crown side | color | default #a58d36 | The colour of the leaves' side faces. |
| `canopy_color_bottom` | Crown underside | color | default #62552b | The colour of the leaves' under faces. |
| `vine_enabled` | Vines | toggle | default true | Hang vines from the branch tips. They swing when the tree moves. |
| `vine_count` | Vine count | number | 0 to 16, default 6 | How many vines hang, when vines are on. |
| `vine_base_length` | Vine length | number | 0.35 to 4, default 1.8 | How long the vines are, in metres. |
| `budget` | Triangle budget | number | 300 to 4000, default 2600 | The most triangles the tree may have, not counting vines. Tight budgets simplify the wood first and keep every root, branch and cluster. |
| `wind` | Wind | number | 0 to 3, default 1 | How much the branches, grass and flowers move. |
| `speed` | Walking speed | number | 0.5 to 2×, default 1 | How fast the tree walks, and how fast its steps are. |
| `pose` | Motion | choice | `none`, `walk`, `run`, `jump`, `stomp`, `attack`; default `none` | Plays a move on the spot, again and again, until set back to None. Walk, run, stomp and attack are the generator's presets; jump is the demo's. |
| `sun` | Sun height | number | 12 to 80°, default 42 | How high the sun stands, in degrees: long shadows when it is low. |
| `turn` | Turn the view | toggle | default false | Slowly turns the view around the tree until turned off. |
<!-- /controls -->

## Build

`npm install`, then `npm run build` writes `dist/` with `index.html` at the top. `npm run dev` serves it locally. `tools/` has the picture makers (`make-thumbs.mjs`, `make-cover.mjs`), contact sheets (`shots.mjs`, and `sliders.mjs` for any control's range), the block protocol test (`test.mjs`), and the checks on moving (`moves-check.mjs`) and on Reset reaching the page's controls (`reset-check.mjs`).
