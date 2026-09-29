# START_HERE · WORLD-CORE-MOBILITY-R0B-COLLISION-01 · 2026-09-29

## Slice

- Executor: ChatGPT Web / KFB-web.
- Repo: `georg-doc/kayfabizarro`.
- Branch: `chatgpt-web/world-core-mobility-r0b-collision-01-2026-09-29`.
- Base owner: `work/world-m2a-r6-focus-quality-2026-09-28` (World M2A R6 verified owner).
- Proposed Stage route: `/kfb-hub/stage/world/world-core-mobility-r0b-collision-01/`.
- Status: `IMPLEMENTING · NOT PUBLICLY ACCEPTED · DO NOT MERGE`.

## One outcome

The existing World Auto mode must read as a planted vehicle rather than a flying/nose-high shell:
real render/contact surface agreement, source-backed wheel/suspension animation, and collision-driven
cartoon response. The same contact facts may drive reversible presentation reactions on world objects
and temporary surface marks.

## Source truth reused

1. Movement/contact solver: Race `FREE_ROAM_C0` / PR #10 receiver already present in World M2A.
   No second vehicle solver.
2. Accepted feel constraint: Race Track Lab v0.8 remains the human-accepted feel baseline.
   Receiver-local steering/brake/coast overrides and arbitrary low input speed caps are not allowed
   to silently replace Race truth.
3. Vehicle source: Kenney `kart-oobi.glb`, pinned source-backed fixture.
4. Vehicle rig/presentation: current ToolBox Vehicle Animation Lab v4
   `carrig.v3` + `kfb.cartoon-vehicle-deformer/2`; optional segmented deformation stays
   presentation-only.
5. World contact source: the exact mounted World terrain mesh / World building data already used
   by the renderer. A flat start-height ground proxy is not accepted as terrain contact.
6. Visual-world donor R0A remains design-only and is not re-derived in this collision slice.

## Protected / outside this slice

- Ground locomotion/state/animation owner.
- Travel Flight owner.
- Race forces/contact solver ownership and Race source files.
- R0A visual recipe/look integration.
- Live promotion / merge.
- Permanent world destruction.

## Required implementation

- Replace the receiver's flat `world-ground` box with a collider mesh derived from the mounted
  render terrain.
- Stop overriding Race steering/brake/coast values in the World receiver; derive semantic speed
  gates from the active Race physics values instead of the old 12/18 m/s caps.
- Use Vehicle Lab measured rig/wheels rather than four invented cylinder wheels.
- Preserve the physical body transform as contact truth; deformation remains beneath a visual
  response root.
- Add read-only contact telemetry: contact normal + relative approach speed -> local
  `front/back/left/right/down` impact fact.
- Feed directional facts into the existing cartoon deformer: lateral rail impact, longitudinal
  compression/recoil, landing/bounce.
- World response is presentation-only and reversible:
  props wobble/tilt and recover; buildings get a bounded facade/body recoil without collider drift.
- Surface response is temporary and bounded:
  tyre tracks/ruts while grounded/slipping, impact dents/scuffs at contact, pooled/fading and
  performance-capped.

## Done when

1. At rest the car has four wheel contacts on ordinary terrain and a small bounded visual ground gap.
2. Forward driving no longer appears to float because contact follows the same terrain mesh.
3. Wheel spin, steer and suspension come from the measured vehicle rig.
4. Front/side/landing impacts produce visibly different deformation/recovery while contact geometry
   remains unchanged.
5. Building/prop reactions recover to rest; temporary ruts/dents fade and are capped.
6. Static/source tests and public Cloudflare Stage checks are recorded in `RETURN.md`.
7. Human acceptance remains exactly one next gate; no merge or Live promotion is implied.
