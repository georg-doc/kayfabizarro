# Floppy bunny ears in the Animation Studio · integration guide + drafts

> **Owner decision · 2026-09-25:** Animation Lab / ToolBox Motion owns the single `ear-dangle.v1.js` secondary-motion runtime. FrankenStein Studio owns ear geometry, placement, acted/rest pose and the per-actor ear-rig profile, and consumes this module without copying it. Game consumers may provide wind/contact/impulse facts only.


Goal: FrizzleBob's ears move by themselves. They follow every clip (walk, dance, jump, drive), react to wind and landings, and can still be acted (droop, fold, curl). None of this needs extra animation clips. Everything below uses `ear-dangle.v1.js`.

## 1 · Frame order (the one rule that matters)
```js
function tick(dt){
  mixer.update(dt);                 // 1 clips write the body (and ears, if a clip has ear tracks)
  controller.update(dt);            // 2 root motion / vehicle / physics moves the actor
  actor.updateMatrixWorld(true);    // 3 world matrices are now final for this frame
  ears.update(dt, { wind });        // 4 secondary motion reads the head, writes the ear bones
  renderer.render(scene, camera);   // 5
}
```
If the dangle runs before step 2, it reacts one frame late and jitters. If it runs before step 1, the mixer overwrites it.

## 2 · Mounting
```js
import { rigEars } from './ear-dangle.v1.js';
// combined model (ears skinned to the main rig: ear.l.1-3 / ear.r.1-3)
const rig = await (await fetch('rigs/fb-default.ear-rig.json')).json();
const ears = rigEars(fbRoot, rig);
```
For the **unit ear** (placed by the Ear Rig Studio), build the chains directly:
```js
import { DangleChain } from './ear-dangle.v1.js';
const L = new DangleChain([ear1, ear2, ear3], { side: 'L' });
const R = new DangleChain([rEar1, rEar2, rEar3], { side: 'R', mirroredTransform: true }); // R = mirrored copy
```
Attach each unit holder to the head each frame with `holder.matrix = headBone.matrixWorld · headRest⁻¹ · earRest`. That is how the Studio does it: it survives any head animation, including nod and shake.

The FrizzleBob graft (`mountGraft`) stays the head owner. The ears are a child layer of the head, not a second actor and not a second mixer.

## 3 · Layering with clips
- **Clips without ear tracks** (almost all Mixamo / Motion Library clips): the chain uses the rest pose + acted pose + spring. Nothing to do.
- **Clips with ear tracks** (hand-keyed ear acting): the chain detects that the mixer wrote the bone this frame and uses that as its base. The spring adds on top. So a keyed "ears perk up" still wobbles when it lands.
- **Blend between the two:** reduce the dangle on acted shots with `chain.setParams({ inertia: 0.008 })`. To switch it off completely, use `chain.enabled = false`, which also resets the springs.

## 4 · Driving it from gameplay
| Situation | Call | Effect |
|---|---|---|
| Driving a vehicle | `ears.update(dt, { wind: vehicleVelocityWorld.clone().negate() })` | ears lean back, flutter grows with speed |
| Head wind / weather | add a world wind vector to the same `wind` | lean + flutter in that direction |
| Landing after a jump | `ears.impulse({ pitch: 2.5 })` on the contact frame | tips slap forward, then settle (follow-through) |
| Take-off | `ears.impulse({ pitch: -1.5 })` | tips drag down/back (anticipation read) |
| Hit from the side | `ears.impulse({ roll: ±2 })` | sideways whip |
| Emotion change | `L.setPose({ droop: 45, fold: 25 })` — tween the values over 0.2–0.4 s | acted pose; the spring adds overshoot for free |
| Lying down / upside down | `setParams({ gravity: 0.6 })` | ears sag towards world-down |

Reuse the expression presets from the Ear Rig Studio: Wach, Traurig, Wütend, Neugierig, Schlappohr links, Verlegen, Ein Ohr hoch. They are only pose values, so a clip, a dialogue beat or the mood die can trigger them.

## 5 · Cartoon tuning (what makes it read as "floppy")
- **Overlapping action.** Each bone lags the one before it: the tip is softer than the root (stiffness 60 → 38 → 24). Never give all bones the same values, or the ear moves like a stick.
- **Follow-through and overshoot.** Aim for 10–20 % overshoot and 2–3 visible wobbles after a stop. If it wobbles longer, raise damping; if it snaps back dead, lower damping.
- **Squash and stretch.** `elastic` 0.4–0.8 stretches the ear on take-off and squashes it on landing. Above 1.2 it gets rubbery (good for comedy beats, too much for walking).
- **Exaggerate on events, not all the time.** Idle and walk use soft defaults; landings, surprises and hits use impulses. Constant large motion reads as noise.
- **Left ≠ right.** A small asymmetry (one ear 10–15 % softer, or phase-shifted flutter; the module already offsets R) makes the ears feel alive.
- **Clamp against the head.** `maxDeg` keeps the tips out of the skull. If a pose still clips, lower `maxDeg[0]`, not the stiffness.
- **Stable at any frame rate.** The module sub-steps at 120 Hz internally, so 30 fps capture and 144 Hz screens behave the same.

## 6 · Nose and other danglers: one system
The FrizzleBob nose dangle and antennae, tails or cloth tabs are the same problem with 1–3 bones. Use `DangleChain` for them too, with different defaults. For a nose, for example: `stiffness [90, 60]`, `damping [9, 6]`, `elastic 0.3`, `wind 0.3`. That gives one tuning vocabulary and one code path for all secondary motion.

## 7 · Baking (for exports and engines without the module)
```js
import { bakeDangle } from './ear-dangle.v1.js';
const walkWithEars = bakeDangle(mixer, walkClip, [ears.L, ears.R], { fps: 60 });
// → clip + ear quaternion/scale tracks; export with GLTFExporter or keep as a Motion Library variant
```
Use baked clips only where the runtime cannot run the module, such as video renders or third-party engines. A baked clip no longer reacts to wind or impulses.

## 8 · First gate proposal (Animation Lab)
1. Mount the FrizzleBob graft with `FB_TEMPLATE_LOOK_v5.glb` ears, or with unit ears placed from `fb-default.ear-rig.json`.
2. Play canonical KayKit base Idle, Walk, Run and Jump Start/Air/Land, plus one accepted KFB Motion Library dance, with the ears active. Add `impulse` on the real Jump Land/contact transition.
3. Georg reviews: is the wobble readable, not too much and not too little? Do the ears clip into the head?
4. Only after that: vehicle wind in the Race/Free-Roam consumer, owned by that consumer.
