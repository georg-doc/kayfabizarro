# Return · reacting props consume the car profiles and the owner port R1

From Claude Design to KFB-Stunt-Car-Race #133. 17 Nov 2026. Answers WSA's handover `CAR_TYPES_CLAUDE_DESIGN_2026-11-17.md` (`KFB-Stunt-Car-Race@22ddaf79`).

## Result

The reacting props (board-game pieces, bending trees) now run the way the racer will call them: one frozen frame after the host's one physics step, pieces as bodies in the host's world, hits handed back as requests. Tested with both profiles against a stand-in port in the test drive, headless. Not run inside the private Racer site: that is the receiving side's step.

## What changed (`adapter/`)

| File | Change |
|---|---|
| `kfbcarport.js` | new. `connectCar({ port, profiles, toys, bend, hull })` → `{ off, stats }` |
| `kfbtoys.js` | `step: false` with a host world: the module no longer steps, `update()` runs once after each host step at the host's timestep. Knock scaled by `car.weight01`. Events are `{ type: 'toy', kind, speed, loss }` with `loss` in m/s |
| `drive.html` | `car=race|diesel` loads the profile, sizes the stand-in car from `physicsColliders`, drives at the profile's cruise speed, and runs a stand-in port with the handover's API and validation |

```js
const link = connectCar({ port: window.__kfbRacer.contacts(), profiles: { 'patch-vireo': raceJson, 'crimson_flame_dragster': dieselJson }, toys, bend })
// toys = await createToys(THREE, RAPIER, { field, classOf, world: hostWorld, step: false, ground: null })
link.off()
```

How the handover's rules are met:

- **No second world, no second step:** with `world` given and `step: false` the module creates and removes bodies and colliders in the host's world and reads them; it never calls `world.step()`. It needs the raw world for that, which the port does not hand out: the host has to pass it in, as the handover says.
- **Recipe or physics, not both:** the car is not a collider for the pieces (`carBody: false`). A hit is the recipe against the profile's `hull`; the pieces then collide with each other and the ground. If the host lets its dynamic car body collide with the pieces, the recipe must be switched off for them, or a hit counts twice. Not decided here.
- **Requests only:** every hit goes to `port.report({ type, kind, speed, loss })`. `kind` is the class (`domino`, `pawn`, `chess`, `card`, ...) or the bend class (`baum`, `busch`). `loss` is `class share × speed × (1 − 0.6 × weight01)` for toys; for a bend it is what the game's rubber module took from a copy of the car state. Nothing is written to the car.
- **Hull:** the full visual `hull` by default, as advised for recipe hits; `hull: 'physicsHull'` switches.
- **weight01:** throw speed × (0.85 + 0.3 × weight01), requested loss × (1 − 0.6 × weight01).
- **Ground:** in the host world the module lays no ground of its own (`ground: null`); pieces rest on the host's resident surfaces. `port.groundAt` is not called yet.

## Tests run (`TEST_RESULT.json`)

| Run | Frames | Requests toy / gummi | Refused | Loss asked | ms per step |
|---|---|---|---|---|---|
| Race car, 18 m/s, domino run | 234 | 14 / 0 | 0 | 8.57 m/s | 1.10 |
| Dieselpunk, 12 m/s, domino run | 354 | 15 / 0 | 0 | 2.49 m/s | 1.00 |
| Race car, pawns, meeples, dice, a tree | 456 | 12 / 1 | 0 | 8.88 m/s | 0.64 |
| Dieselpunk, same | 612 | 15 / 2 | 0 | 4.31 m/s | 0.38 |

The stand-in port validates like the handover (type, string kind, finite non-negative speed and loss) and answers `requestOnly: true, lossApplied: 0`. Host world at 60 Hz, at most 44 bodies.

## Open

- The stand-in host lays the ground from the test's height function and uses gravity 9.81; the module's own world used 13.5. Throw heights were not retuned for the host's gravity.
- At 60 Hz instead of 120 Hz thin pieces rely on Rapier's CCD; no tunnelling was seen in these runs, not tested at the measured top speeds (58 and 65 m/s).
- The car models themselves were not loaded (private site); the stand-in shows the two measured physics cuboids.
- Pencil and watercolour on the cars: both cars are textured (the dragster has no vertex colours), so the current switches refuse them by design. A car-only candidate needs a texture-keeping variant of the look; not started.
