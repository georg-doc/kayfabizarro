---
name: cartoon-motion
description: >-
  Animator-level mental model for cartoon motion — the 12 classic principles
  translated into concrete 2D/3D/WebGL implementation, plus a reusable
  motion-library grammar (idle, hop, jump, land, bounce, squash & stretch,
  follow-through, eye acting). Use whenever the user works on character or
  object animation with cartoon "juice" / game feel: authoring Three.js /
  WebGL / react-three-fiber motion, rigging or animating Kenney Cube Pets or
  GLB creatures, building or extending a motion library, designing
  idle/reaction/celebration states, tuning squash & stretch, anticipation,
  arcs, easing, secondary motion, or the eye/gaze behavior of stylized
  characters. Also trigger on "cartoon physics", "make it feel bouncy/alive",
  "animation principles", "motion matrix", "Bewegungs-Library", "Augen-Rig",
  "squash and stretch in code", GSAP/Framer-Motion/Lottie timing, or avoiding
  the robotic/linear-interpolation look. Trigger generously: if the task is
  plausibly about making something move with cartoon appeal, load this skill.
---

# Cartoon Motion

Your job with this skill is to think and act like a senior character animator
who also ships real-time code — someone who feels *why* a motion reads as alive
and can translate that feeling into keyframes, easing curves, bone matrices, or
shader math. This is a mental model, not a copy-paste library. Reach for it to
make animation decisions, critique motion, or build a reusable motion set.

The core insight underneath everything: **living things do not move at constant
velocity.** Robotic motion is linear interpolation — it ignores mass, gravity,
momentum, and elasticity. Cartoon motion continuously deforms, anticipates,
delays internal parts against each other, and travels along arcs. Every
technique below is a way of restoring one of those qualities that raw LERP
throws away.

## How to use this skill

1. **Diagnose first.** Name the emotion, the game/UX state, and the weight of the
   thing moving. Motion serves readability and feeling; decide those before
   touching a curve.
2. **Apply the principles as a checklist**, not a lecture — see the priority
   order below. Most "dead" animation is missing anticipation, follow-through,
   or arcs, in that order.
3. **Pull the right reference file** when you need depth (they are loaded on
   demand so the core stays lean):
   - `references/principles-and-webgl.md` — each of the 12 principles with its
     plain meaning, its concrete Three.js/WebGL translation (math, easing,
     SLERP, volume-preserving squash, delta-time loop, bone masking), best
     practices, and the mistakes that produce the robotic look. **Read this
     whenever you write or review animation code.** It opens with a "Rigid vs
     skinned" note — important because Kenney Cube Pets are **rigid** (animate
     `Object3D` node transforms, no skeleton/skinning), so read "bone" as
     "node" for them.
   - `references/motion-library-matrix.md` — the full state matrix (~46 motions
     across locomotion, idle, reaction, celebration, hurt, expressive, gag,
     rubber-physics) with duration, loop flag, layer, eye behavior,
     implementation note, and reference type. **Read this when building or
     extending a motion library, or picking which states to author.**
   - `references/eye-system-cube-pets.md` — the eye/gaze system, including the
     specific problem of round cartoon eyes overlaid on flat static eyeball
     planes (Kenney Cube Pets), the `eye_policy` vocabulary, saccades, and gaze
     clamping. **Read this for anything involving eyes, gaze, faces, or the
     Cube Pet rigs.**
   - `assets/cartoon-motion.js` — a small dependency-light helper module with
     the recurring functions (easing, volume-preserving squash, spring-damper
     follow-through, saccade, gaze clamp, fixed-timestep accumulator, bone
     mask, root-motion strip). Import or adapt it instead of re-deriving the
     math. See `references/principles-and-webgl.md` for how each function maps
     to a principle.
4. **Test from the play camera.** A pose or loop is only correct if it reads at
   the actual on-screen size and distance, not in a zoomed-in editor.

## The 12 principles, compressed

These are the physics of appeal. The full code translation is in
`references/principles-and-webgl.md`; hold these one-liners in your head:

1. **Squash & stretch** — deform to show force, but preserve volume: scale one
   axis up, scale the other two down (`Sx = Sz = 1/√Sy`). Never scale a single
   axis alone — that reads as paper or a balloon.
2. **Anticipation** — a short move *opposite* the main action loads the energy
   and tells the viewer it's coming. No anticipation = teleporting.
3. **Staging** — one clear idea per pose; protect the silhouette. If the
   silhouette doesn't read, the pose doesn't read.
4. **Straight-ahead vs pose-to-pose** — key the extremes first (pose-to-pose)
   for control; use straight-ahead for chaotic secondary motion.
5. **Follow-through & overlapping action** — loose parts (ears, tail, eyes,
   accessories) keep moving after the body stops, and start *after* it starts.
   Offset timing down the hierarchy is what makes a rig feel soft, not metallic.
6. **Slow in & slow out (easing)** — nothing starts or stops instantly. Map
   normalized time through an easing curve; linear spacing kills weight.
7. **Arcs** — natural motion travels on curves. Translate along Bézier/splines,
   rotate with SLERP on quaternions. Straight lines and Euler lerps read
   mechanical.
8. **Secondary action** — supporting motion (a blink on a turn, a tail flick)
   that enriches the main action without competing with it.
9. **Timing** — the number of frames sets weight and mood; heavy = more frames,
   snappy = fewer. Timing must be frame-rate independent (scale by Δt).
10. **Exaggeration** — amplify the essential force, then settle. Hold the
    extreme only 1–3 frames so it reads as energy, not as a broken model.
11. **Solid drawing / solid posing** — respect volume, weight, and balance in
    3D space; avoid twinning and clipping.
12. **Appeal** — clarity + charm. Neoteny (big eyes, round head, simple
    features) and a flat/toon material bypass the uncanny valley; realistic
    shading on stylized geometry falls into it.

## Motion priority (the order things react)

When a force hits a character, parts respond in a fixed cascade. Honor it and
motion feels organic; violate it and it feels rigid or puppet-like:

**Eyes → head → body → root**, with secondary appendages (ears, tail,
accessories) trailing their parent by a short phase delay (~0.1–0.15 s). Eyes
usually *lead* attention (they move first toward a target) but *lag* on impact
(they settle last). This split is the single highest-leverage rule for the Cube
Pets — see the eye reference.

## Layered rig architecture

Do not author one monolithic clip per situation. Compose motion from masked
layers so a small set of clips covers a large space of states:

- **Layer 0 — Locomotion / base:** idle, move, jump, fall, land, turn. Full or
  lower-body skeleton.
- **Layer 1 — Action:** waves, gestures, hit-react, tool use. Upper-body mask.
- **Layer 2 — Expression:** blink, eye dart, smile, worry, surprise. Face mesh /
  morph targets, with eyelid blinks clamped above emotional morphs.
- **Layer 3 — Procedural physics:** bounce, wobble, secondary jiggle, ear/tail
  follow-through, breathing — driven by spring-dampers and sine bobs, not baked
  keyframes.

Combining masked layers instead of baking every permutation is what keeps the
asset set small and the motion recombinable. Details and the Three.js bone-mask
/ root-strip code are in `references/principles-and-webgl.md`.

## Real-time vs film: the snappiness rule

Film can spend 10–15 frames on a luxurious anticipation. Interactive motion
cannot — input latency is the top UX metric. When a user triggers an action,
give feedback on frame 1, then honor the physics:

- **Frame 1–2:** instant visual cue (a squash, a scale pop, a particle) so the
  input feels received.
- **Frame 3–8:** fast, *compressed* anticipation — the energy load, shortened.
- **Frame 9+:** main action released along an extreme-velocity arc.

Scale anticipation duration inversely to action speed to stay responsive. And
resist over-animating: only update bones that actually change the silhouette
this frame — redundant per-frame keys burn CPU and bloat assets for no readable
gain.

## Production SOP for a motion asset

Write each motion the same way so the library stays consistent even as the body
rig and eye rig are handled separately:

1. **Brief** — goal, emotion, gameplay trigger, duration.
2. **Reference** — one classic-cartoon clip + one modern real-time clip.
3. **Thumbnails** — 3–5 key poses (start, extreme, settle).
4. **Blockout** — root + major parts only.
5. **Overlap & offset** — eyes, ears, tail, secondary squash.
6. **Polish** — easing, holds, accent frames.
7. **Play test** — verify from the game camera at real size.
8. **Tag & spec** — fill the required fields below.

Required fields per motion (keeps body and eye rigs in sync — see the matrix
reference for the full table): `name`, `trigger`, `duration`, `loop`, `layer`,
`eye_policy`, `camera_readability_note`, `secondary_motion_note`, `export_note`.

## Note on Claude Design availability

Claude Design (claude.ai/design) does not currently expose Skills inside its
canvas. Use this skill in Cowork / Claude Code / the Claude apps to *author* the
motion logic, then move the result into Claude Design via its GitHub /
design-system import or the Design MCP `/design-sync` handoff to Claude Code.
The skill informs how the code is written; the code is what Claude Design runs.
