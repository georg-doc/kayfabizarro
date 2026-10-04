# Idea · Spring pillars that launch the track · 2026-09-26

**Source:** Georg, 26.09.2026, while reviewing SC02. It extends his earlier idea of "spiral charged pillars that catapult track + player without the track tearing" (24.09).
**Status:** IDEA. Not scheduled. Nothing is built.

## Georg's wish, in short

- Selected pillars work like **bumpers / springs**. The track section above them is flung up (cartoon style) **without tearing**.
- The player flies and then, with **guided driving**, lands spectacularly **at full speed** and drives on.
- The same kind of gimmick could work with pylons or other supports, as long as the track can follow the motion.

## Who owns what (proposal, from the Track Core decision)

| Part | Owner | Why |
|---|---|---|
| The track section moving without tearing | **Track Core (JS)** | The ribbon is core geometry. The motion must be a **time-varying displacement over an s-window**, `d(s, t)`, applied to the *frame stream* before the ribbon is baked. The deck stays one continuous surface: joints, slots and markings cannot tear, because nothing is cut. |
| Launch impulse, flight, landing, guided re-capture | **Race** | Race owns contact, flight, landing and recovery (WSA D0). The core only exposes the re-capture window: an s-range plus lateral tolerance (B4). |
| The spring pillar itself (coil, bumper cap, squash & stretch) | **Blender scenery (SC02)** | It is the same socket as a static support. The bearing plate follows `d(s, t)` at its station, just as it follows the static soffit today. The compressed / rest / extended states are shape keys or a single bone. |

## Preconditions (order)

1. **W0:** the core contract allows parameter curves over `s` **and time**, or at least a named "dynamic window" hook.
2. **B4:** the air re-capture envelope for kicker/landing is proven, and the same law serves the spring launch.
3. **W1:** Race contact on the core (`project(pos, sHint)` stays valid while the window moves).
4. Only then: a spring-pillar piece on the core, plus the spring-pillar scenery variant in SC02.

## What Blender could prepare earlier (optional, scenery only)

- A spring-pillar **visual** with three states (rest, compressed, extended) on the SC02 socket, including the round footing.
- No moving road and no physics; it only shows the look.
- Georg decides whether this is worth doing before W0.

## Risks

- A moving drivable surface also moves the collision surface. This has to be solved in Race (W1), not with a scenery trick.
- Cartoon exaggeration (large `d`) versus camera and readability: tune it in the D1 visual grammar pass.
