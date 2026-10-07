# camera · NOTES (round 6; round 5 = round-3 spring arm + round-4 canopy/guards, rebuilt)

Third-person spring-arm camera (`src/modules/camera/`), runs in `lateUpdate` after `physics.step`.
Base = round 3 (commit 90f39f4, plain spring arm, best critic score). Round 4's "pinned raised close shot (55°/2.4 m)"
is gone (it froze pitch/zoom input and produced top-down helmet views). Ported from round 4: thin-trunk filter,
canopy service use, head-distance floor, near-plane body guard.

## Files
- `rig.ts` – `CAM` tunables, `CameraRig`, `CameraProbe` (Rapier queries).
- `index.ts` – module: `cameraRig` service, override release blend, fov, near plane, fade, presets, showcase,
  `&camtrace=1` per-frame trace (verification only, see below).
- `stage.ts` – showcase stage (tavern, grove with `stageCanopyBaseAt`, dither materials). `standin.ts` – stand-in.
- `scripts/` – `critic_r3_*.json` (round-3 critic), `r5_*.json` (round-4/3 critic scenarios + a trace dump step,
  `r5_forest42.json` forest pitch/zoom/idle test on seed 42).

## Public API: `ctx.services.get('cameraRig')`
`{ yaw, pitch, distance, object, forward(out?), setOrbit({yaw?, pitch?, distance?}), debugState() }` (radians; offset
= (cos p·sin yaw, sin p, cos p·cos yaw)·distance; ground forward = (−sin yaw, 0, −cos yaw)). `debugState()` →
`yawDeg, pitchDeg, pitchNowDeg, liftDeg, dipDeg, fovAdd, near, zoom, zoomGoal, distance, blocker, hitDist, pivot, cam,
overridden, fade`.

## Behaviour (numbers in `CAM`)
1. Pivot = feet + 1.5 m, critically damped (ω 10 h / 4.5 v), lag ≤ 0.8 m h, ≤ 1.2 m above (drops). Jumps hold the
   take-off height inside a band.
2. User owns yaw / pitch / zoom; nothing rotates the camera on its own (also not while idle). Pitch −5°…60°,
   window narrows at min zoom (12°…45° at 3 m) and the floor rises to +6° at 16 m (no ground-skimming far shots).
   A pitch drag starts from the visible pitch (no hidden stored value). Zoom 3–16 m, default 7 m / 20°.
   Vertical sensitivity 0.0021 rad/px, horizontal 0.0042.
3. Arm = `armClear`: thin sweep (r 0.15) for the line of sight, then the camera end is backed off until the
   0.4 m camera sphere is clear; plus a ray from the character's actual head (a ledge can hide the character while the
   lagging pivot still sees over it). Thin posts/trunks (r < 0.6, or tall trunks r < 1.0) are ignored (dithered by
   nature / the stage). Predictive cast from where the pivot will be in 0.3 s starts pull-ins early.
4. Pull-in fast but over several frames (≤ 40 % of the gap and ≤ 0.8 m per frame; inside geometry the penetration
   shrinks ≥ 20 %/frame), ease-out spring ω 8 (≈ 0.5 s).
5. minArm 2.3 m (1.6 m showed only the back of the chibi helmet): a blocker closer than that is cut by the near plane
   (camera keeps 2.3 m inside it, front faces of the blocker are culled). Absolute floor 1.6 m (normally 2.1 m) to the
   actual head, applied last. Near plane ≥ 0.1, pushed past blockers between camera and body points, never closer than
   0.5 m (head 0.65 m) to the character, never past the ground at the bottom frame edge.
6. Lift ≤ 15° only when it buys a clearly longer arm (ledge / terrace edge); it fades out below 2.3 + 3 m arm, so a
   short blocked arm never turns into a high look-down. Never applies at tall walls.
7. Short arm (< 4.5 m): the arm origin drops up to 0.45 m (chest), so close shots stay near helmet height and show the
   face/back + body instead of the helmet top. Driven by the free arm from the undropped pivot (no feedback loop).
8. Canopy (nature `canopyBaseAt`, showcase `stageCanopyBaseAt`): clearance height H (crown base − 0.4 m) sampled along
   the desired arm and eased; response is a direct function of user pitch/zoom: shorter arm (≥ 3 m), then the pitch
   above what fits is compressed to 35 % (not cancelled → pitch input still acts, no jitter).
9. Fov widens ≤ 9° (log of zoom/arm) while the arm is shorter than the zoom, so the wheel always visibly acts.
10. Framing: aim above the pivot (+0.04 m/m), lower when close; then helmet top kept inside the top edge (immediate)
    and feet inside the bottom edge if that costs ≤ 8° of tilt (eased) — head wins.
11. Every automatic quantity has a goal that depends only on (pivot, yaw, user pitch, zoom, world), never on its own
    output → idle camera converges and stops (measured 0.000 m over 5 s idle, showcase and forest).

## Verification trace
`&camtrace=1` records per frame `[t, cam xyz, distance, zoom, pitchNow°, lift°, dip°, near, fov, helmetTopNdcY,
feetNdcY, behind, feet xyz]` into `window.__camTrace`; scripts dump it with a final
`{"until":"(console.warn('CAMTRACE '+JSON.stringify(window.__camTrace.splice(0))), true)"}` step (ends up in the
shoot JSON `warnings`). Off by default, never active for critics.

## Known issues
- Character pressed sideways into a cliff corner can be half hidden by the corner (character capsule lets the mesh
  overlap the rock — character module).
- Near-plane cuts of non-convex props/stairs can show a 1–2 frame sliver while the camera crosses into them.
- Pinned at a wall the knight fills ~70–85 % of the frame height (2.3 m arm), by design.
- Machine load stretches the critics' drags up to 10× in wall time; behaviour is frame-rate independent.

## Round 6 changes (critic r5: 7.0 / 7.0)
- **Pitch caps**: user pitch −5°…45° (32° max at min zoom 3.5 m); the effective arm pitch (user + lift + short-arm
  raise) and the final aim are capped at 47° (40° when the free arm is < ~3.5 m). Min zoom 3.5 m.
- **Close framing**: below 6 m the aim moves to the actual character's body centre (feet + 1.0 m) instead of the
  lagging pivot → whole figure centred at min zoom / pinned, also running toward the camera. Feet tilt allowance grows
  at short range. Short arm: chest origin (−0.35 m) + up to +8° raise so the body stays in frame.
- **minArm 2.6 m**, head floor 1.8 m (normally 2.3 m). Near-plane guard 0.7 m (body) / 1.0 m (head); character fades
  only below 1.6 m from the head (practically never).
- **Blocker cutaway (buildings/props, box colliders)**: instead of dithering / near-plane slabs, three local clipping
  planes (clipIntersection) remove fragments that are on the camera side of the blocking face AND above the
  character's feet AND nearer than the character + 3 m. Applied to all built-in world materials (scan every 0.5 s),
  never to the character, ShaderMaterials or shadows. Terrain (hull colliders) keeps the near-plane fallback (cutting
  terraces exposes the void under hex columns). Showcase tavern dither removed.
- **Line of sight**: rays to head and hips (terrain lips at low pitch shorten the arm); thin occluders (trunks, poles)
  on those rays for > 0.25 s cap the arm in front of them. Stage foliage dither now reaches the character's depth.

## Round 7 changes (critic r6: 6.0 / 6.5) — integrator decision: the camera is never inside terrain/buildings
- Removed: the "keep minArm inside the blocker + near-plane cut" fallback, the building cutaway planes (and their
  material clipping), the stage's building dither, near-plane pushing (near fixed 0.1), the short-arm raise.
- Arm = longest clear arm (line sweep r 0.15 + camera sphere r 0.35 clear of terrain/buildings/props, thin trunks
  ignored); camera position is clamped to it every frame (the only instant correction). Pull-in otherwise ≥ 2 frames,
  ≤ 40 m/s; ease-out spring ω 6 with growth ≤ 6 m/s (no snap when leaving a wall). Yaw-rate prediction (0.25 s) starts
  pull-ins before an orbit sweeps the arm into a building.
- Pitch: lift ≤ +12° only for long arms when it buys ≥ 1.5 m more arm; effective cap 47°, flattening to 25° as the
  free arm shortens toward 1.1 m (over-the-shoulder, never helmet-top).
- Occlusion: head or hips hidden by a solid (corner, ledge, lip) for > 0.1 s → arm capped in front of it (pulled in
  over a few frames); thin trunks > 0.25 s → same, but never shorter than 2.6 m (closer trunks: foliage dither).
- Framing: < 6 m aim at the character (body centre → upper body at the shortest arm).
- Character fade: 1.6 m → 1.1 m from the head: 100 % → 45 % (depthWrite on: one translucent figure); below 1.1 m it
  fades out by 0.7 m. Pinned with no room behind (wall/cliff at the character's back: the camera sphere cannot fit
  between) the camera therefore ends at the head with the character hidden and looks along the user's view
  direction (an over-the-head glance) — clean, but the knight is not visible while pinned. Known trade-off.

## Round 8 changes — integrator option (c): slide sideways when pinned
- Pinned = clear arm at the user's yaw (incl. line of sight to head and hips) < 1.6 m. The camera then searches yaw
  offsets in 10° steps on both sides for the smallest one with ≥ 2.6 m of clear arm and sight to head + hips, eases it
  in (ω 10 ≈ 0.3 s), keeps it while it still has room (committed side, no churn), and returns (ω 5 ≈ 0.6 s) once the
  arm behind is ≥ 2.6 m — only while the next 15° step back keeps (nearly) the current arm, so it never sweeps through
  the blocker. Search goes to ±100° (deviation from the requested ±70°: a flat wall at the character's back is only
  resolved beyond 90°; ±70° only ever helps at edges/corners). No room anywhere → round-7 fade fallback.
- User drag: moves the view by exactly its own amount; the auto offset is folded into the user yaw proportionally to
  the drag (no jump) and is not re-acquired for 0.4 s.
- While a movement key is held and the character moves, the slide is frozen (the character module steers from the
  actual camera direction — re-aiming would turn the steering and loop). CORE_REQUESTS #6: steer from cameraRig.yaw.
- Occlusion: three sight lines (head, chest, hips) as small sphere casts (r 0.12, from 0.25 m out), so a knight at a
  cliff corner is caught; > 0.1 s hidden → pull in front of the blocker.
- Service: `cameraRig.yaw` stays the user's yaw; `debugState` / trace add the slide offset (trace columns 17/18).

## Round 9 changes (whole-game critic r1, camera 7.5)
- Canopy: no more pitch compression under crowns (it pressed the camera down among the bushes with the canopy filling
  the top of the frame); only the arm cap remains (≥ 3.5 m). Under canopy the camera keeps ≥ 2.0 m above the ground.
- Big bushes (nature plan, footR·s ≥ 0.55 m, height ≥ 0.6 m; no colliders) are soft blockers: an arm passing through
  one (farther than 2.2 m from the pivot) ends in front of it. Small bushes / grass stay with the nature cut-out.
- Camera clearance from solids 0.5 m (was 0.35); solids in view closer than 1.2 m to the lens step the arm back in
  0.5 m steps (pure function of the geometry along the desired arm — stable, no pumping).
- Solid-occluder pull-ins never closer than 2.0 m and not while airborne (a drop no longer collapses the camera onto
  the ledge); while dropping, the lift may go to +30° (still under the view cap) to look over the edge; prediction
  includes the fall.

## Round 10 changes (whole-game critic r2, camera 8.0)
- Bushes on the knight→camera line up to 5 m from the knight (incl. right in front of the knight, where the arm cannot
  get in front of them) raise the pitch just enough for the sight line to the chest to pass over the bush top
  (≤ +16°, eased in ω 4 / out ω 2, held 0.5 s, under the view cap). Bushes farther out keep the round-9 soft cap.
- Thin-occluder (trunk) pull-in allowed down to 1.7 m (was 2.6 m).
- No new sideways slide while airborne (a drop's ledge resolves as the pivot follows down).
- Removed the round-8 slide freeze (the character now steers from cameraRig.yaw).
- Known: a trunk standing within ~1 m of the knight on the sight line still covers part of the body while running
  past (the camera cannot get in front of it; nature's trunk cut-out is narrow) — nature-side request.

## Round 12 changes (whole-game critic r3, camera 6.5)
- Bushes are no camera blockers any more (no look-over tilt, no soft cap): the camera passes through low bushes;
  nature fades whole bush/trunk/rock/grass instances on the sight line / at the lens. Trunk pull-in floor 4.0 m,
  canopy arm floor 4.0 m (no more 2 m top-down in the forest; pitch stays ≤ 47° cap).
- Ground lift only where the ground under the camera is below the chest (r9's forest clause lifted the camera onto
  upper terraces).
- Final sight-line guarantee: chest centre, head, and chest ±0.3 m sideways → camera; any solid hit pulls the camera
  in toward the pivot in front of it (instant). The camera can no longer end behind a cliff corner/top.
- Sideways slide: also acquired during a drag while pinned (before, a drag in a concave cliff corner left the camera
  at the knight's head); candidates must keep the camera ≥ 1.1 m from walls (no grazing views); search ±170°.

## Round 13 (bug fix: sky view when squeezed in a concave corner)
- The aim never points more than 6° above the horizon; a degenerate aim (camera right above/at the knight) looks
  down at his chest instead of along an undefined direction.
- Squeezed (camera < 1.8 m from the head): eased, collision-checked raise up to 0.9 m above the head, limited so the
  view is never steeper than 50°.
- Final sight-line check skips side samples that lie inside a wall the knight leans against (they pulled the camera
  into the knight even when the sideways slide had found room).

## Round 14 (whole-game critic r4: collapse to the pivot at buildings/props)
- Buildings / props (box colliders) no longer trigger the sideways slide, the occluder pull-in or the final sight-line
  pull-in (those are terrain-only now). At them the boom never goes below minBoom 2.6 m; the camera pitches up to 18°
  over the building first (≤ view cap); whatever building/prop is still between camera and knight is cut by the near
  plane (never the knight: ≥ 0.7 m / head 1.0 m in front of him; ground guard). Terrain rules unchanged (never inside).
- Known: the near-plane cut can show a cut slab of a prop / forge in the foreground for a moment. A proper fade of the
  occluding building instance needs a hook from villages/props (per-instance alpha like nature's) — not available.

## Round 15 — KFB ground-controls canon (W/S fwd/back · A/D turn · Q/E strafe · RMB drag camera · wheel zoom)
- The camera no longer steers. Chase mode (default): yaw = eased heading+π (ω 4 ≈ 0.4 s lag) + RMB orbit offset.
  The offset is held while the player stands still and eases back (ω 3.5 ≈ 0.8 s) once he moves and the right
  button is released. `?controls=legacy` keeps the old user-yaw orbit (character steering from cameraRig.yaw).
- `cameraRig.yaw` = the effective view yaw (readable); `setOrbit({yaw})` sets it as an orbit offset (chase mode).
- Buildings/props are faded by core (src/core/fade.ts); the near plane only cuts a blocker within 0.6 m of the lens.
  Min boom 2.6 m at buildings, all terrain rules unchanged.
- Interim: until the character module stops steering from cameraRig.yaw, chase mode + old character can loop
  (e.g. S turns the knight, the chase yaw follows the new heading); use ?controls=legacy until it lands.
- Round 16: the chase follows `player.yaw` (canon steering heading; A/D turn it), not the body facing `heading`
  (differs on W+Q/E diagonals / strafe clips). Chase/legacy mode follows `player.controls`.

## Round 17 (critic r5 #1: forest-edge collapse)
- Round colliders (nature trunks, rocks, stumps; barrels) are never camera blockers any more (whole-instance fades
  handle them); only terrain hulls, buildings and box props shape the arm. A rock had triggered the terrain-only
  sight-line pull-in → camera ~0.5 m above the helmet.
- Under canopy (eased): pitch ≤ 35°; a long zoom lowers the pitch (down to 6°) so the arm stays under the crowns,
  then the arm shortens (≥ 4 m). Wheel zoom therefore always changes the distance.
- Slide side switches cut to the new side instead of sweeping the camera through the blocker/knight.

## Round 18 (critic cam_r6: inner cliff corner west of the blacksmith, seed 97 ~(−179.6, 16.7))
- Terrain never brings the camera closer than minBoom (2.8 m) to the pivot: the final sight-line guarantee now uses
  sightFrac (chest, head, chest ±0.3 m rays); if pulling in would end below minBoom it searches a higher pitch
  (6°…≤ viewCapFar) with a clear arm + clear sight and holds it (rimLift, 0.6 s) instead of collapsing.
- Edge guard: the view yaw (RMB drag, chase turn, quantised slide goal) never rotates from a yaw with room into
  terrain that would cut the arm below minBoom — it stops at the edge of the open sector (while walking only for the
  first moveHold 1.2 s). A drag pushing into terrain no longer acquires a new slide on the far side (was a 150°+ jump
  mid-drag); once the user yaw itself is clear on the other side the view cuts there (one pop, standing only).
- Slide thresholds: pinArm 2.8 (was 1.6), slideArm 3.3 (was 2.6), search ±350°.
- Walking: the slide offset returns behind player.yaw as soon as the arm behind is clear (cut if the way round is
  blocked); if still blocked it is held ≤ 1.2 s, then rotates back step-wise through clear yaws only.
- Known: dropping off a 2.5 m ledge with the face directly behind the knight still pulls the camera to ~1.3 m from the
  head for ~0.8 s on landing (no clear pitch ≤ cap over a face 0.5 m behind him); the side pop when dragging past a
  cliff (≈120–170°) is inherent to "never through terrain".
