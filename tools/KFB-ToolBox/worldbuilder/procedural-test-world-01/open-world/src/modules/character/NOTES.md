# character — NOTES

Player character: Rapier kinematic capsule + KCC, foot-contact-matched locomotion, jump state machine,
six KayKit adventurers switchable in place. Files: `index.ts` (GameModule), `player.ts` (controller + animation
state), `anim.ts` (clip measurement + pose applier), `showcase.ts` (test course, presets, fallback camera),
`scripts/*.json` (real-input shoot scripts).

## Public API (`services.get('player')`)
`position` (visual feet position, interpolated), `velocity`, `grounded`, `gait` (`idle|walk|run|back|strafeL|strafeR|jump|fall|land`;
canon: `walk` = jog Running_A, `run` = sprint Running_B),
`heading` (rad, model facing, forward = (sin h, 0, cos h)), `yaw` (rad, same convention: the control heading the
camera should follow — equals `heading` except in diagonals and strafes, see Controls), `controls` (`canon|legacy`), `root` (THREE.Group of the visible model — the camera fades it),
`spawn(x,y,z,heading?)`, `setCharacter(name)` (`Knight|Barbarian|Mage|Ranger|Rogue|Rogue_Hooded`, case-insensitive),
`debugState()` → `pos, vel, speed, grounded, gait, clip, timeScale (always 1), character, footSlip, footY, slip
(per-gait session [avg, max] of planted-toe slip; key with "~" = transition), state, lw (idle/walk/run weights),
heading, yaw, controls, keyGait, w (clip weights), gaitSpeeds, entry`; lw now has 6 entries
[idle, walk, run, back, strafeL, strafeR]. Debug: `clipCurve(name, n, pack)` samples any pack clip (root/hips/toe heights).
Events: `player:moved` (every frame), `player:gait` (on change), `player:switched`.
Keys: the KFB ground-controls canon (below); `?controls=legacy` = old camera-relative WASD (run default, Shift walk).

## Controls — KFB ground-controls canon (default)
W/S forward/back · A/D turn · Q/E strafe · Shift run · Space jump (RMB orbit / wheel zoom belong to the camera).
The character owns the heading: `yaw` turns with A/D at 3.0 rad/s (≈ 172°/s), eased in 0.12 s, integrated in the 60 Hz
step; W/S/Q/E move relative to it; `cameraRig.yaw` no longer steers (legacy only).
Clips, all at natural rate (measured at CHAR_SCALE 0.75, planted-toe speed):
| key | gait | clip | m/s |
|---|---|---|---|
| W | jog (walk slot) | Running_A | 2.49 |
| Shift+W | sprint (run slot) | Running_B | 4.39 |
| S | back | Walking_Backwards (MovementAdvanced) | 0.56 |
| Q / E | strafeL / strafeR | Running_Strafe_Left / _Right (MovementAdvanced) | 3.32 |
- Facing rule: the body turns so the clip's MEASURED travel direction points exactly along the requested movement.
  Forward gaits face the movement (W+Q/E diagonals: body faces the diagonal, ±45° off `yaw`); backwards faces away
  from it; the strafe runs' feet travel ±60° off model forward (measured axis (±0.87, 0.50)), so the body turns 30°
  into the strafe and the knight moves exactly sideways. Q/E are mapped to whichever clip measurably travels left/right.
- Standing A/D = the existing stepping turn on the spot (foot locks, no slide). Directional gaits (S, Q, E) start only
  once the body has turned to within 0.03 rad (`TURN_GO_DIR`; they would pivot against a planted foot) and hold the
  facing while fading out, then turn back on the spot.
- Transitions: idle ↔ back/strafe and jog ↔ back/strafe crossfade 0.2 s (`FADE_DIR`) with the incoming clip
  phase-matched to the planted foot; a sprint goes down to the jog first. Root motion of any blend containing a
  directional clip = `plantedMotion2D` (planted toe of the blend fixed in both model axes; strafe runs pick the
  planted foot from their measured stance flags; flight phases move at the blend's measured velocity).
- Jumps from every mode: backwards/strafe jumps keep the actual horizontal velocity; air steering uses the mode's
  natural speed; landings blend straight back into the held mode.
- The foot-slip probe now uses the body's actual travel direction for its swing test (backwards/strafe).
Measured (real keys, showcase, `canon_suite.mjs`; worst 0.2 s window, m/s): jog start+stop 0.11; sprint start+stop
0.11; sprint → jog 0.10; jog → back 0.27; back start+stop 0.21; strafe L/R start+stop 0.25 / 0.09; W+E diagonal 0.16;
jog → strafe 0.09; D turn in place 180° 0.00; A tap turn 0.00; jog turning with D 0.15; sprint turning with A 0.09;
standing jump 0.00; jump from jog 0.09 / sprint 0.10 / back 0.29 / strafe 0.08; jog / sprint into a wall: wall stop,
0.08–0.15. timeScale deviation 0 throughout, 0 spikes. Legacy suite unchanged (`?controls=legacy`).


## Travel tempo (Georg's requirement) — option (a): RUN is the default gait
Measured on the real skeleton at CHAR_SCALE 0.75 (figure ≈ 1.9 m incl. helmet; legs are chibi-short: hips 0.29 m).
Natural speed = mean of the foot-contact root-motion curve (see below).

| clip | m/s | body-lengths/s | 60 m | 90 m | 120 m | planted-toe drift / stance at constant speed |
|---|---|---|---|---|---|---|
| Walking_A | 0.661 | 0.35 | 91 s | 136 s | 182 s | 5.1 cm |
| Walking_B | 0.955 | 0.50 | 63 s | 94 s | 126 s | 6.4 cm |
| Walking_C | 0.449 | 0.24 | 134 s | 200 s | 267 s | 3.2 cm |
| Running_A | 2.49 | 1.31 | 24 s | 36 s | 48 s | 0.7 cm |
| Running_B | 4.30 | 2.26 | 14 s | 21 s | 28 s | 3.9 cm |

Targets: run ≥ 3.5 m/s (90 m ≤ 25 s) → only Running_B qualifies. Walking ≥ 1.5 m/s → no walk clip qualifies.
So: **W alone runs (Running_B, 4.30 m/s), Shift walks (Walking_B, 0.955 m/s)**. Config: `GAIT_CONFIG` in
`player.ts` (`default: 'run' | 'walk'`, `walkClip`, `runClip`); URL `?gait=walk` flips it (W walks, Shift runs);
`?walkClip=` / `?runClip=` pick other MovementBasic clips (always re-measured, never stretched).
Option (b) rejected: walking at 1.5 m/s would need CHAR_SCALE × 1.57 → Knight ≈ 3 m vs door ≈ 2.4 m. No core request.

## How "no foot sliding" is done (round 4)
1. At load every loop clip is sampled (128 samples) on a private clone at CHAR_SCALE: toe tracks (model-space x, z,
   height), stance flags, plant phases, contact speed curve; Jump_Start's deepest crouch time.
2. **Planted-foot root motion** (`plantedMotion`): the planted foot of the CURRENT BLEND (lowest blended toe, on the
   ground; a low toe moving forward is swinging) stays fixed in the world; the body moves accordingly (steady gaits and
   every crossfade). No foot down = flight -> contact curve. Ground speed capped at 1.05 x run speed (also the
   step-up's look-ahead), `debugState().spikes` counts violations (0 in all runs). Loop clips (idle, walk, run) ALWAYS play at
   timeScale 1.0 (r3: no stretched or slowed clip anywhere; the gait is chosen from the actual speed instead).
3. **Visual leg IK** (`ik.ts`, `feetIK`): analytic two-bone IK after the mixer pose.
   - Foot locks while standing/stopping: each ankle (position AND yaw) stays where it was put down; when the
     animated foot drifts > 5.5 cm or > 0.45 rad from it, the foot takes a quick lifted step (0.13 s, 7 cm lift).
     Turning on the spot = stepping, not a turntable; the run plant-stop keeps the planted foot fixed while braking.
   - Landing dip at speed (pelvis drops ~7 cm for 0.24 s, feet stay on their targets).
   - Slopes: feet follow the ground under them, the pelvis drops for the lower foot (<= 20 cm).
4. Transitions: from a stand a short press is one small half-weight step; a held key goes walk -> run
   (plant-matched). Run -> walk (Shift) blends 0.3 s through the matched phase without stopping.
   **Run stop (r3, `RUN_STOP_MODE = 'walk'`)**: speed-matched blend run → walk → idle, both clips at their natural
   rate. On the next run foot plant the walk starts at the phase whose planted toe is at the same spot and blends in over
   0.3 s (`RUN_TO_WALK`, the same matched blend as Shift); body speed follows the blended planted toe 4.4 → ~1 m/s. Then
   the walk → idle stop settles on the next plant (fade 0.2 s). Release → idle ≈ 0.6-0.9 s.
   **Gait from actual speed (r3)**: a run held below 75 % of run speed by an obstacle for 0.2 s becomes a walk at its
   natural rate (`THROTTLE`, `debugState().throttled`); back to run once the contact has been gone 0.4 s. Held below
   0.15 m/s by a steep contact for 0.12 s → idle (`BLOCK_FAST_T`). A stop that meets an obstacle (no net progress:
   < 5 cm in 0.15 s, or a steep contact) settles to idle at once instead of walking in place against it.
   (r2's decel slowed the run clip to 0.35 for the stop; a resume during it left the run stuck at 0.35 — critic r3.)
   The hard plant-stop is kept as `RUN_STOP_MODE = 'plant'` (0.1 s brake + Jump_Land squat).
   Walk -> idle: waits until the planted toe is 0-8 cm ahead of its idle spot (other foot in the air), fades 0.2 s.
5. Turning: standing turns rotate at <= 7 rad/s with stepping feet; the gait starts once within 1 rad (rest of the
   turn pivots on the planted toe while walking/running, <= 9 rad/s). Taps < 0.25 s only turn. Running reversal
   (> 130 deg): plant-stop, stepping turn, go — ~0.45 s to moving again, ~0.6 s to full speed.
6. Jumps (running take-off: the push-off part of Jump_Start from its deepest crouch, already airborne, then
   Jump_Idle; landing at speed: 10 cm IK dip over 0.28 s + upper-body Jump_Land beat 0.8). Standing (r3) — Jump_Start from its first frame; the take-off impulse waits until ≥ 40 % of the clip has played and
   just past its deepest crouch (`JUMP_HOLD`; 0.6 s clip, crouch 0.267 s → take-off ≈ 0.30 s).
   Running/falling — air pose is Jump_Idle (frozen legs) with an upper-body forward lean (spine, up to 0.3 rad by
   speed). 1.3 x gravity while falling. ~0.05 s before contact the pose blends into the gait at a foot plant; landing at
   speed adds the IK dip + upper-body Jump_Land beat; momentum is kept with keys released, then the normal plant-stop.
7. Ledges: support = ray from the capsule centre (<= 0.5 m drop); none -> fall pose at once.
8. Obstacles: any contact too steep to climb (normal tilt > 35°, so rock flanks/rims count, not just vertical faces)
   projects the move onto the contact tangent with a sticky rotational side. Round shapes and small obstacles
   (cuboid half-extent < 1.5 m, hull footprint < 3 m: anvils, crates, rocks, trunks) are always slid round, head-on
   with a deterministic side; only big flat walls within 10° of head-on stop the character (facing them). Step-up
   handles ≤ 0.45 m. A stall watchdog sidesteps if the character is still blocked > 0.2 s with a key held
   (`debugState().stallFix` counts it; 0 in all test runs).
**Jump apex fix (r4)**: (1) three's mixer only rewrites a bone whose mixed value changed; the air lean, landing beat
and leg IK edit bones relative to their current rotation, so with a held clip pose (Jump_Start's end during a running
jump) the spine lean stacked every frame (7° → 55° in four frames before the apex, then a snap back to 10° when the
apex crossfade changed the values: the "double motion / flicker"). Every procedurally edited bone is now restored to
its mixer value before the next pose update (`procBase`): lean 7° → 16° smoothly, max change per frame 44° → 6.7°.
(2) Jump_Start's clock is interpolated with physics.alpha like the body (it stalled on 73–85 % of render frames during
the take-off at 60 fps). Measured: no root motion in any jump clip; Jump_Full_Short/Long are the same keyframes as
Jump_Start + Jump_Idle + Jump_Land concatenated (short: take-off ≈ 0.27–0.30 s, ≈ 0.41 s airborne; long: ≈ 1.55 s
airborne), so they bring nothing new and would force a 0.8 m or ≈ 11 m jump to match their air time — not used.
**Concave corners (r4, critic #2, seed 97 house at (−169.35, 44.13))**: the knight wedged into a 0.49 m gap (post +
low box) at a house corner. Fixes: (1) a start from a stand sweeps the capsule 8 cm along the (wall-projected)
direction first (`sweepBlocked`, lifted by the step-up height); blocked → no start, only the turn (`startBlocks`) —
pressing into a corner now stands still with 0 slip instead of skating 0.6-0.9; (2) "blocked" counts only when the
KCC refuses a real request (< 40 % of ≥ 0.2 m/s), so slow starts (the back walk, 0.1 m/s) are not cancelled; (3) the
2D root motion of a crossfade never pushes against the travel direction while touching an obstacle (idle → backwards
first asked for a forward step into the wall). Result (real keys, 4 approaches): S always walks out, W+A / W+D always
slide out, Q/E out along the free side; only inputs pointing into the pocket stop (allowed: "pressing into the corner").
9. **Wall stop (r2)**: running/walking toward a big flat wall (same rule as above: not small/round, too steep, within
   10° of head-on; two rays at 0.55 m and 1.2 m so ≤ 0.45 m steps and crates don't count) within
   `RADIUS + 0.1 + speed × 0.55 s` starts the normal run → walk → idle stop early, so the character comes to rest at the wall
   (`WALL_SETTLE` 0.3 m: fades to idle without waiting for a plant). Landing against a wall / any `flatStand` contact
   does the same at once — only when actually moving into the wall; turning the input into a wall while running along it
   uses the normal stop (r3). A flat-wall stand turns the character to face the wall (below 1 m/s, vertical walls only). `debugState().wallStops`.
   Starting from a stand at a wall: the stored wall is re-checked (ray) when the wish points into it, so a diagonal
   press slides along it from the first frame, and the on-the-spot stepping turn finishes to 0.35 rad (`TURN_GO_WALL`,
   instead of 1 rad) before the gait starts — a walking pivot there would push the body into the wall (blocked ->
   planted foot slips; was 0.5-1.06 m/s, now 0.15-0.21 over 4 runs of the `wall` script).
   (Before: run weight was scaled by achieved/requested speed in one frame — a run -> idle pose pop at the wall, then
   flatStand toggling made it flicker run/idle at ~20 Hz with up to 1.3 m/s slip. That scaling is now rate-limited.)
**Slide direction (r2 bridge fix)**: a slide never points against the input (the sticky rotational side is
   flipped when its tangent points backward — it came from an earlier contact and sent the knight 120-150° off course
   along a river bank), and never turns more than 60° away from the input (`SLIDE_MAX_COS`; near head-on the KCC slides
   the rest). Near head-on (< ~20°) the side is chosen toward the knight's offset from the obstacle's centre (short way
   round). `debugState().slideDevDeg` = largest deflection since load; `player.contactTrace = []` logs steep contacts.
10. **Blocked idle (r2)**: keys held but horizontal speed < 0.15 m/s for > 0.2 s after the watchdog already tried (or
   a flat wall head-on) -> the gait goes to idle (normal plant-matched stop, no running in place). Released when the
   keys are released or the wish direction turns > 20° away from the blocked direction. Covers river edges, cliffs,
   any wall. `debugState().blockedIdle` / `blockedIdles`.

Measured footSlip (planted toe, worst 0.2 s window, m/s, real input, headless M1 Max, r3, showcase on seed 97's site):
walk start+stop 0.05-0.07; run -> walk via Shift 0.09-0.10; run start+stop (run → walk → idle) 0.06-0.15; run reversal
0.20-0.26; walk reversal 0.12-0.13; tap-turn 180 deg 0.00; tap-turn 90 deg 0.05-0.06; running jump+land 0.16-0.43 (lands
at the 0.4 m step edge on this site); standing jump 0.00; run jump releasing keys in air 0.08-0.19; start against facing
0.09-0.20; Shift late/early 0.06-0.08. Scripts: wall 0.14, slide 0.06 (after the r3 run-along fix), hop 0.27, step 0.29.
Max timeScale deviation from 1.0: 0 in every run.
**Probe change (r2):** `probeFeet` no longer counts a low toe that moves forward relative to the body (same rule as
`plantedMotion`). Running_B's swing toe dips to 3.2 cm at phase 0.27-0.28 just after the stance toe lifts, and the old
probe reported its swing speed (~3 m/s for 1-2 frames) as slip — that was the intermittent 1.0-1.14 "run start+stop"
and 0.5-0.6 "Shift to walk" values. Limitation (pre-existing): the run stance toe rolls at > 0.3 m/s vertically except
near its lowest point, so steady-run slip is sampled sparsely; side/feet sheets are the main run evidence. Forest steering in game mode (seeds 1337/7/42): max ground speed 4.61, 0 spikes, mean footSlip 0.003-0.02.

## Boot / precomputed measurements
- `init()` loads only the Knight + the two animation packs it uses (General, MovementBasic) and reads the clip
  measurements from `measures.gen.ts` (generated: open `/?showcase=character&charMeasure=1`, take
  `window.__kfbCharacterMeasureDump`, write it as `PRECOMPUTED`). At boot each used clip is validated (CHAR_SCALE and
  clip duration must match, every clip must bind ≥ 95 % of tracks to the Knight); a stale/missing entry is re-measured
  at runtime with one console.warn.
- The other 5 characters start loading right after init (not awaited), so their GLTF parse (50–160 ms each) falls
  into the boot/loading phase; each is warmed (compileAsync of skinned + shadow programs, initTexture of its maps).
  Measured: all 5 loaded+warmed before `ready`; a switch then costs 1.4–3.5 ms (`debugState` → `loadLog`); a run
  switching 1→6 at 1 s intervals 3 s after ready + a switch at 10 s had the same frame-time profile as a run without
  switching (67 vs 67 frames > 33 ms under machine load ~31, max 50 ms both). Keys pressed earlier load on demand.
- init no longer calls `world.heightAt()` (the first height query builds the world model, ~2–15 s under load); the
  default spawn height is resolved on the first frame. `debugState().initMs` shows the init phases.
- Measured `stats().boot['init:character']`: before 12 498 ms; after 46–83 ms (`/`, `/?seed=42`, showcase).

## Controller
Capsule r 0.30, half 0.55 (1.74 m), KCC offset 0.02, max climb 35°, slide 45°, snap-to-ground 0.35 m (off in the
air), filters `PLAYER_GROUPS` + `EXCLUDE_SENSORS`. Head-bump = upward ray hit only. Input direction uses
`ctx.getCameraOverride()` when a preset is active (else `ctx.camera`).
- Grounded moves are purely horizontal (a downward component made Rapier 0.21's KCC stop dead on flat hulls:
  first cast hits the floor at toi≈0 and the remainder is dropped — measured).
- Small steps (≤ 0.45 m) use our own step-up (up-cast, forward-cast, down-cast, walkable-normal ray; r3: it advances at
  most 1 cm beyond the requested move, so a slow walk rolls up over a lip instead of an 8 cm one-frame burst), only against
  non-walkable contacts. Rapier's autostep proved unreliable here (capsule creeps up hull risers; KayKit tile hulls
  also have a 45° top bevel that reads as a too-steep slope). The vertical pop is hidden by a decaying visual offset.
- Spawn: never inside a collider (capsule overlap test, raised in 0.25 m steps); holds still until ground exists
  under it (chunk not built yet). Fell > 25 m below `heightAt` → placed back on top.
- Default game spawn: first frame, if nobody called `spawn()` and there is no `demo` service → origin on `heightAt(0,0)`.

## Character switching
All six GLBs load in the background after init and their materials are pre-compiled (`compileAsync`). The pose
state (clip clocks + weights) lives in `Player`, so a switch applies the identical pose to the new skeleton.
Bind check: every clip binds 100 % of its tracks on every character (warns if < 95 %).

## Hand items (r2, visual only)
KayKit Adventurers item gltfs in `items/` (copied, ~260 KB) are attached to the `handslotl`/`handslotr` bones in
`attachItems()`. Default set = only items that never clip in run/jump/landing (checked on side sheets): Knight
shield_badge_color, Barbarian shield_round_barbarian, Mage spellbook_closed (left hand). Ranger/Rogue/Rogue_Hooded carry
nothing. The long weapons (sword, axe, staff, bow, daggers, crossbow) cut into the ground in the landing crouch and
through crates mid-jump, so they are opt-in: `?items=all`. `?items=0` disables items. See CORE_REQUESTS #5 for moving
the files to `public/assets`.

## Showcase `/?showcase=character` (uses terrain + camera)
Finds a flat site (all cells within 2 hexes on one level); O = that cell's centre, spawn at O−4 m facing +X.
Lane along +X with rock/tuft markers 1.6 m behind it. Crates: 3×2 big KayKit crates (≈ 2.8 × 1.9 m, 0.95 m high,
one box collider) on the lane at O−10 (hop on / run off). Cliff: hex tile one level (3.75 m) up at O−30, ramp
(hex_grass_sloped_low) on the cell SE of it. 0.4 m step plateau: hex at O+15 (west edge at O+7.5). Stone fence 5 m
north of the lane (slide). Raised tiles use clean hex-prism colliders.
Presets: `character.side` (looks −Z, D crosses left→right), `character.feet`, `character.front`, `character.course`,
`character.crates` (static side view of the crate block), `character.step` (static side view of the step edge),
`character.cliff` (static view of the cliff face).
The fallback follow cam runs only in `?showcase=character` and only without a `cameraRig` service.
Scripts (`src/modules/character/scripts/`): `stops` (run stop, walk stop, 150 ms taps, run reversal), `hop` (hop
onto crates, run off the ledge, walk-jump), `cliff` (crate hop, cliff jump refused, slide along cliff), `step` (0.4 m
up/down), `jump`, `ramp`, `slide`, `switch`, `feet_walk`, `feet_run`, `side_walk`, `side_run`, `wall` (run head-on
into the cliff and keep A held 5 s -> wall stop + idle; then A+W slides along it).
Use `--sheetCrop 600` for feet-sized contact sheets.

## Known issues
- Walk body speed surges within the step (0.3–1.5 m/s) because it follows the clip's foot contact exactly.
- Walking_B (0.955 m/s) is the fastest KayKit walk; it reads as a small brisk step on a chibi rig (legs 0.29 m).
  Not stretched (±10 % rule); run is the default gait for travel.
- Chibi legs are short (thigh 0.17 + shin 0.11 m): foot locks/IK have only ~0.1 m horizontal reach, so stepping and
  the plant-stop are tuned tight (5.5 cm step threshold, 0.1 s brake).
- A stepping turn while pressed against a wall slips (≈ 1.5 m/s for ~0.3 s): the pivot translation is blocked.
- The landing prediction sweeps the capsule; contact much earlier than predicted (odd geometry) gives a brief slip.
- Running uphill keeps surface speed (horizontal ≈ 0.8–0.9 × run speed) — physically right, not tuned per slope.
- Other agents' HMR reloads can interrupt long shoot scripts (positions jump back to spawn mid-log).
- Standing turn > ~120° straight into a walk: the gait starts within 1 rad of the goal while the standing-turn foot
  locks release (6/s), ~0.35-0.66 m/s planted-toe slip for ~3 frames (hop script). Pre-existing (1.2-1.6 before r2).
- The knight's helmet can touch a wall face when standing against it (capsule r 0.3 m < helmet half-width).
- River edges were verified on seed 123 before the rivers module's current rebuild (0 run-in-place frames); the river
  layout has changed since, so that probe no longer hits water — the wall stop/blocked idle is verified on the cliff.
- `scripts/ramp.json` no longer reaches the ramp (its path ends near O−13 while the ramp is beside the cliff at O−30;
  stale since an earlier showcase layout change) — it currently tests flat running only.
- Player-only river-bank colliders (group 0x0008, roads/rivers) overlap the bridge ramp footprint (seed 1: a 1.5 × 1.6 m
  hull at x 346.6-348.1, z 266.0-267.6 sits on the first ramp segment). The character now goes round it the short way.
- Ramp hex overhang near (−150, −17.3) on seed 97 (capsule head under a 1.57 m lip; terrain is fixing it): pressing
  into that corner still gives up to ~0.95 slip.
- Canon: Walking_Backwards' toe lands with ~0.6 m/s horizontal motion for one frame per step (worst window 0.21–0.29).
- Canon: the new clips (Walking_Backwards, Running_Strafe_*) are measured at boot (+~20 ms), not yet in
  `measures.gen.ts` (regenerate with `?charMeasure=1`).
- Canon: the demo route scripts are camera-relative (legacy); they run with `?controls=legacy` (bridge 97 checked)
  until the demo regenerates them.
- Concave corners: turning while scraping out along a post (W+A/D, D-then-W) still shows 1.2–2.2 m/s slip for ~0.2 s
  (same as before the corner fix).
