---
kind: mechanic
engine: three
---

# Crowds and navigation

Make enemies and crowds walk around any three.js level: build a navmesh from its meshes, spawn people, give them somewhere to go, and they flow around the walls and each other, re-routing when something lands in the way.

It's [Recast and Detour](https://github.com/recastnavigation/recastnavigation) by Mikko Mononen (zlib), the navigation most game engines are built on, through [recast-navigation-js](https://github.com/isaac-mason/recast-navigation-js) by Isaac Mason (MIT), in its single-threaded build, so it needs no special hosting. Patch added a small API in metres, groups that arrive and stand instead of shoving for one spot, milling about, walk and run blending, and instanced mannequins. In the live demo, left click sends the crowd there and right click places a stone block in their way (or lifts one). Drag orbits and scroll zooms.

Navigation: Recast and Detour by Mikko Mononen (zlib), in recast-navigation-js by Isaac Mason (MIT). Code here is MIT, art is CC0.

## What this owns

- **Renderer:** Neither, for navigation: `src/navigation.js` and `src/crowd.js` make no renderer and draw nothing. `CrowdFigures` in `src/figures.js` makes instanced meshes with `MeshStandardMaterial` for your scene. The `WebGLRenderer` in `src/demo.js` is the demo's.
- **Frame loop:** It doesn't draw the frame. Call `nav.update()` and `crowd.update(dt)` from your own loop, then draw `crowd.members` however you like, or call `figures.update(crowd.members, dt)` or `walker.update(m, dt)`. The `EffectComposer` is only in `src/demo.js`.
- **three:** `package.json` pins 0.186.1, `recast-navigation` 0.44.0 and `@recast-navigation/three` 0.44.0. It also pins `n8ao` and `postprocessing`, which none of the files below imports.
- **Copy:** `src/navigation.js` and `src/crowd.js`, plus `src/walker.js` for rigged characters, or `src/figures.js` with `public/models/mannequin.glb` for big crowds.

## Use it in a game

Copy `src/navigation.js` and `src/crowd.js`, plus `src/walker.js` for rigged characters or `src/figures.js` for big crowds of Patch's mannequin. They need `three`, `recast-navigation` and `@recast-navigation/three`.

```js
import { initNavigation, Navigation } from './navigation.js';
import { CrowdSystem } from './crowd.js';

await initNavigation(); // loads Recast's WebAssembly, once

// 1. A navmesh from your level: the meshes people walk on or bump into, in world space. They don't have to be drawn.
const nav = new Navigation([floorMesh, wallsMesh], { agentRadius: 0.35, agentHeight: 1.9, stepHeight: 0.5 });

// 2. A crowd, and people on it.
const crowd = new CrowdSystem(nav, { home: nav.closest({ x: 0, y: 0, z: 0 }), maxAgents: 200, speed: 3 });
crowd.resize(70);

// 3. Somewhere to go. Each gets a place of their own around the point.
crowd.goTo(nav.closest(clickedPoint));

// 4. Once a frame, then draw each member however you like.
function frame(dt) {
	nav.update();
	crowd.update(dt);
	for (const m of crowd.members) {
		// m.x, m.y, m.z: where they are. m.vx, m.vz: which way they're going. m.speed: how fast.
	}
}
```

**Enemies that chase the player.** Keep telling them where the player is. `follow` hands the point on to a few people a frame, so paths are asked for steadily, and those already there stand.

```js
// A few times a second, or whenever the player has moved a little:
crowd.follow(nav.closest(player.position));
// And to let them go:
crowd.follow(null);
```

**Your own level.** Pass what people walk on and bump into, nothing else:
- Leave out roofs and treetops. Recast sees any flat top as floor, so they become walkable islands nobody can reach.
- A closed building's floor is an island too. Cut the floor away under it, or leave its inside out of the mesh.
- `levels.js` keeps two sets for this: what it draws, and a `walk` mesh of the floor with holes cut under whatever stands on it, walled round. Stairs and ramps are just meshes: in the castle level the real walls and stairs go in, and people run up onto the walls.
- `agentRadius` keeps people that far from walls. `stepHeight` is how high a step they take without noticing; keep it below anything they mustn't climb. `maxSlope` is in degrees.
- `new Navigation` is Recast working through every triangle, under 100 ms each for the demo's small levels and more for bigger ones. Do it behind your loading screen, once, and set `cellSize` higher (0.3 m) if it's slow.

**Something lands in the way.** Obstacles re-cut the navmesh while the game runs, about a millisecond in this demo, and everyone's way is asked for again.

```js
const crate = nav.block(position, 1.4, 1.4, 2.4, yaw); // half width, half depth, height, turn
crowd.shove(position, 1.4, 1.4); // anyone under it steps out
nav.unblock(crate);
```

A wall that breaks in the destruction block, a door that shuts, a barricade a player builds: each is one `block` or `unblock`. Up to 48 obstacles by default (`maxObstacles`); only boxes here, though Recast's tile cache also has cylinders (`nav.tileCache.addCylinderObstacle`).

**Other orders.**
- `crowd.goTo(point)`: everyone, once, to a place of their own around a point.
- `crowd.scatter()`: everyone runs somewhere of their own.
- `crowd.goTo(point, { members, hurry, spread })`: a squad, not the whole crowd.
- `crowd.send(member, point, hurry)`: one person; `hurry` scales the speed, and 0 is a stroll.
- `crowd.setSpeed(3)`, `crowd.setSpacing(2)` (how hard they keep apart, 0 to 4), `crowd.wander = false` (stand where they were sent).
- `nav.closest(point)`, `nav.randomAround(point, radius)` and `nav.path(from, to)` for your own logic: the last one is how to check somewhere can be reached (a tower's roof is walkable, but cut off).

**Rigged characters.** `Walker` (`src/walker.js`) fades idle, walk and run by each member's speed and matches the clips to it so feet don't slide. Fine for a few dozen, each with its own `AnimationMixer`.

```js
const walker = new Walker(new AnimationMixer(model), { idle, walk, run }, { walkSpeed: 1.4, runSpeed: 3.6 });
// every frame, for each member:
model.position.set(m.x, m.y, m.z);
walker.update(m, dt);
model.rotation.y = walker.yaw;
```

**Big crowds.** `CrowdFigures` (`src/figures.js`) draws hundreds of Patch's mannequin (`public/models/mannequin.glb`, CC0) in 17 instanced draws, plus their shadows: rigid shells, no skin, with clips baked into tables at load.

```js
const figures = new CrowdFigures(await new GLTFLoader().loadAsync('models/mannequin.glb'), 200);
scene.add(...figures.meshes);
// every frame:
figures.update(crowd.members, dt);
```

Frame cost here, on a desktop, with 200 people: the crowd and figures together about 2 ms, or about 8 ms with the processor slowed 4 times. Drawing is the heavier part: 200 people is 1.16 million triangles a frame with shadows, so the demo measures the graphics card while it warms up and settles what to draw before anyone sees it. Detour's crowd gets slower with people packed close, and the demo stops at 200; try your own numbers on a laptop before planning for more.

**Warm it up before anyone sees it.** The demo keeps the canvas hidden while it builds every level's navmesh and draws one frame of each (three compiles a shader the first time it's drawn), drops and lifts a block once, and runs each level's crowd 6 seconds ahead so they're already walking when it shows. Do the same behind your own loading screen.

**Read `agent.position()`, not `agent.interpolatedPosition`.** That one only moves by how far the frame is through a fixed step: on a steady 60 Hz screen that's near 0 for long stretches, so people play their run on the spot, then catch up. `crowd.js` steps with the frame's own time for this reason.

## Controls

The block page talks to the demo over the `patch-block` message channel (`lib/patch-block.js`). Sending and placing blocks happen in the frame.

**For people** (the block page shows these):

| id | Control | Type | Range | What it does |
|---|---|---|---|---|
| `level` | Level | choice | 3 options with pictures; default Market square | Where the crowd is. |
| `crowd` | Crowd size | number | 10 to 200, default 70 | How many people are on the level. |
| `speed` | Speed | number | 1 to 6 m/s, default 2.8 | How fast they go when sent. |
| `walkable` | Show walkable area | toggle | default off | Draws the navmesh. |

**For agents** (in `recipe.json`, not on the page):

| id | Control | Type | Range | What it does |
|---|---|---|---|---|
| `spacing` | Personal space | number | 0 to 4, default 2 | How hard people keep apart. |
| `wander` | Mill about | toggle | default on | Whether people walk on their own: round the level until someone sends them, and off for a stroll a few seconds after arriving. |

**Triggers:** `scatter` (Scatter) and `clear` (Clear blocks).

## Run it

```bash
npm install
npm run dev
```

`npm run build` writes the demo to `dist/`, with its licences beside `index.html`.

- `make-recipe.mjs` writes `recipe.json`.
- `make-thumbs.mjs` takes the level pictures and `make-cover.mjs` the cover, from the running demo.
- `make-kits.mjs` packs Kenney's pieces into `public/models/`, and `mannequin/` builds the mannequin (its README says how). You only need these to change the art.

## What's in here

- `src/navigation.js`, `src/crowd.js`, `src/walker.js`, `src/figures.js`: the parts to copy.
- `src/levels.js`: the three levels, put together in code from Kenney's kits.
- `src/demo.js`: the demo.
- `LICENCE-NOTES.md` says where every part came from. `CREDITS.txt` ships with the demo.
