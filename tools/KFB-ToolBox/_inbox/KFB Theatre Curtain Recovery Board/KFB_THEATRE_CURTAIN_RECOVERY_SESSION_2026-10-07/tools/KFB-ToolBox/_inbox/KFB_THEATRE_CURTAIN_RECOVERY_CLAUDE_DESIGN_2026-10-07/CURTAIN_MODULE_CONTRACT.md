# CURTAIN_MODULE_CONTRACT · KFB Theatre Curtain Core (candidate r1)

One module, three consumers (loading, Character Select, in-game reveal). File: `candidate/kfb-curtain-core.js`.

## Ownership
Curtain Core owns: cloth sim, curtain hardware meshes, curtain presentation state, footlight level.
Host owns: renderer, scene, camera, lights/environment, world content, actors, loading, input, audio, save, navigation.

## API
```js
import { createTheatreCurtain, createFallbackCurtain, isSupported, STATES } from './kfb-curtain-core.js';
const curtain = isSupported() ? createTheatreCurtain({ material:'P', hardware:'pelmet' }) : createFallbackCurtain();
scene.add(curtain.group);
curtain.warmup(renderer, 900);            // before first visible frame
// every frame (host clock, seconds):
curtain.update(renderer, dt);
// facts from the host:
curtain.setHostFacts({ loadingReady, selectedActorReady, revealAllowed, reducedMotion });
curtain.requestReveal();  curtain.cover();  curtain.impact(1);
curtain.setFootlights(level0to1);          // host maps real loader progress
curtain.onState((state, prev) => …);
```
Options: `material` donor|A|B|C|P · `hardware` pelmet|rings|none · `proscenium`, `floor`, `footlights` booleans · `tieback` (quarantined, default false) · `duration` seconds.

## States (exactly the brief's set)
| State | Meaning | Enter when |
|---|---|---|
| closed_rest | closed, nothing pending | close finished and host facts ready |
| covered_wait | closed, host not ready or reveal pending | `loadingReady`/`selectedActorReady` false, or reveal requested while `revealAllowed` false |
| opening | gathering toward the wings | `requestReveal()` and `revealAllowed !== false` |
| open_rest | open | opening finished |
| closing | panels returning | `cover()` while not closed |
| impact | 0.6 s thump on a resting curtain | `impact()` from a rest state (impulse also applies mid-motion, state unchanged) |
| fallback_reveal | no WebGPU; core draws nothing | `createFallbackCurtain()`; host shows its world directly |

Rules: the core never opens on its own; `revealAllowed` is the only gate. It never reads loader internals. No fake percentage exists anywhere. `reducedMotion`: 0.9 s motion, no wind, no impact.

## Host recipes
- **Loading:** facts `{loadingReady:false, revealAllowed:false}` → `covered_wait`; footlights = 0.18 + 0.82·realProgress; optional one-line hint; when ready show "Enter ↵ Vorhang auf"; Enter → `requestReveal()`.
- **Character Select:** actor on the apron (z ≈ −0.85) in front of the closed curtain; ‹ › lazy-load; `selectedActorReady` gates `revealAllowed`; failed actor → last good/fallback, curtain stays closed.
- **In-game reveal:** `cover()` → swap world behind → optional `impact()` → `requestReveal()`.

## Geometry (world units, curtain plane z ≈ 0, audience at −z)
rail y 1.28 · cloth top 1.22 · hem −1.10 · floor −1.125 · opening ±1.42 · proscenium front z −0.44 · apron to z −1.5 · footlights z −1.36.
